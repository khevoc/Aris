// src/components/ZoomViewer.jsx
import React, { useRef, useState, useEffect } from "react";

export default function ZoomViewer({ src, onClose }) {
  const wrapperRef = useRef(null);
  const imgRef = useRef(null);

  const [scale, setScale] = useState(1);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const lastTouch = useRef(null);
  const pinchStart = useRef(null);

  /* ---------------------------------------------------------
     Prevent ESC → close
  --------------------------------------------------------- */
  useEffect(() => {
    const handleEsc = e => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  /* ---------------------------------------------------------
     Desktop wheel zoom
  --------------------------------------------------------- */
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.002;
    const newScale = Math.min(Math.max(1, scale + delta), 4);
    setScale(newScale);
  };

  /* ---------------------------------------------------------
     Drag (desktop + touch)
  --------------------------------------------------------- */
  const handlePointerDown = (e) => {
    wrapperRef.current.setPointerCapture(e.pointerId);
    lastTouch.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (!lastTouch.current) return;

    const dx = e.clientX - lastTouch.current.x;
    const dy = e.clientY - lastTouch.current.y;

    lastTouch.current = { x: e.clientX, y: e.clientY };

    // pan only if zoomed
    if (scale > 1) {
      setOffset(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }));
    }
  };

  const handlePointerUp = () => {
    lastTouch.current = null;
  };

  /* ---------------------------------------------------------
     Pinch to zoom (mobile multitouch)
  --------------------------------------------------------- */
  const distance = (t1, t2) =>
    Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      const [t1, t2] = e.touches;

      if (!pinchStart.current) {
        pinchStart.current = {
          distance: distance(t1, t2),
          scale
        };
      } else {
        const newDist = distance(t1, t2);
        const factor = newDist / pinchStart.current.distance;

        let newScale = pinchStart.current.scale * factor;
        newScale = Math.min(Math.max(1, newScale), 4);

        setScale(newScale);
      }
    }
  };

  const endPinch = () => {
    pinchStart.current = null;
  };

  /* ---------------------------------------------------------
     Reset zoom when closing
  --------------------------------------------------------- */
  useEffect(() => {
    return () => {
      setScale(1);
      setOffset({ x: 0, y: 0 });
      pinchStart.current = null;
      lastTouch.current = null;
    };
  }, []);

  /* ---------------------------------------------------------
     Render
  --------------------------------------------------------- */
  return (
    <div className="zoom-overlay" onClick={onClose}>
      <div
        className="zoom-box"
        ref={wrapperRef}
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={endPinch}
        onTouchCancel={endPinch}
      >
        <button
          className="zoom-close-btn"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="zoom-img-wrapper">
          <img
            ref={imgRef}
            src={src}
            alt=""
            className="zoom-img"
            draggable="false"
            onContextMenu={(e) => e.preventDefault()}
            style={{
              transform: `
                translate(${offset.x}px, ${offset.y}px)
                scale(${scale})
              `
            }}
          />
        </div>

        <div className="zoom-info">
          <p>{scale > 1 ? "Drag / pinch to explore" : "Pinch or scroll to zoom"}</p>
        </div>
      </div>
    </div>
  );
}
