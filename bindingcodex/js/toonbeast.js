// ============================================================
// BINDING CODEX — beastkin on the toon figure
// Turns a beastkin look (the chibi spec the Wildkin pack uses for
// envoys, kin, Lysandre and the guests) into a toon figure: ears,
// horns, antlers, fins, wings, harpy wing-arms and talons, a naga
// coil in place of legs, tails, spots and scales.
// ============================================================

import * as THREE from 'three';
import { tmat, tadd, SS, SC, ST } from './toon.js';
import { toonFigure } from './toonfig.js';
import { ACCESSORIES as ACC } from './toonacc.js';

const darker = (hex, f) => new THREE.Color(hex).multiplyScalar(f).getHex();
const lighter = (hex, f) => new THREE.Color(hex).lerp(new THREE.Color(0xffffff), f).getHex();

// A tube along a curve that tapers from r0 to r1 (tails, the naga coil, antlers).
function taper(points, r0, r1, seg = 48, radial = 14) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  const geo = new THREE.TubeGeometry(curve, seg, 1, radial, false);
  const pos = geo.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i <= seg; i++) {
    const u = i / seg, c = curve.getPointAt(u), r = r0 + (r1 - r0) * u;
    for (let j = 0; j <= radial; j++) {
      const idx = i * (radial + 1) + j;
      v.fromBufferAttribute(pos, idx).sub(c).multiplyScalar(r).add(c);
      pos.setXYZ(idx, v.x, v.y, v.z);
    }
  }
  geo.computeVertexNormals();
  return { geo, curve };
}
const cap = (parent, p, r, m) => tadd(parent, SS(r, 16, 12), m, p.x, p.y, p.z);

// --- head pieces -----------------------------------------------------------------------
function ears(c, kind, color, inner, back) {
  const { body, hy, hr, k } = c;
  const em = tmat(color), im = tmat(inner ?? 0xf2c0c8, { noOutline: true });
  for (const sx of [-1, 1]) {
    if (kind === 'rabbit') {
      const e = new THREE.Group(); e.position.set(sx * hr * 0.42, hy + hr * 0.85, -0.02); e.rotation.z = -sx * 0.18; e.rotation.x = -0.15; body.add(e);
      tadd(e, SC(0.05 * k, 0.32 * k), em, 0, 0.2 * k, 0).scale.set(1, 1, 0.55);
      tadd(e, SC(0.028 * k, 0.24 * k), im, 0, 0.2 * k, 0.022 * k).scale.set(1, 1, 0.4);
    } else if (kind === 'round') {
      tadd(body, SS(0.085 * k, 16, 12), em, sx * hr * 0.62, hy + hr * 1.0, -0.02).scale.set(1, 1, 0.45);
      tadd(body, SS(0.055 * k, 12, 10), tmat(back ?? 0x2a1a10, { noOutline: true }), sx * hr * 0.62, hy + hr * 1.01, -0.05).scale.set(1, 1, 0.3);
      tadd(body, SS(0.05 * k, 12, 10), im, sx * hr * 0.62, hy + hr * 0.99, 0.01).scale.set(1, 1, 0.3);
    } else { // fox, cat, deer: a pointed triangle ear
      const big = kind === 'fox' ? 1.25 : kind === 'deer' ? 1.05 : 0.9;
      const e = new THREE.Group(); e.position.set(sx * hr * (kind === 'deer' ? 0.92 : 0.58), hy + hr * (kind === 'deer' ? 0.35 : 0.78), -0.02);
      e.rotation.z = -sx * (kind === 'deer' ? 1.15 : 0.32); body.add(e);
      tadd(e, new THREE.ConeGeometry(0.075 * k * big, 0.2 * k * big, 12), em, 0, 0.08 * k * big, 0).scale.set(1, 1, 0.45);
      tadd(e, new THREE.ConeGeometry(0.045 * k * big, 0.13 * k * big, 10), kind === 'fox' ? tmat(0xf4efe6, { noOutline: true }) : im, 0, 0.06 * k * big, 0.02).scale.set(1, 1, 0.3);
    }
  }
}
function horns(c, style, size, color) {
  const { body, hy, hr, k } = c, m = tmat(color);
  const len = (size === 'large' ? 1.35 : size === 'small' ? 0.75 : 1) * k;
  for (const sx of [-1, 1]) {
    if (style === 'swept') {
      const { geo } = taper([[sx * hr * 0.42, hy + hr * 0.7, 0.04], [sx * hr * 0.62, hy + hr * 1.1, -0.02], [sx * hr * 0.85, hy + hr * 1.38 * Math.min(1.25, len / k), -0.18 * len], [sx * hr * 1.05, hy + hr * 1.4 * Math.min(1.25, len / k), -0.42 * len]], 0.06 * k, 0.008, 28, 12);
      tadd(body, geo, m);
    } else {
      const h = new THREE.Group(); h.position.set(sx * hr * 0.45, hy + hr * 0.78, 0); h.rotation.z = -sx * 0.4; body.add(h);
      tadd(h, new THREE.ConeGeometry(0.04 * len, 0.22 * len, 14), m, 0, 0.1 * len, 0, -0.3);
    }
  }
}
function antlers(c, color) {
  const { body, hy, hr, k } = c, m = tmat(color);
  for (const sx of [-1, 1]) {
    const base = [sx * hr * 0.42, hy + hr * 0.75, -0.02];
    tadd(body, taper([base, [sx * hr * 0.62, hy + hr * 1.15, -0.05], [sx * hr * 0.95, hy + hr * 1.45, -0.08]], 0.022 * k, 0.008, 16, 8).geo, m);
    tadd(body, taper([[sx * hr * 0.58, hy + hr * 1.08, -0.04], [sx * hr * 0.5, hy + hr * 1.4, -0.02]], 0.014 * k, 0.006, 10, 8).geo, m);
    tadd(body, taper([[sx * hr * 0.78, hy + hr * 1.3, -0.06], [sx * hr * 0.75, hy + hr * 1.6, -0.05]], 0.012 * k, 0.005, 10, 8).geo, m);
  }
}
function earFins(c, color) {
  const { body, hy, hr, k } = c;
  const m = tmat(color, { noOutline: true }); m.side = THREE.DoubleSide;
  for (const sx of [-1, 1]) {
    const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(0.2 * k, 0.12 * k); sh.lineTo(0.17 * k, 0.04 * k); sh.lineTo(0.22 * k, -0.02 * k); sh.lineTo(0.15 * k, -0.06 * k); sh.lineTo(0, -0.04 * k);
    const f = tadd(body, new THREE.ShapeGeometry(sh), m, sx * hr * 0.98, hy - 0.01, -0.01, 0, sx < 0 ? Math.PI : 0, 0);
    f.rotation.y += sx * -0.5;
  }
}
function crown(c, color) {
  const { body, hy, hr, k } = c, m = tmat(color, { emissive: darker(color, 0.25) });
  tadd(body, ST(hr * 0.66, 0.018), m, 0, hy + hr * 0.98, 0.0, Math.PI / 2 - 0.25);
  for (let i = -2; i <= 2; i++) tadd(body, new THREE.ConeGeometry(0.024 * k, (i === 0 ? 0.13 : 0.09) * k, 8), m, Math.sin(i * 0.42) * hr * 0.64, hy + hr * 1.08 + (i === 0 ? 0.03 : 0), Math.cos(i * 0.42) * hr * 0.6 - 0.02);
  tadd(body, SS(0.022 * k, 12, 10), tmat(0x4ad8a8, { emissive: 0x2a8a6a, ei: 1 }), 0, hy + hr * 1.0, hr * 0.64);
}
function antennae(c, color) {
  const { body, hy, hr, k } = c, m = tmat(color);
  for (const sx of [-1, 1]) {
    tadd(body, taper([[sx * hr * 0.2, hy + hr * 0.85, 0.05], [sx * hr * 0.35, hy + hr * 1.3, 0.1], [sx * hr * 0.6, hy + hr * 1.55, 0.04]], 0.008, 0.006, 14, 6).geo, m);
    for (let i = 0; i < 5; i++) tadd(body, SC(0.012 * k, 0.05 * k), m, sx * hr * (0.42 + i * 0.04), hy + hr * (1.38 + i * 0.04), 0.07, 0, 0, sx * (0.9 + i * 0.1));
  }
}

// --- wings -----------------------------------------------------------------------------
// Back wings: a drake's ribbed membrane, or a moth's soft rounded pair.
function backWings(c, color, size, kind) {
  const { body, shoulderY, k } = c;
  const s = (size ?? 0.5) * 2.1;
  const m = tmat(color, { noOutline: true }); m.side = THREE.DoubleSide;
  for (const sx of [-1, 1]) {
    const w = new THREE.Group(); w.position.set(sx * 0.07, shoulderY - 0.06, -0.12); w.rotation.y = sx * -0.45; body.add(w);
    const sh = new THREE.Shape();
    if (kind === 'moth') {
      sh.moveTo(0, 0); sh.bezierCurveTo(0.15 * s, 0.32 * s, 0.48 * s, 0.4 * s, 0.5 * s, 0.16 * s); sh.bezierCurveTo(0.52 * s, 0.02 * s, 0.32 * s, -0.04 * s, 0.22 * s, -0.04 * s);
      sh.bezierCurveTo(0.34 * s, -0.12 * s, 0.32 * s, -0.36 * s, 0.14 * s, -0.32 * s); sh.bezierCurveTo(0.04 * s, -0.28 * s, 0, -0.12 * s, 0, 0);
    } else {
      sh.moveTo(0, 0); sh.lineTo(0.18 * s, 0.34 * s); sh.lineTo(0.5 * s, 0.4 * s);
      sh.quadraticCurveTo(0.42 * s, 0.22 * s, 0.46 * s, 0.1 * s); sh.quadraticCurveTo(0.34 * s, 0.06 * s, 0.32 * s, -0.08 * s); sh.quadraticCurveTo(0.2 * s, -0.04 * s, 0.14 * s, -0.18 * s); sh.lineTo(0, 0);
    }
    const geo = new THREE.ShapeGeometry(sh, 24);
    const mesh = tadd(w, geo, m); if (sx < 0) mesh.scale.x = -1;
    if (kind === 'moth') {
      tadd(w, new THREE.CircleGeometry(0.06 * s, 20), tmat(darker(color, 0.55), { noOutline: true }), sx * 0.3 * s, 0.18 * s, 0.003);
      tadd(w, new THREE.CircleGeometry(0.03 * s, 16), tmat(0xffd24a, { emissive: 0xffd24a, ei: 0.4, noOutline: true }), sx * 0.3 * s, 0.18 * s, 0.005);
    } else {
      const bone = tmat(darker(color, 0.6));
      for (const [x, y] of [[0.5, 0.4], [0.46, 0.1], [0.32, -0.08], [0.14, -0.18]]) tadd(w, taper([[0, 0, 0.004], [sx * x * s * 0.95, y * s * 0.95, 0.004]], 0.012 * k, 0.005, 6, 6).geo, bone);
    }
  }
}
// Harpy wing-arms: layered feather vanes along each arm, tipped darker, moving with the arm.
function wingArms(c, color, tip) {
  const { arms, armLen, k } = c;
  const fm = tmat(color), tm = tmat(tip ?? darker(color, 0.5)), lm = tmat(lighter(color, 0.35));
  for (const [sx, arm] of [[-1, arms.L], [1, arms.R]]) {
    // covert feathers along the upper arm, then long primaries fanning out past the hand
    for (let i = 0; i < 9; i++) {
      const y = -armLen * (0.06 + i * 0.1), len = (0.16 + i * 0.045) * k;
      const f = tadd(arm, SC(0.034 * k, len), i >= 7 ? tm : i < 3 ? lm : fm, sx * (0.07 + i * 0.006), y - len * 0.42, -0.015 - i * 0.002, 0, 0, sx * (0.18 + i * 0.07));
      f.scale.set(1, 1, 0.3);
    }
  }
}
function talons(c, color) {
  for (const leg of [c.legs.L, c.legs.R]) {
    const sl = c.legLen * 0.5, m = tmat(color ?? 0x2a2218);
    for (let i = -1; i <= 1; i++) tadd(leg.shin, new THREE.ConeGeometry(0.014, 0.08, 8), m, i * 0.03, -sl - 0.01, 0.1, Math.PI / 2.2, 0, -i * 0.25);
    tadd(leg.shin, new THREE.ConeGeometry(0.012, 0.06, 8), m, 0, -sl, -0.06, -Math.PI / 2.2);
  }
}

// --- tails and the coil -------------------------------------------------------------
function tail(c, kind, color, spots, hair) {
  const { body, hipY, hipR, k } = c;
  const m = tmat(color);
  const y0 = hipY + 0.04, z0 = -hipR * 0.85;
  if (kind === 'puff') { tadd(body, SS(0.075, 16, 12), tmat(color ?? 0xf4efe6), 0, y0 - 0.02, z0 - 0.04); return; }
  if (kind === 'fox' || kind === 'wolf') {
    const fur = tmat(color ?? hair);
    const { geo, curve } = taper([[0, y0, z0], [0, y0 - 0.12, z0 - 0.18], [0.08, y0 - 0.1, z0 - 0.38], [0.14, y0 + 0.06, z0 - 0.5]], 0.05, 0.1, 24, 14);
    tadd(body, geo, fur);
    const tipP = curve.getPointAt(1);
    cap(body, tipP, 0.1, fur);
    if (kind === 'fox') cap(body, tipP.clone().add(new THREE.Vector3(0.02, 0.05, -0.03)), 0.075, tmat(0xf4efe6));
    return;
  }
  if (kind === 'cheetah') {
    const { geo, curve } = taper([[0, y0, z0], [0, y0 - 0.2, z0 - 0.15], [0.06, y0 - 0.32, z0 - 0.4], [0.16, y0 - 0.2, z0 - 0.6], [0.2, y0 + 0.02, z0 - 0.62]], 0.034, 0.022, 40, 12);
    tadd(body, geo, m);
    const rm = tmat(spots ?? 0x2a1a10, { noOutline: true });
    for (let i = 5; i <= 8; i++) { const p = curve.getPointAt(i / 9), t = curve.getTangentAt(i / 9); const ring = tadd(body, ST(0.026, 0.008), rm, p.x, p.y, p.z); ring.lookAt(p.clone().add(t)); }
    cap(body, curve.getPointAt(1), 0.024, tmat(0xf4efe6));
    return;
  }
  // dragon / devil: a thick scaled tail with a barbed or spaded tip
  const thick = kind === 'dragon' ? 0.07 : 0.03;
  const { geo, curve } = taper([[0, y0, z0], [0, y0 - 0.2, z0 - 0.15], [0.05, y0 - 0.5, z0 - 0.3], [0.2, hipY - 0.78, z0 - 0.35], [0.38, hipY - 0.8, z0 - 0.2]], thick, 0.012, 40, 14);
  tadd(body, geo, m);
  const p = curve.getPointAt(1);
  const tipG = new THREE.ConeGeometry(kind === 'dragon' ? 0.05 : 0.04, 0.1, 4); tipG.scale(1, 1, 0.4);
  const tipM = tadd(body, tipG, tmat(darker(color, 0.7)), p.x + 0.03, p.y, p.z); tipM.rotation.z = -Math.PI / 2;
  if (kind === 'dragon') for (let i = 1; i < 7; i++) { const q = curve.getPointAt(i / 8); tadd(body, new THREE.ConeGeometry(0.016, 0.05, 6), tmat(darker(color, 0.6)), q.x, q.y + thick * (1 - i / 8) * 0.9, q.z); }
}
// The naga coil: the body flows into a long tail that loops on the ground behind her.
function coil(c, color) {
  const { body, hipY, hipR } = c;
  const m = tmat(color), belly = tmat(lighter(color, 0.45));
  const pts = [[0, hipY + 0.05, 0], [0, hipY - 0.25, 0.04], [0.02, 0.2, 0.12], [0.18, 0.09, 0.2], [0.36, 0.08, 0.02], [0.3, 0.09, -0.26], [0.02, 0.1, -0.38], [-0.28, 0.1, -0.3], [-0.38, 0.12, -0.02], [-0.3, 0.2, 0.2], [-0.12, 0.32, 0.28]];
  const { geo, curve } = taper(pts, hipR * 0.92, 0.012, 120, 20);
  tadd(body, geo, m);
  // pale belly scutes on the front of the upright part
  for (let i = 1; i < 9; i++) { const p = curve.getPointAt(i * 0.022); tadd(body, SS(hipR * (0.62 - i * 0.03), 16, 10), belly, p.x, p.y, p.z + hipR * 0.55).scale.set(1, 0.32, 0.4); }
}

// --- markings ------------------------------------------------------------------------
function armSpots(c, color) {
  const m = tmat(color, { noOutline: true });
  for (const arm of [c.arms.L, c.arms.R]) for (let i = 0; i < 6; i++) tadd(arm, SS(0.013, 8, 6), m, Math.sin(i * 2.1) * 0.042, -c.armLen * (0.2 + i * 0.1), Math.cos(i * 2.1) * 0.042);
  for (const leg of c.legs.L ? [c.legs.L, c.legs.R] : []) for (let i = 0; i < 6; i++) tadd(leg.thigh, SS(0.015, 8, 6), m, Math.sin(i * 2.4) * 0.07, -c.legLen * (0.08 + i * 0.065), Math.cos(i * 2.4) * 0.07);
}
function scalePatches(c, color) {
  const m = tmat(color, { noOutline: true });
  for (const arm of [c.arms.L, c.arms.R]) for (let i = 0; i < 4; i++) tadd(arm, SS(0.022, 8, 6), m, 0.03 * (i % 2 ? 1 : -1), -0.04 - i * 0.04, 0.035).scale.set(1, 0.6, 0.4);
  for (const sx of [-1, 1]) for (let i = 0; i < 3; i++) tadd(c.body, SS(0.012 * c.k, 8, 6), m, sx * c.hr * (0.62 + i * 0.07), c.hy - c.hr * (0.25 + i * 0.08), c.hr * (0.72 - i * 0.08)).scale.set(1, 0.6, 0.5);
}

// --- the adapter -----------------------------------------------------------------------
const BUST = [0.8, 1.0, 1.15, 1.3];
export function beastToon(spec) {
  const male = !!(spec.male || spec.facialHair);
  const beast = !!(spec.armWings || spec.lowerBody || spec.ears || spec.tail || spec.wings || spec.antennae || spec.antlers);
  const serpent = spec.lowerBody === 'serpent';
  const harpy = !!spec.armWings;
  const skin = spec.skin ?? 0xf0d0b8, hair = spec.hair ?? 0x3a2a1a, main = spec.outfit ?? 0x5a3a2a;
  const style = spec.outfitStyle;
  const t = {
    fem: !male, build: male ? 'slim' : (spec.build || 'average'), bust: BUST[spec.chest ?? 2] ?? 1.15,
    colors: { skin, hair, main, deep: darker(main, 0.7), trim: spec.frill ?? spec.crownColor ?? lighter(main, 0.4), glove: skin, metal: spec.scaleColor ?? 0x9aa2ac },
    face: { eye: spec.eyeColor ?? 0x6a4a2a, brow: darker(hair, 0.6), lashes: male ? darker(hair, 0.4) : 0x1a1214,
      slit: !!(spec.lowerBody === 'serpent' || spec.scaled && !male), tear: spec.ears === 'round' ? (spec.spots ?? 0x2a1a10) : null, freckles: !!spec.freckles,
      mouth: spec.weapon ? 'smirk' : 'smile', fang: !!spec.horns || spec.ears === 'round' },
    hair: { braided: 'long', short: 'short', curly: 'curly', straight: 'straight', long: 'long' }[spec.hairstyle] || 'long',
    sleeves: harpy ? 'bare' : style === 'robe' ? 'detached' : style === 'armor' ? 'bare' : (spec.sleeve != null && spec.sleeve !== skin ? 'long' : 'bare'),
  };
  if (male) {
    t.top = { style: 'coat', collar: false, corset: false, buttons: 3 };
    t.skirt = { style: 'long', hem: 0.66, trim: false };
    t.legs = { style: 'pants', color: spec.legColor ?? darker(main, 0.6), boots: 0x4a3424, bootHeight: 0.45 };
    t.sleeves = 'long';
  } else if (style === 'dress') {
    t.top = { style: 'corset', cut: 1.08 };
    t.skirt = { style: 'long', hem: 0.1 };
  } else if (style === 'robe') {
    t.top = { style: 'corset', cut: 1.08 };
    t.skirt = { style: 'long', hem: serpent ? 0.66 : 0.12 };
  } else if (style === 'armor') {
    t.top = { style: 'corset', cut: 1.02 };
    t.skirt = { style: 'tasset', hem: 0.6, color: spec.scaleColor ?? main };
    t.colors.glove = spec.scaleColor ?? darker(skin, 0.6);
  } else if (!beast) {
    t.top = { style: 'corset', cut: 1.04 };
    t.skirt = { style: 'pleated', hem: 0.5 };
  } else {
    t.top = { style: 'corset', cut: harpy ? 1.06 : 1.0, corset: false };
    t.skirt = { style: 'tattered', hem: harpy ? 0.6 : 0.66, color: harpy ? spec.wingColor ?? main : main };
  }
  if (serpent) t.legs = { style: 'serpent' };
  if (!t.legs) {
    t.legs = serpent ? { style: 'serpent' }
      : harpy ? { style: 'bare', boots: 0xc8a050, bootHeight: 0.62, bootTrim: spec.wingColor ?? 0xb8885a }
      : spec.ears === 'round' ? { style: 'bare', boots: skin, bootHeight: 0.04, bootTrim: skin }
      : { style: 'stockings', color: spec.legColor ?? darker(main, 0.6), boots: darker(spec.legColor ?? main, 0.7), bootHeight: 0.4 };
  }
  if (style === 'armor') t.legs = { style: 'stockings', color: spec.legColor ?? 0x3a1a10, boots: darker(spec.scaleColor ?? main, 0.6), bootHeight: 0.55, band: spec.scaleColor ?? main };
  if (spec.cape) t.cape = spec.capeColor ?? darker(main, 0.6);
  if (spec.ghost) { t.colors.skin = lighter(skin, 0.35); t.face.eye = spec.eyeColor ?? 0x9ad8e8; }
  t.extras = c => {
    if (spec.elf) ACC.elf(c);
    if (spec.facialHair) ACC.beard(c);
    if (spec.helm) ACC.helm(c, spec.helm);
    if (spec.wimple) ACC.wimple(c, spec.wimple);
    if (spec.veil) ACC.veil(c, spec.veil);
    if (spec.halo) ACC.halo(c);
    if (spec.collar) ACC.collarglow(c, spec.collarColor ?? 0xd8b04a);
    if (spec.mug) ACC.mug(c);
    if (spec.bottle) ACC.bottle(c);
    if (spec.ladle) ACC.ladle(c);
    if (spec.fan) ACC.fan(c, spec.fanColor ?? 0xd8b04a);
    if (spec.weapon === 'book') ACC.book(c, darker(main, 0.6));
    if (spec.weapon === 'staff') ACC.staff(c, spec.accent ?? spec.eyeColor ?? 0xb06cff);
    if (spec.ears) ears(c, spec.antlers ? 'deer' : spec.ears, spec.ears === 'round' ? (spec.tailColor ?? hair) : hair, null, spec.spots);
    if (spec.horns) horns(c, spec.hornStyle, spec.hornSize, spec.hornColor ?? 0x3a2a1a);
    if (spec.antlers) antlers(c, spec.hornColor ?? 0xcbb48a);
    if (spec.earFins) earFins(c, spec.finColor ?? 0xd8b04a);
    if (spec.crown) crown(c, spec.crownColor ?? 0xd8b04a);
    if (spec.antennae) antennae(c, hair);
    if (spec.wings) backWings(c, spec.wingColor ?? 0x8a3a1a, spec.wingSize, spec.antennae ? 'moth' : 'drake');
    if (harpy) wingArms(c, spec.wingColor ?? 0xb8885a, spec.wingTip);
    if (spec.talons && c.legs.L) talons(c);
    if (serpent) coil(c, spec.tailColor ?? 0x3a8a5a);
    else if (spec.tail) tail(c, spec.tail, spec.tailColor ?? hair, spec.spots, hair);
    if (spec.spots && spec.ears === 'round') armSpots(c, spec.spots);
    if (spec.scaled && !serpent) scalePatches(c, spec.scaleColor ?? spec.tailColor ?? 0x3a8a5a);
    if (spec.furMantle) tadd(c.body, ST(c.F.shoulderX * 0.95, 0.055), tmat(spec.furMantle), 0, c.shoulderY + 0.01, 0, Math.PI / 2);
    if (spec.apron) tadd(c.body, new THREE.BoxGeometry(0.2, 0.32, 0.015), tmat(spec.apron), 0, c.waistY - 0.15, c.hipR * 0.92 + 0.02, -0.1);
    if (spec.ribbons) for (const sx of [-1, 1]) tadd(c.body, SC(0.012, 0.16), tmat(spec.ribbons), sx * c.hr * 0.7, c.hy - c.hr * 0.6, -0.04, 0, 0, sx * 0.4);
    if (spec.changeArm) { const m = tmat(spec.tailColor ?? 0x2a6a5a); tadd(c.arms.L, SC(0.052, c.armLen * 0.5), m, 0, -c.armLen * 0.6, 0); for (let i = -1; i <= 1; i++) tadd(c.arms.L, new THREE.ConeGeometry(0.012, 0.07, 6), tmat(0xe8e4da), i * 0.02, -c.armLen * 1.02, 0.02, Math.PI); }
    if (spec.weapon === 'sword') ACC.sword(c);
    if (spec.weapon === 'shield') ACC.shield(c, spec.scaleColor ?? 0x9aa2ac);
    if (spec.weapon === 'claw') for (const arm of [c.arms.L, c.arms.R]) for (let i = -1; i <= 1; i++) tadd(arm, new THREE.ConeGeometry(0.01, 0.07, 6), tmat(0xe8e4da), i * 0.022, -c.armLen * 1.0, 0.03, Math.PI);
  };
  const g = toonFigure(t);
  if (spec.scale) g.scale.setScalar(spec.scale);
  return g;
}
