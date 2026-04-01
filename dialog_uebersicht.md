# Neurotoxic – The Adventure: Komplette Dialog- und Interaktionsübersicht

_Aktualisiert für Phase 1-7 Erweiterungen (Maschinen-Seele, Frequenz 1982, Bassist-Quest, etc.)_

_Update 30.03.2026 (Environment Pass): Alle Szenen-Modelle/Setpieces visuell erweitert (`SceneEnvironmentSetpieces.tsx`). Keine Änderungen an Dialogbäumen, Quest-Triggern, Flag-Namen, Item-Logik oder BandMood-Werten._
_Update 30.03.2026 (Quest/Dialog Fixes): `final` wird im Finale zuerst als Quest angelegt und dann abgeschlossen; `amp` in der Kaminstube wird beim Reparieren fehlertolerant nachgetragen; `repair_amp` ist im Proberaum in einem linearen Run abschließbar (zusätzlicher Lötkolben-Pickup); fehlende Flags (`frequenzCalibrated`, `inschriftDecoded`, `magnetbandPlayed`, `showedRiffToMatze`, `talkingAmpRepaired`, `tankwartMysticDone`) sind nun im Store initialisiert._
_Update 31.03.2026 (Pickup-Limits): Item-Aufnahmen sind global limitiert; Interactables verschwinden nach Erreichen des Limits auch dann, wenn das Item später verbraucht wurde. Standardlimit: 1. Ausnahmen: `Bier` 2, `Lötkolben` 3, `Schrottmetall` 2, `Frequenzfragment` 2._
_Update 31.03.2026 (Inventory/UI & Reward-Safety): HUD-Inventar zeigt Duplikate als Stack (`Item xN`) und erlaubt doppelte Auswahl desselben Stacks für Crafting; `addToInventory` liefert Erfolg/Fehlschlag zurück und kritische Dialog-Rewards (Frequenzfragment/Bier) behandeln Limit-Fälle mit eigenem Feedback statt stiller Erfolgsannahme._
_Update 31.03.2026 (BandMood Anti-Farm): Positive BandMood-Boni aus demselben Dialog-/Interaktions-Callsite werden pro Run nur einmal gewährt (negative Deltas bleiben wiederholbar). Zusätzlich wurde die TR-8080-Quantenkabel-Belohnung im Proberaum um explizites Limit-Feedback ergänzt._
_Update 31.03.2026 (Dialogue Refactor): Proberaum-Dialoge (Matze, Lars, Marius, Objekte) aus `Proberaum.tsx` in dedizierte Builder-Funktionen unter `src/dialogues/proberaum/` extrahiert. Kein inhaltlicher Unterschied — alle Dialogbäume, Flags, Quest-Trigger und BandMood-Werte sind identisch. Neue Referenz-Dateien wurden dem Wartungshinweis hinzugefügt._
_Update 31.03.2026 (Scene Transition Pacing): Vorwärts-Übergänge zwischen Szenen (`Proberaum -> TourBus`, `Backstage -> VoidStation`, `VoidStation -> Kaminstube`, `Kaminstube -> Salzgitter`) nutzen nun einen kurzen Delay (1s) nach Exit-Dialog, inklusive Timeout-Cleanup beim Unmount, damit Übergänge nicht abrupt wirken._

> **Wartungshinweis:** Diese Datei muss bei jeder Änderung an `src/components/scenes/*.tsx`, `src/dialogues/**/*.ts` (einschließlich Dialogue-Builder-Funktionen in `src/dialogues/*/` Verzeichnissen) oder `src/store.ts` aktualisiert werden — insbesondere bei Änderungen an Quest-Triggern, Item-Vergabe, Flag-Namen (z. B. `frequenz_1982`, `askedAbout1982`, `marius_tourbus_doubt`, `bassist_clue_*`), BandMood-Deltas und Trait-Anforderungen. Änderungen ohne gleichzeitige Doku-Aktualisierung führen zu Inkonsistenzen zwischen Code und Übersicht. Referenz-Dateien: `src/components/scenes/`, `src/dialogues/proberaum/`, `src/dialogues/tourbus/`, `src/store.ts`.

Diese Übersicht fasst alle Dialogbäume, Interaktionen, freischaltbaren Lore-Einträge und deren Voraussetzungen (Traits, Skills, Items) aus allen Szenen zusammen.

---

## 1. Proberaum (Die Vorbereitung)

- **Zerrissenes Plakat:**
  - _Erstinteraktion:_ Liest die Geschichte der Tour 1999 (+5 BandMood, **Lore:** `poster_lore`).
  - _Wiederholte Interaktion:_ Erneut betrachten (kein Mood-Effekt mehr).
- **Das Verbotene Riff (Item):**
  - _Interaktion:_ Finden des Riffs (+15 BandMood, **Lore:** `forbidden_riff`, Erhalt: Verbotenes Riff).
- **Matze (Gitarrist):**
  - _Nach dem Aufwischen (Wasser aufgewischt):_ Option "Erzähl mir von der Tour 1982." öffnet einen Unterdialog.
    - Zweig A (Trait: Mystic): "Ich spüre eine Frequenz in den Wänden..." (Quest gestartet: `frequenz_1982`, setzt **immer** `bassist_clue_matze`; **bei erfolgreicher Aufnahme:** +25 BandMood, +4 Chaos, Erhalt: Frequenzfragment, setzt `matzeDeepTalk`, `frequenz1982_proberaum`).
    - Zweig B (Trait: Brutalist): "Lass mich die Wand einschlagen..." (Quest gestartet: `frequenz_1982`, setzt **immer** `bassist_clue_matze`; **bei erfolgreicher Aufnahme:** +10 BandMood, +3 Chaos, Erhalt: Frequenzfragment, setzt `proberaum_brutalist_smash`, `matzeDeepTalk`, `frequenz1982_proberaum`).
    - Zweig C (Trait: Visionary): "Ich sehe Muster im Lärm." (+30 BandMood, +5 Chaos, Lore: `matze_1982_truth`, setzt `matzeDeepTalk`).
    - Zweig D (Skill: Technical 5): Frequenz-Analyse (+20 BandMood, +3 Technical, setzt `matzeDeepTalk`).
    - Zweig E (Skill: Social 3): Beruhigen (+15 BandMood, +2 Social, setzt `matzeDeepTalk`).
    - Standard: "Interessante Geschichte." (+10 BandMood, setzt `askedAbout1982` und `bassist_clue_matze` — wichtig für Geist-Dialoge im TourBus und Backstage sowie für die Bassist-Questline).
  - _Sabotage-Verdacht:_ "Lars trommelt komisch" (startet `lars_proberaum_secret`).
  - _Vor dem Aufwischen:_ Bittet darum, das Wasser aufzuwischen.
    - "Ich kümmere mich darum" (kein Mood-Effekt).
    - "Neues Genre?" (-5 BandMood).
  - _Spezial (Trait: Cynic):_ Option, die Tour als "schlechten Witz" zu bezeichnen (+20 BandMood, +5 Chaos, setzt `matzeCynicOneShot`).
  - _Spezial (Trait: Performer):_ "Zeig mir, wie du die Crowd liest." (+20 BandMood, +3 Social, setzt `matzePerformerTalk`). **Setzt NICHT `matzeDeepTalk`** — 1982-Unterdialog bleibt erreichbar.
  - _BandMood > 60 Bonus:_ Matze ist hyped und will einen Power-Chord zeigen.
    - [Chaos 5]: Riss in der Wand (+15 BandMood, setzt `matzeRiffWarning`).
    - Standard: Aufheben für Salzgitter (setzt `matzeRiffWarning`).
  - _Item (Industrie-Talisman):_ Erkennt den Talisman.
    - Zweig A: "Für die Band" (+30 BandMood, setzt `matzeDeepTalk`).
    - Zweig B: "Geheimnis bewahren" (+15 BandMood, setzt `matzeDeepTalk`).
  - _Item (Verbotenes Riff):_ Begeisterung über den Fund (+30 BandMood, setzt `showedRiffToMatze`).
  - _Nach dem Aufwischen:_
    - Zweig A: "Rock on!" (+10 BandMood).
    - Zweig B: Frage nach 1982.
      - _Unterzweig (Trait: Visionary):_ "Muster im Lärm" (+30 BandMood, +5 Chaos, setzt `matzeDeepTalk`).
      - _Unterzweig (Skill: Technical 5):_ Frequenz-Analyse (+20 BandMood, +3 Technical, setzt `matzeDeepTalk`).
      - _Unterzweig (Skill: Social 3):_ Beruhigen (+15 BandMood, +2 Social, setzt `matzeDeepTalk`).
      - _Unterzweig (Standard):_ "Interessante Geschichte" (+10 BandMood, setzt `askedAbout1982` und `bassist_clue_matze` — wichtig für Geist-Dialoge im TourBus und Backstage sowie für die Bassist-Questline).
    - Zweig C: "Buchhaltung" (-2 BandMood).
- **Lars (Drummer):**
  - _Nach Rettung:_
    - Zweig A (Trait: Performer): "Bühne braucht dich" (+20 BandMood, +5 Social).
    - Zweig B (Skill: Technical 5): "Akustik optimieren" (+15 BandMood, +5 Technical).
    - Zweig C (Standard): "Gut trommeln" (+5 BandMood).
  - _Item (Turbo-Koffein):_ Nimmt das Koffein an (+10 BandMood, entfernt Item).
  - _Ohne Bier/Mop:_ Hinweis auf den Wischmopp-Standort.
  - _Item (Bier):_
    - Zweig A: Bier geben (+20 BandMood, entfernt Bier).
    - Zweig B: Frage nach Drum-Philosophie.
      - _Unterzweig (Skill: Chaos 3):_ Beat lehren (+20 BandMood, +2 Chaos, setzt `larsDrumPhilosophy`).
      - _Unterzweig (Skill: Technical 3):_ Schlagkraft-Analyse (+15 BandMood, +2 Technical, setzt `larsDrumPhilosophy`).
      - _Unterzweig (Standard):_ "Klingt anstrengend" (kein Mood-Effekt).
  - _Rhythmus-Pakt (Nachdem larsDrumPhilosophy gesetzt wurde):_
    - [Brutalist]: Aggressiver Pakt (+25 BandMood, +5 Chaos, Quest `rhythm_pact`, Lore `rhythm_pact`, setzt `larsRhythmPact`).
    - [Diplomat]: Harmonischer Pakt (+20 BandMood, +5 Social, Quest `rhythm_pact`, Lore `rhythm_pact`, setzt `larsRhythmPact`).
    - _Item (Bier):_ Bier geben (+20 BandMood, entfernt Bier, setzt `gaveBeerToLars`).
    - Standard: Bedenkzeit.
  - _Nach Rhythmus-Pakt (`larsRhythmPact` gesetzt):_
    - _Item (Bier):_ Bier geben (+20 BandMood, entfernt Bier, setzt `gaveBeerToLars`).
    - Standard: "Der Pakt steht." (kein Effekt).
- **Marius (Sänger):**
  - _Nach Bier (Wie bereitest du dich auf Salzgitter vor?):_
    - (Trait: Performer): Bühnenpräsenz-Coaching (+15 BandMood, +3 Social, setzt `mariusEgoStrategy`).
    - (Trait: Cynic): "Du wirst auf der Bühne sterben" (+10 BandMood, +3 Chaos, setzt `mariusEgoStrategy`).
    - (Skill: Social 7): Ego-Management-Plan (+20 BandMood, setzt `mariusEgoStrategy`).
    - Standard: "Bleib einfach cool" (kein Effekt).
    - _Nach Erstkontakt (BandMood > 50):_
      - Zweig A (Trait: Diplomat): "Marius, wie geht es dir wirklich? [Diplomat]" (+15 BandMood, +3 Social, setzt `mariusSelfDoubtRevealed` UND `marius_tourbus_doubt`). Option verschwindet danach (forbiddenFlags).
      - Zweig B (Trait: Cynic): "Dein Ego ist zu groß" (+5 BandMood, +2 Chaos, setzt `mariusEgoComplimented`). Option verschwindet danach (forbiddenFlags).
      - Standard: "Bereit für den Gig?" (kein Effekt).
  - _Ohne Bier:_ Fordert Bier.
    - (Item: Bier) "Hier ist dein Bier": Konsumiert Item 'Bier' (+15 BandMood, beendet Quest `beer`, setzt `gaveBeerToMarius`). **Schließt Quest `marius` NICHT ab — dieser wird erst im Backstage abgeschlossen.**
    - "Ich beeile mich" (kein Mood-Effekt).
    - "Trink doch Wasser" (-5 BandMood).
    - (Trait: Visionary): "Verstehe deine Vision" (+20 BandMood, +3 Social, setzt `mariusVisionShared`). Option verschwindet danach (forbiddenFlags).
    - (Skill: Social 5): "Beruhige dich, Star" (+15 BandMood, +2 Social, setzt `mariusCalmedDown`). Option verschwindet danach (forbiddenFlags). **Schließt Quest `marius` NICHT ab — dieser wird erst im Backstage abgeschlossen.**
- **Wischmopp (Item):**
  - _Interaktion:_ Aufheben (Erhalt: Mop).
- **Risse in der Wand (Proberaum, nachdem Wasser aufgewischt wurde):**
  - (Nutzt `Interactable`, `setDialogue` und `useStore`)
  - _Option (Trait: Visionary):_ "Die Risse... sie sind eine Partitur!"
    - _Erfolg:_ Fragment aufgenommen (Calls `store.addQuest('frequenz_1982', ...)` und `store.addToInventory('Frequenzfragment')` returns true → `store.increaseBandMood(15, 'frequenz1982_proberaum_visionary')`, setzt `frequenz1982_proberaum`, **Erfolg-Dialog:** "Du entschlüsselst die Wand!").
    - _Pickup-Limit:_ Inventar voll (`store.addToInventory` returns false → nur Limit-Dialog via `setDialogue`: "dein Inventar ist für weitere Frequenzfragmente bereits am Limit", kein BandMood, kein Flag).
  - _Option (Skill: Technical 8):_ "Die Resonanzfrequenz liegt bei exakt 432.1982 Hz."
    - _Erfolg:_ Fragment aufgenommen (Calls `store.addQuest('frequenz_1982', ...)` und `store.addToInventory('Frequenzfragment')` returns true → `store.increaseBandMood(15, 'frequenz1982_proberaum_technical')`, setzt `frequenz1982_proberaum`, **Erfolg-Dialog:** "Die Wand vibriert").
    - _Pickup-Limit:_ Inventar voll (`store.addToInventory` returns false → nur Limit-Dialog via `setDialogue`: "du kannst kein weiteres Frequenzfragment mehr aufnehmen", kein BandMood, kein Flag).
  - _Option (Neutral):_ "Interessantes Muster." (Zeigt Hinweis via `setDialogue`: "Einfach nur Risse. Aber sie sehen laut aus.")
- **Autoschlüssel (Item):**
  - _Interaktion:_ Aufheben (+10 BandMood, Quest-Abschluss: `keys`, Erhalt: Autoschlüssel).
- **Kühles Bier (Item):**
  - _Interaktion:_ Aufheben (Erhalt: Bier). _Kann insgesamt maximal 2x aufgenommen werden (globales Pickup-Limit), damit Marius/Lars-Pfade möglich bleiben, aber kein Infinite-Farming entsteht._
- **Mysteriöse Pfütze:**
  - _Interaktion (Item: Mop):_ Aufwischen (+20 BandMood, Quest-Abschluss: `water`).
- **Sprechender Amp (Existenzielle Krise):**
  - _Initial:_ Erzählt von der 5. Dimension. Bei Auswahl von "Was brauchst du?" (+2 BandMood, setzt `talkingAmpHeard`, Quest hinzugefügt: `repair_amp`).
  - _Nach Erstkontakt, vor Reparatur (Trait: Mystic, einmalig):_ "Ich höre eine andere Stimme in dir." (+10 BandMood, +2 Chaos, setzt `maschinen_seele_amp`, startet Quest `maschinen_seele` falls noch nicht aktiv). **Option verschwindet nach einmaligem Auslösen.**
  - _Reparatur (Lötkolben + Schrottmetall):_ Amp wird repariert (+20 BandMood, +5 Technical, Quest-Abschluss: `repair_amp`, setzt `talkingAmpRepaired`, entfernt Lötkolben, entfernt Schrottmetall). Zusätzliche Aufnahmen sind nur bis zum globalen Item-Limit möglich.
  - _Nach Reparatur:_ Bietet Therapie-Sitzung an (setzt `ampTherapyStarted`, Quest hinzugefügt: `amp_therapy`).
  - _Therapie-Sitzung:_
    - Option (Trait: Mystic): "Ich höre deine wahre Stimme, Amp" (+20 BandMood, Quest-Abschluss: `amp_therapy`, setzt `ampTherapyCompleted` & `ampSentient`).
    - Option (Trait: Diplomat): "Du bist ein Bewusstsein" (+30 BandMood, Quest-Abschluss: `amp_therapy`, setzt `ampTherapyCompleted`).
    - Option (Trait: Brutalist): "Du bist ein Werkzeug" (+10 BandMood, Quest-Abschluss: `amp_therapy`, setzt `ampTherapyCompleted`).
- **Lötkolben (Item):**
  - _Interaktion:_ Aufheben (Erhalt: Lötkolben). **Spawn in Proberaum und Backstage; globales Pickup-Limit: 3.**
- **Schrottmetall (Item):**
  - _Interaktion:_ Aufheben (Erhalt: Schrottmetall). **Globales Pickup-Limit: 2.**
- **Alte Batterie (Item):**
  - _Interaktion:_ Aufheben (Erhalt: Batterie).
- **Quanten-Kabel (Item):**
  - _Interaktion:_ Aufheben (Erhalt: Quanten-Kabel).
- **TR-8080 Drum Machine:**
  - _Item (Verbotenes Riff):_ Maschine absorbiert das Riff.
    - Zweig: "Schaltkreise füttern" (+25 BandMood, +10 Chaos, Erhalt: Quanten-Kabel, Quest-Abschluss: `drum_machine`).
- **Feedback-Monitor:**
  - _Initial:_ Fragt nach dem Quanten-Kabel (setzt `feedbackMonitorTalked`, Quest hinzugefügt: `feedback_monitor`).
  - _Quest (Item: Quanten-Kabel):_ Kabel übergeben (+20 BandMood, +5 Technical, Quest-Abschluss: `feedback_monitor`, entfernt Quanten-Kabel).

---

## 2. TourBus (Unterwegs)

- **Matze:**
  - _Ohne Kabel (BandMood < 20, Kabel noch nicht repariert):_ Klagt über schlechte Laune (kein Mood-Effekt, kein Optionsmenü).
  - _Ohne Kabel (20 <= BandMood < 30, Kabel noch nicht repariert):_ Klagt über das kaputte Kabel und die Stimmung (kein Mood-Effekt, kein Optionsmenü).
  - _Ohne Kabel (BandMood >= 30, Kabel noch nicht repariert, kein Sabotage-Verdacht):_
    - "Hast du Klebeband?" / "Ich suche danach." (Quest hinzugefügt: `cable` "Repariere Matzes Kabel mit Klebeband und defektem Kabel").
    - "Das Kabel wurde nicht gebrochen, es wurde durchtrennt." [Technical 5] (+20 BandMood, +5 Technical, setzt `tourbus_sabotage_discovered`, Lore: `tourbus_saboteur`, Quest gestartet: `tourbus_saboteur`).
    - "Vielleicht Schicksal." (-5 BandMood).
  - _Mit Repariertem Kabel (Angst vor Salzgitter?):_
    _(Alle Abschlussoptionen konsumieren "Repariertes Kabel", beenden Quest `cable` und setzen Flag `cableFixed`)_
    - [Visionary]: "Ich sehe unseren Sieg" (+15 BandMood).
    - [Technical 5]: "Soundcheck analysiert" (+20 BandMood, +3 Technical).
    - [Social 5]: "Wir schaffen das zusammen" (+15 BandMood, +3 Social).
    - "Ein bisschen schon" (kein BandMood).
    - "Lass uns die Bühne abreißen!" (+10 BandMood).
  - _Sabotage entdeckt & kein Geständnis (`tourbus_sabotage_discovered && !tourbus_matze_confession`):_
    - [Social 5]: \"Matze, ich glaube Marius zweifelt an der Band.\" – Matze gesteht: \"Oh Gott... ich war es! Ich hab das Kabel durchtrennt! Ich hatte solche Angst vor dem Gig in Salzgitter...\" (+10 BandMood, +3 Social, setzt `tourbus_matze_confession`, Quest-Abschluss: `tourbus_saboteur` mit Text \"Finde heraus, wer das Kabel sabotiert hat\").
    - [Brutalist]: \"Wer auch immer das war, kriegt eine Abreibung.\" – Matze schaut ertappt weg und schweigt schuldbewusst (-5 BandMood, keine Flag-Änderung, Quest bleibt offen).
    - Neutral: \"Wir finden den Schuldigen.\" – Matze antwortet: \"Ja... genau. Wir suchen weiter.\" (kein Mood-Effekt, keine Flag-Änderung, Quest bleibt offen).
  - _Kabel repariert (BandMood < 30):_ Klagt über schlechte Laune, ist aber froh, dass das Kabel funktioniert (kein Mood-Effekt, kein Optionsmenü).
  - _Kabel repariert (BandMood >= 30):_ Freut sich auf den Gig: "Wir sind bereit. Die Bühne gehört uns." (kein Mood-Effekt, kein Optionsmenü).
- **Band-Besprechung (Mitte des Busses, nachdem Sabotage entdeckt wurde, einmalig):**
  - _Startet und beendet Quest `band_meeting`, setzt Flag `tourbusBandMeeting`:_
  - (Trait: Diplomat): Vermitteln (+30 BandMood).
  - (Trait: Brutalist): Zusammenreißen (+20 BandMood).
  - (Trait: Performer): Motivationsrede (+25 BandMood).
  - Standard: Einfache Ansagen (+10 BandMood).
- **Marius:**
  - _Item (Marius Ego):_ Ego übergeben (+20 BandMood) ODER Ego behalten (-10 BandMood).
  - _BandMood < 30 (kein Ego):_ Nervenzusammenbruch — `marius_tourbus_doubt` wird beim Öffnen des Dialogs via `onInteract` gesetzt (nicht im Builder).
    - [Social 7]: Aufmuntern (+10 BandMood).
    - [Diplomat]: Fokussieren (+15 BandMood).
    - Standard: kein Effekt.
  - _BandMood >= 30 (kein Ego):_
    - [Performer]: Baut Selbstbewusstsein auf (+15 BandMood, +3 Social, setzt `marius_tourbus_doubt: false`).
    - Standard: kein Effekt.
- **Defekter Verstärker (Trait: Technician, einmalig):**
  - _Spezial-Option:_ Lötstelle reparieren (+20 BandMood, +10 Technical, setzt `tourbusAmpTechnician`).
- **Klebeband (Item):**
  - _Interaktion:_ Aufheben (Erhalt: Klebeband).
- **Defektes Kabel (Item):**
  - _Interaktion:_ Aufheben (Erhalt: Defektes Kabel).
- **Kaffee (Item, einmalig):**
  - _Interaktion:_ Aufheben (Erhalt: Kaffee, setzt `tourbusCoffeeCollected`).
- **Energiedrink (Item, einmalig):**
  - _Interaktion:_ Aufheben (Erhalt: Energiedrink, setzt `tourbusEnergyDrinkCollected`).
- **Bier-Vorrat (Item, einmalig):**
  - _Interaktion:_ Aufheben (Erhalt: Bier, setzt `tourbusBeerCollected`).
- **Vergessenes Notizbuch:**
  - _Interaktion:_ Lesen (+5 BandMood).
- **Rostiges Plektrum (Item, einmalig):**
  - _Interaktion:_ Aufheben (Erhalt: Rostiges Plektrum, setzt `rostigesPlektrumCollected`).
- **Verstecktes Fach (Nur nach Sabotage-Entdeckung):**
  - _Interaktion:_ Notiz einstecken — gibt "Geheime Notiz" (+2 Social, setzt `tourbusHiddenStashTaken`).
  - _Interaktion (Skill: Technical 3):_ Öffnen — gibt Frequenzfragment **nur wenn Quest `frequenz_1982` den Status `active` hat** (bei erfolgreicher Aufnahme: +10 BandMood, setzt `frequenz1982_tourbus`). Ohne aktive Quest: nur Notiz lesbar (kein Mood-Effekt). Bei erreichtem Pickup-Limit erscheint ein Hinweistext ohne Flag-Set und ohne +10 BandMood.
- **Batterie (Item):**
  - _Interaktion:_ Aufheben (Erhalt: Batterie).
- **Geist eines Roadies:**
  - _Standard-Interaktionen:_ Fragen stellen (+5 BandMood). Option "Kann ich dir helfen?" startet Quest `ghost_recipe` (setzt Flag `ghostRecipeQuestStarted`).
  - _Aktive Rezept-Quest (Erinnerung, wenn Geister-Drink fehlt):_ Zeigt direkten Reminder-Text ohne Auswahlmenü ("Hast du den Geister-Drink schon gemixt?"). _(Priorisiert über Lore-Text)_
  - _Aktive Rezept-Quest (Hat Geister-Drink):_ Rezept-Quest abschließen (**bei erfolgreichem Erhalt des Verstärker-Schaltplans:** +40 BandMood, +5 Social, Quest-Abschluss: `ghost_recipe`, setzt `ghostRecipeQuestCompleted`, entfernt Geister-Drink). _(Priorisiert über Lore-Text)_
  - _1982-Follow-up (Flag `askedAbout1982` gesetzt & `ghostSecretRevealed` nicht gesetzt):_
    - [Visionary]: "Erzähl mir alles." (+30 BandMood, +5 Chaos, setzt `ghostSecretRevealed`).
    - [Technical 7]: "Anomalie analysieren." (+25 BandMood, +4 Technical, setzt `ghostSecretRevealed`).
    - [Social 5]: "Geist beruhigen." (+20 BandMood, +3 Social, setzt `ghostSecretRevealed`, Lore: `roadie_bassist`).
    - Standard: "Erzähl mir alles." (+20 BandMood, setzt `ghostSecretRevealed`).
    - "Vielleicht später." (kein Mood-Effekt).
  - _bassist_clue_matze gesetzt & bassist_clue_ghost noch nicht gesetzt:_
    - Standard: "Matze hat geredet? Ich war dabei." (+15 BandMood, +3 Social, setzt `bassist_clue_ghost`).
    - [Mystic]: "Ich spüre seine Präsenz." (**bei erfolgreichem Erhalt der Bassist-Saite:** +20 BandMood, setzt `bassist_clue_ghost`).
  - _Vertrauens-Pfad (Wenn ghostSecretRevealed gesetzt & ghostTrustEarned noch nicht):_
    - [Mystic]: "Ich will dir wirklich helfen" (+25 BandMood, Quest `ghost_trust` start+finish, Lore `ghost_legacy`, setzt `ghostTrustEarned`).
    - [Social 7]: "Erzähl mir deine Geschichte" (+20 BandMood, Quest `ghost_trust` start+finish, Lore `ghost_legacy`, setzt `ghostTrustEarned`).
    - Standard: "Nur aus Neugier" (kein Effekt).
  - _Spezial-Items:_
    - _Item (Industrie-Talisman):_ Wahrheit (+20 BandMood, setzt `ghostSecretRevealed`) ODER Begraben (+5 BandMood).
    - _Item (Verbotenes Riff):_ "Für Metal" (+10 BandMood) ODER "Was für ein Preis?" (kein Mood-Effekt).
- **Ausgang:**
  - _Interaktion:_ Nur möglich, wenn "Repariertes Kabel" übergeben oder noch im Inventar ist (Matze hat ein Kabel). Wechselt zur Szene "backstage".

---

## 3. Backstage (Vor dem Gig)

- **Szene-Eintritt:** Registriert die Quest `setlist` (Finde die Setliste im Backstage).
- **Feedback-Monitor:**
  - _Erstkontakt ("Hallo?"):_ Setzt `feedbackMonitorBackstageTalked` (+5 BandMood). Innerer Dialog zeigt "Wie kann ich helfen?" → setzt `feedbackMonitorBackstageQuestStarted`, Quest hinzugefügt: `feedback_monitor_backstage`.
  - _Nach Erstkontakt (`feedbackMonitorBackstageTalked` gesetzt), wenn `ampSentient` gesetzt & Quest noch nicht gestartet:_ Option "Der Amp hat mir von dir erzählt" (+25 BandMood, +5 Technical, setzt `feedbackMonitorBackstageQuestStarted`, Quest hinzugefügt: `feedback_monitor_backstage`). **Diese Option hat Vorrang gegenüber "Wie kann ich dir helfen?".**
  - _Nach Erstkontakt, Quest noch nicht gestartet (kein `ampSentient`):_ "Wie kann ich dir helfen?" startet Quest `feedback_monitor_backstage` (setzt `feedbackMonitorBackstageQuestStarted`). **Verhindert permanente Quest-Blockade.**
  - _Quest gestartet, Item (Verstärker-Schaltplan):_
    - Zweig A (Skill: Technical 5): "Optimierte Frequenzen" (+30 BandMood, +5 Technical, Quest-Abschluss: `feedback_monitor_backstage`, setzt `feedbackMonitorBackstageQuestCompleted`).
    - Zweig B (Trait: Visionary): "Transzendente Frequenzen" (+40 BandMood, +5 Chaos, Quest-Abschluss: `feedback_monitor_backstage`, setzt `feedbackMonitorBackstageQuestCompleted`).
    - Zweig C: "Standard-Frequenzen" (+15 BandMood, Quest-Abschluss: `feedback_monitor_backstage`, setzt `feedbackMonitorBackstageQuestCompleted`).
  - _Quest abgeschlossen & beide Maschinen-Seele-Fragmente vorhanden (`maschinen_seele_amp` & `maschinen_seele_tr8080`):_
    - (Trait: Mystic): "Vereinige das Maschinen-Bewusstsein" (+40 BandMood, +5 Chaos, setzt `maschinen_seele_complete`, Quest-Abschluss: `maschinen_seele`, **Lore:** `maschinen_bewusstsein`).
    - (Skill: Technical 7): "Verbinde die Schaltkreise logisch" (+30 BandMood, +5 Technical, setzt `maschinen_seele_complete`, Quest-Abschluss: `maschinen_seele`, **Lore:** `maschinen_bewusstsein`).
    - Standard-Fallback: "Lass die Verbindung einfach laufen" (+20 BandMood, setzt `maschinen_seele_complete`, Quest-Abschluss: `maschinen_seele`, **Lore:** `maschinen_bewusstsein`). _(Kein Trait/Skill erforderlich.)_
- **Marius (Lampenfieber):**
  - _Optionen zur Beruhigung (Quest-Abschluss `marius` für jede, setzt `mariusCalmed`):_
    - _Bonus (Wenn mariusEgoStrategy gesetzt):_ "Erinnerst du dich an unsere Strategie?" (+35 BandMood, +5 Social, setzt `mariusConfidenceBoost`).
    - (Skill: Social 5): "Gott am Mikrofon" (+30 BandMood, +3 Social, setzt `mariusConfidenceBoost`).
    - (Trait: Performer): "Einziger Mensch auf der Bühne" (+30 BandMood, +3 Social, setzt `backstage_performer_speech`, setzt `mariusConfidenceBoost`).
    - (Trait: Mystic): "Lass die Frequenz durch dich fließen" (+25 BandMood, +3 Chaos, setzt `mariusConfidenceBoost`).
    - (Trait: Brutalist): "Angst ist Schwäche. Zerstöre sie" (+20 BandMood, +3 Chaos). **Hinweis: setzt NICHT `mariusConfidenceBoost`.**
    - (Flag `askedAbout1982` gesetzt): "Erinnerung an 1982" (+25 BandMood, setzt `mariusConfidenceBoost`).
    - "Lego-Trick" (+10 BandMood).
- **Lars (Energie-Mangel):**
  - _Item (Turbo-Koffein):_
    - _Bonus (Wenn larsRhythmPact gesetzt):_
      - [Chaos 5]: "Lass den Rhythmus explodieren!" (+50 BandMood, setzt `larsVibrating`, `larsEnergized`).
      - "Der Pakt hält." (+40 BandMood, setzt `larsEnergized`).
    - Auf Ex: (+40 BandMood, setzt `larsVibrating`, `larsEnergized`).
    - Nur ein Schluck (Trait: Diplomat): (+30 BandMood, +3 Social, setzt `lars_paced`, `larsEnergized`).
    - Nur ein Schluck (Standard): (+20 BandMood, setzt `larsEnergized`).
  - _Item (Energiedrink):_ (+10 BandMood, setzt `larsEnergized`). **Wenn `larsRhythmPact` gesetzt:** insgesamt +35 BandMood.
  - _Wenn Lars Vibriert:_
    - (Skill: Chaos 5): "Chaos" (+20 BandMood, +3 Chaos, setzt `larsDrumPhilosophy`).
    - (Skill: Technical 5): "Metronom" (+10 BandMood, setzt `larsDrumPhilosophy`).
- **Alte Blaupause (Nur wenn Sabotage entdeckt):**
  - _Option (Skill: Technical 7):_ Analysieren (+3 Technical, setzt `backstage_blueprint_found`, Hinweis auf 432Hz).
- **Setliste (Item):**
  - _Interaktion:_ Aufheben (Erhalt: Setliste, Quest-Abschluss: `setlist`).
- **Stift (Item):**
  - _Interaktion:_ Aufheben (Erhalt: Stift).
- **Lötkolben (Item):**
  - _Interaktion:_ Aufheben (Erhalt: Lötkolben). **Alternative Fundstelle: Proberaum.**
- **Ritual-Kreis:**
  - _Bandritual (Wenn mariusCalmed gesetzt & backstageRitualPerformed noch nicht):_
    - [Mystic]: Kosmisches Ritual (+35 BandMood, +5 Chaos, Quest `backstage_ritual`, setzt `backstageRitualPerformed`).
    - [Performer]: Showmanship Ritual (+30 BandMood, +5 Social, Quest `backstage_ritual`, setzt `backstageRitualPerformed`).
    - [Technician]: Frequenz-Anpassung (+25 BandMood, +5 Technical, Quest `backstage_ritual`, setzt `backstageRitualPerformed`).
    - Standard: Einfacher Chant (+15 BandMood, Quest `backstage_ritual`, setzt `backstageRitualPerformed`).
  - _Mit Resonanz-Kristall + Blaupause:_
    - (Trait: Mystic): Frequenz vollenden (+50 BandMood, entfernt `Resonanz-Kristall`, setzt `frequenz1982_complete`, Quest-Abschluss: `frequenz_1982`, Lore: `frequenz_1982_decoded`).
    - (Trait: Brutalist): Kristall zerschmettern (+40 BandMood, +5 Chaos, entfernt `Resonanz-Kristall`, setzt `frequenz1982_complete`, Quest-Abschluss: `frequenz_1982`, Lore: `frequenz_1982_decoded`).
  - _Mit Frequenzfragment + Blaupause:_
    - (Trait: Brutalist): Fragment zerschmettern (+40 BandMood, +5 Chaos, entfernt `Frequenzfragment`, setzt `frequenz1982_complete`, Quest-Abschluss: `frequenz_1982`, Lore: `frequenz_1982_decoded`).
  - _Item (Plasma-Zünder):_ Anzünden (+30 BandMood).
  - _Item (Verbotenes Riff):_ Resonanz (+15 BandMood).
  - _Standard:_ (+5 BandMood, einmalig, Quest hinzugefügt: backstage_ritual).

---

## 4. VoidStation (Die Realitäts-Grenze)

- **Kosmischer Tankwart:**
  - _Wenn ghostTrustEarned gesetzt:_ "Wir spielen für ihn in Salzgitter." (+20 BandMood, setzt `tankwartBargain`).
  - _Spezial (Trait: Mystic, einmalig — `tankwartMysticDone` noch nicht gesetzt):_ "Ich suche die Wahrheit" (+30 BandMood, Erhalt: Splitter der Leere, setzt `tankwartMysticDone`). Wird vor `ghostTrustEarned`-Zweig geprüft, sofern `ghostTrustEarned` noch nicht gesetzt ist. **Setzt NICHT `tankwartPhilosophy`** — ermöglicht Mystic-Spielern auch nach diesem Dialog das Betanken des Vans.
  - _Fallback-Text:_ Wenn `backstageRitualPerformed` gesetzt, reagiert der Tankwart mit einem ritualbewussten Begrüßungstext statt des Standard-Textes.
  - _Spezial (Trait: Cynic, einmalig):_ "Das ist doch alles Quatsch. Gib mir Sprit." (+15 BandMood, +3 Chaos, setzt `tankwartBargain`).
  - _Spezial (Trait: Performer, einmalig):_ "Ich spiele für dich, Tankwart." (+25 BandMood, +5 Social, setzt `tankwartBargain`).
  - _Item (Industrie-Talisman):_ "Lehre mich" (+20 BandMood, **Lore:** `tankwart_truth`) ODER "Gig spielen" (+5 BandMood).
  - _Item (Verbotenes Riff):_ "Ich bin bereit" (+15 BandMood) ODER nach Konsequenzen fragen.
  - _Item (Dunkle Materie):_ Van betanken mit 440Hz (+25 BandMood, Quest-Abschluss: `void`) ODER 432Hz (+10 BandMood, Quest-Abschluss: `void`).
    - _Spezial (Trait: Mystic, Item: Resonanz-Kristall):_ "Betanke ihn mit der Frequenz des Resonanz-Kristalls." (+40 BandMood, setzt `tankwart_fuel_quest_started`, Quest-Abschluss: `void`, entfernt Dunkle Materie).
  - _Quest-Abhängigkeit (cosmic_echo abgeschlossen):_ Auf das Echo ansprechen (+15 BandMood, **Lore:** `cosmic_echo_decoded`, setzt `tankwartPhilosophy`).
  - _Standard-Dialog:_
    - "Nur Treibstoff" (kein Mood-Effekt).
    - "Ultimatives Riff" (+5 BandMood).
- **Altes Terminal:**
  - _Interaktion:_ Logbuch lesen (+5 BandMood, **Lore:** `void_1982`).
- **Kosmisches Echo:**
  - _Option (Trait: Visionary):_ Nachricht entschlüsseln (+20 BandMood, Quest-Abschluss: `cosmic_echo`, **Lore:** `cosmic_echo_decoded`).
- **Marius' Ego (Item):**
  - _Hinweis: Egal welche Option gewählt wird, man erhält das Item "Marius' Ego" und schaltet **Lore:** `ego_philosophy` frei. Quest-Abschluss: `ego`._
  - _Bonus (Wenn mariusEgoStrategy):_ "Wende unsere Strategie an." (+35 BandMood).
  - _Bonus (Wenn marius_tourbus_doubt) (Trait: Diplomat):_ "Marius glaubt nicht mehr an sich. Du musst ihn retten." (+40 BandMood, +5 Social, setzt `mariusConfidenceBoost`).
  - Option (Trait: Visionary): "Vision leitet uns" (+30 BandMood, +5 Chaos).
  - Option (Skill: Technical 8): "Resonanzfrequenz instabil" (+20 BandMood, +5 Technical).
  - Option (Skill: Social 8): "Fans brauchen dich" (+25 BandMood, +5 Social).
  - Option (Trait: Brutalist): "Ich zwinge dich zurück!" (+15 BandMood, +3 Chaos).
  - Option (Trait: Diplomat): "Verhandeln wir." (+25 BandMood, +3 Social).
  - Standard: "Komm einfach mit" (+10 BandMood).
- **Dunkle Materie (Item):**
  - _Interaktion:_ Aufheben (Erhalt: Dunkle Materie).
- **Schwebender Bassist** _(erscheint nur wenn `bassist_clue_matze` & `bassist_clue_ghost` gesetzt und `bassist_contacted` noch nicht gesetzt):_
  - _Option (Skill: Social 8):_ "Die Band vermisst dich" (+25 BandMood, +3 Social, setzt `bassist_contacted`, `voidBassistSpoken`, Quest `bassist_mystery`, Lore `bassist_wahrheit`).
  - _Option (Skill: Technical 8):_ "Ich kann deine Frequenz messen" (+50 BandMood, +3 Technical, setzt `bassist_contacted`, `voidBassistSpoken`, Quest `bassist_mystery`, Lore `bassist_wahrheit`).
  - _Option (Trait: Mystic):_ "Ich höre deine Melodie" (+40 BandMood, +3 Chaos, setzt `bassist_contacted`, `voidBassistSpoken`, Quest `bassist_mystery`, Lore `bassist_wahrheit`).
  - _Option (Trait: Visionary):_ "Ich sehe dich zwischen den Dimensionen" (+40 BandMood, +3 Chaos, setzt `bassist_contacted`, `voidBassistSpoken`, Quest `bassist_mystery`, Lore `bassist_wahrheit`).
  - _Standard:_ "Ich lass dich besser in Ruhe" (kein Mood-Effekt).
- **Diplomaten-Interface:**
  - _Option (Trait: Diplomat):_ Verhandeln (+30 BandMood, +5 Social, setzt `void_diplomat_negotiation`, **Lore:** `schaltpult_record`).
  - _Standard (immer verfügbar):_ "Lies die Aufzeichnungen." (kein BandMood-Effekt, **Lore:** `schaltpult_record`). _(Macht die Lore für alle Traits erreichbar.)_
  - _Nach Verhandlung:_ "Status prüfen." (kein Effekt, Bestätigungsdialog).
- **Schwebende Magnetbänder:**
  - _Option (Skill: Technical 5):_ Band abspielen (+10 BandMood, +3 Technical, **Lore:** `magnetband_session`).
- **Frequenz-Detektor:**
  - _Standard-Interaktion:_ Warnung lesen (**Lore:** `frequenz_anomaly`).
  - _Option (Skill: Technical 6):_ Kalibrieren (+15 BandMood, +4 Technical).
- **Verbotene Inschrift:**
  - _Quest-Abhängigkeit (cosmic_echo abgeschlossen):_ Vollständig entschlüsseln (+20 BandMood, **Lore:** `inschrift_warning`).

---

## 5. Kaminstube (Nebenquest-Ort)

- **Flüsternder Kamin:**
  - _Option (Trait: Mystic):_ "Wärme fühlen" (+20 BandMood, Quest `forgotten_lore`, Lore `kamin_prophecy`, setzt `kaminFeuerPact`).
  - _Option (Trait: Diplomat):_ "Sprache deuten" (+20 BandMood, Quest `forgotten_lore`, Lore `kamin_prophecy`, setzt `kaminFeuerPact`).
  - _Option (Skill: Technical 8):_ "Akustik analysieren" (+15 BandMood, +3 Technical, Quest `forgotten_lore`, Lore `kamin_prophecy`, setzt `kaminFeuerPact`).
  - _Option (Skill: Chaos 7):_ "Feuer zwingen" (+10 BandMood, +3 Chaos, Quest `forgotten_lore`, Lore `kamin_prophecy`, setzt `kaminFeuerPact`).
- **Wirt:**
  - _BandMood > 80 & 1982 angesprochen / Geist-Geheimnis bekannt:_
    - _Bonus (Wenn ghostTrustEarned):_ "Der Geist hat mich geschickt." (+30 BandMood, Quest `wirt_legacy`, setzt `wirtLegacy1982`).
    - Option (Trait: Diplomat): "Ich bin vertrauenswürdig." (+25 BandMood, +5 Social, Quest `wirt_legacy`, setzt `wirtLegacy1982`).
    - Option (Skill: Social 7): "Es ist wichtig für die Band." (+20 BandMood, +3 Social, Quest `wirt_legacy`, setzt `wirtLegacy1982`).
    - Option (Skill: Chaos 5): "Die Wahrheit muss raus!" (+15 BandMood, +3 Chaos, Quest `wirt_legacy`, setzt `wirtLegacy1982`).
  - _Item (Industrie-Talisman):_ Erhält "Altes Plektrum" (wichtig für Matze in Salzgitter) (+20 BandMood, Erhalt: Altes Plektrum).
  - _BandMood > 80:_ Erzählt Details über das Verschwinden des Managers 1982 (+10 BandMood).
  - _Standard:_ Erhalt: Bier, solange Pickup-Limit nicht erreicht ist; bei Limit verweigert der Wirt weiteres Freibier mit eigener Antwort.
- **Ersatzröhre (Item):**
  - _Interaktion:_ Aufheben (Erhalt: Röhre). _Hinweis: Der Pickup wird versteckt, sobald die `amp` Quest abgeschlossen ist (oder `ampFixed` gesetzt ist)._
- **Kaputter Amp:**
  - _Item (Röhre):_ Reparieren (+30 BandMood, Quest-Abschluss: `amp`, entfernt Röhre). **Falls `amp` noch nicht aktiv ist, wird die Quest beim Reparieren zuerst erzeugt und dann abgeschlossen.** _(Hinweis: Nach Abschluss der `amp` Quest bleibt der Ersatzröhre-Pickup versteckt)._
- **Kaputter Drum-Computer:**
  - _Interaktion:_ Betrachten (+10 BandMood, einmalig — Flag: `kaminstubeDrumLoreHeard`).
- **Crowd:**
  - _Interaktion:_ Zujubeln (+5 BandMood).

---

- **Wirt (Geheimnis):**
  - _Wenn Bassist kontaktiert (Flag `bassist_contacted`) — läuft auch wenn `wirtSecretItem` bereits gesetzt:_
    - (Skill: Social 8): Zwingen (+20 BandMood, +5 Social, setzt `bassist_clue_wirt`, Lore: `wirt_confession`).
    - (Trait: Brutalist): Drohen (+15 BandMood, +5 Chaos, setzt `bassist_clue_wirt`, Lore: `wirt_vergangenheit`).
    - (Trait: Diplomat): Verzeihen (+30 BandMood, setzt `bassist_clue_wirt`, Lore: `wirt_vergangenheit`, Erhalt: Turbo-Koffein).
- **Matze:**
  - _Sabotage-Geständnis (Wenn Sabotage entdeckt & Amp repariert):_
    - (Trait: Diplomat): Vergeben (+30 BandMood, setzt `tourbus_matze_confession`, Quest-Abschluss: `tourbus_saboteur`).
    - (Trait: Brutalist): Warnen (+15 BandMood, setzt `tourbus_matze_confession`, Quest-Abschluss: `tourbus_saboteur`).
- **Marius:**
  - _Reaktionen auf Zustände:_
    - (Wenn mariusEgoStrategy gesetzt): "Strategie funktioniert" (+10 BandMood).
    - (Wenn egoContained gesetzt): "Mein Ego brennt in mir!"
    - Standard: "Underground Metal Fest!"
- **Lars:**
  - _Rhythmus der Schmiede:_
    - _Bonus (Wenn larsRhythmPact):_ "Ort hat eigenen Rhythmus." (+10 BandMood, setzt `kaminstube_lars_talked`).
    - (Skill: Technical 5): 120 BPM (+15 BandMood, +3 Technical, setzt `kaminstube_lars_talked`) ODER "Akustik perfekt" (+10 BandMood, +2 Technical).
    - (Skill: Chaos 5): Polyrhythmus (+20 BandMood, +3 Chaos, setzt `kaminstube_lars_talked`).
- **Crowd:**
  - _Menge anheizen:_
    - (Skill: Social 5): (+20 BandMood, +3 Social, setzt `kaminstube_crowd_rallied`).
    - (Skill: Chaos 7): (+25 BandMood, +4 Chaos, setzt `kaminstube_crowd_rallied`).
- **Flüsternder Kamin:**
  - _Option (Skill: Technical 7):_ Frequenz analysieren (+20 BandMood, +3 Technical).
  - _Option (Trait: Diplomat):_ Sprache deuten (+20 BandMood).

## 6. Salzgitter (Das Finale)

- **Matze:**
  - _Item (Verbotenes Riff + Void-Plektrum):_ Ultimativer Sound.
    - Option (Skill: Chaos 10): (+70 BandMood, +5 Chaos).
    - Option (Skill: Technical 10): (+60 BandMood, +5 Technical).
    - Standard: (+20 BandMood).
  - _Item (Verbotenes Riff + Altes Plektrum):_ Riff wird gebändigt.
    - Option (Skill: Chaos 10): (+50 BandMood, +5 Chaos).
    - Option (Skill: Technical 10): (+40 BandMood, +5 Technical).
    - Standard: (+20 BandMood).
  - _Deep Talk & Wirt Legacy 1982:_
    - Option (Trait: Mystic): "Frequenzen sind bereit" (+40 BandMood bei `backstageRitualPerformed`, sonst +20).
    - Standard: "Wir brechen den Fluch" (+20 BandMood).
- **Lars:**
  - _Wenn larsRhythmPact:_
    - _Bonus (Wenn larsVibrating):_ Hyperpowered Lars (+50 BandMood, +5 Chaos).
    - Standard: "Realität zertrümmern" (+30 BandMood).
- **Marius:**
  - _Trait (Performer):_ Spezial-Tipp für die erste Reihe geben (+30 BandMood, +5 Social).
  - _Unite Band (mariusEgoStrategy + mariusConfidenceBoost + egoContained):_
    - Wenn Band bereit (Matze & Lars Quests): "Die Band ist vereint." (+30 BandMood, Quest `unite_band`, setzt `salzgitterBandUnited`).
  - _Confidence Boost:_
    - (Wenn backstage_performer_speech): (+30 BandMood, +5 Social).
    - (Wenn egoContained & bassist_contacted): "Sing für den Bassisten" (+50 BandMood).
    - (Skill: Chaos 10): "Zorn kanalisieren" (+40 BandMood, +5 Chaos).
    - (Skill: Social 10): "Menge beruhigen" (+30 BandMood, +5 Social).

- **Fan:**
  - _Fan Movement Quest:_
    - (Trait: Performer): "Folgt mir!" (+35 BandMood, Quest `fan_movement`, setzt `fanMovement`).
    - (Skill: Social 8): "Zusammen singen!" (+30 BandMood, Quest `fan_movement`, setzt `fanMovement`).
    - (Trait: Diplomat): "Eins mit der Musik" (+25 BandMood, Quest `fan_movement`, setzt `fanMovement`).
  - _Item (Industrie-Talisman):_ Als Geschenk übergeben (+40 BandMood).
  - _Item (Signierte Setliste):_ Übergeben (+25 BandMood bei Umarmung / +15 bei Abstand).
  - _Diplomat Andenken:_ (+20 BandMood, setzt `gaveDiplomatSouvenir`).
- **Tour Erfolgreich:**
  - _Interaktion:_ Finale (+50 BandMood, Quest-Abschluss: `final`; Quest wird beim Triggern zuerst angelegt und anschließend abgeschlossen).

Das Finale in Salzgitter reagiert auf alle gesammelten Flags, Items und Skills. Die Endsequenz "Das Finale" wertet diese aus.

- **Marius (Frontmann):**
  - _Wenn `mariusConfidenceBoost` & `egoContained` & `bassist_contacted`:_
    - (Skill: Social 12): "Sing für den Bassisten" (+50 BandMood, setzt `salzgitter_true_ending`).
  - _Wenn `backstage_performer_speech`:_
    - (Trait: Performer): "Nimm die Halle" (+30 BandMood, +5 Social).
  - _Standard Confidence Boost:_ Chaos 10 (+40 BandMood) oder Social 10 (+30 BandMood).
- **Lars (Drummer):**
  - _Wenn `larsVibrating` & `larsDrumPhilosophy`:_
    - (Skill: Chaos 15): "Maschinen-Seele entfesseln" (+40 BandMood, +5 Chaos, setzt `salzgitter_encore_unlocked`).
    - (Skill: Technical 12): "Kinetische Energie" (+40 BandMood, +5 Technical, setzt `salzgitter_encore_unlocked`).
  - _Wenn `lars_paced`:_ (+25 BandMood).
- **Schwebender Bassist** _(erscheint wenn `bassist_contacted` gesetzt, verschwindet nach `bassist_restored`):_
  - _Wenn `voidBassistSpoken` & `bassist_mystery` abgeschlossen & kein Bassist-Saite & kein Resonanz-Kristall im Inventar (Auto-Restore):_ "Erinnert sich" (+30 BandMood, setzt `bassist_restored`).
  - _Wenn `voidBassistSpoken` gesetzt (aber Auto-Restore-Bedingungen nicht erfüllt — z.B. Quest noch offen oder Spezialitem im Inventar):_ Option "Du erinnerst dich an mich" (+20 BandMood, setzt **NICHT** `bassist_restored`).
  - _Item `Bassist-Saite` (Trait: Mystic):_ "Gib ihm die Bassist-Saite aus dem Echo" (+40 BandMood, entfernt `Bassist-Saite`, setzt `bassist_restored`, **Lore:** `bassist_wahrheit`).
  - _Item `Resonanz-Kristall`:_ "Nimm den Resonanz-Kristall. Vollende das Riff" (+30 BandMood, entfernt `Resonanz-Kristall`, setzt `bassist_restored`, **Lore:** `bassist_wahrheit`).
  - _Standard:_ "Wir sehen uns auf der anderen Seite" (kein Mood-Effekt).
- **Matze:**
  - _Item: Verbotenes Riff + Altes Plektrum:_ Chaos 10 (+50 BandMood) oder Technical 10 (+40 BandMood).
- **Fan:**
  - _Reagiert auf `backstage_performer_speech` oder `kaminstube_crowd_rallied` (+5 BandMood)._
  - _(Trait: Diplomat, einmalig — Flag `gaveDiplomatSouvenir` noch nicht gesetzt):_ Andenken geben (+20 BandMood, setzt `gaveDiplomatSouvenir`).
- **Das Finale (Multi-Outcome Ende):**
  - **[TRUE ENDING]:** Benötigt `salzgitter_true_ending` & `bassist_restored` & `maschinen_seele_complete`. (+100 BandMood, schaltet letzte Lore frei).
  - **[SECRET ENCORE]:** Benötigt `salzgitter_encore_unlocked`. (+50 BandMood).
  - **[BEST ENDING]:** Benötigt 4 oder mehr Finale-Flags (`salzgitterBandUnited`, `fanMovement`, `backstageRitualPerformed`, `wirtLegacy1982`, `voidBassistSpoken`) ODER (`frequenz1982_complete` & `mariusConfidenceBoost` & BandMood > 70). (+70 BandMood).
  - **[GOOD ENDING]:** Benötigt 2 oder mehr Finale-Flags ODER (`mariusConfidenceBoost` & BandMood > 70). (+50 BandMood).
  - **[STANDARD ENDING]:** Wenn keine Bedingungen erfüllt sind. (+30 BandMood).

---

## 7. Crafting & Items (Zustand Store)

- **Resonanz-Kristall:** Entsteht durch die Kombination von `Frequenzfragment` und `Splitter der Leere`.
- **Geister-Drink:** Entsteht durch die Kombination von `Turbo-Koffein` und `Rostiges Plektrum`. (Erforderlich für Ghost Roadie Quest).
- **Void-Plektrum:** Entsteht durch die Kombination von `Splitter der Leere` und `Altes Plektrum`.
