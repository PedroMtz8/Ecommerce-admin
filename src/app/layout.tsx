import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ModalProvider } from '../providers/modal-provider';
import { ToasterProvider } from '@/providers/toast-provider';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning={true}>
        <body className={inter.className}>
          <ModalProvider />
          <ToasterProvider />
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
