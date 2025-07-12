import React from 'react';

import Link from 'next/link';

const SIDEBAR_HOME = 'Trang chủ';
const SIDEBAR_FOODS = 'Món ăn';
const SIDEBAR_BILLS = 'Hóa đơn';

// Header component
const Header = () => (
  <nav className="fixed top-0 left-0 right-0 z-10 flex px-4 py-2 bg-blue-50 border-b border-blue-200 h-16">
    <Link
      href="/"
      className="block px-4 py-2 rounded hover:bg-blue-100 font-medium"
    >
      {SIDEBAR_HOME}
    </Link>
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
  </nav>
);

// Layout component
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 pt-16 overflow-auto">{children}</main>
    </div>
  );
};

export default Layout;
