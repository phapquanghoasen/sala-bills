'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '@/firebase/config';

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err) {
      const error = err as {
        code: string;
        message: string;
      };

      switch (error.code) {
        case 'auth/user-not-found':
          setError('Email không tồn tại. Vui lòng đăng ký tài khoản mới.');
          break;
        case 'auth/wrong-password':
          setError('Mật khẩu không chính xác. Vui lòng thử lại.');
          break;
        default:
          setError('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.');
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-4">Đăng nhập</h1>
      <form
        onSubmit={handleSignIn}
        className="bg-white p-6 rounded shadow w-full max-w-xs space-y-4"
      >
        {error && <div className="mb-2 text-red-600 text-sm font-medium">{error}</div>}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded p-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="username"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Mật khẩu</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded p-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
          disabled={loading}
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  );
};

export default SignInPage;
