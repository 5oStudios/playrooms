import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { listenerMiddleware } from '../listenerMiddleware';
import { joinedRoomSlice } from './rooms/joinedRoomSlice';
import { roomsSlice } from './rooms/roomsSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      rooms: combineReducers({
        availableRooms: roomsSlice.reducer,
        joinedRoom: joinedRoomSlice.reducer,
      }),
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(listenerMiddleware.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
