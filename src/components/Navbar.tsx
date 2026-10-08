import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { MdEmail } from "react-icons/md";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import "./styles/Navbar.css";
import { useLoading } from "../context/loadingContext";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { isLoading } = useLoading();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(min-width: 1025px) and (prefers-reduced-motion: no-preference)", () => {
      const smoother = ScrollSmoother.create({ wrapper: "#smooth-wrapper", content: "#smooth-content", smooth: 1.7, effects: true });
      return () => smoother.kill();
    });
    return () => media.revert();
  }, []);
  useEffect(() => {
    ScrollSmoother.get()?.paused(isLoading || menuOpen);
    const previous = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : isLoading ? "hidden" : "auto";
    return () => { document.body.style.overflow = previous; };
  }, [isLoading, menuOpen]);
  useEffect(() => {
    if (!menuOpen) return;
    const drawer = drawerRef.current!;
    const controls = [buttonRef.current!, ...Array.from(drawer.querySelectorAll<HTMLElement>("a[href], button"))];
    controls[1]?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
      if (event.key === "Tab") {
        const index = controls.indexOf(document.activeElement as HTMLElement);
        const next = event.shiftKey ? (index <= 0 ? controls.length - 1 : index - 1) : (index + 1) % controls.length;
        event.preventDefault(); controls[next].focus();
      }
    };
    const resize = () => { if (window.innerWidth > 1024) setMenuOpen(false); };
    window.addEventListener("keydown", key); window.addEventListener("resize", resize);
    const button = buttonRef.current;
    return () => {
      window.removeEventListener("keydown", key); window.removeEventListener("resize", resize);
      button?.focus();
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { href: "#about",   label: "ABOUT"   },
    { href: "#work",    label: "WORK"    },
    { href: "#contact", label: "CONTACT" },
  ];

  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title navbar-jolly-logo" data-cursor="disable">
          <img src="/images/jolly-roger.png" alt="Jolly Roger" className="jolly-icon" />
          <span className="jolly-text">RP</span>
        </a>
        <a
          href="https://www.linkedin.com/in/raghavendra-pedada-baa349356/"
          className="navbar-connect"
          data-cursor="disable"
          target="_blank"
          rel="noreferrer"
        >
          linkedin.com/in/raghavendra-pedada
        </a>

        {/* Desktop nav */}
        <ul className="desktop-nav">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={(event) => {
                const smoother = ScrollSmoother.get();
                if (smoother) { event.preventDefault(); smoother.scrollTo(l.href, true, "top top"); }
              }}>
                <HoverLinks text={l.label} />
              </a>
            </li>
          ))}
          <li>
            <a
              href="/RAGHAVENDRA_MASTER.pdf"
              download="Raghavendra_Pedada_Resume.pdf"
              className="resume-btn"
              data-cursor="disable"
            >
              RESUME ↓
            </a>
          </li>
        </ul>

        {/* Hamburger button — mobile only */}
        <button
          ref={buttonRef}
          aria-controls="mobile-menu"
          className={`hamburger${menuOpen ? " hamburger--open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      <div
        id="mobile-menu"
        ref={drawerRef}
        style={{ visibility: menuOpen ? "visible" : "hidden" }}
        className={`nav-drawer${menuOpen ? " nav-drawer--open" : ""}`}
        aria-hidden={!menuOpen}
      >
        {/* Backdrop */}
        <div className="nav-drawer__backdrop" onClick={closeMenu} />

        {/* Slide-in panel */}
        <nav className="nav-drawer__panel">
          <ul className="nav-drawer__links">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={closeMenu}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="/RAGHAVENDRA_MASTER.pdf"
            download="Raghavendra_Pedada_Resume.pdf"
            className="nav-drawer__resume"
            onClick={closeMenu}
          >
            RESUME ↓
          </a>

          {/* Social links inside drawer */}
          <div className="nav-drawer__socials">
            <a href="https://github.com/RaghavendraPedada-1765" target="_blank" rel="noreferrer" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/raghavendra-pedada-baa349356/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="mailto:raghavendrapedadaa@gmail.com" aria-label="Email">
              <MdEmail size={22} />
            </a>
          </div>

          <p className="nav-drawer__copy">© 2026 Raghavendra Pedada</p>
        </nav>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
