## 2025-02-18 - Typewriter text effects accessibility

**Learning:** Character-by-character typewriter text effects are very difficult for screen readers to interpret correctly when wrapped in an `aria-live` region. They either read individual characters or remain silent until the typing completes.
**Action:** Use an `aria-hidden=\"true\"` attribute on the visual typewriter element, and include a `.sr-only` container with `aria-live=\"polite\"` that holds the full text immediately, so screen readers can gracefully announce the full dialogue text.

## 2026-05-13 - Focus Trapping in Conditionally Rendered React Modals

**Learning:** When using conditional React rendering for modals (e.g., with `AnimatePresence`), background elements remain accessible to screen readers and keyboard focus. Using the HTML `inert` attribute on the background container combined with React's `autoFocus` on the primary modal action creates a perfect, zero-dependency focus trap that satisfies both keyboard users and screen readers.
**Action:** Use `inert` on background content and `autoFocus` on primary modal actions to ensure modals are truly accessible without needing heavy third-party focus-trapping libraries.

## 2026-11-20 - Item Selection Max Limit Visual State

**Learning:** When users reach the maximum allowed selection count (e.g. 2 items for combining), relying solely on an error message or generic helper text can be frustrating. Disabled unselected items (with `aria-disabled` and clear visual styling like `opacity-50`) immediately communicates that no more selections can be made, preventing the user from even trying an invalid interaction.
**Action:** Always visually and functionally disable unselected interaction options when a max selection limit has been reached, instead of just displaying an error afterward.

## 2026-06-01 - ARIA Label Redundancy

**Learning:** Adding `aria-label` to buttons that already have clear, visible text (even stylized text like `REBOOT_GAME`) completely overrides the visible text for screen readers and violates WCAG 2.5.3 (Label in Name).
**Action:** Reserve `aria-label` primarily for icon-only buttons or elements where the visible text lacks sufficient context.

## 2025-02-19 - Accessible Tab Semantics for Custom UI Tabs

**Learning:** When building custom tabbed interfaces (like the compact HUD), using standard `<button>` elements without ARIA tab roles leaves screen reader users without context about the relationship between the buttons and the content panels. They just seem like standalone toggle buttons.
**Action:** Always wrap custom tabs in a `role="tablist"`, assign `role="tab"` with `aria-selected` to the buttons, and link them to `role="tabpanel"` containers using `aria-controls` and `aria-labelledby` to create a semantically linked, accessible tab structure. Furthermore, implement WAI-ARIA tab pattern keyboard interactions: tab buttons must use `tabIndex=0` for the active tab and `tabIndex=-1` for inactive tabs. Implement Left/Right (or Up/Down) arrow key handling on the container to move focus and change selection, support Home/End keys, and ensure the keydown handlers correctly update focus, `aria-selected`, `tabIndex`, and call `aria-controls`/`aria-labelledby` to switch associated content.

## 2024-05-19 - Removed redundant aria-labels from text buttons
**Learning:** WCAG 2.5.3 (Label in Name) dictates that visible text should be included in the accessible name. Adding `aria-label` to buttons that already have clear, visible text overrides that visible text for screen readers, confusing users who use voice commands or have partial vision.
**Action:** Always prefer the visible text for the accessible name of a button. Only use `aria-label` for icon-only buttons or when the visible text requires significant additional context that cannot be provided by other means like `aria-describedby`.
