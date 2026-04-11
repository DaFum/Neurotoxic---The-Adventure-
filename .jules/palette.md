# 2024-05-24 - Improve Item Merge Discoverability

**Learning:** Hiding core actions until all conditions are met makes them invisible to users. For example, a hidden "Combine Items" button gives no hint that combining items is even a feature.
**Action:** When a core UI action depends on state (like having exactly two items selected), render the button unconditionally but in a disabled state, and use tooltips to explain the requirements.

## 2026-04-11 - [Accessibility: Modal Dialog Attributes]
**Learning:** Components that function as modal dialogs (interrupting the main flow and requiring interaction before returning to the underlying page) should use `role="dialog"` together with `aria-modal="true"` to communicate that the dialog is intended to be modal. However, `aria-modal="true"` does not by itself trap focus or make content outside the dialog inert for assistive technologies.
**Action:** When auditing or creating custom modal dialog components, verify the presence of both `role="dialog"` and `aria-modal="true"`, and also verify the behaviors that make the dialog truly modal: trap focus within the dialog, restore focus when it closes, and make the rest of the UI non-navigable to assistive technologies while the dialog is open (for example with `inert` or `aria-hidden` on background content).
