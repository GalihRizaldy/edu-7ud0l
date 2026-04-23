import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import SlotMachine from '../components/SlotMachine';
import BalanceChart from '../components/BalanceChart';
import EducationalModal from '../components/EducationalModal';
import FakeMarquee from '../components/FakeMarquee';
import { User, Wallet, Info, AlertTriangle, Loader2 } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

function Simulation() {
  const { balance, history, spinCount, username } = useContext(AppContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [lastMessage, setLastMessage] = useState('Selamat datang di simulasi. Silakan putar mesin.');
  const [toast, setToast] = useState(null);
  
  // Withdraw States
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');

  const handleSpinResult = (data) => {
    setLastMessage(data.message);

    if (data.isJackpot) {
      setToast("Jackpot memicu euforia. Sekarang sistem otomatis mengalihkan akun Anda ke Mode Kuras (Drain) untuk menyedot semuanya kembali.");
      setTimeout(() => setToast(null), 8000);
    } else if (data.win) {
      setToast("Kemenangan ini hanyalah umpan algoritma bandar untuk membuat Anda terus bermain.");
      setTimeout(() => setToast(null), 4000);
    } else if (data.behaviorMode === 'drain' && data.spinCount > 0 && data.spinCount % 5 === 0) {
      // Educational hint for pre-deterministic Kuras mode (only trigger every 5 spins)
      setToast("Sistem sedang menggunakan algoritma pre-determinasi. Seed Anda telah dikunci oleh sistem.");
      setTimeout(() => setToast(null), 6000);
    }

    if (data.spinCount % 5 === 0 && data.behaviorMode !== 'drain') {
      const extraFact = data.win 
        ? "Secara statistik, semakin lama Anda bermain, semakin besar kemungkinan Anda rugi."
        : "Tahukah Anda? Mesin slot diprogram secara matematis untuk memastikan bandar selalu untung (House Edge).";
      
      setModalMessage(extraFact);
      setModalOpen(true);
    }
  };

  const handleWithdraw = () => {
    setIsWithdrawing(true);
    setWithdrawError('');
    
    // Simulate manipulative processing delay
    setTimeout(() => {
      setIsWithdrawing(false);
      // Random excuse for why withdrawal fails
      const excuses = [
        "Penarikan Ditolak: Syarat TurnOver (TO) X5 belum terpenuhi.",
        "Penarikan Gagal: Server bank sedang mengalami gangguan.",
        "Penarikan Tertunda: Aktivitas mencurigakan terdeteksi pada akun Anda."
      ];
      const randomExcuse = excuses[Math.floor(Math.random() * excuses.length)];
      setWithdrawError(randomExcuse);
    }, 2500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <FakeMarquee />
      
      <div className="p-4 flex flex-col items-center max-w-lg mx-auto w-full">
        {toast && (
          <div className="fixed top-[15%] left-0 right-0 z-[100] flex justify-center px-4 animate-in slide-in-from-top-10 duration-500 fade-in">
            <div className="bg-[#1a0f2e] border-2 border-[var(--color-neon-purple)] rounded-xl p-4 shadow-[0_0_20px_rgba(157,0,255,0.7)] flex items-center gap-3 w-full max-w-sm">
              <Info size={28} className="text-[var(--color-neon-gold)] shrink-0" />
              <p className="text-white font-bold text-sm leading-snug">
                {toast}
              </p>
            </div>
          </div>
        )}

        {/* Header Profile & Balance */}
        <div className="w-full bg-[var(--color-gambler-panel)] rounded-2xl p-4 mb-6 shadow-lg border border-gray-800 flex justify-between items-center mt-2">
          <div className="flex items-center gap-3">
            <div className="bg-gray-800 p-2 rounded-full">
              <User size={20} className="text-gray-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Pemain</p>
              <p className="text-sm font-semibold">{username || 'Guest'}</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wide flex items-center justify-end gap-1">
              <Wallet size={12} /> Saldo
            </p>
            <p className={`text-xl font-black ${balance < 50000 ? 'text-[var(--color-neon-red)]' : 'text-[var(--color-neon-purple)]'}`}>
              {formatCurrency(balance)}
            </p>
          </div>
        </div>

        {/* Message Area */}
        <div className="w-full mb-4 bg-[#1a1a24] border-l-4 border-[var(--color-neon-gold)] p-3 rounded-r-lg flex items-start gap-3">
          <Info size={20} className="text-[var(--color-neon-gold)] shrink-0 mt-0.5" />
          <p className="text-sm text-gray-300 italic">
            "{lastMessage}"
          </p>
        </div>

        <SlotMachine onSpinResult={handleSpinResult} />

        <div className="w-full mt-6 mb-4">
          <BalanceChart history={history} />
        </div>

        {/* Fake Withdraw Feature */}
        <div className="w-full mb-8">
          <button 
            onClick={handleWithdraw}
            disabled={isWithdrawing}
            className="w-full py-4 rounded-xl font-black text-lg shadow-lg flex justify-center items-center gap-2 transition-all duration-300
                       bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white disabled:opacity-50"
          >
            {isWithdrawing ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                Memproses Penarikan...
              </>
            ) : (
              <>
                <Wallet size={24} />
                TARIK DANA (WITHDRAW)
              </>
            )}
          </button>

          {withdrawError && (
            <div className="mt-4 bg-red-900/40 border border-[var(--color-neon-red)] p-4 rounded-xl flex items-start gap-3 animate-in fade-in zoom-in duration-300">
              <AlertTriangle className="text-[var(--color-neon-red)] shrink-0 mt-0.5" />
              <div>
                <p className="text-[var(--color-neon-red)] font-bold text-sm uppercase mb-1">PENARIKAN DIBATALKAN</p>
                <p className="text-red-200 text-sm font-semibold">{withdrawError}</p>
                <p className="text-xs text-gray-400 mt-2 italic">*Realita: Uang yang masuk ke situs ilegal sangat sulit ditarik kembali berkat modus syarat-syarat sepihak.*</p>
              </div>
            </div>
          )}
        </div>

        <EducationalModal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          message={modalMessage} 
        />
      </div>
    </div>
  );
}

export default Simulation;
