import { View, Text, Image, useAnimatedValue, Animated } from 'react-native'
import React, { useEffect } from 'react' 
export default function SplashScreen() { 
    const scale = useAnimatedValue(0);
    const opacity = useAnimatedValue(1);
    useEffect(() => {
      Animated.timing(opacity, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start(); 

      Animated.timing(scale, {
      toValue: 6,
      duration: 2000,
      useNativeDriver: true,
    }).start(); 
    }, [scale,opacity])
    
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
       <Animated.Image resizeMode='contain' style={{width:300,height:300,opacity:opacity,transform:[{scale:scale}]}} source={require("../assetes/logo.png")} />
    </View>
  )
}