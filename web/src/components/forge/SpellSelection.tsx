/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
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
                duration: 1000,
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

    if (hash && !alerted) {
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
                className="border-4 border-black text-lg p-2 rounded-xl font-semibold hover:rounded-2xl hover:bg-black hover:text-[#f3f3f2] transition-all duration-300 ease-in-out"
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

    const SpellCard = ({ spellImage, index, stats }: any) => {
        const isSelected = selectedSpells.includes(index);
        const css = isSelected
            ? "relative group bg-black opacity-20 rounded-xl"
            : "group relative";

        return (
            <div className={css}>
                <img
                    src={`https://black-just-toucan-396.mypinata.cloud/ipfs/${spellImage}`}
                    onClick={() => toggleSpell(index)}
                    className="object-cover bg-black scale-100 group-hover:opacity-10 transition-all group-hover:scale-105 duration-300 ease-out h-full w-full rounded-xl"
                ></img>
                <div
                    onClick={() => toggleSpell(index)}
                    className="text-white font-bold absolute inset-0 bg-black rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                    {stats}
                </div>
            </div>
        );
    };

    return (
        <div className="flex  h-screen flex-col justify-center items-center border-[3px] rounded-xl border-black p-4">
            {`Current Spell Index: ${indexOfSelectedSpells}`}
            {/* {JSON.stringify([
                URItoSpellName(randomCIDs[selectedSpells[0]]),
                URItoSpellName(randomCIDs[selectedSpells[1]]),
                URItoSpellName(randomCIDs[selectedSpells[2]]),
            ])} */}
            <p className=" font-bold text-2xl mb-8">
                Selected Spells: {selectedSpells.length}
            </p>
            <div className="grid grid-cols-5 gap-4 drop-shadow-[2px_2px_1px_rgba(0,0,0,0.45)] transition hover:drop-shadow-[10px_10px_3px_rgba(0,0,0,0.55)] ease-out duration-500">
                {randomCIDs.map((spellImage, index) => (
                    <SpellCard
                        key={index}
                        spellImage={spellImage}
                        index={index}
                        stats="ATTACK- ; DEFENSE- "
                    />
                ))}
            </div>
            <div className="flex w-full justify-around mt-8">
                <div>
                    {ready ? (
                        <div>
                            {isMinting ? (
                                <div className="loading-circle">Loading...</div>
                            ) : (
                                <button
                                    className="border-4 border-black text-lg p-2 rounded-xl font-semibold hover:rounded-2xl hover:bg-black hover:text-[#f3f3f2] transition-all duration-300 ease-in-out"
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
        </div>
    );
}
