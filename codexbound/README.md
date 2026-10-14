# CODEXBOUND

*The Codex remembers every pact. Now it's writing yours.*

A dark gothic dungeon-crawler RPG built on the Gatebound engine and the
**Warlock's Codex** cast. You are a rising warlock with a fresh mark who
descends into tarot-chosen rifts, subdues and captures what you find there,
and reclaims Ashen Coven captives into allies — with **Vesper Morrow**
(Keeper of the Codex), **Rue** (demon of the Ninth Ember, three favors in your
debt) and **Dame Isolde Varr** (last knight of the Last Vigil) at your side.

Rated R: graphic violence (optional **Grim** gore setting), cruelty from the
villains, morally grey choices, and adult romance between consenting free
allies (**Gentle / Steamy / Unbound** intimacy setting).

Runs entirely in the browser. No engine, no build step, no external
requests — three.js is vendored and every model and sound is generated in
code. Gatebound lives untouched next door in `../gatebound/`; the two games
keep separate saves.

## Run it

**Windows:** double-click `start-game.bat` (serves on port 8001, so it can
run alongside Gatebound on 8000).

Or from a terminal:

```bash
cd codexbound
python -m http.server 8001    # "python" on Windows, "python3" on Mac/Linux
# open http://localhost:8001
```

Add `?fast=1` to the URL for instant text and 3× animation speed.

## The loop

1. **The Codex** (hub) — the drowned library. Talk to your allies, visit the
   **Undercroft** and **Menagerie**, brew at the **Alchemy** cauldron, swear
   at the **Pact Altar**, read the **Chronicle**.
2. **The Tarot Board** — each day Vesper deals three face-down cards; their
   backs show the rift's Circle. Turn one (only one) to choose the night's
   rift. The card sets the biome and a modifier:
   The Tower (Coven forge, burning floors), The Moon (drowned, hidden foes),
   Justice (Vigil purge), The Devil (demon market, bargains), Death
   (catacombs, uncapturable undead, rich loot), The Lovers (charmed glade,
   stronger seals, bond scenes).
3. **Descend** — chambers, forks, caches, strange doors, then the rift's
   heart. Every enemy has a **Will** bar under its health: hex it, pin it,
   hurt it, and when Will is low cast a **⛓ Binding Seal** (the warlock's
   command) to capture instead of kill. Humanoids go to the Undercroft;
   beasts to the Menagerie; undead and constructs can't be sealed. Bosses
   can only be sealed below 15% HP. Bring Vesper and her **Keeper's Eye**
   shows exact Will and seal odds.
4. **Return** — captures come home only if you clear the rift (a wipe or
   retreat frees them). Assign **wardens** to captives and **handlers** to
   beasts, then visit the cells: Interrogate, Intimidate, Bargain, Mercy,
   or Testimony from a reclaimed former comrade. When a captive's Coven
   brand burns to 0 they choose: **join** (regard ≥ 20), **leave**, or —
   if you only ever bought their progress — **relapse**.
5. **Pay for power** — pacts raise **Corruption**. 50+ opens the forbidden
   Slot VI spells; 80+ and captives fear you. Corruption and your bonds
   decide the ending after the **Ashen Heart**.

Climb the six **Circles of the Codex** — Ash, Ember, Hex, Thorn, Crown,
Abyss — by earning **Infamy**. Each inscription is a scene where the Codex
writes your new title.

## Story

- **Vesper — The Drowned Stacks** (opening): the bleeding-ink trail, the
  unturned third card, the Coven envoy, your first seal, the Binding.
- **Rue — Three Favors**: the pantry goat, the blood map, the binding trap,
  her terms. Her debt brand flashes on screen whenever she lies.
- **Isolde — The Kneeling Sword**: drawn from *Justice*. A duel she ends by
  kneeling; then six Vigil riders, and her fourth rune.
- **The Undercroft**: Calla, the envoy, fully written — intro, mid-
  Reclamation confession, release (join / leave / relapse), and a first
  night out.
- **The Dawnward Company** (Erin, Sakura, Shiro, Yuki from Gatebound): a
  famous Lodge party who come to stop the warlock — and, in the Charmed
  Glade, bend the knee or walk away proud.
- Bond arcs, romance scenes for free allies, the **Warlock's Command** arc
  (a domineering streak), hub petitions from Mira, Nessa, Vex and Seris,
  and six endings (Redeemed · Damned Together · The Long Night · The
  Ascended Warlock · The Codex Keeps You · secret: The Coven Unmade).

Intimacy lines carry `spice: 'gentle' | 'steamy' | 'unbound'` and only the
setting's tier shows. **Unbound** lines are stubs marked `// ZOE: unbound`.
Every event with a spice line must use `free(...)` for its `cond`; a
load-time check (`checkIntimacyGates`) warns in the console otherwise.
Undercroft and captive scenes never carry spice.

NG+ carries over gear, mastery, auto-skills and discovered recipes, with a
growing XP boost.

## Project layout

```
index.html            entry + import map
css/style.css         all UI styling
js/data.js            circles, heroes, skills, enemies, biomes, tarot,
                      captive/beast traits, reagents, recipes, pacts, gear
js/story.js           all dialogue: arcs, Undercroft, endings, rift events
js/state.js           save/load, tarot, rifts, captures, Reclamation,
                      Menagerie, alchemy, pacts, dispatch
js/combat.js          turn-based engine with Will, subdue & Binding Seals
js/scene3d.js         three.js stage: arena, animation, fx, portraits
js/actors3d.js        procedural chibi builders + GLB drop-in loader
js/ui.js              screens & flow
js/audio.js           WebAudio synth sfx + generative ambient music
models/               drop .glb files here (see models/README.md)
vendor/               three.js r170 (MIT)
```

Saves go to localStorage under `codexbound_save` (export/import codes in
Settings). Balance lives in `js/data.js` and the top of `js/state.js`.
