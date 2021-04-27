import React, { useEffect, useState } from "react";

import ReactDOM from "react-dom";
import "./index.css";
import "./styles/create.css";
import "./styles/egg.css";
import "./styles/upload.css";
import "./styles/nav.css";
import "./styles/collection.css";
import "./styles/viewer.css";
import "./styles/modal.css";
import App from "./App";
import { CanvasTexture, Texture } from "three";
import { ethers } from "ethers";
import YaytsoInterface from "./contracts/YaytsoV2.json";
import { readFile } from "./libs/services";
import { getSignerAndAddress, requestAccount } from "./libs/contract";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import CanvasProvider from "./contexts/CanvasContext";

export const INFURA = "e835057bad674697959be47dcac5028e";

// const provider = new WalletConnectProvider({ infuraId: INFURA });

// provider.enable().then(() => {
//   const web3Provider = new ethers.providers.Web3Provider(provider);
//   provider.on("accountsChanged", (accounts: string[]) => {
//     console.log(accounts);
//   });
// });

// Create a connector
export const connector = new WalletConnect({
  bridge: "https://bridge.walletconnect.org", // Required
  qrcodeModal: QRCodeModal,
});

// Check if connection is already established
if (!connector.connected) {
  // create new session
  // connector.createSession();
}

connector.on("disconnect", (error, payload) => {
  if (error) {
    throw error;
  }

  // Delete connector
});

declare global {
  interface Window {
    ethereum: any;
  }
}

export enum WalletTypes {
  WALLET_CONNECT,
  METAMASK,
}

type User = {
  address: string;
  signer: ethers.providers.JsonRpcSigner | null;
  type: WalletTypes | null;
  chainId: number | null;
};

export enum Who {
  ME = "ME",
  FRIEND = "FRIEND",
}

export type Recipient = {
  address: string;
  type: Who;
  desc: string;
  eggName: string;
};

export type ContextAttrs = {
  pattern: Texture | null;
  clearPattern: Function;
  setPattern: Function;
  user: User | null;
  contract: ethers.Contract | null;
  provider:
    | ethers.providers.Web3Provider
    | ethers.providers.BaseProvider
    | null;
  web3Connect: Function;
  connectWalletConnect: Function;
  recipient: Recipient | null;
  setRecipient: Function;
  uploadPattern: (e: React.FormEvent<HTMLInputElement>) => void;
  isDesk: boolean | null;
  disconnectWallet: () => void;
};

const NETWORK_ID = process.env.NODE_ENV === "development" ? 1618882316581 : 4;
// const NETWORK_ID = 1618882316581;

export const Context = React.createContext<ContextAttrs>({
  pattern: null,
  clearPattern: () => {},
  setPattern: () => {},
  user: { address: "", signer: null, type: null, chainId: null },
  contract: null,
  provider: null,
  connectWalletConnect: () => {},
  web3Connect: () => {},
  recipient: null,
  setRecipient: () => {},
  uploadPattern: () => {},
  isDesk: null,
  disconnectWallet: () => {},
});

const disposeWalletConnect = () => localStorage.removeItem("walletconnect");

function ContextProvider({ children }: { children: React.ReactChild }) {
  const [pattern, setPattern] = useState<CanvasTexture | null>(null);
  const [user, setUser] = useState<User | null>({
    address: "",
    signer: null,
    type: null,
    chainId: null,
  });
  const [provider, setProvider] = useState<
    ethers.providers.Web3Provider | ethers.providers.BaseProvider | null
  >(null);
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  const [isDesk, setIsDesk] = useState(window.innerWidth > 768);

  const clearPattern = () => setPattern(null);

  const disconnectWallet = () => {
    setUser({ address: "", signer: null, type: null, chainId: null });
    disposeWalletConnect();
    window.location.href =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/#/"
        : "https://yaytso.art/#/";
    window.location.reload();
  };

  const uploadPattern = (e: React.FormEvent<HTMLInputElement>) => {
    const files = (e.target as HTMLInputElement).files;
    if (files === null || files.length === 0) {
      return;
    }
    const file = files[0];

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => readFile(e, setPattern);
    reader.readAsDataURL(file);
  };

  // METAMASK CONNECT
  const web3Connect = async () => {
    if (!window.ethereum) {
      return alert("sorry but I don't see a wallet to connect to :(");
    }
    const { signer, address, chainId } = await requestAccount();
    setUser({ chainId, type: WalletTypes.METAMASK, signer, address });
  };

  const connectWalletConnect = async () => {
    // const walletConnectProvider = new WalletConnectProvider({
    //   infuraId: INFURA,
    // });
    console.log("ummm");
    if (!connector.connected) {
      connector.createSession();
    }
    // redundant
    connector.on("session_update", (error, payload) => {
      if (error) {
        throw error;
      }

      // Get updated accounts and chainId
      console.log(payload);
      const { accounts, chainId } = payload.params[0];
      if (user) {
        setUser({
          ...user,
          address: accounts[0],
          chainId,
          type: WalletTypes.WALLET_CONNECT,
        });
      }
    });
    connector.on("connect", (error, payload) => {
      if (error) {
        throw error;
      }
      // walletConnectProvider.enable().then(() => {
      const rpcAddress =
        process.env.NODE_ENV === "development"
          ? "http://localhost:8545"
          : `https://rinkeby.infura.io/v3/${INFURA}`;

      const provider = new ethers.providers.JsonRpcProvider(rpcAddress);
      const contractAddress = YaytsoInterface.networks[NETWORK_ID].address;
      const contract = new ethers.Contract(
        contractAddress,
        YaytsoInterface.abi,
        provider
      );
      setContract(contract);
      setProvider(provider);
      // Get provided accounts and chainId
      const { accounts, chainId } = payload.params[0];
      setUser({
        address: accounts[0],
        signer: null,
        type: WalletTypes.WALLET_CONNECT,
        chainId,
      });
      // });
    });
  };

  useEffect(() => {
    if (window.ethereum) {
      // Some redundancy still with provider -- it probably doesn't need to change...
      // Should also setup a better provider
      // TODO: robust provider with infura keys etc.

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      getSignerAndAddress(provider)
        .then(({ address, signer, chainId }) =>
          setUser({ address, signer, type: WalletTypes.METAMASK, chainId })
        )
        .catch((e) => {
          web3Connect();
        });

      const contractAddress = YaytsoInterface.networks[NETWORK_ID].address;
      const contract = new ethers.Contract(
        contractAddress,
        YaytsoInterface.abi,
        provider
      );
      setContract(contract);
      setProvider(provider);

      window.ethereum.on("accountsChanged", function (accounts: string[]) {
        // Maybe slightly overkill for changing of account
        getSignerAndAddress(provider).then(({ address, signer, chainId }) =>
          setUser({ type: WalletTypes.METAMASK, address, signer, chainId })
        );
      });
    }
    if (connector.connected) {
      // IS THIS IN AN ELSE???
      //         const walletConnectProvider = new WalletConnectProvider({
      //   infuraId: INFURA,
      // });
      //   const provider = new providers.Web3Provider(walletConnectProvider);

      const rpcAddress =
        process.env.NODE_ENV === "development"
          ? "http://localhost:8545"
          : `https://rinkeby.infura.io/v3/${INFURA}`;

      const provider = new ethers.providers.JsonRpcProvider(rpcAddress);

      // walletConnectProvider.enable().then(() => {
      console.log(connector);
      if (connector) {
        const chainId = connector.chainId;
        setUser({
          address: connector.accounts[0],
          signer: null,
          type: WalletTypes.WALLET_CONNECT,
          chainId,
        });
        const contractAddress = YaytsoInterface.networks[NETWORK_ID].address;
        const contract = new ethers.Contract(
          contractAddress,
          YaytsoInterface.abi,
          provider
        );
        setContract(contract);
        setProvider(provider);
      }
      // });
      console.log(connector);

      // Redundant
      connector.on("session_update", (error, payload) => {
        if (error) {
          throw error;
        }

        // Get updated accounts and chainId
        console.log(payload);
        const { accounts, chainId } = payload.params[0];
        setUser({
          type: WalletTypes.WALLET_CONNECT,
          signer: null,
          address: accounts[0],
          chainId,
        });
      });

      // DUnno about this part
      connector.on("connect", (error, payload) => {
        if (error) {
          throw error;
        }
        // Get provided accounts and chainId
        const { accounts, chainId } = payload.params[0];
        setUser({
          address: accounts,
          signer: null,
          type: WalletTypes.WALLET_CONNECT,
          chainId,
        });
      });
    }

    if (!connector.connected && window.localStorage.getItem("walletconnect")) {
      disposeWalletConnect();
    }

    // TESTINGTTTTTTTTTTTTTTTTTTTTTTTTTTTTT
    const onResize = () => {
      if (window.innerWidth > 768) {
        setIsDesk(true);
      } else {
        setIsDesk(false);
      }
    };

    window.addEventListener("resize", onResize, false);

    return () => window.removeEventListener("resize", onResize, false);
  }, []);

  return (
    <Context.Provider
      value={{
        pattern,
        clearPattern,
        setPattern,
        user,
        contract,
        provider,
        connectWalletConnect,
        web3Connect,
        recipient,
        setRecipient,
        uploadPattern,
        isDesk,
        disconnectWallet,
      }}
    >
      {children}
    </Context.Provider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <CanvasProvider>
      <ContextProvider>
        <App />
      </ContextProvider>
    </CanvasProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
