// ============================================================
// WILDKIN — sapient monster-folk drawn to a thriving Menagerie,
// Lysandre the shapeshifter, and the Wyrm's Mantle.
//
// Content rules: every partner here is a sapient adult who speaks for
// herself. Breeding rites are requested by the envoy herself, never
// offered on someone else's behalf, and declining never costs the
// tribe's fealty. Menagerie beasts are animals and are never partners.
// ============================================================

import { petition, bondBeat, romance } from './common.js';
import { free } from '../story.js';
import { TRIBES } from '../data.js';
import * as guests from './guests.js';

const P = 'wildkin';
const has = (S, id) => (S.allies || []).includes(id);
const mantled = S => !!(S.flags && S.flags.pact_wyrm_mantle);

// Intimacy gate for tribe envoys: they aren't party members, but they
// must be free people of a sworn tribe (never captives).
export function tribeFree(tid, who, extra = null) {
  const fn = S => !!(S.tribes && S.tribes[tid] && S.tribes[tid].status === 'sworn')
    && !(S.captives || []).some(c => c.named === who) && (!extra || extra(S));
  fn.__tribe = who;
  return fn;
}

export const looks = {
  kestra:   { skin: 0xe8c8a0, hair: 0x8a5a3a, hairstyle: 'long', outfit: 0x6a4a2a, sleeve: 0xb8885a, legColor: 0x8a6a3a, eyeColor: 0xe8a82a, eyeGlow: true, armWings: true, wingColor: 0xb8885a, wingTip: 0x4a2a1a, feathers: true, talons: true, chest: 2 },
  sythra:   { skin: 0x9ac8a8, hair: 0x1a3a2a, hairstyle: 'straight', outfit: 0x2a4a3a, outfitStyle: 'robe', frill: 0xd8b04a, eyeColor: 0xe8d84a, eyeGlow: true, lowerBody: 'serpent', tailColor: 0x3a8a5a, scaled: true, scaleColor: 0x3a8a5a, earFins: true, finColor: 0xd8b04a, chest: 2, crown: true, crownColor: 0xd8b04a },
  vharra:   { skin: 0xd8946a, hair: 0x2a1a14, hairstyle: 'braided', outfit: 0x5a2a1a, outfitStyle: 'armor', sleeve: 0x5a2a1a, legColor: 0x3a1a10, eyeColor: 0xffb02a, eyeGlow: true, horns: true, hornStyle: 'swept', hornSize: 'large', hornColor: 0x3a2a1a, tail: 'dragon', tailColor: 0xb85a2a, wings: true, wingSize: 0.6, wingColor: 0x8a3a1a, scaled: true, scaleColor: 0xb85a2a, chest: 2, build: 'broad', weapon: 'sword' },
  lysandre: { skin: 0xe0d0e8, hair: 0x2a6a5a, hairstyle: 'long', outfit: 0x2a2a3a, sleeve: 0x3a3a4a, legColor: 0x1a1a2a, eyeColor: 0x8ad8a8, eyeColor2: 0xd8a84a, eyeGlow: true, horns: true, hornStyle: 'swept', hornSize: 'small', hornColor: 0x4a3a5a, tail: 'dragon', tailColor: 0x2a6a5a, earFins: true, finColor: 0x4ab89a, changeArm: true, scaled: true, scaleColor: 0x2a8a6a, chest: 2, markings: true, markingColor: 0x8ad8a8 },
};

// Every tribeswoman who can come to the Bower has her own look, rolled
// from her name so it never changes: skin, hair, eyes, chest, build,
// height, and her tribe's colors (feathers, scales, coat).
export const kinId = (tid, name) => `${tid}_${name.toLowerCase()}`;
export const KIN_TRAITS = {}; // kin id -> { hex, word } for the bloodline tracker
looks.tashra = { skin: 0xd8a878, hair: 0xe8b84a, hairstyle: 'long', outfit: 0x6a4a2a, sleeve: 0xd8a878, legColor: 0x6a4a2a, eyeColor: 0xe8a82a, eyeGlow: true, ears: 'round', tail: 'cheetah', tailColor: 0xe8b84a, spots: 0x2a1a10, chest: 2, build: 'slim' };

function seeded(str) {
  let h = 2166136261;
  for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  let a = h >>> 0;
  return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
const SKINS = [0xf6dcc4, 0xf0d0b0, 0xe8c8a0, 0xd8a880, 0xc08a68, 0x9a6a4a, 0x7a4a34, 0x5a3424];
const HAIRS = [0x1a1410, 0x3a2a1a, 0x6a3a1a, 0x8a5a3a, 0xb85a2a, 0xd8c8a8, 0xe8e8f0, 0x2a1a2a, 0x8a8a9a, 0xd8a83a];
const EYES = [0xe8a82a, 0xe8d84a, 0x8ad8a8, 0x8ac8e8, 0xb08cff, 0xff8a4a, 0xd8e8f0];
const STYLES = ['short', 'long', 'curly', 'straight', 'braided'];
const BUILDS = ['slim', 'average', 'average', 'curvy', 'curvy', 'broad'];
const CHESTS = [0, 1, 1, 2, 2, 2, 3, 3];
const TRIBE_ROLL = {
  aerie: r => { const [w, tip, word] = pick(r, [[0xb8885a, 0x4a2a1a, 'tawny feathers'], [0xd8c8b0, 0x6a5a4a, 'pale, dove-grey feathers'], [0x5a4a3a, 0x1a1410, 'dark hawk feathers'],
      [0xc87a4a, 0xf0e0c8, 'russet feathers'], [0x9a9aaa, 0x2a2a3a, 'storm-grey feathers'], [0xe8e0d0, 0x8a6a4a, 'snowy owl feathers'], [0x3a3a4a, 0xd8d8e8, 'night-black, white-tipped feathers'], [0xa83a2a, 0x2a1a1a, 'scarlet feathers']]);
    return { look: { wingColor: w, sleeve: w, wingTip: tip }, hex: w, word }; },
  coil: r => { const [c, word] = pick(r, [[0x3a8a5a, 'jade scales'], [0x2a5a8a, 'deep-water blue scales'], [0x8a6a2a, 'bronze scales'], [0x6a2a5a, 'plum scales'],
      [0x5a8a3a, 'moss-green scales'], [0x2a2a2a, 'black scales'], [0xd8ccc0, 'pearl-white scales'], [0xa83a3a, 'coral-red scales']]);
    return { look: { tailColor: c, scaleColor: c, finColor: pick(r, [0xd8b04a, 0x8ac8e8, 0xd88ac8, 0xc8e88a, 0xe8e8f0]), skin: pick(r, [0x9ac8a8, 0xc8b088, 0xb8a8c8, 0xe8d0c0, 0x8aa898, 0xd8c0a0, 0x7a6a5a]), crown: false }, hex: c, word }; },
  clutch: r => { const [c, wing, word] = pick(r, [[0xb85a2a, 0x8a3a1a, 'ember-red scales'], [0x8a2a2a, 0x5a1a1a, 'blood-red scales'], [0x2a2a2a, 0x1a1a1a, 'soot-black scales'], [0xd8a83a, 0xa8782a, 'gold scales'],
      [0x3a6a8a, 0x2a4a6a, 'frost-blue scales'], [0x5a8a4a, 0x3a5a2a, 'verdigris scales'], [0xe8e8f0, 0xb8b8c8, 'white-silver scales']]);
    return { look: { tailColor: c, scaleColor: c, wingColor: wing, wingSize: 0.5 + r() * 0.25, hornSize: pick(r, ['small', 'large']), weapon: pick(r, ['sword', 'shield', 'claw', null]) }, hex: c, word }; },
  pride: r => { const [coat, spot, word] = pick(r, [[0xe8b84a, 0x2a1a10, 'golden coat'], [0xf0e0b0, 0x5a4a3a, 'cream coat'], [0xd89a4a, 0x2a1a10, 'tawny coat'], [0x3a3a3a, 0x141414, 'black, ghost-spotted coat'],
      [0xd8d8e0, 0x5a5a6a, 'snow-pale coat'], [0xc8883a, 0x3a2410, 'king-blotched coat']]);
    return { look: { hair: coat, tailColor: coat, spots: spot, outfit: pick(r, [0x6a4a2a, 0x8a6a3a, 0x4a3a2a, 0x7a3a2a, 0x3a4a2a]) }, hex: coat, word }; },
};
const ENVOY_OF = { aerie: 'kestra', coil: 'sythra', clutch: 'vharra', pride: 'tashra' };
const KIN_COLOR = { aerie: '#c8a87a', coil: '#6ab88a', clutch: '#d87a4a', pride: '#e0b050' };
const ENVOY_SIGN = { kestra: [0xb8885a, 'tawny feathers'], sythra: [0x3a8a5a, 'jade scales'], vharra: [0xb85a2a, 'ember-red scales'], tashra: [0xe8b84a, 'golden coat'] };
for (const [tid, T] of Object.entries(TRIBES)) {
  const [hex, word] = ENVOY_SIGN[T.envoy];
  KIN_TRAITS[T.envoy] = { hex, word };
  for (const [name] of T.kin) {
    const r = seeded(tid + ':' + name);
    const base = { skin: pick(r, SKINS), hair: pick(r, HAIRS), hairstyle: pick(r, STYLES), eyeColor: pick(r, EYES), chest: pick(r, CHESTS), build: pick(r, BUILDS), scale: 0.9 + r() * 0.2 };
    const t = TRIBE_ROLL[tid](r);
    looks[kinId(tid, name)] = { ...looks[ENVOY_OF[tid]], ...base, ...t.look };
    KIN_TRAITS[kinId(tid, name)] = { hex: t.hex, word: t.word };
  }
}

Object.assign(looks, guests.looks);

export const speakers = {
  ...guests.speakers,
  kestra: { name: 'Kestra of the Aerie', color: '#c8a87a' },
  sythra: { name: 'Sythra of the Coil', color: '#6ab88a' },
  vharra: { name: 'Vharra of the Clutch', color: '#d87a4a' },
  lysandre: { name: 'Lysandre', color: '#8ad8a8' },
  tashra: { name: 'Tashra of the Pride', color: '#e0b050' },
  ...Object.fromEntries(Object.entries(TRIBES).flatMap(([tid, T]) => T.kin.map(([name]) => [kinId(tid, name), { name, color: KIN_COLOR[tid] }]))),
};

// The rite: the envoy asks for herself; accept, decline, or not yet.
function rite(tid, who, o) {
  return {
    id: `tribe_${tid}_rite`, where: 'guild', once: true, priority: 57,
    cond: tribeFree(tid, who, S => (S.day - (S.tribeSwornDay?.[tid] ?? S.day)) >= 0 && !!S.seen[`tribe_${tid}_sworn`]),
    tags: ['breeding', 'monster', 'sapient partner'],
    steps: [
      ...o.ask,
      { choice: [
        { t: o.yes, tone: 'kind', flag: `rite_${tid}`, r: [
          ...(o.yesR || []),
          { s: 'narr', cond: mantled, t: o.mantle },
          { s: 'narr', t: o.gentle, spice: 'gentle' },
          { s: 'narr', t: o.steamy, spice: 'steamy' },
          { s: 'narr', t: '', spice: 'unbound', stub: `tribe_${tid}_rite` }, // ZOE: unbound
          { chronicle: o.chronicle },
        ] },
        { t: 'Decline, gently. "The oath stands either way."', tone: 'reject', r: o.no },
        { t: '"Ask me again when the moon turns."', reopen: true, r: [{ s: who, t: o.later }] },
      ] },
    ],
  };
}

export function events(E) {
  guests.events(E);
  for (const ev of Object.values(BOWER_NIGHTS)) E[ev.id] = ev;
  for (const ev of Object.values(KIN_RITES)) E[ev.id] = ev;
  for (const ev of KIN_STAGE_EVENTS) E[ev.id] = ev;
  for (const ev of Object.values(KIN_NIGHTS)) E[ev.id] = ev;
  // ===================== THE SKYREND AERIE — harpies =====================
  E.tribe_aerie_arrive = { id: 'tribe_aerie_arrive', where: 'auto', once: true, priority: 72, steps: [
    { s: 'narr', t: 'A shadow crosses the library\'s broken skylight. Then another. Then a woman drops through it in a storm of tawny feathers and lands on the reading table in a crouch, talons gouging the wood.' },
    { s: 'kestra', t: 'Kestra, wing-sister of the Skyrend Aerie. (golden eyes, very bright, taking in everything) We have watched your Menagerie from the Pale Wood\'s high branches. You keep beasts fed, and fat, and breeding. You keep them well.' },
    { s: 'kestra', t: 'The nest-mothers say a warlock who keeps beasts this well is a warlock worth bowing to. But we do not bow for words. (she tilts her head, birdlike) We bow for gifts.' },
    { s: 'vesper', t: '(staring at the talon-marks in her table) ...I\'m going to need a new table.' },
  ] };
  E.tribe_aerie_friendly = { id: 'tribe_aerie_friendly', where: 'auto', once: true, priority: 72, steps: [
    { s: 'kestra', t: 'The nest-mothers are pleased. (she preens one wing, smug on your behalf) One more gift, and the Aerie flies for you.' },
  ] };
  E.tribe_aerie_sworn = { id: 'tribe_aerie_sworn', where: 'auto', once: true, priority: 74, steps: [
    { s: 'narr', t: 'At dawn, forty harpies circle the drowned library in a slow spiral, screaming a song older than the city. Kestra lands before you and spreads her wings flat on the floor.' },
    { s: 'kestra', t: 'The Skyrend Aerie is yours, warlock. Our eyes are your eyes. Nothing hides from us in the fog.' },
    { s: 'codex', t: '[ THE SKYREND AERIE — SWORN. Tribute nightly; Fog-Veiled holdings no longer hide their enemies. ]' },
  ] };
  E.tribe_aerie_rite = rite('aerie', 'kestra', {
    ask: [
      { s: 'kestra', t: 'An Aerie custom. When a nest swears to a great power, one of us may ask to carry that power\'s blood, so the next clutch flies stronger. (she ruffles, then steadies) I am asking. For myself. I chose you the day I first saw your Menagerie.' },
      { s: 'kestra', t: 'And if you say no, the Aerie\'s oath stands. We do not take back what we have sworn.' },
    ],
    yes: 'Accept her.', mantle: 'When the Wyrm\'s Mantle unfurls from your shoulders, Kestra makes a sound like a hawk\'s cry and presses her face into your new wings, delighted.',
    gentle: 'She takes you up to the highest branch of the Pale Wood, where the Aerie\'s eggs are laid, and the night is wind and feathers and her laughter, wild and free.',
    steamy: 'She takes you to the highest branch of the Pale Wood under the full moon, wings mantled around you both like a living tent, and courts you the Aerie way — fierce, playful, all feathers and heat — until the whole canopy knows the warlock answered.',
    no: [{ s: 'kestra', t: '(a little disappointed, a little impressed) A warlock who can say no to a harpy. The nest-mothers will like you even more. (she nuzzles your cheek, once, and flies off)' }],
    later: 'The moon turns every month, warlock. I am patient. For a bird.',
    chronicle: 'Kestra of the Aerie carried your blood to the high nests.',
  });

  // ===================== THE COIL OF THE BLACK MIRE — naga =====================
  E.tribe_coil_arrive = { id: 'tribe_coil_arrive', where: 'auto', once: true, priority: 72, steps: [
    { s: 'narr', t: 'Something long and green and gold slides up out of the Drowned Stacks\' black water and coils itself, unhurried, around the base of the reading table. The woman at the top of all those coils smiles with a forked tongue.' },
    { s: 'sythra', t: 'Sythra, voice of the Coil of the Black Mire. (her coils tighten, lazily, around a table leg) Your Menagerie breeds drakes. Drakes are our cousins. We came to see who keeps them.' },
    { s: 'sythra', t: 'The Coil does not swear to the weak. Show us you are generous, warlock, and the Mire will hold you very, very close.' },
  ] };
  E.tribe_coil_friendly = { id: 'tribe_coil_friendly', where: 'auto', once: true, priority: 72, steps: [
    { s: 'sythra', t: 'Generous. Mmm. (a coil brushes your ankle, deliberately) One more, and the Coil is yours.' },
  ] };
  E.tribe_coil_sworn = { id: 'tribe_coil_sworn', where: 'auto', once: true, priority: 74, steps: [
    { s: 'narr', t: 'The Coil swears in the old way: Sythra wraps her whole length around you, once, slowly, and lets you go.' },
    { s: 'sythra', t: 'Held, and released. That is our oath. The Mire is yours, and our venom-binders will teach your seals to squeeze.' },
    { s: 'codex', t: '[ THE COIL OF THE BLACK MIRE — SWORN. Tribute nightly; Binding Seals on beasts +10%. ]' },
  ] };
  E.tribe_coil_rite = rite('coil', 'sythra', {
    ask: [
      { s: 'sythra', t: 'The Coil keeps a custom. When we swear, the voice of the Coil may ask to bear the new power\'s brood. (her tongue flickers) I am the voice. I am asking. For me, warlock. I have wanted to since the first night I wrapped your table leg.' },
      { s: 'sythra', t: 'Say no, and we remain sworn. A naga\'s oath does not unwind.' },
    ],
    yes: 'Accept her.', mantle: 'Sythra hisses with pleasure at your Mantle\'s scales, tracing them as if reading a love letter in her own tongue.',
    gentle: 'She takes you down into the warm brood-pools beneath the Mire, and holds you in her coils all night, close and safe and slow.',
    steamy: 'She takes you down into the warm brood-pools beneath the Black Mire and wraps you in coil after gleaming coil — slow, deliberate, impossibly patient — until there is nothing in the world but her heat and her heartbeat and the soft hiss of your name.',
    no: [{ s: 'sythra', t: '(her coils loosen, unbothered) Then I shall simply enjoy wanting you. The Coil is patient. So am I.' }],
    later: 'I will wait coiled at the water\'s edge, warlock. I am very good at waiting.',
    chronicle: 'Sythra of the Coil took your blood into the brood-pools.',
  });

  // ===================== THE ASHREACH CLUTCH — drake-kin =====================
  E.tribe_clutch_arrive = { id: 'tribe_clutch_arrive', where: 'auto', once: true, priority: 72, steps: [
    { s: 'narr', t: 'The drowned stair steams. A woman climbs it in scaled red armor, horns swept back, wings folded tight, a tail swaying behind her like a banked fire.' },
    { s: 'vharra', t: 'Vharra, blade of the Ashreach Clutch. We are drake-kin; we hoard what is worth hoarding. (she studies the Menagerie stair) Your beasts are worth hoarding. You may be, too.' },
    { s: 'vharra', t: 'The Clutch respects only strength and wealth. Show us both, and we will burn for you.' },
    { s: 'isolde', cond: S => has(S, 'isolde'), t: '(hand on her sword, not drawing it) She is honest. I find I respect that.' },
  ] };
  E.tribe_clutch_friendly = { id: 'tribe_clutch_friendly', where: 'auto', once: true, priority: 72, steps: [
    { s: 'vharra', t: 'The hoard grows. (a flash of a fanged smile) One more offering and the Clutch flies under your banner.' },
  ] };
  E.tribe_clutch_sworn = { id: 'tribe_clutch_sworn', where: 'auto', once: true, priority: 74, steps: [
    { s: 'narr', t: 'The Clutch swears with fire: thirty drake-kin breathe flame into the sky above the dead city at once, and the drowned library glows orange to its roots.' },
    { s: 'vharra', t: 'You are our hoard now, warlock. No floor will burn your people while the Clutch stands with you.' },
    { s: 'codex', t: '[ THE ASHREACH CLUTCH — SWORN. Tribute nightly; your party ignores Burning Floors. ]' },
  ] };
  E.tribe_clutch_rite = rite('clutch', 'vharra', {
    ask: [
      { s: 'vharra', t: 'Drake-kin honor strength with the clutch. The blade of the Clutch may ask to carry a great power\'s eggs. (she meets your eyes, fierce, unblushing) I am the blade. I am asking. For myself — I have wanted you since I climbed your stair.' },
      { s: 'vharra', t: 'Refuse, and the Clutch still burns for you. We do not break oaths over a no.' },
    ],
    yes: 'Accept her.', mantle: 'Vharra goes very still at the sight of your Mantle — horns to her horns, wings to her wings — and then grins with every fang she has. "Kin," she breathes.',
    gentle: 'She takes you to the Clutch\'s hatchery in the Ashreach, warm as a forge in a world of snow, and holds you with a strength that is careful, and proud.',
    steamy: 'She takes you to the Clutch\'s hatchery, warm as a forge in a world of snow, and the blade of the Clutch courts you like a duel she has every intention of losing — fierce, hot-blooded, wings snapping wide, all heat and hunger and drake-kin pride.',
    no: [{ s: 'vharra', t: '(a respectful nod, blade to blade) Strength is also in refusing. The Clutch burns for you all the same.' }],
    later: 'I will ask again when the snows break. Be ready.',
    chronicle: 'Vharra of the Clutch carried your blood to the Ashreach hatchery.',
  });

  // ===================== THE SUNRUN PRIDE — cheetah-folk =====================
  E.tribe_pride_arrive = { id: 'tribe_pride_arrive', where: 'auto', once: true, priority: 72, steps: [
    { s: 'narr', t: 'Something moves past the Menagerie gate too fast to see. When it stops, it is a woman: long-limbed and golden, spotted down her arms and cheeks, a tail flicking with impatience.' },
    { s: 'tashra', t: 'Tashra, first runner of the Sunrun Pride. (she sniffs the air, then grins) The Lodge\'s hounds won\'t come near this place. That\'s the first thing that made us look. Your Menagerie is the second.' },
    { s: 'tashra', t: 'The Hunters\' Lodge has run us out of the Charmed Glade three summers in a row. A pride that runs forever starves. Give us a reason to stop running, warlock.' },
    { s: 'rue', cond: S => has(S, 'rue'), t: '(watching the tail go back and forth) Oh, I like her.' },
  ] };
  E.tribe_pride_friendly = { id: 'tribe_pride_friendly', where: 'auto', once: true, priority: 72, steps: [
    { s: 'tashra', t: 'The pride-mothers are purring. Not literally. (a pause) A little literally. One more gift and we stop running for good.' },
  ] };
  E.tribe_pride_sworn = { id: 'tribe_pride_sworn', where: 'auto', once: true, priority: 74, steps: [
    { s: 'narr', t: 'The Sunrun Pride swears at a dead sprint: thirty cheetah-folk race three times around the drowned library, so fast the dust hangs in rings, and stop in a line before you. Not one of them is out of breath.' },
    { s: 'tashra', t: 'We\'ve stopped running, warlock. Now we run for you.' },
    { s: 'codex', t: '[ THE SUNRUN PRIDE — SWORN. Tribute nightly; your party starts every battle Hasted. ]' },
  ] };
  E.tribe_pride_rite = rite('pride', 'tashra', {
    ask: [
      { s: 'tashra', t: 'Pride custom. When we find somewhere safe enough to stop running, one of us may ask the power that made it safe to sire the next litter. (her tail curls around her ankle, oddly shy) I\'m asking. For me. I\'ve been watching you since the first night at the gate.' },
      { s: 'tashra', t: 'And the Pride stays sworn whatever you say. We don\'t run from promises.' },
    ],
    yes: 'Accept her.', mantle: 'Tashra circles you twice at speed, inspecting the Mantle from every side, then laughs out loud and headbutts your shoulder.',
    gentle: 'She takes you out to the long grass beyond the Menagerie under a huge yellow moon, and the night is warm wind, her purr against your chest, and the stars.',
    steamy: 'Out in the long grass under a yellow moon, Tashra courts you the way the Pride does: a chase she lets you win, a pounce with her claws sheathed, purring, playful and hungry and quick, until the grass is flattened for yards around.',
    no: [{ s: 'tashra', t: '(an easy shrug, tail swishing) Then I\'ll chase other things. You\'re still ours, and we\'re still yours.' }],
    later: 'I\'m the fastest thing in the Glade. I can be patient. (she visibly cannot)',
    chronicle: 'Tashra of the Sunrun Pride carried your blood to the long grass.',
  });

  // ===================== LYSANDRE — the Many-Shaped =====================
  E.lysandre_arrives = { id: 'lysandre_arrives', where: 'auto', once: true, priority: 75, steps: [
    { s: 'narr', t: 'The night your first hybrid hatches, something is waiting by its pen: a woman with sea-green hair and faintly scaled skin, crouched beside the newborn, letting it nose her hand.' },
    { s: 'lysandre', t: 'Two bloodlines that were never meant to meet. (she looks up; her eyes shift color as you watch) I know what that\'s like. I am one.' },
    { s: 'lysandre', t: 'I\'m Lysandre. I\'ve been every shape — drake, serpent, shadow, girl — and belonged to none of them. Here, mixing is honored. (softly) May I stay?' },
    { flag: 'lysandre_arrives' },
  ] };
  E.recruit_intro_lysandre = petition('lysandre', [
    { s: 'lysandre', t: 'I can hold the line in drake-shape and slip any hold in serpent-shape. I can handle your hybrids like no one else can — they know I\'m one of them.' },
  ]);
  E.lysandre_bond_1 = bondBeat('lysandre', 1, [
    { s: 'narr', t: 'Lysandre is in the Menagerie at dawn, half in serpent-shape, coiled around the hybrid pens to keep them warm.' },
    { s: 'lysandre', t: '(sleepy) Which one do you like best? My shapes, I mean. (she shifts, scales flowing into skin and back) Nobody\'s ever asked me to pick. I\'d like someone to.' },
  ]);
  E.lysandre_romance = {
    id: 'lysandre_romance', where: 'camp', once: true, priority: 45,
    cond: free('lysandre', S => (S.bond.lysandre || 0) >= 7),
    tags: ['shapeshifting', 'monster forms', 'breeding'],
    steps: [
      { s: 'lysandre', t: 'I want you. In whatever shape you want me — and I want to choose that with you. (her skin shimmers, scales rising and falling like breath) Tell me which.' },
      { choice: ['As she truly is', 'Her drake-shape: scales, wings, horns', 'Her serpent-shape: the long coil'].map((label, i) => ({
        t: label, tone: i === 0 ? 'kind' : 'dom', bond: { lysandre: 1 }, flag: ['lys_true', 'lys_drake', 'lys_coil'][i], r: [
          { s: 'lysandre', t: ['(a startled, wondering laugh) No one\'s ever picked that one.', 'Kin to your Mantle, if you wear it. (she unfurls her wings) I hoped you\'d say that.', '(a slow, delighted hiss) Then let me hold you properly.'][i] },
          { s: 'narr', cond: mantled, t: 'When your own Mantle answers hers — horns, scales, wings — Lysandre goes quiet, and then laughs like someone who has finally found her own kind.' },
          { s: 'narr', spice: 'gentle', t: ['She is herself with you, changeling and girl at once, and falls asleep in your arms without shifting once all night.', 'Her wings close around you like a tent of warm scale, and she is gentle with every claw.', 'She holds you in her coils, warm and slow, and hums a changeling lullaby until dawn.'][i] },
          { s: 'narr', spice: 'steamy', t: ['She lets every shape fall away and is simply herself with you — no scales, no claws, nothing borrowed — and discovers that being wanted exactly as she is undoes her more than any transformation ever has.', 'In drake-shape she is all heat and strength and careful claws, wings mantling around you both, a creature built for flight learning how to hold still for someone — and then very much not holding still at all.', 'In serpent-shape she wraps you coil by gleaming coil, slow and deliberate and impossibly intimate, her whole long body a single embrace that tightens with every breath you share.'][i] },
          { s: 'narr', t: '', spice: 'unbound', stub: `lysandre_romance_${i + 1}` }, // ZOE: unbound
        ] })) },
      { chronicle: 'Lysandre was chosen, in the shape you chose together.' },
    ],
  };

  // ===================== THE WYRM'S MANTLE =====================
  E.mantle_awakens = { id: 'mantle_awakens', where: 'auto', autoCond: true, once: true, priority: 82, cond: mantled, steps: [
    { s: 'narr', t: 'It happens three hours after the altar takes its due. You\'re climbing the stair when your shoulder blades split — no pain, just pressure, and then wings. Horns crown your brow like a slow-growing thought. A tail, warm and heavy and entirely yours.' },
    { s: 'vesper', t: '(dropping a book) ...Oh. Oh, the Chronicle is going to need a bigger page.' },
    { s: 'rue', cond: S => has(S, 'rue'), t: '(circling you, eyes huge, tail lashing) Okay. OKAY. That\'s not fair. That is SO not fair. You look like you were BORN in the Ninth Ember. (the brand stays dark) ...That\'s a compliment. I mean it. Don\'t tell anyone.' },
    { s: 'isolde', cond: S => has(S, 'isolde'), t: '(a long pause) The Vigil would call this the storm made flesh. (she inclines her head) It suits you.' },
    { s: 'codex', t: '[ THE WYRM\'S MANTLE — the warlock\'s monstrous form. Wear it in battle; the wild tribes will know you as kin. ]' },
  ] };
  E.rue_mantle = {
    id: 'rue_mantle', where: 'camp', once: true, priority: 47,
    cond: free('rue', S => mantled(S) && (S.bond.rue || 0) >= 6),
    tags: ['monster forms', 'demon'],
    steps: [
      { s: 'rue', t: 'So. Horns. Tail. Wings. (she\'s trying very hard to sound casual and failing) You know what demons of the Ninth Ember do when they meet another one with a really good tail?' },
      { s: 'rue', t: '(the brand flares) ...I don\'t actually know. Nobody\'s tail was ever good enough. Let\'s find out.', brand: true },
      { choice: [{ t: 'Find out.', tone: 'dom', bond: { rue: 1 }, r: [
        { s: 'narr', spice: 'gentle', t: 'Her tail winds around yours, and she laughs — a real, unguarded, delighted laugh — and doesn\'t let go all night.' },
        { s: 'narr', spice: 'steamy', t: 'Her tail winds around yours, her horns knock against your horns, and the brat of the Ninth Ember discovers that two infernal things together burn a great deal hotter than one — wings, claws, smoke rising off the sheets, her brand blazing and not one word of it a lie.' },
        { s: 'narr', t: '', spice: 'unbound', stub: 'rue_mantle' }, // ZOE: unbound
      ] }] },
      { chronicle: 'Rue met your Mantle tail-to-tail.' },
    ],
  };
  E.nyxe_mantle = {
    id: 'nyxe_mantle', where: 'camp', once: true, priority: 47,
    cond: free('nyxe', S => mantled(S) && (S.bond.nyxe || 0) >= 6),
    tags: ['monster forms', 'abyssal'],
    steps: [
      { s: 'nyxe', t: '(hanging upside down from the rafters, staring at your wings) Okay, new rule. You\'re not allowed to look like THAT and also be in charge. It\'s too much. I\'m going to explode.' },
      { choice: [{ t: '"Then come down here and explode."', tone: 'dom', bond: { nyxe: 1 }, r: [
        { s: 'narr', spice: 'gentle', t: 'She drops into your arms, wings and all, and nuzzles your horns like they\'re the best thing she\'s ever seen.' },
        { s: 'narr', spice: 'steamy', t: 'She drops out of the rafters straight into your wings, an Abyssal familiar finally faced with something more monstrous than herself, and she is — for the first and only time — speechless, and then very, very loud.' },
        { s: 'narr', t: '', spice: 'unbound', stub: 'nyxe_mantle' }, // ZOE: unbound
      ] }] },
      { chronicle: 'Nyxe exploded, as promised.' },
    ],
  };
}

// The Envoys' Bower: talk lines, and nights together (the envoy's own invitation).
export const BOWER_TALK = {
  tashra: [
    '(sprawled in the one patch of sun that reaches the Menagerie) Don\'t move. This is the best spot in your whole library.',
    'The cubs have started racing your hounds. The hounds are losing. Badly. They seem to enjoy it.',
    'In the Glade we slept in shifts, one eye open for the Lodge. Here I sleep all the way. (a slow blink) It\'s strange. It\'s good.',
    'I ran to the Ashreach and back this morning just to see if I could. I could. Ask me why. (she grins) Because I could.',
    '(purring, very quietly, and pretending she isn\'t) What? I\'m not doing anything.',
  ],
  kestra: [
    'The nest-mothers ask after you. I told them you feed your beasts before yourself. They approved, loudly.',
    '(preening a wing over the rail) Your shrikes are ugly. I like them. Ugly things fight hardest.',
    'Do you know what the Pale Wood looks like from above at dawn? No. You should. I could carry you. Probably.',
    'I left a feather on your pillow. Aerie custom. It means — well. You\'ll find out.',
    'Rue tried to pluck me. I bit her. We are friends now, I think? It\'s hard to tell with demons.',
  ],
  sythra: [
    'Mmm. Your drakes sleep coiled now. They learned it from watching me. (a slow smile) Clever beasts.',
    'The brood-pools are warm this season. I think of you when I lie in them. Is that forward? It\'s meant to be.',
    'Naga don\'t hurry. You\'ll notice I keep coming back anyway.',
    '(her coils loosely around the bench you\'re sitting on) Comfortable? Good. I\'ll stay.',
    'Vesper asked to measure me. I let her. She lost count at the eleventh coil and had to start again.',
  ],
  vharra: [
    'The Clutch\'s hatchery is the warmest place in the Ashreach. You should see it in a blizzard. It\'s glorious.',
    'Isolde and I sparred this morning. She won. (a fanged grin) I\'m going to marry that woman\'s sword arm.',
    'Your hoard grows. I\'ve been counting. Drake-kin always count.',
    '(warming her hands at her own breath) Cold down here. Lucky I run hot.',
    'If anyone threatens this Menagerie, the Clutch burns them. I just wanted you to hear it from me.',
  ],
};

function nightEvent(tid, who, o) {
  return {
    id: `envoy_night_${tid}`, where: 'bower', once: false,
    cond: tribeFree(tid, who, S => !!S.flags[`rite_${tid}`]),
    tags: ['monster', 'sapient partner', 'breeding'],
    steps: [
      { s: who, t: o.invite },
      { choice: [
        { t: o.yes, flag: `night_yes_${tid}`, r: [
          { s: 'narr', cond: mantled, t: o.mantle },
          { s: 'narr', t: o.gentle, spice: 'gentle' },
          { s: 'narr', t: o.steamy, spice: 'steamy' },
          { s: 'narr', t: '', spice: 'unbound', stub: `envoy_night_${tid}` }, // ZOE: unbound
        ] },
        { t: '"Just stay and talk tonight."', r: [{ s: who, t: o.talk }] },
      ] },
    ],
  };
}
export const BOWER_NIGHTS = {
  pride: nightEvent('pride', 'tashra', {
    invite: '(stretched out along the top of the Menagerie gate, tail dangling) The grass is warm and the moon\'s fat. Race me out there?',
    yes: 'Race her out to the long grass.',
    mantle: 'She makes you unfurl your Mantle\'s wings just to see whether you\'ll cheat on the race. You do. She doesn\'t mind at all.',
    gentle: 'Warm grass, her purr, and the slow wheel of the stars until dawn.',
    steamy: 'She lets you catch her, barely, and the Pride\'s courtship turns into a tumble through the long grass: quick and playful and hot, all purrs and sheathed claws and laughter.',
    talk: '(she flops onto her back in the Bower straw) Fine. Tell me something fast. I like fast stories.',
  }),
  aerie: nightEvent('aerie', 'kestra', {
    invite: '(landing on the Menagerie rail, wings half-spread) The moon\'s good tonight. The high branch is empty. (she tilts her head) Come up with me?',
    yes: 'Go up to the high branch with her.',
    mantle: 'She makes you spread your Mantle\'s wings beside hers, and laughs in delight at how they look together against the moon.',
    gentle: 'Wind, feathers, her laughter in your ear, and the whole Pale Wood silver beneath you until dawn.',
    steamy: 'On the highest branch, wrapped in her wings against the wind, Kestra courts you again the Aerie way — fierce, playful, unashamed — and the moon is the only witness.',
    talk: 'Then talk to me. (she settles onto the rail, feathers fluffed) I like your voice. Tell me about the city before it drowned.',
  }),
  coil: nightEvent('coil', 'sythra', {
    invite: '(rising from the Menagerie\'s cistern, water streaming off her coils) The brood-pools are warm. I\'ve been warming them. For you. (mmm) Come?',
    yes: 'Go down to the brood-pools with her.',
    mantle: 'She traces your Mantle\'s scales with one claw and hisses, pleased, as though you\'ve finally learned to dress properly.',
    gentle: 'Warm water, warmer coils, and the slow lullaby hiss of a naga holding you close all night.',
    steamy: 'In the warm dark of the brood-pools, Sythra wraps you coil by gleaming coil, unhurried as the tide, until there is nothing but her heat and the soft hiss of your name.',
    talk: '(she drapes herself around the cistern rim) Talking is good too. Tell me something no one else knows. I collect those.',
  }),
  clutch: nightEvent('clutch', 'vharra', {
    invite: '(leaning on the Menagerie gate, wings folded, tail swaying) Hatchery\'s lit and nobody\'s in it. I\'m not going to ask twice. (she asks with her eyes)',
    yes: 'Go to the hatchery with her.',
    mantle: '"Kin," she says again, softer this time, horns touching yours.',
    gentle: 'Forge-heat, her strong careful arms, and the crackle of the hatchery fires until morning.',
    steamy: 'By the hatchery fires the blade of the Clutch courts you like a duel she means to lose, wings snapping wide, all heat and hunger and fierce drake-kin pride.',
    talk: '(she sits on the gate, swinging her tail) Fine. Then tell me about the strongest thing you\'ve ever beaten. Slowly. I like the details.',
  }),
};

export function nightly(S, log) {
  guests.nightly(S, log);
  for (const tid of Object.keys(TRIBES)) {
    if (S.flags[`rite_${tid}`] && S.tribes[tid] && !S.tribes[tid].rite) S.tribes[tid].rite = true; // tribute doubles
  }
}

// ============================================================
// KINSHIP — after the envoy's rite, others of the tribe come to the
// Bower to ask for you themselves, more often as the tribe comes to rely
// on you. Speaker 'kin' is whichever of the tribe is asking ({kin}).
// ============================================================

const kinN = tid => S => ((S.tribes[tid] && S.tribes[tid].kin) || []).length;
function kinRite(tid, o) {
  const n = kinN(tid);
  return {
    id: `kin_rite_${tid}`, where: 'bower', once: false,
    cond: tribeFree(tid, `${tid}_kin`, S => !!(S.tribes[tid] && S.tribes[tid].suitor)),
    tags: ['breeding', 'monster', 'sapient partner'],
    steps: [
      { s: 'narr', t: o.arrive },
      { s: 'kin', cond: S => n(S) < 3, t: o.early },
      { s: 'kin', cond: S => n(S) >= 3 && n(S) < 6, t: o.mid },
      { s: 'kin', cond: S => n(S) >= 6, t: o.late },
      { s: 'kin', t: o.oath },
      { choice: [
        { t: 'Accept her.', flag: `kin_yes_${tid}`, r: [
          { s: 'narr', cond: mantled, t: o.mantle },
          { s: 'narr', t: o.gentle, spice: 'gentle' },
          { s: 'narr', t: o.steamy, spice: 'steamy' },
          { s: 'narr', t: '', spice: 'unbound', stub: `kin_rite_${tid}` }, // ZOE: unbound
        ] },
        { t: 'Decline, kindly.', flag: `kin_no_${tid}`, r: [{ s: 'kin', t: o.no }] },
        { t: '"Not tonight. Stay a while?"', r: [{ s: 'kin', t: o.later }] },
      ] },
    ],
  };
}

export const KIN_RITES = {
  pride: kinRite('pride', {
    arrive: 'A cheetah-folk woman you haven\'t met is sprawled in a patch of lamplight in the Bower, pretending she wasn\'t waiting for you: {kin}, {kinWho}.',
    early: 'Tashra came back from the long grass purring so loud the whole Pride heard. (her tail flicks) I want to purr like that. I\'m asking you myself.',
    mid: 'The Pride hasn\'t run from the Glade in a season. We sleep in the sun outside your Menagerie now and we\'ve stopped looking anywhere else. (she sits up, close) So. Me?',
    late: 'Nobody in the Pride goes out on the long chase for a mate anymore. Why chase when the best is already here? (a grin, all sharp teeth) I came.',
    oath: 'Say no and I\'ll still run for you. The Pride doesn\'t take back promises.',
    mantle: 'She circles your Mantle at a run, delighted, and pounces on your tail.',
    gentle: 'She takes you out into the warm long grass, and the night is her purr, her spotted arms around you, and a sky full of stars.',
    steamy: 'Out in the long grass {kin} makes you chase her, lets you win, and courts you the Pride\'s way: quick and playful and hungry, claws sheathed, purring loud enough to wake the Menagerie.',
    no: '(an easy stretch, unbothered) Alright. I\'ll still run for you tomorrow. (she\'s gone in a blur)',
    later: 'Then I\'ll nap here. (she\'s asleep in the lamplight before you finish turning around)',
  }),
  aerie: kinRite('aerie', {
    arrive: 'A harpy you haven\'t met is perched on the Bower rail, feathers fluffed against the damp: {kin}, {kinWho}.',
    early: 'Kestra came back from the high branch glowing. The whole nest saw. (she fidgets with a loose feather) I want to choose too. For me, not for the nest-mothers. Will you have me?',
    mid: 'Half the Aerie roosts on your roof now. We don\'t fly the far woods looking for strong blood anymore — why would we? (she hops down, close) I\'m asking you myself.',
    late: 'Nobody hunts the storms for a mate anymore. The nest-mothers stopped pretending we might. We come to you. (a shy, crooked smile) So. I came.',
    oath: 'And if you say no, I\'ll still fly for you tomorrow. That\'s what sworn means.',
    mantle: 'She gasps at your Mantle\'s wings, then spreads her own beside them to compare, delighted.',
    gentle: 'She takes you up to the library roof, where the Aerie\'s new nests are woven into the broken skylight, and the night is wind and soft feathers and her laughter.',
    steamy: 'Up on the roof among the new nests, wings mantled around you both, {kin} courts you the Aerie way — fierce, playful, all feathers and heat — and the nest hears every bit of it.',
    no: '(she ruffles, then settles) Alright. You\'re still ours, and we\'re still yours. (she bumps her head against your shoulder and flies off)',
    later: 'Then I\'ll stay. (she tucks her head under a wing on the rail) I like it here anyway.',
  }),
  coil: kinRite('coil', {
    arrive: 'A naga you don\'t know is coiled in the Bower\'s cistern, chin on the rim, watching you: {kin}, {kinWho}.',
    early: 'Sythra came up from the brood-pools humming. She never hums. (her tongue flickers) I want what she found. I\'m asking for myself, warlock.',
    mid: 'The Coil hardly leaves the Drowned Stacks now. The deep mire is cold, and the old matings were cold too. (a coil slides, slow, around the cistern) You are warm. I\'m asking.',
    late: 'The elders stopped sending us to the far pools to choose. Everyone already knows who we choose. (she smiles, all fangs and patience) Me too.',
    oath: 'Say no, and the Coil still holds you. Our oaths don\'t unwind.',
    mantle: 'She traces a claw along your Mantle\'s scales, very slowly, and hisses something fond in the Coil\'s tongue.',
    gentle: 'Down in the warm cistern she holds you in her coils, close and slow, telling you riddles until you both fall asleep in the water.',
    steamy: 'In the warm dark of the cistern {kin} wraps you coil by gleaming coil, unhurried as the tide, until the world is nothing but her heat and the soft hiss of your name.',
    no: '(her coils loosen, unbothered) Then I\'ll enjoy wanting you. The Coil is patient.',
    later: 'I\'ll wait. (she sinks to her nose in the cistern) Naga are very good at waiting.',
  }),
  clutch: kinRite('clutch', {
    arrive: 'A drake-kin you haven\'t met is leaning on the Bower gate, wings folded, tail lashing once: {kin}, {kinWho}.',
    early: 'Vharra came back from the hatchery grinning like she\'d won a war. (she squares her shoulders) I want to win one too. I\'m asking you myself.',
    mid: 'The Clutch barely hunts the snowline anymore. Why fight wyrms for strong blood when the strongest is here? (a flash of fangs) So — I\'m asking.',
    late: 'There\'s no more duelling in the hatchery over who gets to choose a mate from the wild. We just come to you. (she laughs, short and fierce) I came.',
    oath: 'Refuse me and the Clutch still burns for you. We don\'t break oaths over a no.',
    mantle: '"Kin," she breathes at the sight of your Mantle, and touches her horns to yours.',
    gentle: 'She takes you to the warm hatchery and holds you by the fires with a strength that is careful, and proud.',
    steamy: 'By the hatchery fires {kin} courts you like a duel she has every intention of losing — wings snapping wide, all heat and hunger and drake-kin pride.',
    no: '(a respectful nod, blade to blade) Strength is in refusing too. I\'ll still burn for you.',
    later: 'Fine. I\'ll wait by the fire. (she settles on the gate, tail swaying) Don\'t take too long.',
  }),
};

// Stage scenes: the tribe coming to rely on you instead of the wild.
const stageEv = (tid, st, steps) => ({ id: `kin_stage_${tid}_${st}`, where: 'auto', once: true, priority: 70, steps });
export const KIN_STAGE_EVENTS = [
  stageEv('pride', 2, [
    { s: 'narr', t: 'The Sunrun Pride has stopped moving camp. Every morning the cheetah-folk are stretched out in the sun on the library steps, and every evening they\'re still there.' },
    { s: 'tashra', t: 'The Glade was always a place to run from. This is a place to stay. (a slow, content blink) We\'ve never had one of those.' },
    { s: 'codex', t: '[ THE SUNRUN PRIDE — NESTING NEAR. Tribute ×3; suitors come more often. ]' },
  ]),
  stageEv('pride', 3, [
    { s: 'narr', t: 'The Pride\'s runners no longer go out on the long chase to find mates in the far grasslands. Three different cheetah-folk tell you so, each one trying to be the first.' },
    { s: 'tashra', t: 'The long chase used to take a whole season. Now it takes a walk to the Bower. (she grins) Nobody misses the season.' },
    { s: 'codex', t: '[ THE SUNRUN PRIDE — DEVOTED. Tribute ×4; a suitor every few days. ]' },
  ]),
  stageEv('pride', 4, [
    { s: 'narr', t: 'At dawn the whole Sunrun Pride runs one last circle around the drowned library, slower this time, side by side, and when they stop they lie down in the sun at your feet like they have finally come home.' },
    { s: 'tashra', t: 'No more running from anything. The Pride is yours: every runner, every cub. We hunt for you now.' },
    { s: 'codex', t: '[ THE SUNRUN PRIDE — YOUR TRIBE. Tribute ×5; they hunt for you now (+30 gold nightly). ]' },
  ]),
  stageEv('aerie', 2, [
    { s: 'narr', t: 'At dawn you find nests woven into the library\'s broken skylight — a dozen of them, lined with moth dust and antler velvet.' },
    { s: 'kestra', t: 'The nest-mothers moved half the Aerie. The far woods are cold, and the hunting\'s thin. (she shrugs, smug) Here, there\'s you.' },
    { s: 'codex', t: '[ THE SKYREND AERIE — NESTING NEAR. Tribute ×3; suitors come more often. ]' },
  ]),
  stageEv('aerie', 3, [
    { s: 'narr', t: 'The Aerie\'s hunting parties no longer fly to the Pale Wood\'s far edges. They bring their catch to your Menagerie first, and drop the best of it at your feet.' },
    { s: 'kestra', t: 'We used to look for strength in the storms. Now the young ones look for it here. (she preens one wing) I told them they would.' },
    { s: 'codex', t: '[ THE SKYREND AERIE — DEVOTED. Tribute ×4; a suitor every few days. ]' },
  ]),
  stageEv('aerie', 4, [
    { s: 'narr', t: 'Every harpy of the Skyrend Aerie circles the drowned library at once, a spiral so wide it blots out the moon, and sings the old oath-song again — this time with your name in it.' },
    { s: 'kestra', t: 'The nest-mothers met. There is no more choosing between the wild and the warlock. Every clutch, every nest. We are yours.' },
    { s: 'codex', t: '[ THE SKYREND AERIE — YOUR TRIBE. Tribute ×5; they hunt for you now (+30 gold nightly). ]' },
  ]),
  stageEv('coil', 2, [
    { s: 'narr', t: 'The Drowned Stacks\' black water has more coils in it every morning. The Coil has started laying its brood-pools under your library.' },
    { s: 'sythra', t: 'The deep mire is cold. The Coil likes warm. (her tongue flickers) You are warm.' },
    { s: 'codex', t: '[ THE COIL OF THE BLACK MIRE — NESTING NEAR. Tribute ×3; suitors come more often. ]' },
  ]),
  stageEv('coil', 3, [
    { s: 'narr', t: 'The Coil\'s elders have stopped sending their young to the far pools to choose mates. You hear it from three different naga, each very pleased to be the one to tell you.' },
    { s: 'sythra', t: 'They used to go looking. Now they know where to look. (she coils, satisfied) I take full credit.' },
    { s: 'codex', t: '[ THE COIL OF THE BLACK MIRE — DEVOTED. Tribute ×4; a suitor every few days. ]' },
  ]),
  stageEv('coil', 4, [
    { s: 'narr', t: 'The whole Coil rises from the black water at once, and every one of them wraps the library\'s drowned pillars, slowly, and lets go. Held, and released. The oath, from all of them.' },
    { s: 'sythra', t: 'The Mire was ours. Now it is yours, and so are we. The Coil hunts for you now.' },
    { s: 'codex', t: '[ THE COIL OF THE BLACK MIRE — YOUR TRIBE. Tribute ×5; they hunt for you now (+30 gold nightly). ]' },
  ]),
  stageEv('clutch', 2, [
    { s: 'narr', t: 'The drowned stair is warm every morning now. The Clutch has lit a second hatchery-fire just beyond your Menagerie gate.' },
    { s: 'vharra', t: 'Snowline\'s cold. Wyrms are rude. (a fanged grin) Your stair is better.' },
    { s: 'codex', t: '[ THE ASHREACH CLUTCH — NESTING NEAR. Tribute ×3; suitors come more often. ]' },
  ]),
  stageEv('clutch', 3, [
    { s: 'narr', t: 'The Clutch no longer duels on the snowline to win the right to go looking for strong blood in the wild. Vharra says it was getting embarrassing, how fast everyone wanted to lose.' },
    { s: 'vharra', t: 'The hoard\'s here. The strength\'s here. (she taps your chest) Nobody\'s looking anywhere else.' },
    { s: 'codex', t: '[ THE ASHREACH CLUTCH — DEVOTED. Tribute ×4; a suitor every few days. ]' },
  ]),
  stageEv('clutch', 4, [
    { s: 'narr', t: 'Thirty drake-kin breathe fire into the sky over the dead city again — and then, one by one, every one of them kneels on the warm stair and lays her blade at your feet.' },
    { s: 'vharra', t: 'You\'re not our hoard anymore. You\'re our Clutch. The whole of it. We hunt for you now.' },
    { s: 'codex', t: '[ THE ASHREACH CLUTCH — YOUR TRIBE. Tribute ×5; they hunt for you now (+30 gold nightly). ]' },
  ]),
];

// ============================================================
// KIN EVENINGS — send for one of your kin by name. She can say not
// tonight (ev.busy); otherwise it's her choice to come, and yours
// whether it's a night together or just talk.
// ============================================================
function kinNight(tid, o) {
  return {
    id: `kin_night_${tid}`, where: 'bower', once: false, busy: o.busy,
    cond: tribeFree(tid, `${tid}_kin`),
    tags: ['breeding', 'monster', 'sapient partner', 'repeatable'],
    steps: [
      { s: 'kin', t: o.invite },
      { choice: [
        { t: o.yes, flag: `kin_night_yes_${tid}`, r: [
          { s: 'narr', cond: mantled, t: o.mantle },
          { s: 'narr', t: o.gentle, spice: 'gentle' },
          { s: 'narr', t: o.steamy, spice: 'steamy' },
          { s: 'narr', t: '', spice: 'unbound', stub: `kin_night_${tid}` }, // ZOE: unbound
        ] },
        { t: '"Just stay and talk tonight."', r: [{ s: 'kin', t: o.talk }] },
      ] },
    ],
  };
}
export const KIN_NIGHTS = {
  aerie: kinNight('aerie', {
    invite: '(landing on the Bower rail, breathless from the flight) You sent for me? (her feathers fluff up, pleased) You sent for me.',
    yes: 'Take her up to the roof nests.',
    mantle: 'She tucks herself under your Mantle\'s wing as if it had always been there for her.',
    gentle: 'The roof nests, the wind, and {kin}\'s wings wrapped around you against the cold until morning.',
    steamy: 'Up in the roof nests {kin} wraps you in her wings and courts you again, fiercer now that she knows you: all feathers and heat and happy hawk-cries into the dark.',
    talk: '(she settles on the rail, preening) Talking\'s good. Tell me what the world looks like from the ground. I always wonder.',
    busy: '{kin} sends word on the wind: she\'s flying patrol over the Pale Wood tonight. Tomorrow, she promises.',
  }),
  coil: kinNight('coil', {
    invite: '(rising from the cistern almost before your message arrives) You called. (her coils loop, slow and pleased) I came.',
    yes: 'Join her in the warm cistern.',
    mantle: 'She traces your Mantle\'s scales with the tip of her tail, slowly, as though memorizing them.',
    gentle: 'Warm water, warmer coils, and {kin}\'s riddles murmured against your shoulder until you both drift off.',
    steamy: 'In the warm dark of the cistern {kin} gathers you into her coils again, unhurried and sure, until there is nothing but her heat and the low hiss of your name.',
    talk: '(she drapes herself over the cistern rim) Then talk. I\'ll trade you a riddle for every secret.',
    busy: '{kin} sends a ripple up through the cistern: she\'s deep in the brood-pools tonight, keeping the eggs warm. Tomorrow.',
  }),
  clutch: kinNight('clutch', {
    invite: '(arriving at a run, wings still half-open) You sent for me. (a fierce grin) Good.',
    yes: 'Go to the hatchery fires with her.',
    mantle: '"Kin," she says, touching her horns to yours, and means it a little differently each time.',
    gentle: 'Forge-warmth, {kin}\'s strong careful arms, and the crackle of the hatchery fires until morning.',
    steamy: 'By the hatchery fires {kin} courts you like a rematch she has every intention of losing again, wings snapping wide, all heat and pride.',
    talk: '(she sits on an anvil, tail swinging) Fine. Tell me about the last thing you fought. Slowly.',
    busy: '{kin} sends word: she\'s on watch at the snowline tonight, and a Clutch blade doesn\'t leave her post. Tomorrow.',
  }),
  pride: kinNight('pride', {
    invite: '(somehow already there before your message, stretched across the Bower gate) You wanted me? (her tail curls) You wanted me.',
    yes: 'Race her out to the long grass.',
    mantle: 'She pounces on your Mantle\'s tail the moment it appears. Every time.',
    gentle: 'Long warm grass, {kin}\'s purr against your ribs, and the stars wheeling slow above you.',
    steamy: 'Out in the long grass {kin} makes you chase her again, lets you win again, and the Pride\'s courtship is quick and hot and laughing, all purrs and sheathed claws.',
    talk: '(she flops into the straw) Then talk. I\'ll just lie here and purr at you.',
    busy: '{kin} sends word: the Pride is on a hunt tonight and she\'s leading the chase. Tomorrow — she says she\'ll run all the way back.',
  }),
};
