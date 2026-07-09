import React from 'react';
import { AlertTriangle, Crown, X, ArrowRight } from 'lucide-react';

export default function LimitExceededModal({ isOpen, onClose, limitType, onUpgrade }) {
  if (!isOpen) return null;

  const isPhotoLimit = limitType === 'photo';
  
  const title = isPhotoLimit ? "Batas Foto Tercapai!" : "Batas Barang Tercapai!";
  const message = isPhotoLimit 
    ? "Akun Gratis Anda telah mencapai batas maksimal 20 barang dengan foto. Anda masih bisa menambahkan hingga 100 barang jika tanpa foto (teks saja)."
    : "Akun Gratis Anda telah mencapai batas maksimal 100 barang. Untuk menambah barang lebih banyak, silakan berlangganan versi Pro.";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
      <div 
        className="bg-white rounded-[24px] w-full max-w-md overflow-hidden shadow-2xl transform transition-all border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-8 text-center">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-1 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
            <AlertTriangle size={36} className="text-orange-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            {message}
          </p>
          
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-left border border-slate-700 shadow-lg relative overflow-hidden mb-6">
            <div className="absolute -right-4 -top-4 opacity-10">
              <Crown size={80} className="text-yellow-400" />
            </div>
            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
              <Crown size={18} className="text-yellow-400" />
              Buka Semua Akses (Versi Pro)
            </h3>
            <ul className="text-slate-300 text-xs space-y-2 mb-4">
              <li>✓ Tambah Barang Tanpa Batas (Unlimited)</li>
              <li>✓ Upload Foto Tanpa Batas</li>
              <li>✓ Akun Anda Tidak Akan Dihapus</li>
            </ul>
            <button 
              onClick={() => {
                onClose();
                onUpgrade();
              }}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-slate-900 font-bold py-3 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:shadow-[0_0_25px_rgba(250,204,21,0.5)] hover:-translate-y-0.5 flex justify-center items-center gap-2 text-sm"
            >
              Lihat Promo Pro Sekarang
              <ArrowRight size={16} />
            </button>
          </div>
          
          <button 
            onClick={onClose}
            className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 font-medium py-3 px-4 rounded-xl transition-colors text-sm"
          >
            Nanti Saja, Kembali ke Kasir
          </button>
        </div>
      </div>
    </div>
  );
}
