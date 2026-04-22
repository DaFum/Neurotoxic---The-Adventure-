with open('src/dialogues/kaminstube/wirtPrelude.ts', 'r') as f:
    text = f.read()

# Fix bassist_clue_wirt
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
              currentStore.setDialogue('Wirt: "Du hast ein weiches Herz für einen Manager. Tangermünde ist jetzt sicher. Du hast keinen Platz für meinen Koffeindrink, aber merke dir: Gehe zum Proberaum."');
            }"""
text = text.replace(old_koffein, new_koffein)


# Fix wirtSecretItem
old_plektrum = r"""            const currentStore = game();
            if (currentStore.addToInventory('Altes Plektrum')) {
              currentStore.setDialogue(
                'Wirt: "Ein Altes Plektrum. Es ist aus dem Knochen einer verstummten Sirene geschnitzt. Es wird Matze helfen, das Verbotene Riff zu bändigen. Er wird es brauchen."',
              );
              currentStore.setFlag('wirtSecretItem', true);
              currentStore.increaseBandMood(20, 'id_7619882f');
            } else {
              currentStore.setDialogue('Wirt: "Dein Inventar ist voll. Komm wieder, wenn du Platz hast."');
            }"""

new_plektrum = r"""            const currentStore = game();
            currentStore.setFlag('wirtSecretItem', true);
            if (currentStore.addToInventory('Altes Plektrum')) {
              currentStore.setDialogue(
                'Wirt: "Ein Altes Plektrum. Es ist aus dem Knochen einer verstummten Sirene geschnitzt. Es wird Matze helfen, das Verbotene Riff zu bändigen. Er wird es brauchen."',
              );
              currentStore.increaseBandMood(20, 'id_7619882f');
            } else {
              currentStore.setDialogue('Wirt: "Das Plektrum gehört dir. Komm wieder, wenn du Platz hast."');
            }"""
text = text.replace(old_plektrum, new_plektrum)

with open('src/dialogues/kaminstube/wirtPrelude.ts', 'w') as f:
    f.write(text)
