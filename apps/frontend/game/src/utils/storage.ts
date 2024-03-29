import { Capacitor } from '@capacitor/core';
import { Preferences, SetOptions } from '@capacitor/preferences';

const webLocalStorage = {
  setItem: (options: SetOptions) =>
    window?.localStorage.setItem(options.key, options.value),
  getItem: (key: string) => window?.localStorage.getItem(key),
  remove: (key: string) => window?.localStorage.removeItem(key),
  clear: () => window?.localStorage.clear(),
};
const nativeLocalStorage = {
  setItem: (options: SetOptions) => Preferences.set(options),
  getItem: (key: string) => Preferences.get({ key }),
  remove: (key: string) => Preferences.remove({ key }),
  clear: () => Preferences.clear(),
};
const serverLocalStorage = {
  setItem: (options: SetOptions) => {
    console.error('Local storage is not available');
    return;
  },
  getItem: (key: string) => {
    console.error('Local storage is not available');
    return null;
  },
  remove: (key: string) => {
    console.error('Local storage is not available');
    return;
  },
  clear: () => {
    console.error('Local storage is not available');
    return;
  },
};

export const storage = (() => {
  try {
    if (Capacitor.isNativePlatform()) {
      console.log(
        'Initializing local storage on platform: ',
        Capacitor.getPlatform(),
      );
      return nativeLocalStorage;
    } else {
      console.log('Initializing local storage on platform: ', 'web');
      if (window === undefined) {
        console.error('Local storage is not available');
      }
      return webLocalStorage;
    }
  } catch (e) {
    console.error('Local storage is not available');
    return serverLocalStorage;
  }
})();
