import re

with open('dialog_uebersicht.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Add warning label to top
content = content.replace('# Neurotoxic – The Adventure: Komplette Dialog- und Interaktionsübersicht', '# Neurotoxic – The Adventure: Komplette Dialog- und Interaktionsübersicht\n\n*Aktualisiert für Phase 1-7 Erweiterungen (Maschinen-Seele, Frequenz 1982, Bassist-Quest, etc.)*')

# ==============================================================================
# SECTION 1: PROBERAUM
# ==============================================================================
matze_proberaum_additions = """    * *Nach Wasser (BandMood > 50):* "Erzähl mir von 1982" (setzt `askedAbout1982`).
        * Zweig A (Trait: Mystic): "Der Sound war nicht nur laut..." (+20 BandMood, +5 Chaos, Erhalt: Industrie-Talisman, Lore: `matze_1982_truth`).
        * Zweig B (Trait: Brutalist): "Zerstörung ist der Weg." (+15 BandMood, +3 Chaos).
        * Zweig C (Skill: Technical 3): "Röhren glühen." (+10 BandMood, +3 Technical).
        * Standard: "Wir machen Geschichte." (+5 BandMood).
    * *Sabotage-Verdacht:* "Lars trommelt komisch" (startet `lars_proberaum_secret`).
"""
content = content.replace('* **Matze (Gitarrist):**\n    * *Vor dem Aufwischen:*', '* **Matze (Gitarrist):**\n' + matze_proberaum_additions + '    * *Vor dem Aufwischen:*')

lars_proberaum_additions = """    * *Nach Rettung:*
        * Zweig A (Trait: Performer): "Bühne braucht dich" (+20 BandMood, +5 Social).
        * Zweig B (Skill: Technical 5): "Akustik optimieren" (+15 BandMood, +5 Technical).
        * Zweig C (Standard): "Gut trommeln" (+5 BandMood).
    * *Item (Turbo-Koffein):* Nimmt das Koffein an (+10 BandMood, entfernt Item).
"""
content = content.replace('* **Lars (Drummer):**\n    * *Ohne Bier/Mop:*', '* **Lars (Drummer):**\n' + lars_proberaum_additions + '    * *Ohne Bier/Mop:*')

marius_proberaum_additions = """    * *Nach Bier:*
        * Zweig A (Trait: Diplomat): "Du bist der Frontmann" (+25 BandMood, +5 Social).
        * Zweig B (Trait: Cynic): "Dein Ego ist zu groß" (+5 BandMood, +5 Chaos).
        * Standard: "Weiter so." (+10 BandMood).
"""
content = content.replace('* **Marius (Sänger):**\n    * *Ohne Bier:*', '* **Marius (Sänger):**\n' + marius_proberaum_additions + '    * *Ohne Bier:*')

proberaum_interactables = """* **Risse in der Wand (Interaktion):**
    * *Option (Trait: Brutalist):* Smash (+10 BandMood, +5 Chaos, Lore: `frequenz_1982_proberaum`, setzt `proberaum_brutalist_smash`).
    * *Option (Trait: Mystic):* Ritual (+20 BandMood, Lore: `frequenz_1982_proberaum`, setzt `proberaum_mystic_ritual`).
* **TR-8080 Drum Machine (Maschinen-Seele):**
    * *Option (Trait: Visionary):* Geist vereinen (+25 BandMood, +5 Chaos, setzt `maschinen_seele_tr8080`, Lore: `drum_machine_ghost`).
    * *Standard:* Schaltkreise füttern (+20 BandMood).
* **Talking Amp (Maschinen-Seele):**
    * *Reparatur (Lötkolben + Schrottmetall):* Amp repariert (+20 BandMood, +5 Technical, setzt `maschinen_seele_amp`, Lore: `talking_amp`).
"""
content = content.replace('## 2. Tourbus (Auf dem Weg nach Salzgitter)', proberaum_interactables + '\n## 2. Tourbus (Auf dem Weg nach Salzgitter)')

# ==============================================================================
# SECTION 2: TOURBUS
# ==============================================================================
matze_tourbus_additions = """* **Matze:**
    * *Sabotage Entdeckung (Item: Defektes Kabel):*
        * Zweig A (Skill: Technical 5): Analyse (+20 BandMood, +5 Technical, setzt `tourbus_sabotage_discovered`, Lore: `tourbus_saboteur`).
        * Zweig B (Standard): Reparatur (+10 BandMood, +2 Technical, Kabel repariert).
"""
content = content.replace('* **Marius:**\n    * *Item (Marius\' Ego):*', matze_tourbus_additions + '* **Marius:**\n    * *Item (Marius\' Ego):*')

marius_tourbus_additions = """    * *BandMood < 30:* Nervenzusammenbruch.
        * Option (Trait: Diplomat): Beruhigen (+20 BandMood, setzt `marius_tourbus_doubt`).
        * Option (Trait: Brutalist): Anschreien (+5 BandMood, +5 Chaos, setzt `marius_tourbus_doubt`).
"""
content = content.replace('* **Marius:**\n    * *Item (Marius\' Ego):*', '* **Marius:**\n' + marius_tourbus_additions + '    * *Item (Marius\' Ego):*')

tourbus_interactables = """* **Verstecktes Fach (Nur nach Sabotage-Entdeckung):**
    * *Interaktion (Skill: Technical 3):* Öffnen (+15 BandMood, Erhalt: Frequenzfragment, Erhalt: Magnetband, setzt `tourbus_secret_compartment_opened`, Lore: `frequenz_1982_tourbus`).
* **Geist eines Roadies:**
    * *Nach Drink:*
        * Option (Skill: Social 5): Nach Bassisten fragen (+25 BandMood, +5 Social, setzt `bassist_clue_ghost`, Lore: `roadie_bassist`).
    * *Flag `askedAbout1982` gesetzt (aus Proberaum):*
        * Option (Trait: Visionary): "Erzähl mir alles" (+30 BandMood, +5 Chaos, setzt `ghostSecretRevealed`).
        * Option (Skill: Technical 7): "Anomalie analysieren" (+25 BandMood, +4 Technical, setzt `ghostSecretRevealed`).
        * Option (Skill: Social 5): "Geist beruhigen" (+20 BandMood, +3 Social, setzt `ghostSecretRevealed`).
"""
content = content.replace('## 3. Backstage (Vor dem Gig)', tourbus_interactables + '\n## 3. Backstage (Vor dem Gig)')

# ==============================================================================
# SECTION 3: BACKSTAGE
# ==============================================================================
marius_backstage_additions = """* **Marius (Lampenfieber):**
    * *Optionen zur Beruhigung:*
        * (Skill: Social 5): "Gott am Mikrofon" (+30 BandMood, +3 Social, setzt `mariusConfidenceBoost`).
        * (Trait: Performer): "Nimm die Halle" (+35 BandMood, +5 Social, setzt `backstage_performer_speech`).
        * (Trait: Visionary): "Sehe deine Vision" (+35 BandMood, +3 Chaos, setzt `mariusConfidenceBoost`).
        * (Trait: Brutalist): "Sing oder flieg" (+10 BandMood).
        * (Info 1982 vorhanden): "Erinnerung an 1982" (+25 BandMood, setzt `mariusConfidenceBoost`).
"""
content = content.replace('* **Setliste (Item):**', marius_backstage_additions + '* **Setliste (Item):**')

lars_backstage_additions = """* **Lars (Energie-Mangel):**
    * *Item (Turbo-Koffein):*
        * Auf Ex: (+40 BandMood, setzt `larsVibrating`, `larsEnergized`).
        * Nur ein Schluck (Trait: Diplomat): (+30 BandMood, +3 Social, setzt `lars_paced`, `larsEnergized`).
    * *Wenn Lars Vibriert:*
        * (Skill: Chaos 5): "Chaos" (+20 BandMood, +3 Chaos, setzt `larsDrumPhilosophy`).
        * (Skill: Technical 5): "Metronom" (+10 BandMood, setzt `larsDrumPhilosophy`).
"""
content = content.replace('* **Setliste (Item):**', lars_backstage_additions + '* **Setliste (Item):**')

backstage_interactables = """* **Feedback-Monitor (Maschinen-Seele Abschluss):**
    * *Benötigt Amp & TR-8080 Flags:*
        * Option (Trait: Mystic): Vereinigen (+40 BandMood, +5 Chaos, setzt `maschinen_seele_complete`, Lore: `maschinen_bewusstsein`).
        * Option (Skill: Technical 7): Logisch verbinden (+30 BandMood, +5 Technical, setzt `maschinen_seele_complete`).
* **Alte Blaupause (Nur wenn Sabotage entdeckt):**
    * *Option (Skill: Technical 7):* Analysieren (+3 Technical, setzt `backstage_blueprint_found`).
* **Ritual-Kreis (Frequenz 1982 Abschluss):**
    * *Mit Resonanz-Kristall + Blaupause:*
        * (Trait: Mystic): Frequenz vollenden (+50 BandMood, setzt `frequenz1982_complete`, Lore: `frequenz_1982_decoded`).
        * (Trait: Brutalist): Kristall zerschmettern (+40 BandMood, +5 Chaos, Item verloren, setzt `frequenz1982_complete`).
"""
content = content.replace('## 4. VoidStation (Die Leere)', backstage_interactables + '\n## 4. VoidStation (Die Leere)')

# ==============================================================================
# SECTION 4: VOIDSTATION
# ==============================================================================
voidstation_interactables = """* **Kosmischer Tankwart:**
    * *Van betanken (Item: Dunkle Materie):*
        * (Nur mit Resonanz-Kristall, Trait: Mystic): Frequenz 1982 Tankfüllung (+40 BandMood, setzt `tankwart_fuel_quest_started`).
* **Schwebender Bassist (Nur wenn Hinweise von Matze & Ghost vorhanden):**
    * *Interaktion:*
        * (Skill: Social 8): Band braucht dich (+40 BandMood, +3 Social, setzt `bassist_contacted`, Lore: `bassist_wahrheit`).
        * (Skill: Technical 10): Phasenverschiebung (+50 BandMood, +3 Technical, setzt `bassist_contacted`).
        * (Trait: Mystic): Leere tragen (+40 BandMood, +3 Chaos, setzt `bassist_contacted`).
* **Marius' Ego (Item):**
    * *Spezial (Wenn Marius zweifelt, Trait: Diplomat):* Ego überzeugen (+40 BandMood, +5 Social, setzt `mariusConfidenceBoost`).
* **Diplomaten-Interface (Neu):**
    * *Option (Trait: Diplomat):* Verhandeln (+30 BandMood, +5 Social, setzt `void_diplomat_negotiation`, Lore: `schaltpult_record`).
"""
content = content.replace('## 5. Kaminstube (Die Bar)', voidstation_interactables + '\n## 5. Kaminstube (Die Bar)')

# ==============================================================================
# SECTION 5: KAMINSTUBE
# ==============================================================================
kaminstube_interactables = """* **Wirt (Geheimnis):**
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
"""
content = content.replace('## 6. Salzgitter (Das Finale)', kaminstube_interactables + '\n## 6. Salzgitter (Das Finale)')

# ==============================================================================
# SECTION 6: SALZGITTER
# ==============================================================================
salzgitter_interactables = """
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
* **Geister-Drink:** Entsteht durch die Kombination von `Bier` und `Dunkle Materie`. (Erforderlich für Ghost Roadie Quest).
"""
content += salzgitter_interactables

with open('dialog_uebersicht.md', 'w', encoding='utf-8') as f:
    f.write(content)
