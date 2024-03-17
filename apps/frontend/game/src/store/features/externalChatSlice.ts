import { createSlice } from '@reduxjs/toolkit';

export enum ChatAnswerState {
  PROCESSING,
  FINISHED_PROCESSING,
  IGNORED,
}

export interface ChatMessage {
  message: {
    id: string;
    comment: string;
    timestamp: number;
  };
  user: {
    id: string;
    username: string;
    avatar_url: string;
  };
  meta?: {
    state?: ChatAnswerState;
    isCorrectAnswer?: boolean;
  };
}

const initialState: ChatMessage[] = [];

const externalChatSlice = createSlice({
  name: 'externalChat',
  initialState,
  reducers: {
    addMessage(state, action: { payload: ChatMessage }) {
      state.push(action.payload);
    },
    editMessageMeta(
      state,
      action: { payload: { id: string; meta: Partial<ChatMessage['meta']> } }
    ) {
      const message = state.find(
        (message) => message.message.id === action.payload.id
      );
      if (message) {
        message.meta = { ...message.meta, ...action.payload.meta };
      }
    },
  },
});

export const { addMessage, editMessageMeta } = externalChatSlice.actions;

export default externalChatSlice.reducer;
