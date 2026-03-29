import re

with open("dialog_uebersicht.md", "r") as f:
    content = f.read()

# Make sure it actually replaced stuff
cynic = '    * *Spezial (Trait: Cynic):* Option, die Tour als "schlechten Witz" zu bezeichnen (+20 BandMood, +5 Chaos).'
cynic_new = '    * *Spezial (Trait: Cynic):* Option, die Tour als "schlechten Witz" zu bezeichnen (+20 BandMood, +5 Chaos).\n    * *Spezial (Trait: Performer):* "Zeig mir, wie du die Crowd liest." (+20 BandMood, +3 Social, setzt `matzeDeepTalk`).\n    * *BandMood > 60 Bonus:* Matze ist hyped und will einen Power-Chord zeigen.\n        * [Chaos 5]: Riss in der Wand (+15 BandMood, setzt `matzeRiffWarning`).\n        * Standard: Aufheben für Salzgitter (setzt `matzeRiffWarning`).'
content = content.replace(cynic, cynic_new)
print(content.count(cynic_new))

with open("dialog_uebersicht.md", "w") as f:
    f.write(content)
