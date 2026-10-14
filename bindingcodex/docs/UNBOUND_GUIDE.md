# Unbound Writing Guide

Everything Zoe needs to fill the **Unbound** intimacy tier in Binding Codex (49 stubs across 36 scenes).

## How the tiers work

- Every intimate beat comes in three versions, and the game shows **exactly one** of them, chosen by **Settings → Intimacy**:
  - `spice: 'gentle'`: fade-to-warm. Written.
  - `spice: 'steamy'`: sensual, implicit, nothing graphic. Written.
  - `spice: 'unbound'`: yours. Each one is a stub that looks like:
    ```js
    { s: 'narr', t: '', spice: 'unbound' }, // ZOE: unbound
    ```
- Unbound **replaces** the steamy line rather than following it. A player on Unbound never sees the steamy text, so each stub has to carry the whole beat on its own: the lead-in, the scene, and the landing. Read the steamy line next to the stub first, then write the full version.
- A stub can grow into several lines. Copy the stub line as many times as you need, and give each copy `spice: 'unbound'`. Dialogue works too: `{ s: 'vesper', t: '…', spice: 'unbound' }`.
- An empty stub (`t: ''`) is skipped automatically, so an unfilled stub just means the scene ends a beat early on Unbound.
- **Never add intimacy to a captive.** Every event with spice lines is gated by `free(...)`, so it can only fire once the character is a free ally. On load, the game logs a console warning if any spice line could be reached otherwise.

## Consent framing you can rely on

- **Romance beats** (`*_romance`) fire only at high bond (7+) and only for free allies. The player always picks the approach: a dominant choice or a tender one.
- **Revisit beats** (`*_revisit`) are for characters whose story began in chains: Calla, Mira Vane, Aelindra and Elspeth. Each is a negotiated scene between free adults. A separate `*_negotiate` event always comes first. In it, she says what she wants, sets limits, and names a **stop word**, and the player can say yes, no, or "ask me again." The revisit then opens with her checking in, and the stop word stays live the whole scene. Have the stop word appear (or be offered) at least once in your text.
- The card tags shown below come from the Packs GDD. Where it says "see card," the GDD didn't list the tags in full. Use what you know of the original card.

## The stubs

File: `js/story.js` (base cast) or `js/packs/<pack>.js` (pack cast). Search for the event id.

### Base cast (`js/story.js`)

| Event | Choice | What to write |
| --- | --- | --- |
| `vesper_romance` | 1 · "Don't." (she asked you not to ask permission) | Vesper's 300 years of patience running out. She's the archivist who's never been on the page, and the Binding at full strength means she *feels* what you feel; use that. Ink-stained fingers, the brass buttons of her coat, every candle leaning toward you. She stays witty right up until she can't. |
| `vesper_romance` | 2 · "Ask anyway, softly." | The same night, but she leads: "she has been waiting a long time to be first at something." Tender, startled, a little bossy. The ink marks she leaves along your jaw and won't let you wash off. |
| `rue_romance` | "Put her in her place." | Rue loses a fight on purpose and admits, once, that she likes being put in her place. The brat going quiet is the beat. Her tail winds around your wrist, she runs hot as a forge, and the bookshelf literally smokes. Her brand flares if she lies, so she can't pretend she didn't want this. |
| `isolde_romance` | "Take her hands in yours." | She takes off her gauntlets for the first time and shows you the warlock-slayer brands burned into her palms. Devotion through action, few words. Cold armor, warm knight. The scene is about her being touched by the hands she was ashamed of. |
| `calla_first_night` | "Sit beside her." | Calla's first night out of the cells, on the library roof under the sky she'd forgotten. Very tender, very tentative. She keeps asking "is this allowed?" This is her first real choice in years, so make every step of it hers. |
| `calla_revisit` | (top) | Negotiated captor/captive roleplay. Her terms: the old cell, **your** colors, nothing on her throat (no brand imagery, ever), stop word **"sister."** The door stays open the whole time and she never looks at it. Play the defiant envoy melting into wanting it, and land on choice. |

### Pack 1: Obsidian College (`js/packs/obsidian.js`)

| Event | Choice | Tags | What to write |
| --- | --- | --- | --- |
| `seris_romance` | 1 · "Make her say it." | dominance, humiliation (her losing face), breeding | The rival who keeps losing asks to lose *properly*. Her composure cracking is the whole point: make her say she wants it, then say it again. She keeps "notes" after, in a shaking hand. |
| `seris_romance` | 2 · "Pull her down beside you." | same | Softer: Seris stops narrating and just lets herself be wanted. |
| `auren_voss_romance` | 1 · "Look at her properly." | married, affair, mature, breeding | A Regent's wife, eleven years unlooked-at, who sets her ring on the table like a winning card. Unhurried, composed, makes you wait, then very much doesn't. Silk buttons. |
| `auren_voss_romance` | 2 · "Only if you're sure." | same | "Nine years sure." She leads, a planner finally playing the game she's planned. |
| `revenant_bride_romance` | "Hold her." | slow-burn, tragic | A ghost becoming solid. Cold turning warm, re-learning touch after 200 years, the wedding vow she never finished. Wonder and grief together. |
| `mira_ashveil_romance` | 1 · "Pocket the key." | romance, breeding | After closing at the Lantern & Ash. Bright, wicked, laughing. Behind the bar. |
| `mira_ashveil_romance` | 2 · "Kiss her against the door." | same | Cinnamon and ale. She's been planning this since the first drink on the house, and her hands reach your belt first. |
| `maren_soleil_romance` | 1 · "Read it aloud." | romance | Her "final report" just says your name a lot. Flustered, furious, laughing, pinning you to stop you reading. |
| `maren_soleil_romance` | 2 · "Write a reply." | same | Three words, and then a College agent who finally stops taking notes. |
| `cole_ashmer_romance` | "Show him he already is." | romance-optional | Gruff, not good with words, careful with you like a guard with something precious. Steady and devoted. |

### Pack 2: Northern Reach (`js/packs/northern.js`)

| Event | Choice | Tags | What to write |
| --- | --- | --- | --- |
| `nyxe_romance` | 1 · "Win the bet." | bratty (see card) | She dares you to put her in a place. Mouthy right up to the moment she isn't, then very quiet and very good, and she'll deny it loudly at breakfast. Wings and tail. |
| `nyxe_romance` | 2 · "Ignore her until she behaves." | same | She lasts four minutes. Then she's in your lap, asking nicely in a voice you've never heard, and you make her keep asking. |
| `mira_vane_revisit` | (top) | bondage (as free ally only) | Her terms: **silk, not iron**, wrists only, frequent check-ins, stop word **"forge."** The forge-chains were her worst memory, so the scene is about surrender she *chose*, held still by someone who'd let go the second she asked. She laughs and says keep going. |
| `rhea_romance` | 1 · "Then get up and show me." | see card | A zealot who worshipped a fake dragon for nine years and turns all that devotion on you. Fire, certainty, a kiss like a vow. |
| `rhea_romance` | 2 · "Kneel with her." | same | No one has ever met her on the floor. Devotion going both ways. |
| `valdra_romance` | 1 · "Then pray to me." | see card | A high priestess of 90 years whose prayers went unanswered for 30 of them. A rite older than the Coven, her hands on you instead of the altar. Dignified, then not. |
| `valdra_romance` | 2 · "You don't need to pray anymore." | same | Ninety years of discipline going out in one breath, and learning what it is to be worshipped. |
| `aelindra_revisit` | (top) | restraint play (after release only) | A game: she's the spy and you caught her. Stop word **"Concord."** "I'm not caught. I'm choosing. Now catch me." A chase through the moonlit stacks, a teasing "interrogation" she loses on purpose. |
| `aurelia_romance` | 1 · "Give her one." | command dynamic | Twelve years of command, finally taking an order. A soldier's precision, a very unsoldierly flush. |
| `aurelia_romance` | 2 · "At ease, Legate." | same | Taking off her armor piece by piece. Just Aurelia for one night. |
| `brynn_romance` | "Your cauldron's right." | see card | A hedge-witch who walked through a blizzard and isn't afraid of anything. Warm, unhurried, apron and all. |
| `sera_romance` | "Take her other glove off for her." | married, affair | The Thane's wife, untouched for six years. Glove by glove, then the red gown herself, impatient. The frost-in-the-sun image. |

### Pack 3: Classic Fantasy (`js/packs/classic.js`)

| Event | Choice | Tags | What to write |
| --- | --- | --- | --- |
| `elara_romance` | "Let her explore." | slow-burn, first curiosity in a century | An elf who hasn't wanted anything in 100 years. Ancient patience, newly woken hunger. Every discovery lights her eyes like frost. |
| `seraphine_romance` | 1 · "You decided. Now I decide." | married, affair, has decided on you | Someone finally takes the decision out of her hands. Silk on the floor, the upper city's most composed woman undone. |
| `seraphine_romance` | 2 · "Bow over her hand." | same | Charmed in spite of herself. She plans her pleasures like her investments, a whole week of the races. |
| `elspeth_revisit` | (top) | restraint play (as free ally only) | Her terms: **ribbon, not rope**, nothing like the Forge storeroom, you ask if she's alright often, stop word **"Ardane"** (her family name). The difference between helpless and choosing to be held. |
| `sister_maren_romance` | 1 · "Are you certain? Your vow—" | forbidden, vow-breaking | She has prayed on it for months, and this is her answer. A kiss like a prayer, then something far less holy. She savors breaking it deliberately. |
| `sister_maren_romance` | 2 · "Take the sash from her hands." | same | The red sash and ten years of discipline let go together. |
| `kira_romance` | "Break it with her." | rule-breaking | "No sleeping with regulars." Laughing, loud, the back room of the Drowned Rose, bottles rattling. |

### Wildkin (`js/packs/wildkin.js`)

All partners here are **sapient adults speaking for themselves**. Menagerie beasts are animals and are never partners. In a tribe rite, the envoy asks for herself and declining never costs the tribe's fealty. If the warlock has sworn **the Wyrm's Mantle** (`S.flags.pact_wyrm_mantle`), a `mantled` line plays before your stub. You can branch your own Unbound lines the same way with `cond: S => !!S.flags.pact_wyrm_mantle`.

| Event | Choice | Tags | What to write |
| --- | --- | --- | --- |
| `tribe_aerie_rite` | "Accept her." | breeding, monster (harpy) | Kestra, wing-sister of the Skyrend Aerie, asked to carry your blood to the high nests. Set it in the Pale Wood's highest branch under the full moon: wings mantled around you both like a living tent, fierce and playful, feathers and heat, harpy courtship. Talons, a hawk's cry. |
| `tribe_coil_rite` | "Accept her." | breeding, monster (naga) | Sythra, voice of the Coil, in the warm brood-pools under the Black Mire. Coil after coil, slow and deliberate, impossibly patient, the hiss of your name. Naga oaths are "held, and released," so echo that. |
| `tribe_clutch_rite` | "Accept her." | breeding, monster (drake-kin) | Vharra, blade of the Clutch, in the forge-warm hatchery of the Ashreach. A courtship like a duel she means to lose: fierce, hot-blooded, wings snapping wide, drake-kin pride. If mantled: "Kin." |
| `lysandre_romance` | 1 · "As she truly is" | shapeshifting, breeding | Every shape falls away. Being wanted exactly as she is undoes her more than any transformation. |
| `lysandre_romance` | 2 · "Her drake-shape" | monster forms | Heat and strength, careful claws, wings around you both. A flier learning to hold still, then not. |
| `lysandre_romance` | 3 · "Her serpent-shape" | monster forms | Coil by gleaming coil, her whole body one embrace that tightens with each shared breath. |
| `rue_mantle` | "Find out." | monster forms, demon | Rue meets the mantled warlock tail-to-tail and horn-to-horn. Two infernal things burn hotter than one: smoke off the sheets, her brand blazing and not one word a lie. |
| `envoy_night_aerie` | "Go up to the high branch with her." | monster (harpy), repeatable | Kestra's repeatable Bower evening (every 3+ days after the rite). Keep it shorter than the rite, and familiar: the high branch, her wings against the wind, the moon. |
| `envoy_night_coil` | "Go down to the brood-pools with her." | monster (naga), repeatable | Sythra's Bower evening in the warm brood-pools. Unhurried as the tide. |
| `envoy_night_clutch` | "Go to the hatchery with her." | monster (drake-kin), repeatable | Vharra's Bower evening by the hatchery fires. A duel she means to lose, again. |
| `kin_rite_aerie` | "Accept her." | breeding, monster (harpy), repeatable, `{kin}` | Another harpy of the Aerie who came to ask for herself (`{kin}` = her name, `{kinWho}` = e.g. "a storm-scout of the Aerie"; 12 possible). Set on the library roof among the Aerie's new nests. Write it so it works for any of them: her own eagerness, wings, feathers, talons. She chose you over the storms. |
| `kin_rite_coil` | "Accept her." | breeding, monster (naga), repeatable, `{kin}` | A naga of the Coil, in the warm cistern under the library. Coils, patience, warm water. She chose you over the far pools. |
| `kin_rite_clutch` | "Accept her." | breeding, monster (drake-kin), repeatable, `{kin}` | A drake-kin of the Clutch, by the hatchery fires. Pride, heat, a duel she means to lose. She chose you over the snowline. |
| `nyxe_mantle` | "Then come down here and explode." | monster forms, abyssal | Nyxe faces something more monstrous than herself and is speechless for the first time, then very loud. Wings everywhere. |

## Voice cheat-sheet

- **Vesper**: dry, teasing, bookish. Hides devotion in wit until it breaks through.
- **Rue**: bratty and theatrical. Brand flares on lies. Secretly desperate to be put in her place.
- **Isolde**: terse and formal. Devotion through action. When emotion shows, it's rare and quiet.
- **Calla**: tentative, earnest, newly free. Asks "is this allowed?"
- **Seris**: precise, sardonic, clinical. "Noted." Her composure is the thing that breaks.
- **Nyxe**: a brat, gleefully, with no shame about it. Pure mischief.
- **Valdra**: ancient, liturgical, dignified.
- **Mira Vane, Aelindra, Elspeth**: give them agency first. The negotiated terms are part of their voice.
- **Kestra** (harpy): bright, birdlike, quick, proud of her flock.
- **Sythra** (naga): languid, teasing, patient. Says "mmm."
- **Vharra** (drake-kin): blunt and fierce. Honors strength, including the strength to refuse.
- **Lysandre**: wistful, shape-shifting mid-sentence, longs to be chosen.
