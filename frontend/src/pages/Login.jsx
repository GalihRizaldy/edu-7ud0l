import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authApi';

function Login() {
  const { setAuthData, setBalance, setHistory, setSpinCount } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await loginUser(username, password);

      if (data.success) {
        setBalance(data.balance);
        if (data.history) setHistory(typeof data.history === 'string' ? JSON.parse(data.history) : data.history);
        setSpinCount(0); // Optional reset or fetch from db
        
        setAuthData(data.role, username);
        
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/simulasi');
        }
      }
    } catch (err) {
      setError(err.message || 'Koneksi ke server gagal. Pastikan MariaDB berjalan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[var(--color-gambler-panel)] rounded-2xl shadow-2xl p-8 border border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-purple)] to-[var(--color-neon-gold)] tracking-wider">
            EDUJUDOL SIM
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Login <b>user</b> untuk simulasi<br/>
            Login <b>admin</b> untuk dashboard
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-[var(--color-neon-red)] rounded-lg text-[var(--color-neon-red)] text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#0f0f15] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-purple)] transition-colors"
              placeholder="Username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0f0f15] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon-purple)] transition-colors"
              placeholder="Password"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-[var(--color-neon-purple)] to-purple-700 hover:from-purple-600 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-lg shadow-[0_0_15px_rgba(157,0,255,0.4)] transition-all hover:scale-[1.02]"
          >
            MASUK
          </button>
        </form>
        
        <div className="mt-8 text-center text-xs text-gray-500">
          *Aplikasi ini hanya untuk tujuan edukasi bahaya perjudian online.
        </div>
      </div>
    </div>
  );
}

export default Login;
