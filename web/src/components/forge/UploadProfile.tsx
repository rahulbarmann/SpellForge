/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import {
    useWaitForTransactionReceipt,
    useWriteContract,
    type BaseError,
} from "wagmi";
import { devAbi, devContractAddress } from "@/lib/constants";
import { usePrivy } from "@privy-io/react-auth";
import toast from "react-hot-toast";

const abi = devAbi;
const contractAddress = devContractAddress;

export const UploadProfile = () => {
    const [username, setUserame] = useState("");
    const [image, setImage] = useState(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [isMinting, setIsMinting] = useState(false);
    const [profileImage, setProfileImage] = useState<any>();
    const [URI, setURI] = useState<any>(null);
    const [alerted, setAlerted] = useState(false);

    const { user, sendTransaction } = usePrivy();

    const userAddress: any = user?.wallet?.address;

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
            const result: any = writeContract({
                address: contractAddress,
                abi,
                functionName: "mintNFT",
                args: [userAddress, URI],
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

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        setIsUploadingImage(true);

        const data = new FormData();
        if (image) {
            data.set("file", image);
            data.set("username", username);
            data.set("address", userAddress!);
        }

        const result = await fetch("/api/submit", {
            method: "POST",
            body: data,
        });

        if (result.ok) {
            const res = await result.json();
            setProfileImage(
                `https://black-just-toucan-396.mypinata.cloud/ipfs/${res.ImageURI}`
            );
            setIsUploadingImage(false);
            setURI(res.ImageURI);
        } else {
            toast.error("Error While Submitting!");
            setIsUploadingImage(false);
        }
    };

    if (hash && !alerted) {
        toast.success("Transaction confirmed!");

        toast((t) => (
            <span>
                NFT Minted Successfully!
                <button onClick={() => toast.dismiss(t.id)}>
                    <a href={`https://sepolia.etherscan.io/tx/${hash}`}>
                        View On Block Explorer
                    </a>
                </button>
            </span>
        ));

        setAlerted(true);
    }

    if (error && !alerted) {
        toast.error(error.message);
        setAlerted(true);
    }

    return (
        <>
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-8 p-6">
                <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
                    <img
                        src={profileImage}
                        alt=""
                        className="w-48 h-48 rounded-full border-4 border-black"
                    />
                    <h1 className="mt-4 text-2xl font-bold">user name</h1>
                </div>
                <div className="w-full bg-[#f3f3f2] flex rounded justify-center">
                    <form
                        onSubmit={(e) => {
                            const submitPromise = handleSubmit(e);
                            toast.promise(submitPromise, {
                                loading: "Processing...",
                                success: "Profile Image Updated Successfully!",
                                error: "Failed To Submit Image!",
                            });
                        }}
                        className="flex items-center grow justify-between"
                    >
                        <div>
                            <label
                                className="block bg-[#f3f3f2] hover:bg-black text-black hover:text-white border-2 mt-2 border-black rounded-lg font-bold mb-2 py-2 px-4 transition-all hover:rounded-3xl duration-300 ease-out"
                                htmlFor="profile-upload"
                            >
                                Upload your Profile
                            </label>
                            <input
                                id="profile-upload"
                                type="file"
                                onChange={(e: any) => {
                                    toast.success("Image Selected!", {
                                        duration: 2000,
                                    });
                                    setImage(e.target.files[0]);
                                }}
                                className="hidden"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-[#f3f3f2] group hover:bg-black text-black hover:text-white border-2 border-black font-bold py-2 px-4 rounded-lg hover:rounded-3xl focus:outline-none transition-all duration-300 ease-out"
                            disabled={isUploadingImage}
                        >
                            {isUploadingImage ? (
                                <div className="flex items-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-2"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Uploading...
                                </div>
                            ) : (
                                "Check It out!"
                            )}
                        </button>
                        <button
                            disabled={isPending || isConfirming}
                            onClick={handleMint}
                            className="bg-[#f3f3f2] hover:bg-black text-black hover:text-white border-2 border-black font-bold py-2 px-4 rounded-lg hover:rounded-3xl  transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending
                                ? "Preparing..."
                                : hash
                                ? "You Started The Minting Process"
                                : "Mint Your Profile"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};
