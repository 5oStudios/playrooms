import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Room } from 'colyseus.js';

import { PlayerState, RoomState, gameClient } from '@kingo/game-client';

import { startAppListening } from '../../listenerMiddleware';
import { RootState } from '../store';

export let joinedRoomInstance: Room<RoomState> | undefined;

export const joinRoomById = createAsyncThunk(
  'baseRoom/joinRoomById',
  async (...props: Parameters<typeof gameClient.joinById<RoomState>>) => {
    const roomInstance = await gameClient.joinById<RoomState>(...props);
    joinedRoomInstance = roomInstance;
    return roomInstance;
  },
);

export const leaveRoom = createAsyncThunk('baseRoom/leaveRoom', async () => {
  if (joinedRoomInstance) {
    await joinedRoomInstance.leave();
  }
});

const initialState: {
  roomState: RoomState | null;
  myPlayerState: PlayerState | null;
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
} = {
  roomState: null,
  myPlayerState: null,
  error: null,
  status: 'idle',
};

export const joinedRoomSlice = createSlice({
  name: 'joinedRoom',
  initialState,
  reducers: {
    setRoom(state, action) {
      state.roomState = action.payload;
    },
    setMyPlayer(state, action) {
      state.myPlayerState = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(joinRoomById.fulfilled, (state, action) => {
      state.roomState = action.payload.state;
      state.status = 'succeeded';
    });
    builder.addCase(joinRoomById.rejected, (state, action) => {
      state.error = action.error.message || 'Failed to join room';
      state.status = 'failed';
    });
    builder.addCase(joinRoomById.pending, (state) => {
      state.status = 'loading';
    });
  },
});

export const { setRoom, setError, setMyPlayer } = joinedRoomSlice.actions;
export const selectJoinedRoom = (state: RootState) => state.rooms.joinedRoom;

startAppListening({
  actionCreator: joinRoomById.fulfilled,
  effect: async (action, listenerApi) => {
    const room = action.payload;
    room.onStateChange((roomState) => {
      listenerApi.dispatch(setRoom(roomState));
      listenerApi.dispatch(
        setMyPlayer(
          roomState.players.find((p) => p.sessionId === room.sessionId),
        ),
      );
    });
    room.onLeave(() => {
      listenerApi.dispatch(setRoom(null));
    });
  },
});
