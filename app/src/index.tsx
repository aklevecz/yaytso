import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./styles/egg.css";
import "./styles/upload.css";
import "./styles/nav.css";
import "./styles/collection.css";
import "./styles/modal.css";
import App from "./App";
import { Texture } from "three";
import { ethers } from "ethers";
import YaytsoInterface from "./contracts/Yaytso.json";

declare global {
    interface Window {
        ethereum: any;
    }
}

type User = {
    address: string;
    signer: ethers.providers.JsonRpcSigner | null;
};

enum Who {
    ME = "me",
    FRIEND = "friend",
}

type Recipient = {
    address: string;
    type: Who;
};

export type ContextAttrs = {
    pattern: Texture | null;
    clearPattern: Function;
    setPattern: Function;
    user: User | null;
    contract: ethers.Contract | null;
    web3Connect: Function;
    recipient: Recipient | null;
    setRecipient: Function;
};

const NETWORK_ID = process.env.NODE_ENV === "development" ? 1618544051137 : 4;
export const Context = React.createContext<ContextAttrs>({
    pattern: null,
    clearPattern: () => {},
    setPattern: () => {},
    user: { address: "", signer: null },
    contract: null,
    web3Connect: () => {},
    recipient: null,
    setRecipient: () => {},
});

function ContextProvider({ children }: { children: React.ReactChild }) {
    const [pattern, setPattern] = useState(null);
    const [user, setUser] = useState<User | null>(null);
    const [recipient, setRecipient] = useState<Recipient | null>(null);
    const [contract, setContract] = useState<ethers.Contract | null>(null);

    const clearPattern = () => setPattern(null);

    const web3Connect = () => {
        if (!window.ethereum) {
            return alert("sorry but I don't see a wallet to connect to :(")
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        window.ethereum
            .request({
                method: "eth_requestAccounts",
            })
            .then((account: any) => {
                const signer = provider.getSigner();
                setUser({ signer, address: account[0] });
            });
    };

    useEffect(() => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            signer
                .getAddress()
                .then((address) => setUser({ address, signer }))
                .catch((e) => {
                    window.ethereum
                        .request({
                            method: "eth_requestAccounts",
                        })
                        .then((account: any) => {
                            const signer = provider.getSigner();
                            setUser({ signer, address: account[0] });
                        });
                });
            const contractAddress =
                YaytsoInterface.networks[NETWORK_ID].address;
                console.log(contractAddress)
            const contract = new ethers.Contract(
                contractAddress,
                YaytsoInterface.abi,
                provider
            );
            setContract(contract);
        }
    }, []);

    return (
        <Context.Provider
            value={{
                pattern,
                clearPattern,
                setPattern,
                user,
                contract,
                web3Connect,
                recipient,
                setRecipient,
            }}
        >
            {children}
        </Context.Provider>
    );
}

ReactDOM.render(
    <React.StrictMode>
        <ContextProvider>
            <App />
        </ContextProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
