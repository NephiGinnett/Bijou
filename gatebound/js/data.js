// ============================================================
// GATEBOUND — game data & balance
// All static tables: ranks, heroes, skills, statuses, enemies,
// biomes, gates, items, gear. No state in this file.
// ============================================================

export const RANKS = ['F', 'D', 'C', 'B', 'A', 'S'];

export const RANK_STYLE = {
  F: { color: '#9aa5b1', glow: 'rgba(154,165,177,.35)' },
  D: { color: '#6fcf6f', glow: 'rgba(111,207,111,.35)' },
  C: { color: '#5aa7ff', glow: 'rgba(90,167,255,.35)' },
  B: { color: '#b07cff', glow: 'rgba(176,124,255,.4)' },
  A: { color: '#ff6b6b', glow: 'rgba(255,107,107,.4)' },
  S: { color: '#ffd166', glow: 'rgba(255,209,102,.5)' },
};

// Guild points needed to be promoted OUT of each rank.
export const RANK_UP_GP = { F: 90, D: 260, C: 620, B: 1250, A: 2300 };

// Guild points awarded for clearing a gate of each rank.
export const GATE_GP = { F: 30, D: 70, C: 150, B: 320, A: 640, S: 1500 };

export const XP_MULT = { F: 1, D: 1.9, C: 3.4, B: 5.8, A: 9.5, S: 15 };

export function xpToNext(level) {
  return Math.round(50 * Math.pow(level, 1.45));
}

// ------------------------------------------------------------
// Heroes
// ------------------------------------------------------------
// The player is the anomaly: a nobody licensed at F whose "System"
// grants absurd growth. The girls start strong (A-rank veterans)
// but have mostly plateaued.

export const HEROES = {
  player: {
    id: 'player',
    name: 'Rook', // renamed at new game
    epithet: 'The Fourth',
    cls: 'Vagrant',
    desc: 'A fresh F-rank license and a voice nobody else can hear. The System has chosen you: every gate cleared makes you measurably, impossibly stronger.',
    startLevel: 1,
    base:   { hp: 105, mp: 32, atk: 15, mag: 10, def: 11, res: 9, agi: 12, luk: 10 },
    growth: { hp: 15,  mp: 4,  atk: 3.3, mag: 2.2, def: 2.5, res: 2.2, agi: 1.9, luk: 1.2 },
    skills: { 1: 'twin_fangs', 4: 'shadow_rush', 7: 'execute', 10: 'limit_break', 16: 'monarchs_edge' },
    passive: { id: 'system', name: 'The System', desc: 'Levels grant outsized growth. Gains +10% XP.' },
  },
  erin: {
    id: 'erin',
    name: 'Erin',
    epithet: 'the Golden Knight',
    cls: 'Knight',
    desc: 'The party\'s unbreakable wall. Warm, honest to a fault, first through every door and first onto every trap. Protects Sakura like breathing.',
    startLevel: 14,
    base:   { hp: 150, mp: 22, atk: 13, mag: 4, def: 15, res: 10, agi: 8, luk: 6 },
    growth: { hp: 11,  mp: 2,  atk: 2.0, mag: 0.8, def: 2.0, res: 1.5, agi: 1.0, luk: 0.8 },
    skills: { 1: 'shield_bash', 2: 'rallying_taunt', 5: 'aegis', 18: 'valkyrie_dance' },
    passive: { id: 'cover', name: 'Shieldmaiden', desc: 'Once per round, intercepts a hit aimed at an ally below 30% HP.' },
  },
  sakura: {
    id: 'sakura',
    name: 'Sakura',
    epithet: 'the Petal Storm',
    cls: 'Mage',
    desc: 'A timid elf who apologizes to doors she bumps into — and the most dangerous arcane talent of her graduating class. Braver when Erin is standing.',
    startLevel: 14,
    base:   { hp: 82, mp: 62, atk: 5, mag: 19, def: 6, res: 13, agi: 9, luk: 9 },
    growth: { hp: 7,  mp: 6,  atk: 0.6, mag: 2.7, def: 1.0, res: 1.9, agi: 1.1, luk: 1.0 },
    skills: { 1: 'firebloom', 2: 'prism_lance', 16: 'starfall' },
    passive: { id: 'timid_prodigy', name: 'Timid Prodigy', desc: '+20% MAG while Erin stands. −10% if Erin falls.' },
  },
  shiro: {
    id: 'shiro',
    name: 'Shiro',
    epithet: 'the White Queen',
    cls: 'Tactician',
    desc: 'Reads a battlefield like a chessboard and most people like an open, boring book. Speaks rarely. Heals precisely. Keeps a ledger of everything.',
    startLevel: 14,
    base:   { hp: 94, mp: 56, atk: 6, mag: 15, def: 8, res: 15, agi: 10, luk: 8 },
    growth: { hp: 8,  mp: 5,  atk: 0.7, mag: 2.1, def: 1.2, res: 2.0, agi: 1.3, luk: 1.0 },
    skills: { 1: 'mend', 2: 'frost_sigil', 6: 'checkmate', 18: 'zugzwang' },
    passive: { id: 'grand_design', name: 'Grand Design', desc: 'At the start of each round, marks the weakest enemy: it takes +15% damage.' },
  },
  yuki: {
    id: 'yuki',
    name: 'Yuki',
    epithet: 'the Earnest',
    cls: 'Adventurer (D)',
    desc: 'Kind, sheltered, and trying so hard it hurts to watch. The man three A-ranks are pledged to marry — currently learning which end of the sword to hold.',
    startLevel: 7,
    base:   { hp: 88, mp: 26, atk: 10, mag: 6, def: 9, res: 8, agi: 8, luk: 12 },
    growth: { hp: 8,  mp: 2,  atk: 1.4, mag: 0.8, def: 1.2, res: 1.0, agi: 0.9, luk: 1.5 },
    skills: { 1: 'desperate_swing', 2: 'encourage' },
    passive: { id: 'lucky_lamb', name: 'Lucky Lamb', desc: 'Somehow survives. +15% chance attacks against him miss.' },
  },
};

export function heroStatsAt(heroDef, level) {
  const s = {};
  for (const k of Object.keys(heroDef.base)) {
    s[k] = Math.round(heroDef.base[k] + heroDef.growth[k] * (level - 1));
  }
  return s;
}

export function heroSkillsAt(heroDef, level) {
  const out = ['strike'];
  for (const [lv, id] of Object.entries(heroDef.skills)) {
    if (level >= Number(lv)) out.push(id);
  }
  return out;
}

// ------------------------------------------------------------
// Statuses
// ------------------------------------------------------------
// mods are multiplicative bonuses: {atk: .3} = +30% ATK.

export const STATUSES = {
  atk_up:    { name: 'Fired Up',   icon: '⚔', kind: 'buff',   mods: { atk: 0.25, mag: 0.25 } },
  atk_up_big:{ name: 'Limit Break',icon: '✦', kind: 'buff',   mods: { atk: 0.5, agi: 0.2 } },
  def_up:    { name: 'Bulwark',    icon: '🛡', kind: 'buff',   mods: { def: 0.35, res: 0.35 } },
  def_down:  { name: 'Sundered',   icon: '⛓', kind: 'debuff', mods: { def: -0.3 } },
  res_down:  { name: 'Hexed',      icon: '☄', kind: 'debuff', mods: { res: -0.3 } },
  agi_down:  { name: 'Slowed',     icon: '🕸', kind: 'debuff', mods: { agi: -0.3 } },
  atk_down:  { name: 'Weakened',   icon: '↓', kind: 'debuff', mods: { atk: -0.25, mag: -0.25 } },
  burn:      { name: 'Burning',    icon: '🔥', kind: 'debuff', dot: 0.06 },
  poison:    { name: 'Poisoned',   icon: '☠', kind: 'debuff', dot: 0.05 },
  regen:     { name: 'Mending',    icon: '❀', kind: 'buff',   hot: 0.08 },
  stun:      { name: 'Stunned',    icon: '✶', kind: 'debuff', stun: true },
  taunt:     { name: 'Challenged', icon: '❗', kind: 'buff',   taunt: true },
  shield:    { name: 'Aegis',      icon: '◈', kind: 'buff',   shield: true },
  mark:      { name: 'Analyzed',   icon: '◎', kind: 'debuff', takenUp: 0.15 },
};

// ------------------------------------------------------------
// Skills
// ------------------------------------------------------------
// type: phys|mag|heal|support ; target: enemy|all_enemies|ally|all_allies|self
// power multiplies ATK or MAG. anim hints the 3D layer.

export const SKILLS = {
  strike:        { name: 'Strike', type: 'phys', power: 1.0, mp: 0, target: 'enemy', anim: 'melee', desc: 'A basic attack.' },
  guard:         { name: 'Guard', type: 'support', mp: 0, target: 'self', anim: 'guard', desc: 'Halve damage taken until your next turn.' },

  // Player
  twin_fangs:    { name: 'Twin Fangs', type: 'phys', power: 0.7, hits: 2, mp: 6, target: 'enemy', anim: 'melee', desc: 'Two lightning-fast slashes.' },
  shadow_rush:   { name: 'Shadow Rush', type: 'phys', power: 1.35, mp: 10, target: 'enemy', anim: 'dash', apply: { to: 'target', id: 'agi_down', turns: 2, chance: 0.9 }, desc: 'Blur through a foe, cutting tendons. Slows the target.' },
  execute:       { name: 'Executioner', type: 'phys', power: 1.4, mp: 12, target: 'enemy', anim: 'melee', execBelow: 0.35, execPower: 2.6, desc: 'Finish the wounded. Massive damage below 35% HP.' },
  limit_break:   { name: 'Limit Break', type: 'support', mp: 14, target: 'self', anim: 'buff', apply: { to: 'target', id: 'atk_up_big', turns: 3 }, desc: 'The System removes your limits. +50% ATK, +20% AGI for 3 turns.' },
  monarchs_edge: { name: "Monarch's Edge", type: 'phys', power: 1.15, mp: 26, target: 'all_enemies', anim: 'dash', desc: 'A single step, a dozen cuts. Hits every enemy.' },

  // Erin
  shield_bash:   { name: 'Shield Bash', type: 'phys', power: 0.95, mp: 7, target: 'enemy', anim: 'melee', apply: { to: 'target', id: 'stun', turns: 1, chance: 0.75 }, desc: 'A ringing blow. 75% chance to stun.' },
  rallying_taunt:{ name: 'Rallying Taunt', type: 'support', mp: 8, target: 'self', anim: 'buff', apply: [{ to: 'target', id: 'taunt', turns: 2 }, { to: 'target', id: 'def_up', turns: 2 }], desc: 'Draw every eye in the room. Enemies must attack Erin; +35% DEF/RES.' },
  aegis:         { name: 'Aegis', type: 'support', mp: 10, target: 'ally', anim: 'buff', shieldPower: 2.2, desc: 'Project a golden ward absorbing damage based on Erin\'s DEF.' },
  valkyrie_dance:{ name: 'Valkyrie Dance', type: 'phys', power: 0.8, mp: 20, target: 'all_enemies', anim: 'dash', desc: 'A whirl of steel and blue scarf. Hits every enemy.' },

  // Sakura
  arcane_bolt:   { name: 'Arcane Bolt', type: 'mag', power: 1.0, mp: 0, target: 'enemy', anim: 'cast', desc: 'A dart of green starlight.' },
  firebloom:     { name: 'Firebloom', type: 'mag', power: 0.85, mp: 12, target: 'all_enemies', anim: 'cast', apply: { to: 'target', id: 'burn', turns: 2, chance: 0.6 }, desc: 'Petals of flame burst over the field. May burn.' },
  prism_lance:   { name: 'Prism Lance', type: 'mag', power: 1.8, mp: 15, target: 'enemy', anim: 'cast', desc: 'A refracted spear of condensed mana.' },
  starfall:      { name: 'Starfall', type: 'mag', power: 1.5, mp: 32, target: 'all_enemies', anim: 'cast', desc: 'She whispers an apology, and the sky answers.' },

  // Shiro
  mend:          { name: 'Mend', type: 'heal', power: 2.3, mp: 9, target: 'ally', anim: 'cast', desc: 'Precise restorative sigils.' },
  frost_sigil:   { name: 'Frost Sigil', type: 'mag', power: 0.6, mp: 10, target: 'enemy', anim: 'cast', apply: [{ to: 'target', id: 'def_down', turns: 2 }, { to: 'target', id: 'res_down', turns: 2 }], desc: 'Brands a foe with cracking ice. −30% DEF and RES.' },
  checkmate:     { name: 'Checkmate', type: 'mag', power: 1.2, mp: 16, target: 'enemy', anim: 'cast', perDebuff: 0.4, desc: '+40% damage per debuff on the target. The board was set turns ago.' },
  zugzwang:      { name: 'Zugzwang', type: 'support', mp: 22, target: 'all_enemies', anim: 'cast', apply: { to: 'target', id: 'atk_down', turns: 2 }, desc: 'Every move they can make is a losing one. Weakens all enemies.' },

  // Yuki
  desperate_swing:{ name: 'Desperate Swing', type: 'phys', power: 1.0, mp: 0, target: 'enemy', anim: 'melee', variance: 0.55, desc: 'Sometimes it even connects.' },
  encourage:     { name: 'Encourage', type: 'support', mp: 8, target: 'all_allies', anim: 'buff', apply: { to: 'target', id: 'atk_up', turns: 2 }, desc: 'His faith in you is embarrassingly sincere. Party +25% ATK/MAG.' },

  // Enemies
  e_bite:        { name: 'Bite', type: 'phys', power: 1.0, mp: 0, target: 'enemy', anim: 'melee' },
  e_smash:       { name: 'Crushing Smash', type: 'phys', power: 1.7, mp: 0, target: 'enemy', anim: 'melee', cooldown: 3 },
  e_venom:       { name: 'Venom Spit', type: 'phys', power: 0.7, mp: 0, target: 'enemy', anim: 'cast', apply: { to: 'target', id: 'poison', turns: 3, chance: 0.8 } },
  e_ember:       { name: 'Ember', type: 'mag', power: 1.1, mp: 0, target: 'enemy', anim: 'cast', apply: { to: 'target', id: 'burn', turns: 2, chance: 0.4 } },
  e_frost:       { name: 'Frost Shard', type: 'mag', power: 1.0, mp: 0, target: 'enemy', anim: 'cast', apply: { to: 'target', id: 'agi_down', turns: 2, chance: 0.5 } },
  e_curse:       { name: 'Withering Curse', type: 'mag', power: 0.7, mp: 0, target: 'all_enemies', anim: 'cast', cooldown: 3, apply: { to: 'target', id: 'atk_down', turns: 2, chance: 0.6 } },
  e_heal:        { name: 'Foul Mending', type: 'heal', power: 2.0, mp: 0, target: 'ally', anim: 'cast', cooldown: 2 },
  e_howl:        { name: 'Rallying Howl', type: 'support', mp: 0, target: 'all_allies', anim: 'buff', cooldown: 4, apply: { to: 'target', id: 'atk_up', turns: 2 } },
  e_sunder:      { name: 'Armor Sunder', type: 'phys', power: 0.9, mp: 0, target: 'enemy', anim: 'melee', apply: { to: 'target', id: 'def_down', turns: 2, chance: 0.7 } },
  e_aoe_phys:    { name: 'Sweeping Blow', type: 'phys', power: 0.8, mp: 0, target: 'all_enemies', anim: 'melee', cooldown: 3 },
  e_aoe_mag:     { name: 'Mana Detonation', type: 'mag', power: 0.9, mp: 0, target: 'all_enemies', anim: 'cast', cooldown: 3 },
};

// ------------------------------------------------------------
// Enemies
// ------------------------------------------------------------
// Base stats are F-rank reference values; scaled by rank tier
// and room depth at spawn time. model: procedural builder id.

export const ENEMIES = {
  goblin:        { name: 'Goblin',          model: 'goblin',   base: { hp: 55, atk: 12, mag: 6,  def: 6,  res: 5,  agi: 10 }, skills: ['strike', 'e_bite'],            xp: 11, gold: 8 },
  goblin_archer: { name: 'Goblin Skirmisher',model: 'goblin',  variant: 'archer', base: { hp: 44, atk: 14, mag: 6, def: 4, res: 5, agi: 13 }, skills: ['strike', 'e_venom'], xp: 12, gold: 9 },
  goblin_shaman: { name: 'Goblin Shaman',   model: 'goblin',   variant: 'shaman', base: { hp: 48, atk: 8, mag: 14, def: 4, res: 9, agi: 9 }, skills: ['e_ember', 'e_heal'], xp: 14, gold: 11 },
  wolf:          { name: 'Gray Wolf',       model: 'wolf',     base: { hp: 60, atk: 14, mag: 4,  def: 6,  res: 5,  agi: 14 }, skills: ['e_bite', 'e_howl'],            xp: 12, gold: 8 },
  boar:          { name: 'Razorback Boar',  model: 'boar',     base: { hp: 75, atk: 15, mag: 3,  def: 9,  res: 4,  agi: 8 },  skills: ['strike', 'e_smash'],           xp: 13, gold: 9 },
  sprite:        { name: 'Feral Sprite',    model: 'sprite',   base: { hp: 40, atk: 6,  mag: 15, def: 4,  res: 10, agi: 15 }, skills: ['e_ember', 'e_frost'],          xp: 13, gold: 10 },
  vine_horror:   { name: 'Vine Horror',     model: 'vine',     base: { hp: 80, atk: 13, mag: 9,  def: 8,  res: 8,  agi: 6 },  skills: ['strike', 'e_venom', 'e_aoe_phys'], xp: 15, gold: 11 },
  skeleton:      { name: 'Skeleton Soldier',model: 'skeleton', base: { hp: 58, atk: 14, mag: 5,  def: 8,  res: 4,  agi: 9 },  skills: ['strike', 'e_sunder'],          xp: 13, gold: 10 },
  ghoul:         { name: 'Ghoul',           model: 'ghoul',    base: { hp: 72, atk: 15, mag: 6,  def: 7,  res: 6,  agi: 8 },  skills: ['e_bite', 'e_venom'],           xp: 14, gold: 10 },
  wraith:        { name: 'Wraith',          model: 'wraith',   base: { hp: 50, atk: 6,  mag: 16, def: 5,  res: 12, agi: 12 }, skills: ['e_ember', 'e_curse'],          xp: 15, gold: 12 },
  golem:         { name: 'Stone Golem',     model: 'golem',    base: { hp: 100, atk: 15, mag: 4, def: 14, res: 8,  agi: 5 },  skills: ['strike', 'e_smash', 'e_aoe_phys'], xp: 17, gold: 13 },
  gargoyle:      { name: 'Gargoyle',        model: 'gargoyle', base: { hp: 70, atk: 14, mag: 10, def: 10, res: 10, agi: 11 }, skills: ['strike', 'e_frost'],           xp: 16, gold: 12 },
  sentinel:      { name: 'Ruin Sentinel',   model: 'sentinel', base: { hp: 85, atk: 16, mag: 8,  def: 12, res: 9,  agi: 8 },  skills: ['strike', 'e_sunder', 'e_aoe_mag'], xp: 17, gold: 13 },
  frost_wolf:    { name: 'Frost Wolf',      model: 'wolf',     variant: 'frost', base: { hp: 68, atk: 16, mag: 8, def: 8, res: 8, agi: 15 }, skills: ['e_bite', 'e_frost', 'e_howl'], xp: 16, gold: 12 },
  ice_elemental: { name: 'Ice Elemental',   model: 'elemental',base: { hp: 62, atk: 8,  mag: 18, def: 7,  res: 13, agi: 10 }, skills: ['e_frost', 'e_aoe_mag'],        xp: 17, gold: 13 },
  yeti:          { name: 'Yeti',            model: 'yeti',     base: { hp: 105, atk: 17, mag: 5, def: 11, res: 8,  agi: 7 },  skills: ['strike', 'e_smash', 'e_howl'], xp: 18, gold: 14 },
  imp:           { name: 'Imp',             model: 'imp',      base: { hp: 55, atk: 13, mag: 13, def: 6,  res: 9,  agi: 14 }, skills: ['e_ember', 'e_bite'],           xp: 16, gold: 13 },
  hellhound:     { name: 'Hellhound',       model: 'wolf',     variant: 'hell', base: { hp: 78, atk: 18, mag: 10, def: 9, res: 8, agi: 14 }, skills: ['e_bite', 'e_ember', 'e_howl'], xp: 18, gold: 14 },
  cultist:       { name: 'Void Cultist',    model: 'cultist',  base: { hp: 60, atk: 9,  mag: 16, def: 6,  res: 12, agi: 10 }, skills: ['e_curse', 'e_ember', 'e_heal'], xp: 18, gold: 15 },

  // Bosses (spawned solo or with adds; ×boss multiplier on top of scaling)
  goblin_chief:  { name: 'Goblin Chieftain', model: 'goblin', variant: 'chief', boss: true, base: { hp: 95, atk: 15, mag: 8, def: 8, res: 7, agi: 10 }, skills: ['strike', 'e_smash', 'e_howl'], xp: 42, gold: 40 },
  dire_wolf:     { name: 'Dire Alpha',      model: 'wolf',    variant: 'dire', boss: true, base: { hp: 90, atk: 17, mag: 5, def: 8, res: 7, agi: 15 }, skills: ['e_bite', 'e_howl', 'e_aoe_phys'], xp: 42, gold: 38 },
  elder_treant:  { name: 'Elder Treant',    model: 'vine',    variant: 'elder', boss: true, base: { hp: 120, atk: 15, mag: 12, def: 11, res: 10, agi: 5 }, skills: ['e_smash', 'e_venom', 'e_aoe_phys', 'e_heal'], xp: 46, gold: 42 },
  bone_tyrant:   { name: 'Bone Tyrant',     model: 'skeleton',variant: 'tyrant', boss: true, base: { hp: 110, atk: 17, mag: 12, def: 10, res: 8, agi: 9 }, skills: ['strike', 'e_sunder', 'e_curse', 'e_aoe_mag'], xp: 46, gold: 44 },
  colossus:      { name: 'Ruin Colossus',   model: 'golem',   variant: 'colossus', boss: true, base: { hp: 150, atk: 18, mag: 8, def: 15, res: 10, agi: 4 }, skills: ['e_smash', 'e_aoe_phys', 'e_sunder'], xp: 50, gold: 48 },
  frost_matriarch:{ name: 'Frost Matriarch', model: 'elemental', variant: 'matriarch', boss: true, base: { hp: 130, atk: 12, mag: 20, def: 10, res: 14, agi: 10 }, skills: ['e_frost', 'e_aoe_mag', 'e_heal', 'e_curse'], xp: 52, gold: 50 },
  pit_lord:      { name: 'Pit Lord',        model: 'demon',   boss: true, base: { hp: 140, atk: 20, mag: 16, def: 12, res: 11, agi: 11 }, skills: ['e_smash', 'e_ember', 'e_aoe_mag', 'e_howl'], xp: 56, gold: 55 },
  herald:        { name: 'Herald of the Monarch', model: 'herald', boss: true, base: { hp: 175, atk: 22, mag: 20, def: 14, res: 14, agi: 13 }, skills: ['e_smash', 'e_aoe_mag', 'e_curse', 'e_howl', 'e_sunder'], xp: 120, gold: 150 },
};

// ------------------------------------------------------------
// Biomes & gate generation
// ------------------------------------------------------------

export const BIOMES = {
  cave:   { name: 'Cavern',  minRank: 'F', tint: 0x4a6a50, fog: 0x0c1410, floor: 0x2a3a2e, mobs: ['goblin', 'goblin_archer', 'goblin_shaman', 'wolf'], bosses: ['goblin_chief', 'dire_wolf'],
            names: ['{adj} Warren', '{adj} Burrow', 'Den of {noun}'], adj: ['Howling', 'Sunless', 'Craggy', 'Mossgrown'], noun: ['Fangs', 'Echoes', 'the Broodmother'] },
  forest: { name: 'Wildwood', minRank: 'F', tint: 0x4f7a3a, fog: 0x0d140a, floor: 0x31402a, mobs: ['wolf', 'boar', 'sprite', 'vine_horror'], bosses: ['elder_treant', 'dire_wolf'],
            names: ['{adj} Thicket', '{adj} Glade', 'Grove of {noun}'], adj: ['Whispering', 'Strangling', 'Verdant', 'Thorned'], noun: ['Roots', 'Hunger', 'the Old Stag'] },
  crypt:  { name: 'Crypt',   minRank: 'D', tint: 0x6a5a8a, fog: 0x0d0a14, floor: 0x2e2a3a, mobs: ['skeleton', 'ghoul', 'wraith'], bosses: ['bone_tyrant'],
            names: ['{adj} Ossuary', '{adj} Barrow', 'Tomb of {noun}'], adj: ['Sunken', 'Weeping', 'Hollow', 'Forgotten'], noun: ['Kings', 'the Unquiet', 'Silence'] },
  ruins:  { name: 'Ruins',   minRank: 'C', tint: 0x8a7a5a, fog: 0x14100a, floor: 0x3a342a, mobs: ['golem', 'gargoyle', 'sentinel', 'skeleton'], bosses: ['colossus', 'bone_tyrant'],
            names: ['{adj} Bastion', '{adj} Spire', 'Halls of {noun}'], adj: ['Shattered', 'Toppled', 'Gilded', 'Nameless'], noun: ['the Architect', 'Dust', 'the First Guild'] },
  frost:  { name: 'Glacier', minRank: 'B', tint: 0x6a9ab8, fog: 0x0a1014, floor: 0x2a343a, mobs: ['frost_wolf', 'ice_elemental', 'yeti'], bosses: ['frost_matriarch'],
            names: ['{adj} Crevasse', '{adj} Reach', 'Throat of {noun}'], adj: ['Screaming', 'Pale', 'Starving', 'Glasswind'], noun: ['Winter', 'the White Wyrm', 'Stillness'] },
  demon:  { name: 'Abyss',   minRank: 'A', tint: 0xb85a5a, fog: 0x140a0a, floor: 0x3a2a2a, mobs: ['imp', 'hellhound', 'cultist', 'wraith'], bosses: ['pit_lord'],
            names: ['{adj} Maw', '{adj} Descent', 'Choir of {noun}'], adj: ['Burning', 'Grinning', 'Bottomless', 'Red'], noun: ['Embers', 'the Torn Veil', 'Teeth'] },
};

// Rooms per gate rank (encounters before the boss room).
export const GATE_ROOMS = { F: 3, D: 3, C: 4, B: 4, A: 5, S: 5 };

export const GATE_MODIFIERS = [
  { id: 'none',     name: null, weight: 5 },
  { id: 'rich',     name: 'Mana-Rich',  desc: '+50% XP from this gate.', weight: 2 },
  { id: 'gilded',   name: 'Gilded',     desc: '+60% gold from this gate.', weight: 2 },
  { id: 'unstable', name: 'Unstable',   desc: 'Enemies +15% damage. +50% guild points.', weight: 2 },
  { id: 'swarming', name: 'Swarming',   desc: 'More enemies per room. +25% XP.', weight: 1 },
];

// The fixed story gate that appears once the player reaches S license.
export const MONARCH_GATE = {
  id: 'monarch',
  rank: 'S',
  biome: 'demon',
  name: 'The Monarch\'s Threshold',
  modifier: 'none',
  rooms: 5,
  story: true,
};

// ------------------------------------------------------------
// Items
// ------------------------------------------------------------

export const ITEMS = {
  potion:    { name: 'Potion',        desc: 'Restores 40% HP.',            price: 30,  heal: 0.4 },
  hi_potion: { name: 'Hi-Potion',     desc: 'Restores 75% HP.',            price: 110, heal: 0.75, minRank: 'C' },
  ether:     { name: 'Ether',         desc: 'Restores 40% MP.',            price: 60,  mana: 0.4 },
  elixir:    { name: 'Elixir',        desc: 'Fully restores HP and MP.',   price: 400, heal: 1, mana: 1, minRank: 'B' },
  feather:   { name: 'Phoenix Feather', desc: 'Revives a fallen ally at 50% HP.', price: 200, revive: 0.5, minRank: 'D' },
};

// ------------------------------------------------------------
// Gear
// ------------------------------------------------------------
// Flat stat mods. Tier index aligns with RANKS.

export const GEAR_TIERS = ['Iron', 'Bronzed', 'Steel', 'Mithril', 'Runeforged', 'Monarch\'s'];

const GEAR_BASES = {
  weapon: [
    { name: 'Blade',    stats: { atk: 1.0 } },
    { name: 'Warhammer',stats: { atk: 1.2, agi: -0.2 } },
    { name: 'Staff',    stats: { mag: 1.1 } },
    { name: 'Grimoire', stats: { mag: 0.9, res: 0.4 } },
    { name: 'Lance',    stats: { atk: 0.9, def: 0.3 } },
  ],
  armor: [
    { name: 'Plate',    stats: { def: 1.0, hp: 0.6 } },
    { name: 'Robe',     stats: { res: 1.0, mp: 0.6 } },
    { name: 'Hauberk',  stats: { def: 0.7, res: 0.5 } },
    { name: 'Cloak',    stats: { agi: 0.6, res: 0.5 } },
  ],
  charm: [
    { name: 'Ring',     stats: { atk: 0.4, mag: 0.4 } },
    { name: 'Pendant',  stats: { hp: 1.0 } },
    { name: 'Sigil',    stats: { mag: 0.6, mp: 0.5 } },
    { name: 'Band',     stats: { agi: 0.5, luk: 0.5 } },
    { name: 'Idol',     stats: { def: 0.4, res: 0.4 } },
  ],
};

// Stat points a gear piece of tier i distributes (scaled by stats weights above).
const GEAR_TIER_POWER = [6, 12, 22, 38, 60, 95];
const GEAR_STAT_SCALE = { hp: 6, mp: 3, atk: 1, mag: 1, def: 1, res: 1, agi: 1, luk: 1 };

export function makeGear(slot, tierIdx, rng) {
  const base = GEAR_BASES[slot][Math.floor(rng() * GEAR_BASES[slot].length)];
  const power = GEAR_TIER_POWER[tierIdx];
  const stats = {};
  for (const [k, w] of Object.entries(base.stats)) {
    stats[k] = Math.round(power * w * GEAR_STAT_SCALE[k] * (0.9 + rng() * 0.2));
  }
  return {
    id: 'g' + Math.floor(rng() * 1e9).toString(36) + tierIdx,
    slot, tier: tierIdx,
    name: `${GEAR_TIERS[tierIdx]} ${base.name}`,
    stats,
  };
}

export function gearScore(g) {
  return Object.entries(g.stats).reduce((a, [k, v]) => a + v / GEAR_STAT_SCALE[k], 0) | 0;
}

// Shop stock scales with guild rank.
export function shopStock(rankIdx) {
  const items = Object.entries(ITEMS)
    .filter(([, it]) => !it.minRank || RANKS.indexOf(it.minRank) <= rankIdx)
    .map(([id]) => id);
  return items;
}
