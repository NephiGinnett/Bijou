// ============================================================
// BINDING CODEX — UI screens & game flow orchestration
// ============================================================

import { RANKS, RANK_STYLE, HEROES, SKILLS, STATUSES, ITEMS, BIOMES, GATE_MODIFIERS, AFFIXES, xpToNext, heroStatsAt, gearScore, shopStock, GATE_GP, recruitOffers, reforgeCost, reforgeGear, ROLE_INFO, heroDesc,
  TAROT, TRIBES, FACTIONS, LOCATIONS, LAIR_POWER, ENEMIES, GATE_ROOMS, CAPTIVE_TRAITS, BEAST_FAMILIES, BEAST_TRAITS, REAGENTS, RECIPES, RECIPE_HINTS, PACTS, WARDEN_STYLES } from './data.js';
import * as ST from './state.js';
import { Combat, SEAL_MP } from './combat.js';
import { Stage, makePortrait } from './scene3d.js';
import { EVENTS, SPEAKERS, DUNGEON_EVENTS, BARGAIN_EVENTS, VISIT_LINES, TAUNT_LINES, READING_LINES, pickGuildEvent, pickCampEvent, pickCellEvent, endingFor, pickRumorEvent, rumorLine, releaseEventFor, checkIntimacyGates } from './story.js';
import { registerAlias, registerCustomActor, ACTOR_ACCENTS } from './actors3d.js';
import { installPacks, PACKS, LOOKS } from './packs/index.js';
import { BOWER_TALK } from './packs/wildkin.js';
import { GUESTS, GUEST_TALK } from './packs/guests.js';
import * as TOWN from './packs/rift.js';
import { install as installCompanions, hangoutSteps } from './companions.js';
import { UNBOUND, WHEN } from './unbound_lines.js';

// Character packs merge into the game tables before anything reads them.
installPacks();
installCompanions(EVENTS);
for (const [id, spec] of Object.entries(LOOKS)) {
  registerCustomActor(id, spec);
  ACTOR_ACCENTS[id] = parseInt(((HEROES[id] && HEROES[id].color) || '#c86cff').slice(1), 16);
}
import * as AU from './audio.js';
import { buildCells, buildPens, RESTRAINTS } from './keep3d.js';

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
  window.GAME = { get S() { return S; }, stage, ST, PORTRAITS };

  document.addEventListener('pointerdown', () => AU.unlock(), { once: true });
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && advanceHandler) { e.preventDefault(); advanceHandler(); }
  });

  checkIntimacyGates(); // logs a warning if any spice line can fire on a captive

  const saved = ST.load();
  if (saved) syncConverts(saved);
  refreshPortraits(true);
  title(!!saved);
}

// Reclaimed captives render with their faction's model.
// Heroes whose look borrows another builder (reclaimed leaders) need an alias.
for (const [id, def] of Object.entries(HEROES)) {
  if (def.model && def.model !== id && !LOOKS[id]) registerAlias(id, def.model, def.variant || null);
}

function syncConverts(state) {
  for (const id of Object.keys(state.converts || {})) {
    const def = HEROES[id];
    if (!def) continue;
    registerAlias(id, def.model, def.variant);
    ACTOR_ACCENTS[id] = parseInt((def.color || '#e8a87a').slice(1), 16);
    if (!SPEAKERS[id]) SPEAKERS[id] = { name: def.name, color: def.color || '#e8a87a' };
  }
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
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 2600);
}
function portraitImg(id, cls = '') {
  const src = PORTRAITS[id] || '';
  return `<img class="portrait ${cls}" data-portrait="${id}" src="${src}" alt="">`;
}
function rankBadge(rank, cls = '') {
  const st = RANK_STYLE[rank];
  return `<span class="circle-badge ${cls}" style="--rc:${st.color};--rg:${st.glow}">${st.glyph} ${rank}</span>`;
}
function heartsFor(who) {
  const b = S.bond[who] ?? 0;
  let out = '';
  for (let i = 0; i < 5; i++) out += `<span class="heart ${i < Math.round(b / 2) ? 'full' : ''}">♥</span>`;
  return `<span class="hearts" title="Bond ${b}/10">${out}</span>`;
}
function affixChip(g) {
  const a = g && g.affix ? AFFIXES[g.affix] : null;
  return a ? `<span class="affix" title="${esc(a.desc)}">◆ ${esc(a.desc)}</span>` : '';
}
function heroName(id) { return id === 'player' ? S.name : (HEROES[id] ? HEROES[id].name : (SPEAKERS[id] && SPEAKERS[id].name) || id); }
function heroColor(id) { return (SPEAKERS[id] && SPEAKERS[id].color) || (HEROES[id] && HEROES[id].color) || '#fff'; }
const TOON_IDS = ['player', 'vesper', 'rue', 'isolde'];
const OUTFITS = { adventure: 'Adventuring', formal: 'Formal', offduty: 'Off-duty' };
// The main cast's equipped gear and chosen outfit travel to the model builder.
function gearSig(id) {
  const h = S && S.heroes && S.heroes[id];
  if (!h || !h.gear) return '';
  return ['weapon', 'armor', 'charm'].map(sl => { const g = h.gear[sl]; return g ? `${g.name.split(' ').pop().toLowerCase()}.${g.tier}.${g.affix || ''}` : '-'; }).join(',');
}
// Per-character outfit picker (main cast only), shown on Allies and Companion pages.
function attirePick(id, elId) {
  if (!TOON_IDS.includes(id)) return '';
  const cur = S.wardrobe[id] || '';
  return `<label class="set-row sm-text">Attire <select id="${elId}"><option value="">Party default (${OUTFITS[S.settings.outfit || 'adventure']})</option>${Object.entries(OUTFITS).map(([k, v]) => `<option value="${k}" ${cur === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label>`;
}
function bindAttire(id, elId, back) {
  const sel = $('#' + elId);
  if (sel) sel.onchange = async () => {
    if (sel.value) S.wardrobe[id] = sel.value; else delete S.wardrobe[id];
    ST.save(S); await refreshPortraits(); back();
  };
}
function attireOf(id) { return (S && S.wardrobe && S.wardrobe[id]) || (S && S.settings.outfit) || 'adventure'; }
function heroVariant(id) {
  if (id === 'yuki' && S && S.flags && S.flags.yuki_femme) return 'fem';
  const base = id === 'player' && S ? S.pronouns + (S.flags.pact_wyrm_mantle ? '_mantle' : '') + (S.flags.scarred ? '_scar' : '') : null;
  if (!S || !TOON_IDS.includes(id)) return base;
  return `${base || ''}|g:${gearSig(id)}|o:${attireOf(id)}`;
}
function bar(cls, pct, title = '') {
  return `<div class="bar-outer ${cls} sm" title="${esc(title)}"><div class="bar-inner" style="width:${Math.max(0, Math.min(100, pct))}%"></div></div>`;
}

// Regenerate 2D portraits (player look follows pronoun choice; converts appear).
async function refreshPortraits(force = false) {
  const key = (S ? TOON_IDS.map(heroVariant).join('/') : 'she') + '|' + (S ? Object.keys(S.converts || {}).length : 0) + '|' + (S && S.flags && S.flags.yuki_femme ? 'yf' : '');
  if (!force && PORTRAITS.__key === key) return;
  PORTRAITS.__key = key;
  // heroes, plus pack characters who aren't party members (tribe envoys)
  const ids = [...new Set([...Object.keys(HEROES), ...Object.keys(LOOKS)])];
  await Promise.all(ids.map(async id => {
    PORTRAITS[id] = await makePortrait(id, heroVariant(id));
  }));
  document.querySelectorAll('img[data-portrait]').forEach(img => {
    const k = img.dataset.portrait;
    if (PORTRAITS[k]) img.src = PORTRAITS[k];
  });
}

// ------------------------------------------------------------------
// dialogue player
// ------------------------------------------------------------------

const TOKEN_CTX = {}; // {captive}, {ally} for Undercroft scenes

function subName(text) {
  if (!text) return '';
  const p = ST.PRONOUNS[(S && S.pronouns) || 'she'];
  const cap = w => w.charAt(0).toUpperCase() + w.slice(1);
  return text
    .replaceAll('{name}', S ? S.name : 'Zoe')
    .replaceAll('{They}', cap(p.they)).replaceAll('{Their}', cap(p.their))
    .replaceAll('{they}', p.they).replaceAll('{them}', p.them).replaceAll('{their}', p.their)
    .replaceAll('{theirs}', p.theirs).replaceAll('{themself}', p.themself)
    .replaceAll('{s}', p.s).replaceAll('{is}', p.is).replaceAll('{has}', p.has).replaceAll('{was}', p.was)
    .replaceAll('{captive}', TOKEN_CTX.captive || 'the captive')
    .replaceAll('{ally}', TOKEN_CTX.ally || 'your ally')
    .replaceAll('{kinWho}', TOKEN_CTX.kinWho || 'one of the tribe')
    .replaceAll('{kin}', TOKEN_CTX.kin || 'a tribeswoman')
    // {Y:they|she}: Yuki's pronouns, before and after Yuki's request
    .replace(/\{Y:([^|}]*)\|([^}]*)\}/g, (_, a, b) => (S && S.flags && S.flags.yuki_femme ? b : a));
}

// Intimacy tiers: Gentle shows gentle lines; Steamy shows steamy lines;
// Unbound plays the steamy line first, then continues with the unbound
// lines (an unwritten Unbound stub simply reads as Steamy).
function spiceVisible(st) {
  if (!st.spice) return true;
  const tier = S.settings.spice || 'gentle';
  if (tier === 'unbound') return st.spice === 'steamy' || st.spice === 'unbound';
  return st.spice === tier;
}
function goreVisible(st) {
  if (!st.gore) return true;
  return st.gore === (S.settings.gore || 'gentle');
}

// opts.replay: a Memory — replays a seen scene with no side effects at all.
export function playEvent(ev, opts = {}) {
  const replay = !!opts.replay;
  return new Promise(async resolve => {
    if (!ev) return resolve();
    if (!replay && ev.once && S.seen[ev.id]) return resolve();
    if (!replay && ev.id && ev.id !== 'banter') {
      S.seen[ev.id] = true;
      if (S.seenDay && S.seenDay[ev.id] == null) S.seenDay[ev.id] = S.day;
    }
    // romance guard: spice lines never show for someone who isn't a free ally
    const romanceOk = !ev.cond || ev.cond.__tribe ? (!ev.cond || ev.cond(S)) : (!ev.cond.__allies || ev.cond.__allies.every(id => ST.isAlly(S, id)));

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
        if (st.spice && (!romanceOk || !spiceVisible(st))) { idx++; continue; }
        if (!goreVisible(st)) { idx++; continue; }
        if (st.cond && !st.cond(S)) { idx++; continue; }
        if (replay && (st.flag || st.join || st.chronicle || st.capture || st.give || st.do)) { idx++; continue; }
        if (st.flag) { S.flags[st.flag] = true; idx++; continue; }
        if (st.do) { st.do(S); idx++; continue; }
        if (st.join) {
          if (!ST.isAlly(S, st.join)) { ST.joinAlly(S, st.join); toast(`${heroName(st.join)} joins you.`, 'gold'); AU.sfx('promo'); }
          idx++; continue;
        }
        if (st.chronicle) { ST.addChronicle(S, typeof st.chronicle === 'function' ? st.chronicle(S) : st.chronicle, ev.id); idx++; continue; }
        if (st.capture) { const c = ST.addNamedCaptive(S, st.capture); if (c) toast(`⛓ ${esc(c.name)} is taken to the Undercroft.`, 'gold'); idx++; continue; }
        if (st.give) {
          if (st.give.gold) { S.gold += st.give.gold; toast(`+${st.give.gold} gold`, 'gold'); }
          if (st.give.item) { S.inventory[st.give.item] = (S.inventory[st.give.item] || 0) + 1; }
          idx++; continue;
        }
        // a written Unbound stub: swap in Zoe's lines (docs/UNBOUND_GUIDE.md)
        if (st.spice === 'unbound' && !st.t && UNBOUND[st.stub || ev.id]) {
          const lines = UNBOUND[st.stub || ev.id].filter(l => typeof l === 'string' || !l.when || (WHEN[l.when] && WHEN[l.when](S)));
          steps.splice(idx, 1, ...lines.map(l => ({ s: st.s || 'narr', t: typeof l === 'string' ? l : l.t, spice: 'unbound' })));
          continue;
        }
        if (st.t === '' && !st.choice) { idx++; continue; } // unwritten stub
        if (typeof st.t === 'function') { const t = st.t(S); if (!t) { idx++; continue; } steps[idx] = { ...st, t }; }
        // (a computed line was just swapped into steps[idx], so render that, not st)
        if (steps[idx].choice) { renderChoice(steps[idx]); return; }
        renderLine(steps[idx]); return;
      }
      cleanup();
    };

    const cleanup = () => {
      advanceHandler = null;
      layer.remove();
      if (!replay) ST.save(S);
      resolve();
    };

    const renderLine = (st) => {
      const sid = st.s === 'kin' ? TOKEN_CTX.kinId : st.s; // whichever of the tribe is asking
      const sp = SPEAKERS[sid] || SPEAKERS.narr;
      const box = layer.querySelector('.dialogue-box');
      box.classList.toggle('narr', st.s === 'narr');
      box.classList.toggle('sysline', st.s === 'codex' || st.s === 'sys');
      box.classList.remove('brand-flash');
      // Rue's debt brand flares when she lies
      if (st.brand) { void box.offsetWidth; box.classList.add('brand-flash'); AU.sfx('crit'); }
      layer.querySelector('.d-name').innerHTML = esc(subName(sp.name)) + (st.brand ? '<span class="brand-tag">🔥 the brand flares</span>' : '');
      layer.querySelector('.d-name').style.color = sp.color;
      // whoever is speaking moves their mouth (rigged characters)
      if (stage && stage.speak && sid && sid !== 'narr') stage.speak(sid, Math.min(4, 0.6 + subName(st.t).length / 45));
      const pEl = layer.querySelector('.d-portrait');
      pEl.innerHTML = PORTRAITS[sid] ? portraitImg(sid) : '';
      pEl.style.display = PORTRAITS[sid] ? '' : 'none';
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
          // the choice is replaced by its responses (none: it is simply removed, and the next step moves up)
          if (replay) { steps.splice(idx, 1, ...(c.r || [])); showStep(); return; }
          if (c.bond) for (const [g, n] of Object.entries(c.bond)) {
            if (!(g in S.bond)) continue;
            ST.addBond(S, g, n);
            toast(`${heroName(g)} bond ${n > 0 ? '+' : ''}${n} ♥`, 'bond');
          }
          if (c.flag) S.flags[c.flag] = true;
          if (c.tone) { S.stats.tone = S.stats.tone || {}; S.stats.tone[c.tone] = (S.stats.tone[c.tone] || 0) + 1; }
          const fork = choiceIndex().get(st);
          if (fork) { S.pathsFrom ??= S.day; (S.choices ||= {})[fork.key] = { i: st.choice.indexOf(c), day: S.day }; }
          if (c.reopen && ev.id) delete S.seen[ev.id]; // rejections stay retryable
          steps.splice(idx, 1, ...(c.r || []));
          showStep();
        };
        box.appendChild(b);
      }
    };

    showStep();
  });
}

// Play queued auto events (inscriptions, arcs, releases) until the queue is empty.
async function drainQueue() {
  let guard = 0;
  while (S.queue.length && guard++ < 30) {
    const id = S.queue.shift();
    if (id.startsWith('release:')) { await releaseFlow(id.slice(8)); continue; }
    if (EVENTS[id]) { AU.sfx('promo'); await playEvent(EVENTS[id]); }
  }
  // auto events gated only by a condition (autoCond), e.g. the Undercroft opening
  for (const ev of Object.values(EVENTS)) {
    if (ev.autoCond && !(ev.once && S.seen[ev.id]) && (!ev.cond || ev.cond(S))) await playEvent(ev);
  }
}

// ------------------------------------------------------------------
// title & character creation
// ------------------------------------------------------------------

async function title(hasSave) {
  AU.music('title');
  stage.setBiome(null);
  stage.battleCamera();
  stage.showcase(['vesper', 'player', 'rue', 'isolde'], id => id === 'player' ? 'she' : null);
  stage.camBase.set(0, 2.1, 6.8);

  screen(`
    <div class="title-wrap">
      <div class="title-logo">
        <div class="title-top">THE WARLOCK'S CODEX presents</div>
        <h1>BINDING <span>CODEX</span></h1>
        <div class="title-sub">The Codex remembers every pact. Now it's writing yours.</div>
      </div>
      <div class="title-menu">
        ${hasSave ? '<button class="btn primary" id="bt-continue">Continue</button>' : ''}
        <button class="btn ${hasSave ? '' : 'primary'}" id="bt-new">New Game</button>
        <button class="btn ghost" id="bt-settings">Settings</button>
      </div>
      <div class="title-foot">Dark gothic fantasy · rated R · intimacy and gore are set in Settings</div>
    </div>
  `, 'center');

  if (hasSave) $('#bt-continue').onclick = async () => {
    AU.sfx('confirm');
    S = ST.load();
    syncConverts(S);
    AU.applySettings(S.settings);
    await refreshPortraits();
    if (S.run) { stage.setBiome(S.run.gate.biome); dungeonScreen(); }
    else hub();
  };
  $('#bt-new').onclick = () => { AU.sfx('confirm'); namePrompt(hasSave); };
  $('#bt-settings').onclick = () => settingsModal(() => title(hasSave));
}

function namePrompt(hasSave) {
  let pron = 'she';
  screen(`
    <div class="panel small center-panel">
      <h2>The mark is yours. What do they call you?</h2>
      <p class="muted">A warlock's mark, three days old. It has not once gone cold.</p>
      <input id="name-input" maxlength="14" placeholder="Zoe" autofocus>
      <p class="muted sm-text">Pronouns</p>
      <div class="pron-row">
        <button class="btn sm on" data-p="she">she/her</button>
        <button class="btn sm" data-p="he">he/him</button>
        <button class="btn sm" data-p="they">they/them</button>
      </div>
      <div class="row gap">
        <button class="btn primary" id="bt-start">Begin</button>
        <button class="btn ghost" id="bt-back">Back</button>
      </div>
      ${hasSave ? '<p class="warn">Starting a new game overwrites the existing Binding Codex save. (Gatebound saves are separate and untouched.)</p>' : ''}
    </div>
  `, 'center');
  document.querySelectorAll('.pron-row .btn').forEach(b => b.onclick = () => {
    pron = b.dataset.p;
    document.querySelectorAll('.pron-row .btn').forEach(x => x.classList.toggle('on', x === b));
    AU.sfx('ui');
  });
  const start = async () => {
    const name = $('#name-input').value.trim() || 'Zoe';
    S = ST.newGame(name, pron);
    AU.applySettings(S.settings);
    ST.save(S);
    AU.sfx('gate');
    await refreshPortraits(true);
    screen('', '');
    await playEvent(EVENTS.intro);
    await playEvent(EVENTS.envoy_brief);
    beginRun(ST.storyRift('drowned_stacks', S));
  };
  $('#bt-start').onclick = start;
  $('#name-input').onkeydown = e => { if (e.key === 'Enter') start(); };
  $('#bt-back').onclick = () => title(hasSave);
}

// ------------------------------------------------------------------
// the Codex library — hub
// ------------------------------------------------------------------

let rumorCycle = 0;

function letterTicker() {
  if (S.cleared) return 'The Heart is cold. The crows carry stranger letters now — invitations, mostly. Some of them are even polite.';
  if (S.captives.length) return `${S.captives.length} ${S.captives.length > 1 ? 'captives wait' : 'captive waits'} in the Undercroft. ${S.captives.filter(c => !S.wardens[c.id]).length ? 'Some have no warden — their brands are creeping back.' : 'Every cell has a warden.'}`;
  if (!S.flags.vesper_joined) return 'Vesper keeps glancing at the unturned card in her coat.';
  return 'Crows on the sill. One of them is carrying a black-wax letter it seems reluctant to deliver.';
}

// Story rifts you can ride out to from the hub.
function storyRiftOffers() {
  const out = [];
  if (!S.flags.vesper_joined && !S.flags.vesper_tenant) out.push({ id: 'drowned_stacks', label: '☾ Return to the Drowned Stacks', sub: 'the envoy is still down there' });
  if (S.flags.rue_map && !S.flags.rue_joined) out.push({ id: 'binding_trap', label: '⛧ Follow the blood map', sub: 'the Devil\'s market — a trap, ready' });
  if (S.flags.isolde_riders_ready && !S.flags.isolde_rune4) out.push({ id: 'oathbreaker', label: '⚖ Ride out to the six riders', sub: 'Isolde will not ask twice' });
  if (S.flags.dawnward_ready && !S.seen.dawnward_kneel) out.push({ id: 'dawnward_stand', label: '♡ Meet the Dawnward Company', sub: 'the Charmed Glade, at dawn' });
  return out;
}

async function hub() {
  AU.music('guild');
  stage.setBiome(null);
  stage.battleCamera();
  stage.showcase(ST.roster(S).slice(0, 5), heroVariant).then(() => { if (!hub.waved) { hub.waved = true; setTimeout(() => stage.wave('player'), 600); } });
  stage.camBase.set(0, 2.0, 6.2);

  await drainQueue();
  syncConverts(S);
  await refreshPortraits();
  // Endings: after the Heart, or once Mother Cinder is reclaimed.
  if (S.cleared && !S.seen.__ending && (!S.captives.some(c => c.named === 'cinder'))) {
    S.seen.__ending = true;
    await playEvent(endingFor(S));
  }
  // The hearth: after the ending, if there's family to come home to.
  if (S.seen.__ending && EVENTS.hearth_epilogue && !S.seen.hearth_epilogue && EVENTS.hearth_epilogue.cond(S)) await playEvent(EVENTS.hearth_epilogue);
  ST.save(S);

  const rank = RANKS[S.circleIdx];
  const need = ST.infamyNeeded(S);
  const talkEv = pickGuildEvent(S);
  const away = ST.dispatchedIds(S);
  const offers = recruitOffers(S);
  const newReports = S.dispatchReports.filter(r => !r.seen).length;
  const stories = storyRiftOffers();
  const releaseReady = S.captives.some(c => c.releasePending);
  const unwarded = S.captives.filter(c => !S.wardens[c.id]).length;
  const hungry = S.menagerie.filter(b => !b.fed).length;
  const suitors = Object.keys(TRIBES).filter(t => S.tribes[t] && S.tribes[t].suitor && ST.envoyHere(S, t)).length;
  const dayLog = (S.dayLog || []).slice(0, 4);

  screen(`
    <div class="hud-top">
      <div class="panel bar">
        <span class="day">Day ${S.day}${S.legacy && S.legacy.cycle ? ` · Cycle ${S.legacy.cycle + 1}` : ''}</span>
        <span class="lic">Circle ${rankBadge(rank)}</span>
        <div class="gp-wrap" title="Infamy: earned by clearing rifts. Fill it to rise to the next Circle.">
          <span class="hud-label">Infamy</span>
          <div class="bar-outer gp"><div class="bar-inner" style="width:${need ? Math.min(100, S.infamy / need * 100) : 100}%"></div></div>
          <span class="gp-num">${need ? `${S.infamy}/${need}` : 'ABYSS'}</span>
        </div>
        <div class="corrupt-wrap" title="Corruption: pacts, Blackblood, killing what you could have sealed. 50+ opens Slot VI; 80+ and captives fear you.">
          <span class="hud-label">Corruption</span>${bar('corrupt', S.corruption)}<span class="corrupt-num">☩ ${S.corruption}</span>
        </div>
        <span class="gold">◈ ${S.gold}g</span>
      </div>
      ${standingStrip()}
    </div>
    <div class="guild-layout">
      <div class="panel guild-main">
        <h2>The Codex — Drowned Library</h2>
        <p class="muted">${S.cleared ? 'The Heart is cold. The Codex keeps writing anyway.' : S.flags.vesper_joined ? 'Candles lean toward you as you pass. Vesper has the cards out.' : 'Ink bleeds down ten thousand spines. The envoy is still somewhere below.'}</p>
        ${dayLog.length ? `<div class="day-log">${dayLog.map(l => esc(l)).join('<br>')}</div>` : ''}
        ${stories.length ? `<div class="row gap wrap" style="margin-bottom:8px">${stories.map(o => `<button class="btn primary story-rift" data-id="${o.id}">${o.label}<small>${esc(o.sub)}</small></button>`).join('')}</div>` : ''}
        <div class="menu-grid">
          <button class="btn big primary" id="g-map">⌖ Expedition<small>raid a rival or roam the wild</small></button>
          ${ST.isAlly(S, 'vesper') ? `<button class="btn big ${ST.canRead(S) ? 'notify' : ''}" id="g-read">🂠 Vesper's Reading${ST.canRead(S) ? '<em>!</em>' : ''}<small>${S.omen && S.omen.day === S.day ? TAROT[S.omen.card].icon + ' ' + TAROT[S.omen.card].name : 'a free card, every day'}</small></button>` : ''}
          ${Object.values(S.tribes || {}).some(t => t.status) ? `<button class="btn big ${Object.keys(S.tribes).some(id => ST.tribeRequest(S, id)?.ok) ? 'notify' : ''}" id="g-tribes">🪶 Wild Tribes<small>${Object.values(S.tribes).filter(t => t.status === 'sworn').length} sworn</small></button>` : ''}
          ${S.flags.vesper_joined ? `<button class="btn big" id="g-rivals">⚔ Rivals<small>${Object.values(S.factions).filter(f => f.fate).length}/5 dominated</small></button>` : ''}
          <button class="btn big" id="g-party">✦ Allies<small>stats, skills & gear</small></button>
          ${S.flags.undercroft_open ? `<button class="btn big ${releaseReady || unwarded ? 'notify' : ''}" id="g-under">⛓ Undercroft${releaseReady || unwarded ? '<em>!</em>' : ''}<small>${S.captives.length} captive${S.captives.length === 1 ? '' : 's'}${unwarded ? ` · ${unwarded} unwarded` : ''}</small></button>` : ''}
          ${S.menagerie.length || S.eggs.length || S.stats.captures || Object.keys(TRIBES).some(t => ST.envoyHere(S, t)) ? `<button class="btn big ${hungry || suitors ? 'notify' : ''}" id="g-men">🐾 Menagerie${hungry || suitors ? '<em>!</em>' : ''}<small>${S.menagerie.length}/${S.pens} pens${hungry ? ` · ${hungry} hungry` : ''}${suitors ? ` · ${suitors} waiting in the Bower` : Object.keys(TRIBES).some(t => ST.envoyHere(S, t)) ? ' · envoys visiting' : ''}</small></button>` : ''}
          ${Object.values(S.reagents).some(n => n > 0) || S.recipes.length || S.menagerie.length ? '<button class="btn big" id="g-alch">⚗ Alchemy<small>the cauldron</small></button>' : ''}
          ${S.flags.altar_open ? '<button class="btn big" id="g-altar">☩ Pact Altar<small>power, for a price</small></button>' : ''}
          <button class="btn big" id="g-shop">◈ Market<small>potions, gear & pens</small></button>
          ${ST.packOn(S, 'rift') && TOWN.townOpen(S) ? `<button class="btn big ${townNews() ? 'notify' : ''}" id="g-town">🏘 Larkspur Lane${townNews() ? '<em>!</em>' : ''}<small>townsfolk, shops & quests</small></button>` : ''}
          <button class="btn big ${talkEv ? 'notify' : ''}" id="g-talk">❝ Talk${talkEv ? '<em>!</em>' : ''}<small>the household</small></button>
          <button class="btn big" id="g-chron">📖 Chronicle<small>what the Codex wrote</small></button>
          ${ST.roster(S).length >= 4 ? `<button class="btn big ${newReports ? 'notify' : ''}" id="g-dispatch">✈ Dispatch${newReports ? '<em>!</em>' : ''}<small>${S.dispatch.length ? S.dispatch.length + ' out' : 'send allies to a rift'}</small></button>` : ''}
          ${offers.length ? `<button class="btn big notify" id="g-newcomers">➤ Petitions<em>!</em><small>${offers.length} at the stair</small></button>` : ''}
          <button class="btn big ghost" id="g-settings">⚙ Settings<small>save, audio, intimacy, gore</small></button>
        </div>
        <div class="row gap" style="margin-top:8px">
          <button class="btn sm ghost" id="g-rest" title="Advance to the next day: the Undercroft and Menagerie tick, dispatched allies return, a new hand is dealt.">▸ Rest until tomorrow</button>
        </div>
        <button class="yuki-ticker ticker-btn ${pickRumorEvent(S) ? 'notify' : ''}" id="g-rumors" title="Tap for the day's letters.">
          <b>Crows & letters${pickRumorEvent(S) ? ' <em>!</em>' : ''}:</b> ${esc(letterTicker())}
        </button>
      </div>
      <div class="panel party-strip">
        ${ST.roster(S).map(id => `
          <div class="pcard ${away.has(id) ? 'away' : ''} ${id !== 'player' ? 'pcard-click' : ''}" data-id="${id}" ${id !== 'player' ? `title="Spend time with ${esc(heroName(id))}"` : ''}>
            ${portraitImg(id)}
            <div class="pinfo">
              <b style="color:${heroColor(id)}">${esc(heroName(id))}</b>
              <span class="muted">Lv ${S.heroes[id].level} ${heroDesc(S, id).cls}${away.has(id) ? ' · <b class="gold">away</b>' : ''}</span>
              ${id !== 'player' && ST.hangoutOpen(S, id) && !away.has(id) ? '<span class="pc-free">♡ free today</span>' : ''}
              ${id === 'player' ? `<span class="sys-tag">THE MARK · +${Math.round((0.1 + (S.legacy?.xpBoost || 0)) * 100)}% XP</span>` : id in S.bond ? heartsFor(id) : `<span class="muted sm-text">${heroDesc(S, id).epithet}</span>`}
            </div>
          </div>`).join('')}
      </div>
    </div>
  `);

  const on = (id, fn) => { const b = $('#' + id); if (b) b.onclick = fn; };
  document.querySelectorAll('.pcard-click').forEach(c => c.onclick = () => { AU.sfx('ui'); companion(c.dataset.id); });
  on('g-map', () => { AU.sfx('confirm'); worldMap(); });
  on('g-read', () => { AU.sfx('confirm'); vesperReading(); });
  on('g-rivals', () => { AU.sfx('ui'); rivals(); });
  on('g-tribes', () => { AU.sfx('ui'); tribes(); });
  on('g-party', () => { AU.sfx('ui'); party(); });
  on('g-under', () => { AU.sfx('ui'); undercroft(); });
  on('g-men', () => { AU.sfx('ui'); menagerie(); });
  on('g-alch', () => { AU.sfx('ui'); alchemy(); });
  on('g-altar', () => { AU.sfx('ui'); altar(); });
  on('g-shop', () => { AU.sfx('ui'); shop(); });
  on('g-town', () => { AU.sfx('ui'); town(); });
  on('g-chron', () => { AU.sfx('ui'); chronicle(); });
  on('g-talk', async () => {
    AU.sfx('ui');
    const ev = pickGuildEvent(S);
    if (ev) { await playEvent(ev); hub(); }
    else toast('The household is quiet tonight. Draw a rift.');
  });
  on('g-dispatch', () => { AU.sfx('ui'); dispatchBoard(); });
  on('g-rumors', async () => {
    AU.sfx('ui');
    const ev = pickRumorEvent(S);
    if (ev) await playEvent(ev);
    else await playEvent({ id: 'rumor_flavor', steps: [{ s: 'crow', t: rumorLine(S, rumorCycle++) }] });
    hub();
  });
  on('g-newcomers', () => { AU.sfx('ui'); newcomers(); });
  on('g-rest', () => {
    AU.sfx('confirm');
    ST.advanceDay(S);
    ST.save(S);
    toast(`Day ${S.day} — a new hand waits on the board.`);
    hub();
  });
  on('g-settings', () => settingsModal(hub));
  document.querySelectorAll('.story-rift').forEach(b => b.onclick = () => {
    AU.sfx('confirm');
    const gate = ST.storyRift(b.dataset.id, S);
    partySelect(gate);
  });
}

// A brand burns out: play the release scene and resolve Join / Leave / Relapse.
async function releaseFlow(capId) {
  const cap = S.captives.find(c => c.id === capId);
  if (!cap) return;
  const outcome = ST.releaseOutcome(cap);
  S.flags.__release = outcome;
  TOKEN_CTX.captive = cap.name;
  AU.sfx('promo');
  await playEvent(releaseEventFor(cap, outcome));
  delete S.flags.__release;
  const heroId = ST.releaseCaptive(S, capId, outcome);
  if (heroId) {
    syncConverts(S);
    await refreshPortraits(true);
    toast(`${cap.name} joins you, free.`, 'gold');
  } else toast(outcome === 'relapse' ? `${cap.name} went back to the Coven.` : `${cap.name} walks free.`);
  ST.addChronicle(S, outcome === 'join' ? `${cap.name} was reclaimed and chose to stay.` : outcome === 'leave' ? `${cap.name} was reclaimed and walked free.` : `${cap.name} slipped back to the Coven.`);
  ST.save(S);
}

// ------------------------------------------------------------------
// petitions (hub recruits)
// ------------------------------------------------------------------

async function newcomers() {
  const offers = recruitOffers(S);
  if (!offers.length) { hub(); return; }
  screen(`
    <div class="panel map-panel">
      <div class="row spread">
        <h2>➤ Petitions at the Drowned Stair</h2>
        <button class="btn ghost" id="n-back">← Codex</button>
      </div>
      <p class="muted">Word of your inscription travels by crow. People keep arriving at the stair, asking for the warlock who seals the Coven.</p>
      <div class="gate-grid">
        ${offers.map(h => `
          <div class="gate-card recruit-card">
            <div class="recruit-head">${portraitImg(h.id)}<div><b style="color:${heroColor(h.id)}">${h.name}</b><br><small class="muted">${h.epithet} · ${h.cls}</small></div></div>
            <p class="muted sm-text">${esc(h.desc)}</p>
            <div class="gate-meta">${ROLE_INFO[h.role]?.icon || ''} ${ROLE_INFO[h.role]?.name || h.role} · joins near your level</div>
            <button class="btn primary hear-out" data-id="${h.id}">Hear them out</button>
          </div>`).join('')}
      </div>
    </div>
  `);
  $('#n-back').onclick = () => hub();
  document.querySelectorAll('.hear-out').forEach(b => b.onclick = async () => {
    const id = b.dataset.id;
    AU.sfx('confirm');
    screen('', '');
    await playEvent(EVENTS['recruit_intro_' + id]);
    if (S.flags['recruit_' + id + '_accept'] && !ST.isAlly(S, id)) {
      ST.joinAlly(S, id);
      AU.sfx('promo');
      toast(`${HEROES[id].name} joins the Codex!`, 'gold');
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
  const gates = Object.keys(LOCATIONS).filter(id => !LOCATIONS[id].lair && ST.locationOpen(S, id).ok).map(id => ST.makeExpedition(S, id));
  const missionRows = S.dispatch.length ? S.dispatch.map(m => `
    <div class="shop-row">
      <div><b>${rankBadge(m.gate.rank)} ${esc(m.gate.name)}</b>
        <p class="muted sm-text">${m.team.map(heroName).join(', ')} · returns after the next day</p></div>
      <span class="muted">${Math.round(m.chance * 100)}%</span>
    </div>`).join('') : '<p class="muted">No one is out.</p>';
  const reportRows = reports.length ? reports.slice(0, 8).map(r => `
    <div class="shop-row report ${r.success ? 'ok' : 'fail'}">
      <div><b>${r.success ? '✔' : '✘'} ${rankBadge(r.gate.rank)} ${esc(r.gate.name)}</b>
        <p class="muted sm-text">${r.team.map(heroName).join(', ')} — ${r.success
          ? `cleared it! +${r.gp} Infamy, +${r.gold}g, +${r.xp} XP each${r.gear ? `, found ${esc(r.gear.name)}` : ''}`
          : `driven back. +${r.xp} XP each`}</p></div>
      <span class="muted sm-text">day ${r.day}</span>
    </div>`).join('') : '<p class="muted">No reports yet.</p>';

  screen(`
    <div class="panel map-panel">
      <div class="row spread"><h2>✈ Dispatch</h2><button class="btn ghost" id="dp-back">← Codex</button></div>
      <p class="muted">Send allies to raid a holding on their own (it drains the owner's Power too) — they return after the next day. Balanced teams travel safer: ${Object.values(ROLE_INFO).map(r => `${r.icon} ${r.name}`).join(' · ')}. (Dispatched teams don't seal anything.)</p>
      <div class="shop-cols">
        <div>
          <h3>Today's cards</h3>
          ${gates.length ? gates.map(g => `
            <div class="shop-row">
              <div><b>${rankBadge(g.rank)} ${esc(g.name)}</b> <small class="muted">${g.faction ? FACTIONS[g.faction].icon + ' ' : ''}${BIOMES[g.biome].name}</small></div>
              <button class="btn send-to" data-loc="${g.loc}">assemble team</button>
            </div>`).join('') : '<p class="muted">No rifts to send anyone into today.</p>'}
          <h3>In the field</h3>${missionRows}
        </div>
        <div><h3>Reports</h3><div class="sell-list">${reportRows}</div></div>
      </div>
    </div>
  `);
  for (const r of S.dispatchReports) r.seen = true;
  ST.save(S);
  $('#dp-back').onclick = () => hub();
  document.querySelectorAll('.send-to').forEach(b => b.onclick = () => { AU.sfx('ui'); dispatchTeamPick(ST.makeExpedition(S, b.dataset.loc)); });
}

function dispatchTeamPick(gate) {
  const away = ST.dispatchedIds(S);
  const pool = ST.roster(S).filter(id => id !== 'player' && !away.has(id));
  if (!pool.length) { toast('Everyone is either with you or already out.'); return; }
  const chosen = new Set();
  const modal = el(`<div class="modal-layer"><div class="panel modal party-pick">
    <h3>Dispatch — ${rankBadge(gate.rank)} ${esc(gate.name)}</h3>
    <p class="muted sm-text">You stay at the Codex. Pick who goes; roles stack the odds.</p>
    <div class="pick-grid">
      ${pool.map(id => `
        <button class="pick-card" data-id="${id}">
          ${portraitImg(id)}
          <b style="color:${heroColor(id)}">${esc(heroName(id))}</b>
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
    info.innerHTML = `${chosen.size} · avg Lv ${f.avg} vs ~${f.bench} · <b class="${f.chance >= 0.65 ? 'gold' : f.chance >= 0.4 ? '' : 'danger'}">${Math.round(f.chance * 100)}% success</b>`;
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
    toast(`${[...chosen].map(heroName).join(', ')} set out for ${gate.name}.`, 'gold');
    modal.remove();
    dispatchBoard();
  };
}

// ------------------------------------------------------------------
// the world map — holdings of the rival factions, and the wild
// ------------------------------------------------------------------

function factionBar(fid) {
  const f = S.factions[fid];
  const F = FACTIONS[fid];
  if (f.fate) return `<span class="fate-tag" style="color:${F.color}">${F.icon} ${f.fate.toUpperCase()}</span>`;
  return `<div class="power-row" title="${esc(F.name)} Power — at ${LAIR_POWER} or below, ${esc(F.leaderName)}'s lair opens">
    <span style="color:${F.color}">${F.icon}</span>${bar('power', f.power)}<span class="power-num">${f.power}</span></div>`;
}

function worldMap() {
  const ids = Object.keys(LOCATIONS);
  const groups = [{ id: null, name: 'The Wild', icon: '🌑', color: '#a89cb8' }, ...Object.entries(FACTIONS).map(([id, F]) => ({ id, ...F }))];
  const card = (locId) => {
    const L = LOCATIONS[locId];
    const open = ST.locationOpen(S, locId);
    const rIdx = ST.expeditionRank(S, locId);
    const mod = GATE_MODIFIERS.find(m => m.id === L.modifier);
    const lt = ST.pendingLieutenant(S, locId);
    const visits = S.visits[locId] || 0;
    const dom = L.faction && ST.dominated(S, L.faction);
    return `<div class="gate-card loc-card ${L.lair ? 'lair' : ''} ${open.ok ? '' : 'locked'}" style="--rc:${RANK_STYLE[RANKS[rIdx]].color};--rg:${RANK_STYLE[RANKS[rIdx]].glow}">
      <div class="gate-head">${rankBadge(RANKS[Math.min(rIdx, 5)])}<b>${L.lair ? '♛ ' : ''}${esc(L.name)}</b></div>
      <div class="gate-meta">${BIOMES[L.biome].name} · ${L.rooms || GATE_ROOMS[RANKS[rIdx]]} chambers + ${L.lair ? 'leader' : 'boss'}${visits ? ` · cleared ×${visits}` : ''}</div>
      <p class="muted sm-text">${esc(L.desc)}</p>
      ${mod && mod.name ? `<div class="gate-mod" title="${esc(mod.desc)}">◆ ${mod.name}</div>` : ''}
      ${lt ? `<div class="gate-mod rescue">★ ${esc(ENEMIES[lt].name)} holds this place</div>` : ''}
      ${dom && !L.lair ? '<div class="gate-mod none">dominated — patrol for spoils</div>' : ''}
      ${open.ok ? `<button class="btn primary raid" data-id="${locId}">${L.lair ? 'Storm the lair' : L.faction && !dom ? 'Raid' : 'Explore'}</button>`
        : `<button class="btn disabled">${esc(open.why)}</button>`}
    </div>`;
  };
  // Each region folds up; which ones are open is remembered on this device.
  let openSet = null;
  try { openSet = JSON.parse(localStorage.getItem('bc_map_open') || 'null'); } catch (e) { openSet = null; }
  const sections = groups.map(gr => {
    const locs = ids.filter(id => LOCATIONS[id].faction === gr.id && (!LOCATIONS[id].lair || !ST.locationOpen(S, id).done));
    if (!locs.length) return '';
    const key = gr.id || 'wild';
    const ready = locs.filter(id => ST.locationOpen(S, id).ok);
    const lairOpen = locs.some(id => LOCATIONS[id].lair && ST.locationOpen(S, id).ok);
    const held = locs.some(id => ST.pendingLieutenant(S, id));
    const isOpen = openSet ? openSet.includes(key) : key === 'wild';
    const dom = gr.id && ST.dominated(S, gr.id);
    return `<details class="faction-section" data-key="${key}" ${isOpen ? 'open' : ''}>
      <summary class="row spread"><h3 style="color:${gr.color}">${gr.icon} ${esc(gr.name)} <small class="muted region-count">${ready.length}/${locs.length} open${dom ? ' · dominated' : ''}</small>${lairOpen ? ' <span class="region-flag lair">♛ lair open</span>' : ''}${held ? ' <span class="region-flag">★ held</span>' : ''}</h3>${gr.id ? factionBar(gr.id) : ''}</summary>
      <div class="gate-grid">${locs.map(card).join('')}</div>
    </details>`;
  }).join('');
  const echo = S.cleared ? `<div class="faction-section"><h3>☠ Beyond the Heart</h3><div class="gate-grid"><div class="gate-card lair"><div class="gate-head"><b>Echoes of the Heart</b></div><p class="muted sm-text">The Heart remembers. Deeper every time.</p><button class="btn primary" id="echo-go">Descend</button></div></div></div>` : '';
  const om = S.omen && S.omen.day === S.day ? TAROT[S.omen.card] : null;

  screen(`
    <div class="panel map-panel">
      <div class="row spread">
        <h2>⌖ The Dead City & Beyond — Day ${S.day}</h2>
        <button class="btn ghost" id="m-back">← Codex</button>
      </div>
      <p class="muted">Raid a rival's holdings to drain its Power; seal its people to drain it faster. At ${LAIR_POWER} Power or less, its leader's lair opens. One expedition a night. ${om ? `<b class="gold">Tonight's card: ${om.icon} ${om.name} — ${esc(om.boon)}</b>` : ST.canRead(S) ? '<b>Vesper hasn\'t read the cards yet today.</b>' : ''}</p>
      <div class="scroll-list">${echo}${sections}</div>
    </div>
  `);
  $('#m-back').onclick = () => hub();
  document.querySelectorAll('details.faction-section').forEach(d => d.ontoggle = () => {
    const keys = [...document.querySelectorAll('details.faction-section[open]')].map(x => x.dataset.key);
    try { localStorage.setItem('bc_map_open', JSON.stringify(keys)); } catch (e) { /* private mode */ }
  });
  const eg = $('#echo-go'); if (eg) eg.onclick = () => { AU.sfx('ui'); partySelect(ST.makeEchoRift(S)); };
  document.querySelectorAll('.raid').forEach(b => b.onclick = async () => {
    const locId = b.dataset.id;
    AU.sfx('ui');
    // Isolde's arc begins at the Border Chapel
    if (locId === 'border_chapel' && S.flags.vesper_joined && !S.flags.isolde_met && !S.seen.isolde_hunter) {
      screen('', '');
      await playEvent(EVENTS.isolde_hunter);
      partySelect(ST.storyRift('kneeling_sword', S));
      return;
    }
    const intro = EVENTS['visit_' + locId];
    if (intro && !S.seen[intro.id]) { screen('', ''); await playEvent(intro); }
    partySelect(ST.makeExpedition(S, locId));
  });
}

// ------------------------------------------------------------------
// rivals — faction status, perks, leaders
// ------------------------------------------------------------------

function rivals() {
  const rows = Object.entries(FACTIONS).map(([fid, F]) => {
    const f = S.factions[fid];
    const perkOn = ST.perk(S, fid);
    const cell = ST.leaderInCells(S, fid);
    const lair = LOCATIONS[F.lair];
    return `<div class="cell-card">
      <div class="row spread"><h3 style="color:${F.color}">${F.icon} ${esc(F.name)}</h3>${factionBar(fid)}</div>
      <p class="muted sm-text">${esc(F.desc)}</p>
      <div class="sm-text">Leader: <b>${esc(F.leaderName)}</b> — ${f.fate ? `<b>${f.fate}</b>` : f.power <= LAIR_POWER ? `lair open: ${esc(lair.name)}` : `hidden in ${esc(lair.name)}`}</div>
      <div class="sm-text ${perkOn ? 'gold' : 'muted'}">When dominated: ${esc(F.perk)}${f.fate === 'shattered' ? ' (shattered: tribute only, halved)' : ''}</div>
      <div class="sm-text ${cell ? 'gold' : 'muted'}">${esc(F.cellPerk)}</div>
    </div>`;
  }).join('');
  const lts = Object.entries(S.lieutenants).map(([id, fate]) => `${esc(ENEMIES[id] ? ENEMIES[id].name : id)} — ${fate}`).join(' · ');
  screen(`
    <div class="panel map-panel">
      <div class="row spread"><h2>⚔ Rivals</h2><button class="btn ghost" id="rv-back">← Codex</button></div>
      <p class="muted">Every holding you clear, every member you seal or kill, drains a faction's Power. Factions recover a little each night unless they're beaten. Bind a leader in the Undercroft and the whole faction kneels — and their leader's presence in your cells is a weapon of its own.</p>
      <div class="cells">${rows}</div>
      ${lts ? `<p class="muted sm-text">Lieutenants: ${lts}</p>` : ''}
    </div>
  `);
  $('#rv-back').onclick = () => hub();
}

// ------------------------------------------------------------------
// wild tribes — drawn by your Menagerie, sworn by your gifts
// ------------------------------------------------------------------

function tribes() {
  const rows = Object.entries(TRIBES).filter(([id]) => S.tribes[id].status).map(([id, T]) => {
    const t = S.tribes[id];
    const req = ST.tribeRequest(S, id);
    return `<div class="cell-card">
      <div class="row spread"><h3 style="color:${T.color}">${T.icon} ${esc(T.name)}</h3><span class="fate-tag" style="color:${T.color}">${t.status.toUpperCase()}${t.rite ? ' · BLOOD-BOUND' : ''}</span></div>
      <div class="recruit-head">${portraitImg(T.envoy)}<div><b style="color:${T.color}">${esc(SPEAKERS[T.envoy].name)}</b><br><small class="muted">${esc(T.race)} · ${esc(LOCATIONS[T.home].name)}</small></div></div>
      <div class="sm-text ${t.status === 'sworn' ? 'gold' : 'muted'}">Sworn perk: ${esc(T.perk)} Nightly tribute: ${Object.entries(T.tribute).map(([r, n]) => `${n}× ${REAGENTS[r].name}`).join(', ')}${t.status === 'sworn' && ST.kinInfo(S, id).mult > 1 ? ` (×${ST.kinInfo(S, id).mult})` : ''}.</div>
      ${t.status === 'sworn' ? kinHtml(id) + broodHtml(id) : ''}
      ${req ? `<div class="sm-text">They ask for ${esc(req.ask)}: ${Object.entries(req.reagents).map(([r, n]) => `${n}× ${REAGENTS[r].name} (have ${S.reagents[r] || 0})`).join(', ')}${req.gold ? ` + ${req.gold}g` : ''}</div>
        <button class="btn sm gift ${req.ok ? '' : 'disabled'}" data-id="${id}">Give the gift</button>` : ''}
    </div>`;
  }).join('');
  const next = Object.entries(TRIBES).filter(([id]) => !S.tribes[id].status).sort((a, b) => a[1].draw - b[1].draw)[0];
  const total = ST.kinTotal(S);
  const born = Object.keys(TRIBES).reduce((a, tid) => a + (S.tribes[tid].born || 0), 0);
  const most = Object.keys(TRIBES).filter(tid => S.tribes[tid].born).sort((a, b) => S.tribes[b].born - S.tribes[a].born)[0];
  screen(`
    <div class="panel map-panel">
      <div class="row spread"><h2>🪶 Wild Tribes</h2><button class="btn ghost" id="tb-back">← Codex</button></div>
      <p class="muted">Sapient monster-folk, drawn by a Menagerie that thrives. Meet their requests and they swear fealty: tribute, perks, and — if one of them asks you herself — a breeding rite. Saying no never breaks an oath. ${next ? `Your Menagerie has produced <b>${S.stats.reagentsProduced || 0}</b> reagents; something else is watching from far off.` : ''}</p>
      ${total ? `<p class="gold">🥚 ${total} of the tribes' people ${total === 1 ? 'has' : 'have'} chosen you for the rite${born ? `; ${born} young of your blood have been born across the tribes${most ? `, most of them to ${esc(TRIBES[most].name.replace(/^The /, 'the '))}` : ''}` : ''}.</p>` : ''}
      <div class="cells">${rows || '<p class="muted">No tribe has come yet.</p>'}</div>
    </div>
  `);
  $('#tb-back').onclick = () => hub();
  document.querySelectorAll('.gift:not(.disabled)').forEach(b => b.onclick = async () => {
    if (ST.giveTribeGift(S, b.dataset.id)) { AU.sfx('promo'); ST.save(S); await drainQueue(); tribes(); }
  });
}

// ------------------------------------------------------------------
// Vesper's reading — a free card every day
// ------------------------------------------------------------------

async function vesperReading() {
  const r = ST.dailyReading(S);
  if (!r) { toast('Vesper has already read the cards today.'); return; }
  const T = TAROT[r.card];
  AU.sfx('magic');
  const modal = el(`<div class="modal-layer"><div class="panel modal reading">
    <h3>🂠 Vesper's Reading</h3>
    <div class="tarot-row"><div class="tarot-card" id="rd-card">
      <div class="tarot-face tarot-back"><div class="sigil">✶</div><small class="muted">tap to turn</small></div>
      <div class="tarot-face tarot-front">
        <div class="numeral">${T.numeral}</div><div class="arcana">${T.icon}</div>
        <div class="card-name">${T.name}</div>
        <small class="muted">${esc(T.boon)}</small>
      </div>
    </div></div>
    <button class="btn primary" id="rd-ok" style="visibility:hidden">Thank her</button>
  </div></div>`);
  document.body.appendChild(modal);
  await new Promise(res => {
    modal.querySelector('#rd-card').onclick = () => {
      modal.querySelector('#rd-card').classList.add('flipped');
      AU.sfx('promo');
      setTimeout(() => { modal.querySelector('#rd-ok').style.visibility = 'visible'; }, 800);
    };
    modal.querySelector('#rd-ok').onclick = () => { modal.remove(); res(); };
  });
  const lines = READING_LINES[r.card] || [''];
  const steps = [{ s: 'vesper', t: lines[Math.floor(Math.random() * lines.length)] }];
  for (const t of r.text) steps.push({ s: 'narr', t });
  if (r.bond) steps.push({ s: 'narr', t: `${heroName(r.bond)} catches your eye across the reading room and doesn't look away for a long moment. (+1 bond)` });
  if (r.gold) steps.push({ s: 'narr', t: `+${r.gold} gold.` });
  screen('', '');
  await playEvent({ id: 'reading', steps });
  ST.save(S);
  hub();
}

function beginRun(gate, selectedIds) {
  AU.sfx('gate');
  ST.startRun(S, gate, selectedIds);
  ST.save(S);
  stage.setBiome(gate.biome);
  stage.showcase(S.run.partyIds, heroVariant);
  AU.music('dungeon');
  dungeonScreen();
}

const MAX_PARTY = 5;

function partySelect(gate) {
  const away = ST.dispatchedIds(S);
  const all = ST.roster(S).filter(id => !away.has(id));
  if (all.length <= 1 && !(gate.guests || []).length) { beginRun(gate, ['player']); return; }
  const chosen = new Set(all.slice(0, MAX_PARTY));
  const modal = el(`<div class="modal-layer"><div class="panel modal party-pick">
    <h3>Who descends with you — ${rankBadge(gate.rank)} ${esc(gate.name)}</h3>
    <p class="muted sm-text">Tap to include or leave behind (up to ${MAX_PARTY}). Smaller parties earn <b>bonus XP each</b>. ${(gate.guests || []).length ? `<b>${gate.guests.map(heroName).join(', ')}</b> insists on coming.` : ''}</p>
    <div class="pick-grid">
      ${all.map(id => `
        <button class="pick-card ${chosen.has(id) ? 'on' : ''}" data-id="${id}">
          ${portraitImg(id)}
          <b style="color:${heroColor(id)}">${esc(heroName(id))}</b>
          <span class="muted">Lv ${S.heroes[id].level}</span>
        </button>`).join('')}
    </div>
    <div class="pick-foot">
      <span id="pick-info" class="muted"></span>
      <div class="row gap">
        <button class="btn primary" id="pick-go">Descend</button>
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
    info.innerHTML = !n ? 'Select at least one.' : !chosen.has('player') ? '<b class="danger">You must descend yourself.</b>' : bonus ? `${n} descending · <b class="gold">+${bonus}% XP each</b>` : `${n} descending`;
    go.classList.toggle('disabled', n === 0 || !chosen.has('player'));
  };
  refresh();
  modal.querySelectorAll('.pick-card').forEach(c => c.onclick = () => {
    const id = c.dataset.id;
    if (chosen.has(id)) chosen.delete(id);
    else if (chosen.size >= MAX_PARTY) { toast(`${MAX_PARTY} at most — leave someone behind first.`); return; }
    else chosen.add(id);
    c.classList.toggle('on', chosen.has(id));
    AU.sfx('ui');
    refresh();
  });
  modal.querySelector('#pick-cancel').onclick = () => { AU.sfx('ui'); modal.remove(); };
  go.onclick = () => {
    if (!chosen.size || !chosen.has('player')) return;
    modal.remove();
    beginRun(gate, [...chosen]);
  };
}

// ------------------------------------------------------------------
// the rift
// ------------------------------------------------------------------

const NODE_ICONS = { fight: '⚔', treasure: '✦', event: '?', rest: '▲', boss: '☠', branch: '⑃' };
const DOOR_LABELS = {
  elite:    { name: 'The Heavy Door',  desc: 'Something titled claimed this chamber. Richer spoils — and richer captives.', icon: '◆' },
  treasure: { name: 'The Quiet Door',  desc: 'A cache, unguarded. Probably.', icon: '✦' },
  event:    { name: 'The Strange Door', desc: 'Ink pools oddly beyond. Something is waiting to be decided.', icon: '?' },
  rest:     { name: 'The Still Door',  desc: 'Dry stone and clean air. A place to catch your breath.', icon: '▲' },
};
function doorInfo(opt) { return opt.elite ? DOOR_LABELS.elite : DOOR_LABELS[opt.type] || DOOR_LABELS.event; }
function eventPool(gate) { return gate.modifier === 'bargain' ? DUNGEON_EVENTS.concat(BARGAIN_EVENTS) : DUNGEON_EVENTS; }
function riftEvent(gate, node) { const pool = eventPool(gate); return pool[Math.floor(node.roll * pool.length)]; }

function pathBar() {
  return `<div class="path-bar">${S.run.nodes.map((n, i) =>
    `<span class="path-node ${i < S.run.nodeIdx ? 'done' : ''} ${i === S.run.nodeIdx ? 'cur' : ''} ${n.type}">${NODE_ICONS[n.type] || '•'}</span>`
  ).join('<span class="path-link"></span>')}</div>`;
}

function dungeonScreen() {
  const run = S.run;
  const node = run.nodes[run.nodeIdx];
  const gate = run.gate;
  let body = '', actions = '';

  if (node.type === 'branch') {
    body = '<p>The corridor forks. Both ways lead deeper — but not through the same things.</p>';
    actions = node.options.map((opt, i) => {
      const d = doorInfo(opt);
      return `<button class="btn ${opt.elite ? 'danger-door' : ''} d-door" data-i="${i}">${d.icon} ${d.name}<small>${d.desc}</small></button>`;
    }).join('');
  } else if (node.type === 'fight' || node.type === 'boss') {
    const hidden = gate.modifier === 'hidden' && node.type !== 'boss' && !ST.tribeSworn(S, 'aerie');
    const names = {};
    node.group.forEach(e => names[e.name] = (names[e.name] || 0) + 1);
    const hasElite = node.group.some(e => e.elite);
    const capIcon = e => e.captureType === 'beast' ? ' 🐾' : e.captureType === 'humanoid' ? ' ⛓' : '';
    body = hidden
      ? '<p>The water is too still. Shapes move under the fog — you won\'t know what they are until they\'re on you.</p>'
      : `<p>${node.type === 'boss' ? '<b class="danger">The heart of the rift.</b> The ink in the air thickens.'
        : hasElite ? '<b class="gold">Something in there outranks its kin.</b> Ahead:' : 'Ahead:'}</p>
      <ul class="foes">${Object.entries(names).map(([n, c]) => { const e = node.group.find(x => x.name === n); return `<li>${esc(n)}${c > 1 ? ` ×${c}` : ''}<span class="cap-ic">${capIcon(e)}</span></li>`; }).join('')}</ul>
      <p class="muted sm-text">⛓ can be sealed into the Undercroft · 🐾 into the Menagerie</p>`;
    actions = `<button class="btn primary" id="d-go">${node.type === 'boss' ? 'Face it' : 'Engage'}</button>`;
  } else if (node.type === 'treasure') {
    body = '<p>A cache sealed in old wax — something a Keeper hid long ago, or something the Coven forgot.</p>';
    actions = '<button class="btn primary" id="d-go">Break the seal</button>';
  } else if (node.type === 'rest') {
    body = '<p>A dry alcove above the waterline. Someone lights a candle; it leans toward you.</p>';
    actions = '<button class="btn primary" id="d-go">Rest (party recovers 30%)</button>';
  } else if (node.type === 'event') {
    const ev = riftEvent(gate, node);
    body = `<p>${esc(ev.t)}</p>`;
    actions = ev.choices.map((c, i) => `<button class="btn ${i === 0 ? 'primary' : ''} d-ev" data-i="${i}">${esc(c.t)}</button>`).join('');
  }

  const hpRows = run.partyIds.map(id => {
    const st = ST.heroStats(S, id);
    const cur = run.party[id];
    return `<div class="mini-hp"><span>${esc(heroName(id))}</span>
      <div class="bar-outer hp sm"><div class="bar-inner" style="width:${cur.hp / st.hp * 100}%"></div></div></div>`;
  }).join('');
  const caps = run.captures.length ? `<div class="result-caps sm-text">⛓ Sealed this descent: ${run.captures.map(c => esc(c.name)).join(', ')} — they come home only if you clear the rift.</div>` : '';

  screen(`
    <div class="panel dungeon-panel">
      <div class="row spread">
        <h2>${rankBadge(gate.rank)} ${esc(gate.name)}</h2>
        <span class="muted">${gate.faction ? FACTIONS[gate.faction].icon + ' ' + FACTIONS[gate.faction].name + ' · ' : ''}chamber ${Math.min(run.nodeIdx + 1, run.nodes.length)}/${run.nodes.length}</span>
      </div>
      ${pathBar()}
      <div class="dungeon-body">${body}</div>
      ${caps}
      <div class="row gap wrap">${actions}
        ${(() => { const boss = run.nodes.slice(run.nodeIdx).find(n => n.type === 'boss'); const stop = boss && !ST.bossBeaten(S, boss);
          return `<button class="btn ghost" id="d-auto" title="Let the party push through the rest of the rift on its own (each ally's auto-skill; the warlock seals anything ready to be bound).${stop ? ' It stops at the boss: the first time, you fight it yourself.' : ''}">⏩ ${stop ? 'Auto-clear to the boss' : 'Auto-clear'}</button>`; })()}
        <button class="btn ghost" id="d-retreat">Retreat</button>
      </div>
      <div class="mini-party">${hpRows}</div>
    </div>
  `, 'lowered');

  const advance = () => { S.run.nodeIdx++; ST.save(S); dungeonScreen(); };

  const go = $('#d-go');
  if (go) go.onclick = async () => {
    AU.sfx('confirm');
    if (node.type === 'fight' || node.type === 'boss') battle(node);
    else if (node.type === 'treasure') {
      const r = ST.rollTreasure(S, gate, Math.random);
      AU.sfx('coin');
      if (r.kind === 'gear') toast(`Found: ${r.gear.name} (+${gearScore(r.gear)})`, 'gold');
      else if (r.kind === 'gold') toast(`Found ${r.gold} gold`, 'gold');
      else if (r.kind === 'reagent') toast(`Found: ${REAGENTS[r.reagent].name}`, 'gold');
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
    const ev = riftEvent(gate, node);
    const c = ev.choices[Number(b.dataset.i)];
    applyDungeonEffect(c.effect, gate);
    toast(esc(c.log), '');
    AU.sfx('ui');
    advance();
  });
  document.querySelectorAll('.d-door').forEach(b => b.onclick = () => {
    S.run.nodes[S.run.nodeIdx] = node.options[Number(b.dataset.i)];
    AU.sfx('gate');
    ST.save(S);
    dungeonScreen();
  });
  $('#d-auto').onclick = () => { AU.sfx('confirm'); autoResolveDungeon(); };
  $('#d-retreat').onclick = () => {
    AU.sfx('ui');
    if (S.run.captures.length && !confirm('Retreating frees everything you sealed on this descent. Retreat anyway?')) return;
    results(ST.endRun(S, 'retreat'));
  };
}

// Fast-forward the rest of the rift with the auto-battle brain.
async function autoResolveDungeon() {
  const run = S.run;
  if (!run) return;
  const gate = run.gate;
  const overlay = el(`<div class="dialogue-layer"><div class="panel" style="max-width:340px;text-align:center">
    <h3>Descending…</h3>
    <div class="muted" id="ar-status">The party moves on its own.</div>
    <div class="bar-outer" style="margin-top:12px"><div class="bar-inner" id="ar-bar" style="width:0%"></div></div>
  </div></div>`);
  document.body.appendChild(overlay);
  const status = overlay.querySelector('#ar-status');
  const barEl = overlay.querySelector('#ar-bar');
  const total = run.nodes.length;
  const tick = (msg) => { status.textContent = msg; barEl.style.width = Math.round(Math.min(run.nodeIdx, total) / total * 100) + '%'; };
  let fights = 0, guard = 0;
  while (S.run && run.nodeIdx < run.nodes.length && guard++ < 200) {
    const node = run.nodes[run.nodeIdx];
    if (node.type === 'branch') { run.nodes[run.nodeIdx] = node.options.find(o => !o.elite) || node.options[0]; continue; }
    if (node.type === 'boss' && !ST.bossBeaten(S, node)) {
      // a boss you've never beaten: the party stops at the door and you fight it yourself
      overlay.remove();
      ST.save(S);
      toast('The party halts at the heart of the rift. This one you face yourself.', 'gold');
      return dungeonScreen();
    }
    if (node.type === 'fight' || node.type === 'boss') {
      tick(node.type === 'boss' ? 'The heart of the rift.' : `Chamber ${run.nodeIdx + 1}…`);
      await stage.wait(window.__FAST ? 60 : 220);
      const c = new Combat(S, node.group);
      let r = c.step(), g2 = 0;
      while (!r.outcome && g2++ < 2000) r = r.needCommand ? c.step(c.autoCommand(r.needCommand, S.autoSkill[r.needCommand.heroId])) : c.step();
      fights++;
      if (r.outcome === 'wipe' || !r.outcome) { overlay.remove(); AU.sfx('wipe'); return results(ST.endRun(S, 'wipe')); }
      if (r.outcome === 'retreat') { overlay.remove(); return results(ST.endRun(S, 'retreat')); }
      if (node.type === 'boss') ST.markBossBeaten(S, node);
      if (node.type === 'boss' && run.nodeIdx >= run.nodes.length - 1) {
        ST.rollBossDrop(S, gate);
        overlay.remove();
        AU.sfx('victory');
        toast(`Rift auto-cleared — ${fights} fights.`, 'gold');
        return results(ST.endRun(S, 'clear'));
      }
      run.nodeIdx++;
    } else if (node.type === 'treasure') { ST.rollTreasure(S, gate, Math.random); run.nodeIdx++; }
    else if (node.type === 'rest') {
      for (const id of run.partyIds) {
        const st = ST.heroStats(S, id);
        run.party[id].hp = Math.min(st.hp, Math.round(run.party[id].hp + st.hp * 0.3));
        run.party[id].mp = Math.min(st.mp, Math.round(run.party[id].mp + st.mp * 0.3));
      }
      run.nodeIdx++;
    } else if (node.type === 'event') {
      // auto takes the last (most cautious) choice, never the dark one
      const ev = riftEvent(gate, node);
      const safe = ev.choices.find(ch => !ch.effect.corruption && !ch.effect.hpPct) || ev.choices[ev.choices.length - 1];
      applyDungeonEffect(safe.effect, gate);
      run.nodeIdx++;
    } else run.nodeIdx++;
    tick('Pressing on…');
    ST.save(S);
  }
  overlay.remove();
  if (S.run) return results(ST.endRun(S, 'clear'));
}

function applyDungeonEffect(eff, gate) {
  const base = 30 * (S.circleIdx + 1);
  if (eff.xp) S.run.loot.xp += Math.round(base * 2 * eff.xp);
  if (eff.gold) {
    const amt = Math.round(base * 1.5 * Math.abs(eff.gold));
    if (eff.gold > 0) S.run.loot.gold += amt; else S.gold = Math.max(0, S.gold - amt);
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
    if (eff.item.startsWith('-')) { const it = eff.item.slice(1); S.inventory[it] = Math.max(0, (S.inventory[it] || 0) - 1); }
    else S.run.loot.items[eff.item] = (S.run.loot.items[eff.item] || 0) + 1;
  }
  if (eff.reagent) S.reagents[eff.reagent] = (S.reagents[eff.reagent] || 0) + 1;
  if (eff.corruption) ST.addCorruption(S, eff.corruption);
  if (eff.buff) S.run.tempBuff = eff.buff;
}

// ------------------------------------------------------------------
// battle
// ------------------------------------------------------------------

const disp = new Map(); // uid -> {hp,maxHp,shield,statuses:Set,will,maxWill,captured}
let autoInterrupt = null;
let keeperEye = false;   // Vesper in the party: exact Will & seal odds

function willLabel(chance) {
  if (keeperEye) return `${Math.round(chance * 100)}%`;
  return chance <= 0 ? 'no chance' : chance < 0.35 ? 'unlikely' : chance < 0.7 ? 'possible' : 'likely';
}

function unitCard(u, side) {
  const d = disp.get(u.uid);
  const stIcons = [...d.statuses].map(id => `<span class="st-ic ${STATUSES[id]?.kind}" title="${STATUSES[id]?.name}">${STATUSES[id]?.icon || '?'}</span>`).join('');
  const capIc = side === 'enemy' ? (u.captureType === 'beast' ? '🐾' : u.captureType === 'humanoid' ? '⛓' : '✕') : '';
  const willRow = side === 'enemy' && !d.captured ? `<div class="will-row ${keeperEye ? '' : 'hidden-will'}" title="Will${keeperEye ? '' : ' — bring Vesper to read it exactly'}">
      ${bar('will', d.will / d.maxWill * 100)}<span class="will-num">${keeperEye ? Math.round(d.will) : '?'}</span></div>` : '';
  return `<div class="ucard ${side} ${d.hp <= 0 ? 'dead' : ''} ${d.captured ? 'captured' : ''} ${u.boss ? 'boss' : ''} ${u.elite ? 'elite' : ''}" data-uid="${u.uid}">
    <div class="uname" style="${side === 'party' ? `color:${heroColor(u.uid)}` : ''}">${u.elite ? '◆ ' : ''}${esc(u.name)} <span class="cap-ic" title="${u.captureType ? 'can be sealed' : 'cannot be sealed'}">${capIc}</span></div>
    <div class="bar-outer hp sm"><div class="bar-inner" style="width:${Math.max(0, d.hp / d.maxHp * 100)}%"></div>${d.shield > 0 ? '<div class="shield-chip">◈</div>' : ''}</div>
    ${side === 'party' ? `<div class="bar-outer mp sm"><div class="bar-inner" style="width:${u.maxMp ? u.mp / u.maxMp * 100 : 0}%"></div></div>` : willRow}
    <div class="hp-num">${Math.max(0, d.hp)}/${d.maxHp}</div>
    <div class="st-row">${stIcons}</div>
  </div>`;
}

function renderBattleHud(c, gateName, roomLabel) {
  const partyU = c.units.filter(u => u.side === 'party');
  const foes = c.units.filter(u => u.side === 'enemy');
  screen(`
    <div class="battle-top">
      <div class="panel slim"><b>${esc(gateName)}</b> · ${roomLabel} · <span id="round-label">round ${c.round || 1}</span>
        <button class="btn sm ${S.settings.autoBattle ? 'primary' : 'ghost'}" id="b-auto" title="Auto-battle: allies act on their own; the warlock seals anything ready to be bound.">${S.settings.autoBattle ? '■ AUTO' : '▶ Auto'}</button>
        ${keeperEye ? '<span class="sys-tag" title="Vesper reads every Will exactly.">◉ Keeper\'s Eye</span>' : ''}
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
      <div class="party-row" id="party-row">${partyU.map(u => unitCard(u, 'party')).join('')}</div>
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
  l.appendChild(el(`<div>${esc(text)}</div>`));
  while (l.children.length > 4) l.firstChild.remove();
}

async function battle(node) {
  const run = S.run;
  const gate = run.gate;
  const c = new Combat(S, node.group);
  keeperEye = c.units.some(u => u.side === 'party' && HEROES[u.heroId] && HEROES[u.heroId].passive.reveal && u.hp > 0);

  disp.clear();
  for (const u of c.units) {
    const sh = u.statuses.find(s => s.id === 'shield');
    disp.set(u.uid, { hp: u.hp, maxHp: u.maxHp, shield: sh ? sh.power : 0, statuses: new Set(u.statuses.map(s => s.id)), will: u.will, maxWill: u.maxWill || 100, captured: false });
  }

  stage.battleCamera();
  await stage.layoutBattle(
    c.units.filter(u => u.side === 'party').map(u => ({ uid: u.uid, model: u.model, variant: heroVariant(u.uid) || u.variant })),
    c.units.filter(u => u.side === 'enemy').map(u => ({ uid: u.uid, model: u.model, variant: u.variant, boss: u.boss })),
  );
  AU.music('battle');
  renderBattleHud(c, gate.name, node.type === 'boss' ? 'BOSS' : `chamber ${run.nodeIdx + 1}`);
  if (node.group.some(e => e.tutorialSeal) && !S.flags.seal_tutorial) {
    S.flags.seal_tutorial = true;
    toast('Drain her Will — hexes, Vesper\'s Chain Sigil, plain damage — then use ⛓ Seal.', 'gold');
  }

  const onApply = (e) => {
    const d = e.uid ? disp.get(e.uid) : null;
    switch (e.t) {
      case 'round': { const r = $('#round-label'); if (r) r.textContent = 'round ' + e.n; break; }
      case 'turn': document.querySelectorAll('.ucard').forEach(x => x.classList.toggle('active', x.dataset.uid === e.uid)); break;
      case 'skill': { const u = c.unit(e.uid); if (u && e.skillId !== 'strike') blog(`${u.name} — ${e.name}!`); AU.sfx(e.anim === 'cast' ? 'magic' : 'ui'); break; }
      case 'hit': if (d) { d.hp = e.hpAfter; if (e.shieldAfter !== undefined) d.shield = e.shieldAfter; AU.sfx(e.miss ? 'miss' : e.crit ? 'crit' : 'hit'); refreshCards(c); } break;
      case 'dot': if (d) { d.hp = e.hpAfter; refreshCards(c); } break;
      case 'heal': if (d) { d.hp = e.hpAfter; AU.sfx('heal'); refreshCards(c); } break;
      case 'shield': if (d) { d.shield = e.amount; AU.sfx('shield'); refreshCards(c); } break;
      case 'status+': if (d) { d.statuses.add(e.id); refreshCards(c); } break;
      case 'status-': if (d) { d.statuses.delete(e.id); if (e.id === 'shield') d.shield = 0; refreshCards(c); } break;
      case 'will': if (d) { d.will = e.will; d.maxWill = e.maxWill; refreshCards(c); } break;
      case 'captured': if (d) { d.hp = 0; d.captured = true; d.statuses.clear(); AU.sfx('seal'); refreshCards(c); toast(`⛓ ${esc(e.name)} sealed!`, 'gold'); } break;
      case 'seal_backlash': AU.sfx('miss'); break;
      case 'yield': if (d) { d.hp = 0; refreshCards(c); } break;
      case 'favor': AU.sfx('crit'); break;
      case 'die': if (d) { d.hp = 0; AU.sfx('die'); refreshCards(c); } break;
      case 'revive': if (d) { d.hp = e.hpAfter; refreshCards(c); } break;
      case 'item': { const u = c.unit(e.uid); blog(`${u ? u.name : '?'} uses ${ITEMS[e.itemId].name}.`); break; }
      case 'log': blog(e.text); break;
    }
  };

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
  for (let guard = 0; guard < 600; guard++) {
    await stage.playEvents(res.events, onApply);
    if (res.outcome) break;
    if (!res.needCommand) { res = c.step(); continue; }
    const u = res.needCommand;
    let cmd;
    if (S.settings.autoBattle) {
      const area = $('#cmd-area');
      if (area) area.innerHTML = `<div class="muted center-text">AUTO — ${esc(u.name)} acts…</div>`;
      await stage.wait(280);
      cmd = S.settings.autoBattle ? c.autoCommand(u, S.autoSkill[u.heroId]) : await promptCommand(u, c);
    } else {
      const viaToggle = new Promise(r => { autoInterrupt = () => r(c.autoCommand(u, S.autoSkill[u.heroId])); });
      cmd = await Promise.race([promptCommand(u, c), viaToggle]);
      autoInterrupt = null;
    }
    res = c.step(cmd);
  }
  autoInterrupt = null;

  if (res.outcome === 'victory') {
    AU.sfx('victory');
    const endEv = res.events.find(e => e.t === 'end');
    toast(`Victory! +${endEv?.xp || 0} XP, +${endEv?.gold || 0}g`, 'gold');
    await stage.wait(600);
    if (node.type === 'boss') ST.markBossBeaten(S, node);
    if (node.type === 'boss' && S.run.nodeIdx >= S.run.nodes.length - 1) {
      const drop = ST.rollBossDrop(S, gate);
      if (drop) toast(`Spoils: ${drop.name}`, 'gold');
      results(ST.endRun(S, 'clear'));
    } else {
      S.run.nodeIdx++;
      ST.save(S);
      AU.music('dungeon');
      dungeonScreen();
    }
  } else if (res.outcome === 'wipe') {
    AU.sfx('wipe');
    await stage.wait(700);
    results(ST.endRun(S, 'wipe'));
  } else results(ST.endRun(S, 'retreat'));
}

function promptCommand(u, c) {
  return new Promise(resolve => {
    const area = $('#cmd-area');
    const opts = c.commandOptions(u);

    const pickTarget = (side, filter, cb, label) => {
      const list = c.units.filter(x => x.side === side && (filter ? filter(x) : x.hp > 0));
      area.innerHTML = `<div class="cmd-title">Target:</div><div class="cmd-list">` +
        list.map(x => `<button class="btn tgt" data-uid="${x.uid}">${esc(x.name)} <small>${Math.max(0, disp.get(x.uid).hp)}/${x.maxHp}</small>${label ? `<small class="seal-chance">${label(x)}</small>` : ''}</button>`).join('') +
        `</div><button class="btn ghost sm" id="cmd-back">← back</button>`;
      area.querySelectorAll('.tgt').forEach(b => b.onclick = () => { AU.sfx('confirm'); cb(b.dataset.uid); });
      $('#cmd-back').onclick = () => { AU.sfx('ui'); mainMenu(); };
    };

    const mainMenu = () => {
      const skillBtns = opts.skills.map(sk => {
        const full = SKILLS[sk.id];
        const mtag = u.heroId ? ` — ${masteryTagline(u.heroId, sk.id)}` : '';
        return `<button class="btn skill ${sk.usable ? '' : 'disabled'}" data-id="${sk.id}" title="${esc(sk.desc)}${full.subdue ? ' [drains Will]' : ''}${esc(mtag)}">
          ${esc(sk.name)}${full.subdue ? '<small class="seal-chance">⛓</small>' : ''}${sk.rank ? `<small class="mastery">${'★'.repeat(sk.rank)}</small>` : ''}${sk.mp ? `<small>${sk.mp} MP</small>` : '<small>—</small>'}${sk.cd ? `<small class="danger">CD ${sk.cd}</small>` : ''}${sk.free ? '<small class="free-tag">FREE</small>' : ''}
        </button>`;
      }).join('');
      area.innerHTML = `
        <div class="cmd-title" style="color:${heroColor(u.uid)}">${esc(u.name)}'s turn <small class="muted">MP ${u.mp}/${u.maxMp}</small></div>
        <div class="cmd-list">${skillBtns}</div>
        <div class="row gap">
          ${opts.seal ? `<button class="btn sm seal ${opts.seal.usable ? '' : 'disabled'}" id="cmd-seal" title="Binding Seal: capture an enemy instead of killing it. Drain its Will first. ${opts.seal.mp ? SEAL_MP + ' MP.' : 'Free (Ember Debt).'}">⛓ Seal <small>${opts.seal.mp ? opts.seal.mp + ' MP' : 'free'}</small></button>` : ''}
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
      const sealBtn = $('#cmd-seal');
      if (sealBtn && opts.seal.usable) sealBtn.onclick = () => {
        AU.sfx('ui');
        pickTarget('enemy', x => x.hp > 0, uid => resolve({ kind: 'seal', target: uid }), x => {
          if (!x.captureType) return ' · can\'t be sealed';
          const t = opts.seal.targets.find(tt => tt.uid === x.uid);
          return ' · ' + willLabel(t ? t.chance : 0) + (x.boss && !x.tutorialSeal && x.hp / x.maxHp >= 0.15 ? ' (boss: below 15% HP)' : '');
        });
      };
      $('#cmd-guard').onclick = () => { AU.sfx('confirm'); resolve({ kind: 'guard' }); };
      const itemBtn = $('#cmd-item');
      if (itemBtn && opts.items.length) itemBtn.onclick = () => {
        area.innerHTML = `<div class="cmd-title">Items:</div><div class="cmd-list">` +
          opts.items.map(it => `<button class="btn it" data-id="${it.id}" title="${esc(it.desc)}">${esc(it.name)} <small>×${it.n}</small></button>`).join('') +
          `</div><button class="btn ghost sm" id="cmd-back">← back</button>`;
        area.querySelectorAll('.it').forEach(b => b.onclick = () => {
          const it = opts.items.find(x => x.id === b.dataset.id);
          if (it.onEnemy) pickTarget('enemy', x => x.hp > 0, uid => resolve({ kind: 'item', id: it.id, target: uid }));
          else pickTarget('party', it.revive ? (x => x.hp <= 0) : (x => x.hp > 0), uid => resolve({ kind: 'item', id: it.id, target: uid }));
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
  stage.setBiome(null);
  stage.battleCamera();
  stage.showcase(ST.roster(S).slice(0, 5), heroVariant);
  stage.camBase.set(0, 2.1, 6.8);

  const titles = { clear: 'RIFT CLOSED', retreat: 'WITHDREW FROM THE RIFT', wipe: 'THE RIFT SPAT YOU OUT' };
  const flavor = {
    clear: 'The rift seals behind you like a page turning.',
    retreat: 'Living to descend tomorrow is also a strategy. Vesper writes it down as one.',
    wipe: 'You wake on the library floor, soaked through. Someone dragged you home. Nobody talks about it.',
  };
  const upsByHero = {};
  for (const up of result.levelUps) (upsByHero[up.id] = upsByHero[up.id] || []).push(up.level);
  const upHtml = Object.entries(upsByHero).map(([id, lvls]) => {
    const def = HEROES[id];
    const from = lvls[0] - 1, to = lvls[lvls.length - 1];
    const a = heroStatsAt(def, from), b = heroStatsAt(def, to);
    const gains = Object.keys(a).filter(k => b[k] > a[k]).map(k => `${k.toUpperCase()} +${b[k] - a[k]}`).join(' · ');
    return `<div class="sys-window"><div class="sys-head">[ THE CODEX NOTES ]</div>
      <b style="color:${heroColor(id)}">${esc(heroName(id))}</b> — Lv ${from} → <b>Lv ${to}</b>
      <div class="muted sm-text">${gains}</div></div>`;
  }).join('');
  if (result.levelUps.length) AU.sfx('levelup');

  const gearHtml = result.gear.length ? `<div class="loot-gear">${result.gear.map(g => `<span class="gear-chip t${g.tier}">${esc(g.name)}</span>`).join('')}</div>` : '';
  const itemsHtml = Object.keys(result.items).length ? `<div class="muted">Items: ${Object.entries(result.items).map(([k, v]) => `${ITEMS[k].name} ×${v}`).join(', ')}</div>` : '';
  const capHtml = result.captured.length ? `<div class="result-caps">${result.captured.map(c => `⛓ ${esc(c.name)} → ${c.where === 'undercroft' ? 'the Undercroft' : c.where === 'menagerie' ? 'the Menagerie' : esc(c.note || 'released')}`).join('<br>')}</div>` : '';
  const freedHtml = result.freed.length ? `<div class="muted sm-text">Freed when the seals broke: ${result.freed.map(esc).join(', ')}</div>` : '';

  screen(`
    <div class="panel results-panel ${result.outcome}">
      <h2>${titles[result.outcome]}</h2>
      <p class="muted">${flavor[result.outcome]} <b>${esc(result.gate.name)}</b> ${rankBadge(result.gate.rank)}</p>
      <div class="result-nums">
        <div><small>XP each</small><b>+${result.xp}</b></div>
        <div><small>Gold</small><b>+${result.gold}</b></div>
        <div><small>Infamy</small><b>+${result.gp}</b></div>
        <div><small>Captured</small><b>${result.captured.length}</b></div>
      </div>
      ${capHtml}${freedHtml}
      ${result.fates.length ? `<div class="result-caps">${result.fates.map(f => `♛ ${esc(ENEMIES[f.id] ? ENEMIES[f.id].name : f.id)} — ${f.fate}`).join('<br>')}</div>` : ''}
      ${result.power.length ? `<div class="muted sm-text">${result.power.map(esc).join('<br>')}</div>` : ''}
      ${result.partySize && result.partySize < 4 ? `<div class="muted sm-text">Small party of ${result.partySize} — bonus XP applied.</div>` : ''}
      ${gearHtml}${itemsHtml}
      <div class="ups">${upHtml}</div>
      <button class="btn primary" id="r-continue">Continue</button>
    </div>
  `, 'center');

  $('#r-continue').onclick = async () => {
    AU.sfx('confirm');
    if (result.outcome === 'clear' && !result.gate.story) {
      const ev = pickCampEvent(S, Math.random);
      if (ev && (ev.id !== 'banter' || Math.random() < (result.campScene ? 0.95 : 0.6))) {
        screen('', '');
        await playEvent(ev);
      }
    }
    hub();
  };
}

// ------------------------------------------------------------------
// the Undercroft — captives, wardens, visits, Reclamation
// ------------------------------------------------------------------

function wardenOptions(cap) {
  const pool = ST.roster(S).filter(id => id !== 'player');
  const cur = S.wardens[cap.id] || '';
  return `<select class="warden-sel" data-cap="${cap.id}">
    <option value="">— no warden (brand creeps back) —</option>
    ${pool.map(id => {
      const st = ST.wardenStyle(S, id, cap);
      const elsewhere = Object.entries(S.wardens).find(([k, v]) => v === id && k !== cap.id);
      return `<option value="${id}" ${cur === id ? 'selected' : ''}>${esc(heroName(id))} · ${st.label}${ST.badPair(id, cap) ? ' · BAD PAIR' : ''}${elsewhere ? ' (moves cells)' : ''}</option>`;
    }).join('')}
  </select>`;
}

function undercroft() {
  const caps = S.captives;
  const fear = ST.captiveFear(S);
  const cards = caps.map(cap => {
    const visited = cap.visitedDay === S.day;
    const witness = ST.testimonyWitness(S, cap);
    const regardPct = Math.abs(cap.regard) / 2;
    const regardLeft = cap.regard >= 0 ? 50 : 50 - regardPct;
    return `<div class="cell-card ${cap.releasePending ? 'release' : ''}">
      <div class="row spread"><h3>${esc(cap.name)}</h3><small class="muted">${esc(cap.title || '')} · day ${cap.days}</small></div>
      <div class="traits">${cap.traits.map(t => `<span class="trait" title="${esc(CAPTIVE_TRAITS[t].desc)}">${CAPTIVE_TRAITS[t].name}</span>`).join('')}${cap.hooked ? '<span class="trait" title="Owes Rue a favor once they join.">🔥 hooked</span>' : ''}${cap.tonicDays ? `<span class="trait">tonic ×${cap.tonicDays}</span>` : ''}</div>
      <div class="meter"><span>Brand</span>${bar('brand', cap.brand, 'Burns out at 0')}<span>${cap.brand}</span></div>
      <div class="meter"><span>Resolve</span>${bar('resolve', cap.resolve, 'Defiance: slows Reclamation, raises breakout odds')}<span>${cap.resolve}</span></div>
      <div class="meter"><span>Regard</span><div class="bar-outer regard sm" title="≥ 20 at release and they'll join you"><div class="bar-inner" style="left:${regardLeft}%;width:${regardPct}%"></div></div><span>${cap.regard > 0 ? '+' : ''}${cap.regard}</span></div>
      ${cap.learned.length ? `<div>${cap.learned.map(k => `<div class="secret">“${esc(k)}”</div>`).join('')}</div>` : ''}
      <div class="sm-text muted">Warden: ${wardenOptions(cap)}</div>
      ${cap.releasePending ? '<b class="gold sm-text">The brand is gone. Release them from the Codex hub.</b>' : `
      <div class="visit-row">
        ${Object.entries(ST.VISITS).map(([k, v]) => {
          const dis = visited || (k === 'testimony' && !witness) || (k === 'bargain' && S.gold < ST.bargainCost(S));
          const extra = k === 'bargain' ? ` (${ST.bargainCost(S)}g)` : k === 'testimony' && witness ? ` (${heroName(witness)})` : '';
          return `<button class="btn visit ${dis ? 'disabled' : ''}" data-cap="${cap.id}" data-k="${k}" title="${esc(v.desc)}">${v.icon} ${v.name}${extra}</button>`;
        }).join('')}
      </div>
      <div class="row gap sm-text">
        ${S.inventory.truth_draught ? `<label><input type="checkbox" class="truth" data-cap="${cap.id}"> use Truth Draught (×${S.inventory.truth_draught})</label>` : ''}
        ${S.inventory.wardens_tonic ? `<button class="btn sm tonic" data-cap="${cap.id}">Warden's Tonic (×${S.inventory.wardens_tonic})</button>` : ''}
        ${visited ? '<span class="muted">visited today</span>' : ''}
      </div>`}
    </div>`;
  }).join('');

  screen(`
    <div class="panel map-panel">
      <div class="row spread"><h2>⛓ The Undercroft</h2><div class="row gap">${caps.length ? '<button class="btn" id="u-walk" title="Go down among the cells and see everyone.">👁 Walk the cells</button>' : ''}<button class="btn ghost" id="u-back">← Codex</button></div></div>
      <p class="muted">Old cells beneath the library. Wardens burn the brand down a little every day; without one it creeps back, and defiant captives look for a way out. Visit each captive once a day. At brand 0 they're released — and choose. ${fear ? '<b class="danger">Your Corruption terrifies them: resolve breaks faster, regard falls harder.</b>' : ''}</p>
      ${caps.some(c => c.visitedDay !== S.day && !c.releasePending) ? `<div class="visit-row all-visit">
        <b class="sm-text">Visit everyone:</b>
        <select id="u-allkind">${Object.entries(ST.VISITS).map(([k, v]) => `<option value="${k}">${v.icon} ${v.name}${k === 'bargain' ? ` (${ST.bargainCost(S)}g each)` : ''}</option>`).join('')}</select>
        <button class="btn" id="u-all" title="Give every captive you haven't visited today the same visit. Captives with a scene waiting, or who can't take this visit, are skipped.">Visit all</button>
      </div>` : ''}
      ${caps.length ? `<div class="cells scroll-list">${cards}</div>` : '<p class="muted">The cells are empty. Seal someone humanoid in a rift (⛓) to bring them here.</p>'}
      ${S.released.length ? `<p class="muted sm-text">Released: ${S.released.slice(-6).map(r => `${esc(r.name)} (${r.fate})`).join(', ')}</p>` : ''}
    </div>
  `);
  $('#u-back').onclick = () => hub();
  if ($('#u-walk')) $('#u-walk').onclick = () => cellsView();
  document.querySelectorAll('.warden-sel').forEach(sel => sel.onchange = () => {
    ST.assignWarden(S, sel.dataset.cap, sel.value || null);
    AU.sfx('confirm');
    ST.save(S);
    undercroft();
  });
  document.querySelectorAll('.tonic').forEach(b => b.onclick = () => {
    if (ST.useTonic(S, b.dataset.cap)) { AU.sfx('heal'); toast('Warden\'s Tonic: +25% Reclamation for 3 days.'); ST.save(S); undercroft(); }
  });
  document.querySelectorAll('.visit:not(.disabled)').forEach(b => b.onclick = () => visitFlow(b.dataset.cap, b.dataset.k));
  const all = $('#u-all');
  if (all) all.onclick = () => visitAll($('#u-allkind').value);
}

// One visit, applied to every captive you haven't seen today. Named captives with a
// hand-written scene waiting are left for you to visit yourself.
async function visitAll(kind) {
  const lines = [], skipped = [];
  let spent = 0;
  for (const cap of S.captives.slice()) {
    if (cap.visitedDay === S.day || cap.releasePending) continue;
    if (pickCellEvent(S, cap)) { skipped.push(`${cap.name} (has a scene waiting)`); continue; }
    if (kind === 'testimony' && !ST.testimonyWitness(S, cap)) { skipped.push(`${cap.name} (no witness)`); continue; }
    if (kind === 'bargain' && S.gold < ST.bargainCost(S)) { skipped.push(`${cap.name} (not enough gold)`); continue; }
    const before = { brand: cap.brand, resolve: cap.resolve, regard: cap.regard };
    const res = ST.visitCaptive(S, cap.id, kind, {});
    if (!res.ok) { skipped.push(cap.name); continue; }
    if (res.cost) spent += res.cost;
    const d = ['brand', 'resolve', 'regard'].map(k => { const n = cap[k] - before[k]; return n ? `${k} ${n > 0 ? '+' : ''}${n}` : ''; }).filter(Boolean).join(', ');
    const secret = kind === 'interrogate' ? res.text.find(t => t.includes('gives it up')) : null;
    lines.push(`${cap.name}: ${d || 'no change'}${res.outburst ? ' — lashed out' : ''}${cap.releasePending ? ' — the brand is gone!' : ''}${secret ? `. ${secret}` : ''}`);
  }
  AU.sfx('ui');
  screen('', '');
  await playEvent({ id: 'visit', steps: [
    { s: 'narr', t: lines.length ? `You make the rounds of the cells: ${ST.VISITS[kind].name.toLowerCase()} for everyone.` : 'There is no one left to visit today.' },
    ...lines.map(t => ({ s: 'narr', t })),
    ...(skipped.length ? [{ s: 'narr', t: `Skipped: ${skipped.join(', ')}.` }] : []),
  ] });
  if (spent) toast(`−${spent} gold`, 'gold');
  ST.save(S);
  undercroft();
}

function pickLine(pool) {
  const ok = pool.filter(goreVisible);
  return ok[Math.floor(Math.random() * ok.length)];
}

async function visitFlow(capId, kind, back = undercroft) {
  const cap = S.captives.find(c => c.id === capId);
  if (!cap) return;
  AU.sfx('ui');
  TOKEN_CTX.captive = cap.name;
  screen('', '');
  // named captives get their hand-written scenes first
  const cellEv = pickCellEvent(S, cap);
  if (cellEv) await playEvent(cellEv);
  const truth = !!document.querySelector(`.truth[data-cap="${capId}"]:checked`);
  const before = { brand: cap.brand, resolve: cap.resolve, regard: cap.regard };
  const res = ST.visitCaptive(S, capId, kind, { truth });
  if (!res.ok) { toast(esc(res.text[0] || 'Nothing happens.')); back(); return; }
  if (res.witness) TOKEN_CTX.ally = heroName(res.witness);
  const steps = [{ s: 'narr', t: pickLine(VISIT_LINES[kind]).t }];
  if (kind === 'bargain' && ST.isAlly(S, 'rue')) steps.push({ s: 'narr', t: pickLine(VISIT_LINES.rue_fine_print).t });
  for (const t of res.text) steps.push({ s: 'narr', t });
  if (res.outburst) steps.push({ s: 'narr', t: pickLine(VISIT_LINES.outburst).t });
  // a converted comrade sometimes stays to gloat — flavor only
  if (kind === 'testimony' && Math.random() < 0.6) {
    const taunt = TAUNT_LINES[Math.floor(Math.random() * TAUNT_LINES.length)];
    steps.push(...taunt);
    if (Math.random() < 0.5) { cap.regard = Math.min(100, cap.regard + 3); steps.push({ s: 'narr', t: '{captive} doesn\'t say anything else. But they watch the stair for a long time after {ally} leaves.' }); }
    else steps.push({ s: 'captive', t: 'TRAITOR! You\'re a TRAITOR!' });
  }
  await playEvent({ id: 'visit', steps });
  const d = k => { const n = cap[k] - before[k]; return n ? `${k} ${n > 0 ? '+' : ''}${n}` : ''; };
  const summary = ['brand', 'resolve', 'regard'].map(d).filter(Boolean).join(' · ');
  if (summary) toast(summary);
  if (res.cost) toast(`−${res.cost} gold`, 'gold');
  ST.save(S);
  if (cap.releasePending) toast(`${cap.name}'s brand is gone — head back to the Codex to release them.`, 'gold');
  back();
}

// ------------------------------------------------------------------
// Walking the cells and the pens: the same places, in 3D
// ------------------------------------------------------------------

function hubStage() {
  stage.setBiome(null);
  stage.battleCamera();
  stage.showcase(ST.roster(S).slice(0, 5), heroVariant);
  stage.camBase.set(0, 2.0, 6.2);
}
const playerLook = () => ({ model: 'player', variant: heroVariant('player') });
const dayPick = (arr, salt) => arr[(S.day + salt.length) % arr.length];

function cellMood(cap) {
  const n = esc(cap.name), k = cap.restraint || 'bars';
  if (cap.releasePending) return `${n}'s brand is gone. They're waiting to see what you'll do.`;
  if (cap.regard >= 40) return dayPick([`${n} is already at the front of the cell when you come down the stair.`, `${n} says your name like it's a relief to hear it out loud.`, `${n} has saved you a story from the night. It's a long one.`], cap.id);
  if (cap.regard >= 15) return `${n} watches you come, and doesn't look away.`;
  if (cap.resolve >= 70) return { bars: `${n} rattles the bars, just so you know they're still here.`, chains: `${n} hauls on the chains until the wall rings creak.`, stocks: `${n} glares up at you from the stocks, chin high.` }[k];
  if (cap.regard <= -30) return dayPick([`${n} won't look at you.`, `${n} turns their face to the wall.`], cap.id);
  if (cap.resolve <= 25) return `${n} has stopped testing the ${k === 'bars' ? 'bars' : k === 'chains' ? 'chains' : 'boards'}.`;
  return `${n} keeps very still and listens to your footsteps.`;
}

async function cellsView(sel = null) {
  AU.sfx('ui');
  const caps = S.captives;
  if (!caps.length) { hubStage(); undercroft(); return; }
  screen(`
    <div class="panel slim viewer-bar">
      <b>⛓ The cells</b><span class="muted sm-text">Tap someone to walk over · drag to look around</span>
      <div class="row gap"><button class="btn sm" id="cv-prev" title="Previous cell">◀</button><button class="btn sm" id="cv-next" title="Next cell">▶</button><button class="btn sm ghost" id="cv-list">☰ List</button></div>
    </div>
    <div id="cv-card"></div>`, 'viewer');
  const view = await buildCells(stage, caps, playerLook(), { variantOf: heroVariant });
  let cur = -1;
  const card = () => {
    const box = $('#cv-card'); if (!box) return;
    const cap = caps[cur];
    if (!cap) { box.innerHTML = ''; return; }
    const visited = cap.visitedDay === S.day, witness = ST.testimonyWitness(S, cap);
    const held = view.cells[cur].kind;
    box.innerHTML = `<div class="panel viewer-card">
      <div class="row spread"><h3>${esc(cap.name)}</h3><small class="muted">${esc(cap.title || '')} · day ${cap.days}</small></div>
      <p class="sm-text"><i>${cellMood(cap)}</i></p>
      ${view.warden(cap.id) ? `<p class="sm-text muted">Warden: ${esc(heroName(view.warden(cap.id)))} is posted outside the cell.</p>` : ''}
      ${view.overheard(cap.id) ? `<p class="sm-text muted">Overheard: ${esc(view.overheard(cap.id))}</p>` : ''}
      <div class="row gap sm-text"><span>Brand <b>${cap.brand}</b></span><span>Resolve <b>${cap.resolve}</b></span><span>Regard <b>${cap.regard > 0 ? '+' : ''}${cap.regard}</b></span></div>
      <div class="row gap sm-text">Keep them: ${Object.entries(RESTRAINTS).map(([k, r]) => `<button class="btn sm ${held === k ? 'primary' : ''} cv-hold" data-k="${k}">${r.icon} ${r.name}</button>`).join('')}</div>
      ${cap.releasePending ? '<b class="gold sm-text">The brand is gone. Release them from the Codex hub.</b>' : `
      <div class="visit-row">${Object.entries(ST.VISITS).map(([k, v]) => {
        const dis = visited || (k === 'testimony' && !witness) || (k === 'bargain' && S.gold < ST.bargainCost(S));
        const extra = k === 'bargain' ? ` (${ST.bargainCost(S)}g)` : k === 'testimony' && witness ? ` (${heroName(witness)})` : '';
        return `<button class="btn visit ${dis ? 'disabled' : ''}" data-k="${k}" title="${esc(v.desc)}">${v.icon} ${v.name}${extra}</button>`;
      }).join('')}</div>
      <div class="row gap sm-text">
        ${S.inventory.truth_draught ? `<label><input type="checkbox" class="truth" data-cap="${cap.id}"> use Truth Draught (×${S.inventory.truth_draught})</label>` : ''}
        ${visited ? '<span class="muted">visited today</span>' : ''}
      </div>`}
    </div>`;
    box.querySelectorAll('.cv-hold').forEach(b => b.onclick = () => { cap.restraint = b.dataset.k; AU.sfx('confirm'); ST.save(S); cellsView(cap.id); });
    box.querySelectorAll('.visit:not(.disabled)').forEach(b => b.onclick = () => visitFlow(cap.id, b.dataset.k, () => cellsView(cap.id)));
  };
  const show = i => { cur = (i + caps.length) % caps.length; AU.sfx('ui'); card(); view.visit(cur); };
  stage.onPick = uid => { const i = view.cells.findIndex(c => c.a.uid === uid); if (i >= 0) show(i); };
  $('#cv-prev').onclick = () => show(cur < 0 ? caps.length - 1 : cur - 1);
  $('#cv-next').onclick = () => show(cur + 1);
  $('#cv-list').onclick = () => { hubStage(); undercroft(); };
  const i = sel ? caps.findIndex(c => c.id === sel) : -1;
  if (i >= 0) show(i);
}

async function pensView(sel = null) {
  AU.sfx('ui');
  const beasts = S.menagerie;
  screen(`
    <div class="panel slim viewer-bar">
      <b>🐾 The pens</b><span class="muted sm-text">Tap a beast to walk over · drag to look around</span>
      <div class="row gap"><button class="btn sm" id="pv-prev" title="Previous pen">◀</button><button class="btn sm" id="pv-next" title="Next pen">▶</button><button class="btn sm ghost" id="pv-list">☰ List</button></div>
    </div>
    <div id="pv-card"></div>`, 'viewer');
  const view = await buildPens(stage, beasts, S.pens, S.eggs, playerLook());
  let cur = -1;
  const cost = ST.feedCost(S);
  const card = (note = '') => {
    const box = $('#pv-card'); if (!box) return;
    const b = beasts[cur];
    if (!b) { box.innerHTML = ''; return; }
    const mood = b.tame >= 100 ? `${esc(b.name)} trots to the gate the moment it sees you.` : b.tame >= 50 ? `${esc(b.name)} comes over to sniff your hand.` : b.tame < 25 ? `${esc(b.name)} keeps to the far corner and watches.` : `${esc(b.name)} pretends not to be interested.`;
    const hungry = !b.fed && b.hunger >= 50 ? ' It keeps nosing the empty trough.' : '';
    box.innerHTML = `<div class="panel viewer-card">
      <div class="row spread"><h3>${esc(b.name)}</h3><small class="muted">${esc(b.kind)}</small></div>
      <p class="sm-text"><i>${note || mood + hungry}</i></p>
      <div class="row gap sm-text"><span>Tame <b>${b.tame}</b></span><span>Hunger <b>${b.hunger}</b></span><span>${b.fed ? 'fed today' : 'not fed yet'}</span>${S.handlers[b.id] ? `<span>Handler: ${esc(heroName(S.handlers[b.id]))}</span>` : ''}</div>
      <div class="row gap">
        <button class="btn sm ${b.fed || S.gold < cost ? 'disabled' : ''}" id="pv-feed">${b.fed ? 'fed today' : `feed ◈${cost}g`}</button>
        <button class="btn sm ${b.pettedDay === S.day ? 'disabled' : ''}" id="pv-pet" title="Once a day. Tame beasts like it (+2 tame); wild ones don't.">${b.pettedDay === S.day ? 'petted today' : '♡ pet'}</button>
      </div>
    </div>`;
    const feed = $('#pv-feed'); if (feed && !feed.classList.contains('disabled')) feed.onclick = () => { if (ST.feedBeast(S, b.id)) { AU.sfx('coin'); ST.save(S); pensView(b.id); } };
    const pet = $('#pv-pet'); if (pet && !pet.classList.contains('disabled')) pet.onclick = () => {
      const r = ST.petBeast(S, b.id); if (!r) return;
      view.pet(cur, r.ok);
      AU.sfx(r.ok ? 'heal' : 'ui');
      ST.save(S);
      card(r.ok ? (b.tame >= 100 ? `${esc(b.name)} flops over for belly scratches.` : `${esc(b.name)} leans into your hand. (+2 tame)`) : `${esc(b.name)} snaps at your fingers. Not yet.`);
    };
  };
  const show = i => { if (!beasts.length) return; cur = (i + beasts.length) % beasts.length; AU.sfx('ui'); card(); view.visit(cur); };
  stage.onPick = uid => { const i = view.items.findIndex(it => it.a.uid === uid); if (i >= 0) show(i); };
  $('#pv-prev').onclick = () => show(cur < 0 ? beasts.length - 1 : cur - 1);
  $('#pv-next').onclick = () => show(cur + 1);
  $('#pv-list').onclick = () => { hubStage(); menagerie(); };
  const i = sel ? beasts.findIndex(b => b.id === sel) : -1;
  if (i >= 0) show(i);
}

// ------------------------------------------------------------------
// the Menagerie — pens, feeding, handlers, breeding
// ------------------------------------------------------------------

let breedPick = null;

function menagerie() {
  const handlerPool = ST.roster(S).filter(id => id !== 'player');
  const cost = ST.feedCost(S);
  const beasts = S.menagerie.map(b => {
    const fam = BEAST_FAMILIES[b.family];
    const handler = S.handlers[b.id] || '';
    return `<div class="cell-card ${breedPick === b.id ? 'release' : ''}">
      <div class="row spread"><h3>${esc(b.name)} <button class="btn sm ghost rename" data-id="${b.id}" title="Rename">✎</button></h3><small class="muted">${esc(b.kind)}</small></div>
      <div class="traits">${b.traits.map(t => `<span class="trait" title="${esc(BEAST_TRAITS[t].desc)}">${BEAST_TRAITS[t].name}</span>`).join('')}${b.tame >= 100 ? '<span class="trait" title="Its handler can summon it in battle.">★ trained</span>' : ''}</div>
      <div class="meter"><span>Tame</span>${bar('tame', b.tame)}<span>${b.tame}</span></div>
      <div class="meter"><span>Hunger</span>${bar('hunger', b.hunger)}<span>${b.hunger}</span></div>
      <div class="sm-text muted">Yields ${REAGENTS[b.yieldId].icon} ${REAGENTS[b.yieldId].name}${b.yieldId2 ? ` + ${REAGENTS[b.yieldId2].icon} ${REAGENTS[b.yieldId2].name}` : ''} when fed${fam.plant ? ' · plant (Nessa doubles)' : ''}${fam.infernal ? ' · infernal (Rue calms)' : ''}</div>
      <div class="sm-text muted">Handler: <select class="handler-sel" data-id="${b.id}"><option value="">— none —</option>${handlerPool.map(id => `<option value="${id}" ${handler === id ? 'selected' : ''}>${esc(heroName(id))}</option>`).join('')}</select> <small>(+50% yield${b.tame >= 100 ? '; summons it in battle' : ''})</small></div>
      <div class="row gap">
        <button class="btn sm feed ${b.fed || S.gold < cost ? 'disabled' : ''}" data-id="${b.id}">${b.fed ? 'fed today' : `feed ◈${cost}g`}</button>
        <button class="btn sm breed" data-id="${b.id}" title="Pick two tame (60+) beasts of the same family — or any family, if one is Crossblooded.">${breedPick === b.id ? 'cancel' : '♥ breed'}</button>
        ${b.traits.includes('codex_touched') ? '' : `<button class="btn sm imbue ${ST.canImbue(S, b.id) ? '' : 'disabled'}" data-id="${b.id}" title="Pour your mark into it (needs tame 80): Codex-Touched + Crossblooded. +1 Corruption.">✦ imbue ◈${ST.imbueCost(S)}g</button>`}
      </div>
    </div>`;
  }).join('');
  const eggs = S.eggs.map(e => `<span class="trait">🥚 ${esc(e.variant)} ${BEAST_FAMILIES[e.family].name.toLowerCase()} — hatches day ${e.hatchDay}</span>`).join(' ');
  const unfed = S.menagerie.filter(b => !b.fed).length;

  screen(`
    <div class="panel map-panel">
      <div class="row spread"><h2>🐾 The Menagerie</h2><div class="row gap"><span class="gold">◈ ${S.gold}g</span><button class="btn ghost" id="mn-back">← Codex</button></div></div>
      <p class="muted">Pens: <b>${S.menagerie.length}/${S.pens}</b>. Fed beasts tame up and produce reagents each night; hungry ones sour, and below 10 tame they may bolt. Tame 100 and a beast's handler can summon it in battle. At tame 80 you can <b>imbue</b> a beast with your mark — it becomes Crossblooded and can breed across families into hybrids that yield both parents' reagents. ${eggs ? '<br>' + eggs : ''}</p>
      <div class="row gap">
        <button class="btn ${unfed && S.gold >= cost * unfed ? '' : 'disabled'}" id="mn-feedall">Feed all (◈${cost * unfed}g)</button>
        <button class="btn ${S.gold >= ST.penCost(S) ? '' : 'disabled'}" id="mn-pen">Build a pen (◈${ST.penCost(S)}g)</button>
        ${S.menagerie.length || S.eggs.length ? '<button class="btn" id="mn-walk" title="Walk among the pens and watch them roam.">👁 Walk the pens</button>' : ''}
      </div>
      ${S.menagerie.length ? `<div class="cells scroll-list">${beasts}</div>` : '<p class="muted">The pens are empty. Seal a beast (🐾) in a rift.</p>'}
      ${bowerHtml()}
    </div>
  `);
  $('#mn-back').onclick = () => { breedPick = null; hub(); };
  if ($('#mn-walk')) $('#mn-walk').onclick = () => { breedPick = null; pensView(); };
  bindBower();
  $('#mn-feedall').onclick = () => { let n = 0; for (const b of S.menagerie) if (ST.feedBeast(S, b.id)) n++; if (n) { AU.sfx('coin'); toast(`Fed ${n}.`); } ST.save(S); menagerie(); };
  $('#mn-pen').onclick = () => { if (ST.buyPen(S)) { AU.sfx('promo'); toast('A new pen.'); ST.save(S); menagerie(); } };
  document.querySelectorAll('.feed:not(.disabled)').forEach(b => b.onclick = () => { if (ST.feedBeast(S, b.dataset.id)) { AU.sfx('coin'); ST.save(S); menagerie(); } });
  document.querySelectorAll('.handler-sel').forEach(sel => sel.onchange = () => { ST.assignHandler(S, sel.dataset.id, sel.value || null); AU.sfx('confirm'); ST.save(S); menagerie(); });
  document.querySelectorAll('.rename').forEach(b => b.onclick = () => {
    const beast = S.menagerie.find(x => x.id === b.dataset.id);
    const nm = prompt('Name this beast:', beast.name);
    if (nm && nm.trim()) { beast.name = nm.trim().slice(0, 16); ST.save(S); menagerie(); }
  });
  document.querySelectorAll('.imbue:not(.disabled)').forEach(b => b.onclick = () => {
    if (!confirm('Imbue this beast with your mark? (+1 Corruption)')) return;
    if (ST.imbueBeast(S, b.dataset.id)) { AU.sfx('promo'); toast('Violet light floods its veins. Codex-Touched, and Crossblooded.', 'gold'); ST.save(S); menagerie(); }
  });
  document.querySelectorAll('.breed').forEach(b => b.onclick = () => {
    const id = b.dataset.id;
    if (!breedPick || breedPick === id) { breedPick = breedPick === id ? null : id; menagerie(); return; }
    const egg = ST.breed(S, breedPick, id);
    if (egg) { AU.sfx('promo'); toast(`An egg! A ${egg.variant} variant, due on day ${egg.hatchDay}.`, 'gold'); }
    else toast('They need to share a family (or one must be Crossblooded), both tame 60+, not bred before, with a pen free.');
    breedPick = null;
    ST.save(S);
    menagerie();
  });
}

// Kinship tracker: who of the tribe has chosen you, and how close they've come.
function kinHtml(tid) {
  const k = ST.kinInfo(S, tid), t = S.tribes[tid], T = TRIBES[tid];
  if (!k.count) return `<div class="sm-text muted">Kinship: none yet. If ${esc(T.envoyName)} asks you for the rite herself, others of the tribe may follow.</div>`;
  const pct = k.next ? Math.round(100 * k.count / k.next) : 100;
  return `<div class="kin-box">
    <div class="row spread"><b style="color:${T.color}">Kinship: ${esc(k.name)}</b><small class="muted">${k.count} kin · ${k.rites} rite${k.rites === 1 ? '' : 's'} shared</small></div>
    ${bar('regard', pct)}
    <div class="sm-text muted">${k.next ? `${k.count}/${k.next} kin → ${esc(k.nextName)}` : 'Kinship complete.'}</div>
    <div class="sm-text muted">${esc(k.desc)}${k.every ? ` A new suitor comes about every ${k.every} days.` : ''}</div>
    <div class="sm-text">${t.kin.map(x => `<span class="kin-name" title="${esc(x.who || 'envoy')}">${esc(x.name)}</span>`).join(' · ')}</div>
  </div>`;
}

// The brood: rites offered, the tribe's growth, and whose looks it's taking after.
const hexCss = h => '#' + (h >>> 0).toString(16).padStart(6, '0');
function broodHtml(tid) {
  const b = ST.broodInfo(S, tid);
  if (!b.rites) return '';
  const old = Math.max(0, 100 - b.lines.reduce((a, l) => a + 100 * l.share, 0));
  return `<div class="kin-box brood-box">
    <div class="row spread"><b>🥚 The Brood</b><small class="muted">${b.rites} rite${b.rites === 1 ? '' : 's'} offered</small></div>
    <div class="sm-text"><b>${b.pop}</b> strong: ${b.base} at the oath, +${b.born} ${esc(b.young)} of your blood${b.warming ? ` · ${b.warming} more on the way` : ''}</div>
    <div class="bloodline">${b.lines.map(l => `<span style="width:${(100 * l.share).toFixed(1)}%;background:${hexCss(l.hex)}" title="${esc(l.name)}: ${l.n} (${esc(l.word)})"></span>`).join('')}</div>
    <div class="sm-text muted">${b.lines.slice(0, 4).map(l => `<i style="color:${hexCss(l.hex)};font-style:normal">■</i> ${esc(l.name)} ${Math.round(100 * l.share)}%`).join(' · ')}${b.lines.length ? ` · old blood ${Math.round(old)}%` : 'No young have hatched yet.'}</div>
    <div class="sm-text">Most often with: ${b.pairs.slice(0, 4).map(([n, c]) => `${esc(n)} ×${c}`).join(' · ')}</div>
    ${b.resemble ? `<div class="sm-text gold">${esc(b.resemble)}</div>` : ''}
  </div>`;
}

// The Envoys' Bower: visiting tribe envoys keep a corner of the Menagerie.
function guestHtml() {
  const here = Object.keys(GUESTS).filter(id => ST.guestHere(S, id));
  if (!here.length) return '';
  return `<h3 style="margin-top:12px">🕊 Guests under your protection</h3>
    <div class="cells">${here.map(id => {
      const G = GUESTS[id], g = S.guests[id], T = TRIBES[G.tribe];
      const rom = ST.guestRomanceOpen(S, id), eve = ST.guestEveningOpen(S, id), romanced = !!S.seen[`${id}_romance`];
      return `<div class="cell-card">
        <div class="recruit-head">${portraitImg(id)}<div><b style="color:${G.color}">${esc(G.name)}</b> <small class="muted">of ${esc(G.of.replace(/^the /, 'the '))}</small><br><small class="muted">${esc(G.race)} · ${g.truce ? `truce with ${esc(T.envoyName)}` : 'waiting for a truce'}</small></div></div>
        ${g.truce ? `<div class="meter"><span>Favor</span>${bar('regard', g.favor * 10)}<span>${g.favor}/10</span></div>
        <div class="visit-row">
          <button class="btn gw-talk ${g.talkDay === S.day ? 'disabled' : ''}" data-g="${id}">❝ Talk</button>
          ${rom ? `<button class="btn gw-rom notify" data-g="${id}">♡ He has something to ask you</button>` : ''}
          ${romanced ? `<button class="btn gw-eve ${eve ? '' : 'disabled'}" data-g="${id}" title="${eve ? '' : 'One evening a night; every third night with him.'}">☾ Evening</button>` : ''}
        </div>` : `<p class="sm-text gold">He asked you to negotiate with ${esc(T.envoyName)} for ${esc(G.of)}. Use Talk at the hub to broker the truce.</p>`}
      </div>`;
    }).join('')}</div>`;
}

function bowerHtml() {
  const here = Object.keys(TRIBES).filter(tid => ST.envoyHere(S, tid));
  if (!here.length) return guestHtml();
  const own = Object.entries(S.reagents).filter(([, n]) => n >= 2).map(([r]) => r);
  return `<h3 style="margin-top:12px">🪶 The Envoys' Bower</h3>
    <p class="muted sm-text">A warm corner of the Menagerie kept for visiting envoys. Talk with them, trade with them; once one has asked for the rite, she may invite you to spend the night.</p>
    <div class="cells">${here.map(tid => {
      const T = TRIBES[tid], t = S.tribes[tid];
      const nightOpen = ST.envoyNightOpen(S, tid);
      return `<div class="cell-card">
        <div class="recruit-head">${portraitImg(T.envoy)}<div><b style="color:${T.color}">${esc(SPEAKERS[T.envoy].name)}</b><br><small class="muted">${esc(T.race)} · ${t.status}</small></div></div>
        <div class="meter"><span>Favor</span>${bar('regard', t.favor * 10)}<span>${t.favor}/10</span></div>
        ${t.status === 'sworn' && t.kin && t.kin.length ? `<div class="sm-text gold">Kinship: ${esc(ST.kinInfo(S, tid).name)} · ${t.kin.length} kin</div>` : ''}
        ${t.suitor ? `<div class="recruit-head suitor">${portraitImg(ST.kinKey(tid, t.suitor.name))}<div><b style="color:${T.color}">${esc(t.suitor.name)}</b><br><small class="muted">${esc(t.suitor.who)} — has come to ask for you herself.</small><br><button class="btn sm bw-suitor" data-t="${tid}">Meet her</button></div></div>` : ''}
        ${t.status === 'sworn' && t.kin.some(k => !k.envoy) ? `<div class="visit-row">
          <select class="bw-kin" data-t="${tid}">${t.kin.filter(k => !k.envoy).map(k => `<option value="${esc(k.name)}">${esc(k.name)}${t.pairs && t.pairs[k.name] ? ` (×${t.pairs[k.name]})` : ''}</option>`).join('')}</select>
          <button class="btn bw-kinnight ${ST.kinEveningOpen(S, tid) ? '' : 'disabled'}" data-t="${tid}" title="${ST.kinEveningOpen(S, tid) ? '' : 'You can send for one of your kin every other day.'}">☾ Send for her</button>
        </div>` : ''}
        <div class="visit-row">
          <button class="btn bw-talk ${t.talkDay === S.day ? 'disabled' : ''}" data-t="${tid}">❝ Talk</button>
          <select class="bw-give" data-t="${tid}">${own.length ? own.map(r => `<option value="${r}">give 2× ${REAGENTS[r].name}</option>`).join('') : '<option value="">nothing to trade</option>'}</select>
          <button class="btn bw-trade ${t.tradeDay === S.day || !own.length ? 'disabled' : ''}" data-t="${tid}">⚖ Trade (→ ${ST.envoyTradeRate(S, tid)}× ${REAGENTS[ST.envoyTradeGood(tid, own[0])].name})</button>
          ${S.flags['rite_' + tid] ? `<button class="btn bw-night ${nightOpen ? '' : 'disabled'}" data-t="${tid}" title="${nightOpen ? '' : 'She\'ll invite you again in a few days (favor 3+).'}">☾ Evening</button>` : ''}
        </div>
      </div>`;
    }).join('')}</div>${guestHtml()}`;
}

function bindBower() {
  document.querySelectorAll('.gw-talk:not(.disabled)').forEach(b => b.onclick = async () => {
    const id = b.dataset.g, fav = ST.guestTalk(S, id);
    if (fav == null) return;
    const lines = GUEST_TALK[id];
    screen('', '');
    await playEvent({ id: 'banter', steps: [{ s: id, t: lines[(S.day + fav) % lines.length] }] });
    ST.save(S); menagerie();
  });
  document.querySelectorAll('.gw-rom').forEach(b => b.onclick = async () => {
    const id = b.dataset.g;
    screen('', ''); await playEvent(EVENTS[id + '_romance']);
    if (S.seen[id + '_romance']) { S.guests[id].nightDay = S.day; S.eveningDay = S.day; } // tonight was the first night
    ST.save(S); menagerie();
  });
  document.querySelectorAll('.gw-eve:not(.disabled)').forEach(b => b.onclick = async () => {
    const id = b.dataset.g;
    screen('', ''); await playEvent(EVENTS[id + '_evening']); ST.guestEvening(S, id); ST.save(S); menagerie();
  });
  document.querySelectorAll('.bw-talk:not(.disabled)').forEach(b => b.onclick = async () => {
    const tid = b.dataset.t, T = TRIBES[tid];
    const r = ST.envoyTalk(S, tid);
    if (!r) return;
    const lines = BOWER_TALK[T.envoy] || ['…'];
    screen('', '');
    await playEvent({ id: 'bower_talk', steps: [{ s: T.envoy, t: lines[(S.day + r.favor) % lines.length] }, ...(r.gift ? [{ s: 'narr', t: `She leaves you a gift from home: 2× ${REAGENTS[r.gift].name}.` }] : [])] });
    ST.save(S); menagerie();
  });
  document.querySelectorAll('.bw-give').forEach(sel => sel.onchange = () => {
    const tid = sel.dataset.t, btn = document.querySelector(`.bw-trade[data-t="${tid}"]`);
    if (btn && sel.value) btn.textContent = `⚖ Trade (→ ${ST.envoyTradeRate(S, tid)}× ${REAGENTS[ST.envoyTradeGood(tid, sel.value)].name})`;
  });
  document.querySelectorAll('.bw-trade:not(.disabled)').forEach(b => b.onclick = () => {
    const tid = b.dataset.t;
    const give = document.querySelector(`.bw-give[data-t="${tid}"]`).value;
    const r = ST.envoyTrade(S, tid, give);
    if (r) { AU.sfx('coin'); toast(`Traded: +${r.n}× ${REAGENTS[r.want].name}`, 'gold'); ST.save(S); menagerie(); }
  });
  document.querySelectorAll('.bw-suitor').forEach(b => b.onclick = async () => {
    const tid = b.dataset.t, su = S.tribes[tid].suitor;
    Object.assign(TOKEN_CTX, { kin: su.name, kinWho: su.who, kinId: ST.kinKey(tid, su.name) });
    screen('', '');
    await playEvent(EVENTS['kin_rite_' + tid]);
    const ans = S.flags['kin_yes_' + tid] ? 'yes' : S.flags['kin_no_' + tid] ? 'no' : 'later';
    delete S.flags['kin_yes_' + tid]; delete S.flags['kin_no_' + tid];
    ST.kinAnswer(S, tid, ans);
    if (ans === 'yes') { AU.sfx('promo'); toast(`${su.name} carries your blood home. Kinship: ${ST.kinInfo(S, tid).name}.`, 'gold'); }
    ST.save(S); menagerie();
  });
  document.querySelectorAll('.bw-kinnight:not(.disabled)').forEach(b => b.onclick = async () => {
    const tid = b.dataset.t, name = document.querySelector(`.bw-kin[data-t="${tid}"]`).value;
    const k = S.tribes[tid].kin.find(x => x.name === name);
    Object.assign(TOKEN_CTX, { kin: name, kinWho: (k && k.who) || '', kinId: ST.kinKey(tid, name) });
    const ev = EVENTS['kin_night_' + tid];
    screen('', '');
    if (Math.random() < 0.15) {
      // she has her own life: not tonight, but tomorrow
      await playEvent({ id: 'kin_busy', steps: [{ s: 'narr', t: ev.busy }] });
      S.tribes[tid].kinNightDay = S.day - 1;
    } else {
      await playEvent(ev);
      const together = !!S.flags['kin_night_yes_' + tid];
      delete S.flags['kin_night_yes_' + tid];
      ST.kinEvening(S, tid, name, together);
    }
    ST.save(S); menagerie();
  });
  document.querySelectorAll('.bw-night:not(.disabled)').forEach(b => b.onclick = async () => {
    const tid = b.dataset.t;
    const ev = EVENTS['envoy_night_' + tid];
    screen('', '');
    // her invitation; your choice decides — a night together, or just talk
    await playEvent(ev);
    if (S.flags['night_yes_' + tid]) { delete S.flags['night_yes_' + tid]; ST.kinNight(S, tid); }
    if (ST.envoyNight(S, tid)) toast(`She sends you home with a gift from the tribe.`, 'gold');
    ST.save(S); menagerie();
  });
}

// ------------------------------------------------------------------
// alchemy — the cauldron
// ------------------------------------------------------------------

let cauldron = [];

const unknownRecipes = () => Object.keys(RECIPES).filter(rid => !S.recipes.includes(rid));
function alchemy() {
  const have = id => (S.reagents[id] || 0) - cauldron.filter(x => x === id).length;
  const reagentBtns = Object.entries(REAGENTS).map(([id, r]) =>
    `<button class="reagent ${have(id) > 0 ? '' : 'empty'}" data-id="${id}" title="${esc(r.desc)}">${r.icon} ${r.name} ×${S.reagents[id] || 0}</button>`).join('');
  const known = S.recipes.map(rid => {
    const r = RECIPES[rid];
    return `<div class="shop-row"><div><b>${ITEMS[r.makes].name}</b><p class="muted sm-text">${r.needs[0] === '*' ? 'any one reagent' : r.needs.map(n => REAGENTS[n].name).join(' + ')}${r.gold ? ` + ${r.gold}g` : ''} — ${esc(ITEMS[r.makes].desc)}</p></div></div>`;
  }).join('') || '<p class="muted">No recipes yet. Experiment — the Codex writes down what works.</p>';
  const brewed = Object.entries(S.inventory).filter(([id, n]) => n > 0 && ITEMS[id] && ITEMS[id].brewed);
  screen(`
    <div class="panel shop-panel">
      <div class="row spread"><h2>⚗ Alchemy</h2><div class="row gap"><span class="gold">◈ ${S.gold}g</span><button class="btn ghost" id="al-back">← Codex</button></div></div>
      <div class="shop-cols">
        <div>
          <h3>Reagents</h3>
          <div class="reagent-grid">${reagentBtns}</div>
          <div class="cauldron">⚱</div>
          <p class="center-text">${cauldron.length ? cauldron.map(id => REAGENTS[id].name).join(' + ') : '<span class="muted">Pick one to three reagents.</span>'}</p>
          <div class="row gap"><button class="btn primary ${cauldron.length ? '' : 'disabled'}" id="al-brew">Brew</button><button class="btn ghost" id="al-clear">Empty</button></div>
          <h3>Sell reagents</h3>
          <div class="reagent-grid">${Object.entries(REAGENTS).filter(([id]) => S.reagents[id] > 0).map(([id, r]) => `<button class="reagent sell-r" data-id="${id}">${r.icon} sell ◈${r.price}</button>`).join('') || '<span class="muted">nothing to sell</span>'}</div>
        </div>
        <div>
          <h3>Recipes in the Codex</h3>${known}
          ${unknownRecipes().length ? `<h3>Still to discover</h3>${unknownRecipes().map(rid => `<div class="shop-row"><div><b>??? ${esc(ITEMS[RECIPES[rid].makes].name)}</b><p class="muted sm-text">${esc(RECIPE_HINTS[rid] || '')} ${esc(ITEMS[RECIPES[rid].makes].desc)}</p></div></div>`).join('')}
          <p class="sm-text gold">${ST.packOn(S, 'rift') && TOWN.townOpen(S) ? 'Diane, the herb-wife on Larkspur Lane, can teach you any of these.' : ST.packOn(S, 'rift') ? 'Someone who knows herbs may turn up nearby soon.' : 'Brew what the clues suggest: the Codex writes it down when it works.'}</p>` : ''}
          <h3>Brewed</h3>
          ${brewed.length ? brewed.map(([id, n]) => `<div class="shop-row"><div><b>${ITEMS[id].name}</b> ×${n}<p class="muted sm-text">${esc(ITEMS[id].desc)}</p></div><button class="btn sm sell-p" data-id="${id}">sell ◈${ITEMS[id].sell}</button></div>`).join('') : '<p class="muted">Nothing brewed.</p>'}
        </div>
      </div>
    </div>
  `);
  $('#al-back').onclick = () => { cauldron = []; hub(); };
  $('#al-clear').onclick = () => { cauldron = []; alchemy(); };
  document.querySelectorAll('.reagent:not(.empty):not(.sell-r)').forEach(b => b.onclick = () => {
    if (cauldron.length >= 3) { toast('The cauldron takes three at most.'); return; }
    cauldron.push(b.dataset.id); AU.sfx('ui'); alchemy();
  });
  $('#al-brew').onclick = () => {
    if (!cauldron.length) return;
    const r = ST.brew(S, cauldron);
    if (!r.ok) { toast(esc(r.msg)); return; }
    cauldron = [];
    if (r.made === 'sludge') { AU.sfx('miss'); toast('It bubbles, sighs, and becomes… Questionable Sludge.'); }
    else { AU.sfx(r.discovered ? 'promo' : 'magic'); toast(r.discovered ? `Discovered: ${ITEMS[r.made].name}! The Codex writes it down.` : `Brewed: ${ITEMS[r.made].name}`, 'gold'); }
    ST.save(S);
    alchemy();
  };
  document.querySelectorAll('.sell-r').forEach(b => b.onclick = () => { const v = ST.sellReagent(S, b.dataset.id); if (v) { AU.sfx('coin'); ST.save(S); alchemy(); } });
  document.querySelectorAll('.sell-p').forEach(b => b.onclick = () => { const v = ST.sellItem(S, b.dataset.id); if (v) { AU.sfx('coin'); ST.save(S); alchemy(); } });
}

// ------------------------------------------------------------------
// the pact altar
// ------------------------------------------------------------------

function altar() {
  const allies = ST.roster(S).filter(id => id !== 'player');
  const live = S.chronicle.map((c, i) => ({ c, i })).filter(x => !x.c.crossed);
  const rows = Object.entries(PACTS).map(([id, p]) => {
    const ok = ST.canPact(S, id);
    const taken = S.pacts.filter(x => x === id).length;
    let picker = '';
    if (p.cost === 'trust') picker = `<select id="pk-${id}">${allies.map(a => `<option value="${a}">${esc(heroName(a))} (bond ${S.bond[a] ?? 0})</option>`).join('')}</select>`;
    if (p.cost === 'memory') picker = `<select id="pk-${id}">${live.slice(-8).reverse().map(x => `<option value="${x.i}">Day ${x.c.day}: ${esc(x.c.text.slice(0, 60))}</option>`).join('')}</select>`;
    return `<div class="pact-row">
      <b>${p.name}${taken ? ` <small class="muted">sworn ×${taken}</small>` : ''}</b>
      <span class="muted sm-text">${esc(p.desc)}</span>
      <span class="sm-text" style="color:var(--corrupt)">+${p.corruption} Corruption${p.gold ? ` · ◈${p.gold}g` : ''}</span>
      ${picker}
      <button class="btn sm swear ${ok && (p.cost !== 'trust' || allies.length) ? '' : 'disabled'}" data-id="${id}">Swear it</button>
    </div>`;
  }).join('');
  screen(`
    <div class="panel shop-panel">
      <div class="row spread"><h2>☩ The Pact Altar</h2><button class="btn ghost" id="pa-back">← Codex</button></div>
      <p class="muted">Black stone that sweats ink. Everything here is permanent, and everything here costs. <b>Corruption ${S.corruption}/100</b> — at 50 the sixth slot opens; at 80 the Undercroft fears you; it decides how this ends.</p>
      <div class="corrupt-wrap">${bar('corrupt', S.corruption)}<span class="corrupt-num">☩ ${S.corruption}</span></div>
      <div class="cells">${rows}</div>
    </div>
  `);
  $('#pa-back').onclick = () => hub();
  document.querySelectorAll('.swear:not(.disabled)').forEach(b => b.onclick = async () => {
    const id = b.dataset.id;
    const pk = $('#pk-' + id);
    const p = PACTS[id];
    if (!confirm(`Swear ${p.name}? This is permanent. (+${p.corruption} Corruption)`)) return;
    const opts = p.cost === 'trust' ? { heroId: pk && pk.value } : p.cost === 'memory' ? { entry: pk ? Number(pk.value) : undefined } : {};
    if (ST.swearPact(S, id, opts)) {
      AU.sfx('gate');
      toast(`The altar drinks. ${p.name} is sworn.`, 'gold');
      if (p.cost === 'scar') { toast('The Codex carves a burning scar across your face.', ''); await refreshPortraits(true); }
      ST.save(S);
      await drainQueue();
      altar();
    }
  });
}

// ------------------------------------------------------------------
// the Chronicle
// ------------------------------------------------------------------

function chronicle() {
  const entries = S.chronicle.slice().reverse();
  const mem = memories();
  screen(`
    <div class="panel shop-panel">
      <div class="row spread"><h2>📖 The Chronicle</h2><div class="row gap"><button class="btn" id="ch-paths" title="Every fork in the story: what you chose, and what you passed up.">🜲 Paths</button><button class="btn ghost" id="ch-back">← Codex</button></div></div>
      <p class="muted">A living book that writes itself after significant moments — in a hand neither of you recognizes. Pages sold at the altar are crossed out, but never quite gone.</p>
      ${hearthHtml()}
      ${mem.length ? `<details class="memories"><summary><b>✦ Memories</b> <small class="muted">${mem.length} scene${mem.length === 1 ? '' : 's'} to revisit</small></summary>
        <div class="mem-list">${mem.map(ev => `<button class="btn sm mem" data-ev="${ev.id}">${esc(memoryLabel(ev))}</button>`).join('')}</div></details>` : ''}
      <div class="scroll-list">${entries.length ? entries.map(e => `<div class="chron-entry ${e.crossed ? 'crossed' : ''}"><span class="chron-day">Day ${e.day}</span>${esc(e.text)}</div>`).join('') : '<p class="muted">The pages are still blank.</p>'}</div>
    </div>
  `);
  $('#ch-back').onclick = () => hub();
  $('#ch-paths').onclick = () => { AU.sfx('ui'); paths(chronicle); };
  bindMemories(chronicle);
}

// --- Paths: every fork you took, and the ones you passed up --------------------------

// Every choice in every event, keyed by its event and its order in it, so a pick
// can be remembered and shown later. Rebuilt if packs add events.
let CHOICE_INDEX = null, CHOICE_EVENTS = 0;
function choiceIndex() {
  const n = Object.keys(EVENTS).length;
  if (CHOICE_INDEX && CHOICE_EVENTS === n) return CHOICE_INDEX;
  CHOICE_INDEX = new Map(); CHOICE_EVENTS = n;
  for (const ev of Object.values(EVENTS)) {
    let k = 0;
    const walk = (steps, parent) => { for (const st of steps || []) if (st && st.choice) { const key = `${ev.id}#${k++}`; CHOICE_INDEX.set(st, { ev, key, parent }); st.choice.forEach((c, i) => walk(c.r, { key, i })); } };
    walk(ev.steps, null);
  }
  return CHOICE_INDEX;
}
const PATH_GROUPS = { intro: 'The beginning', cell: 'The Undercroft', recruit: 'Recruits', rift: 'Larkspur Lane', lane: 'Larkspur Lane', season: 'Larkspur Lane',
  kin: 'The wild tribes', tribe: 'The wild tribes', envoy: 'The wild tribes', envoys: 'The wild tribes', brats: 'The wild tribes', circle: 'The Circle', sister: 'The Sisters', bride: 'The Bride', revenant: 'The Revenant', dawnward: 'The Dawnward Company' };
function pathGroup(ev) {
  const p = ev.id.split('_')[0];
  return PATH_GROUPS[p] || (SPEAKERS[p] && SPEAKERS[p].name) || (HEROES[p] && HEROES[p].name) || p.charAt(0).toUpperCase() + p.slice(1);
}
function pathTitle(ev) {
  let found = null;
  const walk = steps => { for (const st of steps || []) { if (found) return; if (typeof st.chronicle === 'string') found = st.chronicle; if (st.choice) st.choice.forEach(c => walk(c.r)); } };
  walk(ev.steps);
  return found || ev.id.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
}
let pathsSpoil = false;
function paths(back = chronicle) {
  const byEv = new Map();
  for (const [st, m] of choiceIndex()) if (m.ev.once) { if (!byEv.has(m.ev)) byEv.set(m.ev, []); byEv.get(m.ev).push({ st, ...m }); }
  const groups = new Map();
  let made = 0, passed = 0, unfound = 0;
  for (const [ev, blocks] of byEv) {
    const g = pathGroup(ev);
    if (!groups.has(g)) groups.set(g, { seen: [], unseen: [] });
    if (S.seen[ev.id]) {
      const rows = blocks.map(b => {
        const pick = S.choices && S.choices[b.key];
        const parentPick = b.parent && S.choices && S.choices[b.parent.key];
        if (!pick) {
          if (b.parent && parentPick && parentPick.i !== b.parent.i) return ''; // behind a path you didn't take
          if (S.pathsFrom != null && (S.seenDay && S.seenDay[ev.id]) >= S.pathsFrom) return ''; // it never came up
          return `<div class="path-fork muted sm-text">${b.st.choice.map(c => esc(subName(c.t))).join(' · ')} <i>(chosen before the Paths ledger began)</i></div>`;
        }
        made++; passed += b.st.choice.length - 1;
        return `<div class="path-fork">${b.st.choice.map((c, i) => i === pick.i
          ? `<div class="path-took">✓ ${esc(subName(c.t))} <small class="muted">day ${pick.day}</small></div>`
          : `<div class="path-missed">○ ${esc(subName(c.t))}</div>`).join('')}</div>`;
      }).join('');
      groups.get(g).seen.push(`<div class="path-ev"><b class="sm-text">${esc(subName(pathTitle(ev)))}</b>${rows}</div>`);
    } else {
      unfound++;
      groups.get(g).unseen.push(ev);
    }
  }
  const sections = [...groups.entries()].sort((a, b) => b[1].seen.length - a[1].seen.length || a[0].localeCompare(b[0])).map(([g, x]) => `
    <details class="faction-section" ${x.seen.length ? '' : ''}>
      <summary><b>${esc(g)}</b> <small class="muted">${x.seen.length} found${x.unseen.length ? ` · ${x.unseen.length} still hidden` : ' · all found'}</small></summary>
      ${x.seen.join('')}
      ${x.unseen.length ? (pathsSpoil ? x.unseen.map(ev => `<div class="path-ev hidden-ev"><b class="sm-text muted">? ${esc(subName(pathTitle(ev)))}</b></div>`).join('') : `<p class="muted sm-text">${x.unseen.length} scene${x.unseen.length === 1 ? '' : 's'} with choices you haven't found yet.</p>`) : ''}
    </details>`).join('');
  screen(`
    <div class="panel shop-panel">
      <div class="row spread"><h2>🜲 Paths</h2><button class="btn ghost" id="pa-back">← Back</button></div>
      <p class="muted sm-text">Every fork in the story. ✓ is the way you went; ○ is a path you passed up. You've made <b>${made}</b> choices and passed up <b>${passed}</b> paths; <b>${unfound}</b> scenes with choices are still waiting to be found.</p>
      <label class="set-row sm-text">Show the names of scenes you haven't found (spoilers) <input type="checkbox" id="pa-spoil" ${pathsSpoil ? 'checked' : ''}></label>
      <div class="scroll-list">${sections}</div>
    </div>`);
  $('#pa-back').onclick = () => back();
  $('#pa-spoil').onchange = e => { pathsSpoil = e.target.checked; paths(back); };
}

// --- the hearth, memories, and spending time ---------------------------------------

function hearthHtml(only = null) {
  const kids = (S.family || []).filter(c => !only || c.parent === only);
  const due = Object.entries(S.expecting || {}).filter(([id]) => !only || id === only);
  if (!kids.length && !due.length) return '';
  return `<div class="hearth"><b>🏠 Hearth</b>
    ${kids.map(c => `<div class="sm-text">${esc(c.name)} <span class="muted">— with ${esc(heroName(c.parent))}, born day ${c.day}${c.secret ? ' · Brad thinks they\'re his' : ''}</span></div>`).join('')}
    ${due.map(([id, d]) => `<div class="sm-text gold">${esc(heroName(id))} is expecting <span class="muted">— due in ${Math.max(0, d - S.day)} day${d - S.day === 1 ? '' : 's'}</span></div>`).join('')}
  </div>`;
}

const hasSpice = steps => (steps || []).some(st => st.spice || (st.choice && st.choice.some(c => hasSpice(c.r))));
// Seen, once-only intimate scenes, optionally just the ones a given character is in.
function memories(who = null) {
  return Object.values(EVENTS).filter(ev => ev.once && S.seen[ev.id] && hasSpice(ev.steps)
    && (!who || ev.id.startsWith(who + '_') || (ev.cond && ev.cond.__allies && ev.cond.__allies.includes(who))));
}
function memoryLabel(ev) {
  const ids = (ev.cond && ev.cond.__allies) || [];
  const solo = ids.length === 1 && ev.id.startsWith(ids[0] + '_');
  const what = (solo ? ev.id.slice(ids[0].length + 1) : ev.id).replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
  return ids.length ? `${ids.map(heroName).join(', ')}: ${what}` : what;
}
function bindMemories(back) {
  document.querySelectorAll('.mem').forEach(b => b.onclick = async () => {
    screen('', '');
    await playEvent(EVENTS[b.dataset.ev], { replay: true });
    back();
  });
}

// A companion's own page: time together, evenings, family, memories.
function companion(id) {
  const away = ST.dispatchedIds(S).has(id);
  const open = ST.hangoutOpen(S, id) && !away;
  const romanced = ST.romanced(S, id);
  const evOk = romanced && ST.eveningOpen(S, id) && !away;
  const evEvent = EVENTS[`${id}_evening`];
  const close = ST.closeness(S, id);
  const waiting = Object.values(EVENTS).find(ev => (ev.where === 'camp' || ev.where === 'guild') && ev.id.startsWith(id + '_') && !(ev.once && S.seen[ev.id]) && (!ev.cond || ev.cond(S)));
  const mem = memories(id);
  const where = away ? 'away on a dispatch' : 'at the Codex';
  screen(`
    <div class="panel shop-panel companion">
      <div class="row spread"><h2 style="color:${heroColor(id)}">${esc(heroName(id))}</h2><button class="btn ghost" id="cp-back">← Codex</button></div>
      <div class="recruit-head">${portraitImg(id)}<div>
        <b>${esc(heroDesc(S, id).epithet || '')}</b><br><small class="muted">${esc(heroDesc(S, id).cls || '')} · ${where}</small><br>${heartsFor(id)} <small class="muted">bond ${S.bond[id] ?? 0}/10</small>
      </div></div>
      <div class="meter"><span>Closeness</span>${bar('regard', 100 * close / ST.CLOSE_PER_BOND)}<span>${close}/${ST.CLOSE_PER_BOND}</span></div>
      <p class="muted sm-text">Spend time together once a day. Every ${ST.CLOSE_PER_BOND} visits deepens your bond.${romanced && evEvent ? ' Evenings together count too, and you can share one every other night.' : ''}</p>
      <div class="visit-row">
        <button class="btn cp-act ${open ? '' : 'disabled'}" data-k="talk">❝ Talk</button>
        <button class="btn cp-act ${open ? '' : 'disabled'}" data-k="train">⚔ Train together</button>
        <button class="btn cp-act ${open ? '' : 'disabled'}" data-k="walk">☘ Walk</button>
        ${romanced && evEvent ? `<button class="btn cp-eve ${evOk ? '' : 'disabled'}" title="${evOk ? '' : 'One evening a night, and every other night with the same partner.'}">☾ Evening</button>` : ''}
      </div>
      ${away ? '<p class="sm-text muted">They\'re away on a dispatch. Spend time together when they\'re back.</p>' : !open ? '<p class="sm-text muted">You\'ve already spent time together today. Come back tomorrow.</p>' : ''}
      ${waiting ? `<p class="sm-text gold">✦ A scene with ${esc(heroName(id))} is waiting ${waiting.where === 'camp' ? 'at camp on your next expedition' : 'in Talk at the hub'}.</p>` : ''}
      ${attirePick(id, 'cp-outfit')}
      ${hearthHtml(id)}
      ${mem.length ? `<h3 style="margin-top:10px">✦ Memories</h3><div class="mem-list">${mem.map(ev => `<button class="btn sm mem" data-ev="${ev.id}">${esc(memoryLabel(ev))}</button>`).join('')}</div>` : ''}
    </div>
  `);
  $('#cp-back').onclick = () => hub();
  bindAttire(id, 'cp-outfit', () => companion(id));
  document.querySelectorAll('.cp-act:not(.disabled)').forEach(b => b.onclick = async () => {
    screen('', '');
    await playEvent({ id: 'banter', steps: hangoutSteps(id, b.dataset.k, heroName(id), S) });
    const r = ST.hangout(S, id);
    if (r.up) { AU.sfx('promo'); toast(`${heroName(id)} bond +1 ♥`, 'bond'); }
    ST.save(S); await drainQueue(); companion(id);
  });
  const eve = document.querySelector('.cp-eve:not(.disabled)');
  if (eve) eve.onclick = async () => {
    screen('', '');
    await playEvent(evEvent);
    const together = !!S.flags.evening_yes;
    delete S.flags.evening_yes;
    ST.recordEvening(S, id, together);
    ST.save(S); companion(id);
  };
  bindMemories(() => companion(id));
}

// Human-readable mastery progression for a skill on a hero.
// Explains what the stars actually do, and the current/next step.
function masteryTagline(heroId, skillId) {
  const rank = ST.masteryRank(S, heroId, skillId);
  const uses = ST.masteryUses(S, heroId, skillId);
  const baseMp = SKILLS[skillId].mp || 0;
  const parts = [];
  if (rank > 0) parts.push(`now +${rank * 5}% power`);
  if (rank >= 5) parts.push(baseMp ? `−20% MP (${baseMp}→${Math.ceil(baseMp * 0.8)})` : 'mastered');
  else {
    const nextAt = ST.MASTERY_THRESHOLDS[rank + 1];
    const nextIsMax = rank + 1 === 5;
    parts.push(`next ★ at ${nextAt} uses (${uses}/${nextAt})${nextIsMax && baseMp ? ' — adds −20% MP' : ''}`);
  }
  return `✦ Mastery: +5% power per ★ · −20% MP at ★★★★★ — ${parts.join(', ')}`;
}

function party(sel = 'player') {
  const ids = ST.roster(S);
  if (!ids.includes(sel)) sel = 'player';
  const h = S.heroes[sel];
  const def = HEROES[sel];
  const st = ST.heroStats(S, sel);
  const skills = ST.heroSkills(S, sel);
  const next = xpToNext(h.level);

  const tabs = ids.map(id => `<button class="tab ${id === sel ? 'on' : ''}" data-id="${id}" style="--tc:${heroColor(id)}">${esc(heroName(id))}</button>`).join('');
  const statRows = ['hp', 'mp', 'atk', 'mag', 'def', 'res', 'agi', 'luk'].map(k =>
    `<div class="stat-row"><span>${k.toUpperCase()}</span><b>${st[k]}</b></div>`).join('');
  const skillRows = skills.map(id => {
    const sk = SKILLS[id];
    const rank = ST.masteryRank(S, sel, id);
    const uses = ST.masteryUses(S, sel, id);
    const nextAt = rank < 5 ? ST.MASTERY_THRESHOLDS[rank + 1] : null;
    const mTip = rank >= 5 ? `${uses} uses · mastered (+25% power, −20% MP)` : `${uses} uses · next rank at ${nextAt}${rank ? ` · +${rank * 5}% power` : ''}`;
    const isAuto = S.autoSkill[sel] === id;
    const autoBtn = isAuto ? `<button class="btn sm auto-set on" data-skill="${id}" title="This is ${esc(heroName(sel))}'s auto-battle skill. Tap to clear (auto falls back to Strike).">★ auto</button>`
      : rank >= 3 ? `<button class="btn sm ghost auto-set" data-skill="${id}" title="Use this skill in auto-battle when possible.">set auto</button>`
      : '<small class="muted" title="Reach ★★★ mastery to set as the auto-battle skill.">auto at ★★★</small>';
    return `<div class="skill-row"><b>${sk.name}${sk.subdue ? ' <small class="seal-chance" title="Drains Will">⛓</small>' : ''}</b><small class="mastery" title="${mTip}">${rank ? '★'.repeat(rank) : '☆'}</small><small>${sk.mp ? sk.mp + ' MP' : '—'}</small>${autoBtn}<p>${sk.desc || ''}</p><p class="mastery-tag">${masteryTagline(sel, id)}</p></div>`;
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
        <h2>✦ Allies</h2>
        <button class="btn ghost" id="p-back">← Codex</button>
      </div>
      <div class="tabs">${tabs}</div>
      <div class="sheet">
        <div class="sheet-left">
          ${portraitImg(sel, 'big')}
          <b class="sheet-name" style="color:${heroColor(sel)}">${esc(heroName(sel))}</b>
          <span class="muted">${heroDesc(S, sel).epithet} · ${heroDesc(S, sel).cls}</span>
          <div class="lvl">Lv ${h.level}</div>
          <div class="bar-outer xp"><div class="bar-inner" style="width:${h.xp / next * 100}%"></div></div>
          <small class="muted">${h.xp}/${next} XP</small>
          ${sel !== 'player' && sel in S.bond ? heartsFor(sel) : ''}
          <p class="bio">${heroDesc(S, sel).desc}</p>
          <p class="passive"><b>${def.passive.name}:</b> ${sel === 'player'
            ? `Gains +${Math.round((0.1 + (S.legacy?.xpBoost || 0)) * 100)}% XP${S.legacy?.xpBoost ? ` (10% Mark + ${Math.round(S.legacy.xpBoost * 100)}% cycle legacy)` : ''}. Binding Seals are ${15 + Math.round((S.sealPower || 0) * 100)}% stronger.`
            : esc(def.passive.desc)}</p>
          ${S.statSurge && S.statSurge[sel] ? `<p class="passive" style="color:var(--corrupt)"><b>Blood Surge:</b> +${Math.round(S.statSurge[sel] * 100)}% stats, paid in trust.</p>` : ''}
          ${sel === 'player' && S.flags.scarred ? '<p class="passive" style="color:var(--corrupt)"><b>Scarred:</b> the Scar Rite left its mark.</p>' : ''}
        </div>
        <div class="sheet-mid"><h3>Stats</h3>${statRows}<h3>Gear</h3>${gearRows}${attirePick(sel, 'p-outfit')}</div>
        <div class="sheet-right"><h3>Skills</h3>
          <p class="muted sm-text">In auto-battle this hero uses <b>${S.autoSkill[sel] && SKILLS[S.autoSkill[sel]] ? SKILLS[S.autoSkill[sel]].name : 'Strike'}</b> when possible. Reach ★★★ mastery to set a different auto-skill.</p>
          ${skillRows}</div>
      </div>
    </div>
  `);
  $('#p-back').onclick = () => hub();
  document.querySelectorAll('.tab').forEach(t => t.onclick = () => { AU.sfx('ui'); party(t.dataset.id); });
  document.querySelectorAll('.gear-slot').forEach(gs => gs.onclick = () => gearPicker(sel, gs.dataset.slot));
  bindAttire(sel, 'p-outfit', () => party(sel));
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
    <h3>Equip ${slot} — ${esc(heroName(heroId))}</h3>
    <div class="gear-list">
      ${cur ? `<button class="btn gear-opt" data-id="__unequip">Unequip ${esc(cur.name)}</button>` : ''}
      ${options.length ? options.map(g => `<button class="btn gear-opt" data-id="${g.id}">
        <b class="t${g.tier}">${esc(g.name)}</b> <small>${Object.entries(g.stats).map(([k, v]) => `${k}+${v}`).join(' ')}</small>${affixChip(g)}
      </button>`).join('') : '<p class="muted">No spare gear for this slot. Rifts drop more.</p>'}
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
    if (TOON_IDS.includes(heroId)) refreshPortraits().then(() => party(heroId)); else party(heroId);
  });
}

// ------------------------------------------------------------------
// shop
// ------------------------------------------------------------------

function shop() {
  const stock = shopStock(S.circleIdx, ST.perk(S, 'college'));
  const rows = stock.map(id => {
    const it = ITEMS[id];
    const owned = S.inventory[id] || 0;
    return `<div class="shop-row">
      <div><b>${it.name}</b> <small class="muted">×${owned} owned</small><p class="muted">${it.desc}</p></div>
      <button class="btn ${S.gold >= ST.priceOf(S, it.price) ? '' : 'disabled'}" data-id="${id}">◈ ${ST.priceOf(S, it.price)}g</button>
    </div>`;
  }).join('');
  const tavern = ST.isAlly(S, 'mira_ashveil') && ST.packOn(S, 'obsidian')
    ? Object.entries(REAGENTS).map(([id, r]) => `<div class="shop-row"><div><b>${r.icon} ${r.name}</b> <small class="muted">×${S.reagents[id] || 0} · Lantern & Ash, under the counter</small></div>
      <button class="btn buy-r ${S.gold >= ST.priceOf(S, r.price * 2) ? '' : 'disabled'}" data-r="${id}">◈ ${ST.priceOf(S, r.price * 2)}g</button></div>`).join('') : '';
  const penRow = `<div class="shop-row"><div><b>Menagerie pen</b> <small class="muted">${S.pens} built</small><p class="muted">Room for one more captured beast.</p></div>
      <button class="btn ${S.gold >= ST.penCost(S) ? '' : 'disabled'}" id="buy-pen">◈ ${ST.penCost(S)}g</button></div>`;
  const sellRows = S.gearBag.length ? S.gearBag.map(g => {
    const val = Math.max(5, Math.round(gearScore(g) * 4));
    return `<div class="shop-row"><div><b class="t${g.tier}">${esc(g.name)}</b> <small class="muted">${Object.entries(g.stats).map(([k, v]) => `${k}+${v}`).join(' ')}</small>${affixChip(g)}</div>
      <button class="btn sell" data-id="${g.id}" data-val="${val}">sell ◈ ${val}g</button></div>`;
  }).join('') : '<p class="muted">No spare gear to sell.</p>';

  screen(`
    <div class="panel shop-panel">
      <div class="row spread"><h2>◈ The Night Market</h2><div class="row gap"><span class="gold">◈ ${S.gold}g</span> <button class="btn" id="s-smith">⚒ Smith</button> <button class="btn ghost" id="s-back">← Codex</button></div></div>
      <div class="shop-cols">
        <div><h3>Buy</h3>${rows}${penRow}${tavern}</div>
        <div><h3>Sell gear</h3><div class="sell-list">${sellRows}</div></div>
      </div>
    </div>
  `);
  $('#s-back').onclick = () => hub();
  $('#s-smith').onclick = () => { AU.sfx('ui'); smith(); };
  $('#buy-pen').onclick = () => { if (ST.buyPen(S)) { AU.sfx('promo'); ST.save(S); shop(); } };
  document.querySelectorAll('.buy-r:not(.disabled)').forEach(b => b.onclick = () => {
    const cost = ST.priceOf(S, REAGENTS[b.dataset.r].price * 2);
    if (S.gold < cost) return;
    S.gold -= cost; S.reagents[b.dataset.r] = (S.reagents[b.dataset.r] || 0) + 1;
    AU.sfx('coin'); ST.save(S); shop();
  });
  document.querySelectorAll('.shop-row button[data-id]:not(.sell):not(.forge):not(.buy-r)').forEach(b => b.onclick = () => {
    const it = ITEMS[b.dataset.id];
    const price = ST.priceOf(S, it.price);
    if (S.gold < price) return;
    S.gold -= price;
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
// Larkspur Lane — the town (Through the Rift pack)
// ------------------------------------------------------------------

// Something waiting in town: a scene, a romance, or a quest ready to turn in.
const laneGatherings = () => Object.values(EVENTS).filter(ev => ev.id.startsWith('lane_') && ev.where === 'town' && !S.seen[ev.id] && (!ev.cond || ev.cond(S)));
function townNews() {
  return laneGatherings().length > 0 || TOWN.FOLK_IDS.some(id => townScene(id) || seasonScene(id) || TOWN.questReady(S, id).ok);
}
// Her holiday this season, if she's close enough to spend it with you.
function seasonScene(id) {
  const ev = EVENTS[`season_${TOWN.seasonOf(S).id}_${id}`];
  return ev && !S.seen[ev.id] && (!ev.cond || ev.cond(S)) ? ev : null;
}
const GATHER_LABELS = { lane_poker_night: 'Poker night at Harold and Gary\'s', lane_coven_of_two: 'A midnight in the greenhouse', lane_block_party: 'The block party' };
const gatherLabel = ev => GATHER_LABELS[ev.id] || (TOWN.SEASONS.find(x => x.fest === ev.id) || {}).festName || 'A gathering';
function seasonBanner() {
  const z = TOWN.seasonOf(S);
  const fest = EVENTS[z.fest], done = fest && S.seen[fest.id];
  const when = done ? `The Wives' Circle threw ${z.festName.replace(/^The /, 'the ')} this season.` : z.festOn ? `<b class="gold">${esc(z.festName)} is on now!</b>` : `${esc(z.festName)} in ${z.festIn} day${z.festIn === 1 ? '' : 's'}.`;
  return `<div class="season-banner">${z.icon} <b>${z.name}</b> <small class="muted">year ${z.year} · day ${z.dayIn} of ${TOWN.SEASON_LEN}</small> · <span class="sm-text">${when}</span></div>`;
}
function townScene(id) {
  return Object.values(EVENTS).find(ev => ev.where === 'town' && ev.once && ev.id.startsWith(id + '_') && !S.seen[ev.id] && (!ev.cond || ev.cond(S))) || null;
}
// Your standing at a glance: each rival's Power (or its fate), and each tribe's favor.
function standingStrip() {
  const rivals = Object.entries(FACTIONS).filter(([, F]) => !F.pack || ST.packOn(S, F.pack)).map(([fid, F]) => {
    const f = S.factions[fid]; if (!f) return '';
    const short = F.name.replace(/^The (Order of the )?/, '');
    return `<span class="stand-chip ${f.fate ? 'won' : ''}" style="--fc:${F.color}" title="${esc(F.name)}: ${f.fate ? `dominated (${f.fate})` : `Power ${f.power}/100. Raid its holdings to drain it; at 35 or less, ${esc(F.leaderName)}'s lair opens.`}">${F.icon} ${esc(short)} <b>${f.fate ? '✓' : f.power}</b></span>`;
  }).join('');
  const tribes = Object.entries(TRIBES).filter(([tid]) => S.tribes && S.tribes[tid] && S.tribes[tid].status).map(([tid, T]) => {
    const t = S.tribes[tid];
    return `<span class="stand-chip tribe" style="--fc:${T.color || '#c8a87a'}" title="${esc(T.name)}: ${esc(t.status)}, favor ${t.favor}/10">🪶 ${esc(T.name.replace(/^The /, '').split(' ')[0])} <b>${t.favor}</b></span>`;
  }).join('');
  return `<div class="stand-strip"><span class="hud-label">Rivals</span>${rivals}${tribes ? `<span class="hud-label">Tribes</span>${tribes}` : ''}</div>`;
}
function stake(lvl) { return '◆'.repeat(lvl) + '◇'.repeat(3 - lvl); }

function town() {
  const div = TOWN.dividends(S);
  const cards = TOWN.FOLK_IDS.map(id => {
    const P = TOWN.TOWNSFOLK[id], f = TOWN.folkOf(S, id), q = TOWN.questOf(S, id), qr = TOWN.questReady(S, id);
    const scene = townScene(id), cost = TOWN.investCost(S, id);
    const eveOk = TOWN.townEveningOpen(S, id);
    return `<div class="cell-card">
      <div class="recruit-head">${portraitImg(id)}<div><b style="color:${P.color}">${esc(P.name)}</b> <small class="muted">${esc(P.role)}</small><br><small class="muted">${esc(P.shop || 'Larkspur Lane')}</small>${P.shop ? `<br><small class="muted" title="Investment level">stake ${stake(f.level)}</small>` : ''}</div></div>
      <div class="meter"><span>Favor</span>${bar('regard', f.favor * 10)}<span>${f.favor}/10</span></div>
      <p class="sm-text muted">${esc(P.perk)}</p>
      ${seasonScene(id) ? `<button class="btn tw-season notify" data-f="${id}">${TOWN.seasonOf(S).icon} ${esc(TOWN.seasonOf(S).name)} with her</button>` : ''}
      ${scene ? `<button class="btn tw-scene notify" data-f="${id}">${scene.id.endsWith('_romance') ? '♡ She has something to ask you' : scene.id === 'celeste_note' ? '✉ Something in your coat pocket' : '✦ She wants to talk'}</button>` : ''}
      <div class="visit-row">
        <button class="btn tw-talk ${f.talkDay === S.day ? 'disabled' : ''}" data-f="${id}">❝ Talk</button>
        ${P.shop ? `<button class="btn tw-shop" data-f="${id}">◈ ${id === 'joanne' ? 'Supper' : 'Shop'}</button>
        <button class="btn tw-inv ${cost != null && S.gold >= cost ? '' : 'disabled'}" data-f="${id}" title="${cost == null ? 'Fully invested.' : `Invest ${cost}g: +${TOWN.DIVIDEND[f.level + 1] - TOWN.DIVIDEND[f.level]}g a night, +1 favor, better stock.`}">⬆ ${cost == null ? 'Fully invested' : `Invest ${cost}g`}</button>` : ''}
        ${S.seen[id + '_romance'] && !S.flags[id + '_ended'] ? `<button class="btn tw-eve ${eveOk ? '' : 'disabled'}" data-f="${id}" title="${eveOk ? '' : 'One evening a night; every third night with her.'}">☾ Evening</button>` : ''}
      </div>
      ${id === 'celeste' ? `<p class="sm-text gold">${esc(TOWN.affairNote(S))}</p>` : q ? `<div class="quest-box"><b class="sm-text">${f.active ? '◇' : '?'} ${esc(q.title)}</b>
        ${f.active ? `<div class="sm-text muted">${qr.note}</div><button class="btn sm tw-turn ${qr.ok ? 'notify' : 'disabled'}" data-f="${id}">Hand it over</button>` : `<button class="btn sm tw-ask" data-f="${id}">Ask about it</button>`}
      </div>` : `<p class="sm-text gold">✓ Every favor she asked is done.</p>`}
    </div>`;
  }).join('');
  screen(`
    <div class="panel shop-panel">
      <div class="row spread"><h2>🏘 Larkspur Lane</h2><div class="row gap"><span class="gold">◈ ${S.gold}g</span> <button class="btn ghost" id="tw-back">← Codex</button></div></div>
      ${seasonBanner()}
      <p class="muted sm-text">A suburban cul-de-sac that fell through a misfired summoning into the fen. Talk daily, run errands for favor, and invest in their businesses. ${div ? `<b class="gold">The Lane pays you ${div}g every night.</b>` : 'Investments pay dividends every night.'}</p>
      ${laneGatherings().length ? `<div class="row gap wrap" style="margin:8px 0">${laneGatherings().map(ev => `<button class="btn notify tw-gather" data-ev="${ev.id}">${TOWN.SEASONS.some(x => x.fest === ev.id) ? TOWN.seasonOf(S).icon : '♡'} ${esc(gatherLabel(ev))}<em>!</em></button>`).join('')}</div>` : ''}
      <div class="cells">${cards}</div>
    </div>`);
  $('#tw-back').onclick = () => hub();
  document.querySelectorAll('.tw-gather').forEach(b => b.onclick = async () => { screen('', ''); await playEvent(EVENTS[b.dataset.ev]); ST.save(S); town(); });
  document.querySelectorAll('.tw-talk:not(.disabled)').forEach(b => b.onclick = async () => {
    const id = b.dataset.f, r = TOWN.townTalk(S, id);
    if (!r) return;
    const lines = TOWN.TOWN_TALK[id];
    screen('', '');
    await playEvent({ id: 'banter', steps: [{ s: id, t: lines[(S.day + r.favor) % lines.length] }] });
    if (r.up) toast(`${TOWN.TOWNSFOLK[id].name}'s favor +1`, 'bond');
    ST.save(S); town();
  });
  document.querySelectorAll('.tw-season').forEach(b => b.onclick = async () => {
    const ev = seasonScene(b.dataset.f);
    if (!ev) return;
    screen('', ''); await playEvent(ev); ST.save(S); town();
  });
  document.querySelectorAll('.tw-scene').forEach(b => b.onclick = async () => {
    const ev = townScene(b.dataset.f);
    screen('', ''); await playEvent(ev); ST.save(S); town();
  });
  document.querySelectorAll('.tw-eve:not(.disabled)').forEach(b => b.onclick = async () => {
    const id = b.dataset.f;
    screen('', ''); await playEvent(EVENTS[id + '_evening']); TOWN.townEvening(S, id); ST.save(S); town();
  });
  document.querySelectorAll('.tw-inv:not(.disabled)').forEach(b => b.onclick = () => {
    const id = b.dataset.f;
    if (!TOWN.invest(S, id)) return;
    AU.sfx('coin'); toast(`You bought a stake in ${TOWN.TOWNSFOLK[id].shop}. ${TOWN.TOWNSFOLK[id].name}'s favor +1`, 'bond');
    ST.save(S); town();
  });
  document.querySelectorAll('.tw-ask').forEach(b => b.onclick = async () => {
    const id = b.dataset.f, q = TOWN.questOf(S, id);
    screen('', '');
    await playEvent({ id: 'banter', steps: [{ s: id, t: q.ask }, { choice: [
      { t: '"Consider it done."', r: [{ do: S => TOWN.acceptQuest(S, id) }, { s: 'codex', t: `[ ERRAND — ${q.title} ]` }] },
      { t: '"Not right now."', r: [] },
    ] }] });
    ST.save(S); town();
  });
  document.querySelectorAll('.tw-turn:not(.disabled)').forEach(b => b.onclick = async () => {
    const id = b.dataset.f, q = TOWN.questOf(S, id);
    const got = TOWN.turnIn(S, id);
    if (!got) return;
    AU.sfx('promo');
    screen('', '');
    await playEvent({ id: 'banter', steps: [{ s: id, t: q.done }, { s: 'codex', t: `[ ${got.join(' · ')} ]` }] });
    ST.save(S); town();
  });
  document.querySelectorAll('.tw-shop').forEach(b => b.onclick = () => { AU.sfx('ui'); townShop(b.dataset.f); });
}

function townShop(id) {
  const P = TOWN.TOWNSFOLK[id];
  const gearRow = (g, price, cls, label) => `<div class="shop-row"><div><b class="t${g.tier}">${esc(g.name)}</b> <small class="muted">${Object.entries(g.stats).map(([k, v]) => `${k}+${v}`).join(' ')}</small>${affixChip(g)}</div>
    <button class="btn ${cls} ${label === 'sell' || S.gold >= price ? '' : 'disabled'}" data-id="${g.id}">${label === 'sell' ? 'sell ' : ''}◈ ${price}g</button></div>`;
  let body = '';
  if (id === 'victoria') {
    body = `<h3>Requisitions</h3><p class="muted sm-text">Fresh stock every morning. More with each stake; at stake ◆◆ everything comes enchanted.</p>
      ${TOWN.victoriaStock(S).map(g => gearRow(g, TOWN.priceAt(S, id, TOWN.gearPrice(g)), 'tw-buyg', 'buy')).join('') || '<p class="muted">Sold out until tomorrow.</p>'}
      <h3>The Lane's ledger</h3>${TOWN.FOLK_IDS.map(f => `<div class="shop-row"><div><b>${esc(TOWN.TOWNSFOLK[f].shop)}</b> <small class="muted">stake ${stake(TOWN.folkOf(S, f).level)}</small></div><span class="gold">+${TOWN.DIVIDEND[TOWN.folkOf(S, f).level]}g/night</span></div>`).join('')}
      <p class="sm-text">Ledger House bonus: <b>+${TOWN.folkOf(S, 'victoria').level * 10}%</b> to all dividends. Tonight: <b class="gold">${TOWN.dividends(S)}g</b>.</p>`;
  } else if (id === 'joanne') {
    const allies = ST.roster(S).filter(a => a !== 'player');
    const lvl = TOWN.folkOf(S, id).level, price = TOWN.priceAt(S, id, 30);
    body = `<h3>Supper for two</h3><p class="muted sm-text">Bring an ally to dinner: closeness +${lvl >= 2 ? 2 : 1}, even if you've already spent time together today. One supper a day.</p>
      ${allies.length ? `<div class="visit-row"><select id="tw-sup">${allies.map(a => `<option value="${a}">${esc(heroName(a))}</option>`).join('')}</select>
      <button class="btn ${TOWN.supperOpen(S) && S.gold >= price ? '' : 'disabled'}" id="tw-supper">◈ ${price}g</button></div>` : '<p class="muted">Bring an ally home first.</p>'}
      ${TOWN.supperOpen(S) ? '' : '<p class="sm-text muted">You\'ve had supper here today. Joanne will have a table tomorrow.</p>'}
      <h3>From the kitchen</h3>${['potion', 'ether'].map(it => `<div class="shop-row"><div><b>${ITEMS[it].name}</b> <small class="muted">×${S.inventory[it] || 0} · "Joanne's home remedy"</small></div><button class="btn tw-buyi ${S.gold >= TOWN.priceAt(S, id, ITEMS[it].price) ? '' : 'disabled'}" data-i="${it}">◈ ${TOWN.priceAt(S, id, ITEMS[it].price)}g</button></div>`).join('')}`;
  } else if (id === 'diane') {
    body = `<h3>Remedies</h3>${TOWN.dianeStock(S).map(it => `<div class="shop-row"><div><b>${ITEMS[it].name}</b> <small class="muted">×${S.inventory[it] || 0}</small><p class="muted">${ITEMS[it].desc}</p></div><button class="btn tw-buyi ${S.gold >= TOWN.priceAt(S, id, ITEMS[it].price) ? '' : 'disabled'}" data-i="${it}">◈ ${TOWN.priceAt(S, id, ITEMS[it].price)}g</button></div>`).join('')}
      ${unknownRecipes().length ? `<h3>Recipe lessons</h3><p class="muted sm-text">"Watch my hands, Zoe. Then do it exactly like this." She teaches you a recipe and the Codex writes it down.</p>
      ${unknownRecipes().map(rid => { const cost = TOWN.priceAt(S, id, 80); return `<div class="shop-row"><div><b>${esc(ITEMS[RECIPES[rid].makes].name)}</b><p class="muted sm-text">${esc(ITEMS[RECIPES[rid].makes].desc)}</p></div><button class="btn tw-learn ${S.gold >= cost ? '' : 'disabled'}" data-r="${rid}">learn ◈ ${cost}g</button></div>`; }).join('')}` : '<p class="sm-text gold">"You know everything I know now. Mostly." She winks.</p>'}
      <h3>Reagents</h3>${Object.entries(REAGENTS).map(([r, R]) => `<div class="shop-row"><div><b>${R.icon} ${R.name}</b> <small class="muted">×${S.reagents[r] || 0}</small></div><div class="row gap">
        <button class="btn sm tw-buyr ${S.gold >= TOWN.reagentBuy(S, r) ? '' : 'disabled'}" data-r="${r}">buy ◈ ${TOWN.reagentBuy(S, r)}g</button>
        <button class="btn sm tw-sellr ${(S.reagents[r] || 0) > 0 ? '' : 'disabled'}" data-r="${r}">sell ◈ ${TOWN.reagentSell(S, r)}g</button></div></div>`).join('')}`;
  } else if (id === 'margot') {
    const rate = TOWN.margotRate(S);
    const brewed = Object.entries(S.inventory).filter(([k, v]) => v > 0 && ITEMS[k] && ITEMS[k].brewed);
    body = `<p class="muted sm-text">Margot pays ${Math.round(rate * 100)}% of the Night Market's price for gear.</p>
      <h3>Sell gear</h3><div class="sell-list">${S.gearBag.length ? S.gearBag.map(g => gearRow(g, Math.max(6, Math.round(gearScore(g) * 4 * rate)), 'tw-sellg', 'sell')).join('') : '<p class="muted">No spare gear to sell.</p>'}</div>
      <h3>Sell draughts</h3>${brewed.length ? brewed.map(([k, v]) => `<div class="shop-row"><div><b>${ITEMS[k].name}</b> <small class="muted">×${v}</small></div><button class="btn tw-selli" data-i="${k}">sell ◈ ${TOWN.brewedSale(S, k)}g</button></div>`).join('') : '<p class="muted">Nothing brewed to sell.</p>'}`;
  } else if (id === 'moira') {
    body = `<h3>Charms</h3><p class="muted sm-text">Two new charms every morning, always enchanted.${TOWN.folkOf(S, id).level >= 2 ? ' Your stake buys her stronger wax.' : ''}</p>
      ${TOWN.moiraStock(S).map(g => gearRow(g, TOWN.priceAt(S, id, TOWN.gearPrice(g)), 'tw-buyg', 'buy')).join('') || '<p class="muted">Every candle\'s spoken for until tomorrow.</p>'}`;
  }
  screen(`
    <div class="panel shop-panel">
      <div class="row spread"><h2 style="color:${P.color}">${esc(P.shop)}</h2><div class="row gap"><span class="gold">◈ ${S.gold}g</span> <button class="btn ghost" id="ts-back">← Larkspur Lane</button></div></div>
      <div class="recruit-head">${portraitImg(id)}<div><b style="color:${P.color}">${esc(P.name)}</b><br><small class="muted">${esc(P.desc)}</small></div></div>
      ${body}
    </div>`);
  const again = () => { ST.save(S); townShop(id); };
  $('#ts-back').onclick = () => town();
  const stock = id === 'victoria' ? TOWN.victoriaStock(S) : id === 'moira' ? TOWN.moiraStock(S) : [];
  document.querySelectorAll('.tw-buyg:not(.disabled)').forEach(b => b.onclick = () => {
    const i = stock.findIndex(g => g.id === b.dataset.id); if (i < 0) return;
    const price = TOWN.priceAt(S, id, TOWN.gearPrice(stock[i]));
    if (S.gold < price) return;
    S.gold -= price; S.gearBag.push(stock.splice(i, 1)[0]); AU.sfx('coin'); again();
  });
  document.querySelectorAll('.tw-buyi:not(.disabled)').forEach(b => b.onclick = () => {
    const price = TOWN.priceAt(S, id, ITEMS[b.dataset.i].price);
    if (S.gold < price) return;
    S.gold -= price; S.inventory[b.dataset.i] = (S.inventory[b.dataset.i] || 0) + 1; AU.sfx('coin'); again();
  });
  document.querySelectorAll('.tw-buyr:not(.disabled)').forEach(b => b.onclick = () => {
    const r = b.dataset.r, price = TOWN.reagentBuy(S, r);
    if (S.gold < price) return;
    S.gold -= price; S.reagents[r] = (S.reagents[r] || 0) + 1; AU.sfx('coin'); again();
  });
  document.querySelectorAll('.tw-learn:not(.disabled)').forEach(b => b.onclick = () => {
    const rid = b.dataset.r, cost = TOWN.priceAt(S, id, 80);
    if (S.gold < cost || S.recipes.includes(rid)) return;
    S.gold -= cost; S.recipes.push(rid); ST.addChronicle(S, `Diane taught you a recipe: ${ITEMS[RECIPES[rid].makes].name}.`);
    AU.sfx('promo'); toast(`Recipe learned: ${ITEMS[RECIPES[rid].makes].name}`, 'gold'); again();
  });
  document.querySelectorAll('.tw-sellr:not(.disabled)').forEach(b => b.onclick = () => {
    const r = b.dataset.r; if (!(S.reagents[r] > 0)) return;
    S.reagents[r]--; S.gold += TOWN.reagentSell(S, r); AU.sfx('coin'); again();
  });
  document.querySelectorAll('.tw-sellg').forEach(b => b.onclick = () => {
    const i = S.gearBag.findIndex(g => g.id === b.dataset.id); if (i < 0) return;
    const g = S.gearBag.splice(i, 1)[0];
    S.gold += Math.max(6, Math.round(gearScore(g) * 4 * TOWN.margotRate(S))); AU.sfx('coin'); again();
  });
  document.querySelectorAll('.tw-selli').forEach(b => b.onclick = () => {
    const k = b.dataset.i; if (!(S.inventory[k] > 0)) return;
    S.inventory[k]--; S.gold += TOWN.brewedSale(S, k); AU.sfx('coin'); again();
  });
  const sup = $('#tw-supper');
  if (sup && !sup.classList.contains('disabled')) sup.onclick = async () => {
    const who = $('#tw-sup').value, price = TOWN.priceAt(S, id, 30);
    if (S.gold < price || !TOWN.supperOpen(S)) return;
    S.gold -= price; S.town.supperDay = S.day;
    const r = ST.addCloseness(S, who, TOWN.folkOf(S, id).level >= 2 ? 2 : 1);
    screen('', '');
    await playEvent({ id: 'banter', steps: [
      { s: 'joanne', t: `(setting down two steaming plates and a candle) For you and ${heroName(who)}. Eat slow. Talk to each other. I'll be pretending not to listen.` },
      { s: 'narr', t: `You and ${heroName(who)} linger over supper until the candle gutters. It's the most ordinary evening either of you has had in months, and somehow that's the point.` },
    ] });
    if (r.up) { AU.sfx('promo'); toast(`${heroName(who)} bond +1 ♥`, 'bond'); }
    again();
  };
}

// ------------------------------------------------------------------
// smith — reforging, on its own screen
// ------------------------------------------------------------------

function smith() {
  const groups = [
    { title: 'In your bag', targets: S.gearBag.map(g => ({ g, where: 'bag' })) },
    ...ST.roster(S).map(id => ({
      title: 'Equipped — ' + heroName(id),
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
      <div class="row spread"><h2>⚒ The Ink-Smith</h2><div class="row gap"><span class="gold">◈ ${S.gold}g</span> <button class="btn" id="f-shop">◈ Market</button> <button class="btn ghost" id="f-back">← Codex</button></div></div>
      <p class="muted">Reroll an affix into a different one, or imbue plain gear with a random affix. Costs scale with gear tier.</p>
      ${allTargets.length ? `<div class="shop-cols"><div>${groups.slice(0, Math.ceil(groups.length / 2)).map(groupHtml).join('')}</div><div>${groups.slice(Math.ceil(groups.length / 2)).map(groupHtml).join('')}</div></div>`
        : '<p class="muted">Nothing to work with — the smith shrugs. Rifts drop more.</p>'}
    </div>
  `);
  $('#f-back').onclick = () => hub();
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
  const s = S ? S.settings : { volume: 0.6, music: true, textFast: false, spice: 'gentle', gore: 'gentle', outfit: 'adventure' };
  const modal = el(`<div class="modal-layer"><div class="panel modal">
    <h3>⚙ Settings</h3>
    <label class="set-row">Volume <input type="range" id="set-vol" min="0" max="1" step="0.05" value="${s.volume}"></label>
    <label class="set-row">Music <input type="checkbox" id="set-music" ${s.music ? 'checked' : ''}></label>
    <label class="set-row">Instant text <input type="checkbox" id="set-fast" ${s.textFast ? 'checked' : ''}></label>
    <label class="set-row">Intimacy <select id="set-spice">
      <option value="gentle" ${s.spice === 'gentle' ? 'selected' : ''}>Gentle</option>
      <option value="steamy" ${s.spice === 'steamy' ? 'selected' : ''}>Steamy</option>
      <option value="unbound" ${s.spice === 'unbound' ? 'selected' : ''}>Unbound</option>
    </select></label>
    <label class="set-row">Gore <select id="set-gore">
      <option value="gentle" ${s.gore !== 'grim' ? 'selected' : ''}>Gentle</option>
      <option value="grim" ${s.gore === 'grim' ? 'selected' : ''}>Grim</option>
    </select></label>
    <label class="set-row">Party attire <select id="set-outfit">${Object.entries(OUTFITS).map(([k, v]) => `<option value="${k}" ${(s.outfit || 'adventure') === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
    <p class="muted sm-text">Intimacy applies only between free allies, never captives. Grim adds harsher violence to battle logs and the Undercroft.</p>
    ${S ? '<button class="btn sm" id="set-paths" title="Every fork in the story: what you chose, and what you passed up.">🜲 Paths: choices taken &amp; missed</button>' : ''}
    ${S ? `<div class="pack-toggles"><b class="sm-text">Character packs</b>${Object.entries(PACKS).map(([id, P]) => `<label class="set-row" title="${esc(P.desc)}">${esc(P.name)} <input type="checkbox" class="pack-tg" data-id="${id}" ${S.settings.packs[id] !== false ? 'checked' : ''}></label>`).join('')}</div>` : ''}
    ${S && S.cleared ? `
    <div class="ngplus-box">
      <b>⟲ Begin Cycle ${(S.legacy?.cycle || 0) + 2} (NG+)</b>
      <p class="muted sm-text">Restart the story. You keep <b>every piece of gear</b>, all <b>skill mastery</b>, auto-skill picks and discovered <b>recipes</b>. The Codex remembers: <b>+${Math.round(ST.legacyBoostFor(S) * 100)}% XP</b> for you, half that for allies.</p>
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
    s.gore = modal.querySelector('#set-gore').value;
    const prevOutfit = s.outfit;
    s.outfit = modal.querySelector('#set-outfit').value;
    if (S && prevOutfit !== s.outfit) { S.settings = s; refreshPortraits(); }
    modal.querySelectorAll('.pack-tg').forEach(cb => { s.packs = s.packs || {}; s.packs[cb.dataset.id] = cb.checked; });
    AU.applySettings(s);
    if (S) { S.settings = s; ST.save(S); }
  };
  modal.querySelector('#set-vol').oninput = apply;
  modal.querySelector('#set-music').onchange = apply;
  modal.querySelector('#set-fast').onchange = apply;
  modal.querySelector('#set-spice').onchange = apply;
  modal.querySelector('#set-gore').onchange = apply;
  modal.querySelector('#set-outfit').onchange = apply;
  modal.querySelectorAll('.pack-tg').forEach(cb => cb.onchange = apply);
  if (S) {
    modal.querySelector('#set-export').onclick = () => { modal.querySelector('#save-blob').value = ST.exportSave(S); toast('Save code generated — copy it somewhere safe.'); };
    modal.querySelector('#set-import').onclick = () => {
      const v = modal.querySelector('#save-blob').value;
      const loaded = ST.importSave(v);
      if (loaded) { S = loaded; syncConverts(S); ST.save(S); toast('Save imported.'); modal.remove(); hub(); }
      else toast('Invalid save code.', 'danger');
    };
    modal.querySelector('#set-wipe').onclick = () => {
      if (confirm('Delete the save? This cannot be undone.')) { ST.wipeSave(); S = null; modal.remove(); title(false); }
    };
    const ng = modal.querySelector('#set-ngplus');
    if (ng) ng.onclick = async () => {
      const boost = Math.round(ST.legacyBoostFor(S) * 100);
      if (!confirm(`Begin Cycle ${(S.legacy?.cycle || 0) + 2}? The story restarts from day one. You keep gear, mastery and recipes, and the Codex's boost becomes +${boost}% XP. This replaces the current save.`)) return;
      modal.remove();
      S = ST.newGamePlus(S);
      ST.save(S);
      AU.sfx('gate');
      screen('', '');
      await refreshPortraits(true);
      await playEvent(EVENTS.ngplus_wake);
      await playEvent(EVENTS.intro);
      await playEvent(EVENTS.envoy_brief);
      beginRun(ST.storyRift('drowned_stacks', S));
    };
  }
  const pathsBtn = modal.querySelector('#set-paths');
  if (pathsBtn) pathsBtn.onclick = () => { apply(); modal.remove(); paths(back || hub); };
  modal.querySelector('#set-close').onclick = () => {
    apply();
    modal.remove();
    if (back && S) back();
  };
}
