// ============================================================
// BINDING CODEX — turn-based combat engine (Will, subdue & Binding Seals)
// Pure logic; emits an event list the UI/3D layer animates.
// Usage:
//   const c = new Combat(S, enemyGroup);
//   let r = c.step();               // run AI until a command is needed
//   ... show menu for r.needCommand ...
//   r = c.step({kind:'skill', id, target});   // resolve & continue
// ============================================================

import { SKILLS, STATUSES, HEROES, ITEMS, ELITES, ENEMIES, GATE_MODIFIERS } from './data.js';
import { heroStats, heroSkills, heroLoadout, masteryRank, bumpMastery, MASTERY_POWER, MASTERY_MP_DISCOUNT, recordCapture, recordKill, recordYield, addCorruption, leaderInCells, tribeSworn } from './state.js';

export const SEAL_MP = 10;
const WILL_REGEN = 0.06;      // Will an enemy recovers each of its turns
const HP_TO_WILL = 0.5;       // HP lost (as a share of max) also bleeds Will
const BOSS_SEAL_HP = 0.15;    // bosses can only be sealed below this HP share
const SEAL_CAP = 0.95;

const CRIT_MULT = 1.6;
const zeroLoad = () => ({
  onHit: [], lifesteal: 0, crit: 0, critDmg: 0, skillDmg: { phys: 0, mag: 0 },
  execBonus: 0, thorns: 0, startShield: 0, regen: 0, dr: 0, mpRegen: 0,
  healPower: 0, stunImmune: false, startHaste: false,
});

export class Combat {
  constructor(S, enemyGroup, opts = {}) {
    this.S = S;
    this.opts = opts;
    this.units = [];
    this.round = 0;
    this.queue = [];
    this.idx = -1;
    this.outcome = null;
    this.awaiting = null;

    for (const id of S.run.partyIds) {
      const st = heroStats(S, id);
      const cur = S.run.party[id];
      this.units.push({
        uid: id, side: 'party', heroId: id,
        name: id === 'player' ? S.name : HEROES[id].name,
        model: HEROES[id].model || id, variant: HEROES[id].variant || null, boss: false,
        base: st,
        hp: Math.min(cur.hp, st.hp), mp: Math.min(cur.mp, st.mp),
        maxHp: st.hp, maxMp: st.mp,
        skills: heroSkills(S, id),
        statuses: [], cds: {}, guarding: false,
        auto: false,
        coveredThisRound: false,
        load: heroLoadout(S, id),
      });
    }
    for (const e of enemyGroup) {
      this.units.push({
        uid: e.uid, side: 'enemy', defId: e.defId,
        name: e.name, model: e.model, variant: e.variant, boss: e.boss, elite: e.elite || null,
        base: e.stats,
        hp: e.stats.hp, mp: 999, maxHp: e.stats.hp, maxMp: 999,
        skills: e.skills, statuses: [], cds: {}, guarding: false,
        xp: e.xp, gold: e.gold, load: zeroLoad(),
        will: e.will ?? 100, maxWill: e.maxWill ?? 100,
        captureType: e.captureType ?? null, sealResist: e.sealResist || 0, tutorialSeal: !!e.tutorialSeal,
        faction: e.faction || null, family: e.family || null, named: e.named || null,
        yieldAt: (ENEMIES[e.defId] && ENEMIES[e.defId].yieldAt) || 0, noKill: !!(ENEMIES[e.defId] && ENEMIES[e.defId].noKill), leaderBreak: !!(ENEMIES[e.defId] && ENEMIES[e.defId].leaderBreak), broken: false, captured: false, yielded: false,
      });
    }
    // Gear affixes: start-of-battle wards & haste (Warding / Vigorous).
    // Elites open with their title's status already burning.
    for (const u of this.units) {
      if (u.side !== 'party') {
        const ed = u.elite ? ELITES[u.elite] : null;
        if (ed && ed.start) {
          if (ed.start === 'shield') u.statuses.push({ id: 'shield', turns: 3, power: Math.round(u.maxHp * 0.25) });
          else u.statuses.push({ id: ed.start, turns: 3, power: 0 });
        }
        continue;
      }
      if (u.load.startShield > 0) u.statuses.push({ id: 'shield', turns: 3, power: Math.round(u.maxHp * u.load.startShield) });
      if (u.load.startHaste) u.statuses.push({ id: 'haste', turns: 2, power: 0 });
    }
    // sworn Sunrun pacers: the party starts every battle Hasted
    if (tribeSworn(S, 'pride')) for (const u of this.units) if (u.side !== 'enemy' && !u.statuses.some(x => x.id === 'haste')) u.statuses.push({ id: 'haste', turns: 1, power: 0 });
    // Tower rifts: the floor is on fire, for everyone.
    if (S.run.gate && S.run.gate.modifier === 'burning') {
      // sworn drake-kin flame-wardens shield the party from burning floors
      for (const u of this.units) if (u.side === 'enemy' || !tribeSworn(S, 'clutch')) u.statuses.push({ id: 'burn', turns: 2, power: 0 });
    }
    // Ashreach cold: everyone moves slower
    if (S.run.gate && S.run.gate.modifier === 'frozen') {
      for (const u of this.units) u.statuses.push({ id: 'agi_down', turns: 2, power: 0 });
    }
    // dungeon-event buff: the whole party Fired Up for the next fight
    if (S.run.tempBuff === 'mag') {
      for (const u of this.units) if (u.side === 'party') this.addStatus(u, 'atk_up', 3, []);
      S.run.tempBuff = null;
    }
    this.freeSealUsed = false;
  }

  // Gore setting: grim lines in the battle log only when asked for.
  grim() { return this.S.settings && this.S.settings.gore === 'grim'; }
  log(ev, text, grimText) { ev.push({ t: 'log', text: grimText && this.grim() ? grimText : text }); }

  // ---- Will & sealing ----
  partyHas(heroId) { const u = this.unit(heroId); return !!(u && u.side === 'party' && u.hp > 0); }

  // Seal success chance for the warlock against a target, 0..SEAL_CAP.
  sealChance(caster, tgt) {
    if (!tgt || tgt.side !== 'enemy' || tgt.hp <= 0 || !tgt.captureType) return 0;
    if (tgt.boss && !tgt.tutorialSeal && tgt.hp / tgt.maxHp >= BOSS_SEAL_HP) return 0;
    const drain = 1 - tgt.will / tgt.maxWill;
    if (drain <= 0.05) return 0; // a seal at full Will always fails
    let chance = drain * (1 - tgt.sealResist);
    let mult = 1 + (this.S.sealPower || 0);
    const p = HEROES[caster.heroId] && HEROES[caster.heroId].passive;
    if (p && p.sealBonus) mult += p.sealBonus;
    const mod = GATE_MODIFIERS.find(m => m.id === (this.S.run.gate && this.S.run.gate.modifier)) || {};
    if (mod.sealBonus) mult += mod.sealBonus;
    if (this.S.run.omen && this.S.run.omen.sealBonus) mult += this.S.run.omen.sealBonus;
    if (tgt.captureType === 'beast') {
      if (this.S.run.bait) mult += 0.15;
      if (mod.beastSeal) mult += mod.beastSeal;
      if (leaderInCells(this.S, 'lodge')) mult += 0.1;
      if (tribeSworn(this.S, 'coil')) mult += 0.1;
    }
    chance *= mult;
    if (this.hasStatus(tgt, 'pinned') || this.hasStatus(tgt, 'bound')) chance += 0.15;
    if (this.hasStatus(caster, 'drained')) chance *= 0.7;
    return Math.max(0, Math.min(SEAL_CAP, chance));
  }

  drainWill(tgt, amount, ev) {
    if (tgt.side !== 'enemy' || tgt.hp <= 0 || amount <= 0) return;
    tgt.will = Math.max(0, Math.round(tgt.will - amount));
    ev.push({ t: 'will', uid: tgt.uid, will: tgt.will, maxWill: tgt.maxWill });
  }

  resolveSeal(u, cmd, ev) {
    const tgt = this.unit(cmd.target);
    const broken = tgt && (tgt.broken || (tgt.noKill && tgt.will <= 0));
    const free = !broken && this.S.flags && this.S.flags.free_seal && !this.freeSealUsed;
    if (free) this.freeSealUsed = true;
    else if (!broken) u.mp = Math.max(0, u.mp - SEAL_MP);
    ev.push({ t: 'skill', uid: u.uid, skillId: 'seal', name: 'Binding Seal', targets: tgt ? [tgt.uid] : [], anim: 'cast' });
    if (!tgt || tgt.hp <= 0) return;
    const chance = this.sealChance(u, tgt);
    if (Math.random() < chance) {
      tgt.captured = true;
      tgt.hp = 0;
      tgt.statuses = [];
      recordCapture(this.S, tgt);
      ev.push({ t: 'captured', uid: tgt.uid, name: tgt.name, kind: tgt.captureType });
      this.log(ev, `The seal snaps shut — ${tgt.name} is bound to the Codex!`,
        `Chains of violet sigil bite into ${tgt.name} and drag them down through the floor, still screaming. Bound.`);
    } else {
      tgt.will = Math.min(tgt.maxWill, Math.round(tgt.will + tgt.maxWill * 0.25));
      ev.push({ t: 'will', uid: tgt.uid, will: tgt.will, maxWill: tgt.maxWill });
      this.addStatus(u, 'drained', 2, ev);
      ev.push({ t: 'seal_backlash', uid: u.uid, target: tgt.uid });
      this.log(ev, chance <= 0 ? `${tgt.name} is not ready to be bound — the seal shatters.` : `The seal backlashes! ${tgt.name} rallies.`);
    }
  }

  // ---- helpers ----
  unit(uid) { return this.units.find(u => u.uid === uid); }
  alive(side) { return this.units.filter(u => u.side === side && u.hp > 0); }
  eff(u, stat) {
    let mult = 1;
    for (const st of u.statuses) {
      const def = STATUSES[st.id];
      if (def && def.mods && def.mods[stat]) mult += def.mods[stat];
    }
    return Math.max(1, u.base[stat] * mult);
  }
  hasStatus(u, id) { return u.statuses.some(s => s.id === id); }
  debuffCount(u) { return u.statuses.filter(s => STATUSES[s.id] && STATUSES[s.id].kind === 'debuff').length; }

  addStatus(u, id, turns, ev, power = 0) {
    if (id === 'stun' && u.load && u.load.stunImmune) return; // Stalwart affix
    const existing = u.statuses.find(s => s.id === id);
    if (existing) { existing.turns = Math.max(existing.turns, turns); if (power) existing.power = Math.max(existing.power || 0, power); }
    else u.statuses.push({ id, turns, power });
    ev.push({ t: 'status+', uid: u.uid, id });
  }
  removeStatus(u, id, ev) {
    const i = u.statuses.findIndex(s => s.id === id);
    if (i >= 0) { u.statuses.splice(i, 1); ev.push({ t: 'status-', uid: u.uid, id }); }
  }

  // ---- main stepping ----
  step(command) {
    const ev = [];
    if (this.outcome) return { events: ev, needCommand: null, outcome: this.outcome };

    if (this.awaiting && command) {
      const actor = this.awaiting;
      const sk = command.kind === 'skill' ? SKILLS[command.id] : null;
      const isFree = !!(sk && sk.freeAction && !actor.freeUsed);
      this.resolveAction(actor, command, ev);
      if (this.checkEnd(ev)) return { events: ev, needCommand: null, outcome: this.outcome };
      if (isFree && actor.hp > 0) {
        // free action (Limit Break): same unit acts again without ending its turn
        actor.freeUsed = true;
        return { events: ev, needCommand: actor, outcome: null };
      }
      this.awaiting = null;
    } else if (this.awaiting) {
      return { events: ev, needCommand: this.awaiting, outcome: null };
    }

    // advance turns until we need a command or battle ends
    for (let guard = 0; guard < 200; guard++) {
      const u = this.nextUnit(ev);
      if (this.outcome) return { events: ev, needCommand: null, outcome: this.outcome };
      if (!u) continue;

      // start-of-turn upkeep
      this.turnUpkeep(u, ev);
      if (u.hp <= 0) { if (this.checkEnd(ev)) return { events: ev, needCommand: null, outcome: this.outcome }; continue; }
      if (this.hasStatus(u, 'stun')) {
        ev.push({ t: 'log', text: `${u.name} is stunned!` });
        this.removeStatus(u, 'stun', ev);
        continue;
      }
      // pinned / bound: held in place, no turn
      const hold = u.statuses.find(st => STATUSES[st.id] && STATUSES[st.id].hold);
      if (hold) {
        ev.push({ t: 'log', text: `${u.name} is ${STATUSES[hold.id].name.toLowerCase()} and can't act!` });
        hold.turns--;
        if (hold.turns <= 0) this.removeStatus(u, hold.id, ev);
        continue;
      }

      if (u.side === 'party' && !u.auto) {
        this.awaiting = u;
        ev.push({ t: 'turn', uid: u.uid });
        return { events: ev, needCommand: u, outcome: null };
      }

      ev.push({ t: 'turn', uid: u.uid });
      this.resolveAction(u, this.aiCommand(u), ev);
      if (this.checkEnd(ev)) return { events: ev, needCommand: null, outcome: this.outcome };
    }
    return { events: ev, needCommand: null, outcome: this.outcome };
  }

  nextUnit(ev) {
    for (let guard = 0; guard < 50; guard++) {
      this.idx++;
      if (this.idx >= this.queue.length) {
        this.newRound(ev);
        if (this.outcome) return null;
      }
      const u = this.unit(this.queue[this.idx]);
      if (u && u.hp > 0) return u;
    }
    return null;
  }

  newRound(ev) {
    this.round++;
    this.idx = 0;
    for (const u of this.units) u.coveredThisRound = false;
    this.queue = this.units
      .filter(u => u.hp > 0)
      .map(u => ({ uid: u.uid, i: this.eff(u, 'agi') * (0.9 + Math.random() * 0.2) }))
      .sort((a, b) => b.i - a.i)
      .map(x => x.uid);
    ev.push({ t: 'round', n: this.round });

    // Shiro passive: mark the weakest enemy
    const shiro = this.unit('shiro');
    if (shiro && shiro.hp > 0) {
      const foes = this.alive('enemy');
      if (foes.length && !foes.some(f => this.hasStatus(f, 'mark'))) {
        const weakest = foes.reduce((a, b) => (a.hp / a.maxHp <= b.hp / b.maxHp ? a : b));
        this.addStatus(weakest, 'mark', 2, ev);
        ev.push({ t: 'log', text: `Shiro's Grand Design marks ${weakest.name}.` });
      }
    }
    // Round-heal passives (Nessa's Field Remedies): tend the most wounded ally.
    for (const u of this.units) {
      if (u.side !== 'party' || u.hp <= 0) continue;
      const p = HEROES[u.heroId] && HEROES[u.heroId].passive;
      if (!p || !p.roundHeal) continue;
      const hurt = this.alive('party').filter(a => a.hp < a.maxHp)
        .sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
      if (hurt) {
        const amt = Math.max(1, Math.round(hurt.maxHp * p.roundHeal));
        hurt.hp = Math.min(hurt.maxHp, hurt.hp + amt);
        ev.push({ t: 'heal', uid: hurt.uid, amount: amt, hpAfter: hurt.hp });
        ev.push({ t: 'log', text: `${u.name} tends ${hurt.name}'s wounds.` });
      }
    }
  }

  turnUpkeep(u, ev) {
    u.guarding = false;
    // enemies claw back Will each turn — unless pinned or bound
    if (u.side === 'enemy' && u.maxWill && u.will < u.maxWill) {
      const held = u.statuses.some(st => STATUSES[st.id] && STATUSES[st.id].willRegen === 0);
      if (!held) {
        u.will = Math.min(u.maxWill, Math.round(u.will + u.maxWill * WILL_REGEN));
        ev.push({ t: 'will', uid: u.uid, will: u.will, maxWill: u.maxWill });
      }
    }
    u.freeUsed = false; // reset per-turn free action (Limit Break)
    for (const k of Object.keys(u.cds)) if (u.cds[k] > 0) u.cds[k]--;

    // dots & hots
    for (const st of [...u.statuses]) {
      const def = STATUSES[st.id];
      if (!def) continue;
      if (def.dot) {
        const dmg = Math.max(1, Math.round(u.maxHp * def.dot));
        // broken leaders and the tutorial envoy can't bleed out; a leader
        // brought down by a lingering wound breaks instead of dying
        u.hp = Math.max(u.broken || u.noKill ? 1 : 0, u.hp - dmg);
        if (u.hp <= 0 && u.leaderBreak && !u.broken) {
          u.hp = 1; u.will = 0; u.broken = true; u.sealResist *= 0.5;
          u.statuses = u.statuses.filter(st2 => !(STATUSES[st2.id] && STATUSES[st2.id].dot));
          this.addStatus(u, 'pinned', 3, ev);
          ev.push({ t: 'will', uid: u.uid, will: 0, maxWill: u.maxWill });
          ev.push({ t: 'log', text: `${u.name} falls to their knees, broken. Seal them — or strike once more and end it.` });
          ev.push({ t: 'broken', uid: u.uid });
        }
        ev.push({ t: 'dot', uid: u.uid, dmg, id: st.id, hpAfter: u.hp });
        if (u.hp <= 0 && !this.tryFavor(u, ev)) { ev.push({ t: 'die', uid: u.uid }); if (u.side === 'enemy') recordKill(this.S, u); }
      }
      if (def.hot) {
        const amt = Math.max(1, Math.round(u.maxHp * def.hot));
        u.hp = Math.min(u.maxHp, u.hp + amt);
        ev.push({ t: 'heal', uid: u.uid, amount: amt, hpAfter: u.hp });
      }
    }
    // tick durations (stun handled separately in step)
    for (const st of [...u.statuses]) {
      if (st.id === 'stun') continue;
      // holds tick down at the end of the held unit's skipped turn instead
      if (STATUSES[st.id] && STATUSES[st.id].hold) continue;
      st.turns--;
      if (st.turns <= 0) this.removeStatus(u, st.id, ev);
    }
    // gear affixes: passive regen (Living) and mana trickle (Swift)
    if (u.load) {
      if (u.load.regen > 0 && u.hp > 0) {
        const amt = Math.max(1, Math.round(u.maxHp * u.load.regen));
        u.hp = Math.min(u.maxHp, u.hp + amt);
        ev.push({ t: 'heal', uid: u.uid, amount: amt, hpAfter: u.hp });
      }
      if (u.load.mpRegen > 0) u.mp = Math.min(u.maxMp, u.mp + u.load.mpRegen);
    }
  }

  // ---- AI ----
  aiCommand(u) {
    const foes = this.alive(u.side === 'enemy' ? 'party' : 'enemy');
    const allies = this.alive(u.side);
    const usable = u.skills.filter(id => {
      const sk = SKILLS[id];
      if (!sk) return false;
      if (sk.cooldown && u.cds[id] > 0) return false;
      if (sk.mp > u.mp) return false;
      return true;
    });

    // boss: unleash fury once badly wounded
    if (u.boss && u.hp / u.maxHp < 0.4 && !this.hasStatus(u, 'enrage') && usable.includes('e_enrage')) {
      return { kind: 'skill', id: 'e_enrage', target: null };
    }
    // healer logic
    const healId = usable.find(id => SKILLS[id].type === 'heal');
    if (healId) {
      const hurt = allies.filter(a => a.hp / a.maxHp < 0.55).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
      if (hurt && Math.random() < (u.boss ? 0.85 : 0.75)) return { kind: 'skill', id: healId, target: hurt.uid };
    }
    // yuki guest: encourage sometimes
    if (u.uid === 'yuki' && usable.includes('encourage') && Math.random() < 0.4) {
      return { kind: 'skill', id: 'encourage', target: null };
    }
    // prefer cooldown/special skills — bosses lean on them harder
    const specials = usable.filter(id => SKILLS[id].cooldown || SKILLS[id].target === 'all_enemies' || SKILLS[id].apply);
    const pool = (specials.length && Math.random() < (u.boss ? 0.8 : 0.55)) ? specials : usable.filter(id => SKILLS[id].type !== 'heal' && SKILLS[id].type !== 'support');
    const pick = (pool.length ? pool : ['strike'])[Math.floor(Math.random() * (pool.length || 1))] || 'strike';
    const sk = SKILLS[pick];

    let target = null;
    if (sk.target === 'enemy') {
      const taunter = foes.find(f => this.hasStatus(f, 'taunt'));
      if (taunter && u.side === 'enemy') target = taunter.uid;
      else {
        // weight squishier targets; bosses hunt the casters
        const weights = foes.map(f => 1 + (1 - f.hp / f.maxHp) * 0.4 + (f.base.def < 30 ? 0.25 : 0) + (u.boss && f.base.mag > f.base.atk ? 0.6 : 0));
        let r = Math.random() * weights.reduce((a, b) => a + b, 0);
        target = foes[0].uid;
        for (let i = 0; i < foes.length; i++) { r -= weights[i]; if (r <= 0) { target = foes[i].uid; break; } }
      }
    } else if (sk.target === 'ally') {
      target = allies.sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0].uid;
    }
    return { kind: 'skill', id: pick, target };
  }

  // Auto-battle: strike by default, or the hero's chosen auto-skill when
  // usable and not wasteful. Never flees, never spends items.
  autoCommand(u, preferredId) {
    const canUse = id => {
      const sk = SKILLS[id];
      return sk && u.skills.includes(id) && (sk.mp || 0) <= u.mp
        && !(sk.cooldown && u.cds[id] > 0) && !(sk.freeAction && u.freeUsed);
    };
    // auto never executes a broken leader — that choice stays with the player
    const foes = this.alive('enemy').filter(f => !f.broken);
    const allies = this.alive('party');
    const foeTarget = () => {
      const marked = foes.find(f => this.hasStatus(f, 'mark'));
      const t = marked || foes.slice().sort((a, b) => a.hp - b.hp)[0];
      return t ? t.uid : null;
    };

    // the warlock seals anything that's ready to be bound
    if (u.heroId === 'player') {
      const free = this.S.flags && this.S.flags.free_seal && !this.freeSealUsed;
      const best = this.alive('enemy').map(t => ({ t, c: this.sealChance(u, t) })).sort((a, b) => b.c - a.c)[0];
      if (best && best.c >= 0.6 && (free || u.mp >= SEAL_MP || best.t.broken || best.t.noKill)) return { kind: 'seal', target: best.t.uid };
    }
    if (!foes.length) return { kind: 'guard' };
    // a healer patches up anyone badly hurt before anything else
    if (!preferredId || SKILLS[preferredId].type !== 'heal') {
      const healId = u.skills.find(id => SKILLS[id] && SKILLS[id].type === 'heal' && SKILLS[id].target === 'ally' && canUse(id));
      const hurt = allies.filter(a => a.hp / a.maxHp < 0.45).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
      if (healId && hurt) return { kind: 'skill', id: healId, target: hurt.uid };
    }
    // default: the hero's free signature attack (Hex Bolt, Ink Lash…), else Strike
    const signature = u.skills.find(id => id !== 'strike' && SKILLS[id] && !SKILLS[id].mp && (SKILLS[id].type === 'phys' || SKILLS[id].type === 'mag'));
    let pick = preferredId && canUse(preferredId) ? preferredId : (signature || 'strike');
    let sk = SKILLS[pick];

    // don't waste heals on a healthy party
    if (sk.type === 'heal') {
      const hurt = allies.filter(a => a.hp / a.maxHp < 0.75)
        .sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
      if (!hurt) { pick = 'strike'; sk = SKILLS.strike; }
      else return { kind: 'skill', id: pick, target: sk.target === 'ally' ? hurt.uid : null };
    }
    // don't re-stack a self/party buff that's already running
    if (sk.type === 'support' && sk.apply) {
      const ap = Array.isArray(sk.apply) ? sk.apply[0] : sk.apply;
      const dst = ap.to === 'self' || sk.target === 'self' ? u : allies[0];
      if (dst && this.hasStatus(dst, ap.id)) { pick = 'strike'; sk = SKILLS.strike; }
    }

    if (sk.target === 'ally') {
      const t = allies.slice().sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
      return { kind: 'skill', id: pick, target: t ? t.uid : null };
    }
    if (sk.target === 'enemy') return { kind: 'skill', id: pick, target: foeTarget() };
    return { kind: 'skill', id: pick, target: null };
  }

  // ---- action resolution ----
  resolveAction(u, cmd, ev) {
    if (cmd.kind === 'guard') {
      u.guarding = true;
      ev.push({ t: 'skill', uid: u.uid, skillId: 'guard', name: 'Guard', targets: [u.uid], anim: 'guard' });
      ev.push({ t: 'log', text: `${u.name} guards.` });
      return;
    }
    if (cmd.kind === 'item') {
      this.useItem(u, cmd, ev);
      return;
    }
    if (cmd.kind === 'seal') {
      this.resolveSeal(u, cmd, ev);
      return;
    }
    if (cmd.kind === 'flee') {
      this.outcome = 'retreat';
      ev.push({ t: 'log', text: 'The party retreats from the gate!' });
      ev.push({ t: 'end', outcome: 'retreat' });
      return;
    }

    let sk = SKILLS[cmd.id];
    if (!sk) return;
    // Skill mastery: practiced skills hit harder; max rank trims MP costs.
    if (u.side === 'party' && u.heroId) {
      const rank = masteryRank(this.S, u.heroId, cmd.id);
      if (rank > 0) {
        sk = Object.assign({}, sk);
        if (sk.power) sk.power = sk.power * (1 + MASTERY_POWER * rank);
        if (rank >= 5 && sk.mp) sk.mp = Math.ceil(SKILLS[cmd.id].mp * MASTERY_MP_DISCOUNT);
      }
      const up = bumpMastery(this.S, u.heroId, cmd.id);
      if (up) ev.push({ t: 'log', text: `${u.name}'s ${sk.name} reaches mastery ${'★'.repeat(up)}!` });
    }
    if (sk.mp) u.mp = Math.max(0, u.mp - sk.mp);
    if (sk.cooldown) u.cds[cmd.id] = sk.cooldown;

    let targets = [];
    const foes = this.alive(u.side === 'enemy' ? 'party' : 'enemy');
    const allies = this.alive(u.side);
    if (sk.target === 'enemy') {
      const t = this.unit(cmd.target);
      targets = t && t.hp > 0 ? [t] : foes.slice(0, 1);
    } else if (sk.target === 'all_enemies') targets = foes.slice();
    else if (sk.target === 'ally') {
      const t = this.unit(cmd.target);
      targets = t ? [t] : allies.slice(0, 1);
    } else if (sk.target === 'all_allies') targets = allies.slice();
    else targets = [u];

    ev.push({ t: 'skill', uid: u.uid, skillId: cmd.id, name: sk.name, targets: targets.map(t => t.uid), anim: sk.anim });

    for (const tgt of targets) {
      if (sk.type === 'phys' || sk.type === 'mag') {
        const hits = sk.hits || 1;
        for (let h = 0; h < hits; h++) {
          if (tgt.hp <= 0) break;
          this.dealDamage(u, this.interceptTarget(u, tgt, ev), sk, ev);
        }
      } else if (sk.type === 'heal') {
        let amt = this.eff(u, 'mag') * sk.power * (0.95 + Math.random() * 0.1);
        const hp = (u.load ? u.load.healPower : 0) + (tgt.load ? tgt.load.healPower : 0);
        if (hp) amt *= 1 + hp;
        amt = Math.round(amt);
        tgt.hp = Math.min(tgt.maxHp, tgt.hp + amt);
        ev.push({ t: 'heal', uid: tgt.uid, amount: amt, hpAfter: tgt.hp });
      }
      if (sk.subdue && tgt.side === 'enemy' && tgt.hp > 0) {
        // Will drain as a share of max Will; resist dampens, Isolde grapples harder
        let amt = tgt.maxWill * sk.subdue / 100 * (0.9 + Math.random() * 0.2) * (1 - tgt.sealResist * 0.5);
        const p = u.side === 'party' && HEROES[u.heroId] && HEROES[u.heroId].passive;
        if (sk.grapple && p && p.grappleBonus) amt *= 1 + p.grappleBonus;
        if (u.side === 'party' && u.heroId) amt *= 1 + MASTERY_POWER * masteryRank(this.S, u.heroId, cmd.id);
        this.drainWill(tgt, amt, ev);
        if (tgt.will <= 0) this.log(ev, `${tgt.name}'s Will breaks.`, `${tgt.name} stops fighting the hold. Something behind their eyes goes very quiet.`);
      }
      if (sk.shieldPower) {
        const amt = Math.round(this.eff(u, 'def') * sk.shieldPower);
        this.addStatus(tgt, 'shield', 3, ev, amt);
        ev.push({ t: 'shield', uid: tgt.uid, amount: amt });
      }
      if (sk.apply && tgt.hp > 0) {
        const applies = Array.isArray(sk.apply) ? sk.apply : [sk.apply];
        // Hexweaver (Seris): her status effects always land.
        const sure = u.side === 'party' && HEROES[u.heroId] && HEROES[u.heroId].passive.sureHex;
        for (const ap of applies) {
          if (ap.chance && !sure && Math.random() > ap.chance) continue;
          const dst = ap.to === 'self' ? u : tgt;
          this.addStatus(dst, ap.id, ap.turns, ev);
        }
      }
    }
  }

  // Last Vigil / Shieldmaiden passives: intercept hits aimed at low-hp allies.
  interceptTarget(attacker, tgt, ev) {
    if (attacker.side !== 'enemy' || tgt.side !== 'party') return tgt;
    if (tgt.hp / tgt.maxHp >= 0.3) return tgt;
    const guard = this.units.find(g => g.side === 'party' && g !== tgt && g.hp > 0 && !g.coveredThisRound
      && !this.hasStatus(g, 'stun') && HEROES[g.heroId] && HEROES[g.heroId].passive.cover);
    if (!guard) return tgt;
    guard.coveredThisRound = true;
    ev.push({ t: 'cover', uid: guard.uid, for: tgt.uid });
    ev.push({ t: 'log', text: `${guard.name} steps in front of the blow meant for ${tgt.name}.` });
    return guard;
  }

  // Rue's Three Favors: once per run, a lethal hit on an ally just... doesn't.
  tryFavor(tgt, ev) {
    if (tgt.side !== 'party' || this.S.run.favorUsed) return false;
    const rue = this.units.find(r => r.side === 'party' && r.hp > 0 && HEROES[r.heroId] && HEROES[r.heroId].passive.favor);
    if (!rue) return false;
    this.S.run.favorUsed = true;
    tgt.hp = 1;
    ev.push({ t: 'favor', uid: rue.uid, for: tgt.uid });
    ev.push({ t: 'log', text: tgt === rue
      ? 'Rue\'s debt brand flares white. She refuses to die. "This counts as a favor to ME. Shut up."'
      : `Rue's debt brand flares — the killing blow on ${tgt.name} simply doesn't land. "That's ONE," she snaps, and sulks.` });
    return true;
  }

  dealDamage(u, tgt, sk, ev) {
    // a broken leader kneels out of the fight: sweeping attacks pass over them
    if (tgt.broken && sk.target === 'all_enemies') return;
    // dodge passives (Yuki's Lucky Lamb, Vex's Hollow Step)
    const dodge = (tgt.side === 'party' && HEROES[tgt.heroId] && HEROES[tgt.heroId].passive.dodge) || 0;
    if (dodge && Math.random() < dodge) {
      ev.push({ t: 'hit', uid: tgt.uid, dmg: 0, miss: true, kind: sk.type, hpAfter: tgt.hp });
      return;
    }
    const isMag = sk.type === 'mag';
    let atk = this.eff(u, isMag ? 'mag' : 'atk');

    let power = sk.power || 1;
    if (sk.execBelow && tgt.hp / tgt.maxHp < sk.execBelow) power = sk.execPower;
    if (sk.perDebuff) power += sk.perDebuff * this.debuffCount(tgt);

    const defStat = this.eff(tgt, isMag ? 'res' : 'def');
    const v = sk.variance || 0.1;
    const variance = 1 - v + Math.random() * v * 2;
    const passiveCrit = (u.side === 'party' && HEROES[u.heroId] && HEROES[u.heroId].passive.crit) || 0;
    const critChance = 0.05 + (u.base.luk || 5) * 0.004 + (u.load ? u.load.crit : 0) + passiveCrit;
    const crit = Math.random() < critChance;

    let dmg = atk * power * (100 / (100 + defStat)) * variance;
    if (crit) dmg *= CRIT_MULT + (u.load ? u.load.critDmg : 0);
    // damage-taken debuffs stack (mark + vulnerable)
    let takenUp = 0;
    for (const st of tgt.statuses) { const d = STATUSES[st.id]; if (d && d.takenUp) takenUp += d.takenUp; }
    if (takenUp) dmg *= 1 + takenUp;
    // attacker weapon/charm affixes
    if (u.load) {
      const sb = isMag ? u.load.skillDmg.mag : u.load.skillDmg.phys;
      if (sb) dmg *= 1 + sb;
      if (u.load.execBonus && tgt.hp / tgt.maxHp < 0.4) dmg *= 1 + u.load.execBonus;
    }
    // target armor affix (Bulwark) + damage-reduction passives (Garrick)
    const passiveDr = (tgt.side === 'party' && HEROES[tgt.heroId] && HEROES[tgt.heroId].passive.dr) || 0;
    const totalDr = (tgt.load ? tgt.load.dr : 0) + passiveDr;
    if (totalDr) dmg *= 1 - Math.min(0.6, totalDr);
    if (tgt.guarding) dmg *= 0.5;
    dmg = Math.max(1, Math.round(dmg));

    // shields absorb
    let shieldAfter;
    const sh = tgt.statuses.find(s => s.id === 'shield');
    if (sh && sh.power > 0) {
      const absorbed = Math.min(sh.power, dmg);
      sh.power -= absorbed;
      dmg -= absorbed;
      shieldAfter = sh.power;
      if (sh.power <= 0) this.removeStatus(tgt, 'shield', ev);
    }

    const hpBefore = tgt.hp;
    tgt.hp = Math.max(0, tgt.hp - dmg);
    // The tutorial envoy can't be killed, and faction leaders break before
    // they die: they collapse, Will shattered, and the warlock decides —
    // seal them, or strike again to end it.
    if (tgt.hp <= 0 && (tgt.noKill || (tgt.leaderBreak && !tgt.broken))) {
      tgt.hp = 1; dmg = hpBefore - 1;
      tgt.will = 0;
      if (tgt.leaderBreak) { tgt.broken = true; tgt.sealResist *= 0.5; }
      this.addStatus(tgt, 'pinned', 3, ev);
      ev.push({ t: 'hit', uid: tgt.uid, dmg, crit, kind: sk.type, hpAfter: tgt.hp, shieldAfter });
      ev.push({ t: 'will', uid: tgt.uid, will: 0, maxWill: tgt.maxWill });
      ev.push({ t: 'log', text: tgt.noKill ? `${tgt.name} collapses to her knees, Will shattered. Seal her!`
        : `${tgt.name} falls to their knees, broken. Seal them — or strike once more and end it.` });
      ev.push({ t: 'broken', uid: tgt.uid });
      return;
    }
    if (tgt.hp <= 0 && this.tryFavor(tgt, ev)) dmg = hpBefore - 1;
    ev.push({ t: 'hit', uid: tgt.uid, dmg, crit, kind: sk.type, hpAfter: tgt.hp, shieldAfter });
    // a beating bleeds Will as well as blood
    if (tgt.side === 'enemy' && tgt.maxWill && dmg > 0) this.drainWill(tgt, tgt.maxWill * (dmg / tgt.maxHp) * HP_TO_WILL, ev);
    // Isolde's duel: at the threshold she lowers her sword and kneels
    if (tgt.yieldAt && tgt.hp > 0 && tgt.hp / tgt.maxHp <= tgt.yieldAt) {
      tgt.yielded = true;
      tgt.hp = 0;
      recordYield(this.S, tgt);
      tgt.statuses = [];
      this.S.flags[(tgt.defId === 'isolde_duel' ? 'isolde' : tgt.defId) + '_yielded'] = true;
      ev.push({ t: 'yield', uid: tgt.uid });
      ev.push({ t: 'log', text: tgt.defId === 'isolde_duel' ? `${tgt.name} lowers her sword — and kneels.` : `${tgt.name} yields, weapon down.` });
      return;
    }

    // affix: lifesteal for the attacker (Vampiric)
    if (u.load && u.load.lifesteal > 0 && dmg > 0 && u.hp > 0) {
      const ls = Math.round(dmg * u.load.lifesteal);
      if (ls > 0) { u.hp = Math.min(u.maxHp, u.hp + ls); ev.push({ t: 'heal', uid: u.uid, amount: ls, hpAfter: u.hp }); }
    }
    // skill lifedrain (e.g. enemy Life Drain)
    if (sk.drain && dmg > 0 && u.hp > 0) {
      const h = Math.round(dmg * sk.drain);
      if (h > 0) { u.hp = Math.min(u.maxHp, u.hp + h); ev.push({ t: 'heal', uid: u.uid, amount: h, hpAfter: u.hp }); }
    }
    // affix: thorns reflect when the wearer is struck in melee (Thorned)
    if (tgt.load && tgt.load.thorns > 0 && sk.type === 'phys' && dmg > 0 && u.hp > 0) {
      const refl = Math.max(1, Math.round(dmg * tgt.load.thorns));
      u.hp = Math.max(0, u.hp - refl);
      ev.push({ t: 'hit', uid: u.uid, dmg: refl, kind: 'phys', hpAfter: u.hp });
      if (u.hp <= 0) { u.statuses = []; ev.push({ t: 'die', uid: u.uid }); ev.push({ t: 'log', text: `${u.name} falls!` }); }
    }
    // affix: on-hit status riders from the attacker's weapon (Flametongue etc.)
    if (u.load && u.load.onHit.length && tgt.hp > 0) {
      for (const oh of u.load.onHit) {
        if (oh.chance && Math.random() > oh.chance) continue;
        this.addStatus(tgt, oh.id, oh.turns, ev);
      }
    }

    if (tgt.hp <= 0) {
      tgt.statuses = [];
      ev.push({ t: 'die', uid: tgt.uid });
      if (tgt.side === 'enemy') recordKill(this.S, tgt);
      this.log(ev, `${tgt.name} falls!`, tgt.side === 'enemy' ? pickGrim(tgt.name) : `${tgt.name} goes down hard, blood in the dust.`);
      // killing what you could have sealed stains you
      if (tgt.side === 'enemy' && tgt.captureType === 'humanoid' && tgt.will / tgt.maxWill <= 0.25 && u.side === 'party') {
        addCorruption(this.S, 1);
        ev.push({ t: 'log', text: 'You could have bound them. The mark on your skin grows warmer. (+1 Corruption)' });
      }
    }
  }

  useItem(u, cmd, ev) {
    const S = this.S;
    const it = ITEMS[cmd.id];
    if (!it || !S.inventory[cmd.id]) return;
    const tgt = this.unit(cmd.target) || u;
    if (it.revive) {
      if (tgt.hp > 0) return;
      S.inventory[cmd.id]--;
      tgt.hp = Math.round(tgt.maxHp * it.revive);
      ev.push({ t: 'item', uid: u.uid, itemId: cmd.id, target: tgt.uid });
      ev.push({ t: 'revive', uid: tgt.uid, hpAfter: tgt.hp });
      ev.push({ t: 'log', text: `${tgt.name} returns to the fight!` });
      return;
    }
    S.inventory[cmd.id]--;
    ev.push({ t: 'item', uid: u.uid, itemId: cmd.id, target: tgt.uid });
    if (it.throwWill && tgt.side === 'enemy') {
      this.drainWill(tgt, tgt.maxWill * it.throwWill, ev);
      ev.push({ t: 'log', text: `The draught shatters over ${tgt.name}. Their Will sags.` });
    }
    if (it.throwStatus && tgt.side === 'enemy') this.addStatus(tgt, it.throwStatus, 2, ev);
    if (it.partyShield) for (const p of this.alive('party')) { const amt = Math.round(p.maxHp * it.partyShield); this.addStatus(p, 'shield', 3, ev, amt); ev.push({ t: 'shield', uid: p.uid, amount: amt }); }
    if (it.buff) this.addStatus(tgt, it.buff, 3, ev);
    if (it.corruption) { addCorruption(S, it.corruption); ev.push({ t: 'log', text: `Black blood burns down your throat. (+${it.corruption} Corruption)` }); }
    if (it.heal) {
      let amt = tgt.maxHp * it.heal;
      if (tgt.load && tgt.load.healPower) amt *= 1 + tgt.load.healPower;
      amt = Math.round(amt);
      tgt.hp = Math.min(tgt.maxHp, tgt.hp + amt);
      ev.push({ t: 'heal', uid: tgt.uid, amount: amt, hpAfter: tgt.hp });
    }
    if (it.mana) {
      const amt = Math.round(tgt.maxMp * it.mana);
      tgt.mp = Math.min(tgt.maxMp, tgt.mp + amt);
      ev.push({ t: 'log', text: `${tgt.name} recovers ${amt} MP.` });
    }
  }

  checkEnd(ev) {
    if (this.outcome) return true;
    if (!this.alive('enemy').length) {
      this.outcome = 'victory';
      // sync hp/mp back; fallen heroes stand back up battered
      for (const u of this.units.filter(x => x.side === 'party')) {
        const cur = this.S.run.party[u.heroId];
        if (!cur) continue;
        const mend = (this.S.run.omen && this.S.run.omen.mend) || 0;
        cur.hp = u.hp > 0 ? Math.min(u.maxHp, Math.round(u.hp + u.maxHp * mend)) : Math.max(1, Math.round(u.maxHp * 0.2));
        cur.mp = u.mp;
      }
      const xp = this.units.filter(x => x.side === 'enemy').reduce((a, b) => a + b.xp, 0);
      let gold = this.units.filter(x => x.side === 'enemy').reduce((a, b) => a + b.gold, 0);
      // Paid in Full (Mira): +gold from battles she fights in.
      const goldMult = this.units.filter(x => x.side === 'party')
        .reduce((a, x) => a + ((HEROES[x.heroId] && HEROES[x.heroId].passive.goldMult) || 0), 0);
      if (goldMult) gold = Math.round(gold * (1 + goldMult));
      this.S.run.loot.xp += xp;
      this.S.run.loot.gold += gold;
      const foes = this.units.filter(x => x.side === 'enemy');
      this.S.stats.kills += foes.filter(x => !x.captured && !x.yielded).length;
      const captured = foes.filter(x => x.captured).map(x => x.name);
      ev.push({ t: 'end', outcome: 'victory', xp, gold, captured });
      return true;
    }
    if (!this.alive('party').length) {
      this.outcome = 'wipe';
      ev.push({ t: 'end', outcome: 'wipe' });
      return true;
    }
    if (this.outcome === 'retreat') return true;
    return false;
  }

  // Menu data for the awaiting unit.
  commandOptions(u) {
    const skills = u.skills.map(id => {
      const sk = SKILLS[id];
      const rank = u.heroId ? masteryRank(this.S, u.heroId, id) : 0;
      const mp = rank >= 5 && sk.mp ? Math.ceil(sk.mp * MASTERY_MP_DISCOUNT) : (sk.mp || 0);
      return { id, name: sk.name, mp, rank, desc: sk.desc || '', target: sk.target, usable: mp <= u.mp && !(sk.cooldown && u.cds[id] > 0) && !(sk.freeAction && u.freeUsed), cd: sk.cooldown ? (u.cds[id] || 0) : 0, type: sk.type, free: !!sk.freeAction };
    });
    const items = Object.entries(this.S.inventory)
      .filter(([id, n]) => n > 0 && ITEMS[id] && !ITEMS[id].noCombat)
      .map(([id, n]) => ({ id, n, name: ITEMS[id].name, desc: ITEMS[id].desc, revive: !!ITEMS[id].revive, onEnemy: !!ITEMS[id].throwWill }));
    const free = this.S.flags && this.S.flags.free_seal && !this.freeSealUsed;
    const brokenFoe = this.alive('enemy').some(t => t.broken || (t.noKill && t.will <= 0));
    const seal = u.heroId === 'player'
      ? { mp: free ? 0 : SEAL_MP, usable: free || u.mp >= SEAL_MP || brokenFoe,
          targets: this.alive('enemy').map(t => ({ uid: t.uid, chance: this.sealChance(u, t), captureType: t.captureType })) }
      : null;
    return { skills, items, seal };
  }
}

const GRIM_DEATHS = [
  n => `${n} comes apart at the seams. What's left doesn't twitch for long.`,
  n => `${n} drops, throat opened, and the floor drinks it.`,
  n => `${n}'s ribs give with a wet crack. They do not get up.`,
  n => `${n} folds around the wound and dies badly.`,
];
function pickGrim(n) { return GRIM_DEATHS[Math.floor(Math.random() * GRIM_DEATHS.length)](n); }
