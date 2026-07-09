import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Users, Plus, Phone, MapPin, Image as ImageIcon, Search, ChevronRight, X, History, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';

export default function KasbonTab({ session }) {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dbError, setDbError] = useState(false);
  
  // Modals state
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', address: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (session) fetchCustomers();
  }, [session]);

  const fetchCustomers = async () => {
    setIsLoading(true);
    setDbError(false);
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching customers:', error);
      if (error.code === '42P01') {
        // relation "customers" does not exist
        setDbError(true);
      }
    } else {
      setCustomers(data || []);
    }
    setIsLoading(false);
  };

  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomer.name) return;
    
    setIsSaving(true);
    const { data, error } = await supabase
      .from('customers')
      .insert([{
        name: newCustomer.name,
        phone: newCustomer.phone,
        address: newCustomer.address,
      }])
      .select();
      
    if (!error && data) {
      setCustomers([data[0], ...customers]);
      setIsAddCustomerOpen(false);
      setNewCustomer({ name: '', phone: '', address: '' });
    }
    setIsSaving(false);
  };

  // Nanti kita buat logika untuk transaksi kasbon di dalam detail
  
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalKasbon = customers.reduce((sum, c) => sum + Number(c.total_debt || 0), 0);

  if (dbError) {
    return (
      <div className="flex-1 p-lg bg-background flex flex-col items-center justify-center animate-fade-in text-center h-full">
        <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-md">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-secondary mb-2">Sistem Kasbon Belum Siap</h2>
        <p className="text-secondary-light max-w-md">Harap jalankan <strong>setup_kasbon_schema.sql</strong> di SQL Editor Supabase Anda terlebih dahulu agar sistem ini aktif.</p>
        <button onClick={fetchCustomers} className="btn btn-primary mt-lg">Cek Ulang Koneksi Database</button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative animate-fade-in">
      {/* Header & Stats */}
      <div className="p-lg pb-md flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <h2 className="text-2xl font-bold text-secondary">Buku Kasbon</h2>
          <p className="text-sm text-secondary-light mt-1">Total Hutang Pelanggan: <strong className="text-danger">Rp {totalKasbon.toLocaleString('id-ID')}</strong></p>
        </div>
        <button 
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-primary-hover transition-colors"
          onClick={() => setIsAddCustomerOpen(true)}
        >
          <Plus size={18} /> Tambah Pelanggan
        </button>
      </div>

      {/* Search */}
      <div className="px-lg pb-md">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari nama pelanggan..." 
            className="input w-full pl-11 bg-white border-transparent shadow-sm"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Customer List */}
      <div className="flex-1 px-lg pb-24 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center p-xl"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center p-xl bg-white rounded-2xl border border-slate-100 shadow-sm mt-md">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} />
            </div>
            <h3 className="font-bold text-lg text-secondary">Belum Ada Pelanggan</h3>
            <p className="text-slate-400 text-sm mt-1">Mulai catat orang yang berhutang ke warung Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
            {filteredCustomers.map(customer => (
              <div 
                key={customer.id} 
                className="bg-white p-md rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex justify-between items-center group"
                onClick={() => setSelectedCustomer(customer)}
              >
                <div className="flex items-center gap-sm">
                  <div className="w-12 h-12 bg-primary-light text-primary rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-secondary truncate">{customer.name}</h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{customer.phone || 'Tanpa No HP'}</p>
                    <p className={`text-sm font-bold mt-1 ${customer.total_debt > 0 ? 'text-danger' : 'text-success'}`}>
                      {customer.total_debt > 0 ? `Hutang: Rp ${Number(customer.total_debt).toLocaleString('id-ID')}` : 'Lunas'}
                    </p>
                  </div>
                </div>
                <div className="text-slate-300 group-hover:text-primary transition-colors pr-2">
                  <ChevronRight size={20} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-slide-up">
            <button onClick={() => setIsAddCustomerOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full p-2">
              <X size={20} />
            </button>
            
            <div className="p-xl border-b border-border">
              <h2 className="text-xl font-bold text-secondary">Profil Pelanggan Baru</h2>
              <p className="text-sm text-secondary-light">Lengkapi data untuk catatan kasbon.</p>
            </div>
            
            <form onSubmit={handleSaveCustomer} className="p-xl space-y-md">
              <div className="input-group">
                <label className="input-label">Nama Lengkap *</label>
                <input required type="text" className="input bg-slate-50" placeholder="Misal: Budi Santoso" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
              </div>
              
              <div className="input-group">
                <label className="input-label flex items-center gap-1"><Phone size={14}/> No. WhatsApp (Opsional)</label>
                <input type="tel" className="input bg-slate-50" placeholder="Misal: 08123456789" value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} />
                <p className="text-[10px] text-slate-400 mt-1">Berguna agar Anda bisa mengirim tagihan otomatis ke WA pelanggan.</p>
              </div>

              <div className="input-group">
                <label className="input-label flex items-center gap-1"><MapPin size={14}/> Alamat / Info (Opsional)</label>
                <textarea className="input bg-slate-50 resize-none h-20" placeholder="Misal: Warung pertigaan gang buntu..." value={newCustomer.address} onChange={e => setNewCustomer({...newCustomer, address: e.target.value})} />
              </div>

              <button type="submit" disabled={isSaving || !newCustomer.name} className="btn btn-primary w-full py-3 mt-4">
                {isSaving ? 'Menyimpan...' : 'Simpan Pelanggan'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Detail Customer Modal (Placeholder) */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-slide-up flex flex-col h-[85vh]">
            <button onClick={() => setSelectedCustomer(null)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full p-2 z-10">
              <X size={20} />
            </button>
            
            <div className="p-xl pb-md border-b border-border bg-slate-50 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 text-primary opacity-5"><Users size={120} /></div>
              <div className="flex items-center gap-md relative z-10">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg border-4 border-white">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-secondary">{selectedCustomer.name}</h2>
                  <p className="text-sm text-slate-500 flex items-center gap-1"><Phone size={12} /> {selectedCustomer.phone || '-'}</p>
                </div>
              </div>
              
              <div className="mt-lg bg-white p-md rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center relative z-10">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Sisa Hutang</p>
                  <p className={`text-2xl font-black ${selectedCustomer.total_debt > 0 ? 'text-danger' : 'text-success'}`}>
                    Rp {Number(selectedCustomer.total_debt || 0).toLocaleString('id-ID')}
                  </p>
                </div>
                {selectedCustomer.phone && (
                  <button className="bg-green-100 text-green-600 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-green-200 transition-colors" onClick={() => window.open(`https://wa.me/${selectedCustomer.phone}?text=Halo%20${selectedCustomer.name},%20ini%20tagihan%20kasbon%20sebesar%20Rp%20${Number(selectedCustomer.total_debt).toLocaleString('id-ID')}`)}>
                    Tagih via WA
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-white p-lg flex flex-col items-center justify-center text-center">
              <History size={40} className="text-slate-200 mb-2" />
              <p className="text-slate-400">Daftar riwayat transaksi (Berikan Kasbon / Terima Cicilan) akan tampil di sini.</p>
            </div>

            <div className="p-lg bg-white border-t border-border flex gap-sm">
              <button className="flex-1 bg-red-50 text-red-600 font-bold py-3 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                <TrendingUp size={18} /> Beri Kasbon
              </button>
              <button className="flex-1 bg-green-50 text-green-600 font-bold py-3 rounded-xl hover:bg-green-100 transition-colors flex items-center justify-center gap-2">
                <TrendingDown size={18} /> Terima Bayar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
