import { View, Text, StyleSheet, Modal, Pressable, Linking } from 'react-native'
import React, { useEffect, useState,useContext} from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MainPage from './Screens/MainPage'
import Store from './Screens/Store'
import MyTabBar from './component/MyTabs'
import Analysis from './Screens/Analysis'
import Ledger from './Screens/Ledger'
import Colors from './Colors'
import ModelContainer from './component/ModelContainer'
import DragableModel from './component/DragableModel'
import StoreHeader from './component/Store_header'
import {ProductContext} from './Context/Contextcontent'
import Constants from 'expo-constants'; 
const Tab = createBottomTabNavigator();
export default function BottomTabNavigation() {
  const [modelHidden, setModelHidden] = useState(false)
  const {themes} = useContext(ProductContext)
  const [currentVersion, setCurrentVersion] = useState(null)
  const [updatedLink, setUpdatedLink] = useState(null)
  const [UpdatedVirsion, setUpdatedVirsion] = useState(null)
  
  useEffect(() => {
    const fetchDataFromGithub = async()=>{
      try {
      const githubURL = 'https://raw.githubusercontent.com/Alamsher77/release_apk/refs/heads/main/version.json'  
     const response = await fetch(githubURL);
    const data = await response.json(); 
    setUpdatedVirsion(data.version) 
    setUpdatedLink(data.url)  
    const appVersion = Constants.expoConfig.version;  
    setCurrentVersion(appVersion) 
    } catch (e) {
      console.log("Version catch "+e.message)
    }
 
    }
    fetchDataFromGithub()
    setTimeout(() => {
      if (currentVersion && currentVersion != UpdatedVirsion) {
        setModelHidden(true)
      }
    }, 1000)
  }, [UpdatedVirsion,currentVersion])

  const UpdatedAppsDonlowdLink = async() => {
    if (updatedLink) {
       Linking.openURL(updatedLink).catch((error) => {
      alert(error.message)
    })
    }else{
      alert('Somthing Whent wrong !!')
    }
   
  }
 
  return (
    <>
      {/* model for virsion Update for apps  */}

      <DragableModel minHeight={200} openDragableModel={modelHidden} setOpenDragableModel={setModelHidden} >
        <View style={{alignItems:'center',marginTop:20}}> 
            <Text style={[styles.modalText,{color:themes.theme.color}]}>App current version {currentVersion} {"\n"}!! App update availble version {UpdatedVirsion} !!</Text>
            <Text style={{fontSize:16, paddingHorizontal: 20, backgroundColor: 'rgba(70, 147, 70, 0.2)', fontWeight: '800', color: 'green', paddingVertical: 6, borderRadius: 5, marginBottom: 10 }}>New Feuter Added</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 20 }}>
              <Pressable
                onPress={UpdatedAppsDonlowdLink}
                style={[styles.button, styles.buttonOpen]}
              >
                <Text style={styles.textStyle}>Update Now</Text>
              </Pressable>
              <Pressable
                onPress={() => setModelHidden(false)}
                style={[styles.button, styles.buttonClose]}
              >
                <Text style={styles.textStyle}>Close</Text>
              </Pressable> 

          </View> 
          </View>
      </DragableModel> 

      <Tab.Navigator screenOptions={{
        headerStyle:{backgroundColor:themes.theme.backgroundTheme,elevation:4,shadowColor:themes.theme.color},
        headerTintColor:themes.theme.color,
        headerShown:false
      }} tabBar={(props) => <MyTabBar {...props} />}  >
        <Tab.Screen name="Main"   component={MainPage} />
        <Tab.Screen name="Ledger"  component={Ledger} />
        <Tab.Screen name="Analysis" component={Analysis} />
        <Tab.Screen
        options={{
         headerRight: () => <StoreHeader title="Store" />,
         headerShown:true
        }}

        name="Store" component={Store} />
      </Tab.Navigator>
    </>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: 'green',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize:17
  },
  modalText: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize:15
  },
}); 