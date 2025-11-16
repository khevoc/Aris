// src/components/CrocodileScene.jsx
import React, { useEffect, useRef, useState } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import "../styles/CrocodileScene.css";

import crocImg from "../assets/crocodile.jpg";
import diceImg from "../assets/dice.png";
import sunglassesImg from "../assets/sunglasses.png";

const VIDEO_SRC = "/bg-video.mp4";
const AMBIENT_AUDIO = "/sounds/ocean-waves.mp3";

const PAINTING_W = 3;
const PAINTING_H = 3;

/* UV → PLANO */
function uvToPlane([u, v], z = 0.03) {
  const x = (u - 0.5) * PAINTING_W;
  const y = (0.5 - v) * PAINTING_H;
  return [x, y, z];
}

/* VIDEO DENTRO DEL CUADRO */
function VideoPainting() {
  const meshRef = useRef();
  const video = document.createElement("video");
  const [tex, setTex] = useState(null);

  useEffect(() => {
    video.src = VIDEO_SRC;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";

    video.onloadeddata = () => {
      video.play();
      const texture = new THREE.VideoTexture(video);
      texture.encoding = THREE.sRGBEncoding;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.repeat.x = -1;   // invierte horizontal
      texture.offset.x = 1;
      texture.generateMipmaps = false;

      setTex(texture);
    };
    video.load();

  }, []);

  useFrame(() => tex && (tex.needsUpdate = true));

  if (!tex) return null;

  return (
    <mesh
      ref={meshRef}
      position={[0, 1.2, -2]}
      scale={[3 * PAINTING_W, 3 * PAINTING_H, 1]}
    >
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

/* BASE COCODRILO */
function CrocodileBase() {
  const tex = useLoader(THREE.TextureLoader, crocImg);

  return (
    <mesh position={[0, 0, 0.25]} scale={[PAINTING_W, PAINTING_H, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial map={tex} />
    </mesh>
  );
}

/* ELEMENTOS PNG EN RELIEVE */
function DetailUV({ src, uv, baseW, baseH, extraZ = 0 }) {
  const tex = useLoader(THREE.TextureLoader, src);
  const ref = useRef();
  const [scale, setScale] = useState([1, 1, 1]);

  const basePos = uvToPlane(uv, 0.18 + extraZ);

  useEffect(() => {
    const ratio = tex.image.width / tex.image.height;
    setScale([baseW * ratio, baseH, 1]);
  }, [tex]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.position.z = basePos[2] + Math.sin(t * 2) * 0.02;
  });

  return (
    <mesh ref={ref} position={basePos} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        map={tex}
        transparent
        metalness={0.7}
        roughness={0.25}
        emissive="#fff"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

/* MARCO */
function Frame() {
  return (
    <mesh position={[0, 0, 0.12]}>
      <boxGeometry args={[PAINTING_W + 0.25, PAINTING_H + 0.25, 0.2]} />
      <meshStandardMaterial color="#080808" metalness={0.55} roughness={0.35} />
    </mesh>
  );
}

/* LUCES PROFESIONALES */
function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 2, 4]} intensity={1.4} />
      <pointLight position={[-2, -1, 3]} intensity={0.7} />
      <pointLight position={[0, 1, 2]} intensity={0.4} color="#ffdca8" />
    </>
  );
}

/* ESCENA */
export default function CrocodileScene({
  meta = {
    title: "Crocovacations",
    year: "2025",
    medium: "Mixed Reality Artwork - Acrylic on Canvas",
    description:
      "An interactive experience featuring a stylish crocodile enjoying a coastal drive. A blend of surreal humor and tropical palette.",
  },
}) {
  const audioRef = useRef(null);
  const [audioOn, setAudioOn] = useState(false);

  

  const toggleAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(AMBIENT_AUDIO);
      audioRef.current.loop = true;
    }

    if (audioOn) {
      audioRef.current.pause();
      setAudioOn(false);
    } else {
      audioRef.current.volume = 1;
      audioRef.current.play();
      setAudioOn(true);
    }
  };

  return (
    <div className="crocodile-root">

      {/* ⭐ BOTÓN DENTRO DEL CANVAS — FIJO Y SIN ROTAR ⭐ */}
      <div className="ambient-btn-overlay">
        <button onClick={toggleAudio}>
          {audioOn ? "🔈 Stop Ambient" : "🔊 Ambient"}
        </button>
      </div>

      <div className="canvas-box">
        <Canvas camera={{ position: [0, 0.3, 4], fov: 48 }}>
          <Lights />
          <Frame />
          <VideoPainting />
          <CrocodileBase />

          <DetailUV
            src={diceImg}
            uv={[0.14, 0.28]}
            baseW={0.32}
            baseH={0.23}
          />

          <DetailUV
            src={sunglassesImg}
            uv={[0.52, 0.50]}
            baseW={0.70}
            baseH={0.62}
            extraZ={0.12}
          />

          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* ⭐ TEXTO MÁS VISIBLE Y PROFESIONAL ⭐ */}
      <div className="art-description improved-text">
        <h2>
          {meta.title}
          <span> — {meta.year}</span>
        </h2>

        <p className="medium">{meta.medium}</p>

        <p className="desc-text">{meta.description}</p>
      </div>
    </div>
  );
}
