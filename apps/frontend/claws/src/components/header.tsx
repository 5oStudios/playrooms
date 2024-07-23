import React from 'react';

import Image from 'next/image';

import eye from '../../public/assets/eye.svg';
import users from '../../public/assets/user.svg';

type HeaderProps = {
  viewers: number;
  waiting: number;
};

export default function Header({ viewers, waiting }: HeaderProps) {
  return (
    <div className="flex flex-col justify-end items-center w-full h-[117px] bg-primary">
      <div className="flex flex-col w-full h-full justify-end items-center">
        <div className="flex gap-6 mb-4">
          {/* viewers */}
          <div className="flex gap-2 text-white">
            <Image src={eye} alt={'viewers'} />
            <p>Viewers</p>
            <p>{'(' + viewers + ')'}</p>
          </div>
          {/* divider */}
          <div className="bg-gray-300/50 w-[1px] h-full" />
          {/* waiting */}
          <div className="flex gap-2 text-white">
            <Image src={users} alt={'waiting'} />
            <p>waiting</p>
            <p>{'(' + waiting + ')'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
