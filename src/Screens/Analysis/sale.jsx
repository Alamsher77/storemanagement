import {
  View,
  Text,
  Pressable,
  StyleSheet
} from 'react-native'
import BoxContainer from '../../component/BoxContainer'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useState,useMemo,useEffect} from 'react'
import Colors from '../../Colors';
import Color from '../../Twplates';
import {dbConnection,addSale,addProduct} from '../../Storage/Database'
import { BarChart } from "react-native-gifted-charts";
const Sale = ()=> {
  const [selectedBarIndex, setSelectedBarIndex] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
   const getMonthName = (month: number) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[month];
  };
  const navigateMonth = (direction: number) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedBarIndex(null);
  };
  function getAllDatesInMonth(year, month) {
  const result = [];
  const totalDays = new Date(year, month, 0).getDate();  // month = 11 → November

  for (let day = 1; day <= totalDays; day++) {
    result.push(String(day).padStart(2, "0") + "-" + month.padStart(2, "0") + "-" + year);
  }

  return result;
}
const [monthData, setMonthData] = useState([]);
useEffect(()=>{
  const getMonthData = async()=>{
   const db = await dbConnection();
  
  try { 
  const month = String(currentMonth + 1).padStart(2, "0");
const year = String(currentYear);

const results = await db.getAllAsync(
  `SELECT 
      date AS day,
      SUM(totalIncome) AS totalIncome
    FROM product_sale
    WHERE substr(date, 4, 2) = ? 
      AND substr(date, 7, 4) = ?
    GROUP BY date
    ORDER BY substr(date, 1, 2);`,
  [month, year]
);
const fullDates = getAllDatesInMonth(currentYear, String(currentMonth +1));

// Convert dbResults to map for fast lookup
const incomeMap = {};
results.forEach(item => {
  incomeMap[item.day] = Number(item.totalIncome);
});

// Create final chart-ready array
 const finalData = fullDates.map((date,index) => ({
  day: date,
  value: incomeMap[date] || 0,
  label:index+1,
   topLabelComponent: () => selectedBarIndex === index ? (
          <Text
            style={{
              color: Color.orange[800],
              fontSize: 10,
              fontWeight: "800",
              marginBottom: 4,
              backgroundColor:Color.orange[200],
              paddingHorizontal:2,
              borderRadius:2,
            }}
          >
            {Math.floor(incomeMap[date]) || 0}
          </Text>
        ) : null,
})); 
 setMonthData(finalData)
  } catch (e) {
    console.log(e)
  } 
} 
    getMonthData()
},[currentMonth,selectedBarIndex])

console.log(selectedBarIndex)
  return(
    <View>
       <BoxContainer style={{gap:12}}>
          <View style={ { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
           <Pressable onPress={()=>navigateMonth(-1)} style={styles.arrowButton}>
            <MaterialIcons name="chevron-left" color='#fff' size={25} />
           </Pressable>
           <Text style={ { color: Color['orange'][400], fontWeight: '800' }}>{getMonthName(currentMonth)} {currentYear}</Text>
           <Pressable onPress={()=>navigateMonth(1)} style={styles.arrowButton}>
            <MaterialIcons name="chevron-right" color='#fff' size={25} />
           </Pressable>
          </View>
             <View
          style={{
            marginBottom: 32,
            overflow: "hidden",
          }}
        >
          <BarChart
            noOfSections={4}
            barBorderRadius={4}
            data={monthData}
            yAxisThickness={0}
            xAxisThickness={0}
            // hideYAxisText
            xAxisLabelTextStyle={{
              color: Color.gray[400],
              fontSize: 12,
              fontWeight: "500",
            }}
            yAxisTextStyle={{
              color: Color.gray[400],
              fontSize: 12,
              fontWeight: "500",
            }}
            showXAxisIndices={false}
            // renderTooltip={() => (
            //   <View style={{ backgroundColor: "white" }}>
            //     <Text>Tooltip</Text>
            //   </View>
            // )}
            isAnimated
            animationDuration={300}
            onPress={(_item,index) => {
              setSelectedBarIndex(selectedBarIndex === index ? null : index);
            }}
             maxValue={Math.max(...monthData.map(i => i.value)) + 60}  
            showGradient
            dashGap={10}
          />
        </View>
       </BoxContainer>
      </View>
  )
}

const styles = StyleSheet.create({
  arrowButton: {
    backgroundColor: Color['orange'][400],
    paddingHorizontal: 8,
    borderRadius: 4,
  },

})
export default Sale