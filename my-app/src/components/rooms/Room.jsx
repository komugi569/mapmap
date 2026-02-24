export default function Room({ name, x, y, width = 120, height = 80 }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        backgroundColor: "#ffeb3b",
        border: "2px solid black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
      }}
    >
      {name}
    </div>
  );
}