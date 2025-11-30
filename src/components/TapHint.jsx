import React from "react";
import "../styles/TapHint.css";
import { Icons } from "./ui/Icons";

export default function TapHint({ onTap }) {
  return (
    <div className="tap-hint" onClick={onTap}>
      <div className="tap-waves"></div>
      <div className="tap-text">{Icons.sun({ size: 24 })}</div>
    </div>
  );
}