const mysql = require('mysql2/promise');
require('dotenv').config();

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
};

async function initializeDB() {
  try {
    const tempPool = mysql.createPool(poolConfig);
    const dbName = process.env.DB_NAME || 'edujudol_db';
    
    // Create DB safely
    await tempPool.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await tempPool.query(`USE \`${dbName}\`;`);

    // Create users table
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        balance INT DEFAULT 50000,
        spin_count INT DEFAULT 0,
        current_seed VARCHAR(255) DEFAULT 'seed_default_123',
        behavior_mode ENUM('hook', 'normal', 'drain') DEFAULT 'normal',
        force_jackpot TINYINT(1) DEFAULT 0,
        history JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await tempPool.query(createUsersTableQuery);

    // Migration for existing tables: add columns if they don't exist
    try {
      await tempPool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS current_seed VARCHAR(255) DEFAULT 'seed_default_123'`);
      await tempPool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS behavior_mode ENUM('hook', 'normal', 'drain') DEFAULT 'normal'`);
      await tempPool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS force_jackpot TINYINT(1) DEFAULT 0`);
    } catch (migErr) {
      // Ignore if columns already exist (MariaDB < 10.5 might not support ADD COLUMN IF NOT EXISTS)
      console.log("Migration check (ALTER) skipped or already applied.");
    }

    // Initial check for 'user' account because simulation relies on it
    const [rows] = await tempPool.query(`SELECT * FROM users WHERE username = 'user'`);
    if (rows.length === 0) {
      await tempPool.query(
        `INSERT INTO users (username, password, balance, spin_count, history) VALUES (?, ?, ?, ?, ?)`,
        ['user', 'password123', 50000, 0, JSON.stringify([50000])]
      );
    }
    
    // Admin login relies on 'admin'
    const [adminRows] = await tempPool.query(`SELECT * FROM users WHERE username = 'admin'`);
    if (adminRows.length === 0) {
      await tempPool.query(
        `INSERT INTO users (username, password, balance, spin_count, history) VALUES (?, ?, ?, ?, ?)`,
        ['admin', 'password123', 50000, 0, JSON.stringify([50000])]
      );
    }

    console.log("Database initialized successfully!");
    await tempPool.end(); // close temporary pool

  } catch (error) {
    console.error("Database initialization failed:", error);
  }
}

// Recreate pool targeting specific DB after creation
const db = mysql.createPool({
  ...poolConfig,
  database: process.env.DB_NAME || 'edujudol_db',
});

module.exports = { db, initializeDB };
