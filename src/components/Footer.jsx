import React from "react";
import { Icons } from "./ui/Icons";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="fx-footer">

      {/* VIDEO / PARTICLES BACKGROUND */}
      <div className="fx-footer-bg">
        <video
          src="/footer-waves.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/* CONTENT */}
      <div className="fx-footer-content">

        <div className="fx-footer-icons">
          <a href="https://instagram.com/TU_INSTAGRAM" target="_blank" rel="noreferrer">
            <Icons.instagram size={22}/>
          </a>

          <a href="https://www.etsy.com/shop/TU_TIENDA" target="_blank" rel="noreferrer">
            <Icons.store size={22}/>
          </a>

          <a href="https://TU_WEB.com" target="_blank" rel="noreferrer">
            <Icons.globe size={22}/>
          </a>

          <a href="mailto:TU_EMAIL@gmail.com">
            <Icons.mail size={22}/>
          </a>
        </div>

        <p className="fx-footer-text">
          © {new Date().getFullYear()} LeoAetheris — Art & Mixed Reality
        </p>
      </div>
    </footer>
  );
}
