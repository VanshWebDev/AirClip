import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/**
 * File Name: chatSlice.ts
 * Purpose: Manages all state related to the chat feature, such as the list of messages.
 */

// Define a type for a single message object
export interface Message {
  user: string;
  text: string;
}

// Define the state structure for this slice
interface ChatState {
  messages: Message[];
}

const initialState: ChatState = {
  messages: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // This action is intended to be caught by the middleware to send a message.
    // The payload is typed as `Message`.
    sendMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    // This action is dispatched by the middleware when a new message is received.
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
  },
});

export const { sendMessage, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
