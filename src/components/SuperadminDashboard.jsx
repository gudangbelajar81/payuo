import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  Activity, 
  ShieldCheck,
  Server,
  Database
} from 'lucide-react';

export default function SuperadminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 142,
    activeUsers: 89,
    totalProducts: 4521,
    revenue: 12500000
  });

  return (
    <div className="p-4 md:p-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Ruang Kendali Pusat</h2>
          <p className="text-sm text-slate-500">Dasbor eksklusif Pemilik Alveza Digital</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard 
          icon={<Users size={20} className="text-blue-500" />}
          title="Total Toko"
          value={stats.totalUsers}
          trend="+12 minggu ini"
          color="bg-blue-50"
        />
        <StatCard 
          icon={<Activity size={20} className="text-emerald-500" />}
          title="Toko Aktif"
          value={stats.activeUsers}
          trend="62% dari total"
          color="bg-emerald-50"
        />
        <StatCard 
          icon={<ShoppingBag size={20} className="text-orange-500" />}
          title="Total Barang"
          value={(stats.totalProducts / 1000).toFixed(1) + 'k'}
          trend="+340 minggu ini"
          color="bg-orange-50"
        />
        <StatCard 
          icon={<TrendingUp size={20} className="text-purple-500" />}
          title="Pendapatan (Rp)"
          value={(stats.revenue / 1000000).toFixed(1) + 'Jt'}
          trend="Estimasi MRR"
          color="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Server */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Server size={18} className="text-slate-400" />
            Status Infrastruktur
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Database Supabase</span>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">SEHAT</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '12%' }}></div>
            </div>
            <p className="text-xs text-slate-400 text-right">Kapasitas: 12% terpakai (dari 500MB)</p>
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-slate-600">Storage Foto (AWS S3)</span>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">SEHAT</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '5%' }}></div>
            </div>
            <p className="text-xs text-slate-400 text-right">Kapasitas: 5% terpakai (dari 1GB)</p>
          </div>
        </div>

        {/* Log Aktivitas Terbaru */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Database size={18} className="text-slate-400" />
            Log Sistem Terbaru
          </h3>
          <div className="space-y-3">
            <div className="flex gap-3 text-sm border-b border-slate-50 pb-2">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0"></div>
              <div>
                <p className="text-slate-700">Toko "Kopi Senja" mendaftar akun baru.</p>
                <p className="text-xs text-slate-400">2 menit yang lalu</p>
              </div>
            </div>
            <div className="flex gap-3 text-sm border-b border-slate-50 pb-2">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-orange-500 shrink-0"></div>
              <div>
                <p className="text-slate-700">Peringatan: Toko "Budi Jaya" mencapai batas 100 barang.</p>
                <p className="text-xs text-slate-400">15 menit yang lalu</p>
              </div>
            </div>
            <div className="flex gap-3 text-sm">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 shrink-0"></div>
              <div>
                <p className="text-slate-700">Robot Pembersih menghapus 4 akun tidak aktif.</p>
                <p className="text-xs text-slate-400">Tadi malam, 00:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-slate-800 rounded-[20px] p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
          <ShieldCheck size={120} />
        </div>
        <h3 className="font-bold text-lg mb-2 relative z-10">Catatan Arsitek</h3>
        <p className="text-slate-300 text-sm leading-relaxed max-w-2xl relative z-10">
          Data di atas saat ini adalah simulasi antarmuka (UI). Untuk menarik data asli dari seluruh toko, diperlukan pembuatan fungsi <code>SECURITY DEFINER</code> di dalam Supabase agar Anda bisa mem-bypass aturan privasi (RLS) milik toko lain.
        </p>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, trend, color }) {
  return (
    <div className="bg-white rounded-[20px] p-4 shadow-sm border border-slate-100 flex flex-col justify-between">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-xl ${color}`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-slate-500">{title}</span>
      </div>
      <div>
        <h4 className="text-2xl font-bold text-slate-800 mb-1">{value}</h4>
        <span className="text-xs text-slate-400">{trend}</span>
      </div>
    </div>
  );
}
