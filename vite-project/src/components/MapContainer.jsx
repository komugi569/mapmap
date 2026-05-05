import { useState, useEffect } from "react";
import Room from "./Room";
import rooms from "../data/rooms";
import { getCurrentPeriod } from "../utils/getRoomStatus";

const MapContainer = () => {
  const [scale, setScale] = useState(0.5);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [currentFloor, setCurrentFloor] = useState(2); // フロア状態を追加（初期値2F）
  const [, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const zoomIn = () => setScale((prev) => prev + 0.1);
  const zoomOut = () => setScale((prev) => Math.max(0.5, prev - 0.1));
  const period = getCurrentPeriod();

  // 現在のフロアの教室だけを抽出
  const filteredRooms = rooms.filter((room) => room.floor === currentFloor);

  return (
    <div>
      {/* ステータス表示エリア */}
      <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "10px" }}>
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>
          {period !== null ? `現在：${period + 1}限` : "授業時間外"}
        </div>
        
        {/* フロア切り替えボタン */}
        <div style={{ display: "flex", gap: "5px", background: "#eee", padding: "5px", borderRadius: "8px" }}>
          {[2, 3].map((f) => (
            <button
              key={f}
              onClick={() => setCurrentFloor(f)}
              style={{
                padding: "5px 15px",
                backgroundColor: currentFloor === f ? "#007bff" : "#fff",
                color: currentFloor === f ? "#fff" : "#000",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              {f}F
            </button>
          ))}
        </div>
      </div>

      {/* ズームボタン */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={zoomIn} style={{ width: "40px", height: "40px", marginRight: "5px" }}>＋</button>
        <button onClick={zoomOut} style={{ width: "40px", height: "40px" }}>－</button>
      </div>

      {/* マップ表示エリア */}
      <div
        style={{
          overflow: "auto",
          border: "1px solid black",
          width: "100%",
          height: "80vh",
          backgroundColor: "#f9f9f9"
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

            {/* 地図（フロアごとに画像を切り替える場合は href を currentFloor で分岐） */}
            <g id="map-image">
              <image
                href={currentFloor === 2 ? "/map2F.jpg" : "/map3F.jpg"}
                x="0"
                y="0"
                width="1848"
                height="1245"
                opacity="0.1" 
              />
            </g>

           {/* 2階または3階の場合に廊下を表示 */}
{(currentFloor === 2 || currentFloor === 3) && (
  <g id="corridors">
    {/* 左端の縦廊下：2階の時だけ表示し、3階では表示しない */}
    {currentFloor === 2 && (
      <path
        d="M 370 700 H 450 V 220 H 370 Z"
        fill="rgba(232,211,181,0.7)"
        stroke="#c5b08e"
        strokeWidth="2"
      />
    )}

    {/* メインのH型廊下：2階でも3階でも表示 */}
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
)}

            {/* 教室（フィルタリングされた結果を表示） */}
            <g id="rooms">
              {filteredRooms.map((room) => (
                <Room key={room.id} {...room} />
              ))}
            </g>
          </svg>
        </div>
      </div>

      {/* 座標表示 */}
      <div
        style={{
          position: "fixed",
          right: "20px",
          bottom: "20px",
          background: "rgba(255,255,255,0.8)",
          padding: "4px 8px",
          border: "1px solid black",
          pointerEvents: "none"
        }}
      >
        {coords.x}, {coords.y}
      </div>
    </div>
  );
};

export default MapContainer;