import { useContext, useEffect, useState } from "react";
import Egg from "../components/Egg";
import { Context } from "..";
import { getOwnersEggs } from "../libs/contract";
import { createPinataURL, fetchEggApplyId } from "../libs/services";

type EggMetaData = {
  animation_url: string;
  name: string;
  tokenId: number;
};

export default function Collection() {
  const context = useContext(Context);
  const [fetching, setFetching] = useState(true);
  const [eggSons, setEggSons] = useState<EggMetaData[]>([]);

  const getCollection = async () => {
    if (context.contract && context.user && context.user.address) {
      const contract = context.contract;

      const totalSupply = await contract.totalSupply().catch(console.log);

      const { owned, uriToTokenId } = await getOwnersEggs(
        parseInt(totalSupply, 10),
        contract,
        context.user.address
      );

      if (owned.length === 0) {
        setFetching(false);
      }

      const eggmises = owned.map((uri) => {
        return fetchEggApplyId(uri, uriToTokenId);
      });

      Promise.all(eggmises).then((eggson) => {
        setEggSons(eggson);
        setFetching(false);
      });
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
            <Egg givenGLTF={createPinataURL(eggson.animation_url as string)} />
          </div>
        );
      })}
    </div>
  );
}
