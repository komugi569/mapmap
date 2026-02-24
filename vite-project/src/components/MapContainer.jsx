import { useState, useRef } from "react";
import Corridor from "./Corridor";
import Room2_1 from "./rooms/Room2_1"

export default function MapContainer() {
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);

  const handleWheel = (e) => {
    e.preventDefault();
    const newScale = scale - e.deltaY * 0.001;
    if (newScale > 0.5 && newScale < 2.5) {
      setScale(newScale);
    }
  };

  return (
    <div
      ref={containerRef}
      className="map-wrapper"
      onWheel={handleWheel}
    >
      <div
        className="map"
        style={{ transform: `scale(${scale})` }}
      >
        <Corridor />

        {/* 教室配置 */}
        <Room2_1 x={300} y={400} />

      </div>
    </div>
  );
}