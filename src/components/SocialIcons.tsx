import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import HoverLinks from "./HoverLinks";

const SocialIcons = () => {
  return (
    <div className="icons-section">
      <a
        className="resume-button"
        href="https://github.com/RaghavendraPedada-1765"
        target="_blank"
        rel="noreferrer"
      >
        <HoverLinks text="GITHUB" />
        <span>
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;
