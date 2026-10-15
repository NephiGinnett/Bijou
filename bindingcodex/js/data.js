// ============================================================
// BINDING CODEX — game data & balance
// All static tables: circles, heroes, skills, statuses, enemies,
// biomes, tarot, reagents, potions, pacts, gear. No state here.
// ============================================================

// The six Circles of the Codex replace Gatebound's F→S license ranks.
export const RANKS = ['Ash', 'Ember', 'Hex', 'Thorn', 'Crown', 'Abyss'];
export const CIRCLES = RANKS;

export const RANK_STYLE = {
  Ash:   { color: '#9a9490', glow: 'rgba(154,148,144,.35)', glyph: 'Ⅰ' },
  Ember: { color: '#e8823a', glow: 'rgba(232,130,58,.38)',  glyph: 'Ⅱ' },
  Hex:   { color: '#9a6ae8', glow: 'rgba(154,106,232,.4)',  glyph: 'Ⅲ' },
  Thorn: { color: '#5aa86a', glow: 'rgba(90,168,106,.38)',  glyph: 'Ⅳ' },
  Crown: { color: '#d8b04a', glow: 'rgba(216,176,74,.45)',  glyph: 'Ⅴ' },
  Abyss: { color: '#d84a6a', glow: 'rgba(216,74,106,.5)',   glyph: 'Ⅵ' },
};

// Infamy needed to be inscribed OUT of each Circle.
export const RANK_UP_GP = { Ash: 90, Ember: 260, Hex: 620, Thorn: 1250, Crown: 2300 };

// Infamy awarded for clearing a rift of each Circle.
export const GATE_GP = { Ash: 30, Ember: 70, Hex: 150, Thorn: 320, Crown: 640, Abyss: 1500 };

export const XP_MULT = { Ash: 1, Ember: 1.9, Hex: 3.4, Thorn: 5.8, Crown: 9.5, Abyss: 15 };

// Enemy stat scaling per Circle. Softer than XP_MULT early on: the warlock
// starts nearly alone, not with three veterans like Gatebound did.
export const ENEMY_TIER = { Ash: 0.52, Ember: 1.3, Hex: 2.7, Thorn: 5.0, Crown: 8.6, Abyss: 14 };

export function xpToNext(level) {
  return Math.round(50 * Math.pow(level, 1.45));
}

// ------------------------------------------------------------
// Heroes
// ------------------------------------------------------------
// The warlock starts alone with a fresh mark; Vesper, Rue and Isolde
// join through intro arcs. The Codex cast petitions after inscriptions.

export const HEROES = {
  player: {
    id: 'player',
    name: 'Zoe', // renamed at new game
    epithet: 'the Foretold Storm',
    cls: 'Warlock',
    desc: 'A warlock\'s mark, still warm. Direct, patient, certain — and not in the habit of explaining. The Codex has begun writing about you before you act.',
    stages: [
      { cond: S => S.cleared, desc: 'The warlock who walked into the Ashen Heart and came back out. The Chronicle has stopped predicting you; it only keeps up now, and barely.' },
      { cond: S => S.circleIdx >= 4, desc: 'Inscribed in the Crown Circle. Covens whisper your name the way the Vigil once whispered "storm." The mark on your skin no longer cools at all.' },
      { cond: S => S.circleIdx >= 2, desc: 'Hex Circle, and climbing. Every pact you swear lands in the Codex in a hand nobody recognizes — and lately, a day or two early.' },
    ],
    startLevel: 1,
    base:   { hp: 100, mp: 40, atk: 12, mag: 15, def: 10, res: 11, agi: 12, luk: 10 },
    growth: { hp: 14,  mp: 5,  atk: 2.4, mag: 3.1, def: 2.2, res: 2.3, agi: 1.8, luk: 1.2 },
    skills: { 1: 'hex_bolt', 2: 'hex_of_yielding', 5: 'umbral_cut', 8: 'pact_surge', 12: 'chain_sigil_p', 18: 'storm_call', 26: 'word_of_silence', 36: 'abyssal_verdict' },
    passive: { id: 'mark', name: 'The Mark', desc: 'Gains +10% XP. Binding Seals cast by the warlock are 15% stronger.', sealBonus: 0.15 },
    role: 'striker',
  },
  vesper: {
    id: 'vesper', core: true,
    name: 'Vesper', epithet: 'Keeper of the Codex', cls: 'Archivist',
    desc: 'Vesper Morrow, last Keeper of the Codex, three hundred years cataloguing other people\'s power and never claiming her own. Sharp-tongued, ink-fingered, quietly dangerous: she knows the true names of things and isn\'t above using them.',
    stages: [
      { cond: S => (S.bond.vesper || 0) >= 7, desc: 'The Keeper, who reads the Tarot each night and pretends the omens are about the Coven. The sigil on her wrist hasn\'t cooled in weeks. She mispronounces old Arcana on purpose, still — just to hear you correct her.' },
    ],
    startLevel: 3,
    base:   { hp: 86, mp: 60, atk: 6, mag: 17, def: 7, res: 14, agi: 10, luk: 11 },
    growth: { hp: 7,  mp: 6,  atk: 0.7, mag: 2.5, def: 1.0, res: 2.0, agi: 1.2, luk: 1.1 },
    skills: { 1: 'ink_lash', 2: 'chain_sigil', 4: 'page_of_mending', 9: 'omen_draw', 15: 'true_name', 24: 'bleeding_ink' },
    passive: { id: 'keepers_eye', name: 'Keeper\'s Eye', desc: 'Reveals enemy Will and weaknesses. Foes she has read take +10% damage.', reveal: true },
    role: 'caster',
  },
  rue: {
    id: 'rue', core: true,
    name: 'Rue', epithet: 'of the Ninth Ember', cls: 'Demon',
    desc: 'A demon of the Ninth Ember: small by infernal standards, enormous by her own. Owes you three favors, resents every one, and is "only staying until the debt\'s paid." The brand on her collarbone flares when she lies. It flares a lot.',
    stages: [
      { cond: S => (S.bond.rue || 0) >= 7, desc: 'Still "only staying until the debt\'s paid." Still zero favors repaid, on purpose. Would burn a city down for you without being asked — and then deny, loudly, brand blazing, that it was for you.' },
    ],
    startLevel: 6,
    base:   { hp: 92, mp: 38, atk: 16, mag: 12, def: 8, res: 9, agi: 16, luk: 13 },
    growth: { hp: 8,  mp: 3,  atk: 2.3, mag: 1.6, def: 1.0, res: 1.2, agi: 1.9, luk: 1.3 },
    skills: { 1: 'ember_claw', 2: 'infernal_leer', 5: 'tail_trip', 10: 'stolen_spark', 16: 'ninth_ember', 25: 'hellmouth' },
    passive: { id: 'three_favors', name: 'Three Favors', desc: 'Once per run, cancels a lethal hit on an ally — then sulks about it.', favor: true },
    role: 'striker',
  },
  isolde: {
    id: 'isolde', core: true,
    name: 'Isolde', epithet: 'of the Last Vigil', cls: 'Oathknight',
    desc: 'Dame Isolde Varr, last knight of the Order of the Last Vigil — sent to slay the foretold storm, and knelt instead. Stoic, formal, few words. Devotion in what she does, not what she says.',
    stages: [
      { cond: S => (S.bond.isolde || 0) >= 7, desc: 'Your sword, by her own word. The runes on her armor glow faintly violet; she counts them when she thinks no one is watching. She still has not removed her gauntlets in front of anyone.' },
    ],
    startLevel: 10,
    base:   { hp: 150, mp: 24, atk: 14, mag: 4, def: 16, res: 11, agi: 8, luk: 7 },
    growth: { hp: 12,  mp: 2,  atk: 2.0, mag: 0.6, def: 2.1, res: 1.6, agi: 0.9, luk: 0.8 },
    skills: { 1: 'shield_pin', 2: 'vigil_stance', 4: 'iron_grapple', 9: 'oath_ward', 16: 'kneeling_sword', 25: 'seventh_rune' },
    passive: { id: 'last_vigil', name: 'Last Vigil', desc: 'Once per round, intercepts a hit aimed at an ally below 30% HP. Her grapples drain extra Will.', cover: true, grappleBonus: 0.25 },
    role: 'tank',
  },

  // ---- The Dawnward party (Gatebound cast, here a neutral A-rank company) ----
  // rival: true keeps them out of the roster. They are rift-closers for the
  // Hunters' Lodge who consider warlocks a problem to be solved — later
  // story arcs can turn them into foes, captives, or allies.
  erin: {
    id: 'erin', rival: true,
    name: 'Erin', epithet: 'the Golden Knight', cls: 'Knight',
    desc: 'The Dawnward Company\'s unbreakable wall: warm, honest to a fault, first through every rift. She has heard warlocks eat hearts. She would like to check.',
    startLevel: 24,
    base:   { hp: 150, mp: 22, atk: 13, mag: 4, def: 15, res: 10, agi: 8, luk: 6 },
    growth: { hp: 11,  mp: 2,  atk: 2.0, mag: 0.8, def: 2.0, res: 1.5, agi: 1.0, luk: 0.8 },
    skills: { 1: 'shield_bash', 2: 'rallying_taunt', 5: 'aegis', 18: 'valkyrie_dance', 22: 'guardian_wall', 30: 'riposte' },
    passive: { id: 'cover', name: 'Shieldmaiden', desc: 'Once per round, intercepts a hit aimed at an ally below 30% HP.', cover: true },
    role: 'tank',
  },
  sakura: {
    id: 'sakura', rival: true,
    name: 'Sakura', epithet: 'the Petal Storm', cls: 'Mage',
    desc: 'A timid elf who apologizes to doors — and the most dangerous arcane talent in the Lodge. Fascinated by the Codex. Terrified of being fascinated.',
    startLevel: 24,
    base:   { hp: 82, mp: 62, atk: 5, mag: 19, def: 6, res: 13, agi: 9, luk: 9 },
    growth: { hp: 7,  mp: 6,  atk: 0.6, mag: 2.7, def: 1.0, res: 1.9, agi: 1.1, luk: 1.0 },
    skills: { 1: 'firebloom', 2: 'prism_lance', 16: 'starfall', 22: 'nova_lance', 30: 'cinderfall' },
    passive: { id: 'timid_prodigy', name: 'Timid Prodigy', desc: '+20% MAG while Erin stands. −10% if Erin falls.' },
    role: 'caster',
  },
  shiro: {
    id: 'shiro', rival: true,
    name: 'Shiro', epithet: 'the White Queen', cls: 'Tactician',
    desc: 'Reads a battlefield like a chessboard and people like boring books. Keeps a ledger on you already. It is longer than she would like.',
    startLevel: 24,
    base:   { hp: 94, mp: 56, atk: 6, mag: 15, def: 8, res: 15, agi: 10, luk: 8 },
    growth: { hp: 8,  mp: 5,  atk: 0.7, mag: 2.1, def: 1.2, res: 2.0, agi: 1.3, luk: 1.0 },
    skills: { 1: 'mend', 2: 'frost_sigil', 6: 'checkmate', 18: 'zugzwang', 20: 'sanctuary', 28: 'stasis' },
    passive: { id: 'grand_design', name: 'Grand Design', desc: 'At the start of each round, marks the weakest enemy: it takes +15% damage.' },
    role: 'healer',
  },
  yuki: {
    id: 'yuki', rival: true,
    name: 'Yuki', epithet: 'the Earnest', cls: 'Hunter',
    desc: 'The Dawnward Company\'s youngest, kind and trying so hard it hurts to watch. Thinks everyone deserves a second chance. Even warlocks. Especially, lately, one.',
    startLevel: 18,
    base:   { hp: 88, mp: 26, atk: 10, mag: 6, def: 9, res: 8, agi: 8, luk: 12 },
    growth: { hp: 8,  mp: 2,  atk: 1.4, mag: 0.8, def: 1.2, res: 1.0, agi: 0.9, luk: 1.5 },
    skills: { 1: 'desperate_swing', 2: 'encourage', 10: 'resolve_strike', 16: 'covering_vow', 26: 'radiant_poise' },
    passive: { id: 'lucky_lamb', name: 'Lucky Lamb', desc: 'Somehow survives. +15% chance attacks against them miss.', dodge: 0.15 },
    role: 'support',
  },

  // ---- Hub recruits (the Codex cast) ----
  // recruit: true keeps them out of the roster until signed.
  // arrive: { circle: N, day: D } — petitions open once you're inscribed
  // in Circle N, staggered D days after that inscription.
  mira: {
    id: 'mira', recruit: true, arrive: { circle: 1, day: 0 },
    name: 'Mira', epithet: 'the Bold', cls: 'Sellsword',
    desc: 'Mira Ashvale, twenty-nine, sellsword. Broad shoulders, honest scars, a contract rate she quotes without blinking. She heard there\'s a warlock hiring who pays in coin and doesn\'t ask questions. She has questions anyway.',
    stages: [
      { cond: S => (S.allies || []).includes('mira'), desc: 'Mira Ashvale, formerly of everywhere, now of the Codex. Holds the stair door, holds the watch, threatens anyone who hugs her, hugs back.' },
    ],
    persona: 'A veteran mercenary: wry, professional, unimpressed by titles and very impressed by competence.',
    startLevel: 8,
    base:   { hp: 145, mp: 24, atk: 15, mag: 4, def: 13, res: 9, agi: 10, luk: 8 },
    growth: { hp: 11,  mp: 2,  atk: 2.2, mag: 0.7, def: 1.8, res: 1.4, agi: 1.1, luk: 0.9 },
    skills: { 1: 'sunder_strike', 2: 'war_banner', 6: 'stand_fast', 14: 'crushing_blow', 24: 'rampart_cleave' },
    passive: { id: 'paid_in_full', name: 'Paid in Full', desc: 'A professional\'s eye for spoils: +25% gold from battles she fights in.', goldMult: 0.25 },
    role: 'tank',
  },
  nessa: {
    id: 'nessa', recruit: true, arrive: { circle: 1, day: 2 },
    name: 'Nessa', epithet: 'the Hedgewitch', cls: 'Herbalist',
    desc: 'Nessa Vale kept a market stall in the dead city and made house calls nobody else would. She arrived at the Codex\'s drowned stair with a basket of tinctures and a petition rehearsed forty times.',
    stages: [
      { cond: S => (S.allies || []).includes('nessa'), desc: 'The Codex\'s hedgewitch, who reorganized the infirmary alcove on day one. Her plants grow strangely well in the Menagerie\'s light. She is trying not to think about why.' },
    ],
    persona: 'A shy, sweet herbalist who goes steel-spined the moment a patient is in danger.',
    startLevel: 8,
    base:   { hp: 100, mp: 58, atk: 7, mag: 14, def: 8, res: 12, agi: 9, luk: 11 },
    growth: { hp: 8,   mp: 5,  atk: 0.8, mag: 2.0, def: 1.2, res: 1.8, agi: 1.0, luk: 1.2 },
    skills: { 1: 'salve', 2: 'nettle_flask', 6: 'soothing_word', 14: 'tonic_mist', 24: 'panacea' },
    passive: { id: 'field_remedies', name: 'Field Remedies', desc: 'Each round she quietly tends the most wounded ally. Doubles plant-based Menagerie yields as a handler.', roundHeal: 0.04, handler: 'plant' },
    role: 'healer',
  },
  vex: {
    id: 'vex', recruit: true, arrive: { circle: 2, day: 0 },
    name: 'Vex', epithet: 'the Hollow One', cls: 'Shade',
    desc: 'A shadow-entity from the sealed dark beneath the dead city. It watched the Codex for three days, then filled out a pact in perfect, unsettling calligraphy. The ink did not bleed. The ink always bleeds.',
    stages: [
      { cond: S => (S.allies || []).includes('vex'), desc: 'The Codex\'s resident dark, increasingly fluent in personhood: it holds doors with tendrils, has opinions about soup, and produces the laugh sound on purpose now.' },
    ],
    persona: 'A genderless shadow-creature learning personhood in real time: odd cadence, literal honesty, curious about warmth.',
    startLevel: 14,
    base:   { hp: 95, mp: 40, atk: 17, mag: 10, def: 8, res: 10, agi: 16, luk: 10 },
    growth: { hp: 8,  mp: 3,  atk: 2.4, mag: 1.3, def: 1.1, res: 1.4, agi: 1.8, luk: 1.1 },
    skills: { 1: 'shadow_talon', 2: 'through_the_veil', 6: 'hollow_embrace', 14: 'null_shriek', 24: 'unmaking' },
    passive: { id: 'hollow_step', name: 'Hollow Step', desc: 'Half here, half elsewhere: +15% chance attacks against it miss.', dodge: 0.15 },
    role: 'striker',
  },
  seris: {
    id: 'seris', recruit: true, arrive: { circle: 3, day: 0 },
    name: 'Seris', epithet: 'the College\'s Instrument', cls: 'Shadow Warlock',
    desc: 'Seris Val of the Obsidian College, sent to observe, contain, and if necessary dismantle the unlicensed warlock in the drowned library. She has read every report on you. She does not believe them. She is here to be wrong in person.',
    stages: [
      { cond: S => (S.allies || []).includes('seris'), desc: 'The College\'s embedded observer, whose reports grow longer, warmer, and less submitted. "Purely professional proximity," she notes, in the margin, again.' },
    ],
    persona: 'A precise, dangerous College agent — rival first, ally slowly. Dry wit sharpened to a scalpel.',
    startLevel: 20,
    base:   { hp: 90, mp: 60, atk: 6, mag: 18, def: 7, res: 14, agi: 11, luk: 9 },
    growth: { hp: 7,  mp: 5,  atk: 0.7, mag: 2.5, def: 1.1, res: 1.9, agi: 1.2, luk: 1.0 },
    skills: { 1: 'shadow_lash', 2: 'gloom_brand', 6: 'umbral_coil', 14: 'eclipse', 24: 'midnight_rite' },
    passive: { id: 'hexweaver', name: 'Hexweaver', desc: 'Her hexes do not miss: status effects she applies always land.', sureHex: true },
    role: 'caster',
  },
};

// ---- Lysandre, the Many-Shaped (arrives after your first hybrid hatches) ----
HEROES.lysandre = {
  id: 'lysandre', recruit: true, arrive: { flag: 'lysandre_arrives' },
  name: 'Lysandre', epithet: 'the Many-Shaped', cls: 'Shapeshifter',
  desc: 'A changeling from the Pale Wood, born of two bloodlines that were never supposed to meet. She has been every shape and belonged to none. Your Menagerie, where mixed blood is honored, is the first place that has ever felt like home.',
  startLevel: 10,
  base:   { hp: 110, mp: 40, atk: 14, mag: 12, def: 10, res: 10, agi: 14, luk: 11 },
  growth: { hp: 9.5, mp: 3.5, atk: 2.0, mag: 1.6, def: 1.4, res: 1.3, agi: 1.6, luk: 1.1 },
  skills: { 1: 'feral_strike_ls', 2: 'shift_drake', 4: 'shift_coil', 8: 'coil_crush', 14: 'drake_breath', 24: 'hellmouth' },
  passive: { id: 'many_shaped', name: 'Many-Shaped', desc: 'Her shifts last longer than they should. Handles Crossblooded beasts best: +1 yield from any hybrid she handles.' },
  role: 'striker', color: '#8ad8a8', model: 'lysandre',
  contentTags: ['shapeshifting', 'monster forms', 'breeding'],
};

// ---- Reclaimed leaders (join only from the Undercroft) ----
Object.assign(HEROES, {
  aldric: { id: 'aldric', convertOnly: true, name: 'Aldric', epithet: 'Lord-Commander, Unsworn', cls: 'Vigil Commander',
    desc: 'Isolde\'s old mentor, who believed she could be saved. It turns out he was the one who needed it. Speaks to her now as an equal, carefully, and is ashamed of how long that took.',
    startLevel: 20, base: { hp: 150, mp: 26, atk: 16, mag: 5, def: 17, res: 14, agi: 8, luk: 7 }, growth: { hp: 12, mp: 2, atk: 2.1, mag: 0.6, def: 2.2, res: 1.8, agi: 0.9, luk: 0.8 },
    skills: { 1: 'shield_pin', 2: 'vigil_stance', 6: 'kneeling_sword', 12: 'oath_ward', 20: 'seventh_rune' },
    passive: { id: 'commander', name: 'Old Command', desc: 'Intercepts hits on wounded allies.', cover: true }, role: 'tank', model: 'vigil', variant: 'commander', color: '#d8d0b0' },
  proprietor: { id: 'proprietor', convertOnly: true, name: 'The Proprietor', epithet: 'Formerly of the Market', cls: 'Arch-Broker',
    desc: 'The one who owned the Demon Market, now owned by nothing but the terms you negotiated. Still reads every contract twice. Still smiles with far too many teeth.',
    startLevel: 20, base: { hp: 110, mp: 50, atk: 12, mag: 17, def: 10, res: 12, agi: 13, luk: 16 }, growth: { hp: 9, mp: 4, atk: 1.5, mag: 2.3, def: 1.2, res: 1.5, agi: 1.4, luk: 1.6 },
    skills: { 1: 'stolen_spark', 2: 'infernal_leer', 6: 'tail_trip', 12: 'ninth_ember', 20: 'hellmouth' },
    passive: { id: 'margins', name: 'Margins', desc: '+25% gold from battles.', goldMult: 0.25 }, role: 'support', model: 'demon', variant: 'proprietor', color: '#d84a6a' },
  hale: { id: 'hale', convertOnly: true, name: 'Hale', epithet: 'Guildmaster, Retired', cls: 'Master Hunter',
    desc: 'The Lodge\'s guildmaster, who built a plinth for your hands and now sharpens knives at your table. He says it\'s the best-run guild he\'s ever been in. He means it as an insult. Mostly.',
    startLevel: 20, base: { hp: 125, mp: 30, atk: 18, mag: 5, def: 12, res: 10, agi: 14, luk: 11 }, growth: { hp: 10, mp: 2, atk: 2.4, mag: 0.5, def: 1.5, res: 1.2, agi: 1.6, luk: 1.1 },
    skills: { 1: 'sunder_strike', 2: 'tail_trip', 6: 'crushing_blow', 12: 'umbral_cut', 20: 'rampart_cleave' },
    passive: { id: 'tracker', name: 'Tracker', desc: '+10% critical chance.', crit: 0.1 }, role: 'striker', model: 'hunter', variant: 'master', color: '#8ab85a' },
});

// Story-stage bio: the first matching stage wins, falling back to the
// base description. Stages may also override epithet and class label.
export function heroDesc(S, id) {
  const def = HEROES[id];
  const st = (def.stages || []).find(x => x.cond(S)) || {};
  return {
    desc: st.desc || def.desc,
    epithet: st.epithet || def.epithet,
    cls: st.cls || def.cls,
  };
}

// Recruits petitioning to join the Codex, given the current state.
export function recruitOffers(S) {
  const packOn = p => !p || !S.settings.packs || S.settings.packs[p] !== false;
  return Object.values(HEROES).filter(h => {
    if (h.pack && !packOn(h.pack)) return false;
    const ov = h.packOverride ? Object.entries(h.packOverride).find(([p]) => packOn(p))?.[1] : null;
    const recruit = ov && 'recruit' in ov ? ov.recruit : h.recruit;
    if (!recruit) return false;
    if ((S.allies || []).includes(h.id)) return false;
    const a = (ov && ov.arrive) || h.arrive || {};
    if (a.flag && !(S.flags && S.flags[a.flag])) return false;
    if (a.circle != null && S.circleIdx < a.circle) return false;
    const since = S.day - ((S.circleDay || {})[a.circle] ?? S.day);
    if (a.day != null && since < a.day) return false;
    return true;
  });
}

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
  // Subdue & capture
  pinned:    { name: 'Pinned',     icon: '⛓', kind: 'debuff', hold: true, willRegen: 0, mods: { agi: -0.4 } },
  bound:     { name: 'Bound',      icon: '⌘', kind: 'debuff', hold: true, willRegen: 0, mods: { res: -0.15 } },
  drained:   { name: 'Drained',    icon: '◌', kind: 'debuff', mods: { mag: -0.25, res: -0.15 } },
  omen:      { name: 'Omen',       icon: '☾', kind: 'buff',   mods: { mag: 0.2, luk: 0.3, agi: 0.1 } },
  read:      { name: 'Read',       icon: '◉', kind: 'debuff', takenUp: 0.1 },
  mantle:    { name: 'Wyrm\'s Mantle', icon: '🜂', kind: 'buff', mods: { atk: 0.3, mag: 0.3, def: 0.1, agi: 0.15 } },
  form_drake:{ name: 'Drake Form', icon: '🐉', kind: 'buff', mods: { atk: 0.35, def: 0.25, agi: -0.1 } },
  form_coil: { name: 'Coil Form',  icon: '〰', kind: 'buff', mods: { agi: 0.4, mag: 0.2, res: 0.15 } },
};

// ------------------------------------------------------------
// Skills
// ------------------------------------------------------------
// type: phys|mag|heal|support ; target: enemy|all_enemies|ally|all_allies|self
// power multiplies ATK or MAG. anim hints the 3D layer.

export const SKILLS = {
  strike:        { name: 'Strike', type: 'phys', power: 1.0, mp: 0, target: 'enemy', anim: 'melee', desc: 'A basic attack.' },
  guard:         { name: 'Guard', type: 'support', mp: 0, target: 'self', anim: 'guard', desc: 'Halve damage taken until your next turn.' },

  // The warlock
  hex_bolt:      { name: 'Hex Bolt', type: 'mag', power: 1.05, mp: 0, target: 'enemy', anim: 'cast', desc: 'A dart of violet spite. Free to cast.' },
  hex_of_yielding:{ name: 'Hex of Yielding', type: 'mag', power: 0.55, mp: 8, target: 'enemy', anim: 'cast', subdue: 34, apply: { to: 'target', id: 'bound', turns: 1, chance: 0.45 }, desc: 'Speak the word for "kneel." Drains Will; may Bind the target.' },
  umbral_cut:    { name: 'Umbral Cut', type: 'phys', power: 1.35, mp: 10, target: 'enemy', anim: 'dash', apply: { to: 'target', id: 'bleed', turns: 3, chance: 0.7 }, desc: 'A blade of shadow, drawn from your own. May cause Bleeding.' },
  pact_surge:    { name: 'Pact Surge', type: 'support', mp: 14, target: 'self', anim: 'buff', freeAction: true, apply: { to: 'target', id: 'atk_up_big', turns: 3 }, desc: 'Call in a little of what you\'re owed. +50% ATK, +20% AGI for 3 turns. Free action.' },
  chain_sigil_p: { name: 'Chain Sigil', type: 'mag', power: 0.5, mp: 14, target: 'all_enemies', anim: 'cast', subdue: 18, apply: { to: 'target', id: 'bound', turns: 1, chance: 0.3 }, desc: 'Sigil-chains lash every foe. Drains Will from all; may Bind.' },
  storm_call:    { name: 'Storm Call', type: 'mag', power: 1.25, mp: 26, target: 'all_enemies', anim: 'cast', apply: { to: 'target', id: 'stun', turns: 1, chance: 0.25 }, desc: 'You are the storm the Tower foretold. Hits all; may Stun.' },
  word_of_silence:{ name: 'Word of Silence', type: 'mag', power: 1.6, mp: 22, target: 'enemy', anim: 'cast', subdue: 40, apply: { to: 'target', id: 'stun', turns: 1, chance: 0.7 }, desc: 'One word, and the room obeys. Heavy Will drain; likely Stuns.' },
  abyssal_verdict:{ name: 'Abyssal Verdict', type: 'mag', power: 2.4, mp: 40, target: 'enemy', anim: 'cast', apply: { to: 'target', id: 'vulnerable', turns: 2 }, desc: 'The Codex rules against them. Massive damage; Exposes.' },

  // Vesper
  ink_lash:      { name: 'Ink Lash', type: 'mag', power: 1.0, mp: 0, target: 'enemy', anim: 'cast', apply: { to: 'target', id: 'read', turns: 2, chance: 0.5 }, desc: 'Bleeding ink, flung with intent. May mark the target Read (+10% damage taken).' },
  chain_sigil:   { name: 'Chain Sigil', type: 'mag', power: 0.6, mp: 10, target: 'enemy', anim: 'cast', subdue: 30, apply: { to: 'target', id: 'bound', turns: 1, chance: 0.6 }, desc: 'Writes the target into a footnote. Drains Will; likely Binds.' },
  page_of_mending:{ name: 'Page of Mending', type: 'heal', power: 2.2, mp: 9, target: 'ally', anim: 'cast', desc: 'A page torn from a healer\'s pact, read aloud.' },
  omen_draw:     { name: 'Omen Draw', type: 'support', mp: 14, target: 'all_allies', anim: 'buff', apply: { to: 'target', id: 'omen', turns: 3 }, desc: 'She turns a card for the party. +20% MAG, +30% LUK, +10% AGI.' },
  true_name:     { name: 'True Name', type: 'mag', power: 1.4, mp: 20, target: 'enemy', anim: 'cast', subdue: 25, apply: [{ to: 'target', id: 'vulnerable', turns: 2 }, { to: 'target', id: 'stun', turns: 1, chance: 0.5 }], desc: 'She says what it really is. Exposes; drains Will; may Stun.' },
  bleeding_ink:  { name: 'Bleeding Ink', type: 'mag', power: 1.3, mp: 30, target: 'all_enemies', anim: 'cast', apply: { to: 'target', id: 'res_down', turns: 2, chance: 0.8 }, desc: 'Every pact in the room comes due at once. Hits all; Hexes.' },

  // Rue
  ember_claw:    { name: 'Ember Claw', type: 'phys', power: 1.1, mp: 0, target: 'enemy', anim: 'melee', apply: { to: 'target', id: 'burn', turns: 2, chance: 0.3 }, desc: 'Claws, hot. She calls it "Rue\'s Patented Ow."' },
  infernal_leer: { name: 'Infernal Leer', type: 'mag', power: 0.3, mp: 10, target: 'all_enemies', anim: 'cast', subdue: 16, desc: 'She grins with too many teeth. Drains Will from every enemy (weaker per target).' },
  tail_trip:     { name: 'Tail Trip', type: 'phys', power: 0.9, mp: 7, target: 'enemy', anim: 'dash', apply: [{ to: 'target', id: 'agi_down', turns: 2 }, { to: 'target', id: 'stun', turns: 1, chance: 0.35 }], desc: 'Rude, effective. Slows; may Stun.' },
  stolen_spark:  { name: 'Stolen Spark', type: 'mag', power: 1.3, mp: 12, target: 'enemy', anim: 'cast', drain: 0.4, desc: 'She takes something of theirs. She keeps it.' },
  ninth_ember:   { name: 'Ninth Ember', type: 'mag', power: 1.2, mp: 24, target: 'all_enemies', anim: 'cast', apply: { to: 'target', id: 'burn', turns: 3, chance: 0.8 }, desc: 'Fire from the floor of the world. Burns everything.' },
  hellmouth:     { name: 'Hellmouth', type: 'phys', power: 2.6, mp: 30, target: 'enemy', anim: 'dash', execBelow: 0.3, execPower: 3.6, desc: 'She opens up. Devastating on the wounded.' },

  // Isolde
  shield_pin:    { name: 'Shield Pin', type: 'phys', power: 0.7, mp: 6, target: 'enemy', anim: 'melee', subdue: 36, grapple: true, apply: { to: 'target', id: 'pinned', turns: 1, chance: 0.7 }, desc: 'Drives a foe to the floor under her shield. Heavy Will drain; likely Pins.' },
  vigil_stance:  { name: 'Vigil Stance', type: 'support', mp: 8, target: 'self', anim: 'buff', apply: [{ to: 'target', id: 'taunt', turns: 2 }, { to: 'target', id: 'def_up', turns: 2 }], desc: 'She plants her sword. Enemies must attack her; +35% DEF/RES.' },
  iron_grapple:  { name: 'Iron Grapple', type: 'phys', power: 0.5, mp: 10, target: 'enemy', anim: 'melee', subdue: 48, grapple: true, apply: { to: 'target', id: 'pinned', turns: 2, chance: 0.85 }, desc: 'A Vigil hold meant for warlocks. Massive Will drain; Pins for 2 turns.' },
  oath_ward:     { name: 'Oath Ward', type: 'support', mp: 14, target: 'ally', anim: 'buff', shieldPower: 2.3, desc: 'She steps in front of you. A ward scaled to her DEF.' },
  kneeling_sword:{ name: 'Kneeling Sword', type: 'phys', power: 1.8, mp: 16, target: 'enemy', anim: 'melee', apply: { to: 'target', id: 'stun', turns: 1, chance: 0.5 }, desc: 'The blow she should have struck you with. Heavy; may Stun.' },
  seventh_rune:  { name: 'Seventh Rune', type: 'support', mp: 26, target: 'all_allies', anim: 'buff', shieldPower: 1.5, desc: 'An unfinished oath, held up like a shield over all of you.' },

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

  // Mira
  sunder_strike: { name: 'Sunder Strike', type: 'phys', power: 1.1, mp: 7, target: 'enemy', anim: 'melee', apply: { to: 'target', id: 'def_down', turns: 2, chance: 0.8 }, desc: 'A professional\'s opener: crack the armor first.' },
  war_banner:    { name: 'War Banner', type: 'support', mp: 10, target: 'all_allies', anim: 'buff', apply: { to: 'target', id: 'atk_up', turns: 2 }, desc: 'She\'s survived worse than this. It\'s contagious. Party +25% ATK/MAG.' },
  stand_fast:    { name: 'Stand Fast', type: 'support', mp: 9, target: 'self', anim: 'buff', shieldPower: 1.8, apply: { to: 'target', id: 'taunt', turns: 2 }, desc: 'Plants her feet and dares the room. Taunts; gains a shield scaled to DEF.' },
  crushing_blow: { name: 'Crushing Blow', type: 'phys', power: 1.6, mp: 14, target: 'enemy', anim: 'melee', apply: { to: 'target', id: 'stun', turns: 1, chance: 0.4 }, desc: 'Both hands, no warning. May stun.' },
  rampart_cleave:{ name: 'Rampart Cleave', type: 'phys', power: 0.95, mp: 22, target: 'all_enemies', anim: 'melee', apply: { to: 'self', id: 'def_up', turns: 2 }, desc: 'One horizon-wide arc, then back behind the shield. Hits all; braces after.' },

  // Nessa
  salve:         { name: 'Salve', type: 'heal', power: 2.4, mp: 9, target: 'ally', anim: 'cast', desc: 'Honest medicine, expertly applied.' },
  nettle_flask:  { name: 'Nettle Flask', type: 'mag', power: 0.8, mp: 8, target: 'enemy', anim: 'cast', apply: { to: 'target', id: 'poison', turns: 3, chance: 0.85 }, desc: 'Every plant that heals has a cousin that doesn\'t.' },
  soothing_word: { name: 'Soothing Word', type: 'heal', power: 1.2, mp: 10, target: 'ally', anim: 'buff', apply: { to: 'target', id: 'regen', turns: 3 }, desc: 'A small mend, and Mending that lingers.' },
  tonic_mist:    { name: 'Tonic Mist', type: 'heal', power: 1.5, mp: 26, target: 'all_allies', anim: 'cast', desc: 'An atomized restorative. The whole party breathes easier.' },
  panacea:       { name: 'Panacea', type: 'heal', power: 3.2, mp: 30, target: 'ally', anim: 'cast', apply: { to: 'target', id: 'blessed', turns: 2 }, desc: 'Her masterwork. A second chance in a stoppered bottle.' },

  // Vex
  shadow_talon:  { name: 'Shadow Talon', type: 'phys', power: 1.15, mp: 5, target: 'enemy', anim: 'melee', desc: 'A claw of solid dark.' },
  through_the_veil:{ name: 'Through the Veil', type: 'phys', power: 0.68, hits: 3, mp: 14, target: 'enemy', anim: 'dash', desc: 'Three cuts from three directions. It only stepped once.' },
  hollow_embrace:{ name: 'Hollow Embrace', type: 'phys', power: 1.3, mp: 12, target: 'enemy', anim: 'melee', drain: 0.5, desc: 'It holds the target very gently and keeps some of what spills.' },
  null_shriek:   { name: 'Null Shriek', type: 'mag', power: 1.0, mp: 14, target: 'enemy', anim: 'cast', apply: { to: 'target', id: 'vulnerable', turns: 2, chance: 0.7 }, desc: 'The sound a hole makes. Leaves the target Exposed.' },
  unmaking:      { name: 'Unmaking', type: 'phys', power: 1.5, mp: 30, target: 'all_enemies', anim: 'dash', apply: { to: 'target', id: 'res_down', turns: 2, chance: 0.7 }, desc: 'For one heartbeat, everything near it remembers being nothing.' },

  // Seris
  shadow_lash:   { name: 'Shadow Lash', type: 'mag', power: 1.15, mp: 6, target: 'enemy', anim: 'cast', desc: 'A whip of cold, disapproving dark.' },
  gloom_brand:   { name: 'Gloom Brand', type: 'mag', power: 0.75, mp: 10, target: 'enemy', anim: 'cast', apply: { to: 'target', id: 'res_down', turns: 2 }, desc: 'Files the target under "vulnerable." −30% RES.' },
  umbral_coil:   { name: 'Umbral Coil', type: 'mag', power: 1.7, mp: 16, target: 'enemy', anim: 'cast', apply: { to: 'target', id: 'vulnerable', turns: 2, chance: 0.7 }, desc: 'Shadow constricts, and keeps a grip. Leaves the target Exposed.' },
  eclipse:       { name: 'Eclipse', type: 'mag', power: 1.1, mp: 26, target: 'all_enemies', anim: 'cast', apply: { to: 'target', id: 'atk_down', turns: 2, chance: 0.6 }, desc: 'She turns off the light. All enemies, Weakened.' },
  midnight_rite: { name: 'Midnight Rite', type: 'mag', power: 1.45, mp: 36, target: 'all_enemies', anim: 'cast', apply: { to: 'target', id: 'res_down', turns: 2, chance: 0.8 }, desc: 'The College forbids this one. She footnoted her objection and learned it anyway.' },

  // Slot VI — forbidden spells (Corruption 50+), pact skills, summons
  name_eater:    { name: 'Name-Eater', type: 'mag', power: 2.0, mp: 30, target: 'enemy', anim: 'cast', subdue: 60, drain: 0.3, desc: 'Slot VI. You eat a piece of their name. Huge Will drain; heals you.' },
  cinder_unmaking:{ name: 'Cinder Unmaking', type: 'mag', power: 1.7, mp: 38, target: 'all_enemies', anim: 'cast', apply: { to: 'target', id: 'burn', turns: 3 }, desc: 'Slot VI. The Coven\'s own rite, turned. Burns everything.' },
  summon_hound:  { name: 'Call the Hound', type: 'phys', power: 1.5, mp: 12, target: 'enemy', anim: 'dash', apply: { to: 'target', id: 'burn', turns: 2, chance: 0.6 }, desc: 'Your tamed ember hound bolts from the dark.' },
  summon_spider: { name: 'Call the Spider', type: 'phys', power: 0.8, mp: 12, target: 'enemy', anim: 'cast', subdue: 25, apply: { to: 'target', id: 'agi_down', turns: 2 }, desc: 'Silk from above. Drains Will; Slows.' },
  summon_drake:  { name: 'Call the Drake', type: 'phys', power: 1.1, mp: 16, target: 'all_enemies', anim: 'melee', apply: { to: 'target', id: 'poison', turns: 2, chance: 0.6 }, desc: 'A mire drake surges up through the floor.' },
  summon_stag:   { name: 'Call the Stag', type: 'heal', power: 1.4, mp: 14, target: 'all_allies', anim: 'buff', desc: 'The hollow stag lowers its antlers. Moss-light mends the party.' },
  summon_moth:   { name: 'Call the Moth', type: 'mag', power: 0.6, mp: 12, target: 'all_enemies', anim: 'cast', subdue: 12, desc: 'A drift of grey dust. Drains Will from everyone.' },
  summon_wyrm:   { name: 'Call the Wyrm', type: 'mag', power: 1.4, mp: 16, target: 'enemy', anim: 'cast', apply: { to: 'target', id: 'agi_down', turns: 2 }, desc: 'Breath like the Ashreach in winter.' },
  summon_imp:    { name: 'Call the Imp', type: 'mag', power: 1.2, mp: 10, target: 'enemy', anim: 'cast', apply: { to: 'target', id: 'atk_down', turns: 2, chance: 0.7 }, desc: 'Your imp shrieks rude things. Weakens.' },

  // The Wyrm's Mantle (pact) & Lysandre's shapes
  feral_strike_ls:{ name: 'Changeling Claw', type: 'phys', power: 1.1, mp: 0, target: 'enemy', anim: 'melee', apply: { to: 'target', id: 'bleed', turns: 2, chance: 0.35 }, desc: 'Whatever her hand is today, it has claws.' },
  monstrous_form:{ name: 'Wyrm\'s Mantle', type: 'support', mp: 12, target: 'self', anim: 'buff', freeAction: true, apply: { to: 'target', id: 'mantle', turns: 3 }, desc: 'Horns, wings, claws: your monstrous form. +30% ATK/MAG, +10% DEF, +15% AGI. Free action.' },
  shift_drake:   { name: 'Drake Shape', type: 'support', mp: 10, target: 'self', anim: 'buff', apply: [{ to: 'target', id: 'form_drake', turns: 4 }, { to: 'target', id: 'taunt', turns: 2 }], desc: 'Scales and wings. +35% ATK, +25% DEF; draws enemy attacks.' },
  shift_coil:    { name: 'Coil Shape', type: 'support', mp: 10, target: 'self', anim: 'buff', apply: { to: 'target', id: 'form_coil', turns: 4 }, desc: 'A serpent\'s grace. +40% AGI, +20% MAG.' },
  coil_crush:    { name: 'Coil Crush', type: 'phys', power: 0.8, mp: 12, target: 'enemy', anim: 'melee', subdue: 40, grapple: true, apply: { to: 'target', id: 'pinned', turns: 1, chance: 0.75 }, desc: 'Wraps a foe and squeezes. Heavy Will drain; likely Pins.' },
  drake_breath:  { name: 'Drake Breath', type: 'mag', power: 1.2, mp: 18, target: 'all_enemies', anim: 'cast', apply: { to: 'target', id: 'burn', turns: 2, chance: 0.7 }, desc: 'Fire from a borrowed throat.' },

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
  e_aoe_phys:    { name: 'Sweeping Blow', type: 'phys', power: 0.7, mp: 0, target: 'all_enemies', anim: 'melee', cooldown: 3 },
  e_aoe_mag:     { name: 'Mana Detonation', type: 'mag', power: 0.78, mp: 0, target: 'all_enemies', anim: 'cast', cooldown: 3 },
  e_enrage:      { name: 'Enrage', type: 'support', mp: 0, target: 'self', anim: 'buff', cooldown: 5, apply: { to: 'self', id: 'enrage', turns: 3 }, desc: 'Fury feeds its blows.' },
  e_devastate:   { name: 'Devastate', type: 'phys', power: 1.1, mp: 0, target: 'all_enemies', anim: 'melee', cooldown: 4, desc: 'A boss\'s room-clearing blow.' },
  e_rend:        { name: 'Rend', type: 'phys', power: 1.5, mp: 0, target: 'enemy', anim: 'melee', cooldown: 2, apply: { to: 'target', id: 'bleed', turns: 3, chance: 0.7 } },
  e_hex:         { name: 'Withering Hex', type: 'mag', power: 0.8, mp: 0, target: 'all_enemies', anim: 'cast', cooldown: 3, apply: { to: 'target', id: 'vulnerable', turns: 2, chance: 0.6 } },
  // single-target enemy variety — keeps trash threatening without party-wide nukes
  e_gore:        { name: 'Gore', type: 'phys', power: 1.4, mp: 0, target: 'enemy', anim: 'melee', cooldown: 2, desc: 'A heavy single blow.' },
  e_drain:       { name: 'Life Drain', type: 'mag', power: 0.95, mp: 0, target: 'enemy', anim: 'cast', cooldown: 2, drain: 0.5, desc: 'Steals life from one target.' },
  e_pounce:      { name: 'Pounce', type: 'phys', power: 1.15, mp: 0, target: 'enemy', anim: 'dash', apply: { to: 'target', id: 'agi_down', turns: 2, chance: 0.6 }, desc: 'A lunging strike that slows.' },
  e_shriek:      { name: 'Shriek', type: 'mag', power: 1.05, mp: 0, target: 'enemy', anim: 'cast', apply: { to: 'target', id: 'res_down', turns: 2, chance: 0.7 }, desc: 'A piercing cry; lowers RES.' },
  // Coven & Vigil kits
  e_ash_brand:   { name: 'Ash Brand', type: 'mag', power: 1.0, mp: 0, target: 'enemy', anim: 'cast', apply: { to: 'target', id: 'burn', turns: 2, chance: 0.5 }, desc: 'The Coven\'s mark, pressed hot.' },
  e_cinder_rite: { name: 'Cinder Rite', type: 'support', mp: 0, target: 'all_allies', anim: 'buff', cooldown: 4, apply: { to: 'target', id: 'focus_up', turns: 2 }, desc: 'A chant that steadies the faithful.' },
  e_vigil_cut:   { name: 'Warlock-Slayer Cut', type: 'phys', power: 1.3, mp: 0, target: 'enemy', anim: 'melee', cooldown: 2, apply: { to: 'target', id: 'drained', turns: 2, chance: 0.5 }, desc: 'A Vigil technique that bleeds magic.' },
  e_web:         { name: 'Grave Web', type: 'phys', power: 0.6, mp: 0, target: 'enemy', anim: 'cast', apply: [{ to: 'target', id: 'agi_down', turns: 2 }, { to: 'target', id: 'poison', turns: 2, chance: 0.6 }] },
};

// ------------------------------------------------------------
// Enemies
// ------------------------------------------------------------
// Base stats are Ash-circle reference values; scaled by circle tier
// and room depth at spawn time. model: procedural builder id.
// captureType: 'beast' → Menagerie, 'humanoid' → Undercroft,
// null → uncapturable (undead, constructs). sealResist 0–1.
// will: Will multiplier (default 1). family: beast reagent family.

export const ENEMIES = {
  // ---- Ashen Coven (humanoid captives) ----
  coven_acolyte: { name: 'Coven Acolyte',  model: 'coven', variant: 'acolyte', faction: 'coven', captureType: 'humanoid', sealResist: 0.1, base: { hp: 52, atk: 8, mag: 13, def: 5, res: 9, agi: 10 }, skills: ['e_ash_brand', 'e_heal'], xp: 12, gold: 9 },
  coven_zealot:  { name: 'Coven Zealot',   model: 'coven', variant: 'zealot',  faction: 'coven', captureType: 'humanoid', sealResist: 0.15, will: 1.2, base: { hp: 66, atk: 14, mag: 5, def: 8, res: 6, agi: 9 }, skills: ['strike', 'e_rend'], xp: 13, gold: 10 },
  ash_witch:     { name: 'Ash Witch',      model: 'coven', variant: 'witch',   faction: 'coven', captureType: 'humanoid', sealResist: 0.2, base: { hp: 50, atk: 6, mag: 16, def: 5, res: 12, agi: 12 }, skills: ['e_ash_brand', 'e_curse', 'e_drain'], xp: 15, gold: 12 },
  coven_trapper: { name: 'Coven Trapper',  model: 'coven', variant: 'trapper', faction: 'coven', captureType: 'humanoid', sealResist: 0.1, base: { hp: 58, atk: 13, mag: 8, def: 7, res: 7, agi: 13 }, skills: ['strike', 'e_web', 'e_pounce'], xp: 13, gold: 11 },
  cinder_knight: { name: 'Cinder Knight',  model: 'coven', variant: 'knight',  faction: 'coven', captureType: 'humanoid', sealResist: 0.3, will: 1.4, base: { hp: 96, atk: 17, mag: 8, def: 13, res: 9, agi: 8 }, skills: ['strike', 'e_sunder', 'e_gore'], xp: 20, gold: 16 },
  // ---- Order of the Last Vigil ----
  vigil_knight:  { name: 'Vigil Knight',   model: 'vigil', variant: 'knight', faction: 'vigil', captureType: 'humanoid', sealResist: 0.3, will: 1.3, base: { hp: 84, atk: 15, mag: 4, def: 13, res: 12, agi: 8 }, skills: ['strike', 'e_vigil_cut'], xp: 16, gold: 12 },
  vigil_rider:   { name: 'Vigil Rider',    model: 'vigil', variant: 'rider',  faction: 'vigil', captureType: 'humanoid', sealResist: 0.3, will: 1.3, base: { hp: 78, atk: 16, mag: 4, def: 11, res: 11, agi: 13 }, skills: ['e_pounce', 'e_vigil_cut'], xp: 17, gold: 13 },
  vigil_cantor:  { name: 'Vigil Cantor',   model: 'vigil', variant: 'cantor', faction: 'vigil', captureType: 'humanoid', sealResist: 0.35, base: { hp: 64, atk: 7, mag: 14, def: 9, res: 15, agi: 9 }, skills: ['e_heal', 'e_shriek', 'e_cinder_rite'], xp: 16, gold: 13 },
  // ---- Beast families (Menagerie) ----
  ember_hound:   { name: 'Ember Hound',    model: 'wolf', variant: 'hell', captureType: 'beast', family: 'ember_hound', sealResist: 0.05, base: { hp: 60, atk: 14, mag: 8, def: 6, res: 6, agi: 14 }, skills: ['e_bite', 'e_ember'], xp: 12, gold: 7 },
  grave_spider:  { name: 'Grave Spider',   model: 'spider', captureType: 'beast', family: 'grave_spider', sealResist: 0.05, base: { hp: 50, atk: 13, mag: 6, def: 6, res: 6, agi: 15 }, skills: ['e_bite', 'e_web', 'e_venom'], xp: 12, gold: 7 },
  mire_drake:    { name: 'Mire Drake',     model: 'drake', captureType: 'beast', family: 'mire_drake', sealResist: 0.15, will: 1.2, base: { hp: 78, atk: 15, mag: 8, def: 10, res: 7, agi: 9 }, skills: ['e_bite', 'e_venom', 'e_gore'], xp: 15, gold: 9 },
  hollow_stag:   { name: 'Hollow Stag',    model: 'stag', captureType: 'beast', family: 'hollow_stag', sealResist: 0.1, base: { hp: 70, atk: 14, mag: 10, def: 8, res: 9, agi: 13 }, skills: ['e_gore', 'e_pounce'], xp: 14, gold: 8 },
  lesser_imp:    { name: 'Lesser Imp',     model: 'imp', captureType: 'beast', family: 'lesser_imp', sealResist: 0.05, base: { hp: 44, atk: 11, mag: 13, def: 5, res: 8, agi: 15 }, skills: ['e_ember', 'e_bite'], xp: 11, gold: 9 },

  // ---- Inherited bestiary ----
  wolf:          { name: 'Gray Wolf',       model: 'wolf',     captureType: 'beast', family: 'ember_hound', base: { hp: 60, atk: 14, mag: 4,  def: 6,  res: 5,  agi: 14 }, skills: ['e_bite', 'e_howl'],            xp: 12, gold: 8 },
  boar:          { name: 'Razorback Boar',  model: 'boar',     captureType: 'beast', family: 'hollow_stag', base: { hp: 75, atk: 15, mag: 3,  def: 9,  res: 4,  agi: 8 },  skills: ['strike', 'e_smash'],           xp: 13, gold: 9 },
  sprite:        { name: 'Feral Sprite',    model: 'sprite',   captureType: 'beast', family: 'lesser_imp', base: { hp: 40, atk: 6,  mag: 15, def: 4,  res: 10, agi: 15 }, skills: ['e_ember', 'e_frost'],          xp: 13, gold: 10 },
  vine_horror:   { name: 'Vine Horror',     model: 'vine',     captureType: 'beast', family: 'grave_spider', base: { hp: 80, atk: 13, mag: 9,  def: 8,  res: 8,  agi: 6 },  skills: ['strike', 'e_venom', 'e_aoe_phys'], xp: 15, gold: 11 },
  skeleton:      { name: 'Skeleton Soldier',model: 'skeleton', captureType: null, base: { hp: 58, atk: 14, mag: 5,  def: 8,  res: 4,  agi: 9 },  skills: ['strike', 'e_sunder'],          xp: 13, gold: 10 },
  ghoul:         { name: 'Ghoul',           model: 'ghoul',    captureType: null, base: { hp: 72, atk: 15, mag: 6,  def: 7,  res: 6,  agi: 8 },  skills: ['e_bite', 'e_drain'],           xp: 14, gold: 10 },
  wraith:        { name: 'Wraith',          model: 'wraith',   captureType: null, base: { hp: 50, atk: 6,  mag: 16, def: 5,  res: 12, agi: 12 }, skills: ['e_ember', 'e_drain'],          xp: 15, gold: 12 },
  golem:         { name: 'Ash Golem',       model: 'golem',    captureType: null, base: { hp: 100, atk: 15, mag: 4, def: 14, res: 8,  agi: 5 },  skills: ['strike', 'e_smash', 'e_gore'], xp: 17, gold: 13 },
  gargoyle:      { name: 'Gargoyle',        model: 'gargoyle', captureType: null, base: { hp: 70, atk: 14, mag: 10, def: 10, res: 10, agi: 11 }, skills: ['strike', 'e_frost'],           xp: 16, gold: 12 },
  sentinel:      { name: 'Reliquary Sentinel', model: 'sentinel', captureType: null, base: { hp: 85, atk: 16, mag: 8,  def: 12, res: 9,  agi: 8 },  skills: ['strike', 'e_sunder', 'e_gore'], xp: 17, gold: 13 },
  ice_wisp:      { name: 'Drowned Wisp',    model: 'sprite',   variant: 'ice', captureType: null, base: { hp: 52, atk: 6, mag: 17, def: 5, res: 14, agi: 16 }, skills: ['e_frost', 'e_shriek'], xp: 19, gold: 15 },
  hellhound:     { name: 'Hellhound',       model: 'wolf',     variant: 'hell', captureType: 'beast', family: 'ember_hound', sealResist: 0.15, will: 1.2, base: { hp: 78, atk: 18, mag: 10, def: 9, res: 8, agi: 14 }, skills: ['e_bite', 'e_ember', 'e_howl'], xp: 18, gold: 14 },
  imp:           { name: 'Market Imp',      model: 'imp',      captureType: 'beast', family: 'lesser_imp', base: { hp: 55, atk: 13, mag: 13, def: 6,  res: 9,  agi: 14 }, skills: ['e_ember', 'e_bite'],           xp: 16, gold: 13 },
  cultist:       { name: 'Demon Broker',    model: 'cultist',  faction: 'market', captureType: 'humanoid', sealResist: 0.25, base: { hp: 60, atk: 9,  mag: 16, def: 6,  res: 12, agi: 10 }, skills: ['e_drain', 'e_ember', 'e_heal'], xp: 18, gold: 18 },
  revenant:      { name: 'Revenant',        model: 'skeleton', variant: 'revenant', captureType: null, base: { hp: 92, atk: 16, mag: 6, def: 11, res: 7, agi: 7 }, skills: ['strike', 'e_rend', 'e_sunder'], xp: 19, gold: 14 },
  banshee:       { name: 'Banshee',         model: 'wraith',   variant: 'banshee', captureType: null, base: { hp: 58, atk: 6, mag: 18, def: 6, res: 13, agi: 13 }, skills: ['e_shriek', 'e_drain', 'e_frost'], xp: 20, gold: 16 },
  dark_acolyte:  { name: 'Ember Hierophant',model: 'cultist',  variant: 'acolyte', faction: 'coven', captureType: 'humanoid', sealResist: 0.3, base: { hp: 66, atk: 8, mag: 17, def: 7, res: 13, agi: 10 }, skills: ['e_drain', 'e_ash_brand', 'e_heal'], xp: 20, gold: 17 },
  war_golem:     { name: 'Forge Golem',     model: 'golem',    variant: 'war', captureType: null, base: { hp: 118, atk: 17, mag: 5, def: 15, res: 9, agi: 5 }, skills: ['strike', 'e_gore', 'e_sunder'], xp: 22, gold: 17 },
  abyss_hound:   { name: 'Abyssal Hound',   model: 'wolf',     variant: 'abyss', captureType: 'beast', family: 'ember_hound', sealResist: 0.25, will: 1.3, base: { hp: 84, atk: 19, mag: 9, def: 9, res: 8, agi: 16 }, skills: ['e_bite', 'e_pounce', 'e_howl'], xp: 22, gold: 17 },

  // ---- Ashen Coven (expanded) ----
  bone_binder:   { name: 'Coven Bone-Binder', model: 'coven', variant: 'binder', faction: 'coven', captureType: 'humanoid', sealResist: 0.2, base: { hp: 54, atk: 7, mag: 15, def: 6, res: 11, agi: 9 }, skills: ['e_drain', 'e_curse', 'e_heal'], xp: 14, gold: 11 },
  dragon_cultist:{ name: 'Dragon Cultist', model: 'coven', variant: 'dragon', faction: 'coven', captureType: 'humanoid', sealResist: 0.2, will: 1.2, base: { hp: 70, atk: 15, mag: 10, def: 9, res: 8, agi: 10 }, skills: ['strike', 'e_ember', 'e_rend'], xp: 16, gold: 13 },
  frost_witch:   { name: 'Ashreach Frost-Witch', model: 'coven', variant: 'frost', faction: 'coven', captureType: 'humanoid', sealResist: 0.2, base: { hp: 52, atk: 6, mag: 16, def: 5, res: 13, agi: 11 }, skills: ['e_frost', 'e_curse', 'e_shriek'], xp: 15, gold: 12 },
  ashreach_wyrm: { name: 'Ashreach Wyrm',  model: 'drake', variant: 'frost', captureType: 'beast', family: 'frost_wyrm', sealResist: 0.15, will: 1.2, base: { hp: 80, atk: 15, mag: 12, def: 10, res: 9, agi: 10 }, skills: ['e_bite', 'e_frost', 'e_gore'], xp: 16, gold: 10 },
  // ---- Obsidian College ----
  obsidian_adept:{ name: 'Obsidian Adept', model: 'college', variant: 'adept', faction: 'college', captureType: 'humanoid', sealResist: 0.25, base: { hp: 50, atk: 6, mag: 16, def: 5, res: 13, agi: 11 }, skills: ['e_ember', 'e_shriek', 'e_frost'], xp: 15, gold: 13 },
  college_inquisitor: { name: 'College Inquisitor', model: 'college', variant: 'inquisitor', faction: 'college', captureType: 'humanoid', sealResist: 0.3, will: 1.3, base: { hp: 68, atk: 12, mag: 13, def: 9, res: 12, agi: 10 }, skills: ['strike', 'e_hex', 'e_vigil_cut'], xp: 17, gold: 14 },
  obsidian_warden: { name: 'Obsidian Warden', model: 'golem', variant: 'obsidian', captureType: null, base: { hp: 105, atk: 15, mag: 8, def: 15, res: 12, agi: 5 }, skills: ['strike', 'e_smash', 'e_sunder'], xp: 18, gold: 14 },
  arcane_familiar: { name: 'Arcane Familiar', model: 'sprite', variant: 'arcane', captureType: 'beast', family: 'gloom_moth', sealResist: 0.1, base: { hp: 42, atk: 6, mag: 15, def: 4, res: 12, agi: 16 }, skills: ['e_ember', 'e_shriek'], xp: 13, gold: 9 },
  // ---- Last Vigil (expanded) ----
  vigil_hound:   { name: 'Vigil Warhound', model: 'wolf', variant: 'vigil', captureType: 'beast', family: 'ember_hound', sealResist: 0.1, base: { hp: 64, atk: 15, mag: 4, def: 8, res: 6, agi: 14 }, skills: ['e_bite', 'e_pounce'], xp: 13, gold: 8 },
  vigil_inquisitor: { name: 'Vigil Inquisitor', model: 'vigil', variant: 'inquisitor', faction: 'vigil', captureType: 'humanoid', sealResist: 0.35, will: 1.3, base: { hp: 70, atk: 10, mag: 14, def: 10, res: 15, agi: 9 }, skills: ['e_hex', 'e_vigil_cut', 'e_shriek'], xp: 17, gold: 14 },
  // ---- Demon Market (expanded) ----
  velvet_fiend:  { name: 'Velvet Fiend',   model: 'demon', variant: 'velvet', faction: 'market', captureType: 'humanoid', sealResist: 0.25, base: { hp: 66, atk: 13, mag: 14, def: 7, res: 10, agi: 14 }, skills: ['e_drain', 'e_shriek', 'strike'], xp: 16, gold: 16 },
  contract_devil:{ name: 'Contract Devil', model: 'demon', variant: 'contract', faction: 'market', captureType: 'humanoid', sealResist: 0.3, will: 1.3, base: { hp: 80, atk: 15, mag: 12, def: 10, res: 10, agi: 10 }, skills: ['e_rend', 'e_hex', 'e_drain'], xp: 18, gold: 18 },
  gremlin:       { name: 'Coin Gremlin',   model: 'imp', variant: 'gremlin', captureType: 'beast', family: 'lesser_imp', sealResist: 0.05, base: { hp: 38, atk: 12, mag: 8, def: 5, res: 6, agi: 17 }, skills: ['e_bite', 'e_pounce'], xp: 10, gold: 14 },
  // ---- Hunters' Lodge ----
  lodge_hunter:  { name: 'Lodge Hunter',   model: 'hunter', variant: 'hunter', faction: 'lodge', captureType: 'humanoid', sealResist: 0.2, base: { hp: 66, atk: 14, mag: 4, def: 9, res: 8, agi: 12 }, skills: ['strike', 'e_rend', 'e_sunder'], xp: 14, gold: 12 },
  lodge_archer:  { name: 'Lodge Archer',   model: 'hunter', variant: 'archer', faction: 'lodge', captureType: 'humanoid', sealResist: 0.2, base: { hp: 52, atk: 15, mag: 4, def: 6, res: 7, agi: 15 }, skills: ['strike', 'e_venom', 'e_pounce'], xp: 14, gold: 12 },
  lodge_trapper: { name: 'Lodge Trapper',  model: 'hunter', variant: 'trapper', faction: 'lodge', captureType: 'humanoid', sealResist: 0.15, base: { hp: 58, atk: 12, mag: 6, def: 7, res: 7, agi: 13 }, skills: ['e_web', 'e_pounce', 'strike'], xp: 13, gold: 12 },
  hunting_hound: { name: 'Lodge Bloodhound', model: 'wolf', variant: 'hunt', captureType: 'beast', family: 'ember_hound', sealResist: 0.05, base: { hp: 58, atk: 14, mag: 4, def: 7, res: 5, agi: 15 }, skills: ['e_bite', 'e_howl'], xp: 12, gold: 7 },
  // ---- Wild monsters ----
  gloom_moth:    { name: 'Gloom Moth',     model: 'moth', captureType: 'beast', family: 'gloom_moth', sealResist: 0.05, base: { hp: 40, atk: 7, mag: 14, def: 4, res: 10, agi: 17 }, skills: ['e_shriek', 'e_drain'], xp: 12, gold: 7 },
  harpy:         { name: 'Gallows Shrike', model: 'moth', variant: 'shrike', captureType: 'beast', family: 'gloom_moth', sealResist: 0.15, base: { hp: 56, atk: 14, mag: 9, def: 6, res: 8, agi: 16 }, skills: ['e_pounce', 'e_shriek', 'e_rend'], xp: 14, gold: 10 },
  basilisk:      { name: 'Mire Basilisk',  model: 'drake', variant: 'basilisk', captureType: 'beast', family: 'mire_drake', sealResist: 0.2, will: 1.3, base: { hp: 86, atk: 14, mag: 12, def: 12, res: 10, agi: 7 }, skills: ['e_bite', 'e_frost', 'e_venom'], xp: 17, gold: 11 },
  mire_troll:    { name: 'Mire Troll',     model: 'yeti', variant: 'troll', captureType: 'beast', family: 'mire_drake', sealResist: 0.2, will: 1.4, base: { hp: 110, atk: 17, mag: 4, def: 11, res: 7, agi: 6 }, skills: ['strike', 'e_smash', 'e_heal'], xp: 19, gold: 12 },
  chimera:       { name: 'Ash Chimera',    model: 'wolf', variant: 'chimera', captureType: 'beast', family: 'ember_hound', sealResist: 0.3, will: 1.4, base: { hp: 92, atk: 17, mag: 13, def: 9, res: 9, agi: 13 }, skills: ['e_bite', 'e_ember', 'e_venom', 'e_aoe_phys'], xp: 20, gold: 14 },

  // ---- Bosses (×boss multiplier on top of scaling; sealable only below 15% HP) ----
  coven_envoy:   { name: 'Coven Envoy',     model: 'coven', variant: 'envoy', faction: 'coven', captureType: 'humanoid', named: 'envoy', tutorialSeal: true, noKill: true, sealResist: 0, base: { hp: 70, atk: 10, mag: 12, def: 6, res: 8, agi: 9 }, skills: ['e_ash_brand', 'strike'], xp: 30, gold: 30 },
  forge_matron:  { name: 'Forge Matron',    model: 'coven', variant: 'matron', boss: true, faction: 'coven', captureType: 'humanoid', sealResist: 0.6, base: { hp: 100, atk: 14, mag: 15, def: 9, res: 10, agi: 9 }, skills: ['e_ash_brand', 'e_aoe_mag', 'e_cinder_rite', 'e_enrage'], xp: 44, gold: 42 },
  dire_wolf:     { name: 'Dire Alpha',      model: 'wolf',    variant: 'dire', boss: true, captureType: 'beast', family: 'ember_hound', sealResist: 0.6, base: { hp: 90, atk: 17, mag: 5, def: 8, res: 7, agi: 15 }, skills: ['e_bite', 'e_howl', 'e_aoe_phys'], xp: 42, gold: 38 },
  elder_treant:  { name: 'Elder Treant',    model: 'vine',    variant: 'elder', boss: true, captureType: 'beast', family: 'hollow_stag', sealResist: 0.65, base: { hp: 120, atk: 15, mag: 12, def: 11, res: 10, agi: 5 }, skills: ['e_smash', 'e_venom', 'e_aoe_phys', 'e_heal'], xp: 46, gold: 42 },
  bone_tyrant:   { name: 'Bone Tyrant',     model: 'skeleton',variant: 'tyrant', boss: true, captureType: null, base: { hp: 110, atk: 17, mag: 12, def: 10, res: 8, agi: 9 }, skills: ['strike', 'e_sunder', 'e_curse', 'e_aoe_mag'], xp: 46, gold: 44 },
  colossus:      { name: 'Forge Colossus',  model: 'golem',   variant: 'colossus', boss: true, captureType: null, base: { hp: 150, atk: 18, mag: 8, def: 15, res: 10, agi: 4 }, skills: ['e_smash', 'e_aoe_phys', 'e_sunder'], xp: 50, gold: 48 },
  drowned_matriarch:{ name: 'Drowned Matriarch', model: 'elemental', variant: 'matriarch', boss: true, captureType: null, base: { hp: 130, atk: 12, mag: 20, def: 10, res: 14, agi: 10 }, skills: ['e_frost', 'e_aoe_mag', 'e_heal', 'e_curse'], xp: 52, gold: 50 },
  vigil_marshal: { name: 'Vigil Marshal',   model: 'vigil', variant: 'marshal', boss: true, faction: 'vigil', captureType: 'humanoid', sealResist: 0.65, base: { hp: 125, atk: 18, mag: 6, def: 15, res: 14, agi: 9 }, skills: ['e_vigil_cut', 'e_devastate', 'e_heal', 'e_enrage'], xp: 50, gold: 48 },
  pit_lord:      { name: 'Market Pit Lord', model: 'demon',   boss: true, captureType: 'humanoid', faction: 'market', sealResist: 0.7, base: { hp: 140, atk: 20, mag: 16, def: 12, res: 11, agi: 11 }, skills: ['e_smash', 'e_ember', 'e_aoe_mag', 'e_howl'], xp: 56, gold: 55 },
  wraith_queen:  { name: 'The Weeping Queen', model: 'wraith', variant: 'queen', boss: true, captureType: null, base: { hp: 118, atk: 10, mag: 20, def: 9, res: 15, agi: 12 }, skills: ['e_aoe_mag', 'e_hex', 'e_curse', 'e_heal', 'e_enrage'], xp: 48, gold: 46 },
  demon_general: { name: 'Demon General',   model: 'demon',    variant: 'general', boss: true, captureType: 'humanoid', faction: 'market', sealResist: 0.75, base: { hp: 158, atk: 22, mag: 15, def: 13, res: 12, agi: 12 }, skills: ['e_devastate', 'e_rend', 'e_ember', 'e_howl', 'e_enrage'], xp: 58, gold: 56 },
  glade_hart:    { name: 'The Charmed Hart', model: 'stag', variant: 'great', boss: true, captureType: 'beast', family: 'hollow_stag', sealResist: 0.6, base: { hp: 110, atk: 15, mag: 14, def: 10, res: 12, agi: 13 }, skills: ['e_gore', 'e_heal', 'e_pounce', 'e_enrage'], xp: 46, gold: 42 },
  isolde_duel:   { name: 'Dame Isolde Varr', model: 'isolde', boss: true, faction: 'vigil', captureType: null, yieldAt: 0.3, base: { hp: 80, atk: 13, mag: 4, def: 13, res: 10, agi: 9 }, skills: ['strike', 'e_vigil_cut', 'e_sunder'], xp: 40, gold: 0 },
  dw_erin:       { name: 'Erin of the Dawnward', model: 'erin', faction: 'dawnward', captureType: null, yieldAt: 0.25, base: { hp: 120, atk: 15, mag: 4, def: 15, res: 10, agi: 8 }, skills: ['strike', 'e_sunder', 'e_howl'], xp: 50, gold: 20 },
  dw_sakura:     { name: 'Sakura of the Dawnward', model: 'sakura', faction: 'dawnward', captureType: null, yieldAt: 0.25, base: { hp: 70, atk: 5, mag: 19, def: 6, res: 13, agi: 9 }, skills: ['e_ember', 'e_aoe_mag'], xp: 50, gold: 20 },
  dw_shiro:      { name: 'Shiro of the Dawnward', model: 'shiro', faction: 'dawnward', captureType: null, yieldAt: 0.25, base: { hp: 76, atk: 6, mag: 15, def: 8, res: 15, agi: 10 }, skills: ['e_frost', 'e_heal', 'e_curse'], xp: 50, gold: 20 },
  dw_yuki:       { name: 'Yuki of the Dawnward', model: 'yuki', faction: 'dawnward', captureType: null, yieldAt: 0.25, base: { hp: 72, atk: 11, mag: 6, def: 9, res: 8, agi: 9 }, skills: ['strike', 'e_howl'], xp: 50, gold: 20 },
  mother_cinder: { name: 'Mother Cinder',   model: 'coven', variant: 'mother', boss: true, leaderBreak: true, faction: 'coven', captureType: 'humanoid', named: 'cinder', sealResist: 0.85, will: 1.6, base: { hp: 185, atk: 20, mag: 24, def: 14, res: 16, agi: 13 }, skills: ['e_devastate', 'e_aoe_mag', 'e_ash_brand', 'e_hex', 'e_cinder_rite', 'e_enrage'], xp: 130, gold: 160 },
  // ---- Faction leaders (lairs) ----
  archon_sorn:   { name: 'Archon Sorn',    model: 'herald', variant: 'archon', boss: true, faction: 'college', captureType: null, yieldAt: 0.15, base: { hp: 170, atk: 14, mag: 24, def: 13, res: 18, agi: 12 }, skills: ['e_aoe_mag', 'e_hex', 'e_curse', 'e_heal', 'e_enrage'], xp: 110, gold: 140 },
  aldric:        { name: 'Lord-Commander Aldric', model: 'vigil', variant: 'commander', boss: true, leaderBreak: true, faction: 'vigil', captureType: 'humanoid', named: 'aldric', sealResist: 0.7, will: 1.4, base: { hp: 160, atk: 21, mag: 8, def: 17, res: 15, agi: 10 }, skills: ['e_vigil_cut', 'e_devastate', 'e_heal', 'e_enrage'], xp: 100, gold: 120 },
  proprietor:    { name: 'The Velvet Proprietor', model: 'demon', variant: 'proprietor', boss: true, leaderBreak: true, faction: 'market', captureType: 'humanoid', named: 'proprietor', sealResist: 0.7, will: 1.4, base: { hp: 155, atk: 18, mag: 20, def: 12, res: 14, agi: 13 }, skills: ['e_drain', 'e_hex', 'e_aoe_mag', 'e_howl', 'e_enrage'], xp: 100, gold: 200 },
  hale:          { name: 'Guildmaster Hale', model: 'hunter', variant: 'master', boss: true, leaderBreak: true, faction: 'lodge', captureType: 'humanoid', named: 'hale', sealResist: 0.65, will: 1.3, base: { hp: 150, atk: 20, mag: 6, def: 14, res: 11, agi: 14 }, skills: ['e_rend', 'e_devastate', 'e_howl', 'e_enrage'], xp: 95, gold: 120 },
  mire_matriarch:{ name: 'The Mire Mother', model: 'drake', variant: 'great', boss: true, captureType: 'beast', family: 'mire_drake', sealResist: 0.6, base: { hp: 125, atk: 17, mag: 12, def: 12, res: 10, agi: 7 }, skills: ['e_gore', 'e_venom', 'e_aoe_phys', 'e_enrage'], xp: 50, gold: 44 },
  void_seraph:   { name: 'Echo of the Heart', model: 'herald', variant: 'seraph', boss: true, captureType: null, base: { hp: 190, atk: 23, mag: 22, def: 15, res: 15, agi: 14 }, skills: ['e_devastate', 'e_aoe_mag', 'e_hex', 'e_rend', 'e_enrage'], xp: 130, gold: 160 },
};

// ------------------------------------------------------------
// Elite modifiers — a titled mob rolls one of these: stat
// multipliers, a bonus skill, an opening status, richer rewards.
// ------------------------------------------------------------

export const ELITES = {
  alpha:    { name: 'Alpha',    stats: { hp: 1.45, atk: 1.2, agi: 1.3 },  skill: 'e_howl',  start: 'haste' },
  ancient:  { name: 'Ancient',  stats: { hp: 1.8, def: 1.35, res: 1.35 }, skill: 'e_heal',  start: 'def_up' },
  cursed:   { name: 'Cursed',   stats: { hp: 1.4, mag: 1.35, res: 1.3 },  skill: 'e_hex',   start: 'focus_up' },
  ravenous: { name: 'Ravenous', stats: { hp: 1.35, atk: 1.4 },            skill: 'e_rend',  start: 'enrage' },
  warded:   { name: 'Warded',   stats: { hp: 1.5, res: 1.25 },            skill: 'e_drain', start: 'shield' },
};

export const ELITE_XP_MULT = 2.2;
export const ELITE_GOLD_MULT = 2.0;

// Chance that a spawned mob rolls elite (one max per normal room).
export function eliteChance(rankIdx) { return 0.06 + rankIdx * 0.03; }

// ------------------------------------------------------------
// Biomes, factions, locations & Vesper's tarot
// ------------------------------------------------------------
// Biomes are visual only (arena colors); each location supplies its own
// enemy pools. mobsLate joins from the Hex Circle up.

export const BIOMES = {
  forge:    { name: 'Coven Forge', tint: 0xe8823a, fog: 0x140a06, floor: 0x3a2418 },
  drowned:  { name: 'Drowned Stacks', tint: 0x4a8ab8, fog: 0x060c14, floor: 0x1c2a34 },
  vigil:    { name: 'Vigil Ground', tint: 0xc8c8e0, fog: 0x0c0c12, floor: 0x2c2c38 },
  market:   { name: 'Demon Market', tint: 0xd84a6a, fog: 0x12060a, floor: 0x341a22 },
  catacomb: { name: 'Catacombs', tint: 0x8a6ad8, fog: 0x0a0814, floor: 0x241f30 },
  glade:    { name: 'Charmed Glade', tint: 0xe88ac0, fog: 0x100a10, floor: 0x2a2430 },
  ashreach: { name: 'The Ashreach', tint: 0x9ac8e8, fog: 0x080c12, floor: 0x2a3440 },
  college:  { name: 'Obsidian College', tint: 0xd8b04a, fog: 0x08080c, floor: 0x1a1a22 },
  lodge:    { name: 'Lodge Woods', tint: 0x8ab85a, fog: 0x080e06, floor: 0x26301e },
  palewood: { name: 'The Pale Wood', tint: 0xe8e8d8, fog: 0x0e0e0c, floor: 0x34342c },
  mire:     { name: 'The Black Mire', tint: 0x6a9a4a, fog: 0x060a04, floor: 0x1c2416 },
  heart:    { name: 'The Ashen Heart', tint: 0xff5a3a, fog: 0x0a0404, floor: 0x2a1410 },
};

// Chambers per rift circle (encounters before the boss room).
export const GATE_ROOMS = { Ash: 3, Ember: 3, Hex: 4, Thorn: 4, Crown: 5, Abyss: 5 };

// Rival factions. Weaken one by raiding its holdings and capturing its
// people; when its Power falls low enough, its leader's lair opens.
// Seal the leader into the Undercroft (subjugated), reclaim them (sworn),
// or kill them (shattered). Dominated factions pay out benefits.
export const FACTIONS = {
  coven:   { name: 'The Ashen Coven', icon: '🔥', color: '#ff7a3a', leader: 'mother_cinder', leaderName: 'Mother Cinder', lair: 'ashen_heart',
             desc: 'Brands its faithful with a burning hand. Wants the Codex back.',
             perk: 'Tribute: cinder ash & brimstone salt nightly; Coven raids stop.',
             cellPerk: 'Mother Cinder in your cells: Coven brands burn out 25% faster.' },
  college: { name: 'The Obsidian College', icon: '◈', color: '#d8b04a', leader: 'archon_sorn', leaderName: 'Archon Sorn', lair: 'archons_sanctum',
             desc: 'A lawful magical authority that wants the Codex catalogued — and you licensed or dismantled.',
             perk: 'Its archives open: +10% XP for everyone; the Market stocks College elixirs.',
             cellPerk: 'Archon Sorn cannot be bound. Humbling him is the only victory.' },
  vigil:   { name: 'The Order of the Last Vigil', icon: '⚖', color: '#c8ccd8', leader: 'aldric', leaderName: 'Lord-Commander Aldric', lair: 'citadel_vigil',
             desc: 'Six hundred years of hunting warlocks. Now hunting Isolde, too.',
             perk: 'The Vigil stands down: allies +10% DEF and RES.',
             cellPerk: 'Aldric in your cells: Vigil captives never break out.' },
  market:  { name: 'The Demon Market', icon: '⛧', color: '#d84a6a', leader: 'proprietor', leaderName: 'The Velvet Proprietor', lair: 'velvet_vault',
             desc: 'Owned by someone nobody can name. Rue can.',
             perk: 'Tribute: 60 gold nightly; Market prices −25%.',
             cellPerk: 'The Proprietor in your cells: Bargains cost half.' },
  lodge:   { name: 'The Hunters\' Lodge', icon: '➹', color: '#8ab85a', leader: 'hale', leaderName: 'Guildmaster Hale', lair: 'lodge_hall',
             desc: 'Licensed rift-closers who think warlocks are the next thing to close.',
             perk: 'Lodge contracts flow to you: +5 Infamy nightly; dispatches +15% success.',
             cellPerk: 'Hale in your cells: Binding Seals on beasts +10%.' },
};

// Holdings. faction:null = wild land (beasts and worse).
// lieutenant: a one-time named boss that replaces the boss room until beaten
// (pack: only when that character pack is enabled). lair: the leader's seat.
export const LOCATIONS = {
  drowned_stacks: { name: 'The Drowned Stacks', faction: null, biome: 'drowned', circle: 0, modifier: 'hidden',
    desc: 'The flooded stacks beneath the Codex. Things nest in the old shelving.',
    mobs: ['mire_drake', 'grave_spider', 'gloom_moth', 'coven_acolyte'], mobsLate: ['ice_wisp', 'banshee', 'basilisk'], bosses: ['drowned_matriarch'] },
  cinder_forge: { name: 'The Cinder Forge', faction: 'coven', biome: 'forge', circle: 0, modifier: 'burning',
    desc: 'Where the Coven hammers its brands. The floors are never cool.',
    mobs: ['coven_acolyte', 'coven_zealot', 'ember_hound', 'lesser_imp'], mobsLate: ['cinder_knight', 'war_golem', 'dragon_cultist', 'dark_acolyte'], bosses: ['forge_matron'],
    lieutenant: { id: 'mira_vane', pack: 'northern' } },
  night_bazaar: { name: 'The Night Bazaar', faction: 'market', biome: 'market', circle: 0, modifier: 'bargain',
    desc: 'Velvet stalls, grinning keepers, prices paid in blood if you\'re careless.',
    mobs: ['lesser_imp', 'imp', 'cultist', 'gremlin'], mobsLate: ['velvet_fiend', 'contract_devil', 'hellhound'], bosses: ['pit_lord'],
    lieutenant: { id: 'nyxe', pack: 'northern', circle: 1 } },
  ember_catacombs: { name: 'The Ember Catacombs', faction: 'coven', biome: 'catacomb', circle: 1, modifier: 'rich',
    desc: 'Coven bone-binders raise the dead here. The dead cannot be sealed — but they guard rich graves.',
    mobs: ['skeleton', 'ghoul', 'bone_binder', 'grave_spider'], mobsLate: ['revenant', 'banshee', 'bone_binder', 'wraith'], bosses: ['bone_tyrant'] },
  border_chapel: { name: 'The Border Chapel', faction: 'vigil', biome: 'vigil', circle: 1, modifier: 'vigil',
    desc: 'A Vigil waystation on the north road. Bells, banners, warhounds.',
    mobs: ['vigil_knight', 'vigil_cantor', 'vigil_hound', 'sentinel'], mobsLate: ['vigil_rider', 'vigil_inquisitor', 'vigil_hound'], bosses: ['vigil_marshal'] },
  hunters_waystation: { name: 'The Hunters\' Waystation', faction: 'lodge', biome: 'lodge', circle: 1, modifier: 'hunt',
    desc: 'A Lodge camp at the forest edge. Cages, trophies, bloodhounds.',
    mobs: ['lodge_hunter', 'lodge_archer', 'hunting_hound', 'lodge_trapper'], mobsLate: ['lodge_hunter', 'lodge_archer', 'chimera'], bosses: ['dire_wolf'] },
  pale_wood: { name: 'The Pale Wood', faction: null, biome: 'palewood', circle: 1, modifier: 'none',
    desc: 'Bone-white trees and hollow stags. Something old and antlered rules the deep wood.',
    mobs: ['hollow_stag', 'wolf', 'harpy', 'gloom_moth', 'boar'], mobsLate: ['chimera', 'vine_horror', 'harpy'], bosses: ['elder_treant'],
    lieutenant: { id: 'pale_stag', pack: 'obsidian', circle: 2 } },
  ashreach_temple: { name: 'The Ashreach Temple', faction: 'coven', biome: 'ashreach', circle: 2, modifier: 'frozen',
    desc: 'A frozen northern temple where the Coven recruits. Its high priestess keeps the old rites.',
    mobs: ['frost_witch', 'coven_zealot', 'ashreach_wyrm', 'mire_troll'], mobsLate: ['frost_witch', 'cinder_knight', 'ashreach_wyrm', 'dark_acolyte'], bosses: ['forge_matron'],
    lieutenant: { id: 'valdra', pack: 'northern' } },
  varenthis_archive: { name: 'The Varenthis Archive', faction: 'college', biome: 'college', circle: 2, modifier: 'arcane',
    desc: 'The College\'s outer archive. Its agents have been reading the Codex\'s mail.',
    mobs: ['obsidian_adept', 'college_inquisitor', 'obsidian_warden', 'arcane_familiar'], mobsLate: ['obsidian_adept', 'college_inquisitor', 'obsidian_warden'], bosses: ['colossus'],
    lieutenant: { id: 'maren_soleil', pack: 'obsidian' } },
  black_mire: { name: 'The Black Mire', faction: null, biome: 'mire', circle: 2, modifier: 'hidden',
    desc: 'Bogland past the city wall. Basilisks, trolls, and the thing that birthed them.',
    mobs: ['mire_drake', 'basilisk', 'mire_troll', 'grave_spider'], mobsLate: ['chimera', 'basilisk', 'mire_troll'], bosses: ['mire_matriarch'] },
  vigil_watchtower: { name: 'The Vigil Watchtower', faction: 'vigil', biome: 'vigil', circle: 2, modifier: 'vigil',
    desc: 'The Order\'s forward tower. Inquisitors keep the warlock-slayer brands hot here.',
    mobs: ['vigil_knight', 'vigil_rider', 'vigil_inquisitor', 'vigil_hound'], mobsLate: ['vigil_knight', 'vigil_rider', 'vigil_inquisitor', 'gargoyle'], bosses: ['vigil_marshal'] },
  contract_pits: { name: 'The Contract Pits', faction: 'market', biome: 'market', circle: 2, modifier: 'bargain',
    desc: 'Where debts are collected. The fine print has teeth.',
    mobs: ['contract_devil', 'velvet_fiend', 'hellhound', 'gremlin'], mobsLate: ['contract_devil', 'velvet_fiend', 'abyss_hound'], bosses: ['demon_general'] },
  charmed_glade: { name: 'The Charmed Glade', faction: 'lodge', biome: 'glade', circle: 2, modifier: 'charmed',
    desc: 'Lodge hunting grounds, blooming out of season. Seals bite deeper here.',
    mobs: ['hollow_stag', 'sprite', 'lodge_hunter', 'harpy'], mobsLate: ['lodge_archer', 'hollow_stag', 'chimera'], bosses: ['glade_hart'] },
  obsidian_observatory: { name: 'The Obsidian Observatory', faction: 'college', biome: 'college', circle: 3, modifier: 'arcane',
    desc: 'Where the College watches the stars — and you.',
    mobs: ['obsidian_adept', 'college_inquisitor', 'obsidian_warden', 'arcane_familiar'], mobsLate: ['college_inquisitor', 'obsidian_warden', 'obsidian_adept'], bosses: ['colossus'],
    lieutenant: { id: 'seris_duel', pack: 'obsidian' } },
  dragon_spire: { name: 'The Dragon-Cult Spire', faction: 'coven', biome: 'forge', circle: 3, modifier: 'burning',
    desc: 'A spire of black glass where the Coven\'s zealots worship something with wings.',
    mobs: ['dragon_cultist', 'ashreach_wyrm', 'cinder_knight', 'hellhound'], mobsLate: ['dragon_cultist', 'ashreach_wyrm', 'cinder_knight', 'chimera'], bosses: ['colossus'],
    lieutenant: { id: 'rhea', pack: 'northern' } },
  // ---- leader lairs: open when the faction's Power is ≤ LAIR_POWER ----
  velvet_vault: { name: 'The Velvet Vault', faction: 'market', biome: 'market', circle: 3, modifier: 'bargain', lair: true,
    desc: 'The Proprietor\'s counting-house, beneath the Bazaar.', mobs: ['contract_devil', 'velvet_fiend', 'hellhound'], bosses: ['proprietor'] },
  lodge_hall: { name: 'The Lodge Hall', faction: 'lodge', biome: 'lodge', circle: 3, modifier: 'hunt', lair: true,
    desc: 'Guildmaster Hale\'s trophy hall. There is an empty plinth labelled WARLOCK.', mobs: ['lodge_hunter', 'lodge_archer', 'hunting_hound'], bosses: ['hale'] },
  citadel_vigil: { name: 'The Citadel of the Last Vigil', faction: 'vigil', biome: 'vigil', circle: 3, modifier: 'vigil', lair: true,
    desc: 'Lord-Commander Aldric waits in the chapel where Isolde took her vows.', mobs: ['vigil_knight', 'vigil_inquisitor', 'vigil_rider'], bosses: ['aldric'] },
  archons_sanctum: { name: 'The Archon\'s Sanctum', faction: 'college', biome: 'college', circle: 4, modifier: 'arcane', lair: true,
    desc: 'The heart of the Obsidian College, and its Archon.', mobs: ['college_inquisitor', 'obsidian_adept', 'obsidian_warden'], bosses: ['archon_sorn'] },
  ashen_heart: { name: 'The Ashen Heart', faction: 'coven', biome: 'heart', circle: 4, modifier: 'burning', lair: true, rooms: 5,
    desc: 'The Coven\'s heart, and Mother Cinder on her throne of brands.', mobs: ['cinder_knight', 'dark_acolyte', 'ash_witch', 'dragon_cultist'], bosses: ['mother_cinder'] },
};

export const LAIR_POWER = 35;   // a faction's leader becomes reachable at or below this
export const POWER = { clear: 10, lairFail: 0, capture: 3, kill: 1, lieutenantCapture: 15, lieutenantDefeat: 8, regen: 1 };

// Location modifiers (a holding's character).
export const GATE_MODIFIERS = [
  { id: 'none',    name: null },
  { id: 'burning', name: 'Burning Floors', desc: 'Everyone starts each fight Burning. More elites.', eliteBonus: 0.1 },
  { id: 'hidden',  name: 'Fog-Veiled',     desc: 'Enemies are hidden until engaged.' },
  { id: 'vigil',   name: 'Vigil Hunt',     desc: 'Knights of the Last Vigil. Their cuts drain magic.' },
  { id: 'bargain', name: 'Bargains',       desc: 'Infernal deals in the corridors. +40% gold.', goldMult: 1.4 },
  { id: 'rich',    name: 'Grave-Rich',     desc: 'Mostly undead (unsealable). +60% gold, richer caches.', goldMult: 1.6, treasureBonus: 0.15 },
  { id: 'charmed', name: 'Charmed',        desc: 'Binding Seals +15%.', sealBonus: 0.15 },
  { id: 'frozen',  name: 'Bitter Cold',    desc: 'Everyone starts each fight Slowed.' },
  { id: 'arcane',  name: 'Arcane Wards',   desc: 'Enemies resist magic. +20% XP.', xpMult: 1.2 },
  { id: 'hunt',    name: 'Hunting Grounds', desc: 'Beasts everywhere. Beast seals +10%.', beastSeal: 0.1 },
];

// Vesper's daily reading: one free card a day, a vision and a small boon.
// run: effects applied to today's expedition; now: immediate effects.
export const TAROT = {
  tower:     { name: 'The Tower',          numeral: 'XVI',   icon: '⚡', boon: 'More elites tonight — and half again the spoils.', run: { eliteBonus: 0.15, goldMult: 1.5 } },
  moon:      { name: 'The Moon',           numeral: 'XVIII', icon: '☾', boon: 'A captive\'s secret surfaces in Vesper\'s ink.', now: 'secret' },
  lovers:    { name: 'The Lovers',         numeral: 'VI',    icon: '♡', boon: 'Someone in the household warms to you (+1 bond); a camp scene stirs tonight.', now: 'bond', run: { campScene: true } },
  justice:   { name: 'Justice',            numeral: 'XI',    icon: '⚖', boon: '+50% Infamy from tonight\'s raid.', run: { infamyMult: 1.5 } },
  death:     { name: 'Death',              numeral: 'XIII',  icon: '☠', boon: 'Richer caches tonight.', run: { treasureBonus: 0.15, goldMult: 1.3 } },
  devil:     { name: 'The Devil',          numeral: 'XV',    icon: '⛧', boon: 'The Market\'s keepers are nervous: −30% prices today.', now: 'discount' },
  star:      { name: 'The Star',           numeral: 'XVII',  icon: '✧', boon: 'The party mends 15% after every fight tonight.', run: { mend: 0.15 } },
  hierophant:{ name: 'The Hierophant',     numeral: 'V',     icon: '⛪', boon: 'Vesper leaks a rival\'s secrets: the strongest rival loses 6 Power.', now: 'sabotage' },
  wheel:     { name: 'Wheel of Fortune',   numeral: 'X',     icon: '☸', boon: 'A windfall of gold.', now: 'gold' },
  hanged:    { name: 'The Hanged Man',     numeral: 'XII',   icon: '⚓', boon: 'Binding Seals +15% tonight.', run: { sealBonus: 0.15 } },
  chariot:   { name: 'The Chariot',        numeral: 'VII',   icon: '⛟', boon: '+25% XP tonight.', run: { xpMult: 1.25 } },
  hermit:    { name: 'The Hermit',         numeral: 'IX',    icon: '🕯', boon: 'Every captive\'s brand dims by 5.', now: 'brands' },
  empress:   { name: 'The Empress',        numeral: 'III',   icon: '❀', boon: 'Every beast in the Menagerie is fed, free.', now: 'feed' },
  magician:  { name: 'The Magician',       numeral: 'I',     icon: '✦', boon: 'Two reagents appear on the cauldron\'s rim.', now: 'reagents' },
  sun:       { name: 'The Sun',            numeral: 'XIX',   icon: '☀', boon: 'The party starts tonight\'s fights Fired Up.', run: { firedUp: true } },
};

// Kept for save compatibility with the first build.
export const MONARCH_GATE = { id: 'ashen_heart' };

// ------------------------------------------------------------
// Items
// ------------------------------------------------------------

export const ITEMS = {
  potion:    { name: 'Potion',        desc: 'Restores 40% HP.',            price: 30,  heal: 0.4 },
  hi_potion: { name: 'Hi-Potion',     desc: 'Restores 75% HP.',            price: 110, heal: 0.75, minRank: 'Hex' },
  ether:     { name: 'Ether',         desc: 'Restores 40% MP.',            price: 60,  mana: 0.4 },
  elixir:    { name: 'Elixir',        desc: 'Fully restores HP and MP.',   price: 400, heal: 1, mana: 1, minRank: 'Thorn' },
  feather:   { name: 'Ashen Feather', desc: 'Revives a fallen ally at 50% HP.', price: 200, revive: 0.5, minRank: 'Ember' },
  // brewed at the alchemy station (not stocked in the shop)
  yielding_draught:  { name: 'Yielding Draught', desc: 'Thrown at a foe: drains 35% of its Will.', brewed: true, sell: 25, throwWill: 0.35 },
  truth_draught:     { name: 'Truth Draught', desc: 'Undercroft: guarantees a secret on Interrogate.', brewed: true, sell: 25, noCombat: true },
  wardens_tonic:     { name: 'Warden\'s Tonic', desc: 'Undercroft: +25% warden rate on one captive for 3 days.', brewed: true, sell: 30, noCombat: true },
  blackblood_elixir: { name: 'Blackblood Elixir', desc: 'Huge ATK/MAG surge for 3 turns. +5 Corruption.', brewed: true, sell: 45, buff: 'atk_up_big', corruption: 5 },
  beast_bait:        { name: 'Beast Bait', desc: 'Carried into a rift: +15% seal chance on beasts for that run.', brewed: true, sell: 10, noCombat: true },
  sleepwalkers_philter: { name: 'Sleepwalker\'s Philter', desc: 'Thrown at a foe: Binds it for 2 turns and drains 15% Will.', brewed: true, sell: 30, throwWill: 0.15, throwStatus: 'bound' },
  frostheart_draught:   { name: 'Frostheart Draught', desc: 'Drink: a frost-ward on the whole party.', brewed: true, sell: 35, partyShield: 0.25 },
  sludge:            { name: 'Questionable Sludge', desc: 'It moved. Sells for 1 gold.', brewed: true, sell: 1, noCombat: true },
};

// ------------------------------------------------------------
// Gear
// ------------------------------------------------------------
// Flat stat mods. Tier index aligns with RANKS.

export const GEAR_TIERS = ['Ashen', 'Embered', 'Hexed', 'Thornbound', 'Crowned', 'Abyssal'];

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

// affix roll chance per tier index (Ashen never rolls; Abyssal almost always).
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

// ------------------------------------------------------------
// Reforging — the guild smith rerolls or adds affixes, for gold.
// ------------------------------------------------------------

export function reforgeCost(g) {
  return g.affix ? 60 * (g.tier + 1) : 100 * (g.tier + 1);
}

// Reroll (or add) the affix on a piece of gear, in place.
export function reforgeGear(g, rng = Math.random) {
  const pool = Object.keys(AFFIXES).filter(id => AFFIXES[id].slot === g.slot && id !== g.affix);
  if (!pool.length) return g;
  // strip the old affix prefix off the display name
  if (g.affix && AFFIXES[g.affix] && g.name.startsWith(AFFIXES[g.affix].name + ' ')) {
    g.name = g.name.slice(AFFIXES[g.affix].name.length + 1);
  }
  const aid = pool[Math.floor(rng() * pool.length)];
  g.affix = aid;
  g.name = `${AFFIXES[aid].name} ${g.name}`;
  return g;
}

// ------------------------------------------------------------
// Dispatch — role composition bonuses for solo gate teams.
// ------------------------------------------------------------

export const ROLE_INFO = {
  tank:    { name: 'Vanguard', icon: '🛡', bonus: 0.10, desc: 'someone to hold the line' },
  healer:  { name: 'Mender',   icon: '✚', bonus: 0.12, desc: 'someone to patch the holes' },
  caster:  { name: 'Arcanist', icon: '☄', bonus: 0.08, desc: 'someone to erase the problem rooms' },
  striker: { name: 'Striker',  icon: '⚔', bonus: 0.08, desc: 'someone to finish fights fast' },
  support: { name: 'Support',  icon: '❀', bonus: 0.06, desc: 'someone to keep spirits up' },
  shifter: { name: 'Shifter',  icon: '⟳', bonus: 0.09, desc: 'someone who becomes what it kills' },
};

// Rough level a party member should be to face each rank evenly.
export const DISPATCH_BENCHMARK = { Ash: 4, Ember: 10, Hex: 18, Thorn: 28, Crown: 40, Abyss: 54 };

// Shop stock scales with guild rank.
export function shopStock(rankIdx, collegeOpen = false) {
  if (collegeOpen) rankIdx = Math.max(rankIdx, 3);
  const items = Object.entries(ITEMS)
    .filter(([, it]) => !it.brewed && (!it.minRank || RANKS.indexOf(it.minRank) <= rankIdx))
    .map(([id]) => id);
  return items;
}

// ============================================================
// Undercroft — captive traits, name pools, warden styles
// ============================================================

export const CAPTIVE_TRAITS = {
  zealous:  { name: 'Zealous',  desc: 'The brand runs deep: Reclamation is 25% slower.', brandMult: 0.75 },
  doubting: { name: 'Doubting', desc: 'Already asking questions: Reclamation is 25% faster.', brandMult: 1.25 },
  proud:    { name: 'Proud',    desc: 'Intimidation barely dents them; Mercy lands harder.', intimidateMult: 0.5, mercyMult: 1.5 },
  fearful:  { name: 'Fearful',  desc: 'Intimidation cuts deep — and costs more regard.', intimidateMult: 1.5, regardLossMult: 1.5 },
  greedy:   { name: 'Greedy',   desc: 'Bargains go 50% further.', bargainMult: 1.5 },
  lonely:   { name: 'Lonely',   desc: 'Mercy and Testimony move them twice as far.', mercyMult: 2, testimonyMult: 1.5 },
  stubborn: { name: 'Stubborn', desc: 'Resolve recovers each night.', resolveRegen: 3 },
};

export const CAPTIVE_NAMES = {
  coven:  ['Ansel', 'Brisa', 'Corwin', 'Dariel', 'Edda', 'Faye', 'Gisla', 'Hollis', 'Ines', 'Jory', 'Katrin', 'Lark', 'Mabyn', 'Nell', 'Oswin', 'Petra', 'Quill', 'Rosamund', 'Sabine', 'Tamsin', 'Una', 'Wren'],
  vigil:  ['Brother Aled', 'Brother Cael', 'Sister Darra', 'Brother Emrys', 'Sister Fenna', 'Brother Garet', 'Sister Hild', 'Brother Ivo'],
  market: ['Smiling Dace', 'Velvet Orla', 'Old Tobiah', 'Mistress Sable', 'Two-Coins Ferro', 'Lady Ninefold', 'Corvin Ash-Tongue'],
  college: ['Adept Imre', 'Adept Solenne', 'Proctor Vane', 'Adept Thessaly', 'Inquisitor Brannoch', 'Adept Liesl'],
  lodge:  ['Tamsin Reed', 'Old Garreth', 'Wren Holloway', 'Bram Ashby', 'Kestrel', 'Mags Fenwick'],
};

// Lore secrets a captive can give up under Interrogation.
export const SECRETS = {
  coven: [
    'Mother Cinder keeps a ledger of every acolyte\'s fear. She reads it aloud at the solstice.',
    'The Coven brand is not a mark — it is a mouth. It feeds on doubt, and grows fat.',
    'There is a second Codex. A false one. The Coven has been writing it for forty years.',
    'The forge-rifts are not natural. The Coven tears them open with a captured demon\'s name.',
    'Mother Cinder trained Vesper. She calls her "the one that got away," and she is not smiling when she says it.',
    'The envoys draw lots. Short straw goes to the Codex. Nobody has ever come back.',
  ],
  vigil: [
    'Lord-Commander Aldric still lights a candle for Isolde every night. He believes she can be saved.',
    'The Vigil\'s warlock-slayer brands are burned into the hands of every knight. They cannot remove them.',
    'Six riders have been sent. Six more wait at the border chapel.',
    'The Order\'s founding oath has seven runes. Only Isolde\'s armor carries the old carving.',
  ],
  college: [
    'Archon Sorn has a file on you thicker than the Codex. It has a section on Vesper titled RECOVERABLE ASSET.',
    'The College licenses warlocks — and then quietly collects them. The licensed ones are kept in the Observatory.',
    'Seris Val\'s reports on you stopped being submitted three weeks ago. Sorn has noticed.',
  ],
  lodge: [
    'Guildmaster Hale keeps an empty plinth in his trophy hall. The plaque says WARLOCK.',
    'The Lodge pays bounties on Coven brands and on warlock hands. It does not ask whose.',
    'The Dawnward Company is the Lodge\'s favorite story. Hale is afraid of what happens if they stop believing it.',
  ],
  market: [
    'The Devil\'s market is owned. Nobody knows by whom. Rue might.',
    'Someone has been buying up the true names of Ninth Ember demons. Paying in Coven silver.',
    'The Pit Lord keeps a contract with Rue\'s handwriting on it. Unsigned.',
  ],
};

// Warden styles: brand burned per day, plus a side effect.
export const WARDEN_STYLES = {
  isolde: { rate: 6,  label: 'Slow · never relapses', noRelapse: true },
  rue:    { rate: 13, label: 'Fast · may plant a hook', hookChance: 0.15 },
  vesper: { rate: 9,  label: 'Medium · finds an extra secret weekly', weeklySecret: true },
  default:{ rate: 8,  label: 'Steady' },
  convert:{ rate: 14, label: 'Fast vs. their old cell · unlocks Testimony' },
};

// ============================================================
// Menagerie & alchemy
// ============================================================

export const BEAST_FAMILIES = {
  ember_hound:  { name: 'Ember hound',  reagent: 'cinder_ash',     infernal: true, summon: 'summon_hound' },
  grave_spider: { name: 'Grave spider', reagent: 'silk_venom',     summon: 'summon_spider' },
  mire_drake:   { name: 'Mire drake',   reagent: 'drake_scale',    summon: 'summon_drake' },
  hollow_stag:  { name: 'Hollow stag',  reagent: 'antler_velvet',  plant: true, summon: 'summon_stag' },
  lesser_imp:   { name: 'Lesser imp',   reagent: 'brimstone_salt', infernal: true, summon: 'summon_imp' },
  gloom_moth:   { name: 'Gloom moth',   reagent: 'moth_dust',      summon: 'summon_moth' },
  frost_wyrm:   { name: 'Frost wyrm',   reagent: 'wyrm_frost',     summon: 'summon_wyrm' },
};

export const BEAST_TRAITS = {
  gentle:   { name: 'Gentle',   desc: 'Tames 50% faster.', tameMult: 1.5 },
  feral:    { name: 'Feral',    desc: 'Tames 40% slower, but yields more.', tameMult: 0.6, yieldBonus: 0.3 },
  prolific: { name: 'Prolific', desc: '30% chance of an extra reagent.', yieldBonus: 0.3 },
  glutton:  { name: 'Glutton',  desc: 'Gets hungry twice as fast.', hungerMult: 2 },
  hardy:    { name: 'Hardy',    desc: 'Never escapes.', noEscape: true },
  lustrous: { name: 'Lustrous', desc: 'Its reagents sell for double.', sellMult: 2 },
  crossblooded:  { name: 'Crossblooded', desc: 'Can breed with a beast of a different family. Hybrid young yield both parents\' reagents.', cross: true },
  codex_touched: { name: 'Codex-Touched', desc: 'Imbued with your mark: tames twice as fast, +50% yield, and never sours when hungry.', tameMult: 2, yieldBonus: 0.5, noSour: true, imbued: true },
};

export const REAGENTS = {
  cinder_ash:     { name: 'Cinder ash',     icon: '♨', price: 14, desc: 'Still warm. From ember hounds.' },
  silk_venom:     { name: 'Silk venom',     icon: '✺', price: 14, desc: 'Glistening thread, numbing to touch. From grave spiders.' },
  drake_scale:    { name: 'Drake scale',    icon: '◆', price: 18, desc: 'Mire-green and harder than iron. From mire drakes.' },
  antler_velvet:  { name: 'Antler velvet',  icon: '❦', price: 16, desc: 'Moss-soft, faintly luminous. From hollow stags.' },
  brimstone_salt: { name: 'Brimstone salt', icon: '⛬', price: 15, desc: 'Yellow crystals that hiss in water. From lesser imps.' },
  moth_dust:      { name: 'Moth dust',      icon: '❋', price: 15, desc: 'Grey powder that makes you yawn just looking at it. From gloom moths and gallows shrikes.' },
  wyrm_frost:     { name: 'Wyrm frost',     icon: '❄', price: 20, desc: 'A rime that never melts. From Ashreach wyrms.' },
};

// Recipes are keyed by their sorted ingredient ids joined with '+'.
export const RECIPES = {
  yielding_draught:  { makes: 'yielding_draught',  needs: ['silk_venom', 'brimstone_salt'] },
  truth_draught:     { makes: 'truth_draught',     needs: ['antler_velvet', 'cinder_ash'] },
  wardens_tonic:     { makes: 'wardens_tonic',     needs: ['drake_scale', 'antler_velvet'] },
  blackblood_elixir: { makes: 'blackblood_elixir', needs: ['drake_scale', 'cinder_ash', 'brimstone_salt'] },
  sleepwalkers_philter: { makes: 'sleepwalkers_philter', needs: ['moth_dust', 'silk_venom'] },
  frostheart_draught:   { makes: 'frostheart_draught',   needs: ['wyrm_frost', 'drake_scale'] },
  beast_bait:        { makes: 'beast_bait',        needs: ['*'], gold: 20 }, // any one reagent + gold
};
// A clue for each recipe you haven't found: what it does, and one of its reagents.
export const RECIPE_HINTS = {
  yielding_draught: 'Something that numbs, and something that burns. Starts with silk venom.',
  truth_draught: 'Something soft from the stag, and something still warm. Starts with antler velvet.',
  wardens_tonic: 'Something harder than iron, and something soft from the stag. Starts with drake scale.',
  blackblood_elixir: 'Three things: scale, ash and salt. Dangerous.',
  sleepwalkers_philter: 'Something that drifts at night, and something that numbs. Starts with moth dust.',
  frostheart_draught: 'Something cold as a wyrm\'s breath, and something harder than iron. Starts with wyrm frost.',
  beast_bait: 'Any single reagent, and a little gold.',
};
export const RECIPE_DISCOVERY = 0.6; // unknown-but-valid combos discover the recipe this often

export function recipeFor(ids) {
  const key = ids.slice().sort().join('+');
  for (const [id, r] of Object.entries(RECIPES)) {
    if (r.needs[0] === '*') continue;
    if (r.needs.slice().sort().join('+') === key) return id;
  }
  if (ids.length === 1) return 'beast_bait';
  return null;
}

// ============================================================
// Pacts — permanent boons at the altar, for a price
// ============================================================

export const PACTS = {
  blood_surge: { name: 'Blood Surge',   cost: 'trust', corruption: 8,  desc: 'An ally\'s stats surge +12% forever. You pay with their trust (−2 bond).' },
  scar_rite:   { name: 'The Scar Rite', cost: 'scar',  corruption: 10, desc: 'Learn the forbidden hex Cinder Unmaking. The Codex carves a scar into your portrait.' },
  memory_toll: { name: 'Memory Toll',   cost: 'memory', corruption: 6, desc: 'Binding Seals +10% stronger. A past scene is crossed out of the Chronicle.' },
  wyrm_mantle: { name: 'The Wyrm\'s Mantle', cost: 'form', corruption: 8, desc: 'Your body remembers being a storm: horns, wings, a tail, and a monstrous battle form. The wild tribes adore it.' },
  ember_debt:  { name: 'Ember Debt',    cost: 'gold',  corruption: 4,  gold: 300, desc: 'The altar takes coin, too. +1 seal attempt per fight costs no MP.' },
};

// Forbidden "Slot VI" spells unlocked at 50+ Corruption.
export const SLOT_VI = ['name_eater', 'cinder_unmaking'];

// ============================================================
// Wild tribes — sapient monster-folk drawn to a thriving Menagerie.
// Not party members: sworn tribes pay tribute and grant a perk, and
// their people may ask (for themselves) for a breeding rite.
// ============================================================

export const TRIBES = {
  aerie: { name: 'The Skyrend Aerie', race: 'Harpies', icon: '🪶', color: '#c8a87a', home: 'pale_wood', envoy: 'kestra',
    draw: 12, // total reagents your Menagerie has produced before they come
    gifts: [ { reagents: { moth_dust: 2 }, gold: 80, ask: 'two pinches of moth dust and a purse of coin, for the nest-mothers' },
             { reagents: { antler_velvet: 2, cinder_ash: 2 }, gold: 0, ask: 'antler velvet and cinder ash, to line the high nests' } ],
    tribute: { moth_dust: 1, antler_velvet: 1 },
    perk: 'Harpy scouts fly ahead of you: Fog-Veiled holdings no longer hide their enemies.',
    envoyName: 'Kestra',
    pop: 40, brood: [1, 3], hatch: 6, young: 'fledglings', sign: 'wingColor', signWord: 'feathers',
    kin: [['Ysra', 'a storm-scout of the Aerie'], ['Tiel', 'a nest-mother\'s eldest daughter'], ['Merrow', 'the Aerie\'s best hunter'], ['Skerry', 'a singer of the dawn spiral'],
          ['Anwe', 'a feather-weaver'], ['Corra', 'a cliff-runner with a mended wing'], ['Halcy', 'a sentry of the high branches'], ['Wren', 'a carrier of messages'],
          ['Fenna', 'a quiet egg-warden'], ['Larkspur', 'a loud, cheerful scavenger'], ['Sorrel', 'a wind-reader'], ['Kittiwake', 'a teacher of fledglings']] },
  coil: { name: 'The Coil of the Black Mire', race: 'Naga', icon: '🐍', color: '#6ab88a', home: 'black_mire', envoy: 'sythra',
    draw: 30,
    gifts: [ { reagents: { silk_venom: 3 }, gold: 120, ask: 'three draughts of silk venom and coin for the brood-pools' },
             { reagents: { drake_scale: 2, brimstone_salt: 2 }, gold: 0, ask: 'drake scale and brimstone salt, to warm the eggs' } ],
    tribute: { silk_venom: 1, drake_scale: 1 },
    perk: 'Naga venom-binders teach your seals to coil: Binding Seals on beasts +10%.',
    envoyName: 'Sythra',
    pop: 30, brood: [2, 4], hatch: 8, young: 'hatchlings', sign: 'tailColor', signWord: 'scales',
    kin: [['Isseth', 'a venom-binder'], ['Vaska', 'a keeper of the brood-pools'], ['Nimue', 'a mire-guide'], ['Thessaly', 'a pearl-diver'],
          ['Ossa', 'a song-keeper of the Coil'], ['Sileth', 'a reed-hunter'], ['Murren', 'an elder\'s apprentice'], ['Quell', 'a lantern-bearer of the deep water'],
          ['Zahra', 'a dancer of the tide rite'], ['Ashai', 'a teller of riddles'], ['Venna', 'a healer of the Coil'], ['Lirael', 'a silent watcher of the shallows']] },
  clutch: { name: 'The Ashreach Clutch', race: 'Drake-kin', icon: '🐲', color: '#d87a4a', home: 'ashreach_temple', envoy: 'vharra',
    draw: 55,
    gifts: [ { reagents: { wyrm_frost: 2 }, gold: 150, ask: 'wyrm frost and coin, for the clutch-hoard' },
             { reagents: { cinder_ash: 3, drake_scale: 2 }, gold: 0, ask: 'cinder ash and drake scale, to keep the hatchery burning' } ],
    tribute: { wyrm_frost: 1, cinder_ash: 1 },
    perk: 'Drake-kin flame-wardens stand with you: your party ignores Burning Floors.',
    envoyName: 'Vharra',
    pop: 30, brood: [1, 2], hatch: 10, young: 'drakelings', sign: 'scaleColor', signWord: 'scales',
    kin: [['Cindra', 'a flame-warden'], ['Torva', 'a hoard-keeper'], ['Brannagh', 'a hatchery smith'], ['Skaldi', 'a duelist of the Clutch'],
          ['Reka', 'a scout of the snowline'], ['Ashka', 'a forge-singer'], ['Myrrhine', 'a scale-polisher with opinions'], ['Halda', 'a veteran of the Ashreach wars'],
          ['Vesska', 'a newly blooded blade'], ['Oriel', 'a keeper of the old fires'], ['Drusa', 'a wing-captain'], ['Kaelith', 'the hatchery\'s gentle giant']] },
  pride: { name: 'The Sunrun Pride', race: 'Cheetah-folk', icon: '🐆', color: '#e0b050', home: 'charmed_glade', envoy: 'tashra',
    draw: 85, // the Hunters' Lodge hunted them; a dominated Lodge brings them sooner
    gifts: [ { reagents: { antler_velvet: 3 }, gold: 180, ask: 'antler velvet from a clean hunt, and coin for the pride-mothers' },
             { reagents: { brimstone_salt: 2, moth_dust: 2 }, gold: 0, ask: 'brimstone salt and moth dust, to keep the Lodge\'s hounds off their trail' } ],
    tribute: { antler_velvet: 1, brimstone_salt: 1 },
    perk: 'Sunrun pacers run with your party: everyone starts each battle Hasted.',
    envoyName: 'Tashra',
    pop: 24, brood: [2, 4], hatch: 5, young: 'cubs', sign: 'hair', signWord: 'coat',
    kin: [['Rinna', 'the Pride\'s fastest sprinter'], ['Kesh', 'a scar-eared tracker'], ['Solva', 'a pride-mother\'s second'], ['Teyra', 'a dawn-runner'],
          ['Nimma', 'a lazy, sunny-tempered napper'], ['Vasha', 'a stalker of the long grass'], ['Callo', 'a storyteller of the old runs'], ['Ezri', 'a scout who came back from the Lodge'],
          ['Brisa', 'a wrestler of the pride'], ['Luneth', 'a night-watcher with silver eyes'], ['Tavi', 'a laughing young huntress'], ['Sabre', 'a veteran of the long chase']] },
};

// Kinship: how many of a sworn tribe have chosen you for the rite. Each
// one asks for herself. As the tribe comes to rely on you, more of them
// come, and more often (every = days between suitors).
export const KIN_STAGES = [
  { at: 0,  name: 'Sworn',        every: 0, desc: 'The tribe is sworn to you.' },
  { at: 1,  name: 'Blood-bound',  every: 6, desc: 'The envoy carried your blood home. Others are curious.' },
  { at: 3,  name: 'Nesting Near', every: 4, desc: 'They\'ve moved their nests closer and hunt the far wilds less.' },
  { at: 6,  name: 'Devoted',      every: 3, desc: 'Nobody looks to the wild for a mate anymore. They come to you.' },
  { at: 10, name: 'Your Tribe',   every: 2, desc: 'The whole tribe is yours. They hunt for you now (+30 gold nightly).' },
];
