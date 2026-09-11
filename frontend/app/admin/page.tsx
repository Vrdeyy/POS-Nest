'use client';

import { useRouter } from 'next/navigation';
import withAdminAuth from '../components/withAdminAuth';

function AdminDashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen w-full bg-stone-100 p-6 font-sans relative flex justify-center items-center overflow-hidden">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Main Card */}
      <div className="w-full max-w-4xl bg-white border border-stone-200 rounded-2xl shadow-xl flex flex-col overflow-hidden z-10">
        {/* Header */}
        <div className="bg-stone-900 text-stone-100 p-8 flex items-center justify-between border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-stone-400 uppercase">
                ADMIN CONSOLE
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-stone-800 border border-stone-700 text-stone-300 text-xs font-mono font-bold hover:bg-stone-700 hover:text-white transition"
          >
            LOGOUT
          </button>
        </div>

        {/* Content Navigation */}
        <div className="p-8 bg-stone-50 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Produk */}
          <div
            onClick={() => router.push('/admin/products')}
            className="p-6 bg-white border border-stone-200 rounded-xl shadow-sm hover:border-stone-900 cursor-pointer transition flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center font-mono font-bold text-stone-900 mb-4 group-hover:bg-stone-900 group-hover:text-white transition">
                01
              </div>
              <h2 className="text-lg font-bold text-stone-900 mb-1">Manajemen Produk</h2>
              <p className="text-xs text-stone-500">
                Kelola inventaris toko, ubah harga, stok awal, dan hapus item produk.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-mono text-stone-900 font-bold">
              <span>Buka Inventaris</span>
              <span>&rarr;</span>
            </div>
          </div>

          {/* Card User */}
          <div
            onClick={() => router.push('/admin/users')}
            className="p-6 bg-white border border-stone-200 rounded-xl shadow-sm hover:border-stone-900 cursor-pointer transition flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center font-mono font-bold text-stone-900 mb-4 group-hover:bg-stone-900 group-hover:text-white transition">
                02
              </div>
              <h2 className="text-lg font-bold text-stone-900 mb-1">Manajemen User</h2>
              <p className="text-xs text-stone-500">
                Registrasi akun Kasir atau Admin baru serta kelola hak akses pengguna.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-mono text-stone-900 font-bold">
              <span>Kelola Pengguna</span>
              <span>&rarr;</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-white border-t border-stone-200 flex justify-between items-center text-xs font-mono text-stone-400">
          <span>ROLE: ADMIN</span>
          <button
            onClick={() => router.push('/kasir')}
            className="text-stone-700 hover:text-stone-900 font-bold"
          >
            Masuk Mode Kasir &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

export default withAdminAuth(AdminDashboardPage);