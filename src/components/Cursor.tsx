import { useEffect, useRef } from "react";
import "./styles/Cursor.css";
const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) return;
    const move = (event: PointerEvent) => {
      cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
      const target = event.target;
      cursor.classList.toggle("cursor-disable", target instanceof Element && !!target.closest("a, button, [data-cursor='disable']"));
    };
    document.addEventListener("pointermove", move);
    return () => document.removeEventListener("pointermove", move);
  }, []);
  return <div className="cursor-main" ref={cursorRef} aria-hidden="true" />;
};
export default Cursor;
