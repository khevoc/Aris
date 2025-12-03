// src/components/CrocodileMuseum.jsx
import React, { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { OrbitControls, Html, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";
import { Icons } from "./ui/Icons";

import "../styles/CrocodileScene.css";

import crocImg from "../assets/crocodile.jpg";
import diceImg from "../assets/dice.png";
import armImg from "../assets/arm.png";
import sunglassesImg from "../assets/sunglasses.png";

const AMBIENT_AUDIO = "/sounds/ocean-waves.mp3";

const PAINTING_W = 2.8;
const PAINTING_H = 2.8;

/* -------------------------- PARED Y PISO DE MUSEO -------------------------- */
function MuseumRoom() {
  return (
    <group>
      {/* pared principal */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial
          color={"#111318"}
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>

      {/* paredes laterales sutiles */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-4, 0, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial
          color={"#0c0e14"}
          roughness={0.95}
          metalness={0.03}
        />
      </mesh>
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[4, 0, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial
          color={"#0c0e14"}
          roughness={0.95}
          metalness={0.03}
        />
      </mesh>

      {/* piso */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial
          color={"#070809"}
          roughness={0.3}
          metalness={0.25}
        />
      </mesh>

      {/* luz cenital suave */}
      <spotLight
        position={[0, 3.2, 1.4]}
        angle={0.6}
        penumbra={0.6}
        intensity={2.2}
        color={"#f4f0e8"}
        castShadow
      />
      <ambientLight intensity={0.25} />
    </group>
  );
}

/* -------------------------- OBRA EN LA PARED -------------------------- */
function MuseumPainting() {
  const tex = useLoader(THREE.TextureLoader, crocImg);
  const frameRef = useRef();

  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
  }, [tex]);

  useFrame(({ clock }) => {
    if (!frameRef.current) return;
    const t = clock.getElapsedTime();
    const targetRotY = Math.sin(t * 0.15) * 0.03;
    frameRef.current.rotation.y = THREE.MathUtils.lerp(
      frameRef.current.rotation.y,
      targetRotY,
      0.06
    );
  });

  return (
    <group ref={frameRef} position={[0, 0.3, 0]} castShadow>
      {/* marco */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[PAINTING_W + 0.28, PAINTING_H + 0.28, 0.14]} />
        <meshStandardMaterial
          color={"#151923"}
          metalness={0.6}
          roughness={0.32}
        />
      </mesh>

      {/* cuadro */}
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[PAINTING_W, PAINTING_H]} />
        <meshStandardMaterial
          map={tex}
          roughness={0.45}
          metalness={0.1}
        />
      </mesh>

      {/* sutil relieve de elementos */}
      <mesh position={[-0.3, -0.4, 0.12]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshStandardMaterial
          map={useLoader(THREE.TextureLoader, armImg)}
          transparent
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      <mesh position={[0.6, -0.2, 0.11]}>
        <planeGeometry args={[0.6, 0.6]} />
        <meshStandardMaterial
          map={useLoader(THREE.TextureLoader, diceImg)}
          transparent
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      <mesh position={[0.12, 0.15, 0.13]}>
        <planeGeometry args={[0.7, 0.5]} />
        <meshStandardMaterial
          map={useLoader(THREE.TextureLoader, sunglassesImg)}
          transparent
          roughness={0.3}
          metalness={0.35}
          emissive={"#ffffff"}
          emissiveIntensity={0.18}
        />
      </mesh>
    </group>
  );
}

/* -------------------------- REFLEXIÓN EN EL PISO -------------------------- */
function FloorReflection() {
  const { scene } = useThree();
  const floorRef = useRef();

  useFrame(() => {
    if (!floorRef.current) return;
    floorRef.current.material.envMapIntensity = 0.6;
  });

  return (
    <mesh
      ref={floorRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1.99, 0.01]}
      receiveShadow
    >
      <planeGeometry args={[8, 7]} />
      <meshStandardMaterial
        color={"#050608"}
        metalness={0.9}
        roughness={0.1}
        envMapIntensity={0.6}
      />
    </mesh>
  );
}

/* -------------------------- RIG / CÁMARA -------------------------- */
function MuseumRig() {
  const groupRef = useRef();
  const { mouse, camera } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const mobile = window.innerWidth <= 768;

    const targetX = (mouse.x || 0) * (mobile ? 0.4 : 0.8);
    const targetY = 0;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.06);
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      0.4,
      0.04
    );

    const targetZ = mobile ? 4.2 : 4.8;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.06);
    camera.lookAt(0, 0.2, 0);

    groupRef.current.position.y = Math.sin(t * 0.25) * 0.02;
  });

  return (
    <group ref={groupRef}>
      <Environment preset="city" />
      <MuseumRoom />
      <MuseumPainting />
      <FloorReflection />
    </group>
  );
}

/* -------------------------- COMPONENTE PRINCIPAL -------------------------- */
export default function CrocodileMuseum({
  meta = {
    title: "Crocovacations",
    year: "2025",
    medium: "Mixed Reality Artwork",
    location: "Gallery Room 03",
  },
}) {
  const audioRef = useRef(null);
  const [audioOn, setAudioOn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

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
    <div className="croc-museum-root">
      <div className="croc-museum-canvas-shell">
        {/* HUD sutil superpuesto */}
        <div className="croc-museum-hud">
          <button
            className="croc-museum-icon-btn"
            onClick={() => navigate("/")}
          >
            <Icons.arrowLeft size={18} />
          </button>

          <div className="croc-museum-label">
            <div className="croc-museum-title-line">
              <span className="croc-museum-title">{meta.title}</span>
              <span className="croc-museum-year">· {meta.year}</span>
            </div>
            <span className="croc-museum-medium">{meta.medium}</span>
          </div>

          <button
            className={`croc-museum-icon-btn ${audioOn ? "is-on" : ""}`}
            onClick={toggleAudio}
          >
            {audioOn ? <Icons.volumeOff size={18} /> : <Icons.volumeOn size={18} />}
          </button>
        </div>

        <Canvas
          camera={{ position: [0, 0.4, 6], fov: 45 }}
          dpr={[1, 1.8]}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          shadows
        >
          <color attach="background" args={["#05060a"]} />
          <Suspense fallback={null}>
            <MuseumRig />
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              maxPolarAngle={Math.PI / 2.1}
              minPolarAngle={Math.PI / 3}
            />
            {/* pequeña plaquita en 3D debajo de la obra */}
            <Html
              position={[0, -1.25, 0]}
              transform
              distanceFactor={3}
              className="croc-museum-plaque"
            >
              <div className="croc-museum-plaque-inner">
                <div>{meta.title}</div>
                <div className="croc-museum-plaque-sub">
                  {meta.year} · {meta.location}
                </div>
              </div>
            </Html>
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
