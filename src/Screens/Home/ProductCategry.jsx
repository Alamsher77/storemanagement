import { View, StyleSheet, Button,Animated,Easing ,Text,useColorScheme,Pressable,ActivityIndicator} from 'react-native'; 
 import ScrollContainer from '../../component/ScrollContainer'
 import WaterLableTank from '../../component/WaterLableTank'
 import BulbIndicator from '../../component/bulbindicator'
 import React, {useState,useEffect} from "react";
 
export default function ProductCategry(props) {
  const theme = useColorScheme()
  const textColor = theme == 'dark' ? '#fff' :'#000'
  const background = theme == 'dark' ? '#333' : '#fff'
  const [isOn,setIsOn] = useState(true)
  const [wifiConnection,setWifiConnection] = useState(true)
  const [start,setStart] = useState(false)
  
  const motorIpUrl = 'http://192.168.4.1/'
  const [loading,setLoading] = useState(false)
  const [startLoading,setStartLoading] = useState(false)
  const [motorConnection,setMotorConnection] = useState(false)
  const [deviceConnection,setDeviceConnection] = useState(false)
  const startMotor = async()=>{ 
   
    try {
      setStartLoading(true)
        const response = await fetchWithTimeout(motorIpUrl + "motor-on", {}, 5000)
    const getData = await response.json()
    console.log(getData)
    setStart(true) 
    setMotorConnection(true)
    } catch (e) {
      console.log(e.message)
        setMotorConnection(false)
    }finally{
      setStartLoading(false)
    }
  }
  const stopeMotor = async()=>{ 
     try {
      setStartLoading(true)
        const response = await fetchWithTimeout(motorIpUrl + "motor-off", {}, 5000)
    const getData = await response.json()
    setStart(false) 
    setMotorConnection(true)
    } catch (e) {
        setMotorConnection(false)
    }finally{
      setStartLoading(false)
    }
  }
useEffect(() => {
  let interval;

  const fetchMotorData = async () => {
    try {
      setLoading(true);

      const response = await fetchWithTimeout(motorIpUrl + "tank-status", {}, 5000);
      const data = await response.json();

      setDeviceConnection(true); 
    } catch (e) {
      console.log(e.message)
      setDeviceConnection(false);
    } finally {
      setLoading(false);
    }
  };

  // First time check
  fetchMotorData();

  // Har 2 sec me refresh
 if (deviceConnection) {
    interval = setInterval(fetchMotorData, 5000);
 }

  return () => clearInterval(interval);
}, []);

  return (
    <ScrollContainer>
    <View style={styles.container}> 
      <WaterLableTank start={start} /> 
       <View style={{flexDirection:'row',width:'100%',justifyContent:'center',gap:20,alignItems:'center'}}>
       <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',gap:12}}>
      <Text style={{fontWeight:'700',opacity:0.6,fontSize:13,color:textColor}}>Device Connection :</Text> 
      {
        loading ?
          <ActivityIndicator size="small" color="#0000ff" />
        : 
         <Text style={{fontWeight:'700',opacity:0.6,fontSize:13,color:`rgba(${deviceConnection ? '0,200,0,0.7':'200,0,0,1'})`}}>{deviceConnection ? 'connected' : 'not connect'}</Text> 
      }
     </View>
      <View style={{flexDirection:'row',gap:8,alignItems:'center'}}>
      <Text style={{fontWeight:'700',opacity:0.6,fontSize:13,color:textColor}}>Motor Status</Text> 
      {start ?  <BulbIndicator size={5} on={isOn} color="rgba(0,200,0,1)" onPress={() => setIsOn(!isOn)} />
      :
    <BulbIndicator  size={5} on={isOn} color="rgba(200,0,0,1)" onPress={() => setIsOn(!isOn)} />}
      </View> 
     </View>
     
      <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',gap:12}}>
      <Text style={{fontWeight:'700',opacity:0.6,fontSize:13,color:textColor}}>Motor  connection:</Text> 
      {
        startLoading ?
          <ActivityIndicator size="small" color="#0000ff" />
        : 
        motorConnection ?
          <BulbIndicator  size={5} on={true} color="rgba(0,200,0,1)"   />
         :
        <BulbIndicator  size={5} on={true}  color="rgba(200,0,0,1)"   />
      }
     </View>
     
      <View style={{marginTop:10,gap:8,flexDirection:'row'}}>  
       <StarterButton disabled={startLoading || !start} textColor={textColor} onPress={stopeMotor} start={!start} color='rgba(150,0,0,0.4)' color2="red" size={60} titel="Stope" /> 
      <StarterButton disabled={startLoading || start} textColor={textColor} titel='Start' start={start} onPress={startMotor}  color="rgba(0,150,0,0.4)" color2='green' size={60} />
      </View>  
    </View> 
    </ScrollContainer>
  );
}

const StarterButton = ({color,color2,size,onPress,start,titel,textColor,disabled})=>{
  return(
    <View style={{justifyContent:'center',alignItems:'center',gap:4}}>
    <Text style={{color:textColor,opacity:0.6,fontSize:12,}}>{titel}</Text>
     <Pressable disabled={disabled} onPress={onPress} style={{height:size,width:size,backgroundColor:color,borderRadius:50,justifyContent:'center',alignItems:'center'}}>
         <View style={{height:size / 1.4 ,width:size / 1.4 ,backgroundColor:color2,borderRadius:50,opacity: start ? 0 : 1,outlineWidth:0.5,outlineColor:'#fff'}}/>  
     </Pressable>
     </View>
    )
}


const fetchWithTimeout = (url, options = {}, timeout = 2000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), timeout)
    )
  ]);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center'
  },
});
