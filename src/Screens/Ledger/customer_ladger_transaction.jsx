import {View,Text,StyleSheet,TouchableOpacity} from "react-native"
import {useEffect,useState,useContext,useMemo} from "react"
 import { useSelector } from "react-redux";
 import {dbConnection} from '../../Storage/Database'
 import translate from "translate";
 import FontAwesome from 'react-native-vector-icons/FontAwesome' 
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import AntDesign from 'react-native-vector-icons/AntDesign' 
 import {WebView} from 'react-native-webview'
 import {ProductContext} from '../../Context/Contextcontent'
export default function CustomerLadgerTransaction() {
  const {themes} = useContext(ProductContext)
  const [allDueTransaction,setAllDueTransaction] = useState([])
  const [customersData,setCustomerData] = useState(null)
  const [loadingCustomer,setLoadingCustomer] = useState(true)
  const {customers} = useSelector((state)=>state.customers)
  
   
  useEffect(() => {
 const converLanguage = async (changeValue) => {
  try {
    const changeCustomerNameInHindi = await Promise.all(
      customers.map(async (singleCust) => {
        const converted = await translate(singleCust.name, 'hi');

        return {
          ...singleCust,
          name: converted,
        };
      }).sort((a,b) => b.grand_total_due - a.grand_total_due)
    );
    changeCustomerNameInHindi.sort(
  (b, a) => Number(b.grand_total_due) - Number(a.grand_total_due)
);
    setLoadingCustomer(false)
    setCustomerData(changeCustomerNameInHindi);
  } catch (e) {
    console.log(e);
    setLoadingCustomer(false)
  }
};
 converLanguage()
}, [])
  const totalBalanceDue = useMemo(() => {
  return Math.abs(customers.reduce(
    (sum, customer) => {
      
    const due = Number(customer?.grand_total_due || 0)
    return due < 0 ? sum + due : sum
    },0));
}, [customers]);
  const totalBalanceDueAdvance = useMemo(() => {
  return Math.abs(customers.reduce(
    (sum, customer) => {
      
    const due = Number(customer?.grand_total_due || 0)
    return due > 0 ? sum + due : sum
    },0));
}, [customers]);
   const htmlContent = `
  <!DOCTYPE html>
  <html lang="hi">
  <head>
  <meta charset="UTF-8">
  <title>List Of Product</title>
  <style>
  *{
    margin:0;
    padding:0;
    box-sizing: border-box;
  }
  .due-table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  background: white;
}

.due-table th,
.due-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

.due-table th {
  background: #f5f5f5;
  font-weight: 600;
}

.due-table td:first-child,
.due-table th:first-child {
  width: 70px;
  text-align: center;
}

.due-table td:last-child,
.due-table th:last-child {
  text-align: right;
  font-weight: 600;
}

.flexContainer {
  display:flex;
  flex-direction: column;
  gap:12px;
  align-items:flex-end;
  margin-right:40px;
  margin-top:40px;
}
  </style>
  </head>
  <body>
   <table class="due-table">
  <thead>
    <tr>
      <th>Sr. No.</th>
      <th>Customer Name</th>
      <th>Customer Phone Number</th>
      <th>Due Amount</th>
    </tr>
  </thead>

  <tbody>
  ${
    !customersData ?
    "Loading......."
    :
    customersData?.map((listItem,index)=>{
      return(
      `<tr>
      <td>${index+1}</td>
      <td>${listItem.name}</td>
      <td>${listItem.phone ? listItem.phone : "फोन नंबर नहीं है"}</td>
      <td>₹${listItem.grand_total_due < 0 ? Math.abs(listItem.grand_total_due) : -listItem.grand_total_due}</td>
    </tr>`
      )
    }).join("")
  }
  </tbody>
</table>
  <div class="flexContainer">
  <p>कुल अग्रिम राशि = ${totalBalanceDueAdvance}</p>
  <p>कुल बकाया राशि = ${totalBalanceDue}</p>
  </div>
  </body>
  </html>
  `
  
  
  const PrintData = async()=>{
    try {
    if (customersData) { 
    const { uri } = await Print.printToFileAsync({html:htmlContent})
      const newUri = FileSystem.documentDirectory +"customers.pdf"
      
     await FileSystem.moveAsync({
     from:uri,
     to:newUri,
   })
   if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(newUri);
  }
    }
    } catch (e) {
      console.log(e.message)
    }
   
  }
  return (
    <>
    <WebView style={{flex:1}} source={{html:htmlContent,baseUrl:''}} /> 
     <View style={[styles.printcontainer,{backgroundColor:themes.theme.backgroundTheme,paddingVertical:8,paddingBottom:20
       }]}>
            <TouchableOpacity  style={[styles.printitems,{backgroundColor:themes.mainColor,shadowColor:themes.theme.color,borderColor:themes.theme.color}]}>
            <AntDesign color={'#fff'} size={25} name="printer" />
            </TouchableOpacity> 
            <TouchableOpacity style={[styles.printitems,{backgroundColor:themes.mainColor,shadowColor:themes.theme.color,borderColor:themes.theme.color}]}>
            <AntDesign color={'#fff'} size={25} name="download" />
            </TouchableOpacity> 
            <TouchableOpacity onPress={PrintData} style={[styles.printitems,{backgroundColor:themes.mainColor,shadowColor:themes.theme.color,borderColor:themes.theme.color}]}>
            <FontAwesome color={'#fff'} size={25} name="share" />
            </TouchableOpacity> 
         
       </View>
    </>
    )
}

const styles = StyleSheet.create({
  printcontainer:{
    flexDirection:'row',
    paddingHorizontal:8,
    justifyContent:'space-around',
    marginTop:12, 
  },
  printitems:{
    borderWidth:1, 
    paddingHorizontal:6,
    paddingVertical:4,
    borderRadius:6,
    elevation:6
  }
})