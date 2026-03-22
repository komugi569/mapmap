import schedule from "../data/schedule.json";

const getNowInfo = () => {
  const now = new Date();
  const dayList = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const day = dayList[now.getDay()];
  const time =
    String(now.getHours()).padStart(2,"0") +
    ":" +
    String(now.getMinutes()).padStart(2,"0");

  return { day, time };
};

export const getRoomStatus = (room) => {
  const { id, role } = room;

  // ① noClick（廊下など）
  if (role === "noClick") {
    return {
      status: "disabled",
      label: null
    };
  }

  // ⑤ shape（教室名は表示させたい！！！！！！！！）
if (role === "shape") {
  return {
    status: "shape",
    label: room.label
  };
}

  // ② fixed（職員室など）
  if (role === "fixed") {
    return {
      status: "fixed",
      label: room.label
    };
  }

  // ③ classroom（通常教室）
  if (role === "classroom") {
    const { day, time } = getNowInfo();
    const classes = schedule[id];

    if (!classes) {
      return { status: "free", label: "空き" };
    }

    const current = classes.find(
      (c) => c.day === day && c.start <= time && time < c.end
    );

    if (current) {
      return {
        status: "using",
        label: current.subject
      };
    }

    return { status: "free", label: "空き" };
  }

  // ④ fallback（未定義）
  return {
    status: "free",
    label: room.label
  };


};