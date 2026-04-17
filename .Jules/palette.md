## 2024-04-17 - Icon-Only Button Hover Discoverability
**Learning:** Screen reader accessibility (`aria-label`) on icon-only buttons does not automatically provide visual discoverability for sighted mouse users. A native `title` attribute must be explicitly paired with the `aria-label` to trigger the standard browser tooltip on hover.
**Action:** When adding `aria-label` to an icon-only button for accessibility, concurrently add a matching `title` attribute to ensure equal discoverability for mouse interactions.
