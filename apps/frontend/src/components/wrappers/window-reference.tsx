import React from 'react';

export function WindowReference({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (typeof window === 'undefined') {
    return <>{children}</>;
  }
}
