const { assert } = require("chai");
const { ethers } = require("ethers");
const Yaytso = artifacts.require("YaytsoV2");
const Carton = artifacts.require("Carton");

contract("Testing carton", async (accounts) => {
  let yaytsoI;
  let cartonI;
  let lat = ethers.utils.formatBytes32String("30.1");
  let lon = ethers.utils.formatBytes32String("31.0");
  beforeEach(async () => {
    // THERE IS A NEW CARTON EACH ROUND, BUT SAME YAYTSO
    yaytsoI = await Yaytso.deployed();
    cartonI = await Carton.new(yaytsoI.address);
    const one =
      "0xe07c6d79a8ff432c647afac3ee65a0719909494e60b72d492f795e72266770d9";
    const zero =
      "0xd386e3dac68bcd13d229a89eef9fc4ee2610ab7c708d0c9ba91998752fa9462c";
    this.provider = new ethers.providers.Web3Provider(web3.currentProvider);
    this.zeroWallet = new ethers.Wallet(zero, this.provider);
    this.oneWallet = new ethers.Wallet(one, this.provider);
    this.yaytsoContractE = new ethers.Contract(
      yaytsoI.address,
      Yaytso.abi,
      this.provider
    );
    this.yaytsoContractSigner = this.yaytsoContractE.connect(this.zeroWallet);
    this.cartonContractE = new ethers.Contract(
      cartonI.address,
      Carton.abi,
      this.provider
    );
    this.cartonContractE = this.cartonContractE.connect(this.zeroWallet);
    web3.eth.sendTransaction({
      to: this.zeroWallet.address,
      from: accounts[0],
      value: web3.utils.toWei(".1", "ether"),
    });
    // await cartonI.setYaytsoAddress(yaytsoI.address);
  });

  it("Creates a box", async () => {
    await cartonI.createBox(lat, lon);
    const box = await cartonI.Boxes(1);
    assert.equal(box.lat, lat);
    assert.equal(box.lon, lon);
  });

  it("Fills a box", async () => {
    const key = this.zeroWallet.address;
    const pattern = ethers.utils.formatBytes32String("test");
    const uri = "first-token-uri";
    await this.yaytsoContractSigner.layYaytso(key, pattern, uri);
    // await yaytsoI.layYaytso(key, pattern, uri);
    const carton = this.cartonContractE;
    await carton.createBox(lat, lon);
    await this.yaytsoContractSigner.approve(cartonI.address, 1);
    await carton.fillBox(1, key, 1);
    const boxId = await carton.boxIdToTokenId(1);
    const box = await carton.Boxes(1);
    assert.equal(boxId, 1);
  });

  it("Box is locked", async () => {
    const key = this.zeroWallet.address;
    await cartonI.createBox(lat, lon);
    await this.yaytsoContractSigner.approve(cartonI.address, 1);
    await cartonI.fillBox(1, key, 1);
    const box = await cartonI.Boxes(1);
    assert.equal(box.locked, true);
  });

  it("Box has a nonce of 1", async () => {
    const key = this.zeroWallet.address;
    await cartonI.createBox(lat, lon);
    await this.yaytsoContractSigner.approve(cartonI.address, 1);
    await cartonI.fillBox(1, key, 1);
    const box = await cartonI.Boxes(1);
    const nonce = parseInt(box.nonce, 10);
    assert.equal(nonce, 1);
  });

  it("Can't fill a filled box", async () => {
    const key = this.zeroWallet.address;
    const pattern = web3.utils.asciiToHex("two");
    const uri = "second-token-uri";
    await yaytsoI.layYaytso(key, pattern, uri);
    await cartonI.createBox(lat, lon);
    await this.yaytsoContractSigner.approve(cartonI.address, 2);

    await cartonI.fillBox(1, key, 2);
    const pattern2 = web3.utils.asciiToHex("three");
    const uri2 = "third-token-uri";
    await yaytsoI.layYaytso(key, pattern2, uri2);
    await cartonI.fillBox(1, key, 3).catch((e) => {
      assert.equal(e.reason, "BOX_IS_LOCKED");
    });
  });

  it("Key must own yaytso", async () => {
    await cartonI.createBox(lat, lon);
    await this.yaytsoContractSigner.approve(cartonI.address, 1);

    await cartonI.fillBox(1, accounts[1], 1).catch((e) => {
      assert.equal(e.reason, "KEY_MUST_BE_OWNER");
    });
  });

  it("Verifies a signed message", async () => {
    const id = 1;
    const nonce = 1;
    const hashedMessage = ethers.utils.solidityKeccak256(
      ["uint256", "uint256"],
      [id, nonce]
    );
    const msgArray = ethers.utils.arrayify(hashedMessage);
    const signedMessage = await this.zeroWallet.signMessage(msgArray);
    const verified = await cartonI.verify(
      this.zeroWallet.address,
      id,
      nonce,
      signedMessage
    );
    assert.equal(verified, true);
  });

  it("Rejects a signature from the wrong address", async () => {
    const wrongAccount = accounts[1];
    const id = 1;
    const nonce = 1;
    const hashedMessage = ethers.utils.solidityKeccak256(
      ["uint256", "uint256"],
      [id, nonce]
    );
    const msgArray = ethers.utils.arrayify(hashedMessage);
    const signedMessage = await this.zeroWallet.signMessage(msgArray);
    const verified = await cartonI.verify(
      wrongAccount,
      id,
      nonce,
      signedMessage
    );
    assert.equal(verified, false);
  });

  it("Rejects an incorrect nonce", async () => {
    const id = 1;
    const nonce = 1;
    const hashedMessage = ethers.utils.solidityKeccak256(
      ["uint256", "uint256"],
      [id, nonce]
    );
    const msgArray = ethers.utils.arrayify(hashedMessage);
    const signedMessage = await this.zeroWallet.signMessage(msgArray);
    const key = this.zeroWallet.address;
    await cartonI.createBox(lat, lon);
    await this.yaytsoContractSigner.approve(cartonI.address, 1);
    await cartonI.fillBox(1, key, 1);
    await cartonI.claimYaytso(1, 2, signedMessage).catch((e) => {
      assert.equal(e.reason, "NONCE_MISMATCH");
    });
  });

  it("Claims a box", async () => {
    const id = 1;
    const nonce = 1;
    const hashedMessage = ethers.utils.solidityKeccak256(
      ["uint256", "uint256"],
      [id, nonce]
    );
    const msgArray = ethers.utils.arrayify(hashedMessage);
    const signedMessage = await this.zeroWallet.signMessage(msgArray);
    const key = this.zeroWallet.address;
    await cartonI.createBox(lat, lon);
    await this.yaytsoContractSigner.approve(cartonI.address, 1);
    await cartonI.fillBox(1, key, 1);
    await cartonI.claimYaytso(1, 1, signedMessage);
    const newOwner = await yaytsoI.ownerOf(1);
    assert.equal(newOwner, accounts[0]);
  });
});
