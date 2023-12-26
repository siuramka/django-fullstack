// WebSocketService.js
const WS_URL = "127.0.0.1:8000/ws";

const ChatWebsocketClient = (chatroomId, accessToken) => {
  const socket = new WebSocket(`ws://${WS_URL}/${chatroomId}/${accessToken}`);

  socket.addEventListener("open", (event) => {
    console.log("Open", event);
  });

  socket.addEventListener("close", (event) => {
    console.log("Close", event);
  });

  return socket;
};

export default ChatWebsocketClient;
