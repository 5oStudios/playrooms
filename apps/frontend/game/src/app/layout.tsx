import { ReactNode } from 'react';

import { Toaster } from 'sonner';

import { DotBackground } from '../components/dot-background';
import Navbar from '../components/ui/navbar';
import './global.css';
import { Providers } from './providers';

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
    <html lang="en" className="dark dark:bg-black">
      <body className="relative">
        <Toaster />
        <Providers>
          {/*<Socket />*/}

          <Navbar />
          <DotBackground>
            <div
              className="p-4 flex justify-center items-center h-[calc(100vh-64px)]"
              // style={{ minHeight: 'calc(100vh - 64px)' }}
            >
              {children}
            </div>
          </DotBackground>
        </Providers>
      </body>
    </html>
  );
}
