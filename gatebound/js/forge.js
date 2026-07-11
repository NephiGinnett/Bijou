// ============================================================
// GATEBOUND — the Character Forge
// Receives a character description (WarlockCodex card JSON,
// tavern-card JSON, or plain prose) and generates a playable
// guildmate: chibi model spec, class, stats, kit, and passive.
// Forged heroes are stored in S.custom and re-registered into
// the live tables on every load.
// ============================================================

import { HEROES } from './data.js';
import { SPEAKERS, EVENTS } from './story.js';

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
  [/shapeshi|shape-shi|changeling|doppel|skinwalker|skin-walker|\bmimic\b|were(?:wolf|creature|beast)|wild ?shape|polymorph|lycanthrop/, 'shifter', 'Shifter'],
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
  shifter: {
    base: { hp: 108, mp: 34, atk: 15, mag: 9, def: 9, res: 9, agi: 14, luk: 11 },
    growth: { hp: 9, mp: 3, atk: 2.1, mag: 1.2, def: 1.2, res: 1.2, agi: 1.6, luk: 1.2 },
    kit: { 1: 'feral_claw', 2: 'pounce_sh', 10: 'primal_roar', 20: 'apex_rend' },
    weapon: 'claw',
    passives: [
      { id: 'apex_mimic', name: 'Apex Mimic', desc: 'When an enemy falls, take its shape — learn one of its skills for the rest of the battle and gain Shifted (+ATK/MAG/AGI).', apexMimic: true },
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
    hairstyle: /\bbraid|war-braid|war braid|cornrow|dreadlock|plaited/.test(text) ? 'braided'
      : /long[\w\s,-]{0,18}hair|hair (?:falls|down|past|to (?:her|his|the) waist)|waist-length|flowing[\w\s,-]{0,14}hair|ponytail/.test(text) ? 'long'
      : /curly|curls|ringlets|twin ?tails|twin-tails|drills/.test(text) ? 'curly'
      : /straight[\w\s,-]{0,14}hair|sleek[\w\s,-]{0,14}hair|bob\b|blunt/.test(text) ? 'straight' : 'short',
    eyeColor: colorNear(text, EYE_COLORS, 'eyes') ?? colorNear(text, EYE_COLORS, 'gaze') ?? 0x1c1c24,
    eyeGlow: ghost || shadowBody || /glowing eyes|eyes glow|luminous eyes|burning eyes/.test(text),
    elf: /\belf\b|elven|elvish|half-elf|pointed ears/.test(text),
    ears: /rabbit|bunny|lapin|lop[- ]ear/.test(text) ? 'rabbit'
      : /kitsune|fox[- ]?(?:girl|boy|ears|spirit|folk)|vulpine/.test(text) ? 'fox'
      : /wolf[- ]?(?:girl|boy|ears|kin)|lupine/.test(text) ? 'wolf'
      : /\bneko\b|cat[- ]?(?:girl|boy|ears|kin)|feline/.test(text) ? 'cat' : null,
    tail: /dragon(?:kin|born)?|draconic|\bwyrm|drake/.test(text) && /tail/.test(text) ? 'dragon'
      : /demon|devil|imp|succubus|tiefling/.test(text) && /tail/.test(text) ? 'devil'
      : /fox|kitsune|vulpine/.test(text) && /tail|kitsune|fox/.test(text) ? 'fox'
      : /wolf|lupine|canine/.test(text) && /tail/.test(text) ? 'wolf'
      : /\bcat|feline|neko/.test(text) && /tail/.test(text) ? 'cat'
      : /\btail\b/.test(text) ? 'plain' : null,
    horns: /\bhorns?\b|demon(?:ess)?|oni\b|draconic|dragonkin|tiefling|succubus|devil/.test(text),
    wings: /\bwings?\b|\bangel(?:ic)?\b|valkyrie|harpy|\bfairy\b|\bseraph(?:im)?\b/.test(text),
    halo: /\bhalo\b|\bangel(?:ic)?\b|\bseraph(?:im)?\b|\bsaint(?:ly)?\b/.test(text),
    mask: /\bmasked?\b|porcelain face|faceplate|visor/.test(text),
    ghost,
    // ---- newly supported body features ----
    lowerBody: /naga|lamia|serpent(?:ine)? (?:body|tail|lower)|snake (?:body|tail)|snake-bodied/.test(text) ? 'serpent'
      : /satyr|faun\b|hooves|hoofed|goat (?:legs|-legged)|digitigrade/.test(text) ? 'hooves' : null,
    scaled: /\bscaled\b|\bscales\b|scaly|reptilian|lizard(?:folk|man|kin)?|dragonkin|dragonborn|draconic/.test(text),
    extraArms: /four[- ]?arm|six[- ]?arm|extra arms|multiple arms|many arms|multi-armed/.test(text),
    thirdEye: /third eye|extra eyes|many eyes|multiple eyes/.test(text),
    crown: /\bcrown\b|tiara|circlet|diadem|coronet/.test(text),
    cape: /\bcape\b|long cloak|trailing cloak|flowing cloak|mantle/.test(text),
    scar: /\bscar\b|scarred|scars\b/.test(text),
    eyepatch: /eyepatch|eye patch|one eye covered/.test(text),
    glasses: /glasses|spectacles|monocle/.test(text),
    antennae: /antennae|antenna\b/.test(text),
    feathers: /feathers|feathered|plumage/.test(text),
    // ---- cosmetics from the Codex scan ----
    markings: /tattoo|inked|body art|\bmarkings\b|daedric marking|runic (?:skin|marking)|ceremonial(?:ly)? scar|war ?paint|tribal mark/.test(text),
    freckles: /freckl/.test(text),
    piercings: /piercing|nose ring|septum|pierced (?:ears|nose|lip)|\bstuds\b/.test(text),
    collar: /\bcollar\b|choker/.test(text),
    antlers: /antlers|stag\b|\bdeer\b|elk\b|\bfaun-|forest spirit/.test(text),
    scale: /towering|giant(?:ess)?|massive|hulking|seven fe?e?t|colossal/.test(text) ? 1.18
      : /\btiny\b|petite|diminutive|small stature|halfling|gnome|fairy/.test(text) ? 0.85 : 1,
    // ---- body build & chest (character differentiation) ----
    build: /muscular|athletic build|broad[- ]shoulder|powerful build|warrior build|strapping|brawny|burly/.test(text) ? 'broad'
      : /plump|thick|curvy|full[- ]figured|rubenesque|voluptuous|soft build|chubby|shapely|hourglass/.test(text) ? 'curvy'
      : /slender|slim|lithe|willowy|waifish|lean\b|slight build/.test(text) ? 'slim' : 'average',
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
  if (spec.scaled && !/\bskin\b|complexion/.test(text)) spec.skin = 0x6a9a5a; // scaly green default

  // body chest sizing (0 none → 3 large) for character differentiation
  const femalePresenting = /gender:\s*female|female[- ]presenting|\bshe\b|\bher\b|\bwoman\b|\bgirl\b|\bfemale\b|\blady\b|mistress|sorceress|enchantress|priestess|matron|\bqueen\b|princess|maiden|\bwife\b|\bmother\b|daughter|\bsister\b|\bnun\b/.test(text);
  const malePresenting = /gender:\s*male|\bhe\b|\bhis\b|\bhim\b|\bman\b|\bmale\b|\bboy\b|\blord\b|\bking\b|\bprince\b|\bfather\b|\bson\b|\bbrother\b|\bsir\b/.test(text);
  if (/flat[- ]?chest|small (?:breasts|bust|chest)|modest (?:bust|chest)|a-cup|boyish figure|petite (?:bust|chest)/.test(text)) spec.chest = 1;
  else if (/busty|buxom|voluptuous|large (?:breasts|bust|chest)|full (?:breasts|bust)|ample (?:bust|chest|breasts)|big (?:breasts|bust)|heavy (?:breasts|bust)|generous (?:bust|chest|figure)|huge (?:breasts|bust)|dd?-?cup/.test(text)) spec.chest = 3;
  else if (/curvy|shapely|hourglass|full[- ]figured|womanly|rubenesque/.test(text)) spec.chest = 2;
  else spec.chest = (femalePresenting && !malePresenting) ? 2 : (malePresenting ? 0 : 1);
  if (spec.build === 'curvy' && spec.chest < 2) spec.chest = 2;

  // themed skill line from the description
  const theme = themeSkillFor(text);
  const arch = ARCHETYPES[role];
  const kit = theme ? themedKit(theme, role, arch.kit) : arch.kit;

  // features list for the preview UI
  const tailLabel = { fox: 'fox tail', dragon: 'dragon tail', devil: 'devil tail', wolf: 'wolf tail', cat: 'cat tail', plain: 'tail' };
  const features = [
    theme && `${theme.label} kit`,
    spec.elf && 'elf ears', spec.ears && spec.ears + ' ears', spec.horns && 'horns',
    spec.wings && 'wings', spec.halo && 'halo', spec.tail && tailLabel[spec.tail],
    spec.lowerBody === 'serpent' && 'serpent lower body', spec.lowerBody === 'hooves' && 'hooved legs',
    spec.scaled && 'scaled skin', spec.extraArms && 'extra arms', spec.thirdEye && 'third eye',
    spec.crown && 'crown', spec.cape && 'cape', spec.scar && 'scar', spec.eyepatch && 'eyepatch',
    spec.glasses && 'glasses', spec.antennae && 'antennae', spec.feathers && 'feathers',
    spec.markings && 'markings', spec.freckles && 'freckles', spec.piercings && 'piercings',
    spec.collar && 'collar', spec.antlers && 'antlers', spec.hairstyle === 'braided' && 'braids',
    spec.build !== 'average' && `${spec.build} build`,
    spec.mask && 'mask', spec.ghost && 'spectral', shadowBody && 'shadow-form',
    spec.scale > 1 && 'towering', spec.scale < 1 && 'small',
  ].filter(Boolean);

  const passive = pick(arch.passives, 5);
  const gaps = forgeGaps(text, spec, role);
  return { card, seed, role, cls, spec, features, kit, passive, gaps, themeLabel: theme ? theme.label : null };
}

// ------------------------------------------------------------------
// Gaps report — traits the Forge notices in the text but cannot yet
// render or build, so the player knows what to tweak (or ask for).
// ------------------------------------------------------------------

// Body/appearance traits STILL without a builder. (Serpent/hooved lower
// bodies, scales, extra arms, third eye, crown, cape, scar, eyepatch,
// glasses, antennae, feathers, and tail variants are built now.)
const UNSUPPORTED_FEATURES = [
  { re: /slime|ooze|gelatinous|goo\b/, label: 'slime / ooze body' },
  { re: /tentacle/, label: 'tentacles' },
  { re: /beard|mustache|moustache|stubble|goatee/, label: 'facial hair' },
  { re: /cyber|mechanical|prosthetic|automaton|clockwork|robotic|android/, label: 'mechanical / prosthetic parts' },
  { re: /centaur|\btaur\b|horse (?:body|lower)/, label: 'full centaur body' },
  { re: /gills|fins\b|mermaid|merfolk|siren\b/, label: 'aquatic features (fins / gills)' },
  { re: /fur-covered|covered in fur|full fur|furred body/, label: 'full fur coat' },
  { re: /wheelchair|peg leg|missing (?:an? )?(?:arm|leg|hand)/, label: 'mobility aid / missing limb' },
];

// Skill themes the generic kit still doesn't capture (elemental/status
// lines are built now — see SUPPORTED_THEMES).
const UNSUPPORTED_SKILL_THEMES = [
  { re: /summon|conjure|familiar|raise (?:the )?dead|necromanc/, label: 'summoning' },
  { re: /music|song|sing\b|melody|\bbard\b/, label: 'song / performance' },
  { re: /trap|snare|\bbomb|explosive|alchemy/, label: 'traps / alchemy' },
];

export function forgeGaps(text, spec, role) {
  const feats = [];
  for (const f of UNSUPPORTED_FEATURES) if (f.re.test(text) && !feats.includes(f.label)) feats.push(f.label);
  const themes = [];
  for (const t of UNSUPPORTED_SKILL_THEMES) if (t.re.test(text) && !themes.includes(t.label)) themes.push(t.label);
  return { features: feats.slice(0, 8), skills: themes.slice(0, 6) };
}

// ------------------------------------------------------------------
// Themed skill lines — a description implying an element/status gives
// the forged hero a matching kit. Ordered: first match wins.
// ------------------------------------------------------------------

const SUPPORTED_THEMES = [
  { id: 'fire',      re: /\bfire\b|flame|flaming|burn|pyro|inferno|ember|magma|lava/, label: 'fire', skills: ['th_fire1', 'th_fire2', 'th_fire3'] },
  { id: 'ice',       re: /\bice\b|frost|freezing|freeze|cryo|glacial|rime|snow/, label: 'ice', skills: ['th_ice1', 'th_ice2', 'th_ice3'] },
  { id: 'lightning', re: /lightning|thunder|storm|shock|electric|volt|tempest/, label: 'lightning', skills: ['th_bolt1', 'th_bolt2', 'th_bolt3'] },
  { id: 'poison',    re: /poison|venom|toxic|plague|blight|acid/, label: 'poison', skills: ['th_pois1', 'th_pois2', 'th_pois3'] },
  { id: 'holy',      re: /holy|radiant|divine|sacred|celestial|hallow/, label: 'holy', skills: ['th_holy1', 'th_holy2', 'th_holy3'] },
  { id: 'shadow',    re: /shadow|dark magic|void|umbral|eclipse|night magic|gloom/, label: 'shadow', skills: ['shadow_lash', 'umbral_coil', 'midnight_rite'] },
  { id: 'earth',     re: /\bearth\b|stone|rock|quake|seismic|geoman/, label: 'earth', skills: ['th_earth1', 'th_earth2', 'th_earth3'] },
  { id: 'wind',      re: /\bwind\b|gale|zephyr|cyclone|aeroman|air magic/, label: 'wind', skills: ['th_wind1', 'th_wind2', 'th_wind3'] },
  { id: 'bleed',     re: /\bbleed|sever|lacerat|hemorrhag|gore\b/, label: 'bleed', skills: ['th_bleed1', 'th_bleed2', 'th_bleed3'] },
  { id: 'curse',     re: /curse|hex|doom|jinx|malediction|blood magic/, label: 'curse', skills: ['th_curse1', 'th_curse2', 'th_curse3'] },
];

export function themeSkillFor(text) {
  return SUPPORTED_THEMES.find(t => t.re.test(text)) || null;
}

// Damage roles get a fully themed kit; support roles keep their identity
// and graft the theme's opener + finisher for flavor.
function themedKit(theme, role, baseKit) {
  const [x1, x2, x3] = theme.skills;
  if (role === 'caster' || role === 'striker') return { 1: x1, 10: x2, 22: x3 };
  return { ...baseKit, 14: x1, 24: x3 };
}

// ------------------------------------------------------------------
// hero assembly & registration
// ------------------------------------------------------------------

const ROLE_COLORS = { tank: '#9aa2ac', healer: '#8fce7a', caster: '#b08cff', striker: '#e8c04a', support: '#d8a04a', shifter: '#c98adf' };

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
    gaps: parsed.gaps || { features: [], skills: [] },
    color: ROLE_COLORS[role],
  };
}

// Pull a list of named characters out of an uploaded/pasted JSON blob,
// so a multi-character file can offer a picker. Returns [] on failure.
export function listCards(text) {
  let data;
  try { data = JSON.parse(text); } catch (e) { return []; }
  const arr = Array.isArray(data) ? data : [data];
  return arr.map((c, i) => {
    const n = normalizeCard(c);
    return { index: i, name: n.name || `(unnamed #${i + 1})`, card: c };
  }).filter(x => x.card && (x.card.name || x.card.data || x.card.description));
}

export function registerCustomHero(def) {
  HEROES[def.id] = def;
  SPEAKERS[def.id] = { name: def.name, color: def.color };
  registerBondArc(def);
  if (registerVisuals) registerVisuals(def);
}

// ------------------------------------------------------------------
// Companion trials — the Codex's psyche-themed trial generator,
// adapted into hearts and camp scenes. Each forged soul carries an
// inner THEME read from their description; the Forge assembles a
// four-scene bond arc around it: arrival → the crack → the trial →
// devotion. Scenes register as ordinary camp events, so the existing
// picker, spice variants, and tone tracking all apply.
// ------------------------------------------------------------------

const THEMES = [
  { id: 'loneliness', detect: /lonel|alone|solitary|outcast|shunned|friendless|isolat/,
    was: 'someone who left every fire first, so it couldn\'t leave me',
    crack: 'people like me learn to travel light. You stop keeping things that can be taken. Company was always the first thing to go.',
    trialFace: 'every campfire I ever left before dawn, so nobody could leave it first',
    vow: 'staying. Out loud. Where the whole fire can hear it.' },
  { id: 'duty', detect: /duty|oath|sworn|honor|obligat|vow\b|service|loyal/,
    was: 'a stack of orders standing in boots',
    crack: 'I have followed orders my whole life. Take away the orders and I honestly do not know what is left standing here.',
    trialFace: 'every order I followed so I would not have to choose',
    vow: 'choosing this. Not because anyone commanded it. Because I do.' },
  { id: 'pride', detect: /proud|pride|arrogan|haught|superior|vain|boastful/,
    was: 'a summit with no company on it',
    crack: 'being the best was the whole plan. Nobody warns you the view from the top is mostly of the climb — and everyone you stepped past on it.',
    trialFace: 'every hand I refused because taking it would have meant admitting I needed it',
    vow: 'asking for help. Once. As practice. Do not make it strange.' },
  { id: 'timidity', detect: /shy|timid|nervous|anxious|meek|soft-spoken|skittish|flinch/,
    was: 'three rehearsals deep in every sentence',
    crack: 'I rehearse. Everything. Every sentence, three times, before I say it. You are the first person the rehearsals keep failing around, and I do not hate it.',
    trialFace: 'every room I did not enter because someone might look up',
    vow: 'saying the unrehearsed thing. Here it comes. ...Thank you for looking up.' },
  { id: 'atonement', detect: /atone|guilt|sin\b|redempt|forgive|penance|shame|regret/,
    was: 'a debt wearing a person',
    crack: 'there is a thing I did, back before. I will not dress it up for you. I came to gates because dangerous work felt like installments on a debt.',
    trialFace: 'the person I was when I earned the debt',
    vow: 'forgiving the wretch. Not forgetting — forgiving. There is a difference, and you taught it to me.' },
  { id: 'debt', detect: /debt|owe|coin|gold|poverty|poor\b|hungry|starv/,
    was: 'someone bracing for the bill',
    crack: 'everything in my life has had a price on it since I was small. I keep waiting for this guild to hand me the bill. It is very unsettling that it has not.',
    trialFace: 'every kindness I refused because I could not afford to owe it',
    vow: 'accepting something freely given. Watch. I am doing it right now. It is agonizing. Thank you.' },
  { id: 'curiosity', detect: /curious|curiosity|scholar|question|wonder|learn|secrets|knowledge/,
    was: 'someone who took every wonder apart to see the gears',
    crack: 'I have wanted to know how everything works since I could crawl. Then I met this party, and for the first time the question scares me — because some things stop working when you take them apart.',
    trialFace: 'every wonder I dissected instead of simply standing inside',
    vow: 'leaving one thing unstudied. This one. Us. I will simply... be in it.' },
  { id: 'grief', detect: /grie[fv]|mourn|widow|lost (?:his|her|their)|dead (?:wife|husband|lover|family|sister|brother)|buried/,
    was: 'living a room away from the past tense',
    crack: 'I had people, before. I do not talk about them because the talking makes them past tense, and I am not done with the present tense yet.',
    trialFace: 'the goodbye I never said, standing patient as a door',
    vow: 'saying it. The goodbye. And then walking back to a fire that is still burning.' },
  { id: 'belonging', detect: /./,
    was: 'a guest with boots by the door',
    crack: 'I have been a guest everywhere I ever slept. Good guests keep their boots by the door. Mine are still by the door. Old habit.',
    trialFace: 'every threshold I stood on, waiting to be told I could come in',
    vow: 'unpacking. Properly. Boots away from the door and everything.' },
];

// role flavor: what they're doing when camp scenes find them
const ROLE_BITS = {
  tank:    { doing: 'oiling the straps of that battered shield by firelight', gift: 'the mended strap of your pack — fixed without being asked' },
  healer:  { doing: 'sorting dried herbs into neat paper twists', gift: 'a paper twist of tea "for the watch — it helps with the cold"' },
  caster:  { doing: 'tracing slow sigils in the air that glow and gutter', gift: 'a warmth-charm scratched onto a river stone' },
  striker: { doing: 'walking the perimeter for the third time this hour', gift: 'the perimeter, walked, and your bedroll moved out of the wind' },
  support: { doing: 'writing in a journal by ember-light', gift: 'a page torn from the journal: a sketch of the whole party, laughing' },
};

export function themeFor(text) {
  const t = text.toLowerCase();
  return THEMES.find(th => th.detect.test(t)) || THEMES[THEMES.length - 1];
}

// Register the four bond scenes for a forged hero into EVENTS.
function registerBondArc(def) {
  const id = def.id, name = def.name;
  const theme = themeFor(def.persona + ' ' + def.desc);
  const bits = ROLE_BITS[def.role] || ROLE_BITS.support;
  const inParty = S => (S.recruited || []).includes(id);

  EVENTS['cbond_' + id + '_1'] = {
    id: 'cbond_' + id + '_1', where: 'camp', once: true, priority: 45,
    cond: S => inParty(S),
    steps: [
      { s: 'narr', t: `Camp, after the clear. The newest member of the guild sits a careful half-step outside the fire's circle, ${bits.doing} — present, useful, and very deliberately not assuming a place.` },
      { s: id, t: `Oh — {name}. I didn't mean to be underfoot. I can take a farther watch, if the fire's crowded.` },
      { choice: [
        { t: `Move over and make the space obvious. "The fire seats everyone who fought for it. That's the whole rule."`, tone: 'kind', bond: { [id]: 1 },
          r: [
            { s: id, t: `(a pause; then they move — one half-step, into the light, like it costs something and pays more) ...Everyone who fought for it. I can work with that rule.` },
            { s: 'narr', t: `In the morning you find ${bits.gift}. Nobody saw it happen. That, apparently, is also part of their rule.` },
          ] },
        { t: `"You're mine now — guild, fire, watch and all. Sit where I can see you."`, tone: 'dom', bond: { [id]: 1 },
          r: [
            { s: id, t: `(the careful distance collapses all at once; they sit — close, watchful, oddly settled) Yours. Well. That answers the seating question with unusual efficiency, {name}.` },
            { s: 'narr', t: `They stay in the circle the whole night. In the morning you find ${bits.gift} — tribute, or thanks, or both.` },
          ] },
      ] },
    ],
  };

  EVENTS['cbond_' + id + '_2'] = {
    id: 'cbond_' + id + '_2', where: 'camp', once: true, priority: 45,
    cond: S => inParty(S) && (S.bond[id] || 0) >= 3,
    steps: [
      { s: 'narr', t: `Late watch. ${name} has stopped ${bits.doing} and is looking into the fire the way people look at things much farther away.` },
      { s: id, t: `Can I say a true thing, {name}? Since you keep collecting those. (a breath) The truth is, ${theme.crack}` },
      { s: 'narr', t: `The fire pops. They don't take it back.` },
      { choice: [
        { t: `Say nothing. Refill their cup and stay until the silence turns companionable.`, tone: 'kind', bond: { [id]: 1 },
          r: [{ s: id, t: `(much later, quietly, to the fire) ...You didn't flinch at it. I'm going to remember that longer than you'll know.` }] },
        { t: `"Noted. It changes nothing about where you sleep tonight — inside the circle, with us."`, tone: 'kind', bond: { [id]: 1 },
          r: [{ s: id, t: `(a rough, surprised laugh) Inside the circle. You make it sound like a standing order. ...Leave it standing.` }] },
      ] },
    ],
  };

  EVENTS['cbond_' + id + '_3'] = {
    id: 'cbond_' + id + '_3', where: 'camp', once: true, priority: 46,
    cond: S => inParty(S) && (S.bond[id] || 0) >= 6,
    steps: [
      { s: 'sys', t: `[ Resonance detected. Subject "${name}" carries an unresolved gate — not in the world. In the chest. The System recognizes the architecture; it has been inside one of these before. Recommend: accompany them through. ]` },
      { s: 'narr', t: `${name} is on their feet at the camp's edge, staring at nothing you can see — or at everything they carry. When they speak, it's steadier than you expected.` },
      { s: id, t: `You can see it too, can't you. Some kind of door, where my ribs should be. (a shaky laugh) I know what's behind it: ${theme.trialFace}. I've kept it shut a long time, {name}. I don't want to keep it shut in front of you.` },
      { s: 'narr', t: `They open it. What comes out isn't a monster — it never was. It's an hour of talking, and a voice that cracks twice, and the specific courage of being fully seen on purpose.` },
      { choice: [
        { t: `Stand with them the whole way through. When it's over: "The gate's cleared. It stays cleared."`, tone: 'kind', bond: { [id]: 2 },
          r: [
            { s: 'sys', t: `[ Trial complete. Subject's resonance: settled. The System has no metric for what just happened and has decided, after consideration, not to invent one. ]` },
            { s: id, t: `(hollowed out and lighter for it) Cleared. Stars. So that's what your party does. You walk into people's worst rooms and hold the light up. No wonder the gates lost.` },
          ] },
        { t: `"I've seen what's behind it now. It doesn't get to keep you — you're mine, and I keep what's mine whole."`, tone: 'dom', bond: { [id]: 2 },
          r: [
            { s: 'sys', t: `[ Trial complete. Claim registered. The System notes the subject did not object; the System further notes the subject's pulse, and declines to editorialize. ]` },
            { s: id, t: `(a long exhale, like setting down a pack carried for years) Kept whole. By you. ...The door doesn't frighten me half so much as how easily you said that. Do keep saying it.` },
          ] },
      ] },
    ],
  };

  EVENTS['cbond_' + id + '_4'] = {
    id: 'cbond_' + id + '_4', where: 'camp', once: true, priority: 46,
    cond: S => inParty(S) && (S.bond[id] || 0) >= 9,
    steps: [
      { s: 'narr', t: `The others have turned in. ${name} waits by the banked fire with the particular stillness of someone who has decided something and means to say it before the courage cools.` },
      { s: id, t: `{name}. Before the watch turns over — I owe the fire one more true thing. When I came to this guild I was ${theme.was}. (they hold your eyes, steady) I'm not, anymore. So tonight I'm ${theme.vow}` },
      { choice: [
        { t: `Meet them in the firelight, gently. "Then stay. You were always going to be kept."`, tone: 'kind', bond: { [id]: 1 },
          r: [
            { s: 'narr', t: `What follows is quiet and certain: the newest heart in the guild coming all the way inside the circle at last, and the fire burning lower and warmer than the wood should allow.`, spice: 'gentle' },
            { s: 'narr', t: `They close the distance first — unhurried, sure, four scenes' worth of wanting finally spent — and the banked fire watches two shadows become one shape and stay that way until the watch is long past due. Whoever was supposed to relieve it, wisely, does not.`, spice: 'steamy' },
            { s: id, t: `(afterward, against your shoulder, wonder plain in it) Kept. Present tense. I finally like the sound of a tense.` },
          ] },
        { t: `"Come here, then. You've been mine since the day the Forge read you out loud — time you heard me say it."`, tone: 'dom', bond: { [id]: 1 },
          r: [
            { s: 'narr', t: `They come — no half-step, no careful distance, nothing held back at the threshold — and the claiming is said and answered and sealed by the fire, thoroughly enough that the night keeps the rest.`, spice: 'gentle' },
            { s: 'narr', t: `They come to you like a door finally opened from the inside — yours, said against your mouth, worn like something fitted at last — and the fire burns to embers over the long, unhurried proof of it. When the ember-light finds them asleep against you, the careful half-step is gone for good.`, spice: 'steamy' },
            { s: id, t: `(drowsy, certain) Read out loud and kept. The Forge undersold you, {name}.` },
          ] },
        { t: `"Not tonight. But the circle's yours for good — that part's already true."`, tone: 'reject', reopen: true,
          r: [{ s: id, t: `(a breath; a small, unbothered smile) Already true. Then I'm patient — I've kept harder doors than this one. Goodnight, {name}.` }] },
      ] },
    ],
  };
}

function unregisterBondArc(id) {
  for (let i = 1; i <= 4; i++) delete EVENTS['cbond_' + id + '_' + i];
}

// Re-register everything in S.custom (called after any save load).
export function restoreCustomHeroes(S) {
  for (const def of Object.values(S.custom || {})) {
    registerCustomHero(def);
    if (S.bond && !(def.id in S.bond)) S.bond[def.id] = 0; // older forge saves
  }
}

// Forge, register, persist, and enroll in one step.
export function summonHero(parsed, S) {
  const def = forgeHero(parsed, S);
  if (!S.custom) S.custom = {};
  S.custom[def.id] = def;
  registerCustomHero(def);
  S.heroes[def.id] = { level: def.startLevel, xp: 0, gear: { weapon: null, armor: null, charm: null } };
  if (!S.recruited.includes(def.id)) S.recruited.push(def.id);
  if (!(def.id in S.bond)) S.bond[def.id] = 0; // hearts, from day one
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
  delete S.bond[id];
  S.recruited = S.recruited.filter(x => x !== id);
  delete HEROES[id];
  unregisterBondArc(id);
  return true;
}
