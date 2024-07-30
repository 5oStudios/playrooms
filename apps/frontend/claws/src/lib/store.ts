import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { userSlice } from './features/auth/userSlice';
import { joinedRoomSlice } from './features/rooms/joinedRoomSlice';
import { roomsSlice } from './features/rooms/roomsSlice';
import { listenerMiddleware } from './listenerMiddleware';

export const makeStore = () =>
  configureStore({
    reducer: {
      rooms: combineReducers({
        availableRooms: roomsSlice.reducer,
        joinedRoom: joinedRoomSlice.reducer,
      }),
      user: userSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(listenerMiddleware.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
