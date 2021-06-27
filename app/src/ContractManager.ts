import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { ethers } from "ethers";
import { CARTON_MAIN_ADDRESS, INFURA, YAYTSO_MAIN_ADDRESS } from "./constants";
import YaytsoInterface from "./contracts/YaytsoV2.json";
import CartonInterface from "./contracts/Carton.json";

const TEST_NET_ID = "1621110716909";

const WALLET_CONNECT_BRIDGE = "https://bridge.walletconnect.org";
const LOCAL_HOST = "http://localhost:8545";
const createInfuraURL = (network: string) =>
  `https://${network}.infura.io/v3/${INFURA}`;

export enum ContractTypes {
  YAYTSO,
  CARTON,
}

type ContractConfig = {
  [type: number]: {
    mainnetAddress: string | null;
    interface: any;
  };
};
const contractConfig: ContractConfig = {
  [ContractTypes.YAYTSO]: {
    mainnetAddress: YAYTSO_MAIN_ADDRESS,
    interface: YaytsoInterface,
  },
  [ContractTypes.CARTON]: {
    mainnetAddress: CARTON_MAIN_ADDRESS,
    interface: CartonInterface,
  },
};

type ProviderType = { type: "metamask" } | { type: "walletConnect" };
export class ContractAdapter {
  providerType: ProviderType | null = null;
  connector: WalletConnect = new WalletConnect({
    bridge: WALLET_CONNECT_BRIDGE, // Required
    qrcodeModal: QRCodeModal,
  });
  constructor() {
    this.connector.on("disconnect", (error, payload) => {
      if (error) {
        throw error;
      }
    });
  }

  startSession = async () => {
    if (!this.connector.connected) {
      await this.connector.createSession();
      return null;
    } else {
      return null;
    }
  };

  // THis is just for creating an infura provider when there is not web3 present
  // It has a rerender issue because the app should wait until it is certain that
  // there is no web3 present
  getProvider(chainId: number): ethers.providers.JsonRpcProvider {
    const network = chainId === 1 ? "mainnet" : "rinkeby";
    // const rpcAddress =
    //   process.env.NODE_ENV === "development"
    //     ? LOCAL_HOST
    //     : createInfuraURL(network);
    const rpcAddress =
      process.env.NODE_ENV === "development" && chainId !== 1 && chainId !== 4
        ? LOCAL_HOST
        : createInfuraURL(network);

    const provider = new ethers.providers.JsonRpcProvider(rpcAddress);
    return provider;
  }

  getContractI(
    contractType: number,
    chainId: number,
    provider:
      | ethers.providers.JsonRpcProvider
      | ethers.providers.Web3Provider
      | ethers.providers.BaseProvider
  ): ethers.Contract {
    let contractAddress: string | null;
    const contractInterface = contractConfig[contractType].interface;
    if (chainId === 1) {
      // contractAddress = YAYTSO_MAIN_ADDRESS;
      contractAddress = contractConfig[contractType].mainnetAddress;
    } else {
      // jank
      if (chainId === 1337) {
        contractAddress = contractInterface.networks[TEST_NET_ID].address;
      } else {
        contractAddress =
          chainId === 4 ? contractInterface.networks[chainId].address : "0x0";
      }
    }
    if (!contractAddress) {
      throw new Error("No contract found");
    }
    const contract = new ethers.Contract(
      contractAddress,
      contractInterface.abi,
      provider
    );
    return contract;
  }
}
