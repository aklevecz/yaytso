const fs = require("fs");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const upload = multer();
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
const { NFTStorage, Blob, File, FormData } = require("nft.storage");
const IPFS = require("ipfs-core");
const apiKey = fs.readFileSync(".secret").toString().trim();
const metadataFile = fs.readFileSync("metadataTemplate.json");

const dev = true;

(async () => {
    const client = dev
        ? await IPFS.create()
        : new NFTStorage({ token: apiKey });

    const store = async (blob) => {
        let id;
        if (dev) {
            const { cid } = await client.add(blob);
            id = cid.toString();
        } else {
            const b = new Blob([blob]);
            id = await client.storeBlob([b]);
        }
        return id;
    };

    app.post("/", upload.any(), async (req, res) => {
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
        console.log(metaCID);
        return res.send({ metaCID, svgCID });
    });

    const port = process.env.PORT || 8082;
    app.listen(port, () => {
        console.log("NFT-Service listening on port", port);
    });
})();
