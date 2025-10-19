import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface OnlineUser {
    userId: string;
    socketId: string;
}

interface UsersState {
  onlineUsers: OnlineUser[];
}

const initialState: UsersState = {
  onlineUsers: [],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setOnlineUsers: (state, action: PayloadAction<OnlineUser[]>) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setOnlineUsers } = usersSlice.actions;
export default usersSlice.reducer;
