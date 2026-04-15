import { Text } from '@react-three/drei';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  position: [number, number, number];
  fontSize?: number;
  color?: string;
};

export function SceneLabel({
  children,
  position,
  fontSize = 0.35,

  color = "#ffffff",
}: Props) {
  return (
    <Text
      position={position}
      font="/fonts/pressstart2p-v16.ttf"
      fontSize={fontSize}

      anchorX="center"
      anchorY="middle"
      color={color}
    >
      {children}
    </Text>
  );
}
