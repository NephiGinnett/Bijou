// ============================================================
// GATEBOUND — turn-based combat engine
// Pure logic; emits an event list the UI/3D layer animates.
// Usage:
//   const c = new Combat(S, enemyGroup);
//   let r = c.step();               // run AI until a command is needed
//   ... show menu for r.needCommand ...
//   r = c.step({kind:'skill', id, target});   // resolve & continue
// ============================================================

import { SKILLS, STATUSES, HEROES, ITEMS } from './data.js';
import { heroStats, heroSkills, heroLoadout } from './state.js';

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
        model: id, boss: false,
        base: st,
        hp: Math.min(cur.hp, st.hp), mp: Math.min(cur.mp, st.mp),
        maxHp: st.hp, maxMp: st.mp,
        skills: heroSkills(S, id),
        statuses: [], cds: {}, guarding: false,
        auto: id === 'yuki' && !S.flags.yuki_member, // guest Yuki is AI; a member you command
        coveredThisRound: false,
        load: heroLoadout(S, id),
      });
    }
    for (const e of enemyGroup) {
      this.units.push({
        uid: e.uid, side: 'enemy', defId: e.defId,
        name: e.name, model: e.model, variant: e.variant, boss: e.boss,
        base: e.stats,
        hp: e.stats.hp, mp: 999, maxHp: e.stats.hp, maxMp: 999,
        skills: e.skills, statuses: [], cds: {}, guarding: false,
        xp: e.xp, gold: e.gold, load: zeroLoad(),
      });
    }
    // Gear affixes: start-of-battle wards & haste (Warding / Vigorous).
    for (const u of this.units) {
      if (u.side !== 'party') continue;
      if (u.load.startShield > 0) u.statuses.push({ id: 'shield', turns: 3, power: Math.round(u.maxHp * u.load.startShield) });
      if (u.load.startHaste) u.statuses.push({ id: 'haste', turns: 2, power: 0 });
    }
    // Sakura resonance buff from dungeon event
    if (S.run.tempBuff === 'mag') {
      const sak = this.unit('sakura');
      if (sak) this.addStatus(sak, 'atk_up', 3, []);
      S.run.tempBuff = null;
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
      this.resolveAction(this.awaiting, command, ev);
      this.awaiting = null;
      if (this.checkEnd(ev)) return { events: ev, needCommand: null, outcome: this.outcome };
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
  }

  turnUpkeep(u, ev) {
    u.guarding = false;
    for (const k of Object.keys(u.cds)) if (u.cds[k] > 0) u.cds[k]--;

    // dots & hots
    for (const st of [...u.statuses]) {
      const def = STATUSES[st.id];
      if (!def) continue;
      if (def.dot) {
        const dmg = Math.max(1, Math.round(u.maxHp * def.dot));
        u.hp = Math.max(0, u.hp - dmg);
        ev.push({ t: 'dot', uid: u.uid, dmg, id: st.id, hpAfter: u.hp });
        if (u.hp <= 0) { ev.push({ t: 'die', uid: u.uid }); }
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
    if (cmd.kind === 'flee') {
      this.outcome = 'retreat';
      ev.push({ t: 'log', text: 'The party retreats from the gate!' });
      ev.push({ t: 'end', outcome: 'retreat' });
      return;
    }

    const sk = SKILLS[cmd.id];
    if (!sk) return;
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
      if (sk.shieldPower) {
        const amt = Math.round(this.eff(u, 'def') * sk.shieldPower);
        this.addStatus(tgt, 'shield', 3, ev, amt);
        ev.push({ t: 'shield', uid: tgt.uid, amount: amt });
      }
      if (sk.apply && tgt.hp > 0) {
        const applies = Array.isArray(sk.apply) ? sk.apply : [sk.apply];
        for (const ap of applies) {
          if (ap.chance && Math.random() > ap.chance) continue;
          const dst = ap.to === 'self' ? u : tgt;
          this.addStatus(dst, ap.id, ap.turns, ev);
        }
      }
    }
  }

  // Erin's Shieldmaiden passive: intercept hits aimed at low-hp allies.
  interceptTarget(attacker, tgt, ev) {
    if (attacker.side !== 'enemy' || tgt.side !== 'party' || tgt.uid === 'erin') return tgt;
    const erin = this.unit('erin');
    if (!erin || erin.hp <= 0 || erin.coveredThisRound || this.hasStatus(erin, 'stun')) return tgt;
    if (tgt.hp / tgt.maxHp >= 0.3) return tgt;
    erin.coveredThisRound = true;
    ev.push({ t: 'cover', uid: 'erin', for: tgt.uid });
    ev.push({ t: 'log', text: `Erin intercepts the blow meant for ${tgt.name}!` });
    return erin;
  }

  dealDamage(u, tgt, sk, ev) {
    // dodge (Yuki passive)
    if (tgt.uid === 'yuki' && Math.random() < 0.15) {
      ev.push({ t: 'hit', uid: tgt.uid, dmg: 0, miss: true, kind: sk.type, hpAfter: tgt.hp });
      return;
    }
    const isMag = sk.type === 'mag';
    let atk = this.eff(u, isMag ? 'mag' : 'atk');

    // Sakura passive
    if (u.uid === 'sakura' && isMag) {
      const erin = this.unit('erin');
      atk *= erin && erin.hp > 0 ? 1.2 : 0.9;
    }

    let power = sk.power || 1;
    if (sk.execBelow && tgt.hp / tgt.maxHp < sk.execBelow) power = sk.execPower;
    if (sk.perDebuff) power += sk.perDebuff * this.debuffCount(tgt);

    const defStat = this.eff(tgt, isMag ? 'res' : 'def');
    const v = sk.variance || 0.1;
    const variance = 1 - v + Math.random() * v * 2;
    const critChance = 0.05 + (u.base.luk || 5) * 0.004 + (u.load ? u.load.crit : 0);
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
    // target armor affix (Bulwark)
    if (tgt.load && tgt.load.dr) dmg *= 1 - tgt.load.dr;
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

    tgt.hp = Math.max(0, tgt.hp - dmg);
    ev.push({ t: 'hit', uid: tgt.uid, dmg, crit, kind: sk.type, hpAfter: tgt.hp, shieldAfter });

    // affix: lifesteal for the attacker (Vampiric)
    if (u.load && u.load.lifesteal > 0 && dmg > 0 && u.hp > 0) {
      const ls = Math.round(dmg * u.load.lifesteal);
      if (ls > 0) { u.hp = Math.min(u.maxHp, u.hp + ls); ev.push({ t: 'heal', uid: u.uid, amount: ls, hpAfter: u.hp }); }
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
      ev.push({ t: 'log', text: `${tgt.name} falls!` });
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
        cur.hp = u.hp > 0 ? u.hp : Math.max(1, Math.round(u.maxHp * 0.2));
        cur.mp = u.mp;
      }
      const xp = this.units.filter(x => x.side === 'enemy').reduce((a, b) => a + b.xp, 0);
      const gold = this.units.filter(x => x.side === 'enemy').reduce((a, b) => a + b.gold, 0);
      this.S.run.loot.xp += xp;
      this.S.run.loot.gold += gold;
      this.S.stats.kills += this.units.filter(x => x.side === 'enemy').length;
      ev.push({ t: 'end', outcome: 'victory', xp, gold });
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
      return { id, name: sk.name, mp: sk.mp || 0, desc: sk.desc || '', target: sk.target, usable: (sk.mp || 0) <= u.mp && !(sk.cooldown && u.cds[id] > 0), cd: sk.cooldown ? (u.cds[id] || 0) : 0, type: sk.type };
    });
    const items = Object.entries(this.S.inventory)
      .filter(([, n]) => n > 0)
      .map(([id, n]) => ({ id, n, name: ITEMS[id].name, desc: ITEMS[id].desc, revive: !!ITEMS[id].revive }));
    return { skills, items };
  }
}
