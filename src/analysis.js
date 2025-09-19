const Saleanalysis = ({SaleRecords,specificDate})=>{
  
const dateFormate = (getdate)=>{
   const getDate = getdate.date.split('-')
   const formateDate = `${getDate[2]}-${getDate[1]}-${getDate[0]}`
  return formateDate
}
const dates = SaleRecords.map((s) =>{ 
 return new Date(dateFormate(s))
}); 
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));

  const years = maxDate.getFullYear() - minDate.getFullYear();
  const months = maxDate.getMonth() - minDate.getMonth();
  const totalMonths = years * 12 + months + 1;

  const monthlyIncome = {};
  SaleRecords.forEach(sale => {
    const d = new Date(dateFormate(sale));
    const key = `${d.toLocaleString("default", { month: "short" })}-${d.getFullYear()}`;

    monthlyIncome[key] = (monthlyIncome[key] || 0) + sale.totalIncome;
  });


const totalIncome = Math.floor(SaleRecords?.reduce((prev,next) => prev + Number(next?.totalIncome) ,0) / totalMonths)



// mothe analisys
const now = new Date();

// Current month start (e.g. 2025-09-01)
const currentMotheStart = new Date(now.getFullYear(), now.getMonth(), 1);

// Current month end (e.g. 2025-09-30)
const currentMotheEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

// Previous month start & end
const prevMotheStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
const prevMotheEnd = new Date(now.getFullYear(), now.getMonth(), 0);

// Sales filter
const currentMotheSale = SaleRecords.filter(s => {
  const d = new Date(dateFormate(s));
  return d >= currentMotheStart && d <= currentMotheEnd;
});

const prevMotheSale = SaleRecords.filter(s => {
  const d = new Date(dateFormate(s));
  return d >= prevMotheStart && d <= prevMotheEnd;
});

// Totals
const currentMotheTotal = currentMotheSale.reduce((sum, s) => sum + Number(s.totalIncome), 0);
const prevMotheTotal = prevMotheSale.reduce((sum, s) => sum + Number(s.totalIncome), 0);

// Percent change
let percentChange = 0;
if (prevMotheTotal > 0) {
  percentChange = (((currentMotheTotal - prevMotheTotal) / prevMotheTotal) * 100).toFixed(2);
} 


//const specificDate = ;
const yesterday = new Date()
yesterday.setDate(now.getDate() - 1)
const yesterdayDate = yesterday.toISOString().split('T')[0]
const today = SaleRecords.filter(sale => sale.date === specificDate);
const yesterdaySale = SaleRecords.filter( sale => (dateFormate(sale)) === yesterdayDate)
const yesterdayIncome = yesterdaySale.reduce((prev,next)=> prev + Number(next.totalIncome) ,0)
const todayIncome = today.reduce((prev,next)=> prev + Number(next.totalIncome) ,0)

let todayPercentChange = 0;
if (yesterdayIncome > 0) {
  todayPercentChange = (((todayIncome - yesterdayIncome) / yesterdayIncome) * 100).toFixed(2);
} 
// [{ id: 2, date: "2025-09-12", amount: 1200 }]

return (specificDate ? {todayIncome,todayPercentChange} : {totalMonths, monthlyIncome,percentChange,totalIncome,});  
  
}

export default Saleanalysis