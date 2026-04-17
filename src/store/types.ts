export type Scene =
  | 'menu'
  | 'proberaum'
  | 'tourbus'
  | 'backstage'
  | 'void_station'
  | 'kaminstube'
  | 'salzgitter';

/**
 * Status of a quest in the player's log.
 */
export type QuestStatus = 'active' | 'completed' | 'failed';

export type Quest = { id: string; text: string; status: QuestStatus };

/**
 * All known boolean game flags. Using a union type here gives autocomplete
 * and catches typos at compile time when calling setFlag().
 */
export type Flag =
  | 'waterCleaned'
  | 'ampRepaired'
  | 'cableFixed'
  | 'setlistFound'
  | 'mariusCalmed'
  | 'larsEnergized'
  | 'voidRefueled'
  | 'talkingAmpHeard'
  | 'talkingAmpRepaired'
  | 'forbiddenRiffFound'
  | 'egoContained'
  | 'matzeDeepTalk'
  | 'showedRiffToMatze'
  | 'ghostSecretRevealed'
  | 'tankwartPhilosophy'
  | 'tankwartMysticDone'
  | 'wirtSecretItem'
  | 'tankwartReactedToRiff'
  | 'larsDrumPhilosophy'
  | 'mariusConfidenceBoost'
  | 'askedAbout1982'
  | 'askedAbout1982Attempted'
  | 'larsVibrating'
  | 'drumMachineQuestStarted'
  | 'drumMachineQuestCompleted'
  | 'kaminstubeDrumLoreHeard'
  | 'egoTalked'
  | 'feedbackMonitorTalked'
  | 'feedbackMonitorQuestCompleted'
  | 'feedbackMonitorBackstageTalked'
  | 'feedbackMonitorBackstageQuestStarted'
  | 'feedbackMonitorBackstageQuestCompleted'
  | 'feedbackMonitorQuestStarted'
  | 'ghostRecipeQuestStarted'
  | 'ghostRecipeQuestCompleted'
  | 'ampTherapyStarted'
  | 'ampTherapyCompleted'
  | 'cosmic_echo'
  | 'forgotten_lore'
  | 'posterLoreRead'
  | 'proberaumPosterVisionary'
  | 'tourbusAmpTechnician'
  | 'magnetbandPlayed'
  | 'frequenzDetektorRead'
  | 'frequenzCalibrated'
  | 'inschriftDecoded'
  | 'legacyLoreMigrated'
  | 'frequenz1982_proberaum'
  | 'frequenz1982_tourbus'
  | 'frequenz1982_backstage'
  | 'frequenz1982_complete'
  | 'matzeCynicOneShot'
  | 'bassist_clue_matze'
  | 'bassist_clue_ghost'
  | 'bassist_clue_wirt'
  | 'bassist_contacted'
  | 'bassist_restored'
  | 'maschinen_seele_amp'
  | 'maschinen_seele_tr8080'
  | 'maschinen_seele_complete'
  | 'salzgitter_lars_paced_talked'
  | 'kaminstube_lars_talked'
  | 'salzgitter_performer_talked'
  | 'salzgitter_fan_speech_heard'
  | 'tankwart_fuel_quest_started'
  | 'proberaum_brutalist_smash'
  | 'tourbus_sabotage_discovered'
  | 'tourbus_matze_confession'
  | 'backstage_blueprint_found'
  | 'backstage_performer_speech'
  | 'backstage_cynic_sabotage'
  | 'void_diplomat_negotiation'
  | 'kaminstube_crowd_rallied'
  | 'kaminstube_wirt_betrayal'
  | 'salzgitter_encore_unlocked'
  | 'salzgitter_true_ending'
  | 'salzgitter_finalized'
  | 'salzgitter_marius_greeted'
  | 'lars_proberaum_secret'
  | 'lars_paced'
  | 'marius_tourbus_doubt'
  | 'gaveDiplomatSouvenir'
  | 'matzeRiffWarning'
  | 'larsRhythmPact'
  | 'gaveBeerToLars'
  | 'gaveBeerToMarius'
  | 'mariusSelfDoubtRevealed'
  | 'mariusEgoComplimented'
  | 'mariusVisionShared'
  | 'mariusCalmedDown'
  | 'tourbusCoffeeCollected'
  | 'tourbusEnergyDrinkCollected'
  | 'tourbusBeerCollected'
  | 'mariusEgoStrategy'
  | 'ampSentient'
  | 'ghostTrustEarned'
  | 'tourbusBandMeeting'
  | 'backstageRitualPerformed'
  | 'voidBassistSpoken'
  | 'tankwartBargain'
  | 'wirtLegacy1982'
  | 'kaminFeuerPact'
  | 'salzgitterBandUnited'
  | 'fanMovement'
  | 'larsRhythmPactClaimed'
  | 'matzeRiffDialogueDone'
  | 'matzePerformerTalk'
  | 'salzgitterMatzeWirtDone'
  | 'salzgitterMatzeDeepTalkDone'
  | 'rostigesPlektrumCollected'
  | 'tourbusHiddenStashTaken'
  | 'voidBassistMoodGiven'
  | 'tourbusGhostRiffUsed'
  | 'ghostAskedSurvive'
  | 'ghostAskedBeer'
  | 'ghostAskedWho'
  | 'backstageForbiddenRiffUsed'
  | 'voidTerminalRead'
  | 'voidCosmicEchoRewarded'
  | 'voidBassistRewarded'
  | 'marius_tourbus_performer_claimed'
  | 'salzgitter_marius_chaos_claimed'
  | 'salzgitter_marius_social_claimed'
  | 'salzgitter_marius_performer_claimed'
  | 'salzgitter_lars_technical_claimed'
  | 'backstage_marius_diplomat_claimed'
  | 'backstage_lars_technician_claimed'
  | 'lars_drum_maintenance';

/**
 * Defines the possible personality traits a player can select.
 * Traits influence dialogue options and interactions.
 */
export type Trait =
  | 'Visionary'
  | 'Technician'
  | 'Brutalist'
  | 'Diplomat'
  | 'Mystic'
  | 'Performer'
  | 'Cynic';

/**
 * Represents the player's current skill levels.
 * @property technical - Level of technical aptitude (e.g., repairing, programming).
 * @property social - Level of social influence (e.g., charisma, persuasion).
 * @property chaos - Level of unpredictability (e.g., breaking things).
 */
export interface Skills {
  technical: number;
  social: number;
  chaos: number;
}

/**
 * Represents a lore entry discovered by the player in the game world.
 * @property id - The unique identifier for the lore entry.
 * @property title - The title displayed in the lore menu.
 * @property content - The main text content of the lore entry.
 * @property discovered - Whether the player has found this lore entry yet.
 */
export interface LoreEntry {
  id: string;
  title: string;
  content: string;
  discovered: boolean;
}

/**
 * Represents an option presented to the player during dialogue.
 * @property text - The text displayed for the option.
 * @property action - An optional callback function to execute when selected.
 * @property nextDialogue - The next dialogue to display after this option.
 * @property questToAdd - An optional quest to add upon selection.
 * @property questToComplete - An optional quest ID to mark as complete.
 * @property flagToSet - An optional flag to set (name and value).
 * @property requiredSkill - An optional skill requirement to enable the option.
 * @property requiredTrait - An optional trait requirement to enable the option.
 * @property questDependencies - An optional list of quest IDs that must be completed.
 * @property closeOnSelect - Whether the dialogue should close after selecting this option.
 */
export interface DialogueOption {
  text: string;
  action?: () => void;
  nextDialogue?: Dialogue;
  questToAdd?: { id: string; text: string };
  questToComplete?: string;
  questToFail?: string;
  flagToSet?: { flag: Flag; value: boolean };
  requiredSkill?: { name: keyof Skills; level: number };
  requiredTrait?: Trait;
  questDependencies?: (string | { id: string; status: QuestStatus })[];
  closeOnSelect?: boolean;
  requiredFlags?: Flag[];
  forbiddenFlags?: Flag[];
  requiredItems?: string[];
  consumeItems?: string[];
  id?: string;
}

export interface Dialogue {
  text: string;
  options?: DialogueOption[];
  urgency?: 1 | 2 | 3;
  visualEffect?: 'shake' | 'glitch';
}

/**
 * Global application state for the game, managed by Zustand.
 * Tracks everything from player skills and inventory to active quests and current scene.
 * @property scene - The currently active scene identifier.
 * @property setScene - Updates the current scene.
 * @property trait - The player's selected personality trait.
 * @property setTrait - Sets the player's trait.
 * @property skills - The player's current skill levels.
 * @property increaseSkill - Increases a specific skill by an amount.
 * @property dialogue - The currently active dialogue object, or null if inactive.
 * @property setDialogue - Sets or clears the active dialogue.
 * @property flags - A record of boolean flags tracking game progress.
 * @property setFlag - Sets a specific game flag to a boolean value.
 * @property inventory - A list of item IDs currently held by the player.
 * @property addToInventory - Adds an item ID to the inventory. Returns whether the item was added.
 * @property removeFromInventory - Removes an item ID from the inventory.
 * @property hasItem - Checks if the player has a specific item ID in their inventory.
 * @property combineItems - Attempts to combine two item IDs into a new item.
 * @property quests - A list of active, completed, and failed quests.
 * @property addQuest - Adds a quest if one with the same ID does not already exist (idempotent).
 * @property completeQuest - Marks a specific quest ID as completed.
 * @property failQuest - Marks a specific quest ID as failed.
 * @property startAndFinishQuest - Records a milestone as completed in one step. If the quest is already 'active', transitions it to 'completed'. No-op if already completed or failed.
 * @property bandMood - The current mood of the band (0-100).
 * @property increaseBandMood - Increases or decreases the band mood.
 * @property loreEntries - The list of all lore entries in the game.
 * @property discoverLore - Marks a specific lore entry ID as discovered.
 * @property playerPos - The player's 3D coordinates [x, y, z].
 * @property setPlayerPos - Updates the player's coordinates.
 * @property isPaused - Indicates whether the game logic is paused.
 * @property setPaused - Sets the pause state.
 * @property cameraShakeIntensity - The current intensity of the camera shake effect.
 * @property cameraShakeKick - The current magnitude of the camera shake kick effect.
 * @property setCameraShake - Updates the camera shake intensity.
 * @property resetGame - Resets the entire game state to defaults.
 */
export interface GameState {
  scene: Scene;
  setScene: (scene: Scene) => void;
  trait: Trait | null;
  setTrait: (trait: Trait) => void;
  skills: Skills;
  increaseSkill: (skill: keyof Skills, amount: number) => void;
  dialogue: Dialogue | null;
  setDialogue: (dialogue: Dialogue | string | null) => void;
  inventory: string[];
  inventoryCounts: Record<string, number>;
  addToInventory: (item: string) => boolean;
  removeFromInventory: (item: string) => void;
  hasItem: (item: string) => boolean;
  canPickupItem: (item: string) => boolean;
  itemPickupCounts: Record<string, number>;
  combineItems: (item1: string, item2: string) => boolean;
  flags: Record<Flag, boolean>;
  setFlag: (flag: Flag, value: boolean) => void;
  playerPos: [number, number, number];
  setPlayerPos: (pos: [number, number, number]) => void;
  isPaused: boolean;
  setPaused: (paused: boolean) => void;
  quests: Quest[];
  addQuest: (id: string, text: string) => void;
  completeQuest: (id: string, text?: string) => void;
  failQuest: (id: string, text?: string) => void;
  startAndFinishQuest: (id: string, text: string) => void;
  startQuestWithFlag: (id: string, text: string, flag: Flag, flagValue?: boolean) => void;
  completeQuestWithFlag: (id: string, flag: Flag, flagValue?: boolean, text?: string) => void;
  bandMood: number;
  increaseBandMood: (amount: number, sourceId?: string) => void;
  bandMoodGainClaims: Record<string, boolean>;
  cameraShakeIntensity: number;
  cameraShakeKick: number;
  setCameraShake: (intensity: number) => void;
  loreEntries: LoreEntry[];
  discoverLore: (id: string) => void;
  resetGame: () => void;
}
