// ============================================================
// WILDKIN GUESTS — four beast-folk envoys (men, all grown: soft,
// pretty, and very much adults) who come asking for protection.
// Each arrives once you're sworn to, and high in favor with, the
// feminine tribe that hunts or holds his people's land, hoping you'll
// negotiate for them as a friend. You broker a truce with both envoys
// in the room; he then stays in the Envoys' Bower as your guest.
// Romance and evenings follow, and later a shared night with both.
//
// Part of the Wildkin pack. All partners are free, sapient adults who
// choose it on the page; no clutches or brood with the guests.
// ============================================================

import { TRIBES } from '../data.js';
import { guestTruce, guestArrive } from '../state.js';

const mantled = S => !!(S.flags && S.flags.pact_wyrm_mantle);
const tribeHigh = (S, tid, n) => !!(S.tribes && S.tribes[tid] && S.tribes[tid].status === 'sworn' && (S.tribes[tid].favor || 0) >= n);
const riteDone = (S, tid) => !!S.flags[`rite_${tid}`] && tribeHigh(S, tid, 7);
// Intimacy gate: a guest with a standing truce (never a captive).
function guestFree(id, extra = null) {
  const fn = S => !!(S.guests && S.guests[id] && S.guests[id].truce) && !(S.captives || []).some(c => c.named === id) && (!extra || extra(S));
  fn.__tribe = id;
  return fn;
}

export const GUESTS = {
  bramble: { name: 'Bramble', of: 'the Hollow Warren', race: 'Bunny-folk', tribe: 'aerie', color: '#c8d8a8', age: 23,
    desc: 'Bramble, 23, herbalist of the Hollow Warren in the Pale Wood: soft ears, a cottontail, freckles, and a nose that twitches when he lies. The Aerie hunts the Pale Wood. He came anyway.' },
  ren: { name: 'Ren', of: 'the Ember Den', race: 'Fox-folk', tribe: 'pride', color: '#e8945a', age: 26,
    desc: 'Ren, 26, of the Ember Den in the Charmed Glade: a red fox-tail, a sly smile, and a nickname for everyone. The Lodge hunts his people with the same hounds it set on the Sunrun Pride.' },
  elio: { name: 'Elio', of: 'the Snowline Herd', race: 'Fawn-folk', tribe: 'clutch', color: '#d8b890', age: 24,
    desc: 'Elio, 24, of the Snowline Herd in the Ashreach: velvet antlers, dappled freckles, big dark eyes, and a soft voice. His people are sacred to the Pale Stag, and hunted by the Clutch.' },
  tallow: { name: 'Tallow', of: 'the Lantern Court', race: 'Moth-folk', tribe: 'coil', color: '#e8e0c8', age: 27,
    desc: 'Tallow, 27, courtier of the Lantern Court over the Black Mire: a fluffy collar, feathery antennae, dusty soft wings, and an unfortunate weakness for candles. The Coil hunts the Mire\'s air.' },
};
export const GUEST_IDS = Object.keys(GUESTS);

export const looks = {
  bramble: { skin: 0xf6dcc4, hair: 0xe8dcc8, hairstyle: 'curly', outfit: 0x8ab88a, sleeve: 0x8ab88a, legColor: 0x6a5a4a, eyeColor: 0x6a4a2a, ears: 'rabbit', tail: 'puff', tailColor: 0xf4efe6, freckles: true, build: 'slim', chest: 0, apron: 0xe8dcc0 },
  ren: { skin: 0xf2d4bc, hair: 0xd87c3a, hairstyle: 'straight', outfit: 0x5a2a3a, sleeve: 0x5a2a3a, legColor: 0x2a1a1e, eyeColor: 0xe8a82a, eyeGlow: true, ears: 'fox', tail: 'fox', build: 'slim', chest: 0, ribbons: 0xd8b04a },
  elio: { skin: 0xe8c8a8, hair: 0x8a5a3a, hairstyle: 'short', outfit: 0xd8c8a8, sleeve: 0xd8c8a8, legColor: 0x6a4a2a, eyeColor: 0x2a1a14, antlers: true, hornColor: 0xcbb48a, ears: 'cat', freckles: true, furMantle: 0xf0e8dc, build: 'slim', chest: 0 },
  tallow: { skin: 0xece4f0, hair: 0xf0ecdc, hairstyle: 'curly', outfit: 0x8a7a9a, sleeve: 0x8a7a9a, legColor: 0x4a3a5a, eyeColor: 0x2a2a3a, antennae: true, accent: 0xffd24a, wings: true, wingColor: 0xd8d0b8, wingSize: 0.55, furMantle: 0xf4f0e4, build: 'slim', chest: 0 },
};
export const speakers = Object.fromEntries(Object.entries(GUESTS).map(([id, g]) => [id, { name: `${g.name} of ${g.of.replace(/^the /, 'the ')}`, color: g.color }]));

// Bower talk: four lines each, rotated.
export const GUEST_TALK = {
  bramble: [
    "(arranging dried herbs on the Bower sill, ears twitching every time a harpy lands on the roof) I'm fine. I'm fine! They promised. I'm just... very aware of the sky now.",
    "I brought you willowbark for headaches and chamomile for sleeping. (his nose twitches) And a little bundle of clover. That one's just because.",
    "Kestra waved at me today. Waved. With a talon. (a breathless laugh) I didn't even run. Well. I ran a little.",
    "The Warren sends their thanks. Mostly in the form of carrot cake. I tried to stop them. (he didn't try very hard)",
  ],
  ren: [
    "(lounging across the Bower's best cushion, tail flicking) Hello, my favorite warlock. Don't tell the others I said favorite. I tell all of them that. (he doesn't)",
    "The Lodge's hounds came sniffing round the Glade last week. Tashra's cats ran them all the way to the river. (a satisfied grin) I've never seen anything so beautiful.",
    "I could pick your pocket right now, you know. (he holds up your own ring, then slides it back on your finger, slowly) I won't. I just like you knowing I could.",
    "Everyone thinks foxes don't get scared. (his ears go flat for a moment) Foxes are just very good at smiling while they are.",
  ],
  elio: [
    "(sitting very still the way his people do, then remembering he doesn't have to) The snowline was quiet last night. Nobody watching the sky for wings. I slept the whole night through.",
    "Vharra brought the Herd a hoard-gift. Three copper bells. (a small, astonished smile) I think it was an apology. Drake-kin don't know how to say sorry, so they give you shiny things.",
    "The Pale Stag walked through my dream again. It looked at you, and then at me, and then it seemed... satisfied.",
    "Can I just sit here a while? You're very calm to be near. It's like standing in a clearing.",
  ],
  tallow: [
    "(drifting toward the Bower lantern, then catching himself) I'm not going to touch it. I'm not. I'm simply admiring it. From a responsible distance.",
    "Sythra sends the Court a lantern every new moon now, to say the truce still holds. (wings fluttering) She hung the last one herself. With her tail. It was terribly elegant.",
    "Your candles are the warmest in the city. Every moth in the Court knows it. (shyly) I suppose that's why I came first.",
    "In the Lantern Court we bow by dimming our wings. (he does it, slowly) There. Now you know how to tell when one of us is being sincere.",
  ],
};

function arrive(id, o) {
  const g = GUESTS[id], T = TRIBES[g.tribe];
  return {
    id: `${id}_arrives`, where: 'auto', once: true, priority: 71,
    steps: [
      ...o.lines.map(t => ({ s: t[0], t: t[1] })),
      { do: S => guestArrive(S, id) },
      { s: 'codex', t: `[ ${g.name.toUpperCase()} OF ${g.of.toUpperCase()} has come under a white flag. He waits in the Envoys' Bower. Talk to broker a truce with ${T.envoyName}. ]` },
    ],
  };
}

function truce(id, o) {
  const g = GUESTS[id], T = TRIBES[g.tribe];
  return {
    id: `${id}_truce`, where: 'guild', once: true, priority: 56,
    cond: S => !!(S.guests && S.guests[id] && S.guests[id].here) && !S.guests[id].truce,
    steps: [
      ...o.open.map(t => ({ s: t[0], t: t[1] })),
      { choice: [
        { t: o.protect, tone: 'dom', r: [...o.protectR.map(t => ({ s: t[0], t: t[1] })), { do: S => guestTruce(S, id) }] },
        { t: o.price, tone: 'kind', r: [...o.priceR.map(t => ({ s: t[0], t: t[1] })), { do: S => guestTruce(S, id) }] },
        { t: `Let ${g.name} speak for ${g.of}.`, tone: 'kind', r: [...o.speakR.map(t => ({ s: t[0], t: t[1] })), { do: S => guestTruce(S, id) }] },
      ] },
      { s: 'codex', t: `[ TRUCE — ${T.name} and ${g.of.replace(/^the /, 'the ')}. ${g.name} stays in the Envoys' Bower as your guest. ]` },
      { chronicle: `You brokered a truce between ${T.name} and ${g.of}.` },
    ],
  };
}

function romance(id, o) {
  return {
    id: `${id}_romance`, where: 'bower', once: true,
    cond: guestFree(id, S => (S.guests[id].favor || 0) >= 5),
    tags: o.tags,
    steps: [
      ...o.lead.map(t => ({ s: id, t })),
      { choice: o.choices.map(c => ({ t: c.t, tone: c.tone, r: [
        ...(c.r ? [{ s: id, t: c.r }] : []),
        { s: 'narr', cond: mantled, t: o.mantle },
        { s: 'narr', t: c.gentle, spice: 'gentle' },
        { s: 'narr', t: c.steamy, spice: 'steamy' },
        { s: 'narr', t: '', spice: 'unbound', stub: `${id}_romance` }, // ZOE: unbound
      ] })) },
      { chronicle: o.chronicle },
    ],
  };
}

function evening(id, o) {
  return {
    id: `${id}_evening`, where: 'bower', once: false,
    cond: guestFree(id, S => !!S.seen[`${id}_romance`]),
    tags: ['repeatable'],
    steps: [
      { s: id, t: o.ask },
      { choice: [
        { t: 'Spend the night with him.', r: [
          { s: 'narr', t: o.gentle, spice: 'gentle' },
          { s: 'narr', t: o.steamy, spice: 'steamy' },
          { s: 'narr', t: '', spice: 'unbound', stub: `${id}_evening` }, // ZOE: unbound
        ] },
        { t: '"Just stay and talk tonight."', r: [{ s: id, t: o.talk }] },
      ] },
    ],
  };
}

function shared(id, o) {
  const g = GUESTS[id];
  return {
    id: `${id}_shared`, where: 'guild', once: true, priority: 53,
    cond: guestFree(id, S => !!S.seen[`${id}_romance`] && (S.guests[id].favor || 0) >= 8 && riteDone(S, g.tribe)),
    tags: ['group', 'monster', 'sapient partners'],
    steps: [
      ...o.lead.map(t => ({ s: t[0], t: t[1] })),
      { choice: [
        { t: o.yes, r: [
          { s: 'narr', cond: mantled, t: o.mantle },
          { s: 'narr', t: o.gentle, spice: 'gentle' },
          { s: 'narr', t: o.steamy, spice: 'steamy' },
          { s: 'narr', t: '', spice: 'unbound', stub: `${id}_shared` }, // ZOE: unbound
        ] },
        { t: '"Not tonight. Stay up here with me anyway."', r: [{ s: 'narr', t: o.no }] },
      ] },
      { chronicle: o.chronicle },
    ],
  };
}

export function events(E) {
  // ===================== BRAMBLE — bunny-folk, via the Aerie =====================
  E.bramble_arrives = arrive('bramble', { lines: [
    ['narr', 'Someone is knocking on the drowned library\'s door: very fast, very quietly, and then not at all, as if they\'ve lost their nerve. When you open it, a young man with long cream-colored rabbit ears and a basket of herbs is halfway down the stair, running.'],
    ['bramble', '(freezing, ears straight up) Oh! Oh. You\'re — hello. I\'m Bramble, of the Hollow Warren. In the Pale Wood. Under the — under the high branches. Where the harpies hunt.'],
    ['bramble', 'Everyone in the Wood says Kestra of the Aerie listens to you. That you\'re her friend. (his nose twitches, frantic) Could you ask her... to stop eating us? Please? We\'d be very grateful. We have herbs.'],
  ] });
  E.bramble_truce = truce('bramble', {
    open: [
      ['narr', 'Kestra lands on the reading table. Bramble goes so still he might be a painting of a rabbit.'],
      ['kestra', '(head tilted, bright-eyed, interested in a way that is not helping) Rabbits are food, warlock. The Aerie has hunted the Warren since before your library drowned.'],
      ['bramble', '(very small, very brave) We know. We were hoping you could be the reason that changes.'],
    ],
    protect: '"The Warren is under my protection now. Hunt elsewhere."',
    protectR: [['kestra', '(a long, considering look at you, then a shrug of the wings) For you? Fine. The Pale Wood has deer and fat pigeons. (to Bramble) Lucky rabbit.'], ['bramble', '(whispering) Lucky. (louder, to you) Thank you. Thank you.']],
    price: '"What would the Aerie want in exchange?"',
    priceR: [['kestra', 'Herbs. The Warren\'s healers know the Pale Wood\'s roots better than the nest-mothers. Feather-rot medicine every moon, and the Aerie forgets the taste of rabbit.'], ['bramble', '(already counting on his fingers) We can do that. We can absolutely do that.']],
    speakR: [['bramble', '(taking a shaking breath) We can\'t fly and we can\'t fight. But we can see the Lodge\'s snares before anyone. We\'ll be the Aerie\'s eyes on the ground.'], ['kestra', '(delighted) A brave rabbit. I didn\'t know there was such a thing. (she offers a talon; he shakes it) Truce.']],
  });
  E.bramble_romance = romance('bramble', { tags: ['romance', 'shy', 'femboy'],
    lead: ['(holding out a sprig of clover, ears pink at the roots) In the Warren, you give clover to someone you want to share a burrow with. I\'ve been carrying this around for a week. (his nose twitches) I\'m not lying. You can check.', 'I\'m not brave. But I came here alone through harpy country to ask a warlock for help, so I think I can ask you this.'],
    choices: [
      { t: 'Take the clover, and him.', tone: 'kind', r: '(a startled, wonderful laugh) Oh. Oh, okay.',
        gentle: 'He curls into you like he\'s finally found somewhere the sky can\'t reach, ears soft against your cheek, and falls asleep before he can stop smiling.',
        steamy: 'He\'s shy for exactly as long as it takes you to kiss him, and then he isn\'t: soft and eager and quick, ears flushed pink, his cottontail twitching every time you touch him, until he forgets entirely to be afraid of anything.' },
      { t: '"Come here, Bramble. I\'ve got you."', tone: 'dom', r: '(his ears go flat with relief, then straight up again) Yes. Yes, please.',
        gentle: 'You hold him, and for the first time since he left the Warren he stops listening for wings.',
        steamy: 'You hold him down in the soft Bower straw and he melts under your hands, all freckles and flushed ears, gasping your name like he\'s been waiting his whole life for someone to catch him and be gentle about it.' },
    ],
    mantle: 'When your Mantle unfurls he jumps, then stares, then reaches out to touch a wing with enormous care. "You\'re a predator too," he whispers. "And you\'re safe."',
    chronicle: 'Bramble of the Hollow Warren gave you clover.' });
  E.bramble_evening = evening('bramble', {
    ask: '(holding out another sprig of clover, ears pink) I brought more. Can I stay tonight?',
    gentle: 'He falls asleep tucked into your side, ears twitching through a dream about clover fields with no sky over them.',
    steamy: 'He\'s braver every time: soft and eager, cottontail twitching, laughing breathlessly into your neck until the Bower lantern burns down.',
    talk: '(curling up beside you) Okay. Tell me about the strangest thing you\'ve ever seen in the Wood. I\'ll tell you which herbs grow there.',
  });
  E.bramble_shared = shared('bramble', {
    lead: [
      ['narr', 'Kestra has taken to perching outside Bramble\'s window in the Bower. "Guarding him," she says. Bramble has stopped flinching. Tonight, he asked her in.'],
      ['kestra', '(half-perched on the Bower rail, wings mantling) The rabbit says he wants us both. (a delighted, toothy smile) I\'ve never been asked by a rabbit before. I find I like it.'],
      ['bramble', '(red to the ears, very determined) I do. Both of you. If you want.'],
    ],
    yes: 'Bring them both into the Bower tonight.',
    mantle: 'Your Mantle unfurls, and now there are two pairs of wings sheltering the shyest person in the room.',
    gentle: 'Kestra wraps her wings around both of you, and Bramble falls asleep between a harpy and a warlock, completely unafraid.',
    steamy: 'Under Kestra\'s wings and your hands, the rabbit who crossed harpy country to ask for help finds out exactly how good it feels to be wanted by both, all feathers and flushed ears and laughter.',
    no: 'Kestra tucks Bramble under one wing anyway, and the three of you watch the Pale Wood go dark together.',
    chronicle: 'Bramble and Kestra shared your Bower.',
  });

  // ===================== REN — fox-folk, via the Pride =====================
  E.ren_arrives = arrive('ren', { lines: [
    ['narr', 'A red fox-tail is draped over the arm of your reading chair. Attached to it, lounging as if he lives here, is a slim young man with sharp amber eyes and a smile like a lockpick.'],
    ['ren', 'Ren, of the Ember Den. Don\'t get up. (he doesn\'t either) I let myself in. Your door has an opinion about foxes, but I have better opinions.'],
    ['ren', 'The Lodge hunts my people with the same hounds it set on the Sunrun Pride. And Tashra, I hear, would walk into a fire for you. (his ears go flat for one second) So. Would you introduce me? As a friend?'],
  ] });
  E.ren_truce = truce('ren', {
    open: [
      ['narr', 'Tashra arrives at a run, stops dead at the sight of a fox in your chair, and her tail lashes once.'],
      ['tashra', 'The Glade is ours. The Den keeps stealing from our kills. (she grins, sharp) Usually we chase them off. Sometimes we don\'t stop at off.'],
      ['ren', '(smiling very hard) And sometimes the Den leads the Lodge\'s hounds away from your cubs, and nobody says thank you. Which I am now mentioning. Casually.'],
    ],
    protect: '"The Den is under my protection. The Glade is big enough for both of you."',
    protectR: [['tashra', '(a long look at you, then an easy shrug) For you, sure. (to Ren) Don\'t touch our kills.'], ['ren', '(the smile finally becoming real) I would never. (he absolutely would, and she knows it)']],
    price: '"What would the Pride need from the Den?"',
    priceR: [['tashra', 'Eyes on the Lodge. Foxes get everywhere. Tell us where the hounds sleep, and we\'ll keep them busy.'], ['ren', 'Done. We already know. (a slow grin) We\'ve been waiting for someone to ask.']],
    speakR: [['ren', '(sitting up, all the lounging gone) We\'re small and we\'re clever and we\'re tired of being clever alone. Let the Den run with the Pride. We\'ll be the ones who know where the hunters are before they do.'], ['tashra', '(a slow, approving blink) A fox who means it. Fine. Run with us.']],
  });
  E.ren_romance = romance('ren', { tags: ['romance', 'flirt', 'femboy'],
    lead: ['(turning your own ring over in his fingers) I\'ve stolen a lot of things. Hearts, mostly. It\'s easy when nobody means it. (he puts the ring back on your hand, slowly) I mean this one. That\'s new. I don\'t like it. I like it a lot.', 'So I\'m asking, which foxes never do: will you have me?'],
    choices: [
      { t: '"Yes. And stop hiding behind the smile."', tone: 'kind', r: '(the smile cracks; something softer looks out) ...Okay. No smile. Just me.',
        gentle: 'He curls around you, tail over both of you like a blanket, and for once doesn\'t say anything clever at all.',
        steamy: 'Without the smile to hide behind he\'s all sharp angles and soft sounds, tail curling around your thigh, teasing right up until he can\'t, then breathless and honest and entirely yours.' },
      { t: 'Catch his wrist before he can steal anything else.', tone: 'dom', r: '(ears flat, grinning, caught) Oh, you\'re good. Oh, that\'s not fair.',
        gentle: 'You don\'t let go of his wrist all night. He doesn\'t ask you to.',
        steamy: 'You pin the thief by the wrists and he laughs, then gasps, then stops laughing entirely, his clever mouth finally out of clever things to say as you take him apart slowly.' },
    ],
    mantle: 'Your Mantle unfurls and Ren\'s ears go straight up. "Oh," he says softly. "You\'re the hound, and I still want you. That\'s new too."',
    chronicle: 'Ren of the Ember Den stopped stealing, mostly.' });
  E.ren_evening = evening('ren', {
    ask: '(sprawled across your bed before you\'ve even asked) I stole your pillow. Come get it.',
    gentle: 'He falls asleep with his tail across your chest and your pillow under his chin, extremely pleased with himself.',
    steamy: 'He makes you work for it, teasing and sly and slippery, until you catch him, and then he\'s soft and gasping and very glad to be caught.',
    talk: '(propping his chin on his hands) Tell me a secret. I\'ll tell you a better one. That\'s how foxes flirt. And talk. Same thing.',
  });
  E.ren_shared = shared('ren', {
    lead: [
      ['narr', 'Ren and Tashra have been racing each other around the Glade every morning. Ren loses every time. He says it\'s on purpose. Tonight they both turn up at your door.'],
      ['tashra', '(tail swaying) The fox says the Pride hunts in packs. (a sharp grin) He wants to know if that goes for other things too.'],
      ['ren', '(ears flushed, smile wobbly and real) I did say that. I meant it. Both of you?'],
    ],
    yes: 'Run with both of them tonight.',
    mantle: 'Your Mantle unfurls and Tashra purrs; Ren stares, then laughs, delighted to be the smallest predator in the room.',
    gentle: 'Out in the long grass, the fox and the cheetah fall asleep tangled on either side of you, both tails over you like a blanket.',
    steamy: 'Out in the long grass Tashra chases and Ren teases, and between them they make you the prize of a hunt nobody wants to end, all purrs and red fur and breathless, wicked laughter.',
    no: 'The three of you lie in the grass and watch the stars, and Ren tells Tashra every Den secret, and she tells him every Pride one.',
    chronicle: 'Ren and Tashra ran together, with you.',
  });

  // ===================== ELIO — fawn-folk, via the Clutch =====================
  E.elio_arrives = arrive('elio', { lines: [
    ['narr', 'Someone has been standing very still at the bottom of the drowned stair for an hour. When you finally notice, a slender young man with dappled freckles and small velvet antlers bows so deeply his antlers nearly touch the water.'],
    ['elio', 'Elio, of the Snowline Herd. Forgive me. My people stand still when we\'re afraid. I\'ve been very afraid for about an hour.'],
    ['elio', 'The Clutch hunts the snowline. They take one of us each winter, and the Pale Stag weeps. They say Vharra of the Clutch would burn the world for you. (softly) Would you ask her to burn a little less of it?'],
  ] });
  E.elio_truce = truce('elio', {
    open: [
      ['narr', 'Vharra climbs the stair, wings folded, and stops. Elio goes perfectly, beautifully still.'],
      ['vharra', '(not unkindly, but honestly) Drake-kin hunt the snowline. It\'s what we are, deer. Winter is long and the hatchery is hungry.'],
      ['elio', '(barely breathing) I know. I came anyway. That should count for something.'],
    ],
    protect: '"The Herd is mine to protect now. The Clutch hunts elsewhere."',
    protectR: [['vharra', '(a long look at you, then a respectful nod, blade to blade) For you, then. The snowline is yours. (to Elio) Your Stag can stop weeping.'], ['elio', '(bowing so low his antlers touch the floor) Thank you. Thank you, both.']],
    price: '"What would feed the hatchery instead?"',
    priceR: [['vharra', 'Wyrm-frost and cold-water fish. The Herd knows where the frozen rivers run deep. Show us, and we\'ll forget the taste of deer.'], ['elio', 'We know every one. (a shy, astonished smile) We\'ll show you all of them.']],
    speakR: [['elio', '(stepping forward, antlers high) We can\'t fight you. But the Herd has watched the snowline for a thousand years. We know where the wyrms sleep and where the ice will break. Let us guard the Clutch\'s hatchery in winter.'], ['vharra', '(surprised into a fanged grin) A brave deer. Strength is in many shapes, it seems. Truce.']],
  });
  E.elio_romance = romance('elio', { tags: ['romance', 'gentle', 'femboy'],
    lead: ['(standing very still, then deliberately not) My people freeze when we\'re afraid. I\'m afraid now. But I\'m choosing not to freeze.', 'The Pale Stag showed me your face in a dream. I think it was telling me to stop waiting. (softly) I would like to be yours, if you\'ll have me.'],
    choices: [
      { t: 'Cup his face and kiss him, slowly.', tone: 'kind', r: '(a soft, shaking breath) ...Oh. That\'s what the dream meant.',
        gentle: 'He rests his forehead against yours, antlers gentle, and stays exactly there until he falls asleep.',
        steamy: 'He trembles at the first touch and then leans into every one after, velvet antlers brushing your temple, dappled skin flushing warm, gentle and wondering and then not gentle at all.' },
      { t: '"You don\'t have to be still with me. Come here."', tone: 'dom', r: '(and he does, all at once, like a deer finally running) Yes.',
        gentle: 'He curls into your arms, and the stillness goes out of him completely.',
        steamy: 'You take him down into the soft Bower bedding and he gives himself over completely, every careful stillness of his life undone by your hands, gasping your name like a prayer the Stag taught him.' },
    ],
    mantle: 'Your Mantle unfurls and Elio goes still for one heartbeat, then deliberately steps closer and lays his palm on your scales. "I\'m not afraid of you," he says, amazed. "Not even a little."',
    chronicle: 'Elio of the Snowline Herd stopped standing still.' });
  E.elio_evening = evening('elio', {
    ask: '(at the Bower door, antlers catching the lantern light) The snowline\'s quiet tonight. Will you be quiet with me?',
    gentle: 'He sleeps the whole night through in your arms, which he tells you, every morning, still feels like a miracle.',
    steamy: 'He\'s still gentle, still wondering, but he isn\'t still at all anymore, and the Bower bedding is a ruin by morning.',
    talk: '(settling beside you, very calm) Tell me about the places you\'ve been. I\'ve only ever seen snow and trees. I want to imagine everywhere else.',
  });
  E.elio_shared = shared('elio', {
    lead: [
      ['narr', 'Vharra has started bringing Elio shiny things: copper bells, a silver comb for his antlers, a polished river-stone. "Apologies," she says gruffly. "For a thousand winters." Elio keeps every one.'],
      ['vharra', '(arms crossed, wings twitching, absolutely not blushing) The deer asked if I wanted to... join. You. Both. (a fierce grin) I said I\'d ask you. Drake-kin do things properly.'],
      ['elio', '(soft, certain) I asked her. I want this. Both of you.'],
    ],
    yes: 'Take them both to the warm hatchery.',
    mantle: 'Your Mantle unfurls, and Vharra breathes "kin," and Elio, between two dragons, laughs with pure delight.',
    gentle: 'By the hatchery fires Elio sleeps between drake-kin and warlock, warm for the first winter of his life.',
    steamy: 'By the hatchery fires Vharra is all heat and pride and Elio all gentle wonder, and between them you learn exactly how a fawn and a dragon can make peace, slowly and then not slowly at all.',
    no: 'Vharra wraps her wings around both of you by the fire, and Elio tells you the names of every star the Herd knows.',
    chronicle: 'Elio and Vharra shared the hatchery fire with you.',
  });

  // ===================== TALLOW — moth-folk, via the Coil =====================
  E.tallow_arrives = arrive('tallow', { lines: [
    ['narr', 'Every candle in the reading room gutters at once. When they steady, a young man with dusty, cream-soft wings and a fluffy white collar is hovering a few inches above the floor, staring at the nearest flame like it\'s the most beautiful thing he has ever seen.'],
    ['tallow', '(tearing his eyes away from the candle with visible effort) Forgive me. Tallow, courtier of the Lantern Court, over the Black Mire. Your candles are very — I\'m sorry, I\'ll stop looking at them. I won\'t stop looking at them.'],
    ['tallow', 'The Coil hunts the Mire\'s air. They pluck us from the dark like fruit. And I hear Sythra of the Coil holds you very close. (he dims his wings, slowly: sincerity) Would you ask her to hold us a little less?'],
  ] });
  E.tallow_truce = truce('tallow', {
    open: [
      ['narr', 'Sythra rises from the cistern. Tallow drifts, very slowly, behind the nearest bookshelf.'],
      ['sythra', '(her tongue flickers, interested) Moths are a delicacy in the Coil, warlock. Soft. Sweet. (a slow look at the bookshelf) Very sweet.'],
      ['tallow', '(from behind the bookshelf) Delicacy is a very unkind word for a people with a rich artistic tradition.'],
    ],
    protect: '"The Lantern Court is under my protection. The Coil hunts elsewhere."',
    protectR: [['sythra', '(a slow, amused hiss) For you, I\'ll go hungry for moths. (to the bookshelf) You may come out, lantern.'], ['tallow', '(emerging, wings trembling) Thank you. Truly.']],
    price: '"What would the Coil take instead?"',
    priceR: [['sythra', 'Light. The brood-pools are dark, and the eggs like warmth. The Court\'s lantern-makers could light the pools every night.'], ['tallow', '(wings fluttering with delight) Lanterns? You want lanterns? We would love nothing more in the world.']],
    speakR: [['tallow', '(drifting out, wings dimmed) The Court sees everything in the Mire at night. Every intruder, every hunter, every lost egg. Let us be the Coil\'s night-watch, and we\'ll guard your brood-pools in the dark.'], ['sythra', '(a pleased, slow hiss) A sincere moth. I had no idea. Truce, lantern.']],
  });
  E.tallow_romance = romance('tallow', { tags: ['romance', 'dreamy', 'femboy'],
    lead: ['(drifting closer to you instead of the candle, which he has never once done before) My people are drawn to the warmest light in the dark. Everyone says it\'s foolish.', '(he dims his wings, very slowly) The warmest light in this city isn\'t a candle. It\'s you. May I come closer?'],
    choices: [
      { t: '"Come here, lantern."', tone: 'kind', r: '(a delighted, fluttering laugh) Oh, you\'ve been listening to Sythra.',
        gentle: 'He settles against you, wings folding soft around you both, and hums in his sleep like a moth beside a lamp.',
        steamy: 'He drifts into your arms and doesn\'t drift away again: soft wings trembling, fluffy collar brushing your throat, sweet and dramatic and utterly, sincerely undone.' },
      { t: 'Catch him by the wrist and pull him into your light.', tone: 'dom', r: '(wings flaring, then folding, then dimming) Yes. Oh, yes, please, don\'t let go.',
        gentle: 'You don\'t let go. He falls asleep held, and for once doesn\'t dream about candles.',
        steamy: 'You pull him close and he burns for it, wings shivering wide, every dramatic sigh entirely sincere, giving himself to the one light he never has to keep his distance from.' },
    ],
    mantle: 'Your Mantle unfurls, and Tallow gasps at the wings, then shyly spreads his own beside them to compare. "Yours are much more alarming," he says. "I love them."',
    chronicle: 'Tallow of the Lantern Court found the warmest light.' });
  E.tallow_evening = evening('tallow', {
    ask: '(hovering at your door with a candle in each hand) I brought my own light. Can I stay in yours?',
    gentle: 'He falls asleep with his wings folded over both of you, soft as dust and warm as a lantern.',
    steamy: 'He\'s sweet and dramatic and shivering under your hands, wings fluttering every time you touch him, until he dims them in the slow bow that means he\'s sincere about every second of it.',
    talk: '(settling down beside the lantern) Tell me what the Codex looks like at midnight. I imagine it very often.',
  });
  E.tallow_shared = shared('tallow', {
    lead: [
      ['narr', 'Sythra has started hanging the Court\'s lanterns herself, coiled up the Bower\'s pillars, while Tallow drifts beside her telling her where each one should go. Tonight they come to you together.'],
      ['sythra', '(coils loose, amused) The lantern asked if I would like to share you. (a slow hiss) I said I would very much like to share you.'],
      ['tallow', '(wings dimmed, cheeks flushed) I asked. I meant it. Both of you.'],
    ],
    yes: 'Go down to the lantern-lit brood-pools with them.',
    mantle: 'Your Mantle unfurls in the lantern light, and Sythra hisses with pleasure while Tallow spreads his wings beside yours.',
    gentle: 'In the warm, lantern-lit pools Sythra coils loose around you both, and Tallow falls asleep on your chest, dimming his wings in the slow way that means forever.',
    steamy: 'In the warm, lantern-lit brood-pools Sythra holds you both in gleaming coils while Tallow trembles between you, wings shivering, sweet and sincere, and the three of you make the darkest place in the Mire the warmest.',
    no: 'You sit together by the pools, and Sythra lets Tallow hang every lantern exactly where he wants it.',
    chronicle: 'Tallow and Sythra lit the brood-pools for you.',
  });
}

// Arrivals: high favor with the tribe that hunts their people.
export function nightly(S, log) {
  for (const [id, g] of Object.entries(GUESTS)) {
    if (S.guests && S.guests[id] && S.guests[id].here) continue;
    if (S.seen[`${id}_arrives`] || S.queue.includes(`${id}_arrives`)) continue;
    if (tribeHigh(S, g.tribe, 7)) { S.queue.push(`${id}_arrives`); log && log.push(`${g.name} of ${g.of} is coming to the Codex under a white flag.`); }
  }
}
