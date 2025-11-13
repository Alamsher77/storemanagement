 
const SaleAnalysis = ({dateType,SaleRecords})=>{ 
 
// weekly data SaleAnalysis Start
  function getCurrentWeekRange(weeksAgo = 0) {
  const today = new Date();
  const monday = new Date(today);
  const sunday = new Date(today);
  // getDay() => Sunday=0, Monday=1, ...
  const day = today.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day; 
  monday.setDate(today.getDate() + diffToMonday - 7 * weeksAgo); // Monday
  sunday.setDate(monday.getDate() + 6); // Sunday
   
  return { monday, sunday };
}
    const dateFormate = (getdate)=> {
      const getDate = getdate.date.split('-')
      const formateDate = `${getDate[2]}-${getDate[1]}-${getDate[0]}`
      return formateDate
    } 
  const currentWeek = getCurrentWeekRange(0);
  const previousWeek = getCurrentWeekRange(1); 
  
  const getWeeklySummary = (range,data)=>{
 const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weeklySummary = days.map((day, index) => {
  const dayDate = new Date(range?.monday);
  dayDate.setDate(range?.monday?.getDate() + index);

  const total = data
    .filter(
      (item) =>
        new Date(dateFormate(item)).toDateString() === dayDate.toDateString()
    )
    .reduce((sum, item) => sum + Number(item?.totalIncome || 0), 0);

  return { date:day, value:total};
});
  return weeklySummary
  }
  const currentWeekSummary = getWeeklySummary(currentWeek, SaleRecords);
const previousWeekSummary = getWeeklySummary(previousWeek, SaleRecords);
 
 const totalCurrentWeekSale = currentWeekSummary?.reduce((prev,next)=>(prev + next?.value),0)
 const totalPreviouWeekSale = previousWeekSummary?.reduce((prev,next)=>(prev + next?.value),0)
 
 let weeklyPercentage = 0;
if (totalPreviouWeekSale > 0) {
  weeklyPercentage = (((totalCurrentWeekSale - totalPreviouWeekSale) / totalPreviouWeekSale) * 100).toFixed(2);
} 
// end Weekly data analysis 
 switch (dateType) {
   case 'Weekly': 
     return {
     success:true,
     message:'Weekly Data Sweetch !!',
     currentWeekSummary,
     previousWeekSummary,
     weeklyPercentage,
     };
     break;
     
    case 'monthly':
    return 'monthly'
    break;
    
    case 'yearly':
      return 'yearly'
      break;
    
   default:
     return {success:false,message:'Provided Range Note Exist !!'}
 }
}

export default SaleAnalysis