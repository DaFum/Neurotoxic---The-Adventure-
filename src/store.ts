import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { audio } from './audio';

type Scene = 'menu' | 'proberaum' | 'tourbus' | 'backstage' | 'void_station' | 'kaminstube' | 'salzgitter';

export type Trait = 'Visionary' | 'Technician' | 'Brutalist' | 'Diplomat' | 'Mystic' | 'Performer' | 'Cynic';

export interface Skills {
  technical: number;
  social: number;
  chaos: number;
}

export interface LoreEntry {
  id: string;
  title: string;
  content: string;
  discovered: boolean;
}

export interface DialogueOption {
  text: string;
  action?: () => void;
  nextDialogue?: Dialogue;
  questToAdd?: { id: string; text: string };
  questToComplete?: string;
  flagToSet?: { flag: string; value: boolean };
  requiredSkill?: { name: keyof Skills; level: number };
  requiredTrait?: Trait;
  questDependencies?: string[];
  closeOnSelect?: boolean;
}

interface Dialogue {
  text: string;
  options?: DialogueOption[];
  urgency?: 1 | 2 | 3;
}

interface GameState {
  scene: Scene;
  setScene: (scene: Scene) => void;
  trait: Trait | null;
  setTrait: (trait: Trait) => void;
  skills: Skills;
  increaseSkill: (skill: keyof Skills, amount: number) => void;
  dialogue: Dialogue | null;
  setDialogue: (dialogue: Dialogue | string | null) => void;
  inventory: string[];
  addToInventory: (item: string) => void;
  removeFromInventory: (item: string) => void;
  hasItem: (item: string) => boolean;
  combineItems: (item1: string, item2: string) => boolean;
  flags: Record<string, boolean>;
  setFlag: (flag: string, value: boolean) => void;
  playerPos: [number, number, number];
  setPlayerPos: (pos: [number, number, number]) => void;
  isPaused: boolean;
  setPaused: (paused: boolean) => void;
  quests: { id: string; text: string; completed: boolean }[];
  addQuest: (id: string, text: string) => void;
  completeQuest: (id: string) => void;
  bandMood: number;
  increaseBandMood: (amount: number) => void;
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
  flags: {
    waterCleaned: false,
    ampFixed: false,
    gotBeer: false,
    cableFixed: false,
    setlistFound: false,
    mariusCalmed: false,
    larsEnergized: false,
    voidRefueled: false,
    talkingAmpHeard: false,
    forbiddenRiffFound: false,
    egoContained: false,
    matzeDeepTalk: false,
    ghostSecretRevealed: false,
    tankwartPhilosophy: false,
    wirtSecretItem: false,
    tankwartReactedToRiff: false,
    larsDrumPhilosophy: false,
    mariusConfidenceBoost: false,
    askedAbout1982: false,
    larsVibrating: false,
    drumMachineQuestStarted: false,
    drumMachineQuestCompleted: false,
    egoTalked: false,
    feedbackMonitorTalked: false,
    feedbackMonitorQuestCompleted: false,
    feedbackMonitorBackstageTalked: false,
    feedbackMonitorBackstageQuestStarted: false,
    feedbackMonitorBackstageQuestCompleted: false,
    ghostRecipeQuestStarted: false,
    ghostRecipeQuestCompleted: false,
    ampTherapyStarted: false,
    ampTherapyCompleted: false,
    cosmic_echo: false,
    forgotten_lore: false,
    posterLoreRead: false,
    proberaumPosterVisionary: false,
    tourbusAmpTechnician: false,
    frequenzDetektorRead: false,
    legacyLoreMigrated: false,
    frequenz1982_proberaum: false,
    frequenz1982_tourbus: false,
    frequenz1982_backstage: false,
    frequenz1982_complete: false,
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
  },


  loreEntries: [

    { id: 'rhythm_pact', title: 'Der Rhythmus-Pakt', content: 'Lars und du habt einen Pakt geschlossen. Der Rhythmus ist kein Werkzeug — er ist ein Lebewesen. Wer ihn beherrscht, kontrolliert die Zeit selbst.', discovered: false },
    { id: 'ghost_legacy', title: 'Das Vermächtnis des Roadies', content: 'Der Geist war einst der beste Roadie der Welt. Er starb 1982, als der Bassist verschwand — verschluckt vom gleichen Feedback-Loop. Sein letzter Wunsch: dass die Band weiterlebt.', discovered: false },
    { id: 'bassist_truth', title: 'Die Wahrheit des Bassisten', content: 'Der Bassist ist nicht verschwunden. Er wurde eins mit der Frequenz. In der Void Station existiert er als reine Schwingung — weder tot noch lebendig.', discovered: false },
    { id: 'kamin_prophecy', title: 'Prophezeiung des Kamins', content: 'Das Feuer flüstert: In Salzgitter wird die Grenze zwischen Musik und Realität brechen. Nur eine vereinte Band kann den Riss schließen.', discovered: false },
    { id: 'frequenz_1982_decoded', title: 'Die Frequenz von 1982', content: 'Die Frequenz war nie verloren. Sie lebte in den Wänden der Gießerei, im Stahl des Tourbus, im Feedback der Monitore. 432.1982Hz — die Frequenz, die zwischen Leben und Lärm schwingt.', discovered: false },
    { id: 'bassist_wahrheit', title: 'Die Wahrheit über den Bassisten', content: 'Er wählte die Leere. Nicht aus Verzweiflung, sondern aus Liebe zum reinen Klang. Er ist der Grundton, auf dem alles aufbaut. Ohne ihn wäre NEUROTOXIC nur Lärm.', discovered: false },
    { id: 'maschinen_bewusstsein', title: 'Das Maschinen-Bewusstsein', content: 'Sie waren nie nur Werkzeuge. Der Amp, die Drum Machine, der Monitor — sie sind Fragmente eines einzigen Bewusstseins, das 1982 in die Schaltkreise eingespeist wurde.', discovered: false },
    { id: 'wirt_vergangenheit', title: 'Der Wirt und 1982', content: 'Er war dabei. Er war der Tontechniker beim Gig in der Gießerei. Er hat den Bassist in die Leere geschickt — nicht aus Bosheit, sondern weil der Sound es verlangte.', discovered: false },
    { id: 'void_1982', title: '1982 Log', content: 'Tag 44. Der Bassist ist in die 4. Dimension gefallen. Der Sound ist jetzt viel klarer. Wir haben die Kaminstube erreicht. Die Fans bestehen aus reinem Feedback.', discovered: false },
    { id: 'tankwart_truth', title: 'Die Wahrheit des Lärms', content: 'Lärm ist nicht das Chaos. Lärm ist die Ordnung, die wir noch nicht verstehen. Jedes Feedback ist ein Gebet an die Leere.', discovered: false },
    { id: 'forbidden_riff', title: 'Das Verbotene Riff', content: 'Dieses Riff... es ist der Schlüssel zum Ende der Zeit. Es wurde vor Äonen von den ersten Maschinen-Göttern in den Stahl geätzt.', discovered: false },
    { id: 'schaltpult_record', title: 'Schaltpult Record', content: 'Die Station war einst ein Archiv. Jedes Signal, jeder Akkord, konserviert im Vakuum.', discovered: false },
    { id: 'magnetband_session', title: '1982 Session Tape', content: '[Aufzeichnung] *Verzerrter Bass* ...es reißt auf! Der Riss im Raum, er kommt vom Verstärker! Zieht den Stecker! ... *statisches Rauschen*', discovered: false },
    { id: 'frequenz_anomaly', title: 'Frequenz Anomalie', content: 'Warnung: Die Resonanz der Void Station gleicht sich der Herzfrequenz eines uralten Wesens an. Die Station lebt.', discovered: false },
    { id: 'inschrift_warning', title: 'Inschrift Warnung', content: 'Spiele nicht die verbotene Kadenz, es sei denn, du bist bereit, die Stille für immer zu töten. Salzgitter ist der Katalysator.', discovered: false },
    { id: 'ego_philosophy', title: 'Marius\' Ego-Philosophie', content: 'Die Leere ist langweilig, wenn es niemanden gibt, der dich anbetet. Die wahre Transzendenz braucht ein Publikum.', discovered: false },
    { id: 'poster_lore', title: 'Proberaum Poster', content: 'Das Poster zeigt eine Tour, die nie stattfand. Oder eine, die noch stattfinden wird. Die Zeit hier ist fließend.', discovered: false },
    { id: 'cosmic_echo_decoded', title: 'Kosmisches Echo (Decoded)', content: 'Das Echo... du hast es entschlüsselt. Dann weißt du, was in Salzgitter passieren wird. Die Koordinaten sind nicht nur ein Ort — sie sind ein Zeitpunkt. Ihr spielt am Ende aller Dinge.', discovered: false },
    { id: 'tourbus_saboteur', title: 'Der Saboteur', content: 'Das Kabel wurde nicht durch Abnutzung zerstört. Jemand hat es mit einem Seitenschneider durchtrennt. Jemand, der Angst vor dem Gig hatte.', discovered: false },
    { id: 'matze_1982_truth', title: 'Matzes Wahrheit über 1982', content: 'Er hat den Lärm verstanden. Die Gießerei war kein Unfall, sie war eine Offenbarung.', discovered: false },
    { id: 'roadie_bassist', title: 'Der Roadie und der Bassist', content: 'Der Roadie schwört, dass der Bassist nicht abgehauen ist. Er wurde von einem 432Hz-Feedback-Loop verschluckt und wandert seitdem durch die Frequenzen.', discovered: false },
    { id: 'wirt_confession', title: 'Die Beichte des Wirts', content: 'Er war es. Er hat 1982 den Verstärker manipuliert, weil der Sound zu gefährlich wurde. Er dachte, er rettet die Stadt, aber er hat den Bassisten geopfert.', discovered: false }
  ],
  playerPos: [0, 1, 0] as [number, number, number],
  isPaused: false,
  quests: [
    { id: 'water', text: 'Wisch das Wasser im Proberaum auf', completed: false },
    { id: 'beer', text: 'Besorg Marius ein kühles Bier', completed: false },
    { id: 'keys', text: 'Finde die Autoschlüssel für den Van', completed: false },
    { id: 'setlist', text: 'Finde die Setliste im Backstage', completed: false },
    { id: 'marius', text: 'Beruhige Marius vor dem Auftritt', completed: false },
    { id: 'void', text: 'Betanke den Van mit dunkler Materie', completed: false },
    { id: 'ego', text: 'Fange Marius entflohenes Ego ein', completed: false },
    { id: 'cosmic_echo', text: 'Untersuche das kosmische Echo in der Void Station', completed: false },
    { id: 'forgotten_lore', text: 'Entschlüssele die vergessene Lore in der Kaminstube', completed: false },
  ],
  bandMood: 20,
  cameraShake: 0,
};

/**
 * #1: UPDATES
 * - Integrated "Talking Amp's Existential Crisis" quest in Proberaum.
 * - Integrated "Ghostly Roadie's Lost Recipe" quest in TourBus.
 * - Added Geister-Drink item combination.
 * - Added Rostiges Plektrum item.
 * - Added cosmic_echo and forgotten_lore quest flags and quests.
 * - Added trait-exclusive interaction flags (proberaumPosterVisionary, tourbusAmpTechnician).
 * - Expanded Trait system: Added 'Mystic', 'Performer', 'Cynic'.
 * 
 * #2: NEXT STEPS & IDEAS
 * - Expand questlines with branching outcomes.
 * - Refine NPC dialogue and lore.
 * - Introduce scene-specific quests for remaining scenes.
 * - Integrate character traits/skills deeper into dialogue.
 * 
 * #3: ERRORS & SOLUTIONS
 * - Error: removeFromInventory not found in TourBus.tsx. Solution: Destructured removeFromInventory from useStore.
 */

export const useStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setScene: (scene) => set({ scene, playerPos: [0, 1, 0] }),
      setTrait: (trait) => set({ trait }),
      increaseSkill: (skill, amount) => set((state) => ({
        skills: { ...state.skills, [skill]: state.skills[skill] + amount }
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
        audio.playPickup();
        set((state) => ({ inventory: [...state.inventory, item] }));
      },
      removeFromInventory: (item) => {
        set((state) => ({ inventory: state.inventory.filter((i) => i !== item) }));
      },
      hasItem: (item) => get().inventory.includes(item),
      combineItems: (item1, item2) => {
        const inv = get().inventory;
        if (inv.includes(item1) && inv.includes(item2)) {
          // Cable + Tape = Fixed Cable
          if ((item1 === 'Defektes Kabel' && item2 === 'Klebeband') || (item1 === 'Klebeband' && item2 === 'Defektes Kabel')) {
            set((state) => ({
              inventory: [...state.inventory.filter(i => i !== item1 && i !== item2), 'Repariertes Kabel'],
              flags: { ...state.flags, cableFixed: true }
            }));
            audio.playPickup();
            return true;
          }
          // Setlist + Stift = Signierte Setliste
          if ((item1 === 'Setliste' && item2 === 'Stift') || (item1 === 'Stift' && item2 === 'Setliste')) {
            set((state) => ({
              inventory: [...state.inventory.filter(i => i !== item1 && i !== item2), 'Signierte Setliste']
            }));
            audio.playPickup();
            return true;
          }
          // Energiedrink + Kaffee = Turbo-Koffein
          if ((item1 === 'Energiedrink' && item2 === 'Kaffee') || (item1 === 'Kaffee' && item2 === 'Energiedrink')) {
            set((state) => ({
              inventory: [...state.inventory.filter(i => i !== item1 && i !== item2), 'Turbo-Koffein']
            }));
            audio.playPickup();
            return true;
          }
          // Schrottmetall + Lötkolben = Industrie-Talisman
          if ((item1 === 'Schrottmetall' && item2 === 'Lötkolben') || (item1 === 'Lötkolben' && item2 === 'Schrottmetall')) {
            set((state) => ({
              inventory: [...state.inventory.filter(i => i !== item1 && i !== item2), 'Industrie-Talisman']
            }));
            audio.playPickup();
            return true;
          }
          // Batterie + Lötkolben = Plasma-Zünder
          if ((item1 === 'Batterie' && item2 === 'Lötkolben') || (item1 === 'Lötkolben' && item2 === 'Batterie')) {
            set((state) => ({
              inventory: [...state.inventory.filter(i => i !== item1 && i !== item2), 'Plasma-Zünder']
            }));
            audio.playPickup();
            return true;
          }
          // Turbo-Koffein + Rostiges Plektrum = Geister-Drink
          if ((item1 === 'Turbo-Koffein' && item2 === 'Rostiges Plektrum') || (item1 === 'Rostiges Plektrum' && item2 === 'Turbo-Koffein')) {
            set((state) => ({
              inventory: [...state.inventory.filter(i => i !== item1 && i !== item2), 'Geister-Drink']
            }));
            audio.playPickup();
            return true;
          }

          // Splitter der Leere + Altes Plektrum = Void-Plektrum
          if ((item1 === 'Splitter der Leere' && item2 === 'Altes Plektrum') || (item1 === 'Altes Plektrum' && item2 === 'Splitter der Leere')) {
            set((state) => ({
              inventory: [...state.inventory.filter(i => i !== item1 && i !== item2), 'Void-Plektrum']
            }));
            audio.playPickup();
            return true;
          }
          // Frequenzfragment + Splitter der Leere = Resonanz-Kristall
          if ((item1 === 'Frequenzfragment' && item2 === 'Splitter der Leere') || (item1 === 'Splitter der Leere' && item2 === 'Frequenzfragment')) {
            set((state) => {
              const newInventory = [...state.inventory];
              const idx1 = newInventory.indexOf(item1);
              const idx2 = newInventory.indexOf(item2);
              // Remove higher index first to avoid index shifting
              const higher = Math.max(idx1, idx2);
              const lower = Math.min(idx1, idx2);
              newInventory.splice(higher, 1);
              newInventory.splice(lower, 1);
              newInventory.push('Resonanz-Kristall');
              return { inventory: newInventory };
            });
            audio.playPickup();
            return true;
          }
        }
        return false;
      },
      setFlag: (flag, value) => set((state) => ({ flags: { ...state.flags, [flag]: value } })),
      setPlayerPos: (playerPos) => set({ playerPos }),
      setPaused: (isPaused) => set({ isPaused }),
      addQuest: (id, text) => set((state) => ({ 
        quests: [...state.quests.filter(q => q.id !== id), { id, text, completed: false }] 
      })),
      completeQuest: (id) => set((state) => ({
        quests: state.quests.map(q => q.id === id ? { ...q, completed: true } : q)
      })),
      increaseBandMood: (amount) => set((state) => ({
        bandMood: Math.max(0, Math.min(100, state.bandMood + amount))
      })),
      setCameraShake: (cameraShake) => set({ cameraShake }),
      discoverLore: (id) => set((state) => {
        const entry = state.loreEntries.find(e => e.id === id);
        if (!entry || entry.discovered) {
          return state; // Avoid state update if lore doesn't exist or is already discovered
        }
        return {
          loreEntries: state.loreEntries.map(e => e.id === id ? { ...e, discovered: true } : e)
        };
      }),
      resetGame: () => set(initialState),
    }),
    {
      name: 'neurotoxic-game-storage',
      partialize: (state) => ({
        inventory: state.inventory,
        flags: state.flags,
        quests: state.quests,
        bandMood: state.bandMood,
        loreEntries: state.loreEntries,
        trait: state.trait,
        skills: state.skills,
      }),
      merge: (persistedState: unknown, currentState: GameState) => {
        const typedPersistedState = (persistedState !== null && typeof persistedState === 'object') ? persistedState as Partial<GameState> : {};

        const persistedQuests = Array.isArray(typedPersistedState.quests) ? typedPersistedState.quests : [];
        const persistedLore = Array.isArray(typedPersistedState.loreEntries) ? typedPersistedState.loreEntries : [];
        const persistedFlags = (typedPersistedState.flags !== null && typeof typedPersistedState.flags === 'object')
          ? typedPersistedState.flags
          : {};

        const mergedQuests = currentState.quests.map(q => {
          const persistedQuest = persistedQuests.find(pq => pq.id === q.id);
          return persistedQuest ? { ...q, completed: persistedQuest.completed } : q;
        });

        const dynamicQuests = persistedQuests.filter(pq =>
          !currentState.quests.find(q => q.id === pq.id)
        );

        const allQuests = [...mergedQuests, ...dynamicQuests];

        const mergedLoreEntries = currentState.loreEntries.map(e => {
          const persistedEntry = persistedLore.find(pe => pe.id === e.id);
          return persistedEntry ? { ...e, discovered: persistedEntry.discovered } : e;
        });

        return {
          ...currentState,
          ...typedPersistedState,
          scene: currentState.scene,
          playerPos: currentState.playerPos,
          quests: allQuests,
          loreEntries: mergedLoreEntries,
          flags: {
            ...currentState.flags,
            ...persistedFlags,
          }
        };
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (!state.flags.legacyLoreMigrated || state.flags.feedbackMonitorQuestStarted !== undefined) {
            setTimeout(() => {
              useStore.setState((currentState) => {
                const newEntries = [...currentState.loreEntries];
                let migratedLore = false;

                const migrateEntry = (id: string) => {
                  const idx = newEntries.findIndex(e => e.id === id);
                  if (idx !== -1 && !newEntries[idx].discovered) {
                    newEntries[idx] = { ...newEntries[idx], discovered: true };
                    migratedLore = true;
                  }
                };

                if (!currentState.flags.legacyLoreMigrated) {
                  if (currentState.flags.posterLoreRead) migrateEntry('poster_lore');
                  if (currentState.flags.forbiddenRiffFound) migrateEntry('forbidden_riff');
                  if (currentState.flags.egoContained) migrateEntry('ego_philosophy');
                  if (currentState.flags.tankwartPhilosophy) migrateEntry('tankwart_truth');
                  if (currentState.flags.cosmic_echo) migrateEntry('cosmic_echo_decoded');
                }

                const newFlags = { ...currentState.flags };

                // Migrate feedback monitor flags
                if (newFlags.feedbackMonitorQuestStarted !== undefined) {
                  if (newFlags.feedbackMonitorQuestStarted) {
                    // Backstage quest was started.
                    newFlags.feedbackMonitorBackstageTalked = true;
                    newFlags.feedbackMonitorBackstageQuestStarted = true;
                    if (newFlags.feedbackMonitorQuestCompleted) {
                      newFlags.feedbackMonitorBackstageQuestCompleted = true;
                    }
                  }
                  // Remove the unused flag
                  delete newFlags.feedbackMonitorQuestStarted;
                }

                newFlags.legacyLoreMigrated = true;

                let updatedQuests = currentState.quests;
                const fixCableQuestIndex = currentState.quests.findIndex(q => q.id === 'fix_cable');
                if (fixCableQuestIndex !== -1) {
                  updatedQuests = [...currentState.quests];
                  updatedQuests[fixCableQuestIndex] = {
                    ...updatedQuests[fixCableQuestIndex],
                    id: 'cable'
                  };
                }

                return {
                  loreEntries: migratedLore ? newEntries : currentState.loreEntries,
                  flags: newFlags,
                  ...(fixCableQuestIndex !== -1 && { quests: updatedQuests })
                };
              });
            }, 0);
          }
        }
      },
    }
  )
);
