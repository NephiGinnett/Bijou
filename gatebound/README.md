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

**Windows:** double-click `start-game.bat` — it starts the server and opens
your browser. To stop, close the black window.

Or from a terminal:

```bash
cd gatebound
python -m http.server 8000    # use "python" on Windows, "python3" on Mac/Linux
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
   has a chain), pair scenes between the girls, the Yuki drama thread from
   the source scenario, rank promotion ceremonies, and four different
   endings chosen by your bonds after the S-rank **Monarch's Threshold** —
   plus wedding epilogues and married-life vignettes beyond it.
5. **Post-Monarch** — the guild grows: newcomers adapted from *the
   Warlock's Codex* (Mira, Nessa, Vex, Seris) petition to join after
   hearing about your clear. Recruit them, gear them, and use the
   **Dispatch board** to send benched members to clear gates on their own
   — balanced team compositions (vanguard/mender/arcanist/striker) raise
   the odds. **Rest until tomorrow** advances the day when you'd rather
   not dive.

Along the way: dungeon corridors now **fork** (risk an elite den for
richer spoils, or take the quiet door), titled **elite** enemies roll
extra traits and double rewards, **skill mastery** ranks up skills with
use (+5% power per ★, cheaper at max), and the guild smith **reforges**
gear affixes for gold.

From C-rank on, watch the board for **⚑ RESCUE gates**: a rival party
bit off more than it could clear and is barricaded inside. Clear the
gate to bring them home and collect the posted bounty — and sometimes
the stranded party includes a named survivor (Garrick, Liria, Tobbin)
who can be invited into the guild on the spot, or signed later at the
Newcomers desk.

**Letters & rumors** is tappable now: letters from rescued parties,
rival-guild news, College dispatches, love notes when a bond runs hot,
and rotating guild-hall gossip between the big beats. Romance keeps
deepening after the harem forms — shared mornings, storm-bound nights,
and scenes that scale with the Intimacy setting.

**Auto-battle** (▶ Auto in the battle HUD) lets the party act on its
own — Strike by default, or set a per-hero **auto-skill** on the Party
sheet once a skill reaches ★★★ mastery. Toggle it mid-fight either way;
auto never flees and never spends items. The **⚒ Smith** (reforging)
lives on its own screen now, reachable from the Shop.

**NG+ cycles**: once the Threshold is closed, Settings offers **Begin
the next cycle** — the story restarts from day one, but you keep every
piece of gear (bag and equipped), all skill mastery, and auto-skill
picks, and the System's XP boost grows with what the ending cycle
accomplished (recursions cleared, bonds earned, levels reached; party
members get half your boost). Stack cycles for compounding growth.

**Tone choices**: the pivotal relationship beats — Yuki's requests, each
devotion night, the harem's formation — now offer **wholesome,
domineering, and rejection** options. Characters react in character
(Erin thrills to command; Sakura flusters and follows; Shiro audits it
and approves; Yuki chooses her place with open eyes), rejections stay
retryable rather than locking a route, and the game quietly tracks your
prevailing tone for future content.

### The Character Forge

**⚗ Forge** in the guild hall turns character descriptions into playable
guildmates. Upload a JSON card, paste a Warlock's Codex / tavern-card, or
just describe them in prose. It reads **physical traits from how the
character looks, not from their backstory** — an explicit `appearance`
field, an `Appearance:` / `Physical description:` section, or a W++/boostyle
block (both `{Body: ...}` and `breasts(huge, full)` paren style) wins, and
otherwise it keeps the self-describing sentences and ignores creatures the
character merely *fought* (so a wood elf who "battled a slime" stays a wood
elf). It skips transformation sections like "Appearance in Moonrage:" so a
were-form doesn't overwrite the base look, honors a `Race:` / `Species:`
line (Wood Elf → elf ears, Rabbitkin → rabbit), and ignores shared world
lorebooks so "warriors and mages" boilerplate can't misclassify anyone.
From that scope it reads hair/skin/eye colors,
hairstyles (incl. braids), **body build and chest size** (for character
differentiation), and features: elf/rabbit/cat (incl. jaguar & other big
cats)/fox/wolf ears; horns and
**antlers**; fox/dragon/devil/cat/wolf tails; **serpent, hooved,
centaur, or mermaid lower bodies**; scaled skin; extra arms; a third
eye; wings; halos; crowns; capes; masks; **markings/tattoos, freckles,
piercings, collars**; scars, eyepatches, glasses, antennae, feathers;
**slime/ooze bodies, tentacles, mechanical/prosthetic parts, fins &
gills, full fur, facial hair, canes**; spectral bodies, shadow-forms,
unusual sizes. It infers a class and role — including a **Shifter**
class (a shapeshifter whose *Apex Mimic* passive lets it take the shape
of any enemy it fells, learning one of that creature's skills for the
rest of the battle) — reading an explicit `Class:` / `Occupation:` field
first so a wizard isn't mistaken for a tank. It assembles a combat kit,
with **themed skill lines** when the description genuinely implies one —
elemental/status (fire→Burn, ice→Slow/Freeze, lightning→Stun, poison,
holy, earth→Sunder, wind→Haste, bleed, curse, shadow) plus **song/bardic,
traps, and alchemy** kits. Theme detection is context-aware: it takes
unambiguous cues ("pyromancer", "hurls fire", "plays the lute") outright
but ignores incidental prose ("fire in her eyes", "a fiery temper") unless
real magic/combat context backs it, so flavor text no longer hands out
elemental kits by accident. Each hero also gets a passive, then a chibi
preview. Summon them and every system picks them up:
party, dispatch, mastery, the Smith, and the Sanctum (their card text
becomes their chat persona). Forged souls persist across NG+ cycles and
can be re-summoned, released, or forgotten at the Forge. If the Codex
is hosted on the same domain, **scan Codex storage** imports its
characters directly.

**Companion trials** (adapted from the Codex): every forged soul carries
a heart track like the girls, and a **generated four-scene bond arc**
built from an *inner theme* the Forge reads in their description
(loneliness, duty, pride, timidity, atonement, debt, curiosity, grief,
or belonging). The arc runs arrival → confession → a System-flagged
**inner trial** → devotion, with the same Wholesome/Domineering/Rejection
tone choices and intimacy variants as the main cast. Fighting alongside
them in cleared gates deepens the bond between scenes, and their current
hearts feed into their Sanctum chats.

### The Sanctum (optional AI chat)

**✉ Sanctum** in the guild hall opens a chat room with any party member
or petitioning newcomer, backed by whatever AI endpoint you configure
(⚙ Connection — KoboldCpp or any OpenAI-compatible server, local or
remote). The game builds a system prompt from live state — your rank,
bonds, story progress, and the character's persona — so they know who
they're talking to. Entirely optional; the game never requires it.
Chat histories live in localStorage, outside the save code.

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
