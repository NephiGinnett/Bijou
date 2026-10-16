// ============================================================
// BINDING CODEX — toon accessories
// Small props and costume pieces for toon figures, by name. A look
// lists them as a comma string; an accessory can take a color after
// a colon ("sword:0xdde4ea,witchhat:0xf4efe6"). Hand props skip
// themselves when the character has a real weapon equipped.
// ============================================================

import * as THREE from 'three';
import { tmat, tadd, SS, SC, ST } from './toon.js';

const glow = c => tmat(c, { emissive: c, ei: 1.6 });
const inHand = (c, arm = 'R') => { const g = new THREE.Group(); g.position.set(0.03, -c.armLen * 0.96, 0.06); c.arms[arm].add(g); return g; };

export const ACCESSORIES = {
  // --- townsfolk ---
  glasses: c => { const m = tmat(0x6a2a2a, { noOutline: true }); for (const sx of [-1, 1]) tadd(c.body, ST(0.046 * c.k, 0.0045), m, sx * c.hr * 0.27, c.hy - 0.005, c.hr * 0.985); tadd(c.body, SC(0.004, 0.04 * c.k), m, 0, c.hy + 0.002, c.hr * 1.0, 0, 0, Math.PI / 2); },
  pearls: c => { for (let i = 0; i < 13; i++) { const a = -1.2 + i * 0.2; tadd(c.body, SS(0.013, 10, 8), tmat(0xf4f0e8, { noOutline: true }), Math.sin(a) * 0.1, c.shoulderY - 0.02 - Math.cos(a) * 0.05, 0.13 + Math.cos(a) * 0.04); } },
  clipboard: c => { if (c.hasWeapon) return; const b = new THREE.Group(); b.position.set(0.04, -c.armLen * 0.9, 0.1); b.rotation.set(0.2, -0.4, 0); c.arms.R.add(b); tadd(b, new THREE.BoxGeometry(0.18, 0.24, 0.015), tmat(0x8a6a4a)); tadd(b, new THREE.BoxGeometry(0.15, 0.19, 0.018), tmat(0xf4f0e8, { noOutline: true }), 0, -0.01, 0.002); tadd(b, new THREE.BoxGeometry(0.06, 0.025, 0.025), tmat(0xb8b8c0), 0, 0.12, 0.004); },
  apron: (c, col = 0xf4ecdc) => { const m = tmat(col); tadd(c.body, new THREE.BoxGeometry(0.2, 0.36, 0.015), m, 0, c.waistY - 0.17, c.hipR * 0.92 + 0.03, -0.12); tadd(c.body, ST(c.waistR + 0.015, 0.01), m, 0, c.waistY, 0, Math.PI / 2); },
  sunhat: c => { const m = tmat(0xe8d49a); tadd(c.body, new THREE.CylinderGeometry(c.hr * 1.75, c.hr * 1.8, 0.02, 32), m, 0, c.hy + c.hr * 0.55, -0.02, -0.12); tadd(c.body, new THREE.CylinderGeometry(c.hr * 0.8, c.hr * 0.95, c.hr * 0.4, 24), m, 0, c.hy + c.hr * 0.75, -0.03, -0.12); tadd(c.body, ST(c.hr * 0.93, 0.012), tmat(0x8ab87a), 0, c.hy + c.hr * 0.6, -0.03, Math.PI / 2 - 0.12); },
  trowel: c => { if (c.hasWeapon) return; const t = inHand(c); t.rotation.set(0.3, 0, -0.2); tadd(t, SC(0.016, 0.08), tmat(0x6a4a2e)); tadd(t, new THREE.ConeGeometry(0.04, 0.12, 4), tmat(0xb8bcc4), 0, -0.11, 0, Math.PI); },
  hoops: c => { const m = tmat(0xf4d04a, { noOutline: true }); for (const sx of [-1, 1]) tadd(c.body, ST(0.045 * c.k, 0.007), m, sx * c.hr * 0.98, c.hy - 0.11 * c.k, 0.01, 0, Math.PI / 2); },
  streak: c => { tadd(c.body, SC(0.04 * c.k, c.hr * 0.45), tmat(0xd8d8e0), -c.hr * 0.36, c.hy + c.hr * 0.42, c.hr * 0.8, -0.5, 0, 0.35).scale.set(1, 1, 0.55); },
  sunglasses: c => { const m = tmat(0x1a1214); for (const sx of [-1, 1]) tadd(c.body, SS(0.06 * c.k, 14, 10), m, sx * c.hr * 0.3, c.hy + c.hr * 0.98, c.hr * 0.42, -1.1).scale.set(1.25, 0.8, 0.35); tadd(c.body, SC(0.007, 0.07 * c.k), tmat(0xd8b04a), 0, c.hy + c.hr * 1.0, c.hr * 0.46, 0, 0, Math.PI / 2); },
  bangles: c => { const m = tmat(0xd8b04a, { noOutline: true }); for (const arm of [c.arms.L, c.arms.R]) for (let i = 0; i < 2; i++) tadd(arm, ST(0.05, 0.007), m, 0, -c.armLen * (0.76 + i * 0.04), 0, Math.PI / 2); },
  candle: c => { if (c.hasWeapon) return; const t = inHand(c); tadd(t, new THREE.CylinderGeometry(0.02, 0.022, 0.13, 12), tmat(0x141018)); tadd(t, SS(0.016, 10, 8), tmat(0x8a4aff, { emissive: 0x6a2aff, ei: 2 }), 0, 0.09, 0).scale.set(0.8, 1.5, 0.8); },

  // --- holidays on the Lane ---
  santahat: (c, col = 0xd02a2a) => { const h = new THREE.Group(); h.position.set(0, c.hy + c.hr * 0.62, -0.02); h.rotation.set(-0.2, 0, 0.18); c.body.add(h); tadd(h, ST(c.hr * 0.95, 0.05), tmat(0xf4f4f0), 0, 0, 0, Math.PI / 2); tadd(h, new THREE.ConeGeometry(c.hr * 0.9, c.hr * 1.3, 24), tmat(col), 0, c.hr * 0.6, 0, 0, 0, -0.35); tadd(h, SS(0.05 * c.k, 12, 10), tmat(0xf4f4f0), c.hr * 0.42, c.hr * 1.15, 0); },
  antlers: (c, col = 0x8a5a2a) => { const m = tmat(col); tadd(c.body, ST(c.hr * 0.95, 0.012), tmat(0x2a2a2a), 0, c.hy + c.hr * 0.55, -0.02, Math.PI / 2 - 0.25); for (const sx of [-1, 1]) { const a = new THREE.Group(); a.position.set(sx * c.hr * 0.6, c.hy + c.hr * 0.85, 0); a.rotation.z = -sx * 0.35; c.body.add(a); tadd(a, SC(0.016, 0.16 * c.k), m, 0, 0.08 * c.k, 0); tadd(a, SC(0.013, 0.08 * c.k), m, sx * 0.04 * c.k, 0.1 * c.k, 0, 0, 0, -sx * 0.9); tadd(a, SC(0.013, 0.07 * c.k), m, -sx * 0.03 * c.k, 0.16 * c.k, 0, 0, 0, sx * 0.7); } },
  beanie: (c, col = 0xd02a2a) => { tadd(c.body, new THREE.SphereGeometry(c.hr * 1.12, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2.3), tmat(col), 0, c.hy + 0.04, -0.02, -0.1); tadd(c.body, ST(c.hr * 1.0, 0.035), tmat(darker(col)), 0, c.hy + c.hr * 0.48, -0.01, Math.PI / 2 - 0.1); tadd(c.body, SS(0.055 * c.k, 12, 10), tmat(0xf4f4f0), 0, c.hy + c.hr * 1.15, -0.05); },
  earmuffs: (c, col = 0xff8ab8) => { tadd(c.body, ST(c.hr * 1.02, 0.012), tmat(0x2a2a2a), 0, c.hy + 0.02, -0.01, 0, Math.PI / 2, 0); for (const sx of [-1, 1]) tadd(c.body, SS(0.075 * c.k, 14, 10), tmat(col), sx * c.hr * 1.02, c.hy - 0.02, 0).scale.set(0.6, 1, 1); },
  catears: (c, col = 0xf4ecd0) => { for (const sx of [-1, 1]) { tadd(c.body, new THREE.ConeGeometry(0.08 * c.k, 0.2 * c.k, 4), tmat(col), sx * c.hr * 0.62, c.hy + c.hr * 1.12, -0.02, 0, 0, -sx * 0.4); tadd(c.body, new THREE.ConeGeometry(0.045 * c.k, 0.12 * c.k, 4), tmat(0xff9ec6, { noOutline: true }), sx * c.hr * 0.6, c.hy + c.hr * 1.1, 0.03, 0, 0, -sx * 0.4); } },
  choker: (c, col = 0xf4f4ff) => { tadd(c.body, ST(0.055, 0.012), tmat(0x1a1214), 0, c.shoulderY + 0.07, 0, Math.PI / 2); tadd(c.body, SS(0.018, 10, 8), tmat(col, { emissive: col, ei: 0.6 }), 0, c.shoulderY + 0.05, 0.06); },
  fangs: c => { for (const sx of [-1, 1]) tadd(c.body, new THREE.ConeGeometry(0.008, 0.022, 6), tmat(0xffffff, { noOutline: true }), sx * 0.022, c.hy - c.hr * 0.45, c.hr * 0.93, Math.PI); },
  plume: (c, col = 0xff6ab8) => { const m = tmat(col); for (let i = 0; i < 3; i++) tadd(c.body, SS(0.04 * c.k, 10, 8), m, c.hr * 0.55 + i * 0.015, c.hy + c.hr * (0.75 + i * 0.22), -0.02, 0, 0, -0.4).scale.set(0.5, 1.6, 0.4); },
  leaves: (c, col = 0x5a9a4a) => { const m = tmat(col); for (let i = 0; i < 9; i++) { const a = -1.4 + (i / 8) * 2.8; tadd(c.body, SS(0.03 * c.k, 8, 6), m, Math.sin(a) * c.hr * 0.95, c.hy + c.hr * 0.6, Math.cos(a) * c.hr * 0.75, 0, a, 0.6).scale.set(1.6, 0.5, 0.9); } for (let i = 0; i < 6; i++) tadd(c.body, SS(0.028, 8, 6), m, (i % 2 ? 1 : -1) * (c.waistR + 0.02), c.waistY - 0.02 + i * 0.07, 0.06, 0, 0, i).scale.set(1.5, 0.5, 0.9); },
  swan: (c, col = 0x141018) => { const m = tmat(col); for (const sx of [-1, 1]) { const w = new THREE.Group(); w.position.set(sx * 0.1, c.shoulderY - 0.06, -0.12); w.rotation.set(0.2, -sx * 0.5, -sx * 0.35); c.body.add(w); for (let i = 0; i < 4; i++) tadd(w, SS(0.05, 10, 8), m, sx * (0.06 + i * 0.05), -i * 0.06, 0).scale.set(1.8, 0.5, 0.3); } tadd(c.body, SS(0.04 * c.k, 10, 8), m, -c.hr * 0.55, c.hy + c.hr * 0.6, 0.05, 0, 0, 0.5).scale.set(0.6, 1.4, 0.4); },
  candycane: c => { if (c.hasWeapon) return; const g = inHand(c); const r = tmat(0xd02a2a), w = tmat(0xf4f4f0); for (let i = 0; i < 6; i++) tadd(g, new THREE.CylinderGeometry(0.014, 0.014, 0.04, 8), i % 2 ? r : w, 0, -0.04 - i * 0.04, 0); tadd(g, new THREE.TorusGeometry(0.035, 0.014, 8, 12, Math.PI), r, 0.035, 0.0, 0); },
  parasol: (c, col = 0x141018) => { if (c.hasWeapon) return; const g = inHand(c, 'L'); tadd(g, new THREE.CylinderGeometry(0.008, 0.008, 0.62, 8), tmat(0x2a2a2a), 0, 0.28, 0); const m = tmat(col); m.side = THREE.DoubleSide; tadd(g, new THREE.ConeGeometry(0.3, 0.12, 12, 1, true), m, 0, 0.58, 0); },
  basket: c => { if (c.hasWeapon) return; const g = inHand(c, 'L'); tadd(g, new THREE.CylinderGeometry(0.08, 0.06, 0.07, 14), tmat(0xa8804a), 0, -0.04, 0.04); for (let i = 0; i < 5; i++) tadd(g, SS(0.022, 8, 6), tmat(0xe02a3a), Math.cos(i * 1.3) * 0.04, 0.0, 0.04 + Math.sin(i * 1.3) * 0.04); tadd(g, new THREE.TorusGeometry(0.07, 0.006, 6, 12, Math.PI), tmat(0x8a6a3a), 0, 0.0, 0.04, 0, Math.PI / 2, 0); },
  wreath: c => { for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; tadd(c.body, SS(0.014, 8, 6), tmat(i % 3 ? 0x2a7a3a : 0xd02a2a, { noOutline: true }), Math.cos(a) * 0.035, c.bustY - 0.17 + Math.sin(a) * 0.035, c.waistR + 0.07); } },

  // --- weapons and tools (held) ---
  sword: (c, col = 0xdde4ea) => { if (c.hasWeapon) return; const g = inHand(c); g.rotation.z = -0.3; tadd(g, new THREE.BoxGeometry(0.035, 0.5, 0.012), tmat(col), 0, -0.3, 0); tadd(g, new THREE.ConeGeometry(0.025, 0.06, 4), tmat(col), 0, -0.58, 0, Math.PI); tadd(g, new THREE.BoxGeometry(0.14, 0.025, 0.03), tmat(0xc8a050), 0, -0.04, 0); tadd(g, SC(0.016, 0.07), tmat(0x4a3424), 0, 0.03, 0); },
  staff: (c, col = 0xb06cff) => { if (c.hasWeapon) return; const g = inHand(c); tadd(g, new THREE.CylinderGeometry(0.014, 0.018, 0.95, 10), tmat(0x6a4a2e), 0, 0.1, 0); tadd(g, SS(0.04, 14, 10), glow(col), 0, 0.6, 0); tadd(g, ST(0.045, 0.008), tmat(0xc8a050), 0, 0.6, 0, Math.PI / 2); },
  book: (c, col = 0x2a1f3e) => { const g = inHand(c, 'L'); g.rotation.set(0.2, 0.5, 0); tadd(g, new THREE.BoxGeometry(0.2, 0.26, 0.06), tmat(col)); tadd(g, new THREE.BoxGeometry(0.18, 0.24, 0.065), tmat(0xe8e0d0, { noOutline: true }), -0.006, 0, 0); },
  shield: (c, col = 0xc4ced8) => { const s = tadd(c.arms.L, new THREE.CylinderGeometry(0.14, 0.14, 0.025, 24), tmat(col), 0.04, -c.armLen * 0.7, 0.08, Math.PI / 2); s.rotation.z = 0.15; tadd(c.arms.L, ST(0.14, 0.012), tmat(0xc8a050), 0.04, -c.armLen * 0.7, 0.095); },
  mug: c => { if (c.hasWeapon) return; const g = inHand(c); tadd(g, new THREE.CylinderGeometry(0.035, 0.035, 0.08, 14), tmat(0xc8a050)); tadd(g, SS(0.03, 10, 8), tmat(0xf4efe6), 0, 0.04, 0).scale.set(1, 0.4, 1); },
  bottle: c => { if (c.hasWeapon) return; const g = inHand(c); tadd(g, new THREE.CylinderGeometry(0.025, 0.032, 0.12, 12), tmat(0x3a6a3a)); tadd(g, SC(0.01, 0.04), tmat(0x6a4a2a), 0, 0.08, 0); },
  ladle: c => { if (c.hasWeapon) return; const g = inHand(c); tadd(g, new THREE.CylinderGeometry(0.008, 0.008, 0.36, 8), tmat(0x6a4a2a), 0, -0.1, 0); tadd(g, new THREE.SphereGeometry(0.045, 12, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), tmat(0x9a9aa2), 0, -0.28, 0); },
  fan: (c, col = 0xd8b04a) => { const g = inHand(c, 'L'); const m = tmat(col, { noOutline: true }); m.side = THREE.DoubleSide; tadd(g, new THREE.CircleGeometry(0.13, 16, 0, Math.PI), m, 0, 0.02, 0.02); },
  satchel: (c, col = 0x8a6d3a) => { tadd(c.body, new THREE.BoxGeometry(0.13, 0.11, 0.06), tmat(col), -c.hipR * 0.9, c.hipY + 0.02, 0.06, 0, 0, 0.1); tadd(c.body, ST(0.2, 0.008), tmat(darker(col)), -0.02, c.waistY + 0.12, 0, Math.PI / 2 - 0.2, 0.6, 0); },

  // --- headwear and hair ---
  witchhat: (c, col = 0xf4efe6) => { const m = tmat(col); const h = new THREE.Group(); h.position.set(0, c.hy + c.hr * 0.72, -0.02); h.rotation.x = -0.15; c.body.add(h); tadd(h, new THREE.CylinderGeometry(c.hr * 1.65, c.hr * 1.65, 0.02, 32), m); tadd(h, new THREE.ConeGeometry(c.hr * 0.75, c.hr * 1.5, 24), m, 0, c.hr * 0.75, 0); tadd(h, ST(c.hr * 0.75, 0.014), tmat(0xd9b96a), 0, 0.02, 0, Math.PI / 2); },
  flowercrown: c => { for (let i = 0; i < 9; i++) { const a = -1.4 + (i / 8) * 2.8; tadd(c.body, SS(0.036 * c.k, 10, 8), tmat([0xff9ec6, 0xfff4f8, 0xf4d04a][i % 3], { noOutline: true }), Math.sin(a) * c.hr * 0.95, c.hy + c.hr * 0.7, Math.cos(a) * c.hr * 0.8); } },
  ribbon: (c, col = 0xff9ec6) => { const m = tmat(col); for (const sx of [-1, 1]) tadd(c.body, SS(0.035 * c.k, 12, 8), m, -c.hr * 0.62 + sx * 0.035, c.hy + c.hr * 0.62, c.hr * 0.25, 0, 0, sx * 0.6).scale.set(1.4, 0.7, 0.4); },
  headdress: (c, col = 0xf2f0ea) => { tadd(c.body, ST(c.hr * 0.72, 0.022), tmat(col), 0, c.hy + c.hr * 0.66, -0.01, Math.PI / 2 - 0.35); for (const sx of [-1, 1]) tadd(c.body, SC(0.016, 0.12), tmat(0x15121e), sx * c.hr * 0.55, c.hy + c.hr * 0.85, -0.05, 0, 0, -sx * 0.5); },
  flower: (c, col = 0xffd0e0) => { tadd(c.body, SS(0.028 * c.k, 10, 8), tmat(col, { noOutline: true }), c.hr * 0.62, c.hy + c.hr * 0.45, c.hr * 0.55); tadd(c.body, SS(0.012 * c.k, 8, 6), tmat(0xf4d04a, { noOutline: true }), c.hr * 0.64, c.hy + c.hr * 0.46, c.hr * 0.6); },
  veil: (c, col = 0xf4f0f8) => { const m = tmat(col, { noOutline: true }); m.transparent = true; m.opacity = 0.45; m.side = THREE.DoubleSide; tadd(c.body, new THREE.CylinderGeometry(c.hr * 0.9, c.hipR * 1.5, c.hy - c.hipY, 24, 1, true, Math.PI / 2 + 0.6, Math.PI - 1.2), m, 0, (c.hy + c.hipY) / 2, -0.06); tadd(c.body, ST(c.hr * 0.75, 0.012), tmat(0xd8d8e8), 0, c.hy + c.hr * 0.6, -0.02, Math.PI / 2 - 0.3); },
  wimple: (c, col = 0xf4f0e8) => { const m = tmat(col); tadd(c.body, new THREE.SphereGeometry(c.hr * 1.2, 32, 22, Math.PI / 2 + 0.75, Math.PI * 2 - 1.5), m, 0, c.hy + 0.02, -0.02); tadd(c.body, new THREE.CylinderGeometry(c.hr * 0.7, c.hr * 0.95, c.hr * 0.6, 24, 1, true), m, 0, c.hy - c.hr * 0.95, 0); },
  helm: (c, col = 0x9aa2ac) => { const m = tmat(col); tadd(c.body, new THREE.SphereGeometry(c.hr * 1.16, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2.4), m, 0, c.hy + 0.06, -0.01); tadd(c.body, ST(c.hr * 1.08, 0.02), tmat(0xc8a050), 0, c.hy + c.hr * 0.42, -0.01, Math.PI / 2 - 0.2); },
  halo: c => { tadd(c.body, ST(c.hr * 0.6, 0.014), glow(0xffe28a), 0, c.hy + c.hr * 1.35, -0.02, Math.PI / 2 - 0.2); },
  crowncirclet: (c, col = 0xd9b96a) => { tadd(c.body, ST(c.hr * 0.68, 0.014), tmat(col), 0, c.hy + c.hr * 0.66, 0, Math.PI / 2 - 0.3); tadd(c.body, SS(0.02 * c.k, 10, 8), glow(0xd84a6a), 0, c.hy + c.hr * 0.58, c.hr * 0.72); },
  elf: c => { const m = tmat(c.C.skin, { soft: true }); for (const sx of [-1, 1]) tadd(c.body, new THREE.ConeGeometry(0.03 * c.k, 0.16 * c.k, 10), m, sx * c.hr * 0.98, c.hy + 0.02, -0.01, 0, 0, -sx * 1.15).scale.set(1, 1, 0.45); },
  beard: c => { tadd(c.body, SS(c.hr * 0.55, 16, 12), tmat(c.C.hair), 0, c.hy - c.hr * 0.62, c.hr * 0.52).scale.set(1, 0.6, 0.5); },
  scar: (c, col = 0xc86a4a) => { tadd(c.body, SC(0.006, 0.05 * c.k), tmat(col, { noOutline: true }), c.hr * 0.4, c.hy - c.hr * 0.2, c.hr * 0.93, 0, 0.4, 0.6); },
  horns: (c, col = 0x2a1a24) => { const m = tmat(col); for (const sx of [-1, 1]) { const h = new THREE.Group(); h.position.set(sx * c.hr * 0.45, c.hy + c.hr * 0.78, 0); h.rotation.z = -sx * 0.4; c.body.add(h); tadd(h, new THREE.ConeGeometry(0.04 * c.k, 0.22 * c.k, 14), m, 0, 0.1 * c.k, 0, -0.3); } },

  // --- costume pieces ---
  scarf: (c, col = 0x3d6ec2) => { const m = tmat(col); tadd(c.body, ST(0.09, 0.03), m, 0, c.shoulderY + 0.03, 0, Math.PI / 2); tadd(c.body, new THREE.BoxGeometry(0.08, 0.38, 0.02), m, -0.06, c.shoulderY - 0.18, -0.12, 0.2, 0, 0.1); },
  collarglow: (c, col = 0x8a6ad8) => { tadd(c.body, ST(0.1, 0.012), glow(col), 0, c.shoulderY + 0.02, 0, Math.PI / 2); },
  belt: (c, col = 0x5a4632) => { tadd(c.body, ST(c.waistR + 0.02, 0.02), tmat(col), 0, c.waistY - 0.07, 0, Math.PI / 2); tadd(c.body, new THREE.BoxGeometry(0.04, 0.03, 0.01), tmat(0xc8a050), 0, c.waistY - 0.07, c.waistR + 0.03); },
  pauldron: (c, col = 0x9aa2ac) => { tadd(c.arms.L, SS(0.085), tmat(col), 0, 0, 0).scale.set(1.15, 0.8, 1.05); },
  wisps: c => { const m = tmat(0x6a5ab8, { emissive: 0x4a3a98, ei: 0.8, noOutline: true }); m.transparent = true; m.opacity = 0.6; for (const [x, y, z, r] of [[-0.4, c.hy - 0.1, -0.08, 0.05], [0.42, c.waistY + 0.1, -0.1, 0.04], [0.15, c.hy + c.hr * 1.2, -0.1, 0.035]]) tadd(c.body, SS(r, 12, 8), m, x, y, z); },
  shadowhem: c => { const m = tmat(0x241f38, { noOutline: true }); m.transparent = true; m.opacity = 0.55; m.side = THREE.DoubleSide; tadd(c.body, new THREE.CylinderGeometry(c.hipR * 1.1, c.hipR * 1.9, c.hipY, 24, 1, true), m, 0, c.hipY / 2 + 0.02, 0); },
  tail: (c, col = 0x8a2a2a) => { const t = new THREE.Group(); t.position.set(0, c.hipY + 0.02, -c.hipR * 0.9); t.rotation.x = 0.7; c.body.add(t); const m = tmat(col); tadd(t, SC(0.02, 0.36), m, 0, -0.18, 0); tadd(t, new THREE.ConeGeometry(0.05, 0.08, 3), m, 0, -0.4, 0, Math.PI); },
};
function darker(hex) { return new THREE.Color(hex).multiplyScalar(0.7).getHex(); }

// "sword:0xdde4ea,witchhat" → run each accessory
export function applyAccessories(c, list) {
  for (const raw of list) {
    const [n, arg] = raw.trim().split(':');
    const fn = ACCESSORIES[n];
    if (fn) arg ? fn(c, Number(arg)) : fn(c);
  }
}
