import re

with open("dialog_uebersicht.md", "r") as f:
    content = f.read()

# Let's do simple replaces instead of complex regexes
cynic = '    * *Spezial (Trait: Cynic):* Option, die Tour als "schlechten Witz" zu bezeichnen (+20 BandMood, +5 Chaos).'
cynic_new = '    * *Spezial (Trait: Cynic):* Option, die Tour als "schlechten Witz" zu bezeichnen (+20 BandMood, +5 Chaos).\n    * *Spezial (Trait: Performer):* "Zeig mir, wie du die Crowd liest." (+20 BandMood, +3 Social, setzt `matzeDeepTalk`).\n    * *BandMood > 60 Bonus:* Matze ist hyped und will einen Power-Chord zeigen.\n        * [Chaos 5]: Riss in der Wand (+15 BandMood, setzt `matzeRiffWarning`).\n        * Standard: Aufheben für Salzgitter (setzt `matzeRiffWarning`).'
content = content.replace(cynic, cynic_new)


lars_old = '            * *Unterzweig (Standard):* "Klingt anstrengend" (kein Mood-Effekt).'
lars_new = '            * *Unterzweig (Standard):* "Klingt anstrengend" (kein Mood-Effekt).\n    * *Rhythmus-Pakt (Nachdem larsDrumPhilosophy gesetzt wurde):*\n        * [Brutalist]: Aggressiver Pakt (+25 BandMood, +5 Chaos, Quest `rhythm_pact`, Lore `rhythm_pact`, setzt `larsRhythmPact`).\n        * [Diplomat]: Harmonischer Pakt (+20 BandMood, +5 Social, Quest `rhythm_pact`, Lore `rhythm_pact`, setzt `larsRhythmPact`).\n        * Standard: Bedenkzeit.'
content = content.replace(lars_old, lars_new)


marius_old = """* **Marius (Sänger):**
    * *Nach Bier:*
        * Zweig A (Trait: Diplomat): "Du bist der Frontmann" (+25 BandMood, +5 Social).
        * Zweig B (Trait: Cynic): "Dein Ego ist zu groß" (+5 BandMood, +5 Chaos).
        * Standard: "Weiter so." (+10 BandMood)."""
marius_new = """* **Marius (Sänger):**
    * *Nach Bier (Wie bereitest du dich auf Salzgitter vor?):*
        * (Trait: Performer): Bühnenpräsenz-Coaching (+15 BandMood, +3 Social, setzt `mariusEgoStrategy`).
        * (Trait: Cynic): "Du wirst auf der Bühne sterben" (+10 BandMood, +3 Chaos).
        * (Skill: Social 7): Ego-Management-Plan (+20 BandMood, setzt `mariusEgoStrategy`).
        * Standard: "Bleib einfach cool" (kein Effekt).
        * *Nach Erstkontakt (BandMood > 50):*
            * Zweig A (Trait: Diplomat): "Du bist der Frontmann" (+15 BandMood, +3 Social, setzt `marius_tourbus_doubt`).
            * Zweig B (Trait: Cynic): "Dein Ego ist zu groß" (+5 BandMood, +2 Chaos).
            * Standard: "Bereit für den Gig?" (+10 BandMood)."""
content = content.replace(marius_old, marius_new)


amp_old = """    * *Therapie-Sitzung:*
        * Option (Trait: Diplomat): "Du bist ein Bewusstsein" (+30 BandMood, Quest-Abschluss: `amp_therapy`, setzt `ampTherapyCompleted`).
        * Option (Trait: Brutalist): "Du bist ein Werkzeug" (+10 BandMood, Quest-Abschluss: `amp_therapy`, setzt `ampTherapyCompleted`)."""
amp_new = """    * *Therapie-Sitzung:*
        * Option (Trait: Mystic): "Ich höre deine wahre Stimme, Amp" (+20 BandMood, Quest-Abschluss: `amp_therapy`, setzt `ampTherapyCompleted` & `ampSentient`).
        * Option (Trait: Diplomat): "Du bist ein Bewusstsein" (+30 BandMood, Quest-Abschluss: `amp_therapy`, setzt `ampTherapyCompleted`).
        * Option (Trait: Brutalist): "Du bist ein Werkzeug" (+10 BandMood, Quest-Abschluss: `amp_therapy`, setzt `ampTherapyCompleted`)."""
content = content.replace(amp_old, amp_new)


matze_tour_old = """    * *Mit Repariertem Kabel:* "Bühne abreißen!" (+10 BandMood, Quest-Abschluss: `cable`)."""
matze_tour_new = """    * *Mit Repariertem Kabel (Angst vor Salzgitter?):*
        * [Visionary]: "Ich sehe unseren Sieg" (+15 BandMood, Quest-Abschluss: `cable`).
        * [Technical 5]: "Soundcheck analysiert" (+20 BandMood, +3 Technical, Quest-Abschluss: `cable`).
        * [Social 5]: "Wir schaffen das zusammen" (+15 BandMood, +3 Social, Quest-Abschluss: `cable`).
        * Standard: "Ein bisschen schon" oder "Lass uns die Bühne abreißen!" (+10 BandMood, Quest-Abschluss: `cable`)."""
content = content.replace(matze_tour_old, matze_tour_new)


marius_tour_old = """* **Marius:**"""
marius_tour_new = """* **Band-Besprechung (Mitte des Busses, nachdem Sabotage entdeckt wurde):**
    * (Trait: Diplomat): Vermitteln (+30 BandMood, Quest `band_meeting`, setzt `tourbusBandMeeting`).
    * (Trait: Brutalist): Zusammenreißen (+20 BandMood, Quest `band_meeting`, setzt `tourbusBandMeeting`).
    * (Trait: Performer): Motivationsrede (+25 BandMood, Quest `band_meeting`, setzt `tourbusBandMeeting`).
    * Standard: Einfache Ansagen (+10 BandMood, Quest `band_meeting`, setzt `tourbusBandMeeting`).
* **Marius:**"""
content = content.replace(marius_tour_old, marius_tour_new, 1)


ghost_old = """    * *Spezial-Items:*"""
ghost_new = """    * *Vertrauens-Pfad (Wenn ghostSecretRevealed & askedAbout1982 gesetzt):*
        * [Mystic]: "Ich will dir wirklich helfen" (+25 BandMood, Quest `ghost_trust`, Lore `ghost_legacy`, setzt `ghostTrustEarned`).
        * [Social 7]: "Erzähl mir deine Geschichte" (+20 BandMood, Quest `ghost_trust`, Lore `ghost_legacy`, setzt `ghostTrustEarned`).
        * Standard: "Nur aus Neugier".
    * *Spezial-Items:*"""
content = content.replace(ghost_old, ghost_new, 1)


monitor_old = """* **Feedback-Monitor:**"""
monitor_new = """* **Feedback-Monitor:**
    * *Wenn ampSentient gesetzt:* "Der Amp hat mir von dir erzählt" (+25 BandMood, +5 Technical, startet Quest)."""
content = content.replace(monitor_old, monitor_new, 1)


marius_bs_old = """* **Marius (Lampenfieber):**
    * *Optionen zur Beruhigung (Quest-Abschluss `marius` für jede, setzt `mariusCalmed`):*
        * (Skill: Social 5): "Gott am Mikrofon" (+30 BandMood, +3 Social, setzt `mariusConfidenceBoost`).
        * (Trait: Performer): "Nimm die Halle" (+35 BandMood, +5 Social, setzt `backstage_performer_speech`, setzt `mariusConfidenceBoost`).
        * (Trait: Brutalist): "Sing oder flieg" (+10 BandMood). **Hinweis: setzt NICHT `mariusConfidenceBoost` — kein Zugang zu Good/Great Endings.**
        * (Flag `askedAbout1982` gesetzt): "Erinnerung an 1982" (+25 BandMood, setzt `mariusConfidenceBoost`) ODER "Wovon redest du?" (-5 BandMood).
        * "Lego-Trick" (+10 BandMood)."""
marius_bs_new = """* **Marius (Lampenfieber):**
    * *Optionen zur Beruhigung (Quest-Abschluss `marius` für jede, setzt `mariusCalmed`):*
        * *Bonus (Wenn mariusEgoStrategy gesetzt):* "Erinnerst du dich an unsere Strategie?" (+35 BandMood, +5 Social, setzt `mariusConfidenceBoost`).
        * (Skill: Social 5): "Gott am Mikrofon" (+30 BandMood, +3 Social, setzt `mariusConfidenceBoost`).
        * (Trait: Performer): "Einziger Mensch auf der Bühne" (+30 BandMood, +3 Social, setzt `backstage_performer_speech`, setzt `mariusConfidenceBoost`, `mariusStageFright`).
        * (Trait: Mystic): "Lass die Frequenz durch dich fließen" (+25 BandMood, +3 Chaos, setzt `mariusConfidenceBoost`, `mariusStageFright`).
        * (Trait: Brutalist): "Angst ist Schwäche. Zerstöre sie" (+20 BandMood, +3 Chaos, setzt `mariusStageFright`). **Hinweis: setzt NICHT `mariusConfidenceBoost`.**
        * (Flag `askedAbout1982` gesetzt): "Erinnerung an 1982" (+25 BandMood, setzt `mariusConfidenceBoost`).
        * "Lego-Trick" (+10 BandMood)."""
content = content.replace(marius_bs_old, marius_bs_new)


lars_bs_old = """* **Lars (Energie-Mangel):**
    * *Item (Turbo-Koffein):*
        * Auf Ex: (+40 BandMood, setzt `larsVibrating`, `larsEnergized`).
        * Nur ein Schluck (Trait: Diplomat): (+30 BandMood, +3 Social, setzt `lars_paced`, `larsEnergized`).
        * Nur ein Schluck (Standard): (+20 BandMood, setzt `larsEnergized`)."""
lars_bs_new = """* **Lars (Energie-Mangel):**
    * *Item (Turbo-Koffein):*
        * *Bonus (Wenn larsRhythmPact gesetzt):*
            * [Chaos 5]: "Lass den Rhythmus explodieren!" (+50 BandMood, setzt `larsVibrating`, `larsEnergized`).
            * "Der Pakt hält." (+40 BandMood, setzt `larsEnergized`).
        * Auf Ex: (+40 BandMood, setzt `larsVibrating`, `larsEnergized`).
        * Nur ein Schluck (Trait: Diplomat): (+30 BandMood, +3 Social, setzt `lars_paced`, `larsEnergized`).
        * Nur ein Schluck (Standard): (+20 BandMood, setzt `larsEnergized`)."""
content = content.replace(lars_bs_old, lars_bs_new)

ritual_old = """* **Ritual-Kreis:**
    * *Mit Resonanz-Kristall + Blaupause:*"""
ritual_new = """* **Ritual-Kreis:**
    * *Bandritual (Wenn mariusCalmed gesetzt & backstageRitualPerformed noch nicht):*
        * [Mystic]: Kosmisches Ritual (+35 BandMood, +5 Chaos, Quest `backstage_ritual`, setzt `backstageRitualPerformed`).
        * [Performer]: Showmanship Ritual (+30 BandMood, +5 Social, Quest `backstage_ritual`, setzt `backstageRitualPerformed`).
        * [Technician]: Frequenz-Anpassung (+25 BandMood, +5 Technical, Quest `backstage_ritual`, setzt `backstageRitualPerformed`).
        * Standard: Einfacher Chant (+15 BandMood, Quest `backstage_ritual`, setzt `backstageRitualPerformed`).
    * *Mit Resonanz-Kristall + Blaupause:*"""
content = content.replace(ritual_old, ritual_new)


tank_old = """* **Kosmischer Tankwart:**
    * *Spezial (Trait: Mystic):* "Ich suche die Wahrheit" (+30 BandMood, Erhalt: Splitter der Leere)."""
tank_new = """* **Kosmischer Tankwart:**
    * *Wenn ghostTrustEarned gesetzt:* "Wir spielen für ihn in Salzgitter." (+20 BandMood, setzt `tankwartBargain`).
    * *Spezial (Trait: Mystic):* "Ich suche die Wahrheit" (+30 BandMood, Erhalt: Splitter der Leere).
    * *Spezial (Trait: Cynic):* "Das ist doch alles Quatsch. Gib mir Sprit." (+15 BandMood, +3 Chaos).
    * *Spezial (Trait: Performer):* "Ich spiele für dich, Tankwart." (+25 BandMood, +5 Social)."""
content = content.replace(tank_old, tank_new)


bassist_old = """* **Schwebender Bassist** *(erscheint nur wenn `bassist_clue_matze` & `bassist_clue_ghost` gesetzt und `bassist_contacted` noch nicht gesetzt):*
    * *Option (Skill: Social 8):* "Die Band braucht dich" (+40 BandMood, +3 Social, setzt `bassist_contacted`, **Lore:** `bassist_wahrheit`).
    * *Option (Skill: Technical 10):* "Du hängst in einer Rückkopplungsschleife fest" (+50 BandMood, +3 Technical, setzt `bassist_contacted`, **Lore:** `bassist_wahrheit`).
    * *Option (Trait: Mystic):* "Lass dich von der Leere tragen" (+40 BandMood, +3 Chaos, setzt `bassist_contacted`, **Lore:** `bassist_wahrheit`).
    * *Standard:* "Ich lass dich besser in Ruhe" (kein Mood-Effekt)."""
bassist_new = """* **Schwebender Bassist** *(erscheint nur wenn `bassist_clue_matze` & `bassist_clue_ghost` gesetzt und `bassist_contacted` noch nicht gesetzt):*
    * *Option (Skill: Social 8):* "Die Band vermisst dich" (+25 BandMood, +3 Social, setzt `bassist_contacted`, `voidBassistSpoken`, Quest `bassist_mystery`, Lore `bassist_truth`).
    * *Option (Skill: Technical 8):* "Ich kann deine Frequenz messen" (+50 BandMood, +3 Technical, setzt `bassist_contacted`, `voidBassistSpoken`, Quest `bassist_mystery`, Lore `bassist_truth`).
    * *Option (Trait: Mystic):* "Ich höre deine Melodie" (+30 BandMood, +3 Chaos, setzt `bassist_contacted`, `voidBassistSpoken`, Quest `bassist_mystery`, Lore `bassist_truth`).
    * *Option (Trait: Visionary):* "Ich sehe dich zwischen den Dimensionen" (+40 BandMood, +3 Chaos, setzt `bassist_contacted`, `voidBassistSpoken`, Quest `bassist_mystery`, Lore `bassist_truth`)."""
content = content.replace(bassist_old, bassist_new)


ego_old = """* **Marius' Ego (Item):**
    * *Hinweis: Egal welche Option gewählt wird, man erhält das Item "Marius' Ego" und schaltet **Lore:** `ego_philosophy` frei. Quest-Abschluss: `ego`.*
    * Option (Trait: Visionary): "Vision leitet uns" (+30 BandMood, +5 Chaos).
    * Option (Skill: Technical 8): "Resonanzfrequenz instabil" (+20 BandMood, +5 Technical).
    * Option (Skill: Social 8): "Fans brauchen dich" (+25 BandMood, +5 Social).
    * Standard: "Komm einfach mit" (+10 BandMood)."""
ego_new = """* **Marius' Ego (Item):**
    * *Bonus (Wenn mariusEgoStrategy):* "Wende unsere Strategie an." (+35 BandMood).
    * *Bonus (Wenn marius_tourbus_doubt) (Trait: Diplomat):* "Marius glaubt nicht mehr an sich. Du musst ihn retten." (+40 BandMood, +5 Social, setzt `mariusConfidenceBoost`).
    * Option (Trait: Visionary): "Vision leitet uns" (+30 BandMood, +5 Chaos).
    * Option (Skill: Technical 8): "Resonanzfrequenz instabil" (+20 BandMood, +5 Technical).
    * Option (Skill: Social 8): "Fans brauchen dich" (+25 BandMood, +5 Social).
    * Option (Trait: Brutalist): "Ich zwinge dich zurück!" (+15 BandMood, +3 Chaos).
    * Option (Trait: Diplomat): "Verhandeln wir." (+25 BandMood, +3 Social).
    * Standard: "Komm einfach mit" (+10 BandMood)."""
content = content.replace(ego_old, ego_new)


wirt_old = """* **Wirt:**
    * *Item (Industrie-Talisman):*"""
wirt_new = """* **Wirt:**
    * *BandMood > 80 & 1982 angesprochen / Geist-Geheimnis bekannt:*
        * *Bonus (Wenn ghostTrustEarned):* "Der Geist hat mich geschickt." (+30 BandMood, Quest `wirt_legacy`, setzt `wirtLegacy1982`).
        * Option (Trait: Diplomat): "Ich bin vertrauenswürdig." (+25 BandMood, +5 Social, Quest `wirt_legacy`, setzt `wirtLegacy1982`).
        * Option (Skill: Social 7): "Es ist wichtig für die Band." (+20 BandMood, +3 Social, Quest `wirt_legacy`, setzt `wirtLegacy1982`).
        * Option (Skill: Chaos 5): "Die Wahrheit muss raus!" (+15 BandMood, +3 Chaos, Quest `wirt_legacy`, setzt `wirtLegacy1982`).
    * *Item (Industrie-Talisman):*"""
content = content.replace(wirt_old, wirt_new)


fluester_old = """* **Flüsternder Kamin (Trait: Diplomat):**
    * *Spezial-Option:* Sprache deuten (+20 BandMood, Quest-Abschluss: `forgotten_lore`)."""
fluester_new = """* **Flüsternder Kamin:**
    * *Option (Trait: Mystic):* "Wärme fühlen" (+20 BandMood, Quest `forgotten_lore`, Lore `kamin_prophecy`, setzt `kaminFeuerPact`).
    * *Option (Trait: Diplomat):* "Sprache deuten" (+20 BandMood, Quest `forgotten_lore`, Lore `kamin_prophecy`, setzt `kaminFeuerPact`).
    * *Option (Skill: Technical 8):* "Akustik analysieren" (+15 BandMood, +3 Technical, Quest `forgotten_lore`, Lore `kamin_prophecy`, setzt `kaminFeuerPact`).
    * *Option (Skill: Chaos 7):* "Feuer zwingen" (+10 BandMood, +3 Chaos, Quest `forgotten_lore`, Lore `kamin_prophecy`, setzt `kaminFeuerPact`)."""
content = content.replace(fluester_old, fluester_new)

kamin_lars_old = """* **Lars:**
    * *Rhythmus der Schmiede:*
        * (Skill: Technical 5): 120 BPM (+15 BandMood, +3 Technical, setzt `kaminstube_lars_talked`).
        * (Skill: Chaos 5): Polyrhythmus (+20 BandMood, +3 Chaos, setzt `kaminstube_lars_talked`)."""
kamin_lars_new = """* **Marius:**
    * *Reaktionen auf Zustände:*
        * (Wenn mariusEgoStrategy gesetzt): "Strategie funktioniert" (+10 BandMood).
        * (Wenn egoContained gesetzt): "Mein Ego brennt in mir!"
        * Standard: "Underground Metal Fest!"
* **Lars:**
    * *Rhythmus der Schmiede:*
        * *Bonus (Wenn larsRhythmPact):* "Ort hat eigenen Rhythmus." (+10 BandMood, setzt `kaminstube_lars_talked`).
        * (Skill: Technical 5): 120 BPM (+15 BandMood, +3 Technical, setzt `kaminstube_lars_talked`) ODER "Akustik perfekt" (+10 BandMood, +2 Technical).
        * (Skill: Chaos 5): Polyrhythmus (+20 BandMood, +3 Chaos, setzt `kaminstube_lars_talked`)."""
content = content.replace(kamin_lars_old, kamin_lars_new)


salz_matze_old = """* **Matze:**
    * *Item (Verbotenes Riff + Altes Plektrum):* Riff wird gebändigt.
        * Option (Skill: Chaos 10): "Chaos kanalisieren" (+70 BandMood, +5 Chaos).
        * Option (Skill: Technical 10): "Präzision im Chaos" (+60 BandMood, +5 Technical).
        * Standard: (+20 BandMood).
    * *Nur Verbotenes Riff (ohne Plektrum):* Er warnt vor Realitätsrissen.
    * *Deep Talk (Trait: Visionary):* (+50 BandMood, +5 Chaos).
    * *Deep Talk (Standard):* (+10 BandMood)."""
salz_matze_new = """* **Matze:**
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
        * Standard: "Wir brechen den Fluch" (+20 BandMood)."""
content = content.replace(salz_matze_old, salz_matze_new)


salz_lars_old = """* **Lars:**
    * *Wenn "vibriert" (Koffein im Backstage auf Ex getrunken):*
        * Option (Skill: Technical 10): "Frequenz synchronisieren" (+40 BandMood, +5 Technical).
        * Standard: (+10 BandMood).
    * *Philosophie:* (+5 BandMood)."""
salz_lars_new = """* **Lars:**
    * *Wenn larsRhythmPact:*
        * *Bonus (Wenn larsVibrating):* Hyperpowered Lars (+50 BandMood, +5 Chaos).
        * Standard: "Realität zertrümmern" (+30 BandMood)."""
content = content.replace(salz_lars_old, salz_lars_new)


salz_marius_old = """* **Marius:**
    * *Trait (Performer):* Spezial-Tipp für die Show geben (+30 BandMood, +5 Social).
    * *Confidence Boost (Skill: Chaos 10):* "Zorn kanalisieren" (+55 BandMood, +5 Chaos).
    * *Confidence Boost (Skill: Social 10):* "Menge beruhigen" (+45 BandMood, +5 Social).
    * *Confidence Boost (Standard):* (+15 BandMood)."""
salz_marius_new = """* **Marius:**
    * *Trait (Performer):* Spezial-Tipp für die erste Reihe geben (+30 BandMood, +5 Social).
    * *Unite Band (mariusEgoStrategy + mariusConfidenceBoost + egoContained):*
        * Wenn Band bereit (Matze & Lars Quests): "Die Band ist vereint." (+30 BandMood, Quest `unite_band`, setzt `salzgitterBandUnited`).
    * *Confidence Boost:*
        * (Wenn backstage_performer_speech): (+30 BandMood, +5 Social).
        * (Wenn egoContained & bassist_contacted): "Sing für den Bassisten" (+50 BandMood).
        * (Skill: Chaos 10): "Zorn kanalisieren" (+40 BandMood, +5 Chaos).
        * (Skill: Social 10): "Menge beruhigen" (+30 BandMood, +5 Social)."""
content = content.replace(salz_marius_old, salz_marius_new)

salz_bass_old = """* **Schwebender Bassist:**
    * *Interaktion:* Betrachten (+10 BandMood)."""
salz_bass_new = """* **Schwebender Bassist:**
    * *Wenn voidBassistSpoken (und Quest abgeschlossen):* "Erinnert sich" (+30 BandMood, setzt `bassist_restored`).
    * *Item (Bassist-Saite) (Trait: Mystic):* Übergeben (+40 BandMood, setzt `bassist_restored`, Lore `bassist_wahrheit`).
    * *Item (Resonanz-Kristall):* Einsetzen (+30 BandMood, setzt `bassist_restored`, Lore `bassist_wahrheit`)."""
content = content.replace(salz_bass_old, salz_bass_new)


salz_fan_old = """* **Fan:**
    * *Item (Industrie-Talisman):* Als Geschenk übergeben (+40 BandMood).
    * *Item (Signierte Setliste):* Übergeben (+25 BandMood bei Umarmung / +15 bei Abstand).
    * *Standard:* Beleidigen (-2 BandMood)."""
salz_fan_new = """* **Fan:**
    * *Fan Movement Quest:*
        * (Trait: Performer): "Folgt mir!" (+35 BandMood, Quest `fan_movement`, setzt `fanMovement`).
        * (Skill: Social 8): "Zusammen singen!" (+30 BandMood, Quest `fan_movement`, setzt `fanMovement`).
        * (Trait: Diplomat): "Eins mit der Musik" (+25 BandMood, Quest `fan_movement`, setzt `fanMovement`).
    * *Item (Industrie-Talisman):* Als Geschenk übergeben (+40 BandMood).
    * *Item (Signierte Setliste):* Übergeben (+25 BandMood bei Umarmung / +15 bei Abstand).
    * *Diplomat Andenken:* (+20 BandMood, setzt `gaveDiplomatSouvenir`)."""
content = content.replace(salz_fan_old, salz_fan_new)


salz_fin_old = """    * **[TRUE ENDING]:** Benötigt `salzgitter_true_ending` & `bassist_restored` & `maschinen_seele_complete`. (+100 BandMood, schaltet letzte Lore frei).
    * **[SECRET ENCORE]:** Benötigt `salzgitter_encore_unlocked`. (+50 BandMood).
    * **[GREAT ENDING]:** Benötigt `frequenz1982_complete` & `mariusConfidenceBoost` & BandMood > 70. (+70 BandMood).
    * **[GOOD ENDING]:** Benötigt `mariusConfidenceBoost` & BandMood > 70. (+50 BandMood).
    * **[STANDARD ENDING]:** Wenn keine Bedingungen erfüllt sind. (+30 BandMood)."""
salz_fin_new = """    * **[TRUE ENDING]:** Benötigt `salzgitter_true_ending` & `bassist_restored` & `maschinen_seele_complete`. (+100 BandMood, schaltet letzte Lore frei).
    * **[SECRET ENCORE]:** Benötigt `salzgitter_encore_unlocked`. (+50 BandMood).
    * **[BEST ENDING]:** Benötigt 4 oder mehr Finale-Flags (`salzgitterBandUnited`, `fanMovement`, `backstageRitualPerformed`, `wirtLegacy1982`, `voidBassistSpoken`) ODER (`frequenz1982_complete` & `mariusConfidenceBoost` & BandMood > 70). (+70 BandMood).
    * **[GOOD ENDING]:** Benötigt 2 oder mehr Finale-Flags ODER (`mariusConfidenceBoost` & BandMood > 70). (+50 BandMood).
    * **[STANDARD ENDING]:** Wenn keine Bedingungen erfüllt sind. (+30 BandMood)."""
content = content.replace(salz_fin_old, salz_fin_new)

content = content.replace("* **Geister-Drink:** Entsteht durch die Kombination von `Turbo-Koffein` und `Rostiges Plektrum`. (Erforderlich für Ghost Roadie Quest).", "* **Geister-Drink:** Entsteht durch die Kombination von `Turbo-Koffein` und `Rostiges Plektrum`. (Erforderlich für Ghost Roadie Quest).\n* **Void-Plektrum:** Entsteht durch die Kombination von `Splitter der Leere` und `Altes Plektrum`.")


with open("dialog_uebersicht.md", "w") as f:
    f.write(content)
