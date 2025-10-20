import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Define the shape of a single user object received from the backend
interface RoomUser {
  userId: string;
  username: string;
}

// Define the state structure for this slice
interface RoomState {
  currentRoomUsers: RoomUser[];
}

const initialState: RoomState = {
  currentRoomUsers: [],
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    /**
     * Action to set or update the list of users in the current room.
     */
    setRoomUsers: (state, action: PayloadAction<RoomUser[]>) => {
      state.currentRoomUsers = action.payload;
    },
    /**
     * Action to clear the list of users, e.g., when leaving a room.
     */
    clearRoomUsers: (state) => {
      state.currentRoomUsers = [];
    },
  },
});

export const { setRoomUsers, clearRoomUsers } = roomSlice.actions;
export default roomSlice.reducer;
