import React from 'react';

import Image from 'next/image';
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';

import DrawerHeader from './drawerHeader';
import Login from './login';
import QueueBoard from './queueBoard';

type DrawerProps = {
  title: string;
  isOpen: boolean;
  toggleDrawer: () => void;
};

export default function BottomDrawer({
  title,
  isOpen,
  toggleDrawer,
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
        <div className="flex flex-col items-center">
          <div className="bg-slate-200 w-5/6 h-[1px] mt-2"></div>
          {title === 'Join Play' ? <Login /> : <QueueBoard />}
        </div>
      </Drawer>
    </>
  );
}
