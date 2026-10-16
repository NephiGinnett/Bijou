// ============================================================
// Larkspur Lane, walkable: the cul-de-sac in the fen. Six houses
// round the circle with their shop signs and mailboxes, each woman
// out on her front walk in today's outfit, and the street dressed
// for the season (and for the Wives' Circle's party when it's on).
// ============================================================
import * as THREE from 'three';

const M = {};
const mat = (key, color, o = {}) => (M[key] ||= new THREE.MeshStandardMaterial({ color, roughness: 0.85, ...o }));
const glow = (key, color) => (M[key] ||= new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.4 }));
function box(w, h, d, m, x, y, z, p) { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); p.add(o); return o; }
function cyl(rt, rb, h, m, x, y, z, p, seg = 12) { const o = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m); o.position.set(x, y, z); p.add(o); return o; }
function ball(r, m, x, y, z, p, seg = 10) { const o = new THREE.Mesh(new THREE.SphereGeometry(r, seg, seg * 0.75), m); o.position.set(x, y, z); p.add(o); return o; }

// The houses, in order round the circle. Celeste's is the biggest house on the Lane.
const HOUSES = {
  victoria: { wall: 0xe8e4dc, roof: 0x2a3a5a, trim: 0x1e2a44, sign: 'THE LEDGER HOUSE', w: 2.8 },
  joanne:   { wall: 0xf0d878, roof: 0x7a4a2a, trim: 0xf4ecdc, sign: 'THE KETTLE & CROWN', w: 3.0 },
  diane:    { wall: 0xa8c890, roof: 0x5a6a3a, trim: 0xf4ecdc, sign: "DIANE'S GARDEN", w: 2.6, greenhouse: true },
  margot:   { wall: 0xff8ac8, roof: 0x2a2a2a, trim: 0xf4d04a, sign: 'SWAP & SELL', w: 2.6 },
  moira:    { wall: 0x2a2430, roof: 0x141018, trim: 0x8a4aff, sign: 'THE BLACK CANDLE', w: 2.6 },
  celeste:  { wall: 0xf6f2ea, roof: 0x8a8a92, trim: 0xd8b04a, sign: null, w: 3.6 },
};
export const LANE_ORDER = ['victoria', 'joanne', 'diane', 'margot', 'moira', 'celeste'];
const CENTER = new THREE.Vector3(0, 0, -6), R_HOUSE = 8.2, R_WOMAN = 5.6;
const angleOf = i => (-62 + i * (124 / 5)) * Math.PI / 180;
const around = (a, r) => new THREE.Vector3(CENTER.x + Math.sin(a) * r, 0, CENTER.z - Math.cos(a) * r);

function signTexture(text, fg, bg) {
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 64;
  const x = cv.getContext('2d');
  x.fillStyle = bg; x.fillRect(0, 0, 256, 64); x.strokeStyle = fg; x.lineWidth = 4; x.strokeRect(4, 4, 248, 56);
  x.fillStyle = fg; x.font = 'bold 22px Georgia, serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, 128, 33);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function house(g, id, H, season, fest) {
  const w = H.w, d = 2.4, h = id === 'celeste' ? 2.9 : 2.4;
  const wall = mat('wall_' + id, H.wall), roof = mat('roof_' + id, H.roof), trim = mat('trim_' + id, H.trim);
  box(w, h, d, wall, 0, h / 2, 0, g);
  const r = new THREE.Mesh(new THREE.ConeGeometry(Math.hypot(w, d) / 2 + 0.15, 1.3, 4), roof);
  r.position.set(0, h + 0.62, 0); r.rotation.y = Math.PI / 4; r.scale.set(1, 1, d / w); g.add(r);
  if (season === 'winter') { const sn = new THREE.Mesh(new THREE.ConeGeometry(Math.hypot(w, d) / 2 + 0.1, 0.5, 4), mat('snow', 0xf4f8ff)); sn.position.set(0, h + 1.1, 0); sn.rotation.y = Math.PI / 4; sn.scale.set(1, 1, d / w); g.add(sn); }
  // door, windows lit for the evening, a porch step
  box(0.55, 1.1, 0.06, trim, 0, 0.55, d / 2 + 0.01, g);
  for (const sx of [-1, 1]) { box(0.55, 0.5, 0.05, glow('window', 0xffd88a), sx * w * 0.3, h * 0.6, d / 2 + 0.01, g); box(0.62, 0.06, 0.07, trim, sx * w * 0.3, h * 0.6 - 0.28, d / 2 + 0.02, g); }
  box(1.0, 0.12, 0.5, mat('step', 0x9a948a), 0, 0.06, d / 2 + 0.25, g);
  if (H.sign) { const s = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.38), new THREE.MeshBasicMaterial({ map: signTexture(H.sign, '#' + H.trim.toString(16).padStart(6, '0'), id === 'moira' ? '#141018' : '#f4ecdc') })); s.position.set(0, h - 0.18, d / 2 + 0.04); g.add(s); }
  if (H.greenhouse) { const gm = mat('glass', 0xa8e8d8, { transparent: true, opacity: 0.45, emissive: 0x4a9a7a, emissiveIntensity: 0.4 }); box(1.6, 1.4, 1.6, gm, w / 2 + 1.0, 0.7, 0, g); }
  // mailbox at the end of the walk
  cyl(0.04, 0.04, 0.9, mat('post', 0x6a5a4a), 0.9, 0.45, d / 2 + 1.6, g, 6);
  box(0.22, 0.2, 0.36, trim, 0.9, 0.98, d / 2 + 1.6, g);
  // the season on the porch
  if (season === 'spring') for (let i = 0; i < 6; i++) ball(0.09, mat('bloom' + (i % 3), [0xff9ec6, 0xfff4a0, 0xc8a8ff][i % 3]), -w / 2 + 0.3 + i * (w - 0.6) / 5, 0.12, d / 2 + 0.55, g);
  if (season === 'summer') { cyl(0.18, 0.14, 0.3, mat('planter', 0xd8a86a), w / 2 - 0.3, 0.15, d / 2 + 0.4, g); ball(0.22, mat('fern', 0x4a9a3a), w / 2 - 0.3, 0.42, d / 2 + 0.4, g); }
  if (season === 'autumn' || fest === 'hallows') for (let i = 0; i < (fest === 'hallows' ? 3 : 2); i++) {
    const p = ball(0.17 - i * 0.03, fest === 'hallows' ? glow('jack', 0xff8a2a) : mat('pumpkin', 0xd8782a), -0.55 - i * 0.32, 0.15, d / 2 + 0.45, g, 12); p.scale.y = 0.8;
  }
  if (season === 'winter') for (let i = 0; i < 9; i++) ball(0.045, glow('light' + (i % 4), [0xff4a4a, 0x4aff6a, 0xffd84a, 0x4a8aff][i % 4]), -w / 2 + i * w / 8, h - 0.03, d / 2 + 0.06, g, 6);
}

export async function buildLane(stage, S, opts) {
  const { season, women, variantOf, player } = opts;
  const fest = season.festOn ? opts.festKey : null;
  stage.clearActors();
  stage.envGroup.clear(); stage.dust = null;
  const sky = { spring: 0x2a2a44, summer: 0x2a3050, autumn: 0x2a1e24, winter: 0x1e2434 }[season.id];
  stage.scene.background = new THREE.Color(sky);
  stage.scene.fog = new THREE.FogExp2(sky, 0.03);
  stage.tintLight.color.set({ spring: 0xd8b8ff, summer: 0xffd8a0, autumn: 0xff9a5a, winter: 0xa8c8ff }[season.id]);
  const E = stage.envGroup;
  const grass = { spring: 0x4a7a3a, summer: 0x5a8a3a, autumn: 0x6a5a2a, winter: 0xe8eef4 }[season.id];
  const ground = new THREE.Mesh(new THREE.CircleGeometry(30, 48), mat('ground_' + season.id, grass)); ground.rotation.x = -Math.PI / 2; E.add(ground);
  // the road: a turning circle and the street out of it
  const road = mat('road', season.id === 'winter' ? 0x9aa0a8 : 0x3a3a40);
  const ring = new THREE.Mesh(new THREE.CircleGeometry(4.2, 40), road); ring.rotation.x = -Math.PI / 2; ring.position.set(CENTER.x, 0.01, CENTER.z); E.add(ring);
  const island = new THREE.Mesh(new THREE.CircleGeometry(1.4, 24), mat('island_' + season.id, grass)); island.rotation.x = -Math.PI / 2; island.position.set(CENTER.x, 0.02, CENTER.z); E.add(island);
  box(3.2, 0.02, 9, road, 0, 0.005, 1.5, E);
  // reeds and fen-water at the edges, where the street runs out
  for (let i = 0; i < 70; i++) { const a = Math.random() * Math.PI * 2, r = 13 + Math.random() * 7; cyl(0.03, 0.04, 0.8 + Math.random() * 0.8, mat('reed', season.id === 'winter' ? 0x8a8a7a : 0x6a7a3a), CENTER.x + Math.sin(a) * r, 0.5, CENTER.z + Math.cos(a) * r, E, 5); }
  // street lamps
  const flick = [];
  for (const [x, z] of [[-2.2, 2.5], [2.2, -1.5], [-4.5, -9], [4.5, -9]]) { cyl(0.05, 0.06, 3, mat('lamp', 0x2a2a2a), x, 1.5, z, E, 6); ball(0.16, glow('lampglow', 0xffe0a0), x, 3.05, z, E); const L = new THREE.PointLight(0xffd8a0, 10, 9); L.position.set(x, 2.9, z); E.add(L); }

  // the houses
  LANE_ORDER.forEach((id, i) => {
    const a = angleOf(i), p = around(a, R_HOUSE);
    const g = new THREE.Group(); g.position.copy(p); g.rotation.y = -a; E.add(g); // front door to the street
    house(g, id, HOUSES[id], season.id, fest);
  });

  // the Wives' Circle's party, in the middle of the turning circle
  if (fest === 'may_day') {
    cyl(0.08, 0.1, 4, mat('pole', 0xf4ecdc), CENTER.x, 2, CENTER.z, E, 10);
    ball(0.3, mat('crown', 0xfff4f8), CENTER.x, 4.05, CENTER.z, E);
    [0xff9ec6, 0xfff4a0, 0xa8d8ff, 0xc8a8ff, 0xa8e8a8, 0xffb88a].forEach((c, k) => { const a = k / 6 * Math.PI * 2; const rb = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 3.4, 4), mat('ribbon' + k, c)); rb.position.set(CENTER.x + Math.sin(a) * 1.0, 2.2, CENTER.z + Math.cos(a) * 1.0); rb.rotation.set(Math.cos(a) * 0.32, 0, -Math.sin(a) * 0.32); E.add(rb); });
  } else if (fest === 'cookout') {
    const pool = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.28, 10, 24), mat('flamingo', 0xff6ab8)); pool.rotation.x = Math.PI / 2; pool.position.set(CENTER.x, 0.28, CENTER.z); E.add(pool);
    const water = new THREE.Mesh(new THREE.CircleGeometry(0.85, 24), glow('water', 0x6ad8e8)); water.rotation.x = -Math.PI / 2; water.position.set(CENTER.x, 0.2, CENTER.z); E.add(water);
    for (const sx of [-1, 1]) { box(0.7, 0.5, 0.4, mat('grill', 0x2a2a2a), CENTER.x + sx * 2.6, 0.75, CENTER.z + 1.8, E); for (let k = 0; k < 3; k++) cyl(0.03, 0.03, 0.5, mat('grill', 0x2a2a2a), CENTER.x + sx * 2.6 + (k - 1) * 0.25, 0.25, CENTER.z + 1.8, E, 5); }
  } else if (fest === 'hallows') {
    for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; const p = ball(0.25, glow('jack', 0xff8a2a), CENTER.x + Math.sin(a) * 1.15, 0.22, CENTER.z + Math.cos(a) * 1.15, E, 12); p.scale.y = 0.8; }
  } else if (fest === 'yule') {
    for (let k = 0; k < 4; k++) { const c = new THREE.Mesh(new THREE.ConeGeometry(1.2 - k * 0.25, 1.2, 12), mat('fir', 0x1e5a2e)); c.position.set(CENTER.x, 0.9 + k * 0.75, CENTER.z); E.add(c); }
    ball(0.18, glow('star', 0xffe060), CENTER.x, 4.0, CENTER.z, E);
    for (let k = 0; k < 24; k++) { const a = k * 1.1, y = 0.6 + (k / 24) * 3, r = 1.15 * (1 - (y - 0.4) / 3.6); ball(0.06, glow('light' + (k % 4), [0xff4a4a, 0x4aff6a, 0xffd84a, 0x4a8aff][k % 4]), CENTER.x + Math.sin(a) * r, y, CENTER.z + Math.cos(a) * r, E, 6); }
    // Brad's twelve-foot inflatable Santa, of course
    const p = around(angleOf(5), R_HOUSE - 2.4);
    const santa = ball(0.75, mat('santa', 0xd02a2a), p.x + 1.4, 1.1, p.z, E, 14); santa.scale.y = 1.4; ball(0.45, mat('santaface', 0xf4d8c0), p.x + 1.4, 2.4, p.z, E, 12);
  }
  // falling snow in winter, drifting petals in spring, leaves in autumn
  const drift = { winter: [0xffffff, 0.08], spring: [0xffc0e0, 0.06], autumn: [0xd87a2a, 0.07] }[season.id];
  if (drift) {
    const n = 260, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - 0.5) * 30; pos[i * 3 + 1] = Math.random() * 10; pos[i * 3 + 2] = -6 + (Math.random() - 0.5) * 30; }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: drift[0], size: drift[1], transparent: true, opacity: 0.85 })); E.add(pts);
    stage.hooks.add((dt, t) => { const p = geo.attributes.position; for (let i = 0; i < p.count; i++) { let y = p.getY(i) - dt * 0.6; if (y < 0) y = 10; p.setY(i, y); p.setX(i, p.getX(i) + Math.sin(t + i) * dt * 0.15); } p.needsUpdate = true; });
  }

  // the women, out on their front walks, and Zoe at the top of the street
  const people = women.map(id => {
    const i = LANE_ORDER.indexOf(id), a = angleOf(i), p = around(a, R_WOMAN + (id === 'celeste' ? 0.4 : 0));
    const act = stage.addActor('lane_' + id, id, variantOf(id), { x: p.x, z: p.z, face: -a });
    return { id, a, home: p, act };
  });
  const zoe = stage.addActor('lz_player', player.model, player.variant, { x: 0, z: 4.5, face: Math.PI });
  await Promise.all([zoe.ready, ...people.map(p => p.act.ready)]);
  for (const p of people) p.act.topY = new THREE.Box3().setFromObject(p.act.group).max.y;

  // walking
  let goal = null;
  stage.hooks.add(dt => {
    if (!goal) return;
    const dx = goal.x - zoe.home.x, dz = goal.z - zoe.home.z, d = Math.hypot(dx, dz);
    if (d < 0.05) { zoe.face = goal.face; const r = goal.done; goal = null; r && r(); return; }
    const s = Math.min(d, 2.4 * dt); zoe.home.x += dx / d * s; zoe.home.z += dz / d * s; zoe.face = Math.atan2(dx, dz);
  });
  const walk = (x, z, face) => new Promise(done => { goal = { x, z, face, done }; });

  const overview = () => stage.focus(new THREE.Vector3(0, 7.5, 8.5), new THREE.Vector3(0, 0.8, -5.2), 9);
  stage.orbitEnabled = true; stage.resetView();
  stage.camBase.set(0, 7.5, 8.5); stage.camTarget.set(0, 0.8, -5.2); stage.viewHalfW = 9;

  async function visit(id) {
    const p = people.find(x => x.id === id); if (!p) return;
    // Zoe stops on the street in front of her, a little to one side
    const toward = CENTER.clone().sub(p.home).normalize();
    const stand = p.home.clone().add(toward.clone().multiplyScalar(1.7)).add(new THREE.Vector3(-toward.z, 0, toward.x).multiplyScalar(0.7));
    const camAt = p.home.clone().add(toward.clone().multiplyScalar(4.2)).add(new THREE.Vector3(toward.z, 0, -toward.x).multiplyScalar(0.8));
    stage.resetView();
    stage.focus(new THREE.Vector3(camAt.x, 2.4, camAt.z), new THREE.Vector3(p.home.x, 1.5, p.home.z), 2.2, 1000);
    await walk(stand.x, stand.z, Math.atan2(p.home.x - stand.x, p.home.z - stand.z));
    const rig = p.act.group.children[0] && p.act.group.children[0].userData.rig;
    if (rig) { rig.wave(); rig.talk(1.2); }
  }
  return { people, visit, overview, back: () => { walk(0, 4.5, Math.PI); return overview(); } };
}
