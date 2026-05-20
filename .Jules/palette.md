## 2025-02-18 - Typewriter text effects accessibility

**Learning:** Character-by-character typewriter text effects are very difficult for screen readers to interpret correctly when wrapped in an `aria-live` region. They either read individual characters or remain silent until the typing completes.
**Action:** Use an `aria-hidden=\"true\"` attribute on the visual typewriter element, and include a `.sr-only` container with `aria-live=\"polite\"` that holds the full text immediately, so screen readers can gracefully announce the full dialogue text.

## 2026-05-13 - Focus Trapping in Conditionally Rendered React Modals

**Learning:** When using conditional React rendering for modals (e.g., with `AnimatePresence`), background elements remain accessible to screen readers and keyboard focus. Using the HTML `inert` attribute on the background container combined with React's `autoFocus` on the primary modal action creates a perfect, zero-dependency focus trap that satisfies both keyboard users and screen readers.
**Action:** Use `inert` on background content and `autoFocus` on primary modal actions to ensure modals are truly accessible without needing heavy third-party focus-trapping libraries.

## 2026-11-20 - Item Selection Max Limit Visual State

**Learning:** When users reach the maximum allowed selection count (e.g. 2 items for combining), relying solely on an error message or generic helper text can be frustrating. Disabled unselected items (with `aria-disabled` and clear visual styling like `opacity-50`) immediately communicates that no more selections can be made, preventing the user from even trying an invalid interaction.
**Action:** Always visually and functionally disable unselected interaction options when a max selection limit has been reached, instead of just displaying an error afterward.
