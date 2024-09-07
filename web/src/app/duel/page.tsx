"use client";

import { GameElements } from "@/components/duel/GameElements";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";

let hasOnboarded: any;

export default function Home() {
    const router = useRouter();
    const { ready, authenticated } = usePrivy();

    useEffect(() => {
        hasOnboarded = localStorage.getItem("hasVisited");
    }, []);

    function auth() {
        if (ready) {
            if (authenticated && hasOnboarded) {
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
