import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { ethers } from "ethers";
import { INFURA, YAYTSO_MAIN_ADDRESS } from "./constants";
import YaytsoInterface from "./contracts/YaytsoV2.json";

const WALLET_CONNECT_BRIDGE = "https://bridge.walletconnect.org";
const LOCAL_HOST = "http://localhost:8545";
const createInfuraURL = (network: string) =>
  `https://${network}.infura.io/v3/${INFURA}`;

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

  getProvider(chainId: number): ethers.providers.JsonRpcProvider {
    const network = chainId === 1 ? "mainnet" : "rinkeby";
    const rpcAddress =
      process.env.NODE_ENV !== "development"
        ? LOCAL_HOST
        : createInfuraURL(network);

    const provider = new ethers.providers.JsonRpcProvider(rpcAddress);
    return provider;
  }

  getContractI(
    chainId: number,
    provider: ethers.providers.JsonRpcProvider
  ): ethers.Contract {
    let contractAddress: string;
    if (chainId === 1) {
      contractAddress = YAYTSO_MAIN_ADDRESS;
    } else {
      // jank
      if (chainId === 1337) {
        const id = "1619754703768";
        contractAddress = YaytsoInterface.networks[id].address;
      } else {
        contractAddress =
          chainId === 4 ? YaytsoInterface.networks[chainId].address : "0x0";
      }
    }
    const contract = new ethers.Contract(
      contractAddress,
      YaytsoInterface.abi,
      provider
    );
    return contract;
  }
}
