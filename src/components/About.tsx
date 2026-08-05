import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">

        {/* Section label */}
        <h3 className="title">About Me</h3>

        {/* Terminal-style code card */}
        <div className="about-terminal-card">
          <div className="atc-bar">
            <span className="atc-dot atc-red" />
            <span className="atc-dot atc-yellow" />
            <span className="atc-dot atc-green" />
            <span className="atc-filename">profile.ts</span>
          </div>
          <div className="atc-body">
            <div className="atc-line">
              <span className="atc-kw">const</span>
              <span className="atc-var"> raghavendra</span>
              <span className="atc-op"> = {"{"}</span>
            </div>
            <div className="atc-line atc-indent">
              <span className="atc-key">role</span>
              <span className="atc-op">: </span>
              <span className="atc-str">"Full-Stack Developer"</span>
              <span className="atc-op">,</span>
            </div>
            <div className="atc-line atc-indent">
              <span className="atc-key">college</span>
              <span className="atc-op">: </span>
              <span className="atc-str">"Alva's Institute of Engineering &amp; Technology"</span>
              <span className="atc-op">,</span>
            </div>
            <div className="atc-line atc-indent">
              <span className="atc-key">batch</span>
              <span className="atc-op">: </span>
              <span className="atc-num">2027</span>
              <span className="atc-op">,</span>
            </div>
            <div className="atc-line atc-indent">
              <span className="atc-key">domains</span>
              <span className="atc-op">: </span>
              <span className="atc-bracket">["</span>
              <span className="atc-str-arr">AI</span>
              <span className="atc-op">", "</span>
              <span className="atc-str-arr">Blockchain</span>
              <span className="atc-op">", "</span>
              <span className="atc-str-arr">IoT</span>
              <span className="atc-op">", "</span>
              <span className="atc-str-arr">Web</span>
              <span className="atc-bracket">"]</span>
              <span className="atc-op">,</span>
            </div>
            <div className="atc-line">
              <span className="atc-op">{"}"}</span>
            </div>
          </div>
        </div>

        {/* Bio paragraph — targeted by GSAP splitText */}
        <p className="para">
          CSE undergraduate at Alva's Institute of Engineering &amp; Technology
          (Class of 2027), building AI-powered applications, blockchain systems,
          and IoT solutions. From RAG pipelines to proof-of-work mining platforms —
          I write code that ships. Driven by curiosity, powered by open source.
          Specializing in Python, FastAPI, React, Solidity, and scalable system design.
        </p>

        {/* Stat pills */}
        <div className="about-stats-row">
          <div className="about-stat-chip">
            <span className="about-stat-num">3+</span>
            <span className="about-stat-label">Projects</span>
          </div>
          <div className="about-stat-chip">
            <span className="about-stat-num">5+</span>
            <span className="about-stat-label">Tech Domains</span>
          </div>
          <div className="about-stat-chip">
            <span className="about-stat-num">∞</span>
            <span className="about-stat-label">Open Source</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
