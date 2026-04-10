import * as THREE from 'three';

/**
 * Creates a THREE.CanvasTexture from an HTMLCanvasElement with standard settings.
 * @param canvas The canvas to create the texture from.
 * @returns A new THREE.CanvasTexture configured for the project.
 */
export function createCanvasTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
