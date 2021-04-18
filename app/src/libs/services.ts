import { Dispatch, SetStateAction } from "react";
import { RepeatWrapping, CanvasTexture } from "three";

export const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs";

export const createPinataURL = (uri: string) =>
  uri.replace("ipfs://", PINATA_GATEWAY + "/");

const PIN_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8082"
    : "https://nft-service-i3w4qwywla-uc.a.run.app";

export const pinBlobs = (data: FormData) =>
  fetch(PIN_URL, {
    method: "POST",
    body: data,
  })
    .then((r) => r.json())
    .then((d) => d);

export const fetchEggApplyId = (
  uri: string,
  uriToTokenId: { [key: string]: number }
) => {
  return fetch(`${PINATA_GATEWAY}/${uri.replace("ipfs://", "")}`)
    .then((r) => {
      return r.json();
    })
    .then((d) => {
      d.tokenId = uriToTokenId[uri];
      return d;
    });
};

export const readFile = (
  e: ProgressEvent<FileReader>,
  setPattern: Dispatch<SetStateAction<null>>
) => {
  if (e.target === null) {
    return alert("I can't read this shit");
  }
  const img = e.target.result;
  if (typeof img !== "string") {
    return alert("I'm confused by this upload... a single img please!");
  }
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

      const tinyCanvas = document.getElementById("tiny") as HTMLCanvasElement;
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
