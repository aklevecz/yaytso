import { FormEvent } from "react";
import { shipStates } from "../containers/Create";

export default function StatusButton({
  isPattern,
  onChange,
  shipState,
  shipIt,
  doneFabbing,
  isSending,
}: {
  isPattern: boolean;
  onChange: (e: FormEvent<HTMLInputElement>) => void;
  shipState: string;
  shipIt: () => void;
  doneFabbing: () => void;
  isSending: boolean;
}) {
  return (
    <>
      {!isPattern && (
        <div className="input-container">
          <label className="upload-label">
            <input onChange={onChange} type="file" id="upload-input" />
            upload pattern
          </label>
        </div>
      )}
      {isPattern && (
        <>
          <div
            className={`ship-it-container ${
              shipState === shipStates.PINNING ? "shipping" : ""
            }`}
          >
            <button
              disabled={isSending}
              onClick={() => {
                if (shipState === "") {
                  doneFabbing();
                } else {
                  shipIt();
                }
              }}
            >
              {shipState === "" && "done?"}
              {shipState === shipStates.READY_TO_SHIP && "ship it?"}
              {shipState === shipStates.PINNING && "pinning..."}
              {shipState === shipStates.SIGNING && "plz sign!"}
              {shipState === shipStates.MINTING && "INC EGG!!"}
              {shipState === shipStates.COMPLETE && "FUCK YES!!"}
            </button>
          </div>
        </>
      )}
    </>
  );
}
