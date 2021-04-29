import { GATEWAY_URL } from "../constants";

export const createPinataURL = (uri: string) =>
  uri.replace("ipfs://", GATEWAY_URL + "/");
