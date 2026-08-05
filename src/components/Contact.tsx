import { MdArrowOutward, MdCopyright } from "react-icons/md";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">

        {/* Big CTA heading */}
        <div className="contact-cta">
          <div className="contact-bg-text">CONNECT</div>
          <span className="contact-eyebrow">Get in touch</span>
          <h3>Let's Build Something <span>Together</span></h3>
          <p>
            Open to collaborations, projects, and interesting conversations.
            Whether it's AI, blockchain, IoT, or full-stack — let's talk.
          </p>
        </div>

        {/* Link pills row */}
        <div className="contact-links">
          <a
            href="https://github.com/RaghavendraPedada-1765"
            target="_blank"
            rel="noreferrer"
            data-cursor="disable"
            className="contact-pill"
          >
            <FaGithub />
            <span>GitHub</span>
            <MdArrowOutward className="contact-pill-arrow" />
          </a>
          <a
            href="https://www.linkedin.com/in/raghavendra-pedada-baa349356/"
            target="_blank"
            rel="noreferrer"
            data-cursor="disable"
            className="contact-pill"
          >
            <FaLinkedinIn />
            <span>LinkedIn</span>
            <MdArrowOutward className="contact-pill-arrow" />
          </a>
          <a
            href="mailto:raghavendrapedadaa@gmail.com"
            data-cursor="disable"
            className="contact-pill"
          >
            <MdEmail />
            <span>Email</span>
            <MdArrowOutward className="contact-pill-arrow" />
          </a>
        </div>

        {/* Education + footer */}
        <div className="contact-footer">
          <div className="contact-edu">
            <span className="contact-edu-label">Education</span>
            <p>B.E. Computer Science Engineering (ICB) · Alva's Institute of Engineering &amp; Technology · 2023–2027</p>
          </div>
          <div className="contact-copy">
            <span>Designed &amp; Built by <strong>Raghavendra Pedada</strong></span>
            <span className="contact-year">
              <MdCopyright /> 2026
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
