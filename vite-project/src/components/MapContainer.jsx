import { useState } from "react";
import Room from "./Room";
import rooms from "../data/rooms";

const MapContainer = () => {
  const [scale, setScale] = useState(1);

  const zoomIn = () => setScale((prev) => prev + 0.1);
  const zoomOut = () => setScale((prev) => Math.max(0.5, prev - 0.1));

  return (
    <div>
      {/* 🔹 ズームボタン */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={zoomIn}>＋</button>
        <button onClick={zoomOut}>－</button>
      </div>

      {/* 🔹 ズーム対象 */}
      <div
        style={{
          overflow: "auto",
          border: "1px solid black",
          width: "100%",
          height: "80vh",
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "0 0",
            width: "1500px",
            height: "800px",
          }}
        >
      <svg
  viewBox="0 0 1848 1245"
  width="100%"
  height="auto"
>
  <image
    href="/map.jpg"
    x="0"
    y="0"
    width="1848"
    height="1245"
    opacity="0.5"
  />

 {/* 廊下の外郭 */}
  <path
  d="
    M 370 700
    H 450
    V 220
    H 370
    Z
  "
  fill="rgba(232,211,181,0.7)"
/>

</svg>

        </div>
      </div>
    </div>
  );
};

export default MapContainer;