import { ActionSchema, SolidityType } from "@stackr/sdk";

export const CastSpellSchema = new ActionSchema("cast-spell", {
    playerId: SolidityType.STRING,
    spellId: SolidityType.STRING,
    timestamp: SolidityType.UINT,
});
