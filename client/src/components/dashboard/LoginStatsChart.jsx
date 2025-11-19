import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useLoginStats } from './hooks/useLoginStats';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function LoginStatsChart({ userId }) {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const { stats, loading } = useLoginStats(userId, selectedPeriod);

  const periods = [
    { value: 'weekly', label: 'Haftalık' },
    { value: 'monthly', label: 'Aylık' },
    { value: '6months', label: '6 Aylık' },
    { value: 'yearly', label: 'Yıllık' }
  ];

  const getChartData = () => {
    if (!stats || !stats.data || stats.data.length === 0) {
      return {
        labels: ['Veri Yok'],
        datasets: [{
          label: 'Giriş Sayısı',
          data: [0],
          backgroundColor: 'rgba(147, 51, 234, 0.6)',
          borderColor: 'rgba(147, 51, 234, 1)',
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }]
      };
    }

    const labels = stats.data.map(item => {
      const date = new Date(item.period);
      switch (selectedPeriod) {
        case 'weekly':
        case 'monthly':
          return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' });
        case '6months':
          return `Hafta ${Math.ceil(date.getDate() / 7)}`;
        case 'yearly':
          return date.toLocaleDateString('tr-TR', { month: 'short' });
        default:
          return item.period;
      }
    });

    return {
      labels,
      datasets: [{
        label: 'Giriş Sayısı',
        data: stats.data.map(item => item.count),
        backgroundColor: [
          'rgba(147, 51, 234, 0.6)',
          'rgba(59, 130, 246, 0.6)',
          'rgba(16, 185, 129, 0.6)',
          'rgba(245, 158, 11, 0.6)',
          'rgba(239, 68, 68, 0.6)',
          'rgba(139, 92, 246, 0.6)',
          'rgba(236, 72, 153, 0.6)',
        ],
        borderColor: [
          'rgba(147, 51, 234, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(147, 51, 234, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context) {
            const date = new Date(stats.data[context[0].dataIndex].period);
            return date.toLocaleDateString('tr-TR', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric' 
            });
          },
          label: function(context) {
            return `Giriş Sayısı: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <motion.div 
        className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20 h-full flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white/70">Yükleniyor...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20 h-full flex flex-col"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Giriş İstatistikleri</h3>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="bg-white/20 text-white border border-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {periods.map(period => (
            <option key={period.value} value={period.value} className="bg-gray-800">
              {period.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex-1 min-h-0">
        <Bar data={getChartData()} options={chartOptions} />
      </div>
      
      {stats && stats.data && stats.data.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-white/70">Bu dönemde giriş verisi bulunmuyor</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

