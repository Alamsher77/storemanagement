import { LineChart } from 'react-native-gifted-charts';
//import LinearGradient from 'react-native-linear-gradient';
import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  Alert,
  useAnimatedValue,
  Dimensions,
  Animated,
  StyleSheet,
  PanResponder
} from 'react-native';
import React, {
  useState,
  useContext,
  useRef,
  useEffect
} from 'react';
import {
  LinearGradient
} from 'expo-linear-gradient';
import Currancy from '../../Currancy'
import Colors from '../../Colors';
import SaleAnalysis from '../../Analysis/saleAnalysisByDate'
import {
  ProductContext
} from '../../Context/Contextcontent'
import Toast from 'react-native-toast-message'
 import {useSelector } from "react-redux";
const MainScreenCharts = ({
  TotalSaleIncome
})=> {
   const {sale:SaleRecords,monthlySaleData} = useSelector((state)=>state.sale) 
  const {themes} = useContext(ProductContext) 
  const [currentWeekData,setCurrentWeekData] = useState([])
  const [previousWeekData,setPreviousWeekData] = useState([])
  const [weeklyPercentage,setWeeklyPercentage] = useState(0)
  // const lineData = Object.entries(saleobjectData).map(([key, value])=> {
  //   return {
  //     date: key,
  //     value: Math.floor(value),
  //     hidePointer: false,
  //     onPress: ()=> testestData()
  //   }
  // }).reverse(-1)

  // console.log(getSaleListOfData)

  useEffect(()=>{
    const getsaleanalysis =  SaleAnalysis({dateType:'Weekly',SaleRecords})
  
    setCurrentWeekData(getsaleanalysis?.currentWeekSummary) 
    setPreviousWeekData(getsaleanalysis?.previousWeekSummary)
   setWeeklyPercentage(getsaleanalysis?.weeklyPercentage)
  },[SaleRecords]) 
  return (
    <LinearGradient
      colors={[Colors.mainColor, "rgba(243, 80, 5, 0.3)"]} style={ { position: 'relative', width: '100%', height: 300, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
          <LineChart
        areaChart
        data={previousWeekData} 
        data2={currentWeekData}  
        startFillColor="rgba(240, 223, 192, 1)" 
        startFillColor2="rgba(0, 223, 0, 1)" 
        startOpacity={0.9}
        endFillColor="rgba(205, 138, 22, 1)" 
        endFillColor2="rgba(0, 138, 0, 1)" 
        endOpacity={0.1} 
        yAxisColor={0}
        xAxisColor={0}
        dashWidth={0}
        adjustToWidth={false}
        initialSpacing={5} 
        color={"orange"}  
        
        color2={"lightgreen"}  
        dataPointsColor={'lightgray'}
        dataPointsWidth={20}
        yAxisLabelWidth={0}
        xAxisIndicesWidth={0}
        yAxisExtraHeight={150}
        yAxisExtraHeight2={0}
        xAxisLabelTexts={0} 
        height={130} 
        pointerConfig={{
          pointerStripHeight: 100, 
          pointerStripColor: 'orange', 
          pointerStripWidth: 2,
          pointerColor: 'lightgray',
          radius: 4,
          pointerLabelWidth: 60,
          pointerLabelHeight: 50, 
          strokeDashArray: [2, 5],
          autoAdjustPointerLabelPosition: false,
          pointerLabelComponent: items => {
         
            return (
              <View
                style={ {
                  height: 60,
                  width:80,
                  justifyContent: 'center',
                  marginTop: -30,
                  marginLeft: items[0].date == 'Mon' ? 6 : items[0].date == 'Sun' ? -62 : -30,
                }}>
                  <Text style={ { color: 'white', fontSize: 12, marginBottom: 6, textAlign: 'center' }}>
                    {items[0].date}
                  </Text>
                  <View style={{ paddingVertical: 6, borderRadius: 16, backgroundColor: 'white' }}>
                    <Text style={ { fontWeight: 'bold', textAlign: 'center',fontSize:12,color:Colors.mainColor}}>
                      {Currancy(items[0].value)}
                    </Text>
                    <Text style={ { fontWeight: 'bold', textAlign: 'center',fontSize:12,color:'green'}}>
                      {Currancy(items[1].value)}
                    </Text>
                  </View>
                </View>
            );
          },
        }}
        />
          <View style={ { position: 'absolute', top: 0, left: 0, padding: 20, gap: 6 }}>
            <Text style={ { color: "#fff", fontWeight: '600' }}>Profit amount</Text>
            <Text style={ { color: "#fff", fontWeight: '900', fontSize: 30 }}>{Currancy(TotalSaleIncome)}</Text>
            <View style={ { flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={ { backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 50, color: weeklyPercentage > 0 ? 'rgba(0,200,0,1)' : 'rgba(200,0,0,1)', fontWeight: '600' }}>{weeklyPercentage}%</Text>
              <Text style={ { color: '#fff', opacity: 0.8 }}>From the previous week</Text>
            </View>
          </View>
           <View style={ { position: 'absolute', bottom: -17, left: "50%",gap: 6, transform:[{translateX:"-50%"}],flexDirection:'row'}}>
           <View style={{flexDirection:'row',alignItems:"center",gap:4,}}>
            <Text style={ { color:themes.theme.color, opacity: 0.8 }} >Previous</Text>
           <View style={{width:10,height:10,backgroundColor:'orange'}} />
           </View>
           <View style={{flexDirection:'row',alignItems:"center",gap:4,}}>
            <Text style={ { color: themes.theme.color, opacity: 0.8 }} >Current</Text>
           <View style={{width:10,height:10,backgroundColor:'lightgreen'}} />
           </View>
           </View>
        </LinearGradient>
  )
}

export default MainScreenCharts