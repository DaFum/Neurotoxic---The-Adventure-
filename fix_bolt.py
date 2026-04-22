with open('.jules/bolt.md', 'r') as f:
    text = f.read()

# We need to change the 2026-04-14 section.
old_section = """## 2026-04-14 - Zustand Array Mutation Optimization

**Learning:** Modifying arrays inside Zustand stores (e.g., quests arrays) can be optimized by replacing `.find()`/`.some()` + `.map()` combinations with a single `.findIndex()` lookup and targeted index modification, saving repeated O(n) array scans. Updating single items in Zustand store arrays using `.find()` followed by `.map()` is an anti-pattern. It forces two O(N) array scans and allocates a completely new array, generating unnecessary garbage collection pressure and reducing performance during state mutations.
**Action:** Replace `.find()` + `.map()` combinations with a single `.findIndex()` lookup, followed by a shallow array clone (`[...array]`) and direct index mutation (`newArray[index] = ...`). Prefer `.findIndex()` lookup and targeted index modification when updating a single unique item in a state array.
"""

new_section = """## 2026-04-14 - Zustand Array Mutation Optimization

**Learning:** Updating single items in Zustand store arrays using `.find()` followed by `.map()` is an anti-pattern. It forces two O(N) array scans and allocates a completely new array, generating unnecessary garbage collection pressure and reducing performance during state mutations.
**Action:** Prefer `.findIndex()` lookup, followed by a shallow array clone (`[...array]`) and direct index mutation (`newArray[index] = ...`) when updating a single unique item in a state array.
"""

text = text.replace(old_section, new_section)
with open('.jules/bolt.md', 'w') as f:
    f.write(text)
