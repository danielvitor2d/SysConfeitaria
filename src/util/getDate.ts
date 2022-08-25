import moment from "moment";

export const getDatetimeLocalFormatted = (date: Date) => {
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1);
  month.length < 2 ? (month = "0" + month) : undefined;
  let day = String(date.getDate());
  day.length < 2 ? (day = "0" + day) : undefined;
  let hour = String(date.getHours());
  hour.length < 2 ? (hour = "0" + hour) : undefined;
  let minute = String(date.getMinutes());
  minute.length < 2 ? (minute = "0" + minute) : undefined;

  return `${year}-${month}-${day}T${hour}:${minute}`;
};
export const getDatetimeLocalFormattedString = (date: string) => {
  const [day, month, year] = date.split("/");

  return `${year}-${month}-${day}T00:00`;
};
export const fromDatetimeToLocalFormatted = (_date: string) => {
  const [date] = _date.split("T");
  return date.split("-").reverse().join("/");
};
export const fromDateAndTimeToLocalFormatted = (_date: string) => {
  const [date, time] = _date.split("T");
  return date.split("-").reverse().join("/") + " " + time;
};
export const getDateMinusDays = (days: number) => {
  var date = moment().subtract(days, "day").toDate();

  // console.log("Date now: " + JSON.stringify(date));

  var day = String(date.getDate());
  var month = String(date.getMonth() + 1);
  var year = String(date.getFullYear());

  month.length < 2 ? (month = "0" + month) : undefined;
  day.length < 2 ? (day = "0" + day) : undefined;

  return day + "/" + month + "/" + year;
};

export const getDateMinusMonth = (months: number) => {
  var date = moment().subtract(months, "month").toDate();

  var day = String(date.getDate());
  var month = String(date.getMonth() + 1);
  var year = String(date.getFullYear());

  month.length < 2 ? (month = "0" + month) : undefined;
  day.length < 2 ? (day = "0" + day) : undefined;

  return day + "/" + month + "/" + year;
};
