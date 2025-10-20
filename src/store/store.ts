import { configureStore } from '@reduxjs/toolkit';
import socketMiddleware from '../middlewares/socketMiddleware';
import chatReducer from '../features/chat/chatSlice';
import authReducer from '../features/auth/authSlice';
import socketReducer from '../socket/socketSlice';
import onlineUsers from "../features/clipboard/userSlice"
import { apiSlice } from '@/features/apiSlice';
import roomReducer from "@/features/room/roomSlice"

/**
 * File Name: store.ts
 * Purpose: This file configures and exports the main Redux store.
 * It brings together all the reducers and middleware.
 */
export const store = configureStore({
  reducer: {
    socket: socketReducer,
    chat: chatReducer,
    auth: authReducer,
    onlineUser: onlineUsers,
    room: roomReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  // The middleware is applied here, enabling it to process actions globally.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // We need to disable the serializable check for the socket instance if it were ever stored in state,
      // but our middleware pattern avoids that, which is cleaner.
    }).concat(socketMiddleware).concat(apiSlice.middleware),
});

// These types are essential for TypeScript. They help you use useSelector and useDispatch with full type safety.
// We infer the `RootState` and `AppDispatch` types directly from the store itself.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
