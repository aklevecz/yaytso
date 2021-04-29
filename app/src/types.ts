import { ethers } from "ethers";

export const NETWORK_ID =
  process.env.NODE_ENV === "development" ? 1618882316581 : 4;
export enum WalletTypes {
  WALLET_CONNECT,
  METAMASK,
}

export type User = {
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

export type WalletContextTypes = {
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
  disconnectWallet: () => void;
};
