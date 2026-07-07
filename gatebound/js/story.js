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

E.yuki_stay = {
  id: 'yuki_stay', where: 'guild', once: true, priority: 61,
  cond: S => S.rankIdx >= 4 && S.seen.yuki_confront && !S.flags.yuki_member,
  steps: [
    { s: 'narr', t: 'The betrothals are ash. Yuki should be gone — off to his own gates, his own party, the door he earned. Instead he\'s at the guild board the next morning, pack on his shoulder, wearing the specific terror of a man about to ask for something enormous.' },
    { s: 'yuki', t: 'I disbanded my party. Told the strays they\'d outgrown me. Which is a lie — I outgrew being their ceiling. I want to be someone\'s floor again. I want in. Here. With you four. Permanently.' },
    { s: 'shiro', t: 'We are four. Guild law is satisfied at four. A fifth is not a vacancy, Beaumont. It is a choice about shape.' },
    { s: 'yuki', t: 'I know exactly what shape this party is. Three women who look at {name} like the last dry match in a storm — and {name}, who somehow keeps them all warm without dropping a single one.' },
    { s: 'narr', t: 'He says it without a scrap of jealousy. That\'s the thing about Yuki now: four years of chasing burned the envy clean out of him and left only a terrible, clear-eyed honesty.' },
    { s: 'yuki', t: 'I don\'t want to compete with that. I want to belong to it. And if belonging means I stop being the odd shape at the edge — if it means becoming something that fits between them instead of standing apart — then reclassify me. I\'ve never meant anything more in my life.' },
    { s: 'sys', t: '[ NEW DIRECTIVE — subject "Yuki Beaumont" requests voluntary reclassification. The System does not usually take requests. The System is... intrigued. Awaiting your authorization, Player. ]' },
    { s: 'narr', t: 'The blue light no one else can see turns, for the first time, to hang over someone who isn\'t you. Sakura gasps — she can almost see it now. Erin\'s hand finds her sword on reflex. Shiro just watches you, the way she watches a board tip.' },
    { choice: [
      { t: '"Authorized. Welcome home, Yuki. We\'ll make room — all of us."', flag: 'yuki_member', bond: { yuki: 2 },
        r: [
          { s: 'sys', t: '[ Authorization accepted. Subject enrolled. Reclassification will proceed gradually — the System is thorough, not cruel. Party size: 5. ]' },
          { s: 'yuki', t: '(the breath goes out of him all at once, and what\'s left is the widest, most relieved smile you\'ve ever seen) Five. We\'re five. I earned the door AND they let me keep it—' },
          { s: 'erin', t: '(already blinking too fast) Stars help me. FINE. But you take second watch with me and you learn to make Sakura\'s stew right. Those are the terms of initiation.' },
          { s: 'sakura', t: '(quietly, to Yuki) ...Welcome to the soft place. It\'s less frightening than the edge. I promise.' },
          { s: 'narr', t: '(Yuki has joined your party — permanently. The System\'s reclassification will unfold over the gates to come.)' },
        ] },
      { t: '"Are you sure? This changes you — all the way down. There\'s no ledger for undoing it."', bond: { yuki: 1 },
        r: [
          { s: 'yuki', t: 'You think I didn\'t read the fine print? I\'ve spent four years being a shape that fit nowhere. I\'m not afraid of becoming one that fits. I\'m afraid of dying the shape I started as.' },
          { s: 'narr', t: 'He looks at the three of them — knight, mage, queen — and then at you, and there is no doubt anywhere in his face.' },
          { s: 'yuki', t: 'Authorize it. Please. Let me fit.' },
          { s: 'sys', t: '[ Consent reaffirmed. Reclassification queued. Party size: 5. ]' },
          { flag: 'yuki_member' },
          { s: 'narr', t: '(Yuki has joined your party — permanently.)' },
        ] },
    ] },
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

// ------------------------------------------------------------
// SECOND-TIER BONDS (8 / 10) — the late-game romance payoff.
// Unlock as bonds climb through C→S rank; each continues the
// arc set by the bond-6 scene and caps the route at 10.
// ------------------------------------------------------------

// --- Sakura ---

E.sakura_volume5 = {
  id: 'sakura_volume5', where: 'camp', once: true, priority: 43,
  cond: S => S.bond.sakura >= 8 && S.seen.sakura_courage,
  steps: [
    { s: 'narr', t: 'She\'s been scribbling by firelight for three camps running, tongue between her teeth, shielding the page from Erin with her whole body. Tonight she slides the notebook to you instead.' },
    { s: 'sakura', t: 'Volume five. The one about someone better than the Blackguard. I need a second opinion. From the source. Don\'t read the margins.' },
    { s: 'narr', t: 'You read the margins. The hero refills tea. Reads clauses aloud to save fools from bad contracts. Stands, always, exactly where the danger is about to land.' },
    { s: 'sakura', t: '...It\'s not subtle, is it. I tried to make it subtle. I have a prodigy\'s memory and a coward\'s pen.' },
    { choice: [
      { t: '"He\'s better than the Blackguard because someone dangerous chose to be gentle. Write that."', bond: { sakura: 2 },
        r: [
          { s: 'narr', t: 'Her pen stops. She looks at you the way she looks at a spell resolving perfectly — total, delighted comprehension.' },
          { s: 'sakura', t: 'Someone dangerous, choosing to be gentle. (writing fast now) That\'s both of us, actually. That\'s the whole book.' },
          { s: 'sakura', t: 'The duchess draws her own blade in chapter one this time. She was always going to. She just needed someone to keep looking while she did.' },
        ] },
      { t: '"Read me your favorite line. Out loud. Villain timing."', bond: { sakura: 1 },
        r: [
          { s: 'narr', t: 'She stands. Squares her shoulders. And for one breath the timid prodigy is gone, and the thing the monsters see is reading you her own words in a voice like drawn steel.' },
          { s: 'sakura', t: '"You mistook my quiet for a locked door," she read. "It was only ever a held breath." (she sits down hard) ...I have to go stand in the river. Keep the notebook. Don\'t show Erin the margins.' },
        ] },
    ] },
  ],
};

E.sakura_starfall = {
  id: 'sakura_starfall', where: 'camp', once: true, priority: 44,
  cond: S => S.bond.sakura >= 10 && S.seen.sakura_volume5 && S.rankIdx >= 3,
  steps: [
    { s: 'narr', t: 'The gate today went to the edge — a cornered horror, the ceiling gone, Erin down a knee. And Sakura walked forward into it, calm as a closing book, and unmade the thing with a single word.' },
    { s: 'narr', t: 'Now, at the fire, the shaking has finally reached her hands. You sit close enough to still them.' },
    { s: 'sakura', t: 'I used to rehearse being brave. Whole novels of it. Tonight I didn\'t rehearse. I just knew you\'d be behind me, and I stepped, and the fear never came.' },
    { s: 'sakura', t: 'That\'s not a scabbard anymore, is it. That\'s just a girl who stopped being afraid, because one person kept looking.' },
    { choice: [
      { t: '"I\'m not behind you, Sakura. I\'m beside you. Draw the blade — I\'ll be in the light with you."', bond: { sakura: 2 },
        r: [
          { s: 'narr', t: 'She kisses you before the sentence is finished, hat knocked to the dirt, every ounce of the prodigy\'s precision abandoned for something far less careful.' },
          { s: 'sakura', t: '(breathless, forehead to yours) Co-author. Life edition. The margins get to be the whole book now.' },
          { s: 'narr', t: 'Across the fire Shiro turns a page she is not reading and says, dryly, "Finally. The arithmetic on that had grown embarrassing."' },
        ] },
      { t: 'Pick up her hat. Set it back on her head. "Then let\'s go be dangerous and gentle. Together."', bond: { sakura: 1 },
        r: [
          { s: 'sakura', t: '(from under the brim, glowing) ...You did the villain timing again. On purpose. You know what it does to me.' },
          { s: 'narr', t: 'She doesn\'t go stand in the river tonight. She stays exactly where she is — which, for Sakura, is the loudest thing she has ever said.' },
        ] },
    ] },
  ],
};

// --- Erin ---

E.erin_unarmored = {
  id: 'erin_unarmored', where: 'camp', once: true, priority: 43,
  cond: S => S.bond.erin >= 8 && S.seen.erin_dance,
  steps: [
    { s: 'narr', t: 'You find her before dawn without the armor on — just the gambeson, sitting on the ridge, watching the dark where the next gate will open. She doesn\'t startle. She saved you a spot.' },
    { s: 'erin', t: 'I signed the Beaumont betrothal for Sakura. Told you that. What I didn\'t tell you: I signed it in about four seconds. Didn\'t think. Somebody threatens my soft thing, I put my body there. It\'s the only prayer I know.' },
    { s: 'erin', t: 'But four seconds isn\'t choosing, is it. That\'s just being a wall really fast. And I am so tired of being fast instead of sure.' },
    { choice: [
      { t: '"So be slow with me. Take the four seconds back and spend them on purpose."', bond: { erin: 2 },
        r: [
          { s: 'narr', t: 'She turns the words over like a coin she\'s never been allowed to keep.' },
          { s: 'erin', t: 'Slow. On purpose. (a long breath) Okay. Watch me be sure about something for once in my armored life.' },
          { s: 'erin', t: 'I don\'t stand between you and the world because I\'m fast. I stand there because it\'s the only place I\'ve ever wanted to be. That took me all night to say and I\'d say it again slower.' },
        ] },
      { t: 'Sit. Say nothing. Put your shoulder against hers and watch the dark with her.', bond: { erin: 1 },
        r: [
          { s: 'narr', t: 'The knight who takes every second watch lets someone share this one. She leans, a fraction, and the fraction is enormous.' },
          { s: 'erin', t: '...You know the worst part of being a wall? Nobody ever sits on your side of it. (quietly) Thanks for finding the door.' },
        ] },
    ] },
  ],
};

E.erin_chosen = {
  id: 'erin_chosen', where: 'camp', once: true, priority: 44,
  cond: S => S.bond.erin >= 10 && S.seen.erin_unarmored && S.rankIdx >= 3,
  steps: [
    { s: 'narr', t: 'A letter from her mother reached the guild today — same letter, different nouns, a new family buying. Erin read it once, at the assignment board, in front of the whole hall. Then she did something you\'ve never seen her do. She laughed.' },
    { s: 'erin', t: 'Listen to this. "You are wasting your best years and your bloodline on a party of debtors and a nameless fourth." (grinning) She spelled it out for me. My best years. My bloodline. My party. My fourth.' },
    { s: 'erin', t: 'She meant it as the bill. I\'m reading it as the inventory. And every single line, I want to keep.' },
    { s: 'narr', t: 'She sets the letter on the board, unfolds it flat so anyone can read it, and turns to you in the middle of the crowded hall.' },
    { choice: [
      { t: '"Then keep it. Loudly. You said that was the only way you knew how."', bond: { erin: 2 },
        r: [
          { s: 'narr', t: 'She kisses you in front of the notice board, the guildmaster, and forty adventurers who will absolutely be talking about it for a week. Total commitment. Zero self-preservation. Exactly how she fights.' },
          { s: 'erin', t: '(pulling back, radiant, far too loud) THAT\'S the answer to the letter! Somebody write my mother! Tell her the horse picked its own field!' },
          { s: 'narr', t: 'Sakura is scarlet. Shiro is calmly collecting winnings. Somewhere a recruiter faints on general principle.' },
        ] },
      { t: 'Take the letter. Fold it into a paper boat. Hand it back. "Sail it. Don\'t carry it."', bond: { erin: 1 },
        r: [
          { s: 'narr', t: 'She stares at the little boat. Then at you. Then she laughs so hard she has to sit down on the floor of the guild hall.' },
          { s: 'erin', t: 'A BOAT. Years of dread and you made it a — (wiping her eyes) I\'m keeping this forever. I\'m keeping YOU forever. Loudly. That\'s decided. Guild\'s my witness.' },
        ] },
    ] },
  ],
};

// --- Shiro ---

E.shiro_maskless = {
  id: 'shiro_maskless', where: 'camp', once: true, priority: 43,
  cond: S => S.bond.shiro >= 8 && S.seen.shiro_checkmate,
  steps: [
    { s: 'narr', t: 'She mends the party every gate and no one asks what it costs her. Tonight you catch the aftermath: Shiro alone behind the tents, hands trembling, her composure set down beside her like a heavy coat.' },
    { s: 'shiro', t: '(not turning) Grand Design marks the weakest enemy. It also, if you are the one casting, marks the weakest ally — constantly — so you may keep them breathing. Do you understand what it is to see everyone\'s exact distance from death, all day, and never your own?' },
    { s: 'shiro', t: 'I am unreadable because reading is exhausting and I never get to stop. You are the one variable I have permitted myself to leave uncalculated. Do not make me regret the exemption.' },
    { choice: [
      { t: 'Sit at her back, a wall between her and the camp. "Off duty. I\'ll watch the distances tonight. Sleep."', bond: { shiro: 2 },
        r: [
          { s: 'narr', t: 'For a long time she says nothing. Then, by degrees, the straightest spine in the party curves — just slightly — until her shoulder finds yours and stays.' },
          { s: 'shiro', t: 'You cannot actually see the distances. You have no System readout for it.' },
          { s: 'player', t: 'No. But I can see one. Yours. It sits closer than you let anyone stand.' },
          { s: 'shiro', t: '(very quietly) ...Keep the watch, then. I appear to have gone off duty.' },
        ] },
      { t: '"Then stop calculating me and just tell me. What do you see when you don\'t?"', bond: { shiro: 1 },
        r: [
          { s: 'shiro', t: 'When I stop? (a rare, unguarded pause) I see the first position on the board I have never wanted to win. Only to hold. Indefinitely. It is a deeply inefficient desire and I have made my peace with it.' },
          { s: 'narr', t: 'She retrieves the composure and puts it back on. But she leaves one button undone, so to speak — a deliberate flaw in the armor, shown to exactly one person.' },
        ] },
    ] },
  ],
};

E.shiro_endgame = {
  id: 'shiro_endgame', where: 'camp', once: true, priority: 44,
  cond: S => S.bond.shiro >= 10 && S.seen.shiro_maskless && S.rankIdx >= 3,
  steps: [
    { s: 'narr', t: 'She sets the folding board down without asking. But the pieces aren\'t in starting position — they\'re arranged mid-game, a real one, clearly carried in her head for weeks.' },
    { s: 'shiro', t: 'Status report, since you outlawed my hiding. Gate income has serviced two-thirds of the Miyouki debt. Article twelve — exactly as you read it back to me over a candle. At current clear rate, the house is solvent and unpledged before the Threshold.' },
    { s: 'shiro', t: 'Which raises a question I have never once had the luxury of asking. What does a piece do, {name}, when it reaches the last rank and is no longer required to be anything?' },
    { s: 'narr', t: 'She turns the White Queen over in her fingers. Waiting. She already knows the answer she wants; she is, for the first time, letting someone else move first.' },
    { choice: [
      { t: '"It becomes anything. You taught me that, move one. So become whatever you actually want — out loud."', bond: { shiro: 2 },
        r: [
          { s: 'shiro', t: 'Out loud. (she sets the queen down — not fallen; standing, beside the king) Plainly, then, and once: when the debt is gone and the board is mine, I intend to spend the freedom I bought on you. That is the position. I have modeled no other I prefer.' },
          { s: 'narr', t: 'Her composure holds for exactly four seconds. On the fifth, the White Queen of the Miyouki house reaches across the board and takes your hand instead of a piece — a move with no strategic value whatsoever, made anyway.' },
          { s: 'shiro', t: 'We will speak of my phrasing constantly. I find I no longer mind being read. By you. The exemption is now permanent.' },
        ] },
      { t: 'Move a single pawn to the last rank. "Your move, White Queen. Not the house\'s. Yours."', bond: { shiro: 1 },
        r: [
          { s: 'narr', t: 'She studies the pawn on the last rank for a long, long moment — the only rule of the game that ever mattered — and then does something no opponent has made her do in forty-two games. She resigns, smiling.' },
          { s: 'shiro', t: 'I concede the board. I have wanted to lose exactly one game my entire life, and it appears this was it. Set them up again tomorrow. We will have a great many tomorrows to fill.' },
        ] },
    ] },
  ],
};

// --- Yuki: B-rank letter, bridging the guest/refusal beat and the A-rank reckoning ---

E.yuki_letter_3 = {
  id: 'yuki_letter_3', where: 'guild', once: true, priority: 50,
  cond: S => S.rankIdx >= 3 && S.seen.yuki_joins,
  steps: [
    { s: 'narr', t: 'The letter is on good paper for once, and the handwriting has stopped pressing so hard into the page.' },
    { s: 'yuki', t: '"I made C-rank. Then B, eight days later — turns out once you stop trying to be carried, the door is a lot lighter. I run gates with a party of my own now. Strays, mostly. I\'m the one who reads the contracts for them."' },
    { s: 'shiro', t: '(reading over Erin\'s shoulder) ...He learned clause nine. Someone taught the lamb to read clause nine.' },
    { s: 'erin', t: 'WE taught him! By example! From a great distance! Badly!' },
    { s: 'sakura', t: 'He sounds happy. Actually happy, not letter-happy. There\'s a difference, and I think this is the real one.' },
    { s: 'narr', t: 'At the bottom, a postscript in a lighter hand: "Tell your fourth I finally understand why you kept him. Some people make the whole party better just by refusing to leave. — Y."' },
    { s: 'shiro', t: '(folding the letter with unusual care) He\'s coming to find us at A. You understand that. This is the letter a man writes just before he sets something down for good.' },
  ],
};

// ------------------------------------------------------------
// YUKI — reclassification arc (after joining permanently).
// Consensual, System-driven; each step is offered, never forced.
// Completing it flips yuki_femme (updates portrait / battle model).
// ------------------------------------------------------------

E.yuki_fem1 = {
  id: 'yuki_fem1', where: 'camp', once: true, priority: 45,
  cond: S => S.flags.yuki_member && !S.seen.yuki_fem1,
  steps: [
    { s: 'narr', t: 'First camp as a party of five. Yuki sits a little apart still — old habit — until Sakura wordlessly scoots the stew pot six inches closer to him, and the geometry of the fire quietly makes a place.' },
    { s: 'sys', t: '[ Reclassification: phase one. Subject "Yuki" — beginning soft revision. Nothing is forced. Everything is offered. Decline any step and it halts. ]' },
    { s: 'yuki', t: '(turning his hands over, watching the callouses soften a shade) It doesn\'t hurt. I thought it would hurt. It just feels like setting down a pack I forgot I was carrying. Is that strange?' },
    { choice: [
      { t: '"Not strange. You spent years being who you were supposed to be. This is just you, choosing."', bond: { yuki: 2 },
        r: [
          { s: 'yuki', t: 'Me, choosing. (he tries the words on like a coat that finally fits) ...Sakura, does it get easier? Being looked at and not flinching?' },
          { s: 'sakura', t: '(gently) You keep the shyness. You just stop mistaking it for smallness. Here — a spare ribbon. For your hair, when it\'s long enough. No pressure. It\'ll wait.' },
          { s: 'narr', t: 'Yuki holds the pink ribbon like it\'s a guild medal. In a way you can\'t quite explain, it is.' },
        ] },
      { t: '"Take it as slow as you need. We\'re not going anywhere — that\'s the whole point of five."', bond: { yuki: 1 },
        r: [
          { s: 'yuki', t: 'Slow. (a shaky laugh) Everyone always wanted me to hurry — catch up, catch up. You\'re the first people who ever said slow and meant it kindly.' },
          { s: 'erin', t: '(from across the fire, gruff) Perimeter\'s clear. Nobody rushes anybody on my watch. Eat your stew, recruit.' },
        ] },
    ] },
  ],
};

E.yuki_fem2 = {
  id: 'yuki_fem2', where: 'camp', once: true, priority: 46,
  cond: S => S.flags.yuki_member && S.seen.yuki_fem1,
  steps: [
    { s: 'narr', t: 'The change has found a rhythm now — softer jaw, longer lashes, a voice that\'s learned a gentler register. Yuki wears the green gown Sakura sewed and keeps startling herself with her own reflection in still water, then laughing, delighted.' },
    { s: 'yuki', t: 'I keep waiting to grieve him. The old me. And it just doesn\'t come. He was a door I held shut with my whole body. Turns out on the other side there\'s only me. Breathing.' },
    { s: 'shiro', t: '(not looking up from her ledger, but softer than her words) The subject reports no loss, only relief. Statistically the healthiest reclassification I have ever audited. I have written it down. Twice.' },
    { choice: [
      { t: '"She suits you. This whole party suits you. And you suit us."', bond: { yuki: 2 },
        r: [
          { s: 'yuki', t: 'She. (Yuki\'s eyes go bright.) You said it so easily. Like it was always true and you were only waiting for me to catch up to it.' },
          { s: 'player', t: 'I was. We all were. Welcome the rest of the way in.' },
          { s: 'narr', t: 'Erin, who has been pretending not to listen, abruptly needs to polish something. Sakura is openly crying into her hat. Shiro deals a fifth hand of cards without being asked.' },
        ] },
      { t: '"How do you want us to speak of you now? Say it, and it\'s law."', bond: { yuki: 2 },
        r: [
          { s: 'yuki', t: '(a long breath, then steady) She. Her. Yuki still — I like my name, I earned my name. Just the rest of it, the way you\'d speak of any of the girls. If that\'s allowed.' },
          { s: 'shiro', t: 'It was allowed the moment you wanted it. That is the only permission that was ever required. Noted, ratified, and — Beaumont — correct.' },
        ] },
    ] },
  ],
};

E.yuki_fem3 = {
  id: 'yuki_fem3', where: 'camp', once: true, priority: 47,
  cond: S => S.flags.yuki_member && S.seen.yuki_fem2 && S.bond.yuki >= 4,
  steps: [
    { s: 'narr', t: 'Camp on a high ridge, all five of you, and for once nobody sits apart. Yuki is in the middle of it — of THEM — hair long and ribboned, laughing at one of Erin\'s terrible jokes, a mug of Sakura\'s cocoa going cold because she\'s too busy being happy to drink it.' },
    { s: 'sys', t: '[ Reclassification complete. Subject "Yuki Beaumont" — reclassified: MEMBER, in full. The System notes, for its records, that this is the first time it has made someone by helping them become who they already were. ]' },
    { s: 'yuki', t: '{name}. Come here. I need to say this while I\'m brave enough. (she takes your hands) You didn\'t recruit a swordsman. You didn\'t even recruit a girl. You recruited a person drowning at the edge of every room, and you made a place in the middle, and you said fit. And I did. I DID.' },
    { choice: [
      { t: '"You were never at the edge to me, Yuki. You were just late to your own seat. Sit."', bond: { yuki: 2 },
        r: [
          { s: 'narr', t: 'She kisses you — soft, certain, unhurried, a girl who has finally stopped running because she has arrived. Around the fire, three A-ranks raise their mugs without a word.' },
          { s: 'erin', t: 'To five!' },
          { s: 'sakura', t: 'To fitting!' },
          { s: 'shiro', t: 'To the only variable I ever enjoyed failing to predict. ...To Yuki.' },
          { s: 'narr', t: '(Yuki is fully home. The party is five, and the harem, at last, is whole.)' },
        ] },
      { t: 'Pull her into the middle of all of them. "Then stop thanking me and start belonging. Order from your floor."', bond: { yuki: 2 },
        r: [
          { s: 'yuki', t: '(laughing, crying, wedged happily between Erin\'s shoulder and Sakura\'s hat) An order. Yes. Belonging. I\'m going to be SO good at that.' },
          { s: 'shiro', t: 'She will, too. She does nothing by halves. It is, I have come to understand, the single most Yuki thing about her.' },
          { s: 'narr', t: '(Yuki is fully home — reclassified, beloved, and unmistakably one of the girls now.)' },
        ] },
    ] },
    { flag: 'yuki_femme' },
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
  {
    steps: [
      { s: 'erin', t: 'New rule: whoever spots the boss weak point first gets Sakura\'s dessert ration.' },
      { s: 'sakura', t: 'I did NOT agree to wager my dessert—' },
      { s: 'shiro', t: 'Seconded. Motion carries. You were outvoted while objecting; democracy is cruel.' },
      { choice: [
        { t: '"Already spotted tomorrow\'s. It kneels left when it\'s hurt."', bond: { shiro: 1 }, r: [ { s: 'shiro', t: '(a slow, approving blink) ...You read the ash-goblin\'s sketch. And retained it. Sakura, forfeit the dessert; the man did the homework.' }, { s: 'sakura', t: '(mournfully surrendering a wrapped tart) ...worth it. Barely.' } ] },
        { t: '"Give Sakura her tart back. Winner buys dessert instead."', bond: { sakura: 1, erin: 1 }, r: [ { s: 'erin', t: 'A party that buys MORE dessert? Motion carries UNANIMOUSLY. Shiro, you\'re outvoted while agreeing.' } ] },
      ] },
    ],
  },
  {
    steps: [
      { s: 'shiro', t: 'The recruit\'s growth curve remains statistically offensive. I have started a second ledger purely to be angry in.' },
      { s: 'erin', t: 'She named it. It\'s called "HOW." I\'ve seen it. It\'s just the word HOW, forty times, getting angrier each line.' },
      { choice: [
        { t: '"Put it in the ledger, Shiro: I level faster when you\'re all watching."', bond: { shiro: 1 }, r: [ { s: 'shiro', t: '(pen pausing) ...Performance-linked growth. Witness-dependent. That is either a lie or the single most important sentence you have ever said, and I cannot yet tell which. Sit. This is now an interrogation.' } ] },
        { t: '"Keep the second ledger. I like being someone\'s favorite problem."', bond: { shiro: 1 }, r: [ { s: 'erin', t: 'FAVORITE problem?! Shiro, is he your favorite problem? Her ears did a thing. Sakura, back me up, her ears did a THING—' }, { s: 'shiro', t: 'My ears did no thing. This meeting is adjourned.' } ] },
      ] },
    ],
  },
  {
    steps: [
      { s: 'sakura', t: '(holding up two nearly identical vials) Which glows nicer — the mana-touched dew, or the boss-blood iridescence? For the flower press. It\'s important.' },
      { s: 'erin', t: 'Those are the same color.' },
      { s: 'sakura', t: 'They are ABSOLUTELY not the same color and I will not have this argument again—' },
      { choice: [
        { t: '"The dew. It glows like your Starfall right before it lands."', bond: { sakura: 1 }, r: [ { s: 'sakura', t: '(pockets the dew instantly, decision made, ears pink) ...That\'s — yes. Correct. Objectively. For scientific reasons that are definitely scientific.' } ] },
        { t: '"Make it a set. Press one of each with tonight\'s date."', bond: { sakura: 1 }, r: [ { s: 'narr', t: 'She presses both, and the date, and — when she thinks you aren\'t looking — a tiny fourth initial in the corner. Yours.' } ] },
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
  { t: 'A treasure chest sits in the exact center of an otherwise empty room, lid slightly ajar, breathing. It is definitely breathing.',
    choices: [
      { t: 'Strike first, loot second', effect: { gold: 1.1, xp: 0.4 }, log: 'It WAS a mimic. It is now a very surprised puddle and a pile of honest coin.' },
      { t: 'Slide a potion across the floor as tribute', effect: { item: '-potion', gp: 12 }, log: 'The lid clicks shut, content. It coughs up a guild seal from some earlier, less generous adventurer. The office pays finder\'s credit.' },
    ] },
  { t: 'Words are scratched into the wall in a dozen different hands, each a different party: HOW FAR HAVE YOU COME. Beneath them, blank stone waits for yours.',
    choices: [
      { t: 'Carve your rank and the date', effect: { xp: 0.6, gp: 5 }, log: 'The System hums as you carve. Somewhere, it is keeping this record too. The next party will measure themselves against you.' },
      { t: 'Carve the girls\' names instead of your own', effect: { hpPct: 0.15, xp: 0.3 }, log: 'Three names, no rank. The wall seems to approve. So, quietly, does the party walking behind you.' },
    ] },
  { t: 'A noble diver\'s corpse, weeks gone, clutches a jeweled charm pulsing with borrowed mana. Shiro identifies it at a glance: powerful, and very much still cursed.',
    choices: [
      { t: 'Take it — Shiro can cleanse it topside', effect: { gold: 1.4, hpPct: -0.1 }, log: 'The curse bites once on the way out, then sulks. Shiro pockets it for the workbench. "Mine to disarm. Do not touch the red rune."' },
      { t: 'Leave it; let Sakura say a passing rite', effect: { mpPct: 0.25, gp: 8 }, log: 'Sakura says the words. The mana settles like a sigh. The party walks lighter, and the guild credits the recovery.' },
    ] },
  { t: 'A hot spring bubbles improbably in the gate\'s heart, steam curling with faint restorative mana. Erin is already unbuckling her boots.',
    choices: [
      { t: 'Ten minutes. Everyone actually rests.', effect: { hpPct: 0.3, mpPct: 0.2 }, log: 'Ten stolen minutes of warmth. Erin hums. Shiro pretends to keep watch and falls asleep sitting up. It is the safest you have all felt in weeks.' },
      { t: 'Fill the canteens and push on', effect: { mpPct: 0.15, gp: 5 }, log: 'Mana-rich water for the road. The System notes your discipline; the party notes your cruelty, loudly, for the record.' },
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
E.ending_yuki = {
  id: 'ending_yuki', where: 'auto', once: true, priority: 100,
  steps: [
    { s: 'narr', t: 'The Threshold collapses behind you in a column of dying gold — and out of the light, laughing, ribbon streaming, comes the last person the guild ledgers ever expected on an S-rank clear: Yuki Beaumont, who was D-rank and drowning, and is now simply, radiantly, home.' },
    { s: 'yuki', t: 'D-Class. That\'s what my license said the day everyone stopped waiting. (she laces her fingers through yours) Look where the door went, {name}. Look who held it open long enough for me to walk through as myself.' },
    { s: 'narr', t: 'Behind her, three A-ranks are arguing cheerfully about whose turn it is to carry her on their shoulders for the guild procession. It is not really an argument. It\'s a family deciding.' },
    { s: 'yuki', t: 'I spent my whole life trying to catch up to people who loved me. Turns out I just had to stop running and let them close the distance. All four of them. All four of you.' },
    { s: 'sys', t: '[ FINAL QUEST COMPLETE. The System releases you. Final note, appended to the record of Yuki Beaumont: some subjects are not leveled. They are welcomed. ]' },
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
  const cands = ['sakura', 'erin', 'shiro'];
  if (S.flags && S.flags.yuki_member) cands.push('yuki');
  const top = Math.max(...cands.map(k => b[k] || 0));
  if (top < 5) return EVENTS.ending_party;
  const leaders = cands.filter(k => (b[k] || 0) === top);
  if (leaders.length > 1) return EVENTS.ending_party;
  return EVENTS['ending_' + leaders[0]];
}
