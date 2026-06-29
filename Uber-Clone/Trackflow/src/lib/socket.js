import io from "socket.io-client";

const socket = io("http://localhost:3004", {
  autoConnect: true,
});

socket.on("connect_error", (err) => {
  console.warn("[socket] connect error:", err.message);
});

export default socket;
