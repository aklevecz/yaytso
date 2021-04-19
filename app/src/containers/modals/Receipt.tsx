import { useEffect } from "react";
import { ModalInnerContent, ModalParagraph, ModalProps, withModal } from ".";
import { createPinataURL } from "../../libs/services";
import { Receipt } from "../Create";

const EggGrid = ({
  recipient,
  txHash,
  tokenId,
  metadata,
  svgCID,
  contractAddress,
}: Receipt) => (
  <div className="receipt-grid">
    <div className="receipt-img">
      <img alt="" src={createPinataURL(`ipfs://${svgCID}`)}></img>
    </div>
    <div className="token-id">
      <div style={{ display: "flex" }}>#{tokenId}</div>
    </div>
    <div className="line"></div>
    <div className="receipt-row">
      <div>receipient</div>
      <div>{recipient}</div>
    </div>
    <div className="receipt-row">
      <div>tx</div>
      <div>{txHash}</div>
    </div>
    <div className="receipt-row">
      <div>metadata</div>
      <div>ipfs://{metadata}</div>
    </div>
    <div className="receipt-link">
      <a href={`https://opensea.io/assets/${contractAddress}/${tokenId}`}>
        view on opensea
      </a>
    </div>
    <div className="receipt-link">
      <a href={`http://yaytso.art/#/egg/${tokenId}`}>view on yaytso viewer</a>
    </div>
  </div>
);

type Props = {
  modalProps: ModalProps;
  visible: boolean;
  receipt: Receipt;
};

const ReceiptModal = ({
  modalProps: { open, setOpen },
  visible,
  receipt,
}: Props) => {
  // Boilerplate jANK!!
  useEffect(() => {
    if (visible) {
      setOpen(true);
    } else {
      setOpen(false);
    }
    return () => {
      setOpen(false);
    };
    // eslint-disable-next-line
  }, [visible]);

  return (
    <ModalInnerContent>
      <ModalParagraph>
        <div style={{ marginBottom: 20, fontSize: 40 }}>d[egg]tails</div>
      </ModalParagraph>
      <ModalParagraph>
        {receipt && (
          <EggGrid
            recipient={receipt.recipient}
            txHash={receipt.txHash}
            tokenId={receipt.tokenId}
            metadata={receipt.metadata}
            svgCID={receipt.svgCID}
            contractAddress={receipt.contractAddress}
          />
        )}
      </ModalParagraph>
    </ModalInnerContent>
  );
};

export default withModal(ReceiptModal);
