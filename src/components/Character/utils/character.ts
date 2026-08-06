import * as THREE from "three";
import { GLTFLoader, DRACOLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";

const GLB_JUMP_PATH = "/models/luffy_jump.glb";
const GLB_ORIGINAL_PATH = "/models/monkey_d_luffy_damage_-_one_piece.glb";

export type FBXAsGLTF = {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
};

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const gltfLoader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  gltfLoader.setDRACOLoader(dracoLoader);

  const processModel = async (
    characterObj: THREE.Group,
    clips: THREE.AnimationClip[]
  ): Promise<FBXAsGLTF> => {
    // ── Auto-scale to fit scene ──
    const box = new THREE.Box3().setFromObject(characterObj);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetHeight = 1.85;
    const scale = maxDim > 0 ? targetHeight / maxDim : 1;
    characterObj.scale.setScalar(scale);

    // ── Center & ground character ──
    const scaledBox = new THREE.Box3().setFromObject(characterObj);
    const center = new THREE.Vector3();
    scaledBox.getCenter(center);
    characterObj.position.sub(center);
    characterObj.position.y = -0.85;

    // ── Configure materials and lighting intensity ──
    characterObj.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          const mats = Array.isArray(child.material)
            ? child.material
            : [child.material];
          mats.forEach((mat: THREE.MeshStandardMaterial) => {
            if (mat.isMeshStandardMaterial) {
              mat.envMapIntensity = 1.2;
              mat.needsUpdate = true;
            }
          });
        }
      }
    });

    scene.add(characterObj);
    await renderer.compileAsync(characterObj, camera, scene);

    console.log(
      `[Luffy] Model loaded with ${clips.length} animation(s):`,
      clips.map((c) => `${c.name} (${c.duration.toFixed(2)}s)`)
    );

    setCharTimeline(characterObj, camera);
    setAllTimeline();

    return { scene: characterObj, animations: clips };
  };

  const loadCharacter = (): Promise<FBXAsGLTF | null> => {
    return new Promise((resolve) => {
      // Primary: luffy_jump.glb (has Mixamo jump animation + textures, needs Draco WASM)
      gltfLoader.load(
        GLB_JUMP_PATH,
        async (gltf) => {
          console.log("[Luffy] ✅ Loaded luffy_jump.glb with Draco decoding.");
          const result = await processModel(gltf.scene, gltf.animations ?? []);
          resolve(result);
        },
        undefined,
        (err) => {
          console.warn("[Luffy] luffy_jump.glb failed, falling back to static model:", err);
          gltfLoader.load(
            GLB_ORIGINAL_PATH,
            async (gltf) => {
              const result = await processModel(gltf.scene, gltf.animations ?? []);
              resolve(result);
            },
            undefined,
            (fallbackErr) => {
              console.error("[Luffy] Both GLB models failed:", fallbackErr);
              resolve(null);
            }
          );
        }
      );
    });
  };

  return { loadCharacter };
};

export default setCharacter;
