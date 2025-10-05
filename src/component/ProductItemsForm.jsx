import {View,Button,Text,TextInput,StyleSheet} from 'react-native'
import OptionsInputeText from './OptionsInputeText'
import Colors from '../Colors' 
import React,{useContext,useState} from 'react'
import {ProductContext} from '../Context/Contextcontent'
import {addItem,readData} from '../Storage/jsonStorage'
const ProductItemsForm = ({setItemsData,itemsData,setOpenDragableModel,fetchData,submitHandler,lable})=>{
   const {themes} = useContext(ProductContext)
  const unitOption  = ['PEES','BOX','BAG',]
  const sizeOption = ["Hide Size",'Show Size']
  const sizeData = ['','1-2','1-4','1-6','1-8','2-0','2-2','2-4','2-6','2-8']
 
  const changeItemsHandeler = (text,inputName)=>{
    setItemsData((prev)=>({...prev,[inputName]:text})) 
  }
  
   const updateSizeOptions = sizeOption?.find((items)=>{
     return items?.split(' ').join('').toLowerCase() == itemsData?.selectSize
    }) 

  return(
     <View style={{paddingHorizontal:18}}> 
     <Text style={{alignSelf:'center',fontWeight:'700',fontSize:16,color:Colors.mainColor}}>{lable && lable} Prodduct Items</Text>
     <View style={{gap:7,marginVertical:5}}>
     <TextInput value={lable && itemsData?.name} onChangeText={(text)=>changeItemsHandeler(text,'name')}  placeholder='Items Name' placeholderTextColor={themes.theme.color} style={[styles.inputeFilds,{color:themes.theme.color}]} />
     <View style={{flexDirection:'row',justifyContent:'space-between'}}>
      <TextInput value={lable && itemsData?.stock} onChangeText={(text)=>changeItemsHandeler(text,'stock')}   placeholder='Stock' placeholderTextColor={themes.theme.color} style={[styles.inputeFilds,{width:'49%',color:themes.theme.color}]} />
        {/*units inpute text */}
        <OptionsInputeText itemsData={itemsData?.units?.toUpperCase()} lable={lable} onChangeText={(text)=>changeItemsHandeler(text,'units')} optionsButton ={unitOption}/>
     </View>
     <View style={{flexDirection:'row',justifyContent:'space-between'}}>
      <TextInput value={lable && itemsData?.salePrice} onChangeText={(text)=>changeItemsHandeler(text,'salePrice')} placeholder='Sele Price' placeholderTextColor={themes.theme.color} style={[styles.inputeFilds,{width:'49%',color:themes.theme.color}]} /> 
      <TextInput value={lable && itemsData?.purchasePrice} onChangeText={(text)=>changeItemsHandeler(text,'purchasePrice')} placeholder='Purchase Price' placeholderTextColor={themes.theme.color} style={[styles.inputeFilds,{width:'49%',color:themes.theme.color}]} /> 
     </View> 
      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
      <OptionsInputeText itemsData={updateSizeOptions} lable={lable}   onChangeText={(text)=>changeItemsHandeler(text,'selectSize')} optionsButton ={sizeOption}/>
      {
      itemsData?.selectSize == 'showsize' &&
      <OptionsInputeText itemsData={itemsData?.size} lable={lable} onChangeText={(text)=>changeItemsHandeler(text,'size')} optionsButton ={sizeData}/> 
      }
      </View>
     <TextInput value={lable && itemsData?.category} onChangeText={(text)=>changeItemsHandeler(text.trim(),'category')} placeholder='Category' placeholderTextColor={themes.theme.color} style={[styles.inputeFilds,{color:themes.theme.color}]}   />
     </View>
     <Button onPress={()=>submitHandler()} color={Colors.mainColor}  title={`${lable && lable} Items`} />
     </View>
    )
}

const styles = StyleSheet.create({
  inputeFilds:{
    borderColor:Colors.mainColor,
    borderWidth:1,
    paddingHorizontal:12,
    color:Colors.mainColor,
  }
})
export default ProductItemsForm