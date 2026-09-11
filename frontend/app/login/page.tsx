"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login gagal, cek username/password");
      }

      const token = data.access_token || data.accessToken || data.token;

      if (!token) {
        throw new Error("Token tidak ditemukan dalam respon server");
      }

      localStorage.setItem("token", token);

      let role = "KASIR";
      try {
        const payloadBase64 = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        role = decodedPayload.role || "KASIR";
      } catch (decodeErr) {
        console.warn("Gagal decode JWT payload:", decodeErr);
      }

      if (role === "ADMIN") {
        router.push("/admin/products");
      } else {
        router.push("/kasir");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan pada sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-stone-100 p-4 font-sans relative overflow-hidden">
      {/* Background Grid Pattern biar gak polos */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Main Container - Split Layout */}
      <div className="w-full max-w-4xl bg-white border border-stone-200 rounded-2xl shadow-xl flex overflow-hidden z-10">
        {/* Kolom Kiri: Branding & Visual Banner */}
        <div className="hidden md:flex flex-1 bg-stone-900 p-10 flex-col justify-between text-stone-100 relative">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-mono tracking-widest uppercase text-stone-400">
              POS SYSTEM v1.0
            </span>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-3">
              Kelola Transaksi Kasir Lebih Cepat.
            </h2>
            <p className="text-stone-400 text-sm leading-relaxed">
              Sistem manajemen stok otomatis, *atomic checkout*, dan pencatatan
              riwayat transaksi real-time.
            </p>
          </div>

          <div className="pt-6 border-t border-stone-800 flex items-center justify-between text-xs text-stone-500 font-mono">
            <span>TERMINAL ACTIVE</span>
            <span>PORT 3000</span>
          </div>
        </div>

        {/* Kolom Kanan: Form Login */}
        <div className="flex-1 p-8 sm:p-10 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Selamat Datang
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Masukkan kredensial akun untuk melanjutkan
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-2">
              <span className="font-bold">!</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="misal: kasir1"
                required
                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white font-bold text-sm tracking-wide disabled:opacity-50 transition duration-150 shadow-md"
            >
              {loading ? "Memverifikasi..." : "Masuk Aplikasi"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
