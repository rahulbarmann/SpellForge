import { useAccount, useReadContract } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import { abi, contractAddress } from "@/lib/constants";

export const useGetUserNFTURIs = () => {
    const { address } = useAccount();
    const { user } = usePrivy();

    const userAddress = address || user?.wallet?.address;

    const {
        data: uris,
        isError,
        isLoading,
        refetch,
    } = useReadContract({
        address: contractAddress,
        abi,
        functionName: "getUserNFTURIs",
        args: userAddress ? [userAddress] : undefined,
    });

    const getUserNFTURIs = async () => {
        if (!userAddress) {
            throw new Error("User wallet address not available");
        }

        if (isError) {
            throw new Error("Error fetching NFT URIs");
        }

        if (isLoading) {
            return null;
        }

        return uris;
    };

    return { getUserNFTURIs, refetch, isLoading };
};
