import {View,Text,Dimensions,StyleSheet,TouchableOpacity,Pressable} from 'react-native'
import { useRoute,useNavigation,useFocusEffect} from '@react-navigation/native';
import {useEffect,useContext,useRef,useState,useLayoutEffect,useCallback} from "react"
import * as FileSystem from "expo-file-system/legacy";
import { WebView } from 'react-native-webview';
import htmlContent from '../../component/htmlContent'
import AntDesign from 'react-native-vector-icons/AntDesign' 
import FontAwesome from 'react-native-vector-icons/FontAwesome' 
import {ProductContext} from '../../Context/Contextcontent'
import Currancy from '../../Currancy' 
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import Toast from 'react-native-toast-message'
import Conformation from '../../component/Conformation'
import {deleteItemSale} from '../../Storage/jsonStorage'
import {dbConnection} from '../../Storage/Database'
import * as DocumentPicker from "expo-document-picker";
 import {useSelector,useDispatch } from "react-redux";
  import {deleteSale} from '../../redux/saleSlice'
// import QRCode from "react-native-qrcode-svg";
const {height:ScreenHeight} = Dimensions.get('window')
const ViewSaleBillDetails = ()=>{
  const dispatch = useDispatch()
    const {themes,localUserData,fetchData} = useContext(ProductContext)
    const {sale:SaleRecords} = useSelector((state)=> state.sale)
    const route = useRoute();
    const { billId } = route.params;  
    const bill = SaleRecords.find(saleitem => saleitem.id == billId)
     
    
  // const print mobile thermal
  const PrintUsingMobile = async()=>{
      // 1. Init printer module
      try {
     
    if (bill && localUserData ) {
      const { uri } = await Print.printToFileAsync({html:htmlContent({bill,localUserData}),baseUrl:''});
  
  const newUri = FileSystem.documentDirectory + bill?.customerName.split(" ").join("").toLowerCase()+".pdf"
   
  await FileSystem.moveAsync({
    from:uri,
    to:newUri,
  })
  // Open share/print dialog
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(newUri);
  }
    }else{
       Toast.show({type:'error',text1:'please provide store details'})
    }
    } catch (error) {
      console.log("Error:", error);
    Toast.show({type:'error',text1:error?.message})
    }
  }
  
// add header component 

const navigation = useNavigation();

const SaleDeleteHandler = async()=>{
  const status = await Conformation('⚠️ DELETED ⚠️','Are you delete this invoice !!')
  try {
  if (status && bill) {
    const db = await dbConnection()
      await db.runAsync('DELETE FROM product_sale WHERE id = $value',{$value :billId}) 
    dispatch(deleteSale(billId))
   Toast.show({type:'success',text1:'Existing Sale Deteled !!'})
  } 
    navigation.goBack()
  } catch (e) {
   Toast.show({type:'error',text1:e.message})
  }
}
useLayoutEffect(()=>{
 navigation.setOptions({
   headerTitle: ()=> <Text style={{
     color:themes.theme.color,
     fontWeight:'800',
     fontSize:16,
     
   }}>Invoice</Text>,
   headerRight: ()=> <View style={{
    flexDirection:'row',
    gap:10,
    alignItems:'center',
    
   }}>
   <Pressable onPress={SaleDeleteHandler}  style={[styles.headerButton,{
     backgroundColor:'rgba(256,0,0,0.7)',
     borderColor:'rgba(256,0,0,1)',}]}>
    <Text style={styles.headerButtonText}>Delete</Text>
   </Pressable>
   <Pressable onPress={()=>navigation.navigate("TotalSold",{...bill})} style={[styles.headerButton,{
     backgroundColor:'rgba(255,190,0,0.7)',
     borderColor:'rgba(255,190,0,1)',}]}>
    <Text style={styles.headerButtonText}>Edit</Text>
   </Pressable>
   </View>,
 })
},[navigation])

 
  const DownlowdInvoice = async()=>{
     
  }
   if (!themes) return null;   
  return (
      <View style={{flex:1,justifyContent:"space-between",flexDirection:"column"}}>
            { 
        htmlContent ?
        <WebView 
          source={{html:htmlContent({bill,localUserData}),baseUrl:''}} style={{ height:ScreenHeight - 200}} />
          :
            <Text style={{color:themes.mainColor,fontSize:12,fontWeight:'800'}}>Loading...</Text>
      }
        <View style={{paddingBottom:30,backgroundColor:themes.theme.backgroundTheme,}}>
          <View style={{flexDirection:'row',justifyContent:"space-between",paddingHorizontal:4}}>
          <View style={{justifyContent:'center',alignItems:'center'}}>
          <Text style={{color:themes.mainColor,fontSize:12,fontWeight:'800'}}>Customer Name </Text>
          <Text style={{fontWeight:'600',color:themes.theme.color,fontSize:10}}>{bill?.customerName}</Text>
          </View>
          <View  style={{justifyContent:'center',alignItems:'center'}}>
          <Text style={{color:themes.mainColor,fontSize:12,fontWeight:'800'}}>Total Amount</Text> 
          <Text style={{fontWeight:'600',color:themes.theme.color,fontSize:14}}>{Currancy(bill?.totalAmount)}</Text>
          </View>
          </View>
          <View style={styles.printcontainer}>
            <TouchableOpacity  style={[styles.printitems,{backgroundColor:themes.mainColor,shadowColor:themes.theme.color,borderColor:themes.theme.color}]}>
            <AntDesign color={'#fff'} size={25} name="printer" />
            </TouchableOpacity> 
            <TouchableOpacity onPress={DownlowdInvoice} style={[styles.printitems,{backgroundColor:themes.mainColor,shadowColor:themes.theme.color,borderColor:themes.theme.color}]}>
            <AntDesign color={'#fff'} size={25} name="download" />
            </TouchableOpacity> 
            <TouchableOpacity onPress={PrintUsingMobile} style={[styles.printitems,{backgroundColor:themes.mainColor,shadowColor:themes.theme.color,borderColor:themes.theme.color}]}>
            <FontAwesome color={'#fff'} size={25} name="share" />
            </TouchableOpacity> 
          </View>
        </View>
      </View>
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
  },
  headerButton:{
     borderWidth:1,
     paddingHorizontal:10,
     paddingVertical:3,
     borderRadius:4,
   },
  headerButtonText:{
     color:"#fff",
     fontWeight:'800',
     fontSize:12, 
   }
})
export default ViewSaleBillDetails