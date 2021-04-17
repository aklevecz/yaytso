import React, { useEffect, useState } from "react";
import { RepeatWrapping, CanvasTexture } from "three";

import ReactDOM from "react-dom";
import "./index.css";
import "./styles/egg.css";
import "./styles/upload.css";
import "./styles/nav.css";
import "./styles/collection.css";
import "./styles/modal.css";
import App from "./App";
import { Texture } from "three";
import { ethers } from "ethers";
import YaytsoInterface from "./contracts/Yaytso.json";

declare global {
  interface Window {
    ethereum: any;
  }
}

type User = {
  address: string;
  signer: ethers.providers.JsonRpcSigner | null;
};

enum Who {
  ME = "me",
  FRIEND = "friend",
}

type Recipient = {
  address: string;
  type: Who;
};

export type ContextAttrs = {
  pattern: Texture | null;
  clearPattern: Function;
  setPattern: Function;
  user: User | null;
  contract: ethers.Contract | null;
  web3Connect: Function;
  recipient: Recipient | null;
  setRecipient: Function;
  uploadPattern: (e: React.FormEvent<HTMLInputElement>) => void;
};

const NETWORK_ID = process.env.NODE_ENV === "development" ? 1618544051137 : 4;
export const Context = React.createContext<ContextAttrs>({
  pattern: null,
  clearPattern: () => {},
  setPattern: () => {},
  user: { address: "", signer: null },
  contract: null,
  web3Connect: () => {},
  recipient: null,
  setRecipient: () => {},
  uploadPattern: () => {},
});

function ContextProvider({ children }: { children: React.ReactChild }) {
  const [pattern, setPattern] = useState(null);
  const [user, setUser] = useState<User | null>(null);
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  const clearPattern = () => setPattern(null);

  const uploadPattern = (e: React.FormEvent<HTMLInputElement>) => {
    const files = (e.target as HTMLInputElement).files;
    if (files === null || files.length === 0) {
      return;
    }
    const file = files[0];

    const reader = new FileReader();
    reader.onload = function (e: any) {
      const img = e.target.result;
      // wtf LOL
      const imgPreviewRef: any = { current: null };
      imgPreviewRef.current = document.getElementById(
        "img-preview"
      ) as HTMLImageElement;
      imgPreviewRef!.current!.src = img;
      console.log(imgPreviewRef);
      (document.getElementById("tiny") as HTMLImageElement).src = img;

      imgPreviewRef!.current!.onload = (e: any) => {
        const canvasRef: any = { current: null };
        canvasRef.current = document.getElementById(
          "preview-canvas"
        ) as HTMLCanvasElement;
        console.log(canvasRef);
        const img = e.target as any;
        if (canvasRef.current !== null) {
          const ctx = canvasRef.current.getContext("2d");
          const height = 200;
          const width = 200;
          ctx!.canvas.height = height;
          ctx!.canvas.width = width;
          const imgSize = Math.min(img.width, img.height);
          const left = (img.width - imgSize) / 2;
          const top = (img.height - imgSize) / 2;
          ctx!.fillStyle = "white";
          ctx!.fillRect(0, 0, ctx!.canvas.width, ctx!.canvas.height);
          ctx?.drawImage(
            imgPreviewRef!.current!,
            left,
            top,
            imgSize,
            imgSize,
            0,
            0,
            ctx.canvas.width,
            ctx.canvas.height
          );
          //    const texture = new TextureLoader().load(e.target.result);
          const texture = new CanvasTexture(ctx!.canvas);
          texture.wrapS = RepeatWrapping;
          texture.wrapT = RepeatWrapping;
          texture.flipY = false;

          const reptitions = 7;
          texture.repeat.set(reptitions, reptitions);
          setPattern(texture as any);

          const tinyCanvas = document.getElementById(
            "tiny"
          ) as HTMLCanvasElement;
          const tinyContext = tinyCanvas!.getContext("2d");
          tinyContext!.drawImage(
            canvasRef.current,
            0,
            0,
            width,
            height,
            0,
            0,
            40,
            40
          );

          var c = document.getElementById("repeater") as HTMLCanvasElement;
          if (!c) {
            return;
          }
          var rctx = c.getContext("2d");
          rctx!.clearRect(0, 0, c.width, c.height);
          var t = document.getElementById("tiny") as HTMLImageElement;
          //   t.style.width = "10px";
          //   t.height = 80;
          if (!t) {
            return;
          }
          var pat = rctx!.createPattern(t, "repeat")!;
          rctx!.rect(0, 0, 200, 200);
          rctx!.fillStyle = pat;
          rctx!.fill();
          (document.getElementById("egg-mask") as any).setAttribute(
            "xlink:href",
            c.toDataURL()
          );
        }
      };
    };

    reader.readAsDataURL(file);
  };

  const web3Connect = () => {
    if (!window.ethereum) {
      return alert("sorry but I don't see a wallet to connect to :(");
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then((account: any) => {
        const signer = provider.getSigner();
        setUser({ signer, address: account[0] });
      });
  };

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      signer
        .getAddress()
        .then((address) => setUser({ address, signer }))
        .catch((e) => {
          window.ethereum
            .request({
              method: "eth_requestAccounts",
            })
            .then((account: any) => {
              const signer = provider.getSigner();
              setUser({ signer, address: account[0] });
            });
        });
      const contractAddress = YaytsoInterface.networks[NETWORK_ID].address;
      const contract = new ethers.Contract(
        contractAddress,
        YaytsoInterface.abi,
        provider
      );
      setContract(contract);
    }
  }, []);

  return (
    <Context.Provider
      value={{
        pattern,
        clearPattern,
        setPattern,
        user,
        contract,
        web3Connect,
        recipient,
        setRecipient,
        uploadPattern,
      }}
    >
      {children}
    </Context.Provider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>
      <App />
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
