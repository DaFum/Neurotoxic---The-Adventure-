import { useStore } from '../../store';
import { Player } from '../Player';
import { RigidBody } from '@react-three/rapier';

/**
 * Keller — a cramped basement beneath the venue.
 */
export function Keller() {
  const setDialogue = useStore((state) => state.setDialogue);

  return (
    <>
      <ambientLight intensity={0.15} color="#334466" />
      <pointLight position={[0, 2.5, 0]} intensity={0.6} color="#aabbdd" />

      {/* Floor */}
      <RigidBody type="fixed" position={[0, -0.1, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 12]} />
          <meshStandardMaterial color="#222233" emissive="#111122" emissiveIntensity={0.2} roughness={0.9} metalness={0.1} />
        </mesh>
      </RigidBody>

      {/* Back wall */}
      <RigidBody type="fixed" position={[0, 3, -6]}>
        <mesh>
          <boxGeometry args={[20, 6, 0.3]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.95} />
        </mesh>
      </RigidBody>

      {/* Left wall */}
      <RigidBody type="fixed" position={[-10, 3, 0]}>
        <mesh>
          <boxGeometry args={[0.3, 6, 12]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.95} />
        </mesh>
      </RigidBody>

      {/* Right wall */}
      <RigidBody type="fixed" position={[10, 3, 0]}>
        <mesh>
          <boxGeometry args={[0.3, 6, 12]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.95} />
        </mesh>
      </RigidBody>

      {/* Old crate */}
      <mesh position={[-3, 0.3, -4]} castShadow
        onClick={() => setDialogue('Eine alte Holzkiste. Der Geruch von feuchtem Karton und vergessenen Setlisten.')}
      >
        <boxGeometry args={[0.8, 0.6, 0.8]} />
        <meshStandardMaterial color="#3d2b1f" roughness={0.9} />
      </mesh>

      <Player bounds={{ x: [-9, 9], z: [-5, 5] }} />
    </>
  );
}
