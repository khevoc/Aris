// src/components/CatScene.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CatScene.css";

import catImg from "../assets/cat.jpg";
import catAImg from "../assets/cat2.jpg";
import { Icons } from "./ui/Icons";

export default function CatScene() {
  const containerRef = useRef(null);

  const [position, setPosition] = useState({ x: -9999, y: -9999 });
  const [activeMode, setActiveMode] = useState(false);

  const navigate = useNavigate();

  /* ------------------------ DESKTOP ------------------------ */
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

  /* ------------------------ MOBILE TOUCH ------------------------ */
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

  /* ------------------------ BLOQUEAR SCROLL EN MOBILE ------------------------ */
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
      {/* Imagen principal */}
      <img
        src={activeMode ? catAImg : catImg}
        alt="Night vision cat"
        className="cat-image"
      />

      {/* Spotlight base */}
      <div
        className="catspotlight"
        style={{
          "--spot-x": `${position.x}px`,
          "--spot-y": `${position.y}px`,
        }}
      ></div>

      {/* Halo cromático alrededor de la luz */}
      <div
        className="spot-chroma"
        style={{
          "--spot-x": `${position.x}px`,
          "--spot-y": `${position.y}px`,
        }}
      ></div>

      {/* Partículas / polvo en el aire */}
      <div className="particles-layer"></div>

      {/* Scanlines sutiles tipo monitor */}
      <div className="scanlines-layer"></div>

      {/* Fog cinematográfico */}
      <div className="fog-layer"></div>

      {/* Vignette / lente anamórfica */}
      <div className="lens-vignette"></div>

      {/* Glitch elegante solo en modo activo */}
      {activeMode && <div className="glitch-overlay"></div>}

      {/* HUD superior fijo */}
      <div className="cat-top-bar">      

        <button
          className="neon-btn"
          onClick={() => setActiveMode((p) => !p)}
        >
          {activeMode ? Icons.zapOff({ size: 18 }) : Icons.zap({ size: 18 })}
        </button>
      </div>
    </div>
  );
}
