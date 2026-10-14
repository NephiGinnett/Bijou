// ============================================================
// PACK 1 — THE OBSIDIAN COLLEGE
// The College of Varenthis: a lawful, surveilling magical authority
// that wants the Codex catalogued and the warlock licensed or
// dismantled. Built from the Character Packs GDD table.
// ============================================================

import { makeHero, petition, bondBeat, romance } from './common.js';
import { free } from '../story.js';

const P = 'obsidian';
const has = (S, id) => (S.allies || []).includes(id);

export const looks = {
  auren_voss:     { skin: 0xf2dcc8, hair: 0x6a3a2a, hairstyle: 'long', outfit: 0x2a1a2e, outfitStyle: 'dress', frill: 0xd8b04a, eyeColor: 0x4a6a3a, chest: 2, collar: true, collarColor: 0xd8b04a, weapon: 'book' },
  revenant_bride: { skin: 0xe8eef2, hair: 0xf0f0f4, hairstyle: 'long', outfit: 0xf4f4f8, outfitStyle: 'dress', frill: 0xd8d8e8, eyeColor: 0x8ab8d8, eyeGlow: true, ghost: true, chest: 1, crown: true, crownColor: 0xe8e8f0 },
  mira_ashveil:   { skin: 0xe8c8a8, hair: 0xb84a2a, hairstyle: 'curly', outfit: 0x5a3a2a, sleeve: 0xe8dcc8, legColor: 0x3a2a1a, eyeColor: 0x3a6a3a, chest: 2, freckles: true },
  maren_soleil:   { skin: 0xf0d8c0, hair: 0xe8c86a, hairstyle: 'braided', outfit: 0x14121a, outfitStyle: 'robe', frill: 0xd8b04a, eyeColor: 0x3a5a8a, chest: 1, weapon: 'book' },
  cole_ashmer:    { skin: 0xd8b494, hair: 0x3a2a1a, hairstyle: 'short', outfit: 0x2a3a4a, outfitStyle: 'armor', sleeve: 0x2a3a4a, legColor: 0x1a2430, eyeColor: 0x4a3a2a, facialHair: true, weapon: 'sword' },
  seris_duel:     null, // uses the seris hero model
};

export const heroes = {
  auren_voss: makeHero('auren_voss', { pack: P, rarity: 'epic', role: 'support', name: 'Auren', epithet: 'Lady Voss', cls: 'Political Ally', color: '#c8a050', model: 'auren_voss',
    arrive: { circle: 2, day: 1 }, startLevel: 14, tags: ['married', 'affair', 'mature', 'breeding'],
    desc: 'Lady Auren Voss, wife of a College regent, who has spent nine years keeping a ledger of every crime the College has buried. She would like you to help her publish it. She would also, very privately, like to be looked at the way you look at the Codex.' }),
  revenant_bride: makeHero('revenant_bride', { pack: P, rarity: 'epic', role: 'caster', name: 'The Bride', epithet: 'Revenant of the Catacombs', cls: 'Spirit', color: '#d8e8f8', model: 'revenant_bride',
    recruit: true, arrive: { flag: 'bride_reclaimed' }, startLevel: 12, tags: ['slow-burn', 'romance', 'tragic'],
    desc: 'A bride who died in the Ember Catacombs on her wedding night two centuries ago, still waiting for someone who will tell her the truth. You did. She is learning, slowly, what to do with being answered.' }),
  mira_ashveil: makeHero('mira_ashveil', { pack: P, rarity: 'rare', role: 'healer', name: 'Mira Ashveil', epithet: 'of the Lantern & Ash', cls: 'Tavern-Keeper', color: '#d8784a', model: 'mira_ashveil',
    arrive: { circle: 1, day: 1 }, startLevel: 8, tags: ['romance', 'breeding'],
    passive: { id: 'tavern', name: 'Open Tab', desc: 'While she stands with you, her tavern sells reagents at the Market.', roundHeal: 0.03 },
    desc: 'Mira Ashveil keeps the Lantern & Ash, the only tavern in the dead city the College watches and the Coven drinks at. She knows every rumor before the crows do, and she wants a seat closer to the storm.' }),
  maren_soleil: makeHero('maren_soleil', { pack: P, rarity: 'common', role: 'caster', name: 'Maren', epithet: 'Soleil, formerly of the College', cls: 'Reformed Agent', color: '#e8c86a', model: 'maren_soleil',
    captive: true, startLevel: 10, tags: ['romance'],
    desc: 'Maren Soleil, the College agent you caught reading the Codex\'s mail. Reclaimed in the Undercroft. She still writes reports — to you now, and they are much less dry.' }),
  cole_ashmer: makeHero('cole_ashmer', { pack: P, rarity: 'common', role: 'tank', name: 'Cole', epithet: 'Ashmer of the City Watch', cls: 'Watchman', color: '#6a8aa8', model: 'cole_ashmer',
    arrive: { circle: 1, day: 3 }, startLevel: 8, tags: ['romance-optional'],
    desc: 'Cole Ashmer, sergeant of what\'s left of the City Watch. He warns you when the College is coming. He has stopped pretending he does it for the city.' }),
};

export const enemies = {
  maren_soleil: { name: 'Maren Soleil, College Agent', model: 'maren_soleil', boss: true, leaderBreak: true, faction: 'college', captureType: 'humanoid', named: 'maren_soleil', sealResist: 0.4,
    base: { hp: 72, atk: 8, mag: 17, def: 7, res: 14, agi: 12 }, skills: ['e_hex', 'e_shriek', 'e_heal'], xp: 40, gold: 40 },
  seris_duel: { name: 'Seris Val', model: 'seris', boss: true, faction: 'college', captureType: null, yieldAt: 0.3,
    base: { hp: 100, atk: 8, mag: 21, def: 9, res: 16, agi: 13 }, skills: ['e_hex', 'e_aoe_mag', 'e_drain', 'e_curse'], xp: 60, gold: 50 },
  pale_stag: { name: 'The Pale Stag', model: 'stag', variant: 'pale', boss: true, leaderBreak: true, captureType: 'beast', family: 'hollow_stag', named: 'pale_stag', sealResist: 0.6,
    base: { hp: 130, atk: 16, mag: 16, def: 11, res: 13, agi: 14 }, skills: ['e_gore', 'e_heal', 'e_pounce', 'e_aoe_mag', 'e_enrage'], xp: 60, gold: 30 },
  vex_wild: { name: 'Something in the Dark', model: 'vex', boss: true, leaderBreak: true, captureType: 'beast', family: 'gloom_moth', named: 'vex', sealResist: 0.3,
    base: { hp: 70, atk: 14, mag: 10, def: 7, res: 9, agi: 16 }, skills: ['e_drain', 'e_shriek', 'strike'], xp: 30, gold: 10 },
};

export const captives = {
  maren_soleil: { id: 'cap_maren', name: 'Maren Soleil', title: 'Agent of the Obsidian College', faction: 'college',
    brand: 100, resolve: 60, regard: -10, traits: ['doubting', 'lonely'], hero: 'maren_soleil',
    knows: ['Archon Sorn has a file on you thicker than the Codex. It has a section on Vesper titled RECOVERABLE ASSET.',
      'Maren\'s reports on you were rewritten by her superiors before they reached Sorn. She has the originals.',
      'The College licenses warlocks — and then quietly collects them. The licensed ones are kept in the Observatory.'] },
};

// Location tweaks: Vex lurks in the Drowned Stacks once you're Ember.
export const lieutenants = { drowned_stacks: { id: 'vex_wild', pack: P, circle: 1 } };

export const speakers = {
  auren_voss: { name: 'Lady Auren', color: '#c8a050' },
  revenant_bride: { name: 'The Bride', color: '#d8e8f8' },
  mira_ashveil: { name: 'Mira Ashveil', color: '#d8784a' },
  maren_soleil: { name: 'Maren', color: '#e8c86a' },
  cole_ashmer: { name: 'Cole', color: '#6a8aa8' },
  sorn: { name: 'Archon Sorn', color: '#d8b04a' },
};

export function events(E) {
  // ---- Seris Val: recurring duels she always walks away from ----
  E.lt_seris_duel_yielded = { id: 'lt_seris_duel_yielded', where: 'auto', once: true, priority: 80, steps: [
    { s: 'narr', t: 'Seris Val lowers her hands a half-second before you\'d have broken her guard. Precisely. Deliberately. As if she\'d calculated the exact moment to stop.' },
    { s: 'seris', t: 'Noted: the anomaly is stronger than the reports. (she straightens her collar) That will be a very uncomfortable paragraph to write.' },
    { s: 'seris', t: 'This isn\'t a surrender. It\'s a postponement.' },
    { s: 'narr', t: 'She walks out of the Observatory without looking back. Her hands, you notice, are shaking.' },
  ] };
  E.seris_defies = { id: 'seris_defies', where: 'guild', once: true, priority: 66,
    cond: S => S.lieutenants && S.lieutenants.seris_duel && (S.factions.college.power <= 50 || !!S.factions.college.fate),
    steps: [
      { s: 'narr', t: 'Seris Val arrives at the drowned stair in the rain, without her College collar. There is a burn across her palm in the shape of the Archon\'s seal.' },
      { s: 'seris', t: 'Sorn ordered me to bring Vesper in. "Recover the asset." (a thin, furious smile) I declined. Rather loudly. In front of the faculty.' },
      { s: 'seris', t: 'I have nowhere to go that he won\'t follow. You\'re the only thing in this city he\'s afraid of. (beat) Purely professional proximity, of course.' },
      { flag: 'seris_defies' },
      { s: 'narr', t: 'Her petition is waiting on the reading table.' },
    ] };
  E.seris_bond_1 = bondBeat('seris', 1, [
    { s: 'narr', t: 'Seris challenges you to a sparring match in the reading room. She loses. She demands a rematch. She loses that, too, and you notice she\'s stopped trying to win.' },
    { s: 'seris', t: '(on the floor, breathless, not getting up) Note for the record: I am collecting data. On how you win. Repeatedly.' },
  ]);
  E.seris_romance = romance('seris', { name: 'Seris', bond: 7, tags: ['dominance', 'humiliation', 'breeding'],
    lead: [
      { s: 'narr', t: 'Seris has stopped pretending the duels are about anything but this. Tonight she comes to your room still in her sparring leathers, chin high, every inch the College\'s instrument.' },
      { s: 'seris', t: 'I lose to you. Every time. I\'ve run the numbers; it isn\'t chance. (her voice drops) I would like, just once, to lose properly. To you. On purpose. And I would like you to make me admit I wanted to.' },
    ],
    choices: [
      { t: 'Make her say it.', tone: 'dom', r: [{ s: 'seris', t: '(a long silence; her composure cracks like glass) ...I want to. I want you. There. Recorded.' }],
        gentle: 'You hold her gaze until she looks away first — and then she laughs, unsteady, and lets you pull her close, the College\'s instrument finally off duty.',
        steamy: 'You make her say it twice, slowly, until the proud line of her shoulders gives and she is pressing her flushed face into your neck, all that precision undone. She keeps very meticulous notes, later, in a hand that will not stay steady. You read them over her shoulder. She lets you.' },
      { t: 'Pull her down beside you instead.', tone: 'kind',
        gentle: 'She tenses — then melts, all at once, like a held breath released, and spends the night not calculating anything at all.',
        steamy: 'She tenses, then melts against you all at once, and for once in her life Seris Val stops narrating and simply lets herself be wanted, thoroughly, until the candles gutter out.' },
    ],
    chronicle: 'Seris Val lost properly, on purpose.' });

  // ---- Lady Auren Voss: her evidence ledger ----
  E.recruit_intro_auren_voss = petition('auren_voss', [
    { s: 'narr', t: 'A lady in deep violet silk descends the drowned stair as if it were a ballroom, a heavy ledger under one arm. Her wedding ring is very large and very cold.' },
    { s: 'auren_voss', t: 'Lady Auren Voss. My husband sits on the College\'s Regency. I have spent nine years writing down everything he and his colleagues have buried.' },
    { s: 'auren_voss', t: 'I need someone the College is afraid of to read it aloud. (she looks you over, unhurried) You\'ll do. Beautifully.' },
  ]);
  E.auren_ledger = { id: 'auren_ledger', where: 'guild', once: true, priority: 62,
    cond: S => has(S, 'auren_voss') && (S.captives.concat(S.released || []).some(c => c.faction === 'college' && c.learned && c.learned.length)),
    steps: [
      { s: 'auren_voss', t: 'Your College captive confirmed the last entry. (she closes the ledger, very gently) That\'s all of it, then. Nine years.' },
      { s: 'auren_voss', t: 'I\'ve sent copies to every crow in the city. By morning the Regency will be answering questions instead of asking them.' },
      { s: 'narr', t: 'The Obsidian College reels. (College Power −12)' },
      { flag: 'auren_ledger_published' },
    ] };
  E.auren_voss_bond_1 = bondBeat('auren_voss', 1, [
    { s: 'narr', t: 'Lady Auren takes tea in the reading room every afternoon at four, whether there is tea or not. Today she pours a second cup without asking and slides it to your side of the table.' },
    { s: 'auren_voss', t: 'My husband hasn\'t poured me a cup in eleven years. (she sips) I find I prefer the company down here. The tea is worse. Everything else is better.' },
  ]);
  E.auren_voss_romance = romance('auren_voss', { name: 'Auren', bond: 7, tags: ['married', 'affair', 'mature', 'breeding'],
    lead: [
      { s: 'narr', t: 'Auren takes off her wedding ring and sets it on the reading table between you, very precisely, the way a player lays down a winning card.' },
      { s: 'auren_voss', t: 'I am not leaving him. Not yet; the Regency would bury me with my ledger. But I am done being a wife who is only ever looked at across a dinner table. (she meets your eyes) Look at me properly.' },
    ],
    choices: [
      { t: 'Look at her properly.', tone: 'dom',
        gentle: 'You take your time about it. By the end she is the one who closes the distance, laughing softly, a married woman with nothing left to pretend about.',
        steamy: 'You look at her the way she asked — slowly, thoroughly, until the composure of a Regent\'s wife comes undone one silk button at a time. She is unhurried about everything, Lady Auren Voss. Tonight is no exception, and she makes you wait, and wait, and then very much does not.' },
      { t: '"Only if you\'re sure."', tone: 'kind',
        gentle: '"Nine years sure," she says, and pulls you down to her by your collar.',
        steamy: '"Nine years sure," she murmurs, already pulling you to her by your collar, and proves it with the patience of a woman who has planned every move of this game in advance and is delighted to finally play it.' },
    ],
    chronicle: 'Lady Auren took off her ring.' });

  // ---- The Revenant Bride: reclaimed by honesty, not seals ----
  const brideAsk = (n, q, truth, lie, react) => ({ id: 'bride_' + n, where: 'camp', once: true, priority: 60 - n,
    cond: S => (S.visits.ember_catacombs || 0) >= n && (n === 1 || !!S.seen['bride_' + (n - 1)]),
    steps: [
      ...q,
      { choice: [
        { t: truth, tone: 'kind', flag: `bride_honest_${n}`, r: react.truth },
        { t: lie, tone: 'dom', r: react.lie },
      ] },
      { join: 'revenant_bride', cond: S => n === 3 && ['bride_honest_1', 'bride_honest_2', 'bride_honest_3'].filter(f => S.flags[f]).length >= 2 },
      { flag: 'bride_reclaimed', cond: S => n === 3 && ['bride_honest_1', 'bride_honest_2', 'bride_honest_3'].filter(f => S.flags[f]).length >= 2 },
    ] });
  E.bride_1 = brideAsk(1, [
    { s: 'narr', t: 'Something follows you out of the Ember Catacombs: a woman in a wedding dress two centuries out of fashion, translucent as frost on a window.' },
    { s: 'revenant_bride', t: 'Everyone who comes down there lies to me. They say he\'s coming back. Will you lie to me too?' },
  ], 'Tell her the truth: whoever she waited for is long dead.', 'Tell her he\'s on his way.',
    { truth: [{ s: 'revenant_bride', t: '(she flickers, like a candle in a draft) ...Thank you. It hurts. But it\'s the first thing that\'s been real in two hundred years.' }],
      lie: [{ s: 'revenant_bride', t: '(sadly) That\'s what they all say. (she fades back toward the dark)' }] });
  E.bride_2 = brideAsk(2, [
    { s: 'revenant_bride', t: 'You came back. (she studies you) Tell me — was I beautiful, on my wedding day? Nobody remembers. You\'ll have to guess.' },
  ], '"I can\'t know. But you\'re striking now."', '"The most beautiful bride the city ever saw."',
    { truth: [{ s: 'revenant_bride', t: '(the first ghost of a smile) Striking. I\'ll take striking.' }],
      lie: [{ s: 'revenant_bride', t: 'You say that like a man reading a tombstone.' }] });
  E.bride_3 = brideAsk(3, [
    { s: 'revenant_bride', t: 'If I came up into the light with you... would I still be a ghost? Or would I be something else?' },
  ], '"I don\'t know. Come and find out with me."', '"You\'d be alive again. I promise."',
    { truth: [{ s: 'revenant_bride', t: '"Find out with me." (she takes your hand; it is cold, and then it is less cold) Yes. I\'d like to find something out.' }],
      lie: [{ s: 'revenant_bride', t: 'No one can promise that. (a long silence) But I appreciate that you wanted to.' }] });
  E.revenant_bride_bond_1 = bondBeat('revenant_bride', 1, [
    { s: 'narr', t: 'The Bride has discovered the library\'s windows. She spends whole afternoons watching the light move across the floor, saying nothing.' },
    { s: 'revenant_bride', t: 'Two hundred years of torchlight. I forgot the sun moves. (softly) I forgot a lot of things move.' },
  ]);
  E.revenant_bride_romance = romance('revenant_bride', { name: 'the Bride', bond: 8, tags: ['slow-burn', 'romance', 'tragic'],
    lead: [
      { s: 'revenant_bride', t: 'My hands were always cold. Now they\'re only cold when you leave the room. (she looks at you, frightened and certain) I think I\'m becoming something that can be held.' },
    ],
    choices: [
      { t: 'Hold her.', tone: 'kind',
        gentle: 'She is cool and then warm in your arms, and the frost-light of her fades to something almost like skin, and she weeps without sound and does not let go.',
        steamy: 'She is cool and then warm against you, solid in places she has not been solid in two hundred years, and she learns the shape of being touched again slowly, wonderingly, with your name on her lips like the vow she never got to finish.' },
    ],
    chronicle: 'The Bride was held, and stayed.' });

  // ---- Mira Ashveil: tavern keeper ----
  E.recruit_intro_mira_ashveil = petition('mira_ashveil', [
    { s: 'narr', t: 'A freckled woman with copper curls and a tray balanced on one hip blows in on a gust of tavern-smell: ale, smoke, cinnamon.' },
    { s: 'mira_ashveil', t: 'Mira Ashveil, the Lantern & Ash. The College watches my tavern, the Coven drinks in it, and every rumor in this city goes past my bar before it reaches a crow.' },
    { s: 'mira_ashveil', t: 'I\'d like to be closer to the storm. And I can bring stock. Reagents, the good stuff, under the counter. (she winks) Interested?' },
  ]);
  E.mira_ashveil_bond_1 = bondBeat('mira_ashveil', 1, [
    { s: 'narr', t: 'Mira has installed a small, illegal bar in a corner of the reading room. Vesper pretends to object. Vesper also has a tab.' },
    { s: 'mira_ashveil', t: 'First drink\'s on the house. (she slides it over) Second\'s on you. Third\'s on me again, because by then I\'ll want to know what you\'re like at the bottom of a glass.' },
  ]);
  E.mira_ashveil_romance = romance('mira_ashveil', { name: 'Mira', bond: 7, tags: ['romance', 'breeding'],
    lead: [
      { s: 'narr', t: 'Closing time at the Lantern & Ash. Mira turns the sign, locks the door, and leans back against it with the key still in her hand.' },
      { s: 'mira_ashveil', t: 'Every night I watch you walk out that door and I think: one of these nights I\'m going to lock it first. (she drops the key into your palm) Tonight\'s the night.' },
    ],
    choices: [
      { t: 'Pocket the key.', tone: 'dom',
        gentle: 'She laughs, delighted, and pulls you behind the bar by your sleeve.',
        steamy: 'She laughs, bright and wicked, and pulls you behind the bar by your sleeve, and the Lantern & Ash keeps its lamps burning very late that night for a tavern with the sign turned to CLOSED.' },
      { t: 'Kiss her against the door.', tone: 'kind',
        gentle: 'She tastes of cinnamon and ale, and she is smiling the whole time.',
        steamy: 'She tastes of cinnamon and ale and she is smiling the whole time, right up until she isn\'t, because her hands have found your belt and she has very clearly been planning this since the first drink on the house.' },
    ],
    chronicle: 'Mira Ashveil locked the door first.' });

  // ---- Maren Soleil: captive, then ally ----
  E.cell_maren_intro = { id: 'cell_maren_intro', where: 'cell', captive: 'maren_soleil', once: true, priority: 50, steps: [
    { s: 'narr', t: 'Maren Soleil has borrowed a pencil from somewhere and is writing on the cell wall. Notes. On you.' },
    { s: 'captive', t: 'Observation, day one: subject keeps a demon, a knight, and a librarian, and none of them are afraid of her. (she looks up) That isn\'t in any of our files.' },
  ] };
  E.lt_maren_soleil_captured = { id: 'lt_maren_soleil_captured', where: 'auto', once: true, priority: 80, steps: [
    { s: 'vesper', t: 'A College agent. She\'s been reading my mail for months. (she sounds almost impressed) Put her somewhere with good light. She\'ll want to keep taking notes.' },
  ] };
  E.maren_soleil_bond_1 = bondBeat('maren_soleil', 1, [
    { s: 'maren_soleil', t: 'Report, day forty: subject is kind. (she hands you the page) I\'m not sending it anywhere. I just wanted someone to read it.' },
  ]);
  E.maren_soleil_romance = romance('maren_soleil', { name: 'Maren', bond: 7, tags: ['romance'],
    lead: [{ s: 'maren_soleil', t: 'I have a final report. (she\'s blushing) It\'s very short. It says: I want to stay. And then it says your name. A lot.' }],
    choices: [
      { t: 'Read it aloud.', tone: 'dom',
        gentle: 'By the third time you read your own name she has taken the page back and kissed you to stop you.',
        steamy: 'You read it slowly, aloud, every repetition of your name, until she snatches the page away and pins you to the reading-room chair to make you stop, flushed and furious and laughing, and you both forget there was ever any paper at all.' },
      { t: 'Write a reply.', tone: 'kind',
        gentle: 'You write three words. She reads them, and then she doesn\'t need to read anything else.',
        steamy: 'You write three words. She reads them once, sets the pen down very carefully, and then shows you exactly how thorough a College agent can be when she finally stops taking notes.' },
    ],
    chronicle: 'Maren filed her last report.' });

  // ---- Vex: captured into the Menagerie, promotes itself ----
  E.lt_vex_wild_captured = { id: 'lt_vex_wild_captured', where: 'auto', once: true, priority: 80, steps: [
    { s: 'narr', t: 'The thing you sealed in the Drowned Stacks doesn\'t struggle in its Menagerie pen. It watches. It watches everyone. On the second night it produces the laugh sound, perfectly, at one of Rue\'s jokes.' },
    { s: 'rue', cond: S => has(S, 'rue'), t: 'Okay, the pet LAUGHED at me. Is the pet supposed to laugh?' },
  ] };
  E.vex_promotes = { id: 'vex_promotes', where: 'auto', once: true, priority: 85, steps: [
    { s: 'narr', t: 'You come down to feed the Menagerie and find Vex\'s pen open, empty, and swept clean. On the reading table upstairs: a pact, in perfect, unsettling calligraphy.' },
    { s: 'vex', t: '(from the corner, where the shadow is slightly too deep) I watched. I learned. I would like to be a who, not a what. (a pause) Also I would like to try soup.' },
    { join: 'vex' },
  ] };

  // ---- The Pale Stag: apex beast ----
  E.lt_pale_stag_captured = { id: 'lt_pale_stag_captured', where: 'auto', once: true, priority: 80, steps: [
    { s: 'narr', t: 'The Pale Stag kneels in the Menagerie\'s largest pen and does not struggle. Its antlers light the whole Undercroft stair a cold, moon-white. The other beasts go quiet around it, the way a room goes quiet for a queen.' },
    { s: 'nessa', cond: S => has(S, 'nessa'), t: '(whispering) That\'s not a beast. That\'s a spirit of the whole wood. I\'ll — I\'ll make it a better bed.' },
  ] };

  // ---- Cole Ashmer ----
  E.recruit_intro_cole_ashmer = petition('cole_ashmer', [
    { s: 'narr', t: 'A broad man in a dented City Watch breastplate stands at the stair, helmet under his arm, rain dripping off his beard.' },
    { s: 'cole_ashmer', t: 'Sergeant Ashmer. What\'s left of the Watch. The College raids the drowned quarter on the first of every month; I\'ve been tipping off the families. Figured I\'d start tipping off you.' },
  ]);
  E.cole_ashmer_bond_1 = bondBeat('cole_ashmer', 1, [
    { s: 'cole_ashmer', t: 'Watch used to mean something. (he polishes the badge with his thumb) Now it means I watch your back. Funny. Feels like it means more.' },
  ]);
  E.cole_ashmer_romance = romance('cole_ashmer', { name: 'Cole', bond: 8, tags: ['romance-optional'],
    lead: [{ s: 'cole_ashmer', t: '(gruff, not quite meeting your eyes) I\'m not good with words. Never had to be. (a long breath) I\'d like to be good at something for you.' }],
    choices: [
      { t: 'Show him he already is.', tone: 'kind',
        gentle: 'He\'s careful with you like you\'re something precious he\'s been told to guard. You let him guard you all night.',
        steamy: 'For a man who isn\'t good with words he says a great deal without them — slow, steady, devoted, a watchman finally off duty and entirely on yours.' },
    ],
    chronicle: 'Cole Ashmer stood the long watch.' });
}

// Hooks: things the pack adds to the daily tick and the Market.
export function nightly(S, log) {
  if (S.flags.auren_ledger_published && !S.flags.auren_ledger_applied) {
    S.flags.auren_ledger_applied = true;
    if (S.factions.college && !S.factions.college.fate) S.factions.college.power = Math.max(0, S.factions.college.power - 12);
  }
}
