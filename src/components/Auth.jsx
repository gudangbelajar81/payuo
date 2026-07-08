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
