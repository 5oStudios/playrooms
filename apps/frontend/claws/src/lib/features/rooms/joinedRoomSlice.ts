import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Room } from 'colyseus.js';
import { toast } from 'sonner';

import { PlayerState, RoomState, gameClient } from '@kingo/game-client';

import { startAppListening } from '../../listenerMiddleware';
import { RootState } from '../../store';

export let joinedRoomInstance: Room<RoomState> | undefined;

export const moveClaws = createAsyncThunk(
  'baseRoom/moveClaws',
  async (direction: 'up' | 'down' | 'left' | 'right' | 'drop') => {
    if (joinedRoomInstance) {
      joinedRoomInstance.send('move-claws', direction);
    }
  },
);

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
  myPlayerSessionId: string | null;
  error: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
} = {
  roomState: null,
  myPlayerSessionId: null,
  error: null,
  status: 'idle',
};

// @ts-ignore
export const joinedRoomSlice = createSlice({
  name: 'joinedRoom',
  initialState,
  reducers: {
    setRoom(state, action) {
      state.roomState = action.payload;
    },
    setMyPlayerSessionId(state, action) {
      state.myPlayerSessionId = action.payload;
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

export const { setRoom, setError, setMyPlayerSessionId } =
  joinedRoomSlice.actions;
export const selectJoinedRoom = (state: RootState) => state.rooms.joinedRoom;
export const selectMyPlayerState = (state: RootState) =>
  state.rooms.joinedRoom.roomState?.players.find(
    (player) => player.sessionId === state.rooms.joinedRoom.myPlayerSessionId,
  );

function attachToaster() {
  let isToasterRunning = false;

  if (isToasterRunning || !joinedRoomInstance) {
    return;
  }

  console.count('attachToaster');
  joinedRoomInstance.onMessage('drop-state', (message) => {
    if (message === 'lose') {
      toast.error('You lost!');
    } else {
      toast.success('You won!');
    }
    console.log('drop-state', message);
  });
}

startAppListening({
  actionCreator: joinRoomById.fulfilled,
  effect: async (action, listenerApi) => {
    const room = action.payload;

    listenerApi.dispatch(setMyPlayerSessionId(room.sessionId));

    room.onStateChange((roomState) => {
      listenerApi.dispatch(setRoom({ ...roomState }));
    });

    attachToaster();

    // room.onLeave(() => {
    //   // listenerApi.dispatch(setRoom(null));
    // });
  },
});
