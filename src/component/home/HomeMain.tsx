import { useEffect } from "react";
import { useAppDispatch } from "../../hooks/hooks";
import { connectSocket, disconnectSocket } from "../../socket/socketActions";

/**
 * File Name: Chat.tsx
 * Purpose: The main React component for the chat interface.
 * It interacts with Redux to get state and dispatch actions, keeping it decoupled
 * from the actual socket implementation.
 */
export function HomeMain() {
  // Use our custom typed hooks for full type safety
  const dispatch = useAppDispatch();

  // Select state from the Redux store. `state` is automatically typed as `RootState`.
  // const { isConnected } = useAppSelector((state: RootState) => state.socket);
  // const { messages } = useAppSelector((state: RootState) => state.chat);

  useEffect(() => {
    dispatch(connectSocket());
    return () => {
      dispatch(disconnectSocket());
    };
  }, [dispatch]);



  return <div>Home Main</div>;
}
