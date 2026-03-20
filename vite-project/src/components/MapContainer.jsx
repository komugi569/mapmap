import { useState } from "react";
import Room from "./Room";
import rooms from "../data/rooms";
import roomStatusData from "../data/status.json";

const MapContainer = () => {
  const [scale, setScale] = useState(1);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [roomStatus, setRoomStatus] = useState(roomStatusData);

  const zoomIn = () => setScale((prev) => prev + 0.1);
  const zoomOut = () => setScale((prev) => Math.max(0.5, prev - 0.1));

  return (
    <div>
      {/* ズームボタン */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={zoomIn}>＋</button>
        <button onClick={zoomOut}>－</button>
      </div>

      {/* マップ表示エリア */}
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
          <svg viewBox="0 0 1848 1245" width="100%" height="100%">

  {/* 背景 */}
  <g id="background">
    <rect width="100%" height="100%" fill="white" />
  </g>

  {/* 地図 */}
  <g id="map-image">
    <image
      href="/map.jpg"
      x="0"
      y="0"
      width="1848"
      height="1245"
      opacity="0.0"
    />
  </g>

  {/* 廊下 */}
  <g id="corridors">

    <path
      d="M 370 700 H 450 V 220 H 370 Z"
      fill="rgba(232,211,181,0.7)"
      stroke="#c5b08e"
      strokeWidth="2"
    />

    <path
      d="M 450 300 H 1780 V 370 H 1610 V 700 H 1570 V 615 H 1030 V 700 H 990 V 615 H 450 V 580 H 490 V 335 H 450 Z
         M 525 335 H 990 V 580 H 525 Z
         M 1030 335 H 1570 V 580 H 1030 Z"
      fill="rgba(232,211,181,0.7)"
      fillRule="evenodd"
      stroke="#c5b08e"
      strokeWidth="2"
    />

  </g>

  {/* 教室 */}
  <g id="rooms">
    {rooms.map((room) => (
    <Room
  key={room.id}
  {...room}
  statusData={roomStatus[room.id]}
/>
    ))}
  </g>

</svg>
        </div>
      </div>

      {/* 座標表示 */}
      <div
        style={{
          position: "fixed",
          left: coords.mouseX + 10,
          top: coords.mouseY + 10,
          background: "white",
          padding: "4px",
          border: "1px solid black",
        }}
      >
        {coords.x}, {coords.y}
      </div>
    </div>
  );
};

export default MapContainer;