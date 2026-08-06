import * as THREE from "three";
import { GLTFLoader, DRACOLoader } from "three-stdlib";
import { RGBELoader } from "three-stdlib";

const TYPING_GLB = "/models/luffy_typing.glb";

export type AboutAsset = {
  scene: THREE.Group;
  mixer: THREE.AnimationMixer;
};

const loadAboutCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
): Promise<AboutAsset | null> => {
  const gltfLoader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  gltfLoader.setDRACOLoader(dracoLoader);

  // Setup lighting for About scene
  const keyLight = new THREE.DirectionalLight(0xffeedd, 2.0);
  keyLight.position.set(2, 3, 4);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xa78bfa, 1.0);
  fillLight.position.set(-3, 1, 2);
  scene.add(fillLight);

  // Screen glow — blue-ish light from front (simulating monitor)
  const screenLight = new THREE.PointLight(0x38bdf8, 1.5, 6);
  screenLight.position.set(0, 1.2, 2);
  scene.add(screenLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  // HDR environment for reflections
  new RGBELoader()
    .setPath("/models/")
    .load("char_enviorment.hdr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0.7;
    });

  const processModel = async (
    characterObj: THREE.Group,
    clips: THREE.AnimationClip[]
  ): Promise<AboutAsset> => {
    // Auto-scale
    const box = new THREE.Box3().setFromObject(characterObj);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetHeight = 1.9;
    const scale = maxDim > 0 ? targetHeight / maxDim : 1;
    characterObj.scale.setScalar(scale);

    // Center and position (seated character, slightly lower)
    const scaledBox = new THREE.Box3().setFromObject(characterObj);
    const center = new THREE.Vector3();
    scaledBox.getCenter(center);
    characterObj.position.sub(center);
    characterObj.position.y = -0.95;

    // Materials
    characterObj.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const mats = Array.isArray(child.material)
          ? child.material
          : [child.material];
        mats.forEach((mat: THREE.MeshStandardMaterial) => {
          if (mat.isMeshStandardMaterial) {
            mat.envMapIntensity = 1.0;
            mat.needsUpdate = true;
          }
        });
      }
    });

    scene.add(characterObj);
    await renderer.compileAsync(characterObj, camera, scene);

    // Setup animation mixer and loop first clip
    const mixer = new THREE.AnimationMixer(characterObj);
    if (clips.length > 0) {
      const action = mixer.clipAction(clips[0]);
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.play();
      console.log(`[AboutLuffy] Playing animation: "${clips[0].name}" (${clips[0].duration.toFixed(2)}s)`);
    } else {
      console.warn("[AboutLuffy] No animation clips found in model.");
    }

    return { scene: characterObj, mixer };
  };

  return new Promise((resolve) => {
    gltfLoader.load(
      TYPING_GLB,
      async (gltf) => {
        console.log(`[AboutLuffy] ✅ Loaded luffy_typing.glb — ${gltf.animations.length} animation(s)`);
        const result = await processModel(gltf.scene, gltf.animations ?? []);
        resolve(result);
      },
      undefined,
      (err) => {
        console.error("[AboutLuffy] Failed to load luffy_typing.glb:", err);
        resolve(null);
      }
    );
  });
};

export default loadAboutCharacter;
