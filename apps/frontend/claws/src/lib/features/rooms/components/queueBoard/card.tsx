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
      className="rounded-full mr-3"
      width={54}
      height={54}
    />
  ) : (
    <div className="rounded-full mr-3 bg-slate-200 w-14 h-14 flex justify-center items-center">
      <p className="text-lg font-urbanist">{nameInitials}</p>
    </div>
  );

  return (
    <div className="flex flex-col w-full py-4 mx-auto ">
      <div className="flex  flex-row justify-between items-center">
        <div className="flex items-center flex-1 mb-2 sm:mb-0">
          <div className="flex items-center text-xl font-bold">
            <p className="mr-3 text-xl font-urbanist">{id + 1}</p>
            {imageComponent}
            <p className="text-lg font-urbanist">
              {name} {isMyPlayer ? ' (You)' : ''}
            </p>
          </div>
        </div>
        <p className="text-right text-sm font-urbanist">{points} Point</p>
      </div>
    </div>
  );
}
