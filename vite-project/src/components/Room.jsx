const Room = ({
    x,
    y,
    width,
    height,
    fill,
  fontSize,
  vertical,
  breakMode,
  id,
  label,
  statusData,
}) => {

  const text = label ?? id;
let lines;

  if (breakMode === "auto") {
    lines = id.match(/.{1,4}/g);   // 4文字ごと
  } else if (breakMode === "space") {
    lines = text.split(" ");
  } else {
    lines = [text]; // 改行なし
  }

  let fillColor = "#ccc";

if (statusData?.status === "free") fillColor = "#62fc0a";   // 緑
if (statusData?.status === "using") fillColor = "#F44336"; // 赤
if (statusData?.status === "reserved") fillColor = "#12ccfa"; // 黄

  return (
    <>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fillColor}
        stroke="black"
      />
      <text
        x={x + width / 2}
        y={y + height / 2}
  writingMode={vertical ? "vertical-rl" : "horizontal-tb"}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={fontSize || 20}
      >

 {lines.map((line, index) => (
          <tspan
            key={index}
            x={x + width / 2}
            dy={index === 0 ? 0 : 16}
          >
            {line}
          </tspan>
        ))}
      </text>
    </>
  );
};

export default Room;