import { View, Text,useColorScheme,StyleSheet,Pressable,TextInput,Dimensions,Animated} from 'react-native'
import React,{useState,useRef,useContext} from 'react'
import ScrollContainer from '../../component/ScrollContainer'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Colors from '../../Colors'
import Currancy from '../../Currancy'
import {ProductList,SaleProductList,CustomerBillRecords} from '../../component/saleAndProductList'
import {ProductContext} from '../../Context/Contextcontent'
import Toast from 'react-native-toast-message'
import DateAndTime from '../../dateAndTime'
import Conformation from '../../component/Conformation'
import { useNavigation } from '@react-navigation/native';
import {addItemSale,readData,writeData} from '../../Storage/jsonStorage'
const {height:ScreenHeight} = Dimensions.get('window')
export default function TotalSold({navigation}) { 
  const navigations = useNavigation()
  const {itemsRecords,themes,SaleRecords,fetchData} = useContext(ProductContext) 
   const [searchProduct,setSearchProduct] = useState(null)
  const [searchText,setSearchText] = useState('')
  const [isUp,setIsUp] = useState(false)
   const animatedPosition = useRef(new Animated.Value(ScreenHeight)).current;
   const animatedSold = useRef(new Animated.Value(ScreenHeight)).current;
   
   const heightDecreeseAndIncreesAndHide = ()=>{
     Animated.timing(animatedPosition, {
      toValue: isUp  ? ScreenHeight : ScreenHeight * 0.7 , // agar upar hai to neeche, agar neeche hai to upar
      duration: 500,
      useNativeDriver: false, // top property ke liye false
    }).start();
    Animated.timing(animatedSold, {
      toValue: isUp ? ScreenHeight : ScreenHeight * 0.72 , // agar upar hai to neeche, agar neeche hai to upar
      duration: 500,
      useNativeDriver: false, // top property ke liye false
    }).start();
     setIsUp(!isUp); // state toggle
   }
  const heightDecreeseAndIncrees = ()=>{
     Animated.timing(animatedPosition, {
      toValue: isUp  ? 50 : ScreenHeight * 0.7, // agar upar hai to neeche, agar neeche hai to upar
      duration: 500,
      useNativeDriver: false, // top property ke liye false
    }).start();
     Animated.timing(animatedSold, {
      toValue: isUp ? 70 : ScreenHeight * 0.72, // agar upar hai to neeche, agar neeche hai to upar
      duration: 500,
      useNativeDriver: false, // top property ke liye false
    }).start();

    setIsUp(!isUp); // state toggle
  }
  
  // search product and filter
 
  const searchHandler = (text)=>{
    setSearchText(text)
    const filterseachitems = text.length === 0 ? null : itemsRecords.filter((items)=>{
       
      return  text.length === 0 ? false : (items.name.toLowerCase().includes(text.toLowerCase()) || items.category.toLowerCase().includes(text.toLowerCase()) || items.size.toLowerCase().includes(text.toLowerCase()) || items.salePrice.toLowerCase().includes(text.toLowerCase()) ) && items.stock > 0
    }) 
    setSearchProduct(filterseachitems)
   
  }
  
  // quantity increese and decreese 
  const [SaleProductItems,setSaleProductItems] = useState([])
  const QuantityIncreese = (itemsData)=>{
    setSaleProductItems((prev) => {
  // Check if item already exists
  const exists = prev.find((p) => p.id === itemsData.id);

  if (exists) {
    // Agar already hai to bas quantity change karo
    return prev.map((p) =>
      p.id === itemsData.id ? { ...p, quantity: p.quantity + 1 } : p
    );
  } else {
    // Agar new hai to add karo
    return [
      ...prev,
      {...itemsData,
        quantity: 1, 
      },
    ];
  }
});
 
  }
  const QuantityDecreese = (itemsData)=>{
      setSaleProductItems((prev) => {
  // Check if item already exists
  const exists = prev.find((p) => p.id === itemsData.id);
  if(!exists) return prev
  if(exists.quantity > 1){
    return prev.map((p) =>
        p.id === itemsData.id ? { ...p, quantity: p.quantity - 1 } : p
      );
  }else{
    return prev.filter((p) => p.id !== itemsData.id)
  }
});
 
  } 
  
  const TotalProductPrice = SaleProductItems.reduce((prev,next)=>{
    return prev + Number(next.salePrice) * Number(next.quantity)
  },0)
  const TotalProductIncome = SaleProductItems.reduce((prev,next)=>{
    return prev + (Number(next.salePrice) - Number(next.purchasePrice)) * Number(next.quantity)
  },0)
  
  // create sale data 
  const [customerName,setCustomerName] = useState(null)
  const SaleHandler = async()=>{
    try {
      /* code */ 
      const status = await Conformation('🧾','Are you sure genrate this bill !!')
      if (!status) return 
      const date = DateAndTime() 
      const saleDetails = {customerName:customerName && customerName.trim(),products:SaleProductItems,...date,totalAmount:TotalProductPrice,totalIncome:TotalProductIncome} 
   
  const customerDetails = await addItemSale(saleDetails) 
  if (!customerDetails.success){
      Toast.show({type:'error',text1:customerDetails.message})
      return false
  } 
  Toast.show({type:'success',text1:customerDetails.message})
    // decrese the Product stock quantity
    
    const ProductData = await readData()
    const updatedata = ProductData?.map((items)=>{
      
  const find = SaleProductItems.find((p)=> p.id === items.id)
  if (find) {
    return {
      ...items,
      stock:Number(items.stock) - Number(find.quantity) < 0 ? 0 : Number(items.stock)- Number(find.quantity)
    }
  }
  return items
    })
  await writeData(updatedata)
  setSaleProductItems([])
  setCustomerName('')
  fetchData()
  navigations.navigate('Bill',{bill:{...saleDetails,invoice:Number(SaleRecords?.length +1 )}})
    } catch (e) { 
     Toast.show({type:'error',text1:e.message})
    }
   
  } 
  return (
    <>
      <View style={[styles.header,{borderColor:themes.theme.color}]}>
      <Pressable onPress={()=>navigation.goBack()}>
        <FontAwesome6 size={20} color={"#fff"} name="arrow-left" />
      </Pressable>
        <View style={{height:40,borderWidth:0.3,borderColor:'#fff',width:320,borderRadius:12,position:'relative'}}>
        <TextInput onBlur={heightDecreeseAndIncreesAndHide} onFocus={heightDecreeseAndIncreesAndHide} value={searchText} onChangeText={(text)=>searchHandler(text)}  placeholderTextColor="#fff" placeholder="Search Product By name/size" style={{paddingRight:67,paddingLeft:10,color:'#fff'}} />
        <View style={{position:'absolute',right:0,top:'50%',transform:[{translateY:'-50%'}],justifyContent:'center',alignItems:'center',flexDirection:'row',gap:6,}}>
        {
          searchText ?
          <Pressable onPress={()=>{
          searchHandler('')
          setSearchText('')}}  style={{padding:4}}>
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
      <ScrollContainer style={{gap:4,paddingBottom:280}} > 
         {
            searchProduct ?
            searchProduct?.map((items,index)=>{
            const quantitydata = SaleProductItems.find((p)=>  p.id == items.id) 
              return(<ProductList quantitydata={quantitydata} QuantityDecreese={QuantityDecreese} QuantityIncreese={QuantityIncreese} key={index} items={items} />)
            })
            
            :
            SaleRecords &&
            SaleRecords?.map((items,index)=>{
              return <CustomerBillRecords index={index} items={items} key={index}/>
            })
          }
      </ScrollContainer>
      {/* this component for create bill model */}
      
      <Animated.View  style={[styles.billModel,{backgroundColor:themes.theme.backgroundTheme,borderColor:themes.theme.color,top:animatedPosition}]}> 
      
        <Pressable onPress={heightDecreeseAndIncrees} style={{backgroundColor:Colors.mainColor,padding:2,borderRadius:20,height:30,width:30,justifyContent:'center',alignItems:'center',position:'absolute',top:4,left:20,outlineWidth:2,outlineColor:'#fff',zIndex:100}}>
          <MaterialIcons size={20} color='#fff' name={`arrow-${isUp ? "upward":"downward"}`} />
        </Pressable> 
          <TextInput onChangeText={(text)=>setCustomerName(text)} value={customerName} placeholderTextColor={themes.theme.color} placeholder="Enter The Parti Name" style={{color:themes.theme.color,alignSelf:'center',width:200,borderColor:themes.theme.color,borderBottomWidth:1,paddingHorizontal:6,paddingVertical:0,marginTop:5}} />
        <ScrollContainer style={{gap:4}}  > 
         
          {
            SaleProductItems&&
            SaleProductItems?.map((items,index)=>{
              return(<SaleProductList setSaleProductItems={setSaleProductItems} QuantityDecreese={QuantityDecreese} QuantityIncreese={QuantityIncreese} key={index} items={items}/>)
            })
          }
          
        </ScrollContainer>
       <Animated.View style={{backgroundColor:themes.theme.backgroundTheme,paddingBottom:10,paddingBottom:animatedSold}}>
        <View style={{flexDirection:'row',justifyContent:'space-between',width:'100%',paddingHorizontal:12}}>
          <Text style={{color:themes.theme.color}}>Grand Total
          </Text> 
          <Text style={{color:themes.theme.color}}>{Currancy(TotalProductPrice)}</Text>
        </View>
        <Pressable onPress={SaleHandler} style={{alignSelf:'center',backgroundColor:Colors.mainColor,outlineWidth:2,outlineColor:themes.theme.color,paddingHorizontal:12,paddingVertical:4,borderRadius:8}}>
          <Text style={{color:themes.theme.color}} >Genrate Bill/Reciepent</Text>
        </Pressable>
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