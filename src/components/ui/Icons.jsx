// src/components/ui/Icons.jsx
import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Star,
  Heart,
  Camera,
  Eye,
  Home,
  Menu,
  X,
  Info,
  ZoomIn,
  ZoomOut,
  Plus,
  Minus,
  GalleryVertical,
  Brush,
  Sparkles,
  Palette,
  Moon,
  Sun,
  Flashlight,
  Fingerprint,
  ChevronDown,
  ChevronUp,
  StoreIcon,
  Globe,
  Mail,
  Instagram,
  Volume2,
  VolumeOff,
  ChevronsDownIcon,
  ChevronsUpIcon,
  Zap,
  ZapOff,


} from "lucide-react";

/* ----------------------------------------------- */
/*  🔥 ESTILOS REUTILIZABLES                       */
/* ----------------------------------------------- */

const styles = {
  base: {
    width: "1.8rem",
    height: "1.8rem",
    strokeWidth: 1.8,
  },

  minimal: {
    width: "1.6rem",
    height: "1.6rem",
    strokeWidth: 1.6,
  },

  neonGlow: {
    width: "1.8rem",
    height: "1.8rem",
    strokeWidth: 1.8,
    color: "#b8fff8",
    filter: "drop-shadow(0 0 6px rgba(0,255,210,0.9))",
  },

  subtleGlow: {
    width: "1.7rem",
    height: "1.7rem",
    strokeWidth: 1.7,
    color: "#d9faff",
    filter: "drop-shadow(0 0 4px rgba(255,255,255,0.3))",
  },

  heavyStroke: {
    width: "2rem",
    height: "2rem",
    strokeWidth: 2.6,
  },
};

/* ----------------------------------------------- */
/*  🔥 FACTORY FUNCTION                            */
/*  Permite inyectar estilos + props extra         */
/* ----------------------------------------------- */

const make = (Icon, style) => (props) => (
  <Icon {...styles[style]} {...props} />
);

/* ----------------------------------------------- */
/*  🔥 ICONOS DISPONIBLES                          */
/* ----------------------------------------------- */

export const Icons = {
  // Navegación principal
  left: make(ChevronLeft, "base"),
  right: make(ChevronRight, "base"),
  arrowLeft: make(ArrowLeft, "base"),
  arrowRight: make(ArrowRight, "base"),
  up: make(ChevronUp, "base"),
  down: make(ChevronDown, "base"),

  // Versiones Glow
  leftGlow: make(ChevronLeft, "neonGlow"),
  rightGlow: make(ChevronRight, "neonGlow"),
  chevronsUp: make(ChevronsUpIcon, "neonGlow"),
  chevronsDown: make(ChevronsDownIcon, "neonGlow"),
  zap : make(Zap, "neonGlow"),
  zapOff : make(ZapOff, "neonGlow"),

  // Sutil
  leftSoft: make(ChevronLeft, "subtleGlow"),
  rightSoft: make(ChevronRight, "subtleGlow"),

  // Pesados (para escenas 3D con contraste alto)
  leftBold: make(ChevronLeft, "heavyStroke"),
  rightBold: make(ChevronRight, "heavyStroke"),

  // UI General
  close: make(X, "minimal"),
  menu: make(Menu, "minimal"),
  info: make(Info, "minimal"),
  home: make(Home, "minimal"),
  zoomIn: make(ZoomIn, "minimal"),
  zoomOut: make(ZoomOut, "minimal"),
  volumeOn: make(Volume2, "minimal"),
  volumeOff: make(VolumeOff, "minimal"),

  // Arte / Creatividad
  gallery: make(GalleryVertical, "base"),
  brush: make(Brush, "minimal"),
  sparkles: make(Sparkles, "neonGlow"),
  palette: make(Palette, "minimal"),

  // Estado
  sun: make(Sun, "minimal"),
  moon: make(Moon, "minimal"),

  // Social / Interacción
  heart: make(Heart, "base"),
  star: make(Star, "base"),
  camera: make(Camera, "base"),
  eye: make(Eye, "base"),

  // Numéricos
  plus: make(Plus, "minimal"),
  minus: make(Minus, "minimal"),

  // Acceso
  fingerprint: make(Fingerprint, "minimal"),

  // Otros
  flashlight: make(Flashlight, "minimal"),
  store: make(StoreIcon, "minimal"),
  globe: make(Globe, "minimal"),
  mail: make(Mail, "minimal"),
  instagram: make(Instagram, "minimal"),

};

/* ----------------------------------------------- */
/*  Usage:
    <Icons.leftGlow />
    <Icons.menu style={{color:"#fff"}} />
    <Icons.gallery className="myClass" />
   ----------------------------------------------- */
