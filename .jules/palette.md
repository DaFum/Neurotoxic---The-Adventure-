# 2024-05-24 - Improve Item Merge Discoverability

**Learning:** Hiding core actions until all conditions are met makes them invisible to users. For example, a hidden "Combine Items" button gives no hint that combining items is even a feature.
**Action:** When a core UI action depends on state (like having exactly two items selected), render the button unconditionally but in a disabled state, and use tooltips to explain the requirements.

## 2026-04-11 - [Accessibility: Modal Dialog Attributes]
**Learning:** Components that function as modal dialogs (interrupting the main flow and requiring interaction before returning to the underlying page) should use `role="dialog"` together with `aria-modal="true"` to communicate that the dialog is intended to be modal. However, `aria-modal="true"` does not by itself trap focus or make content outside the dialog inert for assistive technologies.
**Action:** When auditing or creating custom modal dialog components, verify the presence of both `role="dialog"` and `aria-modal="true"`, and also verify the behaviors that make the dialog truly modal: trap focus within the dialog, restore focus when it closes, and make the rest of the UI non-navigable to assistive technologies while the dialog is open (for example with `inert` or `aria-hidden` on background content).

## 2024-04-13 - Linking requirements for disabled list-rendered dialogue options

**Learning:** When using `aria-disabled` on list-rendered list items (e.g. dialogue option buttons in this app) instead of the native `disabled` attribute so the items remain focusable, screen readers won't announce why an action is blocked. Putting requirement or error text as a sibling element inside the same button structure doesn't automatically mean the screen reader will associate that specific contextual text with the button state.

**Action:** Always link contextual requirement or error text specifically to the `aria-disabled` button using a dynamically generated unique `id` on the text container and referencing it via `aria-describedby` on the button itself. This is especially critical for dynamically generated lists of options.

## 2026-04-14 - Focus Ring on Interactive Scroll Containers

**Learning:** Scrollable containers (like `overflow-y-auto`) that have a `tabIndex={0}` to make them keyboard accessible (so users can scroll using keyboard arrows) must also have a clear visual focus indicator when they receive focus, otherwise keyboard users might not realize the region is focused.
**Action:** Add `focus-visible:ring-2` (and associated focus styling classes) to scrollable containers with `tabIndex={0}` to provide clear visual feedback.

## 2026-04-14 - Empty State Discoverability

**Learning:** Using simple, plain text to indicate an empty state (e.g., "No assets detected") can be easily missed by users scanning the UI, and doesn't clearly guide them on what to do next.
**Action:** Use visually distinct empty states with a faded icon, a clear title, and a helpful call-to-action (e.g., "Explore the area to find items.") to make empty states more recognizable and actionable.
