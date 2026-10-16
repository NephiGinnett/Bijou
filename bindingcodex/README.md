# BINDING CODEX

*The Codex remembers every pact. Now it's writing yours.*

A dark gothic dungeon-crawler RPG built on the Gatebound engine and the
**Warlock's Codex** cast. You are a rising warlock with a fresh mark who
raids the holdings of rival covens, subdues and captures what you find there,
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
cd bindingcodex
python -m http.server 8001    # "python" on Windows, "python3" on Mac/Linux
# open http://localhost:8001
```

Add `?fast=1` to the URL for instant text and 3× animation speed.

## The loop

1. **The Codex** (hub) — the drowned library. Vesper's **daily reading**
   (a free tarot card every day, each with a boon: richer spoils, a
   captive's secret, a rival weakened, free feed for the Menagerie…), the
   **Undercroft**, **Menagerie**, **Alchemy**, **Pact Altar**,
   **Chronicle**, **Rivals**, and petitions from people who want in.
2. **Expedition** — a map of the dead city and beyond. Five rival
   factions hold it: **the Ashen Coven** (Mother Cinder), **the Obsidian
   College** (Archon Sorn), **the Last Vigil** (Lord-Commander Aldric),
   **the Demon Market** (the Velvet Proprietor) and **the Hunters' Lodge**
   (Guildmaster Hale), plus wild lands full of beasts. Raid a holding to
   drain its owner's **Power**; seal its people to drain it faster. Some
   holdings are kept by a named **lieutenant** — beat them (and sometimes
   capture them) for a big hit.
3. **Descend** — chambers, forks, caches, strange doors, then the boss.
   Every enemy has a **Will** bar: hex it, pin it, hurt it, then cast a
   **⛓ Binding Seal** to capture instead of kill. Humanoids go to the
   Undercroft, beasts to the Menagerie; undead and constructs can't be
   sealed.
4. **Topple a faction** — at 35 Power its leader's **lair** opens. Leaders
   *break* instead of dying: they fall to their knees and you choose —
   **seal** them into the Undercroft (the faction is *subjugated*, and the
   leader in your cells is a weapon of its own), or strike again and
   **execute** them (*shattered*: tribute only, and Corruption). Reclaim a
   bound leader and they swear to you. Dominated factions pay tribute and
   grant perks (Coven reagents, College XP, Vigil armor, Market gold and
   discounts, Lodge contracts).
5. **Reclaim** — wardens burn Coven brands out of captives; visit daily to
   Interrogate, Intimidate, Bargain, show Mercy, or bring Testimony from a
   reclaimed comrade. At brand 0 they choose: join, leave, or relapse.
6. **Pay for power** — pacts raise **Corruption**: 50+ opens Slot VI
   spells, 80+ and captives fear you. Corruption and bonds decide the
   ending after the **Ashen Heart**.

Climb the six **Circles of the Codex** — Ash, Ember, Hex, Thorn, Crown,
Abyss — by earning **Infamy**.

## Walking the cells & pens

- **👁 Walk the cells** (Undercroft): a torchlit 3D corridor. Each captive is
  behind bars, chained to the wall, or in the stocks (your pick, cosmetic).
  Tap one and Zoe walks over; their card shows their mood and the day's visits.
- **👁 Walk the pens** (Menagerie): beasts roam their fenced pens. Tame ones
  trot to the gate, hungry ones hang around the trough, eggs sit in a nest.
  Feed or **pet** them from there (once a day, +2 tame if they trust you).
- **The cells are alive**: wardens stand guard in the corridor (and patrol if
  they keep several captives) and report when you visit; captives whisper to
  each other across the aisle and go quiet when Zoe comes near (the card shows
  what you overheard); captives close to release come up to the bars.

## Wild tribes, hybrids & the Wyrm's Mantle

- **Imbue** a tame Menagerie beast with your mark: Codex-Touched (faster
  taming, +50% yield, never sours) and **Crossblooded** — it can breed
  across families into hybrids that yield both parents' reagents.
- A thriving Menagerie draws **wild tribes** of sapient monster-folk — the
  harpies of the Skyrend Aerie, the naga of the Black Mire's Coil, the
  drake-kin of the Ashreach Clutch, and the cheetah-folk of the Sunrun
  Pride (sworn perk: your party starts every battle Hasted). Meet their envoys' requests and they
  swear fealty (tribute + a perk); a sworn tribe's envoy may ask, for
  herself, for a breeding rite (declining never breaks the oath).
- **The Envoys' Bower** (in the Menagerie): visiting envoys can be talked
  with daily (favor, plus gifts every few visits), traded with (tribute
  reagents; better rates with favor), and, once she has asked for the rite,
  invite you to spend an evening every few days, or just stay and talk.
- **Kinship.** After the envoy's rite, others of her tribe come to the
  Bower to ask for you themselves (accept, decline kindly, or "not
  tonight"). The Wild Tribes screen tracks who has chosen you and how many
  rites you've shared. As kin grows the tribe relies on you more than the
  wild: Blood-bound → Nesting Near → Devoted → Your Tribe. Tribute scales
  up, suitors come more often, and at the top they hunt for you (+gold).
- **The Brood.** Every rite is tallied per partner and lays a clutch that
  hatches a few days later and grows the tribe. The Wild Tribes screen
  shows rites offered, population, who you pair with most, and a bloodline
  bar. Pair with one partner often enough and the tribe starts to take
  after her (her feathers, scales or coat). You can **send for** any of
  your kin by name from the Bower every other day; sometimes she's busy.
- Every tribeswoman has her own model, rolled from her name: skin, hair,
  eyes, chest, build, height and her tribe's colors.
- **Guests under your protection.** Once a tribe is sworn and your favor
  with it is high (7+), the beast-folk it hunts send an envoy to ask you,
  as its friend, for a truce: Bramble of the Hollow Warren (bunny-folk, via
  the Aerie), Ren of the Ember Den (fox-folk, via the Pride), Elio of the
  Snowline Herd (fawn-folk, via the Clutch) and Tallow of the Lantern Court
  (moth-folk, via the Coil). You broker the truce with both envoys in the
  room; he then stays in the Bower: talks, a romance once he trusts you,
  evenings, and later a shared night with his tribe's envoy.
- **Lysandre**, a shapeshifter, arrives when your first hybrid hatches.
- **The Wyrm's Mantle** (pact): horns, wings and tail on your model, a
  monstrous battle form, and scenes with the allies who'd love it.

Menagerie beasts are animals and never romance partners; every partner
in the game is a sapient adult who is free and chooses it.

## Character packs

Built from the Character Packs GDD (Settings → Character packs toggles
each one; disabling a pack hides its people and events without breaking
saves): **Obsidian College** (Lady Auren Voss, the Revenant Bride, Mira
Ashveil, Maren Soleil, Cole Ashmer, the Pale Stag, Seris's duels, Vex
through the Menagerie), **Northern Reach** (Valdra, Nyxe, Mira Vane, Rhea,
Aelindra, Legate Aurelia, Brynn, Sera — and the Mira Vane → Rhea → Valdra
testimony chain), **Classic Fantasy** (Elara Moonwhisper, Lady Seraphine,
Elspeth, Sister Maren, Kira), **Wildkin** (the tribes, Lysandre, Mantle
scenes), **Through the Rift** (Larkspur Lane, below).

## Larkspur Lane (Through the Rift)

On day 4 a misfired Coven summoning drops a suburban cul-de-sac into the
fen. Its five residents open shops, reachable from the hub:

- **Victoria** (the Ledger House): daily requisitions of gear, and the
  Lane's ledger. Her stake raises every dividend by 10% a level.
- **Joanne** (the Kettle & Crown): supper for two with an ally, for extra
  closeness once a day.
- **Diane** (Diane's Garden): potions and reagents; buys reagents.
- **Margot** (Swap & Sell): buys gear and brewed draughts above market.
- **Moira** (the Black Candle): two enchanted charms every morning.

Talk daily (favor up to 3), run each woman's three errands, and invest in
her business (three stakes: 200, 500, 1000g) for nightly dividends, better
stock and favor. At favor 4 she tells you her story; at favor 8 with her
errands done, a romance and repeatable evenings. All five are free adults
(44 to 55) and never captives. Victoria and Joanne are married and
unfulfilled; their husbands know and approve.

**Celeste** (39), a sixth neighbor with no shop, is married to Brad, who
doesn't know. Her affair runs from a note in your coat to a crossroads:
end it (she leaves Brad for herself, or gives him one honest chance), or
keep going until she's carrying your child. Then she either leaves Brad
for the Codex, or lets Brad think the baby is his.

**Seasons.** The fen keeps a calendar: ten days a season, spring first. From
the 5th day of each season the **Wives' Circle** ("wives optional") throws a
holiday party: May Day, the Midsummer Cookout, the Hallows costume party and
the ugly-sweater Yule. Everyone's welcome (+1 favor across the Lane); with two
or more women close to Zoe there's an after-party. Each season every woman
close to Zoe also has a holiday scene of her own, from her card.
The women change clothes with the season too (spring pastels, summer
dresses, autumn coats and scarves, winter coats, beanies and earmuffs) and
dress up for each party: flower crowns for May Day, sundresses for the
Cookout, costumes for Hallows (a vampire countess, a saloon girl, a dryad, a
very expensive cat, a witch, a black swan) and ugly knit sweaters for Yule.
The Lane women are built on a **mature figure** (adult proportions and faces
that show their age). For each party's after-party, on Steamy or Unbound and
only when you choose an intimate option, the women who are there step onto
the stage in a **lace set** matched to the holiday: lingerie that covers what
underwear covers, never nudity. Lace only ever builds on the mature figure.

## Paths

**🜲 Paths** (from the Chronicle or Settings) lists every fork in the story,
grouped by character: ✓ what you chose, ○ what you passed up, and how many
scenes with choices you haven't found yet (names hidden unless you turn on
spoilers).

## Story

- **Vesper — The Drowned Stacks** (opening): the bleeding-ink trail, the
  unturned third card, the Coven envoy, your first seal, the Binding.
- **Isolde** is met at the Border Chapel; **Rue** through the blood map.
- **Rue — Three Favors**: the pantry goat, the blood map, the binding trap,
  her terms. Her debt brand flashes on screen whenever she lies.
- **Isolde — The Kneeling Sword**: at the Border Chapel. A duel she ends by
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

## Companions, shared hearts & family

- **Spend time with anyone.** Click an ally on the hub to open their
  Companion page: Talk, Train together or Walk, once a day each. Every 3
  visits is +1 bond, so every romance can be reached by simply being with
  someone. The page shows when one of their scenes is waiting.
- **Evenings.** Once a romance has happened, a repeatable Evening keeps it
  going (one a night, every other night per partner): a night together or
  just talking. The Dawnward Company now has romances of their own.
- **Memories.** Replay any intimate scene you've seen, from the Chronicle or
  a Companion page, with no effect on the save.
- **Hearts & Hearth** (pack, toggle in Settings):
  - Group scenes for connected lovers:
    - the Inner Circle (Vesper, Rue and Isolde, later Lysandre),
    - the Dawnward Company,
    - two brats (Rue and Nyxe),
    - two altars (Rhea and Valdra),
    - the Envoys' Council.
  - After a few nights together, a partner may tell you she's carrying your child. Births follow, then a possible second child.
  - Each envoy shows you her first clutch.
  - A hearth epilogue plays after the ending.
  - Children appear in the Chronicle's Hearth.

Intimacy lines carry `spice: 'gentle' | 'steamy' | 'unbound'`. Gentle and
Steamy show only on their own setting; **Unbound** plays the Steamy line
first and then continues with the Unbound lines. Unbound lines are stubs
marked `// ZOE: unbound`. See **docs/UNBOUND_GUIDE.md** for every stub and
what it should cover, and **docs/UNBOUND_CONTEXT.md** for each stub's whole
scene in reading order (regenerate with `node tools/stub_context.mjs`).
Characters whose story began in chains (Calla, Mira Vane, Aelindra,
Elspeth) can later ask, as free allies, to revisit that dynamic — always
through a negotiation scene first, with their own limits and stop word.
Every event with a spice line must use `free(...)` for its `cond`; a
load-time check (`checkIntimacyGates`) warns in the console otherwise.
Undercroft and captive scenes never carry spice.

NG+ carries over gear, mastery, auto-skills and discovered recipes, with a
growing XP boost.

## Project layout

```
index.html            entry + import map
css/style.css         all UI styling
js/data.js            circles, heroes, skills, enemies, factions, locations, tarot,
                      captive/beast traits, reagents, recipes, pacts, gear
js/story.js           all dialogue: arcs, Undercroft, conquest, endings
js/packs/             character packs (obsidian, northern, classic) + installer
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

Saves go to localStorage under `bindingcodex_save` (export/import codes in
Settings). Balance lives in `js/data.js` and the top of `js/state.js`.
