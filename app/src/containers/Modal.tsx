import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

export default function Modal(props: any) {
    const [open, setOpen] = useState(true);

    useEffect(() => {
        const appContainer = document.querySelector(
            ".container-of-containerz"
        ) as HTMLDivElement;

        const blurContainer = () => {
            appContainer.style.filter = "blur(3px)";
            appContainer.style.overflow = "hidden"
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

    useEffect(() => {
        if (props.visible) {
            setOpen(true)
        } else {
            setOpen(false)
        }

        return () => {
            setOpen(false)
        }
    },[props.visible])
console.log(open, props.visible)
    return ReactDOM.createPortal(
        <div className={`modal-container ${open && "open"}`}>
            <div className="modal-bg"></div>
            <div className="modal-wrapper">
                <div className="modal-content">
                    {/* {React.cloneElement(children, { setOpen })} */}
                    {props.render({ open, setOpen })}
                </div>
            </div>
        </div>,
        document.querySelector("#modal-root") as HTMLDivElement
    );
}
