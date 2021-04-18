import { ethers } from "ethers";
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
