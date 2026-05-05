import { Scene, Trait, QuestStatus } from './types';

export const initialState = {
  scene: 'menu' as Scene,
  trait: null as Trait | null,
  skills: {
    technical: 0,
    social: 0,
    chaos: 0,
  },
  dialogue: null,
  inventory: [],
  inventoryCounts: Object.create(null) as Record<string, number>,
  itemPickupCounts: Object.create(null) as Record<string, number>,
  flags: {
    waterCleaned: false,
    ampRepaired: false,
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
    marius_tourbus_performer_claimed: false,
    salzgitter_marius_chaos_claimed: false,
    salzgitter_marius_social_claimed: false,
    salzgitter_marius_performer_claimed: false,
    salzgitter_lars_technical_claimed: false,
    backstage_marius_diplomat_claimed: false,
    backstage_lars_technician_claimed: false,
    lars_drum_maintenance: false,
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
  cameraShakeIntensity: 0,
  cameraShakeKick: 0,
};

export interface Recipe {
  ingredients: [string, string];
  result: string;
  flagToSet?: keyof typeof initialState.flags;
}

export const RECIPES: Recipe[] = [
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

const recipeKey = (item1: string, item2: string) =>
  item1 < item2 ? `${item1}|${item2}` : `${item2}|${item1}`;

export const RECIPE_LOOKUP: Record<string, Recipe> = Object.create(null);
for (const r of RECIPES) {
  const i1 = r.ingredients[0];
  const i2 = r.ingredients[1];
  const key = recipeKey(i1, i2);
  RECIPE_LOOKUP[key] = r;
}

// Limits how often an item may be collected in total during a run.
// Default is 1 for all items not listed here.
export const ITEM_PICKUP_LIMITS: Record<string, number> = {
  Bier: 2,
  Lötkolben: 3,
  Schrottmetall: 2,
  Frequenzfragment: 2,
  'Dunkle Materie': Infinity,
};

export const getItemPickupLimit = (item: string) => ITEM_PICKUP_LIMITS[item] ?? 1;

export const KNOWN_ITEMS = [
  'Altes Plektrum',
  'Autoschlüssel',
  'Bassist-Saite',
  'Batterie',
  'Bier',
  'Defektes Kabel',
  'Dunkle Materie',
  'Energiedrink',
  'Frequenzfragment',
  'Geheime Notiz',
  'Geister-Drink',
  'Industrie-Talisman',
  'Kaffee',
  'Klebeband',
  'Lötkolben',
  'Marius Ego',
  'Mop',
  'Plasma-Zünder',
  'Quanten-Kabel',
  'Repariertes Kabel',
  'Resonanz-Kristall',
  'Rostiges Plektrum',
  'Röhre',
  'Schrottmetall',
  'Setliste',
  'Signierte Setliste',
  'Splitter der Leere',
  'Stift',
  'Turbo-Koffein',
  'Verbotenes Riff',
  'Verstärker-Schaltplan',
  'Void-Plektrum',
];

export const KNOWN_ITEMS_SET = new Set(KNOWN_ITEMS);
