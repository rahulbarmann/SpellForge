import { MicroRollup } from "@stackr/sdk";
import { stackrConfig } from "../../stackr.config";
import { CastSpellSchema } from "./schemas";
import { gameMachine } from "./machine";

const mru = await MicroRollup({
    config: stackrConfig,
    actionSchemas: [CastSpellSchema],
    stateMachines: [gameMachine],
});

await mru.init();

export { mru };
