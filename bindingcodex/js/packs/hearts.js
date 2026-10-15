// ============================================================
// HEARTS & HEARTH — shared hearts and growing families.
//
// Group scenes: connected lovers who are all free allies, all romanced,
// and all close (bond 8+) find their way to each other — the Inner
// Circle (Vesper, Rue, Isolde, later Lysandre), the Dawnward Company,
// two brats (Rue and Nyxe), two altars (Rhea and Valdra), and the
// Envoys' Council. Each is opt-in, every partner chooses it on the page.
//
// Family: after a few nights together, a partner may come to you and say
// she\'s carrying your child. It\'s always her news and her choice; your
// reply is how you meet it. Births follow, a second child can follow
// that, and the ending gains a hearth.
//
// No intimacy is ever attached to pregnancy, birth or children.
// ============================================================

import { free } from '../story.js';
import { HEROES, TRIBES } from '../data.js';
import { romanced, nightsWith, childrenOf, addChild, expect, packOn, addChronicle } from '../state.js';

const P = 'hearts';
const has = (S, id) => (S.allies || []).includes(id);
const bond = (S, id) => (S.bond && S.bond[id]) || 0;
const mantled = S => !!(S.flags && S.flags.pact_wyrm_mantle);
const close = (S, ids, n = 8) => ids.every(id => romanced(S, id) && bond(S, id) >= n);
const name = id => (HEROES[id] && HEROES[id].name) || id;

// ============================================================
// GROUP SCENES
// ============================================================

function circle(E) {
  const three = ['vesper', 'rue', 'isolde'];
  E.circle_talk = {
    id: 'circle_talk', where: 'camp', once: true, priority: 49,
    cond: free(...three, S => three.filter(id => romanced(S, id) && bond(S, id) >= 8).length >= 2),
    steps: [
      { s: 'narr', t: 'You come back to the fire to find it gone strangely quiet: the specific quiet of a conversation that stopped the instant you got close. Vesper is very interested in a book that is upside down. Rue is very interested in her own tail. Isolde is simply looking at you.' },
      { s: 'rue', t: 'We weren\'t talking about you. (the brand blazes so bright it lights the whole camp) ...Ow. Okay. We were talking about you.' },
      { s: 'vesper', t: '(turning the book the right way up, with dignity) Comparing notes. It transpires there is considerable overlap.' },
      { s: 'isolde', t: 'None of us is angry. (she says it like a vow) I thought you should hear that first.' },
      { choice: [
        { t: '"I won\'t lie to any of you. I couldn\'t choose between you if the Codex depended on it."', tone: 'kind', bond: { vesper: 1, rue: 1, isolde: 1 }, r: [
          { s: 'vesper', t: 'Good. I\'ve read three hundred years of pacts that ended badly because someone was made to choose. (softly) I\'d rather we didn\'t.' },
          { s: 'rue', t: 'So nobody picks? Everybody just... stays? (the brand stays dark; she looks almost frightened by how much she means it) ...I\'d like that.' },
        ] },
        { t: '"There was never a choice to make. You\'ve all been mine for a while. I was waiting for you to say it to each other."', tone: 'dom', bond: { rue: 2, isolde: 1, vesper: 1 }, r: [
          { s: 'rue', t: '(a sound like a kettle) SAY it like that again.' },
          { s: 'isolde', t: '(very quietly, to the fire) Yes. That is what it is.' },
          { s: 'vesper', t: 'Presumptuous. Accurate. (she shuts the book) The Chronicle is going to be insufferable about this.' },
        ] },
        { t: '"Talk to each other, not around me. Whatever this becomes, you decide it together."', tone: 'kind', bond: { isolde: 1, vesper: 1 }, r: [
          { s: 'narr', t: 'So they do. Late into the night, three people who have each spent a long time alone in their own way learn that they never had to be alone from each other.' },
        ] },
      ] },
    ],
  };
  E.circle_pact = {
    id: 'circle_pact', where: 'camp', once: true, priority: 50,
    cond: free(...three, S => !!S.seen.circle_talk && close(S, three)),
    tags: ['group', 'polyamory', 'dominance (optional)'],
    steps: [
      { s: 'narr', t: 'They ambush you after a clear, all three, arranged with suspicious deliberateness. Vesper has clearly been appointed to speak because Vesper is hardest to fluster, and even she has ink on her cheek from fidgeting.' },
      { s: 'vesper', t: 'We have deliberated. Rue wanted a duel. Isolde wanted an oath. I wanted a footnote. (she smiles) We settled on telling you.' },
      { s: 'isolde', t: 'We will not give you up. And we will not give each other up. (she kneels, and does not seem to notice she has done it) We would keep all of it.' },
      { s: 'rue', t: 'All of us. All of you. Every night, everyone. (the brand is utterly dark) ...That one\'s true. They\'re all true. I checked.' },
      { choice: [
        { t: '"Then it\'s decided. All of us, all in, nobody at the edge."', tone: 'kind', flag: 'circle_formed', bond: { vesper: 1, rue: 1, isolde: 1 }, r: [
          { s: 'narr', t: 'Rue tackles you into a hug that drags Isolde in by the arm and Vesper by the collar, protesting all the way. Somewhere in the pile, someone is laughing; it takes you a moment to realize it\'s Isolde.' },
          { s: 'narr', t: 'They take you to bed together, and it is warm and clumsy and full of laughter, and nobody is at the edge at all.', spice: 'gentle' },
          { s: 'narr', t: 'They take you to bed together, and it\'s clumsy for exactly as long as it takes them to stop being polite: Vesper feeling every touch through the Binding twice over, Rue forge-hot and shameless, Isolde giving herself to all three of you with the total devotion she once gave an Order, and you at the center of it, wanted from every side.', spice: 'steamy' },
          { s: 'narr', t: '', spice: 'unbound', stub: 'circle_pact_1' }, // ZOE: unbound
        ] },
        { t: '"Kneel. All three of you." Then take what\'s yours.', tone: 'dom', flag: 'circle_formed', bond: { vesper: 1, rue: 2, isolde: 2 }, r: [
          { s: 'narr', t: 'Isolde is already kneeling. Rue drops to her knees so fast her tail thumps the floor. Vesper looks at you for a long, considering moment, and then, with enormous dignity, kneels too.' },
          { s: 'narr', t: 'You raise them up one at a time, and keep them close until morning.', spice: 'gentle' },
          { s: 'narr', t: 'You take them one at a time and then all at once: the knight who wants to be commanded, the demon who wants to be put in her place, the archivist who wants, for once, to stop being the one in control, and every one of them gets exactly what she asked for.', spice: 'steamy' },
          { s: 'narr', t: '', spice: 'unbound', stub: 'circle_pact_2' }, // ZOE: unbound
        ] },
      ] },
      { chronicle: 'Vesper, Rue and Isolde chose you, and each other. The Inner Circle.' },
    ],
  };
  E.circle_morning = {
    id: 'circle_morning', where: 'camp', once: true, priority: 47,
    cond: free(...three, S => !!S.flags.circle_formed),
    steps: [
      { s: 'narr', t: 'You wake in the middle of everything: Vesper\'s ink-stained hand on your chest, Rue\'s tail wound around your ankle like a claim, Isolde at your back, asleep with her scarred palms open for once.' },
      { s: 'rue', t: '(eyes shut, voice wrecked) Nobody move. That\'s an order. I\'ve never once slept through a whole night and I\'m finishing this one.' },
      { s: 'isolde', t: 'The watch can keep itself. (muffled) I have decided.' },
      { s: 'vesper', t: '(not opening her eyes) The Chronicle wrote a page about this at three in the morning. I\'m not reading it. I already know what it says.' },
    ],
  };
  E.circle_night = {
    id: 'circle_night', where: 'camp', once: true, priority: 47,
    cond: free(...three, S => !!S.flags.circle_formed && close(S, three, 9)),
    tags: ['group', 'dominance', 'devotion', 'honesty play'],
    steps: [
      { s: 'narr', t: 'The Drowned Stacks, after midnight. Rue has invented a game. The rules are: you ask a question, and the brand on her wrist decides whether the answer counts.' },
      { s: 'rue', t: 'Truth or truth. (she grins) Ask me what I want. Go on. I can\'t lie. That\'s the fun part.' },
      { s: 'vesper', t: 'And I\'ll know exactly how you feel about every answer. (she taps the sigil at her wrist) Which is either the best or worst idea anyone\'s had in this library.' },
      { s: 'isolde', t: '(already unbuckling her gauntlets) I will answer too. Whatever you ask. (she does not look away from you) I have nothing left to hide.' },
      { choice: [
        { t: 'Take command of all three of them.', tone: 'dom', r: [
          { s: 'narr', t: 'You ask, and they answer, and every honest answer is an order you get to give.', spice: 'gentle' },
          { s: 'narr', t: 'You ask, and they answer, and the brand never flares once. Rue tells you exactly what she wants and gets it; Isolde kneels and asks for orders and gets them; Vesper feels all of it through the Binding at once and comes apart laughing. You run the whole night like a ritual, and they let you.', spice: 'steamy' },
          { s: 'narr', t: '', spice: 'unbound', stub: 'circle_night_1' }, // ZOE: unbound
        ] },
        { t: 'Let them take you apart.', tone: 'kind', r: [
          { s: 'narr', t: 'For once it\'s you who answers every question, and you who is held.', spice: 'gentle' },
          { s: 'narr', t: 'They turn the game on you. Every question is about what you want, and every true answer is something they give you, three pairs of hands and three voices and nothing held back, until you can\'t tell whose question it was.', spice: 'steamy' },
          { s: 'narr', t: '', spice: 'unbound', stub: 'circle_night_2' }, // ZOE: unbound
        ] },
      ] },
    ],
  };
  E.circle_mantle = {
    id: 'circle_mantle', where: 'camp', once: true, priority: 46,
    cond: free(...three, S => !!S.flags.circle_formed && mantled(S)),
    tags: ['group', 'monster forms'],
    steps: [
      { s: 'narr', t: 'The Mantle comes over you by the fire without being called: horns, wings, the heavy warm tail. Three heads turn.' },
      { s: 'rue', t: '(tail lashing) Okay, nobody\'s allowed to be calm about this. I\'m not being calm about this.' },
      { s: 'isolde', t: 'The Vigil taught us to kill things that looked like you. (she rises, and walks straight into your wings) They were wrong about so much.' },
      { s: 'vesper', t: '(her sigil blazing) I can feel what it\'s like to have wings. Through you. (a breathless laugh) Don\'t you dare put them away.' },
      { s: 'narr', t: 'Your wings close around all three of them, and the fire goes out on its own.', spice: 'gentle' },
      { s: 'narr', t: 'Your wings close around all three of them like a tent, and the night is horns and scale and heat: Rue meeting you demon to monster, Isolde worshipping the storm she was trained to fear, Vesper feeling every inch of the Mantle through the Binding and losing her words entirely.', spice: 'steamy' },
      { s: 'narr', t: '', spice: 'unbound', stub: 'circle_mantle' }, // ZOE: unbound
    ],
  };
  E.circle_lysandre = {
    id: 'circle_lysandre', where: 'camp', once: true, priority: 46,
    cond: free(...three, 'lysandre', S => !!S.flags.circle_formed && romanced(S, 'lysandre') && bond(S, 'lysandre') >= 8),
    tags: ['group', 'shapeshifting', 'monster forms'],
    steps: [
      { s: 'narr', t: 'Lysandre sits a little apart from the fire, out of old habit, in a shape that is mostly girl and slightly drake.' },
      { s: 'lysandre', t: 'I\'ve been the odd one in every shape I\'ve ever worn. (she laughs, not quite steady) I keep thinking there\'s a version of this with no room for me.' },
      { s: 'rue', t: '(dragging Lysandre\'s bedroll into the circle by one corner) Yeah, well, there isn\'t. We voted. I threatened everyone.' },
      { s: 'vesper', t: 'The circle isn\'t a line you earn your way to the end of. (she makes room) It just keeps having room. That\'s the whole point.' },
      { choice: [
        { t: '"Come in, Lysandre. In whatever shape you like."', tone: 'kind', flag: 'circle_five', bond: { lysandre: 2 }, r: [
          { s: 'lysandre', t: '(shifting, scales flowing into skin and back as she settles into the middle) ...Oh. So this is what the middle feels like.' },
          { s: 'narr', t: 'Five now, and not a single edge left anywhere.', spice: 'gentle' },
          { s: 'narr', t: 'Five now, and Lysandre discovers how many shapes there are for being wanted: coiled around Isolde, winged against Rue, every form greeted with delight, until she stops shifting at all because she doesn\'t need to.', spice: 'steamy' },
          { s: 'narr', t: '', spice: 'unbound', stub: 'circle_lysandre' }, // ZOE: unbound
        ] },
      ] },
    ],
  };
}

function dawnward(E) {
  const four = ['erin', 'sakura', 'shiro'];
  E.dawnward_hearts_talk = {
    id: 'dawnward_hearts_talk', where: 'camp', once: true, priority: 49,
    cond: free(...four, S => !!S.flags.dawnward_bent && four.filter(id => romanced(S, id) && bond(S, id) >= 8).length >= 2),
    steps: [
      { s: 'narr', t: 'Shiro has produced a document. It has columns. The heading reads, in her immaculate hand: THE DAWNWARD COMPANY — REVISED ARRANGEMENTS.' },
      { s: 'erin', t: '(upside down off the reading-room couch) She made a CHART. About you. About all of us and you.' },
      { s: 'sakura', t: '(scarlet, from under her hat) It\'s a very good chart. There\'s — there\'s a column for everyone.' },
      { s: 'shiro', t: 'We each discovered we had fallen for the warlock we were sent to stop. (dry) Statistically embarrassing. Practically: none of us wants to compete. We would like to continue as a company. Of five.' },
      { s: 'yuki', cond: S => has(S, 'yuki'), t: '(very quietly) Everyone deserves a second chance. I think this is ours. All of ours.' },
      { choice: [
        { t: '"Approve the chart. One amendment: the everyone column gets priority."', tone: 'kind', bond: { erin: 1, sakura: 1, shiro: 1 }, r: [
          { s: 'erin', t: 'MOTION CARRIES! Shiro, write it down before they get shy!' },
        ] },
        { t: '"You knelt to me once. You don\'t need a chart. You\'re already mine."', tone: 'dom', bond: { erin: 2, shiro: 1, sakura: 1 }, r: [
          { s: 'shiro', t: '(a long pause; then she folds the document in half, and in half again) ...Noted. For the record, I drafted it hoping someone would say that.' },
        ] },
      ] },
    ],
  };
  E.dawnward_hearts = {
    id: 'dawnward_hearts', where: 'camp', once: true, priority: 50,
    cond: free(...four, S => !!S.seen.dawnward_hearts_talk && close(S, four)),
    tags: ['group', 'polyamory', 'bend the knee'],
    steps: [
      { s: 'narr', t: 'A hot spring in the heart of a cleared rift, steam and starlight. The Dawnward Company has entirely stopped pretending they ended up here by accident.' },
      { s: 'erin', t: '(sliding into the water beside you) Rule one of the pool: no Lodge. No rifts. Tonight you\'re just ours, and we\'re just yours.' },
      { s: 'sakura', t: '(hair all the way down, hat nowhere in sight) I used to practice being brave for moments like this. (she crosses the water to you) I don\'t have to practice anymore.' },
      { s: 'shiro', t: '(from your other side, close enough that the words land on your skin) I ran the numbers on wanting like this once and concluded it was a liability. I have never been so glad to be wrong.' },
      { s: 'yuki', cond: S => has(S, 'yuki') && romanced(S, 'yuki') && bond(S, 'yuki') >= 8, t: '(hovering at the edge of the water out of old habit, until Erin reaches out and pulls {Y:them|her} in) ...Oh. Okay. I\'m in. I\'m IN.' },
      { choice: [
        { t: '"The Company knelt to me in the Glade. Kneel again. Here."', tone: 'dom', flag: 'dawnward_formed', r: [
          { s: 'narr', t: 'They kneel in the warm water, laughing, and you raise each of them up in turn.', spice: 'gentle' },
          { s: 'narr', t: 'They kneel in the warm water, and this time nobody is defeated: the golden knight, the petal storm, the White Queen, all of them bending the knee because they want to, and the night belongs to you entirely.', spice: 'steamy' },
          { s: 'narr', t: '', spice: 'unbound', stub: 'dawnward_hearts_1' }, // ZOE: unbound
        ] },
        { t: 'Open your arms and let them all come to you.', tone: 'kind', flag: 'dawnward_formed', r: [
          { s: 'narr', t: 'The steam closes over all of you like a drawn curtain, and there is laughter first, as there always is with them.', spice: 'gentle' },
          { s: 'narr', t: 'The steam closes over all of you like a drawn curtain and stays drawn a long, long time: Erin\'s strength at your back, Sakura\'s fearless hands, Shiro unhurried and certain, and somewhere much later a voice, drowsy and smug: "...Motion carries unanimously."', spice: 'steamy' },
          { s: 'narr', t: '', spice: 'unbound', stub: 'dawnward_hearts_2' }, // ZOE: unbound
        ] },
      ] },
      { chronicle: 'The Dawnward Company became a company of five.' },
    ],
  };
}

function pairs(E) {
  // Two brats: Rue and Nyxe have been nemeses since the Bazaar.
  E.brats = {
    id: 'brats', where: 'camp', once: true, priority: 46, pack: 'northern',
    cond: free('rue', 'nyxe', S => packOn(S, 'northern') && close(S, ['rue', 'nyxe'])),
    tags: ['group', 'bratty', 'rivalry', 'dominance'],
    steps: [
      { s: 'narr', t: 'Rue and Nyxe have been arguing for an hour about which of them you like more. It has escalated to cards, then arm-wrestling, then a contest of who can sit closest to you without technically touching.' },
      { s: 'nyxe', t: 'Tell her. Tell her it\'s me. Say it with your WHOLE mouth.' },
      { s: 'rue', t: 'It\'s obviously me. (the brand flares, faintly) ...It\'s obviously both of us, and I hate that.' },
      { choice: [
        { t: '"Both of you. Put the cards down. Now."', tone: 'dom', r: [
          { s: 'narr', t: 'Two brats go very quiet at exactly the same moment, and then look at each other, and grin.' },
          { s: 'narr', t: 'You put them both in their place, and they fight you for every inch together, and lose together, and like it.', spice: 'gentle' },
          { s: 'narr', t: 'You put them both in their place, and it turns into a contest after all: who can behave worse, who can beg better, two tails and two smart mouths and both of them losing to you, gloriously, over and over.', spice: 'steamy' },
          { s: 'narr', t: '', spice: 'unbound', stub: 'brats_1' }, // ZOE: unbound
        ] },
        { t: 'Let them settle it between themselves, with you as the prize.', tone: 'kind', r: [
          { s: 'narr', t: 'They settle it. It takes all night. Nobody loses.', spice: 'gentle' },
          { s: 'narr', t: 'They settle it the only way two brats can: by trying to out-do each other at pleasing you, until the rivalry dissolves into something much warmer and much louder.', spice: 'steamy' },
          { s: 'narr', t: '', spice: 'unbound', stub: 'brats_2' }, // ZOE: unbound
        ] },
      ] },
    ],
  };
  // Two altars: Rhea worshipped wings on a black spire; Valdra kept rites in the snow.
  E.two_altars = {
    id: 'two_altars', where: 'camp', once: true, priority: 46, pack: 'northern',
    cond: free('rhea', 'valdra', S => packOn(S, 'northern') && close(S, ['rhea', 'valdra'])),
    tags: ['group', 'devotion', 'worship', 'monster forms (with the Mantle)'],
    steps: [
      { s: 'narr', t: 'Rhea and Valdra have built an altar in the old chapel stacks. They will not say to whom. They don\'t need to.' },
      { s: 'valdra', t: 'Ninety years I kept rites in the snow. Rhea kept hers on a spire of black glass. (she lights the last candle) We have agreed whom we keep them for now.' },
      { s: 'rhea', t: '(kneeling, radiant) Let us worship you. Both of us. Together. (softer) Please.' },
      { s: 'narr', cond: mantled, t: 'When the Mantle unfurls, Rhea makes a sound like prayer answered: wings, at last, that are real.' },
      { s: 'narr', t: 'They keep their rite until dawn, two devotions finding a single altar.', spice: 'gentle' },
      { s: 'narr', t: 'The old priestess knows every rite of the body; the zealot knows only how to give everything. Between them, the night is slow, solemn, fervent worship, until you are the only god either of them has ever needed.', spice: 'steamy' },
      { s: 'narr', t: '', spice: 'unbound', stub: 'two_altars' }, // ZOE: unbound
    ],
  };
}

function council(E) {
  const riteDone = (S, tid) => !!(S.flags[`rite_${tid}`] && S.tribes[tid] && S.tribes[tid].status === 'sworn' && (S.tribes[tid].favor || 0) >= 6);
  const fn = S => packOn(S, 'wildkin') && Object.keys(TRIBES).filter(t => riteDone(S, t)).length >= 2;
  fn.__tribe = 'envoys';
  E.envoys_council = {
    id: 'envoys_council', where: 'guild', once: true, priority: 54,
    cond: fn,
    tags: ['group', 'monster', 'sapient partners'],
    steps: [
      { s: 'narr', t: 'The envoys have called a council. They hold it on the library roof under a full moon, and you are the only item on the agenda.' },
      { s: 'kestra', cond: S => riteDone(S, 'aerie'), t: '(perched on the broken skylight) The Aerie shares its high branches. It turns out we\'re willing to share other things too.' },
      { s: 'sythra', cond: S => riteDone(S, 'coil'), t: '(coiled around a chimney) The Coil has held you. The others would like to hold you as well. (a slow hiss) I am feeling generous.' },
      { s: 'vharra', cond: S => riteDone(S, 'clutch'), t: 'Drake-kin hoard. I\'ve decided you\'re a hoard worth sharing. (a fanged grin) Once.' },
      { s: 'tashra', cond: S => riteDone(S, 'pride'), t: '(stretched along the roof ridge, tail swaying) The Pride hunts in a pack. Tonight, so do we.' },
      { s: 'narr', t: 'Every oath stands either way; each of them says so before the moon is fully up. Then they ask.' },
      { choice: [
        { t: 'Join the council.', r: [
          { s: 'narr', cond: mantled, t: 'Your Mantle unfurls and the whole roof goes quiet, and then every tribe at once makes the sound it makes for kin.' },
          { s: 'narr', t: 'Feathers, scales, fur and warm wings under the moon, and every tribe that swore to you keeping you warm until dawn.', spice: 'gentle' },
          { s: 'narr', t: 'Feathers and coils and fur and fire under a full moon: every envoy who chose you, choosing you together, each in her own tribe\'s way, until the roof is a tangle of every kind of wild and you are at the center of all of it.', spice: 'steamy' },
          { s: 'narr', t: '', spice: 'unbound', stub: 'envoys_council' }, // ZOE: unbound
        ] },
        { t: '"Not tonight. But stay for the moon."', r: [
          { s: 'narr', t: 'They stay. Four tribes\' envoys on one roof, trading stories until dawn, and nobody minds at all.' },
        ] },
      ] },
    ],
  };
}

// ============================================================
// FAMILY
// ============================================================

// announce: her news, in her voice. joy / need: her reply to how you meet it.
// names: two names she\'s been thinking about. birth: the day it happens.
// again: the second time she comes to tell you.
const FAMILY = {
  vesper: { announce: ['(closing the Codex very carefully) I need to tell you something, and I\'ve rewritten the first line forty times. (she gives up on all of them) I\'m carrying your child.', 'Three hundred years, and the Chronicle has never once surprised me. It wrote a page this morning that I had to sit down to read.'],
    joy: 'I can feel it through the Binding, you know. How happy you are. (laughing, wet-eyed) It\'s far too much. I want all of it.', need: 'You. And a great many more bookshelves, lower down.',
    names: ['Quill', 'Marginalia'], names2: ['Folio', 'Errata'], birth: 'A small, furious, ink-dark baby, born in the Drowned Stacks with every candle in the Codex leaning in to see.', again: 'The Chronicle wrote another page. (she is smiling before she finishes the sentence) We\'re going to need a second set of lower shelves.' },
  rue: { announce: ['(pacing, tail lashing) Okay. So. I have news and I can\'t lie about it, which is SO inconvenient right now.', 'I\'m pregnant. With yours. (the brand stays completely dark) ...See? True. Say something. Say something nice.'],
    joy: '(the fight goes out of her all at once; she buries her face in your shoulder) ...Okay. Okay. A little hellion. Ours.', need: 'Just — don\'t let me be the Ninth Ember to it. Help me be better than that. (dark brand) I mean it.',
    names: ['Brimstone', 'Ash'], names2: ['Spark', 'Tinder'], birth: 'A tiny, red-skinned, horn-nubbed hellion with a tail that grabs your finger and will not let go.', again: '(grinning before she even speaks) Truth or truth? There\'s another one. (the brand stays dark) Our first one\'s going to be so annoyed.' },
  isolde: { announce: ['(kneeling, which she does when something matters) I have a thing to tell you, and I want to be on my knees for it.', 'I carry your child. (her scarred hands open, steady) I have never been more sure of anything I have sworn.'],
    joy: '(she lets you raise her, and for once she lets herself be held) The Order said I would only ever make war. (quietly) They were wrong about so much.', need: 'Only that you stand beside me. I will do the rest. I always have.',
    names: ['Aldwyn', 'Vow'], names2: ['Oath', 'Rowan'], birth: 'A strong, solemn, wide-eyed child, who grips Isolde\'s scarred finger and does not let go for an hour.', again: 'Another. (she does not kneel this time; she just takes your hands) I wanted to tell you standing up.' },
  lysandre: { announce: ['(her scales shimmering pale gold) Something\'s changed. I\'ve been in every shape I know, and in all of them, there\'s two of us.', 'I\'m carrying your child. (a wondering laugh) I don\'t know what shape it\'ll be. I don\'t think I mind at all.'],
    joy: 'Whatever it is, it\'ll belong. (she curls against you) That\'s the part I never had. It gets to have it.', need: 'Promise you\'ll like whatever shape they pick. Every one.',
    names: ['Tidal', 'Fable'], names2: ['Myth', 'Shoal'], birth: 'A baby who is, as far as anyone can tell, three shapes at once, and settles on whichever one you\'re holding.', again: '(laughing, scales rippling) Two shapes in me again. I think this one likes wings.' },
  erin: { announce: ['(bursting in, still in half her armor) I have to tell you something RIGHT NOW or I\'ll explode.', 'I\'m pregnant! With yours! I\'m going to be a MOTHER and I\'m going to be NOTHING like mine!'],
    joy: '(lifting you clean off the floor) BEST NEWS. BEST DAY. I\'m writing my mother. No — I\'m not. That\'s even better.', need: 'Teach me to be gentle. I\'ve only ever been a wall. (softer) I want to be a home.',
    names: ['Sunny', 'Valor'], names2: ['Bright', 'Aurum'], birth: 'A loud, golden, absolutely unbreakable baby who comes out already trying to stand.', again: '(already grinning) Remember the best day? There\'s a sequel.' },
  sakura: { announce: ['(hat crushed in both hands) I — okay — I practiced this. Forty times.', 'I\'m having your baby. (all the words come out at once) I\'m sorry — no, I\'m not sorry, I\'m so happy I can\'t breathe —'],
    joy: '(she bursts into tears and laughter at once) Okay. Okay! Brave. I\'m being brave. With you.', need: 'Just be there when I\'m scared. I\'ll be scared a lot. I\'ll be brave a lot too.',
    names: ['Petal', 'Wren'], names2: ['Blossom', 'Lark'], birth: 'A tiny elf-eared baby who sneezes a single flower petal the moment they\'re born, to great applause.', again: '(pink, practically glowing) I didn\'t practice this time. I didn\'t need to. Another one.' },
  shiro: { announce: ['(setting down the ledger with unusual care) I have run the numbers. I have run them eleven times. They agree.', 'I am carrying your child. (a beat) I find I\'m delighted. I did not budget for being delighted.'],
    joy: '(she lets you hold her, and laughs, which she almost never does) Variables accepted. Outcome: unquantifiable. Acceptable.', need: 'A second ledger. Smaller. For the child. (very quietly) And you, every day.',
    names: ['Ledger', 'Bishop'], names2: ['Knight', 'Tally'], birth: 'A calm, grey-eyed baby who looks at everyone in the room with tremendous, evaluating interest.', again: 'I ran the numbers again. (she is already smiling) They came out the same.' },
  elara: { announce: ['A hundred years I wasn\'t curious about anything. (she takes your hand and lays it on her) Now there\'s something I\'m very curious about.', 'I\'m carrying your child. An elf\'s pregnancy is long. I find I don\'t mind waiting at all.'],
    joy: 'I remember when they bound the Codex. (she smiles) This is the first thing since that I\'ve wanted to see begin.', need: 'Only your patience. And your company, for all of it.',
    names: ['Thessaly', 'Moonrise'], names2: ['Starling', 'Aeris'], birth: 'A silver-eyed baby with pointed ears, who watches the candles as if they\'re very old friends.', again: 'Curious again. (she laughs) You\'ve ruined my century.' },
  seraphine: { announce: ['(setting down her wine, untouched) I have a plan. It\'s changed.', 'I\'m pregnant. With yours. My husband will assume it\'s his, if he notices at all. (she takes your hand) I know whose it is.'],
    joy: 'Then I\'ll change the plan. (a slow, certain smile) I\'ve always been very good at plans.', need: 'Discretion. For now. And you, privately, completely.',
    names: ['Celestine', 'Rook'], names2: ['Seraph', 'Vesta'], birth: 'A perfectly composed, extremely loud baby born in silk, whom the upper city will never once suspect.', again: 'The plan has a second chapter. (she is laughing) I wrote it myself.' },
  sister_maren: { announce: ['(hands folded so tightly her knuckles are white) I am sworn to want nothing for myself.', 'I\'m carrying your child. (she unfolds her hands) I want this. I want it more than anything I\'ve ever been told to want.'],
    joy: '(she weeps, quietly) I tended the dying all my life. I never thought I\'d tend a beginning.', need: 'Stay with me. Let me be selfish with you, for this.',
    names: ['Grace', 'Mercy'], names2: ['Hope', 'Psalm'], birth: 'A soft, quiet baby who stops crying the moment Maren hums to them, which she does constantly now.', again: 'I prayed again. (a helpless, glowing smile) The answer was yes.' },
  kira: { announce: ['(flipping the Drowned Rose\'s sign to CLOSED in the middle of the afternoon) House rule\'s dead. New house rule incoming.', 'I\'m pregnant. With yours. (she slides you a drink, then takes it back) Not for me, anymore. You\'re drinking for two.'],
    joy: 'Upstairs gets a crib. (she laughs) The regulars are going to lose their minds.', need: 'Help behind the bar. And upstairs. And every night.',
    names: ['Rosie', 'Tide'], names2: ['Brine', 'Coral'], birth: 'A loud baby born above the Drowned Rose, to a bar full of regulars cheering through the floorboards.', again: '(flipping the sign again) Remember the new house rule? It\'s happening again.' },
  nyxe: { announce: ['(draped dramatically over your chair) I have news. Ask me what it is. ASK.', 'I\'m pregnant. With YOUR baby. So I win. Tell Rue. Tell her I won.'],
    joy: '(very small, very sincere, for one second) ...I\'m really happy. (and then, loudly) Don\'t tell anyone I said that.', need: 'Everything. Constantly. Forever. (smaller) And for you to stay.',
    names: ['Vexa', 'Gloom'], names2: ['Hex', 'Umbra'], birth: 'A tiny Abyssal brat with violet eyes who screams at Rue on sight, to Nyxe\'s eternal pride.', again: 'I won again. (she is smug, and glowing) Two-nothing.' },
  rhea: { announce: ['(kneeling at your feet) You have given me everything. Now I carry something of yours.', 'Your child. (she lays your hand on her belly, reverent) I have never known a holier thing.'],
    joy: '(radiant) I\'ll raise them in your light. Not on a spire. In a home.', need: 'Let me keep serving you. This is the best service I\'ll ever give.',
    names: ['Ember', 'Pinion'], names2: ['Aerie', 'Cinder'], birth: 'A fierce, bright-eyed baby whom Rhea holds up to the dawn like an offering, and then simply holds.', again: 'Blessed again. (she laughs) I don\'t have enough altars.' },
  valdra: { announce: ['(at the dawn window, hands folded) Ninety years I kept the rites of the Coven. I thought myself long past this.', 'I carry your child. (an old, astonished smile) The snow is melting somewhere, I think.'],
    joy: 'A new rite, then. (she takes your hands) The only one I\'ll keep from now on.', need: 'Your strength, when mine is spent. I am old. I am not too old for this.',
    names: ['Solstice', 'Hearth'], names2: ['Thaw', 'Matins'], birth: 'A strong, quiet baby born at dawn, to whom Valdra sings the oldest hymn she knows, with every word changed.', again: 'Spring again. (she is laughing) At my age.' },
  aurelia: { announce: ['(at attention, then not) Reporting. Personal matter.', 'I\'m carrying your child. (her composure cracks into a grin) My cohort is going to be insufferable.'],
    joy: 'Six soldiers and a baby. (she laughs) We\'ll be the best-defended nursery in the dead city.', need: 'Your orders, as always. Starting with: sit down and let me tell you how happy I am.',
    names: ['Cohort', 'Valeria'], names2: ['Legion', 'Aurea'], birth: 'A baby born to a guard of six saluting soldiers, every one of whom cries.', again: '(saluting, grinning) Reinforcements incoming.' },
  brynn: { announce: ['(holding a vial up to the light) My test came out green. Green means —', 'I\'m pregnant! With yours! (freckled and fierce and beaming) I\'ve brewed a hundred tonics for this and I don\'t need a single one.'],
    joy: 'We\'re going to have the healthiest baby in the Ashreach. (she pauses) I\'m going to over-brew everything. Stop me.', need: 'Someone to taste-test. And hold my hair back. And you.',
    names: ['Sage', 'Fennel'], names2: ['Clover', 'Rosemary'], birth: 'A freckled, rosy baby who smells faintly of rain, for reasons nobody can explain.', again: '(waving a green vial) It\'s green again!' },
  sera: { announce: ['(handing you a letter) Read it. I couldn\'t say it out loud.', 'The letter says: I am carrying your child. The Thane will never know. I wanted you to.'],
    joy: '(she lets out a long breath) Then I\'ll stop writing to you about it. I\'ll just tell you. Every day.', need: 'A place to go, when it\'s time. Here. With you.',
    names: ['Corvin', 'North'], names2: ['Raven', 'Wynter'], birth: 'A dark-eyed baby born at the Codex while a crow carries a carefully worded letter north.', again: 'Another letter. (she is smiling) I said it out loud first, this time.' },
  seris: { announce: ['(adjusting her spectacles, then removing them entirely) I have a finding.', 'I\'m pregnant. Your child. My methodology was impeccable. (she is shaking slightly) I\'m very happy. I did not predict the magnitude.'],
    joy: 'Further study required. (a startled laugh) Decades of it.', need: 'Peer review. By which I mean you, holding my hand.',
    names: ['Thesis', 'Valen'], names2: ['Theorem', 'Corollary'], birth: 'A serious, observant baby who studies Seris\'s spectacles with tremendous interest.', again: 'Replication achieved. (she is laughing) Second trial.' },
  auren_voss: { announce: ['(closing her second ledger) I have one more entry for it.', 'I\'m carrying your child. At my age. (a slow, wondering smile) My husband stopped counting years ago. I didn\'t.'],
    joy: 'Then this ledger is going to need a great many more pages. (she sets it aside) Good ones.', need: 'Your discretion, publicly. Everything else, privately.',
    names: ['Ledgerine', 'Aurel'], names2: ['Coda', 'Margin'], birth: 'A composed, golden-eyed baby born quietly, recorded in only one ledger, in very large letters.', again: 'Another entry. (she is laughing) At my age, again.' },
  mira_ashveil: { announce: ['(leaning on the Lantern & Ash\'s bar) Heard a rumor this morning. Wanted to confirm it with you before the crows do.', 'I\'m pregnant. Yours. That one\'s true. Go on, look at my face.'],
    joy: 'The whole tavern\'s going to know by noon. (she laughs) Good. Let them.', need: 'Help me run the place. And stay till close. Every night.',
    names: ['Rumor', 'Lantern'], names2: ['Tally', 'Cinders'], birth: 'A loud, laughing baby born above the Lantern & Ash, the news reaching every table before the cord is cut.', again: 'Another rumor. (she grins) Also true.' },
  maren_soleil: { announce: ['(handing you a sealed report, very formally) Day ninety. Subject: you. Findings attached.', 'The finding is: I\'m carrying your child. (she has gone very pink) Recommend continued, extremely close observation.'],
    joy: 'I\'m going to write so many reports about this baby. (she laughs) You\'ll have to read all of them.', need: 'Reading them. Out loud. To the baby.',
    names: ['Brief', 'Soleil'], names2: ['Memo', 'Lumen'], birth: 'A small, very alert baby whose first report Maren writes before the midwife has left.', again: '(another sealed report) Day one-ninety. Findings: again.' },
  calla: { announce: ['(turning a cup in her hands) I came up from the Undercroft today. Only to look. And then I came here to tell you something.', 'I\'m carrying your child. (she laughs, wet-eyed) A year ago I was a prisoner. Now I\'m making a family. I chose it.'],
    joy: 'Sister. (she laughs, wiping her eyes) Sorry. I just wanted to make sure the word still worked. It does. I don\'t need it.', need: 'Just keep choosing me. I\'ll keep choosing you.',
    names: ['Haven', 'Envoy'], names2: ['Harbor', 'Kindred'], birth: 'A peaceful baby born in the Codex, nowhere near the Undercroft, whom Calla holds like the most chosen thing in the world.', again: 'I chose again. (she is glowing) I keep choosing.' },
  mira_vane: { announce: ['(turning the chain at her wrist) I made you something. (she sets down a tiny warded charm) It\'s for a cradle.', 'I\'m carrying your child. (she unclasps the chain and puts it in your hand) I don\'t need this to feel held anymore.'],
    joy: 'My hands remember the forge. (she laughs) They\'re going to have to learn lullabies.', need: 'Hold my hand when I\'m scared. It still helps.',
    names: ['Ward', 'Linden'], names2: ['Clasp', 'Ember'], birth: 'A strong-gripped baby who grabs Mira\'s bare wrist and will not let go.', again: '(holding up another warded charm) I made another one.' },
  aelindra: { announce: ['I noticed something about myself. Before anyone else. Even before you, which is saying something.', 'I\'m carrying your child. (she smiles) I haven\'t told the Concord. I haven\'t told anyone. Only you.'],
    joy: 'Then it\'s our secret, until it isn\'t. (she laughs) My favorite kind.', need: 'Notice me. Like you do. All the way through.',
    names: ['Secret', 'Gilda'], names2: ['Whisper', 'Glint'], birth: 'A sharp-eyed baby who seems to notice everything in the room from the very first minute.', again: 'I noticed again. (she is grinning) First, again.' },
  elspeth: { announce: ['(blistered hands folded) Nobody ever let me choose anything. Not my marriage, not my life, not my ransom.', 'I\'m carrying your child. And I chose this. Every part of it.'],
    joy: '(radiant) My family paid a ransom for a girl who wasn\'t coming home. (she laughs) They have no idea what she found instead.', need: 'Teach them everything. Every useful thing nobody taught me.',
    names: ['Freedom', 'Elsie'], names2: ['Liberty', 'Wren'], birth: 'A bright, kicking baby whom Elspeth refuses to have dressed in anything decorative, ever.', again: 'I chose again. (she is laughing) I\'m getting very good at choosing.' },
};
export const FAMILY_IDS = Object.keys(FAMILY);

const sinceRomance = (S, id) => S.day - ((S.seenDay && (S.seenDay[`${id}_romance`] ?? S.seenDay[`${id}_revisit`])) ?? -99);
const theirPack = (S, id) => !HEROES[id] || !HEROES[id].pack || packOn(S, HEROES[id].pack);

function family(E) {
  for (const [id, o] of Object.entries(FAMILY)) {
    const announce = (lines, n) => [
      ...lines.map(t => ({ s: id, t })),
      { s: 'codex', cond: S => S.pronouns !== 'he', t: '[ The Binding carries more than power. The Codex has never concerned itself with how. ]' },
      { choice: [
        { t: 'Pull her into your arms.', tone: 'kind', bond: { [id]: 1 }, r: [{ s: id, t: o.joy }] },
        { t: '"...Say that again?"', r: [{ s: id, t: '(laughing) You heard me. (softer) You heard me.' }, { s: id, t: o.joy }] },
        { t: '"What do you need from me?"', tone: 'kind', bond: { [id]: 1 }, r: [{ s: id, t: o.need }] },
      ] },
      { do: S => expect(S, id, 12) },
      { chronicle: n === 1 ? `${name(id)} told you she was carrying your child.` : `${name(id)} told you she was carrying your second child.` },
    ];
    E[`${id}_expecting`] = {
      id: `${id}_expecting`, where: 'guild', once: true, priority: 53,
      cond: free(id, S => theirPack(S, id) && romanced(S, id) && nightsWith(S, id) >= 2 && sinceRomance(S, id) >= 6 && S.expecting[id] == null && !childrenOf(S, id).length),
      tags: ['family'], steps: announce(o.announce, 1),
    };
    E[`${id}_expecting_2`] = {
      id: `${id}_expecting_2`, where: 'guild', once: true, priority: 53,
      cond: free(id, S => { const kids = childrenOf(S, id); return theirPack(S, id) && kids.length === 1 && S.day - kids[0].day >= 15 && nightsWith(S, id) >= 4 && S.expecting[id] == null; }),
      tags: ['family'], steps: announce([o.again], 2),
    };
    const birth = (n) => ({
      id: n === 1 ? `${id}_birth` : `${id}_birth_2`, where: 'auto', once: true, priority: 80,
      steps: [
        { s: 'narr', t: n === 1 ? o.birth : `${name(id)}'s second child arrives, as loud and certain as the first, and the Codex makes room again.` },
        { s: id, t: n === 1 ? 'Look. (barely a whisper) Look what we made.' : 'Again. (laughing, exhausted, so happy) We did it again.' },
        { s: 'narr', t: 'She looks up at you. She\'s been thinking about names.' },
        { choice: [
          ...(n === 1 ? o.names : o.names2).map(nm => ({ t: `"${nm}."`, r: [{ do: S => { addChild(S, id, nm); addChronicle(S, `${nm} was born to ${name(id)} and you.`); } }, { s: id, t: `${nm}. (she says it like a vow) Hello, ${nm}.` }] })),
          { t: 'Let her choose.', r: [{ do: S => { const pool = n === 1 ? o.names : o.names2; const nm = pool[S.day % pool.length]; addChild(S, id, nm); addChronicle(S, `${nm} was born to ${name(id)} and you.`); } },
            { s: id, t: S => { const kids = childrenOf(S, id); return `${kids[kids.length - 1].name}. (she smiles down at them) It\'s always been ${kids[kids.length - 1].name}.`; } }] },
        ] },
      ],
    });
    E[`${id}_birth`] = birth(1);
    E[`${id}_birth_2`] = birth(2);
  }
}

// Each envoy\'s own first clutch: she comes to show you.
function clutches(E) {
  const lines = {
    aerie: ['kestra', 'Kestra lands in the reading room with something carefully wrapped in down: three speckled eggs, warm from the high nests. "Ours," she says, and tucks one into your hands.'],
    coil: ['sythra', 'Sythra rises from the cistern with a clutch of pearl-pale eggs held in her coils. "The first of the brood," she hisses, very softly. "They know your voice already. Talk to them."'],
    clutch: ['vharra', 'Vharra climbs the stair carrying a drakeling on her shoulder, tiny and scaled and already trying to breathe fire. "Your blood. My hoard," she says, fierce and proud. "Hold out your arm."'],
    pride: ['tashra', 'Tashra arrives at a run, two spotted cubs tumbling after her, and flops down in the sun at your feet. "They wanted to meet you," she says. "They\'re fast. They get that from me."'],
  };
  for (const [tid, [who, t]] of Object.entries(lines)) {
    E[`${tid}_first_clutch`] = { id: `${tid}_first_clutch`, where: 'auto', once: true, priority: 78, pack: 'wildkin', steps: [
      { s: 'narr', t },
      { s: who, t: 'The tribe raises them together. But they\'re yours, too. I wanted you to see.' },
      { chronicle: `${TRIBES[tid].envoyName}'s first clutch hatched.` },
    ] };
  }
}

// After the ending: the hearth.
function epilogue(E) {
  E.hearth_epilogue = {
    id: 'hearth_epilogue', where: 'auto', once: true, priority: 96,
    cond: S => (S.family || []).length > 0,
    steps: [
      { s: 'narr', t: 'Years later, the drowned library is not quiet anymore.' },
      { s: 'narr', t: S => { const n = S.family.length; return `${n === 1 ? 'A child runs' : `${n} children run`} its stairs now, ${n === 1 ? 'small and loud' : 'small and loud and in every direction at once'}, and the Codex has learned to close its more dangerous pages when it hears them coming.`; } },
      { s: 'narr', t: S => { const by = {}; for (const c of S.family) (by[c.parent] ||= []).push(c.name); return Object.entries(by).map(([p, ks]) => `${ks.join(' and ')}, ${name(p)}'s`).join('; ') + '.'; } },
      { s: 'narr', cond: S => !!S.flags.circle_formed, t: 'Vesper teaches them to read before they can walk. Rue teaches them to lie, and then teaches them why the brand flares. Isolde teaches them to stand up when they fall, and to help others up.' },
      { s: 'narr', cond: S => !!S.flags.dawnward_formed, t: 'The Dawnward Company still closes rifts, now and then. They come home to a very full table.' },
      { s: 'narr', cond: S => Object.keys(TRIBES).some(t => S.tribes && S.tribes[t] && (S.tribes[t].born || 0) > 0), t: 'And out past the Menagerie, the wild tribes are larger than they have ever been, and every one of them has a little of your blood in its newest feathers, scales and spots.' },
      { s: 'vesper', cond: S => has(S, 'vesper'), t: 'The Chronicle ran out of pages last spring. (she smiles at the noise on the stair) I started a second volume. It\'s mostly about them.' },
      { s: 'codex', t: '[ The Chronicle continues. ]' },
    ],
  };
}

// Nightly: births come due; each envoy\'s first clutch is shown to you.
export function nightly(S) {
  if (!packOn(S, P)) return;
  for (const [id, due] of Object.entries(S.expecting || {})) {
    if (due == null || due > S.day) continue;
    delete S.expecting[id];
    S.queue.push(childrenOf(S, id).length ? `${id}_birth_2` : `${id}_birth`);
  }
  if (packOn(S, 'wildkin')) for (const [tid, T] of Object.entries(TRIBES)) {
    const t = S.tribes && S.tribes[tid];
    if (t && t.lineage && t.lineage[T.envoyName] > 0 && !S.seen[`${tid}_first_clutch`] && !S.queue.includes(`${tid}_first_clutch`)) S.queue.push(`${tid}_first_clutch`);
  }
}

export function events(E) {
  circle(E); dawnward(E); pairs(E); council(E); family(E); clutches(E); epilogue(E);
}
