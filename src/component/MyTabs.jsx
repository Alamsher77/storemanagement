import { View, Platform, StyleSheet } from 'react-native';
import {useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Colors';
import {ProductContext} from '../Context/Contextcontent'
import React,{useContext} from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import Animated,{ZoomOut,FadeInUp,FadeOutDown,FadeInLeft,FadeInRight} from 'react-native-reanimated';
  const MaterialIconsAnimated = Animated.createAnimatedComponent(MaterialIcons)
export default function MyTabBar({ state, descriptors, navigation }) {
  const {themes} = useContext(ProductContext)
  const { colors } = useTheme();
  const LinearGradientAnimated = Animated.createAnimatedComponent(LinearGradient)
 
  //if (!state || !navigation) return null;
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
        switch (route.name) {
          case 'Main':
           myIcons =  <TabsIcon iconName='home-filled' isFocused={isFocused} />
            break;
          case 'Analysis':
          myIcons = <TabsIcon iconName="analytics" isFocused={isFocused} />
          break;
          case 'Store':
          myIcons = <TabsIcon iconName="storefront" isFocused={isFocused} />
          break;
          case 'Ledger':
          myIcons = <TabsIcon iconName="menu-book" isFocused={isFocused} />
          break;
          default:
            // code
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
          >
          <LinearGradient
           colors={isFocused ? ['#e240ed','#eb613a','#e240ed' ] : ['transparent','transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }} 
           style={[styles.tabs,{
           borderRadius:3,  
          }]}>
            {
            // isFocused && <LinearGradientAnimated
            // entering={FadeInUp} exiting={FadeOutDown}
            // colors={[Colors.mainColor,'transparent']}
            // start={{ x: 1, y: 0 }}
            // end={{ x: 1, y: 1 }} 
            // style={styles.barIndicator} />   
            }
            {myIcons}
            {
              isFocused &&
              <Animated.Text 
            entering={FadeInRight} 
            style={{ color:"#fff", fontWeight: 'bold' }}>
              {label}
            </Animated.Text>
            }
            </LinearGradient>
          </PlatformPressable>
        );
      })} 
    </View>
  );
}

const TabsIcon = ({isFocused,iconName,iconColor})=>{
  return  <MaterialIconsAnimated name={iconName} size={30} color={isFocused ? '#fff' : '#999'} />
}
const styles = StyleSheet.create({
  container: { 
    width: '100%', 
    paddingBottom: 20, 
    justifyContent:'space-between', 
    alignItems:'center',
    flexDirection:'row',
    gap:6,
    paddingHorizontal:12,
    paddingTop:6,
  },
  tabs: {  
    flexDirection:'row',
    paddingHorizontal:12,
    paddingVertical:4, 
    alignItems:'center', 
    justifyContent:'center',
    gap:4
  },
  barIndicator: {
    width: 80,
    height:'50%',
    padding: 2, 
    position: 'absolute',
    top: -10,
    shadowColor: Colors.mainColor,
    elevation: 8
  }
})
