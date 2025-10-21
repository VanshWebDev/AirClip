import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/**
 * File Name: chatSlice.ts
 * Purpose: Manages the state for the clipboard history and the current collaboration room.
 */

export interface ClipboardItem {
  id: string; 
  content: string;
  senderId: string;
  senderUsername: string;
  deviceInfo: string;
}

// Define the state structure for this slice
interface ChatState {
  messages: ClipboardItem[];
  currentRoom: string | null; // Track the current active room
}

const initialState: ChatState = {
  messages: [],
  currentRoom: null, // Initially, the user is in no specific room
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    /**
     * This action is caught by the middleware to send a new item.
     * It intentionally does NOT modify the state.
     */
    sendMessage: (_state, _action: PayloadAction<{ content: string }>) => {
      // This reducer remains empty.
    },

    /**
     * This action is dispatched by the middleware when a new item is received.
     */
    addMessage: (state, action: PayloadAction<ClipboardItem>) => {
      state.messages.unshift(action.payload);
    },
    
    /**
     * New action to set the current room and clear old messages.
     */
    setCurrentRoom: (state, action: PayloadAction<string | null>) => {
      state.currentRoom = action.payload;
      // When changing rooms, clear the old messages to avoid confusion
      state.messages = []; 
    },
  },
});

export const { sendMessage, addMessage, setCurrentRoom } = chatSlice.actions;
export default chatSlice.reducer;

