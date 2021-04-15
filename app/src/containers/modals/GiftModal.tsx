import { useContext, useEffect, useState } from "react";
import { Context } from "../..";
import Modal from "../Modal";

const SendToFriend = ({ setAddress, setCornfirmation }: any) => (
    <>
        <div className="modal-paragraph">ok! what is their address?</div>
        <input onChange={(e) => setAddress(e.target.value)} type="text"></input>
        <div>
            <button
                className="sm"
                onClick={() => {
                    setCornfirmation(true);
                }}
            >
                corntinue
            </button>
        </div>
    </>
);

const FriendOfYourself = ({ setForMe }: any) => (
    <>
        <div className="modal-paragraph">is this egg for your or a friend?</div>
        <div className="button-wrapper">
            <button className="sm" onClick={() => setForMe("me")}>
                me!
            </button>
            <button className="sm" onClick={() => setForMe("friend")}>
                a friend!
            </button>
        </div>
    </>
);

const Cornfirm = ({
    close,
    forWho,
    address,
    setCornfirm,
    giftingSetup,
}: any) => (
    <>
        <div className="modal-paragraph">
            you are sending an egg to{" "}
            {forWho === "me" ? "yourself" : `a ${forWho}`}
        </div>
        <div className="modal-paragraph">
            & {forWho === "me" ? "your" : "their"} address is {address}
        </div>
        <div className="button-wrapper">
            <button className="sm" onClick={() => giftingSetup(close)}>
                yep!
            </button>
            <button className="sm" onClick={() => setCornfirm(false)}>
                um no, go back
            </button>
        </div>
    </>
);

// TODO: Sanitize inputs

export default function GiftModal({readyToShip, visible }: any) {
    const context = useContext(Context);
    const [forWho, setForWho] = useState<string | null>(null);
    const [address, setAddress] = useState("");
    const [cornfirmation, setCornfirmation] = useState(false);

    const giftingSetup = (close: any) => {
        context.setRecipient({ address, recipient: forWho });
        readyToShip()
        close();
    };

    useEffect(() => {
        if (forWho === "me") {
            setCornfirmation(true);
        }
    }, [forWho]);

    // NOTE: There is more render proping here than necessary
    // Need to decide where exactly to put Modal open state
    // Maybe it should be passed into this compnent instead of using 
    // render props to pass it into the content
    return (
        <Modal
            visible={visible}
            render={(props: any) => (
                <div className="modal-inner-content">
                    {!cornfirmation && (
                        <>
                            {forWho && <div>egg for: {forWho}</div>}
                            {(address || forWho === "me") && (
                                <div>
                                    address:{" "}
                                    {forWho === "me" && context.user
                                        ? context.user.address
                                        : address}
                                </div>
                            )}
                            {forWho === null && (
                                <FriendOfYourself setForMe={setForWho} />
                            )}
                            {forWho === "friend" && (
                                <SendToFriend
                                    setAddress={setAddress}
                                    setCornfirmation={setCornfirmation}
                                />
                            )}
                        </>
                    )}

                    {cornfirmation && (
                        <Cornfirm
                            forWho={forWho}
                            address={
                                forWho === "me" && context.user
                                    ? context.user.address
                                    : address
                            }
                            close={() => props.setOpen(false)}
                            giftingSetup={giftingSetup}
                        />
                    )}
                </div>
            )}
        ></Modal>
    );
}
