import { Recipient as RecipientType, Who } from "..";
import { SWIGGLE_ARROW } from "./graphical/SWIGGLE_ARROW";

export default function Recipient({ recipient }: { recipient: RecipientType }) {
  return (
    <>
      <div className="to-who">
        {recipient.type === Who.FRIEND ? "FRIENDO" : "YOU"}
      </div>
      <div className="to-arrow">
        <SWIGGLE_ARROW />
      </div>
    </>
  );
}
