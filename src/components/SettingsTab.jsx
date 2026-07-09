import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Store, Phone, MapPin, UploadCloud, Save, CheckCircle, Image as ImageIcon, Lock, UserX, UserCheck, Type } from 'lucide-react';

const FONT_OPTIONS = [
  { value: 'Nunito', label: 'Nunito (Default)', preview: 'NAMA TOKO' },
  { value: 'Historic', label: 'Historic — Blackletter Klasik', preview: 'NAMA TOKO' },
  { value: 'Miland', label: 'Miland by brandsemut', preview: 'NAMA TOKO' },
  { value: 'Linked', label: 'Linked by brandsemut', preview: 'NAMA TOKO' },
  { value: 'Indian', label: 'Indian by Billy Argel Fonts', preview: 'NAMA TOKO' },
  { value: 'DeathStar', label: 'Death Star (Sci-Fi)', preview: 'NAMA TOKO' },
  { value: 'Doom2016', label: 'Doom 2016 (Metal)', preview: 'NAMA TOKO' },
];

export default function SettingsTab({ session, onSettingsUpdate }) {
  const [settings, setSettings] = useState({
    store_name: '',
    store_phone: '',
    store_address: '',
    store_logo_url: '',
    store_font: 'Nunito'
  });
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [settingsId, setSettingsId] = useState(null);
  
  // Cashier Mode State
  const [cashierPin, setCashierPin] = useState('');
  const [isCashierMode, setIsCashierMode] = useState(false);

  useEffect(() => {
    if (session) fetchSettings();
    const savedPin = localStorage.getItem('payuo_cashier_pin');
    if (savedPin) {
      setCashierPin(savedPin);
      setIsCashierMode(localStorage.getItem('payuo_cashier_mode') === 'true');
    }
  }, [session]);

  const fetchSettings = async () => {
    setInitialLoading(true);
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('user_id', session.user.id)
      .single();
      
    if (data) {
      setSettings(data);
      setSettingsId(data.id);
      if (onSettingsUpdate) onSettingsUpdate(data);
    }
    setInitialLoading(false);
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 500; // Maksimal resolusi logo 500px agar super ringan
          
          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Kompresi kualitas 0.8 format WebP/JPEG
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: 'image/jpeg' }));
          }, 'image/jpeg', 0.8);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Kompresi gambar di HP/PC pembeli
      const compressedFile = await compressImage(file);
      
      // 2. Buat nama file unik
      const fileExt = compressedFile.name.split('.').pop();
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 3. Upload ke Supabase Storage (store_logos bucket)
      const { error: uploadError } = await supabase.storage
        .from('store_logos')
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      // 4. Dapatkan URL publik
      const { data: publicUrlData } = supabase.storage
        .from('store_logos')
        .getPublicUrl(filePath);

      setSettings({ ...settings, store_logo_url: publicUrlData.publicUrl });
      
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Gagal mengunggah logo. Pastikan Anda sudah menjalankan script SQL untuk membuat Storage Bucket "store_logos".');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    let error;
    if (settingsId) {
      // Update
      const res = await supabase.from('store_settings').update({
        store_name: settings.store_name,
        store_phone: settings.store_phone,
        store_address: settings.store_address,
        store_logo_url: settings.store_logo_url,
        store_font: settings.store_font || 'Nunito',
        updated_at: new Date()
      }).eq('id', settingsId);
      error = res.error;
    } else {
      // Insert
      const res = await supabase.from('store_settings').insert([{
        user_id: session.user.id,
        store_name: settings.store_name,
        store_phone: settings.store_phone,
        store_address: settings.store_address,
        store_logo_url: settings.store_logo_url,
        store_font: settings.store_font || 'Nunito'
      }]).select();
      error = res.error;
      if (res.data) setSettingsId(res.data[0].id);
    }

    if (!error) {
      setSaveSuccess(true);
      if (onSettingsUpdate) onSettingsUpdate(settings);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      console.error('Save error:', error);
      alert('Gagal menyimpan pengaturan.');
    }
    
    setIsSaving(false);
  };

  if (initialLoading) {
    return <div className="flex-1 p-lg flex items-center justify-center"><div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full"></div></div>;
  }

  return (
    <div className="flex-1 p-lg bg-background overflow-y-auto animate-fade-in relative">
      <div className="max-w-2xl mx-auto mt-4">
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary-light text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Store size={32} />
          </div>
          <h2 className="text-3xl font-black text-secondary">Identitas Bisnis</h2>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">Sesuaikan nama, alamat, dan logo toko Anda di sini. Identitas ini akan menjadi wajah bisnis Anda di setiap struk pelanggan.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 p-xl border border-slate-100 relative overflow-hidden">
          {/* Glassmorphism Accents */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <form onSubmit={handleSave} className="relative z-10 space-y-6">
            
            {/* Logo Upload Section */}
            <div className="flex flex-col items-center justify-center mb-8 pb-8 border-b border-slate-100">
              <div className="relative group cursor-pointer mb-4">
                <div className={`w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-50 flex flex-col items-center justify-center transition-all ${isUploading ? 'opacity-50' : 'group-hover:border-primary-light'}`}>
                  {settings.store_logo_url ? (
                    <img src={settings.store_logo_url} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon size={32} className="text-slate-300 mb-2" />
                      <span className="text-xs text-slate-400 font-medium">Upload Logo</span>
                    </>
                  )}
                </div>
                <label className="absolute inset-0 w-full h-full cursor-pointer z-20 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
                  <UploadCloud className="text-white" size={28} />
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={isUploading} />
                </label>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-secondary">Logo Struk & Aplikasi</p>
                <p className="text-xs text-slate-400 mt-1">Kami menggunakan kompresi pintar, foto galeri Anda akan otomatis diperkecil agar tidak lemot.</p>
              </div>
            </div>

            {/* Input Fields */}
            <div className="input-group">
              <label className="input-label flex items-center gap-2"><Store size={16}/> Nama Toko / Bisnis *</label>
              <input 
                required 
                type="text" 
                className="input bg-slate-50 border-slate-200 focus:border-primary focus:ring-primary/20 transition-all font-bold text-lg" 
                placeholder="Misal: Toko Sembako Berkah" 
                value={settings.store_name} 
                onChange={e => setSettings({...settings, store_name: e.target.value})} 
              />
            </div>

            {/* Font Picker */}
            <div className="input-group">
              <label className="input-label flex items-center gap-2"><Type size={16}/> Gaya Font Nama Toko (Struk)</label>
              <div className="grid grid-cols-1 gap-2 mt-1">
                {FONT_OPTIONS.map(font => (
                  <button
                    key={font.value}
                    type="button"
                    onClick={() => setSettings({...settings, store_font: font.value})}
                    className={`flex items-center justify-between gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                      settings.store_font === font.value
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 font-medium mb-1">{font.label}</span>
                      <span style={{ fontFamily: font.value, fontSize: '22px', lineHeight: 1.2, color: '#334155' }}>
                        {settings.store_name || 'NAMA TOKO'}
                      </span>
                    </div>
                    {settings.store_font === font.value && (
                      <CheckCircle size={20} className="text-primary shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="input-group">
              <label className="input-label flex items-center gap-2"><Phone size={16}/> Nomor Telepon / WhatsApp</label>
              <input 
                type="tel" 
                className="input bg-slate-50 border-slate-200 focus:border-primary" 
                placeholder="Misal: 08123456789" 
                value={settings.store_phone} 
                onChange={e => setSettings({...settings, store_phone: e.target.value})} 
              />
            </div>

            <div className="input-group">
              <label className="input-label flex items-center gap-2"><MapPin size={16}/> Alamat Lengkap</label>
              <textarea 
                className="input bg-slate-50 border-slate-200 focus:border-primary resize-none h-24" 
                placeholder="Misal: Jl. Mawar No 12, Jakarta" 
                value={settings.store_address} 
                onChange={e => setSettings({...settings, store_address: e.target.value})} 
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isSaving || isUploading || !settings.store_name} 
                className="btn btn-primary w-full py-4 text-lg rounded-2xl shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
                ) : saveSuccess ? (
                  <><CheckCircle size={20} /> Tersimpan!</>
                ) : (
                  <><Save size={20} /> Simpan Pengaturan</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Cashier Mode Section */}
      <div className="max-w-2xl mx-auto mt-8 mb-8">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 p-xl border border-slate-100 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className={`w-20 h-20 shrink-0 rounded-full flex items-center justify-center ${isCashierMode ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
              <Lock size={36} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-slate-800 mb-1">Mode Karyawan (Kunci Layar)</h3>
              <p className="text-sm text-slate-500 mb-4">
                Kunci perangkat ini hanya di layar Kasir agar Karyawan tidak bisa melihat omset, menghapus barang, atau mengubah pengaturan toko.
              </p>
              
              <div className="flex flex-col md:flex-row items-center gap-3">
                <input 
                  type="password" 
                  placeholder="Buat PIN 4 Digit" 
                  maxLength={4}
                  className="input w-full md:w-40 text-center font-bold tracking-[0.5em] text-lg bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                  value={cashierPin}
                  onChange={(e) => setCashierPin(e.target.value.replace(/[^0-9]/g, ''))}
                  disabled={isCashierMode}
                />
                
                {!isCashierMode ? (
                  <button 
                    type="button"
                    disabled={cashierPin.length < 4}
                    onClick={() => {
                      if (cashierPin.length < 4) return;
                      localStorage.setItem('payuo_cashier_pin', cashierPin);
                      localStorage.setItem('payuo_cashier_mode', 'true');
                      alert("Mode Karyawan aktif! Perangkat ini sekarang terkunci di layar Kasir.");
                      window.location.reload();
                    }}
                    className="w-full md:w-auto btn bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <UserCheck size={18} /> Aktifkan Kunci
                  </button>
                ) : (
                  <button 
                    type="button"
                    onClick={() => {
                      const input = prompt("Masukkan PIN 4 Digit untuk mematikan Mode Karyawan:");
                      if (input === cashierPin) {
                        localStorage.removeItem('payuo_cashier_mode');
                        setIsCashierMode(false);
                        alert("Kunci dibuka! Anda kembali memiliki akses penuh.");
                        window.location.reload();
                      } else if (input !== null) {
                        alert("PIN Salah!");
                      }
                    }}
                    className="w-full md:w-auto btn bg-red-100 hover:bg-red-200 text-red-600 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2"
                  >
                    <UserX size={18} /> Matikan Kunci
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
