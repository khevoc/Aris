import React, { useRef, useState, useEffect } from "react";

export default function ZoomViewer({ src, onClose }) {
  const wrapperRef = useRef(null);
  const imgRef = useRef(null);

  /** ZOOM STATE **/
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [visible, setVisible] = useState(false);

  /** HELPERS **/
  const pointerData = useRef({ dragging: false, lastX: 0, lastY: 0 });
  const pinchData = useRef(null);
  const tapData = useRef({ lastTap: 0 });
  const swipeStart = useRef(null);

  /* -------------------------------------------------------------------
     MOUNT → Fade in + lock scroll
  ------------------------------------------------------------------- */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    setTimeout(() => setVisible(true), 10);

    return () => (document.body.style.overflow = "auto");
  }, []);

  /* -------------------------------------------------------------------
     Close viewer with animation
  ------------------------------------------------------------------- */
  const closeViewer = () => {
    setVisible(false);
    setTimeout(onClose, 150);
  };

  /* -------------------------------------------------------------------
     ESC Key closes
  ------------------------------------------------------------------- */
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && closeViewer();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* -------------------------------------------------------------------
     DOUBLE TAP ZOOM (iOS style)
  ------------------------------------------------------------------- */
  const handleTap = (e) => {
    const now = Date.now();
    if (now - tapData.current.lastTap < 250) {
      // Toggle zoom level
      setScale((prev) => (prev > 1 ? 1 : 2.6));
      setOffset({ x: 0, y: 0 });
    }
    tapData.current.lastTap = now;
  };

  /* -------------------------------------------------------------------
     WHEEL ZOOM (desktop) — FIXED (no passive errors)
  ------------------------------------------------------------------- */
  const onWheel = (e) => {
    e.preventDefault(); // Now valid because we attach with passive:false

    const delta = e.deltaY * -0.002;
    let newScale = scale + delta;

    newScale = Math.max(1, Math.min(4, newScale));
    setScale(newScale);
  };

  /* -------------------------------------------------------------------
     DRAG / PAN
  ------------------------------------------------------------------- */
  const onPointerDown = (e) => {
    pointerData.current.dragging = true;
    pointerData.current.lastX = e.clientX;
    pointerData.current.lastY = e.clientY;
    wrapperRef.current.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!pointerData.current.dragging || scale === 1) return;

    const dx = e.clientX - pointerData.current.lastX;
    const dy = e.clientY - pointerData.current.lastY;

    pointerData.current.lastX = e.clientX;
    pointerData.current.lastY = e.clientY;

    setOffset((o) => ({
      x: o.x + dx,
      y: o.y + dy,
    }));
  };

  const onPointerUp = () => {
    pointerData.current.dragging = false;
  };

  /* -------------------------------------------------------------------
     PINCH-TO-ZOOM (mobile)
  ------------------------------------------------------------------- */
  const distance = (t1, t2) =>
    Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

  const onTouchMove = (e) => {
    if (e.touches.length !== 2) return;

    e.preventDefault(); // Safe because passive:false

    const [t1, t2] = e.touches;
    const distNow = distance(t1, t2);

    if (!pinchData.current) {
      pinchData.current = { dist: distNow, startScale: scale };
      return;
    }

    let newScale = (distNow / pinchData.current.dist) * pinchData.current.startScale;
    newScale = Math.max(1, Math.min(4, newScale));
    setScale(newScale);
  };

  const endPinch = () => {
    pinchData.current = null;
  };

  /* -------------------------------------------------------------------
     SWIPE DOWN TO CLOSE (only when zoom = 1)
  ------------------------------------------------------------------- */
  const onTouchStart = (e) => {
    if (e.touches.length === 1 && scale === 1) {
      swipeStart.current = e.touches[0].clientY;
    }
  };

  const onTouchEnd = (e) => {
    if (!swipeStart.current) return;

    const end = e.changedTouches[0].clientY;
    if (end - swipeStart.current > 120) {
      closeViewer();
    }
    swipeStart.current = null;
  };

  /* -------------------------------------------------------------------
     LIMIT PANNING AREA
  ------------------------------------------------------------------- */
  const bounded = {
    x: Math.max(Math.min(offset.x, 300), -300),
    y: Math.max(Math.min(offset.y, 300), -300),
  };

  /* -------------------------------------------------------------------
     FIX: Attach wheel/touch listeners with passive:false (NO ERRORS)
  ------------------------------------------------------------------- */
  useEffect(() => {
    const box = wrapperRef.current;
    if (!box) return;

    box.addEventListener("wheel", onWheel, { passive: false });
    box.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      box.removeEventListener("wheel", onWheel);
      box.removeEventListener("touchmove", onTouchMove);
    };
  }, [scale]);

  /* -------------------------------------------------------------------
     RENDER
  ------------------------------------------------------------------- */
  return (
    <div
      className={`zoom-overlay ${visible ? "visible" : ""}`}
      onClick={closeViewer}
    >
      <div
        className="zoom-box"
        ref={wrapperRef}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchEnd={(e) => {
          handleTap(e);
          onTouchEnd(e);
          endPinch();
        }}
      >
        <button className="zoom-close-btn" onClick={closeViewer}>
          ✕
        </button>

        <div className="zoom-img-wrapper">
          <img
            ref={imgRef}
            src={src}
            alt=""
            draggable="false"
            className="zoom-img"
            onContextMenu={(e) => e.preventDefault()}
            style={{
              transform: `translate(${bounded.x}px, ${bounded.y}px) scale(${scale})`,
              transition: pointerData.current.dragging ? "none" : "transform 0.12s ease-out",
            }}
          />
        </div>

        <p className="zoom-info">
          {scale === 1 ? "Pinch or scroll to zoom" : "Drag / pinch to explore"}
        </p>
      </div>
    </div>
  );
}
