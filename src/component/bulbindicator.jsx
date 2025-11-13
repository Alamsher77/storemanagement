// RNBulbIndicator.js
import React, { useEffect, useRef } from "react";
import { View, Animated, TouchableOpacity, Platform } from "react-native";

export default function BulbIndicator({
  size = 36,
  on = false,
  color = "green",
  pulse = true,
  onPress,
}) {
  const glow = useRef(new Animated.Value(on ? 1 : 0)).current;

  useEffect(() => {
    if (!pulse) {
      Animated.timing(glow, { toValue: on ? 1 : 0, duration: 200, useNativeDriver: true }).start();
      return;
    }

    if (on) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glow, { toValue: 1.1, duration: 700, useNativeDriver: true }),
          Animated.timing(glow, { toValue: 0.9, duration: 700, useNativeDriver: true }),
        ])
      ).start();
    } else {
      Animated.timing(glow, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    }
  }, [on, pulse, glow]);

  // animated scale and opacity for the glow layer
  const animatedScale = glow.interpolate({ inputRange: [0, 0.9, 1.1], outputRange: [0.01, 1, 1.3] });
  const animatedOpacity = glow.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0.35, 0.7] });

  const bulbStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: on ? color : "#222",
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
  };

  const innerHighlight = {
    position: "absolute",
    top: size * 0.18,
    left: size * 0.18,
    width: size * 0.28,
    height: size * 0.28,
    borderRadius: (size * 0.28) / 2,
    backgroundColor: "rgba(255,255,255,0.85)",
    opacity: 0.9,
  };

  // shadow style (iOS) and elevation (Android)
  const shadowWrapper = {
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: on ? 0.9 : 0.15,
    shadowRadius: on ? size * 0.6 : 2,
    elevation: on ? Math.min(20, size / 2) : 2,
  };

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <Animated.View style={[{ alignItems: "center", justifyContent: "center" }, shadowWrapper]}>
        {/* glow layer */}
        <Animated.View
          style={{
            position: "absolute",
            width: size * 2.2,
            height: size * 2.2,
            borderRadius: (size * 2.2) / 2,
            backgroundColor: color,
            opacity: animatedOpacity,
            transform: [{ scale: animatedScale }],
          }}
          pointerEvents="none"
        />

        {/* main bulb */}
        <View style={bulbStyle}>
          <View style={innerHighlight} />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}