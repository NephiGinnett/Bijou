// ============================================================
// PACK 3 — CLASSIC FANTASY
// The city around the Codex: people the warlock meets between raids.
// Hub recruits and bond-arc characters, not combat captives.
// (Mira the Bold is the base game's Mira Ashvale.)
// ============================================================

import { makeHero, petition, bondBeat, romance, negotiation } from './common.js';

const P = 'classic';
const has = (S, id) => (S.allies || []).includes(id);

export const looks = {
  elara:        { skin: 0xf8f0e8, hair: 0xe8f0f8, hairstyle: 'long', outfit: 0x8ab8d8, outfitStyle: 'dress', frill: 0xe8e8f8, eyeColor: 0x8ad8f8, eyeGlow: true, elf: true, chest: 2, halo: true, weapon: 'staff', accent: 0xd8f0ff },
  seraphine:    { skin: 0xf4e0d0, hair: 0x2a1a14, hairstyle: 'long', outfit: 0x4a1a3a, outfitStyle: 'dress', frill: 0xd8b04a, eyeColor: 0x6a3a2a, chest: 2, crown: true, crownColor: 0xd8b04a, collar: true, collarColor: 0xd8b04a, fan: true, fanColor: 0xd8b04a },
  elspeth:      { skin: 0xf8e8d8, hair: 0xe8d8a0, hairstyle: 'curly', outfit: 0x8ab0d8, outfitStyle: 'dress', frill: 0xf0e8d8, eyeColor: 0x4a6aa8, chest: 1, ribbons: 0x4a7ad8 },
  sister_maren: { skin: 0xf0dcc8, hair: 0x6a4a2a, hairstyle: 'straight', outfit: 0xe8e4dc, outfitStyle: 'robe', frill: 0x8a1a1a, eyeColor: 0x5a6a4a, chest: 2, weapon: 'book', wimple: 0xf4f0e8 },
  kira:         { skin: 0xe0b890, hair: 0x1a1a1a, hairstyle: 'braided', outfit: 0x2a4a3a, sleeve: 0xe8dcc8, legColor: 0x2a2a2a, eyeColor: 0x8a5a2a, chest: 2, piercings: true, apron: 0xe8dcc8, bottle: true },
};

export const heroes = {
  elara: makeHero('elara', { pack: P, rarity: 'legendary', role: 'caster', name: 'Elara', epithet: 'Moonwhisper', cls: 'Elven Enchantress', color: '#a8d8f8', model: 'elara',
    arrive: { circle: 3, flag: 'elara_met' }, startLevel: 22, tags: ['slow-burn', 'first curiosity in a century'],
    desc: 'Elara Moonwhisper, an elven enchantress old enough to remember when the Codex was built. She has not been curious about anything in a hundred years. She is curious about you.' }),
  seraphine: makeHero('seraphine', { pack: P, rarity: 'epic', role: 'support', name: 'Seraphine', epithet: 'Lady of the Upper City', cls: 'Noble Patron', color: '#c8608a', model: 'seraphine',
    arrive: { circle: 2, day: 2 }, startLevel: 14, tags: ['married', 'affair', 'has decided on you'],
    passive: { id: 'patron', name: 'Patronage', desc: 'While she\'s with you, her house sends 40 gold every night.', goldMult: 0.1 },
    desc: 'Lady Seraphine of the upper city, married for convenience to a lord who prefers his horses. She has money, influence, and an extremely clear plan. You are in it.' }),
  elspeth: makeHero('elspeth', { pack: P, rarity: 'rare', role: 'healer', name: 'Elspeth', epithet: 'the Noblewoman', cls: 'Ransomed Noble', color: '#8ab0d8', model: 'elspeth',
    arrive: { flag: 'elspeth_rescued' }, startLevel: 10, tags: ['restraint play (as free ally only)'],
    desc: 'Elspeth, a minor noble the Coven kidnapped for ransom and you pulled out of the Cinder Forge. Her family paid the Coven anyway. She has not gone home.' }),
  sister_maren: makeHero('sister_maren', { pack: P, rarity: 'rare', role: 'healer', name: 'Sister Maren', epithet: 'of the Quiet Vow', cls: 'Cleric', color: '#e8e0d0', model: 'sister_maren',
    arrive: { circle: 1, day: 5 }, startLevel: 8, tags: ['forbidden', 'vow-breaking'],
    desc: 'Sister Maren, a cleric of a quiet order sworn to tend the dying and want nothing for herself. She tends your wounded beautifully. The wanting nothing is going less well.' }),
  kira: makeHero('kira', { pack: P, rarity: 'uncommon', role: 'striker', name: 'Kira', epithet: 'of the Drowned Rose', cls: 'Tavern Keeper', color: '#4a8a6a', model: 'kira',
    arrive: { circle: 0, day: 2 }, startLevel: 4, tags: ['rule-breaking about regulars'],
    desc: 'Kira runs the Drowned Rose, the dive at the bottom of the stair. House rule: no sleeping with regulars. You are, she has informed you, a regular.' }),
};

export const speakers = {
  elara: { name: 'Elara', color: '#a8d8f8' },
  seraphine: { name: 'Lady Seraphine', color: '#c8608a' },
  elspeth: { name: 'Elspeth', color: '#8ab0d8' },
  sister_maren: { name: 'Sister Maren', color: '#e8e0d0' },
  kira: { name: 'Kira', color: '#4a8a6a' },
};

export function events(E) {
  // ---- Elara Moonwhisper: the Charmed Glade ----
  E.elara_met = { id: 'elara_met', where: 'auto', autoCond: true, once: true, priority: 66,
    cond: S => (S.visits.charmed_glade || 0) >= 1 && S.circleIdx >= 3,
    steps: [
      { s: 'narr', t: 'In the deepest part of the Charmed Glade, a woman sits on a stone that has grown moss around her, as if she has not moved in years. Silver hair. Eyes like cold water.' },
      { s: 'elara', t: 'I felt you come into the glade. (she tilts her head) It\'s the first thing I\'ve felt in a hundred years. How strange.' },
      { s: 'elara', t: 'I think I would like to follow you and see what else I feel. If that\'s permitted.' },
      { flag: 'elara_met' },
    ] };
  E.recruit_intro_elara = petition('elara', [
    { s: 'elara', t: 'I watched the first Keeper bind the Codex. I watched the city drown. I stopped watching after that. (she looks at you) I\'ve started again.' },
  ]);
  E.elara_bond_1 = bondBeat('elara', 1, [
    { s: 'elara', t: 'You laughed at something Rue said this morning. I\'ve been thinking about it all day. (she frowns, puzzled) Is that what curiosity feels like? It\'s very distracting.' },
  ]);
  E.elara_romance = romance('elara', { name: 'Elara', bond: 9, tags: ['slow-burn'],
    lead: [{ s: 'elara', t: 'A hundred years without wanting anything. (she touches your face, wondering) And now I can\'t stop.' }],
    choices: [
      { t: 'Let her explore.', tone: 'kind',
        gentle: 'She learns you slowly, with the patience of the very old, and every discovery lights her eyes like the first frost.',
        steamy: 'She learns you with the patience of something ancient and the hunger of something newly woken — slow, unhurried, endlessly curious — and by dawn the oldest woman in the city has discovered a great many things she had forgotten could be felt.' },
    ],
    chronicle: 'Elara Moonwhisper wanted something.' });

  // ---- Lady Seraphine: patron, convenient marriage ----
  E.recruit_intro_seraphine = petition('seraphine', [
    { s: 'narr', t: 'A lady in plum silk and a great deal of gold is shown down the drowned stair by two footmen, who are then dismissed with a flick of her fan.' },
    { s: 'seraphine', t: 'Lady Seraphine. My husband\'s money, my husband\'s name, my own judgment. (she snaps the fan shut) I\'ve decided to fund you. And I\'ve decided on you. Those are separate decisions. Mostly.' },
  ]);
  E.seraphine_romance = romance('seraphine', { name: 'Seraphine', bond: 7, tags: ['married', 'affair', 'has decided on you'],
    lead: [{ s: 'seraphine', t: 'I told you I\'d decided on you. (she sets down her fan) I\'m a woman of my word. My husband is at the races. He\'ll be there for a week.' }],
    choices: [
      { t: '"You decided. Now I decide."', tone: 'dom',
        gentle: 'Her eyes go wide, then dark, and she lets you decide everything.',
        steamy: 'For the first time in her life someone else takes the decision out of Lady Seraphine\'s hands, and she discovers she likes it enormously — silk on the floor, gold in your fist, the most composed woman in the upper city very thoroughly undone.' },
      { t: 'Bow over her hand.', tone: 'kind',
        gentle: 'She laughs, charmed in spite of herself, and pulls you up by your collar.',
        steamy: 'She laughs, charmed in spite of herself, pulls you up by the collar, and spends the week of the races proving she plans her pleasures as meticulously as her investments.' },
    ],
    chronicle: 'Lady Seraphine\'s husband went to the races.' });

  // ---- Elspeth: rescued from Coven kidnappers ----
  E.elspeth_rescue = { id: 'elspeth_rescue', where: 'auto', autoCond: true, once: true, priority: 68,
    cond: S => (S.visits.cinder_forge || 0) >= 2,
    steps: [
      { s: 'narr', t: 'In a storeroom at the back of the Cinder Forge, behind sacks of brand-ash, you find a young noblewoman tied to a chair with a ransom note pinned to her dress. The Coven left her when they ran.' },
      { s: 'elspeth', t: '(as you cut the ropes, her voice shaking but very proper) Elspeth Ardane. Thank you. They — my family was going to pay. I don\'t think they would have let me go even so.' },
      { flag: 'elspeth_rescued' },
      { s: 'narr', t: 'She doesn\'t want to go home. She asks if she can come to the Codex instead.' },
    ] };
  E.recruit_intro_elspeth = petition('elspeth', [
    { s: 'elspeth', t: 'My family paid the Coven after you\'d already freed me. They didn\'t even check. (a small, brittle laugh) I can tend wounds. I can keep books. I\'d rather be useful here than decorative there.' },
  ]);
  for (const ev of negotiation('elspeth', {
    bond: 6, tags: ['restraint play'],
    ask: [
      { s: 'elspeth', t: 'This will sound terrible. In the Forge I was tied up and terrified and powerless. (she twists her hands) Sometimes I think about being tied up and not terrified. By someone I trust. Where I\'m the one who decided.' },
    ],
    terms: [
      { s: 'elspeth', t: 'Ribbon, not rope. Nothing that reminds me of that storeroom. You ask me if I\'m alright, often. And if I say "Ardane", it stops.' },
      { s: 'narr', t: 'You agree to all of it, and add one thing: she can say the word for any reason, or no reason. She looks at you like you\'ve handed her something precious.' },
    ],
    decline: [{ s: 'elspeth', t: '(relieved and a little disappointed) No, you\'re right. Thank you for being honest with me.' }],
    checkIn: 'Ribbon. You ask. "Ardane." (she holds out her wrists, smiling) I decided.',
    scene: [{ s: 'narr', t: 'You ask her if she\'s alright before the first knot, and after it, and she laughs every time.' }],
    gentle: 'She ends the night curled in your arms with blue ribbon still loose around one wrist, and says it\'s the safest she\'s felt in her life.',
    steamy: 'With blue ribbon at her wrists and your voice asking, again and again, if she\'s alright, Elspeth discovers the difference between being helpless and choosing to be held — and it undoes her completely, beautifully, on her own terms.',
    after: [{ chronicle: 'Elspeth chose the ribbon.' }],
  })) E[ev.id] = ev;

  // ---- Sister Maren: vow vs desire ----
  E.recruit_intro_sister_maren = petition('sister_maren', [
    { s: 'narr', t: 'A cleric in white with a red sash kneels at the bottom of the drowned stair to tend a wounded crow before she even introduces herself.' },
    { s: 'sister_maren', t: 'Sister Maren. My order tends the dying and asks nothing for itself. (she sets the crow on her shoulder) You make a great many wounded. Let me tend them.' },
  ]);
  E.sister_maren_bond_1 = bondBeat('sister_maren', 1, [
    { s: 'sister_maren', t: '(binding your arm, not looking at you) My vow says I want nothing for myself. (her fingers linger on your wrist) I have been breaking it in small ways. I wanted you to know.' },
  ]);
  E.sister_maren_romance = romance('sister_maren', { name: 'Sister Maren', bond: 8, tags: ['forbidden', 'vow-breaking'],
    lead: [{ s: 'sister_maren', t: 'I took my vow at sixteen. I didn\'t know what I was promising not to want. (she unpins the red sash, slowly) I know now. And I want it.' }],
    choices: [
      { t: '"Are you certain? Your vow—"', tone: 'kind',
        gentle: '"I\'ve prayed on it for months," she says. "This is my answer." And she kisses you like a prayer.',
        steamy: '"I\'ve prayed on it for months," she whispers, and kisses you like a prayer, and then like something far less holy — a cleric breaking her vow slowly, deliberately, savoring every forbidden inch of it.' },
      { t: 'Take the sash from her hands.', tone: 'dom',
        gentle: 'She lets it go, and lets go of a great deal else with it.',
        steamy: 'She lets the sash slip from her fingers into yours, and with it a decade of discipline, and the sounds she makes are nothing her order ever taught her.' },
    ],
    chronicle: 'Sister Maren broke her vow.' });

  // ---- Kira: the Drowned Rose ----
  E.recruit_intro_kira = petition('kira', [
    { s: 'narr', t: 'The woman who runs the Drowned Rose at the bottom of the stair comes up it for once, a bottle in each hand, braids swinging.' },
    { s: 'kira', t: 'Kira. You\'ve drunk at my bar every night for a week. House rule says I don\'t fraternize with regulars. (she grins) Figured I\'d quit the bar.' },
  ]);
  E.kira_romance = romance('kira', { name: 'Kira', bond: 6, tags: ['rule-breaking'],
    lead: [{ s: 'kira', t: 'Technically you\'re still a regular. I still serve you. (she leans across the table) So technically this breaks my one rule. Good thing I hate rules.' }],
    choices: [
      { t: 'Break it with her.', tone: 'dom',
        gentle: 'She laughs into the kiss, and keeps laughing, and it\'s the best sound in the Codex.',
        steamy: 'She drags you into the back room of the Drowned Rose laughing, bottles rattling on the shelves, and breaks her one rule loudly, enthusiastically, and several times before closing.' },
    ],
    chronicle: 'Kira broke her one rule.' });
}

export function nightly(S, log) {
  if (has(S, 'seraphine')) { S.gold += 40; log.push('Lady Seraphine\'s house sends 40 gold.'); }
}
