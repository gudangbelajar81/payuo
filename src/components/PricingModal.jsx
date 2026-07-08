import React, { useState } from 'react';
import { Check, X, Printer, Cloud, ShieldCheck, PhoneCall, Smartphone, Wifi, WifiOff, Star, Zap } from 'lucide-react';

const ADMIN_WA = '6285124070705';

function handleWA(paket) {
  const text = `Halo Admin PayuO, saya tertarik mengambil *${paket}*. Mohon info pembayarannya ya.`;
  window.open(`https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(text)}`, '_blank');
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 9999,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '16px',
    background: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    animation: 'fadeIn 0.3s ease',
  },
  modal: {
    position: 'relative',
    width: '100%', maxWidth: '1200px',
    background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    borderRadius: '24px',
    border: '1px solid rgba(99,179,237,0.15)',
    boxShadow: '0 0 80px rgba(20,184,166,0.15), 0 40px 80px rgba(0,0,0,0.6)',
    overflow: 'hidden',
    maxHeight: '95vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '32px 40px 24px',
    background: 'linear-gradient(135deg, rgba(13,148,136,0.2) 0%, rgba(79,70,229,0.1) 100%)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    textAlign: 'center',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute', top: '20px', right: '20px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '50%', width: '36px', height: '36px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: '#94a3b8',
    transition: 'all 0.2s',
  },
  headerEyebrow: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: 'rgba(20,184,166,0.15)',
    border: '1px solid rgba(20,184,166,0.3)',
    borderRadius: '999px',
    padding: '4px 14px',
    fontSize: '12px', fontWeight: 700,
    color: '#2dd4bf',
    letterSpacing: '0.08em',
    marginBottom: '12px',
  },
  headerTitle: {
    fontSize: '2.2rem', fontWeight: 900,
    background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    marginBottom: '8px', lineHeight: 1.2,
  },
  headerSub: {
    fontSize: '0.95rem', color: '#64748b', maxWidth: '500px', margin: '0 auto',
  },
  story: {
    margin: '16px 40px 0',
    padding: '14px 20px',
    background: 'rgba(20,184,166,0.08)',
    border: '1px solid rgba(20,184,166,0.2)',
    borderRadius: '12px',
    display: 'flex', alignItems: 'flex-start', gap: '12px',
  },
  storyIcon: {
    width: '32px', height: '32px', borderRadius: '8px',
    background: 'linear-gradient(135deg,#0d9488,#14b8a6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, fontSize: '14px',
  },
  storyText: {
    fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.6,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    padding: '28px 32px 32px',
    overflowY: 'auto',
  },
  card: (variant) => ({
    borderRadius: '20px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    border: '1px solid',
    transition: 'transform 0.2s, box-shadow 0.2s',
    ...(variant === 'free' ? {
      background: 'rgba(255,255,255,0.03)',
      borderColor: 'rgba(255,255,255,0.07)',
    } : variant === 'saas' ? {
      background: 'linear-gradient(145deg, rgba(13,148,136,0.15) 0%, rgba(20,184,166,0.08) 100%)',
      borderColor: 'rgba(20,184,166,0.5)',
      boxShadow: '0 0 40px rgba(13,148,136,0.15)',
      transform: 'translateY(-8px)',
    } : variant === 'vip' ? {
      background: 'linear-gradient(145deg, rgba(245,158,11,0.12) 0%, rgba(251,191,36,0.06) 100%)',
      borderColor: 'rgba(245,158,11,0.4)',
      boxShadow: '0 0 40px rgba(245,158,11,0.1)',
    } : {
      background: 'linear-gradient(145deg, rgba(99,102,241,0.15) 0%, rgba(79,70,229,0.08) 100%)',
      borderColor: 'rgba(99,102,241,0.4)',
      boxShadow: '0 0 40px rgba(99,102,241,0.1)',
    }),
  }),
  badge: (color) => ({
    position: 'absolute', top: '-12px', left: '50%',
    transform: 'translateX(-50%)',
    background: color === 'teal'
      ? 'linear-gradient(135deg,#0d9488,#14b8a6)'
      : color === 'amber'
        ? 'linear-gradient(135deg,#d97706,#f59e0b)'
        : 'linear-gradient(135deg,#4f46e5,#6366f1)',
    borderRadius: '999px', padding: '4px 14px',
    fontSize: '10px', fontWeight: 800, color: '#fff',
    letterSpacing: '0.08em', whiteSpace: 'nowrap',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  }),
  cardTitle: (color) => ({
    fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em',
    color, marginBottom: '4px', textTransform: 'uppercase',
  }),
  price: {
    fontSize: '2.2rem', fontWeight: 900, color: '#fff',
    lineHeight: 1.1,
  },
  priceSub: {
    fontSize: '0.8rem', color: '#64748b', marginTop: '2px',
  },
  desc: {
    fontSize: '0.78rem', color: '#64748b', lineHeight: 1.6,
    padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
    marginBottom: '16px',
  },
  featureList: {
    display: 'flex', flexDirection: 'column', gap: '10px', flex: 1,
  },
  featureItem: (active) => ({
    display: 'flex', alignItems: 'flex-start', gap: '8px',
    fontSize: '0.8rem',
    color: active ? '#e2e8f0' : '#475569',
    textDecoration: active ? 'none' : 'line-through',
    opacity: active ? 1 : 0.5,
  }),
  featureIcon: (active, color) => ({
    flexShrink: 0, marginTop: '1px',
    color: active ? (color || '#2dd4bf') : '#ef4444',
  }),
  btn: (variant) => ({
    marginTop: '20px',
    width: '100%', padding: '12px 16px',
    borderRadius: '12px', border: 'none',
    fontWeight: 700, fontSize: '0.85rem',
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    transition: 'all 0.2s',
    ...(variant === 'ghost' ? {
      background: 'rgba(255,255,255,0.06)',
      color: '#94a3b8',
    } : variant === 'teal' ? {
      background: 'linear-gradient(135deg,#0d9488,#14b8a6)',
      color: '#fff',
      boxShadow: '0 8px 24px rgba(13,148,136,0.35)',
    } : variant === 'amber' ? {
      background: 'linear-gradient(135deg,#d97706,#f59e0b)',
      color: '#fff',
      boxShadow: '0 8px 24px rgba(245,158,11,0.3)',
    } : {
      background: 'linear-gradient(135deg,#4f46e5,#6366f1)',
      color: '#fff',
      boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
    }),
  }),
};

export default function PricingModal({ onClose }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
        .p-card:hover { transform: translateY(-4px) !important; box-shadow: 0 20px 60px rgba(0,0,0,0.4) !important; }
        .p-card-pop:hover { transform: translateY(-12px) !important; }
        .p-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
      `}</style>
      <div style={styles.modal}>

        {/* HEADER */}
        <div style={styles.header}>
          <button style={styles.closeBtn} onClick={onClose} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.15)'} onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'}>
            <X size={16}/>
          </button>
          <div style={styles.headerEyebrow}>
            <Zap size={12}/> PILIH PAKET TERBAIK ANDA
          </div>
          <div style={styles.headerTitle}>Investasi Cerdas untuk Bisnis Anda</div>
          <div style={styles.headerSub}>Satu platform kasir modern untuk semua skala usaha — dari warung pinggir jalan hingga ritel bercabang.</div>

          {/* STORY */}
          <div style={styles.story}>
            <div style={styles.storyIcon}>💼</div>
            <div style={styles.storyText}>
              <strong style={{color:'#2dd4bf'}}>Kisah Nyata:</strong> Pak Budi punya toko di Surabaya tapi ia tinggal di Jakarta. Dengan PayuO SaaS, ia bisa <strong style={{color:'#fff'}}>memantau omset, stok, dan kasbon pelanggan secara real-time dari HP-nya</strong> — kapanpun, dimanapun. Tanpa perlu hadir langsung ke toko!
            </div>
          </div>
        </div>

        {/* CARDS */}
        <div style={styles.grid}>

          {/* FREE */}
          <div style={styles.card('free')} className="p-card">
            <div style={styles.cardTitle('#64748b')}>Paket Pemula</div>
            <div style={styles.price}>Gratis</div>
            <div style={styles.priceSub}>7 Hari Trial</div>
            <div style={styles.desc}>Coba fitur dasar sebelum memutuskan. Cocok untuk kenalan dulu dengan sistem.</div>
            <div style={styles.featureList}>
              <div style={styles.featureItem(true)}><span style={styles.featureIcon(true)}><Check size={14}/></span> Transaksi Kasir Dasar</div>
              <div style={styles.featureItem(true)}><span style={styles.featureIcon(true)}><Check size={14}/></span> Kelola Produk (Terbatas)</div>
              <div style={styles.featureItem(false)}><span style={styles.featureIcon(false)}><X size={14}/></span> Multi-Device / Jarak Jauh</div>
              <div style={styles.featureItem(false)}><span style={styles.featureIcon(false)}><X size={14}/></span> Kasbon & Hutang Pelanggan</div>
              <div style={styles.featureItem(false)}><span style={styles.featureIcon(false)}><X size={14}/></span> Cetak Struk Bluetooth</div>
            </div>
            <button style={styles.btn('ghost')} className="p-btn" onClick={onClose}>Lanjutkan Trial</button>
          </div>

          {/* SAAS */}
          <div style={styles.card('saas')} className="p-card p-card-pop">
            <div style={styles.badge('teal')}>⭐ PALING POPULER</div>
            <div style={styles.cardTitle('#2dd4bf')}>SaaS Cloud (Online)</div>
            <div style={{display:'flex',alignItems:'flex-end',gap:'4px',marginTop:'4px'}}>
              <div style={styles.price}>Rp 99rb</div>
              <div style={{...styles.priceSub,marginBottom:'4px'}}>/bulan</div>
            </div>
            <div style={styles.priceSub}>Akses dari Manapun 🌐</div>
            <div style={styles.desc}>
              <span style={{color:'#2dd4bf',fontWeight:700}}>Pantau Jarak Jauh!</span> Bos di Jakarta, toko di Surabaya? Omset & stok terpantau real-time dari HP Anda.
            </div>
            <div style={styles.featureList}>
              <div style={styles.featureItem(true,'#2dd4bf')}><span style={styles.featureIcon(true,'#2dd4bf')}><Wifi size={14}/></span> <strong>Multi-Device</strong> (HP/PC berbeda, bersamaan)</div>
              <div style={styles.featureItem(true,'#2dd4bf')}><span style={styles.featureIcon(true,'#2dd4bf')}><Check size={14}/></span> Pantau Toko dari Jarak Jauh</div>
              <div style={styles.featureItem(true,'#2dd4bf')}><span style={styles.featureIcon(true,'#2dd4bf')}><Check size={14}/></span> <strong>Transaksi Unlimited</strong></div>
              <div style={styles.featureItem(true,'#2dd4bf')}><span style={styles.featureIcon(true,'#2dd4bf')}><Check size={14}/></span> Kasbon & Hutang Pelanggan</div>
              <div style={styles.featureItem(true,'#2dd4bf')}><span style={styles.featureIcon(true,'#2dd4bf')}><Check size={14}/></span> Laporan Laba Rugi & Export</div>
              <div style={styles.featureItem(true,'#2dd4bf')}><span style={styles.featureIcon(true,'#2dd4bf')}><Check size={14}/></span> Cetak Struk Bluetooth</div>
            </div>
            <button style={styles.btn('teal')} className="p-btn" onClick={()=>handleWA('Paket SaaS Cloud Bulanan Rp 99rb')}>
              <Cloud size={16}/> Berlangganan Sekarang
            </button>
          </div>

          {/* VIP BUNDLE */}
          <div style={styles.card('vip')} className="p-card">
            <div style={styles.badge('amber')}>🖨️ BUNDLE HARDWARE</div>
            <div style={styles.cardTitle('#f59e0b')}>Paket Usaha VIP</div>
            <div style={{marginTop:'4px'}}>
              <div style={styles.price}>Rp 1,5 Jt</div>
              <div style={{fontSize:'0.78rem',color:'#f59e0b',fontWeight:700,marginTop:'2px'}}>+ Server Rp 35rb/bln</div>
            </div>
            <div style={styles.desc}>Semua kehebatan SaaS (pantau jarak jauh), ditambah mesin kasir fisik siap pakai di toko Anda!</div>
            <div style={styles.featureList}>
              <div style={styles.featureItem(true,'#f59e0b')}><span style={styles.featureIcon(true,'#f59e0b')}><Wifi size={14}/></span> <strong>Multi-Device + Pantau Jarak Jauh</strong></div>
              <div style={styles.featureItem(true,'#f59e0b')}><span style={styles.featureIcon(true,'#f59e0b')}><Printer size={14}/></span> <strong>BONUS: Printer Kasir Bluetooth Fisik</strong></div>
              <div style={styles.featureItem(true,'#f59e0b')}><span style={styles.featureIcon(true,'#f59e0b')}><Check size={14}/></span> Semua Fitur SaaS Unlimited</div>
              <div style={styles.featureItem(true,'#f59e0b')}><span style={styles.featureIcon(true,'#f59e0b')}><PhoneCall size={14}/></span> Prioritas CS VIP 24/7</div>
              <div style={styles.featureItem(true,'#f59e0b')}><span style={styles.featureIcon(true,'#f59e0b')}><ShieldCheck size={14}/></span> Diskon Server Selamanya (35rb saja!)</div>
            </div>
            <button style={styles.btn('amber')} className="p-btn" onClick={()=>handleWA('Paket Usaha VIP Bundle Hardware (Rp 1.5 Jt + Printer Bluetooth)')}>
              <Printer size={16}/> Pesan Sekarang
            </button>
          </div>

          {/* OFFLINE */}
          <div style={styles.card('offline')} className="p-card">
            <div style={styles.badge('indigo')}>📱 BELI PUTUS</div>
            <div style={styles.cardTitle('#818cf8')}>Paket Offline Pro</div>
            <div style={{marginTop:'4px'}}>
              <div style={styles.price}>Rp 1,5 Jt</div>
              <div style={{fontSize:'0.78rem',color:'#4ade80',fontWeight:700,marginTop:'2px'}}>Tanpa Biaya Bulanan!</div>
            </div>
            <div style={styles.desc}>
              Install sekali di Android/PC Anda selamanya. Data tersimpan lokal di perangkat Anda. <span style={{color:'#f87171',fontWeight:700}}>Hanya 1 perangkat, tanpa pantau jarak jauh.</span>
            </div>
            <div style={styles.featureList}>
              <div style={styles.featureItem(true,'#818cf8')}><span style={styles.featureIcon(true,'#818cf8')}><ShieldCheck size={14}/></span> Lisensi Aplikasi Selamanya</div>
              <div style={styles.featureItem(true,'#818cf8')}><span style={styles.featureIcon(true,'#818cf8')}><Printer size={14}/></span> <strong>BONUS: Printer Listrik/Portable</strong> (Undian Acak!)</div>
              <div style={styles.featureItem(true,'#818cf8')}><span style={styles.featureIcon(true,'#818cf8')}><Check size={14}/></span> Transaksi & Produk Unlimited</div>
              <div style={styles.featureItem(true,'#818cf8')}><span style={styles.featureIcon(true,'#818cf8')}><Smartphone size={14}/></span> Install di 1 HP / PC saja</div>
              <div style={styles.featureItem(false)}><span style={styles.featureIcon(false)}><WifiOff size={14}/></span> Tidak Bisa Pantau Jarak Jauh</div>
              <div style={styles.featureItem(false)}><span style={styles.featureIcon(false)}><X size={14}/></span> Tidak Multi-Device</div>
            </div>
            <button style={styles.btn('indigo')} className="p-btn" onClick={()=>handleWA('Paket Beli Putus Offline (Rp 1.5 Jt + Bonus Printer Acak)')}>
              <Smartphone size={16}/> Beli Lisensi Offline
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
