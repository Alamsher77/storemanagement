
import {Pressable,View,Button,Text,TextInput,StyleSheet,ScrollView,TouchableWithoutFeedback} from 'react-native' 
import {useState,useRef,useEffect,useContext} from 'react'
import Colors from '../Colors'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BoxContainer from './BoxContainer'
import {ProductContext} from '../Context/Contextcontent'
const OptionsInputeText = ({optionsButton,onChangeText,lable,itemsData})=>{ 
  const {themes} = useContext(ProductContext)
  const [openoptions,setopenoptions] = useState(false)
  const [selected,setSelected] = useState(optionsButton ? optionsButton[0] : null) 
  return( 
  <View style={styles.inputeFilds}>  
     <TextInput  value={lable ? itemsData :selected}   onPress={()=>setopenoptions(!openoptions)} placeholder='Select size' placeholderTextColor={themes.theme.color} style={{width:'80%',color:themes.theme.color}}   /> 
     <Pressable onPress={()=> setopenoptions(!openoptions)} style={{justifyContent:'center',alignItems:'center',width:25,}}>
      <FontAwesome  size={20} name="angle-down"/>
     </Pressable>
    {
      (openoptions && optionsButton) &&  
       <BoxContainer  style={[styles.shadowContainer]}>
         <ScrollView
        showsVerticalScrollIndicator={false}
         nestedScrollEnabled={true}> 
        {
       optionsButton?.map((items,index)=>{
       const itemstext = items.split(' ')
        const jointText = itemstext.join('')?.toLowerCase()
    
         return  <Pressable onPress={()=>{
         setSelected(items)
        setopenoptions(false)
        onChangeText(jointText)
         }} key={index} style={styles.button}><Text style={{color:themes.theme.color}}>{items}</Text></Pressable>      
        })
        }
        </ScrollView>
     </BoxContainer> 
    }
     </View> 
    )
}

const styles = StyleSheet.create({
  inputeFilds:{
    borderColor:Colors.mainColor,
    borderWidth:1,
    color:Colors.mainColor, 
    paddingLeft:8,
    width:'49%',
    position:'relative',flexDirection:'row',
    justifyContent:'space-between', 
  },
  shadowContainer:{
    position:'absolute', 
    width:'100%',
    top:45,
    zIndex:1000, 
    height:80,
    right:0, 
    padding:2,
    elevation:12,
    shadowColor:'black', 
  },
  button:{
    backgroundColor:'rgba(0,0,0,0.05)',
    padding:4,
    marginBottom:2
  }
})
export default OptionsInputeText