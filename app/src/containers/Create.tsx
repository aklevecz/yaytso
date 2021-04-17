import { useContext, useEffect, useRef, useState } from "react";
import Egg from "../components/Egg";
import Upload from "../components/Upload";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import Smiler from "../components/Smiler";
import { Context } from "..";
import GiftModal from "./modals/GiftModal";

const PIN_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8082"
    : "https://nft-service-i3w4qwywla-uc.a.run.app";

export default function Create() {
  const context = useContext(Context);

  const [giftingState, setGiftingState] = useState("");
  const [shipState, setShipState] = useState("");

  const sceneRef = useRef<THREE.Scene>();
  // NOTE: This can obviously be broken up
  const shipIt = async () => {
    if (!context.user) {
      return alert("you are not connected to web3!");
    }
    if (!sceneRef.current) {
      return;
    }
    const exporter = new GLTFExporter();
    exporter.parse(
      sceneRef.current,
      (result) => {
        const output = JSON.stringify(result);
        const blob = new Blob([output], { type: "text/json" });
        const data = new FormData();
        data.append("gltf", blob);

        const eggvg = document.getElementById("eggvg") as any;
        const eggClone = eggvg.cloneNode(true);
        const outerHTML = eggClone.outerHTML;
        const svgBlob = new Blob([outerHTML], {
          type: "image/svg+xml;charset=utf-8",
        });
        data.append("svg", svgBlob);
        setShipState("PINNING");
        fetch(PIN_URL, {
          method: "POST",
          body: data,
        })
          .then((r) => r.json())
          .then(async (resp) => {
            if (
              context &&
              context.user &&
              context.recipient &&
              context.contract &&
              context.user.signer
            ) {
              const contractSigner = context.contract.connect(
                context.user.signer
              );
              setShipState("SIGNING");
              const txt = await contractSigner
                .mintEgg(
                  // context.user.address,
                  context.recipient.address,
                  resp.svgCID,
                  resp.metaCID
                )
                .catch((e: any) => {
                  setShipState("");
                  setGiftingState("");
                  console.log(e);
                  if (
                    e.error &&
                    e.error.message === "execution reverted: no dupes"
                  ) {
                    alert("no dupes sorry");
                  } else {
                    alert("hmm something went wrongggggggggg");
                  }
                });
              console.log(txt);
              if (!txt) {
                return;
              }
              setShipState("MINTING");
              const receipt = await txt.wait();
              for (const event of receipt.events) {
                if (
                  event.event !== "Transfer" &&
                  event.event !== "YaytsoMinted"
                ) {
                  console.log("ignoring event ", event.event);
                  continue;
                }
                console.log(event);
                setShipState("COMPLETE");
                setTimeout(() => {
                  setShipState("");
                  setGiftingState("");
                }, 3000);
                try {
                  console.log(event.args._tokenId.toString());
                } catch (e) {
                  console.log(event.args);
                }
              }
            }
          });
      },
      { onlyVisible: true }
    );
  };

  useEffect(() => {
    if (context.pattern === null) {
      setShipState("");
    }
  }, [context.pattern]);

  // NOTE: State here is a mess
  // shipState defines what the button is doing basically
  // giftingState regulates the general state of having picked a recipient

  // NOTE: Upload component has a lot of drliling to change state appropriately

  // STATES ARE:
  // all === ""
  // context.pattern !== ""
  // giftingState === "" shipItState === ""
  // giftingState === "recipient"
  // context.recipient.type === user || friend && context.recipient === address
  // shipItState === "PINNING"
  // shipItState lifecycle through the blockchain...
  return (
    <div className="egg-tainer">
      <Egg sceneRef={sceneRef} shipState={shipState} />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <Upload
          context={context}
          shipIt={shipIt}
          doneFabbing={() => setGiftingState("recipient")}
          setGiftingState={setGiftingState}
          shipState={shipState}
        />
        <Smiler shipState={shipState} />
      </div>
      <GiftModal
        visible={giftingState === "recipient"}
        setGiftingState={setGiftingState}
        readyToShip={() => setShipState("READY_TO_SHIP")}
        transactionCompleted={shipState === "COMPLETE"}
      />
    </div>
  );
}
