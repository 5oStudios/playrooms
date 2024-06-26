import React, { Suspense } from 'react';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ColorModeContextProvider } from '@contexts/color-mode';
import { authProvider } from '@providers/auth-provider';
import { dataProvider, liveProvider } from '@providers/data-provider';
import { DevtoolsProvider } from '@providers/devtools';
import { useNotificationProvider } from '@refinedev/antd';
import '@refinedev/antd/dist/reset.css';
import { Refine } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';
import routerProvider from '@refinedev/nextjs-router';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { BsFillCollectionFill } from 'react-icons/bs';
import { TbCategory2, TbFolderQuestion } from 'react-icons/tb';

export const metadata: Metadata = {
  title: 'Kingo Dashboard',
  description: 'Kingo Dashboard',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const theme = cookieStore.get('theme');
  const defaultMode = theme?.value === 'dark' ? 'dark' : 'light';

  return (
    <html lang="en">
      <body>
        <Suspense>
          <RefineKbarProvider>
            <AntdRegistry>
              <ColorModeContextProvider defaultMode={defaultMode}>
                <DevtoolsProvider>
                  <Refine
                    routerProvider={routerProvider}
                    dataProvider={dataProvider}
                    liveProvider={liveProvider}
                    authProvider={authProvider}
                    notificationProvider={useNotificationProvider}
                    resources={[
                      {
                        name: '65f8b827d094ee232455',
                        list: '/collections',
                        create: '/collections/create',
                        edit: '/collections/edit/:id',
                        show: '/collections/show/:id',
                        identifier: 'collection',
                        meta: {
                          canDelete: true,
                          label: 'Collections',
                          icon: <BsFillCollectionFill />,
                        },
                      },
                      {
                        name: '65f866e73151b891a190',
                        list: '/questions',
                        create: '/questions/create',
                        edit: '/questions/edit/:id',
                        show: '/questions/show/:id',
                        identifier: 'question',
                        meta: {
                          canDelete: true,
                          label: 'Questions',
                          icon: <TbFolderQuestion />,
                        },
                      },
                      {
                        name: '65f8244710c16e4e4322',
                        list: '/categories',
                        create: '/categories/create',
                        edit: '/categories/edit/:id',
                        show: '/categories/show/:id',
                        identifier: 'category',
                        meta: {
                          canDelete: true,
                          label: 'Categories',
                          icon: <TbCategory2 />,
                        },
                      },
                    ]}
                    options={{
                      syncWithLocation: true,
                      warnWhenUnsavedChanges: true,
                      useNewQueryKeys: true,
                      projectId: '65f8663d510e15258578',
                      liveMode: 'auto',
                    }}
                  >
                    {children}
                    <RefineKbar />
                  </Refine>
                </DevtoolsProvider>
              </ColorModeContextProvider>
            </AntdRegistry>
          </RefineKbarProvider>
        </Suspense>
      </body>
    </html>
  );
}
