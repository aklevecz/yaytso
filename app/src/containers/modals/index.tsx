import React from "react";

export const ModalInnerContent = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => <div className="modal-inner-content">{children}</div>;

export const ModalParagraph = ({
  children,
}: {
  children: React.ReactChildren | string;
}) => <div className="modal-paragaph">{children}</div>;

export const ModalButtonWrapper = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => <div className="button-wrapper">{children}</div>;

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
