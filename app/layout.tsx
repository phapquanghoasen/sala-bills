import './globals.css';

import { Roboto } from 'next/font/google';

import Layout from './components/Layout';

import type { Metadata } from 'next';

const roboto = Roboto({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'Sala',
  description: 'Nam Mô A Di Đà Phật',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={roboto.className}
    >
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
