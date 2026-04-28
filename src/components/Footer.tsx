import { FaGithub } from "react-icons/fa";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        A <span className="brand-mayo">KEN</span> project by{" "}
        <a
          href="https://victormayowa.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="brand-name"
        >
          Keneth
        </a>
      </p>
        <FaGithub size={24} />
      </a>
    </footer>
  );
};

export default Footer;
