## 2025-02-18 - Typewriter text effects accessibility

**Learning:** Character-by-character typewriter text effects are very difficult for screen readers to interpret correctly when wrapped in an `aria-live` region. They either read individual characters or remain silent until the typing completes.
**Action:** Use an `aria-hidden=\"true\"` attribute on the visual typewriter element, and include a `.sr-only` container with `aria-live=\"polite\"` that holds the full text immediately, so screen readers can gracefully announce the full dialogue text.
