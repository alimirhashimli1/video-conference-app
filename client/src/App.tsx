import { useEffect } from "react"
import socketIO from "socket.io-client"

const WS ="http://localhost:8080"
function App() {
  useEffect(() => {
    const socket = socketIO(WS);

    socket.on("connect", () => {
      console.log("Connected to server");
    });
    
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <div>
     <h1>Hello World</h1>
    </div>
  )
}

export default App
