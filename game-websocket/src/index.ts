import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { calculateSpell } from "./spells/spell-mechanics";

import { ActionConfirmationStatus } from "@stackr/sdk";
import { gameMachine } from "./stackr/machine";
import { mru } from "./stackr/mru";
import { CastSpellSchema } from "./stackr/schemas";
import { transitions } from "./stackr/transitions";

const app = express();

// *********************************** Stackr *******************************************

app.use(express.json());
// allow CORS
app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

const { stateMachines, config, getStfSchemaMap, submitAction } = mru;
const machine = stateMachines.getFirst<typeof gameMachine>();

if (!machine) {
    throw new Error("Machine not found");
}

const transitionToSchema = getStfSchemaMap();

/** Routes */
app.get("/info", (_req: Request, res: Response) => {
    res.send({
        isSandbox: config.isSandbox,
        domain: config.domain,
        transitionToSchema,
        schemas: Object.values(CastSpellSchema).reduce((acc, schema) => {
            acc[schema.identifier] = {
                primaryType: schema.EIP712TypedData.primaryType,
                types: schema.EIP712TypedData.types,
            };
            return acc;
        }, {} as Record<string, any>),
    });
});

app.post("/:transition", async (req: Request, res: Response) => {
    const { transition } = req.params;

    if (!transitions[transition]) {
        res.status(400).send({ message: "NO_TRANSITION_FOR_ACTION" });
        return;
    }

    try {
        const { msgSender, signature, inputs } = req.body;

        const schemaId = transitionToSchema[transition];
        const schema = Object.values(CastSpellSchema).find(
            (schema) => schema.identifier === schemaId
        );

        if (!schema) {
            throw new Error("NO_SCHEMA_FOUND");
        }

        const signedAction = schema.actionFrom({
            msgSender,
            signature,
            inputs,
        });

        const ack = await submitAction(transition, signedAction);
        const { logs, errors } = await ack.waitFor(ActionConfirmationStatus.C1);
        if (errors?.length) {
            throw new Error(errors[0].message);
        }
        res.status(201).send({ logs, ackHash: ack.hash });
    } catch (e: any) {
        res.status(400).send({ error: e.message });
    }
    return;
});

app.get("/", (_req: Request, res: Response) => {
    res.json({ state: machine.state });
});

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
