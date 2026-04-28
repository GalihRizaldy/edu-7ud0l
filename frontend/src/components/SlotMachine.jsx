import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { motion, useAnimation } from 'framer-motion';
import { SYMBOLS, SYMBOL_HEIGHT, STRIP_LENGTH, BET_AMOUNT } from '../constants/gameConstants';
import { spinSlot } from '../api/spinApi';

// Generate a long repeating array
const baseReel = Array.from({ length: STRIP_LENGTH }, (_, i) => SYMBOLS[i % SYMBOLS.length]);

function SlotMachine({ onSpinResult }) {
  const { balance, setBalance, setSpinCount, setHistory, role, username } = useContext(AppContext);
  const [isSpinning, setIsSpinning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showJackpot, setShowJackpot] = useState(false);

  // Framer Motion controls for each reel
  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const controls3 = useAnimation();

  // Initial setup: position on a random symbol near the top
  useEffect(() => {
    controls1.set({ y: -(Math.floor(Math.random() * 4) * SYMBOL_HEIGHT) });
    controls2.set({ y: -(Math.floor(Math.random() * 4) * SYMBOL_HEIGHT) });
    controls3.set({ y: -(Math.floor(Math.random() * 4) * SYMBOL_HEIGHT) });
  }, [controls1, controls2, controls3]);

  const spinSingle = async () => {
    try {
      const data = await spinSlot(username || 'user');
      return data;
    } catch (err) {
      throw err;
    }
  };

  const startSpinSequence = async (times) => {
    if (balance < BET_AMOUNT * times) {
      setErrorMsg(`Saldo tidak cukup untuk ${times} putaran (Rp ${(BET_AMOUNT * times).toLocaleString('id-ID')})`);
      return;
    }
    
    setErrorMsg('');
    let currentBalance = balance;

    for (let i = 0; i < times; i++) {
      if (currentBalance < BET_AMOUNT) {
        setErrorMsg("Saldo habis sebelum putaran selesai.");
        break;
      }

      setIsSpinning(true);

      // Start infinite blur spin
      const spinConfig = {
        y: [0, -(STRIP_LENGTH - 4) * SYMBOL_HEIGHT],
        transition: {
          repeat: Infinity,
          ease: "linear",
          duration: 0.8
        }
      };

      controls1.start(spinConfig);
      controls2.start(spinConfig);
      controls3.start(spinConfig);

      try {
        const data = await spinSingle();
        
        // Wait realistic time for server + "anticipation"
        await new Promise(resolve => setTimeout(resolve, 800));

        // The exact target indices (placed deep in the strip to allow scroll deceleration)
        // E.g., data.reels might be [0, 2, 1]
        // We target the 50th item segment corresponding to that symbol index.
        const baseTargetOffset = Math.floor(STRIP_LENGTH - 10);
        
        // Calculate the exact strip index that corresponds to the backend result symbol
        const targetInd1 = baseTargetOffset + data.reels[0];
        const targetInd2 = baseTargetOffset + data.reels[1];
        const targetInd3 = baseTargetOffset + data.reels[2];

        // Animate them stopping with a staggered delay
        controls1.stop();
        controls1.start({
          y: -(targetInd1 * SYMBOL_HEIGHT),
          transition: { type: "spring", stiffness: 50, damping: 20, mass: 1 }
        });

        await new Promise(resolve => setTimeout(resolve, 400));
        controls2.stop();
        controls2.start({
          y: -(targetInd2 * SYMBOL_HEIGHT),
          transition: { type: "spring", stiffness: 50, damping: 20, mass: 1 }
        });

        await new Promise(resolve => setTimeout(resolve, 400));
        controls3.stop();
        controls3.start({
          y: -(targetInd3 * SYMBOL_HEIGHT),
          transition: { type: "spring", stiffness: 50, damping: 20, mass: 1 }
        });

        // Wait for all springs to settle
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (data.isJackpot) {
          setShowJackpot(true);
          // Getaran 3 detik untuk Jackpot
          if ("vibrate" in navigator) navigator.vibrate(3000);
          
          // Wait for the jackpot animation duration
          await new Promise(resolve => setTimeout(resolve, 3500));
          setShowJackpot(false);
        } else if (data.win) {
          // Getaran 1 detik untuk Menang Biasa
          if ("vibrate" in navigator) navigator.vibrate(1000);
        }

        setIsSpinning(false);
        setBalance(data.balance);
        setSpinCount(data.spinCount);
        setHistory(data.history);
        onSpinResult(data);
        currentBalance = data.balance;

        if (i < times - 1) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }

      } catch (err) {
        console.error(err);
        setErrorMsg(err.message || "Gagal terhubung ke server");
        // Ensure animations are stopped even on error
        controls1.stop();
        controls2.stop();
        controls3.stop();
        setIsSpinning(false);
        break;
      } finally {
        setIsSpinning(false);
      }
    }
  };

  return (
    <div className={`w-full flex flex-col items-center transition-all duration-300 ${showJackpot ? 'scale-[1.02] drop-shadow-[0_0_50px_rgba(255,183,0,1)]' : ''}`}>
      {/* Slot Machine Display */}
      <div className={`bg-[#11111a] border-2 rounded-2xl p-4 w-full relative overflow-hidden transition-colors duration-500 ${
        showJackpot ? 'border-[var(--color-neon-gold)] shadow-[0_0_80px_rgba(255,183,0,0.8)]' : 'border-[var(--color-neon-purple)] shadow-[0_0_30px_rgba(157,0,255,0.3)]'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 pointer-events-none rounded-2xl z-10" />
        
        {/* Jackpot Overlay */}
        {showJackpot && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 animate-in fade-in zoom-in duration-500">
            <motion.div 
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-[0_0_30px_rgba(255,183,0,1)] text-center tracking-tighter"
              style={{ WebkitTextStroke: '2px #ffb700' }}
            >
              JACKPOT<br/>x10
            </motion.div>
          </div>
        )}
        
        <div className="flex justify-between items-center bg-[#050508] p-2 rounded-lg border-y-2 border-gray-800 h-28 overflow-hidden relative shadow-inner">
          
          {/* Reel 1 */}
          <div className="flex-1 overflow-hidden h-full relative">
            <motion.div animate={controls1} className={`flex flex-col items-center w-full ${isSpinning ? 'blur-[1.5px]' : ''}`}>
              {baseReel.map((sym, index) => (
                <div key={index} className="flex justify-center items-center text-6xl drop-shadow-lg" style={{ height: SYMBOL_HEIGHT }}>
                  {sym}
                </div>
              ))}
            </motion.div>
          </div>

          <div className="w-[1px] h-full bg-gray-800 mx-1 z-10" />

          {/* Reel 2 */}
          <div className="flex-1 overflow-hidden h-full relative">
            <motion.div animate={controls2} className={`flex flex-col items-center w-full ${isSpinning ? 'blur-[1.5px]' : ''}`}>
              {baseReel.map((sym, index) => (
                <div key={index} className="flex justify-center items-center text-6xl drop-shadow-lg" style={{ height: SYMBOL_HEIGHT }}>
                  {sym}
                </div>
              ))}
            </motion.div>
          </div>

          <div className="w-[1px] h-full bg-gray-800 mx-1 z-10" />

          {/* Reel 3 */}
          <div className="flex-1 overflow-hidden h-full relative">
            <motion.div animate={controls3} className={`flex flex-col items-center w-full ${isSpinning ? 'blur-[1.5px]' : ''}`}>
              {baseReel.map((sym, index) => (
                <div key={index} className="flex justify-center items-center text-6xl drop-shadow-lg" style={{ height: SYMBOL_HEIGHT }}>
                  {sym}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Middle highlight line */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[var(--color-neon-gold)]/20 shadow-[0_0_10px_rgba(255,183,0,0.5)] z-20 pointer-events-none" />
        </div>
      </div>
      
      {errorMsg && (
        <div className="text-[var(--color-neon-red)] text-sm mt-3 font-semibold bg-red-900/20 px-4 py-2 rounded border border-[var(--color-neon-red)]">
          {errorMsg}
        </div>
      )}

      {/* Putar Buttons (1x, 5x, 10x) */}
      <div className="w-full grid grid-cols-3 gap-3 mt-6">
        <button 
          onClick={() => startSpinSequence(1)}
          disabled={isSpinning}
          className={`flex items-center justify-center text-sm font-bold py-3 px-2 rounded-xl border transition-all ${
            isSpinning ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700' : 'bg-[#11111a] text-[var(--color-neon-gold)] border-[var(--color-neon-gold)] hover:bg-yellow-900/30'
          }`}
        >
          Putar 1x
        </button>

        <button 
          onClick={() => startSpinSequence(5)}
          disabled={isSpinning}
          className={`flex items-center justify-center text-sm font-bold py-3 px-2 rounded-xl border transition-all ${
            isSpinning ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700' : 'bg-[#11111a] text-[var(--color-neon-gold)] border-[var(--color-neon-gold)] hover:bg-yellow-900/30'
          }`}
        >
          Putar 5x
        </button>

        <button 
          onClick={() => startSpinSequence(10)}
          disabled={isSpinning}
          className={`flex flex-col items-center justify-center text-sm font-bold py-2 px-2 rounded-xl shadow-[0_0_15px_rgba(255,183,0,0.3)] transition-all ${
            isSpinning ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700 opacity-80' : 'bg-gradient-to-b from-[var(--color-neon-gold)] to-yellow-600 text-black hover:scale-105 active:scale-95'
          }`}
        >
          <span>AUTO MAX</span>
          <span className="text-[10px] uppercase font-black opacity-80">(10x)</span>
        </button>
      </div>
    </div>
  );
}

export default SlotMachine;
