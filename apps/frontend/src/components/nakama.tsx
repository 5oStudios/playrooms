'use client';
import { Client } from '@heroiclabs/nakama-js';
import { useEffect } from 'react';

export function Nakama() {
  const client = new Client(
    'defaultkey',
    '65.109.11.0',
    '7350',
    false,
    10000,
    true
  );
  const socket = client.createSocket();
  useEffect(() => {
    (async () => {
      const session = await client.authenticateDevice('myDeviceId', true);
      // save session in local storage
      localStorage.setItem('nakama-session', JSON.stringify(session));

      const acc = await socket.connect(session, true);
      console.log(acc);

      // Check whether a session has expired or is close to expiry.
      if (session.isexpired || session.isexpired(Date.now() + 1)) {
        try {
          await client.sessionRefresh(
            JSON.parse(localStorage.getItem('nakama-session'))
          );
        } catch (error) {
          // Couldn't refresh the session so reauthenticate.
          await client.authenticateDevice('myDeviceId');
        }
      }
    })();
  }, []);
  return (
    <div className="flex justify-center items-center">
      <h1>Nakama</h1>
    </div>
  );
}
