

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

const TransactionDeleteAndEdit = ({themes,customer_id,curretnTransactionList})=>{
  
 const [dueLoading,setDueLoading] = useState(false)
 const DueConfirmHandler = async ()=>{
 
 }
 
  return (
     <View style={{alignItems:'center',gap:25,height:'100%',justifyContent:'center',width:280}}>
         <View style={{borderBottomWidth:0.5,borderColor:themes.theme.color,width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
         <Text_Content style={{fontSize:30}}>₹</Text_Content>
          <TextInput
          editable={false} 
          numberOfLines={4} 
          maxLength={7}
          value={curretnTransactionList?.total_due}
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
         editable={false}
         value={curretnTransactionList?.description} 
         multiline
         numberOfLines={4}
         style={{color:themes.theme.color,paddingHorizontal:6,paddingVertical:4}} 
         placeholderTextColor={themes.theme.color} 
         placeholder="add" />
         </View>
         <View style={{width:'100%',borderBottomWidth:0.5,borderColor:themes.theme.color,paddingBottom:8}}>
         <View
        
         style={{flexDirection:'row',alignItems:'center',gap:8,}}>
         <MaterialIcons size={20} color={themes.theme.color} name="date-range" />
          <Text_Content>Selected Date</Text_Content>
          <Text style={{color:themes.theme.color}}>{DateFormate(curretnTransactionList?.date)}</Text>
          </View> 
         </View> 
         <View style={{width:'100%',borderBottomWidth:0.5,borderColor:themes.theme.color,paddingBottom:8}}>
         <View
        
         style={{flexDirection:'row',alignItems:'center',gap:8,}}>
         <MaterialIcons size={20} color={themes.theme.color} name="timer" />
          <Text_Content>Selected Time</Text_Content>
          <Text style={{color:themes.theme.color}}>{curretnTransactionList?.time}</Text>
          </View> 
         </View> 
      
      <TouchableOpacity
      disabled={dueLoading}
      onPress={DueConfirmHandler}
      style={{backgroundColor:'rgba(180,0,0,1)',width:250,justifyContent:'center',alignItems:'center',paddingVertical:6,borderRadius:6}}
      >
       <Text style={{color:'#fff',fontWeight:'700',fontSize:18}}> {dueLoading ? "Loading..." : "Delete"}</Text>
      </TouchableOpacity>
     </View>
    )
}

export default TransactionDeleteAndEdit