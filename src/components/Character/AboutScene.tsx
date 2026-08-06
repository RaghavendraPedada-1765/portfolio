import { useEffect, useRef } from "react";
import * as THREE from "three";
import loadAboutCharacter from "./utils/aboutCharacter";

const AboutScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // ── Scene ──
    const scene = new THREE.Scene();

    // ── Camera — slightly elevated, looking at seated character ──
    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    camera.position.set(0, 0.4, 3.2);
    camera.lookAt(0, 0, 0);

    // ── Clock for animation ──
    const clock = new THREE.Clock();
    let mixer: THREE.AnimationMixer | null = null;
    let animFrameId: number;
    let isDisposed = false;

    // ── Load character ──
    loadAboutCharacter(renderer, scene, camera).then((asset) => {
      if (isDisposed || !asset) return;
      mixer = asset.mixer;
    });

    // ── Render loop ──
    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (mixer) mixer.update(delta);

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ──
    const handleResize = () => {
      if (!container) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", handleResize);

    // ── Cleanup ──
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="about-canvas-col"
      aria-hidden="true"
    />
  );
};

export default AboutScene;
