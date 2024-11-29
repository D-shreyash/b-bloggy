let months = [
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

let days = [
  "Sunday",
  "Monday",
  "Tusday",
  "wednesday",
  "thursday",
  "Friday",
  "saturday",
];

const getDate = (timestamp) => {
  let date = new Date(timestamp);

  return `${date.getDate()} ${months[date.getMonth()]}`;
};

export const GetFullDay = (timestamp) => {
  let date = new Date(timestamp);

  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};
export default getDate;
