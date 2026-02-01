
import {View,Text,TouchableOpacity,TextInput} from "react-native"
 import Text_Content from '../../component/Text_Content'
 import AnimatedButton from '../../component/Button'
 import {useSelector,useDispatch} from 'react-redux'
 import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
 import Feather from 'react-native-vector-icons/Feather'
 import {useState} from 'react'
  import {dbConnection} from '../../Storage/Database'
  import DateFormate from '../../dateFormate'
  import Conformation from '../../component/Conformation'
import {updateCustomers,deleteCustomers} from '../../redux/ledgerSlice'
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message'
const UserProfile = ({customer_id,themes})=>{
  const dispatch = useDispatch()
  const navigations = useNavigation()
  const customers = useSelector((state)=> state.customers.customers)
  const currentCustomer = customers?.find((customer)=> customer?.id === customer_id)
   const [ isEditable,setIsEditable] = useState(false)
   const [customerDetails,setCustomerDetails] = useState({
     ...currentCustomer,
     name:currentCustomer?.name,
     phone:currentCustomer?.phone,
     address:currentCustomer?.address
   })

const updateCustomerDetailsHandler = async ()=>{
 if(!isEditable)return setIsEditable(true) 
 
try {
   const status = await Conformation('Update','Are you sure you want to update customerDetails !!') 
   if(!status) return false
const db = await dbConnection()
const updatedUsers = await db.runAsync("UPDATE users SET name= ? , phone = ? , address = ? WHERE id = ? ;",[customerDetails?.name,customerDetails?.phone,customerDetails?.address,customer_id])
 dispatch(updateCustomers(customerDetails))
navigations.pop(2)
 setIsEditable(false)
 
} catch (e) {
  console.log(e)
}
}

const DeleteCustomersHandler = async ()=>{
    const status = await Conformation('⚠️ Deleted ','Are you sure you want to Delete Customer !!') 
   if(!status) return false
   if(currentCustomer?.grand_total_due !== 0){
     Toast.show({type:'error',text1:'Dues not clear please clear !!!'})
    navigations.navigate('Customer_manage_payment',{customer_id,transaction_type:currentCustomer?.grand_total_due >= 0 ? 'given' : "receive"}) 
    return false
   }
  try {
    const db = await dbConnection()
    const deleteCustomer = await db.runAsync("DELETE FROM users WHERE id = ? ",[customer_id])
    dispatch(deleteCustomers(customer_id))
    navigations.pop(2)

  } catch (e) {
    console.log(e)
  }
} 
  return (
     <View style={{paddingTop:40,gap:12,width:'80%'}}>
      
       <View style={{width:'100%',borderBottomWidth:0.5,borderColor:themes.theme.color}}>
         <View style={{flexDirection:'row',alignItems:'center',gap:8,}}>
         <Feather size={20} color={themes.theme.color} name="user" />
          <Text_Content >Customer Name</Text_Content>
          </View>
         <TextInput 
         onChangeText={(text)=>setCustomerDetails((prev)=>({...prev,name:text}))}
         editable={isEditable}
         value={customerDetails?.name}
         style={{color:themes.theme.color,paddingHorizontal:6,paddingVertical:4}} 
         placeholderTextColor={themes.theme.color} 
         placeholder="Name" />
         </View>
       <View style={{width:'100%',borderBottomWidth:0.5,borderColor:themes.theme.color}}>
         <View style={{flexDirection:'row',alignItems:'center',gap:8,}}>
         <Feather size={20} color={themes.theme.color} name="phone" />
          <Text_Content >Customer Phone</Text_Content>
          </View>
         <TextInput
          onChangeText={(text)=>setCustomerDetails((prev)=>({...prev,phone:text}))}
          editable={isEditable}
         value={customerDetails?.phone}
         inputMode="numeric"
          keyboardType="number-pad"
         style={{color:themes.theme.color,paddingHorizontal:6,paddingVertical:4}} 
         placeholderTextColor={themes.theme.color} 
         placeholder="Phone" />
         </View>
       <View style={{width:'100%',borderBottomWidth:0.5,borderColor:themes.theme.color}}>
         <View style={{flexDirection:'row',alignItems:'center',gap:8,}}>
         <MaterialIcons size={20} color={themes.theme.color} name="add-location" />
          <Text_Content >Address</Text_Content>
          </View>
         <TextInput  
          onChangeText={(text)=>setCustomerDetails((prev)=>({...prev,address:text}))}
          editable={isEditable}
         value={customerDetails?.address}
         multiline
         numberOfLines={4}
         style={{color:themes.theme.color,paddingHorizontal:6,paddingVertical:4}} 
         placeholderTextColor={themes.theme.color} 
         placeholder="Enter address" />
         </View>
       <View style={{width:'100%',borderBottomWidth:0.5,borderColor:themes.theme.color}}>
         <View style={{flexDirection:'row',alignItems:'center',gap:8,}}>
         <MaterialIcons size={20} color={themes.theme.color} name="calendar-month" />
          <Text_Content >Created Date</Text_Content>
          </View>
         <Text_Content>{currentCustomer?.created_date ? DateFormate(currentCustomer?.created_date) : 'Not added'}</Text_Content>
         </View>
      <View style={{flexDirection:'row',justifyContent:'center',gap:6}}>
     <AnimatedButton 
     onPress={updateCustomerDetailsHandler}
     disabled={false}   color="#eee" bgColor="rgba(0,200,0,1)" title={isEditable ? "Update now" : "Edit"} />
     <AnimatedButton onPress={DeleteCustomersHandler} disabled={false}   color="#eee" bgColor="rgba(200,20,0,1)" title="Delete" />
     </View>
     </View>
    )
}

export default UserProfile