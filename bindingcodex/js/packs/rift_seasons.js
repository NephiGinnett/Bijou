// ============================================================
// Larkspur Lane — the seasons. The fen keeps its own calendar now:
// ten days a season, spring first. Each season the Wives' Circle
// ("wives optional," per Victoria's bylaws) throws a holiday party
// on the Lane, and every woman Zoe is close to has a holiday of her
// own to spend with her. Everyone here is a free adult who chooses
// it; Victoria's and Joanne's husbands know and approve; Celeste's
// scenes close while she's expecting or once the affair has ended.
// ============================================================

export const SEASON_LEN = 10;
export const FEST_FROM = 5; // the festival runs from the 5th day of the season to its end
export const SEASONS = [
  { id: 'spring', name: 'Spring', icon: '🌸', fest: 'lane_may_day', festName: 'May Day in the fen' },
  { id: 'summer', name: 'Summer', icon: '☀', fest: 'lane_cookout', festName: 'The Midsummer Cookout' },
  { id: 'autumn', name: 'Autumn', icon: '🍂', fest: 'lane_hallows', festName: 'The Hallows costume party' },
  { id: 'winter', name: 'Winter', icon: '❄', fest: 'lane_yule', festName: 'The ugly-sweater Yule party' },
];
export function seasonOf(S) {
  const n = Math.floor(Math.max(0, (S.day || 1) - 1) / SEASON_LEN);
  const dayIn = (Math.max(1, S.day || 1) - 1) % SEASON_LEN + 1;
  return { ...SEASONS[n % 4], year: Math.floor(n / 4) + 1, dayIn, festOn: dayIn >= FEST_FROM, festIn: Math.max(0, FEST_FROM - dayIn) };
}

// h: helpers from rift.js — { FOLK, folkOf, addFavor, fav, townFree }
export function seasonEvents(E, h) {
  const { FOLK, addFavor, fav, townFree } = h;
  const LANE = ['victoria', 'joanne', 'diane', 'margot', 'moira', 'celeste'];
  const celesteOpen = S => !(S.flags.celeste_ended || (S.expecting && S.expecting.celeste != null));
  const close = (S, id) => !!(S.seen && S.seen[`${id}_romance`]) && fav(S, id) >= 8 && (id !== 'celeste' || celesteOpen(S));
  // at a party, Celeste can only join the after-party once she's left Brad
  const partyClose = (S, id) => close(S, id) && (id !== 'celeste' || !!S.flags.celeste_left);
  const guests = S => LANE.filter(id => partyClose(S, id)).length;
  // "Victoria precise, Joanne generous and Moira devout": only the women actually there
  const who = (S, m) => { const xs = LANE.filter(id => partyClose(S, id) && m[id]).map(id => m[id]); return xs.length > 1 ? xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1] : xs[0] || ''; };
  const inSeason = (S, sid) => seasonOf(S).id === sid;
  const groupGate = pred => { const fn = S => !!(S.town && S.town.open) && pred(S); fn.__tribe = 'town:group'; return fn; };
  const intimate = (stub, gentle, steamy) => [
    { s: 'narr', t: gentle, spice: 'gentle' },
    { s: 'narr', t: steamy, spice: 'steamy' },
    { s: 'narr', t: '', spice: 'unbound', stub }, // ZOE: unbound
  ];
  // The public party everyone attends, then (with two or more women close to Zoe) the after-party.
  const festival = (sid, o) => {
    E[o.id] = {
      id: o.id, where: 'town', once: true,
      cond: groupGate(S => inSeason(S, sid) && seasonOf(S).festOn),
      tags: ['group', 'holiday', 'older women', 'hotwife (husbands know and approve)'],
      steps: [
        ...o.open.map(([s, t, cond]) => ({ s, t, ...(cond ? { cond } : {}) })),
        ...LANE.map(id => ({ s: id, t: o.toasts[id], cond: S => partyClose(S, id) && guests(S) >= 2 })),
        { do: S => { for (const id of LANE) if (id !== 'celeste' || S.flags.celeste_left || !S.flags.celeste_ended) addFavor(S, id, 1); } },
        { cond: S => guests(S) >= 2, s: 'narr', t: o.invite },
        { cond: S => guests(S) >= 2, choice: [
          { t: o.domT, tone: 'dom', r: intimate(o.id, o.domGentle, o.domSteamy) },
          { t: o.kindT, tone: 'kind', r: intimate(o.id, o.kindGentle, o.kindSteamy) },
          { t: o.sweetT, r: [{ s: 'narr', t: o.sweet }] },
        ] },
        { cond: S => guests(S) < 2, s: 'narr', t: o.publicEnd },
        { s: 'codex', t: '[ The whole Lane\'s favor +1. ]' },
        { chronicle: o.chronicle },
      ],
    };
  };
  // A woman's own holiday with Zoe, once a season.
  const solo = (sid, id, o) => {
    E[`season_${sid}_${id}`] = {
      id: `season_${sid}_${id}`, where: 'town', once: true,
      cond: townFree(id, S => inSeason(S, sid) && close(S, id)),
      tags: ['romance', 'holiday', ...(o.tags || [])],
      steps: [
        ...o.lead.map(t => (typeof t === 'string' || typeof t === 'function' ? { s: id, t } : { s: t[0], t: t[1] })),
        { choice: [
          { t: o.yesT, tone: o.yesTone || 'kind', r: [...(o.yesR ? [{ s: id, t: o.yesR }] : []), ...intimate(`season_${sid}_${id}`, o.gentle, o.steamy)] },
          { t: o.noT, r: [{ s: id, t: o.no }] },
        ] },
        { do: S => { addFavor(S, id, 1); } },
        { chronicle: o.chronicle },
      ],
    };
  };
  const celLine = (secret, left) => S => (S.flags.celeste_left ? left : secret);

  // ---------------------------------------------------------------- spring
  festival('spring', {
    id: 'lane_may_day',
    open: [
      ['narr', 'Diane has raised a maypole in the reeds at the end of the Lane: a birch trunk wound with ribbons, a crown of fen-lilies on top, and two frogs who refuse to leave it.'],
      ['victoria', '(clipboard, sunhat, a sash reading CHAIR) The Larkspur Lane Wives\' Circle calls this May Day to order. Membership is open to all residents. Wives optional. Husbands are on dessert duty.'],
      ['joanne', '(handing out strawberry shortcake by the trayful) Harold made the whipped cream. Don\'t tell him it\'s lumpy, sweetheart, he\'s very proud.'],
      ['margot', '(in a flower crown she has clearly sold six of already) Babe. Ribbon dance. You. Me. Now.'],
      ['moira', '(in white lace, for once) Every spring the Lane elects a May Queen. Every spring it\'s rigged. (a slow smile at you) This year I rigged it.'],
      ['narr', 'The vote is unanimous, Gary included. Diane sets the lily crown on your head, and the frogs applaud.'],
    ],
    toasts: {
      victoria: '(raising a paper cup) To the May Queen. By ancient custom she is owed one tribute from every member of the Circle. I wrote the custom this morning.',
      joanne: 'And it\'s a very old custom, honey. At least six hours.',
      diane: '(winding a ribbon round your wrist and keeping hold of the end) The custom says the Queen gets led somewhere private. I checked. I wrote that part.',
      margot: 'Tribute! Tribute! Tribute!',
      moira: '(lighting a white candle off the black one) The Queen chooses where she\'s worshipped, dear. Choose well.',
      celeste: '(barefoot in the grass, no ring, laughing) Fifteen Mays I watched someone else get crowned. I\'m paying tribute this year. Enthusiastically.',
    },
    invite: 'When the shortcake is gone and the husbands are doing the dishes, the Circle closes ranks around their Queen and waits, ribbons in hand.',
    domT: '"Then your Queen will take her tribute. All of it."',
    domGentle: 'They pay it one by one in Victoria\'s sunroom with the ribbons still trailing, and by the time the lily crown slips off your head nobody remembers whose turn it was.',
    domSteamy: S => `Every woman of the Circle kneels to pay her tribute in turn, and you take each one exactly as she offers it: ${who(S, { victoria: 'Victoria precise', joanne: 'Joanne generous', diane: 'Diane bendy and giggling', margot: 'Margot loud', moira: 'Moira slow and devout', celeste: 'Celeste on her toes like it\'s a curtain call' })}, until the sunroom is a tangle of ribbons and flower crowns and very satisfied subjects.`,
    kindT: '"A Queen worships her people first."',
    kindGentle: 'You turn the custom upside down and pay tribute to each of them, slow and sweet among the ribbons, until every member of the Circle has been crowned at least once.',
    kindSteamy: 'You take your time with every one of them, in the grass behind the maypole and then in the sunroom, until the whole Circle is flushed and boneless and loudly agreeing that the custom should be amended permanently.',
    sweetT: '"The Queen would like another slice of shortcake."',
    sweet: 'You get three. The Circle sits in the grass until the stars come out, braiding ribbons into each other\'s hair, and Victoria makes a motion to do this every year. It carries.',
    publicEnd: 'You dance the ribbons until the maypole is a braid, eat more shortcake than is wise, and walk home with the lily crown still on, a little crooked.',
    chronicle: 'May Day on the Lane. The Wives\' Circle crowned you May Queen.',
  });
  solo('spring', 'victoria', {
    lead: ['(in the Ledger House, sleeves rolled, every drawer pulled out) Spring cleaning. I\'m auditing the supply closet. It\'s a mess. I\'m a mess. Harold suggested I "take a break with Zoe." He winked. Harold doesn\'t wink.',
      '(she shuts the closet door behind you both, and it\'s a very small closet) There. Now it\'s organized.'],
    yesT: 'Pin her to the shelves and file her properly.', yesTone: 'dom',
    gentle: 'Ledgers tumble, a box of paperclips goes everywhere, and Victoria laughs, breathless, the most disorganized she\'s been in twenty-two years.',
    steamy: 'You sort Victoria the way she sorts everything: thoroughly, by category, until the supply closet shelves are shaking and she\'s gasping instructions she can\'t finish.',
    noT: '"Let me help you clean it instead."',
    no: '(blinking) ...You alphabetize? (a long, dazzled pause) Marry me. Kidding. Harold would want visitation.',
    chronicle: 'Spring cleaning at the Ledger House. The supply closet has never been the same.',
  });
  solo('spring', 'joanne', {
    lead: ['(a basket on each arm, out in Diane\'s strawberry beds) First berries of spring, sweetheart. Gary\'s at the guard tower, so I\'m picking for two and you\'re helping.',
      '(she feeds you one, and her thumb stays on your lip) ...Oh my. That\'s a ripe one.'],
    yesT: 'Kiss the juice off her fingers.', yesR: '(a breathless giggle) Not in the strawberries! ...Well. Behind the strawberries.',
    gentle: 'Behind the berry canes, sticky and laughing, with the basket tipped over and neither of you caring about the berries at all.',
    steamy: 'Joanne in the warm spring dirt with her dress rucked up and strawberry stains everywhere, soft and greedy and laughing your name, until she has to admit the shortcake will be late.',
    noT: '"Teach me your shortcake."',
    no: '(beaming) Oh, honey. Flour, butter, and nobody rushing. That\'s the secret to most things. (she bumps your hip) Most things.',
    chronicle: 'Strawberry picking with Joanne. The shortcake was late.',
  });
  solo('spring', 'diane', {
    lead: ['(at dawn in the greenhouse, barefoot in fresh-turned soil) First planting of the year. Every seed you put in the ground in spring is a promise. I like to make them with somebody.',
      '(she presses a seed into your palm and closes your fingers over it) Plant it with me. Then stay.'],
    yesT: 'Stay, in the warm earth with her.',
    gentle: 'You plant the seed together, and then the greenhouse is warm and green and she pulls you down onto the moss bed she swears she grew for exactly this.',
    steamy: 'Diane, bare and earth-smudged and impossibly limber on the warm moss, folding herself around you as the vines draw the leaves closed, a spring rite she insists is very ancient and definitely did not just make up.',
    noT: '"Just plant with me."',
    no: '(kneeling beside you, shoulder to shoulder) That\'s the nicest thing anyone\'s ever said to me in a greenhouse. (she pats the soil flat) There. Now we have to come back and see what grows.',
    chronicle: 'You and Diane planted the first seeds of spring.',
  });
  solo('spring', 'margot', {
    lead: ['(her stall is a yard sale today: lamps, a canoe, and two wedding dresses on a rack) Spring cleaning, babe. Out with the exes. Dress one, Rick. Dress two, Dennis. Both barely worn, much like the marriages.',
      '(she holds one up against herself) Should I try it on? For the listing. For a photo. For you.'],
    yesT: '"Try it on. Then let me take it off."', yesTone: 'dom', yesR: '(slowly) Oh, I am pricing this one so high.',
    gentle: 'The dress lasts about four minutes, which Margot declares is longer than marriage number two, and she laughs the whole way to the stockroom.',
    steamy: 'Ivory satin on hot-pink nails, and then very much off, Margot on the stockroom floor in the veil and nothing else, telling you this is the best use either dress has ever had.',
    noT: '"Sell them both. Buy something you actually want."',
    no: '(a long look, softer than usual) ...Yeah. Yeah, I will. (she marks both at a price that would make a dragon weep) Something pink.',
    chronicle: 'Margot sold her wedding dresses. One of them got a better ending first.',
  });
  solo('spring', 'moira', {
    lead: ['(in white, by a white candle, an egg balanced on its end on the counter) The spring equinox, dear. Light and dark in balance, for one night. It\'s the only night I wear white.',
      '(the egg doesn\'t fall; she watches you, not it) Balance is a kind of tension. I find I\'d like to break some.'],
    yesT: 'Blow out the white candle.', yesTone: 'dom',
    gentle: 'In the dark the egg finally falls, and neither of you notices, and Moira\'s laugh is the warmest thing in the shop.',
    steamy: 'You tip the balance and keep tipping it, Moira in white lace on her black velvet bed, slow and certain and then not certain of anything at all.',
    noT: '"Teach me to balance the egg."',
    no: '(a delighted, private smile) Patience, dear. Steady hands. You have both. (the egg stands on its end in your palm) There. Now you know a secret.',
    chronicle: 'The spring equinox with Moira. She wore white.',
  });
  solo('spring', 'celeste', {
    lead: [celLine('(in tennis whites, spinning a racket) Spring doubles tournament. Brad signed us up as a couple. Then he had a call. (she tosses you his racket) You\'re Brad now. Win me something.',
      '(in tennis whites, spinning a racket) Spring doubles tournament. I signed us up. Under my name. Just mine. (she tosses you a racket) Win me something.'),
    '(after you\'ve won, flushed and glowing in the pool house) We beat a goblin and a troll. I haven\'t won anything in fifteen years. I want to celebrate. I want to celebrate right now.'],
    yesT: 'Lock the pool-house door.',
    gentle: 'Sweaty tennis whites on the pool-house floor and Celeste laughing into your neck, every inch a winner.',
    steamy: 'She\'s still a dancer under the whites: strong and bendy and gloriously loud now that she\'s won something, celebrating against the pool-house wall until the trophy falls off the bench.',
    noT: '"Let\'s get the trophy engraved."',
    no: '(hugging the little tin cup) Celeste and Zoe. Mixed doubles champions. (a beat) I\'m putting it on the mantel. Right in the middle.',
    chronicle: 'You and Celeste won the spring doubles. She celebrated.',
  });

  // ---------------------------------------------------------------- summer
  festival('summer', {
    id: 'lane_cookout',
    open: [
      ['narr', 'Midsummer on the Lane: a grill smoking at every mailbox, sprinklers ticking across the lawns, and Margot\'s inflatable flamingo pool floating in a warm, suspiciously clean pond in the fen.'],
      ['narr', 'Harold and Gary run the grill in matching aprons that read HE WHO GRILLS. They have burned four things already and are very happy.'],
      ['victoria', '(in a white one-piece, sunglasses, the clipboard waterproofed) The Wives\' Circle midsummer cookout is now in session. Rule one: sunscreen. Rule two: there are no other rules. Harold, the burgers.'],
      ['diane', '(up to her knees in the pond) The water lilies glow after dark here. Glow. I\'ve been saving it for tonight.'],
      ['moira', '(under a black parasol, in black, in July) I despise summer. I\'ve hexed the fireworks. They\'ll be beautiful.'],
      ['narr', 'At dusk Moira\'s fireworks go up in violet and silver over the fen, and the whole Lane goes quiet, even the frogs.'],
    ],
    toasts: {
      victoria: '(sunglasses pushed up, very deliberately) Harold has volunteered to take the night watch. He winked again. He\'s getting good at it.',
      joanne: '(fanning herself, cheeks pink) Gary\'s going with him. I packed them sandwiches, sweetheart. Lots of sandwiches. It\'s a long night.',
      diane: 'The lilies are glowing, Zoe. Come and see. Come and swim.',
      margot: '(already untying her bikini top) Pool party\'s moving to the pond, babe. Dress code\'s optional. Then mandatory. Then none.',
      moira: '(closing her parasol at last) It\'s finally dark. I\'ll come in the water. For you. Only for you.',
      celeste: '(walking straight into the pond in her sundress) No Brad, no ring, no reason to stay dry.',
    },
    invite: 'The husbands march off to the watch-tower with their sandwiches. The lilies light up under the water, and the Circle wades out into the warm dark, one by one, looking back at you.',
    domT: '"Everyone into the water. Now."',
    domGentle: 'A midnight swim that stops being a swim almost at once, glowing lilies and warm water and laughter carrying all the way to the watch-tower, where two men pretend not to hear it.',
    domSteamy: 'Bare in the glowing pond, every woman of the Circle taking her turn in your arms in the warm water and on the soft bank, slick and laughing and loud, until the lilies have seen things no lily should and Moira declares summer, for once, tolerable.',
    kindT: 'Wade out slowly and kiss each of them under the fireworks.',
    kindGentle: 'One kiss each under the last of the violet fireworks, and then the water is warm and the night is long and nobody goes home dry.',
    kindSteamy: 'You go from one to the next in the glowing water, unhurried, until the whole Circle is floating and tangled and sighing on the warm bank, and the fen hums along with them.',
    sweetT: '"Cannonball!"',
    sweet: 'You cannonball into the pond. Margot screams, Joanne laughs so hard she has to sit down, and the whole Circle ends up in the water in their clothes, splashing each other under the fireworks until midnight.',
    publicEnd: 'You eat two burgers of mysterious doneness, watch Moira\'s fireworks with your feet in the glowing pond, and get sprayed by three different sprinklers on the way home.',
    chronicle: 'The midsummer cookout on the Lane. The lilies glowed. So did everyone else.',
  });
  solo('summer', 'victoria', {
    lead: ['(the Lane\'s community pool, after hours: a whistle, a red one-piece, a lifeguard chair she had built to regulation) I appointed myself lifeguard. Somebody has to enforce the rules. No running. No diving. No fun.',
      '(she comes down the ladder, slowly) Harold asked me to "bring the whistle home." He\'s getting very creative. (she blows it once, softly) You. Out of the water. That\'s an order.'],
    yesT: '"Make me."', yesTone: 'dom', yesR: '(the whistle drops) Oh, you\'ve done it now.',
    gentle: 'She pulls you out of the water and onto the warm tiles, and it turns out the lifeguard breaks every single rule.',
    steamy: 'The red one-piece goes into the deep end, and Victoria enforces the rules very strictly and very personally on the lifeguard chair, every infraction punished at length.',
    noT: '"Race you to the deep end."',
    no: '(a beat, then she dives, perfectly, against her own rule) I swam for Princeton. (surfacing, smug) You never stood a chance.',
    chronicle: 'Victoria was lifeguard at the Lane pool. She broke every rule.',
  });
  solo('summer', 'joanne', {
    lead: ['(on the inn porch in a heat wave, fanning herself with a menu, a pitcher of lemonade sweating beside her) Too hot to cook, sweetheart. Too hot to move. Gary\'s sleeping in the root cellar.',
      '(she holds the cold glass against her throat and looks at you a long time) ...I could do with a cold shower. I could do with company in it.'],
    yesT: 'Take her hand and the lemonade.',
    gentle: 'The inn\'s old shower is barely big enough for one, which Joanne points out is "the whole idea, honey," and the heat wave stops mattering.',
    steamy: 'Cold water and warm curves, Joanne laughing and gasping in the tiny shower, slippery and soft and shameless, the lemonade forgotten on the sink.',
    noT: '"Then let\'s just sit with our feet in the cold spring."',
    no: '(sighing happily, skirts hitched, toes in the water) Thirty years married and nobody ever took me to sit in a creek. (she leans on your shoulder) Don\'t go anywhere.',
    chronicle: 'A heat wave at the Kettle & Crown. Joanne needed a cold shower.',
  });
  solo('summer', 'diane', {
    lead: ['(on the greenhouse roof at sunrise, the longest day of the year) Sun salutation. Midsummer\'s the one day I do it properly. Skyclad.',
      '(she unbuttons the sage cardigan without a trace of embarrassment) Old yoga term. Means nothing on. Join me. Your shoulders are up around your ears again.'],
    yesT: 'Join her, skyclad.',
    gentle: 'You manage three salutations before she starts laughing and adjusting your pose with her hands, and the adjusting becomes something else among the sunflowers.',
    steamy: 'Diane in the midsummer sun, bare and golden and bending in ways that should not be possible, pulling you down into the sunflowers for a practice she promises is extremely spiritual.',
    noT: '"I\'ll keep my clothes on and hold the mat."',
    no: '(laughing, upside down) Coward. Hold it steady, then. (a long, bendy pause) Well? Do my shoulders look relaxed?',
    chronicle: 'Midsummer sunrise with Diane, on the greenhouse roof.',
  });
  solo('summer', 'margot', {
    lead: ['(in a hammock between two cypress trees, in a hot-pink bikini that is mostly strings) This? Business decision, babe. Foot traffic\'s up forty percent.',
      '(she swings one leg, lazily) Hammock holds two. I tested it. I tested it a lot. Get in.'],
    yesT: 'Get in.',
    gentle: 'The hammock tips you both out twice, and Margot laughs so hard she can\'t breathe, and the third time it holds.',
    steamy: 'It is not, technically, rated for this. Margot doesn\'t care. Strings undone, hoops jangling, the hammock swinging wildly over the fen and Margot loudly informing the entire Lane how good the business decision is going.',
    noT: '"I\'ll just push."',
    no: '(swinging, eyes closed, delighted) Higher. Higher! (a pause) This is the most relaxed I\'ve been since divorce number one. Don\'t tell Rick.',
    chronicle: 'A summer afternoon in Margot\'s hammock.',
  });
  solo('summer', 'moira', {
    lead: ['(in the cellar under the Black Candle, cool as a crypt, a hundred candles lit) The shortest night of the year. I loathe it. Too much light, not enough mystery.',
      '(she takes your hand and draws you down the last step) So I\'m making it as long as I can. Down here, dear, it\'s whatever hour I say.'],
    yesT: '"Then make it last until morning."',
    gentle: 'In the cool cellar the shortest night lasts a very long time, and Moira keeps one hand in yours the whole of it.',
    steamy: 'Black silk in the cool dark, Moira slow and deliberate, stretching the shortest night out candle by candle until you\'ve both lost count of the hours and neither of you wants them back.',
    noT: '"Tell me ghost stories till sunrise."',
    no: '(settling beside you, delighted) Oh, I know some true ones. (she lowers her voice) The house at number four used to be a funeral parlor. That\'s why Harold\'s tomatoes grow so well.',
    chronicle: 'The shortest night of the year, in Moira\'s cellar. She made it last.',
  });
  solo('summer', 'celeste', {
    lead: [celLine('(in a white bikini by Brad\'s pool, where he\'s hosting goblin clients) Brad\'s pool party. Networking. He\'s explaining escrow to a hobgoblin. (she slides off her sunglasses) The pool house has a lock.',
      '(on the Codex roof in a white bikini, a jug of iced tea, nobody on any call) Our first summer. No pool party. No clients. (she pats the blanket) Just roof, and sun, and you.'),
    celLine('Twenty minutes. He won\'t notice. He never notices.', 'All afternoon. All of it. Come here.')],
    yesT: 'Go with her.',
    gentle: 'Sun-warm skin and a stolen afternoon, and Celeste laughing low against your mouth like she still can\'t believe she gets to have this.',
    steamy: 'Celeste in a white bikini, then not, quick and wicked and shameless, her hand over her own mouth or not bothering, the summer heat making everything slow and sticky and very, very good.',
    noT: '"Let\'s just lie in the sun."',
    no: '(stretching out beside you, fingers laced with yours) Fifteen summers I spent being decorative at parties. (she closes her eyes, smiling) This is so much better.',
    chronicle: 'A summer afternoon with Celeste.',
  });

  // ---------------------------------------------------------------- autumn
  festival('autumn', {
    id: 'lane_hallows',
    open: [
      ['narr', 'Hallows on the Lane is Moira\'s holiday and everyone knows it. Every porch has a carved fen-gourd. The Black Candle is wrapped in cobwebs, some of them real, all of them invited.'],
      ['moira', '(at her door, in her usual black lace) Costume? Dear. I came as myself. I\'ve been dressing for tonight for thirty years.'],
      ['victoria', '(as a vampire countess, cape, fangs, pearls) The Wives\' Circle Hallows party is in session. Costumes are mandatory. Harold came as an accountant. He insists it\'s scary.'],
      ['joanne', '(as a saloon girl, very pink, very corseted) Don\'t look at me like that, honey, I\'ll drop the punch.'],
      ['diane', '(as a dryad: body paint, strategic leaves, and frankly very little else) It\'s historically accurate.'],
      ['margot', '(as "a very expensive cat": ears, a tail, a diamond collar, attitude) Meow, babe. That\'s all you get. That\'s all anyone gets.'],
      ['celeste', '(as a black swan, feathers and tulle, on her toes) I haven\'t been en pointe in fifteen years. (she spins) It came back.', S => !!S.flags.celeste_left],
      ['narr', 'There is bobbing for apples. There is a haunted maze Diane grew overnight. Gary gets lost in it for an hour and comes out holding a skeleton\'s hand, delighted.'],
    ],
    toasts: {
      victoria: '(baring the plastic fangs) The countess would like to propose a party game. Seven minutes in the coat closet. I\'ve drafted a rota.',
      joanne: '(fanning herself with a playing card) I\'m first on the rota, sweetheart. I checked.',
      diane: 'The leaves come off very easily. I\'m just mentioning it.',
      margot: '(trailing the tail across your wrist) Cats get bored in seven minutes. I\'m going to need fourteen.',
      moira: '(lighting a single black candle in the closet doorway) It\'s my holiday. I\'m last on the rota, so nobody rushes me.',
      celeste: '(a slow pirouette, ending in your arms) Black swans don\'t wait their turn.',
    },
    invite: 'The husbands are off trick-or-treating the knights at the watch-tower. Victoria opens the coat closet with a flourish, and the Circle looks at you over their costumes.',
    domT: '"Forget the rota. Everyone in the parlor."',
    domGentle: 'The rota is abandoned in favor of the parlor, and costumes come off one piece at a time by candlelight, and the gourds grin at all of it.',
    domSteamy: S => `${who(S, { victoria: 'Fangs', joanne: 'corset laces', diane: 'leaves', margot: 'cat ears', moira: 'black lace', celeste: 'swan feathers' })} scattered across Moira's velvet parlor, every woman of the Circle half out of her costume and wholly yours, taken in turn and together until the candles gutter${S.seen && S.seen.victoria_romance ? ' and Victoria, rota crumpled in her fist, concedes it was a better plan' : ''}.`,
    kindT: '"Seven minutes each. I\'ll keep the rota."',
    kindGentle: 'Seven minutes in the coat closet with each of them, then seven more, and nobody keeps time after the third.',
    kindSteamy: S => `One by one in the dark closet among the coats: ${who(S, { victoria: 'the countess biting', joanne: 'the saloon girl unlaced', diane: 'the dryad shedding leaves', margot: 'the cat purring', moira: 'the widow unhurried', celeste: 'the black swan breathless' })}, until the rota is meaningless and the closet is a legend on the Lane.`,
    sweetT: '"Who wants to get lost in the maze with me?"',
    sweet: 'All of them, it turns out. You spend an hour lost in Diane\'s maze, screaming at Moira\'s ghosts and laughing at Margot\'s, and find Gary at the center, still holding the skeleton\'s hand, very happy.',
    publicEnd: 'You bob for apples, lose the costume contest to Gary\'s skeleton friend, and walk home with your pockets full of Joanne\'s toffee.',
    chronicle: 'Hallows on the Lane. The Wives\' Circle came in costume.',
  });
  solo('autumn', 'victoria', {
    lead: ['(in the Ledger House, in the vampire countess costume, a week early) Fitting. I\'m checking the fit. (she adjusts the cape; the corset does not need adjusting) Harold says it\'s "very becoming." Then he left for the evening, very pointedly.',
      '(the plastic fangs click) The countess feeds at midnight. It\'s eleven fifty-eight.'],
    yesT: '"Then come and feed, Countess."',
    gentle: 'At midnight the countess bites, softly, and then she laughs and the fangs fall out and she kisses you properly.',
    steamy: 'The countess pins you to her own ledger desk and feeds at length: on your neck, your collarbone, everywhere she can reach, the cape spread over both of you and her pearls cold against your skin.',
    noT: '"You look incredible. Let me help with the cape hem."',
    no: '(a little flustered, which is rare) ...Thank you. (she lets you pin the hem) Harold said becoming. You said incredible. I\'m keeping score.',
    chronicle: 'Victoria\'s costume fitting. The countess fed at midnight.',
  });
  solo('autumn', 'joanne', {
    lead: ['(flour to the elbows, eight pies cooling in the inn window) Apple pies for the whole Lane. Gary\'s on hayride duty all night, the poor sweet thing.',
      '(she wipes flour across your nose with one finger, and leaves her hand on your cheek) You\'ve got a little something. Hold still, honey.'],
    yesT: 'Lift her onto the floury counter.',
    gentle: 'Pie number nine doesn\'t get made. There\'s flour everywhere, and Joanne laughing, and the kitchen smelling of cinnamon and warm apples.',
    steamy: 'Joanne on her own counter in a cloud of flour, apron strings undone, warm and soft and loudly delighted, the oven timer going off unheeded twice.',
    noT: '"Teach me your crust."',
    no: '(guiding your hands in the dough, warm against your back) Cold butter, light fingers, don\'t overwork it. (softly, near your ear) Just like that, sweetheart.',
    chronicle: 'Pie season at the Kettle & Crown.',
  });
  solo('autumn', 'diane', {
    lead: ['(at the mouth of a corn maze that was not here yesterday) I grew it overnight. Thirty acres. The middle\'s a secret. (she takes your hand) Want to get lost?',
      '(somewhere deep in the rustling rows, the path closes behind you) Oops. The maze likes you. It\'s not going to let us out for a while.'],
    yesT: '"Good. Show me the middle."',
    gentle: 'The middle is a little clearing of soft straw under the harvest moon, and you stay there a long time while the corn whispers around you.',
    steamy: 'Diane in the moonlit clearing at the heart of the maze, cardigan and everything else in the straw, wild and laughing and astonishingly flexible while thirty acres of corn rustle very loudly to cover the noise.',
    noT: '"Let\'s find our way out together."',
    no: '(laughing as you pick a turn) Left. No, right. (the corn shifts helpfully) Oh, you\'re good at this. It only cheats for people it likes.',
    chronicle: 'Lost in Diane\'s corn maze, on purpose.',
  });
  solo('autumn', 'margot', {
    lead: ['(outside a haunted house she built out of the old HOA office, selling tickets) Two gold a head and the line goes to the fen. Babe, I\'m a genius.',
      '(she pulls you inside, into the dark) Come on, I\'ll give you the tour. (something shrieks; she jumps into your arms) That was planned. I planned that. Don\'t let go.'],
    yesT: 'Don\'t let go.',
    gentle: 'In the coffin room, it turns out the coffin is very roomy, and Margot stops being scared almost immediately.',
    steamy: 'Margot in the dark of her own haunted house, pressed against a fake crypt with the line outside screaming at the animatronics, louder than any of them and not remotely scared anymore.',
    noT: '"Let\'s scare the next group."',
    no: '(gleeful, pulling a sheet over both your heads) Oh, you\'re my favorite person. (a goblin family enters; you both moan) ...We should charge extra for this.',
    chronicle: 'Margot\'s haunted house. She jumped into your arms. On purpose.',
  });
  solo('autumn', 'moira', {
    lead: ['(Samhain night: one candle in the window for every soul she remembers, and one black one) The veil is thin tonight, dear. The dead come close. I like to be with the living when they do.',
      '(she turns over a single card from her deck without looking; it\'s the Lovers) Well. The dead have opinions.'],
    yesT: '"Then let\'s give them something to talk about."',
    gentle: 'Among a hundred little flames for the dead, Moira holds on to the living, and the night is warm in spite of the veil.',
    steamy: 'Moira on Samhain, black lace and silver and every candle in the window flaring as you take her on the velvet before the altar, alive and laughing and absolutely unafraid of anyone watching.',
    noT: '"Tell me who the candles are for."',
    no: '(she does, one by one, the husband last, and her voice only shakes once) ...And that one\'s yours, dear. Not for the dead. Just so the dead know you\'re mine.',
    chronicle: 'Samhain with Moira. A candle burned for you among the dead.',
  });
  solo('autumn', 'celeste', {
    lead: [celLine('(in a black swan costume, in Brad\'s darkened garage, while he hands out full-size candy bars to impress the neighbors) I never get to dance for anyone anymore. Brad thinks it\'s a "phase."',
      '(in a black swan costume, in the studio she opened on the Lane, the mirrors dark) I danced for crowds for nine years. I want to dance for one person.'),
    'Sit. Watch. Don\'t touch until the music stops.'],
    yesT: 'Watch her dance, then don\'t wait for the music.',
    gentle: 'She dances, and she\'s breathtaking, and before the last note she\'s in your lap and the feathers are everywhere.',
    steamy: 'Black swan, black feathers, every move a promise, and then the costume coming off in pieces until she\'s dancing on you instead, strong and flexible and dizzy with it.',
    noT: 'Watch every step, and applaud.',
    no: '(breathless, curtseying, eyes wet) Nobody\'s clapped for me in fifteen years. (she laughs) Do it again. Louder.',
    chronicle: 'Celeste danced the black swan for you.',
  });

  // ---------------------------------------------------------------- winter
  festival('winter', {
    id: 'lane_yule',
    open: [
      ['narr', 'Snow falls on the fen for the first time anyone can remember, and Larkspur Lane goes completely overboard. Inflatable Santas. Icicle lights on the mailboxes. A wreath on the frog.'],
      ['joanne', '(at the door of the Kettle & Crown, in a sweater with a light-up reindeer) Come in, come in, out of the cold, sweetheart. Cocoa\'s hot, the fire\'s going, and everyone\'s in their ugliest.'],
      ['victoria', '(in a sweater knitted to look like a balance sheet, with a candy cane as the pen) The Wives\' Circle Yule party is in session. Secret Santa is mandatory. I drew the names. Fairly.'],
      ['margot', '(in a sweater that is mostly sequins and a single strategically placed snowman) Fairly, she says. Babe. Babe. We all drew you.'],
      ['victoria', '(not looking up) That is a statistical anomaly, and I will not be taking questions.'],
      ['narr', 'Harold and Gary lead the knights from the watch-tower in carols outside, wildly off-key. Moira\'s hexed mistletoe drifts from doorway to doorway on its own.'],
    ],
    toasts: {
      victoria: '(handing you a box wrapped with military precision) From your Secret Santa. Open it later. Privately. Harold helped me pick it. He has excellent taste.',
      joanne: '(pressing a soft parcel into your hands, blushing) I knitted it, honey. Well, I knitted most of it. There isn\'t much of it.',
      diane: 'Mine\'s a winter rose. It only blooms when it\'s held somewhere warm. You\'ll figure it out.',
      margot: '(tapping a bow stuck on her own collarbone) Mine\'s me, babe. I\'m the gift. No receipt.',
      moira: '(the mistletoe drifts to a stop directly over your head) My gift is that. You\'re welcome, dear.',
      celeste: '(in a red sweater, no ring, on her toes to kiss your cheek under the mistletoe) First Yule without Brad. Best Yule ever.',
    },
    invite: 'The carolers go off to the next mailbox. The fire crackles. Every woman of the Circle is watching you over her cocoa, wearing a sweater she very obviously does not intend to keep on.',
    domT: '"Gifts get unwrapped. Sweaters off. All of you."',
    domGentle: 'The ugly sweaters come off by the fire, one by one, and under every single one is something very much not ugly, and the mistletoe has a long night.',
    domSteamy: 'Ugly sweaters in a heap by the fire and lace and ribbon underneath, every woman of the Circle unwrapped in turn on Joanne\'s rug, warm and slow and then not slow at all, while the hexed mistletoe drifts from one to the next keeping score.',
    kindT: 'Open every gift, slowly, starting under the mistletoe.',
    kindGentle: 'You open each gift with its giver beside you, and every one of them turns out to be a kiss, and then a great deal more, by the fire until the snow stops.',
    kindSteamy: 'You unwrap them gently, one at a time, sweater and ribbon and lace, until the whole Circle is curled together in front of Joanne\'s fire, flushed and laughing and very, very warm.',
    sweetT: '"Who wants to build a snowman?"',
    sweet: 'Everyone, in their ugly sweaters. The snowman ends up with Victoria\'s pearls, Margot\'s hoops, Diane\'s sunhat and Moira\'s candle, and the knights carol to it until dawn.',
    publicEnd: 'You drink too much cocoa, lose a snowball fight to Gary, sing carols with the knights badly, and take home a box of Joanne\'s gingerbread.',
    chronicle: 'Yule on the Lane. The Wives\' Circle all drew your name.',
  });
  solo('winter', 'victoria', {
    lead: ['(by the Ledger House fire, champagne, the year\'s books closed) Year-end close. Every account reconciled. Every number in the black. (she sets down her glasses) Except one.',
      '(she unclasps her pearls and holds them out to you) Harold\'s at his brother\'s for the holiday. He sent a card. It says "Happy New Year, Vic. Tell me everything." Shall we give him something to read?'],
    yesT: 'Take the pearls, and then the rest.',
    gentle: 'Champagne by the fire, and Victoria in nothing but her pearls, laughing as the clock strikes midnight on her year.',
    steamy: 'You close Victoria\'s year for her, slow and thorough by the fire, her pearls the only thing she\'s wearing and the last thing to go, every account settled twice over before midnight.',
    noT: '"Let\'s toast the year."',
    no: '(clinking her glass to yours) To a good year. My first in a long time where I liked who I was. (softly) You had something to do with that.',
    chronicle: 'Year-end close with Victoria. Every account settled.',
  });
  solo('winter', 'joanne', {
    lead: ['(the inn snowed in to the windowsills, one fire, one enormous quilt) We\'re snowed in, sweetheart. Gary\'s stuck at the watch-tower with the knights. He sent a raven: "Stay warm, Jo." (a pink, flustered smile) There\'s only the one quilt.'],
    yesT: 'Get under the quilt with her.',
    gentle: 'Cocoa and the crackling fire and Joanne\'s cold feet, and then nobody\'s feet are cold at all.',
    steamy: 'Under the big quilt by the fire, Joanne warm and soft and wonderfully unhurried, the snow piling up outside and neither of you in any rush to dig out.',
    noT: '"Then I\'ll keep the fire going all night."',
    no: '(tucked under the quilt, watching you feed the fire) Nobody\'s ever kept the fire going for me. (she holds up a corner) At least come and sit with me while you do it.',
    chronicle: 'Snowed in at the Kettle & Crown with Joanne.',
  });
  solo('winter', 'diane', {
    lead: ['(in the greenhouse, the only warm place in the frozen fen, roses blooming in midwinter) Winter roses. They only open when they\'re warm. (she\'s in a thin summer dress, flushed from the heat) It\'s eighty degrees in here. You\'re wearing far too much.'],
    yesT: 'Shed the coat. And the rest.',
    gentle: 'Summer in the middle of winter, the snow piling on the glass roof, and Diane\'s warm hands and laughter among the roses.',
    steamy: 'Midwinter outside and midsummer in here, sweat-damp and slow among the blooming roses, Diane bending and gasping and laughing as every rose in the greenhouse opens at once.',
    noT: '"Show me the roses."',
    no: '(cupping one in both hands so it opens for you) This one\'s yours. I named it. (a sly smile) I\'m not telling you what. You have to guess.',
    chronicle: 'Winter roses in Diane\'s greenhouse.',
  });
  solo('winter', 'margot', {
    lead: ['(collapsed on her stall counter after the after-Yule sale) I sold everything. Everything. I sold a goblin his own hat. (she sits up) Your gift. I saved it.',
      '(she ties a big pink bow around her own waist, over the robe) Ta-da. Unwrap carefully, babe. Or don\'t.'],
    yesT: 'Don\'t unwrap carefully.', yesTone: 'dom',
    gentle: 'The bow comes undone and so does Margot, laughing, on a counter piled with empty boxes.',
    steamy: 'You tear into your gift like a kid on Yule morning, and Margot is loud about how much she approves, on the counter and then the floor and then, regrettably, the display case again.',
    noT: '"I got you something too."',
    no: '(opening a little box: new hoops, hot pink) Oh. Oh, babe. (she puts them in immediately, eyes shining) Nobody gets me gifts. I\'m the one who sells them.',
    chronicle: 'Margot gift-wrapped herself for Yule.',
  });
  solo('winter', 'moira', {
    lead: ['(the longest night of the year, every candle in the Black Candle lit) The solstice. The longest dark. I keep vigil until the sun comes back. Every year, alone.',
      '(she sets a candle in your hands and closes your fingers around it) Not this year.'],
    yesT: 'Keep vigil with her, in her bed.',
    gentle: 'You keep her vigil together under the black lace, candles burning down around you, until the sun comes back and she smiles at it like an old friend.',
    steamy: 'The longest night, and Moira makes it every minute of its length, slow and deep and unhurried by candlelight, until the windows go grey and she\'s laughing softly that it was the shortest longest night she\'s ever had.',
    noT: 'Sit up with her and watch the candles.',
    no: '(at dawn, her head on your shoulder) Thirty years I sat up alone. (she blows out the black candle at the first light) Thank you, dear. I\'ll light it again tomorrow.',
    chronicle: 'The longest night, keeping vigil with Moira.',
  });
  solo('winter', 'celeste', {
    lead: [celLine('(in Brad\'s garage, under one sprig of mistletoe, next to his twelve-foot inflatable Santa) Brad\'s winning the Lane\'s holiday-lights contest. It\'s all he talks about. (she looks up at the mistletoe, then at you) He hung this. He doesn\'t know what it\'s for anymore.',
      '(in your rooms at the Codex, under mistletoe she hung herself) Our first winter. (she stands on her toes) I know exactly what this is for.')],
    yesT: 'Kiss her under the mistletoe, and don\'t stop.',
    gentle: 'Under the mistletoe and then well past it, warm and slow, the snow falling outside.',
    steamy: celLine('Up against the workbench, Brad\'s inflatable Santa bobbing and glowing over you both, Celeste stifling every sound in your shoulder and shaking with laughter and everything else.', 'Slow and warm by the fire, the mistletoe forgotten, Celeste unhurried and unafraid, every sound she makes hers to make.'),
    noT: '"Just a kiss. A long one."',
    no: '(when it ends, her forehead against yours) Happy Yule. (a shaky laugh) Best present I got.',
    chronicle: 'Mistletoe with Celeste.',
  });
}
