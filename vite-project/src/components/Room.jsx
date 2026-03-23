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
    color
  } = room;

  const text = label ?? id;
  let lines;

  if (breakMode === "auto") {
    lines = text.match(/.{1,4}/g);
  } else if (breakMode === "space") {
    lines = text.split(" ");
  } else {
    lines = [text];
  }

  // ★ roleごとに状態取得
  const { status, label: subLabel } = getRoomStatus(room);

 let fillColor = "#ccc";

// shapeは個別色を優先
if (role === "shape" && color) {
  fillColor = color;
} else {
  if (status === "using") fillColor = "#F44336";
  if (status === "free") fillColor = "#62fc0a";
  if (status === "fixed") fillColor = "#999";
  if (status === "disabled") fillColor = "#ddd";
}

  // ★ クリック可否
  const isClickable = role !== "noClick" && role !== "shape";
  const nameOffset = role === "classroom" ? -fontSize / 2 : 0;
  const subOffset = fontSize / 2 + 8;

  // === 追加（これが抜けてる） ===
const finalFontSize = fontSize || 14;

const lineCount = lines.length;
const lineHeight = finalFontSize + 2;
const textHeight = lineCount * lineHeight;

// 教室名の位置（中央寄せ）
const nameY = y + height / 2 - textHeight / 2;

// 授業名の位置（教室名の下）
const subjectY = nameY + textHeight + 6;

  return (
    <>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fillColor}
        stroke="black"
        style={{ pointerEvents: isClickable ? "auto" : "none" }}
        onClick={() => {
          if (isClickable) {
            alert(`${label}\n${subLabel || "空き教室"}`);
          }
        }}
      />

      {/* noClickは表示しない */}
      {role !== "noClick" && (
        <>
          {/* 教室名 */}
          <text
  x={x + width / 2}
  y={nameY}
  writingMode={vertical ? "vertical-rl" : "horizontal-tb"}
  textAnchor="middle"
  dominantBaseline={vertical ? "middle" : "hanging"}
  fontSize={finalFontSize}
>
  {lines.map((line, index) => (
    <tspan
      key={index}
      x={x + width / 2}
      dy={index === 0 ? 0 : lineHeight}
    >
      {line}
    </tspan>
  ))}
</text>

          {/* classroomのみ授業表示 */}
         {role === "classroom" && subLabel && (
  <text
    x={x + width / 2}
    y={subjectY}
    textAnchor="middle"
    dominantBaseline="hanging"
    fontSize={finalFontSize + 4}
  >
    {subLabel}
  </text>
)}
        </>
      )}
    </>
  );
};

export default Room;