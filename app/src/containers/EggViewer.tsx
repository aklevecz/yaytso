import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Context } from "..";
import EggKolletiv from "./EggKolletiv";
import EggLoader from "../components/EggLoader";
import { DETAILS } from "../components/graphical/DETAILS";
import { getEgg, YaytsoMetaData } from "../libs/contract";
import { createPinataURL } from "../libs/services";

export default function EggViewer() {
  const { id } = useParams<{ id: string }>();
  const context = useContext(Context);
  const [eggaData, setEggaData] = useState<YaytsoMetaData>();
  const [showEggtails, setShowEggtails] = useState(false);

  const toggleEggtails = () => setShowEggtails(!showEggtails);

  useEffect(() => {
    if (context.contract) {
      getEgg(parseInt(id), context.contract).then((metadata) =>
        setEggaData(metadata)
      );
    }
  }, [id, context.contract]);

  if (!eggaData?.animation_url) {
    return (
      <div className="viewer-tainer">
        <EggLoader centered={true} />
      </div>
    );
  }

  return (
    <div>
      <div
        className={`viewer-metadata ${
          showEggtails || context.isDesk ? "open" : "closed"
        }`}
      >
        <div className="viewer-metadata-id">
          #{id} {eggaData.name}
        </div>
        <div className="viewer-metadata-name"></div>
        <div className="viewer-metadata-desc">
          <img
            style={{ borderBottom: "1px solid" }}
            src={createPinataURL(eggaData.image)}
            alt="eeeep"
          />
          {eggaData.description}
        </div>
        <div className="viewer-metadata-owner">
          {" "}
          <div style={{ textDecoration: "underline" }}>owner:</div>
          {eggaData.owner === context.user?.address
            ? `you! :) (${context.user?.address})`
            : eggaData.owner}
        </div>
      </div>
      {!context.isDesk && (
        <div
          onClick={toggleEggtails}
          className={`eggtail-toggle ${showEggtails ? "open" : "closed"}`}
        >
          <DETAILS />
        </div>
      )}
      <EggKolletiv
        endScale={1}
        gltfUrl={createPinataURL(eggaData?.animation_url)}
      />
    </div>
  );
}
