import './global.css';
import { Toaster } from 'sonner';
import { BackgroundBeams } from '../components/ui/background-beams';
import Navbar from '../components/ui/navbar';
import { ReactNode } from 'react';
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
    <html lang="en" className="dark">
      <body className="relative">
        <Providers>
          <Toaster />
          <div className="flex-col justify-center items-center h-screen w-screen bg-primary-900">
            <BackgroundBeams>
              <Navbar />
              <div className="z-10">{children}</div>
            </BackgroundBeams>
          </div>
        </Providers>
      </body>
    </html>
  );
}
