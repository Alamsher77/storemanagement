import { View, StyleSheet, Button,Animated,Easing ,Text,useColorScheme,Pressable} from 'react-native'; 
 import ScrollContainer from '../../component/ScrollContainer'
 import WaterLableTank from '../../component/WaterLableTank'
 import BulbIndicator from '../../component/bulbindicator'
 import React, {useState} from "react";
 
export default function ProductCategry(props) {
  const theme = useColorScheme()
  const textColor = theme == 'dark' ? '#fff' :'#000'
  const background = theme == 'dark' ? '#333' : '#fff'
  const [isOn,setIsOn] = useState(true)
  const [wifiConnection,setWifiConnection] = useState(true)
  const [start,setStart] = useState(false)
  
  return (
    <ScrollContainer>
    <View style={styles.container}> 
      <WaterLableTank start={start} /> 
       <View style={{flexDirection:'row',width:'100%',justifyContent:'center',gap:20,alignItems:'center'}}>
      <View style={{flexDirection:'row',gap:8,alignItems:'center'}}>
      <Text style={{fontWeight:'700',opacity:0.6,fontSize:13,color:textColor}}>Wifi Status</Text> 
      {wifiConnection ?  <BulbIndicator size={5} on={isOn} color="rgba(0,200,0,1)" onPress={() => setIsOn(!isOn)} />
      :
    <BulbIndicator  size={5} on={isOn} color="rgba(200,0,0,1)" onPress={() => setIsOn(!isOn)} />}
    </View>
      <View style={{flexDirection:'row',gap:8,alignItems:'center'}}>
      <Text style={{fontWeight:'700',opacity:0.6,fontSize:13,color:textColor}}>Motor Status</Text> 
      {start ?  <BulbIndicator size={5} on={isOn} color="rgba(0,200,0,1)" onPress={() => setIsOn(!isOn)} />
      :
    <BulbIndicator  size={5} on={isOn} color="rgba(200,0,0,1)" onPress={() => setIsOn(!isOn)} />}
      </View> 
     </View>
      <View style={{marginTop:10,gap:8,flexDirection:'row'}}>  
       <StarterButton textColor={textColor} onPress={()=>setStart(false)} start={!start} color='rgba(150,0,0,0.4)' color2="red" size={60} titel="Stope" /> 
      <StarterButton textColor={textColor} titel='Start' start={start} onPress={()=>setStart(true)}  color="rgba(0,150,0,0.4)" color2='green' size={60} />
      </View>  
    </View> 
    </ScrollContainer>
  );
}

const StarterButton = ({color,color2,size,onPress,start,titel,textColor})=>{
  return(
    <View style={{justifyContent:'center',alignItems:'center',gap:4}}>
    <Text style={{color:textColor,opacity:0.6,fontSize:12,}}>{titel}</Text>
     <Pressable onPress={onPress} style={{height:size,width:size,backgroundColor:color,borderRadius:50,justifyContent:'center',alignItems:'center'}}>
         <View style={{height:size / 1.4 ,width:size / 1.4 ,backgroundColor:color2,borderRadius:50,opacity: start ? 0 : 1,outlineWidth:0.5,outlineColor:'#fff'}}/>  
     </Pressable>
     </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center'
  },
});
