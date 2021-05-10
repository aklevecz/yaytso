const { ethers } = require("ethers");
const YaytsoABI = require("./app/src/contracts/Yaytso.json");
const CartonABI = require("./app/src/contracts/Carton.json");
const INFURA = "e835057bad674697959be47dcac5028e";
const network = "rinkeby";
const provider = new ethers.providers.JsonRpcProvider(
  `https://${network}.infura.io/v3/${INFURA}`
);
const testNet = "1619977803039";
const contractAddress = YaytsoABI.networks[testNet].address;
const contract = new ethers.Contract(contractAddress, YaytsoABI.abi, provider);

// const cartonAddress = CartonABI.networks[testNet].address;
const cartonAddress = "0x71F4E84E041E6b7d7De19189ff162f0CD65380bB";
const cartonContract = new ethers.Contract(
  cartonAddress,
  CartonABI.abi,
  provider
);

const one =
  "0xe07c6d79a8ff432c647afac3ee65a0719909494e60b72d492f795e72266770d9";
const zero =
  "0xd386e3dac68bcd13d229a89eef9fc4ee2610ab7c708d0c9ba91998752fa9462c";
let zeroWallet = new ethers.Wallet(zero);
zeroWallet = zeroWallet.connect(provider);
let oneWallet = new ethers.Wallet(one);
oneWallet = oneWallet.connect(provider);
const patternHash = "aaameepo";

(async () => {
  const id = 1;
  const nonce = 1;
  const hashedMessage = ethers.utils.solidityKeccak256(
    ["uint256", "uint256"],
    [id, nonce]
  );
  const msgArray = ethers.utils.arrayify(hashedMessage);
  const signedMessage = await zeroWallet.signMessage(msgArray);
  console.log(signedMessage);
})();
