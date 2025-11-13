import { View, Animated, Easing } from 'react-native'; 
import React, { useRef, useEffect, useState } from "react";
import Svg, { Path, Line, Ellipse, Text } from "react-native-svg";

const WaterLableTank = ({start}) => {
  const [time, setTime] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  // water fill logic
  useEffect(() => {
    if (start) {
       const interval = setInterval(() => {
      setTime(prev => (prev < 100 ? prev + 1 : 100));
    }, 500);
    return () => clearInterval(interval);
    } 
  }, [start]);

 const percentage =  time
  const range2 =  27 + (percentage / 100 ) * (100 - 27) 
  
  const containerBottomY = 0
  const containerTopY = 185
  
  const range = containerTopY - containerBottomY  ; 
   const waterY = containerTopY - (range2/100) * range;
   const pathY = (range2/100) * range;
  // wave move animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: -100,
          duration: 4000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -10,
          duration: 4000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const AnimatedPath = Animated.createAnimatedComponent(Path);

  return (
    <View style={{ position: "relative", width: 200, height: 200 }}>
      {/* Side labels */}
      <View style={{ position: "absolute", width: 30, height: "100%", left: -30 }}>
        <Svg>
          <Path
            d="M28 50 V185 H10 H28 V151 H10 H28 V117.5 H10 H28 V83.75 H10 H28 V50 H10"
            stroke="red"
            strokeWidth="2"
            fill="none"
          />
          {[45, 78, 112, 146, 180].map((num, index) => (
            <Text key={index} x="5" y={num} fontSize="10" fill="red">
              {num == 180 ? "0" : num == 146 ? "25" : num == 112 ? "50" : num == 78 ? "75" : "100"}%
            </Text>
          ))}
        </Svg>
      </View>

      {/* Tank + Wave */}
      <Svg width="200" height="200">
        <Ellipse rx="100" stroke="skyblue" fill="none" strokeWidth="2" ry="10" cx="100" cy="20" />
        <Line x1="0" y1="185" x2="1" y2="20" stroke="skyblue" strokeWidth="3" />
        <Line x1="200" y1="185" x2="200" y2="20" stroke="skyblue" strokeWidth="3" />
        <Ellipse rx="100" stroke="skyblue" fill="skyblue" strokeWidth="3" ry="10" cx="100" cy="185" />

        <AnimatedPath
          transform={[
            { translateX: translateX },
            { translateY: waterY  },
          ]}
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
  );
};

export default WaterLableTank;