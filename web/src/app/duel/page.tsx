// import { Player } from "@/components/duel/Player";

// export default function Duel() {
//     return (
//         <div className="flex justify-around">
//             <Player
//                 currenteffects={[]}
//                 healthpoints={100}
//                 ownedSpells={["bankai", "sharingan", "kamehameha"]}
//             />
//             <Player
//                 currenteffects={[]}
//                 healthpoints={100}
//                 ownedSpells={[
//                     "domain expansion",
//                     "gomu gomu no",
//                     "hinokami kagura",
//                 ]}
//             />
//         </div>
//     );
// }

"use client";

import { useEffect, useState } from "react";
import { socket } from "../../socket";

export default function Home() {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");
    const [currentPlayerHP, setCurrentPlayerHP] = useState(100);
    const [otherPlayerHP, setOtherPlayerHP] = useState(100);

    useEffect(() => {
        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            setIsConnected(true);
            setTransport(socket.io.engine.transport.name);

            socket.io.engine.on("upgrade", (transport) => {
                setTransport(transport.name);
            });
        }

        function onDisconnect() {
            setIsConnected(false);
            setTransport("N/A");
        }

        socket.on("other-player", (msg) => {
            alert(msg);
        });
        socket.on("hp-revaluate", (value) => {
            value.forEach((e: any) => {
                if (e.username == socket.id) {
                    setCurrentPlayerHP(e.healthPoint);
                } else {
                    setOtherPlayerHP(e.healthPoint);
                }
            });
        });

        socket.on("connect", onConnect);
        socket.on("connection", (messgae) => {
            alert(messgae);
        });
        socket.on("disconnect", onDisconnect);
        socket.on("create-room", (value) => {
            alert(value);
        });
        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    }, []);

    return (
        <div className="flex flex-col justify-evenly">
            <p>Status: {isConnected ? "connected" : "disconnected"}</p>
            <p>Transport: {transport}</p>
            <button
                onClick={() => {
                    socket.emit("join-server", socket.id);
                }}
            >
                Play
            </button>
            <button
                onClick={() => {
                    socket.emit("use-spell", {
                        username: socket.id,
                        spell: "fireball",
                        currentHP: currentPlayerHP,
                    });
                }}
            >
                Use Spell 1 (Fireball)
            </button>
            Your HP: {currentPlayerHP} <br />
            Opponents HP: {otherPlayerHP}
        </div>
    );
}
