import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { useClerk, useSignUp, UserButton, useUser } from "@clerk/clerk-react";
import "./index.css";

const Navbar = () => {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  const { user } = useUser();
  const { openSignIn } = useClerk();

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

        {user ? (
          <UserButton />
        ) : (
          <button className="user-button " onClick={() => openSignIn()}>
            Sign Up <FaArrowRight />{" "}
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
