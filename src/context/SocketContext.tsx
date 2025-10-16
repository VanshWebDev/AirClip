// src/context/SocketContext.tsx

import React from "react";
import { SocketContext, socket } from "./socket";

// The Provider component that will wrap our app
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
