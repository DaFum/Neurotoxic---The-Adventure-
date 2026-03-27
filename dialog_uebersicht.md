# NEUROTOXIC - Dialog- und Interaktions-Übersicht

Dieses Dokument dient als zentrale Referenz für alle Dialogbäume, Quest-Abhängigkeiten, Skill-Checks (Trait/Level) und Item-Interaktionen im Spiel "NEUROTOXIC". Es wurde aktualisiert, um die Änderungen der Phasen 1 bis 7 widerzuspiegeln.

---

## 1. Proberaum (Der Start)

* **Matze (Gitarrist):**
    * *Initial:* Regt sich über Wasser auf (Quest hinzugefügt: `clean_water`).
    * *Quest (Item: Wischmopp):* Wasser aufgewischt (+10 BandMood, +2 Social, Quest-Abschluss: `clean_water`, setzt `waterCleaned`).
    * *Nach Wasser (BandMood > 50):* "Erzähl mir von 1982" (setzt `askedAbout1982`).
        * Zweig A (Trait: Mystic): "Der Sound war nicht nur laut..." (+20 BandMood, +5 Chaos, Erhalt: Industrie-Talisman, Lore: `matze_1982_truth`).
        * Zweig B (Trait: Brutalist): "Zerstörung ist der Weg." (+15 BandMood, +3 Chaos).
        * Zweig C (Skill: Technical 3): "Röhren glühen." (+10 BandMood, +3 Technical).
        * Standard: "Wir machen Geschichte." (+5 BandMood).
    * *Sabotage-Verdacht:* "Lars trommelt komisch" (startet `lars_proberaum_secret`).
* **Lars (Drummer):**
    * *Initial:* Ertrinkt fast (Quest hinzugefügt: `lars`).
    * *Quest (Item: Handtuch):* Gerettet (+15 BandMood, Quest-Abschluss: `lars`, setzt `larsSaved`).
    * *Nach Rettung:*
        * Zweig A (Trait: Performer): "Bühne braucht dich" (+20 BandMood, +5 Social).
        * Zweig B (Skill: Technical 5): "Akustik optimieren" (+15 BandMood, +5 Technical).
        * Zweig C (Standard): "Gut trommeln" (+5 BandMood).
    * *Item (Turbo-Koffein):* Nimmt das Koffein an (+10 BandMood, entfernt Item).
* **Marius (Sänger):**
    * *Initial:* Durstig und wütend (Quest hinzugefügt: `marius`).
    * *Quest (Item: Bier):* Bier übergeben (+20 BandMood, +5 Social, Quest-Abschluss: `marius`, setzt `gotBeer`).
    * *Nach Bier:*
        * Zweig A (Trait: Diplomat): "Du bist der Frontmann" (+25 BandMood, +5 Social).
        * Zweig B (Trait: Cynic): "Dein Ego ist zu groß" (+5 BandMood, +5 Chaos).
        * Standard: "Weiter so." (+10 BandMood).
* **Equipment & Umgebung:**
    * *Wischmopp (Item):* Aufheben (Erhalt: Wischmopp).
    * *Kiste (Interaktion):* Öffnen (Erhalt: Handtuch).
    * *Risse in der Wand (Interaktion):*
        * Option (Trait: Brutalist): Smash (+10 BandMood, +5 Chaos, Lore: `frequenz_1982_proberaum`, setzt `proberaum_brutalist_smash`).
        * Option (Trait: Mystic): Ritual (+20 BandMood, Lore: `frequenz_1982_proberaum`, setzt `proberaum_mystic_ritual`).
* **Maschinen-Seele (Nebenquest):**
    * *Talking Amp:* (+20 BandMood, +5 Technical, setzt `maschinen_seele_amp`, Lore: `talking_amp`).
    * *TR-8080 Drum Machine:*
        * Option (Trait: Visionary): Geist vereinen (+25 BandMood, +5 Chaos, setzt `maschinen_seele_tr8080`, Lore: `drum_machine_ghost`).
        * Standard: Schaltkreise füttern (+20 BandMood).
    * Beide kombiniert erlauben die Vereinigung im Backstage.

---

## 2. TourBus (Unterwegs)

* **Matze:**
    * *Ohne Kabel (BandMood < 30):* Klagt über kaputtes Kabel.
    * *Ohne Kabel (BandMood >= 30):* Quest hinzugefügt: `cable`.
    * *Sabotage Entdeckung (Item: Defektes Kabel):*
        * Zweig A (Skill: Technical 5): Analyse (+20 BandMood, +5 Technical, setzt `tourbus_sabotage_discovered`, Lore: `tourbus_saboteur`).
        * Zweig B (Standard): Reparatur (+10 BandMood, +2 Technical, Kabel repariert).
    * *Mit Repariertem Kabel:* "Bühne abreißen" (+10 BandMood, Quest-Abschluss: `cable`).
* **Marius:**
    * *BandMood < 30:* Nervenzusammenbruch.
        * Option (Trait: Diplomat): Beruhigen (+20 BandMood, setzt `marius_tourbus_doubt`).
        * Option (Trait: Brutalist): Anschreien (+5 BandMood, +5 Chaos, setzt `marius_tourbus_doubt`).
    * *Normaler Dialog:* Stimmungsabhängig.
* **Geist eines Roadies (Ghost Roadie):**
    * *Rezept-Quest:* Verlangt Geister-Drink (Quest: `ghost_recipe`).
    * *Nach Drink:*
        * Option (Skill: Social 5): Nach dem Bassisten fragen (+25 BandMood, +5 Social, setzt `bassist_clue_ghost`, Lore: `roadie_bassist`).
        * Option (Standard): Verstärker-Schaltplan erhalten (+20 BandMood).
* **Verstecktes Fach (Nur nach Sabotage-Entdeckung):**
    * *Interaktion (Skill: Technical 3):* Öffnen (+15 BandMood, Erhalt: Frequenzfragment, Erhalt: Magnetband, setzt `tourbus_secret_compartment_opened`, Lore: `frequenz_1982_tourbus`).
* **Items im Bus:**
    * Klebeband, Kaffee, Energiedrink, Bier-Vorrat, Rostiges Plektrum, Batterie, Magnetband (im Fach).

---

## 3. Backstage (Vor dem Gig)

* **Feedback-Monitor:**
    * *Initial:* Erhalt Quest (+5 BandMood, Quest: `feedback_monitor_backstage`).
    * *Mit Schaltplan:*
        * Option (Skill: Technical 5): Optimieren (+30 BandMood, +5 Technical).
        * Option (Trait: Visionary): Transzendenz (+40 BandMood, +5 Chaos).
    * *Maschinen-Seele Abschluss (Benötigt Amp & TR-8080 Flags):*
        * Option (Trait: Mystic): Vereinigen (+40 BandMood, +5 Chaos, setzt `maschinen_seele_complete`, Lore: `maschinen_bewusstsein`).
        * Option (Skill: Technical 7): Logisch verbinden (+30 BandMood, +5 Technical, setzt `maschinen_seele_complete`).
* **Marius (Lampenfieber):**
    * *Optionen:*
        * (Skill: Social 5): "Gott am Mikrofon" (+30 BandMood, +3 Social, setzt `mariusConfidenceBoost`).
        * (Trait: Performer): "Nimm die Halle" (+35 BandMood, +5 Social, setzt `backstage_performer_speech`).
        * (Trait: Brutalist): "Sing oder flieg" (+10 BandMood).
        * "Lego-Trick" (+10 BandMood).
        * (Info 1982 vorhanden): "Erinnerung an 1982" (+25 BandMood).
* **Lars (Energie-Mangel):**
    * *Item (Turbo-Koffein):*
        * Auf Ex: (+40 BandMood, setzt `larsVibrating`).
        * Nur ein Schluck (Trait: Diplomat): (+30 BandMood, +3 Social, setzt `lars_paced`).
        * Nur ein Schluck (Standard): (+20 BandMood).
* **Alte Blaupause (Nur wenn Sabotage entdeckt):**
    * *Option (Skill: Technical 7):* Analysieren (+3 Technical, setzt `backstage_blueprint_found`, Hinweis auf 432Hz).
* **Ritual-Kreis:**
    * *Mit Resonanz-Kristall + Blaupause:*
        * (Trait: Mystic): Frequenz vollenden (+50 BandMood, setzt `frequenz1982_complete`, Lore: `frequenz_1982_decoded`).
        * (Trait: Brutalist): Kristall zerschmettern (+40 BandMood, +5 Chaos, Item verloren, setzt `frequenz1982_complete`).
    * *Mit Plasma-Zünder:* (+30 BandMood).
* **Items:** Setliste, Stift, Lötkolben.

---

## 4. VoidStation (Die Realitäts-Grenze)

* **Kosmischer Tankwart:**
    * *Spezial (Trait: Mystic):* Erhält Splitter der Leere.
    * *Van betanken (Item: Dunkle Materie):*
        * 440Hz (+25 BandMood).
        * 432Hz (+10 BandMood).
        * (Nur mit Resonanz-Kristall, Trait: Mystic): Frequenz 1982 Tankfüllung (+40 BandMood, setzt `tankwart_fuel_quest_started`).
* **Schwebender Bassist (Nur wenn Hinweise von Matze & Ghost vorhanden):**
    * *Interaktion:*
        * (Skill: Social 8): Band braucht dich (+40 BandMood, +3 Social, setzt `bassist_contacted`, Lore: `bassist_wahrheit`).
        * (Skill: Technical 10): Phasenverschiebung (+50 BandMood, +3 Technical, setzt `bassist_contacted`).
        * (Trait: Mystic): Leere tragen (+40 BandMood, +3 Chaos, setzt `bassist_contacted`).
* **Marius' Ego (Item):**
    * *Spezial (Wenn Marius zweifelt, Trait: Diplomat):* Ego überzeugen (+40 BandMood, +5 Social, setzt `mariusConfidenceBoost`).
    * *Andere Optionen:* Visionary (+30 BandMood), Technical 8 (+20 BandMood), Social 8 (+25 BandMood).
* **Diplomaten-Interface (Neu):**
    * *Option (Trait: Diplomat):* Verhandeln (+30 BandMood, +5 Social, setzt `void_diplomat_negotiation`, Lore: `schaltpult_record`).
* **Weitere Objekte:** Kosmisches Echo (Quest), Altes Terminal (Lore), Frequenz-Detektor (Skill Check), Verbotene Inschrift (Quest Abhängigkeit).

---

## 5. Kaminstube (Vor dem Auftritt)

* **Wirt (Geheimnis):**
    * *Wenn Bassist kontaktiert:*
        * (Skill: Social 8): Zwingen (+20 BandMood, +5 Social, setzt `bassist_clue_wirt`, Lore: `wirt_confession`).
        * (Trait: Brutalist): Drohen (+15 BandMood, +5 Chaos).
        * (Trait: Diplomat): Verzeihen (+30 BandMood, Erhalt: Turbo-Koffein).
    * *Item (Industrie-Talisman):* Erhält "Altes Plektrum" (wichtig für Salzgitter) (+20 BandMood).
* **Matze:**
    * *Sabotage-Geständnis (Wenn Sabotage entdeckt):*
        * (Trait: Diplomat): Vergeben (+30 BandMood, setzt `tourbus_matze_confession`).
        * (Trait: Brutalist): Warnen (+15 BandMood).
* **Lars:**
    * *Rhythmus der Schmiede:*
        * (Skill: Technical 5): 120 BPM (+15 BandMood, +3 Technical).
        * (Skill: Chaos 5): Polyrhythmus (+20 BandMood, +3 Chaos).
* **Crowd:**
    * *Menge anheizen:*
        * (Skill: Social 5): (+20 BandMood, +3 Social, setzt `kaminstube_crowd_rallied`).
        * (Skill: Chaos 7): (+25 BandMood, +4 Chaos).
* **Flüsternder Kamin:**
    * *Option (Skill: Technical 7):* Frequenz analysieren (+20 BandMood, +3 Technical, Quest-Abschluss: `forgotten_lore`).
    * *Option (Trait: Diplomat):* Sprache deuten (+20 BandMood).
* **Kaputter Amp:** (Quest `amp`, Item: Röhre repariert ihn, +30 BandMood).

---

## 6. Salzgitter (Das Finale)

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
* **Schwebender Bassist:**
    * *Wenn `bassist_contacted` & Item: `Resonanz-Kristall`:*
        * "Kristall einsetzen" (+30 BandMood, entfernt Kristall, setzt `bassist_restored`, Lore: `bassist_wahrheit`).
* **Matze:**
    * *Item: Verbotenes Riff + Altes Plektrum:* Chaos 10 (+50 BandMood) oder Technical 10 (+40 BandMood).
* **Fan:**
    * *Reagiert auf `backstage_performer_speech` oder `kaminstube_crowd_rallied` (+5 BandMood).*
    * *Item (Industrie-Talisman):* (+40 BandMood).
    * *Item (Signierte Setliste):* (+25 BandMood).
    * *(Trait: Diplomat):* Andenken geben (+20 BandMood).
* **Das Finale (Multi-Outcome Ende):**
    * **[TRUE ENDING]:** Benötigt `salzgitter_true_ending` & `bassist_restored` & `maschinen_seele_complete`. (+100 BandMood, schaltet letzte Lore frei).
    * **[SECRET ENCORE]:** Benötigt `salzgitter_encore_unlocked`. (+50 BandMood).
    * **[GREAT ENDING]:** Benötigt `frequenz1982_complete` & `mariusConfidenceBoost` & BandMood > 70. (+70 BandMood).
    * **[GOOD ENDING]:** Benötigt `mariusConfidenceBoost` & BandMood > 70. (+50 BandMood).
    * **[STANDARD ENDING]:** Wenn keine Bedingungen erfüllt sind. (+30 BandMood).

---

## 7. Crafting & Items (Zustand Store)

* **Resonanz-Kristall:** Entsteht durch die Kombination von `Frequenzfragment` und `Splitter der Leere`.
* **Geister-Drink:** Entsteht durch die Kombination von `Bier` und `Dunkle Materie`. (Erforderlich für Ghost Roadie Quest).
