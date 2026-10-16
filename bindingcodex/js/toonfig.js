// ============================================================
// TOON FIGURES — one recipe for every soft-toon character.
// A character is a short spec (build, colors, top, skirt, sleeves,
// legs, hair, face, extras); this builds the rigged figure: legs on
// hip and knee pivots, arms on shoulder pivots, a painted face, and the
// rig (blink, talk, wave, kneel, breathing, follow-through).
// ============================================================

import * as THREE from 'three';
import { tmat, tadd, SS, SC, ST, outline, face, lathe, pleat, makeRig } from './toon.js';

export const FIGURES = {
  tall: { hr: 0.255, hy: 1.6, shoulderY: 1.3, bustY: 1.17, waistY: 0.98, hipY: 0.82, hemY: 0.62, waistR: 0.105, hipR: 0.25, bustR: 0.11, shoulderX: 0.18 },
};
// Builds scale the figure's landmarks.
const BUILDS = {
  slim:    { waist: 0.95, hip: 0.88, shoulder: 0.95, bust: 0.85, thigh: 0.9, arm: 0.95 },
  average: { waist: 1, hip: 1, shoulder: 1, bust: 1, thigh: 1, arm: 1 },
  curvy:   { waist: 0.97, hip: 1.1, shoulder: 1, bust: 1.15, thigh: 1.1, arm: 1 },
  broad:   { waist: 1.3, hip: 1.05, shoulder: 1.2, bust: 1.05, thigh: 1.18, arm: 1.3 },
};
const shade = (hex, f) => new THREE.Color(hex).multiplyScalar(f).getHex();

// --- knitwear: a painted canvas for holiday sweaters ---------------------------------------
// pattern: snowflake | tree | reindeer | ledger | sequin | stripes. Base, motif and band colors
// come from the look (main, trim, deep). Cached, since every portrait rebuilds the figure.
const KNIT = {};
const hexStr = n => '#' + (n >>> 0).toString(16).padStart(6, '0');
export function knitTexture(pattern, base, motif, band) {
  const key = [pattern, base, motif, band].join('|');
  if (KNIT[key]) return KNIT[key];
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 128;
  const x = cv.getContext('2d');
  x.fillStyle = hexStr(base); x.fillRect(0, 0, 256, 128);
  // the stitches: rows of little v's
  x.strokeStyle = 'rgba(0,0,0,0.13)'; x.lineWidth = 1;
  for (let r = 0; r < 128; r += 6) for (let c = (r / 6) % 2 * 3; c < 256; c += 6) { x.beginPath(); x.moveTo(c, r); x.lineTo(c + 3, r + 4); x.lineTo(c + 6, r); x.stroke(); }
  // bands top and bottom, with a zigzag
  x.fillStyle = hexStr(band);
  for (const y of [6, 108]) { x.fillRect(0, y, 256, 12); x.fillStyle = hexStr(motif); for (let c = 0; c < 256; c += 12) { x.beginPath(); x.moveTo(c, y + 9); x.lineTo(c + 6, y + 3); x.lineTo(c + 12, y + 9); x.fill(); } x.fillStyle = hexStr(band); }
  x.fillStyle = hexStr(motif); x.strokeStyle = hexStr(motif); x.lineWidth = 3; x.lineCap = 'round';
  const flake = (cx, cy, r) => { for (let i = 0; i < 3; i++) { const a = i * Math.PI / 3; x.beginPath(); x.moveTo(cx - Math.cos(a) * r, cy - Math.sin(a) * r); x.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); x.stroke(); } };
  if (pattern === 'snowflake') { for (let c = 16; c < 256; c += 42) { flake(c, 46, 11); flake(c + 21, 78, 8); } }
  else if (pattern === 'tree') {
    for (let c = 20; c < 256; c += 48) { x.beginPath(); x.moveTo(c, 34); x.lineTo(c - 15, 84); x.lineTo(c + 15, 84); x.fill(); x.fillStyle = '#f4d04a'; x.beginPath(); x.arc(c, 32, 5, 0, 7); x.fill(); x.fillStyle = hexStr(band); for (const [dx, dy] of [[-6, 62], [5, 72], [0, 50]]) { x.beginPath(); x.arc(c + dx, dy, 3, 0, 7); x.fill(); } x.fillStyle = hexStr(motif); }
  } else if (pattern === 'reindeer') {
    for (let c = 30; c < 256; c += 64) {
      x.beginPath(); x.ellipse(c, 66, 16, 9, 0, 0, 7); x.fill();                      // body
      for (const dx of [-11, -5, 6, 12]) { x.beginPath(); x.moveTo(c + dx, 70); x.lineTo(c + dx, 86); x.stroke(); }
      x.beginPath(); x.moveTo(c + 13, 60); x.lineTo(c + 19, 48); x.stroke();          // neck
      x.beginPath(); x.ellipse(c + 21, 46, 6, 4, 0.3, 0, 7); x.fill();                // head
      x.beginPath(); x.moveTo(c + 19, 42); x.lineTo(c + 15, 32); x.moveTo(c + 17, 37); x.lineTo(c + 11, 35); x.moveTo(c + 22, 42); x.lineTo(c + 26, 32); x.stroke();
      x.fillStyle = '#ff2a2a'; x.beginPath(); x.arc(c + 27, 47, 3.5, 0, 7); x.fill(); x.fillStyle = hexStr(motif);
    }
  } else if (pattern === 'ledger') {
    x.lineWidth = 1.2; for (let c = 0; c < 256; c += 32) { x.beginPath(); x.moveTo(c, 22); x.lineTo(c, 104); x.stroke(); } for (let r = 22; r < 106; r += 14) { x.beginPath(); x.moveTo(0, r); x.lineTo(256, r); x.stroke(); }
    x.font = 'bold 10px monospace';
    for (let r = 0; r < 6; r++) for (let c = 0; c < 8; c++) { x.fillStyle = (r * 3 + c) % 4 === 0 ? '#c83a3a' : '#2a8a4a'; x.fillText((r * 7 + c * 13) % 2 ? '+$' + ((r + 2) * (c + 3)) : '-' + (r + c + 1) + 'k', c * 32 + 3, 33 + r * 14); }
  } else if (pattern === 'sequin') {
    for (let i = 0; i < 160; i++) { x.fillStyle = ['#ffffff', '#f4d04a', hexStr(motif), '#ffb8e0'][i % 4]; x.beginPath(); x.arc((i * 37) % 256, 20 + (i * 53) % 88, 2.4, 0, 7); x.fill(); }
    x.fillStyle = '#ffffff'; for (const [dy, r] of [[82, 13], [60, 10], [42, 7]]) { x.beginPath(); x.arc(128, dy, r, 0, 7); x.fill(); }
    x.fillStyle = '#ff8a2a'; x.beginPath(); x.moveTo(134, 42); x.lineTo(144, 44); x.lineTo(134, 46); x.fill();
  } else if (pattern === 'stripes') { for (let r = 26; r < 104; r += 16) x.fillRect(0, r, 256, 7); }
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.RepeatWrapping; t.repeat.set(2, 1);
  return (KNIT[key] = t);
}
const knitMat = top => {
  return C => { const m = tmat(0xffffff); m.map = knitTexture(top.pattern || 'snowflake', C.main, C.trim, C.deep ?? shade(C.main, 0.7)); m.needsUpdate = true; return m; };
};

export function toonFigure(spec) {
  const B = BUILDS[spec.build || 'average'];
  const F0 = FIGURES[spec.figure || 'tall'];
  const F = { ...F0, waistR: F0.waistR * B.waist, hipR: F0.hipR * B.hip, shoulderX: F0.shoulderX * B.shoulder, bustR: F0.bustR * B.bust * (spec.bust ?? 1) };
  const { hr, hy, shoulderY, bustY, waistY, hipY, hemY0 = F.hemY } = F;
  const fem = spec.fem !== false;
  const waistR = fem ? F.waistR : F.waistR + 0.05, hipR = fem ? F.hipR : F.hipR - 0.04;
  const hemY = spec.skirt && spec.skirt.hem != null ? spec.skirt.hem : hemY0;
  const k = hr / 0.32;
  const C = spec.colors;
  const g = new THREE.Group();
  const body = new THREE.Group(); body.name = 'body'; g.add(body);
  const sweater = spec.top && spec.top.style === 'sweater';
  const skin = tmat(C.skin, { soft: true }), hair = tmat(C.hair), main = sweater ? knitMat(spec.top)(C) : tmat(C.main), deep = tmat(C.deep ?? shade(C.main, 0.7)), trim = tmat(C.trim);
  const ctx = { F, k, g, body, skin, hair, main, deep, trim, C, hy, hr, shoulderY, bustY, waistY, hipY, hemY, waistR, hipR };

  // --- legs: hip pivot > thigh > knee pivot > shin > boot -------------------------------
  const legLen = hipY, tl = legLen * 0.5, sl = legLen * 0.5, th = B.thigh;
  const thighP = [[0, -tl], [0.058 * th, -tl], [0.068 * th, -tl * 0.6], [0.088 * th, -tl * 0.15], [0.094 * th, 0], [0, 0]];
  const shinP = [[0, -sl], [0.04, -sl], [0.044, -sl * 0.85], [0.062 * th, -sl * 0.45], [0.055 * th, -sl * 0.05], [0.057 * th, 0], [0, 0]];
  const L = spec.legs || { style: 'stockings' };
  const legM = tmat(L.color ?? C.deep ?? 0x1b2620), bootM = tmat(L.boots ?? 0x2a1e18);
  const legs = {};
  for (const sx of (L.style === 'serpent' ? [] : [-1, 1])) {
    const root = new THREE.Group(); root.position.set(sx * 0.088 * Math.max(1, th * 0.95), hipY, 0); g.add(root);
    const thigh = new THREE.Group(); root.add(thigh);
    const coverTop = L.style === 'stockings' ? -tl * 0.78 : 0; // how far up the leg covering goes
    tadd(thigh, lathe(thighP, 28), L.style === 'stockings' || L.style === 'bare' ? skin : legM, 0, 0, 0);
    if (L.style === 'stockings') {
      tadd(thigh, lathe(thighP.filter(([, y]) => y <= coverTop).concat([[0.068 * th, coverTop], [0, coverTop]]).map(([r, y]) => [r && r + 0.004, y]), 28), legM, 0, 0, 0);
      tadd(thigh, ST(0.072 * th, 0.011), tmat(L.band ?? C.trim), 0, coverTop, 0, Math.PI / 2);
    }
    const shin = new THREE.Group(); shin.position.y = -tl; thigh.add(shin);
    const shinM = L.style === 'bare' ? skin : legM;
    tadd(shin, SS(0.06 * th, 20, 16), shinM, 0, 0, 0);
    tadd(shin, lathe(shinP.map(([r, y]) => [r && r + 0.004, y]), 28), shinM, 0, 0, 0);
    const bootTop = L.bootHeight ?? 0.62;
    tadd(shin, lathe([[0, -sl], [0.056, -sl], [0.058, -sl * 0.8], [0.06 * th, -sl * bootTop], [0, -sl * bootTop]], 28), bootM, 0, 0, 0);
    tadd(shin, ST(0.06 * th, 0.009), tmat(L.bootTrim ?? C.trim), 0, -sl * bootTop, 0, Math.PI / 2);
    tadd(shin, SS(0.05, 20, 14), bootM, 0, -sl + 0.01, 0.045).scale.set(0.95, 0.62, 1.75);
    tadd(shin, SS(0.03, 12, 10), bootM, 0, -sl - 0.005, -0.03);
    legs[sx < 0 ? 'L' : 'R'] = { root, thigh, shin };
  }

  // --- torso: skin shoulders, the top, the bust ------------------------------------------
  const top = spec.top || { style: 'corset' };
  const covered = top.style === 'coat' || top.style === 'armor' || top.style === 'sweater';
  // (narrow through the bust, so the breasts stand out and the cleavage stays open)
  tadd(body, lathe([[0, bustY - 0.06], [0.09, bustY - 0.06], [0.095, bustY + 0.09], [F.shoulderX * 0.8, shoulderY - 0.035], [F.shoulderX + 0.02, shoulderY - 0.015], [0.09, shoulderY + 0.04], [0, shoulderY + 0.06]], 32), covered && top.collar !== false ? main : skin, 0, 0, 0);
  const topM = top.style === 'armor' ? tmat(C.metal ?? 0x9aa2ac) : main;
  tadd(body, lathe([[0, waistY - 0.06], [waistR, waistY - 0.06], [waistR, waistY + 0.04], [waistR + 0.04, bustY - 0.08], [0.15 * B.shoulder, bustY - 0.01], [covered ? 0.16 * B.shoulder : 0, covered ? shoulderY - 0.03 : bustY - 0.01], [0, covered ? shoulderY - 0.03 : bustY - 0.01]], 40), topM, 0, 0, 0);
  const bust = new THREE.Group(); bust.userData.restY = 0; body.add(bust);
  if (fem) {
    const r = F.bustR, bx = r * 0.6, bz = 0.105, cupM = top.style === 'armor' ? topM : sweater ? main : tmat(C.main, { noOutline: true });
    const showSkin = !covered || top.keyhole;
    for (const sx of [-1, 1]) {
      if (showSkin) tadd(bust, SS(r), tmat(C.skin, { soft: true, noOutline: true }), sx * bx, bustY + 0.005, bz).scale.set(1, 0.95, 0.95);
      // the cup: fabric (or plate) over the lower part of the breast
      const cut = showSkin ? (top.cut ?? 0.95) : 0;
      const cup = tadd(bust, new THREE.SphereGeometry(r * 1.035, 32, 24, 0, Math.PI * 2, cut, Math.PI - cut), cupM, sx * bx, bustY + 0.005, bz);
      cup.scale.set(1, 0.95, 0.95); cup.rotation.x = showSkin ? 0.15 : 0;
      if (showSkin) tadd(bust, ST(r * 1.035 * Math.sin(cut), 0.008), tmat(C.trim, { noOutline: true }), sx * bx, bustY + 0.005 + r * Math.cos(cut) * 0.95, bz - 0.012, Math.PI / 2 + 0.15);
    }
    if (showSkin) {
      // the cleavage line: a soft shadow in the gap above the cups, where they press together
      const line = tmat(new THREE.Color(C.skin).multiplyScalar(0.55).lerp(new THREE.Color(0x8a3a3a), 0.25).getHex(), { noOutline: true });
      const dy = r * 0.5, front = bz + Math.sqrt(Math.max(0, r * r - bx * bx - dy * dy)) * 0.95 + 0.004;
      tadd(bust, new THREE.CapsuleGeometry(0.008, r * 0.45, 4, 8), line, 0, bustY + 0.005 + dy, front, -0.55);
    }
  }
  if (top.corset !== false && top.style !== 'armor') {
    tadd(body, lathe([[0, waistY - 0.07], [waistR + 0.012, waistY - 0.07], [waistR + 0.012, waistY + 0.08], [0, waistY + 0.08]], 40), deep, 0, 0, 0);
    for (const y of [waistY - 0.07, waistY + 0.08]) tadd(body, ST(waistR + 0.013, 0.008), trim, 0, y, 0, Math.PI / 2);
    const lace = tmat(C.trim, { noOutline: true });
    for (let i = 0; i < 3; i++) {
      const y = waistY - 0.04 + i * 0.045;
      tadd(body, new THREE.BoxGeometry(0.06, 0.008, 0.008), lace, 0, y, waistR + 0.012, 0, 0, 0.5);
      tadd(body, new THREE.BoxGeometry(0.06, 0.008, 0.008), lace, 0, y, waistR + 0.012, 0, 0, -0.5);
    }
  }
  if (top.buttons) for (let i = 0; i < top.buttons; i++) tadd(body, SS(0.016, 12, 10), trim, 0, (top.keyhole ? bustY - 0.08 : shoulderY - 0.1) - i * 0.07, waistR + 0.03 + Math.max(0, 0.04 - i * 0.01));
  if (top.style === 'coat' && top.collar !== false) tadd(body, new THREE.CylinderGeometry(0.075, 0.1, 0.13, 24), main, 0, shoulderY + 0.07, 0); // high collar
  if (sweater) {
    // a ribbed crew neck, and a hem band that hangs down over the hips
    tadd(body, new THREE.CylinderGeometry(0.075, 0.085, 0.07, 24), deep, 0, shoulderY + 0.03, 0);
    tadd(body, lathe([[0, hipY - 0.03], [hipR * 1.06, hipY - 0.03], [hipR * 1.03, waistY - 0.02], [waistR + 0.02, waistY + 0.04], [0, waistY + 0.04]], 40), main, 0, 0, 0);
    tadd(body, lathe([[0, hipY - 0.05], [hipR * 1.08, hipY - 0.05], [hipR * 1.08, hipY + 0.005], [0, hipY + 0.005]], 40), deep, 0, 0, 0);
  }

  // --- skirt ---------------------------------------------------------------------------
  const sk = spec.skirt || { style: 'pleated' };
  const hips = new THREE.Group(); hips.position.y = waistY; body.add(hips);
  const skM = tmat(sk.color ?? C.main);
  const flare = sk.style === 'long' ? 1.35 : sk.style === 'tasset' ? 1.15 : 1.12;
  const pts = [[0, waistY - 0.06], [waistR + 0.01, waistY - 0.06], [hipR * 0.82, (waistY + hipY) / 2 - 0.03], [hipR, hipY], [hipR * (1 + (flare - 1) * 0.4), (hipY + hemY) / 2], [hipR * flare, hemY], [0, hemY]].map(([r, y]) => [r, y - waistY]);
  let skirtGeo = lathe(pts, 64);
  if (sk.style === 'pleated') skirtGeo = pleat(skirtGeo, 14, hipY - waistY, hemY - waistY, 0.08);
  if (sk.style === 'tattered') skirtGeo = pleat(skirtGeo, 9, hipY - waistY, hemY - waistY, 0.16);
  if (sk.style === 'tasset') skirtGeo = pleat(skirtGeo, 6, hipY - waistY, hemY - waistY, 0.1);
  tadd(hips, skirtGeo, skM, 0, 0, 0);
  if (sk.trim !== false) tadd(hips, ST(hipR * flare + 0.01, 0.013), trim, 0, hemY - waistY + 0.004, 0, Math.PI / 2);
  if (spec.cape) {
    const capeH = shoulderY - hemY - 0.05;
    const capeM = tmat(spec.cape); capeM.side = THREE.DoubleSide;
    tadd(body, new THREE.CylinderGeometry(F.shoulderX + 0.02, hipR * 1.3, capeH, 32, 1, true, Math.PI / 2, Math.PI), capeM, 0, shoulderY - capeH / 2, -0.03);
  }

  // --- arms on shoulder pivots ------------------------------------------------------------
  const armLen = shoulderY - hipY + 0.05, aw = B.arm;
  const sl2 = spec.sleeves || 'detached';
  const arms = {};
  for (const sx of [-1, 1]) {
    const arm = new THREE.Group();
    arm.position.set(sx * (F.shoulderX + 0.04), shoulderY - 0.04, 0);
    arm.userData.rest = sx * (spec.armRest ?? 0.32); arm.rotation.z = arm.userData.rest;
    arm.name = sx < 0 ? 'armL' : 'armR';
    body.add(arm);
    if (sl2 === 'detached') {
      tadd(arm, SS(0.07), main, 0, -0.01, 0).scale.set(1, 0.8, 1);
      tadd(arm, SC(0.045 * aw, armLen * 0.36), skin, 0, -armLen * 0.28, 0);
      tadd(arm, SC(0.055 * aw, armLen * 0.3), main, 0, -armLen * 0.66, 0);
      tadd(arm, ST(0.055 * aw, 0.012), trim, 0, -armLen * 0.83, 0, Math.PI / 2);
    } else if (sl2 === 'long') {
      tadd(arm, SC(0.055 * aw, armLen * 0.72), main, 0, -armLen * 0.45, 0);
      tadd(arm, new THREE.CylinderGeometry(0.06 * aw, 0.085 * aw, 0.1, 20, 1, true), deep, 0, -armLen * 0.82, 0);
    } else if (sl2 === 'armor') {
      tadd(arm, SS(0.085 * aw), tmat(C.metal ?? 0x9aa2ac), 0, -0.01, 0).scale.set(1.1, 0.85, 1);      // pauldron
      tadd(arm, SC(0.05 * aw, armLen * 0.36), main, 0, -armLen * 0.3, 0);
      tadd(arm, SC(0.06 * aw, armLen * 0.3), tmat(C.metal ?? 0x9aa2ac), 0, -armLen * 0.68, 0);         // vambrace / gauntlet
    } else { // bare arms, gloves
      tadd(arm, SC(0.045 * aw, armLen * 0.66), skin, 0, -armLen * 0.45, 0);
      tadd(arm, SC(0.05 * aw, armLen * 0.22), tmat(C.glove ?? C.deep ?? 0x1a1214), 0, -armLen * 0.78, 0);
    }
    tadd(arm, SS(0.055 * aw), sl2 === 'armor' ? tmat(C.metal ?? 0x9aa2ac) : sl2 === 'bare' ? tmat(C.glove ?? 0x1a1214) : skin, 0, -armLen * 0.93, 0);
    arms[sx < 0 ? 'L' : 'R'] = arm;
  }
  ctx.arms = arms; ctx.armLen = armLen; ctx.legs = legs; ctx.legLen = legLen;

  // --- head ---------------------------------------------------------------------------
  tadd(body, SC(0.045, 0.05), skin, 0, shoulderY + 0.06, 0);
  const head = tadd(body, SS(hr), skin, 0, hy, 0); head.name = 'head';
  for (const sx of [-1, 1]) tadd(body, SS(0.06 * k), skin, sx * hr * 0.97, hy - 0.02, 0).scale.set(0.6, 1, 0.8);
  const faceMesh = face(body, hr, hy, spec.face || {});
  toonHair(body, spec.hair || 'long', ctx);

  // gear: weapon in the right hand, armor pieces (adventuring attire only), charms always
  const gear = spec.gear || {};
  ctx.hasWeapon = !!(gear.weapon && spec.showArms !== false);
  if (spec.extras) spec.extras(ctx);
  if (ctx.hasWeapon) { const w = weaponMesh(gear.weapon); w.position.set(0.04, -armLen * 0.97, 0.06); w.rotation.z = -0.3; arms.R.add(w); }
  gearVisuals(ctx, spec.showArms === false ? { charm: gear.charm } : gear);
  outline(g);
  g.userData.isChibi = true;
  g.userData.rig = makeRig({ face: faceMesh, armR: arms.R, armL: arms.L, bust, hips, body, legs: legs.L ? legs : null, legLen });
  return g;
}

// --- hair --------------------------------------------------------------------------------
function fringe(body, ctx, count = 6, len = 1.45, spread = 0.22) {
  const { hy, hr, k, hair } = ctx;
  for (let i = 0; i < count; i++) {
    const x0 = -spread + (2 * spread * i) / (count - 1), x = x0 * k, R = hr * 1.08;
    tadd(body, SS(0.085 * k), hair, x, hy + (0.16 - Math.abs(x0) * 0.35) * k, Math.sqrt(R * R - x * x) - 0.06 * k, -0.25, 0, -x0 * 1.6 + (i % 2 ? 0.08 : -0.08)).scale.set(0.62, len, 0.5);
  }
}
export function toonHair(body, style, ctx) {
  const { hy, hr, k, hair, bustY, waistY } = ctx;
  tadd(body, SS(hr * 1.08), hair, 0, hy + 0.05 * k, -0.035 * k).scale.set(1, 0.95, 1);
  const shine = () => tadd(body, ST(0.24 * k, 0.013), tmat(new THREE.Color(ctx.C.hair).lerp(new THREE.Color(0xffffff), 0.55).getHex(), { noOutline: true }), 0, hy + 0.2 * k, 0.04, Math.PI / 2 - 0.35);
  if (style === 'long' || style === 'straight') {
    fringe(body, ctx);
    const sideLen = (hy - bustY) * 0.9;
    for (const sx of [-1, 1]) tadd(body, SC(0.058 * k, sideLen), hair, sx * hr * 0.92, hy - sideLen * 0.45, 0.07 * k, 0, 0, sx * 0.08);
    const len = hy - waistY + (style === 'straight' ? 0.12 : 0);
    tadd(body, SC(0.2 * k, len * 0.8), hair, 0, hy - len * 0.55, -0.2 * k).scale.set(1.25, 1, 0.6);
    for (const [x, rz] of [[-0.16, 0.25], [0, 0], [0.16, -0.25]]) tadd(body, SC(0.08 * k, 0.18), hair, x * k, hy - len - 0.02, -0.22 * k, 0.2, 0, rz);
  } else if (style === 'curly') {
    // a wild mane: big soft curls all round, a messy fringe
    fringe(body, ctx, 5, 1.2, 0.2);
    for (let i = 0; i < 9; i++) {
      const a = (i / 8 - 0.5) * 3.4;
      tadd(body, SS((0.11 + (i % 3) * 0.02) * k), hair, Math.sin(a) * hr * 1.05, hy - 0.12 * k - Math.abs(Math.cos(a * 0.5)) * 0.1 * k - (i % 2) * 0.08 * k, -Math.cos(a) * hr * 0.75);
    }
    for (const sx of [-1, 1]) tadd(body, SS(0.1 * k), hair, sx * hr * 1.0, hy - 0.06 * k, 0.02).scale.set(0.8, 1.2, 0.8);
  } else if (style === 'short') {
    // a short, side-swept cut
    for (let i = 0; i < 4; i++) tadd(body, SS(0.09 * k), hair, (-0.16 + i * 0.1) * k, hy + (0.17 - i * 0.02) * k, hr * 0.82, -0.4, 0, -0.9).scale.set(0.6, 1.5, 0.5);
    for (const sx of [-1, 1]) tadd(body, SS(0.08 * k), hair, sx * hr * 0.95, hy + 0.02, 0.0).scale.set(0.6, 1.2, 0.9);
    tadd(body, SS(hr * 0.95), hair, 0, hy - 0.04 * k, -0.08 * k).scale.set(1.05, 0.9, 0.9);
  }
  shine();
}

// --- toon accessories ----------------------------------------------------------------------
export function toonHorns(body, ctx, color, size = 1) {
  const { hy, k } = ctx; const m = tmat(color);
  for (const sx of [-1, 1]) {
    const h = new THREE.Group(); h.position.set(sx * 0.13 * k, hy + 0.22 * k, -0.02); h.rotation.z = -sx * 0.45; body.add(h);
    tadd(h, new THREE.ConeGeometry(0.045 * k * size, 0.26 * k * size, 16), m, 0, 0.11 * k * size, 0, -0.35);
  }
}
export function toonTail(body, ctx, color, tip) {
  const t = new THREE.Group(); t.position.set(0, ctx.hipY + 0.02, -ctx.hipR * 0.9); t.rotation.x = 0.7; body.add(t);
  const m = tmat(color);
  tadd(t, SC(0.028, 0.32), m, 0, -0.18, 0, 0, 0, 0.2);
  tadd(t, SC(0.024, 0.26), m, 0.07, -0.42, 0.04, -0.5, 0, -0.5);
  if (tip) tadd(t, new THREE.ConeGeometry(0.06, 0.12, 4), tmat(tip), 0.16, -0.55, 0.12, 0, 0, -2.0).scale.set(1, 1, 0.35);
}

// ============================================================
// VISIBLE GEAR — what a character has equipped shows on them.
// gear: { weapon: {type, tier, affix}, armor: {...}, charm: {...} }
// Tier sets the metal/accent color; affixes add a glow.
// ============================================================
export const TIER_COLORS = [0x9aa0a8, 0xd8783a, 0x9a5ad8, 0x4a9a5a, 0xd8b45a, 0x6a2aa8];
const AFFIX_GLOW = { flame: 0xff7a2a, frost: 0x8ad8ff, venom: 0x8aff6a, cruel: 0xd02a3a, vampiric: 0xa01a3a, keen: 0xf0f0ff, savage: 0xff5a5a, arcane: 0xb08cff, brutal: 0xd88a4a, headsmans: 0x8a8a9a,
  thorned: 0x6a9a3a, warding: 0x8ac8ff, living: 0x8aff8a, bulwark: 0xd8d8e8, stalwart: 0xd8b45a, swift: 0x8ad8ff, lucky: 0x8aff6a, focused: 0xb08cff, blessed: 0xfff0a0, vigor: 0xff8a5a };
const STEEL = 0xd8dee6;

export function parseGear(sig) {
  if (!sig) return {};
  const [w, a, c] = sig.split(',');
  const one = s => { if (!s || s === '-') return null; const [type, tier, affix] = s.split('.'); return { type, tier: +tier || 0, affix: affix || null }; };
  return { weapon: one(w), armor: one(a), charm: one(c) };
}

export function weaponMesh(w) {
  const g = new THREE.Group();
  const tc = TIER_COLORS[w.tier] ?? TIER_COLORS[0];
  const glowC = AFFIX_GLOW[w.affix];
  const metal = tmat(STEEL), accent = tmat(tc), wood = tmat(0x6a4a2e), grip = tmat(0x3a2a20);
  const glowM = glowC ? tmat(glowC, { emissive: glowC, ei: 1.6 }) : null;
  if (w.type === 'blade') {
    tadd(g, new THREE.BoxGeometry(0.05, 0.5, 0.016), metal, 0, 0.36, 0);
    tadd(g, new THREE.ConeGeometry(0.035, 0.08, 4), metal, 0, 0.65, 0, 0, Math.PI / 4).scale.set(1, 1, 0.45);
    tadd(g, new THREE.BoxGeometry(0.17, 0.03, 0.035), accent, 0, 0.1, 0);
    tadd(g, SC(0.018, 0.1), grip, 0, 0.02, 0);
    tadd(g, SS(0.025, 12, 10), accent, 0, -0.05, 0);
    if (glowM) tadd(g, new THREE.BoxGeometry(0.012, 0.44, 0.02), glowM, 0, 0.36, 0);
  } else if (w.type === 'warhammer') {
    tadd(g, SC(0.018, 0.55), wood, 0, 0.22, 0);
    tadd(g, new THREE.BoxGeometry(0.2, 0.1, 0.1), metal, 0, 0.52, 0);
    tadd(g, new THREE.BoxGeometry(0.21, 0.025, 0.105), accent, 0, 0.52, 0);
    if (glowM) tadd(g, SS(0.03, 12, 10), glowM, 0, 0.52, 0.055);
  } else if (w.type === 'staff') {
    tadd(g, SC(0.016, 0.95), wood, 0, 0.35, 0);
    tadd(g, ST(0.06, 0.012), accent, 0, 0.86, 0, Math.PI / 2);
    tadd(g, SS(0.055, 16, 12), tmat(glowC ?? tc, { emissive: glowC ?? tc, ei: 1.5 }), 0, 0.88, 0);
  } else if (w.type === 'grimoire') {
    tadd(g, new THREE.BoxGeometry(0.22, 0.29, 0.07), tmat(new THREE.Color(tc).multiplyScalar(0.55).getHex()));
    tadd(g, new THREE.BoxGeometry(0.2, 0.27, 0.075), tmat(0xe8e0d0, { noOutline: true }), 0.006, 0, 0);
    tadd(g, ST(0.045, 0.008), tmat(glowC ?? tc, { emissive: glowC ?? tc, ei: 1.4 }), 0, 0, 0.038);
  } else if (w.type === 'lance') {
    tadd(g, SC(0.016, 1.05), wood, 0, 0.42, 0);
    tadd(g, new THREE.ConeGeometry(0.035, 0.22, 4), metal, 0, 1.06, 0);
    tadd(g, ST(0.03, 0.012), accent, 0, 0.95, 0, Math.PI / 2);
    if (glowM) tadd(g, new THREE.ConeGeometry(0.02, 0.16, 4), glowM, 0, 1.06, 0.012);
  }
  return g;
}

// Armor and charms as pieces layered onto the figure.
export function gearVisuals(ctx, gear) {
  const { body, arms, armLen, shoulderY, waistY, hipY, hemY, hipR, hy, k, F } = ctx;
  const A = gear.armor, Ch = gear.charm;
  if (A) {
    const tc = TIER_COLORS[A.tier] ?? TIER_COLORS[0];
    const glowC = AFFIX_GLOW[A.affix];
    if (A.type === 'plate') {
      for (const arm of [arms.L, arms.R]) {
        tadd(arm, SS(0.088), tmat(STEEL), 0, 0.0, 0).scale.set(1.15, 0.8, 1.05);
        tadd(arm, ST(0.075, 0.012), tmat(tc), 0, -0.04, 0, Math.PI / 2);
        tadd(arm, SC(0.06, armLen * 0.2), tmat(STEEL), 0, -armLen * 0.7, 0);
      }
      tadd(body, ST(ctx.waistR + 0.02, 0.022), tmat(STEEL), 0, waistY - 0.07, 0, Math.PI / 2);
    } else if (A.type === 'robe') {
      const robeM = tmat(new THREE.Color(tc).multiplyScalar(0.45).getHex()); robeM.side = THREE.DoubleSide;
      const h = shoulderY - 0.1;
      tadd(body, new THREE.CylinderGeometry(F.shoulderX + 0.04, hipR * 1.4, h, 32, 1, true, Math.PI * 0.24, Math.PI * 1.52), robeM, 0, shoulderY - h / 2 - 0.02, -0.02);
      tadd(body, ST(F.shoulderX + 0.05, 0.016), tmat(tc), 0, shoulderY - 0.03, 0, Math.PI / 2);
    } else if (A.type === 'hauberk') {
      const chain = tmat(0x8a9098);
      tadd(body, lathe([[0, hipY], [hipR * 1.02, hipY], [hipR * 1.14, hemY - 0.06], [0, hemY - 0.06]], 40), chain, 0, 0, 0);
      tadd(body, new THREE.CylinderGeometry(0.075, 0.12, 0.06, 24), chain, 0, shoulderY + 0.02, 0);
      tadd(body, ST(0.12, 0.01), tmat(tc), 0, shoulderY - 0.01, 0, Math.PI / 2);
    } else if (A.type === 'cloak') {
      const cm = tmat(new THREE.Color(tc).multiplyScalar(0.4).getHex()); cm.side = THREE.DoubleSide;
      const h = shoulderY - hipY + 0.05;
      tadd(body, new THREE.CylinderGeometry(F.shoulderX + 0.05, hipR * 1.3, h, 32, 1, true, Math.PI / 2, Math.PI), cm, 0, shoulderY - h / 2, -0.04);
      tadd(body, new THREE.SphereGeometry(0.2 * k, 24, 16, 0, Math.PI * 2, Math.PI * 0.35, Math.PI * 0.45), cm, 0, hy - 0.02, -0.13 * k).rotation.x = -0.9; // the hood, down
      tadd(body, SS(0.025, 12, 10), tmat(tc), F.shoulderX * 0.6, shoulderY - 0.02, 0.1);
    }
    if (glowC) tadd(body, SS(0.022, 12, 10), tmat(glowC, { emissive: glowC, ei: 1.8 }), 0, waistY + 0.005, ctx.waistR + 0.03);
  }
  if (Ch) {
    const tc = TIER_COLORS[Ch.tier] ?? TIER_COLORS[0];
    const gemC = AFFIX_GLOW[Ch.affix] ?? tc;
    const gem = tmat(gemC, { emissive: gemC, ei: 1.4 });
    if (Ch.type === 'pendant') {
      tadd(body, ST(0.085, 0.005), tmat(0xd8b45a, { noOutline: true }), 0, shoulderY - 0.005, 0.035, Math.PI / 2 - 0.5);
      tadd(body, SS(0.022, 12, 10), gem, 0, shoulderY - 0.06, 0.115);
    } else if (Ch.type === 'ring') {
      tadd(arms.L, ST(0.03, 0.008), gem, 0.02, -armLen * 0.96, 0.03, Math.PI / 2);
    } else if (Ch.type === 'sigil') {
      const s = tadd(body, ST(0.06, 0.008), gem, F.shoulderX + 0.18, shoulderY + 0.12, 0.05, 0.3, 0.5); s.name = 'sigil';
      tadd(s, ST(0.035, 0.006), gem, 0, 0, 0);
    } else if (Ch.type === 'band') {
      tadd(arms.R, ST(0.052, 0.012), tmat(tc), 0, -armLen * 0.35, 0, Math.PI / 2);
      tadd(arms.R, SS(0.014, 10, 8), gem, 0, -armLen * 0.35, 0.05);
    } else if (Ch.type === 'idol') {
      const idol = new THREE.Group(); idol.position.set(ctx.waistR + 0.02, waistY - 0.1, 0.05); body.add(idol);
      tadd(idol, SC(0.014, 0.03), tmat(tc), 0, 0, 0);
      tadd(idol, SS(0.016, 10, 8), gem, 0, 0.035, 0);
    }
  }
}
