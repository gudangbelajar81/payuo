import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Mail, Lock, ShoppingBag, Loader2 } from 'lucide-react';

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

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error) {
      alert("Gagal memanggil Google Login: " + error.message);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0B1120', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '2rem', 
      position: 'relative', 
      overflow: 'hidden',
      fontFamily: "'Nunito', sans-serif"
    }}>
      
      {/* 3D Glowing Orbs Background */}
      <div style={{ 
        position: 'absolute', top: '10%', left: '15%', width: '40vw', height: '40vw', 
        background: 'radial-gradient(circle, rgba(13, 148, 136, 0.15) 0%, rgba(0,0,0,0) 70%)', 
        borderRadius: '50%', filter: 'blur(60px)', zIndex: 0,
        animation: 'float 10s infinite ease-in-out'
      }}></div>
      <div style={{ 
        position: 'absolute', bottom: '5%', right: '10%', width: '35vw', height: '35vw', 
        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, rgba(0,0,0,0) 70%)', 
        borderRadius: '50%', filter: 'blur(60px)', zIndex: 0,
        animation: 'float 12s infinite ease-in-out reverse'
      }}></div>

      {/* Glassmorphism Card */}
      <div style={{ 
        width: '100%', 
        maxWidth: '420px', 
        padding: '3rem 2.5rem', 
        position: 'relative', 
        zIndex: 10, 
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)', 
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
      }}>
        
        {/* Floating Logo Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '80px', height: '80px', 
            background: 'linear-gradient(135deg, #0D9488, #2DD4BF)', 
            borderRadius: '24px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            color: 'white', 
            boxShadow: '0 10px 25px -5px rgba(13, 148, 136, 0.5), inset 0 2px 4px rgba(255,255,255,0.3)',
            transform: 'rotate(-5deg)'
          }}>
            <ShoppingBag size={40} strokeWidth={1.5} style={{ transform: 'rotate(5deg)' }} />
          </div>
        </div>
        
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.75rem', fontWeight: '800', color: '#F8FAFC', letterSpacing: '-0.02em' }}>
          {isLogin ? 'Selamat Datang' : 'Mulai Bisnis Anda'}
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '2.5rem', color: '#94A3B8', fontSize: '0.95rem' }}>
          {isLogin ? 'Masuk ke dalam ekosistem PayuO' : 'Daftar sekarang, nikmati akses penuh.'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#CBD5E1', marginBottom: '0.5rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} size={20} />
              <input 
                type="email" 
                style={{ 
                  width: '100%', padding: '1rem 1rem 1rem 3.25rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                placeholder="nama@toko.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.1)'; e.target.style.borderColor = '#0D9488'; e.target.style.boxShadow = '0 0 0 4px rgba(13, 148, 136, 0.1)'; }}
                onBlur={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.05)'; e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.boxShadow = 'none'; }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#CBD5E1', marginBottom: '0.5rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} size={20} />
              <input 
                type="password" 
                style={{ 
                  width: '100%', padding: '1rem 1rem 1rem 3.25rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  color: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.1)'; e.target.style.borderColor = '#0D9488'; e.target.style.boxShadow = '0 0 0 4px rgba(13, 148, 136, 0.1)'; }}
                onBlur={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.05)'; e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.boxShadow = 'none'; }}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', marginTop: '1rem', padding: '1rem', 
              background: 'linear-gradient(135deg, #0D9488, #2DD4BF)',
              color: 'white', fontSize: '1.125rem', fontWeight: '700',
              border: 'none', borderRadius: '16px', cursor: 'pointer',
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
              boxShadow: '0 10px 25px -5px rgba(13, 148, 136, 0.4), inset 0 2px 4px rgba(255,255,255,0.2)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 30px -5px rgba(13, 148, 136, 0.5), inset 0 2px 4px rgba(255,255,255,0.2)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(13, 148, 136, 0.4), inset 0 2px 4px rgba(255,255,255,0.2)'; }}
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : (isLogin ? 'Masuk Sekarang' : 'Daftar & Mulai Jualan')}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          <span style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: '600' }}>ATAU</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          style={{ 
            width: '100%', padding: '0.875rem', 
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'white', fontSize: '1rem', fontWeight: '600',
            border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', cursor: 'pointer',
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.86 16.79 15.68 17.58V20.34H19.24C21.32 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
            <path d="M12 23C14.97 23 17.46 22.02 19.24 20.34L15.68 17.58C14.72 18.22 13.47 18.63 12 18.63C9.15 18.63 6.74 16.71 5.88 14.13H2.21V16.98C4.01 20.55 7.7 23 12 23Z" fill="#34A853"/>
            <path d="M5.88 14.13C5.66 13.47 5.54 12.75 5.54 12C5.54 11.25 5.66 10.53 5.88 9.87V7.02H2.21C1.47 8.5 1.05 10.2 1.05 12C1.05 13.8 1.47 15.5 2.21 16.98L5.88 14.13Z" fill="#FBBC05"/>
            <path d="M12 5.38C13.62 5.38 15.06 5.93 16.2 7.02L19.32 3.9C17.46 2.16 14.97 1.15 12 1.15C7.7 1.15 4.01 3.45 2.21 7.02L5.88 9.87C6.74 7.29 9.15 5.38 12 5.38Z" fill="#EA4335"/>
          </svg>
          Lanjutkan dengan Google
        </button>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            style={{ 
              color: '#94A3B8', fontWeight: '600', fontSize: '0.95rem',
              background: 'none', border: 'none', cursor: 'pointer',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.color = '#2DD4BF'}
            onMouseOut={(e) => e.target.style.color = '#94A3B8'}
          >
            {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
            <span style={{ color: '#2DD4BF' }}>{isLogin ? 'Daftar disini' : 'Masuk disini'}</span>
          </button>
        </div>
      </div>
      
      {/* Footer Text */}
      <div style={{ position: 'absolute', bottom: '2rem', color: '#475569', fontSize: '0.8rem', fontWeight: '600', zIndex: 10 }}>
        ALVES Smart Licensing © 2026
      </div>

      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-20px) scale(1.05); }
            100% { transform: translateY(0) scale(1); }
          }
          input::placeholder {
            color: #64748B !important;
          }
        `}
      </style>
    </div>
  );
}
