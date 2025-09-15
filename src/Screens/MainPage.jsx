import { View, Text, Image, Modal, TouchableOpacity, Alert,useAnimatedValue,Dimensions,Animated,StyleSheet,PanResponder} from 'react-native'
import React, { useState,useContext,useRef,useEffect } from 'react'
import Fontisto from 'react-native-vector-icons/Fontisto';
import Colors from '../Colors';
import ScrollContainer from '../component/ScrollContainer';
import ModelContainer from '../component/ModelContainer';
import DragableModel from '../component/DragableModel';
import ProductModelData from '../component/ProductModelData';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { LineChart } from 'react-native-gifted-charts';
//import LinearGradient from 'react-native-linear-gradient';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import {ProductContext} from '../Context/Contextcontent'
 const { height: ScreenHeight } = Dimensions.get('window')
 import MonthlyIncome from './Home/MonthlyIncome'
 import Currancy from '../Currancy'
export default function MainPage() {
  
  const {productCategory,itemsRecords,themes,SaleRecords,localUserData,monthlySaleData} = useContext(ProductContext)
  const router = useNavigation();

  const [openDragableModel, setOpenDragableModel] = useState(false)
  const lineData = [{ value: 20 }, { value: 30 }, { value: 26 }, { value: 20 }, { value: 25 }, { value: 50 }, { value: 40 }, { value: 59 }, { value: 50 }];
  
  const [poupwarning,setpoupwarning] = useState(localUserData)
   const TotalSaleIncome = SaleRecords?.reduce((prev,next)=> prev + Number(next?.totalIncome),0)
  return (
      <View style={{ flex: 1, }}>
      <DragableModel minHeight={300} openDragableModel={openDragableModel} setOpenDragableModel={setOpenDragableModel} > 
           
      </DragableModel>
      {/* Heder Styles */}
      <View style={{ elevation: 5, flexDirection: "row", justifyContent: 'space-between', width: '100%', height: 104, backgroundColor:themes.theme.backgroundTheme, paddingTop: 40, alignItems: 'center', paddingHorizontal: 15 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Image style={{ width: 45, height: 45, resizeMode: 'cover' }} source={require('../assetes/logo.png')} />
          <View >
            <Text style={{ color:themes.theme.color }}>Welcome Back!</Text>
            <Text style={{ fontWeight: '700', fontSize: 18,color:themes.theme.color }}>Sringar Store Management</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => setOpenDragableModel(true)} style={{ width: 45, height: 45, borderWidth: 1, borderColor: '#e0e0e0ff', borderRadius: 50, justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          <View style={{ position: 'absolute', width: 10, height: 10, backgroundColor: Colors.mainColor, top: 8, left: 23, zIndex: 10, borderRadius: 50 }} />
          <Fontisto name="bell-alt" size={25} color="#bab5b5ff" />
        </TouchableOpacity>
      </View>
      {/*Got the user Detaisl view and update and add */}
     {
       poupwarning &&
        <View style={{backgroundColor:themes.theme.backgroundTheme,paddingHorizontal:12,paddingVertical:4,flexDirection:'row',justifyContent:'space-between',borderBottomWidth:0.2,borderColor:themes.theme.color,alignItems:'center'}}>
       <Text style={{color:themes.theme.color,fontSize:10}}>Your Banking Details And Buesness Details Note Added</Text>
       <View style={{width:100,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
       
       <TouchableOpacity onPress={()=>router.navigate('UserBankingDetails')} style={{backgroundColor:Colors.mainColor,paddingHorizontal:8,paddingVertical:2,borderRadius:4}}>
        <Text style={{color:'#fff'}}>add</Text>
       </TouchableOpacity>
       <TouchableOpacity onPress={()=>setpoupwarning(false)}>
        <Ionicons size={17} color={themes.theme.color} name="close" />
       </TouchableOpacity>
       </View>
      </View>
     }
      <ScrollContainer style={{backgroundColor:themes.theme.backgroundTheme}}>
     
        <LinearGradient  colors={[Colors.mainColor, "rgba(243, 80, 5, 0.3)"]}  style={{ position: 'relative', width: '100%', height: 300, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }} >
          <LineChart
            areaChart
            curved
            isScrollable={false}
            adjustToWidth={true}
            data={lineData}
            startFillColor="rgba(240, 223, 192, 1)"
            startOpacity={0.8}
            endFillColor="rgba(205, 138, 22, 1)"
            endOpacity={0.3}
            hideYAxisText
            yAxisColor={0}
            xAxisColor={0}
            hideDataPoints
            dashWidth={0}
            initialSpacing={0}
            color={"#fff"}
            yAxisLabelWidth={0}
            xAxisIndicesWidth={0}
            yAxisExtraHeight={120}
            xAxisLabelTexts={0}
          />
          <View style={{ position: 'absolute', top: 0, left: 0, padding: 20, gap: 6 }}>
            <Text style={{ color: themes.theme.color, fontWeight: '600' }}>Profit amount</Text>
            <Text style={{ color:themes.theme.color, fontWeight: '900', fontSize: 30 }}>{Currancy(TotalSaleIncome)}</Text>
            <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 50, color: 'rgba(0,200,0,1)', fontWeight: '600' }}>+15%</Text>
              <Text style={{ color: '#fff', opacity: 0.8 }}>From the previous week</Text>
            </View>
          </View>
          <View style={{ top: 200, left: 200, position: 'absolute', width: 12, height: 12, backgroundColor: Colors.mainColor, outlineWidth: 6, outlineColor: '#fff', borderRadius: 50 }} />
        </LinearGradient>
        <View style={{ marginTop: 30, flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
          <ProductModelData onPress={()=> router.navigate('TotalProduct')} percentChange={5} quantity={itemsRecords?.length} icons={<Ionicons name="cube" size={25} color={Colors.mainColor} />} header="Total Products" />
          <ProductModelData percentChange={65}  quantity={productCategory?.length} icons={<Octicons name="apps" size={23} color={Colors.mainColor} />} header="Product Category" />
          <ProductModelData percentChange={-23}  onPress={()=> router.navigate('TotalSold')} quantity={SaleRecords?.length} icons={<Ionicons name="receipt-sharp" size={25} color={Colors.mainColor} />} header="Total Sold" />
          <ProductModelData percentChange={monthlySaleData?.percentChange}  quantity={monthlySaleData?.totalIncome} icons={<MaterialIcons name="currency-rupee" size={25} color={Colors.mainColor} />} header="Monthly income" />
        </View>
      </ScrollContainer>
    </View>
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