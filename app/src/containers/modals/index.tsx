import React from "react";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

export const ModalInnerContent = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => <div className="modal-inner-content">{children}</div>;

export const ModalParagraph = ({
  children,
}: {
  children: JSX.Element | JSX.Element[] | string;
}) => <div className="modal-paragaph">{children}</div>;

export const ModalButtonWrapper = ({
  children,
  cols = 2,
}: {
  children: JSX.Element | JSX.Element[];
  cols?: number;
}) => <div className={`button-wrapper`}>{children}</div>;

export const SmallButton = ({
  title,
  click,
  addedClass,
  styles,
}: {
  title: string;
  click: () => void;
  addedClass?: string;
  styles?: object;
}) => (
  <button className={`sm ${addedClass}`} style={styles} onClick={click}>
    {title}
  </button>
);

export default function Modal(props: any) {
  const [open, setOpen] = useState(false);
  const [forceClearNonce, setForceClearNonce] = useState(0);

  const forceClear = () => {
    setOpen(false);
    setForceClearNonce(forceClearNonce + 1);
  };

  useEffect(() => {
    const bottomContainer = document.querySelector(
      ".smiler-container"
    ) as HTMLDivElement;

    const previewCanvas = document.querySelector(
      ".preview-canvas"
    ) as HTMLDivElement;

    const blurDef = "blur(3px)";
    const blurContainer = () => {
      if (bottomContainer && previewCanvas) {
        bottomContainer.style.filter = blurDef;
        previewCanvas.style.filter = blurDef;
      }
    };
    const unBlurContainer = () => {
      if (bottomContainer && previewCanvas) {
        bottomContainer.style.filter = "blur(0px)";
        previewCanvas.style.filter = "blur(0px)";
      }
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
          {props.render({ open, setOpen, forceClearNonce })}
        </div>
      </div>
    </div>,
    document.querySelector("#modal-root") as HTMLDivElement
  );
}

export type ModalProps = {
  open: boolean;
  setOpen: (e: boolean) => void;
  forceClearNonce: number;
};

export const withModal = (Component: any) => (props: any) => (
  <Modal
    render={(modalProps: ModalProps) => (
      <Component {...props} modalProps={modalProps} />
    )}
  />
);
