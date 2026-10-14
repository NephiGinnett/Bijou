// ============================================================
// PACK 2 — THE NORTHERN REACH
// A frozen northern province where the Ashen Coven recruits. Its
// people feed the Undercroft most directly. Elder Scrolls terms are
// renamed so the pack stands alone: the Gilded Concord, Abyssal,
// Thane, the Ashreach.
// Testimony chain: reclaim Mira Vane first; she speeds up Rhea,
// who in turn speeds up Valdra.
// ============================================================

import { makeHero, petition, bondBeat, romance, negotiation } from './common.js';

const P = 'northern';
const has = (S, id) => (S.allies || []).includes(id);

export const looks = {
  valdra:    { skin: 0x5a6a8a, hair: 0xe8e8f0, hairstyle: 'long', outfit: 0x1a1430, outfitStyle: 'robe', frill: 0xff5a2a, eyeColor: 0xff4a2a, eyeGlow: true, elf: true, chest: 2, crown: true, crownColor: 0xff7a3a, weapon: 'staff', accent: 0xff7a3a },
  nyxe:      { skin: 0x8a5ab8, hair: 0x1a0a2a, hairstyle: 'straight', outfit: 0x1a0a14, sleeve: 0x2a1424, legColor: 0x1a0a14, eyeColor: 0xff4ad8, eyeGlow: true, horns: true, hornColor: 0x0a0a0a, tail: true, tailColor: 0x8a5ab8, wings: true, wingColor: 0x2a0a2a, chest: 1, build: 'slim' },
  mira_vane: { skin: 0xf0dcc8, hair: 0x2a1a3a, hairstyle: 'long', outfit: 0x3a2a4a, outfitStyle: 'robe', frill: 0xff7a3a, eyeColor: 0x8a5ad8, chest: 2, markings: true, markingColor: 0xff7a3a, weapon: 'book' },
  rhea:      { skin: 0xe8c8a8, hair: 0xe85a2a, hairstyle: 'braided', outfit: 0x5a1a14, outfitStyle: 'armor', sleeve: 0x5a1a14, legColor: 0x3a1410, eyeColor: 0xffb02a, eyeGlow: true, chest: 2, horns: true, hornColor: 0xffb02a, scaled: true, weapon: 'sword', build: 'broad' },
  aelindra:  { skin: 0xf4e4c8, hair: 0xf0d870, hairstyle: 'straight', outfit: 0xd8b04a, outfitStyle: 'armor', sleeve: 0xe8e0c8, legColor: 0x8a7a4a, eyeColor: 0x6ab84a, elf: true, chest: 1, weapon: 'sword' },
  aurelia:   { skin: 0xd8b494, hair: 0x2a1a14, hairstyle: 'short', outfit: 0x8a1a1a, outfitStyle: 'armor', sleeve: 0x8a8a8a, legColor: 0x5a1a1a, eyeColor: 0x4a3a2a, chest: 2, cape: true, capeColor: 0x8a1a1a, weapon: 'shield', build: 'broad' },
  brynn:     { skin: 0xf0d8c0, hair: 0xd8d8c8, hairstyle: 'curly', outfit: 0x4a5a3a, outfitStyle: 'dress', frill: 0x8a6a4a, eyeColor: 0x6a8a9a, chest: 2, freckles: true, weapon: 'staff', accent: 0x8ad8b0 },
  sera:      { skin: 0xf4e0d0, hair: 0xb87a3a, hairstyle: 'braided', outfit: 0x6a2a2a, outfitStyle: 'dress', frill: 0xd8b04a, eyeColor: 0x4a6a8a, chest: 2, collar: true, collarColor: 0xd8b04a },
};

export const heroes = {
  valdra: makeHero('valdra', { pack: P, rarity: 'legendary', role: 'caster', name: 'Valdra', epithet: 'Once High Priestess', cls: 'Dark Elf Priestess', color: '#ff7a3a', model: 'valdra',
    captive: true, startLevel: 18, tags: ['see card'],
    desc: 'Valdra, high priestess of the Ashreach Temple, who kept the Coven\'s oldest rites burning in the snow for ninety years. Reclaimed, slowly, in the Undercroft. She still prays at dawn. To whom, she will not say.' }),
  nyxe: makeHero('nyxe', { pack: P, rarity: 'legendary', role: 'striker', name: 'Nyxe', epithet: 'Abyssal Familiar', cls: 'Familiar', color: '#c86ad8', model: 'nyxe',
    arrive: { flag: 'nyxe_yielded' }, startLevel: 12, tags: ['bratty', 'see card'],
    desc: 'Nyxe, an Abyssal familiar who ran the Night Bazaar\'s back rooms until you beat her in her own stall. She is a brat of the highest order, and she has decided Rue is her nemesis. Rue agrees.' }),
  mira_vane: makeHero('mira_vane', { pack: P, rarity: 'epic', role: 'caster', name: 'Mira Vane', epithet: 'the Bound Arcanist', cls: 'Arcanist', color: '#b07ae8', model: 'mira_vane',
    captive: true, startLevel: 12, tags: ['bondage (as free ally only)'],
    passive: { id: 'witness', name: 'First Witness', desc: 'Her Testimony burns Coven brands twice as fast — especially Rhea\'s.' },
    desc: 'Mira Vane, the arcanist the Coven kept chained to its forges: her binding was the brand itself. Reclaimed. She still wears a thin chain at her wrist. She chose it this time, and she\'d like you to know the difference.' }),
  rhea: makeHero('rhea', { pack: P, rarity: 'epic', role: 'striker', name: 'Rhea', epithet: 'Once of the Dragon Cult', cls: 'Wyrm-Sworn', color: '#ff9a2a', model: 'rhea',
    captive: true, startLevel: 14, tags: ['see card'],
    desc: 'Rhea, the Dragon Cult\'s fiercest zealot, who worshipped something with wings atop a spire of black glass. Reclaimed. She has transferred all of that devotion, with alarming efficiency, onto you.' }),
  aelindra: makeHero('aelindra', { pack: P, rarity: 'epic', role: 'striker', name: 'Aelindra', epithet: 'of the Gilded Concord', cls: 'Concord Agent', color: '#e8d070', model: 'aelindra',
    captive: true, startLevel: 12, tags: ['restraint play (after release only)'],
    desc: 'Aelindra, an agent of the Gilded Concord, caught spying on the Coven — and then caught spying on you. Reclaimed. She is still very good at noticing everything, and has stopped reporting it to anyone else.' }),
  aurelia: makeHero('aurelia', { pack: P, rarity: 'rare', role: 'tank', name: 'Aurelia', epithet: 'Legate', cls: 'Mercenary Commander', color: '#c84a4a', model: 'aurelia',
    arrive: { flag: 'aurelia_rescued' }, startLevel: 12, tags: ['command dynamic', 'see card'],
    desc: 'Legate Aurelia, commander of a mercenary cohort the Black Mire ate down to its last six soldiers. You pulled them out. She is used to giving orders. She is discovering she does not mind taking yours.' }),
  brynn: makeHero('brynn', { pack: P, rarity: 'rare', role: 'healer', name: 'Brynn', epithet: 'Witch of the Ashreach', cls: 'Hedge-Witch', color: '#8ad8b0', model: 'brynn',
    arrive: { circle: 1, day: 4 }, startLevel: 8, tags: ['see card'],
    passive: { id: 'hedgecraft', name: 'Hedgecraft', desc: 'Unknown alchemy combinations discover their recipe more often.', roundHeal: 0.03 },
    desc: 'Brynn, a hedge-witch from the Ashreach who refused the Coven\'s brand and walked south through the snow. She talks to her cauldron. Her cauldron, worryingly, seems to listen.' }),
  sera: makeHero('sera', { pack: P, rarity: 'rare', role: 'support', name: 'Sera', epithet: 'the Thane\'s Wife', cls: 'Political Contact', color: '#d8904a', model: 'sera',
    arrive: { flag: 'sera_visits' }, startLevel: 10, tags: ['married', 'affair', 'see card'],
    desc: 'Sera, wife of the Thane of the Ashreach, who writes to you by crow about the Coven\'s movements in the north — and, increasingly, about other things. Her husband reads none of her letters. She makes sure of it.' }),
};

export const enemies = {
  valdra: { name: 'Valdra, High Priestess', model: 'valdra', boss: true, leaderBreak: true, faction: 'coven', captureType: 'humanoid', named: 'valdra', sealResist: 0.55, will: 1.4,
    base: { hp: 120, atk: 10, mag: 22, def: 10, res: 16, agi: 11 }, skills: ['e_frost', 'e_aoe_mag', 'e_curse', 'e_heal', 'e_enrage'], xp: 70, gold: 60 },
  nyxe: { name: 'Nyxe, Abyssal Familiar', model: 'nyxe', boss: true, faction: 'market', captureType: null, yieldAt: 0.3,
    base: { hp: 90, atk: 17, mag: 14, def: 8, res: 10, agi: 18 }, skills: ['e_pounce', 'e_drain', 'e_shriek', 'e_rend'], xp: 45, gold: 50 },
  mira_vane: { name: 'Mira Vane, Bound Arcanist', model: 'mira_vane', boss: true, leaderBreak: true, faction: 'coven', captureType: 'humanoid', named: 'mira_vane', sealResist: 0.4,
    base: { hp: 85, atk: 7, mag: 17, def: 8, res: 13, agi: 10 }, skills: ['e_ash_brand', 'e_aoe_mag', 'e_curse'], xp: 40, gold: 35 },
  rhea: { name: 'Rhea, Dragon-Sworn', model: 'rhea', boss: true, leaderBreak: true, faction: 'coven', captureType: 'humanoid', named: 'rhea', sealResist: 0.5, will: 1.3,
    base: { hp: 115, atk: 19, mag: 12, def: 12, res: 10, agi: 12 }, skills: ['e_rend', 'e_ember', 'e_devastate', 'e_enrage'], xp: 60, gold: 50 },
};

export const captives = {
  valdra: { id: 'cap_valdra', name: 'Valdra', title: 'High Priestess of the Ashreach', faction: 'coven', witness: 'rhea',
    brand: 100, resolve: 100, regard: -50, traits: ['zealous', 'proud', 'stubborn'], hero: 'valdra',
    knows: ['The Ashreach rites are older than the Coven. Mother Cinder stole them.',
      'Valdra has prayed every dawn for ninety years. She stopped hearing an answer thirty years ago and never told anyone.',
      'The Thane of the Ashreach pays the Coven to keep his wife frightened.'] },
  mira_vane: { id: 'cap_miravane', name: 'Mira Vane', title: 'Bound Arcanist of the Forge', faction: 'coven',
    brand: 100, resolve: 45, regard: 0, traits: ['doubting', 'lonely'], hero: 'mira_vane',
    knows: ['Mira Vane\'s brand was put on as a child. She has never known her own magic without it.',
      'The forge-chains are keyed to the brand. Burn out one and the other falls off.'] },
  rhea: { id: 'cap_rhea', name: 'Rhea', title: 'Zealot of the Dragon Cult', faction: 'coven', witness: 'mira_vane',
    brand: 100, resolve: 85, regard: -30, traits: ['zealous', 'fearful'], hero: 'rhea',
    knows: ['There is no dragon in the Spire. There never was. The Coven carved the bones.',
      'Rhea knows the Spire was a lie. She stayed because the lie needed her.'] },
  aelindra: { id: 'cap_aelindra', name: 'Aelindra', title: 'Agent of the Gilded Concord', faction: 'coven',
    brand: 40, resolve: 70, regard: -20, traits: ['proud', 'greedy'], hero: 'aelindra',
    knows: ['The Gilded Concord is buying Coven brands to study. It wants to brand its own people.',
      'Aelindra\'s handler in the Concord has been dead for a month. Nobody has replaced him. She has been reporting to no one.'] },
};

export const speakers = {
  valdra: { name: 'Valdra', color: '#ff7a3a' },
  nyxe: { name: 'Nyxe', color: '#c86ad8' },
  mira_vane: { name: 'Mira Vane', color: '#b07ae8' },
  rhea: { name: 'Rhea', color: '#ff9a2a' },
  aelindra: { name: 'Aelindra', color: '#e8d070' },
  aurelia: { name: 'Legate Aurelia', color: '#c84a4a' },
  brynn: { name: 'Brynn', color: '#8ad8b0' },
  sera: { name: 'Sera', color: '#d8904a' },
};

export function events(E) {
  // ---- lieutenants ----
  E.lt_mira_vane_captured = { id: 'lt_mira_vane_captured', where: 'auto', once: true, priority: 80, steps: [
    { s: 'narr', t: 'When your seal closes on Mira Vane, the chains welding her to the Cinder Forge\'s anvil snap all at once. She looks at her wrists like she has never seen them before.' },
    { s: 'vesper', t: 'The brand and the chains were the same spell. She\'s been a part of that forge since she was a child.' },
  ] };
  E.lt_mira_vane_slain = { id: 'lt_mira_vane_slain', where: 'auto', once: true, priority: 80, steps: [
    { s: 'narr', t: 'Mira Vane dies still chained to the forge. The Coven doesn\'t even come back for the body.' },
  ] };
  E.lt_valdra_captured = { id: 'lt_valdra_captured', where: 'auto', once: true, priority: 80, steps: [
    { s: 'narr', t: 'The High Priestess of the Ashreach goes into the Undercroft singing. She does not stop for three days.' },
    { s: 'vesper', t: 'Her brand is ninety years deep. Testimony from someone she trusts will reach her faster than anything we do. (she frowns) Who does a high priestess trust?' },
  ] };
  E.lt_rhea_captured = { id: 'lt_rhea_captured', where: 'auto', once: true, priority: 80, steps: [
    { s: 'narr', t: 'Rhea fights the seal with her teeth. When it closes, she screams for her dragon. Nothing answers.' },
  ] };
  E.lt_nyxe_yielded = { id: 'lt_nyxe_yielded', where: 'auto', once: true, priority: 80, steps: [
    { s: 'narr', t: 'The Abyssal familiar who runs the Bazaar\'s back rooms flops onto her back in the middle of her own stall, wings splayed, tongue out, playing dead.' },
    { s: 'nyxe', t: 'Okay! Okay. You win. I\'m bored of losing. (she rolls over and grins up at you) Can I come home with you? You\'re way more fun than this dump.' },
    { s: 'rue', cond: S => has(S, 'rue'), t: '(appearing behind you, absolutely incandescent) NO. No no no. Absolutely not. I know her. She is a MENACE.', brand: false },
    { s: 'nyxe', cond: S => has(S, 'rue'), t: '(delighted) Ruuuue! You got a warlock too! Oh, this is going to be SO much fun.' },
    { flag: 'nyxe_yielded' },
  ] };

  E.recruit_intro_nyxe = petition('nyxe', [
    { s: 'nyxe', t: '(hanging upside down from the reading-room chandelier) Hiiii. I\'m here to petition. Formally. (she kicks a candle) Formally enough?' },
    { s: 'rue', cond: S => has(S, 'rue'), t: 'If she joins, I\'m setting her tail on fire. Every day. As a hobby.', brand: true },
  ]);
  E.nyxe_bond_1 = bondBeat('nyxe', 1, [
    { s: 'narr', t: 'Nyxe and Rue have been fighting for an hour over who gets to sit on the arm of your chair. You come back to find them both asleep on it, tangled, still mid-argument.' },
    { s: 'nyxe', t: '(one eye opening) She started it. (the other eye) She always starts it. (she does not move) Don\'t tell her I said she\'s warm.' },
  ]);
  E.nyxe_romance = romance('nyxe', { name: 'Nyxe', bond: 7, tags: ['bratty'],
    lead: [
      { s: 'nyxe', t: 'Rue says you put her in her place. (she\'s sitting on your desk, kicking her heels, scattering your papers) I want a place. Put me in one. Bet you can\'t.' },
    ],
    choices: [
      { t: 'Win the bet.', tone: 'dom',
        gentle: 'She loses spectacularly, and is delighted about it, and spends the rest of the night curled against you purring like something much smaller than an Abyssal familiar.',
        steamy: 'She loses the bet spectacularly and with enormous enthusiasm, wings mantling, tail lashing, mouthy right up until the moment she isn\'t — and then very, very quiet and very, very good, which she will deny loudly at breakfast.' },
      { t: 'Ignore her until she behaves.', tone: 'dom',
        gentle: 'She lasts four minutes. Then she\'s in your lap, contrite, asking very nicely.',
        steamy: 'She lasts four minutes. Then she\'s in your lap, wings folded, asking very nicely in a voice you\'ve never heard her use, and you make her keep asking.' },
    ],
    chronicle: 'Nyxe found her place.' });

  // ---- Mira Vane: bound arcanist ----
  E.cell_miravane_intro = { id: 'cell_miravane_intro', where: 'cell', captive: 'mira_vane', once: true, priority: 50, steps: [
    { s: 'narr', t: 'Mira Vane sits in the exact center of her cell, hands in her lap, wrists bare. She keeps touching them.' },
    { s: 'captive', t: 'I don\'t know how to stand without the chains. They held me up. (very quietly) Is that a terrible thing to say?' },
  ] };
  E.mira_vane_bond_1 = bondBeat('mira_vane', 1, [
    { s: 'narr', t: 'Mira Vane has bought a thin silver chain at the Market. She wears it around one wrist, loose, a decision rather than a sentence.' },
    { s: 'mira_vane', t: 'It\'s mine. I can take it off whenever I want. (she doesn\'t) I wanted to know what that felt like.' },
  ]);
  for (const ev of negotiation('mira_vane', {
    bond: 6, tags: ['bondage'],
    ask: [
      { s: 'mira_vane', t: 'I want to ask you something, and I want you to hear all of it before you answer.' },
      { s: 'mira_vane', t: 'The forge-chains were the worst thing that ever happened to me. But being held — being held still, by someone I chose, who\'d let go the second I asked — I think about that. A lot. With you.' },
    ],
    terms: [
      { s: 'mira_vane', t: '(a slow, steadying breath) Silk, not iron. My wrists only. You check on me. And the word is "forge." I say it, everything stops, no questions.' },
      { s: 'narr', t: 'You repeat it back to her: silk, wrists, check in, "forge." She nods, and some old tension in her shoulders lets go.' },
      { s: 'mira_vane', t: 'Not tonight. I wanted to say it out loud first. I wanted to see your face when I did. (she smiles) Thank you for asking what I wanted.' },
    ],
    decline: [{ s: 'mira_vane', t: '(she nods, a little embarrassed, a little relieved) That\'s okay. Truly. Thank you for answering honestly.' }],
    checkIn: 'Silk. Wrists. "Forge." (she holds out her hands, steady) I\'m sure.',
    scene: [{ s: 'narr', t: 'You check the knot twice. She watches you do it, and something in her face goes very soft.' }],
    gentle: 'She asks you to hold her afterward with the silk still on, and you do, and she falls asleep with her head on your chest, free in every way that matters.',
    steamy: 'Bound by your hands and her own choice, Mira Vane discovers what it is to surrender without being taken — breathless, trusting, saying your name instead of the word that would stop it. You check on her. She laughs, the first truly unguarded laugh you\'ve ever heard from her, and tells you to keep going.',
    after: [{ chronicle: 'Mira Vane chose the silk.' }],
  })) E[ev.id] = ev;

  // ---- Rhea ----
  E.cell_rhea_intro = { id: 'cell_rhea_intro', where: 'cell', captive: 'rhea', once: true, priority: 50, steps: [
    { s: 'captive', t: 'My dragon will come for me. It will burn this whole library down. You\'ll see. (beat) ...It will.' },
  ] };
  E.rhea_bond_1 = bondBeat('rhea', 1, [
    { s: 'rhea', t: 'There was never a dragon. I knew. I always knew. (she sharpens her sword, too hard) I needed something to kneel to. (she glances at you, then away, fast) Don\'t make it a thing.' },
  ]);
  E.rhea_romance = romance('rhea', { name: 'Rhea', bond: 7, tags: ['see card'],
    lead: [{ s: 'rhea', t: 'I worshipped a lie for nine years. (she kneels, abruptly, fiercely) Let me worship something real.' }],
    choices: [
      { t: '"Then get up and show me."', tone: 'dom',
        gentle: 'She rises like fire catching, and kisses you like it\'s a vow.',
        steamy: 'She rises like fire catching and kisses you like a zealot, all heat and certainty, and you discover all that terrifying devotion has finally found somewhere worth landing.' },
      { t: 'Kneel with her.', tone: 'kind',
        gentle: 'She stares at you, startled, then laughs, and leans her forehead against yours.',
        steamy: 'She stares at you, startled — no one has ever met her on the floor before — and then her hands are in your hair, and she is learning, very fast, that devotion can go both ways.' },
    ],
    chronicle: 'Rhea found something real to kneel to.' });

  // ---- Valdra ----
  E.cell_valdra_intro = { id: 'cell_valdra_intro', where: 'cell', captive: 'valdra', once: true, priority: 50, steps: [
    { s: 'narr', t: 'Valdra has drawn a circle of frost on the cell floor and sits inside it, perfectly still, singing a rite older than the Coven.' },
    { s: 'captive', t: 'Ninety years I have kept this flame, child. You think a few weeks in the dark will put it out?' },
  ] };
  E.valdra_romance = romance('valdra', { name: 'Valdra', bond: 8, tags: ['see card'],
    lead: [{ s: 'valdra', t: 'I prayed every dawn for ninety years. Thirty of them to silence. (she looks at you) This morning, for the first time, I felt an answer. It was your footsteps on the stair.' }],
    choices: [
      { t: '"Then pray to me."', tone: 'dom',
        gentle: 'She closes her eyes, and her lips move, and the words are your name.',
        steamy: 'She kneels as she has knelt every dawn for ninety years, but her hands are on you now instead of the altar, and the rite she murmurs is older than the Coven and entirely, devastatingly yours.' },
      { t: '"You don\'t need to pray anymore."', tone: 'kind',
        gentle: 'Ninety years of discipline goes out of her in a single breath, and she lets you hold her.',
        steamy: 'Ninety years of discipline goes out of her in one long breath, and the high priestess of the Ashreach learns, slowly and with great dignity and then with none at all, what it is to be worshipped instead.' },
    ],
    chronicle: 'Valdra\'s dawn prayer was answered.' });

  // ---- Aelindra: caught spying, captive premise rewritten ----
  E.aelindra_caught = { id: 'aelindra_caught', where: 'auto', autoCond: true, once: true, priority: 70,
    cond: S => (S.visits.ashreach_temple || 0) >= 1 && S.flags.undercroft_open,
    steps: [
      { s: 'narr', t: 'Isolde catches her in the stacks at three in the morning: an elf in gilded armor, copying pages of the Codex into a Concord cipher-book.' },
      { s: 'isolde', cond: S => has(S, 'isolde'), t: 'She followed us back from the Ashreach. She was in the temple before we were. Spying on the Coven. Now spying on you.' },
      { s: 'narr', cond: S => !has(S, 'isolde'), t: 'She followed you back from the Ashreach. She was spying on the Coven. Now she\'s spying on you.' },
      { s: 'aelindra', t: 'Aelindra, Gilded Concord. I have diplomatic standing. (she sounds less sure of that every second) I would like to speak to whoever is in charge. (she looks at you) ...Oh.' },
      { capture: 'aelindra' },
      { s: 'narr', t: 'She goes down to the Undercroft. She does not, you notice, have a Coven brand — just a faint Concord seal over her heart, half-burned. Someone tried to brand her and stopped.' },
    ] };
  E.aelindra_bond_1 = bondBeat('aelindra', 1, [
    { s: 'aelindra', t: 'My handler\'s been dead for a month. I\'ve been filing reports to no one. (she sets the cipher-book on your table) I suppose they\'re yours now.' },
  ]);
  for (const ev of negotiation('aelindra', {
    bond: 6, tags: ['restraint play'],
    ask: [
      { s: 'aelindra', t: 'When Isolde caught me in the stacks — before anyone was kind to me — there was a moment when I was held and couldn\'t get away. (she flushes) I\'ve thought about that moment. Wrongly, maybe. I want to have it again, on purpose, with nothing actually at stake.' },
    ],
    terms: [
      { s: 'aelindra', t: 'A game. I\'m the spy, you caught me, you don\'t let me go until I talk. But I\'m not really caught. Ever. The word is "Concord" — I say it and we stop and you hold me like a person.' },
      { s: 'narr', t: 'You agree on everything: what\'s in, what\'s out, the word. Aelindra writes it down in her cipher-book, then laughs at herself, and leaves it there.' },
    ],
    decline: [{ s: 'aelindra', t: 'Understood. Filed. (a small, genuine smile) Thank you for not making it strange.' }],
    checkIn: 'The word is "Concord." I\'m not caught. I\'m choosing. (she grins) Now catch me.',
    scene: [{ s: 'narr', t: 'She runs, laughing, through the moonlit stacks. She lets you win, eventually. Not too eventually.' }],
    gentle: 'The interrogation ends with her confessing to nothing but how much she wanted this, curled against you, laughing and warm.',
    steamy: 'You catch her against the stacks and hold her there, and the "interrogation" is a slow, teasing, delicious game she loses on purpose, confessing everything you ask in a voice that is entirely her own, never once needing the word.',
    after: [{ chronicle: 'Aelindra was caught on purpose.' }],
  })) E[ev.id] = ev;

  // ---- Legate Aurelia: Black Mire rescue ----
  E.aurelia_rescue = { id: 'aurelia_rescue', where: 'auto', autoCond: true, once: true, priority: 68,
    cond: S => (S.visits.black_mire || 0) >= 1,
    steps: [
      { s: 'narr', t: 'At the edge of the Black Mire, behind a barricade of overturned wagons, six mercenaries have been holding out against the bog for nine days. Their commander is still standing. Barely.' },
      { s: 'aurelia', t: 'Legate Aurelia, Third Free Cohort. (she salutes with a broken arm) What\'s left of it. We owe you our lives. I don\'t like owing.' },
      { flag: 'aurelia_rescued' },
      { s: 'narr', t: 'She\'ll come to the Codex to talk terms.' },
    ] };
  E.recruit_intro_aurelia = petition('aurelia', [
    { s: 'aurelia', t: 'My cohort\'s disbanded; they\'ve earned their rest. I haven\'t. I\'ve commanded for twelve years. (a beat) I\'d like to know what it\'s like to follow someone worth following.' },
  ]);
  E.aurelia_romance = romance('aurelia', { name: 'Aurelia', bond: 7, tags: ['command dynamic'],
    lead: [{ s: 'aurelia', t: 'Twelve years of giving orders. (she stands at attention in your doorway, not quite joking) Give me one.' }],
    choices: [
      { t: 'Give her one.', tone: 'dom',
        gentle: 'She obeys with a soldier\'s precision and a very unsoldierly smile.',
        steamy: 'She obeys with a soldier\'s precision and a very unsoldierly flush, and discovers that a commander who finally gets to stop commanding is a thing that can come apart beautifully under the right voice.' },
      { t: '"At ease, Legate."', tone: 'kind',
        gentle: 'She laughs — properly, for the first time — and lets you take off her armor piece by piece.',
        steamy: 'She laughs properly for the first time and lets you take off her armor piece by piece, and for one long night the Legate is just Aurelia, and is very thoroughly at ease.' },
    ],
    chronicle: 'Legate Aurelia stood down.' });

  // ---- Brynn ----
  E.recruit_intro_brynn = petition('brynn', [
    { s: 'narr', t: 'A sturdy woman with snow still in her silver curls drags a cauldron down the drowned stair by its handle. It clangs on every step.' },
    { s: 'brynn', t: 'Brynn. From the Ashreach. The Coven wanted to brand me; I told them where to put it, and walked south. (she pats the cauldron) Heard you\'ve got a cauldron that needs company.' },
  ]);
  E.brynn_romance = romance('brynn', { name: 'Brynn', bond: 7, tags: ['see card'],
    lead: [{ s: 'brynn', t: '(stirring something that smells like summer) My cauldron says you\'re lonely. (she doesn\'t look up) My cauldron is usually right.' }],
    choices: [
      { t: '"Your cauldron\'s right."', tone: 'kind',
        gentle: 'She sets down the ladle and wipes her hands and holds you like the warmest thing in the Ashreach.',
        steamy: 'She sets down the ladle, wipes her hands on her apron, and takes you to bed with the unhurried certainty of a woman who has walked through a blizzard and is not afraid of anything, least of all wanting you.' },
    ],
    chronicle: 'Brynn\'s cauldron was right.' });

  // ---- Sera, the Thane's wife: letters, then a visit ----
  E.sera_letter_1 = { id: 'sera_letter_1', where: 'rumor', once: true, priority: 40, cond: S => S.circleIdx >= 1, steps: [
    { s: 'narr', t: 'A crow with frost on its feathers brings a letter sealed in red wax. The Thane of the Ashreach\'s crest — but the hand is a woman\'s.' },
    { s: 'sera', t: '"Warlock — the Coven moves supplies through my husband\'s passes on the new moon. He takes their coin. I do not. — S."' },
  ] };
  E.sera_letter_2 = { id: 'sera_letter_2', where: 'rumor', once: true, priority: 39, cond: S => !!S.seen.sera_letter_1 && S.circleIdx >= 2, steps: [
    { s: 'sera', t: '"The passes are clear; your raid on the Temple frightened them off. My husband is furious. I have not laughed so much in years. Write back. — S."' },
    { s: 'sera', t: '"P.S. I have read that you are terrifying. I find I would like to verify this in person."' },
  ] };
  E.sera_visits = { id: 'sera_visits', where: 'guild', once: true, priority: 58, cond: S => !!S.seen.sera_letter_2, steps: [
    { s: 'narr', t: 'A woman in a fur-trimmed red gown descends the drowned stair alone, a sealed letter in her gloved hand — this one addressed to herself.' },
    { s: 'sera', t: 'Sera. The Thane\'s wife. (she tears the letter in half without looking at it) My husband thinks I\'m visiting my sister. My sister died eight years ago. He has never once asked.' },
    { flag: 'sera_visits' },
  ] };
  E.recruit_intro_sera = petition('sera', [
    { s: 'sera', t: 'I can give you the Ashreach: every pass, every bribe, every Coven caravan. (a small, sharp smile) And I would like, in exchange, to be somewhere he isn\'t.' },
  ]);
  E.sera_romance = romance('sera', { name: 'Sera', bond: 7, tags: ['married', 'affair'],
    lead: [{ s: 'sera', t: 'He hasn\'t touched me in six years. I used to think I didn\'t mind. (she slips off one glove, finger by finger) I mind.' }],
    choices: [
      { t: 'Take her other glove off for her.', tone: 'dom',
        gentle: 'She shivers when your fingers brush her wrist, and does not let go of your hand all night.',
        steamy: 'You take the other glove off for her, slowly, and she shivers at the brush of your fingers on her wrist — and then she is unlacing the red gown herself, impatient, six years of being unseen burning off her like frost in the sun.' },
    ],
    chronicle: 'Sera took off her gloves.' });
}

// Hooks
export function nightly(S, log) {}
