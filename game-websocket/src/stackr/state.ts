import { BytesLike, State } from "@stackr/sdk/machine";
import { solidityPackedKeccak256 } from "ethers";

export interface Player {
    hp: number;
    spells: string[];
}

export interface GameState {
    player1: Player;
    player2: Player;
    currentTurn: "player1" | "player2";
}

export class SpellForgeState extends State<GameState> {
    constructor(state: GameState) {
        super(state);
    }

    getRootHash(): BytesLike {
        return solidityPackedKeccak256(
            ["uint256", "uint256", "string[]", "string[]", "string"],
            [
                this.state.player1.hp,
                this.state.player2.hp,
                this.state.player1.spells,
                this.state.player2.spells,
                this.state.currentTurn,
            ]
        );
    }
}
