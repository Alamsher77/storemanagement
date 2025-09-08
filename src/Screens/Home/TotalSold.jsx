import { View, Text,useColorScheme,StyleSheet,Pressable,TextInput,Dimensions,Animated} from 'react-native'
import React,{useState,useRef} from 'react'
import ScrollContainer from '../../component/ScrollContainer'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Colors from '../../Colors'
import Currancy from '../../Currancy'
const {height:ScreenHeight} = Dimensions.get('window')
export default function TotalSold({navigation}) {
  const theme = useColorScheme()
  const background = theme == 'dark' ? 'black' : '#fff'
  const textColor = theme == 'dark' ? '#ddd' : '#444'
  
  const [searchText,setSearchText] = useState('')
  const [isUp,setIsUp] = useState(false)
   const animatedPosition = useRef(new Animated.Value(ScreenHeight * 0.7)).current;
   const animatedSold = useRef(new Animated.Value(ScreenHeight * 0.78)).current;
  const heightDecreeseAndIncrees = ()=>{
     Animated.timing(animatedPosition, {
      toValue: isUp ? 50 : ScreenHeight * 0.7, // agar upar hai to neeche, agar neeche hai to upar
      duration: 500,
      useNativeDriver: false, // top property ke liye false
    }).start();
     Animated.timing(animatedSold, {
      toValue: isUp ? 80 : ScreenHeight * 0.73, // agar upar hai to neeche, agar neeche hai to upar
      duration: 500,
      useNativeDriver: false, // top property ke liye false
    }).start();

    setIsUp(!isUp); // state toggle
  }
  return (
    <>
      <View style={[styles.header,{borderColor:textColor}]}>
      <Pressable onPress={()=>navigation.goBack()}>
        <FontAwesome6 size={20} color={"#fff"} name="arrow-left" />
      </Pressable>
        <View style={{height:40,borderWidth:0.3,borderColor:'#fff',width:320,borderRadius:12,position:'relative'}}>
        <TextInput value={searchText} onChangeText={(text)=>setSearchText(text)}  placeholderTextColor="#fff" placeholder="Search Product By name/size" style={{paddingRight:67,paddingLeft:10,color:'#fff'}} />
        <View style={{position:'absolute',right:0,top:'50%',transform:[{translateY:'-50%'}],justifyContent:'center',alignItems:'center',flexDirection:'row',gap:6,}}>
        {
          searchText ?
          <Pressable onPress={()=>setSearchText('')}  style={{padding:4}}>
        <MaterialIcons size={20} color="#fff" name="clear" />
        </Pressable>
        :
        <Pressable style={{padding:4}}>
        <MaterialIcons size={18} color="#fff" name="qr-code-scanner" />
        </Pressable>
        }
        <Pressable style={{padding:4}}>
        <MaterialIcons size={20} color="#fff" name="mic" />
        </Pressable>
        </View>
        </View>
      </View>
      
      
      <ScrollContainer > 
         
         
      </ScrollContainer>
      {/* this component for create bill model */}
      
      <Animated.View style={[styles.billModel,{backgroundColor:background,borderColor:textColor,top:animatedPosition}]}> 
      
        <Pressable onPress={heightDecreeseAndIncrees} style={{backgroundColor:Colors.mainColor,padding:2,borderRadius:20,height:30,width:30,justifyContent:'center',alignItems:'center',position:'absolute',top:4,left:20,outlineWidth:2,outlineColor:'#fff',zIndex:100}}>
          <MaterialIcons size={20} color='#fff' name={`arrow-${isUp ? "upward":"downward"}`} />
        </Pressable> 
        <ScrollContainer   > 
        <TextInput placeholderTextColor={textColor} placeholder="Enter The Parti Name" style={{color:textColor,alignSelf:'center',width:200,borderColor:textColor,borderBottomWidth:1,paddingHorizontal:6,paddingVertical:0,}} />
         
        </ScrollContainer>
       <Animated.View style={{position:'absolute',bottom:animatedSold,}}>
        <View style={{flexDirection:'row',justifyContent:'space-between',width:'100%',paddingHorizontal:12}}>
          <Text style={{color:textColor}}>Grand Total
          </Text> 
          <Text style={{color:textColor}}>{Currancy(3745)}</Text>
        </View>
        <View style={{alignSelf:'center',backgroundColor:Colors.mainColor,outlineWidth:2,outlineColor:textColor,paddingHorizontal:12,paddingVertical:4,borderRadius:8}}>
          <Text style={{color:textColor}} >Genrate Bill/Reciepent</Text>
        </View>
         </Animated.View>
      </Animated.View>
    </>
  )
}

const styles = StyleSheet.create({ 
  header:{
    height:100,
    width:'100%',
    alignItems:'center',
    borderBottomWidth:0.6,
    paddingTop:40,
    backgroundColor:Colors.mainColor,
    paddingHorizontal:8,
    flexDirection:'row',
    justifyContent:'space-between',paddingRight:20
  },
  billModel:{
    position:'absolute',
    width:'100%',
    height:'100%', 
    borderTopWidth:0.5
  }
})