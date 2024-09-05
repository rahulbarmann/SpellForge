/* eslint-disable react/no-unescaped-entities */
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
import { GameState } from "@/api/types";

export default function Home() {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [playerId, setPlayerId] = useState<string | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null);
    const { submit } = useAction();
    const [fetching, setFetching] = useState(true);

    const router = useRouter();

    useEffect(() => {
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

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("playerId", (id) => setPlayerId(id));
        socket.on("joinedRoom", (id) => setRoomId(id));
        socket.on("gameUpdate", (state) => setGameState(state));

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("playerId");
            socket.off("joinedRoom");
            socket.off("gameUpdate");
        };
    }, []);

    useEffect(() => {
        const getInitialState = async () => {
            try {
                setFetching(true);
                const state = await getState();
                setGameState(state);
            } catch (e) {
                alert((e as Error).message);
                console.error(e);
            } finally {
                setFetching(false);
            }
        };
        getInitialState();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(async () => {
            if (roomId) {
                const state = await getState();
                setGameState(state);
            }
        }, 1000);
        return () => clearInterval(intervalId);
    }, [roomId]);

    const handleJoinRoom = async () => {
        if (!playerId) {
            console.error("Player ID is not set");
            return;
        }

        try {
            console.log("Attempting to join room for player:", playerId);
            const res: any = await submit("joinRoom", {
                playerId: playerId,
                timestamp: Date.now(),
            });
            console.log("Join room response:", res);
            if (!res) {
                throw new Error("Failed to join room");
            }
            // The roomId should be returned in the response. Adjust as necessary.
            if (res.roomId) {
                setRoomId(res.roomId);
                socket.emit("joinRoom", { playerId, roomId: res.roomId });
            } else {
                console.warn("Room ID not returned in response");
            }
        } catch (e) {
            console.error("Error joining room:", e);
            alert((e as Error).message);
        }
    };

    const handleCastSpell = async (spellId: string) => {
        if (!roomId || !playerId) return;
        try {
            const res = await submit("castSpell", {
                playerId: playerId,
                spellId: spellId,
                roomId: roomId,
                timestamp: Date.now(),
            });
            if (!res) {
                throw new Error("Failed to cast spell");
            }
            socket.emit("castSpell", { roomId, playerId, spellId });
        } catch (e) {
            alert((e as Error).message);
            console.error(e);
        }
    };

    const renderGameState = () => {
        if (!gameState || !roomId || !playerId) return null;

        const room = gameState.rooms[roomId];
        if (!room) return <p>Waiting for game to start...</p>;

        const player = room.players.find((p: any) => p.id === playerId);
        const opponent = room.players.find((p: any) => p.id !== playerId);

        if (!player || !opponent) return <p>Player information not found</p>;

        return (
            <div className="flex flex-col gap-4">
                <p>Room ID: {roomId}</p>
                <p>Your HP: {player.hp}</p>
                <p>Opponent's HP: {opponent.hp}</p>
                <p>
                    Current Turn:{" "}
                    {room.currentTurn === playerId
                        ? "Your Turn"
                        : "Opponent's Turn"}
                </p>
                <div className="flex gap-2">
                    {player.spells.map((spell: any, index: any) => (
                        <button
                            key={index}
                            onClick={() => handleCastSpell(spell)}
                            disabled={room.currentTurn !== playerId}
                        >
                            Cast {spell}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">Spell Forge</h1>
            <p>Status: {isConnected ? "Connected" : "Disconnected"}</p>
            <p>Transport: {transport}</p>
            <p>Player ID: {playerId || "Not set"}</p>
            {!roomId && (
                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={handleJoinRoom}
                    disabled={!isConnected || !playerId}
                >
                    Join Game
                </button>
            )}
            {fetching ? <p>Loading game state...</p> : renderGameState()}
        </div>
    );
}
