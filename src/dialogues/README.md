# Dialogues

Dieses Verzeichnis enthält isolierte Builder-Funktionen für die Dialoge der NPCs (und wichtiger Objekte) aus den 3D-Szenen.
Das Ziel ist es, die 3D-Szenen (`src/components/scenes/`) sauber von Text-, Story-Branching- und Quest-Logik zu trennen.

## Wichtig: dialog_uebersicht.md synchron halten

Beim Hinzufügen oder Ändern eines Builders, der Dialogtext, Quest-Trigger, Item-Interaktionen oder BandMood-Deltas berührt, muss `dialog_uebersicht.md` im Projekt-Root aktualisiert werden. Folgende Änderungen erfordern eine Aktualisierung:

- Dialogbäume (neuer Text, neue Optionen, neue Branches)
- Quest-Trigger (`addQuest`, `startQuestWithFlag`, `completeQuest`, `completeQuestWithFlag`)
- Item-Vergabe oder -Verbrauch (`addToInventory`, `removeFromInventory`)
- BandMood-Deltas (`increaseBandMood`)
- Änderungen an `src/store.ts` (neue Flags, neue Quests in `initialState`)

## Konventionen & Struktur

- **Ordner-Struktur:** Dialoge werden nach Szene gruppiert (z. B. `src/dialogues/proberaum/`).
- **Dateinamen:** Eine Datei pro NPC oder Objektgruppe (z. B. `matze.ts`, `lars.ts`).
- **Funktionsnamen:** Die Factory-Funktionen sollten aussagekräftig und generisch benannt sein: `build[Scene][Npc]Dialogue`.
  - Beispiel: `buildProberaumMatzeDialogue()`
- **Zustand lesen:** Die Builder sind reine Funktionen, sie dürfen nicht auf Variablen aus React-Hooks (wie `useStore(state => state.flags)`) im Render-Cycle zugreifen. Stattdessen müssen sie den **aktuellen** Zustand über `game()` (oder `useStore.getState()`) frisch abrufen, um _Stale Closures_ zu vermeiden.

## Shared Helpers (`src/dialogues/shared/helpers.ts`)

Wir nutzen minimale Helfer-Funktionen, um den Code lesbar zu halten, **ohne** ein riesiges Framework (DSL) zu bauen.

- `game()`: Holt den aktuellen Zustand aus dem Zustand-Store (`useStore.getState()`). Sollte bevorzugt verwendet werden.
- `when(condition, value)`: Gibt ein Array mit dem Wert zurück, wenn die Bedingung wahr ist. Nutze den Spread-Operator, um Optionen bedingt anzuzeigen:

  ```ts
  options: [
    { text: 'Immer sichtbar' },
    ...when(!flags.someEvent, { text: 'Bedingte Option', action: () => ... })
  ]
  ```

- `say(text)`: Ein Shortcut, um simple Text-Dialoge ohne Optionen zu bauen: `return say("Hallo Manager!");`.

## Testing

Dialog-Builder können sehr einfach direkt getestet werden (z. B. in `matze.test.ts`).

- Setze den Store-Status (`useStore.setState({ flags: { ... }, inventory: [...] })`).
- Rufe den Builder auf.
- Validiere den Output (`expect(dialogue.text).toContain(...)` oder `expect(dialogue.options).toHaveLength(...)`).
- Du musst nicht jeden Button-Klick (jede `action`) im Detail testen. Konzentriere dich auf die Verzweigungen (Visibility von Text/Optionen).
