// ============================================================
// GATEBOUND — UI screens & game flow orchestration
// ============================================================

import { RANKS, RANK_STYLE, HEROES, SKILLS, STATUSES, ITEMS, BIOMES, GATE_MODIFIERS, AFFIXES, xpToNext, heroStatsAt, gearScore, shopStock, GATE_GP } from './data.js';
import * as ST from './state.js';
import { Combat } from './combat.js';
import { Stage, makePortrait } from './scene3d.js';
import { EVENTS, SPEAKERS, DUNGEON_EVENTS, pickGuildEvent, pickCampEvent, endingFor } from './story.js';
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
  stage = new Stage($('#c3d'), $('#fx-overlay'));
  stage.setBiome(null);
  stage.start();
  window.GAME = { get S() { return S; }, stage, ST };

  document.addEventListener('pointerdown', () => AU.unlock(), { once: true });
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && advanceHandler) { e.preventDefault(); advanceHandler(); }
  });

  // portraits (placeholder renders; swap in automatically if GLBs exist)
  Promise.all(['player', 'erin', 'sakura', 'shiro', 'yuki'].map(async id => {
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
// Yuki's portrait switches to the reclassified render once his arc completes.
async function ensureYukiPortrait() {
  if (S && S.flags && S.flags.yuki_femme && PORTRAITS.__yukiFem !== true) {
    PORTRAITS.__yukiFem = true;
    PORTRAITS.yuki = await makePortrait('yuki', 'fem');
    document.querySelectorAll('img[data-portrait="yuki"]').forEach(img => { img.src = PORTRAITS.yuki; });
  }
}

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
  stage.showcase(['erin', 'player', 'sakura', 'shiro']);
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

function yukiTicker() {
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
  stage.showcase(S.flags.yuki_member ? ['erin', 'sakura', 'shiro', 'yuki'] : ['erin', 'sakura', 'shiro']);
  stage.camBase.set(0, 2.0, 6.2);

  // queued auto events (promotions etc.)
  while (S.queue.length) {
    const id = S.queue.shift();
    if (EVENTS[id]) { AU.sfx('promo'); await playEvent(EVENTS[id]); }
  }
  if (S.cleared && !S.seen.__ending) {
    S.seen.__ending = true;
    await playEvent(endingFor(S));
  }
  ST.save(S);

  const rank = RANKS[S.rankIdx];
  const need = ST.gpNeeded(S);
  const talkEv = pickGuildEvent(S);
  const pl = S.heroes.player;

  screen(`
    <div class="hud-top">
      <div class="panel bar">
        <span class="day">Day ${S.day}</span>
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
          <button class="btn big" id="g-shop">◈ Shop<small>potions & sundries</small></button>
          <button class="btn big ${talkEv ? 'notify' : ''}" id="g-talk">❝ Talk${talkEv ? '<em>!</em>' : ''}<small>guild hall gossip</small></button>
          <button class="btn big ghost" id="g-settings">⚙ Settings<small>save, audio, text</small></button>
        </div>
        <div class="yuki-ticker"><b>Letters & rumors:</b> ${yukiTicker()}</div>
      </div>
      <div class="panel party-strip">
        ${ST.roster(S).map(id => `
          <div class="pcard">
            ${portraitImg(id)}
            <div class="pinfo">
              <b style="color:${SPEAKERS[id].color}">${id === 'player' ? esc(S.name) : HEROES[id].name}</b>
              <span class="muted">Lv ${S.heroes[id].level} ${HEROES[id].cls}</span>
              ${id !== 'player' ? heartsFor(id) : `<span class="sys-tag">THE SYSTEM · Lv ${pl.level}</span>`}
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
  $('#g-settings').onclick = () => settingsModal(guild);
}

// ------------------------------------------------------------------
// world map
// ------------------------------------------------------------------

function map() {
  const cards = S.gates.map((g, i) => {
    const b = BIOMES[g.biome];
    const mod = GATE_MODIFIERS.find(m => m.id === g.modifier);
    return `
      <div class="gate-card ${g.id === 'monarch' ? 'monarch' : ''}" style="--rc:${RANK_STYLE[g.rank].color};--rg:${RANK_STYLE[g.rank].glow}">
        <div class="gate-head">${rankBadge(g.rank, 'lg')}<b>${esc(g.name)}</b></div>
        <div class="gate-meta">${b.name} · ${g.rooms} chambers + boss</div>
        ${mod && mod.name ? `<div class="gate-mod" title="${mod.desc}">◆ ${mod.name}</div>` : '<div class="gate-mod none">standard mana signature</div>'}
        <div class="gate-gp muted">clear: +${Math.round(GATE_GP[g.rank] * (g.modifier === 'unstable' ? 1.5 : 1))} GP</div>
        <button class="btn primary enter-gate" data-i="${i}">Enter Gate</button>
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

function partySelect(gate) {
  ST.ensureYuki(S);
  ensureYukiPortrait();
  const all = ST.roster(S);
  const chosen = new Set(all);
  const modal = el(`<div class="modal-layer"><div class="panel modal party-pick">
    <h3>Assemble your party — ${rankBadge(gate.rank)} ${esc(gate.name)}</h3>
    <p class="muted sm-text">Tap to include or bench a member. A smaller party earns <b>bonus XP each</b> — send a focused team to grind specific heroes.</p>
    <div class="pick-grid">
      ${all.map(id => `
        <button class="pick-card on" data-id="${id}">
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
    if (chosen.has(id)) chosen.delete(id); else chosen.add(id);
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

const NODE_ICONS = { fight: '⚔', treasure: '✦', event: '?', rest: '▲', boss: '☠' };

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

  if (node.type === 'fight' || node.type === 'boss') {
    const names = {};
    node.group.forEach(e => names[e.name] = (names[e.name] || 0) + 1);
    body = `<p>${node.type === 'boss' ? '<b class="danger">The boss chamber.</b> The air pressure doubles.' : 'Hostiles ahead:'}</p>
      <ul class="foes">${Object.entries(names).map(([n, c]) => `<li>${esc(n)}${c > 1 ? ` ×${c}` : ''}</li>`).join('')}</ul>`;
    actions = `<button class="btn primary" id="d-go">${node.type === 'boss' ? 'Challenge the Boss' : 'Engage'}</button>`;
  } else if (node.type === 'treasure') {
    body = '<p>A sealed cache glimmers in the gloom — gate-formed treasure, free for the quick.</p>';
    actions = '<button class="btn primary" id="d-go">Open it</button>';
  } else if (node.type === 'rest') {
    body = '<p>A defensible alcove. Shiro marks the sightlines; Erin already has the kettle out.</p>';
    actions = '<button class="btn primary" id="d-go">Rest (party recovers 30%)</button>';
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
    } else if (node.type === 'rest') {
      AU.sfx('heal');
      for (const id of run.partyIds) {
        const st = ST.heroStats(S, id);
        run.party[id].hp = Math.min(st.hp, Math.round(run.party[id].hp + st.hp * 0.3));
        run.party[id].mp = Math.min(st.mp, Math.round(run.party[id].mp + st.mp * 0.3));
      }
      toast('The party recovers.');
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

function unitCard(u, side) {
  const d = disp.get(u.uid);
  const stIcons = [...d.statuses].map(id => `<span class="st-ic ${STATUSES[id]?.kind}" title="${STATUSES[id]?.name}">${STATUSES[id]?.icon || '?'}</span>`).join('');
  return `<div class="ucard ${side} ${d.hp <= 0 ? 'dead' : ''} ${u.boss ? 'boss' : ''}" data-uid="${u.uid}">
    <div class="uname" style="${side === 'party' ? `color:${SPEAKERS[u.uid]?.color || '#fff'}` : ''}">${esc(u.name)}</div>
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
      <div class="panel slim"><b>${esc(gateName)}</b> · ${roomLabel} · <span id="round-label">round ${c.round || 1}</span></div>
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

  let res = c.step();
  for (let guard = 0; guard < 500; guard++) {
    await stage.playEvents(res.events, onApply);
    if (res.outcome) break;
    if (!res.needCommand) { res = c.step(); continue; }
    const cmd = await promptCommand(res.needCommand, c);
    res = c.step(cmd);
  }

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
        `<button class="btn skill ${sk.usable ? '' : 'disabled'}" data-id="${sk.id}" title="${esc(sk.desc)}">
          ${esc(sk.name)}${sk.mp ? `<small>${sk.mp} MP</small>` : '<small>—</small>'}${sk.cd ? `<small class="danger">CD ${sk.cd}</small>` : ''}
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
  stage.showcase(S.flags.yuki_member ? ['erin', 'player', 'sakura', 'shiro', 'yuki'] : ['erin', 'player', 'sakura', 'shiro']);
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
      </div>
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
    return `<div class="skill-row"><b>${sk.name}</b><small>${sk.mp ? sk.mp + ' MP' : '—'}</small><p>${sk.desc || ''}</p></div>`;
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
          <span class="muted">${def.epithet} · ${def.cls}</span>
          <div class="lvl">Lv ${h.level}</div>
          <div class="bar-outer xp"><div class="bar-inner" style="width:${h.xp / next * 100}%"></div></div>
          <small class="muted">${h.xp}/${next} XP</small>
          ${sel !== 'player' ? heartsFor(sel) : ''}
          <p class="bio">${def.desc}</p>
          <p class="passive"><b>${def.passive.name}:</b> ${def.passive.desc}</p>
        </div>
        <div class="sheet-mid"><h3>Stats</h3>${statRows}<h3>Gear</h3>${gearRows}</div>
        <div class="sheet-right"><h3>Skills</h3>${skillRows}</div>
      </div>
    </div>
  `);
  $('#p-back').onclick = () => guild();
  document.querySelectorAll('.tab').forEach(t => t.onclick = () => { AU.sfx('ui'); party(t.dataset.id); });
  document.querySelectorAll('.gear-slot').forEach(gs => gs.onclick = () => gearPicker(sel, gs.dataset.slot));
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
      <div class="row spread"><h2>◈ Guild Shop</h2><div><span class="gold">◈ ${S.gold}g</span> <button class="btn ghost" id="s-back">← Guild</button></div></div>
      <div class="shop-cols">
        <div><h3>Buy</h3>${rows}</div>
        <div><h3>Sell gear</h3><div class="sell-list">${sellRows}</div></div>
      </div>
    </div>
  `);
  $('#s-back').onclick = () => guild();
  document.querySelectorAll('.shop-row button[data-id]:not(.sell)').forEach(b => b.onclick = () => {
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
// settings
// ------------------------------------------------------------------

function settingsModal(back) {
  const s = S ? S.settings : { volume: 0.6, music: true, textFast: false };
  const modal = el(`<div class="modal-layer"><div class="panel modal">
    <h3>⚙ Settings</h3>
    <label class="set-row">Volume <input type="range" id="set-vol" min="0" max="1" step="0.05" value="${s.volume}"></label>
    <label class="set-row">Music <input type="checkbox" id="set-music" ${s.music ? 'checked' : ''}></label>
    <label class="set-row">Instant text <input type="checkbox" id="set-fast" ${s.textFast ? 'checked' : ''}></label>
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
    AU.applySettings(s);
    if (S) { S.settings = s; ST.save(S); }
  };
  modal.querySelector('#set-vol').oninput = apply;
  modal.querySelector('#set-music').onchange = apply;
  modal.querySelector('#set-fast').onchange = apply;
  if (S) {
    modal.querySelector('#set-export').onclick = () => { modal.querySelector('#save-blob').value = ST.exportSave(S); toast('Save code generated — copy it somewhere safe.'); };
    modal.querySelector('#set-import').onclick = () => {
      const v = modal.querySelector('#save-blob').value;
      const loaded = ST.importSave(v);
      if (loaded) { S = loaded; ST.save(S); toast('Save imported.'); modal.remove(); guild(); }
      else toast('Invalid save code.', 'danger');
    };
    modal.querySelector('#set-wipe').onclick = () => {
      if (confirm('Delete the save? This cannot be undone.')) { ST.wipeSave(); S = null; modal.remove(); title(false); }
    };
  }
  modal.querySelector('#set-close').onclick = () => { apply(); modal.remove(); if (back && !S) back(); };
}
