/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { SpellSelection } from "@/components/forge/SpellSelection";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";

let hasVisited: any;

export default function Onboard() {
    const { ready, authenticated } = usePrivy();

    const [loaded, setLoaded] = useState(false);

    const router = useRouter();
    useEffect(() => {
        hasVisited = localStorage.getItem("hasVisited");
        setLoaded(true);
    }, []);

    if (hasVisited) {
        router.push("/forge");
    }
    if (ready) {
        if (authenticated) {
            if (!loaded) return null;
            else return <SpellSelection />;
        } else {
            router.push("/");
        }
    } else {
        return <>Loading...</>;
    }
}
