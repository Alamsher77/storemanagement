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
  Alert
} from 'react-native';
import Colors from './src/Colors';
import {
  ContextContent
} from './src/Context/Contextcontent'
import * as Updates from "expo-updates"; 
import SplashScreen from './src/page/SplashScreen'
import * as SplashScreens from 'expo-splash-screen';

SplashScreens.preventAutoHideAsync();
export default function App() {
  const [pageRady,setPageRady] = useState(false)
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

useEffect(()=>{
  setTimeout(function() {
    setPageRady(true)
    SplashScreens.hide()
  }, 2200);
},[])
if (!pageRady) {
  return <SplashScreen />
}

  return (
    <ContextContent>
     <NavigationContainer>
       <StackNavigation />
     </NavigationContainer>
    </ContextContent>
  )
}