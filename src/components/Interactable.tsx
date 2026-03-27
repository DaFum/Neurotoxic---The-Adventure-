/**
 * #1: UPDATES
 * - Implemented interactive component with hover, range, and interaction logic.
 * - Added visual feedback for interaction and range.
 * 
 * #2: NEXT STEPS & IDEAS
 * - Add more interaction types.
 * - Refine interaction UI.
 * 
 * #3: ERRORS & SOLUTIONS
 * - No major errors found.
 */
import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useStore } from '../store';
import { audio } from '../audio';

interface InteractableProps {
  position: [number, number, number];
  emoji: string;
  name: string;
  onInteract: () => void;
  scale?: number;
  isBandMember?: boolean;
  idleType?: 'headbang' | 'tap' | 'sway';
}

export function Interactable({ position, emoji, name, onInteract, scale = 1, isBandMember = false, idleType = 'sway' }: InteractableProps) {
  const ref = useRef<THREE.Group>(null);
  const spriteRef = useRef<THREE.Sprite>(null);
  const timeRef = useRef(0);
  const [hovered, setHovered] = useState(false);
  const [inRange, setInRange] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const isPaused = useStore((state) => state.isPaused);
  const bandMood = useStore((state) => state.bandMood);
  const setCameraShake = useStore((state) => state.setCameraShake);

  const emojiTexture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.clearRect(0, 0, size, size);
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 20, size / 2, size / 2, 120);
    gradient.addColorStop(0, 'rgba(173,255,47,0.22)');
    gradient.addColorStop(1, 'rgba(173,255,47,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, 120, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '150px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, size / 2, size / 2 + 8);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, [emoji]);

  const labelTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0,0,0,0.78)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#adff2f';
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

    ctx.fillStyle = '#adff2f';
    ctx.font = '700 36px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name.toUpperCase(), canvas.width / 2, 42);

    ctx.fillStyle = inRange ? '#b3b3b3' : '#8b0000';
    ctx.font = '600 22px "JetBrains Mono", monospace';
    ctx.fillText(inRange ? '[ CLICK TO INTERACT ]' : '[ MOVE CLOSER ]', canvas.width / 2, 90);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, [name, inRange]);

  useFrame((state, delta) => {
    if (isPaused) return;

    const playerPos = useStore.getState().playerPos;
    const dist = new THREE.Vector3(...playerPos).distanceTo(new THREE.Vector3(...position));
    setInRange(dist < 4.0);

    if (ref.current) {
      timeRef.current += delta;
      const time = timeRef.current;
      const moodFactor = 0.5 + (bandMood / 100);
      
      if (isBandMember) {
        if (idleType === 'headbang') {
          ref.current.rotation.x = Math.sin(time * 8 * moodFactor) * 0.15 * moodFactor;
        } else if (idleType === 'tap') {
          ref.current.position.y = Math.abs(Math.sin(time * 4 * moodFactor)) * 0.1 * moodFactor;
        } else {
          ref.current.rotation.z = Math.sin(time * 4 * moodFactor) * 0.1 * moodFactor;
        }
      } else {
        ref.current.position.y = Math.sin(time * 2) * 0.05;
      }
    }

    if (spriteRef.current) {
      const pulse = interacted ? 1.2 : hovered ? 1.08 : 1;
      spriteRef.current.scale.set(1.8 * scale * pulse, 1.8 * scale * pulse, 1);
    }
  });

  const handleInteract = () => {
    if (inRange && !isPaused) {
      audio.playInteraction();
      setCameraShake(0.2);
      onInteract();
      setInteracted(true);
      setTimeout(() => setInteracted(false), 500);
    } else if (!isPaused) {
      useStore.getState().setDialogue('OUT_OF_RANGE: Move closer to target.');
    }
  };

  const handleDomInteract = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    handleInteract();
  };

  return (
    <RigidBody type="fixed" position={position} colliders={false}>
      <CuboidCollider args={[0.75 * scale, 1 * scale, 0.5 * scale]} />
      <group ref={ref}>
        <sprite
          ref={spriteRef}
          scale={[1.8 * scale, 1.8 * scale, 1]}
          renderOrder={30}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={(e) => {
            handleDomInteract(e);
          }}
        >
          <spriteMaterial map={emojiTexture ?? undefined} transparent depthWrite={false} depthTest={false} />
        </sprite>
        {hovered && labelTexture && (
          <sprite position={[0, 1.35 * scale, 0]} scale={[2.8 * scale, 0.7 * scale, 1]} renderOrder={31}>
            <spriteMaterial map={labelTexture} transparent depthWrite={false} depthTest={false} />
          </sprite>
        )}
      </group>
    </RigidBody>
  );
}
