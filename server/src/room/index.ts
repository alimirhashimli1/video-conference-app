import { start } from "repl";
import { Socket } from "socket.io";
import {v4 as uuidV4} from "uuid";

const rooms: Record<string, string[]> = {};

interface IRoomParams {
    roomId: string;
    peerId: string;
}

export const roomHandler = (socket: Socket) => {
    const createRoom = () => {
        const roomId = uuidV4()
        rooms[roomId] = []
        socket.emit("room-created", {roomId})
        console.log("user created room");

    }
    const joinRoom = ({roomId, peerId} : IRoomParams) => {
        if (rooms[roomId]) {


        console.log("user joined room", "roomId:", roomId, "peerId:", peerId);
        rooms[roomId].push(peerId)
        socket.join(roomId)
        socket.to(roomId).emit("user-joined", {peerId})
        socket.emit("get-users", {roomId, participants: rooms[roomId]})
    }
    socket.on("disconnect", () => {
        console.log("user left the room", "peer Id", peerId);
        leaveRoom({roomId, peerId})
    });
    }

    const leaveRoom = ({ roomId, peerId }: IRoomParams) => {
        if (rooms[roomId]) {
            rooms[roomId] = rooms[roomId].filter((id) => id !== peerId);

            // Emit user-disconnected event to the room
            socket.to(roomId).emit("user-disconnected", peerId);

            // If the room is empty, you might want to delete it
            if (rooms[roomId].length === 0) {
                delete rooms[roomId];
            }
        } else {
            console.log(`Room with ID ${roomId} does not exist.`);
        }
    };

    const startSharing = ({roomId, peerId}: IRoomParams) => {
        socket.to(roomId).emit("user-start-sharing", {peerId})
    }

    const stoppedSharing = (roomId: string) => {
        socket.to(roomId).emit("user-stopped-sharing")
    }

    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom)
    socket.on("start-sharing", startSharing)
    socket.on("stop-sharing", stoppedSharing)
}