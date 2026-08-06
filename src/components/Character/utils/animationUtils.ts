import * as THREE from "three";
import { FBXAsGLTF } from "./character";

const setAnimations = (asset: FBXAsGLTF) => {
  const character = asset.scene;
  const mixer = new THREE.AnimationMixer(character);
  let isLandingJumping = false;
  let impactTimer: number | null = null;

  // ── Find the Mixamo jump clip ──
  let jumpAction: THREE.AnimationAction | null = null;
  let clipDuration = 2.0;

  if (asset.animations && asset.animations.length > 0) {
    const clips = asset.animations;
    const jumpClip =
      THREE.AnimationClip.findByName(clips, "mixamo.com") ||
      THREE.AnimationClip.findByName(clips, "jump") ||
      THREE.AnimationClip.findByName(clips, "Jump") ||
      THREE.AnimationClip.findByName(clips, "landing") ||
      THREE.AnimationClip.findByName(clips, "Landing") ||
      clips[0]; // fallback: first clip

    if (jumpClip) {
      clipDuration = jumpClip.duration;
      console.log(
        "[Luffy] Using animation clip:",
        jumpClip.name,
        `(${clipDuration.toFixed(2)}s)`
      );
      jumpAction = mixer.clipAction(jumpClip);
      jumpAction.setLoop(THREE.LoopOnce, 1);
      jumpAction.clampWhenFinished = true;
    }
  }

  function triggerJump(onImpact?: () => void, onComplete?: () => void) {
    if (isLandingJumping) return; // Prevent double trigger while jumping
    isLandingJumping = true;

    if (impactTimer) {
      clearTimeout(impactTimer);
      impactTimer = null;
    }

    if (jumpAction) {
      jumpAction.stop();
      jumpAction.reset();
      jumpAction.fadeIn(0.1);
      jumpAction.play();

      // Impact timing: ~60% into jump clip (feet touch ground)
      const impactDelayMs = Math.max(200, clipDuration * 1000 * 0.58);
      impactTimer = window.setTimeout(() => {
        if (onImpact) onImpact();
      }, impactDelayMs);

      const onFinished = (e: THREE.Event) => {
        if ((e as any).action === jumpAction) {
          mixer.removeEventListener("finished", onFinished as any);
          isLandingJumping = false;
          if (onComplete) onComplete();
        }
      };
      mixer.addEventListener("finished", onFinished as any);
    } else {
      console.warn("[Luffy] No jump clip found — skipping animation.");
      if (onImpact) onImpact();
      isLandingJumping = false;
      if (onComplete) onComplete();
    }
  }

  function startIntro(
    _camera?: THREE.PerspectiveCamera,
    onImpact?: () => void,
    onComplete?: () => void
  ) {
    triggerJump(onImpact, onComplete);
  }

  // Stub — head tracking handled in Scene.tsx
  function hover(_asset: FBXAsGLTF, _hoverDiv: HTMLDivElement) {
    return () => {};
  }

  return {
    mixer,
    startIntro,
    triggerJump,
    hover,
    getIsLandingJumping: () => isLandingJumping,
  };
};

export default setAnimations;
