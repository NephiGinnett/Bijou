// ============================================================
// BINDING CODEX — game state, saves, progression, tarot & rifts,
// captures, the Undercroft, the Menagerie, alchemy and pacts
// ============================================================

import {
  RANKS, RANK_UP_GP, GATE_GP, XP_MULT, ENEMY_TIER, HEROES, heroStatsAt, heroSkillsAt,
  xpToNext, BIOMES, GATE_ROOMS, TAROT, ENEMIES, makeGear, AFFIXES,
  FACTIONS, LOCATIONS, LAIR_POWER, POWER, GATE_MODIFIERS, TRIBES, KIN_STAGES,
  ELITES, ELITE_XP_MULT, ELITE_GOLD_MULT, eliteChance, ROLE_INFO, DISPATCH_BENCHMARK,
  CAPTIVE_TRAITS, CAPTIVE_NAMES, SECRETS, WARDEN_STYLES, BEAST_FAMILIES, BEAST_TRAITS,
  REAGENTS, RECIPES, RECIPE_DISCOVERY, recipeFor, ITEMS, PACTS, SLOT_VI,
} from './data.js';

export const SAVE_KEY = 'bindingcodex_save';
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
    factions: Object.fromEntries(Object.keys(FACTIONS).map(id => [id, { power: 100, fate: null }])),
    lieutenants: {},                 // lieutenant id → captured | yielded | slain
    tribes: Object.fromEntries(Object.keys(TRIBES).map(id => [id, { status: null, gifts: 0, rite: false, favor: 0, talkDay: 0, tradeDay: 0, nightDay: -9, kin: [], rites: 0, suitor: null, suitorDay: null, stageSeen: 0, met: [], pairs: {}, pop: null, clutches: [], lineage: {}, born: 0, kinNightDay: -9 }])),
    visits: {},                      // location id → clears
    omen: null,                      // Vesper's card for today
    readingDay: 0,
    run: null,
    stats: { clears: 0, kills: 0, captures: 0, retreats: 0, wipes: 0, tone: {}, reagentsProduced: 0 },
    legacy: { cycle: 0, xpBoost: 0 },
    cleared: false,
    clearedDay: 0,
    ngPlus: 0,
    mastery: {},
    hangouts: {}, family: [], expecting: {}, seenDay: {}, eveningDay: -1, guests: {},
    autoSkill: {},
    dispatch: [],
    dispatchReports: [],
    // Binding Codex systems
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
    settings: { volume: 0.6, music: true, textFast: false, spice: 'gentle', gore: 'gentle', outfit: 'adventure', autoBattle: false, packs: { obsidian: true, northern: true, classic: true, wildkin: true, hearts: true } },
  };
  S.heroes.player = { level: 1, xp: 0, gear: { weapon: null, armor: null, charm: null } };
  return S;
}

// --- persistence ----------------------------------------------------------

export function save(S) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { /* private mode */ }
}
// Default every field, so older Binding Codex saves keep working.
export function ensureShape(S) {
  if (!S) return S;
  const d = newGame(S.name, S.pronouns);
  for (const k of Object.keys(d)) if (S[k] === undefined) S[k] = d[k];
  for (const k of Object.keys(d.settings)) if (S.settings[k] === undefined) S.settings[k] = d.settings[k];
  for (const k of Object.keys(d.stats)) if (S.stats[k] === undefined) S.stats[k] = d.stats[k];
  for (const k of Object.keys(d.bond)) if (S.bond[k] === undefined) S.bond[k] = 0;
  for (const k of Object.keys(d.factions)) if (!S.factions[k]) S.factions[k] = { power: 100, fate: null };
  for (const k of Object.keys(d.tribes)) {
    if (!S.tribes[k]) S.tribes[k] = d.tribes[k];
    for (const f of ['favor', 'talkDay', 'tradeDay', 'nightDay', 'kin', 'rites', 'stageSeen', 'met', 'pairs', 'clutches', 'lineage', 'born', 'kinNightDay']) if (S.tribes[k][f] == null) S.tribes[k][f] = d.tribes[k][f];
  }
  if (S.stats.reagentsProduced == null) S.stats.reagentsProduced = 0;
  if (!S.settings.packs) S.settings.packs = d.settings.packs;
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

// --- spending time: closeness, evenings, family -------------------------------------

// Time with someone, once a day each: every CLOSE_PER_BOND visits is +1 bond.
export const CLOSE_PER_BOND = 3;
const hang = (S, id) => (S.hangouts[id] ||= { day: -1, close: 0, evDay: -9, nights: 0 });
export function hangoutOpen(S, id) { return isAlly(S, id) && hang(S, id).day !== S.day; }
export function hangout(S, id) {
  const h = hang(S, id);
  h.day = S.day;
  h.close += 1;
  let up = false;
  if (h.close >= CLOSE_PER_BOND) { h.close = 0; if ((S.bond[id] ?? 0) < 10) { addBond(S, id, 1); up = true; } }
  return { up, bond: S.bond[id] ?? 0, close: h.close };
}
export function closeness(S, id) { return hang(S, id).close; }
// Romanced: her romance (or negotiated revisit) has happened.
export function romanced(S, id) { return !!(S.seen[`${id}_romance`] || S.seen[`${id}_revisit`]); }
// An evening together: one a night overall, every other night with the same partner.
export function eveningOpen(S, id) { return isAlly(S, id) && romanced(S, id) && S.eveningDay !== S.day && S.day - hang(S, id).evDay >= 2; }
export function recordEvening(S, id, together) {
  const h = hang(S, id);
  h.evDay = S.day; S.eveningDay = S.day;
  h.close += 1;
  if (h.close >= CLOSE_PER_BOND) { h.close = 0; addBond(S, id, 1); }
  if (together) h.nights = (h.nights || 0) + 1;
}
// Nights together: the romance itself, plus every evening that went past talking.
export function nightsWith(S, id) { return (S.hangouts[id]?.nights || 0) + (romanced(S, id) ? 1 : 0); }
export function childrenOf(S, id) { return (S.family || []).filter(c => c.parent === id); }
export function addChild(S, parent, name) { S.family.push({ parent, name, day: S.day }); }
export function expect(S, id, days = 12) { S.expecting[id] = S.day + days; }

export function heroStats(S, id) {
  const h = S.heroes[id];
  const def = HEROES[id];
  const level = h ? h.level : def.startLevel;
  const s = heroStatsAt(def, level);
  const surge = (S.statSurge && S.statSurge[id]) || 0;
  if (surge) for (const k of ['hp', 'mp', 'atk', 'mag', 'def', 'res', 'agi']) s[k] = Math.round(s[k] * (1 + surge));
  if (S.factions && perk(S, 'vigil')) { s.def = Math.round(s.def * 1.1); s.res = Math.round(s.res * 1.1); }
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
    if (S.flags && S.flags.pact_wyrm_mantle && !out.includes('monstrous_form')) out.push('monstrous_form');
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
  if (perk(S, 'college')) amount = Math.round(amount * 1.1);
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

// --- rival factions -------------------------------------------------------------

export const DOMINATED = ['subjugated', 'sworn', 'humbled', 'shattered'];
export function factionFate(S, fid) { return (S.factions && S.factions[fid] && S.factions[fid].fate) || null; }
export function dominated(S, fid) { return DOMINATED.includes(factionFate(S, fid)); }
// Full perks once the leader is bound, sworn or humbled; a slain leader
// leaves a leaderless rabble that pays tribute but grants nothing else.
export function perk(S, fid) { const f = factionFate(S, fid); return f === 'subjugated' || f === 'sworn' || f === 'humbled'; }
// Leader-in-the-cells perks (only while they sit in the Undercroft).
export function leaderInCells(S, fid) {
  const named = { coven: 'cinder', vigil: 'aldric', market: 'proprietor', lodge: 'hale' }[fid];
  return !!named && (S.captives || []).some(c => c.named === named);
}

export function hitFaction(S, fid, amount, log) {
  if (!fid || !S.factions[fid] || dominated(S, fid)) return 0;
  const f = S.factions[fid];
  const before = f.power;
  f.power = clamp(f.power - amount, 0, 100);
  if (before > LAIR_POWER && f.power <= LAIR_POWER) {
    S.queue.push('lair_open_' + fid);
    if (log) log.push(`${FACTIONS[fid].name} is reeling. ${FACTIONS[fid].leaderName}'s lair is exposed.`);
  }
  return before - f.power;
}

const NIGHTLY = {};
export function registerNightly(id, fn) { NIGHTLY[id] = fn; }

function factionNight(S, log) {
  for (const [pid, fn] of Object.entries(NIGHTLY)) if (packOn(S, pid)) fn(S, log);
  for (const [fid, f] of Object.entries(S.factions)) {
    const fate = f.fate;
    if (!fate) { if (f.power < 100) f.power = Math.min(100, f.power + POWER.regen); continue; }
    const mult = fate === 'shattered' ? 0.5 : fate === 'sworn' ? 1.5 : 1;
    if (fid === 'coven') {
      S.reagents.cinder_ash = (S.reagents.cinder_ash || 0) + Math.max(1, Math.round(mult));
      S.reagents.brimstone_salt = (S.reagents.brimstone_salt || 0) + Math.max(1, Math.round(mult));
    }
    if (fid === 'market') { const g = Math.round(60 * mult); S.gold += g; log.push(`Market tribute: ${g} gold.`); }
    if (fid === 'lodge') addInfamy(S, Math.round(5 * mult));
  }
}

// --- wild tribes ---------------------------------------------------------------------

export function tribeSworn(S, tid) { return !!(S.tribes && S.tribes[tid] && S.tribes[tid].status === 'sworn'); }

function tribeNight(S, log) {
  for (const [tid, T] of Object.entries(TRIBES)) {
    const t = S.tribes[tid];
    if (!packOn(S, 'wildkin')) continue;
    // the Lodge hunted the Pride; with the Lodge brought low they come sooner
    const draw = T.draw - (tid === 'pride' && S.factions.lodge && S.factions.lodge.fate ? 25 : 0);
    if (!t.status && (S.stats.reagentsProduced || 0) >= draw) {
      t.status = 'curious';
      S.queue.push(`tribe_${tid}_arrive`);
      log.push(`${T.race} have been seen circling the Menagerie.`);
    }
    if (t.status === 'sworn') {
      syncKin(S, tid);
      if (t.pop == null) t.pop = T.pop;
      // clutches laid after a rite hatch here; the tribe grows
      for (const c of t.clutches.filter(c => c.due <= S.day)) {
        t.pop += c.n; t.born += c.n;
        t.lineage[c.from] = (t.lineage[c.from] || 0) + c.n;
        const tr = KIN_TRAITS[kinKey(tid, c.from)];
        log.push(`${c.n} ${c.n === 1 ? T.young.replace(/s$/, '') : T.young} ${c.n === 1 ? 'is' : 'are'} born to ${T.name.replace(/^The /, 'the ')}${tr ? `, with ${c.from}'s ${tr.word}` : ''}.`);
      }
      t.clutches = t.clutches.filter(c => c.due > S.day);
      const st = kinStage(S, tid);
      const mult = 1 + st;
      const more = Math.min(4, Math.floor((t.pop - T.pop) / 15)); // a bigger tribe brings more (capped)
      for (const [r, n] of Object.entries(T.tribute)) S.reagents[r] = (S.reagents[r] || 0) + n * mult + more;
      if (st >= 4) S.gold += 30; // they hunt for you now
      if (st > t.stageSeen) {
        if (t.stageSeen >= 1) { S.queue.push(`kin_stage_${tid}_${st}`); log.push(`${T.name}: ${KIN_STAGES[st].name}. ${KIN_STAGES[st].desc}`); }
        t.stageSeen = st;
      }
      // another of the tribe comes to the Bower to ask for herself
      const every = KIN_STAGES[st].every;
      if (every && !t.suitor && S.day - (t.suitorDay ?? S.day) >= every) {
        const pool = T.kin.filter(([n]) => !t.met.includes(n));
        if (pool.length) {
          const [name, who] = pool[Math.floor(Math.random() * pool.length)];
          t.suitor = { name, who, look: Math.floor(Math.random() * 4) };
          t.met.push(name);
          log.push(`${name}, ${who}, has come to the Envoys' Bower to ask for you herself.`);
        }
      }
    }
  }
}

// --- kinship: how many of the tribe have chosen you ---------------------------------

// Looks/colors for the bloodline tracker, filled in by the Wildkin pack.
export const KIN_TRAITS = {};
export function kinKey(tid, name) { const T = TRIBES[tid]; return name === T.envoyName ? T.envoy : `${tid}_${name.toLowerCase()}`; }

// Every rite: tallied per partner, and a clutch is laid that hatches in a few days.
// (The young are raised by the tribe; they never join the suitor pool.)
function riteWith(S, tid, name) {
  const t = S.tribes[tid], T = TRIBES[tid];
  t.rites = (t.rites || 0) + 1;
  t.pairs[name] = (t.pairs[name] || 0) + 1;
  const [lo, hi] = T.brood;
  t.clutches.push({ due: S.day + T.hatch, n: lo + Math.floor(Math.random() * (hi - lo + 1)), from: name });
}

// The envoy's own rite makes her the first of the tribe's kin.
function syncKin(S, tid) {
  const t = S.tribes[tid];
  if (S.flags[`rite_${tid}`] && !t.kin.some(k => k.envoy)) {
    t.kin.unshift({ name: TRIBES[tid].envoyName, envoy: true, day: S.day });
    riteWith(S, tid, TRIBES[tid].envoyName);
    t.suitorDay = S.day;
  }
}
export function kinStage(S, tid) {
  const n = (S.tribes[tid].kin || []).length;
  let i = 0;
  KIN_STAGES.forEach((st, k) => { if (n >= st.at) i = k; });
  return i;
}
export function kinInfo(S, tid) {
  syncKin(S, tid);
  const t = S.tribes[tid], st = kinStage(S, tid), next = KIN_STAGES[st + 1];
  return { stage: st, ...KIN_STAGES[st], count: t.kin.length, rites: t.rites || 0, next: next ? next.at : null, nextName: next ? next.name : null, mult: 1 + st };
}
export function kinTotal(S) { return Object.keys(TRIBES).reduce((a, tid) => a + ((S.tribes[tid] && S.tribes[tid].kin) || []).length, 0); }
// She asked; you answer. 'later' leaves her waiting in the Bower.
export function kinAnswer(S, tid, ans) {
  const t = S.tribes[tid], s = t.suitor;
  if (!s || ans === 'later') return;
  t.suitor = null;
  t.suitorDay = S.day;
  if (ans === 'yes') {
    t.kin.push({ name: s.name, who: s.who, day: S.day });
    riteWith(S, tid, s.name);
    t.favor = Math.min(10, t.favor + 1);
    addChronicle(S, `${s.name}, ${s.who}, chose you, and carried your blood home to ${TRIBES[tid].name}.`);
  } else t.met = t.met.filter(n => n !== s.name); // she may ask again someday
}
// A Bower evening with the envoy that went past talking.
export function kinNight(S, tid) { riteWith(S, tid, TRIBES[tid].envoyName); }

// Sending for one of your kin by name: every other day per tribe.
export function kinEveningOpen(S, tid) {
  const t = S.tribes[tid];
  return envoyHere(S, tid) && tribeSworn(S, tid) && t.kin.some(k => !k.envoy) && S.day - (t.kinNightDay ?? -9) >= 2;
}
export function kinEvening(S, tid, name, together) {
  const t = S.tribes[tid];
  t.kinNightDay = S.day;
  if (together) riteWith(S, tid, name);
}

// The tribe's growth and whose looks it's taking after.
export function broodInfo(S, tid) {
  const t = S.tribes[tid], T = TRIBES[tid];
  const pop = t.pop ?? T.pop;
  const lines = Object.entries(t.lineage || {}).map(([name, n]) => ({ name, n, share: n / pop, ...(KIN_TRAITS[kinKey(tid, name)] || { hex: 0x888888, word: '' }) }))
    .sort((a, b) => b.n - a.n);
  const pairs = Object.entries(t.pairs || {}).sort((a, b) => b[1] - a[1]);
  const lead = lines[0];
  let resemble = '';
  if (lead && lead.share >= 0.5) resemble = `Most of ${T.name.replace(/^The /, 'the ')} take after ${lead.name} now: ${lead.word} everywhere you look.`;
  else if (lead && lead.share >= 0.3) resemble = `${T.name} is starting to look like ${lead.name}; you see her ${lead.word} all over.`;
  else if (lead && lead.share >= 0.12) resemble = `More and more of ${T.name.replace(/^The /, 'the ')} have ${lead.name}'s ${lead.word}.`;
  return { pop, base: T.pop, born: t.born || 0, warming: (t.clutches || []).reduce((a, c) => a + c.n, 0), rites: t.rites || 0, pairs, lines, resemble, young: T.young };
}

// --- wildkin guests: envoys who came asking for your protection ------------------------

const guest = (S, id) => (S.guests[id] ||= { here: false, truce: false, favor: 0, talkDay: -1, nightDay: -9 });
export function guestArrive(S, id) { guest(S, id).here = true; }
export function guestTruce(S, id) { const g = guest(S, id); g.truce = true; g.favor = Math.max(g.favor, 2); }
export function guestHere(S, id) { return !!(S.guests[id] && S.guests[id].here && packOn(S, 'wildkin')); }
export function guestTalk(S, id) {
  const g = guest(S, id);
  if (!guestHere(S, id) || !g.truce || g.talkDay === S.day) return null;
  g.talkDay = S.day; g.favor = Math.min(10, g.favor + 1);
  return g.favor;
}
// His romance unlocks at favor 5; evenings after, every third night.
export function guestRomanceOpen(S, id) { const g = S.guests[id]; return guestHere(S, id) && !!g.truce && g.favor >= 5 && !S.seen[`${id}_romance`]; }
export function guestEveningOpen(S, id) { const g = S.guests[id]; return guestHere(S, id) && !!S.seen[`${id}_romance`] && S.eveningDay !== S.day && S.day - g.nightDay >= 3; }
export function guestEvening(S, id) { const g = guest(S, id); g.nightDay = S.day; S.eveningDay = S.day; g.favor = Math.min(10, g.favor + 1); }

// What the tribe wants next, and whether you can give it.
export function tribeRequest(S, tid) {
  const t = S.tribes[tid];
  if (!t || !t.status || t.status === 'sworn') return null;
  const g = TRIBES[tid].gifts[t.gifts];
  if (!g) return null;
  const ok = S.gold >= (g.gold || 0) && Object.entries(g.reagents).every(([r, n]) => (S.reagents[r] || 0) >= n);
  return { ...g, ok };
}
export function giveTribeGift(S, tid) {
  const req = tribeRequest(S, tid);
  if (!req || !req.ok) return false;
  S.gold -= req.gold || 0;
  for (const [r, n] of Object.entries(req.reagents)) S.reagents[r] -= n;
  const t = S.tribes[tid];
  t.gifts++;
  if (t.gifts >= TRIBES[tid].gifts.length) { t.status = 'sworn'; S.queue.push(`tribe_${tid}_sworn`); addChronicle(S, `${TRIBES[tid].name} swore fealty.`); }
  else { t.status = 'friendly'; S.queue.push(`tribe_${tid}_friendly`); }
  return true;
}

// --- the Envoys' Bower: visiting envoys in the Menagerie -----------------------------

export function envoyHere(S, tid) { const t = S.tribes[tid]; return !!(t && t.status && packOn(S, 'wildkin')); }

// Talk: once a day, warms her to you. Favor 10 max.
export function envoyTalk(S, tid) {
  const t = S.tribes[tid];
  if (!envoyHere(S, tid) || t.talkDay === S.day) return null;
  t.talkDay = S.day;
  t.favor = Math.min(10, t.favor + 1);
  // at favor milestones she brings something from home
  const gift = t.favor % 3 === 0 ? Object.keys(TRIBES[tid].tribute)[0] : null;
  if (gift) S.reagents[gift] = (S.reagents[gift] || 0) + 2;
  return { favor: t.favor, gift };
}

// Trade: once a day, 2 of any of your reagents for her tribe's goods.
// What she trades you: her tribe's first good, or its second if you're offering the first.
export function envoyTradeGood(tid, give) {
  const goods = Object.keys(TRIBES[tid].tribute);
  return give === goods[0] && goods[1] ? goods[1] : goods[0];
}
export function envoyTradeRate(S, tid) { return 2 + Math.floor((S.tribes[tid].favor || 0) / 3) + (tribeSworn(S, tid) ? 1 : 0); }
export function envoyTrade(S, tid, give) {
  const t = S.tribes[tid];
  if (!envoyHere(S, tid) || t.tradeDay === S.day || (S.reagents[give] || 0) < 2) return null;
  const want = envoyTradeGood(tid, give);
  const n = envoyTradeRate(S, tid);
  S.reagents[give] -= 2;
  S.reagents[want] = (S.reagents[want] || 0) + n;
  t.tradeDay = S.day;
  return { want, n };
}

// A night together: only after she asked for the rite, and she has to want company.
export function envoyNightOpen(S, tid) {
  const t = S.tribes[tid];
  return envoyHere(S, tid) && tribeSworn(S, tid) && !!S.flags[`rite_${tid}`] && t.favor >= 3 && S.day - t.nightDay >= 3;
}
export function envoyNight(S, tid) {
  if (!envoyNightOpen(S, tid)) return null;
  const t = S.tribes[tid];
  t.nightDay = S.day;
  t.favor = Math.min(10, t.favor + 1);
  const r = Object.keys(TRIBES[tid].tribute)[0];
  S.reagents[r] = (S.reagents[r] || 0) + 3;
  return { reagent: r };
}

// --- the map: holdings you can raid ------------------------------------------------

export function locationOpen(S, locId) {
  const L = LOCATIONS[locId];
  if (!L) return { ok: false, why: 'unknown' };
  if (L.circle > S.circleIdx + (L.lair ? 0 : 1)) return { ok: false, why: `Reach the ${RANKS[L.lair ? L.circle : L.circle - 1]} Circle` };
  if (L.lair) {
    const f = S.factions[L.faction];
    if (f.fate) return { ok: false, why: 'Already dominated', done: true };
    if (f.power > LAIR_POWER) return { ok: false, why: `Weaken ${FACTIONS[L.faction].name} to ${LAIR_POWER} Power` };
    if (locId === 'citadel_vigil' && !S.flags.isolde_rune4) return { ok: false, why: 'Isolde\'s story must reach the riders first' };
  }
  return { ok: true };
}

// Build a raid on a holding. Difficulty follows your Circle (never below the holding's own).
export function makeExpedition(S, locId) {
  const L = LOCATIONS[locId];
  const rIdx = Math.max(L.circle, Math.min(S.circleIdx, RANKS.length - 1));
  const rank = RANKS[rIdx];
  return {
    id: 'exp_' + locId + '_' + S.day, loc: locId,
    rank, rankIdx: rIdx, biome: L.biome, name: L.name, faction: L.faction,
    modifier: L.modifier, lair: !!L.lair,
    rooms: L.rooms || GATE_ROOMS[rank],
    seed: (Math.random() * 2 ** 31) | 0,
  };
}

// Post-ending: the Heart echoes, deeper each time.
export function makeEchoRift(S) {
  const depth = (S.ngPlus || 0) + 1;
  return {
    id: 'echo_' + S.day, loc: 'ashen_heart', rank: 'Abyss', rankIdx: 5, biome: 'heart', faction: null,
    name: `Echo ${toRoman(depth)} — the Heart Remembers`, modifier: depth % 2 ? 'burning' : 'rich',
    rooms: Math.min(8, 5 + Math.floor(depth / 2)), recursion: true, depth, seed: (Math.random() * 2 ** 31) | 0,
  };
}

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
function toRoman(n) { return n <= 10 ? ROMAN[n] : String(n); }

// Pending named lieutenant for a holding, if its pack is on and it's still at large.
export function pendingLieutenant(S, locId) {
  const lt = LOCATIONS[locId] && LOCATIONS[locId].lieutenant;
  if (!lt || !ENEMIES[lt.id]) return null;
  if (lt.pack && !packOn(S, lt.pack)) return null;
  if (lt.circle != null && S.circleIdx < lt.circle) return null;
  if (S.lieutenants[lt.id]) return null;
  return lt.id;
}
export function packOn(S, pack) { return !pack || !S.settings.packs || S.settings.packs[pack] !== false; }

// --- Vesper's daily reading --------------------------------------------------------

export function canRead(S) { return isAlly(S, 'vesper') && S.readingDay !== S.day; }

// Draw today's card and apply its immediate boon. Returns { card, text[] }.
export function dailyReading(S) {
  if (!canRead(S)) return null;
  const ids = Object.keys(TAROT);
  const rng = mulberry32(S.seed ^ (S.day * 2246822519));
  const card = ids[Math.floor(rng() * ids.length)];
  const T = TAROT[card];
  S.readingDay = S.day;
  S.omen = { card, day: S.day };
  const out = { card, text: [] };
  if (T.now === 'secret') {
    const c = S.captives.find(x => x.knows.some(k => !x.learned.includes(k)));
    const s = c && revealSecret(c);
    out.text.push(s ? `${c.name}: “${s}”` : 'The ink pools, and finds nothing new to say.');
  } else if (T.now === 'bond') {
    const pool = roster(S).filter(id => id !== 'player' && id in S.bond);
    const who = pool.length ? pick(pool, rng) : null;
    if (who) { addBond(S, who, 1); out.bond = who; }
  } else if (T.now === 'sabotage') {
    const target = Object.entries(S.factions).filter(([, f]) => !f.fate).sort((a, b) => b[1].power - a[1].power)[0];
    if (target) { hitFaction(S, target[0], 6, out.text); out.faction = target[0]; }
  } else if (T.now === 'gold') {
    const g = 30 * (S.circleIdx + 1);
    S.gold += g; out.gold = g;
  } else if (T.now === 'brands') {
    for (const c of S.captives) c.brand = Math.max(0, c.brand - 5);
  } else if (T.now === 'feed') {
    for (const b of S.menagerie) b.fed = true;
  } else if (T.now === 'reagents') {
    const keys = Object.keys(REAGENTS);
    for (let i = 0; i < 2; i++) { const r = pick(keys, rng); S.reagents[r] = (S.reagents[r] || 0) + 1; }
  }
  addChronicle(S, `Vesper drew ${T.name}.`);
  return out;
}

// Today's omen effects for an expedition (or {}).
export function omenRun(S) {
  return S.omen && S.omen.day === S.day ? (TAROT[S.omen.card].run || {}) : {};
}
export function omenToday(S, now) { return !!(S.omen && S.omen.day === S.day && TAROT[S.omen.card].now === now); }

// Market prices after perks and omens.
export function priceOf(S, base) {
  let p = base;
  if (perk(S, 'market')) p *= 0.75;
  if (omenToday(S, 'discount')) p *= 0.7;
  return Math.max(1, Math.round(p));
}

// A fixed story rift (intro arcs): explicit enemy groups per chamber.
export function storyRift(id, S = null) {
  const R = STORY_RIFTS[id];
  const rIdx = Math.max(R.rankIdx, S ? S.circleIdx : 0);
  return { ...R, id, rank: RANKS[rIdx], rankIdx: rIdx, story: true, seed: (Math.random() * 2 ** 31) | 0 };
}

export const STORY_RIFTS = {
  drowned_stacks: { name: 'The Drowned Stacks', rank: 'Ash', rankIdx: 0, biome: 'drowned', modifier: 'none',
    script: [{ type: 'fight', mobs: ['grave_spider'] }, { type: 'boss', mobs: ['coven_envoy'] }],
    onClear: 'vesper_pact', guests: ['vesper'] },
  binding_trap: { name: 'The Binding Trap', rank: 'Ash', rankIdx: 0, biome: 'market', modifier: 'none', faction: 'coven',
    script: [{ type: 'fight', mobs: ['coven_trapper', 'lesser_imp'] }, { type: 'boss', mobs: ['coven_trapper', 'coven_trapper', 'ash_witch'] }],
    onClear: 'rue_terms' },
  kneeling_sword: { name: 'The Kneeling Sword', rank: 'Ash', rankIdx: 0, biome: 'vigil', modifier: 'vigil', faction: 'vigil',
    script: [{ type: 'fight', mobs: ['vigil_knight', 'vigil_cantor'] }, { type: 'boss', mobs: ['isolde_duel'], duel: true }],
    onClear: 'isolde_kneel' },
  dawnward_stand: { name: 'The Dawnward Stand', rank: 'Thorn', rankIdx: 3, biome: 'glade', modifier: 'charmed', faction: 'lodge',
    script: [{ type: 'boss', mobs: ['dw_erin', 'dw_sakura', 'dw_shiro', 'dw_yuki'] }],
    onClear: 'dawnward_kneel' },
  oathbreaker: { name: 'Six Riders', rank: 'Ash', rankIdx: 0, biome: 'vigil', modifier: 'vigil', faction: 'vigil',
    script: [{ type: 'boss', mobs: ['vigil_rider', 'vigil_rider', 'vigil_rider'] }, { type: 'boss', mobs: ['vigil_rider', 'vigil_rider', 'vigil_marshal'] }],
    onClear: 'isolde_rune4', guests: ['isolde'] },
};

// --- dungeon path & enemy scaling --------------------------------------------

const MOD = id => GATE_MODIFIERS.find(m => m.id === id) || {};

function mobPool(gate, L) {
  return gate.rankIdx >= 2 && L.mobsLate ? L.mobs.concat(L.mobsLate) : L.mobs;
}

export function buildDungeon(gate, S = null) {
  const rng = mulberry32(gate.seed);
  if (gate.script) {
    return gate.script.map((n, i) => ({
      type: n.type, duel: !!n.duel,
      group: n.mobs.map(id => scaleEnemy(id, gate, i, n.type === 'boss', rng)),
    }));
  }
  const L = LOCATIONS[gate.loc];
  const mod = MOD(gate.modifier);
  const om = S ? omenRun(S) : {};
  const eliteBonus = (mod.eliteBonus || 0) + (om.eliteBonus || 0);
  const tb = (mod.treasureBonus || 0) + (om.treasureBonus || 0);
  const nodes = [];
  for (let i = 0; i < gate.rooms; i++) {
    nodes.push({ type: 'fight', group: makeGroup(gate, L, i, rng, eliteBonus) });
    if (i < gate.rooms - 1) {
      const r = rng();
      if (r < 0.24) nodes.push(makeBranch(gate, L, i, rng));
      else if (r < 0.42 + tb) nodes.push({ type: 'treasure' });
      else if (r < 0.62 + tb) nodes.push({ type: 'event', roll: rng() });
      else if (r < 0.74 + tb) nodes.push({ type: 'rest' });
    }
  }
  const lt = S && !gate.recursion ? pendingLieutenant(S, gate.loc) : null;
  nodes.push({ type: 'boss', lieutenant: lt, group: makeBossGroup(gate, L, rng, lt) });
  return nodes;
}

function makeBranch(gate, L, depth, rng) {
  const risky = { type: 'fight', elite: true, group: makeEliteGroup(gate, L, depth, rng) };
  const r = rng();
  const safe = r < 0.4 ? { type: 'treasure' } : r < 0.75 ? { type: 'event', roll: rng() } : { type: 'rest' };
  return { type: 'branch', options: [risky, safe] };
}

function makeGroup(gate, L, depth, rng, eliteBonus) {
  const n = Math.min(4, 2 + Math.floor(rng() * 2));
  const pool = mobPool(gate, L);
  const group = [];
  let eliteRolled = false;
  for (let i = 0; i < n; i++) {
    const elite = !eliteRolled && rng() < eliteChance(gate.rankIdx) + eliteBonus ? pickElite(rng) : null;
    if (elite) eliteRolled = true;
    group.push(scaleEnemy(pick(pool, rng), gate, depth, false, rng, elite));
  }
  return group;
}

function makeEliteGroup(gate, L, depth, rng) {
  const pool = mobPool(gate, L);
  const group = [scaleEnemy(pick(pool, rng), gate, depth + 1, false, rng, pickElite(rng))];
  const adds = 1 + Math.floor(rng() * 2);
  for (let i = 0; i < adds; i++) group.push(scaleEnemy(pick(pool, rng), gate, depth, false, rng));
  return group;
}

function pickElite(rng) { return pick(Object.keys(ELITES), rng); }

function makeBossGroup(gate, L, rng, lieutenant) {
  const bossId = lieutenant || pick(L.bosses, rng);
  const group = [scaleEnemy(bossId, gate, gate.rooms, true, rng)];
  const adds = L.lair ? 2 : gate.rankIdx >= 4 ? 2 : gate.rankIdx >= 2 ? 1 : 0;
  for (let i = 0; i < adds; i++) group.push(scaleEnemy(pick(mobPool(gate, L), rng), gate, gate.rooms - 1, false, rng));
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
  for (const g of gate.guests || []) {
    if (!S.heroes[g]) S.heroes[g] = { level: Math.max(HEROES[g].startLevel, S.heroes.player.level), xp: 0, gear: { weapon: null, armor: null, charm: null }, guest: true };
    if (!ids.includes(g)) ids.push(g);
  }
  ids = ids.slice(0, 5);
  const party = {};
  for (const id of ids) { const st = heroStats(S, id); party[id] = { hp: st.hp, mp: st.mp }; }
  const baitBeasts = (S.inventory.beast_bait || 0) > 0;
  if (baitBeasts) S.inventory.beast_bait--;
  const om = omenRun(S);
  S.run = {
    gate, nodes: buildDungeon(gate, S), nodeIdx: 0,
    party, partyIds: ids,
    loot: { gold: 0, xp: 0, gear: [], items: {} },
    captures: [],          // sealed this run; committed only on a clear
    slain: [],             // named/leader defIds killed this run
    yielded: [],           // defIds that yielded
    hits: {},              // faction → kills this run
    favorUsed: false,
    bait: baitBeasts,
    omen: om,
    tempBuff: om.firedUp ? 'mag' : null,
  };
}

// Captured unit → pending record (combat calls this on a successful seal).
export function recordCapture(S, unit) {
  S.run.captures.push({
    defId: unit.defId, name: unit.name, captureType: unit.captureType,
    elite: unit.elite, faction: unit.faction, family: unit.family, named: unit.named,
  });
}
// Combat reports deaths so the factions feel them.
export function recordKill(S, unit) {
  if (!S.run) return;
  if (unit.faction) S.run.hits[unit.faction] = (S.run.hits[unit.faction] || 0) + 1;
  if (unit.named || ENEMIES[unit.defId]?.boss) S.run.slain.push(unit.defId);
}
export function recordYield(S, unit) { if (S.run) S.run.yielded.push(unit.defId); }

const LEADER_OF = Object.fromEntries(Object.entries(FACTIONS).map(([fid, f]) => [f.leader, fid]));

export function endRun(S, outcome) {
  const run = S.run;
  const gate = run.gate;
  const mod = MOD(gate.modifier);
  const om = run.omen || {};
  const result = { outcome, gate, gold: 0, xp: 0, gp: 0, gear: run.loot.gear, items: run.loot.items, levelUps: [], promos: [], captured: [], freed: [], power: [], fates: [] };
  result.gold = Math.round(run.loot.gold * (mod.goldMult || 1) * (om.goldMult || 1));
  const xpEarners = run.partyIds.length;
  const smallPartyBonus = 1 + Math.max(0, 4 - xpEarners) * 0.35;
  result.xp = Math.round(run.loot.xp * smallPartyBonus * (mod.xpMult || 1) * (om.xpMult || 1));
  result.partySize = xpEarners;
  const log = [];

  // kills always count — the dead stay dead
  for (const [fid, n] of Object.entries(run.hits)) hitFaction(S, fid, n * POWER.kill, log);

  if (outcome === 'clear') {
    result.gp = Math.round((gate.story ? GATE_GP[gate.rank] * 0.5 : GATE_GP[gate.rank] + (run.loot.gpBonus || 0)) * (om.infamyMult || 1));
    S.stats.clears++;
    for (const c of run.captures) {
      result.captured.push(commitCapture(S, c));
      if (c.faction) hitFaction(S, c.faction, POWER.capture, log);
    }
    if (gate.onClear) S.queue.push(gate.onClear);
    // the holding itself falls
    const fid = gate.faction || (gate.loc && LOCATIONS[gate.loc] && LOCATIONS[gate.loc].faction);
    if (fid && !gate.lair) hitFaction(S, fid, POWER.clear, log);
    if (gate.loc) S.visits[gate.loc] = (S.visits[gate.loc] || 0) + 1;
    // lieutenants
    const ltNode = run.nodes.find(n => n.lieutenant);
    if (ltNode) {
      const id = ltNode.lieutenant;
      const fate = run.captures.some(c => c.defId === id) ? 'captured' : run.yielded.includes(id) ? 'yielded' : 'slain';
      S.lieutenants[id] = fate;
      const lfid = ENEMIES[id].faction;
      if (lfid) hitFaction(S, lfid, fate === 'captured' ? POWER.lieutenantCapture : POWER.lieutenantDefeat, log);
      S.queue.push(`lt_${id}_${fate}`);
      result.fates.push({ id, fate });
    }
    // leaders
    if (gate.lair) {
      const L = LOCATIONS[gate.loc];
      const leader = FACTIONS[L.faction].leader;
      const fid = LEADER_OF[leader];
      const f = S.factions[fid];
      if (run.captures.some(c => c.defId === leader)) f.fate = 'subjugated';
      else if (run.yielded.includes(leader)) f.fate = 'humbled';
      else { f.fate = 'shattered'; addCorruption(S, 5); }
      f.power = 0;
      S.queue.push(`dominate_${fid}`);
      result.fates.push({ id: leader, fate: f.fate, faction: fid });
      addChronicle(S, `${FACTIONS[fid].name} fell: ${FACTIONS[fid].leaderName} ${f.fate === 'subjugated' ? 'was bound into the Undercroft' : f.fate === 'humbled' ? 'was humbled and yielded' : 'was slain'}.`);
      if (gate.loc === 'ashen_heart') { S.cleared = true; S.clearedDay = S.day; }
    }
  } else {
    result.freed = run.captures.map(c => c.name);
    if (outcome === 'retreat') { result.gold = Math.round(result.gold * 0.6); S.stats.retreats++; }
    else { result.gold = 0; result.xp = Math.round(result.xp * 0.5); S.stats.wipes++; }
  }
  result.power = log;

  S.gold += result.gold;
  for (const id of run.partyIds) result.levelUps.push(...gainXp(S, id, result.xp));
  for (const id of run.partyIds) if (S.heroes[id]?.guest) delete S.heroes[id].guest;
  for (const g of result.gear) S.gearBag.push(g);
  for (const [it, n] of Object.entries(result.items)) S.inventory[it] = (S.inventory[it] || 0) + n;
  if (result.gp) result.promos = addInfamy(S, result.gp);
  if (gate.recursion && outcome === 'clear') S.ngPlus = (S.ngPlus || 0) + 1;
  if (om.campScene) result.campScene = true;

  S.run = null;
  advanceDay(S);
  save(S);
  return result;
}

// A day passes: dispatches return, cells and pens tick, factions recover
// (or pay tribute), and Vesper shuffles the deck.
export function advanceDay(S) {
  S.day++;
  resolveDispatches(S);
  const log = [];
  log.push(...advanceReclamation(S));
  log.push(...tendMenagerie(S));
  factionNight(S, log);
  tribeNight(S, log);
  S.dayLog = log;
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
    knows: SECRETS.coven.slice(), convert: 'cinder', leader: true },
  aldric: { id: 'cap_aldric', name: 'Aldric', title: 'Lord-Commander of the Last Vigil', faction: 'vigil',
    brand: 100, resolve: 95, regard: -40, traits: ['proud', 'stubborn'], hero: 'aldric', leader: true,
    knows: SECRETS.vigil.slice() },
  proprietor: { id: 'cap_proprietor', name: 'The Proprietor', title: 'Owner of the Demon Market', faction: 'market',
    brand: 100, resolve: 85, regard: -10, traits: ['greedy', 'proud'], hero: 'proprietor', leader: true,
    knows: SECRETS.market.slice() },
  hale: { id: 'cap_hale', name: 'Hale', title: 'Guildmaster of the Hunters\' Lodge', faction: 'lodge',
    brand: 100, resolve: 80, regard: -30, traits: ['stubborn', 'doubting'], hero: 'hale', leader: true,
    knows: SECRETS.lodge.slice() },
};
// Character packs register their named captives here.
export function registerNamedCaptive(key, def) { NAMED_CAPTIVES[key] = def; }
// Story events can put a named captive straight into the cells.
export function addNamedCaptive(S, key) {
  if (S.captives.some(c => c.named === key)) return null;
  const cap = makeCaptive(S, { defId: key, named: key, faction: NAMED_CAPTIVES[key].faction });
  S.captives.push(cap);
  S.flags.undercroft_open = true;
  return cap;
}

function makeCaptive(S, c) {
  const named = c.named && NAMED_CAPTIVES[c.named];
  if (named) {
    return { id: named.id, defId: c.defId, name: named.name, title: named.title, faction: named.faction,
      brand: named.brand, resolve: named.resolve, regard: named.regard, traits: named.traits.slice(),
      knows: named.knows.slice(), learned: [], wardenId: null, days: 0, relapse: false,
      bargainPts: 0, otherPts: 0, mercies: 0, visitedDay: 0, tonicDays: 0, named: c.named, hooked: false, leader: !!named.leader };
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
  const traitIds = Object.keys(BEAST_TRAITS).filter(t => !BEAST_TRAITS[t].imbued);
  if (c.named === 'pale_stag') traitsOverride = ['lustrous', 'hardy'];
  const traits = traitsOverride || (c.elite ? [pick(traitIds), pick(traitIds)].filter((t, i, a) => a.indexOf(t) === i) : [pick(traitIds)]);
  return { id: uid('bst_'), defId: c.defId, family: fam, named: c.named || null,
    name: c.named === 'pale_stag' ? 'The Pale Stag' : c.named === 'vex' ? 'The Watcher' : pick(BEAST_NAMES),
    kind: ENEMIES[c.defId]?.name || BEAST_FAMILIES[fam].name,
    // new arrivals come in fed (on whatever they were caught chewing) so the first night is safe
    tame: c.elite ? 15 : 25, hunger: 20, traits, yieldId: BEAST_FAMILIES[fam].reagent, fed: true, born: S.day,
    family2: c.family2 || null, yieldId2: c.family2 ? BEAST_FAMILIES[c.family2].reagent : null };
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
      if (cap.faction === 'coven' && cap.named !== 'cinder' && leaderInCells(S, 'coven')) rate *= 1.25;
      const before = cap.brand;
      cap.brand = Math.max(0, cap.brand - Math.round(rate));
      cap.otherPts += before - cap.brand;
      cap.resolve = Math.max(0, cap.resolve - 2);
      if (style.hookChance && !cap.hooked && Math.random() < style.hookChance) { cap.hooked = true; log.push(`${cap.name} has started owing Rue small things. Rue is delighted.`); }
      if (style.weeklySecret && cap.days % 7 === 0) { const s = revealSecret(cap); if (s) log.push(`Vesper's notes on ${cap.name}: "${s}"`); }
      if (style.noRelapse) cap.isoldeWatched = true;
      if (badPair(wid, cap) && !noBreakout(S, cap) && Math.random() < cap.resolve / 100 * 0.03) { breakout(S, cap, log); continue; }
    } else {
      cap.brand = Math.min(100, cap.brand + 2);
      if (!noBreakout(S, cap) && Math.random() < cap.resolve / 100 * 0.06) { breakout(S, cap, log); continue; }
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

// Leaders never escape (they have the most to lose by being seen to run),
// and Aldric in the cells keeps his knights in line.
function noBreakout(S, cap) {
  return !!(cap.leader || (cap.faction === 'vigil' && leaderInCells(S, 'vigil')));
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
  let base = 30 * (S.circleIdx + 1);
  if (isAlly(S, 'rue')) base *= 0.7;
  if (leaderInCells(S, 'market')) base *= 0.5;
  return Math.round(base);
}

// Testimony needs a converted ally from the same faction.
export function testimonyWitness(S, cap) {
  const chain = cap.named && NAMED_CAPTIVES[cap.named] && NAMED_CAPTIVES[cap.named].witness;
  if (chain && isAlly(S, chain)) return chain;
  const conv = Object.entries(S.converts || {}).find(([id, d]) => isAlly(S, id) && d.faction === cap.faction)?.[0];
  if (conv) return conv;
  // reclaimed named characters (pack heroes, leaders) can testify too
  return Object.values(NAMED_CAPTIVES).find(n => n.hero && n.faction === cap.faction && isAlly(S, n.hero))?.hero || null;
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
    const chain = cap.named && NAMED_CAPTIVES[cap.named] && NAMED_CAPTIVES[cap.named].witness === w;
    const amt = Math.round(25 * traitMod(cap, 'testimonyMult') * (chain ? 2 : 1) * (w === 'mira_vane' ? 1.5 : 1));
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
    if (cap.leader) { const fid = Object.keys(FACTIONS).find(f => f === cap.faction); if (fid && S.factions[fid]) S.factions[fid].fate = 'sworn'; }
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
  college: { cls: 'Defrocked Adept', role: 'caster', base: { hp: 88, mp: 60, atk: 6, mag: 17, def: 7, res: 14, agi: 11, luk: 9 }, growth: { hp: 7, mp: 5, atk: 0.7, mag: 2.4, def: 1.0, res: 1.9, agi: 1.2, luk: 1 },
    skills: { 1: 'ink_lash', 2: 'shadow_lash', 8: 'gloom_brand', 16: 'umbral_coil' }, model: 'college', variant: 'adept', color: '#d8b04a' },
  lodge: { cls: 'Lapsed Hunter', role: 'striker', base: { hp: 105, mp: 30, atk: 15, mag: 5, def: 10, res: 8, agi: 13, luk: 10 }, growth: { hp: 9, mp: 3, atk: 2.2, mag: 0.6, def: 1.3, res: 1.1, agi: 1.6, luk: 1.1 },
    skills: { 1: 'sunder_strike', 2: 'tail_trip', 8: 'crushing_blow', 16: 'umbral_cut' }, model: 'hunter', variant: 'hunter', color: '#8ab85a' },
  market: { cls: 'Broker', role: 'support', base: { hp: 95, mp: 44, atk: 10, mag: 12, def: 8, res: 10, agi: 12, luk: 14 }, growth: { hp: 8, mp: 4, atk: 1.4, mag: 1.6, def: 1.1, res: 1.3, agi: 1.4, luk: 1.5 },
    skills: { 1: 'stolen_spark', 2: 'encourage', 8: 'tail_trip', 16: 'war_banner' }, model: 'cultist', variant: null, color: '#d8a04a' },
};
const NAMED_CONVERTS = {
  calla: { name: 'Calla', epithet: 'the Envoy Who Stayed', desc: 'Calla, once Envoy of the Ashen Coven — the first one who never went home. Drew the short straw on purpose so her sister wouldn\'t. Studied two desks behind Vesper, once, under Mother Cinder. Wears your colors now and pretends it\'s practical.', color: '#e8a87a' },
  cinder: { name: 'Mother Cinder', epithet: 'Unbranded', desc: 'The Coven\'s matriarch, the brand burned out of her own heart at last. She is very quiet now. She watches Vesper the way a teacher watches a student who surpassed her — and is learning, slowly, to be glad of it.', color: '#ff7a4a' },
};

function convertToHero(S, cap) {
  // named captives with their own hero sheet (leaders, pack characters)
  const nc = cap.named && NAMED_CAPTIVES[cap.named];
  if (nc && nc.hero && HEROES[nc.hero]) return nc.hero;
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
      if (handler === 'lysandre' && b.family2) n += 1;
      S.reagents[b.yieldId] = (S.reagents[b.yieldId] || 0) + n;
      S.stats.reagentsProduced = (S.stats.reagentsProduced || 0) + n + (b.yieldId2 ? 1 : 0);
      log.push(`${b.name} the ${b.kind.toLowerCase()} yields ${n} ${REAGENTS[b.yieldId].name.toLowerCase()}.`);
      if (b.yieldId2) { S.reagents[b.yieldId2] = (S.reagents[b.yieldId2] || 0) + 1; log.push(`…and 1 ${REAGENTS[b.yieldId2].name.toLowerCase()}, from its other bloodline.`); }
    } else {
      b.hunger = Math.min(100, b.hunger + Math.round(35 * beastTrait(b, 'hungerMult')));
      if (!b.traits.includes('codex_touched')) b.tame = Math.max(0, b.tame - (docile ? 3 : 8));
      if (b.tame < 10 && b.hunger >= 70 && !docile && !b.traits.includes('hardy') && Math.random() < 0.4) {
        S.menagerie = S.menagerie.filter(x => x !== b);
        delete S.handlers[b.id];
        log.push(`${b.name} slipped its pen in the night, hungry and wild.`);
        continue;
      }
    }
    b.fed = false;
    // Vex: a beast that decides it would rather be a person
    if (b.named === 'vex' && b.tame >= 50) {
      S.menagerie = S.menagerie.filter(x => x !== b);
      delete S.handlers[b.id];
      S.queue.push('vex_promotes');
    }
  }
  // eggs hatch after three days
  for (const egg of [...S.eggs]) {
    if (S.day >= egg.hatchDay) {
      S.eggs = S.eggs.filter(e => e !== egg);
      if (S.menagerie.length >= S.pens) { log.push(`An egg hatched — but there was no free pen, and the little thing wandered off.`); continue; }
      const b = makeBeast(S, { family: egg.family, family2: egg.family2, defId: egg.defId }, egg.traits);
      if (egg.family2) {
        b.kind = egg.variant;
        if (!S.flags.first_hybrid) { S.flags.first_hybrid = true; S.queue.push('lysandre_arrives'); }
      }
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
  const cross = a && b && (a.traits.includes('crossblooded') || b.traits.includes('crossblooded'));
  return !!(a && b && a !== b && (a.family === b.family || cross) && a.tame >= 60 && b.tame >= 60 && !a.bredDay && !b.bredDay
    && S.menagerie.length + S.eggs.length < S.pens + 1);
}
export function breed(S, aId, bId) {
  if (!canBreed(S, aId, bId)) return null;
  const a = S.menagerie.find(x => x.id === aId), b = S.menagerie.find(x => x.id === bId);
  // imbued (Codex-Touched) blood is passed on as Crossblooded, never as the imbuing itself
  const inherit = t => (BEAST_TRAITS[t].imbued ? 'crossblooded' : t);
  const traits = [inherit(pick(a.traits)), inherit(pick(b.traits))].filter((t, i, arr) => arr.indexOf(t) === i);
  const hybrid = a.family !== b.family;
  if (hybrid && !traits.includes('crossblooded')) traits.push('crossblooded'); // hybrids carry the mixing blood on
  const variant = hybrid ? `${BEAST_FAMILIES[a.family].name} × ${BEAST_FAMILIES[b.family].name.toLowerCase()}` : traits.map(t => BEAST_TRAITS[t].name).join('-');
  const egg = { family: a.family, family2: hybrid ? b.family : null, defId: a.defId, traits, variant, hatchDay: S.day + 3 };
  S.eggs.push(egg);
  a.bredDay = b.bredDay = S.day;
  return egg;
}

// Imbue a tame beast with your mark: Codex-Touched and Crossblooded.
export function imbueCost(S) { return 40 * (S.circleIdx + 1); }
export function canImbue(S, beastId) {
  const b = S.menagerie.find(x => x.id === beastId);
  return !!(b && b.tame >= 80 && !b.traits.includes('codex_touched') && S.gold >= imbueCost(S));
}
export function imbueBeast(S, beastId) {
  if (!canImbue(S, beastId)) return false;
  const b = S.menagerie.find(x => x.id === beastId);
  S.gold -= imbueCost(S);
  b.traits = b.traits.filter(t => t !== 'crossblooded').concat(['codex_touched', 'crossblooded']);
  addCorruption(S, 1);
  addChronicle(S, `${b.name} was imbued with the warlock's mark.`);
  return true;
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
  if (pactId === 'wyrm_mantle' && S.circleIdx < 2) return false;
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
  } else if (p.cost === 'form') {
    S.flags.pact_wyrm_mantle = true;
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
  if (perk(S, 'lodge')) comp += 0.15;
  const chance = clamp(0.5 + (avg / bench - 1) * 1.1 + comp, 0.05, 0.95);
  return { chance, comp, roles, avg: Math.round(avg), bench };
}

export function sendDispatch(S, gate, ids) {
  const { chance } = dispatchForecast(S, gate, ids);
  S.dispatch.push({
    id: uid('m'),
    gate: { rank: gate.rank, rankIdx: gate.rankIdx, name: gate.name, biome: gate.biome, modifier: gate.modifier, faction: gate.faction || null },
    team: ids.slice(), day: S.day, chance,
  });
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
      if (m.gate.faction) hitFaction(S, m.gate.faction, Math.round(POWER.clear / 2));
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
