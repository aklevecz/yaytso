import { Contract, ethers } from "ethers";
import { ContextAttrs } from "..";

export const mintEgg = (
  contractSigner: ethers.Contract,
  context: ContextAttrs,
  resp: any,
  errorCallback: any
) =>
  contractSigner
    .mintEgg(context.recipient!.address, resp.svgCID, resp.metaCID)
    .catch(errorCallback);

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
