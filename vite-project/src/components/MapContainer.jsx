import { useState } from "react";
import Room from "./Room";
import rooms from "../data/rooms";

const MapContainer = () => {
  const [scale, setScale] = useState(1);

  const zoomIn = () => setScale((prev) => prev + 0.1);
  const zoomOut = () => setScale((prev) => Math.max(0.5, prev - 0.1));
  const [coords, setCoords] = useState({ x: 0, y: 0 });

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
            width: "1848px",
            height: "1245px",
          }}
        >
      <svg
  viewBox="0 0 1848 1245"
  width="100%"
  height="auto"
   onMouseMove={(e) => {
    const svg = e.target.closest("svg");
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorpt = pt.matrixTransform(
      svg.getScreenCTM().inverse()
    );
    setCoords({
      x: Math.round(cursorpt.x),
      y: Math.round(cursorpt.y),
    });
  }}
>

  <image
    href="/map.jpg"
    x="0"
    y="0"
    width="1848"
    height="1245"
    opacity="0.0"
  />

 {/* 左廊下一階 */}
  <path
  d="
    M 370 700
    H 450
    V 220
    H 370
    Z
  "
  fill="rgba(232,211,181,0.7)"
  stroke="#c5b08e"
strokeWidth="2"
/>

<path
  d="
   M 450 300
   H 1780
   V 370
   H 1610
   V 700
   H 1570
   V 615
   H 1030
   V 700
   H 990
   V 615
   H 450
   V 580
   H 490
   V 335
   H 450
   Z

   M 525 335
   H 990
   V 580
   H 525
   Z
  
   M 1030 335
   H 1570
   V 580
   H 1030
   Z
  "
  fill="rgba(232,211,181,0.7)"
  fillRule="evenodd"
  stroke="#c5b08e"
strokeWidth="2"
  />
  {rooms.map((room) => (
  <Room key={room.id} {...room} />
))}
</svg>

<div>
  x: {coords.x} / y: {coords.y}
</div>

        </div>
      </div>
    </div>
  );
};

export default MapContainer;