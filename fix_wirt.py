with open('src/dialogues/kaminstube/wirtPrelude.ts', 'r') as f:
    text = f.read()

# Fix the wirtPrelude dialogues fallback
text = text.replace(
"""              currentStore.setDialogue(
                'Wirt: "Du hast ein weiches Herz für einen Manager. Tangermünde ist jetzt sicher. Merke dir: Gehe zum Proberaum."',
              );""",
"""              currentStore.setDialogue(
                'Wirt: "Du hast ein weiches Herz für einen Manager. Tangermünde ist jetzt sicher. Du hast keinen Platz für meinen Koffeindrink, aber merke dir: Gehe zum Proberaum."',
              );"""
)

text = text.replace(
"""            } else {
              currentStore.setDialogue(
                'Wirt: "Das war der Grund, warum wir die Gießerei schließen mussten. Pass auf dich auf."',
              );
            }""",
"""            } else {
              currentStore.setDialogue('Wirt: "Dein Inventar ist voll. Komm wieder, wenn du Platz hast."');
            }"""
)

with open('src/dialogues/kaminstube/wirtPrelude.ts', 'w') as f:
    f.write(text)
