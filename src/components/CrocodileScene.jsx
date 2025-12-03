// src/components/CrocodileScene_AR.jsx
import React, { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment, Html, Float } from "@react-three/drei";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";
import { Icons } from "./ui/Icons";

import "../styles/CrocodileScene.css";

import crocImg from "../assets/crocodile.jpg";
import diceImg from "../assets/dice.png";
import armImg from "../assets/arm.png";
import sunglassesImg from "../assets/sunglasses.png";

import palmImg from "../assets/palm.png";
import palm2Img from "../assets/palm-2.png";
import palmSImg from "../assets/palm-s.png";
import birdImg from "../assets/bird2.gif";

const AMBIENT_AUDIO = "/sounds/ocean-waves.mp3";

const PAINTING_W = 3;
const PAINTING_H = 3;

// Helper UV → plane
function uvToPlane([u, v], z = 0.03) {
  const x = (u - 0.5) * PAINTING_W;
  const y = (0.5 - v) * PAINTING_H;
  return [x, y, z];
}

/* ----------------------------- BASE DEL COCODRILO ----------------------------- */
function CrocodileBase() {
  const tex = useLoader(THREE.TextureLoader, crocImg);

  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
  }, [tex]);

  return (
    <mesh position={[0, 0, 0.22]} scale={[PAINTING_W, PAINTING_H, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        map={tex}
        roughness={0.55}
        metalness={0.12}
      />
    </mesh>
  );
}

/* ----------------------------- ELEMENTO PNG EN RELIEVE ----------------------------- */
function DetailUV({ src, uv, baseW, baseH, extraZ = 0, floatIntensity = 0.02 }) {
  const tex = useLoader(THREE.TextureLoader, src);
  const ref = useRef();
  const [scale, setScale] = useState([1, 1, 1]);
  const basePos = uvToPlane(uv, 0.18 + extraZ);

  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    if (tex.image && tex.image.width && tex.image.height) {
      const ratio = tex.image.width / tex.image.height;
      setScale([baseW * ratio, baseH, 1]);
    }
  }, [tex, baseW, baseH]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.z = basePos[2] + Math.sin(t * 2.0) * floatIntensity;
  });

  return (
    <mesh ref={ref} position={basePos} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        map={tex}
        transparent
        alphaTest={0.02}
        side={THREE.DoubleSide}
        metalness={0.45}
        roughness={0.25}
        emissive={"#ffffff"}
        emissiveIntensity={0.18}
      />
    </mesh>
  );
}

/* ----------------------------- PALMERAS ----------------------------- */
function PalmCard({ src, position, scale = 2.5 }) {
  const tex = useLoader(THREE.TextureLoader, src);
  const ref = useRef();

  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.flipY = false;
    tex.needsUpdate = true;
  }, [tex]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.z = Math.sin(t * 0.7) * 0.05;
    ref.current.position.x = position[0] + Math.sin(t * 0.4) * 0.06;
  });

  return (
    <mesh ref={ref} position={position} scale={[scale, scale, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        map={tex}
        transparent
        side={THREE.DoubleSide}
        roughness={0.5}
        metalness={0.08}
        emissive={"#101010"}
        emissiveIntensity={0.06}
      />
    </mesh>
  );
}

/* ----------------------------- GAVIOTAS ----------------------------- */
function SingleSeagull({ src, baseY, scale, startX, endX, delay, speed, z }) {
  const texture = useLoader(THREE.TextureLoader, src);
  const ref = useRef();

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = false;
    texture.needsUpdate = true;
  }, [texture]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed + delay;
    const x = startX + ((endX - startX) * (t % 1));
    const y = baseY + Math.sin(t * 4.0) * 0.05;
    ref.current.position.set(x, y, z);
  });

  return (
    <mesh ref={ref} scale={[scale, scale, scale]} renderOrder={2}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        alphaTest={0.02}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function SeagullFlock({
  src = birdImg,
  count = 4,
  y = 0.9,
  scale = 0.35,
  z = -1.0,
  startX = -5,
  endX = 5,
}) {
  return (
    <group renderOrder={10}>
      {Array.from({ length: count }).map((_, i) => (
        <SingleSeagull
          key={i}
          src={src}
          baseY={y + i * 0.15}
          scale={scale}
          startX={startX}
          endX={endX}
          speed={0.02 + i * 0.01}
          delay={i * 0.4}
          z={z}
        />
      ))}
    </group>
  );
}

/* ----------------------------- MARCO Y PLANO AR ----------------------------- */
function Frame() {
  return (
    <mesh position={[0, 0, 0.1]}>
      <boxGeometry args={[PAINTING_W + 0.3, PAINTING_H + 0.3, 0.15]} />
      <meshStandardMaterial
        color={"#070709"}
        metalness={0.65}
        roughness={0.25}
      />
    </mesh>
  );
}

function GroundAR() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.4, 0]}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial
        color={"#1b262f"}
        roughness={0.9}
        metalness={0.05}
      />
    </mesh>
  );
}

/* ----------------------------- RIG CINEMÁTICO AR ----------------------------- */
function CrocodileARWorld() {
  const groupRef = useRef();
  const { mouse, camera } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const isMobile = window.innerWidth <= 768;

    const targetRotY = (mouse.x || 0) * (isMobile ? 0.08 : 0.16);
    const targetRotX = (mouse.y || 0) * (isMobile ? -0.06 : -0.12);
    const targetPosY = Math.sin(t * 0.4) * 0.05;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY,
      0.08
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX,
      0.08
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetPosY,
      0.08
    );

    // suave "walk in" de cámara
    const targetZ = isMobile ? 3.4 : 4.0;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.03);
  });

  return (
    <group ref={groupRef}>
      {/* iluminación y entorno */}
      <Environment preset="sunset" />
      <ambientLight intensity={0.35} />
      <directionalLight position={[2, 3, 4]} intensity={1.2} />
      <pointLight position={[-2, 1, 2]} intensity={0.6} color={"#ffcf9a"} />

      {/* plano AR y elementos */}
      <GroundAR />

      <Float speed={0.9} rotationIntensity={0.2} floatIntensity={0.12}>
        <Frame />
        <CrocodileBase />
        <DetailUV
          src={diceImg}
          uv={[0.3, 0.32]}
          baseW={0.62}
          baseH={0.73}
          extraZ={0.12}
          floatIntensity={0.025}
        />
        <DetailUV
          src={armImg}
          uv={[0.22, 0.74]}
          baseW={1.2}
          baseH={1.2}
          extraZ={0.1}
          floatIntensity={0.03}
        />
        <DetailUV
          src={sunglassesImg}
          uv={[0.51, 0.51]}
          baseW={0.7}
          baseH={0.7}
          extraZ={0.1}
          floatIntensity={0.018}
        />
      </Float>

      {/* palmeras & gaviotas */}
      <PalmCard src={palmImg} position={[-2.6, -0.8, -0.4]} scale={3.2} />
      <PalmCard src={palmSImg} position={[2.4, -0.4, -0.7]} scale={2.4} />
      <PalmCard src={palm2Img} position={[2.9, -0.5, -1.0]} scale={2.9} />
      <SeagullFlock />
    </group>
  );
}

/* ----------------------------- COMPONENTE PRINCIPAL AR ----------------------------- */
export default function CrocodileScene_AR({
  meta = {
    title: "Crocovacations AR",
    year: "2025",
    subtitle: "Beach Immersive Mode",
  },
}) {
  const audioRef = useRef(null);
  const [audioOn, setAudioOn] = useState(false);
  const navigate = useNavigate();

  // limpieza al desmontar
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
    <div className="crocodile-ar-root">
      <div className="croc-ar-canvas-shell">
        {/* HUD superior superpuesto */}
        <div className="croc-ar-hud">
          <button
            className="croc-ar-hud-btn"
            onClick={() => navigate("/")}
          >
            <Icons.arrowLeft size={18} />
          </button>

          <div className="croc-ar-meta-pill">
            <span className="croc-ar-meta-title">{meta.title}</span>
            <span className="croc-ar-meta-dot">•</span>
            <span className="croc-ar-meta-year">{meta.year}</span>
          </div>

          <button
            className={`croc-ar-hud-btn ${audioOn ? "is-on" : ""}`}
            onClick={toggleAudio}
          >
            {audioOn ? <Icons.volumeOff size={18} /> : <Icons.volumeOn size={18} />}
          </button>
        </div>

        <Canvas
          camera={{ position: [0, 0.4, 5], fov: 50 }}
          dpr={[1, 1.8]}
          gl={{ antialias: true, powerPreference: "high-performance" }}
        >
          <color attach="background" args={["#02040a"]} />
          <Suspense fallback={null}>
            <CrocodileARWorld />
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              maxPolarAngle={Math.PI / 1.9}
              minPolarAngle={Math.PI / 3}
            />
            {/* Etiqueta sutil inferior dentro del canvas */}
            <Html
              position={[0, -1.35, 0.5]}
              transform
              distanceFactor={3.2}
              className="croc-ar-caption"
            >
              <div className="croc-ar-caption-inner">
                <span>Drag to explore</span>
              </div>
            </Html>
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
