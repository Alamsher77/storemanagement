import * as Sharing from "expo-sharing"; 
import * as FileSystem from "expo-file-system/legacy";
import {View,Text,TouchableOpacity} from 'react-native'
import React,{useContext,} from 'react'
import {ProductContext} from '../Context/Contextcontent'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import {
  initFile,
  readData,
  addItem,
  deleteItem,
  updateItem,
  readDataSale
} from '../Storage/jsonStorage'

import {dbConnection,addSale,addProduct} from '../Storage/Database'
import * as DocumentPicker from "expo-document-picker"; 
import Toast from 'react-native-toast-message'
const StoreHeader = ({title})=>{
    const {themes,fetchData} = useContext(ProductContext)
    if (!title) return null;
  const folderUri = FileSystem.documentDirectory;
   const files = ["product.json","sale.json"]; // jitni files aap rakhte ho
  const FileExportHandler = async ()=>{
     try {    
      const filinfo = await FileSystem.readDirectoryAsync(folderUri)  
          const filePath = folderUri +  'SQLite/productStore.db'
      const fileInfo = await FileSystem.getInfoAsync(filePath); 
      console.log(fileInfo)
      if (fileInfo.exists) {
        console.log("📤 Exporting:", filePath); 
        // Share file
        await Sharing.shareAsync(filePath);
      }
    //   for (let file of files) {
    //   const filePath = folderUri + file;
    //   const fileInfo = await FileSystem.getInfoAsync(filePath); 
    //   if (fileInfo.exists) {
    //     console.log("📤 Exporting:", filePath); 
    //     // Share file
    //     await Sharing.shareAsync(filePath);
    //   }
    // }
     } catch (e) {
       console.log(e.message)
       alert(e.message)
     }
  }
  
  const FileImportHandler = async ()=>{ 
    try {
  
      // const destUri = folderUri +"SQLite/"; // same   
      // const folders = await FileSystem.readDirectoryAsync(destUri)
      // console.log(folders)
    const result = await DocumentPicker.getDocumentAsync({type:'application/octet-stream'}); 
    
      if (!result.canceled) {
    const file = result.assets[0]; // pehla selected file
    const sourceUri = file.uri;
    const destUri = folderUri +"SQLite/"+file.name; // same    
    
  await FileSystem.makeDirectoryAsync(folderUri+"SQLite",{intermediates:true}) 
 
    const info = await FileSystem.getInfoAsync(destUri);
    if (info.exists) {
      await FileSystem.deleteAsync(destUri, { idempotent: true });
    }

    await FileSystem.copyAsync({
      from:sourceUri,
      to:destUri
    })
   
    alert(file.name+' File Imported Successfull please restart the app')

    } else {
    console.log("User canceled import");
    } 
    } catch (e) {
        console.log(e.message)
          alert(e.message)
    }
  }
  return (
     <View style={{
        backgroundColor:themes.theme.backgroundThemes,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",paddingHorizontal:6,gap:12}}>
      <TouchableOpacity onPress={FileImportHandler} style={{
        borderWidth:2,borderColor:'#777',borderRadius:6,flexDirection:'row',alignItems:'center',paddingHorizontal:8,paddingVertical:4,gap:6
      }}>
        <FontAwesome5 name="file-import" color={themes.theme.color} size={16} />
       <Text style={{color:themes.theme.color,}}>Import File</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={FileExportHandler} style={{
        borderWidth:2,borderColor:'#777',borderRadius:6,flexDirection:'row',alignItems:'center',paddingHorizontal:8,paddingVertical:4,gap:6
      }}>
        <FontAwesome5 name="file-export" color={themes.theme.color} size={16} />
       <Text style={{color:themes.theme.color,}}>Export File</Text>
      </TouchableOpacity>
     </View>
    )
}

export default StoreHeader