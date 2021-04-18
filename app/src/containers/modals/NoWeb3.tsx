import { useEffect } from "react";
import {
  ModalButtonWrapper,
  ModalInnerContent,
  ModalParagraph,
  SmallButton,
} from ".";
import { withModal } from "../Modal";

// This is a component that takes a reset prop
// May want to generalize this stuff...
export default function NoWeb3({ reset }: any) {
  // This is also pretty dumb
  //   const reset = () => {
  //     setGiftingState("");
  //   };
  // Anti pattern, but whatever for now
  // it allows the modal bg to close and clear the state
  // with the caveat that the modal is rendered before it is displayed
  // and visibility is controlled by the behavior below
  //   useEffect(() => {
  //     reset();
  //   }, [modalProps.forceClearNonce]);

  //   useEffect(() => {
  //     if (visible) {
  //       modalProps.setOpen(true);
  //     } else {
  //       modalProps.setOpen(false);
  //     }
  //   }, [visible]);
  //   console.log("dog shit");

  return (
    <ModalInnerContent>
      <ModalParagraph>
        sorry bucko, but you need to be connected to web3 in order to mail your
        egg
      </ModalParagraph>
      <ModalButtonWrapper>
        <SmallButton title="Um ok?" click={reset} />
      </ModalButtonWrapper>
    </ModalInnerContent>
  );
}

// export default withModal(NoWeb3);
