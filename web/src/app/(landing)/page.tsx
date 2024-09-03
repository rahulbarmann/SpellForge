"use client";

import { Button } from "@/components/ui/button";
import { Arrow } from "@/components/assets/Icons";
import { useAction } from "@/hooks/useAction";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
    const { ready, authenticated, login } = usePrivy();
    const [submitting, setSubmitting] = useState(false);
    const { submit } = useAction();
    const actionDisabled = !ready || !authenticated;
    const router = useRouter();

    if (!actionDisabled) router.push("/forge");

    const LoginButton = () => {
        if (ready && !authenticated) {
            return <Button onClick={login}>Start Your Journey</Button>;
        }
    };

    // const handleAction = async (actionName: string) => {
    //     try {
    //         setSubmitting(true);
    //         const res = await submit(actionName, { timestamp: Date.now() });
    //         if (!res) {
    //             throw new Error("Failed to submit action");
    //         }
    //         setValue(res.logs[0].value);
    //     } catch (e) {
    //         alert((e as Error).message);
    //         console.error(e);
    //     } finally {
    //         setSubmitting(false);
    //     }
    // };

    const [isCardVisible, setIsCardVisible] = useState(false);

    const handleArrowClick = () => {
        setIsCardVisible(!isCardVisible);
    };

    return (
        <>
            <div className="flex flex-col h-full justify-between items-center">
                <code className="mx-4"></code>
                <div
                    className={`flex flex-col items-center justify-center flex-grow transition-all duration-500 ease-in-out ${
                        isCardVisible ? "opacity-50 blur-sm" : ""
                    }`}
                >
                    <div className="m-8 p-4 w-max rounded-full transition hover:bg-black hover:text-[#F3F3F2] ease-in duration-200">
                        <h1 className="text-5xl font-bold">SpellForge</h1>
                    </div>
                    <div className="max-w-md transition hover:drop-shadow-[2px_2px_1px_rgba(0,0,0,0.45)] ease-out duration-500">
                        <p className="text-center">
                            Lorem, ipsum dolor sit amet consectetur adipisicing
                            elit. Ad tenetur ea ipsa, neque reiciendis magni
                            explicabo delectus necessitatibus nihil veniam
                            quaerat vero officia nisi. Pariatur inventore
                            voluptates expedita beatae distinctio.
                        </p>
                    </div>
                </div>
                <div className="mb-4">
                    <div
                        className="animate-bounce m-3 cursor-pointer"
                        onClick={handleArrowClick}
                    >
                        <Arrow />
                    </div>
                </div>
                <div id="console" style={{ whiteSpace: "pre-line" }}>
                    <p style={{ whiteSpace: "pre-line" }}></p>
                </div>
            </div>
            <div>
                {isCardVisible && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-500 ease-in-out"
                        onClick={() => setIsCardVisible(false)}
                    ></div>
                )}
            </div>
            <div
                className={`fixed left-1/2 transform -translate-x-1/2 border-2 border-black bg-[#F3F3F2] rounded-xl shadow-lg transition-all duration-500 ease-in-out ${
                    isCardVisible
                        ? "bottom-1/2 translate-y-1/2 opacity-100"
                        : "bottom-0 translate-y-full opacity-0"
                } w-11/12 max-w-lg`}
                id="slidingCard"
            >
                <div className="p-8 flex flex-col justify-center">
                    <h2 className="text-2xl text-center font-bold mb-4">
                        Rules
                    </h2>
                    <p>
                        This is the content of the sliding card that appears
                        when you click the arrow.
                    </p>
                    <LoginButton />
                </div>
            </div>
        </>
    );
}
