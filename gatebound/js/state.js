// ============================================================
// GATEBOUND — game state, saves, progression, gate spawning
// ============================================================

import {
  RANKS, RANK_UP_GP, GATE_GP, XP_MULT, HEROES, heroStatsAt, heroSkillsAt,
  xpToNext, BIOMES, GATE_ROOMS, GATE_MODIFIERS, MONARCH_GATE, ENEMIES, makeGear,
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
    bond: { sakura: 0, erin: 0, shiro: 0 },
    heroes: {},
    inventory: { potion: 3, ether: 1 },
    gearBag: [],
    gates: [],
    run: null,                       // active dungeon run
    stats: { clears: 0, kills: 0, retreats: 0, wipes: 0 },
    cleared: false,
    settings: { volume: 0.6, music: true, textFast: false },
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
export function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const S = JSON.parse(raw);
    return S && S.v === 1 ? S : null;
  } catch (e) { return null; }
}
export function wipeSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }
export function exportSave(S) { return btoa(unescape(encodeURIComponent(JSON.stringify(S)))); }
export function importSave(str) {
  try {
    const S = JSON.parse(decodeURIComponent(escape(atob(str.trim()))));
    return S && S.v === 1 ? S : null;
  } catch (e) { return null; }
}

// --- derived stats ---------------------------------------------------------

export function heroStats(S, id) {
  const h = S.heroes[id];
  const def = HEROES[id];
  const level = h ? h.level : def.startLevel;
  const s = heroStatsAt(def, level);
  if (h) {
    for (const g of Object.values(h.gear)) {
      if (!g) continue;
      for (const [k, v] of Object.entries(g.stats)) s[k] = (s[k] || 0) + v;
    }
  }
  return s;
}

export function heroSkills(S, id) {
  const h = S.heroes[id];
  return heroSkillsAt(HEROES[id], h ? h.level : HEROES[id].startLevel);
}

// XP: returns array of level-up records {id, level, gains}
export function gainXp(S, id, amount) {
  const h = S.heroes[id];
  if (!h) return [];
  if (id === 'player') amount = Math.round(amount * 1.1); // System passive
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
  const count = 3 + Math.floor(rng() * 2); // 3-4 regular offers

  for (let i = 0; i < count; i++) {
    // Weight: mostly at/near player rank, one easy one.
    let rIdx;
    if (i === 0) rIdx = Math.max(0, S.rankIdx - 1);
    else if (i === 1) rIdx = S.rankIdx;
    else rIdx = Math.min(maxIdx, Math.max(0, S.rankIdx + (rng() < 0.5 ? 0 : 1)));
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
  }

  if (S.rankIdx === RANKS.length - 1 && !S.cleared) {
    offers.unshift({ ...MONARCH_GATE, rankIdx: 5, seed: (rng() * 2 ** 31) | 0 });
  }
  S.gates = offers;
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
      if (r < 0.28) nodes.push({ type: 'treasure' });
      else if (r < 0.55) nodes.push({ type: 'event', roll: rng() });
      else if (r < 0.68) nodes.push({ type: 'rest' });
    }
  }
  nodes.push({ type: 'boss', group: makeBossGroup(gate, biome, rng) });
  return nodes;
}

function makeGroup(gate, biome, depth, rng, swarm) {
  const n = Math.min(4, 2 + Math.floor(rng() * 2) + swarm);
  const group = [];
  for (let i = 0; i < n; i++) {
    const defId = biome.mobs[Math.floor(rng() * biome.mobs.length)];
    group.push(scaleEnemy(defId, gate, depth, false, rng));
  }
  return group;
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
export function scaleEnemy(defId, gate, depth, isBoss, rng) {
  const def = ENEMIES[defId];
  const tier = XP_MULT[gate.rank];
  const ramp = 1 + depth * 0.06;
  const bossMult = def.boss ? 2.3 : 1;
  const dmgMod = gate.modifier === 'unstable' ? 1.15 : 1;
  const st = {};
  for (const [k, v] of Object.entries(def.base)) {
    let val = v * tier * ramp * (k === 'hp' ? bossMult : Math.sqrt(bossMult));
    if ((k === 'atk' || k === 'mag') && dmgMod !== 1) val *= dmgMod;
    st[k] = Math.round(val);
  }
  st.luk = 5; st.mp = 999;
  return {
    uid: 'e' + (++enemySeq) + '_' + Math.floor((rng ? rng() : Math.random()) * 1e6),
    defId,
    name: def.name,
    model: def.model,
    variant: def.variant || null,
    boss: !!def.boss,
    stats: st,
    skills: def.skills.slice(),
    xp: Math.round(def.xp * tier),
    gold: Math.round(def.gold * tier * (0.85 + (rng ? rng() : Math.random()) * 0.3)),
  };
}

// --- run lifecycle -----------------------------------------------------------

export function startRun(S, gate) {
  const party = {};
  const ids = ['player', 'erin', 'sakura', 'shiro'];
  if (S.flags.yuki_guest && !S.flags.yuki_guest_done) {
    S.heroes.yuki = S.heroes.yuki || { level: 6 + S.rankIdx * 3, xp: 0, gear: { weapon: null, armor: null, charm: null } };
    ids.push('yuki');
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
  result.xp = Math.round(run.loot.xp * xpMod);

  if (outcome === 'clear') {
    result.gp = Math.round(GATE_GP[gate.rank] * (gate.modifier === 'unstable' ? 1.5 : 1)) + (run.loot.gpBonus || 0);
    S.stats.clears++;
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
    if (id === 'yuki') continue;
    result.levelUps.push(...gainXp(S, id, result.xp));
  }
  for (const g of result.gear) S.gearBag.push(g);
  for (const [it, n] of Object.entries(result.items)) {
    S.inventory[it] = (S.inventory[it] || 0) + n;
  }
  if (result.gp) result.promos = addGp(S, result.gp);

  if (S.flags.yuki_guest && !S.flags.yuki_guest_done) {
    S.flags.yuki_guest_done = true;
    delete S.heroes.yuki;
  }
  if (gate.id === 'monarch' && outcome === 'clear') S.cleared = true;

  S.run = null;
  S.day++;
  rollGates(S);
  save(S);
  return result;
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
