import re

with open('dialog_uebersicht.md', 'r') as f:
    text = f.read()

# Replace the text in dialog_uebersicht.md
# We need to find the Kaminstube Wirt Geheimnis section
