import { PropsWithChildren, useState, useEffect, useRef } from "react";
import { useLoading } from "../context/LoadingProvider";
import "./styles/Landing.css";

/* ── Katakana scramble character pool ── */
const SCRAMBLE_CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン！？・＊#@%&";

/* ── Text scramble hook ── */
function useScramble(target: string, active: boolean, duration = 900) {
  const [display, setDisplay] = useState(target);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) {
      setDisplay(target);
      return;
    }
    let frame = 0;
    const totalFrames = Math.round(duration / 40);
    intervalRef.current = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const scrambled = target
        .split("")
        .map((ch, i) => {
          if (ch === " " || ch === "·" || ch === "-") return ch;
          if (i / target.length < progress) return ch;
          return SCRAMBLE_CHARS[
            Math.floor(Math.random() * SCRAMBLE_CHARS.length)
          ];
        })
        .join("");
      setDisplay(scrambled);
      if (frame >= totalFrames) {
        clearInterval(intervalRef.current!);
        setDisplay(target);
      }
    }, 40);
    return () => clearInterval(intervalRef.current!);
  }, [active, target, duration]);

  return display;
}

/* ── Japanese ↔ English content ── */
const JP = {
  hello:   "こんにちは、私は",
  name1:   "ラグハヴェンドラ",
  name2:   "ペダダ",
  class:   "2027年卒業",
  dept:    "CSE · ICB",
  crew:    "麦わら帽子開発クルー",
  cse:     "CSE",
  student: "学生",
  full:    "フル",
  stack:   "-スタック",
  python:  "Python",
  react:   "リアクト",
  fastapi: "FastAPI",
  solidity:"ソリディティ",
  arduino: "アルドゥイーノ",
};

const EN = {
  hello:   "Hello, I'm",
  name1:   "RAGHAVENDRA",
  name2:   "PEDADA",
  class:   "Class of 2027",
  dept:    "CSE · ICB",
  crew:    "Straw Hat Developer Crew",
  cse:     "CSE",
  student: "Student",
  full:    "Full",
  stack:   "-Stack",
  python:  "Python",
  react:   "React",
  fastapi: "FastAPI",
  solidity:"Solidity",
  arduino: "Arduino",
};

const Landing = ({ children }: PropsWithChildren) => {
  const { isLoading } = useLoading();
  const [isJapanese, setIsJapanese] = useState(true);
  const [isGlitching, setIsGlitching] = useState(false);
  const [scrambling, setScrambling] = useState(false);
  const doneRef = useRef(false);  // useRef avoids re-render that would cancel the timer

  /* ── Trigger: 2 s after loading screen exits ── */
  useEffect(() => {
    if (isLoading || doneRef.current) return;
    doneRef.current = true;

    const t1 = setTimeout(() => {
      setIsGlitching(true);
      setScrambling(true);

      const t2 = setTimeout(() => {
        setIsJapanese(false);         // swap to English mid-glitch
        const t3 = setTimeout(() => {
          setIsGlitching(false);
          setScrambling(false);
        }, 600);
        return () => clearTimeout(t3);
      }, 900);
      return () => clearTimeout(t2);
    }, 2000);

    return () => clearTimeout(t1);
  }, [isLoading]);

  const src = isJapanese ? JP : EN;

  /* ── Scramble only the big name titles ── */
  const name1Display = useScramble(src.name1, scrambling, 900);
  const name2Display = useScramble(src.name2, scrambling, 700);
  const fullDisplay  = useScramble(src.full,  scrambling, 600);
  const stackDisplay = useScramble(src.stack, scrambling, 700);

  return (
    <>
      {/* Ocean background */}
      <div className="ocean-bg" />

      {/* TV static glitch overlay */}
      {isGlitching && <div className="static-overlay" />}
      {isGlitching && <div className="static-scanlines" />}

      <div
        className={`landing-section${isGlitching ? " landing-glitching" : ""}`}
        id="landingDiv"
      >
        <div className="landing-container">

          {/* Left block — name */}
          <div className="landing-intro">
            <h2 className={isJapanese ? "jp-label" : ""}>{src.hello}</h2>
            <h1>
              <span className="landing-name-line">{name1Display}</span>
              <br />
              <span className={isJapanese ? "" : ""}>{name2Display}</span>
            </h1>
            <div className="landing-badge">
              <span className="landing-badge-mono">{src.class}</span>
              <span className="landing-badge-dot" />
              <span className="landing-badge-mono">{src.dept}</span>
            </div>
            <div className="pirate-crew-label">
              <img src="/images/jolly-roger.png" alt="" className="crew-icon" />
              <span>{src.crew}</span>
            </div>
          </div>

          {/* Right block — role + tags */}
          <div className="landing-info">
            <h3>
              <span className="landing-h2-info-1">{src.cse}</span>
              {" "}
              <span className="landing-h2-info">{src.student}</span>
            </h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">{fullDisplay}</div>
              <div className="landing-h2-2">{stackDisplay}</div>
            </h2>
            <div className="landing-tags-row">
              <span className="landing-tag-pill">{src.python}</span>
              <span className="landing-tag-pill">{src.react}</span>
              <span className="landing-tag-pill">{src.fastapi}</span>
              <span className="landing-tag-pill">{src.solidity}</span>
              <span className="landing-tag-pill">{src.arduino}</span>
            </div>
          </div>

        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
