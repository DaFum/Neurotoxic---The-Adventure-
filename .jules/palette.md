## 2024-05-24 - Improve Item Merge Discoverability
**Learning:** Hiding core actions until all conditions are met makes them invisible to users. For example, a hidden "Combine Items" button gives no hint that combining items is even a feature.
**Action:** When a core UI action depends on state (like having exactly two items selected), render the button unconditionally but in a disabled state, and use tooltips to explain the requirements.
