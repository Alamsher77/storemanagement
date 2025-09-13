import * as Sharing from "expo-sharing"; 
import * as FileSystem from "expo-file-system";
import {View,Text,TouchableOpacity} from 'react-native'
import React,{useContext,} from 'react'
import {ProductContext} from '../Context/Contextcontent'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import * as DocumentPicker from "expo-document-picker"; 
import Toast from 'react-native-toast-message'
const StoreHeader = ()=>{
    const {themes,fetchData} = useContext(ProductContext)
  const folderUri = FileSystem.documentDirectory;
   const files = ["product.json","sale.json"]; // jitni files aap rakhte ho
  const FileExportHandler = async ()=>{
     try {    
      // const filinfo = await FileSystem.readDirectoryAsync(folderUri)  
      for (let file of files) {
      const filePath = folderUri + file;
      const fileInfo = await FileSystem.getInfoAsync(filePath); 
      if (fileInfo.exists) {
        console.log("📤 Exporting:", filePath); 
        // Share file
        await Sharing.shareAsync(filePath);
      }
    }
     } catch (e) {
       console.log(e.message)
       alert(e.message)
     }
  }
  
  const FileImportHandler = async ()=>{ 
    try {
     
    const result = await DocumentPicker.getDocumentAsync({ type: "application/json" }); 
      if (!result.canceled) {
    const file = result.assets[0]; // pehla selected file
    const sourceUri = file.uri;
    const destUri = folderUri + file.name; // same  
    if (!files.includes(file.name)){
      Toast.show({type:'error',text1:'Import Right files (product.json and sale.json)'})
      return false
    }
     
    const content = await FileSystem.readAsStringAsync(sourceUri); 
    await FileSystem.writeAsStringAsync(destUri, content);  
    alert(file.name+' File Imported Successfull')
  fetchData()
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