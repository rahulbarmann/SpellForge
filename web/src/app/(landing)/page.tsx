"use client";

/* eslint-disable @next/next/no-img-element */
import { web3auth } from "../../api/auth";
import { IProvider } from "@web3auth/base";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Arrow } from "@/components/assets/Icons";

function App() {
    const [provider, setProvider] = useState<IProvider | null>(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            try {
                await web3auth.initModal();
                setProvider(web3auth.provider);

                if (web3auth.connected) {
                    setLoggedIn(true);
                }
            } catch (error) {
                console.error(error);
            }
        };

        init().then(() => setLoading(false));
    }, []);

    const login = async () => {
        const web3authProvider = await web3auth.connect();
        setProvider(web3authProvider);
        if (web3auth.connected) {
            setLoggedIn(true);
            router.push("/forge");
        }
    };

    function Button({ onClickFucn }: any) {
        return (
            <button onClick={onClickFucn} className="card">
                Start Your Journey
            </button>
        );
    }

    const pushToForge = () => {
        router.push("/forge");
    };

    const [isCardVisible, setIsCardVisible] = useState(false);

    const handleArrowClick = () => {
        setIsCardVisible(!isCardVisible);
    };

    return (
        <div className="bg-black flex flex-col h-full">
            <div className="border-2 border-black rounded-xl bg-white m-4 p-4 flex flex-col min-h-[calc(100vh-2rem)]">
                <div className="flex flex-col h-full justify-between items-center">
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
                                Lorem, ipsum dolor sit amet consectetur
                                adipisicing elit. Ad tenetur ea ipsa, neque
                                reiciendis magni explicabo delectus
                                necessitatibus nihil veniam quaerat vero officia
                                nisi. Pariatur inventore voluptates expedita
                                beatae distinctio.
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
            </div>

            {isCardVisible && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-500 ease-in-out"
                    onClick={() => setIsCardVisible(false)}
                ></div>
            )}
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
                    {web3auth.connected ? (
                        <Button onClickFucn={pushToForge} />
                    ) : (
                        <Button onClickFucn={login} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
