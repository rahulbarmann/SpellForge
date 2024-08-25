"use client";

import { web3auth } from "../../api/auth";
import { IProvider } from "@web3auth/base";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Forge() {
    const [provider, setProvider] = useState<IProvider | null>(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            try {
                // await web3auth.initModal();
                setProvider(web3auth.provider);

                if (web3auth.connected) {
                    setLoggedIn(true);
                }
            } catch (error) {
                console.error(error);
            }
        };

        init();
    }, []);

    const logout = async () => {
        await web3auth.logout();
        setProvider(null);
        setLoggedIn(false);
    };

    return (
        <div>
            <button
                onClick={async () => {
                    await logout();
                    router.push("/");
                }}
            >
                Logout
            </button>
        </div>
    );
}
