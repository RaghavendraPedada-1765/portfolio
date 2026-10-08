import * as THREE from "three";
export default function handleResize(renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera, container: HTMLElement) {
  const { width, height } = container.getBoundingClientRect();
  if (!width || !height) return;
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
