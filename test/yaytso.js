const { assert } = require("chai");
const CID = require("cids");

const Yaytso = artifacts.require("YaytsoV2");
// const MINTED_EVENT = "YaytsoMinted";
const MINTED_EVENT = "YaytsoLaid";

const getMintedEvent = (logs) => {
  for (let i = 0; i < logs.length; i++) {
    if (logs[i].event === MINTED_EVENT) {
      return logs[i];
    }
  }
};

const getTokenId = (resp) => {
  const event = getMintedEvent(resp.logs);
  return event.args._tokenId.toString();
};

contract("Testing yaytso V2", async (accounts) => {
  let instance;
  beforeEach(async () => {
    instance = await Yaytso.deployed();
  });

  it("creates egg, creator is owner", async () => {
    const dag = "bafkreiaoqwrvqfe6fyqku3uu6pigxwarodneknkazsthavlfmhvelp4p3m";
    const cid = new CID(dag);
    const bytes = cid.bytes.slice(4);
    const patternHash = web3.utils.bytesToHex(bytes);
    const uri = "first-token-uri";
    await instance.layYaytso(accounts[0], patternHash, uri);
    const firstToken = await instance.ownerOf(1);
    assert.equal(firstToken, accounts[0]);
  });

  it("creates egg. uri is expected uri", async () => {
    const pattern = web3.utils.asciiToHex("second-pattern-hash");
    const uri = "second-token-uri";
    const resp = await instance.layYaytso(accounts[0], pattern, uri);
    const tokenId = getTokenId(resp);

    const tokenURI = await instance.tokenURI(tokenId);
    assert.equal(tokenURI, `ipfs://${uri}`);
  });

  it("cannot create dupe", async () => {
    const dupePattern = web3.utils.asciiToHex("third-pattern-hash");
    const uri = "thid-token-uri";
    const resp = await instance.layYaytso(accounts[0], dupePattern, uri);
    const tokenId = getTokenId(resp);
    const firstTokenUri = await instance.tokenURI(tokenId);
    assert.equal(firstTokenUri, `ipfs://${uri}`);
    await instance.layYaytso(accounts[0], dupePattern, uri).catch((e) => {
      assert.equal(e.reason, "no dupes");
    });
  });

  it("finds the tokens of the owner", async () => {
    const resp = await instance.yaytsosOfOwner(accounts[0]);
    assert.isAbove(resp.length, 0);
  });
});
