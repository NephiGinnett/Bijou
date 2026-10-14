// ============================================================
// BINDING CODEX — character pack helpers
// Packs are plain data built from the Codexbound Character Packs GDD.
// Each pack registers heroes, enemies, named captives, speakers and
// events. Disabling a pack in Settings hides its characters, events
// and lieutenants without breaking saves (their records stay).
// ============================================================

import { free } from '../story.js';

// Stat budget by rarity (Common 1.0× → Legendary 1.6×).
export const RARITY = { common: 1.0, uncommon: 1.12, rare: 1.25, epic: 1.42, legendary: 1.6 };

// Role templates: base stats at level 1, growth per level, and a kit.
const ROLES = {
  tank:    { base: { hp: 140, mp: 24, atk: 13, mag: 4, def: 15, res: 11, agi: 8, luk: 7 },   growth: { hp: 11, mp: 2, atk: 1.9, mag: 0.6, def: 2.0, res: 1.6, agi: 0.9, luk: 0.8 },
             skills: { 1: 'shield_pin', 2: 'stand_fast', 6: 'oath_ward', 14: 'crushing_blow', 24: 'rampart_cleave' } },
  striker: { base: { hp: 95, mp: 36, atk: 16, mag: 8, def: 8, res: 9, agi: 16, luk: 12 },    growth: { hp: 8, mp: 3, atk: 2.3, mag: 1.0, def: 1.0, res: 1.2, agi: 1.9, luk: 1.3 },
             skills: { 1: 'ember_claw', 2: 'tail_trip', 6: 'umbral_cut', 14: 'through_the_veil', 24: 'hellmouth' } },
  caster:  { base: { hp: 86, mp: 60, atk: 6, mag: 17, def: 7, res: 14, agi: 10, luk: 10 },   growth: { hp: 7, mp: 5, atk: 0.7, mag: 2.5, def: 1.0, res: 1.9, agi: 1.2, luk: 1.0 },
             skills: { 1: 'hex_bolt', 2: 'chain_sigil', 6: 'gloom_brand', 14: 'umbral_coil', 24: 'bleeding_ink' } },
  healer:  { base: { hp: 96, mp: 58, atk: 7, mag: 14, def: 8, res: 12, agi: 9, luk: 11 },    growth: { hp: 8, mp: 5, atk: 0.8, mag: 2.0, def: 1.2, res: 1.8, agi: 1.0, luk: 1.2 },
             skills: { 1: 'salve', 2: 'soothing_word', 6: 'page_of_mending', 14: 'tonic_mist', 24: 'panacea' } },
  support: { base: { hp: 100, mp: 46, atk: 10, mag: 12, def: 9, res: 11, agi: 12, luk: 13 }, growth: { hp: 8, mp: 4, atk: 1.3, mag: 1.6, def: 1.2, res: 1.4, agi: 1.3, luk: 1.4 },
             skills: { 1: 'ink_lash', 2: 'war_banner', 6: 'omen_draw', 14: 'eclipse', 24: 'midnight_rite' } },
};

const scale = (o, m) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Math.round(v * m * 10) / 10]));

// Build a hero sheet from a role and rarity, overridable per character.
export function makeHero(id, o) {
  const R = ROLES[o.role] || ROLES.support;
  const m = RARITY[o.rarity] || 1;
  return {
    id, pack: o.pack, name: o.name, epithet: o.epithet, cls: o.cls, desc: o.desc,
    recruit: o.recruit !== false && !o.captive, convertOnly: !!o.captive, arrive: o.arrive || null,
    startLevel: o.startLevel || 6,
    base: scale(R.base, m), growth: scale(R.growth, 1 + (m - 1) / 2),
    skills: o.skills || R.skills,
    passive: o.passive || { id: 'pack', name: 'Codex-Bound', desc: 'A soul the Codex remembers.' },
    role: o.role === 'healer' ? 'healer' : o.role === 'tank' ? 'tank' : o.role === 'caster' ? 'caster' : o.role === 'striker' ? 'striker' : 'support',
    model: o.model, variant: o.variant || null, color: o.color,
    contentTags: o.tags || [],     // kept verbatim from the card; drives the free-ally romance arc
    stages: o.stages || [],
  };
}

// Petition at the drowned stair (recruits).
export function petition(id, lines) {
  return {
    id: 'recruit_intro_' + id, where: 'offer', once: false,
    steps: [
      ...lines,
      { choice: [
        { t: 'Welcome them to the Codex.', flag: `recruit_${id}_accept`, r: [{ s: id, t: 'Then I\'m yours. Show me where to stand.' }] },
        { t: 'Not yet.', r: [{ s: 'narr', t: 'They nod and step back. The petition stays on the table.' }] },
      ] },
    ],
  };
}

// A bond beat: fires at camp once the bond is high enough.
export function bondBeat(id, n, lines, minBond = 3) {
  return { id: `${id}_bond_${n}`, where: 'camp', once: true, priority: 38 + n, cond: free(id, S => (S.bond[id] || 0) >= minBond), steps: lines };
}

// A romance beat: free allies only. Gentle and steamy layers are written;
// the unbound layer is a stub for Zoe (see docs/UNBOUND_GUIDE.md).
export function romance(id, opts) {
  const extra = opts.cond || (() => true);
  return {
    id: `${id}_romance`, where: 'camp', once: true, priority: 45,
    cond: free(id, S => (S.bond[id] || 0) >= (opts.bond || 7) && extra(S)),
    tags: opts.tags || [],
    steps: [
      ...opts.lead,
      { choice: opts.choices.map(c => ({ t: c.t, tone: c.tone, bond: { [id]: 1 }, r: [
        ...(c.r || []),
        { s: 'narr', t: c.gentle, spice: 'gentle' },
        { s: 'narr', t: c.steamy, spice: 'steamy' },
        { s: 'narr', t: '', spice: 'unbound', stub: `${id}_romance` }, // ZOE: unbound
      ] })) },
      ...(opts.after || []),
      { chronicle: opts.chronicle || `A night with ${opts.name || id}.` },
    ],
  };
}

// Negotiated revisit: a former captive, now free, asks to revisit the
// dynamic on her own terms. The negotiation (what she wants, a stop word)
// always comes first and is its own event; the scene only unlocks after.
export function negotiation(id, opts) {
  return [
    {
      id: `${id}_negotiate`, where: 'camp', once: false, priority: 44,
      cond: free(id, S => (S.bond[id] || 0) >= (opts.bond || 6) && !S.flags[`${id}_negotiated`] && !S.flags[`${id}_declined`]),
      steps: [
        ...opts.ask,
        { choice: [
          { t: '"Tell me exactly what you want. And give me a word that stops everything."', tone: 'kind', flag: `${id}_negotiated`, r: opts.terms },
          { t: '"Not like that. Not with us."', tone: 'reject', flag: `${id}_declined`, r: opts.decline },
          { t: '"Ask me again another night."', reopen: true, r: [{ s: id, t: '(a small nod) Another night.' }] },
        ] },
      ],
    },
    {
      id: `${id}_revisit`, where: 'camp', once: true, priority: 46,
      cond: free(id, S => !!S.flags[`${id}_negotiated`] && (S.bond[id] || 0) >= (opts.bond || 6) + 1),
      tags: opts.tags || [],
      steps: [
        { s: id, t: opts.checkIn },
        ...opts.scene,
        { s: 'narr', t: opts.gentle, spice: 'gentle' },
        { s: 'narr', t: opts.steamy, spice: 'steamy' },
        { s: 'narr', t: '', spice: 'unbound', stub: `${id}_revisit` }, // ZOE: unbound
        ...opts.after,
      ],
    },
  ];
}
