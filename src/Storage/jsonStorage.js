import { File, Paths } from 'expo-file-system';
import * as FileSystem from 'expo-file-system/legacy';
// product ka storage data
 const fileUri = FileSystem.documentDirectory + "product.json";
 
 
// ✅ File check or create empty file
export async function initFile() {
   const fileInfo = await FileSystem.getInfoAsync(fileUri); 
   if (!fileInfo.exists) {
     await FileSystem.writeAsStringAsync(fileUri, JSON.stringify([]));
   }
}

// ✅ Read file
export async function readData() {
  try {
     await initFile()
     const data = await FileSystem.readAsStringAsync(fileUri);
     return JSON.parse(data);
  } catch (error) {
    console.error("Error reading file:", error);
    return [];
  }
}

// ✅ Write file
export async function writeData(data) {
  try {
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing file:", error);
  }
}

// ✅ Add new item
export async function addItem(name) {
  const data = await readData(); 
  const newItem = { id: Date.now(), ...name };
  if(!name?.name || !name?.stock || !name?.units || !name?.salePrice || !name?.purchasePrice || !name?.selectSize || !name?.category ) return {message:'Feilds Required !!'}
  const findData = data?.find((item)=> name.name == item?.name)
  if(findData) return {data:findData,message:'Name Availble in Database !!'}
  data.push(newItem);
  await writeData(data);
  return newItem;
}

// ✅ Update item
export async function updateItem(id, newName) {
  const data = await readData();
  const updated = data.map((item) =>
    item.id === id ? { ...newName} : item
  );
  console.log(newName)
  await writeData(updated);
}

// ✅ Delete item
export async function deleteItem(id) {
  const data = await readData();
  const filtered = data.filter((item) => item.id !== id);
  await writeData(filtered);
}


// Sale ka Storage Data 

 const fileUriSale = FileSystem.documentDirectory + "sale.json"; 
// ✅ File check or create empty file
export async function initFileSale() {
   const fileInfo = await FileSystem.getInfoAsync(fileUriSale);
  
   if (!fileInfo.exists) {
    await FileSystem.writeAsStringAsync(fileUriSale, JSON.stringify([]));
   }
}

// ✅ Read file
export async function readDataSale() {
  try {
     await initFileSale()
     const data = await FileSystem.readAsStringAsync(fileUriSale);
     return JSON.parse(data);
  } catch (error) {
    console.error("Error reading file:", error);
    return [];
  }
}

// ✅ Write file
export async function writeDataSale(data) {
  try {
    await FileSystem.writeAsStringAsync(fileUriSale, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing file:", error);
  }
}

// ✅ Add new item
export async function addItemSale(customer) {
  if (!customer.customerName) return {success:false,message:'Please Enter The Parti Name'} 
  if (customer.products.length === 0) return {success:false,message:'Please Select Sale Products'} 
  const data = await readDataSale(); 
  const newItem = { id: Date.now(), ...customer };
   
  data.push(newItem);
  await writeDataSale(data);
  return {...newItem,success:true,message:'Bill Genrated SuccessFull'};
}

// ✅ Update item
export async function updateItemSale(id, newSale) {
  try {
  const data = await readDataSale();
  const updated = data.map((item) =>
    item.id === id ? { ...newSale} : item
  );
  await writeDataSale(updated);
  return {...newSale,success:true,message:'Bill updated SuccessFull'};
    
  } catch (e) {
     return {success:false,message:e.message};
  }
}

// ✅ Delete item
export async function deleteItemSale(id) {
  const data = await readDataSale();
  const filtered = data.filter((item) => item.id !== id); 
  await writeDataSale(filtered);
}



// sqlite configration
