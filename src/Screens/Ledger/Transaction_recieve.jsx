import {View,Text,TextInput,TouchableOpacity,Pressable} from 'react-native'
import {useState,useEffect} from 'react' 
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import DateTimePicker from '@react-native-community/datetimepicker';
import DateFormate from '../../dateFormate'
import Text_Content from '../../component/Text_Content'
import {dbConnection,updateUsersDetails} from '../../Storage/Database' 
import { useNavigation } from '@react-navigation/native';
import DateAndTime from '../../dateAndTime'
import Toast from 'react-native-toast-message'
 import {useSelector,useDispatch } from "react-redux";
 import {decreaseDue,increaseDue} from '../../redux/ledgerSlice'
import AnimatedButton from '../../component/Button'
const Transaction_recieve = ({themes,customer_id})=>{
   const navigation = useNavigation()
  const dispatch = useDispatch()
  const [givenAmount,setGivenAmount] = useState(0)
  const [showDateModel,setShowDateModel] = useState(false)
  const [dueTransaction,setDueTransaction] = useState({
    sale_id:'',
    user_id:customer_id,
    transaction_type:'received',
    total_due:'',
    description:'',
    date:'',
    time:''
  })
  const ChangePriceValue = (text)=>{
    const filtered = text.replace(/[^0-9]/g, '');
    setGivenAmount(filtered);
    setDueTransaction((prev)=>({...prev,total_due:filtered}))
  }
  const [dateValue,setDateValue] = useState(new Date())
  const ChangeDateHandler = (eventn,getDate)=>{
    setShowDateModel(false)
    setDateValue(getDate)
    const formateTime = getDate.toLocaleTimeString()
    setDueTransaction((prev)=>({...prev,time:formateTime,date:getDate}))
    
  }
  
 const [dueLoading,setDueLoading] = useState(false)
 const DueConfirmHandler = async ()=>{
    try {
    setDueLoading(true)
    const db = await dbConnection() 
 
    const query = `
      INSERT INTO users_transaction (sale_id,user_id, transaction_type, total_due, description, date,time)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

const transactionCreated=  await db.runAsync(query, [ 
    dueTransaction.sale_id,
    dueTransaction.user_id,
    dueTransaction.transaction_type,
    dueTransaction.total_due,
    dueTransaction.description,
    dueTransaction.date,
    dueTransaction.time
  ]);
     await updateUsersDetails({
           type:'recieve',
           updatedAmount:givenAmount,
           transactionAmount:givenAmount,
           updatedDate:DateAndTime().formatDate,
           customer_id,
           latestType:'payment'
         }) 
     dispatch(decreaseDue({
           userId:customer_id,
           amount:givenAmount,
           latest_transaction_payment_type:'payment',
           latest_transaction_date:DateAndTime()?.formatDate,
           latest_transaction_amount:givenAmount
           }))  
     setDueLoading(false)
     Toast.show({type:'success',text1:'Due added SuccessFull'})
     navigation.goBack()
    
  } catch (e) {
    setDueLoading(false)
    console.log(e)
  }
 }
 
 useEffect(()=>{
   const getFormateDate = DateAndTime(dateValue)
    setDueTransaction((prev)=>({...prev,date:getFormateDate?.formatDate,time:getFormateDate?.time}))
 },[dateValue])
  return (
     <View style={{alignItems:'center',gap:25,height:'100%',justifyContent:'center',width:280}}>
         <View style={{borderBottomWidth:0.5,borderColor:themes.theme.color,width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
         <Text_Content style={{fontSize:30}}>₹</Text_Content>
          <TextInput 
          onChangeText={ChangePriceValue}
          numberOfLines={4} 
          maxLength={7}
          value={givenAmount}
          inputMode="numeric"
          keyboardType="number-pad"
          returnKeyType='next'
          style={{color:themes.theme.color,fontSize:35}} 
          placeholderTextColor={themes.theme.color} placeholder='0' />
         </View>
         
         <View style={{width:'100%',borderBottomWidth:0.5,borderColor:themes.theme.color}}>
         <View style={{flexDirection:'row',alignItems:'center',gap:8,}}>
         <MaterialIcons size={20} color={themes.theme.color} name="note-add" />
          <Text_Content >Add notes</Text_Content>
          </View>
         <TextInput 
         onChangeText={(text)=>setDueTransaction((prev)=>({...prev,description:text}))}
         multiline
         numberOfLines={4}
         style={{color:themes.theme.color,paddingHorizontal:6,paddingVertical:4}} 
         placeholderTextColor={themes.theme.color} 
         placeholder="add" />
         </View>
         <View style={{width:'100%',borderBottomWidth:0.5,borderColor:themes.theme.color,paddingBottom:8}}>
         <TouchableOpacity
         onPress={()=>setShowDateModel(true)}
         style={{flexDirection:'row',alignItems:'center',gap:8,}}>
         <MaterialIcons size={20} color={themes.theme.color} name="date-range" />
          <Text_Content>Selected Date</Text_Content>
          <Text style={{color:themes.theme.color}}>{DateFormate(dateValue)}</Text>
          </TouchableOpacity> 
         </View>
         {showDateModel && (
        <DateTimePicker 
          value={dateValue}
          mode="date"
          display="default"
          onChange={ChangeDateHandler}
          maximumDate={new Date()}
        />
      )}
      
     <AnimatedButton
      disabled={dueTransaction?.total_due?.trim().length === 0 || dueLoading}
      onPress={DueConfirmHandler}
      style={{width:250}}
      bgColor="rgba(0,180,0,1)"
      color="#fff"
      title={dueLoading ? "Loading..." : "Confirm"}
      />
     </View>
    )
}

export default Transaction_recieve