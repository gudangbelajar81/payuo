import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import imageCompression from 'browser-image-compression';
import { 
  ShoppingBag, 
  ShoppingCart,
  LayoutDashboard, 
  Users, 
  Settings, 
  CreditCard,
  Search,
  Menu,
  Bell,
  Trash2,
  Plus,
  Minus,
  Package,
  Edit2,
  X,
  Image as ImageIcon
} from 'lucide-react';

// DUMMY DATA FOR MVP
const DUMMY_PRODUCTS = [];

function App() {
  const [activeTab, setActiveTab] = useState('kasir');
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Products on Load
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
    setIsLoading(false);
  };

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Minuman',
    price: '',
    imagePreview: '',
    file: null
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, imagePreview: reader.result, file: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    let imageUrl = null;

    try {
      if (!supabase) {
        throw new Error("Kunci Supabase belum terpasang atau Vercel belum di-Redeploy! Silakan ke Dashboard Vercel > Deployments > Redeploy.");
      }

      if (newProduct.file) {
        // 1. Kompres Gambar Otomatis (Target: di bawah 100KB)
        const options = {
          maxSizeMB: 0.1, // Maksimal 100 KB
          maxWidthOrHeight: 800, // Maksimal lebar/tinggi 800px (Sangat cukup untuk HP)
          useWebWorker: true,
          initialQuality: 0.8
        };
        const compressedFile = await imageCompression(newProduct.file, options);
        
        // 2. Upload gambar yang sudah dikompres
        const fileExt = compressedFile.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, compressedFile);
          
        if (uploadError) throw uploadError;
        
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrlData.publicUrl;
      }

      const { data: insertedProduct, error } = await supabase
        .from('products')
        .insert([{
          name: newProduct.name,
          category: newProduct.category,
          price: Number(newProduct.price),
          image_url: imageUrl
        }])
        .select();
        
      if (error) throw error;
      
      if (insertedProduct) {
        setProducts([insertedProduct[0], ...products]);
      }
      
      setNewProduct({ name: '', category: 'Minuman', price: '', imagePreview: '', file: null });
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Gagal menyimpan produk: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Yakin ingin menghapus produk ini?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting:', err);
      alert('Gagal menghapus produk');
    }
  };

  // Cart Logic
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container md:pb-0" style={{ paddingBottom: '70px' }}>
      {/* SIDEBAR (Desktop Minimalist Lux) */}
      <aside className="sidebar hidden md:flex shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="mb-xl flex flex-col items-center justify-center">
          <div className="w-14 h-14 flex-shrink-0 animate-fade-in flex items-center justify-center mb-2">
            <img src="/payuo_logo.png" alt="PayuO Logo" className="w-full h-full object-contain drop-shadow-md rounded-full border-2 border-surface-hover" />
          </div>
        </div>
        
        <nav className="flex flex-col gap-lg w-full px-sm flex-1 mt-md">
          <div className="relative group w-full flex justify-center">
            <button 
              className="flex flex-col items-center justify-center gap-2 w-full"
              onClick={() => setActiveTab('kasir')}
              title="Kasir Utama"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 transform group-hover:-translate-y-2 group-hover:rotate-12 ${activeTab === 'kasir' ? 'bg-gradient-to-br from-primary to-[#2DD4BF] text-white shadow-[0_10px_25px_rgba(13,148,136,0.6)] animate-float border-t border-white/40' : 'bg-slate-50 text-slate-400 shadow-inner group-hover:shadow-[0_8px_15px_rgba(0,0,0,0.05)] border border-slate-100'}`}>
                <span className="text-2xl filter drop-shadow-sm group-hover:scale-110 transition-transform">🛒</span>
              </div>
              <span style={{ fontSize: '11px' }} className={`font-bold tracking-wide transition-colors ${activeTab === 'kasir' ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>Kasir</span>
            </button>
          </div>
          
          <div className="relative group w-full flex justify-center">
            <button 
              className="flex flex-col items-center justify-center gap-2 w-full"
              onClick={() => setActiveTab('kasbon')}
              title="Buku Kasbon"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 transform group-hover:-translate-y-2 group-hover:-rotate-12 ${activeTab === 'kasbon' ? 'bg-gradient-to-br from-primary to-[#2DD4BF] text-white shadow-[0_10px_25px_rgba(13,148,136,0.6)] animate-float border-t border-white/40' : 'bg-slate-50 text-slate-400 shadow-inner group-hover:shadow-[0_8px_15px_rgba(0,0,0,0.05)] border border-slate-100'}`}>
                <span className="text-2xl filter drop-shadow-sm group-hover:scale-110 transition-transform">💸</span>
              </div>
              <span style={{ fontSize: '11px' }} className={`font-bold tracking-wide transition-colors ${activeTab === 'kasbon' ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>Kasbon</span>
            </button>
          </div>
          
          <div className="relative group w-full flex justify-center">
            <button 
              className="flex flex-col items-center justify-center gap-2 w-full"
              onClick={() => setActiveTab('produk')}
              title="Kelola Produk"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 transform group-hover:-translate-y-2 group-hover:rotate-12 ${activeTab === 'produk' ? 'bg-gradient-to-br from-primary to-[#2DD4BF] text-white shadow-[0_10px_25px_rgba(13,148,136,0.6)] animate-float border-t border-white/40' : 'bg-slate-50 text-slate-400 shadow-inner group-hover:shadow-[0_8px_15px_rgba(0,0,0,0.05)] border border-slate-100'}`}>
                <span className="text-2xl filter drop-shadow-sm group-hover:scale-110 transition-transform">📦</span>
              </div>
              <span style={{ fontSize: '11px' }} className={`font-bold tracking-wide transition-colors ${activeTab === 'produk' ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>Produk</span>
            </button>
          </div>
          
          <div className="relative group w-full flex justify-center">
            <button 
              className="flex flex-col items-center justify-center gap-2 w-full"
              title="Laporan"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 transform group-hover:-translate-y-2 group-hover:-rotate-12 bg-slate-50 text-slate-400 shadow-inner group-hover:shadow-[0_8px_15px_rgba(0,0,0,0.05)] border border-slate-100`}>
                <span className="text-2xl filter drop-shadow-sm group-hover:scale-110 transition-transform">📈</span>
              </div>
              <span style={{ fontSize: '11px' }} className="font-bold tracking-wide text-slate-400 group-hover:text-primary transition-colors">Laporan</span>
            </button>
          </div>

          <div className="relative group w-full flex justify-center mt-auto mb-lg">
            <button 
              className="flex flex-col items-center justify-center gap-2 w-full"
              title="Pengaturan"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 transform group-hover:-translate-y-2 bg-slate-50 text-slate-400 shadow-inner group-hover:shadow-[0_8px_15px_rgba(0,0,0,0.05)] border border-slate-100`}>
                <span className="text-2xl filter drop-shadow-sm group-hover:animate-spin transition-transform" style={{ display: 'inline-block' }}>⚙️</span>
              </div>
              <span style={{ fontSize: '11px' }} className="font-bold tracking-wide text-slate-400 group-hover:text-primary transition-colors">Setting</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="flex items-center gap-md">
            <button className="btn-icon lg:hidden">
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-semibold">
              {activeTab === 'kasir' ? 'Kasir Utama' 
                : activeTab === 'kasbon' ? 'Buku Kasbon' 
                : 'Kelola Produk'}
            </h2>
          </div>
          
          <div className="flex items-center gap-md">
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
              <input 
                type="text" 
                placeholder="Cari produk..." 
                className="pl-11 pr-4 py-2.5 w-72 bg-slate-50 border-transparent rounded-full shadow-inner focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-transparent transition-all outline-none text-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
              <Bell size={20} strokeWidth={1.5} />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-[#2DD4BF] shadow-md flex items-center justify-center font-bold text-white border-2 border-white ring-2 ring-slate-50">
              A
            </div>
          </div>
        </header>

        {/* POS WORKSPACE */}
        {activeTab === 'kasir' && (
          <div className="pos-area animate-fade-in">
            {/* PRODUCT GRID */}
            <div className="product-grid-area">
              {isLoading ? (
                <div className="flex justify-center items-center h-full text-secondary-light">Memuat produk...</div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-full text-secondary-light gap-2">
                   <Package size={48} opacity={0.3} />
                   <p>Belum ada produk. Tambahkan di menu Kelola Produk.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
                  {filteredProducts.map(product => (
                    <div 
                      key={product.id} 
                      className="card p-md cursor-pointer flex flex-col items-center justify-center text-center h-40 gap-sm"
                      onClick={() => addToCart(product)}
                    >
                      <div className="w-16 h-16 bg-surface-hover rounded-md overflow-hidden flex items-center justify-center text-3xl">
                         {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" /> : '📦'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                        <p className="text-primary font-bold text-sm">Rp {product.price.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CART SIDEBAR (Desktop / Mobile Modal) */}
            <div className={`cart-area flex flex-col bg-surface transition-fast ${isMobileCartOpen ? 'fixed inset-0 z-50 w-full h-full' : 'hidden lg:flex'}`}>
              <div className="p-md border-b flex justify-between items-center bg-white shadow-sm">
                <h3 className="font-bold text-lg flex items-center gap-sm">
                  <ShoppingBag size={20} className="text-primary" /> Pesanan Saat Ini
                </h3>
                <div className="flex items-center gap-md">
                  <span className="badge badge-primary">{cart.length} Item</span>
                  {isMobileCartOpen && (
                    <button className="lg:hidden btn-icon" onClick={() => setIsMobileCartOpen(false)}>
                      <X size={24} />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-sm">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-secondary-light gap-sm">
                    <ShoppingBag size={48} opacity={0.2} />
                    <p>Keranjang masih kosong</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-sm">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-sm bg-surface-hover rounded-md">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm truncate pr-2">{item.name}</h4>
                          <p className="text-primary text-xs font-bold">Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-full bg-white border flex items-center justify-center text-secondary shadow-sm hover:bg-gray-50">
                            <Minus size={14} />
                          </button>
                          <span className="font-semibold w-4 text-center text-sm">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-sm hover:bg-primary-hover">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-md border-t bg-surface mt-auto">
                <div className="flex justify-between items-center mb-md">
                  <span className="text-secondary font-medium">Total Harga</span>
                  <span className="text-2xl font-bold text-primary">Rp {totalAmount.toLocaleString('id-ID')}</span>
                </div>
                
                <div className="flex gap-sm">
                  <button onClick={clearCart} className="btn btn-secondary w-12" title="Hapus Semua">
                    <Trash2 size={20} className="text-danger" />
                  </button>
                  <button className="btn btn-primary flex-1 py-lg text-lg font-bold" disabled={cart.length === 0}>
                    <CreditCard size={20} /> Bayar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BUKU KASBON */}
        {activeTab === 'kasbon' && (
          <div className="flex-1 p-lg bg-background overflow-y-auto animate-fade-in">
             <div className="card p-xl flex flex-col items-center justify-center text-center h-64 gap-md">
                <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-primary">
                  <Users size={32} />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-sm">Buku Kasbon & Utang</h2>
                  <p className="text-secondary max-w-md mx-auto">Fitur untuk mencatat pelanggan yang ngutang atau kasbon. Segera hadir mengadopsi fitur terbaik dari BukuWarung!</p>
                </div>
                <button className="btn btn-primary mt-sm">Tambah Catatan Kasbon (Segera)</button>
             </div>
          </div>
        )}
        
        {/* KELOLA PRODUK */}
        {activeTab === 'produk' && (
          <div className="flex-1 p-lg bg-background overflow-y-auto animate-fade-in relative">
             <div className="flex justify-between items-center mb-md">
                <h2 className="text-xl font-bold text-secondary">Daftar Produk</h2>
                <button 
                  className="flex items-center gap-2 bg-gradient-to-br from-primary to-[#2DD4BF] text-white px-6 py-3 rounded-full font-bold shadow-md hover:shadow-glow transition-all duration-300 transform hover:-translate-y-0.5" 
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <Plus size={18} strokeWidth={2.5} /> Tambah Produk
                </button>
             </div>
             
             <div className="card overflow-hidden">
               <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
                 <thead>
                   <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400">
                     <th className="p-md font-bold text-xs uppercase tracking-widest">Gambar</th>
                     <th className="p-md font-bold text-xs uppercase tracking-widest">Nama Produk</th>
                     <th className="p-md font-bold text-xs uppercase tracking-widest">Kategori</th>
                     <th className="p-md font-bold text-xs uppercase tracking-widest">Harga</th>
                     <th className="p-md font-bold text-xs uppercase tracking-widest text-center">Aksi</th>
                   </tr>
                 </thead>
                 <tbody>
                   {isLoading ? (
                     <tr><td colSpan="5" className="p-md text-center text-secondary-light">Memuat produk...</td></tr>
                   ) : products.length === 0 ? (
                     <tr><td colSpan="5" className="p-md text-center text-secondary-light">Belum ada produk.</td></tr>
                   ) : products.map(product => (
                     <tr key={product.id} className="border-b border-border hover:bg-surface-hover transition-fast">
                       <td className="p-md">
                         <div className="w-14 h-14 rounded-2xl bg-slate-50 overflow-hidden flex items-center justify-center text-2xl border border-slate-100 shadow-sm">
                           {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" /> : '📦'}
                         </div>
                       </td>
                       <td className="p-md font-medium">{product.name}</td>
                       <td className="p-md">
                         <span className="badge badge-primary">{product.category}</span>
                       </td>
                       <td className="p-md font-bold text-primary">
                         Rp {product.price.toLocaleString('id-ID')}
                       </td>
                       <td className="p-md text-center">
                         <div className="flex items-center justify-center gap-sm">
                           <button className="btn-icon text-danger hover:bg-red-50" title="Hapus" onClick={() => handleDeleteProduct(product.id)}>
                             <Trash2 size={16} />
                           </button>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}
        {/* ADD PRODUCT MODAL */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in" style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="card w-full max-w-md p-lg m-md bg-white relative" style={{ maxHeight: '95vh', overflowY: 'auto' }}>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 btn-icon"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-xl font-bold mb-md">Tambah Produk Baru</h2>
              
              <form onSubmit={handleSaveProduct} className="flex flex-col gap-md">
                {/* Image Upload Area */}
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-md cursor-pointer hover:bg-surface-hover transition-fast" onClick={() => document.getElementById('imageUpload').click()}>
                  {newProduct.imagePreview ? (
                    <img src={newProduct.imagePreview} alt="Preview" style={{ height: '120px', width: '100%', objectFit: 'contain' }} className="rounded-md" />
                  ) : (
                    <div className="flex flex-col items-center gap-sm text-secondary-light p-md">
                      <ImageIcon size={32} />
                      <span className="text-sm">Klik untuk upload foto (Max 150KB)</span>
                    </div>
                  )}
                  <input type="file" id="imageUpload" accept="image/*" className="hidden" onChange={handleImageChange} />
                </div>

                <div className="input-group">
                  <label className="input-label">Nama Produk</label>
                  <input type="text" className="input" placeholder="Misal: Kopi Susu Aren" required 
                    value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-sm">
                  <div className="input-group">
                    <label className="input-label">Kategori</label>
                    <select className="input bg-white" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                      <option>Minuman</option>
                      <option>Makanan</option>
                      <option>Cemilan</option>
                      <option>Sembako</option>
                      <option>Lainnya</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Harga (Rp)</label>
                    <input type="number" className="input" placeholder="0" required min="0"
                      value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                  </div>
                </div>

                <button type="submit" disabled={isSaving} className="btn btn-primary w-full mt-sm py-md text-lg flex justify-center items-center gap-2">
                  {isSaving ? 'Menyimpan...' : 'Simpan Produk'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MOBILE FLOATING CART */}
        {cart.length > 0 && activeTab === 'kasir' && !isMobileCartOpen && (
          <div className="lg:hidden fixed left-4 right-4 bg-primary text-white p-md rounded-lg shadow-lg flex justify-between items-center cursor-pointer animate-fade-in z-40"
               style={{ bottom: '85px' }}
               onClick={() => setIsMobileCartOpen(true)}>
            <div className="flex items-center gap-sm font-semibold">
              <ShoppingBag size={20} />
              <span>{cart.length} Item di Keranjang</span>
            </div>
            <div className="font-bold text-lg">
              Rp {totalAmount.toLocaleString('id-ID')}
            </div>
          </div>
        )}

        {/* MOBILE BOTTOM NAVIGATION */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border flex justify-around items-center p-xs z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
           <button onClick={() => setActiveTab('kasir')} className={`flex flex-col items-center gap-1 p-sm rounded-xl flex-1 transition-fast ${activeTab==='kasir' ? 'text-primary bg-primary-light/30' : 'text-secondary-light'}`}>
             <ShoppingBag size={22} />
             <span style={{ fontSize: '11px' }} className="font-semibold">Kasir</span>
           </button>
           <button onClick={() => setActiveTab('kasbon')} className={`flex flex-col items-center gap-1 p-sm rounded-xl flex-1 transition-fast ${activeTab==='kasbon' ? 'text-primary bg-primary-light/30' : 'text-secondary-light'}`}>
             <Users size={22} />
             <span style={{ fontSize: '11px' }} className="font-semibold">Kasbon</span>
           </button>
           <button onClick={() => setActiveTab('produk')} className={`flex flex-col items-center gap-1 p-sm rounded-xl flex-1 transition-fast ${activeTab==='produk' ? 'text-primary bg-primary-light/30' : 'text-secondary-light'}`}>
             <Package size={22} />
             <span style={{ fontSize: '11px' }} className="font-semibold">Produk</span>
           </button>
        </nav>
      </main>
    </div>
  );
}

export default App;
