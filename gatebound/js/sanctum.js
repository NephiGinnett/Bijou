// ============================================================
// GATEBOUND — the Sanctum (AI chat with the guild)
// A permanently available chat room: talk to party members and
// petitioning newcomers, powered by any KoboldCpp or
// OpenAI-compatible endpoint the player configures. Entirely
// optional — the game never depends on it.
//
// Histories live outside the save (gatebound_chat_<id>) so save
// codes stay small. Connection settings live in S.settings.sanctum.
// ============================================================

import { HEROES, RANKS, recruitOffers } from './data.js';
import { roster } from './state.js';
import { SPEAKERS } from './story.js';

const CHAT_KEY = id => 'gatebound_chat_' + id;
const HISTORY_PROMPT_LIMIT = 30;  // messages sent to the model
const HISTORY_STORE_LIMIT = 200;  // messages kept on disk

function loadChat(id) {
  try { return JSON.parse(localStorage.getItem(CHAT_KEY(id))) || []; } catch (e) { return []; }
}
function saveChat(id, msgs) {
  try { localStorage.setItem(CHAT_KEY(id), JSON.stringify(msgs.slice(-HISTORY_STORE_LIMIT))); } catch (e) { /* quota */ }
}

function sanctumSettings(S) {
  if (!S.settings.sanctum) S.settings.sanctum = { url: '', mode: 'openai', model: '', key: '' };
  return S.settings.sanctum;
}

// ------------------------------------------------------------------
// system prompt — clarifies the game context for the model
// ------------------------------------------------------------------

function bondStage(b) {
  if (b >= 10) return 'deeply, openly in love with the player — you have said the words and meant them';
  if (b >= 7) return 'falling for the player and increasingly bad at hiding it';
  if (b >= 4) return 'a trusted companion who has bled beside the player';
  if (b >= 1) return 'a comrade who is warming up to the player';
  return 'a new acquaintance, still taking the player\'s measure';
}

export function buildSystemPrompt(S, id, isCandidate) {
  const def = HEROES[id];
  const rank = RANKS[S.rankIdx];
  const lvl = S.heroes[id] ? S.heroes[id].level : def.startLevel;
  const bond = S.bond[id];

  const lines = [];
  lines.push(`You are roleplaying as ${def.name} (${def.epithet}), a character in GATEBOUND — a fantasy RPG about an adventurers' guild that dives dimensional "gates" full of monsters. Stay in character at all times.`);
  lines.push('');
  lines.push('THE WORLD: Gates rank from F (trivial) to S (catastrophic). Adventurers hold guild licenses and clear gates for guild points. The player character carries "the System" — an entity only they can perceive that grants impossible growth, one gate at a time.'
    + (S.cleared
      ? ` The player recently did the unthinkable: cleared the S-rank Monarch's Threshold and closed the great gate. Everyone in the guild world knows their name now.${(S.ngPlus || 0) > 0 ? ` Since then they have cleared ${S.ngPlus} recursion echo${S.ngPlus > 1 ? 'es' : ''} of the Threshold — they are still getting stronger, which should be impossible.` : ''}`
      : ' The great S-rank gate, the Monarch\'s Threshold, still looms unconquered.'));
  lines.push('');
  lines.push(`YOUR CHARACTER: ${def.name}, ${def.cls} (level ${lvl}). ${def.desc}`);
  if (def.persona) lines.push(`PERSONALITY: ${def.persona}`);
  lines.push('');
  if (isCandidate) {
    lines.push(`YOUR SITUATION: You are NOT yet a guild member. You came to the guild hall because you heard about the player's legendary clear and their impossible growth rate, and you are trying to join their guild. You are speaking with the player right now — make your case, in your own voice, but don't be a pushover about it.`);
  } else {
    lines.push(`YOUR SITUATION: You are a member of the player's guild party. You run gates together, camp together, and trust each other with your lives.${bond != null ? ` Relationship: you are ${bondStage(bond)} (bond ${bond}/10).` : ''}`);
  }
  lines.push('');
  lines.push(`THE PLAYER: ${S.name}, guild license rank ${rank}, level ${S.heroes.player.level}, known as "the Fourth." It is day ${S.day} of their story. You are talking with them in the guild hall between gate dives.`);
  lines.push('');
  lines.push(`STYLE: Reply as ${def.name} only — never write the player's words or actions. Keep replies conversational, 1–3 short paragraphs. Match the game's tone: warm, witty fantasy adventure${S.settings.spice === 'steamy' ? ', romance allowed to simmer when the bond supports it' : ', romance kept gentle and sweet'}. No out-of-character commentary.`);
  return lines.join('\n');
}

// ------------------------------------------------------------------
// providers
// ------------------------------------------------------------------

async function callOpenAI(cfg, sys, history, userMsg) {
  const base = cfg.url.replace(/\/+$/, '');
  const url = /\/chat\/completions/.test(base) ? base
    : /\/v1$/.test(base) ? base + '/chat/completions'
    : base + '/v1/chat/completions';
  const messages = [
    { role: 'system', content: sys },
    ...history.slice(-HISTORY_PROMPT_LIMIT).map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMsg },
  ];
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(cfg.key ? { Authorization: 'Bearer ' + cfg.key } : {}),
    },
    body: JSON.stringify({ model: cfg.model || 'default', messages, max_tokens: 360, temperature: 0.85 }),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const data = await res.json();
  const out = data.choices && data.choices[0] && (data.choices[0].message?.content ?? data.choices[0].text);
  if (!out) throw new Error('empty response');
  return out.trim();
}

async function callKobold(cfg, sys, history, userMsg, charName, playerName) {
  const base = cfg.url.replace(/\/+$/, '');
  const url = /\/api\/v1\/generate/.test(base) ? base : base + '/api/v1/generate';
  const convo = history.slice(-HISTORY_PROMPT_LIMIT)
    .map(m => `${m.role === 'user' ? playerName : charName}: ${m.content}`).join('\n');
  const prompt = `${sys}\n\n${convo ? convo + '\n' : ''}${playerName}: ${userMsg}\n${charName}:`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      max_length: 320,
      temperature: 0.85,
      stop_sequence: [`\n${playerName}:`, `\n${charName}:`],
    }),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const data = await res.json();
  const out = data.results && data.results[0] && data.results[0].text;
  if (!out) throw new Error('empty response');
  return out.trim();
}

// ------------------------------------------------------------------
// UI
// ------------------------------------------------------------------

export function openSanctum(ctx, selId = null) {
  const { S, screen, portraitImg, toast, esc, back } = ctx;
  const members = roster(S).filter(id => id !== 'player');
  const candidates = recruitOffers(S).map(h => h.id);
  const everyone = [...members, ...candidates];
  if (!everyone.length) { toast('No one is around to talk to.'); back(); return; }
  const sel = selId && everyone.includes(selId) ? selId : everyone[0];
  const isCandidate = candidates.includes(sel);
  const cfg = sanctumSettings(S);
  const msgs = loadChat(sel);
  const def = HEROES[sel];

  const tabs = everyone.map(id => `
    <button class="tab ${id === sel ? 'on' : ''}" data-id="${id}" style="--tc:${SPEAKERS[id]?.color || '#fff'}">
      ${HEROES[id].name}${candidates.includes(id) ? ' <small class="muted">(petitioning)</small>' : ''}
    </button>`).join('');

  const msgHtml = m => `
    <div class="chat-msg ${m.role}">
      <b style="color:${m.role === 'user' ? '#e8d8a8' : (SPEAKERS[sel]?.color || '#fff')}">${m.role === 'user' ? esc(S.name) : HEROES[sel].name}</b>
      <p>${esc(m.content)}</p>
    </div>`;

  screen(`
    <div class="panel sheet-panel sanctum-panel">
      <div class="row spread">
        <h2>✉ The Sanctum</h2>
        <div class="row gap">
          <button class="btn sm ghost" id="sc-config">⚙ Connection</button>
          <button class="btn ghost" id="sc-back">← Guild</button>
        </div>
      </div>
      <div class="tabs">${tabs}</div>
      <div class="sanctum-body">
        <div class="sanctum-side">
          ${portraitImg(sel, 'big')}
          <b style="color:${SPEAKERS[sel]?.color || '#fff'}">${def.name}</b>
          <span class="muted sm-text">${def.epithet} · ${def.cls}</span>
          <span class="muted sm-text">${isCandidate ? 'Hoping to join the guild.' : 'Guild member.'}</span>
          ${msgs.length ? '<button class="btn sm ghost" id="sc-clear">clear history</button>' : ''}
        </div>
        <div class="sanctum-chat">
          <div class="chat-log" id="chat-log">
            ${msgs.length ? msgs.map(msgHtml).join('')
              : `<p class="muted center-text" style="margin-top:20px">${cfg.url
                ? `Say something to ${def.name}. The Sanctum carries your words across.`
                : 'No oracle is connected. Set an endpoint under <b>⚙ Connection</b> — any KoboldCpp or OpenAI-compatible server works — and the guild starts talking back.'}</p>`}
          </div>
          <div class="chat-input-row">
            <textarea id="chat-input" rows="2" placeholder="Speak with ${def.name}…"></textarea>
            <button class="btn primary" id="chat-send">Send</button>
          </div>
        </div>
      </div>
    </div>
  `);

  const log = document.querySelector('#chat-log');
  const input = document.querySelector('#chat-input');
  log.scrollTop = log.scrollHeight;

  document.querySelector('#sc-back').onclick = () => back();
  document.querySelectorAll('.tab').forEach(t => t.onclick = () => openSanctum(ctx, t.dataset.id));
  document.querySelector('#sc-config').onclick = () => configModal(ctx, () => openSanctum(ctx, sel));
  const clearBtn = document.querySelector('#sc-clear');
  if (clearBtn) clearBtn.onclick = () => {
    if (confirm(`Forget your conversation with ${def.name}?`)) {
      try { localStorage.removeItem(CHAT_KEY(sel)); } catch (e) {}
      openSanctum(ctx, sel);
    }
  };

  let busy = false;
  const send = async () => {
    const text = input.value.trim();
    if (!text || busy) return;
    if (!cfg.url) { toast('Set a connection first (⚙ Connection).', 'danger'); return; }
    busy = true;
    input.value = '';

    msgs.push({ role: 'user', content: text });
    log.insertAdjacentHTML('beforeend', msgHtml(msgs[msgs.length - 1]));
    const thinking = document.createElement('div');
    thinking.className = 'chat-msg assistant thinking';
    thinking.innerHTML = `<b style="color:${SPEAKERS[sel]?.color || '#fff'}">${def.name}</b><p>…</p>`;
    log.appendChild(thinking);
    log.scrollTop = log.scrollHeight;

    try {
      const sys = buildSystemPrompt(S, sel, isCandidate);
      const history = msgs.slice(0, -1);
      const reply = cfg.mode === 'kobold'
        ? await callKobold(cfg, sys, history, text, def.name, S.name)
        : await callOpenAI(cfg, sys, history, text);
      msgs.push({ role: 'assistant', content: reply });
      saveChat(sel, msgs);
      thinking.remove();
      log.insertAdjacentHTML('beforeend', msgHtml(msgs[msgs.length - 1]));
    } catch (e) {
      thinking.remove();
      msgs.pop(); // keep history consistent with what the model saw
      input.value = text;
      toast(`The Sanctum flickers: ${e.message || e}`, 'danger');
    }
    log.scrollTop = log.scrollHeight;
    busy = false;
  };
  document.querySelector('#chat-send').onclick = send;
  input.onkeydown = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    e.stopPropagation(); // don't let Enter advance dialogue underneath
  };
  input.focus();
}

function configModal(ctx, done) {
  const { S, toast, esc } = ctx;
  const cfg = sanctumSettings(S);
  const modal = document.createElement('div');
  modal.className = 'modal-layer';
  modal.innerHTML = `<div class="panel modal">
    <h3>⚙ Sanctum Connection</h3>
    <p class="muted sm-text">Point the Sanctum at any local or remote AI endpoint. Nothing is sent anywhere until you press Send.</p>
    <label class="set-row">Type <select id="cx-mode">
      <option value="openai" ${cfg.mode !== 'kobold' ? 'selected' : ''}>OpenAI-compatible</option>
      <option value="kobold" ${cfg.mode === 'kobold' ? 'selected' : ''}>KoboldCpp</option>
    </select></label>
    <label class="set-row">URL <input id="cx-url" placeholder="http://localhost:5001" value="${esc(cfg.url || '')}"></label>
    <label class="set-row">Model <input id="cx-model" placeholder="(optional)" value="${esc(cfg.model || '')}"></label>
    <label class="set-row">API key <input id="cx-key" type="password" placeholder="(optional)" value="${esc(cfg.key || '')}"></label>
    <div class="row gap">
      <button class="btn primary" id="cx-save">Save</button>
      <button class="btn ghost" id="cx-cancel">Cancel</button>
    </div>
  </div>`;
  document.body.appendChild(modal);
  modal.querySelector('#cx-cancel').onclick = () => { modal.remove(); done(); };
  modal.querySelector('#cx-save').onclick = () => {
    cfg.mode = modal.querySelector('#cx-mode').value;
    cfg.url = modal.querySelector('#cx-url').value.trim();
    cfg.model = modal.querySelector('#cx-model').value.trim();
    cfg.key = modal.querySelector('#cx-key').value.trim();
    ctx.save();
    toast('Sanctum connection saved.');
    modal.remove();
    done();
  };
}
