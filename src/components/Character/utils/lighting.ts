import * as THREE from "three";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
export default function setLighting(scene: THREE.Scene, signal: AbortSignal) {
  const key = new THREE.DirectionalLight(0xffeedd, 1.8);
  key.position.set(2, 3, 4);
  const fill = new THREE.DirectionalLight(0xa78bfa, 1);
  fill.position.set(-3, 1, 2);
  scene.add(key, fill, new THREE.AmbientLight(0xffffff, 0.8));
  new RGBELoader().load("/models/char_enviorment.hdr", (texture) => {
    if (signal.aborted) { texture.dispose(); return; }
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.environmentIntensity = 0.8;
  }, undefined, () => { /* Directional lighting remains available without HDR. */ });
}
