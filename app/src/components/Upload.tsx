import { Canvas } from "../contexts/CanvasContext";
import PreviewImgs from "../containers/PreviewImgs";
import StatusButton from "./StatusButton";

export default function Upload({
  canvas,
  doneFabbing,
  shipIt,
  shipState,
  isSending,
}: {
  canvas: Canvas;
  shipIt: () => void;
  shipState: string;
  doneFabbing: () => void;
  isSending: boolean;
}) {
  return (
    <div className={`upload-container ${canvas.pattern ? "shipping" : ""}`}>
      <StatusButton
        isPattern={!!canvas.pattern}
        onChange={canvas.uploadPattern}
        shipState={shipState}
        shipIt={shipIt}
        doneFabbing={doneFabbing}
        isSending={isSending}
      />
      <PreviewImgs showPreview={!!canvas.pattern} />
    </div>
  );
}
