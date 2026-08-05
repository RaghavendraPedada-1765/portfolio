import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">

        <div className="career-heading">
          <span className="career-label">Experience</span>
          <h2>
            Journey <span>&amp;</span>
            {" "}Milestones
          </h2>
        </div>

        <div className="career-info">

          {/* GSAP timeline bar */}
          <div className="career-timeline">
            <div className="career-dot" />
          </div>

          {/* Entry 1 — B.E. CSE */}
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>🎓 B.E. Computer Science Engineering (ICB)</h4>
                <h5>Alva's Institute of Engineering &amp; Technology</h5>
              </div>
              <h3>2023–27</h3>
            </div>
            <p>
              Bachelor's degree with specialization in IoT, Cyber Security, and
              Blockchain. Actively building projects that bridge theory with
              real-world impact. Consistent open-source contributor throughout the
              programme.
            </p>
          </div>

          {/* Entry 2 — Open Source */}
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>🌐 Open Source Developer</h4>
                <h5>GitHub · Active Contributor</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Published multiple AI-powered and full-stack projects on GitHub.
              Built RAG systems, AI resume analyzers, and blockchain proof-of-work
              platforms. Consistent Git-based workflows and collaborative development
              practices.
            </p>
          </div>

          {/* Entry 3 — Project Developer */}
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>⚙️ Project Developer</h4>
                <h5>Self-Directed · Ongoing</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Designing scalable AI-powered applications with Python, FastAPI, and
              React. Working with REST APIs, vector databases, LLMs, and Agile
              methodologies. Projects span Blockchain, NLP, IoT, and full-stack web
              engineering.
              <br />
              <br />
              <strong>HashPilot</strong> · <strong>Cosmic-RAG-System</strong> · <strong>AI ATS Checker</strong>
            </p>
          </div>

          {/* Entry 4 — CS Fundamentals */}
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>📚 CS Fundamentals</h4>
                <h5>Core Academic Competencies</h5>
              </div>
              <h3>CORE</h3>
            </div>
            <p>
              Solid foundation across&nbsp;
              <strong style={{ color: "var(--accentColor)" }}>DSA</strong>
              &nbsp;·&nbsp;
              <strong style={{ color: "var(--accentColor)" }}>DBMS</strong>
              &nbsp;·&nbsp;
              <strong style={{ color: "var(--accentColor)" }}>OS</strong>
              &nbsp;·&nbsp;
              <strong style={{ color: "var(--accentColor)" }}>OOP</strong>
              &nbsp;·&nbsp;
              <strong style={{ color: "var(--accentColor)" }}>Computer Networks</strong>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Career;
