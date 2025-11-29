// src/components/Gallery.jsx
import React, { useState } from "react";
import ArtworkDisplay from "./ArtworkDisplay";
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
    title: "Crocodile Experience",
    author: "Carlos T.",
    image: "/paintings/crocodile.jpg",
    effects: ["/effects/water.png", "/effects/splash.png"],
    description: "Experiencia interactiva — 2025",
    link: "/croco-experience",
  },
];

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const next = () => setIndex((i) => (i + 1) % ARTWORKS.length);
  const prev = () => setIndex((i + ARTWORKS.length - 1) % ARTWORKS.length);

  return (
    <div className="gallery-root">

      {/* Contenedor principal */}
      <div className="gallery-frame">
        <ArtworkDisplay
          artwork={ARTWORKS[index]}
          key={ARTWORKS[index].id}
        />
      </div>

      {/* Controles y miniaturas */}
      <div className="gallery-controls">
        <button className="nav-btn left" onClick={prev}>◀</button>

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

        <button className="nav-btn right" onClick={next}>▶</button>
      </div>
    </div>
  );
}
