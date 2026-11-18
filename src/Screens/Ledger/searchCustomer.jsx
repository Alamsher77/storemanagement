import React, { useMemo, useState,useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
 import { useSelector,useDispatch} from "react-redux";
 import {ProductContext} from '../../Context/Contextcontent'
 import LadgerCustomerList from '../../component/ladgerCustomerList'
  import {dbConnection} from '../../Storage/Database'
 import Toast from 'react-native-toast-message'
 
 import {createCustomers,setCustomers } from '../../redux/ledgerSlice'
 import DateAndTime from '../../dateAndTime'
 import migrateDB from '../../Utils/migrateDb'
 import {useNavigation} from '@react-navigation/native';
const SearchCustomer = ({
  onSelectCustomer,
  onCreateCustomer,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {customers} = useSelector((state)=> state.customers) 

   const {themes} = useContext(ProductContext)

  const [search, setSearch] = useState('');

  const filteredCustomers = useMemo(() => {
    const value = search.trim().toLowerCase();
    const number = Number(search.trim());

    if (!value) {
      return customers;
    }

    return customers.filter(customer =>
      customer.name?.toLowerCase().includes(value) || customer.phone && customer.phone.includes(number)
    );
  }, [customers, search]);

  const renderCustomer = ({ item }) => {
    return (
      <Pressable
        style={[styles.customerItem,{backgroundColor:themes.theme.cardBackground}]}
        onPress={() => onSelectCustomer?.(item)}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.name?.charAt(0)?.toUpperCase()}
          </Text>
        </View>

        <View style={styles.customerInfo}>
          <Text style={[styles.customerName,{color:themes.theme.color}]} numberOfLines={1}>
            {item.name}
          </Text>

          {item.phone && (
            <Text style={[styles.phone,{color:themes.theme.secondaryColor}]}>
              {item.phone}
            </Text>
          )}
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color={themes.theme.secondaryColor}
        />
      </Pressable>
    );
  };

  const [userLoading,setUserLoading] = useState(false)
const createUserHandler = async()=>{ 
  try {
    setUserLoading(true)
    const db = await dbConnection()  
    await migrateDB(db)
  const query = `
    INSERT INTO users (name,phone, grand_total_due, latest_transaction_payment_type, latest_transaction_date,created_date)
    VALUES (?, ?, ?, ?, ?, ?);
  `;
  const createdUser = await db.getFirstAsync('SELECT * FROM users WHERE name = ?;', [search]);
  setUserLoading(false)
if (createdUser) {
  Toast.show({type:'error',text1:'User Alrady Created'})
  return false
}
const userCreated =  await db.runAsync(query, [ 
    search,null,0,'add',DateAndTime()?.formatDate,DateAndTime()?.formatDate,
  ]);
 
    Toast.show({type:'success',text1:'User Created SuccessFull'})
    dispatch(createCustomers({
    name:search,
    phone:null,
    grand_total_due:0, 
    latest_transaction_payment_type:'add',
    latest_transaction_date:DateAndTime()?.formatDate,
    created_date:DateAndTime()?.formatDate,
    id:userCreated.lastInsertRowId}))
    navigation.navigate("CustomerDetails",{customer_id:userCreated.lastInsertRowId})
    
  } catch (e) {
    setUserLoading(false)
    console.log(e)
  }
}

  return (
    <View style={[styles.container,{backgroundColor:themes.theme.backgroundTheme}]}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle,{color:themes.theme.color}]}>
          Select Customer
        </Text>

        <Text style={[styles.customerCount,{color:themes.theme.secondaryColor}]}>
          {customers.length} Customers
        </Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer,{backgroundColor:themes.theme.backgroundTheme,borderColor:themes.theme.borderColor}]}>

        {/* Left Search Icon */}
        <Ionicons
          name="search-outline"
          size={21}
          color={themes.theme.secondaryColor}
          style={styles.searchIcon}
        />

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search customer"
          placeholderTextColor={themes.theme.secondaryColor}
          style={[styles.input,{color:themes.theme.secondaryColor}]}
          returnKeyType="search"
          autoCorrect={false}
        />

        {/* Right Clear Button */}
        {search.length > 0 && (
          <Pressable
            onPress={() => setSearch('')}
            style={styles.clearButton}
            hitSlop={10}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color="#999"
            />
          </Pressable>
        )}
      </View>

      {/* Customer List */}
      <FlatList
        data={filteredCustomers}
        keyExtractor={(item, index) =>
          String(item.id ?? index)
        }
        renderItem={(item,index)=>(<LadgerCustomerList  item={item.item} key={index} />)}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          filteredCustomers.length === 0
            ? styles.emptyContainer
            : styles.listContainer
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="person-outline"
              size={45}
              color={themes.theme.secondaryColor}
            />

            <Text style={[styles.emptyTitle,{color:themes.theme.color}]}>
              Customer not found
            </Text>

            <Text style={[styles.emptyText,{color:themes.theme.secondaryColor}]}>
              No customer matches "{search}"
            </Text>

            <Pressable
              style={styles.createButton}
              onPress={createUserHandler}
            >
              <Ionicons
                name="add"
                size={21}
                color="#fff"
              />

              <Text style={styles.createButtonText}>
             { userLoading ? <ActivityIndicator color="#fff" size="small" /> :
                "Create New Customer"}
              </Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
};

export default SearchCustomer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    paddingTop:40
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },

  customerCount: {
    marginTop: 4,
    fontSize: 13,
    color: '#888',
  },

  searchContainer: {
    height: 48,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },

  searchIcon: {
    marginRight: 8,
  },

  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#222',
    paddingVertical: 0,
  },

  clearButton: {
    paddingLeft: 8,
  },

  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },

  customerItem: {
    minHeight: 68,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E15836',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },

  customerInfo: {
    flex: 1,
    marginLeft: 12,
  },

  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },

  phone: {
    marginTop: 3,
    fontSize: 13,
    color: '#888',
  },

  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  empty: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  emptyTitle: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },

  emptyText: {
    marginTop: 5,
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
  },

  createButton: {
    marginTop: 18,
    height: 46,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: '#E15836',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  createButtonText: {
    marginLeft: 7,
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});