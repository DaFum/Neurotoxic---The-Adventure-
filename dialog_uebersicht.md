# Neurotoxic – The Adventure: Komplette Dialog- und Interaktionsübersicht

Diese Übersicht fasst alle Dialogbäume, Interaktionen, freischaltbaren Lore-Einträge und deren Voraussetzungen (Traits, Skills, Items) aus allen Szenen zusammen.

---

## 1. Proberaum (Die Vorbereitung)

* **Zerrissenes Plakat:**
    * *Interaktion:* Liest die Geschichte der Tour 1999 (+5 BandMood, **Lore:** `poster_lore`).
* **Das Verbotene Riff (Item):**
    * *Interaktion:* Finden des Riffs (+15 BandMood, **Lore:** `forbidden_riff`, Erhalt: Verbotenes Riff).
* **Matze (Gitarrist):**
    * *Standard:* Bittet darum, das Wasser aufzuwischen.
    * *Spezial (Trait: Cynic):* Option, die Tour als "schlechten Witz" zu bezeichnen (+20 BandMood, +5 Chaos).
    * *Item (Industrie-Talisman):* Erkennt den Talisman.
        * Zweig A: "Für die Band" (+30 BandMood).
        * Zweig B: "Geheimnis bewahren" (+15 BandMood).
    * *Item (Verbotenes Riff):* Begeisterung über den Fund (+30 BandMood).
    * *Nach dem Aufwischen:*
        * Zweig A: "Rock on!" (+10 BandMood).
        * Zweig B: Frage nach 1982.
            * *Unterzweig (Trait: Visionary):* "Muster im Lärm" (+30 BandMood, +5 Chaos).
            * *Unterzweig (Skill: Technical 5):* Frequenz-Analyse (+20 BandMood, +3 Technical).
            * *Unterzweig (Skill: Social 3):* Beruhigen (+15 BandMood, +2 Social).
        * Zweig C: "Buchhaltung" (-2 BandMood).
* **Lars (Drummer):**
    * *Item (Bier):*
        * Zweig A: Bier geben (+20 BandMood).
        * Zweig B: Frage nach Drum-Philosophie.
            * *Unterzweig (Skill: Chaos 3):* Beat lehren (+20 BandMood, +2 Chaos).
            * *Unterzweig (Skill: Technical 3):* Schlagkraft-Analyse (+15 BandMood, +2 Technical).
* **Marius (Sänger):**
    * *Ohne Bier:* Fordert Bier.
        * Option A: Wasser trinken (-5 BandMood).
        * Option B (Trait: Visionary): "Verstehe deine Vision" (+20 BandMood, +3 Social).
        * Option C (Skill: Social 5): "Beruhige dich, Star" (+15 BandMood, +2 Social).
* **Wischmopp (Item):**
    * *Interaktion:* Aufheben (Erhalt: Mop).
* **Autoschlüssel (Item):**
    * *Interaktion:* Aufheben (+10 BandMood, Quest-Abschluss: `keys`, Erhalt: Autoschlüssel).
* **Kühles Bier (Item):**
    * *Interaktion:* Aufheben (+15 BandMood, Quest-Abschluss: `beer`, Erhalt: Bier).
* **Mysteriöse Pfütze:**
    * *Interaktion (Item: Mop):* Aufwischen (+20 BandMood, Quest-Abschluss: `water`).
* **Sprechender Amp (Existenzielle Krise):**
    * *Initial:* Erzählt von der 5. Dimension (+2 BandMood).
    * *Reparatur (Lötkolben + Schrottmetall):* Amp wird repariert (+20 BandMood, +5 Technical, Quest-Abschluss: `repair_amp`).
    * *Therapie-Sitzung:*
        * Option (Trait: Diplomat): "Du bist ein Bewusstsein" (+30 BandMood, Quest-Abschluss: `amp_therapy`).
        * Option (Trait: Brutalist): "Du bist ein Werkzeug" (+10 BandMood, Quest-Abschluss: `amp_therapy`).
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
    * *Initial:* Fragt nach dem Quanten-Kabel.
    * *Quest (Item: Quanten-Kabel):* Kabel übergeben (+20 BandMood, +5 Technical, Quest-Abschluss: `feedback_monitor`).

---

## 2. TourBus (Unterwegs)

* **Matze:**
    * *Ohne Kabel:* Verlangt Klebeband ODER Sabotage (-5 BandMood).
    * *Mit Repariertem Kabel:* "Bühne abreißen" (+10 BandMood, Quest-Abschluss: `cable`).
* **Marius:**
    * *Item (Marius' Ego):* Ego übergeben (+20 BandMood) ODER Ego behalten (-10 BandMood).
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
    * *Item (Geister-Drink):* Rezept-Quest (+40 BandMood, +5 Social, Erhalt: Verstärker-Schaltplan, Quest-Abschluss: `ghost_recipe`).
    * *Information (1982/Talisman):*
        * Zweig A (Trait: Visionary): "Erzähl mir alles" (+30 BandMood, +5 Chaos).
        * Zweig B (Skill: Technical 7): "Anomalie analysieren" (+25 BandMood, +4 Technical).
        * Zweig C (Skill: Social 5): "Geist beruhigen" (+20 BandMood, +3 Social).
        * Standard: "Erzähl mir alles" (+20 BandMood).
    * *Item (Verbotenes Riff):* (+10 BandMood).
    * *Item (Industrie-Talisman):* Wahrheit (+20 BandMood) ODER Begraben (+5 BandMood).
    * *Standard-Interaktionen:* Fragen stellen (+5 BandMood).
* **Batterie (Item):**
    * *Interaktion:* Aufheben (Erhalt: Batterie).

---

## 3. Backstage (Vor dem Gig)

* **Feedback-Monitor:**
    * *Item (Verstärker-Schaltplan):*
        * Zweig A (Skill: Technical 5): "Optimierte Frequenzen" (+30 BandMood, +5 Technical, Quest-Abschluss: `feedback_monitor_backstage`).
        * Zweig B (Trait: Visionary): "Transzendente Frequenzen" (+40 BandMood, +5 Chaos, Quest-Abschluss: `feedback_monitor_backstage`).
        * Zweig C: "Standard-Frequenzen" (+15 BandMood, Quest-Abschluss: `feedback_monitor_backstage`).
    * *Initial:* Erhalt Quest (+5 BandMood).
* **Marius (Lampenfieber):**
    * *Optionen zur Beruhigung:*
        * (Skill: Social 5): "Gott am Mikrofon" (+30 BandMood, +3 Social, Quest-Abschluss: `marius`).
        * (Trait: Visionary): "Sehe deine Vision" (+35 BandMood, +3 Chaos, Quest-Abschluss: `marius`).
        * (Info: 1982 vorhanden): "Erinnerung an 1982" (+25 BandMood, Quest-Abschluss: `marius`) ODER "Wovon redest du?" (-5 BandMood).
        * "Lego-Trick" (+10 BandMood, Quest-Abschluss: `marius`).
        * "Equipment verkaufen" (-5 BandMood, zwingt ihn aber vor lauter Schreck auf die Bühne, Quest-Abschluss: `marius`).
* **Lars (Energie-Mangel):**
    * *Item (Turbo-Koffein):*
        * Zweig A: "Auf Ex" (+40 BandMood, Lars "vibriert").
        * Zweig B: "Nur ein Schluck" (+20 BandMood).
    * *Item (Energiedrink):* (+10 BandMood).
* **Setliste (Item):**
    * *Interaktion:* Aufheben (Erhalt: Setliste, Quest-Abschluss: `setlist`).
* **Stift (Item):**
    * *Interaktion:* Aufheben (Erhalt: Stift).
* **Lötkolben (Item):**
    * *Interaktion:* Aufheben (Erhalt: Lötkolben).
* **Ritual-Kreis:**
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
    * *Quest-Abhängigkeit (cosmic_echo abgeschlossen):* Auf das Echo ansprechen (+15 BandMood, **Lore:** `cosmic_echo_decoded`).
    * *Standard-Dialog:* (+5 BandMood).
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
