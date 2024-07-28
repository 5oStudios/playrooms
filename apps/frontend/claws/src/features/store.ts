import { configureStore } from '@reduxjs/toolkit';

import { clawsRoomReducer } from './claws/slice';
import { roomsSlice } from './rooms/roomsSlice';

export const store = configureStore({
  reducer: {
    rooms: roomsSlice.reducer,
    clawsRoom: clawsRoomReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
