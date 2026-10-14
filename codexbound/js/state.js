// ============================================================
// CODEXBOUND — game state, saves, progression, tarot & rifts,
// captures, the Undercroft, the Menagerie, alchemy and pacts
// ============================================================

import {
  RANKS, RANK_UP_GP, GATE_GP, XP_MULT, ENEMY_TIER, HEROES, heroStatsAt, heroSkillsAt,
  xpToNext, BIOMES, GATE_ROOMS, TAROT, MONARCH_GATE, ENEMIES, makeGear, AFFIXES,
  ELITES, ELITE_XP_MULT, ELITE_GOLD_MULT, eliteChance, ROLE_INFO, DISPATCH_BENCHMARK,
  CAPTIVE_TRAITS, CAPTIVE_NAMES, SECRETS, WARDEN_STYLES, BEAST_FAMILIES, BEAST_TRAITS,
  REAGENTS, RECIPES, RECIPE_DISCOVERY, recipeFor, ITEMS, PACTS, SLOT_VI,
} from './data.js';

export const SAVE_KEY = 'codexbound_save';
export const SAVE_V = 2;

// --- deterministic rng ---------------------------------------------------
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = (arr, rng = Math.random) => arr[Math.floor(rng() * arr.length)];
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const uid = p => p + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);

// --- pronouns ---------------------------------------------------------------
export const PRONOUNS = {
  she:  { they: 'she',  them: 'her',  their: 'her',   theirs: 'hers',   themself: 'herself',  s: 's', is: 'is',  has: 'has',  was: 'was' },
  he:   { they: 'he',   them: 'him',  their: 'his',   theirs: 'his',    themself: 'himself',  s: 's', is: 'is',  has: 'has',  was: 'was' },
  they: { they: 'they', them: 'them', their: 'their', theirs: 'theirs', themself: 'themself', s: '',  is: 'are', has: 'have', was: 'were' },
};

export function newGame(playerName, pronouns = 'she') {
  const S = {
    v: SAVE_V,
    name: (playerName || 'Zoe').slice(0, 14),
    pronouns: PRONOUNS[pronouns] ? pronouns : 'she',
    day: 1,
    circleIdx: 0,
    circleDay: { 0: 1 },            // circle index → day inscribed
    infamy: 0,
    gold: 120,
    seed: (Math.random() * 2 ** 31) | 0,
    seen: {},
    flags: {},
    queue: [],                       // pending auto story events
    bond: { vesper: 0, rue: 0, isolde: 0 },
    allies: ['player'],              // free allies; romance requires membership
    heroes: {},
    inventory: { potion: 3, ether: 1 },
    gearBag: [],
    tarotHand: [],
    run: null,
    stats: { clears: 0, kills: 0, captures: 0, retreats: 0, wipes: 0, tone: {} },
    legacy: { cycle: 0, xpBoost: 0 },
    cleared: false,
    clearedDay: 0,
    ngPlus: 0,
    mastery: {},
    autoSkill: {},
    dispatch: [],
    dispatchReports: [],
    // Codexbound systems
    corruption: 0,
    pacts: [],
    sealPower: 0,                    // permanent seal bonus from pacts
    statSurge: {},                   // heroId → stat multiplier bonus from pacts
    captives: [],
    released: [],                    // captives who walked free / relapsed
    converts: {},                    // captive-turned-ally hero definitions
    menagerie: [],
    eggs: [],
    pens: 4,
    wardens: {},                     // captiveId → heroId
    handlers: {},                    // beastId → heroId
    reagents: {},
    recipes: [],
    chronicle: [],                   // { day, text, ev, crossed }
    settings: { volume: 0.6, music: true, textFast: false, spice: 'gentle', gore: 'gentle', outfit: 'adventure', autoBattle: false },
  };
  S.heroes.player = { level: 1, xp: 0, gear: { weapon: null, armor: null, charm: null } };
  drawTarot(S);
  return S;
}

// --- persistence ----------------------------------------------------------

export function save(S) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { /* private mode */ }
}
// Default every field, so older Codexbound saves keep working.
export function ensureShape(S) {
  if (!S) return S;
  const d = newGame(S.name, S.pronouns);
  for (const k of Object.keys(d)) if (S[k] === undefined) S[k] = d[k];
  for (const k of Object.keys(d.settings)) if (S.settings[k] === undefined) S.settings[k] = d.settings[k];
  for (const k of Object.keys(d.stats)) if (S.stats[k] === undefined) S.stats[k] = d.stats[k];
  for (const k of Object.keys(d.bond)) if (S.bond[k] === undefined) S.bond[k] = 0;
  if (!S.allies.includes('player')) S.allies.unshift('player');
  if (!PRONOUNS[S.pronouns]) S.pronouns = 'she';
  if (!['gentle', 'steamy', 'unbound'].includes(S.settings.spice)) S.settings.spice = 'gentle';
  if (!['gentle', 'grim'].includes(S.settings.gore)) S.settings.gore = 'gentle';
  registerConverts(S);
  return S;
}
export function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const S = JSON.parse(raw);
    return S && S.v === SAVE_V ? ensureShape(S) : null;
  } catch (e) { return null; }
}
export function wipeSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }
export function exportSave(S) { return btoa(unescape(encodeURIComponent(JSON.stringify(S)))); }
export function importSave(str) {
  try {
    const S = JSON.parse(decodeURIComponent(escape(atob(str.trim()))));
    return S && S.v === SAVE_V ? ensureShape(S) : null;
  } catch (e) { return null; }
}

// --- roster & heroes --------------------------------------------------------

export function isAlly(S, id) { return (S.allies || []).includes(id); }

export function roster(S) {
  return (S.allies || []).filter(id => HEROES[id] && S.heroes[id]);
}

// Bring a hero into the fold: hero record, ally list, bond track.
export function joinAlly(S, id, levelOffset = -2) {
  const def = HEROES[id];
  if (!def) return;
  if (!S.heroes[id]) {
    const lvl = Math.max(def.startLevel || 1, (S.heroes.player?.level || 1) + levelOffset);
    S.heroes[id] = { level: lvl, xp: 0, gear: { weapon: null, armor: null, charm: null } };
  }
  if (!S.allies.includes(id)) S.allies.push(id);
  if (!(id in S.bond)) S.bond[id] = 0;
}
export const joinRecruit = joinAlly;

export function heroStats(S, id) {
  const h = S.heroes[id];
  const def = HEROES[id];
  const level = h ? h.level : def.startLevel;
  const s = heroStatsAt(def, level);
  const surge = (S.statSurge && S.statSurge[id]) || 0;
  if (surge) for (const k of ['hp', 'mp', 'atk', 'mag', 'def', 'res', 'agi']) s[k] = Math.round(s[k] * (1 + surge));
  if (h) {
    for (const g of Object.values(h.gear)) {
      if (!g) continue;
      for (const [k, v] of Object.entries(g.stats)) s[k] = (s[k] || 0) + v;
    }
  }
  return s;
}

// Aggregate the combat-affecting affixes from a hero's equipped gear.
export function heroLoadout(S, id) {
  const load = {
    onHit: [], lifesteal: 0, crit: 0, critDmg: 0,
    skillDmg: { phys: 0, mag: 0 }, execBonus: 0, thorns: 0,
    startShield: 0, regen: 0, dr: 0, mpRegen: 0, healPower: 0,
    stunImmune: false, startHaste: false,
  };
  const h = S.heroes[id];
  if (!h) return load;
  for (const g of Object.values(h.gear)) {
    if (!g || !g.affix) continue;
    const a = AFFIXES[g.affix];
    if (!a) continue;
    if (a.onHit) load.onHit.push(a.onHit);
    if (a.lifesteal) load.lifesteal += a.lifesteal;
    if (a.crit) load.crit += a.crit;
    if (a.critDmg) load.critDmg += a.critDmg;
    if (a.skillDmg) { load.skillDmg.phys += a.skillDmg.phys || 0; load.skillDmg.mag += a.skillDmg.mag || 0; }
    if (a.execBonus) load.execBonus += a.execBonus;
    if (a.thorns) load.thorns += a.thorns;
    if (a.startShield) load.startShield += a.startShield;
    if (a.regen) load.regen += a.regen;
    if (a.dr) load.dr += a.dr;
    if (a.mpRegen) load.mpRegen += a.mpRegen;
    if (a.healPower) load.healPower += a.healPower;
    if (a.stunImmune) load.stunImmune = true;
    if (a.startHaste) load.startHaste = true;
  }
  return load;
}

// Level-gated kit, plus Slot VI spells, pact skills and trained summons.
export function heroSkills(S, id) {
  const h = S.heroes[id];
  const out = heroSkillsAt(HEROES[id], h ? h.level : HEROES[id].startLevel);
  if (id === 'player') {
    if ((S.corruption || 0) >= 50) for (const sk of SLOT_VI) if (!out.includes(sk)) out.push(sk);
    if (S.flags && S.flags.pact_scar_rite && !out.includes('cinder_unmaking')) out.push('cinder_unmaking');
  }
  const beast = trainedBeastFor(S, id);
  if (beast) out.push(BEAST_FAMILIES[beast.family].summon);
  return out;
}

// The first tame-100 beast this hero handles (one summon per hero).
export function trainedBeastFor(S, heroId) {
  for (const b of S.menagerie || []) {
    if (b.tame >= 100 && S.handlers[b.id] === heroId) return b;
  }
  return null;
}

// XP: returns array of level-up records {id, level}
export function gainXp(S, id, amount) {
  const h = S.heroes[id];
  if (!h) return [];
  // The Mark (+10% for the warlock) plus the NG+ legacy boost:
  // the warlock carries it in full, allies at half.
  const legacy = (S.legacy && S.legacy.xpBoost) || 0;
  if (id === 'player') amount = Math.round(amount * (1.1 + legacy));
  else if (legacy) amount = Math.round(amount * (1 + legacy / 2));
  h.xp += amount;
  const ups = [];
  while (h.xp >= xpToNext(h.level) && h.level < 60) {
    h.xp -= xpToNext(h.level);
    h.level++;
    ups.push({ id, level: h.level });
  }
  return ups;
}

export function addBond(S, who, n) {
  if (!(who in S.bond)) return;
  S.bond[who] = clamp(S.bond[who] + n, 0, 10);
}

export function addCorruption(S, n) {
  const before = S.corruption || 0;
  S.corruption = clamp(before + n, 0, 100);
  if (before < 50 && S.corruption >= 50) S.queue.push('corruption_50');
  if (before < 80 && S.corruption >= 80) S.queue.push('corruption_80');
  return S.corruption - before;
}

export function addChronicle(S, text, ev = null) {
  S.chronicle.push({ day: S.day, text, ev, crossed: false });
}

// Ids currently away on a dispatch mission.
export function dispatchedIds(S) {
  const out = new Set();
  for (const m of S.dispatch || []) for (const id of m.team) out.add(id);
  return out;
}
// Hub members busy as wardens or handlers still fight — those jobs run
// between rifts. Only dispatch takes someone out of the party.

// --- skill mastery -----------------------------------------------------------

export const MASTERY_THRESHOLDS = [0, 10, 25, 50, 90, 150];
export const MASTERY_POWER = 0.05;
export const MASTERY_MP_DISCOUNT = 0.8;

export function masteryRank(S, heroId, skillId) {
  const uses = S.mastery?.[heroId]?.[skillId] || 0;
  let rank = 0;
  for (let i = MASTERY_THRESHOLDS.length - 1; i >= 0; i--) {
    if (uses >= MASTERY_THRESHOLDS[i]) { rank = i; break; }
  }
  return rank;
}
export function masteryUses(S, heroId, skillId) { return S.mastery?.[heroId]?.[skillId] || 0; }
export function bumpMastery(S, heroId, skillId) {
  if (!S.mastery) S.mastery = {};
  const m = S.mastery[heroId] || (S.mastery[heroId] = {});
  const before = masteryRank(S, heroId, skillId);
  m[skillId] = (m[skillId] || 0) + 1;
  const after = masteryRank(S, heroId, skillId);
  return after > before ? after : 0;
}

// --- NG+ cycles ---------------------------------------------------------------

export function legacyBoostFor(S) {
  const bondTotal = Object.values(S.bond || {}).reduce((a, b) => a + b, 0);
  const levelTotal = Object.values(S.heroes || {}).reduce((a, h) => a + (h.level || 0), 0);
  const prevCycles = (S.legacy && S.legacy.cycle) || 0;
  const boost = 0.25 + 0.15 * prevCycles + 0.10 * (S.ngPlus || 0) + 0.01 * bondTotal + 0.002 * levelTotal;
  return Math.min(2.5, Math.round(boost * 100) / 100);
}

export function newGamePlus(S) {
  const boost = legacyBoostFor(S);
  const carried = [...S.gearBag];
  for (const h of Object.values(S.heroes)) {
    for (const slot of ['weapon', 'armor', 'charm']) if (h.gear[slot]) carried.push(h.gear[slot]);
  }
  const N = newGame(S.name, S.pronouns);
  N.gearBag = carried;
  N.mastery = S.mastery || {};
  N.autoSkill = S.autoSkill || {};
  N.settings = S.settings;
  N.recipes = (S.recipes || []).slice(); // the Codex remembers what you brewed
  N.legacy = { cycle: ((S.legacy && S.legacy.cycle) || 0) + 1, xpBoost: boost };
  return N;
}

// --- circles & infamy ---------------------------------------------------------

export function addInfamy(S, amount) {
  S.infamy += amount;
  const promos = [];
  while (S.circleIdx < RANKS.length - 1) {
    const need = RANK_UP_GP[RANKS[S.circleIdx]];
    if (S.infamy < need) break;
    S.infamy -= need;
    S.circleIdx++;
    S.circleDay[S.circleIdx] = S.day;
    promos.push('inscribe_' + RANKS[S.circleIdx]);
  }
  for (const p of promos) S.queue.push(p);
  return promos;
}
export function infamyNeeded(S) {
  return S.circleIdx >= RANKS.length - 1 ? null : RANK_UP_GP[RANKS[S.circleIdx]];
}

// --- the tarot board ----------------------------------------------------------

const RIFT_ADJ2 = ['Cracked', 'Silent', 'Roaring', 'Veiled', 'Broken', 'Waning'];

function makeRift(S, cardId, rIdx, rng, idx) {
  const card = TAROT[cardId];
  const rank = RANKS[rIdx];
  const biome = BIOMES[card.biome];
  const name = pick(biome.names, rng)
    .replace('{adj}', rng() < 0.75 ? pick(biome.adj, rng) : pick(RIFT_ADJ2, rng))
    .replace('{noun}', pick(biome.noun, rng));
  return {
    id: 'rift_' + S.day + '_' + idx,
    card: cardId,
    rank, rankIdx: rIdx, biome: card.biome, name,
    modifier: card.modifier,
    rooms: GATE_ROOMS[rank],
    seed: (rng() * 2 ** 31) | 0,
    flipped: false,
  };
}

// Each day: three face-down cards. Their circles spread around yours
// (one easier, one at, one stretch) so grinding stays possible.
export function drawTarot(S) {
  const rng = mulberry32(S.seed ^ (S.day * 2654435761));
  const maxIdx = Math.min(S.circleIdx + 1, RANKS.length - 1);
  const targets = [Math.max(0, S.circleIdx - 1), S.circleIdx, maxIdx];
  const deck = Object.keys(TAROT).filter(id => !(id === 'justice' && !S.flags.vesper_joined));
  const hand = [];
  targets.forEach((rIdx, i) => {
    // a card is drawn without replacement, so the day's three are distinct
    const di = Math.floor(rng() * deck.length);
    const cardId = deck.splice(di, 1)[0] || 'tower';
    hand.push(makeRift(S, cardId, rIdx, rng, i));
  });
  // Story pulls: Justice brings the Vigil knight once Vesper has joined.
  if (S.flags.vesper_joined && !S.flags.isolde_met && S.day >= 4 && !hand.some(c => c.card === 'justice')) {
    hand[1] = makeRift(S, 'justice', S.circleIdx, rng, 1);
    hand[1].story = 'isolde_hunter';
  }
  if (S.circleIdx === RANKS.length - 1 && !S.cleared) {
    hand.unshift({ ...MONARCH_GATE, rankIdx: 5, seed: (rng() * 2 ** 31) | 0, flipped: true });
  }
  if (S.cleared) hand.unshift(makeEchoRift(S, (S.ngPlus || 0) + 1, rng));
  S.tarotHand = hand;
  S.flippedToday = false;
}

// Flip a card. The Codex allows one turned card per day.
export function flipCard(S, i) {
  const c = S.tarotHand[i];
  if (!c || c.flipped || S.flippedToday) return false;
  c.flipped = true;
  S.flippedToday = true;
  return true;
}

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
function toRoman(n) { return n <= 10 ? ROMAN[n] : String(n); }

function makeEchoRift(S, depth, rng) {
  return {
    id: 'echo_' + S.day,
    card: 'death',
    rank: 'Abyss', rankIdx: 5, biome: 'heart',
    name: `Echo ${toRoman(depth)} — the Heart Remembers`,
    modifier: depth % 2 ? 'burning' : 'rich',
    rooms: Math.min(8, 5 + Math.floor(depth / 2)),
    recursion: true, depth, flipped: true,
    seed: (rng() * 2 ** 31) | 0,
  };
}

// A fixed story rift (intro arcs): explicit enemy groups per chamber.
export function storyRift(id, S = null) {
  const R = STORY_RIFTS[id];
  // story beats scale up with you if you arrive late
  const rIdx = Math.max(R.rankIdx, S ? S.circleIdx : 0);
  return { ...R, id, rank: RANKS[rIdx], rankIdx: rIdx, story: true, flipped: true, seed: (Math.random() * 2 ** 31) | 0 };
}
export const STORY_RIFTS = {
  drowned_stacks: { name: 'The Drowned Stacks', rank: 'Ash', rankIdx: 0, biome: 'drowned', modifier: 'none', card: 'moon',
    script: [{ type: 'fight', mobs: ['grave_spider'] }, { type: 'boss', mobs: ['coven_envoy'] }],
    onClear: 'vesper_pact', guests: ['vesper'] },
  binding_trap: { name: 'The Binding Trap', rank: 'Ash', rankIdx: 0, biome: 'market', modifier: 'none', card: 'devil',
    script: [{ type: 'fight', mobs: ['coven_trapper', 'lesser_imp'] }, { type: 'boss', mobs: ['coven_trapper', 'coven_trapper', 'ash_witch'] }],
    onClear: 'rue_terms' },
  kneeling_sword: { name: 'The Kneeling Sword', rank: 'Ash', rankIdx: 0, biome: 'vigil', modifier: 'vigil', card: 'justice',
    script: [{ type: 'fight', mobs: ['vigil_knight', 'vigil_cantor'] }, { type: 'boss', mobs: ['isolde_duel'], duel: true }],
    onClear: 'isolde_kneel' },
  dawnward_stand: { name: 'The Dawnward Stand', rank: 'Thorn', rankIdx: 3, biome: 'glade', modifier: 'none', card: 'justice',
    script: [{ type: 'boss', mobs: ['dw_erin', 'dw_sakura', 'dw_shiro', 'dw_yuki'] }],
    onClear: 'dawnward_kneel' },
  oathbreaker: { name: 'Six Riders', rank: 'Ash', rankIdx: 0, biome: 'vigil', modifier: 'vigil', card: 'justice',
    script: [{ type: 'boss', mobs: ['vigil_rider', 'vigil_rider', 'vigil_rider'] }, { type: 'boss', mobs: ['vigil_rider', 'vigil_rider', 'vigil_marshal'] }],
    onClear: 'isolde_rune4', guests: ['isolde'] },
};

// --- dungeon path & enemy scaling --------------------------------------------

function mobPool(gate, biome) {
  return gate.rankIdx >= 2 ? biome.mobs.concat(biome.mobsLate) : biome.mobs;
}
function bossPool(gate, biome) {
  return gate.rankIdx >= 2 ? biome.bossesLate : biome.bosses;
}

export function buildDungeon(gate) {
  const rng = mulberry32(gate.seed);
  if (gate.script) {
    // story rifts scale to the party's current circle at the time of entry
    return gate.script.map((n, i) => ({
      type: n.type, duel: !!n.duel,
      group: n.mobs.map(id => scaleEnemy(id, gate, i, n.type === 'boss', rng)),
    }));
  }
  const biome = BIOMES[gate.biome];
  const card = TAROT[gate.card] || {};
  const nodes = [];
  for (let i = 0; i < gate.rooms; i++) {
    nodes.push({ type: 'fight', group: makeGroup(gate, biome, i, rng, card) });
    if (i < gate.rooms - 1) {
      const r = rng();
      const tb = card.treasureBonus || 0;
      if (r < 0.24) nodes.push(makeBranch(gate, biome, i, rng));
      else if (r < 0.42 + tb) nodes.push({ type: 'treasure' });
      else if (r < 0.62 + tb) nodes.push({ type: 'event', roll: rng() });
      else if (r < 0.74 + tb) nodes.push({ type: 'rest' });
    }
  }
  nodes.push({ type: 'boss', group: makeBossGroup(gate, biome, rng) });
  return nodes;
}

function makeBranch(gate, biome, depth, rng) {
  const risky = { type: 'fight', elite: true, group: makeEliteGroup(gate, biome, depth, rng) };
  const r = rng();
  const safe = r < 0.4 ? { type: 'treasure' } : r < 0.75 ? { type: 'event', roll: rng() } : { type: 'rest' };
  return { type: 'branch', options: [risky, safe] };
}

function makeGroup(gate, biome, depth, rng, card) {
  const n = Math.min(4, 2 + Math.floor(rng() * 2));
  const pool = mobPool(gate, biome);
  const group = [];
  let eliteRolled = false;
  for (let i = 0; i < n; i++) {
    const defId = pick(pool, rng);
    const elite = !eliteRolled && rng() < eliteChance(gate.rankIdx) + (card.eliteBonus || 0) ? pickElite(rng) : null;
    if (elite) eliteRolled = true;
    group.push(scaleEnemy(defId, gate, depth, false, rng, elite));
  }
  return group;
}

function makeEliteGroup(gate, biome, depth, rng) {
  const pool = mobPool(gate, biome);
  const group = [scaleEnemy(pick(pool, rng), gate, depth + 1, false, rng, pickElite(rng))];
  const adds = 1 + Math.floor(rng() * 2);
  for (let i = 0; i < adds; i++) group.push(scaleEnemy(pick(pool, rng), gate, depth, false, rng));
  return group;
}

function pickElite(rng) { return pick(Object.keys(ELITES), rng); }

function makeBossGroup(gate, biome, rng) {
  const bossId = gate.id === 'heart' ? 'mother_cinder' : pick(bossPool(gate, biome), rng);
  const group = [scaleEnemy(bossId, gate, gate.rooms, true, rng)];
  if (gate.rankIdx >= 2) {
    const adds = gate.rankIdx >= 4 ? 2 : 1;
    for (let i = 0; i < adds; i++) group.push(scaleEnemy(pick(mobPool(gate, biome), rng), gate, gate.rooms - 1, false, rng));
  }
  return group;
}

let enemySeq = 0;
export function scaleEnemy(defId, gate, depth, isBoss, rng, elite = null) {
  const def = ENEMIES[defId];
  const xpTier = XP_MULT[gate.rank];
  let tier = ENEMY_TIER[gate.rank];
  if (gate.recursion) tier *= 1 + (gate.depth || 0) * 0.4;
  const ramp = 1 + depth * 0.06;
  const bossMult = def.boss ? 2.3 : 1;
  const eliteDef = elite ? ELITES[elite] : null;
  const st = {};
  for (const [k, v] of Object.entries(def.base)) {
    let val = v * tier * ramp * (k === 'hp' ? bossMult : Math.sqrt(bossMult));
    if (eliteDef && eliteDef.stats[k]) val *= eliteDef.stats[k];
    st[k] = Math.round(val);
  }
  st.luk = 5; st.mp = 999;
  const skills = def.skills.slice();
  if (eliteDef && !skills.includes(eliteDef.skill)) skills.push(eliteDef.skill);
  const r = rng ? rng() : Math.random();
  const maxWill = Math.round(100 * (def.will || 1) * (def.boss ? 2 : 1) * (eliteDef ? 1.4 : 1));
  return {
    uid: 'e' + (++enemySeq) + '_' + Math.floor(r * 1e6),
    defId,
    name: eliteDef ? `${eliteDef.name} ${def.name}` : def.name,
    model: def.model,
    variant: def.variant || null,
    boss: !!def.boss,
    elite: elite || null,
    stats: st,
    skills,
    maxWill, will: maxWill,
    captureType: def.captureType === undefined ? null : def.captureType,
    sealResist: Math.min(0.95, (def.sealResist || 0) + (eliteDef ? 0.1 : 0)),
    tutorialSeal: !!def.tutorialSeal,
    faction: def.faction || null,
    family: def.family || null,
    named: def.named || null,
    xp: Math.round(def.xp * xpTier * (eliteDef ? ELITE_XP_MULT : 1)),
    gold: Math.round(def.gold * xpTier * (0.85 + r * 0.3) * (eliteDef ? ELITE_GOLD_MULT : 1)),
  };
}

// --- run lifecycle -----------------------------------------------------------

export function startRun(S, gate, selectedIds) {
  const away = dispatchedIds(S);
  let ids = (selectedIds && selectedIds.length ? selectedIds : roster(S)).filter(id => S.heroes[id] && !away.has(id));
  if (!ids.includes('player')) ids.unshift('player');
  // story guests fight alongside you before they formally join
  for (const g of gate.guests || []) {
    if (!S.heroes[g]) S.heroes[g] = { level: Math.max(HEROES[g].startLevel, S.heroes.player.level), xp: 0, gear: { weapon: null, armor: null, charm: null }, guest: true };
    if (!ids.includes(g)) ids.push(g);
  }
  ids = ids.slice(0, 5);
  const party = {};
  for (const id of ids) { const st = heroStats(S, id); party[id] = { hp: st.hp, mp: st.mp }; }
  const baitBeasts = (S.inventory.beast_bait || 0) > 0;
  if (baitBeasts) S.inventory.beast_bait--;
  S.run = {
    gate, nodes: buildDungeon(gate), nodeIdx: 0,
    party, partyIds: ids,
    loot: { gold: 0, xp: 0, gear: [], items: {} },
    captures: [],          // sealed this run; committed only on a clear
    favorUsed: false,      // Rue's Three Favors
    bait: baitBeasts,
    tempBuff: null,
  };
}

// Captured unit → pending record (combat calls this on a successful seal).
export function recordCapture(S, unit) {
  S.run.captures.push({
    defId: unit.defId, name: unit.name, captureType: unit.captureType,
    elite: unit.elite, faction: unit.faction, family: unit.family, named: unit.named,
  });
}

export function endRun(S, outcome) {
  // outcome: 'clear' | 'retreat' | 'wipe'
  const run = S.run;
  const gate = run.gate;
  const card = TAROT[gate.card] || {};
  const result = { outcome, gate, gold: 0, xp: 0, gp: 0, gear: run.loot.gear, items: run.loot.items, levelUps: [], promos: [], captured: [], freed: [] };
  result.gold = Math.round(run.loot.gold * (card.goldMult || 1));
  const xpEarners = run.partyIds.length;
  const smallPartyBonus = 1 + Math.max(0, 4 - xpEarners) * 0.35;
  result.xp = Math.round(run.loot.xp * smallPartyBonus);
  result.partySize = xpEarners;

  if (outcome === 'clear') {
    result.gp = gate.story ? Math.round(GATE_GP[gate.rank] * 0.5) : GATE_GP[gate.rank] + (run.loot.gpBonus || 0);
    S.stats.clears++;
    for (const c of run.captures) result.captured.push(commitCapture(S, c));
    if (gate.onClear) S.queue.push(gate.onClear);
  } else {
    result.freed = run.captures.map(c => c.name);
    if (outcome === 'retreat') { result.gold = Math.round(result.gold * 0.6); S.stats.retreats++; }
    else { result.gold = 0; result.xp = Math.round(result.xp * 0.5); S.stats.wipes++; }
  }

  S.gold += result.gold;
  // story guests earn their share too — they fought beside you
  for (const id of run.partyIds) result.levelUps.push(...gainXp(S, id, result.xp));
  for (const id of run.partyIds) if (S.heroes[id]?.guest) delete S.heroes[id].guest;
  for (const g of result.gear) S.gearBag.push(g);
  for (const [it, n] of Object.entries(result.items)) S.inventory[it] = (S.inventory[it] || 0) + n;
  if (result.gp) result.promos = addInfamy(S, result.gp);

  if (gate.id === 'heart' && outcome === 'clear') { S.cleared = true; S.clearedDay = S.day; }
  if (gate.recursion && outcome === 'clear') S.ngPlus = (S.ngPlus || 0) + 1;

  S.run = null;
  advanceDay(S);
  save(S);
  return result;
}

// A day passes: teams come home, the Undercroft and Menagerie tick,
// a fresh hand of tarot is dealt.
export function advanceDay(S) {
  S.day++;
  resolveDispatches(S);
  const log = [];
  log.push(...advanceReclamation(S));
  log.push(...tendMenagerie(S));
  S.dayLog = log;
  drawTarot(S);
  return log;
}

// --- captures → captives & beasts --------------------------------------------

function commitCapture(S, c) {
  if (c.captureType === 'beast') {
    if (S.menagerie.length >= S.pens) {
      return { name: c.name, where: 'released', note: 'No free pen — it bolts into the dark.' };
    }
    const b = makeBeast(S, c);
    S.menagerie.push(b);
    S.stats.captures++;
    return { name: b.name, where: 'menagerie' };
  }
  const cap = makeCaptive(S, c);
  S.captives.push(cap);
  S.stats.captures++;
  if (!S.flags.undercroft_open) { S.flags.undercroft_open = true; }
  return { name: cap.name, where: 'undercroft' };
}

// Named captives get hand-written records; everyone else is generated.
export const NAMED_CAPTIVES = {
  envoy: { id: 'cap_calla', name: 'Calla', title: 'Envoy of the Ashen Coven', faction: 'coven',
    brand: 100, resolve: 70, regard: -20, traits: ['proud', 'lonely'],
    knows: [
      'The envoys draw lots. Calla drew the short straw on purpose — so her younger sister wouldn\'t.',
      'Mother Cinder trained Vesper. Calla was in the same cohort, two desks behind her.',
      'The Coven brand feeds on doubt. Calla\'s has been starving for a year.',
    ], convert: 'calla' },
  cinder: { id: 'cap_cinder', name: 'Mother Cinder', title: 'Matriarch of the Ashen Coven', faction: 'coven',
    brand: 100, resolve: 100, regard: -80, traits: ['zealous', 'proud', 'stubborn'],
    knows: SECRETS.coven.slice(), convert: 'cinder' },
};

function makeCaptive(S, c) {
  const named = c.named && NAMED_CAPTIVES[c.named];
  if (named) {
    return { id: named.id, defId: c.defId, name: named.name, title: named.title, faction: named.faction,
      brand: named.brand, resolve: named.resolve, regard: named.regard, traits: named.traits.slice(),
      knows: named.knows.slice(), learned: [], wardenId: null, days: 0, relapse: false,
      bargainPts: 0, otherPts: 0, mercies: 0, visitedDay: 0, tonicDays: 0, named: c.named, hooked: false };
  }
  const fac = c.faction || 'coven';
  const used = new Set([...S.captives, ...S.released].map(x => x.name));
  const pool = (CAPTIVE_NAMES[fac] || CAPTIVE_NAMES.coven).filter(n => !used.has(n));
  const nm = pool.length ? pick(pool) : pick(CAPTIVE_NAMES.coven) + ' the Second';
  const traitIds = Object.keys(CAPTIVE_TRAITS);
  const traits = [pick(traitIds)];
  if (c.elite) { let t2 = pick(traitIds); if (t2 !== traits[0]) traits.push(t2); }
  const secrets = (SECRETS[fac] || SECRETS.coven).slice().sort(() => Math.random() - 0.5).slice(0, c.elite ? 3 : 2);
  return { id: uid('cap_'), defId: c.defId, name: nm, title: ENEMIES[c.defId]?.name || 'Captive', faction: fac,
    brand: 100, resolve: c.elite ? 70 : 50, regard: c.elite ? -30 : -15, traits, knows: secrets, learned: [],
    wardenId: null, days: 0, relapse: false, bargainPts: 0, otherPts: 0, mercies: 0, visitedDay: 0, tonicDays: 0, elite: !!c.elite, hooked: false };
}

const BEAST_NAMES = ['Soot', 'Bramble', 'Morrow', 'Tallow', 'Wick', 'Ember', 'Gloam', 'Pip', 'Velvet', 'Thistle', 'Cinder', 'Moth', 'Brine', 'Ash', 'Nettle'];

function makeBeast(S, c, traitsOverride = null) {
  const fam = c.family || 'ember_hound';
  const traitIds = Object.keys(BEAST_TRAITS);
  const traits = traitsOverride || (c.elite ? [pick(traitIds), pick(traitIds)].filter((t, i, a) => a.indexOf(t) === i) : [pick(traitIds)]);
  return { id: uid('bst_'), defId: c.defId, family: fam, name: pick(BEAST_NAMES),
    kind: ENEMIES[c.defId]?.name || BEAST_FAMILIES[fam].name,
    // new arrivals come in fed (on whatever they were caught chewing) so the first night is safe
    tame: c.elite ? 15 : 25, hunger: 20, traits, yieldId: BEAST_FAMILIES[fam].reagent, fed: true, born: S.day };
}

// --- the Undercroft ------------------------------------------------------------

export function traitMod(cap, key, dflt = 1) {
  return cap.traits.reduce((m, t) => m * ((CAPTIVE_TRAITS[t] && CAPTIVE_TRAITS[t][key]) || 1), dflt);
}

export function captiveFear(S) { return (S.corruption || 0) >= 80; }

// The style a hub member brings to the cells.
export function wardenStyle(S, heroId, cap) {
  if (WARDEN_STYLES[heroId]) return WARDEN_STYLES[heroId];
  const conv = S.converts && S.converts[heroId];
  if (conv) return conv.faction === cap.faction ? WARDEN_STYLES.convert : WARDEN_STYLES.default;
  return WARDEN_STYLES.default;
}
// Some pairings go badly: a demon guarding a Vigil knight, or a knight a market broker.
export function badPair(heroId, cap) {
  return (heroId === 'rue' && cap.faction === 'vigil') || (heroId === 'isolde' && cap.faction === 'market');
}

export function assignWarden(S, capId, heroId) {
  for (const [k, v] of Object.entries(S.wardens)) if (v === heroId && k !== capId) delete S.wardens[k];
  if (heroId) S.wardens[capId] = heroId; else delete S.wardens[capId];
  const cap = S.captives.find(c => c.id === capId);
  if (cap) cap.wardenId = heroId || null;
}

// Daily tick: wardens burn the brand out; unwatched brands creep back.
export function advanceReclamation(S) {
  const log = [];
  for (const cap of [...S.captives]) {
    cap.days++;
    const wid = S.wardens[cap.id];
    const resolveDrag = 1 - cap.resolve / 200;  // defiance slows everything
    if (wid && isAlly(S, wid)) {
      const style = wardenStyle(S, wid, cap);
      let rate = style.rate * traitMod(cap, 'brandMult') * resolveDrag;
      if (cap.tonicDays > 0) { rate *= 1.25; cap.tonicDays--; }
      if (badPair(wid, cap)) rate *= 0.5;
      const before = cap.brand;
      cap.brand = Math.max(0, cap.brand - Math.round(rate));
      cap.otherPts += before - cap.brand;
      cap.resolve = Math.max(0, cap.resolve - 2);
      if (style.hookChance && !cap.hooked && Math.random() < style.hookChance) { cap.hooked = true; log.push(`${cap.name} has started owing Rue small things. Rue is delighted.`); }
      if (style.weeklySecret && cap.days % 7 === 0) { const s = revealSecret(cap); if (s) log.push(`Vesper's notes on ${cap.name}: "${s}"`); }
      if (style.noRelapse) cap.isoldeWatched = true;
      if (badPair(wid, cap) && Math.random() < cap.resolve / 100 * 0.03) { breakout(S, cap, log); continue; }
    } else {
      cap.brand = Math.min(100, cap.brand + 2);
      if (Math.random() < cap.resolve / 100 * 0.06) { breakout(S, cap, log); continue; }
    }
    if (cap.traits.includes('stubborn')) cap.resolve = Math.min(100, cap.resolve + CAPTIVE_TRAITS.stubborn.resolveRegen);
    if (cap.brand <= 0 && !cap.releasePending) {
      cap.releasePending = true;
      S.queue.push('release:' + cap.id);
      log.push(`${cap.name}'s brand has burned out. The chains can come off.`);
    }
  }
  return log;
}

function breakout(S, cap, log) {
  S.captives = S.captives.filter(c => c !== cap);
  delete S.wardens[cap.id];
  S.released.push({ ...cap, fate: 'escaped', day: S.day });
  log.push(`${cap.name} broke out of the Undercroft in the night.`);
}

export function revealSecret(cap) {
  const left = cap.knows.filter(k => !cap.learned.includes(k));
  if (!left.length) return null;
  const s = left[0];
  cap.learned.push(s);
  return s;
}

export const VISITS = {
  interrogate: { name: 'Interrogate', icon: '❓', desc: 'Pull a secret loose. −resolve, −regard.' },
  intimidate:  { name: 'Intimidate',  icon: '✋', desc: 'Break their defiance. Large −resolve, −regard.' },
  bargain:     { name: 'Bargain',     icon: '⚖', desc: 'Pay for progress: −brand for gold.' },
  mercy:       { name: 'Mercy',       icon: '❀', desc: 'Kindness. +regard, a little −brand; prevents relapse.' },
  testimony:   { name: 'Testimony',   icon: '✎', desc: 'A converted former comrade speaks. Large −brand.' },
};

export function bargainCost(S) {
  const base = 30 * (S.circleIdx + 1);
  return isAlly(S, 'rue') ? Math.round(base * 0.7) : base;
}

// Testimony needs a converted ally from the same faction.
export function testimonyWitness(S, cap) {
  return Object.entries(S.converts || {}).find(([id, d]) => isAlly(S, id) && d.faction === cap.faction)?.[0] || null;
}

// Perform a visit. Returns { ok, text[] } for the UI to narrate.
export function visitCaptive(S, capId, kind, opts = {}) {
  const cap = S.captives.find(c => c.id === capId);
  const out = { ok: false, text: [], outburst: false };
  if (!cap) return out;
  if (cap.visitedDay === S.day) { out.text.push(`You have already seen ${cap.name} today.`); return out; }
  const fear = captiveFear(S);
  const fearMul = fear ? 1.3 : 1;
  const regardLoss = (n) => { cap.regard = clamp(cap.regard - Math.round(n * traitMod(cap, 'regardLossMult') * fearMul), -100, 100); };
  if (kind === 'interrogate') {
    const useTruth = opts.truth && (S.inventory.truth_draught || 0) > 0;
    if (useTruth) S.inventory.truth_draught--;
    cap.resolve = Math.max(0, cap.resolve - Math.round(10 * fearMul));
    regardLoss(8);
    if (useTruth || Math.random() < 0.6 + (100 - cap.resolve) / 400) {
      const s = revealSecret(cap);
      out.secret = s;
      out.text.push(s ? `${cap.name} gives it up: "${s}"` : `${cap.name} has nothing left to tell you.`);
    } else out.text.push(`${cap.name} says nothing useful. You learn the shape of the silence.`);
  } else if (kind === 'intimidate') {
    cap.resolve = Math.max(0, cap.resolve - Math.round(25 * traitMod(cap, 'intimidateMult') * fearMul));
    regardLoss(15);
    if (Math.random() < 0.2) { out.outburst = true; cap.resolve = Math.min(100, cap.resolve + 5); }
  } else if (kind === 'bargain') {
    const cost = bargainCost(S);
    if (S.gold < cost) { out.text.push(`You need ${cost} gold to bargain.`); return out; }
    S.gold -= cost;
    const amt = Math.round(12 * traitMod(cap, 'bargainMult'));
    cap.brand = Math.max(0, cap.brand - amt);
    cap.bargainPts += amt;
    out.cost = cost;
  } else if (kind === 'mercy') {
    cap.regard = clamp(cap.regard + Math.round(12 * traitMod(cap, 'mercyMult') / (fear ? 1.3 : 1)), -100, 100);
    const amt = 4;
    cap.brand = Math.max(0, cap.brand - amt);
    cap.otherPts += amt;
    cap.mercies++;
  } else if (kind === 'testimony') {
    const w = testimonyWitness(S, cap);
    if (!w) { out.text.push('No one who once wore that brand stands with you yet.'); return out; }
    const amt = Math.round(25 * traitMod(cap, 'testimonyMult'));
    cap.brand = Math.max(0, cap.brand - amt);
    cap.otherPts += amt;
    cap.regard = clamp(cap.regard + 5, -100, 100);
    out.witness = w;
  } else return out;
  cap.visitedDay = S.day;
  out.ok = true;
  if (cap.brand <= 0 && !cap.releasePending) { cap.releasePending = true; S.queue.push('release:' + cap.id); }
  return out;
}

export function useTonic(S, capId) {
  const cap = S.captives.find(c => c.id === capId);
  if (!cap || !(S.inventory.wardens_tonic > 0)) return false;
  S.inventory.wardens_tonic--;
  cap.tonicDays = 3;
  return true;
}

// Bargain-heavy Reclamation without any Mercy leaves the brand hollow but
// the heart untouched: those captives slip back to the Coven.
export function willRelapse(cap) {
  if (cap.isoldeWatched || cap.mercies > 0) return false;
  const total = cap.bargainPts + cap.otherPts;
  return total > 0 && cap.bargainPts / total > 0.6;
}

// Release at brand 0: 'join' (regard ≥ 20), 'leave', or 'relapse'.
export function releaseOutcome(cap) {
  if (willRelapse(cap)) return 'relapse';
  return cap.regard >= 20 ? 'join' : 'leave';
}

export function releaseCaptive(S, capId, fate) {
  const cap = S.captives.find(c => c.id === capId);
  if (!cap) return null;
  S.captives = S.captives.filter(c => c !== cap);
  delete S.wardens[cap.id];
  S.released.push({ ...cap, fate, day: S.day });
  if (fate === 'join') {
    const heroId = convertToHero(S, cap);
    joinAlly(S, heroId, -1);
    if (cap.hooked) S.flags['rue_hook_' + heroId] = true;
    if (cap.named === 'cinder') S.flags.cinder_reclaimed = true;
    return heroId;
  }
  if (fate === 'relapse') S.flags.relapsed = (S.flags.relapsed || 0) + 1;
  if (cap.named === 'cinder' && fate !== 'relapse') S.flags.cinder_reclaimed = true;
  return null;
}

// Captive → hero definition, persisted in S.converts and registered
// into HEROES on every load.
const CONVERT_KITS = {
  coven:  { cls: 'Reclaimed Witch', role: 'caster', base: { hp: 92, mp: 54, atk: 7, mag: 16, def: 7, res: 13, agi: 10, luk: 9 }, growth: { hp: 7.5, mp: 5, atk: 0.8, mag: 2.3, def: 1.1, res: 1.8, agi: 1.1, luk: 1 },
    skills: { 1: 'hex_bolt', 2: 'e_ash_brand', 6: 'page_of_mending', 14: 'chain_sigil', 24: 'bleeding_ink' }, model: 'coven', variant: 'reclaimed', color: '#e8a87a' },
  vigil:  { cls: 'Fallen Knight', role: 'tank', base: { hp: 140, mp: 22, atk: 14, mag: 4, def: 15, res: 12, agi: 8, luk: 7 }, growth: { hp: 11, mp: 2, atk: 1.9, mag: 0.5, def: 2, res: 1.6, agi: 0.9, luk: 0.8 },
    skills: { 1: 'shield_pin', 2: 'vigil_stance', 8: 'oath_ward', 16: 'kneeling_sword' }, model: 'vigil', variant: 'fallen', color: '#c8c8e0' },
  market: { cls: 'Broker', role: 'support', base: { hp: 95, mp: 44, atk: 10, mag: 12, def: 8, res: 10, agi: 12, luk: 14 }, growth: { hp: 8, mp: 4, atk: 1.4, mag: 1.6, def: 1.1, res: 1.3, agi: 1.4, luk: 1.5 },
    skills: { 1: 'stolen_spark', 2: 'encourage', 8: 'tail_trip', 16: 'war_banner' }, model: 'cultist', variant: null, color: '#d8a04a' },
};
const NAMED_CONVERTS = {
  calla: { name: 'Calla', epithet: 'the Envoy Who Stayed', desc: 'Calla, once Envoy of the Ashen Coven — the first one who never went home. Drew the short straw on purpose so her sister wouldn\'t. Studied two desks behind Vesper, once, under Mother Cinder. Wears your colors now and pretends it\'s practical.', color: '#e8a87a' },
  cinder: { name: 'Mother Cinder', epithet: 'Unbranded', desc: 'The Coven\'s matriarch, the brand burned out of her own heart at last. She is very quiet now. She watches Vesper the way a teacher watches a student who surpassed her — and is learning, slowly, to be glad of it.', color: '#ff7a4a' },
};

function convertToHero(S, cap) {
  const kit = CONVERT_KITS[cap.faction] || CONVERT_KITS.coven;
  const named = cap.named && NAMED_CONVERTS[NAMED_CAPTIVES[cap.named].convert];
  const heroId = named ? NAMED_CAPTIVES[cap.named].convert : 'cv_' + cap.id.replace(/[^a-z0-9]/gi, '').slice(-8);
  S.converts[heroId] = {
    id: heroId, faction: cap.faction, fromCaptive: cap.id,
    name: named ? named.name : cap.name,
    epithet: named ? named.epithet : `once of the ${cap.faction === 'vigil' ? 'Vigil' : cap.faction === 'market' ? 'Market' : 'Coven'}`,
    desc: named ? named.desc : `${cap.name}, ${cap.title.toLowerCase()} — reclaimed in the Undercroft after ${cap.days} days. The brand is gone. The habits are going.`,
    color: named ? named.color : kit.color,
    traits: cap.traits.slice(),
  };
  registerConverts(S);
  return heroId;
}

export function registerConverts(S) {
  for (const [id, d] of Object.entries(S.converts || {})) {
    const kit = CONVERT_KITS[d.faction] || CONVERT_KITS.coven;
    HEROES[id] = {
      id, convert: true, name: d.name, epithet: d.epithet, cls: kit.cls, desc: d.desc,
      startLevel: 4, base: kit.base, growth: kit.growth, skills: kit.skills,
      passive: { id: 'reclaimed', name: 'Reclaimed', desc: 'Knows their old cell\'s tricks: Wardens their former comrades fast and unlocks Testimony.' },
      role: kit.role, model: kit.model, variant: kit.variant, color: d.color, faction: d.faction,
    };
  }
}

// --- the Menagerie --------------------------------------------------------------

export function beastTrait(b, key, dflt = 1) {
  return b.traits.reduce((m, t) => m * ((BEAST_TRAITS[t] && BEAST_TRAITS[t][key]) || 1), dflt);
}
export function feedCost(S) { return 4 * (S.circleIdx + 1); }
export function penCost(S) { return 150 * (S.circleIdx + 1) + 50 * Math.max(0, S.pens - 4); }

export function feedBeast(S, beastId) {
  const b = S.menagerie.find(x => x.id === beastId);
  const cost = feedCost(S);
  if (!b || b.fed || S.gold < cost) return false;
  S.gold -= cost;
  b.fed = true;
  return true;
}

export function assignHandler(S, beastId, heroId) {
  for (const [k, v] of Object.entries(S.handlers)) if (v === heroId && k !== beastId) delete S.handlers[k];
  if (heroId) S.handlers[beastId] = heroId; else delete S.handlers[beastId];
}

// Daily tick: fed beasts tame up and yield; hungry ones sour and may bolt.
export function tendMenagerie(S) {
  const log = [];
  for (const b of [...S.menagerie]) {
    const fam = BEAST_FAMILIES[b.family];
    const handler = S.handlers[b.id];
    const docile = handler === 'rue' && fam.infernal;
    if (b.fed) {
      b.hunger = 0;
      b.tame = Math.min(100, b.tame + Math.round((10 + (handler ? 5 : 0) + (docile ? 5 : 0)) * beastTrait(b, 'tameMult')));
      let n = 1;
      let extra = beastTrait(b, 'yieldBonus', 1) - 1;
      if (handler) extra += 0.5;
      while (extra > 0) { if (Math.random() < Math.min(1, extra)) n++; extra -= 1; }
      if (handler === 'nessa' && fam.plant) n *= 2;
      S.reagents[b.yieldId] = (S.reagents[b.yieldId] || 0) + n;
      log.push(`${b.name} the ${b.kind.toLowerCase()} yields ${n} ${REAGENTS[b.yieldId].name.toLowerCase()}.`);
    } else {
      b.hunger = Math.min(100, b.hunger + Math.round(35 * beastTrait(b, 'hungerMult')));
      b.tame = Math.max(0, b.tame - (docile ? 3 : 8));
      if (b.tame < 10 && b.hunger >= 70 && !docile && !b.traits.includes('hardy') && Math.random() < 0.4) {
        S.menagerie = S.menagerie.filter(x => x !== b);
        delete S.handlers[b.id];
        log.push(`${b.name} slipped its pen in the night, hungry and wild.`);
        continue;
      }
    }
    b.fed = false;
  }
  // eggs hatch after three days
  for (const egg of [...S.eggs]) {
    if (S.day >= egg.hatchDay) {
      S.eggs = S.eggs.filter(e => e !== egg);
      if (S.menagerie.length >= S.pens) { log.push(`An egg hatched — but there was no free pen, and the little thing wandered off.`); continue; }
      const b = makeBeast(S, { family: egg.family, defId: egg.defId }, egg.traits);
      b.name = egg.name || b.name;
      b.tame = 40;
      S.menagerie.push(b);
      log.push(`An egg hatched in the Menagerie: ${b.name}, a ${egg.variant} ${BEAST_FAMILIES[egg.family].name.toLowerCase()}.`);
    }
  }
  return log;
}

// Two tame beasts of one family produce a variant egg with a mixed trait.
export function canBreed(S, aId, bId) {
  const a = S.menagerie.find(x => x.id === aId), b = S.menagerie.find(x => x.id === bId);
  return !!(a && b && a !== b && a.family === b.family && a.tame >= 60 && b.tame >= 60 && !a.bredDay && !b.bredDay
    && S.menagerie.length + S.eggs.length < S.pens + 1);
}
export function breed(S, aId, bId) {
  if (!canBreed(S, aId, bId)) return null;
  const a = S.menagerie.find(x => x.id === aId), b = S.menagerie.find(x => x.id === bId);
  const traits = [pick(a.traits), pick(b.traits)].filter((t, i, arr) => arr.indexOf(t) === i);
  const variant = traits.map(t => BEAST_TRAITS[t].name).join('-');
  const egg = { family: a.family, defId: a.defId, traits, variant, hatchDay: S.day + 3 };
  S.eggs.push(egg);
  a.bredDay = b.bredDay = S.day;
  return egg;
}

export function buyPen(S) {
  const cost = penCost(S);
  if (S.gold < cost) return false;
  S.gold -= cost;
  S.pens++;
  return true;
}

// --- alchemy ----------------------------------------------------------------------

// Brew from 1–3 reagent ids. Known recipes always work; valid but unknown
// combos usually discover the recipe; anything else is sludge.
export function brew(S, ids) {
  if (!ids.length || ids.length > 3) return { ok: false, msg: 'Pick one to three reagents.' };
  const need = {};
  for (const id of ids) need[id] = (need[id] || 0) + 1;
  for (const [id, n] of Object.entries(need)) if ((S.reagents[id] || 0) < n) return { ok: false, msg: `Not enough ${REAGENTS[id].name.toLowerCase()}.` };
  const rid = recipeFor(ids);
  const r = rid && RECIPES[rid];
  if (r && r.gold && S.gold < r.gold) return { ok: false, msg: `Beast Bait needs ${r.gold} gold as well.` };
  for (const [id, n] of Object.entries(need)) S.reagents[id] -= n;
  let made = 'sludge', discovered = false;
  if (r) {
    const known = S.recipes.includes(rid);
    const disc = RECIPE_DISCOVERY + (isAlly(S, 'brynn') ? 0.2 : 0);
    if (known || Math.random() < disc) {
      made = r.makes;
      if (r.gold) S.gold -= r.gold;
      if (!known) { S.recipes.push(rid); discovered = true; addChronicle(S, `Discovered a recipe: ${ITEMS[made].name}.`); }
    }
  }
  S.inventory[made] = (S.inventory[made] || 0) + 1;
  return { ok: true, made, discovered };
}

export function sellItem(S, id) {
  const it = ITEMS[id];
  if (!it || !(S.inventory[id] > 0)) return 0;
  const val = it.sell || Math.round((it.price || 0) * 0.4);
  S.inventory[id]--;
  S.gold += val;
  return val;
}
export function sellReagent(S, id) {
  if (!(S.reagents[id] > 0)) return 0;
  S.reagents[id]--;
  S.gold += REAGENTS[id].price;
  return REAGENTS[id].price;
}

// --- the pact altar ----------------------------------------------------------------

export function canPact(S, pactId) {
  const p = PACTS[pactId];
  if (!p) return false;
  if (S.pacts.includes(pactId) && pactId !== 'blood_surge' && pactId !== 'memory_toll') return false;
  if (p.cost === 'gold' && S.gold < p.gold) return false;
  if (p.cost === 'memory' && !S.chronicle.some(c => !c.crossed)) return false;
  return true;
}

// opts: { heroId } for blood_surge, { entry } (chronicle index) for memory_toll
export function swearPact(S, pactId, opts = {}) {
  const p = PACTS[pactId];
  if (!canPact(S, pactId)) return false;
  if (p.cost === 'trust') {
    const h = opts.heroId;
    if (!h || h === 'player' || !isAlly(S, h)) return false;
    addBond(S, h, -2);
    S.statSurge[h] = (S.statSurge[h] || 0) + 0.12;
  } else if (p.cost === 'scar') {
    S.flags.pact_scar_rite = true;
    S.flags.scarred = true;
  } else if (p.cost === 'memory') {
    const live = S.chronicle.map((c, i) => [c, i]).filter(([c]) => !c.crossed);
    const [entry] = live.find(([, i]) => i === opts.entry) || live[live.length - 1];
    entry.crossed = true;
    S.sealPower += 0.10;
  } else if (p.cost === 'gold') {
    S.gold -= p.gold;
    S.flags.free_seal = true;
  }
  S.pacts.push(pactId);
  addCorruption(S, p.corruption);
  addChronicle(S, `Swore the pact of ${p.name}.`);
  return true;
}

// --- dispatch -------------------------------------------------------------------------

export function dispatchForecast(S, gate, ids) {
  const bench = DISPATCH_BENCHMARK[gate.rank] || 10;
  const avg = ids.length ? ids.reduce((a, id) => a + (S.heroes[id]?.level || 1), 0) / ids.length : 0;
  const roles = [...new Set(ids.map(id => HEROES[id]?.role).filter(Boolean))];
  let comp = roles.reduce((a, r) => a + (ROLE_INFO[r]?.bonus || 0), 0);
  if (ids.length >= 3) comp += 0.05;
  const chance = clamp(0.5 + (avg / bench - 1) * 1.1 + comp, 0.05, 0.95);
  return { chance, comp, roles, avg: Math.round(avg), bench };
}

export function sendDispatch(S, gate, ids) {
  const { chance } = dispatchForecast(S, gate, ids);
  S.dispatch.push({
    id: uid('m'),
    gate: { rank: gate.rank, rankIdx: gate.rankIdx, name: gate.name, biome: gate.biome, modifier: gate.modifier },
    team: ids.slice(), day: S.day, chance,
  });
  S.tarotHand = S.tarotHand.filter(c => c !== gate);
  save(S);
}

function resolveDispatches(S) {
  const due = (S.dispatch || []).filter(m => S.day > m.day);
  if (!due.length) return;
  S.dispatch = S.dispatch.filter(m => S.day <= m.day);
  for (const m of due) {
    const success = Math.random() < m.chance;
    const tier = XP_MULT[m.gate.rank];
    const report = { day: S.day, gate: m.gate, team: m.team, success, gp: 0, gold: 0, xp: 0, gear: null, levelUps: [], seen: false };
    if (success) {
      report.gp = Math.round(GATE_GP[m.gate.rank] * 0.6);
      report.gold = Math.round(70 * tier * (0.8 + Math.random() * 0.4));
      report.xp = Math.round(110 * tier);
      if (Math.random() < 0.4) {
        report.gear = makeGear(pick(['weapon', 'armor', 'charm']), Math.min(m.gate.rankIdx, 5), Math.random);
        S.gearBag.push(report.gear);
      }
      S.gold += report.gold;
      addInfamy(S, report.gp);
    } else report.xp = Math.round(45 * tier);
    for (const id of m.team) report.levelUps.push(...gainXp(S, id, report.xp));
    S.dispatchReports.push(report);
  }
}

// --- loot -------------------------------------------------------------------------------

export function rollTreasure(S, gate, rng) {
  const r = rng ? rng() : Math.random();
  const tier = Math.min(gate.rankIdx + (r > 0.85 ? 1 : 0), 5);
  if (r < 0.45) {
    const g = makeGear(pick(['weapon', 'armor', 'charm'], rng), tier, rng || Math.random);
    S.run.loot.gear.push(g);
    return { kind: 'gear', gear: g };
  } else if (r < 0.72) {
    const gold = Math.round(40 * XP_MULT[gate.rank] * (0.8 + r));
    S.run.loot.gold += gold;
    return { kind: 'gold', gold };
  } else if (r < 0.86) {
    const reagent = pick(Object.keys(REAGENTS), rng);
    S.reagents[reagent] = (S.reagents[reagent] || 0) + 1;
    return { kind: 'reagent', reagent };
  } else {
    const item = r > 0.95 && gate.rankIdx >= 1 ? 'feather' : 'potion';
    S.run.loot.items[item] = (S.run.loot.items[item] || 0) + 1;
    return { kind: 'item', item };
  }
}

export function rollBossDrop(S, gate) {
  if (Math.random() < 0.75) {
    const g = makeGear(pick(['weapon', 'armor', 'charm']), Math.min(gate.rankIdx + (Math.random() > 0.7 ? 1 : 0), 5), Math.random);
    S.run.loot.gear.push(g);
    return g;
  }
  return null;
}

export function canAfford(S, price) { return S.gold >= price; }
