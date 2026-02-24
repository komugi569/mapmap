const Room = ({ name, x, y, width, height }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: width,
        height: height,
        backgroundColor: "#f5d142",
        border: "2px solid black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold"
      }}
    >
      {name}
    </div>
  );
};

export default Room;