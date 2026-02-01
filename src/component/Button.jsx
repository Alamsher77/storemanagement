import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  useColorScheme,
  StyleSheet,
} from "react-native";

export default function AnimatedButton({ title = "Click Me", onPress,bgColor,color,style,disabled }) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  const [buttonSize, setButtonSize] = useState({ width: 0, height: 0 });

  const bg = isDark ? "#1e293b" : "#e2e8f0";
  const hoverBg = isDark ? "#334155" : "#cbd5e1";
  const textColor = isDark ? "#f8fafc" : "#0f172a";

  const handlePress = () => {
    waveAnim.setValue(0);

    Animated.timing(waveAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    setTimeout(function() {
      onPress && onPress();
    }, 300);
  };

  const scale = scaleAnim;
  const waveScale = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 3],
  });

  const waveOpacity = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0],
  });

  return (
    <Pressable
      disabled={disabled}
      onPress={handlePress}
      onHoverIn={() =>
        Animated.spring(scaleAnim, { toValue: 1.1, useNativeDriver: true }).start()
      }
      onHoverOut={() =>
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start()
      }
      style={{ alignSelf: "center",opacity: disabled ? 0.5 : 1 }}
    >
      <Animated.View
        onLayout={(e) => setButtonSize(e.nativeEvent.layout)}
        style={[
          styles.button,
          {
            backgroundColor: bgColor ? bgColor : bg,
            transform: [{ scale }],
          },
          style
        ]}
      >
        {/* Wave */}
        <Animated.View
          style={[
            styles.wave,
            {
              width: buttonSize.width,
              height: buttonSize.width,
              borderRadius: buttonSize.width,
              backgroundColor: color ? color :  textColor,
              opacity: waveOpacity,
              transform: [{ scale: waveScale }],
            },
          ]}
        />

        <Text style={[styles.text, { color: color ? color : textColor }]}>
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 6,
    paddingHorizontal: 30,
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  wave: {
    position: "absolute", 
  },
});
