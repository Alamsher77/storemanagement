import React from 'react'
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
import Toast from 'react-native-toast-message'
export default function StackNavigation() {
  const Stack = createNativeStackNavigator();
  const theme = useColorScheme()
  const background = theme == 'dark' ? 'black' : '#fff'
  const textColor = theme == 'dark' ? '#ddd' : '#444'
  if (!theme) return null;
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

      </Stack.Navigator>
      
      <Toast  />
    </>
  )
}