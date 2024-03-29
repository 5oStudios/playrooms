'use client';

import { useEffect, useState } from 'react';

import { SocketState } from '../store/features/socketSlice';
import { useAppSelector } from './use-redux-typed';

export function useSafeSocket() {
  const socketState = useAppSelector((state) => state.socket);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (socketState === SocketState.CONNECTED) {
      console.log('Socket is connected');
    } else if (socketState === SocketState.DISCONNECTED) {
      console.error('Socket is disconnected');
    }
  }, [socketState]);

  const tryAgain = () => {
    if (socketState === SocketState.CONNECTED) {
      setRetryCount(0);
      return true;
    } else {
      if (retryCount < 3) {
        console.log('Retrying...');
        setRetryCount((prevCount) => prevCount + 1);
        return false;
      } else {
        console.error('Max retry attempts reached');
        return false;
      }
    }
  };

  return {
    use: (callback: () => void) => {
      if (tryAgain()) {
        callback();
      } else {
        // Wait for the socket to be connected and then execute the callback
        const checkSocketInterval = setInterval(() => {
          if (socketState === SocketState.CONNECTED) {
            clearInterval(checkSocketInterval);
            callback();
          }
        }, 1000); // Check every second
      }
    },
  };
}
