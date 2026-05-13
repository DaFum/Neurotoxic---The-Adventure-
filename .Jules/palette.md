## 2025-02-18 - Typewriter text effects accessibility

**Learning:** Character-by-character typewriter text effects are very difficult for screen readers to interpret correctly when wrapped in an `aria-live` region. They either read individual characters or remain silent until the typing completes.
**Action:** Use an `aria-hidden=\"true\"` attribute on the visual typewriter element, and include a `.sr-only` container with `aria-live=\"polite\"` that holds the full text immediately, so screen readers can gracefully announce the full dialogue text.

## 2026-05-13 - Focus Trapping in Conditionally Rendered React Modals
**Learning:** When using conditional React rendering for modals (e.g., with `AnimatePresence`), background elements remain accessible to screen readers and keyboard focus. Using the HTML `inert` attribute on the background container combined with React's `autoFocus` on the primary modal action creates a perfect, zero-dependency focus trap that satisfies both keyboard users and screen readers.
**Action:** Use `inert` on background content and `autoFocus` on primary modal actions to ensure modals are truly accessible without needing heavy third-party focus-trapping libraries.
