import {
  ModalButtonWrapper,
  ModalInnerContent,
  ModalParagraph,
  SmallButton,
} from ".";

export default function NoWeb3({ reset }: { reset: () => void }) {
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
