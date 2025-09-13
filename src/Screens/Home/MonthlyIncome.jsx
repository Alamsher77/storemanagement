const MonthlyIncome = (sales)=> {
   const monthlyIncome = {};
  try { 
  sales.forEach(sale => {
    const date = new Date(sale.date);
    const month = date.toLocaleString("default", { month: "short" }); // e.g. Jan, Feb
    const year = date.getFullYear();

    const key = `${month}-${year}`;
    const totalAmount = sale?.products?.reduce((prev,nex)=>{return prev + Number(nex?.salePrice) * Number(nex?.quantity)},0)
    if (!monthlyIncome[key]) {
      monthlyIncome[key] = 0;
    }
    console.log(date)
    monthlyIncome[key] += totalAmount;
  });

 
  return monthlyIncome;
  } catch (e) {
    return e
  }

}

export default MonthlyIncome