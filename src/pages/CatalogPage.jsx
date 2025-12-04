// src/pages/CatalogPage.jsx
import React, { useState, useEffect } from "react";
import CatalogItemCard from "../components/CatalogItemCard";
import ZoomViewer from "../components/ZoomViewer";
import "../styles/CatalogPage.css";

export default function CatalogPage() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const [selectedItem, setSelectedItem] = useState(null);
  const [zoomImg, setZoomImg] = useState(null);

  /* ======================================================
     📌 1. CSV PARSER SEGURO (soporta comas dentro de texto)
     ====================================================== */
  function parseCSVLine(line) {
    const result = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const c = line[i];

      if (c === '"' && line[i + 1] !== '"') {
        insideQuotes = !insideQuotes;
        continue;
      }
      if (c === "," && !insideQuotes) {
        result.push(current);
        current = "";
        continue;
      }
      current += c;
    }

    result.push(current);
    return result.map((x) => x.trim());
  }

  /* ======================================================
     📌 2. LOAD CSV
     ====================================================== */
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/catalog/data.csv");
        const csv = await res.text();

        const lines = csv.trim().split("\n");
        const headers = lines[0].split(",");

        const parsed = lines.slice(1).map((line) => {
          const cols = parseCSVLine(line);
          return {
            id: cols[0],
            category: cols[1],
            name: cols[2],
            image: cols[3],
            description: cols[4],
            year: cols[5],
            support: cols[6],
            technique: cols[7],
            size: cols[8],
          };
        });

        setTimeout(() => {
          setItems(parsed);
          setFiltered(parsed);
          setLoading(false);
        }, 350);
      } catch (err) {
        console.error("Error loading CSV:", err);
      }
    }

    loadData();
  }, []);

  /* ======================================================
     📌 3. FILTROS
     ====================================================== */
  useEffect(() => {
    let result = [...items];

    if (category !== "all") {
      result = result.filter((i) => i.category === category);
    }

    if (search.trim() !== "") {
      result = result.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(result);
  }, [search, category, items]);

  /* ======================================================
     📌 4. BOTONES DE FILTRO (chips)
     ====================================================== */
  const categories = [
    { key: "all", label: "All" },
    { key: "painting", label: "Painting" },
    { key: "illustration", label: "Illustration" },
    { key: "digital", label: "Digital" },
    { key: "mixed", label: "Mixed" },
  ];

  return (
    <div className="catalog-page">

      {/* HEADER */}
      <header className="catalog-header">
        <h1 className="catalog-title">Digital Catalog</h1>
        <p className="catalog-sub">Explore the artwork collection</p>
      </header>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <div className="chip-container">
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`chip ${category === cat.key ? "active" : ""}`}
              onClick={() => setCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search artwork..."
          className="catalog-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* MASONRY GRID */}
      <div className="masonry-grid">
        {loading
          ? [...Array(8)].map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-img" />
              </div>
            ))
          : filtered.map((item) => (
              <CatalogItemCard
                key={item.id}
                item={item}
                onOpen={() => setSelectedItem(item)}
                onZoom={() => setZoomImg(item.image)}
              />
            ))}
      </div>

      {/* DETAILS MODAL */}
      {selectedItem && (
        <div className="detail-modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
            
            <img
              src={selectedItem.image}
              className="detail-img"
              alt={selectedItem.name}
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
            />

            <div className="detail-info">
              <h2>{selectedItem.name}</h2>
              <span className="detail-year">{selectedItem.year}</span>
              <p className="detail-description">{selectedItem.description}</p>

              <div className="detail-list">
                <p><strong>Support:</strong> {selectedItem.support}</p>
                <p><strong>Technique:</strong> {selectedItem.technique}</p>
                <p><strong>Size:</strong> {selectedItem.size}</p>
              </div>
            </div>

            <button className="detail-close-btn" onClick={() => setSelectedItem(null)}>
              ✕
            </button>
          </div>
        </div>
      )}

      {/* PINCH-TO-ZOOM MODAL */}
      {zoomImg && <ZoomViewer src={zoomImg} onClose={() => setZoomImg(null)} />}
    </div>
  );
}
