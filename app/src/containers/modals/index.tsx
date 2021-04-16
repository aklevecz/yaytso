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
}: {
    title: string;
    click: () => void;
}) => (
    <button className="sm" onClick={click}>
        {title}
    </button>
);
