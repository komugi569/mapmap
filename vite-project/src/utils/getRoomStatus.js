import schedule from "../data/schedule.json";
import { periodTimes } from "../data/periodTimes";

// 曜日取得
export const getToday = () => {
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  return days[new Date().getDay()];
};

//  これ1つだけにする（統合版）
export const getCurrentPeriod = () => {
  const today = getToday();

  //  日課タイプ取得
  const type = schedule.types?.[today] || "default";

  //  その日の時間割を選択
  const times = periodTimes[type] || periodTimes.default;

  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();

  for (let i = 0; i < times.length; i++) {
    const [sh, sm] = times[i].start.split(":").map(Number);
    const [eh, em] = times[i].end.split(":").map(Number);

    const start = sh * 60 + sm;
    const end = eh * 60 + em;

    if (current >= start && current <= end) {
      return i;
    }
  }

  return null;
};

export const getRoomStatus = (room) => {
  const { id, role } = room;

  // ① noClick
  if (role === "noClick") {
    return { status: "disabled", label: null };
  }

  // ② shape
  if (role === "shape") {
    return { status: "shape", label: room.label };
  }

  // ③ fixed
  if (role === "fixed") {
    return { status: "fixed", label: room.label };
  }

  // ④ classroom
  if (role === "classroom") {
    const today = getToday();
    const period = getCurrentPeriod();

    if (period === null) {
      return { status: "free", label: "" };
    }

    const roomSchedule = schedule[id];
    if (!roomSchedule) {
      return { status: "free", label: "" };
    }

    const todaySchedule = roomSchedule[today];
    if (!todaySchedule) {
      return { status: "free", label: "" };
    }

    if (period >= todaySchedule.length) {
      return { status: "free", label: "" };
    }

    const subject = todaySchedule[period];

    return subject
      ? { status: "using", label: subject }
      : { status: "free", label: "" };
  }

  // fallback
  return {
    status: "free",
    label: room.label
  };
};