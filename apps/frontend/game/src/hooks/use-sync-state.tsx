import { subscribe } from '@kingo/events';

export const SyncStateEventKey = 'sync-state';
export const useSyncState = () => {
  subscribe(SyncStateEventKey, (state: any) => {
    console.log('Syncing state', state);
  });
};
