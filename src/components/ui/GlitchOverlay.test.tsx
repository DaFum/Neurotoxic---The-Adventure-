/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import * as React from 'react';
import { render } from '@testing-library/react';
import { GlitchOverlay } from './GlitchOverlay';

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, className, style, dataTestId }: any) => (
      <div className={className} style={style} data-testid={dataTestId}>
        {children}
      </div>
    ),
  },
}));

vi.mock('../../utils/math', () => ({
  secureRandom: vi.fn().mockReturnValue(0.5),
}));

describe('GlitchOverlay', () => {
  it('returns null when glitchIntensity is 0', () => {
    const { container } = render(<GlitchOverlay glitchIntensity={0} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders base overlay when glitchIntensity is greater than 0', () => {
    const { container } = render(<GlitchOverlay glitchIntensity={0.1} />);
    expect(container.firstChild).not.toBeNull();
    // The base motion.div should be present
    const primaryOverlay = container.querySelector('.bg-red-500\\/5');
    expect(primaryOverlay).not.toBeNull();
  });

  it('calculates the correct filter style based on intensity', () => {
    const intensity = 0.5;
    const { container } = render(<GlitchOverlay glitchIntensity={intensity} />);
    const primaryOverlay = container.querySelector('.bg-red-500\\/5') as HTMLElement;

    const expectedContrast = 100 + intensity * 50;
    const expectedBrightness = 100 + intensity * 20;

    expect(primaryOverlay.style.filter).toContain(`contrast(${expectedContrast}%)`);
    expect(primaryOverlay.style.filter).toContain(`brightness(${expectedBrightness}%)`);
  });

  it('does not render secondary overlay when glitchIntensity <= 0.4', () => {
    const { container } = render(<GlitchOverlay glitchIntensity={0.4} />);
    const secondaryOverlay = container.querySelector('.bg-cyan-500\\/5');
    expect(secondaryOverlay).toBeNull();
  });

  it('renders secondary overlay when glitchIntensity > 0.4', () => {
    const { container } = render(<GlitchOverlay glitchIntensity={0.5} />);
    const secondaryOverlay = container.querySelector('.bg-cyan-500\\/5');
    expect(secondaryOverlay).not.toBeNull();
  });
});
