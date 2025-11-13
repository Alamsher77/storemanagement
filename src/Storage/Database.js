

import * as SQLite from 'expo-sqlite';
let dbInstance = null
export async function dbConnection(){
  

  if (dbInstance) return dbInstance
  
  dbInstance =  await SQLite.openDatabaseAsync('productStore.db');  
  await dbInstance.execAsync(`
  CREATE TABLE IF NOT EXISTS products (
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
  await dbInstance.execAsync(`
      CREATE TABLE IF NOT EXISTS product_sale (
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
  
  return dbInstance
}
 


export async function addSale(sale) {
  const db = await dbConnection()
  const query = `
    INSERT INTO product_sale (customerName,products, date, time, dues, totalAmount, totalIncome, totalProductPrice)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
  `;
  
const productsJson = await JSON.stringify(sale.products)
const duesJson =  await JSON.stringify(sale?.dues)
  
// const products = await db.getFirstAsync('SELECT * FROM product_sale WHERE customerName = ?;', [sale.customerName]);
// if (products) {
//   return {success:false,message:'already created'}
// }
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
  
 return {success:true,message:'Sale Created successfully'} 
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
  
  const created = await db.getFirstAsync('SELECT * FROM products WHERE name = ?;', [product.name]);
  
if (created) {
    return{success:false,message:'Allredy created'}
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
  return{success:true,message:'Created'}
   

   

 
// console.log(products)
//   console.log("✅ Sale added successfully!");
}


