import React, { useState } from 'react';
import { Check, X, Printer, Cloud, ShieldCheck, PhoneCall, Smartphone, Wifi, WifiOff, Star, Zap, MapPin, TrendingUp, Users, Eye, Lock } from 'lucide-react';

const ADMIN_WA = '6285124070705';

function handleWA(paket) {
  const text = `Halo Admin PayuO 👋\n\nSaya tertarik mengambil *${paket}*.\n\nMohon info pembayaran dan cara aktivasinya ya. Terima kasih!`;
  window.open(`https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(text)}`, '_blank');
}

const S = {
  overlay: {
    position:'fixed',inset:0,zIndex:9999,
    display:'flex',alignItems:'center',justifyContent:'center',
    padding:'12px',
    background:'rgba(0,0,0,0.88)',
    backdropFilter:'blur(16px)',
    WebkitBackdropFilter:'blur(16px)',
    animation:'pgFadeIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
  },
  modal:{
    position:'relative',width:'100%',maxWidth:'1280px',
    background:'linear-gradient(145deg,#080d1a 0%,#0f172a 40%,#080d1a 100%)',
    borderRadius:'28px',
    border:'1px solid rgba(255,255,255,0.07)',
    boxShadow:'0 0 120px rgba(13,148,136,0.12),0 60px 120px rgba(0,0,0,0.7)',
    maxHeight:'94vh',display:'flex',flexDirection:'column',overflow:'hidden',
  },
  header:{
    padding:'28px 36px 20px',
    background:'linear-gradient(135deg,rgba(13,148,136,0.12) 0%,rgba(99,102,241,0.08) 100%)',
    borderBottom:'1px solid rgba(255,255,255,0.05)',
    position:'relative',
  },
  closeBtn:{
    position:'absolute',top:'18px',right:'18px',
    background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',
    borderRadius:'50%',width:'34px',height:'34px',
    display:'flex',alignItems:'center',justifyContent:'center',
    cursor:'pointer',color:'#64748b',transition:'all 0.2s',
  },
  eyebrow:{
    display:'inline-flex',alignItems:'center',gap:'6px',
    background:'rgba(20,184,166,0.12)',border:'1px solid rgba(20,184,166,0.25)',
    borderRadius:'999px',padding:'3px 12px',
    fontSize:'11px',fontWeight:700,color:'#2dd4bf',letterSpacing:'0.1em',
    marginBottom:'10px',
  },
  title:{
    fontSize:'clamp(1.4rem,3vw,2rem)',fontWeight:900,
    background:'linear-gradient(135deg,#fff 0%,#94a3b8 100%)',
    WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
    marginBottom:'6px',lineHeight:1.2,
  },
  subtitle:{fontSize:'0.85rem',color:'#475569',maxWidth:'560px'},

  // STATS BAR
  statsBar:{
    display:'flex',gap:'24px',flexWrap:'wrap',
    padding:'12px 36px',
    borderBottom:'1px solid rgba(255,255,255,0.05)',
    background:'rgba(0,0,0,0.2)',
  },
  stat:{display:'flex',alignItems:'center',gap:'8px'},
  statNum:{fontSize:'1.1rem',fontWeight:800,color:'#2dd4bf'},
  statLabel:{fontSize:'0.72rem',color:'#475569'},

  // STORIES
  storiesRow:{
    display:'flex',gap:'10px',
    padding:'14px 36px',
    borderBottom:'1px solid rgba(255,255,255,0.05)',
    background:'rgba(20,184,166,0.03)',
    overflowX:'auto',
  },
  storyCard:{
    flexShrink:0,
    background:'rgba(13,148,136,0.08)',
    border:'1px solid rgba(13,148,136,0.18)',
    borderRadius:'12px',padding:'10px 14px',
    maxWidth:'230px',
  },
  storyQuote:{fontSize:'0.75rem',color:'#94a3b8',lineHeight:1.5,marginBottom:'8px'},
  storyAuthor:{display:'flex',alignItems:'center',gap:'6px'},
  storyAvatar:{
    width:'24px',height:'24px',borderRadius:'50%',
    display:'flex',alignItems:'center',justifyContent:'center',
    fontSize:'11px',fontWeight:700,color:'#fff',
    background:'linear-gradient(135deg,#0d9488,#14b8a6)',
  },
  storyName:{fontSize:'0.7rem',fontWeight:700,color:'#cbd5e1'},
  storyRole:{fontSize:'0.65rem',color:'#475569'},

  // CARDS
  cardsArea:{
    display:'grid',
    gridTemplateColumns:'repeat(4,1fr)',
    gap:'14px',
    padding:'20px 28px 28px',
    overflowY:'auto',
  },
  card:(v)=>({
    borderRadius:'20px',padding:'22px 18px',
    display:'flex',flexDirection:'column',
    position:'relative',border:'1px solid',
    transition:'transform 0.25s ease,box-shadow 0.25s ease',
    ...(v==='free'?{
      background:'rgba(255,255,255,0.025)',borderColor:'rgba(255,255,255,0.06)',
    }:v==='saas'?{
      background:'linear-gradient(145deg,rgba(13,148,136,0.18) 0%,rgba(5,78,72,0.12) 100%)',
      borderColor:'rgba(20,184,166,0.45)',
      boxShadow:'0 0 50px rgba(13,148,136,0.18)',
      transform:'translateY(-10px)',
    }:v==='vip'?{
      background:'linear-gradient(145deg,rgba(217,119,6,0.14) 0%,rgba(120,53,15,0.1) 100%)',
      borderColor:'rgba(245,158,11,0.4)',
      boxShadow:'0 0 50px rgba(245,158,11,0.1)',
    }:{
      background:'linear-gradient(145deg,rgba(99,102,241,0.14) 0%,rgba(49,46,129,0.1) 100%)',
      borderColor:'rgba(99,102,241,0.4)',
      boxShadow:'0 0 50px rgba(99,102,241,0.1)',
    }),
  }),
  badge:(c)=>({
    position:'absolute',top:'-12px',left:'50%',transform:'translateX(-50%)',
    borderRadius:'999px',padding:'4px 14px',
    fontSize:'10px',fontWeight:800,color:'#fff',letterSpacing:'0.08em',
    whiteSpace:'nowrap',boxShadow:'0 4px 14px rgba(0,0,0,0.4)',
    ...(c==='teal'?{background:'linear-gradient(135deg,#0d9488,#14b8a6)'}
      :c==='amber'?{background:'linear-gradient(135deg,#b45309,#f59e0b)'}
      :{background:'linear-gradient(135deg,#4f46e5,#818cf8)'}),
  }),
  cardLabel:(c)=>({
    fontSize:'10px',fontWeight:700,letterSpacing:'0.12em',
    textTransform:'uppercase',color:c,marginBottom:'6px',
  }),
  price:{fontSize:'1.9rem',fontWeight:900,color:'#fff',lineHeight:1.1},
  priceSuffix:{fontSize:'0.75rem',color:'#64748b',marginTop:'2px'},
  priceAccent:{fontSize:'0.75rem',fontWeight:700,marginTop:'2px'},
  divider:{
    margin:'12px 0',
    borderTop:'1px solid rgba(255,255,255,0.06)',
  },
  desc:{fontSize:'0.75rem',color:'#64748b',lineHeight:1.6,marginBottom:'12px'},
  features:{display:'flex',flexDirection:'column',gap:'8px',flex:1},
  feat:(on,c)=>({
    display:'flex',alignItems:'flex-start',gap:'7px',
    fontSize:'0.75rem',
    color:on?'#e2e8f0':'#334155',
    ...(on?{}:{textDecoration:'line-through'}),
  }),
  featIcon:(on,c)=>({
    flexShrink:0,marginTop:'1px',
    color:on?(c||'#2dd4bf'):'#ef4444',
  }),
  highlight:{
    marginTop:'10px',
    background:'rgba(20,184,166,0.08)',
    border:'1px solid rgba(20,184,166,0.18)',
    borderRadius:'10px',padding:'8px 10px',
    fontSize:'0.7rem',color:'#2dd4bf',lineHeight:1.5,
  },
  btn:(v)=>({
    marginTop:'16px',width:'100%',padding:'11px 14px',
    borderRadius:'12px',border:'none',
    fontWeight:800,fontSize:'0.82rem',
    cursor:'pointer',letterSpacing:'0.02em',
    display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',
    transition:'all 0.2s',
    ...(v==='ghost'?{
      background:'rgba(255,255,255,0.05)',color:'#64748b',
    }:v==='teal'?{
      background:'linear-gradient(135deg,#0d9488,#14b8a6)',color:'#fff',
      boxShadow:'0 8px 28px rgba(13,148,136,0.4)',
    }:v==='amber'?{
      background:'linear-gradient(135deg,#b45309,#f59e0b)',color:'#fff',
      boxShadow:'0 8px 28px rgba(245,158,11,0.35)',
    }:{
      background:'linear-gradient(135deg,#4f46e5,#818cf8)',color:'#fff',
      boxShadow:'0 8px 28px rgba(99,102,241,0.35)',
    }),
  }),
};

export default function PricingModal({ onClose }) {
  return (
    <div style={S.overlay} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <style>{`
        @keyframes pgFadeIn{from{opacity:0;transform:scale(0.94) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
        .pg-card:hover{transform:translateY(-6px) !important;box-shadow:0 24px 60px rgba(0,0,0,0.5) !important;}
        .pg-card-pop:hover{transform:translateY(-14px) !important;}
        .pg-btn:hover{filter:brightness(1.12);transform:translateY(-2px);}
        .pg-close:hover{background:rgba(255,255,255,0.14) !important;color:#fff !important;}
        .pg-story::-webkit-scrollbar{height:4px}
        .pg-story::-webkit-scrollbar-thumb{background:rgba(20,184,166,0.3);border-radius:4px}
      `}</style>

      <div style={S.modal}>

        {/* ─── HEADER ─── */}
        <div style={S.header}>
          <button style={S.closeBtn} className="pg-close" onClick={onClose}><X size={15}/></button>
          <div style={S.eyebrow}><Zap size={11}/> UPGRADE AKUN ANDA</div>
          <div style={S.title}>Kasir Cerdas, Bisnis Tanpa Batas 🚀</div>
          <div style={S.subtitle}>
            Dari warung kecil hingga toko bercabang — PayuO hadir untuk semua skala. Pilih paket yang paling cocok untuk Anda.
          </div>
        </div>

        {/* ─── STATS ─── */}
        <div style={S.statsBar}>
          {[
            {n:'2.400+',l:'Pemilik Toko Aktif'},
            {n:'Rp 4,8 M',l:'Transaksi Diproses / Bulan'},
            {n:'4.9★',l:'Rating Kepuasan'},
            {n:'< 30 dtk',l:'Waktu Setup Awal'},
            {n:'24/7',l:'Pantau Kapan Saja'},
          ].map((s,i)=>(
            <div style={S.stat} key={i}>
              <div style={S.statNum}>{s.n}</div>
              <div style={S.statLabel}>{s.l}</div>
              {i<4&&<div style={{color:'rgba(255,255,255,0.08)',fontSize:'18px'}}>│</div>}
            </div>
          ))}
        </div>

        {/* ─── STORIES / TESTIMONI ─── */}
        <div style={S.storiesRow} className="pg-story">
          {[
            {q:'"Saya di Bali, toko saya di Surabaya. Tiap hari saya cek omset dari HP — PayuO kayak punya mata di toko sendiri!"',name:'Pak Rudi H.',role:'Toko Sembako, Surabaya',init:'R'},
            {q:'"Dulu kasirnya sering ngitung sendiri. Sekarang semua tercatat otomatis, saya bisa audit kapan saja dari HP."',name:'Bu Sari W.',role:'Warung Makan, Bandung',init:'S'},
            {q:'"5 HP bisa akses bareng — saya, istri, sama 3 karyawan. Stok langsung update kalau ada yang beli!"',name:'Pak Jono P.',role:'Toko Kelontong, Semarang',init:'J'},
            {q:'"Beli paket offline dulu, eh sekarang upgrade ke SaaS karena mau pantau dari rumah. Worth it banget!"',name:'Mba Dina K.',role:'Toko Fashion, Solo',init:'D'},
            {q:'"Laporan laba rugi langsung bisa dikirim ke rekanan saya. Profesional banget untuk usaha kecil."',name:'Mas Fajar T.',role:'Toko Elektronik, Malang',init:'F'},
          ].map((t,i)=>(
            <div style={S.storyCard} key={i}>
              <div style={{...S.storyQuote,fontStyle:'italic'}}>⭐⭐⭐⭐⭐<br/>{t.q}</div>
              <div style={S.storyAuthor}>
                <div style={S.storyAvatar}>{t.init}</div>
                <div>
                  <div style={S.storyName}>{t.name}</div>
                  <div style={S.storyRole}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── CARDS ─── */}
        <div style={S.cardsArea}>

          {/* FREE */}
          <div style={S.card('free')} className="pg-card">
            <div style={{...S.cardLabel('#fbbf24'),fontSize:'11px'}}>🎁 TRIAL GRATIS 7 HARI</div>
            <div style={S.price}>Gratis</div>
            <div style={{...S.priceSuffix,color:'#fbbf24',fontWeight:700}}>AKSES PENUH — Tanpa Kartu Kredit!</div>
            <hr style={S.divider}/>
            <div style={{...S.desc,color:'#94a3b8'}}>
              <strong style={{color:'#fbbf24'}}>Coba dulu, bayar kalau ketagihan!</strong> Nikmati SEMUA fitur premium selama 7 hari penuh — tidak ada yang dibatasi.
            </div>
            <div style={S.features}>
              <div style={S.feat(true,'#fbbf24')}><span style={S.featIcon(true,'#fbbf24')}><Zap size={13}/></span><strong>SEMUA Fitur Premium</strong> terbuka penuh!</div>
              <div style={S.feat(true,'#fbbf24')}><span style={S.featIcon(true,'#fbbf24')}><Users size={13}/></span>Multi-Device (sampai 5 HP)</div>
              <div style={S.feat(true,'#fbbf24')}><span style={S.featIcon(true,'#fbbf24')}><Eye size={13}/></span>Pantau Toko dari Jarak Jauh</div>
              <div style={S.feat(true,'#fbbf24')}><span style={S.featIcon(true,'#fbbf24')}><Check size={13}/></span>Kasbon & Hutang Pelanggan</div>
              <div style={S.feat(true,'#fbbf24')}><span style={S.featIcon(true,'#fbbf24')}><Printer size={13}/></span>Cetak Struk Bluetooth</div>
              <div style={S.feat(true,'#fbbf24')}><span style={S.featIcon(true,'#fbbf24')}><TrendingUp size={13}/></span>Laporan Laba Rugi + Export</div>
            </div>
            <div style={{...S.highlight,background:'rgba(251,191,36,0.07)',border:'1px solid rgba(251,191,36,0.25)',color:'#fbbf24',marginTop:'10px'}}>
              ⏳ Setelah 7 hari, pilih paket agar semua data & riwayat transaksi Anda tidak hilang!
            </div>
            <button style={{...S.btn('ghost'),background:'rgba(251,191,36,0.1)',color:'#fbbf24',border:'1px solid rgba(251,191,36,0.2)'}} className="pg-btn" onClick={onClose}>
              Kembali & Nikmati Trial →
            </button>
          </div>

          {/* SAAS */}
          <div style={S.card('saas')} className="pg-card pg-card-pop">
            <div style={S.badge('teal')}>⭐ PALING DIMINATI</div>
            <div style={S.cardLabel('#2dd4bf')}>🌐 SaaS Cloud (Online)</div>
            <div style={{display:'flex',alignItems:'flex-end',gap:'4px'}}>
              <div style={S.price}>Rp 99rb</div>
              <div style={{fontSize:'0.8rem',color:'#64748b',marginBottom:'4px'}}>/bulan</div>
            </div>
            <div style={{...S.priceAccent,color:'#2dd4bf'}}>≈ Rp 3.300/hari — lebih murah dari kopi!</div>
            <hr style={S.divider}/>
            <div style={S.desc}>
              <strong style={{color:'#fff'}}>Bos tenang, bisnis jalan.</strong> Akses penuh dari manapun — pantau toko, stok, & kasbon tanpa perlu hadir fisik.
            </div>
            <div style={S.features}>
              <div style={S.feat(true,'#2dd4bf')}><span style={S.featIcon(true,'#2dd4bf')}><Users size={13}/></span><strong>Bisa diakses dari 5 HP berbeda</strong> bersamaan</div>
              <div style={S.feat(true,'#2dd4bf')}><span style={S.featIcon(true,'#2dd4bf')}><Eye size={13}/></span><strong>Pantau Toko dari Jarak Jauh</strong> real-time</div>
              <div style={S.feat(true,'#2dd4bf')}><span style={S.featIcon(true,'#2dd4bf')}><Zap size={13}/></span>Transaksi <strong>Unlimited</strong> tanpa batasan</div>
              <div style={S.feat(true,'#2dd4bf')}><span style={S.featIcon(true,'#2dd4bf')}><Check size={13}/></span>Kasbon & Hutang Pelanggan</div>
              <div style={S.feat(true,'#2dd4bf')}><span style={S.featIcon(true,'#2dd4bf')}><Printer size={13}/></span>Cetak Struk via Bluetooth</div>
              <div style={S.feat(true,'#2dd4bf')}><span style={S.featIcon(true,'#2dd4bf')}><TrendingUp size={13}/></span>Laporan Laba Rugi + Export Excel</div>
            </div>
            <div style={S.highlight}>
              💡 <strong>Bos di Jakarta, toko di Surabaya?</strong> Cek omset, tambah produk, pantau kasbon — semua dari HP Anda, kapanpun!
            </div>
            <button style={S.btn('teal')} className="pg-btn" onClick={()=>handleWA('Paket SaaS Cloud Rp 99.000/bulan (Online Multi-Device)')}>
              <Cloud size={15}/> Mulai Berlangganan Sekarang →
            </button>
          </div>

          {/* VIP BUNDLE */}
          <div style={S.card('vip')} className="pg-card">
            <div style={S.badge('amber')}>🖨️ BUNDLE TERLENGKAP</div>
            <div style={S.cardLabel('#f59e0b')}>👑 Paket Usaha VIP</div>
            <div style={S.price}>Rp 1,5 Jt</div>
            <div style={{...S.priceAccent,color:'#f59e0b'}}>+ Server hanya Rp 35rb/bln</div>
            <div style={S.priceSuffix}>Hardware + Cloud Online</div>
            <hr style={S.divider}/>
            <div style={S.desc}>
              <strong style={{color:'#fff'}}>Solusi turnkey terlengkap.</strong> Terima alat fisik kasir, langsung aktif + bisa pantau dari jauh seperti SaaS.
            </div>
            <div style={S.features}>
              <div style={S.feat(true,'#f59e0b')}><span style={S.featIcon(true,'#f59e0b')}><Users size={13}/></span><strong>5 HP berbeda bisa akses</strong> bersamaan</div>
              <div style={S.feat(true,'#f59e0b')}><span style={S.featIcon(true,'#f59e0b')}><Eye size={13}/></span>Pantau Toko Jarak Jauh (Online)</div>
              <div style={S.feat(true,'#f59e0b')}><span style={S.featIcon(true,'#f59e0b')}><Printer size={13}/></span><strong>BONUS: Printer Kasir Bluetooth</strong> siap pakai</div>
              <div style={S.feat(true,'#f59e0b')}><span style={S.featIcon(true,'#f59e0b')}><Check size={13}/></span>Semua Fitur SaaS Unlimited</div>
              <div style={S.feat(true,'#f59e0b')}><span style={S.featIcon(true,'#f59e0b')}><PhoneCall size={13}/></span>CS VIP Prioritas 24/7</div>
              <div style={S.feat(true,'#f59e0b')}><span style={S.featIcon(true,'#f59e0b')}><ShieldCheck size={13}/></span>Server 35rb/bln <strong>selamanya</strong> (hemat 64%!)</div>
            </div>
            <div style={{...S.highlight,background:'rgba(245,158,11,0.07)',border:'1px solid rgba(245,158,11,0.2)',color:'#f59e0b'}}>
              🎁 <strong>Langsung siap pakai!</strong> Kami setup semua. Tinggal tancap listrik, langsung jualan!
            </div>
            <button style={S.btn('amber')} className="pg-btn" onClick={()=>handleWA('Paket Usaha VIP Bundle Hardware (Rp 1.5 Jt + Printer Bluetooth + Server 35rb/bln)')}>
              <Printer size={15}/> Pesan Paket VIP Sekarang →
            </button>
          </div>

          {/* OFFLINE */}
          <div style={S.card('offline')} className="pg-card">
            <div style={S.badge('indigo')}>📱 BELI PUTUS</div>
            <div style={S.cardLabel('#818cf8')}>💾 Paket Offline Pro</div>
            <div style={S.price}>Rp 1,5 Jt</div>
            <div style={{...S.priceAccent,color:'#4ade80'}}>SELAMANYA — Tanpa Biaya Bulanan!</div>
            <div style={S.priceSuffix}>Install di Android / PC</div>
            <hr style={S.divider}/>
            <div style={S.desc}>
              Untuk Anda yang lebih suka data disimpan di perangkat sendiri. Bayar sekali, pakai selamanya.
            </div>
            <div style={S.features}>
              <div style={S.feat(true,'#818cf8')}><span style={S.featIcon(true,'#818cf8')}><Lock size={13}/></span>Lisensi Selamanya (1x Bayar)</div>
              <div style={S.feat(true,'#818cf8')}><span style={S.featIcon(true,'#818cf8')}><Printer size={13}/></span><strong>BONUS Printer</strong> Listrik/Portable (Undian Acak!)</div>
              <div style={S.feat(true,'#818cf8')}><span style={S.featIcon(true,'#818cf8')}><Zap size={13}/></span>Transaksi & Produk Unlimited</div>
              <div style={S.feat(true,'#818cf8')}><span style={S.featIcon(true,'#818cf8')}><ShieldCheck size={13}/></span>Data 100% Aman di Perangkat Sendiri</div>
              <div style={S.feat(false)}><span style={S.featIcon(false)}><WifiOff size={13}/></span>Hanya 1 HP/PC (tidak multi-device)</div>
              <div style={S.feat(false)}><span style={S.featIcon(false)}><X size={13}/></span>Tidak bisa pantau dari jarak jauh</div>
            </div>
            <div style={{...S.highlight,background:'rgba(99,102,241,0.07)',border:'1px solid rgba(99,102,241,0.2)',color:'#a5b4fc'}}>
              ⚠️ <strong>Perlu pantau dari luar toko?</strong> Pilih SaaS atau VIP — lebih fleksibel untuk bisnis yang berkembang.
            </div>
            <button style={S.btn('indigo')} className="pg-btn" onClick={()=>handleWA('Paket Beli Putus Offline (Rp 1.5 Jt + Bonus Printer Acak)')}>
              <Smartphone size={15}/> Beli Lisensi Offline →
            </button>
          </div>

        </div>

        {/* ─── PRINTER BANNER ─── */}
        <div style={{
          margin:'0 28px 28px',
          borderRadius:'20px',
          overflow:'hidden',
          border:'1px solid rgba(236,72,153,0.25)',
          background:'linear-gradient(135deg, #0f0a1e 0%, #1a0a2e 40%, #0a1628 100%)',
          boxShadow:'0 0 60px rgba(236,72,153,0.08)',
          position:'relative',
        }}>
          {/* Glow blobs */}
          <div style={{position:'absolute',top:'-40px',right:'80px',width:'200px',height:'200px',borderRadius:'50%',background:'rgba(168,85,247,0.12)',filter:'blur(60px)',pointerEvents:'none'}}></div>
          <div style={{position:'absolute',bottom:'-40px',left:'120px',width:'160px',height:'160px',borderRadius:'50%',background:'rgba(236,72,153,0.1)',filter:'blur(50px)',pointerEvents:'none'}}></div>

          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'20px',padding:'22px 28px',position:'relative'}}>
            
            {/* Left: Icon + Text */}
            <div style={{display:'flex',alignItems:'center',gap:'18px'}}>
              {/* Printer illustration */}
              <div style={{
                width:'64px',height:'64px',borderRadius:'16px',flexShrink:0,
                background:'linear-gradient(135deg,#7c3aed,#ec4899)',
                display:'flex',alignItems:'center',justifyContent:'center',
                boxShadow:'0 8px 24px rgba(124,58,237,0.4)',
                fontSize:'28px',
              }}>🖨️</div>
              <div>
                <div style={{
                  display:'inline-flex',alignItems:'center',gap:'5px',
                  background:'rgba(236,72,153,0.15)',
                  border:'1px solid rgba(236,72,153,0.3)',
                  borderRadius:'999px',padding:'2px 10px',
                  fontSize:'10px',fontWeight:700,color:'#f472b6',
                  letterSpacing:'0.08em',marginBottom:'6px',
                }}>🔥 AKSESORIS KASIR</div>
                <div style={{fontSize:'1.1rem',fontWeight:900,color:'#fff',marginBottom:'4px',lineHeight:1.2}}>
                  Butuh Printer Kasir Thermal? <span style={{color:'#e879f9'}}>Kami Jual Sendiri!</span>
                </div>
                <div style={{fontSize:'0.78rem',color:'#94a3b8',maxWidth:'480px',lineHeight:1.5}}>
                  Printer <strong style={{color:'#e2e8f0'}}>Bluetooth Portabel</strong> & <strong style={{color:'#e2e8f0'}}>Thermal Listrik</strong> untuk semua merk HP — langsung konek ke PayuO tanpa setting ribet. Stok terbatas!
                </div>
                {/* Mini features */}
                <div style={{display:'flex',gap:'16px',marginTop:'10px',flexWrap:'wrap'}}>
                  {[
                    {icon:'⚡',text:'Cetak < 3 detik'},
                    {icon:'📱',text:'Konek via Bluetooth'},
                    {icon:'🔋',text:'Versi Portabel tersedia'},
                    {icon:'📦',text:'Siap Kirim ke Seluruh Indonesia'},
                  ].map((f,i)=>(
                    <div key={i} style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'0.72rem',color:'#94a3b8'}}>
                      <span>{f.icon}</span><span>{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: CTA */}
            <div style={{display:'flex',flexDirection:'column',gap:'10px',alignItems:'flex-end',flexShrink:0}}>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:'0.7rem',color:'#64748b',marginBottom:'2px'}}>Mulai dari</div>
                <div style={{fontSize:'1.6rem',fontWeight:900,color:'#fff',lineHeight:1}}>Rp 299rb</div>
                <div style={{fontSize:'0.7rem',color:'#a78bfa'}}>Garansi Kompatibel PayuO ✓</div>
              </div>
              <button
                onClick={()=>handleWA('Printer Kasir Thermal untuk PayuO')}
                className="pg-btn"
                style={{
                  padding:'12px 24px',
                  background:'linear-gradient(135deg,#7c3aed,#ec4899)',
                  border:'none',borderRadius:'14px',
                  color:'#fff',fontWeight:800,fontSize:'0.85rem',
                  cursor:'pointer',
                  boxShadow:'0 8px 24px rgba(124,58,237,0.4)',
                  display:'flex',alignItems:'center',gap:'8px',
                  whiteSpace:'nowrap',
                  transition:'all 0.2s',
                }}
              >
                <Printer size={16}/> Tanya Harga via WhatsApp →
              </button>
              <div style={{fontSize:'0.68rem',color:'#475569',textAlign:'right'}}>
                💬 Respon cepat · Bisa COD area tertentu
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
