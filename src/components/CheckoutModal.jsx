import React, { useState, useEffect } from 'react';
import { X, CreditCard, BookOpen, CheckCircle, Search, User } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function CheckoutModal({ isOpen, onClose, totalAmount, cart, onClearCart }) {
  const [method, setMethod] = useState(''); // 'tunai' | 'kasbon'
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
    
    setIsSuccess(true);
    setIsProcessing(false);
    onClearCart();
    
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      setMethod('');
      setSelectedCustomer(null);
    }, 2500);
  };

  if (!isOpen) return null;

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in">
        <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-xl text-center flex flex-col items-center justify-center animate-slide-up">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-md animate-float">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-secondary mb-2">Transaksi Sukses!</h2>
          <p className="text-secondary-light">
            {method === 'kasbon' ? `Tercatat sebagai Kasbon untuk ${selectedCustomer?.name}` : 'Pembayaran tunai diterima.'}
          </p>
        </div>
      </div>
    );
  }

  const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-slide-up flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full p-2 z-10">
          <X size={20} />
        </button>
        
        <div className="p-xl border-b border-border bg-slate-50 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Tagihan</p>
          <h2 className="text-3xl font-black text-primary">Rp {totalAmount.toLocaleString('id-ID')}</h2>
        </div>
        
        <div className="p-xl flex-1 overflow-y-auto">
          {!method ? (
            <div className="space-y-sm">
              <h3 className="font-bold text-secondary text-lg mb-4 text-center">Pilih Metode Pembayaran</h3>
              
              <button 
                onClick={() => setMethod('tunai')}
                className="w-full flex items-center gap-md p-md rounded-2xl border-2 border-slate-100 hover:border-primary hover:bg-primary-light/30 transition-all group"
              >
                <div className="w-12 h-12 bg-slate-100 text-slate-500 group-hover:bg-primary group-hover:text-white rounded-xl flex items-center justify-center transition-colors">
                  <CreditCard size={24} />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-secondary text-lg">Bayar Tunai / Transfer</h4>
                  <p className="text-sm text-slate-400">Terima uang langsung (Lunas)</p>
                </div>
              </button>

              <button 
                onClick={() => setMethod('kasbon')}
                className="w-full flex items-center gap-md p-md rounded-2xl border-2 border-slate-100 hover:border-danger hover:bg-red-50 transition-all group"
              >
                <div className="w-12 h-12 bg-slate-100 text-slate-500 group-hover:bg-danger group-hover:text-white rounded-xl flex items-center justify-center transition-colors">
                  <BookOpen size={24} />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-secondary text-lg">Catat Kasbon</h4>
                  <p className="text-sm text-slate-400">Pembeli ngutang, catat di Buku Kasbon</p>
                </div>
              </button>
            </div>
          ) : method === 'kasbon' ? (
            <div className="flex flex-col h-full animate-slide-up">
              <div className="flex items-center gap-2 mb-md">
                <button onClick={() => { setMethod(''); setSelectedCustomer(null); }} className="text-slate-400 hover:text-primary">&larr; Kembali</button>
                <h3 className="font-bold text-secondary text-lg">Siapa yang ngutang?</h3>
              </div>
              
              <div className="relative mb-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Cari pelanggan kasbon..." 
                  className="input w-full pl-9 bg-slate-50"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-2 flex-1 overflow-y-auto max-h-60 mb-md border-y border-slate-100 py-2">
                {customers.length === 0 ? (
                  <p className="text-center text-sm text-slate-400 py-4">Belum ada pelanggan. Tambahkan dulu di menu Kasbon.</p>
                ) : filteredCustomers.length === 0 ? (
                  <p className="text-center text-sm text-slate-400 py-4">Pelanggan tidak ditemukan.</p>
                ) : (
                  filteredCustomers.map(c => (
                    <button 
                      key={c.id}
                      onClick={() => setSelectedCustomer(c)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${selectedCustomer?.id === c.id ? 'border-primary bg-primary-light/20' : 'border-transparent hover:bg-slate-50'}`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${selectedCustomer?.id === c.id ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'}`}>
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-bold text-secondary truncate">{c.name}</p>
                        <p className="text-xs text-slate-400">Hutang: Rp {Number(c.total_debt || 0).toLocaleString('id-ID')}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>

              <button 
                onClick={handleCheckout} 
                disabled={!selectedCustomer || isProcessing}
                className="btn btn-primary w-full py-3"
              >
                {isProcessing ? 'Memproses...' : `Sahkan Kasbon Rp ${totalAmount.toLocaleString('id-ID')}`}
              </button>
            </div>
          ) : (
            <div className="flex flex-col animate-slide-up text-center">
              <h3 className="font-bold text-secondary text-lg mb-2">Terima Pembayaran Tunai</h3>
              <p className="text-slate-500 text-sm mb-lg">Transaksi lunas sebesar Rp {totalAmount.toLocaleString('id-ID')} akan diproses.</p>
              
              <div className="flex gap-sm">
                <button onClick={() => setMethod('')} className="btn bg-slate-100 text-slate-600 flex-1">Batal</button>
                <button onClick={handleCheckout} disabled={isProcessing} className="btn btn-primary flex-1">
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
