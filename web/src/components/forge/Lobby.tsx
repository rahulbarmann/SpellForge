/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { UploadProfile } from "@/components/forge/UploadProfile";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export function Lobby() {
    const router = useRouter();
    const { ready, authenticated, logout } = usePrivy();

    const [isFirstVisit, setIsFirstVisit] = useState(true);

    useEffect(() => {
        const hasVisited = localStorage.getItem("hasVisited");
        if (hasVisited) {
            setIsFirstVisit(false);
        } else {
            router.push("/onboard");
        }
    }, []);

    function LogoutButton() {
        const disableLogout = !ready || (ready && !authenticated);

        return (
            <button
                className="border-4 border-black text-xl p-3 rounded-xl font-bold hover:rounded-2xl hover:bg-black hover:text-[#f3f3f2] transition-all duration-300 ease-in-out"
                disabled={disableLogout}
                onClick={() => {
                    const logoutPromise = logout();
                    toast.promise(logoutPromise, {
                        loading: "Logging You Out",
                        success: "Successfully Logged Out",
                        error: "Error When Logging Out",
                    });
                    router.push("/");
                }}
            >
                Logout
            </button>
        );
    }

    function renderBody() {
        return (
            <div className="flex flex-col grow">
                <div className="flex justify-around mx-4 py-4 rounded-xl bg-[#f3f3f2] border-4 border-black">
                    <LogoutButton />
                    <button
                        className="border-4 border-black text-xl p-3 rounded-xl font-bold hover:rounded-2xl hover:bg-black hover:text-[#f3f3f2] transition-all duration-300 ease-in-out"
                        onClick={() => {
                            router.push("/duel");
                            toast("Get Ready! You Entered A Duel", {
                                icon: "⚔️",
                                duration: 2000,
                                style: {
                                    borderRadius: "10px",
                                    background: "#333",
                                    color: "#fff",
                                },
                            });
                        }}
                    >
                        Start A Duel
                    </button>
                </div>
                <div className="flex-grow flex border-4 border-black m-4 rounded-xl bg-[#f3f3f3] drop-shadow-[2px_2px_1px_rgba(0,0,0,0.45)] hover:drop-shadow-[10px_10px_5px_rgba(0,0,0,0.45)] transition-all duration-300 ease-in-out">
                    <div className="w-1/4 flex items-center justify-center">
                        <div className="text-center border-4 border-black p-4 rounded-xl group hover:bg-black transition-all duration-300 ease-in-out hover:drop-shadow-[5px_5px_1px_rgba(0,0,0,0.45)]">
                            <h2 className="text-2xl font-bold text-black group-hover:text-[#f3f3f2]">
                                Wins
                            </h2>
                            <p className="text-4xl font-bold group-hover:text-[#f3f3f2]">
                                ...
                            </p>
                        </div>
                    </div>
                    <UploadProfile />
                    <div className="w-1/4 flex items-center justify-center">
                        <div className="text-center border-4 border-black p-4 rounded-xl group hover:bg-black transition-all duration-300 ease-in-out hover:drop-shadow-[5px_5px_1px_rgba(0,0,0,0.45)]">
                            <h2 className="text-2xl font-bold text-black group-hover:text-[#f3f3f2]">
                                Losses
                            </h2>
                            <p className="text-4xl font-bold group-hover:text-[#f3f3f2]">
                                ...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!isFirstVisit) {
        return <>{renderBody()}</>;
    }
    return null;
}
