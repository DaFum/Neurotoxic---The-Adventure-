import * as THREE from 'three';

/**
 * Creates a THREE.CanvasTexture from an HTMLCanvasElement or OffscreenCanvas with standard settings.
 * @param canvas The canvas (HTMLCanvasElement or OffscreenCanvas) to create the texture from.
 * @returns A new THREE.CanvasTexture configured for the project.
 */
export function createCanvasTexture(
  canvas: HTMLCanvasElement | OffscreenCanvas,
): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}
