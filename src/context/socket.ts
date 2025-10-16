import { createContext, useContext } from 'react';
import { io } from 'socket.io-client';

const websocket_URL = import.meta.env.WEBSOCKET_URL;
export const socket = io(websocket_URL);
export const SocketContext = createContext<typeof socket | undefined>(undefined);

export const useSocket = () => {
  return useContext(SocketContext);
};
