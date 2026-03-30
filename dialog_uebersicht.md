# Neurotoxic – The Adventure: Komplette Dialog- und Interaktionsübersicht

*Aktualisiert für Phase 1-7 Erweiterungen (Maschinen-Seele, Frequenz 1982, Bassist-Quest, etc.)*

> **Wartungshinweis:** Diese Datei muss bei jeder Änderung an `src/components/scenes/*.tsx` oder `src/store.ts` aktualisiert werden — insbesondere bei Änderungen an Quest-Triggern, Item-Vergabe, Flag-Namen (z. B. `frequenz_1982`, `askedAbout1982`, `marius_tourbus_doubt`, `bassist_clue_*`), BandMood-Deltas und Trait-Anforderungen. Änderungen ohne gleichzeitige Doku-Aktualisierung führen zu Inkonsistenzen zwischen Code und Übersicht. Referenz-Dateien: `Proberaum.tsx`, `TourBus.tsx`, `Backstage.tsx`, `VoidStation.tsx`, `Kaminstube.tsx`, `Salzgitter.tsx`, `store.ts`.

Diese Übersicht fasst alle Dialogbäume, Interaktionen, freischaltbaren Lore-Einträge und deren Voraussetzungen (Traits, Skills, Items) aus allen Szenen zusammen.

---

## 1. Proberaum (Die Vorbereitung)

* **Zerrissenes Plakat:**
    * *Erstinteraktion:* Liest die Geschichte der Tour 1999 (+5 BandMood, **Lore:** `poster_lore`).
    * *Wiederholte Interaktion:* Erneut betrachten (kein Mood-Effekt mehr).
* **Das Verbotene Riff (Item):**
    * *Interaktion:* Finden des Riffs (+15 BandMood, **Lore:** `forbidden_riff`, Erhalt: Verbotenes Riff).
* **Matze (Gitarrist):**
    * *Nach dem Aufwischen (Wasser aufgewischt):* Option "Erzähl mir von der Tour 1982." öffnet einen Unterdialog.
        * Zweig A (Trait: Mystic): "Ich spüre eine Frequenz in den Wänden..." (+25 BandMood, +4 Chaos, Erhalt: Frequenzfragment, Quest gestartet: `frequenz_1982`, setzt `bassist_clue_matze`, `frequenz1982_proberaum`, `matzeDeepTalk`).
        * Zweig B (Trait: Brutalist): "Lass mich die Wand einschlagen..." (+10 BandMood, +3 Chaos, Erhalt: Frequenzfragment, Quest gestartet: `frequenz_1982`, setzt `bassist_clue_matze`, `frequenz1982_proberaum`, `proberaum_brutalist_smash`, `matzeDeepTalk`).
        * Zweig C (Trait: Visionary): "Ich sehe Muster im Lärm." (+30 BandMood, +5 Chaos, Lore: `matze_1982_truth`, setzt `matzeDeepTalk`).
        * Zweig D (Skill: Technical 5): Frequenz-Analyse (+20 BandMood, +3 Technical, setzt `matzeDeepTalk`).
        * Zweig E (Skill: Social 3): Beruhigen (+15 BandMood, +2 Social, setzt `matzeDeepTalk`).
        * Standard: "Interessante Geschichte." (+10 BandMood, setzt `askedAbout1982` und `bassist_clue_matze` — wichtig für Geist-Dialoge im TourBus und Backstage sowie für die Bassist-Questline).
    * *Sabotage-Verdacht:* "Lars trommelt komisch" (startet `lars_proberaum_secret`).
    * *Vor dem Aufwischen:* Bittet darum, das Wasser aufzuwischen.
        * "Ich kümmere mich darum" (kein Mood-Effekt).
        * "Neues Genre?" (-5 BandMood).
    * *Spezial (Trait: Cynic):* Option, die Tour als "schlechten Witz" zu bezeichnen (+20 BandMood, +5 Chaos, setzt `mariusEgoStrategy`).
    * *Spezial (Trait: Performer):* "Zeig mir, wie du die Crowd liest." (+20 BandMood, +3 Social, setzt `matzePerformerTalk`). **Setzt NICHT `matzeDeepTalk`** — 1982-Unterdialog bleibt erreichbar.
    * *BandMood > 60 Bonus:* Matze ist hyped und will einen Power-Chord zeigen.
        * [Chaos 5]: Riss in der Wand (+15 BandMood, setzt `matzeRiffWarning`).
        * Standard: Aufheben für Salzgitter (setzt `matzeRiffWarning`).
    * *Item (Industrie-Talisman):* Erkennt den Talisman.
        * Zweig A: "Für die Band" (+30 BandMood, setzt `matzeDeepTalk`).
        * Zweig B: "Geheimnis bewahren" (+15 BandMood, setzt `matzeDeepTalk`).
    * *Item (Verbotenes Riff):* Begeisterung über den Fund (+30 BandMood, setzt `showedRiffToMatze`).
    * *Nach dem Aufwischen:*
        * Zweig A: "Rock on!" (+10 BandMood).
        * Zweig B: Frage nach 1982.
            * *Unterzweig (Trait: Visionary):* "Muster im Lärm" (+30 BandMood, +5 Chaos, setzt `matzeDeepTalk`).
            * *Unterzweig (Skill: Technical 5):* Frequenz-Analyse (+20 BandMood, +3 Technical, setzt `matzeDeepTalk`).
            * *Unterzweig (Skill: Social 3):* Beruhigen (+15 BandMood, +2 Social, setzt `matzeDeepTalk`).
            * *Unterzweig (Standard):* "Interessante Geschichte" (+10 BandMood, setzt `askedAbout1982` und `bassist_clue_matze` — wichtig für Geist-Dialoge im TourBus und Backstage sowie für die Bassist-Questline).
        * Zweig C: "Buchhaltung" (-2 BandMood).
* **Lars (Drummer):**
    * *Nach Rettung:*
        * Zweig A (Trait: Performer): "Bühne braucht dich" (+20 BandMood, +5 Social).
        * Zweig B (Skill: Technical 5): "Akustik optimieren" (+15 BandMood, +5 Technical).
        * Zweig C (Standard): "Gut trommeln" (+5 BandMood).
    * *Item (Turbo-Koffein):* Nimmt das Koffein an (+10 BandMood, entfernt Item).
    * *Ohne Bier/Mop:* Hinweis auf den Wischmopp-Standort.
    * *Item (Bier):*
        * Zweig A: Bier geben (+20 BandMood, entfernt Bier).
        * Zweig B: Frage nach Drum-Philosophie.
            * *Unterzweig (Skill: Chaos 3):* Beat lehren (+20 BandMood, +2 Chaos, setzt `larsDrumPhilosophy`).
            * *Unterzweig (Skill: Technical 3):* Schlagkraft-Analyse (+15 BandMood, +2 Technical, setzt `larsDrumPhilosophy`).
            * *Unterzweig (Standard):* "Klingt anstrengend" (kein Mood-Effekt).
    * *Rhythmus-Pakt (Nachdem larsDrumPhilosophy gesetzt wurde):*
        * [Brutalist]: Aggressiver Pakt (+25 BandMood, +5 Chaos, Quest `rhythm_pact`, Lore `rhythm_pact`, setzt `larsRhythmPact`).
        * [Diplomat]: Harmonischer Pakt (+20 BandMood, +5 Social, Quest `rhythm_pact`, Lore `rhythm_pact`, setzt `larsRhythmPact`).
        * *Item (Bier):* Bier geben (+20 BandMood, entfernt Bier, setzt `gaveBeerToLars`).
        * Standard: Bedenkzeit.
    * *Nach Rhythmus-Pakt (`larsRhythmPact` gesetzt):*
        * *Item (Bier):* Bier geben (+20 BandMood, entfernt Bier, setzt `gaveBeerToLars`).
        * Standard: "Der Pakt steht." (kein Effekt).
* **Marius (Sänger):**
    * *Nach Bier (Wie bereitest du dich auf Salzgitter vor?):*
        * (Trait: Performer): Bühnenpräsenz-Coaching (+15 BandMood, +3 Social, setzt `mariusEgoStrategy`).
        * (Trait: Cynic): "Du wirst auf der Bühne sterben" (+10 BandMood, +3 Chaos, setzt `mariusEgoStrategy`).
        * (Skill: Social 7): Ego-Management-Plan (+20 BandMood, setzt `mariusEgoStrategy`).
        * Standard: "Bleib einfach cool" (kein Effekt).
        * *Nach Erstkontakt (BandMood > 50):*
            * Zweig A (Trait: Diplomat): "Du bist der Frontmann" (+15 BandMood, +3 Social, setzt `marius_tourbus_doubt`).
            * Zweig B (Trait: Cynic): "Dein Ego ist zu groß" (+5 BandMood, +2 Chaos).
            * Standard: "Bereit für den Gig?" (kein Effekt).
    * *Ohne Bier:* Fordert Bier.
        * "Ich beeile mich" (kein Mood-Effekt).
        * "Trink doch Wasser" (-5 BandMood).
        * (Trait: Visionary): "Verstehe deine Vision" (+20 BandMood, +3 Social).
        * (Skill: Social 5): "Beruhige dich, Star" (+15 BandMood, +2 Social).
* **Wischmopp (Item):**
    * *Interaktion:* Aufheben (Erhalt: Mop).
* **Autoschlüssel (Item):**
    * *Interaktion:* Aufheben (+10 BandMood, Quest-Abschluss: `keys`, Erhalt: Autoschlüssel).
* **Kühles Bier (Item):**
    * *Interaktion:* Aufheben (+15 BandMood, Quest-Abschluss: `beer`, Erhalt: Bier).
* **Mysteriöse Pfütze:**
    * *Interaktion (Item: Mop):* Aufwischen (+20 BandMood, Quest-Abschluss: `water`).
* **Sprechender Amp (Existenzielle Krise):**
    * *Initial:* Erzählt von der 5. Dimension (+2 BandMood, setzt `talkingAmpHeard`, Quest hinzugefügt: `repair_amp`).
    * *Nach Erstkontakt, vor Reparatur (Trait: Mystic, einmalig):* "Ich höre eine andere Stimme in dir." (+10 BandMood, +2 Chaos, setzt `maschinen_seele_amp`, startet Quest `maschinen_seele` falls noch nicht aktiv). **Option verschwindet nach einmaligem Auslösen.**
    * *Reparatur (Lötkolben + Schrottmetall):* Amp wird repariert (+20 BandMood, +5 Technical, Quest-Abschluss: `repair_amp`, setzt `talkingAmpRepaired`).
    * *Nach Reparatur:* Bietet Therapie-Sitzung an (setzt `ampTherapyStarted`, Quest hinzugefügt: `amp_therapy`).
    * *Therapie-Sitzung:*
        * Option (Trait: Mystic): "Ich höre deine wahre Stimme, Amp" (+20 BandMood, Quest-Abschluss: `amp_therapy`, setzt `ampTherapyCompleted` & `ampSentient`).
        * Option (Trait: Diplomat): "Du bist ein Bewusstsein" (+30 BandMood, Quest-Abschluss: `amp_therapy`, setzt `ampTherapyCompleted`).
        * Option (Trait: Brutalist): "Du bist ein Werkzeug" (+10 BandMood, Quest-Abschluss: `amp_therapy`, setzt `ampTherapyCompleted`).
* **Schrottmetall (Item):**
    * *Interaktion:* Aufheben (Erhalt: Schrottmetall).
* **Alte Batterie (Item):**
    * *Interaktion:* Aufheben (Erhalt: Batterie).
* **Quanten-Kabel (Item):**
    * *Interaktion:* Aufheben (Erhalt: Quanten-Kabel).
* **TR-8080 Drum Machine:**
    * *Item (Verbotenes Riff):* Maschine absorbiert das Riff.
        * Zweig: "Schaltkreise füttern" (+25 BandMood, +10 Chaos, Erhalt: Quanten-Kabel).
* **Feedback-Monitor:**
    * *Initial:* Fragt nach dem Quanten-Kabel (setzt `feedbackMonitorTalked`, Quest hinzugefügt: `feedback_monitor`).
    * *Nach Erstkontakt (`feedbackMonitorTalked` gesetzt), wenn `ampSentient` gesetzt:* "Der Amp hat mir von dir erzählt" (+25 BandMood, +5 Technical, startet Quest). **Option erscheint erst nach dem ersten Gespräch.**
    * *Quest (Item: Quanten-Kabel):* Kabel übergeben (+20 BandMood, +5 Technical, Quest-Abschluss: `feedback_monitor`, entfernt Quanten-Kabel).

---

## 2. TourBus (Unterwegs)

* **Matze:**
    * *Ohne Kabel (BandMood < 20):* Klagt über schlechte Laune (kein Mood-Effekt, kein Optionsmenü).
    * *Ohne Kabel (BandMood >= 20, kein Sabotage-Verdacht):*
        * "Ich suche danach." (Quest hinzugefügt: `cable`).
        * "Das Kabel wurde nicht gebrochen, es wurde durchtrennt." [Technical 5] (+20 BandMood, +5 Technical, setzt `tourbus_sabotage_discovered`, Lore: `tourbus_saboteur`, Quest gestartet: `tourbus_saboteur`).
        * "Vielleicht Schicksal." (-5 BandMood).
    * *Mit Repariertem Kabel (Angst vor Salzgitter?):*
        * [Visionary]: "Ich sehe unseren Sieg" (+15 BandMood, Quest-Abschluss: `cable`).
        * [Technical 5]: "Soundcheck analysiert" (+20 BandMood, +3 Technical, Quest-Abschluss: `cable`).
        * [Social 5]: "Wir schaffen das zusammen" (+15 BandMood, +3 Social, Quest-Abschluss: `cable`).
        * "Ein bisschen schon" (kein BandMood, Quest-Abschluss: `cable`).
        * "Lass uns die Bühne abreißen!" (+10 BandMood, Quest-Abschluss: `cable`).
    * *Sabotage entdeckt & `marius_tourbus_doubt` gesetzt & kein Geständnis:*
        * [Social 5]: Matze gesteht Sabotage (+10 BandMood, +3 Social, setzt `tourbus_matze_confession`, Quest-Abschluss: `tourbus_saboteur`).
        * [Brutalist]: Schweigend ertappt (-5 BandMood).
* **Band-Besprechung (Mitte des Busses, nachdem Sabotage entdeckt wurde):**
    * (Trait: Diplomat): Vermitteln (+30 BandMood, Quest `band_meeting`, setzt `tourbusBandMeeting`).
    * (Trait: Brutalist): Zusammenreißen (+20 BandMood, Quest `band_meeting`, setzt `tourbusBandMeeting`).
    * (Trait: Performer): Motivationsrede (+25 BandMood, Quest `band_meeting`, setzt `tourbusBandMeeting`).
    * Standard: Einfache Ansagen (+10 BandMood, Quest `band_meeting`, setzt `tourbusBandMeeting`).
* **Marius:**
    * *Item (Marius Ego):* Ego übergeben (+20 BandMood) ODER Ego behalten (-10 BandMood).
    * *BandMood < 30 (kein Ego):* Nervenzusammenbruch — Anzeige des Dialogs setzt automatisch `marius_tourbus_doubt: true`.
        * [Social 7]: Aufmuntern (+10 BandMood).
        * [Diplomat]: Fokussieren (+15 BandMood).
        * Standard: kein Effekt.
    * *BandMood >= 30 (kein Ego):*
        * [Performer]: Baut Selbstbewusstsein auf (+15 BandMood, +3 Social, setzt `marius_tourbus_doubt: false`).
        * Standard: kein Effekt.
* **Defekter Verstärker (Trait: Technician):**
    * *Spezial-Option:* Lötstelle reparieren (+20 BandMood, +10 Technical).
* **Klebeband (Item):**
    * *Interaktion:* Aufheben (Erhalt: Klebeband).
* **Defektes Kabel (Item):**
    * *Interaktion:* Aufheben (Erhalt: Defektes Kabel).
* **Kaffee (Item):**
    * *Interaktion:* Aufheben (Erhalt: Kaffee).
* **Energiedrink (Item):**
    * *Interaktion:* Aufheben (Erhalt: Energiedrink).
* **Bier-Vorrat (Item):**
    * *Interaktion:* Aufheben (Erhalt: Bier).
* **Vergessenes Notizbuch:**
    * *Interaktion:* Lesen (+5 BandMood).
* **Rostiges Plektrum (Item):**
    * *Interaktion:* Aufheben (Erhalt: Rostiges Plektrum).
* **Verstecktes Fach (Nur nach Sabotage-Entdeckung):**
    * *Interaktion (Skill: Technical 3):* Öffnen — gibt Frequenzfragment **nur wenn Quest `frequenz_1982` bereits aktiv** (+10 BandMood, Erhalt: Frequenzfragment, setzt `frequenz1982_tourbus`). Ohne aktive Quest: nur Notiz lesbar.
* **Batterie (Item):**
    * *Interaktion:* Aufheben (Erhalt: Batterie).
* **Geist eines Roadies:**
    * *Standard-Interaktionen:* Fragen stellen (+5 BandMood). Option "Kann ich dir helfen?" startet Quest `ghost_recipe`.
    * *Nach Drink (Item: Geister-Drink):* Rezept-Quest (+40 BandMood, +5 Social, Erhalt: Verstärker-Schaltplan, Quest-Abschluss: `ghost_recipe`, entfernt Geister-Drink).
    * *bassist_clue_matze gesetzt & bassist_clue_ghost noch nicht gesetzt:*
        * Standard: "Matze hat geredet? Ich war dabei." (+15 BandMood, +3 Social, setzt `bassist_clue_ghost`).
        * [Mystic]: "Ich spüre seine Präsenz." (+20 BandMood, setzt `bassist_clue_ghost`, Erhalt: Bassist-Saite).
    * *1982-Follow-up (Flag `askedAbout1982` gesetzt):*
        * [Visionary]: "Erzähl mir alles." (+30 BandMood, +5 Chaos, setzt `ghostSecretRevealed`).
        * [Technical 7]: "Anomalie analysieren." (+25 BandMood, +4 Technical, setzt `ghostSecretRevealed`).
        * [Social 5]: "Geist beruhigen." (+20 BandMood, +3 Social, setzt `ghostSecretRevealed`, Lore: `roadie_bassist`).
        * Standard: "Erzähl mir alles." (+20 BandMood, setzt `ghostSecretRevealed`).
        * "Vielleicht später." (kein Mood-Effekt).
    * *Vertrauens-Pfad (Wenn ghostSecretRevealed & askedAbout1982 gesetzt):*
        * [Mystic]: "Ich will dir wirklich helfen" (+25 BandMood, Quest `ghost_trust`, Lore `ghost_legacy`, setzt `ghostTrustEarned`).
        * [Social 7]: "Erzähl mir deine Geschichte" (+20 BandMood, Quest `ghost_trust`, Lore `ghost_legacy`, setzt `ghostTrustEarned`).
        * Standard: "Nur aus Neugier".
    * *Spezial-Items:*
        * *Item (Industrie-Talisman):* Wahrheit (+20 BandMood, setzt `ghostSecretRevealed`) ODER Begraben (+5 BandMood).
        * *Item (Verbotenes Riff):* "Für Metal" (+10 BandMood) ODER "Was für ein Preis?" (kein Mood-Effekt).

---

## 3. Backstage (Vor dem Gig)

* **Feedback-Monitor:**
    * *Erstkontakt ("Hallo?"):* Setzt `feedbackMonitorBackstageTalked` (+5 BandMood). Innerer Dialog zeigt "Wie kann ich helfen?" → setzt `feedbackMonitorBackstageQuestStarted`, Quest hinzugefügt: `feedback_monitor_backstage`.
    * *Nach Erstkontakt, Quest noch nicht gestartet:* "Wie kann ich dir helfen?" startet Quest `feedback_monitor_backstage` (setzt `feedbackMonitorBackstageQuestStarted`). **Verhindert permanente Quest-Blockade.**
    * *Quest gestartet, Item (Verstärker-Schaltplan):*
        * Zweig A (Skill: Technical 5): "Optimierte Frequenzen" (+30 BandMood, +5 Technical, Quest-Abschluss: `feedback_monitor_backstage`, setzt `feedbackMonitorBackstageQuestCompleted`).
        * Zweig B (Trait: Visionary): "Transzendente Frequenzen" (+40 BandMood, +5 Chaos, Quest-Abschluss: `feedback_monitor_backstage`, setzt `feedbackMonitorBackstageQuestCompleted`).
        * Zweig C: "Standard-Frequenzen" (+15 BandMood, Quest-Abschluss: `feedback_monitor_backstage`, setzt `feedbackMonitorBackstageQuestCompleted`).
    * *Quest abgeschlossen & beide Maschinen-Seele-Fragmente vorhanden (`maschinen_seele_amp` & `maschinen_seele_tr8080`):*
        * (Trait: Mystic): "Vereinige das Maschinen-Bewusstsein" (+40 BandMood, +5 Chaos, setzt `maschinen_seele_complete`, Quest-Abschluss: `maschinen_seele`, **Lore:** `maschinen_bewusstsein`).
        * (Skill: Technical 7): "Verbinde die Schaltkreise logisch" (+30 BandMood, +5 Technical, setzt `maschinen_seele_complete`, Quest-Abschluss: `maschinen_seele`, **Lore:** `maschinen_bewusstsein`).
        * Standard-Fallback: "Lass die Verbindung einfach laufen" (+20 BandMood, setzt `maschinen_seele_complete`, Quest-Abschluss: `maschinen_seele`, **Lore:** `maschinen_bewusstsein`). *(Kein Trait/Skill erforderlich.)*
* **Marius (Lampenfieber):**
    * *Optionen zur Beruhigung (Quest-Abschluss `marius` für jede, setzt `mariusCalmed`):*
        * *Bonus (Wenn mariusEgoStrategy gesetzt):* "Erinnerst du dich an unsere Strategie?" (+35 BandMood, +5 Social, setzt `mariusConfidenceBoost`).
        * (Skill: Social 5): "Gott am Mikrofon" (+30 BandMood, +3 Social, setzt `mariusConfidenceBoost`).
        * (Trait: Performer): "Einziger Mensch auf der Bühne" (+30 BandMood, +3 Social, setzt `backstage_performer_speech`, setzt `mariusConfidenceBoost`).
        * (Trait: Mystic): "Lass die Frequenz durch dich fließen" (+25 BandMood, +3 Chaos, setzt `mariusConfidenceBoost`).
        * (Trait: Brutalist): "Angst ist Schwäche. Zerstöre sie" (+20 BandMood, +3 Chaos). **Hinweis: setzt NICHT `mariusConfidenceBoost`.**
        * (Flag `askedAbout1982` gesetzt): "Erinnerung an 1982" (+25 BandMood, setzt `mariusConfidenceBoost`).
        * "Lego-Trick" (+10 BandMood).
* **Lars (Energie-Mangel):**
    * *Item (Turbo-Koffein):*
        * *Bonus (Wenn larsRhythmPact gesetzt):*
            * [Chaos 5]: "Lass den Rhythmus explodieren!" (+50 BandMood, setzt `larsVibrating`, `larsEnergized`).
            * "Der Pakt hält." (+40 BandMood, setzt `larsEnergized`).
        * Auf Ex: (+40 BandMood, setzt `larsVibrating`, `larsEnergized`).
        * Nur ein Schluck (Trait: Diplomat): (+30 BandMood, +3 Social, setzt `lars_paced`, `larsEnergized`).
        * Nur ein Schluck (Standard): (+20 BandMood, setzt `larsEnergized`).
    * *Item (Energiedrink):* (+10 BandMood, setzt `larsEnergized`). **Wenn `larsRhythmPact` gesetzt:** insgesamt +35 BandMood.
    * *Wenn Lars Vibriert:*
        * (Skill: Chaos 5): "Chaos" (+20 BandMood, +3 Chaos, setzt `larsDrumPhilosophy`).
        * (Skill: Technical 5): "Metronom" (+10 BandMood, setzt `larsDrumPhilosophy`).
* **Alte Blaupause (Nur wenn Sabotage entdeckt):**
    * *Option (Skill: Technical 7):* Analysieren (+3 Technical, setzt `backstage_blueprint_found`, Hinweis auf 432Hz).
* **Setliste (Item):**
    * *Interaktion:* Aufheben (Erhalt: Setliste, Quest-Abschluss: `setlist`).
* **Stift (Item):**
    * *Interaktion:* Aufheben (Erhalt: Stift).
* **Lötkolben (Item):**
    * *Interaktion:* Aufheben (Erhalt: Lötkolben).
* **Ritual-Kreis:**
    * *Bandritual (Wenn mariusCalmed gesetzt & backstageRitualPerformed noch nicht):*
        * [Mystic]: Kosmisches Ritual (+35 BandMood, +5 Chaos, Quest `backstage_ritual`, setzt `backstageRitualPerformed`).
        * [Performer]: Showmanship Ritual (+30 BandMood, +5 Social, Quest `backstage_ritual`, setzt `backstageRitualPerformed`).
        * [Technician]: Frequenz-Anpassung (+25 BandMood, +5 Technical, Quest `backstage_ritual`, setzt `backstageRitualPerformed`).
        * Standard: Einfacher Chant (+15 BandMood, Quest `backstage_ritual`, setzt `backstageRitualPerformed`).
    * *Mit Resonanz-Kristall + Blaupause:*
        * (Trait: Mystic): Frequenz vollenden (+50 BandMood, entfernt `Resonanz-Kristall`, setzt `frequenz1982_complete`, Lore: `frequenz_1982_decoded`).
    * *Mit Frequenzfragment + Blaupause:*
        * (Trait: Brutalist): Fragment zerschmettern (+40 BandMood, +5 Chaos, Item verloren, setzt `frequenz1982_complete`).
    * *Item (Plasma-Zünder):* Anzünden (+30 BandMood).
    * *Item (Verbotenes Riff):* Resonanz (+15 BandMood).
    * *Standard:* (+5 BandMood, einmalig, Quest hinzugefügt: backstage_ritual).

---

## 4. VoidStation (Die Realitäts-Grenze)

* **Kosmischer Tankwart:**
    * *Wenn ghostTrustEarned gesetzt:* "Wir spielen für ihn in Salzgitter." (+20 BandMood, setzt `tankwartBargain`).
    * *Spezial (Trait: Mystic):* "Ich suche die Wahrheit" (+30 BandMood, Erhalt: Splitter der Leere).
    * *Fallback-Text:* Wenn `backstageRitualPerformed` gesetzt, reagiert der Tankwart mit einem ritualbewussten Begrüßungstext statt des Standard-Textes.
    * *Spezial (Trait: Cynic, einmalig):* "Das ist doch alles Quatsch. Gib mir Sprit." (+15 BandMood, +3 Chaos, setzt `tankwartBargain`).
    * *Spezial (Trait: Performer, einmalig):* "Ich spiele für dich, Tankwart." (+25 BandMood, +5 Social, setzt `tankwartBargain`).
    * *Item (Industrie-Talisman):* "Lehre mich" (+20 BandMood, **Lore:** `tankwart_truth`) ODER "Gig spielen" (+5 BandMood).
    * *Item (Verbotenes Riff):* "Ich bin bereit" (+15 BandMood) ODER nach Konsequenzen fragen.
    * *Item (Dunkle Materie):* Van betanken mit 440Hz (+25 BandMood, Quest-Abschluss: `void`) ODER 432Hz (+10 BandMood, Quest-Abschluss: `void`).
    * *Quest-Abhängigkeit (cosmic_echo abgeschlossen):* Auf das Echo ansprechen (+15 BandMood, **Lore:** `cosmic_echo_decoded`, setzt `tankwartPhilosophy`).
    * *Standard-Dialog:*
        * "Nur Treibstoff" (kein Mood-Effekt).
        * "Ultimatives Riff" (+5 BandMood).
* **Altes Terminal:**
    * *Interaktion:* Logbuch lesen (+5 BandMood, **Lore:** `void_1982`).
* **Kosmisches Echo:**
    * *Option (Trait: Visionary):* Nachricht entschlüsseln (+20 BandMood, Quest-Abschluss: `cosmic_echo`, **Lore:** `cosmic_echo_decoded`).
* **Marius' Ego (Item):**
    * *Hinweis: Egal welche Option gewählt wird, man erhält das Item "Marius' Ego" und schaltet **Lore:** `ego_philosophy` frei. Quest-Abschluss: `ego`.*
    * *Bonus (Wenn mariusEgoStrategy):* "Wende unsere Strategie an." (+35 BandMood).
    * *Bonus (Wenn marius_tourbus_doubt) (Trait: Diplomat):* "Marius glaubt nicht mehr an sich. Du musst ihn retten." (+40 BandMood, +5 Social, setzt `mariusConfidenceBoost`).
    * Option (Trait: Visionary): "Vision leitet uns" (+30 BandMood, +5 Chaos).
    * Option (Skill: Technical 8): "Resonanzfrequenz instabil" (+20 BandMood, +5 Technical).
    * Option (Skill: Social 8): "Fans brauchen dich" (+25 BandMood, +5 Social).
    * Option (Trait: Brutalist): "Ich zwinge dich zurück!" (+15 BandMood, +3 Chaos).
    * Option (Trait: Diplomat): "Verhandeln wir." (+25 BandMood, +3 Social).
    * Standard: "Komm einfach mit" (+10 BandMood).
* **Dunkle Materie (Item):**
    * *Interaktion:* Aufheben (Erhalt: Dunkle Materie).
* **Schwebender Bassist** *(erscheint nur wenn `bassist_clue_matze` & `bassist_clue_ghost` gesetzt und `bassist_contacted` noch nicht gesetzt):*
    * *Option (Skill: Social 8):* "Die Band vermisst dich" (+25 BandMood, +3 Social, setzt `bassist_contacted`, `voidBassistSpoken`, Quest `bassist_mystery`, Lore `bassist_wahrheit`).
    * *Option (Skill: Technical 8):* "Ich kann deine Frequenz messen" (+50 BandMood, +3 Technical, setzt `bassist_contacted`, `voidBassistSpoken`, Quest `bassist_mystery`, Lore `bassist_wahrheit`).
    * *Option (Trait: Mystic):* "Ich höre deine Melodie" (+40 BandMood, +3 Chaos, setzt `bassist_contacted`, `voidBassistSpoken`, Quest `bassist_mystery`, Lore `bassist_wahrheit`).
    * *Option (Trait: Visionary):* "Ich sehe dich zwischen den Dimensionen" (+40 BandMood, +3 Chaos, setzt `bassist_contacted`, `voidBassistSpoken`, Quest `bassist_mystery`, Lore `bassist_wahrheit`).
    * *Standard:* "Ich lass dich besser in Ruhe" (kein Mood-Effekt).
* **Diplomaten-Interface:**
    * *Option (Trait: Diplomat):* Verhandeln (+30 BandMood, +5 Social, setzt `void_diplomat_negotiation`, **Lore:** `schaltpult_record`).
    * *Standard (immer verfügbar):* "Lies die Aufzeichnungen." (kein BandMood-Effekt, **Lore:** `schaltpult_record`). *(Macht die Lore für alle Traits erreichbar.)*
    * *Nach Verhandlung:* "Status prüfen." (kein Effekt, Bestätigungsdialog).
* **Schwebende Magnetbänder:**
    * *Option (Skill: Technical 5):* Band abspielen (+10 BandMood, +3 Technical, **Lore:** `magnetband_session`).
* **Frequenz-Detektor:**
    * *Standard-Interaktion:* Warnung lesen (**Lore:** `frequenz_anomaly`).
    * *Option (Skill: Technical 6):* Kalibrieren (+15 BandMood, +4 Technical).
* **Verbotene Inschrift:**
    * *Quest-Abhängigkeit (cosmic_echo abgeschlossen):* Vollständig entschlüsseln (+20 BandMood, **Lore:** `inschrift_warning`).

---

## 5. Kaminstube (Nebenquest-Ort)

* **Flüsternder Kamin:**
    * *Option (Trait: Mystic):* "Wärme fühlen" (+20 BandMood, Quest `forgotten_lore`, Lore `kamin_prophecy`, setzt `kaminFeuerPact`).
    * *Option (Trait: Diplomat):* "Sprache deuten" (+20 BandMood, Quest `forgotten_lore`, Lore `kamin_prophecy`, setzt `kaminFeuerPact`).
    * *Option (Skill: Technical 8):* "Akustik analysieren" (+15 BandMood, +3 Technical, Quest `forgotten_lore`, Lore `kamin_prophecy`, setzt `kaminFeuerPact`).
    * *Option (Skill: Chaos 7):* "Feuer zwingen" (+10 BandMood, +3 Chaos, Quest `forgotten_lore`, Lore `kamin_prophecy`, setzt `kaminFeuerPact`).
* **Wirt:**
    * *BandMood > 80 & 1982 angesprochen / Geist-Geheimnis bekannt:*
        * *Bonus (Wenn ghostTrustEarned):* "Der Geist hat mich geschickt." (+30 BandMood, Quest `wirt_legacy`, setzt `wirtLegacy1982`).
        * Option (Trait: Diplomat): "Ich bin vertrauenswürdig." (+25 BandMood, +5 Social, Quest `wirt_legacy`, setzt `wirtLegacy1982`).
        * Option (Skill: Social 7): "Es ist wichtig für die Band." (+20 BandMood, +3 Social, Quest `wirt_legacy`, setzt `wirtLegacy1982`).
        * Option (Skill: Chaos 5): "Die Wahrheit muss raus!" (+15 BandMood, +3 Chaos, Quest `wirt_legacy`, setzt `wirtLegacy1982`).
    * *Item (Industrie-Talisman):* Erhält "Altes Plektrum" (wichtig für Matze in Salzgitter) (+20 BandMood, Erhalt: Altes Plektrum).
    * *BandMood > 80:* Erzählt Details über das Verschwinden des Managers 1982 (+10 BandMood).
    * *Standard:* Erhalt: Bier.
* **Ersatzröhre (Item):**
    * *Interaktion:* Aufheben (Erhalt: Röhre).
* **Kaputter Amp:**
    * *Item (Röhre):* Reparieren (+30 BandMood, Quest-Abschluss: `amp`).
* **Kaputter Drum-Computer:**
    * *Interaktion:* Betrachten (+10 BandMood).
* **Crowd:**
    * *Interaktion:* Zujubeln (+5 BandMood).

---

* **Wirt (Geheimnis):**
    * *Wenn Bassist kontaktiert (Flag `bassist_contacted`) — läuft auch wenn `wirtSecretItem` bereits gesetzt:*
        * (Skill: Social 8): Zwingen (+20 BandMood, +5 Social, setzt `bassist_clue_wirt`, Lore: `wirt_confession`).
        * (Trait: Brutalist): Drohen (+15 BandMood, +5 Chaos, setzt `bassist_clue_wirt`, Lore: `wirt_vergangenheit`).
        * (Trait: Diplomat): Verzeihen (+30 BandMood, setzt `bassist_clue_wirt`, Lore: `wirt_vergangenheit`, Erhalt: Turbo-Koffein).
* **Matze:**
    * *Sabotage-Geständnis (Wenn Sabotage entdeckt & Amp repariert):*
        * (Trait: Diplomat): Vergeben (+30 BandMood, setzt `tourbus_matze_confession`, Quest-Abschluss: `tourbus_saboteur`).
        * (Trait: Brutalist): Warnen (+15 BandMood, setzt `tourbus_matze_confession`, Quest-Abschluss: `tourbus_saboteur`).
* **Marius:**
    * *Reaktionen auf Zustände:*
        * (Wenn mariusEgoStrategy gesetzt): "Strategie funktioniert" (+10 BandMood).
        * (Wenn egoContained gesetzt): "Mein Ego brennt in mir!"
        * Standard: "Underground Metal Fest!"
* **Lars:**
    * *Rhythmus der Schmiede:*
        * *Bonus (Wenn larsRhythmPact):* "Ort hat eigenen Rhythmus." (+10 BandMood, setzt `kaminstube_lars_talked`).
        * (Skill: Technical 5): 120 BPM (+15 BandMood, +3 Technical, setzt `kaminstube_lars_talked`) ODER "Akustik perfekt" (+10 BandMood, +2 Technical).
        * (Skill: Chaos 5): Polyrhythmus (+20 BandMood, +3 Chaos, setzt `kaminstube_lars_talked`).
* **Crowd:**
    * *Menge anheizen:*
        * (Skill: Social 5): (+20 BandMood, +3 Social, setzt `kaminstube_crowd_rallied`).
        * (Skill: Chaos 7): (+25 BandMood, +4 Chaos, setzt `kaminstube_crowd_rallied`).
* **Flüsternder Kamin:**
    * *Option (Skill: Technical 7):* Frequenz analysieren (+20 BandMood, +3 Technical).
    * *Option (Trait: Diplomat):* Sprache deuten (+20 BandMood).

## 6. Salzgitter (Das Finale)

* **Matze:**
    * *Item (Verbotenes Riff + Void-Plektrum):* Ultimativer Sound.
        * Option (Skill: Chaos 10): (+70 BandMood, +5 Chaos).
        * Option (Skill: Technical 10): (+60 BandMood, +5 Technical).
        * Standard: (+20 BandMood).
    * *Item (Verbotenes Riff + Altes Plektrum):* Riff wird gebändigt.
        * Option (Skill: Chaos 10): (+50 BandMood, +5 Chaos).
        * Option (Skill: Technical 10): (+40 BandMood, +5 Technical).
        * Standard: (+20 BandMood).
    * *Deep Talk & Wirt Legacy 1982:*
        * Option (Trait: Mystic): "Frequenzen sind bereit" (+40 BandMood bei `backstageRitualPerformed`, sonst +20).
        * Standard: "Wir brechen den Fluch" (+20 BandMood).
* **Lars:**
    * *Wenn larsRhythmPact:*
        * *Bonus (Wenn larsVibrating):* Hyperpowered Lars (+50 BandMood, +5 Chaos).
        * Standard: "Realität zertrümmern" (+30 BandMood).
* **Marius:**
    * *Trait (Performer):* Spezial-Tipp für die erste Reihe geben (+30 BandMood, +5 Social).
    * *Unite Band (mariusEgoStrategy + mariusConfidenceBoost + egoContained):*
        * Wenn Band bereit (Matze & Lars Quests): "Die Band ist vereint." (+30 BandMood, Quest `unite_band`, setzt `salzgitterBandUnited`).
    * *Confidence Boost:*
        * (Wenn backstage_performer_speech): (+30 BandMood, +5 Social).
        * (Wenn egoContained & bassist_contacted): "Sing für den Bassisten" (+50 BandMood).
        * (Skill: Chaos 10): "Zorn kanalisieren" (+40 BandMood, +5 Chaos).
        * (Skill: Social 10): "Menge beruhigen" (+30 BandMood, +5 Social).

* **Fan:**
    * *Fan Movement Quest:*
        * (Trait: Performer): "Folgt mir!" (+35 BandMood, Quest `fan_movement`, setzt `fanMovement`).
        * (Skill: Social 8): "Zusammen singen!" (+30 BandMood, Quest `fan_movement`, setzt `fanMovement`).
        * (Trait: Diplomat): "Eins mit der Musik" (+25 BandMood, Quest `fan_movement`, setzt `fanMovement`).
    * *Item (Industrie-Talisman):* Als Geschenk übergeben (+40 BandMood).
    * *Item (Signierte Setliste):* Übergeben (+25 BandMood bei Umarmung / +15 bei Abstand).
    * *Diplomat Andenken:* (+20 BandMood, setzt `gaveDiplomatSouvenir`).
* **Tour Erfolgreich:**
    * *Interaktion:* Finale (+50 BandMood, Quest-Abschluss: `final`).

Das Finale in Salzgitter reagiert auf alle gesammelten Flags, Items und Skills. Die Endsequenz "Das Finale" wertet diese aus.

* **Marius (Frontmann):**
    * *Wenn `mariusConfidenceBoost` & `egoContained` & `bassist_contacted`:*
        * (Skill: Social 12): "Sing für den Bassisten" (+50 BandMood, setzt `salzgitter_true_ending`).
    * *Wenn `backstage_performer_speech`:*
        * (Trait: Performer): "Nimm die Halle" (+30 BandMood, +5 Social).
    * *Standard Confidence Boost:* Chaos 10 (+40 BandMood) oder Social 10 (+30 BandMood).
* **Lars (Drummer):**
    * *Wenn `larsVibrating` & `larsDrumPhilosophy`:*
        * (Skill: Chaos 15): "Maschinen-Seele entfesseln" (+40 BandMood, +5 Chaos, setzt `salzgitter_encore_unlocked`).
        * (Skill: Technical 12): "Kinetische Energie" (+40 BandMood, +5 Technical, setzt `salzgitter_encore_unlocked`).
    * *Wenn `lars_paced`:* (+25 BandMood).
* **Schwebender Bassist** *(erscheint wenn `bassist_contacted` gesetzt, verschwindet nach `bassist_restored`):*
    * *Wenn `voidBassistSpoken` & `bassist_mystery` abgeschlossen & kein Bassist-Saite & kein Resonanz-Kristall im Inventar (Auto-Restore):* "Erinnert sich" (+30 BandMood, setzt `bassist_restored`).
    * *Wenn `voidBassistSpoken` gesetzt (aber Auto-Restore-Bedingungen nicht erfüllt — z.B. Quest noch offen oder Spezialitem im Inventar):* Option "Du erinnerst dich an mich" (+20 BandMood, setzt **NICHT** `bassist_restored`).
    * *Item `Bassist-Saite` (Trait: Mystic):* "Gib ihm die Bassist-Saite aus dem Echo" (+40 BandMood, entfernt `Bassist-Saite`, setzt `bassist_restored`, **Lore:** `bassist_wahrheit`).
    * *Item `Resonanz-Kristall`:* "Nimm den Resonanz-Kristall. Vollende das Riff" (+30 BandMood, entfernt `Resonanz-Kristall`, setzt `bassist_restored`, **Lore:** `bassist_wahrheit`).
    * *Standard:* "Wir sehen uns auf der anderen Seite" (kein Mood-Effekt).
* **Matze:**
    * *Item: Verbotenes Riff + Altes Plektrum:* Chaos 10 (+50 BandMood) oder Technical 10 (+40 BandMood).
* **Fan:**
    * *Reagiert auf `backstage_performer_speech` oder `kaminstube_crowd_rallied` (+5 BandMood).*
    * *(Trait: Diplomat, einmalig — Flag `gaveDiplomatSouvenir` noch nicht gesetzt):* Andenken geben (+20 BandMood, setzt `gaveDiplomatSouvenir`).
* **Das Finale (Multi-Outcome Ende):**
    * **[TRUE ENDING]:** Benötigt `salzgitter_true_ending` & `bassist_restored` & `maschinen_seele_complete`. (+100 BandMood, schaltet letzte Lore frei).
    * **[SECRET ENCORE]:** Benötigt `salzgitter_encore_unlocked`. (+50 BandMood).
    * **[BEST ENDING]:** Benötigt 4 oder mehr Finale-Flags (`salzgitterBandUnited`, `fanMovement`, `backstageRitualPerformed`, `wirtLegacy1982`, `voidBassistSpoken`) ODER (`frequenz1982_complete` & `mariusConfidenceBoost` & BandMood > 70). (+70 BandMood).
    * **[GOOD ENDING]:** Benötigt 2 oder mehr Finale-Flags ODER (`mariusConfidenceBoost` & BandMood > 70). (+50 BandMood).
    * **[STANDARD ENDING]:** Wenn keine Bedingungen erfüllt sind. (+30 BandMood).

---

## 7. Crafting & Items (Zustand Store)

* **Resonanz-Kristall:** Entsteht durch die Kombination von `Frequenzfragment` und `Splitter der Leere`.
* **Geister-Drink:** Entsteht durch die Kombination von `Turbo-Koffein` und `Rostiges Plektrum`. (Erforderlich für Ghost Roadie Quest).
* **Void-Plektrum:** Entsteht durch die Kombination von `Splitter der Leere` und `Altes Plektrum`.
