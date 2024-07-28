import React from 'react';

export default function RoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-center items-center bg-primary h-[117px]">
        <p className="text-xl text-white font-bold">Claws Room</p>
      </div>
      <div className="flex-grow flex flex-wrap justify-start items-start mt-10">
        {children}
      </div>
      <footer className="flex justify-center items-center bg-primary h-[117px]">
        <button className="text-white bg-gradient-to-t from-secondary to-darkYellow w-[380px] h-[58px] rounded-3xl flex items-center justify-center">
          Create Room
        </button>
      </footer>
    </div>
  );
}
