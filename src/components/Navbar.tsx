import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaHome,
} from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);


  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo" onClick={closeMenu}>
        MAYO<span className="logo-dot">.</span>
      </Link>

      <button
        className="navbar-toggle"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      <div className={`navbar-left ${isOpen ? "active" : ""}`}>
        <Link to="/" className="navbar-icon" onClick={closeMenu}>
          <FaHome size={24} />
        </Link>

        <Link to="/contact" className="navbar-icon" onClick={closeMenu}>
          <FaEnvelope size={22} />
        </Link>
        <a
          href="https://victormayowa.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="navbar-icon"
          onClick={closeMenu}
        >
          <FaUserCircle size={24} />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
