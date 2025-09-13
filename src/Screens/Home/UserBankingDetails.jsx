import {View,Text,TextInput,TouchableOpacity} from 'react-native'
import ScrollContainer from '../../component/ScrollContainer'
import React,{useContext,useState} from 'react'
import {ProductContext} from '../../Context/Contextcontent'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    ifsccode:localUserData && localUserData?.ifsccode  ? localUserData?.ifsccode : null
  })
  
 
  
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
  return (
     <ScrollContainer style={{gap:6}}>
      <Text style={{color,alignSelf:'center',fontWeight:'700'}}>All the information fill carefull</Text>
      
       
        <TextInput value={userData.beusnessName} onChangeText={(text)=> setUserData({...userData,beusnessName:text})} style={{borderBottomWidth:1,borderColor:color,color,paddingVertical:2,}} placeholderTextColor={color} placeholder="Beusness Name" /> 
        
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
           <TextInput value={userData.phone} onChangeText={(text)=> setUserData({...userData,phone:text})} style={{borderBottomWidth:1,borderColor:color,color,paddingVertical:2,width:180}} placeholderTextColor={color} placeholder="Phone Number" /> 
            <TextInput value={userData.upiId} onChangeText={(text)=> setUserData({...userData,upiId:text})} style={{borderBottomWidth:1,borderColor:color,color,paddingVertical:2,width:180}} placeholderTextColor={color} placeholder="UPI ID 3948752893@xyz" /> 
        </View>
        <Text style={{color,marginTop:20}}>Optional ?</Text>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
           <TextInput value={userData.bankHolderName} onChangeText={(text)=> setUserData({...userData,bankHolderName:text})} style={{borderBottomWidth:1,borderColor:color,color,paddingVertical:2,width:180}} placeholderTextColor={color} placeholder="Bank Holder Name" /> 
            <TextInput value={userData.accountNumber} onChangeText={(text)=> setUserData({...userData,accountNumber:text})} style={{borderBottomWidth:1,borderColor:color,color,paddingVertical:2,width:180}} placeholderTextColor={color} placeholder="Account Number" /> 
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
           <TextInput value={userData.bankName} onChangeText={(text)=> setUserData({...userData,bankName:text})} style={{borderBottomWidth:1,borderColor:color,color,paddingVertical:2,width:180}} placeholderTextColor={color} placeholder="Bank Name" /> 
            <TextInput value={userData.ifsccode} onChangeText={(text)=> setUserData({...userData,ifsccode:text.toUpperCase()})} style={{borderBottomWidth:1,borderColor:color,color,paddingVertical:2,width:180}} placeholderTextColor={color} placeholder="IFSC CODE" /> 
        </View>
        
        <View style={{flexDirection:'row',justifyContent:'center',marginTop:10}}> 
         <TouchableOpacity onPress={SubmitHandler} style={{backgroundColor:themes.mainColor,paddingHorizontal:18,paddingVertical:4,borderRadius:4}}> 
          <Text style={{color:'#fff'}} >Submit</Text>
         </TouchableOpacity>
        </View>
     </ScrollContainer>
    )
}

export default UserBankingDetails