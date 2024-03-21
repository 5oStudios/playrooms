import { EventEmitter } from 'eventemitter3';

export const emitter = new EventEmitter();

type Subscribe = (
  event: string,
  callback: (data: unknown) => void
) => {
  data: unknown;
  unsubscribe: () => void;
};

export const subscribe: Subscribe = (event, callback) => {
  let data;

  const _callback = (_data: unknown) => {
    data = _data;
    callback(data);
  };

  emitter.on(event, callback);

  return { data, unsubscribe: () => emitter.off(event, _callback) };
};

type Publish = (event: string, data?: unknown) => void;

export const publish: Publish = (event, data) => {
  emitter.emit(event, data);
};
