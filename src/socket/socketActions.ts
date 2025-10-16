/**
 * File Name: socketActions.ts
 * Purpose: Defines simple action creator functions for controlling the socket.
 * This makes dispatching actions from components cleaner and less error-prone.
 */

export const connectSocket = () => ({
    type: 'socket/connect' as const, // Using 'as const' gives it a specific literal type
});

export const disconnectSocket = () => ({
    type: 'socket/disconnect' as const,
});
