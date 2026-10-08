import * as THREE from "three";
import { loadModel } from "./loadModel";
export type FBXAsGLTF = { scene: THREE.Group; animations: THREE.AnimationClip[] };
export default function setCharacter(renderer: THREE.WebGLRenderer, scene: THREE.Scene,
  camera: THREE.PerspectiveCamera, signal: AbortSignal, onProgress: (percent: number) => void) {
  return { loadCharacter: async () => {
    const primary = await loadModel("/models/luffy_jump.glb", renderer, scene, camera, signal, 1.85, -0.85, onProgress);
    if (primary || signal.aborted) return primary;
    return loadModel("/models/monkey_d_luffy_damage_-_one_piece.glb", renderer, scene, camera, signal, 1.85, -0.85, onProgress);
  } };
}
