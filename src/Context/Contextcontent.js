
import {createContext,useState,useEffect} from 'react'
import {
  initFile,
  readData,  
  addItem,
  deleteItem,
  updateItem,
  readDataSale
} from '../Storage/jsonStorage'
import {dbConnection,addSale,addProduct,getProducts,getSales} from '../Storage/Database'
import {useColorScheme} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Saleanalysis from '../analysis'
import DateAndTime from '../dateAndTime'
import {setProducts,setProductCategry} from '../redux/productSlice'
import {setSale,setMonthlySaleData,setTodayIncome} from '../redux/saleSlice'
import { useDispatch,useSelector } from "react-redux";
export const ProductContext = createContext();
 
 
const safeParse = (val) => {
  try {
    return JSON.parse(val);
  } catch {
    return [];
  }
};
export const useColors = () => {
  const colorScheme = useColorScheme(); 
  return {
    mainColor: "#e15836ff",
    mode:colorScheme,
    theme: {
      backgroundTheme: colorScheme === "dark" ? "#000" : "#fff",
      color: colorScheme === "dark" ? "#fff" : "#666",
    },
  };
};
export const ContextContent = ({children})=>{
   const dispatch = useDispatch(); 
 
  const [itemsRecords,setItemsRecords] = useState([])
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
  const fetchData = async (type)=>{
    try {
   
      
//       setdataloading(true) 
// const db = await dbConnection()    
// const saleData = await db.getAllAsync("SELECT * FROM product_sale ORDER BY id DESC ;")   
 
//   const  someSaleDataToParse = saleData.map((saleItems)=>{
//     const parseDues = JSON.parse(saleItems.dues)
//     const parseProducts = JSON.parse(saleItems.products)
//     const updateAtJson =  JSON.parse(saleItems.updateAt)
//     return {...saleItems,dues:parseDues,products:parseProducts,updateAt:updateAtJson}
//   }) 
//   setSaleRecords(someSaleDataToParse)  
    } catch (e) {
      setdataloading(false)
      console.log(e.message)
    }finally{
      setdataloading(false)
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
  


  
const monthlySaleData = Saleanalysis({SaleRecords}) 
const todayDate = (DateAndTime()).date

const todayIncome = Saleanalysis({SaleRecords,specificDate:todayDate})
// end of sale analisys
 
  const contextData = {themes,fetchData,itemsRecords,setItemsRecords,dataloading,setProductCategory,productCategory,SaleRecords,localStorageDatafetch,localUserData,monthlySaleData,todayIncome}
  return (
     <ProductContext.Provider value={contextData}>
     {children}
     </ProductContext.Provider>
    )
}    