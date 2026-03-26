# Neurotoxic – The Adventure: Komplette Dialog- und Interaktionsübersicht

Diese Übersicht fasst alle Dialogbäume, Interaktionen, freischaltbaren Lore-Einträge und deren Voraussetzungen (Traits, Skills, Items) aus allen Szenen zusammen.

---

## 1. Proberaum (Die Vorbereitung)

* **Zerrissenes Plakat:**
    * *Interaktion:* Liest die Geschichte der Tour 1999 (+5 BandMood, **Lore:** `poster_lore`). (Hinweis: +5 BandMood bei jeder Interaktion)
* **Das Verbotene Riff (Item):**
    * *Interaktion:* Finden des Riffs (+15 BandMood, **Lore:** `forbidden_riff`).
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
* **Lars (Drummer):**
    * *Item (Bier):*
        * Zweig A: Bier geben (+20 BandMood).
        * Zweig B: Frage nach Drum-Philosophie.
            * *Unterzweig (Skill: Chaos 3):* Beat lehren (+20 BandMood, +2 Chaos).
            * *Unterzweig (Skill: Technical 3):* Schlagkraft-Analyse (+15 BandMood, +2 Technical).
* **Marius (Sänger):**
    * *Ohne Bier:* Fordert Bier. Option "Trink doch Wasser." (-5 BandMood).
        * Option (Trait: Visionary): "Verstehe deine Vision" (+20 BandMood, +3 Social).
        * Option (Skill: Social 5): "Beruhige dich, Star" (+15 BandMood, +2 Social).
* **Sprechender Amp (Existenzielle Krise):**
    * *Initial:* Erzählt von der 5. Dimension.
    * *Reparatur (Lötkolben + Schrottmetall):* Amp wird repariert (+20 BandMood, +5 Technical).
    * *Therapie-Sitzung:*
        * Option (Trait: Diplomat): "Du bist ein Bewusstsein" (+30 BandMood, Quest-Abschluss).
        * Option (Trait: Brutalist): "Du bist ein Werkzeug" (+10 BandMood, Quest-Abschluss).
* **TR-8080 Drum Machine:**
    * *Item (Verbotenes Riff):* Maschine absorbiert das Riff.
        * Zweig: "Schaltkreise füttern" (+25 BandMood, +10 Chaos, Erhalt: Quanten-Kabel).

---

## 2. TourBus (Unterwegs)

* **Matze:**
    * *Ohne Kabel:* Verlangt Klebeband.
    * *Mit Repariertem Kabel:* "Bühne abreißen" (+10 BandMood).
* **Defekter Verstärker (Trait: Technician):**
    * *Spezial-Option:* Lötstelle reparieren (+20 BandMood, +10 Technical).
* **Geist eines Roadies:**
    * *Item (Geister-Drink):* Rezept-Quest (+40 BandMood, +5 Social, Erhalt: Verstärker-Schaltplan).
    * *Information (1982/Talisman):*
        * Zweig A (Trait: Visionary): "Erzähl mir alles" (+30 BandMood, +5 Chaos).
        * Zweig B (Skill: Technical 7): "Anomalie analysieren" (+25 BandMood, +4 Technical).
        * Zweig C (Skill: Social 5): "Geist beruhigen" (+20 BandMood, +3 Social).

---

## 3. Backstage (Vor dem Gig)

* **Sentient Feedback Monitor:**
    * *Item (Verstärker-Schaltplan):*
        * Zweig A (Skill: Technical 5): "Optimierte Frequenzen" (+30 BandMood, +5 Technical).
        * Zweig B (Trait: Visionary): "Transzendente Frequenzen" (+40 BandMood, +5 Chaos).
        * Zweig C: "Standard-Frequenzen" (+15 BandMood).
* **Marius (Lampenfieber):**
    * *Optionen zur Beruhigung:*
        * (Skill: Social 5): "Gott am Mikrofon" (+30 BandMood, +3 Social).
        * (Trait: Visionary): "Sehe deine Vision" (+35 BandMood, +3 Chaos).
        * (Info: 1982 vorhanden): "Erinnerung an 1982" (+25 BandMood).
        * "Lego-Trick" (+10 BandMood).
        * "Equipment verkaufen" (-5 BandMood, zwingt ihn aber vor lauter Schreck auf die Bühne).
* **Lars (Energie-Mangel):**
    * *Item (Turbo-Koffein):*
        * Zweig A: "Auf Ex" (+40 BandMood, Lars "vibriert").
        * Zweig B: "Nur ein Schluck" (+20 BandMood).

---

## 4. VoidStation (Die Realitäts-Grenze)

* **Kosmischer Tankwart:**
    * *Spezial (Trait: Mystic):* "Ich suche die Wahrheit" (+30 BandMood, Erhalt: Splitter der Leere).
    * *Item (Industrie-Talisman):* "Lehre mich" (+20 BandMood, **Lore:** `tankwart_truth`) ODER "Gig spielen" (+5 BandMood).
    * *Item (Verbotenes Riff):* "Ich bin bereit" (+15 BandMood) ODER nach Konsequenzen fragen.
    * *Item (Dunkle Materie):* Van betanken mit 440Hz (+25 BandMood, Quest-Abschluss) ODER 432Hz (+10 BandMood, Quest-Abschluss).
    * *Quest-Abhängigkeit (cosmic_echo abgeschlossen):* Auf das Echo ansprechen (+15 BandMood, **Lore:** `cosmic_echo_decoded`).
* **Altes Terminal:**
    * *Interaktion:* Logbuch lesen (+5 BandMood, **Lore:** `void_1982`).
* **Kosmisches Echo:**
    * *Option (Trait: Visionary):* Nachricht entschlüsseln (+20 BandMood, Quest-Abschluss, **Lore:** `cosmic_echo_decoded`).
* **Marius' Ego (Item-Fund):**
    * *Hinweis: Egal welche Option gewählt wird, man erhält das Item "Marius Ego" und schaltet **Lore:** `ego_philosophy` frei.*
    * Option (Trait: Visionary): "Vision leitet uns" (+30 BandMood, +5 Chaos).
    * Option (Skill: Technical 8): "Resonanzfrequenz instabil" (+20 BandMood, +5 Technical).
    * Option (Skill: Social 8): "Fans brauchen dich" (+25 BandMood, +5 Social).
    * Standard: "Komm einfach mit" (+10 BandMood).
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
    * *Spezial-Option:* Sprache deuten (+20 BandMood, Quest: Forgotten Lore).
* **Wirt:**
    * *Item (Industrie-Talisman):* Erhält "Altes Plektrum" (wichtig für Matze in Salzgitter).
    * *BandMood > 80:* Erzählt Details über das Verschwinden des Managers 1982 (+10 BandMood).

---

## 6. Salzgitter (Das Finale)

* **Matze:**
    * *Item (Verbotenes Riff + Altes Plektrum):* Riff wird gebändigt (+20 BandMood).
        * Option (Skill: Chaos 10): "Chaos kanalisieren" (+50 BandMood, +5 Chaos).
        * Option (Skill: Technical 10): "Präzision im Chaos" (+40 BandMood, +5 Technical).
    * *Nur Verbotenes Riff (ohne Plektrum):* Er warnt vor Realitätsrissen.
* **Lars:**
    * *Wenn "vibriert" (Koffein im Backstage auf Ex getrunken):*
        * Option (Skill: Technical 10): "Frequenz synchronisieren" (+30 BandMood, +5 Technical).
    * *Wenn Drum-Philosophie gelehrt:* (+5 BandMood).
* **Marius:**
    * *Trait (Performer):* Spezial-Tipp für die Show geben (+30 BandMood, +5 Social).
    * *Skill (Chaos 10):* "Zorn kanalisieren" (+40 BandMood, +5 Chaos).
    * *Skill (Social 10):* "Menge beruhigen" (+30 BandMood, +5 Social).
* **Fan:**
    * *Item (Industrie-Talisman):* Als Geschenk übergeben (+40 BandMood).
    * *Item (Signierte Setliste):* Übergeben (+25 BandMood bei Umarmung / +15 bei Abstand).
