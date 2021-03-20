import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "..";
import { EMPHATIC } from "../EMPHATIC";
import { HEART } from "../HEART";
import { NICE } from "../NICE";
import { OOPS } from "../OOPS";
import { SMILER } from "../SMILER";
import { YES } from "../YES";

export default function Smiler({ shipState }: { shipState: string }) {
  const context = useContext(Context);
  const [snackState, setSnackState] = useState<string | null>(null);
  const patternRef = useRef(null) as any;
  useEffect(() => {
    if (!patternRef.current && context.pattern) {
      patternRef.current = context.pattern;
      setSnackState("NICE");
    }

    if (patternRef.current && !context.pattern) {
      setSnackState("CLEARED");
    }

    patternRef.current = context.pattern;
  }, [context.pattern]);

  return (
    <div className="smiler-container">
      <div className="smiler-wrapper">
        <SMILER />
        <div className="snack">
          {!shipState && context.pattern && <NICE />}
          {!shipState && snackState === "CLEARED" && <OOPS />}
          {shipState === "PINNING" && <YES />}
          {shipState === "MINTING" && <EMPHATIC />}
          {shipState === "COMPLETE" && <HEART />}
        </div>
      </div>
    </div>
  );
}
