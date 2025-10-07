import { View, StyleSheet, Button,Animated,Easing } from 'react-native'; 
import React, { useRef, useEffect,useState } from "react";
import Svg, { Circle, Path, Defs, ClipPath,G,Line,Ellipse,Rect,Polygon,Text,TextPath} from "react-native-svg";

const WaterLableTank = ()=> {
  

 const [time, setTime] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setTime(prev => {
      if (prev < 100) return prev + 1;
      clearInterval(interval);
      return prev;
    });
  }, 500);

  return () => clearInterval(interval);
}, []);
 
  const percentage =  time
  const range2 =  27 + (percentage / 100 ) * (100 - 27) 
  
  const containerBottomY = 0
  const containerTopY = 185
  
  const range = containerTopY - containerBottomY  ; 
   const waterY = containerTopY - (range2/100) * range;
   const pathY = (range2/100) * range;
   
  const AnimatedPath = Animated.createAnimatedComponent(Path);
   const translateX = useRef(new Animated.Value(0)).current;

 useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: 300,   // right side move karega
          duration: 8000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,   // wapas left side
          duration: 8000,
          wasing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={ { position: 'relative', width: 200, height: 200 }}>
      <View style={ { position: 'absolute', width: 30, height: '100%', zIndex: 2, left: -30 }}>
        <Svg>
        <Path
      d="
      M28 50 V185 H10 H28 V151 H10 H28 V117.5 H10
      H28 V83.75 H10 H28 V50 H10
      "
      stroke="red"
      strokeWidth="2"
      fill="none"
      />
        {
      [45, 78, 112, 146, 180].map((num, index)=> {
        return(
          <Text key={index} x="5" y={num} fontSize="10" fill="red">{num == 180 ? '0': num == 146 ? '25': num == 112 ? '50': num == 78 ? '75': num == 45 ? '100': null}%</Text>
        )
      })
      }
        </Svg>
      </View>
       <Svg width="200" height="200">
        <Ellipse
      rx="100" stroke="skyblue" fill="none" strokeWidth="2" ry="10" cx="100" cy="20"
      />
        <Line
      x1="0"
      y1="185"
      x2="1"
      y2="20"
      stroke="skyblue"
      strokeWidth="3"
      />
        <Line
      x1="200"
      y1="185"
      x2="200"
      y2="20"
      stroke="skyblue"
      strokeWidth="3"
      />
        <Ellipse
      rx="100" stroke="skyblue" fill="skyblue" strokeWidth="3" ry="10" cx="100" cy="185"
      />
         <AnimatedPath
      y={waterY}
      transform={translateX.interpolate({
            inputRange: [0, 50],
            outputRange: ["translate(0,0)", "translate(50,0)"],
          })}
      x="-80"
      d={`
      M0 ${pathY} H320 V40
      C280 30,260 70,240,50
      C220 20,200 70,180,50
      C160 20,140 70,120,50
      C100 20,80 70,60,50
      Q40 30,0 50
      `}
      stroke="skyblue"
      strokeWidth="2"
      fill="skyblue"
      />
       </Svg>
      </View>
  )
}


export default WaterLableTank