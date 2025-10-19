import { type Middleware } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";
import { setConnectionStatus } from "../socket/socketSlice";
import { addMessage, type ClipboardItem } from "../features/chat/chatSlice"; // Import ClipboardItem type
import { toast } from "sonner";


// // Helper function to copy text to the clipboard and show a toast
//   const copyToClipboard = (text: string) => {
//     const textArea = document.createElement("textarea");
//     textArea.value = text;
//     // Make the textarea invisible
//     // textArea.style.position = "fixed";
//     // textArea.style.left = "-9999px";
//     document.body.appendChild(textArea);
//     textArea.select();
//     try {
//       document.execCommand('copy');
//       toast.info("New item copied to your clipboard!");
//     } catch (err) {
//       // Fail silently if auto-copy is blocked by the browser
//       console.error("Auto-copy failed:", err);
//     }
//     document.body.removeChild(textArea);
//   };



/**
 * File Name: socketMiddleware.ts
 * Purpose: This middleware manages the WebSocket connection and handles the room-based logic.
 * It listens for Redux actions to emit socket events (like joining a room or sending a message)
 * and dispatches actions when it receives events from the server.
 */

const socketMiddleware: Middleware = (store) => {
  let socket: Socket | null = null;

   // Helper function to copy text to the clipboard and show a toast
  const copyToClipboard = async (text: string) => {
    // --- THIS IS THE FIX ---
    // 1. Check if the document is currently focused. If not, do nothing.
    // This prevents the "Document is not focused" error.
    console.log(document.hasFocus())
    if (!document.hasFocus()) {
      return; // Silently exit if the tab is not active
    }
    // --- END OF FIX ---

    // Check if the modern Clipboard API is available
    if (!navigator.clipboard) {
      console.error("Clipboard API not available on this browser.");
      toast.error("Auto-copy is not supported on this browser.");
      return;
    }

    try {
      // Use the modern, promise-based API
      await navigator.clipboard.writeText(text);
      // This toast will only show if the above line succeeds
      toast.info("New item copied to your clipboard!");
    } catch (err) {
      // This will catch errors if permission is denied
      console.error("Auto-copy failed:", err);
      toast.warning("Could not auto-copy. Please grant clipboard permissions.");
    }
  };


  return (next) => (action: unknown) => {
    const { dispatch, getState } = store;

    // Basic type guard for Redux actions
    if (typeof action !== "object" || action === null || !("type" in action)) {
      return next(action);
    }

    const typedAction = action as { type: string; payload?: any };
    const { user } = getState().auth;

    switch (typedAction.type) {
      // Action to initiate the connection
      case "socket/connect":
        if (socket === null && user) {
          const websocketURL =
            import.meta.env.VITE_WEBSOCKET_URL || "http://localhost:4000";
          socket = io(websocketURL, { withCredentials: true });

          // --- Event Listeners ---
          socket.on("connect", () => {
            console.log("Socket connected:", socket?.id);
            dispatch(setConnectionStatus(true));

            // 1. Register the user with their unique ID
            socket?.emit("register_user", { userId: user._id });

            // 2. Automatically join the user's private room
            socket?.emit("join_room", user._id);
          });

          socket.on("disconnect", () => {
            dispatch(setConnectionStatus(false));
          });

          // 3. Listen for incoming clipboard items for the current room
          socket.on("receive_clipboard_item", (item: ClipboardItem) => {
            console.log("receive_clipboard_item", item)
               // Check if the message came from a different socket (another device or user)
            if (socket && item.senderId !== socket.id) {
              copyToClipboard(item.content);
            }
            dispatch(addMessage(item));
          });
        }
        break;

      // Action to disconnect
      case "socket/disconnect":
        if (socket) {
          socket.disconnect();
          socket = null;
        }
        break;

      // 4. New Action to join a specific room
      case "socket/joinRoom":
        if (socket) {
          console.log("join room: ", typedAction.payload);
          socket.emit("join_room", typedAction.payload);
        }
        break;

      // Action to send a message (emitted to the server)
      case "chat/sendMessage": // <-- Middleware is action ko yahan pakadta hai
        if (socket && getState().socket.isConnected) {
            console.log(typedAction.payload)
          const { currentRoom } = getState().chat;
          if (currentRoom) {
            console.log(currentRoom)
            // Aur data ko server par bhej deta hai
            socket.emit("send_clipboard_item", {
              content: typedAction.payload.content,
              room: currentRoom,
            });
          }
        }
        break;
    }

    // Pass the action along to the next middleware or reducer
    return next(action);
  };
};

export default socketMiddleware;
