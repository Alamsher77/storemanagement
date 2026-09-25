import { View, Text, Image, Modal, TouchableOpacity, Alert,useAnimatedValue,Dimensions,Animated,StyleSheet,PanResponder,ActivityIndicator} from 'react-native'
import React, { useState,useContext,useRef,useEffect,useMemo } from 'react'
import Fontisto from 'react-native-vector-icons/Fontisto';
import Colors from '../Colors';
import ScrollContainer from '../component/ScrollContainer';
import ModelContainer from '../component/ModelContainer';
import DragableModel from '../component/DragableModel';
import ProductModelData from '../component/ProductModelData';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as DocumentPicker from "expo-document-picker";
import { useNavigation } from '@react-navigation/native';
import {ProductContext} from '../Context/Contextcontent'
 const { height: ScreenHeight } = Dimensions.get('window')
 import MonthlyIncome from './Home/MonthlyIncome'
 import Currancy from '../Currancy'
 import MainScreenCharts from './Home/mainScreenCharts'
 import {useSelector } from "react-redux";
export default function MainPage() {
 const {products:itemsRecords,produtCategry:productCategory} = useSelector((state)=>state.product)  
 const {sale:SaleRecords,monthlySaleData,todayIncome} = useSelector((state)=>state.sale)  
  const {themes,localUserData} = useContext(ProductContext) 
  const router = useNavigation(); 
  const [openDragableModel, setOpenDragableModel] = useState(false) 
  
   const TotalSaleIncome = useMemo(()=>{
     return  SaleRecords?.reduce((prev,next)=> prev + Number(next?.totalIncome),0)
   },[SaleRecords])
   
  
   
   const [showPoupup, setShowpopup] = useState(true)
 const [loading,setLoading] = useState(false)
 const [selectFileData,setSelectFileData] = useState(null)
 
if (!themes) return null;
  return (
      <>
      <DragableModel minHeight={300} openDragableModel={openDragableModel} setOpenDragableModel={setOpenDragableModel} > 
         
      </DragableModel>
      {/* Heder Styles */}
      <View style={{ elevation: 5, flexDirection: "row", justifyContent: 'space-between', width: '100%', backgroundColor:themes.theme.backgroundTheme, alignItems: 'center', paddingHorizontal: 15,paddingVertical:4,paddingTop:40}}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Image style={{ width: 45, height: 45, resizeMode: 'cover' }} source={require('../assetes/logo.png')} />
          <View >
            <Text style={{ color:themes.theme.color }}>Welcome Back!</Text>
            <Text style={{ fontWeight: '700', fontSize: 18,color:themes.theme.color }}>{localUserData && localUserData?.beusnessName ? localUserData?.beusnessName : "Store Management"}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => setOpenDragableModel(true)} style={{ width: 45, height: 45, borderWidth: 1, borderColor: '#e0e0e0ff', borderRadius: 50, justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          <View style={{ position: 'absolute', width: 10, height: 10, backgroundColor: Colors.mainColor, top: 8, left: 23, zIndex: 10, borderRadius: 50 }} />
          <Fontisto name="bell-alt" size={25} color="#bab5b5ff" />
        </TouchableOpacity>
      </View>
      {/*Got the user Detaisl view and update and add */}
    {
      
    showPoupup &&
        <View style={{backgroundColor:themes.theme.backgroundTheme,paddingHorizontal:12,paddingVertical:4,flexDirection:'row',justifyContent:'space-between',borderBottomWidth:0.2,borderColor:themes.theme.color,alignItems:'center'}}>
       <Text style={{color:themes.theme.color,fontSize:10}}>Your Banking Details And Buesness Details Note Added</Text>
       <View style={{width:100,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
       
       <TouchableOpacity onPress={()=>router.navigate('UserBankingDetails')} style={{backgroundColor:Colors.mainColor,paddingHorizontal:8,paddingVertical:2,borderRadius:4}}>
        <Text style={{color:'#fff'}}>add</Text>
       </TouchableOpacity>
       <TouchableOpacity onPress={()=>setShowpopup(false)}>
        <Ionicons size={17} color={themes.theme.color} name="close" />
       </TouchableOpacity>
       </View>
      </View>
    }
      <ScrollContainer style={{backgroundColor:themes.theme.backgroundTheme}}>
      
        <MainScreenCharts   TotalSaleIncome={TotalSaleIncome} />
        
        <View style={{ marginTop: 30, flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'start' }}>
          <ProductModelData onPress={()=> router.navigate('TotalProduct')} percentChange={5} quantity={itemsRecords?.length || 0} icons={<Ionicons name="cube" size={25} color={Colors.mainColor} />} header="Total Products" />
          <ProductModelData percentChange={65}  quantity={productCategory?.length || 0} icons={<Octicons name="apps" size={23} color={Colors.mainColor} />} header="Product Category" />
          <ProductModelData percentChange={-23}  onPress={()=> router.navigate('TotalSold')} quantity={SaleRecords?.length || 0} icons={<Ionicons name="receipt-sharp" size={25} color={Colors.mainColor} />} header="Total Sold" date={SaleRecords[0]?.date}/>
          <ProductModelData onPress={()=>router.navigate('ProductCategry')}  percentChange={todayIncome?.todayPercentChange}  quantity={todayIncome.todayIncome || 0} icons={<MaterialIcons name="currency-rupee" size={25} color={Colors.mainColor} />} header="Today income" date={SaleRecords[0]?.date} />
          <ProductModelData percentChange={monthlySaleData?.percentChange}  quantity={monthlySaleData?.totalIncome || 0} icons={<MaterialIcons name="currency-rupee" size={25} color={Colors.mainColor} />} header="Monthly income" date={SaleRecords[0]?.date} />
        </View>
      </ScrollContainer>
    </>
  )
}


const styles = StyleSheet.create({
  fixComponent:{
    position:'absolute',
    bottom:0,
    width:'100%',
    height:ScreenHeight,
    backgroundColor:'#fff'
  }
})