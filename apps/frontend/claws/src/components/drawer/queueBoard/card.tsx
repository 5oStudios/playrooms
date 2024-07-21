import React from 'react';

import Image from 'next/image';

type QueueCardProps = {
  id: number;
  images: string;
  name: string;
  points: number;
};

export default function QueueCard({
  id,
  images,
  name,
  points,
}: QueueCardProps) {
  return (
    <div className="flex flex-col">
      <div className="flex">
        <div className="text-2xl font-bold">{id}</div>
        <Image
          src={images}
          alt="profile picture"
          className="rounded-full"
          width={54.65}
          height={54.65}
        />
        <p className="text-xl">{name}</p>
        <p>{points}</p>
      </div>
      <div className="bg-slate-200 w-5/6 h-[1px] mt-2"></div>
    </div>
  );
}
