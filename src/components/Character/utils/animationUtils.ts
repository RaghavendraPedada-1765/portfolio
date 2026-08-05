import * as THREE from "three";
import { GLTF } from "three-stdlib";

const setAnimations = (gltf: GLTF) => {
  const character = gltf.scene;
  const mixer = new THREE.AnimationMixer(character);

  // Play the "blink" animation on loop
  if (gltf.animations && gltf.animations.length > 0) {
    const blinkClip = THREE.AnimationClip.findByName(gltf.animations, "blink");
    if (blinkClip) {
      const blinkAction = mixer.clipAction(blinkClip);
      blinkAction.setLoop(THREE.LoopRepeat, Infinity);
      blinkAction.timeScale = 1;
      blinkAction.play();
    }
  }

  function startIntro() {
    // Fade-in all meshes
    character.traverse((child: any) => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material)
          ? child.material
          : [child.material];
        mats.forEach((mat: THREE.MeshStandardMaterial) => {
          if (mat.isMeshStandardMaterial !== undefined) {
            mat.transparent = true;
            mat.opacity = 0;
            mat.needsUpdate = true;
            let opacity = 0;
            const fadeIn = setInterval(() => {
              opacity += 0.025;
              mat.opacity = Math.min(opacity, 1);
              if (opacity >= 1) {
                mat.transparent = false;
                clearInterval(fadeIn);
              }
            }, 16);
          }
        });
      }
    });
  }

  function hover(_gltf: GLTF, _hoverDiv: HTMLDivElement) {
    // Head tracking handled in Scene.tsx via head neck upper bone
    return () => {};
  }

  return { mixer, startIntro, hover };
};

export default setAnimations;
