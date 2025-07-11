import React from 'react';
import Link from 'next/link';

const SIDEBAR_BRAND = 'Sala Food';
const SIDEBAR_HOME = 'Trang chủ';
const SIDEBAR_FOODS = 'Món ăn';
const SIDEBAR_BILLS = 'Hóa đơn';
const SIDEBAR_COPYRIGHT = '© 2025 Sala Food';

const HEADER_TITLE = 'Dashboard';

// Sidebar component
const Sidebar = () => (
  <aside className="w-64 bg-white shadow-lg flex flex-col">
    <div className="h-16 flex items-center justify-center font-bold text-xl border-b">{SIDEBAR_BRAND}</div>
    <nav className="flex-1 px-4 py-6 space-y-2">
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
    <div className="p-4 text-xs text-gray-400 border-t">{SIDEBAR_COPYRIGHT}</div>
  </aside>
);

// Header component
const Header = () => (
  <header className="h-16 bg-white shadow flex items-center px-8">
    <span className="font-semibold text-lg">{HEADER_TITLE}</span>
  </header>
);

// PageContent component
const PageContent = ({ children }: { children: React.ReactNode }) => <main className="flex-1 p-8">{children}</main>;

// MainContent component
const MainContent = ({ children }: { children: React.ReactNode }) => (
  <div className="flex-1 flex flex-col">
    <Header />
    <PageContent>{children}</PageContent>
  </div>
);

// Layout component
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <MainContent>{children}</MainContent>
    </div>
  );
};

export default Layout;
