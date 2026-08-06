import { useEffect, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";

const BOOT_MESSAGES = [
  "> Setting sail on the Grand Line...",
  "> Loading Devil Fruit powers...",
  "> Recruiting the Straw Hat crew...",
  "> Mounting WebGL Thousand Sunny...",
  "> Plotting course to portfolio...",
  "> All hands on deck. Adventure begins!",
];

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const [loaded, setLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState<number>(0);

  if (percent >= 100 && !loaded) {
    setTimeout(() => {
      setLoaded(true);
      setTimeout(() => {
        setIsLoaded(true);
      }, 300);
    }, 200);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleMessages((prev) => {
        if (prev < BOOT_MESSAGES.length) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    import("./utils/initialFX").then((module) => {
      if (isLoaded) {
        setClicked(true);
        setTimeout(() => {
          if (module.initialFX) module.initialFX();
          setIsLoading(false);
        }, 200);
      }
    });
  }, [isLoaded]);

  const filled = Math.min(20, Math.round((percent / 100) * 20));
  const empty = 20 - filled;
  const progressBar = "█".repeat(filled) + "░".repeat(empty);

  return (
    <>
      <div className="loading-header">
        <a href="/#" className="loader-title" data-cursor="disable">
          <img src="/images/jolly-roger.png" alt="Jolly Roger" className="loader-jolly-icon" />
          <span className="loader-jolly-text">RP</span>
        </a>
      </div>

      <div className={`loading-screen ${clicked ? "loading-exit" : ""}`}>
        {/* Background grid */}
        <div className="loading-bg-grid" />

        {/* Ambient orbs */}
        <div className="loading-orb loading-orb-1" />
        <div className="loading-orb loading-orb-2" />

        {/* Terminal window */}
        <div className="terminal-window">
          <div className="terminal-bar">
            <div className="terminal-dots">
              <span className="terminal-dot td-red" />
              <span className="terminal-dot td-yellow" />
              <span className="terminal-dot td-green" />
            </div>
            <span className="terminal-title">raghavendra@portfolio ~ bash</span>
          </div>

          <div className="terminal-body">
            {BOOT_MESSAGES.slice(0, visibleMessages).map((msg, i) => (
              <div
                key={i}
                className="terminal-line"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span className="terminal-prompt">{msg}</span>
              </div>
            ))}

            <div className="terminal-progress">
              <span className="terminal-prog-text">
                {`> [${progressBar}] ${percent}%`}
              </span>
            </div>

            {loaded && (
              <div className="terminal-ready">
                <span className="terminal-success">
                  {"☠ Nakama found. Welcome aboard, Raghavendra."}
                  <span className="term-cursor">_</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* One Piece logo watermark */}
        <img src="/images/onepiece-logo.png" alt="" className="loading-op-logo" />
        <div className="loading-name-watermark">RAGHAVENDRA PEDADA</div>
      </div>
    </>
  );
};

export default Loading;

/* ── Fast & smooth progress ticker ── */
export const setProgress = (setLoading: (value: number) => void) => {
  let percent: number = 0;
  let isDone = false;

  let interval = setInterval(() => {
    if (percent < 90) {
      percent += Math.floor(Math.random() * 4) + 3; // Fast progress +3..+6
      if (percent > 90) percent = 90;
      setLoading(percent);
    }
  }, 35);

  // Safety fallback: auto-complete after 4.5s if network is slow
  const safetyTimeout = setTimeout(() => {
    if (!isDone) {
      loaded();
    }
  }, 4500);

  function clear() {
    isDone = true;
    clearInterval(interval);
    clearTimeout(safetyTimeout);
    setLoading(100);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      isDone = true;
      clearInterval(interval);
      clearTimeout(safetyTimeout);

      let finishInterval = setInterval(() => {
        if (percent < 100) {
          percent += 4;
          if (percent > 100) percent = 100;
          setLoading(percent);
        } else {
          clearInterval(finishInterval);
          resolve(100);
        }
      }, 15);
    });
  }
  return { loaded, percent, clear };
};
