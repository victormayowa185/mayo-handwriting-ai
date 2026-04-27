import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import "../styles/Contact.css";

const Contact = () => (
  <div className="contact-container">
    <div className="contact-card">
      <FaEnvelope className="contact-icon" size={40} />
      <h1>Get in Touch</h1>
      <p className="contact-message">
        Have a question, feedback, or just want to chat about code?
        <br />
        I'd love to hear from you.
      </p>
      <a href="mailto:victormayowa185@gmail.com" className="contact-email">
        victormayowa185@gmail.com
      </a>
      <Link to="/" className="contact-back">
        ← Back to Home
      </Link>
    </div>
  </div>
);

export default Contact;
