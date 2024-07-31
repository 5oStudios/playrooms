import React from 'react';

import Image from 'next/image';

type QueueCardProps = {
  id: number;
  images: string | undefined;
  name: string;
  points: number;
  isMyPlayer?: boolean;
};

export default function QueueCard({
  name,
  points,
  images,
  id,
  isMyPlayer,
}: QueueCardProps) {
  const nameInitials = name
    .split(' ')
    .map((n) => n[0])
    .join('');

  // if no image then create one with name initials
  const imageComponent = images ? (
    <Image
      src={images}
      alt="profile picture"
      className="rounded-full mr-3.5"
      width={54.65}
      height={54.65}
    />
  ) : (
    <div className="rounded-full mr-3.5 bg-slate-200 w-[54.65px] h-[54.65px] flex justify-center items-center">
      <p className="text-[16px] font-urbanist">{nameInitials}</p>
    </div>
  );

  return (
    <div className="flex flex-col w-full items-center p-4">
      <div className="flex justify-center items-center w-full mx-5">
        <div className="flex items-center  text-2xl font-bold w-[238.31px] flex-1">
          <p className="mr-3.5 text-[32px] font-urbanist w-[24.33px]">
            {id + 1}
          </p>
          {imageComponent}
          <p className="text-[16px] font-urbanist">
            {name} {isMyPlayer ? ' (You)' : ''}
          </p>
        </div>
        <p className="w-[139px] text-right text-[12.54px] font-urbanist">
          {points} Point
        </p>
      </div>
    </div>
  );
}
