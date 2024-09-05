import { urlJoin } from "@/lib/utils";
import { MRUInfo, GameState } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

const get = async <T>(path = ""): Promise<T> => {
    const res = await fetch(urlJoin(BASE_URL, path));
    if (!res.ok) {
        throw new Error(`Failed to fetch ${path}`);
    }
    return res.json();
};

const getInfo = async (): Promise<MRUInfo> => {
    return get<MRUInfo>("info");
};

const getState = async (): Promise<GameState> => {
    return get<GameState>();
};

const submitAction = async (
    transition: string,
    data: any
): Promise<{ logs: any[]; ackHash: string }> => {
    const res = await fetch(urlJoin(BASE_URL, transition), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok) {
        throw new Error(json.error || `Failed to submit action: ${transition}`);
    }
    return json;
};

export { getInfo, getState, submitAction };
