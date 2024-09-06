"use client";

import { GameElements } from "@/components/duel/GameElements";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

export default function Home() {
    const router = useRouter();
    const { ready, authenticated } = usePrivy();

    function auth() {
        if (ready) {
            if (authenticated) {
                return <GameElements />;
            } else {
                router.push("/");
            }
        } else {
            return <>Loading...</>;
        }
    }

    return <>{auth()}</>;
}
