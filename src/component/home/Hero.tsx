import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { sendMessage, setCurrentRoom } from "@/features/chat/chatSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Users } from "lucide-react";
import { toast } from "sonner";
import { ErrHandling } from "@/utils/Err/ErrHandling";
import type { RootState } from "@/store/store";

export const Hero = () => {
  const dispatch = useAppDispatch();
  const [newItem, setNewItem] = useState("");
  const [roomInput, setRoomInput] = useState("");

  // Select all necessary data from the Redux store
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { messages, currentRoom } = useAppSelector(
    (state: RootState) => state.chat
  );
  const { isUserLoggedIn } = useAppSelector((state: RootState) => state.auth);
  const { currentRoomUsers } = useAppSelector((state: RootState) => state.room);
  // By default, set the user's personal room as the current room
  useEffect(() => {
    if (user && !currentRoom) {
      // The user's private room is named after their user ID
      dispatch(setCurrentRoom(user._id));
    }
  }, [user, currentRoom, dispatch]);

  const handleJoinRoom = () => {
    if (!roomInput.trim()) return;
    // Dispatch an action for the middleware to join the custom room
    dispatch({ type: "socket/joinRoom", payload: roomInput });
    // Update the state to reflect the new room and clear old messages
    dispatch(setCurrentRoom(roomInput));
    setRoomInput("");
  };

  const handleGoToPersonalClipboard = () => {
    if (!user) return;
    // Join the personal room (named after user._id)
    dispatch({ type: "socket/joinRoom", payload: user._id });
    dispatch(setCurrentRoom(user._id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    // The sendMessage action now implicitly sends to the currentRoom via the middleware
    dispatch(sendMessage({ content: newItem }));
    setNewItem("");
  };

  const handleCopy = (text: string) => {
    // A reliable way to copy text to the clipboard that works in most environments
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      toast.success("Copied to clipboard!");
    } catch (err) {
      ErrHandling(err, "Couldn't copy text");
    }
    document.body.removeChild(textArea);
  };

  if (!isUserLoggedIn) {
    return (
      <div className="container text-center py-12">
        <h2 className="text-2xl font-bold">Welcome to AirClip</h2>
        <p className="text-muted-foreground">
          Please log in to sync your clipboard in real-time.
        </p>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 space-y-8">
      {/* Room Management Card */}
      <Card>
        <CardHeader>
          <CardTitle>Collaboration Space</CardTitle>
          <p className="text-sm text-muted-foreground pt-2">
            Currently in room:{" "}
            <span className="font-semibold text-primary">
              {currentRoom === user._id ? "Own room" : currentRoom}
            </span>
          </p>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-col gap-4">
          <Input
            placeholder="Enter a room name to join or create..."
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
          />
          <div className="flex flex-col gap-2">
            <Button onClick={handleJoinRoom} className="w-full">
              Join Room
            </Button>
            <Button
              variant="outline"
              onClick={handleGoToPersonalClipboard}
              className="w-full"
            >
              Personal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Sync New Item</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <Input
                  placeholder="Paste or type content to sync..."
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                />
                <Button type="submit">Sync to Room</Button>
              </form>
            </CardContent>
          </Card>

          {/* NEW: Online Users Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Users in Room ({currentRoomUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[150px] w-full">
                {currentRoomUsers.length > 0 ? (
                  <ul className="space-y-2 pr-4">
                    {currentRoomUsers.map((roomUser) => (
                      <li
                        key={roomUser.userId}
                        className="text-sm p-2 bg-secondary rounded-md flex items-center"
                      >
                        <span
                          className={`h-2 w-2 rounded-full mr-2 ${
                            roomUser.userId === user._id
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        ></span>
                        {roomUser.username}
                        {roomUser.userId === user._id && (
                          <span className="text-xs text-muted-foreground ml-2">
                            (You)
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Only you are in this room.
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <aside>
          <Card>
            <CardHeader>
              <CardTitle>Clipboard History</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] w-full">
                {messages.length > 0 ? (
                  <ul className="space-y-3 pr-4">
                    {messages.map((item) => (
                      <li
                        key={item.id}
                        className="flex justify-between text-sm p-3 bg-secondary rounded-md break-all shadow-sm"
                      >
                        <div>
                        <code>Name: {item.senderUsername}</code>
                        <br />
                        <code>Device name: {item.deviceInfo}</code>
                        <br />
                        <span className="break-all">Text: {item.content}</span>
                        </div>
                        <Copy
                          className="h-4 w-4 text-muted-foreground cursor-pointer shrink-0 hover:text-primary"
                          onClick={() => handleCopy(item.content)}
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No items in this room yet.
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};
