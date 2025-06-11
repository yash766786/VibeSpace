// utils/formatMessageTime.js
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

export const formatMessageTime = (timestamp) => {
  const now = dayjs();
  const created = dayjs(timestamp);
  const diffInSeconds = now.diff(created, "second");
  const diffInMinutes = now.diff(created, "minute");
  const diffInHours = now.diff(created, "hour");
  const diffInDays = now.diff(created, "day");

  if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  if (diffInDays === 1) return "Yesterday";

  return created.format("D MMM, h:mm A"); // Example: "8 Jun, 4:32 PM"
};
