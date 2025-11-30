// src/components/CatScene.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CatScene.css";

import catImg from "../assets/cat.jpg";
import catAImg from "../assets/cat2.jpg";

export default function CatScene() {
  const containerRef = useRef(null);

  const [position, setPosition] = useState({ x: -9999, y: -9999 });
  const [activeMode, setActiveMode] = useState(false);

  const navigate = useNavigate();

  /* -----------------------------------------------------
     DESKTOP MOVE
  ----------------------------------------------------- */
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  /* -----------------------------------------------------
     TOUCH MOVE
  ----------------------------------------------------- */
  useEffect(() => {
    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
    };
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => document.removeEventListener("touchmove", handleTouchMove);
  }, []);

  /* -----------------------------------------------------
     BLOCK SCROLL ON MOBILE
  ----------------------------------------------------- */
  useEffect(() => {
    const preventScroll = (e) => e.preventDefault();
    document.addEventListener("touchmove", preventScroll, { passive: false });
    return () => document.removeEventListener("touchmove", preventScroll);
  }, []);

  return (
    <div
      className={`cat-scene-root ${activeMode ? "active-mode" : ""}`}
      ref={containerRef}
    >
      {/* Fondo del gato */}
      <img
        src={activeMode ? catAImg : catImg}
        alt="cat"
        className="cat-image"
      />

      {/* Efecto linterna */}
      <div
        className="catspotlight"
        style={{
          "--spot-x": `${position.x}px`,
          "--spot-y": `${position.y}px`,
        }}
      ></div>

      {/* ✔ Partículas (cinemáticas) */}
      <div className="particles-layer"></div>


      {/* ✔ Glitch en modo activo */}
      {activeMode && <div className="glitch-overlay"></div>}

      {/* Top bar */}
      <div className="cat-top-bar">
        <button className="neon-btn" onClick={() => navigate("/")}>
          ← Gallery
        </button>

        <button
          className="neon-btn"
          onClick={() => setActiveMode((p) => !p)}
        >
          {activeMode ? "Normal Mode" : "Active Mode"}
        </button>
      </div>
    </div>
  );
}
