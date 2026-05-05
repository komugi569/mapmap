import { getRoomStatus } from "../utils/getRoomStatus";

const Room = (room) => {
  const {
    x,
    y,
    width,
    height,
    fontSize,
    vertical,
    breakMode,
    id,
    label,
    role,
    color,
    scheduleData // MapContainerから渡される想定
  } = room;

  const text = label ?? id;
  let lines;

  // 1. 文字列の分割ロジック
  if (breakMode === "auto") {
    lines = text.match(/.{1,4}/g) || [text];
  } else if (breakMode === "space") { // 【修正】==0= を === に修正
    lines = text.split(" ");
  } else {
    lines = [text];
  }

  // 2. 状態取得
  const { status, label: subLabel } = getRoomStatus(room, scheduleData);

  // 3. 色判定
  let fillColor = "#ccc";
  if (role === "shape" && color) {
    fillColor = color;
  } else {
    const colors = {
      using: "#F44336",
      free: "#62fc0a",
      fixed: "#999",
      disabled: "#ddd",
      shape: color || "#eee"
    };
    fillColor = colors[status] || "#ccc";
  }

  // 4. レイアウト計算
  const isClickable = role !== "noClick" && role !== "shape";
  const finalFontSize = fontSize || 14;
  const lineHeight = finalFontSize + 2;
  
  // 教室名と授業名がある場合、教室名を少し上にずらす
  const hasSubLabel = role === "classroom" && subLabel;
  const verticalShift = hasSubLabel ? -(finalFontSize * 0.8) : 0;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fillColor}
        stroke="black"
        strokeWidth="1"
        style={{ pointerEvents: isClickable ? "auto" : "none", cursor: isClickable ? "pointer" : "default" }}
        onClick={() => {
          if (isClickable) {
            alert(`${label || id}\n${subLabel || "空き教室"}`);
          }
        }}
      />

      {role !== "noClick" && (
        <g style={{ pointerEvents: "none" }}>
          {/* 教室名テキスト */}
          <text
            x={x + width / 2}
            y={y + height / 2 + verticalShift}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={finalFontSize}
            fontWeight="bold"
            style={vertical ? { writingMode: "vertical-rl" } : {}}
          >
            {lines.map((line, index) => (
              <tspan
                key={index}
                x={x + width / 2}
                dy={index === 0 ? (vertical ? 0 : 0) : lineHeight}
              >
                {line}
              </tspan>
            ))}
          </text>

          {/* 授業名（classroomかつ授業がある場合のみ） */}
          {hasSubLabel && (
            <text
              x={x + width / 2}
              y={y + height / 2 + (finalFontSize + 4)}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={finalFontSize - 2} // 授業名は少し小さくすると見やすい
              fill="#000"
            >
              {subLabel}
            </text>
          )}
        </g>
      )}
    </g>
  );
};

export default Room;