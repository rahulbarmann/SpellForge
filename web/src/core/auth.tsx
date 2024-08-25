// "use client";

// /* eslint-disable @next/next/no-img-element */

// import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
// import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
// import { Web3Auth } from "@web3auth/modal";
// import { useEffect, useState } from "react";

// // import RPC from "./ethersRPC";
// import RPC from "../../api/viemRPC";
// // import RPC from "./web3RPC";

// // ADD IN DOTENV
// const clientId =
//     "BIn_YLNB6DaqsmCw5gTK9VrdOKeDSUixUnOqVFdcr_HCC_sUIDL3ZlID3RAHqSm3tXTUr5LcHi5-_IjqiwmCqqc"; // get from https://dashboard.web3auth.io

// const chainConfig = {
//     chainNamespace: CHAIN_NAMESPACES.EIP155,
//     chainId: "0xaa36a7",
//     rpcTarget: "https://rpc.ankr.com/eth_sepolia",
//     // Avoid using public rpcTarget in production.
//     // Use services like Infura, Quicknode etc
//     displayName: "Ethereum Sepolia Testnet",
//     blockExplorerUrl: "https://sepolia.etherscan.io",
//     ticker: "ETH",
//     tickerName: "Ethereum",
//     logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
// };

// const privateKeyProvider = new EthereumPrivateKeyProvider({
//     config: { chainConfig },
// });

// const web3auth = new Web3Auth({
//     clientId,
//     web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
//     privateKeyProvider,
// });

// function App() {
//     const [provider, setProvider] = useState<IProvider | null>(null);
//     const [loggedIn, setLoggedIn] = useState(false);

//     useEffect(() => {
//         const init = async () => {
//             try {
//                 await web3auth.initModal();
//                 setProvider(web3auth.provider);

//                 if (web3auth.connected) {
//                     setLoggedIn(true);
//                 }
//             } catch (error) {
//                 console.error(error);
//             }
//         };

//         init();
//     }, []);

//     const login = async () => {
//         const web3authProvider = await web3auth.connect();
//         setProvider(web3authProvider);
//         if (web3auth.connected) {
//             setLoggedIn(true);
//         }
//     };

//     const getUserInfo = async () => {
//         const user = await web3auth.getUserInfo();
//         uiConsole(user);
//     };

//     const logout = async () => {
//         await web3auth.logout();
//         setProvider(null);
//         setLoggedIn(false);
//         uiConsole("logged out");
//     };

//     // Check the RPC file for the implementation
//     const getAccounts = async () => {
//         if (!provider) {
//             uiConsole("provider not initialized yet");
//             return;
//         }
//         const address = await RPC.getAccounts(provider);
//         uiConsole(address);
//     };

//     const getBalance = async () => {
//         if (!provider) {
//             uiConsole("provider not initialized yet");
//             return;
//         }
//         const balance = await RPC.getBalance(provider);
//         uiConsole(balance);
//     };

//     const signMessage = async () => {
//         if (!provider) {
//             uiConsole("provider not initialized yet");
//             return;
//         }
//         const signedMessage = await RPC.signMessage(provider);
//         uiConsole(signedMessage);
//     };

//     const sendTransaction = async () => {
//         if (!provider) {
//             uiConsole("provider not initialized yet");
//             return;
//         }
//         uiConsole("Sending Transaction...");
//         const transactionReceipt = await RPC.sendTransaction(provider);
//         uiConsole(transactionReceipt);
//     };

//     function uiConsole(...args: any[]): void {
//         const el = document.querySelector("#console>p");
//         if (el) {
//             el.innerHTML = JSON.stringify(args || {}, null, 2);
//             console.log(...args);
//         }
//     }

//     const loggedInView = (
//         <>
//             <div className="flex-container">
//                 <div>
//                     <button onClick={getUserInfo} className="card">
//                         Get User Info
//                     </button>
//                 </div>
//                 <div>
//                     <button onClick={getAccounts} className="card">
//                         Get Accounts
//                     </button>
//                 </div>
//                 <div>
//                     <button onClick={getBalance} className="card">
//                         Get Balance
//                     </button>
//                 </div>
//                 <div>
//                     <button onClick={signMessage} className="card">
//                         Sign Message
//                     </button>
//                 </div>
//                 <div>
//                     <button onClick={sendTransaction} className="card">
//                         Send Transaction
//                     </button>
//                 </div>
//                 <div>
//                     <button onClick={logout} className="card">
//                         Log Out
//                     </button>
//                 </div>
//             </div>
//         </>
//     );

//     const unloggedInView = (
//         <button onClick={login} className="card">
//             Login
//         </button>
//     );

//     return (
//         <div className="container">
//             <div className="grid">
//                 {loggedIn ? loggedInView : unloggedInView}
//             </div>
//             <div id="console" style={{ whiteSpace: "pre-line" }}>
//                 <p style={{ whiteSpace: "pre-line" }}></p>
//             </div>
//         </div>
//     );
// }

// export default App;
