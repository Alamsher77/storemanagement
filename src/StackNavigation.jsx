import React,{useEffect} from 'react'
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
export default function StackNavigation() {
  const Stack = createNativeStackNavigator();
  const theme = useColorScheme()
  const background = theme == 'dark' ? 'black' : '#fff'
  const textColor = theme == 'dark' ? '#ddd' : '#444'
 
  const dispatch = useDispatch();  
  
  useEffect(() => {
  loadProducts();
  laodSales()
  loadUsers()
  }, []);

const loadProducts = async () => {
  try { 
  const rows = await getProducts();  
   dispatch(setProducts(rows))
  } catch (e) {
    console.log('product fetch error '+e)
  }
  
};
 
 const getsalesdata = useSelector((state)=> state.sale.sale)
const laodSales = async ()=>{
  try {
    const rows = await getSales()
      const  someSaleDataToParse = rows.map((saleItems)=>({...saleItems,
      dues:safeParse(saleItems?.dues),
      products:safeParse(saleItems?.products),
      updateAt:safeParse(saleItems?.updateAt)
  }))   
 
    dispatch(setSale(someSaleDataToParse))
  } catch (e) {
      console.log('sale fetch error '+e.message)
  }
}
const loadUsers = async ()=>{
  try {
    const db = await dbConnection()
   const userdata = await db.getAllAsync("SELECT * FROM users ORDER BY latest_transaction_date DESC , id DESC");
  dispatch(setCustomers(userdata))
  } catch (e) {
      console.log('users fetch error ',e)
  }
}

const itemsRecords = useSelector((state)=>state.product.products)
useEffect(() => {
  if (itemsRecords.length > 0) {
    const categories = [
      ...new Set(
        itemsRecords
          .map(i => typeof i.category === 'string' ? i.category.toUpperCase() : null)
          .filter(Boolean)
      )
    ];
    dispatch(setProductCategry(categories));
  }
}, [itemsRecords]);


useEffect(()=>{
  if (getsalesdata.length > 0) {
    const monthlySaleData = Saleanalysis({ SaleRecords: getsalesdata });
    const todayDate = (DateAndTime()).date

const todayIncome = Saleanalysis({SaleRecords:getsalesdata,specificDate:todayDate})
    dispatch(setTodayIncome(todayIncome))
    dispatch(setMonthlySaleData(monthlySaleData));
  }
}, [getsalesdata]);

  
//  if (!theme) return null;
  return (
    <>
      {/* <View style={{width:'100%',height:40,}} /> */}
    <StatusBar
  backgroundColor={background}
  barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
/> 
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