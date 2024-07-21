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
    <div className="flex flex-col w-full items-center mt-4">
      <div className="flex justify-center items-center w-full mx-5 ">
        <div className="flex items-center  text-2xl font-bold w-[238.31px]">
          <p className="mr-3.5 text-[32px] font-urbanist">{id}</p>
          <Image
            src={images}
            alt="profile picture"
            className="rounded-full mr-3.5"
            width={54.65}
            height={54.65}
          />
          <p className="text-[17.92px] font-urbanist">{name}</p>
        </div>
        <p className="w-[139px] text-right text-[12.54px] font-urbanist">{points} Point</p>
      </div>
      <div className="bg-slate-200 w-5/6 h-[1px] mt-4"></div>
    </div>
  );
}
