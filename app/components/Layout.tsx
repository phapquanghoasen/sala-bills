'use client';

import React from 'react';

import Link from 'next/link';

import { signOut } from 'firebase/auth';

import { useUser } from '@/contexts/UserContext';
import { auth } from '@/firebase/config';

const SIDEBAR_HOME = 'Trang chủ';
const SIDEBAR_FOODS = 'Món ăn';
const SIDEBAR_BILLS = 'Hóa đơn';

// Header component
const Header = () => {
  const { user } = useUser();

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 bg-blue-50 border-b border-blue-200 h-16">
      <div className="flex">
        <Link
          href="/"
          className="block px-4 py-2 rounded hover:bg-blue-100 font-medium"
        >
          {SIDEBAR_HOME}
        </Link>
        {user && (
          <>
            <Link
              href="/foods"
              className="block px-4 py-2 rounded hover:bg-blue-100 font-medium"
            >
              {SIDEBAR_FOODS}
            </Link>
            <Link
              href="/bills"
              className="block px-4 py-2 rounded hover:bg-blue-100 font-medium"
            >
              {SIDEBAR_BILLS}
            </Link>
          </>
        )}
      </div>
      <div className="flex gap-2">
        {user ? (
          <button
            onClick={handleSignOut}
            className="block px-4 py-2 rounded hover:bg-blue-100 font-medium"
          >
            Đăng xuất
          </button>
        ) : (
          <>
            <Link
              href="/sign-up"
              className="block px-4 py-2 rounded hover:bg-blue-100 font-medium"
            >
              Đăng ký
            </Link>
            <Link
              href="/sign-in"
              className="block px-4 py-2 rounded hover:bg-blue-100 font-medium"
            >
              Đăng nhập
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 pt-16 overflow-auto">{children}</main>
    </div>
  );
};

export default Layout;
