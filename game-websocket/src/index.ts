import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { calculateSpell } from "./spells/spell-mechanics";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
//                     roomNumber:    0     1   ...
let players: any = []; // schema: [ [{}], [{}], ... ]
let playerCount = 0;
let roomNumber: number;

io.on("connection", (socket) => {
    console.log("New User connected with Socket ID:", socket.id);

    if (playerCount % 2 == 0) {
        roomNumber = playerCount / 2;
        players.push([]);
    }

    console.log(players);

    playerCount++;
    socket
        .to(`roomId-${roomNumber}`)
        .emit("other-player", `Player ${socket.id} joined!`);

    players[roomNumber].push({
        username: socket.id,
        sid: socket.id,
        healthPoint: 100,
        cards: ["fireball", "holylight"],
        lastPlayed: false,
    });

    socket.join(`roomId-${roomNumber}`);

    socket.on("use-spell", async (arg) => {
        const socketRoomNumber = Number([...socket.rooms][1].split("-")[1]);

        console.log("ALL OF THE ROOMS FOR THIS SOCKET:", socket.rooms);
        console.log(
            "THE ROOM ID FOR THIS SOCKET:",
            [...socket.rooms][1].split("-")[1]
        );

        const totalSockets = await io
            .in(`roomId-${socketRoomNumber}`)
            .fetchSockets();
        const numberOfSockets = totalSockets.length;

        console.log(
            "NUMBER OF ACTIVE SOCKETS IN THIS ROOM:",
            totalSockets.length
        );

        const subArr = players[socketRoomNumber].filter(
            (e: any) => e.sid == socket.id
        );

        console.log("The SUB ARR: ", subArr, subArr[0].lastPlayed === true);

        if (numberOfSockets % 2 != 0 || subArr[0].lastPlayed === true) {
            socket.emit("alert", "Wait For Your Opponent's Turn!");
        } else {
            players[socketRoomNumber].forEach((e: any) => {
                if (e.sid == socket.id) {
                    e.lastPlayed = true;
                } else {
                    e.lastPlayed = false;
                }
            });

            socket
                .to(`roomId-${socketRoomNumber}`)
                .emit(
                    "other-player",
                    `Player ${arg.username} used the spell ${arg.spell} on you!`
                );
            let otherPlayerHP;
            let myHP;
            players[socketRoomNumber].forEach((e: any) => {
                if (e.sid != socket.id) {
                    otherPlayerHP = e.healthPoint;
                } else {
                    myHP = e.healthPoint;
                }
            });
            let sockets: any;
            async function test() {
                sockets = await io.fetchSockets();
            }
            test().then(() => console.log(sockets.length));
            const newStat = calculateSpell(arg.spell, myHP!, otherPlayerHP!);
            players[socketRoomNumber].forEach((e: any) => {
                if (e.sid != socket.id) {
                    e.healthPoint = newStat.otherPlayerHP;
                } else {
                    e.healthPoint = newStat.currentPlayerHP;
                }
            });
            console.log(players);

            console.log(newStat, arg.spell);

            if (newStat.currentPlayerHP <= 0) {
                socket.emit("game-over", false);
                socket.to(`roomId-${socketRoomNumber}`).emit("game-over", true);
            } else if (newStat.otherPlayerHP <= 0) {
                socket.emit("game-over", true);
                socket
                    .to(`roomId-${socketRoomNumber}`)
                    .emit("game-over", false);
            }

            io.to(`roomId-${socketRoomNumber}`).emit(
                "hp-revaluate",
                players[socketRoomNumber]
            );
        }
    });
});

httpServer.listen(8080, () => {
    console.log("Listening on PORT 8080");
});
