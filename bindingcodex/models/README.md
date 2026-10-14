# Dropping in real 3D models (Meshy, or anywhere else)

The game runs entirely on procedural placeholder models. Any actor can be
replaced by a `.glb` file placed in this folder and registered in
`manifest.json` — no code changes needed. Portraits regenerate automatically
from whatever model is loaded.

## manifest.json format

```json
{
  "sakura": "sakura.glb",
  "erin":   { "file": "erin.glb", "scale": 1.2, "y": 0, "rotY": 0 },
  "goblin": "goblin.glb",
  "wolf_frost": "frost_wolf.glb"
}
```

- The key is the **actor id** (see list below). `enemy model + "_" + variant`
  keys (e.g. `wolf_frost`) override the base model for that variant.
- A plain string is the filename; an object lets you tune `scale`
  (default: auto-fit to ~1.6 units tall), `y` offset, and `rotY` (radians —
  the model should face +Z before placement rotation).
- If a file is missing or fails to load, the placeholder is kept. Safe to
  experiment.

## Actor ids

**Heroes:** `player` (variants by pronoun: `she`, `he`, `they`), `vesper`,
`rue`, `isolde`, `erin`, `sakura`, `shiro`, `yuki`, `mira`, `nessa`, `vex`,
`seris`. Reclaimed captives render with their faction's model (`coven_reclaimed`,
`vigil_fallen`, `cultist`).

**Monsters:** `coven` (variants: `acolyte`, `zealot`, `witch`, `trapper`,
`knight`, `envoy`, `matron`, `mother`, `reclaimed`), `vigil` (variants:
`knight`, `rider`, `cantor`, `marshal`, `fallen`), `spider`, `drake`, `stag`
(variant: `great`), `wolf` (variants: `hell`, `dire`, `abyss`), `boar`,
`sprite` (variant: `ice`), `vine` (variant: `elder`), `skeleton` (variants:
`tyrant`, `revenant`), `ghoul`, `wraith` (variants: `banshee`, `queen`),
`cultist`, `golem` (variants: `war`, `colossus`), `sentinel`, `gargoyle`,
`elemental` (variant: `matriarch`), `imp`, `demon` (variant: `general`),
`herald` (variant: `seraph`)

## Suggested Meshy text-to-3D prompts

Keep a consistent style string on every prompt so the cast matches, e.g.
*"low-poly stylized dark fantasy game character, chibi proportions, clean
silhouette, game-ready, T-pose"*.

- **player** — hooded warlock in a long ash-black coat lined with violet,
  a glowing violet sigil on the wrist, a small orb of hex-light in one hand
- **vesper** — pale woman, ink-black hair loosely pinned with a quill,
  smoky grey eyes, high-collared dark archivist coat with brass buttons,
  ink-stained fingers, faint violet sigil on her left wrist, holding a book
- **rue** — small demon woman, messy crimson hair, small curved obsidian
  horns, glowing ember-orange eyes, slim spaded tail, tattered black corset
  jacket, glowing ember brand on her collarbone, mischievous grin
- **isolde** — tall woman knight, short ash-blonde hair, steel-grey eyes,
  scar across one eyebrow, dark weathered plate armor with faint violet
  runes, tattered black cloak, longsword
- **coven_envoy** — young woman in ash-grey Coven robes, a glowing
  burning-hand brand on the side of her throat, staff
- **coven_mother** — Mother Cinder: regal older woman, silver hair, black
  and ember robes, a crown of cinders, burning-hand brand
- **vigil_knight** — pale steel plate, white tabard with a gold sigil
  cross, closed helm, warlock-slayer sword

Export/download as **GLB** and drop the files here.

> Note: the `MESHY_API_KEY` currently stored in the remote environment is
> rejected by the Meshy API (`Invalid API key` — it looks truncated).
> Update the environment variable with a fresh key from
> https://app.meshy.ai/settings/api and automated generation can be wired
> back up.
