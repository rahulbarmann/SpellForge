import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("New User connected with Socket ID:", socket.id);
    socket
        .to(socket.id)
        .emit(`You joined the ws-server succesfully with id: ${socket.id}`);
    socket.on("create-room", (id) => {
        socket.join("room-1");
        io.to("room-1").emit("reply", `Player with ID: ${id} joined!`);
    });
    // socket.on("message", (socket) => {
    //     socket.emit(`NIKO not G2 :( with id: ${socket.id}`);
    // });
});

httpServer.listen(8080, () => {
    console.log("Listening on PORT 8080");
});
