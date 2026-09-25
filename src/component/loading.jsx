import { View,ActivityIndicator } from 'react-native'
import React,{useContext} from 'react' 
import {ProductContext} from '../Context/Contextcontent'
export default function Loading() {
  const {themes} = useContext(ProductContext) 
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center' ,backgroundColor:themes.theme.backgroundTheme}}>
     <ActivityIndicator size="large" color={themes.theme.color} />
    </View>
  )
}   