// src/components/CrocodileScene_AR.jsx
import React, { useEffect, useRef, useState, Suspense, useMemo } from "react";
import {
  Canvas,
  useFrame,
  useThree,
  useLoader,
  extend,
} from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Html,
  Float,
  shaderMaterial,
} from "@react-three/drei";
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

const VIDEO_SRC = "/bg-video.mp4";
const AMBIENT_AUDIO = "/sounds/ocean-waves.mp3";

const PAINTING_W = 3;
const PAINTING_H = 3;

/* -------------------------------------------------------------------------- */
/* Helper UV → plano                                                          */
/* -------------------------------------------------------------------------- */
function uvToPlane([u, v], z = 0.03) {
  const x = (u - 0.5) * PAINTING_W;
  const y = (0.5 - v) * PAINTING_H;
  return [x, y, z];
}

/* -------------------------------------------------------------------------- */
/* ShaderMaterial para video con efecto de olas / calor (opción C)           */
/* -------------------------------------------------------------------------- */
const VideoWaveMaterial = shaderMaterial(
  {
    uTime: 0,
    uTexture: null,
    uStrength: 0.9,
  },
  /* vertex shader */
  /* glsl */ `
    varying vec2 vUv;
    uniform float uTime;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // Pequeñas olas en Z para simular distorsión
      float wave1 = sin(pos.x * 2.5 + uTime * 0.7) * 0.04;
      float wave2 = cos(pos.y * 3.0 + uTime * 0.9) * 0.03;
      pos.z += wave1 + wave2;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  /* fragment shader */
  /* glsl */ `
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform float uStrength;

    void main() {
      vec2 uv = vUv;

      // Distorsión en UV tipo "heat waves"
      uv.y += sin(uv.x * 6.0 + uTime * 1.4) * 0.015 * uStrength;
      uv.x += cos(uv.y * 5.0 - uTime * 1.2) * 0.012 * uStrength;

      vec4 color = texture2D(uTexture, uv);

      // Ligero grading cálido / nocturno
      vec3 tint = vec3(0.02, 0.05, 0.09);
      color.rgb = mix(color.rgb, tint, 0.16);

      gl_FragColor = color;
    }
  `
);

extend({ VideoWaveMaterial });

/* -------------------------------------------------------------------------- */
/* BASE DEL COCODRILO                                                         */
/* -------------------------------------------------------------------------- */
function CrocodileBase() {
  const tex = useLoader(THREE.TextureLoader, crocImg);

  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
  }, [tex]);

  return (
    <mesh position={[0, 0, 0.22]} scale={[PAINTING_W, PAINTING_H, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial map={tex} roughness={0.55} metalness={0.12} />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/* ELEMENTO PNG EN RELIEVE (dado, brazo, gafas)                               */
/* -------------------------------------------------------------------------- */
function DetailUV({
  src,
  uv,
  baseW,
  baseH,
  extraZ = 0,
  floatIntensity = 0.02,
  emissive = "#ffffff",
  emissiveIntensity = 0.18,
}) {
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
    ref.current.rotation.z = Math.sin(t * 0.8) * 0.02;
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
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/* PALMERAS                                                                   */
/* -------------------------------------------------------------------------- */
function PalmCard({ src, position, scale = 2.5, sway = 0.05 }) {
  const tex = useLoader(THREE.TextureLoader, src);
  const ref = useRef();

  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.flipY = true;
    tex.needsUpdate = true;
  }, [tex]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.z = Math.sin(t * 0.7) * sway;
    ref.current.position.x = position[0] + Math.sin(t * 0.4) * 0.06;
  });

  return (
    <mesh ref={ref} position={position} scale={[scale, scale, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        map={tex}
        transparent
        side={THREE.DoubleSide}
        roughness={0.45}
        metalness={0.1}
        emissive={"#151515"}
        emissiveIntensity={0.08}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/* GAVIOTAS                                                                   */
/* -------------------------------------------------------------------------- */
function SingleSeagull({
  src,
  baseY,
  scale,
  startX,
  endX,
  delay,
  speed,
  z,
  curve = 0.35,
}) {
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
    const progress = t % 1;

    const x = startX + (endX - startX) * progress;
    const base = baseY + Math.sin(t * 4.0) * 0.06;
    const y = base + Math.sin(progress * Math.PI * 2.0) * curve * 0.2;

    ref.current.position.set(x, y, z);
    ref.current.rotation.z = Math.sin(t * 3.0) * 0.15;
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
  count = 5,
  y = 0.9,
  scale = 0.35,
  z = -1.0,
  startX = -6,
  endX = 5.5,
}) {
  const birds = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        delay: i * 0.37,
        speed: 0.02 + i * 0.012,
        curve: 0.2 + i * 0.05,
        offsetY: i * 0.15,
      })),
    [count]
  );

  return (
    <group renderOrder={10}>
      {birds.map((b, i) => (
        <SingleSeagull
          key={i}
          src={src}
          baseY={y + b.offsetY}
          scale={scale}
          startX={startX}
          endX={endX}
          speed={b.speed}
          delay={b.delay}
          z={z}
          curve={b.curve}
        />
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* MARCO Y PLANO AR                                                           */
/* -------------------------------------------------------------------------- */
function Frame() {
  return (
    <mesh position={[0, 0, 0.1]}>
      <boxGeometry args={[PAINTING_W + 0.3, PAINTING_H + 0.3, 0.18]} />
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
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
      <planeGeometry args={[16, 16]} />
      <meshStandardMaterial
        color={"#050910"}
        roughness={0.95}
        metalness={0.04}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/* FONDO DE VIDEO CON SHADER DE OLAS                                         */
/* -------------------------------------------------------------------------- */
function VideoBackground() {
  const materialRef = useRef();
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = VIDEO_SRC;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";

    const onLoaded = () => {
      video.play().catch(() => {});
      const tex = new THREE.VideoTexture(video);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.generateMipmaps = false;
      tex.needsUpdate = true;
      setTexture(tex);
    };

    video.addEventListener("loadeddata", onLoaded);
    video.load();

    return () => {
      video.pause();
      video.removeEventListener("loadeddata", onLoaded);
    };
  }, []);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uTime = clock.getElapsedTime();
    }
    if (texture) {
      texture.needsUpdate = true;
    }
  });

  if (!texture) return null;

  return (
    <mesh position={[0, 0.3, -4.2]} scale={[13, 7.2, 1]}>
      <planeGeometry args={[1, 1, 64, 64]} />
      {/* nombre del material corresponde al extend({ VideoWaveMaterial }) */}
      <videoWaveMaterial
        ref={materialRef}
        uTexture={texture}
        uStrength={0.95}        
        flipX={true}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/* RIG CINEMÁTICO AR                                                          */
/* -------------------------------------------------------------------------- */
function CrocodileARWorld() {
  const groupRef = useRef();
  const { mouse, camera } = useThree();
  const initialSetRef = useRef(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const isMobile = window.innerWidth <= 768;

    // Rotación inicial girada un poco a la derecha (yaw)
    if (!initialSetRef.current) {
      groupRef.current.rotation.y = 0.18;
      camera.position.set(0.6, 0.3, isMobile ? 5.4 : 6.4);
      initialSetRef.current = true;
    }

    // Parallax según mouse/touch
    const targetRotY = (mouse.x || 0) * (isMobile ? 0.08 : 0.16) + 0.18;
    const targetRotX = (mouse.y || 0) * (isMobile ? -0.04 : -0.09);
    const targetPosY = Math.sin(t * 0.35) * 0.08;

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

    // Walk-in ligero de cámara pero manteniendo vista más abierta
    const targetZ = isMobile ? 5.1 : 6.0;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.03);
  });

  return (
    <group ref={groupRef}>
      {/* Ambiente y luces */}
      <Environment preset="sunset" />
      <ambientLight intensity={0.35} />
      <directionalLight position={[2.5, 3.4, 4]} intensity={1.35} />
      <pointLight position={[-2.2, 1.1, 2]} intensity={0.7} color={"#ffcf9a"} />
      <pointLight position={[1.5, -0.8, 3]} intensity={0.5} color={"#87d6ff"} />

      {/* Fondo de video con shader de olas */}
      <VideoBackground />

      {/* Plano AR y obra */}
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
          floatIntensity={0.028}
          emissive="#fd0000ff"
          emissiveIntensity={0.0}
        />
        <DetailUV
          src={armImg}
          uv={[0.22, 0.74]}
          baseW={1.2}
          baseH={1.25}
          extraZ={0.1}
          floatIntensity={0.032}
          emissive="#f90505ff"
          emissiveIntensity={0.18}
        />
        <DetailUV
          src={sunglassesImg}
          uv={[0.51, 0.51]}
          baseW={0.7}
          baseH={0.7}
          extraZ={0.1}
          floatIntensity={0.02}
          emissive="#d7f7ff"
          emissiveIntensity={0.2}
        />
      </Float>

      {/* Palmeras foreground / background */}
      <PalmCard src={palmImg} position={[-2.7, -0.85, -0.4]} scale={3.3} />
      
      <PalmCard
        src={palmSImg}
        position={[-2.1, -0.55, -2.0]}
        scale={4.0}
        sway={0.03}
      />
      <PalmCard
        src={palmImg}
        position={[-3.4, -0.6, -2.2]}
        scale={5.8}
        sway={0.035}
      />

      <PalmCard
        src={palmImg}
        position={[-2.4, 2.9, 1.0]}
        scale={8.8}
        sway={0.035}
      />

      {/* Bandada de gaviotas */}
      <SeagullFlock />
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* COMPONENTE PRINCIPAL AR                                                    */
/* -------------------------------------------------------------------------- */
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
          <button className="croc-ar-hud-btn" onClick={() => navigate("/")}>
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
            {audioOn ? (
              <Icons.volumeOff size={18} />
            ) : (
              <Icons.volumeOn size={18} />
            )}
          </button>
        </div>

        <Canvas
          camera={{ position: [0.6, 0.3, 6.4], fov: 45 }}
          dpr={[1, 1.8]}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          style={{ height: "90%" }}
        >
          <color attach="background" args={["#02040a"]} />
          <fog attach="fog" args={["#02040a", 4, 14]} />

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
              position={[0, -1.55, 0.4]}
              transform
              distanceFactor={3.4}
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
