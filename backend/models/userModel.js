const { db } = require('../config/db');

class UserModel {
  static async findByUsernameAndPassword(username, password) {
    const [rows] = await db.query(
      `SELECT * FROM users WHERE username = ? AND password = ?`,
      [username, password]
    );
    return rows[0];
  }

  static async findByUsername(username) {
    const [rows] = await db.query(
      `SELECT * FROM users WHERE username = ?`,
      [username]
    );
    return rows[0];
  }

  static async updateSpinResult(user) {
    await db.query(
      `UPDATE users SET balance = ?, spin_count = ?, history = ?, behavior_mode = ?, force_jackpot = ? WHERE username = ?`,
      [user.balance, user.spin_count, JSON.stringify(user.history), user.behavior_mode, user.force_jackpot, user.username]
    );
  }

  static async updateBalance(username, newBalance, newHistory) {
    await db.query(
      `UPDATE users SET balance = ?, history = ? WHERE username = ?`,
      [newBalance, JSON.stringify(newHistory), username]
    );
  }

  static async getAllUsers() {
    const [rows] = await db.query(`SELECT id, username, balance, spin_count, behavior_mode, force_jackpot FROM users WHERE username != 'admin'`);
    return rows;
  }

  static async getAdminStats() {
    const [rows] = await db.query(`
      SELECT 
        COUNT(*) as totalUsers, 
        SUM(balance) as totalBalance, 
        SUM(spin_count) as totalSpins 
      FROM users WHERE username != 'admin'
    `);
    const stats = rows[0] || { totalUsers: 0, totalBalance: 0, totalSpins: 0 };
    
    // Calculate house profit (Assuming each user starts with 50,000)
    // House Profit = (totalUsers * 50000) - totalBalance
    const houseProfit = (stats.totalUsers * 50000) - stats.totalBalance;
    
    // Mock history for the chart (Edu purposes)
    const history = [
      houseProfit * 0.4,
      houseProfit * 0.6,
      houseProfit * 0.8,
      houseProfit * 0.9,
      houseProfit
    ];

    return {
      ...stats,
      houseProfit,
      history
    };
  }

  static async createUser(username, password) {
    await db.query(
      `INSERT INTO users (username, password) VALUES (?, ?)`,
      [username, password]
    );
  }

  static async updateUser(id, updateData) {
    const { username, password, balance, behavior_mode, current_seed, reset_spin } = updateData;
    let updateQuery = `UPDATE users SET username = ?, password = ?, balance = ?, behavior_mode = ?, current_seed = ?`;
    let params = [username, password, parseInt(balance) || 0, behavior_mode, current_seed];

    if (reset_spin) {
      updateQuery += `, spin_count = 0`;
    }

    updateQuery += ` WHERE id = ?`;
    params.push(id);

    await db.query(updateQuery, params);
  }

  static async setForceJackpot(id) {
    await db.query(`UPDATE users SET force_jackpot = 1 WHERE id = ?`, [id]);
  }

  static async deleteUser(id) {
    await db.query(`DELETE FROM users WHERE id = ?`, [id]);
  }
}

module.exports = UserModel;
