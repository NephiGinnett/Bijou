// ============================================================
// The epilogue: after the ending, the Codex writes one last chapter
// from everything this playthrough actually did. Who stayed and how
// close, the children, every captive kept, freed or lost, each rival's
// fate, the tribes, Larkspur Lane, and how many paths you took.
// Built fresh from the save each time, so it can be reread later.
// ============================================================
import { HEROES, FACTIONS, TRIBES } from './data.js';
import { roster } from './state.js';
import { TOWNSFOLK, folkOf, dividends } from './packs/rift.js';

const WORDS = ['no one', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const count = n => WORDS[n] || String(n);
const romanced = (S, id) => !!(S.seen && (S.seen[id + '_romance'] || S.seen[id + '_romance_lead']));
const bond = (S, id) => (S.bond && S.bond[id]) || 0;

// The main cast get their own futures; everyone else gets one that fits how close you were.
const FUTURES = {
  vesper: [
    'Vesper still reads you a card every morning. Lately she doesn\'t bother turning it over. She says she already knows how the day ends.',
    'Vesper keeps the Codex\'s stacks in order, and a chair by the fire for you, and never says which of those matters more.',
  ],
  rue: [
    'Rue\'s debt brand faded the night she decided you were worth more than the bargain. She still lies, but only about small things, and only to make you laugh.',
    'Rue runs the Codex\'s accounts. Nobody has ever audited them. Nobody would dare.',
  ],
  isolde: [
    'Isolde hung the kneeling sword over the hearth. She trains the Dawnward recruits now, and every evening she comes home to you.',
    'Isolde rides the edges of the fen, and every patrol, somehow, ends at your door.',
  ],
};
function companion(S, id, name) {
  const close = romanced(S, id) && bond(S, id) >= 8;
  if (FUTURES[id]) return FUTURES[id][close ? 0 : 1];
  const conv = S.converts && S.converts[id];
  if (conv && !close) return `${name}, once of the ${conv.faction === 'vigil' ? 'Vigil' : conv.faction === 'market' ? 'Market' : conv.faction === 'college' ? 'College' : conv.faction === 'lodge' ? 'Lodge' : 'Coven'}, kept the oath made in the Undercroft, and never once looked back at the stair.`;
  if (close) return `${name} stayed, and stayed close. Some nights the Codex writes a page just about the two of you, and leaves it open on the desk.`;
  if (bond(S, id) >= 5) return `${name} stayed on at the Codex, and became the kind of friend who doesn't need to be asked.`;
  return `${name} stayed on at the Codex, for the work, and, though they'd never say so, for you.`;
}

const LANE_FUTURES = {
  victoria: 'Victoria still runs the Lane\'s books, and Harold still gets his reports. Bullet points. They have never been happier.',
  joanne: 'Joanne still feeds the whole block. Gary still kisses her cheek and says "good for you, Jo." She still glows.',
  diane: 'Diane\'s greenhouse ate the house next door, with permission. The moss is doing much better. So is she.',
  margot: 'Margot\'s stall is the richest in the fen. She is still too much. You still want every bit of it.',
  moira: 'Moira\'s black candle never went out. She lights a new one every year, on the night you met.',
};
function celesteFuture(S) {
  const f = S.flags || {}, kid = (S.family || []).find(c => c.parent === 'celeste');
  if (f.celeste_left) return `Celeste never went back to Brad. She dances in the Codex's great hall on Sunday mornings${kid ? `, and ${kid.name} dances with her` : ''}.`;
  if (f.celeste_secret) return `Celeste and Brad raise ${kid ? kid.name : 'the baby'} in the biggest house on the Lane. Brad is a doting father. At every block party, Celeste finds your eyes across the street.`;
  if (f.celeste_ended && f.celeste_free) return 'Celeste\'s studio is the busiest door on the Lane. She waves to you through the window every morning, and she\'s glowing.';
  if (f.celeste_ended) return 'Brad learned to waltz. He\'s terrible at it. Celeste counts the steps for him on the lawn, and only sometimes looks up at your window.';
  if (S.seen && S.seen.celeste_romance) return 'Celeste still meets you behind the greenhouse at midnight. Brad is still on a call.';
  if (f.celeste_declined) return 'Celeste still waves from her porch, and her smile only slips a little.';
  return null;
}

const mid = n => n.replace(/^The /, 'the ');
const FATE = {
  subjugated: (F) => `${F.leaderName} was taken in chains, and ${mid(F.name)} has knelt ever since.`,
  sworn: (F) => `${F.leaderName} came out of the Undercroft sworn to you, and ${mid(F.name)} followed.`,
  humbled: (F) => `${F.leaderName} yielded rather than fall. ${F.name} pays its tribute on time, and quietly.`,
  shattered: (F) => `${F.name} broke when ${F.leaderName} fell. What's left of it pays tribute and keeps its head down.`,
};

export function epilogueSteps(S, nameOf = id => (HEROES[id] && HEROES[id].name) || id) {
  const out = [];
  const say = t => out.push({ s: 'narr', t });
  out.push({ s: 'codex', t: '[ The Codex writes one last chapter, and then, for once, it lets you read it. ]' });

  // who stayed
  const allies = roster(S).filter(id => id !== 'player');
  if (allies.length) {
    say(`Of everyone who came to the Codex with you, ${count(allies.length)} stayed.`);
    for (const id of allies) say(companion(S, id, nameOf(id)));
  }
  // family
  for (const c of S.family || []) say(c.secret ? `${c.name} grows up on Larkspur Lane, Brad's as far as Brad knows, and yours as far as you and Celeste do.` : `${c.name}, ${nameOf(c.parent)}'s and yours, grows up running through the stacks and terrorizing the Menagerie.`);

  // the Undercroft
  const rel = S.released || [];
  const by = f => rel.filter(r => r.fate === f);
  const names = list => list.slice(0, 4).map(r => r.name).join(', ') + (list.length > 4 ? ` and ${list.length - 4} more` : '');
  if (by('join').length) say(`${names(by('join'))} walked out of the Undercroft and chose to stay with you.`);
  if (by('leave').length) say(`${names(by('leave'))} walked out free, and went home changed.`);
  if (by('relapse').length) say(`${names(by('relapse'))} went back to their old masters. The Codex keeps their pages anyway.`);
  if (by('escaped').length) say(`${names(by('escaped'))} slipped out of the cells one night, and the Codex still doesn't know how.`);
  if ((S.captives || []).length) say(`${(S.captives || []).length === 1 ? `${S.captives[0].name} is` : `${names(S.captives)} are`} still in the Undercroft, ${S.captives.some(c => (c.gifts || []).length) ? 'with the little comforts you left them' : 'waiting'}.`);

  // the rivals
  for (const [fid, F] of Object.entries(FACTIONS)) {
    const f = S.factions && S.factions[fid]; if (!f) continue;
    if (f.fate && FATE[f.fate]) say(FATE[f.fate](F));
    else if (f.power != null && f.power < 100) say(`${F.name} still stands, though not as tall as it did. It remembers you.`);
  }
  // the tribes
  const sworn = Object.entries(TRIBES).filter(([tid]) => S.tribes && S.tribes[tid] && S.tribes[tid].status === 'sworn');
  if (sworn.length) say(`${sworn.map(([, T]) => T.name).join(' and ')} swore to you, and keep their word in the wild.`);

  // Larkspur Lane
  if (S.town && S.town.open) {
    const lane = Object.keys(LANE_FUTURES).filter(id => romanced(S, id)).map(id => LANE_FUTURES[id]);
    lane.forEach(say);
    const cel = celesteFuture(S); if (cel) say(cel);
    const friends = Object.keys(TOWNSFOLK).filter(id => !romanced(S, id) && id !== 'celeste' && folkOf(S, id).favor >= 5).map(id => TOWNSFOLK[id].name);
    if (friends.length) say(`${friends.join(' and ')} count${friends.length === 1 ? 's' : ''} you a friend, and the Lane is a little safer for it.`);
    const parties = ['lane_may_day', 'lane_cookout', 'lane_hallows', 'lane_yule', 'lane_block_party'].filter(id => S.seen && S.seen[id]).length;
    if (parties) say(`The Wives' Circle threw ${parties === 1 ? 'a party' : `${count(parties)} parties`} in your honor. Victoria has the minutes.`);
    const d = dividends(S); if (d) say(`Your stakes in the Lane still pay ${d} gold a night. Victoria sends the statements.`);
  }

  // the tally
  const picks = Object.keys(S.choices || {}).length;
  say(`The Codex closes on day ${S.day}${picks ? `, with ${picks} of your choices written into it and every path you didn't take still waiting in the margins` : ''}.`);
  return out;
}
