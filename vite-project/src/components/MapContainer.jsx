import { useState, useEffect } from "react";
import Room from "./Room";
import rooms from "../data/rooms";
import { getCurrentPeriod } from "../utils/getRoomStatus";

const MapContainer = () => {
  const [scale, setScale] = useState(0.7);
  const [currentFloor, setCurrentFloor] = useState(2);
  const [, setTime] = useState(0);

  // 移動（ドラッグ）とズーム用の状態管理
  const [coords, setCoords] = useState({ x: 0, y: 0 }); 
  const [initialTouch, setInitialTouch] = useState(null); 
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

  const getDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  };

  // --- タッチハンドラ ---
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      // 一本指：移動の開始座標を記録
      setInitialTouch({ x: e.touches[0].clientX - coords.x, y: e.touches[0].clientY - coords.y });
    } else if (e.touches.length === 2) {
      // 二本指：ズームの準備
      const dist = getDistance(e.touches);
      setInitialDistance(dist);
      setInitialScale(scale);

      // 💡 ズームの中心点（指の間）を計算
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

      // 💡 その中心点がマップ上のどの座標を指しているかを逆算して保持
      const mapFocalX = (midX - coords.x) / scale;
      const mapFocalY = (midY - coords.y) / scale;
      
      // ズーム中は移動用の座標ではなく、この「基準点」を initialTouch に一時保存する
      setInitialTouch({ focalX: mapFocalX, focalY: mapFocalY });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && initialTouch && !initialDistance) {
      // 一本指：移動処理
      const newX = e.touches[0].clientX - initialTouch.x;
      const newY = e.touches[0].clientY - initialTouch.y;
      setCoords({ x: newX, y: newY });
    } else if (e.touches.length === 2 && initialDistance !== null && initialTouch?.focalX !== undefined) {
      // 二本指：ズーム処理
      const currentDistance = getDistance(e.touches);
      const ratio = currentDistance / initialDistance;
      const newScale = Math.min(Math.max(initialScale * ratio, 0.4), 3.0);

      // 💡 現在の指の中心点を取得
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

      // 💡 新しいスケールに合わせて、基準点が指の真ん中に来るように coords を調整
      const newX = midX - initialTouch.focalX * newScale;
      const newY = midY - initialTouch.focalY * newScale;

      setScale(newScale);
      setCoords({ x: newX, y: newY });
    }
  };

  const handleTouchEnd = () => {
    setInitialTouch(null);
    setInitialDistance(null);
    setInitialScale(null);
  };

  const filteredRooms = rooms.filter((room) => room.floor === currentFloor);

  return (
    <div style={{ position: "fixed", width: "100%", height: "100%", overflow: "hidden" }}>
      {/* ステータス表示エリア */}
      <div style={{ display: "flex", gap: "20px", alignItems: "center", padding: "10px", background: "white", zIndex: 10 }}>
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
      <div style={{ position: "absolute", bottom: "20px", right: "20px", display: "flex", flexDirection: "column", gap: "10px", zIndex: 10 }}>
        <button onClick={zoomIn} style={{ width: "50px", height: "50px", borderRadius: "25px", fontSize: "24px", border: "none", boxShadow: "0 2px 5px rgba(0,0,0,0.2)" }}>＋</button>
        <button onClick={zoomOut} style={{ width: "50px", height: "50px", borderRadius: "25px", fontSize: "24px", border: "none", boxShadow: "0 2px 5px rgba(0,0,0,0.2)" }}>－</button>
      </div>

      {/* マップ表示エリア */}
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "#f9f9f9",
          touchAction: "none", 
          cursor: "grab",
          overflow: "hidden"
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={(e) => setInitialTouch({ x: e.clientX - coords.x, y: e.clientY - coords.y })}
        onMouseMove={(e) => {
          if (initialTouch && !initialDistance) {
            setCoords({ x: e.clientX - initialTouch.x, y: e.clientY - initialTouch.y });
          }
        }}
        onMouseUp={() => setInitialTouch(null)}
      >
        <div
          style={{
            transform: `translate(${coords.x}px, ${coords.y}px) scale(${scale})`,
            transformOrigin: "0 0",
            width: "1848px",
            height: "1245px",
            // ズーム中や移動中は transition を切ることでカクつきを抑える
            transition: initialTouch ? "none" : "transform 0.1s ease-out" 
          }}
        >
          <svg viewBox="0 0 1848 1245" width="100%" height="100%">
            <g id="background">
              <rect width="100%" height="100%" fill="white" />
            </g>

            {(currentFloor === 2 || currentFloor === 3) && (
              <g id="corridors">
                {currentFloor === 2 && (
                  <path d="M 370 700 H 450 V 220 H 370 Z" fill="rgba(232,211,181,0.7)" stroke="#c5b08e" strokeWidth="2" />
                )}
                <path d="M 450 300 H 1780 V 370 H 1610 V 700 H 1570 V 615 H 1030 V 700 H 990 V 615 H 450 V 580 H 490 V 335 H 450 Z M 525 335 H 990 V 580 H 525 Z M 1030 335 H 1570 V 580 H 1030 Z" fill="rgba(232,211,181,0.7)" fillRule="evenodd" stroke="#c5b08e" strokeWidth="2" />
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