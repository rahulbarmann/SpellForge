/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { useWriteContract, type BaseError } from "wagmi";
import { abi, contractAddress } from "@/lib/constants";
import { usePrivy } from "@privy-io/react-auth";
import toast from "react-hot-toast";

export const UploadProfile = () => {
    const { user } = usePrivy();
    const [username, setUserame] = useState("");
    const [image, setImage] = useState(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [isMinting, setIsMinting] = useState(false);
    const [profileImage, setProfileImage] = useState<any>();
    const [nftURI, setNftURI] = useState<any>();

    const userAddress = user?.wallet?.address;

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
            setNftURI(res.nftURI);
        } else {
            toast.error("Error While Submitting!");
            setIsUploadingImage(false);
        }
    };

    const mintNFT = (URI: string) => {
        try {
            setIsMinting(true);
            writeContract({
                address: contractAddress,
                abi,
                functionName: "mintNFT",
                args: [userAddress, URI],
            });
        } catch (error) {
            toast.error("Some Error Occured!");
            console.log("Error minting NFT:", error);
            setIsMinting(false);
        }
    };
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
                <button
                    onClick={() => {
                        mintNFT(nftURI);
                    }}
                >
                    Mint You Profile
                </button>
            </div>
        </>
    );
};
