export const INFURA = "e835057bad674697959be47dcac5028e";

export const YAYTSO_MAIN_ADDRESS = "0x155b65c62e2bf8214d1e3f60854df761b9aa92b3";
export const CARTON_MAIN_ADDRESS = "0x7c05cf1a1608eE23652014FB12Cb614F3325CFB5";

export const WALLETCONNECT_LOCALSTORAGE_KEY = "wallconnect";

export const WEB_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://yaytso.art";

export const GATEWAY_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080/ipfs"
    : "https://gateway.pinata.cloud/ipfs";

export const PIN_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8082"
    : "https://nft-service-i3w4qwywla-uc.a.run.app";

export const LAT_LA = 34.04362997897908;
export const LNG_LA = -118.2376335045432;
