import { Contract, ethers, Wallet } from "ethers";
import { contractAdapter } from "../contexts/WalletContext";
import { User, WalletContextTypes, WalletTypes } from "../types";
import { createPinataURL } from "./utils";

export const mintEgg = (
  contractSigner: ethers.Contract,
  context: WalletContextTypes,
  resp: any,
  patternHash: string,
  errorCallback: any
): ethers.Transaction => {
  return contractSigner
    .layYaytso(context.recipient!.address, patternHash, resp.metaCID)
    .catch(errorCallback);
};

export const requestAccount = (): Promise<{
  address: string;
  signer: ethers.providers.JsonRpcSigner;
  chainId: number;
}> => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return window.ethereum
    .request({
      method: "eth_requestAccounts",
    })
    .then(async (accounts: string[]) => {
      const signer = provider.getSigner();
      const { chainId } = await provider.getNetwork();
      return { signer, address: accounts[0], chainId };
    });
};

export const getSignerAndAddress = async (
  provider: ethers.providers.Web3Provider
) => {
  const signer = provider.getSigner();
  const { chainId } = await provider.getNetwork();
  return signer.getAddress().then((address) => ({ address, signer, chainId }));
};

export const getOwnersEggs = async (
  totalSupply: number,
  contract: Contract,
  address: string
): Promise<{ owned: string[]; uriToTokenId: { [key: string]: number } }> => {
  let owned = [];
  let uriToTokenId: { [key: string]: number } = {};
  for (let i = 1; i < totalSupply + 1; i++) {
    const owner = await contract.ownerOf(i);
    if (owner === address) {
      const ipfsURI = await contract.tokenURI(i);
      uriToTokenId[ipfsURI] = i;
      owned.push(ipfsURI);
    }
  }

  return { owned, uriToTokenId };
};

export type YaytsoMetaData = {
  animation_url: string;
  attributes: {
    display_type: string;
    trait_type: string;
    value: number;
  };
  description: string;
  image: string;
  name: string;
  owner?: string;
};

export const getEgg = async (
  id: number,
  contract: Contract
): Promise<YaytsoMetaData> => {
  console.log(id, contract.address);
  const uri = await contract.tokenURI(id).catch(console.log);
  const owner = await contract.ownerOf(id);
  const metadata = await fetch(createPinataURL(uri))
    .then((r) => r.json())
    .then((d) => {
      d.owner = owner;
      return d;
    });
  return metadata;
};

export const yaytsoOfOwner = async (
  owner: string,
  contract: Contract
): Promise<any[]> => {
  let tokenUris = [];
  try {
    const yaytsoIds = await contract.yaytsosOfOwner(owner);
    tokenUris = yaytsoIds.map(async (id: any) => {
      const idString = id.toString();
      return contract.tokenURI(idString).then((uri: string) => {
        return { uri, id: idString };
      });
    });
  } catch (e) {
    console.log("no eggs");
  }
  return Promise.all(tokenUris);
};

export const claimYaytso = async (
  boxId: string,
  nonce: string,
  signature: string,
  contract: Contract,
  user: User | null
) => {
  if (!user) {
    alert("no user");
    return console.log("user error");
  }
  let tx;
  if (user.type === WalletTypes.METAMASK) {
    if (!user.signer) {
      return console.log("signer missing");
    }
    const contractSigner = contract.connect(user.signer);
    tx = contractSigner.claimYaytso(boxId, nonce, signature);
  } else if (user.type === WalletTypes.WALLET_CONNECT) {
    const raw = await contract.populateTransaction.claimYaytso(
      boxId,
      nonce,
      signature
    );
    const rawTx = {
      from: user.address,
      to: raw.to,
      data: raw.data,
    };
    const connector = contractAdapter.connector;
    tx = await connector.sendTransaction(rawTx);
  }

  return tx;
};

export const bytes32HexToIPFSHash = (hash: string) => {
  const prefix = "1220";
  return ethers.utils.base58.encode("0x" + prefix + hash.slice(2));
};
