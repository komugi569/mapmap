import { useState, useEffect } from "react";
import Room from "./Room";
import rooms from "../data/rooms";
import { getCurrentPeriod } from "../utils/getRoomStatus";

const MapContainer = () => {
  const [scale, setScale] = useState(0.7);
  const [currentFloor, setCurrentFloor] = useState(2);
  const [, setTime] = useState(0);

  // ピンチズーム用の状態管理
  const [initialDistance, setInitialDistance] = useState(null);
  const [initialScale, setInitialScale] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.1, 3.0));
  const zoomOut = () => setScale((prev) => Math.max(0.4, prev - 0.1));
  const period = getCurrentPeriod();

  // --- タッチ操作ハンドラ ---
  const getDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy); // 二点間の距離を算出
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dist = getDistance(e.touches);
      setInitialDistance(dist);
      setInitialScale(scale);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && initialDistance !== null) {
      const currentDistance = getDistance(e.touches);
      const ratio = currentDistance / initialDistance;
      
      // 指の動きに合わせて新しい倍率を計算（最小0.4〜最大3.0に制限）
      const newScale = Math.min(Math.max(initialScale * ratio, 0.4), 3.0);
      setScale(newScale);
    }
  };

  const handleTouchEnd = () => {
    setInitialDistance(null);
    setInitialScale(null);
  };
  // -----------------------

  const filteredRooms = rooms.filter((room) => room.floor === currentFloor);

  return (
    <div>
      {/* ステータス表示エリア */}
      <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "10px" }}>
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>
          {period !== null ? `現在：${period + 1}限` : "授業時間外"}
        </div>
        
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
          backgroundColor: "#f9f9f9",
          touchAction: "none" // ブラウザ標準のズーム動作を防止
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
            <g id="background">
              <rect width="100%" height="100%" fill="white" />
            </g>

            <g id="map-image">
              <image
                href={currentFloor === 2 ? "/map2F.jpg" : "/map3F.jpg"}
                x="0"
                y="0"
                width="1848"
                height="1245"
                opacity="0" 
              />
            </g>

            {(currentFloor === 2 || currentFloor === 3) && (
              <g id="corridors">
                {currentFloor === 2 && (
                  <path
                    d="M 370 700 H 450 V 220 H 370 Z"
                    fill="rgba(232,211,181,0.7)"
                    stroke="#c5b08e"
                    strokeWidth="2"
                  />
                )}
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

            <g id="rooms">
              {filteredRooms.map((room) => (
                <Room key={room.id} {...room} />
              ))}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MapContainer;