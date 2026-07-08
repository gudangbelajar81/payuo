import React from 'react';
import { Check, X, Printer, Cloud, ShieldCheck, PhoneCall } from 'lucide-react';

export default function PricingModal({ onClose, adminWaNumber = '6285124070705' }) {
  const handleWA = (paket) => {
    const text = `Halo Admin, saya tertarik untuk berlangganan PayuO mengambil *${paket}*. Mohon info pembayarannya.`;
    window.open(`https://wa.me/${adminWaNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 text-center text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <h2 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent">
            Tingkatkan Skala Bisnis Anda
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Jangan biarkan bisnis Anda terhambat oleh batasan fitur. Pilih paket investasi terbaik untuk masa depan toko Anda.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
            
            {/* TIER 1: GRATIS */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col">
              <h3 className="text-lg font-bold text-slate-800">Paket Pemula</h3>
              <div className="my-4">
                <span className="text-3xl font-extrabold text-slate-900">Gratis</span>
                <span className="text-slate-500"> / 7 Hari</span>
              </div>
              <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">
                Cocok untuk mencoba sistem dasar kasir sebelum mengambil keputusan.
              </p>
              
              <ul className="space-y-3 flex-1">
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <Check size={18} className="text-teal-500" /> Transaksi Kasir Dasar
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <Check size={18} className="text-teal-500" /> Kelola Produk Terbatas
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <X size={18} className="text-red-400" /> Multi-Kasir (Karyawan)
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <X size={18} className="text-red-400" /> Fitur Kasbon & Hutang
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <X size={18} className="text-red-400" /> Cetak Struk Bluetooth
                </li>
              </ul>
              
              <button 
                onClick={onClose}
                className="mt-6 w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
              >
                Lanjutkan Trial
              </button>
            </div>

            {/* TIER 2: SOFTWARE BULANAN */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-teal-500 flex flex-col relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-teal-500 to-emerald-400 text-white px-4 py-1 rounded-full text-xs font-bold shadow-md">
                PALING POPULER
              </div>
              <h3 className="text-lg font-bold text-teal-600">SaaS Langganan</h3>
              <div className="my-4 flex items-end gap-1">
                <span className="text-3xl font-extrabold text-slate-900">Rp 99rb</span>
                <span className="text-slate-500 font-medium">/ bulan</span>
              </div>
              <p className="text-sm text-slate-500 mb-6 border-b border-slate-100 pb-4">
                Akses ke seluruh fitur canggih PayuO menggunakan HP atau Tablet Anda sendiri.
              </p>
              
              <ul className="space-y-3 flex-1">
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <Check size={18} className="text-teal-500 shrink-0 mt-0.5" /> 
                  <span><strong>Transaksi Tanpa Batas</strong> (Unlimited)</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <Check size={18} className="text-teal-500 shrink-0 mt-0.5" /> 
                  <span>Buka Fitur <strong>Kasbon & Hutang</strong> Pelanggan</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <Check size={18} className="text-teal-500 shrink-0 mt-0.5" /> 
                  <span>Buka Fitur <strong>Cetak Struk</strong> (Printer Bluetooth)</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <Check size={18} className="text-teal-500 shrink-0 mt-0.5" /> 
                  <span><strong>Laporan Laba Rugi</strong> & Export Data</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <X size={18} className="text-red-400" /> Tanpa Perangkat Hardware
                </li>
              </ul>
              
              <button 
                onClick={() => handleWA('Paket SaaS Bulanan Rp 99rb')}
                className="mt-6 w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-500/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Cloud size={18} /> Berlangganan Sekarang
              </button>
            </div>

            {/* TIER 3: PAKET ALAT + SERVER */}
            <div className="bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-700 flex flex-col relative text-white">
              <div className="absolute top-0 right-4 -translate-y-1/2 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                <Printer size={12} /> BUNDLE HARDWARE
              </div>
              <h3 className="text-lg font-bold text-amber-400">Paket Usaha VIP</h3>
              <div className="my-4">
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-3xl font-extrabold text-white">Rp 1.5 Jt</span>
                  <span className="text-slate-400 text-sm">(Beli Putus)</span>
                </div>
                <div className="text-sm font-medium text-emerald-400">
                  + Biaya Server Rp 35.000 / bln
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-6 border-b border-slate-700 pb-4">
                Solusi All-in-One. Dapatkan alat fisik untuk kasir profesional di toko Anda.
              </p>
              
              <ul className="space-y-3 flex-1">
                <li className="flex items-start gap-2 text-sm text-slate-200">
                  <ShieldCheck size={18} className="text-amber-400 shrink-0 mt-0.5" /> 
                  <span>Semua Fitur di Paket SaaS (Unlimited)</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-200">
                  <Printer size={18} className="text-amber-400 shrink-0 mt-0.5" /> 
                  <span><strong>BONUS: Printer Kasir Bluetooth</strong> Fisik (Siap Pakai)</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-200">
                  <Cloud size={18} className="text-amber-400 shrink-0 mt-0.5" /> 
                  <span>Diskon Server Ekstrim (Hanya 35rb/bln selamanya)</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-200">
                  <PhoneCall size={18} className="text-amber-400 shrink-0 mt-0.5" /> 
                  <span>Prioritas CS (VIP Support Line)</span>
                </li>
              </ul>
              
              <button 
                onClick={() => handleWA('Paket Usaha VIP (Rp 1.5 Jt + Printer)')}
                className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Pesan Alat Sekarang
              </button>
            </div>

            {/* TIER 4: SOFTWARE OFFLINE */}
            <div className="bg-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-600 flex flex-col relative text-white md:-translate-y-4 lg:translate-y-0">
              <div className="absolute top-0 right-4 -translate-y-1/2 bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                <Printer size={12} /> BELI PUTUS
              </div>
              <h3 className="text-lg font-bold text-indigo-400">Paket Offline Pro</h3>
              <div className="my-4">
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-3xl font-extrabold text-white">Rp 1.5 Jt</span>
                  <span className="text-slate-400 text-sm">(1x Bayar)</span>
                </div>
                <div className="text-sm font-medium text-emerald-400">
                  Tanpa Biaya Bulanan!
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-6 border-b border-slate-600 pb-4">
                Instalasi mandiri di HP Android/PC Kasir. Data aman di perangkat sendiri.
              </p>
              
              <ul className="space-y-3 flex-1">
                <li className="flex items-start gap-2 text-sm text-slate-200">
                  <ShieldCheck size={18} className="text-indigo-400 shrink-0 mt-0.5" /> 
                  <span>Lisensi Aplikasi Selamanya (Offline)</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-200">
                  <Printer size={18} className="text-indigo-400 shrink-0 mt-0.5" /> 
                  <span><strong>BONUS: Printer Listrik/Portable</strong> (Undian Acak)</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-200">
                  <Check size={18} className="text-indigo-400 shrink-0 mt-0.5" /> 
                  <span>Transaksi & Produk Tanpa Batas</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-200">
                  <Check size={18} className="text-indigo-400 shrink-0 mt-0.5" /> 
                  <span>Laporan Kasir & Penjualan Lengkap</span>
                </li>
              </ul>
              
              <button 
                onClick={() => handleWA('Paket Beli Putus Offline (Rp 1.5 Jt + Bonus Printer Acak)')}
                className="mt-6 w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Beli Lisensi Offline
              </button>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}
