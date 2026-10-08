import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import handleResize from "./utils/resizeUtils";
import setAnimations from "./utils/animationUtils";
import { disposeObject } from "./utils/dispose";
import { setCharTimeline } from "../utils/GsapScroll";
import { useLoading } from "../../context/loadingContext";

const Scene = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const { setLoading } = useLoading();
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const controller = new AbortController();
    const { signal } = controller;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); }
    catch { setFailed(true); setLoading(100); return; }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(20, 1, 0.1, 100);
    camera.position.set(0, 0.3, 5.5); camera.lookAt(0, 0.1, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    handleResize(renderer, camera, container);
    setLighting(scene, signal);
    const resize = new ResizeObserver(() => handleResize(renderer, camera, container));
    resize.observe(container);
    const media = gsap.matchMedia();
    let animations: ReturnType<typeof setAnimations> | undefined;
    // Scroll owns the parent transform; pointer motion owns the child model.
    const scrollGroup = new THREE.Group(); scene.add(scrollGroup);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide, transparent: true, opacity: 0, blending: THREE.AdditiveBlending });
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.1, 0.5, 32), ringMaterial);
    ring.rotation.x = -Math.PI / 2; ring.position.y = -0.84;
    scrollGroup.add(ring);
    let impact = 1;
    let shake = 0;
    let model: THREE.Group | undefined;
    let frame = 0;
    let visible = true;
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    visibility.observe(container);
    const pointer = { x: 0, y: 0 };
    const onPointer = (event: PointerEvent) => {
      pointer.x = event.clientX / window.innerWidth * 2 - 1;
      pointer.y = event.clientY / window.innerHeight * 2 - 1;
    };
    document.addEventListener("pointermove", onPointer);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const jump = () => { if (!motion.matches) animations?.triggerJump(() => { impact = 0; shake = 0.08; }); };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); jump(); }
    };
    container.addEventListener("click", jump);
    container.addEventListener("keydown", key);
    const lost = (event: Event) => {
      event.preventDefault(); setFailed(true); setLoading(100);
      cancelAnimationFrame(frame);
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    const clock = new THREE.Clock();
    let elapsed = 0;
    const animate = () => {
      if (signal.aborted) return;
      frame = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      if (!visible || document.hidden) return;
      elapsed += delta;
      if (!motion.matches) {
        animations?.mixer.update(delta);
        if (model && !animations?.getIsLandingJumping()) {
          model.position.y = -0.85 + Math.sin(elapsed * 0.7) * 0.02;
          model.rotation.y = THREE.MathUtils.lerp(model.rotation.y, pointer.x * 0.3, 0.05);
          model.rotation.x = THREE.MathUtils.lerp(model.rotation.x, pointer.y * 0.15, 0.05);
        }
      }
      if (impact < 1) {
        impact = Math.min(1, impact + delta * 2.2);
        ring.scale.setScalar(0.2 + impact * 3.5);
        ringMaterial.opacity = 0.9 * (1 - impact);
      }
      // Apply shake only for this render, preserving GSAP's camera position.
      const cameraX = camera.position.x, cameraY = camera.position.y;
      if (!motion.matches && shake > 0.001) {
        camera.position.x += (Math.random() - 0.5) * shake;
        camera.position.y += (Math.random() - 0.5) * shake;
        shake *= 0.88;
      }
      renderer.render(scene, camera);
      camera.position.x = cameraX; camera.position.y = cameraY;
    };
    animate();
    const timeout = window.setTimeout(() => {
      controller.abort(); setFailed(true); setLoading(100); cancelAnimationFrame(frame);
    }, 30000);
    void setCharacter(renderer, scene, camera, signal, setLoading).loadCharacter().then((asset) => {
      clearTimeout(timeout);
      if (signal.aborted) {
        if (asset) disposeObject(asset.scene);
        return;
      }
      setLoading(100);
      if (!asset) { setFailed(true); return; }
      setReady(true);
      model = asset.scene; scrollGroup.add(model);
      animations = setAnimations(asset);
      media.add("(min-width: 1025px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.to(".character-rim", { y: "55%", opacity: 1, duration: 2 });
        setCharTimeline(scrollGroup, camera);
      });
      ScrollTrigger.refresh();
      jump();
    });
    return () => {
      clearTimeout(timeout); controller.abort(); cancelAnimationFrame(frame);
      resize.disconnect(); visibility.disconnect(); media.revert(); animations?.dispose();
      document.removeEventListener("pointermove", onPointer);
      container.removeEventListener("click", jump); container.removeEventListener("keydown", key);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      disposeObject(scene); renderer.dispose(); renderer.domElement.remove();
    };
  }, [setLoading]);
  return <div className="character-container">
    <div className="character-model" ref={mountRef} data-scene-state={failed ? "failed" : ready ? "ready" : "loading"} role="button" tabIndex={0} aria-label="Animate Luffy character">
      <div className="character-rim" />
      {failed && <div className="scene-fallback">☠<span>Welcome aboard</span></div>}
    </div>
  </div>;
};
export default Scene;
