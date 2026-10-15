// ============================================================
// GATEBOUND — procedural placeholder actors + GLB drop-in
// Every actor is a cheerful low-poly chibi built from primitives,
// so the game is fully playable with zero art assets. If
// models/manifest.json maps an actor id to a .glb (e.g. exported
// from Meshy), it replaces the placeholder automatically.
// ============================================================

import * as THREE from 'three';
import { GLTFLoader } from '../vendor/GLTFLoader.js';
import { tmat, tadd, SS, SC, ST, outline, face, lathe } from './toon.js';

const gltfLoader = new GLTFLoader();
let manifestPromise = null;

function getManifest() {
  if (!manifestPromise) {
    manifestPromise = fetch('./models/manifest.json')
      .then(r => (r.ok ? r.json() : {}))
      .catch(() => ({}));
  }
  return manifestPromise;
}

// ---------------------------------------------------------------
// helpers
// ---------------------------------------------------------------

function mat(color, o = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: o.rough ?? 0.85, metalness: o.metal ?? 0.05, transparent: o.opacity != null, opacity: o.opacity ?? 1, emissive: o.emissive ?? 0x000000, emissiveIntensity: o.ei ?? 1, flatShading: o.flat ?? false });
}
function add(parent, geo, material, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  const m = new THREE.Mesh(geo, material);
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  parent.add(m);
  return m;
}
const S = (...a) => new THREE.SphereGeometry(...a);
const Cap = (...a) => new THREE.CapsuleGeometry(...a);
const Cone = (...a) => new THREE.ConeGeometry(...a);
const Cyl = (...a) => new THREE.CylinderGeometry(...a);
const Box = (...a) => new THREE.BoxGeometry(...a);
const Tor = (...a) => new THREE.TorusGeometry(...a);
const Ico = (...a) => new THREE.IcosahedronGeometry(...a);

function eyes(g, color = 0x1c1c24, y = 1.2, spread = 0.11, z = 0.255, r = 0.038, glow = false) {
  const m = glow ? mat(color, { emissive: color, ei: 2 }) : mat(color, { rough: 0.4 });
  add(g, S(r, 8, 8), m, -spread, y, z);
  add(g, S(r, 8, 8), m, spread, y, z);
}

function sword(color = 0xcfd6dd, len = 0.55) {
  const g = new THREE.Group();
  add(g, Box(0.055, len, 0.018), mat(color, { metal: 0.7, rough: 0.35 }), 0, len / 2 + 0.1, 0);
  add(g, Box(0.16, 0.035, 0.035), mat(0x8a6d3a, { metal: 0.5 }), 0, 0.1, 0);
  add(g, Cyl(0.022, 0.022, 0.14, 6), mat(0x4a3a2a), 0, 0.02, 0);
  return g;
}
function staff(orbColor = 0x66ff99) {
  const g = new THREE.Group();
  add(g, Cyl(0.03, 0.04, 1.15, 6), mat(0x7a5c3a), 0, 0.45, 0);
  add(g, S(0.09, 12, 12), mat(orbColor, { emissive: orbColor, ei: 1.6 }), 0, 1.08, 0);
  add(g, Tor(0.11, 0.02, 6, 12), mat(0xc9a86a, { metal: 0.6 }), 0, 1.08, 0);
  return g;
}
function shield(color = 0xb8c4cf) {
  const g = new THREE.Group();
  add(g, Cyl(0.24, 0.24, 0.05, 16), mat(color, { metal: 0.6, rough: 0.35 }), 0, 0, 0, Math.PI / 2, 0, 0);
  add(g, S(0.06, 8, 8), mat(0xd9b96a, { metal: 0.7 }), 0, 0, 0.045);
  return g;
}
function grimoire() {
  const g = new THREE.Group();
  add(g, Box(0.24, 0.32, 0.07), mat(0x241f2e, { rough: 0.5 }));
  add(g, Box(0.21, 0.29, 0.075), mat(0xe8e4da), 0, 0, 0.002);
  add(g, Box(0.05, 0.32, 0.075), mat(0x120f18), -0.1, 0, 0);
  return g;
}

// Base chibi body. opts:
//  skin, hair, hairstyle: short|long|curly|straight, outfit, outfitStyle:
//  tunic|dress|robe|armor, legs (bool), accent
function chibi(o = {}) {
  const g = new THREE.Group();
  const skin = o.skin ?? 0xf2d0b8;
  const outfit = o.outfit ?? 0x5a6270;

  const torsoMat = o.outfitStyle === 'armor' ? mat(outfit, { metal: 0.75, rough: 0.3 }) : mat(outfit);
  // build affects torso width: slim < average < curvy < broad
  const widthMul = { slim: 0.86, average: 1, curvy: 1.14, broad: 1.24 }[o.build] || 1;
  let torso = null;
  if (o.lowerBody === 'serpent') {
    // no legs — a coiled snake tail at the base, torso as usual
    const tm = mat(o.tailColor ?? o.legColor ?? 0x4a8a5a, { rough: 0.85, flat: true });
    const coils = [[0, 0.15, 0.0, 0.27], [0.15, 0.10, -0.03, 0.23], [-0.13, 0.06, -0.08, 0.2], [0.11, 0.04, -0.15, 0.16], [-0.05, 0.03, -0.22, 0.13], [0.02, 0.03, -0.29, 0.1]];
    for (const [x, y, z, r] of coils) add(g, S(r, 12, 10), tm, x, y, z).scale.set(1.25, 0.72, 1.25);
    torso = add(g, Cap(0.24, 0.36, 4, 12), torsoMat, 0, 0.62, 0);
  } else if (o.lowerBody === 'fishtail') {
    // mermaid: a scaled tail curving down to a fluke
    const tm = mat(o.tailColor ?? 0x3a8ab0, { rough: 0.5, flat: true });
    add(g, Cap(0.2, 0.34, 4, 10), tm, 0, 0.28, -0.02);
    add(g, Cap(0.12, 0.26, 4, 8), tm, 0.02, 0.05, -0.12, 0.5);
    add(g, Cone(0.22, 0.12, 6), tm, 0.08, -0.05, -0.24, 0, 0, 1.4);   // fluke
    add(g, Cone(0.22, 0.12, 6), tm, -0.04, -0.05, -0.24, 0, 0, 1.9);
    torso = add(g, Cap(0.24, 0.36, 4, 12), torsoMat, 0, 0.62, 0);
  } else if (o.lowerBody === 'centaur') {
    // humanoid torso atop a horse barrel + four legs + tail
    const hm = mat(o.legColor ?? o.skin ?? 0x8a5a3a, { rough: 0.85 });
    add(g, Cap(0.26, 0.5, 4, 10), hm, 0, 0.42, -0.34, 0, 0, Math.PI / 2); // barrel
    for (const [x, z] of [[-0.14, -0.16], [0.14, -0.16], [-0.14, -0.52], [0.14, -0.52]]) add(g, Cyl(0.05, 0.06, 0.42, 6), hm, x, 0.2, z);
    add(g, Cap(0.03, 0.3, 4, 6), mat(o.hair ?? hm.color, { rough: 0.9 }), 0, 0.4, -0.62, -0.6); // horse tail
    torso = add(g, Cap(0.24, 0.36, 4, 12), torsoMat, 0, 0.66, 0.02);
  } else if (o.outfitStyle === 'dress' || o.outfitStyle === 'robe') {
    torso = add(g, Cone(0.42, 0.85, 10), mat(outfit), 0, 0.46, 0);
    if (o.frill) add(g, Tor(0.32, 0.05, 8, 16), mat(o.frill), 0, 0.12, 0, Math.PI / 2);
    add(g, Cap(0.2, 0.22, 4, 10), mat(outfit), 0, 0.85, 0);
  } else {
    const legMat = mat(o.legColor ?? 0x3a3f4a);
    add(g, Cyl(0.075, 0.09, 0.34, 8), legMat, -0.11, 0.19, 0);
    add(g, Cyl(0.075, 0.09, 0.34, 8), legMat, 0.11, 0.19, 0);
    if (o.lowerBody === 'hooves') {
      const hm = mat(0x2a221a, { rough: 0.6 });
      add(g, Cyl(0.085, 0.06, 0.1, 6), hm, -0.11, 0.03, 0.01);
      add(g, Cyl(0.085, 0.06, 0.1, 6), hm, 0.11, 0.03, 0.01);
    }
    torso = add(g, Cap(0.24, 0.36, 4, 12), torsoMat, 0, 0.62, 0);
  }
  if (torso && widthMul !== 1) torso.scale.x = widthMul;
  // chest (character differentiation), sized 0-3
  if (o.chest > 0) {
    const cr = [0, 0.08, 0.105, 0.135][Math.min(3, o.chest)];
    const cy = o.outfitStyle === 'dress' || o.outfitStyle === 'robe' ? 0.72 : 0.68;
    const cm = o.outfitStyle === 'armor' ? mat(outfit, { metal: 0.6, rough: 0.35 }) : mat(outfit);
    const sx = 0.085 * widthMul;
    add(g, S(cr, 10, 8), cm, -sx, cy, 0.15).scale.set(1, 0.9, 0.8);
    add(g, S(cr, 10, 8), cm, sx, cy, 0.15).scale.set(1, 0.9, 0.8);
  }
  // arms
  const armMat = o.outfitStyle === 'armor' ? mat(outfit, { metal: 0.6, rough: 0.35 }) : mat(o.sleeve ?? outfit);
  const armL = add(g, Cap(0.07, 0.3, 4, 8), armMat, -0.31, 0.75, 0, 0, 0, 0.35);
  const armR = add(g, Cap(0.07, 0.3, 4, 8), armMat, 0.31, 0.75, 0, 0, 0, -0.35);
  armL.name = 'armL'; armR.name = 'armR';
  // hands
  add(g, S(0.075, 8, 8), mat(skin), -0.39, 0.58, 0);
  add(g, S(0.075, 8, 8), mat(skin), 0.39, 0.58, 0);
  // head
  const head = add(g, S(0.31, 16, 14), mat(skin), 0, 1.19, 0);
  head.name = 'head';
  eyes(g, o.eyeColor ?? 0x1c1c24, 1.21, 0.11, 0.26, 0.038, o.eyeGlow);
  // hair
  if (o.hair != null) {
    const hm = mat(o.hair, { rough: 0.7 });
    add(g, S(0.335, 14, 12), hm, 0, 1.24, -0.035).scale.set(1, 0.92, 1);
    add(g, Box(0.5, 0.1, 0.12), hm, 0, 1.42, 0.16, -0.25);
    if (o.hairstyle === 'long') {
      add(g, Cap(0.15, 0.55, 4, 8), hm, 0, 0.85, -0.26);
    } else if (o.hairstyle === 'curly') {
      for (let i = 0; i < 5; i++) {
        const a = (i / 4 - 0.5) * 1.6;
        add(g, S(0.13 + (i % 2) * 0.03, 8, 8), hm, Math.sin(a) * 0.26, 0.92 - Math.abs(a) * 0.12 - (i % 2) * 0.14, -0.22 - Math.cos(a) * 0.06);
      }
      add(g, S(0.12, 8, 8), hm, -0.3, 1.18, -0.05);
      add(g, S(0.12, 8, 8), hm, 0.3, 1.18, -0.05);
    } else if (o.hairstyle === 'straight') {
      add(g, Box(0.5, 0.62, 0.14), hm, 0, 0.92, -0.24);
      add(g, Box(0.12, 0.5, 0.12), hm, -0.28, 1.0, 0.02);
      add(g, Box(0.12, 0.5, 0.12), hm, 0.28, 1.0, 0.02);
    } else if (o.hairstyle === 'braided') {
      // a segmented braid down one side
      for (let i = 0; i < 5; i++) add(g, S(0.075, 8, 8), hm, 0.24 - i * 0.008, 1.02 - i * 0.13, -0.06);
      add(g, Box(0.34, 0.28, 0.12), hm, 0, 1.02, -0.16); // fuller back
    }
  }
  // ink / markings — a couple of accent lines on the arms & cheek
  if (o.markings) {
    const mk = mat(o.markingColor ?? 0x6a4a9a, { emissive: o.markingColor ?? 0x6a4a9a, ei: 0.35 });
    add(g, Box(0.02, 0.18, 0.02), mk, -0.31, 0.78, 0.07, 0, 0, 0.35);
    add(g, Box(0.02, 0.18, 0.02), mk, 0.31, 0.78, 0.07, 0, 0, -0.35);
    add(g, Box(0.015, 0.07, 0.01), mk, -0.14, 1.18, 0.26, 0, 0, 0.3);
  }
  // elf ears
  if (o.elf) {
    const em = mat(skin);
    add(g, Cone(0.05, 0.22, 6), em, -0.33, 1.24, 0, 0, 0, Math.PI / 2.3);
    add(g, Cone(0.05, 0.22, 6), em, 0.33, 1.24, 0, 0, 0, -Math.PI / 2.3);
  }
  g.userData.isChibi = true;
  return g;
}

// ---------------------------------------------------------------
// hero builders
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// soft-toon Zoe: blonde, dark green coat-dress, gold accents
// ---------------------------------------------------------------
// Figures: where the body's landmarks sit. 'curvy' keeps chibi proportions;
// 'tall' is a semi-chibi with a smaller head and longer legs.
export const TOON_FIGURES = {
  curvy: { hr: 0.31, hy: 1.2, shoulderY: 0.92, bustY: 0.8, waistY: 0.63, hipY: 0.5, hemY: 0.33, waistR: 0.112, hipR: 0.27, bustR: 0.115, shoulderX: 0.19 },
  tall:  { hr: 0.255, hy: 1.6, shoulderY: 1.3, bustY: 1.17, waistY: 0.98, hipY: 0.82, hemY: 0.62, waistR: 0.105, hipR: 0.25, bustR: 0.11, shoulderX: 0.18 },
};
export let TOON_FIGURE = 'curvy';

function toonPlayer(v, opts = {}) {
  const scar = !!v && v.endsWith('_scar'); if (scar) v = v.slice(0, -5);
  const mantle = !!v && v.endsWith('_mantle'); if (mantle) v = v.slice(0, -7);
  const fem = v === 'she' || v == null;
  const F = TOON_FIGURES[opts.figure || TOON_FIGURE];
  const { hr, hy, shoulderY, bustY, waistY, hipY, hemY } = F;
  const waistR = fem ? F.waistR : F.waistR + 0.05, hipR = fem ? F.hipR : F.hipR - 0.04;
  const k = hr / 0.32; // hair and face scale with the head
  const g = new THREE.Group();
  const SKIN = 0xf6dcc8, HAIR = 0xf2d27a, GREEN = 0x1f4a34, DEEP = 0x143224, GOLD = 0xd8b45a, STOCK = 0x1b2620, BOOT = 0x2a1e18;
  const skin = tmat(SKIN, { soft: true }), hair = tmat(HAIR), green = tmat(GREEN), deep = tmat(DEEP), gold = tmat(GOLD);
  const smooth = tmat(GREEN, { noOutline: true });

  // legs: shapely thighs, knees, calves; thigh-high stockings with a gold band
  const L = hipY + 0.02;
  const leg = [[0, 0], [0.04, 0.0], [0.046, 0.08 * L], [0.064, 0.3 * L], [0.052, 0.5 * L], [0.085, 0.78 * L], [0.098, 0.95 * L], [0, L]];
  const stock = [[0, 0], [0.044, 0.0], [0.05, 0.08 * L], [0.068, 0.3 * L], [0.056, 0.5 * L], [0.074, 0.6 * L], [0, 0.6 * L]];
  const boot = [[0, 0], [0.058, 0.0], [0.06, 0.05 * L], [0.056, 0.2 * L], [0, 0.2 * L]];
  for (const sx of [-1, 1]) {
    tadd(g, lathe(leg, 24), skin, sx * 0.095, 0, 0);
    tadd(g, lathe(stock, 24), tmat(STOCK), sx * 0.095, 0.002, 0);
    tadd(g, ST(0.075, 0.011), gold, sx * 0.095, 0.6 * L, 0, Math.PI / 2);
    tadd(g, lathe(boot, 24), tmat(BOOT), sx * 0.095, 0, 0.005);
  }
  // upper body skin (shoulders and collarbone show above the neckline)
  tadd(g, lathe([[0, bustY - 0.06], [0.13, bustY - 0.06], [0.15, bustY], [F.shoulderX + 0.02, shoulderY - 0.02], [0.09, shoulderY + 0.04], [0, shoulderY + 0.06]], 32), skin, 0, 0, 0);
  // the bodice: cinched waist up to a neckline across the bust
  const neckY = bustY + 0.05;
  tadd(g, lathe([[0, waistY - 0.06], [waistR, waistY - 0.06], [waistR, waistY + 0.04], [waistR + 0.04, bustY - 0.08], [0.165, bustY], [0.16, neckY], [0, neckY]], 40), green, 0, 0, 0);
  if (fem) {
    const bust = smooth;
    for (const sx of [-1, 1]) tadd(g, SS(F.bustR), bust, sx * 0.075, bustY + 0.005, 0.085).scale.set(1, 0.93, 0.95);
    tadd(g, ST(0.158, 0.013), gold, 0, neckY - 0.005, 0.01, Math.PI / 2 - 0.08); // neckline trim
  }
  // corset band: deep green with gold edges and lacing
  tadd(g, lathe([[0, waistY - 0.07], [waistR + 0.012, waistY - 0.07], [waistR + 0.012, waistY + 0.08], [0, waistY + 0.08]], 40), deep, 0, 0, 0);
  for (const y of [waistY - 0.07, waistY + 0.08]) tadd(g, ST(waistR + 0.013, 0.008), gold, 0, y, 0, Math.PI / 2);
  for (let i = 0; i < 3; i++) {
    const y = waistY - 0.04 + i * 0.045;
    tadd(g, new THREE.BoxGeometry(0.06, 0.008, 0.008), tmat(GOLD, { noOutline: true }), 0, y, waistR + 0.012, 0, 0, 0.5);
    tadd(g, new THREE.BoxGeometry(0.06, 0.008, 0.008), tmat(GOLD, { noOutline: true }), 0, y, waistR + 0.012, 0, 0, -0.5);
  }
  // skirt: out over the hips, then a short flare
  tadd(g, lathe([[0, waistY - 0.06], [waistR + 0.01, waistY - 0.06], [hipR * 0.8, (waistY + hipY) / 2 - 0.02], [hipR, hipY], [hipR * 1.05, (hipY + hemY) / 2], [hipR * 1.1, hemY], [0, hemY]], 40), green, 0, 0, 0);
  tadd(g, ST(hipR * 1.1, 0.014), gold, 0, hemY + 0.004, 0, Math.PI / 2);
  // a short cape from the shoulders
  const capeH = shoulderY - hemY - 0.05;
  const cape = new THREE.CylinderGeometry(F.shoulderX + 0.02, hipR * 1.3, capeH, 32, 1, true, Math.PI / 2, Math.PI);
  const capeM = tmat(DEEP); capeM.side = THREE.DoubleSide;
  tadd(g, cape, capeM, 0, shoulderY - capeH / 2, -0.03);
  // off-shoulder puffs, bare upper arms, detached sleeves with gold cuffs
  const armLen = shoulderY - hipY + 0.05;
  for (const sx of [-1, 1]) {
    tadd(g, SS(0.07), green, sx * (F.shoulderX + 0.03), shoulderY - 0.05, 0).scale.set(1, 0.8, 1);
    const upper = tadd(g, SC(0.045, armLen * 0.36), skin, sx * (F.shoulderX + 0.08), shoulderY - armLen * 0.3, 0, 0, 0, sx * 0.32);
    upper.name = sx < 0 ? 'armL' : 'armR';
    tadd(g, SC(0.055, armLen * 0.3), green, sx * (F.shoulderX + 0.17), shoulderY - armLen * 0.68, 0, 0, 0, sx * 0.26);
    tadd(g, ST(0.055, 0.012), gold, sx * (F.shoulderX + 0.2), shoulderY - armLen * 0.84, 0, Math.PI / 2, 0, sx * 0.26);
    tadd(g, SS(0.055), skin, sx * (F.shoulderX + 0.23), shoulderY - armLen * 0.95, 0);
  }
  // neck and head
  tadd(g, SC(0.045, 0.05), skin, 0, shoulderY + 0.06, 0);
  const head = tadd(g, SS(hr), skin, 0, hy, 0); head.name = 'head';
  for (const sx of [-1, 1]) tadd(g, SS(0.06 * k), skin, sx * hr * 0.97, hy - 0.02, 0).scale.set(0.6, 1, 0.8);
  face(g, hr, hy, { eye: 0x8a5ad8, brow: 0xc8a050, blush: 0xff8aa0 });
  // hair
  tadd(g, SS(hr * 1.08), hair, 0, hy + 0.05 * k, -0.035 * k).scale.set(1, 0.95, 1);
  [-0.22, -0.13, -0.045, 0.045, 0.13, 0.22].forEach((x0, i) => {
    const x = x0 * k, R = hr * 1.08;
    const lock = tadd(g, SS(0.085 * k), hair, x, hy + (0.16 - Math.abs(x0) * 0.35) * k, Math.sqrt(R * R - x * x) - 0.06 * k, -0.25, 0, -x0 * 1.6 + (i % 2 ? 0.08 : -0.08));
    lock.scale.set(0.62, 1.45, 0.5);
  });
  const sideLen = fem ? (hy - bustY) * 0.9 : 0.18 * k;
  for (const sx of [-1, 1]) tadd(g, SC(0.058 * k, sideLen), hair, sx * hr * 0.92, hy - sideLen * 0.45, 0.07 * k, 0, 0, sx * 0.08);
  if (fem) {
    const len = hy - waistY;
    tadd(g, SC(0.2 * k, len * 0.8), hair, 0, hy - len * 0.55, -0.2 * k).scale.set(1.25, 1, 0.6);
    for (const [x, rz] of [[-0.16, 0.25], [0, 0], [0.16, -0.25]]) tadd(g, SC(0.08 * k, 0.18), hair, x * k, waistY + 0.02, -0.22 * k, 0.2, 0, rz);
  } else if (v === 'they') {
    tadd(g, SC(0.19 * k, 0.2), hair, 0, hy - 0.18 * k, -0.2 * k).scale.set(1.25, 1, 0.6);
  }
  tadd(g, ST(0.24 * k, 0.013), tmat(0xfff2c0, { noOutline: true }), 0, hy + 0.2 * k, 0.04, Math.PI / 2 - 0.35);
  // the mark (left hand) and the hex-light (right hand)
  const handY = shoulderY - armLen * 0.95, handX = F.shoulderX + 0.23;
  tadd(g, ST(0.06, 0.016), tmat(0xc86cff, { emissive: 0xc86cff, ei: 1.6 }), -handX, handY + 0.04, 0.02, Math.PI / 2);
  const orb = tadd(g, SS(0.06), tmat(0xc86cff, { emissive: 0xc86cff, ei: 2 }), handX + 0.06, handY + 0.12, 0.08); orb.name = 'orb';
  if (mantle) {
    horns(g, 0x2a1a34, hy + 0.3 * k, 0.15 * k, 0.3 * k);
    wings(g, 0x1a2a22, shoulderY + 0.05, 0.62);
    const tail = new THREE.Group();
    tadd(tail, SC(0.04, 0.55), tmat(DEEP), 0, 0, 0, 0, 0, 0.9);
    tadd(tail, new THREE.ConeGeometry(0.08, 0.14, 12), tmat(0xc86cff, { emissive: 0xc86cff, ei: 1.2 }), -0.3, -0.2, 0, 0, 0, 2.4);
    tail.position.set(0, hipY - 0.05, -0.3); tail.rotation.x = 0.5; g.add(tail);
  }
  if (scar) tadd(g, new THREE.BoxGeometry(0.03, 0.24 * k, 0.012), tmat(0xff5a3a, { emissive: 0xff5a3a, ei: 1.8 }), 0.1 * k, hy, hr + 0.005, 0.1, 0, -0.5);
  outline(g);
  g.userData.isChibi = true;
  return g;
}
export function buildToonZoe(variant, figure) { return toonPlayer(variant, { figure }); }

const HERO_BUILDERS = {
  player: toonPlayer,
  player_classic(v) {
    // the warlock: hooded ash-black coat, violet-lined, sigil-mark aglow
    const scar = !!v && v.endsWith('_scar');
    if (scar) v = v.slice(0, -5);
    const mantle = !!v && v.endsWith('_mantle');
    if (mantle) v = v.slice(0, -7);
    const fem = v === 'she';
    const g = chibi({ skin: 0xead2bc, hair: 0xf2d27a, hairstyle: fem ? 'long' : v === 'they' ? 'straight' : 'short', outfit: 0x1f4a34, sleeve: 0x1f4a34, legColor: 0x17131c, eyeColor: 0x8a5ad8, chest: fem ? 1 : 0 });
    add(g, Cone(0.4, 0.62, 9, 1, true), mat(0x17131c), 0, 0.82, -0.06);                                   // long coat
    add(g, Cone(0.2, 0.26, 8), mat(0x17131c), 0, 1.45, -0.1, 0.3);                                         // hood
    add(g, Tor(0.2, 0.03, 6, 14), mat(0xb06cff, { emissive: 0xb06cff, ei: 0.9 }), 0, 1.02, 0, Math.PI / 2.4); // violet collar
    add(g, Tor(0.07, 0.02, 6, 10), mat(0xc86cff, { emissive: 0xc86cff, ei: 1.6 }), -0.39, 0.62, 0.02, Math.PI / 2); // the mark
    const orb = add(g, S(0.07, 10, 10), mat(0xc86cff, { emissive: 0xc86cff, ei: 2 }), 0.44, 0.72, 0.08);    // hex-light in hand
    orb.name = 'orb';
    if (mantle) { // the Wyrm's Mantle: horns, wings, tail
      horns(g, 0x2a1a34, 1.48, 0.15, 0.3);
      wings(g, 0x2a1a3a, 1.0, 0.62);
      const tail = new THREE.Group();
      add(tail, Cap(0.04, 0.55, 4, 6), mat(0x221c2a), 0, 0, 0, 0, 0, 0.9);
      add(tail, Cone(0.08, 0.14, 4), mat(0xc86cff, { emissive: 0xc86cff, ei: 1.2 }), -0.3, -0.2, 0, 0, 0, 2.4);
      tail.position.set(0, 0.42, -0.3); tail.rotation.x = 0.5; g.add(tail);
    }
    if (scar) { // the Scar Rite: a glowing ember scar across the face
      const sm = mat(0xff5a3a, { emissive: 0xff5a3a, ei: 1.8 });
      add(g, Box(0.03, 0.26, 0.012), sm, 0.08, 1.2, 0.3, 0.1, 0, -0.5);
      add(g, Box(0.02, 0.1, 0.012), sm, 0.16, 1.08, 0.28, 0.1, 0, 0.6);
    }
    return g;
  },
  vesper() {
    // Keeper of the Codex: high-collared archivist coat, brass buttons, quill in her hair
    const g = chibi({ skin: 0xf0e0d8, hair: 0x141018, hairstyle: 'long', outfit: 0x1e1a2e, outfitStyle: 'robe', frill: 0x3a2e4e, eyeColor: 0x8a8a96, chest: 1 });
    add(g, Cyl(0.2, 0.24, 0.16, 12), mat(0x1e1a2e), 0, 1.0, 0);                                            // high collar
    for (let i = 0; i < 4; i++) add(g, S(0.022, 6, 6), mat(0xc8a050, { metal: 0.8, rough: 0.3 }), 0, 0.88 - i * 0.12, 0.2);
    add(g, Cyl(0.008, 0.008, 0.34, 4), mat(0xe8e0d0), 0.14, 1.5, -0.08, 0.3, 0, -0.6);                     // quill
    add(g, Tor(0.06, 0.015, 6, 10), mat(0xb08cff, { emissive: 0xb08cff, ei: 1.4 }), -0.39, 0.62, 0.02, Math.PI / 2); // Binding sigil
    const b = grimoire(); b.position.set(0.4, 0.66, 0.12); b.rotation.y = -0.5; g.add(b);
    return g;
  },
  rue() {
    // demon of the Ninth Ember: obsidian horns, crimson mess, tattered corset jacket, tail
    const g = chibi({ skin: 0xf2c8b0, hair: 0xb8202a, hairstyle: 'curly', outfit: 0x1a1214, sleeve: 0x2a1a1c, legColor: 0x1a1214, eyeColor: 0xff8a2a, eyeGlow: true, build: 'slim' });
    horns(g, 0x15121a, 1.52, 0.17, 0.28);
    add(g, Box(0.12, 0.03, 0.02), mat(0xff7a2a, { emissive: 0xff7a2a, ei: 1.6 }), 0.08, 0.92, 0.22);          // debt brand
    const tail = new THREE.Group();
    add(tail, Cap(0.025, 0.5, 4, 6), mat(0xb8202a), 0, 0, 0, 0, 0, 0.9);
    add(tail, Cone(0.07, 0.12, 4), mat(0x15121a), -0.28, -0.18, 0, 0, 0, 2.4);
    tail.position.set(0, 0.42, -0.28); tail.rotation.x = 0.6; tail.name = 'tail';
    g.add(tail);
    return g;
  },
  isolde() {
    // last knight of the Vigil: dark weathered plate, violet runes, tattered black cloak
    const g = chibi({ skin: 0xe8d0bc, hair: 0xc8c0a8, hairstyle: 'short', outfit: 0x3a3c44, outfitStyle: 'armor', sleeve: 0x3a3c44, legColor: 0x2a2c32, eyeColor: 0x7a8088, build: 'broad' });
    add(g, Cone(0.4, 0.7, 9, 1, true), mat(0x101014, { opacity: 0.9 }), 0, 0.72, -0.1);                     // cloak
    for (let i = 0; i < 4; i++) add(g, Box(0.03, 0.06, 0.01), mat(0xb08cff, { emissive: 0xb08cff, ei: 1.5 }), -0.12 + i * 0.08, 0.7, 0.245); // runes
    add(g, Box(0.08, 0.012, 0.01), mat(0xb89a8a), 0.1, 1.33, 0.29);                                       // brow scar
    const w = sword(0xb8bcc4, 0.78); w.position.set(0.44, 0.48, 0.05); w.rotation.z = -0.35; g.add(w);
    return g;
  },
  erin(v) {
    if (v === 'formal') {
      // the gown she said she'd wear if nobody was buying
      const g = chibi({ skin: 0xf6d8ba, hair: 0xf0cf6e, hairstyle: 'long', outfit: 0x2f4f8f, outfitStyle: 'dress', frill: 0xd9b96a, eyeColor: 0x1c1c24 });
      add(g, Tor(0.26, 0.03, 6, 16), mat(0xd9b96a, { metal: 0.6 }), 0, 0.9, 0, Math.PI / 2);
      const scarf = add(g, Box(0.14, 0.6, 0.04), mat(0x6a9ae8), -0.05, 0.8, -0.3, 0.25, 0, 0.12); scarf.name = 'scarf';
      return g;
    }
    const g = chibi({ skin: 0xf6d8ba, hair: 0xf0cf6e, hairstyle: 'long', outfit: 0xc8d2dc, outfitStyle: 'armor', sleeve: 0x4a7ac8, legColor: 0x4a5a94 });
    // blue skirt + trailing scarf
    add(g, Cone(0.34, 0.3, 10, 1, true), mat(0x4a7ac8), 0, 0.36, 0);
    add(g, Tor(0.17, 0.05, 8, 14), mat(0x3d6ec2), 0, 1.0, 0, Math.PI / 2.2);
    const scarf = add(g, Box(0.14, 0.55, 0.05), mat(0x3d6ec2), -0.05, 0.78, -0.3, 0.25, 0, 0.12);
    scarf.name = 'scarf';
    const w = sword(0xe4ecf2, 0.6); w.position.set(0.42, 0.5, 0.05); w.rotation.z = -0.45; g.add(w);
    const sh = shield(0xc4ced8); sh.position.set(-0.42, 0.68, 0.08); g.add(sh);
    return g;
  },
  sakura(v) {
    if (v === 'formal') {
      const g = chibi({ skin: 0xf8ddc4, hair: 0xf5a8c8, hairstyle: 'curly', outfit: 0xfff0f5, outfitStyle: 'dress', frill: 0xd9b96a, elf: true, eyeColor: 0x2c6e4f });
      add(g, Tor(0.27, 0.03, 6, 16), mat(0xd9b96a, { metal: 0.5 }), 0, 0.9, 0, Math.PI / 2);
      for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; add(g, S(0.05, 8, 8), mat(i % 2 ? 0xff9ec6 : 0xfff4f8), Math.cos(a) * 0.28, 1.43, Math.sin(a) * 0.28); } // flower crown
      return g;
    }
    const g = chibi({ skin: 0xf8ddc4, hair: 0xf5a8c8, hairstyle: 'curly', outfit: 0xf4efe6, outfitStyle: 'robe', frill: 0xd9b96a, elf: true, eyeColor: 0x2c6e4f });
    // gold trim + big witch hat
    add(g, Tor(0.28, 0.03, 6, 16), mat(0xd9b96a, { metal: 0.5 }), 0, 0.52, 0, Math.PI / 2);
    const hat = new THREE.Group();
    add(hat, Cyl(0.52, 0.52, 0.035, 18), mat(0xf4efe6), 0, 0, 0);
    add(hat, Cone(0.28, 0.55, 12), mat(0xf4efe6), 0, 0.28, 0);
    add(hat, Tor(0.285, 0.035, 6, 16), mat(0xd9b96a, { metal: 0.5 }), 0, 0.045, 0, Math.PI / 2);
    hat.position.set(0, 1.5, -0.03); hat.rotation.x = -0.12; hat.name = 'hat';
    g.add(hat);
    const st = staff(0x66ff99); st.position.set(0.42, 0.15, 0.08); st.rotation.z = -0.12; g.add(st);
    return g;
  },
  shiro(v) {
    if (v === 'formal') {
      const g = chibi({ skin: 0xf4ece6, hair: 0xf2f2f6, hairstyle: 'straight', outfit: 0xf4f0fa, outfitStyle: 'dress', frill: 0xffffff, eyeColor: 0xcfcfe8 });
      add(g, Box(0.3, 0.18, 0.16), mat(0xffffff), 0, 0.92, 0.12);
      add(g, Tor(0.24, 0.035, 6, 16), mat(0xd9b96a, { metal: 0.6 }), 0, 1.4, -0.02, -1.35);
      add(g, Tor(0.2, 0.02, 6, 14), mat(0xd9b96a, { metal: 0.6 }), 0, 1.0, 0, Math.PI / 2); // gold waist
      return g;
    }
    const g = chibi({ skin: 0xf4ece6, hair: 0xf2f2f6, hairstyle: 'straight', outfit: 0x1d1a26, outfitStyle: 'dress', frill: 0xf2f0ea, eyeColor: 0xcfcfe8 });
    // ruffled bodice + headdress ribbons
    add(g, Box(0.3, 0.18, 0.16), mat(0xf2f0ea), 0, 0.92, 0.12);
    add(g, Tor(0.24, 0.035, 6, 16, Math.PI), mat(0xf2f0ea), 0, 1.4, -0.02, -1.35);
    add(g, Box(0.08, 0.2, 0.02), mat(0x15121e), -0.2, 1.52, -0.06, 0, 0, 0.4);
    add(g, Box(0.08, 0.2, 0.02), mat(0x15121e), 0.2, 1.52, -0.06, 0, 0, -0.4);
    const b = grimoire(); b.position.set(-0.4, 0.68, 0.12); b.rotation.y = 0.5; g.add(b);
    return g;
  },
  yuki(v) {
    if (v === 'fem' || v === 'fem_formal') {
      // reclassified: longer hair, a soft gown, ribbon; formal is elegant white/green
      const formal = v === 'fem_formal';
      const g = chibi({ skin: 0xf8e0cc, hair: 0xf2e2a8, hairstyle: 'long', outfit: formal ? 0xeef6ef : 0xbfe6c6, outfitStyle: 'dress', frill: 0xd9b96a, eyeColor: 0x3a7a54 });
      add(g, Tor(0.25, 0.03, 6, 14), mat(0xd9b96a, { metal: 0.5 }), 0, formal ? 0.9 : 0.5, 0, Math.PI / 2);
      add(g, Box(0.14, 0.18, 0.02), mat(0xff9ec6), -0.25, 1.4, 0.04, 0, 0, 0.5); // hair ribbon
      if (!formal) { const w = sword(0xe8eef4, 0.44); w.position.set(0.42, 0.5, 0.05); w.rotation.z = -0.5; g.add(w); }
      return g;
    }
    const g = chibi({ skin: 0xf6ddc0, hair: 0xf2e2a8, hairstyle: 'short', outfit: 0xa8d8b0, sleeve: 0xa8d8b0, legColor: 0x6a7a6a });
    add(g, Box(0.34, 0.08, 0.2), mat(0x8a6d3a), 0, 0.44, 0);
    const w = sword(0xd8dde2, 0.42); w.position.set(0.42, 0.5, 0.05); w.rotation.z = -0.55; g.add(w);
    return g;
  },

  // ---- post-Monarch recruits (Warlock's Codex imports) ----
  mira() {
    // sellsword: battered steel, sun-browned, a sword that has paid for itself
    const g = chibi({ skin: 0xe2b990, hair: 0x6e3a2a, hairstyle: 'short', outfit: 0x8a8f96, outfitStyle: 'armor', sleeve: 0x5a4632, legColor: 0x3a3630, eyeColor: 0x4a3624 });
    add(g, Box(0.36, 0.07, 0.22), mat(0x5a4632), 0, 0.46, 0);                       // heavy belt
    add(g, Box(0.2, 0.06, 0.3), mat(0x9aa2ac, { metal: 0.5, rough: 0.5 }), -0.26, 1.06, 0, 0, 0, 0.28); // pauldron
    add(g, Box(0.12, 0.02, 0.02), mat(0xc86a4a), 0.08, 1.24, 0.3);                  // the scar she won't explain
    const w = sword(0xc8ccd2, 0.72); w.position.set(0.44, 0.5, 0.05); w.rotation.z = -0.42; g.add(w);
    return g;
  },
  nessa() {
    // hedgewitch: warm greens, a satchel of remedies, a flower she didn't notice
    const g = chibi({ skin: 0xf6dcc0, hair: 0x8a5a34, hairstyle: 'curly', outfit: 0x7a9a58, outfitStyle: 'dress', frill: 0xe8e2c8, eyeColor: 0x6a4a2a });
    add(g, Box(0.2, 0.16, 0.1), mat(0x8a6d3a), -0.3, 0.6, 0.14, 0, 0, 0.15);        // satchel
    add(g, S(0.05, 8, 8), mat(0xffd0e0), 0.2, 1.43, 0.14);                           // flower tucked in her hair
    add(g, S(0.04, 8, 8), mat(0xfff4f8), 0.27, 1.4, 0.1);
    return g;
  },
  vex() {
    // the Hollow One: person-shaped dark, violet eyes, edges that don't commit
    const g = chibi({ skin: 0x1a1626, hair: null, outfit: 0x241f38, sleeve: 0x241f38, legColor: 0x16121f, eyeColor: 0xb08cff, eyeGlow: true });
    const wm = mat(0x241f38, { opacity: 0.55 });
    add(g, Cone(0.34, 0.5, 9, 1, true), wm, 0, 0.7, -0.05);                          // trailing shadow-hem
    add(g, S(0.07, 8, 8), wm, -0.42, 1.3, -0.08);                                    // orbiting wisps
    add(g, S(0.05, 8, 8), wm, 0.45, 0.95, -0.1);
    add(g, S(0.045, 8, 8), wm, 0.1, 1.55, -0.12);
    g.userData.float = true;
    return g;
  },
  seris() {
    // College instrument: severe robes, violet trim, notes on your growth rate
    const g = chibi({ skin: 0xeed6c8, hair: 0x3a2a4a, hairstyle: 'straight', outfit: 0x2a2438, outfitStyle: 'robe', frill: 0x8a6ad8, eyeColor: 0xb08cff });
    add(g, Tor(0.2, 0.025, 6, 14), mat(0x8a6ad8, { emissive: 0x8a6ad8, ei: 0.5 }), 0, 1.02, 0, Math.PI / 2.4); // College collar
    const b = grimoire(); b.position.set(-0.4, 0.66, 0.12); b.rotation.y = 0.5; g.add(b);
    const st = staff(0xb06cff); st.scale.setScalar(0.9); st.position.set(0.42, 0.15, 0.08); st.rotation.z = -0.12; g.add(st);
    return g;
  },

};

// ---------------------------------------------------------------
// monster builders
// ---------------------------------------------------------------

function quadruped(o = {}) {
  const g = new THREE.Group();
  const bm = mat(o.color ?? 0x8a8f99, { rough: 0.9 });
  add(g, Cap(0.26, 0.55, 4, 10), bm, 0, 0.48, 0, 0, 0, Math.PI / 2);
  const head = add(g, S(0.24, 12, 10), bm, 0.48, 0.62, 0); head.name = 'head';
  add(g, Box(0.2, 0.14, 0.16), bm, 0.66, 0.55, 0);
  add(g, Cone(0.07, 0.16, 6), bm, 0.42, 0.85, -0.1, -0.2);
  add(g, Cone(0.07, 0.16, 6), bm, 0.42, 0.85, 0.1, 0.2);
  for (const [x, z] of [[-0.28, -0.16], [-0.28, 0.16], [0.28, -0.16], [0.28, 0.16]]) {
    add(g, Cyl(0.06, 0.07, 0.4, 6), bm, x, 0.2, z);
  }
  add(g, Cone(0.06, 0.42, 6), bm, -0.55, 0.62, 0, 0, 0, Math.PI / 1.6);
  eyes(g, o.eye ?? 0xffd24a, 0.68, 0.1, 0.68, 0.035, true);
  g.rotation.y = -Math.PI / 2; // face -X by default flip handled at placement
  const wrap = new THREE.Group(); wrap.add(g);
  return wrap;
}

function golemish(o = {}) {
  const g = new THREE.Group();
  const bm = mat(o.color ?? 0x7a7f86, { rough: 1, flat: true });
  add(g, Box(0.72, 0.7, 0.5), bm, 0, 0.85, 0);
  add(g, Box(0.4, 0.28, 0.36), bm, 0, 1.4, 0);
  add(g, Box(0.24, 0.62, 0.26), bm, -0.55, 0.75, 0, 0, 0, 0.12);
  add(g, Box(0.24, 0.62, 0.26), bm, 0.55, 0.75, 0, 0, 0, -0.12);
  add(g, Box(0.26, 0.5, 0.3), bm, -0.22, 0.25, 0);
  add(g, Box(0.26, 0.5, 0.3), bm, 0.22, 0.25, 0);
  add(g, S(0.11, 10, 10), mat(o.core ?? 0xffa24a, { emissive: o.core ?? 0xffa24a, ei: 2 }), 0, 0.95, 0.27);
  if (o.oneEye) add(g, S(0.07, 8, 8), mat(0xc86cff, { emissive: 0xc86cff, ei: 2.5 }), 0, 1.42, 0.19);
  else eyes(g, o.eye ?? 0xffd24a, 1.42, 0.1, 0.19, 0.04, true);
  return g;
}

function robed(o = {}) {
  const g = new THREE.Group();
  const rm = mat(o.color ?? 0x2a2438, { rough: 0.8, opacity: o.opacity });
  add(g, Cone(0.4, 1.15, 10, 1), rm, 0, 0.62, 0);
  add(g, Cone(0.22, 0.35, 8), rm, 0, 1.32, 0, 0.18);
  add(g, S(0.19, 10, 10), mat(0x0c0a12, { opacity: o.opacity }), 0, 1.22, 0.03);
  eyes(g, o.eye ?? 0xb08cff, 1.24, 0.07, 0.16, 0.035, true);
  add(g, Cap(0.06, 0.3, 4, 6), rm, -0.32, 0.85, 0.1, 0, 0, 0.7);
  add(g, Cap(0.06, 0.3, 4, 6), rm, 0.32, 0.85, 0.1, 0, 0, -0.7);
  if (o.float) g.userData.float = true;
  return g;
}

function wings(g, color = 0x55505c, y = 1.0, span = 0.55) {
  const wm = mat(color, { rough: 0.9, flat: true });
  const mk = (sx) => {
    const w = new THREE.Group();
    add(w, Box(span, 0.32, 0.03), wm, sx * span * 0.55, 0, 0, 0, 0, sx * 0.45);
    add(w, Box(span * 0.6, 0.2, 0.03), wm, sx * span * 0.95, -0.15, 0, 0, 0, sx * 0.75);
    w.position.set(sx * 0.2, y, -0.22);
    return w;
  };
  g.add(mk(-1)); g.add(mk(1));
}
function horns(g, color = 0xe8dcc8, y = 1.42, spread = 0.15, len = 0.26) {
  const hm = mat(color, { rough: 0.6 });
  add(g, Cone(0.06, len, 6), hm, -spread, y, 0, 0, 0, 0.5);
  add(g, Cone(0.06, len, 6), hm, spread, y, 0, 0, 0, -0.5);
}
function crown(g, color = 0xd9b96a, y = 1.55, r = 0.2) {
  const cm = mat(color, { metal: 0.7, rough: 0.3 });
  add(g, Cyl(r, r * 1.05, 0.1, 10, 1, true), cm, 0, y, 0);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    add(g, Cone(0.04, 0.12, 4), cm, Math.cos(a) * r, y + 0.1, Math.sin(a) * r);
  }
}

const MONSTER_BUILDERS = {
  coven(v) {
    // Ashen Coven: ash-grey robes, burning-hand brand at the throat
    const look = {
      acolyte: { robe: 0x5a5458, trim: 0xe8823a }, zealot: { robe: 0x4a3a34, trim: 0xd84a2a }, witch: { robe: 0x3a3440, trim: 0xff9a4a },
      trapper: { robe: 0x4a4434, trim: 0xc87a3a }, knight: { robe: 0x2a2220, trim: 0xff6a2a }, envoy: { robe: 0x7a7470, trim: 0xe8a87a },
      matron: { robe: 0x3a1a14, trim: 0xff7a2a }, mother: { robe: 0x1a0c0a, trim: 0xff5a2a }, reclaimed: { robe: 0x2a2234, trim: 0xb06cff },
      binder: { robe: 0x2a2a2e, trim: 0xd8d0c0 }, dragon: { robe: 0x5a1a14, trim: 0xffb02a }, frost: { robe: 0x8aa8c8, trim: 0xd8f0ff },
    }[v] || { robe: 0x5a5458, trim: 0xe8823a };
    const armored = v === 'knight' || v === 'zealot' || v === 'dragon';
    const g = chibi({ skin: 0xe8ccb4, hair: v === 'mother' ? 0xd8d0c8 : 0x3a2a24, hairstyle: v === 'envoy' || v === 'witch' || v === 'mother' || v === 'reclaimed' ? 'long' : 'short',
      outfit: look.robe, outfitStyle: armored ? 'armor' : 'robe', frill: look.trim, eyeColor: v === 'reclaimed' ? 0x5a4a7a : 0xd86a2a, eyeGlow: v !== 'reclaimed' });
    if (!armored) add(g, Cone(0.22, 0.32, 8), mat(look.robe), 0, 1.38, -0.06, 0.2);                       // hood
    if (v !== 'reclaimed') add(g, S(0.035, 6, 6), mat(look.trim, { emissive: look.trim, ei: 2 }), 0.12, 1.0, 0.2); // brand
    if (v === 'matron' || v === 'mother') crown(g, look.trim, 1.55, 0.2);
    if (v === 'dragon') horns(g, 0xffb02a, 1.46, 0.14, 0.2);
    if (v === 'knight' || v === 'zealot' || v === 'dragon') { const w = sword(0x8a7a6a, 0.6); w.position.set(0.42, 0.5, 0.05); w.rotation.z = -0.45; g.add(w); }
    else { const st = staff(look.trim); st.position.set(0.42, 0.15, 0.08); st.rotation.z = -0.12; g.add(st); }
    if (v === 'matron' || v === 'mother') g.scale.setScalar(1.12);
    return g;
  },
  vigil(v) {
    // Order of the Last Vigil: pale steel, white tabard, warlock-slayer blades
    const g = chibi({ skin: 0xe4ccb8, hair: 0x6a5a4a, hairstyle: 'short', outfit: v === 'fallen' ? 0x4a4a54 : 0xb8bcc8, outfitStyle: 'armor', sleeve: 0x8a8e98, legColor: 0x5a5e68, eyeColor: 0x3a3a44 });
    add(g, Box(0.3, 0.42, 0.04), mat(v === 'fallen' ? 0x2a2a34 : 0xe8e4d8), 0, 0.6, 0.22);                // tabard
    add(g, Box(0.06, 0.2, 0.05), mat(0xc8a050, { metal: 0.6 }), 0, 0.66, 0.245);                          // sigil cross
    add(g, S(0.33, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat(0x9a9ea8, { metal: 0.7, rough: 0.35 }), 0, 1.24, 0); // helm
    if (v === 'cantor' || v === 'inquisitor') { const b = grimoire(); b.position.set(-0.4, 0.66, 0.12); g.add(b); }
    else { const w = sword(0xd8dce4, v === 'marshal' ? 0.8 : 0.62); w.position.set(0.42, 0.5, 0.05); w.rotation.z = -0.4; g.add(w); }
    if (v === 'rider' || v === 'marshal') { const sh = shield(0xc8ccd8); sh.position.set(-0.42, 0.68, 0.08); g.add(sh); }
    if (v === 'marshal' || v === 'commander') g.scale.setScalar(1.15);
    if (v === 'commander') { crown(g, 0xc8a050, 1.55, 0.2); add(g, Box(0.62, 0.9, 0.04), mat(0xe8e4d8), 0, 0.68, -0.3, 0.08); }
    if (v === 'inquisitor') add(g, S(0.06, 8, 8), mat(0xff4a4a, { emissive: 0xff2a2a, ei: 1.4 }), 0, 1.0, 0.3);
    return g;
  },
  college(v) {
    // Obsidian College: black robes, gold piping, severe collars
    const insq = v === 'inquisitor';
    const g = chibi({ skin: 0xecd8c8, hair: insq ? 0x2a2a2a : 0x6a4a3a, hairstyle: insq ? 'short' : 'straight', outfit: 0x14121a, outfitStyle: insq ? 'armor' : 'robe', frill: 0xd8b04a, sleeve: 0x14121a, eyeColor: 0xd8b04a });
    add(g, Tor(0.2, 0.025, 6, 14), mat(0xd8b04a, { metal: 0.7 }), 0, 1.02, 0, Math.PI / 2.4);
    if (insq) { const w = sword(0x2a2a30, 0.6); w.position.set(0.42, 0.5, 0.05); w.rotation.z = -0.45; g.add(w); add(g, Box(0.5, 0.06, 0.02), mat(0xd8b04a), 0, 1.35, 0.3); }
    else { const b = grimoire(); b.position.set(-0.4, 0.66, 0.12); g.add(b); }
    return g;
  },
  hunter(v) {
    // Hunters' Lodge: leathers, green cloaks, trophies
    const master = v === 'master';
    const g = chibi({ skin: 0xd8b494, hair: master ? 0x9a9a9a : 0x6a4a2a, hairstyle: v === 'archer' ? 'long' : 'short', outfit: 0x5a4a32, sleeve: 0x4a3a28, legColor: 0x3a3020, eyeColor: 0x3a3020 });
    add(g, Cone(0.38, 0.55, 9, 1, true), mat(master ? 0x2a3a1a : 0x3a5a2a), 0, 0.85, -0.06);
    if (v === 'archer') { add(g, Tor(0.3, 0.02, 6, 16, Math.PI), mat(0x6a4a2a), 0.42, 0.7, 0.05, 0, 0, Math.PI / 2); }
    else if (v === 'trapper') { add(g, Tor(0.12, 0.03, 6, 12), mat(0x8a8a8a, { metal: 0.7 }), -0.4, 0.6, 0.1, Math.PI / 2); const w = sword(0xb8bcc4, 0.4); w.position.set(0.42, 0.5, 0.05); w.rotation.z = -0.5; g.add(w); }
    else { const w = sword(0xb8bcc4, master ? 0.7 : 0.55); w.position.set(0.42, 0.5, 0.05); w.rotation.z = -0.45; g.add(w); }
    if (master) { horns(g, 0xe8dcc8, 1.5, 0.2, 0.3); g.scale.setScalar(1.12); } // antler crown
    return g;
  },
  moth(v) {
    const g = new THREE.Group();
    const bm = mat(v === 'shrike' ? 0x3a2a2a : 0x6a6070, { rough: 1, flat: true });
    if (v === 'shrike') add(g, Cone(0.05, 0.22, 4), mat(0xd8c84a), 0, 1.0, 0.24, Math.PI / 2); // hooked beak
    add(g, Cap(0.12, 0.4, 4, 8), bm, 0, 0.9, 0);
    for (const sx of [-1, 1]) {
      const w = add(g, Box(0.6, 0.45, 0.02), mat(0x8a8090, { rough: 1, opacity: 0.9 }), sx * 0.36, 1.0, -0.05, 0, 0, sx * 0.3);
      add(g, S(0.07, 8, 8), mat(0xe8d8a8, { emissive: 0xd8b04a, ei: 0.6 }), sx * 0.4, 1.05, -0.02);
      void w;
    }
    eyes(g, 0xff8ab0, 1.1, 0.06, 0.1, 0.03, true);
    g.userData.float = true;
    return g;
  },
  harpy() {
    const g = chibi({ skin: 0xc8a888, hair: 0x2a2a2a, hairstyle: 'long', outfit: 0x4a3a3a, legColor: 0x6a5a3a, eyeColor: 0xff6a3a, eyeGlow: true, lowerBody: 'hooves' });
    wings(g, 0x3a2a2a, 0.95, 0.65);
    g.userData.float = true;
    return g;
  },
  spider() {
    const g = new THREE.Group();
    const bm = mat(0x2a2430, { rough: 0.8, flat: true });
    add(g, S(0.34, 10, 8), bm, 0, 0.42, -0.2).scale.set(1, 0.8, 1.2);
    add(g, S(0.2, 10, 8), bm, 0, 0.42, 0.22);
    for (let i = 0; i < 4; i++) for (const sx of [-1, 1]) {
      add(g, Cyl(0.025, 0.02, 0.7, 4), bm, sx * 0.38, 0.32, 0.18 - i * 0.16, 0, 0, sx * 1.0);
    }
    eyes(g, 0xc86cff, 0.5, 0.06, 0.4, 0.03, true);
    eyes(g, 0xc86cff, 0.56, 0.11, 0.38, 0.022, true);
    return g;
  },
  drake(v) {
    const g = new THREE.Group();
    const col = { frost: 0x9ab8d8, basilisk: 0x5a6a3a, great: 0x2a4a34 }[v] ?? 0x3a5a44;
    const bm = mat(col, { rough: 0.6, flat: true });
    if (v === 'frost') wings(g, 0xc8d8e8, 0.85, 0.55);
    if (v === 'basilisk') for (let i = 0; i < 4; i++) add(g, Cyl(0.03, 0.03, 0.18, 4), bm, 0.1 * i - 0.15, 0.3, 0.2 + (i % 2) * -0.4); // extra legs
    add(g, Cap(0.24, 0.6, 4, 10), bm, 0, 0.42, 0, 0, 0, Math.PI / 2);
    add(g, Cap(0.12, 0.3, 4, 8), bm, 0.5, 0.7, 0, 0, 0, -0.9);
    add(g, Box(0.26, 0.14, 0.18), bm, 0.72, 0.86, 0);
    add(g, Cone(0.1, 0.6, 6), bm, -0.62, 0.36, 0, 0, 0, Math.PI / 2);
    for (const [x, z] of [[0.25, 0.14], [0.25, -0.14], [-0.25, 0.14], [-0.25, -0.14]]) add(g, Cyl(0.05, 0.06, 0.3, 6), bm, x, 0.14, z);
    for (let i = 0; i < 5; i++) add(g, Cone(0.04, 0.12, 4), mat(0x6a8a54), -0.3 + i * 0.15, 0.68, 0);
    eyes(g, v === 'basilisk' ? 0xff4a4a : v === 'frost' ? 0x8ad8ff : 0xe8d84a, 0.92, 0.07, 0.8, 0.03, true);
    if (v === 'great') g.scale.setScalar(1.45);
    return g;
  },
  stag(v) {
    const g = new THREE.Group();
    const bm = mat(v === 'pale' ? 0xf8f8f0 : v === 'great' ? 0xe8d8e8 : 0xa8a49a, { rough: 0.85 });
    add(g, Cap(0.2, 0.55, 4, 10), bm, 0, 0.6, 0, 0, 0, Math.PI / 2);
    add(g, Cap(0.08, 0.3, 4, 8), bm, 0.4, 0.88, 0, 0, 0, -0.5);
    add(g, Box(0.22, 0.14, 0.14), bm, 0.56, 1.06, 0);
    for (const [x, z] of [[0.24, 0.1], [0.24, -0.1], [-0.24, 0.1], [-0.24, -0.1]]) add(g, Cyl(0.035, 0.03, 0.5, 6), bm, x, 0.25, z);
    const am = mat(0x8ad8a8, { emissive: 0x4a9a6a, ei: 0.8 });
    for (const sz of [-1, 1]) {
      add(g, Cyl(0.015, 0.02, 0.4, 4), am, 0.5, 1.32, sz * 0.1, sz * 0.4, 0, 0.2);
      add(g, Cyl(0.012, 0.015, 0.2, 4), am, 0.46, 1.42, sz * 0.2, sz * 0.9, 0, -0.4);
    }
    eyes(g, 0x2a2a2a, 1.08, 0.06, 0.64, 0.025);
    if (v === 'great') g.scale.setScalar(1.3);
    if (v === 'pale') { g.scale.setScalar(1.55); g.traverse(m => { if (m.material) { m.material = m.material.clone(); m.material.emissive = new THREE.Color(0x8a8a7a); m.material.emissiveIntensity = 0.4; } }); }
    return g;
  },
  goblin(v) {
    const tint = v === 'shaman' ? 0x6a9a5a : v === 'chief' ? 0x5a8a4a : 0x74a85c;
    const g = chibi({ skin: tint, hair: null, outfit: v === 'shaman' ? 0x5a4a6a : 0x6a5a42, legColor: 0x4a4032, eyeColor: 0xffd24a, eyeGlow: true });
    const em = mat(tint);
    add(g, Cone(0.07, 0.3, 6), em, -0.36, 1.28, 0, 0, 0, Math.PI / 2.4);
    add(g, Cone(0.07, 0.3, 6), em, 0.36, 1.28, 0, 0, 0, -Math.PI / 2.4);
    add(g, Cone(0.09, 0.2, 6), em, 0, 1.2, 0.3, Math.PI / 2.2); // nose
    if (v === 'shaman') { const st = staff(0xb06cff); st.scale.setScalar(0.85); st.position.set(0.4, 0.2, 0.05); g.add(st); }
    else if (v === 'chief') { crown(g, 0xc9a24a, 1.52, 0.18); const w = sword(0x9aa2ac, 0.5); w.position.set(0.42, 0.5, 0.05); w.rotation.z = -0.5; g.add(w); g.scale.setScalar(1.18); }
    else { const club = new THREE.Group(); add(club, Cyl(0.05, 0.09, 0.5, 7), mat(0x6a4f30), 0, 0.25, 0); club.position.set(0.4, 0.45, 0.05); club.rotation.z = -0.5; g.add(club); }
    return g;
  },
  wolf(v) {
    const colors = { frost: 0x9ec8dc, hell: 0x5a2a2a, dire: 0x3a3f4a, abyss: 0x46285a, vigil: 0xc8c0b0, hunt: 0x6a4a2a, chimera: 0x8a5a2a };
    const w = quadruped({ color: colors[v] ?? 0x8a8f99, eye: v === 'hell' || v === 'chimera' ? 0xff6a3a : v === 'abyss' ? 0xc86cff : 0xffd24a });
    if (v === 'vigil') add(w, Tor(0.2, 0.04, 6, 12), mat(0xc8a050, { metal: 0.7 }), 0, 0.72, 0.42, 0, Math.PI / 2, 0); // Vigil collar
    if (v === 'chimera') { // goat horns, a serpent tail, a mane of embers
      horns(w, 0x3a2a1a, 0.95, 0.12, 0.22);
      add(w, Cone(0.05, 0.5, 6), mat(0x3a6a3a), 0, 0.7, -0.62, -0.9);
      for (let i = 0; i < 6; i++) add(w, Cone(0.05, 0.16, 4), mat(0xff7a2a, { emissive: 0xff5a1a, ei: 0.8 }), Math.cos(i) * 0.18, 0.84, 0.32 + Math.sin(i) * 0.05);
      w.scale.setScalar(1.25);
    }
    if (v === 'dire') w.scale.setScalar(1.3);
    if (v === 'frost') w.scale.setScalar(1.1);
    if (v === 'abyss') w.scale.setScalar(1.16);
    return w;
  },
  boar() {
    const b = quadruped({ color: 0x7a5c46, eye: 0xffe08a });
    const tm = mat(0xf2e8d8);
    add(b.children[0], Cone(0.05, 0.2, 6), tm, 0.6, 0.5, -0.14, 0, 0, -1.2);
    add(b.children[0], Cone(0.05, 0.2, 6), tm, 0.6, 0.5, 0.14, 0, 0, -1.2);
    b.scale.setScalar(1.05);
    return b;
  },
  sprite(v) {
    const ice = v === 'ice', arc = v === 'arcane';
    const g = new THREE.Group();
    add(g, S(0.22, 12, 12), mat(arc ? 0xf0d890 : ice ? 0x9ed8ff : 0xaef2c8, { emissive: arc ? 0xd8b04a : ice ? 0x6ab8ff : 0x7ae8a8, ei: 1.5 }), 0, 1.0, 0);
    const wingC = ice ? 0xd8f0ff : 0xd8ffe8;
    add(g, Box(0.4, 0.22, 0.02), mat(wingC, { opacity: 0.55 }), -0.28, 1.1, -0.05, 0, 0, 0.5);
    add(g, Box(0.4, 0.22, 0.02), mat(wingC, { opacity: 0.55 }), 0.28, 1.1, -0.05, 0, 0, -0.5);
    eyes(g, ice ? 0x1c3a5a : 0x1c3a2a, 1.02, 0.07, 0.19, 0.03);
    g.userData.float = true;
    return g;
  },
  vine(v) {
    const g = new THREE.Group();
    const vm = mat(v === 'elder' ? 0x4a6a3a : 0x5a8a46, { rough: 1, flat: true });
    add(g, Cone(0.5, 1.2, 8), vm, 0, 0.62, 0);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      add(g, Cap(0.06, 0.5, 4, 6), vm, Math.cos(a) * 0.4, 0.35, Math.sin(a) * 0.4, 0.6, 0, a);
    }
    eyes(g, 0xffe08a, 0.95, 0.12, 0.42, 0.045, true);
    if (v === 'elder') { g.scale.setScalar(1.35); add(g, Box(0.5, 0.1, 0.5), mat(0x3a5a2e), 0, 1.3, 0, 0, 0.5); }
    return g;
  },
  skeleton(v) {
    const bone = v === 'revenant' ? 0x9a8f86 : 0xe8e4d8;
    const g = chibi({ skin: bone, hair: null, outfit: v === 'revenant' ? 0x3a2a2e : 0xd8d4c8, legColor: v === 'revenant' ? 0x2e2226 : 0xd8d4c8, eyeColor: v === 'tyrant' ? 0xb06cff : v === 'revenant' ? 0xff5a4a : 0xc86cff, eyeGlow: true });
    add(g, Box(0.3, 0.05, 0.22), mat(0x9a948a), 0, 0.72, 0.16);
    add(g, Box(0.3, 0.05, 0.22), mat(0x9a948a), 0, 0.6, 0.16);
    if (v === 'tyrant') { crown(g, 0x8a84c8, 1.52, 0.18); const cape = add(g, Box(0.55, 0.8, 0.04), mat(0x2a2438), 0, 0.7, -0.28, 0.1); cape.name = 'cape'; g.scale.setScalar(1.22); }
    if (v === 'revenant') { const cape = add(g, Box(0.5, 0.72, 0.04), mat(0x24161a), 0, 0.7, -0.26, 0.08); cape.name = 'cape'; g.scale.setScalar(1.08); }
    const w = sword(0xb8b4a8, 0.48); w.position.set(0.42, 0.5, 0.05); w.rotation.z = -0.5; g.add(w);
    return g;
  },
  ghoul() {
    const g = chibi({ skin: 0x8a9a80, hair: null, outfit: 0x5a5548, legColor: 0x4a4538, eyeColor: 0xd8ff6a, eyeGlow: true });
    g.children.forEach(c => { if (c.name === 'armL') { c.scale.y = 1.5; c.position.y = 0.62; } if (c.name === 'armR') { c.scale.y = 1.5; c.position.y = 0.62; } });
    g.rotation.x = 0.15;
    return g;
  },
  wraith(v) {
    if (v === 'queen') { const g = robed({ color: 0x3a2a48, opacity: 0.85, eye: 0xff8ac8, float: true }); crown(g, 0x8a6ad8, 1.5, 0.16); g.scale.setScalar(1.16); return g; }
    if (v === 'banshee') return robed({ color: 0x2a3848, opacity: 0.72, eye: 0x8adfff, float: true });
    return robed({ color: 0x2a2438, opacity: 0.8, eye: 0xb08cff, float: true });
  },
  cultist(v) {
    if (v === 'acolyte') return robed({ color: 0x2a2440, eye: 0xb06cff });
    return robed({ color: 0x3a2430, eye: 0xff6a8a });
  },
  golem(v) {
    const g = golemish({ color: v === 'obsidian' ? 0x1a1820 : v === 'colossus' ? 0x6a6f78 : v === 'war' ? 0x5a4a4a : 0x7a7f86, core: v === 'obsidian' ? 0xd8b04a : v === 'colossus' ? 0xff6a3a : v === 'war' ? 0xff3a3a : 0xffa24a });
    if (v === 'colossus') g.scale.setScalar(1.4);
    if (v === 'war') g.scale.setScalar(1.12);
    return g;
  },
  sentinel(v) { const g = golemish({ color: v === 'archon' ? 0x6a6478 : 0x8a8478, core: v === 'archon' ? 0xc86cff : 0xc86cff, oneEye: true }); g.scale.set(v === 'archon' ? 1.0 : 0.85, v === 'archon' ? 1.3 : 1.1, v === 'archon' ? 1.0 : 0.85); return g; },
  gargoyle() {
    const g = chibi({ skin: 0x8a8f99, hair: null, outfit: 0x7a7f89, legColor: 0x6a6f79, eyeColor: 0xff8a4a, eyeGlow: true });
    wings(g, 0x6a6f79, 1.0, 0.5);
    horns(g, 0x9a9fa9, 1.44, 0.13, 0.2);
    return g;
  },
  elemental(v) {
    const g = new THREE.Group();
    const im = mat(0x9ed8f2, { opacity: 0.82, rough: 0.2, flat: true });
    add(g, Ico(0.45, 0), im, 0, 0.95, 0);
    add(g, Ico(0.16, 0), im, -0.45, 1.25, 0.1);
    add(g, Ico(0.12, 0), im, 0.48, 0.75, -0.1);
    add(g, Ico(0.1, 0), im, 0.3, 1.4, 0);
    eyes(g, 0xc86cff, 1.0, 0.12, 0.4, 0.045, true);
    g.userData.float = true;
    if (v === 'matriarch') { g.scale.setScalar(1.35); crown(g, 0xd8f2ff, 1.5, 0.2); }
    if (v === 'sovereign') { g.scale.setScalar(1.4); crown(g, 0xc8a8ff, 1.5, 0.2); }
    return g;
  },
  yeti(v) {
    if (v === 'troll') {
      const t = chibi({ skin: 0x5a6a3a, hair: 0x3a4a2a, hairstyle: 'curly', outfit: 0x4a3a2a, legColor: 0x4a5a2a, eyeColor: 0xd8c84a, eyeGlow: true, build: 'broad' });
      add(t, Cone(0.05, 0.14, 5), mat(0xe8dcc8), -0.08, 1.04, 0.28, 2.6); add(t, Cone(0.05, 0.14, 5), mat(0xe8dcc8), 0.08, 1.04, 0.28, 2.6); // tusks
      t.scale.setScalar(1.45);
      return t;
    }
    const giant = v === 'giant';
    const g = chibi({ skin: giant ? 0xc6d6ea : 0xe8ecf2, hair: 0xdde4ec, hairstyle: 'short', outfit: 0xdde4ec, legColor: 0xc8d0da, eyeColor: giant ? 0x4a6acc : 0x2a3a5a });
    g.scale.setScalar(giant ? 1.6 : 1.35);
    horns(g, 0x9aa4b0, 1.4, 0.16, 0.18);
    return g;
  },
  imp(v) {
    if (v === 'gremlin') {
      const gr = chibi({ skin: 0x6a8a4a, hair: null, outfit: 0x4a3a2a, legColor: 0x3a2a1a, eyeColor: 0xffd24a, eyeGlow: true });
      add(gr, Cone(0.08, 0.3, 4), mat(0x6a8a4a), -0.34, 1.3, 0, 0, 0, 1.2); add(gr, Cone(0.08, 0.3, 4), mat(0x6a8a4a), 0.34, 1.3, 0, 0, 0, -1.2); // big ears
      add(gr, Cyl(0.08, 0.08, 0.02, 10), mat(0xd8b04a, { metal: 0.8 }), 0.38, 0.6, 0.1, Math.PI / 2); // a stolen coin
      gr.scale.setScalar(0.72);
      return gr;
    }
    const g = chibi({ skin: 0xc85a4a, hair: null, outfit: 0x8a3a32, legColor: 0x6a2a24, eyeColor: 0xffd24a, eyeGlow: true });
    horns(g, 0xf2d8b8, 1.44, 0.14, 0.22);
    add(g, Cone(0.05, 0.4, 6), mat(0xc85a4a), 0, 0.3, -0.3, Math.PI / 1.5);
    g.scale.setScalar(0.85);
    return g;
  },
  demon(v) {
    if (v === 'velvet' || v === 'contract' || v === 'proprietor') {
      const look = { velvet: [0xd88a9a, 0x5a1a3a, 0xff8ab0], contract: [0xa8443a, 0x2a1a1a, 0xffd24a], proprietor: [0x8a3a5a, 0x1a0a14, 0xd8b04a] }[v];
      const d = chibi({ skin: look[0], hair: v === 'velvet' ? 0x2a0a1a : 0x1a0a0a, hairstyle: v === 'velvet' ? 'long' : 'short', outfit: look[1], outfitStyle: v === 'velvet' ? 'dress' : 'robe', frill: look[2], eyeColor: look[2], eyeGlow: true });
      horns(d, 0x1a0a0a, 1.46, 0.15, v === 'proprietor' ? 0.34 : 0.22);
      if (v === 'contract') { const b = grimoire(); b.position.set(-0.4, 0.66, 0.12); d.add(b); }
      if (v === 'proprietor') { crown(d, 0xd8b04a, 1.55, 0.18); add(d, Tor(0.06, 0.02, 6, 10), mat(0xd8b04a, { metal: 0.9 }), 0.12, 1.22, 0.29); d.scale.setScalar(1.25); }
      if (v === 'velvet') wings(d, 0x3a0a1a, 0.95, 0.45);
      return d;
    }
    const gen = v === 'general';
    const g = chibi({ skin: gen ? 0x8a3a4a : 0xa8443a, hair: null, outfit: gen ? 0x3a1a2a : 0x5a1f1a, outfitStyle: 'armor', legColor: 0x3a1512, eyeColor: gen ? 0xff7a4a : 0xffb24a, eyeGlow: true });
    horns(g, 0xf2d8b8, 1.46, 0.16, 0.3);
    wings(g, gen ? 0x2a0f1a : 0x4a1a16, 0.95, 0.6);
    const w = sword(gen ? 0xaa2a2a : 0x8a2a22, 0.62); w.position.set(0.42, 0.5, 0.05); w.rotation.z = -0.5; g.add(w);
    g.scale.setScalar(gen ? 1.4 : 1.25);
    return g;
  },
  herald(v) {
    if (v === 'archon') {
      const a = chibi({ skin: 0xe8d8c8, hair: 0xe8e8e8, hairstyle: 'short', outfit: 0x14121a, outfitStyle: 'robe', frill: 0xd8b04a, eyeColor: 0xd8b04a, eyeGlow: true });
      crown(a, 0xd8b04a, 1.55, 0.19);
      add(a, Box(0.6, 0.9, 0.04), mat(0x0c0a10), 0, 0.68, -0.3, 0.08);
      const st = staff(0xd8b04a); st.position.set(0.42, 0.15, 0.08); st.rotation.z = -0.12; a.add(st);
      a.scale.setScalar(1.35);
      return a;
    }
    const acc = v === 'seraph' ? 0x8ad8ff : 0xb06cff;
    const g = chibi({ skin: 0x1a1622, hair: null, outfit: v === 'seraph' ? 0x1b2838 : 0x211b30, outfitStyle: 'armor', legColor: 0x18131f, eyeColor: acc, eyeGlow: true });
    crown(g, v === 'seraph' ? 0x3a5a6a : 0x4a3a6a, 1.55, 0.2);
    add(g, Box(0.6, 0.9, 0.04), mat(0x160f22), 0, 0.68, -0.3, 0.08);
    add(g, Tor(0.26, 0.02, 6, 18), mat(acc, { emissive: acc, ei: 1.4 }), 0, 0.95, 0, Math.PI / 2.3);
    const w = sword(0x3a2a55, 0.7); w.position.set(0.44, 0.5, 0.05); w.rotation.z = -0.45; g.add(w);
    add(w, Box(0.07, 0.72, 0.005), mat(acc, { emissive: acc, ei: 1.2, opacity: 0.5 }), 0, 0.45, 0);
    if (v === 'seraph') wings(g, 0x2a3a4a, 1.05, 0.6);
    g.scale.setScalar(1.4);
    return g;
  },
};

// ---------------------------------------------------------------
// custom actors — the Character Forge builds these from parsed
// description specs: chibi base plus non-human features.
// ---------------------------------------------------------------

const CUSTOM_SPECS = {};
export function registerCustomActor(id, spec) { CUSTOM_SPECS[id] = spec; }

function customChibi(spec) {
  const g = chibi({
    skin: spec.skin, hair: spec.hair, hairstyle: spec.hairstyle,
    outfit: spec.outfit, outfitStyle: spec.outfitStyle, frill: spec.frill,
    sleeve: spec.sleeve ?? spec.outfit, legColor: spec.legColor,
    eyeColor: spec.eyeColor, eyeGlow: spec.eyeGlow, elf: spec.elf,
    lowerBody: spec.lowerBody, tailColor: spec.tailColor ?? spec.skin,
    build: spec.build, chest: spec.chest, markings: spec.markings,
  });

  // ears
  if (spec.ears === 'rabbit') {
    const em = mat(spec.hair ?? spec.skin, { rough: 0.75 });
    const inner = mat(0xf2c8d0);
    for (const sx of [-1, 1]) {
      add(g, Cap(0.055, 0.4, 4, 8), em, sx * 0.13, 1.62, -0.02, 0, 0, sx * 0.14);
      add(g, Cap(0.025, 0.26, 4, 6), inner, sx * 0.13, 1.6, 0.02, 0, 0, sx * 0.14);
    }
  } else if (spec.ears === 'cat' || spec.ears === 'wolf') {
    const size = spec.ears === 'wolf' ? 0.15 : 0.11;
    const em = mat(spec.hair ?? spec.skin, { rough: 0.8 });
    add(g, Cone(size, size * 1.7, 4), em, -0.17, 1.5, 0, 0, 0, -0.25);
    add(g, Cone(size, size * 1.7, 4), em, 0.17, 1.5, 0, 0, 0, 0.25);
  } else if (spec.ears === 'round') {
    // big-cat ears: small, rounded, dark-backed, sitting high on the head
    const em = mat(spec.hair ?? spec.skin, { rough: 0.8 });
    const back = mat(spec.spots ?? 0x2a1a10, { rough: 0.9 });
    for (const sx of [-1, 1]) {
      add(g, S(0.075, 10, 8), em, sx * 0.2, 1.54, -0.02).scale.set(1, 1.05, 0.45);
      add(g, S(0.05, 8, 6), back, sx * 0.2, 1.55, -0.05).scale.set(1, 1, 0.4);
    }
  } else if (spec.ears === 'fox') {
    const em = mat(spec.hair ?? 0xd87c3a, { rough: 0.8 });
    const inner = mat(0xf4efe6);
    for (const sx of [-1, 1]) {
      add(g, Cone(0.14, 0.28, 4), em, sx * 0.18, 1.52, 0, 0, 0, sx * 0.3);
      add(g, Cone(0.07, 0.16, 4), inner, sx * 0.18, 1.5, 0.03, 0, 0, sx * 0.3);
    }
  }

  // horns ride above the hairline so they read in every shot
  if (spec.horns) {
    const len = spec.hornSize === 'large' ? 0.42 : spec.hornSize === 'small' ? 0.22 : 0.32;
    if (spec.hornStyle === 'swept') {
      const hm = mat(spec.hornColor ?? 0xe8dcc8, { rough: 0.5 });
      for (const sx of [-1, 1]) { add(g, Cone(0.06, len, 6), hm, sx * 0.17, 1.52, -0.08, -0.9, 0, sx * 0.35); add(g, Cone(0.035, len * 0.55, 5), hm, sx * 0.2, 1.62, -0.26, -1.6, 0, sx * 0.25); }
    } else horns(g, spec.hornColor ?? 0xe8dcc8, 1.5, 0.17, len);
  }
  if (spec.wings) wings(g, spec.wingColor ?? 0xe8e4da, 1.0, spec.wingSize ?? 0.5);
  // harpy wing-arms: feathered vanes along both arms, plus talons
  if (spec.armWings) {
    const fm = mat(spec.wingColor ?? 0xb8885a, { rough: 0.9, flat: true });
    const tip = mat(spec.wingTip ?? 0x5a3a2a, { rough: 0.9, flat: true });
    for (const sx of [-1, 1]) {
      for (let i = 0; i < 4; i++) add(g, Box(0.05, 0.34 - i * 0.04, 0.02), i === 3 ? tip : fm, sx * (0.36 + i * 0.07), 0.66 - i * 0.03, -0.04, 0, 0, sx * (0.5 + i * 0.12));
      add(g, Box(0.38, 0.06, 0.02), fm, sx * 0.48, 0.86, -0.05, 0, 0, sx * -0.25);
    }
  }
  if (spec.talons) {
    const tm = mat(0x2a2218, { rough: 0.4 });
    for (const sx of [-1, 1]) for (let i = -1; i <= 1; i++) add(g, Cone(0.02, 0.1, 4), tm, sx * 0.11 + i * 0.035, 0.03, 0.08, Math.PI / 2.4, 0, 0);
  }
  // fins (ear-fins for aquatic/changeling looks)
  if (spec.earFins) {
    const fm = mat(spec.finColor ?? spec.tailColor ?? 0x4aa0c0, { rough: 0.4, flat: true, opacity: 0.9 });
    for (const sx of [-1, 1]) add(g, Cone(0.12, 0.26, 3), fm, sx * 0.33, 1.26, -0.02, 0, 0, sx * 1.25);
  }
  // shapeshifter: one arm mid-change — scaled, clawed
  if (spec.changeArm) {
    const cm = mat(spec.tailColor ?? 0x2a6a5a, { rough: 0.5, flat: true });
    add(g, Cap(0.08, 0.3, 4, 8), cm, 0.31, 0.75, 0, 0, 0, -0.35);
    for (let i = -1; i <= 1; i++) add(g, Cone(0.02, 0.12, 4), mat(0xe8e4da), 0.41 + i * 0.03, 0.5, 0.06, 0.3, 0, 0);
  }
  // signature props for city folk
  if (spec.apron) add(g, Box(0.3, 0.4, 0.02), mat(spec.apron), 0, 0.5, 0.24, 0.1);
  if (spec.mug) { add(g, Cyl(0.06, 0.06, 0.12, 10), mat(0xd8b04a, { metal: 0.4 }), 0.42, 0.62, 0.08); add(g, S(0.05, 8, 8), mat(0xf4efe6), 0.42, 0.69, 0.08); }
  if (spec.bottle) { add(g, Cyl(0.04, 0.05, 0.18, 8), mat(0x3a6a3a, { opacity: 0.85 }), 0.42, 0.64, 0.08); add(g, Cyl(0.015, 0.015, 0.06, 6), mat(0x6a4a2a), 0.42, 0.76, 0.08); }
  if (spec.fan) { const fm = mat(spec.fanColor ?? 0xd8b04a); for (let i = 0; i < 5; i++) add(g, Box(0.03, 0.2, 0.01), fm, 0.42 + (i - 2) * 0.025, 0.7, 0.1, 0, 0, (i - 2) * 0.25); }
  if (spec.veil) add(g, Cone(0.36, 0.7, 12, 1, true), mat(spec.veil, { opacity: 0.45 }), 0, 1.15, -0.04);
  if (spec.wimple) { add(g, S(0.34, 14, 12, 0, Math.PI * 2, 0, Math.PI / 1.7), mat(spec.wimple), 0, 1.22, -0.03); add(g, Tor(0.22, 0.05, 6, 16), mat(spec.wimple), 0, 1.0, 0.02, Math.PI / 2.3); }
  if (spec.helm) { add(g, S(0.33, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2.2), mat(spec.helm, { metal: 0.6, rough: 0.35 }), 0, 1.26, 0); add(g, Box(0.05, 0.12, 0.05), mat(spec.helm, { metal: 0.6 }), 0, 1.3, 0.31); }
  if (spec.furMantle) { add(g, Tor(0.25, 0.09, 6, 16), mat(spec.furMantle, { rough: 1 }), 0, 0.98, 0, Math.PI / 2); }
  if (spec.ribbons) { const rm = mat(spec.ribbons); for (const sx of [-1, 1]) add(g, Box(0.04, 0.22, 0.01), rm, sx * 0.28, 1.36, -0.04, 0, 0, sx * 0.5); add(g, Tor(0.045, 0.012, 6, 10), rm, -0.39, 0.62, 0, Math.PI / 2); }
  if (spec.ladle) { add(g, Cyl(0.015, 0.015, 0.5, 6), mat(0x6a4a2a), 0.42, 0.5, 0.08, 0, 0, -0.15); add(g, S(0.06, 8, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), mat(0x8a8a8a, { metal: 0.6 }), 0.46, 0.26, 0.08); }
  // heterochromia
  if (spec.eyeColor2 != null) add(g, S(0.04, 8, 8), mat(spec.eyeColor2, { emissive: spec.eyeColor2, ei: 1.4 }), 0.11, 1.21, 0.262);
  if (spec.halo) add(g, Tor(0.16, 0.02, 6, 16), mat(0xffe28a, { emissive: 0xffd24a, ei: 1.4 }), 0, 1.62, -0.02, Math.PI / 2.2);

  // tail (skip if the lower body is already a snake)
  if (!spec.lowerBody || spec.lowerBody === 'hooves') {
    if (spec.tail === 'puff') {
      // rabbit: a round cottontail
      add(g, S(0.09, 10, 8), mat(spec.tailColor ?? spec.hair ?? 0xf4efe6, { rough: 1 }), 0, 0.42, -0.26);
    } else if (spec.tail === 'fox') {
      add(g, Cap(0.11, 0.34, 4, 8), mat(spec.hair ?? 0xd87c3a, { rough: 0.85 }), 0, 0.42, -0.3, 0.9);
      add(g, S(0.09, 8, 8), mat(0xf4efe6), 0, 0.62, -0.44);
    } else if (spec.tail === 'dragon') {
      const dm = mat(spec.tailColor ?? spec.skin, { rough: 0.7, flat: true });
      add(g, Cap(0.06, 0.5, 4, 6), dm, 0, 0.32, -0.32, 1.2);
      add(g, Cone(0.09, 0.16, 4), dm, 0.06, 0.08, -0.5, 0, 0, 0.6); // barbed tip
    } else if (spec.tail === 'devil') {
      const dm = mat(spec.tailColor ?? 0x8a2a2a, { rough: 0.7 });
      add(g, Cap(0.035, 0.44, 4, 6), dm, 0, 0.34, -0.3, 1.15);
      add(g, Cone(0.08, 0.14, 3), dm, 0.05, 0.1, -0.46); // spade tip
    } else if (spec.tail === 'wolf') {
      add(g, Cap(0.08, 0.32, 4, 8), mat(spec.hair ?? spec.tailColor ?? spec.skin, { rough: 0.9 }), 0, 0.36, -0.3, 1.05);
    } else if (spec.tail === 'cheetah') {
      // long, curving up at the end, dark rings and a pale tip
      const tm = mat(spec.tailColor ?? spec.hair ?? spec.skin, { rough: 0.85 });
      const rm = mat(spec.spots ?? 0x2a1a10, { rough: 0.9 });
      add(g, Cap(0.045, 0.36, 4, 8), tm, 0, 0.38, -0.36, 1.3);
      add(g, Cap(0.04, 0.26, 4, 8), tm, 0, 0.45, -0.66, -0.6);
      for (const [y, z] of [[0.41, -0.62], [0.47, -0.67], [0.53, -0.71]]) add(g, Cyl(0.047, 0.047, 0.025, 8), rm, 0, y, z, -0.6);
      add(g, S(0.045, 8, 6), mat(0xf4efe6), 0, 0.58, -0.75);
    } else if (spec.tail === 'cat') {
      add(g, Cap(0.03, 0.42, 4, 6), mat(spec.tailColor ?? spec.hair ?? spec.skin, { rough: 0.85 }), 0, 0.4, -0.28, 1.25);
    } else if (spec.tail) {
      const tm = mat(spec.tailColor ?? spec.skin, { rough: 0.85 });
      add(g, Cap(0.045, 0.4, 4, 6), tm, 0, 0.4, -0.3, 1.1);
      add(g, Cone(0.06, 0.12, 4), tm, 0, 0.2, -0.5, 1.6);
    }
  }

  // extra pair of arms
  if (spec.extraArms) {
    const am = mat(spec.sleeve ?? spec.outfit ?? 0x5a6270);
    add(g, Cap(0.06, 0.28, 4, 8), am, -0.32, 0.55, 0.06, 0, 0, 0.5);
    add(g, Cap(0.06, 0.28, 4, 8), am, 0.32, 0.55, 0.06, 0, 0, -0.5);
    add(g, S(0.065, 8, 8), mat(spec.skin ?? 0xf2d0b8), -0.42, 0.4, 0.1);
    add(g, S(0.065, 8, 8), mat(spec.skin ?? 0xf2d0b8), 0.42, 0.4, 0.1);
  }

  // scaled skin: a few plates on cheeks and chest
  if (spec.scaled) {
    const sm = mat(spec.skin ?? 0x6a9a5a, { rough: 0.5, flat: true });
    const plate = mat(spec.scaleColor ?? spec.tailColor ?? spec.skin ?? 0x6a9a5a, { rough: 0.45, flat: true, metal: 0.2 });
    for (const [x, y, z] of [[-0.22, 1.14, 0.2], [0.22, 1.14, 0.2], [-0.25, 1.08, 0.17], [0.25, 1.08, 0.17]]) add(g, Ico(0.035, 0), plate, x, y, z);       // cheek scales
    for (const sx of [-1, 1]) for (let i = 0; i < 3; i++) add(g, Ico(0.045, 0), plate, sx * (0.26 + i * 0.03), 0.92 - i * 0.07, 0.06);              // shoulder plates
    void sm;
  }

  // spotted coat (cheetah-folk): dark spots on cheeks, arms and legs, plus tear marks
  if (spec.spots) {
    const spm = mat(spec.spots, { rough: 0.9 });
    const pts = [[-0.24, 1.12, 0.18], [0.24, 1.12, 0.18], [-0.27, 1.2, 0.13], [0.27, 1.2, 0.13],
      [-0.33, 0.8, 0.07], [-0.37, 0.69, 0.07], [0.33, 0.8, 0.07], [0.37, 0.69, 0.07],
      [-0.12, 0.3, 0.1], [0.12, 0.24, 0.1], [-0.13, 0.16, 0.1], [0.11, 0.36, 0.1]];
    for (const [x, y, z] of pts) add(g, S(0.022, 6, 5), spm, x, y, z).scale.set(1, 1, 0.5);
    for (const sx of [-1, 1]) add(g, Cap(0.012, 0.08, 3, 4), spm, sx * 0.12, 1.12, 0.285, 0, 0, sx * 0.15);
  }

  // crown / circlet (reuse the helper)
  if (spec.crown) crown(g, spec.crownColor ?? 0xd9b96a, 1.55, 0.19);

  // trailing cape
  if (spec.cape) add(g, Cone(0.4, 0.7, 9, 1, true), mat(spec.capeColor ?? spec.outfit ?? 0x3a2a55), 0, 0.62, -0.14, 0.12);

  // face details
  if (spec.thirdEye) add(g, S(0.045, 8, 8), mat(spec.eyeColor ?? 0xb08cff, { emissive: spec.eyeColor ?? 0xb08cff, ei: 1.4 }), 0, 1.33, 0.25);
  if (spec.antennae) {
    const am = mat(spec.hair ?? spec.skin, { rough: 0.7 });
    for (const sx of [-1, 1]) { add(g, Cap(0.012, 0.24, 4, 6), am, sx * 0.1, 1.5, 0, 0, 0, sx * 0.3); add(g, S(0.035, 6, 6), mat(spec.accent ?? 0xffd24a, { emissive: spec.accent ?? 0xffd24a, ei: 1 }), sx * 0.17, 1.63, 0); }
  }
  if (spec.feathers) { const fm = mat(spec.hair ?? 0xe8e4da, { rough: 0.8, flat: true }); for (let i = 0; i < 3; i++) add(g, Box(0.05, 0.2, 0.01), fm, -0.16 + i * 0.16, 1.44 + (i === 1 ? 0.05 : 0), -0.1, -0.3, 0, (i - 1) * 0.2); }
  if (spec.eyepatch) { add(g, S(0.07, 8, 8), mat(0x1a1a1e), 0.11, 1.21, 0.26).scale.set(1.1, 1.1, 0.5); add(g, Box(0.5, 0.02, 0.02), mat(0x1a1a1e), 0, 1.25, 0.2, 0, 0.2, 0.15); }
  if (spec.glasses) { const gm = mat(0x2a2a30, { metal: 0.4 }); add(g, Tor(0.05, 0.008, 6, 12), gm, -0.11, 1.21, 0.26, Math.PI / 2); add(g, Tor(0.05, 0.008, 6, 12), gm, 0.11, 1.21, 0.26, Math.PI / 2); add(g, Box(0.08, 0.01, 0.01), gm, 0, 1.21, 0.27); }
  if (spec.scar) add(g, Box(0.012, 0.11, 0.01), mat(0xc86a5a), 0.13, 1.2, 0.27, 0, 0, 0.25);
  if (spec.freckles) { const fm = mat(0xc98a6a); for (const [x, y] of [[-0.13, 1.16], [-0.09, 1.14], [-0.05, 1.16], [0.05, 1.16], [0.09, 1.14], [0.13, 1.16]]) add(g, S(0.01, 5, 5), fm, x, y, 0.28); }
  if (spec.piercings) { const pm = mat(0xdcdce4, { metal: 0.8, rough: 0.2 }); add(g, Tor(0.014, 0.004, 5, 8), pm, 0, 1.1, 0.3, Math.PI / 2); add(g, S(0.012, 6, 6), pm, -0.27, 1.24, 0.05); add(g, S(0.012, 6, 6), pm, 0.27, 1.24, 0.05); }
  if (spec.collar) { add(g, Tor(0.17, 0.03, 6, 16), mat(spec.collarColor ?? 0x1a1a1e, { rough: 0.4 }), 0, 1.0, 0, Math.PI / 2.1); add(g, S(0.03, 8, 8), mat(0xd9b96a, { metal: 0.7, rough: 0.3 }), 0, 0.94, 0.16); }
  if (spec.antlers) {
    const am = mat(spec.hornColor ?? 0xcbb48a, { rough: 0.7, flat: true });
    for (const sx of [-1, 1]) {
      add(g, Cap(0.02, 0.34, 4, 6), am, sx * 0.14, 1.5, -0.04, 0.1, 0, sx * 0.35);       // main beam
      add(g, Cap(0.014, 0.16, 4, 6), am, sx * 0.24, 1.62, -0.02, 0.2, 0, sx * 0.7);       // fork 1
      add(g, Cap(0.014, 0.16, 4, 6), am, sx * 0.18, 1.72, -0.08, -0.3, 0, sx * 0.5);      // fork 2
    }
  }

  // facial hair
  if (spec.facialHair) {
    const fm = mat(spec.hair ?? 0x4a3a2a, { rough: 0.9 });
    add(g, Box(0.26, 0.14, 0.1), fm, 0, 1.02, 0.24);      // beard
    add(g, Box(0.16, 0.04, 0.06), fm, 0, 1.1, 0.28);      // mustache
  }

  // tentacles — writhing appendages from the lower back
  if (spec.tentacles) {
    const tm = mat(spec.tentacleColor ?? spec.skin ?? 0x8a5a9a, { rough: 0.6 });
    for (let i = 0; i < 5; i++) {
      const a = (i / 4 - 0.5) * 1.9;
      add(g, Cap(0.045, 0.4, 4, 6), tm, Math.sin(a) * 0.26, 0.28, -0.24 - Math.cos(a) * 0.05, 0.6, a, Math.sin(a) * 0.5);
      add(g, S(0.04, 6, 6), tm, Math.sin(a) * 0.34, 0.1, -0.3);
    }
  }

  // mechanical / prosthetic parts — a metal arm, panel lines, a core light
  if (spec.mechanical) {
    const mm = mat(0x8a929c, { metal: 0.85, rough: 0.3 });
    add(g, Cap(0.075, 0.3, 4, 8), mm, 0.31, 0.75, 0, 0, 0, -0.35);   // metal right arm
    add(g, S(0.08, 8, 8), mm, 0.39, 0.58, 0);
    add(g, Tor(0.05, 0.012, 6, 10), mm, 0.31, 0.82, 0, Math.PI / 2); // shoulder joint
    add(g, S(0.05, 10, 10), mat(spec.accent ?? 0xc86cff, { emissive: spec.accent ?? 0xc86cff, ei: 1.8 }), 0, 0.72, 0.2); // core
    add(g, Box(0.2, 0.02, 0.02), mm, 0, 0.6, 0.22);
  }

  // fins & gills (aquatic) — ear-fins + gill slits
  if (spec.fins) {
    const fm = mat(spec.finColor ?? spec.tailColor ?? 0x4aa0c0, { rough: 0.4, flat: true, opacity: 0.9 });
    for (const sx of [-1, 1]) {
      add(g, Cone(0.13, 0.18, 3), fm, sx * 0.3, 1.22, -0.02, 0, 0, sx * 1.3);        // ear fin
      for (let i = 0; i < 3; i++) add(g, Box(0.03, 0.05, 0.01), mat(0x2a4a5a), sx * 0.22, 1.02 - i * 0.05, 0.16); // gills
    }
  }

  // full fur coat — tufts around the body
  if (spec.furry) {
    const fm = mat(spec.hair ?? spec.skin ?? 0xa88a5a, { rough: 1, flat: true });
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      add(g, Cone(0.05, 0.12, 4), fm, Math.cos(a) * 0.26, 0.62 + Math.sin(a * 2) * 0.1, Math.sin(a) * 0.2, Math.cos(a), 0, Math.sin(a));
    }
    add(g, Tor(0.26, 0.06, 6, 14), fm, 0, 0.95, 0, Math.PI / 2); // ruff at neck
  }

  // mobility aid — a cane
  if (spec.cane) {
    add(g, Cyl(0.018, 0.018, 0.6, 6), mat(0x6a4a2a, { rough: 0.6 }), 0.44, 0.32, 0.06);
    add(g, Tor(0.05, 0.016, 6, 10), mat(0x6a4a2a), 0.44, 0.6, 0.06, Math.PI / 2, 0, Math.PI / 2);
  }

  // mask: a smooth faceplate over the features
  if (spec.mask) {
    const mm = mat(spec.maskColor ?? 0xece6da, { rough: 0.35 });
    add(g, S(0.315, 16, 14, 0, Math.PI * 2, 0, Math.PI / 1.9), mm, 0, 1.19, 0.02).rotation.x = Math.PI / 2.6;
    eyes(g, spec.eyeColor ?? 0x1c1c24, 1.21, 0.11, 0.3, 0.03, true); // eyes glint through
  }

  // spectral bodies: translucent and drifting
  if (spec.ghost) {
    g.traverse(m => { if (m.material) { m.material.transparent = true; m.material.opacity = Math.min(m.material.opacity, 0.68); } });
    g.userData.float = true;
  }

  // slime / ooze body: translucent, glossy, gently gelatinous
  if (spec.slime) {
    const tint = spec.slimeColor ?? spec.skin ?? 0x6ad8a8;
    g.traverse(m => { if (m.material) { m.material.transparent = true; m.material.opacity = Math.min(m.material.opacity ?? 1, 0.72); m.material.color.set(tint); m.material.roughness = 0.15; } });
    // a couple of drips
    add(g, S(0.06, 8, 8), mat(tint, { rough: 0.15, opacity: 0.72 }), -0.18, 0.42, 0.14);
    add(g, S(0.05, 8, 8), mat(tint, { rough: 0.15, opacity: 0.72 }), 0.2, 0.5, 0.1);
    g.userData.float = true;
  }

  // held gear by role
  if (spec.weapon === 'sword') { const w = sword(0xd4dbe2, 0.55); w.position.set(0.42, 0.5, 0.05); w.rotation.z = -0.5; g.add(w); }
  else if (spec.weapon === 'staff') { const st = staff(spec.accent ?? 0x8fce7a); st.scale.setScalar(0.9); st.position.set(0.42, 0.15, 0.08); st.rotation.z = -0.12; g.add(st); }
  else if (spec.weapon === 'book') { const b = grimoire(); b.position.set(-0.4, 0.66, 0.12); b.rotation.y = 0.5; g.add(b); }
  else if (spec.weapon === 'shield') { const sh = shield(0x9aa2ac); sh.scale.setScalar(1.3); sh.position.set(-0.45, 0.64, 0.08); g.add(sh); const w = sword(0xd4dbe2, 0.5); w.position.set(0.42, 0.5, 0.05); w.rotation.z = -0.5; g.add(w); }
  else if (spec.weapon === 'claw') { const cm = mat(0xe8e4da, { rough: 0.3 }); for (const sx of [-1, 1]) for (let i = -1; i <= 1; i++) add(g, Cone(0.018, 0.12, 4), cm, sx * 0.4 + i * 0.03, 0.52, 0.12 + Math.abs(i) * -0.01, -0.4, 0, 0); }

  if (spec.scale && spec.scale !== 1) g.scale.setScalar(spec.scale);
  return g;
}

// ---------------------------------------------------------------
// public API
// ---------------------------------------------------------------

// Returns { group, ready } — group is usable immediately (procedural),
// and swapped in-place if a GLB is configured for this id.
// Aliases: hero ids that render with another builder (reclaimed captives).
const ALIASES = {};
export function registerAlias(id, model, variant = null) { ALIASES[id] = { model, variant }; }

export function buildActor(kind, variant = null, opts = {}) {
  if (ALIASES[kind]) { variant = variant ?? ALIASES[kind].variant; kind = ALIASES[kind].model; }
  const group = new THREE.Group();
  const inner = HERO_BUILDERS[kind] ? HERO_BUILDERS[kind](variant, opts) :
    CUSTOM_SPECS[kind] ? customChibi(CUSTOM_SPECS[kind]) :
    MONSTER_BUILDERS[kind] ? MONSTER_BUILDERS[kind](variant) :
    chibi({});
  group.add(inner);
  group.userData.float = inner.userData.float || false;
  if (opts.boss) inner.scale.multiplyScalar(1.25);

  const manifestKey = variant ? `${kind}_${variant}` : kind;
  const ready = getManifest().then(man => {
    const entry = man[manifestKey] || man[kind];
    if (!entry) return group;
    const conf = typeof entry === 'string' ? { file: entry } : entry;
    return new Promise(resolve => {
      gltfLoader.load('./models/' + conf.file, gltf => {
        group.remove(inner);
        const m = gltf.scene;
        const scale = conf.scale ?? autoScale(m, opts.boss ? 2.1 : 1.6);
        m.scale.setScalar(scale);
        m.position.y = conf.y ?? 0;
        m.rotation.y = conf.rotY ?? 0;
        group.add(m);
        group.userData.gltf = gltf;
        resolve(group);
      }, undefined, () => resolve(group)); // keep placeholder on error
    });
  }).catch(() => group);

  return { group, ready };
}

function autoScale(obj, targetHeight) {
  const box = new THREE.Box3().setFromObject(obj);
  const h = box.max.y - box.min.y;
  return h > 0 ? targetHeight / h : 1;
}

export const ACTOR_ACCENTS = {
  player: 0xc86cff, vesper: 0xb8a8e8, rue: 0xff8a4a, isolde: 0xc8ccd8,
  erin: 0x5a8ae8, sakura: 0xff9ec6, shiro: 0xd8d8f2, yuki: 0xa8d8b0,
  mira: 0xc86a4a, nessa: 0x8fce7a, vex: 0xb08cff, seris: 0x8a6ad8, calla: 0xe8a87a, cinder: 0xff7a4a,
};
