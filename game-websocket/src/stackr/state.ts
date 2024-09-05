import { BytesLike, State } from "@stackr/sdk/machine";
import { solidityPackedKeccak256 } from "ethers";

export interface Player {
    id: string;
    hp: number;
    spells: string[];
}

export interface Room {
    id: string;
    players: Player[];
    currentTurn: string | null;
    gameStarted: boolean;
}

export interface GameState {
    rooms: { [roomId: string]: Room };
    waitingPlayers: string[];
}

export class SpellForgeState extends State<GameState> {
    constructor(state: GameState) {
        super(state);
    }

    getRootHash(): BytesLike {
        const roomHashes = Object.values(this.state.rooms).map((room) =>
            solidityPackedKeccak256(
                [
                    "string",
                    "string[]",
                    "uint256[]",
                    "string[][]",
                    "string",
                    "bool",
                ],
                [
                    room.id,
                    room.players.map((p) => p.id),
                    room.players.map((p) => p.hp),
                    room.players.map((p) => p.spells),
                    room.currentTurn || "",
                    room.gameStarted,
                ]
            )
        );

        return solidityPackedKeccak256(
            ["bytes32[]", "string[]"],
            [roomHashes, this.state.waitingPlayers]
        );
    }
}
