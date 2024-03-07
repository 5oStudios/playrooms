'use client';
import { useCallback, useEffect } from 'react';
import { EventEmitter } from 'eventemitter3';

const emitter = new EventEmitter();

const useSub = ({
  event,
  callback,
}: {
  event: string;
  callback: (data: unknown) => void;
}) => {
  const unsubscribe = useCallback(() => {
    emitter.off(event, callback);
  }, [callback, event]);

  useEffect(() => {
    emitter.on(event, callback);
    return unsubscribe;
  }, [callback, event, unsubscribe]);

  return unsubscribe;
};
const usePub = () => {
  return (event: string, data: unknown) => {
    emitter.emit(event, data);
  };
};

export function usePubSub() {
  return {
    subscribe: useSub,
    publish: usePub(),
  };
}
