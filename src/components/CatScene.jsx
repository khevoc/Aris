// src/components/CatScene.jsx
import React, { useEffect, useRef, useState } from "react";
import "../styles/CatScene.css";

import catImg from "../assets/cat.jpg";

export default function CatScene() {
  const spotlightRef = useRef(null);
  const containerRef = useRef(null);

  const [position, setPosition] = useState({ x: -9999, y: -9999 });

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

  return (
    <div className="catscene-root" ref={containerRef}>
      {/* Imagen del gato */}
      <img src={catImg} alt="Cat" className="cat-image" />

      {/* Filtro oscuro + linterna */}
      <div
        className="catspotlight"
        ref={spotlightRef}
        style={{
          "--spot-x": `${position.x}px`,
          "--spot-y": `${position.y}px`,
        }}
      ></div>
      
    </div>
  );
}
