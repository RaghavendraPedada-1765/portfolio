import { useEffect, useRef } from "react";
import "./styles/WhatIDo.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const domains = [
  {
    icon: "⚡",
    name: "Full-Stack Dev",
    color: "violet",
    tags: ["React", "FastAPI", "REST APIs"],
    desc: "End-to-end web apps — clean frontends, scalable backends.",
  },
  {
    icon: "🤖",
    name: "AI & Machine Learning",
    color: "blue",
    tags: ["RAG", "LangChain", "NLP"],
    desc: "RAG pipelines, LLM integrations, and NLP-powered tools.",
  },
  {
    icon: "⛓️",
    name: "Blockchain",
    color: "orange",
    tags: ["Solidity", "Ethereum", "SHA-256"],
    desc: "Smart contracts, proof-of-work, and decentralized systems.",
  },
  {
    icon: "📡",
    name: "IoT Systems",
    color: "green",
    tags: ["Arduino", "ESP32", "MQTT"],
    desc: "Sensor networks, embedded systems, and device protocols.",
  },
  {
    icon: "🗄️",
    name: "Backend & Databases",
    color: "violet",
    tags: ["Python", "Java", "MySQL"],
    desc: "Robust APIs, relational databases, and server architecture.",
  },
  {
    icon: "🔧",
    name: "Software Engineering",
    color: "blue",
    tags: ["Git", "Linux", "Agile"],
    desc: "SDLC, version control, and collaborative workflows.",
  },
];

const WhatIDo = () => {
  const containerRef = useRef<(HTMLDivElement | null)[]>([]);
  const setRef = (el: HTMLDivElement | null, index: number) => {
    containerRef.current[index] = el;
  };

  useEffect(() => {
    if (ScrollTrigger.isTouch) {
      containerRef.current.forEach((container) => {
        if (container) {
          container.classList.remove("what-noTouch");
        }
      });
    }
  }, []);

  return (
    <div className="whatIDO">
      {/* Title box — GSAP targets .whatIDO */}
      <div className="what-box what-title-box">
        <h2 className="title">
          W<span className="hat-h2">HAT</span>
          <div>
            I <span className="do-h2">DO</span>
          </div>
        </h2>
      </div>

      {/* Domain cards grid — GSAP targets .what-box-in */}
      <div className="what-box">
        <div className="what-box-in what-grid">
          {domains.map((d, i) => (
            <div
              key={i}
              className={`what-content what-noTouch domain-card domain-${d.color}`}
              ref={(el) => setRef(el, i)}
            >
              <div className="what-corner" />
              <div className="what-content-in domain-content">
                <div className="domain-icon">{d.icon}</div>
                <h3>{d.name}</h3>
                <h4>{d.desc}</h4>
                <h5>Stack &amp; Tools</h5>
                <div className="what-content-flex">
                  {d.tags.map((t, j) => (
                    <div key={j} className="what-tags">{t}</div>
                  ))}
                </div>
                <div className="what-arrow" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;
