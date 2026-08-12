import Marquee from "react-fast-marquee";
import {
  SiPython, SiReact, SiFastapi, SiTypescript, SiJavascript,
  SiNodedotjs, SiNextdotjs, SiExpress,
  SiMongodb, SiMysql, SiSolidity, SiEthereum,
  SiDocker, SiArduino, SiEspressif, SiLinux, SiGit,
  SiOpenai, SiGithubactions, SiLetsencrypt, SiRabbitmq,
} from "react-icons/si";
import "./styles/TechStack.css";

/* ── Tech rows ─────────────────────────────────────────────────────────── */
type TechItem = { Icon: React.ComponentType<{ size?: number; color?: string }>; name: string; color: string; };

const ROW_1: TechItem[] = [
  { Icon: SiPython,       name: "Python",      color: "#3776AB" },
  { Icon: SiReact,        name: "React",        color: "#61DAFB" },
  { Icon: SiFastapi,      name: "FastAPI",      color: "#009688" },
  { Icon: SiTypescript,   name: "TypeScript",   color: "#3178C6" },
  { Icon: SiJavascript,   name: "JavaScript",   color: "#F7DF1E" },
  { Icon: SiNodedotjs,    name: "Node.js",      color: "#339933" },
  { Icon: SiNextdotjs,    name: "Next.js",      color: "#e8dfc8" },
  { Icon: SiExpress,      name: "Express",      color: "#9aacbf"  },
];

const ROW_2: TechItem[] = [
  { Icon: SiMongodb,      name: "MongoDB",      color: "#47A248" },
  { Icon: SiMysql,        name: "MySQL",         color: "#4479A1" },
  { Icon: SiSolidity,     name: "Solidity",     color: "#a8b9cc" },
  { Icon: SiEthereum,     name: "Ethereum",     color: "#8C8DFC" },
  { Icon: SiOpenai,       name: "LangChain",    color: "#74aa9c" },
  { Icon: SiRabbitmq,     name: "MQTT",         color: "#FF6600" },
  { Icon: SiDocker,       name: "Docker",       color: "#2496ED" },
];

const ROW_3: TechItem[] = [
  { Icon: SiArduino,        name: "Arduino",      color: "#00979D" },
  { Icon: SiEspressif,      name: "ESP32",        color: "#E7352C" },
  { Icon: SiLinux,          name: "Linux",        color: "#FCC624" },
  { Icon: SiGit,            name: "Git",          color: "#F05032" },
  { Icon: SiGithubactions,  name: "CI / CD",      color: "#2088FF" },
  { Icon: SiLetsencrypt,    name: "SHA-256",      color: "#003A70" },
];

/* ── Pill component ─────────────────────────────────────────────────────── */
const Pill = ({ Icon, name, color }: TechItem) => (
  <div className="ts-pill" style={{ "--pill-color": color } as React.CSSProperties}>
    <span className="ts-pill-icon">
      <Icon size={22} color={color} />
    </span>
    <span className="ts-pill-name">{name}</span>
  </div>
);

/* ── Section divider ────────────────────────────────────────────────────── */
const Divider = () => (
  <div className="ts-divider" aria-hidden="true">
    <span className="ts-divider-line" />
    <span className="ts-divider-skull">☠</span>
    <span className="ts-divider-line" />
  </div>
);

/* ── Main component ─────────────────────────────────────────────────────── */
const TechStack = () => (
  <section className="techstack ts-section">
    <div className="ts-heading">
      <p className="ts-sub">— Weapons of Choice —</p>
      <h2>MY&nbsp;<span className="ts-accent">TECHSTACK</span></h2>
    </div>

    {/* Row 1 — Languages & Frameworks → left */}
    <div className="ts-row-wrap">
      <Marquee speed={38} gradient={false} pauseOnHover className="ts-marquee">
        {[...ROW_1, ...ROW_1].map((t, i) => <Pill key={i} {...t} />)}
      </Marquee>
    </div>

    <Divider />

    {/* Row 2 — Data · Blockchain · AI → right */}
    <div className="ts-row-wrap">
      <Marquee speed={32} direction="right" gradient={false} pauseOnHover className="ts-marquee">
        {[...ROW_2, ...ROW_2].map((t, i) => <Pill key={i} {...t} />)}
      </Marquee>
    </div>

    <Divider />

    {/* Row 3 — IoT · DevOps · Security → left */}
    <div className="ts-row-wrap">
      <Marquee speed={42} gradient={false} pauseOnHover className="ts-marquee">
        {[...ROW_3, ...ROW_3].map((t, i) => <Pill key={i} {...t} />)}
      </Marquee>
    </div>

    <div className="ts-wave-row" aria-hidden="true">{"〜".repeat(60)}</div>
  </section>
);

export default TechStack;
