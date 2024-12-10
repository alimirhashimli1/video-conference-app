import { useContext } from "react";
import { RoomContext } from "../context/RoomContext";
import { Socket } from "socket.io-client";

export const Join: React.FC = () => {
    const  ws = useContext(RoomContext);
    const createRoom = () => {
        if (ws) {
          ws.emit("create-room");
        } else {
          console.error("Socket is not available.");
        }
      };
        return (
        <button onClick={createRoom} className="bg-red-400 rounded-lg hover:bg-red-500">Start new meeting</button>
    );
}