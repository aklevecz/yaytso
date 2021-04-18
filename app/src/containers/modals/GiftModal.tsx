import { ethers } from "ethers";
import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ModalInnerContent, SmallButton } from ".";
import { Context } from "../..";
import { ModalProps, withModal } from "../Modal";
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
}: {
  onAddressChange: (e: ChangeEvent<HTMLInputElement>) => void;
  setCornfirmation: (e: boolean) => void;
  goBack: () => void;
  validFriendAddress: boolean;
  invalidFriendAddress: () => void;
  error: string;
}) => (
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

const FriendOfYourself = ({
  forMe,
  forFriend,
}: {
  forMe: () => void;
  forFriend: () => void;
}) => (
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

const Cornfirm = ({
  close,
  forWho,
  address,
  giftingSetup,
  goBack,
}: {
  close: () => void;
  forWho: string | null;
  address: string;
  giftingSetup: (callback: () => void) => void;
  goBack: () => void;
}) => (
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

type Props = {
  readyToShip: () => void;
  visible: boolean;
  modalProps: ModalProps;
  setGiftingState: (e: string) => void;
  transactionCompleted: boolean;
};

function GiftModal({
  readyToShip,
  visible,
  modalProps,
  setGiftingState,
  transactionCompleted,
}: Props) {
  const context = useContext(Context);
  const [forWho, setForWho] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [cornfirmation, setCornfirmation] = useState(false);
  const [validFriendAddress, setValidFriendAddress] = useState(false);
  const [errors, setErrors] = useState({ friend: "" });

  const giftingSetup = (close: () => void) => {
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

  const onAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const reset = useCallback(() => {
    setAddress("");
    setForWho(null);
    setCornfirmation(false);
    setGiftingState("");
  }, [setGiftingState]);

  useEffect(() => {
    if (forWho === forWhos.ME && context.user) {
      setCornfirmation(true);
      setAddress(context.user.address);
    }
  }, [forWho, context.user]);

  // ANIT PATTERN LAND :D
  /**** */
  // Anti pattern, but whatever for now
  // it allows the modal bg to close and clear the state
  useEffect(() => {
    reset();
  }, [modalProps.forceClearNonce, reset]);

  // Also pretty fucking janky
  useEffect(() => {
    if (transactionCompleted) {
      reset();
    }
  }, [transactionCompleted, reset]);

  // modalProps is side effect heavy
  useEffect(() => {
    if (visible) {
      modalProps.setOpen(true);
    } else {
      modalProps.setOpen(false);
    }
    return () => {
      modalProps.setOpen(false);
    };
    // eslint-disable-next-line
  }, [visible]);
  // END OF LITTLE ANTI PATTERN LAND :D
  // **********************************

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
          />
        )}
      </div>
    </ModalInnerContent>
  );
}

export default withModal(GiftModal);
