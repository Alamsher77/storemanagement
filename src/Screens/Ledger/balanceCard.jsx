import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../Colors'
import AnimatedButton from "../../component/Button"
const ACCENT = Colors.mainColor

const BalanceCard = ({
  balance = 124050,
  accounts = 136,
  onFilterPress,
  themes,
}) => {
  
  const [hideAndShowBalance,setHideAndShowBalance] = React.useState(true)
  return (
    <View style={[styles.card,{backgroundColor:themes.theme.card}]}>

      {/* Header */}
      <View style={styles.topSection}>

        {/* Left */}
        <View style={styles.leftContent}>
          <Text style={[styles.title,{color:themes.theme.color}]}>Net Balance</Text>

          <View style={styles.accountRow}>
            <Ionicons
              name="person-outline"
              size={20}
              color={themes.theme.color}
            />

            <Text style={[styles.accounts,{color:themes.theme.color}]}>
              {accounts} Accounts
            </Text>
          </View>
        </View>
        {/* Divider */}
         <View style={styles.divider} />
        {/* Right */}
        <View style={styles.balanceSection}>

          <View style={styles.balanceRow}>
          <AnimatedButton 
          onPress={()=> setHideAndShowBalance(!hideAndShowBalance)}
          style={{paddingHorizontal:6}} isIcon>
              <Ionicons
              name={hideAndShowBalance ? "eye-off" : "eye"}
              size={22}
              color="#737979"
            />
          </AnimatedButton>
         
           
          <AnimatedButton 
          style={{paddingHorizontal:6,fontSize:20}}
          color={themes.mainColor}
          bgColor={"transparent"}
          textStyle={{fontWeight:"bold",fontSize:17}}
          title={`₹${hideAndShowBalance ? "xxxxxx" :balance.toLocaleString('en-IN')}`}/>
          </View>

          <Text style={[styles.youGet,{color:themes.theme.color}]}>You Get</Text>
        </View>

      

       
      </View>

    </View>
  );
};

export default BalanceCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F1F8F8',
    borderWidth:1,
    borderColor:Colors.mainColor,
    // Android
    elevation: 2,

    // iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },

  topSection: {
    paddingHorizontal: 14,
    paddingVertical: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"space-between"
  },

  leftContent: {
    flex: 1,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#172B2D',
    marginBottom: 14,
  },

  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  accounts: {
    fontSize: 14,
    color: '#747B7C',
    marginLeft: 8,
    fontWeight: '400',
  },

  balanceSection: {
    flex:1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 8,
  },

  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:2
  },

  balance: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '700',
  },

  youGet: {
    marginTop: 10,
    fontSize: 13,
    color: '#747B7C',
  },

  divider: {
    height: 48,
    width: 1.5,
    backgroundColor: 'gray',
    marginRight: 12,
  },

  filterButton: {
    borderRadius: 38,
    padding:10,
    backgroundColor: '#D5F1DD',

    alignItems: 'center',
    justifyContent: 'center',

    position: 'relative',
  },
});