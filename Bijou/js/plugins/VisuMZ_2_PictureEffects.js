//=============================================================================
// VisuStella MZ - Picture Effects
// VisuMZ_2_PictureEffects.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_2_PictureEffects = true;

var VisuMZ = VisuMZ || {};
VisuMZ.PictureEffects = VisuMZ.PictureEffects || {};
VisuMZ.PictureEffects.version = 1.00;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 2] [Version 1.00] [PictureEffects]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Picture_Effects_VisuStella_MZ
 * @base VisuMZ_0_CoreEngine
 * @orderAfter VisuMZ_0_CoreEngine
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * Picture Effects is a comprehensive toolkit for enhancing RPG Maker MZ's
 * picture by allowing various effects and transitions within your game. With
 * over 70 different types of effects, users can adjust and animate pictures in
 * various ways, ranging from banner-style transitions, hue shifts, many tonal
 * changes, blur effects, transformations, and more.
 *
 * Features include all (but not limited to) the following:
 * 
 * * Over 70 different Plugin Commands that will adjust and move pictures to
 *   perform various Picture Effects.
 * * A plethora of picture transitions are available that are useful for banner
 *   like images to enter/exit from view.
 * * Quick Plugin Commands that allow sorting a bunch of pictures on the screen
 *   into single file lines, by rows, or by columns.
 * * Some effects have the ability to transform images into other graphics.
 * * A batch of tone shifting effects that may be tedious to do otherwise.
 * * Hue shifts can be applied to pictures to give more color variety.
 * * Blur Filters can now be applied to pictures to add blurry effects.
 * * Hovering and Sidestep effects allow pictures to move continuously up/down
 *   and/or left/right without constant event commands.
 * * Breathing effects can make pictures look like they're breathing in and out
 *   in an alive fashion.
 * * Swaying effects allow the pictures to rock its angles back and forth.
 * * A depth of field effect where the player's mouse position can shift the
 *   perspective of a picture by having it go a certain direction.
 * * Z Layer is now added to pictures. Game devs can now easily move pictures
 *   in front or behind other pictures by simply changing their Z values.
 *
 * ============================================================================
 * Requirements
 * ============================================================================
 *
 * This plugin is made for RPG Maker MZ. This will not work in other iterations
 * of RPG Maker.
 *
 * ------ Required Plugin List ------
 *
 * * VisuMZ_0_CoreEngine
 *
 * This plugin requires the above listed plugins to be installed inside your
 * game's Plugin Manager list in order to work. You cannot start your game with
 * this plugin enabled without the listed plugins.
 *
 * ------ Tier 2 ------
 *
 * This plugin is a Tier 2 plugin. Place it under other plugins of lower tier
 * value on your Plugin Manager list (ie: 0, 1, 2, 3, 4, 5). This is to ensure
 * that your plugins will have the best compatibility with the rest of the
 * VisuStella MZ library.
 *
 * ============================================================================
 * Instructions - Quick Start
 * ============================================================================
 *
 * Here are some quick instructions on getting started.
 *
 * ---
 * 
 * Step 1: "Show Picture" Event Command
 * 
 * 1. Create a new event and use the "Show Picture" event command.
 * 2. Pick the image you want and the position you want the image to be
 *    displayed at. We recommend using "Center" for the position origin.
 * 3. This will be where the image either starts or ends. The relative position
 *    will vary depending on the Picture Effect and its parameters used.
 * 4. Remember the Picture's ID number. This will be used later.
 * 
 * ---
 * 
 * Step 2: "Picture Effect" Plugin Command
 * 
 * 1. Immediately after the "Show Picture" event command, under event commands,
 *    select "Plugin Command" and select the "VisuMZ_2_PictureEffects" plugin
 *    from the list.
 * 2. Select the desired "Picture Effect" you wish to apply.
 * 3. Under the "Picture ID(s)" parameter, insert the ID of the picture from
 *    Step 1.
 * 4. Adjust the other parameters as needed.
 * 
 * ---
 * 
 * Step 3: Play Test
 * 
 * 1. Save the event and save the game project.
 * 2. Click Play Test and launch the event to make sure the effect is working
 *    properly. Some effects are jointed (namely the ones with "In/Out" in
 *    their Plugin Command names). You may need to put them back to back.
 * 
 * ---
 *
 * ============================================================================
 * Major Changes
 * ============================================================================
 *
 * This plugin adds some new hard-coded features to RPG Maker MZ's functions.
 * The following is a list of them.
 *
 * ---
 *
 * Event Commands
 * 
 * Keep in mind that when Picture Effects are used, using event commands that
 * move, show, or erase the picture will very likely have an impact on how the
 * Picture Effects are carried out. It is best for you to wait until they're
 * done to make sure the Picture Effects are working as intended.
 * 
 * We are not responsible for how Picture Effects turn out if you interrupt
 * them with event commands, script calls, or other Plugin Commands.
 *
 * ---
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * The following are Plugin Commands that come with this plugin. They can be
 * accessed through the Plugin Command event command.
 *
 * ---
 *
 * === Effects - A - Plugin Commands ===
 * 
 * ---
 * 
 * EFFECT: Angry
 * - Picture(s) gets angry and turns red while shaking.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Color Tone:
 *   - What tone do you want for the effect?
 *   - Format: [Red, Green, Blue, Gray]
 * 
 *   Distance X:
 *   - How far should the max horizontal distance be?
 * 
 *   Distance Y:
 *   - How far should the max vertical distance be?
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. Minimum: 10.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Arrange By Column
 * - Picture(s) gets arranged by columns across the screen.
 * - Works best with multiple pictures.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Max Column Size:
 *   - What is the max column size before creating a new one?
 *   - You may use JavaScript.
 * 
 *   Anchor:
 *   Anchor X:
 *   - X anchor for pictures to adjust to.
 *   - 0.0 - left; 0.5 - center; 1.0 - right
 * 
 *   Anchor Y:
 *   - Y anchor for pictures to adjust to.
 *   - 0.0 - top; 0.5 - middle; 1.0 - bottom
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. Minimum: 10.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Arrange By Row
 * - Picture(s) gets arranged by rows across the screen.
 * - Works best with multiple pictures.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Max Row Size:
 *   - What is the max row size before creating a new one?
 *   - You may use JavaScript.
 * 
 *   Anchor:
 *   Anchor X:
 *   - X anchor for pictures to adjust to.
 *   - 0.0 - left; 0.5 - center; 1.0 - right
 * 
 *   Anchor Y:
 *   - Y anchor for pictures to adjust to.
 *   - 0.0 - top; 0.5 - middle; 1.0 - bottom
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. Minimum: 10.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Arrange Horizontally
 * - Picture(s) gets spread horizontally on the screen.
 * - Works best with multiple pictures.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Target Y:
 *   - What Y coordinate do you want pictures arranged at?
 *   - You may use JavaScript.
 * 
 *   Anchor:
 *   Anchor X:
 *   - X anchor for pictures to adjust to.
 *   - 0.0 - left; 0.5 - center; 1.0 - right
 * 
 *   Anchor Y:
 *   - Y anchor for pictures to adjust to.
 *   - 0.0 - top; 0.5 - middle; 1.0 - bottom
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. Minimum: 10.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Arrange Vertically
 * - Picture(s) gets spread vertically on the screen.
 * - Works best with multiple pictures.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Target X:
 *   - What X coordinate do you want pictures arranged at?
 *   - You may use JavaScript.
 * 
 *   Anchor:
 *   Anchor X:
 *   - X anchor for pictures to adjust to.
 *   - 0.0 - left; 0.5 - center; 1.0 - right
 * 
 *   Anchor Y:
 *   - Y anchor for pictures to adjust to.
 *   - 0.0 - top; 0.5 - middle; 1.0 - bottom
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. Minimum: 10.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * === Effects - B - Plugin Commands ===
 * 
 * ---
 * 
 * EFFECT: Banner In/Out
 * - Picture(s) slides in from the side to the center, and then slides out to
 *   the side.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect In/Out?:
 *   - What effect type is this?
 * 
 *   From Direction:
 *   - Select which direction the effect starts from.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Berserk
 * - Picture(s) breathes heavily and turns into a reddish tone.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Color Tone:
 *   - What tone do you want for the effect?
 *   - Format: [Red, Green, Blue, Gray]
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. Minimum: 10.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Blur
 * - Picture(s) gets blurry (or not).
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Blur Strength:
 *   - Change blur strength for the picture(s).
 *   - For best results, use numbers between 0 and 10.
 * 
 *   Blur Duration:
 *   - The amount of time it takes for the change to occur.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Breathing
 * - Picture(s) breathes in and out continuously.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Scale Range X:
 *   Scale Range Y:
 *   - What is the horizontal/vertical breathing scale range?
 * 
 *   Speed Rate X:
 *   Speed Rate Y:
 *   - How fast or slow should the effect be?
 *   - Smaller numbers are slower. Larger numbers are faster.
 * 
 *   Random Seed:
 *   - What is the random seed used for this effect?
 *   - You may use JavaScript code.
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. 0 for instant change.
 * 
 * ---
 * 
 * === Effects - C - Plugin Commands ===
 * 
 * ---
 * 
 * EFFECT: Capsule Burst
 * - Picture(s) wobbles back and forth and transforms into a new image.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Transform Image:
 *   - Filename used for the transform image.
 * 
 *   Color Tone:
 *   - What tone do you want for the effect?
 *   - Format: [Red, Green, Blue, Gray]
 * 
 *   Scale Change:
 *   - How does the scale change over time?
 *   - 0.0 = 0%; 0.5 = 50%; 1.0 = 100%; 2.0 = 200%
 * 
 *   Spazz Distance:
 *   - Potential spazz distance for this effect.
 * 
 *   Wobble Angle:
 *   - How many degrees does this wobble?
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. Minimum: 20.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Card Flip
 * - Picture(s) flips like a card and shows its back.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Back Image:
 *   - Filename used for the card back image.
 *   - Leave empty if you don't wish to use one.
 * 
 *   Mirror Back?:
 *   - Mirror the back image?
 *   - If no back image is used, effect is always mirrored.
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. Minimum: 10.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Charm
 * - Picture(s) subject becomes charmed and enamored.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Scale Change:
 *   - How does the scale change over time?
 *   - 0.0 = 0%; 0.5 = 50%; 1.0 = 100%; 2.0 = 200%
 * 
 *   Color Tone:
 *   - What tone do you want for the effect?
 *   - Format: [Red, Green, Blue, Gray]
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. Minimum: 20.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Chilly
 * - Picture(s) spazzes and wobbles and turns light blue-ish.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect Times:
 *   - How many times to extend this effect?
 * 
 *   Color Tone:
 *   - What tone do you want for the effect?
 *   - Format: [Red, Green, Blue, Gray]
 * 
 *   Spazz Distance:
 *   - Potential distance for this effect.
 * 
 *   Wobble Angle:
 *   - Potential angle for this effect.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Confused
 * - Picture(s) acts as if it's confused and moves in random directions.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect Times:
 *   - How many times to extend this effect?
 * 
 *   Degrees:
 *   - How many degrees does this sway back and forth?
 * 
 *   Distance X:
 *   - How far should the max horizontal distance be?
 * 
 *   Distance Y:
 *   - How far should the max vertical distance be?
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * === Effects - D - Plugin Commands ===
 * 
 * ---
 * 
 * EFFECT: Damage
 * - Picture(s) gets damaged and turns red while violently shaking.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Color Tone:
 *   - What tone do you want for the effect?
 *   - Format: [Red, Green, Blue, Gray]
 * 
 *   Distance X:
 *   - How far should the max horizontal distance be?
 * 
 *   Distance Y:
 *   - How far should the max vertical distance be?
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. Minimum: 10.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Depth of Field
 * - Picture(s) is given an image depth of field and will change based off the
 *   mouse cursor position continuously.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Distance X:
 *   - How far should the max horizontal distance be?
 *   - Use negative numbers to go opposite directions.
 * 
 *   Distance Y:
 *   - How far should the max vertical distance be?
 *   - Use negative numbers to go opposite directions.
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second.
 *   - 0 for instant change.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Dizzy
 * - Picture(s) acts as if it's dizzy and moves in a circle.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect Times:
 *   - How many times to extend this effect?
 * 
 *   Degrees:
 *   - How many degrees does this sway back and forth?
 * 
 *   Distance X:
 *   - How far should the max horizontal distance be?
 * 
 *   Distance Y:
 *   - How far should the max vertical distance be?
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Drop In/Out
 * - Picture(s) drops downward in, and sinks further downward out.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect In/Out?:
 *   - What effect type is this?
 * 
 *   Distance:
 *   - What is this effect's drop distance?
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * === Effects - E - Plugin Commands ===
 * 
 * ---
 * 
 * EFFECT: Electrocuted
 * - Picture(s) gets electrocuted and flashes two different colors while
 *   spazzing.
 * - WARNING! Flashing lights!
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Color Tone 1:
 *   - What tone do you want for the effect?
 *   - Format: [Red, Green, Blue, Gray]
 * 
 *   Color Tone 2:
 *   - What tone do you want for the effect?
 *   - Format: [Red, Green, Blue, Gray]
 * 
 *   Spazz Distance:
 *   - Potential distance for this effect.
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. Minimum: 10.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Expand In/Out
 * - Picture(s) expands as it enters and further as it exits.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect In/Out?:
 *   - What effect type is this?
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * === Effects - F - Plugin Commands ===
 * 
 * ---
 * 
 * EFFECT: Fade Change
 * - Picture(s) fades in and out while transforming in the middle.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Transform Image:
 *   - Filename used for the transform image.
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. Minimum: 10
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Fade In/Out
 * - Picture(s) fade in from nothing and fade out to nothing.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect In/Out?:
 *   - What effect type is this?
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Fade Layer Switch
 * - Picture(s) fade in and out while switching layers in between.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Target Z:
 *   - What Z Layer do you wish to assign this picture(s)?
 *   - You may use JavaScript.
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. Minimum 10.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Fear
 * - Picture(s) goes pale and slowly regains color.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Color Tone:
 *   - What tone do you want for the effect?
 *   - Format: [Red, Green, Blue, Gray]
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. Minimum: 10.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Flash Change
 * - Picture(s) flashes a few times before changing into a different graphic.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Transform Image:
 *   - Filename used for the transform image.
 * 
 *   Color Tone:
 *   - What tone do you want for the effect?
 *   - Format: [Red, Green, Blue, Gray]
 * 
 *   Flash Times:
 *   - How many times to flash the tone without changing?
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. Minimum: 20
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Flying Card
 * - Picture(s) flies out from current position to front of the screen and ends
 *   up in the center.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   To Direction:
 *   - Select which side of the screen the effect flies towards.
 * 
 *   Angle:
 *   - What is the angle at which the picture(s) stops at the front?
 * 
 *   Front Scale:
 *   - What is the scale of the picture(s) at the front?
 *   - 0.0 = 0%; 0.5 = 50%; 1.0 = 100%; 2.0 = 200%
 * 
 *   Spin Times:
 *   - How many times does the picture(s) spin?
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Focus In/Out
 * - Picture(s) focuses into view and clarity and out of.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect In/Out?:
 *   - What effect type is this?
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * === Effects - G - Plugin Commands ===
 * 
 * ---
 * 
 * EFFECT: Ghost In/Out
 * - Picture(s) changes into or out of an etheral form.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect In/Out?:
 *   - What effect type is this?
 * 
 *   Blur Strength:
 *   - Change blur strength for the picture(s).
 *   - For best results, use numbers between 0 and 10.
 * 
 *   Flash Tone:
 *   - What tone do you want for the effect?
 *   - Format: [Red, Green, Blue, Gray]
 * 
 *   Ghost Tone:
 *   - What tone do you want for the effect?
 *   - Format: [Red, Green, Blue, Gray]
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. Minimum: 10.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Glow
 * - Picture(s) glows for a duration.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Blur Strength:
 *   - Change blur strength for the picture(s).
 *   - For best results, use numbers between 0 and 10.
 * 
 *   Tone:
 *   - What tone do you want for the effect?
 *   - Format: [Red, Green, Blue, Gray]
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. Minimum: 10.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * === Effects - H - Plugin Commands ===
 * 
 * ---
 * 
 * EFFECT: Heal
 * - Picture(s) glows and blurs a bit for a healing effect.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Blur Strength:
 *   - Change blur strength for the picture(s).
 *   - For best results, use numbers between 0 and 10.
 * 
 *   Color Tone:
 *   - What tone do you want for the effect?
 *   - Format: [Red, Green, Blue, Gray]
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. Minimum: 10.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Hoppity
 * - Picture(s) jumps up in place and back down.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Height:
 *   - How high do you want the picture(s) to hop.
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. Minimum: 10.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Hover
 * - Picture(s) gains hover effect, floating up and down visually continuously.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Distance Y:
 *   - How far should the max vertical distance be?
 * 
 *   Speed Rate:
 *   - How fast or slow should the effect be?
 *   - Smaller numbers are slower. Larger numbers are faster.
 * 
 *   Random Seed:
 *   - What is the random seed used for this effect?
 *   - You may use JavaScript code.
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second.
 *   - 0 for instant change.
 * 
 * ---
 * 
 * EFFECT: Hue Shift By
 * - Picture(s) shifts by a relative hue value.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Hue Shift:
 *   - Insert a hue value here. (0 - 360)
 *   - You may use JavaScript.
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Hue Shift To
 * - Picture(s) shifts to a specific hue value.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Target Hue:
 *   - Insert a hue value here. (0 - 360)
 *   - You may use JavaScript.
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * === Effects - I - Plugin Commands ===
 * 
 * ---
 * 
 * EFFECT: Illusion
 * - Picture(s) appears on random parts of the screen before landing in place.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect Times:
 *   - How many times to extend this effect?
 * 
 *   Duration:
 *   - How long each extension's effect?
 *   - 60 frames = 1 second. Minimum: 10.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * === Effects - J - Plugin Commands ===
 * 
 * ---
 * 
 * EFFECT: Jiggle
 * - Picture(s) jiggles from top to bottom, side to side.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect Times:
 *   - How many times to extend this effect?
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Jump By X/Y
 * - Picture(s) jumps by relative X/Y values.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Height:
 *   - How high do you want the picture(s) to hop.0
 * 
 *   Distance X:
 *   - How far should picture(s) jump horizontally?
 *   - You may use JavaScript. Negative: left. Positive: right.
 * 
 *   Distance Y:
 *   - How far should picture(s) jump vertically?
 *   - You may use JavaScript. Negative: up. Positive: down.
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. Minimum: 10.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Jump To X/Y
 * - Picture(s) jumps to X/Y coordinate.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Height:
 *   - How high do you want the picture(s) to hop.0
 * 
 *   Target X:
 *   - What is the target X destination?
 *   - You may use JavaScript.
 * 
 *   Target Y:
 *   - What is the target Y destination?
 *   - You may use JavaScript.
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. Minimum: 10.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * === Effects - L - Plugin Commands ===
 * 
 * ---
 * 
 * EFFECT: Levitate In/Out
 * - Picture(s) floats upward in, and floats upward out.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect In/Out?:
 *   - What effect type is this?
 * 
 *   Distance:
 *   - What is this effect's levitation distance?
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * === Effects - M - Plugin Commands ===
 * 
 * ---
 * 
 * EFFECT: Mana Restore
 * - Picture(s) glows, hue shifts, and blurs a bit for a restoration effect.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Blur Strength:
 *   - Change blur strength for the picture(s).
 *   - For best results, use numbers between 0 and 10.
 * 
 *   Color Tone:
 *   - What tone do you want for the effect?
 *   - Format: [Red, Green, Blue, Gray]
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. Minimum: 10.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Merge & Change
 * - Picture(s) merge together to transform into a new graphic.
 * - Works best with multiple pictures.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Transform Image:
 *   - Filename used for the transform image.
 *   - First image is transformed. Others have 0 opacity.
 * 
 *   Blur Strength:
 *   - Change blur strength for the picture(s).
 *   - For best results, use numbers between 0 and 10.
 * 
 *   Target X:
 *   - What is the target X destination?
 *   - You may use JavaScript.
 * 
 *   Target Y:
 *   - What is the target Y destination?
 *   - You may use JavaScript.
 * 
 *   Color Tone:
 *   - What tone do you want for the effect?
 *   - Format: [Red, Green, Blue, Gray]
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. Minimum: 20.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * === Effects - O - Plugin Commands ===
 * 
 * ---
 * 
 * EFFECT: Open & Close
 * - Picture(s) opens and closes like an in-game window.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect In/Out?:
 *   - What effect type is this?
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * === Effects - P - Plugin Commands ===
 * 
 * ---
 * 
 * EFFECT: Petrify
 * - Picture(s) struggles as it becomes petrified..
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Color Tone:
 *   - What tone do you want for the effect?
 *   - Format: [Red, Green, Blue, Gray]
 * 
 *   Petrify Tone:
 *   - What tone do you want for the effect?
 *   - Format: [Red, Green, Blue, Gray]
 * 
 *   Scale Maximum:
 *   - How does the scale change over time?
 *   - 0.0 = 0%; 0.5 = 50%; 1.0 = 100%; 2.0 = 200%
 * 
 *   Scale Minimum:
 *   - How does the scale change over time?
 *   - 0.0 = 0%; 0.5 = 50%; 1.0 = 100%; 2.0 = 200%
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. Minimum: 20.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Phase In/Out
 * - Picture(s) phases into view and out of view.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect In/Out?:
 *   - What effect type is this?
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Piece In/Out
 * - Picture(s) flies in and out from a random screen border area.
 * - Works best with multiple pictures.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect In/Out?:
 *   - What effect type is this?
 * 
 *   Border Scale:
 *   - What is the scale of the picture(s) at the border?
 *   - 0.0 = 0%; 0.5 = 50%; 1.0 = 100%; 2.0 = 200%
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Poison
 * - Picture(s) subject receives poison and becomes sickly.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Distance:
 *   - How far should the max horizontal distance be?
 * 
 *   Color Tone:
 *   - What tone do you want for the effect?
 *   - Format: [Red, Green, Blue, Gray]
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. Minimum: 20.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Power Up Change
 * - Picture(s) switches between two images before changing completely.
 * 
 *   Transform Image:
 *   - Filename used for the transform image.
 * 
 *   Effect Times:
 *   - How many times to switch images?
 * 
 *   Duration:
 *   - How long is each switch's duration?
 *   - 60 frames = 1 second.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Psychedelic
 * - Picture(s) shifts hue all the way around.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Pulse
 * - Picture(s) pulses towards its new scale.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Target Scale:
 *   - What is the target scale of the picture(s)?
 *   - 0.0 = 0%; 0.5 = 50%; 1.0 = 100%; 2.0 = 200%
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * === Effects - Q - Plugin Commands ===
 * 
 * ---
 * 
 * EFFECT: Quick Press
 * - Picture(s) is quickly pressed and rebounds back into place.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Distance X:
 *   - What is this effect's X distance?
 * 
 *   Distance 16:
 *   - What is this effect's Y distance?
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * === Effects - R - Plugin Commands ===
 * 
 * ---
 * 
 * EFFECT: Random In/Out
 * - Picture(s) fades in and out in random positions.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect In/Out?:
 *   - What effect type is this?
 * 
 *   Distance:
 *   - What is this effect's max randomized distance?
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. Minimum: 10.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Roll In/Out
 * - Picture(s) rolls in from the side and out to the other.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect In/Out?:
 *   - What effect type is this?
 * 
 *   Distance:
 *   - What is this effect's roll distance?
 * 
 *   From Direction:
 *   - Select which direction the effect starts from.
 * 
 *   Spin Times:
 *   - How many times does the picture(s) spin while rolling?
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Rotate
 * - Picture(s) rotates clockwise or counter clockwise.
 * - Apply opposite if the picture(s) is mirrored.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   From Direction:
 *   - Select which direction the effect rotates.
 *   - Apply opposite if the picture(s) is mirrored.
 * 
 *   Spin Times:
 *   - How many times does the picture(s) spin while rolling?
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * === Effects - S - Plugin Commands ===
 * 
 * ---
 * 
 * EFFECT: Shakey
 * - Picture(s) shakes back and forth from side to side.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect Times:
 *   - How many times to extend this effect?
 * 
 *   Distance:
 *   - What is this effect's shake distance?
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Shrink In/Out
 * - Picture(s) shrinks in and shrinks further inward.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect In/Out?:
 *   - What effect type is this?
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Sidestep
 * - Picture(s) gains sidestep effect, moving left and right visually
 *   continuously.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Distance X:
 *   - How far should the max horizontal distance be?
 * 
 *   Speed Rate:
 *   - How fast or slow should the effect be?
 *   - Smaller numbers are slower. Larger numbers are faster.
 * 
 *   Random Seed:
 *   - What is the random seed used for this effect?
 *   - You may use JavaScript code.
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second.
 *   - 0 for instant change.
 * 
 * ---
 * 
 * EFFECT: Spazz
 * - Picture(s) spazzes up, down, left, right at random.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect Times:
 *   - How many times to extend this effect?
 * 
 *   Distance:
 *   - What is this effect's spazz distance?
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Spin Change
 * - Picture(s) spins and changes into a different graphic.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Transform Image:
 *   - Filename used for the transform image.
 * 
 *   Scale Change:
 *   - How does the scale change over time?
 *   - 0.0 = 0%; 0.5 = 50%; 1.0 = 100%; 2.0 = 200%
 * 
 *   Spin Times:
 *   - How many times does the picture(s) spin before transforming?
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. Minimum: 20
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Spin In/Out
 * - Picture(s) spins into view and out of view.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect In/Out?:
 *   - What effect type is this?
 * 
 *   Spin Times:
 *   - How many times does the picture(s) spin while rolling?
 * 
 *   Vanish Scale:
 *   - What is the scale of the picture(s) when null?
 *   - 0.0 = 0%; 0.5 = 50%; 1.0 = 100%; 2.0 = 200%
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Squish In/Out
 * - Picture(s) squishes as it enters and further as it exits.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect In/Out?:
 *   - What effect type is this?
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Stretch In/Out
 * - Picture(s) stretches as it enters and further as it exits.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect In/Out?:
 *   - What effect type is this?
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Submerge In/Out
 * - Picture(s) enters and exits the bottom of the screen.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect In/Out?:
 *   - What effect type is this?
 * 
 *   Color Tone:
 *   - What tone do you want for the effect?
 *   - Format: [Red, Green, Blue, Gray]
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. Minimum: 10.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Swaying
 * - Picture(s) angles back and forth from side to side continuously.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Angle Range:
 *   - How many degrees should the picture sway?
 * 
 *   Speed Rate:
 *   - How fast or slow should the effect be?
 *   - Smaller numbers are slower. Larger numbers are faster.
 * 
 *   Random Seed:
 *   - What is the random seed used for this effect?
 *   - You may use JavaScript code.
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second.
 *   - 0 for instant change.
 * 
 * ---
 * 
 * === Effects - T - Plugin Commands ===
 * 
 * ---
 * 
 * EFFECT: Teleport In/Out
 * - Picture(s) teleports into view and out of view.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect In/Out?:
 *   - What effect type is this?
 * 
 *   Color Tone:
 *   - What tone do you want for the effect?
 *   - Format: [Red, Green, Blue, Gray]
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Television In/Out
 * - Picture(s) snaps in and out like a television screen.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect In/Out?:
 *   - What effect type is this?
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Tint Shift By
 * - Picture(s) changes tone and its own Z Layer relatively.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Adjust Z:
 *   - Adjust the Z value of target picture(s) by this.
 *   - You may use JavaScript. + Move Front. - Move Back.
 * 
 *   Color Tone:
 *   - What tone do you want for the effect?
 *   - Format: [Red, Green, Blue, Gray]
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Tint Shift To
 * - Picture(s) changes tone and its Z Layer to a specific value.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Target Z:
 *   - What Z Layer do you wish to assign this picture(s)?
 *   - You may use JavaScript.
 * 
 *   Color Tone:
 *   - What tone do you want for the effect?
 *   - Format: [Red, Green, Blue, Gray]
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * EFFECT: Transform
 * - Picture(s) transforms into another image with no other effects.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Transform Image:
 *   - Filename used for the transform image.
 * 
 * ---
 * 
 * === Effects - U - Plugin Commands ===
 * 
 * ---
 * 
 * EFFECT: UFO In/Out
 * - Picture(s) enters and exits the top of the screen.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect In/Out?:
 *   - What effect type is this?
 * 
 *   Color Tone:
 *   - What tone do you want for the effect?
 *   - Format: [Red, Green, Blue, Gray]
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second. Minimum: 10.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * === Effects - V - Plugin Commands ===
 * 
 * ---
 * 
 * EFFECT: Vibrate
 * - Picture(s) vibrates a certain distance from start to end.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect Times:
 *   - How many times to extend this effect?
 * 
 *   Distance X:
 *   - How far should the max horizontal distance be?
 * 
 *   Distance Y:
 *   - How far should the max vertical distance be?
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * === Effects - W - Plugin Commands ===
 * 
 * ---
 * 
 * EFFECT: Wobble
 * - Picture(s) wobbles its angle from side to side.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect Times:
 *   - How many times to extend this effect?
 * 
 *   Degrees:
 *   - How many degrees does this wobble?
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 * 
 * === Effects - Z - Plugin Commands ===
 * 
 * ---
 * 
 * EFFECT: Z Layer Change By
 * - Picture(s) changes its Z layer to a relative value.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Adjust Z:
 *   - Adjust the Z value of target picture(s) by this.
 *   - You may use JavaScript. + Move Front. - Move Back.
 * 
 * ---
 * 
 * EFFECT: Z Layer Set To
 * - Picture(s) changes its Z layer to a specific value.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Target Z:
 *   - What Z Layer do you wish to assign this picture(s)?
 *   - You may use JavaScript.
 * 
 * ---
 * 
 * EFFECT: Zoom In/Out
 * - Picture(s) zooms into view and out of.
 * 
 *   Picture ID(s):
 *   - Select which picture ID(s) to play this effect with.
 * 
 *   Effect In/Out?:
 *   - What effect type is this?
 * 
 *   Duration:
 *   - How long is this effect's duration?
 *   - 60 frames = 1 second.
 * 
 *   Wait for Completion?:
 *   - Wait until effect is complete before moving onto next event command?
 * 
 * ---
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 *
 * 1. These plugins may be used in free or commercial games provided that they
 * have been acquired through legitimate means at VisuStella.com and/or any
 * other official approved VisuStella sources. Exceptions and special
 * circumstances that may prohibit usage will be listed on VisuStella.com.
 * 
 * 2. All of the listed coders found in the Credits section of this plugin must
 * be given credit in your games or credited as a collective under the name:
 * "VisuStella".
 * 
 * 3. You may edit the source code to suit your needs, so long as you do not
 * claim the source code belongs to you. VisuStella also does not take
 * responsibility for the plugin if any changes have been made to the plugin's
 * code, nor does VisuStella take responsibility for user-provided custom code
 * used for custom control effects including advanced JavaScript notetags
 * and/or plugin parameters that allow custom JavaScript code.
 * 
 * 4. You may NOT redistribute these plugins nor take code from this plugin to
 * use as your own. These plugins and their code are only to be downloaded from
 * VisuStella.com and other official/approved VisuStella sources. A list of
 * official/approved sources can also be found on VisuStella.com.
 *
 * 5. VisuStella is not responsible for problems found in your game due to
 * unintended usage, incompatibility problems with plugins outside of the
 * VisuStella MZ library, plugin versions that aren't up to date, nor
 * responsible for the proper working of compatibility patches made by any
 * third parties. VisuStella is not responsible for errors caused by any
 * user-provided custom code used for custom control effects including advanced
 * JavaScript notetags and/or plugin parameters that allow JavaScript code.
 *
 * 6. If a compatibility patch needs to be made through a third party that is
 * unaffiliated with VisuStella that involves using code from the VisuStella MZ
 * library, contact must be made with a member from VisuStella and have it
 * approved. The patch would be placed on VisuStella.com as a free download
 * to the public. Such patches cannot be sold for monetary gain, including
 * commissions, crowdfunding, and/or donations.
 * 
 * 7. If this VisuStella MZ plugin is a paid product, all project team members
 * must purchase their own individual copies of the paid product if they are to
 * use it. Usage includes working on related game mechanics, managing related
 * code, and/or using related Plugin Commands and features. Redistribution of
 * the plugin and/or its code to other members of the team is NOT allowed
 * unless they own the plugin itself as that conflicts with Article 4.
 * 
 * 8. Any extensions and/or addendums made to this plugin's Terms of Use can be
 * found on VisuStella.com and must be followed.
 *
 * ============================================================================
 * Credits
 * ============================================================================
 * 
 * If you are using this plugin, credit the following people in your game:
 * 
 * Team VisuStella
 * * Arisu
 * * Olivia
 * * Irina
 * * Yanfly
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 * 
 * Version 1.00 Official Release Date: February 21, 2024
 * * Finished Plugin!
 *
 * ============================================================================
 * End of Helpfile
 * ============================================================================
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Begin
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Angry
 * @text EFFECT: Angry
 * @desc Picture(s) gets angry and turns red while shaking.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Tone:eval
 * @text Color Tone
 * @desc What tone do you want for the effect?
 * Format: [Red, Green, Blue, Gray]
 * @default [128, -64, -64, 0]
 *
 * @arg DistanceX:num
 * @text Distance X
 * @type number
 * @desc How far should the max horizontal distance be?
 * @default 36
 *
 * @arg DistanceY:num
 * @text Distance Y
 * @type number
 * @desc How far should the max vertical distance be?
 * @default 24
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 10
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. Minimum: 10.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Arrange_Col
 * @text EFFECT: Arrange By Column
 * @desc Picture(s) gets arranged by columns across the screen.
 * Works best with multiple pictures.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Size:eval
 * @text Max Column Size
 * @desc What is the max column size before creating a new one?
 * You may use JavaScript.
 * @default 3
 * 
 * @arg Anchor
 * @text Anchor
 *
 * @arg AnchorX:eval
 * @text Anchor X
 * @parent Anchor
 * @desc X anchor for pictures to adjust to.
 * 0.0 - left; 0.5 - center; 1.0 - right
 * @default 0.5
 *
 * @arg AnchorY:eval
 * @text Anchor Y
 * @parent Anchor
 * @desc Y anchor for pictures to adjust to.
 * 0.0 - top; 0.5 - middle; 1.0 - bottom
 * @default 0.5
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 10
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. Minimum: 10.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Arrange_Row
 * @text EFFECT: Arrange By Row
 * @desc Picture(s) gets arranged by rows across the screen.
 * Works best with multiple pictures.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Size:eval
 * @text Max Row Size
 * @desc What is the max row size before creating a new one?
 * You may use JavaScript.
 * @default 5
 * 
 * @arg Anchor
 * @text Anchor
 *
 * @arg AnchorX:eval
 * @text Anchor X
 * @parent Anchor
 * @desc X anchor for pictures to adjust to.
 * 0.0 - left; 0.5 - center; 1.0 - right
 * @default 0.5
 *
 * @arg AnchorY:eval
 * @text Anchor Y
 * @parent Anchor
 * @desc Y anchor for pictures to adjust to.
 * 0.0 - top; 0.5 - middle; 1.0 - bottom
 * @default 0.5
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 10
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. Minimum: 10.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Arrange_Horz
 * @text EFFECT: Arrange Horizontally
 * @desc Picture(s) gets spread horizontally on the screen.
 * Works best with multiple pictures.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg TargetY:eval
 * @text Target Y
 * @desc What Y coordinate do you want pictures arranged at?
 * You may use JavaScript.
 * @default Graphics.height / 2
 * 
 * @arg Anchor
 * @text Anchor
 *
 * @arg AnchorX:eval
 * @text Anchor X
 * @parent Anchor
 * @desc X anchor for pictures to adjust to.
 * 0.0 - left; 0.5 - center; 1.0 - right
 * @default 0.5
 *
 * @arg AnchorY:eval
 * @text Anchor Y
 * @parent Anchor
 * @desc Y anchor for pictures to adjust to.
 * 0.0 - top; 0.5 - middle; 1.0 - bottom
 * @default 0.5
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 10
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. Minimum: 10.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Arrange_Vert
 * @text EFFECT: Arrange Vertically
 * @desc Picture(s) gets spread vertically on the screen.
 * Works best with multiple pictures.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg TargetX:eval
 * @text Target X
 * @desc What X coordinate do you want pictures arranged at?
 * You may use JavaScript.
 * @default Graphics.width / 2
 * 
 * @arg Anchor
 * @text Anchor
 *
 * @arg AnchorX:eval
 * @text Anchor X
 * @parent Anchor
 * @desc X anchor for pictures to adjust to.
 * 0.0 - left; 0.5 - center; 1.0 - right
 * @default 0.5
 *
 * @arg AnchorY:eval
 * @text Anchor Y
 * @parent Anchor
 * @desc Y anchor for pictures to adjust to.
 * 0.0 - top; 0.5 - middle; 1.0 - bottom
 * @default 0.5
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 10
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. Minimum: 10.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_B
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Banner_InOut
 * @text EFFECT: Banner In/Out
 * @desc Picture(s) slides in from the side to the center,
 * and then slides out to the side.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg EffectIn:str
 * @text Effect In/Out?
 * @type select
 * @option In
 * @option Out
 * @desc What effect type is this?
 * @default In
 *
 * @arg Direction:str
 * @text From Direction
 * @type select
 * @option From Left
 * @option From Right
 * @desc Select which direction the effect starts from.
 * @default From Left
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Berserk
 * @text EFFECT: Berserk
 * @desc Picture(s) breathes heavily and turns into a reddish tone.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Tone:eval
 * @text Color Tone
 * @desc What tone do you want for the effect?
 * Format: [Red, Green, Blue, Gray]
 * @default [128, -64, -64, 0]
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 10
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. Minimum: 10.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Blur
 * @text EFFECT: Blur
 * @desc Picture(s) gets blurry (or not).
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Blur:num
 * @text Blur Strength
 * @desc Change blur strength for the picture(s).
 * For best results, use numbers between 0 and 10.
 * @default 5.0
 *
 * @arg Duration:num
 * @text Blur Duration
 * @type number
 * @desc The amount of time it takes for the change to occur.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Breathing
 * @text EFFECT: Breathing
 * @desc Picture(s) breathes in and out continuously.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg RangeX:num
 * @text Scale Range X
 * @desc What is the horizontal breathing scale range?
 * @default 1
 *
 * @arg RangeY:num
 * @text Scale Range Y
 * @desc What is the vertical breathing scale range?
 * @default 2
 *
 * @arg RateX:num
 * @text Speed Rate X
 * @desc How fast or slow should the effect be?
 * Smaller numbers are slower. Larger numbers are faster.
 * @default 0.02
 *
 * @arg RateY:num
 * @text Speed Rate Y
 * @desc How fast or slow should the effect be?
 * Smaller numbers are slower. Larger numbers are faster.
 * @default 0.02
 *
 * @arg Rng:eval
 * @text Random Seed
 * @desc What is the random seed used for this effect?
 * You may use JavaScript code.
 * @default Math.randomInt(5000)
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. 0 for instant change.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_C
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Capsule_Burst
 * @text EFFECT: Capsule Burst
 * @desc Picture(s) wobbles back and forth and transforms into a new image.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Filename:str
 * @text Transform Image
 * @type file
 * @dir img/pictures/
 * @require 1
 * @desc Filename used for the transform image.
 * @default 
 *
 * @arg Tone:eval
 * @text Color Tone
 * @desc What tone do you want for the effect?
 * Format: [Red, Green, Blue, Gray]
 * @default [240, 240, 240, 0]
 *
 * @arg Scale:num
 * @text Scale Change
 * @desc How does the scale change over time?
 * 0.0 = 0%; 0.5 = 50%; 1.0 = 100%; 2.0 = 200%
 * @default 0.8
 *
 * @arg Spazz:num
 * @text Spazz Distance
 * @type number
 * @desc Potential spazz distance for this effect.
 * @default 8
 *
 * @arg Wobble:num
 * @text Wobble Angle
 * @type number
 * @desc How many degrees does this wobble?
 * @default 30
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 20
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. Minimum: 20.
 * @default 180
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Card_Flip
 * @text EFFECT: Card Flip
 * @desc Picture(s) flips like a card and shows its back.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg BackFilename:str
 * @text Back Image
 * @type file
 * @dir img/pictures/
 * @require 1
 * @desc Filename used for the card back image.
 * Leave empty if you don't wish to use one.
 * @default 
 *
 * @arg BackMirror:eval
 * @text Mirror Back?
 * @parent BackFilename:str
 * @type boolean
 * @on Mirror
 * @off Normal
 * @desc Mirror the back image?
 * If no back image is used, effect is always mirrored.
 * @default false
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 10
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. Minimum: 10.
 * @default 20
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Charm
 * @text EFFECT: Charm
 * @desc Picture(s) subject becomes charmed and enamored.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Scale:num
 * @text Scale Change
 * @desc How does the scale change over time?
 * 0.0 = 0%; 0.5 = 50%; 1.0 = 100%; 2.0 = 200%
 * @default 1.2
 *
 * @arg Tone:eval
 * @text Color Tone
 * @desc What tone do you want for the effect?
 * Format: [Red, Green, Blue, Gray]
 * @default [153, 68, 128, 68]
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 20
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. Minimum: 20.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Chilly
 * @text EFFECT: Chilly
 * @desc Picture(s) spazzes and wobbles and turns light blue-ish.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Times:num
 * @text Effect Times
 * @type number
 * @min 1
 * @desc How many times to extend this effect?
 * @default 10
 *
 * @arg Tone:eval
 * @text Color Tone
 * @desc What tone do you want for the effect?
 * Format: [Red, Green, Blue, Gray]
 * @default [-100, 128, 128, 0]
 *
 * @arg Spazz:num
 * @text Spazz Distance
 * @type number
 * @desc Potential distance for this effect.
 * @default 10
 *
 * @arg Wobble:num
 * @text Wobble Angle
 * @type number
 * @desc Potential angle for this effect.
 * @default 10
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Confused
 * @text EFFECT: Confused
 * @desc Picture(s) acts as if it's confused and moves in random directions.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Times:num
 * @text Effect Times
 * @type number
 * @min 1
 * @desc How many times to extend this effect?
 * @default 2
 *
 * @arg Degrees:num
 * @text Degrees
 * @type number
 * @min 1
 * @max 360
 * @desc How many degrees does this sway back and forth?
 * @default 10
 *
 * @arg DistanceX:num
 * @text Distance X
 * @type number
 * @desc How far should the max horizontal distance be?
 * @default 36
 *
 * @arg DistanceY:num
 * @text Distance Y
 * @type number
 * @desc How far should the max vertical distance be?
 * @default 24
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_D
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Damage
 * @text EFFECT: Damage
 * @desc Picture(s) gets damaged and turns red while violently shaking.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Tone:eval
 * @text Color Tone
 * @desc What tone do you want for the effect?
 * Format: [Red, Green, Blue, Gray]
 * @default [128, -64, -64, 0]
 *
 * @arg DistanceX:num
 * @text Distance X
 * @type number
 * @desc How far should the max horizontal distance be?
 * @default 48
 *
 * @arg DistanceY:num
 * @text Distance Y
 * @type number
 * @desc How far should the max vertical distance be?
 * @default 12
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 10
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. Minimum: 10.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Depth
 * @text EFFECT: Depth of Field
 * @desc Picture(s) is given an image depth of field and will change
 * based off the mouse cursor position continuously.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg DistanceX:eval
 * @text Distance X
 * @desc How far should the max horizontal distance be?
 * Use negative numbers to go opposite directions.
 * @default +48
 *
 * @arg DistanceY:eval
 * @text Distance Y
 * @desc How far should the max vertical distance be?
 * Use negative numbers to go opposite directions.
 * @default +12
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 10
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. 0 for instant change.
 * @default 0
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Dizzy
 * @text EFFECT: Dizzy
 * @desc Picture(s) acts as if it's dizzy and moves in a circle.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Times:num
 * @text Effect Times
 * @type number
 * @min 1
 * @desc How many times to extend this effect?
 * @default 2
 *
 * @arg Degrees:num
 * @text Degrees
 * @type number
 * @min 1
 * @max 360
 * @desc How many degrees does this sway back and forth?
 * @default 10
 *
 * @arg DistanceX:num
 * @text Distance X
 * @type number
 * @desc How far should the max horizontal distance be?
 * @default 36
 *
 * @arg DistanceY:num
 * @text Distance Y
 * @type number
 * @desc How far should the max vertical distance be?
 * @default 24
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Drop_InOut
 * @text EFFECT: Drop In/Out
 * @desc Picture(s) drops downward in, and sinks further downward out.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg EffectIn:str
 * @text Effect In/Out?
 * @type select
 * @option In
 * @option Out
 * @desc What effect type is this?
 * @default In
 *
 * @arg Distance:num
 * @text Distance
 * @type number
 * @min 1
 * @desc What is this effect's drop distance?
 * @default 192
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 1
 * @desc How long is this effect's duration?
 * 60 frames = 1 second.
 * @default 40
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_E
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Electrocuted
 * @text EFFECT: Electrocuted
 * @desc Picture(s) gets electrocuted and flashes two different colors
 * while spazzing. WARNING! Flashing lights!
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Tone1:eval
 * @text Color Tone 1
 * @desc What tone do you want for the effect?
 * Format: [Red, Green, Blue, Gray]
 * @default [196, 128, 0, 255]
 *
 * @arg Tone2:eval
 * @text Color Tone 2
 * @desc What tone do you want for the effect?
 * Format: [Red, Green, Blue, Gray]
 * @default [0, 0, 0, 255]
 *
 * @arg Spazz:num
 * @text Spazz Distance
 * @type number
 * @desc Potential distance for this effect.
 * @default 10
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 10
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. Minimum: 10.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Expand_InOut
 * @text EFFECT: Expand In/Out
 * @desc Picture(s) expands as it enters and further as it exits.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg EffectIn:str
 * @text Effect In/Out?
 * @type select
 * @option In
 * @option Out
 * @desc What effect type is this?
 * @default In
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 1
 * @desc How long is this effect's duration?
 * 60 frames = 1 second.
 * @default 20
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_F
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Fade_Change
 * @text EFFECT: Fade Change
 * @desc Picture(s) fades in and out while transforming in the middle.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Filename:str
 * @text Transform Image
 * @type file
 * @dir img/pictures/
 * @require 1
 * @desc Filename used for the transform image.
 * @default 
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 10
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. Minimum: 10
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Fade_InOut
 * @text EFFECT: Fade In/Out
 * @desc Picture(s) fade in from nothing and fade out to nothing.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg EffectIn:str
 * @text Effect In/Out?
 * @type select
 * @option In
 * @option Out
 * @desc What effect type is this?
 * @default In
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 1
 * @desc How long is this effect's duration?
 * 60 frames = 1 second.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Fade_Layer_Switch
 * @text EFFECT: Fade Layer Switch
 * @desc Picture(s) fade in and out while switching layers in between.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Z:eval
 * @text Target Z
 * @desc What Z Layer do you wish to assign this picture(s)?
 * You may use JavaScript.
 * @default 0
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 10
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. Minimum 10.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Fear
 * @text EFFECT: Fear
 * @desc Picture(s) goes pale and slowly regains color.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Tone:eval
 * @text Color Tone
 * @desc What tone do you want for the effect?
 * Format: [Red, Green, Blue, Gray]
 * @default [0, 0, 68, 192]
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 10
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. Minimum: 10.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Flash_Change
 * @text EFFECT: Flash Change
 * @desc Picture(s) flashes a few times before changing into a different graphic.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Filename:str
 * @text Transform Image
 * @type file
 * @dir img/pictures/
 * @require 1
 * @desc Filename used for the transform image.
 * @default 
 *
 * @arg Tone:eval
 * @text Color Tone
 * @desc What tone do you want for the effect?
 * Format: [Red, Green, Blue, Gray]
 * @default [192, 192, 192, 0]
 *
 * @arg Times:num
 * @text Flash Times
 * @parent Tone:eval
 * @type number
 * @min 1
 * @max 10
 * @desc How many times to flash the tone without changing?
 * @default 3
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 20
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. Minimum: 20
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command FlyingCard
 * @text EFFECT: Flying Card
 * @desc Picture(s) flies out from current position to front of the screen and ends up in the center.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Direction:str
 * @text To Direction
 * @type select
 * @option To Left
 * @option To Right
 * @desc Select which side of the screen the effect flies towards.
 * @default To Right
 *
 * @arg Angle:num
 * @text Angle
 * @type number
 * @max 360
 * @desc What is the angle at which the picture(s) stops at the front?
 * @default 30
 *
 * @arg Scale:eval
 * @text Front Scale
 * @desc What is the scale of the picture(s) at the front?
 * 0.0 = 0%; 0.5 = 50%; 1.0 = 100%; 2.0 = 200%
 * @default 2.0
 *
 * @arg Spins:num
 * @text Spin Times
 * @type number
 * @desc How many times does the picture(s) spin?
 * @default 5
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Focus_InOut
 * @text EFFECT: Focus In/Out
 * @desc Picture(s) focuses into view and clarity and out of.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg EffectIn:str
 * @text Effect In/Out?
 * @type select
 * @option In
 * @option Out
 * @desc What effect type is this?
 * @default In
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 1
 * @desc How long is this effect's duration?
 * 60 frames = 1 second.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_G
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Ghost_InOut
 * @text EFFECT: Ghost In/Out
 * @desc Picture(s) changes into or out of an etheral form.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg EffectIn:str
 * @text Effect In/Out?
 * @type select
 * @option In
 * @option Out
 * @desc What effect type is this?
 * @default In
 *
 * @arg Blur:num
 * @text Blur Strength
 * @desc Change blur strength for the picture(s).
 * For best results, use numbers between 0 and 10.
 * @default 5.0
 *
 * @arg FlashTone:eval
 * @text Flash Tone
 * @desc What tone do you want for the effect?
 * Format: [Red, Green, Blue, Gray]
 * @default [255, 255, 255, 0]
 *
 * @arg GhostTone:eval
 * @text Ghost Tone
 * @desc What tone do you want for the effect?
 * Format: [Red, Green, Blue, Gray]
 * @default [-68, -68, 0, 68]
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 10
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. Minimum: 10.
 * @default 40
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Glow
 * @text EFFECT: Glow
 * @desc Picture(s) glows for a duration.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Blur:num
 * @text Blur Strength
 * @desc Change blur strength for the picture(s).
 * For best results, use numbers between 0 and 10.
 * @default 5.0
 *
 * @arg Tone:eval
 * @text Tone
 * @desc What tone do you want for the effect?
 * Format: [Red, Green, Blue, Gray]
 * @default [136, 136, 136, 0]
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 10
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. Minimum: 10.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_H
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Heal
 * @text EFFECT: Heal
 * @desc Picture(s) glows and blurs a bit for a healing effect.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Blur:num
 * @text Blur Strength
 * @desc Change blur strength for the picture(s).
 * For best results, use numbers between 0 and 10.
 * @default 5.0
 *
 * @arg Tone:eval
 * @text Color Tone
 * @desc What tone do you want for the effect?
 * Format: [Red, Green, Blue, Gray]
 * @default [68, 192, 160, 0]
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 10
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. Minimum: 10.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Hoppity
 * @text EFFECT: Hoppity
 * @desc Picture(s) jumps up in place and back down.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Height:num
 * @text Height
 * @type number
 * @desc How high do you want the picture(s) to hop.
 * @default 40
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 10
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. Minimum: 10.
 * @default 40
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Hover
 * @text EFFECT: Hover
 * @desc Picture(s) gains hover effect, floating up and down visually continuously.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg DistanceY:num
 * @text Distance Y
 * @type number
 * @desc How far should the max vertical distance be?
 * @default 100
 *
 * @arg Rate:num
 * @text Speed Rate
 * @desc How fast or slow should the effect be?
 * Smaller numbers are slower. Larger numbers are faster.
 * @default 0.05
 *
 * @arg Rng:eval
 * @text Random Seed
 * @desc What is the random seed used for this effect?
 * You may use JavaScript code.
 * @default Math.randomInt(5000)
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. 0 for instant change.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Hue_Shift_By
 * @text EFFECT: Hue Shift By
 * @desc Picture(s) shifts by a relative hue value.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Hue:eval
 * @text Hue Shift
 * @desc Insert a hue value here. (0 - 360)
 * You may use JavaScript.
 * @default +0
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 10
 * @desc How long is this effect's duration?
 * 60 frames = 1 second.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Hue_Shift_To
 * @text EFFECT: Hue Shift To
 * @desc Picture(s) shifts to a specific hue value.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Hue:eval
 * @text Target Hue
 * @desc Insert a hue value here. (0 - 360)
 * You may use JavaScript.
 * @default 0
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 10
 * @desc How long is this effect's duration?
 * 60 frames = 1 second.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_I
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Illusion
 * @text EFFECT: Illusion
 * @desc Picture(s) appears on random parts of the screen before landing in place.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Times:num
 * @text Effect Times
 * @type number
 * @min 1
 * @desc How many times to extend this effect?
 * @default 5
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 10
 * @desc How long each extension's effect?
 * 60 frames = 1 second. Minimum: 10.
 * @default 30
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_J
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Jiggle
 * @text EFFECT: Jiggle
 * @desc Picture(s) jiggles from top to bottom, side to side.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Times:num
 * @text Effect Times
 * @type number
 * @min 1
 * @desc How many times to extend this effect?
 * @default 5
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command JumpBy
 * @text EFFECT: Jump By X/Y
 * @desc Picture(s) jumps by relative X/Y values.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Height:num
 * @text Height
 * @type number
 * @desc How high do you want the picture(s) to hop.
 * @default 100
 *
 * @arg DistanceX:eval
 * @text Distance X
 * @desc How far should picture(s) jump horizontally?
 * You may use JavaScript. Negative: left. Positive: right.
 * @default +200
 *
 * @arg DistanceY:eval
 * @text Distance Y
 * @desc How far should picture(s) jump vertically?
 * You may use JavaScript. Negative: up. Positive: down.
 * @default +60
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 10
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. Minimum: 10.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command JumpTo
 * @text EFFECT: Jump To X/Y
 * @desc Picture(s) jumps to X/Y coordinate.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Height:num
 * @text Height
 * @type number
 * @desc How high do you want the picture(s) to hop.
 * @default 100
 *
 * @arg TargetX:eval
 * @text Target X
 * @desc What is the target X destination?
 * You may use JavaScript.
 * @default Graphics.width / 2
 *
 * @arg TargetY:eval
 * @text Target Y
 * @desc What is the target Y destination?
 * You may use JavaScript.
 * @default Graphics.height / 2
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 10
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. Minimum: 10.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_L
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Levitate_InOut
 * @text EFFECT: Levitate In/Out
 * @desc Picture(s) floats upward in, and floats upward out.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg EffectIn:str
 * @text Effect In/Out?
 * @type select
 * @option In
 * @option Out
 * @desc What effect type is this?
 * @default In
 *
 * @arg Distance:num
 * @text Distance
 * @type number
 * @min 1
 * @desc What is this effect's levitation distance?
 * @default 96
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 1
 * @desc How long is this effect's duration?
 * 60 frames = 1 second.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_M
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Mana_Restore
 * @text EFFECT: Mana Restore
 * @desc Picture(s) glows, hue shifts, and blurs a bit for a restoration effect.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Blur:num
 * @text Blur Strength
 * @desc Change blur strength for the picture(s).
 * For best results, use numbers between 0 and 10.
 * @default 5.0
 *
 * @arg Tone:eval
 * @text Color Tone
 * @desc What tone do you want for the effect?
 * Format: [Red, Green, Blue, Gray]
 * @default [68, 96, 192, 0]
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 10
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. Minimum: 10.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Merge_Change
 * @text EFFECT: Merge & Change
 * @desc Picture(s) merge together to transform into a new graphic.
 * Works best with multiple pictures.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Filename:str
 * @text Transform Image
 * @type file
 * @dir img/pictures/
 * @require 1
 * @desc Filename used for the transform image.
 * First image is transformed. Others have 0 opacity.
 * @default 
 *
 * @arg Blur:num
 * @text Blur Strength
 * @desc Change blur strength for the picture(s).
 * For best results, use numbers between 0 and 10.
 * @default 5.0
 *
 * @arg TargetX:eval
 * @text Target X
 * @desc What is the target X destination?
 * You may use JavaScript.
 * @default Graphics.width / 2
 *
 * @arg TargetY:eval
 * @text Target Y
 * @desc What is the target Y destination?
 * You may use JavaScript.
 * @default Graphics.height / 2
 *
 * @arg Tone:eval
 * @text Color Tone
 * @desc What tone do you want for the effect?
 * Format: [Red, Green, Blue, Gray]
 * @default [240, 240, 240, 0]
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 10
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. Minimum: 20.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_O
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Open_InOut
 * @text EFFECT: Open & Close
 * @desc Picture(s) opens and closes like an in-game window.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg EffectIn:str
 * @text Effect In/Out?
 * @type select
 * @option Open
 * @option Close
 * @desc What effect type is this?
 * @default Open
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 1
 * @desc How long is this effect's duration?
 * 60 frames = 1 second.
 * @default 10
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_P
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Petrify
 * @text EFFECT: Petrify
 * @desc Picture(s) struggles as it becomes petrified..
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg FlashTone:eval
 * @text Color Tone
 * @desc What tone do you want for the effect?
 * Format: [Red, Green, Blue, Gray]
 * @default [192, 192, 192, 0]
 *
 * @arg PetrifyTone:eval
 * @text Petrify Tone
 * @parent FlashTone:eval
 * @desc What tone do you want for the effect?
 * Format: [Red, Green, Blue, Gray]
 * @default [0, 0, 0, 255]
 *
 * @arg ScaleMax:num
 * @text Scale Maximum
 * @desc How does the scale change over time?
 * 0.0 = 0%; 0.5 = 50%; 1.0 = 100%; 2.0 = 200%
 * @default 1.1
 *
 * @arg ScaleMin:num
 * @text Scale Minimum
 * @parent ScaleMax:num
 * @desc How does the scale change over time?
 * 0.0 = 0%; 0.5 = 50%; 1.0 = 100%; 2.0 = 200%
 * @default 0.9
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 20
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. Minimum: 20.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Phase_InOut
 * @text EFFECT: Phase In/Out
 * @desc Picture(s) phases into view and out of view.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg EffectIn:str
 * @text Effect In/Out?
 * @type select
 * @option In
 * @option Out
 * @desc What effect type is this?
 * @default In
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 1
 * @desc How long is this effect's duration?
 * 60 frames = 1 second.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Piece_InOut
 * @text EFFECT: Piece In/Out
 * @desc Picture(s) flies in and out from a random screen border area.
 * Works best with multiple pictures.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg EffectIn:str
 * @text Effect In/Out?
 * @type select
 * @option In
 * @option Out
 * @desc What effect type is this?
 * @default In
 *
 * @arg Scale:eval
 * @text Border Scale
 * @desc What is the scale of the picture(s) at the border?
 * 0.0 = 0%; 0.5 = 50%; 1.0 = 100%; 2.0 = 200%
 * @default 2.0
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 1
 * @desc How long is this effect's duration?
 * 60 frames = 1 second.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Poison
 * @text EFFECT: Poison
 * @desc Picture(s) subject receives poison and becomes sickly.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Distance:num
 * @text Distance
 * @type number
 * @desc How far should the max horizontal distance be?
 * @default 24
 *
 * @arg Tone:eval
 * @text Color Tone
 * @desc What tone do you want for the effect?
 * Format: [Red, Green, Blue, Gray]
 * @default [0, 128, -68, 68]
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 20
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. Minimum: 20.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command PowerUp_Change
 * @text EFFECT: Power Up Change
 * @desc Picture(s) switches between two images before changing completely.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Filename:str
 * @text Transform Image
 * @type file
 * @dir img/pictures/
 * @require 1
 * @desc Filename used for the transform image.
 * @default 
 *
 * @arg Times:num
 * @text Effect Times
 * @type number
 * @min 1
 * @max 10
 * @desc How many times to switch images?
 * @default 3
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 1
 * @desc How long is each switch's duration?
 * 60 frames = 1 second.
 * @default 4
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Psychedelic
 * @text EFFECT: Psychedelic
 * @desc Picture(s) shifts hue all the way around.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 1
 * @desc How long is this effect's duration?
 * 60 frames = 1 second.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Pulse
 * @text EFFECT: Pulse
 * @desc Picture(s) pulses towards its new scale.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Scale:eval
 * @text Target Scale
 * @desc What is the target scale of the picture(s)?
 * 0.0 = 0%; 0.5 = 50%; 1.0 = 100%; 2.0 = 200%
 * @default 1.0
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 1
 * @desc How long is this effect's duration?
 * 60 frames = 1 second.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Q
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command QuickPress
 * @text EFFECT: Quick Press
 * @desc Picture(s) is quickly pressed and rebounds back into place.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg DistanceX:num
 * @text Distance X
 * @type number
 * @min 0
 * @desc What is this effect's X distance?
 * @default 8
 *
 * @arg DistanceY:num
 * @text Distance 16
 * @type number
 * @min 0
 * @desc What is this effect's Y distance?
 * @default 16
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 1
 * @desc How long is this effect's duration?
 * 60 frames = 1 second.
 * @default 4
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_R
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Random_InOut
 * @text EFFECT: Random In/Out
 * @desc Picture(s) fades in and out in random positions.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg EffectIn:str
 * @text Effect In/Out?
 * @type select
 * @option In
 * @option Out
 * @desc What effect type is this?
 * @default In
 *
 * @arg Distance:num
 * @text Distance
 * @type number
 * @min 1
 * @desc What is this effect's max randomized distance?
 * @default 200
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 1
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. Minimum: 10.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Roll_InOut
 * @text EFFECT: Roll In/Out
 * @desc Picture(s) rolls in from the side and out to the other.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg EffectIn:str
 * @text Effect In/Out?
 * @type select
 * @option In
 * @option Out
 * @desc What effect type is this?
 * @default In
 *
 * @arg Distance:num
 * @text Distance
 * @type number
 * @min 1
 * @desc What is this effect's roll distance?
 * @default 500
 *
 * @arg Direction:str
 * @text From Direction
 * @type select
 * @option From Left
 * @option From Right
 * @desc Select which direction the effect starts from.
 * @default From Left
 *
 * @arg Spins:num
 * @text Spin Times
 * @type number
 * @desc How many times does the picture(s) spin while rolling?
 * @default 1
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 1
 * @desc How long is this effect's duration?
 * 60 frames = 1 second.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Rotate
 * @text EFFECT: Rotate
 * @desc Picture(s) rotates clockwise or counter clockwise.
 * Apply opposite if the picture(s) is mirrored.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Direction:str
 * @text From Direction
 * @type select
 * @option Clockwise
 * @option Counter Clockwise
 * @desc Select which direction the effect rotates.
 * Apply opposite if the picture(s) is mirrored.
 * @default Clockwise
 *
 * @arg Spins:num
 * @text Spin Times
 * @type number
 * @desc How many times does the picture(s) spin while rolling?
 * @default 1
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 1
 * @desc How long is this effect's duration?
 * 60 frames = 1 second.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_S
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Shakey
 * @text EFFECT: Shakey
 * @desc Picture(s) shakes back and forth from side to side.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Times:num
 * @text Effect Times
 * @type number
 * @min 1
 * @desc How many times to extend this effect?
 * @default 10
 *
 * @arg Distance:num
 * @text Distance
 * @type number
 * @min 1
 * @desc What is this effect's shake distance?
 * @default 8
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Shrink_InOut
 * @text EFFECT: Shrink In/Out
 * @desc Picture(s) shrinks in and shrinks further inward.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg EffectIn:str
 * @text Effect In/Out?
 * @type select
 * @option In
 * @option Out
 * @desc What effect type is this?
 * @default In
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 1
 * @desc How long is this effect's duration?
 * 60 frames = 1 second.
 * @default 20
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Spazz
 * @text EFFECT: Spazz
 * @desc Picture(s) spazzes up, down, left, right at random.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Times:num
 * @text Effect Times
 * @type number
 * @min 1
 * @desc How many times to extend this effect?
 * @default 10
 *
 * @arg Distance:num
 * @text Distance
 * @type number
 * @min 1
 * @desc What is this effect's spazz distance?
 * @default 10
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Sidestep
 * @text EFFECT: Sidestep
 * @desc Picture(s) gains sidestep effect, moving left and right visually continuously.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg DistanceX:num
 * @text Distance X
 * @type number
 * @desc How far should the max horizontal distance be?
 * @default 100
 *
 * @arg Rate:num
 * @text Speed Rate
 * @desc How fast or slow should the effect be?
 * Smaller numbers are slower. Larger numbers are faster.
 * @default 0.05
 *
 * @arg Rng:eval
 * @text Random Seed
 * @desc What is the random seed used for this effect?
 * You may use JavaScript code.
 * @default Math.randomInt(5000)
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. 0 for instant change.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Spin_Change
 * @text EFFECT: Spin Change
 * @desc Picture(s) spins and changes into a different graphic.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Filename:str
 * @text Transform Image
 * @type file
 * @dir img/pictures/
 * @require 1
 * @desc Filename used for the transform image.
 * @default 
 *
 * @arg Scale:num
 * @text Scale Change
 * @desc How does the scale change over time?
 * 0.0 = 0%; 0.5 = 50%; 1.0 = 100%; 2.0 = 200%
 * @default 0.5
 *
 * @arg Spins:num
 * @text Spin Times
 * @type number
 * @min 1
 * @desc How many times does the picture(s) spin before transforming?
 * @default 3
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 1
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. Minimum: 20
 * @default 120
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Spin_InOut
 * @text EFFECT: Spin In/Out
 * @desc Picture(s) spins into view and out of view.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg EffectIn:str
 * @text Effect In/Out?
 * @type select
 * @option In
 * @option Out
 * @desc What effect type is this?
 * @default In
 *
 * @arg Spins:num
 * @text Spin Times
 * @type number
 * @desc How many times does the picture(s) spin while rolling?
 * @default 2
 *
 * @arg Scale:eval
 * @text Vanish Scale
 * @desc What is the scale of the picture(s) when null?
 * 0.0 = 0%; 0.5 = 50%; 1.0 = 100%; 2.0 = 200%
 * @default 0.5
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 1
 * @desc How long is this effect's duration?
 * 60 frames = 1 second.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Squish_InOut
 * @text EFFECT: Squish In/Out
 * @desc Picture(s) squishes as it enters and further as it exits.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg EffectIn:str
 * @text Effect In/Out?
 * @type select
 * @option In
 * @option Out
 * @desc What effect type is this?
 * @default In
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 1
 * @desc How long is this effect's duration?
 * 60 frames = 1 second.
 * @default 30
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Stretch_InOut
 * @text EFFECT: Stretch In/Out
 * @desc Picture(s) stretches as it enters and further as it exits.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg EffectIn:str
 * @text Effect In/Out?
 * @type select
 * @option In
 * @option Out
 * @desc What effect type is this?
 * @default In
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 1
 * @desc How long is this effect's duration?
 * 60 frames = 1 second.
 * @default 30
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Submerge_InOut
 * @text EFFECT: Submerge In/Out
 * @desc Picture(s) enters and exits the bottom of the screen.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg EffectIn:str
 * @text Effect In/Out?
 * @type select
 * @option In
 * @option Out
 * @desc What effect type is this?
 * @default In
 *
 * @arg Tone:eval
 * @text Color Tone
 * @desc What tone do you want for the effect?
 * Format: [Red, Green, Blue, Gray]
 * @default [0, 128, 160, 0]
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 10
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. Minimum: 10.
 * @default 40
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Swaying
 * @text EFFECT: Swaying
 * @desc Picture(s) sways back and forth from angle to angle continuously.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Range:num
 * @text Angle Range
 * @type number
 * @desc How many degrees should the picture sway?
 * @default 15
 *
 * @arg Rate:num
 * @text Speed Rate
 * @desc How fast or slow should the effect be?
 * Smaller numbers are slower. Larger numbers are faster.
 * @default 0.05
 *
 * @arg Rng:eval
 * @text Random Seed
 * @desc What is the random seed used for this effect?
 * You may use JavaScript code.
 * @default Math.randomInt(5000)
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. 0 for instant change.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_T
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Teleport_InOut
 * @text EFFECT: Teleport In/Out
 * @desc Picture(s) teleports into view and out of view.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg EffectIn:str
 * @text Effect In/Out?
 * @type select
 * @option In
 * @option Out
 * @desc What effect type is this?
 * @default In
 *
 * @arg Tone:eval
 * @text Color Tone
 * @desc What tone do you want for the effect?
 * Format: [Red, Green, Blue, Gray]
 * @default [240, 240, 240, 0]
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 1
 * @desc How long is this effect's duration?
 * 60 frames = 1 second.
 * @default 20
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Television_InOut
 * @text EFFECT: Television In/Out
 * @desc Picture(s) snaps in and out like a television screen.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg EffectIn:str
 * @text Effect In/Out?
 * @type select
 * @option In
 * @option Out
 * @desc What effect type is this?
 * @default In
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 1
 * @desc How long is this effect's duration?
 * 60 frames = 1 second.
 * @default 20
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Tint_Shift_By
 * @text EFFECT: Tint Shift By
 * @desc Picture(s) changes tone and its own Z Layer relatively.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Z:eval
 * @text Adjust Z
 * @desc Adjust the Z value of target picture(s) by this.
 * You may use JavaScript. + Move Front. - Move Back.
 * @default +0
 *
 * @arg Tone:eval
 * @text Color Tone
 * @desc What tone do you want for the effect?
 * Format: [Red, Green, Blue, Gray]
 * @default [0, 0, 0, 0]
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 1
 * @desc How long is this effect's duration?
 * 60 frames = 1 second.
 * @default 20
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Tint_Shift_To
 * @text EFFECT: Tint Shift To
 * @desc Picture(s) changes tone and its Z Layer to a specific value.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Z:eval
 * @text Target Z
 * @desc What Z Layer do you wish to assign this picture(s)?
 * You may use JavaScript.
 * @default 0
 *
 * @arg Tone:eval
 * @text Color Tone
 * @desc What tone do you want for the effect?
 * Format: [Red, Green, Blue, Gray]
 * @default [0, 0, 0, 0]
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 1
 * @desc How long is this effect's duration?
 * 60 frames = 1 second.
 * @default 20
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Transform
 * @text EFFECT: Transform
 * @desc Picture(s) transforms into another image with no other effects.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Filename:str
 * @text Transform Image
 * @type file
 * @dir img/pictures/
 * @require 1
 * @desc Filename used for the transform image.
 * @default 
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_U
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command UFO_InOut
 * @text EFFECT: UFO In/Out
 * @desc Picture(s) enters and exits the top of the screen.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg EffectIn:str
 * @text Effect In/Out?
 * @type select
 * @option In
 * @option Out
 * @desc What effect type is this?
 * @default In
 *
 * @arg Tone:eval
 * @text Color Tone
 * @desc What tone do you want for the effect?
 * Format: [Red, Green, Blue, Gray]
 * @default [68, 68, 128, 0]
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 10
 * @desc How long is this effect's duration?
 * 60 frames = 1 second. Minimum: 10.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_V
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Vibrate
 * @text EFFECT: Vibrate
 * @desc Picture(s) vibrates a certain distance from start to end.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Times:num
 * @text Effect Times
 * @type number
 * @min 1
 * @desc How many times to extend this effect?
 * @default 30
 *
 * @arg DistanceX:num
 * @text Distance X
 * @type number
 * @desc How far should the max horizontal distance be?
 * @default 24
 *
 * @arg DistanceY:num
 * @text Distance Y
 * @type number
 * @desc How far should the max vertical distance be?
 * @default 12
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_W
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Wobble
 * @text EFFECT: Wobble
 * @desc Picture(s) wobbles its angle from side to side.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Times:num
 * @text Effect Times
 * @type number
 * @min 1
 * @desc How many times to extend this effect?
 * @default 10
 *
 * @arg Degrees:num
 * @text Degrees
 * @type number
 * @min 1
 * @max 360
 * @desc How many degrees does this wobble?
 * @default 10
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Z
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Z_Layer_Change_By
 * @text EFFECT: Z Layer Change By
 * @desc Picture(s) changes its Z layer to a relative value.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Z:eval
 * @text Adjust Z
 * @desc Adjust the Z value of target picture(s) by this.
 * You may use JavaScript. + Move Front. - Move Back.
 * @default +1
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Z_Layer_Set_To
 * @text EFFECT: Z Layer Set To
 * @desc Picture(s) changes its Z layer to a specific value.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg Z:eval
 * @text Target Z
 * @desc What Z Layer do you wish to assign this picture(s)?
 * You may use JavaScript.
 * @default 0
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Zoom_InOut
 * @text EFFECT: Zoom In/Out
 * @desc Picture(s) zooms into view and out of.
 *
 * @arg PictureIDs:arraynum
 * @text Picture ID(s)
 * @type number[]
 * @min 1
 * @max 100
 * @desc Select which picture ID(s) to play this effect with.
 * @default ["1"]
 *
 * @arg EffectIn:str
 * @text Effect In/Out?
 * @type select
 * @option In
 * @option Out
 * @desc What effect type is this?
 * @default In
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 1
 * @desc How long is this effect's duration?
 * 60 frames = 1 second.
 * @default 60
 *
 * @arg Wait:eval
 * @text Wait for Completion?
 * @type boolean
 * @on Wait
 * @off Don't Wait
 * @desc Wait until effect is complete before moving onto next event command?
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_End
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @ ==========================================================================
 * @ Plugin Parameters
 * @ ==========================================================================
 *
 * @param BreakHead
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param ATTENTION
 * @default READ THE HELP FILE
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 *
 */
//=============================================================================

const _0x29bdbe=_0x2c0c;(function(_0x1642f2,_0x3fb09b){const _0x1e9ff1=_0x2c0c,_0x38e4b4=_0x1642f2();while(!![]){try{const _0x1eff6b=-parseInt(_0x1e9ff1(0x24c))/0x1*(-parseInt(_0x1e9ff1(0x1f0))/0x2)+parseInt(_0x1e9ff1(0x3dd))/0x3+parseInt(_0x1e9ff1(0x2b9))/0x4*(parseInt(_0x1e9ff1(0x298))/0x5)+parseInt(_0x1e9ff1(0x2de))/0x6*(-parseInt(_0x1e9ff1(0x39e))/0x7)+-parseInt(_0x1e9ff1(0x3f9))/0x8+parseInt(_0x1e9ff1(0x380))/0x9+-parseInt(_0x1e9ff1(0x3da))/0xa;if(_0x1eff6b===_0x3fb09b)break;else _0x38e4b4['push'](_0x38e4b4['shift']());}catch(_0x59e526){_0x38e4b4['push'](_0x38e4b4['shift']());}}}(_0x3bed,0xce08e));var label=_0x29bdbe(0x373),tier=tier||0x0,dependencies=[_0x29bdbe(0x3c3)],pluginData=$plugins[_0x29bdbe(0x37d)](function(_0x19eb3d){const _0x3e23ef=_0x29bdbe;return _0x19eb3d[_0x3e23ef(0x217)]&&_0x19eb3d[_0x3e23ef(0x2a7)][_0x3e23ef(0x26b)]('['+label+']');})[0x0];VisuMZ[label]['Settings']=VisuMZ[label][_0x29bdbe(0x292)]||{},VisuMZ[_0x29bdbe(0x2bb)]=function(_0x2b388b,_0x19dc14){const _0x58a9c4=_0x29bdbe;for(const _0x4b1718 in _0x19dc14){if(_0x4b1718[_0x58a9c4(0x2db)](/(.*):(.*)/i)){if(_0x58a9c4(0x3d4)===_0x58a9c4(0x3d4)){const _0x11aef0=String(RegExp['$1']),_0x5ecc55=String(RegExp['$2'])[_0x58a9c4(0x3f5)]()[_0x58a9c4(0x297)]();let _0xf862f5,_0x4a1bd4,_0x50e986;switch(_0x5ecc55){case _0x58a9c4(0x2f9):_0xf862f5=_0x19dc14[_0x4b1718]!==''?Number(_0x19dc14[_0x4b1718]):0x0;break;case _0x58a9c4(0x225):_0x4a1bd4=_0x19dc14[_0x4b1718]!==''?JSON[_0x58a9c4(0x3e8)](_0x19dc14[_0x4b1718]):[],_0xf862f5=_0x4a1bd4[_0x58a9c4(0x2dc)](_0x51c1af=>Number(_0x51c1af));break;case _0x58a9c4(0x31a):_0xf862f5=_0x19dc14[_0x4b1718]!==''?eval(_0x19dc14[_0x4b1718]):null;break;case _0x58a9c4(0x1ea):_0x4a1bd4=_0x19dc14[_0x4b1718]!==''?JSON[_0x58a9c4(0x3e8)](_0x19dc14[_0x4b1718]):[],_0xf862f5=_0x4a1bd4[_0x58a9c4(0x2dc)](_0x1010e9=>eval(_0x1010e9));break;case'JSON':_0xf862f5=_0x19dc14[_0x4b1718]!==''?JSON[_0x58a9c4(0x3e8)](_0x19dc14[_0x4b1718]):'';break;case _0x58a9c4(0x2fc):_0x4a1bd4=_0x19dc14[_0x4b1718]!==''?JSON[_0x58a9c4(0x3e8)](_0x19dc14[_0x4b1718]):[],_0xf862f5=_0x4a1bd4[_0x58a9c4(0x2dc)](_0x414a42=>JSON[_0x58a9c4(0x3e8)](_0x414a42));break;case'FUNC':_0xf862f5=_0x19dc14[_0x4b1718]!==''?new Function(JSON['parse'](_0x19dc14[_0x4b1718])):new Function('return\x200');break;case _0x58a9c4(0x1d8):_0x4a1bd4=_0x19dc14[_0x4b1718]!==''?JSON[_0x58a9c4(0x3e8)](_0x19dc14[_0x4b1718]):[],_0xf862f5=_0x4a1bd4['map'](_0x150ea3=>new Function(JSON['parse'](_0x150ea3)));break;case _0x58a9c4(0x3f1):_0xf862f5=_0x19dc14[_0x4b1718]!==''?String(_0x19dc14[_0x4b1718]):'';break;case _0x58a9c4(0x253):_0x4a1bd4=_0x19dc14[_0x4b1718]!==''?JSON[_0x58a9c4(0x3e8)](_0x19dc14[_0x4b1718]):[],_0xf862f5=_0x4a1bd4[_0x58a9c4(0x2dc)](_0x29ec4e=>String(_0x29ec4e));break;case'STRUCT':_0x50e986=_0x19dc14[_0x4b1718]!==''?JSON[_0x58a9c4(0x3e8)](_0x19dc14[_0x4b1718]):{},_0xf862f5=VisuMZ['ConvertParams']({},_0x50e986);break;case'ARRAYSTRUCT':_0x4a1bd4=_0x19dc14[_0x4b1718]!==''?JSON[_0x58a9c4(0x3e8)](_0x19dc14[_0x4b1718]):[],_0xf862f5=_0x4a1bd4[_0x58a9c4(0x2dc)](_0x4faac7=>VisuMZ[_0x58a9c4(0x2bb)]({},JSON[_0x58a9c4(0x3e8)](_0x4faac7)));break;default:continue;}_0x2b388b[_0x11aef0]=_0xf862f5;}else{const _0x22d523=_0x5a406f['getLastPluginCommandInterpreter']();if(_0x22d523)_0x22d523[_0x58a9c4(0x29e)](_0x1c616f);}}}return _0x2b388b;},(_0x1ce7c2=>{const _0xcf7ffe=_0x29bdbe,_0x4efa06=_0x1ce7c2[_0xcf7ffe(0x30c)];for(const _0x1f8650 of dependencies){if(_0xcf7ffe(0x236)==='OBKtZ'){if(!Imported[_0x1f8650]){alert(_0xcf7ffe(0x2b1)[_0xcf7ffe(0x2cc)](_0x4efa06,_0x1f8650)),SceneManager[_0xcf7ffe(0x378)]();break;}}else this[_0xcf7ffe(0x362)]({'moveY':this['_y']+_0x40f628,'scaleX':this[_0xcf7ffe(0x257)]*1.2,'scaleY':this['_scaleY']*1.5,'opacity':0x0,'duration':0x0,'easingType':_0xcf7ffe(0x1ee)}),this['addToQueue']({'targetMoveY':this['_y'],'targetScaleX':this['_scaleX'],'targetScaleY':this[_0xcf7ffe(0x1f9)],'targetOpacity':this[_0xcf7ffe(0x2ef)]||0xff,'duration':_0x247d35,'easingType':_0xcf7ffe(0x35c)});}const _0x31ab6d=_0x1ce7c2[_0xcf7ffe(0x2a7)];if(_0x31ab6d[_0xcf7ffe(0x2db)](/\[Version[ ](.*?)\]/i)){if(_0xcf7ffe(0x284)==='YfhCd'){const _0x8746c8=_0x6d1550[_0xcf7ffe(0x28d)]();if(_0x8746c8)_0x8746c8[_0xcf7ffe(0x29e)](_0x3af53d);}else{const _0x354bbd=Number(RegExp['$1']);_0x354bbd!==VisuMZ[label]['version']&&(alert(_0xcf7ffe(0x234)[_0xcf7ffe(0x2cc)](_0x4efa06,_0x354bbd)),SceneManager[_0xcf7ffe(0x378)]());}}if(_0x31ab6d[_0xcf7ffe(0x2db)](/\[Tier[ ](\d+)\]/i)){if('RWUtV'!==_0xcf7ffe(0x34e))return _0x4afa9b['_z']-_0x2d20df['_z'];else{const _0x588424=Number(RegExp['$1']);_0x588424<tier?'fKkLi'!==_0xcf7ffe(0x3b2)?this['addToQueue']({'targetScaleX':this[_0xcf7ffe(0x257)]*0.05,'targetScaleY':this['_scaleY']*0.05,'targetOpacity':0x0,'duration':_0x107fb1,'easingType':_0xcf7ffe(0x349)}):(alert('%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.'[_0xcf7ffe(0x2cc)](_0x4efa06,_0x588424,tier)),SceneManager['exit']()):tier=Math['max'](_0x588424,tier);}}VisuMZ[_0xcf7ffe(0x2bb)](VisuMZ[label][_0xcf7ffe(0x292)],_0x1ce7c2[_0xcf7ffe(0x2ae)]);})(pluginData);if(VisuMZ['CoreEngine'][_0x29bdbe(0x387)]<1.77){let text='';text+=_0x29bdbe(0x2f2),text+=_0x29bdbe(0x30a),alert(text),SceneManager[_0x29bdbe(0x378)]();}function _0x3bed(){const _0x11060a=['Spins','Piece_InOut','updatePictureEffectsXyAlter','TRKSs','otrgJ','Glow','bind','_targetOpacity','setupEffect_Rotate','setupEffect_Angry','32ckvnkx','setupEffect_Card_Flip','setupEffect_Petrify','height','_pictureEffectsBlurFilter','WEwvh','toneDuration','ARRAYSTR','scaleX','fJMwm','rangeX','_scaleX','From\x20Right','nmHxw','setupEffect_Illusion','diiyT','depthX','DistanceY','Range','xzDYx','VbCwt','_pictureId','XJFdh','Expand_InOut','setupEffect_TintShiftTo','Zeqmc','clone','random','setupEffect_Poison','WEkMX','_targetY','includes','Teleport_InOut','depthY','updatePictureEffectsHueFilter','OutSine','targetTone','IAwDZ','Sidestep','jXtWF','getPictureEffectsBlurFilter','changeBreathing','targetMoveX','Arrange_Vert','Tone2','_name','setupEffect_JumpByXy','FlyingCard','RAeEc','jTywK','targetRng','reduce','updatePictureEffectsDepthRates','cos','currentAngle','angleEasingType','afJWX','unmovedMouseX','pictureEffectsScaleY','WEMAT','getTotalQueueDuration','rangeY','flLOj','Hoppity','Wobble','getLastPluginCommandInterpreter','_hueFilterData','ScaleMax','caybT','setupEffect_TintShiftBy','Settings','changeDepth','anchor','doesQueueExist','Ladrk','trim','12590XAeomk','zBlEP','_toneDuration','updateBlurQueueData','Spazz','Transform','wait','setupEffect_TeleportInOut','_pictureEffectsSidestep','initPictureEffectsFilterData','children','scaleY','Game_Picture_x','Open','setupEffect_Jiggle','description','uRDut','targetDistance','HDUiF','width','yGomL','plusHover','parameters','setupEffect_SpinChange','BSCMs','%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.','NxJwc','updatePictureEffectsLayerZ','cbeLJ','osJPp','Random_InOut','easingType','moveY','2116RCBKFi','hGYMo','ConvertParams','targetBlur','pictureEffectsScaleX','Angry','setupEffect_ExpandInOut','Stretch_InOut','Zoom_InOut','setupEffect_Spazz','moveX','RPfoP','ztANw','xhMbV','setupEffect_OpenInOut','blendMode','setupEffect_Wobble','_targetScaleY','setupEffect_LevitateInOut','format','UCGeT','Drop_InOut','angle','Breathing','updatePictureEffectsHue','RangeY','targetRangeY','Squish_InOut','ayQRw','targetDistanceY','shift','setupEffect_SubmergeInOut','changeAlterXy','setupEffect_Damage','match','map','setupEffect_Template','91788epQSVK','RangeX','duration','floor','frameCount','GLFNj','show','distanceX','targetHue','rng','setupEffect_RandomInOut','SRIRR','Sprite_Picture_updateOther','hCuwc','JumpBy','MPwQg','max','_opacity','_targetX','targetOpacity','VisuMZ_0_CoreEngine\x20needs\x20to\x20be\x20updated\x20','update','Illusion','Jiggle','updateSidestep','Shakey','OutCubic','NUM','Counter\x20Clockwise','setupEffect_GhostInOut','ARRAYJSON','Tint_Shift_By','targetDistanceX','UDvSI','vpqmJ','pictureEffectsSway','setupEffect_Arrange_Horz','Distance','_blurFilterData','WjkKu','filename','gbfuD','Tint_Shift_To','opvdN','in\x20order\x20for\x20VisuMZ_2_PictureEffects\x20to\x20work.','PGFhT','name','TargetX','InOutCubic','initPictureEffectsXyAlter','EwsKi','_pictureContainer','setupEffect_FadeChange','updatePictureEffectsBlurFilter','Hue_Shift_To','setupEffect_SpinInOut','changeHover','Roll_InOut','Spriteset_Base_updatePictureSettings','HCdKW','EVAL','pOOox','targetAnchor','distanceY','Vibrate','PictureIDs','Hover','setupEffect_TelevisionInOut','TcHHU','setupEffect_Capsule_Burst','QuickPress','current','_queueChanges','blur','setupEffect_FlashChange','UFO_InOut','getPictureEffectsBlur','setupEffect_PulseScale','rtppV','bdcRg','InOutBack','Tone','Rng','setupEffect_TemplateInOut','setupEffect_FocusInOut','RdBTA','Hue_Shift_By','updatePictureSettings','setupEffect_UfoInOut','updateRotateQueueData','setupEffect_FadeLayerSwitch','targetRateY','Banner_InOut','Card_Flip','Filename','kKkMS','initPictureEffectsSway','JHlvE','setupEffect_ManaRestore','Game_Picture_scaleX','updateOther','Depth','dalfj','setupEffect_Arrange_Row','setupEffect_Vibrate','FlashTone','Phase_InOut','InOutSine','setZ','_easingType','currentBlur','_pictureEffectsColorFilter','RWUtV','Angle','HzTPS','updateQueue','JumpTo','prototype','Chilly','initialize','CEBqN','setupEffect_PowerUpChange','targetRangeX','rateX','Game_Picture_update','setupEffect_Arrange_Col','OutBack','OkJsk','setupEffect_Confused','AnchorX','push','Flash_Change','addToQueue','updatePictureEffectFilters','clearQueue','Capsule_Burst','setupEffect_Hoppity','vkVwH','Height','length','tone','BackMirror','bEwAq','target','Dizzy','lLYwu','KLxqA','setupEffect_Blur','setupEffect_QuickPress','PictureEffects','setupEffect_Dizzy','setupEffect_FlyingCard','BqViE','getPictureEffectsHue','exit','Blur','hnUiN','setupEffect_Berserk','pJaDi','filter','_duration','GhostTone','7776630JZjjvy','Xjpiv','GanRs','abs','BZXLV','angleDuration','updateHover','version','updatePictureEffectsDepthChanges','InQuint','Game_Picture_y','MZrRJ','range','KRCBN','getQueue','rateY','min','_pictureEffectsDepth','wwPNl','dBFwT','JvaHT','PetrifyTone','Fade_Layer_Switch','vEQYu','Scale','RateY','unmovedMouseY','Wtdau','changeZ','xndcp','385dMwkHW','efKND','laGfL','SlaFO','Hue','gobba','Z_Layer_Change_By','changeSwaying','targetScaleX','OGyGC','setupEffect_DropInOut','call','LnIux','pqJCI','Size','sJhqk','enabled','setupEffect_HueShiftTo','lpeuF','_wholeDuration','fKkLi','rate','ScaleMin','Sprite_Picture_initialize','EffectIn','indexOf','Open_InOut','oghGy','Rate','Submerge_InOut','gxNTb','Game_Picture_scaleY','_pictureEffectsLayerZ','setupEffect_MergeChange','_anglePlus','_toneTarget','addLoadListener','VisuMZ_0_CoreEngine','Psychedelic','updateMoveQueueData','updateZLayerQueueData','_pictureEffectsSway','Charm','PsvMJ','setupEffect_FadeInOut','clamp','OutQuint','setupEffect_Heal','targetRate','CkGgt','setupEffect_RollInOut','ccnyD','luMpE','setupEffect_Glow','TEpJx','jlcfA','opacity','Spin_InOut','eMQaJ','updateToneQueueData','5505940yJifvK','Times','setHue','2725401roOzAb','initPictureEffectsDepth','picture','targetRange','targetScaleY','Levitate_InOut','BackFilename','updatePictureEffects','Ghost_InOut','Z_Layer_Set_To','MDphI','parse','njfdl','initPictureEffectsLayerZ','ROntR','TargetY','Pulse','setupEffect_Arrange_Vert','setupEffect_Chilly','dYMSB','STR','Game_Picture_angle','Spin_Change','plusSidestep','toUpperCase','CvojU','pjvex','ITlRI','13067400fpVDPq','Focus_InOut','setupEffect_SquishInOut','filters','setupEffect_Transform','hue','round','setEasingType','ARRAYFUNC','hueDuration','setupEffect_HueShiftBy','updatePictureLayerZ','getPictureEffectsHueFilter','setupEffect_Charm','Tone1','MolFM','currentHue','changeSidestep','setupEffect_JumpToXy','setupEffect_StretchInOut','_pictureEffectsHover','Game_Picture_initialize','bKZvf','Fear','setupEffect_PhaseInOut','remove','ARRAYEVAL','hFZeo','PowerUp_Change','SQRIS','Linear','QBzRW','47798JcoNRf','setupEffect_ShrinkInOut','InBack','Heal','targetAngle','setupEffect_Electrocuted','InCubic','ZKtCM','loadPicture','_scaleY','Duration','RMPku','setupEffect_BannerInOut','Template_InOut','olGrY','updateHueQueueData','DistanceX','AnchorY','unNHy','Shrink_InOut','wholeDuration','distance','_tone','bfWGL','setupEffect_Shakey','Poison','targetRateX','targetMoveY','Berserk','lfSlB','Degrees','setupEffect_ZoomInOut','Television_InOut','setupEffect_PsycheScale','pow','Game_Picture_show','initPictureEffectsBreathing','initPictureEffects','Cwler','status','jMwoa','SortByLayerZ','Template_Normal','_blendMode','fuTju','_anchor','zoEbb','_targetAnchor','MyrcB','Direction','VDpxe','Merge_Change','rxyMr','ARRAYNUM','blurDuration','YYcqn','updatePictureEffectsDepth','anglePlus','_initiatedPictureEffectsBlendMode','updatePictureEffectsBlendMode','makeDeepCopy','setupEffect_PieceInOut','_coreEasingType','blnKP','HgaTb','Wait','ceil','hbEgv','%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.','QIPKI','OBKtZ','registerCommand','QeGYN','_pictureEffectsBreathing','Arrange_Horz','QinHU','oBuVL','wMSxx','randomInt','MvShR','pHnOp','updateAlterXy'];_0x3bed=function(){return _0x11060a;};return _0x3bed();}function _0x2c0c(_0x5da30c,_0x56f784){const _0x3beddf=_0x3bed();return _0x2c0c=function(_0x2c0c71,_0x586e14){_0x2c0c71=_0x2c0c71-0x1d1;let _0x40789b=_0x3beddf[_0x2c0c71];return _0x40789b;},_0x2c0c(_0x5da30c,_0x56f784);}VisuMZ[_0x29bdbe(0x373)][_0x29bdbe(0x1e5)]=Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x355)],Game_Picture[_0x29bdbe(0x353)]['initialize']=function(){const _0x25fb13=_0x29bdbe;VisuMZ['PictureEffects'][_0x25fb13(0x1e5)][_0x25fb13(0x3a9)](this),this['initPictureEffects']();},VisuMZ[_0x29bdbe(0x373)][_0x29bdbe(0x213)]=Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x2e4)],Game_Picture['prototype'][_0x29bdbe(0x2e4)]=function(_0x381699,_0x71d3c,_0x1837f8,_0x55181e,_0x13070a,_0x5de02c,_0x174ff2,_0x47b6e8){const _0x2b76b9=_0x29bdbe;VisuMZ[_0x2b76b9(0x373)][_0x2b76b9(0x213)][_0x2b76b9(0x3a9)](this,_0x381699,_0x71d3c,_0x1837f8,_0x55181e,_0x13070a,_0x5de02c,_0x174ff2,_0x47b6e8),this[_0x2b76b9(0x215)]();},Game_Picture[_0x29bdbe(0x353)]['initPictureEffects']=function(){const _0xf7447d=_0x29bdbe;this[_0xf7447d(0x364)](),this[_0xf7447d(0x2a1)](),this[_0xf7447d(0x30f)](),this[_0xf7447d(0x3de)](),this[_0xf7447d(0x214)](),this[_0xf7447d(0x33e)](),this[_0xf7447d(0x3ea)]();},VisuMZ[_0x29bdbe(0x373)][_0x29bdbe(0x2a4)]=Game_Picture['prototype']['x'],Game_Picture['prototype']['x']=function(){const _0x594376=_0x29bdbe;let _0xc2b9c8=VisuMZ[_0x594376(0x373)][_0x594376(0x2a4)][_0x594376(0x3a9)](this);return _0xc2b9c8+=this['plusSidestep'](),_0xc2b9c8+=this['depthX'](),_0xc2b9c8;},VisuMZ[_0x29bdbe(0x373)][_0x29bdbe(0x38a)]=Game_Picture[_0x29bdbe(0x353)]['y'],Game_Picture['prototype']['y']=function(){const _0x3f48ee=_0x29bdbe;let _0x5cd828=VisuMZ['PictureEffects'][_0x3f48ee(0x38a)][_0x3f48ee(0x3a9)](this);return _0x5cd828+=this[_0x3f48ee(0x2ad)](),_0x5cd828+=this[_0x3f48ee(0x26d)](),_0x5cd828;},VisuMZ[_0x29bdbe(0x373)][_0x29bdbe(0x341)]=Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x254)],Game_Picture['prototype']['scaleX']=function(){const _0x47f902=_0x29bdbe;let _0x162800=VisuMZ[_0x47f902(0x373)]['Game_Picture_scaleX']['call'](this);return _0x162800+=this[_0x47f902(0x2bd)](),_0x162800;},VisuMZ[_0x29bdbe(0x373)]['Game_Picture_scaleY']=Game_Picture[_0x29bdbe(0x353)]['scaleY'],Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x2a3)]=function(){const _0x4dd783=_0x29bdbe;let _0x5a346e=VisuMZ['PictureEffects'][_0x4dd783(0x3bd)][_0x4dd783(0x3a9)](this);return _0x5a346e+=this['pictureEffectsScaleY'](),_0x5a346e;},VisuMZ[_0x29bdbe(0x373)][_0x29bdbe(0x3f2)]=Game_Picture['prototype'][_0x29bdbe(0x2cf)],Game_Picture[_0x29bdbe(0x353)]['angle']=function(){const _0x56f103=_0x29bdbe;let _0x11be5f=VisuMZ[_0x56f103(0x373)][_0x56f103(0x3f2)]['call'](this);return _0x11be5f+=this[_0x56f103(0x301)](),_0x11be5f;},Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x364)]=function(){const _0x3b5d37=_0x29bdbe;this[_0x3b5d37(0x326)]=[];},Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x38e)]=function(){const _0x50fc74=_0x29bdbe;if(this[_0x50fc74(0x326)]===undefined)this['initPictureEffects']();return this['_queueChanges'];},Game_Picture['prototype']['doesQueueExist']=function(){const _0x18ca4e=_0x29bdbe;return this[_0x18ca4e(0x38e)]()[_0x18ca4e(0x369)]>0x0;},Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x362)]=function(_0x2ba909){const _0x5d98af=_0x29bdbe;if(this[_0x5d98af(0x326)]===undefined)this['initPictureEffects']();_0x2ba909[_0x5d98af(0x2e0)]===undefined&&(_0x5d98af(0x271)==='ZXMzD'?this['addToQueue']({'filename':_0x43312d,'targetScaleX':_0x2f5898[_0x5d98af(0x383)](this[_0x5d98af(0x257)])*(_0x53c660?-0x1:0x1),'duration':_0x180032['ceil'](_0x13a587/0x2),'easingType':_0x5d98af(0x1ee)}):_0x2ba909[_0x5d98af(0x2e0)]=0x1),this[_0x5d98af(0x326)][_0x5d98af(0x360)](_0x2ba909);},Game_Picture[_0x29bdbe(0x353)]['setAsQueue']=function(_0x4051af){const _0xf8045c=_0x29bdbe;if(this[_0xf8045c(0x326)]===undefined)this[_0xf8045c(0x215)]();this[_0xf8045c(0x326)]=_0x4051af;},Game_Picture['prototype'][_0x29bdbe(0x288)]=function(){const _0x15b13b=_0x29bdbe;return this[_0x15b13b(0x38e)]()[_0x15b13b(0x27f)]((_0x4fe1c5,_0x53ea09)=>_0x4fe1c5+_0x53ea09[_0x15b13b(0x2e0)],0x0);},VisuMZ['PictureEffects']['Game_Picture_update']=Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x2f3)],Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x2f3)]=function(){const _0x40f545=_0x29bdbe;VisuMZ[_0x40f545(0x373)][_0x40f545(0x35a)][_0x40f545(0x3a9)](this),this[_0x40f545(0x363)](),this[_0x40f545(0x244)](),this[_0x40f545(0x228)](),this['updatePictureEffectsBreathing'](),this['updatePictureEffectsSway'](),this[_0x40f545(0x37e)]<=0x0&&this[_0x40f545(0x295)]()&&(_0x40f545(0x246)!==_0x40f545(0x246)?this[_0x40f545(0x30f)]():this[_0x40f545(0x351)]());},Game_Picture['prototype'][_0x29bdbe(0x351)]=function(){const _0x43d61c=_0x29bdbe,_0x80acfa=this[_0x43d61c(0x326)][_0x43d61c(0x2d7)]();this[_0x43d61c(0x3c5)](_0x80acfa),this[_0x43d61c(0x337)](_0x80acfa),this[_0x43d61c(0x3d9)](_0x80acfa),this['updateBlurQueueData'](_0x80acfa),this[_0x43d61c(0x1ff)](_0x80acfa),this['updateZLayerQueueData'](_0x80acfa);},Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x3c5)]=function(_0x1aae49){const _0x132cd4=_0x29bdbe;if(!_0x1aae49)return;_0x1aae49[_0x132cd4(0x306)]!==undefined&&(this[_0x132cd4(0x279)]=_0x1aae49[_0x132cd4(0x306)]);_0x1aae49[_0x132cd4(0x294)]!==undefined&&(this[_0x132cd4(0x21d)]=JsonEx[_0x132cd4(0x22c)](_0x1aae49['anchor']),this[_0x132cd4(0x21f)]=JsonEx[_0x132cd4(0x22c)](_0x1aae49[_0x132cd4(0x294)]));_0x1aae49[_0x132cd4(0x31c)]!==undefined&&('bIkyJ'!==_0x132cd4(0x23c)?this[_0x132cd4(0x21f)]=JsonEx[_0x132cd4(0x22c)](_0x1aae49[_0x132cd4(0x31c)]):this[_0x132cd4(0x239)]={'scaleX':0x0,'scaleY':0x0,'rangeX':0x0,'targetRangeX':0x0,'rangeY':0x0,'targetRangeY':0x0,'rateX':-0x2707,'targetRateX':-0x2707,'rateY':-0x2707,'targetRateY':-0x2707,'rng':-0x2707,'targetRng':-0x2707,'duration':0x0});_0x1aae49[_0x132cd4(0x2c3)]!==undefined&&(this['_x']=Math[_0x132cd4(0x1d6)](_0x1aae49['moveX']),this[_0x132cd4(0x2f0)]=Math[_0x132cd4(0x1d6)](_0x1aae49[_0x132cd4(0x2c3)]));if(_0x1aae49[_0x132cd4(0x2b8)]!==undefined){if(_0x132cd4(0x2b4)!=='cbeLJ'){if(this[_0x132cd4(0x304)]===_0x485be3)this[_0x132cd4(0x2a1)]();return this[_0x132cd4(0x304)];}else this['_y']=Math['round'](_0x1aae49[_0x132cd4(0x2b8)]),this[_0x132cd4(0x26a)]=Math[_0x132cd4(0x1d6)](_0x1aae49[_0x132cd4(0x2b8)]);}_0x1aae49[_0x132cd4(0x276)]!==undefined&&(this[_0x132cd4(0x2f0)]=Math['round'](_0x1aae49[_0x132cd4(0x276)]));_0x1aae49[_0x132cd4(0x20b)]!==undefined&&(_0x132cd4(0x2e3)===_0x132cd4(0x2e3)?this[_0x132cd4(0x26a)]=Math[_0x132cd4(0x1d6)](_0x1aae49[_0x132cd4(0x20b)]):(_0x4b8089[_0x132cd4(0x373)][_0x132cd4(0x213)][_0x132cd4(0x3a9)](this,_0x17baa7,_0x2c532a,_0x4fbe22,_0x314002,_0x2bdbee,_0x36056a,_0x2ab12c,_0x29b581),this[_0x132cd4(0x215)]()));if(_0x1aae49[_0x132cd4(0x254)]!==undefined){if(_0x132cd4(0x3eb)==='ROntR')this['_scaleX']=Math[_0x132cd4(0x1d6)](_0x1aae49[_0x132cd4(0x254)]),this['_targetScaleX']=Math[_0x132cd4(0x1d6)](_0x1aae49[_0x132cd4(0x254)]);else{const _0x46e8ae=_0x4cd513[_0x132cd4(0x28d)]();if(_0x46e8ae)_0x46e8ae[_0x132cd4(0x29e)](_0xba522b);}}_0x1aae49['scaleY']!==undefined&&(this[_0x132cd4(0x1f9)]=Math['round'](_0x1aae49[_0x132cd4(0x2a3)]),this[_0x132cd4(0x2ca)]=Math['round'](_0x1aae49[_0x132cd4(0x2a3)]));_0x1aae49[_0x132cd4(0x3a6)]!==undefined&&(this['_targetScaleX']=Math[_0x132cd4(0x1d6)](_0x1aae49[_0x132cd4(0x3a6)]));_0x1aae49[_0x132cd4(0x3e1)]!==undefined&&('asrCE'===_0x132cd4(0x2d5)?(this[_0x132cd4(0x364)](),this[_0x132cd4(0x362)]({'targetBlur':_0x403068,'blurDuration':_0x1bc571,'duration':_0x15301b?_0x3a3bf7:0x0,'easingType':_0x132cd4(0x1ee)})):this[_0x132cd4(0x2ca)]=Math[_0x132cd4(0x1d6)](_0x1aae49['targetScaleY']));_0x1aae49[_0x132cd4(0x3d6)]!==undefined&&(this[_0x132cd4(0x2ef)]=Math[_0x132cd4(0x1d6)](_0x1aae49[_0x132cd4(0x3d6)]),this[_0x132cd4(0x249)]=Math[_0x132cd4(0x1d6)](_0x1aae49[_0x132cd4(0x3d6)]));_0x1aae49[_0x132cd4(0x2f1)]!==undefined&&(this[_0x132cd4(0x249)]=Math['round'](_0x1aae49[_0x132cd4(0x2f1)]));_0x1aae49[_0x132cd4(0x2c8)]!==undefined&&(this[_0x132cd4(0x21b)]=_0x1aae49[_0x132cd4(0x2c8)]);if(!_0x1aae49['duration'])_0x1aae49[_0x132cd4(0x2e0)]=0x0;this['_duration']=Math['round'](_0x1aae49[_0x132cd4(0x2e0)]),this[_0x132cd4(0x3b1)]=Math['round'](_0x1aae49['duration']);if(_0x1aae49[_0x132cd4(0x2b7)]!==undefined){if(_0x132cd4(0x392)===_0x132cd4(0x20d)){let _0xa30ad2=_0x2525eb['PictureEffects'][_0x132cd4(0x2a4)][_0x132cd4(0x3a9)](this);return _0xa30ad2+=this['plusSidestep'](),_0xa30ad2+=this[_0x132cd4(0x25c)](),_0xa30ad2;}else this[_0x132cd4(0x34b)]=_0x1aae49['easingType'],this[_0x132cd4(0x22e)]=_0x1aae49[_0x132cd4(0x2b7)];}},Game_Picture['prototype'][_0x29bdbe(0x337)]=function(_0x4b5945){const _0x2a467d=_0x29bdbe;if(this[_0x2a467d(0x3c0)]===undefined)this['initRotationCoreEngine']();if(_0x4b5945[_0x2a467d(0x282)]!==undefined){if(_0x2a467d(0x218)!==_0x2a467d(0x262))this[_0x2a467d(0x3c0)][_0x2a467d(0x325)]=Math['round'](_0x4b5945[_0x2a467d(0x282)]),this[_0x2a467d(0x3c0)]['target']=Math[_0x2a467d(0x1d6)](_0x4b5945[_0x2a467d(0x282)]);else{this[_0x2a467d(0x391)]===_0x151f10&&this[_0x2a467d(0x3de)]();const _0x3149c3=this[_0x2a467d(0x391)];return _0x3149c3['distanceY']/0x2*_0x3149c3[_0x2a467d(0x38f)];}}_0x4b5945[_0x2a467d(0x1f4)]!==undefined&&(this[_0x2a467d(0x3c0)][_0x2a467d(0x36d)]=Math[_0x2a467d(0x1d6)](_0x4b5945[_0x2a467d(0x1f4)]));if(!_0x4b5945['duration'])_0x4b5945[_0x2a467d(0x2e0)]=0x0;this[_0x2a467d(0x3c0)][_0x2a467d(0x2e0)]=Math['round'](_0x4b5945[_0x2a467d(0x2e0)]),this[_0x2a467d(0x3c0)][_0x2a467d(0x204)]=Math[_0x2a467d(0x1d6)](_0x4b5945[_0x2a467d(0x2e0)]),_0x4b5945[_0x2a467d(0x385)]!==undefined&&(this[_0x2a467d(0x3c0)][_0x2a467d(0x2e0)]=Math[_0x2a467d(0x1d6)](_0x4b5945[_0x2a467d(0x385)]),this[_0x2a467d(0x3c0)][_0x2a467d(0x204)]=Math[_0x2a467d(0x1d6)](_0x4b5945['angleDuration'])),_0x4b5945['angleEasingType']!==undefined&&(this[_0x2a467d(0x3c0)][_0x2a467d(0x2b7)]=_0x4b5945[_0x2a467d(0x283)]);},Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x3d9)]=function(_0x48e034){const _0x1fa0a9=_0x29bdbe;if(!_0x48e034)return;_0x48e034[_0x1fa0a9(0x36a)]!==undefined&&(this['_tone']=_0x48e034['tone'][_0x1fa0a9(0x266)](),this[_0x1fa0a9(0x3c1)]=_0x48e034['tone'][_0x1fa0a9(0x266)]()),_0x48e034[_0x1fa0a9(0x270)]!==undefined&&(this['_tone']=this[_0x1fa0a9(0x206)]?this[_0x1fa0a9(0x206)]:[0x0,0x0,0x0,0x0],this[_0x1fa0a9(0x3c1)]=_0x48e034[_0x1fa0a9(0x270)][_0x1fa0a9(0x266)]()),_0x48e034['toneDuration']!==undefined&&(_0x1fa0a9(0x3bc)===_0x1fa0a9(0x3bc)?this[_0x1fa0a9(0x29a)]=Math['round'](_0x48e034[_0x1fa0a9(0x252)]):_0x2d080d[_0x1fa0a9(0x38f)]=_0x253966[_0x1fa0a9(0x339)]);},Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x2a1)]=function(){const _0x25db73=_0x29bdbe;this[_0x25db73(0x304)]={'enabled':![],'blur':0x0,'targetBlur':0x0,'duration':0x0},this['_hueFilterData']={'enabled':![],'hue':0x0,'targetHue':0x0,'duration':0x0};},Game_Picture['prototype']['updatePictureEffectFilters']=function(){const _0x3a34b9=_0x29bdbe;this[_0x3a34b9(0x313)](),this[_0x3a34b9(0x26e)]();},Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x274)]=function(){const _0x4229f5=_0x29bdbe;if(this[_0x4229f5(0x304)]===undefined)this['initPictureEffectsFilterData']();return this['_blurFilterData'];},Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x32a)]=function(){const _0x3f5894=_0x29bdbe;if(this[_0x3f5894(0x304)]===undefined)this['initPictureEffectsFilterData']();return this[_0x3f5894(0x304)][_0x3f5894(0x327)];},Game_Picture['prototype'][_0x29bdbe(0x313)]=function(){const _0x1be7b1=_0x29bdbe,_0x24f8b5=this[_0x1be7b1(0x274)]();if(!_0x24f8b5[_0x1be7b1(0x3ae)])return;if(_0x24f8b5['duration']<=0x0)return;const _0xdee30d=_0x24f8b5[_0x1be7b1(0x2e0)];_0x24f8b5[_0x1be7b1(0x327)]=(_0x24f8b5[_0x1be7b1(0x327)]*(_0xdee30d-0x1)+_0x24f8b5['targetBlur'])/_0xdee30d,_0x24f8b5['duration']--,_0x24f8b5[_0x1be7b1(0x2e0)]<=0x0&&('ebjhh'===_0x1be7b1(0x305)?this['addToQueue']({'targetOpacity':0x0,'targetScaleX':this[_0x1be7b1(0x257)]*0.8,'targetScaleY':this[_0x1be7b1(0x1f9)]*0.8,'targetBlur':0xa,'duration':_0x49be56,'blurDuration':_0x2129b5,'easingType':_0x1be7b1(0x1f2)}):_0x24f8b5[_0x1be7b1(0x327)]=_0x24f8b5[_0x1be7b1(0x2bc)]);},Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x29b)]=function(_0x2071c0){const _0xf5f21b=_0x29bdbe,_0x5d6671=this[_0xf5f21b(0x274)]();_0x2071c0[_0xf5f21b(0x34c)]!==undefined&&(_0x5d6671[_0xf5f21b(0x3ae)]=!![],_0x5d6671[_0xf5f21b(0x327)]=_0x2071c0[_0xf5f21b(0x34c)],_0x5d6671[_0xf5f21b(0x2bc)]=_0x2071c0['currentBlur']),_0x2071c0[_0xf5f21b(0x2bc)]!==undefined&&(_0x5d6671['enabled']=!![],_0x5d6671['targetBlur']=_0x2071c0[_0xf5f21b(0x2bc)]),_0x2071c0['blurDuration']!==undefined&&(_0x5d6671[_0xf5f21b(0x3ae)]=!![],_0x5d6671[_0xf5f21b(0x2e0)]=Math[_0xf5f21b(0x1d6)](_0x2071c0[_0xf5f21b(0x226)]));},Game_Picture['prototype'][_0x29bdbe(0x1dc)]=function(){const _0x1da4d4=_0x29bdbe;if(this[_0x1da4d4(0x28e)]===undefined)this['initPictureEffectsFilterData']();return this[_0x1da4d4(0x28e)];},Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x377)]=function(){const _0xc7c054=_0x29bdbe;return this[_0xc7c054(0x1dc)]()['hue'];},Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x26e)]=function(){const _0xe5d231=_0x29bdbe,_0x23e68d=this[_0xe5d231(0x1dc)]();if(!_0x23e68d[_0xe5d231(0x3ae)])return;if(_0x23e68d[_0xe5d231(0x2e0)]<=0x0)return;const _0x55e159=_0x23e68d[_0xe5d231(0x2e0)];_0x23e68d['hue']=(_0x23e68d[_0xe5d231(0x1d5)]*(_0x55e159-0x1)+_0x23e68d[_0xe5d231(0x2e6)])/_0x55e159,_0x23e68d[_0xe5d231(0x2e0)]--;if(_0x23e68d[_0xe5d231(0x2e0)]<=0x0){if(_0xe5d231(0x245)!==_0xe5d231(0x1eb))_0x23e68d[_0xe5d231(0x1d5)]=_0x23e68d[_0xe5d231(0x2e6)];else{this[_0xe5d231(0x364)]();let _0x4b097d=this['_x'],_0x585925=this['_y'];const _0x1a3c4d=_0x4b097d+_0x2172fc,_0x42e7be=_0x585925+_0x1bac0e,_0x21096a=_0x267fc3;let _0x5b544e=_0x21096a;this[_0xe5d231(0x1d7)](_0xe5d231(0x1ee));while(_0x5b544e--){_0x4b097d=(_0x4b097d*_0x5b544e+_0x1a3c4d)/(_0x5b544e+0x1),_0x585925=(_0x585925*_0x5b544e+_0x42e7be)/(_0x5b544e+0x1);const _0x579f02=_0x21096a-(_0x5b544e+0x1),_0x334535=_0x21096a/0x2,_0xd3c722=_0x52bddf,_0x96fc87=-_0xd3c722/_0x24f8e7[_0xe5d231(0x212)](_0x334535,0x2),_0x14a0b9=_0x96fc87*_0x4b8500[_0xe5d231(0x212)](_0x579f02-_0x334535,0x2)+_0xd3c722;this['addToQueue']({'moveX':_0x4b097d,'moveY':_0x585925-_0x14a0b9,'duration':0x1});}this[_0xe5d231(0x362)]({'moveX':_0x1a3c4d,'moveY':_0x42e7be,'duration':0x0});}}},Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x1ff)]=function(_0x261f79){const _0x2fcb39=_0x29bdbe,_0x4cd85b=this[_0x2fcb39(0x1dc)]();_0x261f79[_0x2fcb39(0x1e0)]!==undefined&&('gffMt'===_0x2fcb39(0x216)?this['_pictureEffectsLayerZ']=_0x2defec[_0x2fcb39(0x34a)]:(_0x4cd85b[_0x2fcb39(0x3ae)]=!![],_0x4cd85b[_0x2fcb39(0x1d5)]=Math[_0x2fcb39(0x1d6)](_0x261f79[_0x2fcb39(0x1e0)]),_0x4cd85b['targetHue']=Math[_0x2fcb39(0x1d6)](_0x261f79[_0x2fcb39(0x1e0)]))),_0x261f79[_0x2fcb39(0x2e6)]!==undefined&&(_0x4cd85b[_0x2fcb39(0x3ae)]=!![],_0x4cd85b[_0x2fcb39(0x2e6)]=Math['round'](_0x261f79[_0x2fcb39(0x2e6)])),_0x261f79[_0x2fcb39(0x1d9)]!==undefined&&(_0x4cd85b['enabled']=!![],_0x4cd85b[_0x2fcb39(0x2e0)]=Math['round'](_0x261f79['hueDuration']));},Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x30f)]=function(){const _0x5860f1=_0x29bdbe;this[_0x5860f1(0x1e4)]={'y':0x0,'distance':0x0,'targetDistance':0x0,'rate':-0x2707,'targetRate':-0x2707,'rng':-0x2707,'targetRng':-0x2707,'duration':0x0},this[_0x5860f1(0x2a0)]={'x':0x0,'distance':0x0,'targetDistance':0x0,'rate':-0x2707,'targetRate':-0x2707,'rng':-0x2707,'targetRng':-0x2707,'duration':0x0};},Game_Picture[_0x29bdbe(0x353)]['updatePictureEffectsXyAlter']=function(){this['updateHover'](),this['updateSidestep']();},Game_Picture['prototype'][_0x29bdbe(0x2d9)]=function(_0x5b8fb5,_0x139608,_0x1bb715,_0x271e2c,_0x54ed6c){const _0x54ef8f=_0x29bdbe;_0x5b8fb5[_0x54ef8f(0x2a9)]=_0x139608,_0x5b8fb5[_0x54ef8f(0x3ce)]=_0x1bb715,_0x5b8fb5[_0x54ef8f(0x27e)]=_0x271e2c,_0x5b8fb5[_0x54ef8f(0x2e0)]=_0x54ed6c;_0x5b8fb5[_0x54ef8f(0x3b3)]===-0x2707&&(_0x5b8fb5['rate']=_0x5b8fb5[_0x54ef8f(0x3ce)]);_0x5b8fb5[_0x54ef8f(0x2e7)]===-0x2707&&(_0x5b8fb5['rng']=_0x5b8fb5['targetRng']);if(_0x54ed6c<=0x0){if('rbzEx'===_0x54ef8f(0x322)){const _0x41f213=_0x5e125b[_0x54ef8f(0x28d)]();if(_0x41f213)_0x41f213[_0x54ef8f(0x29e)](_0x27d04d);}else _0x5b8fb5[_0x54ef8f(0x205)]=_0x139608,_0x5b8fb5[_0x54ef8f(0x3b3)]=_0x1bb715,_0x5b8fb5['rng']=_0x271e2c;}},Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x241)]=function(_0x147a09,_0x2ffa84){const _0x5e02ad=_0x29bdbe;if(_0x147a09[_0x5e02ad(0x2e0)]>0x0){if(_0x5e02ad(0x1ef)===_0x5e02ad(0x1ef)){const _0x17d1c3=_0x147a09['duration'];_0x147a09[_0x5e02ad(0x205)]=(_0x147a09[_0x5e02ad(0x205)]*(_0x17d1c3-0x1)+_0x147a09[_0x5e02ad(0x2a9)])/_0x17d1c3,_0x147a09[_0x5e02ad(0x3b3)]=(_0x147a09[_0x5e02ad(0x3b3)]*(_0x17d1c3-0x1)+_0x147a09[_0x5e02ad(0x3ce)])/_0x17d1c3,_0x147a09[_0x5e02ad(0x2e7)]=(_0x147a09[_0x5e02ad(0x2e7)]*(_0x17d1c3-0x1)+_0x147a09[_0x5e02ad(0x27e)])/_0x17d1c3,_0x147a09['duration']--;}else{const _0x29b1f5=_0x2470db[_0x5e02ad(0x28d)]();if(_0x29b1f5)_0x29b1f5[_0x5e02ad(0x29e)](_0x2f4b23);}}const _0x142102=Graphics[_0x5e02ad(0x2e2)]+_0x147a09['rng'];_0x147a09[_0x2ffa84]=Math['cos'](_0x142102*_0x147a09[_0x5e02ad(0x3b3)])*_0x147a09[_0x5e02ad(0x205)];},Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x316)]=function(_0x50a8c0,_0x48387,_0x14142b,_0x3165d9){const _0x2676c2=_0x29bdbe;this[_0x2676c2(0x1e4)]===undefined&&this['initPictureEffectsXyAlter'](),this[_0x2676c2(0x2d9)](this[_0x2676c2(0x1e4)],_0x50a8c0,_0x48387,_0x14142b,_0x3165d9);},Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x386)]=function(){const _0x2438d7=_0x29bdbe;this[_0x2438d7(0x1e4)]===undefined&&this[_0x2438d7(0x30f)]();const _0xe7e5cc=this[_0x2438d7(0x1e4)];this['updateAlterXy'](_0xe7e5cc,'y');},Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x2ad)]=function(){const _0x30c163=_0x29bdbe;if(this[_0x30c163(0x1e4)]===undefined){if('lIZMj'!==_0x30c163(0x367))this[_0x30c163(0x30f)]();else{this['_pictureEffectsSidestep']===_0x195df4&&this[_0x30c163(0x30f)]();const _0x1f3957=this[_0x30c163(0x2a0)];this[_0x30c163(0x241)](_0x1f3957,'x');}}return this[_0x30c163(0x1e4)]['y'];},Game_Picture[_0x29bdbe(0x353)]['changeSidestep']=function(_0x4ca79b,_0x3af7ba,_0x4c4720,_0x5b96ff){const _0x17257a=_0x29bdbe;this['_pictureEffectsSidestep']===undefined&&this[_0x17257a(0x30f)](),this[_0x17257a(0x2d9)](this['_pictureEffectsSidestep'],_0x4ca79b,_0x3af7ba,_0x4c4720,_0x5b96ff);},Game_Picture[_0x29bdbe(0x353)]['updateSidestep']=function(){const _0x29dd05=_0x29bdbe;this[_0x29dd05(0x2a0)]===undefined&&this[_0x29dd05(0x30f)]();const _0x2f5578=this[_0x29dd05(0x2a0)];this[_0x29dd05(0x241)](_0x2f5578,'x');},Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x3f4)]=function(){const _0x292b9e=_0x29bdbe;if(this['_pictureEffectsSidestep']===undefined){if(_0x292b9e(0x37a)===_0x292b9e(0x37a))this[_0x292b9e(0x30f)]();else{const _0x44ad38=_0x120e27['getLastPluginCommandInterpreter']();if(_0x44ad38)_0x44ad38[_0x292b9e(0x29e)](_0x42b4df);}}return this['_pictureEffectsSidestep']['x'];},Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x3de)]=function(){this['_pictureEffectsDepth']={'distanceX':0x0,'targetDistanceX':0x0,'distanceY':0x0,'targetDistanceY':0x0,'rateX':0x0,'rateY':0x0,'duration':0x0,'unmovedMouseX':!![],'unmovedMouseY':!![]};},Game_Picture['prototype'][_0x29bdbe(0x25c)]=function(){const _0x49c0e5=_0x29bdbe;this['_pictureEffectsDepth']===undefined&&(_0x49c0e5(0x3d1)===_0x49c0e5(0x2eb)?(_0x23ac8b[_0x49c0e5(0x373)]['Spriteset_Base_updatePictureSettings'][_0x49c0e5(0x3a9)](this),this[_0x49c0e5(0x1db)]()):this[_0x49c0e5(0x3de)]());const _0x5ea32c=this[_0x49c0e5(0x391)];return _0x5ea32c[_0x49c0e5(0x2e5)]/0x2*_0x5ea32c[_0x49c0e5(0x359)];},Game_Picture['prototype'][_0x29bdbe(0x26d)]=function(){const _0xb49e2f=_0x29bdbe;this[_0xb49e2f(0x391)]===undefined&&this[_0xb49e2f(0x3de)]();const _0x15d98e=this[_0xb49e2f(0x391)];return _0x15d98e[_0xb49e2f(0x31d)]/0x2*_0x15d98e['rateY'];},Game_Picture[_0x29bdbe(0x353)]['changeDepth']=function(_0x38c3f5,_0x4cf675,_0x2c3061){const _0x1d8f27=_0x29bdbe;this[_0x1d8f27(0x391)]===undefined&&this['initPictureEffectsDepth']();const _0x5a19bd=this[_0x1d8f27(0x391)];_0x5a19bd[_0x1d8f27(0x2fe)]=_0x38c3f5,_0x5a19bd[_0x1d8f27(0x2d6)]=_0x4cf675,_0x5a19bd[_0x1d8f27(0x2e0)]=_0x2c3061,_0x2c3061<=0x0&&('qBswJ'===_0x1d8f27(0x344)?(this[_0x1d8f27(0x2ef)]=_0x325396[_0x1d8f27(0x1d6)](_0x446074[_0x1d8f27(0x3d6)]),this[_0x1d8f27(0x249)]=_0x319a6e[_0x1d8f27(0x1d6)](_0x5b0bd4[_0x1d8f27(0x3d6)])):(_0x5a19bd[_0x1d8f27(0x2e5)]=_0x38c3f5,_0x5a19bd[_0x1d8f27(0x31d)]=_0x4cf675));},Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x228)]=function(){this['updatePictureEffectsDepthChanges'](),this['updatePictureEffectsDepthRates']();},Game_Picture['prototype'][_0x29bdbe(0x388)]=function(){const _0x3803d5=_0x29bdbe;this[_0x3803d5(0x391)]===undefined&&this[_0x3803d5(0x3de)]();const _0x218c6b=this[_0x3803d5(0x391)];if(_0x218c6b['duration']<=0x0)return;const _0x406bc2=_0x218c6b['duration'];_0x218c6b['distanceX']=(_0x218c6b[_0x3803d5(0x2e5)]*(_0x406bc2-0x1)+_0x218c6b[_0x3803d5(0x2fe)])/_0x406bc2,_0x218c6b[_0x3803d5(0x31d)]=(_0x218c6b[_0x3803d5(0x31d)]*(_0x406bc2-0x1)+_0x218c6b['targetDistanceY'])/_0x406bc2,_0x218c6b[_0x3803d5(0x2e0)]--;},Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x280)]=function(){const _0xb1631c=_0x29bdbe;this[_0xb1631c(0x391)]===undefined&&('pnBCN'!==_0xb1631c(0x2ba)?this[_0xb1631c(0x3de)]():this[_0xb1631c(0x1d3)][_0xb1631c(0x360)](this[_0xb1631c(0x34d)]));const _0x3ccd0a=this['_pictureEffectsDepth'];if(TouchInput['_x']>0x0)_0x3ccd0a['unmovedMouseX']=![];if(TouchInput['_y']>0x0)_0x3ccd0a[_0xb1631c(0x39a)]=![];const _0x269186=_0x3ccd0a[_0xb1631c(0x285)]?Graphics[_0xb1631c(0x2ab)]/0x2:0x0,_0x24d382=_0x3ccd0a['unmovedMouseY']?Graphics[_0xb1631c(0x24f)]/0x2:0x0,_0x2e0cf9=TouchInput['_x']||_0x269186,_0x297ba2=TouchInput['_y']||_0x24d382;_0x3ccd0a[_0xb1631c(0x359)]=-(_0x2e0cf9/Graphics[_0xb1631c(0x2ab)]*0x2-0x1),_0x3ccd0a[_0xb1631c(0x38f)]=-(_0x297ba2/Graphics[_0xb1631c(0x24f)]*0x2-0x1);},Game_Picture['prototype'][_0x29bdbe(0x214)]=function(){const _0x147957=_0x29bdbe;this[_0x147957(0x239)]={'scaleX':0x0,'scaleY':0x0,'rangeX':0x0,'targetRangeX':0x0,'rangeY':0x0,'targetRangeY':0x0,'rateX':-0x2707,'targetRateX':-0x2707,'rateY':-0x2707,'targetRateY':-0x2707,'rng':-0x2707,'targetRng':-0x2707,'duration':0x0};},Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x2bd)]=function(){const _0x44be04=_0x29bdbe;return this[_0x44be04(0x239)]===undefined&&this[_0x44be04(0x214)](),this[_0x44be04(0x239)]['scaleX'];},Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x286)]=function(){const _0x4e519f=_0x29bdbe;return this[_0x4e519f(0x239)]===undefined&&(_0x4e519f(0x3e9)!==_0x4e519f(0x3e9)?(this[_0x4e519f(0x362)]({'opacity':0x0,'scaleX':this['_scaleX']*0.8,'scaleY':this[_0x4e519f(0x1f9)]*0.8,'currentBlur':0xa,'duration':0x0}),this[_0x4e519f(0x362)]({'targetOpacity':this[_0x4e519f(0x2ef)]||0xff,'targetScaleX':this['_scaleX'],'targetScaleY':this['_scaleY'],'targetBlur':0x0,'duration':_0x5d953a,'blurDuration':_0x33620c,'easingType':_0x4e519f(0x35c)})):this[_0x4e519f(0x214)]()),this[_0x4e519f(0x239)][_0x4e519f(0x2a3)];},Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x275)]=function(_0x2b70dd,_0x3cde5c,_0x4b2722,_0x11071a,_0x42c80b,_0x2d132e){const _0x3bfbd7=_0x29bdbe;this[_0x3bfbd7(0x239)]===undefined&&this[_0x3bfbd7(0x214)]();const _0x3913b2=this[_0x3bfbd7(0x239)];_0x3913b2[_0x3bfbd7(0x358)]=_0x2b70dd,_0x3913b2[_0x3bfbd7(0x2d3)]=_0x3cde5c,_0x3913b2['targetRateX']=_0x4b2722,_0x3913b2[_0x3bfbd7(0x339)]=_0x11071a,_0x3913b2[_0x3bfbd7(0x27e)]=_0x42c80b,_0x3913b2[_0x3bfbd7(0x2e0)]=_0x2d132e,_0x3913b2['rateX']===-0x2707&&(_0x3913b2['rateX']=_0x3913b2[_0x3bfbd7(0x20a)]),_0x3913b2[_0x3bfbd7(0x38f)]===-0x2707&&(_0x3913b2[_0x3bfbd7(0x38f)]=_0x3913b2['targetRateY']),_0x3913b2[_0x3bfbd7(0x2e7)]===-0x2707&&(_0x3913b2[_0x3bfbd7(0x2e7)]=_0x3913b2[_0x3bfbd7(0x27e)]),_0x2d132e<=0x0&&(_0x3913b2[_0x3bfbd7(0x256)]=_0x2b70dd,_0x3913b2[_0x3bfbd7(0x289)]=_0x3cde5c,_0x3913b2['rateX']=_0x4b2722,_0x3913b2[_0x3bfbd7(0x38f)]=_0x11071a,_0x3913b2[_0x3bfbd7(0x2e7)]=_0x42c80b);},Game_Picture[_0x29bdbe(0x353)]['updatePictureEffectsBreathing']=function(){const _0x5aba0c=_0x29bdbe;this[_0x5aba0c(0x239)]===undefined&&this[_0x5aba0c(0x214)]();const _0xf625a8=this['_pictureEffectsBreathing'];if(_0xf625a8[_0x5aba0c(0x2e0)]>0x0){const _0x52c3f3=_0xf625a8[_0x5aba0c(0x2e0)];_0xf625a8[_0x5aba0c(0x256)]=(_0xf625a8['rangeX']*(_0x52c3f3-0x1)+_0xf625a8[_0x5aba0c(0x358)])/_0x52c3f3,_0xf625a8[_0x5aba0c(0x289)]=(_0xf625a8[_0x5aba0c(0x289)]*(_0x52c3f3-0x1)+_0xf625a8[_0x5aba0c(0x2d3)])/_0x52c3f3,_0xf625a8[_0x5aba0c(0x359)]=(_0xf625a8[_0x5aba0c(0x359)]*(_0x52c3f3-0x1)+_0xf625a8[_0x5aba0c(0x20a)])/_0x52c3f3,_0xf625a8[_0x5aba0c(0x38f)]=(_0xf625a8[_0x5aba0c(0x38f)]*(_0x52c3f3-0x1)+_0xf625a8[_0x5aba0c(0x339)])/_0x52c3f3,_0xf625a8['rng']=(_0xf625a8['rng']*(_0x52c3f3-0x1)+_0xf625a8['targetRng'])/_0x52c3f3,_0xf625a8[_0x5aba0c(0x2e0)]--;}const _0xbff5a2=Graphics['frameCount']+_0xf625a8[_0x5aba0c(0x2e7)];_0xf625a8[_0x5aba0c(0x254)]=Math[_0x5aba0c(0x281)](_0xbff5a2*_0xf625a8['rateX'])*_0xf625a8[_0x5aba0c(0x256)],_0xf625a8[_0x5aba0c(0x2a3)]=Math[_0x5aba0c(0x281)](_0xbff5a2*_0xf625a8[_0x5aba0c(0x38f)])*-_0xf625a8[_0x5aba0c(0x289)];},Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x33e)]=function(){const _0x180968=_0x29bdbe;this[_0x180968(0x3c7)]={'angle':0x0,'range':0x0,'targetRange':0x0,'rate':-0x2707,'targetRate':-0x2707,'rng':-0x2707,'targetRng':-0x2707,'duration':0x0};},Game_Picture[_0x29bdbe(0x353)]['pictureEffectsSway']=function(){const _0x150dd5=_0x29bdbe;return this[_0x150dd5(0x3c7)]===undefined&&this[_0x150dd5(0x33e)](),this[_0x150dd5(0x3c7)][_0x150dd5(0x2cf)];},Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x3a5)]=function(_0x500c92,_0x4a91a8,_0x5c4e2e,_0x357b27){const _0x2c171f=_0x29bdbe;this['_pictureEffectsSway']===undefined&&(_0x2c171f(0x32c)===_0x2c171f(0x28a)?(this['clearQueue'](),this[_0x2c171f(0x362)]({'tone':_0x4b9bd3[_0x2c171f(0x266)](),'duration':_0x1b8c98[_0x2c171f(0x2e1)](_0x880b01/0x2),'easingType':_0x2c171f(0x1ee)}),this[_0x2c171f(0x362)]({'targetTone':this[_0x2c171f(0x206)]?this[_0x2c171f(0x206)][_0x2c171f(0x266)]():[0x0,0x0,0x0,0x0],'toneDuration':_0x32c1be['ceil'](_0x5743c2/0x2),'duration':_0x4fcfd3[_0x2c171f(0x232)](_0x83fbcd/0x2),'easingType':'Linear'})):this['initPictureEffectsSway']());const _0x9ea860=this[_0x2c171f(0x3c7)];_0x9ea860[_0x2c171f(0x3e0)]=_0x500c92,_0x9ea860[_0x2c171f(0x3ce)]=_0x4a91a8,_0x9ea860[_0x2c171f(0x27e)]=_0x5c4e2e,_0x9ea860[_0x2c171f(0x2e0)]=_0x357b27,_0x9ea860[_0x2c171f(0x3b3)]===-0x2707&&(_0x9ea860[_0x2c171f(0x3b3)]=_0x9ea860['targetRate']),_0x9ea860['rng']===-0x2707&&('cCpUv'===_0x2c171f(0x33f)?this[_0x2c171f(0x3be)]=0x0:_0x9ea860[_0x2c171f(0x2e7)]=_0x9ea860['targetRng']),_0x357b27<=0x0&&(_0x9ea860['range']=_0x500c92,_0x9ea860['rate']=_0x4a91a8,_0x9ea860['rng']=_0x5c4e2e);},Game_Picture[_0x29bdbe(0x353)]['updatePictureEffectsSway']=function(){const _0x13d48d=_0x29bdbe;this[_0x13d48d(0x3c7)]===undefined&&(_0x13d48d(0x3f7)!==_0x13d48d(0x2cd)?this[_0x13d48d(0x33e)]():(_0x28fa57[_0x13d48d(0x3ae)]=!![],_0x101f9b['duration']=_0x23ebc0['round'](_0x49cbe4[_0x13d48d(0x1d9)])));const _0x27a3fa=this[_0x13d48d(0x3c7)];if(_0x27a3fa['duration']>0x0){const _0x415614=_0x27a3fa[_0x13d48d(0x2e0)];_0x27a3fa['range']=(_0x27a3fa[_0x13d48d(0x38c)]*(_0x415614-0x1)+_0x27a3fa['targetRange'])/_0x415614,_0x27a3fa[_0x13d48d(0x3b3)]=(_0x27a3fa['rate']*(_0x415614-0x1)+_0x27a3fa[_0x13d48d(0x3ce)])/_0x415614,_0x27a3fa['rng']=(_0x27a3fa['rng']*(_0x415614-0x1)+_0x27a3fa[_0x13d48d(0x27e)])/_0x415614,_0x27a3fa['duration']--;}const _0x2739bb=Graphics['frameCount']+_0x27a3fa[_0x13d48d(0x2e7)];_0x27a3fa['angle']=Math[_0x13d48d(0x281)](_0x2739bb*_0x27a3fa[_0x13d48d(0x3b3)])*_0x27a3fa['range'];},Game_Picture['prototype']['initPictureEffectsLayerZ']=function(){this['_pictureEffectsLayerZ']=0x0;},Game_Picture[_0x29bdbe(0x353)]['z']=function(){const _0x3f3ee2=_0x29bdbe;if(this[_0x3f3ee2(0x3be)]===undefined)this[_0x3f3ee2(0x3ea)]();return this[_0x3f3ee2(0x3be)];},Game_Picture[_0x29bdbe(0x353)]['setZ']=function(_0x3764e4){const _0x20905e=_0x29bdbe;if(this[_0x20905e(0x3be)]===undefined)this[_0x20905e(0x3ea)]();this[_0x20905e(0x3be)]=Number(_0x3764e4);},Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x39c)]=function(_0xa8a4b7){const _0x651d80=_0x29bdbe;if(this[_0x651d80(0x3be)]===undefined)this['initPictureEffectsLayerZ']();this[_0x651d80(0x3be)]+=_0xa8a4b7;},Game_Picture['prototype'][_0x29bdbe(0x3c6)]=function(_0x3a91e6){const _0x41b22c=_0x29bdbe;if(_0x3a91e6[_0x41b22c(0x34a)]!==undefined){if(_0x41b22c(0x376)==='BqViE')this['_pictureEffectsLayerZ']=_0x3a91e6[_0x41b22c(0x34a)];else{const _0x2389dd=_0x551138[_0x41b22c(0x2e1)](_0x1db804/0x5);this['clearQueue'](),this[_0x41b22c(0x362)]({'targetMoveX':this['_x']-_0x19d650,'duration':_0x2389dd,'targetTone':_0x558b3b[_0x41b22c(0x266)](),'toneDuration':_0x2389dd*0x3,'easingType':_0x41b22c(0x349)}),this[_0x41b22c(0x362)]({'targetMoveX':this['_x']+_0x3801b3,'duration':_0x2389dd,'easingType':_0x41b22c(0x349)}),this[_0x41b22c(0x362)]({'targetMoveX':this['_x']-_0x18bbea,'duration':_0x2389dd,'easingType':_0x41b22c(0x349)}),this[_0x41b22c(0x362)]({'targetMoveX':this['_x']+_0x3baec6,'duration':_0x2389dd,'easingType':_0x41b22c(0x349)}),this[_0x41b22c(0x362)]({'targetMoveX':this['_x'],'duration':_0x4b549c-_0x2389dd*0x4,'targetTone':this[_0x41b22c(0x206)]?this['_tone'][_0x41b22c(0x266)]():[0x0,0x0,0x0,0x0],'toneDuration':_0x2389dd,'easingType':'InOutSine'});}}if(_0x3a91e6[_0x41b22c(0x39c)]!==undefined){if(_0x41b22c(0x251)!=='WEwvh'){const _0x54126c=_0x448a4f[_0x41b22c(0x28d)]();if(_0x54126c)_0x54126c['wait'](_0x53185c);}else this[_0x41b22c(0x3be)]+=_0x3a91e6[_0x41b22c(0x39c)];}},VisuMZ[_0x29bdbe(0x373)][_0x29bdbe(0x3b5)]=Sprite_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x355)],Sprite_Picture[_0x29bdbe(0x353)]['initialize']=function(_0x12da36){const _0x1b4b73=_0x29bdbe;this['_z']=0x0,VisuMZ[_0x1b4b73(0x373)]['Sprite_Picture_initialize']['call'](this,_0x12da36);},VisuMZ[_0x29bdbe(0x373)][_0x29bdbe(0x2ea)]=Sprite_Picture[_0x29bdbe(0x353)]['updateOther'],Sprite_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x342)]=function(){const _0x54af10=_0x29bdbe;VisuMZ[_0x54af10(0x373)][_0x54af10(0x2ea)]['call'](this);if(this[_0x54af10(0x3df)]()){if(_0x54af10(0x32d)!=='bdcRg'){const _0x51cfd6=_0x1925f3['getLastPluginCommandInterpreter']();if(_0x51cfd6)_0x51cfd6[_0x54af10(0x29e)](_0x2d16d7);}else this[_0x54af10(0x3e4)]();}},Sprite_Picture[_0x29bdbe(0x353)]['updatePictureEffects']=function(){const _0x511db8=_0x29bdbe;this['updatePictureEffectsBlur'](),this[_0x511db8(0x2d1)](),this[_0x511db8(0x22b)](),this[_0x511db8(0x2b3)]();},Sprite_Picture[_0x29bdbe(0x353)]['updatePictureEffectsBlur']=function(){const _0xc868c3=_0x29bdbe,_0x4d44fa=this[_0xc868c3(0x3df)](),_0x2befc5=_0x4d44fa[_0xc868c3(0x274)]();if(!_0x2befc5['enabled']){this[_0xc868c3(0x250)]&&this[_0xc868c3(0x1d3)]['remove'](this[_0xc868c3(0x250)]);this['_pictureEffectsBlurFilter']=undefined;return;}if(!this[_0xc868c3(0x250)]){if(_0xc868c3(0x2c5)==='ztANw')this[_0xc868c3(0x250)]=new PIXI[(_0xc868c3(0x1d3))]['BlurFilter'](0x0),this['filters']=this[_0xc868c3(0x1d3)]||[],this[_0xc868c3(0x1d3)][_0xc868c3(0x360)](this[_0xc868c3(0x250)]),this[_0xc868c3(0x34d)]&&this[_0xc868c3(0x1d3)][_0xc868c3(0x360)](this[_0xc868c3(0x34d)]);else{const _0x370e7d=_0x47432d[_0xc868c3(0x28d)]();if(_0x370e7d)_0x370e7d['wait'](_0x5d6189);}}const _0x18e402=this[_0xc868c3(0x250)];_0x18e402[_0xc868c3(0x327)]=_0x2befc5[_0xc868c3(0x327)];},Sprite_Picture['prototype'][_0x29bdbe(0x2d1)]=function(){const _0xefef08=_0x29bdbe,_0x4b5488=this[_0xefef08(0x3df)](),_0x51b3b3=_0x4b5488[_0xefef08(0x377)]();this[_0xefef08(0x3dc)](_0x51b3b3);},Sprite_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x22b)]=function(){const _0x198aa2=_0x29bdbe,_0x447e56=this[_0x198aa2(0x3df)]();if(_0x447e56[_0x198aa2(0x2c8)]()===0x0&&!this['_initiatedPictureEffectsBlendMode'])return;if(!this[_0x198aa2(0x1d3)])return;if(this[_0x198aa2(0x1d3)][_0x198aa2(0x369)]<=0x0)return;this[_0x198aa2(0x22a)]=!![];if(!this['_pictureEffectsColorFilter']){if(_0x198aa2(0x3d8)===_0x198aa2(0x3d8))this[_0x198aa2(0x34d)]=new ColorFilter(),this[_0x198aa2(0x1d3)]=this[_0x198aa2(0x1d3)]||[],this[_0x198aa2(0x1d3)][_0x198aa2(0x360)](this[_0x198aa2(0x34d)]);else{const _0x1fb40c=_0x560115[_0x198aa2(0x28d)]();if(_0x1fb40c)_0x1fb40c[_0x198aa2(0x29e)](_0x3c4ca0);}}const _0x3924ed=this[_0x198aa2(0x34d)];_0x3924ed[_0x198aa2(0x2c8)]=_0x447e56[_0x198aa2(0x2c8)]();},Sprite_Picture['prototype']['updatePictureEffectsLayerZ']=function(){this['_z']=this['picture']()['z']();},VisuMZ[_0x29bdbe(0x373)][_0x29bdbe(0x318)]=Spriteset_Base['prototype'][_0x29bdbe(0x335)],Spriteset_Base['prototype'][_0x29bdbe(0x335)]=function(){const _0x228ed4=_0x29bdbe;VisuMZ[_0x228ed4(0x373)]['Spriteset_Base_updatePictureSettings'][_0x228ed4(0x3a9)](this),this[_0x228ed4(0x1db)]();},Spriteset_Base[_0x29bdbe(0x353)]['updatePictureLayerZ']=function(){const _0x1459d7=_0x29bdbe;if(!this[_0x1459d7(0x311)])return;VisuMZ[_0x1459d7(0x373)]['SortByLayerZ'](this[_0x1459d7(0x311)]);},VisuMZ[_0x29bdbe(0x373)]['SortByLayerZ']=function(_0x436302){const _0x540369=_0x29bdbe,_0x2af144=_0x436302[_0x540369(0x2a2)];_0x2af144['sort']((_0x49ecac,_0x206bb8)=>{const _0x2402d9=_0x540369;if(_0x2402d9(0x33d)!=='ohhJX'){if(_0x49ecac['_z']!==_0x206bb8['_z']){if(_0x2402d9(0x3d2)!==_0x2402d9(0x3d2)){let _0x3f122a=_0x4ea44c-0x8;this[_0x2402d9(0x364)](),this[_0x2402d9(0x362)]({'targetTone':_0x2277f3[_0x2402d9(0x266)](),'toneDuration':_0x3f122a,'duration':0x0,'easingType':'Linear'});while(_0x3f122a--){this[_0x2402d9(0x362)]({'moveX':this['_x']+_0x383be4['randomInt']((_0x3f122a%0x2===0x0?-0x1:0x1)*_0x1e69f2[_0x2402d9(0x390)](_0x10dc7a-_0x3f122a,0x10)),'moveY':this['_y']+_0x561d98['randomInt']((_0x3f122a%0x2===0x0?-0x1:0x1)*_0x5668fd[_0x2402d9(0x390)](_0x45fd87-_0x3f122a,0x8)),'duration':0x1,'easingType':_0x2402d9(0x1ee)});}this[_0x2402d9(0x362)]({'targetMoveX':this['_x'],'targetMoveY':this['_y'],'duration':0x8,'easingType':_0x2402d9(0x1ee)});}else return _0x49ecac['_z']-_0x206bb8['_z'];}return _0x49ecac['_pictureId']-_0x206bb8[_0x2402d9(0x261)];}else{const _0x3f09d7=_0x214b76[_0x2402d9(0x28d)]();if(_0x3f09d7)_0x3f09d7[_0x2402d9(0x29e)](_0x4cc99b);}});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x21a),_0x5829ee=>{const _0x2c3cca=_0x29bdbe;VisuMZ[_0x2c3cca(0x2bb)](_0x5829ee,_0x5829ee);const _0x381506=_0x5829ee[_0x2c3cca(0x31f)];if(_0x381506[_0x2c3cca(0x369)]<=0x0)return;const _0x3003be=Math[_0x2c3cca(0x2ee)](Number(_0x5829ee[_0x2c3cca(0x3db)]),0x1),_0x52a49f=Math[_0x2c3cca(0x2ee)](Number(_0x5829ee['Distance']),0x1),_0x4d1b57=Math[_0x2c3cca(0x2ee)](Number(_0x5829ee[_0x2c3cca(0x20e)]),0x1),_0x5d2e10=_0x5829ee[_0x2c3cca(0x32f)]||[0x0,0x0,0x0,0x0],_0x4a68c1=Math[_0x2c3cca(0x2ee)](Number(_0x5829ee[_0x2c3cca(0x1fa)]),0x1);let _0x2e9a64=0x0;for(const _0x3e2c5a of _0x381506){const _0x27854c=$gameScreen[_0x2c3cca(0x3df)](_0x3e2c5a);if(!_0x27854c)continue;_0x27854c[_0x2c3cca(0x2dd)](_0x3003be,_0x4d1b57),_0x2e9a64=_0x27854c[_0x2c3cca(0x288)]();}if(_0x5829ee[_0x2c3cca(0x231)]){const _0x3656b3=$gameTemp[_0x2c3cca(0x28d)]();if(_0x3656b3)_0x3656b3[_0x2c3cca(0x29e)](_0x2e9a64);}}),Game_Picture['prototype']['setupEffect_Template']=function(_0x2740d8,_0x1621b2){const _0x446bd8=_0x29bdbe;this[_0x446bd8(0x364)](),this['addToQueue']({'duration':0x0,'easingType':_0x446bd8(0x1ee)});},PluginManager['registerCommand'](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x1fd),_0x3c655d=>{const _0x49db4a=_0x29bdbe;VisuMZ['ConvertParams'](_0x3c655d,_0x3c655d);const _0x33cc59=_0x3c655d[_0x49db4a(0x31f)];if(_0x33cc59[_0x49db4a(0x369)]<=0x0)return;const _0x2fe035=_0x3c655d[_0x49db4a(0x3b6)]==='In',_0x14cdcd=_0x3c655d[_0x49db4a(0x221)]==='From\x20Right',_0x2e5522=Math['max'](Number(_0x3c655d[_0x49db4a(0x1fa)]),0x1);let _0x14a074=0x0;for(const _0x1d7d18 of _0x33cc59){const _0x33eeb5=$gameScreen[_0x49db4a(0x3df)](_0x1d7d18);if(!_0x33eeb5)continue;_0x33eeb5[_0x49db4a(0x331)](_0x2fe035,_0x2e5522),_0x14a074=_0x33eeb5[_0x49db4a(0x288)]();}if(_0x3c655d[_0x49db4a(0x231)]){if('RPfoP'!==_0x49db4a(0x2c4)){const _0x25775b=_0x726631[_0x49db4a(0x28d)]();if(_0x25775b)_0x25775b['wait'](_0x4d1c63);}else{const _0x41f7d7=$gameTemp[_0x49db4a(0x28d)]();if(_0x41f7d7)_0x41f7d7['wait'](_0x14a074);}}}),Game_Picture['prototype'][_0x29bdbe(0x331)]=function(_0x140788,_0x2db5dd){const _0x4350e9=_0x29bdbe;this[_0x4350e9(0x364)](),_0x140788?this[_0x4350e9(0x362)]({'duration':0x0,'easingType':_0x4350e9(0x1ee)}):this[_0x4350e9(0x362)]({'duration':0x0,'easingType':_0x4350e9(0x1ee)});},PluginManager['registerCommand'](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x2be),_0x346747=>{const _0x2fdd35=_0x29bdbe;VisuMZ[_0x2fdd35(0x2bb)](_0x346747,_0x346747);const _0x251522=_0x346747[_0x2fdd35(0x31f)];if(_0x251522[_0x2fdd35(0x369)]<=0x0)return;const _0x496c14=_0x346747[_0x2fdd35(0x32f)],_0x5461ec=Math[_0x2fdd35(0x2ee)](Number(_0x346747[_0x2fdd35(0x200)]),0x1),_0x34e0f5=Math[_0x2fdd35(0x2ee)](Number(_0x346747[_0x2fdd35(0x25d)]),0x1),_0x5aba24=Math[_0x2fdd35(0x2ee)](Number(_0x346747['Duration']),0xa);let _0x686802=0x0;for(const _0x2656a0 of _0x251522){if(_0x2fdd35(0x3b0)===_0x2fdd35(0x3b0)){const _0x114aea=$gameScreen[_0x2fdd35(0x3df)](_0x2656a0);if(!_0x114aea)continue;_0x114aea[_0x2fdd35(0x24b)](_0x496c14,_0x5461ec,_0x34e0f5,_0x5aba24),_0x686802=_0x114aea[_0x2fdd35(0x288)]();}else{this[_0x2fdd35(0x364)]();while(_0x144185--){this[_0x2fdd35(0x362)]({'targetMoveX':this['_x'],'targetMoveY':this['_y']+_0x3ebedf,'targetAngle':this[_0x2fdd35(0x229)]()-_0x5012b9,'duration':0xa,'easingType':_0x2fdd35(0x349)}),this['addToQueue']({'targetMoveX':this['_x']-_0x564dde*0.7071,'targetMoveY':this['_y']+_0x35608c*0.7071,'targetAngle':this['anglePlus']()+_0x3f7187,'duration':0xa,'easingType':_0x2fdd35(0x349)}),this[_0x2fdd35(0x362)]({'targetMoveX':this['_x']-_0x59809b,'targetMoveY':this['_y'],'targetAngle':this[_0x2fdd35(0x229)]()-_0x52372,'duration':0xa,'easingType':_0x2fdd35(0x349)}),this['addToQueue']({'targetMoveX':this['_x']-_0x13b4f1*0.7071,'targetMoveY':this['_y']-_0x69e606*0.7071,'targetAngle':this[_0x2fdd35(0x229)]()+_0x13612f,'duration':0xa,'easingType':'InOutSine'}),this[_0x2fdd35(0x362)]({'targetMoveX':this['_x'],'targetMoveY':this['_y']-_0x5c4b2f,'targetAngle':this[_0x2fdd35(0x229)]()-_0x5449e2,'duration':0xa,'easingType':'InOutSine'}),this[_0x2fdd35(0x362)]({'targetMoveX':this['_x']+_0x2b3f72*0.7071,'targetMoveY':this['_y']-_0xc9d492*0.7071,'targetAngle':this['anglePlus']()+_0x5be6a5,'duration':0xa,'easingType':_0x2fdd35(0x349)}),this['addToQueue']({'targetMoveX':this['_x']+_0x47ad8d,'targetMoveY':this['_y'],'targetAngle':this[_0x2fdd35(0x229)]()-_0x5c93a9,'duration':0xa,'easingType':_0x2fdd35(0x349)}),this[_0x2fdd35(0x362)]({'targetMoveX':this['_x']+_0x797170*0.7071,'targetMoveY':this['_y']+_0x6c8c7d*0.7071,'targetAngle':this[_0x2fdd35(0x229)]()+_0x576516,'duration':0xa,'easingType':_0x2fdd35(0x349)});}this['addToQueue']({'targetMoveX':this['_x'],'targetMoveY':this['_y'],'targetAngle':this[_0x2fdd35(0x229)](),'duration':0x14,'easingType':_0x2fdd35(0x35c)});}}if(_0x346747[_0x2fdd35(0x231)]){const _0x5dbae7=$gameTemp[_0x2fdd35(0x28d)]();if(_0x5dbae7)_0x5dbae7[_0x2fdd35(0x29e)](_0x686802);}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x24b)]=function(_0x291ba9,_0x14ac3d,_0xc71318,_0x4ad74d){const _0x49f5ff=_0x29bdbe;_0x4ad74d=_0x4ad74d||0x3c,_0x4ad74d=Math[_0x49f5ff(0x2ee)](_0x4ad74d,0xa),times=_0x4ad74d,_0x14ac3d=_0x14ac3d??0x24,_0xc71318=_0xc71318??0x18,this[_0x49f5ff(0x364)](),this['addToQueue']({'targetTone':_0x291ba9[_0x49f5ff(0x266)](),'toneDuration':_0x4ad74d/0x4*0x6,'duration':0x0});const _0x1831ed=times/0x2;while(times--){if('Legdc'===_0x49f5ff(0x273))this[_0x49f5ff(0x1e4)]={'y':0x0,'distance':0x0,'targetDistance':0x0,'rate':-0x2707,'targetRate':-0x2707,'rng':-0x2707,'targetRng':-0x2707,'duration':0x0},this[_0x49f5ff(0x2a0)]={'x':0x0,'distance':0x0,'targetDistance':0x0,'rate':-0x2707,'targetRate':-0x2707,'rng':-0x2707,'targetRng':-0x2707,'duration':0x0};else{const _0x5ba2ad=0x1-Math[_0x49f5ff(0x383)](times-_0x1831ed)/_0x1831ed;this[_0x49f5ff(0x362)]({'moveX':this['_x']+(Math[_0x49f5ff(0x267)]()>0.5?-0x1:0x1)*Math['randomInt'](Math['ceil'](_0x14ac3d*_0x5ba2ad)),'moveY':this['_y']+(Math['random']()>0.5?-0x1:0x1)*Math[_0x49f5ff(0x23e)](Math[_0x49f5ff(0x232)](_0xc71318*_0x5ba2ad)),'duration':0x1,'easingType':_0x49f5ff(0x1ee)});}}this['addToQueue']({'targetTone':this[_0x49f5ff(0x206)]?this[_0x49f5ff(0x206)]['clone']():[0x0,0x0,0x0,0x0],'toneDuration':_0x4ad74d/0xa*0x6,'moveX':this['_x'],'moveY':this['_y'],'duration':0x0});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],'Arrange_Col',_0x531ae7=>{const _0x34bc2a=_0x29bdbe;VisuMZ[_0x34bc2a(0x2bb)](_0x531ae7,_0x531ae7);const _0x217d39=_0x531ae7['PictureIDs'];if(_0x217d39[_0x34bc2a(0x369)]<=0x0)return;const _0x4cbadd=Math[_0x34bc2a(0x2ee)](Math['round'](Number(_0x531ae7['Size']||0x1)),0x1),_0x20e4d7={'x':Number(_0x531ae7['AnchorX']||0x0),'y':Number(_0x531ae7[_0x34bc2a(0x201)]||0x0)},_0x42b4be=_0x217d39[_0x34bc2a(0x369)],_0xbfc878=Math['max'](Number(_0x531ae7['Duration']),0x1);let _0x5dc36b=0x0;for(const _0x293e97 of _0x217d39){const _0x29c21f=$gameScreen['picture'](_0x293e97);if(!_0x29c21f)continue;const _0x2031df=_0x217d39[_0x34bc2a(0x3b7)](_0x293e97);_0x29c21f[_0x34bc2a(0x35b)](_0x4cbadd,_0x20e4d7,_0x2031df,_0x42b4be,_0xbfc878),_0x5dc36b=_0x29c21f[_0x34bc2a(0x288)]();}if(_0x531ae7[_0x34bc2a(0x231)]){const _0x26d5a8=$gameTemp[_0x34bc2a(0x28d)]();if(_0x26d5a8)_0x26d5a8['wait'](_0x5dc36b);}}),Game_Picture['prototype'][_0x29bdbe(0x35b)]=function(_0x4faf51,_0x30b8bd,_0x1e71e6,_0x3a28f5,_0x3fa7fd){const _0x104812=_0x29bdbe,_0x4d084e=Math[_0x104812(0x232)](_0x3a28f5/_0x4faf51),_0x114a11=Math[_0x104812(0x2e1)](_0x1e71e6/_0x4faf51),_0x4df161=_0x1e71e6%_0x4faf51,_0x4eaaf3=Graphics[_0x104812(0x2ab)]*(_0x114a11+0x1)/(_0x4d084e+0x1);let _0x209dfd=Graphics['height']*(_0x4df161+0x1)/(_0x4faf51+0x1);if(_0x114a11+0x1===_0x4d084e){const _0x37b42c=_0x3a28f5-(_0x4d084e-0x1)*_0x4faf51;_0x37b42c!==0x0&&(_0x104812(0x31b)!=='ZCFCB'?_0x209dfd=Graphics[_0x104812(0x24f)]*(_0x4df161+0x1)/(_0x37b42c+0x1):this['addToQueue']({'targetAngle':_0x18d290*0x168+this['anglePlus'](),'targetMoveX':this['_x']+(_0x44cdd0?-_0x5c6309:_0x4dda4f),'targetOpacity':0x0,'anchor':{'x':0.5,'y':0.5},'duration':_0x37f4e1,'easingType':_0x104812(0x1ee)}));}this[_0x104812(0x362)]({'targetMoveX':_0x4eaaf3,'targetMoveY':_0x209dfd,'targetAnchor':{'x':_0x30b8bd['x'],'y':_0x30b8bd['y']},'duration':_0x3fa7fd,'easingType':'InOutSine'});},PluginManager['registerCommand'](pluginData[_0x29bdbe(0x30c)],'Arrange_Row',_0x20d5af=>{const _0x4f841b=_0x29bdbe;VisuMZ['ConvertParams'](_0x20d5af,_0x20d5af);const _0x23b897=_0x20d5af['PictureIDs'];if(_0x23b897[_0x4f841b(0x369)]<=0x0)return;const _0x4599b3=Math[_0x4f841b(0x2ee)](Math[_0x4f841b(0x1d6)](Number(_0x20d5af[_0x4f841b(0x3ac)]||0x1)),0x1),_0x72fb37={'x':Number(_0x20d5af[_0x4f841b(0x35f)]||0x0),'y':Number(_0x20d5af[_0x4f841b(0x201)]||0x0)},_0x93d916=_0x23b897[_0x4f841b(0x369)],_0x5d0e4b=Math[_0x4f841b(0x2ee)](Number(_0x20d5af['Duration']),0x1);let _0x172356=0x0;for(const _0x48076b of _0x23b897){const _0x1c44df=$gameScreen[_0x4f841b(0x3df)](_0x48076b);if(!_0x1c44df)continue;const _0x4a88b9=_0x23b897[_0x4f841b(0x3b7)](_0x48076b);_0x1c44df[_0x4f841b(0x345)](_0x4599b3,_0x72fb37,_0x4a88b9,_0x93d916,_0x5d0e4b),_0x172356=_0x1c44df['getTotalQueueDuration']();}if(_0x20d5af[_0x4f841b(0x231)]){const _0x35f93d=$gameTemp[_0x4f841b(0x28d)]();if(_0x35f93d)_0x35f93d[_0x4f841b(0x29e)](_0x172356);}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x345)]=function(_0x2765e6,_0x96b505,_0x467c57,_0x21aa8c,_0xdd07c7){const _0x49cec1=_0x29bdbe,_0x27c3ec=Math[_0x49cec1(0x232)](_0x21aa8c/_0x2765e6),_0x2f91ce=Math[_0x49cec1(0x2e1)](_0x467c57/_0x2765e6),_0x49ca06=_0x467c57%_0x2765e6,_0x73f71c=Graphics[_0x49cec1(0x24f)]*(_0x2f91ce+0x1)/(_0x27c3ec+0x1);let _0x24ec7f=Graphics[_0x49cec1(0x2ab)]*(_0x49ca06+0x1)/(_0x2765e6+0x1);if(_0x2f91ce+0x1===_0x27c3ec){const _0x3dd8ef=_0x21aa8c-(_0x27c3ec-0x1)*_0x2765e6;_0x3dd8ef!==0x0&&(_0x24ec7f=Graphics[_0x49cec1(0x2ab)]*(_0x49ca06+0x1)/(_0x3dd8ef+0x1));}this[_0x49cec1(0x362)]({'targetMoveX':_0x24ec7f,'targetMoveY':_0x73f71c,'targetAnchor':{'x':_0x96b505['x'],'y':_0x96b505['y']},'duration':_0xdd07c7,'easingType':'InOutSine'});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x23a),_0x11d833=>{const _0xbceaa1=_0x29bdbe;VisuMZ[_0xbceaa1(0x2bb)](_0x11d833,_0x11d833);const _0x8f0296=_0x11d833['PictureIDs'];if(_0x8f0296['length']<=0x0)return;const _0x252136=Math['round'](Number(_0x11d833[_0xbceaa1(0x3ec)]||0x0)),_0x156b57={'x':Number(_0x11d833['AnchorX']||0x0),'y':Number(_0x11d833[_0xbceaa1(0x201)]||0x0)},_0x48972d=_0x8f0296[_0xbceaa1(0x369)],_0x4616ff=Math[_0xbceaa1(0x2ee)](Number(_0x11d833[_0xbceaa1(0x1fa)]),0x1);let _0x1ac449=0x0;for(const _0x42180a of _0x8f0296){if('vwEPe'===_0xbceaa1(0x394)){const _0x4378b0=_0x16332a[_0xbceaa1(0x28d)]();if(_0x4378b0)_0x4378b0['wait'](_0x4b6543);}else{const _0x3656d2=$gameScreen[_0xbceaa1(0x3df)](_0x42180a);if(!_0x3656d2)continue;const _0x13235c=_0x8f0296[_0xbceaa1(0x3b7)](_0x42180a);_0x3656d2[_0xbceaa1(0x302)](_0x252136,_0x156b57,_0x13235c,_0x48972d,_0x4616ff),_0x1ac449=_0x3656d2['getTotalQueueDuration']();}}if(_0x11d833['Wait']){const _0x191bf8=$gameTemp[_0xbceaa1(0x28d)]();if(_0x191bf8)_0x191bf8[_0xbceaa1(0x29e)](_0x1ac449);}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x302)]=function(_0x3836cc,_0x488ad8,_0x9fba45,_0x1fb1c9,_0x3a381e){const _0x4b7393=_0x29bdbe,_0x57d8f0=Graphics[_0x4b7393(0x2ab)]*(_0x9fba45+0x1)/(_0x1fb1c9+0x1);this[_0x4b7393(0x362)]({'targetMoveX':_0x57d8f0,'targetMoveY':_0x3836cc,'targetAnchor':{'x':_0x488ad8['x'],'y':_0x488ad8['y']},'duration':_0x3a381e,'easingType':'InOutSine'});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x277),_0x425130=>{const _0x2142e2=_0x29bdbe;VisuMZ['ConvertParams'](_0x425130,_0x425130);const _0x1a0236=_0x425130[_0x2142e2(0x31f)];if(_0x1a0236[_0x2142e2(0x369)]<=0x0)return;const _0xa206ba=Math['round'](Number(_0x425130[_0x2142e2(0x30d)]||0x0)),_0x4e73e1={'x':Number(_0x425130[_0x2142e2(0x35f)]||0x0),'y':Number(_0x425130[_0x2142e2(0x201)]||0x0)},_0x2757e5=_0x1a0236[_0x2142e2(0x369)],_0x3ed8de=Math[_0x2142e2(0x2ee)](Number(_0x425130['Duration']),0x1);let _0xc58e56=0x0;for(const _0xcd9a55 of _0x1a0236){const _0x19306d=$gameScreen[_0x2142e2(0x3df)](_0xcd9a55);if(!_0x19306d)continue;const _0xcf87d7=_0x1a0236['indexOf'](_0xcd9a55);_0x19306d[_0x2142e2(0x3ee)](_0xa206ba,_0x4e73e1,_0xcf87d7,_0x2757e5,_0x3ed8de),_0xc58e56=_0x19306d['getTotalQueueDuration']();}if(_0x425130['Wait']){if('bKZvf'!==_0x2142e2(0x1e6))this['clearQueue'](),_0x5d1787?(this[_0x2142e2(0x362)]({'anchor':{'x':0.5,'y':0.5},'moveX':this['_x']+(_0xc79e88?0x1:-0x1)*_0x576e9c[_0x2142e2(0x2ab)],'scaleX':this['_scaleX']*1.2,'scaleY':this[_0x2142e2(0x257)]*0.1,'opacity':0x0,'duration':0x0,'easingType':_0x2142e2(0x1ee)}),this[_0x2142e2(0x362)]({'targetMoveX':this['_x'],'targetScaleX':this[_0x2142e2(0x257)]*0.8,'targetScaleY':this[_0x2142e2(0x1f9)]*1.2,'targetOpacity':0xc0,'duration':0x14}),this[_0x2142e2(0x362)]({'targetScaleX':this[_0x2142e2(0x257)]*0x1,'targetScaleY':this['_scaleY']*0x1,'targetOpacity':0xff,'duration':0xa})):(this[_0x2142e2(0x362)]({'targetMoveX':this['_x'],'targetScaleX':this[_0x2142e2(0x257)]*0.8,'targetScaleY':this[_0x2142e2(0x1f9)]*1.2,'targetOpacity':0xc0,'duration':0xa,'easingType':'Linear'}),this['addToQueue']({'targetMoveX':this['_x']+(_0xc5aea0?-0x1:0x1)*_0x101239[_0x2142e2(0x2ab)],'targetScaleX':this['_scaleX']*1.2,'targetScaleY':this[_0x2142e2(0x1f9)]*0.1,'targetOpacity':0x0,'duration':0x14}));else{const _0x351c61=$gameTemp[_0x2142e2(0x28d)]();if(_0x351c61)_0x351c61['wait'](_0xc58e56);}}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x3ee)]=function(_0x1c4286,_0x1b728c,_0x49365a,_0x1aa494,_0x1a2231){const _0x412de1=_0x29bdbe,_0x51057e=Graphics[_0x412de1(0x24f)]*(_0x49365a+0x1)/(_0x1aa494+0x1);this[_0x412de1(0x362)]({'targetMoveX':_0x1c4286,'targetMoveY':_0x51057e,'targetAnchor':{'x':_0x1b728c['x'],'y':_0x1b728c['y']},'duration':_0x1a2231,'easingType':_0x412de1(0x349)});},PluginManager['registerCommand'](pluginData['name'],_0x29bdbe(0x33a),_0x5f1e2f=>{const _0x444e75=_0x29bdbe;VisuMZ[_0x444e75(0x2bb)](_0x5f1e2f,_0x5f1e2f);const _0x2cd83a=_0x5f1e2f[_0x444e75(0x31f)];if(_0x2cd83a[_0x444e75(0x369)]<=0x0)return;const _0x3d9401=_0x5f1e2f[_0x444e75(0x3b6)]==='In',_0x49e239=_0x5f1e2f[_0x444e75(0x221)]===_0x444e75(0x258);let _0x1726f4=0x0;for(const _0x73d49f of _0x2cd83a){const _0x3ffeef=$gameScreen[_0x444e75(0x3df)](_0x73d49f);if(!_0x3ffeef)continue;_0x3ffeef[_0x444e75(0x1fc)](_0x3d9401,_0x49e239),_0x1726f4=_0x3ffeef['getTotalQueueDuration']();}if(_0x5f1e2f[_0x444e75(0x231)]){const _0x1392ba=$gameTemp[_0x444e75(0x28d)]();if(_0x1392ba)_0x1392ba['wait'](_0x1726f4);}}),Game_Picture[_0x29bdbe(0x353)]['setupEffect_BannerInOut']=function(_0x3e3f24,_0x30e1fa){const _0x152e6f=_0x29bdbe;this['clearQueue']();if(_0x3e3f24)_0x152e6f(0x1ed)==='SQRIS'?(this[_0x152e6f(0x362)]({'anchor':{'x':0.5,'y':0.5},'moveX':this['_x']+(_0x30e1fa?0x1:-0x1)*Graphics['width'],'scaleX':this[_0x152e6f(0x257)]*1.2,'scaleY':this[_0x152e6f(0x257)]*0.1,'opacity':0x0,'duration':0x0,'easingType':_0x152e6f(0x1ee)}),this[_0x152e6f(0x362)]({'targetMoveX':this['_x'],'targetScaleX':this[_0x152e6f(0x257)]*0.8,'targetScaleY':this[_0x152e6f(0x1f9)]*1.2,'targetOpacity':0xc0,'duration':0x14}),this[_0x152e6f(0x362)]({'targetScaleX':this[_0x152e6f(0x257)]*0x1,'targetScaleY':this['_scaleY']*0x1,'targetOpacity':0xff,'duration':0xa})):(_0x3553bf[_0x152e6f(0x2e5)]=_0x3d2f9b,_0x4296b4['distanceY']=_0x361ba3);else{if(_0x152e6f(0x356)!==_0x152e6f(0x3c9))this[_0x152e6f(0x362)]({'targetMoveX':this['_x'],'targetScaleX':this[_0x152e6f(0x257)]*0.8,'targetScaleY':this[_0x152e6f(0x1f9)]*1.2,'targetOpacity':0xc0,'duration':0xa,'easingType':'Linear'}),this['addToQueue']({'targetMoveX':this['_x']+(_0x30e1fa?-0x1:0x1)*Graphics['width'],'targetScaleX':this[_0x152e6f(0x257)]*1.2,'targetScaleY':this[_0x152e6f(0x1f9)]*0.1,'targetOpacity':0x0,'duration':0x14});else{const _0x13ee5e=this[_0x152e6f(0x3df)](),_0x293c52=_0x13ee5e[_0x152e6f(0x377)]();this[_0x152e6f(0x3dc)](_0x293c52);}}},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x20c),_0x3eb773=>{const _0x5ee85b=_0x29bdbe;VisuMZ['ConvertParams'](_0x3eb773,_0x3eb773);const _0x5f2e5f=_0x3eb773['PictureIDs'];if(_0x5f2e5f[_0x5ee85b(0x369)]<=0x0)return;const _0x508af1=_0x3eb773[_0x5ee85b(0x32f)]||[0x0,0x0,0x0,0x0],_0x106a0a=Math[_0x5ee85b(0x2ee)](Number(_0x3eb773['Duration']),0xa);let _0x4b0b7c=0x0;for(const _0x9801e5 of _0x5f2e5f){if(_0x5ee85b(0x260)!==_0x5ee85b(0x38d)){const _0x43cca2=$gameScreen[_0x5ee85b(0x3df)](_0x9801e5);if(!_0x43cca2)continue;_0x43cca2[_0x5ee85b(0x37b)](_0x508af1,_0x106a0a),_0x4b0b7c=_0x43cca2[_0x5ee85b(0x288)]();}else return this['getQueue']()[_0x5ee85b(0x27f)]((_0x2cae0b,_0x569939)=>_0x2cae0b+_0x569939['duration'],0x0);}if(_0x3eb773['Wait']){const _0x3d1e3d=$gameTemp[_0x5ee85b(0x28d)]();if(_0x3d1e3d)_0x3d1e3d['wait'](_0x4b0b7c);}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x37b)]=function(_0x153335,_0x1e4cc2){const _0x4b53e4=_0x29bdbe;let _0x252cce=_0x1e4cc2-0x8;this[_0x4b53e4(0x364)](),this['addToQueue']({'targetTone':_0x153335[_0x4b53e4(0x266)](),'toneDuration':_0x252cce,'duration':0x0,'easingType':_0x4b53e4(0x1ee)});while(_0x252cce--){this[_0x4b53e4(0x362)]({'moveX':this['_x']+Math[_0x4b53e4(0x23e)]((_0x252cce%0x2===0x0?-0x1:0x1)*Math[_0x4b53e4(0x390)](_0x1e4cc2-_0x252cce,0x10)),'moveY':this['_y']+Math[_0x4b53e4(0x23e)]((_0x252cce%0x2===0x0?-0x1:0x1)*Math[_0x4b53e4(0x390)](_0x1e4cc2-_0x252cce,0x8)),'duration':0x1,'easingType':_0x4b53e4(0x1ee)});}this[_0x4b53e4(0x362)]({'targetMoveX':this['_x'],'targetMoveY':this['_y'],'duration':0x8,'easingType':_0x4b53e4(0x1ee)});},PluginManager[_0x29bdbe(0x237)](pluginData['name'],_0x29bdbe(0x379),_0x5d521a=>{const _0x2366ce=_0x29bdbe;VisuMZ[_0x2366ce(0x2bb)](_0x5d521a,_0x5d521a);const _0x49382e=_0x5d521a[_0x2366ce(0x31f)];if(_0x49382e['length']<=0x0)return;const _0x11ea71=Number(_0x5d521a[_0x2366ce(0x379)]),_0x197a93=Math[_0x2366ce(0x2ee)](Number(_0x5d521a['Duration']),0x1);let _0x5d2a5b=0x0;for(const _0x28d836 of _0x49382e){const _0x119ac4=$gameScreen['picture'](_0x28d836);if(!_0x119ac4)continue;_0x119ac4[_0x2366ce(0x371)](_0x11ea71,_0x197a93,_0x5d521a[_0x2366ce(0x231)]),_0x5d2a5b=_0x119ac4[_0x2366ce(0x288)]();}if(_0x5d521a[_0x2366ce(0x231)]){const _0x402460=$gameTemp[_0x2366ce(0x28d)]();if(_0x402460)_0x402460['wait'](_0x5d2a5b);}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x371)]=function(_0x2d21aa,_0x37dfbf,_0x8b74b1){const _0x34717d=_0x29bdbe;this[_0x34717d(0x364)](),this[_0x34717d(0x362)]({'targetBlur':_0x2d21aa,'blurDuration':_0x37dfbf,'duration':_0x8b74b1?_0x37dfbf:0x0,'easingType':'Linear'});},PluginManager[_0x29bdbe(0x237)](pluginData['name'],_0x29bdbe(0x2d0),_0x138139=>{const _0x540b30=_0x29bdbe;VisuMZ[_0x540b30(0x2bb)](_0x138139,_0x138139);const _0x4207a5=_0x138139[_0x540b30(0x31f)];if(_0x4207a5[_0x540b30(0x369)]<=0x0)return;const _0x69127e=Number(_0x138139[_0x540b30(0x2df)])||0x0,_0x4f7b51=Number(_0x138139[_0x540b30(0x2d2)])||0x0,_0x2478fc=Number(_0x138139['RateX'])||0x0,_0xf90dd1=Number(_0x138139[_0x540b30(0x399)])||0x0,_0xa7cfcb=Number(_0x138139[_0x540b30(0x330)])||0x0,_0x5dbba8=Math[_0x540b30(0x2ee)](Number(_0x138139[_0x540b30(0x1fa)]),0x0);for(const _0x55980b of _0x4207a5){const _0xa56fbc=$gameScreen[_0x540b30(0x3df)](_0x55980b);if(!_0xa56fbc)continue;_0xa56fbc['changeBreathing'](_0x69127e,_0x4f7b51,_0x2478fc,_0xf90dd1,_0xa7cfcb,_0x5dbba8);}if(_0x138139[_0x540b30(0x231)]&&_0x5dbba8>0x0){const _0x4fc157=$gameTemp[_0x540b30(0x28d)]();if(_0x4fc157)_0x4fc157[_0x540b30(0x29e)](_0x5dbba8);}}),PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x365),_0x47bb94=>{const _0x4e9c0e=_0x29bdbe;VisuMZ[_0x4e9c0e(0x2bb)](_0x47bb94,_0x47bb94);const _0x39af0c=_0x47bb94[_0x4e9c0e(0x31f)];if(_0x39af0c[_0x4e9c0e(0x369)]<=0x0)return;const _0x5006a2=_0x47bb94['Filename']||'';if(_0x5006a2==='')return;const _0x2d2ce9=Number(_0x47bb94[_0x4e9c0e(0x398)]),_0x38d6eb=Number(_0x47bb94[_0x4e9c0e(0x29c)]||0x0),_0x63a2f0=_0x47bb94['Tone'],_0x10f4ac=Math[_0x4e9c0e(0x2ee)](Number(_0x47bb94[_0x4e9c0e(0x28c)]),0x0),_0x64d8d5=Math[_0x4e9c0e(0x2ee)](Number(_0x47bb94[_0x4e9c0e(0x1fa)]),0xa);let _0x41fc79=0x0;for(const _0x403513 of _0x39af0c){const _0x2be3af=$gameScreen[_0x4e9c0e(0x3df)](_0x403513);if(!_0x2be3af)continue;_0x2be3af[_0x4e9c0e(0x323)](_0x5006a2,_0x2d2ce9,_0x38d6eb,_0x63a2f0,_0x10f4ac,_0x64d8d5),_0x41fc79=_0x2be3af[_0x4e9c0e(0x288)]();}if(_0x47bb94[_0x4e9c0e(0x231)]){if('hnipK'===_0x4e9c0e(0x1f7)){const _0x32a765=_0xcbb80c[_0x4e9c0e(0x2e1)](_0x4991ff/0x5);this[_0x4e9c0e(0x364)](),this[_0x4e9c0e(0x362)]({'targetScaleX':this['_scaleX']*_0x4784d9,'targetScaleY':this['_scaleY']*_0x254971,'duration':_0x32a765*0x3,'targetTone':_0x1d084e[_0x4e9c0e(0x266)](),'toneDuration':_0x32a765*0x1,'easingType':_0x4e9c0e(0x349)}),this[_0x4e9c0e(0x362)]({'targetScaleX':this[_0x4e9c0e(0x257)],'targetScaleY':this['_scaleY'],'duration':_0x1015bb-_0x32a765*0x3,'targetTone':this['_tone']?this['_tone'][_0x4e9c0e(0x266)]():[0x0,0x0,0x0,0x0],'toneDuration':_0x32a765,'easingType':_0x4e9c0e(0x349)});}else{const _0x488c39=$gameTemp[_0x4e9c0e(0x28d)]();if(_0x488c39)_0x488c39[_0x4e9c0e(0x29e)](_0x41fc79);}}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x323)]=function(_0x5e3afe,_0x26caba,_0x725c2b,_0x400814,_0x5dfe96,_0x55b4f5){const _0x4425a6=_0x29bdbe;ImageManager[_0x4425a6(0x1f8)](_0x5e3afe),_0x55b4f5=Math[_0x4425a6(0x2ee)](_0x55b4f5||0x14,0x14);let _0x2834e9=Math[_0x4425a6(0x2e1)](_0x55b4f5/0x4);this[_0x4425a6(0x364)](),this[_0x4425a6(0x362)]({'targetTone':_0x400814[_0x4425a6(0x266)](),'toneDuration':_0x55b4f5,'duration':0x0});const _0x496e5e=_0x2834e9;while(_0x2834e9--){const _0x1605ab=0x1-(0x1-_0x26caba)*((_0x496e5e-_0x2834e9)/_0x496e5e);this[_0x4425a6(0x362)]({'targetMoveX':this['_x']+(Math[_0x4425a6(0x267)]()>0.5?-0x1:0x1)*_0x725c2b,'targetMoveY':this['_y']+(Math[_0x4425a6(0x267)]()>0.5?-0x1:0x1)*_0x725c2b,'targetScaleX':this['_scaleX']*_0x1605ab,'targetScaleY':this[_0x4425a6(0x1f9)]*_0x1605ab,'targetAngle':this[_0x4425a6(0x229)]()+(_0x2834e9%0x2===0x0?-0x1:0x1)*_0x5dfe96,'duration':0x4});}this[_0x4425a6(0x362)]({'filename':_0x5e3afe,'moveX':this['_x'],'moveY':this['_y'],'scaleX':this[_0x4425a6(0x257)],'scaleY':this[_0x4425a6(0x1f9)],'currentAngle':this['anglePlus'](),'duration':0x0,'targetTone':[0x0,0x0,0x0,0x0],'toneDuration':_0x55b4f5/0x3,'easingType':_0x4425a6(0x1ee)});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x33b),_0x5cbd60=>{const _0x215251=_0x29bdbe;VisuMZ[_0x215251(0x2bb)](_0x5cbd60,_0x5cbd60);const _0x38974b=_0x5cbd60['PictureIDs'];if(_0x38974b[_0x215251(0x369)]<=0x0)return;const _0x1ddc06=_0x5cbd60[_0x215251(0x3e3)]||'',_0x315364=_0x5cbd60[_0x215251(0x36b)],_0x562dd5=Math[_0x215251(0x2ee)](_0x5cbd60[_0x215251(0x1fa)]||0xa,0xa);let _0x47b0ae=0x0;for(const _0x41a4c3 of _0x38974b){if(_0x215251(0x382)===_0x215251(0x382)){const _0x250082=$gameScreen[_0x215251(0x3df)](_0x41a4c3);if(!_0x250082)continue;_0x250082[_0x215251(0x24d)](_0x1ddc06,_0x315364,_0x562dd5),_0x47b0ae=_0x250082[_0x215251(0x288)]();}else{const _0x1a3286=_0x85daab[_0x215251(0x2ab)]*(_0x2a358c+0x1)/(_0xdd1a5a+0x1);this[_0x215251(0x362)]({'targetMoveX':_0x1a3286,'targetMoveY':_0x61fb4f,'targetAnchor':{'x':_0x9e2023['x'],'y':_0x364f5a['y']},'duration':_0x48cf5d,'easingType':_0x215251(0x349)});}}if(_0x5cbd60['Wait']){const _0x34ff6b=$gameTemp[_0x215251(0x28d)]();if(_0x34ff6b)_0x34ff6b['wait'](_0x47b0ae);}}),Game_Picture[_0x29bdbe(0x353)]['setupEffect_Card_Flip']=function(_0x6f0d92,_0x44c923,_0x1fd3a0){const _0x1e4300=_0x29bdbe;_0x6f0d92=_0x6f0d92||'',_0x1fd3a0=Math['max'](_0x1fd3a0||0xa,0xa);if(_0x6f0d92!=='')ImageManager[_0x1e4300(0x1f8)](_0x6f0d92);this['clearQueue'](),this[_0x1e4300(0x362)]({'targetScaleX':0x0,'duration':Math[_0x1e4300(0x2e1)](_0x1fd3a0/0x2),'easingType':_0x1e4300(0x1ee)}),_0x6f0d92!==''?'uRDut'===_0x1e4300(0x2a8)?this[_0x1e4300(0x362)]({'filename':_0x6f0d92,'targetScaleX':Math[_0x1e4300(0x383)](this[_0x1e4300(0x257)])*(_0x44c923?-0x1:0x1),'duration':Math[_0x1e4300(0x232)](_0x1fd3a0/0x2),'easingType':_0x1e4300(0x1ee)}):this[_0x1e4300(0x351)]():this[_0x1e4300(0x362)]({'targetScaleX':this[_0x1e4300(0x257)]*-0x1,'duration':Math[_0x1e4300(0x232)](_0x1fd3a0/0x2),'easingType':_0x1e4300(0x1ee)});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x3c8),_0x389345=>{const _0x327be3=_0x29bdbe;VisuMZ[_0x327be3(0x2bb)](_0x389345,_0x389345);const _0x247048=_0x389345[_0x327be3(0x31f)];if(_0x247048[_0x327be3(0x369)]<=0x0)return;const _0x302d6c=Math[_0x327be3(0x2ee)](Number(_0x389345[_0x327be3(0x398)]),0x0),_0x48daa2=_0x389345[_0x327be3(0x32f)]||[0x0,0x0,0x0,0x0],_0x2a0919=Math[_0x327be3(0x2ee)](Number(_0x389345[_0x327be3(0x1fa)]),0x1);let _0x209010=0x0;for(const _0x3e3277 of _0x247048){const _0x3aa93a=$gameScreen[_0x327be3(0x3df)](_0x3e3277);if(!_0x3aa93a)continue;_0x3aa93a[_0x327be3(0x1dd)](_0x302d6c,_0x48daa2,_0x2a0919),_0x209010=_0x3aa93a[_0x327be3(0x288)]();}if(_0x389345[_0x327be3(0x231)]){const _0x267241=$gameTemp[_0x327be3(0x28d)]();if(_0x267241)_0x267241[_0x327be3(0x29e)](_0x209010);}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x1dd)]=function(_0x5e20a2,_0x1b137c,_0x4b1532){const _0x22ea28=_0x29bdbe,_0x383a5a=Math[_0x22ea28(0x2e1)](_0x4b1532/0x5);this[_0x22ea28(0x364)](),this[_0x22ea28(0x362)]({'targetScaleX':this[_0x22ea28(0x257)]*_0x5e20a2,'targetScaleY':this[_0x22ea28(0x1f9)]*_0x5e20a2,'duration':_0x383a5a*0x3,'targetTone':_0x1b137c[_0x22ea28(0x266)](),'toneDuration':_0x383a5a*0x1,'easingType':_0x22ea28(0x349)}),this[_0x22ea28(0x362)]({'targetScaleX':this[_0x22ea28(0x257)],'targetScaleY':this[_0x22ea28(0x1f9)],'duration':_0x4b1532-_0x383a5a*0x3,'targetTone':this[_0x22ea28(0x206)]?this['_tone'][_0x22ea28(0x266)]():[0x0,0x0,0x0,0x0],'toneDuration':_0x383a5a,'easingType':_0x22ea28(0x349)});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x354),_0x1f95c3=>{const _0x449e57=_0x29bdbe;VisuMZ[_0x449e57(0x2bb)](_0x1f95c3,_0x1f95c3);const _0x43b6c6=_0x1f95c3[_0x449e57(0x31f)];if(_0x43b6c6[_0x449e57(0x369)]<=0x0)return;const _0x2aca5d=Math['max'](_0x1f95c3[_0x449e57(0x3db)],0x1),_0x2454e1=_0x1f95c3[_0x449e57(0x32f)],_0x488dd1=Math[_0x449e57(0x2ee)](_0x1f95c3[_0x449e57(0x29c)],0x0),_0x2fe9af=Math[_0x449e57(0x2ee)](_0x1f95c3['Wobble'],0x0);let _0x1dff5e=0x0;for(const _0x4ae203 of _0x43b6c6){const _0x384d62=$gameScreen['picture'](_0x4ae203);if(!_0x384d62)continue;_0x384d62[_0x449e57(0x3ef)](_0x2aca5d,_0x2454e1,_0x488dd1,_0x2fe9af),_0x1dff5e=_0x384d62['getTotalQueueDuration']();}if(_0x1f95c3[_0x449e57(0x231)]){const _0x434552=$gameTemp['getLastPluginCommandInterpreter']();if(_0x434552)_0x434552[_0x449e57(0x29e)](_0x1dff5e);}}),Game_Picture[_0x29bdbe(0x353)]['setupEffect_Chilly']=function(_0x55a010,_0x11eea9,_0x192af3,_0x4ae2e7){const _0x4a5c53=_0x29bdbe;_0x55a010=_0x55a010||0xa,_0x192af3=_0x192af3??0xa,_0x4ae2e7=_0x4ae2e7??0xa,this[_0x4a5c53(0x364)](),this['addToQueue']({'targetTone':_0x11eea9[_0x4a5c53(0x266)](),'toneDuration':_0x55a010/0x3*0x6,'duration':0x0});let _0x7cc718=_0x55a010;while(_0x55a010--){_0x4a5c53(0x2ff)!==_0x4a5c53(0x2ff)?this['initPictureEffectsXyAlter']():(this[_0x4a5c53(0x362)]({'targetMoveX':this['_x']+(Math[_0x4a5c53(0x267)]()>0.5?-0x1:0x1)*(Math[_0x4a5c53(0x23e)](_0x192af3)+0x1),'targetMoveY':this['_y']+(Math[_0x4a5c53(0x267)]()>0.5?-0x1:0x1)*(Math[_0x4a5c53(0x23e)](_0x192af3)+0x1),'targetAngle':this[_0x4a5c53(0x229)]()+Math[_0x4a5c53(0x23e)](_0x4ae2e7),'duration':0x2,'easingType':_0x4a5c53(0x1ee)}),this['addToQueue']({'targetMoveX':this['_x']+(Math[_0x4a5c53(0x267)]()>0.5?-0x1:0x1)*(Math[_0x4a5c53(0x23e)](_0x192af3)+0x1),'targetMoveY':this['_y']+(Math[_0x4a5c53(0x267)]()>0.5?-0x1:0x1)*(Math[_0x4a5c53(0x23e)](_0x192af3)+0x1),'targetAngle':this[_0x4a5c53(0x229)]()-Math['randomInt'](_0x4ae2e7),'duration':0x4,'easingType':_0x4a5c53(0x1ee)}));}this[_0x4a5c53(0x362)]({'targetTone':this['_tone']?this[_0x4a5c53(0x206)][_0x4a5c53(0x266)]():[0x0,0x0,0x0,0x0],'toneDuration':_0x7cc718/0x3*0x6,'targetMoveX':this['_x'],'targetMoveY':this['_y'],'targetAngle':this[_0x4a5c53(0x229)](),'duration':0x2,'easingType':'Linear'});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],'Confused',_0x146a45=>{const _0x2c389b=_0x29bdbe;VisuMZ[_0x2c389b(0x2bb)](_0x146a45,_0x146a45);const _0x49081b=_0x146a45[_0x2c389b(0x31f)];if(_0x49081b[_0x2c389b(0x369)]<=0x0)return;const _0xe4af33=Math[_0x2c389b(0x2ee)](Number(_0x146a45[_0x2c389b(0x3db)]),0x1),_0x4b9f79=Math[_0x2c389b(0x2ee)](Number(_0x146a45[_0x2c389b(0x200)]),0x1),_0xc118fa=Math[_0x2c389b(0x2ee)](Number(_0x146a45[_0x2c389b(0x25d)]),0x1),_0x44d7e0=Math[_0x2c389b(0x2ee)](Number(_0x146a45['Degrees']),0x1);let _0x23a19e=0x0;for(const _0x1c501c of _0x49081b){const _0x12c6e1=$gameScreen[_0x2c389b(0x3df)](_0x1c501c);if(!_0x12c6e1)continue;_0x12c6e1[_0x2c389b(0x35e)](_0xe4af33,_0x4b9f79,_0xc118fa,_0x44d7e0),_0x23a19e=_0x12c6e1[_0x2c389b(0x288)]();}if(_0x146a45[_0x2c389b(0x231)]){const _0x4e203b=$gameTemp['getLastPluginCommandInterpreter']();if(_0x4e203b)_0x4e203b[_0x2c389b(0x29e)](_0x23a19e);}}),Game_Picture['prototype'][_0x29bdbe(0x35e)]=function(_0x5e70b7,_0x4e3425,_0x121585,_0x3456a9){const _0x293720=_0x29bdbe;this[_0x293720(0x364)]();while(_0x5e70b7--){let _0x17c9ec=[0x1,0x2,0x3,0x4,0x6,0x7,0x8,0x9],_0x138cc6=-0x1;while(_0x17c9ec['length']>0x0){_0x138cc6*=-0x1;const _0x5d5125=_0x17c9ec[Math[_0x293720(0x23e)](_0x17c9ec[_0x293720(0x369)])];_0x17c9ec[_0x293720(0x1e9)](_0x5d5125);switch(_0x5d5125){case 0x1:this[_0x293720(0x362)]({'targetMoveX':this['_x'],'targetMoveY':this['_y']+_0x121585,'targetAngle':this[_0x293720(0x229)]()+_0x3456a9*_0x138cc6,'duration':0xa,'easingType':'InOutSine'});break;case 0x2:this[_0x293720(0x362)]({'targetMoveX':this['_x']-_0x4e3425*0.7071,'targetMoveY':this['_y']+_0x121585*0.7071,'targetAngle':this[_0x293720(0x229)]()+_0x3456a9*_0x138cc6,'duration':0xa,'easingType':_0x293720(0x349)});break;case 0x3:this[_0x293720(0x362)]({'targetMoveX':this['_x']-_0x4e3425,'targetMoveY':this['_y'],'targetAngle':this[_0x293720(0x229)]()+_0x3456a9*_0x138cc6,'duration':0xa,'easingType':_0x293720(0x349)});break;case 0x4:this[_0x293720(0x362)]({'targetMoveX':this['_x']-_0x4e3425*0.7071,'targetMoveY':this['_y']-_0x121585*0.7071,'targetAngle':this[_0x293720(0x229)]()+_0x3456a9*_0x138cc6,'duration':0xa,'easingType':_0x293720(0x349)});break;case 0x6:this['addToQueue']({'targetMoveX':this['_x'],'targetMoveY':this['_y']-_0x121585,'targetAngle':this[_0x293720(0x229)]()+_0x3456a9*_0x138cc6,'duration':0xa,'easingType':'InOutSine'});break;case 0x7:this[_0x293720(0x362)]({'targetMoveX':this['_x']+_0x4e3425*0.7071,'targetMoveY':this['_y']-_0x121585*0.7071,'targetAngle':this[_0x293720(0x229)]()+_0x3456a9*_0x138cc6,'duration':0xa,'easingType':_0x293720(0x349)});break;case 0x8:this[_0x293720(0x362)]({'targetMoveX':this['_x']+_0x4e3425,'targetMoveY':this['_y'],'targetAngle':this['anglePlus']()+_0x3456a9*_0x138cc6,'duration':0xa,'easingType':_0x293720(0x349)});break;case 0x9:this[_0x293720(0x362)]({'targetMoveX':this['_x']+_0x4e3425*0.7071,'targetMoveY':this['_y']+_0x121585*0.7071,'targetAngle':this[_0x293720(0x229)]()+_0x3456a9*_0x138cc6,'duration':0xa,'easingType':_0x293720(0x349)});break;}}}this[_0x293720(0x362)]({'targetMoveX':this['_x'],'targetMoveY':this['_y'],'targetAngle':this[_0x293720(0x229)](),'duration':0x14,'easingType':_0x293720(0x35c)});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],'Damage',_0x4ccaa2=>{const _0x2e8869=_0x29bdbe;VisuMZ[_0x2e8869(0x2bb)](_0x4ccaa2,_0x4ccaa2);const _0x11d777=_0x4ccaa2[_0x2e8869(0x31f)];if(_0x11d777[_0x2e8869(0x369)]<=0x0)return;const _0x5b4b6a=_0x4ccaa2[_0x2e8869(0x32f)],_0x9be10a=Math[_0x2e8869(0x2ee)](Number(_0x4ccaa2[_0x2e8869(0x200)]),0x1),_0x1b97d7=Math[_0x2e8869(0x2ee)](Number(_0x4ccaa2[_0x2e8869(0x25d)]),0x1),_0x2ddeda=Math[_0x2e8869(0x2ee)](Number(_0x4ccaa2[_0x2e8869(0x1fa)]),0xa);let _0x12a1bb=0x0;for(const _0x4cb379 of _0x11d777){if(_0x2e8869(0x255)!==_0x2e8869(0x384)){const _0xcd322d=$gameScreen['picture'](_0x4cb379);if(!_0xcd322d)continue;_0xcd322d[_0x2e8869(0x2da)](_0x5b4b6a,_0x9be10a,_0x1b97d7,_0x2ddeda),_0x12a1bb=_0xcd322d[_0x2e8869(0x288)]();}else{const _0x1b93d4=_0x1f49ea[_0x2e8869(0x28d)]();if(_0x1b93d4)_0x1b93d4[_0x2e8869(0x29e)](_0x7f0469);}}if(_0x4ccaa2[_0x2e8869(0x231)]){const _0x5ad2e3=$gameTemp['getLastPluginCommandInterpreter']();if(_0x5ad2e3)_0x5ad2e3['wait'](_0x12a1bb);}}),Game_Picture['prototype'][_0x29bdbe(0x2da)]=function(_0x21d1d9,_0x47bc73,_0x43917a,_0x53eb4d){const _0x3fc0b0=_0x29bdbe;_0x53eb4d=_0x53eb4d||0x3c,_0x53eb4d=Math[_0x3fc0b0(0x2ee)](_0x53eb4d,0xa),times=_0x53eb4d,_0x47bc73=_0x47bc73??0x30,_0x43917a=_0x43917a??0xc,this['clearQueue'](),this[_0x3fc0b0(0x362)]({'tone':[0x80,0x80,0x80,0x80],'targetTone':_0x21d1d9['clone'](),'toneDuration':_0x53eb4d/0x3,'duration':0x0});while(times--){const _0x1261e7=times/_0x53eb4d;this[_0x3fc0b0(0x362)]({'moveX':this['_x']+(times%0x2===0x0?-0x1:0x1)*Math['randomInt'](Math['ceil'](_0x47bc73*_0x1261e7)),'moveY':this['_y']+(times%0x2===0x0?-0x1:0x1)*Math[_0x3fc0b0(0x23e)](Math[_0x3fc0b0(0x232)](_0x43917a*_0x1261e7)),'duration':0x1,'easingType':_0x3fc0b0(0x1ee)});}this['addToQueue']({'targetTone':this['_tone']?this[_0x3fc0b0(0x206)][_0x3fc0b0(0x266)]():[0x0,0x0,0x0,0x0],'toneDuration':_0x53eb4d/0xa*0x6,'moveX':this['_x'],'moveY':this['_y'],'duration':0x0});},PluginManager['registerCommand'](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x343),_0x4d1b81=>{const _0x43f8c9=_0x29bdbe;VisuMZ[_0x43f8c9(0x2bb)](_0x4d1b81,_0x4d1b81);const _0x3cced9=_0x4d1b81['PictureIDs'];if(_0x3cced9[_0x43f8c9(0x369)]<=0x0)return;const _0x504b91=Math[_0x43f8c9(0x2ee)](Number(_0x4d1b81[_0x43f8c9(0x200)]),0x1),_0x43ec70=Math['max'](Number(_0x4d1b81[_0x43f8c9(0x25d)]),0x1),_0xc9df3c=Math['max'](Number(_0x4d1b81[_0x43f8c9(0x1fa)]),0x0);for(const _0x417767 of _0x3cced9){const _0x44d3ac=$gameScreen[_0x43f8c9(0x3df)](_0x417767);if(!_0x44d3ac)continue;_0x44d3ac[_0x43f8c9(0x293)](_0x504b91,_0x43ec70,_0xc9df3c);}if(_0x4d1b81[_0x43f8c9(0x231)]&&_0xc9df3c>0x0){const _0x4da292=$gameTemp[_0x43f8c9(0x28d)]();if(_0x4da292)_0x4da292[_0x43f8c9(0x29e)](_0xc9df3c);}}),PluginManager['registerCommand'](pluginData['name'],_0x29bdbe(0x36e),_0x580024=>{const _0x3b8b45=_0x29bdbe;VisuMZ[_0x3b8b45(0x2bb)](_0x580024,_0x580024);const _0x51e250=_0x580024[_0x3b8b45(0x31f)];if(_0x51e250[_0x3b8b45(0x369)]<=0x0)return;const _0x1ceaf3=Math[_0x3b8b45(0x2ee)](Number(_0x580024[_0x3b8b45(0x3db)]),0x1),_0x34aa9e=Math['max'](Number(_0x580024['DistanceX']),0x1),_0xde1ddf=Math['max'](Number(_0x580024['DistanceY']),0x1),_0xc8af4b=Math['max'](Number(_0x580024[_0x3b8b45(0x20e)]),0x1);let _0x2dd4e8=0x0;for(const _0x4545b4 of _0x51e250){if('pHnOp'===_0x3b8b45(0x240)){const _0x4b8150=$gameScreen[_0x3b8b45(0x3df)](_0x4545b4);if(!_0x4b8150)continue;_0x4b8150[_0x3b8b45(0x374)](_0x1ceaf3,_0x34aa9e,_0xde1ddf,_0xc8af4b),_0x2dd4e8=_0x4b8150[_0x3b8b45(0x288)]();}else this[_0x3b8b45(0x362)]({'duration':0x0,'easingType':'Linear'});}if(_0x580024[_0x3b8b45(0x231)]){const _0x3119af=$gameTemp[_0x3b8b45(0x28d)]();if(_0x3119af)_0x3119af[_0x3b8b45(0x29e)](_0x2dd4e8);}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x374)]=function(_0x3aa53f,_0x12aca9,_0x1dd1f4,_0x2f5b9f){const _0x432019=_0x29bdbe;this['clearQueue']();while(_0x3aa53f--){'Dwvij'==='WOzJM'?this[_0x432019(0x362)]({'tone':_0x63cc23['clone'](),'targetTone':this[_0x432019(0x206)]?this[_0x432019(0x206)][_0x432019(0x266)]():[0x0,0x0,0x0,0x0],'toneDuration':_0x1c815f,'duration':_0x341a8f,'easingType':_0x432019(0x1ee)}):(this[_0x432019(0x362)]({'targetMoveX':this['_x'],'targetMoveY':this['_y']+_0x1dd1f4,'targetAngle':this[_0x432019(0x229)]()-_0x2f5b9f,'duration':0xa,'easingType':_0x432019(0x349)}),this[_0x432019(0x362)]({'targetMoveX':this['_x']-_0x12aca9*0.7071,'targetMoveY':this['_y']+_0x1dd1f4*0.7071,'targetAngle':this[_0x432019(0x229)]()+_0x2f5b9f,'duration':0xa,'easingType':_0x432019(0x349)}),this[_0x432019(0x362)]({'targetMoveX':this['_x']-_0x12aca9,'targetMoveY':this['_y'],'targetAngle':this[_0x432019(0x229)]()-_0x2f5b9f,'duration':0xa,'easingType':_0x432019(0x349)}),this[_0x432019(0x362)]({'targetMoveX':this['_x']-_0x12aca9*0.7071,'targetMoveY':this['_y']-_0x1dd1f4*0.7071,'targetAngle':this[_0x432019(0x229)]()+_0x2f5b9f,'duration':0xa,'easingType':_0x432019(0x349)}),this['addToQueue']({'targetMoveX':this['_x'],'targetMoveY':this['_y']-_0x1dd1f4,'targetAngle':this[_0x432019(0x229)]()-_0x2f5b9f,'duration':0xa,'easingType':_0x432019(0x349)}),this['addToQueue']({'targetMoveX':this['_x']+_0x12aca9*0.7071,'targetMoveY':this['_y']-_0x1dd1f4*0.7071,'targetAngle':this[_0x432019(0x229)]()+_0x2f5b9f,'duration':0xa,'easingType':_0x432019(0x349)}),this[_0x432019(0x362)]({'targetMoveX':this['_x']+_0x12aca9,'targetMoveY':this['_y'],'targetAngle':this['anglePlus']()-_0x2f5b9f,'duration':0xa,'easingType':'InOutSine'}),this[_0x432019(0x362)]({'targetMoveX':this['_x']+_0x12aca9*0.7071,'targetMoveY':this['_y']+_0x1dd1f4*0.7071,'targetAngle':this[_0x432019(0x229)]()+_0x2f5b9f,'duration':0xa,'easingType':_0x432019(0x349)}));}this[_0x432019(0x362)]({'targetMoveX':this['_x'],'targetMoveY':this['_y'],'targetAngle':this[_0x432019(0x229)](),'duration':0x14,'easingType':_0x432019(0x35c)});},PluginManager[_0x29bdbe(0x237)](pluginData['name'],_0x29bdbe(0x2ce),_0x1d815a=>{const _0x271637=_0x29bdbe;VisuMZ[_0x271637(0x2bb)](_0x1d815a,_0x1d815a);const _0x28e75e=_0x1d815a[_0x271637(0x31f)];if(_0x28e75e[_0x271637(0x369)]<=0x0)return;const _0x162262=_0x1d815a['EffectIn']==='In',_0x13cad9=Math[_0x271637(0x2ee)](Number(_0x1d815a[_0x271637(0x303)]),0x1),_0x388088=Math[_0x271637(0x2ee)](Number(_0x1d815a[_0x271637(0x1fa)]),0x1);let _0x259d7f=0x0;for(const _0x26d7a2 of _0x28e75e){if('bGYbE'!==_0x271637(0x30b)){const _0x4aebf4=$gameScreen[_0x271637(0x3df)](_0x26d7a2);if(!_0x4aebf4)continue;_0x4aebf4[_0x271637(0x3a8)](_0x162262,_0x13cad9,_0x388088),_0x259d7f=_0x4aebf4[_0x271637(0x288)]();}else this[_0x271637(0x362)]({'scaleY':this[_0x271637(0x1f9)]*0.05,'opacity':this['_opacity']||0xff,'duration':0x0,'easingType':'Linear'}),this[_0x271637(0x362)]({'targetScaleY':this['_scaleY'],'duration':_0xe36228,'easingType':_0x271637(0x389)});}if(_0x1d815a['Wait']){if(_0x271637(0x21e)===_0x271637(0x2c6))this['_z']=this['picture']()['z']();else{const _0x4d14d3=$gameTemp['getLastPluginCommandInterpreter']();if(_0x4d14d3)_0x4d14d3[_0x271637(0x29e)](_0x259d7f);}}}),Game_Picture[_0x29bdbe(0x353)]['setupEffect_DropInOut']=function(_0x2ae6a3,_0x2808a2,_0x564d4d){const _0x27e15e=_0x29bdbe;_0x2808a2=_0x2808a2||0x60,_0x564d4d=_0x564d4d||0x3c,this[_0x27e15e(0x364)](),_0x2ae6a3?(this[_0x27e15e(0x362)]({'moveY':this['_y']-_0x2808a2,'scaleX':this[_0x27e15e(0x257)]*0.9,'scaleY':this[_0x27e15e(0x1f9)]*1.2,'opacity':0x0,'duration':0x0,'easingType':_0x27e15e(0x1ee)}),this[_0x27e15e(0x362)]({'targetMoveY':this['_y'],'targetScaleX':this['_scaleX'],'targetScaleY':this[_0x27e15e(0x1f9)],'targetOpacity':this['_opacity']||0xff,'duration':_0x564d4d,'easingType':_0x27e15e(0x35c)})):this[_0x27e15e(0x362)]({'targetMoveY':this['_y']+_0x2808a2,'targetOpacity':0x0,'duration':_0x564d4d,'easingType':_0x27e15e(0x389)});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],'Electrocuted',_0x49f508=>{const _0x2aea8c=_0x29bdbe;VisuMZ[_0x2aea8c(0x2bb)](_0x49f508,_0x49f508);const _0x529468=_0x49f508[_0x2aea8c(0x31f)];if(_0x529468[_0x2aea8c(0x369)]<=0x0)return;const _0x3039d7=_0x49f508[_0x2aea8c(0x1de)],_0x382709=_0x49f508[_0x2aea8c(0x278)],_0x1366f=Math[_0x2aea8c(0x2ee)](_0x49f508[_0x2aea8c(0x29c)],0x0),_0xcd80ae=Math[_0x2aea8c(0x2ee)](Number(_0x49f508[_0x2aea8c(0x1fa)]),0xa);let _0x5b7d9e=0x0;for(const _0x323c7c of _0x529468){const _0x24beda=$gameScreen['picture'](_0x323c7c);if(!_0x24beda)continue;_0x24beda[_0x2aea8c(0x1f5)](_0x3039d7,_0x382709,_0x1366f,_0xcd80ae),_0x5b7d9e=_0x24beda[_0x2aea8c(0x288)]();}if(_0x49f508[_0x2aea8c(0x231)]){if(_0x2aea8c(0x3a7)===_0x2aea8c(0x3a7)){const _0x4c6339=$gameTemp[_0x2aea8c(0x28d)]();if(_0x4c6339)_0x4c6339['wait'](_0x5b7d9e);}else{if(this[_0x2aea8c(0x3be)]===_0x1d1d4b)this[_0x2aea8c(0x3ea)]();this[_0x2aea8c(0x3be)]=_0x2b0164(_0x32900b);}}}),Game_Picture[_0x29bdbe(0x353)]['setupEffect_Electrocuted']=function(_0x28fea3,_0x542f00,_0x1499c2,_0x23ad77){const _0x5941e6=_0x29bdbe;_0x23ad77=_0x23ad77||0x3c,_0x23ad77=Math[_0x5941e6(0x2ee)](_0x23ad77,0xa),times=_0x23ad77,_0x1499c2=_0x1499c2??0xa,this['clearQueue']();while(times--){this[_0x5941e6(0x362)]({'moveX':this['_x']+(Math['random']()>0.5?-0x1:0x1)*(Math[_0x5941e6(0x23e)](_0x1499c2)+0x1),'moveY':this['_y']+(Math[_0x5941e6(0x267)]()>0.5?-0x1:0x1)*(Math[_0x5941e6(0x23e)](_0x1499c2)+0x1),'tone':(times%0x6>=0x3?_0x28fea3:_0x542f00)['clone'](),'duration':0x1,'easingType':_0x5941e6(0x1ee)});}this[_0x5941e6(0x362)]({'targetTone':this[_0x5941e6(0x206)]?this[_0x5941e6(0x206)][_0x5941e6(0x266)]():[0x0,0x0,0x0,0x0],'toneDuration':_0x23ad77/0xa*0x6,'targetMoveX':this['_x'],'targetMoveY':this['_y'],'duration':0x0,'easingType':_0x5941e6(0x1ee)});},PluginManager['registerCommand'](pluginData['name'],_0x29bdbe(0x263),_0x4975e0=>{const _0x3539e7=_0x29bdbe;VisuMZ['ConvertParams'](_0x4975e0,_0x4975e0);const _0x46878e=_0x4975e0[_0x3539e7(0x31f)];if(_0x46878e[_0x3539e7(0x369)]<=0x0)return;const _0x530de3=_0x4975e0['EffectIn']==='In',_0x7cd303=Math[_0x3539e7(0x2ee)](Number(_0x4975e0[_0x3539e7(0x1fa)]),0x1);let _0x1707fb=0x0;for(const _0x2e7e20 of _0x46878e){const _0x27dc74=$gameScreen[_0x3539e7(0x3df)](_0x2e7e20);if(!_0x27dc74)continue;_0x27dc74[_0x3539e7(0x2bf)](_0x530de3,_0x7cd303),_0x1707fb=_0x27dc74[_0x3539e7(0x288)]();}if(_0x4975e0[_0x3539e7(0x231)]){if('hKptk'==='hKptk'){const _0x2ad9bf=$gameTemp[_0x3539e7(0x28d)]();if(_0x2ad9bf)_0x2ad9bf[_0x3539e7(0x29e)](_0x1707fb);}else{this['_pictureEffectsSway']===_0x4cc8d7&&this['initPictureEffectsSway']();const _0x2b04db=this['_pictureEffectsSway'];if(_0x2b04db['duration']>0x0){const _0x3423ae=_0x2b04db[_0x3539e7(0x2e0)];_0x2b04db['range']=(_0x2b04db[_0x3539e7(0x38c)]*(_0x3423ae-0x1)+_0x2b04db[_0x3539e7(0x3e0)])/_0x3423ae,_0x2b04db[_0x3539e7(0x3b3)]=(_0x2b04db[_0x3539e7(0x3b3)]*(_0x3423ae-0x1)+_0x2b04db['targetRate'])/_0x3423ae,_0x2b04db['rng']=(_0x2b04db[_0x3539e7(0x2e7)]*(_0x3423ae-0x1)+_0x2b04db[_0x3539e7(0x27e)])/_0x3423ae,_0x2b04db[_0x3539e7(0x2e0)]--;}const _0x2c41d4=_0x4de158['frameCount']+_0x2b04db[_0x3539e7(0x2e7)];_0x2b04db[_0x3539e7(0x2cf)]=_0x5f8444[_0x3539e7(0x281)](_0x2c41d4*_0x2b04db['rate'])*_0x2b04db[_0x3539e7(0x38c)];}}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x2bf)]=function(_0x25b82e,_0x8051be){const _0x2defde=_0x29bdbe;_0x8051be=_0x8051be||0x14,this[_0x2defde(0x364)](),_0x25b82e?(this[_0x2defde(0x362)]({'scaleX':this[_0x2defde(0x257)]*0.05,'scaleY':this[_0x2defde(0x1f9)]*0.05,'opacity':0x0,'duration':0x0,'easingType':'Linear'}),this['addToQueue']({'targetScaleX':this[_0x2defde(0x257)],'targetScaleY':this[_0x2defde(0x1f9)],'targetOpacity':this['_opacity']||0xff,'duration':_0x8051be,'easingType':_0x2defde(0x349)})):_0x2defde(0x1df)==='GODcF'?(_0x5bd333[_0x2defde(0x205)]=_0x2436ab,_0x3fe96e[_0x2defde(0x3b3)]=_0x3f073f,_0x53d5b3[_0x2defde(0x2e7)]=_0x51ca30):this[_0x2defde(0x362)]({'targetScaleX':this[_0x2defde(0x257)]*0x4,'targetScaleY':this[_0x2defde(0x1f9)]*0x4,'targetOpacity':0x0,'duration':_0x8051be,'easingType':_0x2defde(0x349)});},PluginManager[_0x29bdbe(0x237)](pluginData['name'],'Fade_Change',_0x54851e=>{const _0xeb7f95=_0x29bdbe;VisuMZ[_0xeb7f95(0x2bb)](_0x54851e,_0x54851e);const _0x24b24b=_0x54851e[_0xeb7f95(0x31f)];if(_0x24b24b[_0xeb7f95(0x369)]<=0x0)return;const _0x5c79aa=_0x54851e[_0xeb7f95(0x33c)]||'';if(_0x5c79aa==='')return;const _0x42780b=Math[_0xeb7f95(0x2ee)](Number(_0x54851e['Duration']),0xa);let _0x1d883f=0x0;for(const _0x549cfb of _0x24b24b){if(_0xeb7f95(0x381)!==_0xeb7f95(0x381))this['addToQueue']({'duration':0x0,'targetTone':_0x4193de[_0xeb7f95(0x266)](),'toneDuration':_0x5c2b3e/0xa,'currentBlur':_0x21d734,'blendMode':0x1});else{const _0x71731c=$gameScreen['picture'](_0x549cfb);if(!_0x71731c)continue;_0x71731c[_0xeb7f95(0x312)](_0x5c79aa,_0x42780b),_0x1d883f=_0x71731c[_0xeb7f95(0x288)]();}}if(_0x54851e[_0xeb7f95(0x231)]){if('lWkHB'!==_0xeb7f95(0x2b0)){const _0x111843=$gameTemp[_0xeb7f95(0x28d)]();if(_0x111843)_0x111843[_0xeb7f95(0x29e)](_0x1d883f);}else this[_0xeb7f95(0x3c0)][_0xeb7f95(0x2e0)]=_0x1bc5e4[_0xeb7f95(0x1d6)](_0x55043e[_0xeb7f95(0x385)]),this['_anglePlus']['wholeDuration']=_0x4c3e6d[_0xeb7f95(0x1d6)](_0x18b2de[_0xeb7f95(0x385)]);}}),Game_Picture['prototype'][_0x29bdbe(0x312)]=function(_0x37bb03,_0x494fcf){const _0x1de2b3=_0x29bdbe;ImageManager[_0x1de2b3(0x1f8)](_0x37bb03),this[_0x1de2b3(0x364)](),this[_0x1de2b3(0x362)]({'targetOpacity':0x0,'duration':Math[_0x1de2b3(0x232)](_0x494fcf/0x2),'easingType':_0x1de2b3(0x349)}),this[_0x1de2b3(0x362)]({'filename':_0x37bb03,'targetOpacity':this['_opacity']||0xff,'duration':Math[_0x1de2b3(0x2e1)](_0x494fcf/0x2),'easingType':_0x1de2b3(0x349)});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],'Fade_InOut',_0x659ee9=>{const _0x70c1f=_0x29bdbe;VisuMZ[_0x70c1f(0x2bb)](_0x659ee9,_0x659ee9);const _0x5e1da3=_0x659ee9[_0x70c1f(0x31f)];if(_0x5e1da3[_0x70c1f(0x369)]<=0x0)return;const _0x174077=_0x659ee9['EffectIn']==='In',_0x3f5b4e=Math[_0x70c1f(0x2ee)](Number(_0x659ee9['Duration']),0x1);let _0x425bd7=0x0;for(const _0x276c68 of _0x5e1da3){const _0x2236ae=$gameScreen[_0x70c1f(0x3df)](_0x276c68);if(!_0x2236ae)continue;_0x2236ae[_0x70c1f(0x3ca)](_0x174077,_0x3f5b4e),_0x425bd7=_0x2236ae[_0x70c1f(0x288)]();}if(_0x659ee9[_0x70c1f(0x231)]){const _0x561d91=$gameTemp[_0x70c1f(0x28d)]();if(_0x561d91)_0x561d91['wait'](_0x425bd7);}}),Game_Picture['prototype'][_0x29bdbe(0x3ca)]=function(_0x2a7a62,_0x138380){const _0x4f2ee6=_0x29bdbe;_0x138380=_0x138380||0x3c,this[_0x4f2ee6(0x364)](),_0x2a7a62?(this[_0x4f2ee6(0x362)]({'opacity':0x0,'duration':0x0}),this[_0x4f2ee6(0x362)]({'targetOpacity':this['_opacity']||0xff,'duration':_0x138380,'easingType':_0x4f2ee6(0x30e)})):this[_0x4f2ee6(0x362)]({'targetOpacity':0x0,'duration':_0x138380,'easingType':_0x4f2ee6(0x30e)});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x396),_0x249afa=>{const _0x23b272=_0x29bdbe;VisuMZ[_0x23b272(0x2bb)](_0x249afa,_0x249afa);const _0x3097b7=_0x249afa[_0x23b272(0x31f)];if(_0x3097b7[_0x23b272(0x369)]<=0x0)return;const _0x53980f=Number(_0x249afa['Z'])||0x0,_0x50ad49=Math[_0x23b272(0x2ee)](Number(_0x249afa[_0x23b272(0x1fa)]),0x1);let _0x660066=0x0;for(const _0x3274ae of _0x3097b7){const _0x42ff77=$gameScreen[_0x23b272(0x3df)](_0x3274ae);if(!_0x42ff77)continue;_0x42ff77[_0x23b272(0x338)](_0x53980f,_0x50ad49),_0x660066=_0x42ff77[_0x23b272(0x288)]();}if(_0x249afa[_0x23b272(0x231)]){if(_0x23b272(0x22f)!==_0x23b272(0x22f)){const _0x3bf896=_0x482a7f['getLastPluginCommandInterpreter']();if(_0x3bf896)_0x3bf896[_0x23b272(0x29e)](_0x5278cb);}else{const _0x47c636=$gameTemp[_0x23b272(0x28d)]();if(_0x47c636)_0x47c636[_0x23b272(0x29e)](_0x660066);}}}),Game_Picture[_0x29bdbe(0x353)]['setupEffect_FadeLayerSwitch']=function(_0x4108e9,_0x3a91d9){const _0x56ee5b=_0x29bdbe;this['clearQueue'](),this[_0x56ee5b(0x362)]({'targetOpacity':0x0,'duration':Math[_0x56ee5b(0x232)](_0x3a91d9/0x2),'easingType':_0x56ee5b(0x1ee)}),this[_0x56ee5b(0x362)]({'setZ':_0x4108e9,'targetOpacity':this[_0x56ee5b(0x2ef)],'duration':Math[_0x56ee5b(0x2e1)](_0x3a91d9/0x2),'easingType':_0x56ee5b(0x1ee)});},PluginManager['registerCommand'](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x1e7),_0x458ff7=>{const _0x431955=_0x29bdbe;VisuMZ['ConvertParams'](_0x458ff7,_0x458ff7);const _0x12e08e=_0x458ff7['PictureIDs'];if(_0x12e08e[_0x431955(0x369)]<=0x0)return;const _0x63a4bc=_0x458ff7['Tone']||[0x0,0x0,0x0,0x0],_0x3a4dcb=Math[_0x431955(0x2ee)](Number(_0x458ff7[_0x431955(0x1fa)]),0x1);let _0x32b5a=0x0;for(const _0x2f50c2 of _0x12e08e){if('nAnyR'!==_0x431955(0x3f0)){const _0x6cc8f2=$gameScreen[_0x431955(0x3df)](_0x2f50c2);if(!_0x6cc8f2)continue;_0x6cc8f2['setupEffect_Fear'](_0x63a4bc,_0x3a4dcb),_0x32b5a=_0x6cc8f2[_0x431955(0x288)]();}else this[_0x431955(0x362)]({'scaleX':this[_0x431955(0x257)]*0x4,'opacity':0x0,'duration':0x0,'easingType':_0x431955(0x1ee)}),this[_0x431955(0x362)]({'targetScaleX':this['_scaleX'],'targetOpacity':this[_0x431955(0x2ef)]||0xff,'duration':_0x45600d,'easingType':_0x431955(0x349)});}if(_0x458ff7[_0x431955(0x231)]){if('diiyT'!==_0x431955(0x25b))this['addToQueue']({'opacity':0x0,'duration':0x0,'currentBlur':0xa}),this[_0x431955(0x362)]({'opacity':this['_opacity']||0xff,'duration':_0x4ada69,'tone':_0xd7f032[_0x431955(0x266)](),'targetBlur':0x0,'blurDuration':_0x4cd89b,'targetTone':this[_0x431955(0x206)]?this[_0x431955(0x206)]['clone']():[0x0,0x0,0x0,0x0],'toneDuration':_0x25053d,'easingType':_0x431955(0x1ee)});else{const _0xaebab1=$gameTemp['getLastPluginCommandInterpreter']();if(_0xaebab1)_0xaebab1['wait'](_0x32b5a);}}}),Game_Picture[_0x29bdbe(0x353)]['setupEffect_Fear']=function(_0x45dfbf,_0x590328){const _0x255900=_0x29bdbe;this[_0x255900(0x364)](),this[_0x255900(0x362)]({'tone':_0x45dfbf['clone'](),'duration':Math['floor'](_0x590328/0x2),'easingType':_0x255900(0x1ee)}),this[_0x255900(0x362)]({'targetTone':this[_0x255900(0x206)]?this[_0x255900(0x206)]['clone']():[0x0,0x0,0x0,0x0],'toneDuration':Math[_0x255900(0x232)](_0x590328/0x2),'duration':Math[_0x255900(0x232)](_0x590328/0x2),'easingType':_0x255900(0x1ee)});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x361),_0x3c3d57=>{const _0x1b0b98=_0x29bdbe;VisuMZ[_0x1b0b98(0x2bb)](_0x3c3d57,_0x3c3d57);const _0x4fc2c4=_0x3c3d57[_0x1b0b98(0x31f)];if(_0x4fc2c4[_0x1b0b98(0x369)]<=0x0)return;const _0x1b7316=_0x3c3d57[_0x1b0b98(0x33c)]||'';if(_0x1b7316==='')return;const _0x476e41=_0x3c3d57[_0x1b0b98(0x32f)]||[0x0,0x0,0x0,0x0],_0x50e470=Number(_0x3c3d57[_0x1b0b98(0x3db)])[_0x1b0b98(0x3cb)](0x1,0xa),_0x26c45e=Math[_0x1b0b98(0x2ee)](Number(_0x3c3d57['Duration']),0x1);let _0x354183=0x0;for(const _0x24fbaf of _0x4fc2c4){const _0x45adb1=$gameScreen[_0x1b0b98(0x3df)](_0x24fbaf);if(!_0x45adb1)continue;_0x45adb1[_0x1b0b98(0x328)](_0x1b7316,_0x476e41,_0x50e470,_0x26c45e),_0x354183=_0x45adb1[_0x1b0b98(0x288)]();}if(_0x3c3d57[_0x1b0b98(0x231)]){const _0x5d0e57=$gameTemp[_0x1b0b98(0x28d)]();if(_0x5d0e57)_0x5d0e57[_0x1b0b98(0x29e)](_0x354183);}}),Game_Picture['prototype'][_0x29bdbe(0x328)]=function(_0x1d64a7,_0x5be4e2,_0x1278e6,_0x30a3eb){const _0x55531c=_0x29bdbe;ImageManager[_0x55531c(0x1f8)](_0x1d64a7),this[_0x55531c(0x364)]();const _0x17d9cd=Math['floor'](_0x30a3eb/0x2/_0x1278e6);let _0x29e455=_0x1278e6;while(_0x29e455--){if(_0x55531c(0x27c)==='RAeEc')this[_0x55531c(0x362)]({'tone':_0x5be4e2[_0x55531c(0x266)](),'targetTone':this[_0x55531c(0x206)]?this[_0x55531c(0x206)][_0x55531c(0x266)]():[0x0,0x0,0x0,0x0],'toneDuration':_0x17d9cd,'duration':_0x17d9cd,'easingType':_0x55531c(0x1ee)});else{const _0x1512f4=_0x3757ec['getLastPluginCommandInterpreter']();if(_0x1512f4)_0x1512f4[_0x55531c(0x29e)](_0x2a8e6f);}}this[_0x55531c(0x362)]({'filename':_0x1d64a7,'tone':_0x5be4e2[_0x55531c(0x266)](),'targetTone':this[_0x55531c(0x206)]?this[_0x55531c(0x206)][_0x55531c(0x266)]():[0x0,0x0,0x0,0x0],'toneDuration':_0x30a3eb-_0x17d9cd*_0x1278e6,'duration':_0x30a3eb-_0x17d9cd*_0x1278e6,'easingType':_0x55531c(0x1ee)});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x27b),_0x5969b9=>{const _0x4962ad=_0x29bdbe;VisuMZ[_0x4962ad(0x2bb)](_0x5969b9,_0x5969b9);const _0x1afa0a=_0x5969b9[_0x4962ad(0x31f)];if(_0x1afa0a[_0x4962ad(0x369)]<=0x0)return;const _0x26d178=_0x5969b9['Direction']==='To\x20Left',_0x4a6908=Number(_0x5969b9[_0x4962ad(0x34f)]),_0x1e6f59=Number(_0x5969b9[_0x4962ad(0x398)]),_0x1f6a6c=Number(_0x5969b9[_0x4962ad(0x242)]);let _0x5d85f1=0x0;for(const _0x55c53c of _0x1afa0a){const _0x49a977=$gameScreen[_0x4962ad(0x3df)](_0x55c53c);if(!_0x49a977)continue;_0x49a977[_0x4962ad(0x375)](_0x26d178,_0x4a6908,_0x1e6f59,_0x1f6a6c),_0x5d85f1=_0x49a977[_0x4962ad(0x288)]();}if(_0x5969b9['Wait']){const _0x24e55c=$gameTemp[_0x4962ad(0x28d)]();if(_0x24e55c)_0x24e55c[_0x4962ad(0x29e)](_0x5d85f1);}}),Game_Picture['prototype']['setupEffect_FlyingCard']=function(_0x4f5cec,_0x5a5654,_0x8edf3d,_0x5a0aeb){const _0xf1e67b=_0x29bdbe;_0x5a5654=_0x5a5654??0x1e,_0x5a0aeb=_0x5a0aeb??0x5,_0x8edf3d=_0x8edf3d??0x2,this[_0xf1e67b(0x364)](),this['addToQueue']({'anchor':{'x':0.5,'y':0.5},'scaleX':this[_0xf1e67b(0x257)]*0.1,'scaleY':this['_scaleY']*0.1,'opacity':0x0,'blendMode':0x0,'duration':0x0,'easingType':_0xf1e67b(0x1ee)}),this[_0xf1e67b(0x362)]({'targetMoveX':Graphics['width']*(_0x4f5cec?0.25:0.75),'targetMoveY':Graphics[_0xf1e67b(0x24f)]*0.5,'targetScaleX':this['_scaleX']*_0x8edf3d,'targetScaleY':this['_scaleY']*_0x8edf3d,'targetOpacity':this['_opacity']*0x4,'targetAngle':_0x5a5654+0x168*_0x5a0aeb,'duration':0x3c}),this[_0xf1e67b(0x362)]({'targetOpacity':this[_0xf1e67b(0x2ef)]||0xff,'duration':0xa}),this[_0xf1e67b(0x362)]({'targetMoveX':Graphics['width']*0.5,'targetMoveY':(Graphics[_0xf1e67b(0x24f)]-0xe6)/0x2,'targetScaleX':this[_0xf1e67b(0x257)],'targetScaleY':this[_0xf1e67b(0x1f9)],'targetAngle':0x0,'duration':0x28}),this[_0xf1e67b(0x362)]({'targetMoveX':Graphics['width']*0.5,'targetMoveY':(Graphics[_0xf1e67b(0x24f)]-0x14a)/0x2,'targetScaleX':this[_0xf1e67b(0x257)]*1.2,'targetScaleY':this[_0xf1e67b(0x257)]*1.2,'duration':0xa}),this['addToQueue']({'duration':0x5}),this[_0xf1e67b(0x362)]({'targetAngle':-0xa,'duration':0x4}),this[_0xf1e67b(0x362)]({'targetAngle':0xa,'duration':0x8}),this[_0xf1e67b(0x362)]({'targetAngle':0x0,'duration':0x4}),this[_0xf1e67b(0x362)]({'targetMoveX':Graphics[_0xf1e67b(0x2ab)]*0.5,'targetMoveY':Graphics['height']/0x2,'targetScaleX':this[_0xf1e67b(0x257)]*0x2,'targetScaleY':this[_0xf1e67b(0x1f9)]*0.3,'duration':0xa}),this[_0xf1e67b(0x362)]({'duration':0x5}),this[_0xf1e67b(0x362)]({'targetMoveY':(Graphics[_0xf1e67b(0x24f)]-0xb4)/0x2,'targetScaleX':this['_scaleX']*0.8,'targetScaleY':this['_scaleY']*1.2,'duration':0x5}),this[_0xf1e67b(0x362)]({'targetScaleX':this[_0xf1e67b(0x257)],'targetScaleY':this[_0xf1e67b(0x1f9)],'duration':0xa});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x1d1),_0x340532=>{const _0x4b392f=_0x29bdbe;VisuMZ[_0x4b392f(0x2bb)](_0x340532,_0x340532);const _0x2a814b=_0x340532[_0x4b392f(0x31f)];if(_0x2a814b[_0x4b392f(0x369)]<=0x0)return;const _0x40428d=_0x340532[_0x4b392f(0x3b6)]==='In',_0x212f77=Math[_0x4b392f(0x2ee)](Number(_0x340532[_0x4b392f(0x1fa)]),0x1);let _0x1afe68=0x0;for(const _0x2cc556 of _0x2a814b){if('VqApw'!=='nmOLK'){const _0x331928=$gameScreen[_0x4b392f(0x3df)](_0x2cc556);if(!_0x331928)continue;_0x331928[_0x4b392f(0x332)](_0x40428d,_0x212f77),_0x1afe68=_0x331928[_0x4b392f(0x288)]();}else{let _0x2ec696=_0x201f8f;while(_0x2ec696--){const _0x4e1a0f=0x1-_0x2ec696/_0xca76a;this[_0x4b392f(0x362)]({'moveX':this['_x']+(_0x1a781f['random']()>0.5?-0x1:0x1)*_0x3e569d['randomInt'](_0x3e4725['round'](_0x4dded7)),'moveY':this['_y']+(_0x411e74[_0x4b392f(0x267)]()>0.5?-0x1:0x1)*_0x2592a3[_0x4b392f(0x23e)](_0x1b7872[_0x4b392f(0x1d6)](_0x427281)),'opacity':this[_0x4b392f(0x2ef)]*(0x1-_0x4e1a0f),'duration':0x1});}this[_0x4b392f(0x362)]({'moveX':this['_x'],'moveY':this['_y'],'opacity':0x0,'duration':0x0});}}if(_0x340532['Wait']){const _0x159ffa=$gameTemp['getLastPluginCommandInterpreter']();if(_0x159ffa)_0x159ffa['wait'](_0x1afe68);}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x332)]=function(_0x21f8f2,_0x137834){const _0xa6d8b9=_0x29bdbe;_0x137834=_0x137834||0x14,_0x137834=Math['max'](_0x137834,0xa),this[_0xa6d8b9(0x364)]();if(_0x21f8f2)this[_0xa6d8b9(0x362)]({'opacity':0x0,'scaleX':this[_0xa6d8b9(0x257)]*0.5,'scaleY':this[_0xa6d8b9(0x1f9)]*0.5,'currentBlur':0xa,'duration':0x0}),this[_0xa6d8b9(0x362)]({'targetOpacity':this[_0xa6d8b9(0x2ef)]||0xff,'targetScaleX':this[_0xa6d8b9(0x257)],'targetScaleY':this[_0xa6d8b9(0x1f9)],'duration':_0x137834,'targetBlur':0x0,'blurDuration':_0x137834,'easingType':_0xa6d8b9(0x349)});else{if(_0xa6d8b9(0x39f)!==_0xa6d8b9(0x220))this[_0xa6d8b9(0x362)]({'targetOpacity':0x0,'targetScaleX':this['_scaleX']*0.5,'targetScaleY':this[_0xa6d8b9(0x1f9)]*0.5,'duration':_0x137834,'targetBlur':0xa,'blurDuration':_0x137834,'easingType':_0xa6d8b9(0x349)});else{if(this[_0xa6d8b9(0x28e)]===_0x1ba7b7)this[_0xa6d8b9(0x2a1)]();return this['_hueFilterData'];}}},PluginManager[_0x29bdbe(0x237)](pluginData['name'],_0x29bdbe(0x3e5),_0x734556=>{const _0x33a4f7=_0x29bdbe;VisuMZ['ConvertParams'](_0x734556,_0x734556);const _0x4fb516=_0x734556[_0x33a4f7(0x31f)];if(_0x4fb516[_0x33a4f7(0x369)]<=0x0)return;const _0x2108ed=_0x734556['EffectIn']==='In',_0x153a98=Number(_0x734556[_0x33a4f7(0x379)]),_0x39452e=_0x734556[_0x33a4f7(0x347)]||[0xff,0xff,0xff,0x0],_0x1901fb=_0x734556[_0x33a4f7(0x37f)]||[-0x44,-0x44,0x0,0x44],_0x3f2c6b=Math[_0x33a4f7(0x2ee)](Number(_0x734556[_0x33a4f7(0x1fa)]),0x1);let _0xecd95e=0x0;for(const _0x16a85e of _0x4fb516){const _0x2226fc=$gameScreen[_0x33a4f7(0x3df)](_0x16a85e);if(!_0x2226fc)continue;_0x2226fc[_0x33a4f7(0x2fb)](_0x2108ed,_0x153a98,_0x39452e,_0x1901fb,_0x3f2c6b),_0xecd95e=_0x2226fc[_0x33a4f7(0x288)]();}if(_0x734556['Wait']){const _0x2e8cca=$gameTemp[_0x33a4f7(0x28d)]();if(_0x2e8cca)_0x2e8cca[_0x33a4f7(0x29e)](_0xecd95e);}}),Game_Picture[_0x29bdbe(0x353)]['setupEffect_GhostInOut']=function(_0x4b2a24,_0x3d2dd7,_0xa8cea4,_0x4dd843,_0xc74eee){const _0x2e7249=_0x29bdbe;_0xc74eee=_0xc74eee||0x3c,this[_0x2e7249(0x364)](),this[_0x2e7249(0x362)]({'duration':_0xc74eee,'targetTone':_0xa8cea4[_0x2e7249(0x266)](),'toneDuration':_0xc74eee}),_0x4b2a24?this[_0x2e7249(0x362)]({'duration':0x0,'targetTone':_0x4dd843[_0x2e7249(0x266)](),'toneDuration':_0xc74eee/0xa,'currentBlur':_0x3d2dd7,'blendMode':0x1}):this[_0x2e7249(0x362)]({'duration':0x0,'targetTone':[0x0,0x0,0x0,0x0],'toneDuration':_0xc74eee/0xa,'blendMode':0x0,'currentBlur':0x0});},PluginManager[_0x29bdbe(0x237)](pluginData['name'],_0x29bdbe(0x247),_0x253cdf=>{const _0x154cdb=_0x29bdbe;VisuMZ[_0x154cdb(0x2bb)](_0x253cdf,_0x253cdf);const _0x2731a4=_0x253cdf['PictureIDs'];if(_0x2731a4[_0x154cdb(0x369)]<=0x0)return;const _0x578c7f=Math[_0x154cdb(0x2ee)](Number(_0x253cdf[_0x154cdb(0x379)]),0x0),_0x3509c2=_0x253cdf['Tone']||[0x0,0x0,0x0,0x0],_0x505b1b=Math[_0x154cdb(0x2ee)](Number(_0x253cdf[_0x154cdb(0x1fa)]),0xa);let _0xa716b4=0x0;for(const _0x23339f of _0x2731a4){const _0x5dd184=$gameScreen[_0x154cdb(0x3df)](_0x23339f);if(!_0x5dd184)continue;_0x5dd184[_0x154cdb(0x3d3)](_0x578c7f,_0x3509c2,_0x505b1b),_0xa716b4=_0x5dd184[_0x154cdb(0x288)]();}if(_0x253cdf[_0x154cdb(0x231)]){if(_0x154cdb(0x3ad)!==_0x154cdb(0x3ad)){if(!this['_pictureContainer'])return;_0x3cb82f[_0x154cdb(0x373)][_0x154cdb(0x219)](this[_0x154cdb(0x311)]);}else{const _0x448768=$gameTemp[_0x154cdb(0x28d)]();if(_0x448768)_0x448768[_0x154cdb(0x29e)](_0xa716b4);}}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x3d3)]=function(_0x22b881,_0xa4aaf2,_0x3491bc){const _0x507d36=_0x29bdbe,_0x2e4a12=Math['floor'](_0x3491bc/0x3);this[_0x507d36(0x364)](),this['addToQueue']({'targetBlur':_0x22b881,'blurDuration':_0x2e4a12,'targetTone':_0xa4aaf2['clone'](),'toneDuration':_0x2e4a12,'duration':_0x2e4a12}),this[_0x507d36(0x362)]({'duration':_0x2e4a12}),this[_0x507d36(0x362)]({'targetTone':this[_0x507d36(0x206)]?this['_tone']['clone']():[0x0,0x0,0x0,0x0],'toneDuration':_0x3491bc-_0x2e4a12*0x2,'targetBlur':this[_0x507d36(0x32a)](),'blurDuration':_0x3491bc-_0x2e4a12*0x2,'duration':_0x3491bc-_0x2e4a12*0x2,'easingType':_0x507d36(0x1ee)});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x1f3),_0x349fd5=>{const _0x3f9a0e=_0x29bdbe;VisuMZ[_0x3f9a0e(0x2bb)](_0x349fd5,_0x349fd5);const _0x4fffef=_0x349fd5[_0x3f9a0e(0x31f)];if(_0x4fffef['length']<=0x0)return;const _0x22d4b7=Number(_0x349fd5[_0x3f9a0e(0x379)])||0x0,_0x1badcb=_0x349fd5[_0x3f9a0e(0x32f)]||[0x0,0x0,0x0,0x0],_0x2fbac5=Math[_0x3f9a0e(0x2ee)](Number(_0x349fd5[_0x3f9a0e(0x1fa)]),0x1);let _0x3bf2bf=0x0;for(const _0x57c87a of _0x4fffef){const _0x38f9dd=$gameScreen['picture'](_0x57c87a);if(!_0x38f9dd)continue;_0x38f9dd['setupEffect_Heal'](_0x22d4b7,_0x1badcb,_0x2fbac5),_0x3bf2bf=_0x38f9dd['getTotalQueueDuration']();}if(_0x349fd5[_0x3f9a0e(0x231)]){if(_0x3f9a0e(0x222)!==_0x3f9a0e(0x222))_0x3a0936=_0x2b5594||0x14,_0x4dc3b5=_0x49de3d[_0x3f9a0e(0x2ee)](_0x374125,0xa),this['clearQueue'](),_0x4fec88?(this[_0x3f9a0e(0x362)]({'opacity':0x0,'scaleX':this['_scaleX']*0.5,'scaleY':this[_0x3f9a0e(0x1f9)]*0.5,'currentBlur':0xa,'duration':0x0}),this['addToQueue']({'targetOpacity':this[_0x3f9a0e(0x2ef)]||0xff,'targetScaleX':this[_0x3f9a0e(0x257)],'targetScaleY':this[_0x3f9a0e(0x1f9)],'duration':_0x9200be,'targetBlur':0x0,'blurDuration':_0xcd6c3d,'easingType':'InOutSine'})):this[_0x3f9a0e(0x362)]({'targetOpacity':0x0,'targetScaleX':this[_0x3f9a0e(0x257)]*0.5,'targetScaleY':this['_scaleY']*0.5,'duration':_0x2cd797,'targetBlur':0xa,'blurDuration':_0xee8ab9,'easingType':_0x3f9a0e(0x349)});else{const _0x2eaac6=$gameTemp[_0x3f9a0e(0x28d)]();if(_0x2eaac6)_0x2eaac6[_0x3f9a0e(0x29e)](_0x3bf2bf);}}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x3cd)]=function(_0x5217f0,_0x8e6b33,_0x249746){const _0x2e0c38=_0x29bdbe;this[_0x2e0c38(0x364)](),this[_0x2e0c38(0x362)]({'targetBlur':_0x5217f0,'blurDuration':_0x249746*0x2/0x5,'targetTone':_0x8e6b33[_0x2e0c38(0x266)](),'toneDuration':_0x249746/0x4,'duration':Math[_0x2e0c38(0x2e1)](_0x249746/0x2),'easingType':_0x2e0c38(0x1ee)}),this['addToQueue']({'targetBlur':this[_0x2e0c38(0x32a)](),'blurDuration':Math[_0x2e0c38(0x232)](_0x249746/0x2),'targetTone':this[_0x2e0c38(0x206)]?this[_0x2e0c38(0x206)][_0x2e0c38(0x266)]():[0x0,0x0,0x0,0x0],'toneDuration':Math[_0x2e0c38(0x232)](_0x249746/0x2),'duration':Math[_0x2e0c38(0x232)](_0x249746/0x2),'easingType':_0x2e0c38(0x1ee)});},PluginManager['registerCommand'](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x28b),_0x91bf57=>{const _0x2fa0e1=_0x29bdbe;VisuMZ[_0x2fa0e1(0x2bb)](_0x91bf57,_0x91bf57);const _0x5a4005=_0x91bf57[_0x2fa0e1(0x31f)];if(_0x5a4005[_0x2fa0e1(0x369)]<=0x0)return;const _0x4296fa=Math[_0x2fa0e1(0x2ee)](Number(_0x91bf57[_0x2fa0e1(0x368)]),0x1),_0x30841d=Math[_0x2fa0e1(0x2ee)](Number(_0x91bf57[_0x2fa0e1(0x1fa)]),0xa);let _0x5e878f=0x0;for(const _0x14f401 of _0x5a4005){if(_0x2fa0e1(0x3a1)!=='amNFf'){const _0x1b8262=$gameScreen[_0x2fa0e1(0x3df)](_0x14f401);if(!_0x1b8262)continue;_0x1b8262[_0x2fa0e1(0x366)](_0x4296fa,_0x30841d),_0x5e878f=_0x1b8262[_0x2fa0e1(0x288)]();}else this[_0x2fa0e1(0x3e4)]();}if(_0x91bf57[_0x2fa0e1(0x231)]){const _0x42e26f=$gameTemp[_0x2fa0e1(0x28d)]();if(_0x42e26f)_0x42e26f[_0x2fa0e1(0x29e)](_0x5e878f);}}),Game_Picture[_0x29bdbe(0x353)]['setupEffect_Hoppity']=function(_0x310c02,_0xa62038){const _0x51aa2a=_0x29bdbe;_0x310c02=_0x310c02||0x28,_0xa62038=_0xa62038??0x28,_0xa62038=Math[_0x51aa2a(0x2ee)](_0xa62038,0xa),this[_0x51aa2a(0x364)](),this[_0x51aa2a(0x362)]({'targetMoveY':this['_y']-_0x310c02,'duration':(_0xa62038-0x2)/0x2,'easingType':_0x51aa2a(0x2f8)}),this[_0x51aa2a(0x362)]({'targetMoveY':this['_y']+Math[_0x51aa2a(0x390)](_0x310c02/0x2,0xa),'duration':(_0xa62038-0x2)/0x2,'easingType':_0x51aa2a(0x1f6)}),this[_0x51aa2a(0x362)]({'targetMoveY':this['_y'],'duration':0x2,'easingType':_0x51aa2a(0x1ee)});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x320),_0x80645d=>{const _0x3f5aea=_0x29bdbe;VisuMZ[_0x3f5aea(0x2bb)](_0x80645d,_0x80645d);const _0x5c3d8b=_0x80645d['PictureIDs'];if(_0x5c3d8b[_0x3f5aea(0x369)]<=0x0)return;const _0x39340a=Number(_0x80645d[_0x3f5aea(0x25d)])||0x0,_0x41525f=Number(_0x80645d[_0x3f5aea(0x3ba)])||0x0,_0xf01262=Number(_0x80645d[_0x3f5aea(0x330)])||0x0,_0x22e657=Math['max'](Number(_0x80645d[_0x3f5aea(0x1fa)]),0x0);for(const _0x2ad795 of _0x5c3d8b){const _0x3c7d7e=$gameScreen[_0x3f5aea(0x3df)](_0x2ad795);if(!_0x3c7d7e)continue;_0x3c7d7e[_0x3f5aea(0x316)](_0x39340a,_0x41525f,_0xf01262,_0x22e657);}if(_0x80645d['Wait']&&_0x22e657>0x0){const _0x4b6b04=$gameTemp[_0x3f5aea(0x28d)]();if(_0x4b6b04)_0x4b6b04['wait'](_0x22e657);}}),PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x334),_0x3a76d2=>{const _0x2cc3a8=_0x29bdbe;VisuMZ[_0x2cc3a8(0x2bb)](_0x3a76d2,_0x3a76d2);const _0x586e07=_0x3a76d2[_0x2cc3a8(0x31f)];if(_0x586e07[_0x2cc3a8(0x369)]<=0x0)return;const _0x539e3b=Number(_0x3a76d2[_0x2cc3a8(0x3a2)])||0x0,_0x4990c5=Math[_0x2cc3a8(0x2ee)](Number(_0x3a76d2[_0x2cc3a8(0x1fa)]),0x1);let _0x40835f=0x0;for(const _0x27b069 of _0x586e07){const _0x181f78=$gameScreen[_0x2cc3a8(0x3df)](_0x27b069);if(!_0x181f78)continue;_0x181f78[_0x2cc3a8(0x1da)](_0x539e3b,_0x4990c5,_0x3a76d2[_0x2cc3a8(0x231)]),_0x40835f=_0x181f78[_0x2cc3a8(0x288)]();}if(_0x3a76d2[_0x2cc3a8(0x231)]){if(_0x2cc3a8(0x2e9)!=='SRIRR')return this[_0x2cc3a8(0x239)]===_0x4a9365&&this['initPictureEffectsBreathing'](),this['_pictureEffectsBreathing'][_0x2cc3a8(0x254)];else{const _0x3601e6=$gameTemp[_0x2cc3a8(0x28d)]();if(_0x3601e6)_0x3601e6[_0x2cc3a8(0x29e)](_0x40835f);}}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x1da)]=function(_0xa08103,_0x466b65,_0x5213fc){const _0x3ed37b=_0x29bdbe;this[_0x3ed37b(0x364)](),this['addToQueue']({'targetHue':this['getPictureEffectsHue']()+_0xa08103,'hueDuration':_0x466b65,'duration':_0x5213fc?_0x466b65:0x0});},PluginManager[_0x29bdbe(0x237)](pluginData['name'],_0x29bdbe(0x314),_0x57ba8b=>{const _0x31a1ab=_0x29bdbe;VisuMZ[_0x31a1ab(0x2bb)](_0x57ba8b,_0x57ba8b);const _0x37692f=_0x57ba8b[_0x31a1ab(0x31f)];if(_0x37692f[_0x31a1ab(0x369)]<=0x0)return;const _0x4b9512=Number(_0x57ba8b['Hue'])||0x0,_0x46bee0=Math[_0x31a1ab(0x2ee)](Number(_0x57ba8b[_0x31a1ab(0x1fa)]),0x1);let _0x2bb0c9=0x0;for(const _0x2a1851 of _0x37692f){if(_0x31a1ab(0x3ab)===_0x31a1ab(0x3a0))_0x4d4588[_0x31a1ab(0x3ae)]=!![],_0x1727d7['targetBlur']=_0x370723[_0x31a1ab(0x2bc)];else{const _0xf7cc22=$gameScreen[_0x31a1ab(0x3df)](_0x2a1851);if(!_0xf7cc22)continue;_0xf7cc22[_0x31a1ab(0x3af)](_0x4b9512,_0x46bee0,_0x57ba8b['Wait']),_0x2bb0c9=_0xf7cc22[_0x31a1ab(0x288)]();}}if(_0x57ba8b[_0x31a1ab(0x231)]){if(_0x31a1ab(0x35d)!=='KKhBf'){const _0x54ec47=$gameTemp[_0x31a1ab(0x28d)]();if(_0x54ec47)_0x54ec47['wait'](_0x2bb0c9);}else this[_0x31a1ab(0x3de)]();}}),Game_Picture['prototype']['setupEffect_HueShiftTo']=function(_0xb00989,_0x4b0788,_0x145926){const _0x91011c=_0x29bdbe;this[_0x91011c(0x364)](),this[_0x91011c(0x362)]({'targetHue':_0xb00989,'hueDuration':_0x4b0788,'duration':_0x145926?_0x4b0788:0x0});},PluginManager[_0x29bdbe(0x237)](pluginData['name'],_0x29bdbe(0x2f4),_0x254a30=>{const _0x3cf184=_0x29bdbe;VisuMZ[_0x3cf184(0x2bb)](_0x254a30,_0x254a30);const _0xb8b08a=_0x254a30[_0x3cf184(0x31f)];if(_0xb8b08a[_0x3cf184(0x369)]<=0x0)return;const _0x457e2d=Math['max'](Number(_0x254a30[_0x3cf184(0x3db)]),0x1),_0xffa59e=Math[_0x3cf184(0x2ee)](Number(_0x254a30[_0x3cf184(0x1fa)]),0xa);let _0x46820e=0x0;for(const _0x178907 of _0xb8b08a){const _0x5c22fa=$gameScreen[_0x3cf184(0x3df)](_0x178907);if(!_0x5c22fa)continue;_0x5c22fa[_0x3cf184(0x25a)](_0x457e2d,_0xffa59e),_0x46820e=_0x5c22fa[_0x3cf184(0x288)]();}if(_0x254a30[_0x3cf184(0x231)]){const _0x2d7bf9=$gameTemp[_0x3cf184(0x28d)]();if(_0x2d7bf9)_0x2d7bf9[_0x3cf184(0x29e)](_0x46820e);}}),Game_Picture['prototype'][_0x29bdbe(0x25a)]=function(_0x22bd6c,_0xd038ca){const _0x23cbb8=_0x29bdbe;_0x22bd6c=_0x22bd6c||0x1,this[_0x23cbb8(0x364)]();while(_0x22bd6c--){let _0x2b5687=Math['randomInt'](Graphics[_0x23cbb8(0x2ab)]/0x2)+Graphics[_0x23cbb8(0x2ab)]/0x4,_0x25e43f=Math[_0x23cbb8(0x23e)](Graphics[_0x23cbb8(0x24f)]/0x2)+Graphics['height']/0x4,_0x24934f=(Math[_0x23cbb8(0x267)]()>0.5?-0x1:0x1)*Math['randomInt'](Math['round'](Graphics[_0x23cbb8(0x2ab)]/0xa)),_0x273e91=(Math[_0x23cbb8(0x267)]()>0.5?-0x1:0x1)*Math['randomInt'](Math['round'](Graphics[_0x23cbb8(0x24f)]/0xa));const _0x16bf88=Math['random']()*0.3+0.5;this['addToQueue']({'moveX':_0x2b5687,'moveY':_0x25e43f,'scaleX':this[_0x23cbb8(0x257)]*_0x16bf88,'scaleY':this['_scaleY']*_0x16bf88,'opacity':0x0,'currentBlur':0xa,'duration':0x0}),this['addToQueue']({'targetMoveX':_0x2b5687+_0x24934f/0x2,'targetMoveY':_0x25e43f+_0x273e91/0x2,'targetOpacity':this[_0x23cbb8(0x2ef)]||0xff,'targetBlur':0x3,'blurDuration':Math[_0x23cbb8(0x232)](_0xd038ca/0x2),'duration':Math['ceil'](_0xd038ca/0x2)}),this['addToQueue']({'targetMoveX':_0x2b5687+_0x24934f,'targetMoveY':_0x25e43f+_0x273e91,'targetOpacity':0x0,'targetBlur':0xa,'blurDuration':Math[_0x23cbb8(0x2e1)](_0xd038ca/0x2),'duration':Math[_0x23cbb8(0x2e1)](_0xd038ca/0x2)});}this['addToQueue']({'moveX':this['_x'],'moveY':this['_y'],'scaleX':this[_0x23cbb8(0x257)],'scaleY':this[_0x23cbb8(0x1f9)],'opacity':0x0,'currentBlur':0xa,'duration':0x0}),this['addToQueue']({'targetOpacity':this['_opacity']||0xff,'duration':_0xd038ca,'targetBlur':0x0,'blurDuration':_0xd038ca,'easingType':_0x23cbb8(0x1ee)});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x2f5),_0x9ef183=>{const _0x3dd4f2=_0x29bdbe;VisuMZ[_0x3dd4f2(0x2bb)](_0x9ef183,_0x9ef183);const _0x488ca0=_0x9ef183[_0x3dd4f2(0x31f)];if(_0x488ca0['length']<=0x0)return;const _0x47f43a=Math[_0x3dd4f2(0x2ee)](_0x9ef183[_0x3dd4f2(0x3db)],0x1);let _0x2e2817=0x0;for(const _0x5d960c of _0x488ca0){const _0x402c58=$gameScreen[_0x3dd4f2(0x3df)](_0x5d960c);if(!_0x402c58)continue;_0x402c58[_0x3dd4f2(0x2a6)](_0x47f43a),_0x2e2817=_0x402c58[_0x3dd4f2(0x288)]();}if(_0x9ef183[_0x3dd4f2(0x231)]){const _0x48892e=$gameTemp[_0x3dd4f2(0x28d)]();if(_0x48892e)_0x48892e[_0x3dd4f2(0x29e)](_0x2e2817);}}),Game_Picture[_0x29bdbe(0x353)]['setupEffect_Jiggle']=function(_0x565ed6){const _0x48361e=_0x29bdbe;_0x565ed6=_0x565ed6||0x1,this['clearQueue']();while(_0x565ed6--){this[_0x48361e(0x362)]({'targetScaleX':this[_0x48361e(0x257)]*0.9,'targetScaleY':this[_0x48361e(0x1f9)]*1.1,'duration':0xf,'easingType':_0x48361e(0x349)}),this[_0x48361e(0x362)]({'targetScaleX':this['_scaleX']*1.1,'targetScaleY':this[_0x48361e(0x1f9)]*0.9,'duration':0xf,'easingType':_0x48361e(0x349)});}this[_0x48361e(0x362)]({'targetScaleX':this[_0x48361e(0x257)],'targetScaleY':this[_0x48361e(0x1f9)],'duration':0xa,'easingType':'InOutSine'});},PluginManager['registerCommand'](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x2ec),_0x2d8f30=>{const _0x54ec3f=_0x29bdbe;VisuMZ['ConvertParams'](_0x2d8f30,_0x2d8f30);const _0x29e3b4=_0x2d8f30[_0x54ec3f(0x31f)];if(_0x29e3b4[_0x54ec3f(0x369)]<=0x0)return;const _0x48b7f3=Math[_0x54ec3f(0x2ee)](Number(_0x2d8f30[_0x54ec3f(0x368)]),0x0),_0x5dd96f=Math['round'](Number(_0x2d8f30[_0x54ec3f(0x200)])),_0x5663ae=Math[_0x54ec3f(0x1d6)](Number(_0x2d8f30[_0x54ec3f(0x25d)])),_0x39e8a0=Math[_0x54ec3f(0x2ee)](Number(_0x2d8f30[_0x54ec3f(0x1fa)]),0x1);let _0x451e4d=0x0;for(const _0x1d4daa of _0x29e3b4){const _0xdd2181=$gameScreen[_0x54ec3f(0x3df)](_0x1d4daa);if(!_0xdd2181)continue;_0xdd2181[_0x54ec3f(0x27a)](_0x5dd96f,_0x5663ae,_0x48b7f3,_0x39e8a0),_0x451e4d=_0xdd2181[_0x54ec3f(0x288)]();}if(_0x2d8f30[_0x54ec3f(0x231)]){const _0x288692=$gameTemp['getLastPluginCommandInterpreter']();if(_0x288692)_0x288692[_0x54ec3f(0x29e)](_0x451e4d);}}),Game_Picture['prototype'][_0x29bdbe(0x27a)]=function(_0x3e72bb,_0x4d3b9a,_0xc60606,_0x192351){const _0x4103ed=_0x29bdbe;this[_0x4103ed(0x364)]();let _0x139d1b=this['_x'],_0x54fe7b=this['_y'];const _0x3851f0=_0x139d1b+_0x3e72bb,_0x1d049c=_0x54fe7b+_0x4d3b9a,_0x8686f0=_0x192351;let _0xa870e7=_0x8686f0;this[_0x4103ed(0x1d7)]('Linear');while(_0xa870e7--){_0x139d1b=(_0x139d1b*_0xa870e7+_0x3851f0)/(_0xa870e7+0x1),_0x54fe7b=(_0x54fe7b*_0xa870e7+_0x1d049c)/(_0xa870e7+0x1);const _0x8e459d=_0x8686f0-(_0xa870e7+0x1),_0x423a1c=_0x8686f0/0x2,_0x1652bb=_0xc60606,_0x3ba633=-_0x1652bb/Math[_0x4103ed(0x212)](_0x423a1c,0x2),_0x34d365=_0x3ba633*Math[_0x4103ed(0x212)](_0x8e459d-_0x423a1c,0x2)+_0x1652bb;this['addToQueue']({'moveX':_0x139d1b,'moveY':_0x54fe7b-_0x34d365,'duration':0x1});}this[_0x4103ed(0x362)]({'moveX':_0x3851f0,'moveY':_0x1d049c,'duration':0x0});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x352),_0x5224f7=>{const _0x1e97b0=_0x29bdbe;VisuMZ['ConvertParams'](_0x5224f7,_0x5224f7);const _0x71f7f9=_0x5224f7[_0x1e97b0(0x31f)];if(_0x71f7f9[_0x1e97b0(0x369)]<=0x0)return;const _0x2e34fd=Math[_0x1e97b0(0x2ee)](Number(_0x5224f7[_0x1e97b0(0x368)]),0x0),_0x2a4747=Math[_0x1e97b0(0x1d6)](Number(_0x5224f7[_0x1e97b0(0x30d)])),_0x49f9a1=Math[_0x1e97b0(0x1d6)](Number(_0x5224f7[_0x1e97b0(0x3ec)])),_0x4e9c45=Math['max'](Number(_0x5224f7[_0x1e97b0(0x1fa)]),0x1);let _0x589cb9=0x0;for(const _0x3c6de9 of _0x71f7f9){const _0x5e859b=$gameScreen[_0x1e97b0(0x3df)](_0x3c6de9);if(!_0x5e859b)continue;_0x5e859b[_0x1e97b0(0x1e2)](_0x2a4747,_0x49f9a1,_0x2e34fd,_0x4e9c45),_0x589cb9=_0x5e859b['getTotalQueueDuration']();}if(_0x5224f7[_0x1e97b0(0x231)]){const _0x3fe5ce=$gameTemp['getLastPluginCommandInterpreter']();if(_0x3fe5ce)_0x3fe5ce[_0x1e97b0(0x29e)](_0x589cb9);}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x1e2)]=function(_0x119667,_0x42a6fe,_0x201265,_0x40e477){const _0x446da5=_0x29bdbe;this[_0x446da5(0x364)]();let _0x16c71d=this['_x'],_0x4129e7=this['_y'];const _0x1a69f3=_0x40e477;let _0x2e37dc=_0x1a69f3;this[_0x446da5(0x1d7)](_0x446da5(0x1ee));while(_0x2e37dc--){_0x16c71d=(_0x16c71d*_0x2e37dc+_0x119667)/(_0x2e37dc+0x1),_0x4129e7=(_0x4129e7*_0x2e37dc+_0x42a6fe)/(_0x2e37dc+0x1);const _0x3579f9=_0x1a69f3-(_0x2e37dc+0x1),_0x2bdfbe=_0x1a69f3/0x2,_0xe8ea27=_0x201265,_0x5d4814=-_0xe8ea27/Math['pow'](_0x2bdfbe,0x2),_0x2f8967=_0x5d4814*Math[_0x446da5(0x212)](_0x3579f9-_0x2bdfbe,0x2)+_0xe8ea27;this[_0x446da5(0x362)]({'moveX':_0x16c71d,'moveY':_0x4129e7-_0x2f8967,'duration':0x1});}this[_0x446da5(0x362)]({'moveX':_0x119667,'moveY':_0x42a6fe,'duration':0x0});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x3e2),_0x33bd0b=>{const _0x51858b=_0x29bdbe;VisuMZ['ConvertParams'](_0x33bd0b,_0x33bd0b);const _0x351d1d=_0x33bd0b[_0x51858b(0x31f)];if(_0x351d1d[_0x51858b(0x369)]<=0x0)return;const _0x584945=_0x33bd0b[_0x51858b(0x3b6)]==='In',_0x1e2dbd=Math['max'](Number(_0x33bd0b['Distance']),0x1),_0x4a3d05=Math[_0x51858b(0x2ee)](Number(_0x33bd0b[_0x51858b(0x1fa)]),0x1);let _0x20596e=0x0;for(const _0x11dafd of _0x351d1d){const _0x1b4561=$gameScreen[_0x51858b(0x3df)](_0x11dafd);if(!_0x1b4561)continue;_0x1b4561[_0x51858b(0x2cb)](_0x584945,_0x1e2dbd,_0x4a3d05),_0x20596e=_0x1b4561['getTotalQueueDuration']();}if(_0x33bd0b[_0x51858b(0x231)]){if(_0x51858b(0x310)!==_0x51858b(0x310)){const _0x501ffc=_0x1eee4c['getLastPluginCommandInterpreter']();if(_0x501ffc)_0x501ffc[_0x51858b(0x29e)](_0x489723);}else{const _0x38c456=$gameTemp[_0x51858b(0x28d)]();if(_0x38c456)_0x38c456[_0x51858b(0x29e)](_0x20596e);}}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x2cb)]=function(_0x44a6d6,_0x2149c1,_0x382cc9){const _0x4f0cac=_0x29bdbe;_0x2149c1=_0x2149c1||0x60,_0x382cc9=_0x382cc9||0x3c,this[_0x4f0cac(0x364)](),_0x44a6d6?(this[_0x4f0cac(0x362)]({'moveY':this['_y']+_0x2149c1,'scaleX':this[_0x4f0cac(0x257)]*1.2,'scaleY':this[_0x4f0cac(0x1f9)]*1.5,'opacity':0x0,'duration':0x0,'easingType':'Linear'}),this[_0x4f0cac(0x362)]({'targetMoveY':this['_y'],'targetScaleX':this[_0x4f0cac(0x257)],'targetScaleY':this[_0x4f0cac(0x1f9)],'targetOpacity':this[_0x4f0cac(0x2ef)]||0xff,'duration':_0x382cc9,'easingType':_0x4f0cac(0x35c)})):this[_0x4f0cac(0x362)]({'targetMoveY':this['_y']-_0x2149c1,'targetScaleX':this[_0x4f0cac(0x257)]*0.8,'targetScaleY':this[_0x4f0cac(0x1f9)]*0.5,'targetOpacity':0x0,'duration':_0x382cc9,'easingType':'InBack'});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],'Mana_Restore',_0x33f6cb=>{const _0xe46b2d=_0x29bdbe;VisuMZ['ConvertParams'](_0x33f6cb,_0x33f6cb);const _0x36ebfc=_0x33f6cb[_0xe46b2d(0x31f)];if(_0x36ebfc[_0xe46b2d(0x369)]<=0x0)return;const _0x1f41cb=Number(_0x33f6cb['Blur'])||0x0,_0x1c62b1=_0x33f6cb[_0xe46b2d(0x32f)]||[0x0,0x0,0x0,0x0],_0x2c636e=Math[_0xe46b2d(0x2ee)](Number(_0x33f6cb['Duration']),0x1);let _0x4844d7=0x0;for(const _0x444685 of _0x36ebfc){const _0xe289=$gameScreen[_0xe46b2d(0x3df)](_0x444685);if(!_0xe289)continue;_0xe289['setupEffect_ManaRestore'](_0x1f41cb,_0x1c62b1,_0x2c636e),_0x4844d7=_0xe289[_0xe46b2d(0x288)]();}if(_0x33f6cb[_0xe46b2d(0x231)]){if(_0xe46b2d(0x299)!==_0xe46b2d(0x299)){const _0x449866=_0x25aad8[_0xe46b2d(0x28d)]();if(_0x449866)_0x449866[_0xe46b2d(0x29e)](_0x380e29);}else{const _0x4f85ff=$gameTemp['getLastPluginCommandInterpreter']();if(_0x4f85ff)_0x4f85ff['wait'](_0x4844d7);}}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x340)]=function(_0x2ac4ec,_0x57c0be,_0x1734a9){const _0x41f9d6=_0x29bdbe;this[_0x41f9d6(0x364)](),this[_0x41f9d6(0x362)]({'targetBlur':_0x2ac4ec,'blurDuration':_0x1734a9*0x2/0x5,'targetTone':_0x57c0be[_0x41f9d6(0x266)](),'toneDuration':_0x1734a9/0x4,'duration':Math[_0x41f9d6(0x2e1)](_0x1734a9/0x2),'targetHue':this[_0x41f9d6(0x377)]()+0x168,'hueDuration':_0x1734a9,'easingType':_0x41f9d6(0x1ee)}),this['addToQueue']({'targetBlur':this['getPictureEffectsBlur'](),'blurDuration':Math[_0x41f9d6(0x232)](_0x1734a9/0x2),'targetTone':this[_0x41f9d6(0x206)]?this[_0x41f9d6(0x206)][_0x41f9d6(0x266)]():[0x0,0x0,0x0,0x0],'toneDuration':Math[_0x41f9d6(0x232)](_0x1734a9/0x2),'duration':Math[_0x41f9d6(0x232)](_0x1734a9/0x2),'easingType':_0x41f9d6(0x1ee)}),this[_0x41f9d6(0x362)]({'currentHue':this[_0x41f9d6(0x377)](),'duration':0x0});},PluginManager['registerCommand'](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x223),_0x15d692=>{const _0x21bc48=_0x29bdbe;VisuMZ[_0x21bc48(0x2bb)](_0x15d692,_0x15d692);const _0x4d9ebc=_0x15d692[_0x21bc48(0x31f)];if(_0x4d9ebc[_0x21bc48(0x369)]<=0x0)return;const _0x2de026=_0x15d692[_0x21bc48(0x33c)]||'';if(_0x2de026==='')return;const _0xfc77cc=Number(_0x15d692['Blur'])||0x0,_0x3ecb74=Math['round'](Number(_0x15d692[_0x21bc48(0x30d)])),_0x978324=Math['round'](Number(_0x15d692['TargetY'])),_0x3012ec=_0x15d692['Tone']||[0x0,0x0,0x0,0x0],_0x5db9dd=Math[_0x21bc48(0x2ee)](Number(_0x15d692[_0x21bc48(0x1fa)]),0x1);let _0x103c01=0x0;for(const _0x512a79 of _0x4d9ebc){const _0xe91134=$gameScreen[_0x21bc48(0x3df)](_0x512a79);if(!_0xe91134)continue;_0xe91134[_0x21bc48(0x3bf)](_0x2de026,_0xfc77cc,_0x3ecb74,_0x978324,_0x3012ec,_0x103c01===0x0,_0x5db9dd),_0x103c01=_0xe91134[_0x21bc48(0x288)]();}if(_0x15d692[_0x21bc48(0x231)]){if(_0x21bc48(0x39b)===_0x21bc48(0x39b)){const _0x5569ca=$gameTemp[_0x21bc48(0x28d)]();if(_0x5569ca)_0x5569ca[_0x21bc48(0x29e)](_0x103c01);}else{let _0x379907=_0x5212aa;while(_0x379907--){const _0x2fced3=_0x379907/_0x117089;this['addToQueue']({'moveX':this['_x']+(_0x379ede['random']()>0.5?-0x1:0x1)*_0x28a848[_0x21bc48(0x23e)](_0x46296e[_0x21bc48(0x1d6)](_0x1f014f)),'moveY':this['_y']+(_0x5e997d[_0x21bc48(0x267)]()>0.5?-0x1:0x1)*_0x3607e1['randomInt'](_0x29d5bf['round'](_0x4bfd4f)),'opacity':this[_0x21bc48(0x2ef)]*(0x1-_0x2fced3),'duration':0x1});}this[_0x21bc48(0x362)]({'moveX':this['_x'],'moveY':this['_y'],'opacity':this[_0x21bc48(0x2ef)]||0xff,'duration':0x0});}}}),Game_Picture['prototype'][_0x29bdbe(0x3bf)]=function(_0x2ead7a,_0x11f079,_0x27a7ea,_0x1a2c9d,_0x2f96e7,_0x2b93bf,_0x58714d){const _0x744441=_0x29bdbe;ImageManager['loadPicture'](_0x2ead7a),this[_0x744441(0x364)](),this['addToQueue']({'targetMoveX':_0x27a7ea,'targetMoveY':_0x1a2c9d,'duration':_0x58714d,'targetBlur':_0x11f079,'blurDuration':_0x58714d,'targetTone':_0x2f96e7[_0x744441(0x266)](),'toneDuration':_0x58714d,'easingType':_0x744441(0x32e)}),this[_0x744441(0x362)]({'filename':_0x2ead7a,'opacity':_0x2b93bf?this[_0x744441(0x2ef)]:0x0,'duration':0x0,'targetBlur':this[_0x744441(0x32a)](),'blurDuration':_0x58714d/0x2,'targetTone':this[_0x744441(0x206)]?this[_0x744441(0x206)]['clone']():[0x0,0x0,0x0,0x0],'toneDuration':_0x58714d/0x4,'easingType':_0x744441(0x1ee)});},PluginManager['registerCommand'](pluginData['name'],_0x29bdbe(0x3b8),_0x129201=>{const _0x1d6d35=_0x29bdbe;VisuMZ[_0x1d6d35(0x2bb)](_0x129201,_0x129201);const _0x289f56=_0x129201[_0x1d6d35(0x31f)];if(_0x289f56[_0x1d6d35(0x369)]<=0x0)return;const _0x46f88f=_0x129201[_0x1d6d35(0x3b6)]===_0x1d6d35(0x2a5),_0x5d5274=Math[_0x1d6d35(0x2ee)](Number(_0x129201[_0x1d6d35(0x1fa)]),0x1);let _0x2ad331=0x0;for(const _0x2b5c97 of _0x289f56){const _0x3e03ea=$gameScreen[_0x1d6d35(0x3df)](_0x2b5c97);if(!_0x3e03ea)continue;_0x3e03ea['setupEffect_OpenInOut'](_0x46f88f,_0x5d5274),_0x2ad331=_0x3e03ea[_0x1d6d35(0x288)]();}if(_0x129201['Wait']){if(_0x1d6d35(0x39d)!=='xndcp')this[_0x1d6d35(0x1d3)][_0x1d6d35(0x1e9)](this[_0x1d6d35(0x250)]);else{const _0x3e09fc=$gameTemp['getLastPluginCommandInterpreter']();if(_0x3e09fc)_0x3e09fc['wait'](_0x2ad331);}}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x2c7)]=function(_0x363f0f,_0x2633aa){const _0x181f29=_0x29bdbe;_0x2633aa=_0x2633aa||0x14,this[_0x181f29(0x364)](),_0x363f0f?(this[_0x181f29(0x362)]({'scaleY':this['_scaleY']*0.05,'opacity':this[_0x181f29(0x2ef)]||0xff,'duration':0x0,'easingType':_0x181f29(0x1ee)}),this[_0x181f29(0x362)]({'targetScaleY':this[_0x181f29(0x1f9)],'duration':_0x2633aa,'easingType':_0x181f29(0x389)})):(this[_0x181f29(0x362)]({'targetScaleY':this[_0x181f29(0x1f9)]*0.05,'duration':_0x2633aa-0x2,'easingType':_0x181f29(0x3cc)}),this[_0x181f29(0x362)]({'targetOpacity':0x0,'duration':0x2,'easingType':_0x181f29(0x1ee)}));},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],'Petrify',_0x52d2a2=>{const _0x410870=_0x29bdbe;VisuMZ[_0x410870(0x2bb)](_0x52d2a2,_0x52d2a2);const _0x58c2a1=_0x52d2a2[_0x410870(0x31f)];if(_0x58c2a1['length']<=0x0)return;const _0xb90064=_0x52d2a2['FlashTone']||[0x0,0x0,0x0,0x0],_0x460d30=_0x52d2a2[_0x410870(0x395)]||[0x0,0x0,0x0,0x0],_0x396875=Number(_0x52d2a2[_0x410870(0x28f)]),_0x5a581f=Number(_0x52d2a2[_0x410870(0x3b4)]),_0x38c113=Math[_0x410870(0x2ee)](Number(_0x52d2a2[_0x410870(0x1fa)]),0x14);let _0x3aa961=0x0;for(const _0x2879b7 of _0x58c2a1){const _0x50dd11=$gameScreen['picture'](_0x2879b7);if(!_0x50dd11)continue;_0x50dd11[_0x410870(0x24e)](_0xb90064,_0x460d30,_0x396875,_0x5a581f,_0x38c113),_0x3aa961=_0x50dd11['getTotalQueueDuration']();}if(_0x52d2a2[_0x410870(0x231)]){const _0xe3b5e5=$gameTemp[_0x410870(0x28d)]();if(_0xe3b5e5)_0xe3b5e5['wait'](_0x3aa961);}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x24e)]=function(_0x602b38,_0x2ca8af,_0x334b5f,_0x75c025,_0x155ba0){const _0xce134f=_0x29bdbe,_0x5cd9e8=Math[_0xce134f(0x2e1)](_0x155ba0/0x7);this[_0xce134f(0x364)](),this['addToQueue']({'targetScaleX':this[_0xce134f(0x257)]*_0x334b5f,'targetScaleY':this[_0xce134f(0x1f9)]*_0x75c025,'duration':_0x5cd9e8,'easingType':_0xce134f(0x1ee)}),this[_0xce134f(0x362)]({'targetScaleX':this['_scaleX']*_0x75c025,'targetScaleY':this['_scaleY']*_0x334b5f,'duration':_0x5cd9e8,'easingType':'Linear'}),this[_0xce134f(0x362)]({'targetTone':_0x602b38[_0xce134f(0x266)](),'toneDuration':_0x5cd9e8*0x4,'targetScaleX':this[_0xce134f(0x257)]*_0x334b5f,'targetScaleY':this['_scaleY']*_0x75c025,'duration':_0x5cd9e8,'easingType':_0xce134f(0x1ee)}),this[_0xce134f(0x362)]({'targetScaleX':this[_0xce134f(0x257)]*_0x75c025,'targetScaleY':this[_0xce134f(0x1f9)]*_0x334b5f,'duration':_0x5cd9e8,'easingType':'Linear'}),this[_0xce134f(0x362)]({'targetScaleX':this['_scaleX']*_0x334b5f,'targetScaleY':this['_scaleY']*_0x75c025,'duration':_0x5cd9e8,'easingType':_0xce134f(0x1ee)}),this[_0xce134f(0x362)]({'targetScaleX':this[_0xce134f(0x257)]*_0x75c025,'targetScaleY':this[_0xce134f(0x1f9)]*_0x334b5f,'duration':_0x5cd9e8,'easingType':_0xce134f(0x1ee)}),this[_0xce134f(0x362)]({'targetTone':_0x2ca8af,'toneDuration':_0x5cd9e8,'scaleX':this['_scaleX'],'scaleY':this[_0xce134f(0x1f9)],'duration':_0x155ba0-_0x5cd9e8*0x6,'easingType':_0xce134f(0x1ee)});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x348),_0x222ba4=>{const _0x18a20f=_0x29bdbe;VisuMZ[_0x18a20f(0x2bb)](_0x222ba4,_0x222ba4);const _0x50c979=_0x222ba4[_0x18a20f(0x31f)];if(_0x50c979['length']<=0x0)return;const _0x298415=_0x222ba4['EffectIn']==='In',_0x324207=Math[_0x18a20f(0x2ee)](Number(_0x222ba4[_0x18a20f(0x1fa)]),0x1);let _0xee5387=0x0;for(const _0x352d5a of _0x50c979){const _0x3e07d7=$gameScreen[_0x18a20f(0x3df)](_0x352d5a);if(!_0x3e07d7)continue;_0x3e07d7[_0x18a20f(0x1e8)](_0x298415,_0x324207),_0xee5387=_0x3e07d7[_0x18a20f(0x288)]();}if(_0x222ba4[_0x18a20f(0x231)]){if(_0x18a20f(0x290)!==_0x18a20f(0x300)){const _0x5d76d4=$gameTemp['getLastPluginCommandInterpreter']();if(_0x5d76d4)_0x5d76d4[_0x18a20f(0x29e)](_0xee5387);}else this[_0x18a20f(0x21d)]=_0xadeab9[_0x18a20f(0x22c)](_0x393a39['anchor']),this['_targetAnchor']=_0x2a1ee9[_0x18a20f(0x22c)](_0x8f7960[_0x18a20f(0x294)]);}}),Game_Picture[_0x29bdbe(0x353)]['setupEffect_PhaseInOut']=function(_0x3d5cfa,_0x44ed83){const _0x6fb3f3=_0x29bdbe;_0x44ed83=_0x44ed83||0x14,_0x44ed83=Math[_0x6fb3f3(0x2ee)](_0x44ed83,0xa),this[_0x6fb3f3(0x364)](),_0x3d5cfa?(this['addToQueue']({'opacity':0x0,'scaleX':this['_scaleX']*0.8,'scaleY':this['_scaleY']*0.8,'currentBlur':0xa,'duration':0x0}),this['addToQueue']({'targetOpacity':this['_opacity']||0xff,'targetScaleX':this[_0x6fb3f3(0x257)],'targetScaleY':this[_0x6fb3f3(0x1f9)],'targetBlur':0x0,'duration':_0x44ed83,'blurDuration':_0x44ed83,'easingType':_0x6fb3f3(0x35c)})):this[_0x6fb3f3(0x362)]({'targetOpacity':0x0,'targetScaleX':this[_0x6fb3f3(0x257)]*0.8,'targetScaleY':this[_0x6fb3f3(0x1f9)]*0.8,'targetBlur':0xa,'duration':_0x44ed83,'blurDuration':_0x44ed83,'easingType':_0x6fb3f3(0x1f2)});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x243),_0x2eaf95=>{const _0x4434c8=_0x29bdbe;VisuMZ[_0x4434c8(0x2bb)](_0x2eaf95,_0x2eaf95);const _0x1d1a73=_0x2eaf95['PictureIDs'];if(_0x1d1a73['length']<=0x0)return;const _0x32aaaf=_0x2eaf95['EffectIn']==='In',_0x30e544=Number(_0x2eaf95[_0x4434c8(0x398)]),_0x249053=Math[_0x4434c8(0x2ee)](Number(_0x2eaf95[_0x4434c8(0x1fa)]),0x1);let _0x3244a7=0x0;for(const _0x3de5c0 of _0x1d1a73){const _0x435724=$gameScreen['picture'](_0x3de5c0);if(!_0x435724)continue;_0x435724[_0x4434c8(0x22d)](_0x32aaaf,_0x30e544,_0x249053),_0x3244a7=_0x435724['getTotalQueueDuration']();}if(_0x2eaf95[_0x4434c8(0x231)]){const _0x4c5cd8=$gameTemp[_0x4434c8(0x28d)]();if(_0x4c5cd8)_0x4c5cd8[_0x4434c8(0x29e)](_0x3244a7);}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x22d)]=function(_0x500b23,_0x4128c7,_0x3541c8){const _0x1e3098=_0x29bdbe;_0x4128c7=_0x4128c7??0x2,_0x3541c8=_0x3541c8??0x3c;let _0x56d235=0x0,_0x28e29b=0x0,_0x31511d=(Math['random']()>0.5?-0x1:0x1)*Math[_0x1e3098(0x23e)](0x168)+0x168*0x2;const _0x34c716=[0x2,0x4,0x6,0x8][Math[_0x1e3098(0x23e)](0x4)];switch(_0x34c716){case 0x2:case 0x8:_0x56d235=Math[_0x1e3098(0x23e)](Graphics['width']);break;case 0x4:case 0x6:_0x28e29b=Math[_0x1e3098(0x23e)](Graphics['height']);break;}switch(_0x34c716){case 0x2:_0x28e29b=Graphics[_0x1e3098(0x24f)];break;case 0x8:_0x28e29b=0x0;break;case 0x4:_0x56d235=0x0;break;case 0x6:_0x56d235=Graphics[_0x1e3098(0x2ab)];break;}this[_0x1e3098(0x364)](),_0x500b23?(this['addToQueue']({'moveX':_0x56d235,'moveY':_0x28e29b,'opacity':0x0,'currentAngle':_0x31511d,'scaleX':this['_scaleX']*_0x4128c7,'scaleY':this['_scaleY']*_0x4128c7,'duration':0x0}),this['addToQueue']({'targetMoveX':this['_x'],'targetMoveY':this['_y'],'targetAngle':this[_0x1e3098(0x229)](),'targetOpacity':this[_0x1e3098(0x2ef)]||0xff,'targetScaleX':this['_scaleX'],'targetScaleY':this[_0x1e3098(0x1f9)],'duration':_0x3541c8,'easingType':'OutBack'})):this[_0x1e3098(0x362)]({'targetMoveX':_0x56d235,'targetMoveY':_0x28e29b,'targetAngle':_0x31511d,'targetOpacity':0x0,'targetScaleX':this['_scaleX']*_0x4128c7,'targetScaleY':this[_0x1e3098(0x1f9)]*_0x4128c7,'duration':_0x3541c8,'easingType':_0x1e3098(0x1f2)});},PluginManager['registerCommand'](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x209),_0x1e8812=>{const _0x460cda=_0x29bdbe;VisuMZ[_0x460cda(0x2bb)](_0x1e8812,_0x1e8812);const _0x1cea15=_0x1e8812['PictureIDs'];if(_0x1cea15['length']<=0x0)return;const _0x2fd000=Math[_0x460cda(0x2ee)](Number(_0x1e8812[_0x460cda(0x303)]),0x0),_0x3c7e88=_0x1e8812['Tone']||[0x0,0x0,0x0,0x0],_0x24393f=Math[_0x460cda(0x2ee)](Number(_0x1e8812[_0x460cda(0x1fa)]),0x1);let _0x56fd89=0x0;for(const _0x36cee2 of _0x1cea15){if(_0x460cda(0x235)!==_0x460cda(0x36c)){const _0x252993=$gameScreen[_0x460cda(0x3df)](_0x36cee2);if(!_0x252993)continue;_0x252993[_0x460cda(0x268)](_0x2fd000,_0x3c7e88,_0x24393f),_0x56fd89=_0x252993['getTotalQueueDuration']();}else{const _0x101529=_0x2c303d[_0x460cda(0x28d)]();if(_0x101529)_0x101529[_0x460cda(0x29e)](_0x452fce);}}if(_0x1e8812[_0x460cda(0x231)]){const _0x481958=$gameTemp['getLastPluginCommandInterpreter']();if(_0x481958)_0x481958[_0x460cda(0x29e)](_0x56fd89);}}),Game_Picture[_0x29bdbe(0x353)]['setupEffect_Poison']=function(_0x1c5123,_0x5a8db8,_0x4fc716){const _0x316982=_0x29bdbe,_0x2a3fcc=Math[_0x316982(0x2e1)](_0x4fc716/0x5);this['clearQueue'](),this[_0x316982(0x362)]({'targetMoveX':this['_x']-_0x1c5123,'duration':_0x2a3fcc,'targetTone':_0x5a8db8[_0x316982(0x266)](),'toneDuration':_0x2a3fcc*0x3,'easingType':_0x316982(0x349)}),this[_0x316982(0x362)]({'targetMoveX':this['_x']+_0x1c5123,'duration':_0x2a3fcc,'easingType':_0x316982(0x349)}),this['addToQueue']({'targetMoveX':this['_x']-_0x1c5123,'duration':_0x2a3fcc,'easingType':_0x316982(0x349)}),this['addToQueue']({'targetMoveX':this['_x']+_0x1c5123,'duration':_0x2a3fcc,'easingType':_0x316982(0x349)}),this['addToQueue']({'targetMoveX':this['_x'],'duration':_0x4fc716-_0x2a3fcc*0x4,'targetTone':this[_0x316982(0x206)]?this['_tone'][_0x316982(0x266)]():[0x0,0x0,0x0,0x0],'toneDuration':_0x2a3fcc,'easingType':_0x316982(0x349)});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x1ec),_0x408bc9=>{const _0x20bf52=_0x29bdbe;VisuMZ[_0x20bf52(0x2bb)](_0x408bc9,_0x408bc9);const _0x2ab1e4=_0x408bc9[_0x20bf52(0x31f)];if(_0x2ab1e4[_0x20bf52(0x369)]<=0x0)return;const _0xc805cf=_0x408bc9[_0x20bf52(0x33c)]||'';if(_0xc805cf==='')return;const _0x11f7bd=Math[_0x20bf52(0x2ee)](Number(_0x408bc9[_0x20bf52(0x3db)]),0x1),_0x26046c=Math[_0x20bf52(0x2ee)](Number(_0x408bc9[_0x20bf52(0x1fa)]),0x1);let _0x2d870b=0x0;for(const _0x1b9b85 of _0x2ab1e4){const _0x109a52=$gameScreen[_0x20bf52(0x3df)](_0x1b9b85);if(!_0x109a52)continue;_0x109a52[_0x20bf52(0x357)](_0xc805cf,_0x11f7bd,_0x26046c),_0x2d870b=_0x109a52[_0x20bf52(0x288)]();}if(_0x408bc9[_0x20bf52(0x231)]){if('MUSFz'!=='MUSFz'){const _0x4ef35e=_0x199aa0['getLastPluginCommandInterpreter']();if(_0x4ef35e)_0x4ef35e[_0x20bf52(0x29e)](_0x2a5baa);}else{const _0x6be5fb=$gameTemp[_0x20bf52(0x28d)]();if(_0x6be5fb)_0x6be5fb['wait'](_0x2d870b);}}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x357)]=function(_0x441061,_0x117b5e,_0x5bd84d){const _0x1bc834=_0x29bdbe;ImageManager[_0x1bc834(0x1f8)](_0x441061);let _0x4d079e=_0x117b5e;this['clearQueue']();while(_0x4d079e--){this[_0x1bc834(0x362)]({'filename':_0x441061,'duration':_0x5bd84d}),this[_0x1bc834(0x362)]({'filename':this[_0x1bc834(0x279)],'duration':_0x5bd84d});}this[_0x1bc834(0x362)]({'filename':_0x441061,'duration':0x0});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x3c4),_0x2d3a4c=>{const _0x3fbafe=_0x29bdbe;VisuMZ['ConvertParams'](_0x2d3a4c,_0x2d3a4c);const _0x15acd6=_0x2d3a4c[_0x3fbafe(0x31f)];if(_0x15acd6[_0x3fbafe(0x369)]<=0x0)return;const _0x5859d0=Math[_0x3fbafe(0x2ee)](Number(_0x2d3a4c[_0x3fbafe(0x1fa)]),0x1);let _0x22f7a1=0x0;for(const _0x311e9d of _0x15acd6){if(_0x3fbafe(0x2b5)===_0x3fbafe(0x2b5)){const _0x155d8c=$gameScreen['picture'](_0x311e9d);if(!_0x155d8c)continue;_0x155d8c[_0x3fbafe(0x211)](_0x5859d0),_0x22f7a1=_0x155d8c['getTotalQueueDuration']();}else _0x3aa126=_0x228556||0x1f4,_0x111b1d=_0x14a0be||0x1,_0x5c6bc4=_0x5c31e3||0x3c,this['clearQueue'](),_0x154da6?(this[_0x3fbafe(0x362)]({'anchor':{'x':0.5,'y':0.5},'currentAngle':-_0x59a0c9*0x168+this[_0x3fbafe(0x229)](),'moveX':this['_x']+(_0x456313?_0x405bea:-_0x5829ec),'opacity':0x0,'duration':0x0}),this[_0x3fbafe(0x362)]({'targetAngle':this['anglePlus'](),'targetOpacity':this['_opacity']||0xff,'targetMoveX':this['_x'],'duration':_0x5a0587,'easingType':_0x3fbafe(0x1ee)})):this[_0x3fbafe(0x362)]({'targetAngle':_0x13fa07*0x168+this[_0x3fbafe(0x229)](),'targetMoveX':this['_x']+(_0x497e7f?-_0x5ea095:_0x5dd495),'targetOpacity':0x0,'anchor':{'x':0.5,'y':0.5},'duration':_0x4fee14,'easingType':_0x3fbafe(0x1ee)});}if(_0x2d3a4c[_0x3fbafe(0x231)]){const _0x34e04b=$gameTemp['getLastPluginCommandInterpreter']();if(_0x34e04b)_0x34e04b[_0x3fbafe(0x29e)](_0x22f7a1);}}),Game_Picture[_0x29bdbe(0x353)]['setupEffect_PsycheScale']=function(_0x5df4d7){const _0x47f841=_0x29bdbe;this[_0x47f841(0x364)](),this[_0x47f841(0x362)]({'duration':_0x5df4d7,'targetHue':this[_0x47f841(0x377)]()+0x168,'hueDuration':_0x5df4d7,'easingType':_0x47f841(0x1ee)}),this['addToQueue']({'duration':0x0,'currentHue':this[_0x47f841(0x377)](),'easingType':_0x47f841(0x1ee)});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x3ed),_0x26132d=>{const _0x2956f8=_0x29bdbe;VisuMZ['ConvertParams'](_0x26132d,_0x26132d);const _0x277b41=_0x26132d['PictureIDs'];if(_0x277b41[_0x2956f8(0x369)]<=0x0)return;const _0x4d05a4=Number(_0x26132d[_0x2956f8(0x398)])*0x64,_0x240997=Math['max'](Number(_0x26132d[_0x2956f8(0x1fa)]),0x1);let _0x5bc894=0x0;for(const _0x172869 of _0x277b41){const _0x322d2f=$gameScreen[_0x2956f8(0x3df)](_0x172869);if(!_0x322d2f)continue;_0x322d2f[_0x2956f8(0x32b)](_0x4d05a4,_0x240997),_0x5bc894=_0x322d2f['getTotalQueueDuration']();}if(_0x26132d[_0x2956f8(0x231)]){if('MPwQg'===_0x2956f8(0x2ed)){const _0x29ee78=$gameTemp[_0x2956f8(0x28d)]();if(_0x29ee78)_0x29ee78['wait'](_0x5bc894);}else this['addToQueue']({'targetScaleX':this[_0x2956f8(0x257)]*0.05,'targetOpacity':0x0,'duration':_0x3852ee,'easingType':_0x2956f8(0x349)});}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x32b)]=function(_0x24decb,_0x5cb815){const _0x53de9c=_0x29bdbe;_0x5cb815=_0x5cb815||0x3c,this['clearQueue'](),this[_0x53de9c(0x362)]({'targetScaleX':_0x24decb,'targetScaleY':_0x24decb,'duration':0x3c,'easingType':'OutBounce'});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x324),_0x50f2dc=>{const _0x44d7e7=_0x29bdbe;VisuMZ[_0x44d7e7(0x2bb)](_0x50f2dc,_0x50f2dc);const _0x33387b=_0x50f2dc[_0x44d7e7(0x31f)];if(_0x33387b[_0x44d7e7(0x369)]<=0x0)return;const _0x3409bc=Number(_0x50f2dc['DistanceX']),_0x6b8ca=Number(_0x50f2dc['DistanceY']),_0x1afd11=Math[_0x44d7e7(0x2ee)](Number(_0x50f2dc['Duration']),0x1);let _0x3ab518=0x0;for(const _0x41adf5 of _0x33387b){if(_0x44d7e7(0x2b2)!==_0x44d7e7(0x230)){const _0xe683a1=$gameScreen['picture'](_0x41adf5);if(!_0xe683a1)continue;_0xe683a1[_0x44d7e7(0x372)](_0x3409bc,_0x6b8ca,_0x1afd11),_0x3ab518=_0xe683a1[_0x44d7e7(0x288)]();}else _0x36b1a1=_0x2b4260||0x14,this[_0x44d7e7(0x364)](),_0x364b80?(this[_0x44d7e7(0x362)]({'scaleY':this[_0x44d7e7(0x1f9)]*0.05,'opacity':this[_0x44d7e7(0x2ef)]||0xff,'duration':0x0,'easingType':_0x44d7e7(0x1ee)}),this[_0x44d7e7(0x362)]({'targetScaleY':this[_0x44d7e7(0x1f9)],'duration':_0x4c7741,'easingType':_0x44d7e7(0x389)})):(this[_0x44d7e7(0x362)]({'targetScaleY':this['_scaleY']*0.05,'duration':_0x49da27-0x2,'easingType':_0x44d7e7(0x3cc)}),this[_0x44d7e7(0x362)]({'targetOpacity':0x0,'duration':0x2,'easingType':_0x44d7e7(0x1ee)}));}if(_0x50f2dc['Wait']){const _0x24ac13=$gameTemp[_0x44d7e7(0x28d)]();if(_0x24ac13)_0x24ac13[_0x44d7e7(0x29e)](_0x3ab518);}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x372)]=function(_0x2700d9,_0xf14013,_0x312176){const _0x420717=_0x29bdbe;_0x2700d9=_0x2700d9??0x8,_0xf14013=_0xf14013??0x10,_0x312176=_0x312176||0x4,this[_0x420717(0x364)](),this[_0x420717(0x362)]({'targetMoveX':this['_x']+_0x2700d9,'targetMoveY':this['_y']+_0xf14013,'duration':_0x312176,'easingType':_0x420717(0x1ee)}),this[_0x420717(0x362)]({'targetMoveX':this['_x'],'targetMoveY':this['_y'],'duration':_0x312176});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x2b6),_0x40a4e3=>{const _0x312552=_0x29bdbe;VisuMZ[_0x312552(0x2bb)](_0x40a4e3,_0x40a4e3);const _0x5e58f9=_0x40a4e3['PictureIDs'];if(_0x5e58f9[_0x312552(0x369)]<=0x0)return;const _0xf6bcf=_0x40a4e3['EffectIn']==='In',_0x4f5758=Math['max'](Number(_0x40a4e3[_0x312552(0x303)]),0x1),_0x429a3d=Math[_0x312552(0x2ee)](Number(_0x40a4e3['Duration']),0x1);let _0x4d4b94=0x0;for(const _0xa6bcf8 of _0x5e58f9){const _0x883ff7=$gameScreen['picture'](_0xa6bcf8);if(!_0x883ff7)continue;_0x883ff7['setupEffect_RandomInOut'](_0xf6bcf,_0x4f5758,_0x429a3d),_0x4d4b94=_0x883ff7[_0x312552(0x288)]();}if(_0x40a4e3[_0x312552(0x231)]){const _0x17cd22=$gameTemp['getLastPluginCommandInterpreter']();if(_0x17cd22)_0x17cd22['wait'](_0x4d4b94);}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x2e8)]=function(_0xf770a4,_0x5127eb,_0x43d430){const _0x41952d=_0x29bdbe;_0x5127eb=_0x5127eb||0x1,_0x43d430=_0x43d430||0x3c,this[_0x41952d(0x364)]();if(_0xf770a4){if(_0x41952d(0x287)!==_0x41952d(0x207)){let _0x17c26a=_0x43d430;while(_0x17c26a--){const _0x792d7a=_0x17c26a/_0x43d430;this[_0x41952d(0x362)]({'moveX':this['_x']+(Math['random']()>0.5?-0x1:0x1)*Math[_0x41952d(0x23e)](Math[_0x41952d(0x1d6)](_0x5127eb)),'moveY':this['_y']+(Math[_0x41952d(0x267)]()>0.5?-0x1:0x1)*Math[_0x41952d(0x23e)](Math[_0x41952d(0x1d6)](_0x5127eb)),'opacity':this['_opacity']*(0x1-_0x792d7a),'duration':0x1});}this[_0x41952d(0x362)]({'moveX':this['_x'],'moveY':this['_y'],'opacity':this[_0x41952d(0x2ef)]||0xff,'duration':0x0});}else{const _0x558094=_0x318a66['getLastPluginCommandInterpreter']();if(_0x558094)_0x558094['wait'](_0xca86f9);}}else{let _0x55374d=_0x43d430;while(_0x55374d--){if(_0x41952d(0x21c)===_0x41952d(0x21c)){const _0x1fa535=0x1-_0x55374d/_0x43d430;this[_0x41952d(0x362)]({'moveX':this['_x']+(Math[_0x41952d(0x267)]()>0.5?-0x1:0x1)*Math[_0x41952d(0x23e)](Math[_0x41952d(0x1d6)](_0x5127eb)),'moveY':this['_y']+(Math['random']()>0.5?-0x1:0x1)*Math[_0x41952d(0x23e)](Math[_0x41952d(0x1d6)](_0x5127eb)),'opacity':this['_opacity']*(0x1-_0x1fa535),'duration':0x1});}else this[_0x41952d(0x386)](),this[_0x41952d(0x2f6)]();}this['addToQueue']({'moveX':this['_x'],'moveY':this['_y'],'opacity':0x0,'duration':0x0});}},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x317),_0x2fdf93=>{const _0x30f19a=_0x29bdbe;VisuMZ[_0x30f19a(0x2bb)](_0x2fdf93,_0x2fdf93);const _0x52fa67=_0x2fdf93[_0x30f19a(0x31f)];if(_0x52fa67[_0x30f19a(0x369)]<=0x0)return;const _0xddddb0=_0x2fdf93['EffectIn']==='In',_0xe331f5=Math[_0x30f19a(0x2ee)](Number(_0x2fdf93['Distance']),0x1),_0x53cb57=_0x2fdf93[_0x30f19a(0x221)]===_0x30f19a(0x258),_0x2c46f6=Math[_0x30f19a(0x2ee)](Number(_0x2fdf93[_0x30f19a(0x242)]),0x1),_0x44b586=Math[_0x30f19a(0x2ee)](Number(_0x2fdf93['Duration']),0x1);let _0x4c77af=0x0;for(const _0xbfcd57 of _0x52fa67){if('MZrRJ'!==_0x30f19a(0x38b)){const _0xc89a98=_0x3ad4ae['getLastPluginCommandInterpreter']();if(_0xc89a98)_0xc89a98[_0x30f19a(0x29e)](_0x3e350c);}else{const _0x1d8270=$gameScreen[_0x30f19a(0x3df)](_0xbfcd57);if(!_0x1d8270)continue;_0x1d8270[_0x30f19a(0x3d0)](_0xddddb0,_0xe331f5,_0x53cb57,_0x2c46f6,_0x44b586),_0x4c77af=_0x1d8270[_0x30f19a(0x288)]();}}if(_0x2fdf93['Wait']){if(_0x30f19a(0x23d)===_0x30f19a(0x3b9)){this[_0x30f19a(0x364)]();const _0x5d1726=_0x2440d4['loadPicture'](_0x341ea9);_0x5d1726[_0x30f19a(0x3c2)](this['addToQueue'][_0x30f19a(0x248)](this,{'filename':_0x5b6b76,'duration':0x0,'easingType':_0x30f19a(0x1ee)}));}else{const _0x2c6313=$gameTemp[_0x30f19a(0x28d)]();if(_0x2c6313)_0x2c6313[_0x30f19a(0x29e)](_0x4c77af);}}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x3d0)]=function(_0x203769,_0x401e96,_0x4f53a0,_0x4c7cdd,_0x10ec13){const _0x590145=_0x29bdbe;_0x401e96=_0x401e96||0x1f4,_0x4c7cdd=_0x4c7cdd||0x1,_0x10ec13=_0x10ec13||0x3c,this[_0x590145(0x364)]();if(_0x203769)this[_0x590145(0x362)]({'anchor':{'x':0.5,'y':0.5},'currentAngle':-_0x4c7cdd*0x168+this['anglePlus'](),'moveX':this['_x']+(_0x4f53a0?_0x401e96:-_0x401e96),'opacity':0x0,'duration':0x0}),this[_0x590145(0x362)]({'targetAngle':this[_0x590145(0x229)](),'targetOpacity':this[_0x590145(0x2ef)]||0xff,'targetMoveX':this['_x'],'duration':_0x10ec13,'easingType':'Linear'});else{if(_0x590145(0x23f)==='yXdhI'){const _0x1b25e8=_0x4be356[_0x590145(0x28d)]();if(_0x1b25e8)_0x1b25e8[_0x590145(0x29e)](_0x72243e);}else this[_0x590145(0x362)]({'targetAngle':_0x4c7cdd*0x168+this['anglePlus'](),'targetMoveX':this['_x']+(_0x4f53a0?-_0x401e96:_0x401e96),'targetOpacity':0x0,'anchor':{'x':0.5,'y':0.5},'duration':_0x10ec13,'easingType':'Linear'});}},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],'Rotate',_0x48727d=>{const _0xe4a752=_0x29bdbe;VisuMZ[_0xe4a752(0x2bb)](_0x48727d,_0x48727d);const _0x4c33e1=_0x48727d[_0xe4a752(0x31f)];if(_0x4c33e1[_0xe4a752(0x369)]<=0x0)return;const _0x3e6b76=_0x48727d['Direction']===_0xe4a752(0x2fa),_0x3eddf9=Math['max'](Number(_0x48727d[_0xe4a752(0x242)]),0x1),_0x258b7a=Math['max'](Number(_0x48727d[_0xe4a752(0x1fa)]),0x1);let _0xb87a3a=0x0;for(const _0x24aca6 of _0x4c33e1){const _0x2ac5f5=$gameScreen[_0xe4a752(0x3df)](_0x24aca6);if(!_0x2ac5f5)continue;_0x2ac5f5[_0xe4a752(0x24a)](_0x3e6b76,_0x3eddf9,_0x258b7a),_0xb87a3a=_0x2ac5f5['getTotalQueueDuration']();}if(_0x48727d[_0xe4a752(0x231)]){if(_0xe4a752(0x202)!==_0xe4a752(0x202))_0x687f92=_0x50060d||0x14,this['clearQueue'](),_0xc3f887?(this[_0xe4a752(0x362)]({'scaleX':this[_0xe4a752(0x257)]*0.05,'opacity':0x0,'duration':0x0,'easingType':_0xe4a752(0x1ee)}),this[_0xe4a752(0x362)]({'targetScaleX':this['_scaleX'],'targetOpacity':this[_0xe4a752(0x2ef)]||0xff,'duration':_0x54d59e,'easingType':_0xe4a752(0x349)})):this[_0xe4a752(0x362)]({'targetScaleX':this['_scaleX']*0x4,'targetOpacity':0x0,'duration':_0x20e889,'easingType':_0xe4a752(0x349)});else{const _0x29bb6b=$gameTemp[_0xe4a752(0x28d)]();if(_0x29bb6b)_0x29bb6b['wait'](_0xb87a3a);}}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x24a)]=function(_0x5a118b,_0xa847a7,_0x4fcb17){const _0xaa0ba1=_0x29bdbe;_0xa847a7=_0xa847a7||0x1,_0x4fcb17=_0x4fcb17||0x0,this[_0xaa0ba1(0x364)](),this['addToQueue']({'targetAngle':this['anglePlus']()+(_0x5a118b?-0x1:0x1)*(_0xa847a7*0x168),'duration':_0x4fcb17,'easingType':_0xaa0ba1(0x1ee)}),this[_0xaa0ba1(0x362)]({'currentAngle':this[_0xaa0ba1(0x229)](),'duration':0x0,'easingType':_0xaa0ba1(0x1ee)});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x2f7),_0xe65174=>{const _0xacab8b=_0x29bdbe;VisuMZ[_0xacab8b(0x2bb)](_0xe65174,_0xe65174);const _0x273009=_0xe65174[_0xacab8b(0x31f)];if(_0x273009[_0xacab8b(0x369)]<=0x0)return;const _0x178b49=Math[_0xacab8b(0x2ee)](Number(_0xe65174[_0xacab8b(0x3db)]),0x1),_0x593930=Math['max'](Number(_0xe65174[_0xacab8b(0x303)]),0x1);let _0x428aba=0x0;for(const _0x2fcfde of _0x273009){const _0x37d402=$gameScreen[_0xacab8b(0x3df)](_0x2fcfde);if(!_0x37d402)continue;_0x37d402[_0xacab8b(0x208)](_0x178b49,_0x593930),_0x428aba=_0x37d402['getTotalQueueDuration']();}if(_0xe65174[_0xacab8b(0x231)]){const _0x42f7b5=$gameTemp[_0xacab8b(0x28d)]();if(_0x42f7b5)_0x42f7b5[_0xacab8b(0x29e)](_0x428aba);}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x208)]=function(_0x556299,_0x4a1a88){const _0x47d113=_0x29bdbe;_0x556299=_0x556299||0xa,_0x4a1a88=_0x4a1a88||0x8,this['clearQueue']();while(_0x556299--){this[_0x47d113(0x362)]({'targetMoveX':this['_x']+_0x4a1a88,'duration':0x2,'easingType':'Linear'}),this[_0x47d113(0x362)]({'targetMoveX':this['_x']-_0x4a1a88,'duration':0x4,'easingType':_0x47d113(0x1ee)});}this[_0x47d113(0x362)]({'targetMoveX':this['_x'],'duration':0x2});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x203),_0x2464e2=>{const _0x5e89c6=_0x29bdbe;VisuMZ[_0x5e89c6(0x2bb)](_0x2464e2,_0x2464e2);const _0x554dab=_0x2464e2[_0x5e89c6(0x31f)];if(_0x554dab[_0x5e89c6(0x369)]<=0x0)return;const _0x223501=_0x2464e2[_0x5e89c6(0x3b6)]==='In',_0x5909a2=Math[_0x5e89c6(0x2ee)](Number(_0x2464e2[_0x5e89c6(0x1fa)]),0x1);let _0x561e3c=0x0;for(const _0x2458fc of _0x554dab){if(_0x5e89c6(0x3f8)==='ITlRI'){const _0x25a86d=$gameScreen[_0x5e89c6(0x3df)](_0x2458fc);if(!_0x25a86d)continue;_0x25a86d[_0x5e89c6(0x1f1)](_0x223501,_0x5909a2),_0x561e3c=_0x25a86d[_0x5e89c6(0x288)]();}else _0x3da7a6['enabled']=!![],_0x3b1414[_0x5e89c6(0x327)]=_0x228568[_0x5e89c6(0x34c)],_0xbca34f[_0x5e89c6(0x2bc)]=_0x185181[_0x5e89c6(0x34c)];}if(_0x2464e2[_0x5e89c6(0x231)]){if('nmHxw'===_0x5e89c6(0x259)){const _0x5bbd0e=$gameTemp['getLastPluginCommandInterpreter']();if(_0x5bbd0e)_0x5bbd0e[_0x5e89c6(0x29e)](_0x561e3c);}else _0xf122f[_0x5e89c6(0x3ae)]=!![],_0x515945[_0x5e89c6(0x2e6)]=_0x89359d['round'](_0x1c6a8f['targetHue']);}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x1f1)]=function(_0x1e2774,_0x2fcb3f){const _0x40d0bf=_0x29bdbe;_0x2fcb3f=_0x2fcb3f||0x14,this[_0x40d0bf(0x364)](),_0x1e2774?(this[_0x40d0bf(0x362)]({'scaleX':this['_scaleX']*0x4,'scaleY':this['_scaleY']*0x4,'opacity':0x0,'duration':0x0,'easingType':_0x40d0bf(0x1ee)}),this[_0x40d0bf(0x362)]({'targetScaleX':this[_0x40d0bf(0x257)],'targetScaleY':this['_scaleY'],'targetOpacity':this[_0x40d0bf(0x2ef)]||0xff,'duration':_0x2fcb3f,'easingType':'InOutSine'})):this[_0x40d0bf(0x362)]({'targetScaleX':this[_0x40d0bf(0x257)]*0.05,'targetScaleY':this[_0x40d0bf(0x1f9)]*0.05,'targetOpacity':0x0,'duration':_0x2fcb3f,'easingType':'InOutSine'});},PluginManager[_0x29bdbe(0x237)](pluginData['name'],_0x29bdbe(0x29c),_0x4ecb9a=>{const _0x183cbd=_0x29bdbe;VisuMZ[_0x183cbd(0x2bb)](_0x4ecb9a,_0x4ecb9a);const _0x20a4e2=_0x4ecb9a[_0x183cbd(0x31f)];if(_0x20a4e2[_0x183cbd(0x369)]<=0x0)return;const _0x401fa7=Math[_0x183cbd(0x2ee)](Number(_0x4ecb9a['Times']),0x1),_0x57e141=Math[_0x183cbd(0x2ee)](Number(_0x4ecb9a[_0x183cbd(0x303)]),0x1);let _0xa90f92=0x0;for(const _0x3b3143 of _0x20a4e2){if('QinHU'!==_0x183cbd(0x23b)){const _0x48e8a3=_0x13199e[_0x183cbd(0x28d)]();if(_0x48e8a3)_0x48e8a3['wait'](_0x42998b);}else{const _0x27c1bc=$gameScreen[_0x183cbd(0x3df)](_0x3b3143);if(!_0x27c1bc)continue;_0x27c1bc[_0x183cbd(0x2c2)](_0x401fa7,_0x57e141),_0xa90f92=_0x27c1bc[_0x183cbd(0x288)]();}}if(_0x4ecb9a['Wait']){if(_0x183cbd(0x333)==='SDRym'){const _0x29625c=_0x3a20c0['getLastPluginCommandInterpreter']();if(_0x29625c)_0x29625c[_0x183cbd(0x29e)](_0x151079);}else{const _0x28d4cf=$gameTemp[_0x183cbd(0x28d)]();if(_0x28d4cf)_0x28d4cf[_0x183cbd(0x29e)](_0xa90f92);}}}),Game_Picture['prototype'][_0x29bdbe(0x2c2)]=function(_0x1288bf,_0xf384a2){const _0x3547f3=_0x29bdbe;_0x1288bf=_0x1288bf||0xa,_0xf384a2=_0xf384a2||0xa,this[_0x3547f3(0x364)]();while(_0x1288bf--){_0x3547f3(0x269)===_0x3547f3(0x269)?this[_0x3547f3(0x362)]({'targetMoveX':this['_x']+(Math[_0x3547f3(0x267)]()>0.5?-0x1:0x1)*(Math[_0x3547f3(0x23e)](_0xf384a2)+0x1),'targetMoveY':this['_y']+(Math[_0x3547f3(0x267)]()>0.5?-0x1:0x1)*(Math['randomInt'](_0xf384a2)+0x1),'duration':0x2,'easingType':_0x3547f3(0x1ee)}):this[_0x3547f3(0x3de)]();}this[_0x3547f3(0x362)]({'targetMoveX':this['_x'],'targetMoveY':this['_y'],'duration':0x2,'easingType':_0x3547f3(0x1ee)});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x272),_0x8000ab=>{const _0x172f31=_0x29bdbe;VisuMZ['ConvertParams'](_0x8000ab,_0x8000ab);const _0x3bee0f=_0x8000ab[_0x172f31(0x31f)];if(_0x3bee0f['length']<=0x0)return;const _0x44b400=Number(_0x8000ab[_0x172f31(0x200)])||0x0,_0x14b05d=Number(_0x8000ab[_0x172f31(0x3ba)])||0x0,_0xfc052=Number(_0x8000ab[_0x172f31(0x330)])||0x0,_0x5229d7=Math[_0x172f31(0x2ee)](Number(_0x8000ab[_0x172f31(0x1fa)]),0x0);for(const _0x95fe2c of _0x3bee0f){if(_0x172f31(0x265)!==_0x172f31(0x307)){const _0x53a9c8=$gameScreen['picture'](_0x95fe2c);if(!_0x53a9c8)continue;_0x53a9c8[_0x172f31(0x1e1)](_0x44b400,_0x14b05d,_0xfc052,_0x5229d7);}else _0x47453a=_0x53da52||0x3c,this[_0x172f31(0x364)](),_0x15c2f1?this[_0x172f31(0x362)]({'moveY':_0x78ae53[_0x172f31(0x24f)],'targetMoveY':this['_y'],'opacity':0x0,'targetOpacity':this[_0x172f31(0x2ef)]||0xff,'duration':_0x447f4e,'tone':_0x3c9dba[_0x172f31(0x266)](),'targetTone':this[_0x172f31(0x206)]?this['_tone'][_0x172f31(0x266)]():[0x0,0x0,0x0,0x0],'toneDuration':_0x5f32e4,'easingType':_0x172f31(0x35c)}):this[_0x172f31(0x362)]({'targetTone':_0x213dbc[_0x172f31(0x266)](),'toneDuration':_0x4cf47b,'targetMoveY':_0x4de839[_0x172f31(0x24f)],'targetOpacity':0x0,'duration':_0x1f82d0,'blendMode':this[_0x172f31(0x21b)],'easingType':_0x172f31(0x1f2)});}if(_0x8000ab[_0x172f31(0x231)]&&_0x5229d7>0x0){if(_0x172f31(0x397)===_0x172f31(0x3cf)){_0x4f8c8c=_0x21f4c7||0x3c,_0x2672af=_0x57c878[_0x172f31(0x2ee)](_0x98b21e,0xa),_0x1e9ddc=_0x5af430,_0x2b237f=_0x1e3fc0??0xa,this[_0x172f31(0x364)]();while(_0xf607ff--){this[_0x172f31(0x362)]({'moveX':this['_x']+(_0x2695c7[_0x172f31(0x267)]()>0.5?-0x1:0x1)*(_0x244c10[_0x172f31(0x23e)](_0x58720e)+0x1),'moveY':this['_y']+(_0x33e14c[_0x172f31(0x267)]()>0.5?-0x1:0x1)*(_0x1e8418[_0x172f31(0x23e)](_0x28e17d)+0x1),'tone':(_0x18bfe0%0x6>=0x3?_0x40a7db:_0x2691cf)[_0x172f31(0x266)](),'duration':0x1,'easingType':_0x172f31(0x1ee)});}this[_0x172f31(0x362)]({'targetTone':this[_0x172f31(0x206)]?this[_0x172f31(0x206)][_0x172f31(0x266)]():[0x0,0x0,0x0,0x0],'toneDuration':_0x2afb8e/0xa*0x6,'targetMoveX':this['_x'],'targetMoveY':this['_y'],'duration':0x0,'easingType':_0x172f31(0x1ee)});}else{const _0x2317d3=$gameTemp[_0x172f31(0x28d)]();if(_0x2317d3)_0x2317d3[_0x172f31(0x29e)](_0x5229d7);}}}),PluginManager['registerCommand'](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x3f3),_0x4ec45e=>{const _0x5c6138=_0x29bdbe;VisuMZ[_0x5c6138(0x2bb)](_0x4ec45e,_0x4ec45e);const _0x452df3=_0x4ec45e[_0x5c6138(0x31f)];if(_0x452df3[_0x5c6138(0x369)]<=0x0)return;const _0x1e33f8=_0x4ec45e[_0x5c6138(0x33c)]||'';if(_0x1e33f8==='')return;const _0x3a7241=Number(_0x4ec45e[_0x5c6138(0x398)]),_0x456526=Math['max'](Number(_0x4ec45e[_0x5c6138(0x242)]),0x1),_0x1d2679=Math[_0x5c6138(0x2ee)](Number(_0x4ec45e[_0x5c6138(0x1fa)]),0x1);let _0x403b64=0x0;for(const _0x4fddb2 of _0x452df3){const _0x267d17=$gameScreen[_0x5c6138(0x3df)](_0x4fddb2);if(!_0x267d17)continue;_0x267d17[_0x5c6138(0x2af)](_0x1e33f8,_0x3a7241,_0x456526,_0x1d2679),_0x403b64=_0x267d17[_0x5c6138(0x288)]();}if(_0x4ec45e[_0x5c6138(0x231)]){const _0x9a7dbf=$gameTemp[_0x5c6138(0x28d)]();if(_0x9a7dbf)_0x9a7dbf[_0x5c6138(0x29e)](_0x403b64);}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x2af)]=function(_0x4a3e90,_0x5022d4,_0x5d9ef8,_0x18b9c1){const _0xdb6a66=_0x29bdbe;ImageManager['loadPicture'](_0x4a3e90),this[_0xdb6a66(0x364)](),this['addToQueue']({'targetAnchor':{'x':0.5,'y':0.5},'targetAngle':this['anglePlus']()+_0x5d9ef8*0x168,'targetScaleX':this[_0xdb6a66(0x257)]*_0x5022d4,'targetScaleY':this[_0xdb6a66(0x1f9)]*_0x5022d4,'duration':Math[_0xdb6a66(0x232)](_0x18b9c1/0x2),'easingType':_0xdb6a66(0x349)}),this[_0xdb6a66(0x362)]({'filename':_0x4a3e90,'targetAnchor':JsonEx['makeDeepCopy'](this[_0xdb6a66(0x21d)]),'currentAngle':this['anglePlus']()-_0x5d9ef8*0x168,'targetAngle':this[_0xdb6a66(0x229)](),'targetScaleX':this[_0xdb6a66(0x257)],'targetScaleY':this[_0xdb6a66(0x1f9)],'duration':Math[_0xdb6a66(0x2e1)](_0x18b9c1/0x2),'easingType':_0xdb6a66(0x349)});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x3d7),_0x67ea09=>{const _0x45ac5e=_0x29bdbe;VisuMZ[_0x45ac5e(0x2bb)](_0x67ea09,_0x67ea09);const _0x2c711b=_0x67ea09[_0x45ac5e(0x31f)];if(_0x2c711b[_0x45ac5e(0x369)]<=0x0)return;const _0x293835=_0x67ea09['EffectIn']==='In',_0x4a20a1=Math[_0x45ac5e(0x2ee)](Number(_0x67ea09[_0x45ac5e(0x242)]),0x1),_0x238822=Number(_0x67ea09[_0x45ac5e(0x398)]),_0x163115=Math['max'](Number(_0x67ea09['Duration']),0x1);let _0x4611eb=0x0;for(const _0x131de3 of _0x2c711b){const _0x4bd462=$gameScreen[_0x45ac5e(0x3df)](_0x131de3);if(!_0x4bd462)continue;_0x4bd462[_0x45ac5e(0x315)](_0x293835,_0x4a20a1,_0x238822,_0x163115),_0x4611eb=_0x4bd462[_0x45ac5e(0x288)]();}if(_0x67ea09[_0x45ac5e(0x231)]){const _0x5225ec=$gameTemp['getLastPluginCommandInterpreter']();if(_0x5225ec)_0x5225ec[_0x45ac5e(0x29e)](_0x4611eb);}}),Game_Picture['prototype'][_0x29bdbe(0x315)]=function(_0x1dfc40,_0x34c515,_0xbc10ee,_0x5b8bed){const _0x4ef48c=_0x29bdbe;_0x34c515=_0x34c515||0x2,_0xbc10ee=_0xbc10ee||0.5,_0x5b8bed=_0x5b8bed||0x3c,this['clearQueue'](),_0x1dfc40?(this[_0x4ef48c(0x362)]({'anchor':{'x':0.5,'y':0.5},'currentAngle':-_0x34c515*0x168+this[_0x4ef48c(0x229)](),'scaleX':this['_scaleX']*_0xbc10ee,'scaleY':this[_0x4ef48c(0x1f9)]*_0xbc10ee,'opacity':0x0,'duration':0x0}),this['addToQueue']({'targetAngle':this['anglePlus'](),'targetOpacity':this[_0x4ef48c(0x2ef)]||0xff,'targetScaleX':this[_0x4ef48c(0x257)],'targetScaleY':this[_0x4ef48c(0x1f9)],'duration':_0x5b8bed,'easingType':_0x4ef48c(0x26f)})):_0x4ef48c(0x1fe)===_0x4ef48c(0x3aa)?_0x457134['duration']=0x1:this[_0x4ef48c(0x362)]({'anchor':{'x':0.5,'y':0.5},'targetAngle':_0x34c515*0x168+this[_0x4ef48c(0x229)](),'targetOpacity':0x0,'targetScaleX':this[_0x4ef48c(0x257)]*_0xbc10ee,'targetScaleY':this[_0x4ef48c(0x1f9)]*_0xbc10ee,'duration':_0x5b8bed,'easingType':_0x4ef48c(0x26f)});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x2d4),_0x17a305=>{const _0x569095=_0x29bdbe;VisuMZ[_0x569095(0x2bb)](_0x17a305,_0x17a305);const _0x152188=_0x17a305[_0x569095(0x31f)];if(_0x152188[_0x569095(0x369)]<=0x0)return;const _0x43a36a=_0x17a305[_0x569095(0x3b6)]==='In',_0xb745c6=Math[_0x569095(0x2ee)](Number(_0x17a305[_0x569095(0x1fa)]),0x1);let _0x324550=0x0;for(const _0x4d3e7a of _0x152188){const _0x3f78df=$gameScreen[_0x569095(0x3df)](_0x4d3e7a);if(!_0x3f78df)continue;_0x3f78df[_0x569095(0x1d2)](_0x43a36a,_0xb745c6),_0x324550=_0x3f78df['getTotalQueueDuration']();}if(_0x17a305[_0x569095(0x231)]){if(_0x569095(0x370)!==_0x569095(0x370))_0xf17604[_0x569095(0x2e7)]=_0x752ada[_0x569095(0x27e)];else{const _0x2ab6eb=$gameTemp[_0x569095(0x28d)]();if(_0x2ab6eb)_0x2ab6eb[_0x569095(0x29e)](_0x324550);}}}),Game_Picture['prototype'][_0x29bdbe(0x1d2)]=function(_0x446d1e,_0x159c59){const _0x3bb154=_0x29bdbe;_0x159c59=_0x159c59||0x14,this['clearQueue'](),_0x446d1e?_0x3bb154(0x233)!==_0x3bb154(0x233)?this['addToQueue']({'anchor':{'x':0.5,'y':0.5},'targetAngle':_0x36eb2e*0x168+this[_0x3bb154(0x229)](),'targetOpacity':0x0,'targetScaleX':this[_0x3bb154(0x257)]*_0x4e01fe,'targetScaleY':this[_0x3bb154(0x1f9)]*_0x249f02,'duration':_0x41fa3c,'easingType':_0x3bb154(0x26f)}):(this['addToQueue']({'scaleX':this[_0x3bb154(0x257)]*0x4,'opacity':0x0,'duration':0x0,'easingType':_0x3bb154(0x1ee)}),this[_0x3bb154(0x362)]({'targetScaleX':this[_0x3bb154(0x257)],'targetOpacity':this[_0x3bb154(0x2ef)]||0xff,'duration':_0x159c59,'easingType':'InOutSine'})):this[_0x3bb154(0x362)]({'targetScaleX':this['_scaleX']*0.05,'targetOpacity':0x0,'duration':_0x159c59,'easingType':_0x3bb154(0x349)});},PluginManager['registerCommand'](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x2c0),_0x16b5c6=>{const _0x4f65a2=_0x29bdbe;VisuMZ[_0x4f65a2(0x2bb)](_0x16b5c6,_0x16b5c6);const _0x3501ae=_0x16b5c6[_0x4f65a2(0x31f)];if(_0x3501ae['length']<=0x0)return;const _0x5b8a0e=_0x16b5c6[_0x4f65a2(0x3b6)]==='In',_0x305fa7=Math[_0x4f65a2(0x2ee)](Number(_0x16b5c6['Duration']),0x1);let _0x227e2e=0x0;for(const _0x210531 of _0x3501ae){const _0x1ac7df=$gameScreen[_0x4f65a2(0x3df)](_0x210531);if(!_0x1ac7df)continue;_0x1ac7df[_0x4f65a2(0x1e3)](_0x5b8a0e,_0x305fa7),_0x227e2e=_0x1ac7df[_0x4f65a2(0x288)]();}if(_0x16b5c6[_0x4f65a2(0x231)]){const _0x736f19=$gameTemp['getLastPluginCommandInterpreter']();if(_0x736f19)_0x736f19[_0x4f65a2(0x29e)](_0x227e2e);}}),Game_Picture['prototype'][_0x29bdbe(0x1e3)]=function(_0x1f1d13,_0xa024f6){const _0x490775=_0x29bdbe;_0xa024f6=_0xa024f6||0x14,this[_0x490775(0x364)]();if(_0x1f1d13)this[_0x490775(0x362)]({'scaleX':this[_0x490775(0x257)]*0.05,'opacity':0x0,'duration':0x0,'easingType':_0x490775(0x1ee)}),this[_0x490775(0x362)]({'targetScaleX':this[_0x490775(0x257)],'targetOpacity':this[_0x490775(0x2ef)]||0xff,'duration':_0xa024f6,'easingType':_0x490775(0x349)});else{if(_0x490775(0x296)!==_0x490775(0x238))this[_0x490775(0x362)]({'targetScaleX':this[_0x490775(0x257)]*0x4,'targetOpacity':0x0,'duration':_0xa024f6,'easingType':_0x490775(0x349)});else{const _0x30601b=_0x9ea41f[_0x490775(0x28d)]();if(_0x30601b)_0x30601b[_0x490775(0x29e)](_0x2bc08f);}}},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x3bb),_0x57ba78=>{const _0x532fea=_0x29bdbe;VisuMZ['ConvertParams'](_0x57ba78,_0x57ba78);const _0x19a0d8=_0x57ba78[_0x532fea(0x31f)];if(_0x19a0d8[_0x532fea(0x369)]<=0x0)return;const _0x3d5881=_0x57ba78['EffectIn']==='In',_0x5a02c7=_0x57ba78[_0x532fea(0x32f)]||[0x0,0x80,0xa0,0x0],_0x25c242=Math['max'](Number(_0x57ba78['Duration']),0xa);let _0x190d57=0x0;for(const _0x30ca5d of _0x19a0d8){if('opvdN'===_0x532fea(0x309)){const _0x262ed6=$gameScreen[_0x532fea(0x3df)](_0x30ca5d);if(!_0x262ed6)continue;_0x262ed6[_0x532fea(0x2d8)](_0x3d5881,_0x5a02c7,_0x25c242),_0x190d57=_0x262ed6[_0x532fea(0x288)]();}else{const _0x4027eb=_0x11a81d[_0x532fea(0x28d)]();if(_0x4027eb)_0x4027eb[_0x532fea(0x29e)](_0xdf4e98);}}if(_0x57ba78['Wait']){const _0x4b92a3=$gameTemp[_0x532fea(0x28d)]();if(_0x4b92a3)_0x4b92a3[_0x532fea(0x29e)](_0x190d57);}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x2d8)]=function(_0x78a955,_0x29ae21,_0x456210){const _0x34a6e2=_0x29bdbe;_0x456210=_0x456210||0x3c,this[_0x34a6e2(0x364)](),_0x78a955?_0x34a6e2(0x2ac)!=='alcCC'?this[_0x34a6e2(0x362)]({'moveY':Graphics[_0x34a6e2(0x24f)],'targetMoveY':this['_y'],'opacity':0x0,'targetOpacity':this['_opacity']||0xff,'duration':_0x456210,'tone':_0x29ae21[_0x34a6e2(0x266)](),'targetTone':this[_0x34a6e2(0x206)]?this[_0x34a6e2(0x206)][_0x34a6e2(0x266)]():[0x0,0x0,0x0,0x0],'toneDuration':_0x456210,'easingType':_0x34a6e2(0x35c)}):(this[_0x34a6e2(0x362)]({'anchor':{'x':0.5,'y':0.5},'currentAngle':-_0xa365bc*0x168+this[_0x34a6e2(0x229)](),'moveX':this['_x']+(_0x207a21?_0x2db80b:-_0x265f27),'opacity':0x0,'duration':0x0}),this[_0x34a6e2(0x362)]({'targetAngle':this[_0x34a6e2(0x229)](),'targetOpacity':this['_opacity']||0xff,'targetMoveX':this['_x'],'duration':_0xbf7e14,'easingType':_0x34a6e2(0x1ee)})):_0x34a6e2(0x3a3)!=='gobba'?this['initPictureEffectsXyAlter']():this[_0x34a6e2(0x362)]({'targetTone':_0x29ae21[_0x34a6e2(0x266)](),'toneDuration':_0x456210,'targetMoveY':Graphics['height'],'targetOpacity':0x0,'duration':_0x456210,'blendMode':this[_0x34a6e2(0x21b)],'easingType':_0x34a6e2(0x1f2)});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],'Swaying',_0x29d62f=>{const _0x59b43d=_0x29bdbe;VisuMZ[_0x59b43d(0x2bb)](_0x29d62f,_0x29d62f);const _0x1ab8dd=_0x29d62f[_0x59b43d(0x31f)];if(_0x1ab8dd['length']<=0x0)return;const _0x39d505=Number(_0x29d62f[_0x59b43d(0x25e)])||0x0,_0x4c1c83=Number(_0x29d62f[_0x59b43d(0x3ba)])||0x0,_0x5449ce=Number(_0x29d62f[_0x59b43d(0x330)])||0x0,_0x3ec76e=Math['max'](Number(_0x29d62f[_0x59b43d(0x1fa)]),0x0);for(const _0x2cc766 of _0x1ab8dd){if(_0x59b43d(0x393)!==_0x59b43d(0x393)){if(this[_0x59b43d(0x3be)]===_0x427ab9)this[_0x59b43d(0x3ea)]();this[_0x59b43d(0x3be)]+=_0x1e15d3;}else{const _0x565a15=$gameScreen[_0x59b43d(0x3df)](_0x2cc766);if(!_0x565a15)continue;_0x565a15[_0x59b43d(0x3a5)](_0x39d505,_0x4c1c83,_0x5449ce,_0x3ec76e);}}if(_0x29d62f[_0x59b43d(0x231)]&&_0x3ec76e>0x0){const _0x1adf2f=$gameTemp['getLastPluginCommandInterpreter']();if(_0x1adf2f)_0x1adf2f['wait'](_0x3ec76e);}}),PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x26c),_0x4b8741=>{const _0x291004=_0x29bdbe;VisuMZ[_0x291004(0x2bb)](_0x4b8741,_0x4b8741);const _0x5843a3=_0x4b8741[_0x291004(0x31f)];if(_0x5843a3[_0x291004(0x369)]<=0x0)return;const _0xc2b821=_0x4b8741[_0x291004(0x3b6)]==='In',_0x1c8404=_0x4b8741['Tone']||[0xf0,0xf0,0xf0,0x0],_0x5c44f1=Math[_0x291004(0x2ee)](Number(_0x4b8741[_0x291004(0x1fa)]),0x1);let _0x5f0057=0x0;for(const _0x25ebf7 of _0x5843a3){if(_0x291004(0x36f)==='lLYwu'){const _0x136812=$gameScreen[_0x291004(0x3df)](_0x25ebf7);if(!_0x136812)continue;_0x136812[_0x291004(0x29f)](_0xc2b821,_0x1c8404,_0x5c44f1),_0x5f0057=_0x136812[_0x291004(0x288)]();}else _0x509249=_0x56d8d6||0x60,_0x279fb0=_0x4c98cf||0x3c,this[_0x291004(0x364)](),_0x4ebbb5?(this[_0x291004(0x362)]({'moveY':this['_y']+_0x23b101,'scaleX':this['_scaleX']*1.2,'scaleY':this['_scaleY']*1.5,'opacity':0x0,'duration':0x0,'easingType':_0x291004(0x1ee)}),this[_0x291004(0x362)]({'targetMoveY':this['_y'],'targetScaleX':this[_0x291004(0x257)],'targetScaleY':this['_scaleY'],'targetOpacity':this[_0x291004(0x2ef)]||0xff,'duration':_0x1083c5,'easingType':_0x291004(0x35c)})):this['addToQueue']({'targetMoveY':this['_y']-_0x2bd8aa,'targetScaleX':this[_0x291004(0x257)]*0.8,'targetScaleY':this[_0x291004(0x1f9)]*0.5,'targetOpacity':0x0,'duration':_0x548537,'easingType':_0x291004(0x1f2)});}if(_0x4b8741[_0x291004(0x231)]){const _0x3403db=$gameTemp['getLastPluginCommandInterpreter']();if(_0x3403db)_0x3403db[_0x291004(0x29e)](_0x5f0057);}}),Game_Picture['prototype'][_0x29bdbe(0x29f)]=function(_0x1dee87,_0x552196,_0x1edac7){const _0x4d09b8=_0x29bdbe;_0x1edac7=_0x1edac7||0x3c,this['clearQueue']();if(_0x1dee87){if('jTywK'!==_0x4d09b8(0x27d)){const _0x16ecfd=0x1-_0x1ce101[_0x4d09b8(0x383)](_0x481788-_0x49129e)/_0x490f61;this[_0x4d09b8(0x362)]({'moveX':this['_x']+(_0xfdda1c[_0x4d09b8(0x267)]()>0.5?-0x1:0x1)*_0x32be11['randomInt'](_0x224ded['ceil'](_0x5adb43*_0x16ecfd)),'moveY':this['_y']+(_0x1dcfbd[_0x4d09b8(0x267)]()>0.5?-0x1:0x1)*_0x1c08a6[_0x4d09b8(0x23e)](_0x4de174['ceil'](_0x4d352f*_0x16ecfd)),'duration':0x1,'easingType':_0x4d09b8(0x1ee)});}else this['addToQueue']({'opacity':0x0,'duration':0x0,'currentBlur':0xa}),this[_0x4d09b8(0x362)]({'opacity':this['_opacity']||0xff,'duration':_0x1edac7,'tone':_0x552196[_0x4d09b8(0x266)](),'targetBlur':0x0,'blurDuration':_0x1edac7,'targetTone':this[_0x4d09b8(0x206)]?this[_0x4d09b8(0x206)][_0x4d09b8(0x266)]():[0x0,0x0,0x0,0x0],'toneDuration':_0x1edac7,'easingType':_0x4d09b8(0x1ee)});}else this[_0x4d09b8(0x362)]({'duration':_0x1edac7,'targetTone':_0x552196[_0x4d09b8(0x266)](),'toneDuration':_0x1edac7,'targetBlur':0xa,'blurDuration':_0x1edac7,'easingType':'Linear'}),this['addToQueue']({'duration':0x0,'opacity':0x0,'tone':this[_0x4d09b8(0x206)]?this[_0x4d09b8(0x206)]['clone']():[0x0,0x0,0x0,0x0],'currentBlur':0x0});},PluginManager['registerCommand'](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x210),_0x5b1343=>{const _0x552bcf=_0x29bdbe;VisuMZ[_0x552bcf(0x2bb)](_0x5b1343,_0x5b1343);const _0x2e5f19=_0x5b1343[_0x552bcf(0x31f)];if(_0x2e5f19[_0x552bcf(0x369)]<=0x0)return;const _0x111ff9=_0x5b1343[_0x552bcf(0x3b6)]==='In',_0x480510=Math[_0x552bcf(0x2ee)](Number(_0x5b1343[_0x552bcf(0x1fa)]),0x1);let _0x580886=0x0;for(const _0xa677e3 of _0x2e5f19){if('RMPku'!==_0x552bcf(0x1fb)){const _0x479fc7=_0xe9fe2d(_0x4f8284['$1']);_0x479fc7!==_0x251002[_0x1be3d1][_0x552bcf(0x387)]&&(_0x242272(_0x552bcf(0x234)[_0x552bcf(0x2cc)](_0x508ea5,_0x479fc7)),_0x3a0112[_0x552bcf(0x378)]());}else{const _0x2c534c=$gameScreen[_0x552bcf(0x3df)](_0xa677e3);if(!_0x2c534c)continue;_0x2c534c[_0x552bcf(0x321)](_0x111ff9,_0x480510),_0x580886=_0x2c534c[_0x552bcf(0x288)]();}}if(_0x5b1343[_0x552bcf(0x231)]){const _0x620bef=$gameTemp['getLastPluginCommandInterpreter']();if(_0x620bef)_0x620bef[_0x552bcf(0x29e)](_0x580886);}}),Game_Picture['prototype']['setupEffect_TelevisionInOut']=function(_0x33e1dd,_0x2fb319){const _0x4c41d9=_0x29bdbe;_0x2fb319=_0x2fb319||0x14,this[_0x4c41d9(0x364)](),_0x33e1dd?(this[_0x4c41d9(0x362)]({'scaleX':this[_0x4c41d9(0x257)]*0xa,'scaleY':this[_0x4c41d9(0x1f9)]*0.05,'opacity':this[_0x4c41d9(0x2ef)]||0xff,'duration':0x0,'currentBlur':0xa,'easingType':_0x4c41d9(0x1ee)}),this[_0x4c41d9(0x362)]({'targetScaleX':this[_0x4c41d9(0x257)],'targetScaleY':this[_0x4c41d9(0x1f9)],'duration':_0x2fb319,'targetBlur':0x0,'blurDuration':_0x2fb319,'easingType':_0x4c41d9(0x389)})):(this[_0x4c41d9(0x362)]({'targetScaleX':this[_0x4c41d9(0x257)]*0xa,'targetScaleY':this[_0x4c41d9(0x1f9)]*0.05,'duration':_0x2fb319-0x2,'targetBlur':0xa,'blurDuration':_0x2fb319-0x2,'easingType':_0x4c41d9(0x3cc)}),this['addToQueue']({'targetOpacity':0x0,'duration':0x2,'targetBlur':0x0,'easingType':_0x4c41d9(0x1ee)}));},PluginManager[_0x29bdbe(0x237)](pluginData['name'],_0x29bdbe(0x2fd),_0x450e9b=>{const _0x3f3c6c=_0x29bdbe;VisuMZ[_0x3f3c6c(0x2bb)](_0x450e9b,_0x450e9b);const _0x45b904=_0x450e9b[_0x3f3c6c(0x31f)];if(_0x45b904[_0x3f3c6c(0x369)]<=0x0)return;const _0x2e09c9=Number(_0x450e9b['Z'])||0x0,_0x5a16d2=_0x450e9b[_0x3f3c6c(0x32f)]||[0x0,0x0,0x0,0x0],_0x4793cc=Math[_0x3f3c6c(0x2ee)](Number(_0x450e9b[_0x3f3c6c(0x1fa)]),0x1);let _0x36dde6=0x0;for(const _0x39c172 of _0x45b904){const _0x39074b=$gameScreen[_0x3f3c6c(0x3df)](_0x39c172);if(!_0x39074b)continue;_0x39074b[_0x3f3c6c(0x291)](_0x2e09c9,_0x5a16d2,_0x4793cc),_0x36dde6=_0x39074b[_0x3f3c6c(0x288)]();}if(_0x450e9b[_0x3f3c6c(0x231)]){if('Vdgpd'!=='AxVlz'){const _0x40c682=$gameTemp[_0x3f3c6c(0x28d)]();if(_0x40c682)_0x40c682[_0x3f3c6c(0x29e)](_0x36dde6);}else this['_blendMode']=_0x1b328e['blendMode'];}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x291)]=function(_0x3fcafd,_0x347959,_0x4677e0){const _0x2ad9d5=_0x29bdbe;this[_0x2ad9d5(0x364)](),this[_0x2ad9d5(0x362)]({'changeZ':_0x3fcafd,'duration':_0x4677e0,'targetTone':_0x347959[_0x2ad9d5(0x266)](),'toneDuration':_0x4677e0});},PluginManager[_0x29bdbe(0x237)](pluginData['name'],_0x29bdbe(0x308),_0x2fdf06=>{const _0x1d9c02=_0x29bdbe;VisuMZ['ConvertParams'](_0x2fdf06,_0x2fdf06);const _0x96de76=_0x2fdf06[_0x1d9c02(0x31f)];if(_0x96de76[_0x1d9c02(0x369)]<=0x0)return;const _0x166933=Number(_0x2fdf06['Z'])||0x0,_0xcfbe36=_0x2fdf06['Tone']||[0x0,0x0,0x0,0x0],_0x199019=Math[_0x1d9c02(0x2ee)](Number(_0x2fdf06[_0x1d9c02(0x1fa)]),0x1);let _0x17ee41=0x0;for(const _0xee4053 of _0x96de76){const _0x409c06=$gameScreen['picture'](_0xee4053);if(!_0x409c06)continue;_0x409c06[_0x1d9c02(0x264)](_0x166933,_0xcfbe36,_0x199019),_0x17ee41=_0x409c06[_0x1d9c02(0x288)]();}if(_0x2fdf06['Wait']){if(_0x1d9c02(0x227)!==_0x1d9c02(0x2aa)){const _0x4d567b=$gameTemp['getLastPluginCommandInterpreter']();if(_0x4d567b)_0x4d567b[_0x1d9c02(0x29e)](_0x17ee41);}else{const _0x24343f=_0x555548[_0x1d9c02(0x232)](_0x61450d/_0x18f0df),_0x256935=_0x35d80e[_0x1d9c02(0x2e1)](_0x2a3a5f/_0x5dcf0e),_0x48c647=_0x495889%_0x1f9837,_0x1e7af7=_0x51a085['width']*(_0x256935+0x1)/(_0x24343f+0x1);let _0x43ca91=_0x113cf5[_0x1d9c02(0x24f)]*(_0x48c647+0x1)/(_0x596991+0x1);if(_0x256935+0x1===_0x24343f){const _0x2633dd=_0x505c86-(_0x24343f-0x1)*_0x1bfbfa;_0x2633dd!==0x0&&(_0x43ca91=_0x2ad13f[_0x1d9c02(0x24f)]*(_0x48c647+0x1)/(_0x2633dd+0x1));}this['addToQueue']({'targetMoveX':_0x1e7af7,'targetMoveY':_0x43ca91,'targetAnchor':{'x':_0xe4bb35['x'],'y':_0x525772['y']},'duration':_0x1297a4,'easingType':_0x1d9c02(0x349)});}}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x264)]=function(_0x411c5a,_0x5f11dd,_0x3c6406){const _0x5209bc=_0x29bdbe;this[_0x5209bc(0x364)](),this[_0x5209bc(0x362)]({'setZ':_0x411c5a,'duration':_0x3c6406,'targetTone':_0x5f11dd['clone'](),'toneDuration':_0x3c6406});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x29d),_0x648fea=>{const _0x16eacf=_0x29bdbe;VisuMZ[_0x16eacf(0x2bb)](_0x648fea,_0x648fea);const _0x31550f=_0x648fea[_0x16eacf(0x31f)];if(_0x31550f['length']<=0x0)return;const _0x2eda0b=_0x648fea['Filename']||'';if(_0x2eda0b==='')return;let _0x27ec9e=0x0;for(const _0x5162ce of _0x31550f){const _0x391b58=$gameScreen[_0x16eacf(0x3df)](_0x5162ce);if(!_0x391b58)continue;_0x391b58[_0x16eacf(0x1d4)](_0x2eda0b),_0x27ec9e=_0x391b58[_0x16eacf(0x288)]();}if(_0x648fea[_0x16eacf(0x231)]){const _0x615efb=$gameTemp[_0x16eacf(0x28d)]();if(_0x615efb)_0x615efb['wait'](_0x27ec9e);}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x1d4)]=function(_0x3ae56c){const _0x20f8b4=_0x29bdbe;this[_0x20f8b4(0x364)]();const _0x136157=ImageManager[_0x20f8b4(0x1f8)](_0x3ae56c);_0x136157[_0x20f8b4(0x3c2)](this[_0x20f8b4(0x362)]['bind'](this,{'filename':_0x3ae56c,'duration':0x0,'easingType':_0x20f8b4(0x1ee)}));},PluginManager['registerCommand'](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x329),_0x3c7b31=>{const _0x2f9bff=_0x29bdbe;VisuMZ[_0x2f9bff(0x2bb)](_0x3c7b31,_0x3c7b31);const _0x24283f=_0x3c7b31[_0x2f9bff(0x31f)];if(_0x24283f[_0x2f9bff(0x369)]<=0x0)return;const _0x306015=_0x3c7b31['EffectIn']==='In',_0x25eeba=_0x3c7b31['Tone']||[0x44,0x44,0x80,0x0],_0x1b9349=Math['max'](Number(_0x3c7b31[_0x2f9bff(0x1fa)]),0xa);let _0x41f81d=0x0;for(const _0x47e2b5 of _0x24283f){const _0x2f3d67=$gameScreen[_0x2f9bff(0x3df)](_0x47e2b5);if(!_0x2f3d67)continue;_0x2f3d67['setupEffect_UfoInOut'](_0x306015,_0x25eeba,_0x1b9349),_0x41f81d=_0x2f3d67[_0x2f9bff(0x288)]();}if(_0x3c7b31[_0x2f9bff(0x231)]){const _0x2d6b5a=$gameTemp[_0x2f9bff(0x28d)]();if(_0x2d6b5a)_0x2d6b5a[_0x2f9bff(0x29e)](_0x41f81d);}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x336)]=function(_0x413fe8,_0x511be1,_0x4bdbb9){const _0x20f40a=_0x29bdbe;_0x4bdbb9=_0x4bdbb9||0x3c,this[_0x20f40a(0x364)](),_0x413fe8?(this[_0x20f40a(0x362)]({'moveY':0x0,'targetMoveY':this['_y'],'opacity':0x0,'targetOpacity':this[_0x20f40a(0x2ef)]||0xff,'duration':_0x4bdbb9*0.9,'tone':_0x511be1[_0x20f40a(0x266)](),'blendMode':0x1,'easingType':'InOutSine'}),this[_0x20f40a(0x362)]({'tone':[0xff,0xff,0xff,0x0],'targetTone':this['_tone']?this[_0x20f40a(0x206)][_0x20f40a(0x266)]():[0x0,0x0,0x0,0x0],'toneDuration':_0x4bdbb9*0.1,'blendMode':this[_0x20f40a(0x21b)],'duration':_0x4bdbb9*0.1})):(this[_0x20f40a(0x362)]({'targetTone':[0xff,0xff,0xff,0x0],'toneDuration':_0x4bdbb9*0.1,'duration':_0x4bdbb9*0.1,'blendMode':this[_0x20f40a(0x21b)]}),this[_0x20f40a(0x362)]({'targetMoveY':0x0,'targetOpacity':0x0,'duration':_0x4bdbb9*0.9,'targetTone':_0x511be1[_0x20f40a(0x266)](),'toneDuration':_0x4bdbb9*0.1,'blendMode':0x1,'easingType':_0x20f40a(0x349)}));},PluginManager[_0x29bdbe(0x237)](pluginData['name'],_0x29bdbe(0x31e),_0x6389da=>{const _0x4ab2fc=_0x29bdbe;VisuMZ[_0x4ab2fc(0x2bb)](_0x6389da,_0x6389da);const _0x3091e7=_0x6389da['PictureIDs'];if(_0x3091e7[_0x4ab2fc(0x369)]<=0x0)return;const _0x6a4611=Math[_0x4ab2fc(0x2ee)](Number(_0x6389da['Times']),0x1),_0x251f11=Math[_0x4ab2fc(0x2ee)](Number(_0x6389da[_0x4ab2fc(0x200)]),0x1),_0x28413b=Math['max'](Number(_0x6389da[_0x4ab2fc(0x25d)]),0x1);let _0x250c94=0x0;for(const _0x443e69 of _0x3091e7){if('MDphI'===_0x4ab2fc(0x3e7)){const _0x2c2d41=$gameScreen[_0x4ab2fc(0x3df)](_0x443e69);if(!_0x2c2d41)continue;_0x2c2d41[_0x4ab2fc(0x346)](_0x6a4611,_0x251f11,_0x28413b),_0x250c94=_0x2c2d41[_0x4ab2fc(0x288)]();}else{const _0x2a1aee=_0x50be2a(_0x34f9ca['$1']);_0x2a1aee<_0x577fb5?(_0x3611fd('%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.'[_0x4ab2fc(0x2cc)](_0x5488c1,_0x2a1aee,_0x2901b1)),_0x73e012['exit']()):_0xdfe79=_0x5d6449[_0x4ab2fc(0x2ee)](_0x2a1aee,_0x570568);}}if(_0x6389da[_0x4ab2fc(0x231)]){const _0x5e4f94=$gameTemp[_0x4ab2fc(0x28d)]();if(_0x5e4f94)_0x5e4f94[_0x4ab2fc(0x29e)](_0x250c94);}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x346)]=function(_0x5f379b,_0x3192e5,_0x1a2d7b){const _0x15ace0=_0x29bdbe;_0x5f379b=_0x5f379b||0x1,_0x3192e5=_0x3192e5??0x18,_0x1a2d7b=_0x1a2d7b??0xc,this[_0x15ace0(0x364)]();const _0x21992f=_0x5f379b/0x2;while(_0x5f379b--){if(_0x15ace0(0x3d5)!=='NUtWi'){const _0x560030=0x1-Math[_0x15ace0(0x383)](_0x5f379b-_0x21992f)/_0x21992f;this[_0x15ace0(0x362)]({'moveX':this['_x']+(Math['random']()>0.5?-0x1:0x1)*(_0x3192e5*_0x560030),'moveY':this['_y']+(Math[_0x15ace0(0x267)]()>0.5?-0x1:0x1)*(_0x1a2d7b*_0x560030),'duration':0x1,'easingType':_0x15ace0(0x1ee)});}else{const _0x2ec8e4=this['getPictureEffectsHueFilter']();if(!_0x2ec8e4[_0x15ace0(0x3ae)])return;if(_0x2ec8e4[_0x15ace0(0x2e0)]<=0x0)return;const _0xd10939=_0x2ec8e4[_0x15ace0(0x2e0)];_0x2ec8e4['hue']=(_0x2ec8e4[_0x15ace0(0x1d5)]*(_0xd10939-0x1)+_0x2ec8e4[_0x15ace0(0x2e6)])/_0xd10939,_0x2ec8e4[_0x15ace0(0x2e0)]--,_0x2ec8e4[_0x15ace0(0x2e0)]<=0x0&&(_0x2ec8e4[_0x15ace0(0x1d5)]=_0x2ec8e4[_0x15ace0(0x2e6)]);}}this[_0x15ace0(0x362)]({'moveX':this['_x'],'moveY':this['_y'],'duration':0x1});},PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],'Wobble',_0x26adfc=>{const _0x30999b=_0x29bdbe;VisuMZ['ConvertParams'](_0x26adfc,_0x26adfc);const _0x5244f7=_0x26adfc[_0x30999b(0x31f)];if(_0x5244f7[_0x30999b(0x369)]<=0x0)return;const _0x214d64=Math[_0x30999b(0x2ee)](Number(_0x26adfc['Times']),0x1),_0x387676=Math[_0x30999b(0x2ee)](Number(_0x26adfc[_0x30999b(0x20e)]),0x1);let _0x3ffa5e=0x0;for(const _0x33adde of _0x5244f7){const _0x5766a1=$gameScreen['picture'](_0x33adde);if(!_0x5766a1)continue;_0x5766a1[_0x30999b(0x2c9)](_0x214d64,_0x387676),_0x3ffa5e=_0x5766a1[_0x30999b(0x288)]();}if(_0x26adfc[_0x30999b(0x231)]){const _0x57603a=$gameTemp['getLastPluginCommandInterpreter']();if(_0x57603a)_0x57603a[_0x30999b(0x29e)](_0x3ffa5e);}}),Game_Picture[_0x29bdbe(0x353)][_0x29bdbe(0x2c9)]=function(_0xdfa508,_0x574823){const _0xe2d1af=_0x29bdbe;_0xdfa508=_0xdfa508||0xa,_0x574823=_0x574823||0xa,this[_0xe2d1af(0x364)]();while(_0xdfa508--){_0xe2d1af(0x350)!==_0xe2d1af(0x350)?(_0x2b37a5[_0xe2d1af(0x1f8)](_0x672eff),this[_0xe2d1af(0x364)](),this['addToQueue']({'targetOpacity':0x0,'duration':_0x27fb46[_0xe2d1af(0x232)](_0x419770/0x2),'easingType':_0xe2d1af(0x349)}),this[_0xe2d1af(0x362)]({'filename':_0x424074,'targetOpacity':this[_0xe2d1af(0x2ef)]||0xff,'duration':_0x17e8da[_0xe2d1af(0x2e1)](_0x5af6c3/0x2),'easingType':'InOutSine'})):(this[_0xe2d1af(0x362)]({'targetAngle':this['anglePlus']()+_0x574823,'duration':0x2,'easingType':'Linear'}),this[_0xe2d1af(0x362)]({'targetAngle':this[_0xe2d1af(0x229)]()-_0x574823,'duration':0x4,'easingType':_0xe2d1af(0x1ee)}));}this[_0xe2d1af(0x362)]({'targetAngle':this[_0xe2d1af(0x229)](),'duration':0x2});},PluginManager['registerCommand'](pluginData['name'],_0x29bdbe(0x3a4),_0x5d3c19=>{const _0xef9781=_0x29bdbe;VisuMZ[_0xef9781(0x2bb)](_0x5d3c19,_0x5d3c19);const _0x5118bc=_0x5d3c19[_0xef9781(0x31f)];if(_0x5118bc[_0xef9781(0x369)]<=0x0)return;const _0x53b3a2=Number(_0x5d3c19['Z'])||0x0;for(const _0x3306ef of _0x5118bc){const _0x452f36=$gameScreen[_0xef9781(0x3df)](_0x3306ef);if(!_0x452f36)continue;_0x452f36[_0xef9781(0x34a)](_0x53b3a2);}}),PluginManager['registerCommand'](pluginData['name'],_0x29bdbe(0x3e6),_0x1ebd6c=>{const _0x1b189b=_0x29bdbe;VisuMZ[_0x1b189b(0x2bb)](_0x1ebd6c,_0x1ebd6c);const _0x79fd47=_0x1ebd6c[_0x1b189b(0x31f)];if(_0x79fd47[_0x1b189b(0x369)]<=0x0)return;const _0x3c785f=Number(_0x1ebd6c['Z'])||0x0;for(const _0x5d506c of _0x79fd47){if(_0x1b189b(0x3f6)===_0x1b189b(0x224))this[_0x1b189b(0x362)]({'duration':0x0,'targetTone':[0x0,0x0,0x0,0x0],'toneDuration':_0x170c0e/0xa,'blendMode':0x0,'currentBlur':0x0});else{const _0x70cd5a=$gameScreen[_0x1b189b(0x3df)](_0x5d506c);if(!_0x70cd5a)continue;_0x70cd5a['setZ'](_0x3c785f);}}}),PluginManager[_0x29bdbe(0x237)](pluginData[_0x29bdbe(0x30c)],_0x29bdbe(0x2c1),_0x1a1568=>{const _0x21ba81=_0x29bdbe;VisuMZ['ConvertParams'](_0x1a1568,_0x1a1568);const _0x30c0ec=_0x1a1568['PictureIDs'];if(_0x30c0ec['length']<=0x0)return;const _0x5e64d6=_0x1a1568[_0x21ba81(0x3b6)]==='In',_0x395513=Math[_0x21ba81(0x2ee)](Number(_0x1a1568[_0x21ba81(0x1fa)]),0x1);let _0x38729b=0x0;for(const _0x33eb53 of _0x30c0ec){const _0x3a8c78=$gameScreen['picture'](_0x33eb53);if(!_0x3a8c78)continue;_0x3a8c78[_0x21ba81(0x20f)](_0x5e64d6,_0x395513),_0x38729b=_0x3a8c78[_0x21ba81(0x288)]();}if(_0x1a1568[_0x21ba81(0x231)]){const _0x585d25=$gameTemp[_0x21ba81(0x28d)]();if(_0x585d25)_0x585d25[_0x21ba81(0x29e)](_0x38729b);}}),Game_Picture[_0x29bdbe(0x353)]['setupEffect_ZoomInOut']=function(_0x38babe,_0x598d99){const _0x1c5846=_0x29bdbe;_0x598d99=_0x598d99||0x14,_0x598d99=Math[_0x1c5846(0x2ee)](_0x598d99,0xa),this['clearQueue']();if(_0x38babe){if(_0x1c5846(0x319)!==_0x1c5846(0x37c))this[_0x1c5846(0x362)]({'opacity':0x0,'scaleX':this['_scaleX']*1.5,'scaleY':this[_0x1c5846(0x1f9)]*1.5,'currentBlur':0xa,'duration':0x0}),this[_0x1c5846(0x362)]({'targetOpacity':this[_0x1c5846(0x2ef)]||0xff,'targetScaleX':this[_0x1c5846(0x257)],'targetScaleY':this[_0x1c5846(0x1f9)],'duration':_0x598d99,'targetBlur':0x0,'blurDuration':_0x598d99,'easingType':_0x1c5846(0x349)});else{const _0x550c4c=_0x5f0a3f['getLastPluginCommandInterpreter']();if(_0x550c4c)_0x550c4c['wait'](_0x1b2e05);}}else _0x1c5846(0x25f)==='ELoxC'?(_0x34acbe=_0x48d3dc||0x2,_0x153dcb=_0x1234d6||0.5,_0x517b7f=_0x350d10||0x3c,this[_0x1c5846(0x364)](),_0x37bd01?(this['addToQueue']({'anchor':{'x':0.5,'y':0.5},'currentAngle':-_0x24198f*0x168+this[_0x1c5846(0x229)](),'scaleX':this[_0x1c5846(0x257)]*_0x339151,'scaleY':this['_scaleY']*_0x5e77c1,'opacity':0x0,'duration':0x0}),this['addToQueue']({'targetAngle':this[_0x1c5846(0x229)](),'targetOpacity':this[_0x1c5846(0x2ef)]||0xff,'targetScaleX':this['_scaleX'],'targetScaleY':this[_0x1c5846(0x1f9)],'duration':_0xc61d82,'easingType':'OutSine'})):this[_0x1c5846(0x362)]({'anchor':{'x':0.5,'y':0.5},'targetAngle':_0x137950*0x168+this[_0x1c5846(0x229)](),'targetOpacity':0x0,'targetScaleX':this[_0x1c5846(0x257)]*_0x3407b6,'targetScaleY':this[_0x1c5846(0x1f9)]*_0x25416f,'duration':_0x17ad7d,'easingType':_0x1c5846(0x26f)})):this['addToQueue']({'targetOpacity':0x0,'targetScaleX':this['_scaleX']*1.5,'targetScaleY':this[_0x1c5846(0x1f9)]*1.5,'duration':_0x598d99,'targetBlur':0xa,'blurDuration':_0x598d99,'easingType':_0x1c5846(0x349)});};