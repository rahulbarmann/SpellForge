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
import { useRouter } from "next/navigation";
import { useAction } from "@/hooks/useAction";
import { getState } from "@/api/api";
import { clearInterval } from "timers";

export default function Home() {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");
    const [currentPlayerHP, setCurrentPlayerHP] = useState(100);
    const [otherPlayerHP, setOtherPlayerHP] = useState(100);
    const { submit } = useAction();
    const [fetching, setFetching] = useState(true);
    const [value, setValue] = useState<any>();
    const [playerNumber, setPlayerNumber] = useState();

    const router = useRouter();

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

        socket.on("playerNumber", (playerNumber) => {
            setPlayerNumber(playerNumber);
        });

        socket.on("alert", (value) => alert(value));

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

        socket.on("game-over", (isWinner) => {
            if (isWinner) alert("Congrats, You won the Duel!");
            else alert("You were Defeated!");
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const getInitialValue = async () => {
            try {
                setFetching(true);
                const res = await getState();
                setValue(res);
            } catch (e) {
                alert((e as Error).message);
                console.error(e);
            } finally {
                setFetching(false);
            }
        };
        getInitialValue();
    }, []);

    useEffect(() => {
        const clock = setInterval(async () => {
            await reloadState();
        }, 1000);
        return () => {
            clearInterval(clock);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const reloadState = async () => {
        const response = await getState();
        setValue(response);
    };

    const handleAction = async (actionName: string) => {
        try {
            const res = await submit(actionName, {
                playerId: playerNumber,
                spellId: "attack1",
                timestamp: Date.now(),
            });
            if (!res) {
                throw new Error("Failed to submit action");
            }
        } catch (e) {
            alert((e as Error).message);
            console.error(e);
        }
    };

    const renderBody = () => {
        return (
            <div className="flex gap-4">
                Your HP:{" "}
                {playerNumber == "player1"
                    ? value.state.player1.hp
                    : value.state.player2.hp}
                <br />
                Opponents HP:{" "}
                {playerNumber != "player1"
                    ? value.state.player1.hp
                    : value.state.player2.hp}
            </div>
        );
    };

    return (
        <div className="flex flex-col justify-evenly">
            <div>
                <code className="mx-4"></code>
                <div>{fetching ? "fetching..." : renderBody()}</div>
            </div>
            <br />
            <br />
            <br />
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
                    handleAction("castSpell");
                }}
            >
                Use Spell 1 (Fireball)
            </button>
        </div>
    );
}
