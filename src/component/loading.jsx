import { View,ActivityIndicator } from 'react-native'
import React from 'react' 

export default function Loading({navigation}) {
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
     <ActivityIndicator size="large" color="#00ff00" />
    </View>
  )
}   