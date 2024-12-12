import Peer from "peerjs";
import { createContext, useEffect, useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import socketIOClient from "socket.io-client";
import { v4 as uuidV4 } from "uuid";
import { peersReducer } from "./peersReducer";
import { addPeerAction, removePeerAction } from "./peerActions";

const WS = "http://localhost:8080";

type RoomContextType = {
    ws: Socket;
    me: Peer | undefined;
    stream: MediaStream | undefined;
    peers: Record<string, { stream: MediaStream }>;
    shareScreen: () => void
  };

export const RoomContext = createContext<RoomContextType | null>(null);

const ws = socketIOClient(WS);

// RoomProvider component to provide the socket context
export const RoomProvider: React.FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  const navigate = useNavigate();
  const [me, setMe] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>()
  const [peers, dispatch] = useReducer(peersReducer, {});
  const [screenSharing, setScreenSharing] = useState(false);
  const enterRoom = ({ roomId }: { roomId: string }) => {
    console.log({ roomId });
    navigate(`/room/${roomId}`);
  };

  const getUsers = ({participants}: {participants: string[]}) => {
    console.log({participants})
  }

  const removePeer = (peerId: string) => {
      dispatch(removePeerAction(peerId))
    }

    const switchStream = (stream: MediaStream) => {
      
    }
  
    const shareScreen = () => {
      navigator.mediaDevices.getDisplayMedia({ video: true, audio: false }).then((stream) => {
        setStream(stream)
      })
    }

  useEffect(() => {
    const meId = uuidV4();
    const peer = new Peer(meId);
    setMe(peer);

    try {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        setStream(stream) 
      })
    } catch (error) {
      console.log(error)
    }

    ws.on("room-created", enterRoom);
    ws.on("get-users", getUsers)
    ws.on("user-disConnected", removePeer)
  }, []);

  useEffect(() => {
    if(!me) return;
    if(!stream) return;

    ws.on("user-joined", ({peerId})=> {
      const call = me.call(peerId, stream)
      call.on("stream", (peerStream) => {
        dispatch(addPeerAction(peerId, peerStream))
      })
    })

    me.on("call", (call) => {
      call.answer(stream)
      call.on("stream", (peerStream) => {
        dispatch(addPeerAction(call.peer, peerStream))
      })
    })
  }, [me, stream]);

  console.log({peers})

  return (
    <RoomContext.Provider value={{ ws, me, stream, peers, shareScreen }}>{children}</RoomContext.Provider>
  );
};
