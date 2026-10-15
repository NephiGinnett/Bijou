// ============================================================
// GATEBOUND — 3D stage: arena, actor placement, combat
// animation, particles, damage numbers, portrait snapshots.
// ============================================================

import * as THREE from 'three';
import { buildActor } from './actors3d.js';
import { BIOMES } from './data.js';

const FAST = () => (window.__FAST ? 0.3 : 1);
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export class Stage {
  constructor(canvas, overlay) {
    this.canvas = canvas;
    this.overlay = overlay;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, 16 / 9, 0.1, 100);
    this.camBase = new THREE.Vector3(0, 5.0, 10.4);
    this.camTarget = new THREE.Vector3(0, 1.0, 0);
    this.camera.position.copy(this.camBase);
    this.shake = 0;

    // --- camera framing + player-controlled orbit ---
    this.baseFov = 42;         // design vertical FOV (widened on narrow screens)
    this.viewHalfW = 5.6;      // horizontal half-extent we always keep in frame
    this.fitZoom = 1;          // auto pull-back so the sides fit on tall screens
    this.aimBiasY = 0;         // vertical pan so actors clear the bottom HUD on mobile
    this.userYaw = 0;          // drag / button orbit around the target
    this.userPitch = 0;
    this.userZoom = 1;         // pinch / wheel / button zoom
    this.orbitEnabled = false;
    this._scratch = new THREE.Vector3();
    this._look = new THREE.Vector3();

    this.hemi = new THREE.HemisphereLight(0x8fa3c8, 0x1a1c26, 1.05);
    this.scene.add(this.hemi);
    this.key = new THREE.DirectionalLight(0xffe8c8, 1.4);
    this.key.position.set(-4, 7, 5);
    this.scene.add(this.key);
    this.tintLight = new THREE.PointLight(0x8899ff, 12, 30);
    this.tintLight.position.set(0, 4, -3);
    this.scene.add(this.tintLight);
    this.flash = new THREE.PointLight(0xffffff, 0, 20);
    this.flash.position.set(0, 2.5, 1);
    this.scene.add(this.flash);

    this.envGroup = new THREE.Group();
    this.scene.add(this.envGroup);
    this.actorGroup = new THREE.Group();
    this.scene.add(this.actorGroup);
    this.fxGroup = new THREE.Group();
    this.scene.add(this.fxGroup);

    this.actors = new Map();
    this.tweens = [];
    this.bursts = [];
    this.t = 0;
    this.running = false;
    this.turnRing = this.makeTurnRing();
    this.scene.add(this.turnRing);

    this.hooks = new Set();     // per-frame callbacks for the Undercroft / pens views
    this.onPick = null;         // (uid) => void: a tap (not a drag) on an actor
    this._ray = new THREE.Raycaster();

    this.resize();
    addEventListener('resize', () => this.resize());
    this._initOrbitInput();
    this._initPick();
  }

  resize() {
    const w = this.canvas.clientWidth || this.canvas.parentElement?.clientWidth || innerWidth;
    const h = this.canvas.clientHeight || this.canvas.parentElement?.clientHeight || innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  // ---------- camera orbit / zoom input ----------

  _zoomMul(f) { this.userZoom = Math.max(0.55, Math.min(1.7, this.userZoom * f)); }
  // public — called by the on-screen battle buttons
  nudgeYaw(d) { this.orbitEnabled = true; this.userYaw += d; }
  nudgeZoom(f) { this.orbitEnabled = true; this._zoomMul(f); }
  resetView() { this.userYaw = 0; this.userPitch = 0; this.userZoom = 1; }

  // A tap that didn't drag picks the actor under it.
  _initPick() {
    const c = this.canvas;
    if (!c) return;
    let down = null;
    c.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY }; });
    c.addEventListener('pointerup', e => {
      if (!down || !this.onPick) return;
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y); down = null;
      if (moved > 8) return;
      const r = c.getBoundingClientRect();
      const ndc = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      this._ray.setFromCamera(ndc, this.camera);
      const hits = this._ray.intersectObjects(this.actorGroup.children, true);
      for (const h of hits) {
        let o = h.object;
        while (o && o.parent !== this.actorGroup) o = o.parent;
        if (!o) continue;
        for (const [uid, a] of this.actors) if (a.group === o) { this.onPick(uid); return; }
      }
    });
  }
  // Glide the camera to a new framing.
  focus(base, target, halfW = this.viewHalfW, ms = 650) {
    const b0 = this.camBase.clone(), t0 = this.camTarget.clone(), w0 = this.viewHalfW;
    return this.tween(ms, p => {
      this.camBase.lerpVectors(b0, base, p);
      this.camTarget.lerpVectors(t0, target, p);
      this.viewHalfW = w0 + (halfW - w0) * p;
    });
  }

  _initOrbitInput() {
    const c = this.canvas;
    if (!c) return;
    c.style.touchAction = 'none';
    const pts = new Map();
    let lx = 0, ly = 0, pinch = 0;
    const spread = () => { const v = [...pts.values()]; return Math.hypot(v[0].x - v[1].x, v[0].y - v[1].y); };
    c.addEventListener('pointerdown', e => {
      if (!this.orbitEnabled) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      try { c.setPointerCapture(e.pointerId); } catch { /* ignore */ }
      if (pts.size === 1) { lx = e.clientX; ly = e.clientY; }
      else if (pts.size === 2) pinch = spread();
    });
    c.addEventListener('pointermove', e => {
      if (!pts.has(e.pointerId)) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 1) {
        this.userYaw += (e.clientX - lx) * 0.006;
        this.userPitch = Math.max(-0.5, Math.min(0.85, this.userPitch - (e.clientY - ly) * 0.005));
        lx = e.clientX; ly = e.clientY;
      } else if (pts.size >= 2) {
        const d = spread();
        if (pinch > 0 && d > 0) this._zoomMul(pinch / d);
        pinch = d;
      }
    });
    const release = e => {
      pts.delete(e.pointerId);
      if (pts.size < 2) pinch = 0;
      if (pts.size === 1) { const p = [...pts.values()][0]; lx = p.x; ly = p.y; }
    };
    c.addEventListener('pointerup', release);
    c.addEventListener('pointercancel', release);
    c.addEventListener('wheel', e => {
      if (!this.orbitEnabled) return;
      e.preventDefault();
      this._zoomMul(e.deltaY > 0 ? 1.1 : 0.9);
    }, { passive: false });
  }

  start() {
    if (this.running) return;
    this.running = true;
    let last = performance.now();
    const loop = (now) => {
      if (!this.running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      this.tick(dt, now);
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
  stop() { this.running = false; }

  // ---------- environment ----------

  makeTurnRing() {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.62, 0.035, 8, 32),
      new THREE.MeshBasicMaterial({ color: 0xc86cff, transparent: true, opacity: 0.85 })
    );
    ring.rotation.x = Math.PI / 2;
    ring.visible = false;
    return ring;
  }

  setBiome(biomeId) {
    // clear old env
    this.envGroup.clear();
    const b = biomeId ? BIOMES[biomeId] : { fog: 0x0c0810, floor: 0x241c2a, tint: 0x8a5ad8 }; // the Codex library hub
    this.scene.background = new THREE.Color(b.fog);
    this.scene.fog = new THREE.FogExp2(b.fog, 0.052);
    this.tintLight.color.set(b.tint);

    const floorMat = new THREE.MeshStandardMaterial({ color: b.floor, roughness: 0.95 });
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(7.2, 7.7, 0.4, 40), floorMat);
    floor.position.y = -0.2;
    this.envGroup.add(floor);

    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(7.2, 0.06, 8, 64),
      new THREE.MeshBasicMaterial({ color: b.tint, transparent: true, opacity: 0.5 })
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.02;
    this.envGroup.add(rim);

    // scattered rocks + broken pillars
    const rockMat = new THREE.MeshStandardMaterial({ color: b.floor, roughness: 1, flatShading: true });
    const rng = () => Math.random();
    for (let i = 0; i < 9; i++) {
      const a = rng() * Math.PI * 2;
      const r = 7.6 + rng() * 3;
      const rock = new THREE.Mesh(new THREE.IcosahedronGeometry(0.4 + rng() * 0.9, 0), rockMat);
      rock.position.set(Math.cos(a) * r, 0.15, Math.sin(a) * r);
      rock.rotation.set(rng() * 3, rng() * 3, rng() * 3);
      this.envGroup.add(rock);
    }
    for (let i = 0; i < 4; i++) {
      const a = Math.PI * (0.15 + i * 0.23) + Math.PI; // back arc
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.42, 1.5 + Math.random() * 2.2, 7), rockMat);
      p.position.set(Math.cos(a) * 9.5, 0.7, Math.sin(a) * 9.5 - 2);
      p.rotation.z = (Math.random() - 0.5) * 0.15;
      this.envGroup.add(p);
    }

    // the gate scar — glowing crack hanging in the back
    const gateMat = new THREE.MeshBasicMaterial({ color: b.tint, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
    const gate = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 5.2), gateMat);
    gate.position.set(0, 3, -11);
    gate.name = 'gatescar';
    this.envGroup.add(gate);
    const gateGlow = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 6.5), new THREE.MeshBasicMaterial({ color: b.tint, transparent: true, opacity: 0.08, side: THREE.DoubleSide }));
    gateGlow.position.set(0, 3, -11.1);
    this.envGroup.add(gateGlow);

    // drifting particles
    const n = 160;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = Math.random() * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    const pgeo = new THREE.BufferGeometry();
    pgeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.dust = new THREE.Points(pgeo, new THREE.PointsMaterial({ color: b.tint, size: 0.055, transparent: true, opacity: 0.65 }));
    this.envGroup.add(this.dust);
  }

  // ---------- actors ----------

  clearActors() {
    this.hooks.clear();
    this.onPick = null;
    for (const a of this.actors.values()) this.actorGroup.remove(a.group);
    this.actors.clear();
    this.turnRing.visible = false;
    this.overlay.querySelectorAll('.dmg-num').forEach(el => el.remove());
  }

  addActor(uid, kind, variant, opts = {}) {
    const { group, ready } = buildActor(kind, variant, opts);
    const a = {
      uid, group, ready,
      home: new THREE.Vector3(opts.x || 0, 0, opts.z || 0),
      face: opts.face || 0,
      dead: false,
      float: false,
      bobPhase: Math.random() * 6.28,
    };
    group.position.copy(a.home);
    group.rotation.y = a.face;
    ready.then(g => { a.float = g.userData.float; });
    this.actorGroup.add(group);
    this.actors.set(uid, a);
    return a;
  }

  // Rig helpers: find an actor by character id (hub showcase uses 'sc_' + id).
  rigOf(id) {
    const a = this.actors.get(id) || this.actors.get('sc_' + id);
    return a && a.group.children[0] && a.group.children[0].userData.rig;
  }
  speak(id, seconds) { const r = this.rigOf(id); if (r) r.talk(seconds); }
  // a battle actor's rig (toon figures only), or null for monsters and chibis
  rigFor(a) { return a && a.group.children[0] && a.group.children[0].userData.rig || null; }
  act(a, name, ms) { const r = this.rigFor(a); if (r) r.act(name, (ms * FAST()) / 1000); return !!r; }
  wave(id) { const r = this.rigOf(id); if (r) r.wave(); }
  kneel(id, on = true) { const r = this.rigOf(id); if (r) r.kneel(on); }

  // party: [{uid, model, variant}], enemies: [{uid, model, variant, boss}]
  async layoutBattle(party, enemies) {
    this.clearActors();
    const place = (list, side) => {
      const n = list.length;
      list.forEach((u, i) => {
        const off = i - (n - 1) / 2;
        const x = (2.9 + Math.abs(off) * 0.55 + (u.boss ? 0.8 : 0)) * side;
        const z = off * 2.0;
        this.addActor(u.uid, u.model, u.variant, {
          x, z, boss: u.boss,
          face: side > 0 ? -Math.PI / 2 : Math.PI / 2,
          side: side > 0 ? 'enemy' : 'party',
        });
      });
    };
    place(party, -1);
    place(enemies, 1);
    await Promise.all([...this.actors.values()].map(a => a.ready));
  }

  async showcase(ids, variantOf) {
    this.clearActors();
    this.setBiome(null);
    const n = ids.length;
    ids.forEach((id, i) => {
      const off = i - (n - 1) / 2;
      this.addActor('sc_' + id, id, variantOf ? variantOf(id) : null, { x: off * 2.1, z: Math.abs(off) * 0.4, face: 0 });
    });
    this.camBase.set(0, 2.2, 6.4);
    this.camTarget.set(0, 1.0, 0);
    this.viewHalfW = 3.9;
    this.resetView();
    this.orbitEnabled = true;
    await Promise.all([...this.actors.values()].map(a => a.ready));
  }

  battleCamera() {
    this.camBase.set(0, 5.0, 10.4);
    this.camTarget.set(0, 1.0, 0);
    this.viewHalfW = 5.6;
    this.resetView();
    this.orbitEnabled = true;
  }

  // ---------- per-frame ----------

  tick(dt, now) {
    this.t += dt;
    // tweens
    for (let i = this.tweens.length - 1; i >= 0; i--) {
      const tw = this.tweens[i];
      const p = Math.min(1, (now - tw.start) / tw.dur);
      tw.fn(tw.ease ? tw.ease(p) : p);
      if (p >= 1) { this.tweens.splice(i, 1); tw.resolve(); }
    }
    // idle bob
    for (const a of this.actors.values()) {
      if (a.dead || a.acting) continue;
      const bob = a.float
        ? 0.22 + Math.sin(this.t * 2.2 + a.bobPhase) * 0.1
        : Math.abs(Math.sin(this.t * 2.6 + a.bobPhase)) * 0.045;
      a.group.position.y = a.home.y + bob;
      a.group.rotation.y = a.face + Math.sin(this.t * 0.9 + a.bobPhase) * 0.045;
    }
    // rigged (toon) actors: blink, talk, wave, kneel, breathe
    for (const a of this.actors.values()) {
      const rig = a.group.children[0] && a.group.children[0].userData.rig;
      if (rig && (!a.dead || a.group.visible)) rig.update(dt, a.group.position.y);
    }
    for (const fn of this.hooks) fn(dt, this.t);
    // dust drift
    if (this.dust) {
      const p = this.dust.geometry.attributes.position;
      for (let i = 0; i < p.count; i++) {
        let y = p.getY(i) + dt * 0.25;
        if (y > 6) y = 0;
        p.setY(i, y);
      }
      p.needsUpdate = true;
    }
    // gate scar pulse
    const scar = this.envGroup.getObjectByName('gatescar');
    if (scar) scar.material.opacity = 0.25 + Math.sin(this.t * 1.7) * 0.12;
    // flash decay
    this.flash.intensity = Math.max(0, this.flash.intensity - dt * 90);
    // camera: framing fit + player orbit + idle drift + shake
    this.shake = Math.max(0, this.shake - dt * 3.2);
    const shx = (Math.random() - 0.5) * this.shake, shy = (Math.random() - 0.5) * this.shake;
    const off = this._scratch.subVectors(this.camBase, this.camTarget);
    const baseDist = off.length() || 1;
    const aspect = this.camera.aspect || 1;
    // widen the FOV so the party + enemies fit side-to-side on narrow screens
    const needTanV = (this.viewHalfW / baseDist) / Math.max(0.2, aspect);
    let fov = Math.max(this.baseFov, Math.min(80, 2 * Math.atan(needTanV) * 180 / Math.PI));
    if (Math.abs(fov - this.camera.fov) > 0.05) { this.camera.fov = fov; this.camera.updateProjectionMatrix(); }
    const tanV = Math.tan(fov * Math.PI / 360);
    const coverHalfW = baseDist * tanV * aspect;
    this.fitZoom = coverHalfW >= this.viewHalfW ? 1 : this.viewHalfW / coverHalfW;
    const dist = baseDist * this.fitZoom * this.userZoom;
    // orbit around the target: design angle + player input
    const yaw = Math.atan2(off.x, off.z) + this.userYaw;
    const pitch = Math.max(0.03, Math.min(1.15, Math.asin(Math.max(-1, Math.min(1, off.y / baseDist))) + this.userPitch));
    // on tall screens, pan the whole view down so actors ride up above the HUD
    const portrait = Math.max(0, Math.min(0.6, 1 - aspect));
    this.aimBiasY = -portrait * 0.55 * dist * tanV;
    const cx = this.camTarget.x, cy = this.camTarget.y + this.aimBiasY, cz = this.camTarget.z;
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    this.camera.position.set(
      cx + Math.sin(yaw) * cp * dist + Math.sin(this.t * 0.12) * 0.25 + shx,
      cy + sp * dist + Math.sin(this.t * 0.09) * 0.12 + shy,
      cz + Math.cos(yaw) * cp * dist
    );
    this._look.set(cx, cy, cz);
    this.camera.lookAt(this._look);
    // impact bursts
    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const b = this.bursts[i];
      b.life -= dt;
      const pp = b.points.geometry.attributes.position;
      for (let j = 0; j < pp.count; j++) {
        pp.setXYZ(j, pp.getX(j) + b.vel[j * 3] * dt, pp.getY(j) + b.vel[j * 3 + 1] * dt, pp.getZ(j) + b.vel[j * 3 + 2] * dt);
        b.vel[j * 3 + 1] -= dt * 4;
      }
      pp.needsUpdate = true;
      b.points.material.opacity = Math.max(0, b.life * 2.2);
      if (b.life <= 0) { this.fxGroup.remove(b.points); this.bursts.splice(i, 1); }
    }
    // turn ring spin
    if (this.turnRing.visible) this.turnRing.rotation.z += dt * 2;
  }

  tween(dur, fn, ease = easeInOut) {
    dur = Math.max(1, dur * FAST());
    return new Promise(resolve => {
      this.tweens.push({ start: performance.now(), dur, fn, ease, resolve });
    });
  }
  wait(ms) { return new Promise(r => setTimeout(r, ms * FAST())); }

  // ---------- fx ----------

  burst(pos, color = 0xffdd88, count = 14, speed = 3.2) {
    const geo = new THREE.BufferGeometry();
    const arr = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = pos.x; arr[i * 3 + 1] = pos.y; arr[i * 3 + 2] = pos.z;
      const a = Math.random() * Math.PI * 2, e = Math.random() * Math.PI - Math.PI / 2;
      vel[i * 3] = Math.cos(a) * Math.cos(e) * speed * (0.4 + Math.random());
      vel[i * 3 + 1] = Math.sin(e) * speed * 0.7 + 1.6;
      vel[i * 3 + 2] = Math.sin(a) * Math.cos(e) * speed * (0.4 + Math.random());
    }
    geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    const points = new THREE.Points(geo, new THREE.PointsMaterial({ color, size: 0.09, transparent: true, opacity: 1 }));
    this.fxGroup.add(points);
    this.bursts.push({ points, vel, life: 0.5 });
  }

  flashAt(pos, color = 0xffffff, intensity = 60) {
    this.flash.color.set(color);
    this.flash.position.copy(pos).add(new THREE.Vector3(0, 1.2, 0.5));
    this.flash.intensity = intensity;
  }

  dmgNumber(uid, text, cls = '') {
    const a = this.actors.get(uid);
    if (!a) return;
    const v = a.group.position.clone().add(new THREE.Vector3(0, 2.1, 0)).project(this.camera);
    const el = document.createElement('div');
    el.className = 'dmg-num ' + cls;
    el.textContent = text;
    el.style.left = ((v.x * 0.5 + 0.5) * 100) + '%';
    el.style.top = ((-v.y * 0.5 + 0.5) * 100) + '%';
    this.overlay.appendChild(el);
    setTimeout(() => el.remove(), 950);
  }

  // ---------- combat event playback ----------
  // events: flat list from Combat.step(); onApply(e) fires exactly when
  // each event's effect should hit the HUD.

  async playEvents(events, onApply) {
    let i = 0;
    while (i < events.length) {
      const e = events[i];
      if (e.t === 'skill') {
        // gather results until the next action-level event
        const results = [];
        let j = i + 1;
        while (j < events.length && !['skill', 'turn', 'round', 'end', 'item'].includes(events[j].t)) {
          results.push(events[j]); j++;
        }
        await this.animateAction(e, results, onApply);
        i = j;
      } else if (e.t === 'item') {
        const results = [];
        let j = i + 1;
        while (j < events.length && ['heal', 'revive', 'log'].includes(events[j].t)) { results.push(events[j]); j++; }
        await this.animateItem(e, results, onApply);
        i = j;
      } else {
        await this.animateSimple(e, onApply);
        i++;
      }
    }
  }

  async animateSimple(e, onApply) {
    const a = e.uid ? this.actors.get(e.uid) : null;
    switch (e.t) {
      case 'round':
        onApply(e);
        await this.wait(280);
        break;
      case 'turn': {
        onApply(e);
        if (a) {
          this.turnRing.visible = true;
          this.turnRing.position.set(a.group.position.x, 0.05, a.group.position.z);
        }
        await this.wait(160);
        break;
      }
      case 'dot': {
        onApply(e);
        if (a) {
          this.dmgNumber(e.uid, String(e.dmg), e.id === 'burn' ? 'burn' : 'poison');
          this.burst(a.group.position.clone().add(new THREE.Vector3(0, 1, 0)), e.id === 'burn' ? 0xff8844 : 0x88ff66, 8, 2);
        }
        await this.wait(240);
        break;
      }
      case 'heal': {
        onApply(e);
        if (a) {
          this.dmgNumber(e.uid, '+' + e.amount, 'heal');
          this.burst(a.group.position.clone().add(new THREE.Vector3(0, 1.2, 0)), 0x7dffb0, 10, 1.6);
        }
        await this.wait(260);
        break;
      }
      case 'die': await this.animateDeath(e, onApply); break;
      case 'revive': {
        onApply(e);
        if (a) {
          a.dead = false;
          a.group.visible = true;
          this.setActorOpacity(a, 1);
          a.group.rotation.z = 0; a.group.rotation.x = 0;
          { const r = this.rigFor(a); if (r) { r.kneel(false); r.act('cheer', 0.8); } }
          this.burst(a.group.position.clone().add(new THREE.Vector3(0, 1, 0)), 0xffd166, 20, 3);
          this.flashAt(a.group.position, 0xffd166, 40);
        }
        await this.wait(350);
        break;
      }
      case 'cover': {
        onApply(e);
        const guard = this.actors.get(e.uid);
        const tgt = this.actors.get(e.for);
        if (guard && tgt) {
          guard.acting = true;
          const dst = tgt.group.position.clone().add(new THREE.Vector3(0.9, 0, 0));
          const src = guard.group.position.clone();
          await this.tween(180, t => guard.group.position.lerpVectors(src, dst, t), easeOut);
          guard.tempPos = true;
        }
        break;
      }
      case 'captured': {
        // chains of violet sigil wrap the target and drag it down through the floor
        onApply(e);
        if (a) {
          a.dead = true;
          const pos = a.group.position.clone();
          const rings = [];
          for (let k = 0; k < 3; k++) {
            const ring = new THREE.Mesh(new THREE.TorusGeometry(0.55 - k * 0.08, 0.035, 6, 24),
              new THREE.MeshBasicMaterial({ color: 0xc86cff, transparent: true, opacity: 0.9 }));
            ring.rotation.x = Math.PI / 2;
            ring.position.set(pos.x, 0.3 + k * 0.45, pos.z);
            this.fxGroup.add(ring);
            rings.push(ring);
          }
          this.flashAt(pos, 0xc86cff, 70);
          this.burst(pos.clone().add(new THREE.Vector3(0, 1, 0)), 0xc86cff, 26, 3.2);
          await this.tween(260, t => rings.forEach((r, k) => { r.scale.setScalar(1 + (1 - t) * 0.8); r.rotation.z = t * 3 * (k % 2 ? 1 : -1); }));
          const y0 = a.group.position.y;
          await this.tween(420, t => {
            a.group.position.y = y0 - t * 1.8;
            rings.forEach((r, k) => { r.position.y = 0.3 + k * 0.45 - t * 1.6; r.material.opacity = 0.9 * (1 - t); });
          });
          rings.forEach(r => this.fxGroup.remove(r));
          a.group.visible = false;
        }
        await this.wait(120);
        break;
      }
      case 'yield': {
        onApply(e);
        if (a) {
          a.dead = true;
          const y0 = a.group.position.y;
          await this.tween(380, t => { a.group.position.y = y0 - t * 0.35; a.group.rotation.x = t * 0.35; });
          this.burst(a.group.position.clone().add(new THREE.Vector3(0, 0.6, 0)), 0xc8ccd8, 14, 1.6);
        }
        await this.wait(200);
        break;
      }
      case 'seal_backlash': {
        onApply(e);
        if (a) { this.flashAt(a.group.position, 0xff4a6a, 50); this.burst(a.group.position.clone().add(new THREE.Vector3(0, 1, 0)), 0xff4a6a, 14, 2.4); this.shake = Math.max(this.shake, 0.1); }
        await this.wait(260);
        break;
      }
      case 'favor': {
        onApply(e);
        const ta = this.actors.get(e.for);
        if (ta) { this.flashAt(ta.group.position, 0xff8a2a, 60); this.burst(ta.group.position.clone().add(new THREE.Vector3(0, 1.1, 0)), 0xff8a2a, 22, 2.8); }
        await this.wait(260);
        break;
      }
      case 'status+': case 'status-': case 'log': case 'shield':
        onApply(e);
        if (e.t === 'shield' && a) this.burst(a.group.position.clone().add(new THREE.Vector3(0, 1.1, 0)), 0xffe9a8, 12, 1.4);
        break;
      case 'end': {
        onApply(e);
        if (e.outcome === 'victory') {
          this.turnRing.visible = false;
          const winners = [...this.actors.values()].filter(x => !x.dead && x.home.x < 0);
          winners.forEach((w, i) => { const r = this.rigFor(w); if (!r) return; if (i % 2) r.wave(1.6); else r.act('cheer', 1.3 * FAST()); });
          for (let k = 0; k < 2; k++) {
            await Promise.all(winners.map(w =>
              this.tween(240, t => { w.group.position.y = w.home.y + Math.sin(t * Math.PI) * 0.55; })
            ));
          }
        }
        await this.wait(300);
        break;
      }
      default: onApply(e);
    }
  }

  async animateDeath(e, onApply) {
    onApply(e);
    const a = this.actors.get(e.uid);
    if (!a) return;
    a.dead = true;
    this.burst(a.group.position.clone().add(new THREE.Vector3(0, 0.9, 0)), 0x999999, 16, 2.4);
    const rig = this.rigFor(a);
    if (rig && a.home.x < 0) {
      // a fallen hero drops to one knee, head bowed, and dims
      rig.act('flinch', 0.4); rig.kneel(true);
      const y0 = a.group.position.y;
      await this.tween(420, t => { a.group.position.y = y0 + (a.home.y - y0) * t; a.group.rotation.x = 0.25 * t; this.setActorOpacity(a, 1 - t * 0.45); }, easeOut);
      return;
    }
    await this.tween(420, t => {
      a.group.rotation.z = t * Math.PI / 2 * (a.home.x > 0 ? 1 : -1);
      a.group.position.y = a.home.y * (1 - t) - t * 0.15;
      this.setActorOpacity(a, 1 - t * 0.85);
    }, easeOut);
    a.group.visible = a.home.x < 0; // fallen heroes stay (dimmed), enemies vanish
  }

  setActorOpacity(a, op) {
    a.group.traverse(o => {
      if (o.isMesh || o.isPoints) {
        o.material.transparent = true;
        o.material.opacity = op;
      }
    });
  }

  async animateAction(skillEv, results, onApply) {
    const attacker = this.actors.get(skillEv.uid);
    onApply(skillEv);
    if (!attacker || attacker.dead) { for (const r of results) await this.animateSimple(r, onApply); return; }

    const firstTargetUid = skillEv.targets && skillEv.targets[0];
    const target = firstTargetUid ? this.actors.get(firstTargetUid) : null;
    const anim = skillEv.anim || this.guessAnim(skillEv, results);
    attacker.acting = true;
    const src = attacker.group.position.clone();
    src.y = attacker.home.y;

    const applyResults = async () => {
      for (const r of results) {
        if (r.t === 'hit') {
          const ta = this.actors.get(r.uid);
          onApply(r);
          if (ta) {
            if (r.miss) this.dmgNumber(r.uid, 'MISS', 'miss');
            else {
              this.dmgNumber(r.uid, String(r.dmg), r.crit ? 'crit' : (r.kind === 'mag' ? 'mag' : ''));
              this.burst(ta.group.position.clone().add(new THREE.Vector3(0, 1.1, 0)), r.kind === 'mag' ? 0xb08cff : 0xffd28a, r.crit ? 22 : 12, r.crit ? 4.2 : 2.8);
              this.flashAt(ta.group.position, r.kind === 'mag' ? 0xb08cff : 0xfff2d8, r.crit ? 55 : 30);
              if (r.crit || (r.dmg > 0 && ta.uid === 'player')) this.shake = Math.max(this.shake, r.crit ? 0.16 : 0.09);
              // hurt: a toon figure flinches; everyone jolts
              this.act(ta, 'flinch', 420);
              const g = ta.group;
              const hx = g.position.x;
              this.tween(180, t => { g.position.x = hx + Math.sin(t * Math.PI * 3) * 0.12 * (1 - t); });
            }
          }
          await this.wait(190);
        } else {
          await this.animateSimple(r, onApply);
        }
      }
    };

    if (anim === 'melee' || anim === 'dash') {
      const dstPos = target ? target.group.position.clone() : new THREE.Vector3(0, 0, 0);
      const dir = attacker.home.x < 0 ? -1 : 1; // stop short on the attacker's side
      const dst = dstPos.clone().add(new THREE.Vector3(1.15 * dir, 0, 0));
      dst.y = attacker.home.y;
      await this.tween(anim === 'dash' ? 160 : 240, t => attacker.group.position.lerpVectors(src, dst, t), easeOut);
      // swing: a toon figure winds up and strikes with her arm; anything else tilts
      if (this.act(attacker, anim === 'dash' ? 'thrust' : 'swing', 520)) await this.wait(250);
      else await this.tween(120, t => { attacker.group.rotation.z = Math.sin(t * Math.PI) * -0.5 * dir; });
      await applyResults();
      await this.tween(220, t => attacker.group.position.lerpVectors(dst, src, t));
      attacker.group.rotation.z = 0;
    } else if (anim === 'cast') {
      // raise + glow
      const glowColor = skillEv.skillId === 'seal' ? 0xc86cff : skillEv.uid === 'rue' ? 0xff8a4a : skillEv.uid === 'vesper' ? 0xb8a8e8 : skillEv.uid === 'sakura' ? 0x8affb0 : skillEv.uid === 'shiro' ? 0xd8d8ff : 0xb08cff;
      const rigged = this.act(attacker, 'cast', 900);
      const lift = rigged ? 0.12 : 0.35;
      await this.tween(240, t => { attacker.group.position.y = attacker.home.y + t * lift; });
      this.burst(attacker.group.position.clone().add(new THREE.Vector3(0, rigged ? 1.75 : 1.6, rigged ? 0.25 : 0)), glowColor, rigged ? 18 : 10, rigged ? 1.6 : 1.2);
      if (rigged) this.flashAt(attacker.group.position, glowColor, 35);
      // projectiles to each target
      const tuids = (skillEv.targets || []).filter(u => this.actors.get(u));
      await Promise.all(tuids.map(async (tu, k) => {
        const ta = this.actors.get(tu);
        const orb = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 10), new THREE.MeshBasicMaterial({ color: glowColor }));
        const from = attacker.group.position.clone().add(new THREE.Vector3(0, 1.6, 0));
        const to = ta.group.position.clone().add(new THREE.Vector3(0, 1.1, 0));
        this.fxGroup.add(orb);
        await this.wait(k * 60);
        await this.tween(260, t => {
          orb.position.lerpVectors(from, to, t);
          orb.position.y += Math.sin(t * Math.PI) * 0.8;
        }, easeOut);
        this.fxGroup.remove(orb);
      }));
      await applyResults();
      await this.tween(180, t => { attacker.group.position.y = attacker.home.y + lift * (1 - t); });
    } else if (anim === 'buff' || anim === 'guard') {
      const ringColor = anim === 'guard' ? 0x9ab0c8 : 0xffe9a8;
      this.act(attacker, anim === 'guard' ? 'guard' : 'cast', 700);
      for (const tu of (skillEv.targets || [skillEv.uid])) {
        const ta = this.actors.get(tu);
        if (ta) this.burst(ta.group.position.clone().add(new THREE.Vector3(0, 0.6, 0)), ringColor, 12, 1.5);
      }
      await this.wait(240);
      await applyResults();
    } else {
      await applyResults();
    }

    // return any cover displacement home
    for (const g of this.actors.values()) {
      if (!g.tempPos || g.dead) continue;
      const cur = g.group.position.clone();
      const home = g.home.clone();
      await this.tween(200, t => g.group.position.lerpVectors(cur, home, t));
      g.tempPos = false;
      g.acting = false;
    }
    attacker.acting = false;
    attacker.group.position.x = src.x; attacker.group.position.z = src.z;
  }

  guessAnim(skillEv, results) {
    if (results.some(r => r.t === 'hit' && r.kind === 'mag')) return 'cast';
    if (results.some(r => r.t === 'heal' || r.t === 'shield')) return 'cast';
    if (results.some(r => r.t === 'hit')) return 'melee';
    return 'buff';
  }

  async animateItem(e, results, onApply) {
    onApply(e);
    const user = this.actors.get(e.uid);
    const tgt = this.actors.get(e.target);
    if (user && tgt) {
      if (this.act(user, 'toss', 520)) await this.wait(200);
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({ color: 0x7dffb0 }));
      const from = user.group.position.clone().add(new THREE.Vector3(0, 1.4, 0));
      const to = tgt.group.position.clone().add(new THREE.Vector3(0, 1.2, 0));
      this.fxGroup.add(orb);
      await this.tween(300, t => {
        orb.position.lerpVectors(from, to, t);
        orb.position.y += Math.sin(t * Math.PI) * 1.2;
      });
      this.fxGroup.remove(orb);
    }
    for (const r of results) await this.animateSimple(r, onApply);
  }
}

// ---------------------------------------------------------------
// portrait snapshots (waist-up render → dataURL, cached)
// ---------------------------------------------------------------

let portraitRenderer = null;
const portraitCache = new Map();

export async function makePortrait(kind, variant = null, opts = {}) {
  const key = kind + '|' + (variant || '');
  if (opts.cache === false) portraitCache.delete(key);      // force a fresh render (Forge preview)
  else if (portraitCache.has(key)) return portraitCache.get(key);

  if (!portraitRenderer) {
    portraitRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    portraitRenderer.setSize(220, 220);
    portraitRenderer.setClearColor(0x000000, 0);
  }
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xaebbd8, 0x2a2c36, 1.4));
  const key1 = new THREE.DirectionalLight(0xffe8c8, 1.8);
  key1.position.set(1.5, 2.5, 2.5);
  scene.add(key1);

  const { group, ready } = buildActor(kind, variant, {});
  await ready;
  scene.add(group);
  group.rotation.y = 0.3;

  const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 20);
  cam.position.set(0.25, 1.5, 2.1);
  cam.lookAt(0, 1.12, 0);
  portraitRenderer.render(scene, cam);
  const url = portraitRenderer.domElement.toDataURL('image/png');
  // free the throwaway model (procedural ones only; a loaded GLB may be shared)
  if (!group.userData.gltf) group.traverse(o => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) for (const m of [].concat(o.material)) { if (m.map) m.map.dispose(); m.dispose(); }
    if (o.userData && o.userData.faces) for (const t of Object.values(o.userData.faces)) t.dispose();
  });
  if (opts.cache !== false) portraitCache.set(key, url);
  return url;
}
