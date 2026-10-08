import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(ScrollTrigger, SplitText);
export default function setSplitText() {
  const media = gsap.matchMedia();
  let disposed = false;
  void document.fonts.ready.then(() => {
    if (disposed) return;
    media.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const splits: SplitText[] = [];
      document.querySelectorAll(".para, .title").forEach((element) => {
        const split = new SplitText(element, { type: "lines,words", linesClass: "split-line" });
        splits.push(split);
        gsap.fromTo(split.words, { y: 30 }, { y: 0, duration: 0.7, stagger: 0.02,
          scrollTrigger: { trigger: element, start: "top 85%", toggleActions: "play none none reverse" } });
      });
      return () => splits.forEach((split) => split.revert());
    });
  });
  return () => { disposed = true; media.revert(); };
}
