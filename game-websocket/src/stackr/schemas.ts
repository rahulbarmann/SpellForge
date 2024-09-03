import { ActionSchema, SolidityType } from "@stackr/sdk";

export const CAST_SPELL_SCHEMA_ID = "castSpell";

export const CastSpellSchema = new ActionSchema(CAST_SPELL_SCHEMA_ID, {
    playerId: SolidityType.STRING,
    spellId: SolidityType.STRING,
    timestamp: SolidityType.UINT,
});
