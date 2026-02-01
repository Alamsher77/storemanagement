import {View,Text,TouchableOpacity} from 'react-native'
import { useRoute,useNavigation } from '@react-navigation/native';
import {useLayoutEffect,useEffect,useContext,useState} from "react"
import {
  ProductContext
} from '../../Context/Contextcontent'  
import Transaction_given from './Transaction_given'
import Transaction_recieve from './Transaction_recieve'
import TransactionDeleteAndEdit from './Transaction_delete_and_edit'
import UserProfile from './UserProfile'
import ScrollContainer from '../../component/ScrollContainer';
import { useSelector,useDispatch} from "react-redux";
const Customer_manage_payment = ()=>{
   const {
    themes
  } = useContext(ProductContext)
  const {customers} = useSelector((state)=>state.customers)
  const {params} = useRoute() 
  const [currentCustomer,setCurrentCustomer] = useState(null)
  const navigation = useNavigation() 
  
  useEffect(()=>{
  const getDetails = customers.find((item)=>item?.id == params?.customer_id) 
  setCurrentCustomer(getDetails)
},[])
useLayoutEffect(()=>{
  navigation.setOptions({
    headerTitle:()=> <View >
    <Text  style={{color:themes.theme.color,fontWeight:'800'}}>{params?.transaction_type === "UserProfile" ? "Profile" : currentCustomer?.name}</Text> 
    </View>
  })
},[navigation,currentCustomer])

let Customer_manage_Component = ""
  switch (params?.transaction_type) {
         case 'given':
         Customer_manage_Component =   <Transaction_given customer_id={params?.customer_id} themes={themes} />
           break;
         case 'editAndDelete':
        Customer_manage_Component =  <TransactionDeleteAndEdit curretnTransactionList={params?.curretnTransactionList} customer_id={params?.customer_id} themes={themes} />
           break;
         case 'UserProfile':
        Customer_manage_Component =  <UserProfile  customer_id={params?.customer_id} themes={themes} />
           break;
         default:
        Customer_manage_Component =    <Transaction_recieve customer_id={params?.customer_id} themes={themes} />
       }
  return (
     <ScrollContainer style={{alignItems:'center'}}>{Customer_manage_Component}</ScrollContainer>
    )
}

export default Customer_manage_payment