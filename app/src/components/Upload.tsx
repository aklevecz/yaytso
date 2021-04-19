import { ContextAttrs } from "..";
import PreviewImgs from "./PreviewImgs";
import StatusButton from "./StatusButton";

export default function Upload({
  context,
  doneFabbing,
  shipIt,
  shipState,
}: {
  context: ContextAttrs;
  shipIt: () => void;
  shipState: string;
  doneFabbing: () => void;
}) {
  return (
    <div className={`upload-container ${context.pattern ? "shipping" : ""}`}>
      <StatusButton
        isPattern={!!context.pattern}
        onChange={context.uploadPattern}
        shipState={shipState}
        shipIt={shipIt}
        doneFabbing={doneFabbing}
      />
      <PreviewImgs showPreview={!!context.pattern} />
    </div>
  );
}
