import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import { ModalInnerContent, SmallButton } from ".";
import { Context } from "../..";
import { withModal } from "../Modal";
import NoWeb3 from "./NoWeb3";

const Red = ({ children }: { children: JSX.Element | string }) => (
  <span style={{ color: "red" }}>{children}</span>
);

const SendToFriend = ({
  onAddressChange,
  setCornfirmation,
  goBack,
  validFriendAddress,
  invalidFriendAddress,
  error,
}: any) => (
  <>
    <label>
      ok! what is their address?
      <input onChange={onAddressChange} type="text"></input>
    </label>
    {error && <div className="modal-error">{error}</div>}
    <div className="button-wrapper">
      <SmallButton
        click={() => {
          if (!validFriendAddress) {
            return invalidFriendAddress();
          }
          setCornfirmation(true);
        }}
        title="corntinue"
      />
      <SmallButton click={goBack} title="go back" />
    </div>
  </>
);

const FriendOfYourself = ({ forMe, forFriend }: any) => (
  <>
    <div className="modal-paragraph" style={{ textAlign: "center" }}>
      is this egg for you or a friend?
    </div>
    <div className="button-wrapper">
      <button className="sm" onClick={forMe}>
        me!
      </button>
      <button className="sm" onClick={forFriend}>
        a friend!
      </button>
    </div>
  </>
);

const Cornfirm = ({ close, forWho, address, giftingSetup, goBack }: any) => (
  <>
    <div className="modal-paragraph">
      you are sending an egg to{" "}
      <Red>
        {forWho === forWhos.ME ? "your beautiful self" : `a great friend`}
      </Red>
    </div>
    <div className="modal-paragraph address">
      & {forWho === forWhos.ME ? "your" : "their"} address is{" "}
      <Red>{address}</Red>
    </div>
    <div className="button-wrapper">
      <button className="sm" onClick={() => giftingSetup(close)}>
        yep!
      </button>
      <button className="sm" onClick={goBack}>
        go back
      </button>
    </div>
  </>
);

const forWhos = {
  FRIEND: "FRIEND",
  ME: "ME",
};

// TODO: Sanitize inputs
function GiftModal({
  readyToShip,
  visible,
  modalProps,
  setGiftingState,
  transactionCompleted,
}: any) {
  const context = useContext(Context);
  const [forWho, setForWho] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [cornfirmation, setCornfirmation] = useState(false);
  const [validFriendAddress, setValidFriendAddress] = useState(false);
  const [errors, setErrors] = useState({ friend: "" });

  const giftingSetup = (close: any) => {
    context.setRecipient({ address, type: forWho });
    readyToShip();
    close();
  };

  const invalidFriendAddress = () => {
    setErrors({
      ...errors,
      friend: "this is not a valid address-- the heck you think you doing?",
    });
  };

  const onAddressChange = (e: any) => {
    const isValid = ethers.utils.isAddress(e.target.value);
    if (isValid) {
      setValidFriendAddress(true);
      setErrors({ ...errors, friend: "" });
    } else {
      setValidFriendAddress(false);
    }
    setAddress(e.target.value);
  };

  const forMe = () => setForWho(forWhos.ME);
  const forFriend = () => setForWho(forWhos.FRIEND);

  const reset = () => {
    setAddress("");
    setForWho(null);
    setCornfirmation(false);
    setGiftingState("");
  };

  useEffect(() => {
    console.log(forWho);
    if (forWho === forWhos.ME && context.user) {
      console.log("WHAT");
      setCornfirmation(true);
      setAddress(context.user.address);
    }
  }, [forWho]);

  // Anti pattern, but whatever for now
  // it allows the modal bg to close and clear the state
  useEffect(() => {
    reset();
  }, [modalProps.forceClearNonce]);

  // Also pretty fucking janky
  // Maybe I should just make a fucking modal context
  useEffect(() => {
    if (transactionCompleted) {
      reset();
    }
  }, [transactionCompleted]);

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

  if (!context.user) {
    return <NoWeb3 reset={reset} />;
  }

  return (
    <ModalInnerContent>
      <div>
        {!cornfirmation && (
          <>
            {forWho && <div>egg for: {forWho}</div>}
            {(address || forWho === forWhos.ME) && (
              <div className="address">
                address:{" "}
                {forWho === forWhos.ME && context.user
                  ? context.user.address
                  : address}
              </div>
            )}
            {forWho === null && (
              <FriendOfYourself forMe={forMe} forFriend={forFriend} />
            )}
            {forWho === forWhos.FRIEND && (
              <SendToFriend
                onAddressChange={onAddressChange}
                validFriendAddress={validFriendAddress}
                setCornfirmation={setCornfirmation}
                invalidFriendAddress={invalidFriendAddress}
                goBack={() => {
                  setForWho(null);
                  setAddress("");
                  setErrors({ ...errors, friend: "" });
                }}
                error={errors.friend}
              />
            )}
          </>
        )}

        {cornfirmation && (
          <Cornfirm
            forWho={forWho}
            address={
              forWho === forWhos.ME && context.user
                ? context.user.address
                : address
            }
            close={() => modalProps.setOpen(false)}
            giftingSetup={giftingSetup}
            goBack={() => {
              setCornfirmation(false);
              setForWho(null);
              setAddress("");
            }}
            reset={reset}
          />
        )}
      </div>
    </ModalInnerContent>
  );
}

export default withModal(GiftModal);
