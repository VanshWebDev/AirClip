import { type Middleware } from '@reduxjs/toolkit';
import { io, Socket } from 'socket.io-client';
import { setConnectionStatus } from '../socket/socketSlice';
import { addMessage, type Message } from '../features/chat/chatSlice';

/**
 * File Name: socketMiddleware.ts
 * Purpose: This is the core of the WebSocket integration. It's a Redux middleware
 * that listens for specific actions to manage the socket connection and emit events.
 * It also listens for incoming socket events and dispatches Redux actions in response.
 */
const socketMiddleware: Middleware = (store) => {
    let socket: Socket | null = null;

    return (next) => (action: unknown) => {
        // We need to check if the action is a plain object before proceeding.
        // Redux actions must be serializable, but our custom action types are strings.
        if (typeof action !== 'object' || action === null || !('type' in action)) {
            return next(action);
        }

        const a = action as { type: string } & Record<string, unknown>;
        const isConnected = !!socket && store.getState().socket.isConnected;

        // Action to initiate the connection
        if (a.type === 'socket/connect') {
            if (socket === null) {
                const websocketURL = import.meta.env.VITE_WEBSOCKET_URL || 'http://localhost:4000';
                socket = io(websocketURL);

                // --- Event Listeners ---
                // These listeners dispatch Redux actions when an event is received from the server.

                socket.on('connect', () => {
                    store.dispatch(setConnectionStatus(true));
                });

                socket.on('disconnect', () => {
                    store.dispatch(setConnectionStatus(false));
                });

                socket.on('receiveMessage', (message: Message) => {
                    console.log(message);
                    store.dispatch(addMessage(message));
                });
            }
        }

        // Action to disconnect
        if (a.type === 'socket/disconnect') {
            if (socket) {
                socket.disconnect();
                socket = null;
            }
        }

        // Action to send a message (emitted to the server)
        if (a.type === 'chat/sendMessage' && isConnected && socket) {
            // The `payload` will be strongly typed thanks to our chatSlice definition
            if ('payload' in a) {
                socket.emit('sendMessage', a.payload as Message);
            }
        }

        // Pass the action along to the next middleware or reducer
        return next(a);
    };
};

export default socketMiddleware;
