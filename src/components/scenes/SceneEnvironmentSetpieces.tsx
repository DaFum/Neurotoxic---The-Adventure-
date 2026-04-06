import { Float } from '@react-three/drei';

const PROBERAUM_DUCT_X_POSITIONS: ReadonlyArray<number> = [-12, -6, 0, 6, 12];
const PROBERAUM_CABLE_X_POSITIONS: ReadonlyArray<number> = [-11.8, -7.2, -2.6, 2.6, 7.2, 11.8];
const PROBERAUM_JUNCTION_POSITIONS: ReadonlyArray<[number, number, number]> = [
  [-13.6, 2.8, -5.7], [13.6, 2.8, -5.7], [-13.6, 2.8, 3.2], [13.6, 2.8, 3.2],
];

const TOURBUS_RIB_Z_POSITIONS: ReadonlyArray<number> = [-4, -1.2, 1.2, 4];
const TOURBUS_OVERHEAD_X_POSITIONS: ReadonlyArray<number> = [-4.8, -3.2, -1.6, 0, 1.6, 3.2, 4.8];
const TOURBUS_FLOOR_BOLT_X_POSITIONS: ReadonlyArray<number> = [-5, -2.5, 0, 2.5, 5];

const BACKSTAGE_LAMP_X_POSITIONS: ReadonlyArray<number> = [-9, -3, 3, 9];
const BACKSTAGE_RUNWAY_X_POSITIONS: ReadonlyArray<number> = [-11, -7, -3, 1, 5, 9];

const VOID_RING_RADII: ReadonlyArray<number> = [7.5, 12.5, 17.5];
const VOID_PYLON_POSITIONS: ReadonlyArray<[number, number, number]> = [
  [-15, 0.9, -12], [-7, 1.2, -16], [7, 1.3, -16], [15, 0.9, -12], [-15, 1.1, 12], [15, 1.1, 12],
];
const VOID_STRIP_X_POSITIONS: ReadonlyArray<number> = [-12, -6, 0, 6, 12];

const KAMINSTUBE_RAFTER_X_POSITIONS: ReadonlyArray<number> = [-12, -6, 0, 6, 12];
const KAMINSTUBE_BARREL_POSITIONS: ReadonlyArray<[number, number, number]> = [
  [-13.2, 0.72, -3.6], [13.2, 0.72, -3.6], [-13.2, 0.72, 1.8], [13.2, 0.72, 1.8],
];
const KAMINSTUBE_CHAIN_X_POSITIONS: ReadonlyArray<number> = [-8, -2, 4, 10];

const SALZGITTER_TOWER_POSITIONS: ReadonlyArray<[number, number, number]> = [
  [-15, 3.2, -7.8], [15, 3.2, -7.8], [-15, 3.2, -3.8], [15, 3.2, -3.8],
];
const SALZGITTER_TOWER_STRIP_Y_OFFSETS: ReadonlyArray<number> = [-2.1, -1, 0.1, 1.2, 2.3];
const SALZGITTER_GANTRY_X_POSITIONS: ReadonlyArray<number> = [-10, -5, 0, 5, 10];
const SALZGITTER_FRONT_STRIP_X_POSITIONS: ReadonlyArray<number> = [-14, -10, -6, -2, 2, 6, 10, 14];

type SceneVariant = 'proberaum' | 'tourbus' | 'backstage' | 'void_station' | 'kaminstube' | 'salzgitter';

interface SceneEnvironmentSetpiecesProps {
  variant: SceneVariant;
}

/**
 * Renders decorative 3D environment setpieces for different scenes.
 * It provides visually distinct background objects and lighting details that are specific to the active scene.
 * @param props - The properties object containing the variant.
 * @param props.variant - The scene identifier determining which setpieces to render (e.g., 'proberaum', 'tourbus', etc.).
 * @returns A group containing scene-specific meshes and geometries, or null for unknown variants.
 */
export function SceneEnvironmentSetpieces({ variant }: SceneEnvironmentSetpiecesProps) {
  switch (variant) {
    case 'proberaum':
      return (
        <group>
          {PROBERAUM_DUCT_X_POSITIONS.map((x) => (
            <group key={`proberaum-duct-${x}`} position={[x, 6.45, 1.6]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[2.9, 0.35, 1.1]} />
                <meshStandardMaterial color="#2a3340" emissive="#131d2a" emissiveIntensity={0.3} metalness={0.72} roughness={0.34} />
              </mesh>
              <mesh position={[0, -0.28, 0]}>
                <boxGeometry args={[2.4, 0.05, 0.9]} />
                <meshStandardMaterial color="#72d7ff" emissive="#72d7ff" emissiveIntensity={0.52} />
              </mesh>
            </group>
          ))}
          {PROBERAUM_CABLE_X_POSITIONS.map((x, idx) => (
            <mesh key={`proberaum-cable-${x}`} position={[x, 0.12, 6.6]} rotation={[-Math.PI / 2, idx * 0.2, 0]}>
              <torusGeometry args={[0.28, 0.04, 10, 20]} />
              <meshStandardMaterial color={idx % 2 === 0 ? '#242d3b' : '#35243b'} metalness={0.58} roughness={0.34} />
            </mesh>
          ))}
          {PROBERAUM_JUNCTION_POSITIONS.map((pos, idx) => (
            <group key={`proberaum-junction-${idx}`} position={pos}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.55, 0.55, 0.55]} />
                <meshStandardMaterial color="#3f4f63" emissive="#1d2e41" emissiveIntensity={0.35} metalness={0.68} roughness={0.32} />
              </mesh>
              <mesh position={[0, 0.36, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.44, 8]} />
                <meshStandardMaterial color="#8de770" emissive="#8de770" emissiveIntensity={0.7} />
              </mesh>
            </group>
          ))}
        </group>
      );
    case 'tourbus':
      return (
        <group>
          {TOURBUS_RIB_Z_POSITIONS.map((z) => (
            <mesh key={`tourbus-rib-${z}`} position={[0, 3.85, z]} castShadow receiveShadow>
              <torusGeometry args={[5.45, 0.06, 10, 40, Math.PI]} />
              <meshStandardMaterial color="#2d3746" emissive="#151f2d" emissiveIntensity={0.28} metalness={0.72} roughness={0.32} />
            </mesh>
          ))}
          {TOURBUS_OVERHEAD_X_POSITIONS.map((x, idx) => (
            <group key={`tourbus-overhead-${x}`} position={[x, 3.55, -0.4]}>
              <mesh>
                <boxGeometry args={[0.8, 0.14, 0.8]} />
                <meshStandardMaterial color="#2a2f3b" emissive="#141c28" emissiveIntensity={0.28} metalness={0.68} roughness={0.3} />
              </mesh>
              <mesh position={[0, -0.1, 0]}>
                <planeGeometry args={[0.6, 0.6]} />
                <meshStandardMaterial color={idx % 2 === 0 ? '#66dcff' : '#ff9968'} emissive={idx % 2 === 0 ? '#66dcff' : '#ff9968'} emissiveIntensity={0.74} />
              </mesh>
            </group>
          ))}
          {TOURBUS_FLOOR_BOLT_X_POSITIONS.map((x) => (
            <mesh key={`tourbus-floor-bolt-${x}`} position={[x, 0.02, -1.7]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.08, 0.12, 12]} />
              <meshStandardMaterial color="#9cadbd" emissive="#4d5f75" emissiveIntensity={0.2} metalness={0.86} roughness={0.22} />
            </mesh>
          ))}
        </group>
      );
    case 'backstage':
      return (
        <group>
          <mesh position={[0, 7.25, 1.2]} castShadow receiveShadow>
            <boxGeometry args={[24, 0.28, 2.2]} />
            <meshStandardMaterial color="#1e2532" emissive="#111827" emissiveIntensity={0.3} metalness={0.76} roughness={0.34} />
          </mesh>
          {BACKSTAGE_LAMP_X_POSITIONS.map((x, idx) => (
            <group key={`backstage-lamp-${x}`} position={[x, 6.95, 1.2]}>
              <mesh>
                <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
                <meshStandardMaterial color="#c3cfdd" metalness={0.88} roughness={0.2} />
              </mesh>
              <mesh position={[0, -0.52, 0]}>
                <sphereGeometry args={[0.16, 12, 12]} />
                <meshStandardMaterial color={idx % 2 === 0 ? '#8eff70' : '#79ddff'} emissive={idx % 2 === 0 ? '#8eff70' : '#79ddff'} emissiveIntensity={1.1} />
              </mesh>
            </group>
          ))}
          {BACKSTAGE_RUNWAY_X_POSITIONS.map((x, idx) => (
            <mesh key={`backstage-runway-led-${x}`} position={[x, 0.03, 1.7]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[2.5, 0.14]} />
              <meshStandardMaterial color={idx % 2 === 0 ? '#d6ff4a' : '#ff6aa8'} emissive={idx % 2 === 0 ? '#d6ff4a' : '#ff6aa8'} emissiveIntensity={0.58} />
            </mesh>
          ))}
        </group>
      );
    case 'void_station':
      return (
        <group>
          {VOID_RING_RADII.map((r, idx) => (
            <Float key={`void-ring-${r}`} speed={1.4 + idx * 0.25} rotationIntensity={0.45} floatIntensity={0.25}>
              <mesh position={[0, 2.2 + idx * 1.1, -1.8 - idx * 1.2]} rotation={[Math.PI / 2, 0, idx * 0.35]}>
                <torusGeometry args={[r, 0.14, 16, 88]} />
                <meshStandardMaterial color={idx % 2 === 0 ? '#66f3ff' : '#ad78ff'} emissive={idx % 2 === 0 ? '#2aa8b7' : '#6b42ba'} emissiveIntensity={0.5} metalness={0.74} roughness={0.22} />
              </mesh>
            </Float>
          ))}
          {VOID_PYLON_POSITIONS.map((pos, idx) => (
            <group key={`void-pylon-${idx}`} position={pos}>
              <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.32, 0.42, 2.2, 12]} />
                <meshStandardMaterial color="#2a2a47" emissive="#171735" emissiveIntensity={0.35} metalness={0.62} roughness={0.35} />
              </mesh>
              <mesh position={[0, 1.24, 0]}>
                <octahedronGeometry args={[0.24, 0]} />
                <meshStandardMaterial color={idx % 2 === 0 ? '#74f5ff' : '#ff7de0'} emissive={idx % 2 === 0 ? '#39aab3' : '#a94192'} emissiveIntensity={0.8} metalness={0.72} roughness={0.2} />
              </mesh>
            </group>
          ))}
          {VOID_STRIP_X_POSITIONS.map((x, idx) => (
            <mesh key={`void-strip-${x}`} position={[x, 0.05, -9]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[3.2, 0.18]} />
              <meshStandardMaterial color={idx % 2 === 0 ? '#62ffd8' : '#ff76e0'} emissive={idx % 2 === 0 ? '#62ffd8' : '#ff76e0'} emissiveIntensity={0.4} />
            </mesh>
          ))}
        </group>
      );
    case 'kaminstube':
      return (
        <group>
          {KAMINSTUBE_RAFTER_X_POSITIONS.map((x) => (
            <mesh key={`kaminstube-rafter-${x}`} position={[x, 6.7, -0.5]} castShadow receiveShadow>
              <boxGeometry args={[0.28, 0.28, 15.2]} />
              <meshStandardMaterial color="#2d1f19" emissive="#130c09" emissiveIntensity={0.18} roughness={0.95} />
            </mesh>
          ))}
          {KAMINSTUBE_BARREL_POSITIONS.map((pos, idx) => (
            <group key={`kaminstube-barrels-${idx}`} position={pos}>
              <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.35, 0.38, 0.72, 16]} />
                <meshStandardMaterial color="#5d3927" emissive="#2d170f" emissiveIntensity={0.25} metalness={0.24} roughness={0.78} />
              </mesh>
              <mesh position={[0, 0.38, 0]}>
                <circleGeometry args={[0.35, 16]} />
                <meshStandardMaterial color="#7a4f38" emissive="#362014" emissiveIntensity={0.2} roughness={0.72} />
              </mesh>
            </group>
          ))}
          {KAMINSTUBE_CHAIN_X_POSITIONS.map((x, idx) => (
            <Float key={`kaminstube-chains-${x}`} speed={1.2 + idx * 0.2} rotationIntensity={0.2} floatIntensity={0.15}>
              <group position={[x, 5.35, -1.1]}>
                <mesh>
                  <cylinderGeometry args={[0.02, 0.02, 1.3, 8]} />
                  <meshStandardMaterial color="#c8b79b" metalness={0.8} roughness={0.25} />
                </mesh>
                <mesh position={[0, -0.84, 0]}>
                  <sphereGeometry args={[0.17, 12, 12]} />
                  <meshStandardMaterial color="#ffc77f" emissive="#ffc77f" emissiveIntensity={0.9} />
                </mesh>
              </group>
            </Float>
          ))}
        </group>
      );
    case 'salzgitter':
      return (
        <group>
          {SALZGITTER_TOWER_POSITIONS.map((pos, idx) => (
            <group key={`salzgitter-tower-${idx}`} position={pos}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[1.4, 6.2, 1.1]} />
                <meshStandardMaterial color="#202734" emissive="#121b29" emissiveIntensity={0.34} metalness={0.68} roughness={0.36} />
              </mesh>
              {SALZGITTER_TOWER_STRIP_Y_OFFSETS.map((y, row) => (
                <mesh key={`salzgitter-tower-strip-${idx}-${row}`} position={[0, y, 0.56]}>
                  <planeGeometry args={[0.9, 0.16]} />
                  <meshStandardMaterial color={row % 2 === 0 ? '#6ef5ff' : '#ff73d7'} emissive={row % 2 === 0 ? '#6ef5ff' : '#ff73d7'} emissiveIntensity={0.65} />
                </mesh>
              ))}
            </group>
          ))}
          <mesh position={[0, 7.3, -8.1]} castShadow receiveShadow>
            <boxGeometry args={[22, 0.35, 0.35]} />
            <meshStandardMaterial color="#1e2430" emissive="#101723" emissiveIntensity={0.24} metalness={0.84} roughness={0.26} />
          </mesh>
          {SALZGITTER_GANTRY_X_POSITIONS.map((x, idx) => (
            <mesh key={`salzgitter-gantry-lamp-${x}`} position={[x, 7, -8.1]}>
              <sphereGeometry args={[0.15, 12, 12]} />
              <meshStandardMaterial color={idx % 2 === 0 ? '#2dffe7' : '#ff5ecb'} emissive={idx % 2 === 0 ? '#2dffe7' : '#ff5ecb'} emissiveIntensity={1.2} />
            </mesh>
          ))}
          {SALZGITTER_FRONT_STRIP_X_POSITIONS.map((x, idx) => (
            <mesh key={`salzgitter-front-strip-${x}`} position={[x, 0.03, 6.2]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[2.8, 0.12]} />
              <meshStandardMaterial color={idx % 2 === 0 ? '#5aa0ff' : '#ff73cb'} emissive={idx % 2 === 0 ? '#5aa0ff' : '#ff73cb'} emissiveIntensity={0.44} />
            </mesh>
          ))}
        </group>
      );
    default:
      return null;
  }
}

