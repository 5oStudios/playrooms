import { usePubSub } from './use-pub-sub';

export const SyncStateEventKey = 'sync-state';
export const useSyncState = () => {
  const { subscribe, publish } = usePubSub();

  subscribe({
    event: SyncStateEventKey,
    callback: (state: any) => {
      console.log('Syncing state', state);
    },
  });
};
