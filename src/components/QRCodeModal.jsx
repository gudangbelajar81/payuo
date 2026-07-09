import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, ExternalLink, QrCode, Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export default function QRCodeModal({ isOpen, onClose }) {
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();

  if (!isOpen) return null;

  const targetUrl = 'https://payuo.alvezadigital.com';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
      <div 
        className="bg-white rounded-[24px] w-full max-w-md overflow-hidden shadow-2xl transform transition-all border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative px-8 py-8 text-center" style={{ padding: '32px' }}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-1 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="w-20 h-20 bg-gradient-to-br from-primary-light to-primary/20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
            <QrCode size={36} className="text-primary" />
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
          
          <div className="bg-slate-50/80 rounded-xl p-4 text-left border border-slate-100">
            <h3 className="font-semibold text-sm text-slate-800 mb-3 flex items-center gap-2">
              <span className="text-primary text-lg">💡</span> Cara Instal Cepat:
            </h3>
            <ol className="text-sm text-slate-600 list-decimal list-outside ml-4 space-y-2">
              <li>Buka aplikasi <strong>Kamera</strong> di HP karyawan.</li>
              <li>Arahkan kamera ke kotak Barcode di atas.</li>
              <li>Klik tautan (link) yang muncul di layar HP.</li>
              <li>Di browser HP, buka menu dan pilih <strong>"Tambahkan ke Layar Utama" (Add to Home Screen)</strong>.</li>
            </ol>
          </div>
          
          <div className="flex flex-col gap-2 mt-6">
            {isInstallable && !isInstalled && (
              <button 
                onClick={promptInstall}
                className="w-full bg-gradient-to-r from-primary to-primary-hover text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex justify-center items-center gap-2 text-sm"
              >
                <Download size={18} />
                Install Aplikasi PayuO Sekarang
              </button>
            )}
            
            <a 
              href={targetUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`w-full ${isInstallable ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50' : 'bg-slate-800 hover:bg-slate-900 text-white shadow-md hover:shadow-lg'} font-semibold py-3 px-4 rounded-xl transition-all flex justify-center items-center gap-2 text-sm`}
            >
              <ExternalLink size={18} />
              Buka Link Langsung di Komputer Ini
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
