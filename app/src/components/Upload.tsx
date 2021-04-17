import { useRef } from "react";
import { ContextAttrs } from "..";
import StatusButton from "./StatusButton";

// This component is more complex than it appears in terms of functionality
// It is doing a lot of canvas drawing under the hood to prepare for the egg journey
export default function Upload({
  context,
  doneFabbing,
  shipIt,
  shipState,
  setGiftingState,
}: {
  context: ContextAttrs;
  shipIt: Function;
  shipState: string;
  doneFabbing: Function;
  setGiftingState: Function;
}) {
  const imgPreviewRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // NOTE: It is hard to rip StatusButton out of here since it is regulating the:
  //      - Upload buttons look and state
  //      - Applying patterns to the canvases
  //      - Upload button being also the ship buttons and status
  const height = 200;
  const width = 200;
  return (
    <div className={`upload-container ${context.pattern ? "shipping" : ""}`}>
      <StatusButton
        context={context}
        onChange={context.uploadPattern}
        // onChange={onChange}
        shipState={shipState}
        shipIt={shipIt}
        doneFabbing={doneFabbing}
        setGiftingState={setGiftingState}
      />
      <img
        style={{ display: "none" }}
        alt="broken"
        ref={imgPreviewRef}
        id="img-preview"
      />
      <canvas
        className="preview-canvas"
        id="preview-canvas"
        ref={canvasRef}
        height={height}
        width={width}
        style={{ opacity: context.pattern ? 1 : 0 }}
      />
      <canvas style={{ display: "none" }} id="tiny" width="40" height="40" />
      <canvas
        style={{ display: "none" }}
        id="repeater"
        height={height}
        width={width}
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
              <g clipPath="url(#clip-path)">
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
