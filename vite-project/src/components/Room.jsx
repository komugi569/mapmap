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
            alert(`${label}：${subLabel || ""}`);
          }
        }}
      />

      {/* noClickは表示しない */}
      {role !== "noClick" && (
        <>
          {/* 教室名 */}
          <text
            x={x + width / 2}
            y={y + height / 2 - (role === "classroom" ? 10 : 0)}
            writingMode={vertical ? "vertical-rl" : "horizontal-tb"}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={fontSize || (role === "classroom" ? 12 : 16)}

          >
            {lines.map((line, index) => (
              <tspan
                key={index}
                x={x + width / 2}
                dy={index === 0 ? 0 : 14}
              >
                {line}
              </tspan>
            ))}
          </text>

          {/* classroomのみ授業表示 */}
          {role === "classroom" && (
            <text
              x={x + width / 2}
              y={y + height / 2 + 12}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={fontSize ? fontSize + 4 : 16}
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