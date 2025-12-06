import React, { useState } from "react";
import { SignIn, SignUp, UserButton, useUser } from "@clerk/clerk-react";
import "./index.css";

function Login() {
  const [mode, setMode] = useState("login");
  const { user } = useUser();

  return (
    <div className="auth-container">
      {/* 3D Background */}
      <div className="floating-3d-shape"></div>
      <div className="floating-3d-shape two"></div>

      <div className="auth-card">
        {user ? (
          <UserButton />
        ) : (
          <>
            {/* Toggle buttons */}
            <div className="toggle-box">
              <button
                className={
                  mode === "login" ? "toggle-btn active" : "toggle-btn"
                }
                onClick={() => setMode("login")}
              >
                Login
              </button>

              <button
                className={
                  mode === "signup" ? "toggle-btn active" : "toggle-btn"
                }
                onClick={() => setMode("signup")}
              >
                Sign Up
              </button>
            </div>

            {/* Auth UI */}
            <div className="form-box fade-in">
              {mode === "login" ? (
                <SignIn
                  path="/login"
                  routing="path"
                  signUpUrl="/login?mode=signup"
                />
              ) : (
                <SignUp path="/login" routing="path" signInUrl="/login" />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
