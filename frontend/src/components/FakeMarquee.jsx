import React, { useState, useEffect } from 'react';
import { Trophy, Coins, Zap } from 'lucide-react';

const FAKE_MESSAGES = [
  { text: "User B***z baru saja Jackpot Rp 25.000.000!", icon: Trophy, color: "text-[var(--color-neon-gold)]" },
  { text: "User A***k berhasil Withdraw Rp 15.000.000", icon: Coins, color: "text-green-400" },
  { text: "Mesin Slot Gacor Gate of O***s sedang panas!", icon: Zap, color: "text-[var(--color-neon-red)]" },
  { text: "User S***a baru saja Maxwin x5000!", icon: Trophy, color: "text-[var(--color-neon-gold)]" },
  { text: "User R***i berhasil Withdraw Rp 8.500.000", icon: Coins, color: "text-green-400" },
];

function FakeMarquee() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Duplicate messages to create a seamless loop
    setMessages([...FAKE_MESSAGES, ...FAKE_MESSAGES]);
  }, []);

  return (
    <div className="w-full bg-[#0a0a0f] border-b border-gray-800 overflow-hidden py-2 relative flex items-center">
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10" />
      
      <div className="flex whitespace-nowrap animate-marquee items-center">
        {messages.map((msg, idx) => {
          const Icon = msg.icon;
          return (
            <div key={idx} className="flex items-center gap-2 mx-8 text-sm font-semibold text-gray-300">
              <Icon size={14} className={msg.color} />
              <span>{msg.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FakeMarquee;
