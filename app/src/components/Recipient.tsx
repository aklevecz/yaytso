import { Recipient as RecipientType, Who } from "..";
import { SWIGGLE_ARROW } from "./graphical/SWIGGLE_ARROW";

export default function Recipient({
  isSending,
  recipient,
}: {
  isSending: boolean;
  recipient: RecipientType;
}) {
  return (
    <>
      <div className="to-who">
        {recipient.type === Who.FRIEND ? "FRIENDO" : "YOU"}
      </div>
      <div className={`to-arrow ${isSending ? "sending" : ""}`}>
        <SWIGGLE_ARROW />
      </div>
    </>
  );
}
