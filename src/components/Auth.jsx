import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Mail, Lock, Store, Loader2 } from 'lucide-react';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!supabase) throw new Error("Supabase Client tidak ditemukan. Cek Environment Variables.");

      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.session) onLogin(data.session);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("Pendaftaran berhasil! Silakan cek email Anda atau langsung login.");
        setIsLogin(true);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-md relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#F59E0B]/20 rounded-full blur-[100px] -z-10"></div>

      <div className="card w-full max-w-md p-xl animate-fade-in relative z-10" style={{ backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.4)' }}>
        <div className="flex justify-center mb-lg">
          <div className="w-16 h-16 bg-gradient-to-tr from-primary to-[#F59E0B] rounded-2xl flex items-center justify-center text-white text-3xl shadow-glow">
            🛒
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-sm text-text">
          {isLogin ? 'Selamat Datang Kembali' : 'Mulai Bisnis Anda'}
        </h2>
        <p className="text-center text-secondary mb-xl">
          {isLogin ? 'Masuk ke dashboard PayuO Anda' : 'Daftar sekarang, gratis 14 hari pertama!'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <div className="input-group">
            <label className="input-label">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={20} />
              <input 
                type="email" 
                className="input pl-11" 
                placeholder="nama@toko.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={20} />
              <input 
                type="password" 
                className="input pl-11" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary w-full mt-sm py-md text-lg flex justify-center items-center gap-2 transition-all hover:scale-[1.02]"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : (isLogin ? 'Masuk Sekarang' : 'Daftar & Mulai Jualan')}
          </button>
        </form>

        <div className="mt-lg text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:text-primary-dark font-medium transition-colors"
          >
            {isLogin ? 'Belum punya akun? Daftar disini' : 'Sudah punya akun? Masuk'}
          </button>
        </div>
      </div>
    </div>
  );
}
