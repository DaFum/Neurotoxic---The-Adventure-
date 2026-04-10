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
import React, { useEffect, useMemo, useRef, useId, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useStore } from '../store';
import { audio } from '../audio';
import { useKeyboardInteraction } from './KeyboardInteractionManager';
import { createCanvasTexture } from '../utils/texture';

interface InteractableProps {
  position: [number, number, number];
  emoji: string;
  name: string;
  onInteract: () => void;
  scale?: number;
  isBandMember?: boolean;
  idleType?: 'headbang' | 'tap' | 'sway';
}

// Texture Dimensions
const EMOJI_TEXTURE_SIZE = 256;
const LABEL_TEXTURE_WIDTH = 512;
const LABEL_TEXTURE_HEIGHT = 128;

// Fonts
const FONT_EMOJI = '150px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
const FONT_LABEL_NAME = '700 36px "JetBrains Mono", monospace';
const FONT_LABEL_PROMPT = '600 22px "JetBrains Mono", monospace';

// Colors
const COLOR_ACCENT = '#adff2f';
const COLOR_PROMPT_IN_RANGE = '#b3b3b3';
const COLOR_PROMPT_OUT_OF_RANGE = '#8b0000';

const textureCache = new Map<string, { texture: THREE.CanvasTexture; refCount: number }>();

function getCachedTexture(key: string, createCanvas: () => HTMLCanvasElement): THREE.CanvasTexture {
  let entry = textureCache.get(key);
  if (entry) {
    entry.refCount++;
    return entry.texture;
  }

  const canvas = createCanvas();
  const texture = createCanvasTexture(canvas);

  textureCache.set(key, { texture, refCount: 1 });
  return texture;
}

function releaseCachedTexture(key: string) {
  const entry = textureCache.get(key);
  if (entry) {
    entry.refCount--;
    if (entry.refCount <= 0) {
      entry.texture.dispose();
      textureCache.delete(key);
    }
  }
}

const getEmojiTexture = (emoji: string): THREE.CanvasTexture => {
  return getCachedTexture(`emoji-${emoji}`, () => {
    const canvas = document.createElement('canvas');
    canvas.width = EMOJI_TEXTURE_SIZE;
    canvas.height = EMOJI_TEXTURE_SIZE;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, EMOJI_TEXTURE_SIZE, EMOJI_TEXTURE_SIZE);
      const gradient = ctx.createRadialGradient(EMOJI_TEXTURE_SIZE / 2, EMOJI_TEXTURE_SIZE / 2, 20, EMOJI_TEXTURE_SIZE / 2, EMOJI_TEXTURE_SIZE / 2, 120);
      gradient.addColorStop(0, 'rgba(173,255,47,0.22)');
      gradient.addColorStop(1, 'rgba(173,255,47,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(EMOJI_TEXTURE_SIZE / 2, EMOJI_TEXTURE_SIZE / 2, 120, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = FONT_EMOJI;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, EMOJI_TEXTURE_SIZE / 2, EMOJI_TEXTURE_SIZE / 2 + 8);
    }
    return canvas;
  });
};

const releaseEmojiTexture = (emoji: string) => {
  releaseCachedTexture(`emoji-${emoji}`);
};

const getLabelTexture = (name: string, isInRange: boolean): THREE.CanvasTexture => {
  return getCachedTexture(`label-${name}-${isInRange}`, () => {
    const canvas = document.createElement('canvas');
    canvas.width = LABEL_TEXTURE_WIDTH;
    canvas.height = LABEL_TEXTURE_HEIGHT;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, LABEL_TEXTURE_WIDTH, LABEL_TEXTURE_HEIGHT);
      ctx.fillStyle = 'rgba(0,0,0,0.78)';
      ctx.fillRect(0, 0, LABEL_TEXTURE_WIDTH, LABEL_TEXTURE_HEIGHT);
      ctx.strokeStyle = COLOR_ACCENT;
      ctx.lineWidth = 3;
      ctx.strokeRect(2, 2, LABEL_TEXTURE_WIDTH - 4, LABEL_TEXTURE_HEIGHT - 4);

      ctx.fillStyle = COLOR_ACCENT;
      ctx.font = FONT_LABEL_NAME;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(name.toUpperCase(), LABEL_TEXTURE_WIDTH / 2, 42);

      ctx.fillStyle = isInRange ? COLOR_PROMPT_IN_RANGE : COLOR_PROMPT_OUT_OF_RANGE;
      ctx.font = FONT_LABEL_PROMPT;
      ctx.fillText(isInRange ? '[ TAP OR E TO INTERACT ]' : '[ MOVE CLOSER ]', LABEL_TEXTURE_WIDTH / 2, 90);
    }
    return canvas;
  });
};

const releaseLabelTexture = (name: string, isInRange: boolean) => {
  releaseCachedTexture(`label-${name}-${isInRange}`);
};

/**
 * A reusable component that makes a 3D object in the world interactable by the player.
 * It tracks the player's distance, displays a prompt when in range, and triggers a callback
 * when the interaction key/button is pressed.
 * @param props - The properties object.
 * @param props.position - The 3D coordinates [x,y,z] where the interactable is located.
 * @param props.emoji - The text or emoji to display floating above the interactable.
 * @param props.name - The descriptive name shown in the UI prompt.
 * @param props.onInteract - The callback function executed when the player interacts.
 * @param props.scale - Optional scale multiplier for the 3D model.
 * @param props.isBandMember - Optional flag indicating if this is a band member (enables idle animations).
 * @param props.idleType - The type of idle animation to play if it is a band member.
 * @returns A 3D group containing the collision mesh and visual label.
 */
export const Interactable = React.memo(function Interactable({ position, emoji, name, onInteract, scale = 1, isBandMember = false, idleType = 'sway' }: InteractableProps) {
  const ref = useRef<THREE.Group>(null);
  const spriteRef = useRef<THREE.Sprite>(null);
  const labelSpriteRef = useRef<THREE.Sprite>(null);
  const id = useId();
  const instanceIdRef = useRef(`interactable-${id}`);
  const handleInteractRef = useRef<() => void>(() => {});
  const emojiTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const labelTextureInRangeRef = useRef<THREE.CanvasTexture | null>(null);
  const labelTextureOutOfRangeRef = useRef<THREE.CanvasTexture | null>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);
  const distanceRef = useRef(Infinity);
  const hoveredRef = useRef(false);
  const interactedRef = useRef(false);
  const { register, unregister, setActive } = useKeyboardInteraction();

  // Initialize accurately to prevent one frame flicker
  const initialDistSq = useMemo(() => {
    const { playerPos } = useStore.getState();
    const dx = playerPos[0] - position[0];
    const dy = playerPos[1] - position[1];
    const dz = playerPos[2] - position[2];
    return dx * dx + dy * dy + dz * dz;
  }, [position]);

  const inRangeRef = useRef(initialDistSq < 16.0);
  distanceRef.current = initialDistSq;

  const palette = useMemo(() => {
    let seed = 0;
    for (let i = 0; i < name.length; i++) {
      seed += name.charCodeAt(i);
    }
    const hue = (seed * 37) % 360;
    return {
      accent: `hsl(${hue} 88% 62%)`,
      accentSoft: `hsl(${(hue + 16) % 360} 62% 38%)`,
      base: isBandMember ? '#324052' : '#3a3548',
      trim: isBandMember ? '#5a7ca7' : '#74609d',
    };
  }, [name, isBandMember]);

  useEffect(() => {
    const texture = getEmojiTexture(emoji);
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
      releaseEmojiTexture(emoji);
    };
  }, [emoji]);

  useEffect(() => {
    const inRangeTexture = getLabelTexture(name, true);
    const outOfRangeTexture = getLabelTexture(name, false);

    labelTextureInRangeRef.current = inRangeTexture;
    labelTextureOutOfRangeRef.current = outOfRangeTexture;

    if (labelSpriteRef.current) {
      const material = labelSpriteRef.current.material;
      if (!Array.isArray(material) && material instanceof THREE.SpriteMaterial) {
        material.map = inRangeRef.current ? inRangeTexture : outOfRangeTexture;
        material.needsUpdate = true;
      }
    }

    return () => {
      if (labelSpriteRef.current) {
        const material = labelSpriteRef.current.material;
        if (!Array.isArray(material) && material instanceof THREE.SpriteMaterial &&
           (material.map === inRangeTexture || material.map === outOfRangeTexture)) {
          material.map = null;
          material.needsUpdate = true;
        }
      }

      labelTextureInRangeRef.current = null;
      labelTextureOutOfRangeRef.current = null;

      releaseLabelTexture(name, true);
      releaseLabelTexture(name, false);
    };
  }, [name]);

  useEffect(() => {
    const id = instanceIdRef.current;
    register(id, () => {
      if (!inRangeRef.current) return null;
      return { distance: distanceRef.current, trigger: handleInteractRef.current };
    });
    if (inRangeRef.current) {
      setActive(id, true);
    }
    return () => unregister(id);
  }, [register, unregister, setActive]);

  useFrame((_state, delta) => {
    const { isPaused, bandMood, playerPos } = useStore.getState();
    if (isPaused) return;

    // ⚡ Bolt Optimization: Use scalar math to avoid object allocation and method call overhead
    const dx = playerPos[0] - position[0];
    const dy = playerPos[1] - position[1];
    const dz = playerPos[2] - position[2];
    const distSq = dx * dx + dy * dy + dz * dz;

    const inRangeNow = distSq < 16.0; // 4.0 squared
    distanceRef.current = distSq; // keyboard interaction only compares relative distances, so squared is fine
    if (inRangeNow !== inRangeRef.current) {
      setActive(instanceIdRef.current, inRangeNow);
    }
    inRangeRef.current = inRangeNow;

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
      const pulse = interactedRef.current ? 1.2 : hoveredRef.current ? 1.08 : 1;
      spriteRef.current.scale.set(1.8 * scale * pulse, 1.8 * scale * pulse, 1);
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (inRangeNow ? 2.8 : 1.4);
      const ringScale = hoveredRef.current ? 1.06 : 1;
      ringRef.current.scale.set(ringScale, ringScale, ringScale);
    }

    if (coreRef.current) {
      const time = timeRef.current;
      coreRef.current.rotation.y += delta * 1.8;
      coreRef.current.position.y = 0.26 * scale + Math.sin(time * 3.5) * 0.035 * scale;
      const material = coreRef.current.material;
      if (!Array.isArray(material) && material instanceof THREE.MeshStandardMaterial) {
        material.emissiveIntensity = 0.45 + (hoveredRef.current ? 0.35 : 0) + Math.abs(Math.sin(time * 6)) * 0.22;
      }
    }

    const showLabel = hoveredRef.current || inRangeNow;
    if (labelSpriteRef.current) {
      labelSpriteRef.current.visible = showLabel;
      if (showLabel) {
        labelSpriteRef.current.scale.set(
          hoveredRef.current ? 2.8 * scale : 2.55 * scale,
          hoveredRef.current ? 0.7 * scale : 0.64 * scale,
          1
        );
        const material = labelSpriteRef.current.material;
        if (!Array.isArray(material) && material instanceof THREE.SpriteMaterial) {
          material.opacity = hoveredRef.current ? 1 : 0.9;

          const targetMap = inRangeNow ? labelTextureInRangeRef.current : labelTextureOutOfRangeRef.current;
          if (material.map !== targetMap) {
            material.map = targetMap;
            material.needsUpdate = true;
          }
        }
      }
    }
  });

  const handleInteract = () => {
    const { isPaused: currentIsPaused, dialogue: currentDialogue, setCameraShake } = useStore.getState();
    if (currentDialogue) return;
    if (inRangeRef.current && !currentIsPaused) {
      audio.playInteraction();
      setCameraShake(0.2);
      onInteract();
      interactedRef.current = true;
      setTimeout(() => { interactedRef.current = false; }, 500);
    } else if (!currentIsPaused) {
      useStore.getState().setDialogue('OUT_OF_RANGE: Move closer to target.');
    }
  };
  handleInteractRef.current = handleInteract;

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
          onPointerOver={() => { hoveredRef.current = true; }}
          onPointerOut={() => { hoveredRef.current = false; }}
          onClick={(e) => {
            handleDomInteract(e);
          }}
        >
          <spriteMaterial map={emojiTextureRef.current ?? undefined} transparent depthWrite={false} depthTest={false} />
        </sprite>
        <sprite
          ref={labelSpriteRef}
          position={[0, 1.35 * scale, 0]}
          renderOrder={31}
          visible={false}
        >
          <spriteMaterial
            transparent
            depthWrite={false}
            depthTest={false}
          />
        </sprite>
      </group>
    </RigidBody>
  );
});
