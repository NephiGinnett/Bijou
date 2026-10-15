// ============================================================
// BINDING CODEX — Pack 4: Through the Rift (Larkspur Lane)
// A misfired summoning drops a suburban cul-de-sac into the fen
// below the drowned library. Its people set up shop. The Lane is
// a town screen: shops, a daily talk, quests for favor, and
// investments that pay nightly dividends. Starts with five.
// Every townswoman is a free adult (ages in her description);
// none of this pack ever enters the Undercroft.
// ============================================================

import { ITEMS, REAGENTS, makeGear } from '../data.js';

const FOLK = {
  victoria: { name: 'Victoria', color: '#8aa8d8', age: 44, shop: 'The Ledger House', role: 'Quartermaster',
    desc: 'Victoria, 44, was HOA president of Larkspur Lane and CFO of something she calls "a mid-cap logistics firm." Now she runs the Lane\'s books, its counting-house and, increasingly, everyone in it. Reading glasses, a pearl strand, a clipboard she has never once put down.',
    perk: 'Every level of investment in the Ledger House raises all the Lane\'s dividends by 10%.' },
  joanne: { name: 'Joanne', color: '#d88a5a', age: 52, shop: 'The Kettle & Crown', role: 'Innkeeper',
    desc: 'Joanne, 52, hosted every block party Larkspur Lane ever had. Her kitchen landed intact, so she opened an inn in it. Auburn curls, a gingham apron, and the firm belief that nobody is too dangerous for a casserole.',
    perk: 'Supper for two: bring an ally to dinner for extra closeness, once a day.' },
  diane: { name: 'Diane', color: '#8ab87a', age: 49, shop: 'Diane\'s Garden', role: 'Herb-wife',
    desc: 'Diane, 49, was the Lane\'s master gardener, its yoga-in-the-park evangelist, and its happily unmarried woman ("I have a garden, Victoria. I don\'t need a husband."). Her greenhouse came through with her, and the fen agrees with it frighteningly well. Sun hat, sage cardigan, dirt under every nail.',
    perk: 'Potions, ethers and reagents, cheaper with favor. She\'ll buy your spare reagents too.' },
  margot: { name: 'Margot', color: '#e88ab8', age: 46, shop: 'Margot\'s Swap & Sell', role: 'Trader',
    desc: 'Margot, 46, twice divorced and proud of both, ran the Lane\'s garage sales like a hostile takeover. Now she buys and flips whatever you drag out of the rifts. Platinum blowout, hot-pink everything, hoops you could throw.',
    perk: 'Buys your spare gear for more than the Night Market does, and your brewed draughts too.' },
  moira: { name: 'Moira', color: '#a88ac8', age: 55, shop: 'The Black Candle', role: 'Hexwife',
    desc: 'Moira, 55, was the Lane\'s goth widow, the one the kids dared each other to knock on. It turns out her candles always worked; this world just admits it. Black lace, a silver streak in black curls, a voice like velvet in a crypt.',
    perk: 'Enchanted charms with a guaranteed affix, a new pair every morning.' },
};
export const TOWNSFOLK = FOLK;
export const FOLK_IDS = Object.keys(FOLK);

export const speakers = Object.fromEntries(Object.entries(FOLK).map(([id, f]) => [id, { name: f.name, color: f.color }]));

// --- looks: toon figures ---------------------------------------------------------
export const looks = {
  victoria: { toon: {
    build: 'curvy', bust: 1.1, figure: 'tall',
    colors: { skin: 0xe8c8b0, hair: 0x3a2418, main: 0x1e2a44, deep: 0x141c30, trim: 0xd8c8a0, glove: 0xe8c8b0 },
    face: { eye: 0x5a7aa8, brow: 0x2a1a10, blush: 0xe88a8a, lip: 0x8a2a3a, mouth: 'smirk', fang: false },
    top: { style: 'coat', cut: 1.08, buttons: 3, corset: false }, skirt: { style: 'long', hem: 0.42 },
    legs: { style: 'stockings', color: 0x2a2420, boots: 0x141414, bootHeight: 0.3 },
    sleeves: 'long', hair: 'short', extras: 'glasses,pearls,clipboard' } },
  joanne: { toon: {
    build: 'curvy', bust: 1.25,
    colors: { skin: 0xf0d0b8, hair: 0xa8442a, main: 0x5a7a4a, deep: 0x3a5230, trim: 0xf4ecdc, glove: 0xf0d0b8 },
    face: { eye: 0x6a8a4a, brow: 0x8a3a20, blush: 0xf09a8a, mouth: 'smile' },
    top: { style: 'corset', cut: 1.1, corset: false }, skirt: { style: 'pleated', hem: 0.48 },
    legs: { style: 'bare', boots: 0x5a3a24, bootHeight: 0.2 },
    sleeves: 'bare', hair: 'curly', extras: 'apron' } },
  diane: { toon: {
    build: 'average', bust: 1.05,
    colors: { skin: 0xd8a888, hair: 0xc8b898, main: 0x8aa87a, deep: 0x5a7a4a, trim: 0xe8dcc0, glove: 0xd8a888 },
    face: { eye: 0x7a6a4a, brow: 0x8a7a5a, blush: 0xe89a8a, mouth: 'smile' },
    top: { style: 'coat', cut: 1.0, buttons: 4, corset: false }, skirt: { style: 'long', hem: 0.2 },
    legs: { style: 'pants', color: 0x6a5a4a, boots: 0x4a3a2a, bootHeight: 0.4 },
    sleeves: 'long', hair: 'straight', extras: 'sunhat,trowel' } },
  margot: { toon: {
    build: 'curvy', bust: 1.3,
    colors: { skin: 0xf2c8a8, hair: 0xf4ecd0, main: 0xe0408a, deep: 0x1a1a1a, trim: 0xf4d04a, glove: 0xf2c8a8 },
    face: { eye: 0x4a8ac8, brow: 0xa89870, blush: 0xff8aa8, lip: 0xd0205a, mouth: 'smirk', shadow: 0xc84a9a, fang: false },
    top: { style: 'corset', cut: 1.18, corset: false }, skirt: { style: 'long', hem: 0.58, color: 0x1a1a1a },
    legs: { style: 'bare', boots: 0xe0408a, bootHeight: 0.55 },
    sleeves: 'bare', hair: 'long', extras: 'hoops' } },
  moira: { toon: {
    build: 'curvy', bust: 1.22, figure: 'tall',
    colors: { skin: 0xf2e6e8, hair: 0x141018, main: 0x141018, deep: 0x2a1a34, trim: 0xb8b8c8, glove: 0x141018 },
    face: { eye: 0x9a6ab8, brow: 0x141018, blush: 0xc89ab0, lip: 0x3a1028, shadow: 0x4a2a5a, lashes: 0x08060a },
    top: { style: 'corset', cut: 1.15 }, skirt: { style: 'long', hem: 0.04 },
    legs: { style: 'pants', color: 0x141018, boots: 0x141018 },
    sleeves: 'long', hair: 'curly', cape: 0x3a1a4a, extras: 'streak,candle' } },
};

// --- state helpers ---------------------------------------------------------------
export const INVEST_COST = [200, 500, 1000];
export const DIVIDEND = [0, 12, 30, 60];
const ensureTown = S => {
  S.town ||= {};
  S.town.folk ||= {};
  for (const id of FOLK_IDS) S.town.folk[id] ||= { favor: 0, talkDay: -1, level: 0, quest: 0, active: null, nightDay: -9 };
  return S.town;
};
export function townOpen(S) { return !!(S.town && S.town.open); }
export function folkOf(S, id) { return ensureTown(S).folk[id]; }
export function addFavor(S, id, n) { const f = folkOf(S, id); f.favor = Math.max(0, Math.min(10, f.favor + n)); return f.favor; }
// Daily talk: friendly up to favor 3; past that, favor comes from quests and investment.
export function townTalk(S, id) {
  const f = folkOf(S, id);
  if (f.talkDay === S.day) return null;
  f.talkDay = S.day;
  const up = f.favor < 3;
  if (up) addFavor(S, id, 1);
  return { favor: f.favor, up };
}
export function discount(S, id) { return 1 - 0.03 * folkOf(S, id).favor; }
export const priceAt = (S, id, base) => Math.max(1, Math.round(base * discount(S, id)));
export function investCost(S, id) { const l = folkOf(S, id).level; return l >= 3 ? null : INVEST_COST[l]; }
export function invest(S, id) {
  const cost = investCost(S, id);
  if (cost == null || S.gold < cost) return false;
  S.gold -= cost;
  folkOf(S, id).level++;
  addFavor(S, id, 1);
  return true;
}
export function dividends(S) {
  if (!townOpen(S)) return 0;
  const t = ensureTown(S);
  const mult = 1 + 0.1 * t.folk.victoria.level;
  return Math.round(FOLK_IDS.reduce((a, id) => a + DIVIDEND[t.folk[id].level], 0) * mult);
}

// --- shops -----------------------------------------------------------------------
// A tiny seeded rng so a day's stock is stable while you browse.
const rngFor = (S, salt) => { let x = (S.day * 9301 + salt * 49297 + 233280) % 2147483647 || 7; return () => (x = (x * 16807) % 2147483647) / 2147483647; };
const tierFor = (S, bump = 0) => Math.max(0, Math.min(5, (S.circleIdx || 0) + bump));
export function dianeStock(S) {
  const l = folkOf(S, 'diane').level;
  return ['potion', 'ether', ...(l >= 1 ? ['hi_potion'] : []), ...(l >= 2 ? ['feather'] : []), ...(l >= 3 ? ['elixir'] : [])].filter(id => ITEMS[id]);
}
// Moira's two charms and Victoria's requisitions are re-rolled each morning.
export function moiraStock(S) {
  const t = ensureTown(S);
  if (t.moiraDay !== S.day) {
    const r = rngFor(S, 7), l = folkOf(S, 'moira').level;
    t.moiraStock = [0, 1].map(() => makeGear('charm', tierFor(S, l >= 2 ? 1 : 0), r, true));
    t.moiraDay = S.day;
  }
  return t.moiraStock;
}
export function victoriaStock(S) {
  const t = ensureTown(S);
  if (t.vicDay !== S.day) {
    const r = rngFor(S, 13), l = folkOf(S, 'victoria').level;
    t.vicStock = ['weapon', 'armor', ...(l >= 1 ? ['weapon'] : [])].map(slot => makeGear(slot, tierFor(S, l >= 3 ? 1 : 0), r, l >= 2));
    t.vicDay = S.day;
  }
  return t.vicStock;
}
export const gearPrice = g => Math.round(90 * (g.tier + 1) * (g.affix ? 1.5 : 1));
// Margot pays better than the Night Market, more as her stall grows.
export const margotRate = S => 1.25 + 0.1 * folkOf(S, 'margot').level;
export const brewedSale = (S, id) => Math.round((ITEMS[id].sell || 0) * margotRate(S));
export const reagentBuy = (S, r) => priceAt(S, 'diane', REAGENTS[r].price * 1.5);
export const reagentSell = (S, r) => Math.round(REAGENTS[r].price * (0.6 + 0.1 * folkOf(S, 'diane').level));

// --- quests ----------------------------------------------------------------------
// need: { gold } pay | { gear: n } hand over from the bag | { reagents: n } any reagents
//       { items: [id, n] } | { brewed: n } any brewed draught | { clears: n } expeditions since accepted
//       { beast: true } at least one beast in the Menagerie | { ally: id }
// give: { favor, gold, items: [id, n], gear: slot }
export const QUESTS = {
  victoria: [
    { id: 'float', title: 'The Opening Float', need: { gold: 150 }, give: { favor: 2 },
      ask: "Every functioning economy begins with a float. I need a hundred and fifty in your local currency to open the Lane's ledger. You'll get a receipt. You'll get many receipts.",
      done: "(stamping something with enormous satisfaction) Receipt number one. Larkspur Lane is officially solvent. Do you know how long I've waited to say that about anything?" },
    { id: 'watch', title: 'Equip the Watch', need: { gear: 2 }, give: { favor: 2, gold: 120 },
      ask: "Gary from number nine has volunteered as the town watch. Gary is armed with a leaf blower. Bring me two pieces of real equipment. Any two. Please.",
      done: "Gary is now armed with a sword and is, if possible, worse. Still. A watch. Thank you." },
    { id: 'audit', title: 'Field Audit', need: { clears: 3 }, give: { favor: 2, gear: 'weapon' },
      ask: "I want to understand the supply chain out here, which apparently means rifts. Clear three and bring me a report. Verbal is fine. I'll take notes.",
      done: "(three full pages of notes) Fascinating. Monsters as a raw-materials sector. Here: requisitioned for you. Off the books. Don't tell me." },
  ],
  joanne: [
    { id: 'wood', title: 'Firewood That Doesn\'t Scream', need: { reagents: 3 }, give: { favor: 2, items: ['potion', 2] },
      ask: "Honey, the wood out here screams when you cut it. I am not running a kitchen on screaming wood. Bring me three of whatever you folks burn instead.",
      done: "(the stove glowing a cheerful, faintly unholy orange) Oh, that's lovely. Smells like cinnamon and a war crime. Take these for the road." },
    { id: 'sign', title: 'A Proper Sign', need: { gold: 100 }, give: { favor: 2 },
      ask: "An inn needs a sign, and Moira says the local sign-painter is a ghost who takes cash. A hundred, if you can spare it? I'll feed you forever.",
      done: "The Kettle & Crown! Look at it! The ghost did lovely lettering. A bit drippy. Very on-brand for the neighborhood." },
    { id: 'beast', title: 'Meet the Neighbors', need: { beast: true }, give: { favor: 2, items: ['elixir', 1] },
      ask: "Everyone says you keep monsters up at that library. I'd like to see one. From a safe distance. With a casserole, in case it's hungry.",
      done: "(beaming, apron askew) It ate the whole casserole and then it let me pat it! Diane says that's a record. Here, sweetheart, something strong for you." },
  ],
  diane: [
    { id: 'samples', title: 'Local Medicine', need: { items: ['potion', 2] }, give: { favor: 2, items: ['ether', 2] },
      ask: "I'd love to study how your potions actually work. They glow, Zoe. Medicine shouldn't glow. Bring me two?",
      done: "(peering at one through a jeweler's loupe) Oh, it's just botany with ambition. I can work with that. These are on me." },
    { id: 'seedbank', title: 'The Seed Bank', need: { reagents: 4 }, give: { favor: 2, items: ['hi_potion', 2] },
      ask: "The greenhouse is thriving, which is terrifying. I want to graft local stock into it. Four reagents, any kind. I'll label everything.",
      done: "Look at that graft take! The tomatoes have opinions now. Good ones, mostly." },
    { id: 'brew', title: 'Kitchen Chemistry', need: { brewed: 1 }, give: { favor: 2, gold: 150 },
      ask: "Bring me something you brewed yourself. I want to see a witch's work next to mine. Professional curiosity. And a little competitiveness.",
      done: "(sniffing it, delighted) Oh, you're good. I'm better, but you're good. Here, for your trouble." },
  ],
  margot: [
    { id: 'flip', title: 'Something to Flip', need: { gear: 1 }, give: { favor: 2, gold: 80 },
      ask: "Babe, I have a stall and nothing on it. Bring me one piece of rift junk, anything with a stat on it, and watch me sell it to a goblin for triple.",
      done: "Sold it to a very confused knight for four times what it's worth. Here's your cut. I'm a delight to do business with." },
    { id: 'shiny', title: 'Something Shiny', need: { clears: 2 }, give: { favor: 2, gear: 'armor' },
      ask: "My clients want rift-fresh. Go clear two and bring me back the good stuff. I'll know if it's not the good stuff.",
      done: "Ooh, the good stuff. This one I'm not selling. This one's for you. It matches your eyes. Everything matches your eyes, honestly." },
    { id: 'potion', title: 'A Love Potion, Allegedly', need: { brewed: 1 }, give: { favor: 2, gold: 200 },
      ask: "A client wants a love potion. I told her those aren't real. She offered two hundred. Bring me literally anything you brewed and I'll call it a love potion.",
      done: "She drank it and fell madly in love with a fence post. Refund policy says no refunds. Your cut, darling." },
  ],
  moira: [
    { id: 'wicks', title: 'Wicks and Wards', need: { reagents: 3 }, give: { favor: 2 },
      ask: "Candles want feeding, dear. Three reagents for the wax. I'll pour you something that keeps the dark polite.",
      done: "(the new candles burn with a small, approving black flame) They like you. Candles are terrible judges of character, but they like you." },
    { id: 'rival', title: 'An Introduction', need: { ally: 'vesper', gold: 100 }, give: { favor: 2 },
      ask: "I hear you keep a witch. A proper one, with a grimoire. I'd like to meet her. Bring her down, and a hundred for the good tea.",
      done: "(Vesper and Moira have spent two hours arguing about candle-wax and are now plainly best friends) She's sharp. Keep her. She says the same about me, which is correct." },
    { id: 'dark', title: 'The Dark of a Rift', need: { clears: 2 }, give: { favor: 2, gear: 'charm' },
      ask: "I want to know what the dark tastes like where you go. Clear two rifts and come back with it on your coat. I'll know.",
      done: "(breathing in, eyes closed) Mm. Old stone and older hunger. Lovely. Here: I wove a little of it into this for you." },
  ],
};
export function questOf(S, id) { const f = folkOf(S, id); return QUESTS[id][f.quest] || null; }
export function acceptQuest(S, id) { const f = folkOf(S, id); f.active = { started: S.day, clears: S.stats.clears || 0 }; }
// Whether the active quest can be turned in right now, and a progress line.
export function questReady(S, id) {
  const f = folkOf(S, id), q = questOf(S, id);
  if (!q || !f.active) return { ok: false, note: '' };
  const n = q.need;
  const reagentTotal = Object.values(S.reagents || {}).reduce((a, b) => a + b, 0);
  const brewed = Object.entries(S.inventory || {}).filter(([k, v]) => v > 0 && ITEMS[k] && ITEMS[k].brewed).reduce((a, [, v]) => a + v, 0);
  const checks = [];
  if (n.gold) checks.push([S.gold >= n.gold, `${n.gold}g`]);
  if (n.gear) checks.push([S.gearBag.length >= n.gear, `${Math.min(S.gearBag.length, n.gear)}/${n.gear} gear in your bag`]);
  if (n.reagents) checks.push([reagentTotal >= n.reagents, `${Math.min(reagentTotal, n.reagents)}/${n.reagents} reagents`]);
  if (n.items) checks.push([(S.inventory[n.items[0]] || 0) >= n.items[1], `${Math.min(S.inventory[n.items[0]] || 0, n.items[1])}/${n.items[1]} ${ITEMS[n.items[0]].name}`]);
  if (n.brewed) checks.push([brewed >= n.brewed, `${Math.min(brewed, n.brewed)}/${n.brewed} brewed draught`]);
  if (n.clears) { const d = (S.stats.clears || 0) - f.active.clears; checks.push([d >= n.clears, `${Math.min(d, n.clears)}/${n.clears} expeditions cleared`]); }
  if (n.beast) checks.push([(S.menagerie || []).length > 0, 'a beast in your Menagerie']);
  if (n.ally) checks.push([(S.allies || []).includes(n.ally), `${n.ally[0].toUpperCase() + n.ally.slice(1)} with you`]);
  return { ok: checks.every(c => c[0]), note: checks.map(c => (c[0] ? '✓ ' : '· ') + c[1]).join('  ') };
}
// Pay the quest's costs and grant its rewards. Returns a list of reward lines.
export function turnIn(S, id) {
  const f = folkOf(S, id), q = questOf(S, id);
  if (!q || !questReady(S, id).ok) return null;
  const n = q.need, out = [];
  if (n.gold) S.gold -= n.gold;
  if (n.gear) S.gearBag.sort((a, b) => a.tier - b.tier).splice(0, n.gear);
  if (n.reagents) {
    let left = n.reagents;
    for (const r of Object.keys(S.reagents).sort((a, b) => S.reagents[b] - S.reagents[a])) { const t = Math.min(left, S.reagents[r]); S.reagents[r] -= t; left -= t; if (!left) break; }
  }
  if (n.items) S.inventory[n.items[0]] -= n.items[1];
  if (n.brewed) {
    let left = n.brewed;
    for (const [k, v] of Object.entries(S.inventory)) { if (!left) break; if (v > 0 && ITEMS[k] && ITEMS[k].brewed) { const t = Math.min(left, v); S.inventory[k] -= t; left -= t; } }
  }
  const g = q.give;
  if (g.favor) { addFavor(S, id, g.favor); out.push(`${FOLK[id].name}'s favor +${g.favor}`); }
  if (g.gold) { S.gold += g.gold; out.push(`+${g.gold}g`); }
  if (g.items) { S.inventory[g.items[0]] = (S.inventory[g.items[0]] || 0) + g.items[1]; out.push(`${g.items[1]}× ${ITEMS[g.items[0]].name}`); }
  if (g.gear) { const it = makeGear(g.gear, tierFor(S, 1), Math.random, true); S.gearBag.push(it); out.push(it.name); }
  f.quest++;
  f.active = null;
  return out;
}
export const questsDone = (S, id) => folkOf(S, id).quest >= QUESTS[id].length;

// Supper for two at the Kettle & Crown: closeness with an ally, once a day.
export function supperOpen(S) { return ensureTown(S).supperDay !== S.day; }

// Evening with a townswoman: one a night overall, every third night with her.
export function townEveningOpen(S, id) { return !!S.seen[`${id}_romance`] && S.eveningDay !== S.day && S.day - folkOf(S, id).nightDay >= 3; }
export function townEvening(S, id) { folkOf(S, id).nightDay = S.day; S.eveningDay = S.day; }

// --- nightly: arrival and dividends ----------------------------------------------
export function nightly(S, log) {
  if (!S.flags.rift_arrived && S.day >= 3 && !(S.queue || []).includes('rift_arrival')) { (S.queue ||= []).push('rift_arrival'); return; }
  const d = dividends(S);
  if (d > 0) { S.gold += d; log.push(`Larkspur Lane pays ${d}g in dividends.`); }
}

// --- talk lines ------------------------------------------------------------------
export const TOWN_TALK = {
  victoria: [
    "I've drafted bylaws. Article one: no summoning anything within five hundred feet of the mailboxes. Article two: see article one.",
    "The goblins at the market tried to haggle with me. I opened a spreadsheet. They left in tears and paid full price.",
    "(not looking up from the clipboard) You're standing in my light. No, stay. I like knowing where you are.",
    "Back home I had an assistant, a corner office and a standing desk. Here I have a desk that stands on its own. It walked in this morning. I've hired it.",
    "People assume I like being in charge. I don't like it. I'm just very, very good at it. There's a difference. (a beat) Mostly.",
  ],
  joanne: [
    "Sit, sit. You look thin. Everyone in this world looks thin. It's all that adventuring and no proper lunch.",
    "Moira says the stew's cursed. It's not cursed, it's paprika. Although it did hum a little last night.",
    "You know what I miss? Grocery stores. You know what I don't miss? My ex-husband. This world's got its trade-offs, honey.",
    "A knight came in yesterday and cried into his pot pie. I gave him seconds. Some days that's the whole job.",
    "(wiping the counter, smiling at you) You always come in looking like you've been fighting a war, and you leave looking fed. That's my favorite thing I do.",
  ],
  diane: [
    "Did you know the moss out here is sentient? It's very shy. I've been talking it through some things.",
    "Downward dog, Zoe. Come on. Your shoulders are up around your ears. Swinging a spell all day is murder on the trapezius.",
    "The mandrakes scream when you pull them, but if you warn them first they only sigh. Manners matter, even in a vegetable.",
    "My HOA once fined me for an unapproved compost bin. Now I have a greenhouse that eats rats. Life's funny.",
    "(brushing soil off your sleeve, slower than strictly necessary) You've got a little fen on you. There. Better.",
  ],
  margot: [
    "Babe. Babe. A dwarf just offered me a mine for my hoop earrings. I said two mines. We're negotiating.",
    "You know what this world doesn't have? Sales tax. I'm thriving. I'm absolutely thriving.",
    "My second ex said I'd never make it on my own. I'm running the hottest stall in a magical swamp. Somebody tell Rick.",
    "(leaning on the counter, chin on her fist) You're my best supplier and my best customer. That's dangerous. I like dangerous.",
    "Everyone thinks I'm all flash. The flash is the bait, sweetheart. The ledger's where I live.",
  ],
  moira: [
    "The children used to dare each other to knock on my door. Now the demons do. The demons are better behaved.",
    "My late husband would have loved it here. He also would have been eaten in a week. I miss him sensibly.",
    "Your witch, Vesper. She has good instincts and terrible tea. I've been correcting the second.",
    "Every candle in my shop is lit for someone. (she lights one, black flame) That one's yours. Don't ask what it's for.",
    "(a slow look, head to toe) You walk like someone who's been told she's dangerous and decided to be gracious about it. I approve.",
  ],
};

// --- events ----------------------------------------------------------------------
// Intimacy gate: a townswoman of the Lane (never a captive), after her story and quests.
function townFree(id, extra = null) {
  const fn = S => !!(S.town && S.town.open) && !(S.captives || []).some(c => c.named === id) && (!extra || extra(S));
  fn.__tribe = 'town:' + id;
  return fn;
}
const fav = (S, id) => (S.town && S.town.folk && S.town.folk[id] && S.town.folk[id].favor) || 0;
const qd = (S, id) => !!(S.town && S.town.folk && S.town.folk[id] && S.town.folk[id].quest >= QUESTS[id].length);

function story(id, lines) {
  return { id: `${id}_story`, where: 'town', once: true, cond: S => !!(S.town && S.town.open) && fav(S, id) >= 4, steps: [...lines.map(([s, t]) => ({ s, t })), { do: S => addFavor(S, id, 1) }, { chronicle: `You got to know ${FOLK[id].name} of Larkspur Lane.` }] };
}
function romance(id, o) {
  return {
    id: `${id}_romance`, where: 'town', once: true,
    cond: townFree(id, S => fav(S, id) >= 8 && qd(S, id) && !!S.seen[`${id}_story`]),
    tags: o.tags,
    steps: [
      ...o.lead.map(t => ({ s: id, t })),
      { choice: o.choices.map(c => ({ t: c.t, tone: c.tone, r: [
        ...(c.r ? [{ s: id, t: c.r }] : []),
        { s: 'narr', t: c.gentle, spice: 'gentle' },
        { s: 'narr', t: c.steamy, spice: 'steamy' },
        { s: 'narr', t: '', spice: 'unbound', stub: `${id}_romance` }, // ZOE: unbound
      ] })) },
      { do: S => { folkOf(S, id).nightDay = S.day; S.eveningDay = S.day; } },
      { chronicle: o.chronicle },
    ],
  };
}
function evening(id, o) {
  return {
    id: `${id}_evening`, where: 'town', once: false,
    cond: townFree(id, S => !!S.seen[`${id}_romance`]),
    tags: ['repeatable'],
    steps: [
      { s: id, t: o.ask },
      { choice: [
        { t: 'Stay the night.', r: [
          { s: 'narr', t: o.gentle, spice: 'gentle' },
          { s: 'narr', t: o.steamy, spice: 'steamy' },
          { s: 'narr', t: '', spice: 'unbound', stub: `${id}_evening` }, // ZOE: unbound
        ] },
        { t: '"Just keep me company tonight."', r: [{ s: id, t: o.talk }] },
      ] },
    ],
  };
}

export function events(E) {
  E.rift_arrival = {
    id: 'rift_arrival', where: 'hub', once: true, priority: 60,
    steps: [
      { s: 'narr', t: 'At midnight the fen below the drowned library splits open with a sound like a car alarm in a cathedral. Somewhere in the Coven, someone tried to summon a demon and badly fumbled the address.' },
      { s: 'vesper', t: '(at the window, very still) Zoe. There is a street in the swamp.' },
      { s: 'narr', t: 'There is. Five houses in a neat crescent, painted mailboxes, a basketball hoop, a minivan with its hazard lights blinking at the stars. A sign at the end reads LARKSPUR LANE — A FRIENDLY NEIGHBORHOOD. A frog is sitting on it, appalled.' },
      { s: 'narr', t: 'By the time you get down there, someone has already set up a folding table.' },
      { s: 'victoria', t: '(clipboard up, glasses down) Good. Someone in charge. I\'m Victoria, HOA president. I need to know three things: where we are, who\'s responsible, and whether this counts as an act of God for insurance purposes.' },
      { s: 'joanne', t: '(from the porch of the nearest house, waving a ladle) Vicky, let the poor girl breathe! Honey, are you hungry? You look hungry. Everyone come in, I made enough for the whole block. I always make enough for the whole block.' },
      { s: 'margot', t: '(leaning on the minivan in a hot-pink robe and full makeup at midnight) Is that a sword? Is everyone here carrying a sword? Okay. Okay. I can sell to this.' },
      { s: 'diane', t: '(crouched in the reeds, enchanted) Victoria, the moss is breathing. The moss is breathing. I\'m going to need a bigger greenhouse.' },
      { s: 'moira', t: '(on the darkest porch, in the darkest dress, entirely unbothered) I told you all something like this would happen. Nobody ever listens to the widow with the candles.' },
      { s: 'vesper', t: '(under her breath, fascinated) None of them are afraid. Why aren\'t they afraid?' },
      { s: 'victoria', t: 'Because we have survived twelve years of block parties together, dear. A swamp is nothing. Now. Is there a local economy, and who do I speak to about joining it?' },
      { choice: [
        { t: '"You\'re under my protection. Set up shop. The Codex will look after you."', tone: 'kind', r: [{ s: 'victoria', t: '(writing it down) "Under the protection of the Codex." Lovely. Can I get that in writing? Never mind, I\'ve got it in writing.' }] },
        { t: '"The fen is mine. You can stay, but you pay your way."', tone: 'dom', r: [{ s: 'victoria', t: '(a slow, appreciative look over her glasses) Finally. Someone who talks like a landlord. We\'ll get along beautifully.' }] },
        { t: '"Welcome to the neighborhood."', tone: 'kind', r: [{ s: 'joanne', t: '(pressing a casserole dish into your hands) And welcome to ours, sweetheart. Bring the dish back when you\'re done.' }] },
      ] },
      { do: S => { ensureTown(S).open = true; S.flags.rift_arrived = true; } },
      { s: 'codex', t: '[ LARKSPUR LANE — a town in the fen. Shops, townsfolk, quests for favor, and businesses you can invest in for nightly dividends. Find it from the Codex. ]' },
      { chronicle: 'A suburban street fell out of the sky into the fen. Its people opened shops.' },
    ],
  };

  // --- personal stories (favor 4) ---
  E.victoria_story = story('victoria', [
    ['narr', 'You find Victoria in the Ledger House after dark, alone, the clipboard set down for once beside a framed photo of a glass office tower.'],
    ['victoria', 'Twenty-two years. I gave that company everything. Weekends, holidays, a marriage. And in the end I was a line in a restructuring memo.'],
    ['victoria', '(she straightens the photo, then lays it face-down) Here, nobody\'s restructuring anything. Here, I built something in a month that people actually need. Do you know how intoxicating that is?'],
    ['victoria', 'Don\'t answer. You run a library full of monsters and a witch who\'s in love with you. You know exactly.'],
  ]);
  E.joanne_story = story('joanne', [
    ['narr', 'After closing, Joanne pours two cups of something warm and sits across from you, apron finally off.'],
    ['joanne', 'Thirty years of feeding people who never once asked if I\'d eaten. My kids grew up, my husband grew bored, and I kept making enough for the whole block.'],
    ['joanne', '(she laughs, but softly) And then the block fell into a swamp and suddenly I\'m the most important woman in it. Knights cry into my pot pies. A demon tipped me last week.'],
    ['joanne', 'You asked if I\'d eaten, you know. The first night. Nobody\'s asked me that in years. (she pats your hand) I noticed.'],
  ]);
  E.diane_story = story('diane', [
    ['narr', 'Diane takes you into the greenhouse, where the plants lean toward her like cats.'],
    ['diane', 'Everyone back home thought I was the nice harmless lady with the garden. I was. I was also so bored I used to cry in the potting shed.'],
    ['diane', '(she touches a vine; it curls around her wrist, affectionate) Here, the garden talks back. Here, I\'m good at something that matters. I\'m not harmless anymore, Zoe. I like that.'],
    ['diane', 'Don\'t tell Joanne I said this, but I hope we never go home.'],
  ]);
  E.margot_story = story('margot', [
    ['narr', 'Margot closes the stall early and walks you to the end of the Lane, where the sidewalk runs out into the reeds.'],
    ['margot', 'Two husbands. Both told me I was too much. Too loud, too pink, too ambitious, too much.'],
    ['margot', '(she kicks a pebble into the fen; something below catches it) Here, too much is exactly enough. A dragon bought a lamp from me yesterday. A dragon, Zoe. And he said I had style.'],
    ['margot', 'So I\'m going to keep being too much. And you\'re going to keep coming back. Deal?'],
  ]);
  E.moira_story = story('moira', [
    ['narr', 'Moira\'s shop is lit by a hundred candles, one of them black, burning for you.'],
    ['moira', 'When my husband died, the street decided I was a witch. I decided they were right. It was the only interesting thing anyone had ever said about me.'],
    ['moira', '(she trims a wick with her fingers, unflinching) Every candle I ever lit worked, you know. Quietly. A rash here, a lucky lottery ticket there. Nobody believed me. I didn\'t mind. I knew.'],
    ['moira', 'Here, they believe me. (a slow smile) And you, of all people, take me seriously. Do you know how rare that is, dear? Do you know what it does to a woman my age?'],
  ]);

  // --- romances (favor 8, all her quests done, story seen) ---
  E.victoria_romance = romance('victoria', {
    tags: ['romance', 'power dynamic', 'workplace authority', 'older woman'],
    lead: [
      'Close the door. Sit. (she doesn\'t look up from the ledger) I\'ve been auditing my own feelings, and the numbers don\'t reconcile.',
      '(she takes off her glasses, finally looks at you) I\'m forty-four, Zoe. I don\'t do things by accident. So I\'m going to be very clear: I want you, and I would like to hear your answer before I lose my nerve. Which I never do.',
    ],
    choices: [
      { t: '"Then take what you want, Madam President."', tone: 'kind',
        r: '(a slow, dangerous smile) Oh, that is a mistake. I\'ve been in charge of everything for twenty-two years. I\'m very good at it.',
        gentle: 'She takes you by the collar, pins you to the ledger desk, and kisses you like she\'s closing the biggest deal of her life. Later, the clipboard is on the floor and she\'s laughing into your shoulder.',
        steamy: 'Victoria runs the night like a board meeting she\'s already won: precise, unhurried, every instruction obeyed, every reward exactly earned. Her glasses end up on the desk, her pearls in your hand, her composure nowhere at all.' },
      { t: '"No. Tonight you put the clipboard down."', tone: 'dom',
        r: '(she goes very still) No one has ever said no to me in my own office. (she sets the clipboard down) ...Do it again.',
        gentle: 'She lets you take the pen from her hand, then the glasses, then the rest, and for the first time in years, Victoria lets someone else decide what happens next.',
        steamy: 'You bend the HOA president over her own ledger and take her apart line by line until she\'s begging for instructions, and every time you give one she obeys like it\'s the first thing in years that\'s made sense.' },
    ],
    chronicle: 'Victoria put the clipboard down for you.',
  });
  E.joanne_romance = romance('joanne', {
    tags: ['romance', 'older woman'],
    lead: [
      '(she\'s turned the inn sign to CLOSED, and she\'s nervous, which you\'ve never seen) Sit with me a minute, sweetheart. I\'m fifty-two and I feel about sixteen and it\'s very undignified.',
      'I\'ve spent my whole life taking care of people. Just this once I\'d like someone to take care of me. And I\'d like it to be you. (a shaky laugh) There. I said it.',
    ],
    choices: [
      { t: 'Take her hand and lead her upstairs.', tone: 'kind',
        gentle: 'Upstairs, she laughs at herself twice and then stops laughing, and you spend the night making sure Joanne, for once, is the one who\'s fed.',
        steamy: 'You undo her apron strings like you\'re unwrapping something precious, and you take your time with every soft, generous curve of her until she\'s gasping your name into the quilt and forgetting, for one whole night, to worry about anybody.' },
      { t: '"Then let me spoil you."', tone: 'kind',
        r: '(her eyes go bright) Oh, honey. Oh, nobody\'s ever offered.',
        gentle: 'You run her a bath, rub her feet, and kiss her slowly in the steam, and she cries a little and then laughs, and then kisses you back like she means to make up for thirty years.',
        steamy: 'You spoil her: bath oil, slow hands, every inch of her worshipped, until the most capable woman on the Lane is clinging to you and saying "oh, sweetheart, oh" like a prayer.' },
    ],
    chronicle: 'Someone finally took care of Joanne.',
  });
  E.diane_romance = romance('diane', {
    tags: ['romance', 'older woman', 'flexibility'],
    lead: [
      '(in the greenhouse, at night, among the glowing plants) I told you I wasn\'t harmless anymore. I meant it about everything.',
      'Forty-nine years of being the nice lady. I want to be the woman who asks for what she wants. (she takes your hand and puts it on her waist) I want you. Is that all right?',
    ],
    choices: [
      { t: '"More than all right."', tone: 'kind',
        gentle: 'You kiss her among the glowing vines, and she laughs into your mouth when one of them curls helpfully around your ankle, and the greenhouse keeps your secret until dawn.',
        steamy: 'Twenty years of yoga in the park turn out to have been preparation for exactly this: Diane is astonishingly flexible and completely unashamed, folding herself into every shape you ask for among the warm, glowing leaves.' },
      { t: '"Show me how flexible you really are."', tone: 'dom',
        r: '(a startled laugh, then a very slow smile) Oh, you\'ve been watching me in the park.',
        gentle: 'She shows you, laughing, and then not laughing at all, and the vines draw a curtain of leaves around the two of you.',
        steamy: 'She shows you, and keeps showing you, and you put every one of those impossible poses to devastating use until the nice lady from the Lane is shaking and wild and very loudly not nice at all.' },
    ],
    chronicle: 'Diane stopped being harmless with you.',
  });
  E.margot_romance = romance('margot', {
    tags: ['romance', 'older woman', 'flirt'],
    lead: [
      '(the stall\'s shutters are down; she\'s sitting on the counter in heels, swinging one foot) So. I\'ve been flirting with you for a month and you keep flirting back, and I\'m forty-six, babe. I don\'t have time to be subtle.',
      'Too much. That\'s what they said. (she hooks a finger in your collar) Are you going to tell me I\'m too much?',
    ],
    choices: [
      { t: '"You\'re exactly enough. Come here."', tone: 'kind',
        gentle: 'You kiss her against the counter and she laughs, delighted, and keeps laughing all night, like she\'s finally somewhere with enough room for all of her.',
        steamy: 'Margot is loud and shameless and gorgeous, and she wants all of it: your hands everywhere, the counter, the stockroom, the counter again, every inch of her too much and every inch of it adored.' },
      { t: '"I\'m going to find out exactly how much."', tone: 'dom',
        r: '(her eyes go wide and then very, very dark) Oh. Oh, you\'re trouble.',
        gentle: 'You find out, and she\'s more, and you don\'t once tell her to be less.',
        steamy: 'You take every bit of her brass and flash and turn it into begging, Margot sprawled on her own counter with her hoops ringing, finally, gloriously, too much for someone who wants every bit of it.' },
    ],
    chronicle: 'Margot was too much, and you wanted every bit.',
  });
  E.moira_romance = romance('moira', {
    tags: ['romance', 'older woman', 'dark aesthetic'],
    lead: [
      '(every candle in the shop is lit, and the black one burns tallest) Sit, dear. I want to tell you a secret. I lit that candle the night we met. It was never a curse.',
      '(she takes your hand, cool fingers, silver rings) I\'m fifty-five and widowed and I know exactly what I want. I\'d like you to stay tonight.',
    ],
    choices: [
      { t: '"Then show me what the candle was for."', tone: 'kind',
        gentle: 'She leads you through the beaded curtain to a bed draped in black lace, and every candle in the shop gutters at once, politely, and the dark keeps you both.',
        steamy: 'Moira makes love the way she lights candles: slow, deliberate, utterly sure every one will work. Black lace and silver rings and that velvet-in-a-crypt voice telling you exactly what she wants, and the black flame burning tallest of all.' },
      { t: '"I\'ll stay. On my terms."', tone: 'dom',
        r: '(a low, delighted laugh) Oh, finally. Someone who isn\'t afraid of the widow.',
        gentle: 'She lets you take the lead, and watches you with dark, approving eyes the whole time, as if you\'re the most interesting spell she\'s ever cast.',
        steamy: 'You take the hexwife on her own altar of black candles, and she gives you everything with dark, glittering eyes, the most composed woman on the Lane undone and laughing low in your arms.' },
    ],
    chronicle: 'Moira\'s black candle burned all night.',
  });

  // --- evenings (repeatable, every third night) ---
  E.victoria_evening = evening('victoria', {
    ask: '(she clicks her pen once, deliberately) I\'ve blocked out my evening for you. Don\'t make me reschedule.',
    gentle: 'You spend the evening in the Ledger House, her glasses on the desk, her head on your shoulder, and she falls asleep before she can draft anything.',
    steamy: 'She leaves the meeting minutes very short tonight: one item on the agenda, discussed at length, carried unanimously, twice.',
    talk: 'Fine. Sit with me while I do the quarterlies. (a pause) I like the company. Don\'t put that in the minutes.',
  });
  E.joanne_evening = evening('joanne', {
    ask: '(untying her apron) I saved you the last slice, sweetheart. And I saved you the rest of my night.',
    gentle: 'Upstairs at the Kettle & Crown, warm quilts and warmer hands, and she falls asleep smiling against you.',
    steamy: 'She pulls you upstairs, laughing, already pulling at your coat, and this time she\'s not nervous at all.',
    talk: 'Then sit and eat and tell me everything. All of it. Even the parts with monsters.',
  });
  E.diane_evening = evening('diane', {
    ask: '(wiping her hands on her apron, eyes bright) The night-blooming flowers are out. Come see them. Stay after.',
    gentle: 'Among the glowing flowers, slow and soft, and she names every plant that leans in to watch.',
    steamy: 'Among the glowing flowers, not slow at all, and she shows you a pose she swears she invented for you.',
    talk: 'Then help me repot the mandrakes. Warn them first. They\'ll only sigh.',
  });
  E.margot_evening = evening('margot', {
    ask: '(flipping the CLOSED sign with a flourish) Shop\'s shut, babe. Inventory\'s you.',
    gentle: 'She laughs the whole time and doesn\'t let go of your hand all night.',
    steamy: 'The stockroom, the counter, and once, regrettably, the display case. She says it was worth it. She\'s right.',
    talk: 'Fine, help me price this junk. If you say "it\'s worth nothing" I\'m charging double.',
  });
  E.moira_evening = evening('moira', {
    ask: '(the black candle already lit) It\'s burning for you again, dear. It always is.',
    gentle: 'Black lace, candle-light, and her cool hands in your hair until you sleep.',
    steamy: 'Black lace and silver rings and that low, delighted laugh, and the candle burns down to nothing before either of you are done.',
    talk: 'Then sit with me and watch the flames. They\'ll tell you things, if you\'re patient. Mostly gossip.',
  });
}
