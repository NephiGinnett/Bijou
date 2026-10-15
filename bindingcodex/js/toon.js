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
export function faceTexture({ eye = 0x8a5ad8, brow = 0x8a6a3a, blush = 0xff8aa0, lashes = 0x2a1a22, mouth = 'smile', closed = false } = {}) {
  const W = 512, H = 256;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const c = cv.getContext('2d');
  const hex = n => '#' + new THREE.Color(n).getHexString();
  const shade = (n, f) => '#' + new THREE.Color(n).multiplyScalar(f).getHexString();
  const lift = (n, f) => '#' + new THREE.Color(n).lerp(new THREE.Color(0xffffff), f).getHexString();
  for (const side of [-1, 1]) {
    const cx = W / 2 + side * 78, cy = 118, rx = 30, ry = 42;
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
  if (mouth === 'smile') { c.moveTo(W / 2 - 16, 214); c.quadraticCurveTo(W / 2, 226, W / 2 + 16, 214); c.stroke(); }
  else if (mouth === 'open' || mouth === 'mid') {
    // a little open mouth, talking
    const h = mouth === 'open' ? 16 : 9;
    c.fillStyle = '#7a2a3a'; c.beginPath(); c.ellipse(W / 2, 216, 14, h, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#e8828e'; c.beginPath(); c.ellipse(W / 2, 216 + h * 0.45, 9, h * 0.4, 0, 0, Math.PI * 2); c.fill();
  } else { c.moveTo(W / 2 - 10, 218); c.lineTo(W / 2 + 10, 218); c.stroke(); }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}
// The face sits on a patch of sphere just outside the head.
export function face(group, headR, y, opts) {
  const geo = new THREE.SphereGeometry(headR * 1.012, 48, 24, Math.PI / 2 - 0.9, 1.8, Math.PI / 2 - 0.42, 0.95);
  const faces = {
    rest: faceTexture(opts),
    blink: faceTexture({ ...opts, closed: true }),
    talkA: faceTexture({ ...opts, mouth: 'open' }),
    talkB: faceTexture({ ...opts, mouth: 'mid' }),
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
export function makeRig(parts) {
  const st = { t: 0, nextBlink: 1 + Math.random() * 2, blinkEnd: 0, talkUntil: 0, waveStart: -9, waveEnd: -9, kneel: 0, kneelTo: 0, lastY: null, vel: 0, jig: 0, jigV: 0 };
  const faces = parts.face && parts.face.userData.faces;
  const setFace = tex => { if (faces && parts.face.material.map !== tex) { parts.face.material.map = tex; parts.face.material.needsUpdate = true; } };
  const ease = x => x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x);
  return {
    talk(seconds = 1.6) { st.talkUntil = st.t + seconds; },
    wave(seconds = 1.8) { st.waveStart = st.t; st.waveEnd = st.t + seconds; },
    kneel(on = true) { st.kneelTo = on ? 1 : 0; },
    update(dt, worldY = 0) {
      st.t += dt;
      // blink every few seconds; talk by flicking the mouth
      if (st.t > st.nextBlink) { st.blinkEnd = st.t + 0.13; st.nextBlink = st.t + 2.2 + Math.random() * 3.2; }
      if (faces) {
        if (st.t < st.blinkEnd) setFace(faces.blink);
        else if (st.t < st.talkUntil) setFace(Math.floor(st.t * 9) % 3 === 0 ? faces.rest : Math.floor(st.t * 9) % 3 === 1 ? faces.talkA : faces.talkB);
        else setFace(faces.rest);
      }
      // wave with the right arm: up, a few waggles, back down
      if (parts.armR) {
        const w = st.t < st.waveEnd ? ease((st.t - st.waveStart) / 0.3) * ease((st.waveEnd - st.t) / 0.3) : 0;
        parts.armR.rotation.z = parts.armR.userData.rest + w * (2.05 + Math.sin(st.t * 11) * 0.3);
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
      if (parts.bust) parts.bust.position.y = parts.bust.userData.restY + st.jig;
      if (parts.hips) parts.hips.rotation.z = Math.sin(st.t * 1.3) * 0.02 + st.jig * 0.8;
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
    },
  };
}

// A smooth body from a side profile [radius, height] (a lathe), so waists and
// hips can curve instead of being a cone.
export function lathe(points, segments = 40) {
  return new THREE.LatheGeometry(points.map(([r, y]) => new THREE.Vector2(r, y)), segments);
}
