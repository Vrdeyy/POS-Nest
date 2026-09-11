"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import withAdminAuth from "@/app/components/withAdminAuth";

interface User {
  id: string;
  username: string;
  role: string;
}

// PERBAIKAN: Hapus kata 'export default' di sini
function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("KASIR");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      const res = await fetch("http://localhost:3000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data.data || data);
    } catch (err) {
      console.error("Gagal fetch users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, password, role }),
      });

      if (!res.ok) throw new Error("Gagal menambah user");

      setUsername("");
      setPassword("");
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus user ini?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Gagal menghapus user");
      fetchUsers();
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
          backgroundSize: "24px 24px",
        }}
      />

      <div className="w-full max-w-7xl h-[90vh] bg-white border border-stone-200 rounded-2xl shadow-xl flex overflow-hidden z-10">
        {/* PANEL KIRI: FORM REGISTRASI USER */}
        <div className="w-[380px] bg-stone-900 text-stone-100 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-stone-800">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-stone-400 uppercase">
                USER MANAGEMENT
              </span>
            </div>

            <h2 className="text-xl font-bold text-white mb-1">Tambah Akun</h2>
            <p className="text-xs text-stone-400 mb-6">
              Buat akun Admin atau Kasir baru
            </p>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-400 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="kasir2"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-400 mb-1">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-stone-800 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="KASIR">KASIR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition"
              >
                {loading ? "SIMPAN..." : "+ REGISTRASI USER"}
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-stone-800 flex justify-between text-xs font-mono text-stone-500">
            <button
              onClick={() => router.push("/admin/products")}
              className="hover:text-white"
            >
              &larr; Kelola Produk
            </button>
          </div>
        </div>

        {/* PANEL KANAN: LIST USER */}
        <div className="flex-1 p-8 bg-stone-50 flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200">
              <h1 className="text-2xl font-bold text-stone-900">
                Daftar Pengguna Aplikasi
              </h1>
              <span className="text-xs font-mono bg-white border border-stone-200 px-3 py-1.5 rounded-lg font-bold">
                TOTAL: {users.length} USER
              </span>
            </div>

            <div className="max-h-[65vh] overflow-y-auto rounded-xl border border-stone-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-100 border-b border-stone-200 text-xs font-mono text-stone-600 uppercase">
                  <tr>
                    <th className="p-4">Username</th>
                    <th className="p-4">Role / Akses</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-stone-50 transition">
                      <td className="p-4 font-bold text-stone-900">
                        {u.username}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold ${
                            u.role === "ADMIN"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(u.id)}
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

// Cuma export default di sini
export default withAdminAuth(AdminUsersPage);
