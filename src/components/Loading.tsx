import { useEffect, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/loadingContext";

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
  const [clicked, setClicked] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState(0);
  useEffect(() => {
    const interval = window.setInterval(() => {
      setVisibleMessages((prev) => Math.min(prev + 1, BOOT_MESSAGES.length));
    }, 150);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (percent < 100) return;
    const ready = window.setTimeout(() => setLoaded(true), 200);
    const exit = window.setTimeout(() => setClicked(true), 500);
    const done = window.setTimeout(() => setIsLoading(false), 700);
    return () => { clearTimeout(ready); clearTimeout(exit); clearTimeout(done); };
  }, [percent, setIsLoading]);

  const filled = Math.max(0, Math.min(20, Math.round((percent / 100) * 20)));
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

            <div className="terminal-progress" role="progressbar" aria-label="Loading character" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
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

        <button className="skip-loading" autoFocus onClick={() => setIsLoading(false)}>Continue to portfolio</button>
        {/* One Piece logo watermark */}
        <img src="/images/onepiece-logo.png" alt="" className="loading-op-logo" />
        <div className="loading-name-watermark">RAGHAVENDRA PEDADA</div>
      </div>
    </>
  );
};

export default Loading;
