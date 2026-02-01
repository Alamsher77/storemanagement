

import * as SQLite from 'expo-sqlite';
let dbInstance = null;
let isOpening = false;

export async function dbConnection() {
  if (dbInstance) return dbInstance;

  if (isOpening) {
    while (!dbInstance) {
      await new Promise(res => setTimeout(res, 50));
    }
    return dbInstance;
  }


  isOpening = true;

  dbInstance = await SQLite.openDatabaseAsync('productStore.db');

  // ✅ WAL permanently OFF
  await dbInstance.execAsync("PRAGMA journal_mode=DELETE;");
  await dbInstance.execAsync("VACUUM;");

  // ✅ CREATE TABLE only if NOT imported DB
  const table = await dbInstance.getAllAsync(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='products';"
  );
  const table1 = await dbInstance.getAllAsync(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='product_sale';"
  );
  const table2 = await dbInstance.getAllAsync(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='users';"
  );
  const table3 = await dbInstance.getAllAsync(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='users_transaction';"
  );
   
  if(table.length === 0){
    await dbInstance.execAsync(`
      CREATE TABLE products (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT,
        stock TEXT,
        units TEXT,
        salePrice TEXT,
        purchasePrice TEXT,
        selectSize TEXT,
        size TEXT,
        category TEXT
      );
    `); 
  }
  if(table1.length === 0){
    await dbInstance.execAsync(`
      CREATE TABLE product_sale (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customerName TEXT,
        products TEXT,
        date TEXT,
        time TEXT,
        dues TEXT,
        totalAmount TEXT,
        totalIncome TEXT,
        totalProductPrice TEXT,
        updateAt TEXT
      );
    `); 
  }
  if(table2.length === 0){
    await dbInstance.execAsync(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phone TEXT,
        grand_total_due INTEGER,
        latest_transaction_payment_type TEXT,
        address TEXT,
        created_date TEXT
      );
    `); 
  }
  if(table3.length === 0){
    await dbInstance.execAsync(`
      CREATE TABLE users_transaction ( 
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sale_id TEXT,
        user_id TEXT,
        transaction_type TEXT,
        total_due TEXT, 
        description TEXT,
        date TEXT,
        time TEXT,
        updateAt TEXT
      );
    `);
  }
       
  isOpening = false;
  return dbInstance;
}


export async function addSale(sale) {
  const db = await dbConnection()
  const query = `
    INSERT INTO product_sale (customerName,products, date, time, dues, totalAmount, totalIncome, totalProductPrice)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
  `;
  
const productsJson = await JSON.stringify(sale.products)
const duesJson =  await JSON.stringify(sale?.dues)
  

const saleCreated =  await db.runAsync(query, [ 
    sale.customerName,
    productsJson,
    sale.date,
    sale.time,
    duesJson, 
    sale?.totalAmount,
    sale?.totalIncome,
    sale?.totalProductPrice
  ]);
  
  if (!saleCreated) {
    return {success:false,message:'Somthing whent wrong !!'}
  }
  
 return {
   success:true,
   message:'Sale Created successfully',
   data:{
     ...sale,
     id:saleCreated.lastInsertRowId
   } 
 } 
}
export async function addProduct(product) {
 const db = await dbConnection()
  const query = `
    INSERT INTO products (name, stock, units, salePrice, purchasePrice, selectSize, size, category)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
  `; 
  
   if(product.name.trim() == '' || product.stock.toString().trim() == '' || product.units.trim() == '' || product.salePrice.toString().trim() == '' || product.purchasePrice.toString().trim() == '' || product.category.trim() == '' || product.selectSize.trim() == '') {
    return {success:false,message:'Please Provide Filds'}
  }
  
  
  const dataRecive = await db.runAsync(query, [
    product.name,
    product.stock,
    product.units,
    product.salePrice,
    product.purchasePrice,
    product.selectSize,
    product.size,
    product.category
  ]);
  return{
    success:true,
    message:'Created',
    data:{
      ...product,
      id:dataRecive.lastInsertRowId
    }} 
   

 
// console.log(products)
//   console.log("✅ Sale added successfully!");
}

// products data crud
export async function getProducts() {
  const db = await dbConnection();
  return await db.getAllAsync("SELECT * FROM products ORDER BY id DESC");
}
 

// sale crud 
export async function getSales() {
  const db = await dbConnection();
  return await db.getAllAsync("SELECT * FROM product_sale ORDER BY id DESC");
}

export async function updateUsersDetails({updatedAmount,transactionAmount,type,updatedDate,customer_id,latestType}) {
  const db = await dbConnection();
  try {
  if (type === 'given') {
    const updateUsersDueAmount = await db.runAsync("UPDATE users SET grand_total_due = grand_total_due - ? , latest_transaction_amount = ? ,latest_transaction_date = ? , latest_transaction_payment_type = ?  WHERE id = ?;",[updatedAmount,transactionAmount,updatedDate,latestType,customer_id])
    return {message:'Given data updated',success:true}
  }else if(type === 'recieve'){
    const updateUsersDueAmount = await db.runAsync("UPDATE users SET grand_total_due = grand_total_due + ? , latest_transaction_amount = ? ,latest_transaction_date = ? , latest_transaction_payment_type = ?  WHERE id = ?;",[updatedAmount,transactionAmount,updatedDate,latestType,customer_id])
     return {message:'Recieve data updated',success:true}
  }else{
    return {message:'Please correct type to update',success:false}
  }
  } catch (e) {
    return {message:e.message,success:false}
  } 
}


