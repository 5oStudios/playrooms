import React, { ReactNode } from 'react';

import '@iframe-resizer/child';
import { Toaster } from 'sonner';

import { Spinner } from '../components/spinner';
import { useAppSelector } from '../lib/hooks';
import { AuthGuard } from './AuthGuard';
import './global.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Kingo Platform',
  description: 'Play games with your friends!',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AuthGuard>
            <Toaster />
            {/*<UserInformation />*/}
            {children}
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
