
import {createContext,useState,useEffect} from 'react'
import {
  initFile,
  readData, 
  addItem,
  deleteItem,
  updateItem,
} from '../Storage/jsonStorage'
import {useColorScheme} from 'react-native'
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
  const [dataloading,setdataloading] = useState(false)
  const [productCategory,setProductCategory] = useState(null)
  const fetchData = async ()=>{
    try {
      setdataloading(true)
  const data =   await readData()
  setdataloading(false)
   setItemsRecords(data)  
    } catch (e) {
      setdataloading(false)
      console.log(e.message)
    }
  }
  const themes =  useColors() 
  useEffect(()=>{ 
  fetchData(); 
},[])
   
  useEffect(()=>{
   if (!dataloading && itemsRecords) {
    setProductCategory([...new Set(itemsRecords?.map(itemes => itemes?.category.toUpperCase()))])
  }
 
  },[dataloading])
  const contextData = {themes,fetchData,itemsRecords,setItemsRecords,dataloading,setProductCategory,productCategory}
  return (
     <ProductContext.Provider value={contextData}>
     {children}
     </ProductContext.Provider>
    )
}