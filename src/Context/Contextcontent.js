
import {createContext} from 'react'
 
import {useColorScheme} from 'react-native'

export const ProductContext = createContext();
 
 
 
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
 
  const themes =  useColors()  
 
  const contextData = {themes}
  return (
     <ProductContext.Provider value={contextData}>
     {children}
     </ProductContext.Provider>
    )
}    