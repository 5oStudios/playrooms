import { createListenerMiddleware, removeListener } from '@reduxjs/toolkit';

import { AppDispatch, RootState } from './features/store';

export const listenerMiddleware = createListenerMiddleware();

export const startAppListening = listenerMiddleware.startListening.withTypes<
  RootState,
  AppDispatch
>();
export const stopAppListening = listenerMiddleware.stopListening.withTypes<
  RootState,
  AppDispatch
>();
export const removeAppListener = removeListener.withTypes<
  RootState,
  AppDispatch
>();
