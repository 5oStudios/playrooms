import { EventEmitter } from 'eventemitter3';
import { useEffect, useRef } from 'react';

export const emitter = new EventEmitter();

type Subscribe = (
  event: string,
  callback: (data: unknown) => void
) => {
  unsubscribe: () => void;
};

export const subscribe: Subscribe = (event, callback) => {
  console.log(`Subscribed to event '${event}'`);

  emitter.on(event, callback);
  console.table(
    emitter.eventNames().map((event) => ({
      event,
      listeners: emitter.listenerCount(event),
      listenersList: emitter.listeners(event).map((listener) => listener.name),
    }))
  );

  const unsubscribe = () => {
    emitter.off(event, callback);
    console.log(`Unsubscribed from event '${event}'`);
  };

  return { unsubscribe };
};

type Publish = (event: string, data?: unknown) => void;

export const publish: Publish = (event, data) => {
  emitter.emit(event, data);
  console.log(`Published '${event}' event with data: ${JSON.stringify(data)}`);
};

export const useSubscribeIf = (
  condition: boolean,
  event: string,
  callback: (data: unknown) => void
) => {
  const isSubscribed = useRef(false);
  useEffect(() => {
    if (!condition || isSubscribed.current) return;
    else {
      isSubscribed.current = true;
      subscribe(event, callback);
    }
    return () => {
      isSubscribed.current = false;
      subscribe(event, callback).unsubscribe();
    };
  }, [condition, event, callback]);
};
