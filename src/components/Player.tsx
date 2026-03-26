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
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls, Html, Billboard, Sparkles } from '@react-three/drei';
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

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, pos.x + shakeOffset.x, 0.1);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, pos.z + 10 + shakeOffset.z, 0.1);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 5 + shakeOffset.y, 0.1);
    state.camera.lookAt(pos.x, 0, pos.z);

    // Decay camera shake
    if (cameraShake > 0) {
      setCameraShake(Math.max(0, cameraShake - delta * 2));
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

        <Billboard follow={true}>
          <mesh>
            <planeGeometry args={[1.5, 2]} />
            <meshStandardMaterial color="#000" transparent opacity={0} />
            <Html transform distanceFactor={10} position={[0, 0, 0.1]} center>
              <div className="relative group">
                {/* Character Sprite (Industrial Manager) */}
                <div
                  className={`text-7xl select-none transition-all duration-300 drop-shadow-[0_0_10px_rgba(173,255,47,0.3)] ${
                    facingRight ? 'scale-x-100' : '-scale-x-100'
                  } ${isMoving ? 'animate-bounce' : ''}`}
                >
                  🕶️
                </div>
                
                {/* Status Label */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <div className="bg-obsidian border border-toxic/50 px-2 py-0.5 text-[8px] font-mono text-toxic uppercase tracking-widest">
                    Unit_01: Manager
                  </div>
                </div>

                {/* Proximity Pulse (Scan Effect) */}
                <div className="absolute inset-0 border-2 border-toxic/20 rounded-full animate-ping scale-150 pointer-events-none opacity-20" />
              </div>
            </Html>
          </mesh>
        </Billboard>
      </group>
    </RigidBody>
  );
}
