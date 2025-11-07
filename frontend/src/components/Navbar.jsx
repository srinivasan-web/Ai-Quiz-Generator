import { useState } from "react";
import { Link, useLocation } from "react-router-dom";


const Navbar = () => {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);

  const handleActive = (path) => setActive(path);

  return (
    <nav className="nav-container">
      <div className="logo">AI Wikipedia Quiz Generator</div>
      <div className="links">
        <Link
          to="/"
          onClick={() => handleActive("/")}
          className={active === "/" ? "active" : ""}
        >
          AI Wiki Quiz
        </Link>

        <Link
          to="/history"
          onClick={() => handleActive("/history")}
          className={active === "/history" ? "active" : ""}
        >
          History
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
