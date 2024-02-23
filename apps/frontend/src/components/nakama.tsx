'use client';
import { useTypedDispatch, useTypedSelector } from '../hooks/use-redux-typed';
import { useEffect } from 'react';
import { createParty } from '../store/features/partySlice';

export function Nakama() {
  const currentParty = useTypedSelector((state) => state.party);
  const dispatch = useTypedDispatch();
  useEffect(() => {
    dispatch(
      createParty({
        open: true,
        maxPlayers: 4,
      })
    );
  }, []);
  console.log(currentParty);
  return (
    <div className="flex justify-center items-center">
      <h1>Nakama</h1>
    </div>
  );
}
