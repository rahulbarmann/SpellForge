import { ActionSchema, SolidityType } from "@stackr/sdk";

export const JOIN_ROOM_SCHEMA_ID = "joinRoom";
export const CAST_SPELL_SCHEMA_ID = "castSpell";

export const JoinRoomSchema = new ActionSchema(JOIN_ROOM_SCHEMA_ID, {
    playerId: SolidityType.STRING,
    timestamp: SolidityType.UINT,
});

export const CastSpellSchema = new ActionSchema(CAST_SPELL_SCHEMA_ID, {
    playerId: SolidityType.STRING,
    spellId: SolidityType.STRING,
    roomId: SolidityType.STRING,
    timestamp: SolidityType.UINT,
});
