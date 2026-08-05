import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";

// Model file target
const MODEL_PATH = "/models/monkey_d_luffy_damage_-_one_piece.glb";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        loader.load(
          MODEL_PATH,
          async (gltf) => {
            const character = gltf.scene;

            await renderer.compileAsync(character, camera, scene);

            // Compute bounding box to auto-center & scale properly
            const box = new THREE.Box3().setFromObject(character);
            const size = new THREE.Vector3();
            box.getSize(size);

            const maxDim = Math.max(size.x, size.y, size.z);
            const targetHeight = 1.85;
            const scale = maxDim > 0 ? targetHeight / maxDim : 1;
            character.scale.setScalar(scale);

            // Center and ground the character
            const scaledBox = new THREE.Box3().setFromObject(character);
            const scaledCenter = new THREE.Vector3();
            scaledBox.getCenter(scaledCenter);
            character.position.sub(scaledCenter);
            character.position.y -= 0.85;

            character.traverse((child: any) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                  const mat = child.material as THREE.MeshStandardMaterial;
                  if (mat.isMeshStandardMaterial) {
                    mat.envMapIntensity = 1.2;
                    mat.needsUpdate = true;
                  }
                }
              }
            });

            scene.add(character);

            resolve(gltf);
            setCharTimeline(character, camera);
            setAllTimeline();
            dracoLoader.dispose();
          },
          undefined,
          (error) => {
            console.error("Error loading model:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
