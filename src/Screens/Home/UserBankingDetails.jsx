import {View,Text,TextInput,TouchableOpacity,Button,Image} from 'react-native'
import ScrollContainer from '../../component/ScrollContainer'
import React,{useContext,useState} from 'react'
import {ProductContext} from '../../Context/Contextcontent'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
const UserBankingDetails = ({navigation})=>{
  const {themes,localStorageDatafetch,localUserData} = useContext(ProductContext)
  const color = themes.theme.color 
  
  const [userData,setUserData] = useState({
    beusnessName:localUserData ? localUserData?.beusnessName : null,
    phone:localUserData ? localUserData?.phone : null,
    upiId:localUserData ? localUserData?.upiId : null,
    bankHolderName:localUserData && localUserData?.bankHolderName  ? localUserData?.bankHolderName : null,
    accountNumber:localUserData && localUserData?.accountNumber  ? localUserData?.accountNumber : null,
    bankName:localUserData && localUserData?.bankName  ? localUserData?.bankName : null,
    ifsccode:localUserData && localUserData?.ifsccode  ? localUserData?.ifsccode : null,
    imageLogo:localUserData && localUserData?.imageLogo  ? localUserData?.imageLogo : null,
    Adress:localUserData && localUserData?.Adress  ? localUserData?.Adress : null,
    Email:localUserData && localUserData?.Email  ? localUserData?.Email : null,
    Web:localUserData && localUserData?.Web  ? localUserData?.Web : null,
  })
  
  const [loading, setLoading] = useState(false);
  
 
  
  const SubmitHandler = async()=>{
    try {
      if (!userData?.beusnessName || !userData?.phone || !userData?.upiId) {
      Toast.show({type:'error',text1:'Please enter the details beusness /phone /upid'})
      return false
    }  
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
     Toast.show({type:'success',text1:'User Details Save Successfull'})
     localStorageDatafetch()
     navigation.goBack()
    } catch (e) {
       Toast.show({type:'error',text1:e.message})
    }
    
  }
  
  // image Pick
  
  async function pickImage() {
try {
const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
if (!permission.granted) {
Alert.alert('Permission required', 'Permission to access media library is required!');
return;
}


setLoading(true);
 
   const  result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images',],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.3,
      base64: true,
    });

setLoading(false); 
if (result.cancelled) return; 
 setUserData({...userData,imageLogo:result.assets[0].base64})
} catch (e) {
setLoading(false);
console.log(e.message);
Alert.alert('Error', 'Could not pick image');
}
}
if (!themes) return null;
  return (
     <ScrollContainer style={{gap:6}}>
      <Text style={{color,alignSelf:'center',fontWeight:'700'}}>All the information fill carefull</Text>
      
       
        <TextInput value={userData.beusnessName} onChangeText={(text)=> setUserData({...userData,beusnessName:text})} style={{borderBottomWidth:1,borderColor:color,color,paddingVertical:2,}} placeholderTextColor={color} placeholder="Beusness Name" /> 
        
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
           <TextInput 
           value={userData.phone} 
           onChangeText={(text)=> setUserData({...userData,phone:text})} 
           style={{borderBottomWidth:1,borderColor:color,color,paddingVertical:2,width:180}} 
           placeholderTextColor={color}
           keyboardType="phone-pad"
           placeholder="Phone Number"
           /> 
            <TextInput 
            value={userData.upiId} 
            onChangeText={(text)=> setUserData({...userData,upiId:text})} 
            style={{borderBottomWidth:1,borderColor:color,color,paddingVertical:2,width:180}} 
            placeholderTextColor={color} 
            placeholder="UPI ID 3948752893@xyz" /> 
        </View>
        <Text 
        style={{color,marginTop:20}}>Optional ?</Text>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
           <TextInput 
           value={userData.bankHolderName} 
           onChangeText={(text)=> setUserData({...userData,bankHolderName:text})} 
           style={{borderBottomWidth:1,borderColor:color,color,paddingVertical:2,width:180}} 
           placeholderTextColor={color} 
           placeholder="Bank Holder Name" /> 
            <TextInput 
            value={userData.accountNumber} 
            onChangeText={(text)=> setUserData({...userData,accountNumber:text})} 
            style={{borderBottomWidth:1,borderColor:color,color,paddingVertical:2,width:180}} 
            placeholderTextColor={color} 
            placeholder="Account Number" 
            keyboardType="phone-pad"
            /> 
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
           <TextInput 
           value={userData.bankName} 
           onChangeText={(text)=> setUserData({...userData,bankName:text})} 
           style={{borderBottomWidth:1,borderColor:color,color,paddingVertical:2,width:180}} 
           placeholderTextColor={color} 
           placeholder="Bank Name" /> 
            <TextInput 
            value={userData.ifsccode} 
            onChangeText={(text)=> setUserData({...userData,ifsccode:text.toUpperCase()})} 
            style={{borderBottomWidth:1,borderColor:color,color,paddingVertical:2,width:180}} 
            placeholderTextColor={color}
            placeholder="IFSC CODE"
            /> 
        </View>
        <TextInput
          value={userData.Adress} 
          onChangeText={(text)=> setUserData({...userData,Adress:text})} 
          style={{borderBottomWidth:1,borderColor:color,color,paddingVertical:2,}} 
          placeholderTextColor={color} 
          placeholder="Adress"
          /> 
          <TextInput value={userData.Email} onChangeText={(text)=> setUserData({...userData,Email:text})} style={{borderBottomWidth:1,borderColor:color,color,paddingVertical:2,}} placeholderTextColor={color} placeholder="Email" 
          keyboardType="email-address"
          /> 
          <TextInput value={userData.Web} onChangeText={(text)=> setUserData({...userData,Web:text})} style={{borderBottomWidth:1,borderColor:color,color,paddingVertical:2,}} placeholderTextColor={color}
          keyboardType="url"
          placeholder="Web Address" /> 
       
        
        {
          userData.imageLogo &&
          <Image
source={{ uri: `data:image/jpeg;base64,${userData.imageLogo}` }}
style={{width: 160,
height: 160,}}
resizeMode="contain"
/>
        }
        <Button title={loading ? 'Please wait...' : 'Pick & Crop Image'} onPress={pickImage} disabled={loading} />
        
        <View style={{flexDirection:'row',justifyContent:'center',marginTop:10}}> 
         <TouchableOpacity onPress={SubmitHandler} style={{backgroundColor:themes.mainColor,paddingHorizontal:18,paddingVertical:4,borderRadius:4}}> 
          <Text style={{color:'#fff'}} >Submit</Text>
         </TouchableOpacity>
        </View>
     </ScrollContainer>
    )
}

export default UserBankingDetails