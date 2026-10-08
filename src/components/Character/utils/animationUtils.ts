import * as THREE from "three";
import { FBXAsGLTF } from "./character";
export default function setAnimations(asset: FBXAsGLTF) {
  const mixer = new THREE.AnimationMixer(asset.scene);
  const clip = asset.animations.find((item) => /jump|mixamo|landing/i.test(item.name)) ?? asset.animations[0];
  const action = clip ? mixer.clipAction(clip) : null;
  action?.setLoop(THREE.LoopOnce, 1);
  if (action) action.clampWhenFinished = true;
  let jumping = false;
  let impactTimer: number | undefined;
  const finished = () => { jumping = false; };
  mixer.addEventListener("finished", finished);
  return {
    mixer,
    getIsLandingJumping: () => jumping,
    triggerJump: (onImpact?: () => void) => {
      if (jumping || !action || !clip) return;
      jumping = true;
      action.reset().play();
      clearTimeout(impactTimer);
      impactTimer = window.setTimeout(() => onImpact?.(), Math.max(200, clip.duration * 580));
    },
    dispose: () => {
      clearTimeout(impactTimer);
      mixer.removeEventListener("finished", finished);
      mixer.stopAllAction(); mixer.uncacheRoot(asset.scene);
    },
  };
}
