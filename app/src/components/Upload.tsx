import React, { useRef, useState } from "react";
import { RepeatWrapping, CanvasTexture } from "three";
import { ContextAttrs } from "..";

export default function Upload({
  context,
  shipIt,
  shipState,
}: {
  context: ContextAttrs;
  shipIt: Function;
  shipState: string;
}) {
  // const context = useContext(Context);
  const imgPreviewRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgSrc, setImgSrc] = useState("");

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const files = (e.target as HTMLInputElement).files;
    if (files === null || files.length === 0) {
      return;
    }
    const file = files[0];

    const reader = new FileReader();
    reader.onload = function (e: any) {
      const img = e.target.result;

      //   setImgSrc(img);
      imgPreviewRef!.current!.src = img;
      (document.getElementById("tiny") as HTMLImageElement).src = img;

      imgPreviewRef!.current!.onload = (e) => {
        const img = e.target as any;
        if (canvasRef.current !== null) {
          const ctx = canvasRef.current.getContext("2d");
          ctx!.canvas.height = 200;
          ctx!.canvas.width = 200;
          const imgSize = Math.min(img.width, img.height);
          console.log(imgSize);
          const left = (img.width - imgSize) / 2;
          const top = (img.height - imgSize) / 2;
          console.log(img);
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

          texture.repeat.set(10, 10);
          context.setPattern(texture);

          const tinyCanvas = document.getElementById(
            "tiny"
          ) as HTMLCanvasElement;
          const tinyContext = tinyCanvas!.getContext("2d");
          tinyContext!.drawImage(
            canvasRef.current,
            0,
            0,
            200,
            200,
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

          //@ts-ignore
          //   rctx.fillStyle = pat;
          //   rctx.fill();
        }
      };
    };

    reader.readAsDataURL(file);
  };
  return (
    <div className={`upload-container ${context.pattern ? "shipping" : ""}`}>
      {!context.pattern && (
        <div className="input-container">
          <label className="upload-label">
            <input onChange={onChange} type="file" id="upload-input" />
            click 2 upload pattern
          </label>
        </div>
      )}
      {context.pattern && (
        <>
          <div className={`ship-it-container ${shipState ? "shipping" : ""}`}>
            <button onClick={() => shipIt()}>
              {shipState === "" && "ship it?"}
              {shipState === "PINNING" && "pinning..."}
              {shipState === "SIGNING" && "plz sign!"}
              {shipState === "MINTING" && "INC EGG!!"}
              {shipState === "COMPLETE" && "FUCK YES!!"}
            </button>
          </div>
          <div onClick={() => context.clearPattern()} className="clear">
            clean egg
          </div>
        </>
      )}
      <img
        style={{ display: "none" }}
        alt="broken"
        ref={imgPreviewRef}
        src={imgSrc}
        onLoad={(e) => console.log(e)}
      />
      <canvas
        className="preview-canvas"
        ref={canvasRef}
        height="200"
        width="200"
        style={{ opacity: context.pattern ? 1 : 0 }}
      />
      <canvas style={{ display: "none" }} id="tiny" width="40" height="40" />
      <canvas
        style={{ display: "none" }}
        id="repeater"
        height="200"
        width="200"
      />
      {/* <button onClick={exportEgg}>EXPORT</button> */}
      <div style={{ width: 500, height: 500, display: "none" }}>
        <svg
          id="eggvg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 216.03 216.03"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <defs>
            <clipPath id="clip-path" transform="translate(56.67 29.81)">
              <path
                id="EGG"
                d="M109.45,96.27A54.73,54.73,0,1,1,0,96.27C0,66.05,24.5,0,54.72,0S109.45,66.05,109.45,96.27Z"
                fill="none"
              />
            </clipPath>
          </defs>
          <g id="Layer_2" data-name="Layer 2">
            <g id="SVG">
              <g clip-path="url(#clip-path)">
                <image
                  id="egg-mask"
                  width="451"
                  height="451"
                  transform="scale(0.48)"
                  xlinkHref=""
                />
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
