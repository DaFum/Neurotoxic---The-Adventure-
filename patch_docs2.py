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

with open("dialog_uebersicht.md", "w") as f:
    f.write(content)
