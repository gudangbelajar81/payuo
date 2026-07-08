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
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 'var(--spacing-md)', position: 'relative', overflow: 'hidden' }}>
      {/* Background Decor */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', backgroundColor: 'rgba(13, 148, 136, 0.2)', borderRadius: '50%', filter: 'blur(100px)', zIndex: -10 }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', backgroundColor: 'rgba(245, 158, 11, 0.2)', borderRadius: '50%', filter: 'blur(100px)', zIndex: -10 }}></div>

      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem', position: 'relative', zIndex: 10, backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.8)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: '4rem', height: '4rem', background: 'linear-gradient(to top right, var(--primary), #F59E0B)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', boxShadow: '0 0 20px rgba(13, 148, 136, 0.4)' }}>
            🛒
          </div>
        </div>
        
        <h2 className="text-2xl font-bold" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          {isLogin ? 'Selamat Datang Kembali' : 'Mulai Bisnis Anda'}
        </h2>
        <p className="text-secondary" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {isLogin ? 'Masuk ke dashboard PayuO Anda' : 'Daftar sekarang, gratis 14 hari pertama!'}
        </p>

        <form onSubmit={handleSubmit} className="input-group" style={{ gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Email</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary-light)' }} size={20} />
              <input 
                type="email" 
                className="input" 
                style={{ paddingLeft: '2.75rem', width: '100%' }}
                placeholder="nama@toko.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary-light)' }} size={20} />
              <input 
                type="password" 
                className="input" 
                style={{ paddingLeft: '2.75rem', width: '100%' }}
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
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem', padding: '0.75rem', fontSize: '1.125rem' }}
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : (isLogin ? 'Masuk Sekarang' : 'Daftar & Mulai Jualan')}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: 'var(--primary)', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {isLogin ? 'Belum punya akun? Daftar disini' : 'Sudah punya akun? Masuk'}
          </button>
        </div>
      </div>
    </div>
  );
}
