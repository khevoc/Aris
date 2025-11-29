// src/components/CatScene.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CatScene.css";

import catImg from "../assets/cat.jpg";
import catAImg from "../assets/cat2.jpg";

export default function CatScene() {
  const spotlightRef = useRef(null);
  const containerRef = useRef(null);

  const [position, setPosition] = useState({ x: -9999, y: -9999 });

  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState(false);

  // --- DESKTOP: MOUSE MOVE ---
  useEffect(() => {
    function handleMouseMove(e) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // --- MOBILE: TOUCH MOVE ---
  useEffect(() => {
    function handleTouchMove(e) {
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
    }

    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => document.removeEventListener("touchmove", handleTouchMove);
  }, []);

  useEffect(() => {
  const preventScroll = (e) => {
    e.preventDefault();
  };

  // Bloqueo del scroll mientras se toca la pantalla
  document.addEventListener("touchmove", preventScroll, { passive: false });

  return () => {
    document.removeEventListener("touchmove", preventScroll);
  };
}, []);

  return (
    <div className="catscene-root" ref={containerRef}>
      {/* Imagen del gato */}
      <img src={activeMode ? catAImg : catImg} alt="Cat" className="cat-image" />

      {/* Filtro oscuro + linterna */}
      <div
        className="catspotlight"
        ref={spotlightRef}
        style={{
          "--spot-x": `${position.x}px`,
          "--spot-y": `${position.y}px`,
        }}
      ></div>

      <div className="cat-bottom-bar">
        <button
          className="neon-btn"
          onClick={() => navigate("/")}
        >
          Gallery
        </button>

        <button
          className="neon-btn"
          onClick={() => setActiveMode((prev) => !prev)}
        >
          {activeMode ? "Normal" : "Active"}
        </button>
      </div>
      
    </div>
  );
}
