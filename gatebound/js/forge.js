// ============================================================
// GATEBOUND — the Character Forge
// Receives a character description (WarlockCodex card JSON,
// tavern-card JSON, or plain prose) and generates a playable
// guildmate: chibi model spec, class, stats, kit, and passive.
// Forged heroes are stored in S.custom and re-registered into
// the live tables on every load.
// ============================================================

import { HEROES } from './data.js';
import { SPEAKERS } from './story.js';

// Visual registration is injected by the UI layer (actors3d imports
// three.js, which keeps this module headless-testable).
let registerVisuals = null;
export function setVisualHook(fn) { registerVisuals = fn; }

// ------------------------------------------------------------------
// keyword tables
// ------------------------------------------------------------------

const HAIR_COLORS = {
  silver: 0xd8d8e2, white: 0xf2f2f6, platinum: 0xe8e4d8, blonde: 0xf0cf6e, blond: 0xf0cf6e,
  golden: 0xf0cf6e, gold: 0xf0cf6e, red: 0xc84a3a, crimson: 0xa83232, scarlet: 0xb83a3a,
  auburn: 0x8a4a2a, ginger: 0xd87c3a, orange: 0xd87c3a, copper: 0xc06a38, brown: 0x6e4a2e,
  chestnut: 0x7a5230, brunette: 0x5e402a, black: 0x2a2630, raven: 0x232030, dark: 0x322c38,
  blue: 0x4a6ac8, navy: 0x2a3a6a, azure: 0x5a8ad8, green: 0x4a8a5a, emerald: 0x3a9a6a,
  pink: 0xf5a8c8, rose: 0xe88aa8, purple: 0x8a5ac8, violet: 0x9a6ad8, lavender: 0xb8a0e0,
  lilac: 0xc0a8e0, teal: 0x4a9a9a, turquoise: 0x4aaab0, grey: 0x9a9aa2, gray: 0x9a9aa2, ashen: 0xb0b0b8,
};

const SKIN_TONES = {
  pale: 0xf6e8d8, porcelain: 0xf8eee4, fair: 0xf6ddc0, ivory: 0xf6e8d0, freckled: 0xf2d4b0,
  tan: 0xd8b088, tanned: 0xd8b088, olive: 0xc8a878, bronze: 0xb88858, golden: 0xd8b078,
  brown: 0x9a6a42, dark: 0x7a4a2e, deep: 0x6a3f26, ebony: 0x5a3520, umber: 0x6a4228,
  green: 0x74a85c, grey: 0x9a9aa2, gray: 0x9a9aa2, ashen: 0xb0aab2, blue: 0x8ab0d8,
  lavender: 0xc0aad0, shadow: 0x1a1626, obsidian: 0x201c2a, marble: 0xe8e4de, stone: 0x8a8a90,
};

const EYE_COLORS = {
  blue: 0x4a7ad8, azure: 0x5a9ae8, green: 0x3a9a5a, emerald: 0x2c8a4f, hazel: 0x8a6a3a,
  brown: 0x6a4a2a, amber: 0xd89a3a, gold: 0xd8b04a, golden: 0xd8b04a, yellow: 0xd8c04a,
  red: 0xc83a3a, crimson: 0xb02a2a, violet: 0x9a6ad8, purple: 0x8a5ac8, grey: 0x9aa0aa,
  gray: 0x9aa0aa, silver: 0xc8ccd8, black: 0x1c1c24, pink: 0xe88ab0, teal: 0x4aa0a0, white: 0xe8e8f0,
};

// role keyword → { role, cls } — first match in this order wins
const CLASS_WORDS = [
  [/paladin|crusader/, 'tank', 'Paladin'],
  [/knight/, 'tank', 'Knight'],
  [/guard(?:ian)?|warden|sentinel|shield|bulwark|juggernaut|protector/, 'tank', 'Warden'],
  [/berserker|barbarian/, 'tank', 'Berserker'],
  [/cleric|priest(?:ess)?|nun|saint|chaplain/, 'healer', 'Cleric'],
  [/healer|medic|physician|apothecar|herbalist|alchemist/, 'healer', 'Healer'],
  [/druid|shaman/, 'healer', 'Druid'],
  [/necromancer|warlock|witch\b|occultist|hex/, 'caster', 'Warlock'],
  [/sorcer|wizard|mage|magus|arcanist|enchant|elementalist|spellblade/, 'caster', 'Mage'],
  [/oracle|seer|astrologer/, 'caster', 'Oracle'],
  [/assassin|rogue|thief|shadow(?:blade)?|cutthroat|infiltrator/, 'striker', 'Rogue'],
  [/duelist|fencer|swashbuckler|blademaster|samurai|ronin|swords(?:man|woman)/, 'striker', 'Duelist'],
  [/hunter|ranger|archer|marksman|scout|tracker/, 'striker', 'Hunter'],
  [/monk|brawler|pugilist|martial/, 'striker', 'Monk'],
  [/mercenary|sellsword|soldier|warrior|fighter|gladiator/, 'striker', 'Mercenary'],
  [/bard|minstrel|dancer|performer|muse|singer/, 'support', 'Bard'],
  [/tactician|strategist|scholar|chronicler|scribe|librarian/, 'support', 'Tactician'],
];

// per-role archetypes: stats modeled on the existing cast
const ARCHETYPES = {
  tank: {
    base: { hp: 148, mp: 22, atk: 14, mag: 4, def: 15, res: 9, agi: 8, luk: 7 },
    growth: { hp: 11.5, mp: 2, atk: 2.0, mag: 0.6, def: 2.0, res: 1.5, agi: 0.9, luk: 0.8 },
    kit: { 1: 'shield_bash', 2: 'stand_fast', 8: 'aegis', 16: 'crushing_blow', 26: 'guardian_wall' },
    weapon: 'shield',
    passives: [
      { id: 'stonewall', name: 'Stonewall', desc: 'Takes 8% less damage.', dr: 0.08 },
      { id: 'looming', name: 'Looming Presence', desc: 'Hard to ignore, harder to move: takes 8% less damage.', dr: 0.08 },
    ],
  },
  healer: {
    base: { hp: 98, mp: 56, atk: 7, mag: 14, def: 8, res: 13, agi: 9, luk: 11 },
    growth: { hp: 8, mp: 5, atk: 0.8, mag: 2.0, def: 1.2, res: 1.8, agi: 1.0, luk: 1.2 },
    kit: { 1: 'mend', 2: 'nettle_flask', 8: 'soothing_word', 16: 'tonic_mist', 26: 'panacea' },
    weapon: 'staff',
    passives: [
      { id: 'bedside', name: 'Bedside Manner', desc: 'Each round, quietly tends the most wounded ally.', roundHeal: 0.03 },
    ],
  },
  caster: {
    base: { hp: 88, mp: 60, atk: 6, mag: 18, def: 7, res: 13, agi: 10, luk: 9 },
    growth: { hp: 7, mp: 5.5, atk: 0.7, mag: 2.4, def: 1.0, res: 1.9, agi: 1.1, luk: 1.0 },
    kit: { 1: 'shadow_lash', 2: 'gloom_brand', 8: 'umbral_coil', 16: 'eclipse', 26: 'midnight_rite' },
    weapon: 'staff',
    passives: [
      { id: 'keen_mind', name: 'Keen Mind', desc: 'Finds the seam in every ward: +8% critical chance.', crit: 0.08 },
    ],
  },
  striker: {
    base: { hp: 96, mp: 38, atk: 16, mag: 8, def: 8, res: 9, agi: 16, luk: 11 },
    growth: { hp: 8, mp: 3, atk: 2.3, mag: 1.0, def: 1.0, res: 1.2, agi: 1.8, luk: 1.2 },
    kit: { 1: 'twin_fangs', 4: 'shadow_rush', 12: 'phantom_step', 22: 'execute' },
    weapon: 'sword',
    passives: [
      { id: 'slippery', name: 'Slippery', desc: 'Never quite where the blow lands: +12% chance to be missed.', dodge: 0.12 },
      { id: 'red_thread', name: 'Red Thread', desc: 'Always finds the artery: +10% critical chance.', crit: 0.1 },
    ],
  },
  support: {
    base: { hp: 100, mp: 50, atk: 9, mag: 12, def: 9, res: 12, agi: 10, luk: 13 },
    growth: { hp: 8.5, mp: 4.5, atk: 1.1, mag: 1.7, def: 1.3, res: 1.6, agi: 1.1, luk: 1.4 },
    kit: { 1: 'encourage', 2: 'soothing_word', 8: 'war_banner', 16: 'radiant_poise', 26: 'sanctuary' },
    weapon: 'book',
    passives: [
      { id: 'good_company', name: 'Good Company', desc: 'Fights feel lighter and pay better: +15% gold.', goldMult: 0.15 },
    ],
  },
};

// ------------------------------------------------------------------
// parsing
// ------------------------------------------------------------------

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

// find a color word within reach of an anchor word ("silver hair", "hair like silver")
function colorNear(text, table, anchor) {
  let best = null, bestDist = 40;
  for (const [word, hex] of Object.entries(table)) {
    const re = new RegExp(`\\b${word}\\b[^.!?]{0,28}\\b${anchor}\\b|\\b${anchor}\\b[^.!?]{0,28}\\b${word}\\b`, 'i');
    const m = text.match(re);
    if (m && m.index < 1e9) {
      const dist = m[0].length;
      if (dist < bestDist) { best = hex; bestDist = dist; }
    }
  }
  return best;
}

// Accepts: forge card {name, description, persona?, tags?}, tavern card
// {spec, data:{...}}, WC card {name, description, tags}, or plain prose.
export function normalizeCard(input) {
  let card = input;
  if (typeof input === 'string') {
    const s = input.trim();
    if (s.startsWith('{') || s.startsWith('[')) {
      try { card = JSON.parse(s); } catch (e) { card = { description: s }; }
    } else card = { description: s };
  }
  if (Array.isArray(card)) card = card[0];
  if (card && card.data && (card.spec || card.data.name)) card = card.data; // tavern card spec
  let name = (card.name || '').trim();
  const desc = [card.description, card.appearance, card.personality].filter(Boolean).join('\n');
  const tags = (card.tags || []).map(t => String(t));
  // plain prose: try "Mielle is a...", "Renna, the...", "Sister Vesper was..."
  if (!name && desc) {
    const m = desc.match(/^\s*"?([A-Z][a-zA-Z'’-]+(?: [A-Z][a-zA-Z'’-]+)?)"?[,:]?\s+(?:is|was|—|–|the|a\b)/);
    if (m) name = m[1];
  }
  return { name, description: desc || String(card.description || ''), persona: card.persona || card.personality || '', tags };
}

export function parseCharacter(input, salt = 0) {
  const card = normalizeCard(input);
  const text = (card.name + ' ' + card.description + ' ' + card.tags.join(' ')).toLowerCase();
  const seed = (hash(card.name || card.description.slice(0, 40)) + salt * 7919) >>> 0;
  const pick = (arr, salt = 0) => arr[(seed + salt) % arr.length];

  // --- role & class ---
  let role = null, cls = null;
  for (const [re, r, c] of CLASS_WORDS) {
    if (re.test(text)) { role = r; cls = c; break; }
  }
  if (!role) { role = pick(['striker', 'caster', 'support'], 1); cls = { striker: 'Adventurer', caster: 'Adept', support: 'Companion' }[role]; }

  // --- appearance ---
  const ghost = /\bghost|spectral|wraith|phantom|undead|spirit\b|shade\b|revenant|banshee|ethereal/.test(text);
  const shadowBody = /made of (?:shadow|dark)|shadow[- ]?(?:entity|creature|being)|living shadow/.test(text);
  const spec = {
    skin: shadowBody ? 0x1a1626 : (colorNear(text, SKIN_TONES, 'skin') ?? colorNear(text, SKIN_TONES, 'complexion') ?? pick([0xf6ddc0, 0xf2d4b0, 0xd8b088, 0xc8a878, 0x9a6a42], 2)),
    hair: /\bbald|hairless|no hair/.test(text) || shadowBody ? null
      : (colorNear(text, HAIR_COLORS, 'hair') ?? colorNear(text, HAIR_COLORS, 'locks') ?? colorNear(text, HAIR_COLORS, 'mane') ?? pick(Object.values(HAIR_COLORS), 3)),
    hairstyle: /long[\w\s,-]{0,18}hair|hair (?:falls|down|past|to (?:her|his|the) waist)|waist-length|flowing[\w\s,-]{0,14}hair|braided|braid\b|ponytail/.test(text) ? 'long'
      : /curly|curls|ringlets|twin ?tails|twin-tails|drills/.test(text) ? 'curly'
      : /straight[\w\s,-]{0,14}hair|sleek[\w\s,-]{0,14}hair|bob\b|blunt/.test(text) ? 'straight' : 'short',
    eyeColor: colorNear(text, EYE_COLORS, 'eyes') ?? colorNear(text, EYE_COLORS, 'gaze') ?? 0x1c1c24,
    eyeGlow: ghost || shadowBody || /glowing eyes|eyes glow|luminous eyes|burning eyes/.test(text),
    elf: /\belf\b|elven|elvish|half-elf|pointed ears/.test(text),
    ears: /rabbit|bunny|lapin|lop[- ]ear/.test(text) ? 'rabbit'
      : /kitsune|fox[- ]?(?:girl|boy|ears|spirit|folk)|vulpine/.test(text) ? 'fox'
      : /wolf[- ]?(?:girl|boy|ears|kin)|lupine/.test(text) ? 'wolf'
      : /\bneko\b|cat[- ]?(?:girl|boy|ears|kin)|feline/.test(text) ? 'cat' : null,
    tail: /fox|kitsune|vulpine/.test(text) && /tail|kitsune|fox/.test(text) ? 'fox' : /\btail\b/.test(text) ? 'plain' : null,
    horns: /\bhorns?\b|demon(?:ess)?|oni\b|draconic|dragonkin|tiefling|succubus|devil/.test(text),
    wings: /\bwings?\b|angel(?:ic)?|valkyrie|harpy|fairy|seraph/.test(text),
    halo: /\bhalo\b|angel(?:ic)?|seraph|saint(?:ly)?/.test(text),
    mask: /\bmasked?\b|porcelain face|faceplate|visor/.test(text),
    ghost,
    scale: /towering|giant(?:ess)?|massive|hulking|seven fe?e?t|colossal/.test(text) ? 1.18
      : /\btiny\b|petite|diminutive|small stature|halfling|gnome|fairy/.test(text) ? 0.85 : 1,
    outfitStyle: /armor|armour|plate|chain ?mail|breastplate/.test(text) ? 'armor'
      : /\brobes?\b|vestment|habit\b/.test(text) ? 'robe'
      : /\bdress\b|\bgown\b|skirt/.test(text) ? 'dress' : null,
    outfit: colorNear(text, HAIR_COLORS, '(?:cloak|robe|dress|gown|armor|coat|jacket|tunic|uniform|clothes)')
      ?? { tank: 0x8a8f96, healer: 0x7a9a58, caster: 0x2a2438, striker: 0x4a4a52, support: 0x8a6d3a }[role],
    legColor: 0x33373d,
    frill: 0xd9b96a,
  };
  spec.weapon = ARCHETYPES[role].weapon;
  spec.accent = spec.hair ?? spec.eyeColor;
  if (spec.ghost || shadowBody) spec.eyeGlow = true;

  // features list for the preview UI
  const features = [
    spec.elf && 'elf ears', spec.ears && spec.ears + ' ears', spec.horns && 'horns',
    spec.wings && 'wings', spec.halo && 'halo', spec.tail && (spec.tail === 'fox' ? 'fox tail' : 'tail'),
    spec.mask && 'mask', spec.ghost && 'spectral', shadowBody && 'shadow-form',
    spec.scale > 1 && 'towering', spec.scale < 1 && 'small',
  ].filter(Boolean);

  const arch = ARCHETYPES[role];
  const passive = pick(arch.passives, 5);
  return { card, seed, role, cls, spec, features, kit: arch.kit, passive };
}

// ------------------------------------------------------------------
// hero assembly & registration
// ------------------------------------------------------------------

const ROLE_COLORS = { tank: '#9aa2ac', healer: '#8fce7a', caster: '#b08cff', striker: '#e8c04a', support: '#d8a04a' };

export function forgeHero(parsed, S) {
  const { card, role, cls, spec, kit, passive } = parsed;
  const name = (card.name || 'Stranger').slice(0, 18);
  const id = 'c_' + name.toLowerCase().replace(/[^a-z0-9]+/g, '') .slice(0, 12) + '_' + (parsed.seed % 10000).toString(36);
  const arch = ARCHETYPES[role];
  const firstSentence = (card.description.match(/[^.!?]{10,220}[.!?]/) || [card.description.slice(0, 200)])[0].trim();
  return {
    id, recruit: true, custom: true,
    name, epithet: 'the Summoned', cls,
    desc: firstSentence,
    persona: (card.persona || card.description).slice(0, 900),
    startLevel: Math.max(20, (S.heroes.player?.level || 20) - 2),
    base: { ...arch.base }, growth: { ...arch.growth },
    skills: { ...kit },
    passive: { ...passive },
    role,
    spec,
    color: ROLE_COLORS[role],
  };
}

export function registerCustomHero(def) {
  HEROES[def.id] = def;
  SPEAKERS[def.id] = { name: def.name, color: def.color };
  if (registerVisuals) registerVisuals(def);
}

// Re-register everything in S.custom (called after any save load).
export function restoreCustomHeroes(S) {
  for (const def of Object.values(S.custom || {})) registerCustomHero(def);
}

// Forge, register, persist, and enroll in one step.
export function summonHero(parsed, S) {
  const def = forgeHero(parsed, S);
  if (!S.custom) S.custom = {};
  S.custom[def.id] = def;
  registerCustomHero(def);
  S.heroes[def.id] = { level: def.startLevel, xp: 0, gear: { weapon: null, armor: null, charm: null } };
  if (!S.recruited.includes(def.id)) S.recruited.push(def.id);
  return def;
}

// Remove a forged hero entirely (blocked while they're dispatched).
export function releaseHero(S, id) {
  const def = S.custom && S.custom[id];
  if (!def) return false;
  const h = S.heroes[id];
  if (h) for (const slot of ['weapon', 'armor', 'charm']) { if (h.gear[slot]) S.gearBag.push(h.gear[slot]); }
  delete S.heroes[id];
  delete S.custom[id];
  S.recruited = S.recruited.filter(x => x !== id);
  delete HEROES[id];
  return true;
}
