import { REQUIRE, STF, Transitions } from "@stackr/sdk/machine";
import { SpellForgeState, GameState, Player, Room } from "./state";

const joinRoom: STF<SpellForgeState> = {
    handler: ({ state, inputs }) => {
        const { playerId } = inputs;
        const newState: GameState = JSON.parse(JSON.stringify(state)); // Deep clone the state

        // If there are waiting players, create a new room
        if (newState.waitingPlayers.length > 0) {
            const roomId = `room_${Date.now()}`;
            const player1Id = newState.waitingPlayers.shift()!;
            const player2Id = playerId;

            newState.rooms[roomId] = {
                id: roomId,
                players: [
                    {
                        id: player1Id,
                        hp: 100,
                        spells: [
                            "attack1",
                            "attack2",
                            "heal1",
                            "heal2",
                            "special1",
                        ],
                    },
                    {
                        id: player2Id,
                        hp: 100,
                        spells: [
                            "attack1",
                            "attack2",
                            "heal1",
                            "heal2",
                            "special2",
                        ],
                    },
                ],
                currentTurn: player1Id,
                gameStarted: true,
            };
        } else {
            // If no waiting players, add to waiting list
            newState.waitingPlayers.push(playerId);
        }

        return newState;
    },
};

const castSpell: STF<SpellForgeState> = {
    handler: ({ state, inputs }) => {
        const { playerId, spellId, roomId } = inputs;
        const newState: GameState = JSON.parse(JSON.stringify(state)); // Deep clone the state

        REQUIRE(roomId in newState.rooms, "Room does not exist");

        const room = newState.rooms[roomId];
        REQUIRE(room.gameStarted, "Game has not started");
        REQUIRE(room.currentTurn === playerId, "Not your turn");

        const currentPlayer = room.players.find((p) => p.id === playerId);
        const otherPlayer = room.players.find((p) => p.id !== playerId);

        REQUIRE(
            currentPlayer !== undefined && otherPlayer !== undefined,
            "Player not found"
        );
        REQUIRE(
            currentPlayer!.spells.includes(spellId),
            "Spell not in inventory"
        );

        // Implement spell effects here. This is a simplified example:
        if (spellId.startsWith("attack")) {
            otherPlayer!.hp = Math.max(otherPlayer!.hp - 10, 0);
        } else if (spellId.startsWith("heal")) {
            currentPlayer!.hp = Math.min(currentPlayer!.hp + 10, 100);
        }

        // Switch turns
        room.currentTurn = otherPlayer!.id;

        return newState;
    },
};

export const transitions: Transitions<SpellForgeState> = {
    joinRoom,
    castSpell,
};

console.log("Transitions:", transitions);
