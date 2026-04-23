import React from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

function BalanceChart({ history }) {
  const data = {
    labels: history.map((_, index) => index),
    datasets: [
      {
        fill: true,
        label: 'Saldo (Rp)',
        data: history,
        borderColor: '#ff003c',
        backgroundColor: 'rgba(255, 0, 60, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#666',
          maxTicksLimit: 10
        }
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#666',
          callback: function(value) {
            return 'Rp ' + (value / 1000) + 'k';
          }
        }
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div className="w-full h-48 mt-4 bg-[#0d0d14] rounded-xl p-4 border border-gray-800 shadow-inner">
      <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Tren Saldo Anda</h3>
      <div className="w-full h-36">
        <Line options={options} data={data} />
      </div>
    </div>
  );
}

export default BalanceChart;
