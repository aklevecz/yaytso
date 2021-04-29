import { useCallback, useContext, useEffect, useState } from "react";
import EggKolletiv from "./EggKolletiv";
import { WalletContext } from "../contexts/WalletContext";
import { yaytsoOfOwner } from "../libs/contract";
import { fetchEggApplyId } from "../libs/services";
import { EYE } from "../components/graphical/EYE";
import { Link } from "react-router-dom";
import { createPinataURL } from "../libs/utils";

type EggMetaData = {
  animation_url: string;
  name: string;
  tokenId: number;
};

export default function Collection() {
  const context = useContext(WalletContext);
  const [fetching, setFetching] = useState(true);
  const [eggSons, setEggSons] = useState<EggMetaData[]>([]);

  const getCollection = useCallback(async () => {
    if (context.contract && context.user && context.user.address) {
      const owned = await yaytsoOfOwner(context.user.address, context.contract);

      if (owned.length === 0) {
        setFetching(false);
      }

      const eggmises = owned.map((uri) => {
        return fetchEggApplyId(uri.uri, uri.id);
      });

      Promise.all(eggmises).then((eggson) => {
        setEggSons(eggson);
        setFetching(false);
      });
    }
  }, [context.contract, context.user]);

  useEffect(() => {
    if (context.user && context.user.address) {
      getCollection();
    } else {
      setFetching(false);
    }
  }, [context.user, getCollection]);

  // Yikes
  // Maybe I should make a context for all of these UI antipatterns to keep track of them
  useEffect(() => {
    const c = document.querySelector(
      ".container-of-containerz"
    ) as HTMLDivElement;
    if (c) {
      c.classList.add("override-height");
    }

    return () => {
      if (c) {
        c.classList.remove("override-height");
      }
    };
  }, []);

  return (
    <div
      className="collection-container"
      style={{ overflow: fetching ? "hidden" : "auto" }}
    >
      {context.user && !context.user.address && (
        <div className="oops">oops! you aren't connected to web3!</div>
      )}
      {context.user &&
        context.user.address &&
        !fetching &&
        eggSons.length === 0 && (
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
            <div className="collection-item-name">#{eggson.tokenId}</div>
            <Link to={`/egg/${eggson.tokenId}`}>
              <div className="collection-eye">
                <EYE />
              </div>
            </Link>
            <EggKolletiv
              gltfUrl={createPinataURL(eggson.animation_url as string)}
            />
          </div>
        );
      })}
    </div>
  );
}
