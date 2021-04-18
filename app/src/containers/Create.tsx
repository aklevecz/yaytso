import { useContext, useEffect, useRef, useState } from "react";
import Egg from "../components/Egg";
import Upload from "../components/Upload";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import Smiler from "../components/Smiler";
import { Context } from "..";
import GiftModal from "./modals/GiftModal";
import { createBlobs } from "../libs/create";
import { pinBlobs } from "../libs/services";
import { mintEgg } from "../libs/contract";
import Recipient from "../components/Recipient";

export const shipStates = {
  READY_TO_SHIP: "READY_TO_SHIP",
  PINNING: "PINNING",
  SIGNING: "SIGNING",
  MINTING: "MINTING",
  COMPLETE: "COMPLETE",
};

const giftingStates = {
  RECIPIENT: "RECIPIENT",
};

export default function Create() {
  const context = useContext(Context);

  const [giftingState, setGiftingState] = useState("");
  const [shipState, setShipState] = useState("");

  const sceneRef = useRef<THREE.Scene>();

  const errorCallback = (e: Error) => {
    setShipState("");
    setGiftingState("");
    console.log(e);
    if (e && e.message.includes("no dupes")) {
      alert("no dupes sorry");
    } else {
      alert(
        "hmm something went wrongggggggggg -- probably a dupe or your wallet is acting weird"
      );
    }
  };

  const txResolution = async (tx: any) => {
    const receipt = await tx.wait();
    for (const event of receipt.events) {
      if (event.event !== "Transfer" && event.event !== "YaytsoMinted") {
        console.log("ignoring event ", event.event);
        continue;
      }
      console.log(event);
      setShipState(shipStates.COMPLETE);
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
  };

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
      async (result) => {
        if (
          !context.recipient ||
          !context.contract ||
          !context.user ||
          !context.user.signer
        ) {
          return alert("not authed");
        }
        if (!context.contract) {
          return alert("no contract");
        }

        const data = createBlobs(result);

        setShipState(shipStates.PINNING);

        const resp = await pinBlobs(data);

        const contractSigner = context.contract.connect(context.user.signer);

        setShipState(shipStates.SIGNING);

        const tx = await mintEgg(contractSigner, context, resp, errorCallback);

        console.log(tx);

        if (!tx) {
          return;
        }
        setShipState(shipStates.MINTING);
        txResolution(tx);
      },
      { onlyVisible: true }
    );
  };

  useEffect(() => {
    if (context.pattern === null) {
      setShipState("");
    }
  }, [context.pattern]);

  // Side effect to shrink egg and show recipient when they are about to send it
  useEffect(() => {
    const egg = document.getElementById("the-egg") as HTMLCanvasElement;
    if (!egg) {
      return;
    }
    if (shipState === shipStates.READY_TO_SHIP) {
      egg.style.width = parseFloat(egg.style.width) * 0.5 + "px";
      egg.style.height = parseFloat(egg.style.height) * 0.5 + "px";
    } else {
      egg.style.width = window.innerWidth + "px";
      egg.style.height = window.innerHeight * 0.4 + "px";
    }
  }, [shipState]);

  const clean = () => {
    context.clearPattern();
    setShipState("");
    setGiftingState("");
  };

  // Clear pattern on dismount
  useEffect(() => {
    return () => clean();
    // eslint-disable-next-line
  }, []);

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
      <div className="upper-container">
        <div>
          <Egg sceneRef={sceneRef} shipState={shipState} clean={clean} />
        </div>
        {shipState === shipStates.READY_TO_SHIP && context.recipient && (
          <Recipient recipient={context.recipient} />
        )}
      </div>
      <div className="create-bottom-container">
        <Upload
          context={context}
          shipIt={shipIt}
          doneFabbing={() => setGiftingState(giftingStates.RECIPIENT)}
          shipState={shipState}
        />
        <Smiler shipState={shipState} isPattern={!!context.pattern} />
      </div>
      <GiftModal
        visible={giftingState === giftingStates.RECIPIENT}
        setGiftingState={setGiftingState}
        readyToShip={() => setShipState(shipStates.READY_TO_SHIP)}
        transactionCompleted={shipState === shipStates.COMPLETE}
      />
    </div>
  );
}
