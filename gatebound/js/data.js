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
    skills: { 1: 'twin_fangs', 4: 'shadow_rush', 7: 'execute', 10: 'limit_break', 16: 'monarchs_edge', 22: 'phantom_step', 30: 'system_purge', 42: 'sovereign' },
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
    skills: { 1: 'shield_bash', 2: 'rallying_taunt', 5: 'aegis', 18: 'valkyrie_dance', 22: 'guardian_wall', 30: 'riposte' },
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
    skills: { 1: 'firebloom', 2: 'prism_lance', 16: 'starfall', 22: 'nova_lance', 30: 'cinderfall' },
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
    skills: { 1: 'mend', 2: 'frost_sigil', 6: 'checkmate', 18: 'zugzwang', 20: 'sanctuary', 28: 'stasis' },
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
    skills: { 1: 'desperate_swing', 2: 'encourage', 10: 'resolve_strike', 16: 'covering_vow', 26: 'radiant_poise' },
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
  haste:     { name: 'Haste',      icon: '➤', kind: 'buff',   mods: { agi: 0.4 } },
  focus_up:  { name: 'Focused',    icon: '◆', kind: 'buff',   mods: { mag: 0.3, res: 0.15 } },
  bleed:     { name: 'Bleeding',   icon: '🩸', kind: 'debuff', dot: 0.055 },
  vulnerable:{ name: 'Exposed',    icon: '⊗', kind: 'debuff', takenUp: 0.25 },
  enrage:    { name: 'Enraged',    icon: '🔺', kind: 'buff',   mods: { atk: 0.4, def: -0.15 } },
  blessed:   { name: 'Blessed',    icon: '✚', kind: 'buff',   hot: 0.12 },
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
  limit_break:   { name: 'Limit Break', type: 'support', mp: 14, target: 'self', anim: 'buff', freeAction: true, apply: { to: 'target', id: 'atk_up_big', turns: 3 }, desc: 'The System removes your limits. +50% ATK, +20% AGI for 3 turns. Free action — doesn\'t use your turn (once per turn).' },
  monarchs_edge: { name: "Monarch's Edge", type: 'phys', power: 1.15, mp: 26, target: 'all_enemies', anim: 'dash', desc: 'A single step, a dozen cuts. Hits every enemy.' },
  phantom_step:  { name: 'Phantom Step', type: 'phys', power: 0.62, hits: 3, mp: 18, target: 'enemy', anim: 'dash', apply: { to: 'self', id: 'haste', turns: 2 }, desc: 'Three cuts between heartbeats. Grants Haste.' },
  system_purge:  { name: 'System Purge', type: 'phys', power: 2.2, mp: 24, target: 'enemy', anim: 'melee', apply: { to: 'target', id: 'vulnerable', turns: 2 }, desc: 'Flag a target for deletion — it takes +25% damage.' },
  sovereign:     { name: 'Sovereign Right', type: 'phys', power: 1.55, mp: 44, target: 'all_enemies', anim: 'dash', apply: { to: 'target', id: 'bleed', turns: 3, chance: 0.85 }, desc: 'The System stops pretending you are mortal. Hits all; leaves them Bleeding.' },

  // Erin
  shield_bash:   { name: 'Shield Bash', type: 'phys', power: 0.95, mp: 7, target: 'enemy', anim: 'melee', apply: { to: 'target', id: 'stun', turns: 1, chance: 0.75 }, desc: 'A ringing blow. 75% chance to stun.' },
  rallying_taunt:{ name: 'Rallying Taunt', type: 'support', mp: 8, target: 'self', anim: 'buff', apply: [{ to: 'target', id: 'taunt', turns: 2 }, { to: 'target', id: 'def_up', turns: 2 }], desc: 'Draw every eye in the room. Enemies must attack Erin; +35% DEF/RES.' },
  aegis:         { name: 'Aegis', type: 'support', mp: 10, target: 'ally', anim: 'buff', shieldPower: 2.2, desc: 'Project a golden ward absorbing damage based on Erin\'s DEF.' },
  valkyrie_dance:{ name: 'Valkyrie Dance', type: 'phys', power: 0.8, mp: 20, target: 'all_enemies', anim: 'dash', desc: 'A whirl of steel and blue scarf. Hits every enemy.' },
  guardian_wall: { name: 'Guardian Wall', type: 'support', mp: 24, target: 'all_allies', anim: 'buff', shieldPower: 1.4, desc: 'A golden ward over the whole party, scaled to Erin\'s DEF.' },
  riposte:       { name: 'Riposte', type: 'phys', power: 1.7, mp: 16, target: 'enemy', anim: 'melee', apply: { to: 'target', id: 'stun', turns: 1, chance: 0.5 }, desc: 'Punish the overcommitted. Heavy blow, may stun.' },

  // Sakura
  arcane_bolt:   { name: 'Arcane Bolt', type: 'mag', power: 1.0, mp: 0, target: 'enemy', anim: 'cast', desc: 'A dart of green starlight.' },
  firebloom:     { name: 'Firebloom', type: 'mag', power: 0.85, mp: 12, target: 'all_enemies', anim: 'cast', apply: { to: 'target', id: 'burn', turns: 2, chance: 0.6 }, desc: 'Petals of flame burst over the field. May burn.' },
  prism_lance:   { name: 'Prism Lance', type: 'mag', power: 1.8, mp: 15, target: 'enemy', anim: 'cast', desc: 'A refracted spear of condensed mana.' },
  starfall:      { name: 'Starfall', type: 'mag', power: 1.5, mp: 32, target: 'all_enemies', anim: 'cast', desc: 'She whispers an apology, and the sky answers.' },
  nova_lance:    { name: 'Nova Lance', type: 'mag', power: 2.7, mp: 28, target: 'enemy', anim: 'cast', desc: 'Every scrap of mana she has, in one apologetic point.' },
  cinderfall:    { name: 'Cinderfall', type: 'mag', power: 1.2, mp: 34, target: 'all_enemies', anim: 'cast', apply: { to: 'target', id: 'burn', turns: 3, chance: 0.85 }, desc: 'The sky opens and does not apologize. Burns everything.' },

  // Shiro
  mend:          { name: 'Mend', type: 'heal', power: 2.3, mp: 9, target: 'ally', anim: 'cast', desc: 'Precise restorative sigils.' },
  frost_sigil:   { name: 'Frost Sigil', type: 'mag', power: 0.6, mp: 10, target: 'enemy', anim: 'cast', apply: [{ to: 'target', id: 'def_down', turns: 2 }, { to: 'target', id: 'res_down', turns: 2 }], desc: 'Brands a foe with cracking ice. −30% DEF and RES.' },
  checkmate:     { name: 'Checkmate', type: 'mag', power: 1.2, mp: 16, target: 'enemy', anim: 'cast', perDebuff: 0.4, desc: '+40% damage per debuff on the target. The board was set turns ago.' },
  zugzwang:      { name: 'Zugzwang', type: 'support', mp: 22, target: 'all_enemies', anim: 'cast', apply: { to: 'target', id: 'atk_down', turns: 2 }, desc: 'Every move they can make is a losing one. Weakens all enemies.' },
  sanctuary:     { name: 'Sanctuary', type: 'heal', power: 1.5, mp: 30, target: 'all_allies', anim: 'cast', desc: 'The board resets. Restore the whole party.' },
  stasis:        { name: 'Stasis', type: 'mag', power: 0.5, mp: 20, target: 'enemy', anim: 'cast', apply: [{ to: 'target', id: 'stun', turns: 1, chance: 0.85 }, { to: 'target', id: 'agi_down', turns: 2 }], desc: 'Freeze a threat mid-move. Likely stun; always slows.' },

  // Yuki
  desperate_swing:{ name: 'Desperate Swing', type: 'phys', power: 1.0, mp: 0, target: 'enemy', anim: 'melee', variance: 0.55, desc: 'Sometimes it even connects.' },
  encourage:     { name: 'Encourage', type: 'support', mp: 8, target: 'all_allies', anim: 'buff', apply: { to: 'target', id: 'atk_up', turns: 2 }, desc: 'His faith in you is embarrassingly sincere. Party +25% ATK/MAG.' },
  resolve_strike:{ name: 'Resolve', type: 'phys', power: 1.35, mp: 8, target: 'enemy', anim: 'melee', desc: 'He stopped flinching. It shows.' },
  covering_vow:  { name: 'Covering Vow', type: 'support', mp: 12, target: 'ally', anim: 'buff', shieldPower: 1.6, desc: 'Steps in front of someone he loves. A shield scaled to his DEF.' },
  radiant_poise: { name: 'Radiant Poise', type: 'support', mp: 16, target: 'all_allies', anim: 'buff', apply: { to: 'target', id: 'haste', turns: 2 }, desc: 'The System reclassified more than his silhouette. The party moves like water.' },

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
  e_enrage:      { name: 'Enrage', type: 'support', mp: 0, target: 'self', anim: 'buff', cooldown: 5, apply: { to: 'self', id: 'enrage', turns: 3 }, desc: 'Fury feeds its blows.' },
  e_devastate:   { name: 'Devastate', type: 'phys', power: 1.3, mp: 0, target: 'all_enemies', anim: 'melee', cooldown: 4, desc: 'A room-clearing blow.' },
  e_rend:        { name: 'Rend', type: 'phys', power: 1.5, mp: 0, target: 'enemy', anim: 'melee', cooldown: 2, apply: { to: 'target', id: 'bleed', turns: 3, chance: 0.7 } },
  e_hex:         { name: 'Withering Hex', type: 'mag', power: 0.8, mp: 0, target: 'all_enemies', anim: 'cast', cooldown: 3, apply: { to: 'target', id: 'vulnerable', turns: 2, chance: 0.6 } },
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
  revenant:      { name: 'Revenant',        model: 'skeleton', variant: 'revenant', base: { hp: 92, atk: 16, mag: 6, def: 11, res: 7, agi: 7 }, skills: ['strike', 'e_rend', 'e_sunder'], xp: 19, gold: 14 },
  banshee:       { name: 'Banshee',         model: 'wraith',   variant: 'banshee', base: { hp: 58, atk: 6, mag: 18, def: 6, res: 13, agi: 13 }, skills: ['e_aoe_mag', 'e_curse', 'e_frost'], xp: 20, gold: 16 },
  dark_acolyte:  { name: 'Dark Acolyte',    model: 'cultist',  variant: 'acolyte', base: { hp: 66, atk: 8, mag: 17, def: 7, res: 13, agi: 10 }, skills: ['e_hex', 'e_ember', 'e_heal'], xp: 20, gold: 17 },
  war_golem:     { name: 'War Golem',       model: 'golem',    variant: 'war', base: { hp: 118, atk: 17, mag: 5, def: 15, res: 9, agi: 5 }, skills: ['strike', 'e_devastate', 'e_sunder'], xp: 22, gold: 17 },
  ice_wisp:      { name: 'Rime Wisp',       model: 'sprite',   variant: 'ice', base: { hp: 52, atk: 6, mag: 17, def: 5, res: 14, agi: 16 }, skills: ['e_frost', 'e_aoe_mag'], xp: 19, gold: 15 },
  frost_giant:   { name: 'Frost Giant',     model: 'yeti',     variant: 'giant', base: { hp: 130, atk: 19, mag: 6, def: 12, res: 9, agi: 6 }, skills: ['e_smash', 'e_devastate', 'e_howl'], xp: 23, gold: 18 },
  abyss_hound:   { name: 'Abyssal Hound',   model: 'wolf',     variant: 'abyss', base: { hp: 84, atk: 19, mag: 9, def: 9, res: 8, agi: 16 }, skills: ['e_bite', 'e_rend', 'e_howl'], xp: 22, gold: 17 },

  // Bosses (spawned solo or with adds; ×boss multiplier on top of scaling)
  goblin_chief:  { name: 'Goblin Chieftain', model: 'goblin', variant: 'chief', boss: true, base: { hp: 95, atk: 15, mag: 8, def: 8, res: 7, agi: 10 }, skills: ['strike', 'e_smash', 'e_howl'], xp: 42, gold: 40 },
  dire_wolf:     { name: 'Dire Alpha',      model: 'wolf',    variant: 'dire', boss: true, base: { hp: 90, atk: 17, mag: 5, def: 8, res: 7, agi: 15 }, skills: ['e_bite', 'e_howl', 'e_aoe_phys'], xp: 42, gold: 38 },
  elder_treant:  { name: 'Elder Treant',    model: 'vine',    variant: 'elder', boss: true, base: { hp: 120, atk: 15, mag: 12, def: 11, res: 10, agi: 5 }, skills: ['e_smash', 'e_venom', 'e_aoe_phys', 'e_heal'], xp: 46, gold: 42 },
  bone_tyrant:   { name: 'Bone Tyrant',     model: 'skeleton',variant: 'tyrant', boss: true, base: { hp: 110, atk: 17, mag: 12, def: 10, res: 8, agi: 9 }, skills: ['strike', 'e_sunder', 'e_curse', 'e_aoe_mag'], xp: 46, gold: 44 },
  colossus:      { name: 'Ruin Colossus',   model: 'golem',   variant: 'colossus', boss: true, base: { hp: 150, atk: 18, mag: 8, def: 15, res: 10, agi: 4 }, skills: ['e_smash', 'e_aoe_phys', 'e_sunder'], xp: 50, gold: 48 },
  frost_matriarch:{ name: 'Frost Matriarch', model: 'elemental', variant: 'matriarch', boss: true, base: { hp: 130, atk: 12, mag: 20, def: 10, res: 14, agi: 10 }, skills: ['e_frost', 'e_aoe_mag', 'e_heal', 'e_curse'], xp: 52, gold: 50 },
  pit_lord:      { name: 'Pit Lord',        model: 'demon',   boss: true, base: { hp: 140, atk: 20, mag: 16, def: 12, res: 11, agi: 11 }, skills: ['e_smash', 'e_ember', 'e_aoe_mag', 'e_howl'], xp: 56, gold: 55 },
  herald:        { name: 'Herald of the Monarch', model: 'herald', boss: true, base: { hp: 175, atk: 22, mag: 20, def: 14, res: 14, agi: 13 }, skills: ['e_smash', 'e_aoe_mag', 'e_curse', 'e_howl', 'e_sunder', 'e_enrage'], xp: 120, gold: 150 },
  wraith_queen:  { name: 'The Weeping Queen', model: 'wraith', variant: 'queen', boss: true, base: { hp: 118, atk: 10, mag: 20, def: 9, res: 15, agi: 12 }, skills: ['e_aoe_mag', 'e_hex', 'e_curse', 'e_heal', 'e_enrage'], xp: 48, gold: 46 },
  ruin_archon:   { name: 'Ruin Archon',     model: 'sentinel', variant: 'archon', boss: true, base: { hp: 150, atk: 18, mag: 14, def: 15, res: 11, agi: 8 }, skills: ['e_devastate', 'e_sunder', 'e_aoe_mag', 'e_enrage'], xp: 52, gold: 50 },
  rime_sovereign:{ name: 'Rime Sovereign',  model: 'elemental', variant: 'sovereign', boss: true, base: { hp: 138, atk: 12, mag: 22, def: 11, res: 15, agi: 11 }, skills: ['e_frost', 'e_aoe_mag', 'e_devastate', 'e_heal', 'e_enrage'], xp: 54, gold: 52 },
  demon_general: { name: 'Demon General',   model: 'demon',    variant: 'general', boss: true, base: { hp: 158, atk: 22, mag: 15, def: 13, res: 12, agi: 12 }, skills: ['e_devastate', 'e_rend', 'e_ember', 'e_howl', 'e_enrage'], xp: 58, gold: 56 },
  void_seraph:   { name: 'Seraph of the Weave', model: 'herald', variant: 'seraph', boss: true, base: { hp: 190, atk: 23, mag: 22, def: 15, res: 15, agi: 14 }, skills: ['e_devastate', 'e_aoe_mag', 'e_hex', 'e_rend', 'e_enrage'], xp: 130, gold: 160 },
};

// ------------------------------------------------------------
// Biomes & gate generation
// ------------------------------------------------------------

export const BIOMES = {
  cave:   { name: 'Cavern',  minRank: 'F', tint: 0x4a6a50, fog: 0x0c1410, floor: 0x2a3a2e, mobs: ['goblin', 'goblin_archer', 'goblin_shaman', 'wolf'], bosses: ['goblin_chief', 'dire_wolf'],
            names: ['{adj} Warren', '{adj} Burrow', 'Den of {noun}'], adj: ['Howling', 'Sunless', 'Craggy', 'Mossgrown'], noun: ['Fangs', 'Echoes', 'the Broodmother'] },
  forest: { name: 'Wildwood', minRank: 'F', tint: 0x4f7a3a, fog: 0x0d140a, floor: 0x31402a, mobs: ['wolf', 'boar', 'sprite', 'vine_horror'], bosses: ['elder_treant', 'dire_wolf'],
            names: ['{adj} Thicket', '{adj} Glade', 'Grove of {noun}'], adj: ['Whispering', 'Strangling', 'Verdant', 'Thorned'], noun: ['Roots', 'Hunger', 'the Old Stag'] },
  crypt:  { name: 'Crypt',   minRank: 'D', tint: 0x6a5a8a, fog: 0x0d0a14, floor: 0x2e2a3a, mobs: ['skeleton', 'ghoul', 'wraith', 'revenant', 'banshee'], bosses: ['bone_tyrant', 'wraith_queen'],
            names: ['{adj} Ossuary', '{adj} Barrow', 'Tomb of {noun}'], adj: ['Sunken', 'Weeping', 'Hollow', 'Forgotten'], noun: ['Kings', 'the Unquiet', 'Silence'] },
  ruins:  { name: 'Ruins',   minRank: 'C', tint: 0x8a7a5a, fog: 0x14100a, floor: 0x3a342a, mobs: ['golem', 'gargoyle', 'sentinel', 'skeleton', 'revenant', 'war_golem', 'dark_acolyte'], bosses: ['colossus', 'bone_tyrant', 'ruin_archon'],
            names: ['{adj} Bastion', '{adj} Spire', 'Halls of {noun}'], adj: ['Shattered', 'Toppled', 'Gilded', 'Nameless'], noun: ['the Architect', 'Dust', 'the First Guild'] },
  frost:  { name: 'Glacier', minRank: 'B', tint: 0x6a9ab8, fog: 0x0a1014, floor: 0x2a343a, mobs: ['frost_wolf', 'ice_elemental', 'yeti', 'ice_wisp', 'frost_giant', 'war_golem'], bosses: ['frost_matriarch', 'rime_sovereign'],
            names: ['{adj} Crevasse', '{adj} Reach', 'Throat of {noun}'], adj: ['Screaming', 'Pale', 'Starving', 'Glasswind'], noun: ['Winter', 'the White Wyrm', 'Stillness'] },
  demon:  { name: 'Abyss',   minRank: 'A', tint: 0xb85a5a, fog: 0x140a0a, floor: 0x3a2a2a, mobs: ['imp', 'hellhound', 'cultist', 'wraith', 'banshee', 'dark_acolyte', 'abyss_hound'], bosses: ['pit_lord', 'demon_general'],
            names: ['{adj} Maw', '{adj} Descent', 'Choir of {noun}'], adj: ['Burning', 'Grinning', 'Bottomless', 'Red'], noun: ['Embers', 'the Torn Veil', 'Teeth'] },
  void:   { name: 'The Weave', minRank: 'S', tint: 0x8a6ad8, fog: 0x0a0814, floor: 0x241f38, mobs: ['wraith', 'banshee', 'revenant', 'dark_acolyte', 'sentinel', 'abyss_hound'], bosses: ['void_seraph', 'wraith_queen', 'demon_general'],
            names: ['{adj} Rift', '{adj} Nadir', 'Choir of {noun}'], adj: ['Unwritten', 'Starless', 'Folding', 'Hollow'], noun: ['the Monarch', 'Endings', 'the First Word'] },
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

// ------------------------------------------------------------
// Gear affixes — special properties that hook into combat.
// The combat engine reads an aggregated loadout (see state.heroLoadout).
// Each affix is valid on one slot. onHit = chance to inflict a status.
// ------------------------------------------------------------

export const AFFIXES = {
  // weapons
  flame:      { name: 'Flametongue', slot: 'weapon', desc: 'Attacks may Burn the target.',        onHit: { id: 'burn', turns: 2, chance: 0.35 } },
  frost:      { name: 'Frostbrand',  slot: 'weapon', desc: 'Attacks may Slow the target.',         onHit: { id: 'agi_down', turns: 2, chance: 0.4 } },
  venom:      { name: 'Venomous',    slot: 'weapon', desc: 'Attacks may Poison the target.',       onHit: { id: 'poison', turns: 3, chance: 0.35 } },
  cruel:      { name: 'Cruel',       slot: 'weapon', desc: 'Attacks may cause Bleeding.',           onHit: { id: 'bleed', turns: 3, chance: 0.3 } },
  vampiric:   { name: 'Vampiric',    slot: 'weapon', desc: 'Heal for 20% of damage dealt.',        lifesteal: 0.2 },
  keen:       { name: 'Keen',        slot: 'weapon', desc: '+12% critical chance.',                 crit: 0.12 },
  savage:     { name: 'Savage',      slot: 'weapon', desc: '+40% critical damage.',                 critDmg: 0.4 },
  arcane:     { name: 'Arcane',      slot: 'weapon', desc: '+16% damage with magic skills.',        skillDmg: { mag: 0.16 } },
  brutal:     { name: 'Brutal',      slot: 'weapon', desc: '+16% damage with physical skills.',     skillDmg: { phys: 0.16 } },
  headsmans:  { name: "Headsman's",  slot: 'weapon', desc: '+30% damage to foes below 40% HP.',     execBonus: 0.3 },
  // armor
  thorned:    { name: 'Thorned',     slot: 'armor',  desc: 'Reflect 25% of melee damage taken.',    thorns: 0.25 },
  warding:    { name: 'Warding',     slot: 'armor',  desc: 'Begin each battle with a shield.',       startShield: 0.15 },
  living:     { name: 'Living',      slot: 'armor',  desc: 'Regenerate 5% HP each turn.',            regen: 0.05 },
  bulwark:    { name: 'Bulwark',     slot: 'armor',  desc: 'Take 12% less damage.',                  dr: 0.12 },
  stalwart:   { name: 'Stalwart',    slot: 'armor',  desc: 'Immune to being Stunned.',               stunImmune: true },
  // charms
  swift:      { name: 'Swift',       slot: 'charm',  desc: 'Restore 5 MP each turn.',                mpRegen: 5 },
  lucky:      { name: 'Lucky',       slot: 'charm',  desc: '+18% critical chance.',                  crit: 0.18 },
  focused:    { name: 'Focused',     slot: 'charm',  desc: '+10% to all skill damage.',              skillDmg: { phys: 0.1, mag: 0.1 } },
  blessed:    { name: "Cleric's",    slot: 'charm',  desc: 'Healing given and received +30%.',       healPower: 0.3 },
  vigor:      { name: 'Vigorous',    slot: 'charm',  desc: 'Start each battle with Haste.',          startHaste: true },
};

// affix roll chance per tier index (Iron never rolls; Monarch's almost always).
const AFFIX_CHANCE = [0, 0.12, 0.25, 0.42, 0.62, 0.85];

export function makeGear(slot, tierIdx, rng, forceAffix = false) {
  const base = GEAR_BASES[slot][Math.floor(rng() * GEAR_BASES[slot].length)];
  const power = GEAR_TIER_POWER[tierIdx];
  const stats = {};
  for (const [k, w] of Object.entries(base.stats)) {
    stats[k] = Math.round(power * w * GEAR_STAT_SCALE[k] * (0.9 + rng() * 0.2));
  }
  const g = {
    id: 'g' + Math.floor(rng() * 1e9).toString(36) + tierIdx,
    slot, tier: tierIdx,
    name: `${GEAR_TIERS[tierIdx]} ${base.name}`,
    stats,
  };
  if (forceAffix || rng() < (AFFIX_CHANCE[tierIdx] || 0)) {
    const pool = Object.keys(AFFIXES).filter(id => AFFIXES[id].slot === slot);
    if (pool.length) {
      const aid = pool[Math.floor(rng() * pool.length)];
      g.affix = aid;
      g.name = `${AFFIXES[aid].name} ${g.name}`;
    }
  }
  return g;
}

export function gearScore(g) {
  const stat = Object.entries(g.stats).reduce((a, [k, v]) => a + v / GEAR_STAT_SCALE[k], 0) | 0;
  return stat + (g.affix ? 8 + g.tier * 3 : 0);
}

// Shop stock scales with guild rank.
export function shopStock(rankIdx) {
  const items = Object.entries(ITEMS)
    .filter(([, it]) => !it.minRank || RANKS.indexOf(it.minRank) <= rankIdx)
    .map(([id]) => id);
  return items;
}
