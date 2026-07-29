import * as SQLite from 'expo-sqlite';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export const getDatabase = async () => {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('dejalohoy.db');
  }
  return dbPromise;
};

export const initializeDatabase = async () => {
  try {
    const db = await getDatabase();
    
    // Configuración inicial y creación de tablas
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      
      CREATE TABLE IF NOT EXISTS UserProfile (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        startDate TEXT NOT NULL,
        cigsPerDay INTEGER NOT NULL,
        cigsPerPack INTEGER NOT NULL,
        pricePerPack REAL NOT NULL,
        yearsSmoking INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS Cravings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        intensity INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS Badges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        unlockedAt TEXT NOT NULL
      );
    `);
    
    console.log('Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error inicializando la base de datos', error);
  }
};
