const UserModel = require('../models/userModel');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: "Username dan password diperlukan" });
  }

  try {
    const user = await UserModel.findByUsernameAndPassword(username, password);

    if (user) {
      const role = user.username === 'admin' ? 'admin' : 'user';
      res.json({ 
        success: true, 
        role,
        username: user.username,
        balance: user.balance,
        history: user.history ? JSON.parse(user.history) : [user.balance]
      });
    } else {
      res.status(401).json({ error: "Username atau password salah" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
};
