'use client';

import React from 'react';

import { Spinner } from '../components/spinner';
import { useAppSelector } from '../lib/hooks';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const authStatus = useAppSelector((state) => state.user.status);

  if (authStatus === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
};
