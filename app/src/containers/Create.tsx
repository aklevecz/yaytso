import { useContext, useEffect, useRef, useState } from "react";
import Egg from "../components/Egg";
import Upload from "../components/Upload";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import Smiler from "../components/Smiler";
import { Context } from "..";
import userEvent from "@testing-library/user-event";

const PIN_URL =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8082"
        : "https://nft-service-i3w4qwywla-uc.a.run.app";

export default function Create() {
    const context = useContext(Context);
    const [shipState, setShipState] = useState("");
    const sceneRef = useRef<THREE.Scene>();
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
                            context.contract &&
                            context.user.signer
                        ) {
                            const contractSigner = context.contract.connect(
                                context.user.signer
                            );
                            setShipState("SIGNING");
                            const txt = await contractSigner
                                .mintEgg(
                                    context.user.address,
                                    resp.svgCID,
                                    resp.metaCID
                                )
                                .catch((e: any) => {
                                    if (
                                        e.error &&
                                        e.error.message ===
                                            "execution reverted: no dupes"
                                    ) {
                                        alert("no dupes sorry");
                                        setShipState("");
                                    } else {
                                        alert(
                                            "hmm something went wrongggggggggg"
                                        );
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
                                    event.event !== "YaysoMinted"
                                ) {
                                    console.log("ignoring event ", event.event);
                                    continue;
                                }
                                setShipState("COMPLETE");
                                setTimeout(() => setShipState(""), 3000);
                                console.log(event.args.tokenId.toString());
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
    return (
        <div className="egg-tainer">
            <Egg sceneRef={sceneRef} shipState={shipState} />
            <Upload context={context} shipIt={shipIt} shipState={shipState} />
            <Smiler shipState={shipState} />
        </div>
    );
}
