import { View, Text, TouchableOpacity } from 'react-native'
import React,{useContext} from 'react'
import Colors from '../Colors'
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ProductContext} from '../Context/Contextcontent'
import BoxContainer from "./BoxContainer"
export default function ProductModelData({ header, date, quantity, icons,onPress }) {
   const {productCategory,itemsRecords,themes} = useContext(ProductContext)
    return ( 
      <BoxContainer style={{ width: '49%', }}>
        <TouchableOpacity onPress={onPress}  style={{backgroundColor:themes.theme.backgroundTheme, elevation: 5, borderRadius: 10,borderColor:themes.theme.color }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, padding: 10 }}>
                <View style={{ width: 40, height: 40, backgroundColor: 'rgba(247, 93, 11, 0.3)', borderRadius: 50, justifyContent: "center", alignItems: 'center' }}>
                    {icons}
                </View>
                <Text style={{ fontWeight: 'bold', color: '#777' }}>{header}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6, padding: 10 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 25,color:themes.theme.color }}>{quantity}</Text>
                <View style={{gap:5, height: 25, backgroundColor: 'rgba(0,200,0,0.1)', borderRadius: 12,paddingHorizontal:5, flexDirection: 'row',justifyContent:'center',alignItems:'center' }}>

                    <Ionicons name="caret-up" size={20} color="rgba(0, 150, 0, 1)" />
                    <Text style={{fontWeight:'700',color:"rgba(0, 150, 0, 1)"}}>+15%</Text>
                </View>
            </View>
            <View style={{width:'100%',borderTopWidth:0.6,borderColor:'rgba(0,0,0,0.1)',justifyContent:'center',alignItems:'center',height:40}}>
                <Text style={{color:'#777',fontWeight:'500',fontSize:13}}>Updated: 20 July 2025</Text>
            </View>
        </TouchableOpacity> 
      </BoxContainer>
    )
}