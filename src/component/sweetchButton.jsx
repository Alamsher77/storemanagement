import { View, Text,Pressable,Animated,StyleSheet} from 'react-native'  
import {useRef,useEffect,useState} from 'react'
//import LinearGradient from 'react-native-linear-gradient'
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../Colors'

const SweetchButton = ({isActive,setActive}) =>{
  const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient)
   const [sweetchContaiWidth,setSweethContaiWidth] = useState(null)
   const translateX = useRef(new Animated.Value(0)).current;
   
   const viewRef = useRef(null);
  const toLeftHandler = (direction)=>{
    setActive(direction == 'right' ? 'Sale' : 'Product')
    Animated.timing(translateX,{
       toValue: direction == 'left' ? sweetchContaiWidth / 2  :0,
       duration:800,
       useNativeDriver:true
    }).start(); 
  }  
  
  useEffect(()=>{
     viewRef.current.measure((x, y, width, height, pageX, pageY) => {
       setSweethContaiWidth(width) 
    });
  },[])
  
  // <AnimatedGradient 
  //       start={{x:0,y:0}}
  //       end={{x:1,y:1,}}
  //       colors={[Colors.mainColor,'rgba(228, 153, 96, 1)']}  style={{justifyContent: 'center', alignItems: 'center', paddingVertical: 10, position:'absolute',width:sweetchContaiWidth / 2 - 20 ,left:5,top:5,transform:[{translateX}]}}>
  //         <Text style={{fontWeight:'600',fontSize:16,color:'#fff',opacity:0}}>{isActive && isActive}</Text>
  //       </AnimatedGradient> 
  return (
      <View ref={viewRef}  style={{ backgroundColor:'rgba(228, 153, 96, 0.4)', flexDirection: 'row',padding:6,position:'relative',width:'100%',justifyContent:'space-between',}}> 
      <AnimatedGradient 
        start={{x:0,y:0}}
        end={{x:1,y:1,}}
        colors={[Colors.mainColor,'rgba(228, 153, 96, 1)']}  style={{borderRadius:10,justifyContent: 'center', alignItems: 'center', paddingVertical: 10, position:'absolute',width:sweetchContaiWidth / 2 - 10 ,left:5,top:6,transform:[{translateX}]}}>
          <Text style={{fontWeight:'600',fontSize:16,color:'#fff',opacity:0}}>{isActive && isActive}</Text>
        </AnimatedGradient> 
          <Pressable onPress={()=>toLeftHandler('right')} style={[styles.button,{width:sweetchContaiWidth / 2 - 10 ,}]}>
          <Text style={{fontWeight:'600',fontSize:16,color:'#fff'}}>Sale</Text>
        </Pressable>  
        <Pressable onPress={()=>toLeftHandler('left')} style={[styles.button,{width:sweetchContaiWidth / 2 - 10 ,}]}>
          <Text style={{fontWeight:'600',fontSize:16,color:'#fff'}}>Product</Text>
        </Pressable> 
      </View>
    )
}

const styles = StyleSheet.create({
  button:{
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 10,
  width:'48%'}
})

export default SweetchButton