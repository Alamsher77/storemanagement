import {View,Text,TextInput,Pressable,ActivityIndicator} from 'react-native'
import ScrollContainer from '../component/ScrollContainer'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Feather from 'react-native-vector-icons/Feather'
import Colors from '../Colors'
import {useContext,useState,useRef,useEffect,useCallback} from 'react'
import {ProductContext} from '../Context/Contextcontent'
import { LinearGradient } from 'expo-linear-gradient';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated,{ZoomOut,FadeInUp,FadeOutDown,FadeInLeft,FadeInRight,useSharedValue,useAnimatedStyle,Easing,withTiming} from 'react-native-reanimated';
import LadgerCustomerList from '../component/ladgerCustomerList'
import {listOfFilterCustomer,customer_data} from '../Utils/customer_data'
import Text_Content from '../component/Text_Content'
 import DragableModel from '../component/DragableModel';
 import {dbConnection} from '../Storage/Database'
 import Toast from 'react-native-toast-message'
 import { useSelector,useDispatch} from "react-redux";
 import {createCustomers,setCustomers } from '../redux/ledgerSlice'
 import DateAndTime from '../dateAndTime'
 import migrateDB from '../Utils/migrateDb'
 import AnimatedButton from '../component/Button'
import {useFocusEffect} from '@react-navigation/native';
const PressableAnimation = Animated.createAnimatedComponent(Pressable)
 const LinearGradientAnimated = Animated.createAnimatedComponent(LinearGradient)
const Ledger = ()=>{
const dispatch = useDispatch()
const {customers} = useSelector((state)=> state.customers) 
const [searchCustomer,setSeachCustomer] = useState([])
const {themes} = useContext(ProductContext)
const [searchQuery,setSearchQuery] = useState('')
const changeHeight = useSharedValue(0)
const changeZIndex = useSharedValue(-1)
const changePosition = useSharedValue(-120)
const [overlayIsActive,setOverlayIsActive] = useState(true) 
const ShowAndAndOverlayOfFilterCustomer = ()=>{
 
  try {
  if (overlayIsActive) {
    changePosition.value = withTiming(100,{
    duration:1000,
    easing: Easing.bounce
  })
  changeZIndex.value = 10
  changeHeight.value = withTiming(174,{
    duration:2000,
    easing: Easing.bounce,
  })
  
  }else{
     changeHeight.value = 0
  changePosition.value = -120
  changeZIndex.value = -1
  } 
  setOverlayIsActive(!overlayIsActive)
  } catch (e) {
    console.log(e)
  }
 
}
const overlayAnimationStyle = useAnimatedStyle(()=>({
  height:changeHeight.value,
  zIndex:changeZIndex.value,
  top:changePosition.value
}))

const [filterActive,setFilterActive] = useState('') 
const [openDragableModel,setOpenDragableModel] = useState(false) 


// create user functionality 

const [usersData,setUserData] = useState({ 
    name:'',
    phone:'',
    grand_total_due:0, 
    latest_transaction_payment_type:'add',
    latest_transaction_date:DateAndTime()?.formatDate,
    created_date:DateAndTime()?.formatDate, 
  })
  const [userLoading,setUserLoading] = useState(false)
const createUserHandler = async()=>{ 
  try {
    setUserLoading(true)
    const db = await dbConnection()  
    await migrateDB(db)
  const query = `
    INSERT INTO users (name,phone, grand_total_due, latest_transaction_payment_type, latest_transaction_date)
    VALUES (?, ?, ?, ?, ?);
  `;
  const createdUser = await db.getFirstAsync('SELECT * FROM users WHERE name = ?;', [usersData.name]);
  setUserLoading(false)
if (createdUser) {
  Toast.show({type:'error',text1:'User Alrady Created'})
  return false
}
const userCreated =  await db.runAsync(query, [ 
    usersData.name,
    usersData.phone,
    usersData.grand_total_due,
    usersData.latest_transaction_payment_type,
    usersData?.latest_transaction_date
  ]);
 
    Toast.show({type:'success',text1:'User Created SuccessFull'})
    dispatch(createCustomers({...usersData,id:userCreated.lastInsertRowId}))
    setOpenDragableModel(false)
  } catch (e) {
    setUserLoading(false)
    console.log(e)
  }
}


const searchHandler = (text)=>{
  setSearchQuery(text)
try {
 const serch = customers.filter((c)=> c.name.toLowerCase().includes(text.toLowerCase()) || String(c?.phone).includes(text))
  setSeachCustomer(serch)
} catch (e) {
  console.log(e);
}

}

// laod user by filtring and render ones
useFocusEffect(
    useCallback(() => {
      loadUsers() 
    },[customers])
  );
const loadUsers = async ()=>{
  try {
    const db = await dbConnection()
   const userdata = await db.getAllAsync("SELECT * FROM users ORDER BY latest_transaction_date DESC , id DESC");
   setSeachCustomer(userdata)
  } catch (e) {
      console.log('users fetch error ',e)
  }
}

// filter by user changest filter query

const filterCustomerHandler = (value)=>{
  try{
 
switch (value) {

  case 'name': {
    const sorted = [...searchCustomer].sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
    setSeachCustomer(sorted);
    break;
  }

  // 💰 Last payment high to low
  case 'last-payment': {
    const sorted = [...searchCustomer].sort((a, b) =>
      (Math.abs(b.grand_total_due) || 0) - (Math.abs(a.grand_total_due) || 0)
    );
    setSeachCustomer(sorted);
    break;
  }

  // 🕒 Latest activity (recent first)
  case 'latest-activity': {
    const sorted = [...searchCustomer].sort((a, b) =>
      new Date(b.latest_transaction_date) - new Date(a.latest_transaction_date)
    );
    setSeachCustomer(sorted);
    break;
  }

  // 📅 Due date nearest first
  case 'due-date': {
    const sorted = [...searchCustomer].sort((a, b) =>
      new Date(a.due_date) - new Date(b.due_date)
    );
    setSeachCustomer(sorted);
    break;
  }

  default:
    setSeachCustomer(customers);
}

  setFilterActive(value) 

}catch(e){
  console.log(e)
}
}
return (
  <>
   <View 
    style={{
      flexDirection:'row',
      justifyContent:'center',
      gap:12,
      borderBottomWidth:0.5,
      borderColor:'#fff',
      paddingTop:40,
      backgroundColor:themes.theme.backgroundTheme,
      paddingBottom:10,
      position:'relative'
    }}
   >
  {
    // overlay of filter customer list
  }
  <LinearGradientAnimated
  colors={ ['#e240ed','#eb613a','#e240ed' ]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={[{
    position:'absolute',
    width:'50%',
    paddingVertical:6,
    alignItems:'center',
    gap:4, 
    overflow:'hidden',
    borderRadius:8,
  },overlayAnimationStyle]} 
  >
  <Text style={{color:'#fff',fontWeight:'900',fontSize:18}}>Filter users</Text>
  {
  listOfFilterCustomer?.map((value,index)=>{ 
  
  return(
   <PressableAnimation
   onPress={()=>filterCustomerHandler(value.value)}
   style={[{width:'85%',paddingHorizontal:8,paddingVertical:4,borderWidth:1,borderColor:'#fff',backgroundColor:filterActive == value.value ? Colors.mainColor : 'transparent',transform:[{scale:filterActive == value.value ? 1.05 : 1}]}]}
   key={index}>
   
    <Text style={{color:'#fff',fontWeight:'700'}}>{value.lable}</Text> 
   </PressableAnimation>
  ) 
    
  })
  }
  </LinearGradientAnimated>
   <View style={{
     width:'80%',
     backgroundColor:Colors.mainColor,
     paddingHorizontal:10,
     borderRadius:4,
     position:'relative'
   }}>
  {
    searchQuery?.trim()?.length > 0 &&
     <PressableAnimation   entering={FadeInRight} exiting={FadeOutDown}  onPress={()=>searchHandler("")} style={{width:40,height:40 ,position:'absolute',right:0,justifyContent:'center',alignItems:'center',zIndex:10}}>
    <MaterialIcons color="#fff" size={20} name='clear' />
   </PressableAnimation>
  }
    <TextInput
    value={searchQuery}
    onChangeText={(text)=> searchHandler(text)}
    style={
     {
       color:'#fff',
       paddingRight:searchQuery?.trim().length > 0 ? 40 : 0,
     } 
    }
    placeholderTextColor="#fff" 
    placeholder="Search users" />
    </View>
    <PressableAnimation
    entering={FadeInRight}
    
    onPress={ShowAndAndOverlayOfFilterCustomer}
     style={{ 
       justifyContent:'center',
       alignItems:'center', 
     }}
    >
    <LinearGradient
           colors={ ['#e240ed','#eb613a','#e240ed' ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{paddingHorizontal:10,paddingVertical:6,borderRadius:4}}
            >
    {
    
      overlayIsActive  ?
      <MaterialIcons color="#fff" size={25} name='filter-list' />
      :
      <MaterialIcons color="#fff" size={25} name='clear' />
    }
    </LinearGradient>
    </PressableAnimation>
   </View>
  <ScrollContainer style={{gap:6,width:'100%'}}>
   {
    searchCustomer.length === 0 ?
     
      <Text_Content>No customer records</Text_Content>
    :
     searchCustomer?.map((item,index)=>{
       return(
         <LadgerCustomerList  item={item} key={index} />
       )
     })
   }
  </ScrollContainer>
  
  <Pressable 
  onPress={()=>setOpenDragableModel(true)}
   style={{width:50,height:50,backgroundColor:'rgba(100,180,0,1)',position:'absolute',bottom:20,right:20,borderRadius:12,borderWidth:1,borderColor:themes.theme.color,elevation:6,shadowColor:themes.theme.color,justifyContent:'center',alignItems:'center'}}
  >
   <MaterialIcons size={27} color="#fff" name="person-add" />
  </Pressable>
  
  
  {/*model open to create  customers */}
   <DragableModel minHeight={300} openDragableModel={openDragableModel} setOpenDragableModel={setOpenDragableModel} style={{alignItems:'center',gap:12}}> 
      <Text_Content style={{fontSize:16,fontWeight:'700',}}>CREATE NEW USERS</Text_Content>
       <View style={{width:'70%',borderBottomWidth:0.5,borderColor:themes.theme.color}}>
       <Text_Content style={{fontWeight:'500',fontSize:13}}>Enter user name </Text_Content>
       <View style={{flexDirection:'row',alignItems:'center'}}>
        <Feather size={20} color={themes.theme.color} name="user" />
         <TextInput 
         value={usersData.name}
         placeholder="User name" 
         onChangeText={(text)=>setUserData((preve)=>({...preve,name:text}))}
         placeholderTextColor={themes.theme.color} style={{color:themes.theme.color,width:'80%'}} />
         </View>
      </View>
      <View style={{width:'70%',borderBottomWidth:0.5,borderColor:themes.theme.color}}>
       <Text_Content style={{fontWeight:'500',fontSize:13}}>Enter phone number (Optional) </Text_Content>
       <View style={{flexDirection:'row',alignItems:'center'}}>
        <MaterialIcons size={20} color={themes.theme.color} name="phone-iphone" />
         <TextInput 
         value={usersData.phone}
         placeholder="Phone Number" 
          onChangeText={(text)=>setUserData((preve)=>({...preve,phone:text}))}
         placeholderTextColor={themes.theme.color} style={{color:themes.theme.color,width:'80%'}} />
         </View>
      </View>
      
        <AnimatedButton
      disabled={!usersData?.name.trim().length > 0 || userLoading}
      onPress={createUserHandler}
      style={{width:250,marginTop:20}}
      bgColor="rgba(0,160,0,1)"
      color="#fff"
      title={userLoading ? <ActivityIndicator color="#fff" size="small" /> : "Confirm"}
      />  
      </DragableModel>
  </>
  )
}

export default Ledger