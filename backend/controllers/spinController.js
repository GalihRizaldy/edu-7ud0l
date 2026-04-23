const seedrandom = require('seedrandom');
const UserModel = require('../models/userModel');

const SYMBOLS = ['🍒', '🍋', '🔔', '💎'];
const BET_AMOUNT = 5000;
const WIN_MULTIPLIER = 2;

const MESSAGES = [
  "Bagus! Tapi ingat, kemenangan ini dirancang untuk membuatmu terus bermain.",
  "Kamu menang! Secara statistik, waktunya bandar mengambil kembali.",
  "Dopamin sedang naik! Ini saatnya bandar memancingmu menambah taruhan."
];

function getRandomMessage() {
  return MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
}

function getRandomIndex() {
  return Math.floor(Math.random() * SYMBOLS.length);
}

exports.spin = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username diperlukan" });
  }

  try {
    const user = await UserModel.findByUsername(username);

    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    if (user.balance < BET_AMOUNT) {
      return res.status(400).json({ error: "Saldo tidak mencukupi" });
    }

    let history = user.history ? (typeof user.history === 'string' ? JSON.parse(user.history) : user.history) : [];

    const rng = seedrandom(user.current_seed + user.spin_count);
    const rngValue = rng.quick(); // Returns 0.0 - 1.0

    user.balance -= BET_AMOUNT;
    user.spin_count += 1;

    let isWin = false;
    let isJackpot = false;

    // Check Jackpot first
    if (user.force_jackpot === 1 || rngValue > 0.98) {
      isJackpot = true;
      isWin = true;
    } else if (user.behavior_mode === 'hook') {
      // Gacor Mode: Wins if RNG > 0.3 (70% Win Chance)
      isWin = rngValue > 0.3;
    } else if (user.behavior_mode === 'drain') {
      // Kuras Mode: Wins if RNG > 0.95 (Only 5% Win Chance)
      isWin = rngValue > 0.95;
    } else {
      // Normal Mode: ~20% Win Chance
      isWin = rngValue > 0.8;
    }

    let reels = [];
    if (isJackpot) {
      const idx = getRandomIndex();
      reels = [idx, idx, idx];
      user.balance += (BET_AMOUNT * 10); // 10x Multiplier
      user.behavior_mode = 'drain'; // Educational Twist: force drain after jackpot
      user.force_jackpot = 0; // Reset flag
    } else if (isWin) {
      const reelRng = seedrandom(user.current_seed + "_reel_" + user.spin_count);
      const idx = Math.floor(reelRng.quick() * SYMBOLS.length);
      reels = [idx, idx, idx];
      user.balance += (BET_AMOUNT * WIN_MULTIPLIER); // 2x Multiplier
    } else {
      const nearMissRng = seedrandom(user.current_seed + "_near_" + user.spin_count).quick();
      
      // 70% chance of a "Near Miss"
      if (nearMissRng < 0.7) {
        const reelRng = seedrandom(user.current_seed + "_r1_" + user.spin_count);
        const idx1 = Math.floor(reelRng.quick() * SYMBOLS.length);
        const missRng = seedrandom(user.current_seed + "_miss_" + user.spin_count);
        let idx3 = Math.floor(missRng.quick() * SYMBOLS.length);
        
        // Ensure the 3rd symbol is definitely different from the first two
        if (idx3 === idx1) {
          idx3 = (idx1 + 1) % SYMBOLS.length;
        }
        reels = [idx1, idx1, idx3];
      } else {
        const reelRng1 = seedrandom(user.current_seed + "_r1_" + user.spin_count);
        const reelRng2 = seedrandom(user.current_seed + "_r2_" + user.spin_count);
        const reelRng3 = seedrandom(user.current_seed + "_r3_" + user.spin_count);
        
        reels = [
          Math.floor(reelRng1.quick() * SYMBOLS.length), 
          Math.floor(reelRng2.quick() * SYMBOLS.length), 
          Math.floor(reelRng3.quick() * SYMBOLS.length)
        ];
        // Force non-match
        while (reels[0] === reels[1] && reels[1] === reels[2]) {
          reels[2] = (reels[2] + 1) % SYMBOLS.length;
        }
      }
    }

    history.push(user.balance);
    user.history = history;

    await UserModel.updateSpinResult(user);

    const response = {
      reels,
      win: isWin,
      isJackpot: isJackpot,
      balance: user.balance,
      spinCount: user.spin_count,
      history,
      behaviorMode: user.behavior_mode,
      message: isJackpot ? "JACKPOT! Hati-hati, bandar akan mengambilnya kembali!" : (isWin ? "Kamu menang! Algoritma sedang memancingmu..." : getRandomMessage())
    };

    res.json(response);

  } catch (error) {
    console.error("Spin error:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada server saat memutar slot" });
  }
};
