import './global.css';
import { BackgroundBeams } from '../components/ui/background-beams';
import Navbar from '../components/ui/navbar';
import React, { ReactNode } from 'react';
import { Providers } from './providers';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'Welcome to my game',
  description: 'A game that you can play with your friends',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-primary-900">
      <body className="relative">
        <Toaster />
        <Providers>
          {/*<Socket />*/}
          <Navbar />
          <div
            className="p-4 flex justify-center items-center h-[calc(100vh-64px)]"
            style={{ minHeight: 'calc(100vh - 64px)' }}
          >
            {children}
          </div>
          <BackgroundBeams />
        </Providers>
      </body>
    </html>
  );
}
