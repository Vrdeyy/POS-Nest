'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import withAdminAuth from '@/app/components/withAdminAuth';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return router.push('/login');

      const res = await fetch('http://localhost:3000/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(data.data || data);
    } catch (err) {
      console.error('Gagal fetch produk:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          price: Number(price),
          stock: Number(stock),
        }),
      });

      if (!res.ok) throw new Error('Gagal menambah produk');

      setName('');
      setPrice('');
      setStock('');
      fetchProducts();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin mau hapus produk ini?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Gagal menghapus produk');
      fetchProducts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-stone-100 p-6 font-sans relative flex justify-center items-center">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="w-full max-w-7xl h-[90vh] bg-white border border-stone-200 rounded-2xl shadow-xl flex overflow-hidden z-10">
        
        {/* PANEL KIRI: FORM TAMBAH PRODUK */}
        <div className="w-[380px] bg-stone-900 text-stone-100 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-stone-800">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-stone-400 uppercase">
                ADMIN PANEL
              </span>
            </div>

            <h2 className="text-xl font-bold text-white mb-1">Tambah Produk</h2>
            <p className="text-xs text-stone-400 mb-6">Input produk baru ke sistem POS</p>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Nama Produk</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Kopi Susu"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Harga (Rp)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="18000"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-400 mb-1">Stok Awal</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="50"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition"
              >
                {loading ? 'SIMPAN...' : '+ SIMPAN PRODUK'}
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-stone-800 flex justify-between text-xs font-mono text-stone-500">
            <button onClick={() => router.push('/admin/users')} className="hover:text-white">
              &rarr; Kelola User
            </button>
            <button onClick={() => router.push('/kasir')} className="hover:text-white">
              Mode Kasir &rarr;
            </button>
          </div>
        </div>

        {/* PANEL KANAN: TABEL LIST PRODUK */}
        <div className="flex-1 p-8 bg-stone-50 flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200">
              <h1 className="text-2xl font-bold text-stone-900">Manajemen Inventaris & Stok</h1>
              <span className="text-xs font-mono bg-white border border-stone-200 px-3 py-1.5 rounded-lg font-bold">
                TOTAL: {products.length} ITEM
              </span>
            </div>

            <div className="max-h-[65vh] overflow-y-auto rounded-xl border border-stone-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-100 border-b border-stone-200 text-xs font-mono text-stone-600 uppercase">
                  <tr>
                    <th className="p-4">Nama Produk</th>
                    <th className="p-4">Harga</th>
                    <th className="p-4">Stok</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50 transition">
                      <td className="p-4 font-bold text-stone-900">{p.name}</td>
                      <td className="p-4 text-stone-600">Rp {p.price.toLocaleString('id-ID')}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold ${
                          p.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {p.stock} pcs
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold hover:bg-rose-100"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default withAdminAuth(AdminProductsPage);