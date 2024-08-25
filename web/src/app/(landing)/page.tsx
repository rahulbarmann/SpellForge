"use client";

/* eslint-disable @next/next/no-img-element */

import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";
import { useEffect, useState } from "react";
import dotenv from "dotenv";

dotenv.config({ path: "web/.env" });

// import RPC from "./ethersRPC";
import RPC from "../../api/viemRPC";
// import RPC from "./web3RPC";

// ADD IN DOTENV
const clientId = process.env.WEB3AUTH_CLIENT_ID as string; // get from https://dashboard.web3auth.io

const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xaa36a7",
    rpcTarget: "https://rpc.ankr.com/eth_sepolia",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Ethereum Sepolia Testnet",
    blockExplorerUrl: "https://sepolia.etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig },
});

const web3auth = new Web3Auth({
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider,
});

function App() {
    const [provider, setProvider] = useState<IProvider | null>(null);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                await web3auth.initModal();
                setProvider(web3auth.provider);

                if (web3auth.connected) {
                    setLoggedIn(true);
                }
            } catch (error) {
                console.error(error);
            }
        };

        init();
    }, []);

    const login = async () => {
        const web3authProvider = await web3auth.connect();
        setProvider(web3authProvider);
        if (web3auth.connected) {
            setLoggedIn(true);
        }
    };

    const logout = async () => {
        await web3auth.logout();
        setProvider(null);
        setLoggedIn(false);
    };

    const loggedInView = (
        <>
            <div className="flex-container">
                <div>
                    <button onClick={logout} className="card">
                        Log Out
                    </button>
                </div>
            </div>
        </>
    );

    const unloggedInView = (
        <button onClick={login} className="card">
            Login
        </button>
    );

    return (
        <div className="container">
            <div className="grid">
                {loggedIn ? loggedInView : unloggedInView}
            </div>
            <div id="console" style={{ whiteSpace: "pre-line" }}>
                <p style={{ whiteSpace: "pre-line" }}></p>
            </div>
        </div>
    );
}

export default App;
