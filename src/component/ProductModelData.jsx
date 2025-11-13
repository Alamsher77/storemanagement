import { View, Text, TouchableOpacity } from 'react-native'
import React,{useContext} from 'react'
import Colors from '../Colors'
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ProductContext} from '../Context/Contextcontent'
import BoxContainer from "./BoxContainer"
export default function ProductModelData({ header, date, quantity, icons,onPress,percentChange, }) {
   const {productCategory,itemsRecords,themes} = useContext(ProductContext)
    return ( 
      <BoxContainer style={{ width: '49%', }}>
        <TouchableOpacity onPress={onPress}  >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, padding: 10 }}>
                <View style={{ width: 40, height: 40, backgroundColor: 'rgba(247, 93, 11, 0.3)', borderRadius: 50, justifyContent: "center", alignItems: 'center' }}>
                    {icons}
                </View>
                <Text style={{ fontWeight: 'bold', color: '#777' }}>{header}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6, padding: 10 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16,color:themes.theme.color }}>{Math.floor(quantity)}</Text>
                <View style={{gap:5, height: 25, backgroundColor: percentChange && percentChange < 0 ? 'rgba(200,0,0,0.1)' : 'rgba(0,200,0,0.1)', borderRadius: 12,paddingHorizontal:5, flexDirection: 'row',justifyContent:'center',alignItems:'center' }}>

                    <Ionicons name={percentChange && percentChange < 0 ? "caret-down" :"caret-up"} size={16} color={percentChange && percentChange < 0 ? "rgba(150, 0, 0, 1)" : "rgba(0, 150, 0, 1)" } />
                    <Text style={{fontWeight:'700',fontSize:12,color:percentChange && percentChange < 0 ? "rgba(150, 0, 0, 1)" : "rgba(0, 150, 0, 1)"}}> {percentChange ? percentChange  : 0}%</Text>
                </View>
            </View>
            <View style={{width:'100%',borderTopWidth:0.6,borderColor:'rgba(0,0,0,0.1)',justifyContent:'center',alignItems:'center',height:40}}>
                <Text style={{color:'#777',fontWeight:'500',fontSize:10}}>Updated {date ? date : '01-01-2025'}</Text>
            </View>
        </TouchableOpacity> 
      </BoxContainer>
    )
}