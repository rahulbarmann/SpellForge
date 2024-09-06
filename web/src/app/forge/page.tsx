"use client";

import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { Lobby } from "@/components/forge/Lobby";

export default function Forge() {
    const router = useRouter();
    const { ready, authenticated } = usePrivy();

    function auth() {
        if (ready) {
            if (authenticated) {
                return <Lobby />;
            } else {
                router.push("/");
            }
        } else {
            return <>Loading...</>;
        }
    }

    return <>{auth()}</>;
}
