'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

export default function KasirPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch Daftar Produk
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return router.push('/login');

      const res = await fetch('http://localhost:3000/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      setProducts(result.data || result);
    } catch (err) {
      console.error('Gagal mengambil data produk:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Tambah Produk ke Cart
  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert('Jumlah belanjaan mencapai batas stok!');
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Adjust Quantity Item
  const updateQuantity = (id: string, qty: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const product = products.find((p) => p.id === id);
            if (product && qty > product.stock) {
              alert('Jumlah belanjaan melebihi stok tersedia!');
              return item;
            }
            return { ...item, quantity: qty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Submit Checkout (POST /transactions)
  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      const res = await fetch('http://localhost:3000/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || 'Checkout gagal');
      }

      alert('Transaksi Berhasil Diproses!');
      setCart([]);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-stone-100 p-4 font-sans relative flex justify-center items-center overflow-hidden">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Container Utama POS */}
      <div className="w-full max-w-7xl h-[90vh] bg-white border border-stone-200 rounded-2xl shadow-xl flex overflow-hidden z-10">
        
        {/* PANEL KIRI: KATALOG PRODUK */}
        <div className="flex-1 flex flex-col p-8 bg-stone-50 border-r border-stone-200 justify-between">
          <div>
            {/* Header POS */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs font-mono tracking-widest text-stone-500 uppercase">
                    POS TERMINAL
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Katalog Produk</h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 bg-white text-xs font-bold hover:bg-stone-200 transition shadow-sm"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Input Pencarian */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Cari nama produk cepat..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition shadow-sm"
              />
            </div>

            {/* Grid Daftar Produk */}
            <div className="max-h-[58vh] overflow-y-auto pr-1 grid grid-cols-2 md:grid-cols-3 gap-4 align-content-start">
              {filteredProducts.map((product) => {
                const isOutOfStock = product.stock <= 0;
                return (
                  <div
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className={`p-5 rounded-xl border transition shadow-sm flex flex-col justify-between ${
                      isOutOfStock
                        ? 'bg-stone-100 opacity-60 cursor-not-allowed border-stone-200'
                        : 'bg-white border-stone-200 hover:border-stone-900 cursor-pointer'
                    }`}
                  >
                    <div>
                      <h3 className="font-bold text-stone-900 text-base">{product.name}</h3>
                      <p className="text-sm font-semibold text-stone-500 mt-1">
                        Rp {product.price.toLocaleString('id-ID')}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span
                        className={`text-[11px] font-mono px-2.5 py-1 rounded-md font-bold ${
                          isOutOfStock
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-stone-100 text-stone-800 border border-stone-200'
                        }`}
                      >
                        {isOutOfStock ? 'STOK HABIS' : `STOK: ${product.stock}`}
                      </span>
                      {!isOutOfStock && (
                        <span className="text-xs font-bold text-emerald-600">+ Tambah</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-between items-center text-xs font-mono text-stone-400">
            <span>KASIR MODE</span>
            <span>SYSTEM ONLINE</span>
          </div>
        </div>

        {/* PANEL KANAN: KERANJANG & CHECKOUT */}
        <div className="w-[400px] bg-stone-900 text-stone-100 flex flex-col justify-between p-8 relative">
          <div className="flex flex-col h-full overflow-hidden">
            
            {/* Header Cart */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
              <h2 className="text-lg font-bold text-white tracking-tight">Keranjang Belanja</h2>
              <span className="text-xs font-mono bg-stone-800 border border-stone-700 text-stone-300 px-2.5 py-1 rounded-md">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} ITEMS
              </span>
            </div>

            {/* List Cart Items */}
            <div className="flex-1 overflow-y-auto py-2 flex flex-col gap-3 pr-1">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-stone-500">
                  <p className="text-sm">Keranjang Kosong</p>
                  <p className="text-xs mt-1 text-stone-600">Klik item untuk menambahkan</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-stone-800 border border-stone-700/80"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-semibold text-sm text-white truncate">{item.name}</p>
                      <p className="text-xs text-stone-400 mt-0.5">
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-stone-900 border border-stone-700 rounded-lg px-1.5 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center text-stone-300 hover:bg-stone-800 rounded font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="text-xs font-mono font-bold px-1 text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center text-stone-300 hover:bg-stone-800 rounded font-bold text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer Total & Button Checkout */}
          <div className="pt-6 border-t border-stone-800 mt-4">
            <div className="flex justify-between items-baseline mb-5">
              <span className="text-xs font-mono uppercase tracking-widest text-stone-400">
                TOTAL BAYAR
              </span>
              <span className="text-2xl font-black text-white">
                Rp {total.toLocaleString('id-ID')}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || cart.length === 0}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-stone-950 font-bold text-sm uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed transition duration-150 shadow-lg"
            >
              {loading ? 'MEMPROSES...' : 'CHECKOUT TRANSAKSI'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}