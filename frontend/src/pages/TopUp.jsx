import React, { useState, useEffect, useContext } from 'react';
import { Wallet, Sparkles, Timer } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { topUpBalance } from '../api/userApi';
import { formatCurrency, formatTime } from '../utils/formatters';

function TopUp() {
  const { role, username, balance, setBalance, setHistory } = useContext(AppContext);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fake Urgency Timer State
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 300; // Fake urgency: always resets!
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const amounts = [50000, 100000, 500000, 1000000];

  const handleTopUp = async () => {
    if (selectedAmount <= 0) return;
    
    setLoading(true);
    setMessage('');
    try {
      const data = await topUpBalance(username || 'user', selectedAmount);
      
      setBalance(data.balance);
      setHistory(data.history);
      setMessage(data.message);
      setSelectedAmount(0);
    } catch (error) {
      setMessage(error.message || 'Kesalahan koneksi ke server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center h-full pt-10">
      <div className="w-full max-w-sm mb-6 text-center">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-purple)] to-[var(--color-neon-gold)] tracking-wider flex items-center justify-center gap-2 mb-2">
          <Wallet /> TOP UP SALDO
        </h1>
        <p className="text-gray-400 text-sm">Masukan saldo untuk melanjutkan simulasi algoritma bandar.</p>
      </div>

      {/* Fake Urgency Banner */}
      <div className="w-full max-w-sm mb-4 bg-red-900/60 border-2 border-[var(--color-neon-red)] rounded-xl p-3 shadow-[0_0_20px_rgba(255,0,60,0.5)] animate-pulse flex flex-col items-center justify-center">
        <p className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 mb-1">
          <Timer size={14} className="text-[var(--color-neon-gold)]" />
          Promo Deposit Bonus 100%
        </p>
        <p className="text-2xl font-black text-[var(--color-neon-gold)] drop-shadow-[0_0_5px_rgba(255,183,0,0.8)]">
          BERAKHIR DALAM: {formatTime(timeLeft)}
        </p>
      </div>

      <div className="bg-[var(--color-gambler-panel)] border border-gray-800 shadow-lg rounded-2xl p-6 w-full max-w-sm relative">
        <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Saldo Saat Ini</p>
        <h2 className="text-3xl font-black text-white mb-6">
          {formatCurrency(balance)}
        </h2>

        {message && (
          <div className="mb-4 p-3 bg-green-900/40 border border-green-500 rounded-lg text-green-400 text-sm text-center font-semibold">
            {message}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-6">
          {amounts.map((amount) => (
            <button
              key={amount}
              onClick={() => setSelectedAmount(amount)}
              className={`p-3 rounded-xl border text-sm font-bold transition-all ${
                selectedAmount === amount 
                  ? 'border-[var(--color-neon-purple)] bg-purple-900/30 text-[var(--color-neon-purple)] shadow-[0_0_10px_rgba(157,0,255,0.3)]' 
                  : 'border-gray-700 bg-[#0f0f15] text-gray-400 hover:border-gray-500'
              }`}
            >
              Rp {(amount / 1000)}k
            </button>
          ))}
        </div>

        <button 
          onClick={handleTopUp}
          disabled={loading || selectedAmount === 0}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${
            loading || selectedAmount === 0
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
              : 'bg-gradient-to-r from-[var(--color-neon-purple)] to-[var(--color-neon-gold)] text-white hover:scale-105 shadow-[0_0_15px_rgba(157,0,255,0.4)]'
          }`}
        >
          {loading ? 'MEMPROSES...' : <><Sparkles size={20} /> TOP UP SEKARANG</>}
        </button>
      </div>

      <div className="mt-8 text-center text-xs text-red-400/80 max-w-sm px-4">
        *Ini adalah simulasi. Di dunia nyata, melakukan top up adalah jalan tercepat untuk jatuh miskin.
      </div>
    </div>
  );
}

export default TopUp;
