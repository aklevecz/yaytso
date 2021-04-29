import { createContext, useEffect, useState } from "react";
import { ContractAdapter } from "../ContractManager";
import { WalletContextTypes, Recipient, User, WalletTypes } from "../types";
import { ethers } from "ethers";
import { getSignerAndAddress, requestAccount } from "../libs/contract";
import { WALLETCONNECT_LOCALSTORAGE_KEY } from "../constants";

export const WalletContext = createContext<WalletContextTypes>({
  user: { address: "", signer: null, type: null, chainId: null },
  contract: null,
  provider: null,
  connectWalletConnect: () => {},
  web3Connect: () => {},
  recipient: null,
  setRecipient: () => {},
  disconnectWallet: () => {},
});

export const contractAdapter = new ContractAdapter();
const WalletContextProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
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

  const disconnectWallet = () => {
    setUser({ address: "", signer: null, type: null, chainId: null });
    contractAdapter.connector.killSession();
    window.location.href = window.location.host;
    window.location.reload();
  };

  const web3Connect = async () => {
    if (!window.ethereum) {
      return alert("sorry but I don't see a wallet to connect to :(");
    }
    const { signer, address, chainId } = await requestAccount();
    setUser({ chainId, type: WalletTypes.METAMASK, signer, address });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = contractAdapter.getContractI(chainId, provider);
    setContract(contract);
    setProvider(provider);

    window.ethereum.on("networkChanged", (networkId: any) => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const contract = contractAdapter.getContractI(networkId, provider);
      setContract(contract);
      getSignerAndAddress(provider).then(({ address, signer, chainId }) =>
        setUser({
          type: WalletTypes.METAMASK,
          address,
          signer,
          chainId,
        })
      );
    });
    window.ethereum.on("accountsChanged", function (accounts: string[]) {
      getSignerAndAddress(provider).then(({ address, signer, chainId }) =>
        setUser({
          type: WalletTypes.METAMASK,
          address,
          signer,
          chainId,
        })
      );
    });
  };

  const connectWalletConnect = async () => {
    contractAdapter.startSession();
  };

  useEffect(() => {
    contractAdapter.connector.on("connect", async (error, payload) => {
      console.log("connected");
      if (error) {
        throw error;
      }
      const provider = contractAdapter.getProvider(
        contractAdapter.connector.chainId
      );
      const contract = contractAdapter.getContractI(
        contractAdapter.connector.chainId,
        provider
      );
      const { accounts, chainId } = payload.params[0];
      setContract(contract);
      setProvider(provider);
      setUser({
        address: accounts[0],
        signer: null,
        type: WalletTypes.WALLET_CONNECT,
        chainId,
      });
    });

    contractAdapter.connector.on("session_update", (error, payload) => {
      if (error) {
        throw error;
      }
      const { accounts, chainId } = payload.params[0];
      const provider = contractAdapter.getProvider(chainId);
      const contract = contractAdapter.getContractI(chainId, provider);
      setProvider(provider);
      setContract(contract);
      setUser({
        type: WalletTypes.WALLET_CONNECT,
        signer: null,
        address: accounts[0],
        chainId,
      });
    });
  }, []);

  useEffect(() => {
    if (contractAdapter.connector.connected) {
      if (contractAdapter.connector) {
        const chainId = contractAdapter.connector.chainId;
        const provider = contractAdapter.getProvider(chainId);
        const contract = contractAdapter.getContractI(chainId, provider);
        setUser({
          address: contractAdapter.connector.accounts[0],
          signer: null,
          type: WalletTypes.WALLET_CONNECT,
          chainId,
        });
        setProvider(provider);
        setContract(contract);
      }
    }
    if (window.ethereum) {
      web3Connect();
    } else {
      if (!contractAdapter.connector.connected) {
        const chainId = 1;
        const provider = contractAdapter.getProvider(chainId);
        const contract = contractAdapter.getContractI(chainId, provider);
        setProvider(provider);
        setContract(contract);
      }
    }
    if (
      !contractAdapter.connector.connected &&
      window.localStorage.getItem(WALLETCONNECT_LOCALSTORAGE_KEY)
    ) {
      contractAdapter.connector.killSession();
    }
  }, []);
  return (
    <WalletContext.Provider
      value={{
        user,
        contract,
        provider,
        connectWalletConnect,
        web3Connect,
        recipient,
        setRecipient,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContextProvider;
