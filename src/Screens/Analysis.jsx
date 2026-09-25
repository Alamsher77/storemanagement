import { View, Text } from 'react-native'
import React from 'react'
import ScrollContainer from '../component/ScrollContainer'
//import LinearGradient from 'react-native-linear-gradient'
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../Colors'
import SweetchButton from '../component/sweetchButton'
import Sale from '../Screens/Analysis/sale'
import Product from '../Screens/Analysis/product'
export default function Analysis() {
  const [sweetchButtonActive,setSweetchButtonActive] = React.useState('Sale')
 
  return (
    <ScrollContainer style={{gap:6,paddingTop:40}}>
    <SweetchButton isActive={sweetchButtonActive} setActive={setSweetchButtonActive} />
     {
       sweetchButtonActive == 'Sale' ?
       
       <Sale />
       :
       <Product />
     }
    </ScrollContainer>
  )
}