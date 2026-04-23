import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Database, AlertTriangle, Zap } from 'lucide-react';
import UserFormModal from '../components/UserFormModal';
import { fetchAllUsers, triggerJackpotUser, deleteUser as deleteUserService } from '../api/userApi';
import { formatCurrency } from '../utils/formatters';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
 
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchAllUsers();
      setUsers(data);
      setErrorMsg('');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchUsers();
  }, []);
 
  const handleCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };
 
  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };
 
  const handleTriggerJackpot = async (id) => {
    try {
      await triggerJackpotUser(id);
      alert("Berhasil! Akun ini akan mendapatkan Jackpot di putaran berikutnya.");
      fetchUsers();
    } catch (error) {
      console.error("Trigger Jackpot failed:", error);
      alert(error.message);
    }
  };
 
  const handleDelete = async (id) => {
    console.log("Attempting to delete user with ID:", id);
    try {
      await deleteUserService(id);
      console.log("Delete successful for ID:", id);
      fetchUsers();
    } catch (error) {
      console.error("Delete failed:", error);
      alert(error.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Database className="text-[var(--color-neon-purple)]" />
            MANAJEMEN KORBAN
          </h2>
          <p className="text-gray-400 text-sm mt-1">Kelola data pemain simulasi, suntik saldo, atau manipulasi akun.</p>
        </div>
        
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 bg-[var(--color-neon-purple)] hover:bg-purple-600 text-white px-4 py-2.5 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(157,0,255,0.4)]"
        >
          <Plus size={18} />
          Tambah Korban
        </button>
      </div>

      {errorMsg && (
        <div className="mb-6 bg-red-900/20 border border-[var(--color-neon-red)] p-4 rounded-xl flex items-center gap-3">
          <AlertTriangle className="text-[var(--color-neon-red)]" />
          <p className="text-[var(--color-neon-red)] font-semibold text-sm">{errorMsg}</p>
        </div>
      )}

      {/* Responsive Table Container */}
      <div className="bg-[#1E293B] border border-gray-800 rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0F172A] border-b border-gray-800 text-gray-400 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-black">ID</th>
                <th className="px-6 py-4 font-black">Username</th>
                <th className="px-6 py-4 font-black">Algo Mode</th>
                <th className="px-6 py-4 font-black">Saldo</th>
                <th className="px-6 py-4 font-black">Spins</th>
                <th className="px-6 py-4 font-black text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    Membaca dari Database...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    Tidak ada data pengguna.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#1a2333] transition-colors group">
                    <td className="px-6 py-4 text-gray-300">#{user.id}</td>
                    <td className="px-6 py-4 font-bold text-white">{user.username}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase border ${
                        user.behavior_mode === 'hook' ? 'bg-green-900/40 text-green-400 border-green-500' :
                        user.behavior_mode === 'drain' ? 'bg-red-900/40 text-red-500 border-red-500' :
                        'bg-blue-900/40 text-blue-400 border-blue-500'
                      }`}>
                        {user.behavior_mode || 'normal'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm font-bold border border-green-800/50">
                        {formatCurrency(user.balance)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{user.spin_count} putaran</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        <button 
                          onClick={() => handleTriggerJackpot(user.id)}
                          className="p-2 bg-gray-800 hover:bg-yellow-900/50 text-[var(--color-neon-gold)] rounded-lg transition-colors border border-gray-700"
                          title="Trigger Jackpot (Next Spin)"
                        >
                          <Zap size={16} />
                        </button>
                        <button 
                          onClick={() => handleEdit(user)}
                          className="p-2 bg-gray-800 hover:bg-blue-900/50 text-blue-400 rounded-lg transition-colors border border-gray-700"
                          title="Edit User"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2 bg-gray-800 hover:bg-red-900/50 text-red-500 rounded-lg transition-colors border border-gray-700"
                          title="Ban User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UserFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        user={editingUser}
        onSave={fetchUsers}
      />
    </div>
  );
}

export default AdminUsers;
