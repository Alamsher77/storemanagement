
import {createContext} from 'react'
 
import {useColorScheme} from 'react-native'

export const ProductContext = createContext();
 
 
 
export const useColors = () => {
  const colorScheme = useColorScheme(); 
  return {
    mainColor: "#e15836ff",
    mode:colorScheme,
    theme: {
      backgroundTheme: colorScheme === "dark" ? '#0F1115' : '#F7F8FA',
      color: colorScheme === "dark" ? '#F5F5F5' : '#171717',
      card:colorScheme === "dark" ? "#222" : "#F2CAC2",
      secondaryColor:colorScheme === "dark" ? '#A1A1AA' : '#6B7280',
      cardBackground:colorScheme === "dark" ? '#181B21' : '#FFFFFF',
      borderColor:colorScheme === "dark" ? '#2A2E35': '#E5E7EB'
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