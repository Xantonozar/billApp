import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

const DB_NAME = 'billkhata.db';

let db: SQLite.SQLiteDatabase | null = null;

export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  // SQLite doesn't work on web, only on native platforms
  if (Platform.OS === 'web') {
    console.warn('SQLite is not supported on web. This app is designed for mobile devices.');
    // Return a mock database for web preview
    return {} as SQLite.SQLiteDatabase;
  }
  
  if (db) return db;
  
  db = await SQLite.openDatabaseAsync(DB_NAME);
  await initializeDatabase(db);
  return db;
};

const initializeDatabase = async (database: SQLite.SQLiteDatabase) => {
  try {
    // Create members table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        whatsapp TEXT,
        facebook TEXT,
        room_info TEXT,
        avatar_base64 TEXT,
        rent_amount REAL DEFAULT 0,
        joined_date TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create bills table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS bills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        total_amount REAL NOT NULL,
        bill_month TEXT,
        due_date TEXT,
        bill_date TEXT,
        meter_reading TEXT,
        notes TEXT,
        photo_base64 TEXT,
        split_type TEXT DEFAULT 'equal',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create bill_assignments table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS bill_assignments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bill_id INTEGER,
        member_id INTEGER,
        assigned_amount REAL NOT NULL,
        is_paid INTEGER DEFAULT 0,
        paid_date TEXT,
        payment_method TEXT,
        FOREIGN KEY (bill_id) REFERENCES bills(id),
        FOREIGN KEY (member_id) REFERENCES members(id)
      );
    `);

    // Create meals table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS meals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        member_id INTEGER,
        meal_date TEXT NOT NULL,
        breakfast REAL DEFAULT 0,
        lunch REAL DEFAULT 0,
        dinner REAL DEFAULT 0,
        total_quantity REAL,
        meal_rate REAL,
        total_cost REAL,
        is_finalized INTEGER DEFAULT 0,
        notes TEXT,
        FOREIGN KEY (member_id) REFERENCES members(id)
      );
    `);

    // Create deposits table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS deposits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        member_id INTEGER,
        amount REAL NOT NULL,
        deposit_date TEXT,
        payment_method TEXT,
        transaction_id TEXT,
        screenshot_base64 TEXT,
        notes TEXT,
        FOREIGN KEY (member_id) REFERENCES members(id)
      );
    `);

    // Create shopping table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS shopping (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shopping_date TEXT NOT NULL,
        amount REAL NOT NULL,
        items TEXT,
        receipt_base64 TEXT,
        notes TEXT,
        shopper_name TEXT
      );
    `);

    // Create settings table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);

    // Insert default settings
    await database.runAsync(
      'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)',
      ['room_name', 'My Room']
    );
    await database.runAsync(
      'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)',
      ['currency', 'BDT']
    );
    await database.runAsync(
      'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)',
      ['default_meal_quantity', '2']
    );
    await database.runAsync(
      'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)',
      ['meal_rate_mode', 'auto']
    );

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

export const resetDatabase = async () => {
  const database = await getDatabase();
  
  await database.execAsync(`
    DROP TABLE IF EXISTS members;
    DROP TABLE IF EXISTS bills;
    DROP TABLE IF EXISTS bill_assignments;
    DROP TABLE IF EXISTS meals;
    DROP TABLE IF EXISTS deposits;
    DROP TABLE IF EXISTS shopping;
    DROP TABLE IF EXISTS settings;
  `);
  
  await initializeDatabase(database);
};
