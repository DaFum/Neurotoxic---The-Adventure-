import { useEffect, useRef, useState } from 'react';
import { touchInput } from '../touchInput';

const BASE_R = 56; // outer ring radius px
const KNOB_R = 22; // inner knob radius px
const MAX = BASE_R - KNOB_R; // max knob travel px

function useTouchDeviceDetection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show on coarse-pointer (touch) devices, or if the device has touch events at all
    const mq = window.matchMedia('(pointer: coarse)');
    setVisible(mq.matches || 'ontouchstart' in window);
  }, []);

  return visible;
}

function useJoystickControls(visible: boolean) {
  const baseRef = useRef<HTMLDivElement>(null);
  const activePid = useRef<number | null>(null);
  const center = useRef({ x: 0, y: 0 });
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const el = baseRef.current;
    if (!el || !visible) return;

    function update(cx: number, cy: number) {
      const dx = cx - center.current.x;
      const dy = cy - center.current.y;
      const len = Math.hypot(dx, dy);
      const clen = Math.min(len, MAX);
      const angle = Math.atan2(dy, dx);
      setKnob({ x: Math.cos(angle) * clen, y: Math.sin(angle) * clen });
      // Dead-zone of 4 px to prevent drift
      const norm = clen / MAX;
      touchInput.x = len > 4 ? Math.cos(angle) * norm : 0;
      touchInput.z = len > 4 ? Math.sin(angle) * norm : 0;
    }

    function onDown(e: PointerEvent) {
      if (!el) return;
      if (activePid.current !== null) return;
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      activePid.current = e.pointerId;
      const r = el.getBoundingClientRect();
      center.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      setPressed(true);
      update(e.clientX, e.clientY);
    }

    function onMove(e: PointerEvent) {
      if (!el) return;
      if (e.pointerId !== activePid.current) return;
      e.preventDefault();
      update(e.clientX, e.clientY);
    }

    function onUp(e: PointerEvent) {
      if (e.pointerId !== activePid.current) return;
      activePid.current = null;
      touchInput.x = 0;
      touchInput.z = 0;
      setKnob({ x: 0, y: 0 });
      setPressed(false);
    }

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      touchInput.x = 0;
      touchInput.z = 0;
    };
  }, [visible]);

  return { baseRef, knob, pressed };
}

/**
 * Renders a virtual joystick and interact button for touch or coarse-pointer devices.
 * It handles pointer and touch events to capture user movement and updates
 * the global `touchInput` state with normalized `x` and `z` values.
 * Includes a 4px dead-zone to prevent unintended movement drift.
 * Only appears on touch-capable devices.
 * @returns A UI overlay for touch joystick controls, or null if hidden.
 */
export function VirtualJoystick() {
  const visible = useTouchDeviceDetection();
  const { baseRef, knob, pressed } = useJoystickControls(visible);

  if (!visible) return null;

  const ringOpacity = pressed ? 0.85 : 0.4;
  const knobOpacity = pressed ? 0.8 : 0.35;

  return (
    <div
      ref={baseRef}
      style={{
        position: 'absolute',
        bottom: 90,
        left: 24,
        width: BASE_R * 2,
        height: BASE_R * 2,
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.55)',
        border: `2px solid rgba(173,255,47,${ringOpacity})`,
        boxShadow: pressed ? '0 0 18px rgba(173,255,47,0.22)' : 'none',
        touchAction: 'none',
        userSelect: 'none',
        transition: 'border-color 0.1s, box-shadow 0.1s',
        zIndex: 30,
      }}
      aria-hidden="true"
    >
      {/* Crosshair guide lines */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.18 }}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 8,
            right: 8,
            height: 1,
            background: '#adff2f',
            transform: 'translateY(-50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 8,
            bottom: 8,
            width: 1,
            background: '#adff2f',
            transform: 'translateX(-50%)',
          }}
        />
      </div>

      {/* Knob */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: KNOB_R * 2,
          height: KNOB_R * 2,
          borderRadius: '50%',
          background: `rgba(173,255,47,${knobOpacity})`,
          border: '2px solid rgba(173,255,47,0.9)',
          transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))`,
          transition: pressed ? 'none' : 'transform 0.15s ease',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
