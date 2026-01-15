import {View,Text,TextInput,TouchableOpacity,Pressable} from 'react-native'
import {useState,useEffect} from 'react' 
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import DateTimePicker from '@react-native-community/datetimepicker';
import DateFormate from '../../dateFormate'
import Text_Content from '../../component/Text_Content'
import {dbConnection} from '../../Storage/Database' 
import { useNavigation } from '@react-navigation/native';
import DateAndTime from '../../dateAndTime'
import Toast from 'react-native-toast-message'
 import {useSelector,useDispatch } from "react-redux";
 import {decreaseDue,increaseDue} from '../../redux/ledgerSlice'

const Transaction_given = ({themes,customer_id})=>{
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const [givenAmount,setGivenAmount] = useState(0)
  const [showDateModel,setShowDateModel] = useState(false)
  const [dueTransaction,setDueTransaction] = useState({
    sale_id:'',
    user_id:customer_id,
    transaction_type:'given',
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
  const [latestForSaleRecords,setLatestForSaleRecords] = useState([])
  
  useEffect(()=>{
   const fetchData = async ()=>{
      const db = await dbConnection();
    const results = await db.getAllAsync("SELECT * FROM product_sale ORDER BY id DESC LIMIT 4 ;")
     setLatestForSaleRecords(results)
   }
   fetchData()
  },[])
  
 const saleAmountChangeHandler = (data)=>{
   setGivenAmount(data?.totalAmount)
   setDueTransaction((prev)=>({...prev,sale_id:data?.id,total_due:data?.totalAmount}))
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
  
     const updateUsersDueAmount = await db.runAsync("UPDATE users SET grand_total_due = grand_total_due - ? WHERE id = ?;",[givenAmount,customer_id])
     dispatch(increaseDue({userId:customer_id,amount:givenAmount}))
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
          <Text_Content>Select Date</Text_Content>
          <Text style={{color:themes.theme.color}}>{DateFormate(dateValue)}</Text>
          </TouchableOpacity> 
         </View>
         {showDateModel && (
        <DateTimePicker 
          value={dateValue}
          mode="date"
          display="default"
          onChange={ChangeDateHandler}
          maximumDate={dateValue}
        />
      )}
      <View style={{width:'100%',paddingBottom:8,gap:6}}>
       <Text_Content >
        Latest sale data add this in bill
       </Text_Content>
       {
         latestForSaleRecords?.length == 0 ?
         
         <Text_Content>No records</Text_Content>
         :
         latestForSaleRecords?.map((item,index)=>{
           return(
           <TouchableOpacity 
           style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:12,backgroundColor: dueTransaction?.sale_id  === item?.id ? 'rgba(0,120,0,0.8)' : 'rgba(100,120,0,0.8)',paddingHorizontal:8,borderRadius:8}} 
           onPress={()=>saleAmountChangeHandler(item)}
           key={index}>
            <Text_Content style={{color:'#fff',fontWeight:'600'}} >{item?.customerName}</Text_Content>
            <Text_Content style={{minWidth:40,color:'#fff',fontWeight:'600'}}>{item?.totalAmount}</Text_Content>
           </TouchableOpacity>
           )
         })
       }
      </View>
      
      <TouchableOpacity
      disabled={dueTransaction?.total_due?.trim().length === 0 || dueLoading}
      onPress={DueConfirmHandler}
      style={{backgroundColor:'rgba(0,180,0,1)',width:250,justifyContent:'center',alignItems:'center',paddingVertical:6,borderRadius:6,opacity:dueTransaction?.total_due?.trim().length === 0 ? 0.2 : 1}}
      >
       <Text style={{color:'#fff',fontWeight:'700',fontSize:18}}> {dueLoading ? "Loading..." : "Confirm"}</Text>
      </TouchableOpacity>
     </View>
    )
}

export default Transaction_given