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
const clientId =
    "BIn_YLNB6DaqsmCw5gTK9VrdOKeDSUixUnOqVFdcr_HCC_sUIDL3ZlID3RAHqSm3tXTUr5LcHi5-_IjqiwmCqqc"; // get from https://dashboard.web3auth.io

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
        <div className="flex flex-col h-full justify-between items-center">
            {/* <div className="grid">
                {loggedIn ? loggedInView : unloggedInView}
            </div> */}
            <div className="flex flex-col items-center justify-center h-full">
                <div className="m-8 p-3 border-transparent rounded-full transition border-4 hover:border-black ease-in duration-300">
                    <h1 className="text-5xl font-bold">SpellForge</h1>
                </div>
                <div className="w-1/3 transition hover:drop-shadow-[2px_2px_1px_rgba(0,0,0,0.45)] ease-in duration-500">
                    <p className="text-center">
                        Lorem, ipsum dolor sit amet consectetur adipisicing
                        elit. Ad tenetur ea ipsa, neque reiciendis magni
                        explicabo delectus necessitatibus nihil veniam quaerat
                        vero officia nisi. Pariatur inventore voluptates
                        expedita beatae distinctio.
                    </p>
                </div>
            </div>
            <div className="mb-2">
                <p className="animate-bounce text-2xl font-bold">!^!</p>
            </div>

            <div id="console" style={{ whiteSpace: "pre-line" }}>
                <p style={{ whiteSpace: "pre-line" }}></p>
            </div>
        </div>
    );
}

export default App;
