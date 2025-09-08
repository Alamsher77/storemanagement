import React, {
  useState
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
  View
} from 'react-native';
import Colors from './src/Colors';
import {
  ContextContent
} from './src/Context/Contextcontent'
export default function App() {

  return (
    <ContextContent>
     <NavigationContainer>
       <StackNavigation />
     </NavigationContainer>
    </ContextContent>
  )
}