// src/components/CrocodileScene.jsx
import React, { useEffect, useRef, useState } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { useNavigate } from "react-router-dom";
import { OrbitControls, Html } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import "../styles/CrocodileScene.css";

import crocImg from "../assets/crocodile.jpg";
import diceImg from "../assets/dice.png";
import armImg from "../assets/arm.png";
import sunglassesImg from "../assets/sunglasses.png";

import palmImg from "../assets/palm.png";
import palm2Img from "../assets/palm-2.png";
import palmTImg from "../assets/palm-t.png";
import palmSImg from "../assets/palm-s.png";
import palmCImg from "../assets/palm-c.png";
import birdImg from "../assets/bird2.gif";

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

// Perlin noise base
function perlin(x, y) {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;

  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);

  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a, b, t) => a + t * (b - a);

  const grad = (hash, x, y) => {
    switch (hash & 3) {
      case 0: return  x + y;
      case 1: return -x + y;
      case 2: return  x - y;
      default:return -x - y;
    }
  };

  const perm = new Uint8Array([
  151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,
  8,99,37,240,21,10,23,190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,
  117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168, 68,175,74,
  165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,
  105,92,41,55,46,245,40,244,102,143,54, 65,25,63,161,1,216,80,73,209,76,132,
  187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,
  3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,
  59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152, 2,44,154,
  163,70,221,153,101,155,167, 43,172,9,129,22,39,253, 19,98,108,110,79,113,
  224,232,178,185, 112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,
  179,162,241, 81,51,145,235,249,14,239,107,49,192,214, 31,181,199,106,157,
  184, 84,204,176,115,121,50,45,127, 4,150,254,138,236,205,93,222,114,67,
  29,24,72,243,141,128,195,78,66,215,61,156,180
]);

  // duplicado
  const p = new Uint8Array(512);
  for (let i = 0; i < 512; i++) p[i] = perm[i & 255];

  const aa = p[X + p[Y]];
  const ab = p[X + p[Y + 1]];
  const ba = p[X + 1 + p[Y]];
  const bb = p[X + 1 + p[Y + 1]];

  return lerp(
    lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), fade(xf)),
    lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), fade(xf)),
    fade(yf)
  );
}

// Fractal Brownian Motion (mejor detalle rocoso/pelusa)
function fbm(x, y, octaves = 5) {
  let value = 0;
  let scale = 0.5;
  for (let i = 0; i < octaves; i++) {
    value += scale * perlin(x, y);
    x *= 2.3;
    y *= 2.3;
    scale *= 0.5;
  }
  return value;
}

/* BASE COCODRILO */
function CrocodileBase() {
  const tex = useLoader(THREE.TextureLoader, crocImg);
  useEffect(() => {
    tex.encoding = THREE.sRGBEncoding; // ✔ colores reales
    tex.colorSpace = THREE.SRGBColorSpace; // ✔ recomendado desde Three r152+
    tex.needsUpdate = true;
  }, [tex]);

  return (
    <mesh position={[0, 0, 0.25]} scale={[PAINTING_W, PAINTING_H, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial map={tex} />
    </mesh>
  );
}

/* -------------------------------------------------------- */
/*  SeagullFlock — versión estable para GIF tipo spritesheet */
/* -------------------------------------------------------- */

function SeagullFlock({
  src = birdImg,
  count = 4,
  y = 0.1,
  scale = 0.25,
  z = -0.5,
  startX = -5,
  endX = 12
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
          transparent
          endX={endX}
          speed={0.015 + i * 0.05}
          delay={i * 0.3}
          z={z}
        />
      ))}
    </group>
  );
}

/* -------------------------------------------------------- */
/*  SingleSeagull — GIF animado + movimiento                */
/* -------------------------------------------------------- */

function SingleSeagull({ src, baseY, scale, startX, endX, delay, speed, z }) {
  const ref = React.useRef();

  const texture = useLoader(THREE.TextureLoader, src);
  texture.encoding = THREE.sRGBEncoding;
  texture.flipY = false;

  // Movimiento horizontal + ondulación
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + delay;
    const x = startX + ((endX - startX) * (t % 1));
    const y = baseY + Math.sin(t * 4) * 0.05;

    ref.current.position.set(x, y, z);
  });

  return (
    <mesh ref={ref} scale={[scale, scale, scale]} renderOrder={2}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        alphaTest={0.01}
        depthWrite={false}
        depthTest={true}
        side={THREE.DoubleSide}
        roughness={0.25}
        colorSpace={THREE.NoColorSpace}
        frustumCulled={false}
      />
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
        side={THREE.DoubleSide}
        metalness={0.7}
        alphaTest={0.02}
        depthWrite={false}
        depthTest={false}
        renderOrder={15}
        roughness={0.25}
        colorSpace={THREE.NoColorSpace}
        emissive="#fff"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

/* PELO */
function DetailFur({ src, uv, baseW, baseH, extraZ = 0 }) {
  const tex = useLoader(THREE.TextureLoader, src);
  const ref = useRef();
  const [scale, setScale] = useState([1, 1, 1]);
  const basePos = uvToPlane(uv, 0.18 + extraZ);

  const featherTex = useMemo(() => {
    const size = 256;
    const data = new Uint8Array(size * size);

    const feather = 22; // difuminado del borde

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const d = Math.min(x, y, size - x, size - y);

        let a = 255;
        if (d < feather) {
          a = (d / feather) * 255;
        }

        data[y * size + x] = a;
      }
    }});

  // --- GENERADOR PROCEDURAL DE NORMAL MAP ---
  const furNormal = useMemo(() => {
    const size = 256;
    const data = new Uint8Array(size * size * 3);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // Base de ruido
        const n = fbm(x * 0.05, y * 0.05, 6);
        const fibers = Math.abs(perlin(x * 0.12, y * 0.28)); // fibra direccional

        // Derivadas simuladas
        const dx = fbm((x + 1) * 0.05, y * 0.05, 5) - fbm((x - 1) * 0.05, y * 0.05, 5);
        const dy = fbm(x * 0.05, (y + 1) * 0.05, 5) - fbm(x * 0.05, (y - 1) * 0.05, 5);

        const nx = (dx + fibers * 0.35) * 0.5 + 0.5;
        const ny = (dy + n * 0.25) * 0.5 + 0.5;

        const i = (y * size + x) * 3;
        data[i] = Math.floor(nx * 255);
        data[i + 1] = Math.floor(ny * 255);
        data[i + 2] = 255; // plano Z
      }
    }

    const tex = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
    tex.needsUpdate = true;
    tex.colorSpace = THREE.NoColorSpace; // SUPER IMPORTANTE
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  useEffect(() => {
    const ratio = tex.image.width / tex.image.height;
    setScale([baseW * ratio, baseH, 1]);
  }, [tex]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Pelusa moviendo como viento
    ref.current.material.normalScale.set(
      1.4 + Math.sin(t * 2) * 0.3,
      1.3 + Math.cos(t * 2.1) * 0.3
    );

    // Pequeño parallax oscilante
    ref.current.position.z = basePos[2] + Math.sin(t * 4) * 0.015;
  });

  return (
    <mesh ref={ref} position={basePos} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        map={tex}
        transparent
        roughness={0.9}
        metalness={0.05}
        side={THREE.DoubleSide}
        alphaMap={featherTex}
        alphaTest={0.02}
        depthWrite={false}
        depthTest={false}
        renderOrder={15}
        normalMap={furNormal}
        normalMapType={THREE.TangentSpaceNormalMap}
        normalScale={new THREE.Vector2(1.4, 1.4)}
      />
    </mesh>
  );
}

/* ROCA */
function DetailRock({ src, uv, baseW, baseH, extraZ = 0 }) {
  const tex = useLoader(THREE.TextureLoader, src);
  const ref = useRef();
  const [scale, setScale] = useState([-1, 1, 1]);
  const basePos = uvToPlane(uv, 0.3 + extraZ);

  /** ------------------------------
   * 1) PROCEDURAL NOISE UTILITIES
   * ------------------------------ */
  const rand = (x, y) => Math.sin(x * 12.9898 + y * 78.233) * 43758.5453 % 1;

  const voronoi = (x, y) => {
    let minDist = 1.0;
    for (let j = -1; j <= 1; j++) {
      for (let i = -1; i <= 1; i++) {
        const gx = Math.floor(x) + i + rand(i, j);
        const gy = Math.floor(y) + j + rand(j, i);
        const dx = x - gx;
        const dy = y - gy;
        const d = Math.sqrt(dx * dx + dy * dy);
        minDist = Math.min(minDist, d);
      }
    }
    return minDist;
  };

  const fbm = (x, y) => {
    let v = 0, a = 0.5;
    for (let i = 0; i < 6; i++) {
      v += a * Math.sin(x * 2.1) * Math.sin(y * 1.7);
      x *= 1.8;
      y *= 1.8;
      a *= 0.5;
    }
    return v;
  };

  /** --------------------------------------
   * 2) PROCEDURAL NORMAL MAP (ROCA REAL)
   * -------------------------------------- */
  const rockNormal = useMemo(() => {
    const size = 256;
    const data = new Uint8Array(size * size * 3);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const nx = x / size, ny = y / size;

        const cracks = voronoi(nx * 4, ny * 6);          // grietas
        const macro = fbm(nx * 1.2, ny * 1.8);           // volúmenes
        const micro = fbm(nx * 12.0, ny * 12.0);         // rugosidad

        let dx = macro * 0.4 + micro * 0.25;
        let dy = cracks * 0.55 + micro * 0.15;

        const i = (y * size + x) * 3;

        data[i] = 128 + dx * 200;
        data[i + 1] = 128 + dy * 200;
        data[i + 2] = 255;
      }
    }

    const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
    texture.needsUpdate = true;
    texture.colorSpace = THREE.NoColorSpace;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  

  /** --------------------------------------
   * 3) AO MAP PROCEDURAL (CAVIDADES PROFUNDAS)
   * -------------------------------------- */
  const aoMap = useMemo(() => {
    const size = 256;
    const data = new Uint8Array(size * size);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const nx = x / size, ny = y / size;

        const cavity = Math.abs(fbm(nx * 4, ny * 4));
        const vv = Math.pow(cavity, 2); // más profundo

        const i = y * size + x;
        data[i] = Math.floor((1 - vv) * 255);
      }
    }

    const texture = new THREE.DataTexture(data, size, size, THREE.LuminanceFormat);
    texture.needsUpdate = true;
    return texture;
  }, []);

  /** ------------------------------
   * 4) SCALING / POSITION
   * ------------------------------ */
  useEffect(() => {
    tex.encoding = THREE.sRGBEncoding;

    const ratio = tex.image.width / tex.image.height;
    setScale([baseW * ratio, baseH, 1]);
  }, [tex]);

  /** ------------------------------
   * 5) ROCK “BREATHING” ANIMATION
   * ------------------------------ */
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.position.z = basePos[2] + Math.sin(t * 0.8) * 0.03;
    ref.current.rotation.z = Math.sin(t * 0.3) * 0.04;
  });

  return (
    <mesh ref={ref} position={basePos} scale={scale} >
      <planeGeometry args={[1, 1, 96, 96]} />

      <meshStandardMaterial
        map={tex}
        transparent
        side={THREE.DoubleSide}
        alphaTest={0.02}
        depthWrite={false}
        depthTest={false}
        renderOrder={5}
        colorSpace={THREE.NoColorSpace}

        /** 🔥 PARALLAX FAKE SUPER NOTORIO */
        displacementMap={aoMap}
        displacementScale={0.18}
        displacementBias={-0.09}

        /** 🔥 NORMAL PROFUNDA */
        /* normalMap={rockNormal} */
        normalScale={new THREE.Vector2(1.2, 1.2)}


        /** 🔥 REFLEJO ROCOSO (efecto piedra húmeda) */
        roughness={0.92}
        metalness={0.18}

        polygonOffset
        polygonOffsetFactor={-1}
        polygonOffsetUnits={1}

      />
    </mesh>
  );
}

/* PALMERAS */
function PalmFront({ src, uv, scale, extraZ=0 }) {
  const tex = useLoader(THREE.TextureLoader, src);
  const ref = useRef();

  useEffect(() => {
    tex.encoding = THREE.sRGBEncoding;
    tex.flipY = false;
  }, [tex]);

  const [posX, posY, posZ] = uvToPlane(uv, 0.55 + extraZ);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.z = Math.sin(t * 0.7) * 0.05;
    ref.current.position.x = posX + Math.sin(t * 0.5) * 0.04;
  });

  return (
    <mesh ref={ref} position={[posX, posY, posZ]} scale={[scale, scale, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        map={tex}
        transparent
        side={THREE.DoubleSide}
        emissive="#181818"
        emissiveIntensity={0.12}
        roughness={0.45}
        metalness={0.1}
      />
    </mesh>
  );
}

function PalmLeaf({ src, uv, scale, extraZ = 0 }) {
  const tex = useLoader(THREE.TextureLoader, src);

  // MANTENER flipY = false para evitar que desaparezca
  useEffect(() => {
    tex.encoding = THREE.sRGBEncoding;
    tex.flipY = false;
  }, [tex]);

  const [baseX, baseY, baseZ] = uvToPlane(uv, 0.38 + extraZ);

  /** ⭐ Feather radial: NO reemplaza la alpha del GIF, solo suaviza bordes */
  const featherTex = useMemo(() => {
    const size = 256;
    const data = new Uint8Array(size * size);

    const feather = 22; // difuminado del borde

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const d = Math.min(x, y, size - x, size - y);

        let a = 255;
        if (d < feather) {
          a = (d / feather) * 255;
        }

        data[y * size + x] = a;
      }
    }

    const alpha = new THREE.DataTexture(
      data,
      size,
      size,
      THREE.AlphaFormat
    );
    alpha.needsUpdate = true;
    return alpha;
  }, []);

  /** ⭐ Componente hoja individual */
  const Leaf = ({ offsetX, offsetY, rot, animSpeed }) => {
    const ref = useRef();

    useFrame(({ clock }) => {
      const t = clock.getElapsedTime();

      // movimiento natural
      const sway = Math.sin(t * animSpeed) * 0.10;
      const flutter = Math.sin(t * animSpeed * 2.2) * 0.015;

      ref.current.rotation.z = rot + sway + flutter;
      ref.current.rotation.x = 0.12 + Math.sin(t * 0.6) * 0.015;

      ref.current.position.x =
        baseX + offsetX + Math.sin(t * animSpeed * 0.3) * 0.025;

      ref.current.position.y =
        baseY + offsetY + Math.cos(t * animSpeed * 0.35) * 0.02;
    });

    return (
      <mesh
        ref={ref}
        position={[baseX + offsetX, baseY + offsetY, baseZ]}
        scale={[-scale, scale, 1]}
      >
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          map={tex}
          alphaMap={featherTex}  // ⭐ bordes suaves sin esconder el PNG
          transparent
          alphaTest={0.02}      // ⭐ evita recorte negro duro
          depthWrite={false}    // render correcto sin desaparecer
          side={THREE.DoubleSide}
          emissive="#0d0d0d"
          emissiveIntensity={0.08}
          roughness={0.45}
          metalness={0.06}
        />
      </mesh>
    );
  };

  return (
    <>
      {/* hoja izquierda */}
      <Leaf offsetX={-0.12} offsetY={0.02} rot={0.20} animSpeed={0.95} />

      {/* hoja derecha */}
      <Leaf offsetX={0.18} offsetY={0.07} rot={-0.18} animSpeed={1.18} />
    </>
  );
}



/* MARCO */
function Frame() {
  return (
    <mesh position={[0, 0, 0.12]}>
      <boxGeometry args={[PAINTING_W + 0.25, PAINTING_H + 0.25, 0.2]} />
      <meshStandardMaterial color="#080808" metalness={0.55} roughness={0.35}/>
    </mesh>
  );
}

/* LUCES PROFESIONALES */
function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[1, 2, 4]} intensity={1.4} />
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

  const [showModal, setShowModal] = useState(false);
  const [zoom, setZoom] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioOn(false);
    }
  };

  // 🔥 Cuando el usuario cierra o cambia pestaña
  window.addEventListener("beforeunload", stopAudio);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") stopAudio();
  });

  // 🔥 Cuando el componente se desmonta (cambia de ruta)
  return () => {
    stopAudio();
    window.removeEventListener("beforeunload", stopAudio);
    document.removeEventListener("visibilitychange", stopAudio);
  };
}, []);

useEffect(() => {
  if (!audioRef.current) {
    audioRef.current = new Audio(AMBIENT_AUDIO);
    audioRef.current.loop = true;
    audioRef.current.volume = 0; // autoplay permitido
    audioRef.current.play().then(() => {
      let v = 0;
      const fade = setInterval(() => {
        v += 0.05;
        audioRef.current.volume = Math.min(v, 1);
        if (v >= 1) clearInterval(fade);
      }, 200);
    }).catch(() => {
      console.log("Autoplay bloqueado, esperar interacción");
    });
  }
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

          <DetailFur
            src={diceImg}
            uv={[0.30, 0.32]}
            baseW={0.62}
            baseH={0.73}
            extraZ={0.12}
          />

          <DetailRock
            src={armImg}
            uv={[0.22, 0.74]}
            baseW={1.3}
            baseH={1.3}
            extraZ={0.12}
          />

          <DetailUV
            src={sunglassesImg}
            uv={[0.51, 0.51]}
            baseW={0.67}
            baseH={0.66}
            extraZ={0.12}
          />


        <PalmFront src={palmImg} 
            uv={[-0.7, -0.8]}
            scale={12.8}
            extraZ={0.13}/>

          <PalmFront src={palmSImg} 
            uv={[-0.4, 0.44]}
            scale={3.8}
            extraZ={-1.44}/>

            <PalmFront src={palmImg} 
            uv={[-0.4, 0.34]}
            scale={2.8}
            extraZ={-1.94}/>

            <PalmFront src={palm2Img} 
            uv={[-0.8, -0.1]}
            scale={2.8}
            extraZ={-2.2}/>

          <SeagullFlock scale={0.35} />

          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>
        <div className="canvas-separator"></div>        
      {/* ⭐ TEXTO MÁS VISIBLE Y PROFESIONAL ⭐ */}
      <div className="art-description improved-text">
        <h2>
          {meta.title}
          <span> — {meta.year}</span>
        </h2>

        <p className="medium">{meta.medium}</p>

        <p className="desc-text">{meta.description}</p>
      </div>
      <div className="top-buttons">
        <button className="back-gallery-btn" onClick={() => navigate("/")}>
            Gallery
        </button>

        <button className="view-img-btn" onClick={() => setShowModal(true)}>
            View Image
        </button>
      </div>
      {showModal && (
        <div className="img-modal-overlay" onClick={() => setShowModal(false)}>
            <div className="img-modal" onClick={(e) => e.stopPropagation()}>
            <img
                src={crocImg}
                className="zoom-img"
                onWheel={(e) => {
                e.preventDefault();
                e.target.style.transform = `scale(${zoom + e.deltaY * -0.001})`;
                setZoom(Math.max(1, zoom + e.deltaY * -0.001));
                }}
            />
            <button className="close-modal" onClick={() => setShowModal(false)}>✖</button>
            </div>
        </div>
        )}
    </div>
    
  );
}
