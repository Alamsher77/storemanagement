import React,{useEffect,useState,useMimo} from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './page/Home';
import About from './page/About';
import BottomTabNavigation from './BottomTabNavigation'; 
import { StatusBar, View,useColorScheme } from 'react-native';
import TotalProduct from './Screens/Home/TotalProduct';
import ProductCategry from './Screens/Home/ProductCategry';
import TotalSold from './Screens/Home/TotalSold'; 
import ViewSaleBillDetails from './Screens/Home/ViewSaleBillDetails'
import UserBankingDetails from './Screens/Home/UserBankingDetails'
import CustomerDetails from './Screens/Ledger/customer_details'
import Customer_manage_payment from './Screens/Ledger/Customer_manage_payment'
import Toast from 'react-native-toast-message'
import { useDispatch,useSelector } from "react-redux";
import {getProducts,getSales,dbConnection} from './Storage/Database' 
import {setProducts,setProductCategry} from './redux/productSlice'
import {setSale,setMonthlySaleData,setTodayIncome} from './redux/saleSlice'
import {setCustomers} from './redux/ledgerSlice'
import Saleanalysis from './analysis'
import DateAndTime from './dateAndTime'
import delay from './Utils/delay'
import Loading from './component/loading'
import SplashScreen from './page/SplashScreen'

import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
export default function StackNavigation() {
  const Stack = createNativeStackNavigator();
  const theme = useColorScheme()
  const background = theme == 'dark' ? 'black' : '#fff'
  const textColor = theme == 'dark' ? '#ddd' : '#444'
 
  const dispatch = useDispatch();  
  const [loadingFetchData,setLoadingFetchData] = useState(true)
  useEffect(() => {
    
  const initStoredata = async ()=>{
    try { 
      console.time("all")
      const [loadData,loadSalesdata,userdata] = await Promise.all(
        [
          loadProducts(),
          laodSales(),
          loadUsers(),
          MaterialIcons.loadFont(),
          Ionicons.loadFont(),
          Octicons.loadFont(),
          Fontisto.loadFont(),
          FontAwesome.loadFont(),
        ]
        ) 
      console.timeEnd("all")
      console.time("category ")
        if (loadData.length > 0) {
          const db = await dbConnection()
        const categories = await db.getAllAsync(`
  SELECT DISTINCT UPPER(category) as category
  FROM products
  WHERE category IS NOT NULL
  AND category != ''
`);
    dispatch(setProductCategry(categories));
  }
      console.timeEnd("category")
  
      console.time("analysis")
        if (loadSalesdata.length > 0) {
    const monthlySaleData = Saleanalysis({ SaleRecords: loadSalesdata });
    const todayDate = (DateAndTime()).date

const todayIncome = Saleanalysis({SaleRecords:loadSalesdata,specificDate:todayDate})
    dispatch(setTodayIncome(todayIncome))
    dispatch(setMonthlySaleData(monthlySaleData));
  }
        
      console.timeEnd("analysis")
        
        setLoadingFetchData(false)
        dispatch(setProducts(loadData))
        dispatch(setSale(loadSalesdata))
        dispatch(setCustomers(userdata))
    } catch (e) {
      setLoadingFetchData(false)
      console.log(e)
      Toast.show({
        type:'error',
        text1:e.message
      })
    }
  } 
  initStoredata()
  }, []);

const loadProducts = async () => {
 return  await getProducts();  
};
 
const getsalesdata = useSelector((state)=> state.sale.sale)
const laodSales = async ()=>{ 
    const rows = await getSales()
  
      const  someSaleDataToParse = rows.map((saleItems)=>({...saleItems,
      dues:safeParse(saleItems?.dues),
      products:safeParse(saleItems?.products),
      updateAt:safeParse(saleItems?.updateAt)
  }))   
 
  return someSaleDataToParse
}
const loadUsers = async ()=>{ 
    const db = await dbConnection()
  const userdata = await db.getAllAsync("SELECT * FROM users ORDER BY latest_transaction_date DESC , id DESC"); 
  return userdata
}





if (loadingFetchData) {
  return <SplashScreen />
}
  return (
    <> 
      <Stack.Navigator screenOptions={{headerStyle:{backgroundColor:background},headerTintColor:textColor}}> 
        <Stack.Screen options={{headerShown:false}} name='Home' component={Home} />
        <Stack.Screen  name='TotalProduct' component={TotalProduct} />
        <Stack.Screen  name='ProductCategry' component={ProductCategry} />
        <Stack.Screen options={{headerShown:false}} name='TotalSold' component={TotalSold} /> 
        <Stack.Screen  name='Bill' component={ViewSaleBillDetails} /> 
        <Stack.Screen  name='UserBankingDetails' component={UserBankingDetails} />
        <Stack.Screen  name='CustomerDetails' component={CustomerDetails} />
        <Stack.Screen  name='Customer_manage_payment' component={Customer_manage_payment} />

      </Stack.Navigator>
      
      <Toast  />
    </>
  )
}


const safeParse = (val) => {
  try {
    return JSON.parse(val);
  } catch {
    return [];
  }
};