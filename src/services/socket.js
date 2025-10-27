// SOCKETS - KMOM03
// Frontend

// npm i --save socket.io-client

import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:8337"; // tidigare 3001

//const socket = io("http://localhost:8337"); // backend-port

// Skapa socket-anslutning direkt
export const socket = io(SERVER_URL);

// Använda anslutningen i html kod
/*
<script>
import { socket } from "@/services/socket";

export default {
  mounted() {
    socket.on("connect", () => {
      console.log("Ansluten till servern!");
    });
  },
  beforeUnmount() {
    socket.disconnect();
  },
};
</script>
*/

// Rooms

socket.emit("create", docs["_id"]);

socket.on("doc", (data) => {
    setEditorContent(data.html, false);
});

let data = {
    _id: "LÅNG OCH SLUMPAT",
    html: "Texten i html format från editorn"
};

socket.emit("doc", data);
