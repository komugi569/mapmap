const Room = ({ name, x, y, width, height }) => {
  return (
    <>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="yellow"
        stroke="black"
      />
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="14"
        fontWeight="bold"
      >
        {name}
      </text>
    </>
  );
};

export default Room;