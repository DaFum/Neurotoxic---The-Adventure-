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
import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls, Sparkles } from '@react-three/drei';
import { RigidBody, RapierRigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { useStore } from '../store';
import { audio } from '../audio';
import { touchInput } from '../touchInput';
import { clampPlayerPosition } from '../utils/math';

interface PlayerProps {
  bounds?: { x: [number, number]; z: [number, number] };
}

/**
 * Renders the player character within the physics world and handles movement logic.
 * Reads input from the keyboard (via zustand store) and touch joystick to apply velocity.
 * Also manages camera following and camera shake effects.
 * @param props - Component properties.
 * @param props.bounds - The soft clamping boundaries for the player in the current scene.
 * @returns A 3D RigidBody containing the player's mesh, sprites, and colliders.
 */
export function Player({ bounds = { x: [-10, 10], z: [-5, 5] } }: PlayerProps) {
  const bodyRef = useRef<RapierRigidBody>(null);
  const modelRef = useRef<THREE.Group>(null);
  const velocity = useRef(new THREE.Vector3()).current;
  const shakeOffset = useRef(new THREE.Vector3()).current;
  const [, get] = useKeyboardControls();
  const setPlayerPos = useStore((state) => state.setPlayerPos);
  const cameraShakeRef = useRef(0);

  // Keep a live reference to the authoritative player position from the store.
  // This ensures external teleports (scene switches, rehydrates, cheats) are
  // reflected in the Rapier body even if the component is already mounted.
  // We don't subscribe to playerPos here to avoid re-renders on every movement.
  const initialPos = useRef(useStore.getState().playerPos).current;
  const lastSentPosRef = useRef(new THREE.Vector3(initialPos[0], initialPos[1], initialPos[2])).current;
  const facingRight = useRef(true);
  const [isMoving, setIsMoving] = useState(false);
  const footstepTimer = useRef(0);

  const speed = 5;
  const spriteRef = useRef<THREE.Sprite>(null);
  const labelSpriteRef = useRef<THREE.Sprite>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const playerTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const labelTextureRef = useRef<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
    playerTextureRef.current = texture;

    const sprite = spriteRef.current;

    if (sprite) {
      const material = sprite.material;
      if (!Array.isArray(material) && material instanceof THREE.SpriteMaterial) {
        material.map = texture;
        material.needsUpdate = true;
      }
    }

    return () => {
      if (sprite) {
        const material = sprite.material;
        if (!Array.isArray(material) && material instanceof THREE.SpriteMaterial && material.map === texture) {
          material.map = null;
          material.needsUpdate = true;
        }
      }
      if (playerTextureRef.current === texture) {
        playerTextureRef.current = null;
      }
      texture.dispose();
    };
  }, []);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 420;
    canvas.height = 80;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
    labelTextureRef.current = texture;

    const labelSprite = labelSpriteRef.current;

    if (labelSprite) {
      const material = labelSprite.material;
      if (!Array.isArray(material) && material instanceof THREE.SpriteMaterial) {
        material.map = texture;
        material.needsUpdate = true;
      }
    }

    return () => {
      if (labelSprite) {
        const material = labelSprite.material;
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
  }, []);

  useEffect(() => {
    if (!bodyRef.current) return;
    try {
      // Sync the rapier body with the store exactly once on mount to handle spawns.
      bodyRef.current.setTranslation({ x: initialPos[0], y: initialPos[1], z: initialPos[2] }, true);
      bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      try { (bodyRef.current as any).setAngvel?.({ x: 0, y: 0, z: 0 }, true); } catch {}
      lastSentPosRef.set(initialPos[0], initialPos[1], initialPos[2]);
    } catch (e) {
      // Rapier body may not be initialized yet; ignore.
    }

    // Subscribe to playerPos changes directly to avoid re-renders
    let prevPos = initialPos;
    const unsubscribe = useStore.subscribe(
      (state) => {
        const newPos = state.playerPos;
        // Optimization: only process if the playerPos array reference changed, meaning a teleport/reset occurred
        if (newPos === prevPos) return;
        prevPos = newPos;

        if (!bodyRef.current) return;
        try {
          const cur = bodyRef.current.translation();
          const dx = Math.abs(cur.x - newPos[0]) + Math.abs(cur.y - newPos[1]) + Math.abs(cur.z - newPos[2]);

          // Only teleport the rigidbody if the positional difference is significant
          // to avoid fighting the physics simulation or causing tiny corrective jumps.
          if (dx > 0.05) {
            bodyRef.current.setTranslation({ x: newPos[0], y: newPos[1], z: newPos[2] }, true);
            bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
            try { (bodyRef.current as any).setAngvel?.({ x: 0, y: 0, z: 0 }, true); } catch {}
            lastSentPosRef.set(newPos[0], newPos[1], newPos[2]);
          }
        } catch (e) {
          // Rapier body may not be initialized yet
        }
      }
    );

    // Subscribe to camera shake kicks
    let prevKick = useStore.getState().cameraShakeKick;
    const unsubscribeShake = useStore.subscribe((state) => {
      const newKick = state.cameraShakeKick;
      if (newKick > 0 && newKick !== prevKick) {
        cameraShakeRef.current = state.cameraShakeIntensity;
      }
      prevKick = newKick;
    });

    return () => {
      unsubscribe();
      unsubscribeShake();
    };
  }, []);

  useFrame((state, delta) => {
    if (!bodyRef.current) return;

    const { forward, backward, left, right } = get();

    // Reset the vector instead of creating a new one
    velocity.set(0, 0, 0);

    if (forward) velocity.z -= 1;
    if (backward) velocity.z += 1;
    if (left) velocity.x -= 1;
    if (right) velocity.x += 1;

    // Add virtual joystick input (touch devices)
    velocity.x += touchInput.x;
    velocity.z += touchInput.z;

    // Update facing direction from combined input
    // ⚡ Bolt Optimization: Only update the facingRight ref when the value actually changes to avoid redundant work in useFrame
    if (velocity.x < -0.1 && facingRight.current) facingRight.current = false;
    else if (velocity.x > 0.1 && !facingRight.current) facingRight.current = true;

    const moving = velocity.length() > 0;
    if (moving !== isMoving) setIsMoving(moving);

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
    const { clampedX, clampedZ } = clampPlayerPosition(pos, bounds);
    if (clampedX !== pos.x || clampedZ !== pos.z) {
      bodyRef.current.setTranslation({ x: clampedX, y: pos.y, z: clampedZ }, true);
    }

    // ⚡ Bolt Optimization: Throttle Zustand state updates by applying a distance threshold.
    // Zustand subscriptions can be expensive, so we only update playerPos when moving significantly.
    const dx = clampedX - lastSentPosRef.x;
    const dy = pos.y - lastSentPosRef.y;
    const dz = clampedZ - lastSentPosRef.z;

    // ~0.05 squared distance is about 0.22 units, small enough not to break interactions
    if (dx * dx + dy * dy + dz * dz > 0.05) {
      lastSentPosRef.set(clampedX, pos.y, clampedZ);
      setPlayerPos([clampedX, pos.y, clampedZ]);
    } else if (!moving && (lastSentPosRef.x !== clampedX || lastSentPosRef.y !== pos.y || lastSentPosRef.z !== clampedZ)) {
      // Fallback flush: always update to exact resting position when player stops moving
      lastSentPosRef.set(clampedX, pos.y, clampedZ);
      setPlayerPos([clampedX, pos.y, clampedZ]);
    }

    // Camera follow with shake
    const currentCameraShake = cameraShakeRef.current;

    // Override the shakeOffset vector instead of creating a new one
    shakeOffset.set(
      (Math.random() - 0.5) * currentCameraShake,
      (Math.random() - 0.5) * currentCameraShake,
      (Math.random() - 0.5) * currentCameraShake
    );

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, clampedX + shakeOffset.x, 0.1);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, clampedZ + 10 + shakeOffset.z, 0.1);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 5 + shakeOffset.y, 0.1);
    state.camera.lookAt(clampedX, 0, clampedZ);

    // Decay camera shake
    if (currentCameraShake > 0) {
      cameraShakeRef.current = Math.max(0, currentCameraShake - delta * 2);
    }

    if (spriteRef.current) {
      const bounce = moving ? Math.abs(Math.sin(state.clock.elapsedTime * 10)) * 0.08 : 0;
      spriteRef.current.position.y = 1.05 + bounce;
      const dir = facingRight.current ? 1 : -1;
      spriteRef.current.scale.set(2.3 * dir, 2.3, 1);
    }

    if (modelRef.current) {
      const sway = moving ? Math.sin(state.clock.elapsedTime * 12) * 0.08 : 0;
      modelRef.current.rotation.z = sway;
      modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, facingRight.current ? 0 : Math.PI, 0.16);
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (moving ? 2.8 : 1.2);
      const pulse = moving ? 1.08 : 1;
      ringRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <RigidBody ref={bodyRef} position={[0, 1, 0]} lockRotations colliders={false}>
      <CuboidCollider args={[0.75, 1, 0.5]} />
      <group ref={modelRef}>
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

        <mesh position={[0, -0.72, 0]} rotation={[-Math.PI / 2, 0, 0]} ref={ringRef}>
          <torusGeometry args={[0.85, 0.07, 12, 36]} />
          <meshStandardMaterial color="#adff2f" emissive="#adff2f" emissiveIntensity={0.9} metalness={0.8} roughness={0.22} />
        </mesh>
        <mesh position={[0, -0.62, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.82, 0.95, 0.18, 22]} />
          <meshStandardMaterial color="#2e3a46" emissive="#182026" emissiveIntensity={0.35} metalness={0.55} roughness={0.45} />
        </mesh>
        <mesh position={[0, -0.04, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.28, 0.34, 0.9, 16]} />
          <meshStandardMaterial color="#3d4958" emissive="#1d2734" emissiveIntensity={0.28} metalness={0.58} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.55, 0]} castShadow>
          <sphereGeometry args={[0.24, 16, 16]} />
          <meshStandardMaterial color="#d7e6ff" emissive="#86a9d6" emissiveIntensity={0.2} metalness={0.24} roughness={0.4} />
        </mesh>
        <mesh position={[0.32, 0.02, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.12, 0.5, 0.2]} />
          <meshStandardMaterial color="#273140" metalness={0.55} roughness={0.45} />
        </mesh>
        <mesh position={[-0.32, 0.02, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.12, 0.5, 0.2]} />
          <meshStandardMaterial color="#273140" metalness={0.55} roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.02, -0.24]} castShadow receiveShadow>
          <boxGeometry args={[0.34, 0.52, 0.2]} />
          <meshStandardMaterial color="#2a313c" emissive="#1a2434" emissiveIntensity={0.22} metalness={0.48} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.02, -0.36]}>
          <planeGeometry args={[0.22, 0.14]} />
          <meshStandardMaterial color="#5cf4ff" emissive="#5cf4ff" emissiveIntensity={0.75} metalness={0.6} roughness={0.25} />
        </mesh>

        <sprite ref={spriteRef} scale={[2.3, 2.3, 1]} renderOrder={20}>
          <spriteMaterial map={playerTextureRef.current ?? undefined} transparent depthWrite={false} depthTest={false} />
        </sprite>
        <sprite ref={labelSpriteRef} position={[0, -1.2, 0]} scale={[2.1, 0.4, 1]} renderOrder={19}>
          <spriteMaterial map={labelTextureRef.current ?? undefined} transparent depthWrite={false} depthTest={false} />
        </sprite>
      </group>
    </RigidBody>
  );
}
