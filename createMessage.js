const { ethers } = require("ethers");
const INFURA = "e835057bad674697959be47dcac5028e";
const network = "rinkeby";

const provider = new ethers.providers.JsonRpcProvider(
  `https://${network}.infura.io/v3/${INFURA}`
);
const zero =
  "0x2e32e31d4d9eb89b5fda490d4e6e13155dc1981f439675099533f2eb7755c34d";
let zeroWallet = new ethers.Wallet(zero);
zeroWallet = zeroWallet.connect(provider);
const hashedMessage = ethers.utils.solidityKeccak256(
  ["uint256", "uint256"],
  [1, 1]
);
const msgArray = ethers.utils.arrayify(hashedMessage);
(async () => {
  const signedMessage = await zeroWallet.signMessage(msgArray);

  console.log(zeroWallet.address);
  console.log(hashedMessage);
  console.log(signedMessage);
})();
