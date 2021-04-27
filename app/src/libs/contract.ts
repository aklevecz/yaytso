import { Contract, ethers } from "ethers";
import { ContextAttrs } from "..";
import { createPinataURL } from "./services";

export const mintEgg = (
  contractSigner: ethers.Contract,
  context: ContextAttrs,
  resp: any,
  patternHash: string,
  errorCallback: any
): ethers.Transaction => {
  // const bytesArray = ethers.utils.base58.decode(resp.svgCID).slice(2);
  // const hex = ethers.utils.hexlify(bytesArray);
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
  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const { chainId } = await provider.getNetwork();
  return signer.getAddress().then((address) => ({ address, signer, chainId }));
};

// MAY NEED TO CHECK ACTIVE WALLET ON EACH CALL
export const getOwnersEggs = async (
  totalSupply: number,
  contract: Contract,
  address: string
): Promise<{ owned: string[]; uriToTokenId: { [key: string]: number } }> => {
  let owned = [];
  let uriToTokenId: { [key: string]: number } = {};
  for (let i = 1; i < totalSupply + 1; i++) {
    const owner = await contract.ownerOf(i);
    console.log(i, owner, address);
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
  const uri = await contract.tokenURI(id);
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

export const bytes32HexToIPFSHash = (hash: string) => {
  const prefix = "1220";
  return ethers.utils.base58.encode("0x" + prefix + hash.slice(2));
};
