
import {createContext,useState,useEffect} from 'react'
import {
  initFile,
  readData,  
  addItem,
  deleteItem,
  updateItem,
  readDataSale
} from '../Storage/jsonStorage'
import {useColorScheme} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
export const ProductContext = createContext();
 
export const useColors = () => {
  const colorScheme = useColorScheme(); 
  return {
    mainColor: "#e15836ff",
    mode:colorScheme,
    theme: {
      backgroundTheme: colorScheme === "dark" ? "black" : "#fff",
      color: colorScheme === "dark" ? "#ddd" : "#666",
    },
  };
};
export const ContextContent = ({children})=>{
   
 
  const [itemsRecords,setItemsRecords] = useState(null)
  const [SaleRecords,setSaleRecords] = useState([])
  const [dataloading,setdataloading] = useState(false)
  const [productCategory,setProductCategory] = useState(null)
  const [localUserData,setLocalUserData] = useState(null)
  const localStorageDatafetch = async()=>{
    try {
     const getUserData = JSON.parse( await AsyncStorage.getItem('userData')); 
     setLocalUserData(getUserData) 
    } catch (e) {
      console.log(e)
    }

  }
  const fetchData = async ()=>{
    try {
      setdataloading(true)
  const data =   await readData()
  const saleData = await readDataSale()
  setdataloading(false)
   setItemsRecords(data?.reverse(-1))  
   setSaleRecords(saleData?.reverse(-1))
    } catch (e) {
      setdataloading(false)
      console.log(e.message)
    }
  }
  const themes =  useColors() 
  useEffect(()=>{ 
  fetchData(); 
  localStorageDatafetch()
},[])
   
  useEffect(()=>{
   if (!dataloading && itemsRecords) {
    setProductCategory([...new Set(itemsRecords?.map(itemes => itemes?.category?.toUpperCase()))])
  }
 
  },[dataloading])
  
  
  
  
  
  // Mothely income Data manage
  const sales = [
  { totalAmount: 500, date: "2024-01-15" },
  { totalAmount: 200, date: "2024-01-20" }, // same month Jan
  { totalAmount: 1000, date: "2024-02-05" },
  { totalAmount: 700, date: "2024-02-15" }, // same month Feb
  { totalAmount: 300, date: "2024-03-02" },
];

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

const monthlySaleData = {totalMonths, monthlyIncome,percentChange,totalIncome}; 
 console.log(monthlySaleData)
// end of sale analisys
  const contextData = {themes,fetchData,itemsRecords,setItemsRecords,dataloading,setProductCategory,productCategory,SaleRecords,localStorageDatafetch,localUserData,monthlySaleData}
  return (
     <ProductContext.Provider value={contextData}>
     {children}
     </ProductContext.Provider>
    )
}