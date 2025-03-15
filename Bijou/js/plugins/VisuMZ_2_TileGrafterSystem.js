//=============================================================================
// VisuStella MZ - Tile Grafter System
// VisuMZ_2_TileGrafterSystem.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_2_TileGrafterSystem = true;

var VisuMZ = VisuMZ || {};
VisuMZ.TileGrafterSystem = VisuMZ.TileGrafterSystem || {};
VisuMZ.TileGrafterSystem.version = 1.02;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 2] [Version 1.02] [TileGrafterSystem]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Tile_Grafter_System_VisuStella_MZ
 * @base VisuMZ_0_CoreEngine
 * @base VisuMZ_1_EventsMoveCore
 * @orderAfter VisuMZ_1_EventsMoveCore
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * Ever wanted to insert tiles onto one map from another in-game? And have them
 * retain those changes? The Tile Grafter System allows for exactly that, so
 * that you can make HUB-like maps containing evolving architecture overtime
 * without the need to make lots of map variants. Take them exactly or by
 * certain tile layers only.
 *
 * Features include all (but not limited to) the following:
 * 
 * * Tiles from one map can be inserted into another map via Plugin Commands in
 *   the form of tile grafting.
 * * These tiles can be inserted exactly or layer by layer depending on how you
 *   configure the Plugin Commands.
 * * Returning to maps with changed tiles will have their changes retained.
 * * Don't want these changes to be permanent? You can revert them or clean
 *   them up even.
 * * Grafting tiles can optionally work with autotiles as well.
 * * Insert shadows and even alter region IDs as well.
 * * If allowed, events from the source map can be grafted into the current map
 *   as preserved spawned events. Likewise, those spawned events can be removed
 *   when cleared or reverted.
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
 * * VisuMZ_1_EventsMoveCore
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
 * Major Changes
 * ============================================================================
 *
 * This plugin adds some new hard-coded features to RPG Maker MZ's functions.
 * The following is a list of them.
 *
 * ---
 *
 * Map Tileset Data
 * 
 * Tile Grafting will change up the tile data found present in the current map.
 * As a result, $dataMap.data will have its values changed and adjusted
 * appropriately to reflect the new changes made. This means that map collision
 * and the like will be changed, too.
 * 
 * When grafting, the tiles that will be imported from the source map will be
 * changed to whatever the current map's tileset is. This means that you CANNOT
 * use a different tilemap on a source map and expect it to remain the same
 * when inserting into the current map. Instead, it will convert whatever tiles
 * are being used into the current map's tileset instead.
 * 
 * Upon leaving and returning to the map, the tile data will remain changed
 * until reverted by a Plugin Command.
 * 
 * *NOTE* When grafting from a source map for the first time, the game will
 * need to load said map. This may cause the game to wait a few frames before
 * continuing. Therefore, it's best to preload these source maps if possible
 * using the Plugin Commands.
 * 
 * ---
 * 
 * Autotiles
 * 
 * If you decide to graft using autotiles, autotiles will be applied slightly
 * differently than how they're done in the RPG Maker MZ editor in order to
 * preserve more of the game map. This is done INTENTIONALLY and is not a bug.
 * 
 * Autotiles will only affect their own tiles and not surrounding tiles that
 * aren't matching. In the editor, some road tiles will connect to one another
 * regardless if they're the same type. That does not happen here in order to
 * make more sense in the context of the game.
 * 
 * When grafting an autotile to a coordinate, it will affect matching autotile
 * types in the surrounding 8 tiles, too. This is to make sure that all of the
 * pieces will connect properly.
 * 
 * ---
 * 
 * Grafted Events
 * 
 * If you allow grafting the event layer (L7: Events), you can spawn any
 * matching events from the source map as long as the locations coincide. These
 * events will be spawned into the map as preserved spawns.
 * 
 * When importing, if there are any normal events already existing on the
 * grafting target location, they will be preserved in order to prevent a map
 * desynchronization. Keep this in mind as you prepare for spawning. On the
 * flip side, if there are any spawned events already existing on the target
 * location, they will be despawned.
 * 
 * If you want to make sure there are no events in the grafting target area
 * before applying the grafting, use the 
 * 
 * When using the Clear and Revert Plugin Commands, currently existing spawned
 * events (if the L7: Events layer is affected) will be removed from the target
 * location. Both Clear and Revert function the same for the L7: Events layer.
 * 
 * Clear and Revert will NOT remove any already existing normal events from the
 * target location in order to ensure the game map does not desync. However, it
 * will remove any spawned events that may have wandered into the area. Due to
 * this clearing process, the "Revert" function will NOT restore any spawned
 * events that may have been removed through grafting. Keep this in mind.
 * 
 * ---
 *
 * ============================================================================
 * VisuStella MZ Compatibility
 * ============================================================================
 *
 * While this plugin is compatible with the majority of the VisuStella MZ
 * plugin library, it is not compatible with specific plugins or specific
 * features. This section will highlight the main plugins/features that will
 * not be compatible with this plugin or put focus on how the make certain
 * features compatible.
 *
 * ---
 * 
 * VisuMZ_2_LightingEffects
 * 
 * The VisuStella MZ Lighting Effects plugin has "Anti-Light" and "Auto-Light"
 * functions tied to region IDs. If these regions match a grafted tile's region
 * then the map will fade out and fade back in to properly show the newly added
 * "Anti-Light" and "Auto-Light" effects.
 * 
 * ---
 * 
 * VisuMZ_4_VisualFogs
 * 
 * The VisuStella MZ Visual Fogs plugin has fogs that can be applied to only
 * certain regions on the map. If these regions match a grafted tile's region,
 * then the map will fade out and fade back in to properly show the fog being
 * applied to that region.
 * 
 * ---
 * 
 * VisuMZ_4_VisualParallaxes
 * 
 * The VisuStella MZ Visual Parallaxes plugin has water reflections that can be
 * applied to only certain regions on the map. If these regions match a grafted
 * tile's region, then the map will fade out and fade back in to properly show
 * the parallax reflection being applied to that region.
 * 
 * ---
 * 
 * VisuMZ_5_TileD
 * 
 * This plugin does not work with TileD.
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
 * === Graft Plugin Commands ===
 * 
 * ---
 *
 * Graft: Import Tiles Exactly
 * - Import and graft exact tiles from source map to current map.
 * - Must be used on the map scene!
 * 
 *   Source Map ID:
 *   - Insert the number of the map. Use 0 for current map.
 *   - You can use JavaScript code.
 * 
 *     Source X:
 *     - Insert source map's X location to start importing from.
 *     - You can use JavaScript code.
 * 
 *     Source Y:
 *     - Insert source map's Y location to start importing from.
 *     - You can use JavaScript code.
 * 
 *   Current Map:
 * 
 *     Target X:
 *     - Insert current map's X location to import to.
 *     - You can use JavaScript code.
 * 
 *     Target Y:
 *     - Insert current map's Y location to import to.
 *     - You can use JavaScript code.
 * 
 *     Width:
 *     - What is the width of the area to import?
 *     - You can use JavaScript code.
 * 
 *     Height:
 *     - What is the height of the area to import?
 *     - You can use JavaScript code.
 * 
 *   Import Layers:
 * 
 *     L1: Ground:
 *     - Utilize this layer? This is the ground layer.
 * 
 *     L2: Lower:
 *     - Utilize this layer? This is the lower layer.
 * 
 *     L3: Middle:
 *     - Utilize this layer? This is the middle layer.
 * 
 *     L4: Upper:
 *     - Utilize this layer? This is the upper layer.
 * 
 *     L5: Shadow:
 *     - Utilize this layer? This is the shadow layer.
 * 
 *     L6: Region:
 *     - Utilize this layer? This is the region layer.
 * 
 *     L7: Events:
 *     - Utilize this layer? This is the events layer.
 *     - Existing spawned events will be cleared before grafting.
 * 
 * ---
 * 
 * Graft: Import Tiles with Autotile
 * - Import and graft with autotiles from source map to current map.
 * - Must be used on the map scene!
 * 
 *   Source Map ID:
 *   - Insert the number of the map. Use 0 for current map.
 *   - You can use JavaScript code.
 * 
 *     Source X:
 *     - Insert source map's X location to start importing from.
 *     - You can use JavaScript code.
 * 
 *     Source Y:
 *     - Insert source map's Y location to start importing from.
 *     - You can use JavaScript code.
 * 
 *   Current Map:
 * 
 *     Target X:
 *     - Insert current map's X location to import to.
 *     - You can use JavaScript code.
 * 
 *     Target Y:
 *     - Insert current map's Y location to import to.
 *     - You can use JavaScript code.
 * 
 *     Width:
 *     - What is the width of the area to import?
 *     - You can use JavaScript code.
 * 
 *     Height:
 *     - What is the height of the area to import?
 *     - You can use JavaScript code.
 * 
 *   Import Layers:
 * 
 *     L1: Ground:
 *     - Utilize this layer? This is the ground layer.
 * 
 *     L2: Lower:
 *     - Utilize this layer? This is the lower layer.
 * 
 *     L3: Middle:
 *     - Utilize this layer? This is the middle layer.
 * 
 *     L4: Upper:
 *     - Utilize this layer? This is the upper layer.
 * 
 *     L5: Shadow:
 *     - Utilize this layer? This is the shadow layer.
 * 
 *     L6: Region:
 *     - Utilize this layer? This is the region layer.
 * 
 *     L7: Events:
 *     - Utilize this layer? This is the events layer.
 *     - Existing spawned events will be cleared before grafting.
 * 
 * ---
 * 
 * === Preload Plugin Commands ===
 * 
 * ---
 * 
 * Preload: Preload Source Map
 * - Preload a source map to use for grafting.
 * - Must be used on the map scene!
 * 
 *   Source Map ID:
 *   - Insert the number of the map.
 *   - You can use JavaScript code.
 * 
 * ---
 * 
 * === Restore Plugin Commands ===
 * 
 * ---
 * 
 * Restore: Clear Tiles for Map
 * - Clears tiles on current map to empty tiles.
 * - Must be used on the map scene!
 * 
 *   Current Map:
 * 
 *     Target X:
 *     - Insert current map's X location to start clearing.
 *     - You can use JavaScript code.
 * 
 *     Target Y:
 *     - Insert current map's Y location to start clearing.
 *     - You can use JavaScript code.
 * 
 *     Width:
 *     - What is the width of the area to clear?
 *     - You can use JavaScript code.
 * 
 *     Height:
 *     - What is the height of the area to clear?
 *     - You can use JavaScript code.
 * 
 *   Clear Layers:
 * 
 *     L1: Ground:
 *     - Utilize this layer? This is the ground layer.
 * 
 *     L2: Lower:
 *     - Utilize this layer? This is the lower layer.
 * 
 *     L3: Middle:
 *     - Utilize this layer? This is the middle layer.
 * 
 *     L4: Upper:
 *     - Utilize this layer? This is the upper layer.
 * 
 *     L5: Shadow:
 *     - Utilize this layer? This is the shadow layer.
 * 
 *     L6: Region:
 *     - Utilize this layer? This is the region layer.
 * 
 *     L7: Events:
 *     - Utilize this layer? This is the events layer.
 *     - Existing spawned events will be cleared.
 * 
 * ---
 * 
 * Restore: Revert Tiles for Map
 * - Revert tiles on current map to their original tiles.
 * - Must be used on the map scene!
 * 
 *   Current Map:
 * 
 *     Target X:
 *     - Insert current map's X location to start reverting.
 *     - You can use JavaScript code.
 * 
 *     Target Y:
 *     - Insert current map's Y location to start reverting.
 *     - You can use JavaScript code.
 * 
 *     Width:
 *     - What is the width of the area to revert?
 *     - You can use JavaScript code.
 * 
 *     Height:
 *     - What is the height of the area to revert?
 *     - You can use JavaScript code.
 * 
 *   Revert Layers:
 * 
 *     L1: Ground:
 *     - Utilize this layer? This is the ground layer.
 * 
 *     L2: Lower:
 *     - Utilize this layer? This is the lower layer.
 * 
 *     L3: Middle:
 *     - Utilize this layer? This is the middle layer.
 * 
 *     L4: Upper:
 *     - Utilize this layer? This is the upper layer.
 * 
 *     L5: Shadow:
 *     - Utilize this layer? This is the shadow layer.
 * 
 *     L6: Region:
 *     - Utilize this layer? This is the region layer.
 * 
 *     L7: Events:
 *     - Utilize this layer? This is the events layer.
 *     - Existing spawned events will be cleared.
 * 
 * ---
 * 
 * === Switch Plugin Commands ===
 * 
 * ---
 * 
 * Switches: Check for Events in Area
 * - Checks area for any events of various types.
 * - Must be used on the map scene!
 * 
 *   Switches
 * 
 *     ID for Normal Events:
 *     - This switch will turn ON if any normal events are found within the
 *       target area vicinity.
 *     - OFF otherwise.
 * 
 *     ID for Non-Graft Spawns:
 *     - This switch will turn ON if any non-grafted spawned events are found
 *       within the target area vicinity.
 *     - OFF otherwise.
 * 
 *     ID for Grafted Spawns:
 *     - This switch will turn ON if any grafted spawned events are found
 *       within the target area vicinity.
 *     - OFF otherwise.
 * 
 *   Target Checked Area
 * 
 *     Target X:
 *     - Insert current map's X location to check.
 *     - You can use JavaScript code.
 * 
 *     Target Y:
 *     - Insert current map's Y location to check.
 *     - You can use JavaScript code.
 * 
 *     Width:
 *     - What is the width of the area to check?
 *     - You can use JavaScript code.
 * 
 *     Height:
 *     - What is the height of the area to check?
 *     - You can use JavaScript code.
 * 
 * ---
 *
 * ============================================================================
 * Plugin Parameters: General Settings
 * ============================================================================
 *
 * There's a single Plugin Parameter that can be adjusted here.
 *
 * ---
 *
 * Parameters
 * 
 *   Nonmatch Tileset Warning:
 *   - Turn on warnings when using nonmatching tileset IDs.
 *   - This is because when grafting, the tiles that will be imported from the
 *     source map will be changed to whatever the current map's tileset is.
 *   - This means that you CANNOT use a different tilemap on a source map and
 *     expect it to remain the same when inserting into the current map.
 *   - Instead, it will convert whatever tiles are being used into the current
 *     map's tileset instead.
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
 * * Irina
 * * Olivia
 * * Yanfly
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 * 
 * Version 1.02: August 29, 2024
 * * Compatibility Update!
 * ** Added compatibility for Core Engine's v1.84 new notetag:
 *    <Taller by x: id>.
 * 
 * Version 1.01: February 15, 2024
 * * Bug Fixes!
 * ** Fixed a function clash with the Save Core. Fix made by Olivia.
 * 
 * Version 1.00 Official Release Date: February 23, 2024
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
 * @command GraftFromTargetMap
 * @text Graft: Import Tiles Exactly
 * @desc Import and graft exact tiles from source map to current map.
 * Must be used on the map scene!
 *
 * @arg sourceMapID:eval
 * @text Source Map ID
 * @desc Insert the number of the map. Use 0 for current map.
 * You can use JavaScript code.
 * @default 0
 *
 * @arg sourceX:eval
 * @text Source X
 * @parent sourceMapID:eval
 * @desc Insert source map's X location to start importing from.
 * You can use JavaScript code.
 * @default 0
 *
 * @arg sourceY:eval
 * @text Source Y
 * @parent sourceMapID:eval
 * @desc Insert source map's Y location to start importing from.
 * You can use JavaScript code.
 * @default 0
 * 
 * @arg Target
 * @text Current Map
 *
 * @arg targetX:eval
 * @text Target X
 * @parent Target
 * @desc Insert current map's X location to import to.
 * You can use JavaScript code.
 * @default 0
 *
 * @arg targetY:eval
 * @text Target Y
 * @parent Target
 * @desc Insert current map's Y location to import to.
 * You can use JavaScript code.
 * @default 0
 * 
 * @arg width:eval
 * @text Width
 * @parent Target
 * @desc What is the width of the area to import?
 * You can use JavaScript code.
 * @default 1
 *
 * @arg height:eval
 * @text Height
 * @parent Target
 * @desc What is the height of the area to import?
 * You can use JavaScript code.
 * @default 1
 * 
 * @arg Layers
 * @text Import Layers
 *
 * @arg layer0:eval
 * @text L1: Ground
 * @parent Layers
 * @type boolean
 * @on Import
 * @off Don't Import
 * @desc Utilize this layer? This is the ground layer.
 * @default true
 *
 * @arg layer1:eval
 * @text L2: Lower
 * @parent Layers
 * @type boolean
 * @on Import
 * @off Don't Import
 * @desc Utilize this layer? This is the lower layer.
 * @default true
 *
 * @arg layer2:eval
 * @text L3: Middle
 * @parent Layers
 * @type boolean
 * @on Import
 * @off Don't Import
 * @desc Utilize this layer? This is the middle layer.
 * @default true
 *
 * @arg layer3:eval
 * @text L4: Upper
 * @parent Layers
 * @type boolean
 * @on Import
 * @off Don't Import
 * @desc Utilize this layer? This is the upper layer.
 * @default true
 *
 * @arg layer4:eval
 * @text L5: Shadow
 * @parent Layers
 * @type boolean
 * @on Import
 * @off Don't Import
 * @desc Utilize this layer? This is the shadow layer.
 * @default true
 *
 * @arg layer5:eval
 * @text L6: Region
 * @parent Layers
 * @type boolean
 * @on Import
 * @off Don't Import
 * @desc Utilize this layer? This is the region layer.
 * @default true
 *
 * @arg layer6:eval
 * @text L7: Events
 * @parent Layers
 * @type boolean
 * @on Import
 * @off Don't Import
 * @desc Utilize this layer? This is the events layer.
 * Existing spawned events will be cleared before grafting.
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command GraftAutotile
 * @text Graft: Import Tiles with Autotile
 * @desc Import and graft with autotiles from source map to current map.
 * Must be used on the map scene!
 *
 * @arg sourceMapID:eval
 * @text Source Map ID
 * @desc Insert the number of the map. Use 0 for current map.
 * You can use JavaScript code.
 * @default 0
 *
 * @arg sourceX:eval
 * @text Source X
 * @parent sourceMapID:eval
 * @desc Insert source map's X location to start importing from.
 * You can use JavaScript code.
 * @default 0
 *
 * @arg sourceY:eval
 * @text Source Y
 * @parent sourceMapID:eval
 * @desc Insert source map's Y location to start importing from.
 * You can use JavaScript code.
 * @default 0
 * 
 * @arg Target
 * @text Current Map
 *
 * @arg targetX:eval
 * @text Target X
 * @parent Target
 * @desc Insert current map's X location to import to.
 * You can use JavaScript code.
 * @default 0
 *
 * @arg targetY:eval
 * @text Target Y
 * @parent Target
 * @desc Insert current map's Y location to import to.
 * You can use JavaScript code.
 * @default 0
 * 
 * @arg width:eval
 * @text Width
 * @parent Target
 * @desc What is the width of the area to import?
 * You can use JavaScript code.
 * @default 1
 *
 * @arg height:eval
 * @text Height
 * @parent Target
 * @desc What is the height of the area to import?
 * You can use JavaScript code.
 * @default 1
 * 
 * @arg Layers
 * @text Import Layers
 *
 * @arg layer0:eval
 * @text L1: Ground
 * @parent Layers
 * @type boolean
 * @on Import
 * @off Don't Import
 * @desc Utilize this layer? This is the ground layer.
 * @default true
 *
 * @arg layer1:eval
 * @text L2: Lower
 * @parent Layers
 * @type boolean
 * @on Import
 * @off Don't Import
 * @desc Utilize this layer? This is the lower layer.
 * @default true
 *
 * @arg layer2:eval
 * @text L3: Middle
 * @parent Layers
 * @type boolean
 * @on Import
 * @off Don't Import
 * @desc Utilize this layer? This is the middle layer.
 * @default true
 *
 * @arg layer3:eval
 * @text L4: Upper
 * @parent Layers
 * @type boolean
 * @on Import
 * @off Don't Import
 * @desc Utilize this layer? This is the upper layer.
 * @default true
 *
 * @arg layer4:eval
 * @text L5: Shadow
 * @parent Layers
 * @type boolean
 * @on Import
 * @off Don't Import
 * @desc Utilize this layer? This is the shadow layer.
 * @default true
 *
 * @arg layer5:eval
 * @text L6: Region
 * @parent Layers
 * @type boolean
 * @on Import
 * @off Don't Import
 * @desc Utilize this layer? This is the region layer.
 * @default true
 *
 * @arg layer6:eval
 * @text L7: Events
 * @parent Layers
 * @type boolean
 * @on Import
 * @off Don't Import
 * @desc Utilize this layer? This is the events layer.
 * Existing spawned events will be cleared before grafting.
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Preload
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command PreloadGraftMap
 * @text Preload: Preload Source Map
 * @desc Preload a source map to use for grafting.
 * Must be used on the map scene!
 *
 * @arg sourceMapID:eval
 * @text Source Map ID
 * @desc Insert the number of the map.
 * You can use JavaScript code.
 * @default 1
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Restore
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command GraftClearTiles
 * @text Restore: Clear Tiles for Map
 * @desc Clears tiles on current map to empty tiles.
 * Must be used on the map scene!
 *
 * @arg Target
 * @text Current Map
 *
 * @arg targetX:eval
 * @text Target X
 * @parent Target
 * @desc Insert current map's X location to start clearing.
 * You can use JavaScript code.
 * @default 0
 *
 * @arg targetY:eval
 * @text Target Y
 * @parent Target
 * @desc Insert current map's Y location to start clearing.
 * You can use JavaScript code.
 * @default 0
 * 
 * @arg width:eval
 * @text Width
 * @parent Target
 * @desc What is the width of the area to clear?
 * You can use JavaScript code.
 * @default 1
 *
 * @arg height:eval
 * @text Height
 * @parent Target
 * @desc What is the height of the area to clear?
 * You can use JavaScript code.
 * @default 1
 * 
 * @arg Layers
 * @text Clear Layers
 *
 * @arg layer0:eval
 * @text L1: Ground
 * @parent Layers
 * @type boolean
 * @on Clear
 * @off Don't Clear
 * @desc Utilize this layer? This is the ground layer.
 * @default true
 *
 * @arg layer1:eval
 * @text L2: Lower
 * @parent Layers
 * @type boolean
 * @on Clear
 * @off Don't Clear
 * @desc Utilize this layer? This is the lower layer.
 * @default true
 *
 * @arg layer2:eval
 * @text L3: Middle
 * @parent Layers
 * @type boolean
 * @on Clear
 * @off Don't Clear
 * @desc Utilize this layer? This is the middle layer.
 * @default true
 *
 * @arg layer3:eval
 * @text L4: Upper
 * @parent Layers
 * @type boolean
 * @on Clear
 * @off Don't Clear
 * @desc Utilize this layer? This is the upper layer.
 * @default true
 *
 * @arg layer4:eval
 * @text L5: Shadow
 * @parent Layers
 * @type boolean
 * @on Clear
 * @off Don't Clear
 * @desc Utilize this layer? This is the shadow layer.
 * @default true
 *
 * @arg layer5:eval
 * @text L6: Region
 * @parent Layers
 * @type boolean
 * @on Clear
 * @off Don't Clear
 * @desc Utilize this layer? This is the region layer.
 * @default true
 *
 * @arg layer6:eval
 * @text L7: Events
 * @parent Layers
 * @type boolean
 * @on Clear
 * @off Don't Clear
 * @desc Utilize this layer? This is the events layer.
 * Existing spawned events will be cleared.
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command GraftRevertTiles
 * @text Restore: Revert Tiles for Map
 * @desc Revert tiles on current map to their original tiles.
 * Must be used on the map scene!
 *
 * @arg Target
 * @text Current Map
 *
 * @arg targetX:eval
 * @text Target X
 * @parent Target
 * @desc Insert current map's X location to start reverting.
 * You can use JavaScript code.
 * @default 0
 *
 * @arg targetY:eval
 * @text Target Y
 * @parent Target
 * @desc Insert current map's Y location to start reverting.
 * You can use JavaScript code.
 * @default 0
 * 
 * @arg width:eval
 * @text Width
 * @parent Target
 * @desc What is the width of the area to revert?
 * You can use JavaScript code.
 * @default 1
 *
 * @arg height:eval
 * @text Height
 * @parent Target
 * @desc What is the height of the area to revert?
 * You can use JavaScript code.
 * @default 1
 * 
 * @arg Layers
 * @text Revert Layers
 *
 * @arg layer0:eval
 * @text L1: Ground
 * @parent Layers
 * @type boolean
 * @on Revert
 * @off Don't Revert
 * @desc Utilize this layer? This is the ground layer.
 * @default true
 *
 * @arg layer1:eval
 * @text L2: Lower
 * @parent Layers
 * @type boolean
 * @on Revert
 * @off Don't Revert
 * @desc Utilize this layer? This is the lower layer.
 * @default true
 *
 * @arg layer2:eval
 * @text L3: Middle
 * @parent Layers
 * @type boolean
 * @on Revert
 * @off Don't Revert
 * @desc Utilize this layer? This is the middle layer.
 * @default true
 *
 * @arg layer3:eval
 * @text L4: Upper
 * @parent Layers
 * @type boolean
 * @on Revert
 * @off Don't Revert
 * @desc Utilize this layer? This is the upper layer.
 * @default true
 *
 * @arg layer4:eval
 * @text L5: Shadow
 * @parent Layers
 * @type boolean
 * @on Revert
 * @off Don't Revert
 * @desc Utilize this layer? This is the shadow layer.
 * @default true
 *
 * @arg layer5:eval
 * @text L6: Region
 * @parent Layers
 * @type boolean
 * @on Revert
 * @off Don't Revert
 * @desc Utilize this layer? This is the region layer.
 * @default true
 *
 * @arg layer6:eval
 * @text L7: Events
 * @parent Layers
 * @type boolean
 * @on Revert
 * @off Don't Revert
 * @desc Utilize this layer? This is the events layer.
 * Existing spawned events will be cleared.
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Switches
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command SwitchCheckEvents
 * @text Switches: Check for Events in Area
 * @desc Checks area for any events of various types.
 * Must be used on the map scene!
 * 
 * @arg Switches
 * 
 * @arg SwitchID_Normals:num
 * @text ID for Normal Events
 * @parent Switches
 * @type switch
 * @desc This switch will turn ON if any normal events are found
 * within the target area vicinity. OFF otherwise.
 * @default 1
 * 
 * @arg SwitchID_Spawns:num
 * @text ID for Non-Graft Spawns
 * @parent Switches
 * @type switch
 * @desc This switch will turn ON if any non-grafted spawned events
 * are found within the target area vicinity. OFF otherwise.
 * @default 2
 * 
 * @arg SwitchID_Graft:num
 * @text ID for Grafted Spawns
 * @parent Switches
 * @type switch
 * @desc This switch will turn ON if any grafted spawned events
 * are found within the target area vicinity. OFF otherwise.
 * @default 3
 *
 * @arg Target
 * @text Target Checked Area
 *
 * @arg targetX:eval
 * @text Target X
 * @parent Target
 * @desc Insert current map's X location to check.
 * You can use JavaScript code.
 * @default 0
 *
 * @arg targetY:eval
 * @text Target Y
 * @parent Target
 * @desc Insert current map's Y location to check.
 * You can use JavaScript code.
 * @default 0
 * 
 * @arg width:eval
 * @text Width
 * @parent Target
 * @desc What is the width of the area to check?
 * You can use JavaScript code.
 * @default 1
 *
 * @arg height:eval
 * @text Height
 * @parent Target
 * @desc What is the height of the area to check?
 * You can use JavaScript code.
 * @default 1
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
 * @param TileGrafterSystem
 * @default Plugin Parameters
 *
 * @param ATTENTION
 * @default READ THE HELP FILE
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param Warning:eval
 * @text Nonmatch Tileset Warning
 * @type boolean
 * @on ON
 * @off OFF
 * @desc Turn on warnings when using nonmatching tileset IDs.
 * @default true
 *
 * @param BreakEnd1
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param End Of
 * @default Plugin Parameters
 *
 * @param BreakEnd2
 * @text --------------------------
 * @default ----------------------------------
 *
 */
//=============================================================================

const _0x112be7=_0x522d;(function(_0x386577,_0x4890f3){const _0x21ec4c=_0x522d,_0x430c0c=_0x386577();while(!![]){try{const _0x5b86b5=parseInt(_0x21ec4c(0x114))/0x1*(-parseInt(_0x21ec4c(0xf2))/0x2)+-parseInt(_0x21ec4c(0x169))/0x3*(parseInt(_0x21ec4c(0x174))/0x4)+parseInt(_0x21ec4c(0x182))/0x5*(-parseInt(_0x21ec4c(0x14b))/0x6)+-parseInt(_0x21ec4c(0xf4))/0x7*(-parseInt(_0x21ec4c(0x17c))/0x8)+-parseInt(_0x21ec4c(0x17e))/0x9*(parseInt(_0x21ec4c(0x186))/0xa)+-parseInt(_0x21ec4c(0x11d))/0xb*(parseInt(_0x21ec4c(0x121))/0xc)+parseInt(_0x21ec4c(0x17b))/0xd;if(_0x5b86b5===_0x4890f3)break;else _0x430c0c['push'](_0x430c0c['shift']());}catch(_0x87c8a7){_0x430c0c['push'](_0x430c0c['shift']());}}}(_0x3275,0xa25e7));function _0x522d(_0x29893a,_0x4119ad){const _0x327569=_0x3275();return _0x522d=function(_0x522d33,_0x206552){_0x522d33=_0x522d33-0xcc;let _0x177fe5=_0x327569[_0x522d33];return _0x177fe5;},_0x522d(_0x29893a,_0x4119ad);}var label=_0x112be7(0x122),tier=tier||0x0,dependencies=['VisuMZ_0_CoreEngine','VisuMZ_1_EventsMoveCore'],pluginData=$plugins['filter'](function(_0x3ded0b){const _0x1689a3=_0x112be7;return _0x3ded0b[_0x1689a3(0xe9)]&&_0x3ded0b['description']['includes']('['+label+']');})[0x0];VisuMZ[label][_0x112be7(0xd7)]=VisuMZ[label]['Settings']||{},VisuMZ[_0x112be7(0x18e)]=function(_0x159425,_0x235bd2){const _0x1f0d19=_0x112be7;for(const _0x3cc641 in _0x235bd2){if(_0x3cc641[_0x1f0d19(0x196)](/(.*):(.*)/i)){const _0xb59f1f=String(RegExp['$1']),_0x5e0fb5=String(RegExp['$2'])[_0x1f0d19(0x13f)]()[_0x1f0d19(0x107)]();let _0x4010d5,_0x186a59,_0x4baac7;switch(_0x5e0fb5){case _0x1f0d19(0x198):_0x4010d5=_0x235bd2[_0x3cc641]!==''?Number(_0x235bd2[_0x3cc641]):0x0;break;case'ARRAYNUM':_0x186a59=_0x235bd2[_0x3cc641]!==''?JSON['parse'](_0x235bd2[_0x3cc641]):[],_0x4010d5=_0x186a59['map'](_0x16c52e=>Number(_0x16c52e));break;case _0x1f0d19(0x152):_0x4010d5=_0x235bd2[_0x3cc641]!==''?eval(_0x235bd2[_0x3cc641]):null;break;case'ARRAYEVAL':_0x186a59=_0x235bd2[_0x3cc641]!==''?JSON[_0x1f0d19(0x18a)](_0x235bd2[_0x3cc641]):[],_0x4010d5=_0x186a59[_0x1f0d19(0x10b)](_0x5a3f2e=>eval(_0x5a3f2e));break;case _0x1f0d19(0x125):_0x4010d5=_0x235bd2[_0x3cc641]!==''?JSON[_0x1f0d19(0x18a)](_0x235bd2[_0x3cc641]):'';break;case'ARRAYJSON':_0x186a59=_0x235bd2[_0x3cc641]!==''?JSON[_0x1f0d19(0x18a)](_0x235bd2[_0x3cc641]):[],_0x4010d5=_0x186a59[_0x1f0d19(0x10b)](_0x54adfb=>JSON['parse'](_0x54adfb));break;case _0x1f0d19(0x129):_0x4010d5=_0x235bd2[_0x3cc641]!==''?new Function(JSON[_0x1f0d19(0x18a)](_0x235bd2[_0x3cc641])):new Function(_0x1f0d19(0x153));break;case _0x1f0d19(0x106):_0x186a59=_0x235bd2[_0x3cc641]!==''?JSON['parse'](_0x235bd2[_0x3cc641]):[],_0x4010d5=_0x186a59[_0x1f0d19(0x10b)](_0x557018=>new Function(JSON[_0x1f0d19(0x18a)](_0x557018)));break;case _0x1f0d19(0x11f):_0x4010d5=_0x235bd2[_0x3cc641]!==''?String(_0x235bd2[_0x3cc641]):'';break;case _0x1f0d19(0x180):_0x186a59=_0x235bd2[_0x3cc641]!==''?JSON[_0x1f0d19(0x18a)](_0x235bd2[_0x3cc641]):[],_0x4010d5=_0x186a59['map'](_0x3b6c9c=>String(_0x3b6c9c));break;case _0x1f0d19(0x111):_0x4baac7=_0x235bd2[_0x3cc641]!==''?JSON['parse'](_0x235bd2[_0x3cc641]):{},_0x4010d5=VisuMZ[_0x1f0d19(0x18e)]({},_0x4baac7);break;case'ARRAYSTRUCT':_0x186a59=_0x235bd2[_0x3cc641]!==''?JSON['parse'](_0x235bd2[_0x3cc641]):[],_0x4010d5=_0x186a59['map'](_0x8559b1=>VisuMZ[_0x1f0d19(0x18e)]({},JSON['parse'](_0x8559b1)));break;default:continue;}_0x159425[_0xb59f1f]=_0x4010d5;}}return _0x159425;},(_0x1f5981=>{const _0x3e39ef=_0x112be7,_0x19769d=_0x1f5981[_0x3e39ef(0x155)];for(const _0x10b0da of dependencies){if(!Imported[_0x10b0da]){alert(_0x3e39ef(0xf6)['format'](_0x19769d,_0x10b0da)),SceneManager[_0x3e39ef(0x10a)]();break;}}const _0x3fa702=_0x1f5981[_0x3e39ef(0x15f)];if(_0x3fa702[_0x3e39ef(0x196)](/\[Version[ ](.*?)\]/i)){const _0x598a57=Number(RegExp['$1']);_0x598a57!==VisuMZ[label]['version']&&(alert(_0x3e39ef(0xd2)[_0x3e39ef(0x165)](_0x19769d,_0x598a57)),SceneManager['exit']());}if(_0x3fa702[_0x3e39ef(0x196)](/\[Tier[ ](\d+)\]/i)){const _0x13617e=Number(RegExp['$1']);_0x13617e<tier?(alert(_0x3e39ef(0x14d)[_0x3e39ef(0x165)](_0x19769d,_0x13617e,tier)),SceneManager['exit']()):tier=Math[_0x3e39ef(0x115)](_0x13617e,tier);}VisuMZ[_0x3e39ef(0x18e)](VisuMZ[label]['Settings'],_0x1f5981[_0x3e39ef(0x147)]);})(pluginData);if(VisuMZ['CoreEngine']['version']<1.7){let text='';text+=_0x112be7(0xef),text+=_0x112be7(0xe8),alert(text),SceneManager[_0x112be7(0x10a)]();}if(VisuMZ['EventsMoveCore']['version']<1.54){let text='';text+=_0x112be7(0x138),text+=_0x112be7(0xe8),alert(text),SceneManager[_0x112be7(0x10a)]();}VisuMZ[_0x112be7(0x122)][_0x112be7(0x118)]=function(_0x388db2){const _0xc35808=_0x112be7,_0x1cb9ca=[];for(let _0x16b3a6=0x0;_0x16b3a6<=0x6;_0x16b3a6++){const _0x1066cc='layer%1'['format'](_0x16b3a6);if(_0x388db2[_0x1066cc])_0x1cb9ca[_0xc35808(0x113)](_0x16b3a6);}return _0x1cb9ca;},PluginManager[_0x112be7(0xed)](pluginData[_0x112be7(0x155)],_0x112be7(0x140),_0x4fb643=>{const _0x40b316=_0x112be7;if(!SceneManager[_0x40b316(0x15a)]())return;VisuMZ[_0x40b316(0x18e)](_0x4fb643,_0x4fb643);const _0x12936f={'sourceMapID':_0x4fb643[_0x40b316(0x108)]||$gameMap['mapId'](),'sourceX':Number(_0x4fb643[_0x40b316(0x194)]||0x0),'sourceY':Number(_0x4fb643['sourceY']||0x0),'targetX':Number(_0x4fb643[_0x40b316(0xe3)]||0x0),'targetY':Number(_0x4fb643[_0x40b316(0x178)]||0x0),'width':Number(_0x4fb643[_0x40b316(0x112)]||0x0),'height':Number(_0x4fb643[_0x40b316(0x175)]||0x0),'autotile':!!(_0x4fb643[_0x40b316(0xdf)]||![]),'layers':VisuMZ[_0x40b316(0x122)][_0x40b316(0x118)](_0x4fb643)},_0x4e0d68=$gameTemp[_0x40b316(0x199)]();if(_0x4e0d68){$gameMap[_0x40b316(0xf8)](_0x12936f);if($graftMap){$gameMap['performTileGraftingFromMap']();if(SceneManager[_0x40b316(0x176)]())_0x4e0d68[_0x40b316(0xdb)](0x1);}else _0x4e0d68['setWaitMode'](_0x40b316(0xd5));}}),PluginManager[_0x112be7(0xed)](pluginData[_0x112be7(0x155)],_0x112be7(0x124),_0x3e8647=>{const _0x2370f3=_0x112be7;if(!SceneManager[_0x2370f3(0x15a)]())return;VisuMZ[_0x2370f3(0x18e)](_0x3e8647,_0x3e8647);const _0x1d2408={'sourceMapID':_0x3e8647[_0x2370f3(0x108)]||$gameMap[_0x2370f3(0x185)](),'sourceX':Number(_0x3e8647[_0x2370f3(0x194)]||0x0),'sourceY':Number(_0x3e8647[_0x2370f3(0x145)]||0x0),'targetX':Number(_0x3e8647['targetX']||0x0),'targetY':Number(_0x3e8647[_0x2370f3(0x178)]||0x0),'width':Number(_0x3e8647[_0x2370f3(0x112)]||0x0),'height':Number(_0x3e8647['height']||0x0),'autotile':!![],'layers':VisuMZ[_0x2370f3(0x122)][_0x2370f3(0x118)](_0x3e8647)},_0x29159a=$gameTemp[_0x2370f3(0x199)]();if(_0x29159a){$gameMap[_0x2370f3(0xf8)](_0x1d2408);if($graftMap){$gameMap[_0x2370f3(0xd0)]();if(SceneManager[_0x2370f3(0x176)]())_0x29159a[_0x2370f3(0xdb)](0x1);}else _0x29159a[_0x2370f3(0x120)](_0x2370f3(0xd5));}}),PluginManager[_0x112be7(0xed)](pluginData['name'],_0x112be7(0xf3),_0x4c948b=>{const _0x3d176d=_0x112be7;if(!SceneManager[_0x3d176d(0x15a)]())return;VisuMZ[_0x3d176d(0x18e)](_0x4c948b,_0x4c948b);const _0x397138=_0x4c948b[_0x3d176d(0x108)]||$gameMap['mapId']();if(!_0x397138)return;const _0x392088=$gameTemp['getLastPluginCommandInterpreter']();_0x392088&&($graftMap=null,$gameTemp[_0x3d176d(0x171)]=_0x397138,DataManager[_0x3d176d(0xee)](_0x397138),_0x392088['setWaitMode'](_0x3d176d(0xe0)));}),PluginManager[_0x112be7(0xed)](pluginData[_0x112be7(0x155)],_0x112be7(0x15c),_0x495845=>{const _0x3ad653=_0x112be7;if(!SceneManager[_0x3ad653(0x15a)]())return;VisuMZ['ConvertParams'](_0x495845,_0x495845);const _0x221b92={'targetX':_0x495845[_0x3ad653(0xe3)]||0x0,'targetY':_0x495845[_0x3ad653(0x178)]||0x0,'width':_0x495845[_0x3ad653(0x112)]||0x0,'height':_0x495845['height']||0x0,'layers':VisuMZ[_0x3ad653(0x122)][_0x3ad653(0x118)](_0x495845)};$gameMap[_0x3ad653(0x123)](_0x221b92);const _0x5a2e82=$gameTemp[_0x3ad653(0x199)]();_0x5a2e82&&SceneManager[_0x3ad653(0x176)]()&&_0x5a2e82[_0x3ad653(0xdb)](0x1);}),PluginManager[_0x112be7(0xed)](pluginData[_0x112be7(0x155)],_0x112be7(0x102),_0x5e6b8e=>{const _0x5e3819=_0x112be7;if(!SceneManager['isInstanceOfSceneMap']())return;VisuMZ[_0x5e3819(0x18e)](_0x5e6b8e,_0x5e6b8e);const _0x2b99d9={'targetX':_0x5e6b8e[_0x5e3819(0xe3)]||0x0,'targetY':_0x5e6b8e[_0x5e3819(0x178)]||0x0,'width':_0x5e6b8e[_0x5e3819(0x112)]||0x0,'height':_0x5e6b8e[_0x5e3819(0x175)]||0x0,'layers':VisuMZ[_0x5e3819(0x122)]['GetAffectedLayers'](_0x5e6b8e)};$gameMap[_0x5e3819(0x10d)](_0x2b99d9);const _0x589c9b=$gameTemp[_0x5e3819(0x199)]();_0x589c9b&&SceneManager[_0x5e3819(0x176)]()&&_0x589c9b[_0x5e3819(0xdb)](0x1);}),PluginManager[_0x112be7(0xed)](pluginData[_0x112be7(0x155)],_0x112be7(0x161),_0x19a5bb=>{const _0x3d854e=_0x112be7;if(!SceneManager[_0x3d854e(0x15a)]())return;VisuMZ[_0x3d854e(0x18e)](_0x19a5bb,_0x19a5bb);const _0x101746=Number(_0x19a5bb[_0x3d854e(0xe3)]||0x0),_0x3235da=Number(_0x19a5bb['targetY']||0x0),_0x55a21b=Number(_0x19a5bb[_0x3d854e(0x112)]||0x0),_0x1acc93=Number(_0x19a5bb['height']||0x0),_0x121c4f={'normal':_0x19a5bb[_0x3d854e(0x139)]||0x0,'spawned':_0x19a5bb[_0x3d854e(0x146)]||0x0,'grafted':_0x19a5bb[_0x3d854e(0x13d)]||0x0};_0x121c4f[_0x3d854e(0x11b)]>0x0&&$gameSwitches[_0x3d854e(0x162)](_0x121c4f[_0x3d854e(0x11b)],VisuMZ['TileGrafterSystem'][_0x3d854e(0x133)](_0x101746,_0x3235da,_0x55a21b,_0x1acc93)),_0x121c4f[_0x3d854e(0x11e)]>0x0&&$gameSwitches[_0x3d854e(0x162)](_0x121c4f['spawned'],VisuMZ[_0x3d854e(0x122)][_0x3d854e(0x148)](_0x101746,_0x3235da,_0x55a21b,_0x1acc93)),_0x121c4f['grafted']>0x0&&$gameSwitches['setValue'](_0x121c4f[_0x3d854e(0x104)],VisuMZ[_0x3d854e(0x122)][_0x3d854e(0x137)](_0x101746,_0x3235da,_0x55a21b,_0x1acc93));}),VisuMZ[_0x112be7(0x122)][_0x112be7(0x133)]=function(_0x383b5a,_0x4bf735,_0x494cb5,_0x4e2720){const _0x4cc6fd=_0x112be7,_0x3dcb1b=_0x383b5a+_0x494cb5,_0x1cd35d=_0x4bf735+_0x4e2720;for(let _0x2ea06a=_0x383b5a;_0x2ea06a<=_0x3dcb1b;_0x2ea06a++){for(let _0x2af995=_0x4bf735;_0x2af995<=_0x1cd35d;_0x2af995++){const _0x2358d9=$gameMap[_0x4cc6fd(0xd9)](_0x2ea06a,_0x2af995);if(_0x2358d9[_0x4cc6fd(0x16a)](_0x50dc16=>!!_0x50dc16&&!_0x50dc16[_0x4cc6fd(0x167)]()))return!![];}}return![];},VisuMZ['TileGrafterSystem'][_0x112be7(0x148)]=function(_0x6e0fb6,_0x6e096b,_0x2b3069,_0x1ee6ec){const _0x30ae35=_0x112be7,_0x1bd46f=_0x6e0fb6+_0x2b3069,_0x433b5a=_0x6e096b+_0x1ee6ec;for(let _0x5f03cf=_0x6e0fb6;_0x5f03cf<=_0x1bd46f;_0x5f03cf++){for(let _0x553204=_0x6e096b;_0x553204<=_0x433b5a;_0x553204++){const _0x34e2d9=$gameMap[_0x30ae35(0xd9)](_0x5f03cf,_0x553204);if(_0x34e2d9[_0x30ae35(0x16a)](_0x3cc770=>!!_0x3cc770&&_0x3cc770[_0x30ae35(0x167)]()&&!_0x3cc770['isSpawnedGraftedEvent']()))return!![];}}return![];},VisuMZ[_0x112be7(0x122)][_0x112be7(0x137)]=function(_0x531844,_0x4bb850,_0x31e743,_0xd3cca5){const _0x5a4c20=_0x112be7,_0x3fa575=_0x531844+_0x31e743,_0x62c6cc=_0x4bb850+_0xd3cca5;for(let _0x5b781b=_0x531844;_0x5b781b<=_0x3fa575;_0x5b781b++){for(let _0x16cb81=_0x4bb850;_0x16cb81<=_0x62c6cc;_0x16cb81++){const _0x3c87ed=$gameMap[_0x5a4c20(0xd9)](_0x5b781b,_0x16cb81);if(_0x3c87ed[_0x5a4c20(0x16a)](_0x5063e5=>!!_0x5063e5&&_0x5063e5[_0x5a4c20(0xf1)]()))return!![];}}return![];},VisuMZ[_0x112be7(0x122)][_0x112be7(0x190)]=Scene_Boot[_0x112be7(0x105)][_0x112be7(0x12a)],Scene_Boot[_0x112be7(0x105)][_0x112be7(0x12a)]=function(){const _0x5baf69=_0x112be7;VisuMZ[_0x5baf69(0x122)][_0x5baf69(0x190)]['call'](this),VisuMZ[_0x5baf69(0x122)][_0x5baf69(0x109)]();},VisuMZ[_0x112be7(0x122)][_0x112be7(0x109)]=function(){const _0x1ed0ef=_0x112be7;if(Imported[_0x1ed0ef(0x173)]&&VisuMZ[_0x1ed0ef(0xea)][_0x1ed0ef(0x17d)]<1.06){let _0x4d5511='';_0x4d5511+='VisuMZ_2_LightingEffects\x20needs\x20to\x20be\x20updated\x20',_0x4d5511+=_0x1ed0ef(0xe8),alert(_0x4d5511),SceneManager[_0x1ed0ef(0x10a)]();}if(Imported[_0x1ed0ef(0x15e)]&&VisuMZ[_0x1ed0ef(0x134)][_0x1ed0ef(0x17d)]<1.1){let _0x3029a7='';_0x3029a7+='VisuMZ_4_VisualFogs\x20needs\x20to\x20be\x20updated\x20',_0x3029a7+=_0x1ed0ef(0xe8),alert(_0x3029a7),SceneManager[_0x1ed0ef(0x10a)]();}if(Imported[_0x1ed0ef(0xda)]&&VisuMZ['VisualParallaxes']['version']<1.1){let _0x495967='';_0x495967+=_0x1ed0ef(0x181),_0x495967+=_0x1ed0ef(0xe8),alert(_0x495967),SceneManager[_0x1ed0ef(0x10a)]();}if(Imported[_0x1ed0ef(0x103)]){let _0x2bb85e='';_0x2bb85e+=_0x1ed0ef(0x17f),alert(_0x2bb85e),SceneManager[_0x1ed0ef(0x10a)]();}},$graftMap=null,$graftMaps={},DataManager['loadGraftMapData']=function(_0x4e72b0){const _0x4b17fa=_0x112be7;$graftMap=null;if(_0x4e72b0<=0x0)return;if($graftMaps[_0x4e72b0])$graftMap=$graftMaps[_0x4e72b0];else{$gameTemp[_0x4b17fa(0x171)]=_0x4e72b0;const _0x2197f4=_0x4b17fa(0xf0)['format'](_0x4e72b0[_0x4b17fa(0x150)](0x3));this[_0x4b17fa(0x16d)](_0x4b17fa(0x192),_0x2197f4);}},DataManager[_0x112be7(0x157)]=function(){const _0x3df978=_0x112be7,_0x29387f=$gameTemp['_graftMapID'];$graftMaps[_0x29387f]=JSON[_0x3df978(0x18a)](JSON[_0x3df978(0x163)]($graftMap));},SceneManager['refreshGraftedTilemap']=function(){const _0x60ed3f=_0x112be7;if(!this[_0x60ed3f(0x15a)]())return;const _0x97df06=this['_scene'];if(!_0x97df06)return;this['needsFullRefreshForGrafter']()?(SceneManager[_0x60ed3f(0xde)]['startTileGraftFadeOut'](),SceneManager[_0x60ed3f(0x113)](Scene_GrafterReset)):this[_0x60ed3f(0x12d)]();},SceneManager[_0x112be7(0x176)]=function(){const _0x2d15ac=_0x112be7,_0x55d540=$gameMap[_0x2d15ac(0x131)]||[],_0x2288a7=this[_0x2d15ac(0xde)][_0x2d15ac(0xe2)]||[];return _0x55d540[_0x2d15ac(0x16a)](_0xcf65e1=>_0x2288a7[_0x2d15ac(0x119)](_0xcf65e1));},SceneManager[_0x112be7(0x12d)]=function(){const _0x555437=_0x112be7,_0x463f28=this[_0x555437(0xde)][_0x555437(0x12b)];if(!_0x463f28)return;const _0x2340fd=_0x463f28[_0x555437(0x132)];if(!_0x2340fd)return;_0x2340fd[_0x555437(0x11a)]();},Game_Map['prototype'][_0x112be7(0xff)]=function(_0x27b9c9,_0x48ed09,_0x1214f4){const _0x18096e=_0x112be7,_0x377455=_0x27b9c9,_0x24e582=_0x48ed09*this[_0x18096e(0x112)](),_0x3c469c=_0x1214f4*this[_0x18096e(0x112)]()*this[_0x18096e(0x175)]();return _0x377455+_0x24e582+_0x3c469c;},VisuMZ[_0x112be7(0x122)]['getGraftTileIndex']=function(_0x399100,_0x525cf1,_0x2c2f78){const _0x19bc33=_0x112be7,_0x2e5fe2=_0x399100,_0x4a1cdd=_0x525cf1*$graftMap[_0x19bc33(0x112)],_0x15d3bd=_0x2c2f78*$graftMap[_0x19bc33(0x112)]*$graftMap[_0x19bc33(0x175)];return _0x2e5fe2+_0x4a1cdd+_0x15d3bd;},VisuMZ['TileGrafterSystem'][_0x112be7(0xdc)]=Game_Map[_0x112be7(0x105)][_0x112be7(0xfd)],Game_Map[_0x112be7(0x105)][_0x112be7(0xfd)]=function(_0x2c4ca3){const _0x9640ae=_0x112be7;this['refreshGraftTilemapIfNeeded'](),VisuMZ['TileGrafterSystem'][_0x9640ae(0xdc)][_0x9640ae(0x135)](this,_0x2c4ca3);},Game_Map[_0x112be7(0x105)]['requestGraftedTilemapRefresh']=function(){this['_needsGraftTilemapRefresh']=!![];},Game_Map[_0x112be7(0x105)][_0x112be7(0x143)]=function(_0x42e157,_0x2ad3ff){const _0xce47f0=_0x112be7;this[_0xce47f0(0x131)]=this[_0xce47f0(0x131)]||[];if(_0x42e157)this['_graftTilemapRefreshRegions'][_0xce47f0(0x113)](_0x42e157);if(_0x2ad3ff)this['_graftTilemapRefreshRegions'][_0xce47f0(0x113)](_0x2ad3ff);},Game_Map[_0x112be7(0x105)]['refreshGraftTilemapIfNeeded']=function(){const _0x2e603d=_0x112be7;if(!this['_needsGraftTilemapRefresh'])return;SceneManager[_0x2e603d(0x170)](),this[_0x2e603d(0xdd)]=![],this[_0x2e603d(0x131)]=[];},Game_Map['prototype'][_0x112be7(0xcd)]=function(){const _0x294b11=_0x112be7;this[_0x294b11(0xcf)]={},this[_0x294b11(0xe4)]={},this[_0x294b11(0x15b)]=[];},Game_Map['prototype'][_0x112be7(0x13e)]=function(){const _0x30254a=_0x112be7;if(!$dataMap)return;const _0x23c9f1=this[_0x30254a(0x12c)]();this[_0x30254a(0x151)](_0x23c9f1);},Game_Map[_0x112be7(0x105)][_0x112be7(0x12c)]=function(){const _0x30d87f=_0x112be7;if(this[_0x30d87f(0xcf)]===undefined)this[_0x30d87f(0xcd)]();if(this[_0x30d87f(0xe4)]===undefined)this[_0x30d87f(0xcd)]();const _0x423ea4=this[_0x30d87f(0x185)]();if(Imported[_0x30d87f(0x16f)]&&typeof _0x423ea4===_0x30d87f(0x164)){if(_0x423ea4===_0x30d87f(0xe6))return[];return this['_tileGraftDataRandom'][_0x423ea4]=this[_0x30d87f(0xe4)][_0x423ea4]||[],this['_tileGraftDataRandom'][_0x423ea4];}else return this[_0x30d87f(0xcf)][_0x423ea4]=this['_tileGraftDataMapID'][_0x423ea4]||[],this[_0x30d87f(0xcf)][_0x423ea4];},Game_Map[_0x112be7(0x105)][_0x112be7(0x151)]=function(_0x308bca){const _0xd36700=_0x112be7,_0x4d35d3=_0x308bca[_0xd36700(0x18b)];$dataMap[_0xd36700(0x14f)]===undefined&&($dataMap[_0xd36700(0x14f)]=$dataMap[_0xd36700(0xf5)][_0xd36700(0xd3)]());for(let _0x332cc=0x0;_0x332cc<_0x4d35d3;_0x332cc++){const _0x1c9471=_0x308bca[_0x332cc];if(_0x1c9471===null||_0x1c9471===undefined)continue;$dataMap[_0xd36700(0xf5)][_0x332cc]=_0x1c9471;}},Game_Map[_0x112be7(0x105)]['getSourceMapIDs']=function(){const _0x5f28ae=_0x112be7;if(this[_0x5f28ae(0x15b)]===undefined)this[_0x5f28ae(0xcd)]();return this[_0x5f28ae(0x15b)];},Game_Map[_0x112be7(0x105)][_0x112be7(0xe7)]=function(_0x3a785c){const _0x1ce51e=_0x112be7,_0x4d1d59=this[_0x1ce51e(0x127)]();if(_0x4d1d59[_0x1ce51e(0x119)](_0x3a785c))return;_0x4d1d59[_0x1ce51e(0x113)](_0x3a785c);},Game_Map[_0x112be7(0x105)][_0x112be7(0x126)]=function(_0x33557d,_0x46c24a,_0x133dde,_0xd3aa7b){const _0x16eb59=_0x112be7,_0x2d5057=this[_0x16eb59(0x12e)](_0x46c24a,_0x133dde,_0xd3aa7b),_0x38504d=this[_0x16eb59(0xff)](_0x46c24a,_0x133dde,_0xd3aa7b),_0x4ad4e9=this[_0x16eb59(0x12c)]();_0x33557d>=0x0?($dataMap[_0x16eb59(0xf5)][_0x38504d]=_0x33557d,_0x4ad4e9[_0x38504d]=_0x33557d):($dataMap[_0x16eb59(0xf5)][_0x38504d]=$dataMap[_0x16eb59(0x14f)][_0x38504d],_0x4ad4e9[_0x38504d]=undefined);this[_0x16eb59(0xd4)]();if(_0xd3aa7b===0x5){const _0x48d113=this[_0x16eb59(0x12e)](_0x46c24a,_0x133dde,_0xd3aa7b);this['addRefreshRegionsForGraftTilemapRefresh'](_0x2d5057,_0x48d113);}},Game_Map[_0x112be7(0x105)][_0x112be7(0x10c)]=function(_0x43498b,_0x286db4,_0x49e9d3){const _0x22d108=_0x112be7;if(_0x49e9d3<0x6)this[_0x22d108(0x126)](-0x1,_0x43498b,_0x286db4,_0x49e9d3);if(_0x49e9d3===0x6)this[_0x22d108(0x16e)](_0x43498b,_0x286db4,_0x49e9d3);},Game_Map['prototype'][_0x112be7(0x16e)]=function(_0x2bcaf7,_0x17280a,_0x21c207){const _0x123ac0=_0x112be7;if(_0x21c207<0x6)this[_0x123ac0(0x126)](0x0,_0x2bcaf7,_0x17280a,_0x21c207);if(_0x21c207===0x6)this[_0x123ac0(0x116)](_0x2bcaf7,_0x17280a);},Game_Map['prototype'][_0x112be7(0x116)]=function(_0x1f56e4,_0x1d3d6b){const _0x8550e2=_0x112be7,_0x1a12a3=this[_0x8550e2(0xd9)](_0x1f56e4,_0x1d3d6b)[_0x8550e2(0xce)](_0x5c6ad1=>_0x5c6ad1&&_0x5c6ad1[_0x8550e2(0x167)]());if(_0x1a12a3[_0x8550e2(0x18b)]<=0x0)return;for(const _0x2f0196 of _0x1a12a3){this['despawnEventId'](_0x2f0196[_0x8550e2(0x13c)]());}},Game_Map[_0x112be7(0x105)][_0x112be7(0x172)]=function(_0xa70dc0){const _0x19dba1=_0x112be7,_0x3f53f3=Math[_0x19dba1(0x142)]((_0xa70dc0-0x800)/0x30);return _0x3f53f3*0x30+0x800;},Game_Map[_0x112be7(0x105)][_0x112be7(0x179)]=function(_0xac101a,_0x1b6316,_0x50be93){const _0xaca4e5=_0x112be7,_0x544c01=this[_0xaca4e5(0xfb)](_0xac101a,_0x1b6316,_0x50be93);if(_0x544c01<0x0)return;for(let _0x1780ba=-0x1;_0x1780ba<=0x1;_0x1780ba++){if(_0x1780ba+_0xac101a<0x0)continue;if(_0x1780ba+_0xac101a>=this[_0xaca4e5(0x112)]())continue;for(let _0x23de17=-0x1;_0x23de17<=0x1;_0x23de17++){if(_0x23de17+_0x1b6316<0x0)continue;if(_0x23de17+_0x1b6316>=this[_0xaca4e5(0x175)]())continue;const _0x34d2eb=_0xac101a+_0x1780ba,_0x1a5fb7=_0x1b6316+_0x23de17;if(this[_0xaca4e5(0xfb)](_0x34d2eb,_0x1a5fb7,_0x50be93)!==_0x544c01)continue;this[_0xaca4e5(0xfa)](_0x544c01,_0x34d2eb,_0x1a5fb7,_0x50be93);}}},Game_Map['prototype'][_0x112be7(0xfa)]=function(_0xee28ab,_0x38c5bf,_0x34daa6,_0x35e2ee){const _0x3006fc=_0x112be7,_0x9dd1a=[_0x38c5bf,_0x34daa6,_0x35e2ee];if(this[_0x3006fc(0x184)]['adjustedTiles'][_0x9dd1a])return;this[_0x3006fc(0x184)][_0x3006fc(0xe1)][_0x9dd1a]=!![];const _0x236f54=VisuMZ[_0x3006fc(0x122)][_0x3006fc(0xd8)](_0xee28ab),_0x432ca8=this[_0x3006fc(0x18d)](_0xee28ab,_0x236f54,_0x38c5bf,_0x34daa6,_0x35e2ee);this[_0x3006fc(0x126)](_0x432ca8,_0x38c5bf,_0x34daa6,_0x35e2ee);},VisuMZ[_0x112be7(0x122)]['determineAutotileType']=function(_0x1cfddd){const _0x3fbc98=_0x112be7;if([0x5,0x7,0xd,0xf][_0x3fbc98(0x119)](_0x1cfddd))return'waterfall';const _0x380550=[0x38,0x48,0x58,0x68,0x78];for(const _0x59dfe6 of _0x380550){if(_0x1cfddd>=_0x59dfe6&&_0x1cfddd<_0x59dfe6+0x8)return'wall';}return _0x3fbc98(0x110);},Game_Map[_0x112be7(0x105)][_0x112be7(0x18d)]=function(_0x404406,_0x5dab6c,_0x158a2d,_0x230d98,_0xccb5ea){const _0x28d113=_0x112be7;let _0x44ab43=_0x404406*0x30+0x800;return _0x5dab6c===_0x28d113(0x110)&&(_0x44ab43=this['calcSpreadGraftAutotileXyz'](_0x44ab43,_0x404406,_0x158a2d,_0x230d98,_0xccb5ea)),_0x5dab6c===_0x28d113(0x141)&&(_0x44ab43=this[_0x28d113(0xcc)](_0x44ab43,_0x404406,_0x158a2d,_0x230d98,_0xccb5ea)),_0x5dab6c===_0x28d113(0x117)&&(_0x44ab43=this[_0x28d113(0x168)](_0x44ab43,_0x404406,_0x158a2d,_0x230d98,_0xccb5ea)),_0x44ab43;},Game_Map[_0x112be7(0x105)][_0x112be7(0x16c)]=function(_0x240fb1,_0x56d4e0,_0x20df5a,_0x3a34e3,_0x176798){const _0x42ceba=_0x112be7,_0x35ade3=this['getAutotileTypeIDAdjacentBorders'](_0x56d4e0,_0x20df5a,_0x3a34e3,_0x176798);if(_0x35ade3[_0x42ceba(0x18b)]<=0x0){if(this[_0x42ceba(0x149)](_0x56d4e0,_0x20df5a-0x1,_0x3a34e3-0x1,_0x176798))_0x240fb1+=0x1;if(this['hasBorderAutotileTypeID'](_0x56d4e0,_0x20df5a+0x1,_0x3a34e3-0x1,_0x176798))_0x240fb1+=0x2;if(this[_0x42ceba(0x149)](_0x56d4e0,_0x20df5a+0x1,_0x3a34e3+0x1,_0x176798))_0x240fb1+=0x4;if(this[_0x42ceba(0x149)](_0x56d4e0,_0x20df5a-0x1,_0x3a34e3+0x1,_0x176798))_0x240fb1+=0x8;}if(_0x35ade3[_0x42ceba(0x18b)]===0x1){const _0x4a7a02=_0x35ade3[0x0];if(_0x4a7a02===0x4){_0x240fb1+=0x10;if(this[_0x42ceba(0x149)](_0x56d4e0,_0x20df5a+0x1,_0x3a34e3-0x1,_0x176798))_0x240fb1+=0x1;if(this[_0x42ceba(0x149)](_0x56d4e0,_0x20df5a+0x1,_0x3a34e3+0x1,_0x176798))_0x240fb1+=0x2;}else{if(_0x4a7a02===0x8){_0x240fb1+=0x14;if(this[_0x42ceba(0x149)](_0x56d4e0,_0x20df5a+0x1,_0x3a34e3+0x1,_0x176798))_0x240fb1+=0x1;if(this[_0x42ceba(0x149)](_0x56d4e0,_0x20df5a-0x1,_0x3a34e3+0x1,_0x176798))_0x240fb1+=0x2;}else{if(_0x4a7a02===0x6){_0x240fb1+=0x18;if(this[_0x42ceba(0x149)](_0x56d4e0,_0x20df5a-0x1,_0x3a34e3-0x1,_0x176798))_0x240fb1+=0x1;if(this['hasBorderAutotileTypeID'](_0x56d4e0,_0x20df5a-0x1,_0x3a34e3+0x1,_0x176798))_0x240fb1+=0x2;}else{if(_0x4a7a02===0x2){_0x240fb1+=0x1c;if(this[_0x42ceba(0x149)](_0x56d4e0,_0x20df5a-0x1,_0x3a34e3-0x1,_0x176798))_0x240fb1+=0x1;if(this[_0x42ceba(0x149)](_0x56d4e0,_0x20df5a+0x1,_0x3a34e3-0x1,_0x176798))_0x240fb1+=0x2;}}}}}if(_0x35ade3[_0x42ceba(0x18b)]===0x2){if(_0x35ade3['includes'](0x4)&&_0x35ade3[_0x42ceba(0x119)](0x6))_0x240fb1+=0x20;else{if(_0x35ade3[_0x42ceba(0x119)](0x2)&&_0x35ade3[_0x42ceba(0x119)](0x8))_0x240fb1+=0x21;else{if(_0x35ade3[_0x42ceba(0x119)](0x4)&&_0x35ade3[_0x42ceba(0x119)](0x8)){_0x240fb1+=0x22;if(this['hasBorderAutotileTypeID'](_0x56d4e0,_0x20df5a+0x1,_0x3a34e3+0x1,_0x176798))_0x240fb1+=0x1;}else{if(_0x35ade3['includes'](0x6)&&_0x35ade3['includes'](0x8)){_0x240fb1+=0x24;if(this[_0x42ceba(0x149)](_0x56d4e0,_0x20df5a-0x1,_0x3a34e3+0x1,_0x176798))_0x240fb1+=0x1;}else{if(_0x35ade3['includes'](0x2)&&_0x35ade3['includes'](0x6)){_0x240fb1+=0x26;if(this['hasBorderAutotileTypeID'](_0x56d4e0,_0x20df5a-0x1,_0x3a34e3-0x1,_0x176798))_0x240fb1+=0x1;}else{if(_0x35ade3[_0x42ceba(0x119)](0x2)&&_0x35ade3[_0x42ceba(0x119)](0x4)){_0x240fb1+=0x28;if(this[_0x42ceba(0x149)](_0x56d4e0,_0x20df5a+0x1,_0x3a34e3-0x1,_0x176798))_0x240fb1+=0x1;}}}}}}}if(_0x35ade3['length']===0x3){if(!_0x35ade3[_0x42ceba(0x119)](0x2))_0x240fb1+=0x2a;else{if(!_0x35ade3['includes'](0x6))_0x240fb1+=0x2b;else{if(!_0x35ade3[_0x42ceba(0x119)](0x8))_0x240fb1+=0x2c;else!_0x35ade3[_0x42ceba(0x119)](0x4)&&(_0x240fb1+=0x2d);}}}return _0x35ade3[_0x42ceba(0x18b)]===0x4&&(_0x240fb1+=0x2e),_0x240fb1;},Game_Map[_0x112be7(0x105)][_0x112be7(0xcc)]=function(_0x919e2f,_0x3d5b9a,_0x40ea2f,_0x3685f6,_0xf5cf95){const _0x29e940=_0x112be7,_0x14f01a=this[_0x29e940(0x193)](_0x3d5b9a,_0x40ea2f,_0x3685f6,_0xf5cf95);if(_0x14f01a[_0x29e940(0x119)](0x4))_0x919e2f+=0x1;if(_0x14f01a[_0x29e940(0x119)](0x8))_0x919e2f+=0x2;if(_0x14f01a[_0x29e940(0x119)](0x6))_0x919e2f+=0x4;if(_0x14f01a[_0x29e940(0x119)](0x2))_0x919e2f+=0x8;return _0x919e2f;},Game_Map['prototype']['calcWaterfallGraftAutotileXyz']=function(_0x239912,_0x2b573a,_0x4d9633,_0xdb2d7d,_0x2bc865){const _0x17074a=_0x112be7,_0x29f34e=this['getAutotileTypeIDAdjacentBorders'](_0x2b573a,_0x4d9633,_0xdb2d7d,_0x2bc865);if(_0x29f34e[_0x17074a(0x119)](0x4))_0x239912+=0x1;if(_0x29f34e[_0x17074a(0x119)](0x6))_0x239912+=0x2;return _0x239912;},Game_Map[_0x112be7(0x105)][_0x112be7(0x13b)]=function(_0x1d4124,_0x10e27f,_0xe973c9,_0x3715d8){const _0x336c01=_0x112be7;let _0x528c72=[];if(this['hasBorderAutotileTypeID'](_0x1d4124,_0x10e27f,_0xe973c9+0x1,_0x3715d8))_0x528c72['push'](0x2);if(this['hasBorderAutotileTypeID'](_0x1d4124,_0x10e27f-0x1,_0xe973c9,_0x3715d8))_0x528c72[_0x336c01(0x113)](0x4);if(this[_0x336c01(0x149)](_0x1d4124,_0x10e27f+0x1,_0xe973c9,_0x3715d8))_0x528c72[_0x336c01(0x113)](0x6);if(this[_0x336c01(0x149)](_0x1d4124,_0x10e27f,_0xe973c9-0x1,_0x3715d8))_0x528c72[_0x336c01(0x113)](0x8);return _0x528c72;},Game_Map[_0x112be7(0x105)][_0x112be7(0x149)]=function(_0x5683a1,_0xf5bc6c,_0x4d1480,_0x23ae13){const _0xd26aea=_0x112be7;if(_0xf5bc6c<0x0)return![];if(_0xf5bc6c>=this['width']())return![];if(_0x4d1480<0x0)return![];if(_0x4d1480>=this['height']())return![];return this[_0xd26aea(0xfb)](_0xf5bc6c,_0x4d1480,_0x23ae13)!==_0x5683a1;},Game_Map[_0x112be7(0x105)]['getAutotileWallTypeIDAdjacentBorders']=function(_0x182ffb,_0x149961,_0x3d9792,_0x2c53e7){const _0x6afb8f=_0x112be7;let _0x56e0b6=[];if(this['hasBorderAutotileTypeID'](_0x182ffb,_0x149961,_0x3d9792+0x1,_0x2c53e7))_0x56e0b6[_0x6afb8f(0x113)](0x2);if(this[_0x6afb8f(0x149)](_0x182ffb,_0x149961,_0x3d9792-0x1,_0x2c53e7))_0x56e0b6[_0x6afb8f(0x113)](0x8);if(this[_0x6afb8f(0x197)](_0x182ffb,_0x149961,_0x149961-0x1,_0x3d9792,_0x2c53e7))_0x56e0b6[_0x6afb8f(0x113)](0x4);if(this[_0x6afb8f(0x197)](_0x182ffb,_0x149961,_0x149961+0x1,_0x3d9792,_0x2c53e7))_0x56e0b6['push'](0x6);return _0x56e0b6;},Game_Map[_0x112be7(0x105)][_0x112be7(0x197)]=function(_0x16b8a9,_0x686d51,_0x235ae4,_0x220b64,_0x3ee26b){const _0x26d37d=_0x112be7;if(_0x235ae4<0x0)return![];if(_0x235ae4>=this[_0x26d37d(0x112)]())return![];if(this[_0x26d37d(0xfb)](_0x235ae4,_0x220b64,_0x3ee26b)!==_0x16b8a9)return!![];let _0x1daa70=_0x220b64;for(;;){if(_0x1daa70+0x1>=this[_0x26d37d(0x175)]())break;if(this['autotileType'](_0x686d51,_0x1daa70+0x1,_0x3ee26b)!==_0x16b8a9)break;_0x1daa70+=0x1;}let _0x3f1f0d=_0x220b64;for(;;){if(_0x3f1f0d+0x1>=this[_0x26d37d(0x175)]())break;if(this['autotileType'](_0x235ae4,_0x3f1f0d+0x1,_0x3ee26b)!==_0x16b8a9)break;_0x3f1f0d+=0x1;}return _0x1daa70!==_0x3f1f0d;},Game_Map[_0x112be7(0x105)][_0x112be7(0xf8)]=function(_0x11a82c){const _0x2871a6=_0x112be7;this[_0x2871a6(0x184)]=JSON[_0x2871a6(0x18a)](JSON['stringify'](_0x11a82c)),$graftMap=null,DataManager[_0x2871a6(0xee)](_0x11a82c[_0x2871a6(0x108)]||this[_0x2871a6(0x185)]());},Game_Map[_0x112be7(0x105)]['performTileGraftingFromMap']=function(){const _0x44c669=_0x112be7;VisuMZ[_0x44c669(0x122)][_0x44c669(0x159)]();const _0x51a547=this['_tileGraftingSettings']['layers'],_0xf4c536=this[_0x44c669(0x184)]['width'],_0x29edb2=this[_0x44c669(0x184)]['height'];this['addSourceMapID'](this[_0x44c669(0x184)]['sourceMapID']);for(let _0x136f9a=0x0;_0x136f9a<_0xf4c536;_0x136f9a++){for(let _0x2651dc=0x0;_0x2651dc<_0x29edb2;_0x2651dc++){for(let _0x4ebf21 of _0x51a547){if(_0x4ebf21<0x6)this[_0x44c669(0x187)](_0x136f9a,_0x2651dc,_0x4ebf21);if(_0x4ebf21===0x6)this[_0x44c669(0x188)](_0x136f9a,_0x2651dc);}}}if(this['_tileGraftingSettings']['autotile']){this[_0x44c669(0x184)][_0x44c669(0xe1)]={};for(let _0xcf2cd9=0x0;_0xcf2cd9<_0xf4c536;_0xcf2cd9++){for(let _0x2db9a=0x0;_0x2db9a<_0x29edb2;_0x2db9a++){for(let _0x5087ad of _0x51a547){if(_0x5087ad>=0x4)continue;const _0xabdd25=this[_0x44c669(0x184)][_0x44c669(0xe3)]+_0xcf2cd9,_0x1aff86=this[_0x44c669(0x184)][_0x44c669(0x178)]+_0x2db9a;this[_0x44c669(0x179)](_0xabdd25,_0x1aff86,_0x5087ad);}}}}$graftMap=null,this[_0x44c669(0x184)]=undefined,this[_0x44c669(0xf7)]&&this[_0x44c669(0xf7)]();},VisuMZ[_0x112be7(0x122)][_0x112be7(0x159)]=function(){const _0x3465a6=_0x112be7;if(!VisuMZ[_0x3465a6(0x122)][_0x3465a6(0xd7)][_0x3465a6(0xfe)])return;if(!$gameTemp['isPlaytest']())return;if(!$gameMap)return;if(!$graftMap)return;if($gameMap[_0x3465a6(0xe5)]!==$graftMap[_0x3465a6(0xd1)]){let _0x1343ad='';_0x1343ad+='Source\x20map\x20and\x20current\x20map\x20do\x20not\x20have\x20matching\x20',_0x1343ad+=_0x3465a6(0x16b),_0x1343ad+=_0x3465a6(0x13a),alert(_0x1343ad);}},Game_Map[_0x112be7(0x105)]['performTileGraftingForTile']=function(_0x2d4de3,_0x19ed87,_0x4e41ad){const _0xf59d37=_0x112be7,_0x42e62f=this[_0xf59d37(0x184)][_0xf59d37(0x194)]+_0x2d4de3,_0x153b4b=this[_0xf59d37(0x184)][_0xf59d37(0x145)]+_0x19ed87,_0x3f5064=VisuMZ[_0xf59d37(0x122)]['getGraftTileIndex'](_0x42e62f,_0x153b4b,_0x4e41ad);let _0x5b66b4=$graftMap[_0xf59d37(0xf5)][_0x3f5064]||0x0;_0x4e41ad<0x4&&this['_tileGraftingSettings'][_0xf59d37(0xdf)]&&(_0x5b66b4=this[_0xf59d37(0x172)](_0x5b66b4));const _0x27ef4a=this[_0xf59d37(0x184)][_0xf59d37(0xe3)]+_0x2d4de3,_0x35c90f=this['_tileGraftingSettings']['targetY']+_0x19ed87;this[_0xf59d37(0x126)](_0x5b66b4,_0x27ef4a,_0x35c90f,_0x4e41ad);},Game_Map[_0x112be7(0x105)][_0x112be7(0x188)]=function(_0x49ca5a,_0x13a834){const _0x208661=_0x112be7,_0x5b6f04=this[_0x208661(0x184)][_0x208661(0xe3)]+_0x49ca5a,_0x103c90=this[_0x208661(0x184)][_0x208661(0x178)]+_0x13a834;this[_0x208661(0x116)](_0x5b6f04,_0x103c90);const _0x24566f=this[_0x208661(0x184)][_0x208661(0x194)]+_0x49ca5a,_0x4673e2=this[_0x208661(0x184)][_0x208661(0x145)]+_0x13a834,_0xf38207=$graftMap['events'][_0x208661(0xce)](_0x547e71=>!!_0x547e71&&_0x547e71['x']===_0x24566f&&_0x547e71['y']===_0x4673e2)||[];if(_0xf38207['length']<=0x0)return;const _0x32c621=this['_tileGraftingSettings'][_0x208661(0x108)];!VisuMZ[_0x208661(0x154)][_0x32c621]&&(VisuMZ['PreloadedMaps'][_0x32c621]=JSON[_0x208661(0x18a)](JSON['stringify']($graftMap))),data={'template':'','mapId':_0x32c621,'eventId':_0xf38207[0x0]['id'],'x':_0x5b6f04,'y':_0x103c90,'spawnPreserved':!![],'spawnEventId':this[_0x208661(0xfc)][_0x208661(0x18b)]+0x3e8,'grafted':!![]},$gameMap[_0x208661(0x130)](data,![],![]);},Game_Event[_0x112be7(0x105)][_0x112be7(0xf1)]=function(){const _0x12d8db=_0x112be7;return this[_0x12d8db(0x167)]()&&this[_0x12d8db(0x136)]['grafted'];},Game_Map[_0x112be7(0x105)][_0x112be7(0x123)]=function(_0x36628a){const _0x1128f7=_0x112be7,_0x1c92dd=_0x36628a[_0x1128f7(0x177)],_0x5ba8dd=_0x36628a['width'],_0x584309=_0x36628a[_0x1128f7(0x175)];for(let _0x2b1a4a=0x0;_0x2b1a4a<_0x5ba8dd;_0x2b1a4a++){for(let _0x57819a=0x0;_0x57819a<_0x584309;_0x57819a++){for(let _0x26422d of _0x1c92dd){if(_0x26422d===0x6&&SceneManager[_0x1128f7(0x176)]()){this['prepareGraftResetSceneEventClear'](_0x36628a);continue;}const _0x429d34=_0x36628a[_0x1128f7(0xe3)]+_0x2b1a4a,_0x57ae2c=_0x36628a[_0x1128f7(0x178)]+_0x57819a;this[_0x1128f7(0x16e)](_0x429d34,_0x57ae2c,_0x26422d);}}}this['refreshSpritesetForExtendedTiles']&&this['refreshSpritesetForExtendedTiles']();},Game_Map[_0x112be7(0x105)][_0x112be7(0x10d)]=function(_0x94a5a9){const _0x38da9b=_0x112be7,_0x249cee=_0x94a5a9[_0x38da9b(0x177)],_0x275730=_0x94a5a9[_0x38da9b(0x112)],_0x2ec0fa=_0x94a5a9[_0x38da9b(0x175)];for(let _0x2953d3=0x0;_0x2953d3<_0x275730;_0x2953d3++){for(let _0x3793e6=0x0;_0x3793e6<_0x2ec0fa;_0x3793e6++){for(let _0x12fb9f of _0x249cee){if(_0x12fb9f===0x6&&SceneManager[_0x38da9b(0x176)]()){this[_0x38da9b(0x14c)](_0x94a5a9);continue;}const _0x1c66b1=_0x94a5a9[_0x38da9b(0xe3)]+_0x2953d3,_0x163965=_0x94a5a9[_0x38da9b(0x178)]+_0x3793e6;this[_0x38da9b(0x10c)](_0x1c66b1,_0x163965,_0x12fb9f);}}}this[_0x38da9b(0xf7)]&&this[_0x38da9b(0xf7)]();},Game_Map[_0x112be7(0x105)][_0x112be7(0x14c)]=function(_0x50ae7a){const _0x486648=_0x112be7;this[_0x486648(0x189)]=JSON[_0x486648(0x18a)](JSON['stringify'](_0x50ae7a));},Game_Map['prototype']['performGraftResetSceneEventClear']=function(){const _0x3d383c=_0x112be7;if(!this[_0x3d383c(0x189)])return;const _0x15240c=this[_0x3d383c(0x189)],_0x5201eb=_0x15240c[_0x3d383c(0x112)],_0x385bba=_0x15240c[_0x3d383c(0x175)],_0x4662d2=0x6;for(let _0x33bb39=0x0;_0x33bb39<_0x5201eb;_0x33bb39++){for(let _0x2e41d7=0x0;_0x2e41d7<_0x385bba;_0x2e41d7++){const _0x5979df=_0x15240c[_0x3d383c(0xe3)]+_0x33bb39,_0x379d71=_0x15240c['targetY']+_0x2e41d7;this[_0x3d383c(0x16e)](_0x5979df,_0x379d71,_0x4662d2);}}this[_0x3d383c(0x189)]=undefined;},VisuMZ[_0x112be7(0x122)]['Game_Interpreter_updateWaitMode']=Game_Interpreter[_0x112be7(0x105)][_0x112be7(0x144)],Game_Interpreter[_0x112be7(0x105)][_0x112be7(0x144)]=function(){const _0x1a562d=_0x112be7;if(this[_0x1a562d(0xeb)]===_0x1a562d(0xd5)){if(!$graftMap)return!![];DataManager[_0x1a562d(0x157)](),$gameMap[_0x1a562d(0xd0)](),this[_0x1a562d(0xeb)]='',this[_0x1a562d(0xdb)](0x1);}if(this[_0x1a562d(0xeb)]===_0x1a562d(0xe0)){if(!$graftMap)return!![];DataManager['registerNewGraftMap'](),$graftMap=null,this[_0x1a562d(0xeb)]='';}return VisuMZ[_0x1a562d(0x122)][_0x1a562d(0xec)][_0x1a562d(0x135)](this);},VisuMZ['TileGrafterSystem'][_0x112be7(0x14e)]=Scene_Map[_0x112be7(0x105)][_0x112be7(0x183)],Scene_Map[_0x112be7(0x105)][_0x112be7(0x183)]=function(){const _0x4bd7fb=_0x112be7;$gameMap[_0x4bd7fb(0x13e)](),VisuMZ[_0x4bd7fb(0x122)][_0x4bd7fb(0x14e)][_0x4bd7fb(0x135)](this);},VisuMZ[_0x112be7(0x122)]['Scene_Map_createSpriteset']=Scene_Map['prototype'][_0x112be7(0xd6)],Scene_Map['prototype'][_0x112be7(0xd6)]=function(){const _0x201a58=_0x112be7;this[_0x201a58(0xe2)]=[],VisuMZ[_0x201a58(0x122)][_0x201a58(0x160)][_0x201a58(0x135)](this);},VisuMZ['TileGrafterSystem'][_0x112be7(0x18c)]=Scene_Map['prototype'][_0x112be7(0x158)],Scene_Map[_0x112be7(0x105)]['needsFadeIn']=function(){const _0xbcca30=_0x112be7;return VisuMZ[_0xbcca30(0x122)][_0xbcca30(0x18c)][_0xbcca30(0x135)](this)||SceneManager[_0xbcca30(0x100)](Scene_GrafterReset);},Scene_Map[_0x112be7(0x105)][_0x112be7(0x17a)]=function(){const _0x19a19d=_0x112be7;$gameTemp[_0x19a19d(0x18f)]=!![],this[_0x19a19d(0x156)](this[_0x19a19d(0x101)](),![]);},VisuMZ[_0x112be7(0x122)][_0x112be7(0x128)]=Tilemap[_0x112be7(0x105)][_0x112be7(0x15d)],Tilemap[_0x112be7(0x105)][_0x112be7(0x15d)]=function(){const _0x3c4d4d=_0x112be7;if($gameTemp[_0x3c4d4d(0x18f)])return;VisuMZ[_0x3c4d4d(0x122)]['Tilemap_updateTransform'][_0x3c4d4d(0x135)](this);},VisuMZ[_0x112be7(0x122)][_0x112be7(0x166)]=Scene_Load[_0x112be7(0x105)][_0x112be7(0x191)],Scene_Load['prototype']['onLoadSuccess']=function(){const _0x1bf7db=_0x112be7;VisuMZ['TileGrafterSystem'][_0x1bf7db(0x166)][_0x1bf7db(0x135)](this),VisuMZ['TileGrafterSystem']['PreloadGraftedMaps']();},VisuMZ['TileGrafterSystem'][_0x112be7(0x10f)]=function(){const _0x50f488=_0x112be7,_0x37d0ef=$gameMap[_0x50f488(0x127)]();for(const _0x11c67f of _0x37d0ef){if(VisuMZ[_0x50f488(0x154)][_0x11c67f])continue;const _0x4a4f66='Map%1.json'[_0x50f488(0x165)](_0x11c67f[_0x50f488(0x150)](0x3)),_0x28d901=_0x50f488(0x12f)[_0x50f488(0x165)](_0x11c67f);DataManager[_0x50f488(0x16d)](_0x28d901,_0x4a4f66),setTimeout(this[_0x50f488(0x14a)][_0x50f488(0x195)](this,_0x11c67f,_0x28d901),0x64);}},VisuMZ[_0x112be7(0x122)][_0x112be7(0x14a)]=function(_0x2c1505,_0x19f9a3){const _0x4eedd6=_0x112be7;window[_0x19f9a3]?(VisuMZ[_0x4eedd6(0x154)][_0x2c1505]=window[_0x19f9a3],window[_0x19f9a3]=undefined):setTimeout(this[_0x4eedd6(0x14a)][_0x4eedd6(0x195)](this,_0x2c1505,_0x19f9a3),0x64);};function Scene_GrafterReset(){this['initialize'](...arguments);}function _0x3275(){const _0x5c3f0e=['_waitMode','Game_Interpreter_updateWaitMode','registerCommand','loadGraftMapData','VisuMZ_0_CoreEngine\x20needs\x20to\x20be\x20updated\x20','Map%1.json','isSpawnedGraftedEvent','20498qXkLxl','PreloadGraftMap','21EcCOrd','data','%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.','refreshSpritesetForExtendedTiles','registerTileGraftingSettings','performGraftResetSceneEventClear','updateGraftAutotileXyz','autotileType','_spawnedEvents','update','Warning','getTileDataIndex','isPreviousScene','fadeSpeed','GraftRevertTiles','VisuMZ_5_TileD','grafted','prototype','ARRAYFUNC','trim','sourceMapID','CheckCompatibility','exit','map','revertTileGraftXyz','revertTileGraftingFromMap','goto','PreloadGraftedMaps','spread','STRUCT','width','push','41yvUCuQ','max','clearEventGraftXyz','waterfall','GetAffectedLayers','includes','refresh','normal','constructor','66gkIUAD','spawned','STR','setWaitMode','2380692VoTmHg','TileGrafterSystem','clearTileGraftingFromMap','GraftAutotile','JSON','setTileGraftXyz','getSourceMapIDs','Tilemap_updateTransform','FUNC','onDatabaseLoaded','_spriteset','getMapGraftData','performRefreshGraftedTilemap','tileId','$preloadedMap_%1','prepareSpawnedEventAtXY','_graftTilemapRefreshRegions','_tilemap','checkNormalEventsInArea','VisualFogs','call','_eventSpawnData','checkGraftedEventsInArea','VisuMZ_1_EventsMoveCore\x20needs\x20to\x20be\x20updated\x20','SwitchID_Normals','Graft\x20appearance\x20may\x20or\x20may\x20not\x20be\x20as\x20intended.\x20','getAutotileTypeIDAdjacentBorders','eventId','SwitchID_Graft','setupGraftTiles','toUpperCase','GraftFromTargetMap','wall','floor','addRefreshRegionsForGraftTilemapRefresh','updateWaitMode','sourceY','SwitchID_Spawns','parameters','checkSpawnedEventsInArea','hasBorderAutotileTypeID','preload_Map','6vsWaFW','prepareGraftResetSceneEventClear','%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.','Scene_Map_createDisplayObjects','originalData','padZero','loadSavedMapGraftData','EVAL','return\x200','PreloadedMaps','name','startFadeOut','registerNewGraftMap','needsFadeIn','CheckNonmatchTilesetIDs','isInstanceOfSceneMap','_tileGraftSourceMapIDs','GraftClearTiles','updateTransform','VisuMZ_4_VisualFogs','description','Scene_Map_createSpriteset','SwitchCheckEvents','setValue','stringify','string','format','Scene_Load_onLoadSuccess','isSpawnedEvent','calcWaterfallGraftAutotileXyz','9MCuDJZ','some','tileset\x20IDs\x20for\x20Tile\x20Grafter\x20System.\x20','calcSpreadGraftAutotileXyz','loadDataFile','clearTileGraftXyz','VisuMZ_2_RandomDungeonMaps','refreshGraftedTilemap','_graftMapID','getAutotileBaseTileID','VisuMZ_2_LightingEffects','1422772PFyFxs','height','needsFullRefreshForGrafter','layers','targetY','graftAutotileXyz','startTileGraftFadeOut','62722998QcMxTV','344296YtIAwb','version','76131SumtDc','VisuMZ_2_TileGrafterSystem\x20does\x20not\x20work\x20with\x20VisuMZ_5_TileD.','ARRAYSTR','VisuMZ_4_VisualParallaxes\x20needs\x20to\x20be\x20updated\x20','2938605hRpPXk','createDisplayObjects','_tileGraftingSettings','mapId','1210vLahLy','performTileGraftingForTile','performTileGraftingForEvent','_tileGraftingSettingsEventClear','parse','length','Scene_Map_needsFadeIn','calcGraftAutotileXyz','ConvertParams','_haltTilemapRefresh','Scene_Boot_onDatabaseLoaded','onLoadSuccess','$graftMap','getAutotileWallTypeIDAdjacentBorders','sourceX','bind','match','hasWallBorderAutotileTypeID','NUM','getLastPluginCommandInterpreter','calcWallGraftAutotileXyz','initTileGrafterSystem','filter','_tileGraftDataMapID','performTileGraftingFromMap','tilesetId','%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.','clone','requestGraftedTilemapRefresh','loadGraftMap','createSpriteset','Settings','determineAutotileType','eventsXy','VisuMZ_4_VisualParallaxes','wait','Game_Map_update','_needsGraftTilemapRefresh','_scene','autotile','preloadGraftMap','adjustedTiles','_grafterRefreshRegions','targetX','_tileGraftDataRandom','_tilesetId','random','addSourceMapID','in\x20order\x20for\x20VisuMZ_2_TileGrafterSystem\x20to\x20work.','status','LightingEffects'];_0x3275=function(){return _0x5c3f0e;};return _0x3275();}Scene_GrafterReset[_0x112be7(0x105)]=Object['create'](Scene_Base[_0x112be7(0x105)]),Scene_GrafterReset[_0x112be7(0x105)][_0x112be7(0x11c)]=Scene_GrafterReset,Scene_GrafterReset[_0x112be7(0x105)]['start']=function(){const _0xd1ce0b=_0x112be7;$gameTemp[_0xd1ce0b(0x18f)]=![],$gameMap[_0xd1ce0b(0xf9)](),SceneManager[_0xd1ce0b(0x10e)](Scene_Map);};