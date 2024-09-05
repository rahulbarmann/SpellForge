"use client";

import React, { useState, useEffect } from "react";
import { useWriteContract, type BaseError } from "wagmi";
import { abi, contractAddress } from "@/lib/constants";
import { usePrivy } from "@privy-io/react-auth";

export const UploadProfile = () => {
    const { user } = usePrivy();
    const [username, setUserame] = useState("");
    const [image, setImage] = useState(null);
    const [isMinting, setIsMinting] = useState(false);

    const userAddress = user?.wallet?.address;

    const {
        isPending: isWriteLoading,
        status: writeStatus,
        isError: isWriteError,
        writeContract,
    } = useWriteContract();

    useEffect(() => {
        if (writeStatus === "pending") {
            alert("Minting NFT");
        } else if (
            writeStatus === "success" &&
            !isWriteLoading &&
            !isWriteError
        ) {
            alert(
                JSON.stringify({
                    render: "NFT Minted",
                    isLoading: false,
                    autoClose: 5000,
                    type: "success",
                })
            );
            setIsMinting(false);
        } else if (writeStatus === "error") {
            alert(
                JSON.stringify({
                    render: "Error Minting NFT",
                    isLoading: false,
                    autoClose: 5000,
                    type: "error",
                })
            );
            setIsMinting(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [writeStatus]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsMinting(true);

        const data = new FormData();
        if (image) {
            data.set("file", image);
            data.set("username", username);
            data.set("address", userAddress!);
        }
        alert("Metadata Created");

        const result = await fetch("/api/submit", {
            method: "POST",
            body: data,
        });

        if (result.ok) {
            const res = await result.json();
            mintNFT(res.nftURI);
        } else {
            alert("Error Submitting Form");
            setIsMinting(false);
        }
    };

    const mintNFT = (URI: string) => {
        try {
            writeContract({
                address: contractAddress,
                abi,
                functionName: "mintNFT",
                args: [userAddress, URI],
            });
        } catch (error) {
            console.error("Error minting NFT:", error);
            setIsMinting(false);
        }
    };
    return (
        <div className="admin-page">
            <form onSubmit={handleSubmit} className="admin-form">
                <label className="admin-label">
                    Upload Profile:
                    <input
                        type="file"
                        onChange={(e: any) => setImage(e.target.files[0])}
                        className="admin-input"
                        required
                    />
                </label>
                <button
                    type="submit"
                    className="admin-button"
                    disabled={isMinting}
                >
                    {isMinting ? (
                        <div className="loading-circle">Loading...</div>
                    ) : (
                        "Submit"
                    )}
                </button>
            </form>
        </div>
    );
};
