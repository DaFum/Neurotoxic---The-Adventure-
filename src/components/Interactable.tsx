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
import { useEffect, useMemo, useRef, useState } from 'react';
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
  const labelSpriteRef = useRef<THREE.Sprite>(null);
  const emojiTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const labelTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);
  const [hovered, setHovered] = useState(false);
  const [inRange, setInRange] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const isPaused = useStore((state) => state.isPaused);
  const bandMood = useStore((state) => state.bandMood);
  const setCameraShake = useStore((state) => state.setCameraShake);

  const palette = useMemo(() => {
    const seed = name.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const hue = (seed * 37) % 360;
    return {
      accent: `hsl(${hue} 88% 62%)`,
      accentSoft: `hsl(${(hue + 16) % 360} 62% 38%)`,
      base: isBandMember ? '#324052' : '#3a3548',
      trim: isBandMember ? '#5a7ca7' : '#74609d',
    };
  }, [name, isBandMember]);

  useEffect(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
    emojiTextureRef.current = texture;

    if (spriteRef.current) {
      const material = spriteRef.current.material;
      if (!Array.isArray(material) && material instanceof THREE.SpriteMaterial) {
        material.map = texture;
        material.needsUpdate = true;
      }
    }

    return () => {
      if (spriteRef.current) {
        const material = spriteRef.current.material;
        if (!Array.isArray(material) && material instanceof THREE.SpriteMaterial && material.map === texture) {
          material.map = null;
          material.needsUpdate = true;
        }
      }
      if (emojiTextureRef.current === texture) {
        emojiTextureRef.current = null;
      }
      texture.dispose();
    };
  }, [emoji]);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
    labelTextureRef.current = texture;

    if (labelSpriteRef.current) {
      const material = labelSpriteRef.current.material;
      if (!Array.isArray(material) && material instanceof THREE.SpriteMaterial) {
        material.map = texture;
        material.needsUpdate = true;
      }
    }

    return () => {
      if (labelSpriteRef.current) {
        const material = labelSpriteRef.current.material;
        if (!Array.isArray(material) && material instanceof THREE.SpriteMaterial && material.map === texture) {
          material.map = null;
          material.needsUpdate = true;
        }
      }
      if (labelTextureRef.current === texture) {
        labelTextureRef.current = null;
      }
      texture.dispose();
    };
  }, [name, inRange]);

  useEffect(() => {
    return () => {
      emojiTextureRef.current?.dispose();
      emojiTextureRef.current = null;
      labelTextureRef.current?.dispose();
      labelTextureRef.current = null;
    };
  }, []);

  useFrame((state, delta) => {
    if (isPaused) return;

    const playerPos = useStore.getState().playerPos;
    const dist = new THREE.Vector3(...playerPos).distanceTo(new THREE.Vector3(...position));
    const inRangeNow = dist < 4.0;
    setInRange((prev) => (prev === inRangeNow ? prev : inRangeNow));

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

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (inRangeNow ? 2.8 : 1.4);
      const ringScale = hovered ? 1.06 : 1;
      ringRef.current.scale.set(ringScale, ringScale, ringScale);
    }

    if (coreRef.current) {
      const time = timeRef.current;
      coreRef.current.rotation.y += delta * 1.8;
      coreRef.current.position.y = 0.26 * scale + Math.sin(time * 3.5) * 0.035 * scale;
      const material = coreRef.current.material;
      if (!Array.isArray(material) && material instanceof THREE.MeshStandardMaterial) {
        material.emissiveIntensity = 0.45 + (hovered ? 0.35 : 0) + Math.abs(Math.sin(time * 6)) * 0.22;
      }
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
        <mesh position={[0, -0.68 * scale, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.78 * scale, 0.92 * scale, 0.24 * scale, 24]} />
          <meshStandardMaterial color={palette.base} emissive="#151a22" emissiveIntensity={0.3} metalness={0.55} roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.56 * scale, 0]} rotation={[-Math.PI / 2, 0, 0]} ref={ringRef}>
          <torusGeometry args={[0.78 * scale, 0.06 * scale, 12, 42]} />
          <meshStandardMaterial color={palette.accent} emissive={palette.accent} emissiveIntensity={0.8} metalness={0.85} roughness={0.24} />
        </mesh>
        <mesh position={[0, -0.47 * scale, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.45 * scale, 0.68 * scale, 28]} />
          <meshStandardMaterial color={palette.trim} emissive={palette.accentSoft} emissiveIntensity={0.3} metalness={0.4} roughness={0.5} />
        </mesh>
        <mesh ref={coreRef} position={[0, 0.26 * scale, 0]} castShadow>
          <octahedronGeometry args={[0.26 * scale, 0]} />
          <meshStandardMaterial color={palette.trim} emissive={palette.accent} emissiveIntensity={0.5} metalness={0.75} roughness={0.25} />
        </mesh>
        {isBandMember && (
          <group>
            <mesh position={[0, -0.08 * scale, -0.05 * scale]} castShadow receiveShadow>
              <cylinderGeometry args={[0.2 * scale, 0.25 * scale, 0.55 * scale, 12]} />
              <meshStandardMaterial color="#39465c" emissive="#1d2736" emissiveIntensity={0.25} metalness={0.5} roughness={0.45} />
            </mesh>
            <mesh position={[0, 0.28 * scale, -0.05 * scale]} castShadow>
              <sphereGeometry args={[0.16 * scale, 14, 14]} />
              <meshStandardMaterial color="#e3edf9" emissive="#9eb7d6" emissiveIntensity={0.22} metalness={0.2} roughness={0.45} />
            </mesh>
          </group>
        )}
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
          <spriteMaterial map={emojiTextureRef.current ?? undefined} transparent depthWrite={false} depthTest={false} />
        </sprite>
        {hovered && (
          <sprite ref={labelSpriteRef} position={[0, 1.35 * scale, 0]} scale={[2.8 * scale, 0.7 * scale, 1]} renderOrder={31}>
            <spriteMaterial map={labelTextureRef.current ?? undefined} transparent depthWrite={false} depthTest={false} />
          </sprite>
        )}
      </group>
    </RigidBody>
  );
}
