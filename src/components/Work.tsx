import { MdArrowOutward } from "react-icons/md";
import "./styles/Work.css";

const projects = [
  {
    title: "HashPilot",
    category: "Blockchain / AI",
    badge: "Proof-of-Work",
    badgeColor: "orange",
    desc: "AI-powered blockchain puzzle-solving platform demonstrating Proof-of-Work mining concepts with multiple strategies, benchmarking, and performance analysis.",
    stack: ["Python", "FastAPI", "React", "SHA-256", "Blockchain"],
    link: "https://github.com/RaghavendraPedada-1765/HashPilot",
    icon: "⛓️",
  },
  {
    title: "Cosmic-RAG-System",
    category: "Artificial Intelligence",
    badge: "RAG + LLM",
    badgeColor: "blue",
    desc: "Retrieval-Augmented Generation system leveraging LLMs and vector databases to deliver intelligent, contextual responses at scale.",
    stack: ["Python", "LangChain", "RAG", "LLM", "Vector DB"],
    link: "https://github.com/RaghavendraPedada-1765/Cosmic-RAG-System",
    icon: "🤖",
  },
  {
    title: "AI ATS Checker",
    category: "AI / NLP",
    badge: "Resume Analysis",
    badgeColor: "violet",
    desc: "AI-powered Applicant Tracking System checker that evaluates resumes against job descriptions and provides actionable optimization feedback.",
    stack: ["Python", "NLP", "FastAPI", "AI Analysis"],
    link: "https://github.com/RaghavendraPedada-1765/AI_ATS_Check",
    icon: "📄",
  },
];

const Work = () => {
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">

        <div className="work-header">
          <span className="work-label">Portfolio</span>
          <h2>
            My <span>Work</span>
          </h2>
        </div>

        {/* 3-column project grid */}
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div className="project-card" key={index}>

              {/* Card top bar */}
              <div className="project-card-top">
                <span className="project-icon">{project.icon}</span>
                <span className={`project-badge badge-${project.badgeColor}`}>
                  {project.badge}
                </span>
              </div>

              {/* Project number */}
              <div className="project-num">0{index + 1}</div>

              {/* Title + category */}
              <h3 className="project-title">{project.title}</h3>
              <p className="project-category">{project.category}</p>

              {/* Description */}
              <p className="project-desc">{project.desc}</p>

              {/* Stack tags */}
              <div className="project-stack">
                {project.stack.map((tech, i) => (
                  <span key={i} className="project-tech">{tech}</span>
                ))}
              </div>

              {/* GitHub link */}
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="project-link"
                data-cursor="disable"
              >
                View on GitHub <MdArrowOutward />
              </a>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Work;
