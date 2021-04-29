export const INFURA = "e835057bad674697959be47dcac5028e";

export const YAYTSO_MAIN_ADDRESS = "0x155b65c62e2bf8214d1e3f60854df761b9aa92b3";

export const WALLETCONNECT_LOCALSTORAGE_KEY = "wallconnect";

export const GATEWAY_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080/ipfs"
    : "https://gateway.pinata.cloud/ipfs";

export const PIN_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8082"
    : "https://nft-service-i3w4qwywla-uc.a.run.app";
