const mysql = require('mysql2/promise');
require('dotenv').config();

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
};

async function initializeDB() {
  let tempPool;
  try {
    tempPool = mysql.createPool(poolConfig);
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
  } catch (error) {
    console.error("Database initialization failed:", error);
  } finally {
    if (tempPool) await tempPool.end(); // close temporary pool
  }
}

// Recreate pool targeting specific DB after creation
const db = mysql.createPool({
  ...poolConfig,
  database: process.env.DB_NAME || 'edujudol_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

module.exports = { db, initializeDB };
