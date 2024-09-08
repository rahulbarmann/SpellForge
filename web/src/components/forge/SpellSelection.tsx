"use client";

import { SpellsCIDArray } from "@/lib/constants";
import React, { useState, useEffect, useMemo } from "react";
import {
    useWaitForTransactionReceipt,
    useWriteContract,
    type BaseError,
} from "wagmi";
import { devAbi, devContractAddress } from "@/lib/constants";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { URItoSpellName } from "@/lib/utils";

function getRandomCID(arr: any, num: any) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

const abi = devAbi;
const contractAddress = devContractAddress;

export function SpellSelection() {
    const [selectedSpells, setSelectedSpells] = useState<any>([]);
    const [isMinting, setIsMinting] = useState(false);
    const { user, ready, sendTransaction } = usePrivy();
    const [indexOfSelectedSpells, setIndexOfSelectedSpells] = useState(0);
    const [alerted, setAlerted] = useState(false);

    const router = useRouter();
    const userAddress = user?.wallet?.address;

    const randomCIDs = useMemo(() => getRandomCID(SpellsCIDArray, 5), []);

    const {
        writeContract,
        isPending: isWriteLoading,
        status: writeStatus,
        isError: isWriteError,
        data: hash,
        error,
        isPending,
    } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        });

    const handleMint = async () => {
        if (!userAddress) {
            console.error("User address not available");
            return;
        }

        try {
            setAlerted(false);
            const result: any = writeContract({
                address: contractAddress,
                abi,
                functionName: "mintNFT",
                args: [userAddress, selectedSpells[indexOfSelectedSpells]],
            });

            if (result) {
                await sendTransaction({
                    to: contractAddress,
                    data: result.data,
                });
            }
        } catch (err) {
            console.error("Error minting NFT:", err);
        }
    };

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
            setIsMinting(false);
        } else if (writeStatus === "error") {
            toast.error("Error While Minting NFT!");
            setIsMinting(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [writeStatus]);

    if (isConfirmed && !alerted) {
        toast.success("Transaction confirmed!");

        toast((t) => (
            <span>
                You Just Minted The{" "}
                {URItoSpellName(
                    randomCIDs[selectedSpells[indexOfSelectedSpells]]
                )}{" "}
                Spell!{" "}
                <button onClick={() => toast.dismiss(t.id)}>
                    <a href={`https://sepolia.etherscan.io/tx/${hash}`}>
                        View On Block Explorer
                    </a>
                </button>
            </span>
        ));

        setAlerted(true);
        setIndexOfSelectedSpells((c) => c + 1);
    }

    if (error && !alerted) {
        toast.error(error.message);
        setAlerted(true);
    }

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
            <br />
            {`Current Spell Index: ${indexOfSelectedSpells}`}
            <br />
            {JSON.stringify([
                URItoSpellName(randomCIDs[selectedSpells[0]]),
                URItoSpellName(randomCIDs[selectedSpells[1]]),
                URItoSpellName(randomCIDs[selectedSpells[2]]),
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
                                disabled={
                                    selectedSpells.length !== 3 ||
                                    indexOfSelectedSpells >= 3
                                }
                                onClick={handleMint}
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
