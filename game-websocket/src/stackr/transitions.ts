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

        // Implement spell effects here. This is a simplified example:
        if (spellId.startsWith("attack")) {
            otherPlayer.hp = Math.max(otherPlayer.hp - 10, 0);
        } else if (spellId.startsWith("heal")) {
            currentPlayer.hp = Math.min(currentPlayer.hp + 10, 100);
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
