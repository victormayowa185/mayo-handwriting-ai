import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/notFound.css";

const NotFound = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(7);

  useEffect(() => {
    if (countdown <= 0) {
      navigate("/", { replace: true });
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page not found</h2>
        <p className="not-found-message">
          The page you're looking for doesn't exist or has been moved.
          <br />
          You’ll be redirected to the homepage in <strong>{countdown}s</strong>.
        </p>
        <Link to="/" className="not-found-link">
          Go home now
          <span className="arrow">→</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
