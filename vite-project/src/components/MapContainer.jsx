import Room from "./Room";
import rooms from "../data/rooms";

const MapContainer = () => {
  return (
    <div
      style={{
        position: "relative",
        width: "2000px",
        height: "1000px",
        backgroundColor: "#ddd"
      }}
    >
      {rooms.map((room) => (
        <Room
          key={room.id}
          name={room.name}
          x={room.x}
          y={room.y}
          width={room.width}
          height={room.height}
        />
      ))}
    </div>
  );
};

export default MapContainer;