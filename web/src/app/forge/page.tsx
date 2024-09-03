"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { getState } from "@/api/api";
import { ActionLogs } from "@/components/action-logs";

export default function Forge() {
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

    // useEffect(() => {
    //     const init = async () => {
    //         try {
    //             // await web3auth.initModal();
    //             // setProvider(web3auth.provider);
    //             // if (web3auth.connected) {
    //             //     setLoggedIn(true);
    //             // }
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };

    //     init();
    // }, []);

    function LogoutButton() {
        const { ready, authenticated, logout } = usePrivy();
        const disableLogout = !ready || (ready && !authenticated);

        return (
            <button
                disabled={disableLogout}
                onClick={async () => {
                    await logout();
                    router.push("/");
                }}
            >
                Log out
            </button>
        );
    }

    return (
        <div className="flex flex-col justify-around">
            <LogoutButton />
            <button
                onClick={() => {
                    router.push("/duel");
                }}
            >
                Play
            </button>
            {fetching ? "fetching..." : JSON.stringify(value)}
        </div>
    );
}
