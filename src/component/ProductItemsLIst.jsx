import BoxContainer from './BoxContainer'
import {
  View,
  Text,
  Button,
  TouchableOpacity
} from 'react-native'
import Colors from '../Colors'
import Currancy from '../Currancy'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons' 
import React,{useContext} from 'react'
import {ProductContext} from '../Context/Contextcontent'
export default function ProductItemsList( {
  items, deleteHandler,editHandler
}) {

 const {themes} = useContext(ProductContext)
  return (
    <BoxContainer >
    
         <View style={ { flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>
         
         <View style={ { flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <View
      style={ { width: 40, height: 40, elevation: 6, backgroundColor:themes.theme.backgroundTheme, justifyContent: 'center', alignItems: 'center',borderRadius:6,shadowColor:themes.theme.color }}
      >
              <Text
        style={{fontWeight:'700',fontSize:18,color:Colors.mainColor
        }}
        >{items?.name.charAt(0)}</Text>
            </View>
           <Text style={{color:'#999',
           }}>{items?.name}</Text>
         </View>
         <View style={{flexDirection:'row',alignItems:'center'}}>
         {
           items?.selectSize == 'showsize' && 
          <Text style={{color:Colors.mainColor,fontWeight:'700'}}>Size - {items?.size} </Text>
         }
           <View style={{width:50,alignItems:'center'}}>
              <Text style={{fontWeight:'800',color:'#666'}}>{items?.stock}</Text>
              <Text style={{fontWeight:'500',color:Colors.mainColor}}>{items?.units?.toUpperCase()}</Text>
           </View>
         </View>
         </View>
         <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:5,alignItems:"center"}}>
         <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: "center",width:'70%'}}>
          <View style={{alignItems:'center'}}>
           <Text style={{fontWeight:'600',fontSize:13,color:Colors.mainColor}}>Purchase Price</Text>
           <Text style={{color:'#777',fontWeight:'600'}}>{Currancy(items?.purchasePrice)}</Text>
          </View> 
          
          <View style={{alignItems:'center'}}>
           <Text style={{fontWeight:'600',fontSize:13,color:Colors.mainColor}}>Sale Price</Text>
           <Text style={{color:'#777',fontWeight:'600'}}>{Currancy(items?.salePrice)}</Text>
          </View> 
         </View>
         <View style={{width:'25%',flexDirection:'row',justifyContent:'space-between'}}>
          <TouchableOpacity onPress={()=> editHandler(items?.id)} style={{backgroundColor:'#DBA021',width:30,height:30,justifyContent:'center',alignItems:'center',borderRadius:15}}>
          <MaterialIcons color="#fff" size={20} name="edit" />
         </TouchableOpacity> 
          <TouchableOpacity onPress={()=>deleteHandler(items?.id)} style={{backgroundColor:Colors.mainColor,width:30,height:30,marginRight:10,justifyContent:'center',alignItems:'center',borderRadius:15}}>
          <MaterialIcons color="#fff" size={20} name="delete-outline" />
         </TouchableOpacity> 
         </View>
         </View>  
         </BoxContainer>
  )
}