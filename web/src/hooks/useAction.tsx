import { useLogs } from "@/context/logs.context";
import { LOG_TYPE } from "@/lib/constants";
import { usePrivy } from "@privy-io/react-auth";
import { submitAction } from "../api/api";
import { useMruInfo } from "./useMruInfo";

export const useAction = () => {
    const { user, signTypedData } = usePrivy();
    const { mruInfo } = useMruInfo();
    const { addLog } = useLogs();

    const submit = async (transition: string, payload: any) => {
        if (!mruInfo || !user?.wallet) {
            throw new Error("MRU info or user wallet not available");
        }

        const inputs = { ...payload };
        const { transitionToSchema, domain, schemas } = mruInfo;
        const msgSender = user.wallet.address;
        const schemaName = transitionToSchema[transition];

        if (!schemaName) {
            throw new Error(`No schema found for transition: ${transition}`);
        }

        const schema = schemas[schemaName];

        if (!schema) {
            throw new Error(`Schema not found for: ${schemaName}`);
        }

        try {
            const signature = await signTypedData({
                domain,
                types: schema.types,
                primaryType: schema.primaryType,
                message: inputs,
            });

            addLog({
                type: LOG_TYPE.REQUEST,
                time: Date.now(),
                value: {
                    transitionName: transition,
                    payload: { inputs, msgSender, signature },
                },
            });

            const response = await submitAction(transition, {
                msgSender,
                signature,
                inputs,
            });

            addLog({
                type: LOG_TYPE.C0_RESPONSE,
                time: Date.now(),
                value: { acknowledgementHash: response.ackHash },
            });

            addLog({
                type: LOG_TYPE.C1_RESPONSE,
                time: Date.now(),
                value: { logs: response.logs },
            });

            return response;
        } catch (e) {
            addLog({
                type: LOG_TYPE.ERROR,
                time: Date.now(),
                value: { message: (e as Error).message },
            });
            throw e;
        }
    };

    return { submit };
};
