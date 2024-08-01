// import { PayloadAction, createSlice } from '@reduxjs/toolkit';
//
// import { PlayerState } from '@kingo/game-client';
// import {startAppListening} from "../../listenerMiddleware";
// import {joinRoomById} from "../rooms/joinedRoomSlice";
//
// export const MyPlayerSlice = createSlice({
//   name: 'myPlayer',
//   initialState: null as PlayerState | null,
//   reducers: {
//     setMyPlayer: (state, action: PayloadAction<PlayerState>) => action.payload,
//     updateMyPlayer: (state, action: PayloadAction<Partial<PlayerState>>) => {
//       if (state) {
//         return {
//           ...state,
//           ...action.payload,
//         };
//       }
//     },
//   },
// });
//
// export const { setMyPlayer, updateMyPlayer } = MyPlayerSlice.actions;
//
// startAppListening({
//   actionCreator: joinRoomById.fulfilled,
//   effect: async (action, listenerApi) => {
//     const { dispatch } = listenerApi;
//     const { payload } = action;
//     const { roomState } = payload;
//     const myPlayer = roomState.players.find((p) => p.email === payload.email);
//     if (myPlayer) {
//       dispatch(setMyPlayer(myPlayer));
//     }
//   }
//
// });
