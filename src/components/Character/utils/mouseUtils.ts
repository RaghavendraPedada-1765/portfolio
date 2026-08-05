import * as THREE from "three";

export const handleMouseMove = (
  event: MouseEvent,
  setMousePosition: (x: number, y: number) => void
) => {
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  setMousePosition(mouseX, mouseY);
};

export const handleTouchMove = (
  event: TouchEvent,
  setMousePosition: (x: number, y: number) => void
) => {
  const mouseX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
  setMousePosition(mouseX, mouseY);
};

export const handleTouchEnd = (
  setMousePosition: (
    x: number,
    y: number,
    interpolationX: number,
    interpolationY: number
  ) => void
) => {
  setTimeout(() => {
    setMousePosition(0, 0, 0.03, 0.03);
    setTimeout(() => {
      setMousePosition(0, 0, 0.1, 0.2);
    }, 1000);
  }, 2000);
};

export const handleHeadRotation = (
  headBone: THREE.Object3D,
  mouseX: number,
  mouseY: number,
  interpolationX: number,
  interpolationY: number,
  lerp: (x: number, y: number, t: number) => number
) => {
  if (!headBone) return;

  // Use ScrollSmoother-safe scroll detection
  const scrolled =
    (window as any).__gsapScrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0;

  if (scrolled < 300) {
    const maxRotation = Math.PI / 5;
    // Y axis: look left/right
    headBone.rotation.y = lerp(
      headBone.rotation.y,
      mouseX * maxRotation,
      interpolationY
    );
    // X axis: look up/down (clamp between -0.3 and 0.35)
    const targetX = Math.max(-0.3, Math.min(0.35, -mouseY * 0.4));
    headBone.rotation.x = lerp(
      headBone.rotation.x,
      targetX,
      interpolationX
    );
  } else {
    // Reset head to neutral when scrolled away
    headBone.rotation.x = lerp(headBone.rotation.x, 0, 0.03);
    headBone.rotation.y = lerp(headBone.rotation.y, 0, 0.03);
  }
};

