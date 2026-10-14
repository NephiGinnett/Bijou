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
  kestra:   { skin: 0xe8c8a0, hair: 0x8a5a3a, hairstyle: 'long', outfit: 0x6a4a2a, sleeve: 0x8a6a4a, legColor: 0x5a4a2a, eyeColor: 0xe8a82a, eyeGlow: true, wings: true, wingColor: 0xb8885a, feathers: true, lowerBody: 'hooves', chest: 2 },
  sythra:   { skin: 0x9ac8a8, hair: 0x1a3a2a, hairstyle: 'straight', outfit: 0x2a4a3a, outfitStyle: 'robe', frill: 0xd8b04a, eyeColor: 0xe8d84a, eyeGlow: true, lowerBody: 'serpent', tailColor: 0x3a8a5a, scaled: true, chest: 2, crown: true, crownColor: 0xd8b04a },
  vharra:   { skin: 0xd8946a, hair: 0x2a1a14, hairstyle: 'braided', outfit: 0x5a2a1a, outfitStyle: 'armor', sleeve: 0x5a2a1a, legColor: 0x3a1a10, eyeColor: 0xffb02a, eyeGlow: true, horns: true, hornColor: 0x3a2a1a, tail: true, tailColor: 0xb85a2a, wings: true, wingColor: 0x8a3a1a, scaled: true, chest: 2, build: 'broad', weapon: 'sword' },
  lysandre: { skin: 0xe0d0e8, hair: 0x2a6a5a, hairstyle: 'long', outfit: 0x2a2a3a, sleeve: 0x3a3a4a, legColor: 0x1a1a2a, eyeColor: 0x8ad8a8, eyeGlow: true, horns: true, hornColor: 0x4a3a5a, tail: true, tailColor: 0x2a6a5a, scaled: true, chest: 2, markings: true, markingColor: 0x8ad8a8 },
};

export const speakers = {
  kestra: { name: 'Kestra of the Aerie', color: '#c8a87a' },
  sythra: { name: 'Sythra of the Coil', color: '#6ab88a' },
  vharra: { name: 'Vharra of the Clutch', color: '#d87a4a' },
  lysandre: { name: 'Lysandre', color: '#8ad8a8' },
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

export function nightly(S, log) {
  for (const tid of Object.keys(TRIBES)) {
    if (S.flags[`rite_${tid}`] && S.tribes[tid] && !S.tribes[tid].rite) S.tribes[tid].rite = true; // tribute doubles
  }
}
