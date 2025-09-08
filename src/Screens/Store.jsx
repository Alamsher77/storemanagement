import {
  View,
  Text,
  Pressable,
  ScrollView
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
import Toast from 'react-native-toast-message'
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
       fetchData()
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
    fetchData()
    Toast.show({type:'success',text1:'Product Updated'})
   } catch (e) {
     alert(e.message)
   }
 }
 
 const [activeCategoryButton,setActiveCategoryButton] = useState(null)
 
 if(dataloading) return
const filterProductWithCategoryOrStock = itemsRecords.filter((items)=>{
 return activeCategoryButton ? activeCategoryButton == items?.category.toUpperCase()  : items
}).sort((a,b)=> a.stock - b.stock)
 
  return (
    <>
    <DragableModel
      setOpenDragableModel={setOpenDragableModel}
      openDragableModel={openDragableModel}
      minHeight={300}
      >
    <ProductItemsForm lable={!productEdit ? 'Create':'Update'} setItemsData={setItemsData} itemsData={itemsData} submitHandler={!productEdit ? createItemsHanderl : editHandler} fetchData={fetchData} setOpenDragableModel={setOpenDragableModel} />
    </DragableModel>
    <ScrollContainer style={{paddingBottom:45,gap:4,}}>
    <View>
      <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} contentContainerStyle={{flexDirection:'row',gap:6,}}>
       <Pressable onPress={()=>setActiveCategoryButton(null)} style={{paddingHorizontal:20,backgroundColor:activeCategoryButton == null ? Colors.mainColor : themes.theme.backgroundTheme,paddingVertical:5,borderRadius:6,borderWidth:1,borderColor: activeCategoryButton == null   ?  Colors.mainColor : themes.theme.color}}  >
              <Text style={{fontWeight:'600',color:activeCategoryButton == null ? '#fff': Colors.mainColor}}>ALL</Text>
             </Pressable>
    
        { 
          productCategory?.map((items,index)=>{
            return(
             <Pressable onPress={()=>setActiveCategoryButton(items)} style={{paddingHorizontal:20,backgroundColor:activeCategoryButton == items ? Colors.mainColor : themes.theme.backgroundTheme,paddingVertical:5,borderRadius:6,borderWidth:1,borderColor: activeCategoryButton == items   ?  Colors.mainColor : themes.theme.color}} key={index}>
              <Text style={{fontWeight:'600',color:activeCategoryButton == items ? '#fff': Colors.mainColor}}>{items}</Text>
             </Pressable>
            )
          })
        }
      </ScrollView>
      </View>
     <View style={{gap:6}}>
     { 
      filterProductWithCategoryOrStock?.length == 0 ?
      <Text>No Records</Text>
      :
       filterProductWithCategoryOrStock?.map((items,index)=>{
         return (
         <ProductItemsList editHandler={editHandler} deleteHandler={deleteHandler} key={index} items={items}  />
       )
       })
     }
     </View>
    </ScrollContainer>
    <View style={ { position: 'absolute',
      bottom: 5,
      left:'50%',transform:[{translateX:'-50%'}] }}><Pressable onPress={()=> setOpenDragableModel(true)} style={{backgroundColor:'#4DBF0F',paddingHorizontal:12,paddingVertical:6,borderRadius:6}}><Text style={{color:'#fff',fontWeight:'800',fontSize:16}}>Create New Items</Text></Pressable>
    </View>< />
  )
}