import { shipStates } from "../containers/Create";

export default function StatusButton({
  context,
  onChange,
  shipState,
  shipIt,
  doneFabbing,
}: any) {
  return (
    <>
      {" "}
      {!context.pattern && (
        <div className="input-container">
          <label className="upload-label">
            <input onChange={onChange} type="file" id="upload-input" />
            upload pattern
          </label>
        </div>
      )}
      {context.pattern && (
        <>
          <div
            className={`ship-it-container ${
              shipState === shipStates.PINNING ? "shipping" : ""
            }`}
          >
            <button
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
          {/* <div>
                        <button
                            onClick={() => {
                                context.clearPattern();
                                setGiftingState("");
                            }}
                            className="sm clear"
                        >
                            clean egg
                        </button>
                    </div> */}
        </>
      )}
    </>
  );
}
