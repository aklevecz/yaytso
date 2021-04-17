import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

export default function Modal(props: any) {
  const [open, setOpen] = useState(false);
  const [forceClearNonce, setForceClearNonce] = useState(0);

  const forceClear = () => setForceClearNonce(forceClearNonce + 1);

  useEffect(() => {
    const appContainer = document.querySelector(
      ".container-of-containerz"
    ) as HTMLDivElement;

    const blurContainer = () => {
      appContainer.style.filter = "blur(3px)";
      appContainer.style.overflow = "hidden";
    };
    const unBlurContainer = () => {
      appContainer.style.filter = "";
      appContainer.style.overflow = "auto";
    };

    if (open) {
      blurContainer();
    } else {
      unBlurContainer();
    }

    return () => unBlurContainer();
  }, [open]);
  console.log(forceClearNonce);
  return ReactDOM.createPortal(
    <div className={`modal-container ${open && "open"}`}>
      <div onClick={forceClear} className="modal-bg"></div>
      <div className="modal-wrapper">
        <div className="modal-content">
          {/* {React.cloneElement(children, { setOpen })} */}
          {props.render({ open, setOpen, forceClearNonce })}
        </div>
      </div>
    </div>,
    document.querySelector("#modal-root") as HTMLDivElement
  );
}

export const withModal = (Component: any) => (props: any) => (
  <Modal
    render={(modalProps: any) => (
      <Component {...props} modalProps={modalProps} />
    )}
  />
);
