import { PEN_ICON } from "../components/graphical/PEN_ICON";
import { useDraw } from "../contexts/CanvasContext";
const height = 200;
const width = 200;
export default function PreviewImgs({ showPreview }: { showPreview: boolean }) {
  const {
    increaseDims,
    decreaseDims,
    changeColor,
    showCanvas,
    canvasDims,
    drawColor,
    setShowCanvas,
  } = useDraw();

  return (
    <>
      <img style={{ display: "none" }} alt="broken" id="img-preview" />
      {!showCanvas && !showPreview && (
        <div onClick={() => setShowCanvas(true)} className="draw-button">
          <PEN_ICON />
        </div>
      )}
      <div
        className="preview-canvas-container"
        style={{
          opacity: showPreview || showCanvas ? 1 : 0,
          transition: "opacity 1s",
        }}
      >
        <canvas
          className="preview-canvas"
          id="preview-canvas"
          height={height}
          width={width}
          style={{
            width: canvasDims.width,
            height: canvasDims.height,
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <button className="round" onClick={decreaseDims}>
            -
          </button>
          <button className="round" onClick={increaseDims}>
            +
          </button>
        </div>
        <div>
          <input
            style={{
              width: 60,
              margin: 6,
              fontSize: 10,
              color: drawColor,
            }}
            onChange={changeColor}
          ></input>
        </div>
      </div>
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
    </>
  );
}
