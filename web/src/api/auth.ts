import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";
import dotenv from "dotenv";

dotenv.config({ path: "web/.env" });

// import RPC from "./ethersRPC";
import RPC from "../api/viemRPC";
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

export const web3auth = new Web3Auth({
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider,
    uiConfig: {
        appName: "Spell Forge",
        mode: "dark", // light, dark or auto
        loginMethodsOrder: ["google", "twitter", "github", "farcaster"],
        logoLight: "https://web3auth.io/images/web3auth-logo.svg",
        logoDark: "https://web3auth.io/images/web3auth-logo---Dark.svg",
        defaultLanguage: "en",
        loginGridCol: 3,
        primaryButton: "socialLogin", // "externalLogin" | "socialLogin" | "emailLogin"
    },
});
