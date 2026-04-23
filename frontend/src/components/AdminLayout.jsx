import React, { useState, useContext } from 'react';
import { Outlet, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Menu, X, Home, Users, LogOut } from 'lucide-react';
import { AppContext } from '../context/AppContext';

function AdminLayout() {
  const { role, logout } = useContext(AppContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  if (role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0F172A] border-r border-[#1E293B]">
      <div className="flex items-center justify-center h-20 border-b border-[#1E293B]">
        <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-purple)] to-[var(--color-neon-gold)] tracking-widest">
          ADMIN PRO
        </h1>
      </div>
      <div className="flex-1 px-4 py-8 space-y-4">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-lg font-semibold transition-all ${
              isActive 
                ? 'bg-purple-900/40 text-[var(--color-neon-purple)] border border-[var(--color-neon-purple)] shadow-[0_0_15px_rgba(157,0,255,0.2)]'
                : 'text-gray-400 hover:bg-[#1E293B] hover:text-white'
            }`
          }
        >
          <Home className="w-5 h-5 mr-4" />
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-lg font-semibold transition-all ${
              isActive 
                ? 'bg-purple-900/40 text-[var(--color-neon-purple)] border border-[var(--color-neon-purple)] shadow-[0_0_15px_rgba(157,0,255,0.2)]'
                : 'text-gray-400 hover:bg-[#1E293B] hover:text-white'
            }`
          }
        >
          <Users className="w-5 h-5 mr-4" />
          Kelola Akun
        </NavLink>
      </div>
      <div className="p-4 border-t border-[#1E293B]">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-red-400 transition-colors rounded-lg hover:bg-red-900/20 hover:text-red-300 font-semibold"
        >
          <LogOut className="w-5 h-5 mr-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0F172A] overflow-hidden font-sans">
      
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 md:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-[260px] flex-1 flex-col">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 pt-4 -mr-12">
                    <button
                      type="button"
                      className="flex items-center justify-center w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <X className="w-6 h-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="h-full flex flex-col bg-[#0F172A]">
                  <SidebarContent />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-[260px] md:flex-col md:fixed md:inset-y-0 z-40 bg-[#0F172A]">
        <SidebarContent />
      </div>

      {/* Main Content wrapper */}
      <div className="flex flex-col flex-1 w-full md:pl-[260px]">
        <div className="sticky top-0 z-10 flex items-center h-16 bg-[#0F172A] border-b border-[#1E293B] shadow-sm md:hidden">
          <button
            type="button"
            className="px-4 text-gray-400 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="w-6 h-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 font-bold tracking-widest text-[var(--color-neon-purple)]">
            ADMIN DASHBOARD
          </div>
        </div>

        <main className="flex-1 overflow-y-auto bg-[#0a0f1c] p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
