import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lesson講座販売',
  description: '動画を販売するアプリです．',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ja'>
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
