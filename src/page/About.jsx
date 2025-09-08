import { View, Text, Button } from 'react-native'
import React from 'react' 

export default function About({navigation}) {
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Text>About</Text>
      <Button onPress={()=>navigation.navigate("Home")} title='Navigate Main Page' />
    </View>
  )
}   