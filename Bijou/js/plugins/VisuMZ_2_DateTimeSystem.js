//=============================================================================
// VisuStella MZ - Date & Time System
// VisuMZ_2_DateTimeSystem.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_2_DateTimeSystem = true;

var VisuMZ = VisuMZ || {};
VisuMZ.DateTimeSystem = VisuMZ.DateTimeSystem || {};
VisuMZ.DateTimeSystem.version = 1.04;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 2] [Version 1.04] [DateTimeSystem]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Date_and_Time_System_VisuStella_MZ
 * @base VisuMZ_0_CoreEngine
 * @orderAfter VisuMZ_0_CoreEngine
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * Does your game need a time system? This plugin adds time-related mechanics
 * to RPG Maker MZ, allowing you to control either Game Time, governed by your
 * own custom rules, or Real Time, synchronized to the player's PC or device.
 *
 * Features include all (but not limited to) the following:
 * 
 * * Pick between Game Time or Real Time. Game Time uses in-game rules while
 *   real time synchronizes the timer with the player's PC or device.
 * * In Game Time, create custom months, weekdays, and even change up rulings
 *   like how many hours a day there are or minutes in an hour.
 * * Game Time allows for Time Dilation, where you can change how fast a minute
 *   occurs or even slow it down. This can be adjusted midgame even.
 * * Pause and unpause Game Time as you see fit, or even use notetags to halt
 *   the passage of Game Time inside certain maps like building interiors.
 * * Enables usage of real time data, like dates and time. This data can be
 *   utilized in-game for variables, switches, and going as far as tinting the
 *   screen on certain maps based on the time of day.
 * * Variables and switches will be automatically updated and can be used to
 *   save date and time-related information.
 * * Recorded data found in variables and switches are highly useful for
 *   immediate event usage.
 * * Determine the screen tone and/or overlay used depending on what time of
 *   the day it is.
 * * Certain message-related text codes can be used to make quick mention of
 *   what time it is, certain aspects of a date, seasons, and more.
 * * Compatibility with other plugins can enable more features to be used, such
 *   as date and time-related battle encounters, season items for shops, usage
 *   of different tilesets for different dates/times, and more!
 * * Date/Time HUD is added for the map scene to quickly display information to
 *   the player about the date and time.
 * * The HUD is fully customizable and custom images/icons can be used as well
 *   as custom JavaScript code to modify how certain aspects appear in-game.
 * * Parts of the HUD can be disabled for those who may only want a Time system
 *   but not a Date system or vice versa.
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
 * Major Changes
 * ============================================================================
 *
 * This plugin adds some new hard-coded features to RPG Maker MZ's functions.
 * The following is a list of them.
 *
 * ---
 *
 * Tint Screen / Screen Tone
 * 
 * Although this plugin has screen tones for different times of the day, these
 * do NOT conflict with the "Tint Screen" command to adjust screen tones like
 * one may predict. Instead, the ones used in this plugin are a separate tint
 * effect and can, in fact, be stacked on top of each other.
 * 
 * Keep in mind that if you are using VisuMZ_2_LightingEffects, the screen
 * tones added by this plugin won't take effect in favor of the overlay system
 * to better work with the Lighting Effects system.
 *
 * ---
 *
 * ============================================================================
 * Extra Features
 * ============================================================================
 *
 * There are some extra features found if other VisuStella MZ plugins are found
 * present in the Plugin Manager list.
 *
 * ---
 * 
 * VisuMZ_1_BattleCore
 * 
 * If you have VisuStella MZ's Battle Core installed, you will gain access to
 * a few of the new comment tags available to Troops. These comment tags allow
 * you to setup which troops that appear based on certain Date and/or Time
 * conditions.
 * 
 * For example, if you want some enemies that only appear during the day time,
 * you can use the <Encounter Cycles: Dawn, Day> comment tag. If you want them
 * to appear at night, <Encounter Cycles: Dusk, Night> will work.
 * 
 * For another example, we can make some enemies that appear only during
 * specific seasons like <Encounter Season: Winter>. Other setups can be more
 * numerically involved like during specific months, hours, weekdays, etc.
 * 
 * Keep in mind that if you are using these conditions, all other conditions
 * need to be met for those Troops, such as which regions they're supposed to
 * appear in on the map or any other plugin related conditions like for the
 * VisuStella MZ Conditional Random Encounters plugin.
 * 
 * Battlebacks will need to do the same though the notetag for this will be
 * placed on the map notebox itself and for seasonal changes only.
 * 
 * ---
 * 
 * VisuMZ_1_EventsMoveCore
 * 
 * If you have VisuStella MZ's Events & Movement Core installed, you will gain
 * access to allowing certain tilesets to swap to another upon loading the map.
 * Inside the base tileset's notebox, you can insert <Winter Swap To: 7> and it
 * will exchange itself to tileset 7 if the season happens to be winter.
 * 
 * The effect does not end there, it will perform another check, but this time,
 * on the new tileset the map was changed to. There, it can optionally perform
 * another check like <Night Swap To: 8> if desired.
 * 
 * Priority will be given to seasons first, then  the day cycles (dawn, day,
 * dusk, night). This way, you can ensure that the tileset you're using matches
 * the conditions of the season or time of day if so desired.
 * 
 * If time changes into a new season or day cycle while on the map, there won't
 * be any changes made immediately. Instead, the player must exit and reenter
 * the map for the changes to be seen. This is to prevent any awkward changes
 * and transitions that may occur otherwise. The same applies to battlebacks.
 * 
 * ---
 * 
 * VisuMZ_1_ItemsEquipsCore
 * 
 * If you have VisuStella MZ's Items & Equips Core installed, you will gain
 * access to new notetags that govern if some items, weapons, or armors can
 * appear in shops during specific times or dates. This can make way for the
 * idea of seasonal items and the like where certain holiday cookies are
 * available during the winter and cool drinks are available during summers.
 * 
 * Additionally, you can have price changes depending on seasons and times.
 * Is it almost time for the bakery to close, make the items cheaper around
 * then. What about the holiday season? Make them cheaper again. Make your
 * players feel the discount frenzy.
 * 
 * ---
 *
 * VisuMZ_1_MessageCore
 *
 * If you have VisuStella MZ's Message Core installed, you can access the new
 * text codes added through this plugin to quickly display times and dates. A
 * few of these text codes are also used to display seasons, weekdays, parts of
 * the day cycle, and more. This can be used with both Game Time and Real Time
 * vocabularies.
 *
 * ---
 * 
 * VisuMZ_1_SkillsStatesCore
 * 
 * Installing VisuStella MZ's Skills & States Core gives you access to several
 * special notetags that allow you to take advantage of the Date & Time System.
 * 
 * Some of these notetags make it so that some skills can only be used during
 * specific seasons or times of the day. For example, the skill "Moon Beam" can
 * only be used during the Night hours. Other things like "Summer Heat" can
 * only be used during the Summer months.
 * 
 * Other notetags involve changing up how much certain skills cost for MP, HP,
 * TP, and more. A skill like "Icicle Rain" might cost 200% less MP during the
 * Summer months while "Solarbeam" might cost 50% less MP during Day hours.
 * 
 * Damage can also be affected by dates and times. Skills like "Vine Whip" can
 * deal more damage during Spring months and skills like "Nocturnal Healing"
 * might yield less HP recovery during non-Night hours.
 * 
 * State turns can also benefit from these effects. A "Sleep" state might last
 * a couple of more turns during the Night hours while "Burn" wouldn't last as
 * long during Winter months.
 * 
 * ---
 * 
 * VisuMZ_1_SaveCore
 * 
 * Those using the VisuStella MZ Save Core plugin can gain access to another
 * feature when used together with this plugin. If the player loads a save file
 * then the game will record the time difference upon loading in minutes onto a
 * variable. This means that you can detect how long the player has been away
 * from the game offline and use that as a game mechanic.
 * 
 * In order for this mechanic to work, the Save Core must be implemented, save
 * the game (with this plugin installed), and then load it. If a save was made
 * before this plugin is installed, loading the old save file won't give out a
 * time difference. This is not an error as it is moreso a condition has not
 * been first met.
 * 
 * This uses Real Time and is based off the player's PC date and time settings.
 * For what it's worth, it's possible for the player to "cheat" using time
 * travel shenanigans, but just keep in mind that if a player travels backwards
 * in time, the variable's value will be negative. Use that information however
 * you want.
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
 * If you have using VisuStella MZ's Lighting Effects plugin, tints/tones will
 * not be used, but instead, overlay values will be. This is so that the
 * overlay can utilize the lighting system in play. Do not be surprised if any
 * changes to this plugin's tone-related Plugin Parameters do nothing as long
 * as Lighting Effects is enabled.
 * 
 * ---
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * The following are notetags that have been added through this plugin. These
 * notetags will not work with your game if this plugin is OFF or not present.
 *
 * ---
 * 
 * === Time-Type-Related Notetags ===
 * 
 * ---
 * 
 * <Time System: None>
 * <Time System: Game>
 * <Time System: Real>
 * 
 * - Used for: Map Notetags
 * - Insert one of these notetags into your map's notebox and it will change
 *   the time type to the desired type.
 * - If this notetag is not used, use the default Time System type declared in
 *   the Plugin Parameters.
 * 
 * ---
 * 
 * <Pause Game Time>
 * 
 * - Used for: Map Notetags
 * - While the player is on this map, prevent Game Time from progressing
 *   forward.
 * - This does NOT apply to Real Time.
 * - The Plugin Command to pause/unpause Game Time will have no effect on any
 *   map that has this notetag.
 * 
 * ---
 * 
 * === Time Tone-Related Notetags ===
 * 
 * ---
 * 
 * <No Time Tone>
 * <Time Tone>
 * 
 * - Used for: Map Notetags
 * - Insert one of these notetags into your map to decide if you want the map
 *   to use the time-based screen tone (or overlay for those using the
 *   VisuMZ_2_LightingEffects plugin).
 *   - Places where you wouldn't want time tones would be indoor areas where
 *     the screen tone/overlay wouldn't matter.
 *   - Places where you would want to use time tones would be outdoor areas
 *     where the screen tone/overlay would matter.
 * - If this notetag is not used, use the default Time Tone type declared in
 *   the Plugin Parameters.
 * 
 * ---
 * 
 * === HUD-Related Notetags ===
 * 
 * ---
 * 
 * <Show Date Time HUD>
 * <Hide Date Time HUD>
 * 
 * - Used for: Map Notetags
 * - Insert one of these notetags into your map to decide if you want the map
 *   to show the Date/Time HUD or not.
 *   - If the player has opted to hide the Date/Time HUD in the options, that
 *     will take priority over the map notetag deciding to show it.
 *   - If the game dev opted to hide the Date/Time HUD through Plugin Commands,
 *     that will take priority over the map notetag deciding to show it.
 * - If this notetag is not used, use the default setting visuals declared in
 *   the Plugin Parameters.
 * 
 * ---
 * 
 * === Battle-Related Notetags ===
 * 
 * ---
 * 
 * <Encounter Hour: x>
 * <Encounter Hours: x, x, x>
 * 
 * <Encounter Weekday: x>
 * <Encounter Weekdays: x, x, x>
 * 
 * <Encounter Date: x>
 * <Encounter Dates: x, x, x>
 * 
 * <Encounter Month: x>
 * <Encounter Months: x, x, x>
 * 
 * - Used for: Troop Page Comment Tags
 * - Requires VisuMZ_1_BattleCore!
 * - Makes this encounter only appear during the specified hours, weekdays,
 *   dates, and/or months.
 * - Replace 'x' with a number representing the hour, weekday, date, or month.
 *   - Hours start at 0.
 *   - Weekdays, dates, and months start at 1.
 *   - Insert multiple 'x' values to cover more instances.
 * - You can use multiple combinations of types together, like in order to make
 *   a troop encounter that only occurs during the last day of the year by
 *   using the Month and Date comment tags together.
 * - This will NOT work with a Base Troop. You will get an alert saying so.
 *   - Why? Because this can cause all of the troops in the game to just shut
 *     off and you don't want that.
 * 
 * ---
 * 
 * <Encounter Season: type>
 * <Encounter Seasons: type, type, type>
 * 
 * <Encounter Cycle: type>
 * <Encounter Cycle: type, type, type>
 * 
 * - Used for: Troop Page Comment Tags
 * - Requires VisuMZ_1_BattleCore!
 * - Makes this encounter only appear during the specified seasons or parts of
 *   the day cycle.
 * - Replace 'type' with a string representing the season or day cycle type.
 *   - Seasons are: "spring", "summer", "autumn", "winter" (no quotes).
 *   - Cycles are: "dawn", "day", "dusk", "night" (no quotes).
 *   - Insert multiple 'type' values to cover more instances.
 * - You can use multiple combinations of types together, like in order to make
 *   a troop encounter that only occurs during winter and at night by using the
 *   two comment tags together.
 * - This will NOT work with a Base Troop. You will get an alert saying so.
 *   - Why? Because this can cause all of the troops in the game to just shut
 *     off and you don't want that.
 * 
 * ---
 * 
 * <season Battleback1: filename>
 * <season Battleback2: filename>
 * 
 * - Used for: Map Notetags
 * - Requires VisuMZ_1_BattleCore!
 * - Changes the primary map battleback(s) to the designated 'filename' when
 *   the player has entered the map at a specific 'season'.
 *   - If the player has entered the map at a specific 'season', but time has
 *     moved forward and the season has changed, the season will be whatever it
 *     was upon the time the player has entered in order to prevent any weird
 *     and out of place transitions from happening.
 * - Replace 'season' with a string representing the season.
 *   - Seasons are: "spring", "summer", "autumn", "winter" (no quotes).
 * - Replace 'filename' with the filename of the graphic to use. Do not insert
 *   any extensions. This means the file 'Castle1.png' will be only inserted
 *   as 'Castle1' without the '.png' at the end.
 * - Insert multiples of these notetags to declare different settings for
 *   different seasons.
 * - *NOTE: This will override any specified battleback settings.
 * 
 * ---
 * 
 * <season Region x Battleback1: filename>
 * <season Region x Battleback2: filename>
 * 
 * - Used for: Map Notetags
 * - Requires VisuMZ_1_BattleCore!
 * - Changes the primary map battleback(s) to the designated 'filename' when
 *   the player has entered the map at a specific 'season' and while on a
 *   specific 'region' on the map.
 *   - If the player has entered the map at a specific 'season', but time has
 *     moved forward and the season has changed, the season will be whatever it
 *     was upon the time the player has entered in order to prevent any weird
 *     and out of place transitions from happening.
 * - Replace 'season' with a string representing the season.
 *   - Seasons are: "spring", "summer", "autumn", "winter" (no quotes).
 * - Replace 'x' with a number representing the region ID you wish to use.
 * - Replace 'filename' with the filename of the graphic to use. Do not insert
 *   any extensions. This means the file 'Castle1.png' will be only inserted
 *   as 'Castle1' without the '.png' at the end.
 * - Insert multiples of these notetags to declare different settings for
 *   different season and region combinations.
 * - *NOTE: This will override any specified battleback settings.
 * 
 * ---
 * 
 * === Tileset-Related Notetags ===
 * 
 * ---
 * 
 * <type Swap To: x>
 * 
 * - Used for: Tileset Notetags
 * - If a map loads a tileset with this notetag and it happens to be that
 *   season, swap to 'x' tileset instead and repeat the check.
 *   - The repeated check will only last for 5 checks max for each map loading.
 * - Replace 'type' with a string representing the season or cycle.
 *   - Seasons are: "spring", "summer", "autumn", "winter" (no quotes).
 *   - Cycles are: "dawn", "day", "dusk", "night" (no quotes).
 *   - Priority will be given to seasons first before cycles.
 *   - Insert multiples of this notetag to cover different cases.
 * - Each successful check will result in another check on the newer tileset
 *   for up to 5 times.
 * - This can be chained in such a way where an "Outdoor" tileset can chain
 *   into something like "Summer Outdoor", which can then be chained into
 *   "Summer Outdoor Day" or "Summer Outdoor Night" for more accuracy.
 * - Priority will be given to seasons first, then  the day cycles (dawn, day,
 *   dusk, night). This way, you can ensure that the tileset you're using
 *   matches the conditions of the season or time of day if so desired.
 * - If time changes into a new season or day cycle while on the map, there
 *   won't be any changes made immediately. Instead, the player must exit and
 *   reenter the map for the changes to be seen. This is to prevent any awkward
 *   changes and transitions that may occur otherwise.
 * 
 * ---
 * 
 * <Bypass Tileset Swap>
 * 
 * - Used for: Map Notetags
 * - If a map with this notetag loads a tileset that would normally swap out,
 *   this will prevent it from happening.
 * - This can be used for things like flashbacks where it would make sense for
 *   a specific tileset to be used as opposed to the current season's variant.
 * 
 * ---
 * 
 * === Shop-Related Notetags ===
 * 
 * ---
 * 
 * <Shop Buy Hour: x>
 * <Shop Buy Hours: x, x, x>
 * 
 * <Shop Buy Weekday: x>
 * <Shop Buy Weekdays: x, x, x>
 * 
 * <Shop Buy Date: x>
 * <Shop Buy Dates: x, x, x>
 * 
 * <Shop Buy Month: x>
 * <Shop Buy Months: x, x, x>
 * 
 * - Used for: Item, Weapon, Armor Notetags
 * - Requires VisuMZ_1_ItemsEquipsCore!
 * - These shop listings can only be bought at specific hours, weekdays, dates,
 *   and/or months.
 * - Replace 'x' with a number representing the hour, weekday, date, or month.
 *   - Hours start at 0.
 *   - Weekdays, dates, and months start at 1.
 *   - Insert multiple 'x' values to cover more instances.
 * - You can use multiple combinations of types together, like in order to make
 *   a shop listing that only appears during the last day of the year by using
 *   the Month and Date notetags together.
 * 
 * ---
 * 
 * <Shop Buy Season: type>
 * <Shop Buy Seasons: type, type, type>
 * 
 * <Shop Buy Cycle: type>
 * <Shop Buy Cycle: type, type, type>
 * 
 * - Used for: Item, Weapon, Armor Notetags
 * - Requires VisuMZ_1_ItemsEquipsCore!
 * - Makes this shop listing only appear during the specified seasons or parts
 *   of the day cycle.
 * - Replace 'type' with a string representing the season or day cycle type.
 *   - Seasons are: "spring", "summer", "autumn", "winter" (no quotes).
 *   - Cycles are: "dawn", "day", "dusk", "night" (no quotes).
 *   - Insert multiple 'type' values to cover more instances.
 * - You can use multiple combinations of types together, like in order to make
 *   a shop listing that onlappears occurs during winter and at night by using
 *   the two notetags together.
 * 
 * ---
 * 
 * <Shop Price Hour x: y%>
 * <Shop Price Hours x, x, x: y%>
 * 
 * <Shop Price Weekday x: y%>
 * <Shop Price Weekdays x, x, x: y%>
 * 
 * <Shop Price Date x: y%>
 * <Shop Price Dates x, x, x: y%>
 * 
 * <Shop Price Month x: y%>
 * <Shop Price Months x, x, x: y%>
 * 
 * - Used for: Item, Weapon, Armor Notetags
 * - Requires VisuMZ_1_ItemsEquipsCore!
 * - These shop listings will have their (gold only) prices affected by 'y%'
 *   when it is the specific hour, weekday, date, and/or month.
 * - This ONLY affects gold prices and does not affect anything else that may
 *   be added by other plugins such as VisuMZ_2_MoreCurrencies.
 * - Replace 'x' with a number representing the hour, weekday, date, or month.
 *   - Hours start at 0.
 *   - Weekdays, dates, and months start at 1.
 *   - Insert multiple 'x' values to cover more instances.
 * - Replace 'y' with a number representing the percent change for the price.
 * - If multiples of these notetags are used together, the effects will be
 *   multiplicative.
 *   - For example, if price drops by 50% at the last hours of the work day,
 *     and the price also drops by 50% at the last day of the week, then the
 *     last hours of the last day of the week will have the price drop to 25%.
 * 
 * ---
 * 
 * <Shop Price Spring Months: y%>
 * <Shop Price Summer Months: y%>
 * <Shop Price Autumn Months: y%>
 * <Shop Price Winter Months: y%>
 * 
 * <Shop Price Weekdays Only: y%>
 * <Shop Price Weekends Only: y%>
 * 
 * <Shop Price Dawn Hours: y%>
 * <Shop Price Day Hours: y%>
 * <Shop Price Dusk Hours: y%>
 * <Shop Price Night Hours: y%>
 * 
 * - Used for: Item, Weapon, Armor Notetags
 * - Requires VisuMZ_1_ItemsEquipsCore!
 * - These shop listings will have their (gold only) prices affected by 'y%'
 *   when it is the specific season, weekday type, or day cycle.
 * - This ONLY affects gold prices and does not affect anything else that may
 *   be added by other plugins such as VisuMZ_2_MoreCurrencies.
 * - Replace 'y' with a number representing the percent change for the price.
 * - If multiples of these notetags are used together, the effects will be
 *   multiplicative.
 *   - For example, if price drops by 50% at the dusk hours of the work day,
 *     and the price also drops by 50% at the weekend, then the dusk hours of a
 *     weekend will have the price drop to 25%.
 * 
 * ---
 * 
 * === Skill-Related Notetags ===
 * 
 * ---
 * 
 * <Require Hour x: y%>
 * <Require Hours x, x, x: y%>
 * 
 * <Require Weekday x: y%>
 * <Require Weekdays x, x, x: y%>
 * 
 * <Require Date x: y%>
 * <Require Dates x, x, x: y%>
 * 
 * <Require Month x: y%>
 * <Require Months x, x, x: y%>
 * 
 * - Used for: Skill Notetags
 * - Requires VisuMZ_1_SkillsStatesCore!
 * - These skills can only be used during specific hours, weekdays, dates,
 *   and/or months.
 * - Replace 'x' with a number representing the hour, weekday, date, or month.
 *   - Hours start at 0.
 *   - Weekdays, dates, and months start at 1.
 *   - Insert multiple 'x' values to cover more instances.
 * - You can use multiple combinations of types together, like in order to make
 *   a skill that can only be used during the first month of the year and the
 *   first few days of the year by using those specific notetags together.
 * 
 * ---
 * 
 * <Require Season: type>
 * <Require Seasons: type, type, type>
 * 
 * <Require Cycle: type>
 * <Require Cycle: type, type, type>
 * 
 * - Used for: Skill Notetags
 * - Requires VisuMZ_1_SkillsStatesCore!
 * - These skills can only be used during specific seasons or day cycles.
 * - Replace 'type' with a string representing the season or day cycle type.
 *   - Seasons are: "spring", "summer", "autumn", "winter" (no quotes).
 *   - Cycles are: "dawn", "day", "dusk", "night" (no quotes).
 *   - Insert multiple 'type' values to cover more instances.
 * - You can use multiple combinations of types together, like in order to make
 *   a skill that can only be used during winter nights by using those specific
 *   notetags together.
 * 
 * ---
 * 
 * <type Cost If Hour x: y%>
 * <type Cost If Hours x, x, x: y%>
 * 
 * <type Cost If Weekday x: y%>
 * <type Cost If Weekdays x, x, x: y%>
 * 
 * <type Cost If Date x: y%>
 * <type Cost If Dates x, x, x: y%>
 * 
 * <type Cost If Month x: y%>
 * <type Cost If Months x, x, x: y%>
 * 
 * - Used for: Item, Weapon, Armor Notetags
 * - Requires VisuMZ_1_SkillsStatesCore!
 * - This skill's cost 'type' will be affected by 'y%' when it is the specific
 *   hour, weekday, date, and/or month.
 * - Replace 'type' with either 'HP', 'MP', or 'TP' to represent the cost type
 *   that you wish to affect.
 * - Replace 'x' with a number representing the hour, weekday, date, or month.
 *   - Hours start at 0.
 *   - Weekdays, dates, and months start at 1.
 *   - Insert multiple 'x' values to cover more instances.
 * - Replace 'y' with a number representing the percent change for the skill
 *   cost type.
 * - If multiples of these notetags are used together, the effects will be
 *   multiplicative.
 *   - For example, if skill cost drops by 50% at the last hours of the day,
 *     and the skill cost also drops by 50% at the last day of the week, then
 *     the last hours of the last day of the week will have the cost drop to
 *     a multiplicative 25%.
 * 
 * ---
 * 
 * <type Cost If Spring Months: y%>
 * <type Cost If Summer Months: y%>
 * <type Cost If Autumn Months: y%>
 * <type Cost If Winter Months: y%>
 * 
 * <type Cost If Weekdays Only: y%>
 * <type Cost If Weekends Only: y%>
 * 
 * <type Cost If Dawn Hours: y%>
 * <type Cost If Day Hours: y%>
 * <type Cost If Dusk Hours: y%>
 * <type Cost If Night Hours: y%>
 * 
 * - Used for: Item, Weapon, Armor Notetags
 * - Requires VisuMZ_1_SkillsStatesCore!
 * - This skill's cost 'type' will be affected by 'y%' when it is the specific
 *   season, weekday type, or day cycle.
 * - Replace 'type' with either 'HP', 'MP', or 'TP' to represent the cost type
 *   that you wish to affect.
 * - Replace 'y' with a number representing the percent change for the skill
 *   cost type.
 * - If multiples of these notetags are used together, the effects will be
 *   multiplicative.
 *   - For example, if skill cost drops by 50% at the dusk hours of the day,
 *     and the skill cost also drops by 50% at the weekend, then the dusk hours
 *     of a weekend will have the skill cost drop to 25%.
 * 
 * ---
 * 
 * <Damage If Hour x: y%>
 * <Damage If Hours x, x, x: y%>
 * 
 * <Healing If Hour x: y%>
 * <Healing If Hours x, x, x: y%>
 * 
 * <Damage If Weekday x: y%>
 * <Damage If Weekdays x, x, x: y%>
 * 
 * <Healing If Weekday x: y%>
 * <Healing If Weekdays x, x, x: y%>
 * 
 * <Damage If Date x: y%>
 * <Damage If Dates x, x, x: y%>
 * 
 * <Healing If Date x: y%>
 * <Healing If Dates x, x, x: y%>
 * 
 * <Damage If Month x: y%>
 * <Damage If Months x, x, x: y%>
 * 
 * <Healing If Month x: y%>
 * <Healing If Months x, x, x: y%>
 * 
 * - Used for: Item, Weapon, Armor Notetags
 * - Requires VisuMZ_1_SkillsStatesCore!
 * - This skill's damage or healing dealt will be affected by 'y%' when it is
 *   the specific hour, weekday, date, and/or month.
 * - Replace 'x' with a number representing the hour, weekday, date, or month.
 *   - Hours start at 0.
 *   - Weekdays, dates, and months start at 1.
 *   - Insert multiple 'x' values to cover more instances.
 * - Replace 'y' with a number representing the percent change for the skill's
 *   dealt damage or healing.
 * - If multiples of these notetags are used together, the effects will be
 *   multiplicative.
 *   - For example, if skill damage/healing drops by 50% at the last hours of
 *     the day, and the skill damage/healing also drops by 50% at the last day
 *     of the week, then the last hours of the last day of the week will have
 *     the damage/healing drop to a multiplicative 25%.
 * 
 * ---
 * 
 * <Damage If Spring Months: y%>
 * <Damage If Summer Months: y%>
 * <Damage If Autumn Months: y%>
 * <Damage If Winter Months: y%>
 * 
 * <Healing If Spring Months: y%>
 * <Healing If Summer Months: y%>
 * <Healing If Autumn Months: y%>
 * <Healing If Winter Months: y%>
 * 
 * <Damage If Weekdays Only: y%>
 * <Damage If Weekends Only: y%>
 * 
 * <Healing If Weekdays Only: y%>
 * <Healing If Weekends Only: y%>
 * 
 * <Damage If Dawn Hours: y%>
 * <Damage If Day Hours: y%>
 * <Damage If Dusk Hours: y%>
 * <Damage If Night Hours: y%>
 * 
 * <Healing If Dawn Hours: y%>
 * <Healing If Day Hours: y%>
 * <Healing If Dusk Hours: y%>
 * <Healing If Night Hours: y%>
 * 
 * - Used for: Item, Weapon, Armor Notetags
 * - Requires VisuMZ_1_SkillsStatesCore!
 * - This skill's damage or healing dealt will be affected by 'y%' when it is
 *   the specific season, weekday type, or day cycle.
 * - Replace 'y' with a number representing the percent change for the skill
 *   cost type.
 * - If multiples of these notetags are used together, the effects will be
 *   multiplicative.
 *   - For example, if skill damage/healing drops by 50% at the dusk hours of
 *     the day, and the skill damage/healing also drops by 50% at the weekend,
 *     then the dusk hours of a weekend will have the damage/heal drop to 25%.
 * 
 * ---
 * 
 * ===
 * 
 * === State-Related Notetags ===
 * 
 * ---
 * 
 * <Turns If Hour x: +y>
 * <Turns If Hour x: -y>
 * 
 * <Turns If Hours x, x, x: +y>
 * <Turns If Hours x, x, x: -y>
 * 
 * <Turns If Weekday x: +y>
 * <Turns If Weekday x: -y>
 * 
 * <Turns If Weekdays x, x, x: +y>
 * <Turns If Weekdays x, x, x: -y>
 * 
 * <Turns If Date x: +y>
 * <Turns If Date x: -y>
 * 
 * <Turns If Dates x, x, x: +y>
 * <Turns If Dates x, x, x: -y>
 * 
 * <Turns If Month x: +y>
 * <Turns If Month x: -y>
 * 
 * <Turns If Months x, x, x: +y>
 * <Turns If Months x, x, x: -y>
 * 
 * - Used for: State Notetags
 * - Requires VisuMZ_1_SkillsStatesCore!
 * - These state durations will have their turn counts affected by '+y' or '-y'
 *   when it is the specific hour, weekday, date, and/or month.
 * - Replace 'x' with a number representing the hour, weekday, date, or month.
 *   - Hours start at 0.
 *   - Weekdays, dates, and months start at 1.
 *   - Insert multiple 'x' values to cover more instances.
 * - Replace 'y' with a number representing the turn count change.
 * - If multiples of these notetags are used together, the effects will be
 *   additive.
 *   - For example, if state's turn count drops by -1 at the last hours of the
 *     day, and state's turn count also drops by -1 at the last day of the
 *     week, then the last hours of the last day of the week will have the
 *     state's turn count drop by -2.
 * 
 * ---
 * 
 * <Turns If Spring Months: +y>
 * <Turns If Spring Months: -y>
 * 
 * <Turns If Summer Months: +y>
 * <Turns If Summer Months: -y>
 * 
 * <Turns If Autumn Months: +y>
 * <Turns If Autumn Months: -y>
 * 
 * <Turns If Winter Months: +y>
 * <Turns If Winter Months: -y>
 * 
 * <Turns If Weekdays Only: +y>
 * <Turns If Weekdays Only: -y>
 * 
 * <Turns If Weekends Only: +y>
 * <Turns If Weekends Only: -y>
 * 
 * <Turns If Dawn Hours: +y>
 * <Turns If Dawn Hours: -y>
 * 
 * <Turns If Day Hours: +y>
 * <Turns If Day Hours: -y>
 * 
 * <Turns If Dusk Hours: +y>
 * <Turns If Dusk Hours: -y>
 * 
 * <Turns If Night Hours: +y>
 * <Turns If Night Hours: -y>
 * 
 * - Used for: State Notetags
 * - Requires VisuMZ_1_SkillsStatesCore!
 * - These state durations will have their turn counts affected by '+y' or '-y'
 *   when it is the specific season, weekday type, or day cycle.
 * - Replace 'y' with a number representing the turn count change.
 * - If multiples of these notetags are used together, the effects will be
 *   additive.
 *   - For example, if state's turn count drops by -1 at the dusk hours of the
 *     day, and state's turn count also drops by -1 on weekends, then the dusk
 *     hours of a weekend day will have the state's turn count drop by -2.
 * 
 * ---
 *
 * ============================================================================
 * Available Text Codes
 * ============================================================================
 *
 * The following are text codes that you may use with this plugin. 
 *
 * === Game Time-Related Text Codes ===
 * 
 * ---
 *
 * --------------------   -----------------------------------------------------
 * Text Code              Effect (Requires VisuMZ_1_MessageCore)
 * --------------------   -----------------------------------------------------
 * 
 * <GameYear>             Returns the Game Time year's number.
 * <GameYearP>            Returns the Game Time year's number twice padded.
 * 
 * <GameMonth>            Returns the Game Time month's name.
 * <GameMonthA>           Returns the Game Time month's abbreviated name.
 * <GameMonthN>           Returns the Game Time month's number.
 * <GameMonthP>           Returns the Game Time month's number twice padded.
 * 
 * <GameSeason>           Returns the Game Time current season's name.
 * 
 * <GameDate>             Returns the Game Time date's number.
 * <GameDateP>            Returns the Game Time date's number twice padded.
 * 
 * <GameWeekday>          Returns the Game Time weekday's name.
 * <GameWeekdayA>         Returns the Game Time weekday's abbreviated name.
 * <GameWeekdayT>         Returns the Game Time weekday's type.
 * 
 * <GameHour>             Returns the Game Time hour's number.
 * <GameHourP>            Returns the Game Time hour's number twice padded.
 * <GameHourM>            Returns the Game Time military hour's number.
 * <GameHourP>            Returns the Game Time military hour's number padded.
 * 
 * <GameMinute>           Returns the Game Time minute's number.
 * <GameMinuteP>          Returns the Game Time minute's number twice padded.
 * 
 * <GameMeridiem>         Returns the Game Time meridiem (AM/PM).
 * 
 * <GameDayCycle>         Returns the Game Time day cycle.
 * 
 * ---
 *
 * === Real Time-Related Text Codes ===
 * 
 * ---
 *
 * --------------------   -----------------------------------------------------
 * Text Code              Effect (Requires VisuMZ_1_MessageCore)
 * --------------------   -----------------------------------------------------
 * 
 * <RealYear>             Returns the Real Time year's number.
 * <RealYearP>            Returns the Real Time year's number twice padded.
 * 
 * <RealMonth>            Returns the Real Time month's name.
 * <RealMonthA>           Returns the Real Time month's abbreviated name.
 * <RealMonthN>           Returns the Real Time month's number.
 * <RealMonthP>           Returns the Real Time month's number twice padded.
 * 
 * <RealSeason>           Returns the Real Time current season's name.
 * 
 * <RealDate>             Returns the Real Time date's number.
 * <RealDateP>            Returns the Real Time date's number twice padded.
 * 
 * <RealWeekday>          Returns the Real Time weekday's name.
 * <RealWeekdayA>         Returns the Real Time weekday's abbreviated name.
 * <RealWeekdayT>         Returns the Real Time weekday's type.
 * 
 * <RealHour>             Returns the Real Time hour's number.
 * <RealHourP>            Returns the Real Time hour's number twice padded.
 * <RealHourM>            Returns the Real Time military hour's number.
 * <RealHourP>            Returns the Real Time military hour's number padded.
 * 
 * <RealMinute>           Returns the Real Time minute's number.
 * <RealMinuteP>          Returns the Real Time minute's number twice padded.
 * 
 * <RealSecond>           Returns the Real Time second's number.
 * <RealSecondP>          Returns the Real Time second's number twice padded.
 * 
 * <RealMeridiem>         Returns the Real Time meridiem (AM/PM).
 * 
 * <RealDayCycle>         Returns the Real Time day cycle.
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
 * === Game Time Plugin Commands ===
 * 
 * ---
 * 
 * Game Time: Change Date To
 * - Changes the Game Time's date to a specific date.
 * - Does not affect time. Does NOT affect time.
 * 
 *   Year:
 *   - Changes Game Time's year to this.
 *   - You may use JavaScript code.
 * 
 *   Month:
 *   - Changes Game Time's month to this.
 *   - You may use JavaScript code.
 * 
 *     Allow Overflow?:
 *     - If allow overflow, excess months increase year count.
 *     - If not, excess months are clamped to what's allowed.
 * 
 *   Date:
 *   - Changes Game Time's date to this.
 *   - You may use JavaScript code. Overflow is calculated.
 * 
 *     Allow Overflow?:
 *     - If allow overflow, excess days increase month count.
 *     - If not, excess days are clamped to what's allowed.
 * 
 * ---
 * 
 * Game Time: Change Time To
 * - Changes the Game Time's time to a specific time.
 * - Does not affect time. CAN affect date and weekday.
 * 
 *   Hour:
 *   - Changes Game Time's hour to this.
 *   - You may use JavaScript code. Excess hours changes date.
 * 
 *     Allow Overflow?:
 *     - If allow overflow, excess hours increase date count.
 *     - If not, excess hours are clamped to what's allowed.
 * 
 *   Minute:
 *   - Changes Game Time's minute to this.
 *   - You may use JavaScript code. Overflow is calculated.
 * 
 *     Allow Overflow?:
 *     - If allow overflow, excess minutes increase hour count.
 *     - If not, excess minutes are clamped to what's allowed.
 * 
 * ---
 * 
 * Game Time: Pause Time Start
 * - Pauses time from going forward while in Game Time.
 * - This only pauses Game Time. Events and Timers can still move.
 * 
 * ---
 * 
 * Game Time: Pause Time End
 * - Allows Game Time to resume moving.
 * 
 * ---
 * 
 * Game Time: Record to Variable(s)
 * - Records game Time data to select variable(s).
 * - This only records the data for this moment.
 * 
 *   Calendar:
 * 
 *     Year Variable:
 *     - Select a variable to record the year.
 *     - Leave at 0 to not use.
 * 
 *     Month Variable:
 *     - Select a variable to record the month.
 *     - Leave at 0 to not use.
 * 
 *     Date Variable:
 *     - Select a variable to record the date.
 *     - Leave at 0 to not use.
 * 
 *     Full Date Variable:
 *     - Select a variable to record the full date.
 *     - Leave at 0 to not use.
 *     - Result is year + month (2 digits) + date (2 digits)
 *       - For example, Year 2, Month 4, Date 12 will yield 20412
 * 
 *   Weekday:
 * 
 *     Weekday Variable:
 *     - Select a variable to record the weekday.
 *     - Leave at 0 to not use.
 * 
 *   Time:
 * 
 *     Hour Variable:
 *     - Select a variable to record the hour.
 *     - Leave at 0 to not use.
 * 
 *     Minute Variable:
 *     - Select a variable to record the minute.
 *     - Leave at 0 to not use.
 * 
 *     Full Time Variable:
 *     - Select a variable to record the full time.
 *     - Leave at 0 to not use.
 *     - Result is hour + minutes (2 digits) + seconds (2 digits)
 *       - For example, Hour 16, Minute 8, Seconds 0 will yield 160800
 * 
 * ---
 * 
 * Game Time: Time Dilation Change
 * - Changes how fast it takes for a minute to pass in Game Time.
 * 
 *   MS Per Game Minute:
 *   - How many milliseconds will count as a game minute?
 *   - 1000 milliseconds = 1 real life second.
 * 
 * ---
 * 
 * Game Time: Time Dilation Clear
 * - Clears the time dilation and changes it back to default settings based on
 *   Plugin Parameters.
 * 
 * ---
 * 
 * === Real Time Plugin Commands ===
 * 
 * ---
 * 
 * Real Time: Record to Variable(s)
 * - Records Real Time data to select variable(s).
 * - This only records the data for this moment.
 * 
 *   Calendar:
 * 
 *     Year Variable:
 *     - Select a variable to record the year.
 *     - Leave at 0 to not use.
 * 
 *     Month Variable:
 *     - Select a variable to record the month.
 *     - Leave at 0 to not use.
 * 
 *     Date Variable:
 *     - Select a variable to record the date.
 *     - Leave at 0 to not use.
 * 
 *     Full Date Variable:
 *     - Select a variable to record the full date.
 *     - Leave at 0 to not use.
 *     - Result is year + month (2 digits) + date (2 digits)
 *       - For example, Year 2, Month 4, Date 12 will yield 20412
 * 
 *   Weekday:
 * 
 *     Weekday Variable:
 *     - Select a variable to record the weekday.
 *     - Leave at 0 to not use.
 * 
 *   Time:
 * 
 *     Hour Variable:
 *     - Select a variable to record the hour.
 *     - Leave at 0 to not use.
 * 
 *     Minute Variable:
 *     - Select a variable to record the minute.
 *     - Leave at 0 to not use.
 * 
 *     Second Variable:
 *     - Select a variable to record the second.
 *     - Leave at 0 to not use.
 * 
 *     Full Time Variable:
 *     - Select a variable to record the full time.
 *     - Leave at 0 to not use.
 *     - Result is hour + minutes (2 digits) + seconds (2 digits)
 *       - For example, Hour 16, Minute 8, Seconds 0 will yield 160800
 * 
 * ---
 * 
 * === HUD Plugin Commands ===
 * 
 * ---
 * 
 * HUD: Show/Hide
 * - Makes the Date & Time HUD visible or hidden.
 * - Does not affect maps with forced hidden notetags.
 * 
 *   Show/Hide?:
 *   - Shows/hides Date & Time HUD on the map scene.
 * 
 * ---
 *
 * ============================================================================
 * Script Calls
 * ============================================================================
 *
 * The following are Script Calls that can be used with this plugin. These are
 * made for JavaScript proficient users. We are not responsible if you use them
 * incorrectly or for unintended usage.
 *
 * ---
 * 
 * === Date and Time-Related Script Calls ===
 * 
 * ---
 *
 * TimeManager.getYear()
 * 
 * - Gets the current year.
 * - Works for both Game Time and Real Time.
 *   - The value received will depend on which mode you're using at the moment.
 * - Returns a numeric value.
 *
 * ---
 *
 * TimeManager.getMonth()
 * 
 * - Gets the current month.
 * - Works for both Game Time and Real Time.
 *   - The value received will depend on which mode you're using at the moment.
 * - Returns a numeric value.
 *   - The first month starts at 1.
 *
 * ---
 *
 * TimeManager.getDate()
 * 
 * - Gets the current date.
 * - Works for both Game Time and Real Time.
 *   - The value received will depend on which mode you're using at the moment.
 * - Returns a numeric value.
 *   - The first date starts at 1.
 *
 * ---
 *
 * TimeManager.getWeekday()
 * 
 * - Gets the current weekday.
 * - Works for both Game Time and Real Time.
 *   - The value received will depend on which mode you're using at the moment.
 * - Returns a numeric value.
 *   - The first weekday starts at 1.
 *
 * ---
 *
 * TimeManager.getHour()
 * 
 * - Gets the current hour.
 * - Works for both Game Time and Real Time.
 *   - The value received will depend on which mode you're using at the moment.
 * - Returns a numeric value.
 *   - The first hour starts at 0.
 *
 * ---
 *
 * TimeManager.getMinute()
 * 
 * TimeManager.getMinuteRaw()
 * 
 * - Gets the current minute.
 * - Works for both Game Time and Real Time.
 *   - The value received will depend on which mode you're using at the moment.
 *   - If you are using Game Time, you may be using the Plugin Parameter called
 *     "Round Minutes to 10s" where it only shows the minute count for every 10
 *     minutes. The Raw version will return the actual minute value while the
 *     non-raw version will show the selected version if enabled.
 * - Returns a numeric value.
 *   - The first minute starts at 0.
 *
 * ---
 *
 * TimeManager.getSecond()
 * 
 * - Gets the current minute.
 * - Only works for Real Time.
 * - Game Time does not use seconds and if you use this, you will always get 0.
 * - Returns a numeric value.
 *   - The first second starts at 0.
 *
 * ---
 *
 * TimeManager.checkSeason()
 * 
 * - Checks the current season based on what month it currently is.
 * - Works for both Game Time and Real Time.
 *   - The value received will depend on which mode you're using at the moment.
 * - Returns a numeric value.
 *   - 1 means Spring.
 *   - 2 means Summer.
 *   - 3 means Autumn.
 *   - 4 means Winter.
 *
 * ---
 *
 * TimeManager.checkWeekdayType()
 * 
 * - Checks the current weekday type based on what weekday it currently is.
 * - Works for both Game Time and Real Time.
 *   - The value received will depend on which mode you're using at the moment.
 * - Returns a numeric value.
 *   - 1 means Weekday.
 *   - 2 means Weekend.
 *
 * ---
 *
 * TimeManager.checkDayCycle()
 * 
 * - Checks the current day cycle based on what hour it currently is.
 * - Works for both Game Time and Real Time.
 *   - The value received will depend on which mode you're using at the moment.
 * - Returns a numeric value.
 *   - 1 means Dawn.
 *   - 2 means Day.
 *   - 3 means Dusk.
 *   - 4 means Night.
 *
 * ---
 *
 * TimeManager.forceRefreshHUD()
 * 
 * - For the moment you need force the HUD to refresh.
 * - Does not happen if you're not on the map and/or not using the HUD.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Default Settings
 * ============================================================================
 *
 * These are the default settings for the plugin that determines time type
 * and time-based screen tones/overlays.
 *
 * ---
 *
 * Default Settings
 * 
 *   Default Map Time Type:
 *   - What do you want to be the default time system?
 *   - Change per map with <Time System: x> notetag.
 *     - None - Time doesn't pass on most maps
 *     - Game - Time passes based on game rules
 *     - Real - Time passes based on real life
 * 
 *   Default Map Time Tone:
 *   - Do maps have time-based screen tones/tints?
 *   - Can change with <No Time Tone> or <Time Tone> notetags.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Game Time General Settings
 * ============================================================================
 *
 * Here are the general settings regarding Game Time.
 *
 * ---
 * 
 * Starting Data:
 * 
 *   Start Year:
 *   - What is the number of the starting year?
 * 
 *   Start Month:
 *   - What is the number of the starting month?
 * 
 *   Start Date:
 *   - What is the number of the starting date?
 * 
 *   Start Weekday:
 *   - What is the number of the starting weekday?
 * 
 *   Start Hour:
 *   - What is the number of the starting hour?
 * 
 *   Start Minute:
 *   - What is the number of the starting minute?
 * 
 * ---
 * 
 * Game Time Mechanics:
 * 
 *   MS Per Game Minute:
 *   - How many milliseconds will count as a game minute?
 *   - 1000 milliseconds = 1 real life second.
 * 
 *   Minutes in an Hour:
 *   - How many minutes are there in an hour?
 *   - This is for Game Time only.
 * 
 *   Round Minutes to 10s:
 *   - Rounds the displayed minutes to 10's so they only visually update every
 *     10 Game Time minutes.
 * 
 *   Hours in a Day:
 *   - How many hours are there in a day? This is for Game Time only.
 * 
 *   JS: Check Leap Year:
 *   - Code used to determine how a year is considered a leap year.
 * 
 * ---
 * 
 * Pause Conditions:
 * 
 *   If Event Running:
 *   - Pauses Game Time update if an event is running?
 *   - Doesn't apply to Parallels. Applies to Autorun.
 * 
 *   If Forced Player Move:
 *   - Pauses Game Time update if player movement is forced?
 *   - Doesn't apply to Parallels. Applies to Autorun.
 * 
 *   If Gather Followers:
 *   - Pauses Game Time update if followers are gathering?
 *   - Doesn't apply to Parallels. Applies to Autorun.
 * 
 *   If Vehicle Entry/Exit:
 *   - Pauses Game Time update if followers are gathering?
 *   - Doesn't apply to Parallels. Applies to Autorun.
 * 
 * ---
 * 
 * Month Structure:
 * 
 *   List of Months:
 *   - Here, adjust the in-game months for Game Time.
 *   - Months will occur in the order they're in.
 * 
 *     Name:
 *     - What is the name of the month?
 * 
 *     Abbreviation:
 *     - What is the abbreviation of this month?
 * 
 *     Total Days:
 *     - How many days are there in this month?
 * 
 *       Leap Month?:
 *       - Is this month a leap month?
 *       - It'll get an extra day each leap year.
 * 
 *     Season:
 *     - What season is this month a part of?
 *       - Spring
 *       - Summer
 *       - Autumn
 *       - Winter
 * 

 * 
 * ---
 * 
 * Weekday Structure:
 * 
 *   List of Weekdays:
 *   - Here, adjust the in-game weekdays for Game Time.
 *   - Weekdays will occur in the order they're in.
 *
 *     Name:
 *     - What is the name of this weekday?
 * 
 *     Abbreviation:
 *     - What is the abbreviation of this weekday?
 * 
 *     Weekday Type:
 *     - Is this day part of the weekdays or weekend?
 *       - Weekday
 *       - Weekend
 * 
 * ---
 * 
 * Day Structure:
 * 
 *   Dawn Hours:
 *   - What hours are considered "Dawn" hours?
 *   - This is for Game Time only.
 * 
 *   Day Hours:
 *   - What hours are considered "Day" hours?
 *   - This is for Game Time only.
 * 
 *   Dusk Hours:
 *   - What hours are considered "Dusk" hours?
 *   - This is for Game Time only.
 * 
 *   Night Hours:
 *   - What hours are considered "Night" hours?
 *   - This is for Game Time only.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Game Time Tone Settings
 * ============================================================================
 * 
 * These settings determine the screen tones used for Game Time and will occur
 * the order the hours appear.
 *
 * ---
 *
 * Tone Settings
 * 
 *   Tone:
 *   - What tone/tint is used for various Game Time hours?
 *   - Format: [Red, Green, Blue, Gray]. Starts at 0:00.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Game Time Overlay Settings
 * ============================================================================
 * 
 * These settings determine the screen tones used for Game Time and will occur
 * the order the hours appear.
 * 
 * Requires VisuMZ_2_LightingEffects!
 *
 * ---
 *
 * Overlay Settings
 * 
 *   Overlay:
 *   - What overlay is used for this hour? Starts at 0:00.
 *   - Format: #rrggbb.
 *   - Requires VisuMZ_2_LightingEffects!
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Game Time Variables & Switches
 * ============================================================================
 *
 * Adjust the variables and switches that record data here. These will be
 * automatically updated upon time changes.
 *
 * ---
 *
 * Calendar:
 * 
 *   Year Variable:
 *   - Select a variable to record the year.
 *   - Leave at 0 to not use.
 * 
 *   Month Variable:
 *   - Select a variable to record the month.
 *   - Leave at 0 to not use.
 * 
 *   Date Variable:
 *   - Select a variable to record the date.
 *   - Leave at 0 to not use.
 * 
 *   Full Date Variable:
 *   - Select a variable to record the full date.
 *   - Leave at 0 to not use.
 *   - Result is year + month (2 digits) + date (2 digits)
 *     - For example, Year 2, Month 4, Date 12 will yield 20412
 * 
 * ---
 * 
 * Weekday:
 * 
 *   Weekday Variable:
 *   - Select a variable to record the weekday.
 *   - Leave at 0 to not use.
 * 
 * ---
 * 
 * Time:
 * 
 *   Hour Variable:
 *   - Select a variable to record the hour.
 *   - Leave at 0 to not use.
 * 
 *   Minute Variable:
 *   - Select a variable to record the minute.
 *   - Leave at 0 to not use.
 * 
 *   Second Variable:
 *   - Select a variable to record the second.
 *   - Leave at 0 to not use.
 *   - Not available for Game Time.
 *
 *   Full Time Variable:
 *   - Select a variable to record the full time.
 *   - Leave at 0 to not use.
 *   - Result is hour + minutes (2 digits) + seconds (2 digits)
 *     - For example, Hour 16, Minute 8, Seconds 0 will yield 160800
 * 
 * ---
 * 
 * Seasons:
 * 
 *   Spring Switch:
 *   - Turns on when season is a "Spring" month.
 *   - Leave at 0 to not use.
 * 
 *   Summer Switch:
 *   - Turns on when season is a "Summer" month.
 *   - Leave at 0 to not use.
 * 
 *   Autumn Switch:
 *   - Turns on when season is a "Autumn" month.
 *   - Leave at 0 to not use.
 * 
 *   Winter Switch:
 *   - Turns on when season is a "Winter" month.
 *   - Leave at 0 to not use.
 * 
 * ---
 * 
 * Days:
 * 
 *   Weekday Switch:
 *   - Turns on when day is "Weekday". Leave at 0 to not use.
 * 
 *   Weekend Switch:
 *   - Turns on when day is "Weekend". Leave at 0 to not use.
 * 
 * ---
 * 
 * Hours:
 * 
 *   Dawn Switch:
 *   - Turns on when time is "Dawn" hours. Leave at 0 to not use.
 * 
 *   Day Switch:
 *   - Turns on when time is "Day" hours. Leave at 0 to not use.
 * 
 *   Dusk Switch:
 *   - Turns on when time is "Dusk" hours. Leave at 0 to not use.
 * 
 *   Night Switch:
 *   - Turns on when time is "Night" hours. Leave at 0 to not use.
 * 
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Game Time Vocabulary Settings
 * ============================================================================
 *
 * Here are the vocabulary-related terms involving Game Time.
 *
 * ---
 * 
 * Seasons:
 * 
 *   Spring:
 *   - How "Spring" is displayed.
 * 
 *   Summer:
 *   - How "Summer" is displayed.
 * 
 *   Autumn:
 *   - How "Autumn" is displayed.
 * 
 *   Winter:
 *   - How "Winter" is displayed.
 * 
 * ---
 * 
 * Weekday Type:
 * 
 *   Weekday:
 *   - How "Weekday" is displayed.
 * 
 *   Weekend:
 *   - how "Weekend" is displayed.
 * 
 * ---
 * 
 * Time-Related:
 * 
 *   Meridiem:
 * 
 *     Ante Meridiem:
 *     - How "Ante Meridiem" is displayed.
 * 
 *     Post Meridiem:
 *     - How "Post Meridiem" is displayed.
 * 
 * ---
 * 
 * Day Cycle:
 * 
 *   Dawn:
 *   - How "Dawn" is displayed.
 * 
 *   Day:
 *   - How "Day" is displayed.
 * 
 *   Dusk:
 *   - How "Dusk" is displayed.
 * 
 *   Night:
 *   - How "Night" is displayed.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Real Time General Settings
 * ============================================================================
 *
 * Here are the general settings regarding Real Time.
 *
 * ---
 * 
 * Seasonal Months:
 * 
 *   Spring Months:
 *   - Which Real Time months are Spring months for this game?
 * 
 *   Summer Months:
 *   - Which Real Time months are Summer months for this game?
 * 
 *   Autumn Months:
 *   - Which Real Time months are Autumn months for this game?
 * 
 *   Winter Months:
 *   - Which Real Time months are Winter months for this game?
 * 
 * ---
 * 
 * Week Structure:
 * 
 *   Weekdays:
 *   - Which Real Time weekdays are considered "Weekdays"?
 * 
 *   Weekends:
 *   - Which Real Time weekdays are considered "Weekends"?
 * 
 * ---
 * 
 * Day Structure:
 * 
 *   Dawn Hours:
 *   - What hours are considered "Dawn" hours?
 *   - Use military time.
 * 
 *   Day Hours:
 *   - What hours are considered "Day" hours?
 *   - Use military time.
 * 
 *   Dusk Hours:
 *   - What hours are considered "Dusk" hours?
 *   - Use military time.
 * 
 *   Night Hours:
 *   - What hours are considered "Night" hours?
 *   - Use military time.
 * 
 * ---
 * 
 * VisuMZ_1_SaveCore:
 * 
 *   Difference Variable:
 *   - Select a variable that records the time difference from the last save
 *     game and the current load game in minutes.
 * 
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Real Time Tones & Overlay Settings
 * ============================================================================
 *
 * Adjust the tones and overlay settings to change what color the screen will
 * appear based on the time of day.
 *
 * ---
 * 
 * Screen Tones/Tints
 * 
 *   00:00 / 12 AM to 23:00 / 11 PM:
 *   - What tone/tint is used for this hour?
 *   - Format: [Red, Green, Blue, Gray]
 * 
 * ---
 * 
 * Screen Overlay
 * 
 *   00:00 / 12 AM to 23:00 / 11 PM:
 *   - What overlay is used for this hour?
 *   - Format: #rrggbb.
 *   - Requires VisuMZ_2_LightingEffects!
 * 
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Real Time Variables & Switches
 * ============================================================================
 *
 * Adjust the variables and switches that record data here. These will be
 * automatically updated upon time changes.
 *
 * ---
 *
 * Calendar:
 * 
 *   Year Variable:
 *   - Select a variable to record the year.
 *   - Leave at 0 to not use.
 * 
 *   Month Variable:
 *   - Select a variable to record the month.
 *   - Leave at 0 to not use.
 * 
 *   Date Variable:
 *   - Select a variable to record the date.
 *   - Leave at 0 to not use.
 * 
 *   Full Date Variable:
 *   - Select a variable to record the full date.
 *   - Leave at 0 to not use.
 *   - Result is year + month (2 digits) + date (2 digits)
 *     - For example, Year 2, Month 4, Date 12 will yield 20412
 * 
 * ---
 * 
 * Weekday:
 * 
 *   Weekday Variable:
 *   - Select a variable to record the weekday.
 *   - Leave at 0 to not use.
 * 
 * ---
 * 
 * Time:
 * 
 *   Hour Variable:
 *   - Select a variable to record the hour.
 *   - Leave at 0 to not use.
 * 
 *   Minute Variable:
 *   - Select a variable to record the minute.
 *   - Leave at 0 to not use.
 * 
 *   Second Variable:
 *   - Select a variable to record the second.
 *   - Leave at 0 to not use.
 *   - Not available for Game Time.
 *
 *   Full Time Variable:
 *   - Select a variable to record the full time.
 *   - Leave at 0 to not use.
 *   - Result is hour + minutes (2 digits) + seconds (2 digits)
 *     - For example, Hour 16, Minute 8, Seconds 0 will yield 160800
 * 
 * ---
 * 
 * Seasons:
 * 
 *   Spring Switch:
 *   - Turns on when season is a "Spring" month.
 *   - Leave at 0 to not use.
 * 
 *   Summer Switch:
 *   - Turns on when season is a "Summer" month.
 *   - Leave at 0 to not use.
 * 
 *   Autumn Switch:
 *   - Turns on when season is a "Autumn" month.
 *   - Leave at 0 to not use.
 * 
 *   Winter Switch:
 *   - Turns on when season is a "Winter" month.
 *   - Leave at 0 to not use.
 * 
 * ---
 * 
 * Days:
 * 
 *   Weekday Switch:
 *   - Turns on when day is "Weekday". Leave at 0 to not use.
 * 
 *   Weekend Switch:
 *   - Turns on when day is "Weekend". Leave at 0 to not use.
 * 
 * ---
 * 
 * Hours:
 * 
 *   Dawn Switch:
 *   - Turns on when time is "Dawn" hours. Leave at 0 to not use.
 * 
 *   Day Switch:
 *   - Turns on when time is "Day" hours. Leave at 0 to not use.
 * 
 *   Dusk Switch:
 *   - Turns on when time is "Dusk" hours. Leave at 0 to not use.
 * 
 *   Night Switch:
 *   - Turns on when time is "Night" hours. Leave at 0 to not use.
 * 
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Real Time Vocabulary Settings
 * ============================================================================
 *
 * Here are the vocabulary-related terms involving Real Time.
 *
 * ---
 * 
 * Month Names:
 * 
 *   Full Names:
 * 
 *     Month 1 to 12:
 *     - Name of this month.
 * 
 *   Abbreviations:
 * 
 *     Month 1 to 12:
 *     - Abbreviation of this month.
 * 
 * ---
 * 
 * Seasons:
 * 
 *   Spring:
 *   Summer:
 *   Autumn:
 *   Winter:
 *   - How this season is displayed.
 * 
 * ---
 * 
 * Weekday Names:
 * 
 *   Full Names:
 * 
 *     Weekday 1 to Weekday 7:
 *     - Name of this weekday.
 * 
 *   Abbreviation:
 * 
 *     Weekday 1 to Weekday 7:
 *     - Abbreviation of this weekday.
 * 
 *   Weekday Type:
 * 
 *     Weekday:
 *     Weekend:
 *     - How "Weekday/end" is displayed.
 * 
 * ---
 * 
 * Time-Related:
 * 
 *   Meridiem:
 * 
 *     Ante Meridiem:
 *     Post Meridiem:
 *     - How "Ante/Post Meridiem" is displayed.
 * 
 *   Day Cycle:
 *  
 *     Dawn:
 *     Day:
 *     Dusk:
 *     Night:
 *     - How "Dawn", "Day", "Dusk", "Night" is displayed.
 * 
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Date/Time HUD Sprites
 * ============================================================================
 *
 * These settings let you adjust the HUD sprites displayed for this plugin.
 *
 * ---
 * 
 * General:
 * 
 *   Enabled?:
 *   - Enables usage of the Date/Time HUD.
 * 
 *   Show by Default:
 *   - Sets up default visibility of the Date/Time HUD.
 *   - Individual maps can be adjusted by notetags.
 * 
 *   Opacity Speed:
 *   - How fast does fade in/out work?
 *   - Lower is slower. Higher is faster.
 * 
 * ---
 * 
 * Position:
 * 
 *   Position X:
 *   - How much to position the HUD's X by.
 *   - Negative: left. Positive: right.
 * 
 *   Position Y:
 *   - How much to position the HUD's Y by.
 *   - Negative: up. Positive: down.
 * 
 * ---
 * 
 * Season Sprite:
 * 
 *   Enabled?:
 *   - Enables usage of this sprite.
 * 
 *   Opacity:
 *   - What is the default opacity for this sprite?
 *   - Use a value between 0 and 255.
 * 
 *   Anchor:
 * 
 *     Anchor X:
 *     - Anchor X value for this sprite.
 *     - 0.0 - left; 0.5 - center; 1.0 - right
 * 
 *     Anchor Y:
 *     - Anchor Y value for this sprite.
 *     - 0.0 - top; 0.5 - middle; 1.0 - bottom
 * 
 *   Offset:
 * 
 *     Offset X:
 *     - How much to offset this sprite's X by.
 *     - Negative: left. Positive: right.
 * 
 *     Offset Y:
 *     - How much to offset this sprite's Y by.
 *     - Negative: up. Positive: down.
 * 
 *   Scale:
 * 
 *     Scale X:
 *     - What is the scale used for this sprite icon's X?
 *     - 0.0 - 0%; 0.5 - 50%; 1.0 - 100%; 1.5 - 150%; 2.0 - 200%
 * 
 *     Scale Y:
 *     - What is the scale used for this sprite icon's Y?
 *     - 0.0 - 0%; 0.5 - 50%; 1.0 - 100%; 1.5 - 150%; 2.0 - 200%
 * 
 *   Icons:
 * 
 *     Spring Icon:
 *     Summer Icon:
 *     Autumn Icon:
 *     Winter Icon:
 *     - What icon is used for this months?
 *     - Ignore if there is an image equivalent.
 * 
 *   Images:
 * 
 *     Spring Image:
 *     Summer Image:
 *     Autumn Image:
 *     Winter Image:
 *     - What image is used for spring months?
 *     - Ignores any icon equivalents.
 * 
 * ---
 * 
 * DayCycle Sprite:
 * 
 *   Enabled?:
 *   - Enables usage of this sprite.
 * 
 *   Opacity:
 *   - What is the default opacity for this sprite?
 *   - Use a value between 0 and 255.
 * 
 *   Anchor:
 * 
 *     Anchor X:
 *     - Anchor X value for this sprite.
 *     - 0.0 - left; 0.5 - center; 1.0 - right
 * 
 *     Anchor Y:
 *     - Anchor Y value for this sprite.
 *     - 0.0 - top; 0.5 - middle; 1.0 - bottom
 * 
 *   Offset:
 * 
 *     Offset X:
 *     - How much to offset this sprite's X by.
 *     - Negative: left. Positive: right.
 * 
 *     Offset Y:
 *     - How much to offset this sprite's Y by.
 *     - Negative: up. Positive: down.
 * 
 *   Scale:
 * 
 *     Scale X:
 *     - What is the scale used for this sprite icon's X?
 *     - 0.0 - 0%; 0.5 - 50%; 1.0 - 100%; 1.5 - 150%; 2.0 - 200%
 * 
 *     Scale Y:
 *     - What is the scale used for this sprite icon's Y?
 *     - 0.0 - 0%; 0.5 - 50%; 1.0 - 100%; 1.5 - 150%; 2.0 - 200%
 * 
 *   Icons:
 * 
 *     Dawn Icon:
 *     Day Icon:
 *     Dusk Icon:
 *     Night Icon:
 *     - What icon is used for these day cycle hours?
 *     - Ignore if there is an image equivalent.
 * 
 *   Images:
 * 
 *     Dawn Image:
 *     Day Image:
 *     Dusk Image:
 *     Night Image:
 *     - What image is used for these day cycle hours?
 *     - Ignores any icon equivalents.
 * 
 * ---
 * 
 * Weekday Type Sprite:
 * 
 *   Enabled?:
 *   - Enables usage of this sprite.
 * 
 *   Opacity:
 *   - What is the default opacity for this sprite?
 *   - Use a value between 0 and 255.
 * 
 *   Anchor:
 * 
 *     Anchor X:
 *     - Anchor X value for this sprite.
 *     - 0.0 - left; 0.5 - center; 1.0 - right
 * 
 *     Anchor Y:
 *     - Anchor Y value for this sprite.
 *     - 0.0 - top; 0.5 - middle; 1.0 - bottom
 * 
 *   Offset:
 * 
 *     Offset X:
 *     - How much to offset this sprite's X by.
 *     - Negative: left. Positive: right.
 * 
 *     Offset Y:
 *     - How much to offset this sprite's Y by.
 *     - Negative: up. Positive: down.
 * 
 *   Scale:
 * 
 *     Scale X:
 *     - What is the scale used for this sprite icon's X?
 *     - 0.0 - 0%; 0.5 - 50%; 1.0 - 100%; 1.5 - 150%; 2.0 - 200%
 * 
 *     Scale Y:
 *     - What is the scale used for this sprite icon's Y?
 *     - 0.0 - 0%; 0.5 - 50%; 1.0 - 100%; 1.5 - 150%; 2.0 - 200%
 * 
 *   Icons:
 * 
 *     Weekday Icon:
 *     Weekend Icon:
 *     - What icon is used for weekdays?
 *     - Ignore if there is an image equivalent.
 * 
 *   Images:
 * 
 *     Weekday Image:
 *     Weekend Image:
 *     - What image is used for weekdays?
 *     - Ignores any icon equivalents.
 * 
 * ---
 * 
 * Year Sprite:
 * 
 *   Enabled?:
 *   - Enables usage of this sprite.
 * 
 *   Angle:
 *   - What is the angle used for this sprite?
 *   - Value is written in degrees.
 * 
 *   Year Format:
 *   - How is the year written when it's less than 4 digits?
 *   - %1 - Current Year
 * 
 *   Size:
 * 
 *     Width:
 *     - What is the width of this sprite in pixels?
 * 
 *     Height:
 *     - What is the height of this sprite in pixels?
 * 
 *   Anchor:
 * 
 *     Anchor X:
 *     - Anchor X value for this sprite.
 *     - 0.0 - left; 0.5 - center; 1.0 - right
 * 
 *     Anchor Y:
 *     - Anchor Y value for this sprite.
 *     - 0.0 - top; 0.5 - middle; 1.0 - bottom
 * 
 *   Offset:
 * 
 *     Offset X:
 *     - How much to offset this sprite's X by.
 *     - Negative: left. Positive: right.
 * 
 *     Offset Y:
 *     - How much to offset this sprite's Y by.
 *     - Negative: up. Positive: down.
 * 
 *   JS: Draw Text:
 *   - Code used to draw the text for this sprite.
 * 
 * ---
 * 
 * Month Sprite:
 * 
 *   Enabled?:
 *   - Enables usage of this sprite.
 * 
 *   Angle:
 *   - What is the angle used for this sprite?
 *   - Value is written in degrees.
 * 
 *   Size:
 * 
 *     Width:
 *     - What is the width of this sprite in pixels?
 * 
 *     Height:
 *     - What is the height of this sprite in pixels?
 * 
 *   Anchor:
 * 
 *     Anchor X:
 *     - Anchor X value for this sprite.
 *     - 0.0 - left; 0.5 - center; 1.0 - right
 * 
 *     Anchor Y:
 *     - Anchor Y value for this sprite.
 *     - 0.0 - top; 0.5 - middle; 1.0 - bottom
 * 
 *   Offset:
 * 
 *     Offset X:
 *     - How much to offset this sprite's X by.
 *     - Negative: left. Positive: right.
 * 
 *     Offset Y:
 *     - How much to offset this sprite's Y by.
 *     - Negative: up. Positive: down.
 * 
 *   JS: Draw Text:
 *   - Code used to draw the text for this sprite.
 * 
 * ---
 * 
 * Date Sprite:
 * 
 *   Enabled?:
 *   - Enables usage of this sprite.
 * 
 *   Angle:
 *   - What is the angle used for this sprite?
 *   - Value is written in degrees.
 * 
 *   Size:
 * 
 *     Width:
 *     - What is the width of this sprite in pixels?
 * 
 *     Height:
 *     - What is the height of this sprite in pixels?
 * 
 *   Anchor:
 * 
 *     Anchor X:
 *     - Anchor X value for this sprite.
 *     - 0.0 - left; 0.5 - center; 1.0 - right
 * 
 *     Anchor Y:
 *     - Anchor Y value for this sprite.
 *     - 0.0 - top; 0.5 - middle; 1.0 - bottom
 * 
 *   Offset:
 * 
 *     Offset X:
 *     - How much to offset this sprite's X by.
 *     - Negative: left. Positive: right.
 * 
 *     Offset Y:
 *     - How much to offset this sprite's Y by.
 *     - Negative: up. Positive: down.
 * 
 *   JS: Draw Text:
 *   - Code used to draw the text for this sprite.
 * 
 * ---
 * 
 * Weekday Sprite:
 * 
 *   Enabled?:
 *   - Enables usage of this sprite.
 * 
 *   Angle:
 *   - What is the angle used for this sprite?
 *   - Value is written in degrees.
 * 
 *   Size:
 * 
 *     Width:
 *     - What is the width of this sprite in pixels?
 * 
 *     Height:
 *     - What is the height of this sprite in pixels?
 * 
 *   Anchor:
 * 
 *     Anchor X:
 *     - Anchor X value for this sprite.
 *     - 0.0 - left; 0.5 - center; 1.0 - right
 * 
 *     Anchor Y:
 *     - Anchor Y value for this sprite.
 *     - 0.0 - top; 0.5 - middle; 1.0 - bottom
 * 
 *   Offset:
 * 
 *     Offset X:
 *     - How much to offset this sprite's X by.
 *     - Negative: left. Positive: right.
 * 
 *     Offset Y:
 *     - How much to offset this sprite's Y by.
 *     - Negative: up. Positive: down.
 * 
 *   JS: Draw Text:
 *   - Code used to draw the text for this sprite.
 * 
 * ---
 * 
 * Time Sprite:
 * 
 *   Enabled?:
 *   - Enables usage of this sprite.
 * 
 *   Angle:
 *   - What is the angle used for this sprite?
 *   - Value is written in degrees.
 * 
 *   Size:
 * 
 *     Width:
 *     - What is the width of this sprite in pixels?
 * 
 *     Height:
 *     - What is the height of this sprite in pixels?
 * 
 *   Anchor:
 * 
 *     Anchor X:
 *     - Anchor X value for this sprite.
 *     - 0.0 - left; 0.5 - center; 1.0 - right
 * 
 *     Anchor Y:
 *     - Anchor Y value for this sprite.
 *     - 0.0 - top; 0.5 - middle; 1.0 - bottom
 * 
 *   Offset:
 * 
 *     Offset X:
 *     - How much to offset this sprite's X by.
 *     - Negative: left. Positive: right.
 * 
 *     Offset Y:
 *     - How much to offset this sprite's Y by.
 *     - Negative: up. Positive: down.
 * 
 *   JS: Draw Text:
 *   - Code used to draw the text for this sprite.
 * 
 * ---
 *
 * ============================================================================
 * Plugin Parameters: Date/Time HUD Options Settings
 * ============================================================================
 *
 * Options settings for the Date & Time System.
 *
 * ---
 * 
 * Options:
 * 
 *   Add Option?:
 *   - Add the 'Date Time HUD' option to the Options menu?
 * 
 *   Adjust Window Height:
 *   - Automatically adjust the options window height?
 * 
 *   Option Name:
 *   - Command name of the option.
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
 * * Irina
 * * Arisu
 * * Olivia
 * * Yanfly
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 * 
 * Version 1.04: November 14, 2024
 * * Bug Fixes!
 * ** Fixed a bug where turns were added to each state without using any of the
 *    notetag effects. Fix made by Olivia.
 * 
 * Version 1.03: May 16, 2024
 * * Bug Fixes!
 * ** Fixed a bug where the Winter switch would turn on during summer.
 *    Fix made by Irina.
 * 
 * Version 1.02: April 18, 2024
 * * Bug Fixes!
 * ** Fixed a bug where "Show by Default" plugin parameter did not register.
 *    Fix made by Olivia.
 * * Feature Update!
 * ** Default option state for the Date & Time HUD will be true for those not
 *    using the Options Core. Update by Olivia.
 * 
 * Version 1.01: February 15, 2024
 * * Bug Fixes!
 * ** Fixed a bug that would cause a crash when using Real Time and skip title.
 *    Fix made by Irina.
 * ** Fixed a bug where seasonal tilesets could cause a crash. Fix by Irina.
 * 
 * Version 1.00 Official Release Date: February 19, 2024
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
 * @command GameTime_ChangeDateTo
 * @text Game Time: Change Date To
 * @desc Changes the Game Time's date to a specific date.
 * Does not affect time. Does NOT affect time.
 *
 * @arg Year:eval
 * @text Year
 * @desc Changes Game Time's year to this.
 * You may use JavaScript code.
 * @default TimeManager.getYear() + 0
 *
 * @arg Month:eval
 * @text Month
 * @desc Changes Game Time's month to this.
 * You may use JavaScript code.
 * @default TimeManager.getMonth() + 0
 *
 * @arg MonthOverflow:eval
 * @text Allow Overflow?
 * @parent Month:eval
 * @type boolean
 * @on Overflow
 * @off Clamp
 * @desc If allow overflow, excess months increase year count.
 * If not, excess months are clamped to what's allowed.
 * @default true
 *
 * @arg Date:eval
 * @text Date
 * @desc Changes Game Time's date to this.
 * You may use JavaScript code. Overflow is calculated.
 * @default TimeManager.getDate() + 0
 *
 * @arg DateOverflow:eval
 * @text Allow Overflow?
 * @parent Date:eval
 * @type boolean
 * @on Overflow
 * @off Clamp
 * @desc If allow overflow, excess days increase month count.
 * If not, excess days are clamped to what's allowed.
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command GameTime_ChangeTimeTo
 * @text Game Time: Change Time To
 * @desc Changes the Game Time's time to a specific time.
 * Does not affect time. CAN affect date and weekday.
 *
 * @arg Hour:eval
 * @text Hour
 * @desc Changes Game Time's hour to this.
 * You may use JavaScript code. Excess hours changes date.
 * @default TimeManager.getHour() + 0
 *
 * @arg HourOverflow:eval
 * @text Allow Overflow?
 * @parent Hour:eval
 * @type boolean
 * @on Overflow
 * @off Clamp
 * @desc If allow overflow, excess hours increase date count.
 * If not, excess hours are clamped to what's allowed.
 * @default true
 *
 * @arg Minute:eval
 * @text Minute
 * @desc Changes Game Time's minute to this.
 * You may use JavaScript code. Overflow is calculated.
 * @default TimeManager.getMinuteRaw() + 0
 *
 * @arg MinuteOverflow:eval
 * @text Allow Overflow?
 * @parent Minute:eval
 * @type boolean
 * @on Overflow
 * @off Clamp
 * @desc If allow overflow, excess minutes increase hour count.
 * If not, excess minutes are clamped to what's allowed.
 * @default true
 *
 * @ --------------------------------------------------------------------------
 *
 * @command GameTime_PauseTimeStart
 * @text Game Time: Pause Time Start
 * @desc Pauses time from going forward while in Game Time.
 * This only pauses Game Time. Events and Timers can still move.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command GameTime_PauseTimeEnd
 * @text Game Time: Pause Time End
 * @desc Allows Game Time to resume moving.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command GameTime_RecordToVariables
 * @text Game Time: Record to Variable(s)
 * @desc Records game Time data to select variable(s).
 * This only records the data for this moment.
 * 
 * @arg VarCalendarType
 * @text Calendar
 * @parent Variables
 *
 * @arg VarYear:num
 * @text Year Variable
 * @parent VarCalendarType
 * @type variable
 * @desc Select a variable to record the year.
 * Leave at 0 to not use.
 * @default 0
 *
 * @arg VarMonth:num
 * @text Month Variable
 * @parent VarCalendarType
 * @type variable
 * @desc Select a variable to record the month.
 * Leave at 0 to not use.
 * @default 0
 *
 * @arg VarDate:num
 * @text Date Variable
 * @parent VarCalendarType
 * @type variable
 * @desc Select a variable to record the date.
 * Leave at 0 to not use.
 * @default 0
 *
 * @arg VarFullDate:num
 * @text Full Date Variable
 * @parent VarCalendarType
 * @type variable
 * @desc Select a variable to record the full date.
 * Leave at 0 to not use.
 * @default 0
 * 
 * @arg VarDayType
 * @text Weekday
 * @parent Variables
 *
 * @arg VarWeekday:num
 * @text Weekday Variable
 * @parent VarDayType
 * @type variable
 * @desc Select a variable to record the weekday.
 * Leave at 0 to not use.
 * @default 0
 * 
 * @arg VarTimeType
 * @text Time
 * @parent Variables
 *
 * @arg VarHour:num
 * @text Hour Variable
 * @parent VarTimeType
 * @type variable
 * @desc Select a variable to record the hour.
 * Leave at 0 to not use.
 * @default 0
 *
 * @arg VarMinute:num
 * @text Minute Variable
 * @parent VarTimeType
 * @type variable
 * @desc Select a variable to record the minute.
 * Leave at 0 to not use.
 * @default 0
 *
 * @arg VarFullTime:num
 * @text Full Time Variable
 * @parent VarTimeType
 * @type variable
 * @desc Select a variable to record the full time.
 * Leave at 0 to not use.
 * @default 0
 *
 * @ --------------------------------------------------------------------------
 *
 * @command GameTime_TimeDilation
 * @text Game Time: Time Dilation Change
 * @desc Changes how fast it takes for a minute to pass in Game Time.
 *
 * @arg msPerMinute:eval
 * @text MS Per Game Minute
 * @type number
 * @min 20
 * @desc How many milliseconds will count as a game minute?
 * 1000 milliseconds = 1 real life second.
 * @default 1000
 *
 * @ --------------------------------------------------------------------------
 *
 * @command GameTime_ClearDilation
 * @text Game Time: Time Dilation Clear
 * @desc Clears the time dilation and changes it back to default
 * settings based on Plugin Parameters.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Real
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command RealTime_RecordToVariables
 * @text Real Time: Record to Variable(s)
 * @desc Records Real Time data to select variable(s).
 * This only records the data for this moment.
 * 
 * @arg VarCalendarType
 * @text Calendar
 * @parent Variables
 *
 * @arg VarYear:num
 * @text Year Variable
 * @parent VarCalendarType
 * @type variable
 * @desc Select a variable to record the year.
 * Leave at 0 to not use.
 * @default 0
 *
 * @arg VarMonth:num
 * @text Month Variable
 * @parent VarCalendarType
 * @type variable
 * @desc Select a variable to record the month.
 * Leave at 0 to not use.
 * @default 0
 *
 * @arg VarDate:num
 * @text Date Variable
 * @parent VarCalendarType
 * @type variable
 * @desc Select a variable to record the date.
 * Leave at 0 to not use.
 * @default 0
 *
 * @arg VarFullDate:num
 * @text Full Date Variable
 * @parent VarCalendarType
 * @type variable
 * @desc Select a variable to record the full date.
 * Leave at 0 to not use.
 * @default 0
 * 
 * @arg VarDayType
 * @text Weekday
 * @parent Variables
 *
 * @arg VarWeekday:num
 * @text Weekday Variable
 * @parent VarDayType
 * @type variable
 * @desc Select a variable to record the weekday.
 * Leave at 0 to not use.
 * @default 0
 * 
 * @arg VarTimeType
 * @text Time
 * @parent Variables
 *
 * @arg VarHour:num
 * @text Hour Variable
 * @parent VarTimeType
 * @type variable
 * @desc Select a variable to record the hour.
 * Leave at 0 to not use.
 * @default 0
 *
 * @arg VarMinute:num
 * @text Minute Variable
 * @parent VarTimeType
 * @type variable
 * @desc Select a variable to record the minute.
 * Leave at 0 to not use.
 * @default 0
 *
 * @arg VarSecond:num
 * @text Second Variable
 * @parent VarTimeType
 * @type variable
 * @desc Select a variable to record the second.
 * Leave at 0 to not use.
 * @default 0
 *
 * @arg VarFullTime:num
 * @text Full Time Variable
 * @parent VarTimeType
 * @type variable
 * @desc Select a variable to record the full time.
 * Leave at 0 to not use.
 * @default 0
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Hud
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command HudShowHide
 * @text HUD: Show/Hide
 * @desc Makes the Date & Time HUD visible or hidden.
 * Does not affect maps with forced hidden notetags.
 *
 * @arg Show:eval
 * @text Show/Hide?
 * @type boolean
 * @on Show
 * @off Hide
 * @desc Shows/hides Date & Time HUD on the map scene.
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
 * @param DateTimeSystem
 * @default Plugin Parameters
 *
 * @param ATTENTION
 * @default READ THE HELP FILE
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param Defaults
 * @text Default Settings
 *
 * @param DefaultTimeType:str
 * @text Default Map Time Type
 * @parent Defaults
 * @type select
 * @option None - Time doesn't pass on most maps
 * @value none
 * @option Game - Time passes based on game rules
 * @value game
 * @option Real - Time passes based on real life
 * @value real
 * @desc What do you want to be the default time system?
 * Change per map with <Time System: x> notetag.
 * @default game
 *
 * @param DefaultTimeTone:str
 * @text Default Map Time Tone
 * @parent Defaults
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Do maps have time-based screen tones/tints?
 * Can change with <No Time Tone> or <Time Tone> notetags.
 * @default true
 * 
 * @param GameTime
 * @text Game Time Settings
 *
 * @param GameTimeGeneral:struct
 * @text General Settings
 * @parent GameTime
 * @type struct<GameTimeGeneral>
 * @desc Here are the general settings regarding Game Time.
 * @default {"Starting":"","StartYear:num":"1","StartMonth:num":"1","StartDate:num":"1","StartWeekday:num":"1","StartHour:num":"8","StartMinute:num":"0","Mechanics":"","msPerMinute:num":"1000","minutesInHour:num":"60","roundMinutesTo10:eval":"true","HoursInDay:num":"24","LeapYearCalc:func":"\"// Declare Constants\\nconst year = arguments[0];\\n\\n// Check Leap Year Rules\\nreturn (year % 400 === 0) ||\\n  ((year % 100 !== 0) && (year % 4 === 0));\"","Pause":"","PauseEventRunning:eval":"true","PauseMoveRouteForcing:eval":"true","PauseGatheringFollowers:eval":"true","PauseVehicleEntry:eval":"true","MonthStruct":"","Months:arraystruct":"[\"{\\\"Name:str\\\":\\\"Verenthilun\\\",\\\"Abbr:str\\\":\\\"VER\\\",\\\"Days:num\\\":\\\"28\\\",\\\"LeapMonth:eval\\\":\\\"false\\\",\\\"Season:str\\\":\\\"spring\\\"}\",\"{\\\"Name:str\\\":\\\"Solarnilun\\\",\\\"Abbr:str\\\":\\\"SOL\\\",\\\"Days:num\\\":\\\"28\\\",\\\"LeapMonth:eval\\\":\\\"false\\\",\\\"Season:str\\\":\\\"summer\\\"}\",\"{\\\"Name:str\\\":\\\"Auminolun\\\",\\\"Abbr:str\\\":\\\"AUM\\\",\\\"Days:num\\\":\\\"28\\\",\\\"LeapMonth:eval\\\":\\\"false\\\",\\\"Season:str\\\":\\\"autumn\\\"}\",\"{\\\"Name:str\\\":\\\"Frostalun\\\",\\\"Abbr:str\\\":\\\"FRO\\\",\\\"Days:num\\\":\\\"28\\\",\\\"LeapMonth:eval\\\":\\\"false\\\",\\\"Season:str\\\":\\\"winter\\\"}\"]","WeekdayStruct":"","Weekdays:arraystruct":"[\"{\\\"Name:str\\\":\\\"Lunara\\\",\\\"Abbr:str\\\":\\\"LUN\\\",\\\"WeekdayType:str\\\":\\\"weekday\\\"}\",\"{\\\"Name:str\\\":\\\"Tundara\\\",\\\"Abbr:str\\\":\\\"TUN\\\",\\\"WeekdayType:str\\\":\\\"weekday\\\"}\",\"{\\\"Name:str\\\":\\\"Wyrmara\\\",\\\"Abbr:str\\\":\\\"WYR\\\",\\\"WeekdayType:str\\\":\\\"weekday\\\"}\",\"{\\\"Name:str\\\":\\\"Thundra\\\",\\\"Abbr:str\\\":\\\"THU\\\",\\\"WeekdayType:str\\\":\\\"weekday\\\"}\",\"{\\\"Name:str\\\":\\\"Fyrara\\\",\\\"Abbr:str\\\":\\\"FYR\\\",\\\"WeekdayType:str\\\":\\\"weekday\\\"}\",\"{\\\"Name:str\\\":\\\"Sylphira\\\",\\\"Abbr:str\\\":\\\"SYL\\\",\\\"WeekdayType:str\\\":\\\"weekend\\\"}\",\"{\\\"Name:str\\\":\\\"Heliora\\\",\\\"Abbr:str\\\":\\\"HEL\\\",\\\"WeekdayType:str\\\":\\\"weekend\\\"}\"]","DayStruct":"","DawnHours:arraynum":"[\"4\",\"5\",\"6\"]","DayHours:arraynum":"[\"7\",\"8\",\"9\",\"10\",\"11\",\"12\",\"13\",\"14\",\"15\",\"16\",\"17\"]","DuskHours:arraynum":"[\"18\",\"19\",\"20\"]","NightHours:arraynum":"[\"21\",\"22\",\"23\",\"0\",\"1\",\"2\",\"3\"]"}
 *
 * @param GameTimeTone:arrayeval
 * @text Tone Settings
 * @parent GameTime
 * @type string[]
 * @desc What tone/tint is used for various Game Time hours?
 * Format: [Red, Green, Blue, Gray]. Starts at 0:00.
 * @default ["[-68, -68, 0, 68]","[-68, -68, 0, 68]","[-68, -68, 0, 68]","[-68, -68, 0, 68]","[-51, -51, 0, 51]","[-34, -34, 0, 34]","[-17, -17, 0, 17]","[0, 0, 0, 0]","[0, 0, 0, 0]","[0, 0, 0, 0]","[0, 0, 0, 0]","[0, 0, 0, 0]","[0, 0, 0, 0]","[0, 0, 0, 0]","[0, 0, 0, 0]","[0, 0, 0, 0]","[0, 0, 0, 0]","[0, 0, 0, 0]","[34, -17, -17, 0]","[68, -34, -34, 0]","[0, -51, -17, 34]","[-68, -68, 0, 68]","[-68, -68, 0, 68]","[-68, -68, 0, 68]"]
 *
 * @param GameTimeOverlay:arraystr
 * @text Overlay Settings
 * @parent GameTime
 * @type string[]
 * @desc What overlay is used for this hour? Starts at 0:00.
 * Format: #rrggbb. Requires VisuMZ_2_LightingEffects!
 * @default ["#2e3192","#2e3192","#2e3192","#2e3192","#404d9a","#5674b9","#aab4e8","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#fbca8f","#f7941d","#63a850","#2e3192","#2e3192","#2e3192"]
 *
 * @param GameTimeData:struct
 * @text Variables & Switches
 * @parent GameTime
 * @type struct<VarSw>
 * @desc Adjust the variables and switches that record data here.
 * These will be automatically updated upon time changes.
 * @default {"Variables":"","VarCalendarType":"","VarYear:num":"0","VarMonth:num":"0","VarDate:num":"0","VarDayType":"","VarWeekday:num":"0","VarTimeType":"","VarHour:num":"0","VarMinute:num":"0","VarSecond:num":"0","Switches":"","SwSeasonType":"","SwSpring:num":"0","SwSummer:num":"0","SwAutumn:num":"0","SwWinter:num":"0","SwDayType":"","SwWeekday:num":"0","SwWeekend:num":"0","SwHourType":"","SwDawn:num":"0","SwDay:num":"0","SwDusk:num":"0","SwNight:num":"0"}
 *
 * @param GameTimeVocab:struct
 * @text Vocabulary Settings
 * @parent GameTime
 * @type struct<GameTimeVocab>
 * @desc Here are the vocabulary-related terms involving Game Time.
 * @default {"MonthsSeasons":"","SeasonSpring:str":"Spring","SeasonSummer:str":"Summer","SeasonAutumn:str":"Autumn","SeasonWinter:str":"Winter","WeekdaysType":"","WeekdayName:str":"Weekday","WeekendName:str":"Weekend","Time":"","TimeMeridiem":"","TimeAM:str":"AM","TimePM:str":"PM","TimeDayCycle":"","TimeDawn:str":"Dawn","TimeDay:str":"Daytime","TimeDusk:str":"Dusk","TimeNight:str":"Nighttime"}
 * 
 * @param RealTime
 * @text Real Time Settings
 *
 * @param RealTimeGeneral:struct
 * @text General Settings
 * @parent RealTime
 * @type struct<RealTimeGeneral>
 * @desc Here are the general settings regarding Real Time.
 * @default {"Seasonal":"","SpringMonths:arraynum":"[\"3\",\"4\",\"5\"]","SummerMonths:arraynum":"[\"6\",\"7\",\"8\"]","AutumnMonths:arraynum":"[\"9\",\"10\",\"11\"]","WinterMonths:arraynum":"[\"12\",\"1\",\"2\"]","Weekday":"","Weekdays:arraynum":"[\"1\",\"2\",\"3\",\"4\",\"5\"]","Weekends:arraynum":"[\"6\",\"7\"]","DayStruct":"","DawnHours:arraynum":"[\"4\",\"5\",\"6\"]","DayHours:arraynum":"[\"7\",\"8\",\"9\",\"10\",\"11\",\"12\",\"13\",\"14\",\"15\",\"16\",\"17\"]","DuskHours:arraynum":"[\"18\",\"19\",\"20\"]","NightHours:arraynum":"[\"21\",\"22\",\"23\",\"0\",\"1\",\"2\",\"3\"]","SaveCore":"","LoadMinDiff:num":"0"}
 *
 * @param RealTimeToneOverlay:struct
 * @text Tones & Overlay Settings
 * @parent RealTime
 * @type struct<RealTimeToneOverlay>
 * @desc Adjust the tones and overlay settings to change what
 * color the screen will appear based on the time of day.
 * @default {"Tones":"","Tone0:eval":"[-68, -68, 0, 68]","Tone1:eval":"[-68, -68, 0, 68]","Tone2:eval":"[-68, -68, 0, 68]","Tone3:eval":"[-68, -68, 0, 68]","Tone4:eval":"[-51, -51, 0, 51]","Tone5:eval":"[-34, -34, 0, 34]","Tone6:eval":"[-17, -17, 0, 17]","Tone7:eval":"[0, 0, 0, 0]","Tone8:eval":"[0, 0, 0, 0]","Tone9:eval":"[0, 0, 0, 0]","Tone10:eval":"[0, 0, 0, 0]","Tone11:eval":"[0, 0, 0, 0]","Tone12:eval":"[0, 0, 0, 0]","Tone13:eval":"[0, 0, 0, 0]","Tone14:eval":"[0, 0, 0, 0]","Tone15:eval":"[0, 0, 0, 0]","Tone16:eval":"[0, 0, 0, 0]","Tone17:eval":"[0, 0, 0, 0]","Tone18:eval":"[34, -17, -17, 0]","Tone19:eval":"[68, -34, -34, 0]","Tone20:eval":"[0, -51, -17, 34]","Tone21:eval":"[-68, -68, 0, 68]","Tone22:eval":"[-68, -68, 0, 68]","Tone23:eval":"[-68, -68, 0, 68]","Overlays":"","OverlaysReq":"VisuMZ_2_LightingEffects","Overlay0:str":"#2e3192","Overlay1:str":"#2e3192","Overlay2:str":"#2e3192","Overlay3:str":"#2e3192","Overlay4:str":"#404d9a","Overlay5:str":"#5674b9","Overlay6:str":"#aab4e8","Overlay7:str":"#ffffff","Overlay8:str":"#ffffff","Overlay9:str":"#ffffff","Overlay10:str":"#ffffff","Overlay11:str":"#ffffff","Overlay12:str":"#ffffff","Overlay13:str":"#ffffff","Overlay14:str":"#ffffff","Overlay15:str":"#ffffff","Overlay16:str":"#ffffff","Overlay17:str":"#ffffff","Overlay18:str":"#fbca8f","Overlay19:str":"#f7941d","Overlay20:str":"#63a850","Overlay21:str":"#2e3192","Overlay22:str":"#2e3192","Overlay23:str":"#2e3192"}
 *
 * @param RealTimeData:struct
 * @text Variables & Switches
 * @parent RealTime
 * @type struct<VarSw>
 * @desc Adjust the variables and switches that record data here.
 * These will be automatically updated upon time changes.
 * @default {"Variables":"","VarCalendarType":"","VarYear:num":"0","VarMonth:num":"0","VarDate:num":"0","VarDayType":"","VarWeekday:num":"0","VarTimeType":"","VarHour:num":"0","VarMinute:num":"0","VarSecond:num":"0","Switches":"","SwSeasonType":"","SwSpring:num":"0","SwSummer:num":"0","SwAutumn:num":"0","SwWinter:num":"0","SwDayType":"","SwWeekday:num":"0","SwWeekend:num":"0","SwHourType":"","SwDawn:num":"0","SwDay:num":"0","SwDusk:num":"0","SwNight:num":"0"}
 *
 * @param RealTimeVocab:struct
 * @text Vocabulary Settings
 * @parent RealTime
 * @type struct<RealTimeVocab>
 * @desc Here are the vocabulary-related terms involving Real Time.
 * @default {"Months":"","MonthsFull":"","MonthFull1:str":"January","MonthFull2:str":"February","MonthFull3:str":"March","MonthFull4:str":"April","MonthFull5:str":"May","MonthFull6:str":"June","MonthFull7:str":"July","MonthFull8:str":"August","MonthFull9:str":"September","MonthFull10:str":"October","MonthFull11:str":"November","MonthFull12:str":"December","MonthsAbbr":"","MonthAbbr1:str":"JAN","MonthAbbr2:str":"FEB","MonthAbbr3:str":"MAR","MonthAbbr4:str":"APR","MonthAbbr5:str":"MAY","MonthAbbr6:str":"JUN","MonthAbbr7:str":"JUL","MonthAbbr8:str":"AUG","MonthAbbr9:str":"SEP","MonthAbbr10:str":"OCT","MonthAbbr11:str":"NOV","MonthAbbr12:str":"DEC","MonthsSeasons":"","SeasonSpring:str":"Spring","SeasonSummer:str":"Summer","SeasonAutumn:str":"Autumn","SeasonWinter:str":"Winter","Weekdays":"","WeekdaysFull":"","WeekdayFull1:str":"Monday","WeekdayFull2:str":"Tuesday","WeekdayFull3:str":"Wednesday","WeekdayFull4:str":"Thursday","WeekdayFull5:str":"Friday","WeekdayFull6:str":"Saturday","WeekdayFull7:str":"Sunday","WeekdaysAbbr":"","WeekdayAbbr1:str":"MON","WeekdayAbbr2:str":"TUE","WeekdayAbbr3:str":"WED","WeekdayAbbr4:str":"THU","WeekdayAbbr5:str":"FRI","WeekdayAbbr6:str":"SAT","WeekdayAbbr7:str":"SUN","WeekdaysType":"","WeekdayName:str":"Weekday","WeekendName:str":"Weekend","Time":"","TimeMeridiem":"","TimeAM:str":"AM","TimePM:str":"PM","TimeDayCycle":"","TimeDawn:str":"Dawn","TimeDay:str":"Daytime","TimeDusk:str":"Dusk","TimeNight:str":"Nighttime"}
 * 
 * @param HUD
 * @text Date/Time HUD
 *
 * @param HudSprite:struct
 * @text HUD Sprites
 * @type struct<HudSprite>
 * @parent HUD
 * @desc These settings let you adjust the HUD sprites displayed for this plugin.
 * @default {"General":"","Enable:eval":"true","Show:eval":"true","OpacitySpeed:num":"16","Position":"","PositionX:num":"+0","PositionY:num":"+0","Season":"","SeasonEnable:eval":"true","SeasonOpacity:num":"128","SeasonAnchor":"","SeasonAnchorX:num":"0.5","SeasonAnchorY:num":"0.5","SeasonOffset":"","SeasonOffsetX:num":"+48","SeasonOffsetY:num":"+48","SeasonScale":"","SeasonScaleX:num":"3.0","SeasonScaleY:num":"3.0","SeasonIcons":"","SeasonIconSpring:num":"69","SeasonIconSummer:num":"70","SeasonIconAutumn:num":"68","SeasonIconWinter:num":"65","SeasonImages":"","SeasonImageSpring:str":"","SeasonImageSummer:str":"","SeasonImageAutumn:str":"","SeasonImageWinter:str":"","DayCycle":"","DayCycleEnable:eval":"true","DayCycleOpacity:num":"128","DayCycleAnchor":"","DayCycleAnchorX:num":"0.5","DayCycleAnchorY:num":"0.5","DayCycleOffset":"","DayCycleOffsetX:num":"+144","DayCycleOffsetY:num":"+48","DayCycleScale":"","DayCycleScaleX:num":"3.0","DayCycleScaleY:num":"3.0","DayCycleIcons":"","DayCycleIconDawn:num":"73","DayCycleIconDay:num":"87","DayCycleIconDusk:num":"74","DayCycleIconNight:num":"88","DayCycleImages":"","DayCycleImageDawn:str":"","DayCycleImageDay:str":"","DayCycleImageDusk:str":"","DayCycleImageNight:str":"","WeekType":"","WeekTypeEnable:eval":"true","WeekTypeOpacity:num":"128","WeekTypeAnchor":"","WeekTypeAnchorX:num":"0.5","WeekTypeAnchorY:num":"0.5","WeekTypeOffset":"","WeekTypeOffsetX:num":"+240","WeekTypeOffsetY:num":"+48","WeekTypeScale":"","WeekTypeScaleX:num":"3.0","WeekTypeScaleY:num":"3.0","WeekTypeIcons":"","WeekTypeIconWeekday:num":"75","WeekTypeIconWeekend:num":"84","WeekTypeImages":"","WeekTypeImageWeekday:str":"","WeekTypeImageWeekend:str":"","Year":"","YearEnable:eval":"true","YearAngle:num":"+15","YearFmt:str":"Year %1","YearSize":"","YearSizeWidth:num":"200","YearSizeHeight:num":"80","YearAnchor":"","YearAnchorX:num":"0.5","YearAnchorY:num":"0.5","YearOffset":"","YearOffsetX:num":"+48","YearOffsetY:num":"+30","Year_DrawText_JS:func":"\"// Declare Constants\\nconst bitmap = arguments[0];\\nconst year = TimeManager.getYear();\\nlet text = String(year);\\nif (text.length < 4) {\\n    const fmt = TextManager.DATE_TIME_SYSTEM.yearFmt;\\n    text = fmt.format(year);\\n}\\n\\n// Change Font Settings\\nbitmap.fontFace = 'Times New Roman';\\nbitmap.fontSize = 32;\\nbitmap.outlineWidth = 5;\\nbitmap.outlineColor = 'rgba(0, 0, 0, 0.8)';\\n\\n// Draw Text\\nbitmap.drawText(text, 0, 0, bitmap.width, bitmap.height, 'center');\"","Month":"","MonthEnable:eval":"true","MonthAngle:num":"+0","MonthSize":"","MonthSizeWidth:num":"200","MonthSizeHeight:num":"80","MonthAnchor":"","MonthAnchorX:num":"0.5","MonthAnchorY:num":"0.5","MonthOffset":"","MonthOffsetX:num":"+125","MonthOffsetY:num":"+20","Month_DrawText_JS:func":"\"// Declare Constants\\nconst bitmap = arguments[0];\\nconst monthID = TimeManager.getMonth();\\nconst monthName = TextManager.getMonthName(monthID);\\nconst monthAbbr = TextManager.getMonthAbbr(monthID);\\n\\n// Change Font Settings\\nbitmap.fontFace = 'Times New Roman';\\nbitmap.fontSize = 24;\\nbitmap.outlineWidth = 5;\\nbitmap.outlineColor = 'rgba(0, 0, 0, 0.8)';\\n\\n// Draw Text\\nbitmap.drawText(monthAbbr, 0, 0, bitmap.width, bitmap.height, 'center');\"","Date":"","DateEnable:eval":"true","DateAngle:num":"+0","DateSize":"","DateSizeWidth:num":"200","DateSizeHeight:num":"80","DateAnchor":"","DateAnchorX:num":"0.5","DateAnchorY:num":"0.5","DateOffset":"","DateOffsetX:num":"+175","DateOffsetY:num":"+20","Date_DrawText_JS:func":"\"// Declare Constants\\nconst bitmap = arguments[0];\\nconst date = TimeManager.getDate();\\n\\n// Change Font Settings\\nbitmap.fontFace = 'Times New Roman';\\nbitmap.fontSize = 36;\\nbitmap.outlineWidth = 5;\\nbitmap.outlineColor = 'rgba(0, 0, 0, 0.8)';\\n\\n// Draw Text\\nbitmap.drawText(date, 0, 0, bitmap.width, bitmap.height, 'center');\"","Weekday":"","WeekdayEnable:eval":"true","WeekdayAngle:num":"-15","WeekdaySize":"","WeekdaySizeWidth:num":"200","WeekdaySizeHeight:num":"80","WeekdayAnchor":"","WeekdayAnchorX:num":"0.5","WeekdayAnchorY:num":"0.5","WeekdayOffset":"","WeekdayOffsetX:num":"+240","WeekdayOffsetY:num":"+30","Weekday_DrawText_JS:func":"\"// Declare Constants\\nconst bitmap = arguments[0];\\nconst weekdayID = TimeManager.getWeekday();\\nconst weekdayName = TextManager.getWeekdayName(weekdayID);\\nconst weekdayAbbr = TextManager.getWeekdayAbbr(weekdayID);\\n\\n// Change Font Settings\\nbitmap.fontFace = 'Times New Roman';\\nbitmap.fontSize = 32;\\nbitmap.outlineWidth = 5;\\nbitmap.outlineColor = 'rgba(0, 0, 0, 0.8)';\\n\\n// Draw Text\\nbitmap.drawText(weekdayAbbr, 0, 0, bitmap.width, bitmap.height, 'center');\"","Time":"","TimeEnable:eval":"true","TimeAngle:num":"+0","TimeSize":"","TimeSizeWidth:num":"200","TimeSizeHeight:num":"80","TimeAnchor":"","TimeAnchorX:num":"0.5","TimeAnchorY:num":"0.5","TimeOffset":"","TimeOffsetX:num":"+144","TimeOffsetY:num":"+60","Time_DrawText_JS:func":"\"// Declare Constants\\nconst bitmap = arguments[0];\\nconst hour = TimeManager.getHour();\\nconst hourMilitary = TextManager.getMilitaryHour(hour);\\nconst hourMeridiem = TextManager.getMeridiemHour(hour);\\nconst minute = TimeManager.getMinute().padZero(2);\\nconst meridiem = TextManager.getMeridiemForHour(hour);\\n\\n// Determine Time\\nlet time = '%1:%2'.format(hourMeridiem, minute);;\\ntime += ' ' + meridiem;\\n\\n// Change Font Settings\\nbitmap.fontFace = 'Times New Roman';\\nbitmap.fontSize = 40;\\nbitmap.outlineWidth = 6;\\nbitmap.outlineColor = 'rgba(0, 0, 0, 0.8)';\\n\\n// Draw Text\\nbitmap.drawText(time, 0, 0, bitmap.width, bitmap.height, 'center');\""}
 * 
 * @param Options:struct
 * @text Options Settings
 * @type struct<Options>
 * @parent HUD
 * @desc Options settings for the Date & Time System.
 * @default {"Options":"","AddOption:eval":"true","AdjustRect:eval":"true","Name:str":"Show Date & Time"}
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
/* ----------------------------------------------------------------------------
 * Game Time General Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~GameTimeGeneral:
 *
 * @param Starting
 * @text Starting Data
 *
 * @param StartYear:num
 * @text Start Year
 * @parent Starting
 * @type number
 * @min 1
 * @desc What is the number of the starting year?
 * @default 1
 *
 * @param StartMonth:num
 * @text Start Month
 * @parent Starting
 * @type number
 * @min 1
 * @desc What is the number of the starting month?
 * @default 1
 *
 * @param StartDate:num
 * @text Start Date
 * @parent Starting
 * @type number
 * @min 1
 * @desc What is the number of the starting date?
 * @default 1
 *
 * @param StartWeekday:num
 * @text Start Weekday
 * @parent Starting
 * @type number
 * @min 1
 * @desc What is the number of the starting weekday?
 * @default 1
 *
 * @param StartHour:num
 * @text Start Hour
 * @parent Starting
 * @type number
 * @desc What is the number of the starting hour?
 * @default 8
 *
 * @param StartMinute:num
 * @text Start Minute
 * @parent Starting
 * @type number
 * @desc What is the number of the starting minute?
 * @default 0
 *
 * @param Mechanics
 * @text Game Time Mechanics
 *
 * @param msPerMinute:num
 * @text MS Per Game Minute
 * @parent Mechanics
 * @type number
 * @min 20
 * @desc How many milliseconds will count as a game minute?
 * 1000 milliseconds = 1 real life second.
 * @default 1000
 *
 * @param minutesInHour:num
 * @text Minutes in an Hour
 * @parent Mechanics
 * @type number
 * @min 1
 * @desc How many minutes are there in an hour?
 * This is for Game Time only.
 * @default 60
 * 
 * @param roundMinutesTo10:eval
 * @text Round Minutes to 10s
 * @parent minutesInHour:num
 * @type boolean
 * @on Round
 * @off Don't Round
 * @desc Rounds the displayed minutes to 10's so they only
 * visually update every 10 Game Time minutes.
 * @default true
 *
 * @param HoursInDay:num
 * @text Hours in a Day
 * @parent Mechanics
 * @type number
 * @min 1
 * @desc How many hours are there in a day?
 * This is for Game Time only.
 * @default 24
 *
 * @param LeapYearCalc:func
 * @text JS: Check Leap Year
 * @parent Mechanics
 * @type note
 * @desc Code used to determine how a year is considered a leap year.
 * @default "// Declare Constants\nconst year = arguments[0];\n\n// Check Leap Year Rules\nreturn (year % 400 === 0) ||\n  ((year % 100 !== 0) && (year % 4 === 0));"
 * 
 * @param Pause
 * @text Pause Conditions
 * 
 * @param PauseEventRunning:eval
 * @text If Event Running
 * @parent Pause
 * @type boolean
 * @on Pause
 * @off Don't Pause
 * @desc Pauses Game Time update if an event is running?
 * Doesn't apply to Parallels. Applies to Autorun.
 * @default true
 * 
 * @param PauseMoveRouteForcing:eval
 * @text If Forced Player Move
 * @parent Pause
 * @type boolean
 * @on Pause
 * @off Don't Pause
 * @desc Pauses Game Time update if player movement is forced?
 * Doesn't apply to Parallels. Applies to Autorun.
 * @default true
 * 
 * @param PauseGatheringFollowers:eval
 * @text If Gather Followers
 * @parent Pause
 * @type boolean
 * @on Pause
 * @off Don't Pause
 * @desc Pauses Game Time update if followers are gathering?
 * Doesn't apply to Parallels. Applies to Autorun.
 * @default true
 * 
 * @param PauseVehicleEntry:eval
 * @text If Vehicle Entry/Exit
 * @parent Pause
 * @type boolean
 * @on Pause
 * @off Don't Pause
 * @desc Pauses Game Time update if followers are gathering?
 * Doesn't apply to Parallels. Applies to Autorun.
 * @default true
 *
 * @param MonthStruct
 * @text Month Structure
 *
 * @param Months:arraystruct
 * @text List of Months
 * @parent MonthStruct
 * @type struct<GameTimeMonth>[]
 * @desc Here, adjust the in-game months for Game Time.
 * Months will occur in the order they're in.
 * @default ["{\"Name:str\":\"Verenthilun\",\"Abbr:str\":\"VER\",\"Days:num\":\"28\",\"LeapMonth:eval\":\"false\",\"Season:str\":\"spring\"}","{\"Name:str\":\"Solarnilun\",\"Abbr:str\":\"SOL\",\"Days:num\":\"28\",\"LeapMonth:eval\":\"false\",\"Season:str\":\"summer\"}","{\"Name:str\":\"Auminolun\",\"Abbr:str\":\"AUM\",\"Days:num\":\"28\",\"LeapMonth:eval\":\"false\",\"Season:str\":\"autumn\"}","{\"Name:str\":\"Frostalun\",\"Abbr:str\":\"FRO\",\"Days:num\":\"28\",\"LeapMonth:eval\":\"false\",\"Season:str\":\"winter\"}"]
 *
 * @param WeekdayStruct
 * @text Weekday Structure
 *
 * @param Weekdays:arraystruct
 * @text List of Weekdays
 * @parent WeekdayStruct
 * @type struct<GameTimeWeekday>[]
 * @desc Here, adjust the in-game weekdays for Game Time.
 * Weekdays will occur in the order they're in.
 * @default ["{\"Name:str\":\"Lunara\",\"Abbr:str\":\"LUN\",\"WeekdayType:str\":\"weekday\"}","{\"Name:str\":\"Tundara\",\"Abbr:str\":\"TUN\",\"WeekdayType:str\":\"weekday\"}","{\"Name:str\":\"Wyrmara\",\"Abbr:str\":\"WYR\",\"WeekdayType:str\":\"weekday\"}","{\"Name:str\":\"Thundra\",\"Abbr:str\":\"THU\",\"WeekdayType:str\":\"weekday\"}","{\"Name:str\":\"Fyrara\",\"Abbr:str\":\"FYR\",\"WeekdayType:str\":\"weekday\"}","{\"Name:str\":\"Sylphira\",\"Abbr:str\":\"SYL\",\"WeekdayType:str\":\"weekend\"}","{\"Name:str\":\"Heliora\",\"Abbr:str\":\"HEL\",\"WeekdayType:str\":\"weekend\"}"]
 *
 * @param DayStruct
 * @text Day Structure
 *
 * @param DawnHours:arraynum
 * @text Dawn Hours
 * @parent DayStruct
 * @type number[]
 * @min 0
 * @max 23
 * @desc What hours are considered "Dawn" hours?
 * This is for Game Time only.
 * @default ["4","5","6"]
 *
 * @param DayHours:arraynum
 * @text Day Hours
 * @parent DayStruct
 * @type number[]
 * @min 0
 * @max 23
 * @desc What hours are considered "Day" hours?
 * This is for Game Time only.
 * @default ["7","8","9","10","11","12","13","14","15","16","17"]
 *
 * @param DuskHours:arraynum
 * @text Dusk Hours
 * @parent DayStruct
 * @type number[]
 * @min 0
 * @max 23
 * @desc What hours are considered "Dusk" hours?
 * This is for Game Time only.
 * @default ["18","19","20"]
 *
 * @param NightHours:arraynum
 * @text Night Hours
 * @parent DayStruct
 * @type number[]
 * @min 0
 * @max 23
 * @desc What hours are considered "Night" hours?
 * This is for Game Time only.
 * @default ["21","22","23","0","1","2","3"]
 *
 */
/* ----------------------------------------------------------------------------
 * Game Time Month Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~GameTimeMonth:
 *
 * @param Name:str
 * @text Name
 * @desc What is the name of the month?
 * @default Untitled
 *
 * @param Abbr:str
 * @text Abbreviation
 * @parent Name:str
 * @desc What is the abbreviation of this month?
 * @default UNT
 *
 * @param Days:num
 * @text Total Days
 * @type num
 * @min 1
 * @desc How many days are there in this month?
 * @default 28
 *
 * @param LeapMonth:eval
 * @text Leap Month?
 * @parent Days:num
 * @type boolean
 * @on Leap Month
 * @off Not Leap Month
 * @desc Is this month a leap month?
 * It'll get an extra day each leap year.
 * @default false
 *
 * @param Season:str
 * @text Season
 * @type select
 * @option spring
 * @option summer
 * @option autumn
 * @option winter
 * @desc What season is this month a part of?
 * @default spring
 *
 */
/* ----------------------------------------------------------------------------
 * Game Time Weekdays Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~GameTimeWeekday:
 *
 * @param Name:str
 * @text Name
 * @desc What is the name of this weekday?
 * @default Untitled
 *
 * @param Abbr:str
 * @text Abbreviation
 * @parent Name:str
 * @desc What is the abbreviation of this weekday?
 * @default UNT
 *
 * @param WeekdayType:str
 * @text Weekday Type
 * @type select
 * @option weekday
 * @option weekend
 * @desc Is this day part of the weekdays or weekend?
 * @default weekday
 *
 */
/* ----------------------------------------------------------------------------
 * Game Time Vocab Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~GameTimeVocab:
 * 
 * @param MonthsSeasons
 * @text Seasons
 *
 * @param SeasonSpring:str
 * @text Spring
 * @parent MonthsSeasons
 * @desc How "Spring" is displayed.
 * @default Spring
 *
 * @param SeasonSummer:str
 * @text Summer
 * @parent MonthsSeasons
 * @desc How "Summer" is displayed.
 * @default Summer
 *
 * @param SeasonAutumn:str
 * @text Autumn
 * @parent MonthsSeasons
 * @desc How "Autumn" is displayed.
 * @default Autumn
 *
 * @param SeasonWinter:str
 * @text Winter
 * @parent MonthsSeasons
 * @desc How "Winter" is displayed.
 * @default Winter
 * 
 * @param WeekdaysType
 * @text Weekday Type
 *
 * @param WeekdayName:str
 * @text Weekday
 * @parent WeekdaysType
 * @desc How "Weekday" is displayed.
 * @default Weekday
 *
 * @param WeekendName:str
 * @text Weekend
 * @parent WeekdaysType
 * @desc how "Weekend" is displayed.
 * @default Weekend
 *
 * @param Time
 * @text Time-Related
 *
 * @param TimeMeridiem
 * @text Meridiem
 * @parent Time
 *
 * @param TimeAM:str
 * @text Ante Meridiem
 * @parent TimeMeridiem
 * @desc How "Ante Meridiem" is displayed.
 * @default AM
 *
 * @param TimePM:str
 * @text Post Meridiem
 * @parent TimeMeridiem
 * @desc How "Post Meridiem" is displayed.
 * @default PM
 *
 * @param TimeDayCycle
 * @text Day Cycle
 * @parent Time
 *
 * @param TimeDawn:str
 * @text Dawn
 * @parent TimeDayCycle
 * @desc How "Dawn" is displayed.
 * @default Dawn
 *
 * @param TimeDay:str
 * @text Day
 * @parent TimeDayCycle
 * @desc How "Day" is displayed.
 * @default Daytime
 *
 * @param TimeDusk:str
 * @text Dusk
 * @parent TimeDayCycle
 * @desc How "Dusk" is displayed.
 * @default Dusk
 *
 * @param TimeNight:str
 * @text Night
 * @parent TimeDayCycle
 * @desc How "Night" is displayed.
 * @default Nighttime
 *
 */
/* ----------------------------------------------------------------------------
 * Real Time General Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~RealTimeGeneral:
 *
 * @param Seasonal
 * @text Seasonal Months
 *
 * @param SpringMonths:arraynum
 * @text Spring Months
 * @parent Seasonal
 * @type number[]
 * @min 1
 * @max 12
 * @desc Which Real Time months are Spring months for this game?
 * @default ["3","4","5"]
 *
 * @param SummerMonths:arraynum
 * @text Summer Months
 * @parent Seasonal
 * @type number[]
 * @min 1
 * @max 12
 * @desc Which Real Time months are Summer months for this game?
 * @default ["6","7","8"]
 *
 * @param AutumnMonths:arraynum
 * @text Autumn Months
 * @parent Seasonal
 * @type number[]
 * @min 1
 * @max 12
 * @desc Which Real Time months are Autumn months for this game?
 * @default ["9","10","11"]
 *
 * @param WinterMonths:arraynum
 * @text Winter Months
 * @parent Seasonal
 * @type number[]
 * @min 1
 * @max 12
 * @desc Which Real Time months are Winter months for this game?
 * @default ["12","1","2"]
 *
 * @param Weekday
 * @text Week Structure
 *
 * @param Weekdays:arraynum
 * @text Weekdays
 * @parent Weekday
 * @type number[]
 * @min 1
 * @max 7
 * @desc Which Real Time weekdays are considered "Weekdays"?
 * @default ["1","2","3","4","5"]
 *
 * @param Weekends:arraynum
 * @text Weekends
 * @parent Weekday
 * @type number[]
 * @min 1
 * @max 7
 * @desc Which Real Time weekdays are considered "Weekends"?
 * @default ["6","7"]
 *
 * @param DayStruct
 * @text Day Structure
 *
 * @param DawnHours:arraynum
 * @text Dawn Hours
 * @parent DayStruct
 * @type number[]
 * @min 0
 * @max 23
 * @desc What hours are considered "Dawn" hours?
 * Use military time.
 * @default ["4","5","6"]
 *
 * @param DayHours:arraynum
 * @text Day Hours
 * @parent DayStruct
 * @type number[]
 * @min 0
 * @max 23
 * @desc What hours are considered "Day" hours?
 * Use military time.
 * @default ["7","8","9","10","11","12","13","14","15","16","17"]
 *
 * @param DuskHours:arraynum
 * @text Dusk Hours
 * @parent DayStruct
 * @type number[]
 * @min 0
 * @max 23
 * @desc What hours are considered "Dusk" hours?
 * Use military time.
 * @default ["18","19","20"]
 *
 * @param NightHours:arraynum
 * @text Night Hours
 * @parent DayStruct
 * @type number[]
 * @min 0
 * @max 23
 * @desc What hours are considered "Night" hours?
 * Use military time.
 * @default ["21","22","23","0","1","2","3"]
 *
 * @param SaveCore
 * @text VisuMZ_1_SaveCore
 *
 * @param LoadMinDiff:num
 * @text Difference Variable
 * @parent SaveCore
 * @type variable
 * @desc Select a variable that records the time difference from
 * the last save game and the current load game in minutes.
 * @default 0
 *
 */
/* ----------------------------------------------------------------------------
 * Real Time Tone/Overlay Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~RealTimeToneOverlay:
 *
 * @param Tones
 * @text Screen Tones/Tints
 *
 * @param Tone0:eval
 * @text 00:00 / 12 AM
 * @parent Tones
 * @desc What tone/tint is used for this hour?
 * Format: [Red, Green, Blue, Gray]
 * @default [-68, -68, 0, 68]
 *
 * @param Tone1:eval
 * @text 01:00 / 1 AM
 * @parent Tones
 * @desc What tone/tint is used for this hour?
 * Format: [Red, Green, Blue, Gray]
 * @default [-68, -68, 0, 68]
 *
 * @param Tone2:eval
 * @text 02:00 / 2 AM
 * @parent Tones
 * @desc What tone/tint is used for this hour?
 * Format: [Red, Green, Blue, Gray]
 * @default [-68, -68, 0, 68]
 *
 * @param Tone3:eval
 * @text 03:00 / 3 AM
 * @parent Tones
 * @desc What tone/tint is used for this hour?
 * Format: [Red, Green, Blue, Gray]
 * @default [-68, -68, 0, 68]
 *
 * @param Tone4:eval
 * @text 04:00 / 4 AM
 * @parent Tones
 * @desc What tone/tint is used for this hour?
 * Format: [Red, Green, Blue, Gray]
 * @default [-51, -51, 0, 51]
 *
 * @param Tone5:eval
 * @text 05:00 / 5 AM
 * @parent Tones
 * @desc What tone/tint is used for this hour?
 * Format: [Red, Green, Blue, Gray]
 * @default [-34, -34, 0, 34]
 *
 * @param Tone6:eval
 * @text 06:00 / 6 AM
 * @parent Tones
 * @desc What tone/tint is used for this hour?
 * Format: [Red, Green, Blue, Gray]
 * @default [-17, -17, 0, 17]
 *
 * @param Tone7:eval
 * @text 07:00 / 7 AM
 * @parent Tones
 * @desc What tone/tint is used for this hour?
 * Format: [Red, Green, Blue, Gray]
 * @default [0, 0, 0, 0]
 *
 * @param Tone8:eval
 * @text 08:00 / 8 AM
 * @parent Tones
 * @desc What tone/tint is used for this hour?
 * Format: [Red, Green, Blue, Gray]
 * @default [0, 0, 0, 0]
 *
 * @param Tone9:eval
 * @text 09:00 / 9 AM
 * @parent Tones
 * @desc What tone/tint is used for this hour?
 * Format: [Red, Green, Blue, Gray]
 * @default [0, 0, 0, 0]
 *
 * @param Tone10:eval
 * @text 10:00 / 10 AM
 * @parent Tones
 * @desc What tone/tint is used for this hour?
 * Format: [Red, Green, Blue, Gray]
 * @default [0, 0, 0, 0]
 *
 * @param Tone11:eval
 * @text 11:00 / 11 AM
 * @parent Tones
 * @desc What tone/tint is used for this hour?
 * Format: [Red, Green, Blue, Gray]
 * @default [0, 0, 0, 0]
 *
 * @param Tone12:eval
 * @text 12:00 / 12 PM
 * @parent Tones
 * @desc What tone/tint is used for this hour?
 * Format: [Red, Green, Blue, Gray]
 * @default [0, 0, 0, 0]
 *
 * @param Tone13:eval
 * @text 13:00 / 1 PM
 * @parent Tones
 * @desc What tone/tint is used for this hour?
 * Format: [Red, Green, Blue, Gray]
 * @default [0, 0, 0, 0]
 *
 * @param Tone14:eval
 * @text 14:00 / 2 PM
 * @parent Tones
 * @desc What tone/tint is used for this hour?
 * Format: [Red, Green, Blue, Gray]
 * @default [0, 0, 0, 0]
 *
 * @param Tone15:eval
 * @text 15:00 / 3 PM
 * @parent Tones
 * @desc What tone/tint is used for this hour?
 * Format: [Red, Green, Blue, Gray]
 * @default [0, 0, 0, 0]
 *
 * @param Tone16:eval
 * @text 16:00 / 4 PM
 * @parent Tones
 * @desc What tone/tint is used for this hour?
 * Format: [Red, Green, Blue, Gray]
 * @default [0, 0, 0, 0]
 *
 * @param Tone17:eval
 * @text 17:00 / 5 PM
 * @parent Tones
 * @desc What tone/tint is used for this hour?
 * Format: [Red, Green, Blue, Gray]
 * @default [0, 0, 0, 0]
 *
 * @param Tone18:eval
 * @text 18:00 / 6 PM
 * @parent Tones
 * @desc What tone/tint is used for this hour?
 * Format: [Red, Green, Blue, Gray]
 * @default [34, -17, -17, 0]
 *
 * @param Tone19:eval
 * @text 19:00 / 7 PM
 * @parent Tones
 * @desc What tone/tint is used for this hour?
 * Format: [Red, Green, Blue, Gray]
 * @default [68, -34, -34, 0]
 *
 * @param Tone20:eval
 * @text 20:00 / 8 PM
 * @parent Tones
 * @desc What tone/tint is used for this hour?
 * Format: [Red, Green, Blue, Gray]
 * @default [0, -51, -17, 34]
 *
 * @param Tone21:eval
 * @text 21:00 / 9 PM
 * @parent Tones
 * @desc What tone/tint is used for this hour?
 * Format: [Red, Green, Blue, Gray]
 * @default [-68, -68, 0, 68]
 *
 * @param Tone22:eval
 * @text 22:00 / 10 PM
 * @parent Tones
 * @desc What tone/tint is used for this hour?
 * Format: [Red, Green, Blue, Gray]
 * @default [-68, -68, 0, 68]
 *
 * @param Tone23:eval
 * @text 23:00 / 11 PM
 * @parent Tones
 * @desc What tone/tint is used for this hour?
 * Format: [Red, Green, Blue, Gray]
 * @default [-68, -68, 0, 68]
 *
 * @param Overlays
 * @text Screen Overlay
 *
 * @param OverlaysReq
 * @text Requires
 * @parent Overlays
 * @default VisuMZ_2_LightingEffects
 *
 * @param Overlay0:str
 * @text 00:00 / 12 AM
 * @parent Overlays
 * @desc What overlay is used for this hour?
 * Format: #rrggbb. Requires VisuMZ_2_LightingEffects!
 * @default #2e3192
 *
 * @param Overlay1:str
 * @text 01:00 / 1 AM
 * @parent Overlays
 * @desc What overlay is used for this hour?
 * Format: #rrggbb. Requires VisuMZ_2_LightingEffects!
 * @default #2e3192
 *
 * @param Overlay2:str
 * @text 02:00 / 2 AM
 * @parent Overlays
 * @desc What overlay is used for this hour?
 * Format: #rrggbb. Requires VisuMZ_2_LightingEffects!
 * @default #2e3192
 *
 * @param Overlay3:str
 * @text 03:00 / 3 AM
 * @parent Overlays
 * @desc What overlay is used for this hour?
 * Format: #rrggbb. Requires VisuMZ_2_LightingEffects!
 * @default #2e3192
 *
 * @param Overlay4:str
 * @text 04:00 / 4 AM
 * @parent Overlays
 * @desc What overlay is used for this hour?
 * Format: #rrggbb. Requires VisuMZ_2_LightingEffects!
 * @default #404d9a
 *
 * @param Overlay5:str
 * @text 05:00 / 5 AM
 * @parent Overlays
 * @desc What overlay is used for this hour?
 * Format: #rrggbb. Requires VisuMZ_2_LightingEffects!
 * @default #5674b9
 *
 * @param Overlay6:str
 * @text 06:00 / 6 AM
 * @parent Overlays
 * @desc What overlay is used for this hour?
 * Format: #rrggbb. Requires VisuMZ_2_LightingEffects!
 * @default #aab4e8
 *
 * @param Overlay7:str
 * @text 07:00 / 7 AM
 * @parent Overlays
 * @desc What overlay is used for this hour?
 * Format: #rrggbb. Requires VisuMZ_2_LightingEffects!
 * @default #ffffff
 *
 * @param Overlay8:str
 * @text 08:00 / 8 AM
 * @parent Overlays
 * @desc What overlay is used for this hour?
 * Format: #rrggbb. Requires VisuMZ_2_LightingEffects!
 * @default #ffffff
 *
 * @param Overlay9:str
 * @text 09:00 / 9 AM
 * @parent Overlays
 * @desc What overlay is used for this hour?
 * Format: #rrggbb. Requires VisuMZ_2_LightingEffects!
 * @default #ffffff
 *
 * @param Overlay10:str
 * @text 10:00 / 10 AM
 * @parent Overlays
 * @desc What overlay is used for this hour?
 * Format: #rrggbb. Requires VisuMZ_2_LightingEffects!
 * @default #ffffff
 *
 * @param Overlay11:str
 * @text 11:00 / 11 AM
 * @parent Overlays
 * @desc What overlay is used for this hour?
 * Format: #rrggbb. Requires VisuMZ_2_LightingEffects!
 * @default #ffffff
 *
 * @param Overlay12:str
 * @text 12:00 / 12 PM
 * @parent Overlays
 * @desc What overlay is used for this hour?
 * Format: #rrggbb. Requires VisuMZ_2_LightingEffects!
 * @default #ffffff
 *
 * @param Overlay13:str
 * @text 13:00 / 1 PM
 * @parent Overlays
 * @desc What overlay is used for this hour?
 * Format: #rrggbb. Requires VisuMZ_2_LightingEffects!
 * @default #ffffff
 *
 * @param Overlay14:str
 * @text 14:00 / 2 PM
 * @parent Overlays
 * @desc What overlay is used for this hour?
 * Format: #rrggbb. Requires VisuMZ_2_LightingEffects!
 * @default #ffffff
 *
 * @param Overlay15:str
 * @text 15:00 / 3 PM
 * @parent Overlays
 * @desc What overlay is used for this hour?
 * Format: #rrggbb. Requires VisuMZ_2_LightingEffects!
 * @default #ffffff
 *
 * @param Overlay16:str
 * @text 16:00 / 4 PM
 * @parent Overlays
 * @desc What overlay is used for this hour?
 * Format: #rrggbb. Requires VisuMZ_2_LightingEffects!
 * @default #ffffff
 *
 * @param Overlay17:str
 * @text 17:00 / 5 PM
 * @parent Overlays
 * @desc What overlay is used for this hour?
 * Format: #rrggbb. Requires VisuMZ_2_LightingEffects!
 * @default #ffffff
 *
 * @param Overlay18:str
 * @text 18:00 / 6 PM
 * @parent Overlays
 * @desc What overlay is used for this hour?
 * Format: #rrggbb. Requires VisuMZ_2_LightingEffects!
 * @default #fbca8f
 *
 * @param Overlay19:str
 * @text 19:00 / 7 PM
 * @parent Overlays
 * @desc What overlay is used for this hour?
 * Format: #rrggbb. Requires VisuMZ_2_LightingEffects!
 * @default #f7941d
 *
 * @param Overlay20:str
 * @text 20:00 / 8 PM
 * @parent Overlays
 * @desc What overlay is used for this hour?
 * Format: #rrggbb. Requires VisuMZ_2_LightingEffects!
 * @default #63a850
 *
 * @param Overlay21:str
 * @text 21:00 / 9 PM
 * @parent Overlays
 * @desc What overlay is used for this hour?
 * Format: #rrggbb. Requires VisuMZ_2_LightingEffects!
 * @default #2e3192
 *
 * @param Overlay22:str
 * @text 22:00 / 10 PM
 * @parent Overlays
 * @desc What overlay is used for this hour?
 * Format: #rrggbb. Requires VisuMZ_2_LightingEffects!
 * @default #2e3192
 *
 * @param Overlay23:str
 * @text 23:00 / 11 PM
 * @parent Overlays
 * @desc What overlay is used for this hour?
 * Format: #rrggbb. Requires VisuMZ_2_LightingEffects!
 * @default #2e3192
 *
 */
/* ----------------------------------------------------------------------------
 * Real Time Vocabulary Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~RealTimeVocab:
 *
 * @param Months
 * @text Month Names
 * 
 * @param MonthsFull
 * @text Full Names
 * @parent Months
 *
 * @param MonthFull1:str
 * @text Month 1
 * @parent MonthsFull
 * @desc Name of this month.
 * @default January
 *
 * @param MonthFull2:str
 * @text Month 2
 * @parent MonthsFull
 * @desc Name of this month.
 * @default February
 *
 * @param MonthFull3:str
 * @text Month 3
 * @parent MonthsFull
 * @desc Name of this month.
 * @default March
 *
 * @param MonthFull4:str
 * @text Month 4
 * @parent MonthsFull
 * @desc Name of this month.
 * @default April
 *
 * @param MonthFull5:str
 * @text Month 5
 * @parent MonthsFull
 * @desc Name of this month.
 * @default May
 *
 * @param MonthFull6:str
 * @text Month 6
 * @parent MonthsFull
 * @desc Name of this month.
 * @default June
 *
 * @param MonthFull7:str
 * @text Month 7
 * @parent MonthsFull
 * @desc Name of this month.
 * @default July
 *
 * @param MonthFull8:str
 * @text Month 8
 * @parent MonthsFull
 * @desc Name of this month.
 * @default August
 *
 * @param MonthFull9:str
 * @text Month 9
 * @parent MonthsFull
 * @desc Name of this month.
 * @default September
 *
 * @param MonthFull10:str
 * @text Month 10
 * @parent MonthsFull
 * @desc Name of this month.
 * @default October
 *
 * @param MonthFull11:str
 * @text Month 11
 * @parent MonthsFull
 * @desc Name of this month.
 * @default November
 *
 * @param MonthFull12:str
 * @text Month 12
 * @parent MonthsFull
 * @desc Name of this month.
 * @default December
 * 
 * @param MonthsAbbr
 * @text Abbreviations
 * @parent Months
 *
 * @param MonthAbbr1:str
 * @text Month 1
 * @parent MonthsAbbr
 * @desc Abbreviation of this month.
 * @default JAN
 *
 * @param MonthAbbr2:str
 * @text Month 2
 * @parent MonthsAbbr
 * @desc Abbreviation of this month.
 * @default FEB
 *
 * @param MonthAbbr3:str
 * @text Month 3
 * @parent MonthsAbbr
 * @desc Abbreviation of this month.
 * @default MAR
 *
 * @param MonthAbbr4:str
 * @text Month 4
 * @parent MonthsAbbr
 * @desc Abbreviation of this month.
 * @default APR
 *
 * @param MonthAbbr5:str
 * @text Month 5
 * @parent MonthsAbbr
 * @desc Abbreviation of this month.
 * @default MAY
 *
 * @param MonthAbbr6:str
 * @text Month 6
 * @parent MonthsAbbr
 * @desc Abbreviation of this month.
 * @default JUN
 *
 * @param MonthAbbr7:str
 * @text Month 7
 * @parent MonthsAbbr
 * @desc Abbreviation of this month.
 * @default JUL
 *
 * @param MonthAbbr8:str
 * @text Month 8
 * @parent MonthsAbbr
 * @desc Abbreviation of this month.
 * @default AUG
 *
 * @param MonthAbbr9:str
 * @text Month 9
 * @parent MonthsAbbr
 * @desc Abbreviation of this month.
 * @default SEP
 *
 * @param MonthAbbr10:str
 * @text Month 10
 * @parent MonthsAbbr
 * @desc Abbreviation of this month.
 * @default OCT
 *
 * @param MonthAbbr11:str
 * @text Month 11
 * @parent MonthsAbbr
 * @desc Abbreviation of this month.
 * @default NOV
 *
 * @param MonthAbbr12:str
 * @text Month 12
 * @parent MonthsAbbr
 * @desc Abbreviation of this month.
 * @default DEC
 * 
 * @param MonthsSeasons
 * @text Seasons
 * @parent Months
 *
 * @param SeasonSpring:str
 * @text Spring
 * @parent MonthsSeasons
 * @desc How "Spring" is displayed.
 * @default Spring
 *
 * @param SeasonSummer:str
 * @text Summer
 * @parent MonthsSeasons
 * @desc How "Summer" is displayed.
 * @default Summer
 *
 * @param SeasonAutumn:str
 * @text Autumn
 * @parent MonthsSeasons
 * @desc How "Autumn" is displayed.
 * @default Autumn
 *
 * @param SeasonWinter:str
 * @text Winter
 * @parent MonthsSeasons
 * @desc How "Winter" is displayed.
 * @default Winter
 *
 * @param Weekdays
 * @text Weekday Names
 * 
 * @param WeekdaysFull
 * @text Full Names
 * @parent Weekdays
 *
 * @param WeekdayFull1:str
 * @text Weekday 1
 * @parent WeekdaysFull
 * @desc Name of this weekday.
 * @default Monday
 *
 * @param WeekdayFull2:str
 * @text Weekday 2
 * @parent WeekdaysFull
 * @desc Name of this weekday.
 * @default Tuesday
 *
 * @param WeekdayFull3:str
 * @text Weekday 3
 * @parent WeekdaysFull
 * @desc Name of this weekday.
 * @default Wednesday
 *
 * @param WeekdayFull4:str
 * @text Weekday 4
 * @parent WeekdaysFull
 * @desc Name of this weekday.
 * @default Thursday
 *
 * @param WeekdayFull5:str
 * @text Weekday 5
 * @parent WeekdaysFull
 * @desc Name of this weekday.
 * @default Friday
 *
 * @param WeekdayFull6:str
 * @text Weekday 6
 * @parent WeekdaysFull
 * @desc Name of this weekday.
 * @default Saturday
 *
 * @param WeekdayFull7:str
 * @text Weekday 7
 * @parent WeekdaysFull
 * @desc Name of this weekday.
 * @default Sunday
 * 
 * @param WeekdaysAbbr
 * @text Abbreviation
 * @parent Weekdays
 *
 * @param WeekdayAbbr1:str
 * @text Weekday 1
 * @parent WeekdaysAbbr
 * @desc Abbreviation of this weekday.
 * @default MON
 *
 * @param WeekdayAbbr2:str
 * @text Weekday 2
 * @parent WeekdaysAbbr
 * @desc Abbreviation of this weekday.
 * @default TUE
 *
 * @param WeekdayAbbr3:str
 * @text Weekday 3
 * @parent WeekdaysAbbr
 * @desc Abbreviation of this weekday.
 * @default WED
 *
 * @param WeekdayAbbr4:str
 * @text Weekday 4
 * @parent WeekdaysAbbr
 * @desc Abbreviation of this weekday.
 * @default THU
 *
 * @param WeekdayAbbr5:str
 * @text Weekday 5
 * @parent WeekdaysAbbr
 * @desc Abbreviation of this weekday.
 * @default FRI
 *
 * @param WeekdayAbbr6:str
 * @text Weekday 6
 * @parent WeekdaysAbbr
 * @desc Abbreviation of this weekday.
 * @default SAT
 *
 * @param WeekdayAbbr7:str
 * @text Weekday 7
 * @parent WeekdaysAbbr
 * @desc Abbreviation of this weekday.
 * @default SUN
 * 
 * @param WeekdaysType
 * @text Weekday Type
 * @parent Weekdays
 *
 * @param WeekdayName:str
 * @text Weekday
 * @parent WeekdaysType
 * @desc How "Weekday" is displayed.
 * @default Weekday
 *
 * @param WeekendName:str
 * @text Weekend
 * @parent WeekdaysType
 * @desc how "Weekend" is displayed.
 * @default Weekend
 *
 * @param Time
 * @text Time-Related
 *
 * @param TimeMeridiem
 * @text Meridiem
 * @parent Time
 *
 * @param TimeAM:str
 * @text Ante Meridiem
 * @parent TimeMeridiem
 * @desc How "Ante Meridiem" is displayed.
 * @default AM
 *
 * @param TimePM:str
 * @text Post Meridiem
 * @parent TimeMeridiem
 * @desc How "Post Meridiem" is displayed.
 * @default PM
 *
 * @param TimeDayCycle
 * @text Day Cycle
 * @parent Time
 *
 * @param TimeDawn:str
 * @text Dawn
 * @parent TimeDayCycle
 * @desc How "Dawn" is displayed.
 * @default Dawn
 *
 * @param TimeDay:str
 * @text Day
 * @parent TimeDayCycle
 * @desc How "Day" is displayed.
 * @default Daytime
 *
 * @param TimeDusk:str
 * @text Dusk
 * @parent TimeDayCycle
 * @desc How "Dusk" is displayed.
 * @default Dusk
 *
 * @param TimeNight:str
 * @text Night
 * @parent TimeDayCycle
 * @desc How "Night" is displayed.
 * @default Nighttime
 *
 */
/* ----------------------------------------------------------------------------
 * Variables & Switches Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~VarSw:
 *
 * @param Variables
 * 
 * @param VarCalendarType
 * @text Calendar
 * @parent Variables
 *
 * @param VarYear:num
 * @text Year Variable
 * @parent VarCalendarType
 * @type variable
 * @desc Select a variable to record the year.
 * Leave at 0 to not use.
 * @default 0
 *
 * @param VarMonth:num
 * @text Month Variable
 * @parent VarCalendarType
 * @type variable
 * @desc Select a variable to record the month.
 * Leave at 0 to not use.
 * @default 0
 *
 * @param VarDate:num
 * @text Date Variable
 * @parent VarCalendarType
 * @type variable
 * @desc Select a variable to record the date.
 * Leave at 0 to not use.
 * @default 0
 *
 * @param VarFullDate:num
 * @text Full Date Variable
 * @parent VarCalendarType
 * @type variable
 * @desc Select a variable to record the full date.
 * Leave at 0 to not use.
 * @default 0
 * 
 * @param VarDayType
 * @text Weekday
 * @parent Variables
 *
 * @param VarWeekday:num
 * @text Weekday Variable
 * @parent VarDayType
 * @type variable
 * @desc Select a variable to record the weekday.
 * Leave at 0 to not use.
 * @default 0
 * 
 * @param VarTimeType
 * @text Time
 * @parent Variables
 *
 * @param VarHour:num
 * @text Hour Variable
 * @parent VarTimeType
 * @type variable
 * @desc Select a variable to record the hour.
 * Leave at 0 to not use.
 * @default 0
 *
 * @param VarMinute:num
 * @text Minute Variable
 * @parent VarTimeType
 * @type variable
 * @desc Select a variable to record the minute.
 * Leave at 0 to not use.
 * @default 0
 *
 * @param VarSecond:num
 * @text Second Variable
 * @parent VarTimeType
 * @type variable
 * @desc Select a variable to record the second.
 * Leave at 0 to not use. Not available for Game Time.
 * @default 0
 *
 * @param VarFullTime:num
 * @text Full Time Variable
 * @parent VarTimeType
 * @type variable
 * @desc Select a variable to record the full time.
 * Leave at 0 to not use.
 * @default 0
 *
 * @param Switches
 * 
 * @param SwSeasonType
 * @text Seasons
 * @parent Switches
 *
 * @param SwSpring:num
 * @text Spring Switch
 * @parent SwSeasonType
 * @type switch
 * @desc Turns on when season is a "Spring" month.
 * Leave at 0 to not use.
 * @default 0
 *
 * @param SwSummer:num
 * @text Summer Switch
 * @parent SwSeasonType
 * @type switch
 * @desc Turns on when season is a "Summer" month.
 * Leave at 0 to not use.
 * @default 0
 *
 * @param SwAutumn:num
 * @text Autumn Switch
 * @parent SwSeasonType
 * @type switch
 * @desc Turns on when season is a "Autumn" month.
 * Leave at 0 to not use.
 * @default 0
 *
 * @param SwWinter:num
 * @text Winter Switch
 * @parent SwSeasonType
 * @type switch
 * @desc Turns on when season is a "Winter" month.
 * Leave at 0 to not use.
 * @default 0
 * 
 * @param SwDayType
 * @text Days
 * @parent Switches
 *
 * @param SwWeekday:num
 * @text Weekday Switch
 * @parent SwDayType
 * @type switch
 * @desc Turns on when day is "Weekday".
 * Leave at 0 to not use.
 * @default 0
 *
 * @param SwWeekend:num
 * @text Weekend Switch
 * @parent SwDayType
 * @type switch
 * @desc Turns on when day is "Weekend".
 * Leave at 0 to not use.
 * @default 0
 * 
 * @param SwHourType
 * @text Hours
 * @parent Switches
 *
 * @param SwDawn:num
 * @text Dawn Switch
 * @parent SwHourType
 * @type switch
 * @desc Turns on when time is "Dawn" hours.
 * Leave at 0 to not use.
 * @default 0
 *
 * @param SwDay:num
 * @text Day Switch
 * @parent SwHourType
 * @type switch
 * @desc Turns on when time is "Day" hours.
 * Leave at 0 to not use.
 * @default 0
 *
 * @param SwDusk:num
 * @text Dusk Switch
 * @parent SwHourType
 * @type switch
 * @desc Turns on when time is "Dusk" hours.
 * Leave at 0 to not use.
 * @default 0
 *
 * @param SwNight:num
 * @text Night Switch
 * @parent SwHourType
 * @type switch
 * @desc Turns on when time is "Night" hours.
 * Leave at 0 to not use.
 * @default 0
 *
 */
/* ----------------------------------------------------------------------------
 * HUD Sprites Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~HudSprite:
 *
 * @param General
 * @text General
 *
 * @param Enable:eval
 * @text Enabled?
 * @parent General
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enables usage of the Date/Time HUD.
 * @default true
 *
 * @param Show:eval
 * @text Show by Default
 * @parent General
 * @type boolean
 * @on Show
 * @off Hidden
 * @desc Sets up default visibility of the Date/Time HUD.
 * Individual maps can be adjusted by notetags.
 * @default true
 *
 * @param OpacitySpeed:num
 * @text Opacity Speed
 * @parent General
 * @desc How fast does fade in/out work?
 * Lower is slower. Higher is faster.
 * @default 16
 *
 * @param Position
 * @text Position
 * @parent General
 * 
 * @param PositionX:num
 * @text Position X
 * @parent Position
 * @desc How much to position the HUD's X by.
 * Negative: left. Positive: right.
 * @default +0
 * 
 * @param PositionY:num
 * @text Position Y
 * @parent Position
 * @desc How much to position the HUD's Y by.
 * Negative: up. Positive: down.
 * @default +0
 *
 * @param Season
 * @text Season Sprite
 *
 * @param SeasonEnable:eval
 * @text Enabled?
 * @parent Season
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enables usage of this sprite.
 * @default true
 *
 * @param SeasonOpacity:num
 * @text Opacity
 * @parent Season
 * @type number
 * @min 0
 * @max 255
 * @desc What is the default opacity for this sprite?
 * Use a value between 0 and 255.
 * @default 128
 *
 * @param SeasonAnchor
 * @text Anchor
 * @parent Season
 * 
 * @param SeasonAnchorX:num
 * @text Anchor X
 * @parent SeasonAnchor
 * @desc Anchor X value for this sprite.
 * 0.0 - left; 0.5 - center; 1.0 - right
 * @default 0.5
 * 
 * @param SeasonAnchorY:num
 * @text Anchor Y
 * @parent SeasonAnchor
 * @desc Anchor Y value for this sprite.
 * 0.0 - top; 0.5 - middle; 1.0 - bottom
 * @default 0.5
 *
 * @param SeasonOffset
 * @text Offset
 * @parent Season
 * 
 * @param SeasonOffsetX:num
 * @text Offset X
 * @parent SeasonOffset
 * @desc How much to offset this sprite's X by.
 * Negative: left. Positive: right.
 * @default +48
 * 
 * @param SeasonOffsetY:num
 * @text Offset Y
 * @parent SeasonOffset
 * @desc How much to offset this sprite's Y by.
 * Negative: up. Positive: down.
 * @default +48
 *
 * @param SeasonScale
 * @text Scale
 * @parent Season
 * 
 * @param SeasonScaleX:num
 * @text Scale X
 * @parent SeasonScale
 * @desc What is the scale used for this sprite icon's X?
 * 0.0 - 0%; 0.5 - 50%; 1.0 - 100%; 1.5 - 150%; 2.0 - 200%
 * @default 3.0
 * 
 * @param SeasonScaleY:num
 * @text Scale Y
 * @parent SeasonScale
 * @desc What is the scale used for this sprite icon's Y?
 * 0.0 - 0%; 0.5 - 50%; 1.0 - 100%; 1.5 - 150%; 2.0 - 200%
 * @default 3.0
 *
 * @param SeasonIcons
 * @text Icons
 * @parent Season
 * 
 * @param SeasonIconSpring:num
 * @text Spring Icon
 * @parent SeasonIcons
 * @desc What icon is used for spring months?
 * Ignore if there is an image equivalent.
 * @default 69
 * 
 * @param SeasonIconSummer:num
 * @text Summer Icon
 * @parent SeasonIcons
 * @desc What icon is used for summer months?
 * Ignore if there is an image equivalent.
 * @default 70
 * 
 * @param SeasonIconAutumn:num
 * @text Autumn Icon
 * @parent SeasonIcons
 * @desc What icon is used for autumn months?
 * Ignore if there is an image equivalent.
 * @default 68
 * 
 * @param SeasonIconWinter:num
 * @text Winter Icon
 * @parent SeasonIcons
 * @desc What icon is used for winter months?
 * Ignore if there is an image equivalent.
 * @default 65
 *
 * @param SeasonImages
 * @text Images
 * @parent Season
 * 
 * @param SeasonImageSpring:str
 * @text Spring Image
 * @parent SeasonImages
 * @type file
 * @dir img/pictures/
 * @require 1
 * @desc What image is used for spring months?
 * Ignores any icon equivalents.
 * @default 
 * 
 * @param SeasonImageSummer:str
 * @text Summer Image
 * @parent SeasonImages
 * @type file
 * @dir img/pictures/
 * @require 1
 * @desc What image is used for summer months?
 * Ignores any icon equivalents.
 * @default 
 * 
 * @param SeasonImageAutumn:str
 * @text Autumn Image
 * @parent SeasonImages
 * @type file
 * @dir img/pictures/
 * @require 1
 * @desc What image is used for autumn months?
 * Ignores any icon equivalents.
 * @default 
 * 
 * @param SeasonImageWinter:str
 * @text Winter Image
 * @parent SeasonImages
 * @type file
 * @dir img/pictures/
 * @require 1
 * @desc What image is used for winter months?
 * Ignores any icon equivalents.
 * @default 
 *
 * @param DayCycle
 * @text DayCycle Sprite
 *
 * @param DayCycleEnable:eval
 * @text Enabled?
 * @parent DayCycle
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enables usage of this sprite.
 * @default true
 *
 * @param DayCycleOpacity:num
 * @text Opacity
 * @parent DayCycle
 * @type number
 * @min 0
 * @max 255
 * @desc What is the default opacity for this sprite?
 * Use a value between 0 and 255.
 * @default 128
 *
 * @param DayCycleAnchor
 * @text Anchor
 * @parent DayCycle
 * 
 * @param DayCycleAnchorX:num
 * @text Anchor X
 * @parent DayCycleAnchor
 * @desc Anchor X value for this sprite.
 * 0.0 - left; 0.5 - center; 1.0 - right
 * @default 0.5
 * 
 * @param DayCycleAnchorY:num
 * @text Anchor Y
 * @parent DayCycleAnchor
 * @desc Anchor Y value for this sprite.
 * 0.0 - top; 0.5 - middle; 1.0 - bottom
 * @default 0.5
 *
 * @param DayCycleOffset
 * @text Offset
 * @parent DayCycle
 * 
 * @param DayCycleOffsetX:num
 * @text Offset X
 * @parent DayCycleOffset
 * @desc How much to offset this sprite's X by.
 * Negative: left. Positive: right.
 * @default +144
 * 
 * @param DayCycleOffsetY:num
 * @text Offset Y
 * @parent DayCycleOffset
 * @desc How much to offset this sprite's Y by.
 * Negative: up. Positive: down.
 * @default +48
 *
 * @param DayCycleScale
 * @text Scale
 * @parent DayCycle
 * 
 * @param DayCycleScaleX:num
 * @text Scale X
 * @parent DayCycleScale
 * @desc What is the scale used for this sprite icon's X?
 * 0.0 - 0%; 0.5 - 50%; 1.0 - 100%; 1.5 - 150%; 2.0 - 200%
 * @default 3.0
 * 
 * @param DayCycleScaleY:num
 * @text Scale Y
 * @parent DayCycleScale
 * @desc What is the scale used for this sprite icon's Y?
 * 0.0 - 0%; 0.5 - 50%; 1.0 - 100%; 1.5 - 150%; 2.0 - 200%
 * @default 3.0
 *
 * @param DayCycleIcons
 * @text Icons
 * @parent DayCycle
 * 
 * @param DayCycleIconDawn:num
 * @text Dawn Icon
 * @parent DayCycleIcons
 * @desc What icon is used for dawn hours?
 * Ignore if there is an image equivalent.
 * @default 73
 * 
 * @param DayCycleIconDay:num
 * @text Day Icon
 * @parent DayCycleIcons
 * @desc What icon is used for day hours?
 * Ignore if there is an image equivalent.
 * @default 87
 * 
 * @param DayCycleIconDusk:num
 * @text Dusk Icon
 * @parent DayCycleIcons
 * @desc What icon is used for dusk hours?
 * Ignore if there is an image equivalent.
 * @default 74
 * 
 * @param DayCycleIconNight:num
 * @text Night Icon
 * @parent DayCycleIcons
 * @desc What icon is used for night?
 * Ignore if there is an image equivalent.
 * @default 88
 *
 * @param DayCycleImages
 * @text Images
 * @parent DayCycle
 * 
 * @param DayCycleImageDawn:str
 * @text Dawn Image
 * @parent DayCycleImages
 * @type file
 * @dir img/pictures/
 * @require 1
 * @desc What image is used for dawn hours?
 * Ignores any icon equivalents.
 * @default 
 * 
 * @param DayCycleImageDay:str
 * @text Day Image
 * @parent DayCycleImages
 * @type file
 * @dir img/pictures/
 * @require 1
 * @desc What image is used for day hours?
 * Ignores any icon equivalents.
 * @default 
 * 
 * @param DayCycleImageDusk:str
 * @text Dusk Image
 * @parent DayCycleImages
 * @type file
 * @dir img/pictures/
 * @require 1
 * @desc What image is used for dusk hours?
 * Ignores any icon equivalents.
 * @default 
 * 
 * @param DayCycleImageNight:str
 * @text Night Image
 * @parent DayCycleImages
 * @type file
 * @dir img/pictures/
 * @require 1
 * @desc What image is used for night hours?
 * Ignores any icon equivalents.
 * @default 
 *
 * @param WeekType
 * @text Weekday Type Sprite
 *
 * @param WeekTypeEnable:eval
 * @text Enabled?
 * @parent WeekType
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enables usage of this sprite.
 * @default true
 *
 * @param WeekTypeOpacity:num
 * @text Opacity
 * @parent WeekType
 * @type number
 * @min 0
 * @max 255
 * @desc What is the default opacity for this sprite?
 * Use a value between 0 and 255.
 * @default 128
 *
 * @param WeekTypeAnchor
 * @text Anchor
 * @parent WeekType
 * 
 * @param WeekTypeAnchorX:num
 * @text Anchor X
 * @parent WeekTypeAnchor
 * @desc Anchor X value for this sprite.
 * 0.0 - left; 0.5 - center; 1.0 - right
 * @default 0.5
 * 
 * @param WeekTypeAnchorY:num
 * @text Anchor Y
 * @parent WeekTypeAnchor
 * @desc Anchor Y value for this sprite.
 * 0.0 - top; 0.5 - middle; 1.0 - bottom
 * @default 0.5
 *
 * @param WeekTypeOffset
 * @text Offset
 * @parent WeekType
 * 
 * @param WeekTypeOffsetX:num
 * @text Offset X
 * @parent WeekTypeOffset
 * @desc How much to offset this sprite's X by.
 * Negative: left. Positive: right.
 * @default +240
 * 
 * @param WeekTypeOffsetY:num
 * @text Offset Y
 * @parent WeekTypeOffset
 * @desc How much to offset this sprite's Y by.
 * Negative: up. Positive: down.
 * @default +48
 *
 * @param WeekTypeScale
 * @text Scale
 * @parent WeekType
 * 
 * @param WeekTypeScaleX:num
 * @text Scale X
 * @parent WeekTypeScale
 * @desc What is the scale used for this sprite icon's X?
 * 0.0 - 0%; 0.5 - 50%; 1.0 - 100%; 1.5 - 150%; 2.0 - 200%
 * @default 3.0
 * 
 * @param WeekTypeScaleY:num
 * @text Scale Y
 * @parent WeekTypeScale
 * @desc What is the scale used for this sprite icon's Y?
 * 0.0 - 0%; 0.5 - 50%; 1.0 - 100%; 1.5 - 150%; 2.0 - 200%
 * @default 3.0
 *
 * @param WeekTypeIcons
 * @text Icons
 * @parent WeekType
 * 
 * @param WeekTypeIconWeekday:num
 * @text Weekday Icon
 * @parent WeekTypeIcons
 * @desc What icon is used for weekdays?
 * Ignore if there is an image equivalent.
 * @default 75
 * 
 * @param WeekTypeIconWeekend:num
 * @text Weekend Icon
 * @parent WeekTypeIcons
 * @desc What icon is used for weekends?
 * Ignore if there is an image equivalent.
 * @default 84
 *
 * @param WeekTypeImages
 * @text Images
 * @parent WeekType
 * 
 * @param WeekTypeImageWeekday:str
 * @text Weekday Image
 * @parent WeekTypeImages
 * @type file
 * @dir img/pictures/
 * @require 1
 * @desc What image is used for weekdays?
 * Ignores any icon equivalents.
 * @default 
 * 
 * @param WeekTypeImageWeekend:str
 * @text Weekend Image
 * @parent WeekTypeImages
 * @type file
 * @dir img/pictures/
 * @require 1
 * @desc What image is used for weekends?
 * Ignores any icon equivalents.
 * @default 
 *
 * @param Year
 * @text Year Sprite
 *
 * @param YearEnable:eval
 * @text Enabled?
 * @parent Year
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enables usage of this sprite.
 * @default true
 *
 * @param YearAngle:num
 * @text Angle
 * @parent Year
 * @desc What is the angle used for this sprite?
 * Value is written in degrees.
 * @default +15
 *
 * @param YearFmt:str
 * @text Year Format
 * @parent Year
 * @desc How is the year written when it's less than 4 digits?
 * %1 - Current Year
 * @default Year %1
 *
 * @param YearSize
 * @text Size
 * @parent Year
 * 
 * @param YearSizeWidth:num
 * @text Width
 * @parent YearSize
 * @type number
 * @min 1
 * @desc What is the width of this sprite in pixels?
 * @default 200
 * 
 * @param YearSizeHeight:num
 * @text Height
 * @parent YearSize
 * @type number
 * @min 1
 * @desc What is the height of this sprite in pixels?
 * @default 40
 *
 * @param YearAnchor
 * @text Anchor
 * @parent Year
 * 
 * @param YearAnchorX:num
 * @text Anchor X
 * @parent YearAnchor
 * @desc Anchor X value for this sprite.
 * 0.0 - left; 0.5 - center; 1.0 - right
 * @default 0.5
 * 
 * @param YearAnchorY:num
 * @text Anchor Y
 * @parent YearAnchor
 * @desc Anchor Y value for this sprite.
 * 0.0 - top; 0.5 - middle; 1.0 - bottom
 * @default 0.5
 *
 * @param YearOffset
 * @text Offset
 * @parent Year
 * 
 * @param YearOffsetX:num
 * @text Offset X
 * @parent YearOffset
 * @desc How much to offset this sprite's X by.
 * Negative: left. Positive: right.
 * @default +48
 * 
 * @param YearOffsetY:num
 * @text Offset Y
 * @parent YearOffset
 * @desc How much to offset this sprite's Y by.
 * Negative: up. Positive: down.
 * @default +30
 *
 * @param Year_DrawText_JS:func
 * @text JS: Draw Text
 * @parent Year
 * @type note
 * @desc Code used to draw the text for this sprite.
 * @default "// Declare Constants\nconst bitmap = arguments[0];\nconst year = TimeManager.getYear();\nlet text = String(year);\nif (text.length < 4) {\n    const fmt = TextManager.DATE_TIME_SYSTEM.yearFmt;\n    text = fmt.format(year);\n}\n\n// Change Font Settings\nbitmap.fontFace = 'Times New Roman';\nbitmap.fontSize = 32;\nbitmap.outlineWidth = 5;\nbitmap.outlineColor = 'rgba(0, 0, 0, 0.8)';\n\n// Draw Text\nbitmap.drawText(text, 0, 0, bitmap.width, bitmap.height, 'center');"
 *
 * @param Month
 * @text Month Sprite
 *
 * @param MonthEnable:eval
 * @text Enabled?
 * @parent Month
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enables usage of this sprite.
 * @default true
 *
 * @param MonthAngle:num
 * @text Angle
 * @parent Month
 * @desc What is the angle used for this sprite?
 * Value is written in degrees.
 * @default +0
 *
 * @param MonthSize
 * @text Size
 * @parent Month
 * 
 * @param MonthSizeWidth:num
 * @text Width
 * @parent MonthSize
 * @type number
 * @min 1
 * @desc What is the width of this sprite in pixels?
 * @default 200
 * 
 * @param MonthSizeHeight:num
 * @text Height
 * @parent MonthSize
 * @type number
 * @min 1
 * @desc What is the height of this sprite in pixels?
 * @default 40
 *
 * @param MonthAnchor
 * @text Anchor
 * @parent Month
 * 
 * @param MonthAnchorX:num
 * @text Anchor X
 * @parent MonthAnchor
 * @desc Anchor X value for this sprite.
 * 0.0 - left; 0.5 - center; 1.0 - right
 * @default 0.5
 * 
 * @param MonthAnchorY:num
 * @text Anchor Y
 * @parent MonthAnchor
 * @desc Anchor Y value for this sprite.
 * 0.0 - top; 0.5 - middle; 1.0 - bottom
 * @default 0.5
 *
 * @param MonthOffset
 * @text Offset
 * @parent Month
 * 
 * @param MonthOffsetX:num
 * @text Offset X
 * @parent MonthOffset
 * @desc How much to offset this sprite's X by.
 * Negative: left. Positive: right.
 * @default +125
 * 
 * @param MonthOffsetY:num
 * @text Offset Y
 * @parent MonthOffset
 * @desc How much to offset this sprite's Y by.
 * Negative: up. Positive: down.
 * @default +20
 *
 * @param Month_DrawText_JS:func
 * @text JS: Draw Text
 * @parent Month
 * @type note
 * @desc Code used to draw the text for this sprite.
 * @default "// Declare Constants\nconst bitmap = arguments[0];\nconst monthID = TimeManager.getMonth();\nconst monthName = TextManager.getMonthName(monthID);\nconst monthAbbr = TextManager.getMonthAbbr(monthID);\n\n// Change Font Settings\nbitmap.fontFace = 'Times New Roman';\nbitmap.fontSize = 24;\nbitmap.outlineWidth = 5;\nbitmap.outlineColor = 'rgba(0, 0, 0, 0.8)';\n\n// Draw Text\nbitmap.drawText(monthAbbr, 0, 0, bitmap.width, bitmap.height, 'center');"
 *
 * @param Date
 * @text Date Sprite
 *
 * @param DateEnable:eval
 * @text Enabled?
 * @parent Date
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enables usage of this sprite.
 * @default true
 *
 * @param DateAngle:num
 * @text Angle
 * @parent Date
 * @desc What is the angle used for this sprite?
 * Value is written in degrees.
 * @default +0
 *
 * @param DateSize
 * @text Size
 * @parent Date
 * 
 * @param DateSizeWidth:num
 * @text Width
 * @parent DateSize
 * @type number
 * @min 1
 * @desc What is the width of this sprite in pixels?
 * @default 200
 * 
 * @param DateSizeHeight:num
 * @text Height
 * @parent DateSize
 * @type number
 * @min 1
 * @desc What is the height of this sprite in pixels?
 * @default 40
 *
 * @param DateAnchor
 * @text Anchor
 * @parent Date
 * 
 * @param DateAnchorX:num
 * @text Anchor X
 * @parent DateAnchor
 * @desc Anchor X value for this sprite.
 * 0.0 - left; 0.5 - center; 1.0 - right
 * @default 0.5
 * 
 * @param DateAnchorY:num
 * @text Anchor Y
 * @parent DateAnchor
 * @desc Anchor Y value for this sprite.
 * 0.0 - top; 0.5 - middle; 1.0 - bottom
 * @default 0.5
 *
 * @param DateOffset
 * @text Offset
 * @parent Date
 * 
 * @param DateOffsetX:num
 * @text Offset X
 * @parent DateOffset
 * @desc How much to offset this sprite's X by.
 * Negative: left. Positive: right.
 * @default +175
 * 
 * @param DateOffsetY:num
 * @text Offset Y
 * @parent DateOffset
 * @desc How much to offset this sprite's Y by.
 * Negative: up. Positive: down.
 * @default +20
 *
 * @param Date_DrawText_JS:func
 * @text JS: Draw Text
 * @parent Date
 * @type note
 * @desc Code used to draw the text for this sprite.
 * @default "// Declare Constants\nconst bitmap = arguments[0];\nconst date = TimeManager.getDate();\n\n// Change Font Settings\nbitmap.fontFace = 'Times New Roman';\nbitmap.fontSize = 36;\nbitmap.outlineWidth = 5;\nbitmap.outlineColor = 'rgba(0, 0, 0, 0.8)';\n\n// Draw Text\nbitmap.drawText(date, 0, 0, bitmap.width, bitmap.height, 'center');"
 *
 * @param Weekday
 * @text Weekday Sprite
 *
 * @param WeekdayEnable:eval
 * @text Enabled?
 * @parent Weekday
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enables usage of this sprite.
 * @default true
 *
 * @param WeekdayAngle:num
 * @text Angle
 * @parent Weekday
 * @desc What is the angle used for this sprite?
 * Value is written in degrees.
 * @default -15
 *
 * @param WeekdaySize
 * @text Size
 * @parent Weekday
 * 
 * @param WeekdaySizeWidth:num
 * @text Width
 * @parent WeekdaySize
 * @type number
 * @min 1
 * @desc What is the width of this sprite in pixels?
 * @default 200
 * 
 * @param WeekdaySizeHeight:num
 * @text Height
 * @parent WeekdaySize
 * @type number
 * @min 1
 * @desc What is the height of this sprite in pixels?
 * @default 40
 *
 * @param WeekdayAnchor
 * @text Anchor
 * @parent Weekday
 * 
 * @param WeekdayAnchorX:num
 * @text Anchor X
 * @parent WeekdayAnchor
 * @desc Anchor X value for this sprite.
 * 0.0 - left; 0.5 - center; 1.0 - right
 * @default 0.5
 * 
 * @param WeekdayAnchorY:num
 * @text Anchor Y
 * @parent WeekdayAnchor
 * @desc Anchor Y value for this sprite.
 * 0.0 - top; 0.5 - middle; 1.0 - bottom
 * @default 0.5
 *
 * @param WeekdayOffset
 * @text Offset
 * @parent Weekday
 * 
 * @param WeekdayOffsetX:num
 * @text Offset X
 * @parent WeekdayOffset
 * @desc How much to offset this sprite's X by.
 * Negative: left. Positive: right.
 * @default +240
 * 
 * @param WeekdayOffsetY:num
 * @text Offset Y
 * @parent WeekdayOffset
 * @desc How much to offset this sprite's Y by.
 * Negative: up. Positive: down.
 * @default +30
 *
 * @param Weekday_DrawText_JS:func
 * @text JS: Draw Text
 * @parent Weekday
 * @type note
 * @desc Code used to draw the text for this sprite.
 * @default "// Declare Constants\nconst bitmap = arguments[0];\nconst weekdayID = TimeManager.getWeekday();\nconst weekdayName = TextManager.getWeekdayName(weekdayID);\nconst weekdayAbbr = TextManager.getWeekdayAbbr(weekdayID);\n\n// Change Font Settings\nbitmap.fontFace = 'Times New Roman';\nbitmap.fontSize = 32;\nbitmap.outlineWidth = 5;\nbitmap.outlineColor = 'rgba(0, 0, 0, 0.8)';\n\n// Draw Text\nbitmap.drawText(weekdayAbbr, 0, 0, bitmap.width, bitmap.height, 'center');"
 *
 * @param Time
 * @text Time Sprite
 *
 * @param TimeEnable:eval
 * @text Enabled?
 * @parent Time
 * @type boolean
 * @on Enable
 * @off Disable
 * @desc Enables usage of this sprite.
 * @default true
 *
 * @param TimeAngle:num
 * @text Angle
 * @parent Time
 * @desc What is the angle used for this sprite?
 * Value is written in degrees.
 * @default +0
 *
 * @param TimeSize
 * @text Size
 * @parent Time
 * 
 * @param TimeSizeWidth:num
 * @text Width
 * @parent TimeSize
 * @type number
 * @min 1
 * @desc What is the width of this sprite in pixels?
 * @default 200
 * 
 * @param TimeSizeHeight:num
 * @text Height
 * @parent TimeSize
 * @type number
 * @min 1
 * @desc What is the height of this sprite in pixels?
 * @default 40
 *
 * @param TimeAnchor
 * @text Anchor
 * @parent Time
 * 
 * @param TimeAnchorX:num
 * @text Anchor X
 * @parent TimeAnchor
 * @desc Anchor X value for this sprite.
 * 0.0 - left; 0.5 - center; 1.0 - right
 * @default 0.5
 * 
 * @param TimeAnchorY:num
 * @text Anchor Y
 * @parent TimeAnchor
 * @desc Anchor Y value for this sprite.
 * 0.0 - top; 0.5 - middle; 1.0 - bottom
 * @default 0.5
 *
 * @param TimeOffset
 * @text Offset
 * @parent Time
 * 
 * @param TimeOffsetX:num
 * @text Offset X
 * @parent TimeOffset
 * @desc How much to offset this sprite's X by.
 * Negative: left. Positive: right.
 * @default +144
 * 
 * @param TimeOffsetY:num
 * @text Offset Y
 * @parent TimeOffset
 * @desc How much to offset this sprite's Y by.
 * Negative: up. Positive: down.
 * @default +60
 *
 * @param Time_DrawText_JS:func
 * @text JS: Draw Text
 * @parent Time
 * @type note
 * @desc Code used to draw the text for this sprite.
 * @default "// Declare Constants\nconst bitmap = arguments[0];\nconst hour = TimeManager.getHour();\nconst hourMilitary = TextManager.getMilitaryHour(hour);\nconst hourMeridiem = TextManager.getMeridiemHour(hour);\nconst minute = TimeManager.getMinute().padZero(2);\nconst meridiem = TextManager.getMeridiemForHour(hour);\n\n// Determine Time\nlet time = '%1:%2'.format(hourMeridiem, minute);;\ntime += ' ' + meridiem;\n\n// Change Font Settings\nbitmap.fontFace = 'Times New Roman';\nbitmap.fontSize = 40;\nbitmap.outlineWidth = 6;\nbitmap.outlineColor = 'rgba(0, 0, 0, 0.8)';\n\n// Draw Text\nbitmap.drawText(time, 0, 0, bitmap.width, bitmap.height, 'center');"
 *
 */
/* ----------------------------------------------------------------------------
 * Options Settings
 * ----------------------------------------------------------------------------
 */
/*~struct~Options:
 *
 * @param Options
 * @text Options
 *
 * @param AddOption:eval
 * @text Add Option?
 * @parent Options
 * @type boolean
 * @on Add
 * @off Don't Add
 * @desc Add the 'Date Time HUD' option to the Options menu?
 * @default true
 *
 * @param AdjustRect:eval
 * @text Adjust Window Height
 * @parent Options
 * @type boolean
 * @on Adjust
 * @off Don't
 * @desc Automatically adjust the options window height?
 * @default true
 *
 * @param Name:str
 * @text Option Name
 * @parent Options
 * @desc Command name of the option.
 * @default Show Date & Time
 *
 */
//=============================================================================

const _0x5efcb0=_0x157d;(function(_0xd09f8b,_0x56918a){const _0x79b043=_0x157d,_0x1afca0=_0xd09f8b();while(!![]){try{const _0x1c00f2=-parseInt(_0x79b043(0x1a6))/0x1*(-parseInt(_0x79b043(0x223))/0x2)+parseInt(_0x79b043(0x25c))/0x3*(parseInt(_0x79b043(0x240))/0x4)+-parseInt(_0x79b043(0xf2))/0x5*(parseInt(_0x79b043(0x25f))/0x6)+-parseInt(_0x79b043(0x1e4))/0x7*(-parseInt(_0x79b043(0x14b))/0x8)+-parseInt(_0x79b043(0x11f))/0x9*(-parseInt(_0x79b043(0x2f0))/0xa)+parseInt(_0x79b043(0x101))/0xb*(-parseInt(_0x79b043(0x29d))/0xc)+parseInt(_0x79b043(0x2f4))/0xd;if(_0x1c00f2===_0x56918a)break;else _0x1afca0['push'](_0x1afca0['shift']());}catch(_0x391737){_0x1afca0['push'](_0x1afca0['shift']());}}}(_0x3117,0xc3b7e));function _0x3117(){const _0x17d0ea=['map','tilesetAutumn','updateBaseFilters','LeapMonth','battlebackSummer1','realTimeMinute','start','updateGameTime','TimeDusk','opacitySpeed','year','dateTimeHud','RealTime_RecordToVariables','synchToRealTime','_date','_vehicleGettingOff','realTimeMonth','gameTimeMeridiemFor','recordRealTime','recordGameTime','MonthAngle','isSkill','AddOption','_monthSprite','abbr','DayHours','clear','ARRAYEVAL','_dateTimeHudSprite','checkSeason','HoursInDay','_vehicleGettingOn','meetsSkillConditions','initDateTimeSystemGameTime','SeasonIconSummer','CalcSkillDmgRate','_cache_season','onDatabaseLoaded','VarYear','initialize','number','This\x20is\x20a\x20static\x20class','CalcSkillCostChanges','_realTime','StartMinute','ConfigManager_applyData','createDateTimeHudSprite','RealTimeData','CalcShopPriceRate','SeasonIconAutumn','tileset','battlebackAutumn1','StartYear','HourOverflow','25uazblv','setupSeasonalBattlebackRegions','restartGameTime','onBeforeSave','increaseGameTimeData','meetsGameTimeUpdateParameterConditions','gameTimeSynchronizeWeekday','status','pad','Game_Screen_update','isDateTimeHudVisible','iconWidth','GameTimeGeneral','_gameTime','DATE_TIME_SYSTEM','BattleCore','daycycle','DateSizeWidth','WeekdayEnable','StartDate','getHours','fullDate','BaseTroopIDs','matchRangeCondition','createWindowLayer','VarSecond','_regionBattleback2','Hour','filter','gameTimeMinute','Weekdays','round','DayCycleOpacity','isRealTime','DawnHours','SeasonAnchorX','PauseVehicleEntry','_dateTimeHudVisible','YearAnchorY','TimeDawn','item','starting','TimeDay','exit','battlebackSpring1','VisuMZ_1_SaveCore','isCurrentDateAhead','increaseGameTimeDays','totalMonths','toLowerCase','getMonthAbbr','realTimeMeridiemFor','position','setup','getMinutesInHour','winter','_tilesetId','isGameTimePaused','UpdateSpriteImage','SummerMonths','pauseGameTime','WeekdayAbbr%1','1228717ermCoX','SeasonImageAutumn','DateOverflow','ConvertParams','applyData','nextHour','processGameTimeUpdate','Window_Options_addGeneralOptions','VarFullTime','meetsEncounterConditions','defaultType','isBattleTest','bind','weekend','_cache_hour','WeekdayOffsetX','RegExp','_%1Sprite','UpdateSpriteIcon','gameTimeWeekDay','PositionY','Weekends','SeasonScaleY','matchLineCondition','autumn','areFollowersGathering','ARRAYNUM','initDateTimeSystemSaveTime','convertDateTimeGameEscapeCodes','updateYearSpriteBitmap','updateVisibility','isDateTimeSystemHudVisible','DuskHours','upauseGameTime','_weekdaySprite','createDateSprites','height','checkDayCycle','DateAnchorY','clearTimeTone','tilesetWinter','night','_cache_weektype','processSeasonTileset','YearAnchorX','Scene_Boot_onDatabaseLoaded','initDateTimeSystemSettings','month','YearSizeHeight','checkGameTimeDateOverflow','updateTimeOverlay','changeTileset','_lastTime','Abbr','WeekdayFull%1','WeekdayAngle','isNotUsingTime','WeekTypeAnchorY','WeekTypeOffsetY','VisuMZ_1_ItemsEquipsCore','realTimeYear','anchor','HideHud','118302tGtZiA','Scene_Options_maxCommands','max','Name','DayCycleImageDawn','updateWeekdaySpriteBitmap','Window_ShopBuy_goodsToItem','_stateTurns','DrawHudTime','StartWeekday','return\x200','SwWinter','shopPriceCondition','enable','Game_Action_applyVariance','Months','_timeTone','sprites','skillDmgCond','VarWeekday','_cache_year','fullTime','scale','_lastMin','DayCycleAnchorX','SeasonImageSummer','RealTimeGeneral','icons','MonthOffsetX','544SFhKOf','tilesetDay','name','realTimeSecond','_timeSprite','tilesetNight','SeasonSpring','tilesetSpring','floor','updateGameTimeData','SwDawn','DayCycleOffsetY','DrawHudYear','CalcStateTurnAdjust','MonthSizeHeight','DateSizeHeight','setColorTone','CheckGameTimeLeapYear','TimePM','smooth','checkWeekdayType','value','version','WinterMonths','getHoursInDay','HudShowHide','size','%1%2%3','2337tomezP','WeekdayAnchorX','ChangeAllSwitches','6IUEvEG','tilesetSummer','_battleback1Name','_cache_daycycle','convertDateTimeEscapeCodes','YearEnable','gameTimeData','Game_Player_meetsEncounterConditions','troopId','_regionBattleback1','unshift','skillRequireCond','_cache_date','IconSet','SwDay','addLoadListener','MonthEnable','TimeAngle','Game_BattlerBase_prepareResetStateCounts','YearOffsetY','_baseSprite','includes','replace','PauseEventRunning','Year','Spriteset_Base_updateBaseFilters','ChangeSwitch','_battleback2Name','getMinutes','initMembers','SeasonAutumn','_yearSprite','DefaultTimeType','getDate','time','WeekendName','eventRunning','Scene_Base_createWindowLayer','meetsGameTimeUpdateCompatibilityConditions','_dayTimeTilesetLoops','Window_Base_preConvertEscapeCharacters','maxCommands','NoTimeTone','Game_Screen_clear','SwSpring','MonthAbbr%1','Game_BattlerBase_adjustSkillCost','getMonth','enabled','in\x20order\x20for\x20VisuMZ_2_DateTimeSystem\x20to\x20work.','PauseGatheringFollowers','spring','vehicleEnterExit','getTimeTone','getHour','realWeekDayType','VisuMZ_4_Debugger','clearDateTimeSystem','parameters','updateGameTimeSwitchesVariables','updateSprites','Error\x20with\x20Troop\x20ID\x20','12nlCdON','updateTimeToneFilter','Game_BattlerBase_meetsSkillConditions','VisuMZ_1_SkillsStatesCore','push','DateOffsetX','goodsToItem','_daycycleSprite','addCommand','Date_DrawText_JS','gameTimeDayCycle','SeasonOffsetX','getSeconds','split','_needsRefresh','Year_DrawText_JS','WeekTypeIconWeekend','VarDate','ChangeVariable','day','GameTime_ChangeWeekdayTo','description','GameTime_PauseTimeEnd','setupDateTimeNotetags','DrawHudMonth','constructor','_timeOverlay','WeekdaySizeWidth','normal','MonthOverflow','STR','WeekTypeEnable','Window_ShopBuy_price','createTroopNote','_cache_month','updateTimeTone','Scene_Boot_start','blt','Enable','update','Season','hour','processDateTimeSystemSaveTimeDifference','GameTime_TimeDilation','minutesInHour','SeasonSummer','_timeToneFilter','call','trim','_lastHour','Scene_Load_onLoadSuccess','MAX_SAFE_INTEGER','recordDateTimeSystemSaveTime','updateDateSpriteBitmap','shopBuyCondition','processSeasonBattlebackNotetags','Error','getMinute','updateMonthSpriteBitmap','DrawHudWeekday','ceil','MonthAnchorY','YearOffsetX','YearAngle','updateDayCycleSpriteBitmap','Timeless','updateWeektypeSpriteBitmap','MonthSizeWidth','NUM','prototype','VisuMZ_1_EventsMoveCore','addGeneralOptions','forceRefresh','MeetsSkillConditions','clamp','getTimeOverlayForHour','weekday','getGameTimeWeekdayData','summer','DateEnable','changeMsPerGameTimeMinute','checkGameTimeHourOverflow','calcTotalDaysBetweenDates','7334510aBVQLp','getWeekdayName','TimeOffsetY','gameTimeDate','3104530vSRBGz','Time_DrawText_JS','gameTimeYear','length','DefaultTimeTone','_lastSaveTime','SpringMonths','SeasonIconWinter','loadSystem','Weekday_DrawText_JS','RealTimeToneOverlay','startRealTime','VarMonth','regionBattlebacks','WeekTypeImageWeekday','SETTINGS','getWeekdayAbbr','SeasonWinter','updateRealTime','onAfterLoad','DateAnchorX','getMinuteRaw','VisuMZ_1_BattleCore','paused','CheckBaseTroopID','getWeekday','%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.','bitmap','WeekTypeImageWeekend','gameTimeHour','%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.','WeekdayOffsetY','DayCycleOffsetX','VisuMZ_0_CoreEngine\x20needs\x20to\x20be\x20updated\x20','%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.','Show','gameTone','getTimeToneForHour','GameTimeData','DayCycleImageDay','format','HudSprite','GameTime_ChangeTimeTo','Mechanics\x20settings\x20or\x20duplicate\x20this\x20troop\x20to\x20an\x20ID\x20that\x20is\x20not\x20','DayCycleIconDawn','totalWeekdays','padZero','createBaseFilters','VisuMZ_2_LightingEffects','pauseConditions','minute','roundMinutes','msPerMinute','SeasonScaleX','VarMinute','realTimeDayCycle','bypassTilesetSwap','ARRAYFUNC','WeekTypeAnchorX','_weektypeSprite','AdjustRect','checkGameTimeMinuteOverflow','MonthAnchorX','SeasonEnable','meetsDateTimeSystemConditions','canUpdateGameTime','createSubSprite','DateAngle','WeekTypeScaleY','Spriteset_Base_createBaseFilters','date','Game_Map_setup','Minute','updateRealTimeSwitchesVariables','gameOverlay','updateDateTimeSystem','_usesTimeTone','_cache_weekday','Game_System_onBeforeSave','create','timeStruct','SwAutumn','AutumnMonths','SwWeekday','updateSeasonSpriteBitmap','width','VarHour','dawn','getVisibility','ARRAYSTR','gameWeekDayType','SeasonImageSpring','Month_DrawText_JS','images','gameTimeSecond','GameTime_RecordToVariables','full','applyVariance','VisuMZ_0_CoreEngine','ARRAYSTRUCT','second','isSceneMap','!\x0a\x0a','synchToGameTime','WeekTypeScaleX','#ffffff','preConvertEscapeCharacters','battlebackWinter1','GameTimeVocab','PauseMoveRouteForcing','5544085vVSIsc','MonthFull%1','note','_context','game','onLoadSuccess','battlebackAutumn2','checkGameTimeWeekdayOverflow','Settings','Overlay%1','defaultTone','processSeasonTilesetNotetags','RealTimeVocab','TimeAM','battlebackSummer2','12904034xJyOAl','UpdateSpritePicture','match','getGameTimeTotalWeekdays','battlebackWinter2','GameTime_ChangeDateTo','updateTimeSpriteBitmap','opacity','forceRefreshHUD','realTimeMeridiem','getGameTimeTotalMonths','NightHours','WeekdayType','container','makeData','SwSummer','getYear','_dateTimeType','LeapYearCalc','CoreEngine','SwNight','ChangeAllVariables','Either\x20adjust\x20the\x20Base\x20Troop\x20IDs\x20found\x20in\x20the\x20Battle\x20Core\x20','isGameTime','tilesetDawn','_cache_minute','isUseTimeTone','prepareResetStateCounts','real','getDay','9jvVggL','DateTimeSystem','DayCycleImageDusk','military\x20pad','addDateTimeSystemCommands','WeekTypeIconWeekday','DayCycleIconNight','_showDateTimeSystemHud','indexOf','GameTime_PauseTimeStart','STRUCT','military','imageSmoothingEnabled','checkGameTimeTotalDaysInMonth','JSON','SwDusk','_dateSprite','hexToArray','DayCycleScaleX','WeekdayAnchorY','TimeSizeHeight','season','gameTimeMonth','PositionX','setValue','tilesetDusk','getNextHour','getMeridiemHour','startGameTime','_debugActive','isMoveRouteForcing','FUNC','msLimit','price','ConfigManager_makeData','getTimeType','getFullYear','gatheringFollowers','parse','VarFullDate','getGameTimeMonthData','isEventRunning','roundMinutesTo10','{{%1}}','24lXDlVE','Game_System_onAfterLoad','stateTurnsCond','isUseTimeOverlay','getSecond','SeasonImageWinter','Options','BufferPluginParameters','_pauseGameTime','gameTimeMeridiem','setDateTimeSystemHudVisible','battlebackSpring2','adjustSkillCost','createTimeToneFilter','none','hoursInDay','GameTimeTone','gameTimeSeason','offset','WeekTypeOpacity','addDateTimeHudOptionCommand','clearTimeOverlay','realTimeHour','TimeAnchorX','realTimeWeekDay','GameTimeSettings','realTimeDate','registerCommand','getMeridiemForHour','YearFmt','toUpperCase','MonthOffsetY','realTimeSeason','Game_System_initialize','_seasonSprite','SwWeekend','WeekdayName'];_0x3117=function(){return _0x17d0ea;};return _0x3117();}var label=_0x5efcb0(0x120),tier=tier||0x0,dependencies=['VisuMZ_0_CoreEngine'],pluginData=$plugins[_0x5efcb0(0x1c2)](function(_0x594df9){const _0x3517a1=_0x5efcb0;return _0x594df9[_0x3517a1(0x1ad)]&&_0x594df9[_0x3517a1(0x2b2)][_0x3517a1(0x274)]('['+label+']');})[0x0];VisuMZ[label][_0x5efcb0(0xfa)]=VisuMZ[label][_0x5efcb0(0xfa)]||{},VisuMZ['ConvertParams']=function(_0x273ed9,_0x4a970b){const _0x2439a6=_0x5efcb0;for(const _0x5142be in _0x4a970b){if(_0x5142be[_0x2439a6(0x103)](/(.*):(.*)/i)){const _0x49a3c6=String(RegExp['$1']),_0x25571a=String(RegExp['$2'])[_0x2439a6(0x169)]()[_0x2439a6(0x2cd)]();let _0x4e440e,_0x1b1637,_0x514390;switch(_0x25571a){case _0x2439a6(0x2e1):_0x4e440e=_0x4a970b[_0x5142be]!==''?Number(_0x4a970b[_0x5142be]):0x0;break;case _0x2439a6(0x1fe):_0x1b1637=_0x4a970b[_0x5142be]!==''?JSON[_0x2439a6(0x145)](_0x4a970b[_0x5142be]):[],_0x4e440e=_0x1b1637['map'](_0x53c0f3=>Number(_0x53c0f3));break;case'EVAL':_0x4e440e=_0x4a970b[_0x5142be]!==''?eval(_0x4a970b[_0x5142be]):null;break;case _0x2439a6(0x18b):_0x1b1637=_0x4a970b[_0x5142be]!==''?JSON['parse'](_0x4a970b[_0x5142be]):[],_0x4e440e=_0x1b1637['map'](_0x1930ac=>eval(_0x1930ac));break;case _0x2439a6(0x12d):_0x4e440e=_0x4a970b[_0x5142be]!==''?JSON[_0x2439a6(0x145)](_0x4a970b[_0x5142be]):'';break;case'ARRAYJSON':_0x1b1637=_0x4a970b[_0x5142be]!==''?JSON['parse'](_0x4a970b[_0x5142be]):[],_0x4e440e=_0x1b1637['map'](_0x32c11c=>JSON[_0x2439a6(0x145)](_0x32c11c));break;case _0x2439a6(0x13e):_0x4e440e=_0x4a970b[_0x5142be]!==''?new Function(JSON[_0x2439a6(0x145)](_0x4a970b[_0x5142be])):new Function(_0x2439a6(0x22d));break;case _0x2439a6(0xbd):_0x1b1637=_0x4a970b[_0x5142be]!==''?JSON['parse'](_0x4a970b[_0x5142be]):[],_0x4e440e=_0x1b1637[_0x2439a6(0x170)](_0x2494c4=>new Function(JSON[_0x2439a6(0x145)](_0x2494c4)));break;case _0x2439a6(0x2bb):_0x4e440e=_0x4a970b[_0x5142be]!==''?String(_0x4a970b[_0x5142be]):'';break;case _0x2439a6(0xdd):_0x1b1637=_0x4a970b[_0x5142be]!==''?JSON['parse'](_0x4a970b[_0x5142be]):[],_0x4e440e=_0x1b1637[_0x2439a6(0x170)](_0x264e9d=>String(_0x264e9d));break;case _0x2439a6(0x129):_0x514390=_0x4a970b[_0x5142be]!==''?JSON[_0x2439a6(0x145)](_0x4a970b[_0x5142be]):{},_0x4e440e=VisuMZ['ConvertParams']({},_0x514390);break;case _0x2439a6(0xe7):_0x1b1637=_0x4a970b[_0x5142be]!==''?JSON[_0x2439a6(0x145)](_0x4a970b[_0x5142be]):[],_0x4e440e=_0x1b1637[_0x2439a6(0x170)](_0x4ed26c=>VisuMZ[_0x2439a6(0x1e7)]({},JSON[_0x2439a6(0x145)](_0x4ed26c)));break;default:continue;}_0x273ed9[_0x49a3c6]=_0x4e440e;}}return _0x273ed9;},(_0x1b8b5b=>{const _0x38fb0b=_0x5efcb0,_0x3af723=_0x1b8b5b[_0x38fb0b(0x242)];for(const _0x4118cd of dependencies){if(!Imported[_0x4118cd]){alert(_0x38fb0b(0x9e)[_0x38fb0b(0xac)](_0x3af723,_0x4118cd)),SceneManager[_0x38fb0b(0x1d1)]();break;}}const _0x14eef1=_0x1b8b5b[_0x38fb0b(0x2b2)];if(_0x14eef1[_0x38fb0b(0x103)](/\[Version[ ](.*?)\]/i)){const _0x18af50=Number(RegExp['$1']);_0x18af50!==VisuMZ[label][_0x38fb0b(0x256)]&&(alert(_0x38fb0b(0xa2)['format'](_0x3af723,_0x18af50)),SceneManager['exit']());}if(_0x14eef1['match'](/\[Tier[ ](\d+)\]/i)){const _0x2e42f2=Number(RegExp['$1']);_0x2e42f2<tier?(alert(_0x38fb0b(0xa6)[_0x38fb0b(0xac)](_0x3af723,_0x2e42f2,tier)),SceneManager[_0x38fb0b(0x1d1)]()):tier=Math[_0x38fb0b(0x225)](_0x2e42f2,tier);}VisuMZ[_0x38fb0b(0x1e7)](VisuMZ[label][_0x38fb0b(0xfa)],_0x1b8b5b[_0x38fb0b(0x299)]);})(pluginData);if(VisuMZ[_0x5efcb0(0x114)][_0x5efcb0(0x256)]<1.77){let text='';text+=_0x5efcb0(0xa5),text+=_0x5efcb0(0x290),alert(text),SceneManager['exit']();}PluginManager[_0x5efcb0(0x166)](pluginData[_0x5efcb0(0x242)],_0x5efcb0(0x106),_0x200d13=>{const _0x104159=_0x5efcb0;VisuMZ[_0x104159(0x1e7)](_0x200d13,_0x200d13);const _0x5d08a1=_0x200d13[_0x104159(0x277)]||0x0,_0x596d36=_0x200d13['Month']||0x0,_0xd1eeb1=_0x200d13['Date']||0x0,_0x372273=_0x200d13[_0x104159(0x2ba)],_0x3f6ad1=_0x200d13[_0x104159(0x1e6)];$gameSystem['gameTimeData']()[_0x104159(0x17a)]=_0x5d08a1,$gameSystem[_0x104159(0x265)]()['month']=_0x596d36;!_0x372273&&($gameSystem['gameTimeData']()[_0x104159(0x213)]=$gameSystem['gameTimeData']()[_0x104159(0x213)][_0x104159(0x2e7)](0x1,TimeManager[_0x104159(0x10b)]()));$gameSystem[_0x104159(0x265)]()[_0x104159(0xca)]=_0xd1eeb1;if(!_0x3f6ad1){const _0x4a5512=TimeManager[_0x104159(0x12c)]($gameSystem[_0x104159(0x265)]()[_0x104159(0x213)],_0x5d08a1);$gameSystem[_0x104159(0x265)]()[_0x104159(0xca)]=$gameSystem[_0x104159(0x265)]()[_0x104159(0xca)][_0x104159(0x2e7)](0x1,_0x4a5512);}$gameSystem[_0x104159(0x215)](),$gameSystem[_0x104159(0x1ac)](),TimeManager[_0x104159(0x109)]();}),PluginManager[_0x5efcb0(0x166)](pluginData['name'],_0x5efcb0(0x2b1),_0x50f5bb=>{const _0x5989a6=_0x5efcb0;VisuMZ[_0x5989a6(0x1e7)](_0x50f5bb,_0x50f5bb);const _0x497a23=_0x50f5bb['Weekday']||0x0,_0x6fbbc8=_0x50f5bb['WeekdayOverflow'],_0x38bfe9=TimeManager['getGameTimeTotalWeekdays']();_0x6fbbc8?$gameSystem[_0x5989a6(0x265)]()[_0x5989a6(0x2e9)]=_0x497a23%_0x38bfe9||_0x38bfe9:$gameSystem[_0x5989a6(0x265)]()[_0x5989a6(0x2e9)]=_0x497a23[_0x5989a6(0x2e7)](0x1,_0x38bfe9),TimeManager[_0x5989a6(0x109)]();}),PluginManager[_0x5efcb0(0x166)](pluginData[_0x5efcb0(0x242)],_0x5efcb0(0xae),_0x5b9593=>{const _0x2801a4=_0x5efcb0;VisuMZ[_0x2801a4(0x1e7)](_0x5b9593,_0x5b9593);const _0xddd2e0=_0x5b9593[_0x2801a4(0x1c1)]||0x0,_0x2fecc6=_0x5b9593[_0x2801a4(0xcc)]||0x0,_0x281caa=_0x5b9593[_0x2801a4(0x1a5)],_0xa61e2f=_0x5b9593['MinuteOverflow'];$gameSystem[_0x2801a4(0x265)]()[_0x2801a4(0x2c6)]=_0xddd2e0;if(!_0x281caa){const _0x257e75=TimeManager[_0x2801a4(0x164)]['timeStruct'][_0x2801a4(0x15a)]-0x1;$gameSystem[_0x2801a4(0x265)]()[_0x2801a4(0x2c6)]=$gameSystem[_0x2801a4(0x265)]()[_0x2801a4(0x2c6)][_0x2801a4(0x2e7)](0x0,_0x257e75);}$gameSystem[_0x2801a4(0x2ee)](),$gameSystem['gameTimeData']()[_0x2801a4(0xb6)]=_0x2fecc6;if(!_0xa61e2f){const _0x4e97f0=TimeManager[_0x2801a4(0x164)]['timeStruct']['minutesInHour']-0x1;$gameSystem['gameTimeData']()['minute']=$gameSystem[_0x2801a4(0x265)]()[_0x2801a4(0xb6)][_0x2801a4(0x2e7)](0x0,_0x4e97f0);}$gameSystem[_0x2801a4(0xc1)](),TimeManager[_0x2801a4(0x109)]();}),PluginManager[_0x5efcb0(0x166)](pluginData[_0x5efcb0(0x242)],_0x5efcb0(0x128),_0x4b1a7c=>{const _0x319049=_0x5efcb0;VisuMZ[_0x319049(0x1e7)](_0x4b1a7c,_0x4b1a7c),$gameSystem[_0x319049(0x1e2)]();}),PluginManager['registerCommand'](pluginData[_0x5efcb0(0x242)],_0x5efcb0(0x2b3),_0x444149=>{const _0x384105=_0x5efcb0;VisuMZ['ConvertParams'](_0x444149,_0x444149),$gameSystem[_0x384105(0x205)]();}),PluginManager[_0x5efcb0(0x166)](pluginData[_0x5efcb0(0x242)],_0x5efcb0(0xe3),_0x1f278d=>{const _0x274986=_0x5efcb0;VisuMZ[_0x274986(0x1e7)](_0x1f278d,_0x1f278d);const _0x4ccced=TimeManager[_0x274986(0x1b3)];if(_0x1f278d['VarYear']){const _0x1a6ad8=_0x1f278d[_0x274986(0x196)],_0x188324=_0x4ccced['year'];$gameVariables[_0x274986(0x137)](_0x1a6ad8,_0x188324);}if(_0x1f278d[_0x274986(0x300)]){const _0x28cd7d=_0x1f278d[_0x274986(0x300)],_0x2286c2=_0x4ccced['month'];$gameVariables[_0x274986(0x137)](_0x28cd7d,_0x2286c2);}if(_0x1f278d[_0x274986(0x2ae)]){const _0xd87c52=_0x1f278d['VarDate'],_0xfe55ee=_0x4ccced[_0x274986(0xca)];$gameVariables[_0x274986(0x137)](_0xd87c52,_0xfe55ee);}if(_0x1f278d[_0x274986(0x146)]){const _0x53037d=_0x1f278d['VarFullDate'],_0x2f709e=_0x4ccced['fullDate'];$gameVariables[_0x274986(0x137)](_0x53037d,_0x2f709e);}if(_0x1f278d[_0x274986(0x236)]){const _0x63afd6=_0x1f278d[_0x274986(0x236)],_0x1e8626=_0x4ccced[_0x274986(0x2e9)];$gameVariables[_0x274986(0x137)](_0x63afd6,_0x1e8626);}if(_0x1f278d[_0x274986(0xda)]){const _0x352634=_0x1f278d[_0x274986(0xda)],_0x5ec68b=_0x4ccced['hour'];$gameVariables[_0x274986(0x137)](_0x352634,_0x5ec68b);}if(_0x1f278d[_0x274986(0xba)]){const _0x3aa038=_0x1f278d[_0x274986(0xba)],_0x427936=_0x4ccced[_0x274986(0xb6)];$gameVariables['setValue'](_0x3aa038,_0x427936);}if(_0x1f278d[_0x274986(0x1ec)]){const _0x3e8dd5=_0x1f278d[_0x274986(0x1ec)],_0xa4a44a=_0x4ccced[_0x274986(0x238)];$gameVariables[_0x274986(0x137)](_0x3e8dd5,_0xa4a44a);}}),PluginManager[_0x5efcb0(0x166)](pluginData['name'],_0x5efcb0(0x2c8),_0x591591=>{const _0xf5f98e=_0x5efcb0;VisuMZ[_0xf5f98e(0x1e7)](_0x591591,_0x591591);const _0x2c3638=_0x591591[_0xf5f98e(0xb8)];$gameSystem[_0xf5f98e(0x2ed)](_0x2c3638);}),PluginManager[_0x5efcb0(0x166)](pluginData[_0x5efcb0(0x242)],'GameTime_ClearDilation',_0x28b85f=>{const _0x2e1948=_0x5efcb0;VisuMZ['ConvertParams'](_0x28b85f,_0x28b85f);const _0xa79190=VisuMZ[_0x2e1948(0x120)][_0x2e1948(0xfa)][_0x2e1948(0x1b2)][_0x2e1948(0xb8)];$gameSystem[_0x2e1948(0x2ed)](_0xa79190);}),PluginManager[_0x5efcb0(0x166)](pluginData[_0x5efcb0(0x242)],_0x5efcb0(0x17c),_0x382ba3=>{const _0x19f68c=_0x5efcb0;VisuMZ[_0x19f68c(0x1e7)](_0x382ba3,_0x382ba3);const _0x339f13=TimeManager[_0x19f68c(0x19b)];if(_0x382ba3['VarYear']){const _0xf46842=_0x382ba3[_0x19f68c(0x196)],_0x51d8c4=_0x339f13[_0x19f68c(0x17a)];$gameVariables['setValue'](_0xf46842,_0x51d8c4);}if(_0x382ba3[_0x19f68c(0x300)]){const _0x56d473=_0x382ba3[_0x19f68c(0x300)],_0x78b830=_0x339f13[_0x19f68c(0x213)];$gameVariables[_0x19f68c(0x137)](_0x56d473,_0x78b830);}if(_0x382ba3[_0x19f68c(0x2ae)]){const _0x3c9b30=_0x382ba3[_0x19f68c(0x2ae)],_0x4fdbf9=_0x339f13[_0x19f68c(0xca)];$gameVariables[_0x19f68c(0x137)](_0x3c9b30,_0x4fdbf9);}if(_0x382ba3[_0x19f68c(0x146)]){const _0x43bd26=_0x382ba3['VarFullDate'],_0x2e1f62=_0x339f13[_0x19f68c(0x1bb)];$gameVariables[_0x19f68c(0x137)](_0x43bd26,_0x2e1f62);}if(_0x382ba3[_0x19f68c(0x236)]){const _0xe29cc8=_0x382ba3[_0x19f68c(0x236)],_0x49f963=_0x339f13[_0x19f68c(0x2e9)];$gameVariables['setValue'](_0xe29cc8,_0x49f963);}if(_0x382ba3[_0x19f68c(0xda)]){const _0x554801=_0x382ba3['VarHour'],_0x52539a=_0x339f13[_0x19f68c(0x2c6)];$gameVariables[_0x19f68c(0x137)](_0x554801,_0x52539a);}if(_0x382ba3[_0x19f68c(0xba)]){const _0xa316f1=_0x382ba3[_0x19f68c(0xba)],_0x54585c=_0x339f13['minute'];$gameVariables['setValue'](_0xa316f1,_0x54585c);}if(_0x382ba3[_0x19f68c(0x1bf)]){const _0x5d3f84=_0x382ba3[_0x19f68c(0x1bf)],_0x52b341=_0x339f13[_0x19f68c(0xe8)];$gameVariables['setValue'](_0x5d3f84,_0x52b341);}if(_0x382ba3[_0x19f68c(0x1ec)]){const _0x626b4a=_0x382ba3[_0x19f68c(0x1ec)],_0x37b2b2=_0x339f13['fullTime'];$gameVariables[_0x19f68c(0x137)](_0x626b4a,_0x37b2b2);}}),PluginManager[_0x5efcb0(0x166)](pluginData[_0x5efcb0(0x242)],_0x5efcb0(0x259),_0x58dd5a=>{const _0x45a1bd=_0x5efcb0;VisuMZ[_0x45a1bd(0x1e7)](_0x58dd5a,_0x58dd5a);const _0x24f8d6=_0x58dd5a[_0x45a1bd(0xa7)];$gameSystem[_0x45a1bd(0x155)](_0x24f8d6);}),VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0x1f4)]={'Timeless':/<TIME SYS(?:|TEM): NONE>/i,'GameTime':/<TIME SYS(?:|TEM): GAME>/i,'RealTime':/<TIME SYS(?:|TEM): REAL>/i,'NoTimeTone':/<NO TIME (?:TINT|TONE)>/i,'TimeTone':/<TIME (?:TINT|TONE)>/i,'ShowHud':/<SHOW DATE TIME HUD>/i,'HideHud':/<HIDE DATE TIME HUD>/i,'pauseGameTime':/<PAUSE GAME TIME>/i,'bypassTilesetSwap':/<BYPASS TILESET SWAP>/i,'battlebackSpring1':/<SPRING BATTLEBACK1:[ ](.*)>/i,'battlebackSpring2':/<SPRING BATTLEBACK2:[ ](.*)>/i,'battlebackSummer1':/<SUMMER BATTLEBACK1:[ ](.*)>/i,'battlebackSummer2':/<SUMMER BATTLEBACK2:[ ](.*)>/i,'battlebackAutumn1':/<AUTUMN BATTLEBACK1:[ ](.*)>/i,'battlebackAutumn2':/<AUTUMN BATTLEBACK2:[ ](.*)>/i,'battlebackWinter1':/<WINTER BATTLEBACK1:[ ](.*)>/i,'battlebackWinter2':/<WINTER BATTLEBACK2:[ ](.*)>/i,'regionBattlebacks':{'spring':/<SPRING REGION (\d+) BATTLEBACK(\d+):[ ](.*)>/gi,'summer':/<SUMMER REGION (\d+) BATTLEBACK(\d+):[ ](.*)>/gi,'autumn':/<AUTUMN REGION (\d+) BATTLEBACK(\d+):[ ](.*)>/gi,'winter':/<WINTER REGION (\d+) BATTLEBACK(\d+):[ ](.*)>/gi},'tilesetSpring':/<SPRING SWAP TO:[ ](\d+)>/i,'tilesetSummer':/<SUMMER SWAP TO:[ ](\d+)>/i,'tilesetAutumn':/<AUTUMN SWAP TO:[ ](\d+)>/i,'tilesetWinter':/<WINTER SWAP TO:[ ](\d+)>/i,'tilesetDawn':/<DAWN SWAP TO:[ ](\d+)>/i,'tilesetDay':/<DAY SWAP TO:[ ](\d+)>/i,'tilesetDusk':/<DUSK SWAP TO:[ ](\d+)>/i,'tilesetNight':/<NIGHT SWAP TO:[ ](\d+)>/i,'shopBuyCondition':/<SHOP BUY (.*):[ ](.*?)>/gi,'shopPriceCondition':/<SHOP PRICE (.*):[ ](\d+)([%％])>/gi,'skillRequireCond':/<REQUIRE (.*):[ ](.*?)>/gi,'skillDmgCond':/<(?:DAMAGE|DMG|HEAL|HEALING) IF (.*):[ ](\d+)([%％])>/gi,'skillCostCond':/<(.*) COST IF (.*):[ ](\d+)([%％])>/gi,'stateTurnsCond':/<TURNS IF (.*):[ ]([\+\-]\d+)>/gi,'troopEncounterCond':/<ENCOUNTER (.*):[ ](.*?)>/gi},VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0x211)]=Scene_Boot['prototype'][_0x5efcb0(0x195)],Scene_Boot[_0x5efcb0(0x2e2)][_0x5efcb0(0x195)]=function(){const _0x317aff=_0x5efcb0;VisuMZ[_0x317aff(0x120)]['Scene_Boot_onDatabaseLoaded'][_0x317aff(0x2cc)](this),VisuMZ[_0x317aff(0x120)][_0x317aff(0x152)]();},VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0x152)]=function(){const _0x486f1a=_0x5efcb0,_0x4f2218=VisuMZ['DateTimeSystem'][_0x486f1a(0xfa)],_0x1a5446=_0x4f2218[_0x486f1a(0x1b2)];_0x1a5446['totalMonths']=_0x1a5446['Months'][_0x486f1a(0x2f7)],_0x1a5446[_0x486f1a(0x232)][_0x486f1a(0x269)]({}),_0x1a5446[_0x486f1a(0xb1)]=_0x1a5446['Weekdays'][_0x486f1a(0x2f7)],_0x1a5446['Weekdays'][_0x486f1a(0x269)]({});};function TimeManager(){const _0x4903a6=_0x5efcb0;throw new Error(_0x4903a6(0x199));}TimeManager[_0x5efcb0(0x13f)]=0x14,VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0x2c1)]=Scene_Boot['prototype'][_0x5efcb0(0x176)],Scene_Boot['prototype']['start']=function(){const _0x12b4cc=_0x5efcb0;VisuMZ[_0x12b4cc(0x120)][_0x12b4cc(0x2c1)]['call'](this),TimeManager[_0x12b4cc(0x13b)](),TimeManager['startRealTime']();},TimeManager[_0x5efcb0(0x164)]={'timeStruct':{'minutesInHour':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)]['GameTimeGeneral'][_0x5efcb0(0x2c9)]??0x3c,'hoursInDay':VisuMZ['DateTimeSystem']['Settings'][_0x5efcb0(0x1b2)][_0x5efcb0(0x18e)]??0x18,'dawnHours':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0x1b2)][_0x5efcb0(0x1c8)]??[0x4,0x5,0x6],'dayHours':VisuMZ[_0x5efcb0(0x120)]['Settings'][_0x5efcb0(0x1b2)][_0x5efcb0(0x189)]??[0x7,0x8,0x9,0xa,0xb,0xc,0xd,0xe,0xf,0x10,0x11],'duskHours':VisuMZ['DateTimeSystem'][_0x5efcb0(0xfa)]['GameTimeGeneral'][_0x5efcb0(0x204)]??[0x12,0x13,0x14],'nightHours':VisuMZ[_0x5efcb0(0x120)]['Settings'][_0x5efcb0(0x1b2)][_0x5efcb0(0x10c)]??[0x15,0x16,0x17,0x0,0x1,0x2,0x3]},'pauseConditions':{'eventRunning':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)]['GameTimeGeneral'][_0x5efcb0(0x276)]??!![],'moveRouteForcing':VisuMZ[_0x5efcb0(0x120)]['Settings'][_0x5efcb0(0x1b2)][_0x5efcb0(0xf1)]??!![],'gatheringFollowers':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0x1b2)][_0x5efcb0(0x291)]??!![],'vehicleEnterExit':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0x1b2)][_0x5efcb0(0x1ca)]??!![]},'roundMinutes':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)]['GameTimeGeneral'][_0x5efcb0(0x149)]??!![],'saveLoadVarID':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0x23d)]['LoadMinDiff']??0x0},TimeManager['gameTime']=function(){const _0x393c49=_0x5efcb0;return $gameSystem[_0x393c49(0x265)]();},TimeManager[_0x5efcb0(0x13b)]=function(){const _0xbd3d1e=_0x5efcb0;this[_0xbd3d1e(0x177)]();},TimeManager[_0x5efcb0(0x177)]=function(_0x3c0052){const _0x52c314=_0x5efcb0;if(_0x3c0052!==undefined){if(_0x3c0052!==$gameSystem['gameTimeData']()['msPerMinute'])return;}this[_0x52c314(0xc5)]()&&this[_0x52c314(0x1ea)]();this['_gameTime']===undefined&&this[_0x52c314(0x183)]();this[_0x52c314(0x29a)]();const _0x29eb7f=Math[_0x52c314(0x225)]($gameSystem[_0x52c314(0x265)]()['msPerMinute']||TimeManager[_0x52c314(0x13f)]);setTimeout(TimeManager['updateGameTime'][_0x52c314(0x1f0)](this,_0x29eb7f),Math[_0x52c314(0x225)](_0x29eb7f,TimeManager[_0x52c314(0x13f)]));},TimeManager['canUpdateGameTime']=function(){const _0x529100=_0x5efcb0;if(!$gameMap)return![];if(!$gameMap[_0x529100(0x118)]())return![];if(!SceneManager[_0x529100(0xe9)]())return![];if($gameMap[_0x529100(0x1df)]())return![];if(!this[_0x529100(0x285)]())return![];if(!this[_0x529100(0x1ab)]())return![];return!![];},TimeManager[_0x5efcb0(0x285)]=function(){const _0x36c0d4=_0x5efcb0;if(Imported[_0x36c0d4(0x297)]){if(SceneManager['_scene'][_0x36c0d4(0x13c)])return![];}return!![];},TimeManager[_0x5efcb0(0x1ab)]=function(){const _0x2933f4=_0x5efcb0,_0x231bd1=TimeManager['GameTimeSettings'][_0x2933f4(0xb5)];if(_0x231bd1[_0x2933f4(0x283)]&&$gameMap[_0x2933f4(0x148)]())return![];if(_0x231bd1['moveRouteForcing']&&$gamePlayer[_0x2933f4(0x13d)]())return![];if(_0x231bd1[_0x2933f4(0x144)]&&$gamePlayer[_0x2933f4(0x1fd)]())return![];if(_0x231bd1[_0x2933f4(0x293)]&&($gamePlayer[_0x2933f4(0x18f)]||$gamePlayer[_0x2933f4(0x17f)]))return![];return!![];},TimeManager[_0x5efcb0(0x1ea)]=function(){const _0x2626e0=_0x5efcb0;$gameSystem[_0x2626e0(0x249)](),this[_0x2626e0(0xeb)](),this[_0x2626e0(0x183)]();},TimeManager[_0x5efcb0(0xeb)]=function(){const _0x319277=_0x5efcb0,_0x1ef807=$gameSystem[_0x319277(0x265)](),_0x267ae7=TimeManager[_0x319277(0x164)][_0x319277(0xd4)];this[_0x319277(0x218)]={'year':_0x1ef807['year'],'month':_0x1ef807['month'],'date':_0x1ef807[_0x319277(0xca)],'weekday':_0x1ef807[_0x319277(0x2e9)]||TimeManager[_0x319277(0x104)](),'hour':_0x1ef807[_0x319277(0x2c6)],'hoursInDay':_0x267ae7[_0x319277(0x15a)],'nextHour':(_0x1ef807[_0x319277(0x2c6)]+0x1)%_0x267ae7[_0x319277(0x15a)],'minute':_0x1ef807[_0x319277(0xb6)],'minutesInHour':_0x267ae7[_0x319277(0x2c9)],'second':0x0};},TimeManager['recordGameTime']=function(){const _0x504710=_0x5efcb0,_0x3c9ba0=$gameSystem['gameTimeData'](),_0x4b18bc=TimeManager[_0x504710(0x164)][_0x504710(0xd4)],_0x2e5513='%1%2%3'[_0x504710(0xac)](_0x3c9ba0[_0x504710(0x17a)],_0x3c9ba0[_0x504710(0x213)][_0x504710(0xb2)](0x2),_0x3c9ba0[_0x504710(0xca)][_0x504710(0xb2)](0x2)),_0x3ecf69=_0x504710(0x25b)[_0x504710(0xac)](_0x3c9ba0[_0x504710(0x2c6)],_0x3c9ba0[_0x504710(0xb6)][_0x504710(0xb2)](0x2),'00');this['_gameTime']={'year':_0x3c9ba0['year'],'month':_0x3c9ba0['month'],'date':_0x3c9ba0[_0x504710(0xca)],'weekday':_0x3c9ba0[_0x504710(0x2e9)]||TimeManager[_0x504710(0x104)](),'hour':_0x3c9ba0[_0x504710(0x2c6)],'hoursInDay':_0x4b18bc['hoursInDay'],'nextHour':(_0x3c9ba0[_0x504710(0x2c6)]+0x1)%_0x4b18bc[_0x504710(0x15a)],'minute':_0x3c9ba0[_0x504710(0xb6)],'minutesInHour':_0x4b18bc['minutesInHour'],'second':0x0,'fullDate':_0x2e5513,'fullTime':_0x3ecf69};},TimeManager['updateGameTimeSwitchesVariables']=function(){const _0x126f17=_0x5efcb0;$gameSwitches&&VisuMZ[_0x126f17(0x120)][_0x126f17(0x25e)](![]),$gameVariables&&VisuMZ[_0x126f17(0x120)][_0x126f17(0x116)](![]);},TimeManager[_0x5efcb0(0x12c)]=function(_0x29efc0,_0x260934){const _0x223908=_0x5efcb0,_0x520a5e=VisuMZ['DateTimeSystem'][_0x223908(0xfa)][_0x223908(0x1b2)],_0x361957=_0x520a5e[_0x223908(0x232)][_0x29efc0];let _0x1a063d=_0x361957['Days'];return _0x361957[_0x223908(0x173)]&&VisuMZ['DateTimeSystem']['CheckGameTimeLeapYear'](_0x260934)&&(_0x1a063d+=0x1),_0x1a063d;},VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0x251)]=function(_0x4ea144){const _0x1983be=_0x5efcb0;if(VisuMZ[_0x1983be(0x120)]['Settings'][_0x1983be(0x1b2)]['LeapYearCalc'])return VisuMZ[_0x1983be(0x120)]['Settings'][_0x1983be(0x1b2)][_0x1983be(0x113)][_0x1983be(0x2cc)](this,_0x4ea144);return _0x4ea144%0x190===0x0||_0x4ea144%0x64!==0x0&&_0x4ea144%0x4===0x0;},TimeManager['startRealTime']=function(){const _0x666b0a=_0x5efcb0;this[_0x666b0a(0x17e)]=new Date(),this['updateRealTime']();},TimeManager[_0x5efcb0(0x306)]=function(){const _0x3b504d=_0x5efcb0;this['_date']=new Date(),$gameMap&&$gameMap[_0x3b504d(0x1c7)]()&&this['synchToRealTime'](),this[_0x3b504d(0x182)](),this[_0x3b504d(0xcd)](),setTimeout(TimeManager[_0x3b504d(0x306)][_0x3b504d(0x1f0)](this),0x3e8);},TimeManager['synchToRealTime']=function(){const _0x2b99a5=_0x5efcb0;!this[_0x2b99a5(0x17e)]&&TimeManager[_0x2b99a5(0x2ff)](),this[_0x2b99a5(0x218)]={'year':this[_0x2b99a5(0x17e)][_0x2b99a5(0x143)](),'month':this[_0x2b99a5(0x17e)][_0x2b99a5(0x28e)]()+0x1,'date':this[_0x2b99a5(0x17e)]['getDate'](),'weekday':this['_date'][_0x2b99a5(0x11e)]()%0x7||0x7,'hour':this[_0x2b99a5(0x17e)][_0x2b99a5(0x1ba)](),'hoursInDay':0x18,'nextHour':(this[_0x2b99a5(0x17e)][_0x2b99a5(0x1ba)]()+0x1)%0x18,'minute':this[_0x2b99a5(0x17e)][_0x2b99a5(0x27b)](),'minutesInHour':0x3c,'second':this[_0x2b99a5(0x17e)]['getSeconds']()};},TimeManager[_0x5efcb0(0x182)]=function(){const _0xbe4206=_0x5efcb0,_0x4003bc='%1%2%3'[_0xbe4206(0xac)](this[_0xbe4206(0x17e)][_0xbe4206(0x143)](),Number(this[_0xbe4206(0x17e)]['getMonth']()+0x1)[_0xbe4206(0xb2)](0x2),Number(this['_date'][_0xbe4206(0x280)]())[_0xbe4206(0xb2)](0x2)),_0x5cacda=_0xbe4206(0x25b)[_0xbe4206(0xac)](Number(this['_date'][_0xbe4206(0x1ba)]()),Number(this[_0xbe4206(0x17e)][_0xbe4206(0x27b)]())[_0xbe4206(0xb2)](0x2),Number(this['_date'][_0xbe4206(0x2a9)]())[_0xbe4206(0xb2)](0x2));this[_0xbe4206(0x19b)]={'year':this[_0xbe4206(0x17e)][_0xbe4206(0x143)](),'month':this[_0xbe4206(0x17e)][_0xbe4206(0x28e)]()+0x1,'date':this[_0xbe4206(0x17e)][_0xbe4206(0x280)](),'weekday':this[_0xbe4206(0x17e)][_0xbe4206(0x11e)]()%0x7||0x7,'hour':this[_0xbe4206(0x17e)][_0xbe4206(0x1ba)](),'minute':this[_0xbe4206(0x17e)][_0xbe4206(0x27b)](),'second':this[_0xbe4206(0x17e)][_0xbe4206(0x2a9)](),'fullDate':_0x4003bc,'fullTime':_0x5cacda};},TimeManager[_0x5efcb0(0xcd)]=function(){const _0x49a453=_0x5efcb0;$gameSwitches&&VisuMZ[_0x49a453(0x120)][_0x49a453(0x25e)](!![]),$gameVariables&&VisuMZ[_0x49a453(0x120)]['ChangeAllVariables'](!![]);},TimeManager[_0x5efcb0(0x111)]=function(){const _0x3a7545=_0x5efcb0;if(!this[_0x3a7545(0x218)])return 0x0;return this['_lastTime'][_0x3a7545(0x17a)];},TimeManager['getMonth']=function(){const _0x597e37=_0x5efcb0;if(!this[_0x597e37(0x218)])return 0x0;return this[_0x597e37(0x218)][_0x597e37(0x213)];},TimeManager[_0x5efcb0(0x280)]=function(){const _0x846f1a=_0x5efcb0;if(!this['_lastTime'])return 0x0;return this['_lastTime'][_0x846f1a(0xca)];},TimeManager[_0x5efcb0(0x9d)]=function(){const _0x16ed38=_0x5efcb0;if(!this[_0x16ed38(0x218)])return 0x0;return this[_0x16ed38(0x218)]['weekday'];},TimeManager['getHour']=function(){const _0x23fdeb=_0x5efcb0;if(!this['_lastTime'])return 0x0;return this[_0x23fdeb(0x218)][_0x23fdeb(0x2c6)];},TimeManager['getNextHour']=function(){const _0x3f0c95=_0x5efcb0;if(!this[_0x3f0c95(0x218)])return 0x1;return this[_0x3f0c95(0x218)][_0x3f0c95(0x1e9)];},TimeManager[_0x5efcb0(0x258)]=function(){const _0x15de19=_0x5efcb0;if(!this[_0x15de19(0x218)])return 0x18;return this[_0x15de19(0x218)][_0x15de19(0x15a)];},TimeManager[_0x5efcb0(0x2d6)]=function(){const _0x45b90b=_0x5efcb0;if(!this['_lastTime'])return 0x0;let _0x1fb3b7=this[_0x45b90b(0x218)][_0x45b90b(0xb6)];return $gameMap&&$gameMap['isGameTime']()&&(TimeManager[_0x45b90b(0x164)][_0x45b90b(0xb7)]&&(_0x1fb3b7=Math[_0x45b90b(0x248)](_0x1fb3b7/0xa)*0xa)),_0x1fb3b7;},TimeManager['getMinuteRaw']=function(){const _0x3b44dd=_0x5efcb0;if(!this[_0x3b44dd(0x218)])return 0x0;return this['_lastTime']['minute'];},TimeManager[_0x5efcb0(0x1dc)]=function(){const _0x2d5361=_0x5efcb0;if(!this['_lastTime'])return 0x0;return this[_0x2d5361(0x218)][_0x2d5361(0x2c9)];},TimeManager[_0x5efcb0(0x14f)]=function(){const _0x156989=_0x5efcb0;if(!this[_0x156989(0x218)])return 0x0;return this[_0x156989(0x218)][_0x156989(0xe8)];},TimeManager['getMonthDays']=function(_0xc337e9,_0x4d2faa){return TimeManager['checkGameTimeTotalDaysInMonth'](_0xc337e9,_0x4d2faa);},TimeManager[_0x5efcb0(0x10b)]=function(){const _0x405992=_0x5efcb0;return VisuMZ['DateTimeSystem'][_0x405992(0xfa)]['GameTimeGeneral'][_0x405992(0x1d6)];},TimeManager[_0x5efcb0(0x147)]=function(_0x59f966){const _0x4c4f33=_0x5efcb0;return VisuMZ[_0x4c4f33(0x120)][_0x4c4f33(0xfa)][_0x4c4f33(0x1b2)][_0x4c4f33(0x232)][_0x59f966]||{};},TimeManager[_0x5efcb0(0x104)]=function(){const _0x484129=_0x5efcb0;return VisuMZ[_0x484129(0x120)][_0x484129(0xfa)]['GameTimeGeneral'][_0x484129(0xb1)];},TimeManager[_0x5efcb0(0x2ea)]=function(_0x2f8c7e){const _0x74bc4d=_0x5efcb0;return VisuMZ[_0x74bc4d(0x120)]['Settings']['GameTimeGeneral'][_0x74bc4d(0x1c4)][_0x2f8c7e]||{};},TimeManager[_0x5efcb0(0x18d)]=function(){const _0x310bf0=_0x5efcb0,_0x118f16=this[_0x310bf0(0x28e)]();if($gameMap[_0x310bf0(0x1c7)]()){const _0x1162e3=VisuMZ['DateTimeSystem'][_0x310bf0(0xfa)][_0x310bf0(0x23d)];if(_0x1162e3['SpringMonths']&&_0x1162e3[_0x310bf0(0x2fa)][_0x310bf0(0x274)](_0x118f16))return 0x1;else{if(_0x1162e3['SummerMonths']&&_0x1162e3[_0x310bf0(0x1e1)]['includes'](_0x118f16))return 0x2;else{if(_0x1162e3['AutumnMonths']&&_0x1162e3[_0x310bf0(0xd6)][_0x310bf0(0x274)](_0x118f16))return 0x3;else{if(_0x1162e3[_0x310bf0(0x257)]&&_0x1162e3[_0x310bf0(0x257)][_0x310bf0(0x274)](_0x118f16))return 0x4;}}}}else{if($gameMap[_0x310bf0(0x118)]()){const _0x1c21bc=VisuMZ[_0x310bf0(0x120)][_0x310bf0(0xfa)]['GameTimeGeneral'],_0x425dc4=_0x1c21bc[_0x310bf0(0x232)][_0x118f16]||{};if(_0x425dc4[_0x310bf0(0x2c5)])return['none',_0x310bf0(0x292),'summer',_0x310bf0(0x1fc),_0x310bf0(0x1dd)]['indexOf'](_0x425dc4['Season']);}}return 0x0;},TimeManager['checkWeekdayType']=function(){const _0x3e9e42=_0x5efcb0,_0x4cebf3=this[_0x3e9e42(0x9d)]();if($gameMap['isRealTime']()){const _0x7c6a3e=VisuMZ[_0x3e9e42(0x120)][_0x3e9e42(0xfa)][_0x3e9e42(0x23d)];if(_0x7c6a3e[_0x3e9e42(0x1c4)]&&_0x7c6a3e[_0x3e9e42(0x1c4)][_0x3e9e42(0x274)](_0x4cebf3))return 0x1;else{if(_0x7c6a3e[_0x3e9e42(0x1f9)]&&_0x7c6a3e[_0x3e9e42(0x1f9)][_0x3e9e42(0x274)](_0x4cebf3))return 0x2;}}else{if($gameMap[_0x3e9e42(0x118)]()){const _0x4a4668=VisuMZ[_0x3e9e42(0x120)][_0x3e9e42(0xfa)][_0x3e9e42(0x1b2)],_0x4b65e4=_0x4a4668[_0x3e9e42(0x1c4)][_0x4cebf3]||{};if(_0x4b65e4[_0x3e9e42(0x10d)])return[_0x3e9e42(0x159),'weekday',_0x3e9e42(0x1f1)][_0x3e9e42(0x127)](_0x4b65e4['WeekdayType']);}}return 0x0;},TimeManager[_0x5efcb0(0x209)]=function(){const _0x5dba21=_0x5efcb0,_0x4f0dc7=this[_0x5dba21(0x295)]();if($gameMap['isRealTime']()){const _0x3c81cd=VisuMZ[_0x5dba21(0x120)][_0x5dba21(0xfa)][_0x5dba21(0x23d)];if(_0x3c81cd['DawnHours']&&_0x3c81cd[_0x5dba21(0x1c8)]['includes'](_0x4f0dc7))return 0x1;else{if(_0x3c81cd['DayHours']&&_0x3c81cd[_0x5dba21(0x189)][_0x5dba21(0x274)](_0x4f0dc7))return 0x2;else{if(_0x3c81cd[_0x5dba21(0x204)]&&_0x3c81cd[_0x5dba21(0x204)][_0x5dba21(0x274)](_0x4f0dc7))return 0x3;else{if(_0x3c81cd[_0x5dba21(0x10c)]&&_0x3c81cd['NightHours'][_0x5dba21(0x274)](_0x4f0dc7))return 0x4;}}}}else{if($gameMap[_0x5dba21(0x118)]()){const _0x4ed8ff=VisuMZ['DateTimeSystem']['Settings'][_0x5dba21(0x1b2)];if(_0x4ed8ff[_0x5dba21(0x1c8)]&&_0x4ed8ff[_0x5dba21(0x1c8)]['includes'](_0x4f0dc7))return 0x1;else{if(_0x4ed8ff[_0x5dba21(0x189)]&&_0x4ed8ff[_0x5dba21(0x189)][_0x5dba21(0x274)](_0x4f0dc7))return 0x2;else{if(_0x4ed8ff[_0x5dba21(0x204)]&&_0x4ed8ff[_0x5dba21(0x204)][_0x5dba21(0x274)](_0x4f0dc7))return 0x3;else{if(_0x4ed8ff[_0x5dba21(0x10c)]&&_0x4ed8ff['NightHours']['includes'](_0x4f0dc7))return 0x4;}}}}}return 0x0;},TimeManager[_0x5efcb0(0x109)]=function(){const _0x12994e=_0x5efcb0;if(!SceneManager['isSceneMap']())return;const _0x199b5f=SceneManager['_scene'];if(!_0x199b5f)return;const _0x3637f6=_0x199b5f[_0x12994e(0x18c)];if(!_0x3637f6)return;_0x3637f6[_0x12994e(0x2e5)]();},ConfigManager[_0x5efcb0(0x17b)]=!![],VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0x141)]=ConfigManager[_0x5efcb0(0x10f)],ConfigManager[_0x5efcb0(0x10f)]=function(){const _0x5d72a9=_0x5efcb0,_0x174857=VisuMZ[_0x5d72a9(0x120)][_0x5d72a9(0x141)]['call'](this);return _0x174857[_0x5d72a9(0x17b)]=this[_0x5d72a9(0x17b)],_0x174857;},VisuMZ[_0x5efcb0(0x120)]['ConfigManager_applyData']=ConfigManager[_0x5efcb0(0x1e8)],ConfigManager[_0x5efcb0(0x1e8)]=function(_0xbe2380){const _0xeff6d8=_0x5efcb0;VisuMZ[_0xeff6d8(0x120)][_0xeff6d8(0x19d)][_0xeff6d8(0x2cc)](this,_0xbe2380),this['readFlag'](_0xbe2380,_0xeff6d8(0x17b),!![]),'dateTimeHud'in _0xbe2380?this[_0xeff6d8(0x17b)]=_0xbe2380[_0xeff6d8(0x17b)]:this['dateTimeHud']=!![];},TextManager[_0x5efcb0(0x1b4)]={'game':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xf0)],'real':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xfe)],'yearFmt':VisuMZ[_0x5efcb0(0x120)]['Settings'][_0x5efcb0(0xad)][_0x5efcb0(0x168)]},TextManager['getMonthName']=function(_0x3e76c6){const _0x542be8=_0x5efcb0;if($gameMap[_0x542be8(0x1c7)]())return TextManager[_0x542be8(0x1b4)][_0x542be8(0x11d)]['MonthFull%1'[_0x542be8(0xac)](_0x3e76c6)];else{if($gameMap[_0x542be8(0x118)]()){const _0x185e22=TimeManager[_0x542be8(0x28e)](),_0x4fb737=TimeManager[_0x542be8(0x147)](_0x185e22);return _0x4fb737[_0x542be8(0x226)]||_0x542be8(0x2d5);}}return'';},TextManager[_0x5efcb0(0x1d8)]=function(_0x5e33d1){const _0x5a611c=_0x5efcb0;if($gameMap[_0x5a611c(0x1c7)]())return TextManager['DATE_TIME_SYSTEM'][_0x5a611c(0x11d)][_0x5a611c(0x28c)['format'](_0x5e33d1)];else{if($gameMap[_0x5a611c(0x118)]()){const _0x39af6b=TimeManager['getMonth'](),_0x55b85a=TimeManager[_0x5a611c(0x147)](_0x39af6b);return _0x55b85a[_0x5a611c(0x219)]||'Error';}}return'';},TextManager[_0x5efcb0(0x2f1)]=function(_0x3cab9c){const _0x279d64=_0x5efcb0;if($gameMap[_0x279d64(0x1c7)]())return TextManager[_0x279d64(0x1b4)][_0x279d64(0x11d)][_0x279d64(0x21a)[_0x279d64(0xac)](_0x3cab9c)];else{if($gameMap[_0x279d64(0x118)]()){const _0xa6ab8=TimeManager[_0x279d64(0x9d)](),_0x132575=TimeManager['getGameTimeWeekdayData'](_0xa6ab8);return _0x132575['Name']||'Error';}}return'';},TextManager[_0x5efcb0(0x304)]=function(_0x4c1e20){const _0x5eea51=_0x5efcb0;if($gameMap['isRealTime']())return TextManager[_0x5eea51(0x1b4)][_0x5eea51(0x11d)]['WeekdayAbbr%1'['format'](_0x4c1e20)];else{if($gameMap['isGameTime']()){const _0x200604=TimeManager[_0x5eea51(0x9d)](),_0x47aef4=TimeManager[_0x5eea51(0x2ea)](_0x200604);return _0x47aef4['Abbr']||_0x5eea51(0x2d5);}}return'';},TextManager['getMilitaryHour']=function(_0x3d4081){const _0x3c1bf9=_0x5efcb0;if($gameMap['isRealTime']())return Number(_0x3d4081);else{if($gameMap[_0x3c1bf9(0x118)]())return Number(_0x3d4081);}return 0x0;},TextManager[_0x5efcb0(0x13a)]=function(_0x31a309){const _0x50bfa0=_0x5efcb0;if($gameMap[_0x50bfa0(0x1c7)]()){const _0x350f6c=0x18,_0x464c48=Math[_0x50bfa0(0x2d9)](_0x350f6c/0x2);return Number(_0x31a309%_0x464c48||_0x464c48);}else{if($gameMap['isGameTime']()){const _0x205c4a=TimeManager[_0x50bfa0(0x164)][_0x50bfa0(0xd4)][_0x50bfa0(0x15a)],_0x45d141=Math[_0x50bfa0(0x2d9)](_0x205c4a/0x2);return _0x31a309<_0x45d141?Number(_0x31a309%_0x45d141||Math[_0x50bfa0(0x248)](_0x205c4a/0x2)):Number(_0x31a309%_0x45d141||Math[_0x50bfa0(0x2d9)](_0x205c4a/0x2));}}return 0x0;},TextManager[_0x5efcb0(0x167)]=function(_0x14073e){const _0x2666d1=_0x5efcb0;if($gameMap[_0x2666d1(0x1c7)]())return TextManager[_0x2666d1(0x1d9)](_0x14073e);else{if($gameMap[_0x2666d1(0x118)]())return TextManager[_0x2666d1(0x181)](_0x14073e);}return'';},TextManager[_0x5efcb0(0x2f6)]=function(_0x1b2ba0){const _0x2d6ddd=_0x5efcb0,_0x2d6c8f=TimeManager['_gameTime']['year'],_0x590eef=String(_0x1b2ba0?_0x2d6c8f%0x64:_0x2d6c8f);return Imported['VisuMZ_0_CoreEngine']?_0x2d6ddd(0x14a)[_0x2d6ddd(0xac)](_0x590eef):_0x590eef;},TextManager['gameTimeMonth']=function(_0x5da564){const _0x35eac5=_0x5efcb0,_0x4f61bb=TimeManager[_0x35eac5(0x1b3)][_0x35eac5(0x213)];if(_0x5da564===_0x35eac5(0x198))return String(_0x4f61bb);else{if(_0x5da564==='pad'){const _0x4e239f=Number(_0x4f61bb)[_0x35eac5(0xb2)](0x2);return Imported[_0x35eac5(0xe6)]?_0x35eac5(0x14a)[_0x35eac5(0xac)](_0x4e239f):_0x4e239f;}else{if(_0x5da564===_0x35eac5(0x188)){const _0x5ee8b9=VisuMZ['DateTimeSystem'][_0x35eac5(0xfa)][_0x35eac5(0x1b2)][_0x35eac5(0x232)];if(!_0x5ee8b9[_0x4f61bb])return'';return _0x5ee8b9[_0x4f61bb][_0x35eac5(0x219)];}else{const _0x5f0cd4=VisuMZ['DateTimeSystem'][_0x35eac5(0xfa)][_0x35eac5(0x1b2)][_0x35eac5(0x232)];if(!_0x5f0cd4[_0x4f61bb])return'';return _0x5f0cd4[_0x4f61bb][_0x35eac5(0x226)];}}}},TextManager['gameTimeSeason']=function(){const _0x5144e8=_0x5efcb0,_0x21ecea=TimeManager[_0x5144e8(0x1b3)][_0x5144e8(0x213)],_0x5bab5a=VisuMZ['DateTimeSystem'][_0x5144e8(0xfa)]['GameTimeGeneral'][_0x5144e8(0x232)];if(!_0x5bab5a[_0x21ecea])return'';if(_0x5bab5a[_0x21ecea]['Season']===_0x5144e8(0x292))return TextManager['DATE_TIME_SYSTEM'][_0x5144e8(0xf6)][_0x5144e8(0x246)];else{if(_0x5bab5a[_0x21ecea][_0x5144e8(0x2c5)]===_0x5144e8(0x2eb))return TextManager[_0x5144e8(0x1b4)][_0x5144e8(0xf6)][_0x5144e8(0x2ca)];else{if(_0x5bab5a[_0x21ecea]['Season']===_0x5144e8(0x1fc))return TextManager['DATE_TIME_SYSTEM'][_0x5144e8(0xf6)][_0x5144e8(0x27d)];else return _0x5bab5a[_0x21ecea][_0x5144e8(0x2c5)]===_0x5144e8(0x1dd)?TextManager[_0x5144e8(0x1b4)]['game'][_0x5144e8(0x305)]:'';}}},TextManager[_0x5efcb0(0x2f3)]=function(_0x2938af){const _0x11b259=_0x5efcb0,_0x7beb28=TimeManager[_0x11b259(0x1b3)][_0x11b259(0xca)],_0x473a86=_0x2938af?Number(_0x7beb28)['padZero'](0x2):String(_0x7beb28);return Imported[_0x11b259(0xe6)]?'{{%1}}'[_0x11b259(0xac)](_0x473a86):_0x473a86;},TextManager[_0x5efcb0(0x1f7)]=function(_0x1331ab){const _0x4a0e33=_0x5efcb0,_0x5350d0=VisuMZ[_0x4a0e33(0x120)][_0x4a0e33(0xfa)][_0x4a0e33(0x1b2)]['totalWeekdays'];let _0x5db2ec=TimeManager[_0x4a0e33(0x1b3)][_0x4a0e33(0x2e9)];_0x5db2ec=_0x5db2ec%_0x5350d0||_0x5350d0;const _0x57a656=VisuMZ['DateTimeSystem'][_0x4a0e33(0xfa)][_0x4a0e33(0x1b2)][_0x4a0e33(0x1c4)];if(!_0x57a656[_0x5db2ec])return'';return _0x1331ab?_0x57a656[_0x5db2ec][_0x4a0e33(0x219)]:_0x57a656[_0x5db2ec][_0x4a0e33(0x226)];},TextManager['gameWeekDayType']=function(){const _0xb3e2bc=_0x5efcb0,_0xe7be2=VisuMZ[_0xb3e2bc(0x120)][_0xb3e2bc(0xfa)][_0xb3e2bc(0x1b2)][_0xb3e2bc(0xb1)];let _0x50812c=TimeManager[_0xb3e2bc(0x1b3)]['weekday'];_0x50812c=_0x50812c%_0xe7be2||_0xe7be2;const _0x223927=VisuMZ['DateTimeSystem'][_0xb3e2bc(0xfa)][_0xb3e2bc(0x1b2)]['Weekdays'];if(!_0x223927[_0x50812c])return'';if(_0x223927[_0x50812c]['WeekdayType']==='weekday')return TextManager[_0xb3e2bc(0x1b4)][_0xb3e2bc(0xf6)][_0xb3e2bc(0x16f)];else return _0x223927[_0x50812c][_0xb3e2bc(0x10d)]===_0xb3e2bc(0x1f1)?TextManager[_0xb3e2bc(0x1b4)][_0xb3e2bc(0xf6)][_0xb3e2bc(0x282)]:'';},TextManager[_0x5efcb0(0xa1)]=function(_0x17bdb1){const _0x739878=_0x5efcb0,_0x2a2c0e=TimeManager[_0x739878(0x164)][_0x739878(0xd4)][_0x739878(0x15a)],_0x1471e1=Math[_0x739878(0x2d9)](_0x2a2c0e/0x2),_0x4efdfb=TimeManager[_0x739878(0x1b3)][_0x739878(0x2c6)];let _0xd6c9c1='';if(_0x17bdb1===_0x739878(0x12a))_0xd6c9c1=String(_0x4efdfb);else{if(_0x17bdb1==='military\x20pad')_0xd6c9c1=Number(_0x4efdfb)[_0x739878(0xb2)](0x2);else{if(_0x17bdb1==='pad')_0x4efdfb<_0x1471e1?_0xd6c9c1=Number(_0x4efdfb%_0x1471e1||Math[_0x739878(0x248)](_0x2a2c0e/0x2))[_0x739878(0xb2)](0x2):_0xd6c9c1=Number(_0x4efdfb%_0x1471e1||Math[_0x739878(0x2d9)](_0x2a2c0e/0x2))[_0x739878(0xb2)](0x2);else return _0x4efdfb<_0x1471e1?Number(_0x4efdfb%_0x1471e1||Math[_0x739878(0x248)](_0x2a2c0e/0x2)):Number(_0x4efdfb%_0x1471e1||Math[_0x739878(0x2d9)](_0x2a2c0e/0x2));}}return Imported[_0x739878(0xe6)]?_0x739878(0x14a)['format'](_0xd6c9c1):_0xd6c9c1;},TextManager[_0x5efcb0(0x1c3)]=function(_0x58121a){const _0x22b3e5=_0x5efcb0,_0x328b97=TimeManager[_0x22b3e5(0x1b3)][_0x22b3e5(0xb6)],_0x5e75d9=_0x58121a?Number(_0x328b97)[_0x22b3e5(0xb2)](0x2):String(_0x328b97);return Imported['VisuMZ_0_CoreEngine']?'{{%1}}'[_0x22b3e5(0xac)](_0x5e75d9):_0x5e75d9;},TextManager[_0x5efcb0(0xe2)]=function(_0x47f6b0){const _0x1258e8=_0x5efcb0,_0x387ca3=TimeManager[_0x1258e8(0x1b3)]['second'],_0x79bbe3=_0x47f6b0?Number(_0x387ca3)[_0x1258e8(0xb2)](0x2):String(_0x387ca3);return Imported[_0x1258e8(0xe6)]?'{{%1}}'[_0x1258e8(0xac)](_0x79bbe3):_0x79bbe3;},TextManager[_0x5efcb0(0x181)]=function(_0xa94d93){const _0x781053=_0x5efcb0,_0x1111c6=Math[_0x781053(0x2d9)](TimeManager[_0x781053(0x164)]['timeStruct'][_0x781053(0x15a)]/0x2);return _0xa94d93<_0x1111c6?TextManager['DATE_TIME_SYSTEM']['game'][_0x781053(0xff)]:TextManager[_0x781053(0x1b4)]['game'][_0x781053(0x252)];},TextManager[_0x5efcb0(0x154)]=function(){const _0xdee5c1=_0x5efcb0,_0x4e91a7=TimeManager[_0xdee5c1(0x1b3)]['hour'];return this[_0xdee5c1(0x181)](_0x4e91a7);},TextManager['gameTimeDayCycle']=function(){const _0x564e39=_0x5efcb0,_0x2c5f24=TimeManager[_0x564e39(0x1b3)][_0x564e39(0x2c6)],_0x1c5e69=VisuMZ[_0x564e39(0x120)]['Settings'][_0x564e39(0x1b2)];if(_0x1c5e69[_0x564e39(0x1c8)]&&_0x1c5e69[_0x564e39(0x1c8)][_0x564e39(0x274)](_0x2c5f24))return TextManager[_0x564e39(0x1b4)][_0x564e39(0x11d)][_0x564e39(0x1cd)];else{if(_0x1c5e69[_0x564e39(0x189)]&&_0x1c5e69[_0x564e39(0x189)][_0x564e39(0x274)](_0x2c5f24))return TextManager['DATE_TIME_SYSTEM'][_0x564e39(0x11d)][_0x564e39(0x1d0)];else{if(_0x1c5e69['DuskHours']&&_0x1c5e69['DuskHours'][_0x564e39(0x274)](_0x2c5f24))return TextManager['DATE_TIME_SYSTEM'][_0x564e39(0x11d)][_0x564e39(0x178)];else return _0x1c5e69[_0x564e39(0x10c)]&&_0x1c5e69[_0x564e39(0x10c)][_0x564e39(0x274)](_0x2c5f24)?TextManager['DATE_TIME_SYSTEM'][_0x564e39(0x11d)]['TimeNight']:'';}}},TextManager[_0x5efcb0(0x220)]=function(_0x31173b){const _0x5bde38=_0x5efcb0,_0x358f77=TimeManager[_0x5bde38(0x19b)][_0x5bde38(0x17a)],_0xc8a63d=String(_0x31173b?_0x358f77%0x64:_0x358f77);return Imported[_0x5bde38(0xe6)]?_0x5bde38(0x14a)[_0x5bde38(0xac)](_0xc8a63d):_0xc8a63d;},TextManager[_0x5efcb0(0x180)]=function(_0x5c5625){const _0x1234d0=_0x5efcb0,_0x2a4b32=TimeManager[_0x1234d0(0x19b)][_0x1234d0(0x213)];if(_0x5c5625===_0x1234d0(0x198))return String(_0x2a4b32);else{if(_0x5c5625===_0x1234d0(0x1ae)){const _0x4dfb8a=Number(_0x2a4b32)['padZero'](0x2);return Imported[_0x1234d0(0xe6)]?_0x1234d0(0x14a)['format'](_0x4dfb8a):_0x4dfb8a;}else return _0x5c5625===_0x1234d0(0x188)?TextManager[_0x1234d0(0x1b4)][_0x1234d0(0x11d)]['MonthAbbr%1'[_0x1234d0(0xac)](_0x2a4b32)]:TextManager[_0x1234d0(0x1b4)][_0x1234d0(0x11d)][_0x1234d0(0xf3)['format'](_0x2a4b32)];}},TextManager[_0x5efcb0(0x16b)]=function(){const _0x28c9bf=_0x5efcb0,_0x5512a5=TimeManager[_0x28c9bf(0x19b)][_0x28c9bf(0x213)],_0x1aaadd=VisuMZ[_0x28c9bf(0x120)]['Settings'][_0x28c9bf(0x23d)];if(_0x1aaadd['SpringMonths']&&_0x1aaadd[_0x28c9bf(0x2fa)][_0x28c9bf(0x274)](_0x5512a5))return TextManager['DATE_TIME_SYSTEM'][_0x28c9bf(0x11d)][_0x28c9bf(0x246)];else{if(_0x1aaadd[_0x28c9bf(0x1e1)]&&_0x1aaadd[_0x28c9bf(0x1e1)][_0x28c9bf(0x274)](_0x5512a5))return TextManager[_0x28c9bf(0x1b4)][_0x28c9bf(0x11d)][_0x28c9bf(0x2ca)];else{if(_0x1aaadd[_0x28c9bf(0xd6)]&&_0x1aaadd[_0x28c9bf(0xd6)][_0x28c9bf(0x274)](_0x5512a5))return TextManager[_0x28c9bf(0x1b4)][_0x28c9bf(0x11d)][_0x28c9bf(0x27d)];else return _0x1aaadd['WinterMonths']&&_0x1aaadd[_0x28c9bf(0x257)][_0x28c9bf(0x274)](_0x5512a5)?TextManager[_0x28c9bf(0x1b4)][_0x28c9bf(0x11d)][_0x28c9bf(0x305)]:'';}}},TextManager[_0x5efcb0(0x165)]=function(_0x1be41e){const _0x5c3631=_0x5efcb0,_0x1df30d=TimeManager[_0x5c3631(0x19b)][_0x5c3631(0xca)],_0x2371c5=_0x1be41e?Number(_0x1df30d)[_0x5c3631(0xb2)](0x2):String(_0x1df30d);return Imported[_0x5c3631(0xe6)]?_0x5c3631(0x14a)[_0x5c3631(0xac)](_0x2371c5):_0x2371c5;},TextManager[_0x5efcb0(0x163)]=function(_0x204ee6){const _0x12c85d=_0x5efcb0;let _0x243f2b=TimeManager['_realTime'][_0x12c85d(0x2e9)];return _0x243f2b=_0x243f2b%0x7||0x7,_0x204ee6?TextManager['DATE_TIME_SYSTEM']['real'][_0x12c85d(0x1e3)[_0x12c85d(0xac)](_0x243f2b)]:TextManager[_0x12c85d(0x1b4)][_0x12c85d(0x11d)][_0x12c85d(0x21a)[_0x12c85d(0xac)](_0x243f2b)];},TextManager[_0x5efcb0(0x296)]=function(){const _0x39c68b=_0x5efcb0;let _0x37d088=TimeManager[_0x39c68b(0x19b)][_0x39c68b(0x2e9)];const _0x4b539d=VisuMZ[_0x39c68b(0x120)][_0x39c68b(0xfa)][_0x39c68b(0x23d)];if(_0x4b539d[_0x39c68b(0x1c4)]&&_0x4b539d[_0x39c68b(0x1c4)][_0x39c68b(0x274)](_0x37d088))return TextManager[_0x39c68b(0x1b4)]['real']['WeekdayName'];else return _0x4b539d[_0x39c68b(0x1f9)]&&_0x4b539d[_0x39c68b(0x1f9)][_0x39c68b(0x274)](_0x37d088)?TextManager[_0x39c68b(0x1b4)][_0x39c68b(0x11d)][_0x39c68b(0x282)]:'';},TextManager['realTimeHour']=function(_0xf0cbbe){const _0x396c17=_0x5efcb0,_0x387287=TimeManager['_realTime']['hour'];let _0x3d69d0='';if(_0xf0cbbe==='military')_0x3d69d0=String(_0x387287);else{if(_0xf0cbbe==='military\x20pad')_0x3d69d0=Number(_0x387287)['padZero'](0x2);else _0xf0cbbe===_0x396c17(0x1ae)?_0x3d69d0=Number(_0x387287%0xc||0xc)[_0x396c17(0xb2)](0x2):_0x3d69d0=String(_0x387287%0xc||0xc);}return Imported[_0x396c17(0xe6)]?_0x396c17(0x14a)[_0x396c17(0xac)](_0x3d69d0):_0x3d69d0;},TextManager['realTimeMinute']=function(_0x472785){const _0x2e99c8=_0x5efcb0,_0x3f352d=TimeManager[_0x2e99c8(0x19b)]['minute'],_0x17e2be=_0x472785?Number(_0x3f352d)[_0x2e99c8(0xb2)](0x2):String(_0x3f352d);return Imported[_0x2e99c8(0xe6)]?_0x2e99c8(0x14a)[_0x2e99c8(0xac)](_0x17e2be):_0x17e2be;},TextManager['realTimeSecond']=function(_0x550d9b){const _0x5e1999=_0x5efcb0,_0x22468f=TimeManager[_0x5e1999(0x19b)][_0x5e1999(0xe8)],_0x43c479=_0x550d9b?Number(_0x22468f)[_0x5e1999(0xb2)](0x2):String(_0x22468f);return Imported[_0x5e1999(0xe6)]?_0x5e1999(0x14a)[_0x5e1999(0xac)](_0x43c479):_0x43c479;},TextManager['realTimeMeridiemFor']=function(_0x440364){const _0x48f140=_0x5efcb0;return _0x440364<0xc?TextManager[_0x48f140(0x1b4)]['real'][_0x48f140(0xff)]:TextManager[_0x48f140(0x1b4)][_0x48f140(0x11d)][_0x48f140(0x252)];},TextManager[_0x5efcb0(0x10a)]=function(){const _0x297e61=_0x5efcb0,_0x31d254=TimeManager[_0x297e61(0x19b)][_0x297e61(0x2c6)];return this[_0x297e61(0x1d9)](_0x31d254);},TextManager[_0x5efcb0(0xbb)]=function(){const _0x199eff=_0x5efcb0,_0x27a190=TimeManager[_0x199eff(0x19b)][_0x199eff(0x2c6)],_0x550ac3=VisuMZ[_0x199eff(0x120)]['Settings'][_0x199eff(0x23d)];if(_0x550ac3[_0x199eff(0x1c8)]&&_0x550ac3[_0x199eff(0x1c8)][_0x199eff(0x274)](_0x27a190))return TextManager[_0x199eff(0x1b4)][_0x199eff(0x11d)][_0x199eff(0x1cd)];else{if(_0x550ac3[_0x199eff(0x189)]&&_0x550ac3[_0x199eff(0x189)]['includes'](_0x27a190))return TextManager['DATE_TIME_SYSTEM']['real'][_0x199eff(0x1d0)];else{if(_0x550ac3[_0x199eff(0x204)]&&_0x550ac3[_0x199eff(0x204)][_0x199eff(0x274)](_0x27a190))return TextManager[_0x199eff(0x1b4)][_0x199eff(0x11d)][_0x199eff(0x178)];else return _0x550ac3[_0x199eff(0x10c)]&&_0x550ac3['NightHours']['includes'](_0x27a190)?TextManager[_0x199eff(0x1b4)][_0x199eff(0x11d)]['TimeNight']:'';}}},Game_System[_0x5efcb0(0x1b4)]={'starting':{'year':VisuMZ[_0x5efcb0(0x120)]['Settings']['GameTimeGeneral'][_0x5efcb0(0x1a4)]??0x1,'month':VisuMZ[_0x5efcb0(0x120)]['Settings']['GameTimeGeneral']['StartMonth']??0x1,'date':VisuMZ['DateTimeSystem']['Settings'][_0x5efcb0(0x1b2)][_0x5efcb0(0x1b9)]??0x1,'weekday':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0x1b2)][_0x5efcb0(0x22c)]??0x1,'hour':VisuMZ[_0x5efcb0(0x120)]['Settings']['GameTimeGeneral']['StartHour']??0x8,'minute':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0x1b2)][_0x5efcb0(0x19c)]??0x0,'msPerMinute':VisuMZ['DateTimeSystem']['Settings']['GameTimeGeneral'][_0x5efcb0(0xb8)]??0x3e8}},VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0x16c)]=Game_System[_0x5efcb0(0x2e2)][_0x5efcb0(0x197)],Game_System['prototype'][_0x5efcb0(0x197)]=function(){const _0x90347b=_0x5efcb0;VisuMZ['DateTimeSystem'][_0x90347b(0x16c)][_0x90347b(0x2cc)](this),this[_0x90347b(0x212)](),this[_0x90347b(0x191)](),this[_0x90347b(0x1ff)]();},Game_System[_0x5efcb0(0x2e2)]['initDateTimeSystemSettings']=function(){const _0x369016=_0x5efcb0;this[_0x369016(0x126)]=!![];},Game_System[_0x5efcb0(0x2e2)][_0x5efcb0(0x203)]=function(){const _0x33c8b0=_0x5efcb0;if(this[_0x33c8b0(0x126)]===undefined)this[_0x33c8b0(0x212)]();return this['_showDateTimeSystemHud'];},Game_System[_0x5efcb0(0x2e2)][_0x5efcb0(0x155)]=function(_0x1e3b9a){const _0x534b8e=_0x5efcb0;if(this[_0x534b8e(0x126)]===undefined)this[_0x534b8e(0x212)]();this[_0x534b8e(0x126)]=_0x1e3b9a;},Game_System['prototype'][_0x5efcb0(0x191)]=function(){const _0x109cd3=_0x5efcb0,_0x36741b=Game_System[_0x109cd3(0x1b4)][_0x109cd3(0x1cf)];this[_0x109cd3(0x1b3)]={'year':_0x36741b['year'],'month':_0x36741b['month'],'date':_0x36741b[_0x109cd3(0xca)],'weekday':_0x36741b['weekday'],'hour':_0x36741b[_0x109cd3(0x2c6)],'minute':_0x36741b[_0x109cd3(0xb6)],'msPerMinute':Math[_0x109cd3(0x225)](_0x36741b[_0x109cd3(0xb8)],TimeManager['msLimit']),'paused':![]};},Game_System[_0x5efcb0(0x2e2)]['gameTimeData']=function(){const _0x4f5e5b=_0x5efcb0;if(this[_0x4f5e5b(0x1b3)]===undefined)this[_0x4f5e5b(0x191)]();return this[_0x4f5e5b(0x1b3)];},Game_System['prototype'][_0x5efcb0(0x249)]=function(){const _0x3b8b30=_0x5efcb0;this[_0x3b8b30(0x1aa)](0x1);},Game_System['prototype'][_0x5efcb0(0x1aa)]=function(_0x45bb8c){const _0x16fb17=_0x5efcb0,_0x42cb66=this['gameTimeData']();_0x42cb66[_0x16fb17(0xb6)]+=_0x45bb8c,this[_0x16fb17(0xc1)]();},Game_System[_0x5efcb0(0x2e2)][_0x5efcb0(0xc1)]=function(){const _0x8ef893=_0x5efcb0,_0x40ba8d=this[_0x8ef893(0x265)](),_0x247662=TimeManager['GameTimeSettings']['timeStruct'];_0x40ba8d[_0x8ef893(0xb6)]>=_0x247662[_0x8ef893(0x2c9)]&&(_0x40ba8d['hour']+=Math['floor'](_0x40ba8d['minute']/_0x247662[_0x8ef893(0x2c9)]),_0x40ba8d['minute']=_0x40ba8d[_0x8ef893(0xb6)]%_0x247662['minutesInHour']),this['checkGameTimeHourOverflow']();},Game_System[_0x5efcb0(0x2e2)]['checkGameTimeHourOverflow']=function(){const _0x46972d=_0x5efcb0,_0xe5358d=this[_0x46972d(0x265)](),_0x1814ad=TimeManager['GameTimeSettings'][_0x46972d(0xd4)];if(_0xe5358d['hour']>=_0x1814ad['hoursInDay']){const _0x2aec96=Math['floor'](_0xe5358d[_0x46972d(0x2c6)]/_0x1814ad[_0x46972d(0x15a)]);this[_0x46972d(0x1d5)](_0x2aec96),_0xe5358d[_0x46972d(0x2c6)]=_0xe5358d[_0x46972d(0x2c6)]%_0x1814ad[_0x46972d(0x15a)];}},Game_System[_0x5efcb0(0x2e2)][_0x5efcb0(0x1d5)]=function(_0x154616){const _0x30884f=_0x5efcb0,_0x4e659a=this[_0x30884f(0x265)]();_0x4e659a[_0x30884f(0x2e9)]+=_0x154616,_0x4e659a[_0x30884f(0xca)]+=_0x154616,this['checkGameTimeWeekdayOverflow'](),this[_0x30884f(0x215)]();},Game_System['prototype'][_0x5efcb0(0xf9)]=function(){const _0x571d4f=_0x5efcb0,_0x4de684=this[_0x571d4f(0x265)]();if(_0x4de684[_0x571d4f(0x2e9)]>TimeManager['getGameTimeTotalWeekdays']()){const _0x579d53=TimeManager[_0x571d4f(0x104)]();_0x4de684['weekday']=_0x4de684[_0x571d4f(0x2e9)]%_0x579d53||_0x579d53;}},Game_System[_0x5efcb0(0x2e2)][_0x5efcb0(0x215)]=function(){const _0x186fde=_0x5efcb0,_0x454f43=this[_0x186fde(0x265)]();for(;;){if(_0x454f43[_0x186fde(0x213)]>TimeManager[_0x186fde(0x10b)]()){_0x454f43[_0x186fde(0x213)]-=TimeManager[_0x186fde(0x10b)](),_0x454f43[_0x186fde(0x17a)]+=0x1;continue;}const _0x567abc=TimeManager[_0x186fde(0x12c)](_0x454f43[_0x186fde(0x213)],_0x454f43[_0x186fde(0x17a)]);if(_0x454f43[_0x186fde(0xca)]>_0x567abc){_0x454f43[_0x186fde(0xca)]-=_0x567abc,_0x454f43[_0x186fde(0x213)]+=0x1;continue;}return;}},Game_System[_0x5efcb0(0x2e2)]['changeMsPerGameTimeMinute']=function(_0x1c2f93){const _0x29c031=_0x5efcb0,_0x32fd58=this[_0x29c031(0x265)]();if(_0x32fd58[_0x29c031(0xb8)]===_0x1c2f93)return;_0x32fd58[_0x29c031(0xb8)]=Math['max'](_0x1c2f93,TimeManager[_0x29c031(0x13f)]);if(_0x1c2f93===Number['MAX_SAFE_INTEGER'])return;TimeManager[_0x29c031(0x177)](_0x1c2f93);},Game_System[_0x5efcb0(0x2e2)][_0x5efcb0(0x1a8)]=function(){const _0x5d2f23=_0x5efcb0,_0x463c14=this[_0x5d2f23(0x265)](),_0x49e957=_0x463c14[_0x5d2f23(0xb8)];if(_0x49e957===Number[_0x5d2f23(0x2d0)])return;TimeManager[_0x5d2f23(0x177)](_0x49e957);},VisuMZ['DateTimeSystem'][_0x5efcb0(0x2cf)]=Scene_Load[_0x5efcb0(0x2e2)][_0x5efcb0(0xf7)],Scene_Load['prototype'][_0x5efcb0(0xf7)]=function(){const _0x32bbf7=_0x5efcb0;VisuMZ['DateTimeSystem'][_0x32bbf7(0x2cf)][_0x32bbf7(0x2cc)](this);},Game_System[_0x5efcb0(0x2e2)][_0x5efcb0(0x1e2)]=function(){const _0x51edc3=_0x5efcb0,_0x1b9749=this['gameTimeData']();_0x1b9749[_0x51edc3(0x9b)]=!![];},Game_System[_0x5efcb0(0x2e2)][_0x5efcb0(0x205)]=function(){const _0x350e4c=_0x5efcb0,_0x34da72=this[_0x350e4c(0x265)]();_0x34da72['paused']=![];},Game_System[_0x5efcb0(0x2e2)][_0x5efcb0(0x1ac)]=function(){const _0x18ba83=_0x5efcb0,_0x526bc6={'year':Game_System['DATE_TIME_SYSTEM']['starting'][_0x18ba83(0x17a)],'month':Game_System[_0x18ba83(0x1b4)][_0x18ba83(0x1cf)]['month'],'date':Game_System['DATE_TIME_SYSTEM']['starting'][_0x18ba83(0xca)]},_0x354a32={'year':$gameSystem[_0x18ba83(0x265)]()[_0x18ba83(0x17a)],'month':$gameSystem[_0x18ba83(0x265)]()[_0x18ba83(0x213)],'date':$gameSystem['gameTimeData']()[_0x18ba83(0xca)]},_0xb089a1=Game_System[_0x18ba83(0x1b4)][_0x18ba83(0x1cf)]['weekday'];let _0x28da88=0x0;VisuMZ[_0x18ba83(0x120)]['isCurrentDateAhead'](_0x526bc6,_0x354a32)?_0x28da88=VisuMZ[_0x18ba83(0x120)]['calcTotalDaysBetweenDates'](_0x526bc6,_0x354a32):_0x28da88=-VisuMZ[_0x18ba83(0x120)][_0x18ba83(0x2ef)](_0x354a32,_0x526bc6);const _0x4e98ae=TimeManager['getGameTimeTotalWeekdays'](),_0x3c9516=(_0xb089a1+_0x28da88)%_0x4e98ae||_0x4e98ae;$gameSystem[_0x18ba83(0x265)]()[_0x18ba83(0x2e9)]=_0x3c9516;},VisuMZ[_0x5efcb0(0x120)]['calcTotalDaysBetweenDates']=function(_0x2fce0e,_0x4d4379){const _0x6aa88f=_0x5efcb0;let _0x1b7623=0x0;for(let _0x32e165=_0x2fce0e[_0x6aa88f(0x17a)];_0x32e165<=_0x4d4379['year'];_0x32e165++){let _0x551600=0x0;if(_0x32e165===_0x2fce0e[_0x6aa88f(0x17a)])_0x551600=_0x2fce0e[_0x6aa88f(0x213)];let _0x18594a=TimeManager[_0x6aa88f(0x10b)]()-0x1;if(_0x32e165===_0x4d4379[_0x6aa88f(0x17a)])_0x18594a=_0x4d4379['month'];for(let _0x351240=_0x551600;_0x351240<=_0x18594a;_0x351240++){let _0x377062=0x0;if(_0x32e165===_0x2fce0e['year']&&_0x351240===_0x2fce0e[_0x6aa88f(0x213)])_0x377062=_0x2fce0e['date'];let _0x506e99=TimeManager[_0x6aa88f(0x12c)](_0x351240,_0x32e165)-0x1;if(_0x32e165===_0x4d4379[_0x6aa88f(0x17a)]&&_0x351240===_0x4d4379['month'])_0x506e99=_0x4d4379[_0x6aa88f(0xca)];_0x1b7623+=_0x506e99-_0x377062;}}return _0x1b7623;},VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0x1d4)]=function(_0x132f3c,_0x59fc21){const _0x1301e3=_0x5efcb0;if(_0x59fc21['year']>_0x132f3c[_0x1301e3(0x17a)])return!![];if(_0x59fc21[_0x1301e3(0x213)]>_0x132f3c[_0x1301e3(0x213)])return!![];return _0x59fc21[_0x1301e3(0xca)]>_0x132f3c[_0x1301e3(0xca)];},Game_System['prototype'][_0x5efcb0(0x1ff)]=function(){this['_lastSaveTime']=null;},VisuMZ['DateTimeSystem'][_0x5efcb0(0xd2)]=Game_System['prototype'][_0x5efcb0(0x1a9)],Game_System[_0x5efcb0(0x2e2)][_0x5efcb0(0x1a9)]=function(){const _0x4e97af=_0x5efcb0;VisuMZ[_0x4e97af(0x120)][_0x4e97af(0xd2)]['call'](this),Imported[_0x4e97af(0x1d3)]&&this['recordDateTimeSystemSaveTime']();},Game_System[_0x5efcb0(0x2e2)][_0x5efcb0(0x2d1)]=function(){this['_lastSaveTime']=new Date()['getTime']();},VisuMZ[_0x5efcb0(0x120)]['Game_System_onAfterLoad']=Game_System['prototype'][_0x5efcb0(0x307)],Game_System[_0x5efcb0(0x2e2)]['onAfterLoad']=function(){const _0x23cb1d=_0x5efcb0;VisuMZ[_0x23cb1d(0x120)][_0x23cb1d(0x14c)]['call'](this),Imported['VisuMZ_1_SaveCore']&&this['processDateTimeSystemSaveTimeDifference']();},Game_System[_0x5efcb0(0x2e2)][_0x5efcb0(0x2c7)]=function(){const _0x454a5a=_0x5efcb0;if(!this[_0x454a5a(0x2f9)])return;const _0x8899a=TimeManager[_0x454a5a(0x164)]['saveLoadVarID'];if(_0x8899a<=0x0)return;const _0x302e11=new Date()['getTime'](),_0x4eeaf9=_0x302e11-this[_0x454a5a(0x2f9)],_0x32b74e=Math[_0x454a5a(0x1c5)](_0x4eeaf9/(0x3e8*0x3c));$gameVariables&&$gameVariables[_0x454a5a(0x137)](_0x8899a,_0x32b74e);},VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0x25e)]=function(_0x2938a2){const _0x4e6d52=_0x5efcb0,_0x2e3cf1=_0x2938a2?_0x4e6d52(0x19f):_0x4e6d52(0xaa),_0xf1be18=VisuMZ[_0x4e6d52(0x120)][_0x4e6d52(0xfa)][_0x2e3cf1];if(!_0xf1be18)return;const _0x13f357=_0x2938a2?TimeManager['_realTime']:TimeManager[_0x4e6d52(0x1b3)];if(!_0x13f357)return;if(_0x2938a2){const _0x30d22a=VisuMZ[_0x4e6d52(0x120)]['Settings'][_0x4e6d52(0x23d)];if(_0xf1be18[_0x4e6d52(0x28b)]&&_0x30d22a[_0x4e6d52(0x2fa)]){const _0x5ecc35=_0xf1be18['SwSpring'],_0x5edbdf=_0x30d22a['SpringMonths'][_0x4e6d52(0x274)](_0x13f357['month']);VisuMZ[_0x4e6d52(0x120)][_0x4e6d52(0x279)](_0x5ecc35,_0x5edbdf);}if(_0xf1be18[_0x4e6d52(0x110)]&&_0x30d22a[_0x4e6d52(0x1e1)]){const _0x390158=_0xf1be18[_0x4e6d52(0x110)],_0x466128=_0x30d22a['SummerMonths'][_0x4e6d52(0x274)](_0x13f357[_0x4e6d52(0x213)]);VisuMZ[_0x4e6d52(0x120)][_0x4e6d52(0x279)](_0x390158,_0x466128);}if(_0xf1be18[_0x4e6d52(0xd5)]&&_0x30d22a['AutumnMonths']){const _0x1b2712=_0xf1be18[_0x4e6d52(0xd5)],_0x1370f3=_0x30d22a['AutumnMonths'][_0x4e6d52(0x274)](_0x13f357[_0x4e6d52(0x213)]);VisuMZ[_0x4e6d52(0x120)][_0x4e6d52(0x279)](_0x1b2712,_0x1370f3);}if(_0xf1be18[_0x4e6d52(0x22e)]&&_0x30d22a[_0x4e6d52(0x257)]){const _0x10f5df=_0xf1be18[_0x4e6d52(0x22e)],_0x550192=_0x30d22a[_0x4e6d52(0x257)][_0x4e6d52(0x274)](_0x13f357[_0x4e6d52(0x213)]);VisuMZ[_0x4e6d52(0x120)]['ChangeSwitch'](_0x10f5df,_0x550192);}if(_0xf1be18[_0x4e6d52(0xd7)]&&_0x30d22a[_0x4e6d52(0x1c4)]){const _0x2f2319=_0xf1be18[_0x4e6d52(0xd7)],_0x4c8489=_0x30d22a['Weekdays'][_0x4e6d52(0x274)](_0x13f357[_0x4e6d52(0x2e9)]);VisuMZ[_0x4e6d52(0x120)][_0x4e6d52(0x279)](_0x2f2319,_0x4c8489);}if(_0xf1be18[_0x4e6d52(0x16e)]&&_0x30d22a[_0x4e6d52(0x1f9)]){const _0x1f8ef7=_0xf1be18[_0x4e6d52(0x16e)],_0x36ef6b=_0x30d22a[_0x4e6d52(0x1f9)]['includes'](_0x13f357['weekday']);VisuMZ[_0x4e6d52(0x120)]['ChangeSwitch'](_0x1f8ef7,_0x36ef6b);}if(_0xf1be18[_0x4e6d52(0x24a)]&&_0x30d22a[_0x4e6d52(0x1c8)]){const _0x4e0bec=_0xf1be18['SwDawn'],_0x2fe36b=_0x30d22a[_0x4e6d52(0x1c8)]['includes'](_0x13f357[_0x4e6d52(0x2c6)]);VisuMZ[_0x4e6d52(0x120)][_0x4e6d52(0x279)](_0x4e0bec,_0x2fe36b);}if(_0xf1be18[_0x4e6d52(0x26d)]&&_0x30d22a[_0x4e6d52(0x189)]){const _0x57b6f3=_0xf1be18[_0x4e6d52(0x26d)],_0x1098a5=_0x30d22a[_0x4e6d52(0x189)][_0x4e6d52(0x274)](_0x13f357[_0x4e6d52(0x2c6)]);VisuMZ[_0x4e6d52(0x120)][_0x4e6d52(0x279)](_0x57b6f3,_0x1098a5);}if(_0xf1be18[_0x4e6d52(0x12e)]&&_0x30d22a[_0x4e6d52(0x204)]){const _0x417911=_0xf1be18[_0x4e6d52(0x12e)],_0xe9d395=_0x30d22a[_0x4e6d52(0x204)][_0x4e6d52(0x274)](_0x13f357[_0x4e6d52(0x2c6)]);VisuMZ['DateTimeSystem'][_0x4e6d52(0x279)](_0x417911,_0xe9d395);}if(_0xf1be18[_0x4e6d52(0x115)]&&_0x30d22a[_0x4e6d52(0x10c)]){const _0x1b1f7e=_0xf1be18[_0x4e6d52(0x115)],_0x204c0b=_0x30d22a['NightHours'][_0x4e6d52(0x274)](_0x13f357['hour']);VisuMZ[_0x4e6d52(0x120)]['ChangeSwitch'](_0x1b1f7e,_0x204c0b);}}else{const _0x176674=VisuMZ[_0x4e6d52(0x120)][_0x4e6d52(0xfa)][_0x4e6d52(0x1b2)],_0x56a444=_0x13f357[_0x4e6d52(0x213)],_0x74857b=_0x176674[_0x4e6d52(0x232)][_0x56a444];if(_0x74857b){if(_0xf1be18[_0x4e6d52(0x28b)]){const _0xd2aaaf=_0xf1be18[_0x4e6d52(0x28b)],_0x3464eb=_0x74857b[_0x4e6d52(0x2c5)]===_0x4e6d52(0x292);VisuMZ['DateTimeSystem'][_0x4e6d52(0x279)](_0xd2aaaf,_0x3464eb);}if(_0xf1be18[_0x4e6d52(0x110)]){const _0x1191d5=_0xf1be18[_0x4e6d52(0x110)],_0x4131c7=_0x74857b['Season']===_0x4e6d52(0x2eb);VisuMZ[_0x4e6d52(0x120)][_0x4e6d52(0x279)](_0x1191d5,_0x4131c7);}if(_0xf1be18[_0x4e6d52(0xd5)]){const _0x48daed=_0xf1be18[_0x4e6d52(0xd5)],_0x507401=_0x74857b[_0x4e6d52(0x2c5)]==='autumn';VisuMZ[_0x4e6d52(0x120)][_0x4e6d52(0x279)](_0x48daed,_0x507401);}if(_0xf1be18[_0x4e6d52(0x22e)]){const _0x48077f=_0xf1be18[_0x4e6d52(0x22e)],_0x1186d9=_0x74857b[_0x4e6d52(0x2c5)]===_0x4e6d52(0x1dd);VisuMZ[_0x4e6d52(0x120)][_0x4e6d52(0x279)](_0x48077f,_0x1186d9);}}const _0x55063b=_0x13f357['weekday'],_0x1ef10e=_0x176674[_0x4e6d52(0x1c4)][_0x55063b];if(_0x1ef10e){if(_0xf1be18[_0x4e6d52(0xd7)]){const _0x380f34=_0xf1be18[_0x4e6d52(0xd7)],_0x275690=_0x1ef10e[_0x4e6d52(0x10d)]==='weekday';VisuMZ['DateTimeSystem'][_0x4e6d52(0x279)](_0x380f34,_0x275690);}if(_0xf1be18[_0x4e6d52(0x16e)]){const _0x549aa8=_0xf1be18[_0x4e6d52(0x16e)],_0x4a7f2e=_0x1ef10e[_0x4e6d52(0x10d)]==='weekend';VisuMZ[_0x4e6d52(0x120)]['ChangeSwitch'](_0x549aa8,_0x4a7f2e);}}if(_0xf1be18[_0x4e6d52(0x24a)]&&_0x176674[_0x4e6d52(0x1c8)]){const _0x236ed9=_0xf1be18[_0x4e6d52(0x24a)],_0x543b24=_0x176674[_0x4e6d52(0x1c8)][_0x4e6d52(0x274)](_0x13f357[_0x4e6d52(0x2c6)]);VisuMZ[_0x4e6d52(0x120)][_0x4e6d52(0x279)](_0x236ed9,_0x543b24);}if(_0xf1be18['SwDay']&&_0x176674[_0x4e6d52(0x189)]){const _0x21ecce=_0xf1be18[_0x4e6d52(0x26d)],_0x3f7351=_0x176674[_0x4e6d52(0x189)][_0x4e6d52(0x274)](_0x13f357[_0x4e6d52(0x2c6)]);VisuMZ['DateTimeSystem'][_0x4e6d52(0x279)](_0x21ecce,_0x3f7351);}if(_0xf1be18['SwDusk']&&_0x176674[_0x4e6d52(0x204)]){const _0x94a93a=_0xf1be18[_0x4e6d52(0x12e)],_0x5b8642=_0x176674[_0x4e6d52(0x204)][_0x4e6d52(0x274)](_0x13f357[_0x4e6d52(0x2c6)]);VisuMZ['DateTimeSystem'][_0x4e6d52(0x279)](_0x94a93a,_0x5b8642);}if(_0xf1be18[_0x4e6d52(0x115)]&&_0x176674[_0x4e6d52(0x10c)]){const _0x3855b3=_0xf1be18[_0x4e6d52(0x115)],_0x4eb5aa=_0x176674[_0x4e6d52(0x10c)]['includes'](_0x13f357[_0x4e6d52(0x2c6)]);VisuMZ['DateTimeSystem'][_0x4e6d52(0x279)](_0x3855b3,_0x4eb5aa);}}},VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0x279)]=function(_0x58a0aa,_0x144d3e){const _0x37eb4b=_0x5efcb0;$gameSwitches[_0x37eb4b(0x255)](_0x58a0aa)!==_0x144d3e&&$gameSwitches[_0x37eb4b(0x137)](_0x58a0aa,_0x144d3e);},VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0x116)]=function(_0x20f792){const _0x9430f7=_0x5efcb0,_0x569ead=_0x20f792?_0x9430f7(0x19f):'GameTimeData',_0x145091=VisuMZ['DateTimeSystem'][_0x9430f7(0xfa)][_0x569ead];if(!_0x145091)return;const _0x59f261=_0x20f792?TimeManager[_0x9430f7(0x19b)]:TimeManager[_0x9430f7(0x1b3)];if(!_0x59f261)return;if(_0x145091[_0x9430f7(0x196)]){const _0x59f3a2=_0x145091['VarYear'],_0xea0374=_0x59f261[_0x9430f7(0x17a)];VisuMZ[_0x9430f7(0x120)][_0x9430f7(0x2af)](_0x59f3a2,_0xea0374);}if(_0x145091[_0x9430f7(0x300)]){const _0x1902b5=_0x145091['VarMonth'],_0x272579=_0x59f261[_0x9430f7(0x213)];VisuMZ[_0x9430f7(0x120)][_0x9430f7(0x2af)](_0x1902b5,_0x272579);}if(_0x145091[_0x9430f7(0x2ae)]){const _0x59c8be=_0x145091[_0x9430f7(0x2ae)],_0x3325d4=_0x59f261[_0x9430f7(0xca)];VisuMZ[_0x9430f7(0x120)][_0x9430f7(0x2af)](_0x59c8be,_0x3325d4);}if(_0x145091[_0x9430f7(0x146)]){const _0x133bb5=_0x145091[_0x9430f7(0x146)],_0xe9c8df=_0x59f261['fullDate'];$gameVariables[_0x9430f7(0x137)](_0x133bb5,_0xe9c8df);}if(_0x145091[_0x9430f7(0x236)]){const _0x1a8d5e=_0x145091[_0x9430f7(0x236)],_0x335541=_0x59f261['weekday'];VisuMZ[_0x9430f7(0x120)][_0x9430f7(0x2af)](_0x1a8d5e,_0x335541);}if(_0x145091[_0x9430f7(0xda)]){const _0x2d1fe8=_0x145091['VarHour'],_0x50e91d=_0x59f261[_0x9430f7(0x2c6)];VisuMZ[_0x9430f7(0x120)][_0x9430f7(0x2af)](_0x2d1fe8,_0x50e91d);}if(_0x145091['VarMinute']){const _0x51bcab=_0x145091[_0x9430f7(0xba)],_0x55d1cb=_0x59f261['minute'];VisuMZ[_0x9430f7(0x120)][_0x9430f7(0x2af)](_0x51bcab,_0x55d1cb);}if(_0x145091[_0x9430f7(0x1bf)]){const _0x37342c=_0x145091[_0x9430f7(0x1bf)],_0x362bad=_0x20f792?_0x59f261[_0x9430f7(0xe8)]:0x0;VisuMZ[_0x9430f7(0x120)]['ChangeVariable'](_0x37342c,_0x362bad);}if(_0x145091[_0x9430f7(0x1ec)]){const _0x1eeb1c=_0x145091[_0x9430f7(0x1ec)],_0x654717=_0x59f261[_0x9430f7(0x238)];$gameVariables[_0x9430f7(0x137)](_0x1eeb1c,_0x654717);}},VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0x2af)]=function(_0x5ee4ec,_0x44c865){const _0x32d934=_0x5efcb0;$gameVariables[_0x32d934(0x255)](_0x5ee4ec)!==_0x44c865&&$gameVariables[_0x32d934(0x137)](_0x5ee4ec,_0x44c865);},Game_Screen[_0x5efcb0(0x1b4)]={'gameTone':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0x15b)],'gameOverlay':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)]['GameTimeOverlay'],'real':VisuMZ[_0x5efcb0(0x120)]['Settings'][_0x5efcb0(0x2fe)]},VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0x28a)]=Game_Screen[_0x5efcb0(0x2e2)]['clear'],Game_Screen[_0x5efcb0(0x2e2)][_0x5efcb0(0x18a)]=function(){const _0x56cd11=_0x5efcb0;VisuMZ[_0x56cd11(0x120)]['Game_Screen_clear'][_0x56cd11(0x2cc)](this),this['clearDateTimeSystem']();},Game_Screen['prototype'][_0x5efcb0(0x298)]=function(){const _0x4b9139=_0x5efcb0;$gameTemp[_0x4b9139(0x2ce)]=undefined,$gameTemp[_0x4b9139(0x23a)]=undefined,this[_0x4b9139(0x20b)](),this[_0x4b9139(0x160)]();},VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0x1af)]=Game_Screen[_0x5efcb0(0x2e2)]['update'],Game_Screen[_0x5efcb0(0x2e2)][_0x5efcb0(0x2c4)]=function(){const _0x1081ca=_0x5efcb0;VisuMZ['DateTimeSystem'][_0x1081ca(0x1af)][_0x1081ca(0x2cc)](this),this[_0x1081ca(0xcf)]();},Game_Screen[_0x5efcb0(0x2e2)][_0x5efcb0(0xcf)]=function(){const _0x3d716e=_0x5efcb0;if(!$gameMap){this['_timeTone']=[0x0,0x0,0x0,0x0],this['_timeOverlay']=_0x3d716e(0xed);return;}if($gameMap[_0x3d716e(0x21c)]()){this['_timeTone']=[0x0,0x0,0x0,0x0],this[_0x3d716e(0x2b7)]='#ffffff';return;}if($gameTemp[_0x3d716e(0x2ce)]===TimeManager['getHour']()&&$gameTemp[_0x3d716e(0x23a)]===TimeManager[_0x3d716e(0x99)]())return;$gameTemp[_0x3d716e(0x2ce)]=TimeManager[_0x3d716e(0x295)](),$gameTemp[_0x3d716e(0x23a)]=TimeManager['getMinuteRaw'](),Imported[_0x3d716e(0xb4)]?this['updateTimeOverlay']():this[_0x3d716e(0x2c0)]();},Game_Screen[_0x5efcb0(0x2e2)][_0x5efcb0(0x20b)]=function(){this['_timeTone']=[0x0,0x0,0x0,0x0];},Game_Screen[_0x5efcb0(0x2e2)]['getTimeTone']=function(){const _0x39a093=_0x5efcb0;return this[_0x39a093(0x233)]===undefined&&(this[_0x39a093(0x20b)](),this[_0x39a093(0x2c0)]()),this[_0x39a093(0x233)];},Game_Screen['prototype'][_0x5efcb0(0xa9)]=function(_0x1869ba){const _0x2b5a8e=_0x5efcb0;if($gameMap){if($gameMap[_0x2b5a8e(0x1c7)]()){const _0x42d0fa=Game_Screen[_0x2b5a8e(0x1b4)]['real'];return _0x42d0fa['Tone%1'[_0x2b5a8e(0xac)](_0x1869ba)]||[0x0,0x0,0x0,0x0];}else{if($gameMap[_0x2b5a8e(0x118)]()){const _0x1a3256=Game_Screen[_0x2b5a8e(0x1b4)][_0x2b5a8e(0xa8)];return _0x1a3256[_0x1869ba]||_0x1a3256[_0x1a3256[_0x2b5a8e(0x2f7)]-0x1];}}}return[0x0,0x0,0x0,0x0];},Game_Screen[_0x5efcb0(0x2e2)][_0x5efcb0(0x2c0)]=function(){const _0x1efe71=_0x5efcb0,_0xfd205a=TimeManager[_0x1efe71(0x295)](),_0x3c435e=TimeManager[_0x1efe71(0x139)](),_0x5233a9=TimeManager[_0x1efe71(0x99)](),_0x1402b3=TimeManager[_0x1efe71(0x1dc)](),_0x5e637f=_0x5233a9/_0x1402b3,_0x48c2f2=this[_0x1efe71(0xa9)](_0xfd205a),_0x3e79d1=this[_0x1efe71(0xa9)](_0x3c435e),_0x5c29af=Math[_0x1efe71(0x1c5)](_0x48c2f2[0x0]+(_0x3e79d1[0x0]-_0x48c2f2[0x0])*_0x5e637f),_0x51c6ec=Math[_0x1efe71(0x1c5)](_0x48c2f2[0x1]+(_0x3e79d1[0x1]-_0x48c2f2[0x1])*_0x5e637f),_0x1bec4d=Math[_0x1efe71(0x1c5)](_0x48c2f2[0x2]+(_0x3e79d1[0x2]-_0x48c2f2[0x2])*_0x5e637f),_0x105e83=Math[_0x1efe71(0x1c5)](_0x48c2f2[0x3]+(_0x3e79d1[0x3]-_0x48c2f2[0x3])*_0x5e637f);this[_0x1efe71(0x233)]=[_0x5c29af,_0x51c6ec,_0x1bec4d,_0x105e83];},Game_Screen['prototype'][_0x5efcb0(0x160)]=function(){const _0x1da7b2=_0x5efcb0;this[_0x1da7b2(0x2b7)]='#ffffff';},Game_Screen[_0x5efcb0(0x2e2)]['getTimeOverlay']=function(){const _0x1f482a=_0x5efcb0;return this[_0x1f482a(0x2b7)]===undefined&&(this[_0x1f482a(0x160)](),this[_0x1f482a(0x216)]()),this[_0x1f482a(0x2b7)];},Game_Screen[_0x5efcb0(0x2e2)][_0x5efcb0(0x2e8)]=function(_0x340628){const _0xa54b55=_0x5efcb0;if($gameMap){if($gameMap['isRealTime']()){const _0x850234=Game_Screen[_0xa54b55(0x1b4)][_0xa54b55(0x11d)];return _0x850234[_0xa54b55(0xfb)['format'](_0x340628)]||'#ffffff';}else{if($gameMap[_0xa54b55(0x118)]()){const _0x2d1d21=Game_Screen['DATE_TIME_SYSTEM'][_0xa54b55(0xce)];return _0x2d1d21[_0x340628]||_0x2d1d21[_0x2d1d21[_0xa54b55(0x2f7)]-0x1];}}}return'#ffffff';},Game_Screen[_0x5efcb0(0x2e2)][_0x5efcb0(0x216)]=function(){const _0x25b0f7=_0x5efcb0,_0x24f249=TimeManager[_0x25b0f7(0x295)](),_0x1c2735=TimeManager[_0x25b0f7(0x139)](),_0x433ccb=TimeManager[_0x25b0f7(0x99)](),_0x20e9a0=TimeManager['getMinutesInHour'](),_0x21c4d4=_0x433ccb/_0x20e9a0,_0x2d63c0=this[_0x25b0f7(0x2e8)](_0x24f249),_0x44c412=this['getTimeOverlayForHour'](_0x1c2735),_0x52d005=ColorManager[_0x25b0f7(0x130)](_0x2d63c0),_0x3cffd8=ColorManager['hexToArray'](_0x44c412),_0x455700=[Math[_0x25b0f7(0x1c5)](_0x52d005[0x0]+(_0x3cffd8[0x0]-_0x52d005[0x0])*_0x21c4d4)[_0x25b0f7(0x2e7)](0x0,0xff),Math['round'](_0x52d005[0x1]+(_0x3cffd8[0x1]-_0x52d005[0x1])*_0x21c4d4)[_0x25b0f7(0x2e7)](0x0,0xff),Math[_0x25b0f7(0x1c5)](_0x52d005[0x2]+(_0x3cffd8[0x2]-_0x52d005[0x2])*_0x21c4d4)[_0x25b0f7(0x2e7)](0x0,0xff)];this[_0x25b0f7(0x2b7)]=ColorManager['arrayToHex'](_0x455700);},VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0x231)]=Game_Action[_0x5efcb0(0x2e2)][_0x5efcb0(0xe5)],Game_Action[_0x5efcb0(0x2e2)][_0x5efcb0(0xe5)]=function(_0x3140e0,_0x1c38d6){const _0x3dfe44=_0x5efcb0;_0x3140e0=VisuMZ[_0x3dfe44(0x120)][_0x3dfe44(0x231)]['call'](this,_0x3140e0,_0x1c38d6);if(!this[_0x3dfe44(0x185)]())return _0x3140e0;if(Imported[_0x3dfe44(0x2a0)]){const _0x4f754e=VisuMZ[_0x3dfe44(0x120)]['CalcSkillDmgRate'](this[_0x3dfe44(0x1ce)]());_0x3140e0*=_0x4f754e;}return _0x3140e0;},VisuMZ['DateTimeSystem'][_0x5efcb0(0x193)]=function(_0x19a443){const _0x18f0c7=_0x5efcb0;if($gameMap&&$gameMap[_0x18f0c7(0x21c)]())return 0x1;if(BattleManager[_0x18f0c7(0x1ef)]())return!![];const _0xccf32c=VisuMZ[_0x18f0c7(0x120)][_0x18f0c7(0x1f4)],_0x90d41e=_0x19a443[_0x18f0c7(0xf4)]||'';let _0x369803=0x1;const _0x1f302b=_0x90d41e['match'](_0xccf32c[_0x18f0c7(0x235)]);if(_0x1f302b)for(const _0x11f821 of _0x1f302b){_0x11f821[_0x18f0c7(0x103)](_0xccf32c[_0x18f0c7(0x235)]);const _0xe450a0=String(RegExp['$1']),_0x3112cf=Number(RegExp['$2'])*0.01;VisuMZ[_0x18f0c7(0x120)]['matchLineCondition'](_0xe450a0)&&(_0x369803*=_0x3112cf);}return _0x369803;},VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0x29f)]=Game_BattlerBase[_0x5efcb0(0x2e2)][_0x5efcb0(0x190)],Game_BattlerBase[_0x5efcb0(0x2e2)]['meetsSkillConditions']=function(_0x4c7e6a){const _0x82763b=_0x5efcb0;let _0x1a7d53=VisuMZ[_0x82763b(0x120)]['Game_BattlerBase_meetsSkillConditions'][_0x82763b(0x2cc)](this,_0x4c7e6a);if(!_0x1a7d53)return![];if(Imported[_0x82763b(0x2a0)]){if(!VisuMZ['DateTimeSystem'][_0x82763b(0x2e6)](_0x4c7e6a))return![];}return _0x1a7d53;},VisuMZ['DateTimeSystem'][_0x5efcb0(0x2e6)]=function(_0x17b91f){const _0x405171=_0x5efcb0;if($gameMap&&$gameMap['isNotUsingTime']())return!![];if(BattleManager[_0x405171(0x1ef)]())return!![];const _0x47c5d5=VisuMZ[_0x405171(0x120)][_0x405171(0x1f4)],_0x51ba16=_0x17b91f[_0x405171(0xf4)]||'',_0x173ad9=_0x51ba16[_0x405171(0x103)](_0x47c5d5[_0x405171(0x26a)]);if(_0x173ad9)for(const _0xcfc75e of _0x173ad9){_0xcfc75e[_0x405171(0x103)](_0x47c5d5['skillRequireCond']);const _0x25b7d0=String(RegExp['$1']),_0xf39914=String(RegExp['$2']);if(!VisuMZ[_0x405171(0x120)][_0x405171(0x1bd)](_0x25b7d0,_0xf39914))return![];}return!![];},VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0x28d)]=Game_BattlerBase[_0x5efcb0(0x2e2)]['adjustSkillCost'],Game_BattlerBase[_0x5efcb0(0x2e2)][_0x5efcb0(0x157)]=function(_0x4846b4,_0x3bd337,_0x747e5b){const _0x23d172=_0x5efcb0;_0x3bd337=VisuMZ[_0x23d172(0x120)][_0x23d172(0x28d)][_0x23d172(0x2cc)](this,_0x4846b4,_0x3bd337,_0x747e5b);if(_0x3bd337<=0x0)return _0x3bd337;if(_0x4846b4&&_0x3bd337&&_0x747e5b&&typeof _0x3bd337===_0x23d172(0x198)){const _0x5172a1=VisuMZ[_0x23d172(0x120)]['CalcSkillCostChanges'](_0x4846b4,_0x747e5b);_0x3bd337=Math[_0x23d172(0x2d9)](_0x5172a1*_0x3bd337);}return _0x3bd337;},VisuMZ['DateTimeSystem'][_0x5efcb0(0x19a)]=function(_0x269e4b,_0x30af2b){const _0x10aef8=_0x5efcb0;if($gameMap&&$gameMap['isNotUsingTime']())return 0x1;if(BattleManager['isBattleTest']())return 0x1;const _0x10da93=VisuMZ[_0x10aef8(0x120)][_0x10aef8(0x1f4)],_0x16bd7e=_0x269e4b['note']||'';let _0x58b3d0=0x1;const _0x213a69=_0x16bd7e[_0x10aef8(0x103)](_0x10da93['skillCostCond']);if(_0x213a69)for(const _0x34daec of _0x213a69){_0x34daec['match'](_0x10da93['skillCostCond']);const _0x665e22=String(RegExp['$1'])[_0x10aef8(0x169)]()[_0x10aef8(0x2cd)](),_0x125446=String(RegExp['$2']),_0x577ea5=Number(RegExp['$3'])*0.01;if(_0x665e22!==_0x30af2b['Name'][_0x10aef8(0x169)]()[_0x10aef8(0x2cd)]())continue;VisuMZ[_0x10aef8(0x120)]['matchLineCondition'](_0x125446)&&(_0x58b3d0*=_0x577ea5);}return _0x58b3d0;},VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0x271)]=Game_BattlerBase[_0x5efcb0(0x2e2)][_0x5efcb0(0x11c)],Game_BattlerBase[_0x5efcb0(0x2e2)][_0x5efcb0(0x11c)]=function(_0x5a46cb){const _0x5e1839=_0x5efcb0;VisuMZ['DateTimeSystem'][_0x5e1839(0x271)][_0x5e1839(0x2cc)](this,_0x5a46cb);let _0x168757=this[_0x5e1839(0x22a)][_0x5a46cb];if(_0x5a46cb>0x0){const _0x25a885=VisuMZ[_0x5e1839(0x120)][_0x5e1839(0x24d)](_0x5a46cb);_0x168757=Math['ceil'](_0x168757+_0x25a885);}this['_stateTurns'][_0x5a46cb]=Math[_0x5e1839(0x225)](_0x168757,0x0);},VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0x24d)]=function(_0x48d91d){const _0x44764f=_0x5efcb0;if($gameMap&&$gameMap[_0x44764f(0x21c)]())return 0x0;if(BattleManager['isBattleTest']())return 0x0;const _0x2c3832=VisuMZ[_0x44764f(0x120)][_0x44764f(0x1f4)],_0x3b117d=$dataStates[_0x48d91d];if(!_0x3b117d)return 0x0;const _0x1b0b21=_0x3b117d[_0x44764f(0xf4)]||'';let _0x9f955a=0x0;const _0x4192eb=_0x1b0b21['match'](_0x2c3832[_0x44764f(0x14d)]);if(_0x4192eb)for(const _0x52aa03 of _0x4192eb){_0x52aa03[_0x44764f(0x103)](_0x2c3832['stateTurnsCond']);const _0x350d37=String(RegExp['$1']),_0x3d2be9=Number(RegExp['$2']);VisuMZ[_0x44764f(0x120)][_0x44764f(0x1fb)](_0x350d37)&&(_0x9f955a+=_0x3d2be9);}return _0x9f955a;},Game_Map[_0x5efcb0(0x1b4)]={'defaultType':VisuMZ['DateTimeSystem'][_0x5efcb0(0xfa)][_0x5efcb0(0x27f)]??_0x5efcb0(0x11d),'defaultTone':VisuMZ['DateTimeSystem'][_0x5efcb0(0xfa)][_0x5efcb0(0x2f8)]??!![],'defaultShowHud':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)]['HudSprite'][_0x5efcb0(0xa7)]??!![]},VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xcb)]=Game_Map['prototype'][_0x5efcb0(0x1db)],Game_Map['prototype']['setup']=function(_0x466010){const _0x393942=_0x5efcb0;VisuMZ[_0x393942(0x120)][_0x393942(0xcb)][_0x393942(0x2cc)](this,_0x466010),this[_0x393942(0x2b4)]();},Game_Map[_0x5efcb0(0x2e2)]['setupDateTimeNotetags']=function(){const _0x10df87=_0x5efcb0,_0x451a9e=Game_Map[_0x10df87(0x1b4)];this[_0x10df87(0x112)]=_0x451a9e[_0x10df87(0x1ee)],this[_0x10df87(0xd0)]=_0x451a9e[_0x10df87(0xfc)],this['_dateTimeHudVisible']=_0x451a9e['defaultShowHud'],this[_0x10df87(0x153)]=![];const _0x4b0933=$dataMap?$dataMap[_0x10df87(0xf4)]||'':'',_0x5931d9=VisuMZ['DateTimeSystem'][_0x10df87(0x1f4)];if(_0x4b0933['match'](_0x5931d9[_0x10df87(0x2de)]))this[_0x10df87(0x112)]=_0x10df87(0x159);else{if(_0x4b0933[_0x10df87(0x103)](_0x5931d9['GameTime']))this[_0x10df87(0x112)]='game';else _0x4b0933[_0x10df87(0x103)](_0x5931d9['RealTime'])&&(this['_dateTimeType']=_0x10df87(0x11d));}if(_0x4b0933[_0x10df87(0x103)](_0x5931d9['TimeTone']))this[_0x10df87(0xd0)]=!![];else _0x4b0933[_0x10df87(0x103)](_0x5931d9[_0x10df87(0x289)])&&(this['_usesTimeTone']=![]);_0x4b0933[_0x10df87(0x103)](_0x5931d9[_0x10df87(0x222)])&&(this[_0x10df87(0x1cb)]=![]);_0x4b0933['match'](_0x5931d9[_0x10df87(0x1e2)])&&(this['_pauseGameTime']=!![]);if(this[_0x10df87(0x118)]())TimeManager[_0x10df87(0xeb)]();else this['isRealTime']()&&TimeManager[_0x10df87(0x17d)]();Imported['VisuMZ_1_BattleCore']&&(this[_0x10df87(0x2d4)](),this[_0x10df87(0x1a7)]());if(Imported[_0x10df87(0x2e3)]){if(_0x4b0933[_0x10df87(0x103)](_0x5931d9[_0x10df87(0xbc)])){}else this[_0x10df87(0x286)]=0x0,this['processSeasonTilesetNotetags'](this[_0x10df87(0x1de)]);}},Game_Map[_0x5efcb0(0x2e2)]['getTimeType']=function(){const _0x55b3e1=_0x5efcb0;if(this[_0x55b3e1(0x112)]===undefined)this['setupDateTimeNotetags']();return this[_0x55b3e1(0x112)];},Game_Map[_0x5efcb0(0x2e2)][_0x5efcb0(0x21c)]=function(){const _0x1e8f83=_0x5efcb0;return this[_0x1e8f83(0x142)]()===_0x1e8f83(0x159);},Game_Map['prototype'][_0x5efcb0(0x118)]=function(){const _0x364b13=_0x5efcb0;return this[_0x364b13(0x142)]()===_0x364b13(0xf6);},Game_Map[_0x5efcb0(0x2e2)]['isRealTime']=function(){const _0x2afe4c=_0x5efcb0;return this[_0x2afe4c(0x142)]()===_0x2afe4c(0x11d);},Game_Map[_0x5efcb0(0x2e2)]['isUseTimeTone']=function(){const _0x3cc036=_0x5efcb0;if(Imported[_0x3cc036(0xb4)])return![];if(!$gameMap[_0x3cc036(0x118)]())return![];if(this[_0x3cc036(0xd0)]===undefined)this['setupDateTimeNotetags']();return this['_usesTimeTone'];},Game_Map[_0x5efcb0(0x2e2)][_0x5efcb0(0x14e)]=function(){const _0x2593e4=_0x5efcb0;if(this['_usesTimeTone']===undefined)this[_0x2593e4(0x2b4)]();return this[_0x2593e4(0xd0)];},Game_Map[_0x5efcb0(0x2e2)][_0x5efcb0(0x1b0)]=function(){const _0x13506c=_0x5efcb0;if(ConfigManager['dateTimeHud']===![])return![];if(!Sprite_DateTimeHUD[_0x13506c(0x303)][_0x13506c(0x28f)])return![];if(!this['_dateTimeHudVisible'])return![];return $gameSystem[_0x13506c(0x203)]();},Game_Map[_0x5efcb0(0x2e2)][_0x5efcb0(0x1df)]=function(){const _0x2eccbd=_0x5efcb0;if(this[_0x2eccbd(0x153)])return!![];return $gameSystem[_0x2eccbd(0x265)]()['paused'];},Game_Map[_0x5efcb0(0x2e2)][_0x5efcb0(0x2d4)]=function(){const _0x516f0b=_0x5efcb0,_0x4a8f5b=$dataMap?$dataMap[_0x516f0b(0xf4)]||'':'',_0x421f12=VisuMZ[_0x516f0b(0x120)]['RegExp'],_0x15ede9=TimeManager['checkSeason']();if(_0x15ede9===0x1&&_0x4a8f5b[_0x516f0b(0x103)](_0x421f12[_0x516f0b(0x1d2)]))this[_0x516f0b(0x261)]=String(RegExp['$1'])[_0x516f0b(0x2cd)]();else{if(_0x15ede9===0x2&&_0x4a8f5b[_0x516f0b(0x103)](_0x421f12[_0x516f0b(0x174)]))this[_0x516f0b(0x261)]=String(RegExp['$1'])[_0x516f0b(0x2cd)]();else{if(_0x15ede9===0x3&&_0x4a8f5b[_0x516f0b(0x103)](_0x421f12[_0x516f0b(0x1a3)]))this[_0x516f0b(0x261)]=String(RegExp['$1'])[_0x516f0b(0x2cd)]();else _0x15ede9===0x4&&_0x4a8f5b[_0x516f0b(0x103)](_0x421f12[_0x516f0b(0xef)])&&(this[_0x516f0b(0x261)]=String(RegExp['$1'])[_0x516f0b(0x2cd)]());}}if(_0x15ede9===0x1&&_0x4a8f5b[_0x516f0b(0x103)](_0x421f12[_0x516f0b(0x156)]))this[_0x516f0b(0x27a)]=String(RegExp['$1'])[_0x516f0b(0x2cd)]();else{if(_0x15ede9===0x2&&_0x4a8f5b[_0x516f0b(0x103)](_0x421f12[_0x516f0b(0x100)]))this['_battleback2Name']=String(RegExp['$1'])[_0x516f0b(0x2cd)]();else{if(_0x15ede9===0x3&&_0x4a8f5b[_0x516f0b(0x103)](_0x421f12[_0x516f0b(0xf8)]))this['_battleback2Name']=String(RegExp['$1'])[_0x516f0b(0x2cd)]();else _0x15ede9===0x4&&_0x4a8f5b[_0x516f0b(0x103)](_0x421f12[_0x516f0b(0x105)])&&(this['_battleback2Name']=String(RegExp['$1'])[_0x516f0b(0x2cd)]());}}},Game_Map[_0x5efcb0(0x2e2)][_0x5efcb0(0x1a7)]=function(){const _0x2a32a4=_0x5efcb0;if(!$dataMap)return;if($gameMap['isNotUsingTime']())return;const _0x4f2c31=$dataMap[_0x2a32a4(0xf4)];if(!_0x4f2c31)return;const _0x26091c=TimeManager[_0x2a32a4(0x18d)]();if(_0x26091c===0x0)return;const _0x337298=['none','spring',_0x2a32a4(0x2eb),_0x2a32a4(0x1fc),_0x2a32a4(0x1dd)][_0x26091c],_0x1542e2=VisuMZ[_0x2a32a4(0x120)][_0x2a32a4(0x1f4)],_0x410283=_0x1542e2[_0x2a32a4(0x301)][_0x337298],_0xecee55=_0x4f2c31[_0x2a32a4(0x103)](_0x410283);if(_0xecee55)for(const _0x427fda of _0xecee55){_0x427fda[_0x2a32a4(0x103)](_0x410283);const _0x43e856=Number(RegExp['$1']),_0x90ed9e=Number(RegExp['$2']),_0x226dc5=_0x90ed9e===0x1?this[_0x2a32a4(0x268)]:this[_0x2a32a4(0x1c0)],_0x45138a=String(RegExp['$3']);_0x226dc5[_0x43e856]=_0x45138a;}},Game_Map[_0x5efcb0(0x2e2)][_0x5efcb0(0xfd)]=function(_0x48aa9e){const _0x3b8712=_0x5efcb0;if(!this[_0x3b8712(0x1a2)]())return;if($gameMap[_0x3b8712(0x21c)]())return;this[_0x3b8712(0x286)]++;if(this[_0x3b8712(0x286)]>=0x5)return;const _0x37f779=VisuMZ[_0x3b8712(0x120)]['RegExp'],_0x1fa6a8=this[_0x3b8712(0x1a2)]()[_0x3b8712(0xf4)],_0x549a30=TimeManager[_0x3b8712(0x18d)](),_0x20134c=TimeManager[_0x3b8712(0x209)]();if(_0x549a30===0x1&&_0x1fa6a8['match'](_0x37f779[_0x3b8712(0x247)]))this[_0x3b8712(0x1de)]=Number(RegExp['$1']),this[_0x3b8712(0x2ab)]=!![];else{if(_0x549a30===0x2&&_0x1fa6a8[_0x3b8712(0x103)](_0x37f779[_0x3b8712(0x260)]))this['_tilesetId']=Number(RegExp['$1']),this[_0x3b8712(0x2ab)]=!![];else{if(_0x549a30===0x3&&_0x1fa6a8[_0x3b8712(0x103)](_0x37f779[_0x3b8712(0x171)]))this[_0x3b8712(0x1de)]=Number(RegExp['$1']),this[_0x3b8712(0x2ab)]=!![];else{if(_0x549a30===0x4&&_0x1fa6a8['match'](_0x37f779[_0x3b8712(0x20c)]))this[_0x3b8712(0x1de)]=Number(RegExp['$1']),this[_0x3b8712(0x2ab)]=!![];else{if(_0x20134c===0x1&&_0x1fa6a8[_0x3b8712(0x103)](_0x37f779[_0x3b8712(0x119)]))this['_tilesetId']=Number(RegExp['$1']),this[_0x3b8712(0x2ab)]=!![];else{if(_0x20134c===0x2&&_0x1fa6a8[_0x3b8712(0x103)](_0x37f779[_0x3b8712(0x241)]))this[_0x3b8712(0x1de)]=Number(RegExp['$1']),this['_needsRefresh']=!![];else{if(_0x20134c===0x3&&_0x1fa6a8[_0x3b8712(0x103)](_0x37f779[_0x3b8712(0x138)]))this['_tilesetId']=Number(RegExp['$1']),this['_needsRefresh']=!![];else _0x20134c===0x4&&_0x1fa6a8['match'](_0x37f779[_0x3b8712(0x245)])&&(this[_0x3b8712(0x1de)]=Number(RegExp['$1']),this[_0x3b8712(0x2ab)]=!![]);}}}}}}this['_tilesetId']!==_0x48aa9e&&this[_0x3b8712(0x20f)](this[_0x3b8712(0x1de)]);},Game_Map[_0x5efcb0(0x2e2)][_0x5efcb0(0x20f)]=function(_0x5b8e5f){const _0x142fe3=_0x5efcb0;this[_0x142fe3(0x217)](_0x5b8e5f);},VisuMZ[_0x5efcb0(0x120)]['Game_Player_meetsEncounterConditions']=Game_Player[_0x5efcb0(0x2e2)][_0x5efcb0(0x1ed)],Game_Player[_0x5efcb0(0x2e2)]['meetsEncounterConditions']=function(_0x42b416){const _0x36a297=_0x5efcb0;if(!_0x42b416)return![];let _0x29e653=VisuMZ[_0x36a297(0x120)][_0x36a297(0x266)][_0x36a297(0x2cc)](this,_0x42b416);if(!_0x29e653)return![];if(!Imported[_0x36a297(0x9a)])return _0x29e653;let _0x30226f=_0x42b416[_0x36a297(0x267)];const _0x243612=$dataTroops[_0x30226f];if(!_0x243612)return![];const _0x1e417d=DataManager[_0x36a297(0x2be)](_0x243612['id']);return this[_0x36a297(0xc4)](_0x1e417d,_0x243612['id']);},VisuMZ[_0x5efcb0(0x120)]['CheckBaseTroopID']=function(_0x42b0b4){const _0x106cb0=_0x5efcb0,_0x657812=VisuMZ[_0x106cb0(0x1b5)][_0x106cb0(0xfa)]['Mechanics'][_0x106cb0(0x1bc)];if(_0x657812['includes'](_0x42b0b4)){let _0x206aca='';_0x206aca+=_0x106cb0(0x29c)+_0x42b0b4+_0x106cb0(0xea),_0x206aca+='You\x20cannot\x20use\x20Date\x20&\x20Time\x20System\x20encounter\x20requirements\x20with\x20',_0x206aca+='a\x20troop\x20designated\x20as\x20a\x20\x22Base\x20Troop\x22.\x20',_0x206aca+=_0x106cb0(0x117),_0x206aca+=_0x106cb0(0xaf),_0x206aca+='a\x20Base\x20Troop.\x0a\x0a',_0x206aca+=_0x106cb0(0x29c)+_0x42b0b4+'!',alert(_0x206aca),SceneManager[_0x106cb0(0x1d1)]();}},Game_Player[_0x5efcb0(0x2e2)][_0x5efcb0(0xc4)]=function(_0x77a2c,_0x26bd7b){const _0x5022a2=_0x5efcb0;if($gameMap&&$gameMap[_0x5022a2(0x21c)]())return!![];const _0x205da2=VisuMZ[_0x5022a2(0x120)]['RegExp'],_0x3abe6e=_0x77a2c[_0x5022a2(0x103)](_0x205da2['troopEncounterCond']);if(_0x3abe6e)for(const _0x522ebb of _0x3abe6e){_0x522ebb[_0x5022a2(0x103)](_0x205da2['troopEncounterCond']);const _0x2f3038=String(RegExp['$1']),_0x333a7e=String(RegExp['$2']);VisuMZ[_0x5022a2(0x120)][_0x5022a2(0x9c)](_0x26bd7b);if(!VisuMZ[_0x5022a2(0x120)]['matchRangeCondition'](_0x2f3038,_0x333a7e))return![];}return!![];},VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0x224)]=Scene_Options[_0x5efcb0(0x2e2)][_0x5efcb0(0x288)],Scene_Options[_0x5efcb0(0x2e2)][_0x5efcb0(0x288)]=function(){const _0x1b70a4=_0x5efcb0;let _0x1bea29=VisuMZ[_0x1b70a4(0x120)][_0x1b70a4(0x224)][_0x1b70a4(0x2cc)](this);const _0x184920=VisuMZ[_0x1b70a4(0x120)][_0x1b70a4(0xfa)];if(_0x184920[_0x1b70a4(0x151)][_0x1b70a4(0x186)]&&_0x184920[_0x1b70a4(0x151)][_0x1b70a4(0xc0)])_0x1bea29++;return _0x1bea29;},VisuMZ['DateTimeSystem'][_0x5efcb0(0x284)]=Scene_Base['prototype'][_0x5efcb0(0x1be)],Scene_Base['prototype'][_0x5efcb0(0x1be)]=function(){const _0x2ef544=_0x5efcb0;SceneManager[_0x2ef544(0xe9)]()&&this[_0x2ef544(0x19e)](),VisuMZ[_0x2ef544(0x120)][_0x2ef544(0x284)][_0x2ef544(0x2cc)](this);},Scene_Map[_0x5efcb0(0x2e2)][_0x5efcb0(0x19e)]=function(){const _0x53b4fc=_0x5efcb0;this['_dateTimeHudSprite']=new Sprite_DateTimeHUD(),this['addChild'](this[_0x53b4fc(0x18c)]);};function _0x157d(_0x588a25,_0x38383d){const _0x311736=_0x3117();return _0x157d=function(_0x157d49,_0x4b5a06){_0x157d49=_0x157d49-0x98;let _0x680505=_0x311736[_0x157d49];return _0x680505;},_0x157d(_0x588a25,_0x38383d);}function Sprite_DateTimeHUD(){const _0x28863e=_0x5efcb0;this[_0x28863e(0x197)](...arguments);}Sprite_DateTimeHUD[_0x5efcb0(0x2e2)]=Object[_0x5efcb0(0xd3)](Sprite['prototype']),Sprite_DateTimeHUD[_0x5efcb0(0x2e2)][_0x5efcb0(0x2b6)]=Sprite_DateTimeHUD,Sprite_DateTimeHUD['SETTINGS']={'enabled':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x2c3)]??!![],'container':{'position':{'x':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x136)]??0x0,'y':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x1f8)]??0x0},'opacitySpeed':VisuMZ['DateTimeSystem'][_0x5efcb0(0xfa)][_0x5efcb0(0xad)]['OpacitySpeed']??0x10},'sprites':{'season':{'enable':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0xc3)]??!![],'anchor':{'x':VisuMZ['DateTimeSystem']['Settings']['HudSprite'][_0x5efcb0(0x1c9)]??0.5,'y':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)]['SeasonAnchorY']??0.5},'offset':{'x':VisuMZ['DateTimeSystem'][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x2a8)]??0x30,'y':VisuMZ['DateTimeSystem'][_0x5efcb0(0xfa)][_0x5efcb0(0xad)]['SeasonOffsetY']??0x30},'scale':{'x':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0xb9)]??0x3,'y':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)]['HudSprite'][_0x5efcb0(0x1fa)]??0x3},'opacity':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)]['SeasonOpacity']??0x80,'icons':{'spring':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)]['SeasonIconSpring']??0x45,'summer':VisuMZ['DateTimeSystem']['Settings'][_0x5efcb0(0xad)][_0x5efcb0(0x192)]??0x46,'autumn':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x1a1)]??0x44,'winter':VisuMZ['DateTimeSystem'][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x2fb)]??0x41},'images':{'spring':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)]['HudSprite'][_0x5efcb0(0xdf)]??'','summer':VisuMZ[_0x5efcb0(0x120)]['Settings'][_0x5efcb0(0xad)][_0x5efcb0(0x23c)]??'','autumn':VisuMZ['DateTimeSystem'][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x1e5)]??'','winter':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)]['HudSprite'][_0x5efcb0(0x150)]??''}},'daycycle':{'enable':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)]['DayCycleEnable']??!![],'anchor':{'x':VisuMZ['DateTimeSystem']['Settings'][_0x5efcb0(0xad)][_0x5efcb0(0x23b)]??0.5,'y':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)]['HudSprite']['DayCycleAnchorY']??0.5},'offset':{'x':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)]['HudSprite'][_0x5efcb0(0xa4)]??0x90,'y':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)]['HudSprite'][_0x5efcb0(0x24b)]??0x30},'scale':{'x':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)]['HudSprite'][_0x5efcb0(0x131)]??0x3,'y':VisuMZ['DateTimeSystem'][_0x5efcb0(0xfa)][_0x5efcb0(0xad)]['DayCycleScaleY']??0x3},'opacity':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)]['HudSprite'][_0x5efcb0(0x1c6)]??0x80,'icons':{'dawn':VisuMZ[_0x5efcb0(0x120)]['Settings']['HudSprite'][_0x5efcb0(0xb0)]??0x49,'day':VisuMZ[_0x5efcb0(0x120)]['Settings']['HudSprite']['DayCycleIconDay']??0x57,'dusk':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)]['DayCycleIconDusk']??0x4a,'night':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)]['HudSprite'][_0x5efcb0(0x125)]??0x58},'images':{'dawn':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x227)]??'','day':VisuMZ['DateTimeSystem'][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0xab)]??'','dusk':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x121)]??'','night':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)]['DayCycleImageNight']??''}},'weektype':{'enable':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x2bc)]??!![],'anchor':{'x':VisuMZ[_0x5efcb0(0x120)]['Settings'][_0x5efcb0(0xad)][_0x5efcb0(0xbe)]??0.5,'y':VisuMZ[_0x5efcb0(0x120)]['Settings'][_0x5efcb0(0xad)][_0x5efcb0(0x21d)]??0.5},'offset':{'x':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)]['WeekTypeOffsetX']??0xf0,'y':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x21e)]??0x30},'scale':{'x':VisuMZ['DateTimeSystem'][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0xec)]??0x3,'y':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0xc8)]??0x3},'opacity':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x15e)]??0x80,'icons':{'weekday':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x124)]??0x4b,'weekend':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x2ad)]??0x54},'images':{'weekday':VisuMZ[_0x5efcb0(0x120)]['Settings']['HudSprite'][_0x5efcb0(0x302)]??'','weekend':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0xa0)]??''}},'year':{'enable':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x264)]??!![],'angle':VisuMZ['DateTimeSystem'][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x2dc)]??0xf,'size':{'width':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)]['YearSizeWidth']??0xc8,'height':VisuMZ[_0x5efcb0(0x120)]['Settings'][_0x5efcb0(0xad)][_0x5efcb0(0x214)]??0x50},'anchor':{'x':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x210)]??0.5,'y':VisuMZ[_0x5efcb0(0x120)]['Settings']['HudSprite'][_0x5efcb0(0x1cc)]??0.5},'offset':{'x':VisuMZ[_0x5efcb0(0x120)]['Settings'][_0x5efcb0(0xad)][_0x5efcb0(0x2db)]??0x30,'y':VisuMZ[_0x5efcb0(0x120)]['Settings'][_0x5efcb0(0xad)][_0x5efcb0(0x272)]??0x1e}},'month':{'enable':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x26f)]??!![],'angle':VisuMZ['DateTimeSystem'][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x184)]??0x0,'size':{'width':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x2e0)]??0xc8,'height':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x24e)]??0x50},'anchor':{'x':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0xc2)]??0.5,'y':VisuMZ['DateTimeSystem'][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x2da)]??0.5},'offset':{'x':VisuMZ[_0x5efcb0(0x120)]['Settings']['HudSprite'][_0x5efcb0(0x23f)]??0x7d,'y':VisuMZ['DateTimeSystem'][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x16a)]??0x14}},'date':{'enable':VisuMZ['DateTimeSystem'][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x2ec)]??!![],'angle':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0xc7)]??0x0,'size':{'width':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x1b7)]??0xc8,'height':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x24f)]??0x50},'anchor':{'x':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x98)]??0.5,'y':VisuMZ[_0x5efcb0(0x120)]['Settings'][_0x5efcb0(0xad)][_0x5efcb0(0x20a)]??0.5},'offset':{'x':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x2a2)]??0xaf,'y':VisuMZ[_0x5efcb0(0x120)]['Settings']['HudSprite']['DateOffsetY']??0x14}},'weekday':{'enable':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x1b8)]??!![],'angle':VisuMZ['DateTimeSystem']['Settings'][_0x5efcb0(0xad)][_0x5efcb0(0x21b)]??-0xf,'size':{'width':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)]['HudSprite'][_0x5efcb0(0x2b8)]??0xc8,'height':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)]['WeekdaySizeHeight']??0x50},'anchor':{'x':VisuMZ[_0x5efcb0(0x120)]['Settings'][_0x5efcb0(0xad)][_0x5efcb0(0x25d)]??0.5,'y':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)]['HudSprite'][_0x5efcb0(0x132)]??0.5},'offset':{'x':VisuMZ['DateTimeSystem']['Settings'][_0x5efcb0(0xad)][_0x5efcb0(0x1f3)]??0xf0,'y':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0xa3)]??0x1e}},'time':{'enable':VisuMZ['DateTimeSystem'][_0x5efcb0(0xfa)][_0x5efcb0(0xad)]['TimeEnable']??!![],'angle':VisuMZ['DateTimeSystem'][_0x5efcb0(0xfa)][_0x5efcb0(0xad)][_0x5efcb0(0x270)]??0x0,'size':{'width':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0xad)]['TimeSizeWidth']??0xc8,'height':VisuMZ[_0x5efcb0(0x120)]['Settings']['HudSprite'][_0x5efcb0(0x133)]??0x50},'anchor':{'x':VisuMZ['DateTimeSystem']['Settings'][_0x5efcb0(0xad)][_0x5efcb0(0x162)]??0.5,'y':VisuMZ[_0x5efcb0(0x120)]['Settings']['HudSprite']['TimeAnchorY']??0.5},'offset':{'x':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)]['HudSprite']['TimeOffsetX']??0x90,'y':VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)]['HudSprite'][_0x5efcb0(0x2f2)]??0x3c}}}},Sprite_DateTimeHUD[_0x5efcb0(0x2e2)][_0x5efcb0(0x197)]=function(){const _0x3c23c4=_0x5efcb0;Sprite['prototype']['initialize'][_0x3c23c4(0x2cc)](this),this[_0x3c23c4(0x27c)](),this[_0x3c23c4(0x207)](),this[_0x3c23c4(0x29b)]();},Sprite_DateTimeHUD[_0x5efcb0(0x2e2)][_0x5efcb0(0x27c)]=function(){const _0x1fef92=_0x5efcb0,_0x446c8d=Sprite_DateTimeHUD[_0x1fef92(0x303)][_0x1fef92(0x10e)];this['x']=_0x446c8d['position']['x'],this['y']=_0x446c8d[_0x1fef92(0x1da)]['y'],!this[_0x1fef92(0xdc)]()&&(this[_0x1fef92(0x108)]=0x0);},Sprite_DateTimeHUD[_0x5efcb0(0x2e2)][_0x5efcb0(0x207)]=function(){const _0x457678=_0x5efcb0;this[_0x457678(0xc6)](_0x457678(0x134)),this[_0x457678(0xc6)](_0x457678(0x1b6)),this['createSubSprite']('weektype'),this['createSubSprite'](_0x457678(0x17a)),this['createSubSprite'](_0x457678(0x213)),this[_0x457678(0xc6)]('date'),this[_0x457678(0xc6)](_0x457678(0x2e9)),this[_0x457678(0xc6)](_0x457678(0x281));},Sprite_DateTimeHUD[_0x5efcb0(0x2e2)][_0x5efcb0(0xc6)]=function(_0x4b8497){const _0x261371=_0x5efcb0,_0x114517=Sprite_DateTimeHUD['SETTINGS']['sprites'][_0x4b8497];if(!_0x114517)return;if(!_0x114517[_0x261371(0x230)])return;const _0x164c37=new Sprite();this['addChild'](_0x164c37),_0x164c37['bitmap']=new Bitmap(_0x114517[_0x261371(0x25a)]?_0x114517['size'][_0x261371(0xd9)]||0x64:0x1,_0x114517[_0x261371(0x25a)]?_0x114517[_0x261371(0x25a)][_0x261371(0x208)]||0x64:0x1),_0x164c37[_0x261371(0x221)]['x']=_0x114517[_0x261371(0x221)]?_0x114517[_0x261371(0x221)]['x']||0x0:0x0,_0x164c37['anchor']['y']=_0x114517[_0x261371(0x221)]?_0x114517[_0x261371(0x221)]['y']||0x0:0x0,_0x164c37[_0x261371(0x239)]['x']=_0x114517[_0x261371(0x239)]?_0x114517[_0x261371(0x239)]['x']||0x1:0x1,_0x164c37[_0x261371(0x239)]['y']=_0x114517[_0x261371(0x239)]?_0x114517[_0x261371(0x239)]['y']||0x1:0x1,_0x164c37[_0x261371(0x108)]=_0x114517[_0x261371(0x108)]??0xff,_0x164c37['x']=_0x114517[_0x261371(0x15d)]?_0x114517[_0x261371(0x15d)]['x']||0x0:0x0,_0x164c37['y']=_0x114517[_0x261371(0x15d)]?_0x114517[_0x261371(0x15d)]['y']||0x0:0x0,_0x164c37['angle']=-(_0x114517['angle']||0x0);const _0x5d73cd=_0x261371(0x1f5)[_0x261371(0xac)](_0x4b8497);this[_0x5d73cd]=_0x164c37;},Sprite_DateTimeHUD['prototype'][_0x5efcb0(0x2c4)]=function(){const _0x22b9de=_0x5efcb0;Sprite[_0x22b9de(0x2e2)]['update'][_0x22b9de(0x2cc)](this),this['updateSprites'](),this[_0x22b9de(0x202)]();},Sprite_DateTimeHUD[_0x5efcb0(0x2e2)]['updateSprites']=function(){const _0x175172=_0x5efcb0;this[_0x175172(0xd8)](),this['updateDayCycleSpriteBitmap'](),this[_0x175172(0x2df)](),this['updateYearSpriteBitmap'](),this[_0x175172(0x2d7)](),this[_0x175172(0x2d2)](),this[_0x175172(0x228)](),this['updateTimeSpriteBitmap']();},VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0x1e0)]=function(_0x12fdb4,_0x2e2dac,_0x303acd){const _0x3d93c5=_0x5efcb0,_0x1085fe=Sprite_DateTimeHUD['SETTINGS'][_0x3d93c5(0x234)][_0x2e2dac];if(!_0x1085fe)return;if(_0x1085fe[_0x3d93c5(0xe1)][_0x303acd]!==''){const _0x56ab8a=_0x1085fe['images'][_0x303acd],_0x2dc22d=ImageManager['loadPicture'](_0x56ab8a);_0x2dc22d[_0x3d93c5(0x26e)](VisuMZ[_0x3d93c5(0x120)][_0x3d93c5(0x102)][_0x3d93c5(0x1f0)](this,_0x12fdb4,_0x2dc22d));}else{const _0x1abfb9=_0x1085fe[_0x3d93c5(0x23e)][_0x303acd],_0x39cef7=ImageManager[_0x3d93c5(0x2fc)](_0x3d93c5(0x26c));_0x39cef7[_0x3d93c5(0x26e)](VisuMZ['DateTimeSystem'][_0x3d93c5(0x1f6)]['bind'](this,_0x12fdb4,_0x1abfb9,_0x1085fe));}},VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0x102)]=function(_0x3c2e47,_0x2cb6c3){_0x3c2e47['bitmap']=_0x2cb6c3,_0x3c2e47['scale']['x']=0x1,_0x3c2e47['scale']['y']=0x1;},VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0x1f6)]=function(_0x504436,_0x2507f7,_0x1fc16a){const _0x130f9b=_0x5efcb0;_0x504436['bitmap']=new Bitmap(ImageManager[_0x130f9b(0x1b1)],ImageManager['iconHeight']);const _0x1ac171=ImageManager[_0x130f9b(0x2fc)]('IconSet'),_0x113a1b=_0x504436[_0x130f9b(0x9f)],_0xa4b98=ImageManager[_0x130f9b(0x1b1)],_0x1493a8=ImageManager['iconHeight'],_0x3feb1c=_0x2507f7%0x10*_0xa4b98,_0x5e2c7c=Math['floor'](_0x2507f7/0x10)*_0x1493a8;_0x113a1b[_0x130f9b(0xf5)][_0x130f9b(0x12b)]=![],_0x113a1b[_0x130f9b(0x2c2)](_0x1ac171,_0x3feb1c,_0x5e2c7c,_0xa4b98,_0x1493a8,0x0,0x0,_0xa4b98,_0x1493a8),_0x113a1b[_0x130f9b(0xf5)][_0x130f9b(0x12b)]=!![],_0x504436['scale']['x']=_0x1fc16a[_0x130f9b(0x239)]?_0x1fc16a['scale']['x']:0x1,_0x504436[_0x130f9b(0x239)]['y']=_0x1fc16a['scale']?_0x1fc16a[_0x130f9b(0x239)]['y']:0x1,_0x113a1b[_0x130f9b(0x253)]=![];},Sprite_DateTimeHUD[_0x5efcb0(0x2e2)]['forceRefresh']=function(){const _0x58e5b3=_0x5efcb0;this[_0x58e5b3(0x194)]=undefined,this[_0x58e5b3(0x262)]=undefined,this['_cache_weektype']=undefined,this[_0x58e5b3(0x237)]=undefined,this[_0x58e5b3(0x2bf)]=undefined,this[_0x58e5b3(0x26b)]=undefined,this['_cache_weekday']=undefined,this[_0x58e5b3(0x1f2)]=undefined,this[_0x58e5b3(0x11a)]=undefined,TimeManager['synchToGameTime'](),this[_0x58e5b3(0x29b)]();},Sprite_DateTimeHUD[_0x5efcb0(0x2e2)][_0x5efcb0(0xd8)]=function(){const _0x43ac35=_0x5efcb0;if(!this[_0x43ac35(0x16d)])return;if(!this[_0x43ac35(0x16d)][_0x43ac35(0x9f)])return;if(this[_0x43ac35(0x194)]===TimeManager['checkSeason']())return;this[_0x43ac35(0x194)]=TimeManager['checkSeason']();let _0x4587f3=['','spring','summer','autumn',_0x43ac35(0x1dd)][this[_0x43ac35(0x194)]];VisuMZ['DateTimeSystem'][_0x43ac35(0x1e0)]['call'](this,this[_0x43ac35(0x16d)],'season',_0x4587f3);},Sprite_DateTimeHUD[_0x5efcb0(0x2e2)][_0x5efcb0(0x2dd)]=function(){const _0x586c8b=_0x5efcb0;if(!this[_0x586c8b(0x2a4)])return;if(!this[_0x586c8b(0x2a4)][_0x586c8b(0x9f)])return;if(this[_0x586c8b(0x262)]===TimeManager[_0x586c8b(0x209)]())return;this[_0x586c8b(0x262)]=TimeManager[_0x586c8b(0x209)]();let _0x12bf53=['',_0x586c8b(0xdb),_0x586c8b(0x2b0),'dusk',_0x586c8b(0x20d)][this[_0x586c8b(0x262)]];VisuMZ[_0x586c8b(0x120)][_0x586c8b(0x1e0)][_0x586c8b(0x2cc)](this,this['_daycycleSprite'],_0x586c8b(0x1b6),_0x12bf53);},Sprite_DateTimeHUD[_0x5efcb0(0x2e2)][_0x5efcb0(0x2df)]=function(){const _0x1f8a1a=_0x5efcb0;if(!this[_0x1f8a1a(0xbf)])return;if(!this[_0x1f8a1a(0xbf)][_0x1f8a1a(0x9f)])return;if(this[_0x1f8a1a(0x20e)]===TimeManager[_0x1f8a1a(0x254)]())return;this[_0x1f8a1a(0x20e)]=TimeManager[_0x1f8a1a(0x254)]();let _0x43ae56=['',_0x1f8a1a(0x2e9),_0x1f8a1a(0x1f1)][this[_0x1f8a1a(0x20e)]];VisuMZ['DateTimeSystem'][_0x1f8a1a(0x1e0)][_0x1f8a1a(0x2cc)](this,this[_0x1f8a1a(0xbf)],'weektype',_0x43ae56);},Sprite_DateTimeHUD[_0x5efcb0(0x2e2)][_0x5efcb0(0x201)]=function(){const _0x176e50=_0x5efcb0;if(!this[_0x176e50(0x27e)])return;if(!this[_0x176e50(0x27e)]['bitmap'])return;if(this[_0x176e50(0x237)]===TimeManager[_0x176e50(0x111)]())return;this[_0x176e50(0x237)]=TimeManager['getYear'](),this['_yearSprite'][_0x176e50(0x9f)][_0x176e50(0x18a)](),VisuMZ[_0x176e50(0x120)][_0x176e50(0x24c)][_0x176e50(0x2cc)](this,this[_0x176e50(0x27e)][_0x176e50(0x9f)]);},VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0x24c)]=function(_0x4d12f7){const _0x3efb17=_0x5efcb0;VisuMZ[_0x3efb17(0x120)]['Settings'][_0x3efb17(0xad)]['Year_DrawText_JS']&&VisuMZ[_0x3efb17(0x120)][_0x3efb17(0xfa)]['HudSprite'][_0x3efb17(0x2ac)][_0x3efb17(0x2cc)](this,_0x4d12f7);},Sprite_DateTimeHUD['prototype']['updateMonthSpriteBitmap']=function(){const _0x2448c6=_0x5efcb0;if(!this['_monthSprite'])return;if(!this[_0x2448c6(0x187)][_0x2448c6(0x9f)])return;if(this[_0x2448c6(0x2bf)]===TimeManager[_0x2448c6(0x28e)]())return;this[_0x2448c6(0x2bf)]=TimeManager[_0x2448c6(0x28e)](),this[_0x2448c6(0x187)][_0x2448c6(0x9f)][_0x2448c6(0x18a)](),VisuMZ['DateTimeSystem'][_0x2448c6(0x2b5)][_0x2448c6(0x2cc)](this,this[_0x2448c6(0x187)][_0x2448c6(0x9f)]);},VisuMZ[_0x5efcb0(0x120)]['DrawHudMonth']=function(_0x25e0d5){const _0x49731d=_0x5efcb0;VisuMZ[_0x49731d(0x120)][_0x49731d(0xfa)]['HudSprite'][_0x49731d(0xe0)]&&VisuMZ[_0x49731d(0x120)]['Settings'][_0x49731d(0xad)][_0x49731d(0xe0)][_0x49731d(0x2cc)](this,_0x25e0d5);},Sprite_DateTimeHUD[_0x5efcb0(0x2e2)][_0x5efcb0(0x2d2)]=function(){const _0xed189e=_0x5efcb0;if(!this['_dateSprite'])return;if(!this[_0xed189e(0x12f)][_0xed189e(0x9f)])return;if(this[_0xed189e(0x26b)]===TimeManager[_0xed189e(0x280)]())return;this['_cache_date']=TimeManager[_0xed189e(0x280)](),this[_0xed189e(0x12f)]['bitmap'][_0xed189e(0x18a)](),VisuMZ[_0xed189e(0x120)]['DrawHudDate'][_0xed189e(0x2cc)](this,this[_0xed189e(0x12f)]['bitmap']);},VisuMZ[_0x5efcb0(0x120)]['DrawHudDate']=function(_0x56a3db){const _0x47a24c=_0x5efcb0;VisuMZ[_0x47a24c(0x120)][_0x47a24c(0xfa)][_0x47a24c(0xad)][_0x47a24c(0x2a6)]&&VisuMZ[_0x47a24c(0x120)]['Settings'][_0x47a24c(0xad)]['Date_DrawText_JS']['call'](this,_0x56a3db);},Sprite_DateTimeHUD[_0x5efcb0(0x2e2)][_0x5efcb0(0x228)]=function(){const _0xa050fc=_0x5efcb0;if(!this[_0xa050fc(0x206)])return;if(!this[_0xa050fc(0x206)][_0xa050fc(0x9f)])return;if(this['_cache_weekday']===TimeManager[_0xa050fc(0x9d)]())return;this[_0xa050fc(0xd1)]=TimeManager['getWeekday'](),this['_weekdaySprite'][_0xa050fc(0x9f)]['clear'](),VisuMZ[_0xa050fc(0x120)][_0xa050fc(0x2d8)][_0xa050fc(0x2cc)](this,this[_0xa050fc(0x206)]['bitmap']);},VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0x2d8)]=function(_0x384980){const _0x3231c0=_0x5efcb0;VisuMZ['DateTimeSystem'][_0x3231c0(0xfa)][_0x3231c0(0xad)][_0x3231c0(0x2fd)]&&VisuMZ[_0x3231c0(0x120)][_0x3231c0(0xfa)][_0x3231c0(0xad)][_0x3231c0(0x2fd)]['call'](this,_0x384980);},Sprite_DateTimeHUD[_0x5efcb0(0x2e2)][_0x5efcb0(0x107)]=function(){const _0x48dd45=_0x5efcb0;if(!this['_timeSprite'])return;if(!this[_0x48dd45(0x244)]['bitmap'])return;if(this['_cache_hour']===TimeManager[_0x48dd45(0x295)]()&&this[_0x48dd45(0x11a)]===TimeManager[_0x48dd45(0x2d6)]())return;this[_0x48dd45(0x1f2)]=TimeManager[_0x48dd45(0x295)](),this['_cache_minute']=TimeManager[_0x48dd45(0x2d6)](),this[_0x48dd45(0x244)][_0x48dd45(0x9f)][_0x48dd45(0x18a)](),VisuMZ[_0x48dd45(0x120)][_0x48dd45(0x22b)][_0x48dd45(0x2cc)](this,this[_0x48dd45(0x244)][_0x48dd45(0x9f)]);},VisuMZ[_0x5efcb0(0x120)]['DrawHudTime']=function(_0x3e083b){const _0x1497bd=_0x5efcb0;VisuMZ[_0x1497bd(0x120)][_0x1497bd(0xfa)][_0x1497bd(0xad)][_0x1497bd(0x2f5)]&&VisuMZ[_0x1497bd(0x120)][_0x1497bd(0xfa)][_0x1497bd(0xad)]['Time_DrawText_JS']['call'](this,_0x3e083b);},Sprite_DateTimeHUD[_0x5efcb0(0x2e2)][_0x5efcb0(0x202)]=function(){const _0x143d74=_0x5efcb0,_0x52b98e=this[_0x143d74(0xdc)](),_0xb75ff8=Sprite_DateTimeHUD['SETTINGS'][_0x143d74(0x10e)][_0x143d74(0x179)]||0x10;this[_0x143d74(0x108)]+=_0x52b98e?_0xb75ff8:-_0xb75ff8;},Sprite_DateTimeHUD[_0x5efcb0(0x2e2)][_0x5efcb0(0xdc)]=function(){return $gameMap&&$gameMap['isDateTimeHudVisible']();},VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xc9)]=Spriteset_Base['prototype'][_0x5efcb0(0xb3)],Spriteset_Base[_0x5efcb0(0x2e2)][_0x5efcb0(0xb3)]=function(){const _0x27eb63=_0x5efcb0;VisuMZ['DateTimeSystem'][_0x27eb63(0xc9)]['call'](this),$gameMap&&$gameMap[_0x27eb63(0x11b)]()&&!this['_timeToneFilter']&&this[_0x27eb63(0x158)]();},VisuMZ['DateTimeSystem'][_0x5efcb0(0x278)]=Spriteset_Base[_0x5efcb0(0x2e2)][_0x5efcb0(0x172)],Spriteset_Base[_0x5efcb0(0x2e2)]['updateBaseFilters']=function(){const _0x311cf1=_0x5efcb0;VisuMZ[_0x311cf1(0x120)][_0x311cf1(0x278)][_0x311cf1(0x2cc)](this),$gameMap&&$gameMap[_0x311cf1(0x11b)]()&&this[_0x311cf1(0x2cb)]&&this[_0x311cf1(0x29e)]();},Spriteset_Base[_0x5efcb0(0x2e2)]['createTimeToneFilter']=function(){const _0x3a9e63=_0x5efcb0;this[_0x3a9e63(0x2cb)]=new ColorFilter(),this[_0x3a9e63(0x273)]['filters'][_0x3a9e63(0x2a1)](this['_timeToneFilter']);},Spriteset_Base[_0x5efcb0(0x2e2)][_0x5efcb0(0x29e)]=function(){const _0x403c13=_0x5efcb0,_0x1ba98b=$gameScreen[_0x403c13(0x294)]();this['_timeToneFilter'][_0x403c13(0x250)]([_0x1ba98b[0x0],_0x1ba98b[0x1],_0x1ba98b[0x2],_0x1ba98b[0x3]]);},VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0x287)]=Window_Base[_0x5efcb0(0x2e2)]['preConvertEscapeCharacters'],Window_Base[_0x5efcb0(0x2e2)][_0x5efcb0(0xee)]=function(_0x41213a){const _0x30f03f=_0x5efcb0;return _0x41213a=VisuMZ['DateTimeSystem']['Window_Base_preConvertEscapeCharacters']['call'](this,_0x41213a),_0x41213a=this[_0x30f03f(0x263)](_0x41213a),_0x41213a;},Window_Base['prototype'][_0x5efcb0(0x263)]=function(_0x3547f0){return _0x3547f0=this['convertDateTimeGameEscapeCodes'](_0x3547f0),_0x3547f0=this['convertDateTimeRealEscapeCodes'](_0x3547f0),_0x3547f0;},Window_Base[_0x5efcb0(0x2e2)][_0x5efcb0(0x200)]=function(_0xe847b4){const _0x3fad82=_0x5efcb0;if(!_0xe847b4)return _0xe847b4;return _0xe847b4=_0xe847b4[_0x3fad82(0x275)](/<GameYearP>/gi,(_0x1741c1,_0x15523b)=>TextManager[_0x3fad82(0x2f6)](!![])),_0xe847b4=_0xe847b4['replace'](/<GameYear>/gi,(_0x1e1cf1,_0x8f8634)=>TextManager['gameTimeYear'](![])),_0xe847b4=_0xe847b4['replace'](/<GameMonthA>/gi,(_0x109cca,_0x4234c1)=>TextManager[_0x3fad82(0x135)]('abbr')),_0xe847b4=_0xe847b4['replace'](/<GameMonthN>/gi,(_0x4ca9f4,_0x2c8323)=>TextManager[_0x3fad82(0x135)]('number')),_0xe847b4=_0xe847b4[_0x3fad82(0x275)](/<GameMonthP>/gi,(_0x5a0d33,_0x50a943)=>TextManager['gameTimeMonth']('pad')),_0xe847b4=_0xe847b4['replace'](/<GameMonth>/gi,(_0x5edc2f,_0x191108)=>TextManager[_0x3fad82(0x135)]('full')),_0xe847b4=_0xe847b4[_0x3fad82(0x275)](/<GameSeason>/gi,(_0x2af916,_0x562b56)=>TextManager[_0x3fad82(0x15c)]()),_0xe847b4=_0xe847b4['replace'](/<GameDateP>/gi,(_0x17b2f5,_0x5e5c0b)=>TextManager[_0x3fad82(0x2f3)](!![])),_0xe847b4=_0xe847b4[_0x3fad82(0x275)](/<GameDate>/gi,(_0x188142,_0xfcc555)=>TextManager[_0x3fad82(0x2f3)](![])),_0xe847b4=_0xe847b4['replace'](/<GameWeekdayA>/gi,(_0x258745,_0x55fcc9)=>TextManager[_0x3fad82(0x1f7)](!![])),_0xe847b4=_0xe847b4[_0x3fad82(0x275)](/<GameWeekday>/gi,(_0xdcf78,_0x151e3c)=>TextManager[_0x3fad82(0x1f7)](![])),_0xe847b4=_0xe847b4['replace'](/<GameWeekdayT>/gi,(_0x565481,_0x5b156b)=>TextManager[_0x3fad82(0xde)]()),_0xe847b4=_0xe847b4['replace'](/<GameHourP>/gi,(_0x5ccb00,_0x51bd68)=>TextManager[_0x3fad82(0xa1)]('pad')),_0xe847b4=_0xe847b4[_0x3fad82(0x275)](/<GameHourMP>/gi,(_0x2ed98f,_0x7975c6)=>TextManager[_0x3fad82(0xa1)](_0x3fad82(0x122))),_0xe847b4=_0xe847b4[_0x3fad82(0x275)](/<GameHourM>/gi,(_0x3d331e,_0x42085c)=>TextManager[_0x3fad82(0xa1)](_0x3fad82(0x12a))),_0xe847b4=_0xe847b4['replace'](/<GameHour>/gi,(_0x2cef04,_0x40b839)=>TextManager['gameTimeHour'](_0x3fad82(0x2b9))),_0xe847b4=_0xe847b4[_0x3fad82(0x275)](/<GameMinuteP>/gi,(_0x501282,_0x8e9ac7)=>TextManager['gameTimeMinute'](!![])),_0xe847b4=_0xe847b4[_0x3fad82(0x275)](/<GameMinute>/gi,(_0x42b4f9,_0x244e08)=>TextManager[_0x3fad82(0x1c3)](![])),_0xe847b4=_0xe847b4['replace'](/<GameSecondP>/gi,(_0x238a61,_0x575ac8)=>TextManager[_0x3fad82(0xe2)](!![])),_0xe847b4=_0xe847b4[_0x3fad82(0x275)](/<GameSecond>/gi,(_0x400c19,_0x11138c)=>TextManager['gameTimeSecond'](![])),_0xe847b4=_0xe847b4['replace'](/<GameMeridiem>/gi,(_0x4ee4c4,_0x5cfc85)=>TextManager[_0x3fad82(0x154)]()),_0xe847b4=_0xe847b4[_0x3fad82(0x275)](/<GameDayCycle>/gi,(_0xd3a874,_0x540072)=>TextManager[_0x3fad82(0x2a7)]()),_0xe847b4;},Window_Base[_0x5efcb0(0x2e2)]['convertDateTimeRealEscapeCodes']=function(_0x51f895){const _0xd9b46b=_0x5efcb0;if(!_0x51f895)return _0x51f895;return _0x51f895=_0x51f895[_0xd9b46b(0x275)](/<RealYearP>/gi,(_0x2c119e,_0x2539f2)=>TextManager[_0xd9b46b(0x220)](!![])),_0x51f895=_0x51f895[_0xd9b46b(0x275)](/<RealYear>/gi,(_0xf6d91c,_0xc6644d)=>TextManager[_0xd9b46b(0x220)](![])),_0x51f895=_0x51f895[_0xd9b46b(0x275)](/<RealMonthA>/gi,(_0x3102b6,_0x12e959)=>TextManager[_0xd9b46b(0x180)](_0xd9b46b(0x188))),_0x51f895=_0x51f895[_0xd9b46b(0x275)](/<RealMonthN>/gi,(_0x1c6863,_0x18f1e9)=>TextManager[_0xd9b46b(0x180)](_0xd9b46b(0x198))),_0x51f895=_0x51f895[_0xd9b46b(0x275)](/<RealMonthP>/gi,(_0x406bcf,_0x429007)=>TextManager[_0xd9b46b(0x180)](_0xd9b46b(0x1ae))),_0x51f895=_0x51f895[_0xd9b46b(0x275)](/<RealMonth>/gi,(_0x4a810f,_0x44d529)=>TextManager[_0xd9b46b(0x180)](_0xd9b46b(0xe4))),_0x51f895=_0x51f895[_0xd9b46b(0x275)](/<RealSeason>/gi,(_0x274315,_0x5cb09c)=>TextManager[_0xd9b46b(0x16b)]()),_0x51f895=_0x51f895[_0xd9b46b(0x275)](/<RealDateP>/gi,(_0x538a6f,_0x5dd020)=>TextManager['realTimeDate'](!![])),_0x51f895=_0x51f895[_0xd9b46b(0x275)](/<RealDate>/gi,(_0x37f69e,_0x30d86a)=>TextManager[_0xd9b46b(0x165)](![])),_0x51f895=_0x51f895['replace'](/<RealWeekdayA>/gi,(_0x2697f9,_0x3fe9f2)=>TextManager['realTimeWeekDay'](!![])),_0x51f895=_0x51f895[_0xd9b46b(0x275)](/<RealWeekday>/gi,(_0x386114,_0x22ac6d)=>TextManager['realTimeWeekDay'](![])),_0x51f895=_0x51f895[_0xd9b46b(0x275)](/<RealWeekdayT>/gi,(_0x44f7a3,_0x25a75b)=>TextManager[_0xd9b46b(0x296)]()),_0x51f895=_0x51f895[_0xd9b46b(0x275)](/<RealHourP>/gi,(_0x5907a5,_0x2ed8d8)=>TextManager['realTimeHour'](_0xd9b46b(0x1ae))),_0x51f895=_0x51f895[_0xd9b46b(0x275)](/<RealHourMP>/gi,(_0xed0691,_0x52373b)=>TextManager['realTimeHour'](_0xd9b46b(0x122))),_0x51f895=_0x51f895[_0xd9b46b(0x275)](/<RealHourM>/gi,(_0xcdcd12,_0x45921f)=>TextManager[_0xd9b46b(0x161)]('military')),_0x51f895=_0x51f895[_0xd9b46b(0x275)](/<RealHour>/gi,(_0x36fe0e,_0x19ae76)=>TextManager[_0xd9b46b(0x161)](_0xd9b46b(0x2b9))),_0x51f895=_0x51f895[_0xd9b46b(0x275)](/<RealMinuteP>/gi,(_0x3c205d,_0x829d2)=>TextManager[_0xd9b46b(0x175)](!![])),_0x51f895=_0x51f895[_0xd9b46b(0x275)](/<RealMinute>/gi,(_0x1bce39,_0x3d1dfa)=>TextManager[_0xd9b46b(0x175)](![])),_0x51f895=_0x51f895[_0xd9b46b(0x275)](/<RealSecondP>/gi,(_0x3e438c,_0x418e12)=>TextManager[_0xd9b46b(0x243)](!![])),_0x51f895=_0x51f895['replace'](/<RealSecond>/gi,(_0x29d07c,_0x53c096)=>TextManager['realTimeSecond'](![])),_0x51f895=_0x51f895[_0xd9b46b(0x275)](/<RealMeridiem>/gi,(_0x1b2a8d,_0xa7dadf)=>TextManager['realTimeMeridiem']()),_0x51f895=_0x51f895[_0xd9b46b(0x275)](/<RealDayCycle>/gi,(_0x17aa76,_0x209bd9)=>TextManager[_0xd9b46b(0xbb)]()),_0x51f895;},TextManager[_0x5efcb0(0x17b)]=VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0xfa)][_0x5efcb0(0x151)]['Name']??'Show\x20Date\x20&\x20Time',VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0x1eb)]=Window_Options['prototype'][_0x5efcb0(0x2e4)],Window_Options[_0x5efcb0(0x2e2)]['addGeneralOptions']=function(){const _0x2689b3=_0x5efcb0;VisuMZ[_0x2689b3(0x120)][_0x2689b3(0x1eb)][_0x2689b3(0x2cc)](this),this['addDateTimeSystemCommands']();},Window_Options[_0x5efcb0(0x2e2)][_0x5efcb0(0x123)]=function(){const _0x55c11d=_0x5efcb0;VisuMZ['DateTimeSystem'][_0x55c11d(0xfa)][_0x55c11d(0x151)][_0x55c11d(0x186)]&&this[_0x55c11d(0x15f)]();},Window_Options[_0x5efcb0(0x2e2)][_0x5efcb0(0x15f)]=function(){const _0x214453=_0x5efcb0,_0x34bb72=TextManager[_0x214453(0x17b)],_0x25c05f=_0x214453(0x17b);this[_0x214453(0x2a5)](_0x34bb72,_0x25c05f);},VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0x229)]=Window_ShopBuy[_0x5efcb0(0x2e2)][_0x5efcb0(0x2a3)],Window_ShopBuy[_0x5efcb0(0x2e2)]['goodsToItem']=function(_0x34a3a7){const _0x19f389=_0x5efcb0;let _0x55d419=VisuMZ['DateTimeSystem'][_0x19f389(0x229)][_0x19f389(0x2cc)](this,_0x34a3a7);if(_0x55d419&&Imported['VisuMZ_1_ItemsEquipsCore']){if(!VisuMZ[_0x19f389(0x120)]['CheckGoodsAvailableToBuy'](_0x55d419))return null;}return _0x55d419;},VisuMZ[_0x5efcb0(0x120)]['CheckGoodsAvailableToBuy']=function(_0x12dc65){const _0xaf84cb=_0x5efcb0;if($gameMap&&$gameMap['isNotUsingTime']())return!![];const _0x275762=VisuMZ[_0xaf84cb(0x120)]['RegExp'],_0xf4c160=_0x12dc65[_0xaf84cb(0xf4)]||'',_0x1d05ea=_0xf4c160[_0xaf84cb(0x103)](_0x275762[_0xaf84cb(0x2d3)]);if(_0x1d05ea)for(const _0x4a3a58 of _0x1d05ea){_0x4a3a58[_0xaf84cb(0x103)](_0x275762[_0xaf84cb(0x2d3)]);const _0xed35b0=String(RegExp['$1']),_0x394a02=String(RegExp['$2']);if(!VisuMZ['DateTimeSystem'][_0xaf84cb(0x1bd)](_0xed35b0,_0x394a02))return![];}return!![];},VisuMZ['DateTimeSystem'][_0x5efcb0(0x2bd)]=Window_ShopBuy[_0x5efcb0(0x2e2)][_0x5efcb0(0x140)],Window_ShopBuy[_0x5efcb0(0x2e2)][_0x5efcb0(0x140)]=function(_0x49df38){const _0x5a640c=_0x5efcb0;let _0x47a13c=VisuMZ[_0x5a640c(0x120)][_0x5a640c(0x2bd)][_0x5a640c(0x2cc)](this,_0x49df38);if(_0x49df38&&_0x47a13c!==0x0&&Imported[_0x5a640c(0x21f)]){const _0x29054b=VisuMZ[_0x5a640c(0x120)][_0x5a640c(0x1a0)](_0x49df38);_0x47a13c=Math[_0x5a640c(0x2d9)](_0x29054b*_0x47a13c);}return _0x47a13c;},VisuMZ[_0x5efcb0(0x120)][_0x5efcb0(0x1a0)]=function(_0x1bb95d){const _0x2a177b=_0x5efcb0;if($gameMap&&$gameMap['isNotUsingTime']())return 0x1;const _0x3e5cd8=VisuMZ['DateTimeSystem'][_0x2a177b(0x1f4)],_0x3b4edb=_0x1bb95d[_0x2a177b(0xf4)]||'';let _0x23ee6e=0x1;const _0x14a4eb=_0x3b4edb[_0x2a177b(0x103)](_0x3e5cd8[_0x2a177b(0x22f)]);if(_0x14a4eb)for(const _0x37666d of _0x14a4eb){_0x37666d[_0x2a177b(0x103)](_0x3e5cd8[_0x2a177b(0x22f)]);const _0x50f474=String(RegExp['$1']),_0x188738=Number(RegExp['$2'])*0.01;VisuMZ[_0x2a177b(0x120)][_0x2a177b(0x1fb)](_0x50f474)&&(_0x23ee6e*=_0x188738);}return _0x23ee6e;},VisuMZ['DateTimeSystem'][_0x5efcb0(0x1bd)]=function(_0x255472,_0x15b152){const _0x51fff2=_0x5efcb0;if(_0x255472[_0x51fff2(0x103)](/HOUR(?:|S)/i)){const _0x2357f5=String(_0x15b152)['split'](',')['map'](_0x4ff4eb=>Number(_0x4ff4eb));if(!_0x2357f5[_0x51fff2(0x274)](TimeManager[_0x51fff2(0x295)]()))return![];}if(_0x255472[_0x51fff2(0x103)](/WEEKDAY(?:|S)/i)){const _0x367568=String(_0x15b152)[_0x51fff2(0x2aa)](',')[_0x51fff2(0x170)](_0x37baa1=>Number(_0x37baa1));if(!_0x367568[_0x51fff2(0x274)](TimeManager['getWeekday']()))return![];}if(_0x255472['match'](/DATE(?:|S)/i)){const _0xb4b40a=String(_0x15b152)[_0x51fff2(0x2aa)](',')[_0x51fff2(0x170)](_0x434f0b=>Number(_0x434f0b));if(!_0xb4b40a[_0x51fff2(0x274)](TimeManager[_0x51fff2(0x280)]()))return![];}if(_0x255472[_0x51fff2(0x103)](/MONTH(?:|S)/i)){const _0x4044df=String(_0x15b152)[_0x51fff2(0x2aa)](',')[_0x51fff2(0x170)](_0x3b645c=>Number(_0x3b645c));if(!_0x4044df[_0x51fff2(0x274)](TimeManager[_0x51fff2(0x28e)]()))return![];}if(_0x255472[_0x51fff2(0x103)](/SEASON(?:|S)/i)){const _0x3428ce=String(_0x15b152)[_0x51fff2(0x2aa)](',')[_0x51fff2(0x170)](_0xd35ea9=>_0xd35ea9[_0x51fff2(0x1d7)]()[_0x51fff2(0x2cd)]()),_0x3156a8=TimeManager['checkSeason']();if(_0x3156a8===0x1&&!_0x3428ce['includes'](_0x51fff2(0x292)))return![];if(_0x3156a8===0x2&&!_0x3428ce[_0x51fff2(0x274)](_0x51fff2(0x2eb)))return![];if(_0x3156a8===0x3&&!_0x3428ce[_0x51fff2(0x274)](_0x51fff2(0x1fc)))return![];if(_0x3156a8===0x4&&!_0x3428ce[_0x51fff2(0x274)](_0x51fff2(0x1dd)))return![];}if(_0x255472[_0x51fff2(0x103)](/CYCLE(?:|S)/i)){const _0x5e84b3=String(_0x15b152)[_0x51fff2(0x2aa)](',')[_0x51fff2(0x170)](_0x33ca8a=>_0x33ca8a['toLowerCase']()[_0x51fff2(0x2cd)]()),_0x3e1239=TimeManager[_0x51fff2(0x209)]();if(_0x3e1239===0x1&&!_0x5e84b3[_0x51fff2(0x274)](_0x51fff2(0xdb)))return![];if(_0x3e1239===0x2&&!_0x5e84b3[_0x51fff2(0x274)]('day'))return![];if(_0x3e1239===0x3&&!_0x5e84b3[_0x51fff2(0x274)]('dusk'))return![];if(_0x3e1239===0x4&&!_0x5e84b3[_0x51fff2(0x274)](_0x51fff2(0x20d)))return![];}return!![];},VisuMZ['DateTimeSystem'][_0x5efcb0(0x1fb)]=function(_0x22533f){const _0x1b8ed8=_0x5efcb0;if(_0x22533f[_0x1b8ed8(0x103)](/SPRING MONTHS/i))return TimeManager['checkSeason']()===0x1;if(_0x22533f[_0x1b8ed8(0x103)](/SUMMER MONTHS/i))return TimeManager[_0x1b8ed8(0x18d)]()===0x2;if(_0x22533f['match'](/AUTUMN MONTHS/i))return TimeManager['checkSeason']()===0x3;if(_0x22533f[_0x1b8ed8(0x103)](/WINTER MONTHS/i))return TimeManager[_0x1b8ed8(0x18d)]()===0x4;if(_0x22533f[_0x1b8ed8(0x103)](/WEEKDAYS ONLY/i))return TimeManager[_0x1b8ed8(0x254)]()===0x1;if(_0x22533f[_0x1b8ed8(0x103)](/WEEKENDS ONLY/i))return TimeManager[_0x1b8ed8(0x254)]()===0x2;if(_0x22533f[_0x1b8ed8(0x103)](/DAWN HOURS/i))return TimeManager[_0x1b8ed8(0x209)]()===0x1;if(_0x22533f[_0x1b8ed8(0x103)](/DAY HOURS/i))return TimeManager[_0x1b8ed8(0x209)]()===0x2;if(_0x22533f[_0x1b8ed8(0x103)](/DUSK HOURS/i))return TimeManager['checkDayCycle']()===0x3;if(_0x22533f[_0x1b8ed8(0x103)](/NIGHT HOURS/i))return TimeManager['checkDayCycle']()===0x4;if(_0x22533f[_0x1b8ed8(0x103)](/HOUR(?:|S)[ ](.*)/i)){const _0x40b109=String(RegExp['$1'])[_0x1b8ed8(0x2aa)](',')[_0x1b8ed8(0x170)](_0x203d99=>Number(_0x203d99));return _0x40b109[_0x1b8ed8(0x274)](TimeManager[_0x1b8ed8(0x295)]());}if(_0x22533f[_0x1b8ed8(0x103)](/WEEKDAY(?:|S)[ ](.*)/i)){const _0x5e23de=String(RegExp['$1'])[_0x1b8ed8(0x2aa)](',')['map'](_0x2d6b99=>Number(_0x2d6b99));return _0x5e23de['includes'](TimeManager[_0x1b8ed8(0x9d)]());}if(_0x22533f['match'](/DATE(?:|S)[ ](.*)/i)){const _0xe39e8e=String(RegExp['$1'])[_0x1b8ed8(0x2aa)](',')[_0x1b8ed8(0x170)](_0x34b7eb=>Number(_0x34b7eb));return _0xe39e8e[_0x1b8ed8(0x274)](TimeManager['getDate']());}if(_0x22533f[_0x1b8ed8(0x103)](/MONTH(?:|S)[ ](.*)/i)){const _0x571987=String(RegExp['$1'])[_0x1b8ed8(0x2aa)](',')[_0x1b8ed8(0x170)](_0x19548b=>Number(_0x19548b));return _0x571987['includes'](TimeManager[_0x1b8ed8(0x28e)]());}return![];};