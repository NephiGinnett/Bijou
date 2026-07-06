# GATEBOUND

*Three A-ranks. One vacancy. The System has other plans.*

A Solo Leveling-inspired dungeon-crawler RPG built around the party from
"A Harem Waiting For Their Man": **Sakura** (timid elf prodigy mage),
**Erin** (golden knight, first through every door), **Shiro** (ice-cold
tactician-healer), and — off grinding F-gates somewhere — **Yuki**, the
D-rank their betrothals orbit. You are the party's fourth: an F-rank nobody
whose personal **System** grants absurd growth, one gate at a time.

Runs entirely in the browser. No engine, no build step, no external
requests — three.js is vendored and every model/sound is generated in code.

## Run it

```bash
cd gatebound
python3 -m http.server 8000
# open http://localhost:8000
```

(Any static server works — `npx serve`, GitHub Pages, etc. ES modules
require http://, so opening index.html directly from disk won't load.)

Add `?fast=1` to the URL for instant text and 3× animation speed.

## The loop

1. **Guild hall** — talk to the girls (bond events), read Yuki's letters,
   shop, manage gear, then pick a gate off the world map.
2. **Gates** spawn daily at ranks **F → D → C → B → A → S**; the guild
   permits gates up to one rank above your license. Clears award Guild
   Points; enough GP promotes you.
3. **Dungeons** are a path of chambers — fights, treasure, strange events,
   rest stops — ending in a boss. Turn-based party combat with skills,
   statuses, taunts, shields, items, and each character's passive:
   - *The System* (you): outsized level growth, +10% XP
   - *Shieldmaiden* (Erin): intercepts hits aimed at wounded allies
   - *Timid Prodigy* (Sakura): +20% MAG while Erin stands
   - *Grand Design* (Shiro): auto-marks the weakest enemy each round
4. **After the clear** — camp scenes and story: three bond arcs (each girl
   has a chain), the Yuki drama thread from the source scenario, rank
   promotion ceremonies, and four different endings chosen by your bonds
   after the S-rank **Monarch's Threshold**.

Progress saves automatically to localStorage (export/import codes in
Settings).

## Project layout

```
index.html            entry + import map
css/style.css         all UI styling
js/data.js            characters, skills, enemies, gates, items, balance
js/story.js           all dialogue: intro, bonds, Yuki thread, endings
js/state.js           save/load, progression, gate & dungeon generation
js/combat.js          turn-based engine (pure logic → event stream)
js/scene3d.js         three.js stage: arena, animation, fx, portraits
js/actors3d.js        procedural chibi builders + GLB drop-in loader
js/ui.js              screens & flow (title/guild/map/dungeon/battle/…)
js/audio.js           WebAudio synth sfx + generative ambient music
models/               drop Meshy .glb files here (see models/README.md)
vendor/               three.js r170 (MIT)
```

## Replacing placeholders with real models

See **models/README.md** — drop `.glb` files (e.g. from Meshy text-to-3D)
into `models/` and list them in `models/manifest.json`. Portraits and
battle actors switch over automatically; nothing else changes.

## Tuning

All balance lives in `js/data.js` (stat growths, enemy scaling per rank,
GP thresholds, gear power) and the top of `js/state.js` (gate spawning).
Dialogue and story triggers live in `js/story.js` — events are plain data
with `cond(S)` functions, so new scenes are easy to add.
