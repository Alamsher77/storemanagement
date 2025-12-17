import { View, Text,useColorScheme,StyleSheet,Pressable,TextInput,Dimensions,Animated,FlatList,Switch,Button,TouchableOpacity,StatusBar} from 'react-native'
import React,{useState,useRef,useContext,useEffect} from 'react'
import ScrollContainer from '../../component/ScrollContainer'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Colors from '../../Colors'
import Currancy from '../../Currancy'
import {ProductList,SaleProductList,CustomerBillRecords} from '../../component/saleAndProductList'
import {ProductContext} from '../../Context/Contextcontent'
import Toast from 'react-native-toast-message'
import DateAndTime from '../../dateAndTime'
import Conformation from '../../component/Conformation'
import { useNavigation,useRoute } from '@react-navigation/native';
import {addItemSale,readData,writeData,updateItemSale} from '../../Storage/jsonStorage'
import {dbConnection,addSale} from '../../Storage/Database'
import DateTimePicker from '@react-native-community/datetimepicker';
import DateFormate from '../../dateFormate'
 import {useSelector,useDispatch } from "react-redux";
 import {createSaleData,editSale} from '../../redux/saleSlice'
 import AsyncStorage from '@react-native-async-storage/async-storage';
const {height:ScreenHeight} = Dimensions.get('window')
export default function TotalSold({navigation}) {
  const dispatch = useDispatch()
   const route = useRoute();
    const prodId = route.params;
  const navigations = useNavigation()
  const {products:itemsRecords} = useSelector((state)=> state.product)
  const {sale:SaleRecords} = useSelector((state)=> state.sale)
  const {themes,fetchData} = useContext(ProductContext) 
   const [searchProduct,setSearchProduct] = useState(null)
  const [searchText,setSearchText] = useState('')
  const [isUp,setIsUp] = useState(false)
   const animatedPosition = useRef(new Animated.Value(ScreenHeight)).current;
   const animatedSold = useRef(new Animated.Value(ScreenHeight)).current;
   
 
   const heightDecreeseAndIncreesAndHide = (props)=>{
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
      toValue: isUp  ? 0 : ScreenHeight * 0.7, // agar upar hai to neeche, agar neeche hai to upar
      duration: 500,
      useNativeDriver: false, // top property ke liye false
    }).start();
     Animated.timing(animatedSold, {
      toValue: isUp ? 20 : ScreenHeight * 0.72, // agar upar hai to neeche, agar neeche hai to upar
      duration: 500,
      useNativeDriver: false, // top property ke liye false
    }).start(); 
    setIsUp(!isUp); // state toggle
  }
  // yadi sale ko edit kre to 
   useEffect(()=>{
     if (prodId) {
     heightDecreeseAndIncrees()
     }
   },[prodId])
  // search product and filter
 const [filterbyquery,setfilterbyquery] = useState(null)
 
// filter swithc 
const [filterSwitch,setFilterSwitch] = useState(false)

// searchHandler for products 
  const searchHandler = (text)=>{
    setSearchText(text)
    const filterseachitems = text.length === 0 ? null : itemsRecords.filter((items)=>{  
      return  text.length === 0 ? false : (items.name.toLowerCase().includes(text.toLowerCase()) || items.category.toLowerCase().includes(text.toLowerCase()) || items.size.toLowerCase().includes(text.toLowerCase()) || items.salePrice.toString().toLowerCase().includes(text.toLowerCase())) && items.stock > 0
    }) 
    setSearchProduct(filterseachitems)
   
  // using query by = sale product filter
    const findThequery = text.split('=')[1]
   if (text.includes('=')) {
    if (SaleRecords.filter(saleitem => (saleitem.date.includes(findThequery.trim())))) {
    
    const filterSaleRecordsByDate = SaleRecords.filter((itemsDate) => {
      const matchquery = itemsDate?.date.toLowerCase().includes(findThequery.toLowerCase()) || itemsDate?.customerName.toLowerCase().includes(findThequery.toLowerCase())
      
      if (filterSwitch) {
        const receiveDuesAmount = itemsDate?.dues && itemsDate?.dues?.dues ? itemsDate?.dues?.duesAmount?.reduce((prev,next)=>{return prev + Number(next?.duesAmount)},0) : null
        const TotalDuesAmount = receiveDuesAmount &&  itemsDate?.totalAmount - receiveDuesAmount
        console.log(TotalDuesAmount)
        return matchquery && (itemsDate?.dues?.dues && TotalDuesAmount > 0)
      }
      return matchquery
    }
      )
     setfilterbyquery(filterSaleRecordsByDate)
    
    
    }
   }else{
      setfilterbyquery(null)
    }
  }
  
  // quantity increese and decreese 
  const [SaleProductItems,setSaleProductItems] = useState(prodId ? prodId?.products : [])
  
  // QuantityIncreese
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

   if (SaleProductItems.length >= 0 && !isUp) {
     heightDecreeseAndIncreesAndHide()
   }
  }
  
  // QuantityDecreese
  const QuantityDecreese = async (itemsData)=>{
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
  if (SaleProductItems.length <= 0 && isUp) {
    heightDecreeseAndIncreesAndHide()  
  }
  if(SaleProductItems?.length <= 1){
      await AsyncStorage.removeItem('saleWithoutFinish')
  }
  } 
  
  // QuantityChangest
  const QuantityChangest = (textValue,itemsData)=>{ 
      setSaleProductItems((prev) => {
  // Check if item already exists
  const exists = prev.find((p) => p.id === itemsData.id);
  if(!exists) return prev 
  return prev.map((p) =>
        p.id === itemsData.id ? { ...p, quantity:Number(textValue) } : p
      ); 
}); 
  // if (SaleProductItems.length <= 0 && isUp) {
  //   heightDecreeseAndIncreesAndHide()
  // }
  } 
  
  // TotalProductPrice
  const TotalProductPrice = SaleProductItems?.reduce((prev,next)=>{
    return prev + Number(next.salePrice) * Number(next.quantity)
  },0)
  
  // TotalProductIncome
  const TotalProductIncome = SaleProductItems?.reduce((prev,next)=>{
    return prev + (Number(next.salePrice) - Number(next.purchasePrice)) * Number(next.quantity)
  },0)
  
  // TotalPurchasePrice
  const TotalPurchasePrice = SaleProductItems?.reduce((prev,next)=>{
    return prev +  Number(next.purchasePrice) * Number(next.quantity)
  },0) 

// configur sale for dues 
 const [reciveAmount,setReciveAmount] = useState(prodId && prodId ? prodId?.totalAmount : null)
 const [grandTotalProductPrice,setGrandTotalProductPrice] = useState(0)
 const [grandTotalProductIncome,setGrandTotalProductIncome] = useState(0)

const reciverAmountHandeler = (amountRecive)=>{ 
  setReciveAmount(amountRecive)
  setGrandTotalProductPrice(TotalProductPrice - (TotalProductPrice - amountRecive))
  setGrandTotalProductIncome(amountRecive - TotalPurchasePrice)
}
  // due swithch 
 const [isEnabled, setIsEnabled] = useState(prodId ? prodId?.dues?.dues : false);

 const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
const [duesAmount,setDuesAmount] = useState(null)
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };
  // show in the dues formate date
   
  const [dues,setDues] = useState({
    dues:isEnabled,
    duesAmount:prodId && prodId?.dues?.duesAmount ? prodId?.dues?.duesAmount : []
  })
  const toggleSwitch = () => {
    setDues((prev)=>({...prev,dues:!isEnabled}))
    setIsEnabled(previousState => !previousState)
  }; 
  
  const duesHandler = async ()=>{
    try {
       const status = await Conformation('Dues Added','Are you sure you want to add dues !!')
    if (status) {
  setDues((prevDues)=>({...prevDues,dues:isEnabled,duesAmount:[...prevDues.duesAmount,{duesDate:date,duesAmount}]}))  
    }
    } catch (e) {
      console.log(e.message)
    }
   
  }
  
  // create sale data 
  const [customerName,setCustomerName] = useState(prodId ? prodId?.customerName : null)
  
  
  const getDateAndTime = DateAndTime() 
  const SaleHandler = async()=>{
    try {
      if (!reciveAmount && reciveAmount.trim() == '') {
        return Toast.show({type:'error',text1:'Please enter the receive amount !!'})
      }
     if (isEnabled && dues.duesAmount.length == 0) {
        return Toast.show({type:'error',text1:'Please Enter The Dues amount !!'})
     }
     const status = await Conformation('🧾','Are you sure genrate this bill !!')
      if (!status) return 
      const saleDetails = {customerName:customerName && customerName.trim(),products:SaleProductItems,...getDateAndTime,totalAmount:grandTotalProductPrice,totalIncome:grandTotalProductIncome,totalProductPrice:TotalProductPrice,dues} 
  const createdSale = await addSale(saleDetails)
  // const customerDetails = await addItemSale(saleDetails)
   
  if (!createdSale.success){
      Toast.show({type:'error',text1:createdSale.message})
      return false
  }  
    // decrese the Product stock quantity
    
    const updatedata = SaleProductItems?.map((items)=>{
    
  const find = itemsRecords.find((p)=> p.id === items.id) 
  if (find) {
    return {
      ...items,
      stock:Number(find.stock) - Number(items.quantity) < 0 ? 0 : Number(find.stock)- Number(items.quantity)
    }
  }
  return items
    })
  
const db = await dbConnection();
for (const singleOfSale of updatedata) { 
  await db.runAsync(
  `UPDATE products SET
    stock = ?
  WHERE id = ?`,
  [
    singleOfSale.stock,
    singleOfSale.id
  ]
);
} 
  setSaleProductItems([])
  setCustomerName('')
    await AsyncStorage.removeItem('saleWithoutFinish')
  navigations.navigate('Bill',{saleBill:{...saleDetails,invoice:Number(SaleRecords?.length +1 )}})
  dispatch(createSaleData(createdSale.data))
  Toast.show({type:'success',text1:createdSale.message})
    } catch (e) { 
     Toast.show({type:'error',text1:e.message})
    }
   
  } 
  const EditSaleHandler = async()=>{
    try {
      /* code */ 
      const status = await Conformation('🧾','Are you sure Edit this bill !!')
      if (!status) return  
      const updateEsistingRecords = {...prodId,products:SaleProductItems,customerName,totalIncome:grandTotalProductIncome,updateAt:getDateAndTime,totalAmount:grandTotalProductPrice,dues,totalProductPrice:TotalProductPrice,}
   const productsJson = await JSON.stringify(updateEsistingRecords.products)
   const duesJson = await JSON.stringify(updateEsistingRecords.dues)
   const updateAtJson = await JSON.stringify(updateEsistingRecords.updateAt)
   
    const db = await dbConnection(); 
    await db.runAsync(
  `UPDATE product_sale SET
    customerName = ?, products = ?, date = ?, time = ?, dues = ?,
    totalAmount = ?, totalIncome = ?, totalProductPrice = ?, updateAt = ?
  WHERE id = ?`,
  [
    updateEsistingRecords.customerName,
    productsJson,
    updateEsistingRecords.date,
    updateEsistingRecords.time,
    duesJson, 
    updateEsistingRecords.totalAmount,
    updateEsistingRecords.totalIncome,
    updateEsistingRecords.totalProductPrice,
    updateAtJson,
    updateEsistingRecords.id
  ]
);
      const cleanRecord = {
        ...updateEsistingRecords,
        dues: {
          ...updateEsistingRecords.dues,
          duesAmount: updateEsistingRecords.dues.duesAmount.map(d => ({
            ...d,
            duesDate:
              typeof d.duesDate === 'string'
                ? d.duesDate
                : d.duesDate.toISOString(),
          })),
        },
      };
      
      dispatch(editSale(cleanRecord));
      Toast.show({type:'success',text1:"Existing Sale updated !!"})
    setTimeout(() => {
      navigation.goBack(); 
      // Page1 will auto-refresh using useFocusEffect
      }, 200);
    } catch (e) { 
      console.log(e)
     Toast.show({type:'error',text1:e.message})
    }
   
  } 
  
  const TotalSaleAmount = filterbyquery ? filterbyquery.reduce((prev,next) => prev + Number(next.totalAmount),0) : SaleRecords.reduce((prev,next) => prev + Number(next.totalAmount),0)
  let totalDuesAmoutOfSale = 0
  if (filterbyquery) {
    for(const singleRecordOfSale of filterbyquery){
   const totaldues = singleRecordOfSale?.dues && singleRecordOfSale?.dues.dues ? singleRecordOfSale?.dues.duesAmount.reduce((prev,next)=> prev + Number(next?.duesAmount),0): 0
// totalDuesAmoutOfSale = totalDuesAmoutOfSale + totaldues
totalDuesAmoutOfSale += totaldues > 0 ? Number(singleRecordOfSale.totalAmount) - totaldues : 0
 }
  }else{
    for(const singleRecordOfSale of SaleRecords){
   const totaldues = singleRecordOfSale?.dues && singleRecordOfSale?.dues.dues ? singleRecordOfSale?.dues.duesAmount.reduce((prev,next)=> prev + Number(next?.duesAmount),0): 0
// totalDuesAmoutOfSale = totalDuesAmoutOfSale + totaldues
totalDuesAmoutOfSale += totaldues > 0 ? Number(singleRecordOfSale.totalAmount) - totaldues : 0
 }
  }
  // const receiveDuesAmount = bill?.dues && bill?.dues?.dues ? bill?.dues?.duesAmount?.reduce((prev,next)=>{return prev + Number(next?.duesAmount)},0) : null
  // this handler use to update sale records to reciver amount changest handeler
  const [filterSaleLimitRecords,setFilterSaleLimitRecords] = useState([])
  useEffect(()=>{
  const productFilter = async ()=>{
    const db = await dbConnection();
    const results = await db.getAllAsync("SELECT * FROM product_sale ORDER BY id DESC LIMIT 100 ;")
    
      const  someSaleDataToParse = results.map((saleItems)=>{
    const parseDues = JSON.parse(saleItems.dues)
    const parseProducts = JSON.parse(saleItems.products)
    const updateAtJson =  JSON.parse(saleItems.updateAt)
    return {...saleItems,dues:parseDues,products:parseProducts,updateAt:updateAtJson}
  }) 
    setFilterSaleLimitRecords(someSaleDataToParse) 
  }
  productFilter()
},[filterbyquery])
  useEffect(()=>{
    if (prodId) { 
    reciverAmountHandeler(String(prodId?.totalAmount)) 
    }
  },[])
   
  
  // store sale history if not created finish 
  
  useEffect(()=>{
    
    const storeCreateSaleWithoutFinish = async ()=>{
      try {
        if (!prodId && SaleProductItems.length > 0 ) { 
       await AsyncStorage.setItem('saleWithoutFinish', JSON.stringify([...SaleProductItems]));  
      // await AsyncStorage.removeItem('saleWithoutFinish')
        }
        const getUserData = JSON.parse( await AsyncStorage.getItem('saleWithoutFinish'));
        
         if (!prodId && getUserData  && !isUp) {
          setSaleProductItems([...getUserData]) 
          heightDecreeseAndIncreesAndHide('hide')
         }
      } catch (e) {
        Toast.show({type:'error',text1:e.message})
        console.log(e.message)
      }
    }
    storeCreateSaleWithoutFinish()
  },[customerName])
if (!themes) return null;
  return (
    <> 
    <StatusBar
  translucent={false}
  backgroundColor={Colors.mainColor}
  barStyle={'light-content'}
/>
     <View style={{borderBottomWidth:0.6,borderColor:themes.theme.color}}>
     <View style={styles.header}>
      <Pressable onPress={()=>navigation.goBack()}>
        <FontAwesome6 size={20} color={"#fff"} name="arrow-left" />
      </Pressable>
        <View style={{height:40,borderWidth:0.3,borderColor:'#fff',width:320,borderRadius:12,position:'relative'}}>
        <TextInput value={searchText} onChangeText={(text)=>searchHandler(text)}  placeholderTextColor="#fff" placeholder="Search Product By name/size" style={{paddingRight:67,paddingLeft:10,color:'#fff'}} />
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
       {
         filterbyquery &&
         <View style={{flexDirection:'row',backgroundColor:Colors.mainColor,alignItems:'center',paddingHorizontal:20}}>
         <Text style={{color:themes.theme.color,}}>Filter by Dues</Text>
             <Switch
             style={{paddingHorizontal:0,paddingVertical:0}}
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={filterSwitch ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={()=>{
            setFilterSwitch(!filterSwitch) 
          }}
          value={filterSwitch}
        />
        </View>
       }
      </View> 
    <View style={{backgroundColor:themes.theme.backgroundTheme,position:'relative',flex:1,paddingHorizontal:8}}>
     
     
         {
            searchProduct && !filterbyquery ?
            searchProduct.length == 0 ?
             <Text style={{color:themes.theme.color}}>No Records</Text>
            :
              <FlatList 
        data={searchProduct}
        vertical
        showsVerticalScrollIndicator={false}
        renderItem={({item})=>{ 
        const quantitydata = SaleProductItems?.find((p)=>  p.id == item.id) 
              return(<ProductList quantitydata={quantitydata} QuantityDecreese={QuantityDecreese} QuantityIncreese={QuantityIncreese} items={item} />)
        }} 
         contentContainerStyle={{gap:4,paddingBottom:180}}
         keyExtractor={(item, index) => index.toString()}
        initialNumToRender={10}
          windowSize={5}
          removeClippedSubviews={true}
     /> 
        
            :
            filterSaleLimitRecords &&
        <>
        <View style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:10,paddingVertical:4}}>
      <Text style={{color:themes.theme.color,fontSize:12}}>Total Sale : {filterbyquery ? filterbyquery.length :SaleRecords.length}</Text>
         <Text style={{color:themes.theme.color,fontSize:12}}>Total Sale Amount : {Currancy(filterSwitch ? totalDuesAmoutOfSale :TotalSaleAmount)}</Text>
        </View>
               <FlatList 
        data={filterbyquery  ? filterbyquery : filterSaleLimitRecords}
        vertical
        showsVerticalScrollIndicator={false}
        renderItem={({item,index})=>(
        <CustomerBillRecords  items={item} index={index}/>)} 
         contentContainerStyle={{gap:4,paddingBottom:160}}
         keyExtractor={(item, index) => index.toString()}
        initialNumToRender={10}
          windowSize={5}
          removeClippedSubviews={true}
      /> 
          </>
          }

      {/* this component for create bill model */}
      
      <Animated.View  style={[styles.billModel,{backgroundColor:themes.theme.backgroundTheme,borderColor:themes.theme.color,top:animatedPosition}]}> 
      
      
      <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
        <Pressable onPress={heightDecreeseAndIncrees} style={{backgroundColor:Colors.mainColor,padding:2,borderRadius:20,height:30,width:30,justifyContent:'center',alignItems:'center',outlineWidth:2,outlineColor:'#fff',zIndex:100}}>
          <MaterialIcons size={20} color='#fff' name={`arrow-${isUp ? "upward":"downward"}`} />
          
         
        </Pressable> 
        <View style={{justifyContent:'center',alignItems:'center'}}>
         <Text style={{color:themes.theme.color,fontSize:10,opacity:0.8}}>T.O.L</Text>
         <Text style={{color:themes.theme.color,fontSize:12,opacity:0.7}}>{SaleProductItems?.length}</Text>
        </View>
          <TextInput onChangeText={(text)=>setCustomerName(text)} value={customerName} placeholderTextColor={themes.theme.color} placeholder="Enter The Parti Name" style={{color:themes.theme.color,alignSelf:'center',width:200,borderColor:themes.theme.color,borderBottomWidth:1,paddingHorizontal:6,paddingVertical:0,marginTop:5}} />
          <View style={{flexDirection:'row',alignItems:'center',}}>
          <Text style={{color:themes.theme.color,}}>Dues</Text>
             <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
        </View>
        </View>
        <ScrollContainer style={{gap:4}}  >
        <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
        <Text style={{color:themes.theme.color,}}>Enter the recive amount </Text>
         <TextInput value={reciveAmount} onChangeText={reciverAmountHandeler} style={{paddingHorizontal:4,paddingVertical:2,color:themes.theme.color,borderColor:themes.theme.color,borderBottomWidth:0.2,width:150}} keyboardType="numeric" placeholderTextColor={themes.theme.color} placeholder="Recive Amount"  />
         </View>
        {/* dues component */}
         {
           isEnabled &&
           <View style={{flexDirection:'row',gap:6}}>
            <Pressable style={{borderWidth:0.4,borderColor:themes.theme.color,paddingHorizontal:6,paddingVertical:4,flexDirection:"row",gap:6}} onPress={()=> setShow(true)}>
             <Text style={{color:themes.theme.color,}}>{date ? DateFormate(date): 'Select Date'}</Text>
              <FontAwesome color={themes.theme.color}   size={20} name="angle-down"/>
            </Pressable>
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
            <TextInput value={duesAmount} onChangeText={(text)=>setDuesAmount(text)} style={{paddingHorizontal:4,paddingVertical:2,color:themes.theme.color,borderColor:themes.theme.color,borderBottomWidth:0.2,width:150}} keyboardType="numeric" placeholderTextColor={themes.theme.color} placeholder="Dues Amount"  />
            
            <TouchableOpacity onPress={duesHandler} style={{borderWidth:0.4,borderColor:themes.theme.color,paddingHorizontal:12,paddingVertical:4,}}>
             <Text style={{color:themes.theme.color,}}>Add</Text>
            </TouchableOpacity>
            </View>
          
         }
         
         {
           dues?.dues &&
           dues.duesAmount?.map((items,index)=>{
             return(
             <View key={index} style={{flexDirection:'row',justifyContent:'space-between'}}>
              <Text style={{color:themes.theme.color,}}>{Currancy(items.duesAmount)}</Text>
              <Text style={{color:themes.theme.color,}}>{DateFormate(items.duesDate)}</Text>
              <Pressable style={{borderWidth:0.5,borderColor:themes.theme.color,paddingHorizontal:6,paddingVertical:4}} onPress={async()=>{
                const status = await Conformation('DELETED DUES','Are you delete dues')
                if (status) {
                setDues((prev)=>({...prev,duesAmount:prev.duesAmount.filter((_,filindex)=>filindex !== index)})) 
                } 
              }}>
               <Text style={{color:themes.theme.color,}}>Delete</Text>
              </Pressable>
             </View>
             )
           })
         }
          {
         
            SaleProductItems&&
            SaleProductItems?.map((items,index)=>{
              return(<SaleProductList setSaleProductItems={setSaleProductItems} 
              QuantityDecreese={QuantityDecreese}
              QuantityChangest={QuantityChangest}
              QuantityIncreese={QuantityIncreese} key={index} items={items}/>)
            })
          }
          
        </ScrollContainer>
       <Animated.View style={{backgroundColor:themes.theme.backgroundTheme,paddingBottom:10,paddingBottom:animatedSold}}>
        <View style={{flexDirection:'row',justifyContent:'space-between',width:'100%',paddingHorizontal:12}}>
          <Text style={{color:themes.theme.color}}>Total Amount
          </Text> 
          <Text style={{color:themes.theme.color}}>{Currancy(TotalProductPrice)}</Text>
        </View>
         
        <View style={{flexDirection:'row',justifyContent:'space-between',width:'100%',paddingHorizontal:12}}>
          <Text style={{color:themes.theme.color}}>Grand Total
          </Text> 
          <Text style={{color:themes.theme.color}}>{Currancy(reciveAmount == '' ? TotalProductPrice : grandTotalProductPrice)}</Text>
        </View>
        <Pressable onPress={prodId ? EditSaleHandler : SaleHandler} style={{alignSelf:'center',backgroundColor:Colors.mainColor,outlineWidth:2,outlineColor:"#999",paddingHorizontal:12,paddingVertical:4,borderRadius:8}}>
          <Text style={{color:"#fff"}} >{prodId ? "Sale Update" : "Genrate Bill/Reciepent"}</Text>
        </Pressable>
         </Animated.View>
      </Animated.View>
    </View>
    </>
  )
}

const styles = StyleSheet.create({ 
  header:{
    width:'100%',
    paddingVertical:4,
    alignItems:'center', 
    backgroundColor:Colors.mainColor,
    paddingHorizontal:8,
    flexDirection:'row',
    justifyContent:'space-between',paddingRight:20
  },
  billModel:{
    position:'absolute',
    width:'100%',
    height:'100%', 
    borderTopWidth:0.5,
    left:8,
  }, 
})