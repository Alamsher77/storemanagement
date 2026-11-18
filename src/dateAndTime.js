const DateAndTime = (recieveDate) => {
  const date = recieveDate ? new Date(recieveDate) : new Date();

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  // 24-hour format — database ke liye
  const hours24 = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // 12-hour format — UI ke liye
  let hours12 = date.getHours();
  const ampm = hours12 >= 12 ? "PM" : "AM";

  hours12 = hours12 % 12;
  hours12 = hours12 === 0 ? 12 : hours12;

  const fullDate = `${day}-${month}-${year}`;
  const fullTime = `${hours12}:${minutes}:${ampm}`;

  // Database / sorting ke liye
  const formatDate = `${year}-${month}-${day} ${hours24}:${minutes}:${seconds}`;

  return {
    date: fullDate,
    time: fullTime,
    formatDate,
  };
};

export default DateAndTime;