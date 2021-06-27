import { useContext, useEffect, useRef, useState } from "react";
import Egg from "./Egg";
import Upload from "../components/Upload";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import Smiler from "../components/Smiler";
import { contractAdapter, WalletContext } from "../contexts/WalletContext";
import GiftModal from "./modals/GiftModal";
import { createBlobs } from "../libs/create";
import { pinBlobs } from "../libs/services";
import { mintEgg } from "../libs/contract";
import Recipient from "../components/Recipient";
import ReceiptModal from "./modals/Receipt";
import { ethers } from "ethers";
import { CanvasContext } from "../contexts/CanvasContext";
import { useHistory } from "react-router";
import { WalletTypes } from "../types";

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

export type Receipt = {
  recipient: string | null;
  txHash: string | null;
  tokenId: string | number;
  metadata: string;
  svgCID: string;
  contractAddress: string;
};

export default function Create() {
  const context = useContext(WalletContext);
  const canvasContext = useContext(CanvasContext);
  const history = useHistory();

  const [giftingState, setGiftingState] = useState("");
  const [shipState, setShipState] = useState("");

  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const sceneRef = useRef<THREE.Scene>();

  useEffect(() => {
    const hashPath = window.location.hash;
    if (hashPath) {
      const newPath = hashPath.replace(/#\//g, "");
      history.push(`/${newPath}`);
    }
  }, [history]);

  const clean = () => {
    setShipState("");
    setGiftingState("");
    canvasContext.clearPattern();
  };

  const errorCallback = (e: Error) => {
    clean();
    console.log(e);
    if (e && e.message.includes("no dupes")) {
      alert("no dupes sorry");
    } else {
      alert(
        "hmm something went wrongggggggggg -- probably a dupe or your wallet is acting weird"
      );
    }
  };

  const OLD_MINTED_EVENT = "YaytsoMinted";
  const MINTED_EVENT = "YaytsoLaid";

  const txResolution = async (tx: any, metadata: string, svgCID: string) => {
    const receipt = await tx.wait();
    for (const event of receipt.events) {
      if (
        event.event !== "Transfer" &&
        event.event !== MINTED_EVENT &&
        event.event !== OLD_MINTED_EVENT
      ) {
        console.log("ignoring event ", event.event);
        continue;
      }
      console.log(event);
      setShipState(shipStates.COMPLETE);

      try {
        const tokenId = event.args._tokenId.toString();
        const txHash = event.transactionHash;
        setReceipt({
          ...receipt,
          tokenId,
          txHash,
          recipient: context.recipient && context.recipient.address,
          metadata,
          svgCID,
          contractAddress: context.contract && context.contract.address,
        });
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
          !context.user
          // ||!context.user.signer
        ) {
          return alert("not authed");
        }
        if (!context.contract) {
          return alert("no contract");
        }
        const data = createBlobs(
          result,
          context.recipient.desc,
          context.recipient.eggName
        );
        setShipState(shipStates.PINNING);
        const resp = await pinBlobs(data);
        var arr: any = [];
        for (var p in Object.getOwnPropertyNames(resp.byteArray)) {
          arr[p] = resp.byteArray[p];
        }

        const patternHash = ethers.utils.hexlify(arr);

        setShipState(shipStates.SIGNING);

        if (context.user.type === WalletTypes.WALLET_CONNECT) {
          // const bytesArray = ethers.utils.base58.decode(resp.svgCID).slice(2);
          // const hex = ethers.utils.hexlify(bytesArray);
          const raw = await context.contract.populateTransaction.layYaytso(
            context.recipient!.address,
            patternHash,
            resp.metaCID
          );
          const tx = {
            from: context.user.address,
            to: raw.to,
            data: raw.data,
            // gasPrice: ethers.utils.hexlify(80000000000), // Optional
          };

          // This event could be else where but it is contained here at least
          const connector = contractAdapter.connector;
          connector
            .sendTransaction(tx)
            .then((txHash) => {
              setShipState(shipStates.MINTING);
              const filter = context.contract!.filters.Transfer(
                null,
                context.recipient!.address
              );
              context.contract!.on(filter, (from, to, amount, event) => {
                console.log(from, to, amount, event);
                const recipient = to;
                const tokenId = amount.toString();
                setShipState(shipStates.COMPLETE);
                setReceipt({
                  ...receipt,
                  tokenId,
                  txHash,
                  recipient,
                  metadata: resp.metaCID,
                  svgCID: resp.svgCID,
                  contractAddress: context.contract!.address!,
                });
                context.contract!.off(filter, () => {
                  console.log("stop listening");
                });
              });
              // -----

              // Maybe not necessary
              let intervalId = setInterval(getTx, 2000);
              function getTx() {
                context.provider
                  ?.getTransactionReceipt(txHash)
                  .then((t) => {
                    console.log("beep");
                    if (t && t.blockNumber) {
                      console.log("complete");
                      clearInterval(intervalId);
                    }
                  })
                  .catch(console.log);
              }
              // ------
            })
            .catch((e) => {
              alert(e);
              //Error: User rejected the transaction
            });
        } else if (
          context.user.type === WalletTypes.METAMASK &&
          context.user.signer
        ) {
          const contractSigner = context.contract.connect(context.user.signer);

          const tx = await mintEgg(
            contractSigner,
            context,
            resp,
            patternHash,
            errorCallback
          );

          console.log(tx);

          if (!tx) {
            return;
          }
          setShipState(shipStates.MINTING);
          txResolution(tx, resp.metaCID, resp.svgCID);
        }
      },
      { onlyVisible: true }
    );
  };

  useEffect(() => {
    if (canvasContext.pattern === null) {
      setShipState("");
    }
  }, [canvasContext.pattern]);

  // Shitty reducers
  const showRecipient =
    shipState === shipStates.READY_TO_SHIP ||
    shipState === shipStates.PINNING ||
    shipState === shipStates.MINTING ||
    shipState === shipStates.SIGNING ||
    shipState === shipStates.COMPLETE;

  const isSending =
    shipState === shipStates.PINNING ||
    shipState === shipStates.MINTING ||
    shipState === shipStates.SIGNING;
  // Side effect to shrink egg and show recipient when they are about to send it
  useEffect(() => {
    const egg = document.getElementById("the-egg") as HTMLCanvasElement;
    if (!egg) {
      return;
    }
    if (showRecipient && window.innerWidth < 768) {
      const halfWidth = window.innerWidth * 0.5;
      egg.style.width = halfWidth + "px";
      egg.style.height = window.innerHeight * 0.4 * 0.5 + "px";
    } else {
      egg.style.width = window.innerWidth + "px";
      egg.style.height = window.innerHeight * 0.4 + "px";
    }
  }, [shipState, showRecipient]);

  // Clear pattern on dismount
  useEffect(() => {
    return () => clean();
    // eslint-disable-next-line
  }, []);

  // NOTE: State here is a mess
  // shipState defines what the button is doing basically
  // giftingState regulates the general state of having picked a recipient

  // Probably should have a context for all of the ship interactions since they will cause lots of rendering anyway

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
        {showRecipient && context.recipient && (
          <Recipient recipient={context.recipient} isSending={isSending} />
        )}
      </div>
      <div className="create-bottom-container">
        <Upload
          canvas={canvasContext}
          shipIt={shipIt}
          doneFabbing={() => setGiftingState(giftingStates.RECIPIENT)}
          shipState={shipState}
          isSending={isSending}
        />
        <Smiler shipState={shipState} isPattern={!!canvasContext.pattern} />
      </div>
      {giftingState === giftingStates.RECIPIENT && (
        <GiftModal
          visible={giftingState === giftingStates.RECIPIENT}
          setGiftingState={setGiftingState}
          readyToShip={() => setShipState(shipStates.READY_TO_SHIP)}
          transactionCompleted={shipState === shipStates.COMPLETE}
        />
      )}
      {shipState === shipStates.COMPLETE && receipt && (
        <ReceiptModal receipt={receipt} />
      )}
    </div>
  );
}
