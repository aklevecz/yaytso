import { useContext, useEffect, useState } from "react";
import Egg from "../components/Egg";
import { Context } from "..";

export const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs";
export default function Collection() {
  const context = useContext(Context);
  const [fetching, setFetching] = useState(true);
  const [eggLTs, setEggLTFs] = useState([]);
  const getCollection = async () => {
    if (context.contract && context.user && context.user.address) {
      const contract = context.contract;

      const totalSupply = await contract.totalSupply().catch(console.log);
      let owned = [];
      for (let i = 1; i < parseInt(totalSupply, 10) + 1; i++) {
        const owner = await contract.ownerOf(i);
        if (owner === context.user.address) {
          const ipfsURI = await contract.tokenURI(i);
          owned.push(ipfsURI);
        }
        if (owned.length === 0) {
          setFetching(false);
        }
        let eggmises: Array<unknown> = [];
        owned.forEach((uri) => {
          console.log(uri);
          const eggmise = fetch(
            `${PINATA_GATEWAY}/${uri.replace("ipfs://", "")}`
          ).then((r) => r.json());
          eggmises.push(eggmise);
        });
        Promise.all(eggmises).then((eggson) => {
          console.log(eggson);
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
    const c = document.querySelector(
      ".container-of-containerz"
    ) as HTMLDivElement;
    if (c) {
      c.classList.add("override-height");
    }

    return () => c.classList.remove("override-height");
  });
  return (
    <div>
      {!context.user && (
        <div className="oops">oops! you aren't connected to web3!</div>
      )}
      {context.user && !fetching && eggLTs.length === 0 && (
        <div className="oops">you don't have any eggs!</div>
      )}
      {context.user && fetching && <div className="lds-heart"><div>__fetching...</div></div>}
      {eggLTs.map((gltf) => (
        <Egg
          givenGLTF={(gltf as string).replace("ipfs://", PINATA_GATEWAY + "/")}
        />
      ))}
    </div>
  );
}
