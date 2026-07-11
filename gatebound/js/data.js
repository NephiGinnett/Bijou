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
    stages: [
      { cond: S => S.cleared, desc: 'The one who walked out of the Monarch\'s Threshold and closed the door behind them. The F-rank formality is a guild-hall legend now; the System keeps measuring, and the ceiling still hasn\'t come.' },
      { cond: S => S.rankIdx >= 4, desc: 'A-rank, and nobody remembers laughing. The escorted baggage now walks point, and examiners quietly rewrite what the ranking scale is for. The System hums, unfinished.' },
      { cond: S => S.rankIdx >= 2, desc: 'The F-rank license is a formality the guild is increasingly embarrassed by. Gate by gate, the System makes good on its promise: measurably, impossibly stronger.' },
    ],
    startLevel: 1,
    base:   { hp: 105, mp: 32, atk: 15, mag: 10, def: 11, res: 9, agi: 12, luk: 10 },
    growth: { hp: 15,  mp: 4,  atk: 3.3, mag: 2.2, def: 2.5, res: 2.2, agi: 1.9, luk: 1.2 },
    skills: { 1: 'twin_fangs', 4: 'shadow_rush', 7: 'execute', 10: 'limit_break', 16: 'monarchs_edge', 22: 'phantom_step', 30: 'system_purge', 42: 'sovereign' },
    passive: { id: 'system', name: 'The System', desc: 'Levels grant outsized growth. Gains +10% XP.' },
    role: 'striker',
  },
  erin: {
    id: 'erin',
    name: 'Erin',
    epithet: 'the Golden Knight',
    cls: 'Knight',
    desc: 'The party\'s unbreakable wall. Warm, honest to a fault, first through every door and first onto every trap. Protects Sakura like breathing.',
    stages: [
      { cond: S => S.seen && S.seen.wedding && (S.flags.harem_formed || (S.bond.erin || 0) >= 10), desc: 'The party\'s unbreakable wall — and your wife, a word she still grins at like a trophy. First through every door, first onto every trap, first to say it out loud. The ring goes under the gauntlet; she checked the regulations.' },
      { cond: S => (S.bond.erin || 0) >= 7, desc: 'The party\'s unbreakable wall, warm and honest to a fault — and lately very bad at pretending she isn\'t watching you across the campfire. Protects the whole party like breathing. Breathes easier when you\'re behind her.' },
      { cond: S => S.cleared, desc: 'The wall that held at the Monarch\'s Threshold. Warm, honest to a fault, first through every door — including that one. The guild\'s young shields copy her stance now. She pretends not to notice, badly.' },
    ],
    startLevel: 14,
    base:   { hp: 150, mp: 22, atk: 13, mag: 4, def: 15, res: 10, agi: 8, luk: 6 },
    growth: { hp: 11,  mp: 2,  atk: 2.0, mag: 0.8, def: 2.0, res: 1.5, agi: 1.0, luk: 0.8 },
    skills: { 1: 'shield_bash', 2: 'rallying_taunt', 5: 'aegis', 18: 'valkyrie_dance', 22: 'guardian_wall', 30: 'riposte' },
    passive: { id: 'cover', name: 'Shieldmaiden', desc: 'Once per round, intercepts a hit aimed at an ally below 30% HP.' },
    role: 'tank',
  },
  sakura: {
    id: 'sakura',
    name: 'Sakura',
    epithet: 'the Petal Storm',
    cls: 'Mage',
    desc: 'A timid elf who apologizes to doors she bumps into — and the most dangerous arcane talent of her graduating class. Braver when Erin is standing.',
    stages: [
      { cond: S => S.seen && S.seen.wedding && (S.flags.harem_formed || (S.bond.sakura || 0) >= 10), desc: 'The most dangerous arcane talent of her generation, and your wife — she wrote you a better ending than any of her novels and co-signed it at the altar. Still apologizes to doors. The doors, at this point, should apologize to her.' },
      { cond: S => (S.bond.sakura || 0) >= 7, desc: 'The most dangerous arcane talent of her class, who has stopped rehearsing being brave and started simply being it — especially, noticeably, whenever you\'re watching. Still apologizes to doors. Blushes at the tips of her ears when caught.' },
      { cond: S => S.cleared, desc: 'The sky over the Monarch\'s Threshold answered to her. The timid elf who apologized to doors now gets saluted by examiners — she apologizes for that, too. Braver than anyone the guild has ever licensed.' },
    ],
    startLevel: 14,
    base:   { hp: 82, mp: 62, atk: 5, mag: 19, def: 6, res: 13, agi: 9, luk: 9 },
    growth: { hp: 7,  mp: 6,  atk: 0.6, mag: 2.7, def: 1.0, res: 1.9, agi: 1.1, luk: 1.0 },
    skills: { 1: 'firebloom', 2: 'prism_lance', 16: 'starfall', 22: 'nova_lance', 30: 'cinderfall' },
    passive: { id: 'timid_prodigy', name: 'Timid Prodigy', desc: '+20% MAG while Erin stands. −10% if Erin falls.' },
    role: 'caster',
  },
  shiro: {
    id: 'shiro',
    name: 'Shiro',
    epithet: 'the White Queen',
    cls: 'Tactician',
    desc: 'Reads a battlefield like a chessboard and most people like an open, boring book. Speaks rarely. Heals precisely. Keeps a ledger of everything.',
    stages: [
      { cond: S => S.seen && S.seen.wedding && (S.flags.harem_formed || (S.bond.shiro || 0) >= 10), desc: 'Reads a battlefield like a chessboard, and married you anyway — the one calculation she triple-checked and kept. Unpledged, unpriced, and spending her own time exactly as she chooses. The ledger has a page nobody else may read. It is about you.' },
      { cond: S => (S.bond.shiro || 0) >= 7, desc: 'Reads a battlefield like a chessboard and most people like an open, boring book — but keeps rereading you, which the ledger classifies, tersely, as "anomalous." Speaks rarely. Says your name with unusual precision.' },
      { cond: S => S.cleared, desc: 'The mind that plotted the Monarch\'s fall four moves ahead. Reads battlefields like chessboards; read the Threshold like an endgame. The ledger of everything now includes one entry she never priced: what the party is worth.' },
    ],
    startLevel: 14,
    base:   { hp: 94, mp: 56, atk: 6, mag: 15, def: 8, res: 15, agi: 10, luk: 8 },
    growth: { hp: 8,  mp: 5,  atk: 0.7, mag: 2.1, def: 1.2, res: 2.0, agi: 1.3, luk: 1.0 },
    skills: { 1: 'mend', 2: 'frost_sigil', 6: 'checkmate', 18: 'zugzwang', 20: 'sanctuary', 28: 'stasis' },
    passive: { id: 'grand_design', name: 'Grand Design', desc: 'At the start of each round, marks the weakest enemy: it takes +15% damage.' },
    role: 'healer',
  },
  yuki: {
    id: 'yuki',
    name: 'Yuki',
    epithet: 'the Earnest',
    cls: 'Adventurer (D)',
    desc: 'Kind, sheltered, and trying so hard it hurts to watch. The man three A-ranks are pledged to marry — currently learning which end of the sword to hold.',
    stages: [
      { cond: S => S.flags.yuki_femme && S.seen && S.seen.wedding && (S.flags.harem_formed || (S.bond.yuki || 0) >= 10), epithet: 'the Fifth Heart', cls: 'Adventurer', desc: 'Long hair, green gown, a ring she keeps finding excuses to look at: Yuki — your wife, the harem\'s fifth heart, entirely and finally herself. The System reclassified more than her silhouette; she reclassified everything else on her own.' },
      { cond: S => S.flags.yuki_femme, epithet: 'the Fifth Heart', cls: 'Adventurer', desc: 'Long hair, green gown, second-watch partner: Yuki, exactly where she spent four years trying to reach — the middle of the fire. The System reclassified more than her silhouette. The rest she claimed for herself: a voice, a name she keeps, a life that fits.' },
      { cond: S => S.flags.yuki_member, epithet: 'the Earnest', cls: 'Adventurer', desc: 'No longer waiting to be waited for: Yuki runs every gate with the party now, softening by the day into someone who finally fits. The guild has stopped being surprised by the fifth chair. The trying-so-hard stopped hurting to watch and started working.' },
      { cond: S => S.flags.betrothal_ended, cls: 'Adventurer (B)', desc: 'Yuki Beaumont, B-rank, leading a party of his own — steady, certain, un-discourageable. The betrothal ended; the friendship didn\'t. His letters arrive on time, every week, to all four of you.' },
    ],
    startLevel: 7,
    base:   { hp: 88, mp: 26, atk: 10, mag: 6, def: 9, res: 8, agi: 8, luk: 12 },
    growth: { hp: 8,  mp: 2,  atk: 1.4, mag: 0.8, def: 1.2, res: 1.0, agi: 0.9, luk: 1.5 },
    skills: { 1: 'desperate_swing', 2: 'encourage', 10: 'resolve_strike', 16: 'covering_vow', 26: 'radiant_poise' },
    passive: { id: 'lucky_lamb', name: 'Lucky Lamb', desc: 'Somehow survives. +15% chance attacks against him miss.', dodge: 0.15 },
    role: 'support',
  },

  // ---- Post-Monarch recruits (adapted from the Warlock's Codex) ----
  // recruit: true keeps them out of the roster until formally signed.
  // arrive: { day: N days after the clear } or { ngPlus: N } gates the offer.

  mira: {
    id: 'mira', recruit: true, arrive: { day: 0 },
    name: 'Mira', epithet: 'the Bold', cls: 'Mercenary',
    desc: 'Mira Ashvale, twenty-nine, sellsword. Broad shoulders, honest scars, a contract rate she quotes without blinking. She walked in the day after the Threshold closed and asked who she talks to about steady work with people worth bleeding for.',
    stages: [
      { cond: S => (S.recruited || []).includes('mira'), desc: 'Mira Ashvale, formerly of everywhere, permanently of here. The contract said "guild family, in perpetuity" and she signed it — the first deal in twenty years she\'d call underpriced. Holds the door, holds the watch, threatens anyone who hugs her, hugs back.' },
    ],
    persona: 'A veteran mercenary: wry, professional, unimpressed by titles and very impressed by competence. Fights for coin, stays for people, and would die before admitting she has a soft spot for green recruits. Talks like someone who has already survived the worst job offer in the room.',
    startLevel: 30,
    base:   { hp: 145, mp: 24, atk: 15, mag: 4, def: 13, res: 9, agi: 10, luk: 8 },
    growth: { hp: 11,  mp: 2,  atk: 2.2, mag: 0.7, def: 1.8, res: 1.4, agi: 1.1, luk: 0.9 },
    skills: { 1: 'sunder_strike', 2: 'war_banner', 6: 'stand_fast', 14: 'crushing_blow', 24: 'rampart_cleave' },
    passive: { id: 'paid_in_full', name: 'Paid in Full', desc: 'A professional\'s eye for spoils: +25% gold from battles she fights in.', goldMult: 0.25 },
    role: 'tank',
  },
  nessa: {
    id: 'nessa', recruit: true, arrive: { day: 2 },
    name: 'Nessa', epithet: 'the Hedgewitch', cls: 'Herbalist',
    desc: 'Nessa Vale kept a market stall and made house calls for families no guild physician would see. After the Threshold, the wounded she patched up kept saying one party\'s name. She arrived with a basket of tinctures and a petition to join, rehearsed forty times.',
    stages: [
      { cond: S => (S.recruited || []).includes('nessa'), desc: 'The guild\'s hedgewitch, who reorganized the infirmary on day one and everyone\'s health on every day since. Still undercharges the town; now bills the guild instead, which Shiro approves of on principle. The rehearsed petition is framed above her workbench. She earned every word.' },
    ],
    persona: 'A shy, sweet herbalist who apologizes when other people bump into her — and goes absolutely steel-spined the moment a patient is in danger. Speaks softly, knows every plant that heals and every one that very much does not, and is trying to be brave about being around famous adventurers.',
    startLevel: 30,
    base:   { hp: 100, mp: 58, atk: 7, mag: 14, def: 8, res: 12, agi: 9, luk: 11 },
    growth: { hp: 8,   mp: 5,  atk: 0.8, mag: 2.0, def: 1.2, res: 1.8, agi: 1.0, luk: 1.2 },
    skills: { 1: 'salve', 2: 'nettle_flask', 6: 'soothing_word', 14: 'tonic_mist', 24: 'panacea' },
    passive: { id: 'field_remedies', name: 'Field Remedies', desc: 'Each round she quietly tends the most wounded ally, restoring a little HP.', roundHeal: 0.04 },
    role: 'healer',
  },
  vex: {
    id: 'vex', recruit: true, arrive: { day: 4 },
    name: 'Vex', epithet: 'the Hollow One', cls: 'Shade',
    desc: 'A shadow-entity that lived in the sealed dark below the gates — until the Monarch\'s fall cracked its ceiling open. It surfaced, watched the guild for three days, and then filled out a membership form in perfect, unsettling calligraphy. The guild is still deciding how it feels.',
    stages: [
      { cond: S => (S.recruited || []).includes('vex'), desc: 'The guild\'s resident dark, accepted-into and increasingly fluent in personhood: it holds doors (with tendrils, courteously), has opinions about soup, and produces the laugh sound on purpose now. Holds everyone\'s dark places so no one stands in them alone. The guild decided how it feels: fondly.' },
    ],
    persona: 'A genderless shadow-creature learning personhood in real time: odd cadence, unfailing literal honesty, deep curiosity about warmth, food, and why people laugh. Ancient, lonely, and quietly delighted every time someone treats it as a “who” instead of a “what.”',
    startLevel: 30,
    base:   { hp: 95, mp: 40, atk: 17, mag: 10, def: 8, res: 10, agi: 16, luk: 10 },
    growth: { hp: 8,  mp: 3,  atk: 2.4, mag: 1.3, def: 1.1, res: 1.4, agi: 1.8, luk: 1.1 },
    skills: { 1: 'shadow_talon', 2: 'through_the_veil', 6: 'hollow_embrace', 14: 'null_shriek', 24: 'unmaking' },
    passive: { id: 'hollow_step', name: 'Hollow Step', desc: 'Half here, half elsewhere: +15% chance attacks against it miss.', dodge: 0.15 },
    role: 'striker',
  },
  seris: {
    id: 'seris', recruit: true, arrive: { ngPlus: 1 },
    name: 'Seris', epithet: 'the College\'s Instrument', cls: 'Shadow Warlock',
    desc: 'Seris Val, the Arcane College\'s most trusted instrument, dispatched to observe, contain, and if necessary dismantle the anomaly calling itself the System. She has read every report on your growth rate. She does not believe them. She is here to be wrong in person.',
    stages: [
      { cond: S => (S.recruited || []).includes('seris'), desc: 'The College\'s embedded observer, whose reports on the anomaly grow steadily longer, warmer, and less submitted. Keeps meticulous records of what you are becoming; has quietly become part of the data. "Purely professional proximity," she notes, in the margin, in her own hand, again.' },
    ],
    persona: 'A precise, dangerous College agent sent to investigate the player\'s impossible growth — rival first, ally slowly. Dry wit sharpened to a scalpel, allergic to being impressed, keeps meticulous notes she pretends are for her superiors. The word "anomaly" is doing a lot of emotional work for her.',
    startLevel: 34,
    base:   { hp: 90, mp: 60, atk: 6, mag: 18, def: 7, res: 14, agi: 11, luk: 9 },
    growth: { hp: 7,  mp: 5,  atk: 0.7, mag: 2.5, def: 1.1, res: 1.9, agi: 1.2, luk: 1.0 },
    skills: { 1: 'shadow_lash', 2: 'gloom_brand', 6: 'umbral_coil', 14: 'eclipse', 24: 'midnight_rite' },
    passive: { id: 'hexweaver', name: 'Hexweaver', desc: 'Her hexes do not miss: status effects she applies always land.', sureHex: true },
    role: 'caster',
  },

  // ---- Rescue recruits ----
  // Members of rival parties who get stranded in distress gates.
  // arrive: { rescued: true } — they only become recruitable after
  // you pull them out of a gate their own party couldn't clear.

  garrick: {
    id: 'garrick', recruit: true, arrive: { rescued: true }, rescueParty: 'Ironvale Company',
    name: 'Garrick', epithet: 'the Unmoved', cls: 'Greatshield',
    desc: 'Ironvale Company\'s anchor: a wall of scarred steel who held a collapsing chamber alone so the rest of his party could reach the barricade. His contract says he guards Ironvale. His eyes, ever since the rescue, keep doing arithmetic about yours.',
    stages: [
      { cond: S => (S.recruited || []).includes('garrick'), desc: 'Formerly Ironvale\'s anchor, now yours: the wall that got rescued once and decided the debt was a door worth holding forever. Nine years of contract work, retired in an afternoon. Loses the standing-still game to Erin on purpose, sometimes, when morale needs it.' },
    ],
    persona: 'A veteran greatshield of few words and immovable calm — the kind of man who answers panic with "stand behind me" and considers that a full sentence. Recently rescued by the player\'s party from a gate his own company couldn\'t clear; he is quietly re-evaluating what a shield is for, and whom.',
    startLevel: 28,
    base:   { hp: 155, mp: 20, atk: 13, mag: 3, def: 16, res: 10, agi: 7, luk: 7 },
    growth: { hp: 12,  mp: 2,  atk: 1.9, mag: 0.5, def: 2.1, res: 1.5, agi: 0.8, luk: 0.8 },
    skills: { 1: 'shield_bash', 2: 'stand_fast', 8: 'guardian_wall', 18: 'riposte', 26: 'rampart_cleave' },
    passive: { id: 'unmoved', name: 'The Unmoved', desc: 'Takes 10% less damage. The wall does not discuss it.', dr: 0.1 },
    role: 'tank',
  },
  liria: {
    id: 'liria', recruit: true, arrive: { rescued: true }, rescueParty: 'the Gilded Compass',
    name: 'Liria', epithet: 'the Compass Needle', cls: 'Duelist',
    desc: 'The Gilded Compass\'s pathfinder and point-blade, fast enough that her party\'s motto is "follow the flash." She got them nine rooms deep before the gate turned wrong, and she does not forgive herself for room ten. She counts your party\'s footwork the way other people count money.',
    stages: [
      { cond: S => (S.recruited || []).includes('liria'), desc: 'The fastest thing in three provinces, training where the ceiling is — your back line. Maintains the guild leaderboard on the pillar and her own ranking grudge with equal devotion. Room ten got a name in her maps now: "the one they walked." She\'s working back toward it.' },
    ],
    persona: 'A quicksilver duelist: cocky on the surface, precise underneath, allergic to standing still. Recently rescued by the player\'s party from a gate her own crew couldn\'t finish — being saved by someone faster is the single most interesting thing that has ever happened to her, and she keeps picking fights about it in a way that is obviously a courtship of rivals.',
    startLevel: 28,
    base:   { hp: 92, mp: 36, atk: 16, mag: 8, def: 8, res: 9, agi: 17, luk: 12 },
    growth: { hp: 8,  mp: 3,  atk: 2.2, mag: 1.0, def: 1.0, res: 1.2, agi: 1.9, luk: 1.3 },
    skills: { 1: 'twin_fangs', 4: 'shadow_rush', 12: 'phantom_step', 22: 'execute' },
    passive: { id: 'point_perfect', name: 'Point Perfect', desc: 'Every strike aimed at a seam: +10% critical chance.', crit: 0.1 },
    role: 'striker',
  },
  tobbin: {
    id: 'tobbin', recruit: true, arrive: { rescued: true }, rescueParty: 'Lantern & Ledger',
    name: 'Tobbin', epithet: 'the Ledger-Lantern', cls: 'Chronicler',
    desc: 'Lantern & Ledger\'s field chronicler and medic, who kept four wounded people alive behind a barricade for days on tea, sutures, and aggressively optimistic bookkeeping. His account of the rescue runs eleven pages and undersells only his own part in it.',
    stages: [
      { cond: S => (S.recruited || []).includes('tobbin'), desc: 'The guild\'s chronicler-medic, author of "The Fourth\'s Table" (Book One of a budgeted six), who closes wounds mid-stanza and considers both jobs the same job: keeping the record straight about who saved whom. His grandmother\'s lantern hangs over the infirmary door.' },
    ],
    persona: 'A warm, fussy chronicler-medic who narrates everything into a field journal and heals people mid-sentence. Recently rescued by the player\'s party from a gate his own company couldn\'t clear; he has already written the ballad about it and is mortified that people keep asking him to read it aloud. Brave in the way of small dogs and good clerks.',
    startLevel: 28,
    base:   { hp: 98, mp: 54, atk: 8, mag: 13, def: 9, res: 13, agi: 8, luk: 13 },
    growth: { hp: 8,  mp: 5,  atk: 0.9, mag: 1.9, def: 1.3, res: 1.8, agi: 0.9, luk: 1.4 },
    skills: { 1: 'mend', 2: 'encourage', 8: 'soothing_word', 16: 'sanctuary' },
    passive: { id: 'meticulous', name: 'Meticulous Notes', desc: 'Each round he tends the most wounded ally — it\'s all in the ledger.', roundHeal: 0.03 },
    role: 'healer',
  },
};

// Rival party names for bounty-only rescues (no named survivor).
export const RIVAL_PARTIES = ['Ironvale Company', 'the Gilded Compass', 'Lantern & Ledger', 'the Silver Skein', 'Dawnbreak\'s second squad'];

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

// Recruits available to court, given the current state.
export function recruitOffers(S) {
  const sinceClear = S.day - (S.clearedDay || S.day);
  return Object.values(HEROES).filter(h => {
    if (!h.recruit || h.custom) return false; // forged heroes join via the Forge
    if ((S.recruited || []).includes(h.id)) return false;
    const a = h.arrive || {};
    // rescued rivals petition once you've pulled them out of a gate
    if (a.rescued) return !!(S.flags && S.flags['rescued_' + h.id]);
    if (!S.cleared) return false;
    if (a.ngPlus != null && (S.ngPlus || 0) < a.ngPlus) return false;
    if (a.day != null && sinceClear < a.day) return false;
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

  // ---- Themed elemental / status skill lines (Character Forge) ----
  // Forged heroes whose descriptions imply an element get one of these
  // kits. No resistances — the point is the status the theme inflicts.
  // Fire → Burn
  th_fire1: { name: 'Ember Spark', type: 'mag', power: 0.9, mp: 6, target: 'enemy', anim: 'cast', apply: { to: 'target', id: 'burn', turns: 2, chance: 0.5 }, desc: 'A dart of flame that may set the target Burning.' },
  th_fire2: { name: 'Immolate', type: 'mag', power: 1.8, mp: 16, target: 'enemy', anim: 'cast', apply: { to: 'target', id: 'burn', turns: 3, chance: 0.9 }, desc: 'Wreathe a foe in fire. Almost always Burns.' },
  th_fire3: { name: 'Firestorm', type: 'mag', power: 1.1, mp: 26, target: 'all_enemies', anim: 'cast', apply: { to: 'target', id: 'burn', turns: 2, chance: 0.7 }, desc: 'A storm of embers over the field. May Burn all.' },
  // Ice → Slow (+ freeze/stun)
  th_ice1: { name: 'Frostbite', type: 'mag', power: 0.95, mp: 7, target: 'enemy', anim: 'cast', apply: { to: 'target', id: 'agi_down', turns: 2, chance: 0.75 }, desc: 'Biting cold that Slows.' },
  th_ice2: { name: 'Deep Freeze', type: 'mag', power: 1.5, mp: 16, target: 'enemy', anim: 'cast', apply: [{ to: 'target', id: 'stun', turns: 1, chance: 0.5 }, { to: 'target', id: 'agi_down', turns: 2 }], desc: 'Locks a foe in ice — may freeze them solid, always Slows.' },
  th_ice3: { name: 'Blizzard', type: 'mag', power: 1.05, mp: 26, target: 'all_enemies', anim: 'cast', apply: { to: 'target', id: 'agi_down', turns: 2, chance: 0.8 }, desc: 'A screaming gale of ice. Slows the field.' },
  // Lightning → Stun (shock)
  th_bolt1: { name: 'Spark', type: 'mag', power: 1.0, mp: 7, target: 'enemy', anim: 'cast', apply: { to: 'target', id: 'stun', turns: 1, chance: 0.3 }, desc: 'A jolt that may Stun.' },
  th_bolt2: { name: 'Thunderstrike', type: 'mag', power: 1.7, mp: 16, target: 'enemy', anim: 'cast', apply: { to: 'target', id: 'stun', turns: 1, chance: 0.6 }, desc: 'A bolt from the blue. Often Stuns.' },
  th_bolt3: { name: 'Chain Lightning', type: 'mag', power: 1.0, mp: 24, target: 'all_enemies', anim: 'cast', apply: { to: 'target', id: 'stun', turns: 1, chance: 0.35 }, desc: 'Arcs across the field; may Stun.' },
  // Poison → Poison
  th_pois1: { name: 'Venom Dart', type: 'mag', power: 0.7, mp: 6, target: 'enemy', anim: 'cast', apply: { to: 'target', id: 'poison', turns: 3, chance: 0.85 }, desc: 'A toxic sting. Poisons.' },
  th_pois2: { name: 'Plague Touch', type: 'mag', power: 1.2, mp: 14, target: 'enemy', anim: 'cast', apply: [{ to: 'target', id: 'poison', turns: 3, chance: 0.9 }, { to: 'target', id: 'atk_down', turns: 2 }], desc: 'Sickness that Weakens and Poisons.' },
  th_pois3: { name: 'Miasma', type: 'mag', power: 0.8, mp: 22, target: 'all_enemies', anim: 'cast', apply: { to: 'target', id: 'poison', turns: 3, chance: 0.7 }, desc: 'A creeping cloud of poison over the field.' },
  // Holy → Radiant (smite/bless)
  th_holy1: { name: 'Smite', type: 'mag', power: 1.2, mp: 8, target: 'enemy', anim: 'cast', apply: { to: 'target', id: 'atk_down', turns: 2, chance: 0.6 }, desc: 'Radiant light that sears and cows. May Weaken.' },
  th_holy2: { name: 'Blessing', type: 'support', mp: 12, target: 'ally', anim: 'buff', apply: { to: 'target', id: 'blessed', turns: 3 }, desc: 'Bathes an ally in restoring light (strong regen).' },
  th_holy3: { name: 'Consecrate', type: 'mag', power: 1.0, mp: 24, target: 'all_enemies', anim: 'cast', apply: { to: 'target', id: 'vulnerable', turns: 2, chance: 0.6 }, desc: 'Hallowed ground. The unholy are left Exposed.' },
  // Earth → Sunder / quake
  th_earth1: { name: 'Stone Fist', type: 'phys', power: 1.1, mp: 7, target: 'enemy', anim: 'melee', apply: { to: 'target', id: 'def_down', turns: 2, chance: 0.7 }, desc: 'A crushing blow that cracks armor (Sundered).' },
  th_earth2: { name: 'Boulder', type: 'phys', power: 1.7, mp: 15, target: 'enemy', anim: 'melee', apply: { to: 'target', id: 'stun', turns: 1, chance: 0.4 }, desc: 'Drops a rock the size of an argument. May Stun.' },
  th_earth3: { name: 'Earthquake', type: 'phys', power: 0.95, mp: 22, target: 'all_enemies', anim: 'melee', apply: { to: 'target', id: 'def_down', turns: 2, chance: 0.5 }, desc: 'The ground bucks. Sunders the field.' },
  // Wind → haste / multi-hit
  th_wind1: { name: 'Gale Cut', type: 'phys', power: 0.7, hits: 2, mp: 8, target: 'enemy', anim: 'dash', desc: 'Twin slashes carried on the wind.' },
  th_wind2: { name: 'Zephyr', type: 'support', mp: 10, target: 'self', anim: 'buff', freeAction: true, apply: { to: 'target', id: 'haste', turns: 2 }, desc: 'Rides the wind. Grants Haste — free action.' },
  th_wind3: { name: 'Cyclone', type: 'phys', power: 0.85, mp: 20, target: 'all_enemies', anim: 'dash', apply: { to: 'self', id: 'haste', turns: 2 }, desc: 'A whirling storm of blades; leaves the caster Hasted.' },
  // Bleed → Bleed
  th_bleed1: { name: 'Rend', type: 'phys', power: 1.15, mp: 7, target: 'enemy', anim: 'melee', apply: { to: 'target', id: 'bleed', turns: 3, chance: 0.7 }, desc: 'A ragged cut that leaves them Bleeding.' },
  th_bleed2: { name: 'Hemorrhage', type: 'phys', power: 1.6, mp: 16, target: 'enemy', anim: 'melee', apply: { to: 'target', id: 'bleed', turns: 3, chance: 0.9 }, desc: 'A deep, deliberate wound. Heavy Bleed.' },
  th_bleed3: { name: 'Bloodletting', type: 'phys', power: 0.9, mp: 20, target: 'all_enemies', anim: 'melee', apply: { to: 'target', id: 'bleed', turns: 3, chance: 0.6 }, desc: 'One wide arc; the whole field Bleeds.' },
  // Curse → hex / doom
  th_curse1: { name: 'Hex', type: 'mag', power: 0.7, mp: 8, target: 'enemy', anim: 'cast', apply: [{ to: 'target', id: 'atk_down', turns: 2 }, { to: 'target', id: 'res_down', turns: 2 }], desc: 'A withering hex — Weakens and Hexes.' },
  th_curse2: { name: 'Doom', type: 'mag', power: 1.3, mp: 18, target: 'enemy', anim: 'cast', apply: { to: 'target', id: 'vulnerable', turns: 2, chance: 0.8 }, desc: 'Marks a soul for ruin. Leaves them Exposed.' },
  th_curse3: { name: 'Malediction', type: 'mag', power: 0.85, mp: 24, target: 'all_enemies', anim: 'cast', apply: { to: 'target', id: 'atk_down', turns: 2, chance: 0.7 }, desc: 'A curse spoken over the whole field. Weakens all.' },

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
  ghoul:         { name: 'Ghoul',           model: 'ghoul',    base: { hp: 72, atk: 15, mag: 6,  def: 7,  res: 6,  agi: 8 },  skills: ['e_bite', 'e_drain'],           xp: 14, gold: 10 },
  wraith:        { name: 'Wraith',          model: 'wraith',   base: { hp: 50, atk: 6,  mag: 16, def: 5,  res: 12, agi: 12 }, skills: ['e_ember', 'e_drain'],          xp: 15, gold: 12 },
  golem:         { name: 'Stone Golem',     model: 'golem',    base: { hp: 100, atk: 15, mag: 4, def: 14, res: 8,  agi: 5 },  skills: ['strike', 'e_smash', 'e_gore'], xp: 17, gold: 13 },
  gargoyle:      { name: 'Gargoyle',        model: 'gargoyle', base: { hp: 70, atk: 14, mag: 10, def: 10, res: 10, agi: 11 }, skills: ['strike', 'e_frost'],           xp: 16, gold: 12 },
  sentinel:      { name: 'Ruin Sentinel',   model: 'sentinel', base: { hp: 85, atk: 16, mag: 8,  def: 12, res: 9,  agi: 8 },  skills: ['strike', 'e_sunder', 'e_gore'], xp: 17, gold: 13 },
  frost_wolf:    { name: 'Frost Wolf',      model: 'wolf',     variant: 'frost', base: { hp: 68, atk: 16, mag: 8, def: 8, res: 8, agi: 15 }, skills: ['e_bite', 'e_frost', 'e_howl'], xp: 16, gold: 12 },
  ice_elemental: { name: 'Ice Elemental',   model: 'elemental',base: { hp: 62, atk: 8,  mag: 18, def: 7,  res: 13, agi: 10 }, skills: ['e_frost', 'e_shriek'],        xp: 17, gold: 13 },
  yeti:          { name: 'Yeti',            model: 'yeti',     base: { hp: 105, atk: 17, mag: 5, def: 11, res: 8,  agi: 7 },  skills: ['strike', 'e_smash', 'e_howl'], xp: 18, gold: 14 },
  imp:           { name: 'Imp',             model: 'imp',      base: { hp: 55, atk: 13, mag: 13, def: 6,  res: 9,  agi: 14 }, skills: ['e_ember', 'e_bite'],           xp: 16, gold: 13 },
  hellhound:     { name: 'Hellhound',       model: 'wolf',     variant: 'hell', base: { hp: 78, atk: 18, mag: 10, def: 9, res: 8, agi: 14 }, skills: ['e_bite', 'e_ember', 'e_howl'], xp: 18, gold: 14 },
  cultist:       { name: 'Void Cultist',    model: 'cultist',  base: { hp: 60, atk: 9,  mag: 16, def: 6,  res: 12, agi: 10 }, skills: ['e_drain', 'e_ember', 'e_heal'], xp: 18, gold: 15 },
  revenant:      { name: 'Revenant',        model: 'skeleton', variant: 'revenant', base: { hp: 92, atk: 16, mag: 6, def: 11, res: 7, agi: 7 }, skills: ['strike', 'e_rend', 'e_sunder'], xp: 19, gold: 14 },
  banshee:       { name: 'Banshee',         model: 'wraith',   variant: 'banshee', base: { hp: 58, atk: 6, mag: 18, def: 6, res: 13, agi: 13 }, skills: ['e_shriek', 'e_drain', 'e_frost'], xp: 20, gold: 16 },
  dark_acolyte:  { name: 'Dark Acolyte',    model: 'cultist',  variant: 'acolyte', base: { hp: 66, atk: 8, mag: 17, def: 7, res: 13, agi: 10 }, skills: ['e_drain', 'e_ember', 'e_heal'], xp: 20, gold: 17 },
  war_golem:     { name: 'War Golem',       model: 'golem',    variant: 'war', base: { hp: 118, atk: 17, mag: 5, def: 15, res: 9, agi: 5 }, skills: ['strike', 'e_gore', 'e_sunder'], xp: 22, gold: 17 },
  ice_wisp:      { name: 'Rime Wisp',       model: 'sprite',   variant: 'ice', base: { hp: 52, atk: 6, mag: 17, def: 5, res: 14, agi: 16 }, skills: ['e_frost', 'e_shriek'], xp: 19, gold: 15 },
  frost_giant:   { name: 'Frost Giant',     model: 'yeti',     variant: 'giant', base: { hp: 130, atk: 19, mag: 6, def: 12, res: 9, agi: 6 }, skills: ['e_smash', 'e_gore', 'e_howl'], xp: 23, gold: 18 },
  abyss_hound:   { name: 'Abyssal Hound',   model: 'wolf',     variant: 'abyss', base: { hp: 84, atk: 19, mag: 9, def: 9, res: 8, agi: 16 }, skills: ['e_bite', 'e_pounce', 'e_howl'], xp: 22, gold: 17 },

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
};

// Rough level a party member should be to face each rank evenly.
export const DISPATCH_BENCHMARK = { F: 4, D: 10, C: 18, B: 28, A: 40, S: 54 };

// Shop stock scales with guild rank.
export function shopStock(rankIdx) {
  const items = Object.entries(ITEMS)
    .filter(([, it]) => !it.minRank || RANKS.indexOf(it.minRank) <= rankIdx)
    .map(([id]) => id);
  return items;
}
