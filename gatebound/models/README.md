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

**Heroes:** `player`, `erin`, `sakura`, `shiro`, `yuki`

**Monsters:** `goblin` (variants: `archer`, `shaman`, `chief`), `wolf`
(variants: `frost`, `hell`, `dire`), `boar`, `sprite`, `vine` (variant:
`elder`), `skeleton` (variant: `tyrant`), `ghoul`, `wraith`, `cultist`,
`golem` (variant: `colossus`), `sentinel`, `gargoyle`, `elemental` (variant:
`matriarch`), `yeti`, `imp`, `demon`, `herald`

## Suggested Meshy text-to-3D prompts

Keep a consistent style string on every prompt so the cast matches, e.g.
*"low-poly stylized fantasy game character, chibi proportions, clean
silhouette, game-ready, T-pose"*.

- **player** — hooded adventurer in dark charcoal traveling clothes, faint
  cyan glowing trim, short sword, mysterious
- **sakura** — petite shy elf mage, long voluminous curly pink hair, white
  and gold witch outfit, wide-brimmed white witch hat with gold leaves,
  wooden staff topped with a glowing green orb
- **erin** — tall heroic female knight, long sun-blonde hair, polished
  silver breastplate, blue skirt with leather belts, long trailing blue
  scarf, sword and round shield
- **shiro** — elegant pale female tactician, long straight white hair, white
  eyes, black gothic lolita dress with ornate white ruffled bodice, frilled
  black headdress, holding a dark grimoire
- **yuki** — slight earnest young man, blonde hair, blue eyes, simple
  light-green adventurer tunic, plain sword, kind face
- **herald** — towering dark knight boss, void-black ornate armor with
  glowing purple trim, horned crown, tattered cape, greatsword

Export/download as **GLB** and drop the files here.

> Note: the `MESHY_API_KEY` currently stored in the remote environment is
> rejected by the Meshy API (`Invalid API key` — it looks truncated).
> Update the environment variable with a fresh key from
> https://app.meshy.ai/settings/api and automated generation can be wired
> back up.
