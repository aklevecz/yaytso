import { Dispatch, SetStateAction } from "react";
import { RepeatWrapping, CanvasTexture } from "three";
import { GATEWAY_URL, PIN_URL } from "../constants";

export const pinBlobs = (data: FormData) =>
  fetch(PIN_URL, {
    method: "POST",
    body: data,
  })
    .then((r) => r.json())
    .then((d) => d);

export const fetchEggApplyId = (uri: string, id?: string) => {
  return fetch(`${GATEWAY_URL}/${uri.replace("ipfs://", "")}`)
    .then((r) => {
      return r.json();
    })
    .then((d) => {
      d.tokenId = id;
      return d;
    });
};

export const readFile = (
  e: ProgressEvent<FileReader>,
  setPattern: Dispatch<SetStateAction<CanvasTexture | null>>
) => {
  if (e.target === null) {
    return alert("I can't read this shit");
  }
  const img = e.target.result;
  if (typeof img !== "string") {
    return alert("I'm confused by this upload... a single img please!");
  }

  const imgPreview = document.getElementById("img-preview") as HTMLImageElement;
  imgPreview.src = img;
  (document.getElementById("tiny") as HTMLImageElement).src = img;

  imgPreview.onload = (e: any) => {
    const canvas = document.getElementById(
      "preview-canvas"
    ) as HTMLCanvasElement;
    const img = e.target as any;
    if (canvas !== null) {
      const ctx = canvas.getContext("2d");
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
        imgPreview,
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
      setPattern(texture as CanvasTexture);

      const tinyCanvas = document.getElementById("tiny") as HTMLCanvasElement;
      const tinyContext = tinyCanvas!.getContext("2d");
      tinyContext!.drawImage(canvas, 0, 0, width, height, 0, 0, 40, 40);

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
