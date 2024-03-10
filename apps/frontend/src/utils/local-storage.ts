import { Preferences, SetOptions } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

const webLocalStorage = {
  setItem: (options: SetOptions) =>
    window.localStorage.setItem(options.key, options.value),
  getItem: (key: string) => window.localStorage.getItem(key),
  remove: (key: string) => window.localStorage.remove(key),
  clear: () => window.localStorage.clear(),
};
const nativeLocalStorage = {
  setItem: (options: SetOptions) => Preferences.set(options),
  getItem: (key: string) => Preferences.get({ key }),
  remove: (key: string) => Preferences.remove({ key }),
  clear: () => Preferences.clear(),
};

export const localStorage = (() => {
  console.log(
    'Initializing local storage on platform:',
    Capacitor.getPlatform()
  );
  return Capacitor.isNativePlatform() ? nativeLocalStorage : webLocalStorage;
})();
