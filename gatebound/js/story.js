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
  mira:   { name: 'Mira',  color: '#c86a4a' },
  nessa:  { name: 'Nessa', color: '#8fce7a' },
  vex:    { name: 'Vex',   color: '#b08cff' },
  seris:  { name: 'Seris', color: '#8a6ad8' },
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

// ------------------------------------------------------------
// INTIMACY & THE HAREM — the warm, closer scenes that unlock
// once bonds are near-maxed. The per-girl "devotion" beats need
// her bond-10 scene first; the harem thread forms when more than
// one romance runs hot, and folds Yuki in once she's home.
// (Sensual but fade-to-black.)
// ------------------------------------------------------------

E.sakura_devotion = {
  id: 'sakura_devotion', where: 'camp', once: true, priority: 48,
  cond: S => S.bond.sakura >= 10 && S.seen.sakura_starfall,
  steps: [
    { s: 'narr', t: 'The others have turned in; the fire\'s down to embers. Sakura has been rereading the same page of volume five for ten minutes. Finally she sets it down and looks at you the way she looks at a spell an instant before it lands — certain, precise, unafraid.' },
    { s: 'sakura', t: 'I kept waiting to be too shy for this. To flinch. (she crosses to your bedroll, leaving the hat behind in the grass) It turns out the scabbard only ever covered one thing, and it wasn\'t fear. It was want. I want you, {name}. I have, since the tea.' },
    { s: 'narr', t: 'She kisses you slow and deliberate, a girl who has read every romance twice and is finally done reading. Her hands find your collar; the warm ozone-smell of her magic is close, and her breath is not steady at all — and neither, you notice, is yours.' },
    { choice: [
      { t: 'Pull her down into the warmth of the bedroll. "Then stop wanting from across the fire."', bond: { sakura: 1 },
        r: [
          { s: 'sakura', t: '(a soft, delighted sound against your mouth) Villain timing. You always— mm. Closer. I\'ll not be shy about closer.' },
          { s: 'narr', t: 'The embers gutter low and neither of you tends them. She stops narrating, stops rehearsing, stops being timid about a single thing — and the last clear thought you keep is that the most dangerous mage of her generation kisses the way she casts: all in, no apology, the sky answering.', spice: 'gentle' },
          { s: 'narr', t: 'The embers gutter unseen. She draws your shirt off with the same fearless precision she aims a spell, and when your hands find the laces of her robe she gasps your name like the first word of an incantation — and then there are no more words, only heat and skin and the hush of her breath, the most dangerous mage of her generation taking exactly what she wants in the dark and giving back more. When you notice the stars again they have wheeled halfway across the sky.', spice: 'steamy' },
          { s: 'narr', t: 'Later, tangled warm and quiet, she traces that little pressed-flower initial onto your chest, over and over, like signing her name to something she means to keep.' },
        ] },
      { t: 'Cup her face. "Say it once more — plainly. Let the prodigy ask."', bond: { sakura: 1 },
        r: [
          { s: 'sakura', t: '(low, steady, drawn-blade certain) I want you. Tonight, and the nights after it. Keep looking — and stop only looking.' },
          { s: 'narr', t: 'You don\'t only look. The fire burns to nothing untended, and in the morning Erin finds two watches unstood and, wisely, says not one word about it.' },
        ] },
    ] },
  ],
};

E.erin_devotion = {
  id: 'erin_devotion', where: 'camp', once: true, priority: 48,
  cond: S => S.bond.erin >= 10 && S.seen.erin_chosen,
  steps: [
    { s: 'narr', t: 'Second watch — and for once she didn\'t stand when the moon did. She waited for you instead: breastplate off, scarf loose, the firelight doing generous things to a woman who spent her whole life being appraised and never once simply wanted.' },
    { s: 'erin', t: 'My whole life I stood between people and harm. Nobody ever stood close enough to be the thing I was guarding. (she reaches for you, and her hand isn\'t steady, and she lets you see that it isn\'t) So come inside the wall, {name}. I\'m done keeping you at shield\'s length.' },
    { s: 'narr', t: 'She kisses like she fights — total commitment, no self-preservation — but slower now, learning the shape of unhurried, laughing low against your jaw when your fingers find the buckle of her gambeson.' },
    { choice: [
      { t: 'Pull the scarf the rest of the way loose. "Off duty, knight. That\'s an order you like."', bond: { erin: 1 },
        r: [
          { s: 'erin', t: '(that big unarmored laugh, gone breathless) Stars, I DO like it. Order me around, then — somebody finally learned the trick of me—' },
          { s: 'narr', t: 'And then there are no more orders, only the low fire and the astonishing discovery that the strongest woman in the party will come apart, utterly, for someone who simply asks what she wants and then gives it to her.', spice: 'gentle' },
          { s: 'narr', t: 'And then there are no more orders — only the gambeson gone, and the firelight on all that scarred strength, and the strongest woman in the party pulling you down over her with a groan that has nothing to do with battle. She gives the way she guards: everything, all at once, holding nothing back — and takes the same way, greedily, laughing into your throat, until the fire is embers and neither of you has the breath left to tend it.', spice: 'steamy' },
          { s: 'narr', t: 'Near dawn she pulls you against her like a shield turned inward and murmurs, half-asleep, that it\'s the first watch she\'s ever wanted to last until morning.' },
        ] },
      { t: 'Slow her down. Kiss her once, gently, and just hold her. "No commitment for once. Just this."', bond: { erin: 1 },
        r: [
          { s: 'erin', t: '(going very still, then softening all at once) ...Just this. I don\'t know how to just-this. (a shaky breath) Teach me. We\'ve got till morning.' },
          { s: 'narr', t: 'You teach her slow. She\'s a fast study at everything, it turns out — even at being cherished — and by the time the sky greys she has stopped bracing for the moment it gets taken away.' },
        ] },
    ] },
  ],
};

E.shiro_devotion = {
  id: 'shiro_devotion', where: 'camp', once: true, priority: 48,
  cond: S => S.bond.shiro >= 10 && S.seen.shiro_endgame,
  steps: [
    { s: 'narr', t: 'The board is put away. Shiro has poured two cups of tea and drunk neither. When you sit, she does something you have never once seen her do — she runs out of words, lets the silence stand, and reaches for your hand instead of a piece.' },
    { s: 'shiro', t: 'I have modeled this moment forty ways to keep from being surprised by it. (her thumb moves across your knuckles, unstrategic, undefended) Every model was wrong. I do not want to out-position you tonight. For the first time in my life I want to be read. Completely. By you.' },
    { s: 'narr', t: 'She kisses you like conceding a game she is overjoyed to lose — careful, then not careful at all, the White Queen\'s composure coming apart one deliberate button at a time because she has decided, with her whole formidable will, to let it.' },
    { choice: [
      { t: 'Take her hand off the strategy entirely. "No models tonight. Tell me what you want, out loud."', bond: { shiro: 1 },
        r: [
          { s: 'shiro', t: '(barely a whisper, utterly certain) You. Unhidden. All of it. I have spent my life unbeaten and unread, and I am so tired of winning alone—' },
          { s: 'narr', t: 'The candle burns down between you. She stops calculating. What is under the tactician, it turns out, is simply a woman who waited her entire disciplined life to be undone by exactly one person — and who means to make up the lost time with characteristic thoroughness.', spice: 'gentle' },
          { s: 'narr', t: 'The candle gutters and she lets it. The last of the composure comes undone under your hands — the White Queen who has never once in her life surrendered a position gives up every one of them at once, methodical even now, undoing you as precisely as she undoes herself, breath ragged against your mouth and her name for you the only word left in that formidable head. She makes up the lost time, as promised, with characteristic thoroughness, and the candle is long dead before she is done being read.', spice: 'steamy' },
          { s: 'narr', t: 'In the small hours she falls asleep against you mid-sentence: the only time you have ever known Shiro Miyouki to leave a thought unfinished.' },
        ] },
      { t: 'Match her, slow and deliberate. "One move at a time. I\'m not going anywhere."', bond: { shiro: 1 },
        r: [
          { s: 'shiro', t: 'One move at a time. (the ghost of a smile) You have learned to speak my language. I intend to spend a very long time becoming fluent in yours.' },
          { s: 'narr', t: 'She leaves the tea cold and the ledger closed. Some nights, she notes privately, are not for accounting. They are simply for keeping.' },
        ] },
    ] },
  ],
};

// --- Yuki's romance (after she's fully herself) ---

E.yuki_bond1 = {
  id: 'yuki_bond1', where: 'camp', once: true, priority: 46,
  cond: S => S.flags.yuki_member && S.flags.yuki_femme && S.bond.yuki >= 6 && S.seen.yuki_fem3,
  steps: [
    { s: 'narr', t: 'Yuki has taken the evening cooking from Sakura — badly, joyfully, with the specific delight of someone doing an ordinary thing she was never once allowed to want. She waves you over to taste-test, ribbon slipping, sleeves shoved up.' },
    { s: 'yuki', t: 'Too much pepper? Erin says there\'s no such thing, but Erin once ate a trap thinking it was a biscuit, so. (she offers the spoon, then falters, softer) ...Nobody ever let me near a kitchen. Beaumont heirs get catered. I have wanted to stir a pot for twenty-two years and never once said so out loud.' },
    { s: 'narr', t: 'She says it lightly, the way she says all the enormous things now — but her eyes are bright, and her hand on the spoon is not entirely steady.' },
    { choice: [
      { t: 'Taste it, and tell her the truth. "It\'s good, Yuki. And it\'s yours."', bond: { yuki: 2 },
        r: [
          { s: 'yuki', t: '(the brightness spilling over) Mine. The pepper and the pot and the— (she laughs wetly) I keep finding things that are just mine now. A voice. A name I get to keep. A person I get to look at like this without pretending I\'m not.' },
          { s: 'narr', t: 'She doesn\'t clarify who she means. She doesn\'t have to. The stew is, for the record, genuinely too peppery, and you finish every bite of it anyway.' },
        ] },
      { t: '"Twenty-two years of wanting to stir a pot. What else have you never let yourself want?"', bond: { yuki: 2 },
        r: [
          { s: 'yuki', t: '(going still, the spoon forgotten) ...That\'s a dangerous question to ask me by firelight. The list is long, and I\'ve only just started reading it aloud. (a brave breath) You\'re near the top of it. In case the ribbon and the gown and the cooking-for-you hadn\'t made that embarrassingly clear.' },
          { s: 'narr', t: 'Behind you, Sakura very quietly rescues the pot before it can boil over — because someone in this party has to keep their head, and it is plainly not going to be either of you tonight.' },
        ] },
    ] },
  ],
};

E.yuki_bond2 = {
  id: 'yuki_bond2', where: 'camp', once: true, priority: 47,
  cond: S => S.flags.yuki_member && S.bond.yuki >= 8 && S.seen.yuki_bond1,
  steps: [
    { s: 'narr', t: 'She takes the watch with you now — not because it\'s assigned, but because she likes the quiet and the company and the way the fire makes the ridge feel like the edge of somewhere safe. Tonight she sits close enough that her shoulder finds yours and stays.' },
    { s: 'yuki', t: 'Can I tell you the part I never put in the letters? Every gate I cleared alone, every rank I clawed up — I said it was to catch up to the girls. It wasn\'t. It was so that when I finally stood next to you, I\'d have earned the right to want what I wanted. I thought love was a thing you had to be strong enough to deserve.' },
    { s: 'yuki', t: '(she turns, steady now, no flinch left in her) You taught me it isn\'t. You just made room and said fit. I\'ve been fitting a little more every day since — closer to the middle. Closer to you.' },
    { choice: [
      { t: 'Close the last of the distance. "Then stop measuring the room and take your place in it. Right here."', bond: { yuki: 2 },
        r: [
          { s: 'narr', t: 'She kisses you like someone who spent four years running and has finally, blessedly, arrived — tentative for exactly one heartbeat, and then not tentative at all.' },
          { s: 'yuki', t: '(pulling back just enough to breathe) Oh. I understand the poetry now. All of it. Every terrible line in every book Sakura hides. They were writing about this.' },
        ] },
      { t: '"You never had to earn it. But watching you become yourself has been the best thing I\'ve ever gotten to see."', bond: { yuki: 2 },
        r: [
          { s: 'yuki', t: '(a long, shining silence) ...I\'m going to remember that sentence for the rest of my life. On the bad days especially. (she leans her head on your shoulder) Stay on watch with me. Not because there\'s anything out there — because there\'s something right here I don\'t want to stop looking at.' },
          { s: 'narr', t: 'You stay. The moon crosses the whole sky, and neither of you wakes the next watch to relieve you.' },
        ] },
    ] },
  ],
};

E.yuki_devotion = {
  id: 'yuki_devotion', where: 'camp', once: true, priority: 48,
  cond: S => S.flags.yuki_member && S.bond.yuki >= 10 && S.seen.yuki_bond2,
  steps: [
    { s: 'narr', t: 'The others have drifted to sleep; the ridge is yours. Yuki has been brushing out her hair by the fire, ribbon in her lap — and when she catches you watching, she doesn\'t look away, doesn\'t blush, doesn\'t make herself small. She just holds out a hand.' },
    { s: 'yuki', t: 'I spent so long being who I was supposed to be that I forgot I\'d get to choose who I\'m someone-with. (you take her hand; she draws you down beside her) I choose you, {name}. Not to catch up to, not to earn — to keep. Stay with me tonight. All the way. No edges.' },
    { s: 'narr', t: 'She kisses you soft, then not soft, learning the shape of being wanted back with the same fierce joy she brought to learning everything else about her new life.', spice: 'gentle' },
    { s: 'narr', t: 'She kisses you soft, then not soft at all — hair loose around you both, the gown slipping, her breath catching bright against your mouth as she draws you down into the warmth of her bedroll and learns, with hands and skin and firelight, exactly what being wanted back feels like. She brings to it the same fierce, delighted thoroughness she brought to everything else about her new life, and she does not let you go until the fire is embers and the sky is thinking about grey.', spice: 'steamy' },
    { choice: [
      { t: '"No edges, Yuki. You\'re in the middle now — right where you belong. With me."', bond: { yuki: 1 },
        r: [
          { s: 'yuki', t: '(tucked warm against you, wondering) The middle. I keep waiting to not believe it, and then I wake up here, and I do. (she presses the pink ribbon into your hand) Keep this. So there\'s always a little of me on your gear, wherever the gates take us.' },
          { s: 'narr', t: 'You tie it to your strap beside Sakura\'s pressed flower. Some people make the whole party better just by refusing to leave. She was right about that, back when she was too far away to know she was writing about herself.' },
        ] },
      { t: 'Say nothing. Just hold her until the shaking of pure relief goes quiet.', bond: { yuki: 1 },
        r: [
          { s: 'narr', t: 'She cries a little — the good kind, the kind that finally has somewhere safe to happen — laughs at herself for it, and lets you hold her through both. The edge-dweller, asleep in the middle at last, one hand fisted in your shirt like she is still not quite ready to believe it won\'t be taken away.' },
          { s: 'yuki', t: '(half-asleep, fierce) ...Not going anywhere. Neither are you. That\'s the whole rest of the plan.' },
        ] },
    ] },
  ],
};

// --- The harem forms (needs more than one romance running hot) ---

E.harem_talk = {
  id: 'harem_talk', where: 'camp', once: true, priority: 49,
  cond: S => ['sakura', 'erin', 'shiro'].filter(k => S.bond[k] >= 8).length >= 2,
  steps: [
    { s: 'narr', t: 'You come back from the tree line to a fire gone strangely quiet — the specific quiet of a conversation that stopped the instant you got close. Three women, not looking at each other, each wearing the same guilty softness.' },
    { s: 'erin', t: '(too brightly) Nothing! We were discussing — watch rotations!' },
    { s: 'shiro', t: 'We were not. (setting down the pretense like a bad hand) We were comparing notes. On you. And discovering, to no one\'s statistical surprise but our own, a great deal of overlap.' },
    { s: 'sakura', t: '(from under her hat, very small) ...I thought it was only me. For the longest time I thought it was only me.' },
    { s: 'narr', t: 'The truth settles in the firelight between the four of you, enormous and delicate: each of them has fallen, all of them know it now, and nobody — this is the part that stops your breath — nobody looks angry.' },
    { choice: [
      { t: '"I won\'t lie to any of you. I couldn\'t choose between you if the gate depended on it."', bond: { sakura: 1, erin: 1, shiro: 1 },
        r: [
          { s: 'shiro', t: 'Good. A forced choice is a losing position for everyone at the table, and I did not spend three years escaping one arrangement I never chose to walk into another.' },
          { s: 'erin', t: '(slowly, testing the shape of it) ...So we don\'t choose. So we all just... stay. And it isn\'t a competition, it\'s a—' },
          { s: 'sakura', t: 'A party. (a wet, radiant laugh) It\'s a party. We\'re very good at those.' },
          { s: 'narr', t: 'Nothing is decided tonight. But something eases in all three of them at once, and the fire feels warmer than the wood should allow.' },
        ] },
      { t: '"Then talk to each other — not around me. Whatever this becomes, you decide it together."', bond: { shiro: 1, erin: 1 },
        r: [
          { s: 'narr', t: 'So they talk. For the first time, honestly, over your head and to each other — three women who armored themselves against the whole world learning they never once had to be armored against each other.' },
          { s: 'shiro', t: '(much later, to you, dry) You realize you have delegated the most important negotiation of your life to a knight, a shy prodigy, and me. God help you. We will be thorough.' },
        ] },
    ] },
  ],
};

E.harem_pact = {
  id: 'harem_pact', where: 'camp', once: true, priority: 50,
  cond: S => S.seen.harem_talk && ['sakura', 'erin', 'shiro'].every(k => S.bond[k] >= 8),
  steps: [
    { s: 'narr', t: 'They ambush you after the clear — all three, arranged with suspicious deliberateness, Shiro plainly appointed to speak because Shiro is hardest to fluster, and even she is faintly pink.' },
    { s: 'shiro', t: 'We have deliberated. At length. There were charts. Erin insisted on the charts.' },
    { s: 'erin', t: 'The charts were GOOD—' },
    { s: 'shiro', t: 'The finding is unanimous, which for the three of us is a small miracle of state. We are not interested in any version of our lives that requires us to give you up — or to give each other up. We would sooner keep all of it. All of us. Openly.' },
    { s: 'sakura', t: '(stepping forward, braver than you have ever seen her, taking your hand) No hiding. No taking turns pretending it isn\'t what it is. We talked, and we chose, and we choose this. We choose you — and we choose being the kind of family that has room.' },
    { s: 'narr', t: 'Three women who each spent a lifetime bartered, guarded, or calculated into corners — standing in front of you having freely, loudly, together decided exactly what they want. The weight of it is staggering. The trust in it, more so.' },
    { choice: [
      { t: '"Then it\'s decided — all of us, all in, nobody at the edge. Luckiest F-rank who ever lived."', bond: { sakura: 1, erin: 1, shiro: 1 }, flag: 'harem_formed',
        r: [
          { s: 'erin', t: '(tackling you into a hug that drags Sakura and, protesting, Shiro along with it) LUCKIEST! He said luckiest! Group verdict: correct!' },
          { s: 'shiro', t: '(muffled, from somewhere in the pile, with enormous dignity) I would like it on the record that I calculated this outcome at eleven percent and have never been more delighted to be wrong.' },
          { s: 'sakura', t: 'Eleven percent! (laughing) We beat the odds. We\'re a statistical anomaly. We\'re a FAMILY.' },
          { s: 'narr', t: 'Whatever the guild ledgers call the four of you after tonight, you will call it what they do privately from now on: home.' },
        ] },
      { t: 'Kiss each of them, once, unhurried, in turn. Let the answer be wordless.', bond: { sakura: 2, erin: 2, shiro: 2 }, flag: 'harem_formed',
        r: [
          { s: 'narr', t: 'Sakura first — she rises onto her toes, fearless now. Erin next, who laughs into it and then very much doesn\'t. Shiro last, who holds your face in both hands and takes her time, because Shiro takes her time with the things that matter.' },
          { s: 'shiro', t: '(softly, forehead to yours) Motion carries. Unanimously. Come to bed, {name} — all of us. We have a great deal of lost time to be inefficient about.' },
          { s: 'narr', t: 'The fire burns low behind you, untended and unmissed. The harem the guild once joked about is, quietly and completely, real.', spice: 'gentle' },
          { s: 'narr', t: 'They take you to bed the way they do everything now — together, no hesitation left between the four of you. Erin\'s laughter and Sakura\'s fearless hands and Shiro murmuring, unhurried, that there is no rush, none, that you have the whole night and every night after it. The fire burns down untended and thoroughly unmissed. The harem the guild once joked about is, completely and gloriously, real.', spice: 'steamy' },
        ] },
    ] },
  ],
};

E.harem_whole = {
  id: 'harem_whole', where: 'camp', once: true, priority: 51,
  cond: S => S.flags.harem_formed && S.flags.yuki_femme && S.bond.yuki >= 6,
  steps: [
    { s: 'narr', t: 'Five bedrolls now, drawn into the rough ring they always seem to end up in. Yuki still sits a little apart out of the oldest habit she has — and this time it is Shiro, of all people, who reaches out and tugs her bedroll into the circle by one corner.' },
    { s: 'shiro', t: 'You are doing the edge thing again. We have a standing policy against the edge thing.' },
    { s: 'yuki', t: '(startled, then melting) Sorry. Force of habit. Four years of habit. I keep thinking there\'s a version of this that doesn\'t have room for me.' },
    { s: 'erin', t: 'Yeah, well, there isn\'t. We took a vote. It was unanimous and also I threatened everyone.' },
    { s: 'sakura', t: '(shyly, but reaching for Yuki\'s hand) We didn\'t open the circle for {name} and then close it again, silly. It just keeps having room. That\'s the whole point of it. Come in.' },
    { s: 'narr', t: 'Yuki looks at the four of you — knight, mage, queen, and the one who held every door open long enough — and understands, finally, that the harem was never a line she had to earn a place at the end of. It is a fire, and the fire simply makes more room.' },
    { choice: [
      { t: '"Five, then. No edges left. Come here, Yuki — you\'re home. All the way home."', bond: { yuki: 2 },
        r: [
          { s: 'narr', t: 'She comes in. Of course she does. And the last thing separating Yuki Beaumont from what she\'d wanted since she was too young to name it dissolves like a gate scar sealing — quietly, completely, for good.' },
          { s: 'yuki', t: '(from the warm tangle of all of them, laughing, crying, home) Five. We\'re five. I\'m one of— I\'m one of US.' },
          { s: 'shiro', t: 'You are one of us. Ratified. Now stop narrating your own happiness and be inefficient with the rest of us; it is very late, and the watch can mercifully keep itself tonight.' },
          { s: 'narr', t: 'The fire burns to embers over five people who spent their whole lives being told love was a thing you competed for — and who found instead that the right fire only ever gets warmer the more you crowd around it.', spice: 'gentle' },
          { s: 'narr', t: 'And then the circle closes warm around all five of you, and Yuki learns — laughing, breathless, wholly undone by belonging — exactly how much room the middle has, and how many glad hands are there to keep her in it. The fire burns to embers, unwatched and unmourned, over five people who were each told love was a thing you competed for, and who found instead that the right fire only ever gets warmer the more you crowd around it.', spice: 'steamy' },
        ] },
      { t: 'Say nothing. Open your arms — and let all four of them pull her in at once.', bond: { yuki: 2 },
        r: [
          { s: 'narr', t: 'It isn\'t a decision so much as a tide. Sakura first, then Erin\'s whole armored enthusiasm, then Shiro\'s deliberate warmth, and you at the center of it — and Yuki folded into the middle, where the edge-dweller never once believed she\'d be allowed to sit.' },
          { s: 'yuki', t: '(muffled, overwhelmed, radiant) ...Oh. OH. So this is what the middle feels like.' },
          { s: 'narr', t: 'The harem is whole. Five hearts, one fire, and not a single one of them ever at the edge again.' },
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
E.ending_harem = {
  id: 'ending_harem', where: 'auto', once: true, priority: 100,
  steps: [
    { s: 'narr', t: 'The Threshold collapses behind you in a column of dying gold — and you don\'t walk out of it alone, or beside one person, but wrapped in the whole loud impossible family you built one gate at a time.' },
    { s: 'erin', t: 'Group verdict on the S-rank!' },
    { s: 'sakura', t: 'Ten!' },
    { s: 'shiro', t: 'Ten. I concede the point without a recount — which those of you keeping records will note is unprecedented.' },
    { s: 'narr', t: 'They fall on you all at once, the way they do now: Erin\'s armored enthusiasm, Sakura\'s fearless softness, Shiro\'s deliberate warmth — everyone who was bartered and guarded and calculated into a corner, and who chose, freely and together, to stop choosing corners at all.' },
    { s: 'sakura', t: 'The guild is going to talk, you know. About all of us. The Fourth and his—' },
    { s: 'shiro', t: 'Let them. I have run the numbers on our happiness against our reputation, and the happiness wins by a margin I intend to keep widening for the rest of our lives.' },
    { s: 'erin', t: 'Home, then? All of us?' },
    { s: 'narr', t: 'All of you. The gates never really close — and neither, it turns out, does the space around a fire that has decided there will always, always be room.' },
    { s: 'sys', t: '[ FINAL QUEST COMPLETE. The System releases you. Its final entry is not a number. For the first time in its existence, it simply writes: kept. All of them. Kept. ]' },
    { s: 'narr', t: '— GATEBOUND: cleared. Thank you for playing. (Free play continues — the gates never really close.) —' },
  ],
};

// ------------------------------------------------------------
// WEDDING — post-Monarch epilogue once a romance is sealed
// (harem, or any single bond at max). Fires from the guild.
// ------------------------------------------------------------

E.wedding_sakura = {
  id: 'wedding_sakura', where: 'auto', once: true, priority: 95,
  steps: [
    { s: 'narr', t: 'The gates are closed, the Monarch is a story children will get wrong for centuries, and the Adventurers\' Guild — which has survived three continents\' worth of horrors — is this morning entirely undone by the fact that Sakura pressed every single flower in the hall herself.' },
    { s: 'narr', t: 'She comes up the aisle without her hat, pink hair wild and crowned in blossoms, and she does not flinch and does not make herself small. Every eye in the packed hall is on her, and for the first time in her life the most dangerous mage of her generation simply lets them look.' },
    { s: 'sakura', t: '(reaching you, steady, drawn-blade certain) I rehearsed being brave for this in about forty novels. Then I stopped rehearsing. (a breath) I wrote us a better ending than any of them, {name}. Volume five. It only ever needed a co-author who\'d keep looking.' },
    { s: 'guild', t: '(Guildmaster Hale, misty, pretending not to be) Nine years stamping licenses and never once had cause to stamp one of these. Leave it to the Fourth.' },
    { s: 'sys', t: '[ The System has no protocol for weddings. It observes the timid F-rank recruit who once could not meet its gaze now stand at the front of a crowded hall — unafraid, chosen, choosing. Outcome: unquantifiable. Acceptable. ]' },
    { s: 'narr', t: 'Erin ugly-cries through the whole ceremony. Shiro reads the vows aloud in a voice that does not once waver, which is exactly how everyone knows what it costs her. And Sakura says hers from the back cover of "The Blackguard\'s Bride, Vol. IV," and it is perfect.' },
    { s: 'narr', t: 'Then the kiss, soft as a held breath finally let go, and the roar of the guild, and a rain of iridescent petals she saved from a hundred boss chambers just for this. The door was never locked. She simply chose, at last, to walk through it toward you.', spice: 'gentle' },
    { s: 'narr', t: 'Then the kiss — the drawn blade, all of it, deep enough that the front row cheers and the back row wolf-whistles and Sakura, scarlet and delighted, does not pull back one second sooner than she means to. There is a wedding night after, and the guild will speculate forever, and she will only ever smile about it from under a hat brim. The door was never locked. She kicked it open.', spice: 'steamy' },
    { s: 'narr', t: '♥  GATEBOUND — and the prodigy and her fourth lived, gate after gate, happily.  ♥' },
  ],
};
E.wedding_erin = {
  id: 'wedding_erin', where: 'auto', once: true, priority: 95,
  steps: [
    { s: 'narr', t: 'The gates are closed, the Monarch is a story children will get wrong for centuries, and the Adventurers\' Guild is packed to the rafters because word got out that Erin Sterling is getting married in a GOWN, and half the continent refused to miss it.' },
    { s: 'narr', t: 'She comes up the aisle with no armor anywhere on her — just the blue-and-gold dress she chose herself, no chaperone gritting teeth at the price of her — and she is laughing before she reaches you, that big unarmored laugh nobody in that childhood ballroom ever got to hear.' },
    { s: 'erin', t: 'My whole life somebody else decided what I was for. (she takes your hands, fierce and bright) You just kept asking what I wanted. So here\'s me, loudest I have ever been, deciding in front of the guild and the gods and my mother\'s worst nightmare of a guest list: you. I pick you. On purpose. Forever.' },
    { s: 'guild', t: '(Guildmaster Hale, gruff and wet-eyed) Somebody fetch the paperwork. And somebody fetch the paladin\'s mother a chair — she\'s gone the color of a retreat flare.' },
    { s: 'sys', t: '[ The System has no protocol for weddings. It observes the wall that spent a life standing between people and harm finally step out from in front of the door — and choose, for once, to walk through it. Outcome: the strongest stat on record was never DEF. ]' },
    { s: 'narr', t: 'Her vows dissolve into happy nonsense halfway through and nobody minds. Sakura cannot stop crying. Shiro, maid of honor under loud protest, produces exactly the right number of handkerchiefs — because Shiro plans for everything, including this.' },
    { s: 'narr', t: 'Then the kiss, and the roar, and Erin sweeping you into a dance right there at the altar — no music, no chaperone, no armor anywhere in it. Total commitment, zero self-preservation, exactly how she loves.', spice: 'gentle' },
    { s: 'narr', t: 'Then the kiss — the kind she throws her whole armored heart into, dipping you in front of forty cheering adventurers until the wolf-whistles drown the officiant out. There is a wedding night, and the walls of the guild inn are not thick, and Erin Sterling has never once in her life done anything quietly. The party is still going at dawn; so, reportedly, are the newlyweds.', spice: 'steamy' },
    { s: 'narr', t: '♥  GATEBOUND — and the knight and her fourth lived, gate after gate, happily.  ♥' },
  ],
};
E.wedding_shiro = {
  id: 'wedding_shiro', where: 'auto', once: true, priority: 95,
  steps: [
    { s: 'narr', t: 'The gates are closed, the Monarch is a story children will get wrong for centuries, and in the Adventurers\' Guild — decorated with a precision that could only be Miyouki — Shiro stands at the altar in white and gold: unpledged, unpriced, and for the first time in her life spending her own time exactly as she chooses.' },
    { s: 'shiro', t: 'Final tally. (her voice does not waver; only you are close enough to see her hands) One syndicate outmaneuvered. One house debt cleared, article twelve as designed. One betrothal dissolved without casualties. One S-rank gate closed. And one read — mine, day one, "convenient, disposable, F" — corrected, permanently, in front of witnesses, by marrying it.' },
    { s: 'guild', t: '(Guildmaster Hale, misty, pretending not to be) I have costed a great many weddings. Never one where the bride audited my flower budget first — and then approved it out of her own pocket.' },
    { s: 'sys', t: '[ The System has no protocol for weddings. It observes the mind that has never once been outplayed choose, deliberately and with full information, to be kept. It notes: she calculated this at eleven percent. It notes: she appears, at present, one hundred percent content. ]' },
    { s: 'narr', t: 'Her vows are four precise sentences. They make the entire hall weep. She sets the folding board on the signing table beside the register — obsidian and bone, the white king still on its side from game forty-one — and she does not reset it, because some games you leave exactly where they mattered.' },
    { s: 'narr', t: 'Then the kiss: unhurried, deliberate, the way she does everything that matters — a woman conceding the one game she is overjoyed, at last, to have lost.', spice: 'gentle' },
    { s: 'narr', t: 'Then the kiss — and the White Queen of the Miyouki house, who has never surrendered a position in her life, gives up every one of them at once in front of the entire guild: thorough, unhurried, utterly undone, until even Erin has the grace to look away and cheer. There is a wedding night. She has, she informs you, modeled it extensively, and intends to discard every model. She does.', spice: 'steamy' },
    { s: 'narr', t: '♥  GATEBOUND — and the queen and her fourth lived, gate after gate, happily.  ♥' },
  ],
};
E.wedding_yuki = {
  id: 'wedding_yuki', where: 'auto', once: true, priority: 95,
  steps: [
    { s: 'narr', t: 'The gates are closed, the Monarch is a story children will get wrong for centuries, and in the packed Adventurers\' Guild the last person the ledgers ever expected at the front of a wedding stands there in white and green, ribbon in her long hair — radiant, unhurried, home.' },
    { s: 'yuki', t: '(taking your hands, steady, no flinch left anywhere in her) D-rank. That\'s what my license said the day everyone stopped waiting for me. I spent four years and forty gates learning how to hear a no. (her eyes shine) It took walking through your door to learn what a yes feels like. This is mine — the biggest one I have. Yes. Forever. Out loud, where everyone can hear it.' },
    { s: 'guild', t: '(Guildmaster Hale, openly weeping now, past pretending) I stamped that D-Class license myself, kid. Never in my life been so glad to be so wrong about a ceiling.' },
    { s: 'sys', t: '[ The System has no protocol for weddings, and less for this one. Final appended note to the record of Yuki Beaumont: some subjects are not leveled, and not carried, and not caught up to. Some are simply, at long last, welcomed all the way in. ]' },
    { s: 'narr', t: 'Erin cries and denies it. Sakura pressed the flowers. Shiro, who audited a syndicate to free herself, quietly saw to it that the name on the register was written exactly the way Yuki wanted it written. And Yuki says only one word for her vow — "home" — and cannot manage another, and does not need to.' },
    { s: 'narr', t: 'Then the kiss, soft and certain and years in the making, and the roar of a guild that watched a lamb become a woman become a wife, all under its own roof, all in the span of a single impossible season.', spice: 'gentle' },
    { s: 'narr', t: 'Then the kiss — the fierce, delighted thoroughness she brings to everything about her new life, held long enough that the front row cheers and the back row wolf-whistles and she laughs into it without an ounce of the old flinch. There is a wedding night, and the edge-dweller spends it dead center, exactly where she always belonged. She does not, for once, narrate her own happiness. She is far too busy living in the middle of it.', spice: 'steamy' },
    { s: 'narr', t: '♥  GATEBOUND — and the girl who walked through her own door, and her fourth, lived, gate after gate, happily.  ♥' },
  ],
};
E.wedding_harem = {
  id: 'wedding_harem', where: 'auto', once: true, priority: 95,
  steps: [
    { s: 'narr', t: 'The gates are closed. The Monarch is a story children will get wrong for centuries. And the Adventurers\' Guild — which has seen three continents\' worth of horrors walk through its doors — is, this morning, entirely undone by flowers.' },
    { s: 'guild', t: '(misty, and pretending not to be) Never officiated a wedding in the hall before. Never had cause. Leave it to the Fourth to make me learn a whole new form of paperwork on my way out the door.' },
    { s: 'narr', t: 'Erin has been crying since dawn and denying it since dawn. Sakura pressed every flower herself. Shiro costed the whole affair and then, scandalously, sent no one the bill. And you stand at the front of it in borrowed finery, waiting for the people who each chose to keep pace beside you — and beside each other.' },
    { s: 'narr', t: 'However many rings the guild jeweller had to size — and she has Opinions about the number, every one of which she has voiced — they fit. Every last one of them fits.' },
    { s: 'sys', t: '[ The System has no protocol for this. It observes anyway, and decides, after long consideration, that this is the highest-value outcome it ever failed to predict. ]' },
    { s: 'narr', t: 'Vows are exchanged. Erin\'s dissolves into happy nonsense and nobody minds. Shiro\'s is four precise sentences that make the entire hall weep. Sakura reads hers from the back of a battered novel, and it is perfect — and Yuki, if she stands among you, simply says "home," once, and cannot manage another word, and does not need to.' },
    { s: 'narr', t: 'Then the kisses, and the roar of the guild, and rice flung by adventurers who have flung far worse. The doors bang open on the first day of the rest of a life nobody at that assessment table, a lifetime ago, would ever have dared to score.', spice: 'gentle' },
    { s: 'narr', t: 'Then the kisses — each held long enough to make the front row cheer and the back row wolf-whistle, and carrying the unmistakable promise of a wedding night the guild will gossip about for a decade and none of you will ever once confirm. Rice, and roaring, and the doors banging open on the rest of a gloriously crowded life.', spice: 'steamy' },
    { s: 'narr', t: 'And somewhere far off, a letter arrives: bottles of Beaumont\'s finest and a card that reads only, "I always knew the door led somewhere good. Congratulations, all of you. — Y." (Unless Yuki is among those holding your hands at the altar — in which case she sent no card, because for the first time in her life the words had nowhere else they needed to go.)' },
    { s: 'narr', t: '♥  GATEBOUND — and they lived, gate after gate, happily.  ♥' },
  ],
};

// ------------------------------------------------------------
// RECRUITMENT — petitions to join, after the Threshold closed.
// where:'offer' keeps these out of the guild/camp pickers; the
// Newcomers screen plays them directly. The accept choice sets
// recruit_<id>_accept, which the UI turns into a signed member.
// ------------------------------------------------------------

E.recruit_intro_mira = {
  id: 'recruit_intro_mira', where: 'offer', once: false,
  steps: [
    { s: 'narr', t: 'She\'s at the bar when you come down: boots on the rail, sword too well-kept to be decorative, drinking the guild\'s cheapest tea like it\'s a test she\'s giving the establishment.' },
    { s: 'mira', t: 'Mira Ashvale. Sellsword, twenty years under contract, references on request — the living ones, anyway.' },
    { s: 'narr', t: 'She looks you over the way a smith looks over someone else\'s work: professionally, and without flattery.' },
    { s: 'mira', t: 'I was two provinces east when the Threshold closed. You know what a Monarch-class clear does to the mercenary market? Nothing. No panic contracts, no evacuation escorts, no salvage runs. You put half my trade out of business in one afternoon.' },
    { s: 'player', t: '...Sorry?' },
    { s: 'mira', t: 'Don\'t be. It was the first good news I\'ve carried in a decade. So here\'s my pitch: I\'m done bleeding for coin I have to count twice. I want the other thing. The thing your lot has.' },
    { s: 'erin', t: '(from the next table, not even pretending not to listen) She means family. I checked. She got embarrassed and threatened me.' },
    { s: 'mira', t: 'I offered a professional escalation of terms. (a pause) ...She hugged me. Nobody warned me about that.' },
    { choice: [
      { t: 'Sign her. The wall could use another shield.', flag: 'recruit_mira_accept',
        r: [
          { s: 'mira', t: 'Then we have terms. Standard rates: I hold the door, you lot do the flashy nonsense, and nobody dies without written notice.' },
          { s: 'narr', t: 'She signs the ledger in a mercenary\'s tidy, contract-proof hand. The pen pauses only once — over the line marked "guild family, in perpetuity."' },
          { s: 'mira', t: '(quietly) Huh. In perpetuity. (she signs it) Paid in full.' },
        ] },
      { t: '"Not yet. Let me think on it."',
        r: [
          { s: 'mira', t: 'Smart. Never sign day-of. I\'ll be at the bar — the tea\'s terrible, but the company\'s improving.' },
        ] },
    ] },
  ],
};

E.recruit_intro_nessa = {
  id: 'recruit_intro_nessa', where: 'offer', once: false,
  steps: [
    { s: 'narr', t: 'There is a young woman at the petitions desk who has clearly rehearsed this. She has a basket of tinctures, a letter of introduction in handwriting that has been erased and rewritten, and a speech.' },
    { s: 'nessa', t: 'Good morning! My name is Nessa Vale, I\'m a herbalist, licensed, mostly, and I— I would like to formally petition to—' },
    { s: 'narr', t: 'She sees you. The speech dies. The basket nearly follows; she catches it with both arms like it\'s a patient.' },
    { s: 'nessa', t: 'You\'re — oh no, you\'re *him*. The Fourth. Half the people I\'ve stitched up this season came out of gates saying your name. The other half came out saying the ladies\' names, which, honestly, fair.' },
    { s: 'shiro', t: '(not looking up from her ledger) Her tincture work is competent. I priced it. She undercharges by forty percent.' },
    { s: 'nessa', t: 'People can\'t heal if they can\'t *afford* to— wait, you priced my stall? When did— (she takes a breath, straightens) No. I practiced this. I want to join. Wounds don\'t wait topside for the survivors — someone should be *in there* with you.' },
    { choice: [
      { t: 'Welcome her in. Every party outlives its potions eventually.', flag: 'recruit_nessa_accept',
        r: [
          { s: 'nessa', t: 'Really?! I mean— (composing herself, failing) yes. Good. Thank you. I promise you will only regret this a normal amount.' },
          { s: 'narr', t: 'She signs the ledger, apologizes to the pen, and immediately begins reorganizing the guild\'s first-aid cabinet without asking anyone.' },
          { s: 'erin', t: '(watching, delighted) Oh, she\'s going to fix all of us whether we like it or not.' },
        ] },
      { t: '"Not yet — but keep the basket packed."',
        r: [
          { s: 'nessa', t: 'Oh! Yes. Of course. Sensible. I\'ll just — I\'ll be re-rolling bandages. For whenever. No pressure. (whispering) Please eventually.' },
        ] },
    ] },
  ],
};

E.recruit_intro_vex = {
  id: 'recruit_intro_vex', where: 'offer', once: false,
  steps: [
    { s: 'narr', t: 'The guild hall goes quiet in a moving line, like wind over wheat. Something person-shaped and midnight-colored is standing at the petitions desk with immaculate posture. It has filled out the membership form. In calligraphy.' },
    { s: 'vex', t: 'Greeting. I am called Vex. I have been called other things, with screaming, but Vex is the version I have selected.' },
    { s: 'narr', t: 'Its eyes are two patient violet lights. The form in front of it lists, under "previous experience": *dark (extensive)*.' },
    { s: 'vex', t: 'I lived below. Under the gates, in the sealed places. When you unmade the Monarch, the ceiling of my world cracked open, and there was — all of this. (it gestures, carefully, at everything) Lamplight. Soup. The sound the tall golden one makes when amused.' },
    { s: 'erin', t: 'My laugh. It means my laugh. It followed it here from two streets away.' },
    { s: 'vex', t: 'I watched your guild for three days. You bring each other home. Even the damaged ones. Even the strange ones. I would like to learn how that is done. I am strong, I do not tire, and I have been informed by the small pink one that I am, quote, "actually very polite."' },
    { s: 'sakura', t: '(from behind Erin, whisper) He held the door for me. With a tendril. It was very courteous...!' },
    { choice: [
      { t: 'Sign it in. The dark fought beside worse.', flag: 'recruit_vex_accept',
        r: [
          { s: 'vex', t: 'Accepted-into. (it tries the word again, slower) Accepted. Into.' },
          { s: 'narr', t: 'It signs the ledger. The signature is beautiful. The pen is, briefly, part of its hand.' },
          { s: 'vex', t: 'I will hold your dark places so that none of you must stand in them alone. This is a joke I have prepared: I am a natural fit for the position, as I am mostly holes. ...The laugh sound, please, when ready.' },
        ] },
      { t: '"Give the guild time to get used to you first."',
        r: [
          { s: 'vex', t: 'Sensible. Integration requires exposure. I will remain near the hearth, being observable. I have been practicing "lurking approachably."' },
        ] },
    ] },
  ],
};

E.recruit_intro_seris = {
  id: 'recruit_intro_seris', where: 'offer', once: false,
  steps: [
    { s: 'narr', t: 'She does not petition. She presents credentials: Seris Val, agent of the Arcane College, seconded to the guild by an arrangement Guildmaster Hale describes, through his teeth, as "not optional."' },
    { s: 'seris', t: 'Let us be efficient. The College has forty-one reports on you. Growth curves that violate three laws of thaumic conservation. A Monarch-class clear by a party of four. And now the Threshold echoes — recursion events — and you keep walking into them and coming back stronger.' },
    { s: 'narr', t: 'She sets a folder on the table. Your name is on it. It is very thick.' },
    { s: 'seris', t: 'I was sent to observe the anomaly. Contain it, if warranted. Dismantle it, if necessary. (she looks at you for a long moment) I have read every page of this file, and I will tell you what I told the Archon: the numbers are impossible. So I am here to be wrong in person.' },
    { s: 'shiro', t: 'She means she requested the assignment.' },
    { s: 'seris', t: 'I— that is a gross simplification of a routine deployment preference.' },
    { s: 'shiro', t: 'Ranked first of three preferences. Submitted twice.' },
    { s: 'narr', t: 'Seris Val, the College\'s most trusted instrument, briefly closes her eyes like a woman recalculating her exit routes.' },
    { choice: [
      { t: 'Offer her the field position: observe from inside the party.', flag: 'recruit_seris_accept',
        r: [
          { s: 'seris', t: '...Embedded observation. Yes. That is methodologically sound. Closer data. Purely professional proximity to the anomaly.' },
          { s: 'narr', t: 'She signs the ledger with a College seal and a personal signature. The personal one takes longer.' },
          { s: 'seris', t: 'To be clear: I am watching you. Every gate. Every impossible level. Someone must keep honest records of what you are becoming. (quieter) ...It may as well be someone who hopes the records stay good.' },
        ] },
      { t: '"Observe from the bar like everyone else."',
        r: [
          { s: 'seris', t: 'Noted. Refused embedded placement, subject displays "caution or possibly taste" — I\'m writing it down exactly like that. I will be at the corner table. Do try to stay anomalous.' },
        ] },
    ] },
  ],
};

// ------------------------------------------------------------
// PAIR BONDS — the girls, with each other, once they trust you
// enough to be fully themselves in front of you.
// ------------------------------------------------------------

E.pair_sakura_shiro = {
  id: 'pair_sakura_shiro', where: 'camp', once: true, priority: 42,
  cond: S => (S.bond.sakura || 0) >= 4 && (S.bond.shiro || 0) >= 4,
  steps: [
    { s: 'narr', t: 'Firelight. Sakura is reading a novel behind her hat brim. Shiro is reading Sakura\'s novel over her shoulder, one full second per page ahead of her.' },
    { s: 'shiro', t: 'The knight is the traitor.' },
    { s: 'sakura', t: 'SHIRO.' },
    { s: 'shiro', t: 'You read the same arc in volume two of the last one. I am saving you time. Time is money.' },
    { s: 'sakura', t: '(clutching the book) Being *surprised* is the money! That\'s what the money *is*!' },
    { s: 'narr', t: 'A pause. Shiro considers this like a genuinely new market theory.' },
    { s: 'shiro', t: '...Then I will only tell you the endings you would not have enjoyed. A curated loss-prevention service.' },
    { s: 'sakura', t: 'That\'s— hm. That\'s almost sweet? In a horrible way?' },
    { s: 'narr', t: 'Sakura leans back against Shiro\'s shoulder to keep reading. Shiro, who charges for everything, does not charge for this.' },
    { s: 'shiro', t: '(to you, without turning) You saw nothing. The rate for having seen this is your silence.' },
  ],
};

E.pair_erin_sakura = {
  id: 'pair_erin_sakura', where: 'camp', once: true, priority: 42,
  cond: S => (S.bond.erin || 0) >= 4 && (S.bond.sakura || 0) >= 4,
  steps: [
    { s: 'narr', t: 'Past midnight. You wake to soft, ferocious counting: Erin is teaching Sakura to throw a punch, both of them whispering so as not to wake you.' },
    { s: 'erin', t: 'Again. Thumb outside the fist, unless you hate your thumb.' },
    { s: 'sakura', t: '(whisper-shouting) Why would I ever punch anything?! I have a STAFF! I have the sky!' },
    { s: 'erin', t: 'Because someday something will get past me. Just once. Just one thing, one time. And when it does, it\'s going to be *so confident* — and you\'re going to break its nose.' },
    { s: 'narr', t: 'Sakura looks at her fist. Then at Erin, who has never once let anything get past her, planning anyway for the day she fails.' },
    { s: 'sakura', t: '...Show me again. Slower.' },
    { s: 'erin', t: 'Atta girl. Nose height. Mean it.' },
    { s: 'narr', t: 'You keep your breathing even and your eyes mostly shut. Some lessons are between sisters.' },
  ],
};

E.pair_erin_shiro = {
  id: 'pair_erin_shiro', where: 'camp', once: true, priority: 42,
  cond: S => (S.bond.erin || 0) >= 6 && (S.bond.shiro || 0) >= 6,
  steps: [
    { s: 'narr', t: 'Erin and Shiro are playing chess with a traveling set. Erin is losing with tremendous morale.' },
    { s: 'erin', t: 'Knight takes... whatever that is. The pointy one.' },
    { s: 'shiro', t: 'That is your own bishop.' },
    { s: 'erin', t: 'He was in the way.' },
    { s: 'narr', t: 'Shiro pinches the bridge of her nose. Then, methodically, she resets the board — not to punish the move, you realize, but because she has decided to actually teach.' },
    { s: 'shiro', t: 'Again. And this time I will explain what the pointy ones are for. You protect eight squares at all times without thinking. There is no reason you should be bad at this. It offends me.' },
    { s: 'erin', t: '(grinning, rolling up her sleeves) That\'s the nicest thing you\'ve ever said to me.' },
    { s: 'shiro', t: 'It was a complaint.' },
    { s: 'erin', t: 'It was NOT and you know it.' },
    { s: 'narr', t: 'They play until the fire burns low. Shiro wins every game and, for some reason, looks like she hasn\'t lost an evening in weeks.' },
  ],
};

// ------------------------------------------------------------
// EPILOGUE SLICES — married life, in small domestic pieces.
// ------------------------------------------------------------

E.epilogue_kitchen = {
  id: 'epilogue_kitchen', where: 'guild', once: true, priority: 40,
  cond: S => !!S.seen.wedding,
  steps: [
    { s: 'narr', t: 'Morning, after. The guild found you a house — insisted, actually; Hale called it "strategic hero retention." It has a kitchen. The kitchen is currently a diplomatic incident.' },
    { s: 'erin', t: 'All I\'m saying is that breakfast is a *shield* meal. It holds the line for the whole day. You don\'t skimp on the line.' },
    { s: 'shiro', t: 'You have made eleven eggs.' },
    { s: 'erin', t: 'And I stand by every one of them.' },
    { s: 'sakura', t: '(arranging flowers in a jar that was, until recently, a potion bottle) I think it\'s nice. The table\'s never had this many plates on it.' },
    { s: 'narr', t: 'You stand in the doorway of your own improbable life: steam, argument, flowers, eleven eggs. The System, which has measured everything you have ever done, offers no number for this. It pings once, softly, like it wishes it could.' },
    { s: 'sys', t: '[ No quest active. Recommendation: remain exactly here. ]' },
  ],
};

E.epilogue_market = {
  id: 'epilogue_market', where: 'guild', once: true, priority: 40,
  cond: S => !!S.seen.epilogue_kitchen,
  steps: [
    { s: 'narr', t: 'Market day. You — slayer of the Monarch, the Fourth Blade, terror of the recursion depths — are carrying the basket.' },
    { s: 'narr', t: 'It is a very full basket. Vendors keep adding things to it "for the household, no charge," and Shiro keeps making them take payment, and the vendors keep rounding down, and Shiro keeps catching them.' },
    { s: 'shiro', t: '(pained) This town\'s entire produce sector runs at a sentimental loss. Someone has to hold the line on arithmetic.' },
    { s: 'narr', t: 'A little girl in a paper knight\'s helmet charges your leg, declares the gate cleared, and is carried off sideways by an apologetic parent.' },
    { s: 'erin', t: '(misty) She had the stance and everything. Did you see the stance?' },
    { s: 'narr', t: 'The gates still open. The board still fills. But this — the basket, the arithmetic, the stance — is what all of it was for.' },
  ],
};

E.epilogue_anniversary = {
  id: 'epilogue_anniversary', where: 'guild', once: true, priority: 40,
  cond: S => !!S.seen.epilogue_market && (S.ngPlus || 0) >= 2,
  steps: [
    { s: 'narr', t: 'The guild marks the anniversary of the Threshold quietly: no speeches, one bell, and Hale buying a round with the expression of a man who has budgeted for it all year.' },
    { s: 'guild', t: 'A toast. To the ones who walked in. (he raises his cup) And — leave it to the Fourth\'s table — to the ones who walked *back out*, every single time, and made my paperwork boring again.' },
    { s: 'narr', t: 'Around your table: every chair full. Some of the names in this family didn\'t exist in your life a year ago. Some of them didn\'t exist at all.' },
    { s: 'narr', t: 'Later, walking home under the gate-light, someone\'s hand finds yours — you don\'t even have to look to know whose. That\'s the strange arithmetic of it: the System counted everything, and the total came out to *this*.' },
    { s: 'sys', t: '[ Anniversary logged. Growth rate: sustained. The System is... proud. That is the word. Proud. ]' },
  ],
};

// ------------------------------------------------------------
// YUKI RIVAL ARC — his party, out there, gaining on you.
// Runs on the paths where he built his own life (not a member).
// ------------------------------------------------------------

E.rival_yuki_1 = {
  id: 'rival_yuki_1', where: 'guild', once: true, priority: 44,
  cond: S => S.flags.betrothal_ended && !S.flags.yuki_member && S.rankIdx >= 4,
  steps: [
    { s: 'crier', t: 'Board update! C-gate at the mill road — cleared overnight. Party of four out of the eastern hall. "Dawnbreak," they\'re calling themselves.' },
    { s: 'narr', t: 'The clear time is posted. It\'s good. Not your good — but good in a way that has clearly been *drilled*, hour by stubborn hour.' },
    { s: 'erin', t: 'Dawnbreak. That\'s Yuki\'s lot, isn\'t it? The name\'s exactly his flavor of earnest.' },
    { s: 'shiro', t: 'Lead: Y. Beaumont, B-rank. Healer, two strikers, himself at the wall. (a pause) He built it in his own image. Slow, safe, and un-discourageable.' },
    { s: 'sakura', t: 'He put himself at the *wall*? He used to flinch at training dummies...' },
    { s: 'narr', t: 'Nobody says the obvious thing: that the boy who begged you all to wait for him has stopped waiting to be waited for.' },
  ],
};

E.rival_yuki_2 = {
  id: 'rival_yuki_2', where: 'guild', once: true, priority: 44,
  cond: S => S.seen.rival_yuki_1 && !S.flags.yuki_member && S.cleared,
  steps: [
    { s: 'narr', t: 'There\'s a new sheet pinned beside the assignment board: DAWNBREAK vs THE FOURTH\'S — CLEAR TIMES, updated in Yuki\'s handwriting, which means he rode two days just to pin it.' },
    { s: 'guild', t: 'He asked permission first. Filled out a form. There is no form for this — he *made* one.' },
    { s: 'narr', t: 'Your times are faster. All of them. Under the last column he\'s written, small: "For now. — Y.B."' },
    { s: 'erin', t: '(laughing, one fist on the board) Oh, it\'s ON. It is SO on.' },
    { s: 'shiro', t: 'His B-gate average has improved eleven percent since spring. At current trajectory he reaches our old benchmarks in— (she stops; recalculates; frowns at the result like it has misbehaved) ...sooner than I said last time.' },
    { s: 'sakura', t: '(softly, tracing the "for now") He\'s really out there. Being whole. We didn\'t break him after all.' },
  ],
};

E.rival_yuki_3 = {
  id: 'rival_yuki_3', where: 'guild', once: true, priority: 44,
  cond: S => S.seen.rival_yuki_2 && !S.flags.yuki_member && (S.ngPlus || 0) >= 1,
  steps: [
    { s: 'narr', t: 'A recursion echo split twin-mouthed over the eastern ridge this morning — two gates, one mana signature. The guild\'s solution is already at your table, drinking Erin\'s tea: Dawnbreak, and at its head, Yuki Beaumont, A-rank as of Tuesday.' },
    { s: 'yuki', t: 'East mouth\'s ours, west mouth\'s yours. First party to the core chamber buys the other one dinner. (he grins — steady, easy, a man wearing his own life like it finally fits) That\'s the whole negotiation. I\'ve gotten better at those.' },
    { s: 'erin', t: 'Deal. Hope your party likes expensive food, Beaumont, because I am ordering the entire left side of the menu.' },
    { s: 'yuki', t: 'You\'ll be ordering it as our guest. (to you, quieter, offering his hand) Whatever we are now — rivals, friends, family that took the long road — thank you for not waiting for me. It\'s the kindest thing any of you ever did.' },
    { s: 'narr', t: 'You shake his hand: sword-calloused now, and certain. By nightfall both mouths of the echo stand closed, and the guild hall hosts two parties\' worth of noise — and Hale, quietly, pins the clear times side by side. Four seconds apart.' },
    { give: { gold: 400 } },
    { s: 'guild', t: 'Four seconds! FOUR! I\'m framing this sheet. Drinks are on the guild — the finder\'s bounty for a twin echo, split fair, comes to a tidy sum besides.' },
  ],
};

// ------------------------------------------------------------
// NEW-TABLE CAMP SCENE — once the recruits start stacking up.
// ------------------------------------------------------------

E.camp_new_table = {
  id: 'camp_new_table', where: 'camp', once: true, priority: 41,
  cond: S => (S.recruited || []).length >= 2 && S.recruited.includes('mira'),
  steps: [
    { s: 'narr', t: 'The camp is bigger now. More bedrolls, more voices, a cookfire that has to be argued over in shifts. The new members orbit the old rhythms, learning them.' },
    { s: 'mira', t: '(if you\'d told me a year ago I\'d be taking night-watch orders from a kid with an invisible friend, I\'d have priced the job triple) ...Second watch is mine, then. Anyone snores, that\'s a contract violation.' },
    { s: 'narr', t: 'It\'s a strange, patchwork thing you\'ve built — veterans and newcomers, people and almost-people, all of it stitched together by nothing more binding than the fact that everyone here would go back into the dark for everyone else.' },
    { s: 'sakura', t: '(beside you, watching the fire, quiet and sure) The party got bigger. The family got bigger. I used to think those were different sizes... they\'re not, are they?' },
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
  // The harem route, once openly formed, is its own finale.
  if (S.flags && S.flags.harem_formed) return EVENTS.ending_harem;
  const cands = ['sakura', 'erin', 'shiro'];
  if (S.flags && S.flags.yuki_member) cands.push('yuki');
  const top = Math.max(...cands.map(k => b[k] || 0));
  if (top < 5) return EVENTS.ending_party;
  const leaders = cands.filter(k => (b[k] || 0) === top);
  if (leaders.length > 1) return EVENTS.ending_party;
  return EVENTS['ending_' + leaders[0]];
}

// Which wedding to play: the harem, or the single maxed romance.
export function weddingFor(S) {
  if (S.flags && S.flags.harem_formed) return EVENTS.wedding_harem;
  const b = S.bond;
  const cands = ['sakura', 'erin', 'shiro'];
  if (S.flags && S.flags.yuki_member) cands.push('yuki');
  const top = Math.max(...cands.map(k => b[k] || 0));
  const leaders = cands.filter(k => (b[k] || 0) === top && top >= 10);
  return leaders.length === 1 ? EVENTS['wedding_' + leaders[0]] : EVENTS.wedding_harem;
}
