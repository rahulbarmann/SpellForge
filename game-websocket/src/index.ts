// THIS IS THE index.ts FILE:

import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { calculateSpell } from "./spells/spell-mechanics";

import { ActionConfirmationStatus } from "@stackr/sdk";
import { gameMachine } from "./stackr/machine";
import { transitions } from "./stackr/transitions";
import cors from "cors";

import {
    JOIN_ROOM_SCHEMA_ID,
    CAST_SPELL_SCHEMA_ID,
    JoinRoomSchema,
    CastSpellSchema,
} from "./stackr/schemas";
import { initializeMRU } from "./stackr/mru";

const app = express();
app.use(express.json());
app.use(cors());

let mru: any;

(async () => {
    try {
        console.log("Initializing MRU...");
        mru = await initializeMRU();
        console.log("MRU initialized successfully");

        const { stateMachines, config, getStfSchemaMap, submitAction } = mru;
        const machine = stateMachines.getFirst();

        if (!machine) {
            throw new Error("Machine not found");
        }

        console.log("Getting STF schema map...");
        let transitionToSchema = getStfSchemaMap();
        console.log(
            "TransitionToSchema:",
            JSON.stringify(transitionToSchema, null, 2)
        );

        // If transitionToSchema is empty or missing joinRoom, set it manually
        if (!transitionToSchema[JOIN_ROOM_SCHEMA_ID]) {
            console.log("Adding joinRoom to TransitionToSchema");
            transitionToSchema[JOIN_ROOM_SCHEMA_ID] = JOIN_ROOM_SCHEMA_ID;
        }

        app.get("/info", (_req: Request, res: Response) => {
            console.log("Handling /info request");
            const response = {
                isSandbox: config.isSandbox,
                domain: config.domain,
                schemas: {
                    [JOIN_ROOM_SCHEMA_ID]: {
                        primaryType: JoinRoomSchema.EIP712TypedData.primaryType,
                        types: JoinRoomSchema.EIP712TypedData.types,
                    },
                    [CAST_SPELL_SCHEMA_ID]: {
                        primaryType:
                            CastSpellSchema.EIP712TypedData.primaryType,
                        types: CastSpellSchema.EIP712TypedData.types,
                    },
                },
                transitionToSchema,
            };
            console.log("Info response:", JSON.stringify(response, null, 2));
            res.send(response);
        });

        app.post("/:transition", async (req: Request, res: Response) => {
            const { transition } = req.params;
            console.log(`Handling /${transition} request`);
            console.log("Request body:", JSON.stringify(req.body, null, 2));

            if (!transitions[transition]) {
                console.log(`No transition found for action: ${transition}`);
                res.status(400).send({ message: "NO_TRANSITION_FOR_ACTION" });
                return;
            }

            try {
                const { msgSender, signature, inputs } = req.body;
                console.log("Message Sender:", msgSender);
                console.log("Signature:", signature);
                console.log("Inputs:", JSON.stringify(inputs, null, 2));

                let schema;
                if (transition === "joinRoom") {
                    schema = JoinRoomSchema;
                } else if (transition === "castSpell") {
                    schema = CastSpellSchema;
                } else {
                    throw new Error("Invalid transition");
                }

                console.log("Creating signed action...");
                const signedAction = schema.actionFrom({
                    msgSender,
                    signature,
                    inputs,
                });
                console.log("Signed action created successfully");

                console.log("Submitting action...");
                const ack = await mru.submitAction(transition, signedAction);
                console.log("Action submitted successfully");

                console.log("Waiting for action confirmation...");
                const { logs, errors } = await ack.waitFor(
                    ActionConfirmationStatus.C1
                );
                console.log("Action confirmation received");

                if (errors?.length) {
                    console.log("Errors found:", errors);
                    res.status(400).send({ error: errors[0].message });
                    return;
                }

                console.log("Sending successful response");
                res.status(201).send({ logs, ackHash: ack.hash });
            } catch (e: any) {
                console.error("Error in transition:", e);
                res.status(400).send({ error: e.message });
            }
        });

        app.get("/", (_req: Request, res: Response) => {
            console.log("Handling / request");
            res.json({ state: machine.state });
        });
    } catch (error) {
        console.error("Error during server initialization:", error);
    }
})();

// *********************************** Stackr *******************************************

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

    const playerNumber =
        players[roomNumber].length == 0 ? "player1" : "player2";

    socket.emit("playerNumber", playerNumber);

    players[roomNumber].push({
        username: socket.id,
        sid: socket.id,
        playerNumber,
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

        if (
            numberOfSockets % 2 != 0 ||
            subArr[0].lastPlayed === true ||
            (subArr[0].playerNumber == "player2" &&
                subArr[0].healthPoint == 100)
        ) {
            // socket.emit("alert", "Wait For Your Opponent's Turn!");
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
console.log("glhf1");

httpServer.listen(8080, () => {
    console.log("Listening on PORT 8080");
});
