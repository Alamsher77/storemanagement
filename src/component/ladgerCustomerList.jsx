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
const LadgerCustomerList = ({
  item
})=> {
  const router = useNavigation()
  const {
    themes
  } = useContext(ProductContext)
   
  return (
    <TouchableOpacity
     onPress={()=> router.navigate("CustomerDetails",{customer_id:item?.id})}
    style={{
      flexDirection:'row',
      justifyContent:'space-between',
      borderBottomWidth:0.5,
      borderColor:themes.theme.color,
      paddingBottom:8,
    }}>
    <View style={{flexDirection:'row',gap:10,alignItems:'center'}}>
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
      
      <View>
       <Text 
        style={{
         color: themes.theme.color, 
         fontWeight:'600',
         }}>
          {item?.name}
        </Text>
      </View>
      
      </View>
      
      
      <View style={{
        justifyContent:'center', 
        alignItems:'flex-end'
      }}>
       <Text 
        style={{
         color: item?.grand_total_due >= 0 ? 'rgba(0,200,0,1)' : 'rgba(200,0,0,0.6)', 
         fontWeight:'900',
         }}>
          {Currency(Math.abs(item?.grand_total_due))}
        </Text>
        <Text  style={{
         color: '#999', 
         fontWeight:'900', 
         }}>Due</Text>
      </View>
     </TouchableOpacity>
  )
}

export default LadgerCustomerList