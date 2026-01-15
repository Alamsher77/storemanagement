import {Text} from 'react-native'
import {useContext} from 'react'
import {
  ProductContext
} from '../Context/Contextcontent' 
const Text_Content = ({children,style})=>{
  const {
    themes
  } = useContext(ProductContext)
  return (
     <Text style={{color:themes.theme.color,...style}}>{children}</Text>
    )
}

export default Text_Content