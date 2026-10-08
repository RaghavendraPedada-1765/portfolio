import * as THREE from "three";
import { loadModel } from "./loadModel";
export default async function loadAboutCharacter(renderer: THREE.WebGLRenderer, scene: THREE.Scene,
  camera: THREE.PerspectiveCamera, signal: AbortSignal) {
  const asset = await loadModel("/models/luffy_typing.glb", renderer, scene, camera, signal, 1.9, -0.95);
  if (!asset) return null;
  const mixer = new THREE.AnimationMixer(asset.scene);
  if (asset.animations[0]) mixer.clipAction(asset.animations[0]).play();
  return { scene: asset.scene, mixer };
}
