import React, { useContext, useEffect, useState } from "react";
import { ModalInnerContent, ModalParagraph, SmallButton } from ".";
import { Context } from "../..";
import Modal, { withModal } from "../Modal";

const Red = ({children}:{children:JSX.Element | string}) => <span style={{color:"red"}}>{children}</span>

const SendToFriend = ({ setAddress, setCornfirmation }: any) => (
    <>
        <label>ok! what is their address?
        <input onChange={(e) => setAddress(e.target.value)} type="text"></input></label>
        <div>
            <SmallButton
                click={() => {
                    setCornfirmation(true);
                }}
                title="corntinue"
            />
        </div>
    </>
);

const FriendOfYourself = ({ setForMe }: any) => (
    <>
        <div className="modal-paragraph" style={{textAlign:"center"}}>is this egg for you or a friend?</div>
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
    reset,
    giftingSetup,
}: any) => (
    <>
        <div className="modal-paragraph">
            you are sending an egg to{" "}
            <Red>{forWho === "me" ? "your beautiful self" : `a great ${forWho}`}</Red>
        </div>
        <div className="modal-paragraph address">
            & {forWho === "me" ? "your" : "their"} address is <Red>{address}</Red>
        </div>
        <div className="button-wrapper">
            <button className="sm" onClick={() => giftingSetup(close)}>
                yep!
            </button>
            <button className="sm" onClick={reset}>
                um no, go back
            </button>
        </div>
    </>
);

// TODO: Sanitize inputs

function GiftModal({ readyToShip, visible, modalProps, setGiftingState, transactionCompleted }: any) {
    const context = useContext(Context);
    const [forWho, setForWho] = useState<string | null>(null);
    const [address, setAddress] = useState("");
    const [cornfirmation, setCornfirmation] = useState(false);

    const giftingSetup = (close: any) => {
        context.setRecipient({ address, ty: forWho });
        readyToShip();
        close();
    };

    const reset = () => {
        setAddress("")
        setForWho(null)
        setCornfirmation(false)
        setGiftingState("")
    }

    useEffect(() => {
        if (forWho === "me" && context.user) {
            setCornfirmation(true);
            setAddress(context.user.address)
        }
    }, [forWho]);

    useEffect(() => {
        if (transactionCompleted) {
            reset()
        }
    },[transactionCompleted])

    useEffect(() => {
        if (visible) {
            modalProps.setOpen(true);
        } else {
            modalProps.setOpen(false);
        }
        return () => {
            modalProps.setOpen(false);
        };
    }, [visible]);

    return (
        <ModalInnerContent>
            <div>
                {!cornfirmation && (
                    <>
                        {forWho && <div>egg for: {forWho}</div>}
                        {(address || forWho === "me") && (
                            <div className="address">
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
                        close={() => modalProps.setOpen(false)}
                        giftingSetup={giftingSetup}
                        reset={reset}
                    />
                )}
            </div>
        </ModalInnerContent>
    );
}

export default withModal(GiftModal);
