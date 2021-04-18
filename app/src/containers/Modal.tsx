import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

export default function Modal(props: any) {
  const [open, setOpen] = useState(false);
  const [forceClearNonce, setForceClearNonce] = useState(0);

  const forceClear = () => {
    setForceClearNonce(forceClearNonce + 1);
  };

  useEffect(() => {
    const appContainer = document.querySelector(
      ".container-of-containerz"
    ) as HTMLDivElement;

    const bottomContainer = document.querySelector(
      ".smiler-container"
    ) as HTMLDivElement;
    const navContainer = document.querySelector(
      ".nav-container"
    ) as HTMLDivElement;
    const previewCanvas = document.querySelector(
      ".preview-canvas"
    ) as HTMLDivElement;

    const blurDef = "blur(3px)";
    const blurContainer = () => {
      // appContainer.style.filter = blurDef
      bottomContainer.style.filter = blurDef;
      previewCanvas.style.filter = blurDef;
      // appContainer.style.overflow = "hidden";
    };
    const unBlurContainer = () => {
      // appContainer.style.filter = "";
      bottomContainer.style.filter = "blur(0px)";
      previewCanvas.style.filter = "blur(0px)";
      // appContainer.style.overflow = "auto";
    };

    if (open) {
      blurContainer();
    } else {
      unBlurContainer();
    }

    return () => unBlurContainer();
  }, [open]);

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
