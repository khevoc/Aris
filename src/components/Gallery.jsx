// src/components/Gallery.jsx
import React, { useState, useRef } from "react";
import ArtworkDisplay from "./ArtworkDisplay";
import { Icons } from "../components/ui/Icons";
import "../styles/Gallery.css";

const ARTWORKS = [
  {
    id: 1,
    title: "Aoki",
    author: "Carlos T.",
    image: "/paintings/aoki.jpg",
    effects: ["/effects/aura.png", "/effects/brush1.png", "/effects/spark.png"],
    description: "Acrylic on Canvas — 2024",
  },
  {
    id: 2,
    title: "Night Vision",
    author: "Carlos T.",
    image: "/paintings/night_vision.jpg",
    effects: ["/effects/leaves.png", "/effects/smoke.png"],
    description: "Acrylic on Wood Panel — 2024",
    link: "/night-vision",
  },
  {
    id: 3,
    title: "Crocovacations",
    author: "Carlos T.",
    image: "/paintings/crocodile.jpg",
    effects: ["/effects/water.png", "/effects/splash.png"],
    description: "Acrylic on Canvas ° Interactive Experience — 2025",
    link: "/croco-experience",
  },
];

export default function Gallery() {
  const [index, setIndex] = useState(0);

  const next = () =>
    setIndex((prev) => (prev + 1) % ARTWORKS.length);

  const prev = () =>
    setIndex((prev) => (prev - 1 + ARTWORKS.length) % ARTWORKS.length);

  // --- SWIPE TOUCH SUPPORT ---
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const MIN_SWIPE = 50; // distancia mínima en px para que cuente como gesto

  const onTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const onTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchEndX.current - touchStartX.current;

    if (Math.abs(diff) < MIN_SWIPE) return;

    if (diff < 0) next(); // swipe left → next
    if (diff > 0) prev(); // swipe right → prev
  };

  return (
    <div className="gallery-root" onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}>

      {/* Contenedor principal */}
      <div className="gallery-frame">
        <ArtworkDisplay
          artwork={ARTWORKS[index]}
          key={ARTWORKS[index].id}
        />
      </div>

      {/* Controles y miniaturas */}
      <div className="gallery-controls">
        <button className="nav-btn left" onClick={prev}><Icons.leftGlow /></button>

        <div className="thumbs">
          {ARTWORKS.map((a, i) => (
            <button
              key={a.id}
              className={`thumb ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
            >
              <img src={a.image} alt={a.title} />
            </button>
          ))}
        </div>

        <button className="nav-btn right" onClick={next}><Icons.rightGlow /></button>
      </div>
    </div>
  );
}
