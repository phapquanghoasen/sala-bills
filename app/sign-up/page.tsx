'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

import { useUser } from '@/contexts/UserContext';
import { auth, db } from '@/firebase/config';

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  // Chỉ cho phép admin đăng ký user mới
  if (user === null) {
    return <div>Đang kiểm tra quyền truy cập...</div>;
  }
  if (user.role !== 'admin') {
    return <div>Bạn không có quyền truy cập trang này.</div>;
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        role: 'user',
        createdAt: serverTimestamp(),
      });
      await signOut(auth);
      router.push('/sign-in');
    } catch (err) {
      const error = err as {
        code: string;
        message: string;
      };

      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('Email đã được sử dụng. Vui lòng chọn email khác.');
          break;
        case 'auth/invalid-email':
          setError('Email không hợp lệ. Vui lòng nhập email đúng định dạng.');
          break;
        case 'auth/weak-password':
          setError('Mật khẩu quá yếu. Vui lòng nhập mật khẩu mạnh hơn.');
          break;
        default:
          setError('Đăng ký không thành công. Vui lòng thử lại sau.');
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-4">Đăng ký</h1>
      <form
        onSubmit={handleSignUp}
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
            autoComplete="new-password"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
          disabled={loading}
        >
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
