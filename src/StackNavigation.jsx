import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './page/Home';
import About from './page/About';
import BottomTabNavigation from './BottomTabNavigation';
import SplashScreen from './page/SplashScreen';
import { StatusBar, View,useColorScheme } from 'react-native';
import TotalProduct from './Screens/Home/TotalProduct';
import ProductCategry from './Screens/Home/ProductCategry';
import TotalSold from './Screens/Home/TotalSold';
import MonthlyIncome from './Screens/Home/MonthlyIncome'; 
import Toast from 'react-native-toast-message'
export default function StackNavigation() {
  const Stack = createNativeStackNavigator();
  const theme = useColorScheme()
  const background = theme == 'dark' ? 'black' : '#fff'
  const textColor = theme == 'dark' ? '#ddd' : '#444'
  return (
    <>
      {/* <View style={{width:'100%',height:40,}} /> */}
      <StatusBar barStyle={'default'} /> 
      <Stack.Navigator screenOptions={{
      headerShown:false}}>
        <Stack.Screen name='Splash' component={SplashScreen} />
        <Stack.Screen name='About' component={About} />
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen options={{headerShown:true}} name='TotalProduct' component={TotalProduct} />
        <Stack.Screen options={{headerShown:true}} name='ProductCategry' component={ProductCategry} />
        <Stack.Screen options={{headerShown:false}} name='TotalSold' component={TotalSold} />
        <Stack.Screen options={{headerShown:true}} name='MonthlyIncome' component={MonthlyIncome} />

      </Stack.Navigator>
      
      <Toast />
    </>
  )
}