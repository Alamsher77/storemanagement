import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native'
import React, {
  useEffect,
  useState,
  useContext,
} from 'react'
import Svg, {
  Line,
  Path
} from 'react-native-svg'
import {
  initFile,
  readData,
  addItem,
  deleteItem,
  updateItem,
} from '../Storage/jsonStorage'
import Colors from '../Colors'
import DragableModel from '../component/DragableModel'
import {
  requestPermissionsAsync,
  getContactsAsync,
  Fields
} from 'expo-contacts'
import ProductItemsForm from '../component/ProductItemsForm'
import ScrollContainer from '../component/ScrollContainer' 
import BoxContainer from '../component/BoxContainer'
import ProductItemsList from '../component/ProductItemsLIst'
import Conformation from '../component/Conformation'
import {ProductContext} from '../Context/Contextcontent'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Toast from 'react-native-toast-message'
import DateAndTime from '../dateAndTime'
import Currancy from '../Currancy'
export default function Store() { 
  
  const {themes,fetchData,itemsRecords,dataloading,productCategory} = useContext(ProductContext)
  const [openDragableModel,setOpenDragableModel] = useState(false) 
 
   const [itemsData,setItemsData] = useState({
    name:'',
    stock:'',
    units:'',
    salePrice:'',
    purchasePrice:'',
    selectSize:'',
    size:'',
    category:''
  })
// create Product items of new 
  const createItemsHanderl = async()=>{
    try {  
    const data = await addItem(itemsData)  
    if(data?.message){
      Toast.show({type:'error',text1:data?.message})
      return false
    }
    Toast.show({type:'success',text1:'Product Created Success !!'})
    setOpenDragableModel(false)
    fetchData()
    } catch (e) {
      alert(e.message)
    }
  } 
  const [productEdit,setProductEdit] = useState(null)
 const deleteHandler = async(id)=>{
   try {
  const conform = await Conformation('⚠️','Are You Delete This Items');
  if(!conform) return 
  await deleteItem(id);
  fetchData();  
  Toast.show({type:'success',text1:'Product Deteled !!'})
   } catch (e) {
     alert(e.message)
   }
 }
 const editHandler = async(id)=>{
   try { 
   
    if (!productEdit) {
    const findbyidrecords = itemsRecords?.find((items)=> { return items?.id == id})
    setItemsData({...findbyidrecords})
       setProductEdit(id) 
      setOpenDragableModel(true)
      return false
    }
   await updateItem(productEdit,itemsData)
   setItemsData({
    name:'',
    stock:'',
    units:'',
    salePrice:'',
    purchasePrice:'',
    selectSize:'',
    size:'',
    category:''
  }) 
     setProductEdit(null)
     setOpenDragableModel(false) 
  
    Toast.show({type:'success',text1:'Product Updated'})
     fetchData()
   } catch (e) {
     console.log(e)
     alert(e.message)
   }
 }
 
 const [activeCategoryButton,setActiveCategoryButton] = useState(null)
 

const filterProductWithCategoryOrStock = itemsRecords.filter((items)=>{
 return activeCategoryButton ? activeCategoryButton == items?.category.toUpperCase()  : items
}).sort((a,b)=> a.stock - b.stock)
  const [searchProduct,setSearchProduct] = useState(null)
 const [searchText,setSearchText] = useState('')
  const searchHandler = (text)=>{
    setSearchText(text)
    const filterseachitems = text.length === 0 ? null : itemsRecords.filter((items)=>{
       
      return  text.length === 0 ? false : (items.name.toLowerCase().includes(text.toLowerCase()) || items.category.toLowerCase().includes(text.toLowerCase()) || items.size.toLowerCase().includes(text.toLowerCase()) || items.salePrice.toLowerCase().includes(text.toLowerCase()) )
    }) 
    setSearchProduct(filterseachitems)
   
  }
  

  return (
    <View style={{backgroundColor:themes.theme.backgroundTheme,position:'relative',flex:1,paddingBottom:90}}>
    <DragableModel
      setOpenDragableModel={setOpenDragableModel}
      openDragableModel={openDragableModel}
      minHeight={300}
      >
    <ProductItemsForm lable={!productEdit ? 'Create':'Update'} setItemsData={setItemsData} itemsData={itemsData} submitHandler={!productEdit ? createItemsHanderl : editHandler} fetchData={fetchData} setOpenDragableModel={setOpenDragableModel} />
    </DragableModel>
     
      {/*start search model  */} 
     
     <View style={{height:40,borderWidth:0.3,borderColor:'#fff',width:'100%',position:'relative',backgroundColor:Colors.mainColor,alignSelf:"center",marginBottom:10,paddingHorizontal:10,}}>
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
    
    {/* end of searchProduct model */}
    {/* start of list of category mocell */}
    {
    !searchProduct && 
     <View style={{flexDirection:'row',gap:4}}>  
       <Pressable onPress={()=>setActiveCategoryButton(null)} style={{paddingHorizontal:20,backgroundColor:activeCategoryButton == null ? Colors.mainColor : themes.theme.backgroundTheme,paddingVertical:5,borderRadius:6,borderWidth:1,borderColor: activeCategoryButton == null   ?  Colors.mainColor : themes.theme.color,}}  >
              <Text style={{fontWeight:'600',color:activeCategoryButton == null ? '#fff': Colors.mainColor}}>ALL</Text>
             </Pressable> 
     
     <FlatList 
        data={productCategory}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index}
        renderItem={({item})=>{ 
        return(
         <Pressable onPress={()=>setActiveCategoryButton(item)} style={{paddingHorizontal:20,backgroundColor:activeCategoryButton == item ? Colors.mainColor : themes.theme.backgroundTheme,paddingVertical:5,borderRadius:6,borderWidth:1,borderColor: activeCategoryButton == item   ?  Colors.mainColor : themes.theme.color}} >
              <Text style={{fontWeight:'600',color:activeCategoryButton == item ? '#fff': Colors.mainColor}}>{item}</Text>
             </Pressable>
        )}} 
        contentContainerStyle={{gap:4}}
     /> 
     </View>
    }
     {/* end of list of category mocell */}
     
     <View style={{gap:6,marginTop:20}}>
     { 
     searchProduct ? 
     
      searchProduct?.length == 0 ?
      <Text style={{color:themes.theme.color}}>No Records</Text>
      :
        <FlatList 
        data={searchProduct}
        vertical
        showsHorizontalScrollIndicator={false}
        renderItem={({item})=>{ 
        return (
        <ProductItemsList editHandler={editHandler} deleteHandler={deleteHandler}  items={item}  />
      )}}
        contentContainerStyle={{gap:4}}
        keyExtractor={(item, index) => index.toString()}
        initialNumToRender={10}   // pehle sirf 10 render kare
        maxToRenderPerBatch={10}  // ek batch me 10 hi render kare
        windowSize={5}            // sirf 5
        />
       
       
       :
       
      filterProductWithCategoryOrStock?.length == 0 ?
      <Text style={{color:themes.theme.color}}>No Records</Text>
      :
     
         <FlatList 
        data={filterProductWithCategoryOrStock}
        vertical
        showsHorizontalScrollIndicator={false}
        renderItem={({item})=>{ 
        return (
        <ProductItemsList editHandler={editHandler} deleteHandler={deleteHandler}  items={item}  />
      )}}
         contentContainerStyle={{gap:4}}
         keyExtractor={(item, index) => index.toString()}
        initialNumToRender={10}
          windowSize={5}
          removeClippedSubviews={true}

        />
      
     }
     </View> 
    <View style={ { position: 'absolute',
      bottom: 5,
      left:'50%',transform:[{translateX:'-50%'}] }}><Pressable onPress={()=> setOpenDragableModel(true)} style={{backgroundColor:'#4DBF0F',paddingHorizontal:12,paddingVertical:6,borderRadius:6}}><Text style={{color:'#fff',fontWeight:'800',fontSize:16}}>Create New Items</Text></Pressable>
    </View>
    </View>
  )
}