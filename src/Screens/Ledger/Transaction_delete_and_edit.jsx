import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable
} from 'react-native'
import {
  useState,
  useEffect,
  useRef
} from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import DateTimePicker from '@react-native-community/datetimepicker';
import DateFormate from '../../dateFormate'
import Text_Content from '../../component/Text_Content'
import {
  dbConnection,updateUsersDetails
} from '../../Storage/Database'
import {
  useNavigation
} from '@react-navigation/native';
import DateAndTime from '../../dateAndTime'
import Toast from 'react-native-toast-message'
import {
  useSelector,
  useDispatch
} from "react-redux";
import {
  decreaseDue,
  increaseDue
} from '../../redux/ledgerSlice'
import AnimatedButton from '../../component/Button'
const TransactionDeleteAndEdit = ({
  themes, customer_id, curretnTransactionList
})=> {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const [dateValue,
    setDateValue] = useState(new Date())
  const [showDateModel,
    setShowDateModel] = useState(false)
  const [dueTransaction,
    setDueTransaction] = useState({
      sale_id: curretnTransactionList?.sale_id,
      user_id: curretnTransactionList?.user_id,
      transaction_type: curretnTransactionList?.transaction_type,
      total_due: curretnTransactionList?.total_due,
      description: curretnTransactionList?.description,
      date: curretnTransactionList?.date,
      time: curretnTransactionList?.time
    })
  const [dueLoading,
    setDueLoading] = useState(false)
  const totalDueInputRef = useRef(null)
  const [isEditable,
    setIsEditable] = useState(false)
  const DueConfirmHandler = async ()=> {
    try {
      const db = await dbConnection()
      if (curretnTransactionList?.transaction_type === 'given') {
        const deletedata = await db.runAsync("DELETE FROM users_transaction WHERE id = ?", [curretnTransactionList.id])
        
         await updateUsersDetails({
           type:'recieve',
           updatedAmount:curretnTransactionList?.total_due,
           transactionAmount:curretnTransactionList?.total_due,
           updatedDate:DateAndTime().formatDate,
           customer_id,
           latestType:'delete'
         })
         
         dispatch(decreaseDue({
           userId:curretnTransactionList?.user_id,
           amount:dueTransaction?.total_due,
           latest_transaction_payment_type:'delete',
           latest_transaction_date:DateAndTime()?.formatDate,
           latest_transaction_amount:dueTransaction?.total_due
           }))
       
        navigation.goBack()

      } else {

        const deletedata = await db.runAsync("DELETE FROM users_transaction WHERE id = ?", [curretnTransactionList.id])
       await updateUsersDetails({
           type:'given',
           updatedAmount:curretnTransactionList?.total_due,
           transactionAmount:curretnTransactionList?.total_due,
           updatedDate:DateAndTime().formatDate,
           customer_id,
           latestType:'delete'
         })
         
         dispatch(increaseDue({
           userId:curretnTransactionList?.user_id,
           amount:dueTransaction?.total_due,
           latest_transaction_payment_type:'delete',
           latest_transaction_date:DateAndTime()?.formatDate,
           latest_transaction_amount:dueTransaction?.total_due
           }))
       
        // console.log(deletedata)
        navigation.goBack()
      }
    } catch (e) {
      console.log(e)
    }
  }

  const EaditableConfirmHandler = async()=> {
    try {
      const db = await dbConnection()
      if (!isEditable) {
        setIsEditable(true)
        return false
      }
      setIsEditable(false)
      const oldAmount = Number(curretnTransactionList?.total_due)
      const newAmount = Number(dueTransaction?.total_due)
      const calculateDifrentAmount = newAmount - oldAmount
      const updateUserTransaction = await db.runAsync("UPDATE  users_transaction SET sale_id = ? , user_id = ? , transaction_type = ? , total_due = ? , description = ? , date = ? , time = ? WHERE id = ?", [dueTransaction?.sale_id, dueTransaction?.user_id, dueTransaction?.transaction_type, dueTransaction?.total_due, dueTransaction?.description, dueTransaction?.date, dueTransaction?.time, curretnTransactionList?.id])

      if (curretnTransactionList?.transaction_type === 'given') {
      
     const respons = await updateUsersDetails({type:'given',updatedAmount:calculateDifrentAmount,transactionAmount:dueTransaction?.total_due,updatedDate:DateAndTime().formatDate,customer_id,latestType:'edit'})
      
    dispatch(increaseDue({userId:curretnTransactionList?.user_id,amount:calculateDifrentAmount,latest_transaction_payment_type:'edit',latest_transaction_date:DateAndTime()?.formatDate,latest_transaction_amount:dueTransaction?.total_due}))
      
        navigation.goBack()
        return false
      }
   const respons = await updateUsersDetails({type:'recieve',updatedAmount:calculateDifrentAmount,transactionAmount:dueTransaction?.total_due,updatedDate:DateAndTime().formatDate,customer_id,latestType:'edit'})
    
      dispatch(increaseDue({userId:curretnTransactionList?.user_id,amount:calculateDifrentAmount,latest_transaction_payment_type:'edit',latest_transaction_date:DateAndTime()?.formatDate,latest_transaction_amount:dueTransaction?.total_due}))

      navigation.goBack()
    } catch (e) {
      console.log(e)
    }
  }

  const ChangeDateHandler = (eventn, getDate)=> {
    setShowDateModel(false)
    setDateValue(getDate)
    const formateTimeAndDate = DateAndTime(getDate)
    setDueTransaction((prev)=>({
      ...prev, time: formateTimeAndDate.time, date: formateTimeAndDate?.formatDate
    }))

  }

  useEffect(() => {
    if (isEditable) {
      setTimeout(() => {
        totalDueInputRef.current?.focus()
      }, 100)
    }
  },
    [isEditable])

  return (
    <View style={ { alignItems: 'center',
      gap: 25,
      height: '100%',
      justifyContent: 'center',
      width: 300 }}>
         <View style={ { borderBottomWidth: 0.5,
        borderColor: themes.theme.color,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
      }}>
         <Text_Content style={ { fontSize: 30 }}>₹</Text_Content>
          <TextInput
        editable={isEditable}
        numberOfLines={4}
        maxLength={7}
        ref={totalDueInputRef}
        value={dueTransaction?.total_due}
        onChangeText={(text)=> setDueTransaction((prev)=>({ ...prev, total_due: text.replace(/[^0-9]/g, '')}))}
        inputMode="numeric"
        keyboardType="number-pad"
        returnKeyType='next'
        style={ { color: themes.theme.color,
          fontSize: 35 }}
        placeholderTextColor={themes.theme.color} placeholder='0' />
         </View>
         <View style={ { width: '100%',
        borderBottomWidth: 0.5,
        borderColor: themes.theme.color }}>
         <View style={ { flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}>
         <MaterialIcons size={20} color={themes.theme.color} name="note-add" />
          <Text_Content>Add notes</Text_Content>
          </View>
         <TextInput
        editable={isEditable}
        value={dueTransaction?.description}
        multiline
        onChangeText={(text)=> setDueTransaction((prev)=>({ ...prev, description: text }))}
        numberOfLines={4}
        style={ { color: themes.theme.color,
          paddingHorizontal: 6,
          paddingVertical: 4 }}
        placeholderTextColor={themes.theme.color}
        placeholder="add" />
         </View>
         <View style={ { width: '100%',
        borderBottomWidth: 0.5,
        borderColor: themes.theme.color,
        paddingBottom: 8 }}>
         <TouchableOpacity
        onPress={()=> isEditable && setShowDateModel(true)}
        style={ { flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}>
         <MaterialIcons size={20} color={themes.theme.color} name="date-range" />
          <Text_Content>Selected Date</Text_Content>
          <Text style={ { color: themes.theme.color }}>{DateFormate(dueTransaction?.date)}</Text>
          </TouchableOpacity>
         </View>
          {showDateModel && isEditable && (
      <DateTimePicker
        value={dateValue}
        mode="date"
        display="default"
        onChange={ChangeDateHandler}
        maximumDate={new Date()}
        />
    )}
         <View style={ { width: '100%',
        borderBottomWidth: 0.5,
        borderColor: themes.theme.color,
        paddingBottom: 8 }}>
         <View

        style={ { flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}>
         <MaterialIcons size={20} color={themes.theme.color} name="timer" />
          <Text_Content>Selected Time</Text_Content>
          <Text style={ { color: themes.theme.color }}>{curretnTransactionList?.time}</Text>
          </View>
         </View>
      <View style={ { flexDirection: 'row',
        gap: 10 }}>
      <AnimatedButton
        disabled={dueLoading}
        onPress={EaditableConfirmHandler}
        color={isEditable ? '#fff' : '#444'}
        title={isEditable ? 'Update now' : 'Edit'}
        bgColor={isEditable ? 'rgba(0,170,0,1)': 'yellow'}
        style={{width: 150}}
        />
      <AnimatedButton
        disabled={dueLoading || isEditable}
        onPress={DueConfirmHandler}
        bgColor="rgba(180,0,0,1)"
        color="#fff"
        style={{width:150,}}
        title="Delete"
        /> 
      </View>
     </View>
  )
}

export default TransactionDeleteAndEdit