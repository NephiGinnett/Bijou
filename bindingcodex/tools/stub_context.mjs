// ============================================================
// Unbound scene context — prints every Unbound stub's whole scene in
// reading order (lead-up, the choice, the Gentle and Steamy lines, the
// stub) into docs/UNBOUND_CONTEXT.md, with the writing notes from
// docs/UNBOUND_GUIDE.md beside it.
//
//   cd bindingcodex && node tools/stub_context.mjs
//
// Generated from the game's own event data, so rerun it after changing
// a scene. Exits non-zero if a stub is missing from the guide.
// ============================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

globalThis.localStorage = { getItem() { return null; }, setItem() {}, removeItem() {} };
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { installPacks, PACKS } = await import(path.join(ROOT, 'js/packs/index.js'));
const { EVENTS, SPEAKERS } = await import(path.join(ROOT, 'js/story.js'));
const { TRIBES } = await import(path.join(ROOT, 'js/data.js'));
const { install: installCompanions } = await import(path.join(ROOT, 'js/companions.js'));
const { UNBOUND } = await import(path.join(ROOT, 'js/unbound_lines.js'));
installPacks();
installCompanions(EVENTS);

const guide = fs.readFileSync(path.join(ROOT, 'docs/UNBOUND_GUIDE.md'), 'utf8');

// Guide rows: | `event_id` | choice | (tags |) notes |
const NOTES = {};
for (const line of guide.split('\n')) {
  const m = line.match(/^\| `([a-z0-9_]+)` \|(.*)\|\s*$/);
  if (!m) continue;
  const cols = m[2].split(' | ').map(c => c.trim());
  (NOTES[m[1]] ||= []).push({ choice: cols[0], tags: cols.length > 2 ? cols[1] : '', note: cols[cols.length - 1] });
}

const WHERE = {
  auto: 'Plays automatically when its moment comes (usually at the start of a day).',
  guild: 'Plays from the **Talk** button at the Codex hub.',
  camp: 'Plays at camp, between rooms on an expedition.',
  bower: 'Plays in the **Envoys\' Bower** (Menagerie), from her card.',
  home: 'Plays from her **Companion** page (click her on the hub): the ☾ Evening button, every other night.',
  rumor: 'Plays from a rumor at the hub.',
  offer: 'Plays when a recruit petitions to join.',
  release: 'Plays when a captive is released.',
};

const hasStub = steps => (steps || []).some(s => s.spice === 'unbound' || (s.choice && s.choice.some(c => hasStub(c.r))));
const countStubs = steps => (steps || []).reduce((n, s) => n + (s.spice === 'unbound' ? 1 : 0) + (s.choice ? s.choice.reduce((a, c) => a + countStubs(c.r), 0) : 0), 0);

function speaker(id) {
  if (id === 'narr') return 'Narration';
  if (id === 'kin') return '{kin}';
  const sp = SPEAKERS[id];
  return sp && sp.name ? sp.name : id;
}

// Turn a condition function into a short, human note.
function condNote(fn) {
  const src = String(fn);
  if (fn.name === 'mantled' || /mantled/.test(src)) return 'only if you took the Wyrm\'s Mantle pact';
  if (/has\(S, 'yuki'\) && romanced\(S, 'yuki'\)/.test(src)) return 'only if Yuki has had their own romance with you';
  let m = src.match(/has\(S, '([a-z_]+)'\)/);
  if (m) return `only if ${speaker(m[1])} is with you`;
  if (/n\(S\) < 3/.test(src)) return 'only while she\'s among your first few kin';
  if (/n\(S\) >= 3 && n\(S\) < 6/.test(src)) return 'only once the tribe is Nesting Near (3–5 kin)';
  if (/n\(S\) >= 6/.test(src)) return 'only once the tribe is Devoted (6+ kin)';
  m = src.match(/riteDone\(S, '([a-z]+)'\)/);
  if (m) { const T = TRIBES[m[1]]; return `only if ${T.envoyName} of ${T.name.replace(/^The /, 'the ')} has had the rite with you`; }
  m = src.match(/flags\.([a-z_]+)/);
  if (m) return `only if \`${m[1]}\` has happened`;
  return 'only in some playthroughs';
}

const quote = t => t.replace(/\n/g, ' ');

function render(steps, depth, out, evId) {
  const pad = '  '.repeat(depth);
  for (const st of steps || []) {
    const pre = st.cond ? `*(${condNote(st.cond)})* ` : '';
    if (st.spice === 'unbound') {
      if (st.t) out.push(`${pad}- ${pre}**[Unbound — written]** ${speaker(st.s)}: ${quote(st.t)}`);
      else if (UNBOUND[st.stub || evId]) {
        out.push(`${pad}- ${pre}✅ **UNBOUND — written** — stub \`${st.stub || evId}\` (in \`js/unbound_lines.js\`):`);
        const whoIs = { yuki: 'Yuki is there', aerie: 'Kestra is there', coil: 'Sythra is there', clutch: 'Vharra is there', pride: 'Tashra is there' };
        for (const l of UNBOUND[st.stub || evId]) out.push(typeof l === 'string' ? `${pad}  ${l}` : `${pad}  *(only if ${whoIs[l.when] || l.when})* ${l.t}`);
      }
      else out.push(`${pad}- ${pre}✍️ **YOUR UNBOUND LINES GO HERE** — stub \`${st.stub || evId}\`. They play right after the Steamy line above.`);
      continue;
    }
    if (st.choice) {
      out.push(`${pad}- ${pre}**▸ The player chooses:**`);
      for (const c of st.choice) {
        const mark = hasStub(c.r) ? ' ← **leads to your scene**' : '';
        out.push(`${pad}  - **${quote(c.t)}**${mark}`);
        render(c.r, depth + 2, out, evId);
        if (!(c.r || []).length) out.push(`${pad}    - *(the scene moves on)*`);
      }
      continue;
    }
    if (st.chronicle) { out.push(`${pad}- *(Chronicle entry: "${quote(st.chronicle)}")*`); continue; }
    if (st.join) { out.push(`${pad}- *(${speaker(st.join)} joins you)*`); continue; }
    if (st.capture || st.flag || st.give || st.brand === true) continue;
    if (st.t == null) continue;
    if (typeof st.t === 'function') { out.push(`${pad}- ${pre}**${speaker(st.s)}:** *(a line filled in during play, e.g. with a child's name)*`); continue; }
    if (st.t === '' ) continue;
    const tier = st.spice === 'gentle' ? '**[Gentle only]** ' : st.spice === 'steamy' ? '**[Steamy — Unbound players see this too]** ' : '';
    const gore = st.gore ? `*(${st.gore} gore setting)* ` : '';
    out.push(`${pad}- ${pre}${gore}${tier}**${speaker(st.s)}:** ${quote(st.t)}`);
  }
}

function tokensUsed(ev) {
  const src = JSON.stringify(ev.steps);
  const toks = [];
  if (/\{kin\}|"kin"/.test(src)) toks.push('`{kin}` — her name (any of the 12 women of that tribe)', '`{kinWho}` — her description, e.g. "a storm-scout of the Aerie"');
  if (/\{name\}/.test(src)) toks.push('`{name}` — the player\'s name');
  toks.push('Pronouns for the player: `{they}` `{them}` `{their}` `{They}` `{Their}`, and verb helpers `{s}` `{is}` `{has}` `{was}`');
  return toks;
}

const ids = Object.keys(EVENTS).filter(id => hasStub(EVENTS[id].steps));
const missing = ids.filter(id => !NOTES[id]);

const packName = ev => ev.pack ? `${PACKS[ev.pack].name} pack (\`js/packs/${ev.pack}.js\`)` : ev.id.endsWith('_evening') || /^(erin|sakura|shiro|yuki)_romance$/.test(ev.id) ? 'Companions (`js/companions.js`)' : 'Base game (`js/story.js`)';
const groups = {};
for (const id of ids) (groups[packName(EVENTS[id])] ||= []).push(id);

const total = ids.reduce((a, id) => a + countStubs(EVENTS[id].steps), 0);
const written = Object.keys(UNBOUND).length;
const out = [];
out.push('# Unbound Scene Context', '');
out.push(`Every Unbound stub in Binding Codex with its **whole scene**, in the order the player reads it: ${ids.length} scenes, ${total} stubs.`, '');
out.push(`**Written so far:** ${written} stub ids (✅ in the scenes below); the rest are marked ✍️. To revise a written one, edit its lines in \`js/unbound_lines.js\`, or send new text and Momo will swap it in.`, '');
out.push('*Generated by `node tools/stub_context.mjs` from the game\'s event data. Don\'t edit this file by hand; rerun the script after changing a scene. The writing notes come from `UNBOUND_GUIDE.md`.*', '');
out.push('## How to read this', '');
out.push('- Each scene shows the lines leading up to the stub, every choice (the one that leads to your scene is marked), and the **Gentle** and **Steamy** lines.');
out.push('- On Unbound the player sees the **Steamy** line first, then yours. Pick up where it leaves off.');
out.push('- Lines marked *(only if …)* appear in some playthroughs only. Don\'t lean on them in your text.');
out.push('- Write your lines into the stub in the file named in the section heading. Search for the stub id.', '');
out.push('## Contents', '');
for (const [g, list] of Object.entries(groups)) out.push(`- **${g}:** ${list.map(id => `[\`${id}\`](#${id.replace(/_/g, '_')})`).join(', ')}`);
out.push('');

for (const [g, list] of Object.entries(groups)) {
  out.push(`## ${g}`, '');
  for (const id of list) {
    const ev = EVENTS[id];
    out.push(`### ${id}`, '');
    if (WHERE[ev.where]) out.push(`**When:** ${WHERE[ev.where]}${ev.once === false ? ' Repeatable.' : ''}`, '');
    if (ev.tags && ev.tags.length) out.push(`**Tags:** ${ev.tags.join(', ')}`, '');
    const notes = NOTES[id] || [];
    if (notes.length) {
      out.push('**What to write** (from the guide):', '');
      for (const n of notes) out.push(`- *${n.choice}*${n.tags ? ` · ${n.tags}` : ''}: ${n.note}`);
      out.push('');
    }
    out.push('**Tokens you can use:** ' + tokensUsed(ev).join('; ') + '.', '');
    // a revisit is always preceded by her negotiation: show it first
    const neg = id.endsWith('_revisit') && EVENTS[id.replace(/_revisit$/, '_negotiate')];
    if (neg) {
      out.push('**Earlier — the negotiation** (`' + neg.id + '`, plays first; the revisit only happens if the player agreed):', '');
      const n = []; render(neg.steps, 0, n, neg.id); out.push(...n, '');
      out.push('**The scene:**', '');
    } else out.push('**The scene:**', '');
    const lines = []; render(ev.steps, 0, lines, id); out.push(...lines, '');
    out.push('---', '');
  }
}

fs.writeFileSync(path.join(ROOT, 'docs/UNBOUND_CONTEXT.md'), out.join('\n'));
console.log(`wrote docs/UNBOUND_CONTEXT.md: ${ids.length} scenes, ${total} stubs`);
if (missing.length) { console.error('stubs missing from UNBOUND_GUIDE.md:', missing.join(', ')); process.exit(1); }
