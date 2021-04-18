import { useContext, useEffect, useState } from "react";
import { Context } from "..";
import WorldScene from "../components/WorldScene";
const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs";
/* eslint-disable */
// NOT MAINTAINED AT THE MOMENT
export default function World() {
  const context = useContext(Context);
  const [fetching, setFetching] = useState(true);
  const [eggLTs, setEggLTFs] = useState([]);
  const getCollection = async () => {
    if (context.contract && context.user && context.user.address) {
      const contract = context.contract;

      const totalSupply = await contract.totalSupply().catch(console.log);
      let eggs = [];
      for (let i = 1; i < parseInt(totalSupply, 10) + 1; i++) {
        const owner = await contract.ownerOf(i);
        if (owner === context.user.address) {
          const ipfsURI = await contract.tokenURI(i);
          eggs.push(ipfsURI);
        }

        let eggmises: Array<unknown> = [];
        eggs.forEach((uri) => {
          const eggmise = fetch(
            `${PINATA_GATEWAY}/${uri.replace("ipfs://", "")}`
          ).then((r) => r.json());
          eggmises.push(eggmise);
        });
        Promise.all(eggmises).then((eggson) => {
          const gltfs = eggson.map((egg: any) => egg.animation_url);
          setEggLTFs(gltfs as any);
          console.log(gltfs);
          setFetching(false);
        });
      }
    }
  };
  useEffect(() => {
    if (context.user) {
      getCollection();
    }
  }, [context]);

  useEffect(() => {
    if (window.innerWidth < window.innerHeight) {
      alert(
        "warning... only works if you have a keyboard and mouse at the moment!"
      );
    }
  }, []);
  //   const egglts = [
  //         "ipfs://bafkreic4m5sk5arnojp33dezr47juhysiutgveq5fz2af2oo35fzv6ckym?filename=yaytso.gltf",
  //     ]
  return (
    <div>
      <WorldScene eggLTs={eggLTs} />
    </div>
  );
}
