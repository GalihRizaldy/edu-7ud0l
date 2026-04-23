const UserModel = require('../models/userModel');

exports.topUp = async (req, res) => {
  const { username, amount } = req.body;
  if (!username || !amount || amount <= 0) {
    return res.status(400).json({ error: "Data tidak valid" });
  }

  try {
    const user = await UserModel.findByUsername(username);
    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    const newBalance = user.balance + amount;
    let history = user.history ? (typeof user.history === 'string' ? JSON.parse(user.history) : user.history) : [];
    history.push(newBalance);

    await UserModel.updateBalance(username, newBalance, history);

    res.json({
      message: `Top up Rp ${amount.toLocaleString('id-ID')} berhasil. Uang Anda sudah di sistem kami sekarang.`,
      balance: newBalance,
      history
    });

  } catch (error) {
    console.error("TopUp error:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await UserModel.getAdminStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    await UserModel.createUser(username, password);
    res.json({ message: "User created" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    await UserModel.updateUser(id, req.body);
    res.json({ message: "User updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.triggerJackpot = async (req, res) => {
  const { id } = req.params;
  try {
    await UserModel.setForceJackpot(id);
    res.json({ message: "Jackpot triggered for next spin" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await UserModel.deleteUser(id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
