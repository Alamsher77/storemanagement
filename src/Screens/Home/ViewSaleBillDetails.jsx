import {View,Text,Dimensions,StyleSheet,TouchableOpacity} from 'react-native'
import { useRoute } from '@react-navigation/native';
import {useEffect,useContext,useRef,useState} from "react"
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { WebView } from 'react-native-webview';
import htmlContent from '../../component/htmlContent'
import AntDesign from 'react-native-vector-icons/AntDesign' 
import FontAwesome from 'react-native-vector-icons/FontAwesome' 
import {ProductContext} from '../../Context/Contextcontent'
import Currancy from '../../Currancy' 
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import Toast from 'react-native-toast-message'
import QRCode from "react-native-qrcode-svg";
const {height:ScreenHeight} = Dimensions.get('window')
const ViewSaleBillDetails = ()=>{
    const {themes,localUserData} = useContext(ProductContext)
    const route = useRoute();
    const { bill } = route.params; 
  const qrRef = useRef();
  const [qrImage, setQrImage] = useState(null);

   useEffect(() => {
    if (qrRef.current) {
      qrRef.current.toDataURL((data) => {
        setQrImage(`data:image/png;base64,${data}`);
      });
    }
  }, []);
  
  const htmlcontentData = htmlContent({bill,localUserData,qrImage})
  // const print mobile thermal
  const PrintUsingMobile = async()=>{
       // 1. Init printer module
       try { 
    if (bill && localUserData && qrImage) {
       const { uri } = await Print.printToFileAsync({html:htmlcontentData,baseUrl:''});
  
  const newUri = FileSystem.documentDirectory + bill?.customerName.split(" ").join("").toLowerCase()+".pdf"
   
   await FileSystem.moveAsync({
     from:uri,
     to:newUri,
   })
  // Open share/print dialog
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(newUri);
  }
    }
 
    } catch (error) {
      console.log("Error:", error);
    Toast.show({type:'error',text1:error?.message})
    }
  }
   
  return (
      <>
      {
        !qrImage &&
        <QRCode
       
        value={`upi://pay?pa=${localUserData && localUserData?.upiId}&pn=${localUserData && localUserData?.bankHolderName ? localUserData?.bankHolderName : 'Store management'}&am=${bill?.totalAmount}&cu=INR&tn=Bill Payment for ${localUserData && localUserData?.beusnessName}`}
        size={400}
        logo={require('../../assetes/logo.png')}
        getRef={(c) => (qrRef.current = c)}
      />
      }
        
        {
        htmlcontentData ?  
        
        <WebView
        
          source={{html:htmlcontentData,baseUrl:''}} style={{ height:ScreenHeight - 200}} />
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
            <TouchableOpacity style={[styles.printitems,{backgroundColor:themes.mainColor,shadowColor:themes.theme.color,borderColor:themes.theme.color}]}>
            <AntDesign color={'#fff'} size={25} name="download" />
            </TouchableOpacity> 
            <TouchableOpacity onPress={PrintUsingMobile} style={[styles.printitems,{backgroundColor:themes.mainColor,shadowColor:themes.theme.color,borderColor:themes.theme.color}]}>
            <FontAwesome color={'#fff'} size={25} name="share" />
            </TouchableOpacity> 
          </View>
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
export default ViewSaleBillDetails