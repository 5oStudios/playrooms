import { ReactNode } from 'react';

import '@iframe-resizer/child';
import { Toaster } from 'sonner';

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
          <Toaster />
          {/*<UserInformation />*/}
          {children}
        </Providers>
      </body>
    </html>
  );
}
