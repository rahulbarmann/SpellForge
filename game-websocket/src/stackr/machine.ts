import { StateMachine } from "@stackr/sdk/machine";
import { SpellForgeState } from "./state";
import * as genesis from "../../genesis-state.json";
import { transitions } from "./transitions";

const gameMachine = new StateMachine({
    id: "spell-forge",
    stateClass: SpellForgeState,
    initialState: genesis as any,
    on: transitions,
});

export { gameMachine };
