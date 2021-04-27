import { createContext, useContext, useEffect, useRef, useState } from "react";
import { CanvasTexture, RepeatWrapping } from "three";
import { readFile } from "../libs/services";

export type Canvas = {
  pattern: CanvasTexture | null;
  clearPattern: () => void;
  uploadPattern: (e: React.FormEvent<HTMLInputElement>) => void;
  setPattern: (texture: CanvasTexture) => void;
  patternRef: any;
};

export const CanvasContext = createContext<Canvas>({
  pattern: null,
  uploadPattern: () => {},
  clearPattern: () => {},
  setPattern: () => {},
  patternRef: null,
});

const PREVIEW_CANVAS_CLASS = ".preview-canvas";
const CLEAR_COLOR = "#FFFFFF";

const CanvasProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [pattern, setPattern] = useState<CanvasTexture | null>(null);
  const patternRef = useRef(null);

  const clearPattern = () => {
    setPattern(null);
    cleanPreview();
  };

  const cleanPreview = () => {
    const canvas = document.querySelector(
      PREVIEW_CANVAS_CLASS
    ) as HTMLCanvasElement;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    const w = canvas.width;
    const h = canvas.height;

    ctx.rect(0, 0, w, h);
    ctx.fillStyle = CLEAR_COLOR;
    ctx.fill();
  };

  const uploadPattern = (e: React.FormEvent<HTMLInputElement>) => {
    const files = (e.target as HTMLInputElement).files;
    if (files === null || files.length === 0) {
      return;
    }
    const file = files[0];

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => readFile(e, setPattern);
    reader.readAsDataURL(file);
  };

  return (
    <CanvasContext.Provider
      value={{ clearPattern, pattern, uploadPattern, setPattern, patternRef }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export default CanvasProvider;

const dimsScalar = 100;
const MAX = 500;
const MIN = 100;
export function useDraw() {
  const context = useContext(CanvasContext);
  const [canvasDims, setCanvasDims] = useState({ width: 100, height: 100 });
  const [showCanvas, setShowCanvas] = useState(false);

  const [drawColor, setDrawColor] = useState("black");
  const colorRef = useRef("black");

  const changeColor = (e: any) => setDrawColor(e.target.value);

  const increaseDims = () => {
    const { width, height } = canvasDims;
    const isMaxed = width + dimsScalar > MAX;
    setCanvasDims({
      width: isMaxed ? MAX : width + dimsScalar,
      height: isMaxed ? MAX : height + dimsScalar,
    });
  };

  const decreaseDims = () => {
    const { width, height } = canvasDims;
    const isMin = width - dimsScalar < MIN;
    setCanvasDims({
      width: isMin ? MIN : width - dimsScalar,
      height: isMin ? MIN : height - dimsScalar,
    });
  };

  useEffect(() => {
    colorRef.current = drawColor;
  }, [drawColor]);

  useEffect(() => {
    const canvas = document.querySelector(
      PREVIEW_CANVAS_CLASS
    ) as HTMLCanvasElement;
    if (!canvas) {
      return;
    }

    const mousePos = { x: 0, y: 0 };
    const prevMouse = { x: 0, y: 0 };

    let mouseDown = false;
    let mouseMoved = false;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    const w = canvas.width;
    const h = canvas.height;

    ctx.rect(0, 0, w, h);
    ctx.fillStyle = "white";
    ctx.fill();

    const setMouse = (e: any) => {
      mousePos.x = e.touches ? e.touches[0].clientX : e.clientX;
      mousePos.y = e.touches ? e.touches[0].clientY : e.clientY;
    };

    const normalizedPos = () => {
      const rect = canvas.getBoundingClientRect();
      const nX = (mousePos.x - rect.left) * (w / rect.width);
      const nY = (mousePos.y - rect.top) * (h / rect.height);
      return { x: nX, y: nY };
    };

    const onMove = (e: any) => {
      mouseMoved = true;
      setMouse(e);
      const { x: nX, y: nY } = normalizedPos();
      if (mouseDown && prevMouse.x !== 0 && prevMouse.y !== 0) {
        ctx.beginPath();
        ctx.strokeStyle = colorRef.current;
        ctx.lineWidth = 3;
        ctx.moveTo(prevMouse.x, prevMouse.y);
        ctx.lineTo(nX, nY);
        ctx.closePath();
        ctx.stroke();

        const texture = new CanvasTexture(ctx!.canvas);
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.flipY = false;

        const reptitions = 7;
        texture.repeat.set(reptitions, reptitions);

        // TOD: Refactor?
        context.setPattern(texture as THREE.CanvasTexture);

        const tinyCanvas = document.getElementById("tiny") as HTMLCanvasElement;
        const tinyContext = tinyCanvas!.getContext("2d");

        // MAGIC NUMBER LAND :D
        tinyContext!.drawImage(canvas, 0, 0, 200, 200, 0, 0, 40, 40);

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
      prevMouse.x = nX;
      prevMouse.y = nY;
    };

    const onDown = (e: any) => {
      setMouse(e);
      mouseDown = true;
      mouseMoved = false;
    };

    const onUp = (e: any) => {
      if (!mouseMoved) {
        const { x, y } = normalizedPos();
        ctx.fillStyle = colorRef.current;
        ctx.fillRect(x, y, 5, 5);
        mousePos.x = 0;
        mousePos.y = 0;
        prevMouse.x = 0;
        prevMouse.y = 0;
      }
      mouseDown = false;
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchmove", onMove);

    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mouseup", onUp);

    canvas.addEventListener("touchstart", onDown);
    canvas.addEventListener("touchend", onUp);

    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("touchmove", onMove);

      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mouseup", onUp);

      canvas.removeEventListener("touchstart", onDown);
      canvas.removeEventListener("touchend", onUp);
    };

    //eslint-disable-next-line
  }, []);

  return {
    decreaseDims,
    increaseDims,
    changeColor,
    showCanvas,
    canvasDims,
    setShowCanvas,
    drawColor,
  };
}
