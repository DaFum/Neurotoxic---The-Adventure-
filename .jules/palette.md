# 2024-05-24 - Improve Item Merge Discoverability

**Learning:** Hiding core actions until all conditions are met makes them invisible to users. For example, a hidden "Combine Items" button gives no hint that combining items is even a feature.
**Action:** When a core UI action depends on state (like having exactly two items selected), render the button unconditionally but in a disabled state, and use tooltips to explain the requirements.

## 2026-04-11 - [Accessibility: Modal Dialog Attributes]
**Learning:** Components that function as modal dialogs (interrupting the main flow and requiring interaction before returning to the underlying page) should use the `aria-modal="true"` attribute alongside `role="dialog"`. This communicates to assistive technologies that content outside the dialog is currently inert and should not be navigated or interacted with, preventing confusion for screen reader users.
**Action:** When auditing or creating custom modal dialog components, verify the presence of both `role="dialog"` and `aria-modal="true"`. Ensure that focus management (trapping focus within the modal) is also implemented to fully support keyboard users.
