import { boot } from './ui.js';

boot().catch(err => {
  console.error(err);
  const u = document.querySelector('#ui');
  if (u) u.innerHTML = `<div class="panel small center-panel"><h2>Failed to start</h2><p class="muted">${String(err && err.message || err)}</p><p class="muted">Serve this folder over HTTP (e.g. <code>python3 -m http.server</code>) — ES modules don't load from file://.</p></div>`;
  u.className = 'center';
});
