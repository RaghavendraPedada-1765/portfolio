import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { disposeObject } from "./dispose";
export async function loadModel(url: string, renderer: THREE.WebGLRenderer,
  scene: THREE.Scene, camera: THREE.PerspectiveCamera, signal: AbortSignal,
  height: number, y: number, onProgress?: (percent: number) => void) {
  const draco = new DRACOLoader().setDecoderPath("/draco/");
  const loader = new GLTFLoader().setDRACOLoader(draco);
  let model: THREE.Group | undefined;
  try {
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error(`Model request failed: ${response.status}`);
    const total = Number(response.headers.get("content-length"));
    const chunks: Uint8Array[] = [];
    let received = 0;
    if (!response.body) throw new Error("Model response has no body");
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value); received += value.length;
      if (total > 0) onProgress?.(Math.min(90, Math.round(received / total * 90)));
    }
    const buffer = new Uint8Array(received);
    let offset = 0;
    chunks.forEach((chunk) => { buffer.set(chunk, offset); offset += chunk.length; });
    const asset = await loader.parseAsync(buffer.buffer, "/models/");
    model = asset.scene;
    signal.throwIfAborted();
    const size = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());
    model.scale.setScalar(height / Math.max(size.x, size.y, size.z, 0.001));
    const center = new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3());
    model.position.sub(center); model.position.y = y;
    model.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => {
          if (material instanceof THREE.MeshStandardMaterial) material.envMapIntensity = 1;
        });
      }
    });
    scene.add(model);
    await renderer.compileAsync(model, camera, scene);
    signal.throwIfAborted();
    return { scene: model, animations: asset.animations };
  } catch (error) {
    if (model) disposeObject(model);
    if (!signal.aborted) console.warn("Unable to load character", error);
    return null;
  } finally { draco.dispose(); }
}
