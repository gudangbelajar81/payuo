import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, ExternalLink } from 'lucide-react';

export default function QRCodeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const targetUrl = 'https://payuo.alvezadigital.com';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
      <div 
        className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6 text-center">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-1 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="w-16 h-16 bg-primary-light/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📱</span>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Akses Aplikasi</h2>
          <p className="text-slate-500 text-sm mb-6">
            Scan barcode ini menggunakan kamera HP untuk membuka kasir.
          </p>
          
          <div className="bg-white p-4 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.05)] border border-slate-100 inline-block mb-6">
            <QRCodeSVG 
              value={targetUrl}
              size={200}
              level={"H"} // High error correction
              includeMargin={true}
              imageSettings={{
                src: "/payuo_logo.png",
                x: undefined,
                y: undefined,
                height: 40,
                width: 40,
                excavate: true,
              }}
            />
          </div>
          
          <div className="bg-slate-50 rounded-lg p-3 text-left">
            <h3 className="font-semibold text-sm text-slate-700 mb-2 flex items-center gap-1">
              <span className="text-primary">💡</span> Cara Instal:
            </h3>
            <ol className="text-xs text-slate-600 list-decimal list-inside space-y-1">
              <li>Buka aplikasi Kamera di HP Anda.</li>
              <li>Arahkan kamera ke kotak Barcode di atas.</li>
              <li>Klik tautan (link) yang muncul di layar HP.</li>
              <li>Pilih menu <strong>"Tambahkan ke Layar Utama"</strong>.</li>
            </ol>
          </div>
          
          <a 
            href={targetUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-4 w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-2 px-4 rounded-xl transition-colors flex justify-center items-center gap-2 text-sm"
          >
            <ExternalLink size={16} />
            Buka Link Langsung
          </a>
        </div>
      </div>
    </div>
  );
}
