const fs = require("fs");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const QRCode = require("qrcode");
const CID = require("cids");
const upload = multer();
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
const { NFTStorage, Blob } = require("nft.storage");
const IPFS = require("ipfs-core");
const apiKey = fs.readFileSync(".secret").toString().trim();
const metadataFile = fs.readFileSync("metadataTemplate.json");
const k =
  "?m=0xe2b644e5dc5906e765dff54b57f64a6ad4e656116562dab977f52b625b918a64760c8da05d2897c0b8444f7ec8bedfe5ae388e6616cc099f7e9dd1970d725bc71c&i=1&n=1";
const dev = process.env.NODE_ENV === "dev";
(async () => {
  const client = dev ? await IPFS.create() : new NFTStorage({ token: apiKey });

  const store = async (blob) => {
    let id;
    if (dev) {
      const { cid } = await client.add(blob);
      id = cid.toString();
    } else {
      const b = new Blob([blob]);
      id = await client.storeBlob(b);
    }
    return id;
  };
  app.get("/", (req, res) => {
    res.send(process.env.NODE_ENV);
  });
  app.get("/qr", (req, res) => {
    QRCode.toDataURL(k, (e, r) => {
      console.log(e);
      res.send(r);
    });
  });
  app.post("/", upload.any(), async (req, res) => {
    const name = req.body.name;
    const desc = req.body.desc;
    const gltf = req.files[0];
    const svg = req.files[1];
    const gltfCID = await store(gltf.buffer);
    const svgCID = await store(svg.buffer);
    const metadata = JSON.parse(metadataFile);
    metadata.image = metadata.image.replace("__HASH__", svgCID);
    metadata.animation_url = metadata.animation_url.replace(
      "__HASH__",
      gltfCID
    );
    metadata.name = name;
    metadata.description = desc;

    let meta_id;
    const metaString = JSON.stringify(metadata);
    if (dev) {
      const { cid } = await client.add(metaString);
      meta_id = cid.toString();
    } else {
      const metadataBlob = new Blob([metaString]);
      meta_id = await store(metadataBlob);
    }
    const metaCID = meta_id;

    const sliceAmt = dev ? 2 : 4;
    const byteArray = new CID(svgCID).bytes.slice(sliceAmt);
    return res.send({ metaCID, svgCID, byteArray });
  });

  const port = process.env.PORT || 8082;
  app.listen(port, () => {
    console.log("NFT-Service listening on port", port);
  });
})();
