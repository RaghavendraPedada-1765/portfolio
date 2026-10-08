import gsap from "gsap";
// Animate containers, leaving React-owned text intact during the language change.
export function initialFX() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  const context = gsap.context(() => {
    gsap.fromTo(".landing-intro, .landing-info", { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 });
  });
  return () => context.revert();
}
