import { Outlet, NavLink } from 'react-router-dom';
import { LogOut, Home, BookOpen, Wallet } from 'lucide-react';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

function Layout() {
  const { logout } = useContext(AppContext);

  return (
    <div className="min-h-screen pb-20 flex flex-col relative w-full max-w-md mx-auto bg-[var(--color-gambler-bg)] shadow-2xl border-x border-gray-900">
      <main className="flex-grow overflow-x-hidden">
        <Outlet />
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={logout}
        className="absolute bottom-24 right-4 bg-[var(--color-neon-red)] text-white rounded-full p-4 shadow-[0_0_15px_rgba(255,0,60,0.6)] flex items-center justify-center transition-all z-50 group hover:pr-6"
      >
        <LogOut size={24} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap font-bold text-sm">
          Bertaubat / Keluar
        </span>
      </button>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full bg-[var(--color-gambler-panel)] border-t border-gray-800 flex justify-around items-center h-16 z-40">
        <NavLink 
          to="/simulasi" 
          className={({isActive}) => 
            `flex flex-col items-center justify-center w-full h-full transition-colors ${isActive ? 'text-[var(--color-neon-purple)]' : 'text-gray-500 hover:text-gray-300'}`
          }
        >
          <Home size={24} />
          <span className="text-xs mt-1 font-semibold">Simulasi</span>
        </NavLink>
        <NavLink 
          to="/topup" 
          className={({isActive}) => 
            `flex flex-col items-center justify-center w-full h-full transition-colors ${isActive ? 'text-[var(--color-neon-gold)]' : 'text-gray-500 hover:text-gray-300'}`
          }
        >
          <Wallet size={24} />
          <span className="text-xs mt-1 font-semibold">Top Up</span>
        </NavLink>
        <NavLink 
          to="/edukasi" 
          className={({isActive}) => 
            `flex flex-col items-center justify-center w-full h-full transition-colors ${isActive ? 'text-[var(--color-neon-purple)]' : 'text-gray-500 hover:text-gray-300'}`
          }
        >
          <BookOpen size={24} />
          <span className="text-xs mt-1 font-semibold">Edukasi</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default Layout;
