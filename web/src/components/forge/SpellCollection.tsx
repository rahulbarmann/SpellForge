/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { abi, contractAddress } from "@/lib/constants";
import { usePrivy } from "@privy-io/react-auth";
import React from "react";
import { useReadContract } from "wagmi";

// Define the contract config
const contractConfig = {
    address: contractAddress,
    abi,
} as const;

export function SpellCollection() {
    const { user } = usePrivy();

    const userAddress = user?.wallet?.address;

    const { data, error, isLoading } = useReadContract({
        ...contractConfig,
        functionName: "getUserNFTURIs",
        args: [userAddress],
    }) as {
        data: string[] | undefined;
        error: Error | null;
        isLoading: boolean;
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            {data && data.length > 0 ? (
                <ul>
                    {data.map((uri, index) => (
                        <img
                            key={index}
                            src={`https://black-just-toucan-396.mypinata.cloud/ipfs/${uri}`}
                        ></img>
                    ))}
                </ul>
            ) : (
                <p>No NFT URIs found for this user.</p>
            )}
        </div>
    );
}
