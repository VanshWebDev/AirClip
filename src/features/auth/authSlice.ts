import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/**
 * File Name: authSlice.ts
 * Purpose: Manages all state related to user authentication.
 */

// Define the structure for the user's details
interface UserDetails {
  name?: string;
  email: string;
  picture: string;
  username: string;
}

// Define the state structure for this slice
interface AuthState {
  isUserLoggedIn: boolean;
  user: UserDetails; // User can be null when not logged in
  passwordResetEmail: string | null;
}

const initialState: AuthState = {
  isUserLoggedIn: false,
  user: {
    name: "",
    email: "",
    picture:"",
    username:"",
  },
  passwordResetEmail: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * An action to set the user's login status.
     * The payload should be a simple boolean: true or false.
     */
    setLoginStatus: (state, action: PayloadAction<boolean>) => {
      // Correctly assign the boolean payload to the state property.
      state.isUserLoggedIn = action.payload;
    },

    setUser: (state, action: PayloadAction<UserDetails>) => {
      state.isUserLoggedIn = true;
      state.user = action.payload;
      state.passwordResetEmail = null; // Clear reset email on login
    },

    /**
     * An action to clear user data and set login status to false upon logout.
     */
    logout: (state) => {
      state.isUserLoggedIn = false;
      state.user = {
        name: "",
        email: "",
        picture: "",
        username: "",
      };
    },
    // ACTION TO STORE THE EMAIL FOR PASSWORD RESET
    setPasswordResetEmail: (state, action: PayloadAction<string>) => {
      state.passwordResetEmail = action.payload;
    },
  },
});

export const { setLoginStatus, setUser, logout,setPasswordResetEmail } = authSlice.actions;
export default authSlice.reducer;
