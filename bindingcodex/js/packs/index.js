// ============================================================
// BINDING CODEX — pack installer
// Merges every pack's heroes, enemies, captives, speakers, looks
// and events into the game tables. Pack content is always present
// (so saves never break); each event is wrapped so it only fires
// while its pack is enabled in Settings.
// ============================================================

import { HEROES, ENEMIES, LOCATIONS } from '../data.js';
import { EVENTS, SPEAKERS } from '../story.js';
import { registerNamedCaptive, registerNightly, packOn } from '../state.js';
import { negotiation } from './common.js';
import * as obsidian from './obsidian.js';
import * as northern from './northern.js';
import * as classic from './classic.js';
import * as wildkin from './wildkin.js';

export const PACKS = {
  obsidian: { name: 'Obsidian College', mod: obsidian, desc: 'Lady Auren Voss, the Revenant Bride, Mira Ashveil, Maren Soleil, Cole Ashmer, the Pale Stag; Seris\'s duels; Vex in the Menagerie.' },
  northern: { name: 'Northern Reach', mod: northern, desc: 'Valdra, Nyxe, Mira Vane, Rhea, Aelindra, Legate Aurelia, Brynn, Sera; the Ashreach testimony chain.' },
  classic:  { name: 'Classic Fantasy', mod: classic, desc: 'Elara Moonwhisper, Lady Seraphine, Elspeth, Sister Maren, Kira.' },
  wildkin:  { name: 'Wildkin', mod: wildkin, desc: 'Harpy, naga and drake-kin tribes drawn to your Menagerie; Lysandre the shapeshifter; Wyrm\'s Mantle scenes.' },
};

let installed = false;
export const LOOKS = {};

export function installPacks() {
  if (installed) return;
  installed = true;
  for (const [pid, P] of Object.entries(PACKS)) {
    const m = P.mod;
    Object.assign(HEROES, m.heroes || {});
    Object.assign(ENEMIES, Object.fromEntries(Object.entries(m.enemies || {}).map(([k, v]) => [k, { ...v, pack: pid }])));
    Object.assign(SPEAKERS, m.speakers || {});
    for (const [k, v] of Object.entries(m.looks || {})) if (v) LOOKS[k] = v;
    for (const [k, v] of Object.entries(m.captives || {})) registerNamedCaptive(k, { ...v, pack: pid });
    for (const [loc, lt] of Object.entries(m.lieutenants || {})) if (LOCATIONS[loc] && !LOCATIONS[loc].lieutenant) LOCATIONS[loc].lieutenant = lt;
    const before = new Set(Object.keys(EVENTS));
    if (m.events) m.events(EVENTS);
    for (const id of Object.keys(EVENTS)) {
      if (before.has(id)) continue;
      const ev = EVENTS[id];
      ev.pack = pid;
      const orig = ev.cond;
      const wrapped = S => packOn(S, pid) && (!orig || orig(S));
      if (orig && orig.__allies) wrapped.__allies = orig.__allies;
      if (orig && orig.__tribe) wrapped.__tribe = orig.__tribe;
      ev.cond = wrapped;
    }
    if (m.nightly) registerNightly(pid, m.nightly);
  }
  // Base-game tweaks the Obsidian pack makes: Seris joins after defying
  // Sorn; Vex arrives through the Menagerie instead of petitioning.
  HEROES.seris.packOverride = { obsidian: { arrive: { flag: 'seris_defies' } } };
  HEROES.vex.packOverride = { obsidian: { recruit: false } };

  // Calla (base game): a negotiated revisit of the captive dynamic,
  // strictly between free adults, after she's joined.
  for (const ev of negotiation('calla', {
    bond: 6, tags: ['captor/captive roleplay (negotiated)'],
    ask: [
      { s: 'calla', t: 'Can I say something strange? (she\'s turning a cup in her hands) The Undercroft was the worst time of my life. It was also the first time anyone ever looked at me like I mattered enough to keep.' },
      { s: 'calla', t: 'I want to go back down there with you. Not for real. A game. Where I know I can leave, and I choose not to.' },
    ],
    terms: [
      { s: 'calla', t: 'The old cell. Your colors, not the Coven\'s. No brand, nothing on my throat, ever. And the word is "sister." If I say it, it\'s over and you just hold me.' },
      { s: 'narr', t: 'You agree, and you ask her what else, and you listen to all of it. When she\'s done, she looks lighter than you\'ve ever seen her.' },
    ],
    decline: [{ s: 'calla', t: '(a relieved little laugh) No, that\'s — good. That\'s probably the right answer. Thank you for not laughing.' }],
    checkIn: 'Your colors. Nothing on my throat. "Sister." (she takes your hand on the Undercroft stair) I\'m choosing this.',
    scene: [{ s: 'narr', t: 'The old cell door stands open the whole time. She never once looks at it.' }],
    gentle: 'It ends with her head in your lap on the cell floor, the door wide open, laughing at how much she didn\'t want to leave.',
    steamy: 'You play the warlock and she plays the defiant envoy, and somewhere in the game the defiance melts into something hungry and certain and entirely hers — the open door behind her, your colors on her shoulders, her own choice in every breath.',
    after: [{ chronicle: 'Calla went back down to the Undercroft, by choice.' }],
  })) EVENTS[ev.id] = ev;
}

// Recruit / visibility helper used by data.recruitOffers.
export function heroPackOn(S, h) { return !h.pack || packOn(S, h.pack); }
