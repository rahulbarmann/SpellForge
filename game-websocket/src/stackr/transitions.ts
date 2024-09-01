import { REQUIRE, STF, Transitions } from "@stackr/sdk/machine";
import { SpellForgeState, GameState, Player } from "./state";

const castSpell: STF<SpellForgeState> = {
    handler: ({ state, action }) => {
        const { playerId, spellId } = action.payload;
        REQUIRE(state.currentTurn === playerId, "Not your turn");

        const currentPlayer = state[playerId as keyof GameState] as Player;
        const otherPlayer = state[
            playerId === "player1" ? "player2" : "player1"
        ] as Player;

        REQUIRE(
            currentPlayer.spells.includes(spellId),
            "Spell not in inventory"
        );

        // Implement spell effects here. This is a simplified example:
        if (spellId.startsWith("attack")) {
            otherPlayer.hp -= 10;
        } else if (spellId.startsWith("heal")) {
            currentPlayer.hp = Math.min(currentPlayer.hp + 10, 100);
        }

        // Switch turns
        state.currentTurn =
            state.currentTurn === "player1" ? "player2" : "player1";

        return state;
    },
};

export const transitions: Transitions<SpellForgeState> = {
    castSpell,
};
