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

let players: any = [];

io.on("connection", (socket) => {
    console.log("New User connected with Socket ID:", socket.id);

    socket.broadcast.emit("other-player", `Player ${socket.id} joined!`);
    players.push({
        username: socket.id,
        healthPoint: 100,
        cards: ["fireball", "holylight"],
    });

    socket.on("use-spell", (arg) => {
        socket.broadcast.emit(
            "other-player",
            `Player ${arg.username} used the spell ${arg.spell} on you!`
        );
        let otherPlayerHP;
        let myHP;
        players.forEach((e: any) => {
            if (e.username != socket.id) {
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
        players.forEach((e: any) => {
            if (e.username != socket.id) {
                e.healthPoint = newStat.otherPlayerHP;
            } else {
                e.healthPoint = newStat.currentPlayerHP;
            }
        });
        console.log(players);

        console.log(newStat, arg.spell);
        io.emit("hp-revaluate", players);
    });
});

httpServer.listen(8080, () => {
    console.log("Listening on PORT 8080");
});
