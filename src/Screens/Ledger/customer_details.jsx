import {View,Text,FlatList,TouchableOpacity} from 'react-native'
import { useRoute,useNavigation,useFocusEffect } from '@react-navigation/native';
import {customer_data} from '../../Utils/customer_data'
import Currency from  '../../Currancy'
import DateFormate from  '../../dateFormate'
import Entypo from 'react-native-vector-icons/Entypo'
import {
  ProductContext
} from '../../Context/Contextcontent' 
import {dbConnection} from '../../Storage/Database' 
 import { useSelector } from "react-redux";
 import Text_Content from '../../component/Text_Content'
import {useLayoutEffect,useCallback,useRef,useEffect,useContext,useState} from "react"
import Animated,{ZoomOut,FadeInUp,FadeOutDown,FadeInLeft,FadeInRight,useSharedValue,useAnimatedStyle,Easing,withTiming} from 'react-native-reanimated';
const CustomerDetails = ()=>{
   const {
    themes
  } = useContext(ProductContext)
const {customers} = useSelector((state)=>state.customers)
const {params:{customer_id}} = useRoute()
const [currentCustomer,setCurrentCustomer] = useState(null)
const [allDueTransaction,setAllDueTransaction] = useState([])


useEffect(()=>{
  const getDetails = customers.find((item)=>item?.id == customer_id) 
  setCurrentCustomer(getDetails)
},[])
const navigation = useNavigation() 
useLayoutEffect(()=>{
  navigation.setOptions({
    headerTitle:()=> <TouchableOpacity >
    <Text  style={{color:themes.theme.color,fontWeight:'800'}}>{currentCustomer?.name} {'\n'} <Text style={{lineHeight:12,fontWeight:'400',color:'rgba(0,200,0,0.6)'}}>view profile</Text></Text> 
    </TouchableOpacity>
  })
},[navigation,currentCustomer])

const listRef = useRef(null);

useEffect(() => {
  if (listRef.current) {
    setTimeout(() => {
      listRef.current.scrollToEnd({ 
        animated: false,
      });
    }, 100);
  }
}, [currentCustomer]);
useFocusEffect(
useCallback(() => {
 const fetchDueTrasaction = async ()=>{
   try {
      const db = await dbConnection()
   const userdata = await db.getAllAsync("SELECT * FROM users_transaction WHERE user_id = ? ORDER BY date",[customer_id]);
   setAllDueTransaction(userdata)
   } catch (e) {
   console.log(e)
     
   }
 }
 fetchDueTrasaction()
}, [])
)
const [currentTransactionList,setCurrentTransationList] = useState(null) 

  return(
     <View style={{position:'relative',flex:1,backgroundColor:themes.theme.backgroundTheme,gap:10}}>
      <FlatList
      ref={listRef}
       data={allDueTransaction}
       keyExtractor={(_,index)=> index}
       renderItem={({item,index})=>{
      const currentDate = new Date(item.date).toDateString();

  const prevDate =
    index > 0
      ? new Date(allDueTransaction[index - 1].date).toDateString()
      : null;
  const showDate = currentDate !== prevDate;
         return(
         <>
         {
           showDate &&
           <View style={{alignSelf:'center',paddingVertical:6,backgroundColor:'#999',paddingHorizontal:12,borderRadius:50,marginBottom:6}}>
          <Text style={{fontWeight:'600',color:'#ffe'}}>{DateFormate(item?.date)}</Text>
         </View>
         }
          <TouchableOpacity 
          onPress={()=> item?.sale_id.trim() ? setCurrentTransationList(item) : navigation.navigate('Customer_manage_payment',{customer_id,transaction_type:'editAndDelete',curretnTransactionList:item})}
          style={{borderWidth:1,alignSelf:item?.transaction_type == 'given' ? 'flex-end' : 'flex-start',paddingHorizontal:4,paddingVertical:6,
            borderRadius:4,borderColor:item?.transaction_type == 'given' ? 'rgba(200,0,0,1)' : 'rgba(0,200,0,1)',
            backgroundColor:item?.transaction_type == 'given' ? 'rgba(200,0,0,0.1)' : 'rgba(0,200,0,0.1)',
            width:180
          }}>
            <View style={{flexDirection:'row',alignItems:'center',gap:6}}>
             <Entypo color={item?.transaction_type == 'given' ? 'rgba(200,0,0,1)' : 'rgba(0,200,0,1)'} size={20} name={item?.transaction_type == 'given' ? 'arrow-up' : 'arrow-down'} />
             <Text style={{fontWeight:'700',
               color:item?.transaction_type == 'given' ? 'rgba(200,0,0,1)' : 'rgba(0,200,0,1)',fontSize:18
             }}>{Currency(item?.total_due)}</Text>
             <Text style={{color:'#888',fontWeight:'500',fontSize:12}}>{item?.time}</Text>
            </View>
          {
            item?.description.trim().length > 0 &&
              <Text style={{color:'#666'}}>{item?.description}</Text>
          }
          </TouchableOpacity> 
           {
            currentTransactionList && currentTransactionList?.id === item?.id &&
            <Animated.View 
            entering={FadeInRight}
            existing={FadeOutDown}
            style={{alignSelf:item?.transaction_type == 'given' ? 'flex-end' : 'flex-start',width:180,justifyContent:'space-evenly',flexDirection:'row',marginTop:6}}>
             <TouchableOpacity 
             style={{backgroundColor:'rgba(180,0,0,1)',paddingHorizontal:6,alignItems:'center',justifyContent:'center',borderRadius:4}}
             onPress={()=>navigation.navigate('Customer_manage_payment',{customer_id,transaction_type:'editAndDelete',curretnTransactionList:item})}>
              <Text_Content style={{fontSize:12,fontWeight:'500',color:"#fff"}}>List details</Text_Content>
             </TouchableOpacity>
             <TouchableOpacity 
              style={{backgroundColor:themes.mainColor,paddingHorizontal:6,alignItems:'center',justifyContent:'center',borderRadius:4}}
             onPress={()=> navigation.navigate('Bill',{billId:item?.sale_id})}
             >
              <Text_Content style={{fontSize:12,fontWeight:'500',color:"#fff"}}>Sale details</Text_Content>
             </TouchableOpacity>
            </Animated.View>
            
          }
          </>
         )
       }}
       showsVerticalScrollIndicator={false}
       contentContainerStyle={{gap:8,paddingHorizontal:10,paddingTop:20}} 
      />
      <View style={{backgroundColor: themes.mode == 'light' ? 'rgba(0,80,0,0.1)' : '#d6b3a1',padding:10,paddingBottom:20,width:'100%',height:120,justifyContent:'space-between'}}>
       
       <View style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:12}}>
        <Text style={{fontWeight:'700',color:currentCustomer?.grand_total_due >= 0 ? 'rgba(0,150,0,0.8)': 'rgba(180,0,0,0.8)',fontSize:16}}>Balance {currentCustomer?.grand_total_due >= 0 ? 'Advanced' :'Due'}</Text>
        <Text  style={{
         color: currentCustomer?.grand_total_due >= 0 ? themes.mode == 'light' ?  'rgba(0,200,0,1)' :  'rgba(0,170,0,1)' : 'rgba(200,0,0,1)', 
         fontWeight:'700',
         fontSize:18
         }}>{Currency(Math.abs(currentCustomer?.grand_total_due))}</Text>
       </View>
       
       <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
        <TouchableOpacity 
        onPress={()=>navigation.navigate('Customer_manage_payment',{customer_id,transaction_type:'recieve'})}
        style={{borderWidth:1,borderColor:'rgba(0,160,0,1)',backgroundColor:'rgba(0,200,0,0.1)',paddingVertical:6,borderRadius:6,flexDirection:'row',gap:4,justifyContent:'center',alignItems:'center',width:150}}>
          <Entypo color={'rgba(0,180,0,1)'} size={22} name={'arrow-down'} />
         <Text style={{color:'rgba(0,180,0,1)',fontSize:16,fontWeight:'800'}}>Recieved</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
         onPress={()=>navigation.navigate('Customer_manage_payment',{customer_id,transaction_type:'given'})}
        style={{borderWidth:1,borderColor:'rgba(180,0,0,1)',backgroundColor:'rgba(180,0,0,0.1)',paddingVertical:6,borderRadius:6,flexDirection:'row',gap:4,justifyContent:'center',alignItems:'center',width:150}}>
          <Entypo color={'rgba(180,0,0,1)'} size={22} name={'arrow-up'} />
         <Text style={{color:'rgba(150,0,0,1)',fontSize:16,fontWeight:'800'}}>Given</Text>
        </TouchableOpacity>
       </View>
      </View>
     </View>
    )
}

export default CustomerDetails