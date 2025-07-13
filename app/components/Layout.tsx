'use client';

import React, { useState, useEffect } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { signOut } from 'firebase/auth';

import { useUser } from '@/contexts/UserContext';
import { auth } from '@/firebase/config';

const SIDEBAR_HOME = 'Trang chủ';
const SIDEBAR_FOODS = 'Món ăn';
const SIDEBAR_BILLS = 'Hóa đơn';

// Header component
const Header = () => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut(auth);
    setOpen(false);
  };

  // Đóng menu khi chuyển trang
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Helper để xác định link đang active
  const isActive = (href: string) => pathname === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-blue-50 border-b border-blue-200">
      {/* Hamburger button for mobile */}
      <div className="flex items-center justify-between px-2 sm:px-4 py-2 sm:hidden">
        <span className="font-bold text-blue-700">{SIDEBAR_HOME}</span>
        <button
          className="p-2 rounded hover:bg-blue-100"
          onClick={() => setOpen(!open)}
          aria-label="Mở menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>
      {/* Nav links */}
      <div
        className={`
          flex-col gap-1 px-2 pb-2 sm:pb-0 sm:px-4 sm:flex-row sm:items-center sm:justify-between sm:flex
          ${open ? 'flex' : 'hidden'} sm:flex
        `}
      >
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-0">
          <Link
            href="/"
            className={`block px-4 py-2 sm:px-8 sm:py-4 rounded hover:bg-blue-100 font-medium ${
              isActive('/') ? 'bg-blue-200 text-blue-800' : ''
            }`}
          >
            {SIDEBAR_HOME}
          </Link>
          {user && (
            <>
              <Link
                href="/foods"
                className={`block px-4 py-2 sm:px-8 sm:py-4 rounded hover:bg-blue-100 font-medium ${
                  isActive('/foods') ? 'bg-blue-200 text-blue-800' : ''
                }`}
              >
                {SIDEBAR_FOODS}
              </Link>
              <Link
                href="/bills"
                className={`block px-4 py-2 sm:px-8 sm:py-4 rounded hover:bg-blue-100 font-medium ${
                  isActive('/bills') ? 'bg-blue-200 text-blue-800' : ''
                }`}
              >
                {SIDEBAR_BILLS}
              </Link>
            </>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link
                  href="/settings"
                  className={`block px-4 py-2 rounded hover:bg-blue-100 font-medium ${
                    isActive('/settings') ? 'bg-blue-200 text-blue-800' : ''
                  }`}
                >
                  Cài đặt
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="block px-4 py-2 rounded hover:bg-blue-100 font-medium text-left"
                style={{
                  appearance: 'none',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
                type="button"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                href="/sign-up"
                className={`block px-4 py-2 rounded hover:bg-blue-100 font-medium ${
                  isActive('/sign-up') ? 'bg-blue-200 text-blue-800' : ''
                }`}
              >
                Đăng ký
              </Link>
              <Link
                href="/sign-in"
                className={`block px-4 py-2 rounded hover:bg-blue-100 font-medium ${
                  isActive('/sign-in') ? 'bg-blue-200 text-blue-800' : ''
                }`}
              >
                Đăng nhập
              </Link>
            </>
          )}
        </div>
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
