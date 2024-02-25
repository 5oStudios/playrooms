'use client';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/use-redux-typed';
import { PlayerInfo } from '../../../components/modals/lobby';

export default function Index() {
  const session = useAppSelector((state) => state.session);
  const account = useAppSelector((state) => state.user);
  console.log(session);
  const dispatch = useAppDispatch();

  // gameClient
  //   .authenticateDevice(nanoid(18), true, 'nbnbnbnbnbn')
  //   .then((session) => dispatch(setSession(session)));

  console.log(account);

  return (
    <div className="flex justify-center items-center">
      {/*<Lobby />*/}
      <PlayerInfo />

      {/*<Nakama />*/}
    </div>
  );
}
