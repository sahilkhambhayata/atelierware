export const formatDate = (date, format, isTime) => {

  if (format === undefined || format === null) {
    format = "mmm d,yyyy true";
  }
 
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dateParts = {
    mm: String(date.getMonth() + 1).padStart(2, "0"),
    dd: String(date.getDate()).padStart(2, "0"),
    yyyy: date.getFullYear(),
    yy: String(date.getFullYear()).slice(-2),
    m: date.getMonth() + 1,
    d: date.getDate(),
    mmm: months[date.getMonth()],
    hh: String(date.getHours() % 12 || 12).padStart(2, "0"),
    ii: String(date.getMinutes()).padStart(2, "0"),
    ss: String(date.getSeconds()).padStart(2, "0"),
  };

  const timeFormat = format?.includes("true") ? "true" : "false";
  let formattedTime;
  if (timeFormat === "true") {
    const hour = date.getHours() % 12 || 12;
    const period = date.getHours() < 12 ? "AM" : "PM";
    // formattedTime = `${hour}:${dateParts.ii}:${dateParts.ss} ${period}`;
    formattedTime = `${hour}:${dateParts.ii} ${period}`;
  } else {
    // formattedTime = `${dateParts.hh}:${dateParts.ii}:${dateParts.ss}`;
    formattedTime = `${dateParts.hh}:${dateParts.ii}`;
  }

  const formattedDate = format?.replace(
    /mmm|mm|m|dd|yyyy|yy|d|hh|ii|ss|true|false/gi,
    (match) => {
      if (match === "true" || match === "false") return ""; // Exclude "true" from the output
      return dateParts[match.toLowerCase()];
    }
  );

  if (isTime) {
    return `${formattedDate} ${formattedTime}`;
  } else {
    return `${formattedDate}`;
  }
};
