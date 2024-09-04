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
                className="border-4 border-black text-xl p-3 rounded-xl font-bold hover:rounded-2xl hover:bg-black hover:text-[#f3f3f2] transition-all duration-300 ease-in-out"
                disabled={disableLogout}
                onClick={async () => {
                    await logout();
                    router.push("/");
                }}
            >
                Logout
            </button>
        );
    }

    return (
        <div className="flex flex-col grow">
            <div className="flex justify-around mx-4 py-4 rounded-xl bg-[#f3f3f2] border-4 border-black">
                <LogoutButton />
                <button
                    className="border-4 border-black text-xl p-3 rounded-xl font-bold hover:rounded-2xl hover:bg-black hover:text-[#f3f3f2] transition-all duration-300 ease-in-out"
                    onClick={() => {
                        router.push("/duel");
                    }}
                >
                    Play
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
                <div className="w-1/2 flex flex-col items-center justify-center">
                    <img
                        src="../icon.png"
                        alt="avatar"
                        className="w-48 h-48 rounded-full border-4 border-black"
                    />
                    <h1 className="mt-4 text-2xl font-bold">user name</h1>
                </div>
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
