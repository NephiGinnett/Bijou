// ============================================================
// GATEBOUND — UI screens & game flow orchestration
// ============================================================

import { RANKS, RANK_STYLE, HEROES, SKILLS, STATUSES, ITEMS, BIOMES, GATE_MODIFIERS, AFFIXES, xpToNext, heroStatsAt, gearScore, shopStock, GATE_GP, recruitOffers, reforgeCost, reforgeGear, ROLE_INFO, heroDesc } from './data.js';
import * as ST from './state.js';
import { Combat } from './combat.js';
import { Stage, makePortrait } from './scene3d.js';
import { EVENTS, SPEAKERS, DUNGEON_EVENTS, pickGuildEvent, pickCampEvent, endingFor, weddingFor, pickRumorEvent, rumorLine } from './story.js';
import { openSanctum } from './sanctum.js';
import { parseCharacter, summonHero, releaseHero, restoreCustomHeroes, registerCustomHero, setVisualHook } from './forge.js';
import { registerCustomActor, ACTOR_ACCENTS } from './actors3d.js';
import * as AU from './audio.js';

let S = null;
let stage = null;
const PORTRAITS = {};

const $ = sel => document.querySelector(sel);
const el = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let advanceHandler = null;

// ------------------------------------------------------------------
// boot
// ------------------------------------------------------------------

export async function boot() {
  window.__FAST = new URLSearchParams(location.search).has('fast');
  // forge.js is pure data; the UI supplies the 3D registration
  setVisualHook(def => {
    registerCustomActor(def.id, def.spec);
    ACTOR_ACCENTS[def.id] = def.spec.accent ?? 0x8fa3bf;
  });
  stage = new Stage($('#c3d'), $('#fx-overlay'));
  stage.setBiome(null);
  stage.start();
  window.GAME = { get S() { return S; }, stage, ST, PORTRAITS };

  document.addEventListener('pointerdown', () => AU.unlock(), { once: true });
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && advanceHandler) { e.preventDefault(); advanceHandler(); }
  });

  // portraits (placeholder renders; swap in automatically if GLBs exist)
  PORTRAITS.__key = 'adventure|';
  Promise.all(Object.keys(HEROES).map(async id => {
    PORTRAITS[id] = await makePortrait(id);
  })).then(() => { document.querySelectorAll('img[data-portrait]').forEach(img => { const k = img.dataset.portrait; if (PORTRAITS[k]) img.src = PORTRAITS[k]; }); });

  const saved = ST.load();
  title(!!saved);
}

function screen(html, cls = '') {
  const u = $('#ui');
  u.className = cls;
  u.innerHTML = html;
  return u;
}
function toast(msg, cls = '') {
  const t = el(`<div class="toast ${cls}">${msg}</div>`);
  $('#toasts').appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 2200);
}
function portraitImg(id, cls = '') {
  const src = PORTRAITS[id] || '';
  return `<img class="portrait ${cls}" data-portrait="${id}" src="${src}" alt="">`;
}
function rankBadge(rank, cls = '') {
  const st = RANK_STYLE[rank];
  return `<span class="rank-badge ${cls}" style="--rc:${st.color};--rg:${st.glow}">${rank}</span>`;
}
function heartsFor(girl) {
  const b = S.bond[girl] ?? 0;
  let out = '';
  for (let i = 0; i < 5; i++) out += `<span class="heart ${i < Math.round(b / 2) ? 'full' : ''}">♥</span>`;
  return `<span class="hearts" title="Bond ${b}/10">${out}</span>`;
}
function affixChip(g) {
  const a = g && g.affix ? AFFIXES[g.affix] : null;
  return a ? `<span class="affix" title="${esc(a.desc)}">◆ ${esc(a.desc)}</span>` : '';
}
// Outfit variant token for a hero, from the attire setting (+ Yuki's reclassification).
function heroVariant(id) {
  const outfit = (S && S.settings && S.settings.outfit) || 'adventure';
  const femme = id === 'yuki' && S && S.flags && S.flags.yuki_femme;
  if (outfit === 'formal') return femme ? 'fem_formal' : 'formal';
  return femme ? 'fem' : null;
}

// Regenerate the 2D portraits whenever their look changes: the party
// attire setting, or Yuki's reclassification. Cheap no-op otherwise.
async function refreshPortraits() {
  const key = ((S && S.settings && S.settings.outfit) || 'adventure') + '|' + (S && S.flags && S.flags.yuki_femme ? 'f' : '')
    + '|' + (S ? Object.keys(S.custom || {}).length : 0);
  if (PORTRAITS.__key === key) return;
  PORTRAITS.__key = key;
  await Promise.all(Object.keys(HEROES).map(async id => {
    PORTRAITS[id] = await makePortrait(id, heroVariant(id));
  }));
  document.querySelectorAll('img[data-portrait]').forEach(img => {
    const k = img.dataset.portrait;
    if (PORTRAITS[k]) img.src = PORTRAITS[k];
  });
}
// Yuki's portrait switches to the reclassified render once his arc completes.
async function ensureYukiPortrait() { return refreshPortraits(); }

// ------------------------------------------------------------------
// dialogue player
// ------------------------------------------------------------------

function subName(text) { return text.replaceAll('{name}', S ? S.name : 'Rook'); }

export function playEvent(ev) {
  return new Promise(async resolve => {
    if (!ev) return resolve();
    if (ev.once && S.seen[ev.id]) return resolve();
    if (ev.id && ev.id !== 'banter') S.seen[ev.id] = true;

    const layer = el(`<div class="dialogue-layer">
      <div class="dialogue-box">
        <div class="d-portrait"></div>
        <div class="d-main">
          <div class="d-name"></div>
          <div class="d-text"></div>
          <div class="d-choices"></div>
        </div>
        <div class="d-hint">▸ click / Enter</div>
      </div>
    </div>`);
    document.body.appendChild(layer);

    const steps = ev.steps.slice();
    let idx = 0;

    const showStep = async () => {
      while (idx < steps.length) {
        const st = steps[idx];
        // intimacy variant lines: show only the tier matching the player's setting
        if (st.spice && st.spice !== (S.settings.spice || 'gentle')) { idx++; continue; }
        if (st.flag) { S.flags[st.flag] = true; idx++; continue; }
        if (st.give) {
          if (st.give.gold) { S.gold += st.give.gold; toast(`+${st.give.gold} gold`, 'gold'); }
          if (st.give.item) { S.inventory[st.give.item] = (S.inventory[st.give.item] || 0) + 1; }
          idx++; continue;
        }
        if (st.choice) { renderChoice(st); return; }
        renderLine(st); return;
      }
      cleanup();
    };

    const cleanup = () => {
      advanceHandler = null;
      layer.remove();
      ST.save(S);
      resolve();
    };

    const renderLine = (st) => {
      const sp = SPEAKERS[st.s] || SPEAKERS.narr;
      const box = layer.querySelector('.dialogue-box');
      box.classList.toggle('narr', st.s === 'narr');
      box.classList.toggle('sysline', st.s === 'sys');
      layer.querySelector('.d-name').textContent = subName(sp.name);
      layer.querySelector('.d-name').style.color = sp.color;
      const pEl = layer.querySelector('.d-portrait');
      pEl.innerHTML = (PORTRAITS[st.s]) ? portraitImg(st.s) : '';
      pEl.style.display = PORTRAITS[st.s] ? '' : 'none';
      layer.querySelector('.d-choices').innerHTML = '';

      const textEl = layer.querySelector('.d-text');
      const full = subName(st.t);
      let ci = 0, done = false;
      textEl.textContent = '';
      const speed = (window.__FAST || S.settings.textFast) ? 0 : 14;
      const timer = speed === 0 ? null : setInterval(() => {
        ci += 2;
        textEl.textContent = full.slice(0, ci);
        if (ci >= full.length) { clearInterval(timer); done = true; }
      }, speed);
      if (speed === 0) { textEl.textContent = full; done = true; }

      const advance = () => {
        if (!done) { if (timer) clearInterval(timer); textEl.textContent = full; done = true; return; }
        AU.sfx('ui');
        idx++;
        showStep();
      };
      advanceHandler = advance;
      layer.onclick = advance;
    };

    const renderChoice = (st) => {
      layer.onclick = null;
      advanceHandler = null;
      const box = layer.querySelector('.d-choices');
      box.innerHTML = '';
      for (const c of st.choice) {
        const b = el(`<button class="choice-btn">${esc(subName(c.t))}</button>`);
        b.onclick = (e) => {
          e.stopPropagation();
          AU.sfx('confirm');
          if (c.bond) for (const [g, n] of Object.entries(c.bond)) { ST.addBond(S, g, n); toast(`${HEROES[g].name} bond +${n} ♥`, 'bond'); }
          if (c.flag) S.flags[c.flag] = true;
          if (c.tone) { S.stats.tone = S.stats.tone || {}; S.stats.tone[c.tone] = (S.stats.tone[c.tone] || 0) + 1; }
          if (c.reopen && ev.id) delete S.seen[ev.id]; // "not tonight" — the scene can come back
          const responses = c.r || [];
          steps.splice(idx, 1, ...responses);
          if (!responses.length) idx++;
          showStep();
        };
        box.appendChild(b);
      }
    };

    showStep();
  });
}

// ------------------------------------------------------------------
// title
// ------------------------------------------------------------------

async function title(hasSave) {
  AU.music('title');
  stage.battleCamera();
  stage.showcase(['erin', 'player', 'sakura', 'shiro'], heroVariant);
  stage.camBase.set(0, 2.1, 6.8);

  screen(`
    <div class="title-wrap">
      <div class="title-logo">
        <div class="title-top">A HAREM WAITING FOR THEIR MAN presents</div>
        <h1>GATE<span>BOUND</span></h1>
        <div class="title-sub">Three A-ranks. One vacancy. The System has other plans.</div>
      </div>
      <div class="title-menu">
        ${hasSave ? '<button class="btn primary" id="bt-continue">Continue</button>' : ''}
        <button class="btn ${hasSave ? '' : 'primary'}" id="bt-new">New Game</button>
        <button class="btn ghost" id="bt-settings">Settings</button>
      </div>
      <div class="title-foot">placeholder heroes shown — drop Meshy .glb files into <code>models/</code> to replace them</div>
    </div>
  `, 'center');

  if (hasSave) $('#bt-continue').onclick = () => {
    AU.sfx('confirm');
    S = ST.load();
    restoreCustomHeroes(S);
    AU.applySettings(S.settings);
    if (S.run) { stage.setBiome(S.run.gate.biome); dungeonScreen(); }
    else guild();
  };
  $('#bt-new').onclick = () => {
    AU.sfx('confirm');
    namePrompt(hasSave);
  };
  $('#bt-settings').onclick = () => settingsModal(() => title(hasSave));
}

function namePrompt(hasSave) {
  screen(`
    <div class="panel small center-panel">
      <h2>Your name, recruit?</h2>
      <p class="muted">The F-rank the guild is about to underestimate.</p>
      <input id="name-input" maxlength="14" placeholder="Rook" autofocus>
      <div class="row gap">
        <button class="btn primary" id="bt-start">Begin</button>
        <button class="btn ghost" id="bt-back">Back</button>
      </div>
      ${hasSave ? '<p class="warn">Starting a new game overwrites the existing save.</p>' : ''}
    </div>
  `, 'center');
  const start = async () => {
    const name = $('#name-input').value.trim() || 'Rook';
    S = ST.newGame(name);
    AU.applySettings(S.settings);
    ST.save(S);
    AU.sfx('gate');
    screen('', '');
    await playEvent(EVENTS.intro);
    await playEvent(EVENTS.recruit);
    guild();
  };
  $('#bt-start').onclick = start;
  $('#name-input').onkeydown = e => { if (e.key === 'Enter') start(); };
  $('#bt-back').onclick = () => title(hasSave);
}

// ------------------------------------------------------------------
// guild hub
// ------------------------------------------------------------------

let rumorCycle = 0; // cycles flavor rumors on repeat taps within a day

function yukiTicker() {
  const married = S.seen && S.seen.wedding && (S.flags.harem_formed || (S.bond.yuki || 0) >= 10);
  // --- late game: after the Threshold ---
  if (S.flags.yuki_femme && married) return 'Yuki\'s wedding ring is guild-forged steel — she asked for the same alloy as the assignment board, "so it outlasts everything else in the hall." It will. So, by all appearances, will she.';
  if (S.flags.yuki_femme && S.cleared) return 'The broadsheets keep calling the Monarch-slayers "the four." Yuki cuts out every article, corrects the number in green ink, and files them. Nobody has told her the guild archivist keeps her corrections as the official record.';
  if (S.flags.yuki_member && S.cleared) return 'Post-Threshold, the guild offered Yuki his own command. He declined by return post: "Already have the only chair I ever wanted. It\'s the fifth one."';
  if (S.flags.betrothal_ended && S.seen.rival_yuki_3) return 'Dawnbreak\'s clear times sit four seconds off yours on the pinned sheet, and Yuki Beaumont — A-rank — writes weekly to renegotiate the dinner bet. The guild frames the correspondence. Both sides of it.';
  if (S.flags.betrothal_ended && S.cleared) return 'Yuki\'s letters come with clippings now: Dawnbreak clearing B-gates in your old times. "Not catching up anymore," the latest says. "Pacing. There\'s a difference. See you at the top."';
  if (S.flags.yuki_refused && S.cleared) return 'Word from the east: the solo diver who kept refusing escorts made B-rank the week the Threshold closed. His examiner\'s note reads, in full: "Earned the door."';
  if ((S.ngPlus || 0) >= 2 && S.flags.yuki_femme) return 'Yuki has started teaching the second-watch shift to new recruits: how to sit with someone in the dark and make it feel like the middle of the fire. Enrollment is full through winter.';
  // --- mid game: the original thread ---
  if (S.flags.yuki_femme) return 'Yuki — long hair, green gown, second-watch partner, the harem\'s fifth heart — is exactly where she spent four years trying to reach: the middle of the fire.';
  if (S.flags.yuki_member) return 'Yuki runs every gate with you now, softening by the day into someone who finally fits. The guild has stopped being surprised by the fifth chair.';
  if (S.flags.betrothal_ended) return 'Yuki Beaumont, B-rank, runs gates with a party of his own now. His letters arrive on time, every week, to all four of you.';
  if (S.flags.yuki_refused) return 'Word from the east: Yuki cleared another D-gate solo. "Earning the door," his letter says.';
  if (S.flags.yuki_guest_done) return 'Yuki went home with three cracked ribs and the biggest smile the guild physician has ever treated.';
  if (S.rankIdx >= 3) return 'Rumor: Yuki Beaumont passed his C-rank assessment on the second try. The examiner called him "un-discourageable."';
  if (S.rankIdx >= 1) return 'Yuki is out there somewhere, grinding F-gates one goblin at a time.';
  return 'Yuki left for the eastern training halls, sword too clean, vow too heavy.';
}

async function guild() {
  AU.music('guild');
  ST.ensureYuki(S);
  ensureYukiPortrait();
  stage.battleCamera();
  stage.showcase(S.flags.yuki_member ? ['erin', 'sakura', 'shiro', 'yuki'] : ['erin', 'sakura', 'shiro'], heroVariant);
  stage.camBase.set(0, 2.0, 6.2);

  // queued auto events (promotions, rescues etc.)
  while (S.queue.length) {
    const id = S.queue.shift();
    if (EVENTS[id]) { AU.sfx('promo'); await playEvent(EVENTS[id]); }
  }
  // sign anyone who accepted an invitation mid-scene (rescues, petitions)
  for (const id of Object.keys(HEROES)) {
    if (HEROES[id].recruit && S.flags['recruit_' + id + '_accept'] && !S.recruited.includes(id)) {
      ST.joinRecruit(S, id);
      AU.sfx('promo');
      toast(`${HEROES[id].name} joins the guild!`, 'gold');
    }
  }
  if (S.cleared && !S.seen.__ending) {
    S.seen.__ending = true;
    await playEvent(endingFor(S));
  }
  // Wedding epilogue — once cleared and a romance is sealed (harem, or any maxed bond).
  if (S.cleared && !S.seen.wedding) {
    const married = S.flags.harem_formed || ['sakura', 'erin', 'shiro', 'yuki'].some(k => (S.bond[k] || 0) >= 10);
    if (married) {
      S.seen.wedding = true;
      // dress the whole party up for the ceremony
      stage.showcase(ST.roster(S), id => (id === 'yuki' && S.flags.yuki_femme) ? 'fem_formal' : 'formal');
      await playEvent(weddingFor(S));
    }
  }
  ST.save(S);

  const rank = RANKS[S.rankIdx];
  const need = ST.gpNeeded(S);
  const talkEv = pickGuildEvent(S);
  const pl = S.heroes.player;
  const away = ST.dispatchedIds(S);
  const offers = recruitOffers(S);
  const newReports = S.dispatchReports.filter(r => !r.seen).length;
  const missionsOut = S.dispatch.length;

  screen(`
    <div class="hud-top">
      <div class="panel bar">
        <span class="day">Day ${S.day}${S.legacy && S.legacy.cycle ? ` · Cycle ${S.legacy.cycle + 1}` : ''}</span>
        <span class="lic">License ${rankBadge(rank)}</span>
        <div class="gp-wrap" title="Guild points toward promotion">
          <div class="bar-outer gp"><div class="bar-inner" style="width:${need ? Math.min(100, S.gp / need * 100) : 100}%"></div></div>
          <span class="gp-num">${need ? `${S.gp}/${need} GP` : 'MAX RANK'}</span>
        </div>
        <span class="gold">◈ ${S.gold}g</span>
      </div>
    </div>
    <div class="guild-layout">
      <div class="panel guild-main">
        <h2>Adventurers' Guild — Hall of Records</h2>
        <p class="muted">${S.cleared ? 'The Threshold is closed. The gates that remain are yours to enjoy.' : 'The girls are waiting by the assignment board.'}</p>
        <div class="menu-grid">
          <button class="btn big primary" id="g-map">⌖ World Map<small>enter a gate</small></button>
          <button class="btn big" id="g-party">✦ Party<small>stats, skills & gear</small></button>
          <button class="btn big" id="g-shop">◈ Shop<small>potions, gear & reforging</small></button>
          <button class="btn big ${talkEv ? 'notify' : ''}" id="g-talk">❝ Talk${talkEv ? '<em>!</em>' : ''}<small>guild hall gossip</small></button>
          <button class="btn big ${newReports ? 'notify' : ''}" id="g-dispatch">✈ Dispatch${newReports ? '<em>!</em>' : ''}<small>${missionsOut ? missionsOut + ' team' + (missionsOut > 1 ? 's' : '') + ' in the field' : 'send teams to clear gates'}</small></button>
          <button class="btn big" id="g-sanctum">✉ Sanctum<small>speak with the guild</small></button>
          <button class="btn big" id="g-forge">⚗ Forge<small>summon souls from descriptions</small></button>
          ${offers.length ? `<button class="btn big notify" id="g-newcomers">➤ Newcomers<em>!</em><small>${offers.length} petition${offers.length > 1 ? 's' : ''} to join</small></button>` : ''}
          <button class="btn big ghost" id="g-settings">⚙ Settings<small>save, audio, text</small></button>
        </div>
        <div class="row gap" style="margin-top:8px">
          <button class="btn sm ghost" id="g-rest" title="Advance to the next day: the gate board rerolls and dispatched teams return.">▸ Rest until tomorrow</button>
        </div>
        <button class="yuki-ticker ticker-btn ${pickRumorEvent(S) ? 'notify' : ''}" id="g-rumors" title="Tap to hear the day's letters and whispers.">
          <b>Letters & rumors${pickRumorEvent(S) ? ' <em>!</em>' : ''}:</b> ${yukiTicker()}
        </button>
      </div>
      <div class="panel party-strip">
        ${ST.roster(S).map(id => `
          <div class="pcard ${away.has(id) ? 'away' : ''}">
            ${portraitImg(id)}
            <div class="pinfo">
              <b style="color:${SPEAKERS[id].color}">${id === 'player' ? esc(S.name) : HEROES[id].name}</b>
              <span class="muted">Lv ${S.heroes[id].level} ${heroDesc(S, id).cls}${away.has(id) ? ' · <b class="gold">away</b>' : ''}</span>
              ${id in S.bond ? heartsFor(id) : id === 'player' ? `<span class="sys-tag">THE SYSTEM · Lv ${pl.level} · +${Math.round((0.1 + (S.legacy?.xpBoost || 0)) * 100)}% XP</span>` : `<span class="muted sm-text">${heroDesc(S, id).epithet}</span>`}
            </div>
          </div>`).join('')}
      </div>
    </div>
  `);

  $('#g-map').onclick = () => { AU.sfx('confirm'); map(); };
  $('#g-party').onclick = () => { AU.sfx('ui'); party(); };
  $('#g-shop').onclick = () => { AU.sfx('ui'); shop(); };
  $('#g-talk').onclick = async () => {
    AU.sfx('ui');
    const ev = pickGuildEvent(S);
    if (ev) { await playEvent(ev); guild(); }
    else { toast('Nothing new — clear more gates.'); }
  };
  $('#g-dispatch').onclick = () => { AU.sfx('ui'); dispatchBoard(); };
  $('#g-rumors').onclick = async () => {
    AU.sfx('ui');
    const ev = pickRumorEvent(S);
    if (ev) { await playEvent(ev); guild(); }
    else {
      await playEvent({ id: 'rumor_flavor', steps: [{ s: 'crier', t: rumorLine(S, rumorCycle++) }] });
      guild();
    }
  };
  $('#g-sanctum').onclick = () => { AU.sfx('ui'); openSanctum({ S, screen, portraitImg, toast, esc, back: guild, save: () => ST.save(S) }); };
  $('#g-forge').onclick = () => { AU.sfx('ui'); forgeScreen(); };
  const nc = $('#g-newcomers');
  if (nc) nc.onclick = () => { AU.sfx('ui'); newcomers(); };
  $('#g-rest').onclick = () => {
    AU.sfx('confirm');
    ST.advanceDay(S);
    ST.save(S);
    toast(`Day ${S.day} — the gate board shifts.`);
    guild();
  };
  $('#g-settings').onclick = () => settingsModal(guild);
}

// ------------------------------------------------------------------
// newcomers (post-clear recruitment)
// ------------------------------------------------------------------

async function newcomers() {
  const offers = recruitOffers(S);
  if (!offers.length) { guild(); return; }

  screen(`
    <div class="panel map-panel">
      <div class="row spread">
        <h2>➤ Newcomers — Petitions to Join</h2>
        <button class="btn ghost" id="n-back">← Guild</button>
      </div>
      <p class="muted">${S.cleared
        ? 'Word of the Threshold clear travels. People keep arriving at the hall asking for the Fourth\'s table — hear them out, and sign the ones who fit.'
        : 'Word of the rescue travels. Adventurers you pulled out of the dark keep finding reasons to be near your table — hear them out, and sign the ones who fit.'}</p>
      <div class="gate-grid">
        ${offers.map(h => `
          <div class="gate-card recruit-card">
            <div class="recruit-head">${portraitImg(h.id)}<div><b style="color:${SPEAKERS[h.id]?.color || '#fff'}">${h.name}</b><br><small class="muted">${h.epithet} · ${h.cls}</small></div></div>
            <p class="muted sm-text">${esc(h.desc)}</p>
            <div class="gate-meta">${ROLE_INFO[h.role]?.icon || ''} ${ROLE_INFO[h.role]?.name || h.role} · joins near your level</div>
            <button class="btn primary hear-out" data-id="${h.id}">Hear them out</button>
          </div>`).join('')}
      </div>
    </div>
  `);
  $('#n-back').onclick = () => guild();
  document.querySelectorAll('.hear-out').forEach(b => b.onclick = async () => {
    const id = b.dataset.id;
    AU.sfx('confirm');
    screen('', '');
    await playEvent(EVENTS['recruit_intro_' + id]);
    if (S.flags['recruit_' + id + '_accept'] && !S.recruited.includes(id)) {
      ST.joinRecruit(S, id);
      AU.sfx('promo');
      toast(`${HEROES[id].name} joins the guild!`, 'gold');
    }
    ST.save(S);
    newcomers();
  });
}

// ------------------------------------------------------------------
// dispatch board
// ------------------------------------------------------------------

function dispatchBoard() {
  const reports = S.dispatchReports.slice().reverse();
  const gates = S.gates.filter(g => !g.story && !g.recursion && !g.rescue && g.id !== 'monarch');

  const missionRows = S.dispatch.length ? S.dispatch.map(m => `
    <div class="shop-row">
      <div><b>${rankBadge(m.gate.rank)} ${esc(m.gate.name)}</b>
        <p class="muted sm-text">${m.team.map(id => HEROES[id].name).join(', ')} · returns after the next day</p></div>
      <span class="muted">${Math.round(m.chance * 100)}%</span>
    </div>`).join('') : '<p class="muted">No teams in the field.</p>';

  const reportRows = reports.length ? reports.slice(0, 8).map(r => `
    <div class="shop-row report ${r.success ? 'ok' : 'fail'}">
      <div><b>${r.success ? '✔' : '✘'} ${rankBadge(r.gate.rank)} ${esc(r.gate.name)}</b>
        <p class="muted sm-text">${r.team.map(id => HEROES[id].name).join(', ')} — ${r.success
          ? `cleared it! +${r.gp} GP, +${r.gold}g, +${r.xp} XP each${r.gear ? `, found ${esc(r.gear.name)}` : ''}`
          : `driven back. Hard lessons: +${r.xp} XP each`}${r.levelUps.length ? ` · <b class="gold">${[...new Set(r.levelUps.map(u => HEROES[u.id].name))].join(', ')} leveled up!</b>` : ''}</p></div>
      <span class="muted sm-text">day ${r.day}</span>
    </div>`).join('') : '<p class="muted">No reports yet.</p>';

  screen(`
    <div class="panel map-panel">
      <div class="row spread">
        <h2>✈ Dispatch Board</h2>
        <button class="btn ghost" id="dp-back">← Guild</button>
      </div>
      <p class="muted">Send benched members to clear a gate on their own — they return after the next day (run a gate yourself, or rest). A balanced team travels safer: ${Object.values(ROLE_INFO).map(r => `${r.icon} ${r.name}`).join(' · ')}.</p>
      <div class="shop-cols">
        <div>
          <h3>New dispatch</h3>
          ${gates.length ? gates.map((g, i) => `
            <div class="shop-row">
              <div><b>${rankBadge(g.rank)} ${esc(g.name)}</b> <small class="muted">${BIOMES[g.biome].name}</small></div>
              <button class="btn send-to" data-i="${S.gates.indexOf(g)}">assemble team</button>
            </div>`).join('') : '<p class="muted">No dispatchable gates today.</p>'}
          <h3>In the field</h3>${missionRows}
        </div>
        <div><h3>Reports</h3><div class="sell-list">${reportRows}</div></div>
      </div>
    </div>
  `);
  for (const r of S.dispatchReports) r.seen = true;
  ST.save(S);

  $('#dp-back').onclick = () => guild();
  document.querySelectorAll('.send-to').forEach(b => b.onclick = () => {
    AU.sfx('ui');
    dispatchTeamPick(S.gates[Number(b.dataset.i)]);
  });
}

function dispatchTeamPick(gate) {
  const away = ST.dispatchedIds(S);
  const pool = ST.roster(S).filter(id => id !== 'player' && !away.has(id));
  if (!pool.length) { toast('Everyone is either with you or already in the field.'); return; }
  const chosen = new Set();

  const modal = el(`<div class="modal-layer"><div class="panel modal party-pick">
    <h3>Dispatch team — ${rankBadge(gate.rank)} ${esc(gate.name)}</h3>
    <p class="muted sm-text">You stay behind — the System doesn't share. Pick who goes; roles stack the odds.</p>
    <div class="pick-grid">
      ${pool.map(id => `
        <button class="pick-card" data-id="${id}">
          ${portraitImg(id)}
          <b style="color:${SPEAKERS[id].color}">${HEROES[id].name}</b>
          <span class="muted">Lv ${S.heroes[id].level} · ${ROLE_INFO[HEROES[id].role]?.icon || ''} ${ROLE_INFO[HEROES[id].role]?.name || ''}</span>
        </button>`).join('')}
    </div>
    <div class="pick-foot">
      <span id="dp-info" class="muted">Select a team.</span>
      <div class="row gap">
        <button class="btn primary disabled" id="dp-go">Dispatch</button>
        <button class="btn ghost" id="dp-cancel">Cancel</button>
      </div>
    </div>
  </div></div>`);
  document.body.appendChild(modal);

  const info = modal.querySelector('#dp-info');
  const go = modal.querySelector('#dp-go');
  const refresh = () => {
    if (!chosen.size) { info.textContent = 'Select a team.'; go.classList.add('disabled'); return; }
    const f = ST.dispatchForecast(S, gate, [...chosen]);
    const roleStr = f.roles.map(r => ROLE_INFO[r]?.icon || '').join(' ');
    info.innerHTML = `${chosen.size} member${chosen.size > 1 ? 's' : ''} ${roleStr} · avg Lv ${f.avg} vs ~${f.bench} · <b class="${f.chance >= 0.65 ? 'gold' : f.chance >= 0.4 ? '' : 'danger'}">${Math.round(f.chance * 100)}% success</b>${f.comp ? ` <small>(+${Math.round(f.comp * 100)}% composition)</small>` : ''}`;
    go.classList.remove('disabled');
  };

  modal.querySelectorAll('.pick-card').forEach(c => c.onclick = () => {
    const id = c.dataset.id;
    if (chosen.has(id)) chosen.delete(id); else chosen.add(id);
    c.classList.toggle('on', chosen.has(id));
    AU.sfx('ui');
    refresh();
  });
  modal.querySelector('#dp-cancel').onclick = () => { AU.sfx('ui'); modal.remove(); };
  go.onclick = () => {
    if (!chosen.size) return;
    ST.sendDispatch(S, gate, [...chosen]);
    AU.sfx('gate');
    toast(`${[...chosen].map(id => HEROES[id].name).join(', ')} set out for ${gate.name}.`, 'gold');
    modal.remove();
    dispatchBoard();
  };
}

// ------------------------------------------------------------------
// world map
// ------------------------------------------------------------------

function map() {
  const cards = S.gates.map((g, i) => {
    const b = BIOMES[g.biome];
    const mod = GATE_MODIFIERS.find(m => m.id === g.modifier);
    const modLine = g.rescue
      ? `<div class="gate-mod rescue" title="A rival party is trapped inside. Clear the gate to bring them home.">⚑ RESCUE — ${esc(g.rescue.party)} is trapped inside</div>`
      : mod && mod.name ? `<div class="gate-mod" title="${mod.desc}">◆ ${mod.name}</div>` : '<div class="gate-mod none">standard mana signature</div>';
    const gpLine = g.rescue
      ? `<div class="gate-gp muted">bounty: ◈${g.rescue.bounty}g · +${Math.round(GATE_GP[g.rank]) + g.rescue.gp} GP</div>`
      : `<div class="gate-gp muted">clear: +${Math.round(GATE_GP[g.rank] * (g.modifier === 'unstable' ? 1.5 : 1))} GP</div>`;
    return `
      <div class="gate-card ${g.id === 'monarch' ? 'monarch' : ''} ${g.rescue ? 'rescue' : ''}" style="--rc:${RANK_STYLE[g.rank].color};--rg:${RANK_STYLE[g.rank].glow}">
        <div class="gate-head">${rankBadge(g.rank, 'lg')}<b>${esc(g.name)}</b></div>
        <div class="gate-meta">${b.name} · ${g.rooms} chambers + boss</div>
        ${modLine}
        ${gpLine}
        <button class="btn primary enter-gate" data-i="${i}">${g.rescue ? 'Answer the Call' : 'Enter Gate'}</button>
      </div>`;
  }).join('');

  screen(`
    <div class="panel map-panel">
      <div class="row spread">
        <h2>⌖ Active Gates — Day ${S.day}</h2>
        <button class="btn ghost" id="m-back">← Guild</button>
      </div>
      <p class="muted">Gates shift daily — lower-rank gates are always on offer to farm for gold and XP. The guild permits gates up to one rank above your license (${RANKS[S.rankIdx]}).</p>
      <div class="gate-grid">${cards}</div>
    </div>
  `);
  $('#m-back').onclick = () => guild();
  document.querySelectorAll('.enter-gate').forEach(b => b.onclick = () => {
    const gate = S.gates[Number(b.dataset.i)];
    AU.sfx('ui');
    // A pending guest run (Yuki's "one gate together") auto-fills the party.
    const guestPending = S.flags.yuki_guest && !S.flags.yuki_guest_done && !S.flags.yuki_member;
    if (guestPending) beginRun(gate);
    else partySelect(gate);
  });
}

function beginRun(gate, selectedIds) {
  AU.sfx('gate');
  ST.startRun(S, gate, selectedIds);
  ST.save(S);
  stage.setBiome(gate.biome);
  AU.music('dungeon');
  dungeonScreen();
}

const MAX_PARTY = 5;

function partySelect(gate) {
  ST.ensureYuki(S);
  ensureYukiPortrait();
  const away = ST.dispatchedIds(S);
  const all = ST.roster(S).filter(id => !away.has(id));
  const chosen = new Set(all.slice(0, MAX_PARTY));
  const modal = el(`<div class="modal-layer"><div class="panel modal party-pick">
    <h3>Assemble your party — ${rankBadge(gate.rank)} ${esc(gate.name)}</h3>
    <p class="muted sm-text">Tap to include or bench a member (up to ${MAX_PARTY}). A smaller party earns <b>bonus XP each</b> — send a focused team to grind specific heroes.</p>
    <div class="pick-grid">
      ${all.map(id => `
        <button class="pick-card ${chosen.has(id) ? 'on' : ''}" data-id="${id}">
          ${portraitImg(id)}
          <b style="color:${SPEAKERS[id].color}">${id === 'player' ? esc(S.name) : HEROES[id].name}</b>
          <span class="muted">Lv ${S.heroes[id].level}</span>
        </button>`).join('')}
    </div>
    <div class="pick-foot">
      <span id="pick-info" class="muted"></span>
      <div class="row gap">
        <button class="btn primary" id="pick-go">Enter Gate</button>
        <button class="btn ghost" id="pick-cancel">Cancel</button>
      </div>
    </div>
  </div></div>`);
  document.body.appendChild(modal);

  const info = modal.querySelector('#pick-info');
  const go = modal.querySelector('#pick-go');
  const refresh = () => {
    const n = chosen.size;
    const bonus = Math.round(Math.max(0, 4 - n) * 35);
    info.innerHTML = !n ? 'Select at least one member.'
      : bonus ? `${n} in party · <b class="gold">+${bonus}% XP each</b>`
      : `${n} in party · standard XP`;
    go.classList.toggle('disabled', n === 0);
  };
  refresh();

  modal.querySelectorAll('.pick-card').forEach(c => c.onclick = () => {
    const id = c.dataset.id;
    if (chosen.has(id)) chosen.delete(id);
    else if (chosen.size >= MAX_PARTY) { toast(`A gate party is ${MAX_PARTY} at most — bench someone first.`); return; }
    else chosen.add(id);
    c.classList.toggle('on', chosen.has(id));
    AU.sfx('ui');
    refresh();
  });
  modal.querySelector('#pick-cancel').onclick = () => { AU.sfx('ui'); modal.remove(); };
  go.onclick = () => {
    if (!chosen.size) return;
    modal.remove();
    beginRun(gate, [...chosen]);
  };
}

// ------------------------------------------------------------------
// dungeon
// ------------------------------------------------------------------

const NODE_ICONS = { fight: '⚔', treasure: '✦', event: '?', rest: '▲', boss: '☠', branch: '⑃', stranded: '⚑' };

const DOOR_LABELS = {
  elite:    { name: 'The Heavy Door',  desc: 'Something big claimed this room. Richer spoils for whoever un-claims it.', icon: '◆' },
  treasure: { name: 'The Quiet Door',  desc: 'A glint of gate-formed treasure, unguarded. Probably.', icon: '✦' },
  event:    { name: 'The Strange Door', desc: 'Mana eddies oddly beyond. Something is waiting to be decided.', icon: '?' },
  rest:     { name: 'The Still Door',  desc: 'Defensible ground and clean air. A place to catch your breath.', icon: '▲' },
};

function doorInfo(opt) {
  return opt.elite ? DOOR_LABELS.elite : DOOR_LABELS[opt.type] || DOOR_LABELS.event;
}

function pathBar() {
  return `<div class="path-bar">${S.run.nodes.map((n, i) =>
    `<span class="path-node ${i < S.run.nodeIdx ? 'done' : ''} ${i === S.run.nodeIdx ? 'cur' : ''} ${n.type}">${NODE_ICONS[n.type]}</span>`
  ).join('<span class="path-link"></span>')}</div>`;
}

function dungeonScreen() {
  const run = S.run;
  const node = run.nodes[run.nodeIdx];
  const gate = run.gate;
  let body = '', actions = '';

  if (node.type === 'branch') {
    body = '<p>The corridor forks. Both ways lead onward — but not through the same things.</p>';
    actions = node.options.map((opt, i) => {
      const d = doorInfo(opt);
      return `<button class="btn ${opt.elite ? 'danger-door' : ''} d-door" data-i="${i}">${d.icon} ${d.name}<small>${d.desc}</small></button>`;
    }).join('');
  } else if (node.type === 'fight' || node.type === 'boss') {
    const names = {};
    node.group.forEach(e => names[e.name] = (names[e.name] || 0) + 1);
    const hasElite = node.group.some(e => e.elite);
    body = `<p>${node.type === 'boss' ? '<b class="danger">The boss chamber.</b> The air pressure doubles.'
      : hasElite ? '<b class="gold">Something in there outranks its kin.</b> Hostiles ahead:' : 'Hostiles ahead:'}</p>
      <ul class="foes">${Object.entries(names).map(([n, c]) => `<li>${esc(n)}${c > 1 ? ` ×${c}` : ''}</li>`).join('')}</ul>`;
    actions = `<button class="btn primary" id="d-go">${node.type === 'boss' ? 'Challenge the Boss' : 'Engage'}</button>`;
  } else if (node.type === 'treasure') {
    body = '<p>A sealed cache glimmers in the gloom — gate-formed treasure, free for the quick.</p>';
    actions = '<button class="btn primary" id="d-go">Open it</button>';
  } else if (node.type === 'rest') {
    body = '<p>A defensible alcove. Shiro marks the sightlines; Erin already has the kettle out.</p>';
    actions = '<button class="btn primary" id="d-go">Rest (party recovers 30%)</button>';
  } else if (node.type === 'stranded') {
    const who = gate.rescue && gate.rescue.member ? HEROES[gate.rescue.member].name + ' of ' + gate.rescue.party : (gate.rescue ? gate.rescue.party : 'the stranded party');
    body = `<p><b class="gold">⚑ The barricade.</b> Behind stacked rubble and a half-spent ward: ${esc(who)} — gaunt, alive, and staring at your party like a sunrise. They point the way to the boss chamber. "It's between us and the way out. It's why we're still here."</p>`;
    actions = '<button class="btn primary" id="d-go">Share supplies and press on (party recovers 20%)</button>';
  } else if (node.type === 'event') {
    const ev = DUNGEON_EVENTS[Math.floor(node.roll * DUNGEON_EVENTS.length)];
    body = `<p>${esc(ev.t)}</p>`;
    actions = ev.choices.map((c, i) => `<button class="btn ${i === 0 ? 'primary' : ''} d-ev" data-i="${i}">${esc(c.t)}</button>`).join('');
  }

  const hpRows = run.partyIds.map(id => {
    const st = ST.heroStats(S, id);
    const cur = run.party[id];
    return `<div class="mini-hp"><span>${id === 'player' ? esc(S.name) : HEROES[id].name}</span>
      <div class="bar-outer hp sm"><div class="bar-inner" style="width:${cur.hp / st.hp * 100}%"></div></div></div>`;
  }).join('');

  screen(`
    <div class="panel dungeon-panel">
      <div class="row spread">
        <h2>${rankBadge(gate.rank)} ${esc(gate.name)}</h2>
        <span class="muted">chamber ${Math.min(run.nodeIdx + 1, run.nodes.length)}/${run.nodes.length}</span>
      </div>
      ${pathBar()}
      <div class="dungeon-body">${body}</div>
      <div class="row gap wrap">${actions}
        <button class="btn ghost" id="d-retreat">Retreat from gate</button>
      </div>
      <div class="mini-party">${hpRows}</div>
    </div>
  `, 'lowered');

  const advance = () => {
    S.run.nodeIdx++;
    ST.save(S);
    dungeonScreen();
  };

  const go = $('#d-go');
  if (go) go.onclick = async () => {
    AU.sfx('confirm');
    if (node.type === 'fight' || node.type === 'boss') {
      battle(node);
    } else if (node.type === 'treasure') {
      const r = ST.rollTreasure(S, gate, Math.random);
      AU.sfx('coin');
      if (r.kind === 'gear') toast(`Found: ${r.gear.name} (+${gearScore(r.gear)})`, 'gold');
      else if (r.kind === 'gold') toast(`Found ${r.gold} gold`, 'gold');
      else toast(`Found: ${ITEMS[r.item].name}`, 'gold');
      advance();
    } else if (node.type === 'rest' || node.type === 'stranded') {
      AU.sfx('heal');
      const pct = node.type === 'stranded' ? 0.2 : 0.3;
      for (const id of run.partyIds) {
        const st = ST.heroStats(S, id);
        run.party[id].hp = Math.min(st.hp, Math.round(run.party[id].hp + st.hp * pct));
        run.party[id].mp = Math.min(st.mp, Math.round(run.party[id].mp + st.mp * pct));
      }
      toast(node.type === 'stranded' ? 'The stranded share what little they saved. It helps more than it should.' : 'The party recovers.');
      advance();
    }
  };

  document.querySelectorAll('.d-ev').forEach(b => b.onclick = () => {
    const ev = DUNGEON_EVENTS[Math.floor(node.roll * DUNGEON_EVENTS.length)];
    const c = ev.choices[Number(b.dataset.i)];
    applyDungeonEffect(c.effect, gate);
    toast(c.log, '');
    AU.sfx('ui');
    advance();
  });

  // fork in the road: the chosen door becomes this node
  document.querySelectorAll('.d-door').forEach(b => b.onclick = () => {
    const opt = node.options[Number(b.dataset.i)];
    S.run.nodes[S.run.nodeIdx] = opt;
    AU.sfx('gate');
    ST.save(S);
    dungeonScreen();
  });

  $('#d-retreat').onclick = () => {
    AU.sfx('ui');
    const result = ST.endRun(S, 'retreat');
    results(result);
  };
}

function applyDungeonEffect(eff, gate) {
  const base = 30 * (S.rankIdx + 1);
  if (eff.xp) S.run.loot.xp += Math.round(base * 2 * eff.xp);
  if (eff.gold) {
    const amt = Math.round(base * 1.5 * Math.abs(eff.gold));
    if (eff.gold > 0) S.run.loot.gold += amt;
    else S.gold = Math.max(0, S.gold - amt);
  }
  if (eff.gp) S.run.loot.gpBonus = (S.run.loot.gpBonus || 0) + eff.gp;
  if (eff.hpPct || eff.mpPct) {
    for (const id of S.run.partyIds) {
      const st = ST.heroStats(S, id);
      if (eff.hpPct) S.run.party[id].hp = Math.max(1, Math.min(st.hp, Math.round(S.run.party[id].hp + st.hp * eff.hpPct)));
      if (eff.mpPct) S.run.party[id].mp = Math.max(0, Math.min(st.mp, Math.round(S.run.party[id].mp + st.mp * eff.mpPct)));
    }
  }
  if (eff.item) {
    if (eff.item.startsWith('-')) {
      const it = eff.item.slice(1);
      S.inventory[it] = Math.max(0, (S.inventory[it] || 0) - 1);
    } else S.run.loot.items[eff.item] = (S.run.loot.items[eff.item] || 0) + 1;
  }
  if (eff.buff) S.run.tempBuff = eff.buff;
}

// ------------------------------------------------------------------
// battle
// ------------------------------------------------------------------

const disp = new Map(); // uid -> {hp,maxHp,shield,statuses:Map}
let autoInterrupt = null; // resolves an open command prompt when auto is toggled on

function unitCard(u, side) {
  const d = disp.get(u.uid);
  const stIcons = [...d.statuses].map(id => `<span class="st-ic ${STATUSES[id]?.kind}" title="${STATUSES[id]?.name}">${STATUSES[id]?.icon || '?'}</span>`).join('');
  return `<div class="ucard ${side} ${d.hp <= 0 ? 'dead' : ''} ${u.boss ? 'boss' : ''} ${u.elite ? 'elite' : ''}" data-uid="${u.uid}">
    <div class="uname" style="${side === 'party' ? `color:${SPEAKERS[u.uid]?.color || '#fff'}` : ''}">${u.elite ? '◆ ' : ''}${esc(u.name)}</div>
    <div class="bar-outer hp sm"><div class="bar-inner" style="width:${Math.max(0, d.hp / d.maxHp * 100)}%"></div>${d.shield > 0 ? '<div class="shield-chip">◈</div>' : ''}</div>
    ${side === 'party' ? `<div class="bar-outer mp sm"><div class="bar-inner" style="width:${u.maxMp ? u.mp / u.maxMp * 100 : 0}%"></div></div>` : ''}
    <div class="hp-num">${Math.max(0, d.hp)}/${d.maxHp}</div>
    <div class="st-row">${stIcons}</div>
  </div>`;
}

function renderBattleHud(c, gateName, roomLabel) {
  const party = c.units.filter(u => u.side === 'party');
  const foes = c.units.filter(u => u.side === 'enemy');
  screen(`
    <div class="battle-top">
      <div class="panel slim"><b>${esc(gateName)}</b> · ${roomLabel} · <span id="round-label">round ${c.round || 1}</span>
        <button class="btn sm ${S.settings.autoBattle ? 'primary' : 'ghost'}" id="b-auto" title="Auto-battle: party members act on their own — Strike, or each hero's chosen auto-skill (set on the Party sheet at ★★★ mastery).">${S.settings.autoBattle ? '■ AUTO' : '▶ Auto'}</button>
      </div>
      <div class="panel slim log" id="b-log"></div>
    </div>
    <div class="cam-ctrl" aria-label="camera controls">
      <button class="cam-btn" id="cam-left" title="Rotate left">⟲</button>
      <button class="cam-btn" id="cam-right" title="Rotate right">⟳</button>
      <button class="cam-btn" id="cam-in" title="Zoom in">＋</button>
      <button class="cam-btn" id="cam-out" title="Zoom out">－</button>
      <button class="cam-btn" id="cam-reset" title="Reset view">⊙</button>
    </div>
    <div class="battle-bottom">
      <div class="party-row" id="party-row">${party.map(u => unitCard(u, 'party')).join('')}</div>
      <div class="cmd-area panel" id="cmd-area"><div class="muted center-text">…</div></div>
      <div class="foe-row" id="foe-row">${foes.map(u => unitCard(u, 'enemy')).join('')}</div>
    </div>
  `, 'battle');

  const camBind = (id, fn) => { const b = $('#' + id); if (b) b.onclick = () => { AU.sfx('ui'); fn(); }; };
  camBind('cam-left', () => stage.nudgeYaw(-0.35));
  camBind('cam-right', () => stage.nudgeYaw(0.35));
  camBind('cam-in', () => stage.nudgeZoom(0.85));
  camBind('cam-out', () => stage.nudgeZoom(1.18));
  camBind('cam-reset', () => stage.resetView());
}

function refreshCards(c) {
  const pr = $('#party-row'), fr = $('#foe-row');
  if (pr) pr.innerHTML = c.units.filter(u => u.side === 'party').map(u => unitCard(u, 'party')).join('');
  if (fr) fr.innerHTML = c.units.filter(u => u.side === 'enemy').map(u => unitCard(u, 'enemy')).join('');
}

function blog(text) {
  const l = $('#b-log');
  if (!l) return;
  const line = el(`<div>${esc(text)}</div>`);
  l.appendChild(line);
  while (l.children.length > 4) l.firstChild.remove();
}

async function battle(node) {
  const run = S.run;
  const gate = run.gate;
  const c = new Combat(S, node.group);

  disp.clear();
  for (const u of c.units) {
    const sh = u.statuses.find(s => s.id === 'shield');
    disp.set(u.uid, { hp: u.hp, maxHp: u.maxHp, shield: sh ? sh.power : 0, statuses: new Set(u.statuses.map(s => s.id)) });
  }

  stage.battleCamera();
  await stage.layoutBattle(
    c.units.filter(u => u.side === 'party').map(u => ({ uid: u.uid, model: u.model, variant: u.uid === 'yuki' && S.flags.yuki_femme ? 'fem' : null })),
    c.units.filter(u => u.side === 'enemy').map(u => ({ uid: u.uid, model: u.model, variant: u.variant, boss: u.boss })),
  );
  AU.music('battle');
  renderBattleHud(c, gate.name, node.type === 'boss' ? 'BOSS' : `chamber ${run.nodeIdx + 1}`);

  const onApply = (e) => {
    const d = e.uid ? disp.get(e.uid) : null;
    switch (e.t) {
      case 'round': { const r = $('#round-label'); if (r) r.textContent = 'round ' + e.n; break; }
      case 'turn': {
        document.querySelectorAll('.ucard').forEach(x => x.classList.toggle('active', x.dataset.uid === e.uid));
        break;
      }
      case 'skill': { const u = c.unit(e.uid); if (u && e.skillId !== 'strike') blog(`${u.name} — ${e.name}!`); AU.sfx(e.anim === 'cast' ? 'magic' : 'ui'); break; }
      case 'hit': if (d) { d.hp = e.hpAfter; if (e.shieldAfter !== undefined) d.shield = e.shieldAfter; AU.sfx(e.miss ? 'miss' : e.crit ? 'crit' : 'hit'); refreshCards(c); } break;
      case 'dot': if (d) { d.hp = e.hpAfter; refreshCards(c); } break;
      case 'heal': if (d) { d.hp = e.hpAfter; AU.sfx('heal'); refreshCards(c); } break;
      case 'shield': if (d) { d.shield = e.amount; AU.sfx('shield'); refreshCards(c); } break;
      case 'status+': if (d) { d.statuses.add(e.id); refreshCards(c); } break;
      case 'status-': if (d) { d.statuses.delete(e.id); if (e.id === 'shield') d.shield = 0; refreshCards(c); } break;
      case 'die': if (d) { d.hp = 0; AU.sfx('die'); refreshCards(c); } break;
      case 'revive': if (d) { d.hp = e.hpAfter; refreshCards(c); } break;
      case 'item': { const u = c.unit(e.uid); blog(`${u ? u.name : '?'} uses ${ITEMS[e.itemId].name}.`); break; }
      case 'log': blog(e.text); break;
      case 'end': break;
    }
  };

  // auto-battle toggle: flips the mode and, if a command prompt is open,
  // resolves it immediately with the auto action.
  const autoBtn = $('#b-auto');
  if (autoBtn) autoBtn.onclick = () => {
    S.settings.autoBattle = !S.settings.autoBattle;
    ST.save(S);
    autoBtn.textContent = S.settings.autoBattle ? '■ AUTO' : '▶ Auto';
    autoBtn.classList.toggle('primary', S.settings.autoBattle);
    autoBtn.classList.toggle('ghost', !S.settings.autoBattle);
    AU.sfx('confirm');
    if (S.settings.autoBattle && autoInterrupt) autoInterrupt();
  };

  let res = c.step();
  for (let guard = 0; guard < 500; guard++) {
    await stage.playEvents(res.events, onApply);
    if (res.outcome) break;
    if (!res.needCommand) { res = c.step(); continue; }
    const u = res.needCommand;
    let cmd;
    if (S.settings.autoBattle) {
      const area = $('#cmd-area');
      if (area) area.innerHTML = `<div class="muted center-text">AUTO — ${esc(u.name)} acts…</div>`;
      await stage.wait(280);
      cmd = S.settings.autoBattle
        ? c.autoCommand(u, S.autoSkill[u.heroId])
        : await promptCommand(u, c); // toggled off during the beat
    } else {
      // manual prompt, interruptible by flipping auto on mid-turn
      const viaToggle = new Promise(r => { autoInterrupt = () => r(c.autoCommand(u, S.autoSkill[u.heroId])); });
      cmd = await Promise.race([promptCommand(u, c), viaToggle]);
      autoInterrupt = null;
    }
    res = c.step(cmd);
  }
  autoInterrupt = null;

  // outcome
  if (res.outcome === 'victory') {
    AU.sfx('victory');
    const endEv = res.events.find(e => e.t === 'end');
    toast(`Victory! +${endEv?.xp || 0} XP, +${endEv?.gold || 0}g`, 'gold');
    await stage.wait(600);
    if (node.type === 'boss') {
      const drop = ST.rollBossDrop(S, gate);
      if (drop) toast(`Boss drop: ${drop.name}`, 'gold');
      const result = ST.endRun(S, 'clear');
      results(result);
    } else {
      S.run.nodeIdx++;
      ST.save(S);
      AU.music('dungeon');
      dungeonScreen();
    }
  } else if (res.outcome === 'wipe') {
    AU.sfx('wipe');
    await stage.wait(700);
    const result = ST.endRun(S, 'wipe');
    results(result);
  } else { // retreat via flee
    const result = ST.endRun(S, 'retreat');
    results(result);
  }
}

function promptCommand(u, c) {
  return new Promise(resolve => {
    const area = $('#cmd-area');
    const opts = c.commandOptions(u);

    const pickTarget = (side, filter, cb) => {
      const list = c.units.filter(x => x.side === side && (filter ? filter(x) : x.hp > 0));
      area.innerHTML = `<div class="cmd-title">Target:</div><div class="cmd-list">` +
        list.map(x => `<button class="btn tgt" data-uid="${x.uid}">${esc(x.name)} <small>${Math.max(0, disp.get(x.uid).hp)}/${x.maxHp}</small></button>`).join('') +
        `</div><button class="btn ghost sm" id="cmd-back">← back</button>`;
      area.querySelectorAll('.tgt').forEach(b => b.onclick = () => { AU.sfx('confirm'); cb(b.dataset.uid); });
      $('#cmd-back').onclick = () => { AU.sfx('ui'); mainMenu(); };
    };

    const mainMenu = () => {
      const skillBtns = opts.skills.map(sk =>
        `<button class="btn skill ${sk.usable ? '' : 'disabled'}" data-id="${sk.id}" title="${esc(sk.desc)}${sk.rank ? ` (mastery ${'★'.repeat(sk.rank)})` : ''}">
          ${esc(sk.name)}${sk.rank ? `<small class="mastery">${'★'.repeat(sk.rank)}</small>` : ''}${sk.mp ? `<small>${sk.mp} MP</small>` : '<small>—</small>'}${sk.cd ? `<small class="danger">CD ${sk.cd}</small>` : ''}${sk.free ? '<small class="free-tag">FREE</small>' : ''}
        </button>`).join('');
      area.innerHTML = `
        <div class="cmd-title" style="color:${SPEAKERS[u.uid]?.color || '#fff'}">${esc(u.name)}'s turn <small class="muted">MP ${u.mp}/${u.maxMp}</small></div>
        <div class="cmd-list">${skillBtns}</div>
        <div class="row gap">
          <button class="btn sm" id="cmd-guard">🛡 Guard</button>
          <button class="btn sm ${opts.items.length ? '' : 'disabled'}" id="cmd-item">✚ Item</button>
          ${u.uid === 'player' ? '<button class="btn sm ghost" id="cmd-flee">⟲ Flee</button>' : ''}
        </div>`;

      area.querySelectorAll('.skill').forEach(b => {
        if (b.classList.contains('disabled')) return;
        b.onclick = () => {
          AU.sfx('ui');
          const sk = SKILLS[b.dataset.id];
          if (sk.target === 'enemy') pickTarget('enemy', null, uid => resolve({ kind: 'skill', id: b.dataset.id, target: uid }));
          else if (sk.target === 'ally') pickTarget('party', x => x.hp > 0, uid => resolve({ kind: 'skill', id: b.dataset.id, target: uid }));
          else { AU.sfx('confirm'); resolve({ kind: 'skill', id: b.dataset.id, target: null }); }
        };
      });
      $('#cmd-guard').onclick = () => { AU.sfx('confirm'); resolve({ kind: 'guard' }); };
      const itemBtn = $('#cmd-item');
      if (itemBtn && opts.items.length) itemBtn.onclick = () => {
        area.innerHTML = `<div class="cmd-title">Items:</div><div class="cmd-list">` +
          opts.items.map(it => `<button class="btn it" data-id="${it.id}" title="${esc(it.desc)}">${esc(it.name)} <small>×${it.n}</small></button>`).join('') +
          `</div><button class="btn ghost sm" id="cmd-back">← back</button>`;
        area.querySelectorAll('.it').forEach(b => b.onclick = () => {
          const it = opts.items.find(x => x.id === b.dataset.id);
          pickTarget('party', it.revive ? (x => x.hp <= 0) : (x => x.hp > 0), uid => resolve({ kind: 'item', id: it.id, target: uid }));
        });
        $('#cmd-back').onclick = mainMenu;
      };
      const flee = $('#cmd-flee');
      if (flee) flee.onclick = () => { AU.sfx('ui'); resolve({ kind: 'flee' }); };
    };
    mainMenu();
  });
}

// ------------------------------------------------------------------
// results & camp
// ------------------------------------------------------------------

async function results(result) {
  AU.music('guild');
  stage.battleCamera();
  stage.showcase(S.flags.yuki_member ? ['erin', 'player', 'sakura', 'shiro', 'yuki'] : ['erin', 'player', 'sakura', 'shiro'], heroVariant);
  stage.camBase.set(0, 2.1, 6.8);

  const titles = { clear: 'GATE CLEARED', retreat: 'WITHDREW FROM THE GATE', wipe: 'THE GATE SPAT YOU OUT' };
  const flavor = {
    clear: 'The gate scar seals behind you with a sound like a sigh.',
    retreat: 'Living to fight tomorrow is also a strategy — Shiro said so, twice.',
    wipe: 'You wake at the guild infirmary. Erin carried all three of you. Nobody talks about it.',
  };

  // level-up details
  const upsByHero = {};
  for (const up of result.levelUps) {
    (upsByHero[up.id] = upsByHero[up.id] || []).push(up.level);
  }
  const upHtml = Object.entries(upsByHero).map(([id, lvls]) => {
    const def = HEROES[id];
    const from = lvls[0] - 1, to = lvls[lvls.length - 1];
    const a = heroStatsAt(def, from), b = heroStatsAt(def, to);
    const gains = Object.keys(a).filter(k => b[k] > a[k]).map(k => `${k.toUpperCase()} +${b[k] - a[k]}`).join(' · ');
    return `<div class="sys-window">
      <div class="sys-head">[ LEVEL UP ]</div>
      <b style="color:${SPEAKERS[id].color}">${id === 'player' ? esc(S.name) : def.name}</b> — Lv ${from} → <b>Lv ${to}</b>
      <div class="muted sm-text">${gains}</div>
    </div>`;
  }).join('');
  if (result.levelUps.length) AU.sfx('levelup');

  const gearHtml = result.gear.length
    ? `<div class="loot-gear">${result.gear.map(g => `<span class="gear-chip t${g.tier}">${esc(g.name)}</span>`).join('')}</div>` : '';
  const itemsHtml = Object.keys(result.items).length
    ? `<div class="muted">Items: ${Object.entries(result.items).map(([k, v]) => `${ITEMS[k].name} ×${v}`).join(', ')}</div>` : '';

  screen(`
    <div class="panel results-panel ${result.outcome}">
      <h2>${titles[result.outcome]}</h2>
      <p class="muted">${flavor[result.outcome]} <b>${esc(result.gate.name)}</b> ${rankBadge(result.gate.rank)}</p>
      <div class="result-nums">
        <div><small>XP each</small><b>+${result.xp}</b></div>
        <div><small>Gold</small><b>+${result.gold}</b></div>
        <div><small>Guild points</small><b>+${result.gp}</b></div>
        ${result.bounty ? `<div><small>Rescue bounty</small><b class="gold">+${result.bounty}g</b></div>` : ''}
      </div>
      ${result.bounty ? `<p class="gold sm-text">⚑ ${esc(result.rescueParty)} walks out behind you — every one of them.</p>` : ''}
      ${result.partySize && result.partySize < 4 ? `<div class="muted sm-text">Focused party of ${result.partySize} — small-party XP bonus applied.</div>` : ''}
      ${gearHtml}${itemsHtml}
      <div class="ups">${upHtml}</div>
      <button class="btn primary" id="r-continue">Continue</button>
    </div>
  `, 'center');

  $('#r-continue').onclick = async () => {
    AU.sfx('confirm');
    if (result.outcome === 'clear' && result.gate.id !== 'monarch') {
      const ev = pickCampEvent(S, Math.random);
      if (ev && (ev.id !== 'banter' || Math.random() < 0.65)) {
        screen('', '');
        await playEvent(ev);
      }
    }
    guild();
  };
}

// ------------------------------------------------------------------
// party sheet
// ------------------------------------------------------------------

function party(sel = 'player') {
  ST.ensureYuki(S);
  ensureYukiPortrait();
  const ids = ST.roster(S);
  const h = S.heroes[sel];
  const def = HEROES[sel];
  const st = ST.heroStats(S, sel);
  const skills = ST.heroSkills(S, sel);
  const next = xpToNext(h.level);

  const tabs = ids.map(id => `<button class="tab ${id === sel ? 'on' : ''}" data-id="${id}" style="--tc:${SPEAKERS[id].color}">${id === 'player' ? esc(S.name) : HEROES[id].name}</button>`).join('');
  const statRows = ['hp', 'mp', 'atk', 'mag', 'def', 'res', 'agi', 'luk'].map(k =>
    `<div class="stat-row"><span>${k.toUpperCase()}</span><b>${st[k]}</b></div>`).join('');
  const skillRows = skills.map(id => {
    const sk = SKILLS[id];
    const rank = ST.masteryRank(S, sel, id);
    const uses = ST.masteryUses(S, sel, id);
    const nextAt = rank < 5 ? ST.MASTERY_THRESHOLDS[rank + 1] : null;
    const mTip = rank >= 5 ? `${uses} uses · mastered (+25% power, −20% MP)` : `${uses} uses · next rank at ${nextAt}${rank ? ` · +${rank * 5}% power` : ''}`;
    const isAuto = S.autoSkill[sel] === id;
    const autoBtn = isAuto ? `<button class="btn sm auto-set on" data-skill="${id}" title="This is ${sel === 'player' ? esc(S.name) : def.name}'s auto-battle skill. Tap to clear (auto falls back to Strike).">★ auto</button>`
      : rank >= 3 ? `<button class="btn sm ghost auto-set" data-skill="${id}" title="Use this skill in auto-battle when possible.">set auto</button>`
      : '<small class="muted" title="Reach ★★★ mastery to set as the auto-battle skill.">auto at ★★★</small>';
    return `<div class="skill-row"><b>${sk.name}</b><small class="mastery" title="${mTip}">${rank ? '★'.repeat(rank) : '☆'}</small><small>${sk.mp ? sk.mp + ' MP' : '—'}</small>${autoBtn}<p>${sk.desc || ''}</p></div>`;
  }).join('');
  const gearRows = ['weapon', 'armor', 'charm'].map(slot => {
    const g = h.gear[slot];
    return `<button class="gear-slot" data-slot="${slot}">
      <small>${slot}</small>
      ${g ? `<b class="t${g.tier}">${esc(g.name)}</b><span class="muted">${Object.entries(g.stats).map(([k, v]) => `${k}+${v}`).join(' ')}</span>${affixChip(g)}` : '<span class="muted">— empty —</span>'}
    </button>`;
  }).join('');

  screen(`
    <div class="panel sheet-panel">
      <div class="row spread">
        <h2>✦ Party</h2>
        <button class="btn ghost" id="p-back">← Guild</button>
      </div>
      <div class="tabs">${tabs}</div>
      <div class="sheet">
        <div class="sheet-left">
          ${portraitImg(sel, 'big')}
          <b class="sheet-name" style="color:${SPEAKERS[sel].color}">${sel === 'player' ? esc(S.name) : def.name}</b>
          <span class="muted">${heroDesc(S, sel).epithet} · ${heroDesc(S, sel).cls}</span>
          <div class="lvl">Lv ${h.level}</div>
          <div class="bar-outer xp"><div class="bar-inner" style="width:${h.xp / next * 100}%"></div></div>
          <small class="muted">${h.xp}/${next} XP</small>
          ${sel !== 'player' && sel in S.bond ? heartsFor(sel) : ''}
          <p class="bio">${heroDesc(S, sel).desc}</p>
          <p class="passive"><b>${def.passive.name}:</b> ${sel === 'player'
            ? `Levels grant outsized growth. Gains +${Math.round((0.1 + (S.legacy?.xpBoost || 0)) * 100)}% XP${S.legacy?.xpBoost ? ` (10% System + ${Math.round(S.legacy.xpBoost * 100)}% cycle legacy · party carries +${Math.round(S.legacy.xpBoost / 2 * 100)}%)` : ''}.`
            : def.passive.desc}</p>
        </div>
        <div class="sheet-mid"><h3>Stats</h3>${statRows}<h3>Gear</h3>${gearRows}</div>
        <div class="sheet-right"><h3>Skills</h3>
          <p class="muted sm-text">In auto-battle this hero uses <b>${S.autoSkill[sel] && SKILLS[S.autoSkill[sel]] ? SKILLS[S.autoSkill[sel]].name : 'Strike'}</b> when possible. Reach ★★★ mastery to set a different auto-skill.</p>
          ${skillRows}</div>
      </div>
    </div>
  `);
  $('#p-back').onclick = () => guild();
  document.querySelectorAll('.tab').forEach(t => t.onclick = () => { AU.sfx('ui'); party(t.dataset.id); });
  document.querySelectorAll('.gear-slot').forEach(gs => gs.onclick = () => gearPicker(sel, gs.dataset.slot));
  document.querySelectorAll('.auto-set').forEach(b => b.onclick = () => {
    const id = b.dataset.skill;
    if (S.autoSkill[sel] === id) delete S.autoSkill[sel];
    else S.autoSkill[sel] = id;
    AU.sfx('confirm');
    ST.save(S);
    party(sel);
  });
}

function gearPicker(heroId, slot) {
  const options = S.gearBag.filter(g => g.slot === slot);
  const cur = S.heroes[heroId].gear[slot];
  const modal = el(`<div class="modal-layer"><div class="panel modal">
    <h3>Equip ${slot} — ${heroId === 'player' ? esc(S.name) : HEROES[heroId].name}</h3>
    <div class="gear-list">
      ${cur ? `<button class="btn gear-opt" data-id="__unequip">Unequip ${esc(cur.name)}</button>` : ''}
      ${options.length ? options.map(g => `<button class="btn gear-opt" data-id="${g.id}">
        <b class="t${g.tier}">${esc(g.name)}</b> <small>${Object.entries(g.stats).map(([k, v]) => `${k}+${v}`).join(' ')}</small>${affixChip(g)}
      </button>`).join('') : '<p class="muted">No spare gear for this slot. Gates drop more.</p>'}
    </div>
    <button class="btn ghost" id="gp-close">Close</button>
  </div></div>`);
  document.body.appendChild(modal);
  modal.querySelector('#gp-close').onclick = () => modal.remove();
  modal.querySelectorAll('.gear-opt').forEach(b => b.onclick = () => {
    const h = S.heroes[heroId];
    if (b.dataset.id === '__unequip') {
      if (h.gear[slot]) S.gearBag.push(h.gear[slot]);
      h.gear[slot] = null;
    } else {
      const idx = S.gearBag.findIndex(g => g.id === b.dataset.id);
      if (idx >= 0) {
        const g = S.gearBag.splice(idx, 1)[0];
        if (h.gear[slot]) S.gearBag.push(h.gear[slot]);
        h.gear[slot] = g;
      }
    }
    AU.sfx('confirm');
    ST.save(S);
    modal.remove();
    party(heroId);
  });
}

// ------------------------------------------------------------------
// shop
// ------------------------------------------------------------------

function shop() {
  const stock = shopStock(S.rankIdx);
  const rows = stock.map(id => {
    const it = ITEMS[id];
    const owned = S.inventory[id] || 0;
    return `<div class="shop-row">
      <div><b>${it.name}</b> <small class="muted">×${owned} owned</small><p class="muted">${it.desc}</p></div>
      <button class="btn ${S.gold >= it.price ? '' : 'disabled'}" data-id="${id}">◈ ${it.price}g</button>
    </div>`;
  }).join('');
  const sellRows = S.gearBag.length ? S.gearBag.map(g => {
    const val = Math.max(5, Math.round(gearScore(g) * 4));
    return `<div class="shop-row"><div><b class="t${g.tier}">${esc(g.name)}</b> <small class="muted">${Object.entries(g.stats).map(([k, v]) => `${k}+${v}`).join(' ')}</small>${affixChip(g)}</div>
      <button class="btn sell" data-id="${g.id}" data-val="${val}">sell ◈ ${val}g</button></div>`;
  }).join('') : '<p class="muted">No spare gear to sell.</p>';

  screen(`
    <div class="panel shop-panel">
      <div class="row spread"><h2>◈ Guild Shop</h2><div class="row gap"><span class="gold">◈ ${S.gold}g</span> <button class="btn" id="s-smith">⚒ Smith</button> <button class="btn ghost" id="s-back">← Guild</button></div></div>
      <div class="shop-cols">
        <div><h3>Buy</h3>${rows}</div>
        <div><h3>Sell gear</h3><div class="sell-list">${sellRows}</div></div>
      </div>
    </div>
  `);
  $('#s-back').onclick = () => guild();
  $('#s-smith').onclick = () => { AU.sfx('ui'); smith(); };
  document.querySelectorAll('.shop-row button[data-id]:not(.sell):not(.forge)').forEach(b => b.onclick = () => {
    const it = ITEMS[b.dataset.id];
    if (S.gold < it.price) return;
    S.gold -= it.price;
    S.inventory[b.dataset.id] = (S.inventory[b.dataset.id] || 0) + 1;
    AU.sfx('coin');
    ST.save(S);
    shop();
  });
  document.querySelectorAll('.sell').forEach(b => b.onclick = () => {
    const idx = S.gearBag.findIndex(g => g.id === b.dataset.id);
    if (idx < 0) return;
    S.gearBag.splice(idx, 1);
    S.gold += Number(b.dataset.val);
    AU.sfx('coin');
    ST.save(S);
    shop();
  });
}

// ------------------------------------------------------------------
// the Character Forge — descriptions in, guildmates out
// ------------------------------------------------------------------

let forgeSalt = 0;
let forgeParsed = null;

async function forgePreviewPortrait(spec) {
  registerCustomActor('__preview', spec);
  return makePortrait('__preview');
}

async function forgeScreen(keepInput) {
  const away = ST.dispatchedIds(S);
  const saved = Object.values(S.custom || {});
  const savedRows = saved.length ? saved.map(d => {
    const inRoster = S.recruited.includes(d.id);
    const isAway = away.has(d.id);
    return `<div class="shop-row">
      <div>${portraitImg(d.id)}</div>
      <div style="flex:1"><b style="color:${d.color}">${esc(d.name)}</b> <small class="muted">${esc(d.cls)} · ${ROLE_INFO[d.role]?.icon || ''} ${ROLE_INFO[d.role]?.name || d.role}</small>
        <p class="muted sm-text">${inRoster ? (isAway ? 'in the field (dispatched)' : 'guild member') : 'awaiting summons (kept through cycles)'}</p></div>
      ${inRoster
        ? `<button class="btn sm danger f-release ${isAway ? 'disabled' : ''}" data-id="${d.id}" title="${isAway ? 'Cannot release while dispatched.' : 'Remove from the guild. Their gear returns to your bag; the forged soul stays saved here.'}">release</button>`
        : `<button class="btn sm f-resummon" data-id="${d.id}">summon</button> <button class="btn sm ghost danger f-forget" data-id="${d.id}" title="Delete this forged soul permanently.">forget</button>`}
    </div>`;
  }).join('') : '<p class="muted">No forged souls yet.</p>';

  // preview panel from the last parse
  let previewHtml = '<p class="muted center-text" style="margin-top:24px">Paste a character below — a Warlock\'s Codex card, a tavern-card JSON, or plain prose — and the Forge will read it.</p>';
  if (forgeParsed) {
    const p = forgeParsed;
    const src = await forgePreviewPortrait(p.spec);
    const kitNames = Object.entries(p.kit).map(([lv, id]) => `${SKILLS[id].name} <small class="muted">(Lv ${lv})</small>`).join(' · ');
    previewHtml = `
      <div class="forge-preview">
        <img class="portrait big" src="${src}" alt="">
        <div>
          <b style="font-size:1.05rem">${esc(p.card.name || 'Stranger')}</b> <small class="muted">${esc(p.cls)} · ${ROLE_INFO[p.role]?.icon || ''} ${ROLE_INFO[p.role]?.name}</small>
          ${p.features.length ? `<p class="sm-text gold">◆ ${p.features.join(' · ')}</p>` : '<p class="sm-text muted">no unusual features read</p>'}
          <p class="sm-text muted"><b>Kit:</b> ${kitNames}</p>
          <p class="sm-text muted"><b>Passive:</b> ${esc(p.passive.name)} — ${esc(p.passive.desc)}</p>
          <p class="sm-text muted"><b>Joins at:</b> Lv ${Math.max(20, (S.heroes.player?.level || 20) - 2)}</p>
          <div class="row gap" style="margin-top:8px">
            <button class="btn primary" id="f-summon">Summon to the guild</button>
            <button class="btn sm" id="f-reroll" title="Keep the description; reshuffle the ambiguous parts of the look.">⟲ reshuffle look</button>
          </div>
        </div>
      </div>`;
  }

  screen(`
    <div class="panel map-panel">
      <div class="row spread"><h2>⚗ The Character Forge</h2><button class="btn ghost" id="f-back">← Guild</button></div>
      <p class="muted">Feed the Forge a description and it reads out a soul: look, class, kit. Codex cards work as-is; so does plain prose. Rabbit ears, horns, wings, masks, shades and spirits — the Forge renders what it reads.</p>
      <div class="shop-cols">
        <div>
          <h3>Describe a soul</h3>
          <textarea id="f-input" rows="7" placeholder='{"name":"...","description":"..."}  — or just describe them in words'></textarea>
          <div class="row gap" style="margin-top:6px">
            <button class="btn" id="f-read">🜂 Read the description</button>
            <button class="btn sm ghost" id="f-scan" title="Scan this browser's Warlock's Codex storage (wc_chars / sanctum_chars) for characters.">scan Codex storage</button>
          </div>
          <div id="f-scan-out"></div>
          <div id="f-preview">${previewHtml}</div>
        </div>
        <div><h3>Forged souls</h3><div class="sell-list">${savedRows}</div></div>
      </div>
    </div>
  `);
  const input = $('#f-input');
  if (keepInput != null) input.value = keepInput;

  $('#f-back').onclick = () => { forgeParsed = null; guild(); };
  $('#f-read').onclick = () => {
    const v = input.value.trim();
    if (!v) { toast('The Forge needs words to read.'); return; }
    forgeSalt = 0;
    try { forgeParsed = parseCharacter(v, forgeSalt); } catch (e) { toast('The Forge could not read that: ' + e.message, 'danger'); return; }
    if (!forgeParsed.card.name) toast('No name found — the Forge will call them "Stranger" unless the text names them.');
    AU.sfx('magic');
    forgeScreen(v);
  };
  const rr = $('#f-reroll');
  if (rr) rr.onclick = () => {
    forgeParsed = parseCharacter(input.value.trim(), ++forgeSalt);
    AU.sfx('ui');
    forgeScreen(input.value);
  };
  const sm = $('#f-summon');
  if (sm) sm.onclick = async () => {
    const def = summonHero(forgeParsed, S);
    forgeParsed = null;
    ST.save(S);
    AU.sfx('promo');
    await refreshPortraits();
    screen('', '');
    await playEvent({ steps: [
      { s: 'narr', t: `The Forge's circle flares once, quietly, like a door being knocked on from the other side — and then ${def.name} is simply there, blinking in the guild-hall light, exactly as described.` },
      { s: def.id, t: `...So this is the guild the descriptions speak of. ${def.name}. ${def.cls}. (a beat, taking in the hall, the board, the faces) I don't know what I expected. It's warmer than the words made it sound.` },
      { s: 'guild', t: `(stamping a fresh license without so much as a raised eyebrow) ${def.name}, ${def.cls}, provisional membership. Leave it to the Fourth's table — I've stopped asking HOW people arrive. Welcome to the guild.` },
    ] });
    toast(`${def.name} joins the guild!`, 'gold');
    forgeScreen();
  };
  $('#f-scan').onclick = () => {
    const found = [];
    for (const key of ['wc_chars', 'sanctum_chars']) {
      try {
        const arr = JSON.parse(localStorage.getItem(key));
        if (Array.isArray(arr)) for (const c of arr) if (c && c.name) found.push(c);
      } catch (e) { /* absent or malformed */ }
    }
    const out = $('#f-scan-out');
    if (!found.length) { out.innerHTML = '<p class="muted sm-text">No Codex characters found in this browser\'s storage. (The Codex must be hosted on the same domain to share storage — otherwise paste a card.)</p>'; return; }
    out.innerHTML = '<p class="muted sm-text">Found in Codex storage:</p><div class="row gap wrap">' +
      found.slice(0, 20).map((c, i) => `<button class="btn sm f-card" data-i="${i}">${esc(c.name)}</button>`).join('') + '</div>';
    out.querySelectorAll('.f-card').forEach(b => b.onclick = () => {
      input.value = JSON.stringify(found[Number(b.dataset.i)], null, 1);
      AU.sfx('ui');
      toast('Card loaded — now Read the description.');
    });
  };
  document.querySelectorAll('.f-release:not(.disabled)').forEach(b => b.onclick = () => {
    const id = b.dataset.id;
    const def = S.custom[id];
    if (!confirm(`Release ${def.name} from the guild? Their gear returns to your bag; the forged soul stays saved at the Forge.`)) return;
    // release from roster but keep the forged definition
    const h = S.heroes[id];
    if (h) for (const slot of ['weapon', 'armor', 'charm']) { if (h.gear[slot]) S.gearBag.push(h.gear[slot]); }
    delete S.heroes[id];
    S.recruited = S.recruited.filter(x => x !== id);
    ST.save(S);
    toast(`${def.name} departs — the Forge keeps their pattern.`);
    forgeScreen();
  });
  document.querySelectorAll('.f-resummon').forEach(b => b.onclick = () => {
    const def = S.custom[b.dataset.id];
    def.startLevel = Math.max(20, (S.heroes.player?.level || 20) - 2);
    registerCustomHero(def);
    S.heroes[def.id] = { level: def.startLevel, xp: 0, gear: { weapon: null, armor: null, charm: null } };
    if (!S.recruited.includes(def.id)) S.recruited.push(def.id);
    ST.save(S);
    AU.sfx('promo');
    toast(`${def.name} rejoins the guild!`, 'gold');
    forgeScreen();
  });
  document.querySelectorAll('.f-forget').forEach(b => b.onclick = () => {
    const def = S.custom[b.dataset.id];
    if (!confirm(`Forget ${def.name} entirely? The forged soul is deleted for good.`)) return;
    releaseHero(S, def.id);
    ST.save(S);
    toast(`The Forge releases ${def.name}'s pattern to the wind.`);
    forgeScreen();
  });
}

// ------------------------------------------------------------------
// smith — reforging, on its own screen
// ------------------------------------------------------------------

function smith() {
  const groups = [
    { title: 'In your bag', targets: S.gearBag.map(g => ({ g, where: 'bag' })) },
    ...ST.roster(S).map(id => ({
      title: 'Equipped — ' + (id === 'player' ? S.name : HEROES[id].name),
      targets: ['weapon', 'armor', 'charm']
        .map(slot => ({ g: S.heroes[id].gear[slot], where: id }))
        .filter(x => x.g),
    })).filter(gr => gr.targets.length),
  ];
  const allTargets = groups.flatMap(gr => gr.targets);

  const groupHtml = gr => `
    <h3>${esc(gr.title)}</h3>
    ${gr.targets.length ? gr.targets.map(({ g }) => {
      const cost = reforgeCost(g);
      return `<div class="shop-row"><div><b class="t${g.tier}">${esc(g.name)}</b> <small class="muted">${Object.entries(g.stats).map(([k, v]) => `${k}+${v}`).join(' ')}</small>${affixChip(g)}</div>
        <button class="btn forge ${S.gold >= cost ? '' : 'disabled'}" data-id="${g.id}" title="${g.affix ? 'Reroll this affix into a different one.' : 'Imbue a random affix.'}">${g.affix ? 'reroll' : 'imbue'} ◈ ${cost}g</button></div>`;
    }).join('') : '<p class="muted">Nothing here.</p>'}`;

  screen(`
    <div class="panel shop-panel">
      <div class="row spread"><h2>⚒ Guild Smith</h2><div class="row gap"><span class="gold">◈ ${S.gold}g</span> <button class="btn" id="f-shop">◈ Shop</button> <button class="btn ghost" id="f-back">← Guild</button></div></div>
      <p class="muted">Reroll an affix into a different one, or imbue plain gear with a random affix. Costs scale with gear tier.</p>
      ${allTargets.length ? `<div class="shop-cols"><div>${groups.slice(0, Math.ceil(groups.length / 2)).map(groupHtml).join('')}</div><div>${groups.slice(Math.ceil(groups.length / 2)).map(groupHtml).join('')}</div></div>`
        : '<p class="muted">Nothing to work with — the smith shrugs. Gates drop more.</p>'}
    </div>
  `);
  $('#f-back').onclick = () => guild();
  $('#f-shop').onclick = () => { AU.sfx('ui'); shop(); };
  document.querySelectorAll('.forge:not(.disabled)').forEach(b => b.onclick = () => {
    const t = allTargets.find(x => x.g.id === b.dataset.id);
    if (!t) return;
    const cost = reforgeCost(t.g);
    if (S.gold < cost) return;
    S.gold -= cost;
    reforgeGear(t.g);
    AU.sfx('promo');
    toast(`The smith hands it back: ${t.g.name}`, 'gold');
    ST.save(S);
    smith();
  });
}

// ------------------------------------------------------------------
// settings
// ------------------------------------------------------------------

function settingsModal(back) {
  const s = S ? S.settings : { volume: 0.6, music: true, textFast: false, spice: 'gentle', outfit: 'adventure' };
  const startOutfit = s.outfit;
  const modal = el(`<div class="modal-layer"><div class="panel modal">
    <h3>⚙ Settings</h3>
    <label class="set-row">Volume <input type="range" id="set-vol" min="0" max="1" step="0.05" value="${s.volume}"></label>
    <label class="set-row">Music <input type="checkbox" id="set-music" ${s.music ? 'checked' : ''}></label>
    <label class="set-row">Instant text <input type="checkbox" id="set-fast" ${s.textFast ? 'checked' : ''}></label>
    <label class="set-row">Intimacy <select id="set-spice">
      <option value="gentle" ${s.spice === 'gentle' ? 'selected' : ''}>Gentle</option>
      <option value="steamy" ${s.spice === 'steamy' ? 'selected' : ''}>Steamy</option>
    </select></label>
    <label class="set-row">Party attire <select id="set-outfit">
      <option value="adventure" ${s.outfit === 'adventure' ? 'selected' : ''}>Adventuring</option>
      <option value="formal" ${s.outfit === 'formal' ? 'selected' : ''}>Formal</option>
    </select></label>
    ${S && S.cleared ? `
    <div class="ngplus-box">
      <b>⟲ Begin Cycle ${(S.legacy?.cycle || 0) + 2} (NG+)</b>
      <p class="muted sm-text">Restart the story. You keep <b>every piece of gear</b> (bag and equipped), all <b>skill mastery</b>, and your auto-skill picks. The System remembers: <b>+${Math.round(ST.legacyBoostFor(S) * 100)}% XP</b> for you, half that for the party — grown from this cycle's recursions, bonds, and levels.</p>
      <button class="btn sm" id="set-ngplus">Begin the next cycle</button>
    </div>` : ''}
    ${S ? `
    <div class="row gap">
      <button class="btn sm" id="set-export">Export save</button>
      <button class="btn sm" id="set-import">Import save</button>
      <button class="btn sm danger" id="set-wipe">Delete save</button>
    </div>
    <textarea id="save-blob" placeholder="save code appears / paste here"></textarea>` : ''}
    <button class="btn primary" id="set-close">Done</button>
  </div></div>`);
  document.body.appendChild(modal);
  const apply = () => {
    s.volume = Number(modal.querySelector('#set-vol').value);
    s.music = modal.querySelector('#set-music').checked;
    s.textFast = modal.querySelector('#set-fast').checked;
    s.spice = modal.querySelector('#set-spice').value;
    s.outfit = modal.querySelector('#set-outfit').value;
    AU.applySettings(s);
    if (S) { S.settings = s; ST.save(S); }
  };
  modal.querySelector('#set-vol').oninput = apply;
  modal.querySelector('#set-music').onchange = apply;
  modal.querySelector('#set-fast').onchange = apply;
  modal.querySelector('#set-spice').onchange = apply;
  modal.querySelector('#set-outfit').onchange = apply;
  if (S) {
    modal.querySelector('#set-export').onclick = () => { modal.querySelector('#save-blob').value = ST.exportSave(S); toast('Save code generated — copy it somewhere safe.'); };
    modal.querySelector('#set-import').onclick = () => {
      const v = modal.querySelector('#save-blob').value;
      const loaded = ST.importSave(v);
      if (loaded) { S = loaded; restoreCustomHeroes(S); ST.save(S); toast('Save imported.'); modal.remove(); guild(); }
      else toast('Invalid save code.', 'danger');
    };
    modal.querySelector('#set-wipe').onclick = () => {
      if (confirm('Delete the save? This cannot be undone.')) { ST.wipeSave(); S = null; modal.remove(); title(false); }
    };
    const ng = modal.querySelector('#set-ngplus');
    if (ng) ng.onclick = async () => {
      const boost = Math.round(ST.legacyBoostFor(S) * 100);
      if (!confirm(`Begin Cycle ${(S.legacy?.cycle || 0) + 2}? The story restarts from day one. You keep all gear and mastery, and the System's boost becomes +${boost}% XP. This replaces the current save.`)) return;
      modal.remove();
      S = ST.newGamePlus(S);
      ST.save(S);
      AU.sfx('gate');
      screen('', '');
      // the new cycle resets Yuki's reclassification (and any attire look):
      // rebuild the cached portraits before the replayed intro shows them
      await refreshPortraits();
      await playEvent(EVENTS.ngplus_wake);
      await playEvent(EVENTS.intro);
      await playEvent(EVENTS.recruit);
      guild();
    };
  }
  modal.querySelector('#set-close').onclick = () => {
    apply();
    modal.remove();
    // re-render so an attire change is reflected in the 3D showcase
    if (back && (!S || s.outfit !== startOutfit)) back();
  };
}
