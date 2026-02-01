import {
  useContext,
  useState,
  useRef,
  useEffect
} from 'react'
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import {
  ProductContext
} from '../Context/Contextcontent'
import { LinearGradient } from 'expo-linear-gradient';
import Currency from  '../Currancy'
import { useNavigation } from '@react-navigation/native';
import Text_Content from './Text_Content'
import Feather from 'react-native-vector-icons/Feather'
import DateFormate from '../dateFormate'
const LadgerCustomerList = ({
  item
})=> {
  const router = useNavigation()
  const {
    themes
  } = useContext(ProductContext)
   
 let listLableMessage = ''
  
 switch (item?.latest_transaction_payment_type) {
   case 'add':
     listLableMessage = <LabelItem icon="user" themes={themes} text={`New user added on ${item?.latest_transaction_date && DateFormate(item?.latest_transaction_date)}`}  />
     break;
   case 'credit':
     listLableMessage = <LabelItem  themes={themes} text={`₹${item?.latest_transaction_amount} Credited on ${item?.latest_transaction_date && DateFormate(item?.latest_transaction_date)}`}  />
     break;
   case 'payment':
     listLableMessage = <LabelItem  themes={themes} text={`₹${item?.latest_transaction_amount} Payment added on ${item?.latest_transaction_date && DateFormate(item?.latest_transaction_date)}`}  />
     break;
   case 'edit':
     listLableMessage = <LabelItem  themes={themes} text={`₹${Math.abs(item?.latest_transaction_amount)} Edited on ${item?.latest_transaction_date && DateFormate(item?.latest_transaction_date)}`}  />
     break;
   case 'delete':
     listLableMessage = <LabelItem  themes={themes} text={`₹${Math.abs(item?.latest_transaction_amount)} Deleted on ${item?.latest_transaction_date && DateFormate(item?.latest_transaction_date)}`}  />
     break;
   
   default:
  listLableMessage = null
 }
 

  return (
    <TouchableOpacity
     onPress={()=> router.navigate("CustomerDetails",{customer_id:item?.id})}
    style={{
      flexDirection:'row', 
      borderBottomWidth:0.5,
      borderColor:themes.theme.color,
      paddingBottom:8,
      width:'100%',
      overflow:'hidden', 
      justifyContent:'space-between'
    }}>
    <View style={{flexDirection:'row',alignItems:'center',maxWidth:'75%',gap:5}}>
      <LinearGradient 
      colors={ ['#e240ed','#eb613a','#e240ed' ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
       width:50,
       height:50,
       justifyContent:'center',
       alignItems:'center',
       borderRadius:50,
      }}>
        <Text 
        style={{
         color:"#fff",
         fontSize:20,
         fontWeight:'900',
         }}>
          {item?.name?.charAt(0)}
        </Text>
      </LinearGradient>
      
      <View style={{justifyContent:'space-between',maxWidth:'78%',height:45,}}> 
       <Text 
       numberOfLines={1} ellipsizeMode="tail"
        style={{
         color: themes.theme.color, 
         fontWeight:'600',
         }}>
          {item?.name}
        </Text>
        {listLableMessage && listLableMessage}
      </View>
      
      
      </View>
      
      
      <View style={{
        justifyContent:'center',  
        maxWidth:'30%'
      }}>
       <Text 
        style={{
         color: item?.grand_total_due >= 0 ? 'rgba(0,200,0,1)' : themes.mode === "dark" ?  'rgba(200,0,0,1)' :  'rgba(200,0,0,0.6)', 
         fontWeight:'900',
         }}>
          {Currency(Math.abs(item?.grand_total_due))}
        </Text>
        <Text  style={{
         color: '#999', 
         fontWeight:'900', 
         alignSelf:'flex-end'
         }}>Due</Text>
      </View>
     </TouchableOpacity>
  )
}

 const LabelItem = ({icon,text,date,themes})=>{
   return (
      <View style={{flexDirection:'row',alignItems:'center',gap:4}}>
     {
       icon &&
        <Feather color={themes.theme.color} name={icon} />
     }
       <Text_Content style={{fontSize:12}}>{text}</Text_Content>
      </View>
     )
 }
export default LadgerCustomerList