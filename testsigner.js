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
  let messageHash = ethers.utils.id("Hello World");

  // Note: messageHash is a string, that is 66-bytes long, to sign the
  //       binary value, we must convert it to the 32 byte Array that
  //       the string represents
  //
  // i.e.
  //   // 66-byte string
  //   "0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba"
  //
  //   ... vs ...
  //
  //  // 32 entry Uint8Array
  //  [ 89, 47, 167, 67, 136, 159, 199, 249, 42, 194, 163,
  //    123, 177, 245, 186, 29, 175, 42, 92, 132, 116, 28,
  //    160, 224, 6, 29, 36, 58, 46, 103, 7, 186]

  let messageHashBytes = ethers.utils.arrayify(messageHash);

  // Sign the binary data
  let rawSig = await oneWallet.signMessage(messageHashBytes);

  //   // All properties on a domain are optional
  //   const domain = {
  //     name: "Ether Mail",
  //     version: "1",
  //     chainId: 1,
  //     verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
  //   };

  //   // The named list of all type definitions
  //   const types = {
  //     Person: [
  //       { name: "name", type: "string" },
  //       { name: "wallet", type: "address" },
  //     ],
  //     Mail: [
  //       { name: "from", type: "Person" },
  //       { name: "to", type: "Person" },
  //       { name: "contents", type: "string" },
  //     ],
  //   };

  //   // The data to sign
  //   const value = {
  //     from: {
  //       name: "Cow",
  //       wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
  //     },
  //     to: {
  //       name: "Bob",
  //       wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
  //     },
  //     contents: "Hello, Bob!",
  //   };

  //   const signature = await oneWallet._signTypedData(domain, types, value);

  // Call the verifyHash function
  const sig = ethers.utils.splitSignature(rawSig);
  //   return;
  let recovered = await cartonContract
    .verifyHash(messageHash, sig.v, sig.r, sig.s)
    .catch(console.log);
  console.log(oneWallet.address);
  console.log(recovered);
})();

// contract.connect(oneWallet);
// contract.populateTransaction
//   .mintEgg(oneWallet.address, patternHash, "test")
//   .then(async (raw) => {
//     const zeroBal = await zeroWallet.getBalance();
//     const oneBal = await oneWallet.getBalance();
//     // return;
//     const t = await oneWallet.sendTransaction(raw);

//     contract.populateTransaction.transferFrom(zeroWallet, oneWallet, 40)

//     receipt = await t.wait();
//     console.log(receipt);
//     // provider.getBalance(one.address).then((t) => console.log(t.toString()));
//   });

// (async () => {
//   const contractSigner = contract.connect(zeroWallet);
//   const raw = await contractSigner.populateTransaction.transferFrom(
//     zeroWallet.address,
//     oneWallet.address,
//     1
//   );
//   const signed = zeroWallet.signTransaction(raw);
//   const tx = await provider.sendTransaction(signed);

//   const receipt = await tx.wait();
//   console.log(receipt);
// })();
