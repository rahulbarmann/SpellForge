import { MicroRollup } from "@stackr/sdk";
import { stackrConfig } from "../../stackr.config";
import { CastSpellSchema, CAST_SPELL_SCHEMA_ID } from "./schemas";
import { gameMachine } from "./machine";

export const initializeMRU = async () => {
    console.log("Initializing MicroRollup...");
    console.log("CastSpellSchema:", CastSpellSchema);
    console.log("CAST_SPELL_SCHEMA_ID:", CAST_SPELL_SCHEMA_ID);

    const mru = await MicroRollup({
        config: stackrConfig,
        actionSchemas: [CastSpellSchema],
        stateMachines: [gameMachine],
    });

    console.log("MicroRollup created, initializing...");
    await mru.init();
    console.log("MicroRollup initialized successfully");

    const stfSchemaMap = mru.getStfSchemaMap();
    console.log("STF Schema Map:", JSON.stringify(stfSchemaMap, null, 2));

    return mru;
};
