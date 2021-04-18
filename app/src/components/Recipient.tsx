import { Recipient as RecipientType, Who } from "..";

export default function Recipient({ recipient }: { recipient: RecipientType }) {
  return (
    <>
      <div className="to-who">
        {recipient.type === Who.FRIEND ? "FRIENDO" : "YOU"}
      </div>
      <div className="to-arrow">{`->`}</div>
    </>
  );
}
