"use client";

import { SpellsArray } from "@/lib/constants";
import { useEffect, useMemo, useState } from "react";
import { useWriteContract, type BaseError } from "wagmi";
import { abi, contractAddress } from "@/lib/constants";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function getRandomCID(arr: any, num: any) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

export function SpellSelection() {
    const [selectedSpells, setSelectedSpells] = useState<any>([]);
    const [isMinting, setIsMinting] = useState(false);
    const { user, ready } = usePrivy();

    const router = useRouter();
    const userAddress = user?.wallet?.address;

    const randomCIDs = useMemo(() => getRandomCID(SpellsArray, 5), []);

    const {
        isPending: isWriteLoading,
        status: writeStatus,
        isError: isWriteError,
        writeContract,
    } = useWriteContract();

    useEffect(() => {
        if (writeStatus === "pending") {
            toast.loading("Started To Mint NFT", {
                duration: 3000,
            });
        } else if (
            writeStatus === "success" &&
            !isWriteLoading &&
            !isWriteError
        ) {
            toast.success("NFT Minted Successfully!");
            localStorage.setItem("hasOnboarded", "true"); // use this when minting is done
            setIsMinting(false);
        } else if (writeStatus === "error") {
            toast.error("Error While Minting NFT!");
            setIsMinting(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [writeStatus]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsMinting(true);
        mintNFT([
            randomCIDs[selectedSpells[0]],
            randomCIDs[selectedSpells[1]],
            randomCIDs[selectedSpells[2]],
        ]);
    };

    const mintNFT = (URIs: string[]) => {
        try {
            writeContract({
                address: contractAddress,
                abi,
                functionName: "mintNFT",
                args: [userAddress, URIs[0]],
            });
            writeContract({
                address: contractAddress,
                abi,
                functionName: "mintNFT",
                args: [userAddress, URIs[1]],
            });
            writeContract({
                address: contractAddress,
                abi,
                functionName: "mintNFT",
                args: [userAddress, URIs[2]],
            });
        } catch (error) {
            toast.error("Error While Submitting!");
            console.log("Error minting NFT:", error);
            setIsMinting(false);
        }
    };

    const toggleSpell = (index: number) => {
        setSelectedSpells((prevSelected: any) => {
            const isCurrentlySelected = prevSelected.includes(index);
            if (isCurrentlySelected) {
                return prevSelected.filter((i: any) => i !== index);
            } else if (prevSelected.length < 3) {
                return [...prevSelected, index];
            }
            return prevSelected;
        });
    };

    const ContinueButton = () => (
        <div>
            <button
                disabled={selectedSpells.length !== 3}
                onClick={() => {
                    localStorage.setItem("hasVisited", "true");
                    toast("Contrats On Choosing Your First Spells!", {
                        icon: "👏",
                        duration: 4000,
                    });
                    router.push("/forge");
                }}
            >
                Continue
            </button>
        </div>
    );

    const SpellCard = ({ spellImage, index }: any) => {
        const isSelected = selectedSpells.includes(index);
        const css = isSelected ? "outline outline-blue-500" : "";

        return (
            <div className={css}>
                <button onClick={() => toggleSpell(index)}>{spellImage}</button>
            </div>
        );
    };

    return (
        <div>
            {JSON.stringify([
                randomCIDs[selectedSpells[0]],
                randomCIDs[selectedSpells[1]],
                randomCIDs[selectedSpells[2]],
            ])}
            <p>Selected Spells: {selectedSpells.length}</p>
            <div className="flex flex-col">
                {randomCIDs.map((spellImage, index) => (
                    <SpellCard
                        key={index}
                        spellImage={spellImage}
                        index={index}
                    />
                ))}
            </div>
            <div>
                {ready ? (
                    <div>
                        {isMinting ? (
                            <div className="loading-circle">Loading...</div>
                        ) : (
                            <button
                                disabled={selectedSpells.length !== 3}
                                onClick={handleSubmit}
                            >
                                Mint Your Spells!
                            </button>
                        )}
                    </div>
                ) : (
                    ""
                )}
            </div>
            <ContinueButton />
        </div>
    );
}
