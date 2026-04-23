import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

function EducationalModal({ isOpen, onClose, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1a1a24] border border-[var(--color-neon-red)] rounded-2xl w-full max-w-sm overflow-hidden shadow-[0_0_30px_rgba(255,0,60,0.3)] animate-in zoom-in-95 duration-300">
        <div className="bg-[var(--color-neon-red)] p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle size={20} />
            <span>FAKTA SISTEM</span>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-200 text-center leading-relaxed">
            {message || "Mesin slot dirancang dengan algoritma probabilitas rendah setelah beberapa putaran. Anda tidak akan pernah menang secara matematis."}
          </p>
          <button 
            onClick={onClose}
            className="mt-6 w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors border border-gray-700"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}

export default EducationalModal;
