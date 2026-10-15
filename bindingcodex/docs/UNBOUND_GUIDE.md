# Unbound Writing Guide

Everything Zoe needs to fill the **Unbound** intimacy tier in Binding Codex (104 stubs across 83 scenes).

## How the tiers work

- Every intimate beat has a Gentle, a Steamy and an Unbound version, chosen by **Settings → Intimacy**:
  - `spice: 'gentle'`: fade-to-warm. Written. Shows on Gentle only.
  - `spice: 'steamy'`: sensual, implicit, nothing graphic. Written. Shows on Steamy **and** Unbound.
  - `spice: 'unbound'`: yours. Shows on Unbound only. Each one is a stub that looks like:
    ```js
    { s: 'narr', t: '', spice: 'unbound' }, // ZOE: unbound
    ```
- **Unbound follows Steamy.** On Unbound the player sees the steamy line first, then your lines. The steamy line sets the scene; you pick up where it leaves off and carry the beat to its landing. You don't need to repeat the setting.
- A stub can grow into several lines. Copy the stub line as many times as you need, and give each copy `spice: 'unbound'`. Dialogue works too: `{ s: 'vesper', t: '…', spice: 'unbound' }`.
- An empty stub (`t: ''`) is skipped automatically, so an unfilled stub just reads as the Steamy version.
- **Written stubs live in `js/unbound_lines.js`**, keyed by stub id: each string is one click-through line, and the game swaps them in for the empty stub. To add or revise, edit that file, or send new text and it gets swapped in.
- **Need more context?** `docs/UNBOUND_CONTEXT.md` prints every stub's whole scene in reading order: what leads up to it, the choice the player made, the Gentle and Steamy lines, and the tokens you can use. Regenerate it after changing scenes with `node tools/stub_context.mjs` (run from `bindingcodex/`).
- **Never add intimacy to a captive.** Every event with spice lines is gated by `free(...)`, so it can only fire once the character is a free ally. On load, the game logs a console warning if any spice line could be reached otherwise.

## Consent framing you can rely on

- **Romance beats** (`*_romance`) fire only at high bond (7+) and only for free allies. The player always picks the approach: a dominant choice or a tender one.
- **Revisit beats** (`*_revisit`) are for characters whose story began in chains: Calla, Mira Vane, Aelindra and Elspeth. Each is a negotiated scene between free adults. A separate `*_negotiate` event always comes first. In it, she says what she wants, sets limits, and names a **stop word**, and the player can say yes, no, or "ask me again." The revisit then opens with her checking in, and the stop word stays live the whole scene. Have the stop word appear (or be offered) at least once in your text.
- The card tags shown below come from the Packs GDD. Where it says "see card," the GDD didn't list the tags in full. Use what you know of the original card.

- **Yuki's pronouns** change if Yuki asks the Codex to write her as she is (`yuki_change`). In any line that mentions Yuki, write `{Y:they|she}`, `{Y:them|her}`, `{Y:they come|she comes}` and so on; the game picks the right side.
- **Family scenes** (`*_expecting`, `*_birth`, the hearth epilogue) have no intimacy tiers and no stubs, on purpose. Keep pregnancy and children out of intimate scenes.

## The stubs

File: `js/story.js` (base cast) or `js/packs/<pack>.js` (pack cast). Search for the event id.

### Base cast (`js/story.js`)

| Event | Choice | What to write |
| --- | --- | --- |
| `vesper_romance` | 1 · "Don't." (she asked you not to ask permission) | Vesper's 300 years of patience running out. She's the archivist who's never been on the page, and the Binding at full strength means she *feels* what you feel; use that. Ink-stained fingers, the brass buttons of her coat, every candle leaning toward you. She stays witty right up until she can't. |
| `vesper_romance` | 2 · "Ask anyway, softly." | The same night, but she leads: "she has been waiting a long time to be first at something." Tender, startled, a little bossy. The ink marks she leaves along your jaw and won't let you wash off. |
| `rue_romance` | "Put her in her place." | Rue loses a fight on purpose and admits, once, that she likes being put in her place. The brat going quiet is the beat. Her tail winds around your wrist, she runs hot as a forge, and the bookshelf literally smokes. Her brand flares if she lies, so she can't pretend she didn't want this. |
| `isolde_romance` | "Take her hands in yours." | She takes off her gauntlets for the first time and shows you the warlock-slayer brands burned into her palms. Devotion through action, few words. Cold armor, warm knight. The scene is about her being touched by the hands she was ashamed of. |
| `calla_choice` | "Are you sure?" | romance, her choice | A few nights after her first night outside (which stays tender, with no Unbound tier). Calla has been out in the world; she comes to you on the roof and asks for herself: not thanks, not owing. Under the open sky she found again, every step hers. |
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
| `tribe_pride_rite` | "Accept her." | breeding, monster (cheetah-folk) | Tashra, first runner of the Sunrun Pride, asks to bear your litter now that the Pride has stopped running. Out in the long grass under a yellow moon: a chase she lets you win, a pounce with claws sheathed, purring, quick and playful and hungry. Spots, tail, warm fur, sun-warmed grass. |
| `envoy_night_pride` | "Race her out to the long grass." | monster (cheetah-folk), repeatable | Tashra's Bower evening. Shorter and familiar: the race, the tumble in the grass, the purr. |
| `kin_rite_pride` | "Accept her." | breeding, monster (cheetah-folk), repeatable, `{kin}` | Any of the Pride's 12 runners (`{kin}`, `{kinWho}`). The long grass, a chase she lets you win. She chose you over the long chase across the grasslands. |
| `kin_night_aerie` | "Take her up to the roof nests." | monster (harpy), repeatable, `{kin}` | You sent for one of your harpy kin by name. She already knows you; write it warmer and more familiar than her first rite. Roof nests, wings against the cold. |
| `kin_night_coil` | "Join her in the warm cistern." | monster (naga), repeatable, `{kin}` | A naga kin you sent for. Warm water, coils, unhurried and sure of you. |
| `kin_night_clutch` | "Go to the hatchery fires with her." | monster (drake-kin), repeatable, `{kin}` | A drake-kin kin you sent for. A rematch she means to lose again. |
| `kin_night_pride` | "Race her out to the long grass." | monster (cheetah-folk), repeatable, `{kin}` | A cheetah-folk kin you sent for. The chase again, laughing this time, then purring. |
| `nyxe_mantle` | "Then come down here and explode." | monster forms, abyssal | Nyxe faces something more monstrous than herself and is speechless for the first time, then very loud. Wings everywhere. |

### Wildkin guests (`js/packs/guests.js`)

Four beast-folk men who came asking for protection from the tribe that hunted them. All are grown adults (ages in their descriptions); keep childlike framing out of intimate text. He/him.

| Event | Choice | Tags | What to write |
| --- | --- | --- | --- |
| `bramble_romance` | either choice | romance, femboy | Bramble (bunny-folk, 23), Hollow Warren, Pale Wood. Shy, quick, freckled, cream rabbit ears and a cottontail that twitches when he's touched; his nose twitches when he lies. He gave you clover (a Warren courting gift). Soft and eager once he stops listening for wings. Kind choice: he's held; firm choice: he's caught, and glad. |
| `bramble_evening` | "Spend the night with him." | repeatable | Familiar now, every third night. Shorter and warmer than the first time. |
| `bramble_shared` | (first choice) | group, sapient partners | He and Kestra (harpy): she used to hunt his Warren; now she guards his window. Feathers and flushed ears. |
| `ren_romance` | either choice | romance, femboy | Ren (fox-folk, 26), Ember Den, Charmed Glade. Sly, flirty, a thief who returns what he steals; the smile is armor. Red fox-tail that curls around you. Under the teasing, breathless and honest. Kind choice: he's held; firm choice: he's caught, and glad. |
| `ren_evening` | "Spend the night with him." | repeatable | Familiar now, every third night. Shorter and warmer than the first time. |
| `ren_shared` | (first choice) | group, sapient partners | He and Tashra (cheetah-folk): a hunt nobody wants to end. Purrs, red fur, wicked laughter. |
| `elio_romance` | either choice | romance, femboy | Elio (fawn-folk, 24), Snowline Herd, Ashreach. Gentle, soft-spoken, dappled freckles and velvet antlers; his people freeze when afraid and he's choosing not to. The Pale Stag sent him. Wondering, then not gentle at all. Kind choice: he's held; firm choice: he's caught, and glad. |
| `elio_evening` | "Spend the night with him." | repeatable | Familiar now, every third night. Shorter and warmer than the first time. |
| `elio_shared` | (first choice) | group, sapient partners | He and Vharra (drake-kin): a fawn and a dragon making peace by the hatchery fires. Heat and wonder. |
| `tallow_romance` | either choice | romance, femboy | Tallow (moth-folk, 27), Lantern Court, Black Mire. Dreamy and a little dramatic, fluffy collar, feathery antennae, dusty soft wings; drawn to the warmest light, which is you. He dims his wings to show he's sincere. Kind choice: he's held; firm choice: he's caught, and glad. |
| `tallow_evening` | "Spend the night with him." | repeatable | Familiar now, every third night. Shorter and warmer than the first time. |
| `tallow_shared` | (first choice) | group, sapient partners | He and Sythra (naga): coils and soft wings in the lantern-lit brood-pools. |

### Through the Rift: Larkspur Lane (`js/packs/rift.js`)

Five women from a suburban cul-de-sac that fell into the fen. All are adults in their 40s and 50s (ages in their descriptions), free townsfolk under the Codex's protection, never captives. **Victoria and Joanne are married and unfulfilled**: their husbands (Harold; Gary from number nine) know and approve, so it's hotwife, not cheating. Harold wants to hear all about it afterward; Gary just wants Joanne to glow. Diane is single, Margot divorced, Moira widowed. Their romances open at favor 8, after all three of their errands and their personal story. The tone is warm, with a little culture-clash comedy. No family-relation framing.

| Event | Choice | Tags | What to write |
| --- | --- | --- | --- |
| `victoria_romance_lead` | 1 · "Then take what you want, Madam President." | power dynamic, workplace authority, older woman, hotwife | Victoria (44), ex-CFO and HOA president, runs the Lane's books. Glasses, pearls, clipboard. Married to gentle Harold, who can't match her and knows it; he sent her to you and wants a full report. She's in charge and very good at it: precise orders, earned rewards, in her own counting-house. |
| `victoria_romance` | 2 · "No. Tonight you put the clipboard down." | power dynamic, reversal | The same night, reversed: nobody has told her no in twenty-two years. You take the pen, the glasses, the control; she obeys like it's a relief. |
| `victoria_evening` | "Stay the night." | repeatable, hotwife | Familiar now, every third night. Harold's at his model-railway club; she'll be telling him everything. "One item on the agenda." |
| `joanne_romance` | either choice | older woman, tenderness, hotwife | Joanne (52), innkeeper of the Kettle & Crown. Auburn curls, gingham apron, soft and generous. Thirty years married to sweet, sleepy Gary; roommates for the last ten. He's on watch tonight and told her to "go glow a little." She's fed everyone for thirty years; tonight she's the one taken care of. Nervous at first, then not. |
| `joanne_evening` | "Stay the night." | repeatable, hotwife | Upstairs at the inn while Gary's on night watch (he says hello). Not nervous anymore. |
| `diane_romance` | either choice | older woman, flexibility | Diane (49), herb-wife, ex-yoga-in-the-park evangelist, greenhouse of glowing, affectionate plants. Done being "harmless". Astonishingly flexible and unashamed; the vines help. |
| `diane_evening` | "Stay the night." | repeatable | Among the night-blooming flowers. A pose she swears she invented for you. |
| `margot_romance` | either choice | older woman, flirt | Margot (46), twice divorced, hot pink, platinum blowout, hoops. Told she was "too much" all her life. Loud, shameless, delighted; she's exactly enough. The firm choice turns all that brass into begging. |
| `margot_evening` | "Stay the night." | repeatable | The stockroom, the counter, regrettably the display case. |
| `moira_romance` | either choice | older woman, dark aesthetic | Moira (55), goth widow and hexwife. Black lace, silver rings, a silver streak in black curls, a voice like velvet in a crypt. Slow, deliberate, utterly sure. Her black candle has burned for you since the night you met. |
| `moira_evening` | "Stay the night." | repeatable | Candle-light and cool hands; the candle burns down before you're done. |

**Celeste: the affair.** Celeste (39), ex-dancer, married fifteen years to Brad, a realtor who is always on a call and hasn't touched her in a year. **Brad doesn't know.** This one is a real affair: the thrill is the secret, never coercion. She chooses it, and says so. The arc runs from her porch to a note, then the greenhouse, secret evenings, a close call, and a crossroads (end it, or keep going until she's pregnant).

| Event | Choice | Tags | What to write |
| --- | --- | --- | --- |
| `celeste_romance` | 1 · Take the ring off her finger, and kiss her. | affair, married, forbidden | The first night, in Diane's greenhouse at midnight, among glowing vines. Her wedding ring sits on a potting bench. Under the tennis whites she's still a dancer: strong, flexible, and shameless once she stops thinking. A year of nothing breaking all at once. |
| `celeste_romance` | 2 · "Then let me look at you first." | affair, married, slow | The same night, slower: nobody has looked at her in a year. Being seen undoes her before anything else does. |
| `celeste_evening` | Stay the night. | repeatable, affair | Stolen and quick: the greenhouse, a hayloft, once the back of Margot's stall, her hand over her own mouth. After she leaves Brad it's no longer secret, so warmer and slower. Never during pregnancy (the evening is closed then). |

**Lane group scenes.** Everyone in them has had her own romance with Zoe and is at favor 8+. They're reached from buttons at the top of the Larkspur Lane screen. The husbands know and approve; Celeste is at the block party only if she has left Brad.

| Event | Choice | Tags | What to write |
| --- | --- | --- | --- |
| `lane_poker_night` | 1 · "Both of you. Now." | group, hotwife, dominance | Victoria and Joanne, while Harold and Gary play poker (and know exactly where their wives are). Victoria tries to run it and finally lets go; Joanne is soft, generous and shameless now that she has company. By the end they're holding hands across Zoe. Harold wants a written summary. |
| `lane_poker_night` | 2 · "Then show me what you two worked out." | group, hotwife, spoiling | The same night, their plan: Victoria keeps score, Joanne ignores the plan, and Zoe gets spoiled thoroughly by both. |
| `lane_coven_of_two` | 1 · Step into the candlelight with them. | group, witchy | Diane and Moira in the greenhouse at midnight, by a hundred black candles. Herbs and hexes: Diane flexible and laughing, Moira slow and certain, and the vines "promised to behave" (the vines lie). |
| `lane_coven_of_two` | 2 · "Teach me something. Both of you." | group, witchy, dominance | Every "lesson" is a dare, and Zoe takes them all until the two most composed women on the Lane are the breathless ones. |
| `lane_block_party` | 1 · "Motion carries. Everyone inside." | group, polyamory, hotwife | The after-party at the biggest house on the Lane: every Lane woman who's close to Zoe (3 to 6 of Victoria, Joanne, Diane, Margot, Moira, and Celeste if she left Brad; their lines are conditional). Each exactly as she is: bossy, soft, flexible, loud, slow, reckless. Keep it working whoever is present. The husbands are bowling. |
| `lane_block_party` | 2 · "I want to dance with every one of you first." | group, polyamory | One slow dance with each under the string lights, then all of them indoors, each making sure Zoe knows why she chose her. |

### Hearts & Hearth (`js/packs/hearts.js`)

Group scenes. Every participant is a free ally who has had her own romance and is at bond 8+ (the Envoys' Council needs two or more envoys who've had the rite). Characters whose lines have *(only if …)* in the context doc may or may not be there; write so the scene works either way.

| Event | Choice | Tags | What to write |
| --- | --- | --- | --- |
| `circle_pact` | 1 · "Then it's decided. All of us, all in." | group, polyamory | The Inner Circle's first night: Vesper, Rue and Isolde all at once, warm and clumsy until they stop being polite. Vesper feels every touch through the Binding twice over; Rue is forge-hot and can't lie about what she wants; Isolde gives herself with total devotion. Nobody at the edge. |
| `circle_pact` | 2 · "Kneel. All three of you." | group, dominance | The same night, commanded. Isolde wants orders, Rue wants to be put in her place, Vesper wants to stop being the one in control for once. Take them one at a time, then together. |
| `circle_night` | 1 · Take command of all three | group, dominance, honesty play | Rue's game: truth or truth, and her brand flares if anyone lies. Every honest answer becomes an order you give. Isolde kneels for hers; Vesper feels all of it through the Binding at once. |
| `circle_night` | 2 · Let them take you apart | group, receiving | The game turned on you: every question is about what you want, and every true answer is something three of them give you. |
| `circle_mantle` | (top) | group, monster forms | The Mantle among the Circle: Rue meets you demon to monster, Isolde worships the storm she was trained to fear, Vesper feels the wings and horns through the Binding and loses her words. Wings closed around all three. |
| `circle_lysandre` | "Come in, Lysandre." | group, shapeshifting | Lysandre joins the Circle (five now). She learns how many shapes there are for being wanted: coiled around Isolde, winged against Rue, every form welcomed, until she stops needing to shift. |
| `dawnward_hearts` | 1 · "Kneel again. Here." | group, bend the knee | Hot spring in a cleared rift. The Dawnward Company knelt to you in defeat once; this time they kneel because they want to. Erin's strength, Sakura's fearless hands, Shiro's patience. Yuki is in the scene only if their own romance happened (check the cond line). |
| `dawnward_hearts` | 2 · Open your arms | group, polyamory | The same spring, softer: laughter first, then the curtain of steam stays drawn. End on Shiro's drowsy "Motion carries unanimously." |
| `brats` | 1 · "Both of you. Put the cards down." | group, bratty, dominance | Rue and Nyxe, nemeses since the Bazaar, put in their place together. Two tails, two smart mouths, competing to behave worse and beg better, both losing to you gloriously. |
| `brats` | 2 · Let them settle it | group, bratty, rivalry | The two brats out-do each other at pleasing you until the rivalry melts into something warm and loud. |
| `two_altars` | (top) | group, devotion, worship | Rhea (the zealot who gives everything) and Valdra (the priestess who knows every rite) worship you together at an altar in the chapel stacks. Slow, solemn, fervent. With the Mantle, Rhea's prayer for real wings is answered. |
| `envoys_council` | "Join the council." | group, monster, sapient partners | A council on the library roof under the full moon: every envoy who's had the rite and is close to you (2 to 4 of Kestra, Sythra, Vharra, Tashra; their lines are conditional). Feathers, coils, fur and fire, each in her tribe's way. Keep it working whichever envoys are present. |

### Companions (`js/companions.js`)

**The Dawnward Company's romances.** After they bend the knee and reach bond 7.

| Event | Choice | Tags | What to write |
| --- | --- | --- | --- |
| `erin_romance` | 1 · Pull her up and kiss her | romance | The golden knight who lost a spar on purpose. All at once, all in, armor off piece by piece with laughter and no shame. |
| `erin_romance` | 2 · "Stay down. I like you there." | romance, dominance | Erin discovering, loudly and happily, how much she likes being told to. |
| `sakura_romance` | 1 · "Be brave at me." | romance, shy | Shy for one breath, then the Lodge's most dangerous talent; stray petals of magic drift down all night. She stops apologizing. |
| `sakura_romance` | 2 · Take her hat and draw her in | romance, dominance | No hat brim to hide behind, so she has nowhere to look but you. |
| `shiro_romance` | 1 · "Then find out." | romance, slow-burn | The White Queen plays the night like a patient game, then gives up strategy entirely. |
| `shiro_romance` | 2 · Write one line in her ledger | romance, dominance | You wrote MINE in her ledger. For the first time she does exactly as she's told, with enthusiasm. |
| `yuki_romance` | either choice | romance | Two versions. **After Yuki's request** (`yuki_change`, she/her): she stands in the doorway in the new shape she asked the Codex for, welcomed by the Company, still a little unsure of it. **Before** (they/them): Yuki, earnest, trembling, fearless, laughing afterward like they can't believe they're allowed. Lines carry `when: 'yuki_femme'` or `when: 'yuki_they'`. |

**Evenings.** Repeatable: from her Companion page, every other night, once her romance has happened. The player chooses "Spend the night together" or "Just stay and talk." These are the familiar nights, so keep them shorter and warmer than the first time; you can write several lines and they'll play each time. One stub each:

| Event | Choice | Tags | What to write |
| --- | --- | --- | --- |
| `vesper_evening` | Spend the night together | repeatable | Among the stacks; the Binding makes it impossible to tell whose wanting is whose. |
| `rue_evening` | Spend the night together | repeatable | Putting her in her place again; she can't say anything that makes the brand flare. |
| `isolde_evening` | Spend the night together | repeatable | Gauntlets off; the devotion she gave the Order, all yours. |
| `lysandre_evening` | Spend the night together | repeatable | Shape to shape under your hands until she settles on one. |
| `erin_evening` | Spend the night together | repeatable | Loud, warm, golden, unashamed. |
| `sakura_evening` | Spend the night together | repeatable | Shy no longer; petals of stray magic. |
| `shiro_evening` | Spend the night together | repeatable | A patient game she tips her own king in. |
| `yuki_evening` | Spend the night together | repeatable | Earnest and fearless (they/them). |
| `elara_evening` | Spend the night together | repeatable | Centuries of patience, curious about every inch. |
| `seraphine_evening` | Spend the night together | repeatable | Her plan, executed, then abandoned for something better (married, affair). |
| `sister_maren_evening` | Spend the night together | repeatable | Sworn to want nothing; wanting everything. |
| `kira_evening` | Spend the night together | repeatable | Upstairs over the Drowned Rose; every rule out the window. |
| `nyxe_evening` | Spend the night together | repeatable | She dares you to make her behave; you take the dare. |
| `rhea_evening` | Spend the night together | repeatable | Total, fervent worship. |
| `valdra_evening` | Spend the night together | repeatable | Every rite of the body, slow and solemn. |
| `aurelia_evening` | Spend the night together | repeatable | You give the orders; the legate follows them perfectly and begs for more. |
| `brynn_evening` | Spend the night together | repeatable | Earthy, curious, experimenting; a candle that smells like rain. |
| `sera_evening` | Spend the night together | repeatable | Everything she never dared put in a letter. |
| `seris_evening` | Spend the night together | repeatable | A hypothesis tested with exhaustive rigor. |
| `auren_voss_evening` | Spend the night together | repeatable | Unhurried, practiced, taking all of it (married, affair, mature). |
| `revenant_bride_evening` | Spend the night together | repeatable | The wedding night she never had; cold to fever-bright under your hands. |
| `mira_ashveil_evening` | Spend the night together | repeatable | Making new rumors above the Lantern & Ash. |
| `maren_soleil_evening` | Spend the night together | repeatable | Close observation, thoroughly. |
| `cole_ashmer_evening` | Spend the night together | repeatable | Steady and careful, then not careful at all (he/him). |
| `calla_evening` | Spend the night together | repeatable | No game tonight; just Calla choosing you. |
| `mira_vane_evening` | Spend the night together | repeatable | Her chain on your nightstand; nothing at her wrists. |
| `aelindra_evening` | Spend the night together | repeatable | Every secret she notices, used and kept. |
| `elspeth_evening` | Spend the night together | repeatable | Raised to be decorative; tonight bold and discovering. |

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
- **Victoria**: crisp, corporate, dry. Talks in bylaws and receipts. Her composure is the thing that breaks.
- **Joanne**: warm, born hostess. "Honey," "sweetheart." Feeds everyone.
- **Diane**: earnest, outdoorsy, gently wicked once she lets herself be.
- **Margot**: brassy, flirty, "babe." All flash on top, sharp underneath.
- **Moira**: velvet and gallows humor. "Dear." Never hurries.
- **Celeste**: polished, wry, lonely under it, and reckless once she lets herself be. Turns her ring when she's nervous.
