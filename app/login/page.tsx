'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/');
      }
    });

    return () => unsub();
  }, [router]);

  const handleLogin = async () => {
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/');
    } catch (err) {
      setError('Email o password errati');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow w-full max-w-sm">

        <h1 className="text-2xl font-bold mb-6">
          Login Operatori
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-500 mb-3">{error}</p>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-3 rounded font-bold"
        >
          Accedi
        </button>

      </div>
    </div>
  );
}