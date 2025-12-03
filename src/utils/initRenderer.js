import { WebGPURenderer } from "three/webgpu";
import * as THREE from "three";

export async function initRenderer(canvas) {
  let renderer;

  if (navigator.gpu) {
    renderer = new WebGPURenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    await renderer.init();
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
  } else {
    renderer = new THREE.WebGLRenderer({
      canvas,
      powerPreference: "high-performance",
      antialias: true,
      alpha: true
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  return renderer;
}
