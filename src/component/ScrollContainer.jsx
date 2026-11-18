import { View, Text, ScrollView } from 'react-native'
import React,{useContext} from 'react'
import {ProductContext} from '../Context/Contextcontent'
export default function ScrollContainer({children,style,onScroll,ref}) {
  const {productCategory,itemsRecords,themes} = useContext(ProductContext)
  return (
    <ScrollView ref={ref} onScroll={onScroll} contentContainerStyle={[style,{padding:15,backgroundColor:themes.theme.backgroundTheme,flexGrow:1}]}>
      {children}
    </ScrollView>
  )
}