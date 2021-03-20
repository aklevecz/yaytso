const fs = require("fs");
const fetch = require("isomorphic-fetch");
const express = require("express");
const cors = require("cors");
const IPFS = require("ipfs-core");
const multer = require("multer");
const upload = multer();
const { parse, stringify } = require("svgson");
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
const { NFTStorage, Blob, File, FormData } = require("nft.storage");
const apiKey = fs.readFileSync(".secret").toString().trim();
const client = new NFTStorage({ token: apiKey });

const metadataFile = fs.readFileSync("metadataTemplate.json");

(async () => {
  app.post("/", upload.any(), async (req, res) => {
    const gltf = req.files[0];
    const svg = req.files[1];
    const gltfBlob = new Blob([gltf.buffer]);
    const gltfCID = await client.storeBlob(gltfBlob);
    const svgBlob = new Blob([svg.buffer]);
    const svgCID = await client.storeBlob(svgBlob);

    const folder = await client.storeDirectory([gltfBlob, svgBlob]);
    console.log(folder);
    const metadata = JSON.parse(metadataFile);
    metadata.image = metadata.image.replace("__HASH__", svgCID);
    metadata.animation_url = metadata.animation_url.replace(
      "__HASH__",
      gltfCID
    );

    const metadataBlob = new Blob([JSON.stringify(metadata)]);
    const metaCID = await client.storeBlob(metadataBlob);
    console.log(metaCID);
    return res.send({ metaCID, svgCID });
  });

  const port = process.env.PORT || 8082;
  app.listen(port, () => {
    console.log("IPFS-Service listening on port", port);
  });
})();
