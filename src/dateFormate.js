const DateFormate = (getDate) => {
  if (!getDate) return "";
  
  const dateObj = new Date(getDate); // convert string → Date object
  
  return dateObj.toLocaleDateString('en-IN', {
    month: 'short',  // e.g. Oct
    day: 'numeric',  // e.g. 15
    year: 'numeric', // e.g. 2025
  });
};

export default DateFormate;