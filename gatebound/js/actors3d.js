// ============================================================
// GATEBOUND — procedural placeholder actors + GLB drop-in
// Every actor is a cheerful low-poly chibi built from primitives,
// so the game is fully playable with zero art assets. If
// models/manifest.json maps an actor id to a .glb (e.g. exported
// from Meshy), it replaces the placeholder automatically.
// ============================================================

import * as THREE from 'three';
import { GLTFLoader } from '../vendor/GLTFLoader.js';

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

  if (o.outfitStyle === 'dress' || o.outfitStyle === 'robe') {
    add(g, Cone(0.42, 0.85, 10), mat(outfit), 0, 0.46, 0);
    if (o.frill) add(g, Tor(0.32, 0.05, 8, 16), mat(o.frill), 0, 0.12, 0, Math.PI / 2);
    add(g, Cap(0.2, 0.22, 4, 10), mat(outfit), 0, 0.85, 0);
  } else {
    add(g, Cyl(0.075, 0.09, 0.34, 8), mat(o.legColor ?? 0x3a3f4a), -0.11, 0.19, 0);
    add(g, Cyl(0.075, 0.09, 0.34, 8), mat(o.legColor ?? 0x3a3f4a), 0.11, 0.19, 0);
    const torsoMat = o.outfitStyle === 'armor' ? mat(outfit, { metal: 0.75, rough: 0.3 }) : mat(outfit);
    add(g, Cap(0.24, 0.36, 4, 12), torsoMat, 0, 0.62, 0);
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
    }
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

const HERO_BUILDERS = {
  player(v) {
    if (v === 'formal') {
      const g = chibi({ skin: 0xe8c8a8, hair: 0x2e2a33, hairstyle: 'short', outfit: 0x1b2233, sleeve: 0x1b2233, legColor: 0x14181f });
      add(g, Tor(0.2, 0.03, 6, 14), mat(0xd9b96a, { metal: 0.7, rough: 0.3 }), 0, 1.0, 0, Math.PI / 2.4); // gold collar
      add(g, Box(0.12, 0.42, 0.04), mat(0x54d8ff, { emissive: 0x54d8ff, ei: 0.6 }), 0, 0.66, 0.12);           // System-teal cravat
      add(g, Cone(0.36, 0.52, 9, 1, true), mat(0x2a3550), 0, 0.86, -0.06);                                     // formal half-cape
      return g;
    }
    const g = chibi({ skin: 0xe8c8a8, hair: 0x2e2a33, hairstyle: 'short', outfit: 0x2f3542, sleeve: 0x2f3542, legColor: 0x23272f });
    // hooded half-cloak with System-teal lining
    add(g, Cone(0.38, 0.55, 9, 1, true), mat(0x232833), 0, 0.85, -0.06);
    add(g, Cone(0.2, 0.24, 8), mat(0x232833), 0, 1.44, -0.1, 0.3);
    add(g, Tor(0.2, 0.03, 6, 14), mat(0x54d8ff, { emissive: 0x54d8ff, ei: 0.8 }), 0, 1.02, 0, Math.PI / 2.4);
    const w = sword(0xd8e2ea, 0.5); w.position.set(0.42, 0.5, 0.05); w.rotation.z = -0.5; g.add(w);
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
  if (o.oneEye) add(g, S(0.07, 8, 8), mat(0x54d8ff, { emissive: 0x54d8ff, ei: 2.5 }), 0, 1.42, 0.19);
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
    const colors = { frost: 0x9ec8dc, hell: 0x5a2a2a, dire: 0x3a3f4a, abyss: 0x46285a };
    const w = quadruped({ color: colors[v] ?? 0x8a8f99, eye: v === 'hell' ? 0xff6a3a : v === 'abyss' ? 0xc86cff : 0xffd24a });
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
    const ice = v === 'ice';
    const g = new THREE.Group();
    add(g, S(0.22, 12, 12), mat(ice ? 0x9ed8ff : 0xaef2c8, { emissive: ice ? 0x6ab8ff : 0x7ae8a8, ei: 1.5 }), 0, 1.0, 0);
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
    const g = chibi({ skin: bone, hair: null, outfit: v === 'revenant' ? 0x3a2a2e : 0xd8d4c8, legColor: v === 'revenant' ? 0x2e2226 : 0xd8d4c8, eyeColor: v === 'tyrant' ? 0xb06cff : v === 'revenant' ? 0xff5a4a : 0x54d8ff, eyeGlow: true });
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
    const g = golemish({ color: v === 'colossus' ? 0x6a6f78 : v === 'war' ? 0x5a4a4a : 0x7a7f86, core: v === 'colossus' ? 0xff6a3a : v === 'war' ? 0xff3a3a : 0xffa24a });
    if (v === 'colossus') g.scale.setScalar(1.4);
    if (v === 'war') g.scale.setScalar(1.12);
    return g;
  },
  sentinel(v) { const g = golemish({ color: v === 'archon' ? 0x6a6478 : 0x8a8478, core: v === 'archon' ? 0xc86cff : 0x54d8ff, oneEye: true }); g.scale.set(v === 'archon' ? 1.0 : 0.85, v === 'archon' ? 1.3 : 1.1, v === 'archon' ? 1.0 : 0.85); return g; },
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
    eyes(g, 0x54d8ff, 1.0, 0.12, 0.4, 0.045, true);
    g.userData.float = true;
    if (v === 'matriarch') { g.scale.setScalar(1.35); crown(g, 0xd8f2ff, 1.5, 0.2); }
    if (v === 'sovereign') { g.scale.setScalar(1.4); crown(g, 0xc8a8ff, 1.5, 0.2); }
    return g;
  },
  yeti(v) {
    const giant = v === 'giant';
    const g = chibi({ skin: giant ? 0xc6d6ea : 0xe8ecf2, hair: 0xdde4ec, hairstyle: 'short', outfit: 0xdde4ec, legColor: 0xc8d0da, eyeColor: giant ? 0x4a6acc : 0x2a3a5a });
    g.scale.setScalar(giant ? 1.6 : 1.35);
    horns(g, 0x9aa4b0, 1.4, 0.16, 0.18);
    return g;
  },
  imp() {
    const g = chibi({ skin: 0xc85a4a, hair: null, outfit: 0x8a3a32, legColor: 0x6a2a24, eyeColor: 0xffd24a, eyeGlow: true });
    horns(g, 0xf2d8b8, 1.44, 0.14, 0.22);
    add(g, Cone(0.05, 0.4, 6), mat(0xc85a4a), 0, 0.3, -0.3, Math.PI / 1.5);
    g.scale.setScalar(0.85);
    return g;
  },
  demon(v) {
    const gen = v === 'general';
    const g = chibi({ skin: gen ? 0x8a3a4a : 0xa8443a, hair: null, outfit: gen ? 0x3a1a2a : 0x5a1f1a, outfitStyle: 'armor', legColor: 0x3a1512, eyeColor: gen ? 0xff7a4a : 0xffb24a, eyeGlow: true });
    horns(g, 0xf2d8b8, 1.46, 0.16, 0.3);
    wings(g, gen ? 0x2a0f1a : 0x4a1a16, 0.95, 0.6);
    const w = sword(gen ? 0xaa2a2a : 0x8a2a22, 0.62); w.position.set(0.42, 0.5, 0.05); w.rotation.z = -0.5; g.add(w);
    g.scale.setScalar(gen ? 1.4 : 1.25);
    return g;
  },
  herald(v) {
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
// public API
// ---------------------------------------------------------------

// Returns { group, ready } — group is usable immediately (procedural),
// and swapped in-place if a GLB is configured for this id.
export function buildActor(kind, variant = null, opts = {}) {
  const group = new THREE.Group();
  const inner = HERO_BUILDERS[kind] ? HERO_BUILDERS[kind](variant, opts) :
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
  player: 0x54d8ff, erin: 0x5a8ae8, sakura: 0xff9ec6, shiro: 0xd8d8f2, yuki: 0xa8d8b0,
};
