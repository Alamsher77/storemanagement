 
export default async function migrateDB(db) {
  const columns = await db.getAllAsync(`PRAGMA table_info(users);`);
   
  if (!columns.some(c => c.name === 'address')) {
    await db.execAsync(`ALTER TABLE users ADD COLUMN address TEXT;`);
  }

  if (!columns.some(c => c.name === 'created_date')) {
    await db.execAsync(`ALTER TABLE users ADD COLUMN created_date TEXT;`);
  }
  
  if (!columns.some(c => c.name === 'latest_transaction_date')) {
    await db.execAsync(`ALTER TABLE users ADD COLUMN latest_transaction_date TEXT;`);
  }
  if (!columns.some(c => c.name === 'latest_transaction_amount')) {
    await db.execAsync(`ALTER TABLE users ADD COLUMN latest_transaction_amount TEXT;`);
  }
}
