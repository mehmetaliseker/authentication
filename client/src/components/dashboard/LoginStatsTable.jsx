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
import { useAllLoginStats } from './hooks/useAllLoginStats';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function LoginStatsTable() {
  const { stats, loading } = useAllLoginStats();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const periods = [
    { value: 'weekly', label: 'Haftalık' },
    { value: 'monthly', label: 'Aylık' },
    { value: '6months', label: '6 Aylık' },
    { value: 'yearly', label: 'Yıllık' }
  ];

  const formatDate = (dateString) => {
    // Tarih string'ini direkt parse et (timezone sorunlarını önlemek için)
    const date = new Date(dateString);
    
    console.log(`Tarih işleme: ${dateString} -> Parse edilen: ${date.toISOString()} -> Yerel: ${date.toLocaleDateString('tr-TR')}`);
    
    switch (selectedPeriod) {
      case 'weekly':
        return date.toLocaleDateString('tr-TR', {
          weekday: 'short',
          day: '2-digit',
          month: '2-digit'
        });
      case 'monthly':
        // Hafta aralıkları - Pazartesi başlangıcı
        const monthWeekStart = new Date(date);
        monthWeekStart.setDate(date.getDate() - date.getDay() + 1); // Pazartesi başlangıcı
        const monthWeekEnd = new Date(monthWeekStart);
        monthWeekEnd.setDate(monthWeekStart.getDate() + 6);
        return `${monthWeekStart.getDate()}-${monthWeekEnd.getDate()} ${monthWeekStart.toLocaleDateString('tr-TR', { month: 'short' })}`;
      case '6months':
        return date.toLocaleDateString('tr-TR', {
          month: 'long'
        });
      case 'yearly':
        return date.toLocaleDateString('tr-TR', {
          month: 'long'
        });
      default:
        return dateString;
    }
  };

  const getChartData = () => {
    const currentStats = stats[selectedPeriod];
    
    if (!currentStats || !currentStats.data || currentStats.data.length === 0) {
      // Veri yoksa 4 boş sütun göster - sağdan sola (en yeni sağda)
      const maxColumns = 4;
      let labels = [];
      let data = [];
      
      for (let i = 0; i < maxColumns; i++) {
        const today = new Date();
        const targetDate = new Date(today);
        
        let label = '';
        switch (selectedPeriod) {
          case 'weekly':
            // Son 4 gün - bugünden başlayarak geriye doğru
            targetDate.setTime(today.getTime() - (i * 24 * 60 * 60 * 1000));
            label = targetDate.toLocaleDateString('tr-TR', {
              weekday: 'short',
              day: '2-digit',
              month: '2-digit'
            });
            break;
          case 'monthly':
            // Son 4 hafta - bugünden başlayarak geriye doğru hafta aralıkları
            targetDate.setTime(today.getTime() - (i * 7 * 24 * 60 * 60 * 1000));
            const weekStart = new Date(targetDate);
            weekStart.setDate(targetDate.getDate() - targetDate.getDay() + 1); // Pazartesi başlangıcı
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            label = `${weekStart.getDate()}-${weekEnd.getDate()} ${weekStart.toLocaleDateString('tr-TR', { month: 'short' })}`;
            break;
          case '6months':
          case 'yearly':
            // Son 4 ay - bu aydan başlayarak geriye doğru
            targetDate.setMonth(today.getMonth() - i);
            label = targetDate.toLocaleDateString('tr-TR', { month: 'long' });
            break;
          default:
            label = '';
        }
        
        labels.push(label);
        data.push(0);
      }

      return {
        labels,
        datasets: [{
          label: 'Giriş Sayısı',
          data,
          backgroundColor: [
            'rgba(147, 51, 234, 0.6)',
            'rgba(59, 130, 246, 0.6)',
            'rgba(16, 185, 129, 0.6)',
            'rgba(245, 158, 11, 0.6)',
          ],
          borderColor: [
            'rgba(147, 51, 234, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
          ],
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }]
      };
    }

    // Mevcut veriyi kullan - backend'den gelen veri zaten doğru sırada
    console.log('Grafik için işlenen veri:', currentStats.data);
    const labels = currentStats.data.map(item => {
      const formatted = formatDate(item.period);
      console.log(`Tarih: ${item.period} -> Formatlanmış: ${formatted}`);
      return formatted;
    });

    const data = currentStats.data.map(item => item.count);
    console.log('Grafik etiketleri:', labels);
    console.log('Grafik verileri:', data);

    // Renk paletini dinamik olarak oluştur
    const colors = [
      'rgba(147, 51, 234, 0.6)',
      'rgba(59, 130, 246, 0.6)',
      'rgba(16, 185, 129, 0.6)',
      'rgba(245, 158, 11, 0.6)',
      'rgba(239, 68, 68, 0.6)',
      'rgba(139, 92, 246, 0.6)',
      'rgba(236, 72, 153, 0.6)',
      'rgba(34, 197, 94, 0.6)',
      'rgba(251, 146, 60, 0.6)',
      'rgba(168, 85, 247, 0.6)',
    ];

    const borderColors = [
      'rgba(147, 51, 234, 1)',
      'rgba(59, 130, 246, 1)',
      'rgba(16, 185, 129, 1)',
      'rgba(245, 158, 11, 1)',
      'rgba(239, 68, 68, 1)',
      'rgba(139, 92, 246, 1)',
      'rgba(236, 72, 153, 1)',
      'rgba(34, 197, 94, 1)',
      'rgba(251, 146, 60, 1)',
      'rgba(168, 85, 247, 1)',
    ];

    return {
      labels,
      datasets: [{
        label: 'Giriş Sayısı',
        data,
        backgroundColor: colors.slice(0, data.length),
        borderColor: borderColors.slice(0, data.length),
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
            return context[0].label || 'Veri Yok';
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
            size: 11
          },
          maxRotation: 0,
          minRotation: 0
        }
      },
      y: {
        beginAtZero: true,
        suggestedMax: undefined, // Maksimum sınırı kaldır
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 11
          },
          stepSize: 1, // Adım boyutunu 1 yap
          callback: function(value) {
            return Number.isInteger(value) ? value : null; // Sadece tam sayıları göster
          }
        }
      }
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      }
    }
  };

  if (loading) {
    return (
      <motion.div 
        className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-5 border border-white/20 w-3/4 h-80 flex items-center justify-center"
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

  const currentStats = stats[selectedPeriod];

  return (
    <motion.div 
      className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-5 border border-white/20 w-3/4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-xl font-bold text-white">Giriş İstatistikleri</h3>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="bg-white/20 text-white border border-white/30 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {periods.map(period => (
            <option key={period.value} value={period.value} className="bg-gray-800">
              {period.label}
            </option>
          ))}
        </select>
      </div>

            {/* Sütun Grafiği */}
            <div className="mb-5">
              <div className="h-40 w-full">
                <Bar data={getChartData()} options={chartOptions} />
              </div>
            </div>

      {/* Tablo */}
      <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-white/10">
            <tr>
              <th className="px-4 py-3 text-left text-white font-medium text-sm">Tarih</th>
              <th className="px-4 py-3 text-left text-white font-medium text-sm">Giriş Sayısı</th>
              <th className="px-4 py-3 text-left text-white font-medium text-sm">Yüzde</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const rows = [];
              
              if (currentStats.data.length === 0) {
                // Veri yoksa 4 boş sütun göster - sağdan sola (en yeni sağda)
                const maxColumns = 4;
                for (let i = 0; i < maxColumns; i++) {
                  rows.push(
                    <motion.tr
                      key={`empty-${i}`}
                      className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <td className="px-4 py-3 text-white/50 text-sm">
                        {(() => {
                          const today = new Date();
                          const targetDate = new Date(today);
                          
                          switch (selectedPeriod) {
                            case 'weekly':
                              // Son 4 gün - bugünden başlayarak geriye doğru
                              targetDate.setTime(today.getTime() - (i * 24 * 60 * 60 * 1000));
                              return targetDate.toLocaleDateString('tr-TR', {
                                weekday: 'short',
                                day: '2-digit',
                                month: '2-digit'
                              });
                            case 'monthly':
                              // Son 4 hafta - bugünden başlayarak geriye doğru hafta aralıkları
                              targetDate.setTime(today.getTime() - (i * 7 * 24 * 60 * 60 * 1000));
                              const weekStart = new Date(targetDate);
                              weekStart.setDate(targetDate.getDate() - targetDate.getDay() + 1); // Pazartesi başlangıcı
                              const weekEnd = new Date(weekStart);
                              weekEnd.setDate(weekStart.getDate() + 6);
                              return `${weekStart.getDate()}-${weekEnd.getDate()} ${weekStart.toLocaleDateString('tr-TR', { month: 'short' })}`;
                            case '6months':
                            case 'yearly':
                              // Son 4 ay - bu aydan başlayarak geriye doğru
                              targetDate.setMonth(today.getMonth() - i);
                              return targetDate.toLocaleDateString('tr-TR', { month: 'long' });
                            default:
                              return '';
                          }
                        })()}
                      </td>
                      <td className="px-4 py-3 text-white/50 text-sm">0</td>
                      <td className="px-4 py-3 text-white/50 text-sm">0%</td>
                    </motion.tr>
                  );
                }
              } else {
                // Mevcut veriyi kullan - backend'den gelen veri zaten doğru sırada
                currentStats.data.forEach((item, index) => {
                  const percentage = currentStats.total > 0 
                    ? ((item.count / currentStats.total) * 100).toFixed(1)
                    : 0;
                  
                  rows.push(
                    <motion.tr
                      key={item.period}
                      className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td className="px-4 py-3 text-white/80 text-sm">
                        {formatDate(item.period)}
                      </td>
                      <td className="px-4 py-3 text-white font-medium text-sm">
                        {item.count}
                      </td>
                      <td className="px-4 py-3 text-white/60 text-sm">
                        {percentage}%
                      </td>
                    </motion.tr>
                  );
                });
              }
              
              return rows;
            })()}
          </tbody>
        </table>
      </div>
      
      {/* İstatistik Özeti */}
      <div className="mt-4 space-y-3">
        {/* Toplam Giriş */}
        <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-400/20">
          <div className="flex justify-between items-center">
            <span className="text-white/80 text-sm">Toplam Giriş:</span>
            <span className="text-white font-bold text-lg">{currentStats.total}</span>
          </div>
        </div>
        
      </div>
    </motion.div>
  );
}
