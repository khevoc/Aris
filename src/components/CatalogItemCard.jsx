// src/components/CatalogItemCard.jsx
import React, { useState, useRef } from "react";
import { Camera } from "lucide-react";

export default function CatalogItemCard({ item, onOpen, onZoom }) {
  const [loaded, setLoaded] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    card.style.transform = `rotateX(${y * -8}deg) rotateY(${x * 8}deg) scale(1.03)`;
  };

  const resetTilt = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
  };

  return (
    <div
      ref={cardRef}
      className={`catalog-card ${loaded ? "is-loaded" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
    >
      <div className="catalog-card-img-wrapper" onClick={onOpen}>
        <img
          src={item.image}
          alt={item.name}
          className={`catalog-card-img ${loaded ? "fade-in" : ""}`}
          onLoad={() => setLoaded(true)}
        />
      </div>

      <div className="catalog-card-info">
        <div>
          <p className="catalog-card-title">{item.name}</p>
          <p className="catalog-card-year">{item.year}</p>
        </div>

        <button className="catalog-card-zoom" onClick={onZoom}>
          <Camera size={18} />
        </button>
      </div>
    </div>
  );
}
