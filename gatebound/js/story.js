// ============================================================
// GATEBOUND — story & dialogue
// Step format:
//   { s:'sakura', t:'line' }                       spoken line ({name} = player)
//   { s:'narr', t:'...' }                          narration
//   { s:'sys',  t:'...' }                          System window
//   { choice:[{ t, bond:{girl:+n}, flag, r:[steps] }] }  choice; r plays after pick
//   { flag:'id' }  { give:{gold,item} }            side effects
// Events: { id, where:'auto'|'guild'|'camp', once, cond(S), priority, steps }
// S = savegame state (see state.js) — cond must be side-effect free.
// ============================================================

export const SPEAKERS = {
  narr:   { name: '',            color: '#8fa3bf' },
  sys:    { name: 'SYSTEM',      color: '#54d8ff' },
  player: { name: '{name}',      color: '#e8d8a8' },
  sakura: { name: 'Sakura',      color: '#ff9ec6' },
  erin:   { name: 'Erin',        color: '#7db4ff' },
  shiro:  { name: 'Shiro',       color: '#e6e6fa' },
  yuki:   { name: 'Yuki',        color: '#a8d8b0' },
  guild:  { name: 'Guildmaster Hale', color: '#d8a869' },
  crier:  { name: 'Guild Crier', color: '#b0a890' },
  scout:  { name: 'Rat-Faced Recruiter', color: '#9a8f7a' },
};

const E = {};
export const EVENTS = E;

// ------------------------------------------------------------
// OPENING — adapted from the source scenario
// ------------------------------------------------------------

E.intro = {
  id: 'intro', where: 'auto', once: true, priority: 100,
  steps: [
    { s: 'narr', t: 'The guild\'s assessment chamber hums with residual mana as four freshly minted licenses materialize on the counter.' },
    { s: 'narr', t: 'Sakura picks hers up first, tracing the embossed letter with one fingertip.' },
    { s: 'sakura', t: 'A-Class...' },
    { s: 'narr', t: 'A smile flickers across her face before she catches herself, tucking a strand of pink hair behind one pointed ear.' },
    { s: 'erin', t: 'Same! Honestly, I figured you\'d hit S-rank with that casting talent of yours.' },
    { s: 'shiro', t: 'Surprising you cleared A at all. I had you pegged for D.' },
    { s: 'erin', t: 'Excuse me?' },
    { s: 'shiro', t: 'Apologies. I forgot you struggle with basic comprehension. Should I simplify?' },
    { s: 'narr', t: 'Sakura barely catches Erin\'s arm in time. Shiro sips her tea, unbothered, license already filed away.' },
    { s: 'narr', t: 'The commotion dies when they notice Yuki. He stands apart, staring down at his license like it has bitten him.' },
    { s: 'yuki', t: '...D-Class.' },
    { s: 'narr', t: 'Nobody speaks. Sakura\'s grip loosens. Shiro\'s teacup pauses halfway to her lips.' },
    { s: 'yuki', t: 'I\'ll catch up. However long it takes. Just... wait for me.' },
    { s: 'narr', t: 'The girls exchange glances and say nothing at all.' },
    { s: 'narr', t: '— Three days later —' },
    { s: 'narr', t: 'Guild law is carved above the assignment board in letters of brass: NO PARTY BELOW FOUR SHALL ENTER A GATE. Three A-ranks cannot hunt as three.' },
    { s: 'narr', t: 'Which is why every unattached adventurer in the hall is looking at them the way wolves look at separated prey.' },
  ],
};

E.recruit = {
  id: 'recruit', where: 'auto', once: true, priority: 99,
  steps: [
    { s: 'narr', t: 'You are nobody. Registered yesterday. License so new the ink still smells. Rank: F — the letter they give you for simply not dying during the paperwork.' },
    { s: 'narr', t: 'You\'re nursing the guild\'s cheapest tea when the recruiter oozes over to the A-rank table.' },
    { s: 'scout', t: 'Ladies! Word is you need a fourth. My boys run escort at a very fair rate — sign here and we\'ll have you in a gate by sundown.' },
    { s: 'narr', t: 'He slides a contract across the table. Sakura leans away from it. Erin picks it up, trusting as ever. Shiro\'s pale eyes narrow one half-millimeter.' },
    { s: 'narr', t: 'From where you sit, you can read the clause printed small along the fold.' },
    { choice: [
      { t: 'Call it out: "Clause nine. Their cut doubles inside the gate — and you waive rescue obligation."', bond: { shiro: 1 }, flag: 'impressed_shiro',
        r: [
          { s: 'narr', t: 'The hall goes quiet. The recruiter\'s smile dies by inches.' },
          { s: 'shiro', t: '...Clause nine.' },
          { s: 'narr', t: 'Shiro reads it. Then she looks at you — actually looks, the way a chess player looks at an unexpected move.' },
          { s: 'shiro', t: 'Hm.' },
        ] },
      { t: 'Step between him and the table. "They said no."', bond: { erin: 1 }, flag: 'impressed_erin',
        r: [
          { s: 'narr', t: 'You didn\'t hear them say no. But judging by the recruiter\'s face, he knows they would have — eventually, after it was too late.' },
          { s: 'erin', t: '...We did say no. Just now. You heard us.' },
          { s: 'narr', t: 'Erin grins at you sideways, delighted, like you\'ve just passed a test she didn\'t know she was giving.' },
        ] },
      { t: 'Quietly refill Sakura\'s tea and slide it to her. Let the wolves posture.', bond: { sakura: 1 }, flag: 'impressed_sakura',
        r: [
          { s: 'narr', t: 'Sakura blinks at the cup. Then at you. Her ears go slightly pink at the tips.' },
          { s: 'sakura', t: 'Th-thank you... um. He\'s lying, isn\'t he. About the contract.' },
          { s: 'player', t: 'Clause nine. Read it before your knight signs anything.' },
          { s: 'narr', t: 'Shiro plucks the contract from Erin\'s hands and reads. Her expression does not change. The recruiter leaves anyway, at speed.' },
        ] },
    ] },
    { s: 'narr', t: 'Which is how you end up standing in front of three A-rank adventurers, holding an F-rank license, being measured.' },
    { s: 'erin', t: 'We need a fourth. Guild law. You need... honestly, what do you need? You\'re F-rank, you\'d be safer herding sheep.' },
    { s: 'shiro', t: 'He\'s convenient. F-rank means the guild classifies him as escorted baggage. No split renegotiation, no seniority claims.' },
    { s: 'sakura', t: 'Shiro! He\'s— you\'re right here, I\'m so sorry—' },
    { s: 'shiro', t: 'It\'s on a trial basis. You carry supplies. You stay behind Erin. If you die, I am not filling out the paperwork.' },
    { s: 'narr', t: 'And then — as your hand touches the party ledger — the world stops.' },
    { s: 'sys', t: '[ You have been designated: PLAYER. ]' },
    { s: 'sys', t: '[ The System will now measure you. Every gate. Every kill. Every level. Do not disappoint. ]' },
    { s: 'narr', t: 'Blue light no one else can see hangs in the air. A quest log. A level: 1. A path leading up, and up, and up.' },
    { s: 'player', t: '(...I can work with this.)' },
    { s: 'erin', t: 'Welcome aboard, recruit! Try not to die, okay? Sakura cries at funerals.' },
    { s: 'sakura', t: 'E-Erin!!' },
  ],
};

// ------------------------------------------------------------
// GUILD EVENTS — Yuki thread & promotions
// ------------------------------------------------------------

E.yuki_letter_1 = {
  id: 'yuki_letter_1', where: 'guild', once: true, priority: 50,
  cond: S => S.day >= 3,
  steps: [
    { s: 'narr', t: 'A letter waits at the party\'s table, wax-sealed with a merchant house crest. Erin reads it aloud.' },
    { s: 'erin', t: '"Dear Erin, Shiro, and Sakura. Today I cleared my third F-gate. The goblins are smaller than the textbook said. My instructor says my form is improving—" aw, he underlined *improving* twice.' },
    { s: 'sakura', t: 'He\'s trying so hard...' },
    { s: 'shiro', t: 'Three F-gates in a week. At that pace he will reach C-rank in approximately four years.' },
    { s: 'narr', t: 'Nobody answers that. Sakura folds the letter very carefully, like it might bruise.' },
    { s: 'shiro', t: '...I did not say it to be cruel. I said it because someone here should be doing the arithmetic.' },
  ],
};

E.yuki_letter_2 = {
  id: 'yuki_letter_2', where: 'guild', once: true, priority: 50,
  cond: S => S.rankIdx >= 1 && S.seen.yuki_letter_1,
  steps: [
    { s: 'narr', t: 'Another letter. This one is shorter, and the handwriting presses harder into the paper.' },
    { s: 'yuki', t: '"I heard your new fourth made D-rank already. That\'s wonderful. Truly. I mean that. I\'m happy for the party. I have to go, my training block is starting. — Yuki."' },
    { s: 'erin', t: '...He means it, you know. That\'s the worst part. He genuinely means every word.' },
    { s: 'shiro', t: 'Meaning it and being at peace with it are different things. Even a lamb notices when the field moves on without him.' },
    { s: 'sakura', t: '(quietly) ...Should we write back?' },
    { s: 'narr', t: 'They do. All three of them. You notice none of them show the others what they wrote.' },
  ],
};

E.yuki_joins = {
  id: 'yuki_joins', where: 'guild', once: true, priority: 60,
  cond: S => S.rankIdx >= 2,
  steps: [
    { s: 'narr', t: 'He\'s waiting at the guild doors when you arrive — thinner than the stories made him sound, sword too clean, smile too wide.' },
    { s: 'yuki', t: 'Erin! Shiro! Sakura! And you must be {name}. I\'ve — I\'ve heard a lot. C-rank in weeks. That\'s incredible.' },
    { s: 'narr', t: 'His handshake is earnest and slightly too long. Up close you can see what the letters hid: the split knuckles, the exhaustion worn like a uniform.' },
    { s: 'yuki', t: 'I made D-rank properly now. Cleared the assessment. So I was thinking — one gate. Together. Like we always planned. The guild says a D can enter a C-gate if the party carries them, and, well.' },
    { s: 'narr', t: 'He laughs at himself before anyone else can.' },
    { s: 'yuki', t: 'I\'m asking to be carried. I know. But I want to see it. What you\'re all becoming.' },
    { s: 'sakura', t: 'Yuki...' },
    { s: 'shiro', t: '(to you, flat and quiet) Your call, baggage handler. You\'re the one who\'ll be covering him.' },
    { choice: [
      { t: '"One gate. Stay behind Erin, swing when I say swing."', flag: 'yuki_guest', bond: { sakura: 1 },
        r: [
          { s: 'yuki', t: 'Yes! Yes — behind Erin, swing on command. I can do that!' },
          { s: 'erin', t: 'Stars help me, there\'s two of them now.' },
          { s: 'narr', t: '(Yuki will join your next gate as a fifth party member.)' },
        ] },
      { t: '"Not yet. Get to C on your own — it\'ll mean more."', flag: 'yuki_refused',
        r: [
          { s: 'narr', t: 'Something crosses his face — hurt, then, slowly, something sturdier.' },
          { s: 'yuki', t: '...Yeah. Yeah, you\'re right. When I walk into a gate with you all, I want it to be because I earned the door.' },
          { s: 'shiro', t: '(almost inaudible) Hm. Correct answer.' },
          { s: 'shiro', t: '...Both of you stop looking at me.' },
        ] },
    ] },
  ],
};

E.yuki_confront = {
  id: 'yuki_confront', where: 'guild', once: true, priority: 60,
  cond: S => S.rankIdx >= 4,
  steps: [
    { s: 'narr', t: 'A-rank. Your license is red now, and the guild hall parts around your party like water. Which makes the scene at the notice board impossible to miss.' },
    { s: 'yuki', t: 'I\'m not asking you to break the betrothal, Shiro. I\'m asking you to tell me the truth. Do you want it?' },
    { s: 'narr', t: 'Shiro stands very straight, grimoire held like a shield. Sakura hovers. Erin has stopped pretending to read the board.' },
    { s: 'shiro', t: 'Want is a luxury line-item my house cannot currently afford.' },
    { s: 'yuki', t: 'That\'s a no. I\'ve been to twelve cities and forty gates and I have finally, FINALLY learned to hear a no, Shiro.' },
    { s: 'narr', t: 'He isn\'t angry. That\'s the strange thing. He\'s steadier than you\'ve ever seen him — like a man who has been carrying a pack for years and just realized he\'s allowed to set it down.' },
    { s: 'yuki', t: 'My father\'s ledgers will honor your family\'s debts either way. I signed the release before I came. Marriage was never supposed to be a mortgage.' },
    { s: 'narr', t: 'Sakura makes a small sound. Erin\'s hand is white-knuckled on her scarf. Three betrothals, and he is unpicking his own claim to all of them, stitch by stitch, in the middle of the guild hall.' },
    { s: 'yuki', t: 'I made a vow to catch up before I let anyone wait for me. I\'m B-rank as of yesterday. I\'ll make A. But nobody waits anymore. Not for me. Not... for anyone.' },
    { s: 'narr', t: 'And then, because he is still Yuki, he ruins the gravitas by bowing to the wrong depth and knocking a stack of gate notices off the board.' },
    { choice: [
      { t: 'Help him gather the papers. "That took spine, Beaumont."', flag: 'honored_yuki',
        r: [
          { s: 'yuki', t: 'It took four years and one very humbling party of A-ranks, actually.' },
          { s: 'narr', t: 'He grips your forearm, adventurer-fashion. First time he\'s done it like he means it.' },
          { s: 'yuki', t: 'Take care of them, {name}. Not because they need it. Because they deserve it.' },
        ] },
      { t: 'Stay quiet. This is theirs to finish.', flag: 'stayed_quiet',
        r: [
          { s: 'narr', t: 'Sakura is the one who breaks the silence — tearfully, and with a hug that nearly knocks him over. Erin ruffles his hair like a little brother\'s. Shiro...' },
          { s: 'shiro', t: '(very quietly) The release clause. Show me the wording. If you\'ve beggared your own house for a gesture I will reverse it myself.' },
          { s: 'narr', t: 'It\'s the kindest thing you\'ve ever heard her say.' },
        ] },
    ] },
    { flag: 'betrothal_ended' },
  ],
};

// Promotion scenes — fired automatically when license rank increases.

E.promo_D = {
  id: 'promo_D', where: 'auto', once: true, priority: 90,
  steps: [
    { s: 'guild', t: 'By witness of clears recorded: {name}, F-rank... is F-rank no longer. D-Class. Fastest promotion this office has stamped in nine years.' },
    { s: 'erin', t: 'NINE YEARS. Did you hear— {name}, that\'s— okay, drinks are on Shiro!' },
    { s: 'shiro', t: 'They are not. But the sentiment stands. Your growth curve is... statistically objectionable.' },
    { s: 'sakura', t: '(whispering) I told you. I told you both. I watched him in the gate — the monsters make sense to him.' },
    { s: 'sys', t: '[ Rank D achieved. The System is... mildly satisfied. Deeper gates await. ]' },
  ],
};
E.promo_C = {
  id: 'promo_C', where: 'auto', once: true, priority: 90,
  steps: [
    { s: 'guild', t: 'C-Class. At this pace, {name}, I\'m to inform you the assessment board would like to "study you." I told them to get in line.' },
    { s: 'shiro', t: 'A month ago you were escorted baggage. I have rerun the arithmetic eleven times. It does not balance. People do not grow like this.' },
    { s: 'player', t: 'And yet.' },
    { s: 'shiro', t: '...And yet. (Her eyes narrow — not with suspicion this time. With appetite. A puzzle worth solving.)' },
    { s: 'sys', t: '[ Rank C achieved. The measured pace of your world begins to bore the System. Faster. ]' },
  ],
};
E.promo_B = {
  id: 'promo_B', where: 'auto', once: true, priority: 90,
  steps: [
    { s: 'guild', t: 'B-Class. The paperwork has a waiting list of parties offering to poach you, {name}. I am legally required to show it to you.' },
    { s: 'erin', t: 'He\'s ours. (beat) The party\'s! The party\'s. Guild law. Four minimum. You can\'t have him.' },
    { s: 'sakura', t: '(Sakura has set a small pastry in front of you and is pretending very hard that she didn\'t.)' },
    { s: 'sys', t: '[ Rank B achieved. Above you now: only A, and the red gates where A-ranks go quiet. ]' },
  ],
};
E.promo_A = {
  id: 'promo_A', where: 'auto', once: true, priority: 90,
  steps: [
    { s: 'guild', t: 'A-Class. Say it back to me, kid, because I stamped four of these the day your party graduated and I never thought I\'d stamp a fifth that mattered more.' },
    { s: 'narr', t: 'The hall is on its feet. Somewhere in the noise, three A-ranks are looking at you — the baggage, the fourth, the stray — standing exactly level with them.' },
    { s: 'erin', t: 'Equal footing. Huh. So that\'s what it looks like.' },
    { s: 'shiro', t: 'It looks expensive. The betting pool I ran against this outcome certainly was.' },
    { s: 'sakura', t: 'We\'re... we\'re the same rank now. All four of us. (Her smile could power the guild\'s lamps for a week.)' },
    { s: 'sys', t: '[ Rank A achieved. One letter remains. The Monarch\'s door will open soon. Sharpen. ]' },
  ],
};
E.promo_S = {
  id: 'promo_S', where: 'auto', once: true, priority: 90,
  steps: [
    { s: 'guild', t: 'There is no ceremony for S. There are only seven of you on the continent, and the other six wrote to ask who you are.' },
    { s: 'sys', t: '[ Rank S achieved. The System is satisfied. A gate has opened that only you can open back. It is waiting on the map. Finish this. ]' },
    { s: 'narr', t: 'On the world map, something new burns gold: THE MONARCH\'S THRESHOLD.' },
  ],
};

// ------------------------------------------------------------
// CAMP EVENTS — bonds (fire after dungeon clears)
// ------------------------------------------------------------

// --- Sakura ---

E.sakura_cooking = {
  id: 'sakura_cooking', where: 'camp', once: true, priority: 40,
  cond: S => S.bond.sakura >= 2,
  steps: [
    { s: 'narr', t: 'Camp, after the clear. Sakura has produced — from a pack that mostly holds spell reagents — a folding pan, three spice tins, and the smell of something wonderful.' },
    { s: 'sakura', t: 'It\'s just stew. Anyone can make stew. Erin likes it with too much pepper and Shiro pretends she doesn\'t want seconds, so I just... learned to make it how everyone...' },
    { s: 'narr', t: 'She trails off, stirring. On the log beside her, half-hidden under a mitten, is a battered novel: "THE BLACKGUARD\'S BRIDE, Vol. IV."' },
    { choice: [
      { t: '"Volume four? What happened in volume three?"', bond: { sakura: 1 },
        r: [
          { s: 'sakura', t: 'He fakes his own execution and steals the duchess from her own wedding and— you\'ve READ them?!' },
          { s: 'player', t: 'No. But I\'m starting to understand your combat aesthetic.' },
          { s: 'sakura', t: '(scandalized, delighted, hiding under her hat brim) ...Please don\'t tell Erin. She thinks I read theology.' },
        ] },
      { t: '"The stew\'s incredible, Sakura."', bond: { sakura: 1 },
        r: [
          { s: 'sakura', t: '(Her ears go pink to the tips. She stirs faster.)' },
          { s: 'sakura', t: 'It\'s— you have to say that, we\'re party members, there\'s a morale clause...' },
          { s: 'player', t: 'There\'s no morale clause.' },
          { s: 'sakura', t: 'There should be. I\'d be very good at it.' },
        ] },
    ] },
  ],
};

E.sakura_villain = {
  id: 'sakura_villain', where: 'camp', once: true, priority: 41,
  cond: S => S.bond.sakura >= 4 && S.seen.sakura_cooking,
  steps: [
    { s: 'narr', t: 'She corners you after watch rotation, hat clutched to her chest, vibrating with the courage of someone who has rehearsed this.' },
    { s: 'sakura', t: 'I need — for research — entirely for research — could you say something the way a VILLAIN would say it? You have the... the timing for it. The dangerous timing.' },
    { s: 'player', t: '...The dangerous timing.' },
    { s: 'sakura', t: '(nodding rapidly) Like in chapter twelve. When the Blackguard tells the duchess the door was never locked, she was just afraid to leave.' },
    { choice: [
      { t: 'Lean in, low voice: "The door was never locked, Sakura."', bond: { sakura: 2 },
        r: [
          { s: 'narr', t: 'The effect is immediate and catastrophic. She makes a sound like a kettle achieving enlightenment and pulls her hat down over her entire face.' },
          { s: 'sakura', t: '(from inside the hat) Perfect. That was — yes. For research. Thank you. I have to go stand in the river now.' },
          { s: 'narr', t: 'Behind you, unnoticed, Erin has witnessed the entire exchange and is silently mouthing "WHAT DOOR?"' },
        ] },
      { t: '"I\'m not a villain, Sakura. I\'m your fourth."', bond: { sakura: 1 },
        r: [
          { s: 'sakura', t: '(deflating, but smiling) I know. I know you\'re not. That\'s the confusing part, honestly. The Blackguard never once refilled anyone\'s tea.' },
          { s: 'narr', t: 'She taps the book\'s cover thoughtfully.' },
          { s: 'sakura', t: 'Maybe volume five should be about someone better.' },
        ] },
    ] },
  ],
};

E.sakura_courage = {
  id: 'sakura_courage', where: 'camp', once: true, priority: 42,
  cond: S => S.bond.sakura >= 6 && S.seen.sakura_villain,
  steps: [
    { s: 'narr', t: 'The fight today went wrong before it went right. She\'s quiet at the fire, hands folded, staring at the burn scored across her staff.' },
    { s: 'sakura', t: 'Everyone thinks Erin protects me because I\'m fragile. Erin thinks so too. I let her think it. It\'s... easier, being someone\'s soft thing to guard.' },
    { s: 'sakura', t: 'But you saw it today. When the ceiling came down. I stepped IN, not away. On purpose. I always step in. I\'ve read every awful novel about dangerous people because I wanted to know what it feels like to stand where the danger is.' },
    { s: 'sakura', t: 'Is that — do you think that\'s something wrong with me?' },
    { choice: [
      { t: '"It\'s the strongest thing about you. The shyness is just the scabbard."', bond: { sakura: 2 },
        r: [
          { s: 'narr', t: 'She looks up. For a full three seconds the timidity is simply gone, and what\'s underneath is bright and terrifying and calm — the thing the monsters see, in the half-instant before Starfall lands.' },
          { s: 'sakura', t: '...The scabbard. (a small, wicked smile) Then you\'ve seen it drawn. Nobody else looks.' },
          { s: 'sakura', t: 'Keep looking. Please.' },
        ] },
      { t: '"Wrong? No. But tell Erin. She\'s guarding a door with nobody behind it."', bond: { sakura: 1, erin: 1 },
        r: [
          { s: 'sakura', t: '(long exhale) ...You\'re right. She deserves to know she raised something with teeth.' },
          { s: 'narr', t: 'The next morning you find Erin sitting very still while Sakura talks, and by the end the knight is laughing so hard she has to hold her breastplate.' },
          { s: 'erin', t: 'TEETH! She said TEETH! Oh, stars, I\'ve been shielding a WAR CRIME—' },
        ] },
    ] },
  ],
};

// --- Erin ---

E.erin_watch = {
  id: 'erin_watch', where: 'camp', once: true, priority: 40,
  cond: S => S.bond.erin >= 2,
  steps: [
    { s: 'narr', t: 'Second watch. Erin takes it every night — nobody assigned it, she just stands up when the moon does. Tonight you stand it with her.' },
    { s: 'erin', t: 'My mother writes once a season. Same letter every time, different nouns: who I should charm, what I\'m worth this year, which family\'s buying. She used to lay my outfits out like tack on a show horse.' },
    { s: 'erin', t: 'The armor was the first thing I ever chose. Ugly, heavy, wonderful. You can\'t barter a wall, {name}. A wall just stands where it\'s needed.' },
    { choice: [
      { t: '"You\'re not a wall. Walls don\'t take second watch so Sakura can sleep."', bond: { erin: 1 },
        r: [
          { s: 'erin', t: '(caught off-guard; laughs at the ground) ...See, that\'s the trouble with you. I set up a perfectly good metaphor and you go looking behind it.' },
          { s: 'erin', t: 'Fine. Not a wall. A door, maybe. Doors get to choose what comes through.' },
        ] },
      { t: '"What would you choose, if nobody was buying?"', bond: { erin: 1 },
        r: [
          { s: 'erin', t: '(a long silence; the fire pops)' },
          { s: 'erin', t: 'Dancing. Don\'t laugh. Real dancing, the kind with no chaperone gritting her teeth at the price of you. And someone who — hm. Someone who asks me things like that.' },
          { s: 'narr', t: 'She doesn\'t look at you when she says it. She checks the perimeter instead. Twice.' },
        ] },
    ] },
  ],
};

E.erin_orders = {
  id: 'erin_orders', where: 'camp', once: true, priority: 41,
  cond: S => S.bond.erin >= 4 && S.seen.erin_watch,
  steps: [
    { s: 'narr', t: 'Morning drills. Erin has been off-rhythm all week — hesitating mid-swing, apologizing to training dummies. Finally she plants her sword in the dirt.' },
    { s: 'erin', t: 'Command me.' },
    { s: 'player', t: '...Come again?' },
    { s: 'erin', t: 'In the gates. You see the field like Shiro sees a board, but you say it out loud, and when you say it my body just — goes. No doubt. No mother\'s voice doing arithmetic on my future. Quietest my head has ever been.' },
    { s: 'erin', t: 'So drill me like you call it in the gate. Please. I want to know if it works out here too.' },
    { choice: [
      { t: 'Drill her hard: positions, pivots, no praise until it\'s earned.', bond: { erin: 2 },
        r: [
          { s: 'narr', t: 'An hour later she\'s soaked, shaking, grinning like sunrise. Every command landed like a key turning in a lock built for it.' },
          { s: 'erin', t: '(breathless) THERE it is. Stars. Do you know how long I\'ve— ahem. Same time tomorrow. That\'s not a request. Well. It\'s a little bit a request.' },
          { s: 'narr', t: 'From the breakfast fire, Shiro observes over her tea: "Fascinating. The paragon runs on rails." Erin throws a boot at her.' },
        ] },
      { t: '"Halfway. I\'ll call the field — but you keep the sword. Deal?"', bond: { erin: 1 },
        r: [
          { s: 'erin', t: '(considers; nods slowly) Deal. You steer, I choose to be steered. That\'s... yeah. That\'s the version I can live inside.' },
          { s: 'narr', t: 'The drills go clean. Cleaner than clean. She hums on the walk back, which you have never once heard her do.' },
        ] },
    ] },
  ],
};

E.erin_dance = {
  id: 'erin_dance', where: 'camp', once: true, priority: 42,
  cond: S => S.bond.erin >= 6 && S.seen.erin_orders,
  steps: [
    { s: 'narr', t: 'Guild festival night bleeds music all the way out to your camp on the ridge. Down in the town square, lanterns spin. Erin watches them the way the hungry watch bakery windows.' },
    { s: 'player', t: 'You said dancing, once. On watch.' },
    { s: 'erin', t: 'I said it to the perimeter. You just happened to be standing in it. (she\'s already unbuckling the breastplate) ...One dance. If you tell Shiro I\'ll deny it under oath.' },
    { s: 'narr', t: 'She dances like she fights — total commitment, zero self-preservation — and laughs when you spin her, a big unarmored laugh that nobody down in that ballroom childhood ever got to hear.' },
    { s: 'erin', t: 'My whole life people have been deciding what I\'m for. Mother. The matchmakers. Even the betrothal — I signed it FOR Sakura, did you know that? Somebody had to stand between that girl and the world.' },
    { s: 'erin', t: 'You\'re the first thing I ever just... picked. The party, I mean. The gate schedule. (beat) That\'s not what I mean and we both know it.' },
    { choice: [
      { t: 'Pull her one step closer. "Then keep picking."', bond: { erin: 2 },
        r: [
          { s: 'narr', t: 'For a woman who can hold a shield against a charging colossus, she goes remarkably still.' },
          { s: 'erin', t: '(quietly, into your shoulder) Every day so far. Don\'t make it weird. ...Okay, make it a LITTLE weird.' },
        ] },
      { t: '"Good. The wall picks its own gate now."', bond: { erin: 1 },
        r: [
          { s: 'erin', t: '(snorts) You\'ve been saving that one. You absolutely have a pouch of those, like trail rations.' },
          { s: 'narr', t: 'But she doesn\'t let go of your hands until the music stops. And when Sakura asks the next morning why her scarf smells like lantern smoke, Erin says "perimeter check" with a perfectly straight face.' },
        ] },
    ] },
  ],
};

// --- Shiro ---

E.shiro_game = {
  id: 'shiro_game', where: 'camp', once: true, priority: 40,
  cond: S => S.bond.shiro >= 2,
  steps: [
    { s: 'narr', t: 'She sets the folding board down across from you without asking. Obsidian and bone pieces, worn smooth. This is, you understand, an examination.' },
    { s: 'shiro', t: 'Kings and Gates. Noble rules. You may ask what the pieces do. Most people ask about the King.' },
    { choice: [
      { t: '"What does the Pawn do at the last rank?"', bond: { shiro: 2 },
        r: [
          { s: 'narr', t: 'Her hand stops above the board.' },
          { s: 'shiro', t: '...It becomes anything. That is the only rule of this game that matters, and adventurers ask it approximately never.' },
          { s: 'narr', t: 'She beats you anyway — of course she does — but at move thirty she stops narrating her wins. By the endgame she\'s just playing, silent and quick, leaning in.' },
          { s: 'shiro', t: 'Tomorrow. Same time. I will not repeat the invitation where the others can hear it.' },
        ] },
      { t: '"I\'d rather learn by losing. Play."', bond: { shiro: 1 },
        r: [
          { s: 'shiro', t: 'Hm. Honest, at least.' },
          { s: 'narr', t: 'She dismantles you in nineteen moves, then wordlessly resets the board and shows you the losing move — yours, third turn, the one that decided everything sixteen moves before you felt it.' },
          { s: 'shiro', t: 'That is what I do for this party, in case you wondered. I see turn three.' },
        ] },
    ] },
  ],
};

E.shiro_ledger = {
  id: 'shiro_ledger', where: 'camp', once: true, priority: 41,
  cond: S => S.bond.shiro >= 4 && S.seen.shiro_game,
  steps: [
    { s: 'narr', t: 'Past midnight. Shiro is still at the camp table with a candle, a ledger, and the particular stillness of someone strangling numbers that refuse to confess.' },
    { s: 'shiro', t: '(not looking up) Compound interest is the only monster I have never once out-positioned. My house owes the Verath syndicate more than the house is worth. The Beaumont betrothal services that debt. I am, in the exact legal sense, collateral.' },
    { s: 'shiro', t: 'I have been searching for a loophole for three years. There isn\'t one. I know because I am the best there is at finding them.' },
    { choice: [
      { t: '"Then stop looking for a loophole. Gate income is untitled — the syndicate priced your house, not an S-rank\'s split. Outearn the debt."', bond: { shiro: 2 }, flag: 'shiro_ledger_plan',
        r: [
          { s: 'narr', t: 'Silence. She pulls the candle closer. Runs the arithmetic once. Twice. Her pen starts moving with a violence you\'ve only seen from her in boss rooms.' },
          { s: 'shiro', t: 'Adventurer income is exempt from ancestral encumbrance. Guild charter, article twelve. I read that article a hundred times and I read it as a NOBLE every single time. You absolute— (she catches herself) ...you saw turn three.' },
          { s: 'narr', t: 'She looks at you across the candle the way she looked at the contract, the first day. Recalculating everything.' },
        ] },
      { t: '"Then it isn\'t a puzzle. I\'m sorry. What do you need — tonight, not on paper?"', bond: { shiro: 1 },
        r: [
          { s: 'shiro', t: '(a long pause; the candle gutters)' },
          { s: 'shiro', t: 'Tea. And someone to sit there and not offer solutions I have already eliminated. You may do the first and attempt the second.' },
          { s: 'narr', t: 'You manage both until dawn. She never says thank you. She does, however, deal you in to tomorrow\'s game without being asked — white pieces. You suspect that IS thank you, in Miyouki.' },
        ] },
    ] },
  ],
};

E.shiro_checkmate = {
  id: 'shiro_checkmate', where: 'camp', once: true, priority: 42,
  cond: S => S.bond.shiro >= 6 && S.seen.shiro_ledger,
  steps: [
    { s: 'narr', t: 'Game forty-one. You have never won. Tonight, on move twenty-eight, the board goes quiet in a way it never has — and you watch the White Queen of the Miyouki house realize, three moves early, that she has already lost.' },
    { s: 'shiro', t: '...' },
    { s: 'shiro', t: 'Again.' },
    { s: 'narr', t: 'You play again. She wins, barely, breathing like it\'s a boss room. Then she sits back and studies you with an expression you\'ve never been on the correct end of.' },
    { s: 'shiro', t: 'I have a confession. I categorized you on day one: convenient, disposable, F. It was the single worst read of my career, and I have replayed it nightly the way other people count sheep.' },
    { s: 'shiro', t: 'You out-positioned a syndicate, my own board, and my read of you. Do you understand what that does to someone whose entire worth is being unreadable and unbeaten?' },
    { choice: [
      { t: '"Say it plainly, Shiro. For once."', bond: { shiro: 2 },
        r: [
          { s: 'shiro', t: '(flat, precise, absolutely terrified) Plainly: the only mind that has ever beaten mine is the only company I have ever wanted to keep. There. Datum delivered.' },
          { s: 'narr', t: 'Her composure holds for exactly four seconds, at which point she picks up the fallen white king and turns it over in her fingers so she has somewhere to look.' },
          { s: 'shiro', t: 'We will never speak of my phrasing again. We will, however, speak. Often. That is the treaty on offer.' },
        ] },
      { t: 'Set your king down on its side. "I understand it cost you forty-one games to say."', bond: { shiro: 1 },
        r: [
          { s: 'shiro', t: 'Forty-one games, one syndicate, and a betrothal, yes. I run a thorough evaluation.' },
          { s: 'narr', t: 'She begins resetting the board — then stops, and leaves the pieces where they fell. Board preserved. In museums, that\'s what they do with the games that mattered.' },
        ] },
    ] },
  ],
};

// --- Generic camp banter (repeatable pool) ---

export const CAMP_BANTER = [
  {
    steps: [
      { s: 'erin', t: 'Rate the gate. Ten\'s "glorious battle," one\'s "Shiro\'s cooking."' },
      { s: 'shiro', t: 'I cooked once. Under protest. The stew was structurally sound.' },
      { s: 'sakura', t: 'It dissolved my spoon...' },
      { choice: [
        { t: '"Solid seven. Nobody died and Erin only triggered one trap."', bond: { erin: 1 }, r: [ { s: 'erin', t: 'ONE trap! Personal best! We celebrate growth in this party!' } ] },
        { t: '"Six. Would\'ve been nine with structurally sound stew."', bond: { shiro: 1 }, r: [ { s: 'shiro', t: '...The recruit has a death wish. Noted in the ledger.' }, { s: 'sakura', t: '(giggling into her sleeve)' } ] },
      ] },
    ],
  },
  {
    steps: [
      { s: 'sakura', t: '(counting on her fingers, muttering scaling formulas for tomorrow\'s mana budget)' },
      { s: 'erin', t: 'She does this every night. Top of our class, you know. Tutored half the academy.' },
      { s: 'sakura', t: 'O-only the half that asked...' },
      { choice: [
        { t: '"Tutor me. The System handles levels — not theory."', bond: { sakura: 1 }, r: [ { s: 'sakura', t: '(instantly sitting up, hat straightened, a completely different person) Yes. Good. We start with leyline decay, there WILL be a quiz.' }, { s: 'erin', t: 'Oh no. Oh, she\'s got the Voice. Blink twice if you need rescue.' } ] },
        { t: '"Sleep, Sakura. The mana budget survives till morning."', bond: { sakura: 1 }, r: [ { s: 'sakura', t: 'Five more minutes. (a yawn ambushes her mid-formula) ...Three more minutes.' }, { s: 'narr', t: 'She\'s asleep in ninety seconds. Erin drapes the scarf over her without breaking her own sentence.' } ] },
      ] },
    ],
  },
  {
    steps: [
      { s: 'shiro', t: 'Observation. You fight like someone reading text the rest of us cannot see.' },
      { s: 'erin', t: 'Oh! Like the blue glow thing! Sometimes there\'s a blue glow thing near his head, I assumed it was a bug.' },
      { choice: [
        { t: 'Tell them a little: "Something\'s been keeping score since I joined you. It likes me."', bond: { shiro: 1 }, r: [ { s: 'shiro', t: '(leaning forward with frightening speed) Keeping score HOW. Numeric? Ordinal? Does it display derived stats? SIT DOWN, this is now an interrogation.' } ] },
        { t: '"A bug. Absolutely a bug."', bond: { erin: 1 }, r: [ { s: 'erin', t: 'Knew it! Pay up, Shiro.' }, { s: 'shiro', t: 'I decline. Because he is lying, and unlike you, he is not even trying hard.' } ] },
      ] },
    ],
  },
  {
    steps: [
      { s: 'erin', t: '(polishing the breastplate with parade-ground intensity) Rust never sleeps, recruit.' },
      { s: 'shiro', t: 'It is a magical alloy. It cannot rust. She knows this. The polishing is a coping ritual.' },
      { s: 'erin', t: 'It\'s MAINTENANCE—' },
      { choice: [
        { t: 'Sit down and polish your own gear alongside her.', bond: { erin: 1 }, r: [ { s: 'erin', t: '(visibly delighted) See?! MAINTENANCE. This is a maintenance party now. Shiro, your grimoire looks dusty—' }, { s: 'shiro', t: 'Touch my grimoire and lose the hand.' } ] },
        { t: '"Coping with what, Erin?"', bond: { shiro: 1 }, r: [ { s: 'erin', t: '(the cloth stops) ...Tomorrow\'s gate is a crypt. Sakura hates crypts. She won\'t say so, so I polish.' }, { s: 'shiro', t: '(quietly, to you) And now you know everything worth knowing about Erin Sterling.' } ] },
      ] },
    ],
  },
  {
    steps: [
      { s: 'sakura', t: 'Um. If anyone wants — I pressed the flowers from the forest gate. The ones growing where the boss... where the boss exploded. They\'re quite pretty?' },
      { s: 'shiro', t: 'You pressed... battlefield flora. From the kill zone.' },
      { s: 'sakura', t: 'The mana makes the petals iridescent! It felt wasteful to just leave them there being ominous.' },
      { choice: [
        { t: 'Take one. Keep it visibly in your gear strap from now on.', bond: { sakura: 1 }, r: [ { s: 'sakura', t: '(watches you fix it to the strap; says nothing; glows for approximately one hour)' } ] },
        { t: '"Make Shiro wear one."', bond: { erin: 1 }, r: [ { s: 'shiro', t: 'No.' }, { s: 'narr', t: 'She wears it for the rest of the night. Nobody mentions it. Erin takes a memory-sketch for blackmail purposes.' } ] },
      ] },
    ],
  },
  {
    steps: [
      { s: 'erin', t: 'Settle a bet. Sakura says your System thing has a voice. Deep and spooky, she says.' },
      { s: 'sakura', t: 'I didn\'t say SPOOKY, I said RESONANT—' },
      { choice: [
        { t: 'Deadpan: "It says you two owe it rent for the head-space."', bond: { erin: 1, sakura: 1 }, r: [ { s: 'erin', t: '(delighted horror) It\'s a LANDLORD?!' }, { s: 'shiro', t: '(without looking up) Finally, an entity in this party that understands compound obligation.' } ] },
        { t: 'Honestly: "Mostly it\'s numbers. But when I level... it sounds almost proud."', bond: { sakura: 1 }, r: [ { s: 'sakura', t: '(softly) Good. Someone should be, every single time. ...I mean — statistically! Statistically someone should!' } ] },
      ] },
    ],
  },
];

// ------------------------------------------------------------
// DUNGEON EVENT NODES (random flavor inside gates)
// effect keys: gold, xp, hpPct, mpPct, item (id), gp
// ------------------------------------------------------------

export const DUNGEON_EVENTS = [
  { t: 'A vein of raw mana crystal pulses in the wall, humming against your teeth. The System pings hungrily.',
    choices: [
      { t: 'Harvest it (the backlash stings)', effect: { xp: 1.0, hpPct: -0.12 }, log: 'The crystal detonates softly. It hurts — and the System drinks deep.' },
      { t: 'Leave it be', effect: {}, log: 'You move on. Some doors are better left humming.' },
    ] },
  { t: 'A previous party\'s camp, weeks old. A locked supply chest sits under a collapsed tent.',
    choices: [
      { t: 'Force the lock', effect: { gold: 1.0, item: 'potion' }, log: 'Coin, a potion, and a note: "If you find this, we went LEFT. Don\'t."' },
      { t: 'Leave it for the guild recovery team', effect: { gp: 10 }, log: 'You log the site. The guild credits your license for the courtesy.' },
    ] },
  { t: 'A wounded adventurer limps from a side passage — solo diver, D-rank badge, bleeding but walking.',
    choices: [
      { t: 'Give him a potion and mark him a route out', effect: { item: '-potion', gp: 15 }, log: 'He grips your arm. "Fourth Blade, right? The girls\' party? ...Lucky girls." He limps for daylight.' },
      { t: 'Point to the exit and keep moving', effect: {}, log: 'He\'ll make it. Probably. The gate doesn\'t care either way.' },
    ] },
  { t: 'An old shrine to the God of Small Mercies. Its offering bowl has been licked clean by something with a very long tongue.',
    choices: [
      { t: 'Leave an offering of gold', effect: { gold: -0.35, hpPct: 0.3, mpPct: 0.3 }, log: 'Warmth spreads from your boots upward. Small mercies, honestly given.' },
      { t: 'Pray for free', effect: { hpPct: 0.05 }, log: 'A faint warmth. The god appreciates the thought, if not the budgeting.' },
    ] },
  { t: 'Sakura stops mid-step. "There\'s a resonance node here. I could overcharge my focus... it\'s a LITTLE illegal."',
    choices: [
      { t: '"Do it. I\'ll keep watch."', effect: { buff: 'mag' }, log: 'Her staff drinks the node dry. Her next spells will hit like falling stars. She looks unreasonably pleased with herself.' },
      { t: '"A LITTLE illegal?"', effect: { xp: 0.3 }, log: '"Guild bylaw 44-C. It\'s more of a suggestion." You learn a great deal about bylaw 44-C. The System counts it as studying.' },
    ] },
  { t: 'A collapsed floor reveals a lower gallery glittering with coin — and absolutely reeking of ambush.',
    choices: [
      { t: 'Drop down fast, grab, climb', effect: { gold: 1.6, hpPct: -0.08 }, log: 'Something snaps at your heels on the way up. It keeps a boot. The coin was worth a boot.' },
      { t: 'Rope Erin down as overwatch', effect: { gold: 0.8 }, log: 'Slower, safer, shinier. Erin surfaces holding coins and, for some reason, an apology from whatever lived down there.' },
    ] },
  { t: 'Gate-glass: a mirror-smooth wall showing the party as they might be, years on. Erin won\'t look. Shiro can\'t stop.',
    choices: [
      { t: 'Look', effect: { xp: 0.5 }, log: 'You see yourself at the top of a long stair of ranks, and the reflection nods first. The System hums approval.' },
      { t: 'Shatter it', effect: { gold: 0.5 }, log: 'The shards rain down as ordinary silver. Shiro exhales like someone released from a debt. "Thank you," she does not say. But almost.' },
    ] },
  { t: 'A goblin, tiny and gray-whiskered, sits by a cookfire. It does not attack. It offers your party skewers of dubious meat.',
    choices: [
      { t: 'Eat the skewer', effect: { hpPct: 0.25 }, log: 'Delicious. Concerning, but delicious. The old goblin nods the way all cooks nod when the verdict lands.' },
      { t: 'Trade it a potion for gate gossip', effect: { item: '-potion', xp: 0.6 }, log: 'It sketches the boss chamber in ash: numbers, entrances, a weak left knee. Shiro copies everything.' },
    ] },
];

// ------------------------------------------------------------
// ENDINGS — chosen by top bond after the Monarch gate
// ------------------------------------------------------------

E.ending_sakura = {
  id: 'ending_sakura', where: 'auto', once: true, priority: 100,
  steps: [
    { s: 'narr', t: 'The Threshold collapses behind you in a column of dying gold. The continent will never rank another gate above it, because there will never be another.' },
    { s: 'narr', t: 'In the settling dust, it\'s Sakura who reaches you first — hat gone, hair wild, the last embers of Starfall still winking out around her like fireflies.' },
    { s: 'sakura', t: 'You\'re alive. We\'re alive. I stepped IN again and you were already there and — oh, hang the scabbard.' },
    { s: 'narr', t: 'The kiss tastes of ozone and victory. The most dangerous mage of her generation is shaking. So, you notice distantly, are you.' },
    { s: 'sakura', t: '(muffled, into your collar) Volume five. The one about someone better. ...I\'m going to need a co-author.' },
    { s: 'narr', t: 'Behind you, Erin is owed money by half the guild and collecting loudly. Shiro simply notes the date in her ledger — assets, not liabilities.' },
    { s: 'sys', t: '[ FINAL QUEST COMPLETE. The System releases you. It was never about the levels, Player. It was about who kept pace beside you. ]' },
    { s: 'narr', t: '— GATEBOUND: cleared. Thank you for playing. (Free play continues — the gates never really close.) —' },
  ],
};
E.ending_erin = {
  id: 'ending_erin', where: 'auto', once: true, priority: 100,
  steps: [
    { s: 'narr', t: 'The Threshold collapses behind you in a column of dying gold. Somewhere under the roar, you hear laughter — huge, unarmored, alive.' },
    { s: 'narr', t: 'Erin limps out of the dust carrying her shield in pieces and her grin intact.' },
    { s: 'erin', t: 'Final gate on the continent and you called my pivot half a second before I knew I needed it. Half. A. Second.' },
    { s: 'erin', t: 'My whole life people decided what I was for. You just... kept asking what I wanted, and then standing wherever the answer needed you. That\'s the whole trick, you know. Nobody else ever learned it.' },
    { s: 'narr', t: 'She drops the broken shield. Steps over it.' },
    { s: 'erin', t: 'So here\'s me, deciding: you. Loudly. In front of the guild and the wreckage and everyone. Somebody fetch Shiro, she\'s holding my last two silver on this.' },
    { s: 'narr', t: 'The dance that follows has no music, no chaperone, and no armor anywhere in it.' },
    { s: 'sys', t: '[ FINAL QUEST COMPLETE. The System releases you. Walls fall. Doors choose. ]' },
    { s: 'narr', t: '— GATEBOUND: cleared. Thank you for playing. (Free play continues — the gates never really close.) —' },
  ],
};
E.ending_shiro = {
  id: 'ending_shiro', where: 'auto', once: true, priority: 100,
  steps: [
    { s: 'narr', t: 'The Threshold collapses behind you in a column of dying gold. Shiro watches it fall with the expression of a woman auditing a god and finding the books... acceptable.' },
    { s: 'shiro', t: 'Final tally. One syndicate outmaneuvered. One house debt, cleared — gate income, article twelve, as designed. One betrothal, dissolved without casualties. One S-rank gate, closed.' },
    { s: 'shiro', t: 'And one read — mine, day one, "convenient, disposable, F" — wrong by a margin I intend to spend a very long time correcting.' },
    { s: 'narr', t: 'She produces the folding board. Sets it on a chunk of fallen monolith. Obsidian and bone, and the white king still lying on its side from game forty-one — she never did reset it.' },
    { s: 'shiro', t: 'The Miyouki house is solvent, unpledged, and mine. Which means, for the first recorded instance, so is my time. Sit. I am told there are openings I have not tried.' },
    { s: 'narr', t: 'You sit. She almost smiles — then simply does, and it\'s worth every one of the forty-one losses it cost.' },
    { s: 'sys', t: '[ FINAL QUEST COMPLETE. The System releases you. Checkmate was never the point. The next game was. ]' },
    { s: 'narr', t: '— GATEBOUND: cleared. Thank you for playing. (Free play continues — the gates never really close.) —' },
  ],
};
E.ending_party = {
  id: 'ending_party', where: 'auto', once: true, priority: 100,
  steps: [
    { s: 'narr', t: 'The Threshold collapses behind you in a column of dying gold, and for one long minute the four of you just stand in it — mage, knight, tactician, and the F-rank the guild once classified as baggage.' },
    { s: 'erin', t: 'Group verdict?' },
    { s: 'sakura', t: 'Ten. It\'s a ten, Erin.' },
    { s: 'shiro', t: 'Nine point five. The recruit lost a boot again.' },
    { s: 'narr', t: 'Word reaches you a week later that a certain B-rank named Beaumont cleared his first A-gate to thunderous guild applause — and sent four bottles of his family\'s best vintage, one labeled "FOR THE FOURTH. THANK YOU FOR WAITING BETTER THAN I ASKED THEM TO."' },
    { s: 'narr', t: 'The party stays four. The guild stops asking. Some formations you don\'t break, you just keep clearing gates until the map runs out.' },
    { s: 'sys', t: '[ FINAL QUEST COMPLETE. The System releases you — and logs, in its final entry, that the strongest stat on record was never yours alone. ]' },
    { s: 'narr', t: '— GATEBOUND: cleared. Thank you for playing. (Free play continues — the gates never really close.) —' },
  ],
};

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

export function pickGuildEvent(S) {
  return Object.values(EVENTS)
    .filter(e => e.where === 'guild' && !(e.once && S.seen[e.id]) && (!e.cond || e.cond(S)))
    .sort((a, b) => b.priority - a.priority)[0] || null;
}

export function pickCampEvent(S, rng) {
  const ev = Object.values(EVENTS)
    .filter(e => e.where === 'camp' && !(e.once && S.seen[e.id]) && (!e.cond || e.cond(S)))
    .sort((a, b) => b.priority - a.priority)[0];
  if (ev) return ev;
  const pool = CAMP_BANTER;
  return { id: 'banter', steps: pool[Math.floor(rng() * pool.length)].steps };
}

export function endingFor(S) {
  const b = S.bond;
  const top = Math.max(b.sakura, b.erin, b.shiro);
  if (top < 5) return EVENTS.ending_party;
  const leaders = ['sakura', 'erin', 'shiro'].filter(k => b[k] === top);
  if (leaders.length > 1) return EVENTS.ending_party;
  return EVENTS['ending_' + leaders[0]];
}
