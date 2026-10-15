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
    hull.scale.setScalar(1 + Math.min(0.25, width / r));
    m.add(hull);
  }
  return group;
}

// --- the painted face ---------------------------------------------------------------

// A canvas texture wrapped over the front of the head: big glossy anime
// eyes with lashes and highlights, soft brows, blush and a small smile.
export function faceTexture({ eye = 0x8a5ad8, brow = 0x8a6a3a, blush = 0xff8aa0, lashes = 0x2a1a22, mouth = 'smile' } = {}) {
  const W = 512, H = 256;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const c = cv.getContext('2d');
  const hex = n => '#' + new THREE.Color(n).getHexString();
  const shade = (n, f) => '#' + new THREE.Color(n).multiplyScalar(f).getHexString();
  const lift = (n, f) => '#' + new THREE.Color(n).lerp(new THREE.Color(0xffffff), f).getHexString();
  for (const side of [-1, 1]) {
    const cx = W / 2 + side * 78, cy = 118, rx = 30, ry = 42;
    // white of the eye
    c.fillStyle = '#fbf7f4'; c.beginPath(); c.ellipse(cx, cy + 4, rx + 6, ry, 0, 0, Math.PI * 2); c.fill();
    // iris: light at the bottom, deep at the top
    const g = c.createLinearGradient(0, cy - ry, 0, cy + ry);
    g.addColorStop(0, shade(eye, 0.45)); g.addColorStop(0.55, hex(eye)); g.addColorStop(1, lift(eye, 0.55));
    c.fillStyle = g; c.beginPath(); c.ellipse(cx, cy + 6, rx, ry - 4, 0, 0, Math.PI * 2); c.fill();
    // pupil
    c.fillStyle = shade(eye, 0.25); c.beginPath(); c.ellipse(cx, cy + 2, rx * 0.45, ry * 0.5, 0, 0, Math.PI * 2); c.fill();
    // highlights
    c.fillStyle = 'rgba(255,255,255,0.95)'; c.beginPath(); c.ellipse(cx - side * 10 - 6, cy - 14, 10, 13, -0.3, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.ellipse(cx + 10, cy + 22, 5, 5, 0, 0, Math.PI * 2); c.fill();
    // upper lash line, with a flick at the outer corner
    c.strokeStyle = hex(lashes); c.lineCap = 'round'; c.lineWidth = 9;
    c.beginPath(); c.ellipse(cx, cy + 6, rx + 8, ry + 2, 0, Math.PI * 1.08, Math.PI * 1.92); c.stroke();
    c.lineWidth = 6; c.beginPath(); c.moveTo(cx + side * (rx + 6), cy - 18); c.lineTo(cx + side * (rx + 18), cy - 30); c.stroke();
    // a soft lower lash
    c.lineWidth = 3; c.globalAlpha = 0.6; c.beginPath(); c.ellipse(cx, cy + 4, rx + 4, ry, 0, Math.PI * 0.2, Math.PI * 0.8); c.stroke(); c.globalAlpha = 1;
    // brow
    c.strokeStyle = hex(brow); c.lineWidth = 6;
    c.beginPath(); c.moveTo(cx - side * 26, cy - ry - 22); c.quadraticCurveTo(cx + side * 4, cy - ry - 34, cx + side * 30, cy - ry - 24); c.stroke();
    // blush
    const b = c.createRadialGradient(cx + side * 34, cy + 66, 2, cx + side * 34, cy + 66, 36);
    b.addColorStop(0, hex(blush) + 'aa'); b.addColorStop(1, hex(blush) + '00');
    c.fillStyle = b; c.beginPath(); c.ellipse(cx + side * 34, cy + 66, 40, 22, 0, 0, Math.PI * 2); c.fill();
  }
  // mouth
  c.strokeStyle = '#8a3a4a'; c.lineWidth = 5; c.lineCap = 'round';
  c.beginPath();
  if (mouth === 'smile') { c.moveTo(W / 2 - 16, 214); c.quadraticCurveTo(W / 2, 226, W / 2 + 16, 214); }
  else { c.moveTo(W / 2 - 10, 218); c.lineTo(W / 2 + 10, 218); }
  c.stroke();
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}
// The face sits on a patch of sphere just outside the head.
export function face(group, headR, y, opts) {
  const geo = new THREE.SphereGeometry(headR * 1.012, 48, 24, Math.PI / 2 - 0.9, 1.8, Math.PI / 2 - 0.42, 0.95);
  return tadd(group, geo, tmat(0xffffff, { map: faceTexture(opts), soft: true }), 0, y, 0);
}

// A smooth body from a side profile [radius, height] (a lathe), so waists and
// hips can curve instead of being a cone.
export function lathe(points, segments = 40) {
  return new THREE.LatheGeometry(points.map(([r, y]) => new THREE.Vector2(r, y)), segments);
}
