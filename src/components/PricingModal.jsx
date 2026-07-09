import React from 'react';
import { Check, X, Printer, Cloud, ShieldCheck, PhoneCall, Smartphone, Wifi, WifiOff, Zap, Eye, Users, TrendingUp, Lock, Star } from 'lucide-react';

const TESTIMONIALS = [
  { q: '"Saya di Bali, toko di Surabaya — cek omset tiap hari dari HP. PayuO kayak punya mata di toko sendiri!"', name: 'Pak Rudi H.', role: 'Toko Sembako', init: 'R' },
  { q: '"5 HP bisa akses bareng — saya, istri, 3 karyawan. Stok update otomatis kalau ada yang beli!"', name: 'Pak Jono P.', role: 'Kelontong, Semarang', init: 'J' },
  { q: '"Upgrade dari Offline ke SaaS supaya bisa pantau dari rumah. Worth it banget!"', name: 'Mba Dina K.', role: 'Toko Fashion, Solo', init: 'D' },
];

export default function PricingModal({ onClose, session }) {

  const processPayment = (paket, harga) => {
    // ==========================================
    // CETAK BIRU INTEGRASI MIDTRANS (SNAP API)
    // ==========================================
    // const midtransClientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
    // if (midtransClientKey) {
    //   window.snap.pay(token, {
    //     onSuccess: async function(result) {
    //       await supabase.from('store_settings').update({ subscription_tier: 'pro' }).eq('user_id', session.user.id);
    //       alert("Pembayaran Berhasil! Akun Anda sudah Pro.");
    //       window.location.reload();
    //     }
    //   });
    //   return;
    // }

    // ==========================================
    // JALUR WHATSAPP SEMENTARA (FALLBACK)
    // ==========================================
    const email = session?.user?.email || 'Guest';
    const text = `Halo Admin PayuO 👋\n\nSaya menggunakan email: *${email}*\nSaya tertarik berlangganan: *${paket}*\n\nMohon info pembayaran via QRIS/Transfer ya!`;
    const ADMIN_WA = '6285124070705';
    window.open(`https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '12px',
      background: 'rgba(0,0,0,0.9)',
      backdropFilter: 'blur(14px)',
      animation: 'pgIn .3s cubic-bezier(.34,1.56,.64,1)',
    }}>
      <style>{`
        @keyframes pgIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
        .pgc:hover{transform:translateY(-4px)!important;box-shadow:0 20px 50px rgba(0,0,0,.5)!important;}
        .pgcpop:hover{transform:translateY(-8px)!important;}
        .pgb:hover{filter:brightness(1.12);transform:translateY(-1px);}
        .pgX:hover{background:rgba(255,255,255,.15)!important;color:#fff!important;}
      `}</style>

      <div style={{
        width: '100%', maxWidth: '1180px',
        maxHeight: '96vh',
        background: 'linear-gradient(145deg,#07101f 0%,#0f172a 50%,#07101f 100%)',
        borderRadius: '22px',
        border: '1px solid rgba(255,255,255,.07)',
        boxShadow: '0 0 100px rgba(13,148,136,.12),0 40px 80px rgba(0,0,0,.6)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>

        {/* ══ HEADER ══ */}
        <div style={{ padding: '16px 24px 14px', background: 'linear-gradient(135deg,rgba(13,148,136,.12),rgba(99,102,241,.07))', borderBottom: '1px solid rgba(255,255,255,.05)', position: 'relative' }}>
          <button className="pgX" onClick={onClose} style={{ position: 'absolute', top: '12px', right: '14px', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', transition: 'all .2s' }}>
            <X size={14} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(20,184,166,.12)', border: '1px solid rgba(20,184,166,.25)', borderRadius: '999px', padding: '2px 10px', fontSize: '10px', fontWeight: 700, color: '#2dd4bf', letterSpacing: '.08em', marginBottom: '5px' }}>
                <Zap size={10} /> UPGRADE AKUN ANDA
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, background: 'linear-gradient(135deg,#fff,#94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.2 }}>
                Kasir Cerdas, Bisnis Tanpa Batas 🚀
              </div>
              <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '3px' }}>Dari warung kecil hingga toko bercabang — PayuO hadir untuk semua skala.</div>
            </div>
            {/* Stats inline */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {[['2.400+', 'Toko Aktif'], ['4.9★', 'Rating'], ['24/7', 'Pantau'], ['< 30dtk', 'Setup']].map(([n, l], i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#2dd4bf' }}>{n}</div>
                  <div style={{ fontSize: '0.62rem', color: '#475569' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ TESTIMONIALS ROW ══ */}
        <div style={{ display: 'flex', gap: '8px', padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,.04)', background: 'rgba(13,148,136,.03)', overflowX: 'auto' }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{ flexShrink: 0, background: 'rgba(13,148,136,.07)', border: '1px solid rgba(13,148,136,.15)', borderRadius: '10px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '320px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg,#0d9488,#14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>{t.init}</div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontStyle: 'italic', lineHeight: 1.4 }}>{t.q}</div>
                <div style={{ fontSize: '0.65rem', color: '#2dd4bf', fontWeight: 700, marginTop: '3px' }}>{t.name} · {t.role}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ══ CARDS ══ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', padding: '12px 20px', flex: 1 }}>

          {/* TRIAL */}
          <Card color="#fbbf24" bg="rgba(251,191,36,.05)" border="rgba(251,191,36,.25)" shadow="">
            <Label c="#fbbf24">🎁 TRIAL GRATIS 7 HARI</Label>
            <Price main="Gratis" sub={<span style={{ color: '#fbbf24', fontWeight: 700 }}>AKSES PENUH!</span>} />
            <Divider />
            <Desc><b style={{ color: '#fbbf24' }}>Coba dulu, bayar kalau ketagihan!</b> Semua fitur terbuka tanpa batasan selama 7 hari.</Desc>
            <Features color="#fbbf24" items={[
              [true, <><b>SEMUA Fitur Premium</b> terbuka!</>],
              [true, 'Multi-Device (sampai 5 HP)'],
              [true, 'Pantau Toko dari Jarak Jauh'],
              [true, 'Kasbon & Hutang Pelanggan'],
              [true, 'Cetak Struk Bluetooth'],
            ]} />
            <Note c="#fbbf24" bg="rgba(251,191,36,.07)" border="rgba(251,191,36,.2)">⏳ Setelah 7 hari, data hilang jika tidak berlangganan!</Note>
            <Btn v="ghost" gold onClick={onClose}>Nikmati Trial Dulu →</Btn>
          </Card>

          {/* SAAS */}
          <Card color="#2dd4bf" bg="linear-gradient(145deg,rgba(13,148,136,.18),rgba(5,78,72,.12))" border="rgba(20,184,166,.45)" shadow="0 0 40px rgba(13,148,136,.18)" pop badge="⭐ PALING DIMINATI" badgeColor="linear-gradient(135deg,#0d9488,#14b8a6)">
            <Label c="#2dd4bf">🌐 SaaS Cloud (Online)</Label>
            <Price main="Rp 99rb" sub="/bulan" accent={<span style={{ color: '#2dd4bf' }}>≈ Rp 3.300/hari — lebih murah dari kopi!</span>} />
            <Divider />
            <Desc><b style={{ color: '#fff' }}>Bos tenang, bisnis jalan.</b> Pantau toko dari manapun tanpa hadir fisik.</Desc>
            <Features color="#2dd4bf" items={[
              [true, <><b>5 HP berbeda</b> bisa akses bersamaan</>],
              [true, <><b>Pantau Jarak Jauh</b> real-time</>],
              [true, <><b>Transaksi Unlimited</b></>],
              [true, 'Kasbon & Hutang Pelanggan'],
              [true, 'Cetak Struk + Laporan Export'],
            ]} />
            <Note c="#2dd4bf" bg="rgba(13,148,136,.08)" border="rgba(13,148,136,.2)">💡 Bos di Jakarta, toko di Surabaya? Pantau kapanpun dari HP!</Note>
            <Btn v="teal" onClick={() => processPayment('Paket SaaS Cloud Rp 99.000/bulan')}><Cloud size={13} /> Berlangganan Sekarang →</Btn>
          </Card>

          {/* VIP */}
          <Card color="#f59e0b" bg="linear-gradient(145deg,rgba(217,119,6,.14),rgba(120,53,15,.1))" border="rgba(245,158,11,.4)" shadow="0 0 40px rgba(245,158,11,.1)" badge="🖨️ BUNDLE TERLENGKAP" badgeColor="linear-gradient(135deg,#b45309,#f59e0b)">
            <Label c="#f59e0b">👑 Paket Usaha VIP</Label>
            <Price main="Rp 1,5 Jt" sub="(Beli Putus)" accent={<span style={{ color: '#f59e0b' }}>+ Server Rp 35rb/bln</span>} />
            <Divider />
            <Desc><b style={{ color: '#fff' }}>All-in-One turnkey.</b> Terima printer fisik, langsung bisa pantau dari jauh!</Desc>
            <Features color="#f59e0b" items={[
              [true, <><b>5 HP akses + Pantau Jarak Jauh</b></>],
              [true, <><b>BONUS: Printer Bluetooth</b> siap pakai</>],
              [true, 'Semua Fitur SaaS Unlimited'],
              [true, 'CS VIP Prioritas 24/7'],
              [true, 'Server 35rb/bln selamanya (hemat 64%!)'],
            ]} />
            <Note c="#f59e0b" bg="rgba(245,158,11,.07)" border="rgba(245,158,11,.2)">🎁 Langsung siap pakai! Tinggal tancap listrik, langsung jualan!</Note>
            <Btn v="amber" onClick={() => processPayment('Paket Usaha VIP Bundle Hardware Rp 1.5 Jt + Printer')}><Printer size={13} /> Pesan Paket VIP →</Btn>
          </Card>

          {/* OFFLINE */}
          <Card color="#818cf8" bg="linear-gradient(145deg,rgba(99,102,241,.14),rgba(49,46,129,.1))" border="rgba(99,102,241,.4)" shadow="0 0 40px rgba(99,102,241,.1)" badge="📱 BELI PUTUS" badgeColor="linear-gradient(135deg,#4f46e5,#818cf8)">
            <Label c="#818cf8">💾 Paket Offline Pro</Label>
            <Price main="Rp 1,5 Jt" sub="1x Bayar Selamanya" accent={<span style={{ color: '#4ade80' }}>Tanpa Biaya Bulanan!</span>} />
            <Divider />
            <Desc>Install sekali di Android/PC. Data lokal aman. <b style={{ color: '#f87171' }}>Hanya 1 perangkat, tanpa pantau jarak jauh.</b></Desc>
            <Features color="#818cf8" items={[
              [true, 'Lisensi Selamanya (1x Bayar)'],
              [true, <><b>BONUS Printer</b> Listrik/Portable (Undian!)</>],
              [true, 'Transaksi & Produk Unlimited'],
              [false, 'Hanya 1 HP/PC (tidak multi-device)'],
              [false, 'Tidak bisa pantau jarak jauh'],
            ]} />
            <Note c="#a5b4fc" bg="rgba(99,102,241,.07)" border="rgba(99,102,241,.2)">⚠️ Perlu pantau dari luar toko? Pilih SaaS atau VIP.</Note>
            <Btn v="indigo" onClick={() => processPayment('Paket Beli Putus Offline Rp 1.5 Jt + Bonus Printer')}><Smartphone size={13} /> Beli Lisensi Offline →</Btn>
          </Card>

        </div>

        {/* ══ PRINTER BANNER ══ */}
        <div style={{ margin: '0 20px 16px', borderRadius: '14px', background: 'linear-gradient(135deg,#0f0a1e,#1a0a2e 50%,#0a1628)', border: '1px solid rgba(236,72,153,.25)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-30px', right: '100px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(168,85,247,.1)', filter: 'blur(40px)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg,#7c3aed,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', boxShadow: '0 6px 20px rgba(124,58,237,.4)', flexShrink: 0 }}>🖨️</div>
            <div>
              <div style={{ display: 'inline-flex', background: 'rgba(236,72,153,.15)', border: '1px solid rgba(236,72,153,.3)', borderRadius: '999px', padding: '1px 8px', fontSize: '9px', fontWeight: 700, color: '#f472b6', letterSpacing: '.08em', marginBottom: '4px' }}>🔥 AKSESORIS KASIR</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#fff' }}>Butuh Printer Kasir Thermal? <span style={{ color: '#e879f9' }}>Kami Jual!</span></div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                Bluetooth Portabel & Thermal Listrik · Langsung konek ke PayuO ·
                {' '}<span style={{ color: '#a78bfa' }}>⚡ Cetak &lt;3 dtk</span> ·
                {' '}<span style={{ color: '#a78bfa' }}>📦 Kirim Seluruh Indonesia</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Mulai dari</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>Rp 299rb</div>
              <div style={{ fontSize: '0.65rem', color: '#a78bfa' }}>Garansi Kompatibel PayuO ✓</div>
            </div>
            <button className="pgb" onClick={() => processPayment('Printer Kasir Thermal untuk PayuO')} style={{ padding: '10px 18px', background: 'linear-gradient(135deg,#7c3aed,#ec4899)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', boxShadow: '0 6px 20px rgba(124,58,237,.4)', display: 'flex', alignItems: 'center', gap: '7px', whiteSpace: 'nowrap', transition: 'all .2s' }}>
              <Printer size={14} /> Tanya Harga via WA →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─── Sub-components ─── */
function Card({ children, color, bg, border, shadow, pop, badge, badgeColor }) {
  return (
    <div className={`pgc${pop ? ' pgcpop' : ''}`} style={{ borderRadius: '16px', padding: '14px', display: 'flex', flexDirection: 'column', border: `1px solid ${border}`, background: bg, boxShadow: shadow || 'none', position: 'relative', transition: 'transform .25s,box-shadow .25s', transform: pop ? 'translateY(-6px)' : 'none' }}>
      {badge && <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: badgeColor, borderRadius: '999px', padding: '3px 12px', fontSize: '9px', fontWeight: 800, color: '#fff', letterSpacing: '.06em', whiteSpace: 'nowrap', boxShadow: '0 3px 10px rgba(0,0,0,.4)' }}>{badge}</div>}
      {children}
    </div>
  );
}
function Label({ c, children }) {
  return <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: c, marginBottom: '4px' }}>{children}</div>;
}
function Price({ main, sub, accent }) {
  return (
    <div style={{ marginBottom: '2px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>{main}</span>
        {sub && <span style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '2px' }}>{sub}</span>}
      </div>
      {accent && <div style={{ fontSize: '0.68rem', marginTop: '1px' }}>{accent}</div>}
    </div>
  );
}
function Divider() {
  return <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,.06)', margin: '8px 0' }} />;
}
function Desc({ children }) {
  return <div style={{ fontSize: '0.7rem', color: '#64748b', lineHeight: 1.5, marginBottom: '8px' }}>{children}</div>;
}
function Features({ items, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
      {items.map(([on, label], i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.7rem', color: on ? '#e2e8f0' : '#374151', textDecoration: on ? 'none' : 'line-through', opacity: on ? 1 : 0.45 }}>
          <span style={{ color: on ? (color || '#2dd4bf') : '#ef4444', flexShrink: 0, marginTop: '1px' }}>{on ? <Check size={12} /> : <X size={12} />}</span>
          {label}
        </div>
      ))}
    </div>
  );
}
function Note({ children, c, bg, border }) {
  return <div style={{ marginTop: '8px', background: bg, border: `1px solid ${border}`, borderRadius: '8px', padding: '6px 8px', fontSize: '0.65rem', color: c, lineHeight: 1.4 }}>{children}</div>;
}
function Btn({ v, children, onClick, gold }) {
  const styles = {
    teal: { background: 'linear-gradient(135deg,#0d9488,#14b8a6)', boxShadow: '0 6px 20px rgba(13,148,136,.4)' },
    amber: { background: 'linear-gradient(135deg,#b45309,#f59e0b)', boxShadow: '0 6px 20px rgba(245,158,11,.35)' },
    indigo: { background: 'linear-gradient(135deg,#4f46e5,#818cf8)', boxShadow: '0 6px 20px rgba(99,102,241,.35)' },
    ghost: gold
      ? { background: 'rgba(251,191,36,.1)', border: '1px solid rgba(251,191,36,.25)', color: '#fbbf24', boxShadow: 'none' }
      : { background: 'rgba(255,255,255,.05)', boxShadow: 'none' },
  };
  return (
    <button className="pgb" onClick={onClick} style={{ marginTop: '8px', width: '100%', padding: '9px 12px', borderRadius: '10px', border: 'none', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all .2s', ...styles[v] }}>
      {children}
    </button>
  );
}
