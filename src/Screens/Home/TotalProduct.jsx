import {
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import React,{useContext} from 'react'
import {WebView} from 'react-native-webview'
import {ProductContext} from '../../Context/Contextcontent'
import Currancy from '../../Currancy' 
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
export default function TotalProduct() {
const {themes,itemsRecords} = useContext(ProductContext)
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
    <div style="margin:auto;width:100vh;text-align:center;margin-top:20px;">
      <h3 style="font-size:30px;color:${themes.mainColor}">Product List </h3>
     <div style="display:flex;gap:30px;margin-top:20px;justify-content:center;">
        ${
          itemsRecords && itemsRecords?.length !== 0 && itemsRecords?.map((items,index)=>{ 
            return `${index == 0 ? '<div style="text-align:start;">' :  index == Math.floor(itemsRecords.length / 2 ) + 1  ? '<div style="text-align:start;">' : ''} <div style="display:flex;justify-content:space-between;gap:20px;">  <p>${index + 1} ${items?.name}</p>
               <p>${Currancy(items?.salePrice)}</p>
            </div> ${index == Math.floor(itemsRecords.length / 2 ) ? '</div>' : index == itemsRecords.length -1 ? '</div>' :'' }`
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
  return ( 
    <>
       <WebView style={{flex:0.80}} source={{html:htmlContent,baseUrl:''}} /> 
       <View style={{paddingBottom:20}} >
          <TouchableOpacity onPress={PrintData}>
           <Text>Share</Text>
          </TouchableOpacity>
       </View>
    </> 
  )
}