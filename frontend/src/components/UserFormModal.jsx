import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { createUser, updateUser } from '../api/userApi';

function UserFormModal({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    balance: '',
    behavior_mode: 'normal',
    current_seed: '',
    reset_spin: false
  });
  const [loading, setLoading] = useState(false);
  const [errorMSG, setErrorMSG] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        password: user.password || '',
        balance: user.balance || '',
        behavior_mode: user.behavior_mode || 'normal',
        current_seed: user.current_seed || '',
        reset_spin: false
      });
    } else {
      setFormData({ 
        username: '', 
        password: '', 
        balance: '', 
        behavior_mode: 'normal',
        current_seed: 'seed_' + Math.random().toString(36).substring(7),
        reset_spin: false
      });
    }
    setErrorMSG('');
  }, [user, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMSG('');
    
    try {
      if (user) {
        await updateUser(user.id, formData);
      } else {
        await createUser(formData);
      }

      onSave(); // Refresh data
      onClose();
    } catch (err) {
      setErrorMSG(err.message || 'Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-xl bg-[#0F172A] border border-[#1E293B] text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
                
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E293B] bg-[#0a0f1c]">
                  <Dialog.Title as="h3" className="text-lg font-bold text-white uppercase tracking-wider">
                    {user ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
                  </Dialog.Title>
                  <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-6 border-b border-[#1E293B]">
                  {errorMSG && (
                    <div className="mb-4 bg-red-900/40 border border-red-500/50 p-3 rounded-lg text-red-400 text-sm font-semibold">
                      {errorMSG}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                      <input
                        required
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="w-full bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--color-neon-purple)]"
                        placeholder="e.g. jukistheboss"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                      <input
                        required
                        type="text"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--color-neon-purple)]"
                        placeholder="Password untuk akses"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Saldo Awal / Injeksi (Rp)</label>
                      <input
                        required
                        type="number"
                        min="0"
                        value={formData.balance}
                        onChange={(e) => setFormData({...formData, balance: e.target.value})}
                        className="w-full bg-[#1E293B] border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--color-neon-purple)]"
                        placeholder="Contoh: 50000"
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-800">
                      <label className="block text-sm font-bold text-[var(--color-neon-gold)] mb-3">KONFIGURASI ALGORITMA (PRNG)</label>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Behavior Mode</label>
                          <select 
                            value={formData.behavior_mode}
                            onChange={(e) => setFormData({...formData, behavior_mode: e.target.value})}
                            className="w-full bg-[#1E293B] border border-gray-700 rounded-lg px-2 py-2 text-white focus:outline-none focus:border-[var(--color-neon-purple)]"
                          >
                            <option value="hook">HOOK (Gacor)</option>
                            <option value="normal">NORMAL</option>
                            <option value="drain">DRAIN (Kuras)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Seeded PRNG</label>
                          <input
                            type="text"
                            value={formData.current_seed}
                            onChange={(e) => setFormData({...formData, current_seed: e.target.value})}
                            className="w-full bg-[#1E293B] border border-gray-700 rounded-lg px-2 py-2 text-white text-xs focus:outline-none"
                            placeholder="Seed string..."
                          />
                        </div>
                      </div>

                      {user && (
                        <div className="mt-4 flex items-center gap-2">
                          <input 
                            type="checkbox"
                            id="reset_spin"
                            checked={formData.reset_spin}
                            onChange={(e) => setFormData({...formData, reset_spin: e.target.checked})}
                            className="w-4 h-4 accent-purple-500"
                          />
                          <label htmlFor="reset_spin" className="text-xs text-gray-400">Restart deterministik sequence (Reset Spin Count)</label>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                    <button
                      type="button"
                      className="w-full sm:w-auto px-5 py-2.5 bg-[#1E293B] hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                      onClick={onClose}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-5 py-2.5 bg-[var(--color-neon-purple)] hover:bg-purple-500 text-white font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(157,0,255,0.4)] disabled:opacity-50"
                    >
                      {loading ? 'Menyimpan...' : 'Simpan Dataset'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default UserFormModal;
