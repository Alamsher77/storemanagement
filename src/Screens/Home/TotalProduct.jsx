import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import React,{useContext} from 'react'
import {WebView} from 'react-native-webview'
import {ProductContext} from '../../Context/Contextcontent'
import Currancy from '../../Currancy' 
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import FontAwesome from 'react-native-vector-icons/FontAwesome' 

import AntDesign from 'react-native-vector-icons/AntDesign' 
import { useSelector,useDispatch } from "react-redux"; 
export default function TotalProduct() {
const {themes} = useContext(ProductContext)
  const dispatch = useDispatch()
  // get product and productCategory from redux 
  const {products:itemsRecords,} = useSelector((state)=>state.product)
const filterProductData = itemsRecords.filter((items)=> (items?.stock <= 0 ))
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <title>List Of Product</title>
  <style>
  *{
    margin:0;
    padding:0;
    box-sizing: border-box;
  }
  </style>
  </head>
  <body>
    <div style="margin:auto;width:100%;text-align:center;margin-top:20px;">
      <h3 style="font-size:30px;color:${themes.mainColor}">Product List </h3>
     <div style="display:flex;gap:30px;margin-top:20px;justify-content:center;padding-bottom:20px">
        ${
          filterProductData && filterProductData?.length == 0 ?
          "<h1>no records found</h1>"
          :
          filterProductData?.map((items,index)=>{ 
            return `${index == 0 ? '<div style="text-align:start;">' :  index == Math.floor(filterProductData.length / 2 ) + 1  ? '<div style="text-align:start;">' : ''} <div style="display:flex;justify-content:space-between;gap:20px;">  <p>${index + 1} ${items?.name}</p>
               <p>${Currancy(items?.salePrice)}</p>
            </div> ${index == Math.floor(filterProductData.length / 2 ) ? '</div>' : index == filterProductData.length -1 ? '</div>' :'' }`
          }).join('')
        }
     </div>
    </div>
  </body>
  </html>
  `
  
  const PrintData = async()=>{
    try {
    if (itemsRecords) { 
    const { uri } = await Print.printToFileAsync({html:htmlContent})
      const newUri = FileSystem.documentDirectory +"items.pdf"
      
     await FileSystem.moveAsync({
     from:uri,
     to:newUri,
   })
   if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(newUri);
  }
    }
    } catch (e) {
      console.log(e.message)
    }
   
  }
  
   if (!themes) return null;
  return ( 
    <>
       <WebView style={{flex:0.80}} source={{html:htmlContent,baseUrl:''}} /> 
       <View style={[styles.printcontainer,{backgroundColor:themes.theme.backgroundTheme,paddingVertical:8,paddingBottom:20
       }]}>
            <TouchableOpacity  style={[styles.printitems,{backgroundColor:themes.mainColor,shadowColor:themes.theme.color,borderColor:themes.theme.color}]}>
            <AntDesign color={'#fff'} size={25} name="printer" />
            </TouchableOpacity> 
            <TouchableOpacity style={[styles.printitems,{backgroundColor:themes.mainColor,shadowColor:themes.theme.color,borderColor:themes.theme.color}]}>
            <AntDesign color={'#fff'} size={25} name="download" />
            </TouchableOpacity> 
            <TouchableOpacity onPress={PrintData} style={[styles.printitems,{backgroundColor:themes.mainColor,shadowColor:themes.theme.color,borderColor:themes.theme.color}]}>
            <FontAwesome color={'#fff'} size={25} name="share" />
            </TouchableOpacity> 
         
       </View>
    </> 
  )
}

const styles = StyleSheet.create({
  printcontainer:{
    flexDirection:'row',
    paddingHorizontal:8,
    justifyContent:'space-around',
    marginTop:12, 
  },
  printitems:{
    borderWidth:1, 
    paddingHorizontal:6,
    paddingVertical:4,
    borderRadius:6,
    elevation:6
  }
})