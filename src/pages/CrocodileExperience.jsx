// src/components/CrocodileExperience.jsx
import CrocodileScene from "../components/CrocodileScene.jsx";
import "../styles/CrocodileExperience.css";

export default function CrocodileExperience({
  image,
  layers
}) {
  return (
    <div className="experience-root">
      <div className="experience-3d">
        <CrocodileScene image={image} layers={layers} />
      </div>
    </div>
  );
}
