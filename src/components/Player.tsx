/**
 * #1: UPDATES
 * - Implemented player movement with keyboard controls.
 * - Added camera follow and shake effect.
 * - Added visual feedback for movement (dust particles, sprite animation).
 * 
 * #2: NEXT STEPS & IDEAS
 * - Add more player animations.
 * - Refine movement physics.
 * 
 * #3: ERRORS & SOLUTIONS
 * - No major errors found.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls, Sparkles } from '@react-three/drei';
import { RigidBody, RapierRigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useStore } from '../store';
import { audio } from '../audio';

interface PlayerProps {
  bounds?: { x: [number, number]; z: [number, number] };
}

export function Player({ bounds = { x: [-10, 10], z: [-5, 5] } }: PlayerProps) {
  const bodyRef = useRef<RapierRigidBody>(null);
  const velocity = useRef(new THREE.Vector3()).current;
  const shakeOffset = useRef(new THREE.Vector3()).current;
  const [, get] = useKeyboardControls();
  const setPlayerPos = useStore((state) => state.setPlayerPos);
  const cameraShake = useStore((state) => state.cameraShake);
  const setCameraShake = useStore((state) => state.setCameraShake);
  const initialPos = useStore.getState().playerPos;
  const [facingRight, setFacingRight] = useState(true);
  const [isMoving, setIsMoving] = useState(false);
  const footstepTimer = useRef(0);

  const speed = 5;
  const spriteRef = useRef<THREE.Sprite>(null);

  const playerTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.clearRect(0, 0, 256, 256);
    const glow = ctx.createRadialGradient(128, 128, 15, 128, 128, 115);
    glow.addColorStop(0, 'rgba(173,255,47,0.35)');
    glow.addColorStop(1, 'rgba(173,255,47,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(128, 128, 115, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '150px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🕶️', 128, 132);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, []);

  const labelTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 420;
    canvas.height = 80;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.clearRect(0, 0, 420, 80);
    ctx.fillStyle = 'rgba(5,5,5,0.82)';
    ctx.fillRect(0, 0, 420, 80);
    ctx.strokeStyle = 'rgba(173,255,47,0.8)';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, 416, 76);

    ctx.fillStyle = '#adff2f';
    ctx.font = '700 24px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('UNIT_01: MANAGER', 210, 40);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, []);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.setTranslation({ x: initialPos[0], y: initialPos[1], z: initialPos[2] }, true);
    }
  }, []);

  useFrame((state, delta) => {
    if (!bodyRef.current) return;

    const { forward, backward, left, right } = get();

    // Reset the vector instead of creating a new one
    velocity.set(0, 0, 0);

    if (forward) velocity.z -= 1;
    if (backward) velocity.z += 1;
    if (left) {
      velocity.x -= 1;
      setFacingRight(false);
    }
    if (right) {
      velocity.x += 1;
      setFacingRight(true);
    }

    const moving = velocity.length() > 0;
    setIsMoving(moving);

    if (moving) {
      velocity.normalize().multiplyScalar(speed);
      
      // Footsteps
      footstepTimer.current += delta;
      if (footstepTimer.current > 0.3) {
        audio.playFootstep();
        footstepTimer.current = 0;
      }
    }
    
    bodyRef.current.setLinvel({ x: velocity.x, y: bodyRef.current.linvel().y, z: velocity.z }, true);
    
    const pos = bodyRef.current.translation();
    
    // Manual bounds clamping
    let clampedX = pos.x;
    let clampedZ = pos.z;
    if (pos.x < bounds.x[0] || pos.x > bounds.x[1] || pos.z < bounds.z[0] || pos.z > bounds.z[1]) {
      clampedX = THREE.MathUtils.clamp(pos.x, bounds.x[0], bounds.x[1]);
      clampedZ = THREE.MathUtils.clamp(pos.z, bounds.z[0], bounds.z[1]);
      bodyRef.current.setTranslation({ x: clampedX, y: pos.y, z: clampedZ }, true);
    }

    setPlayerPos([clampedX, pos.y, clampedZ]);

    // Camera follow with shake
    // Override the shakeOffset vector instead of creating a new one
    shakeOffset.set(
      (Math.random() - 0.5) * cameraShake,
      (Math.random() - 0.5) * cameraShake,
      (Math.random() - 0.5) * cameraShake
    );

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, clampedX + shakeOffset.x, 0.1);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, clampedZ + 10 + shakeOffset.z, 0.1);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 5 + shakeOffset.y, 0.1);
    state.camera.lookAt(clampedX, 0, clampedZ);

    // Decay camera shake
    if (cameraShake > 0) {
      setCameraShake(Math.max(0, cameraShake - delta * 2));
    }

    if (spriteRef.current) {
      const bounce = isMoving ? Math.abs(Math.sin(state.clock.elapsedTime * 10)) * 0.08 : 0;
      spriteRef.current.position.y = 1.05 + bounce;
      const dir = facingRight ? 1 : -1;
      spriteRef.current.scale.set(2.3 * dir, 2.3, 1);
    }
  });

  return (
    <RigidBody ref={bodyRef} position={[0, 1, 0]} lockRotations colliders={false}>
      <CuboidCollider args={[0.75, 1, 0.5]} />
      <group>
        {/* Dust particles when moving */}
        {isMoving && (
          <Sparkles 
            count={20} 
            scale={2} 
            size={2} 
            speed={0.5} 
            color="#adff2f" 
            opacity={0.5} 
          />
        )}

        <sprite ref={spriteRef} scale={[2.3, 2.3, 1]} renderOrder={20}>
          <spriteMaterial map={playerTexture ?? undefined} transparent depthWrite={false} depthTest={false} />
        </sprite>
        {labelTexture && (
          <sprite position={[0, -1.2, 0]} scale={[2.1, 0.4, 1]} renderOrder={19}>
            <spriteMaterial map={labelTexture} transparent depthWrite={false} depthTest={false} />
          </sprite>
        )}
      </group>
    </RigidBody>
  );
}
