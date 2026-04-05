import { motion } from 'motion/react';

interface GlitchOverlayProps {
  glitchIntensity: number;
}

export function GlitchOverlay({ glitchIntensity }: GlitchOverlayProps) {
  if (glitchIntensity <= 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden select-none">
      <motion.div
        animate={{
          opacity: [0.05, 0.15, 0.05],
          x: [-2, 2, -2],
          y: [-1, 1, -1],
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0 bg-red-500/5 mix-blend-overlay"
        style={{
          filter: `contrast(${100 + glitchIntensity * 50}%) brightness(${
            100 + glitchIntensity * 20
          }%)`,
        }}
      />
      {glitchIntensity > 0.4 && (
        <motion.div
          animate={{
            clipPath: [
              'inset(10% 0 80% 0)',
              'inset(40% 0 40% 0)',
              'inset(70% 0 10% 0)',
              'inset(0% 0 0% 0)',
            ],
            x: [-10, 10, -5, 0],
          }}
          transition={{
            duration: 0.1,
            repeat: Infinity,
            repeatDelay: Math.random() * 2,
          }}
          className="absolute inset-0 bg-cyan-500/5 mix-blend-screen"
        />
      )}
    </div>
  );
}
