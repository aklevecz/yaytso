import { ethers } from "ethers";
import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  ModalInnerContent,
  SmallButton,
  ModalProps,
  withModal,
  ModalButtonWrapper,
} from ".";
import { WalletContext } from "../../contexts/WalletContext";
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

const NameEgg = ({
  corntinue,
  goBack,
  onChangeName,
}: {
  corntinue: () => void;
  goBack: () => void;
  onChangeName: (e: any) => void;
}) => (
  <>
    <div className="modal-paragraph" style={{ textAlign: "center" }}>
      please name your beautiful egg
    </div>
    <div>
      <input onChange={onChangeName} type="text"></input>
    </div>
    <ModalButtonWrapper>
      <button className="sm" onClick={goBack}>
        go back
      </button>
      <button className="sm" onClick={corntinue}>
        corntinue
      </button>
    </ModalButtonWrapper>
  </>
);

const DescribeEgg = ({
  corntinue,
  goBack,
  onChangeDesc,
  name,
}: {
  corntinue: () => void;
  goBack: () => void;
  onChangeDesc: (e: any) => void;
  name: string;
}) => (
  <>
    <div className="modal-paragraph" style={{ textAlign: "center" }}>
      lastly <strong>describe</strong> your {name}
    </div>
    <div>
      <input onChange={onChangeDesc} type="text"></input>
    </div>
    <ModalButtonWrapper>
      <button className="sm" onClick={goBack}>
        go back
      </button>
      <button className="sm" onClick={corntinue}>
        corntinue
      </button>
    </ModalButtonWrapper>
  </>
);

const Cornfirm = ({
  close,
  forWho,
  address,
  giftingSetup,
  goBack,
  name,
  desc,
}: {
  close: () => void;
  forWho: string | null;
  address: string;
  giftingSetup: (callback: () => void) => void;
  goBack: () => void;
  name: string;
  desc: string;
}) => (
  <>
    <div className="modal-paragraph">
      you are sending an {name} to{" "}
      <Red>
        {forWho === forWhos.ME ? "your beautiful self" : `a great friend`}
      </Red>
    </div>
    <div className="modal-paragraph">
      <div>{desc}</div>
    </div>
    <div className="modal-paragraph address">
      & {forWho === forWhos.ME ? "your" : "their"} address is{" "}
      <Red>{address}</Red>
    </div>

    <div className="button-wrapper">
      <button className="sm" onClick={goBack}>
        go back
      </button>
      <button className="sm" onClick={() => giftingSetup(close)}>
        yep!
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
  const context = useContext(WalletContext);
  const [forWho, setForWho] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [nameStep, setNameStep] = useState(false);
  const [name, setName] = useState("");
  const [descStep, setDescStep] = useState(false);
  const [desc, setDesc] = useState("");
  const [cornfirmation, setCornfirmation] = useState(false);
  const [validFriendAddress, setValidFriendAddress] = useState(false);
  const [errors, setErrors] = useState({ friend: "" });

  const giftingSetup = (close: () => void) => {
    context.setRecipient({ address, type: forWho, desc, eggName: name });
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

  const onChangeName = (e: any) => setName(e.target.value);

  const onChangeDesc = (e: any) => setDesc(e.target.value);

  const reset = useCallback(() => {
    setAddress("");
    setForWho(null);
    setCornfirmation(false);
    setGiftingState("");
  }, [setGiftingState]);

  useEffect(() => {
    if (forWho === forWhos.ME && context.user) {
      setNameStep(true);
      setAddress(context.user.address);
    }
  }, [forWho, context.user]);

  useEffect(() => {
    if (transactionCompleted) {
      reset();
    }
  }, [transactionCompleted, reset]);

  useEffect(() => {
    if (!modalProps.open) {
      reset();
    }
  }, [modalProps, reset]);

  if (!context.user || !context.user.address) {
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
            {descStep && name && <div>named: {name}</div>}
            {forWho === null && (
              <FriendOfYourself forMe={forMe} forFriend={forFriend} />
            )}
            {forWho === forWhos.FRIEND && !nameStep && !descStep && (
              <SendToFriend
                onAddressChange={onAddressChange}
                validFriendAddress={validFriendAddress}
                setCornfirmation={setNameStep}
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
        {nameStep && !descStep && !cornfirmation && (
          <NameEgg
            corntinue={() => setDescStep(true)}
            onChangeName={onChangeName}
            goBack={() => {
              setForWho(null);
              setAddress("");
              setNameStep(false);
            }}
          />
        )}
        {descStep && !cornfirmation && (
          <DescribeEgg
            corntinue={() => setCornfirmation(true)}
            onChangeDesc={onChangeDesc}
            name={name}
            goBack={() => {
              setDescStep(false);
            }}
          />
        )}
        {cornfirmation && (
          <Cornfirm
            forWho={forWho}
            address={
              forWho === forWhos.ME && context.user
                ? context.user.address
                : address
            }
            name={name}
            desc={desc}
            close={() => modalProps.setOpen(false)}
            giftingSetup={giftingSetup}
            goBack={() => {
              setCornfirmation(false);
              setDescStep(true);
            }}
          />
        )}
      </div>
    </ModalInnerContent>
  );
}

export default withModal(GiftModal);
