import * as THREE from "three";
import gsap from "gsap";

export function setCharTimeline(
  character: THREE.Object3D<THREE.Object3DEventMap> | null,
  camera: THREE.PerspectiveCamera
) {
  if (!character) return;

  if (window.innerWidth > 1024) {
    // ── Timeline 1: Scroll from Landing into About ──
    // Standing Luffy fades out and hides completely so only seated Luffy in About is visible
    const tlLanding = gsap.timeline({
      scrollTrigger: {
        trigger: ".landing-section",
        start: "top top",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    tlLanding
      .fromTo(character.rotation, { y: 0 }, { y: 0.5, duration: 1 }, 0)
      .to(camera.position, { z: 7 }, 0)
      .to(".landing-container", { opacity: 0, y: "30%", duration: 0.6 }, 0)
      .to(
        ".character-model",
        {
          opacity: 0,
          scale: 0.85,
          y: "-15%",
          pointerEvents: "none",
          duration: 0.8,
        },
        0
      )
      .to(".character-rim", { opacity: 0, duration: 0.5 }, 0);

    // ── Timeline 2: Scroll through About into What I Do ──
    // Standing Luffy stays hidden during About, then fades back in for What I Do & remaining sections
    const tlAbout = gsap.timeline({
      scrollTrigger: {
        trigger: ".about-section",
        start: "top 60%",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    tlAbout
      // Stay hidden during About section, then fade in as user scrolls to What I Do
      .fromTo(
        ".character-model",
        { opacity: 0, scale: 0.85, x: "-25%", pointerEvents: "none" },
        {
          opacity: 1,
          scale: 1,
          x: "-28%",
          y: "0%",
          pointerEvents: "auto",
          duration: 1,
        },
        0.5
      )
      .fromTo(
        character.rotation,
        { y: 0.5, x: 0 },
        { y: 0.65, x: 0.04, duration: 1 },
        0.5
      )
      .fromTo(
        ".what-box-in",
        { display: "none", opacity: 0 },
        { display: "grid", opacity: 1, duration: 0.3 },
        0.7
      );

    // ── Timeline 3: What I Do into Career & Work ──
    // Standing Luffy continues through the remaining sections
    const tlWhatIDo = gsap.timeline({
      scrollTrigger: {
        trigger: ".whatIDO",
        start: "top top",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    tlWhatIDo
      .to(
        ".character-model",
        {
          x: "-28%",
          opacity: 0.95,
          duration: 1,
        },
        0
      )
      .to(character.rotation, { y: 0.4, x: -0.02, duration: 1 }, 0);

    // ── Timeline 4: Career section ──
    const tlCareer = gsap.timeline({
      scrollTrigger: {
        trigger: ".career-section",
        start: "top center",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    tlCareer
      .to(
        ".character-model",
        {
          x: "-30%",
          scale: 0.95,
          opacity: 0.9,
          duration: 1,
        },
        0
      )
      .to(character.rotation, { y: 0.35, duration: 1 }, 0);

    // ── Timeline 5: Work / Portfolio section ──
    const tlWork = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top center",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    tlWork
      .to(
        ".character-model",
        {
          x: "-32%",
          scale: 0.9,
          opacity: 0.85,
          duration: 1,
        },
        0
      )
      .to(character.rotation, { y: 0.3, duration: 1 }, 0);
  } else {
    // Mobile: show domain cards on scroll
    const tM2 = gsap.timeline({
      scrollTrigger: {
        trigger: ".what-box-in",
        start: "top 70%",
        end: "bottom top",
      },
    });
    tM2.to(".what-box-in", { display: "grid", opacity: 1, duration: 0.1 }, 0);
  }
}

export function setAllTimeline() {
  const careerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".career-section",
      start: "top 30%",
      end: "100% center",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  careerTimeline
    .fromTo(
      ".career-timeline",
      { maxHeight: "10%" },
      { maxHeight: "100%", duration: 0.5 },
      0
    )
    .fromTo(
      ".career-timeline",
      { opacity: 0 },
      { opacity: 1, duration: 0.1 },
      0
    )
    .fromTo(
      ".career-info-box",
      { opacity: 0 },
      { opacity: 1, stagger: 0.1, duration: 0.5 },
      0
    )
    .fromTo(
      ".career-dot",
      { animationIterationCount: "infinite" },
      {
        animationIterationCount: "1",
        delay: 0.3,
        duration: 0.1,
      },
      0
    );

  if (window.innerWidth > 1024) {
    careerTimeline.fromTo(
      ".career-section",
      { y: 0 },
      { y: "20%", duration: 0.5, delay: 0.2 },
      0
    );
  } else {
    careerTimeline.fromTo(
      ".career-section",
      { y: 0 },
      { y: 0, duration: 0.5, delay: 0.2 },
      0
    );
  }
}
