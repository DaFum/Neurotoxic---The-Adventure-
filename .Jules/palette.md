## 2024-05-18 - [Accessibility: Focus Management for Locked Dialogue Options]

**Learning:** Native `disabled` attributes on interactive elements completely remove them from the tab sequence. This means keyboard and screen reader users completely miss the context of _why_ an option might be locked (e.g., missing a required item or skill).
**Action:** Use `aria-disabled="true"` instead of the native `disabled` attribute for interactive elements that users need to know exist, but cannot currently interact with. Always ensure you add a manual check in the click handler (e.g., `if (isDisabled) return;`) to prevent the action from firing. Additionally, ensure the element has a visible focus indicator using `focus-visible` utility classes so keyboard users can tell when the element is focused.

## 2024-05-17 - Keyboard Accessibility Focus States in MainMenu

**Learning:** Found that custom `motion.button` and standard `<button>` elements in `MainMenu.tsx` had custom Tailwind hover/active states but were entirely missing keyboard focus indicators (`focus-visible`). This is a common pattern in highly stylized UIs where default outlines are suppressed (`focus:outline-none`) but not properly replaced with accessible alternatives.
**Action:** When auditing stylized buttons across the app, always verify the presence of `focus-visible` classes (like `focus-visible:ring-2 focus-visible:ring-offset-2`). Use Tailwind's offset rings to ensure the focus state is clearly visible against both dark and light backgrounds.

## 2024-05-18 - [Accessibility: Native Browser Prompts vs Inline Confirmations]

**Learning:** Native browser prompts like `window.confirm()` completely block the UI thread, provide zero visual customization, and are generally jarring for screen reader users as they abruptly trap focus in a system-level dialog without proper context.
**Action:** Replace all `window.confirm()` or `window.alert()` calls with inline UI confirmation dialogs. This ensures focus states can be managed correctly, the styling matches the design system, and screen readers can properly announce the dialog using `role="dialog"` and `aria-modal`.
