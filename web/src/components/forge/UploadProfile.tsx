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

    if (isConfirmed && !alerted) {
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
            <div className="w-1/2 flex flex-col items-center justify-center">
                <img
                    src={profileImage}
                    alt="avatar"
                    className="w-48 h-48 rounded-full border-4 border-black"
                />
                <h1 className="mt-4 text-2xl font-bold">user name</h1>
            </div>
            <div className="admin-page">
                <form
                    onSubmit={(e: any) => {
                        const submitPromise = handleSubmit(e);
                        toast.promise(submitPromise, {
                            loading: "Processing...",
                            success: "Profile Image Updated Successfully!",
                            error: "Failed To Submit Image!",
                        });
                    }}
                    className="admin-form"
                >
                    <label className="admin-label">
                        Upload Profile:
                        <input
                            type="file"
                            onChange={(e: any) => {
                                toast.success("Image Selected!", {
                                    duration: 2000,
                                });
                                setImage(e.target.files[0]);
                            }}
                            className="admin-input"
                            required
                        />
                    </label>
                    <button
                        type="submit"
                        className="admin-button"
                        disabled={isUploadingImage}
                    >
                        {isUploadingImage ? (
                            <div className="loading-circle">Uploading...</div>
                        ) : (
                            "Submit"
                        )}
                    </button>
                </form>
                <div>
                    <button
                        disabled={isPending || isConfirming}
                        onClick={handleMint}
                    >
                        {isPending
                            ? "Preparing..."
                            : isConfirming
                            ? "Confirming..."
                            : "Mint Your Profile"}
                    </button>
                </div>
            </div>
        </>
    );
};
