import { useContext, useEffect, useState } from "react";
import Egg from "../components/Egg";
import { Context } from "..";

export const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs";
export default function Collection() {
  const context = useContext(Context);
  const [fetching, setFetching] = useState(true);
  const [eggSons, setEggSons] = useState<any[]>([]);

  const getCollection = async () => {
    if (context.contract && context.user && context.user.address) {
      const contract = context.contract;

      const totalSupply = await contract.totalSupply().catch(console.log);
      let owned = [];
      let uriToTokenId: { [key: string]: number } = {};
      for (let i = 1; i < parseInt(totalSupply, 10) + 1; i++) {
        const owner = await contract.ownerOf(i);
        if (owner === context.user.address) {
          const ipfsURI = await contract.tokenURI(i);
          uriToTokenId[ipfsURI] = i;
          owned.push(ipfsURI);
        }
        if (owned.length === 0) {
          setFetching(false);
        }
        const eggmises = owned.map((uri) => {
          return fetch(`${PINATA_GATEWAY}/${uri.replace("ipfs://", "")}`)
            .then((r) => {
              return r.json();
            })
            .then((d) => {
              d.tokenId = uriToTokenId[uri];
              return d;
            });
        });

        Promise.all(eggmises).then((eggson) => {
          setEggSons(eggson);
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
  console.log(eggSons.length);
  return (
    <div className="collection-container">
      {!context.user && (
        <div className="oops">oops! you aren't connected to web3!</div>
      )}
      {context.user && !fetching && eggSons.length === 0 && (
        <div className="oops">you don't have any eggs!</div>
      )}
      {context.user && fetching && (
        <div className="lds-heart">
          <div>__fetching...</div>
        </div>
      )}
      {eggSons.map((eggson, i) => {
        return (
          <div className="collection-item-container" key={`egg${i}`}>
            <div className="collection-item-name">
              {eggson.name} {eggson.tokenId}
            </div>
            <Egg
              givenGLTF={(eggson.animation_url as string).replace(
                "ipfs://",
                PINATA_GATEWAY + "/"
              )}
            />
          </div>
        );
      })}
    </div>
  );
}
