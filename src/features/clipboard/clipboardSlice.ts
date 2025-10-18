// src/features/clipboard/clipboardSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../services/api";

// Define the type for your clipboard item
interface ClipboardItem {
  id: string;
  content: string;
}

// Define the initial state
interface ClipboardState {
  items: ClipboardItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ClipboardState = {
  items: [],
  status: "idle",
  error: null,
};

// Create the async thunk for fetching data
export const fetchClipboardHistory = createAsyncThunk(
  "clipboard/fetchHistory",
  async () => {
    const response = await apiClient.get("/clipboard/history");
    return response.data; // This becomes the action payload on success
  }
);

const clipboardSlice = createSlice({
  name: "clipboard",
  initialState,
  reducers: {
    // your regular synchronous reducers go here
  },
  // Handle the states of the async thunk
  extraReducers: (builder) => {
    builder
      .addCase(fetchClipboardHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchClipboardHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload; // Set the fetched items
      })
      .addCase(fetchClipboardHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default clipboardSlice.reducer;
