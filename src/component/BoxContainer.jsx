import {View} from 'react-native'
import React,{useContext} from 'react'
import {ProductContext} from '../Context/Contextcontent'
export default function BoxContainer({children,style}){
  const {themes} = useContext(ProductContext)
  return (
     <View style={[style,{elevation:6,backgroundColor:themes.theme.backgroundTheme,borderRadius:4,padding:6,shadowColor:themes.theme.color}]}>
      {children}
     </View>
    )
}