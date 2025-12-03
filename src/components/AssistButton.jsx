// src/components/AssistButton.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icons } from "./ui/Icons";
import "../styles/AssistButton.css";

export default function AssistButton() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div className="assist-wrapper">
      {/* BURBUJAS RADIALES */}
      <div className={`assist-bubbles ${open ? "open" : ""}`}>

        <button className="assist-bubble" onClick={() => go("/")}>
          <Icons.home size={20} />
        </button>

        <button className="assist-bubble" onClick={() => go("/store")}>
          <Icons.shoppingBag size={20} />
        </button>

        <button className="assist-bubble" onClick={() => go("/store")}>
          <Icons.album size={20} />
        </button>

      </div>

      {/* BOTÓN PRINCIPAL */}
      <button
        className={`assist-main ${open ? "open" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        <Icons.menu size={24} />
      </button>
    </div>
  );
}
