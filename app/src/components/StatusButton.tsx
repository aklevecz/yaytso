export default function StatusButton({
    context,
    onChange,
    shipState,
    shipIt,
    doneFabbing,
    setGiftingState,
}: any) {
    console.log(shipState);
    return (
        <>
            {" "}
            {!context.pattern && (
                <div className="input-container">
                    <label className="upload-label">
                        <input
                            onChange={onChange}
                            type="file"
                            id="upload-input"
                        />
                        upload pattern
                    </label>
                </div>
            )}
            {context.pattern && (
                <>
                    <div
                        className={`ship-it-container ${
                            shipState === "PINNING" ? "shipping" : ""
                        }`}
                    >
                        <button
                            onClick={() => {
                                console.log(shipState);
                                if (shipState === "") {
                                    doneFabbing();
                                } else {
                                    shipIt();
                                }
                            }}
                        >
                            {shipState === "" && "done fabbing?"}
                            {shipState === "READY_TO_SHIP" && "ship it?"}
                            {shipState === "PINNING" && "pinning..."}
                            {shipState === "SIGNING" && "plz sign!"}
                            {shipState === "MINTING" && "INC EGG!!"}
                            {shipState === "COMPLETE" && "FUCK YES!!"}
                        </button>
                    </div>
                    <div>
                        <button
                            onClick={() => {
                                context.clearPattern();
                                setGiftingState("");
                            }}
                            className="sm clear"
                        >
                            clean egg
                        </button>
                    </div>
                </>
            )}
        </>
    );
}
