import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter, { FBXAsGLTF } from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  const [, setChar] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    if (canvasDiv.current) {
      let rect = canvasDiv.current.getBoundingClientRect();
      let container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = sceneRef.current;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      canvasDiv.current.appendChild(renderer.domElement);

      // Camera tuned for Luffy — full body standing
      const camera = new THREE.PerspectiveCamera(20, aspect, 0.1, 1000);
      const baseCameraPos = new THREE.Vector3(0, 0.3, 5.5);
      camera.position.copy(baseCameraPos);
      camera.lookAt(0, 0.1, 0);
      camera.zoom = 1;
      camera.updateProjectionMatrix();

      // ── Ground Landing Shockwave Ring Mesh ──
      const ringGeo = new THREE.RingGeometry(0.1, 0.5, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      const shockwaveRing = new THREE.Mesh(ringGeo, ringMat);
      shockwaveRing.rotation.x = -Math.PI / 2;
      shockwaveRing.position.set(0, -0.84, 0);
      scene.add(shockwaveRing);

      let shockwaveProgress = 1; // 0..1 fade
      let cameraShakeIntensity = 0;

      const triggerLandingImpact = () => {
        // Trigger ground shockwave
        shockwaveProgress = 0;
        shockwaveRing.scale.set(0.2, 0.2, 0.2);
        ringMat.opacity = 0.9;

        // Camera impact shake
        cameraShakeIntensity = 0.08;
      };

      // ── VRoid head bone ──
      let headBone: THREE.Object3D | null = null;
      let mixer: THREE.AnimationMixer;
      let characterObj: THREE.Object3D | null = null;
      let triggerJumpFn: ((onImpact?: () => void, onComplete?: () => void) => void) | null = null;

      // Procedural idle breathing
      let breathTime = 0;

      const clock = new THREE.Clock();
      const light = setLighting(scene);
      let progress = setProgress((value) => setLoading(value));
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      let isLandingJumpingFn = () => false;

      loadCharacter().then((asset: FBXAsGLTF | null) => {
        if (asset) {
          const animations = setAnimations(asset);
          isLandingJumpingFn = animations.getIsLandingJumping;
          triggerJumpFn = animations.triggerJump;
          hoverDivRef.current && animations.hover(asset, hoverDivRef.current);
          mixer = animations.mixer;
          characterObj = asset.scene;
          setChar(characterObj);

          // Use exact runtime bone name (Three.js replaces spaces with underscores)
          headBone = characterObj.getObjectByName("head_neck_upper_216") || null;
          console.log("[Luffy] headBone:", !!headBone, headBone?.name);

          // ── Pose Luffy: arms relaxed at sides ──
          characterObj.traverse((bone: THREE.Object3D) => {
            const n = bone.name;
            if (n.includes("shoulder_1.L") || n.includes("shoulder_1L")) bone.rotation.z = -1.0;
            if (n.includes("shoulder_1.R") || n.includes("shoulder_1R")) bone.rotation.z =  1.0;
            if (n.includes("elbow.L")     || n.includes("elbow_L"))      bone.rotation.y =  0.12;
            if (n.includes("elbow.R")     || n.includes("elbow_R"))      bone.rotation.y = -0.12;
          });

          progress.loaded().then(() => {
            setTimeout(() => {
              light.turnOnLights();
              animations.startIntro(camera, triggerLandingImpact);
            }, 300);
          });

          window.addEventListener("resize", () =>
            handleResize(renderer, camera, canvasDiv, characterObj!)
          );
        }
      });

      // ── Click / Tap to Trigger Superhero Jump & Land ──
      const onCanvasClick = () => {
        if (triggerJumpFn && !isLandingJumpingFn()) {
          triggerJumpFn(triggerLandingImpact);
        }
      };

      const canvasElem = canvasDiv.current;
      if (canvasElem) {
        canvasElem.style.cursor = "pointer";
        canvasElem.addEventListener("click", onCanvasClick);
      }

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => (mouse = { x, y }));
      };

      let debounce: number | undefined;
      const onTouchStart = (event: TouchEvent) => {
        const element = event.target as HTMLElement;
        debounce = setTimeout(() => {
          element?.addEventListener("touchmove", (e: TouchEvent) =>
            handleTouchMove(e, (x, y) => (mouse = { x, y }))
          );
        }, 200);
      };

      const onTouchEnd = () => {
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      document.addEventListener("mousemove", (event) => {
        onMouseMove(event);
      });

      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart);
        landingDiv.addEventListener("touchend", onTouchEnd);
      }

      const animate = () => {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        breathTime += delta;

        const isJumping = isLandingJumpingFn();

        // ── Shockwave animation loop ──
        if (shockwaveProgress < 1) {
          shockwaveProgress += delta * 2.2;
          const s = 0.2 + shockwaveProgress * 3.5;
          shockwaveRing.scale.set(s, s, s);
          ringMat.opacity = Math.max(0, 0.9 * (1 - shockwaveProgress));
        }

        // ── Camera impact shake loop ──
        if (cameraShakeIntensity > 0.001) {
          camera.position.x = (Math.random() - 0.5) * cameraShakeIntensity;
          camera.position.y = baseCameraPos.y + (Math.random() - 0.5) * cameraShakeIntensity;
          cameraShakeIntensity *= 0.88;
        } else {
          camera.position.x = 0;
          camera.position.y = baseCameraPos.y;
        }

        // ── Procedural idle: gentle breathing + float (only when not performing hero jump) ──
        if (characterObj && !isJumping) {
          // Subtle floating up/down (breathing idle)
          characterObj.position.y =
            -0.85 + Math.sin(breathTime * 0.7) * 0.02;
          characterObj.rotation.z = Math.sin(breathTime * 0.4) * 0.004;
        }

        // ── Mouse tracking (Head bone if available, else subtle body tilt) ──
        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
        } else if (characterObj && !isJumping) {
          // Model level subtle mouse follow
          characterObj.rotation.y = THREE.MathUtils.lerp(
            characterObj.rotation.y,
            mouse.x * 0.3,
            0.05
          );
          characterObj.rotation.x = THREE.MathUtils.lerp(
            characterObj.rotation.x,
            -mouse.y * 0.15,
            0.05
          );
        }

        if (mixer) {
          mixer.update(delta);
        }

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        clearTimeout(debounce);
        ringGeo.dispose();
        ringMat.dispose();
        if (canvasElem) {
          canvasElem.removeEventListener("click", onCanvasClick);
        }
        scene.clear();
        renderer.dispose();
        window.removeEventListener("resize", () =>
          handleResize(renderer, camera, canvasDiv, characterObj!)
        );
        if (canvasDiv.current) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
        if (landingDiv) {
          document.removeEventListener("mousemove", onMouseMove);
          landingDiv.removeEventListener("touchstart", onTouchStart);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }
      };
    }
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
