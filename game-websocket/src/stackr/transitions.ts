import { REQUIRE, STF, Transitions } from "@stackr/sdk/machine";
import { SpellForgeState, GameState, Player } from "./state";
import { CAST_SPELL_SCHEMA_ID } from "./schemas";

const castSpell: STF<SpellForgeState> = {
    handler: ({ state, inputs }) => {
        const { playerId, spellId } = inputs;
        REQUIRE(state.currentTurn === playerId, "Not your turn");

        const newState = { ...state };
        const currentPlayer = newState[playerId as keyof GameState] as Player;
        const otherPlayer = newState[
            playerId === "player1" ? "player2" : "player1"
        ] as Player;

        REQUIRE(
            currentPlayer.spells.includes(spellId),
            "Spell not in inventory"
        );

        if (spellId === "QmWo2xCgVsFG6xy7Qzz5BeEHhJjWo3krN6FwfQxPDD9EA3") {
            otherPlayer.hp = Math.max(otherPlayer.hp - 120, 0);
        } else if (
            spellId === "QmYUw5X9U2BTgqgaZF6TCJX9TzzDuBdpuAZif5DVZrYxsT"
        ) {
            otherPlayer.hp = Math.max(otherPlayer.hp - 80, 0);
        } else if (
            spellId === "QmYAFE4UUgYdXkbMzFpZmKHM4i2MB4k3HT6qE2rum2dZy2"
        ) {
            otherPlayer.hp = Math.max(otherPlayer.hp - 70, 0);
        } else if (
            spellId === "QmPMgn9MLESu14yJWmRXUXHxpVjPV9CxDmZy2kzVLN8Dwd"
        ) {
            currentPlayer.hp = Math.min(currentPlayer.hp + 50, 1000);
        } else if (
            spellId === "QmZ1u37HnSj8g5wWTwNdTzFKNMSVjpckLaiSN2R1MjWdai"
        ) {
            otherPlayer.hp = Math.max(otherPlayer.hp - 140, 0);
        } else if (
            spellId === "QmZWJDUKemrvwrT5CB3J3VP99JYBsWVWjFmrDxcVbdWfGX"
        ) {
            currentPlayer.hp = Math.min(currentPlayer.hp + 90, 1000);
        } else if (
            spellId === "QmeSJdjdw6NmrKPSjZZexQbUeNvEJFTSXLPgqjWakAWeFE"
        ) {
            otherPlayer.hp = Math.max(otherPlayer.hp - 100, 0);
        }

        // Switch turns
        newState.currentTurn =
            newState.currentTurn === "player1" ? "player2" : "player1";

        return newState;
    },
};

export const transitions: Transitions<SpellForgeState> = {
    [CAST_SPELL_SCHEMA_ID]: castSpell,
};

console.log("Transitions:", transitions);
