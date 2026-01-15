import {View,Text,TouchableOpacity} from 'react-native'
import { useRoute,useNavigation } from '@react-navigation/native';
import {useLayoutEffect,useEffect,useContext,useState} from "react"
import {
  ProductContext
} from '../../Context/Contextcontent'  
import Transaction_given from './Transaction_given'
import Transaction_recieve from './Transaction_recieve'
import TransactionDeleteAndEdit from './Transaction_delete_and_edit'
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
    headerTitle:()=> <TouchableOpacity >
    <Text  style={{color:themes.theme.color,fontWeight:'800'}}>{currentCustomer?.name} {'\n'} <Text style={{lineHeight:12,fontWeight:'400',color:'rgba(0,200,0,0.6)'}}>view profile</Text></Text> 
    </TouchableOpacity>
  })
},[navigation,currentCustomer])

  return (
     <ScrollContainer style={{alignItems:'center'}}>
       {
         params?.transaction_type == 'given' ?
          <Transaction_given customer_id={params?.customer_id} themes={themes} />
          :
        params?.transaction_type === 'editAndDelete' ?
        
        <TransactionDeleteAndEdit curretnTransactionList={params?.curretnTransactionList} customer_id={params?.customer_id} themes={themes} />
        :
        <Transaction_recieve customer_id={params?.customer_id} themes={themes} />
       }
     </ScrollContainer>
    )
}

export default Customer_manage_payment