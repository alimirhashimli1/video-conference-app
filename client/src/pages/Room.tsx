import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import { VideoPlayer } from "../components/VideoPlayer";
import { PeerState } from "../context/peersReducer";
import { ShareScreenButton } from "../components/ShareScreenButton";

export const Room = () => {
  const { id } = useParams();
  const roomContext = useContext(RoomContext);
  if (!roomContext) {
    throw new Error("RoomContext is not available");
  }
  const {ws, me, stream, peers, shareScreen} = roomContext;
  useEffect(() => {
    if (me) {
      ws.emit("join-room", { roomId: id, peerId: me.id });
    }
  }, [id, ws, me]);
  return <>Room id is {id}
  <div className="grid grid-cols-4 gap-4 bg">
  <VideoPlayer stream={stream} />
  {Object.values(peers as PeerState).map((peer) => (
      <VideoPlayer stream={peer.stream}/>
  ))}
  </div>
    <div className="fixed bottom-0 p-6 w-full flex justify-center border-t-2">
      <ShareScreenButton onClick={shareScreen}/>
    </div>
  </>;

  
};
