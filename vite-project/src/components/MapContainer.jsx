import { useState, useEffect } from "react";
import Room from "./Room";
import rooms from "../data/rooms";
import { getCurrentPeriod } from "../utils/getRoomStatus";

const MapContainer = () => {
  const [scale, setScale] = useState(0.7);
  const [currentFloor, setCurrentFloor] = useState(2);
  const [, setTime] = useState(0);

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

  const period = getCurrentPeriod();

  const getDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  };

  // --- 💡 マウスホイールによるズーム ---
  const handleWheel = (e) => {
    // ホイールの回転方向を判定（上: 拡大, 下: 縮小）
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.min(Math.max(scale + delta, 0.4), 3.0);

    // カーソルの位置（スクリーン座標）
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // 現在のカーソル位置がマップ上のどの地点かを逆算
    const mapFocalX = (mouseX - coords.x) / scale;
    const mapFocalY = (mouseY - coords.y) / scale;

    // 新しいスケールに合わせて座標を再計算（カーソル位置を固定）
    const newX = mouseX - mapFocalX * newScale;
    const newY = mouseY - mapFocalY * newScale;

    setScale(newScale);
    setCoords({ x: newX, y: newY });
  };

  // --- タッチハンドラ（既存） ---
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setInitialTouch({ x: e.touches[0].clientX - coords.x, y: e.touches[0].clientY - coords.y });
    } else if (e.touches.length === 2) {
      const dist = getDistance(e.touches);
      setInitialDistance(dist);
      setInitialScale(scale);
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      const mapFocalX = (midX - coords.x) / scale;
      const mapFocalY = (midY - coords.y) / scale;
      setInitialTouch({ focalX: mapFocalX, focalY: mapFocalY });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && initialTouch && !initialDistance) {
      const newX = e.touches[0].clientX - initialTouch.x;
      const newY = e.touches[0].clientY - initialTouch.y;
      setCoords({ x: newX, y: newY });
    } else if (e.touches.length === 2 && initialDistance !== null && initialTouch?.focalX !== undefined) {
      const currentDistance = getDistance(e.touches);
      const ratio = currentDistance / initialDistance;
      const newScale = Math.min(Math.max(initialScale * ratio, 0.4), 3.0);
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
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
<div style={{ 
  display: "flex", 
  justifyContent: "space-between", // 左右に振り分ける
  alignItems: "center", 
  padding: "10px 15px", 
  paddingTop: "max(10px, env(safe-area-inset-top))", // iPhoneのノッチ対策
  background: "rgba(255, 255, 255, 0.95)", // 少し透かした白
  zIndex: 100, // マップより確実に上に表示
  position: "relative", // z-indexを有効にする
  borderBottom: "1px solid #ddd",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)" // 境目をわかりやすく
}}>
  {/* 左側：何時限目か */}
  <div style={{ 
    fontSize: "16px", // スマホに合わせて少し小さく
    fontWeight: "bold",
    whiteSpace: "nowrap", // 改行を防ぐ
    flexShrink: 0 // 文字が潰されるのを防ぐ
  }}>
    {period !== null ? `現在：${period + 1}限` : "授業時間外"}
  </div>
  
  {/* 右側：フロア切り替え */}
  <div style={{ display: "flex", gap: "5px", background: "#eee", padding: "3px", borderRadius: "8px" }}>
    {[2, 3].map((f) => (
      <button
        key={f}
        onClick={() => setCurrentFloor(f)}
        style={{
          padding: "6px 12px",
          fontSize: "14px",
          backgroundColor: currentFloor === f ? "#007bff" : "transparent",
          color: currentFloor === f ? "#fff" : "#333",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
          transition: "0.2s"
        }}
      >
        {f}F
      </button>
    ))}
  </div>
</div>
      {/* マップ表示エリア */}
      <div
        style={{
          width: "100vw",
          height: "calc(100vh - 60px)",
          backgroundColor: "#f9f9f9",
          touchAction: "none", 
          cursor: "grab",
          overflow: "hidden"
        }}
        onWheel={handleWheel} // 💡 ホイールイベントを追加
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