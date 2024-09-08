import { ethers } from "ethers";
import dotenv from "dotenv";

import { EtherscanProvider } from "ethers";
import { abi, contractAddress } from "./constants";
const contractABI = abi;

dotenv.config();
console.log("RPC URL: ", process.env.ETHEREUM_RPC_URL);

const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
// If your contract requires signing transactions, uncomment this line and set up your private key
// const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(contractAddress, contractABI, provider);

export async function getUserNFTURIs(userAddress: string): Promise<string[]> {
    if (!ethers.isAddress(userAddress)) {
        throw new Error("Invalid Ethereum address");
    }

    try {
        const uris: string[] = await contract.getUserNFTURIs(userAddress);
        return uris;
    } catch (error) {
        console.error("Error fetching NFT URIs:", error);
        throw new Error("Failed to fetch NFT URIs");
    }
}

// Example usage in an Express.js route
// const express = require("express");
// const app = express();

// app.get("/api/nft-uris/:address", async (req, res) => {
//     try {
//         const userAddress = req.params.address;
//         const uris = await getUserNFTURIs(userAddress);
//         res.json({ uris });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// module.exports = { getUserNFTURIs };
