export default function StatusButton({
    context,
    onChange,
    shipState,
    shipIt,
    findRecipient,
}: any) {
    console.log(shipState)
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
                            shipState ? "shipping" : ""
                        }`}
                    >
                        <button
                            onClick={() => {
                                if (shipState === "") {
                                    findRecipient();
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
                    <div
                        onClick={() => context.clearPattern()}
                        className="clear"
                    >
                        clean egg
                    </div>
                </>
            )}
        </>
    );
}
