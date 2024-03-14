import dynamic from 'next/dynamic';
import { useAppSelector } from '../../hooks/use-redux-typed';
import { genConfig } from 'react-nice-avatar';
import { Input } from '@nextui-org/react';
import React from 'react';

export const NoSSRAvatar = dynamic(() => import('react-nice-avatar'), {
  ssr: false,
});
export const PlayerInfo = () => {
  const user = useAppSelector((state) => state.user);
  if (user)
    return (
      <>
        <NoSSRAvatar className={'w-44 h-44'} {...genConfig(user.avatar_url)} />
        <Input
          disabled
          className={'w-full'}
          value={user.username}
          // onChange={(e) => setUsername(e.target.value)}
        />
      </>
    );
  else return <>loading...</>;
};
