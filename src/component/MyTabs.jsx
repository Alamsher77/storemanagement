import { View, Platform, StyleSheet } from 'react-native';
import {useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Colors';
import {ProductContext} from '../Context/Contextcontent'
import React,{useContext} from 'react'
export default function MyTabBar({ state, descriptors, navigation }) {
  const {themes} = useContext(ProductContext)
  const { colors } = useTheme();
  if (!state || !navigation) return null;
  return (
    <View style={[styles.container,{backgroundColor:themes.theme.backgroundTheme}]}>
      {state.routes.map((route, index) => {

        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;
        let myIcons;
        if (route.name == 'Main') {
          myIcons = <MaterialIcons name="home-filled" size={30} color={isFocused ? Colors.mainColor : '#999'} />
        } else if (route.name == 'Analysis') {
          myIcons = <MaterialIcons name="analytics" size={30} color={isFocused ? Colors.mainColor : '#999'} />
        } else if (route.name == 'Store') {
          myIcons = <MaterialIcons name="storefront" size={30} color={isFocused ? Colors.mainColor : '#999'} />
        }

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params || {});
          }else{
             navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
        
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <PlatformPressable
            key={index}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabs}
          >
            {isFocused && <View style={styles.barIndicator} />}
            {myIcons}
            <Text style={{ color: isFocused ? themes.theme.color : '#999', fontWeight: 'bold' }}>
              {label}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingBottom: 20,
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tabs: {
    flex: 1,
    alignItems: 'center',
    position: 'relative'
  },
  barIndicator: {
    width: 80,
    padding: 2,
    backgroundColor: Colors.mainColor,
    position: 'absolute',
    top: -10,
    shadowColor: Colors.mainColor,
    elevation: 8
  }
})
