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
          <svg width="1600" height="900">

  {/* 下敷き画像 */}
  <image
    href="/map.jpg"   // publicフォルダに画像を入れる
    x="0"
    y="0"
    width="1600"
    height="900"
    opacity="0.4"     // 半透明
  />

            {/* 🟡 教室を自動生成 */}
            {rooms.map((room) => (
              <Room key={room.id} {...room} />
            ))}

          </svg>
        </div>
      </div>
    </div>
  );
};

export default MapContainer;