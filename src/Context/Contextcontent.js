
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
import Saleanalysis from '../analysis'
import DateAndTime from '../dateAndTime'
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