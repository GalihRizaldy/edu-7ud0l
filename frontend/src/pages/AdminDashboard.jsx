import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { LogOut, Users, RefreshCw, Activity, DollarSign, PieChart } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { fetchAdminStats } from '../api/userApi';
import { formatCurrency } from '../utils/formatters';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

function AdminDashboard() {
  const { logout } = useContext(AppContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchStats = async () => {
    try {
      const data = await fetchAdminStats();
      setStats(data);
      setErrorMsg('');
    } catch (err) {
      setErrorMsg(err.message || "Gagal mengambil data dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Poll every 5 seconds to show live updates if someone is playing
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: stats?.history.map((_, i) => `Hari ${i+1}`) || [],
    datasets: [
      {
        fill: true,
        label: 'Keuntungan Bandar (Rp)',
        data: stats?.history || [],
        borderColor: '#9d00ff',
        backgroundColor: 'rgba(157, 0, 255, 0.2)',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#fff'
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a3a3a3' } },
      y: { 
        grid: { color: 'rgba(255,255,255,0.05)' }, 
        ticks: { color: '#a3a3a3', callback: (value) => 'Rp ' + (value/1000000) + 'M' } 
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">

      <div className="max-w-7xl mx-auto">
        {loading && !stats ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="animate-spin text-[var(--color-neon-purple)]" size={40} />
          </div>
        ) : errorMsg ? (
          <div className="bg-red-900/50 text-[#ff003c] p-4 rounded-lg border border-[var(--color-neon-red)]">
            {errorMsg}
          </div>
        ) : (
          <>
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              <div className="bg-[var(--color-gambler-panel)] rounded-2xl p-6 border border-gray-800 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <DollarSign size={80} />
                </div>
                <p className="text-gray-400 font-bold text-sm tracking-widest uppercase mb-2">Total Keuntungan Bandar</p>
                <h2 className="text-3xl md:text-4xl font-black text-[var(--color-neon-gold)]">
                  {formatCurrency(stats.houseProfit)}
                </h2>
                <p className="text-xs text-green-500 mt-2 font-semibold">↑ Margin Absolut 100% Tercapai</p>
              </div>

              <div className="bg-[var(--color-gambler-panel)] rounded-2xl p-6 border border-gray-800 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Users size={80} />
                </div>
                <p className="text-gray-400 font-bold text-sm tracking-widest uppercase mb-2">Total Pengguna Dibodohi</p>
                <h2 className="text-3xl md:text-4xl font-black text-[var(--color-neon-purple)]">
                  {stats.totalUsers.toLocaleString('id-ID')}
                </h2>
                <p className="text-xs text-gray-500 mt-2">Termasuk pengguna dummy dan organik</p>
              </div>

              <div className="bg-[var(--color-gambler-panel)] rounded-2xl p-6 border border-gray-800 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Activity size={80} />
                </div>
                <p className="text-gray-400 font-bold text-sm tracking-widest uppercase mb-2">Total Putaran Mesin</p>
                <h2 className="text-3xl md:text-4xl font-black text-white">
                  {stats.totalSpins.toLocaleString('id-ID')}
                </h2>
                <p className="text-xs text-gray-500 mt-2">Dihitung dari seluruh sesi simulasi</p>
              </div>
              
            </div>

            {/* Chart Area */}
            <div className="bg-[var(--color-gambler-panel)] rounded-2xl p-6 border border-gray-800 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold">Tren Keuntungan Platform (House Edge)</h3>
                  <p className="text-sm text-gray-400">Grafik membuktikan bahwa sistem pada akhirnya akan menyedot habis modal pemain.</p>
                </div>
                <button onClick={fetchStats} className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition">
                  <RefreshCw size={20} className={loading ? "animate-spin text-gray-400" : "text-gray-400"} />
                </button>
              </div>
              
              <div className="h-80 w-full relative">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
}

export default AdminDashboard;
