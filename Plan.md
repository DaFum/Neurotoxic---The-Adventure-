# Implementation Plan: Expanded Branching Dialogues, Quests, and Trait-Reactive Content

## Overview

This plan adds meaningful new content to all 6 scenes while following established patterns. The design focuses on three cross-scene quest chains, trait-exclusive dialogue branches for every NPC, escalating skill gates across scenes, and flag-based consequence tracking that makes choices in early scenes ripple forward.

---

## Part 1: New Store State (src/store.ts)

### New Flags (add to `flags` in `initialState`)
```typescript
// Cross-scene quest chain: "Die Frequenz von 1982"
frequenz1982_proberaum: false,      // Discovered frequency clue in Proberaum
frequenz1982_tourbus: false,        // Found tape fragment in TourBus  
frequenz1982_backstage: false,      // Decoded ritual pattern in Backstage
frequenz1982_complete: false,       // Assembled the full frequency in VoidStation
// Cross-scene quest chain: "Der Verlorene Bassist"
bassist_clue_matze: false,          // Matze shared memory of the bassist
bassist_clue_ghost: false,          // Ghost Roadie revealed what he saw
bassist_clue_wirt: false,           // Wirt told about the 1982 night
bassist_contacted: false,           // Contacted bassist in VoidStation
bassist_restored: false,            // Brought bassist back in Salzgitter
// Cross-scene quest chain: "Maschinen-Seele"
maschinen_seele_amp: false,         // Sprechender Amp shared a memory fragment
maschinen_seele_tr8080: false,      // TR-8080 shared its origin
maschinen_seele_monitor: false,     // Feedback Monitor revealed connection
maschinen_seele_complete: false,    // United the machine consciousness
// Per-scene consequence flags
proberaum_brutalist_smash: false,   // Brutalist smashed the puddle away
proberaum_mystic_ritual: false,     // Mystic performed a ritual on the puddle
tourbus_sabotage_discovered: false, // Discovered who sabotaged the cable
tourbus_matze_confession: false,    // Matze confessed about 1982
backstage_performer_speech: false,  // Performer gave a rousing speech
backstage_cynic_sabotage: false,    // Cynic discovered the venue's secret
void_diplomat_negotiation: false,   // Diplomat negotiated with the void
void_bassist_message: false,        // Received message from the floating bassist
kaminstube_crowd_rallied: false,    // Successfully rallied the crowd
kaminstube_wirt_betrayal: false,    // Discovered Wirt's hidden agenda
salzgitter_encore_unlocked: false,  // Unlocked the secret encore
salzgitter_true_ending: false,      // Achieved the true ending
lars_proberaum_secret: false,       // Lars revealed secret in Proberaum
marius_tourbus_doubt: false,        // Marius expressed doubt in TourBus
```


### New Quests (added dynamically via `addQuest()`)

| Quest ID | Text (German) | Where Started | Where Completed |
|---|---|---|---|
| `frequenz_1982` | `Sammle die Frequenzfragmente von 1982` | Proberaum | VoidStation |
| `verlorener_bassist` | `Finde Hinweise zum verschwundenen Bassisten von 1982` | Proberaum/TourBus | Salzgitter |
| `maschinen_seele` | `Entdecke die Verbindung zwischen den Maschinen` | Proberaum | Backstage/VoidStation |
| `tourbus_saboteur` | `Finde heraus, wer das Kabel sabotiert hat` | TourBus | TourBus |
| `crowd_warmup` | `Heize der Crowd in der Kaminstube ein` | Kaminstube | Kaminstube |
| `wirt_geheimnis` | `Entdecke das Geheimnis des Wirts` | Kaminstube | Kaminstube |
| `secret_encore` | `Schalte die geheime Zugabe in Salzgitter frei` | Salzgitter | Salzgitter |



### New Lore Entries (add to `loreEntries` in `initialState`)
```typescript
{ id: 'frequenz_1982_decoded', title: 'Die Frequenz von 1982', content: 'Die Frequenz war nie verloren. Sie lebte in den Wänden der Gießerei, im Stahl des Tourbus, im Feedback der Monitore. 432.1982Hz — die Frequenz, die zwischen Leben und Lärm schwingt.', discovered: false },
{ id: 'bassist_wahrheit', title: 'Die Wahrheit über den Bassisten', content: 'Er wählte die Leere. Nicht aus Verzweiflung, sondern aus Liebe zum reinen Klang. Er ist der Grundton, auf dem alles aufbaut. Ohne ihn wäre NEUROTOXIC nur Lärm.', discovered: false },
{ id: 'maschinen_bewusstsein', title: 'Das Maschinen-Bewusstsein', content: 'Sie waren nie nur Werkzeuge. Der Amp, die Drum Machine, der Monitor — sie sind Fragmente eines einzigen Bewusstseins, das 1982 in die Schaltkreise eingespeist wurde.', discovered: false },
{ id: 'wirt_vergangenheit', title: 'Der Wirt und 1982', content: 'Er war dabei. Er war der Tontechniker beim Gig in der Gießerei. Er hat den Bassist in die Leere geschickt — nicht aus Bosheit, sondern weil der Sound es verlangte.', discovered: false },
```

### New Item Combination (add to `combineItems`)

```

// Frequenzfragment + Splitter der Leere = Resonanz-Kristall

'Frequenzfragment' + 'Splitter der Leere' -> 'Resonanz-Kristall'

```

---

## Part 2: Per-Scene Content Additions

### Scene 1: Proberaum (src/components/scenes/Proberaum.tsx)

**New Dialogue Branches for Existing NPCs:**

**Matze -- New "1982 Frequency" branch:**

After `waterCleaned` and `gotBeer`, when asking about 1982, add a new sub-option:

- `[Mystic]` "Ich spüre eine Frequenz in den Wänden..." --> Matze reveals the rehearsal room was built on the old Giesserei foundation. Sets `frequenz1982_proberaum`, `bassist_clue_matze`. Adds `Frequenzfragment` to inventory. Starts quest `frequenz_1982`. +20 bandMood, +3 chaos.

- `[Brutalist]` "Lass mich die Wand einschlagen, da ist was dahinter." --> Matze panics but you find a hidden compartment with a frequency fragment. Sets `frequenz1982_proberaum`, `proberaum_brutalist_smash`. Adds `Frequenzfragment`. Starts quest `frequenz_1982`. +10 bandMood, +3 chaos.

**Lars -- Expanded post-water dialogue:**

Currently Lars is simple after water is cleaned. Add:

- When `waterCleaned` and no `larsDrumPhilosophy`:

  - `[Performer]` "Zeig mir deinen besten Fill." --> Lars demonstrates, you learn about rhythm. Sets `lars_proberaum_secret`. +15 bandMood, +3 social. Lars mentions the bassist used to tune his drums before every show.

  - `[Technical 3]` "Deine Hi-Hat klingt verstimmt. Lass mich mal." --> Fix his drum setup. +10 bandMood, +3 technical. Lars shares that the TR-8080 was built from parts of the bassist's old amp.

  - Unlocks additional dialogue about `maschinen_seele` quest if `talkingAmpHeard` is true.

**Marius -- New mood-dependent branch:**

After `gotBeer`, when `bandMood > 50`:

- `[Diplomat]` "Marius, wie geht es dir wirklich?" --> Deep conversation about his insecurities. Sets `marius_tourbus_doubt` (foreshadowing his meltdown in TourBus). +15 bandMood, +3 social.

- `[Cynic]` "Dein Ego ist groß genug für zwei Dimensionen." --> Marius laughs, foreshadows the Ego quest. +5 bandMood, +2 chaos.

**Sprechender Amp -- Maschinen-Seele branch:**

After `talkingAmpHeard` but before repair, add:

- `[Mystic]` "Ich höre eine andere Stimme in dir. Wer ist da noch?" --> Amp reveals it contains a memory of the 1982 session. Sets `maschinen_seele_amp`. +10 bandMood, +2 chaos. Starts quest `maschinen_seele` if not started.

**TR-8080 -- Maschinen-Seele branch:**

After `drumMachineQuestStarted`:

- `[Technical 5]` "Deine Seriennummer... du bist nicht von der Stange." --> TR-8080 admits it was custom-built in 1982. Sets `maschinen_seele_tr8080`. +10 bandMood, +3 technical.

**New Interactable: "Risse in der Wand" (Cracks in the Wall)**

Position: `[10, 2, -7]`, emoji: `🔍`

- Default: "Risse in der Wand. Sie bilden ein Muster, das an Schallwellen erinnert."

- `[Visionary]`: "Die Risse... sie sind eine Partitur! Die Frequenz von 1982 wurde buchstäblich in die Wände gebrannt." --> If quest `frequenz_1982` not started, starts it and sets `frequenz1982_proberaum`. Adds `Frequenzfragment`. +15 bandMood.

- `[Technical 8]`: "Die Resonanzfrequenz dieser Risse liegt bei exakt 432.1982 Hz." --> Same outcome via different path.

- Requires: `waterCleaned` (the cracks are only visible after the water is cleaned).

**BandMood-reactive additions:**

- Matze's initial greeting text now has a `bandMood > 60` variant: more enthusiastic, mentions he's been writing new riffs.

- Lars at `bandMood < 20` becomes surly: "Lars: 'Ich pack meine Sticks ein. Dieser Gig wird ein Desaster.'" -- forces player to raise mood before productive conversation.

---

### Scene 2: TourBus (src/components/scenes/TourBus.tsx)

**Matze -- Sabotage Discovery:**

When talking to Matze about the broken cable (before repair):

- `[Technical 5]` "Das Kabel wurde nicht gebrochen, es wurde durchtrennt." --> Starts quest `tourbus_saboteur`. Sets `tourbus_sabotage_discovered`. Matze is shocked.

- If `tourbus_sabotage_discovered` and `marius_tourbus_doubt` (set in Proberaum):

  - `[Social 5]` "Matze, ich glaube Marius zweifelt an der Band." --> Matze confesses he cut the cable himself because he was afraid of the Salzgitter gig. Sets `tourbus_matze_confession`. Completes `tourbus_saboteur`. +10 bandMood (honesty), +3 social.

  - `[Brutalist]` "Wer auch immer das war, kriegt eine Abreibung." --> Matze stays silent but guilty. -5 bandMood.

**Marius -- Expanded Ego dialogue:**

Before Ego is returned:

- `[Performer]` "Marius, dein Charisma funktioniert auch ohne Ego." --> Marius gains partial confidence. Sets `marius_tourbus_doubt` to false. +15 bandMood, +3 social.

- If `bandMood < 30`:

  - Marius has a breakdown: "Marius: 'Ich bin ein Betrug. Ohne mein Ego bin ich nur ein Typ, der in ein Mikrofon schreit.'" -- Must be resolved via `[Social 7]` or `[Diplomat]` trait to proceed without permanent mood loss.

**Ghost Roadie -- Verlorener Bassist chain:**

When `bassist_clue_matze` is true:

- New option: "Matze hat mir vom Bassisten erzählt. Warst du dabei?" --> Ghost reveals he was the roadie who plugged in the bassist's amp that night. Sets `bassist_clue_ghost`. +15 bandMood, +3 social.

- `[Mystic]` "Ich spüre seine Präsenz in deinem Echo." --> Ghost becomes emotional, gives item `Bassist-Saite` (old bass string). +20 bandMood.

**New Interactable: "Verstecktes Fach" (Hidden Compartment)**

Position: `[-4, 0.5, -4]`, emoji: `📦`

- Only appears when `tourbus_sabotage_discovered` is true.

- Contains evidence: a note in Matze's handwriting. Resolves part of the saboteur quest.

- `[Technical 3]`: Can also find a `Frequenzfragment` if quest `frequenz_1982` is active but `frequenz1982_tourbus` is not set.

**BandMood-reactive additions:**

- At `bandMood > 70`: Ghost Roadie becomes more corporeal, offers bonus dialogue about 1982 without requiring `askedAbout1982`.

- At `bandMood < 20`: Matze refuses to talk about anything except the cable. All other dialogue locked behind raising mood first.

---

### Scene 3: Backstage (src/components/scenes/Backstage.tsx)

**Marius -- Consequence-aware calming:**

Expand the existing calming dialogue:

- If `tourbus_matze_confession` is true:

  - New option: "Matze hat etwas gestanden. Er braucht dich jetzt." --> Marius is shocked but rallies. Sets `mariusCalmed`, `mariusConfidenceBoost`. +25 bandMood. Powerful because it requires completing a multi-scene chain.

- `[Performer]` "Stell dir vor, die Bühne ist dein Wohnzimmer." --> Special calming method. Sets `backstage_performer_speech`. +20 bandMood, +5 social. This flag later unlocks bonus fan dialogue in Salzgitter.

- `[Cynic]` "Die meisten Fans sind sowieso betrunken. Die merken nichts." --> Dark humor calming. Sets `backstage_cynic_sabotage`. +5 bandMood, +2 chaos. Opens unique Cynic path in Kaminstube.

**Lars -- New pre-show dialogue:**

Currently Lars just needs energy drink. Expand:

- After being energized, add new branch:

  - `[Chaos 5]` "Lars, was passiert wenn du NOCH schneller trommelst?" --> Lars enters a trance state. Sets `larsVibrating` automatically. +20 bandMood, +3 chaos.

  - `[Diplomat]` "Lars, spare deine Energie für Salzgitter." --> Lars calms down, saves energy. Does NOT set `larsVibrating` but gives +15 bandMood and sets a flag `lars_paced` that gives better outcome in Salzgitter.

**Feedback Monitor -- Maschinen-Seele chain:**

If `maschinen_seele_amp` and `maschinen_seele_tr8080` are both true:

- New option appears: "Ich habe mit dem Amp und der TR-8080 gesprochen. Ihr seid verbunden." --> Monitor confirms they are fragments of one consciousness from 1982. Sets `maschinen_seele_monitor`. Discovers lore `maschinen_bewusstsein`. +25 bandMood, +5 technical.

- If all three machine flags set: Completes quest `maschinen_seele`. Sets `maschinen_seele_complete`. Major bandMood boost (+30).

**New Interactable: "Alte Blaupause" (Old Blueprint)**

Position: `[10, 0, 5]`, emoji: `📐`

- A stage layout from 1982.

- Default: "Eine vergilbte Blaupause. Jemand hat die Bühne für einen Gig in einer Gießerei geplant."

- `[Technical 7]`: "Die Verkabelung... sie bildet ein Pentagramm. Das war kein Zufall." --> Sets `frequenz1982_backstage`. +15 bandMood, +4 technical.

- `[Visionary]`: "Die Geometrie der Bühne... sie ist ein Resonanzverstärker." --> Same flag, different flavor text. +15 bandMood, +4 chaos.

**Ritual-Kreis -- Expanded:**

If `frequenz1982_proberaum` and `frequenz1982_tourbus` are set:

- New option: `[Mystic]` "Die Frequenzfragmente... der Kreis ist der Schlüssel." --> Ritual activates. Sets `frequenz1982_backstage`. +20 bandMood.

**BandMood-reactive additions:**

- At `bandMood > 80`: Marius is already partially calm, reduces skill requirements for calming by 2 levels.

- At `bandMood < 30`: Lars refuses the energy drink ("Lars: 'Wozu? Damit ich schneller in den Abgrund trommle?'"). Must raise mood via other means first.

---

### Scene 4: VoidStation (src/components/scenes/VoidStation.tsx)

**Kosmischer Tankwart -- Frequenz 1982 completion:**

If `frequenz1982_proberaum`, `frequenz1982_tourbus`, `frequenz1982_backstage` are all true:

- New dialogue branch: "Tankwart, die Fragmente der Frequenz von 1982... sie gehören zusammen." --> Tankwart assembles them. Sets `frequenz1982_complete`. Discovers lore `frequenz_1982_decoded`. Completes quest `frequenz_1982`. If player has `Frequenzfragment` and `Splitter der Leere`, combine into `Resonanz-Kristall`. +30 bandMood.

- `[Mystic]` bonus: Extra dialogue about the nature of the frequency, +5 chaos.

**Schwebender Bassist (Floating Bassist) -- Currently missing from VoidStation:**

Add a new Interactable for the Floating Bassist in VoidStation (he currently only appears in Salzgitter).

Position: `[10, 5, 5]`, emoji: `🎸`

- Only appears if `bassist_clue_matze` AND `bassist_clue_ghost` are both true.

- "Ein Schatten schwingt im Takt einer unhörbaren Basslinie. Es ist... der Bassist von 1982."

  - `[Social 8]` "Wir haben dich gesucht. Die Band braucht dich." --> Sets `bassist_contacted`. +20 bandMood, +5 social. Adds `Bassist-Resonanz` item.

  - `[Visionary]` "Ich sehe dich. Du bist der Grundton." --> Same outcome, different text. +20 bandMood, +5 chaos.

  - `[Technical 10]` "Deine Frequenz liegt bei 41.2 Hz. Ich kann dich zurückholen." --> Same outcome. +20 bandMood, +5 technical.

  - Default: "Kannst du mich hören?" --> Partial success. Sets `void_bassist_message` but not `bassist_contacted`. +10 bandMood.

**Marius' Ego -- Flag-aware expansion:**

If `marius_tourbus_doubt` is set when encountering the Ego:

- New option: "Marius zweifelt an sich. Sein Ego ist alles, was ihn zusammenhält." --> Changes the tone of the capture. +25 bandMood.

**New Interactable: "Diplomatische Schnittstelle" (Diplomatic Interface)**

Position: `[-10, 2, 5]`, emoji: `🕊️`

- `[Diplomat]` exclusive: "Die Leere... sie will verhandeln." --> Negotiate with the void itself. Sets `void_diplomat_negotiation`. The void grants safe passage and bonus bandMood for Kaminstube. +20 bandMood, +5 social.

- Non-Diplomat: "Ein merkwürdiges Gerät. Es zeigt das Wort 'VERHANDLUNG' an, aber du weißt nicht, was damit gemeint ist."

**BandMood-reactive additions:**

- At `bandMood > 80`: The Tankwart speaks more openly, lowering skill requirements by 2.

- At `bandMood < 30`: Portal to Kaminstube requires higher bandMood threshold (40 instead of just `voidRefueled`). Tankwart warns: "Eure Energie ist zu schwach. Die Kaminstube wird euch verschlingen."

---

### Scene 5: Kaminstube (src/components/scenes/Kaminstube.tsx)

This scene is currently the thinnest in terms of dialogue. Major expansion needed.

**Matze -- Consequence-aware dialogue:**

Replace the simple "Amp broken" text:

- If `tourbus_matze_confession`:

  - "Matze: 'Manager... danke, dass du mein Geheimnis für dich behalten hast. Ich werde heute Abend alles geben.'" +20 bandMood.

  - `[Diplomat]` "Die Band muss es irgendwann erfahren, Matze." --> Matze agrees to tell them after Salzgitter. +10 bandMood, +3 social.

- If `frequenz1982_complete`:

  - "Matze: 'Die Frequenz... ich höre sie im Amp! Er hat es gewusst!'" --> Extra amp repair flavor.

**Lars -- Expanded Kaminstube dialogue:**

Replace single-line:

- `[Chaos 5]` "Lars, die Schmiede-Rhythmen... kannst du sie spielen?" --> Lars performs a devastating rhythm that shakes the venue. +20 bandMood, +3 chaos. Sets `kaminstube_crowd_rallied`.

- `[Technical 5]` "Die Akustik hier ist perfekt für die Double-Bass." --> +15 bandMood, +3 technical.

- If `larsVibrating` from Backstage: "Lars: 'ICH SEHE IMMER NOCH DIE SOUNDWELLEN! IN DIESEM RAUM SIND SIE ROT!'" -- unique dialogue.

**Marius -- Pre-show jitters redux:**

- If `mariusConfidenceBoost`: confident, no additional action needed.

- If NOT `mariusConfidenceBoost` and `backstage_cynic_sabotage`: "Marius: 'Vielleicht hast du recht. Die Fans sind betrunken. Das macht es... einfacher?'" -- dark but functional.

- `[Performer]` "Marius, die Kaminstube ist intim. Nutze das." --> +15 bandMood, +3 social.

**Wirt -- Major expansion with "Geheimnis" quest:**

Add a multi-branch dialogue tree:

- If `bassist_clue_matze` AND `bassist_clue_ghost`:

  - "Ich weiß, dass du dabei warst, 1982." --> Wirt is shocked.

    - `[Social 8]` "Erzähl mir die Wahrheit." --> Wirt confesses he was the sound engineer. Sets `bassist_clue_wirt`. Discovers lore `wirt_vergangenheit`. Starts/advances quest `verlorener_bassist`. +15 bandMood.

    - `[Brutalist]` "Rede, oder ich mache den Laden dicht." --> Same info but -10 bandMood, sets `kaminstube_wirt_betrayal`.

    - `[Diplomat]` "Du trägst diese Last schon lange. Lass mich helfen." --> Best outcome. +25 bandMood, +5 social. Wirt also gives `Ersatz-Röhre` for free (if not already found).

- If `backstage_cynic_sabotage`:

  - `[Cynic]` "Dieser Laden hat Geheimnisse. Ich rieche es." --> Wirt reveals the venue has a hidden basement from 1982. New area not physically modeled but gives lore. +10 bandMood.

**New Interactable: "Die Crowd" -- Expanded:**

Replace the simple crowd interaction:

- If `backstage_performer_speech`:

  - `[Social 5]` "TANGERMÜNDE! SEID IHR BEREIT?!" --> Crowd goes wild. Sets `kaminstube_crowd_rallied`. +25 bandMood. Starts quest `crowd_warmup` and immediately completes it.

- `[Chaos 7]` "Werft eure Biere in die Luft!" --> Chaos ensues. +15 bandMood, +3 chaos.

- `[Diplomat]` "Liebe Fans, danke für eure Treue." --> Respectful approach. +10 bandMood, +3 social.

- At `bandMood > 70`, crowd is already energized and gives passive +5 on each interaction.

**Flüsternder Kamin -- Expanded:**

Currently only Diplomat can decode. Add:

- `[Mystic]` "Die Flammen sprechen zu mir." --> Alternative decode path. +20 bandMood, +3 chaos.

- `[Technical 7]` "Das Geräusch hat eine erkennbare Frequenz." --> Technical decode. +15 bandMood, +3 technical.

- If `frequenz1982_complete`: Auto-decoded regardless of trait/skill. "Die Frequenz von 1982 hat den Kamin geöffnet."

**BandMood-reactive:**

- At `bandMood > 80`: Crowd is already moshing when you arrive. All crowd interactions give double mood.

- At `bandMood < 30`: Wirt threatens to cancel the gig. Must raise mood above 30 before he allows you to proceed. Adds urgency.

---

### Scene 6: Salzgitter (src/components/scenes/Salzgitter.tsx)

**Matze -- Consequence cascade:*

Expand based on accumulated flags

- If `tourbus_matze_confession` AND `frequenz1982_complete`

  - "Matze: 'Manager, ich verstehe jetzt. Ich hatte Angst vor der Frequenz, nicht vor dem Gig. Jetzt höre ich sie klar.'" --> Sets `salzgitter_encore_unlocked` automatically. +30 bandMood

- If `maschinen_seele_complete`

  - "Matze: 'Der Amp... er singt. Nicht nur Feedback. Er SINGT. Die Maschinen sind eins.'" --> +20 bandMood. Unique ending flavor

**Lars -- Vibration payoff:*

- If `larsVibrating` AND `larsDrumPhilosophy`

  - `[Chaos 15]` "Lars, entfessle die Maschinen-Seele!" --> Ultimate Lars moment. +40 bandMood, +5 chaos. Sets `salzgitter_encore_unlocked`

- If `lars_paced` (from Backstage Diplomat path)

  - "Lars: 'Danke, dass du mich gebremst hast. Meine Schläge sind jetzt... chirurgisch.'" --> +25 bandMood. Different but equally valid outcome

**Marius -- The True Performance:*

- If `egoContained` AND `mariusConfidenceBoost` AND `bassist_contacted`

  - New option: `[Social 12]` "Marius, der Bassist ist bei uns. Sing für ihn." --> The ultimate Marius moment. He channels the bassist's frequency. +50 bandMood. Sets `salzgitter_true_ending`

- `[Performer]` If `backstage_performer_speech`: "Du hast die erste Reihe. Jetzt nimm sie alle." --> +30 bandMood, +5 social

**Schwebender Bassist -- Verlorener Bassist payoff:*

If `bassist_contacted`

- "Bassist: 'Du hast mich gefunden. Hier, in der Frequenz. Danke. Sag der Band... der Sound war es wert.'

- If player has `Resonanz-Kristall`: "Bassist: 'Der Kristall... er verbindet die Dimensionen. Setzt ihn ein, wenn ihr die letzte Note spielt.'" --> Sets `bassist_restored`. Discovers lore `bassist_wahrheit`. +30 bandMood

**Fan -- Expanded consequence-aware:*

- If `backstage_performer_speech`: "Fan: 'DU! Du warst der, der den Backstage-Speech gegeben hat! Ich hab es durch die Wand gehört!'" --> +15 bandMood

- If `kaminstube_crowd_rallied`: "Fan: 'Tangermünde spricht noch immer über euch! Ihr seid Legenden!'" --> +10 bandMood

- `[Diplomat]` "Hier, ein Andenken." (give any inventory item) --> +20 bandMood

**New Interactable: "Das Finale" (Replaces/Augments "Tour Erfolgreich")*

The current "Tour Erfolgreich" is a simple one-click completion. Replace with a multi-outcome finale

- Standard ending (no special flags): "Du hast die Tour gemanagt. NEUROTOXIC hat gespielt. Es war... okay." +30 bandMood

- Good ending (`bandMood > 70` AND `mariusConfidenceBoost`): "Ein solider Gig. Die Fans jubeln. NEUROTOXIC ist zufrieden." +50 bandMood

- Great ending (above + `frequenz1982_complete`): "Die Frequenz von 1982 hat die Halle erfüllt. Der Sound war... perfekt." +70 bandMood

- Secret Encore (`salzgitter_encore_unlocked`): "ZUGABE! Die Band spielt das Verbotene Riff! Die Realität bebt!" --> Extra scene text, +50 bandMood

- True Ending (`salzgitter_true_ending` AND `bassist_restored` AND `maschinen_seele_complete`): "Die Maschinen singen. Der Bassist schwingt im Grundton. Der Manager hat nicht nur eine Tour gemanagt — er hat eine Frequenz wiederhergestellt, die seit 1982 verklungen war. NEUROTOXIC ist unsterblich." Discovers all remaining undiscovered lore. +100 bandMood

**BandMood-reactive:*

- At `bandMood > 90`: Visual effects intensify (already somewhat handled by lighting code). All NPC dialogue becomes ecstatic

- At `bandMood < 40`: Matze considers walking off stage. Must pass `[Social 8]` or `[Diplomat]` check to keep him

--

## Part 3: Cross-Scene Quest Chain Summarie

### Chain 1: "Die Frequenz von 1982

**Path**: Proberaum (discover) -> TourBus (find tape/evidence) -> Backstage (decode blueprint) -> VoidStation (assemble

**Trait affinities**: Mystic (ritual path), Visionary (pattern recognition), Technical (frequency analysis), Brutalist (brute force discovery

**Reward**: `Resonanz-Kristall` item, `frequenz_1982_decoded` lore, significant bandMood, unlocks best Salzgitter endin

### Chain 2: "Der Verlorene Bassist

**Path**: Proberaum/TourBus (gather clues from Matze, Ghost) -> Kaminstube (confront Wirt) -> VoidStation (contact bassist) -> Salzgitter (restore

**Trait affinities**: Social/Diplomat (interrogation), Visionary (seeing the unseen), Mystic (spiritual contact

**Reward**: `bassist_wahrheit` lore, `bassist_restored` flag for true ending, enormous bandMoo

### Chain 3: "Maschinen-Seele

**Path**: Proberaum (Amp + TR-8080 fragments) -> Backstage (Monitor connection) -> VoidStation/Backstage (unite consciousness

**Trait affinities**: Technical (understanding circuitry), Mystic (hearing machine voices

**Reward**: `maschinen_bewusstsein` lore, `maschinen_seele_complete` for true endin

--

## Part 4: Skill Progression Desig

The game should reward skill investment with escalating gates

| Scene | Early Skills (Level 3) | Mid Skills (Level 5-7) | Late Skills (Level 8-10) | Endgame (Level 12-15) 

|---|---|---|---|---

| Proberaum | Social 3 (calm Matze), Technical 3 (Lars drums) | Social 5 (calm Marius), Technical 5 (TR-8080 origin) | -- | -- 

| TourBus | Technical 3 (hidden compartment) | Social 5 (Ghost secret), Technical 5 (sabotage) | Technical 7 (Ghost analysis) | -- 

| Backstage | -- | Social 5 (calm Marius), Technical 5 (Monitor), Chaos 5 (Lars trance) | Technical 7 (blueprint) | -- 

| VoidStation | -- | Technical 5 (magnetband) | Social 8 (bassist), Technical 8 (Ego), Technical 10 (bassist freq) | -- 

| Kaminstube | -- | Social 5 (crowd), Technical 5 (Lars acoustics), Chaos 5 (Lars rhythm) | Social 8 (Wirt truth), Chaos 7 (crowd chaos), Technical 7 (Kamin) | -- 

| Salzgitter | -- | -- | Chaos 10 (Matze/Marius), Technical 10 (Lars/Matze), Social 10 (Marius) | Social 12 (true ending), Chaos 15 (Lars ultimate) 

--

## Part 5: Implementation Sequence
**Phase 1 -- Store Foundation** (src/store.ts)
1. Add all new flags to `initialState.flags`
2. Add new lore entries to `initialState.loreEntries`
3. Add the `Frequenzfragment + Splitter der Leere` combination to `combineItems`
4. Ensure the persistence merge handles new flags/lore gracefully (it already does via spread)
**Phase 2 -- Proberaum Expansion** (src/components/scenes/Proberaum.tsx)
1. Expand Matze's 1982 dialogue with Mystic/Brutalist branches
2. Expand Lars post-water dialogue with Performer/Technical branches
3. Expand Marius post-beer with Diplomat/Cynic branches
4. Add Maschinen-Seele sub-branches to Amp and TR-8080
5. Add "Risse in der Wand" interactable
**Phase 3 -- TourBus Expansion** (src/components/scenes/TourBus.tsx)
1. Add sabotage discovery branch to Matze
2. Add Marius mood-dependent breakdown
3. Add Ghost Roadie bassist chain dialogue
4. Add "Verstecktes Fach" interactable
**Phase 4 -- Backstage Expansion** (src/components/scenes/Backstage.tsx)
1. Add consequence-aware Marius calming options
2. Expand Lars post-energized dialogue
3. Add Maschinen-Seele completion to Feedback Monitor
4. Add "Alte Blaupause" interactable
5. Expand Ritual-Kreis with frequency chain
**Phase 5 -- VoidStation Expansion** (src/components/scenes/VoidStation.tsx)
1. Add frequency assembly dialogue to Tankwart
2. Add Floating Bassist interactable (only when clues gathered)
3. Expand Ego capture with flag awareness
4. Add Diplomat Interface interactable
**Phase 6 -- Kaminstube Expansion** (src/components/scenes/Kaminstube.tsx)
1. Major Matze dialogue rewrite with consequence awareness
2. Lars expanded dialogue tree
3. Marius pre-show dialogue tree
4. Wirt "Geheimnis" multi-branch quest
5. Crowd interaction expansion
6. Kamin decoding alternatives
**Phase 7 -- Salzgitter Finale** (src/components/scenes/Salzgitter.tsx)
1. Multi-outcome finale system replacing simple "Tour Erfolgreich"
2. Consequence-cascade dialogues for all three band members
3. Bassist restoration payoff
4. Fan consequence-aware dialogue
5. Secret Encore and True Ending paths
**Phase 8 -- Documentation** (dialog_uebersicht.md)
Update the dialogue overview with all new trees, quests, and branches.
---
## Part 6: Potential Challenges
1. **Closure staleness**: All new dialogue callbacks must use `useStore.getState()` for flag reads inside closures, not the destructured `flags` from component level, to avoid stale state. The existing code already uses both patterns inconsistently; new code should consistently use `getState()` inside `action` callbacks.
2. **Conditional Interactable rendering**: When adding interactables that only appear based on flags (e.g., Floating Bassist in VoidStation), wrap them in `{flags.bassist_clue_matze && flags.bassist_clue_ghost && (<Interactable .../>)}`. This follows the existing pattern for conditional items.
3. **Quest deduplication**: `addQuest` already deduplicates by ID, so calling it from multiple scenes is safe.
4. **BandMood cap**: `increaseBandMood` already caps at 100. The True Ending's +100 won't break anything.
5. **Skill inflation**: With all the new skill rewards, players could reach very high levels. The endgame gates (Chaos 15, Social 12) are calibrated to require focused investment, not just doing everything.
6. **Save compatibility**: New flags default to `false` and new lore defaults to `discovered: false`. The existing persistence merge logic spreads new defaults under persisted state, so old saves will work seamlessly -- new flags will simply be `false` (their correct initial value) and new lore entries will appear as undiscovered.
---
### Critical Files for Implementation
- src/store.ts
- src/components/scenes/Proberaum.tsx
- src/components/scenes/TourBus.tsx
- src/components/scenes/Backstage.tsx
- src/components/scenes/VoidStation.tsx
- src/components/scenes/Kaminstube.tsx
- src/components/scenes/Salzgitter.tsx
- dialog_uebersicht.md
---
### Implementation Order
- store.ts — flags, lore, item combination
- Proberaum.tsx — Matze/Lars/Marius/Amp/TR-8080 expansion + new interactable
- TourBus.tsx — Sabotage/Marius/Ghost expansion + new interactable
- Backstage.tsx — Marius/Lars/Monitor expansion + new interactable + ritual
- VoidStation.tsx — Tankwart/Bassist/Ego/Diplomat expansion
- Kaminstube.tsx — Major expansion: all NPCs + Wirt quest + Crowd + Kamin
- Salzgitter.tsx — Multi-outcome finale + consequence cascades
- dialog_uebersicht.md — Document everything
---
### Verification
- npm run lint after each file
- Verify useStore.getState() used inside all action callbacks
- Verify conditional interactables use flag checks
- Test quest dependency chains reference valid IDs
- Check new lore entries appear in Lore Codex
