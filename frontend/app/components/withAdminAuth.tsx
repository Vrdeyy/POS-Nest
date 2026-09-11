'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function withAdminAuth(Component: any) {
  return function ProtectedRoute(props: any) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const payloadBase64 = token.split('.')[1];
        const decoded = JSON.parse(atob(payloadBase64));

        if (decoded.role !== 'ADMIN') {
          // Kalau Kasir coba-coba masuk admin, lempar balik ke /kasir!
          alert('Akses Ditolak! Halaman ini khusus Admin.');
          router.push('/kasir');
        } else {
          setAuthorized(true);
        }
      } catch (err) {
        router.push('/login');
      }
    }, [router]);

    if (!authorized) {
      return (
        <div className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center font-mono text-xs">
          MEMVERIFIKASI OTORISASI...
        </div>
      );
    }

    return <Component {...props} />;
  };
}