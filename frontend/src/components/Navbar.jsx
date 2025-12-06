// src/components/Navbar.jsx
import React, { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import "./index.css"; // optional separate CSS for navbar

export default function Navbar() {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  const { user } = useUser();
  const clerk = useClerk();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef();

  const handleLogout = async () => {
    try {
      setLoading(true);
      await clerk.signOut();
      // redirect to login page after sign out
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

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
          <div className="profile-menu" ref={menuRef}>
            <button className="profile-btn" onClick={() => setOpen((s) => !s)}>
              {user.firstName || "Account"}
            </button>

            {open && (
              <div className="menu-dropdown" role="menu">
                <Link to="/profile" onClick={() => setOpen(false)}>
                  Profile
                </Link>

                <button onClick={handleLogout} disabled={loading}>
                  {loading ? "Signing out..." : "Logout"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="user-button"
            onClick={() => clerk.openSignIn({ redirectUrl: "/" })}
          >
            Sign Up
          </button>
        )}
      </div>
    </nav>
  );
}
