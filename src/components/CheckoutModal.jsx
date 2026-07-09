import React, { useState, useEffect } from 'react';
import { X, CreditCard, BookOpen, CheckCircle, Search, User } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import Receipt from './Receipt';

export default function CheckoutModal({ isOpen, onClose, totalAmount, cart, onClearCart, storeSettings }) {
  const [method, setMethod] = useState(''); // 'tunai' | 'kasbon'
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    if (isOpen && method === 'kasbon' && customers.length === 0) {
      fetchCustomers();
    }
  }, [isOpen, method]);

  const fetchCustomers = async () => {
    const { data } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    if (data) setCustomers(data);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    if (method === 'kasbon' && selectedCustomer) {
      const itemsText = cart.map(c => `${c.name} (${c.quantity}x)`).join(', ');
      const notes = `Belanja Kasir: ${itemsText}`;
      
      const { error } = await supabase.from('kasbon_transactions').insert([{
        customer_id: selectedCustomer.id,
        amount: totalAmount,
        type: 'kasbon',
        notes: notes.length > 255 ? notes.substring(0, 250) + '...' : notes
      }]);
      
      if (error) {
        alert('Gagal mencatat kasbon. Pastikan database siap.');
        setIsProcessing(false);
        return;
      }
    }
    const currentData = {
      cart: [...cart],
      totalAmount,
      method,
      customerName: method === 'kasbon' ? selectedCustomer?.name : '',
      date: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
      storeSettings
    };
    
    setReceiptData(currentData);
    setIsSuccess(true);
    setIsProcessing(false);
    onClearCart();
    
    // Hilangkan auto-close agar kasir punya waktu untuk ngeprint
    // setTimeout(() => { ... }, 2500) dihapus
  };

  const handleCloseSuccess = () => {
    setIsSuccess(false);
    onClose();
    setMethod('');
    setSelectedCustomer(null);
    setReceiptData(null);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  const overlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '16px', zIndex: 60
  };

  const modalStyle = {
    backgroundColor: '#fff', borderRadius: '24px', width: '100%', maxWidth: '400px',
    overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
    position: 'relative', display: 'flex', flexDirection: 'column', maxHeight: '90vh'
  };

  const successModalStyle = { ...modalStyle, maxWidth: '300px', padding: '32px', textAlign: 'center', alignItems: 'center' };

  if (isSuccess) {
    return (
      <>
        {/* Kontainer struk tersembunyi (hanya terlihat saat diprint) */}
        <div className="print-only">
          <Receipt data={receiptData} />
        </div>

        <div style={overlayStyle} className="animate-fade-in hide-on-print">
          <div style={successModalStyle} className="animate-slide-up">
            <div style={{ width: '80px', height: '80px', backgroundColor: '#dcfce7', color: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <CheckCircle size={40} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#334155', marginBottom: '8px' }}>Transaksi Sukses!</h2>
            <p style={{ color: '#94a3b8', marginBottom: '24px' }}>
              {method === 'kasbon' ? `Tercatat sebagai Kasbon untuk ${selectedCustomer?.name}` : 'Pembayaran tunai diterima.'}
            </p>
          
          <button 
            onClick={handlePrint}
            style={{ width: '100%', padding: '12px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '8px', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}
          >
            🖨️ Cetak Struk (58mm)
          </button>
          
          <button 
            onClick={handleCloseSuccess}
            style={{ width: '100%', padding: '12px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Selesai
          </button>
        </div>
      </div>
      </>
    );
  }

  const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={overlayStyle} className="animate-fade-in">
      <div style={modalStyle} className="animate-slide-up">
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', right: '16px', top: '16px', backgroundColor: '#f1f5f9', color: '#94a3b8', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', zIndex: 10 }}
        >
          <X size={20} />
        </button>
        
        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Total Tagihan</p>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#0D9488', margin: 0 }}>Rp {totalAmount.toLocaleString('id-ID')}</h2>
        </div>
        
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
          {!method ? (
            <div>
              <h3 style={{ fontWeight: 'bold', color: '#334155', fontSize: '18px', marginBottom: '16px', textAlign: 'center' }}>Pilih Metode Pembayaran</h3>
              
              <button 
                onClick={() => setMethod('tunai')}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '16px', border: '2px solid #f1f5f9', backgroundColor: '#fff', cursor: 'pointer', marginBottom: '12px', textAlign: 'left', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#0D9488'; e.currentTarget.style.backgroundColor = '#f0fdfa'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.backgroundColor = '#fff'; }}
              >
                <div style={{ width: '48px', height: '48px', backgroundColor: '#0D9488', color: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={24} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 'bold', color: '#334155', fontSize: '16px', margin: 0 }}>Bayar Tunai / Transfer</h4>
                  <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Terima uang langsung (Lunas)</p>
                </div>
              </button>

              <button 
                onClick={() => setMethod('kasbon')}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderRadius: '16px', border: '2px solid #f1f5f9', backgroundColor: '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.backgroundColor = '#fef2f2'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.backgroundColor = '#fff'; }}
              >
                <div style={{ width: '48px', height: '48px', backgroundColor: '#ef4444', color: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={24} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 'bold', color: '#334155', fontSize: '16px', margin: 0 }}>Catat Kasbon</h4>
                  <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>Pembeli ngutang, catat di Buku Kasbon</p>
                </div>
              </button>
            </div>
          ) : method === 'kasbon' ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <button onClick={() => { setMethod(''); setSelectedCustomer(null); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>&larr; Kembali</button>
                <h3 style={{ fontWeight: 'bold', color: '#334155', fontSize: '18px', margin: 0 }}>Siapa yang ngutang?</h3>
              </div>
              
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <Search size={16} />
                </div>
                <input 
                  type="text" 
                  placeholder="Cari pelanggan kasbon..." 
                  style={{ width: '100%', padding: '12px 12px 12px 36px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              <div style={{ flex: 1, overflowY: 'auto', maxHeight: '240px', marginBottom: '16px', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '8px 0' }}>
                {customers.length === 0 ? (
                  <p style={{ textAlign: 'center', fontSize: '14px', color: '#94a3b8', padding: '16px 0' }}>Belum ada pelanggan. Tambahkan dulu di menu Kasbon.</p>
                ) : filteredCustomers.length === 0 ? (
                  <p style={{ textAlign: 'center', fontSize: '14px', color: '#94a3b8', padding: '16px 0' }}>Pelanggan tidak ditemukan.</p>
                ) : (
                  filteredCustomers.map(c => (
                    <button 
                      key={c.id}
                      onClick={() => setSelectedCustomer(c)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', border: selectedCustomer?.id === c.id ? '1px solid #0D9488' : '1px solid transparent', backgroundColor: selectedCustomer?.id === c.id ? '#f0fdfa' : 'transparent', textAlign: 'left', cursor: 'pointer', marginBottom: '4px' }}
                    >
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', backgroundColor: selectedCustomer?.id === c.id ? '#0D9488' : '#e2e8f0', color: selectedCustomer?.id === c.id ? '#fff' : '#475569' }}>
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <p style={{ fontWeight: 'bold', color: '#334155', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</p>
                        <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Hutang: Rp {Number(c.total_debt || 0).toLocaleString('id-ID')}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>

              <button 
                onClick={handleCheckout} 
                disabled={!selectedCustomer || isProcessing}
                style={{ width: '100%', padding: '12px', backgroundColor: !selectedCustomer || isProcessing ? '#cbd5e1' : '#0D9488', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: !selectedCustomer || isProcessing ? 'not-allowed' : 'pointer' }}
              >
                {isProcessing ? 'Memproses...' : `Sahkan Kasbon Rp ${totalAmount.toLocaleString('id-ID')}`}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
              <h3 style={{ fontWeight: 'bold', color: '#334155', fontSize: '18px', marginBottom: '8px' }}>Terima Pembayaran Tunai</h3>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Transaksi lunas sebesar Rp {totalAmount.toLocaleString('id-ID')} akan diproses.</p>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setMethod('')} style={{ flex: 1, padding: '12px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Batal</button>
                <button onClick={handleCheckout} disabled={isProcessing} style={{ flex: 1, padding: '12px', backgroundColor: isProcessing ? '#cbd5e1' : '#0D9488', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: isProcessing ? 'not-allowed' : 'pointer' }}>
                  {isProcessing ? 'Memproses...' : 'Selesaikan'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
