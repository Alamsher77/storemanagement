
const DateAndTime = (recieveDate)=>{
let date = recieveDate ? new Date(recieveDate) : new Date();
 
const day = String(date.getDate()).padStart(2, "0");      // 01–31
const month = String(date.getMonth() + 1).padStart(2, "0"); // 01–12
const year = date.getFullYear();

let hours = String(date.getHours()).padStart(2, "0");   // 00–23
const minutes = String(date.getMinutes()).padStart(2, "0");
const seconds = String(date.getSeconds()).padStart(2, "0");
const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours; // 0 ko 12 banao
const fulldate = `${day}-${month}-${year}`
const fullTime = `${hours}:${minutes}:${ampm}` 
const formatDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}` 
return {date:fulldate,time:fullTime,formatDate}
}

export default DateAndTime