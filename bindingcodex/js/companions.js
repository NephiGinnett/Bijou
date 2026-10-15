// ============================================================
// COMPANIONS — spending time with people, not just unlocking them.
//
// From the hub, any free ally can be visited once a day (talk, train,
// walk): every couple of visits is +1 bond, so every romance is
// reachable by simply being with someone. Once a romance has happened,
// a repeatable Evening keeps it alive (every other night per partner).
// Also: the Dawnward Company's own romances.
//
// Content rules: evenings are for free allies only (free(...)), and the
// player always chooses between a night together and just talking.
// ============================================================

import { free } from './story.js';
import { romanced } from './state.js';
import { romance } from './packs/common.js';

const mantled = S => !!(S.flags && S.flags.pact_wyrm_mantle);
const has = (S, id) => (S.allies || []).includes(id);

// --- what they say when you spend time with them -----------------------------------
// talk: three lines in her voice, rotated. (Missing ids fall back to GENERIC.)
export const HANGOUT = {
  vesper: [
    "(not looking up from a book older than the city) I can feel you hovering. The Binding is very loud about it. Sit. Read me something; your voice makes the ink behave.",
    "Three hundred years of other people's pacts, and do you know what I never read? Anyone's ordinary Tuesday. (she closes the book) Tell me yours.",
    "The candles keep leaning toward you. I've stopped pretending it's a draft.",
  ],
  rue: [
    "(upside down on the reading-room couch, tail swishing) Debt check! Two favors left. (the brand stays dark) ...I'm not in any hurry to pay them. Don't tell anyone.",
    "I stole your socks again. All of them. It's a demon thing. (the brand flickers) ...It's a me thing.",
    "Want to know a secret? The Ninth Ember never once let me sit still next to someone. (she scoots closer) This is nice. Don't make it weird.",
  ],
  isolde: [
    "(oiling her blade by the stair) The Order taught us that rest is a debt paid to the next battle. (she sets the cloth down) I am learning it can just be rest. With you.",
    "Four runes now. (she turns her scarred palm up between you) Some nights I trace them and feel nothing but the Vigil. Tonight I feel the hand that carved them.",
    "Sit with me through the watch. I do not need the company. (a pause) I want it.",
  ],
  lysandre: [
    "(half-scaled, warming a hybrid egg against her chest) This one kicks. I think it's going to be all wings. Want to feel?",
    "Everyone asks what I really look like. You're the first who asked what I like to look like. (her eyes shift gold) I'm still deciding. It's fun, deciding with you.",
    "I spent so long being the odd one in every shape. Here, everything's odd. (she grins) I fit.",
  ],
  erin: [
    "(mid-push-up, grinning up at you) Spar later? I'll go easy. I won't go easy. You know I won't.",
    "Got a letter from my mother. Same letter, different nouns. (she crumples it, cheerful) I told her I serve a warlock now. Best letter I ever wrote.",
    "The Lodge used to say warlocks eat hearts. (she thumps her own chest) Mine's still here. Kind of yours, though. Is that weird to say? I'm saying it.",
  ],
  sakura: [
    "(clutching a page of the Codex, very pink) I didn't touch it. I'm — okay I touched it. It touched back! Is that normal?! Please say it's normal.",
    "I apologized to the Menagerie door again. (small voice) It creaked at me in a forgiving way, I think.",
    "Can I tell you something? I'm only brave when you're in the room. (her hat brim goes down) I'm trying to be brave the rest of the time too. For practice.",
  ],
  shiro: [
    "(ledger open, quill moving) I've started a new column. It's you. It's longer than the old column on you, and considerably less hostile.",
    "The Lodge's numbers on you were wrong in every particular. (she taps the page) I find I enjoy being wrong about you. That is a new and alarming hobby.",
    "Play a game with me. Chess. (she sets the board) You'll lose. I'll enjoy it. You'll enjoy watching me enjoy it. Everyone wins.",
  ],
  yuki: [
    "(earnestly, holding two cups of tea) I didn't know how you take it so I made it both ways. Pick one! The other one's mine. I don't like either. I just wanted to make you tea.",
    "Everyone deserves a second chance, right? (a small, crooked smile) I think you gave me mine. I keep trying to deserve it.",
    "Can we just sit? We don't have to talk. I like that you don't make me fill the quiet.",
  ],
  elara: [
    "A hundred years I wasn't curious about anything. (she watches you with ancient, delighted eyes) Now I can't stop. It's your fault. Tell me something new.",
    "I remember when they bound the Codex. They were very solemn about it. (she smiles) I prefer how you hold it.",
    "Walk with me. Slowly. Elves are always told we have all the time in the world. I'd like to spend some of it beside you.",
  ],
  seraphine: [
    "My husband is in the country with his horses. (she pours wine she has not asked if you want) My plan for the evening has one item on it. You're it.",
    "Money is a language. I'm fluent. (she slides a purse across) That's for the Menagerie. This — (she takes your hand) — is not a transaction.",
    "Everyone in the upper city thinks I'm having an affair with a warlock. (she sips) I'd hate for them to be wrong.",
  ],
  sister_maren: [
    "(binding a wound that's already healed, just to have her hands busy) I'm sworn to want nothing for myself. (she ties the knot slowly) I've been very bad at it lately.",
    "I prayed this morning. I asked for strength to stop thinking about you. (she smiles, helpless) I think the answer was no.",
    "Sit. You've been carrying everyone again. Let me carry you for an hour.",
  ],
  kira: [
    "(wiping down the bar of the Drowned Rose, which is spotless) House rule: no sleeping with regulars. (she pours you one) You're still a regular. I'm reconsidering the rule.",
    "You want the usual? (she slides it over before you answer) I know your usual. That's how you know you've ruined me.",
    "Slow night. Stay till close. I'll put you to work, and then I won't.",
  ],
  nyxe: [
    "(draped over your chair like she owns it) I beat Rue at cards. Twice. Tell her. Tell her I'm better. Say it with your WHOLE mouth.",
    "Familiars are supposed to serve. (she stretches, smug) I serve you by being gorgeous at you. You're welcome.",
    "...Fine. I missed you. (a pause) If you tell Rue I said that, I'll bite you. (a longer pause) You'd like that, wouldn't you.",
  ],
  rhea: [
    "I used to pray to wings on a spire of black glass. (she kneels, unasked, at your feet) Now I don't need the spire.",
    "Give me something to do for you. Anything. (she means it completely) I'm so much better when I'm useful to you.",
    "Tell me what you want from me today. I'll be very good at it.",
  ],
  valdra: [
    "(at the dawn window, hands folded) Ninety years of rites in the snow. (she does not say whom she prays to now; she does not need to) Sit with me while I finish.",
    "The Coven taught me devotion was obedience. You are teaching me it can be choice. (a slow, old smile) It is a much warmer thing.",
    "Bring me your burdens. I am very old, and very strong, and I would like to carry something I chose.",
  ],
  aurelia: [
    "(reviewing six soldiers' worth of duty rosters) My cohort asks why I follow your orders so readily. I tell them a good legate knows a better commander. (beat) I don't tell them the rest.",
    "Give me an order. Something small. (her mouth curves) I like the way it feels to obey you. I'm still getting used to liking it.",
    "Walk the line with me. My soldiers sleep better when they see us together.",
  ],
  brynn: [
    "(stirring something green and suspicious) It's a tea! Probably. Taste it. If you turn into a frog I'll fix it. Probably.",
    "The Coven wanted my recipes. I said no. (she grins, freckled and fierce) You didn't ask. That's why you get them.",
    "Come forage with me. The good mushrooms only grow where the dead city's quiet. We're quiet together. It works.",
  ],
  sera: [
    "(sealing a letter to the north) I tell my husband I'm writing to my sister. (she presses the wax with your sigil) I don't have a sister.",
    "The Thane reads none of my letters. (dry) He'd find them very educational.",
    "Read this one before I send it. (she hands you a page that is not about the Coven at all) Tell me if it's too much. Don't tell me if it isn't.",
  ],
  seris: [
    "My reports to the College now consist of a single line: 'Still observing.' (she adjusts her spectacles) It is technically true.",
    "I came here to dismantle you. (she studies you over her book) I've been dismantled instead. The methodology was impeccable.",
    "Duel me. Words, not blades. Loser buys dinner. (she always loses on purpose; you both know it)",
  ],
  auren_voss: [
    "Nine years I kept a ledger of the College's crimes. (she closes it) I've started a second one. It's only about you, and it's only good things.",
    "My husband thinks I'm at a salon. (she pours tea with steady, practiced hands) I am. It's a very small salon. You're the only guest.",
    "I'm a mature woman with a great deal of patience. (beat) I have run out of it, specifically regarding you.",
  ],
  revenant_bride: [
    "(her veil moving in a wind that isn't there) Two hundred years I waited for someone to tell me the truth. You did. Tell me another one. Anything. I like how true things sound in your voice.",
    "I am learning to be warm again. (she holds out a cold hand) It's slow. Hold this until it isn't.",
    "Walk with me in the catacombs. They're not frightening when you're there. They're just quiet.",
  ],
  mira_ashveil: [
    "(leaning on the bar of the Lantern & Ash) Three rumors about you came in tonight. Two were true. One was flattering. Want to make it true?",
    "I know everything before the crows do. (she slides you a drink) Except what you're going to do next. I like that.",
    "Close the tavern with me. Help me stack chairs. It's a terrible excuse to keep you. I'm using it anyway.",
  ],
  maren_soleil: [
    "(handing you a sealed envelope) My report on you. Day forty. Subject remains devastating. Recommend continued close observation.",
    "I used to write reports to the College. Now I write them to you. (she flushes) They're getting less dry. It's a problem.",
    "Sit still. I'm describing you for the record. (she isn't writing anything down)",
  ],
  cole_ashmer: [
    "(leaning on the stair rail in his battered Watch coat) College raids the drowned quarter on the first. I warned the families. (beat) I came to warn you. And to see you. Mostly to see you.",
    "Twenty years on the Watch. Never once met someone I'd follow off a cliff. (he shrugs) Funny thing, cliffs.",
    "Walk the night patrol with me. Nothing's out there. I just like the company.",
  ],
  calla: [
    "(turning a cup in her hands) I went down to the Undercroft today. On my own. Just to look. (she smiles) It's only a room now.",
    "Sister. (she laughs) Sorry. I say the word sometimes just to know it still works. That I could stop anything. It makes it easier to not want to.",
    "Stay with me a while. I like being kept, when I'm the one who chose it.",
  ],
  mira_vane: [
    "(turning the thin chain at her wrist) The Coven's brand was a chain. This one I bought myself. (she shows you the clasp) It opens. That's the whole point of it.",
    "I make better wards than I ever made for the Coven's forges. (she glances at you) Better reasons.",
    "Sit. Let me hold your hand. My hands remember the forge. They like remembering you instead.",
  ],
  aelindra: [
    "I noticed you came in from the west stair, twice, with ink on your left cuff. (she smiles) I've stopped reporting it to anyone. I just like knowing.",
    "The Gilded Concord trained me to see everything and keep none of it. (beat) I'm keeping you.",
    "Tell me something I don't already know about you. It's very hard. Please try.",
  ],
  elspeth: [
    "My family paid the Coven my ransom after you'd already saved me. (a dry laugh) I didn't go home. They're still a little confused about it.",
    "I was raised to be decorative. (she holds up hands blistered from Menagerie work) I'd rather be useful. To you.",
    "Teach me something. Anything. Nobody ever let me learn the useful things.",
  ],
};
const GENERIC = [
  "{N} talks with you about nothing in particular for a long, easy hour, and it's the best hour of the day.",
  "{N} tells you a story from before the Codex. You trade one back. Neither of you notices the candles burning down.",
  "You and {N} share a quiet meal on the drowned stair, watching the water.",
];
const TRAIN = [
  "You and {N} spar in the old reading room until you're both laughing and out of breath.",
  "{N} drills with you on the drowned stair: feints, binds, footwork. You learn something about each other's habits.",
  "You run seal-forms together until {N} can anticipate your casting. It's strangely intimate, being read that well.",
];
const WALK = [
  "You walk the dead city's flooded quarter with {N}, lantern between you, and talk about what you'll build when it's yours.",
  "You and {N} climb to the library roof and watch the crows come home.",
  "A slow walk through the Menagerie with {N}, stopping at every pen, in no hurry at all.",
];
export function hangoutSteps(id, kind, name, S) {
  const n = (S.hangouts[id]?.close || 0) + S.day;
  const sub = t => t.replaceAll('{N}', name);
  if (kind === 'talk') {
    const lines = HANGOUT[id];
    return lines ? [{ s: id, t: lines[n % lines.length] }] : [{ s: 'narr', t: sub(GENERIC[n % GENERIC.length]) }];
  }
  const pool = kind === 'train' ? TRAIN : WALK;
  const out = [{ s: 'narr', t: sub(pool[n % pool.length]) }];
  if (HANGOUT[id]) out.push({ s: id, t: HANGOUT[id][(n + 1) % HANGOUT[id].length] });
  return out;
}

// --- evenings: repeatable intimacy once a romance has happened ----------------------
// ask: her invitation; gentle / steamy: the night; the unbound line is Zoe's.
const EVENINGS = {
  vesper: { ask: "(closing the Codex with a soft thump) The candles are leaning again. I'd like to find out what they're leaning toward. Stay?",
    gentle: "She reads to you in bed until her voice goes soft and the ink on the page falls asleep before either of you.",
    steamy: "She pulls you down among the stacks by your collar, ink on her fingertips, and the Binding hums so loud between you that she stops being able to tell whose wanting is whose. She does not mind at all." },
  rue: { ask: "(hooking her tail around your wrist) Okay, so, hypothetically, if a demon wanted you to put her in her place again. Tonight. Hypothetically.",
    gentle: "She curls into you like a cat that would bite anyone who called her one, and falls asleep running hot as a hearthstone.",
    steamy: "You put her in her place, and the brat goes out of her all at once, tail tight around your wrist, forge-hot and breathless and, for once, not saying a single word that could make the brand flare." },
  isolde: { ask: "(unbuckling one gauntlet, then the other, without being asked) I would like to be off watch tonight. With you.",
    gentle: "She sleeps with her scarred palms open against your chest, as if they had never once been something to hide.",
    steamy: "She kneels to unlace your boots, and then you raise her up, and she gives herself to the night with the same terrible, total devotion she once gave the Order, and it is entirely yours." },
  lysandre: { ask: "(scales rippling up her arms) Pick a shape for tonight. Or don't. I like it when we find out together.",
    gentle: "She drifts between shapes as she falls asleep, and every one of them curls toward you.",
    steamy: "She shifts beneath your hands from shape to shape, scales to skin to coil, laughing at each new way to hold you, until she settles into the one that makes you both forget there were others." },
  erin: { ask: "(dropping her shield by your door with a clang) I'm off duty. Like, all the way off. Wanna find out what that looks like?",
    gentle: "She falls asleep mid-sentence, arm thrown across you like a shield she's decided you need.",
    steamy: "Erin is all warmth and strength and loud, happy laughter, the golden knight undone piece by piece, and she is not quiet about any of it, and she does not care who hears." },
  sakura: { ask: "(hat in both hands, very red) I practiced asking. Forty times. Can I — would you — tonight?",
    gentle: "She falls asleep with her face tucked against your shoulder, still murmuring apologies to no one.",
    steamy: "The shy elf turns out to be the most dangerous talent in the Lodge in more ways than one; petals of stray magic drift down around you both all night, and she stops apologizing entirely." },
  shiro: { ask: "(closing the ledger) I have budgeted an evening. There is no line item for it. It is entirely unaccounted for. I'd like you to help me spend it.",
    gentle: "She falls asleep with her hair unpinned across your pillow, the most unguarded you've ever seen the White Queen.",
    steamy: "The White Queen plays the night like a long, patient game, every move deliberate, and then, at the end, she tips over her own king with a laugh you'll remember for years." },
  yuki: { ask: "(earnest and nervous all at once) Can I stay tonight? Not for anything. Or — for anything. Whatever you want. I just want to be here.",
    gentle: "Yuki falls asleep holding your hand like it's the second chance {Y:they|she} never expected to get.",
    steamy: "Yuki gives the night everything {Y:they have|she has}, earnest and trembling and fearless, and when it's over {Y:they laugh|she laughs} into your neck like {Y:they can't believe they're|she can't believe she's} allowed." },
  elara: { ask: "I've lived a long time and I've never once been in a hurry. (she takes your hand) Let's not hurry tonight either.",
    gentle: "She tells you about the Codex's binding, centuries ago, in a whisper, until you both drift off.",
    steamy: "Elara takes her time, the way only someone with centuries can, curious about every inch of you as if she's discovered something new in the world after a hundred years of nothing." },
  seraphine: { ask: "(setting down her wine) My husband is away for a week. I've cleared my calendar. All of it.",
    gentle: "She falls asleep in silk sheets she brought from the upper city specifically for your bed.",
    steamy: "Seraphine has a plan, and she executes it flawlessly, and then, somewhere around midnight, the plan falls apart completely and she discovers she likes that even better." },
  sister_maren: { ask: "(her hands folded very tightly) I'm sworn to want nothing. (she unfolds them) I want tonight.",
    gentle: "She prays once before sleep, very quietly, and you don't ask what for, and she holds your hand through all of it.",
    steamy: "The woman who was sworn to want nothing wants everything, slowly, reverently, and then not slowly at all." },
  kira: { ask: "(flipping the Drowned Rose's sign to CLOSED) House rule's officially dead. Come upstairs.",
    gentle: "She falls asleep above the bar with the sounds of the drowned city through the window and your arm around her.",
    steamy: "Upstairs over the Drowned Rose, Kira kisses you like she's been waiting since the first time you ordered, and every rule she ever had goes out the window with the rest of the night." },
  nyxe: { ask: "(sprawling across your bed before you've even said yes) Make me behave. I dare you. I double dare you.",
    gentle: "She falls asleep insisting she isn't tired, still clutching your sleeve.",
    steamy: "You take the dare. The Abyssal brat fights you for every inch and loses every one, delighted, and by the end she's the one begging, which she will deny forever." },
  rhea: { ask: "(kneeling at the foot of your bed) Let me worship you tonight. Please.",
    gentle: "She falls asleep at your feet, then in your arms when you pull her up, smiling like she's found her altar.",
    steamy: "Rhea's devotion is total, fervent, and unbearably focused, and you let her pour all of it into you until she's trembling and radiant." },
  valdra: { ask: "(at your door at dusk) I have kept rites in the snow for ninety years. Let me keep one here.",
    gentle: "She sleeps with her hand over your heart, keeping time like a prayer.",
    steamy: "The old priestess knows every rite of the body there is, and performs each one with slow, solemn, devastating attention, until the candle burns down and she starts again." },
  aurelia: { ask: "(standing at attention in your doorway) Reporting for duty. (a slow smile) Give me my orders.",
    gentle: "She falls asleep the instant you tell her she can, like a soldier finally relieved of watch.",
    steamy: "You give the orders. The legate follows every one of them perfectly, and then begs, very correctly, for more." },
  brynn: { ask: "(holding up a vial) Candle that smells like rain. I made it for tonight. Light it with me?",
    gentle: "You fall asleep to the smell of rain and her freckled shoulder under your cheek.",
    steamy: "Brynn is warm and earthy and endlessly curious, laughing as she experiments, the hedge-witch delighted by every reaction she can coax out of you." },
  sera: { ask: "(handing you a letter, unsealed) Read it after I've left in the morning. (she takes your hand) Tonight, read me.",
    gentle: "She sleeps late for the first time in years, no crows, no husband, no north.",
    steamy: "Sera writes to you in letters; tonight she says everything out loud, every word she never dared commit to ink, and then some she didn't know she had." },
  seris: { ask: "(removing her spectacles) Hypothesis: you and I, tonight. I'd like to test it rigorously.",
    gentle: "She falls asleep mid-lecture on your chest, spectacles still in her hand.",
    steamy: "Seris tests the hypothesis with exhaustive rigor, revisiting every variable twice, and concludes, breathless, that further study is essential." },
  auren_voss: { ask: "(closing the second ledger) I am a patient woman. I have been patient for nine years. Not tonight.",
    gentle: "She falls asleep with her hair loose for the first time in front of anyone, a regent's wife who finally gets to be only herself.",
    steamy: "Lady Voss is unhurried, practiced, and utterly without hesitation, a woman who knows exactly what she wants and has decided, finally, to take all of it." },
  revenant_bride: { ask: "(her veil lifting) I died on my wedding night. (she takes your hand, slowly warming) Give me one now.",
    gentle: "She falls asleep warm, which she has not been in two hundred years, and does not let go of you.",
    steamy: "The Bride warms by degrees beneath your hands, cold to cool to fever-bright, laughing in wonder at every heartbeat she didn't know she still had." },
  mira_ashveil: { ask: "(locking the Lantern & Ash's door) Last call was an hour ago. You stayed. I noticed.",
    gentle: "She falls asleep upstairs above the tavern, your hand in hers, the street finally quiet.",
    steamy: "Mira knows every rumor in the city, and tonight she makes a few new ones, loud and gleeful and absolutely true." },
  maren_soleil: { ask: "(handing you a report) Day forty-one. Recommendation: immediate, extended, close observation. Tonight.",
    gentle: "She falls asleep mid-dictation, still murmuring observations against your skin.",
    steamy: "Maren observes everything, closely, thoroughly, with the dedication of a former College agent who finally has a subject worth all of her attention." },
  cole_ashmer: { ask: "(hat in his hands) I'm off watch. For the night. (he clears his throat) If you'd have me.",
    gentle: "He falls asleep with his battered Watch coat over both of you like a blanket.",
    steamy: "Cole is steady and careful and then not careful at all, a man who's spent twenty years guarding other people finally letting someone in past the gate." },
  calla: { ask: "(taking your hand) Not the game tonight. Just us. Just this.",
    gentle: "She falls asleep with no chain, no cell, no word to say. She doesn't need one.",
    steamy: "No roles tonight, only Calla, choosing you with every breath, free and fierce and entirely herself." },
  mira_vane: { ask: "(unclasping the thin chain at her wrist and setting it on your nightstand) I want to be held tonight. Just held. And then not just.",
    gentle: "She falls asleep with her bare wrist in your hand.",
    steamy: "Mira Vane gives herself to the night with her chain on your nightstand and nothing at all at her wrists, and she has never felt freer." },
  aelindra: { ask: "I've noticed seventeen things about you tonight. (she steps closer) I'd like to notice more. Up close.",
    gentle: "She falls asleep cataloguing your heartbeat, and for once, she reports it to no one.",
    steamy: "Aelindra notices everything, and tonight she uses all of it, finding every secret you never knew you had, and keeping each one." },
  elspeth: { ask: "(nervous, determined) Nobody ever let me choose anything. I choose this. I choose you. Tonight.",
    gentle: "She falls asleep tucked against you, a noble's daughter who decided where she belongs.",
    steamy: "Elspeth was raised to be decorative; tonight she is anything but, eager and bold and discovering, with delight, exactly what she likes." },
};
export const EVENING_IDS = Object.keys(EVENINGS);

function evening(id, o) {
  return {
    id: `${id}_evening`, where: 'home', once: false,
    cond: free(id, S => romanced(S, id)),
    tags: ['repeatable'],
    steps: [
      { s: id, t: o.ask },
      { choice: [
        { t: 'Spend the night together.', flag: 'evening_yes', r: [
          { s: 'narr', cond: mantled, t: 'Your Mantle unfurls in the candlelight, and they make a soft, delighted sound at the sight of it.' },
          { s: 'narr', t: o.gentle, spice: 'gentle' },
          { s: 'narr', t: o.steamy, spice: 'steamy' },
          { s: 'narr', t: '', spice: 'unbound', stub: `${id}_evening` }, // ZOE: unbound
        ] },
        { t: '"Just stay and talk tonight."', r: [{ s: 'narr', t: 'You talk until the candles gutter, and fall asleep somewhere in the middle of a sentence. It is exactly enough.' }] },
      ] },
    ],
  };
}

// --- the Dawnward Company's own romances ------------------------------------------
function dawnward(E) {
  const bent = S => !!S.flags.dawnward_bent;
  E.erin_romance = romance('erin', { name: 'Erin', bond: 7, tags: ['romance'], cond: bent,
    lead: [
      { s: 'narr', t: 'Erin challenges you to a spar in the reading room and loses, which she has never done on purpose before. She stays down on the floorboards, laughing up at you.' },
      { s: 'erin', t: 'I keep losing to you. On purpose, now. (her grin wobbles into something honest) I don\'t want to win anything you\'re not part of.' },
    ],
    choices: [
      { t: 'Pull her up and kiss her.', tone: 'kind', r: [{ s: 'erin', t: '(against your mouth, laughing) FINALLY.' }],
        gentle: 'You pull her up and she kisses you like she charges a rift: all at once, all in, no armor anywhere.',
        steamy: 'You pull her up and she kisses you like she charges a rift, all at once and all in, and the golden knight\'s armor comes off piece by piece on the reading-room floor with a great deal of laughter and absolutely no shame.' },
      { t: '"Stay down. I like you there."', tone: 'dom', r: [{ s: 'erin', t: '(going very red, very still, very happy) ...Yes. Okay. Yes.' }],
        gentle: 'She stays down. You join her there. It is the best spar of her life.',
        steamy: 'She stays exactly where you put her, and discovers, with loud and delighted surprise, how much she likes being told to.' },
    ],
    chronicle: 'Erin of the Dawnward lost a spar on purpose, and won something better.' });
  E.sakura_romance = romance('sakura', { name: 'Sakura', bond: 7, tags: ['romance', 'shy'], cond: bent,
    lead: [
      { s: 'narr', t: 'Sakura has been standing outside your door for eleven minutes. You know because the Codex keeps count of things that hover.' },
      { s: 'sakura', t: "(when you open it, hat crushed in both hands) I'm sorry. I'm — no. I'm not sorry. (deep breath) I wanted to be brave at you. Can I be brave at you?" },
    ],
    choices: [
      { t: '"Be brave at me."', tone: 'kind', r: [{ s: 'sakura', t: '(she kisses you, very fast, and then very slowly)' }],
        gentle: 'She kisses you like she casts: hesitant for exactly one breath, and then the most dangerous talent in the Lodge.',
        steamy: 'She is shy for exactly one breath, and then she isn\'t; petals of stray magic drift down around you both all night, and the timid elf stops apologizing to anyone about anything.' },
      { t: 'Take her hat, set it aside, and draw her in.', tone: 'dom', r: [{ s: 'sakura', t: '(a tiny, wrecked squeak) Oh. Oh, okay. Yes.' }],
        gentle: 'Without the hat brim to hide behind, she meets your eyes the whole time.',
        steamy: 'Without the hat to hide behind she has nowhere to look but you, and she finds she doesn\'t want to look anywhere else, all night.' },
    ],
    chronicle: 'Sakura was brave at you.' });
  E.shiro_romance = romance('shiro', { name: 'Shiro', bond: 7, tags: ['romance', 'slow-burn'], cond: bent,
    lead: [
      { s: 'shiro', t: '(closing the ledger with finality) I have run the numbers on us forty-one times. (she sets it down) I would like to stop running them and simply find out.' },
    ],
    choices: [
      { t: '"Then find out."', tone: 'kind', r: [{ s: 'shiro', t: 'Variables accepted.' }],
        gentle: 'The White Queen kisses you like a final move she has been planning for a very long time, and is pleased to find it was correct.',
        steamy: 'She takes her pins out one by one and plays the night like a long, patient game, every move deliberate, until the moment she gives up strategy entirely and simply wants.' },
      { t: 'Take the ledger and write one line in it.', tone: 'dom', r: [{ s: 'shiro', t: '(reading it, very still) ...Yes. That is the correct entry.' }],
        gentle: 'She asks you to read it aloud. You do. She does not let you finish.',
        steamy: 'You write MINE in her immaculate ledger, and the White Queen, for the first time in her life, does exactly as she is told, all night, with tremendous enthusiasm.' },
    ],
    chronicle: 'Shiro stopped running the numbers on you.' });
  E.yuki_romance = romance('yuki', { name: 'Yuki', bond: 7, tags: ['romance'], cond: bent,
    lead: [
      { s: 'yuki', t: '(holding two cups of tea, both going cold) I keep making you tea so I have a reason to come in. ({Y:they set|she sets} them down) I don\'t want a reason anymore. I just want to come in.' },
    ],
    choices: [
      { t: '"Come in."', tone: 'kind', r: [{ s: 'yuki', t: '(a breath that shakes) Okay. Okay.' }],
        gentle: 'Yuki holds you like a second chance {Y:they|she} never expected, and falls asleep smiling.',
        steamy: 'Yuki gives you everything {Y:they have|she has}, earnest and trembling and fearless, and laughs into your neck afterward like {Y:they can\'t believe they\'re|she can\'t believe she\'s} allowed this.' },
      { t: 'Take the cold tea out of {Y:their|her} hands and kiss {Y:them|her}.', tone: 'dom', r: [{ s: 'yuki', t: '(dazed) ...The tea was a really good plan. This is a better plan.' }],
        gentle: '{Y:They stay|She stays}. Neither of you remembers the tea.',
        steamy: '{Y:They stay|She stays}, and the tea goes stone cold on the table, and Yuki discovers, wide-eyed, exactly how much {Y:they|she} wanted to be taken in hand.' },
    ],
    chronicle: 'Yuki stopped needing a reason to come in.' });

  // Yuki's request: the change they've wanted since long before the Company.
  // Theirs to ask for; the Codex only does it because Yuki wants it.
  E.yuki_change = {
    id: 'yuki_change', where: 'guild', once: true, priority: 52,
    cond: free('yuki', S => bent(S) && (S.bond.yuki || 0) >= 5 && !S.flags.yuki_femme),
    steps: [
      { s: 'narr', t: 'Yuki asks to talk somewhere private. They choose the reading room at dusk, the Codex open between you, and spend a long time not saying anything.' },
      { s: 'yuki', t: "Can I tell you something I've never said out loud? (their hands are shaking) Since before the Company. Before the Lodge, even. I've wanted to be a girl. Not pretend. Not dress up. Be one." },
      { s: 'yuki', t: "The Codex rewrites things. Brands, pacts, bodies sometimes; I've watched it. (very small) Could it rewrite me? Only if you'd help. Only because I'm asking." },
      { choice: [
        { t: '"If it\'s what you want, then yes. All the way."', tone: 'kind', bond: { yuki: 2 }, flag: 'yuki_femme', r: [] },
        { t: '"You don\'t need magic to be her. But if you want it, I\'ll help."', tone: 'kind', bond: { yuki: 2 }, flag: 'yuki_femme', r: [] },
        { t: '"Take a little more time. Ask me again when you\'re sure."', tone: 'kind', reopen: true, r: [
          { s: 'yuki', t: "(a small, steady nod) I am sure. But... okay. Thank you for asking me that. I'll come back." },
        ] },
      ] },
      { s: 'narr', cond: S => !!S.flags.yuki_femme, t: 'The binding takes all night, and it is gentle. By dawn the Codex has written her the way she has always been underneath: softer hips, a fuller chest, long hair she keeps touching to make sure it\'s real.' },
      { s: 'yuki', cond: S => !!S.flags.yuki_femme, t: "(laughing and crying into her own hair) It's me. It's actually me." },
      { s: 'erin', cond: S => !!S.flags.yuki_femme && has(S, 'erin'), t: '(barreling into the reading room) YUKI. Oh my gods. You look RIGHT. You look so right!' },
      { s: 'sakura', cond: S => !!S.flags.yuki_femme && has(S, 'sakura'), t: '(from behind her hat, tearing up) We always knew. We were just waiting for you to know too.' },
      { s: 'shiro', cond: S => !!S.flags.yuki_femme && has(S, 'shiro'), t: "Welcome home, Yuki. (she makes a note in the ledger, and doesn't hide it) Correcting the record." },
      { s: 'codex', cond: S => !!S.flags.yuki_femme, t: '[ YUKI — she/her from now on. ]' },
      { chronicle: 'Yuki asked the Codex to write her as she is.' },
    ],
  };
}

export function install(EVENTS) {
  dawnward(EVENTS);
  for (const [id, o] of Object.entries(EVENINGS)) EVENTS[`${id}_evening`] = evening(id, o);
}
