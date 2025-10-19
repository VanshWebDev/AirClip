// src/features/api/apiSlice.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../services/axiosBaseQuery";

interface UserDetails {
  name?: string;
  email: string;
  picture: string;
  username: string;
  _id: string;
}

// Define new types for the signup flow
interface SendOtpArgs {
  email: string;
}

interface VerifyOtpArgs {
  email: string;
  otp: number;
}
// Ye interface banayein
interface GenericApiResponse {
  status: number;
  message?: string; // Ise optional rakhein
  user?: UserDetails; // <-- ADD THIS LINE
  [key: string]: unknown; // ==> YEH HAI INDEX SIGNATURE
}
interface CreatePasswordArgs {
  email: string;
  password: string;
}

interface SendOtpResponse {
  message: string;
  emailSent: boolean;
}

interface ForgotPasswordResponse {
  message: string;
  data: {
    message: string;
    emailSent: boolean;
  };
}
interface AuthResponse {
  // A generic response for login/signup success
  message: string;
  token: string;
  user: {
    name?: string;
    email: string;
    picture?: string;
    username?: string;
  };
}
// 1. Define the arguments this endpoint needs
interface signupWithEmailArgs {
  email: string;
  password: string;
  confirmPassword: string;
}

// 1. Define the argument type for Google Auth
interface GoogleAuthArgs {
  token: string;
  wantToCreateNewAcc?: boolean;
}

// Define the argument types
interface LoginFormValues {
  emailOrUsername: string;
  password: string;
}

interface ForgotPasswordArgs {
  emailOrUsername: string;
}

// 1. Define the argument type for this endpoint
interface ResetPasswordArgs {
  email: string;
  otp: number;
  newPassword: string;
  confirmPassword: string;
}
// Define a service using a base URL and expected endpoints
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(), // Use your custom axiosBaseQuery here!
  tagTypes: ["Clipboard"], // Used for caching and invalidation
  endpoints: (builder) => ({
    // Endpoint to get all clipboard items

    // 1. Mutation to send the signup OTP
    sendSignupOtp: builder.mutation<SendOtpResponse, SendOtpArgs>({
      query: (args) => ({
        url: "/auth/sendotp",
        method: "POST",
        data: args,
      }),
    }),

    // 2. Mutation to verify the signup OTP
    verifySignupOtp: builder.mutation<GenericApiResponse, VerifyOtpArgs>({
      query: (args) => ({
        url: "/auth/verifyotpforsignup",
        method: "POST",
        data: args,
      }),
    }),

    // 3. Mutation to create the password and finalize the account
    createAccount: builder.mutation<AuthResponse, CreatePasswordArgs>({
      query: (args) => ({
        url: "/auth/create-account", // Assuming this is your final creation route
        method: "POST",
        data: args,
      }),
    }),

    signupWithEmail: builder.mutation<GenericApiResponse, signupWithEmailArgs>({
      query: (args) => ({
        url: "/auth/signupwithemail",
        method: "POST",
        data: args,
      }),
    }),

    // 3. Add the mutation for signing IN with Google
    signinWithGoogle: builder.mutation<GenericApiResponse, { token: string }>({
      query: ({ token }) => ({
        url: '/auth/signinwithgoogle',
        method: 'POST',
        data: { token },
      }),
    }),

    // 4. Add the mutation for signing UP with Google
    signupWithGoogle: builder.mutation<GenericApiResponse, GoogleAuthArgs>({
      query: (credentials) => ({
        url: '/auth/signupwithgoogle',
        method: 'POST',
        data: credentials,
      }),
    }),

    // Mutation for user login
    loginUser: builder.mutation<GenericApiResponse, LoginFormValues>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        data: credentials,
      }),
    }),

    // Mutation for forgot password
    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordArgs>({
      query: (args) => ({
        url: '/auth/forget-pwd',
        method: 'POST',
        data: args,
      }),
    }),

    // 3. Add the new mutation for resetting the password
    resetPassword: builder.mutation<GenericApiResponse, ResetPasswordArgs>({
      query: (credentials) => ({
        url: '/auth/verify-otp', // The URL from your component
        method: 'POST',
        data: credentials,
      }),
    }),

    // +++ ADD THIS QUERY
    checkToken: builder.query<GenericApiResponse, void>({
      query: () => ({
        url: '/auth/checktoken',
        method: 'GET',
        // withCredentials is now handled by your global apiClient
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useSendSignupOtpMutation,
  useVerifySignupOtpMutation,
  useSignupWithEmailMutation,
  useSigninWithGoogleMutation,
  useSignupWithGoogleMutation,
  useLoginUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useCheckTokenQuery,
} = apiSlice;
