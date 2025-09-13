
const DateAndTime = ()=>{
   const date = new Date();

const day = String(date.getDate()).padStart(2, "0");      // 01–31
const month = String(date.getMonth() + 1).padStart(2, "0"); // 01–12
const year = date.getFullYear();

const hours = String(date.getHours()).padStart(2, "0");   // 00–23
const minutes = String(date.getMinutes()).padStart(2, "0");
const seconds = String(date.getSeconds()).padStart(2, "0");

const fulldate = `${day}-${month}-${year}`
const fullTime = `${hours}:${minutes}:${seconds}` 
return {date:fulldate,time:fullTime}
}

export default DateAndTime