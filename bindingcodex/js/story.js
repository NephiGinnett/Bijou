// ============================================================
// BINDING CODEX — story & dialogue
// Step format:
//   { s:'vesper', t:'line' }                       spoken line
//   { s:'narr', t:'...' }                          narration
//   { s:'codex', t:'...' }                         the Codex writes
//   { choice:[{ t, bond:{who:+n}, tone, flag, reopen, r:[steps] }] }
//   { flag:'id' }  { give:{gold,item} }  { join:'id' }  { chronicle:'text' }
//   { brand:true }  → Rue's debt brand flares (UI flash) on this line
//   spice:'gentle'|'steamy'|'unbound'  intimacy tier (only matching tier shows)
//   gore:'gentle'|'grim'               violence tier (only matching tier shows)
//   cond:S=>bool                        line-level condition
// Tokens: {name} {they} {them} {their} {theirs} {themself} {They} {Their}
//         {s} (verb suffix) {is} {has} {was}   — the warlock's pronouns
//         {captive} {ally}                     — Undercroft scenes
// Events: { id, where:'auto'|'guild'|'camp'|'rumor'|'cell', once, cond(S), priority, steps }
// Romance rule: any event containing a spice line MUST use free(...) for
// its cond, so it can only fire while the character is a free ally.
// ============================================================

export const SPEAKERS = {
  narr:    { name: '',              color: '#a89cb8' },
  codex:   { name: 'THE CODEX',     color: '#c86cff' },
  sys:     { name: 'THE CODEX',     color: '#c86cff' },
  player:  { name: '{name}',        color: '#e8d8c8' },
  vesper:  { name: 'Vesper',        color: '#b8a8e8' },
  rue:     { name: 'Rue',           color: '#ff8a4a' },
  isolde:  { name: 'Isolde',        color: '#c8ccd8' },
  calla:   { name: 'Calla',         color: '#e8a87a' },
  envoy:   { name: 'Coven Envoy',   color: '#e8a87a' },
  cinder:  { name: 'Mother Cinder', color: '#ff7a4a' },
  aldric:  { name: 'Lord-Commander Aldric', color: '#d8d0b0' },
  cultist: { name: 'Very Stupid Cultist', color: '#9a8f7a' },
  goat:    { name: 'Goat',          color: '#c8b89a' },
  trapper: { name: 'Coven Trapper', color: '#c87a5a' },
  rider:   { name: 'Vigil Rider',   color: '#c8c8e0' },
  crow:    { name: 'Crow',          color: '#6a6a7a' },
  captive: { name: '{captive}',     color: '#d89a7a' },
  ally:    { name: '{ally}',        color: '#e8c8a8' },
  erin:    { name: 'Erin',          color: '#7db4ff' },
  sakura:  { name: 'Sakura',        color: '#ff9ec6' },
  shiro:   { name: 'Shiro',         color: '#e6e6fa' },
  yuki:    { name: 'Yuki',          color: '#a8d8b0' },
  mira:    { name: 'Mira',          color: '#c86a4a' },
  nessa:   { name: 'Nessa',         color: '#8fce7a' },
  vex:     { name: 'Vex',           color: '#b08cff' },
  seris:   { name: 'Seris',         color: '#8a6ad8' },
};

const E = {};
export const EVENTS = E;

// cond helper: event may only fire while every named character is a free
// ally. Tagged so the load-time intimacy check can verify it.
export function free(...ids) {
  const extra = typeof ids[ids.length - 1] === 'function' ? ids.pop() : null;
  const fn = S => ids.every(id => (S.allies || []).includes(id)) && (!extra || extra(S));
  fn.__allies = ids;
  return fn;
}
const has = (S, id) => (S.allies || []).includes(id);
const b = (S, id) => (S.bond && S.bond[id]) || 0;
const cap = (S, named) => (S.captives || []).find(c => c.named === named);

// ------------------------------------------------------------
// OPENING — Vesper: The Drowned Stacks
// ------------------------------------------------------------

E.intro = {
  id: 'intro', where: 'auto', once: true, priority: 100,
  steps: [
    { s: 'narr', t: 'The mark on your wrist is three days old and it has not once gone cold.' },
    { s: 'narr', t: 'It led you through the dead city by its own heat — down a collapsed stair, past a fountain choked with black water, to a door that opened before you touched it.' },
    { s: 'narr', t: 'Beyond: a library, drowned. Shelves rise out of still water like ribs. Ink bleeds slowly down the spines of ten thousand books, and the drip of it is the only sound.' },
    { s: 'narr', t: 'You follow the trail of bleeding ink between the stacks. As you pass, every candle in the archive bends toward you — flames leaning sideways, all at once, as if something just walked into a room they had been waiting in for a long time.' },
    { s: 'narr', t: 'At the end of the trail, on a reading table above the waterline, a woman sits cross-legged with three tarot cards laid face-down in front of her. Ink-black hair pinned with a quill. Ink on every fingertip. She does not look up.' },
    { s: 'vesper', t: 'You\'re late.' },
    { s: 'vesper', t: 'I\'ve drawn The Tower three nights running. Either you\'re about to break something important, or someone\'s about to break you.' },
    { s: 'narr', t: 'She finally lifts her eyes — smoky grey, unimpressed, and very, very interested.' },
    { choice: [
      { t: '"Neither. I\'m here for the Codex."', tone: 'dom', bond: { vesper: 1 }, r: [
        { s: 'vesper', t: 'Straight to it. No "hello," no "where am I." (a slow smile) Good. I\'ve had three hundred years of people asking permission. It\'s tedious.' },
      ] },
      { t: '"Who are you?"', tone: 'kind', r: [
        { s: 'vesper', t: 'Vesper Morrow. Keeper of the Codex, last of a very short line. I catalogue other people\'s power.' },
        { s: 'vesper', t: '(she glances at your wrist) Never claimed any of my own. Yet.' },
      ] },
      { t: 'Say nothing. Wait for her to explain.', tone: 'dom', r: [
        { s: 'narr', t: 'You let the silence sit. Vesper holds it for a long breath — and then she breaks first, and seems almost pleased to.' },
        { s: 'vesper', t: 'Oh, you\'re one of those. You don\'t explain yourself. (she taps the table) The Codex is going to love you.' },
      ] },
    ] },
    { s: 'narr', t: 'She flips the first card without looking. The Moon.' },
    { s: 'vesper', t: 'Something in this city is lying to you.' },
    { s: 'narr', t: 'The second. The Lovers. She covers it with her palm a beat too fast and clears her throat.' },
    { s: 'vesper', t: 'That one\'s... irrelevant.' },
    { s: 'narr', t: 'Her fingers hover over the third card. It does not turn. Something faint and violet has begun to glow on the inside of her wrist.' },
    { s: 'vesper', t: 'I haven\'t dared turn this one yet. I thought you should be here when I do.' },
    { s: 'narr', t: 'A crow drops onto the shelf above her with a wet flap and a letter in its beak. Black wax. A crest pressed into it: a hand, burning.' },
    { s: 'vesper', t: '(very quietly) ...Ah. That\'s why it\'s been warm since dusk.' },
    { s: 'vesper', t: 'The Ashen Coven. They want the Codex back. They\'ve sent an envoy — she\'s already in the lower stacks.' },
    { s: 'narr', t: 'Vesper slides off the table, tucks the unturned card into her coat, and holds out an ink-stained hand — not to be helped up. To be followed.' },
    { s: 'vesper', t: 'Come on, storm. Let\'s see what you do.' },
    { flag: 'vesper_met' },
    { chronicle: 'The night you entered the Codex, every candle bent toward your mark.' },
  ],
};

E.envoy_brief = {
  id: 'envoy_brief', where: 'auto', once: true, priority: 99,
  steps: [
    { s: 'narr', t: 'The lower stacks are deeper underwater. Somewhere ahead, a woman in ash-grey robes is pulling books off the shelves and dropping them into the black water, one at a time, as if counting.' },
    { s: 'vesper', t: 'Listen. Quickly. Everything in here has two things you can break: its body, and its Will.' },
    { s: 'vesper', t: 'I can see Will. It\'s a gift, of sorts — the Keeper\'s Eye. When you fight, watch the violet bar under their health. Hurt them, hex them, hold them down, and it drains.' },
    { s: 'vesper', t: 'When it\'s low enough — and only then — you seal them. A Binding Seal. Your mark knows how, even if you don\'t yet.' },
    { s: 'vesper', t: 'Sealed, they come back with us. Dead, they don\'t. (a pause) I\'d like to ask that envoy some questions.' },
    { s: 'codex', t: '[ The Codex turns a page on its own. It is blank, and then it isn\'t: SHE WILL SEAL THE ENVOY. ]' },
    { s: 'vesper', t: '...It does that. Ignore it. Or don\'t. It\'s usually right.' },
  ],
};

E.vesper_pact = {
  id: 'vesper_pact', where: 'auto', once: false, priority: 98,
  cond: S => !S.flags.vesper_joined || S.flags.vesper_tenant_retry,
  steps: [
    { s: 'narr', cond: S => !S.flags.vesper_tenant_retry, t: 'Back above the waterline. The envoy\'s sealed form hangs in the air between you like a held breath, then sinks — through the floor, down, into somewhere below the library you hadn\'t known was there.' },
    { s: 'vesper', cond: S => !S.flags.vesper_tenant_retry, t: 'The Undercroft. Old cells. The Keepers before me used them for... difficult guests. (she watches you) Most people would ask what happens to her now.' },
    { s: 'vesper', cond: S => !!S.flags.vesper_tenant_retry, t: '(she doesn\'t look up from the ledger) You\'re back at my table. Again. People will talk.' },
    { s: 'vesper', t: 'Here\'s my offer. The Codex writes about you whether I like it or not. Let me keep the Chronicle. Let me read the cards for you. Let me advise.' },
    { s: 'narr', t: 'She turns her left wrist up. The violet sigil there is unfinished — an open circle waiting for its last stroke.' },
    { s: 'vesper', t: 'And if you\'re what the Tower says you are... close this. Your hand. It\'s called the Binding. It deepens with trust.' },
    { choice: [
      { t: 'Take her wrist and close the sigil. "Partners, then."', tone: 'kind', bond: { vesper: 2 }, flag: 'vesper_partner', r: [
        { s: 'narr', t: 'You draw the last stroke with your thumb. The sigil flares and settles, warm as a pulse.' },
        { s: 'vesper', t: '(a breath she clearly didn\'t mean to let out) ...Partners. Yes. Fine. Good.' },
        { s: 'vesper', t: 'Don\'t look at me like that. I\'ve read about people saying that word. I\'ve never had it said at me.' },
        { chronicle: 'Vesper\'s sigil was closed by your hand. She called it partnership and looked away.' },
      ] },
      { t: '"The Codex is mine. You\'ll keep it for me."', tone: 'dom', bond: { vesper: 2 }, flag: 'vesper_claimed', r: [
        { s: 'narr', t: 'You take her wrist without asking and close the sigil in one stroke. She goes very still.' },
        { s: 'vesper', t: '(softly, eyes on your hand) Three hundred years, and nobody has ever once told me what to do with it.' },
        { s: 'vesper', t: '(she recovers, barely) Yours, then. I\'ll keep it for you. I keep things very, very well.' },
        { chronicle: 'You claimed the Codex outright. Vesper did not argue. She did not want to.' },
      ] },
      { t: '"I don\'t need an advisor."', tone: 'reject', flag: 'vesper_tenant', reopen: true, r: [
        { s: 'vesper', t: '(a dry little laugh) Of course you don\'t.' },
        { s: 'vesper', t: 'Well, I live here. I\'ve lived here for three centuries. You\'ll have to work around me, I\'m afraid. (she reopens her ledger) Your tenant, then. Reluctant. Charming. Available.' },
        { s: 'narr', t: 'The sigil on her wrist stays open. She doesn\'t mention it again. She doesn\'t have to.' },
      ] },
    ] },
    { join: 'vesper' },
    { flag: 'vesper_joined' },
  ],
};

// Rejected her offer? She's still here, and the question can come back.
E.vesper_pact_retry = {
  id: 'vesper_pact_retry', where: 'guild', once: true, priority: 60,
  cond: S => !!S.flags.vesper_tenant && !S.flags.vesper_partner && !S.flags.vesper_claimed && S.day >= 3,
  steps: [
    { s: 'narr', t: 'Vesper has left the Chronicle open on your chair. Yesterday\'s page reads, in a hand neither of you recognizes: SHE CAME BACK TO THE TABLE.' },
    { flag: 'vesper_tenant_retry' },
    { s: 'vesper', t: 'It wrote that this morning. Before you arrived. (she taps the open circle on her wrist) The offer stands, if you want it.' },
    { choice: [
      { t: 'Close the sigil.', tone: 'kind', bond: { vesper: 2 }, flag: 'vesper_partner', r: [
        { s: 'narr', t: 'The last stroke, finally. The sigil flares warm.' },
        { s: 'vesper', t: '...Took you long enough. (she is smiling, and furious about it)' },
      ] },
      { t: '"Not yet."', tone: 'reject', reopen: true, r: [
        { s: 'vesper', t: 'Mm. "Yet." I\'ll write that down.' },
      ] },
    ] },
  ],
};

E.undercroft_open = {
  id: 'undercroft_open', where: 'auto', autoCond: true, once: true, priority: 90,
  cond: S => !!cap(S, 'envoy') && !!S.flags.vesper_joined,
  steps: [
    { s: 'narr', t: 'Vesper takes a candle down a spiral stair you could swear wasn\'t there yesterday. The air gets colder, then drier, then old.' },
    { s: 'narr', t: 'The Undercroft: a long vault of iron-barred cells beneath the library, every lock rusted shut except one. Inside it, chained by a sigil you recognize as your own, the envoy kneels on the stone.' },
    { s: 'narr', t: 'Up close she is younger than her robes suggest. There is a brand on the side of her throat — a burning hand, the Coven\'s crest — and it is not a scar. It is moving. Slowly. Like a coal breathing.' },
    { s: 'vesper', t: 'That\'s the Ashen brand. It\'s not a mark of loyalty — it is loyalty. It grows into them. Feeds on doubt.' },
    { s: 'vesper', t: 'It can be burned out. Slowly. The old word for it is Reclamation. Someone has to sit with her. Talk to her. Wear the brand down a day at a time.' },
    { s: 'envoy', t: '(through her teeth) I\'d rather rot.' },
    { s: 'vesper', t: '(pleasantly) Most of them say that.' },
    { s: 'narr', t: 'You can assign a warden to each cell from the Undercroft. Without one, the brand creeps back. And once a day, you can go down yourself.' },
    { s: 'vesper', t: 'Her name is Calla, by the way. I know because I sat two desks in front of her, a long time ago, under a teacher I don\'t talk about.' },
    { chronicle: 'The Undercroft opened beneath the library. Its first guest was Calla, envoy of the Ashen Coven.' },
  ],
};

E.ngplus_wake = {
  id: 'ngplus_wake', where: 'auto', once: false,
  steps: [
    { s: 'narr', t: 'You wake with the mark three days old again, the dead city cold around you — and every page of the Codex you ever turned still warm in your memory.' },
    { s: 'codex', t: '[ ANOTHER CYCLE. The Codex remembers what you brewed, what you wore, what you mastered. It does not remember who loved you. You will have to earn that again. ]' },
  ],
};

// ------------------------------------------------------------
// INSCRIPTIONS — the Codex writes your new Circle
// ------------------------------------------------------------

const inscribe = (circle, title, lines) => ({
  id: 'inscribe_' + circle, where: 'auto', once: true, priority: 80,
  steps: [
    { s: 'narr', t: 'The Codex opens itself on the reading table. A new page. The ink comes up from inside the paper like a bruise surfacing.' },
    { s: 'codex', t: `[ ${title} ]` },
    ...lines,
    { chronicle: `Inscribed into the ${circle} Circle: ${title.replace(/^.*— /, '')}.` },
  ],
});

E.inscribe_Ember = inscribe('Ember', 'THE EMBER CIRCLE — the one who walks into fire on purpose', [
  { s: 'vesper', t: 'The Ember Circle. It took the last Keeper\'s favorite warlock eleven years to be written there.' },
  { s: 'vesper', t: '(she reads the line twice) "On purpose." It\'s editorializing now. That\'s new.' },
  { s: 'narr', t: 'Word spreads in the dead city the way it always does — by crow. By morning, people have begun arriving at the drowned stair, asking for work with the warlock who seals the Coven.' },
  { s: 'narr', t: 'Behind the reading room, a slab of black stone you\'d taken for a table has begun to sweat ink. Vesper calls it the pact altar. She does not call it safe.' },
  { flag: 'altar_open' },
]);
E.inscribe_Hex = inscribe('Hex', 'THE HEX CIRCLE — the storm that learned to speak', [
  { s: 'vesper', t: 'Hex. The circle where people stop being dangerous by accident.' },
  { s: 'rue', cond: S => has(S, 'rue'), t: 'Ooh, Hex Circle! Do we get a cake? We should get a cake. I\'ll steal a cake.', brand: false },
  { s: 'isolde', cond: S => has(S, 'isolde'), t: 'The Vigil hunted Hex-Circle warlocks with whole companies. (a pause) They will send more.' },
]);
E.inscribe_Thorn = inscribe('Thorn', 'THE THORN CIRCLE — what grows around the wound', [
  { s: 'vesper', t: 'Thorn. The Codex only uses botanical metaphors when it\'s worried about you. Or proud. I can never tell which.' },
]);
E.inscribe_Crown = inscribe('Crown', 'THE CROWN CIRCLE — sovereign of a drowned city', [
  { s: 'narr', t: 'The candles do not lean toward you anymore. They bow.' },
  { s: 'vesper', t: '(quietly) The Crown Circle. There are four names on that page in the entire history of the Codex. Three of them ended badly.' },
  { s: 'vesper', t: 'I\'m not worried. I\'m just... noting it. In the margin. Several times.' },
]);
E.inscribe_Abyss = inscribe('Abyss', 'THE ABYSS CIRCLE — there is nothing beneath her now but the Heart', [
  { s: 'narr', t: 'The page bleeds through. Then the page beneath it. Then the table. When Vesper finally lifts the book, the ink has burned a map into the wood: a path down, and down, to the Ashen Coven\'s heart.' },
  { s: 'vesper', t: 'Mother Cinder. She\'s waiting. She\'s been waiting since I left her.' },
  { s: 'vesper', t: 'The final rift is on the board now. When you\'re ready — and not one minute before — we go.' },
]);

E.corruption_50 = {
  id: 'corruption_50', where: 'auto', once: true, priority: 85,
  steps: [
    { s: 'narr', t: 'You wake with a word in your mouth you don\'t remember learning. When you speak it, the candle beside your bed goes out — not blown out. Eaten.' },
    { s: 'codex', t: '[ SLOT VI UNSEALED. Forbidden rites written into the warlock\'s grimoire: Name-Eater. Cinder Unmaking. ]' },
    { s: 'vesper', t: '(watching the smoke) The sixth slot. Most warlocks never open it. The ones who do don\'t usually close it again.' },
    { s: 'vesper', cond: S => b(S, 'vesper') >= 6, t: 'I\'m not telling you to stop. I\'m telling you I\'m keeping count. Someone should.' },
  ],
};
E.corruption_80 = {
  id: 'corruption_80', where: 'auto', once: true, priority: 85,
  steps: [
    { s: 'narr', t: 'The Undercroft goes silent when you walk down the stair now. Not quiet. Silent. The captives stop breathing when your shadow crosses their bars.' },
    { s: 'vesper', t: 'They\'re afraid of you. Properly afraid. It\'ll make them break faster, and like you less.' },
    { s: 'rue', cond: S => has(S, 'rue'), t: '(uncharacteristically small) ...You smell like the Ninth Ember. Like home. I don\'t know if I like that.', brand: true },
    { s: 'isolde', cond: S => has(S, 'isolde'), t: 'I knelt to a storm. (she looks at you for a long moment) I would kneel again. But I will say it once: this is how the Vigil\'s stories about warlocks begin.' },
  ],
};

// ------------------------------------------------------------
// THE UNDERCROFT — Calla, the envoy (fully written captive)
// Undercroft scenes are grim, never sexual, and never carry spice.
// where:'cell' events play when you visit the named captive.
// ------------------------------------------------------------

E.cell_calla_intro = {
  id: 'cell_calla_intro', where: 'cell', captive: 'envoy', once: true, priority: 50,
  steps: [
    { s: 'narr', t: 'Calla has pressed herself into the corner of the cell where the candlelight doesn\'t reach. The brand on her throat glows faintly when she sees you — like it recognizes an enemy before she does.' },
    { s: 'calla', t: 'Come to gloat, warlock? Go on. Mother Cinder says your kind always talk too much before the end.' },
    { choice: [
      { t: 'Say nothing. Sit down outside the bars.', tone: 'kind', r: [
        { s: 'narr', t: 'You sit on the cold floor and say nothing at all. It takes her a very long time to stop waiting for you to.' },
        { s: 'calla', t: '(eventually, hoarse) ...That\'s worse. You know that\'s worse.' },
      ] },
      { t: '"Your Mother sent you here to die. I didn\'t."', tone: 'dom', r: [
        { s: 'narr', t: 'The brand flares hot. Calla flinches from her own throat.' },
        { s: 'calla', t: 'That\'s not — we draw lots. It\'s an honor to be chosen.' },
        { s: 'narr', t: 'She doesn\'t sound like she believes it. The brand pulses, as if it has noticed that too.' },
      ] },
    ] },
  ],
};

E.cell_calla_mid = {
  id: 'cell_calla_mid', where: 'cell', captive: 'envoy', once: true, priority: 49,
  cond: S => { const c = cap(S, 'envoy'); return !!c && c.brand <= 55; },
  steps: [
    { s: 'narr', t: 'The brand on Calla\'s throat has shrunk to the size of a coin. She keeps touching the place where it used to reach — like a tongue finding a missing tooth.' },
    { s: 'calla', t: 'I dreamed about my sister last night. First time in a year. The brand used to... eat those.' },
    { s: 'calla', t: '(not looking at you) She drew the short straw. For this. For you. I swapped with her before the lots were read. Nobody knows that. Not even Mother.' },
    { s: 'calla', t: '...Why did I just tell you that.' },
    { choice: [
      { t: '"Because it\'s yours to tell now."', tone: 'kind', r: [
        { s: 'narr', t: 'Calla laughs once, wet and surprised, and then puts her face in her hands and doesn\'t say anything else for the rest of the visit. You stay anyway.' },
      ] },
      { t: '"Because you\'re mine to tell it to."', tone: 'dom', r: [
        { s: 'narr', t: 'She looks up sharply. The brand doesn\'t flare. That, more than anything, seems to frighten her.' },
        { s: 'calla', t: '...Don\'t say things like that while I still have this on my neck.' },
      ] },
    ] },
    { chronicle: 'Calla told you why she drew the short straw.' },
  ],
};

// Release scenes. The UI sets S.flags.__release to 'join' | 'leave' | 'relapse'
// before playing, and the lines branch on it.
const rel = v => S => S.flags.__release === v;

E.release_calla = {
  id: 'release_calla', where: 'release', captive: 'envoy', once: true,
  steps: [
    { s: 'narr', t: 'The last ember of the brand goes out on a Tuesday, in the middle of an argument about soup. Calla stops mid-sentence and touches her throat. The skin there is smooth. Pale. Hers.' },
    { s: 'narr', t: 'You unlock the cell. The sigil-chains unspool from her wrists and fade into the stone.' },
    { s: 'calla', t: '(staring at the open door) ...You\'re just letting me go.' },
    { s: 'calla', cond: rel('join'), t: 'Where would I even — (she stops. She looks at you, and then up the stair, toward the library, the candles, Vesper\'s voice arguing with a crow.)' },
    { s: 'calla', cond: rel('join'), t: 'I want to stay. If that\'s... if you\'ll have me. I don\'t know how to be anything but sent somewhere. Let me be sent here.' },
    { s: 'narr', cond: rel('join'), t: 'She walks out of the cell on her own feet. At the top of the stair she stops, turns, and — awkwardly, like someone who has only ever seen it done — bows.' },
    { s: 'calla', cond: rel('leave'), t: 'I need to find my sister. Before Mother does. (she hesitates at the door) If I come back... it won\'t be with a brand. That\'s all I can promise.' },
    { s: 'narr', cond: rel('leave'), t: 'She climbs the stair and is gone into the dead city. Vesper watches the empty doorway for a long time.' },
    { s: 'calla', cond: rel('relapse'), t: '(very quietly) You paid for every inch of this. You never once asked what it cost me. (she touches her throat, where nothing glows — yet) Mother will take me back. Mother always takes us back.' },
    { s: 'narr', cond: rel('relapse'), t: 'She leaves. By morning there is a black-wax letter on the stair, unsigned. Inside is a single burnt match.' },
  ],
};

E.calla_first_night = {
  id: 'calla_first_night', where: 'camp', once: true, priority: 70,
  cond: free('calla'),
  steps: [
    { s: 'narr', t: 'Calla\'s first night out of the cells, and she can\'t sleep in a bed. Too soft. Too much ceiling. You find her on the library roof, wrapped in a borrowed coat in your colors, staring at the actual sky.' },
    { s: 'calla', t: 'It\'s so big. Mother kept us underground mostly. I forgot it went up this far.' },
    { s: 'narr', t: 'She shifts over on the slates to make room. An invitation she is trying very hard to make look like an accident.' },
    { choice: [
      { t: 'Sit beside her.', tone: 'kind', bond: { calla: 2 }, r: [
        { s: 'narr', t: 'You sit. Her shoulder finds yours by degrees, like she\'s testing whether the world will punish her for it. It doesn\'t.', spice: 'gentle' },
        { s: 'narr', t: 'You sit. She leans in by careful degrees until her head is on your shoulder and her cold fingers have found their way under your sleeve, tracing the warm edge of your mark like it\'s a hearth she\'s been allowed near. "Is this allowed?" she asks, barely a breath. You answer by turning your face into her hair. She shivers, and not from the cold.', spice: 'steamy' },
        { s: 'calla', t: '(very quietly) Is this... allowed? Sitting here. Leaning on you.' },
        { s: 'narr', t: '"It\'s allowed," you tell her. "Anything you want is allowed now, and anything you don\'t want, you can say no to. You don\'t owe me a thing for tonight. Not ever."' },
        { s: 'calla', t: '(a long breath that shakes a little) ...I know. That\'s why I\'m still up here. I\'m grateful, I am. But that isn\'t why I\'m sitting next to you. I\'m choosing this.' },
        { s: 'calla', t: '(eventually, mumbling) Thank you for not letting me rot.' },
      ] },
      { t: '"Come inside. You\'ll freeze." Offer her your hand.', tone: 'dom', bond: { calla: 1 }, r: [
        { s: 'narr', t: 'She takes it immediately — then looks at your joined hands like she isn\'t sure whose idea that was.' },
        { s: 'calla', t: 'You\'re very used to people doing what you say.' },
        { s: 'calla', t: '(a small, crooked smile — the first one) ...I think I might be very used to it too. Eventually.' },
      ] },
    ] },
    { chronicle: 'Calla\'s first night outside. She found the sky again.' },
  ],
};

// A few nights later, out in the world for a while: Calla asks, herself.
E.calla_choice = {
  id: 'calla_choice', where: 'camp', once: true, priority: 69,
  cond: free('calla', S => !!S.seen.calla_first_night && S.day - ((S.seenDay && S.seenDay.calla_first_night) ?? -99) >= 3 && b(S, 'calla') >= 6),
  tags: ['romance', 'her choice'],
  steps: [
    { s: 'narr', t: 'A few nights later, it\'s Calla who finds you on the roof. She sleeps in a bed now. She\'s had time to think about whose.' },
    { s: 'calla', t: 'I\'ve been out a while. I\'ve walked the city on my own, said no to things, said yes to things. (she sits beside you, close, on purpose this time) So I know this isn\'t thanks, and it isn\'t owing. I want you. Will you have me?' },
    { choice: [
      { t: '"Are you sure?"', tone: 'kind', bond: { calla: 1 }, r: [
        { s: 'calla', t: '(a steady laugh) I\'m sure. Ask me again in the morning and I\'ll still be sure.' },
        { s: 'narr', t: 'She kisses you first, slow and certain, and you stay on the roof under the whole enormous sky until it starts to go pale.', spice: 'gentle' },
        { s: 'narr', t: 'She kisses you first, slow and certain, and this time it\'s her hands that open your coat, her choice at every step, until the sky is the only witness and she isn\'t cold at all.', spice: 'steamy' },
        { s: 'narr', t: '', spice: 'unbound', stub: 'calla_choice' }, // ZOE: unbound
      ] },
      { t: '"Not yet. Stay with me under the sky."', tone: 'kind', reopen: true, r: [
        { s: 'calla', t: '(no hurt in it at all) Okay. Then I\'ll ask again. I like that I can.' },
      ] },
    ] },
    { chronicle: 'Calla chose you, under the sky she found again.' },
  ],
};

// Visit narration: the UI picks one line per approach. Grim variants
// only on the Grim gore setting. None of this carries spice.
export const VISIT_LINES = {
  interrogate: [
    { t: 'You ask the same question four different ways. On the fifth, {captive}\'s jaw tightens around the answer.' },
    { t: 'You lay out what you already know, piece by piece, and watch {captive} realize how much that is.' },
  ],
  intimidate: [
    { t: 'You let the mark on your wrist burn bright enough to light the whole cell. {captive} presses back against the wall and does not meet your eyes.', gore: 'gentle' },
    { t: 'You describe, calmly and in detail, what the Undercroft did to its last guest who wouldn\'t talk. {captive} goes grey.', gore: 'gentle' },
    { t: 'You close one hand and the sigil-chains tighten until {captive}\'s wrists split and bleed down the iron. You open it again only when they stop screaming.', gore: 'grim' },
    { t: 'You crouch at the bars and tell {captive} exactly which of their fingers the brand will take first if it\'s left to rot. You are not lying. They know you are not lying.', gore: 'grim' },
  ],
  bargain: [
    { t: 'You trade {captive} something they want — news, comfort, coin for someone outside — and the brand dims a little in the exchange.' },
    { t: 'A deal, struck through the bars. {captive} hates how much they wanted it.' },
  ],
  mercy: [
    { t: 'You bring {captive} a real meal and a blanket and leave without asking for anything. They stare at the door long after it closes.' },
    { t: 'You sit with {captive} for an hour and talk about nothing. Near the end, they almost laugh.' },
  ],
  testimony: [
    { t: '{ally} sits down outside the bars and tells {captive} what the Coven never told them: what Mother Cinder does with the ones who fail. What it\'s like to dream again. {captive} doesn\'t interrupt once.' },
    { t: '{ally} rolls up a sleeve to show the smooth skin where their brand used to be. "It doesn\'t come back," they say. "Not if you don\'t let it." The brand on {captive}\'s throat flickers like it heard.' },
  ],
  outburst: [
    { t: '{captive} lunges against the chains, spitting. "You\'ll BURN for this. She\'ll come for you, she\'ll come for all of you —" The brand flares hot enough to blister.' },
    { t: '{captive} laughs, high and broken, and won\'t stop for a long time. When they do, their eyes are harder than before.' },
  ],
  rue_fine_print: [
    { t: 'Rue leans over your shoulder and adds a clause to the bargain in tiny, smoldering letters. "Standard terms," she says. {captive} reads it twice and looks ill.' },
  ],
};

// Taunts: a converted former comrade lounges outside an old cellmate's
// bars. Flavor only — flirtatious bragging about the warlock is allowed,
// nothing explicit, no spice tag, and no mechanical effect beyond a small
// +regard or a "traitor!" outburst.
export const TAUNT_LINES = [
  [{ s: 'ally', t: '(leaning on the bars, wearing your colors) You should see the library at night, {captive}. Candles everywhere. Real beds. I sleep past dawn now. Nobody chants at me.' },
   { s: 'captive', t: 'Traitor.' },
   { s: 'ally', t: 'Mm. Well-rested traitor.' }],
  [{ s: 'ally', t: 'Mother used to tell us warlocks were monsters. (a slow, smug smile) {name} made me breakfast this morning. Monstrously good breakfast.' },
   { s: 'captive', t: '...You\'re lying.' },
   { s: 'ally', t: 'I\'m really not. You\'d know, if you ever got out of here. {They} like{s} it when we\'re well-fed.' }],
  [{ s: 'ally', t: '(examining their nails) You know what the worst part of the brand was? You never get to want anything. I want things now. (a pointed look up the stair) Some of those things even want me back.' },
   { s: 'captive', t: 'Shut up. SHUT UP.' }],
  [{ s: 'ally', t: 'I still remember the first time {name} looked at me like I was a person instead of a problem. (a lazy grin) I\'d tell you how it ended, but you\'re not allowed to have nice things yet.' },
   { s: 'captive', t: '(very quietly) ...Is it really that good out there?' },
   { s: 'ally', t: 'Better. Hurry up and find out.' }],
];

// ------------------------------------------------------------
// RUE — Three Favors
// ------------------------------------------------------------

E.rue_goat = {
  id: 'rue_goat', where: 'guild', once: true, priority: 75,
  cond: S => !!S.flags.vesper_joined && S.day >= 3,
  steps: [
    { s: 'narr', t: 'A loud crash echoes from the library\'s kitchen, followed by something that sounds very much like a goat.' },
    { s: 'narr', t: 'A young woman appears in the doorway: soot-streaked, grinning, small curved obsidian horns, ember-orange eyes, a slim spaded tail flicking behind her. She is holding a frying pan like a trophy.' },
    { s: 'rue', t: 'Okay. Before you get mad: I was summoned. Accidentally. By a very stupid cultist. In your pantry.' },
    { s: 'goat', t: 'Mehhh.' },
    { s: 'rue', t: 'He\'s a goat now. That\'s not my fault, that\'s just what happens.' },
    { s: 'narr', t: 'She tosses the pan over her shoulder; it clangs somewhere. Vesper appears behind you with a candle and the expression of someone whose pantry has been violated.' },
    { s: 'vesper', t: 'There is a demon in my kitchen.' },
    { s: 'rue', t: 'There is a LIBRARIAN in MY kitchen. (to you, brightly) Anyway! The goat had a map on him. Your name, circled in blood. Very dramatic. Very Coven.' },
    { s: 'narr', t: 'She holds it up: a city map inked in dried blood, a circle around the Codex, and a second mark — a market stall in the Demon Market, labelled TRAP — READY.' },
    { s: 'rue', t: 'So! Do I get to count saving your life as favor number one, or are we gonna argue about it?' },
    { s: 'vesper', t: 'Favor number one of what?' },
    { s: 'rue', t: '(a beat too long) ...Nothing. Forget I said a number.', brand: true },
    { s: 'narr', t: 'Something on her collarbone flares bright orange — a brand, ember-colored — and she slaps a hand over it.' },
    { choice: [
      { t: '"Show me where the trap is."', tone: 'dom', bond: { rue: 1 }, r: [
        { s: 'rue', t: '(delighted) Ooh, straight to business. I like you. I hate that I like you. Let\'s go ruin someone\'s afternoon.' },
      ] },
      { t: '"Why are you helping me?"', tone: 'kind', r: [
        { s: 'rue', t: 'I\'m not HELPING. I\'m... investing. In chaos. (the brand flares again) Ugh. Stop looking at it.', brand: true },
      ] },
    ] },
    { flag: 'rue_map' },
    { s: 'narr', t: 'The blood map points to the Demon Market. You can follow it from the tarot board.' },
  ],
};

E.rue_terms = {
  id: 'rue_terms', where: 'auto', once: true, priority: 90,
  steps: [
    { s: 'narr', t: 'The trappers are down. In the middle of the market stall\'s floor, inside a ring of Coven sigils burning white, Rue is caught — not the Rue who blew up your pantry, but another, the same, and the trap is unwinding her slowly, like thread.' },
    { s: 'rue', t: '(through her teeth, shimmering at the edges) So. Funny story. The goat thing was a decoy. This is the real me. Small problem. I\'m dying a little.' },
    { s: 'narr', t: 'You break the sigil ring with one word. Rue drops out of it onto her hands and knees, whole again, gasping. The brand on her collarbone ignites — not a flare. A blaze. Three marks burn themselves into it, one after another.' },
    { s: 'rue', t: '...Oh no.' },
    { s: 'rue', t: 'Oh, no no no. That\'s an infernal contract. You SAVED me. You saved me on PURPOSE. That\'s three favors, that\'s the standard rate, I owe you THREE —' },
    { s: 'vesper', t: '(arriving, out of breath, absolutely thrilled) Oh, this is wonderful.' },
    { s: 'rue', t: 'Shut UP, Librarian.' },
    { s: 'narr', t: 'Rue gets up, dusts herself off, and squares up to you with her chin high and her tail lashing.' },
    { s: 'rue', t: 'Terms. I stay until the debt\'s paid. Temporary. I repay the favors when I want, how I want, and as inconveniently as possible. That\'s non-negotiable.' },
    { choice: [
      { t: '"Agreed." Shake her hand.', tone: 'kind', bond: { rue: 1 }, r: [
        { s: 'narr', t: 'Her hand is hot as a stovetop. She shakes once, hard, and doesn\'t let go quite as fast as she means to.' },
        { s: 'rue', t: 'Great. Fine. Temporary. I\'m only staying until the debt\'s paid.' },
      ] },
      { t: '"You\'ll repay them when I call them in."', tone: 'dom', bond: { rue: 2 }, r: [
        { s: 'narr', t: 'Rue opens her mouth to argue. You hold her gaze. She closes it again, very slowly, ears going pink at the tips.' },
        { s: 'rue', t: '...That\'s — fine. That\'s FINE. Whatever. (muttering) Bossy.' },
        { s: 'rue', t: 'I\'m only staying until the debt\'s paid, for the record. For the RECORD.', brand: true },
      ] },
      { t: '"Keep your favors. You\'re free."', tone: 'reject', r: [
        { s: 'rue', t: '(horrified) You can\'t just — that\'s not how contracts WORK. You can\'t refuse a debt, it\'s RUDE.' },
        { s: 'rue', t: 'Nope. I\'m staying. Out of spite. (the brand smolders, steady) That one wasn\'t a lie, by the way. Remember that.' },
      ] },
    ] },
    { join: 'rue' },
    { flag: 'rue_joined' },
    { chronicle: 'Rue owes you three favors. She has repaid zero, on purpose.' },
  ],
};

E.rue_bond_1 = {
  id: 'rue_bond_1', where: 'camp', once: true, priority: 40,
  cond: S => has(S, 'rue') && b(S, 'rue') >= 2,
  steps: [
    { s: 'narr', t: 'Rue is sprawled upside down across your armchair, tail flicking, eating something she definitely stole.' },
    { s: 'rue', t: 'Oh good, you\'re back. Your spellbook\'s wrong, by the way. I fixed it.' },
    { s: 'narr', t: 'She waves a page that is very much on fire.' },
    { s: 'rue', t: 'And before you ask: no, this doesn\'t count as a favor.' },
    { choice: [
      { t: 'Take the burning page out of her hand and put it out between two fingers.', tone: 'dom', bond: { rue: 1 }, r: [
        { s: 'narr', t: 'Rue watches you do it with her mouth slightly open. She doesn\'t say anything for almost five seconds, which is a record.' },
        { s: 'rue', t: '...Show-off. (she is staring at your hand) Do that again sometime. For science.' },
      ] },
      { t: 'Laugh.', tone: 'kind', bond: { rue: 1 }, r: [
        { s: 'rue', t: '(sitting up, scandalized and thrilled) Did you just LAUGH? At my CHAOS? Oh, it\'s on. It is SO on.' },
      ] },
    ] },
  ],
};

E.rue_favor_one = {
  id: 'rue_favor_one', where: 'camp', once: true, priority: 45,
  cond: S => has(S, 'rue') && b(S, 'rue') >= 4,
  steps: [
    { s: 'narr', t: 'You wake to smoke. Rue is at the window, perfectly still for once, watching a fire burn on the far side of the dead city.' },
    { s: 'rue', t: 'Coven hunter. He was coming here. Had a knife with your name on it — literally, they engrave them, it\'s so tacky.' },
    { s: 'rue', t: 'I already bit him. (the brand flares) ...Okay, I bit him a little. And then I set his whole safehouse on fire. Favor number one. Paid.' },
    { s: 'narr', t: 'One of the three marks on her collarbone goes dark. She looks at it for a long time.' },
    { s: 'rue', t: '(not turning around) Two more. Then I\'m free. (a pause) Isn\'t that great. That\'s so great.', brand: true },
    { choice: [
      { t: 'Stand beside her at the window. Say nothing.', tone: 'kind', bond: { rue: 2 }, r: [
        { s: 'narr', t: 'Her tail curls around your ankle. She doesn\'t seem to notice it doing it. You don\'t mention it.' },
      ] },
      { t: '"You\'re not going anywhere, and you know it."', tone: 'dom', bond: { rue: 2 }, r: [
        { s: 'rue', t: '(whipping around) You don\'t KNOW that, you — (the brand stays dark. No flare.) ...Shut up. Go back to bed.' },
        { s: 'narr', t: 'She doesn\'t move from your side of the room until dawn.' },
      ] },
    ] },
    { chronicle: 'Rue repaid her first favor in fire. She did not seem happy about being one closer to free.' },
  ],
};

E.rue_romance = {
  id: 'rue_romance', where: 'camp', once: true, priority: 46,
  cond: free('rue', S => b(S, 'rue') >= 7),
  steps: [
    { s: 'narr', t: 'Rue picks a fight with you on purpose, in the middle of the reading room, about whether demons can be cold. She loses it on purpose, too, and ends up pinned against a bookshelf by nothing but your stare.' },
    { s: 'rue', t: '(breathless, grinning, trying very hard not to be) This is the part where you put me in my place, right? That\'s the bit. That\'s what we do.' },
    { s: 'rue', t: '...I like that part. I\'m never going to say it again, so you\'d better have heard it.', brand: false },
    { choice: [
      { t: 'Put her in her place.', tone: 'dom', bond: { rue: 1 }, r: [
        { s: 'narr', t: 'You tilt her chin up with one finger. She goes quiet in a way you\'ve never heard from her — and then, softly, she leans into your hand.', spice: 'gentle' },
        { s: 'narr', t: 'You tilt her chin up with one finger and hold her there, and the brat goes out of her all at once like a snuffed wick. Her tail winds around your wrist, tight and possessive; her breath is hot as a forge against your mouth before you\'ve even closed the distance. When you finally kiss her, she makes a sound like something infernal surrendering, and the bookshelf behind her starts, very gently, to smoke.', spice: 'steamy' },
        { s: 'narr', t: '', spice: 'unbound' }, // ZOE: unbound
      ] },
      { t: 'Kiss her forehead and walk away.', tone: 'kind', r: [
        { s: 'rue', t: '(to your retreating back, outraged, delighted) You CAN\'T just — that\'s — I\'m going to steal ALL your socks!' },
      ] },
    ] },
  ],
};

// ------------------------------------------------------------
// ISOLDE — The Kneeling Sword
// ------------------------------------------------------------

E.isolde_hunter = {
  id: 'isolde_hunter', where: 'auto', once: true, priority: 90,
  steps: [
    { s: 'narr', t: 'The Border Chapel\'s bells are ringing as you arrive. The air smells of rain and candle-smoke and old iron.' },
    { s: 'vesper', t: '(very still) Vigil ground. The Order of the Last Vigil — they\'ve hunted warlocks for six hundred years. They\'ve been expecting you.' },
    { s: 'narr', t: 'Inside, the chapel is half ruined. And at its broken altar, waiting, a tall woman in dark weathered plate stands with her longsword point-down against the stone. Short ash-blonde hair. A small scar through one eyebrow. Three faint violet runes carved into her breastplate.' },
    { s: 'isolde', t: 'Warlock. I am Dame Isolde Varr of the Last Vigil.' },
    { s: 'isolde', t: 'The stars foretold a storm. I was sent to end it.' },
    { s: 'narr', t: 'She lifts the sword. Her hand is perfectly steady. Her eyes, for one half-second, are not.' },
    { s: 'isolde', t: 'Defend yourself.' },
    { chronicle: 'Dame Isolde Varr of the Last Vigil was sent to kill you.' },
  ],
};

E.isolde_kneel = {
  id: 'isolde_kneel', where: 'auto', once: false, priority: 92,
  cond: S => !!S.flags.isolde_yielded && !has(S, 'isolde') && !S.flags.isolde_sent_away,
  steps: [
    { s: 'narr', t: 'She could have kept fighting. You both know it. Instead, at the edge of the killing stroke, Isolde Varr lowers her sword — and kneels on the chapel stone, head bowed, blade laid flat across her open palms.' },
    { s: 'isolde', t: 'I was sent to slay the storm.' },
    { s: 'isolde', t: '(quietly) I find I would rather serve it.' },
    { s: 'vesper', t: '(under her breath) ...Oh, the Chronicle is going to be unbearable about this.' },
    { s: 'isolde', t: 'Take my oath, or take my head. Either is your right.' },
    { choice: [
      { t: 'Accept her oath. Lay your hand on the blade.', tone: 'kind', bond: { isolde: 2 }, r: [
        { s: 'narr', t: 'Your hand on cold steel. Something in the air shifts, and a fourth line begins — just begins — to scratch itself faintly into her armor beside the other three.' },
        { s: 'isolde', t: 'Then I am your sword. (she rises) I will not explain why. I am not certain I could.' },
      ] },
      { t: '"Your oath, on my terms. Swear it to me, not to the stars."', tone: 'dom', bond: { isolde: 2 }, r: [
        { s: 'narr', t: 'Isolde looks up at you for the first time. Something tired and human shows through her composure, and then is put away.' },
        { s: 'isolde', t: 'To you, then. Not the stars. Not the Order. (she bows her head again, lower) I swear it.' },
      ] },
      { t: '"Go home, knight."', tone: 'reject', flag: 'isolde_sent_away', r: [
        { s: 'isolde', t: '(she rises slowly) I have no home. The Order will name me oathbreaker by morning for not finishing this.' },
        { s: 'isolde', t: 'But it is your right. (she sheathes her sword) I will not trouble you.' },
        { s: 'narr', t: 'She walks out of the chapel into the rain. You have the distinct impression she is not going very far.' },
      ] },
    ] },
    { join: 'isolde', cond: S => !S.flags.isolde_sent_away },
    { flag: 'isolde_met' },
  ],
};

E.isolde_follows = {
  id: 'isolde_follows', where: 'camp', once: true, priority: 60,
  cond: S => !!S.flags.isolde_sent_away && !has(S, 'isolde'),
  steps: [
    { s: 'narr', t: 'Rain on the library\'s broken skylight. You climb up to check the wards and find a tall shape on the rooftop, cloaked, motionless, sword point-down. Keeping watch. She has been there, Vesper admits, every night since the chapel.' },
    { s: 'isolde', t: '(without turning) Forgive me. I did not hear you approach.' },
    { s: 'narr', t: 'She studies you a moment longer than she needs to.' },
    { s: 'isolde', t: 'You are soaked.' },
    { s: 'narr', t: 'Without another word she unclasps her cloak and holds it out, eyes fixed somewhere just past your shoulder.' },
    { choice: [
      { t: 'Take the cloak. "Come inside, Isolde."', tone: 'kind', bond: { isolde: 2 }, flag: 'isolde_returned', r: [
        { s: 'isolde', t: '(a long pause) ...As you command.' },
      ] },
      { t: '"Kneel again. And this time I\'ll take it."', tone: 'dom', bond: { isolde: 2 }, flag: 'isolde_returned', r: [
        { s: 'narr', t: 'She kneels on the wet slate without hesitation. The fourth rune begins to scratch itself into her armor.' },
      ] },
      { t: 'Leave her to her watch.', tone: 'reject', reopen: true, r: [
        { s: 'narr', t: 'You go back down. When you look up from the stair, she is still there. She will be there tomorrow.' },
      ] },
    ] },
    { join: 'isolde', cond: S => !!S.flags.isolde_returned },
  ],
};

E.isolde_riders = {
  id: 'isolde_riders', where: 'guild', once: true, priority: 74,
  cond: S => has(S, 'isolde') && !S.flags.isolde_rune4,
  steps: [
    { s: 'narr', t: 'Isolde is already at the window when you wake, armored, sword resting point-down against the floor. She doesn\'t turn.' },
    { s: 'isolde', t: 'Riders. Six. Order colors.' },
    { s: 'isolde', t: '(a pause) They are here for me.' },
    { s: 'narr', t: 'She finally faces you, and for a moment her composure slips. Something tired and human shows through.' },
    { s: 'isolde', t: 'You need not stand with me in this.' },
    { s: 'isolde', t: '(her grip tightens on the hilt) ...But I would be honored if you did.' },
    { flag: 'isolde_riders_ready' },
    { s: 'narr', t: 'The riders wait in the rift outside the old city wall. Ride out from the tarot board when you\'re ready.' },
  ],
};

E.isolde_rune4 = {
  id: 'isolde_rune4', where: 'auto', once: true, priority: 90,
  steps: [
    { s: 'narr', t: 'The last rider yields, and then they all ride away: back north, toward the Order, carrying the word "oathbreaker" with them like a banner.' },
    { s: 'narr', t: 'Isolde watches them go. When they are out of sight, she kneels in the mud in front of you and, without a word, offers you her dagger hilt-first.' },
    { s: 'isolde', t: 'The fourth rune. I would have it carved by your hand.' },
    { choice: [
      { t: 'Carve it carefully, the way she would.', tone: 'kind', bond: { isolde: 2 }, r: [
        { s: 'narr', t: 'Steel on steel. The rune glows violet as you finish it. Isolde lets out a breath she seems to have been holding for six hundred years.' },
      ] },
      { t: 'Carve it deep, the way you would.', tone: 'dom', bond: { isolde: 2 }, r: [
        { s: 'narr', t: 'You cut it deep enough to last. The rune flares bright enough to throw both your shadows across the field. Isolde does not flinch. She closes her eyes.' },
      ] },
    ] },
    { s: 'isolde', t: 'Four. (very quietly) Lord-Commander Aldric taught me to carve the first. He will hear of this one.' },
    { flag: 'isolde_rune4' },
    { chronicle: 'You carved Isolde\'s fourth rune. The Order named her oathbreaker.' },
  ],
};

E.isolde_romance = {
  id: 'isolde_romance', where: 'camp', once: true, priority: 46,
  cond: free('isolde', S => b(S, 'isolde') >= 7 && !!S.flags.isolde_rune4),
  steps: [
    { s: 'narr', t: 'Late watch. Isolde is polishing a blade that is already clean, which Vesper says means she is troubled. You sit down beside her. She stops.' },
    { s: 'isolde', t: 'I have never removed my gauntlets in front of anyone.' },
    { s: 'narr', t: 'Slowly, one buckle at a time, she does. Her hands are scarred across both palms: the Order\'s warlock-slayer brands, burned in when she was a girl.' },
    { s: 'isolde', t: 'I hid them because I was ashamed. (she holds them out to you, open) I would rather you see them than not be touched by them.' },
    { choice: [
      { t: 'Take her hands in yours.', tone: 'kind', bond: { isolde: 1 }, r: [
        { s: 'narr', t: 'You lace your fingers through hers, brands and all. Isolde makes a sound you have never heard from her — small, unguarded — and bows her forehead to your joined hands.', spice: 'gentle' },
        { s: 'narr', t: 'You lace your fingers through hers, brands and all, and bring her scarred knuckles to your lips. Isolde goes absolutely still — and then, with the same terrible care she gives to every vow, she draws you in by the hands until there is no watch and no Order and no space between you at all. Her armor is cold. She is not. She kisses you like a knight who has decided, finally, what she is willing to die for, and is relieved beyond words that it is this.', spice: 'steamy' },
        { s: 'narr', t: '', spice: 'unbound' }, // ZOE: unbound
      ] },
      { t: '"Your hands are mine now. Brands and all."', tone: 'dom', bond: { isolde: 1 }, r: [
        { s: 'isolde', t: '(barely audible) Yes.' },
        { s: 'narr', t: 'She does not let go of you for the rest of the watch.' },
      ] },
    ] },
    { chronicle: 'Isolde took off her gauntlets in front of you.' },
  ],
};

// ------------------------------------------------------------
// VESPER — bond arc
// ------------------------------------------------------------

E.vesper_bond_1 = {
  id: 'vesper_bond_1', where: 'guild', once: true, priority: 42,
  cond: S => has(S, 'vesper') && b(S, 'vesper') >= 2,
  steps: [
    { s: 'narr', t: 'Vesper is reading the Tarot by one candle. She mispronounces "Hierophant" so badly that it has to be on purpose.' },
    { choice: [
      { t: 'Correct her.', tone: 'dom', bond: { vesper: 1 }, r: [
        { s: 'vesper', t: '(not looking up, smiling into her cards) Mm. Say it again. I don\'t think I quite caught it.' },
      ] },
      { t: 'Let it go.', tone: 'kind', r: [
        { s: 'vesper', t: '(a pause, disappointed) ...Hiero-PHANT. Very old word. Very tricky. (she waits) No? Fine.' },
      ] },
    ] },
    { s: 'narr', t: 'Before you go, she slides something across the table: a pressed violet from some garden she has never visited, tucked inside a dead stranger\'s postcard.' },
    { s: 'vesper', t: 'I collect things that remember. That one remembers summer. You can have it.' },
  ],
};

E.vesper_bond_2 = {
  id: 'vesper_bond_2', where: 'camp', once: true, priority: 43,
  cond: S => has(S, 'vesper') && b(S, 'vesper') >= 4,
  steps: [
    { s: 'narr', t: 'Vesper finally turns the third card. She does it with you watching, as promised, both of you holding your breath.' },
    { s: 'narr', t: 'It is blank.' },
    { s: 'vesper', t: '(staring) That\'s not — the deck doesn\'t HAVE blank cards. I\'ve had this deck for two hundred years.' },
    { s: 'codex', t: '[ A line of ink crawls across the card while you watch. It is not finished. It writes: THE ', cond: () => true },
    { s: 'narr', t: '— and stops.' },
    { s: 'vesper', t: '...It\'s waiting for something. For you to do something. (she tucks it carefully into her coat, over her heart) I\'ll keep it. Until it finishes the sentence.' },
    { chronicle: 'Vesper turned the third card. It was blank, and then it began to write.' },
  ],
};

E.vesper_romance = {
  id: 'vesper_romance', where: 'camp', once: true, priority: 46,
  cond: free('vesper', S => b(S, 'vesper') >= 7),
  steps: [
    { s: 'narr', t: 'The sigil on Vesper\'s wrist has been warm for days. Tonight it is glowing — visibly, through her sleeve — and she has stopped pretending not to notice.' },
    { s: 'vesper', t: 'At full strength, the Binding lets me feel what you feel. From across the city. (she laughs, low) I\'ve read three hundred years of other people\'s pacts. I\'ve never once been on the page.' },
    { s: 'vesper', t: 'I\'m starving for someone who doesn\'t ask permission. (she meets your eyes) So don\'t.' },
    { choice: [
      { t: 'Don\'t.', tone: 'dom', bond: { vesper: 1 }, r: [
        { s: 'narr', t: 'You take her face in your hands and kiss her, and every candle in the Codex leans toward you at once.', spice: 'gentle' },
        { s: 'narr', t: 'You take her by the collar of her archivist\'s coat and kiss her against the stacks, and every candle in the Codex leans toward you at once. Her ink-stained fingers find the brass buttons of her own coat before you can; she is laughing against your mouth, breathless, shaking with three centuries of patience finally running out. The sigil at her wrist blazes. She can feel exactly how much you want her. It is, she tells you later, far too much information, and she would like all of it again.', spice: 'steamy' },
        { s: 'narr', t: '', spice: 'unbound' }, // ZOE: unbound
      ] },
      { t: 'Ask anyway, softly.', tone: 'kind', bond: { vesper: 1 }, r: [
        { s: 'vesper', t: '(a startled, helpless laugh) Oh, you absolute — yes. Obviously yes.' },
        { s: 'narr', t: 'She kisses you first. She has been waiting a long time to be first at something.', spice: 'gentle' },
        { s: 'narr', t: 'She kisses you first, hard, ink on her fingertips leaving dark marks along your jaw that she will refuse to let you wash off in the morning. Between the stacks, by one candle, the Keeper of the Codex finally claims something for herself.', spice: 'steamy' },
        { s: 'narr', t: '', spice: 'unbound' }, // ZOE: unbound
      ] },
    ] },
    { s: 'codex', t: '[ The Chronicle writes a new page, all on its own, and then — for the first time in its history — closes itself politely. ]' },
    { chronicle: 'The Binding reached full strength.' },
  ],
};

// ------------------------------------------------------------
// THE WARLOCK'S COMMAND — unlocked by a domineering streak
// ------------------------------------------------------------

export function prevailingTone(S) {
  const t = (S.stats && S.stats.tone) || {};
  const entries = Object.entries(t).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]);
  return entries.length ? entries[0][0] : null;
}
const domCount = S => ((S.stats && S.stats.tone && S.stats.tone.dom) || 0);

E.command_1 = {
  id: 'command_1', where: 'guild', once: true, priority: 55,
  cond: S => domCount(S) >= 4 && (S.allies || []).length >= 3,
  steps: [
    { s: 'narr', t: 'You come up the stair to find the reading room rearranged. Vesper\'s ledgers, Rue\'s stolen trinkets, Isolde\'s whetstones — everything has drifted, without anyone deciding it, to orbit your chair.' },
    { s: 'vesper', t: 'We didn\'t plan it. (she does not sound sorry) It\'s just where things end up now. Near you.' },
    { s: 'rue', cond: S => has(S, 'rue'), t: 'I moved MY stuff because the light is better here. Coincidence.', brand: true },
    { s: 'isolde', cond: S => has(S, 'isolde'), t: 'A household arranges itself around its center. That is all this is.' },
    { s: 'codex', t: '[ THE WARLOCK\'S COMMAND — they have stopped waiting to be told, and started waiting to be told by you. ]' },
    { chronicle: 'The household began to arrange itself around you.' },
  ],
};

E.command_2 = {
  id: 'command_2', where: 'camp', once: true, priority: 54,
  cond: S => domCount(S) >= 7 && !!S.seen.command_1,
  steps: [
    { s: 'narr', t: 'A Coven ambush in the stacks. It ends in eleven seconds because you say one word — "Hold" — and every one of your allies does, perfectly, at once.' },
    { s: 'narr', t: 'Afterward, in the quiet, nobody says anything for a while. Then Rue starts laughing, and can\'t stop.' },
    { s: 'rue', cond: S => has(S, 'rue'), t: 'Did you SEE that? We just — we all just — (she shoves Isolde) YOU stopped mid-swing! You never stop mid-swing!' },
    { s: 'isolde', cond: S => has(S, 'isolde'), t: 'I was told to hold.' },
    { s: 'vesper', t: '(softly, to you) You know they\'d follow that voice anywhere. Be careful where you take it.' },
  ],
};

// ------------------------------------------------------------
// THE DAWNWARD COMPANY — Erin, Sakura, Shiro, Yuki
// A famous A-rank party of the Hunters' Lodge: neutral at first,
// then in your way. They bend the knee — or walk away proud.
// ------------------------------------------------------------

E.dawnward_meet = {
  id: 'dawnward_meet', where: 'rumor', once: true, priority: 30,
  cond: S => S.circleIdx >= 1,
  steps: [
    { s: 'narr', t: 'A crow brings a Hunters\' Lodge broadsheet, pinned open to page two: THE DAWNWARD COMPANY CLOSES THIRTIETH RIFT. A woodcut of four adventurers — a golden knight, an elf with a witch\'s hat, a pale woman with a ledger, and a young hunter with an earnest, hopeful face.' },
    { s: 'vesper', t: 'Lodge hunters. They close rifts for coin and a parade. (she reads further) "...and the Company has pledged to investigate rumors of an unlicensed warlock in the drowned quarter." Hm.' },
    { s: 'vesper', t: 'That\'s you, in case it wasn\'t clear.' },
  ],
};

E.dawnward_warning = {
  id: 'dawnward_warning', where: 'guild', once: true, priority: 50,
  cond: S => S.circleIdx >= 2 && !!S.seen.dawnward_meet,
  steps: [
    { s: 'narr', t: 'They come to the drowned stair in daylight, like people who have never once been afraid of a door. Four of them. The golden knight in front.' },
    { s: 'erin', t: 'Hi! Sorry. Hello. We\'re the Dawnward Company, you\'ve probably heard of us — I\'m Erin, that\'s Sakura, Shiro, Yuki — we\'re here to tell you to stop doing warlock things.' },
    { s: 'sakura', t: '(peering past you into the library, eyes enormous) Is that the actual Codex? Is that ink BLEEDING? Oh no, I want to touch it so badly, that\'s so bad, I shouldn\'t —' },
    { s: 'shiro', t: 'Sakura.' },
    { s: 'shiro', t: '(to you, flatly) You have sealed eleven people into a basement. The Lodge would like that to stop. I have a ledger. You are in it, extensively.' },
    { s: 'yuki', t: 'We\'re not here to fight! Probably. (earnestly) Everyone deserves a second chance. Even warlocks. I really believe that.' },
    { choice: [
      { t: '"Then give me one. Leave."', tone: 'dom', r: [
        { s: 'erin', t: '(blinking) ...Okay, that was really cool and I\'m annoyed about it.' },
        { s: 'shiro', t: 'Noted. (she writes something down) We\'ll be back.' },
      ] },
      { t: '"Come down to the Undercroft. See what Reclamation really is."', tone: 'kind', r: [
        { s: 'narr', t: 'Shiro goes alone. She is gone for an hour. When she comes back up, she is very quiet, and the ledger is closed.' },
        { s: 'shiro', t: 'They\'re... recovering. (a long pause) That isn\'t in any Lodge report.' },
      ] },
    ] },
  ],
};

E.dawnward_challenge = {
  id: 'dawnward_challenge', where: 'guild', once: true, priority: 52,
  cond: S => S.circleIdx >= 3 && !!S.seen.dawnward_warning,
  steps: [
    { s: 'narr', t: 'A Lodge seal on a formal letter, brought by a crow that seems embarrassed to be carrying it.' },
    { s: 'erin', t: '(in Erin\'s enormous, enthusiastic handwriting) WARLOCK. The Lodge says you\'re a Thorn-Circle threat now. They say we have to stop you. Meet us in the Charmed Glade at dawn. Honorable duel. No sealing anybody, please. P.S. Sakura says hi. P.P.S. Shiro says Sakura is not allowed to say hi.' },
    { s: 'vesper', t: 'They\'re going to lose. You know that. (a beat) The question is what you do with them when they do.' },
    { flag: 'dawnward_ready' },
  ],
};

E.dawnward_kneel = {
  id: 'dawnward_kneel', where: 'auto', once: true, priority: 90,
  steps: [
    { s: 'narr', t: 'The Glade goes quiet. Erin is on one knee, sword planted, still trying to stand. Sakura\'s hat is somewhere in a tree. Shiro has stopped casting and is simply watching you, very carefully, recalculating everything. Yuki is between them and you, arms out, shaking, not moving.' },
    { s: 'yuki', t: 'Please. Whatever you\'re going to do — do it to me. Not them.' },
    { s: 'erin', t: '(through her teeth) Yuki, NO —' },
    { choice: [
      { t: '"Kneel. All of you. And then come home with me."', tone: 'dom', flag: 'dawnward_bent', r: [
        { s: 'narr', t: 'A long, long silence. Then Shiro sets down her ledger in the grass and kneels. Then Sakura, scarlet to the ears. Then Erin, who looks like it is killing her and who is also, somehow, grinning. Yuki last.' },
        { s: 'shiro', t: 'This is the correct move. (she does not look at you) I calculated it four times. I\'m annoyed it\'s correct.' },
      ] },
      { t: '"Get up. The Lodge lied to you. Join me if you want the truth."', tone: 'kind', flag: 'dawnward_bent', r: [
        { s: 'narr', t: 'You offer Erin your hand. She stares at it. Then she takes it, and lets you pull her up, and the rest of the Company lowers their weapons one by one.' },
        { s: 'erin', t: 'You know what? Yeah. Okay. Show us.' },
      ] },
      { t: 'Turn your back on them and walk away.', tone: 'reject', flag: 'dawnward_spared', r: [
        { s: 'narr', t: 'You leave them their pride. Behind you, you hear Sakura start, very quietly, to cry with relief, and Shiro say "...that was unexpected," like it is the worst word she knows.' },
      ] },
    ] },
    { join: 'erin', cond: S => !!S.flags.dawnward_bent },
    { join: 'sakura', cond: S => !!S.flags.dawnward_bent },
    { join: 'shiro', cond: S => !!S.flags.dawnward_bent },
    { join: 'yuki', cond: S => !!S.flags.dawnward_bent },
    { chronicle: 'The Dawnward Company met you in the Charmed Glade.' },
  ],
};

// ------------------------------------------------------------
// HUB RECRUITS — the Codex cast petitions after inscriptions
// ------------------------------------------------------------

const petition = (id, lines) => ({
  id: 'recruit_intro_' + id, where: 'offer', once: false,
  steps: [
    ...lines,
    { choice: [
      { t: 'Welcome them to the Codex.', flag: `recruit_${id}_accept`, r: [{ s: id, t: 'Then I\'m yours. Show me where to stand.' }] },
      { t: 'Not yet.', r: [{ s: 'narr', t: 'They nod and step back. The petition stays on the table.' }] },
    ] },
  ],
});

E.recruit_intro_mira = petition('mira', [
  { s: 'narr', t: 'A broad-shouldered woman with honest scars is waiting at the drowned stair, leaning on a sword that has clearly paid for itself several times over.' },
  { s: 'mira', t: 'Mira Ashvale. Sellsword. Heard there\'s a warlock hiring who pays in coin and doesn\'t ask questions.' },
  { s: 'mira', t: 'I have questions anyway. First one: does the basement have a lock on the inside, or just the outside?' },
  { s: 'vesper', t: '(delighted) Oh, I like her.' },
]);
E.recruit_intro_nessa = petition('nessa', [
  { s: 'narr', t: 'A shy woman with a basket of tinctures has been standing on the stair for an hour, rehearsing under her breath.' },
  { s: 'nessa', t: 'Nessa Vale! Hello! Sorry. I — I keep a stall in the market. Kept. I heard you keep beasts, and that some of them are hurt, and nobody\'s looking after their pens, and I — (deep breath) — I would like to look after their pens.' },
  { s: 'nessa', t: 'And your people. And possibly you. You have a cough. I can hear it.' },
]);
E.recruit_intro_vex = petition('vex', [
  { s: 'narr', t: 'A pact appears on the reading table overnight, written in perfect, unsettling calligraphy. The ink does not bleed. The ink always bleeds.' },
  { s: 'vex', t: '(from the corner, where the shadow is slightly too deep) I watched. Three days. You let the chained ones choose. I would like to be somewhere that lets things choose.' },
  { s: 'vex', t: 'Also I would like to try soup.' },
]);
E.recruit_intro_seris = petition('seris', [
  { s: 'narr', t: 'A woman in severe College robes walks into the library without knocking, sets a stack of reports on the table, and sits in your chair.' },
  { s: 'seris', t: 'Seris Val, Obsidian College. I\'ve been sent to observe, contain, and if necessary dismantle you. (she opens the top file) These say you\'re impossible.' },
  { s: 'seris', t: 'I don\'t believe them. I\'m here to be wrong in person. (dryly) Purely professional proximity, of course.' },
]);

// ------------------------------------------------------------
// CONQUEST — rival factions crack, fall, and kneel
// ------------------------------------------------------------

const fate = (fid, f) => S => S.factions && S.factions[fid] && S.factions[fid].fate === f;

const lairOpen = (fid, lines) => ({ id: 'lair_open_' + fid, where: 'auto', once: true, priority: 70, steps: lines });
E.lair_open_coven = lairOpen('coven', [
  { s: 'narr', t: 'The Coven\'s brands are going dark across the city, one by one. Acolytes are deserting. The forges have stopped ringing at night.' },
  { s: 'vesper', t: 'She\'s exposed. Mother Cinder. The way down to the Ashen Heart is open — once you\'re strong enough to walk it. (quietly) I know the way. I used to live there.' },
]);
E.lair_open_college = lairOpen('college', [
  { s: 'narr', t: 'A College seal arrives, broken on purpose. Inside, a single line in a hand trained never to tremble, trembling: THE ARCHON WILL RECEIVE YOU.' },
  { s: 'vesper', t: 'Sorn is out of agents to send. Which means he\'ll come himself, or let you come to him. He\'d rather it look like his idea.' },
]);
E.lair_open_vigil = lairOpen('vigil', [
  { s: 'narr', t: 'The Vigil\'s bells stop. Not one chapel on the north road is ringing.' },
  { s: 'isolde', cond: S => has(S, 'isolde'), t: 'They have pulled back to the Citadel. Aldric will be in the old chapel. (a long pause) Where I took my vows. He will wait for me there.' },
  { s: 'vesper', cond: S => !has(S, 'isolde'), t: 'The Order\'s pulled back to its Citadel. Lord-Commander Aldric is waiting for you.' },
]);
E.lair_open_market = lairOpen('market', [
  { s: 'narr', t: 'Half the Bazaar\'s stalls are shuttered. The ones still open quote prices in whispers.' },
  { s: 'rue', cond: S => has(S, 'rue'), t: '(very casually, not casual at all) So. The Velvet Vault\'s unguarded. The Proprietor\'s in there. I, uh. Might know them. A bit. They might have a contract with my handwriting on it.', brand: true },
  { s: 'vesper', cond: S => !has(S, 'rue'), t: 'The Velvet Vault is open. Whoever owns the Market is in there, counting what\'s left.' },
]);
E.lair_open_lodge = lairOpen('lodge', [
  { s: 'narr', t: 'The Lodge has stopped posting bounties on you. Instead, a single invitation, gilt-edged: GUILDMASTER HALE REQUESTS THE PLEASURE OF A HUNT.' },
  { s: 'vesper', t: 'He wants you in his trophy hall. I think he still has a plinth with your name on it.' },
]);

const dominate = (fid, lines) => ({ id: 'dominate_' + fid, where: 'auto', once: true, priority: 80, steps: lines });
E.dominate_coven = dominate('coven', [
  { s: 'narr', cond: fate('coven', 'subjugated'), t: 'Mother Cinder is dragged down through the Heart\'s floor in chains of your sigil, still burning, still cursing. Across the city, every Coven brand flickers — and stays lit, waiting to see what you\'ll do with her.' },
  { s: 'vesper', cond: fate('coven', 'subjugated'), t: '(watching the empty throne) She taught me everything. Now she\'s two floors under my reading table. (a shaky laugh) I don\'t know what I feel. Ask me in a week.' },
  { s: 'narr', cond: fate('coven', 'shattered'), t: 'Mother Cinder dies on her throne of brands. Every Coven brand in the city gutters out at once. Her people scatter — leaderless, terrified, and very, very willing to pay tribute to whoever did that.' },
  { s: 'codex', t: '[ THE ASHEN COVEN — DOMINATED. Tribute will come nightly. ]' },
]);
E.dominate_college = dominate('college', [
  { s: 'narr', cond: fate('college', 'humbled'), t: 'Archon Sorn yields. He does it precisely: sets down his staff, removes his signet, and signs a writ in his own blood granting the warlock of the drowned quarter full access to the Obsidian archives. Then he sits down, very carefully, and does not get up for a long time.' },
  { s: 'narr', cond: fate('college', 'shattered'), t: 'Archon Sorn falls in his own sanctum. The College\'s adepts don\'t flee. They just stop, look at each other, and start asking who\'s in charge now. The answer, it turns out, is you.' },
  { s: 'codex', t: '[ THE OBSIDIAN COLLEGE — DOMINATED. Its archives are yours. ]' },
]);
E.dominate_vigil = dominate('vigil', [
  { s: 'narr', cond: fate('vigil', 'subjugated'), t: 'Aldric kneels in the chapel where Isolde swore her first oath. When your sigil closes around him, he doesn\'t resist. He looks only at her.' },
  { s: 'isolde', cond: S => fate('vigil', 'subjugated')(S) && has(S, 'isolde'), t: '(very quietly) You taught me to carve the first rune. I will be the one who sits outside your cell.' },
  { s: 'narr', cond: fate('vigil', 'shattered'), t: 'The Lord-Commander falls. The Order\'s knights lay their swords down one by one around his body, and the oldest of them asks, formally, what the warlock requires of them.' },
  { s: 'isolde', cond: S => fate('vigil', 'shattered')(S) && has(S, 'isolde'), t: '(she closes his eyes) ...He believed I could be saved. He was right. Just not in the way he meant.' },
  { s: 'codex', t: '[ THE ORDER OF THE LAST VIGIL — DOMINATED. The hunt is over. ]' },
]);
E.dominate_market = dominate('market', [
  { s: 'narr', cond: fate('market', 'subjugated'), t: 'The Proprietor is sealed mid-sentence — mid-counteroffer, actually. The Vault\'s ledgers burst into flames, all at once, and every debt in them comes due to you.' },
  { s: 'rue', cond: S => fate('market', 'subjugated')(S) && has(S, 'rue'), t: '(staring at a smoldering contract with her name on it) ...It burned. My contract burned. (her brand flickers, and doesn\'t flare) I didn\'t even have to steal it.' },
  { s: 'narr', cond: fate('market', 'shattered'), t: 'The Proprietor dies, and for one strange moment the whole Market goes quiet. Then the stall-keepers start bowing to you, one by one, the way they used to bow to whoever owned them.' },
  { s: 'codex', t: '[ THE DEMON MARKET — DOMINATED. Its coin flows to the Codex. ]' },
]);
E.dominate_lodge = dominate('lodge', [
  { s: 'narr', cond: fate('lodge', 'subjugated'), t: 'Guildmaster Hale goes down in his own trophy hall, under his own antlers, in front of the plinth he built for you. You put the plinth in the Undercroft. You put him beside it.' },
  { s: 'narr', cond: fate('lodge', 'shattered'), t: 'Hale falls. The Lodge\'s hunters take down his trophies themselves, quietly, and send their contracts to the drowned library instead.' },
  { s: 'erin', cond: S => has(S, 'erin'), t: '(staring at the empty hall) ...We used to drink here. On Hale\'s tab. (a long breath) Okay. Okay! New tab. Your tab.' },
  { s: 'codex', t: '[ THE HUNTERS\' LODGE — DOMINATED. Its contracts flow to you. ]' },
]);

// Leaders in the cells. Grim, never intimate.
E.cell_cinder_intro = {
  id: 'cell_cinder_intro', where: 'cell', captive: 'cinder', once: true, priority: 50,
  steps: [
    { s: 'narr', t: 'Mother Cinder sits in the deepest cell like it\'s a throne. The brand on her throat is the biggest you\'ve seen — not a hand. A whole burning palm, pressed over her heart.' },
    { s: 'cinder', t: 'So you\'re the storm. (she looks past you, up the stair) And she\'s the one who sent you down. My Vesper. My best. My stolen thing.' },
    { s: 'cinder', t: 'Burn me out, warlock. You\'ll find there\'s nothing underneath. I made sure of that a long time ago.' },
  ],
};
E.cell_aldric_intro = {
  id: 'cell_aldric_intro', where: 'cell', captive: 'aldric', once: true, priority: 50,
  steps: [
    { s: 'narr', t: 'Aldric has knelt in his cell every hour since he arrived. Not praying. Waiting.' },
    { s: 'aldric', t: 'Is she well? (he doesn\'t wait for an answer) I taught her to carve the first rune. I told her the seventh would be carved by a hand she trusted more than her own. I thought I meant God.' },
    { s: 'isolde', cond: S => has(S, 'isolde'), t: '(from the stair, not coming closer) I am well, Lord-Commander.' },
    { s: 'aldric', cond: S => has(S, 'isolde'), t: '(he closes his eyes) ...Good. Good.' },
  ],
};
E.cell_proprietor_intro = {
  id: 'cell_proprietor_intro', where: 'cell', captive: 'proprietor', once: true, priority: 50,
  steps: [
    { s: 'narr', t: 'The Proprietor has rearranged the cell. You don\'t know how. There is a small table now. There is tea.' },
    { s: 'narr', t: 'They smile with far too many teeth.' },
    { s: 'captive', t: 'Let\'s not be uncivilized about this. Everyone has a price. I\'d simply like to know yours before you learn mine.' },
    { s: 'rue', cond: S => has(S, 'rue'), t: '(from the stair, arms crossed) Don\'t drink the tea.' },
  ],
};
E.cell_hale_intro = {
  id: 'cell_hale_intro', where: 'cell', captive: 'hale', once: true, priority: 50,
  steps: [
    { s: 'narr', t: 'Hale paces the cell like it\'s a blind he\'s waiting in. Thirty years of hunting things, and he knows exactly how this looks from the other side of the bars.' },
    { s: 'captive', t: 'Built that plinth for your hands, warlock. Had the plaque engraved. (a dry laugh) Suppose that\'s mine now.' },
  ],
};

// Vesper's daily reading: what she says when each card turns.
export const READING_LINES = {
  tower:      ['The Tower again. (she taps it twice) It\'s fond of you. Tonight, something big is waiting — and something big pays well.'],
  moon:       ['The Moon. Someone downstairs is dreaming loudly. (she listens to her ink) There — a secret, slipping out.'],
  lovers:     ['The Lovers. (she covers it, a beat too fast, then uncovers it) ...It\'s not about me. Don\'t look at me like that. It\'s about the household.', 'The Lovers. Someone under this roof is thinking about you very hard. (dryly) I\'m not saying who. One of them is me.'],
  justice:    ['Justice. The city is watching what you do tonight. Make it worth the gossip.'],
  death:      ['Death. Not yours. (she smiles) Old graves, opening. Bring a bag.'],
  devil:      ['The Devil. The Market\'s keepers felt that card turn from here. Go shopping. They\'ll be generous out of sheer nerves.'],
  star:       ['The Star. (softly) A good card. Whatever cuts you tonight will close by morning.'],
  hierophant: ['The Hierophant. Old institutions, old secrets. (she\'s already writing a letter) Give me an hour and one of your rivals will be very embarrassed.'],
  wheel:      ['Wheel of Fortune. (a coin falls out of the deck. Then another.) ...That\'s never happened before.'],
  hanged:     ['The Hanged Man. Surrender — theirs, not yours. Your seals will bite deep tonight.'],
  chariot:    ['The Chariot. Momentum. Whatever you learn tonight will stick.'],
  hermit:     ['The Hermit. (she looks toward the Undercroft stair) A quiet card. Every brand down there just dimmed a little.'],
  empress:    ['The Empress. (from below, a chorus of contented animal noises) ...I may have fed your Menagerie. Out of the household budget. You\'re welcome.'],
  magician:   ['The Magician. (two reagents roll off the shelf and land at your feet) Show-off.'],
  sun:        ['The Sun. (she squints at it like it\'s rude) Bright, warm, unbearably optimistic. You\'ll fight like you mean it tonight.'],
};

// ------------------------------------------------------------
// ENDINGS — after the Ashen Heart (bond × corruption band)
// ------------------------------------------------------------

E.ending_redeemed = {
  id: 'ending_redeemed', steps: [
    { s: 'narr', t: 'Mother Cinder falls in the Ashen Heart, and the brand on every Coven throat in the city flickers at once — and goes out.' },
    { s: 'narr', t: 'You walk back up out of the dark with your mark still warm, and your hands still yours. The Codex writes the last page of this chapter in plain ink. It does not bleed.' },
    { s: 'vesper', t: 'Redeemed. (she reads it twice) I didn\'t think it had that word in it.' },
    { s: 'codex', t: '[ ENDING — REDEEMED. The storm passed, and the city was still standing. ]' },
  ],
};
E.ending_damned = {
  id: 'ending_damned', steps: [
    { s: 'narr', t: 'Mother Cinder falls. The Heart goes dark. And you are not quite who you were when you walked in — and neither is the one who walked out at your side.' },
    { s: 'narr', t: 'You are marked now, both of you, in matching places. Neither of you is sorry.' },
    { s: 'codex', t: '[ ENDING — DAMNED TOGETHER. Some pacts are sworn twice. ]' },
  ],
};
E.ending_long_night = {
  id: 'ending_long_night', steps: [
    { s: 'narr', t: 'Mother Cinder falls. The Heart gutters out. You climb back toward the library alone, through a dark that seems longer than it was on the way down.' },
    { s: 'vesper', t: '(waiting at the top of the stair, with a candle) You\'re back. That\'s enough, tonight. We\'ll work out the rest.' },
    { s: 'codex', t: '[ ENDING — THE LONG NIGHT. Not damned. Not saved. Still writing. ]' },
  ],
};
E.ending_ascended = {
  id: 'ending_ascended', steps: [
    { s: 'narr', t: 'You do not kill Mother Cinder. You do something worse. You take the Heart.' },
    { s: 'narr', t: 'The Coven\'s fire bends to you the way the Codex\'s candles once did. Every brand in the city now burns in the shape of your mark.' },
    { s: 'codex', t: '[ ENDING — THE ASCENDED WARLOCK. The storm did not pass. The storm stayed. ]' },
  ],
};
E.ending_codex_keeps = {
  id: 'ending_codex_keeps', steps: [
    { s: 'narr', t: 'You take the Heart, and it is not enough, and you know it is not enough — and Vesper is already there, sigil blazing, holding out her hand.' },
    { s: 'vesper', t: 'Come home. Come into the book. I\'ll keep you. I keep things very, very well.' },
    { s: 'narr', t: 'The Codex closes around you both like a held breath, and the drowned library goes quiet for the first time in three hundred years.' },
    { s: 'codex', t: '[ ENDING — THE CODEX KEEPS YOU. The third card, at last, finished its sentence: THE KEEPER\'S. ]' },
  ],
};
E.ending_unmade = {
  id: 'ending_unmade', steps: [
    { s: 'narr', t: 'Mother Cinder walks out of the Undercroft on her own feet, the brand burned out of her heart, and kneels in front of every one of her former children — and asks them, one by one, to forgive her.' },
    { s: 'narr', t: 'Not all of them do. Enough of them do.' },
    { s: 'vesper', t: '(watching her old teacher weep) I never thought I\'d want to see that. I don\'t know what I want now. Except — (she takes your hand) — this.' },
    { s: 'codex', t: '[ SECRET ENDING — THE COVEN UNMADE. Nobody had ever thought to try that. ]' },
  ],
};

// ------------------------------------------------------------
// CAMP BANTER & RIFT EVENTS
// ------------------------------------------------------------

export const CAMP_BANTER = [
  { steps: [
    { s: 'vesper', t: 'Rate the rift. Ten is "glorious, the Codex will sing of it," one is "Rue\'s cooking."' },
    { s: 'rue', cond: S => has(S, 'rue'), t: 'My cooking is TRANSCENDENT. It transcends edibility. That\'s a feature.' },
    { choice: [
      { t: '"Seven. Nobody died and the Codex only predicted one thing."', bond: { vesper: 1 }, r: [{ s: 'vesper', t: 'It predicted two. I hid the second one. You don\'t want to know.' }] },
      { t: '"Six. It would\'ve been nine with edible food."', r: [{ s: 'rue', cond: S => has(S, 'rue'), t: '(gasping) BETRAYAL.' }] },
    ] },
  ] },
  { steps: [
    { s: 'isolde', cond: S => has(S, 'isolde'), t: '(sharpening a sword that is already sharp) Rue stole my whetstone.' },
    { s: 'rue', cond: S => has(S, 'rue'), t: 'I BORROWED it. Permanently. That\'s different.', brand: true },
    { s: 'narr', t: 'The brand flares. Isolde does not even look up.' },
    { s: 'isolde', cond: S => has(S, 'isolde'), t: '...Exhausting.' },
  ] },
  { steps: [
    { s: 'narr', t: 'Vesper turns a card for the night. The Star. She smiles at it, and then at you, and then puts it away very quickly.' },
    { s: 'vesper', t: 'Nothing. It\'s nothing. It\'s a good card. Go to sleep.' },
  ] },
  { steps: [
    { s: 'narr', t: 'A crow lands on the campfire log, looks at each of you in turn, and leaves without delivering anything. Vesper takes this personally.' },
    { s: 'vesper', t: 'They\'re gossiping about us. They do that. I can tell.' },
  ] },
];

// Choice effects: xp/gold multipliers, hpPct/mpPct, item, gp (infamy),
// reagent:'id', corruption:n, buff:'mag'
export const DUNGEON_EVENTS = [
  { t: 'A pact, written on the wall in ink still wet. Someone traded something here very recently. The words are still warm.',
    choices: [
      { t: 'Read it aloud (it costs a little of you)', effect: { xp: 1.0, hpPct: -0.12 }, log: 'The pact burns your throat on the way out. You understand something new, and it hurts.' },
      { t: 'Leave it unread', effect: {}, log: 'Some pacts are better left unspoken.' },
    ] },
  { t: 'An abandoned Coven waystation. A locked chest under a collapsed awning.',
    choices: [
      { t: 'Force the lock', effect: { gold: 1.0, item: 'potion' }, log: 'Coin, a potion, and a note: "If found, return to Mother." You do not.' },
      { t: 'Leave it for Vesper to catalogue', effect: { gp: 10 }, log: 'You mark the site. The Codex notes your restraint. Infamy grows anyway.' },
    ] },
  { t: 'A wounded Coven acolyte, half-conscious, brand guttering. They see your mark and try to crawl away.',
    choices: [
      { t: 'Give them a potion and point them toward the surface', effect: { item: '-potion', gp: 15 }, log: 'They stare at you like you are a story they were told was impossible. Word will spread.' },
      { t: 'Leave them', effect: {}, log: 'The brand will finish what the rift started.' },
      { t: 'End it', effect: { corruption: 2, xp: 0.4 }, log: 'Quick. Quiet. The mark on your wrist is warmer afterward. (+2 Corruption)' },
    ] },
  { t: 'A mire-pool, glowing faintly. Something with scales moves beneath it.',
    choices: [
      { t: 'Reach in', effect: { reagent: 'drake_scale', hpPct: -0.08 }, log: 'Teeth, briefly. And a shed scale, worth the blood.' },
      { t: 'Move on', effect: {}, log: 'It watches you go.' },
    ] },
  { t: 'A shrine to some forgotten Keeper, candles still burning after centuries. Vesper stops in front of it and says nothing for a while.',
    choices: [
      { t: 'Let her pray', effect: { mpPct: 0.25 }, log: 'She doesn\'t pray. She just stands there. Afterward, everyone breathes easier.' },
      { t: 'Light another candle', effect: { buff: 'mag', gp: 5 }, log: 'The flame leans toward you. The party feels Fired Up for the next fight.' },
    ] },
];

// The Devil's rifts add bargains to the pool.
export const BARGAIN_EVENTS = [
  { t: 'A grinning stall-keeper with too many teeth offers you a deal: "Your blood, a little. My coin, a lot."',
    choices: [
      { t: 'Bleed for it', effect: { hpPct: -0.2, gold: 2.0 }, log: 'He takes exactly as much as he said. Demons are honest about the fine print. Mostly.' },
      { t: 'Decline', effect: {}, log: '"Next time," he says, and you know he means it.' },
    ] },
  { t: 'A demon broker offers a vial of something black and bubbling. "Strength, darling. For just a sliver of soul."',
    choices: [
      { t: 'Drink', effect: { corruption: 3, buff: 'mag', xp: 0.5 }, log: 'It tastes like a promise you\'ll regret. The party surges with borrowed fire. (+3 Corruption)' },
      { t: 'Smash it', effect: { gp: 8 }, log: 'The broker hisses. Rue, if she were here, would be applauding.' },
    ] },
  { t: 'A stall selling true names, laid out in jars like pickled things. One of them is labelled RUE — NOT FOR SALE.',
    choices: [
      { t: 'Ask about it', effect: { gp: 10 }, log: '"Reserved," says the keeper, nervously. "For a very particular buyer." You make a note of the stall.' },
      { t: 'Leave it', effect: {}, log: 'Some things aren\'t yours to buy.' },
    ] },
];

// ------------------------------------------------------------
// RUMORS — letters by crow
// ------------------------------------------------------------

export function pickRumorEvent(S) {
  return Object.values(EVENTS)
    .filter(e => e.where === 'rumor' && !(e.once && S.seen[e.id]) && (!e.cond || e.cond(S)))
    .sort((a, b) => b.priority - a.priority)[0] || null;
}

export function rumorLine(S, n) {
  const pool = [
    'A crow brings word: the Ashen Coven has doubled the guard on the forge-rifts. Someone is worried.',
    'Market gossip: a demon in the Devil\'s rift is selling "authentic warlock toenails." They are not authentic. Probably.',
    'The Hunters\' Lodge has posted a bounty on "the drowned-quarter warlock." It is, the crow notes, insultingly low.',
    'Somebody has been leaving candles at the top of the drowned stair. Nobody knows who. Every one of them leans toward the door.',
    'The Vigil\'s border chapel rang its bells all night. Isolde says they only do that for oathbreakers.',
    'A College observer was seen taking notes outside the library. When approached, she claimed to be "bird-watching." She was looking at the crows.',
    'Rumor: Mother Cinder burned a whole ledger last week. Nobody knows what was in it. Everyone in the Coven is suddenly very polite.',
    'A child in the market claims a demon with horns bought her a sweet bun and told her to "never sign anything." The description matches Rue exactly.',
    'The Charmed Glade has been blooming out of season. The crows say it is because someone keeps getting kissed there.',
    'Someone has carved the words THE STORM IS KIND on the old Vigil watchtower. The Order has scrubbed it off three times.',
  ];
  return pool[((S.day * 7) + n) % pool.length];
}

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

export function pickGuildEvent(S) {
  return Object.values(EVENTS)
    .filter(e => e.where === 'guild' && !(e.once && S.seen[e.id]) && (!e.cond || e.cond(S)))
    .sort((a, b) => b.priority - a.priority)[0] || null;
}

export function pickCampEvent(S, rng) {
  // The Lovers' rifts: bond scenes stir at camp more readily
  const ev = Object.values(EVENTS)
    .filter(e => e.where === 'camp' && !(e.once && S.seen[e.id]) && (!e.cond || e.cond(S)))
    .sort((a, b) => b.priority - a.priority)[0];
  if (ev) return ev;
  return { id: 'banter', steps: CAMP_BANTER[Math.floor(rng() * CAMP_BANTER.length)].steps };
}

export function pickCellEvent(S, captive) {
  return Object.values(EVENTS)
    .filter(e => e.where === 'cell' && e.captive === captive.named && !(e.once && S.seen[e.id]) && (!e.cond || e.cond(S)))
    .sort((a, b) => b.priority - a.priority)[0] || null;
}

// Generic release scene for unnamed captives.
export function releaseEventFor(cap, outcome) {
  if (cap.named === 'envoy') return EVENTS.release_calla;
  if (cap.leader && LEADER_RELEASE[cap.named]) return { id: 'release_' + cap.id, steps: LEADER_RELEASE[cap.named][outcome] || LEADER_RELEASE[cap.named].leave };
  const lines = {
    join: [
      { s: 'narr', t: 'The brand on {captive}\'s skin burns down to nothing and goes out. You open the cell.' },
      { s: 'captive', t: '(standing in the open door for a long moment) ...I don\'t want to go back. Can I — is there room up there? For someone like me?' },
      { s: 'narr', t: 'There is. {captive} climbs the stair into the candlelight and does not look back.' },
    ],
    leave: [
      { s: 'narr', t: 'The brand on {captive}\'s skin burns out. You open the cell.' },
      { s: 'captive', t: 'I don\'t hate you. I don\'t trust you. (they step out) Maybe one day those will change places.' },
      { s: 'narr', t: '{captive} walks out into the dead city. Free, and owing you nothing.' },
    ],
    relapse: [
      { s: 'narr', t: 'The brand fades. You open the cell. {captive} walks out without a word.' },
      { s: 'narr', t: 'Two days later, a crow reports a new face among the Coven elites: someone who knows the Undercroft\'s layout very, very well.' },
    ],
  };
  return { id: 'release_' + cap.id, steps: lines[outcome] || lines.leave };
}

const LEADER_RELEASE = {
  cinder: {
    join: [
      { s: 'narr', t: 'The great brand over Mother Cinder\'s heart goes out like a candle pinched between two fingers. She stays kneeling for a long time after the chains fall away.' },
      { s: 'cinder', t: 'There was something underneath. (she sounds furious about it) I was so sure there wasn\'t.' },
      { s: 'cinder', t: 'I\'ll stay. Not because you won. Because she\'s up there, and I owe her a great many apologies, and I intend to make every one of them in person.' },
    ],
    leave: [
      { s: 'narr', t: 'The brand goes out. Mother Cinder stands, steadies herself on the bars, and walks out of the Undercroft without a word.' },
      { s: 'narr', t: 'Vesper finds a letter on her desk the next morning. It is four pages long. She does not read it to anyone.' },
    ],
    relapse: [
      { s: 'narr', t: 'The brand dims — and then, slowly, impossibly, rekindles. Mother Cinder smiles at you through it.' },
      { s: 'cinder', t: 'You bought my obedience, warlock. You never once earned it. (she walks out) The Coven will remember that I came back.' },
    ],
  },
  aldric: {
    join: [
      { s: 'narr', t: 'Aldric stands when the chains fall. He bows — to you, and then, deeper, to Isolde.' },
      { s: 'aldric', t: 'I swore to the stars once. (he holds out his sword, hilt-first) Let me swear to something that answers.' },
    ],
    leave: [{ s: 'aldric', t: 'I cannot serve you. But I will not hunt you, or her, ever again. (he walks north, alone) That much I can promise.' }],
    relapse: [{ s: 'narr', t: 'Aldric leaves without a word. Within the week, the Vigil\'s bells are ringing again on the north road.' }],
  },
  proprietor: {
    join: [{ s: 'captive', t: '(examining the open door) No contract? No terms? (a long pause, and then a smile with only a reasonable number of teeth) ...How refreshing. I accept.' }],
    leave: [{ s: 'captive', t: 'A pleasure doing business. (they bow) I\'ll be in touch. Everyone always is.' }],
    relapse: [{ s: 'narr', t: 'The Proprietor walks out humming. By morning, three new stalls are open in the Bazaar under a familiar velvet sign.' }],
  },
  hale: {
    join: [{ s: 'captive', t: '(looking at the plinth, then at you) Never had a hunt end like this. (he holds out a hand) Fine. Show me what a warlock hunts.' }],
    leave: [{ s: 'captive', t: 'I\'m done hunting. You, anything. (he takes the plaque off the plinth on his way out) Keeping this, though.' }],
    relapse: [{ s: 'narr', t: 'Hale walks out a free man. Two days later, the Lodge reopens under new management. His.' }],
  },
};

// Ending: highest bond × corruption band. The secret ending wins if
// Mother Cinder was captured and reclaimed.
export function endingFor(S) {
  if (S.flags && S.flags.cinder_reclaimed) return EVENTS.ending_unmade;
  const c = S.corruption || 0;
  const maxed = Object.entries(S.bond || {}).filter(([id, v]) => v >= 10 && has(S, id)).map(([id]) => id);
  if (c >= 80) return maxed.includes('vesper') ? EVENTS.ending_codex_keeps : EVENTS.ending_ascended;
  if (c >= 30) return maxed.length ? EVENTS.ending_damned : EVENTS.ending_long_night;
  return EVENTS.ending_redeemed;
}

// ------------------------------------------------------------
// Load-time intimacy check: any event with a spice line must be
// gated by free(...) so it can't fire while its character is a captive.
// ------------------------------------------------------------

function stepsHaveSpice(steps) {
  for (const st of steps || []) {
    if (st.spice) return true;
    if (st.choice) for (const c of st.choice) if (stepsHaveSpice(c.r)) return true;
  }
  return false;
}
export function checkIntimacyGates() {
  const bad = [];
  for (const ev of Object.values(EVENTS)) {
    const gated = ev.cond && ((ev.cond.__allies && ev.cond.__allies.length) || ev.cond.__tribe);
    if (stepsHaveSpice(ev.steps) && !gated) bad.push(ev.id);
    if (ev.where === 'cell' && stepsHaveSpice(ev.steps)) bad.push(ev.id + ' (cell scene)');
  }
  if (bad.length) console.warn('[Binding Codex] Events with spice lines lack an allies-only cond:', bad);
  return bad;
}
