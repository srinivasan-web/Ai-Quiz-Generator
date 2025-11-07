// src/components/Loader.jsx
import React from "react";
import {
  ClipLoader,
  PulseLoader,
  HashLoader,
  RingLoader,
  PacmanLoader,
  BeatLoader,
  GridLoader,
  MoonLoader,
} from "react-spinners";
import "./index.css";

const Loader = ({
  message = "Processing...",
  type = "clip",
  time = "seconds",
}) => {
  const color = "#d400ffff"; // Tailwind Blue-600
  const size = 70;

  const renderSpinner = () => {
    switch (type) {
      case "pulse":
        return <PulseLoader color={color} size={14} speedMultiplier={0.9} />;
      case "hash":
        return <HashLoader color={color} size={size} speedMultiplier={1.2} />;
      case "ring":
        return <RingLoader color={color} size={size} speedMultiplier={1.4} />;
      case "pacman":
        return <PacmanLoader color={color} size={25} speedMultiplier={1.3} />;
      case "beat":
        return <BeatLoader color={color} size={15} speedMultiplier={0.8} />;
      case "grid":
        return <GridLoader color={color} size={20} speedMultiplier={1} />;
      case "moon":
        return <MoonLoader color={color} size={60} speedMultiplier={1.5} />;
      default:
        return <ClipLoader color={color} size={size} speedMultiplier={1.2} />;
    }
  };

  return (
    <div className="loader-overlay">
      <div className="spinner-container">{renderSpinner()}</div>
      <p className="loader-message">{message}</p>
      <p className="loader-time">This may take 10-30 seconds </p>
    </div>
  );
};

export default Loader;
