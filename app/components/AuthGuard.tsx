'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isLogin = pathname === '/login';

    if (!user && !isLogin) {
      router.replace('/login');
    }

    if (user && isLogin) {
      router.replace('/');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Caricamento...
      </div>
    );
  }

  // 🔥 QUESTO È IL FIX IMPORTANTE
  if (!user && pathname !== '/login') {
    return null;
  }

  return <>{children}</>;
}