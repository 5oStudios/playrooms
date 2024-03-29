'use client';

import React from 'react';

import { Header } from '@components/header';
import { ThemedLayoutV2 } from '@refinedev/antd';
import { Typography } from 'antd';
import Link from 'next/link';
import { SiNintendogamecube } from 'react-icons/si';

export const ThemedLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <ThemedLayoutV2
      Title={() => (
        <Link
          style={{
            display: 'flex',
            gap: '8px',
          }}
          href={'/'}
        >
          <SiNintendogamecube size={24} />
          <Typography
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Kingo Dashboard
          </Typography>
        </Link>
      )}
      Header={() => <Header sticky />}
    >
      {children}
    </ThemedLayoutV2>
  );
};
