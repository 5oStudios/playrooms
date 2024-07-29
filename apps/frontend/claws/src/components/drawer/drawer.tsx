import React from 'react';

import Image from 'next/image';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';

import QueueBoard from '../../lib/features/rooms/components/queueBoard';
import DrawerHeader from './drawerHeader';
import Login from './login';

type DrawerProps = {
  title: string;
  isOpen: boolean;
  toggleDrawer: () => void;
  children?: React.ReactNode;
};

export default function BottomDrawer({
  title,
  isOpen,
  toggleDrawer,
  children,
}: DrawerProps) {
  const style = title === 'Queue Board' ? 'ml-[110px]' : '';
  return (
    <>
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction="bottom"
        style={{ height: '80%', borderRadius: '30px 30px 0 0' }}
      >
        <DrawerHeader
          title={title}
          toggleDrawer={toggleDrawer}
          className={style}
        />
        <div className="flex flex-col items-center">{children}</div>
      </Drawer>
    </>
  );
}
