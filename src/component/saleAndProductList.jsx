import {View,Text,useColorScheme,TouchableOpacity,TextInput,Button} from 'react-native'
import {useContext,useState,useRef,useEffect} from 'react'
import BoxContainer from './BoxContainer'
import Colors from '../Colors'
import Currancy from '../Currancy'
import {ProductContext} from '../Context/Contextcontent'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useNavigation } from '@react-navigation/native';
const ProductList = ({items,QuantityDecreese,QuantityIncreese,quantitydata})=>{
  const {itemsRecords,themes} = useContext(ProductContext) 
  const theme = useColorScheme()   
  return (
   <BoxContainer> 
       <View style={ { flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>
         
         <View style={ { flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <View
      style={ { width: 40, height: 40, elevation: 6, backgroundColor:themes.theme.backgroundTheme, justifyContent: 'center', alignItems: 'center',borderRadius:6,shadowColor:themes.theme.color }}
      >
              <Text
        style={{fontWeight:'700',fontSize:18,color:Colors.mainColor
        }}
        >{items?.name.charAt(0)}</Text>
            </View>
           <Text style={{color:'#999',
           }}>{items?.name}</Text>
         </View>
         <View style={{flexDirection:'row',alignItems:'center'}}>
         {
           items?.selectSize == 'showsize' && 
          <Text style={{color:Colors.mainColor,fontWeight:'700'}}>Size - {items?.size} </Text>
         }
           <View style={{width:50,alignItems:'center'}}>
              <Text style={{fontWeight:'800',color:'#666'}}>{items?.stock}</Text>
              <Text style={{fontWeight:'500',color:Colors.mainColor}}>{items?.units?.toUpperCase()}</Text>
           </View>
         </View>
         </View> 
         <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:5,alignItems:"center"}}>
         <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: "center",width:'70%'}}>
          <View style={{alignItems:'center'}}>
           <Text style={{fontWeight:'600',fontSize:13,color:Colors.mainColor}}>Purchase Price</Text>
           <Text style={{color:'#777',fontWeight:'600'}}>{Currancy(items?.purchasePrice)}</Text>
          </View> 
          
          <View style={{alignItems:'center'}}>
           <Text style={{fontWeight:'600',fontSize:13,color:Colors.mainColor}}>#{items?.id}</Text>
          </View> 
          
          <View style={{alignItems:'center'}}>
           <Text style={{fontWeight:'600',fontSize:13,color:Colors.mainColor}}>Sale Price</Text>
           <Text style={{color:'#777',fontWeight:'600'}}>{Currancy(items?.salePrice)}</Text>
          </View> 
         </View>
         
         <View style={{flexDirection:'row',justifyContent:'space-between',width:110,backgroundColor: `rgba(247, 93, 11, 0.${quantitydata ? 6 : 2})`,alignItems:'center',paddingHorizontal:3,borderRadius:4}}>
          <TouchableOpacity onPress={()=>QuantityIncreese(items)} style={{paddingHorizontal:6,backgroundColor:themes.mainColor,paddingVertical:3,borderRadius:4}}>
            <FontAwesome name="plus-circle"  size={18} color="#fff" />
          </TouchableOpacity>
          {/* <TextInput value={quantitydata ? quantitydata.quantity : 0} style={{width:30,color:themes.theme.color,textAlign:'center'}}  /> */}
          <Text style={{width:30,color:themes.theme.color,textAlign:'center'}}>{quantitydata ? quantitydata.quantity : 0}</Text>
          <TouchableOpacity onPress={()=>QuantityDecreese(items)} style={{paddingHorizontal:6,backgroundColor:themes.mainColor,paddingVertical:3,borderRadius:4}}>
            <FontAwesome name="minus-circle" size={18}  color="#fff" />
          </TouchableOpacity>
         </View>
         </View>
   </BoxContainer>
  )
}
const SaleProductList = ({items,QuantityDecreese,QuantityIncreese,setSaleProductItems,QuantityChangest})=>{
  const [showChangeText,setShowChangeText] = useState(false)
  const [changeText,setChangeText] = useState(items?.salePrice)
  const {themes} = useContext(ProductContext) 
  const [quantityValue,setQuantityValue] = useState(items?.quantity.toString())
  const updateHandler = ()=>{
    setShowChangeText(false)
     setSaleProductItems((prev) => { 
    return prev.map((p) =>
      p.id === items.id ? { ...p, salePrice:changeText } : p
    ); 
});
  }
  const typingTimout = useRef(null)
  const QuantityChangestHandler = (receiveText)=>{
           setQuantityValue(receiveText)
       if(isNaN(receiveText)) return false 
       if (typingTimout.current) {  
             clearTimeout(typingTimout.current)
           }
      typingTimout.current = setTimeout(() => {
          QuantityChangest(receiveText,items)   
           
        }, 1000);
       
  }
  
  useEffect(()=>{
    setQuantityValue(items?.quantity.toString())
  },[items])
  return (
    showChangeText ?
    <BoxContainer style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6}}>
      <TextInput onChangeText={(text)=>setChangeText(text)} value={changeText.toString()} style={{width:120,borderWidth:1,borderColor:themes.theme.color,paddingVertical:2,paddingHorizontal:6,padding:0,color:themes.theme.color}} />
     <TouchableOpacity onPress={updateHandler} style={{paddingHorizontal:8,paddingVertical:3,outlineWidth:1,outlineColor:themes.mainColor,borderRadius:6}}>
      <Text style={{color:themes.mainColor}}>Update</Text>
     </TouchableOpacity>
    </BoxContainer>
    :
   <BoxContainer>  
         
          <TouchableOpacity onPress={()=>setShowChangeText(true)}>
            <View style={ { flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>
         
         <View style={ { flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <View
      style={ { width: 40, height: 40, elevation: 6, backgroundColor:themes.theme.backgroundTheme, justifyContent: 'center', alignItems: 'center',borderRadius:6,shadowColor:themes.theme.color }}
      >
              <Text
        style={{fontWeight:'700',fontSize:18,color:Colors.mainColor
        }}
        >{items?.name.charAt(0)}</Text>
            </View>
           <Text style={{color:'#999',
           }}>{items?.name}</Text>
         </View>
         <View style={{flexDirection:'row',alignItems:'center'}}>
         {
           items?.selectSize == 'showsize' && 
          <Text style={{color:Colors.mainColor,fontWeight:'700'}}>Size - {items?.size} </Text>
         }
           <View style={{width:50,alignItems:'center'}}>
              <Text style={{fontWeight:'800',color:'#666'}}>{items?.stock}</Text>
              <Text style={{fontWeight:'500',color:Colors.mainColor}}>{items?.units?.toUpperCase()}</Text>
           </View>
         </View>
         </View>
          </TouchableOpacity>
         <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:5,alignItems:"center"}}>
         <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: "center",width:'70%'}}>
          <View style={{alignItems:'center'}}>
           <Text style={{fontWeight:'600',fontSize:13,color:Colors.mainColor}}>Purchase Price</Text>
           <Text style={{color:'#777',fontWeight:'600'}}>{Currancy(items?.purchasePrice)}</Text>
          </View> 
          
          <View style={{alignItems:'center'}}>
           <Text style={{fontWeight:'600',fontSize:13,color:Colors.mainColor}}>Sale Price</Text>
           <Text style={{color:'#777',fontWeight:'600'}}>{Currancy(items?.salePrice)}</Text>
          </View> 
         </View>
         
         <View style={{flexDirection:'row',justifyContent:'space-between',width:110,backgroundColor: `rgba(247, 93, 11, 0.2)`,alignItems:'center',paddingHorizontal:3,borderRadius:4}}>
          <TouchableOpacity onPress={()=>QuantityIncreese(items)} style={{paddingHorizontal:6,backgroundColor:themes.mainColor,paddingVertical:3,borderRadius:4}}>
            <FontAwesome name="plus-circle"  size={18} color="#fff" />
          </TouchableOpacity>
           <TextInput keyboarderType='phone-pad' onChangeText={(text)=>QuantityChangestHandler(text)} value={quantityValue} style={{width:30,color:themes.theme.color,textAlign:'center',paddingHorizontal:0,paddingVertical:0,fontWeight:'700'}}  /> 
         
          {
            /*
            <Text style={{width:30,color:themes.theme.color,textAlign:'center'}}>{items.quantity}</Text>
            */
          }
          <TouchableOpacity onPress={()=>QuantityDecreese(items)} style={{paddingHorizontal:6,backgroundColor:themes.mainColor,paddingVertical:3,borderRadius:4}}>
            <FontAwesome name="minus-circle" size={18}  color="#fff" />
          </TouchableOpacity>
         </View>
         </View>
       
   </BoxContainer>
   
  )
}

const CustomerBillRecords = ({items,index})=>{ 
  const navigation = useNavigation()
    const {themes,SaleRecords} = useContext(ProductContext)
  const TotalSoldPrice = items?.products?.reduce((prev,next)=> {return prev + Number(next?.salePrice) * Number(next?.quantity)},0) 
  const TotalQuantity = items?.products?.reduce((prev,next)=>{return prev + Number(next?.quantity)},0)
  
const totalduesSale =  items?.dues && items?.dues?.dues ? items?.dues?.duesAmount?.reduce((prev,next)=>{return prev + Number(next?.duesAmount)},0) : 0
   
const totaldues = Number(items.totalAmount) - totalduesSale 

  return(
    <BoxContainer>
    <TouchableOpacity onPress={()=> navigation.navigate('Bill',{billId:items?.id})}>
    <View style={{flexDirection:"row",justifyContent:"space-between"}}>
      <Text style={{color:themes.theme.color,fontWeight:'500',fontSize:12}}>{items?.customerName}</Text>
      {
      items?.dues && items?.dues?.dues && totaldues > 0 && 
      <View style={{backgroundColor:Colors.mainColor,width:8,height:8,borderRadius:50,}} />
      }
    </View>
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-end'}}>
        <Text style={{color:themes.theme.color,fontSize:12}}>Date : {items?.date} & Time : {items?.time}</Text>
        <View style={{alignItems:'flex-end'}}>
        <Text style={{color:'#777',fontWeight:'800',}} ><Text style={{fontSize:12,fontWeight:'600',color:themes.theme.color}}>Total Quantity : </Text>{String(TotalQuantity)?.padStart(2,'0')}</Text>
        <Text style={{color:themes.mainColor,fontWeight:'800',}}><Text style={{fontSize:12,fontWeight:'600',color:themes.theme.color}}>TotalPrice : </Text>{Currancy(totaldues > 0 ? totaldues : items?.totalAmount)}</Text>
         </View>
      </View>
    </TouchableOpacity>
    </BoxContainer>
    )
}


export {ProductList,SaleProductList,CustomerBillRecords}