// ============================================================
// Larkspur Lane — the seasonal wardrobe. Each woman changes with the
// season (spring, summer, autumn, winter) and dresses up for each of the
// Wives' Circle's parties (May Day, the Cookout, Hallows, Yule). An entry
// overrides parts of her everyday look: colors merge, and top / skirt /
// legs / sleeves / extras / cape replace. Everyone stays dressed: this is
// the holiday wardrobe, not the lingerie drawer.
// ============================================================

export const WARDROBE = {
  victoria: {
    spring: { colors: { main: 0x8a84b8, deep: 0x5a5488, trim: 0xf0e8d8 }, extras: 'glasses,pearls,clipboard,flower:0xe8d8ff' },
    summer: { colors: { main: 0xf4f0e8, deep: 0xd8d0c4, trim: 0x2a3a5a }, top: { style: 'corset', cut: 1.06, corset: false }, sleeves: 'bare', skirt: { style: 'pleated', hem: 0.44 }, legs: { style: 'bare', boots: 0xd8c8a8, bootHeight: 0.12 }, extras: 'sunglasses,pearls' },
    autumn: { colors: { main: 0xb08a5a, deep: 0x7a5a3a, trim: 0x6a1a2a }, extras: 'glasses,pearls,clipboard,scarf:0x7a1a2a' },
    winter: { colors: { main: 0x3a3a44, deep: 0x24242c, trim: 0xd02a2a }, skirt: { style: 'long', hem: 0.3 }, extras: 'glasses,earmuffs:0xd02a2a,scarf:0xd02a2a' },
    may_day: { colors: { main: 0xc8b8e8, deep: 0x9a88c8, trim: 0xf4f0f8 }, top: { style: 'corset', cut: 1.05, corset: false }, sleeves: 'bare', skirt: { style: 'long', hem: 0.3 }, extras: 'flowercrown,pearls,clipboard' },
    cookout: { colors: { main: 0x2a4a7a, deep: 0x1a2a4a, trim: 0xf4f0e8 }, top: { style: 'corset', cut: 1.05, corset: false }, sleeves: 'bare', skirt: { style: 'pleated', hem: 0.46 }, legs: { style: 'bare', boots: 0xf4f0e8, bootHeight: 0.12 }, extras: 'sunglasses,pearls,clipboard' },
    hallows: { colors: { main: 0x5a0a1a, deep: 0x2a0410, trim: 0xd8b04a }, top: { style: 'corset', cut: 1.08 }, sleeves: 'long', skirt: { style: 'long', hem: 0.06 }, cape: 0x141018, extras: 'pearls,fangs,choker:0xd02a3a' },
    yule: { colors: { main: 0x2a6a3a, deep: 0x1a4a28, trim: 0xf4f0e8 }, top: { style: 'sweater', pattern: 'ledger' }, sleeves: 'long', skirt: { style: 'long', hem: 0.3, color: 0x1e2a44 }, extras: 'glasses,pearls,candycane' },
  },
  joanne: {
    spring: { colors: { main: 0xf0d878, deep: 0xc8a848, trim: 0xf4ecdc }, extras: 'apron,flower:0xff9ec6' },
    summer: { colors: { main: 0xd84a4a, deep: 0xa83030, trim: 0xf4f4f0 }, skirt: { style: 'pleated', hem: 0.46 }, extras: 'apron:0xf4f4f0,bottle' },
    autumn: { colors: { main: 0xb8582a, deep: 0x7a3a1a, trim: 0xe8c86a }, top: { style: 'coat', cut: 1.0, buttons: 4, corset: false }, sleeves: 'long', extras: 'apron,scarf:0xd8a83a' },
    winter: { colors: { main: 0x2a5a3a, deep: 0x1a3a28, trim: 0xf4ecdc }, top: { style: 'coat', cut: 1.0, buttons: 4, corset: false }, sleeves: 'long', skirt: { style: 'long', hem: 0.3 }, legs: { style: 'pants', color: 0x3a2a24, boots: 0x5a3a24, bootHeight: 0.4 }, extras: 'beanie:0xd02a2a,mug' },
    may_day: { colors: { main: 0xffb8c8, deep: 0xe88aa0, trim: 0xf4f4f0 }, extras: 'flowercrown,basket' },
    cookout: { colors: { main: 0xe85a5a, deep: 0xb83a3a, trim: 0xf4f4f0 }, skirt: { style: 'pleated', hem: 0.46 }, extras: 'apron:0xf4f4f0,ladle,sunglasses' },
    hallows: { colors: { main: 0xff6ab8, deep: 0xc83a8a, trim: 0x141018 }, top: { style: 'corset', cut: 1.12 }, skirt: { style: 'pleated', hem: 0.42, color: 0x141018 }, legs: { style: 'stockings', color: 0x141018, boots: 0x141018, bootHeight: 0.4 }, extras: 'plume:0xff6ab8,choker:0xff6ab8,fan:0x141018' },
    yule: { colors: { main: 0xc83a3a, deep: 0x8a2020, trim: 0x7a4a2a }, top: { style: 'sweater', pattern: 'reindeer' }, sleeves: 'long', skirt: { style: 'pleated', hem: 0.42, color: 0x2a5a3a }, extras: 'antlers,mug' },
  },
  diane: {
    spring: { colors: { main: 0xa8d890, deep: 0x7aa868, trim: 0xf4ecdc }, extras: 'sunhat,trowel,flower:0xffd0e0' },
    summer: { colors: { main: 0xf4d04a, deep: 0xc8a030, trim: 0xf4f0e8 }, top: { style: 'corset', cut: 1.0, corset: false }, sleeves: 'bare', skirt: { style: 'long', hem: 0.36 }, legs: { style: 'bare', boots: 0x8a6a4a, bootHeight: 0.12 }, extras: 'sunhat,trowel' },
    autumn: { colors: { main: 0xd8a83a, deep: 0x9a7a2a, trim: 0x5a3a2a }, extras: 'trowel,scarf:0x5a7a3a,leaves:0xc86a2a' },
    winter: { colors: { main: 0x5a7a5a, deep: 0x3a5a3a, trim: 0xf4ecdc }, extras: 'beanie:0xf4ecdc,scarf:0xd8b04a' },
    may_day: { colors: { main: 0xf4f0e8, deep: 0xd8d0c0, trim: 0x8ab87a }, top: { style: 'corset', cut: 1.0, corset: false }, sleeves: 'bare', skirt: { style: 'long', hem: 0.2 }, legs: { style: 'bare', boots: 0x8a6a4a, bootHeight: 0.1 }, extras: 'flowercrown,flower:0xffd0e0' },
    cookout: { colors: { main: 0x8ad8c8, deep: 0x5aa898, trim: 0xf4f0e8 }, top: { style: 'corset', cut: 1.0, corset: false }, sleeves: 'bare', skirt: { style: 'long', hem: 0.36 }, legs: { style: 'bare', boots: 0x8a6a4a, bootHeight: 0.1 }, extras: 'sunhat,flower:0xf4f0e8' },
    hallows: { colors: { main: 0x3a7a3a, deep: 0x22521f, trim: 0x8ac86a }, top: { style: 'corset', cut: 1.0, corset: false }, sleeves: 'bare', skirt: { style: 'tattered', hem: 0.3 }, legs: { style: 'bare', boots: 0x5a3a24, bootHeight: 0.1 }, extras: 'leaves:0x6aaa4a,flower:0xf4d04a' },
    yule: { colors: { main: 0x2a5a3a, deep: 0x1a3a24, trim: 0xf4f0e8 }, top: { style: 'sweater', pattern: 'tree' }, sleeves: 'long', extras: 'santahat,trowel' },
  },
  margot: {
    spring: { colors: { main: 0xffa8d8, deep: 0x1a1a1a, trim: 0xf4d04a }, extras: 'hoops,flower:0xf4d04a' },
    summer: { colors: { main: 0xff4aa8, deep: 0xf4f0e8, trim: 0xf4d04a }, skirt: { style: 'pleated', hem: 0.5, color: 0xf4f0e8 }, extras: 'hoops,sunglasses' },
    autumn: { colors: { main: 0xc83a7a, deep: 0x1a1a1a, trim: 0xf4d04a }, top: { style: 'coat', cut: 1.1, buttons: 3, corset: false }, sleeves: 'long', extras: 'hoops,scarf:0xff8ab8' },
    winter: { colors: { main: 0xf4f0f4, deep: 0xd8d0d8, trim: 0xff4aa8 }, top: { style: 'coat', cut: 1.1, buttons: 3, corset: false }, sleeves: 'long', skirt: { style: 'long', hem: 0.4, color: 0x1a1a1a }, legs: { style: 'stockings', color: 0x1a1a1a, boots: 0xff4aa8, bootHeight: 0.55 }, extras: 'hoops,earmuffs:0xff4aa8' },
    may_day: { colors: { main: 0xff8ac8, deep: 0xd85aa0, trim: 0xf4f4f0 }, skirt: { style: 'pleated', hem: 0.48, color: 0xffd0e8 }, extras: 'hoops,flowercrown' },
    cookout: { colors: { main: 0xff4aa8, deep: 0xf4d04a, trim: 0xf4f0e8 }, skirt: { style: 'pleated', hem: 0.5, color: 0xf4d04a }, extras: 'hoops,sunglasses,bottle' },
    hallows: { colors: { main: 0x1a1a1a, deep: 0x0a0a0a, trim: 0xf4f4ff }, skirt: { style: 'long', hem: 0.5, color: 0x1a1a1a }, legs: { style: 'stockings', color: 0x1a1a1a, boots: 0x1a1a1a, bootHeight: 0.55 }, extras: 'catears:0x1a1a1a,tail:0x1a1a1a,choker:0xf4f4ff,hoops' },
    yule: { colors: { main: 0xe8408a, deep: 0xb02a6a, trim: 0xf4f0f8 }, top: { style: 'sweater', pattern: 'sequin' }, sleeves: 'long', skirt: { style: 'long', hem: 0.5, color: 0x1a1a1a }, extras: 'hoops,santahat:0xff4aa8' },
  },
  moira: {
    spring: { colors: { main: 0x2a1a34, deep: 0x141018, trim: 0xc8b8e8 }, extras: 'streak,candle,flower:0x9a6ab8' },
    summer: { colors: { main: 0x141018, deep: 0x0a080c, trim: 0xb8b8c8 }, sleeves: 'bare', extras: 'streak,parasol,sunglasses' },
    autumn: { colors: { main: 0x2a1418, deep: 0x141018, trim: 0xd88a3a }, extras: 'streak,candle,scarf:0x5a2a4a' },
    winter: { colors: { main: 0x141018, deep: 0x0a080c, trim: 0xb8b8c8 }, top: { style: 'coat', cut: 1.0, buttons: 5, corset: false }, extras: 'streak,candle,scarf:0x8a8a9a' },
    may_day: { colors: { main: 0xf4f0f8, deep: 0xd8d0e0, trim: 0x9a6ab8 }, cape: 0xe8e0f0, extras: 'streak,flowercrown,candle' },
    cookout: { colors: { main: 0x141018, deep: 0x0a080c, trim: 0x8a4aff }, sleeves: 'bare', extras: 'streak,parasol' },
    hallows: { colors: { main: 0x141018, deep: 0x0a080c, trim: 0x8a4aff }, cape: 0x3a1a4a, extras: 'streak,witchhat:0x141018,candle' },
    yule: { colors: { main: 0x141018, deep: 0x2a1a34, trim: 0xd8d8e8 }, top: { style: 'sweater', pattern: 'snowflake' }, sleeves: 'long', extras: 'streak,candle' },
  },
  celeste: {
    spring: { colors: { main: 0xc8f0d8, deep: 0x98c8a8, trim: 0xd8b04a }, extras: 'sunglasses,bangles,ribbon:0x98c8a8' },
    summer: { colors: { main: 0xf6f2ea, deep: 0xd8d0c4, trim: 0xd8b04a }, skirt: { style: 'long', hem: 0.4 }, extras: 'sunglasses,bangles,sunhat' },
    autumn: { colors: { main: 0xe8d8c0, deep: 0xc8b090, trim: 0x8a4a2a }, top: { style: 'coat', cut: 1.05, buttons: 3, corset: false }, sleeves: 'long', skirt: { style: 'long', hem: 0.42 }, legs: { style: 'stockings', color: 0x3a2a24, boots: 0x5a3a24, bootHeight: 0.5 }, extras: 'sunglasses,scarf:0x8a4a2a' },
    winter: { colors: { main: 0xf6f2ea, deep: 0xd8d0c4, trim: 0xd02a2a }, top: { style: 'coat', cut: 1.05, buttons: 3, corset: false }, sleeves: 'long', skirt: { style: 'long', hem: 0.4 }, legs: { style: 'stockings', color: 0xf6f2ea, boots: 0xf6f2ea, bootHeight: 0.5 }, extras: 'beanie:0xd02a2a,scarf:0xd02a2a' },
    may_day: { colors: { main: 0xf6f2ea, deep: 0xe8d8e8, trim: 0xffb8d0 }, skirt: { style: 'long', hem: 0.36 }, extras: 'flowercrown,bangles' },
    cookout: { colors: { main: 0x8ac8f0, deep: 0x5a98c0, trim: 0xf6f2ea }, skirt: { style: 'pleated', hem: 0.5 }, extras: 'sunglasses,bangles,sunhat' },
    hallows: { colors: { main: 0x141018, deep: 0x0a080c, trim: 0xd8b04a }, skirt: { style: 'pleated', hem: 0.58, color: 0x141018 }, legs: { style: 'stockings', color: 0x141018, boots: 0x141018, bootHeight: 0.2 }, extras: 'swan,choker:0xd8b04a' },
    yule: { colors: { main: 0xd02a2a, deep: 0x8a1a1a, trim: 0xf6f2ea }, top: { style: 'sweater', pattern: 'snowflake' }, sleeves: 'long', skirt: { style: 'long', hem: 0.4, color: 0xf6f2ea }, extras: 'santahat,bangles' },
  },
};

// Which outfit a woman is wearing today: her festival look while the party's on, else the season's.
export const FEST_LOOK = { lane_may_day: 'may_day', lane_cookout: 'cookout', lane_hallows: 'hallows', lane_yule: 'yule' };
export function outfitKey(season) {
  return season.festOn ? FEST_LOOK[season.fest] : season.id;
}
// A look with a wardrobe entry laid over it.
export function dressed(toon, o) {
  if (!o) return toon;
  return { ...toon, ...o, colors: { ...toon.colors, ...(o.colors || {}) }, face: { ...toon.face, ...(o.face || {}) } };
}

// --- the lace drawer ---------------------------------------------------------------------
// Each woman's set for each party's after-party, in her colors for that holiday. Lace only
// ever builds on the mature figure (toonfig refuses it on anything else); it's shown on the
// stage only during a festival's intimate after-party, on Steamy and Unbound.
// [lace, motif, stockings, bodice?]
const LACE_SETS = {
  victoria: { may_day: [0xc8b8e8, 0xf4f0f8, 0xe8e0f4, true], cookout: [0xf4f0e8, 0x1e2a44, 0xf4f0e8, false], hallows: [0x5a0a1a, 0x141018, 0x141018, true], yule: [0x1e2a44, 0xd8c8a0, 0x141c30, true] },
  joanne: { may_day: [0xffb8c8, 0xf4f4f0, 0xf4e8ec, false], cookout: [0xe85a5a, 0xf4f4f0, 0xf4f0ec, false], hallows: [0xff6ab8, 0x141018, 0x141018, true], yule: [0x9a1a2a, 0xf4e8e0, 0x5a0a14, true] },
  diane: { may_day: [0xf4f0e8, 0x8ab87a, 0xf4f0e8, false], cookout: [0x8ad8c8, 0xf4f0e8, 0xe8f4f0, false], hallows: [0x3a7a3a, 0x8ac86a, 0x22521f, true], yule: [0x1e4a2a, 0xd8c87a, 0x14301c, false] },
  margot: { may_day: [0xff8ac8, 0xf4f4f0, 0xffd0e8, false], cookout: [0xf4d04a, 0xff4aa8, 0xfff0c8, false], hallows: [0x141018, 0xf4f4ff, 0x141018, true], yule: [0xe8408a, 0xf4f0f8, 0xb02a6a, true] },
  moira: { may_day: [0xf4f0f8, 0x9a6ab8, 0xf4f0f8, true], cookout: [0x141018, 0x8a4aff, 0x141018, false], hallows: [0x141018, 0x8a4aff, 0x141018, true], yule: [0x141018, 0xd8d8e8, 0x141018, true] },
  celeste: { may_day: [0xf6f2ea, 0xffb8d0, 0xf6f2ea, false], cookout: [0x8ac8f0, 0xf6f2ea, 0xe8f4fa, false], hallows: [0x141018, 0xd8b04a, 0x141018, true], yule: [0xd02a2a, 0xf6f2ea, 0x8a1a1a, false] },
};
// What each keeps on: her glasses, her pearls, her hoops...
const KEEP = { victoria: 'glasses,glasschain,pearls', joanne: 'temples', diane: 'flower:0xffd0e0', margot: 'hoops', moira: 'streak', celeste: 'bangles' };
for (const [id, sets] of Object.entries(LACE_SETS)) for (const [fest, [lace, motif, stock, bodice]] of Object.entries(sets)) {
  WARDROBE[id][fest + '_lace'] = {
    colors: { main: lace, deep: lace, trim: motif },
    top: { style: 'lace', bodice, cut: 1.05, corset: !!bodice },
    skirt: { style: 'brief' }, sleeves: 'bare', cape: null,
    legs: { style: 'stockings', color: stock, band: motif, boots: stock, bootHeight: 0.08 },
    extras: [KEEP[id], 'garters:' + '0x' + motif.toString(16).padStart(6, '0'), ...(id === 'joanne' && fest === 'yule' ? ['bow:0xf4e8e0'] : [])].filter(Boolean).join(','),
  };
}
