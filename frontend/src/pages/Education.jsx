import React from 'react';
import { BookOpen, AlertCircle, TrendingDown, BrainCircuit } from 'lucide-react';

function Education() {
  return (
    <div className="p-4 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-purple)] to-[var(--color-neon-gold)] tracking-wider flex items-center justify-center gap-2">
          <BookOpen /> PUSAT EDUKASI
        </h1>
        <p className="text-gray-400 text-sm mt-2">Pahami bagaimana sistem ini dirancang untuk merugikan Anda.</p>
      </div>

      <div className="bg-[var(--color-gambler-panel)] rounded-2xl p-5 border border-gray-800 shadow-md">
        <div className="flex items-center gap-3 mb-3">
          <BrainCircuit className="text-[var(--color-neon-purple)]" size={24} />
          <h2 className="font-bold text-lg">Ilusi Kemenangan Awal</h2>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed mb-3">
          Banyak algoritma perjudian memberikan kemenangan beruntun (winning streak) pada awal permainan untuk pemain baru. Ini memicu pelepasan dopamin di otak Anda, yang secara psikologis membentuk ilusi bahwa "kemungkinan menang itu tinggi", padahal ini hanya taktik untuk mengakali Anda agar bertaruh lebih besar nanti.
        </p>
      </div>

      <div className="bg-[var(--color-gambler-panel)] rounded-2xl p-5 border border-gray-800 shadow-md">
        <div className="flex items-center gap-3 mb-3">
          <TrendingDown className="text-[var(--color-neon-red)]" size={24} />
          <h2 className="font-bold text-lg">House Edge</h2>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed mb-3">
          "House Edge" adalah persentase tetap yang disetel oleh bandar yang memastikan mereka mengambil keuntungan dari setiap taruhan Anda secara jangka panjang. Semakin lama Anda bermain, probabilitas saldo Anda menjadi nol mendekati 100%. Bandar selalu menang secara matematis.
        </p>
      </div>

      <div className="bg-red-950/40 rounded-2xl p-5 border border-[var(--color-neon-red)] shadow-[0_0_15px_rgba(255,0,60,0.1)]">
        <div className="flex items-center gap-3 mb-3">
          <AlertCircle className="text-[var(--color-neon-red)]" size={24} />
          <h2 className="font-bold text-lg text-white">Butuh Bantuan?</h2>
        </div>
        <p className="text-red-200 text-sm leading-relaxed mb-4">
          Perjudian online (Judol) sering berujung pada kecanduan yang menghancurkan ekonomi keluarga, kesehatan mental, hingga menyebabkan tindakan kriminal.
        </p>
        <div className="bg-black/50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-400 mb-1">Berhenti sekarang sebelum terlambat.</p>
          <p className="font-bold text-[var(--color-neon-red)]">Jauhi Judol.</p>
        </div>
      </div>

    </div>
  );
}

export default Education;
