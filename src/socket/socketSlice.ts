import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/**
 * File Name: socketSlice.ts
 * Purpose: Manages the state related to the WebSocket connection itself,
 * like whether it's currently connected or not.
 */
interface SocketState {
    isConnected: boolean;
}

const initialState: SocketState = {
    isConnected: false,
};

const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        // This reducer handles updating the connection status in the Redux store.
        // We use PayloadAction<boolean> to type the action's payload.
        setConnectionStatus: (state, action: PayloadAction<boolean>) => {
            state.isConnected = action.payload;
        },
    },
});

export const { setConnectionStatus } = socketSlice.actions;
export default socketSlice.reducer;
