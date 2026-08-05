import * as THREE from "three";
import { RGBELoader } from "three-stdlib";
import { gsap } from "gsap";

const setLighting = (scene: THREE.Scene) => {
  // Key light — warm front light for VRoid face
  const keyLight = new THREE.DirectionalLight(0xffeedd, 0);
  keyLight.intensity = 0;
  keyLight.position.set(2, 3, 4);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  scene.add(keyLight);

  // Fill light — cool purple from left
  const fillLight = new THREE.DirectionalLight(0xa78bfa, 0);
  fillLight.intensity = 0;
  fillLight.position.set(-3, 1, 2);
  scene.add(fillLight);

  // Rim light — sky blue backlight
  const rimLight = new THREE.DirectionalLight(0x38bdf8, 0);
  rimLight.intensity = 0;
  rimLight.position.set(0, -1, -4);
  scene.add(rimLight);

  // Ambient
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  // HDR environment for reflections
  new RGBELoader()
    .setPath("/models/")
    .load("char_enviorment.hdr?v=2", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0;
      scene.environmentRotation.set(5.76, 85.85, 1);
    });

  // No screen light for VRoid (no screenlight mesh)
  function setPointLight(_screenLight: any) {
    // noop for VRoid model
  }

  const duration = 2;
  const ease = "power2.inOut";

  function turnOnLights() {
    gsap.to(scene, {
      environmentIntensity: 0.8,
      duration: duration,
      ease: ease,
    });
    gsap.to(keyLight, {
      intensity: 1.5,
      duration: duration,
      ease: ease,
    });
    gsap.to(fillLight, {
      intensity: 0.8,
      duration: duration + 0.5,
      ease: ease,
    });
    gsap.to(rimLight, {
      intensity: 0.6,
      duration: duration + 1,
      ease: ease,
    });
    gsap.to(".character-rim", {
      y: "55%",
      opacity: 1,
      delay: 0.2,
      duration: 2,
    });
  }

  return { setPointLight, turnOnLights };
};

export default setLighting;
