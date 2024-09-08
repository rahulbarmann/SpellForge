/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useEffect, useState } from "react";
import { socket } from "../../socket";
import { useAction } from "@/hooks/useAction";
import { getState } from "@/api/api";
import { HealthBar } from "./HealthBar";

export function GameElements() {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");
    const [currentPlayerHP, setCurrentPlayerHP] = useState(1000);
    const [otherPlayerHP, setOtherPlayerHP] = useState(1000);
    const { submit } = useAction();
    const [fetching, setFetching] = useState(true);
    const [value, setValue] = useState<any>();
    const [playerNumber, setPlayerNumber] = useState();

    useEffect(() => {
        if (socket.connected) {
            onConnect();
        }

        const timeout = setTimeout(() => {
            socket.emit("getPlayerNumber");
        }, 100);

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
        socket.on("disconnect", onDisconnect);
        socket.on("create-room", (value) => {
            alert(value);
        });
        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            clearTimeout(timeout);
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
        const clock = setInterval(reloadState, 1000);

        return () => {
            clearInterval(clock);
        };
    }, [value]);

    const reloadState = async () => {
        const response = await getState();

        if (JSON.stringify(response) !== JSON.stringify(value)) {
            setValue(response);
        }
    };

    const handleAction = async (actionName: string, spellId: string) => {
        try {
            const res = await submit(actionName, {
                playerId: playerNumber,
                spellId,
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

    const spellsOwnedArr = [
        "QmWo2xCgVsFG6xy7Qzz5BeEHhJjWo3krN6FwfQxPDD9EA3",
        "QmYUw5X9U2BTgqgaZF6TCJX9TzzDuBdpuAZif5DVZrYxsT",
        "QmYAFE4UUgYdXkbMzFpZmKHM4i2MB4k3HT6qE2rum2dZy2",
        "QmPMgn9MLESu14yJWmRXUXHxpVjPV9CxDmZy2kzVLN8Dwd",
        "QmZ1u37HnSj8g5wWTwNdTzFKNMSVjpckLaiSN2R1MjWdai",
    ];

    const HealthBar = ({ health }: any) => {
        return (
            <div className="w-full h-8 border-2 border-black bg-white rounded mb-2">
                <div
                    className={`h-full rounded transition-all duration-300 ease-in-out bg-black`}
                    style={{
                        width: `${health / 10}%`,
                        transitionProperty: "width", // Ensure width transition is included
                    }}
                ></div>
            </div>
        );
    };

    const Panel = ({ label, health }: any) => {
        return (
            <div className="w-5/12 h-full border-4 border-black rounded-lg flex flex-col justify-between p-4">
                <div>
                    <HealthBar health={health} />
                    <h1 className="text-center">{health}</h1>
                </div>
                <div className="text-2xl font-bold">{label}</div>
                <div className="flex justify-between">
                    {label === "Opponent" ? (
                        ""
                    ) : (
                        <>
                            {spellsOwnedArr.map((e, i) => (
                                <div
                                    key={i}
                                    className="w-1/5 border-2 h-28 m-1 border-black rounded overflow-hidden transition-all duration-300 ease-in-out cursor-pointer hover:bg-black"
                                    onClick={() => {
                                        socket.emit("use-spell", {
                                            username: socket.id,
                                            spell: "fireball",
                                            currentHP: currentPlayerHP,
                                        });
                                        handleAction("castSpell", e);
                                    }}
                                >
                                    <img
                                        src={`https://black-just-toucan-396.mypinata.cloud/ipfs/${e}`}
                                        className="w-full h-full object-cover transition-all duration-300 ease-in-out hover:opacity-0"
                                    />
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        );
    };

    function page() {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-white text-black">
                <div className="w-full h-3/4 rounded-lg p-4 flex justify-between">
                    {fetching ? (
                        ""
                    ) : (
                        <>
                            <Panel
                                label="You"
                                health={
                                    playerNumber == "player1"
                                        ? value.state.player1.hp
                                        : value.state.player2.hp
                                }
                            />
                            <Panel
                                label="Opponent"
                                health={
                                    playerNumber != "player1"
                                        ? value.state.player1.hp
                                        : value.state.player2.hp
                                }
                            />
                        </>
                    )}
                </div>
            </div>
        );
    }

    return <>{page()}</>;
}

{
    /* <>
<div className="flex flex-col justify-evenly">
    <div>
        PLAYER ID: {playerNumber}
        <code className="mx-4"></code>
        <div>{fetching ? "fetching..." : renderBody()}</div>
    </div>
    <br />
    <br />
    <br />
    <p>Status: {isConnected ? "connected" : "disconnected"}</p>
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
</> */
}
