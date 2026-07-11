// ============================================================
// GATEBOUND — game state, saves, progression, gate spawning
// ============================================================

import {
  RANKS, RANK_UP_GP, GATE_GP, XP_MULT, HEROES, heroStatsAt, heroSkillsAt,
  xpToNext, BIOMES, GATE_ROOMS, GATE_MODIFIERS, MONARCH_GATE, ENEMIES, makeGear, AFFIXES,
  ELITES, ELITE_XP_MULT, ELITE_GOLD_MULT, eliteChance, ROLE_INFO, DISPATCH_BENCHMARK,
  RIVAL_PARTIES,
} from './data.js';

export const SAVE_KEY = 'gatebound_save_v1';

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

export function newGame(playerName) {
  const S = {
    v: 1,
    name: (playerName || 'Rook').slice(0, 14),
    day: 1,
    rankIdx: 0,
    gp: 0,
    gold: 120,
    seed: (Math.random() * 2 ** 31) | 0,
    seen: {},
    flags: {},
    queue: [],                       // pending auto story events
    bond: { sakura: 0, erin: 0, shiro: 0, yuki: 0 },
    heroes: {},
    inventory: { potion: 3, ether: 1 },
    gearBag: [],
    gates: [],
    run: null,                       // active dungeon run
    stats: { clears: 0, kills: 0, retreats: 0, wipes: 0, tone: {} },
    legacy: { cycle: 0, xpBoost: 0 },  // NG+ cycles: carried across restarts
    cleared: false,
    clearedDay: 0,                   // day the Monarch fell (recruit arrivals key off it)
    ngPlus: 0,                       // Recursion depth cleared post-Monarch
    mastery: {},                     // heroId -> { skillId: use count }
    autoSkill: {},                   // heroId -> preferred skill for auto-battle
    recruited: [],                   // post-clear guild recruits (hero ids)
    custom: {},                      // Character Forge hero definitions
    dispatch: [],                    // missions in the field
    dispatchReports: [],             // resolved missions awaiting review
    settings: { volume: 0.6, music: true, textFast: false, spice: 'gentle', outfit: 'adventure', autoBattle: false },
  };
  for (const id of ['player', 'erin', 'sakura', 'shiro']) {
    S.heroes[id] = {
      level: HEROES[id].startLevel,
      xp: 0,
      gear: { weapon: null, armor: null, charm: null },
    };
  }
  rollGates(S);
  return S;
}

// --- persistence ----------------------------------------------------------

export function save(S) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { /* private mode */ }
}
// Fill in fields added after a save was first written, so old saves keep working.
function ensureShape(S) {
  if (!S) return S;
  if (S.bond && !('yuki' in S.bond)) S.bond.yuki = 0;
  if (S.ngPlus == null) S.ngPlus = 0;
  if (!S.flags) S.flags = {};
  if (!S.mastery) S.mastery = {};
  if (!S.autoSkill) S.autoSkill = {};
  if (!S.legacy) S.legacy = { cycle: 0, xpBoost: 0 };
  if (S.stats && !S.stats.tone) S.stats.tone = {};
  if (!S.recruited) S.recruited = [];
  if (!S.custom) S.custom = {};
  if (!S.dispatch) S.dispatch = [];
  if (!S.dispatchReports) S.dispatchReports = [];
  if (S.cleared && S.clearedDay == null) S.clearedDay = S.day;
  if (S.settings) {
    if (!S.settings.spice) S.settings.spice = 'gentle';
    if (!S.settings.outfit) S.settings.outfit = 'adventure';
  }
  return S;
}
export function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const S = JSON.parse(raw);
    return S && S.v === 1 ? ensureShape(S) : null;
  } catch (e) { return null; }
}
export function wipeSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }
export function exportSave(S) { return btoa(unescape(encodeURIComponent(JSON.stringify(S)))); }
export function importSave(str) {
  try {
    const S = JSON.parse(decodeURIComponent(escape(atob(str.trim()))));
    return S && S.v === 1 ? ensureShape(S) : null;
  } catch (e) { return null; }
}

// --- derived stats ---------------------------------------------------------

export function heroStats(S, id) {
  const h = S.heroes[id];
  const def = HEROES[id];
  const level = h ? h.level : def.startLevel;
  const s = heroStatsAt(def, level);
  // The System reclassifies Yuki once he formally joins — from carried to carrying.
  if (id === 'yuki' && S.flags && S.flags.yuki_member) {
    for (const k of ['hp', 'mp', 'atk', 'mag', 'def', 'res', 'agi']) s[k] = Math.round(s[k] * 1.4);
  }
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

export function heroSkills(S, id) {
  const h = S.heroes[id];
  return heroSkillsAt(HEROES[id], h ? h.level : HEROES[id].startLevel);
}

// XP: returns array of level-up records {id, level, gains}
export function gainXp(S, id, amount) {
  const h = S.heroes[id];
  if (!h) return [];
  // System passive (+10% for the player) plus the NG+ legacy boost:
  // the player carries it in full, the rest of the party at half.
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

export function addBond(S, girl, n) {
  if (!(girl in S.bond)) return;
  S.bond[girl] = Math.max(0, Math.min(10, S.bond[girl] + n));
}

// Ensure a recruited Yuki has a hero record (used by menus before his first run).
export function ensureYuki(S) {
  if (S.flags && S.flags.yuki_member && !S.heroes.yuki) {
    const lvl = Math.max((S.heroes.player?.level || 1) - 2, 10 + S.rankIdx * 4);
    S.heroes.yuki = { level: lvl, xp: 0, gear: { weapon: null, armor: null, charm: null } };
  }
}

export function roster(S) {
  const base = S.flags && S.flags.yuki_member
    ? ['player', 'erin', 'sakura', 'shiro', 'yuki']
    : ['player', 'erin', 'sakura', 'shiro'];
  return base.concat((S.recruited || []).filter(id => HEROES[id] && S.heroes[id]));
}

// Formally sign a recruit: hero record + roster entry.
export function joinRecruit(S, id) {
  const def = HEROES[id];
  if (!def || !def.recruit || S.recruited.includes(id)) return;
  const lvl = Math.max(def.startLevel, (S.heroes.player?.level || 1) - 2);
  S.heroes[id] = { level: lvl, xp: 0, gear: { weapon: null, armor: null, charm: null } };
  S.recruited.push(id);
}

// Ids currently away on a dispatch mission.
export function dispatchedIds(S) {
  const out = new Set();
  for (const m of S.dispatch || []) for (const id of m.team) out.add(id);
  return out;
}

// --- skill mastery -----------------------------------------------------------
// Skills rank up with use: each rank adds power; rank 5 trims MP costs.

export const MASTERY_THRESHOLDS = [0, 10, 25, 50, 90, 150];
export const MASTERY_POWER = 0.05;   // +5% skill power per rank
export const MASTERY_MP_DISCOUNT = 0.8; // at max rank

export function masteryRank(S, heroId, skillId) {
  const uses = S.mastery?.[heroId]?.[skillId] || 0;
  let rank = 0;
  for (let i = MASTERY_THRESHOLDS.length - 1; i >= 0; i--) {
    if (uses >= MASTERY_THRESHOLDS[i]) { rank = i; break; }
  }
  return rank;
}

export function masteryUses(S, heroId, skillId) {
  return S.mastery?.[heroId]?.[skillId] || 0;
}

// Returns the new rank if this use crossed a threshold, else 0.
export function bumpMastery(S, heroId, skillId) {
  if (!S.mastery) S.mastery = {};
  const m = S.mastery[heroId] || (S.mastery[heroId] = {});
  const before = masteryRank(S, heroId, skillId);
  m[skillId] = (m[skillId] || 0) + 1;
  const after = masteryRank(S, heroId, skillId);
  return after > before ? after : 0;
}

// --- NG+ cycles ---------------------------------------------------------------
// Restart the story keeping every piece of gear (bag + equipped), skill
// mastery, and auto-skill picks. The System's boost grows with how much
// the ending cycle actually accomplished: recursions, bonds, levels.

export function legacyBoostFor(S) {
  const bondTotal = Object.values(S.bond || {}).reduce((a, b) => a + b, 0);
  const levelTotal = Object.values(S.heroes || {}).reduce((a, h) => a + (h.level || 0), 0);
  const prevCycles = (S.legacy && S.legacy.cycle) || 0;
  const boost = 0.25
    + 0.15 * prevCycles
    + 0.10 * (S.ngPlus || 0)
    + 0.01 * bondTotal
    + 0.002 * levelTotal;
  return Math.min(2.5, Math.round(boost * 100) / 100);
}

export function newGamePlus(S) {
  const boost = legacyBoostFor(S);
  const carried = [...S.gearBag];
  for (const h of Object.values(S.heroes)) {
    for (const slot of ['weapon', 'armor', 'charm']) {
      if (h.gear[slot]) carried.push(h.gear[slot]);
    }
  }
  const N = newGame(S.name);
  N.gearBag = carried;
  N.mastery = S.mastery || {};
  N.autoSkill = S.autoSkill || {};
  N.settings = S.settings;
  N.custom = S.custom || {};  // forged souls persist across cycles (re-summon at the Forge)
  N.legacy = { cycle: ((S.legacy && S.legacy.cycle) || 0) + 1, xpBoost: boost };
  return N;
}

// --- guild rank ------------------------------------------------------------

export function addGp(S, amount) {
  S.gp += amount;
  const promos = [];
  while (S.rankIdx < RANKS.length - 1) {
    const need = RANK_UP_GP[RANKS[S.rankIdx]];
    if (S.gp < need) break;
    S.gp -= need;
    S.rankIdx++;
    promos.push('promo_' + RANKS[S.rankIdx]);
  }
  for (const p of promos) S.queue.push(p);
  return promos;
}

export function gpNeeded(S) {
  return S.rankIdx >= RANKS.length - 1 ? null : RANK_UP_GP[RANKS[S.rankIdx]];
}

// --- gate generation --------------------------------------------------------

const GATE_ADJ2 = ['Cracked', 'Silent', 'Roaring', 'Veiled', 'Broken', 'Waning'];

export function rollGates(S) {
  const rng = mulberry32(S.seed ^ (S.day * 2654435761));
  const maxIdx = Math.min(S.rankIdx + 1, RANKS.length - 1);
  const offers = [];

  // Always offer a spread — two lower "grind" gates, gates at rank, and a stretch —
  // so higher-rank players can farm easy dungeons for gold/XP without heavy item use.
  const targets = [
    Math.max(0, S.rankIdx - 2),
    Math.max(0, S.rankIdx - 1),
    S.rankIdx,
    S.rankIdx,
    Math.min(maxIdx, S.rankIdx + 1),
  ];

  targets.forEach((rIdx, i) => {
    const rank = RANKS[rIdx];

    const biomes = Object.entries(BIOMES).filter(([, b]) => RANKS.indexOf(b.minRank) <= rIdx);
    const [biomeId, biome] = biomes[Math.floor(rng() * biomes.length)];

    const pat = biome.names[Math.floor(rng() * biome.names.length)];
    const name = pat
      .replace('{adj}', (rng() < 0.7 ? biome.adj : GATE_ADJ2)[Math.floor(rng() * 4) % 4] || biome.adj[0])
      .replace('{noun}', biome.noun[Math.floor(rng() * biome.noun.length)]);

    const totalW = GATE_MODIFIERS.reduce((a, m) => a + m.weight, 0);
    let roll = rng() * totalW, modifier = 'none';
    for (const m of GATE_MODIFIERS) { roll -= m.weight; if (roll <= 0) { modifier = m.id; break; } }

    offers.push({
      id: 'gate_' + S.day + '_' + i,
      rank, rankIdx: rIdx, biome: biomeId, name, modifier,
      rooms: GATE_ROOMS[rank],
      seed: (rng() * 2 ** 31) | 0,
    });
  });

  // A rival party in trouble: sometimes a distress gate hits the board.
  if (S.rankIdx >= 2 && rng() < 0.25) {
    offers.splice(1, 0, makeRescueGate(S, rng));
  }

  if (S.rankIdx === RANKS.length - 1 && !S.cleared) {
    offers.unshift({ ...MONARCH_GATE, rankIdx: 5, seed: (rng() * 2 ** 31) | 0 });
  }
  // Post-Monarch: an escalating Recursion gate is always on offer.
  if (S.cleared) {
    offers.unshift(makeRecursionGate(S, (S.ngPlus || 0) + 1, rng));
  }
  S.gates = offers;
}

// A gate a rival party bit off and couldn't chew: they're barricaded
// inside, the guild posts their bounty. Sometimes a named member is
// stranded with them — rescue her/him and they may petition to join.
function makeRescueGate(S, rng) {
  const rIdx = S.rankIdx;
  const rank = RANKS[rIdx];
  const biomes = Object.entries(BIOMES).filter(([, b]) => RANKS.indexOf(b.minRank) <= rIdx);
  const [biomeId, biome] = biomes[Math.floor(rng() * biomes.length)];
  const name = biome.names[Math.floor(rng() * biome.names.length)]
    .replace('{adj}', biome.adj[Math.floor(rng() * biome.adj.length)])
    .replace('{noun}', biome.noun[Math.floor(rng() * biome.noun.length)]);

  const pool = ['garrick', 'liria', 'tobbin']
    .filter(id => !(S.recruited || []).includes(id) && !(S.flags && S.flags['rescued_' + id]));
  const member = pool.length && rng() < 0.65 ? pool[Math.floor(rng() * pool.length)] : null;
  const party = member ? HEROES[member].rescueParty : RIVAL_PARTIES[Math.floor(rng() * RIVAL_PARTIES.length)];

  return {
    id: 'rescue_' + S.day,
    rank, rankIdx: rIdx, biome: biomeId, name,
    modifier: 'none',
    rooms: GATE_ROOMS[rank],
    seed: (rng() * 2 ** 31) | 0,
    rescue: {
      party, member,
      bounty: Math.round(140 * XP_MULT[rank]),
      gp: Math.round(GATE_GP[rank] * 0.4),
    },
  };
}

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
function toRoman(n) { return n <= 10 ? ROMAN[n] : String(n); }

function makeRecursionGate(S, depth, rng) {
  return {
    id: 'recursion_' + S.day,
    rank: 'S', rankIdx: 5, biome: 'void',
    name: `Recursion ${toRoman(depth)} — Echo of the Threshold`,
    modifier: depth % 3 === 0 ? 'unstable' : 'rich',
    rooms: Math.min(8, 5 + Math.floor(depth / 2)),
    recursion: true, depth,
    seed: (rng() * 2 ** 31) | 0,
  };
}

// --- dungeon path & enemy scaling --------------------------------------------

export function buildDungeon(gate) {
  const rng = mulberry32(gate.seed);
  const biome = BIOMES[gate.biome];
  const swarm = gate.modifier === 'swarming' ? 1 : 0;
  const nodes = [];

  for (let i = 0; i < gate.rooms; i++) {
    nodes.push({ type: 'fight', group: makeGroup(gate, biome, i, rng, swarm) });
    if (i < gate.rooms - 1) {
      const r = rng();
      if (r < 0.24) nodes.push(makeBranch(gate, biome, i, rng, swarm));
      else if (r < 0.42) nodes.push({ type: 'treasure' });
      else if (r < 0.62) nodes.push({ type: 'event', roll: rng() });
      else if (r < 0.74) nodes.push({ type: 'rest' });
    }
  }
  // Distress gates: the stranded party's barricade sits before the boss.
  if (gate.rescue) nodes.push({ type: 'stranded' });
  nodes.push({ type: 'boss', group: makeBossGroup(gate, biome, rng) });
  return nodes;
}

// The corridor forks: one door risks more for more, the other plays safe.
// Both options are generated up front so runs stay serializable.
function makeBranch(gate, biome, depth, rng, swarm) {
  const risky = { type: 'fight', elite: true, group: makeEliteGroup(gate, biome, depth, rng) };
  const r = rng();
  const safe = r < 0.4 ? { type: 'treasure' }
    : r < 0.75 ? { type: 'event', roll: rng() }
    : { type: 'rest' };
  return { type: 'branch', options: [risky, safe] };
}

function makeGroup(gate, biome, depth, rng, swarm) {
  const n = Math.min(4, 2 + Math.floor(rng() * 2) + swarm);
  const group = [];
  let eliteRolled = false;
  for (let i = 0; i < n; i++) {
    const defId = biome.mobs[Math.floor(rng() * biome.mobs.length)];
    // one elite max per ordinary room
    const elite = !eliteRolled && rng() < eliteChance(gate.rankIdx) ? pickElite(rng) : null;
    if (elite) eliteRolled = true;
    group.push(scaleEnemy(defId, gate, depth, false, rng, elite));
  }
  return group;
}

// Elite-door rooms: a guaranteed elite with an escort, and richer spoils baked in.
function makeEliteGroup(gate, biome, depth, rng) {
  const group = [];
  const leadId = biome.mobs[Math.floor(rng() * biome.mobs.length)];
  group.push(scaleEnemy(leadId, gate, depth + 1, false, rng, pickElite(rng)));
  const adds = 1 + Math.floor(rng() * 2);
  for (let i = 0; i < adds; i++) {
    group.push(scaleEnemy(biome.mobs[Math.floor(rng() * biome.mobs.length)], gate, depth, false, rng));
  }
  return group;
}

function pickElite(rng) {
  const keys = Object.keys(ELITES);
  return keys[Math.floor(rng() * keys.length)];
}

function makeBossGroup(gate, biome, rng) {
  const bossId = gate.id === 'monarch' ? 'herald' : biome.bosses[Math.floor(rng() * biome.bosses.length)];
  const group = [scaleEnemy(bossId, gate, gate.rooms, true, rng)];
  if (gate.rankIdx >= 2) {
    const adds = gate.rankIdx >= 4 ? 2 : 1;
    for (let i = 0; i < adds; i++) {
      group.push(scaleEnemy(biome.mobs[Math.floor(rng() * biome.mobs.length)], gate, gate.rooms - 1, false, rng));
    }
  }
  return group;
}

let enemySeq = 0;
export function scaleEnemy(defId, gate, depth, isBoss, rng, elite = null) {
  const def = ENEMIES[defId];
  let tier = XP_MULT[gate.rank];
  if (gate.recursion) tier *= 1 + (gate.depth || 0) * 0.4; // NG+ escalation
  const ramp = 1 + depth * 0.06;
  const bossMult = def.boss ? 2.3 : 1;
  const dmgMod = gate.modifier === 'unstable' ? 1.15 : 1;
  const eliteDef = elite ? ELITES[elite] : null;
  const st = {};
  for (const [k, v] of Object.entries(def.base)) {
    let val = v * tier * ramp * (k === 'hp' ? bossMult : Math.sqrt(bossMult));
    if ((k === 'atk' || k === 'mag') && dmgMod !== 1) val *= dmgMod;
    if (eliteDef && eliteDef.stats[k]) val *= eliteDef.stats[k];
    st[k] = Math.round(val);
  }
  st.luk = 5; st.mp = 999;
  const skills = def.skills.slice();
  if (eliteDef && !skills.includes(eliteDef.skill)) skills.push(eliteDef.skill);
  return {
    uid: 'e' + (++enemySeq) + '_' + Math.floor((rng ? rng() : Math.random()) * 1e6),
    defId,
    name: eliteDef ? `${eliteDef.name} ${def.name}` : def.name,
    model: def.model,
    variant: def.variant || null,
    boss: !!def.boss,
    elite: elite || null,
    stats: st,
    skills,
    xp: Math.round(def.xp * tier * (eliteDef ? ELITE_XP_MULT : 1)),
    gold: Math.round(def.gold * tier * (0.85 + (rng ? rng() : Math.random()) * 0.3) * (eliteDef ? ELITE_GOLD_MULT : 1)),
  };
}

// --- run lifecycle -----------------------------------------------------------

export function startRun(S, gate, selectedIds) {
  ensureYuki(S);
  const party = {};
  const away = dispatchedIds(S);
  let ids;
  if (selectedIds && selectedIds.length) {
    // player-chosen party (for grinding / focused leveling)
    ids = selectedIds.filter(id => S.heroes[id] && !away.has(id));
    if (!ids.length) ids = ['player'];
  } else {
    ids = ['player', 'erin', 'sakura', 'shiro'];
    if (S.flags.yuki_member) ids.push('yuki');
    else if (S.flags.yuki_guest && !S.flags.yuki_guest_done) {
      S.heroes.yuki = S.heroes.yuki || { level: 6 + S.rankIdx * 3, xp: 0, gear: { weapon: null, armor: null, charm: null } };
      ids.push('yuki');
    }
    ids = ids.filter(id => !away.has(id));
    if (!ids.includes('player')) ids.unshift('player');
  }
  for (const id of ids) {
    const st = heroStats(S, id);
    party[id] = { hp: st.hp, mp: st.mp };
  }
  S.run = {
    gate, nodes: buildDungeon(gate), nodeIdx: 0,
    party, partyIds: ids,
    loot: { gold: 0, xp: 0, gear: [], items: {} },
    tempBuff: null, // e.g. Sakura resonance node
  };
}

export function endRun(S, outcome) {
  // outcome: 'clear' | 'retreat' | 'wipe'
  const run = S.run;
  const gate = run.gate;
  const result = { outcome, gate, gold: 0, xp: 0, gp: 0, gear: run.loot.gear, items: run.loot.items, levelUps: [], promos: [] };
  const xpMod = (gate.modifier === 'rich' ? 1.5 : 1) * (gate.modifier === 'swarming' ? 1.25 : 1);
  const goldMod = gate.modifier === 'gilded' ? 1.6 : 1;

  result.gold = Math.round(run.loot.gold * goldMod);
  // Smaller parties concentrate XP onto each member — grind specific heroes.
  const xpEarners = run.partyIds.filter(id => id !== 'yuki' || S.flags.yuki_member).length;
  const smallPartyBonus = 1 + Math.max(0, 4 - xpEarners) * 0.35;
  result.xp = Math.round(run.loot.xp * xpMod * smallPartyBonus);
  result.partySize = xpEarners;

  if (outcome === 'clear') {
    result.gp = Math.round(GATE_GP[gate.rank] * (gate.modifier === 'unstable' ? 1.5 : 1)) + (run.loot.gpBonus || 0);
    S.stats.clears++;
    // Rescue bounty: the stranded party comes home, the guild pays out.
    if (gate.rescue) {
      result.bounty = gate.rescue.bounty;
      result.rescueParty = gate.rescue.party;
      S.gold += gate.rescue.bounty;
      result.gp += gate.rescue.gp;
      if (gate.rescue.member) {
        S.flags['rescued_' + gate.rescue.member] = true;
        S.queue.push('rescue_' + gate.rescue.member);
      } else {
        S.queue.push('rescue_bounty');
      }
    }
  } else if (outcome === 'retreat') {
    result.gp = 0;
    result.gold = Math.round(result.gold * 0.6);
    S.stats.retreats++;
  } else {
    result.gp = 0;
    result.gold = 0;
    result.xp = Math.round(result.xp * 0.5);
    S.stats.wipes++;
  }

  S.gold += result.gold;
  for (const id of run.partyIds) {
    if (id === 'yuki' && !S.flags.yuki_member) continue; // guest Yuki earns no XP
    result.levelUps.push(...gainXp(S, id, result.xp));
    // forged companions: fighting together deepens trust between their scenes
    if (outcome === 'clear' && HEROES[id] && HEROES[id].custom && Math.random() < 0.4) {
      addBond(S, id, 1);
    }
  }
  for (const g of result.gear) S.gearBag.push(g);
  for (const [it, n] of Object.entries(result.items)) {
    S.inventory[it] = (S.inventory[it] || 0) + n;
  }
  if (result.gp) result.promos = addGp(S, result.gp);

  if (S.flags.yuki_guest && !S.flags.yuki_guest_done && !S.flags.yuki_member) {
    S.flags.yuki_guest_done = true;
    delete S.heroes.yuki;
  }
  if (gate.id === 'monarch' && outcome === 'clear') { S.cleared = true; S.clearedDay = S.day; }
  if (gate.recursion && outcome === 'clear') S.ngPlus = (S.ngPlus || 0) + 1;

  S.run = null;
  advanceDay(S);
  save(S);
  return result;
}

// A day passes: dispatched teams come home, the gate board rerolls.
export function advanceDay(S) {
  S.day++;
  resolveDispatches(S);
  rollGates(S);
}

// --- dispatch: send benched members to clear a gate on their own --------------

export function dispatchForecast(S, gate, ids) {
  const bench = DISPATCH_BENCHMARK[gate.rank] || 10;
  const avg = ids.length
    ? ids.reduce((a, id) => a + (S.heroes[id]?.level || 1), 0) / ids.length : 0;
  const roles = [...new Set(ids.map(id => HEROES[id]?.role).filter(Boolean))];
  let comp = roles.reduce((a, r) => a + (ROLE_INFO[r]?.bonus || 0), 0);
  if (ids.length >= 3) comp += 0.05;
  let chance = 0.5 + (avg / bench - 1) * 1.1 + comp;
  chance = Math.max(0.05, Math.min(0.95, chance));
  return { chance, comp, roles, avg: Math.round(avg), bench };
}

export function sendDispatch(S, gate, ids) {
  const { chance } = dispatchForecast(S, gate, ids);
  S.dispatch.push({
    id: 'm' + Date.now().toString(36) + Math.floor(Math.random() * 1e4),
    gate: { rank: gate.rank, rankIdx: gate.rankIdx, name: gate.name, biome: gate.biome, modifier: gate.modifier },
    team: ids.slice(),
    day: S.day,
    chance,
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
        const slot = ['weapon', 'armor', 'charm'][Math.floor(Math.random() * 3)];
        report.gear = makeGear(slot, Math.min(m.gate.rankIdx, 5), Math.random);
        S.gearBag.push(report.gear);
      }
      S.gold += report.gold;
      addGp(S, report.gp);
    } else {
      report.xp = Math.round(45 * tier); // hard lessons still teach
    }
    for (const id of m.team) report.levelUps.push(...gainXp(S, id, report.xp));
    S.dispatchReports.push(report);
  }
}

// Treasure node contents.
export function rollTreasure(S, gate, rng) {
  const r = rng ? rng() : Math.random();
  const tier = Math.min(gate.rankIdx + (r > 0.85 ? 1 : 0), 5);
  if (r < 0.5) {
    const slot = ['weapon', 'armor', 'charm'][Math.floor((rng ? rng() : Math.random()) * 3)];
    const g = makeGear(slot, tier, rng || Math.random);
    S.run.loot.gear.push(g);
    return { kind: 'gear', gear: g };
  } else if (r < 0.8) {
    const gold = Math.round(40 * XP_MULT[gate.rank] * (0.8 + r));
    S.run.loot.gold += gold;
    return { kind: 'gold', gold };
  } else {
    const item = r > 0.93 && gate.rankIdx >= 1 ? 'feather' : 'potion';
    S.run.loot.items[item] = (S.run.loot.items[item] || 0) + 1;
    return { kind: 'item', item };
  }
}

// Boss gear drop on clear.
export function rollBossDrop(S, gate) {
  if (Math.random() < 0.75) {
    const slot = ['weapon', 'armor', 'charm'][Math.floor(Math.random() * 3)];
    const g = makeGear(slot, Math.min(gate.rankIdx + (Math.random() > 0.7 ? 1 : 0), 5), Math.random);
    S.run.loot.gear.push(g);
    return g;
  }
  return null;
}

// --- misc -------------------------------------------------------------------

export function canAfford(S, price) { return S.gold >= price; }
