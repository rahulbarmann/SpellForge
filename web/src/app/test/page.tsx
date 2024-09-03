"use client";

import { useAction } from "@/hooks/useAction";
import { getState } from "@/api/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
    const { submit } = useAction();
    const [fetching, setFetching] = useState(true);
    const [value, setValue] = useState<any>();
    const router = useRouter();

    useEffect(() => {
        const getInitialValue = async () => {
            try {
                setFetching(true);
                const res = await getState();
                setValue(res);
            } catch (e) {
                alert((e as Error).message);
                console.error(e);
            } finally {
                setFetching(false);
            }
        };
        getInitialValue();
    }, []);

    const handleAction = async (actionName: string) => {
        try {
            const res = await submit(actionName, {
                playerId: "player1",
                spellId: "attack1",
                timestamp: Date.now(),
            });
            if (!res) {
                throw new Error("Failed to submit action");
            }
        } catch (e) {
            alert((e as Error).message);
            console.error(e);
        }
    };

    const renderBody = () => {
        return (
            <div className="flex gap-4">
                <button onClick={() => handleAction("castSpell")}>
                    Spell 1 (fireball)
                </button>
            </div>
        );
    };

    return (
        <div>
            <code className="mx-4">
                {fetching ? "fetching..." : JSON.stringify(value)}
            </code>
            <div>{fetching ? "fetching..." : renderBody()}</div>
        </div>
    );
}
