// ============================================================
// TOON — the "soft toon" look for procedural characters.
// Smooth, rounded shapes; cel shading (three tones per color); a thin
// dark outline on every part (inverted hull); and a painted anime face
// drawn into a canvas texture. Characters opt in one at a time.
// ============================================================

import * as THREE from 'three';

// --- materials -----------------------------------------------------------------------

let gradient = null;
function toonGradient() {
  if (gradient) return gradient;
  // three tones: shadow, mid, lit
  const data = new Uint8Array([90, 90, 90, 255, 175, 175, 175, 255, 255, 255, 255, 255]);
  gradient = new THREE.DataTexture(data, 3, 1, THREE.RGBAFormat);
  gradient.minFilter = gradient.magFilter = THREE.NearestFilter;
  gradient.needsUpdate = true;
  return gradient;
}
// skin gets a softer ramp, so faces don't look banded
let softGradient = null;
function toonGradientSoft() {
  if (softGradient) return softGradient;
  const data = new Uint8Array([165, 165, 165, 255, 205, 205, 205, 255, 235, 235, 235, 255, 255, 255, 255, 255]);
  softGradient = new THREE.DataTexture(data, 4, 1, THREE.RGBAFormat);
  softGradient.minFilter = softGradient.magFilter = THREE.NearestFilter;
  softGradient.needsUpdate = true;
  return softGradient;
}
export function tmat(color, o = {}) {
  const m = new THREE.MeshToonMaterial({ color, gradientMap: o.soft ? toonGradientSoft() : toonGradient(), emissive: o.emissive ?? 0x000000, emissiveIntensity: o.ei ?? 1 });
  if (o.map) { m.map = o.map; m.transparent = true; m.depthWrite = false; m.polygonOffset = true; m.polygonOffsetFactor = -2; }
  m.userData.noOutline = !!(o.noOutline || o.emissive || o.map);
  return m;
}
export function tadd(parent, geo, material, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  const m = new THREE.Mesh(geo, material);
  m.position.set(x, y, z); m.rotation.set(rx, ry, rz);
  parent.add(m);
  return m;
}
// smooth primitives
export const SS = (r, w = 32, h = 24) => new THREE.SphereGeometry(r, w, h);
export const SC = (r, l) => new THREE.CapsuleGeometry(r, l, 8, 20);
export const ST = (r, t) => new THREE.TorusGeometry(r, t, 10, 32);

// --- outlines (inverted hull) ---------------------------------------------------------

function darker(hex, f = 0.35) { const c = new THREE.Color(hex); return c.multiplyScalar(f); }
export function outline(group, width = 0.016) {
  const meshes = [];
  group.traverse(o => { if (o.isMesh && !o.material.userData.noOutline && !o.userData.isOutline) meshes.push(o); });
  for (const m of meshes) {
    m.geometry.computeBoundingSphere();
    const r = Math.max(0.02, m.geometry.boundingSphere.radius * Math.max(m.scale.x, m.scale.y, m.scale.z));
    const hull = new THREE.Mesh(m.geometry, new THREE.MeshBasicMaterial({ color: darker(m.material.color), side: THREE.BackSide }));
    hull.userData.isOutline = true;
    const k = 1 + Math.min(0.25, width / r);
    hull.scale.setScalar(k);
    // grow the hull about the part's own center, not its origin (lathes sit at the figure's feet)
    hull.position.copy(m.geometry.boundingSphere.center).multiplyScalar(1 - k);
    m.add(hull);
  }
  return group;
}

// --- the painted face ---------------------------------------------------------------

// A canvas texture wrapped over the front of the head: big glossy anime
// eyes with lashes and highlights, soft brows, blush and a small smile.
export function faceTexture({ eye = 0x8a5ad8, brow = 0x8a6a3a, blush = 0xff8aa0, lashes = 0x2a1a22, mouth = 'smile', closed = false, lip = 0x8a3a4a, shadow = null, fang = true, slit = false, tear = null, freckles = false, mature = 0 } = {}) {
  const W = 512, H = 256;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const c = cv.getContext('2d');
  const hex = n => '#' + new THREE.Color(n).getHexString();
  const shade = (n, f) => '#' + new THREE.Color(n).multiplyScalar(f).getHexString();
  const lift = (n, f) => '#' + new THREE.Color(n).lerp(new THREE.Color(0xffffff), f).getHexString();
  if (mature) { paintGrownFace(c, W, { eye, brow, blush, lashes, mouth, closed, lip, shadow, freckles, age: mature, hex, shade, lift }); return canvasTex(cv); }
  for (const side of [-1, 1]) {
    const cx = W / 2 + side * 78, cy = 118, rx = 30, ry = 42;
    if (shadow != null) {
      // eyeshadow: a soft smoky wash over the lid, flicked out at the corner
      const sh = c.createRadialGradient(cx + side * 22, cy + 8, 6, cx + side * 22, cy + 8, 64);
      sh.addColorStop(0, hex(shadow) + 'dd'); sh.addColorStop(0.55, hex(shadow) + '77'); sh.addColorStop(1, hex(shadow) + '00');
      c.fillStyle = sh; c.beginPath(); c.ellipse(cx + side * 20, cy + 6, rx + 34, ry + 16, side * 0.35, 0, Math.PI * 2); c.fill();
    }
    if (closed) {
      c.strokeStyle = hex(lashes); c.lineCap = 'round'; c.lineWidth = 8;
      c.beginPath(); c.ellipse(cx, cy + 10, rx + 6, 14, 0, Math.PI * 0.05, Math.PI * 0.95); c.stroke();
      c.lineWidth = 5; c.beginPath(); c.moveTo(cx + side * (rx + 4), cy + 14); c.lineTo(cx + side * (rx + 16), cy + 6); c.stroke();
      c.strokeStyle = hex(brow); c.lineWidth = 6;
      c.beginPath(); c.moveTo(cx - side * 26, cy - ry - 18); c.quadraticCurveTo(cx + side * 4, cy - ry - 30, cx + side * 30, cy - ry - 20); c.stroke();
      const b = c.createRadialGradient(cx + side * 34, cy + 66, 2, cx + side * 34, cy + 66, 36);
      b.addColorStop(0, hex(blush) + 'aa'); b.addColorStop(1, hex(blush) + '00');
      c.fillStyle = b; c.beginPath(); c.ellipse(cx + side * 34, cy + 66, 40, 22, 0, 0, Math.PI * 2); c.fill();
      continue;
    }
    // white of the eye
    c.fillStyle = '#fbf7f4'; c.beginPath(); c.ellipse(cx, cy + 4, rx + 6, ry, 0, 0, Math.PI * 2); c.fill();
    // iris: light at the bottom, deep at the top
    const g = c.createLinearGradient(0, cy - ry, 0, cy + ry);
    g.addColorStop(0, shade(eye, 0.45)); g.addColorStop(0.55, hex(eye)); g.addColorStop(1, lift(eye, 0.55));
    c.fillStyle = g; c.beginPath(); c.ellipse(cx, cy + 6, rx, ry - 4, 0, 0, Math.PI * 2); c.fill();
    // pupil (a slit for serpents and drakes)
    c.fillStyle = shade(eye, 0.25); c.beginPath(); c.ellipse(cx, cy + 2, rx * (slit ? 0.14 : 0.45), ry * (slit ? 0.72 : 0.5), 0, 0, Math.PI * 2); c.fill();
    // highlights
    c.fillStyle = 'rgba(255,255,255,0.95)';
    c.beginPath(); c.ellipse(cx - side * 10 - 6, cy - 14, 10, 13, -0.3, 0, Math.PI * 2); c.fill(); c.beginPath(); c.ellipse(cx + 10, cy + 22, 5, 5, 0, 0, Math.PI * 2); c.fill();
    // upper lash line, with a flick at the outer corner
    c.strokeStyle = hex(lashes); c.lineCap = 'round'; c.lineWidth = 9;
    c.beginPath(); c.ellipse(cx, cy + 6, rx + 8, ry + 2, 0, Math.PI * 1.08, Math.PI * 1.92); c.stroke();
    c.lineWidth = 6; c.beginPath(); c.moveTo(cx + side * (rx + 6), cy - 18); c.lineTo(cx + side * (rx + 18), cy - 30); c.stroke();
    if (shadow != null) { c.lineWidth = 7; c.beginPath(); c.moveTo(cx + side * (rx + 4), cy + 2); c.quadraticCurveTo(cx + side * (rx + 20), cy - 6, cx + side * (rx + 34), cy - 22); c.stroke(); }
    // a soft lower lash
    c.lineWidth = shadow != null ? 5 : 3; c.globalAlpha = shadow != null ? 0.9 : 0.6; c.beginPath(); c.ellipse(cx, cy + 4, rx + 4, ry, 0, Math.PI * 0.2, Math.PI * 0.8); c.stroke(); c.globalAlpha = 1;
    // brow (slimmer and higher-arched on a grown woman)
    c.strokeStyle = hex(brow); c.lineWidth = 6;
    c.beginPath(); c.moveTo(cx - side * 26, cy - ry - 22); c.quadraticCurveTo(cx + side * 4, cy - ry - 34, cx + side * 30, cy - ry - 24); c.stroke();
    // cheetah tear-marks: a dark line from the inner eye down the cheek
    if (tear != null) { c.strokeStyle = hex(tear); c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(cx - side * 22, cy + ry - 2); c.quadraticCurveTo(cx - side * 26, cy + ry + 30, cx - side * 14, cy + ry + 56); c.stroke(); }
    if (freckles) { c.fillStyle = '#b8785a99'; for (let i = 0; i < 7; i++) { c.beginPath(); c.arc(cx + side * (2 + (i * 13) % 40), cy + 62 + ((i * 7) % 18), 3.2, 0, Math.PI * 2); c.fill(); } }
    // blush
    const b = c.createRadialGradient(cx + side * 34, cy + 66, 2, cx + side * 34, cy + 66, 36);
    b.addColorStop(0, hex(blush) + 'aa'); b.addColorStop(1, hex(blush) + '00');
    c.fillStyle = b; c.beginPath(); c.ellipse(cx + side * 34, cy + 66, 40, 22, 0, 0, Math.PI * 2); c.fill();
  }
  // mouth
  c.strokeStyle = hex(lip); c.lineWidth = lip === 0x8a3a4a ? 5 : 7; c.lineCap = 'round';
  c.beginPath();
  if (mouth === 'smile') { c.moveTo(W / 2 - 16, 214); c.quadraticCurveTo(W / 2, 226, W / 2 + 16, 214); c.stroke(); }
  else if (mouth === 'open' || mouth === 'mid') {
    // a little open mouth, talking
    const h = mouth === 'open' ? 16 : 9;
    c.fillStyle = '#7a2a3a'; c.beginPath(); c.ellipse(W / 2, 216, 14, h, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#e8828e'; c.beginPath(); c.ellipse(W / 2, 216 + h * 0.45, 9, h * 0.4, 0, 0, Math.PI * 2); c.fill();
  } else if (mouth === 'smirk') {
    // a lopsided, very pleased-with-herself smirk, and a fang
    c.moveTo(W / 2 - 14, 216); c.quadraticCurveTo(W / 2 + 4, 226, W / 2 + 18, 208); c.stroke();
    if (fang) { c.fillStyle = '#ffffff'; c.beginPath(); c.moveTo(W / 2 + 6, 219); c.lineTo(W / 2 + 10, 230); c.lineTo(W / 2 + 13, 217); c.fill(); }
  } else { c.moveTo(W / 2 - 10, 218); c.lineTo(W / 2 + 10, 218); c.stroke(); }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}
function canvasTex(cv) {
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// A grown woman's face, painted larger than the chibi's: almond eyes with winged liner
// and lashes, arched brows, a sweep of blush along the cheekbone, a hint of nose, and full
// lips with a highlight. Age (0..1) deepens the lines at the eyes and mouth.
function paintGrownFace(c, W, o) {
  const { hex, shade, lift, age } = o;
  const line = (a, w) => { c.strokeStyle = `rgba(110,55,45,${a})`; c.lineWidth = w; c.lineCap = 'round'; };
  // (this canvas wraps a taller patch than the chibi face: eyes near the top third, mouth low)
  for (const side of [-1, 1]) {
    const cx = W / 2 + side * 112, cy = 100, rx = 58;
    const inner = [cx - side * rx, cy + 8], outer = [cx + side * rx, cy - 10];
    const upper = () => { c.moveTo(...inner); c.bezierCurveTo(cx - side * rx * 0.5, cy - 40, cx + side * rx * 0.55, cy - 40, ...outer); };
    const lower = () => { c.bezierCurveTo(cx + side * rx * 0.5, cy + 28, cx - side * rx * 0.5, cy + 30, ...inner); };
    // blush: a soft sweep up along the cheekbone toward the temple
    const bx = cx + side * 34, by = cy + 66;
    const b = c.createRadialGradient(bx, by, 4, bx, by, 78);
    b.addColorStop(0, hex(o.blush) + '70'); b.addColorStop(0.6, hex(o.blush) + '28'); b.addColorStop(1, hex(o.blush) + '00');
    c.save(); c.translate(bx, by); c.rotate(-side * 0.38); c.scale(1, 0.42); c.translate(-bx, -by);
    c.fillStyle = b; c.beginPath(); c.arc(bx, by, 78, 0, Math.PI * 2); c.fill(); c.restore();
    // lid color: her eyeshadow, or a soft warm wash
    const sc = o.shadow != null ? o.shadow : 0xb07a6a;
    const sh = c.createRadialGradient(cx + side * 12, cy - 18, 4, cx + side * 12, cy - 18, 70);
    sh.addColorStop(0, hex(sc) + (o.shadow != null ? 'cc' : '55')); sh.addColorStop(1, hex(sc) + '00');
    c.fillStyle = sh; c.beginPath(); c.ellipse(cx + side * 12, cy - 16, rx + 18, 38, side * 0.2, 0, Math.PI * 2); c.fill();
    if (o.closed) {
      c.strokeStyle = hex(o.lashes); c.lineWidth = 9; c.lineCap = 'round';
      c.beginPath(); c.moveTo(...inner); c.bezierCurveTo(cx - side * rx * 0.4, cy + 20, cx + side * rx * 0.5, cy + 18, ...outer); c.stroke();
      c.lineWidth = 6; c.beginPath(); c.moveTo(...outer); c.lineTo(cx + side * (rx + 18), cy - 18); c.stroke();
    } else {
      c.save(); c.beginPath(); upper(); lower(); c.closePath();
      c.fillStyle = '#fbf7f4'; c.fill(); c.clip();
      const ir = 27, ix = cx + side * 3, iy = cy - 2;
      const g = c.createRadialGradient(ix, iy - 8, 3, ix, iy, ir);
      g.addColorStop(0, lift(o.eye, 0.35)); g.addColorStop(0.7, hex(o.eye)); g.addColorStop(1, shade(o.eye, 0.4));
      c.fillStyle = g; c.beginPath(); c.arc(ix, iy, ir, 0, Math.PI * 2); c.fill();
      c.fillStyle = shade(o.eye, 0.18); c.beginPath(); c.arc(ix, iy, 11, 0, Math.PI * 2); c.fill();
      c.fillStyle = 'rgba(255,255,255,0.95)'; c.beginPath(); c.arc(ix - side * 9, iy - 10, 7, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.arc(ix + side * 8, iy + 10, 3, 0, Math.PI * 2); c.fill();
      c.restore();
      // the upper lid: a bold liner that wings out, and a few lashes
      c.strokeStyle = hex(o.lashes); c.lineCap = 'round'; c.lineJoin = 'round'; c.lineWidth = 9;
      c.beginPath(); upper(); c.quadraticCurveTo(cx + side * (rx + 10), cy - 18, cx + side * (rx + 24), cy - 30); c.stroke();
      c.lineWidth = 4.5;
      for (let i = 0; i < 4; i++) { const px = cx + side * rx * (0.45 + i * 0.16), py = cy - 28 + i * 4.5; c.beginPath(); c.moveTo(px, py); c.lineTo(px + side * 12, py - 12 + i); c.stroke(); }
      c.lineWidth = 3; c.globalAlpha = 0.55; c.beginPath(); c.moveTo(...outer); lower(); c.stroke(); c.globalAlpha = 1;
    }
    // lid crease, and the lines a life of laughing leaves
    line(0.42, 3.5); c.beginPath(); c.moveTo(cx - side * rx * 0.8, cy - 22); c.bezierCurveTo(cx - side * rx * 0.3, cy - 50, cx + side * rx * 0.5, cy - 50, cx + side * (rx + 4), cy - 26); c.stroke();
    line(0.12 + age * 0.3, 3);
    for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(cx + side * (rx + 16), cy - 2 + i * 11); c.lineTo(cx + side * (rx + 34), cy - 9 + i * 16); c.stroke(); }
    line(0.1 + age * 0.22, 3); c.beginPath(); c.moveTo(cx - side * rx * 0.6, cy + 34); c.quadraticCurveTo(cx, cy + 42, cx + side * rx * 0.6, cy + 32); c.stroke();
    // brow: a tapered arch
    c.fillStyle = hex(o.brow);
    c.beginPath(); c.moveTo(cx - side * (rx - 6), cy - 56); c.quadraticCurveTo(cx + side * 10, cy - 86, cx + side * (rx + 14), cy - 60);
    c.quadraticCurveTo(cx + side * 10, cy - 74, cx - side * (rx - 8), cy - 48); c.closePath(); c.fill();
    if (o.freckles) { c.fillStyle = '#b8785a99'; for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(cx - side * (10 - (i * 13) % 56), cy + 54 + ((i * 7) % 22), 3.5, 0, Math.PI * 2); c.fill(); } }
  }
  // a hint of a nose: a soft shadow down one side and the tip
  line(0.3, 3.5); c.beginPath(); c.moveTo(W / 2 + 8, 112); c.quadraticCurveTo(W / 2 + 14, 150, W / 2 + 4, 164); c.stroke();
  line(0.26, 3); c.beginPath(); c.moveTo(W / 2 - 13, 166); c.quadraticCurveTo(W / 2, 173, W / 2 + 13, 166); c.stroke();
  // smile lines
  line(0.08 + age * 0.26, 3.5);
  for (const side of [-1, 1]) { c.beginPath(); c.moveTo(W / 2 + side * 44, 166); c.quadraticCurveTo(W / 2 + side * 66, 200, W / 2 + side * 58, 238); c.stroke(); }
  // lips
  const L = hex(o.lip), Ld = shade(o.lip, 0.55), my = 210;
  if (o.mouth === 'open' || o.mouth === 'mid') {
    const h = o.mouth === 'open' ? 22 : 12;
    c.fillStyle = L; c.beginPath(); c.ellipse(W / 2, my + 4, 40, h + 10, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#5a1a26'; c.beginPath(); c.ellipse(W / 2, my + 4, 31, h, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#fbf4f0'; c.fillRect(W / 2 - 20, my + 4 - h, 40, Math.min(8, h * 0.5));
  } else {
    const lift2 = o.mouth === 'smirk' ? 10 : 0, w = 50;
    c.fillStyle = L; c.beginPath();
    c.moveTo(W / 2 - w, my + 2); c.quadraticCurveTo(W / 2 - 20, my - 18, W / 2 - 6, my - 10); c.quadraticCurveTo(W / 2, my - 6, W / 2 + 6, my - 10);
    c.quadraticCurveTo(W / 2 + 20, my - 18, W / 2 + w, my + 2 - lift2); c.quadraticCurveTo(W / 2, my + 8, W / 2 - w, my + 2); c.fill();
    c.beginPath(); c.moveTo(W / 2 - w, my + 2); c.quadraticCurveTo(W / 2, my + 10, W / 2 + w, my + 2 - lift2); c.quadraticCurveTo(W / 2 + 6, my + 42, W / 2 - w, my + 2); c.fill();
    c.strokeStyle = Ld; c.lineWidth = 4.5; c.lineCap = 'round';
    const up = o.mouth === 'flat' ? 0 : 5;
    c.beginPath(); c.moveTo(W / 2 - w - 3, my - up); c.quadraticCurveTo(W / 2, my + 12, W / 2 + w + 3, my - up - lift2 * 1.4); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.4)'; c.beginPath(); c.ellipse(W / 2 + 6, my + 20, 14, 4.5, -0.1, 0, Math.PI * 2); c.fill();
  }
}

// The face sits on a patch of sphere just outside the head.
export function face(group, headR, y, opts) {
  // a grown face wraps a taller patch (brow to chin) than a chibi's
  const geo = opts.mature
    ? new THREE.SphereGeometry(headR * 1.012, 48, 32, Math.PI / 2 - 0.95, 1.9, Math.PI / 2 - 0.48, 1.28)
    : new THREE.SphereGeometry(headR * 1.012, 48, 24, Math.PI / 2 - 0.9, 1.8, Math.PI / 2 - 0.42, 0.95);
  const faces = {
    rest: faceTexture(opts),
    blink: faceTexture({ ...opts, closed: true }),
    talkA: faceTexture({ ...opts, mouth: 'open' }),
    talkB: faceTexture({ ...opts, mouth: 'mid' }),
    hurt: faceTexture({ ...opts, closed: true, mouth: 'open' }),
  };
  const m = tadd(group, geo, tmat(0xffffff, { map: faces.rest, soft: true }), 0, y, 0);
  m.userData.faces = faces;
  return m;
}

// Pleats: ripple a lathe's radius around its axis, more toward the hem.
export function pleat(geo, count, yTop, yBottom, depth = 0.05) {
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const r = Math.hypot(x, z); if (r < 1e-4) continue;
    const a = Math.atan2(x, z);
    const w = Math.max(0, Math.min(1, (yTop - y) / (yTop - yBottom)));
    const tri = 1 - Math.abs(((a * count / Math.PI) % 2 + 2) % 2 - 1) * 2; // -1..1 zigzag
    const f = 1 + depth * w * (tri * 0.5 + 0.5);
    p.setX(i, x * f); p.setZ(i, z * f);
  }
  geo.computeVertexNormals();
  return geo;
}

// ---------------------------------------------------------------
// The rig: blinking, talking, waving, kneeling, breathing and a little
// springy follow-through. The stage calls rig.update(dt) every frame.
// parts: { face, armR, armL, bust, hips, body, legs: { L: {thigh, shin}, R: {...} }, legLen }
// ---------------------------------------------------------------
// Battle actions: keyframed poses for the arms and body, as [time 0..1, value] lists.
// Arm x rotation swings the arm forward (negative) or back; z spreads it out from the body.
const ACTIONS = {
  swing:  { R: { x: [[0, 0], [0.35, -2.8], [0.55, -1.25], [0.8, -1.1], [1, 0]], z: [[0, 0], [0.35, 0.25], [0.55, -0.35], [0.8, -0.3], [1, 0]] },
            L: { x: [[0, 0], [0.35, 0.5], [0.55, -0.3], [1, 0]] },
            body: { x: [[0, 0], [0.35, -0.1], [0.55, 0.18], [0.8, 0.12], [1, 0]], y: [[0, 0], [0.35, 0.35], [0.55, -0.25], [1, 0]] },
            face: [[0.3, 'talkA'], [0.8, null]] },
  thrust: { R: { x: [[0, 0], [0.3, 0.6], [0.5, -1.55], [0.8, -1.55], [1, 0]] },
            L: { x: [[0, 0], [0.5, -0.4], [1, 0]] },
            body: { x: [[0, 0], [0.3, -0.08], [0.5, 0.2], [0.8, 0.15], [1, 0]] }, face: [[0.4, 'talkA'], [0.8, null]] },
  cast:   { R: { x: [[0, 0], [0.3, -2.0], [0.75, -2.2], [1, 0]], z: [[0, 0], [0.3, 0.35], [0.75, 0.45], [1, 0]] },
            L: { x: [[0, 0], [0.3, -2.0], [0.75, -2.2], [1, 0]], z: [[0, 0], [0.3, -0.35], [0.75, -0.45], [1, 0]] },
            body: { x: [[0, 0], [0.3, -0.1], [0.75, -0.12], [1, 0]] }, face: [[0.25, 'talkA'], [0.75, null]] },
  flinch: { R: { x: [[0, 0], [0.2, -0.6], [1, 0]], z: [[0, 0], [0.2, 0.5], [1, 0]] },
            L: { x: [[0, 0], [0.2, -0.6], [1, 0]], z: [[0, 0], [0.2, -0.5], [1, 0]] },
            body: { x: [[0, 0], [0.18, -0.28], [1, 0]], z: [[0, 0], [0.18, 0.08], [1, 0]] }, face: [[0, 'hurt'], [0.7, null]] },
  guard:  { R: { x: [[0, 0], [0.25, -1.35], [0.8, -1.35], [1, 0]], z: [[0, 0], [0.25, -0.75], [0.8, -0.75], [1, 0]] },
            L: { x: [[0, 0], [0.25, -1.25], [0.8, -1.25], [1, 0]], z: [[0, 0], [0.25, 0.75], [0.8, 0.75], [1, 0]] },
            body: { x: [[0, 0], [0.25, 0.08], [0.8, 0.08], [1, 0]] } },
  toss:   { R: { x: [[0, 0], [0.35, 0.8], [0.6, -2.3], [1, 0]] }, body: { y: [[0, 0], [0.35, 0.3], [0.6, -0.2], [1, 0]] } },
  cheer:  { R: { x: [[0, 0], [0.15, -2.9], [0.85, -2.9], [1, 0]], z: [[0, 0], [0.15, 0.3], [0.85, 0.3], [1, 0]] },
            L: { x: [[0, 0], [0.15, -2.9], [0.85, -2.9], [1, 0]], z: [[0, 0], [0.15, -0.3], [0.85, -0.3], [1, 0]] },
            face: [[0.1, 'talkA'], [0.9, null]], wiggle: true },
};
// Held poses for the Undercroft: arms stay put until released. tug() makes a
// held figure strain against whatever's holding it for a moment.
const HOLDS = {
  shackled: { R: { x: -0.15, z: 2.35 }, L: { x: -0.15, z: -2.35 } },
  stocks:   { R: { x: -1.5, z: -0.12 }, L: { x: -1.5, z: 0.12 }, body: 0.06 },
};
function keyed(keys, p) {
  if (!keys) return 0;
  if (p <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t1, v1] = keys[i], [t0, v0] = keys[i - 1];
    if (p <= t1) { const u = (p - t0) / Math.max(1e-6, t1 - t0); const e = u * u * (3 - 2 * u); return v0 + (v1 - v0) * e; }
  }
  return keys[keys.length - 1][1];
}

export function makeRig(parts) {
  const st = { act: null, actT0: 0, actDur: 0, t: 0, nextBlink: 1 + Math.random() * 2, blinkEnd: 0, hold: null, tugT0: -9, talkUntil: 0, waveStart: -9, waveEnd: -9, kneel: 0, kneelTo: 0, lastY: null, vel: 0, jig: 0, jigV: 0 };
  const faces = parts.face && parts.face.userData.faces;
  const setFace = tex => { if (faces && parts.face.material.map !== tex) { parts.face.material.map = tex; parts.face.material.needsUpdate = true; } };
  const ease = x => x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x);
  return {
    talk(seconds = 1.6) { st.talkUntil = st.t + seconds; },
    wave(seconds = 1.8) { st.waveStart = st.t; st.waveEnd = st.t + seconds; },
    kneel(on = true) { st.kneelTo = on ? 1 : 0; },
    // play a battle action (see ACTIONS); returns its length in seconds
    act(name, seconds = 0.6) { if (!ACTIONS[name]) return 0; st.act = name; st.actT0 = st.t; st.actDur = seconds; return seconds; },
    hold(name) { st.hold = HOLDS[name] ? name : null; },
    tug() { st.tugT0 = st.t; },
    parts,
    update(dt, worldY = 0) {
      st.t += dt;
      // the current battle action, if any
      let A = null, ap = 0, actFace = null;
      if (st.act) { ap = (st.t - st.actT0) / st.actDur; if (ap >= 1) st.act = null; else A = ACTIONS[st.act]; }
      if (A && A.face) for (const [ft, f] of A.face) if (ap >= ft) actFace = f;
      // blink every few seconds; talk by flicking the mouth
      if (st.t > st.nextBlink) { st.blinkEnd = st.t + 0.13; st.nextBlink = st.t + 2.2 + Math.random() * 3.2; }
      if (faces) {
        if (st.t < st.blinkEnd) setFace(faces.blink);
        else if (actFace) setFace(faces[actFace] || faces.rest);
        else if (st.t < st.talkUntil) setFace(Math.floor(st.t * 9) % 3 === 0 ? faces.rest : Math.floor(st.t * 9) % 3 === 1 ? faces.talkA : faces.talkB);
        else setFace(faces.rest);
      }
      // wave with the right arm: up, a few waggles, back down
      if (parts.armR) {
        const w = st.t < st.waveEnd ? ease((st.t - st.waveStart) / 0.3) * ease((st.waveEnd - st.t) / 0.3) : 0;
        parts.armR.rotation.z = parts.armR.userData.rest + w * (2.05 + Math.sin(st.t * 11) * 0.3);
      }
      // battle actions layer on top: arms swing and the body leans and twists
      const wig = A && A.wiggle ? Math.sin(st.t * 14) * 0.25 : 0;
      if (parts.armR) { parts.armR.rotation.x = A && A.R ? keyed(A.R.x, ap) : 0; if (A && A.R && A.R.z) parts.armR.rotation.z += keyed(A.R.z, ap) + wig; }
      if (parts.armL) { parts.armL.rotation.x = A && A.L ? keyed(A.L.x, ap) : 0; parts.armL.rotation.z = parts.armL.userData.rest + (A && A.L && A.L.z ? keyed(A.L.z, ap) - wig : 0); }
      if (parts.body) { const b = A && A.body; parts.body.rotation.x = b ? keyed(b.x, ap) : 0; parts.body.rotation.y = b ? keyed(b.y, ap) : 0; parts.body.rotation.z = b ? keyed(b.z, ap) : 0; }
      // a held pose replaces the arms' rest; a tug shakes it for about a second
      const H = !A && st.hold && HOLDS[st.hold];
      if (H) {
        const tp = (st.t - st.tugT0) / 1.1, tg = tp >= 0 && tp < 1 ? Math.sin(tp * Math.PI * 6) * (1 - tp) * 0.18 : 0;
        if (parts.armR) { parts.armR.rotation.x = H.R.x + tg * 0.5; parts.armR.rotation.z = parts.armR.userData.rest + H.R.z + tg; }
        if (parts.armL) { parts.armL.rotation.x = H.L.x - tg * 0.5; parts.armL.rotation.z = parts.armL.userData.rest + H.L.z + tg; }
        if (parts.body) { parts.body.rotation.x = (H.body || 0) + tg * 0.3; parts.body.rotation.z = tg * 0.4; }
      }
      // breathing
      if (parts.bust) parts.bust.scale.y = 1 + Math.sin(st.t * 2.1) * 0.015;
      // springy follow-through: the bust (and hips, gently) lag the body's bounce
      if (st.lastY != null && dt > 0) {
        const v = (worldY - st.lastY) / dt;
        const acc = (v - st.vel) / dt; st.vel = v;
        st.jigV += (-180 * st.jig - 11 * st.jigV - acc * 0.9) * dt;
        st.jig += st.jigV * dt;
        st.jig = Math.max(-0.025, Math.min(0.025, st.jig));
      }
      st.lastY = worldY;
      const J = parts.jiggle || 1;
      if (parts.bust) parts.bust.position.y = parts.bust.userData.restY + st.jig * J;
      if (parts.hips) parts.hips.rotation.z = Math.sin(st.t * 1.3) * 0.02 + st.jig * 0.8 * J;
      // kneel on the right knee
      st.kneel += (st.kneelTo - st.kneel) * Math.min(1, dt * 5);
      const k = ease(st.kneel);
      if (parts.legs) {
        const { L, R } = parts.legs;
        L.thigh.rotation.x = -1.45 * k; L.shin.rotation.x = 1.45 * k;
        R.thigh.rotation.x = 0.15 * k; R.shin.rotation.x = 1.6 * k;
        if (parts.body) parts.body.position.y = -(parts.legLen * 0.47) * k;
        for (const leg of [L, R]) { if (leg.root.userData.restY == null) leg.root.userData.restY = leg.root.position.y; leg.root.position.y = leg.root.userData.restY - parts.legLen * 0.47 * k; }
      }
      // pivot the lean at the hips, not the feet, so the torso stays on the legs
      if (parts.body && parts.legLen) {
        const h = parts.legLen, bx = parts.body.rotation.x, bz = parts.body.rotation.z;
        parts.body.position.z = -h * Math.sin(bx);
        parts.body.position.x = h * Math.sin(bz);
        parts.body.position.y = (parts.legs ? -(parts.legLen * 0.47) * k : 0) + h * (2 - Math.cos(bx) - Math.cos(bz));
      }
    },
  };
}

// A smooth body from a side profile [radius, height] (a lathe), so waists and
// hips can curve instead of being a cone.
export function lathe(points, segments = 40) {
  return new THREE.LatheGeometry(points.map(([r, y]) => new THREE.Vector2(r, y)), segments);
}
