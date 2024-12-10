import { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client"; // Import the type for Socket
import socketIOClient from "socket.io-client";

const WS = "http://localhost:8080";

// Type the context as Socket or null, since ws might not be initialized yet
export const RoomContext = createContext<Socket | null>(null);

// Initialize the socket connection
const ws = socketIOClient(WS);

// RoomProvider component to provide the socket context
export const RoomProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate()
    const enterRoom = ({roomId} : {roomId: string}) => {
        console.log({roomId})
        navigate(`/room/${roomId}`)
    }
    useEffect(() => {
        ws.on("room-created", enterRoom)
    }, [])

  return <RoomContext.Provider value={ws}>{children}</RoomContext.Provider>;
};
