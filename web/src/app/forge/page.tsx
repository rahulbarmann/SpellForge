"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

export default function Forge() {
    const router = useRouter();

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
        </div>
    );
}
