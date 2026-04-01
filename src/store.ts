import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { audio } from './audio';

type Scene =
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

/**
 * All known boolean game flags. Using a union type here gives autocomplete
 * and catches typos at compile time when calling setFlag().
 */
export type Flag =
  | 'waterCleaned'
  | 'ampFixed'
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
  | 'voidBassistRewarded';

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
 * @property technical - Level of technical aptitude (e.g., repairing, hacking).
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
 * @property loreEntries - The dictionary of all lore entries in the game.
 * @property discoverLore - Marks a specific lore entry ID as discovered.
 * @property playerPos - The player's 3D coordinates [x, y, z].
 * @property setPlayerPos - Updates the player's coordinates.
 * @property isPaused - Indicates whether the game logic is paused.
 * @property setPaused - Sets the pause state.
 * @property cameraShake - The intensity of the camera shake effect.
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
  quests: { id: string; text: string; status: QuestStatus }[];
  addQuest: (id: string, text: string) => void;
  completeQuest: (id: string, text?: string) => void;
  failQuest: (id: string, text?: string) => void;
  startAndFinishQuest: (id: string, text: string) => void;
  startQuestWithFlag: (
    id: string,
    text: string,
    flag: Flag,
    flagValue?: boolean
  ) => void;
  completeQuestWithFlag: (
    id: string,
    flag: Flag,
    flagValue?: boolean,
    text?: string
  ) => void;
  bandMood: number;
  increaseBandMood: (amount: number, sourceId?: string) => void;
  bandMoodGainClaims: Record<string, boolean>;
  cameraShake: number;
  setCameraShake: (shake: number) => void;
  loreEntries: LoreEntry[];
  discoverLore: (id: string) => void;
  resetGame: () => void;
}

const initialState = {
  scene: 'menu' as Scene,
  trait: null as Trait | null,
  skills: {
    technical: 0,
    social: 0,
    chaos: 0,
  },
  dialogue: null,
  inventory: [],
  itemPickupCounts: {} as Record<string, number>,
  flags: {
    waterCleaned: false,
    ampFixed: false,
    cableFixed: false,
    setlistFound: false,
    mariusCalmed: false,
    larsEnergized: false,
    voidRefueled: false,
    talkingAmpHeard: false,
    talkingAmpRepaired: false,
    forbiddenRiffFound: false,
    egoContained: false,
    matzeDeepTalk: false,
    showedRiffToMatze: false,
    ghostSecretRevealed: false,
    tankwartPhilosophy: false,
    tankwartMysticDone: false,
    wirtSecretItem: false,
    tankwartReactedToRiff: false,
    larsDrumPhilosophy: false,
    mariusConfidenceBoost: false,
    askedAbout1982: false,
    askedAbout1982Attempted: false,
    larsVibrating: false,
    drumMachineQuestStarted: false,
    drumMachineQuestCompleted: false,
    kaminstubeDrumLoreHeard: false,
    egoTalked: false,
    feedbackMonitorTalked: false,
    feedbackMonitorQuestCompleted: false,
    feedbackMonitorBackstageTalked: false,
    feedbackMonitorBackstageQuestStarted: false,
    feedbackMonitorBackstageQuestCompleted: false,
    feedbackMonitorQuestStarted: false,
    ghostRecipeQuestStarted: false,
    ghostRecipeQuestCompleted: false,
    ampTherapyStarted: false,
    ampTherapyCompleted: false,
    cosmic_echo: false,
    forgotten_lore: false,
    posterLoreRead: false,
    proberaumPosterVisionary: false,
    tourbusAmpTechnician: false,
    magnetbandPlayed: false,
    frequenzDetektorRead: false,
    frequenzCalibrated: false,
    inschriftDecoded: false,
    legacyLoreMigrated: false,
    frequenz1982_proberaum: false,
    frequenz1982_tourbus: false,
    frequenz1982_backstage: false,
    frequenz1982_complete: false,
    matzeCynicOneShot: false,
    bassist_clue_matze: false,
    bassist_clue_ghost: false,
    bassist_clue_wirt: false,
    bassist_contacted: false,
    bassist_restored: false,
    maschinen_seele_amp: false,
    maschinen_seele_tr8080: false,
    maschinen_seele_complete: false,
    salzgitter_lars_paced_talked: false,
    kaminstube_lars_talked: false,
    salzgitter_performer_talked: false,
    salzgitter_fan_speech_heard: false,
    tankwart_fuel_quest_started: false,
    proberaum_brutalist_smash: false,
    tourbus_sabotage_discovered: false,
    tourbus_matze_confession: false,
    backstage_blueprint_found: false,
    backstage_performer_speech: false,
    backstage_cynic_sabotage: false,
    void_diplomat_negotiation: false,
    kaminstube_crowd_rallied: false,
    kaminstube_wirt_betrayal: false,
    salzgitter_encore_unlocked: false,
    salzgitter_true_ending: false,
    salzgitter_finalized: false,
    salzgitter_marius_greeted: false,
    lars_proberaum_secret: false,
    lars_paced: false,
    marius_tourbus_doubt: false,
    gaveDiplomatSouvenir: false,
    matzeRiffWarning: false,
    larsRhythmPact: false,
    gaveBeerToLars: false,
    gaveBeerToMarius: false,
    mariusSelfDoubtRevealed: false,
    mariusEgoComplimented: false,
    mariusVisionShared: false,
    mariusCalmedDown: false,
    tourbusCoffeeCollected: false,
    tourbusEnergyDrinkCollected: false,
    tourbusBeerCollected: false,
    mariusEgoStrategy: false,
    ampSentient: false,
    ghostTrustEarned: false,
    tourbusBandMeeting: false,
    backstageRitualPerformed: false,
    voidBassistSpoken: false,
    tankwartBargain: false,
    wirtLegacy1982: false,
    kaminFeuerPact: false,
    salzgitterBandUnited: false,
    fanMovement: false,
    larsRhythmPactClaimed: false,
    matzeRiffDialogueDone: false,
    matzePerformerTalk: false,
    salzgitterMatzeWirtDone: false,
    salzgitterMatzeDeepTalkDone: false,
    rostigesPlektrumCollected: false,
    tourbusHiddenStashTaken: false,
    voidBassistMoodGiven: false,
    tourbusGhostRiffUsed: false,
    ghostAskedSurvive: false,
    ghostAskedBeer: false,
    ghostAskedWho: false,
    backstageForbiddenRiffUsed: false,
    voidTerminalRead: false,
    voidCosmicEchoRewarded: false,
    voidBassistRewarded: false,
  },

  loreEntries: [
    {
      id: 'rhythm_pact',
      title: 'Der Rhythmus-Pakt',
      content:
        'Lars und du habt einen Pakt geschlossen. Der Rhythmus ist kein Werkzeug — er ist ein Lebewesen. Wer ihn beherrscht, kontrolliert die Zeit selbst.',
      discovered: false,
    },
    {
      id: 'ghost_legacy',
      title: 'Das Vermächtnis des Roadies',
      content:
        'Der Geist war einst der beste Roadie der Welt. Er starb 1982, als der Bassist verschwand — verschluckt vom gleichen Feedback-Loop. Sein letzter Wunsch: dass die Band weiterlebt.',
      discovered: false,
    },
    {
      id: 'kamin_prophecy',
      title: 'Prophezeiung des Kamins',
      content:
        'Das Feuer flüstert: In Salzgitter wird die Grenze zwischen Musik und Realität brechen. Nur eine vereinte Band kann den Riss schließen.',
      discovered: false,
    },
    {
      id: 'frequenz_1982_decoded',
      title: 'Die Frequenz von 1982',
      content:
        'Die Frequenz war nie verloren. Sie lebte in den Wänden der Gießerei, im Stahl des Tourbus, im Feedback der Monitore. 432.1982Hz — die Frequenz, die zwischen Leben und Lärm schwingt.',
      discovered: false,
    },
    {
      id: 'bassist_wahrheit',
      title: 'Die Wahrheit über den Bassisten',
      content:
        'Er wählte die Leere. Nicht aus Verzweiflung, sondern aus Liebe zum reinen Klang. Er ist der Grundton, auf dem alles aufbaut. Ohne ihn wäre NEUROTOXIC nur Lärm.',
      discovered: false,
    },
    {
      id: 'maschinen_bewusstsein',
      title: 'Das Maschinen-Bewusstsein',
      content:
        'Sie waren nie nur Werkzeuge. Der Amp, die Drum Machine, der Monitor — sie sind Fragmente eines einzigen Bewusstseins, das 1982 in die Schaltkreise eingespeist wurde.',
      discovered: false,
    },
    {
      id: 'wirt_vergangenheit',
      title: 'Der Wirt und 1982',
      content:
        'Er war dabei. Er war der Tontechniker beim Gig in der Gießerei. Er hat den Bassist in die Leere geschickt — nicht aus Bosheit, sondern weil der Sound es verlangte.',
      discovered: false,
    },
    {
      id: 'void_1982',
      title: '1982 Log',
      content:
        'Tag 44. Der Bassist ist in die 4. Dimension gefallen. Der Sound ist jetzt viel klarer. Wir haben die Kaminstube erreicht. Die Fans bestehen aus reinem Feedback.',
      discovered: false,
    },
    {
      id: 'tankwart_truth',
      title: 'Die Wahrheit des Lärms',
      content:
        'Lärm ist nicht das Chaos. Lärm ist die Ordnung, die wir noch nicht verstehen. Jedes Feedback ist ein Gebet an die Leere.',
      discovered: false,
    },
    {
      id: 'forbidden_riff',
      title: 'Das Verbotene Riff',
      content:
        'Dieses Riff... es ist der Schlüssel zum Ende der Zeit. Es wurde vor Äonen von den ersten Maschinen-Göttern in den Stahl geätzt.',
      discovered: false,
    },
    {
      id: 'schaltpult_record',
      title: 'Schaltpult Record',
      content:
        'Die Station war einst ein Archiv. Jedes Signal, jeder Akkord, konserviert im Vakuum.',
      discovered: false,
    },
    {
      id: 'magnetband_session',
      title: '1982 Session Tape',
      content:
        '[Aufzeichnung] *Verzerrter Bass* ...es reißt auf! Der Riss im Raum, er kommt vom Verstärker! Zieht den Stecker! ... *statisches Rauschen*',
      discovered: false,
    },
    {
      id: 'frequenz_anomaly',
      title: 'Frequenz Anomalie',
      content:
        'Warnung: Die Resonanz der Void Station gleicht sich der Herzfrequenz eines uralten Wesens an. Die Station lebt.',
      discovered: false,
    },
    {
      id: 'inschrift_warning',
      title: 'Inschrift Warnung',
      content:
        'Spiele nicht die verbotene Kadenz, es sei denn, du bist bereit, die Stille für immer zu töten. Salzgitter ist der Katalysator.',
      discovered: false,
    },
    {
      id: 'ego_philosophy',
      title: "Marius' Ego-Philosophie",
      content:
        'Die Leere ist langweilig, wenn es niemanden gibt, der dich anbetet. Die wahre Transzendenz braucht ein Publikum.',
      discovered: false,
    },
    {
      id: 'poster_lore',
      title: 'Proberaum Poster',
      content:
        'Das Poster zeigt eine Tour, die nie stattfand. Oder eine, die noch stattfinden wird. Die Zeit hier ist fließend.',
      discovered: false,
    },
    {
      id: 'cosmic_echo_decoded',
      title: 'Kosmisches Echo (Decoded)',
      content:
        'Das Echo... du hast es entschlüsselt. Dann weißt du, was in Salzgitter passieren wird. Die Koordinaten sind nicht nur ein Ort — sie sind ein Zeitpunkt. Ihr spielt am Ende aller Dinge.',
      discovered: false,
    },
    {
      id: 'tourbus_saboteur',
      title: 'Der Saboteur',
      content:
        'Das Kabel wurde nicht durch Abnutzung zerstört. Jemand hat es mit einem Seitenschneider durchtrennt. Jemand, der Angst vor dem Gig hatte.',
      discovered: false,
    },
    {
      id: 'matze_1982_truth',
      title: 'Matzes Wahrheit über 1982',
      content:
        'Er hat den Lärm verstanden. Die Gießerei war kein Unfall, sie war eine Offenbarung.',
      discovered: false,
    },
    {
      id: 'roadie_bassist',
      title: 'Der Roadie und der Bassist',
      content:
        'Der Roadie schwört, dass der Bassist nicht abgehauen ist. Er wurde von einem 432Hz-Feedback-Loop verschluckt und wandert seitdem durch die Frequenzen.',
      discovered: false,
    },
    {
      id: 'wirt_confession',
      title: 'Die Beichte des Wirts',
      content:
        'Er war es. Er hat 1982 den Verstärker manipuliert, weil der Sound zu gefährlich wurde. Er dachte, er rettet die Stadt, aber er hat den Bassisten geopfert.',
      discovered: false,
    },
  ],
  playerPos: [0, 1, 0] as [number, number, number],
  isPaused: false,
  // Only seed quests the player knows about from the very start of the game.
  // Scene-specific quests are added by their respective scene components on discovery.
  quests: [
    {
      id: 'water',
      text: 'Wisch das Wasser im Proberaum auf',
      status: 'active' as QuestStatus,
    },
    {
      id: 'beer',
      text: 'Besorg Marius ein kühles Bier',
      status: 'active' as QuestStatus,
    },
    {
      id: 'keys',
      text: 'Finde die Autoschlüssel für den Van',
      status: 'active' as QuestStatus,
    },
    {
      id: 'marius',
      text: 'Beruhige Marius vor dem Auftritt',
      status: 'active' as QuestStatus,
    },
  ],
  bandMood: 20,
  bandMoodGainClaims: {},
  cameraShake: 0,
};

interface Recipe {
  ingredients: [string, string];
  result: string;
  flagToSet?: keyof typeof initialState.flags;
}

const RECIPES: Recipe[] = [
  {
    ingredients: ['Defektes Kabel', 'Klebeband'],
    result: 'Repariertes Kabel',
    flagToSet: 'cableFixed',
  },
  { ingredients: ['Setliste', 'Stift'], result: 'Signierte Setliste' },
  { ingredients: ['Energiedrink', 'Kaffee'], result: 'Turbo-Koffein' },
  { ingredients: ['Schrottmetall', 'Lötkolben'], result: 'Industrie-Talisman' },
  { ingredients: ['Batterie', 'Lötkolben'], result: 'Plasma-Zünder' },
  {
    ingredients: ['Turbo-Koffein', 'Rostiges Plektrum'],
    result: 'Geister-Drink',
  },
  {
    ingredients: ['Splitter der Leere', 'Altes Plektrum'],
    result: 'Void-Plektrum',
  },
  {
    ingredients: ['Frequenzfragment', 'Splitter der Leere'],
    result: 'Resonanz-Kristall',
  },
];

// Limits how often an item may be collected in total during a run.
// Default is 1 for all items not listed here.
const ITEM_PICKUP_LIMITS: Record<string, number> = {
  Bier: 2,
  Lötkolben: 3,
  Schrottmetall: 2,
  Frequenzfragment: 2,
};

const getItemPickupLimit = (item: string) => ITEM_PICKUP_LIMITS[item] ?? 1;

const deriveBandMoodGainSource = (): string => {
  const stack = new Error().stack;
  if (!stack) return 'unknown_source';

  const lines = stack.split('\n').map((line) => line.trim());
  const sourceLine = lines.find(
    (line) =>
      line &&
      !line.includes('deriveBandMoodGainSource') &&
      !line.includes('increaseBandMood') &&
      !line.includes('store.ts') &&
      !line.includes('zustand') &&
      !line.includes('at set')
  );

  return sourceLine ?? 'unknown_source';
};

/**
 * The Zustand hook for accessing and mutating the global game state.
 * Automatically persists the state to localStorage.
 */
export const useStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setScene: (scene) => set({ scene, playerPos: [0, 1, 0] }),
      setTrait: (trait) => set({ trait }),
      increaseSkill: (skill, amount) =>
        set((state) => ({
          skills: { ...state.skills, [skill]: state.skills[skill] + amount },
        })),
      setDialogue: (dialogue) => {
        if (dialogue) audio.playInteract();
        if (typeof dialogue === 'string') {
          set({ dialogue: { text: dialogue } });
        } else {
          set({ dialogue });
        }
      },
      addToInventory: (item) => {
        let didAdd = false;
        set((state) => {
          const pickedCount = state.itemPickupCounts[item] ?? 0;
          const pickupLimit = getItemPickupLimit(item);

          if (pickedCount >= pickupLimit) {
            return state;
          }

          didAdd = true;
          return {
            inventory: [...state.inventory, item],
            itemPickupCounts: {
              ...state.itemPickupCounts,
              [item]: pickedCount + 1,
            },
          };
        });
        if (didAdd) {
          audio.playPickup();
        }
        return didAdd;
      },
      removeFromInventory: (item) => {
        set((state) => {
          const index = state.inventory.indexOf(item);
          if (index !== -1) {
            const newInventory = [...state.inventory];
            newInventory.splice(index, 1);
            return { inventory: newInventory };
          }
          console.warn(
            `Attempted to remove item from inventory that does not exist: ${item}`
          );
          return state;
        });
      },
      hasItem: (item) => get().inventory.includes(item),
      canPickupItem: (item) => {
        const state = get();
        const pickedCount = state.itemPickupCounts[item] ?? 0;
        return pickedCount < getItemPickupLimit(item);
      },
      combineItems: (item1, item2) => {
        const recipe = RECIPES.find(
          (r) =>
            (item1 === r.ingredients[0] && item2 === r.ingredients[1]) ||
            (item1 === r.ingredients[1] && item2 === r.ingredients[0])
        );

        if (!recipe) return false;

        const inv = get().inventory;
        const idx1 = inv.indexOf(item1);
        const idx2 = inv.indexOf(item2, item1 === item2 ? idx1 + 1 : 0);

        // Ensure both ingredients exist (handles duplicate items correctly)
        if (idx1 === -1 || idx2 === -1) return false;

        set((state) => {
          const newInventory = [...state.inventory];
          // Recalculate indices to ensure we are working with the latest state
          const i1 = newInventory.indexOf(item1);
          const i2 = newInventory.indexOf(item2, item1 === item2 ? i1 + 1 : 0);

          const higher = Math.max(i1, i2);
          const lower = Math.min(i1, i2);

          newInventory.splice(higher, 1);
          newInventory.splice(lower, 1);
          newInventory.push(recipe.result);

          return {
            inventory: newInventory,
            ...(recipe.flagToSet && {
              flags: { ...state.flags, [recipe.flagToSet]: true },
            }),
          };
        });

        audio.playPickup();
        return true;
      },
      setFlag: (flag, value) =>
        set((state) => ({ flags: { ...state.flags, [flag]: value } })),
      setPlayerPos: (playerPos) =>
        set((state) => {
          // ⚡ Bolt Optimization: Prevent unnecessary re-renders by returning same state if position hasn't changed
          // This avoids triggering Zustand subscribers 60x per second in useFrame
          if (
            state.playerPos[0] === playerPos[0] &&
            state.playerPos[1] === playerPos[1] &&
            state.playerPos[2] === playerPos[2]
          ) {
            return state;
          }
          return { playerPos };
        }),
      setPaused: (isPaused) => set({ isPaused }),
      addQuest: (id, text) =>
        set((state) => {
          const existing = state.quests.find((q) => q.id === id);
          if (existing) {
            // Update the display text while preserving the current status so that
            // narrative corrections propagate to saves without reopening the quest.
            return {
              quests: state.quests.map((q) =>
                q.id === id ? { ...q, text } : q
              ),
            };
          }
          return {
            quests: [
              ...state.quests,
              { id, text, status: 'active' as QuestStatus },
            ],
          };
        }),
      completeQuest: (id, text) =>
        set((state) => {
          const exists = state.quests.some((q) => q.id === id);
          if (!exists) {
            if (text) {
              return {
                quests: [
                  ...state.quests,
                  { id, text, status: 'completed' as QuestStatus },
                ],
              };
            }
            console.warn(`Attempted to complete unregistered quest: ${id}`);
            return state;
          }
          return {
            quests: state.quests.map((q) =>
              q.id === id ? { ...q, status: 'completed' as QuestStatus } : q
            ),
          };
        }),
      failQuest: (id, text) =>
        set((state) => {
          const exists = state.quests.some((q) => q.id === id);
          if (!exists) {
            if (text) {
              return {
                quests: [
                  ...state.quests,
                  { id, text, status: 'failed' as QuestStatus },
                ],
              };
            }
            console.warn(`Attempted to fail unregistered quest: ${id}`);
            return state;
          }
          return {
            quests: state.quests.map((q) =>
              q.id === id ? { ...q, status: 'failed' as QuestStatus } : q
            ),
          };
        }),
      startQuestWithFlag: (id, text, flag, flagValue = true) =>
        set((state) => {
          const existing = state.quests.find((q) => q.id === id);
          if (existing) {
            return {
              quests: state.quests.map((q) =>
                q.id === id
                  ? {
                      ...q,
                      text,
                      status: (existing.status === 'completed' ? 'completed' : 'active') as QuestStatus,
                    }
                  : q
              ),
              flags: { ...state.flags, [flag]: flagValue },
            };
          }
          return {
            quests: [
              ...state.quests,
              { id, text, status: 'active' as QuestStatus },
            ],
            flags: { ...state.flags, [flag]: flagValue },
          };
        }),
      completeQuestWithFlag: (id, flag, flagValue = true, text) =>
        set((state) => {
          const exists = state.quests.some((q) => q.id === id);
          if (!exists) {
            if (text) {
              return {
                quests: [
                  ...state.quests,
                  { id, text, status: 'completed' as QuestStatus },
                ],
                flags: { ...state.flags, [flag]: flagValue },
              };
            }
            console.warn(`Attempted to complete unregistered quest: ${id}`);
            return state;
          }
          return {
            quests: state.quests.map((q) =>
              q.id === id ? { ...q, status: 'completed' as QuestStatus } : q
            ),
            flags: { ...state.flags, [flag]: flagValue },
          };
        }),
      startAndFinishQuest: (id, text) =>
        set((state) => {
          const existing = state.quests.find((q) => q.id === id);
          if (existing?.status === 'completed' || existing?.status === 'failed')
            return state;
          if (existing?.status === 'active') {
            return {
              quests: state.quests.map((q) =>
                q.id === id ? { ...q, status: 'completed' as QuestStatus } : q
              ),
            };
          }
          return {
            quests: [
              ...state.quests,
              { id, text, status: 'completed' as QuestStatus },
            ],
          };
        }),
      increaseBandMood: (amount, sourceId) =>
        set((state) => {
          const nextMood = Math.max(0, Math.min(100, state.bandMood + amount));

          if (amount > 0) {
            const gainSource = sourceId ?? deriveBandMoodGainSource();
            if (state.bandMoodGainClaims[gainSource]) {
              return state;
            }
            return {
              bandMood: nextMood,
              bandMoodGainClaims: {
                ...state.bandMoodGainClaims,
                [gainSource]: true,
              },
            };
          }

          return { bandMood: nextMood };
        }),
      setCameraShake: (cameraShake) => set({ cameraShake }),
      discoverLore: (id) =>
        set((state) => {
          const entry = state.loreEntries.find((e) => e.id === id);
          if (!entry || entry.discovered) {
            return state; // Avoid state update if lore doesn't exist or is already discovered
          }
          return {
            loreEntries: state.loreEntries.map((e) =>
              e.id === id ? { ...e, discovered: true } : e
            ),
          };
        }),
      resetGame: () => set(initialState),
    }),
    {
      name: 'neurotoxic-game-storage',
      partialize: (state) => ({
        inventory: state.inventory,
        itemPickupCounts: state.itemPickupCounts,
        flags: state.flags,
        quests: state.quests,
        bandMood: state.bandMood,
        bandMoodGainClaims: state.bandMoodGainClaims,
        loreEntries: state.loreEntries,
        trait: state.trait,
        skills: state.skills,
      }),
      merge: (persistedState: unknown, currentState: GameState) => {
        const typedPersistedState =
          persistedState !== null && typeof persistedState === 'object'
            ? (persistedState as Partial<GameState>)
            : {};

        const persistedQuests = Array.isArray(typedPersistedState.quests)
          ? typedPersistedState.quests
          : [];
        const persistedLore = Array.isArray(typedPersistedState.loreEntries)
          ? typedPersistedState.loreEntries
          : [];
        const persistedFlags =
          typedPersistedState.flags !== null &&
          typeof typedPersistedState.flags === 'object'
            ? typedPersistedState.flags
            : {};
        const persistedPickupCounts =
          typedPersistedState.itemPickupCounts !== null &&
          typeof typedPersistedState.itemPickupCounts === 'object'
            ? (typedPersistedState.itemPickupCounts as Record<string, number>)
            : {};
        const persistedInventory = Array.isArray(typedPersistedState.inventory)
          ? typedPersistedState.inventory
          : [];

        const normalizeQuestStatus = (
          status: unknown,
          completed: unknown
        ): QuestStatus => {
          if (
            status === 'active' ||
            status === 'completed' ||
            status === 'failed'
          )
            return status;
          return completed === true ? 'completed' : 'active';
        };

        const mergedQuests = currentState.quests.map((q) => {
          const persistedQuest = persistedQuests.find((pq) => pq.id === q.id);
          if (!persistedQuest) return q;
          // Handle old saves (completed: boolean) and new saves (status: QuestStatus)
          const pq = persistedQuest as unknown as {
            id: string;
            text: string;
            status?: unknown;
            completed?: unknown;
          };
          return {
            ...q,
            status: normalizeQuestStatus(pq.status, pq.completed),
          };
        });

        const dynamicQuests = persistedQuests
          .filter((pq) => !currentState.quests.find((q) => q.id === pq.id))
          .map((pq) => {
            const p = pq as unknown as {
              id: string;
              text: string;
              status?: unknown;
              completed?: unknown;
            };
            return {
              id: p.id,
              text: p.text,
              status: normalizeQuestStatus(p.status, p.completed),
            };
          });

        const allQuests = [...mergedQuests, ...dynamicQuests];

        const mergedLoreEntries = currentState.loreEntries.map((e) => {
          const persistedEntry = persistedLore.find((pe) => pe.id === e.id);
          return persistedEntry
            ? { ...e, discovered: persistedEntry.discovered }
            : e;
        });

        const inventoryCounts = persistedInventory.reduce<
          Record<string, number>
        >((acc, item) => {
          if (typeof item !== 'string') return acc;
          acc[item] = (acc[item] ?? 0) + 1;
          return acc;
        }, {});

        const mergedPickupCounts: Record<string, number> = {
          ...persistedPickupCounts,
        };
        for (const [item, count] of Object.entries(inventoryCounts)) {
          mergedPickupCounts[item] = Math.max(
            mergedPickupCounts[item] ?? 0,
            count
          );
        }

        return {
          ...currentState,
          ...typedPersistedState,
          scene: currentState.scene,
          playerPos: currentState.playerPos,
          quests: allQuests,
          loreEntries: mergedLoreEntries,
          itemPickupCounts: mergedPickupCounts,
          bandMoodGainClaims:
            typedPersistedState.bandMoodGainClaims !== null &&
            typeof typedPersistedState.bandMoodGainClaims === 'object'
              ? (typedPersistedState.bandMoodGainClaims as Record<
                  string,
                  boolean
                >)
              : currentState.bandMoodGainClaims,
          flags: {
            ...currentState.flags,
            ...persistedFlags,
          },
        };
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (
            !state.flags.legacyLoreMigrated ||
            state.flags.feedbackMonitorQuestStarted ||
            state.quests.some((q) => q.id === 'fix_cable')
          ) {
            setTimeout(() => {
              useStore.setState((currentState) => {
                const newEntries = [...currentState.loreEntries];
                let migratedLore = false;

                const migrateEntry = (id: string) => {
                  const idx = newEntries.findIndex((e) => e.id === id);
                  if (idx !== -1 && !newEntries[idx].discovered) {
                    newEntries[idx] = { ...newEntries[idx], discovered: true };
                    migratedLore = true;
                  }
                };

                if (!currentState.flags.legacyLoreMigrated) {
                  if (currentState.flags.posterLoreRead)
                    migrateEntry('poster_lore');
                  if (currentState.flags.forbiddenRiffFound)
                    migrateEntry('forbidden_riff');
                  if (currentState.flags.egoContained)
                    migrateEntry('ego_philosophy');
                  if (currentState.flags.tankwartPhilosophy)
                    migrateEntry('tankwart_truth');
                  if (currentState.flags.cosmic_echo)
                    migrateEntry('cosmic_echo_decoded');
                }

                const newFlags = { ...currentState.flags };

                // Migrate legacy feedback monitor flag
                if (newFlags.feedbackMonitorQuestStarted) {
                  newFlags.feedbackMonitorBackstageTalked = true;
                  newFlags.feedbackMonitorBackstageQuestStarted = true;
                  if (newFlags.feedbackMonitorQuestCompleted) {
                    newFlags.feedbackMonitorBackstageQuestCompleted = true;
                    // Zero the legacy flag so Proberaum's own feedbackMonitorQuestCompleted
                    // starts clean and doesn't inherit the Backstage completion state.
                    newFlags.feedbackMonitorQuestCompleted = false;
                  }
                  // Zero out the migrated flag rather than deleting (required by typed Record<Flag, boolean>)
                  newFlags.feedbackMonitorQuestStarted = false;
                }

                newFlags.legacyLoreMigrated = true;

                let updatedQuests = currentState.quests;
                const fixCableQuestIndex = currentState.quests.findIndex(
                  (q) => q.id === 'fix_cable'
                );
                if (fixCableQuestIndex !== -1) {
                  updatedQuests = [...currentState.quests];
                  updatedQuests[fixCableQuestIndex] = {
                    ...updatedQuests[fixCableQuestIndex],
                    id: 'cable',
                  };
                }

                return {
                  loreEntries: migratedLore
                    ? newEntries
                    : currentState.loreEntries,
                  flags: newFlags,
                  ...(fixCableQuestIndex !== -1 && { quests: updatedQuests }),
                };
              });
            }, 0);
          }
        }
      },
    }
  )
);
