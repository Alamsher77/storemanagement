import React, {
  useState,
  useEffect
} from 'react'
import {
  NavigationContainer
} from '@react-navigation/native';
import StackNavigation from './src/StackNavigation';
import BottomTabNavigation from './src/BottomTabNavigation';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
  StatusBar,
  useColorScheme
} from 'react-native';
import Colors from './src/Colors';
import {
  ContextContent
} from './src/Context/Contextcontent'
import * as Updates from "expo-updates"; 
import { store } from './src/redux/store'
import { Provider, } from 'react-redux' 
export default function App() {
 useEffect(() => {
   async function checkUpdate() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Alert.alert("Update Available", "App will reload with new update");
          await Updates.reloadAsync();
        }
      } catch (e) {
        console.log(e);
      }
    }

    checkUpdate();
  }, []);  
  return (
     <Provider store={store}>
      <ContextContent>
       <NavigationContainer>
         <StackNavigation />
       </NavigationContainer>
      </ContextContent>
     </Provider>
  )
}