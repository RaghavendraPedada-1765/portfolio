import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import loadAboutCharacter from "./utils/aboutCharacter";
import setLighting from "./utils/lighting";
import handleResize from "./utils/resizeUtils";
import { disposeObject } from "./utils/dispose";
const AboutScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const controller = new AbortController();
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); }
    catch { setFailed(true); return; }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.4, 3.2); camera.lookAt(0, 0, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);
    handleResize(renderer, camera, container);
    setLighting(scene, controller.signal);
    const resize = new ResizeObserver(() => handleResize(renderer, camera, container));
    resize.observe(container);
    let visible = true;
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    visibility.observe(container);
    let mixer: THREE.AnimationMixer | undefined;
    let frame = 0;
    const clock = new THREE.Clock();
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      if (!visible || document.hidden) return;
      if (!motion.matches) mixer?.update(delta);
      renderer.render(scene, camera);
    };
    animate();
    const lost = (event: Event) => { event.preventDefault(); setFailed(true); cancelAnimationFrame(frame); };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    void loadAboutCharacter(renderer, scene, camera, controller.signal).then((asset) => {
      if (controller.signal.aborted) {
        if (asset) { asset.mixer.stopAllAction(); disposeObject(asset.scene); }
        return;
      }
      if (!asset) { setFailed(true); return; }
      mixer = asset.mixer; setReady(true);
    });
    return () => {
      controller.abort(); cancelAnimationFrame(frame); resize.disconnect(); visibility.disconnect();
      mixer?.stopAllAction(); if (mixer) mixer.uncacheRoot(mixer.getRoot());
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      disposeObject(scene); renderer.dispose(); renderer.domElement.remove();
    };
  }, []);
  return <div ref={mountRef} className="about-scene" data-scene-state={failed ? "failed" : ready ? "ready" : "loading"} aria-hidden="true">
    {failed && <div className="scene-fallback">☠</div>}
  </div>;
};
export default AboutScene;
