# Neurotoxic – The Adventure: Komplette Dialog- und Interaktionsübersicht

*Aktualisiert für Phase 1-7 Erweiterungen (Maschinen-Seele, Frequenz 1982, Bassist-Quest, etc.)*

Diese Übersicht fasst alle Dialogbäume, Interaktionen, freischaltbaren Lore-Einträge und deren Voraussetzungen (Traits, Skills, Items) aus allen Szenen zusammen.

---

## 1. Proberaum (Die Vorbereitung)

* **Zerrissenes Plakat:**
    * *Erstinteraktion:* Liest die Geschichte der Tour 1999 (+5 BandMood, **Lore:** `poster_lore`).
    * *Wiederholte Interaktion:* Erneut betrachten (+5 BandMood bei jeder Interaktion).
* **Das Verbotene Riff (Item):**
    * *Interaktion:* Finden des Riffs (+15 BandMood, **Lore:** `forbidden_riff`, Erhalt: Verbotenes Riff).
* **Matze (Gitarrist):**
    * *Nach Wasser (BandMood > 50):* "Erzähl mir von 1982" (setzt `askedAbout1982`).
        * Zweig A (Trait: Mystic): "Der Sound war nicht nur laut..." (+20 BandMood, +5 Chaos, Erhalt: Industrie-Talisman, Lore: `matze_1982_truth`).
        * Zweig B (Trait: Brutalist): "Zerstörung ist der Weg." (+15 BandMood, +3 Chaos).
        * Zweig C (Skill: Technical 3): "Röhren glühen." (+10 BandMood, +3 Technical).
        * Standard: "Wir machen Geschichte." (+5 BandMood).
    * *Sabotage-Verdacht:* "Lars trommelt komisch" (startet `lars_proberaum_secret`).
    * *Vor dem Aufwischen:* Bittet darum, das Wasser aufzuwischen.
        * "Ich kümmere mich darum" (kein Mood-Effekt).
        * "Neues Genre?" (-5 BandMood).
    * *Spezial (Trait: Cynic):* Option, die Tour als "schlechten Witz" zu bezeichnen (+20 BandMood, +5 Chaos).
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
            * *Unterzweig (Standard):* "Interessante Geschichte" (+10 BandMood, setzt `askedAbout1982` — wichtig für Geist-Dialoge im TourBus und Backstage).
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
* **Marius (Sänger):**
    * *Nach Bier:*
        * Zweig A (Trait: Diplomat): "Du bist der Frontmann" (+25 BandMood, +5 Social).
        * Zweig B (Trait: Cynic): "Dein Ego ist zu groß" (+5 BandMood, +5 Chaos).
        * Standard: "Weiter so." (+10 BandMood).
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
    * *Reparatur (Lötkolben + Schrottmetall):* Amp wird repariert (+20 BandMood, +5 Technical, Quest-Abschluss: `repair_amp`, setzt `talkingAmpRepaired`).
    * *Nach Reparatur:* Bietet Therapie-Sitzung an (setzt `ampTherapyStarted`, Quest hinzugefügt: `amp_therapy`).
    * *Therapie-Sitzung:*
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
    * *Quest (Item: Quanten-Kabel):* Kabel übergeben (+20 BandMood, +5 Technical, Quest-Abschluss: `feedback_monitor`, entfernt Quanten-Kabel).

---

## 2. TourBus (Unterwegs)

* **Matze:**
    * *Ohne Kabel (BandMood < 30):* Klagt über schlechte Laune und kaputtes Kabel (kein Mood-Effekt).
    * *Ohne Kabel (BandMood >= 30):*
        * "Ich suche danach" (Quest hinzugefügt: `cable`).
        * "Vielleicht Schicksal" (Sabotage-Vorwurf, -5 BandMood).
    * *Mit Repariertem Kabel:* "Bühne abreißen" (+10 BandMood, Quest-Abschluss: `cable`).
* **Matze:**
    * *Sabotage Entdeckung (Item: Defektes Kabel):*
        * Zweig A (Skill: Technical 5): Analyse (+20 BandMood, +5 Technical, setzt `tourbus_sabotage_discovered`, Lore: `tourbus_saboteur`).
        * Zweig B (Standard): Reparatur (+10 BandMood, +2 Technical, Kabel repariert).
* **Marius:**
    * *BandMood < 30:* Nervenzusammenbruch.
        * Option (Trait: Diplomat): Beruhigen (+20 BandMood, setzt `marius_tourbus_doubt`).
        * Option (Trait: Brutalist): Anschreien (+5 BandMood, +5 Chaos, setzt `marius_tourbus_doubt`).
    * *Item (Marius' Ego):* Ego übergeben (+20 BandMood) ODER Ego behalten (-10 BandMood).
    * *Ohne Ego:* Stimmungsabhängiger Dialog (kein Mood-Effekt).
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
* **Geist eines Roadies:**
    * *Item (Geister-Drink):* Rezept-Quest (+40 BandMood, +5 Social, Erhalt: Verstärker-Schaltplan, Quest-Abschluss: `ghost_recipe`, entfernt Geister-Drink).
    * *Flag `askedAbout1982` gesetzt (aus Proberaum):*
        * Zweig A (Trait: Visionary): "Erzähl mir alles" (+30 BandMood, +5 Chaos, setzt `ghostSecretRevealed`).
        * Zweig B (Skill: Technical 7): "Anomalie analysieren" (+25 BandMood, +4 Technical, setzt `ghostSecretRevealed`).
        * Zweig C (Skill: Social 5): "Geist beruhigen" (+20 BandMood, +3 Social, setzt `ghostSecretRevealed`).
        * Standard: "Erzähl mir alles" (+20 BandMood, setzt `ghostSecretRevealed`).
        * "Vielleicht später" (kein Mood-Effekt).
    * *Item (Industrie-Talisman):* Wahrheit (+20 BandMood, setzt `ghostSecretRevealed`) ODER Begraben (+5 BandMood).
    * *Item (Verbotenes Riff):* "Für Metal" (+10 BandMood) ODER "Was für ein Preis?" (kein Mood-Effekt).
    * *Standard-Interaktionen:* Fragen stellen (+5 BandMood). Option "Kann ich dir helfen?" startet Quest `ghost_recipe`.
* **Batterie (Item):**
    * *Interaktion:* Aufheben (Erhalt: Batterie).

---

* **Verstecktes Fach (Nur nach Sabotage-Entdeckung):**
    * *Interaktion (Skill: Technical 3):* Öffnen (+15 BandMood, Erhalt: Frequenzfragment, Erhalt: Magnetband, setzt `tourbus_secret_compartment_opened`, Lore: `frequenz_1982_tourbus`).
* **Geist eines Roadies:**
    * *Nach Drink:*
        * Option (Skill: Social 5): Nach Bassisten fragen (+25 BandMood, +5 Social, setzt `bassist_clue_ghost`, Lore: `roadie_bassist`).
    * *Flag `askedAbout1982` gesetzt (aus Proberaum):*
        * Option (Trait: Visionary): "Erzähl mir alles" (+30 BandMood, +5 Chaos, setzt `ghostSecretRevealed`).
        * Option (Skill: Technical 7): "Anomalie analysieren" (+25 BandMood, +4 Technical, setzt `ghostSecretRevealed`).
        * Option (Skill: Social 5): "Geist beruhigen" (+20 BandMood, +3 Social, setzt `ghostSecretRevealed`).

## 3. Backstage (Vor dem Gig)

* **Feedback-Monitor:**
    * *Item (Verstärker-Schaltplan):*
        * Zweig A (Skill: Technical 5): "Optimierte Frequenzen" (+30 BandMood, +5 Technical, Quest-Abschluss: `feedback_monitor_backstage`).
        * Zweig B (Trait: Visionary): "Transzendente Frequenzen" (+40 BandMood, +5 Chaos, Quest-Abschluss: `feedback_monitor_backstage`).
        * Zweig C: "Standard-Frequenzen" (+15 BandMood, Quest-Abschluss: `feedback_monitor_backstage`).
    * *Initial:* Erhalt Quest (+5 BandMood).
* **Marius (Lampenfieber):**
    * *Optionen zur Beruhigung (Quest-Abschluss `marius` für jede):*
        * (Skill: Social 5): "Gott am Mikrofon" (+30 BandMood, +3 Social, setzt `mariusConfidenceBoost`).
        * (Trait: Performer): "Nimm die Halle" (+35 BandMood, +5 Social, setzt `backstage_performer_speech`, setzt `mariusConfidenceBoost`).
        * (Trait: Visionary): "Sehe deine Vision" (+35 BandMood, +3 Chaos, setzt `mariusConfidenceBoost`).
        * (Trait: Brutalist): "Sing oder flieg" (+10 BandMood).
        * (Info: 1982 vorhanden): "Erinnerung an 1982" (+25 BandMood, setzt `mariusConfidenceBoost`) ODER "Wovon redest du?" (-5 BandMood).
        * "Lego-Trick" (+10 BandMood).
* **Lars (Energie-Mangel):**
    * *Item (Turbo-Koffein):*
        * Auf Ex: (+40 BandMood, setzt `larsVibrating`, `larsEnergized`).
        * Nur ein Schluck (Trait: Diplomat): (+30 BandMood, +3 Social, setzt `lars_paced`, `larsEnergized`).
        * Nur ein Schluck (Standard): (+20 BandMood, setzt `larsEnergized`).
    * *Item (Energiedrink):* (+10 BandMood, setzt `larsEnergized`).
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
    * *Mit Resonanz-Kristall + Blaupause:*
        * (Trait: Mystic): Frequenz vollenden (+50 BandMood, setzt `frequenz1982_complete`, Lore: `frequenz_1982_decoded`).
        * (Trait: Brutalist): Kristall zerschmettern (+40 BandMood, +5 Chaos, Item verloren, setzt `frequenz1982_complete`).
    * *Item (Plasma-Zünder):* Anzünden (+30 BandMood).
    * *Item (Verbotenes Riff):* Resonanz (+15 BandMood).
    * *Standard:* (+5 BandMood).

---

## 4. VoidStation (Die Realitäts-Grenze)

* **Kosmischer Tankwart:**
    * *Spezial (Trait: Mystic):* "Ich suche die Wahrheit" (+30 BandMood, Erhalt: Splitter der Leere).
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
    * Option (Trait: Visionary): "Vision leitet uns" (+30 BandMood, +5 Chaos).
    * Option (Skill: Technical 8): "Resonanzfrequenz instabil" (+20 BandMood, +5 Technical).
    * Option (Skill: Social 8): "Fans brauchen dich" (+25 BandMood, +5 Social).
    * Standard: "Komm einfach mit" (+10 BandMood).
* **Dunkle Materie (Item):**
    * *Interaktion:* Aufheben (Erhalt: Dunkle Materie).
* **Gesplittertes Schaltpult:**
    * *Interaktion:* "Tiefer graben" (**Lore:** `schaltpult_record`).
* **Schwebende Magnetbänder:**
    * *Option (Skill: Technical 5):* Band abspielen (+10 BandMood, +3 Technical, **Lore:** `magnetband_session`).
* **Frequenz-Detektor:**
    * *Standard-Interaktion:* Warnung lesen (**Lore:** `frequenz_anomaly`).
    * *Option (Skill: Technical 6):* Kalibrieren (+15 BandMood, +4 Technical).
* **Verbotene Inschrift:**
    * *Quest-Abhängigkeit (cosmic_echo abgeschlossen):* Vollständig entschlüsseln (+20 BandMood, **Lore:** `inschrift_warning`).

---

## 5. Kaminstube (Nebenquest-Ort)

* **Flüsternder Kamin (Trait: Diplomat):**
    * *Spezial-Option:* Sprache deuten (+20 BandMood, Quest-Abschluss: `forgotten_lore`).
* **Wirt:**
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
    * *Wenn Bassist kontaktiert:*
        * (Skill: Social 8): Zwingen (+20 BandMood, +5 Social, setzt `bassist_clue_wirt`, Lore: `wirt_confession`).
        * (Trait: Brutalist): Drohen (+15 BandMood, +5 Chaos).
        * (Trait: Diplomat): Verzeihen (+30 BandMood, Erhalt: Turbo-Koffein).
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
    * *Option (Skill: Technical 7):* Frequenz analysieren (+20 BandMood, +3 Technical).
    * *Option (Trait: Diplomat):* Sprache deuten (+20 BandMood).

## 6. Salzgitter (Das Finale)

* **Matze:**
    * *Item (Verbotenes Riff + Altes Plektrum):* Riff wird gebändigt.
        * Option (Skill: Chaos 10): "Chaos kanalisieren" (+70 BandMood, +5 Chaos).
        * Option (Skill: Technical 10): "Präzision im Chaos" (+60 BandMood, +5 Technical).
        * Standard: (+20 BandMood).
    * *Nur Verbotenes Riff (ohne Plektrum):* Er warnt vor Realitätsrissen.
    * *Deep Talk (Trait: Visionary):* (+50 BandMood, +5 Chaos).
    * *Deep Talk (Standard):* (+10 BandMood).
* **Lars:**
    * *Wenn "vibriert" (Koffein im Backstage auf Ex getrunken):*
        * Option (Skill: Technical 10): "Frequenz synchronisieren" (+40 BandMood, +5 Technical).
        * Standard: (+10 BandMood).
    * *Philosophie:* (+5 BandMood).
* **Marius:**
    * *Trait (Performer):* Spezial-Tipp für die Show geben (+30 BandMood, +5 Social).
    * *Confidence Boost (Skill: Chaos 10):* "Zorn kanalisieren" (+55 BandMood, +5 Chaos).
    * *Confidence Boost (Skill: Social 10):* "Menge beruhigen" (+45 BandMood, +5 Social).
    * *Confidence Boost (Standard):* (+15 BandMood).
* **Schwebender Bassist:**
    * *Interaktion:* Betrachten (+10 BandMood).
* **Fan:**
    * *Item (Industrie-Talisman):* Als Geschenk übergeben (+40 BandMood).
    * *Item (Signierte Setliste):* Übergeben (+25 BandMood bei Umarmung / +15 bei Abstand).
    * *Standard:* Beleidigen (-2 BandMood).
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
* **Schwebender Bassist:**
    * *Wenn `bassist_contacted` & Item: `Resonanz-Kristall`:*
        * "Kristall einsetzen" (+30 BandMood, entfernt Kristall, setzt `bassist_restored`, Lore: `bassist_wahrheit`).
* **Matze:**
    * *Item: Verbotenes Riff + Altes Plektrum:* Chaos 10 (+50 BandMood) oder Technical 10 (+40 BandMood).
* **Fan:**
    * *Reagiert auf `backstage_performer_speech` oder `kaminstube_crowd_rallied` (+5 BandMood).*
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
* **Geister-Drink:** Entsteht durch die Kombination von `Turbo-Koffein` und `Rostiges Plektrum`. (Erforderlich für Ghost Roadie Quest).
