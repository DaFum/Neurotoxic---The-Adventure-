import re

with open('src/dialogues/kaminstube/wirtPrelude.ts', 'r') as f:
    text = f.read()

# Update the koffein logic
old_koffein = r"""            const currentStore = game();
            if (currentStore.addToInventory('Turbo-Koffein')) {
              currentStore.setDialogue(
                'Wirt: "Du hast ein weiches Herz für einen Manager. Ich wollte nur, dass Tangermünde sicher bleibt. Hier, zur Wiedergutmachung..."',
              );
              currentStore.setFlag('bassist_clue_wirt', true);
              currentStore.discoverLore('wirt_vergangenheit');
              currentStore.increaseBandMood(30, 'id_f3d9b24e');
            } else {
              currentStore.setDialogue('Wirt: "Dein Inventar ist voll. Komm wieder, wenn du Platz hast."');
            }"""

new_koffein = r"""            const currentStore = game();
            currentStore.setFlag('bassist_clue_wirt', true);
            currentStore.discoverLore('wirt_vergangenheit');

            if (currentStore.addToInventory('Turbo-Koffein')) {
              currentStore.setDialogue(
                'Wirt: "Du hast ein weiches Herz für einen Manager. Ich wollte nur, dass Tangermünde sicher bleibt. Hier, zur Wiedergutmachung..."',
              );
              currentStore.increaseBandMood(30, 'id_f3d9b24e');
            } else {
              currentStore.setDialogue(
                'Wirt: "Du hast ein weiches Herz für einen Manager. Tangermünde ist jetzt sicher. Du hast keinen Platz für meinen Koffeindrink, aber merke dir: Gehe zum Proberaum."'
              );
            }"""

text = text.replace(old_koffein, new_koffein)

# Also fix the Altes Plektrum logic similarly if needed, but the prompt only explicitly asked about the Turbo-Koffein / clue lore logic:
# "Around line 48-57: The code currently ties essential progression (setting flag 'bassist_clue_wirt' and discovering lore 'wirt_vergangenheit')..."
# The prompt implies we only strictly need to move the essential progression flags. I will apply it just to the koffein part as requested.

with open('src/dialogues/kaminstube/wirtPrelude.ts', 'w') as f:
    f.write(text)
