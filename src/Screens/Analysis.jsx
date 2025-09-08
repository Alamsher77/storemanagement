import { View, Text } from 'react-native'
import React from 'react'
import ScrollContainer from '../component/ScrollContainer'
//import LinearGradient from 'react-native-linear-gradient'
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../Colors'

export default function Analysis() {
  return (
    <ScrollContainer>
      <View style={{ backgroundColor: '#fff', flexDirection: 'row',padding:6 }}>
        <LinearGradient angle={90} colors={[Colors.mainColor,'rgba(228, 153, 96, 1)']}  style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 10,borderRadius:10 }}>
          <Text style={{fontWeight:'600',fontSize:16,color:'#fff'}}>Sale</Text>
        </LinearGradient>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
          <Text style={{fontWeight:'600',fontSize:16}}>Product</Text>
        </View>
      </View>
    </ScrollContainer>
  )
}