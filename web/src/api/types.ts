import { BlockStatus, DA } from "@/lib/constants";

export interface Schema {
    primaryType: string;
    types: {
        [key: string]: {
            name: string;
            type: string;
        }[];
    };
}

export interface Domain {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: `0x${string}`;
    salt: ArrayBuffer;
}

export type DAMetadata = Record<
    DA,
    {
        blockHeight: number;
        extIdx?: number;
        txHash?: string;
        commitment?: string;
    }
>;

export interface MRUAction {
    name: string;
    hash: string;
    payload: any;
    msgSender: string;
    blockInfo: {
        status: BlockStatus;
        daMetadata: DAMetadata;
        l1TxHash: string | null;
    } | null;
}

export interface MRUInfo {
    isSandbox: boolean;
    domain: {
        name: string;
        version: string;
        chainId: number;
        verifyingContract: string;
    };
    schemas: {
        [key: string]: {
            primaryType: string;
            types: {
                [key: string]: { name: string; type: string }[];
            };
        };
    };
    transitionToSchema: {
        [key: string]: string;
    };
}

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
    rooms: {
        [roomId: string]: Room;
    };
    waitingPlayers: string[];
}
