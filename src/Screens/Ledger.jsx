import {View,Text,TextInput,Pressable,ActivityIndicator} from 'react-native'
import ScrollContainer from '../component/ScrollContainer'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../Colors'
import {useContext,useState,useRef,useEffect,useCallback,useMemo} from 'react'
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
import {useFocusEffect,useNavigation} from '@react-navigation/native';
import BalanceCard from "./Ledger/balanceCard"

const PressableAnimation = Animated.createAnimatedComponent(Pressable)
 const LinearGradientAnimated = Animated.createAnimatedComponent(LinearGradient)
const Ledger = ()=>{
  const navigation = useNavigation()
const dispatch = useDispatch()
const {customers} = useSelector((state)=> state.customers) 

const {themes} = useContext(ProductContext)


const [filterActive,setFilterActive] = useState(null) 
const [openDragableModel,setOpenDragableModel] = useState(false) 
const [openDragableModelFilter,setOpenDragableModelFilter] = useState(false) 


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
    INSERT INTO users (name,phone, grand_total_due, latest_transaction_payment_type, latest_transaction_date,created_date)
    VALUES (?, ?, ?, ?, ?, ?);
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
    usersData?.latest_transaction_date,
    usersData?.created_date
  ]);
 
    Toast.show({type:'success',text1:'User Created SuccessFull'})
    dispatch(createCustomers({...usersData,id:userCreated.lastInsertRowId}))
    setOpenDragableModel(false)
  } catch (e) {
    setUserLoading(false)
    console.log(e)
  }
}

// laod user by filtring and render ones
const sortedCustomers = useMemo(() => {
  return [...customers].sort((a, b) => {
    const dateA = new Date(a.latest_transaction_date).getTime();
    const dateB = new Date(b.latest_transaction_date).getTime();

    if (dateB !== dateA) {
      return dateB - dateA; // latest date first
    }

    return Number(b.id) - Number(a.id);
  });
}, [customers]);
// filter by user changest filter query

const filteredCustomers = useMemo(() => {
  const data = [...sortedCustomers];

  switch (filterActive) {
    case 'name':
      return data.sort((a, b) =>
        a.name.toLowerCase().localeCompare(
          b.name.toLowerCase()
        )
      );

    case 'last-payment':
      return data.sort((a, b) =>
        (Math.abs(b.grand_total_due) || 0) -
        (Math.abs(a.grand_total_due) || 0)
      );

    case 'latest-activity':
      return data.sort((a, b) =>
        new Date(b.latest_transaction_date) -
        new Date(a.latest_transaction_date)
      );
    default:
      return data;
  }
}, [customers, filterActive]);

//calculate total customer due
const totalBalanceDue = useMemo(() => {
  return Math.abs(customers.reduce(
    (sum, customer) => {
      
    const due = Number(customer?.grand_total_due || 0)
    return due < 0 ? sum + due : sum
    },0));
}, [customers]);

const scrollRef = useRef(null);
const [showButtonScroll, setShowButtonScroll] = useState(false);

const handleScroll = (event) => {
  const scrollY = event.nativeEvent.contentOffset.y;

  setShowButtonScroll(scrollY > 300);
};

const scrollToTop = () => {
  scrollRef.current?.scrollTo({
    y: 0,
    animated: true,
  });
};

const filterOptions = [
  { value: null, label: 'Latest' },
  { value: 'name', label: 'Name' },
  { value: 'last-payment', label: 'Last Payment' },
  { value: 'latest-activity', label: 'Latest Activity' },
];

return (
  <>
   <View 
    style={{
      flexDirection:'row',
      gap:12,
      borderBottomWidth:0.5,
      borderColor:'#fff',
      paddingTop:40,
      backgroundColor:themes.theme.backgroundTheme,
      paddingBottom:6,
      justifyContent:"flex-end",
      paddingRight:18
    }}
   >
    <AnimatedButton onPress={()=>navigation.navigate("SearchCustomer")} isIcon bgColor={themes.mainColor}>
     <Ionicons
            name="search"
            size={24}
            color={"#fff"}
          />
    </AnimatedButton>
    <AnimatedButton onPress={()=>setOpenDragableModelFilter(true)} isIcon bgColor={themes.mainColor}>
     <Ionicons
            name="filter"
            size={24}
            color={"#fff"}
          />
    </AnimatedButton>
   </View>
   
  <ScrollContainer ref={scrollRef} onScroll={handleScroll} style={{gap:12,width:'100%'}}>
    <BalanceCard accounts={customers.length} balance={totalBalanceDue} themes={themes} />
   {
    filteredCustomers.length === 0 ?
     
      <Text_Content>No customer records</Text_Content>
    :
     filteredCustomers?.map((item,index)=>{
       return(
         <LadgerCustomerList  item={item} key={index} />
       )
     })
   }
  </ScrollContainer>
  {
  showButtonScroll &&
  
  <Pressable 
  onPress={scrollToTop}
   style={{width:50,height:50,backgroundColor:'rgba(100,180,0,1)',position:'absolute',bottom:20,left:20,borderRadius:12,borderWidth:1,borderColor:themes.theme.color,elevation:6,shadowColor:themes.theme.color,justifyContent:'center',alignItems:'center'}}
  >
   <MaterialIcons size={27} color="#fff" name="swipe-down" />
  </Pressable> }
  <Pressable 
  onPress={()=>setOpenDragableModel(true)}
   style={{width:50,height:50,backgroundColor:'rgba(100,180,0,1)',position:'absolute',bottom:20,right:20,borderRadius:12,borderWidth:1,borderColor:themes.theme.color,elevation:6,shadowColor:themes.theme.color,justifyContent:'center',alignItems:'center'}}
  >
   <MaterialIcons size={27} color="#fff" name="person-add" />
  </Pressable>
  <Pressable 
  onPress={()=>navigation.navigate("Customer_ladger_transaction")}
   style={{width:50,height:50,backgroundColor:Colors.mainColor,position:'absolute',bottom:75,right:20,borderRadius:12,borderWidth:1,borderColor:themes.theme.color,elevation:6,shadowColor:themes.theme.color,justifyContent:'center',alignItems:'center'}}
  >
   <MaterialIcons size={27} color="#fff" name="receipt" />
  </Pressable>
  
  
  
   <DragableModel 
   minHeight={300} 
   openDragableModel={openDragableModelFilter}
   setOpenDragableModel={setOpenDragableModelFilter} 
  > 
      <Text_Content style={{fontSize:16,fontWeight:'700',marginLeft:40}}>SORT</Text_Content>
      <View style={{flex:1,flexWrap:"wrap",flexDirection:"row",gap:12,marginTop:20,marginLeft:40,}}>
      {
        filterOptions?.map((optionItem,index) =>(
     <AnimatedButton
     onPress={()=>setFilterActive(optionItem.value)}
      style={{minWidth:"45%",borderWidth:1.5,borderColor:themes.mainColor,paddingHorizontal:8}}
      key={optionItem.value}
      color={themes.theme.color}
      bgColor={filterActive === optionItem.value ? themes.mainColor :"transparent"}
      title={optionItem?.label}
      />  
        ))
      }
    </View>
    
    <View style={{
      flexDirection:"row",
      justifyContent:"flex-end",
      marginTop:40,
      paddingHorizontal:25,
      gap:20
    }}>
     <AnimatedButton
      onPress={()=>{
      setFilterActive(null)
      setOpenDragableModelFilter(false)
      }}
      color="#fff"
      bgColor={themes.mainColor}
      title="Clear"
      />
     <AnimatedButton
      onPress={()=>setOpenDragableModelFilter(false)}
      color="#fff"
      bgColor="rgba(0,160,0,1)"
      title="OK"
      />
    </View>
    
    </DragableModel>
    
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