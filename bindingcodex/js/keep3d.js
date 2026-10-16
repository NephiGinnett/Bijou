// The Undercroft and the Menagerie as places you can walk: a corridor of cells
// (bars, wall chains or stocks) and a row of pens where beasts wander. Zoe
// walks down the aisle to whoever you pick; the UI shows their card.
import * as THREE from 'three';
import { registerAlias } from './actors3d.js';
import { NAMED_CAPTIVES } from './state.js';
import { ENEMIES } from './data.js';

export const RESTRAINTS = {
  bars:   { name: 'Behind bars', icon: '▥' },
  chains: { name: 'Wall chains', icon: '⛓' },
  stocks: { name: 'The stocks',  icon: '⊓' },
};
const CAP_FACTION_MODEL = { coven: 'coven', vigil: 'vigil', college: 'college', lodge: 'hunter', market: 'cultist' };

// Who a captive looks like: their own model if they're named, otherwise the same
// face they'll have if they ever join you.
export function captiveModel(cap) {
  const nc = cap.named && NAMED_CAPTIVES[cap.named];
  if (nc) return nc.hero || nc.convert || (ENEMIES[cap.defId] && ENEMIES[cap.defId].model) || 'coven';
  const id = 'cv_' + cap.id.replace(/[^a-z0-9]/gi, '').slice(-8);
  registerAlias(id, CAP_FACTION_MODEL[cap.faction] || 'coven');
  return id;
}

const M = {};
function mat(key, color, o = {}) { return (M[key] ||= new THREE.MeshStandardMaterial({ color, roughness: 0.9, ...o })); }
const stone = () => mat('stone', 0x2b2530, { flatShading: true });
const iron = () => mat('iron', 0x3a3a44, { metalness: 0.7, roughness: 0.4 });
const wood = () => mat('wood', 0x5a3a24);
const straw = () => mat('straw', 0x9a7a3a);
const hole = () => mat('hole', 0x0a0608);
function box(w, h, d, m, x, y, z, parent) { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); parent.add(o); return o; }
function cyl(r, h, m, x, y, z, parent, seg = 8) { const o = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), m); o.position.set(x, y, z); parent.add(o); return o; }

function rigOf(a) { return a && a.group.children[0] && a.group.children[0].userData.rig || null; }

// Corridor slots: alternate sides of the aisle, walking away from the camera.
function slot(i, spacing) {
  const side = i % 2 === 0 ? -1 : 1, row = Math.floor(i / 2);
  return { side, row, x: side * 2.35, z: -row * spacing, face: side < 0 ? Math.PI / 2 : -Math.PI / 2 };
}

function setRoom(stage, { fog, floor, tint, density = 0.06 }) {
  stage.envGroup.clear();
  stage.dust = null;
  stage.scene.background = new THREE.Color(fog);
  stage.scene.fog = new THREE.FogExp2(fog, density);
  stage.tintLight.color.set(tint);
  const f = new THREE.Mesh(new THREE.PlaneGeometry(14, 60), new THREE.MeshStandardMaterial({ color: floor, roughness: 1 }));
  f.rotation.x = -Math.PI / 2; f.position.z = -22;
  stage.envGroup.add(f);
}

function torch(stage, x, y, z, flick) {
  box(0.08, 0.4, 0.08, wood(), x, y, z, stage.envGroup);
  const flame = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffb050 }));
  flame.position.set(x, y + 0.28, z); stage.envGroup.add(flame);
  const L = new THREE.PointLight(0xff9a4a, 8, 7); L.position.set(x, y + 0.4, z); stage.envGroup.add(L);
  const ph = Math.random() * 9;
  flick.push(t => { L.intensity = 7 + Math.sin(t * 9 + ph) * 1.2 + Math.sin(t * 23 + ph) * 0.6; flame.scale.setScalar(1 + Math.sin(t * 17 + ph) * 0.15); });
}

// Walk an actor to (x, z), facing where it goes, then turn to `face`.
function walker(stage, a, speed = 2.2) {
  let goal = null;
  const fn = dt => {
    if (!goal) return;
    const dx = goal.x - a.home.x, dz = goal.z - a.home.z, d = Math.hypot(dx, dz);
    if (d < 0.04) { a.home.x = goal.x; a.home.z = goal.z; if (goal.face != null) a.face = goal.face; const r = goal.done; goal = null; if (r) r(); return; }
    const step = Math.min(d, speed * dt);
    a.home.x += dx / d * step; a.home.z += dz / d * step;
    a.face = Math.atan2(dx, dz);
  };
  stage.hooks.add(fn);
  return (x, z, face) => new Promise(done => { goal = { x, z, face, done }; });
}

function hold(stage, a) {
  // let one frame of the rig run so a held pose is in place before we measure hands
  return new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
}

// A little speech bubble over an actor's head, tracked each frame.
function bubble(stage, a, text, ms = 3400, cls = '') {
  const el = document.createElement('div');
  el.className = 'stage-tag cell-whisper ' + cls;
  el.textContent = text;
  stage.overlay.appendChild(el);
  const v = new THREE.Vector3();
  const fn = () => {
    v.copy(a.group.position); v.y += (a.topY || 2.0) + 0.25; v.project(stage.camera);
    el.style.left = ((v.x * 0.5 + 0.5) * 100) + '%';
    el.style.top = ((-v.y * 0.5 + 0.5) * 100) + '%';
    el.style.display = v.z > 1 ? 'none' : '';
  };
  fn(); stage.hooks.add(fn);
  setTimeout(() => { stage.hooks.delete(fn); el.classList.add('fade'); setTimeout(() => el.remove(), 450); }, ms);
}

// What captives whisper to each other across the aisle, by mood and by faction.
const WHISPER = {
  warm: ['She\'s not what they told us.', 'Be civil to her. It goes easier.', 'Did she smile at you today? She smiled at me.', 'I think I want her to come down. Is that strange?'],
  defiant: ['Don\'t tell them anything.', 'The mortar on the third bar is loose. Pass it on.', 'We hold. Whatever she offers, we hold.', 'Count the guards\' steps. Learn them.'],
  fading: ['I can\'t feel the brand anymore. Is that bad?', 'If they let me out... I think I\'d stay.', 'I dreamed of the library last night. I wasn\'t afraid in it.'],
  coven: ['Mother Cinder won\'t come for us. She never comes.', 'The ash in my mouth is gone. I miss it. I don\'t miss it.'],
  vigil: ['Say the vigil prayer with me. Quietly.', 'A knight doesn\'t break. A knight doesn\'t... I\'m so tired.'],
  market: ['What\'s your price? Everyone has a price. What\'s hers?', 'I could sell this cell twice over. Nobody\'s buying.'],
  college: ['I\'ve been counting the stones. Four hundred and twelve.', 'Her wards are elegant. I hate that they\'re elegant.'],
  lodge: ['The hounds upstairs eat better than we ever did.', 'I can smell rain. There\'s a window somewhere.'],
  reply: ['Shh. Footsteps.', '...Maybe.', 'Go to sleep.', 'You too?', 'Mm.', 'Don\'t let her hear you say that.', 'Me neither.'],
};
const pickOf = a => a[Math.floor(Math.random() * a.length)];
function whisperFor(cap) {
  const mood = cap.regard >= 20 ? 'warm' : cap.brand <= 30 ? 'fading' : cap.resolve >= 60 ? 'defiant' : null;
  const pool = [...(mood ? WHISPER[mood] : []), ...(WHISPER[cap.faction] || [])];
  return pickOf(pool.length ? pool : WHISPER.reply);
}
const RATTLE = ['*rattles the bars*', 'Let me OUT.', 'I can hear you out there!', '*bang* *bang* *bang*'];
// What a warden says when their charge tests the restraints.
const STEP_IN = {
  vesper: cap => `Enough, ${cap.name}. You'll hurt your hands, and I'll have to mend them.`,
  rue: cap => `Pull all you like, sweetheart. I wrote that lock.`,
  isolde: cap => `Be still, ${cap.name}. It goes easier if you're still.`,
  calla: cap => `I did that for a month, ${cap.name}. It doesn't open. Sit down.`,
  default: cap => `Easy, ${cap.name}. Easy.`,
};
// The small comforts you've left in a cell, laid out where a person would put them;
// and a cot, once they've come round to you.
function furnish(stage, g, cap, kind) {
  const gifts = cap.gifts || [];
  const side = kind === 'bars' ? 0.72 : 0.78; // keep clear of the pacing (bars) or the restraints
  if (cap.regard >= 20 || gifts.includes('blanket')) {
    box(0.62, 0.08, 1.3, wood(), side, 0.3, -0.35, g);
    for (const [dx, dz] of [[-0.27, 0.6], [0.27, 0.6], [-0.27, -0.6], [0.27, -0.6]]) box(0.06, 0.3, 0.06, wood(), side + dx, 0.15, -0.35 + dz, g);
    box(0.58, 0.07, 1.22, mat('ticking', 0xc8b89a), side, 0.37, -0.35, g);
    if (gifts.includes('blanket')) box(0.6, 0.06, 0.7, mat('blanket', 0x7a2a3a), side, 0.42, -0.15, g);
  } else if (gifts.includes('blanket')) box(0.5, 0.1, 0.4, mat('blanket', 0x7a2a3a), side, 0.06, -0.7, g);
  if (gifts.includes('candle')) {
    cyl(0.04, 0.16, mat('wax', 0xf4ecd8), -side, 0.08, -0.85, g, 10);
    const f = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffc060 }));
    f.position.set(-side, 0.2, -0.85); f.scale.y = 1.6; g.add(f);
    const ph = Math.random() * 9; stage.hooks.add((dt, t) => { f.scale.set(1 + Math.sin(t * 13 + ph) * 0.15, 1.6 + Math.sin(t * 9 + ph) * 0.3, 1); });
  }
  if (gifts.includes('book')) { box(0.22, 0.05, 0.3, mat('book', 0x3a2a5a), -side + 0.05, 0.03, -0.45, g).rotation.y = 0.3; box(0.2, 0.04, 0.28, mat('book2', 0x5a3a2a), -side + 0.08, 0.075, -0.45, g).rotation.y = -0.2; }
  if (gifts.includes('sweets')) { cyl(0.13, 0.02, mat('tin', 0x9a9aa2), -side + 0.1, 0.01, 0.45, g, 16); for (let i = 0; i < 4; i++) cyl(0.035, 0.015, mat('biscuit', 0xd8a85a), -side + 0.1 + Math.cos(i * 1.6) * 0.06, 0.03, 0.45 + Math.sin(i * 1.6) * 0.06, g, 10); }
  if (gifts.includes('flowers')) {
    cyl(0.05, 0.14, mat('jar', 0x8ab8c8, { transparent: true, opacity: 0.6 }), side - 0.05, 0.07, 0.62, g, 12);
    for (let i = 0; i < 5; i++) { const fl = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), new THREE.MeshStandardMaterial({ color: 0xf0c8ff, emissive: 0x9a6ad8, emissiveIntensity: 0.8 })); fl.position.set(side - 0.05 + Math.cos(i * 1.3) * 0.05, 0.2 + (i % 2) * 0.04, 0.62 + Math.sin(i * 1.3) * 0.05); g.add(fl); }
  }
}

// A warden's report on the captive they keep.
function wardenReport(cap) {
  if (cap.releasePending) return `The brand's gone. ${cap.name} is waiting on you.`;
  if (cap.brand <= 25) return 'Brand\'s nearly out. Soon.';
  if (cap.regard >= 20) return `${cap.name} asked when you'd be down.`;
  if (cap.resolve >= 70) return `${cap.name}'s still fighting it.`;
  return 'Quiet night.';
}

function handOffset(arm) {
  // the far end of an arm, in the arm's own space
  const rx = arm.rotation.x, rz = arm.rotation.z;
  arm.rotation.set(0, 0, 0); arm.updateWorldMatrix(true, true);
  const box3 = new THREE.Box3().setFromObject(arm);
  const pivot = new THREE.Vector3().setFromMatrixPosition(arm.matrixWorld);
  const end = arm.worldToLocal(new THREE.Vector3(pivot.x, box3.min.y + 0.05, pivot.z));
  arm.rotation.x = rx; arm.rotation.z = rz;
  return end;
}

// ---------------------------------------------------------------------------
// The cells
// ---------------------------------------------------------------------------
export async function buildCells(stage, caps, player, opts = {}) {
  stage.clearActors();
  setRoom(stage, { fog: 0x07050a, floor: 0x1c171f, tint: 0x6a4ac8, density: 0.075 });
  const SP = 2.8, rows = Math.max(1, Math.ceil(caps.length / 2));
  const len = rows * SP + 2;
  for (const side of [-1, 1]) {
    box(0.4, 3.6, len + 2, stone(), side * 3.55, 1.8, -len / 2 + 1.5, stage.envGroup);
    for (let r = 0; r <= rows; r++) box(2.3, 3.2, 0.25, stone(), side * 2.35, 1.6, -r * SP + SP / 2, stage.envGroup);
  }
  const flick = [];
  for (let r = 0; r < Math.min(rows, 4); r++) torch(stage, (r % 2 ? 1 : -1) * 1.25, 2.75, -r * SP + SP / 2, flick);
  box(7, 3.6, 0.4, stone(), 0, 1.8, -rows * SP + SP / 2 - 0.4, stage.envGroup); // the far end
  stage.hooks.add((dt, t) => flick.forEach(f => f(t)));

  const zoe = stage.addActor('cz_player', player.model, player.variant, { x: 0, z: 3.6, face: Math.PI });
  const walk = walker(stage, zoe);

  const cells = caps.map((cap, i) => {
    const s = slot(i, SP);
    const kind = cap.restraint && RESTRAINTS[cap.restraint] ? cap.restraint : 'bars';
    const standZ = kind === 'chains' ? -0.55 : kind === 'stocks' ? -0.15 : 0;
    // local frame: +z toward the aisle; rotate it into place
    const g = new THREE.Group(); g.position.set(s.x, 0, s.z); g.rotation.y = s.face; stage.envGroup.add(g);
    for (let k = 0; k < 5; k++) box(0.5 + Math.random() * 0.4, 0.04, 0.3 + Math.random() * 0.3, straw(), (Math.random() - 0.5) * 1.6, 0.02, (Math.random() - 0.5) * 1.4, g).rotation.y = Math.random() * 3;
    const wx = s.x + Math.sin(s.face) * standZ, wz = s.z + Math.cos(s.face) * standZ;
    const a = stage.addActor('cell_' + cap.id, captiveModel(cap), null, { x: wx, z: wz, face: s.face });
    return { cap, slot: s, kind, g, a, standZ };
  });
  await Promise.all([zoe.ready, ...cells.map(c => c.a.ready)]);

  const wardens = [];
  // A captive testing the bars or the chains: their warden, if they have one, walks over.
  const tested = c => {
    const w = wardens.find(x => x.list.includes(c));
    if (!w || w.busy || c.focus) return;
    w.busy = true;
    const spot = { x: c.slot.side * 1.0, z: c.slot.z + 0.35, face: c.slot.side < 0 ? -Math.PI / 2 : Math.PI / 2 };
    w.go(spot.x, spot.z, spot.face).then(() => {
      const wr = rigOf(w.a); if (wr) wr.talk(1.4);
      bubble(stage, w.a, (STEP_IN[w.wid] || STEP_IN.default)(c.cap), 3000, 'warden');
      const cr = rigOf(c.a); if (cr) setTimeout(() => cr.talk(0.8), 1200);
      setTimeout(() => { const p = w.post(c); w.go(p.x, p.z, p.face).then(() => { w.busy = false; }); }, 3600);
    });
  };
  for (const c of cells) {
    const rig = rigOf(c.a);
    const kind = rig ? c.kind : 'bars';   // chains and stocks need arms to hold
    c.kind = kind;
    c.a.topY = new THREE.Box3().setFromObject(c.a.group).max.y;
    const H = Math.max(2.2, c.a.topY + 0.4);
    const g = c.g;
    if (kind === 'bars') {
      // once the brand is gone the cell door stands open
      const ajar = !!c.cap.releasePending;
      let doorG = null; const door = () => doorG;
      for (let x = -1.05; x <= 1.06; x += 0.21) if (!ajar || Math.abs(x) > 0.32) cyl(0.028, H, iron(), x, H / 2, 1.0, g, 6);
      if (ajar) {
        const door = doorG = new THREE.Group(); door.position.set(-0.32, 0, 1.0); door.rotation.y = -1.1; g.add(door);
        for (let x = 0.1; x < 0.64; x += 0.21) cyl(0.028, H * 0.92, iron(), x, H * 0.46 + 0.04, 0, door, 6);
        box(0.66, 0.06, 0.06, iron(), 0.32, H * 0.88, 0, door); box(0.66, 0.06, 0.06, iron(), 0.32, 0.14, 0, door);
      }
      box(2.3, 0.08, 0.08, iron(), 0, H, 1.0, g);
      // the lower rails stop at the doorway when it's open
      for (const [w, x] of ajar ? [[0.78, -0.71], [0.78, 0.71]] : [[2.3, 0]]) { box(w, 0.08, 0.08, iron(), x, 0.12, 1.0, g); box(w, 0.06, 0.06, iron(), x, H * 0.55, 1.0, g); }
      if (ajar) box(0.66, 0.06, 0.06, iron(), 0.32, H * 0.55, 0, door());
      // pacing behind the bars
      const ph = Math.random() * 9, hx = c.a.home.x, hz = c.a.home.z;
      const front = g.localToWorld(new THREE.Vector3(0, 0, 0.62));
      stage.hooks.add((dt, t) => {
        if (c.eager) { c.a.home.x += (front.x - c.a.home.x) * Math.min(1, dt * 3); c.a.home.z += (front.z - c.a.home.z) * Math.min(1, dt * 3); c.a.face = c.slot.face; return; }
        if (c.focus) return;
        const o = Math.sin(t * 0.35 + ph) * 0.45; c.a.home.x = hx + Math.cos(c.slot.face) * o; c.a.home.z = hz - Math.sin(c.slot.face) * o;
      });
    } else {
      rig.hold(kind === 'chains' ? 'shackled' : 'stocks');
      await hold(stage, c.a);
      const { armR, armL } = rig.parts;
      const cuffs = [armR, armL].filter(Boolean).map(arm => {
        const m = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.025, 6, 12), iron());
        m.position.copy(handOffset(arm)); m.rotation.x = Math.PI / 2; arm.add(m); return m;
      });
      c.a.group.updateWorldMatrix(true, true);
      const hands = cuffs.map(m => g.worldToLocal(m.getWorldPosition(new THREE.Vector3())));
      if (kind === 'chains') {
        // rings on the back wall, chains that sway with every tug
        const links = hands.map((h, k) => {
          const ring = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.025, 6, 12), iron());
          const rp = new THREE.Vector3(h.x * 1.25, h.y + 0.25, -1.05);
          ring.position.copy(rp); g.add(ring);
          const chain = [];
          for (let j = 0; j < 7; j++) { const l = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.012, 4, 8), iron()); l.rotation.y = j % 2 ? Math.PI / 2 : 0; g.add(l); chain.push(l); }
          return { rp, chain, cuff: cuffs[k] };
        });
        const tmp = new THREE.Vector3();
        stage.hooks.add(() => {
          for (const L of links) {
            const end = g.worldToLocal(L.cuff.getWorldPosition(tmp));
            L.chain.forEach((l, j) => { const u = (j + 1) / (L.chain.length + 1); l.position.lerpVectors(L.rp, end, u); l.position.y -= Math.sin(u * Math.PI) * 0.08; });
          }
        });
      } else {
        // a pillory: two posts and a hinged board, wrists through the holes
        const y = hands.reduce((s, h) => s + h.y, 0) / hands.length, z = hands.reduce((s, h) => s + h.z, 0) / hands.length - 0.04;
        cyl(0.07, y + 0.5, wood(), -0.95, (y + 0.5) / 2, z, g); cyl(0.07, y + 0.5, wood(), 0.95, (y + 0.5) / 2, z, g);
        box(2.0, 0.34, 0.1, wood(), 0, y, z, g);
        box(2.04, 0.03, 0.11, mat('seam', 0x2a1a10), 0, y + 0.02, z, g);
        for (const h of hands) { const o = cyl(0.085, 0.12, hole(), h.x, y, z, g, 12); o.rotation.x = Math.PI / 2; }
      }
      // every so often they test the restraints
      const ph = Math.random() * 6;
      let next = 3 + ph;
      stage.hooks.add((dt, t) => { if (t > next) { next = t + 5 + Math.random() * 6; if (c.cap.resolve >= 40 || Math.random() < 0.4) { rig.tug(); if (c.cap.resolve >= 50) tested(c); } } });
    }
    if (kind === 'bars' && rig && c.cap.resolve >= 55 && !c.cap.releasePending) {
      // the defiant ones rattle the bars now and then
      let next = 6 + Math.random() * 6;
      stage.hooks.add((dt, t) => { if (t > next && !c.eager && !c.focus) { next = t + 9 + Math.random() * 8; rig.act('guard', 1.0); bubble(stage, c.a, pickOf(RATTLE), 2200, 'whisper'); tested(c); } });
    }
    furnish(stage, g, c.cap, kind);
    // regard shows in how they hold themselves: the warm ones turn toward the aisle
    c.a.face = c.slot.face;
  }

  // Wardens keep to the aisle by their charges, walking between them if they keep several.
  const byWarden = new Map();
  cells.forEach(c => { const w = c.cap.wardenId; if (w) { if (!byWarden.has(w)) byWarden.set(w, []); byWarden.get(w).push(c); } });
  for (const [wid, list] of byWarden) {
    // posted at the corner past the cell door, out of the way of anyone looking in
    const post = c => ({ x: c.slot.side * 1.1, z: c.slot.z - 1.3, face: c.slot.side < 0 ? -Math.PI / 4 : Math.PI / 4 });
    const p0 = post(list[0]);
    const w = stage.addActor('cw_' + wid, wid, opts.variantOf ? opts.variantOf(wid) : null, { x: p0.x, z: p0.z, face: p0.face });
    const wd = { wid, list, a: w, post, go: walker(stage, w, 1.3), busy: false };
    wardens.push(wd);
    w.ready.then(() => { w.topY = new THREE.Box3().setFromObject(w.group).max.y; });
    if (list.length > 1) {
      (async () => { for (let k = 1; stage.actors.get('cw_' + wid) === w; k++) { await new Promise(r => setTimeout(r, 5000 + Math.random() * 4000)); if (stage.actors.get('cw_' + wid) !== w) return; if (wd.busy) continue; wd.busy = true; const p = post(list[k % list.length]); await wd.go(p.x, p.z, p.face); wd.busy = false; } })();
    }
  }
  await Promise.all(wardens.map(w => w.a.ready));

  // Across the aisle, captives whisper to each other when Zoe isn't close.
  const zoeNear = c => Math.hypot(zoe.home.x - c.slot.x, zoe.home.z - c.slot.z) < 3.2;
  const overheard = {};
  let nextWhisper = 4;
  stage.hooks.add((dt, t) => {
    if (t < nextWhisper) return;
    nextWhisper = t + 7 + Math.random() * 6;
    const pairs = [];
    for (let i = 0; i + 1 < cells.length; i += 2) if (!zoeNear(cells[i]) && !zoeNear(cells[i + 1])) pairs.push([cells[i], cells[i + 1]]);
    if (!pairs.length) return;
    const [x, y] = Math.random() < 0.5 ? pickOf(pairs) : pickOf(pairs).slice().reverse();
    const line = whisperFor(x.cap), reply = pickOf(WHISPER.reply);
    overheard[x.cap.id] = `${x.cap.name}, to ${y.cap.name}: "${line}"`;
    overheard[y.cap.id] = overheard[x.cap.id] + ` ${y.cap.name}: "${reply}"`;
    const rx = rigOf(x.a), ry = rigOf(y.a);
    if (rx) rx.talk(2.2); bubble(stage, x.a, line, 3400, 'whisper');
    setTimeout(() => { if (ry) ry.talk(1); bubble(stage, y.a, reply, 2600, 'whisper'); }, 1900);
  });

  // Captives who are nearly free come up to the bars (or call out) when Zoe passes.
  stage.hooks.add(() => {
    for (const c of cells) {
      const keen = c.cap.releasePending || c.cap.brand <= 25 || c.cap.regard >= 40;
      const near = keen && zoeNear(c);
      if (near && !c.eager) {
        c.eager = true;
        const rig = rigOf(c.a);
        if (rig) { rig.talk(1.2); if (c.kind === 'bars') rig.wave(); else rig.tug(); }
        bubble(stage, c.a, c.cap.releasePending ? 'It\'s gone. The brand. Look!' : c.cap.regard >= 40 ? 'You came!' : 'Is it today? Is it soon?', 2800);
      } else if (!near && c.eager) c.eager = false;
    }
  });

  const overview = () => stage.focus(new THREE.Vector3(0, 4.6, 5.0), new THREE.Vector3(0, 0.8, -rows * SP / 2 + 0.4), 3.4);
  stage.orbitEnabled = true; stage.resetView();
  stage.camBase.set(0, 4.6, 5.0); stage.camTarget.set(0, 0.8, -rows * SP / 2 + 0.4); stage.viewHalfW = 3.4;

  async function visit(i) {
    const c = cells[i]; if (!c) return;
    cells.forEach(x => x.focus = false); c.focus = true;
    // Zoe stops just past the cell door, so she frames the shot instead of blocking it
    const az = c.slot.z, ax = c.slot.side * 0.55, zz = az - 0.75;
    stage.resetView();
    // stand across the aisle and look straight in, Zoe at the near edge of the frame
    stage.focus(new THREE.Vector3(-c.slot.side * 0.55, 2.0, az + 1.9), new THREE.Vector3(c.slot.x * 0.85, 1.05, az), 1.7, 900);
    await walk(ax, zz, Math.atan2(c.slot.x - ax, az - zz));
    const w = wardens.find(x => x.list.includes(c));
    if (w) { const wr = rigOf(w.a); if (wr) wr.talk(1.6); bubble(stage, w.a, wardenReport(c.cap), 3600, 'warden'); }
    const rig = rigOf(c.a);
    if (rig) {
      rig.talk(1.4);
      if (c.kind !== 'bars') { if (c.cap.resolve >= 50) rig.tug(); }
      else if (c.cap.regard >= 20) rig.wave();
      else if (c.cap.resolve >= 70) rig.act('guard', 1.2);
    }
  }
  return { cells, visit, overview, overheard: id => overheard[id] || null, warden: id => (wardens.find(x => x.list.some(c => c.cap.id === id)) || {}).wid || null, back: () => { cells.forEach(x => x.focus = false); walk(0, 3.6, Math.PI); return overview(); } };
}

// ---------------------------------------------------------------------------
// The pens
// ---------------------------------------------------------------------------
export async function buildPens(stage, beasts, pens, eggs, player) {
  stage.clearActors();
  setRoom(stage, { fog: 0x14100c, floor: 0x3a3020, tint: 0xc8a050, density: 0.05 });
  const SP = 3.5, n = Math.max(pens, beasts.length), rows = Math.max(1, Math.ceil(n / 2));
  const flick = [];
  for (let r = 0; r < Math.min(rows, 4); r++) torch(stage, (r % 2 ? 1 : -1) * 0.75, 1.9, -r * SP, flick);
  stage.hooks.add((dt, t) => flick.forEach(f => f(t)));
  const grass = mat('grass', 0x3c4a28);

  const zoe = stage.addActor('pz_player', player.model, player.variant, { x: 0, z: 4.0, face: Math.PI });
  const walk = walker(stage, zoe);

  const penOf = i => { const s = slot(i, SP); return { ...s, cx: s.side * 2.6 }; };
  const items = [];
  for (let i = 0; i < n; i++) {
    const p = penOf(i), g = new THREE.Group(); g.position.set(p.cx, 0, p.z); stage.envGroup.add(g);
    box(3.0, 0.02, 3.0, grass, 0, 0.01, 0, g);
    // fence: posts and two rails, with a gate gap on the aisle side
    const gx = -p.side * 1.5;
    for (const [x0, z0, x1, z1] of [[-1.5, -1.5, 1.5, -1.5], [-1.5, 1.5, 1.5, 1.5], [p.side * 1.5, -1.5, p.side * 1.5, 1.5], [gx, -1.5, gx, -0.45], [gx, 0.45, gx, 1.5]]) {
      const len = Math.hypot(x1 - x0, z1 - z0), mx = (x0 + x1) / 2, mz = (z0 + z1) / 2, ang = Math.atan2(x1 - x0, z1 - z0);
      for (const y of [0.35, 0.7]) { const r = box(0.06, 0.07, len, wood(), mx, y, mz, g); r.rotation.y = ang; }
      cyl(0.06, 0.9, wood(), x0, 0.45, z0, g); cyl(0.06, 0.9, wood(), x1, 0.45, z1, g);
    }
    const b = beasts[i];
    const trough = box(0.9, 0.25, 0.4, wood(), p.side * 0.8, 0.13, -1.05, g);
    if (b) box(0.8, 0.05, 0.3, mat(b.fed ? 'food' : 'empty', b.fed ? 0x8a6a2a : 0x2a1a10), 0, 0.13, 0, trough);
    if (!b) {
      for (let k = 0; k < 4; k++) box(0.5, 0.05, 0.4, straw(), (Math.random() - 0.5) * 1.8, 0.04, (Math.random() - 0.5) * 1.8, g).rotation.y = Math.random() * 3;
      continue;
    }
    const def = ENEMIES[b.defId] || {};
    const a = stage.addActor('pen_' + b.id, def.model || 'ember_hound', def.variant || null, { x: p.cx, z: p.z, face: Math.random() * 6 });
    items.push({ b, p, a });
  }
  // eggs in a straw nest by the gate of the first free pen, or at the near end
  if (eggs.length) {
    const free = beasts.length < n ? penOf(beasts.length) : { cx: 0, z: 2.0, side: 1 };
    const nest = new THREE.Group(); nest.position.set(free.cx * (beasts.length < n ? 1 : 0), 0, free.z); stage.envGroup.add(nest);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.12, 6, 14), straw()); ring.rotation.x = Math.PI / 2; ring.position.y = 0.1; nest.add(ring);
    eggs.slice(0, 5).forEach((e, k) => {
      const egg = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), mat('egg_' + e.variant, e.variant === 'luminous' ? 0xf4e8a0 : 0xe8dcc8, e.variant === 'luminous' ? { emissive: 0x806020 } : {}));
      egg.scale.y = 1.3; egg.position.set(Math.cos(k * 2.4) * 0.15, 0.17, Math.sin(k * 2.4) * 0.15); nest.add(egg);
      const ph = k; stage.hooks.add((dt, t) => { egg.rotation.z = Math.sin(t * 3 + ph) * (Math.sin(t * 0.7 + ph) > 0.8 ? 0.25 : 0.03); });
    });
  }
  await Promise.all([zoe.ready, ...items.map(it => it.a.ready)]);

  for (const it of items) {
    // keep big beasts inside their pens
    const h = new THREE.Box3().setFromObject(it.a.group); const size = Math.max(h.max.y - h.min.y, h.max.x - h.min.x, h.max.z - h.min.z);
    if (size > 1.9) it.a.group.scale.setScalar(1.9 / size);
    const { b, p, a } = it;
    let goal = null, wait = Math.random() * 2;
    const speed = 0.5 + Math.random() * 0.4;
    it.call = (x, z) => { goal = { x, z, hold: 4 }; wait = 0; };
    stage.hooks.add(dt => {
      if (wait > 0) { wait -= dt; return; }
      if (!goal) {
        const hungry = !b.fed && b.hunger >= 50 && Math.random() < 0.6;
        goal = hungry ? { x: p.cx + p.side * 0.8, z: p.z - 0.6, hold: 3 } : { x: p.cx + (Math.random() - 0.5) * 2.0, z: p.z + (Math.random() - 0.5) * 2.0, hold: 1 + Math.random() * 3 };
      }
      const dx = goal.x - a.home.x, dz = goal.z - a.home.z, d = Math.hypot(dx, dz);
      if (d < 0.05) { wait = goal.hold; goal = null; return; }
      const s = Math.min(d, speed * dt);
      a.home.x += dx / d * s; a.home.z += dz / d * s;
      const want = Math.atan2(dx, dz); let df = want - a.face; df = Math.atan2(Math.sin(df), Math.cos(df));
      a.face += df * Math.min(1, dt * 5);
    });
  }

  const overview = () => stage.focus(new THREE.Vector3(0, 4.2, 5.8), new THREE.Vector3(0, 0.6, -rows * SP / 2 + 1), 4.2);
  stage.orbitEnabled = true; stage.resetView();
  stage.camBase.set(0, 4.2, 5.8); stage.camTarget.set(0, 0.6, -rows * SP / 2 + 1); stage.viewHalfW = 4.2;

  async function visit(i) {
    const it = items[i]; if (!it) return;
    const { p, b } = it;
    const gateX = p.cx - p.side * 1.5;
    stage.resetView();
    stage.focus(new THREE.Vector3(-p.side * 2.0, 2.6, p.z + 3.0), new THREE.Vector3(p.cx * 0.7, 0.7, p.z), 2.4, 900);
    // tame beasts trot over to the gate; skittish ones keep their distance
    if (b.tame >= 50) it.call(gateX + p.side * 0.55, p.z);
    else if (b.tame < 25) it.call(p.cx + p.side * 1.0, p.z - 0.9);
    const zx = gateX - p.side * 0.45, zz = p.z - 1.1;
    await walk(zx, zz, Math.atan2(p.cx - zx, p.z - zz));
  }
  function pet(i, ok) {
    const it = items[i]; if (!it) return;
    const pos = it.a.group.position.clone(); pos.y += 1.0;
    if (ok) stage.burst(pos, 0xff8ab8, 12, 1.6); else stage.burst(pos, 0xff4040, 6, 2.4);
    const r = rigOf(zoe); if (r) r.act(ok ? 'toss' : 'flinch', 0.7);
  }
  return { items, visit, pet, overview, back: () => { walk(0, 4.0, Math.PI); return overview(); } };
}
