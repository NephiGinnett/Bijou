// ============================================================
// BINDING CODEX — toon looks for the rest of the cast
// The Dawnward Company, the Codex recruits, the reclaimed leaders,
// Calla and Mother Cinder, and every reclaimed captive (rolled from
// their name, in their old faction's colors). Each is a toonFigure
// spec whose `extras` names accessories in js/toonacc.js.
// ============================================================

const SKINS = [0xf6dcc4, 0xf0d0b0, 0xe8c8a0, 0xd8a880, 0xc08a68, 0x9a6a4a, 0x7a4a34];
const HAIRS = [0x1a1410, 0x3a2a1a, 0x6a3a1a, 0x8a5a3a, 0xb85a2a, 0xd8c8a8, 0x2a1a2a, 0xe8d8a0];
const EYES = [0x6a4a2a, 0x4a6a8a, 0x5a8a5a, 0x8a6ac8, 0x3a3a44, 0xa86a3a];

const L = {
  erin: {
    build: 'average', bust: 1.1,
    colors: { skin: 0xf6d8ba, hair: 0xf0cf6e, main: 0x4a7ac8, deep: 0x2f4f8f, trim: 0xd9b96a, metal: 0xc8d2dc, glove: 0x8a929c },
    face: { eye: 0x3a5a9a, brow: 0xb89a4a, blush: 0xf09a9a },
    top: { style: 'armor', collar: false, corset: false }, skirt: { style: 'pleated', hem: 0.56 },
    legs: { style: 'pants', color: 0x4a5a94, boots: 0x8a929c, bootHeight: 0.5, bootTrim: 0xd9b96a },
    sleeves: 'armor', hair: 'long', extras: 'scarf:0x3d6ec2,sword:0xe4ecf2,shield:0xc4ced8',
    formal: { colors: { main: 0x2f4f8f, deep: 0x1f3a6a, trim: 0xd9b96a, glove: 0xf6d8ba }, top: { style: 'corset', cut: 1.1 }, skirt: { style: 'long', hem: 0.05 }, sleeves: 'bare', legs: { style: 'pants', color: 0x2f4f8f, boots: 0x2f4f8f }, extras: 'scarf:0x6a9ae8,pearls' },
  },
  sakura: {
    build: 'curvy', bust: 1.2,
    colors: { skin: 0xf8ddc4, hair: 0xf5a8c8, main: 0xf4efe6, deep: 0xe0d8cc, trim: 0xd9b96a, glove: 0xf8ddc4 },
    face: { eye: 0x2c6e4f, brow: 0xd888a8, blush: 0xff9ab0 },
    top: { style: 'corset', cut: 1.08 }, skirt: { style: 'long', hem: 0.14 },
    legs: { style: 'stockings', color: 0xf4efe6, boots: 0x8a6a4a, bootHeight: 0.3 },
    sleeves: 'detached', hair: 'curly', extras: 'elf,witchhat:0xf4efe6,staff:0x66ff99',
    formal: { colors: { main: 0xfff0f5, deep: 0xf0d0e0 }, skirt: { style: 'long', hem: 0.04 }, sleeves: 'bare', extras: 'elf,flowercrown' },
  },
  shiro: {
    build: 'slim', bust: 1.05,
    colors: { skin: 0xf4ece6, hair: 0xf2f2f6, main: 0x1d1a26, deep: 0x15121e, trim: 0xf2f0ea, glove: 0xf2f0ea },
    face: { eye: 0x9a9ac8, brow: 0xd8d8e0, blush: 0xf0a8b8, mouth: 'flat' },
    top: { style: 'corset', cut: 1.06 }, skirt: { style: 'pleated', hem: 0.48 },
    legs: { style: 'stockings', color: 0xf2f0ea, boots: 0x15121e, bootHeight: 0.3, band: 0x15121e },
    sleeves: 'detached', hair: 'straight', extras: 'headdress:0xf2f0ea,book:0x2a1f3e',
    formal: { colors: { main: 0xf4f0fa, deep: 0xe0dce8, trim: 0xd9b96a, glove: 0xf4f0fa }, skirt: { style: 'long', hem: 0.05 }, legs: { style: 'pants', color: 0xf4f0fa, boots: 0xf4f0fa }, extras: 'headdress:0xd9b96a' },
  },
  yuki: { // before Yuki's request: an androgynous young swordsman's kit
    fem: false, build: 'slim',
    colors: { skin: 0xf6ddc0, hair: 0xf2e2a8, main: 0xa8d8b0, deep: 0x6a9a72, trim: 0x8a6d3a, glove: 0xf6ddc0 },
    face: { eye: 0x3a7a54, brow: 0xc8b070, blush: 0xf0a8a8, lashes: 0x5a4a2a },
    top: { style: 'coat', collar: false, corset: false, buttons: 3 }, skirt: { style: 'long', hem: 0.68, trim: false },
    legs: { style: 'pants', color: 0x6a7a6a, boots: 0x5a4632, bootHeight: 0.45 },
    sleeves: 'long', hair: 'short', extras: 'belt:0x8a6d3a,sword:0xd8dde2',
  },
  yuki_fem: {
    build: 'slim', bust: 1.0,
    colors: { skin: 0xf8e0cc, hair: 0xf2e2a8, main: 0xbfe6c6, deep: 0x8ac69a, trim: 0xd9b96a, glove: 0xf8e0cc },
    face: { eye: 0x3a7a54, brow: 0xc8b070, blush: 0xff9ab0 },
    top: { style: 'corset', cut: 1.06 }, skirt: { style: 'pleated', hem: 0.5 },
    legs: { style: 'stockings', color: 0xeef6ef, boots: 0x6a5a3a, bootHeight: 0.3 },
    sleeves: 'detached', hair: 'long', extras: 'ribbon:0xff9ec6,sword:0xe8eef4',
    formal: { colors: { main: 0xeef6ef, deep: 0xbfe6c6 }, skirt: { style: 'long', hem: 0.05 }, sleeves: 'bare', extras: 'ribbon:0xff9ec6,pearls' },
  },
  mira: {
    build: 'broad', bust: 1.1,
    colors: { skin: 0xe2b990, hair: 0x6e3a2a, main: 0x5a4632, deep: 0x3a2e22, trim: 0xc8a050, metal: 0x8a8f96, glove: 0x5a4632 },
    face: { eye: 0x4a3624, brow: 0x4a2a1a, blush: 0xe08a7a, mouth: 'smirk', fang: false },
    top: { style: 'armor', collar: false, corset: false }, skirt: { style: 'tasset', hem: 0.62, color: 0x8a8f96 },
    legs: { style: 'pants', color: 0x3a3630, boots: 0x3a2e22, bootHeight: 0.5 },
    sleeves: 'bare', hair: 'short', extras: 'belt,pauldron:0x9aa2ac,scar,sword:0xc8ccd2',
  },
  nessa: {
    build: 'curvy', bust: 1.15,
    colors: { skin: 0xf6dcc0, hair: 0x8a5a34, main: 0x7a9a58, deep: 0x5a7a3a, trim: 0xe8e2c8, glove: 0xf6dcc0 },
    face: { eye: 0x6a4a2a, brow: 0x6a4a2a, blush: 0xf09a8a, freckles: true },
    top: { style: 'corset', cut: 1.05 }, skirt: { style: 'long', hem: 0.22 },
    legs: { style: 'stockings', color: 0x5a4a3a, boots: 0x6a4a2a, bootHeight: 0.35 },
    sleeves: 'detached', hair: 'curly', extras: 'satchel:0x8a6d3a,flower:0xffd0e0',
  },
  vex: { // the Hollow One: person-shaped dark, with edges that don't commit
    build: 'slim', bust: 1.0,
    colors: { skin: 0x2a2440, hair: 0x15121e, main: 0x241f38, deep: 0x16121f, trim: 0xb08cff, glove: 0x2a2440 },
    face: { eye: 0xb08cff, brow: 0x0e0a14, blush: 0x6a4a9a, lip: 0x8a6ad8, lashes: 0x0a080c },
    top: { style: 'corset', cut: 1.02, corset: false }, skirt: { style: 'tattered', hem: 0.5 },
    legs: { style: 'bare', boots: 0x16121f, bootHeight: 0.3 },
    sleeves: 'bare', hair: 'straight', extras: 'wisps,shadowhem', float: true,
  },
  seris: {
    build: 'slim', bust: 1.05, figure: 'tall',
    colors: { skin: 0xeed6c8, hair: 0x3a2a4a, main: 0x2a2438, deep: 0x1a1626, trim: 0x8a6ad8, glove: 0x2a2438 },
    face: { eye: 0xb08cff, brow: 0x2a1a3a, blush: 0xe0a0b0, mouth: 'flat' },
    top: { style: 'coat', cut: 1.08, keyhole: true, buttons: 3 }, skirt: { style: 'long', hem: 0.08 },
    legs: { style: 'pants', color: 0x1a1626, boots: 0x1a1626 },
    sleeves: 'long', hair: 'straight', extras: 'glasses,collarglow:0x8a6ad8,book:0x2a1f3e,staff:0xb06cff',
  },
  aldric: {
    fem: false, build: 'broad',
    colors: { skin: 0xe4ccb8, hair: 0xc8c4bc, main: 0xe8e4d8, deep: 0xb8bcc8, trim: 0xc8a050, metal: 0xb8bcc8, glove: 0x8a8e98 },
    face: { eye: 0x3a3a44, brow: 0xa8a49c, blush: 0xe0a090, mouth: 'flat', lashes: 0x5a5a5a },
    top: { style: 'armor', collar: false, corset: false }, skirt: { style: 'tasset', hem: 0.6, color: 0xb8bcc8 },
    legs: { style: 'pants', color: 0x5a5e68, boots: 0x8a8e98, bootHeight: 0.5, bootTrim: 0xc8a050 },
    sleeves: 'armor', hair: 'short', cape: 0xe8e4d8, extras: 'beard,sword:0xdde4ea,shield:0xe8e4d8',
  },
  proprietor: { // they/them: velvet, gold, horns, far too many teeth
    fem: false, build: 'slim',
    colors: { skin: 0x8a3a5a, hair: 0x1a0a0a, main: 0x1a0a14, deep: 0x3a1428, trim: 0xd8b04a, glove: 0x1a0a14 },
    face: { eye: 0xd8b04a, brow: 0x1a0a0a, blush: 0xb85a7a, lip: 0x3a0a1a, mouth: 'smirk', slit: true, lashes: 0x0a0408 },
    top: { style: 'coat', collar: true, corset: false, buttons: 4 }, skirt: { style: 'long', hem: 0.3, trim: true },
    legs: { style: 'pants', color: 0x1a0a14, boots: 0x0a0408, bootHeight: 0.4 },
    sleeves: 'long', hair: 'short', extras: 'horns:0x1a0a0a,crowncirclet:0xd8b04a,tail:0x5a1a3a,fan:0xd8b04a',
  },
  hale: {
    fem: false, build: 'broad',
    colors: { skin: 0xd8b494, hair: 0x9a9a9a, main: 0x5a4a32, deep: 0x3a3020, trim: 0x8ab85a, glove: 0x4a3a28 },
    face: { eye: 0x3a3020, brow: 0x7a7a7a, blush: 0xd09080, mouth: 'flat', lashes: 0x4a4a4a },
    top: { style: 'coat', collar: false, corset: false, buttons: 3 }, skirt: { style: 'long', hem: 0.5, color: 0x2a3a1a, trim: false },
    legs: { style: 'pants', color: 0x3a3020, boots: 0x2a2018, bootHeight: 0.55 },
    sleeves: 'long', hair: 'short', cape: 0x2a3a1a, extras: 'beard,belt,sword:0xb8bcc4',
  },
  calla: {
    build: 'curvy', bust: 1.15,
    colors: { skin: 0xe8ccb4, hair: 0x3a2a24, main: 0x5a3a3a, deep: 0x3a2424, trim: 0xe8a87a, glove: 0xe8ccb4 },
    face: { eye: 0x8a5a3a, brow: 0x2a1a14, blush: 0xf09a8a },
    top: { style: 'corset', cut: 1.08 }, skirt: { style: 'long', hem: 0.18 },
    legs: { style: 'stockings', color: 0x3a2424, boots: 0x2a1a14, bootHeight: 0.35 },
    sleeves: 'detached', hair: 'long', extras: 'scarf:0xe8a87a',
  },
  cinder: {
    build: 'curvy', bust: 1.15, figure: 'tall',
    colors: { skin: 0xe8ccb4, hair: 0xd8d0c8, main: 0x1a0c0a, deep: 0x3a1a14, trim: 0xff7a4a, glove: 0x1a0c0a },
    face: { eye: 0xd8a06a, brow: 0xb8b0a8, blush: 0xd89080, mouth: 'flat' },
    top: { style: 'corset', cut: 1.1 }, skirt: { style: 'long', hem: 0.04 },
    legs: { style: 'pants', color: 0x1a0c0a, boots: 0x1a0c0a },
    sleeves: 'long', hair: 'long', cape: 0x3a1a14, extras: 'crowncirclet:0xff7a4a',
  },
};

// Look up a cast look, applying a 'formal' variant patch when the character has one.
export function castLook(id, variant) {
  let key = id;
  if (id === 'yuki' && variant && variant.startsWith('fem')) key = 'yuki_fem';
  const base = L[key];
  if (!base) return null;
  const { formal, ...spec } = base;
  const wantFormal = variant === 'formal' || variant === 'fem_formal';
  if (!wantFormal || !formal) return spec;
  return { ...spec, ...formal, colors: { ...spec.colors, ...(formal.colors || {}) } };
}
export const CAST_IDS = ['erin', 'sakura', 'shiro', 'yuki', 'mira', 'nessa', 'vex', 'seris', 'aldric', 'proprietor', 'hale', 'calla', 'cinder'];

// Reclaimed captives: rolled from their id so they never change, dressed in
// their old faction's colors, now wearing the Codex's violet as an accent.
const FACTION_KIT = {
  coven:   { main: 0x2a2234, deep: 0x1a1424, trim: 0xb06cff, top: { style: 'corset', cut: 1.06 }, skirt: { style: 'long', hem: 0.2 }, sleeves: 'detached', extras: ['staff:0xb06cff', 'book:0x2a1f3e', 'scarf:0xe8a87a'] },
  vigil:   { main: 0x4a4a54, deep: 0x2a2a34, trim: 0xb06cff, metal: 0x8a8e98, top: { style: 'armor', collar: false, corset: false }, skirt: { style: 'tasset', hem: 0.6 }, sleeves: 'armor', extras: ['sword:0xdde4ea', 'shield:0x4a4a54', 'sword:0xdde4ea,shield:0x2a2a34'] },
  college: { main: 0x14121a, deep: 0x0e0c12, trim: 0xd8b04a, top: { style: 'coat', cut: 1.06, keyhole: true, buttons: 3 }, skirt: { style: 'long', hem: 0.1 }, sleeves: 'long', extras: ['book:0x14121a', 'staff:0xd8b04a', 'glasses,book:0x14121a'] },
  lodge:   { main: 0x5a4a32, deep: 0x3a3020, trim: 0x8ab85a, top: { style: 'corset', cut: 1.02, corset: false }, skirt: { style: 'tattered', hem: 0.6, color: 0x3a5a2a }, sleeves: 'bare', extras: ['sword:0xb8bcc4', 'belt,sword:0xb8bcc4', 'satchel:0x5a4a32'] },
  market:  { main: 0x5a1a3a, deep: 0x3a0a24, trim: 0xd8a04a, top: { style: 'corset', cut: 1.12, corset: false }, skirt: { style: 'long', hem: 0.4 }, sleeves: 'bare', extras: ['fan:0xd8a04a', 'hoops,bangles', 'horns:0x1a0a0a,tail:0x5a1a3a'] },
};
function seeded(str) { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } let a = h >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
export function convertLook(id, faction) {
  const r = seeded(id), pick = a => a[Math.floor(r() * a.length)];
  const K = FACTION_KIT[faction] || FACTION_KIT.coven;
  const skin = pick(SKINS), hair = pick(HAIRS);
  return {
    build: pick(['slim', 'average', 'curvy', 'curvy', 'broad']), bust: 0.95 + r() * 0.35,
    colors: { skin, hair, main: K.main, deep: K.deep, trim: K.trim, metal: K.metal, glove: K.sleeves === 'bare' ? skin : K.deep },
    face: { eye: pick(EYES), brow: hair, blush: 0xf09a8a },
    top: K.top, skirt: K.skirt, sleeves: K.sleeves,
    legs: { style: pick(['stockings', 'pants', 'stockings']), color: K.deep, boots: 0x2a1e18, bootHeight: 0.35 },
    hair: pick(['long', 'straight', 'curly', 'short', 'long']), extras: pick(K.extras),
  };
}
