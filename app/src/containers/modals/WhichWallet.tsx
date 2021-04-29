import { useEffect } from "react";
import {
  ModalButtonWrapper,
  ModalInnerContent,
  ModalParagraph,
  ModalProps,
  withModal,
} from ".";
import { METAMASK_LOGO } from "../../components/graphical/METAMASK_LOGO";
import { WALLETCONNECT_ICON } from "../../components/graphical/WALLETCONNECT_ICON";

type Props = {
  modalProps: ModalProps;
  visible: boolean;
  setPickWallet: (visible: boolean) => void;
  connectMetamask: () => void;
  connectWalletConnect: () => void;
};

const WhichWallet = ({
  modalProps: { open },
  setPickWallet,
  connectMetamask,
  connectWalletConnect,
}: Props) => {
  useEffect(() => {
    if (!open) setPickWallet(false);
  }, [open, setPickWallet]);

  return (
    <ModalInnerContent>
      <ModalParagraph>
        <div style={{ marginBottom: 20, fontSize: 40, textAlign: "center" }}>
          which wallet?
        </div>
      </ModalParagraph>
      <ModalParagraph>
        <ModalButtonWrapper>
          <button style={{ flex: "0 0 100%" }} onClick={connectMetamask}>
            <div className="inner-icon-button">
              <div style={{ width: 50, height: 50 }}>
                <METAMASK_LOGO />
              </div>
              <div style={{ textAlign: "left", fontSize: "1.2rem" }}>
                Metamask
              </div>
            </div>
          </button>
          <button
            style={{ flex: "0 0 100%", marginTop: 20 }}
            onClick={connectWalletConnect}
          >
            <div className="inner-icon-button">
              <div style={{ width: 50, height: 50 }}>
                <WALLETCONNECT_ICON />
              </div>
              <div style={{ textAlign: "left", fontSize: "1.2rem" }}>
                Wallet Connect
              </div>
            </div>
          </button>
        </ModalButtonWrapper>
      </ModalParagraph>
    </ModalInnerContent>
  );
};

export default withModal(WhichWallet);
