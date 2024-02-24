'use client';
import React from 'react';
import { Nakama } from '../../../components/nakama';
import Lobby from '../../../components/modals/lobby';

export default function Index() {
  return (
    <div className="flex justify-center items-center">
      <Lobby />
      <Nakama />
    </div>
  );
}
