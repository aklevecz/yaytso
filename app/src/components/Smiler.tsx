import { shipStates } from "../containers/Create";
import { EMPHATIC } from "./graphical/EMPHATIC";
import { HEART } from "./graphical/HEART";
import { NICE } from "./graphical/NICE";
import { SMILER } from "./graphical/SMILER";
import { YES } from "./graphical/YES";

export default function Smiler({
  shipState,
  isPattern,
}: {
  shipState: string;
  isPattern: boolean;
}) {
  return (
    <div className="smiler-container">
      <div className="smiler-wrapper">
        <SMILER />
        <div className="snack">
          {!shipState && isPattern && <NICE />}
          {shipState === shipStates.PINNING && <YES />}
          {shipState === shipStates.MINTING && <EMPHATIC />}
          {shipState === shipStates.COMPLETE && <HEART />}
        </div>
      </div>
    </div>
  );
}
