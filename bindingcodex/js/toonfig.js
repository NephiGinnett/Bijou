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
  const skin = tmat(C.skin, { soft: true }), hair = tmat(C.hair), main = tmat(C.main), deep = tmat(C.deep ?? shade(C.main, 0.7)), trim = tmat(C.trim);
  const ctx = { F, k, g, body, skin, hair, main, deep, trim, C, hy, hr, shoulderY, bustY, waistY, hipY, hemY, waistR, hipR };

  // --- legs: hip pivot > thigh > knee pivot > shin > boot -------------------------------
  const legLen = hipY, tl = legLen * 0.5, sl = legLen * 0.5, th = B.thigh;
  const thighP = [[0, -tl], [0.058 * th, -tl], [0.068 * th, -tl * 0.6], [0.088 * th, -tl * 0.15], [0.094 * th, 0], [0, 0]];
  const shinP = [[0, -sl], [0.04, -sl], [0.044, -sl * 0.85], [0.062 * th, -sl * 0.45], [0.055 * th, -sl * 0.05], [0.057 * th, 0], [0, 0]];
  const L = spec.legs || { style: 'stockings' };
  const legM = tmat(L.color ?? C.deep ?? 0x1b2620), bootM = tmat(L.boots ?? 0x2a1e18);
  const legs = {};
  for (const sx of [-1, 1]) {
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
  const covered = top.style === 'coat' || top.style === 'armor';
  // (narrow through the bust, so the breasts stand out and the cleavage stays open)
  tadd(body, lathe([[0, bustY - 0.06], [0.09, bustY - 0.06], [0.095, bustY + 0.09], [F.shoulderX * 0.8, shoulderY - 0.035], [F.shoulderX + 0.02, shoulderY - 0.015], [0.09, shoulderY + 0.04], [0, shoulderY + 0.06]], 32), covered && top.collar !== false ? main : skin, 0, 0, 0);
  const topM = top.style === 'armor' ? tmat(C.metal ?? 0x9aa2ac) : main;
  tadd(body, lathe([[0, waistY - 0.06], [waistR, waistY - 0.06], [waistR, waistY + 0.04], [waistR + 0.04, bustY - 0.08], [0.15 * B.shoulder, bustY - 0.01], [covered ? 0.16 * B.shoulder : 0, covered ? shoulderY - 0.03 : bustY - 0.01], [0, covered ? shoulderY - 0.03 : bustY - 0.01]], 40), topM, 0, 0, 0);
  const bust = new THREE.Group(); bust.userData.restY = 0; body.add(bust);
  if (fem) {
    const r = F.bustR, bx = r * 0.6, bz = 0.105, cupM = top.style === 'armor' ? topM : tmat(C.main, { noOutline: true });
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
  ctx.arms = arms; ctx.armLen = armLen;

  // --- head ---------------------------------------------------------------------------
  tadd(body, SC(0.045, 0.05), skin, 0, shoulderY + 0.06, 0);
  const head = tadd(body, SS(hr), skin, 0, hy, 0); head.name = 'head';
  for (const sx of [-1, 1]) tadd(body, SS(0.06 * k), skin, sx * hr * 0.97, hy - 0.02, 0).scale.set(0.6, 1, 0.8);
  const faceMesh = face(body, hr, hy, spec.face || {});
  toonHair(body, spec.hair || 'long', ctx);

  if (spec.extras) spec.extras(ctx);
  outline(g);
  g.userData.isChibi = true;
  g.userData.rig = makeRig({ face: faceMesh, armR: arms.R, armL: arms.L, bust, hips, body, legs, legLen });
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
