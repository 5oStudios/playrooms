import { createSlice } from '@reduxjs/toolkit';

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
  metadata?: {
    isProcessing: boolean;
    isSelected: boolean;
    isCorrect: boolean;
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
    editMessageMetadata(
      state,
      action: { payload: { id: string; metadata: ChatMessage['metadata'] } }
    ) {
      const message = state.find(
        (message) => message.message.id === action.payload.id
      );
      if (message) {
        message.metadata = action.payload.metadata;
      }
    },
  },
});

export const { addMessage, editMessageMetadata } = externalChatSlice.actions;

export default externalChatSlice.reducer;
