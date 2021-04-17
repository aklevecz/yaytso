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

export const SmallButton = ({
  title,
  click,
  addedClass,
}: {
  title: string;
  click: () => void;
  addedClass?: string;
}) => (
  <button className={`sm ${addedClass}`} onClick={click}>
    {title}
  </button>
);
