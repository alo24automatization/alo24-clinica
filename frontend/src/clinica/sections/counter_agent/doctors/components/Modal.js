import React from "react";
import {useTranslation} from "react-i18next";

export const Modal = ({modal, text, setModal, handler, basic}) => {
    const {t} = useTranslation();
    const [isDisabled, setIsDisabled] = React.useState(false);
    const handleHandler = async (func, ...args) => {
        setIsDisabled(true);
        try {
            return await func(args);
        }
        finally {
            setIsDisabled(false);
        }
    }
    return (
        <div
            className={`modal fade show ${modal ? "" : "d-none"}`}
            id="customModal"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="customModalLabel"
            style={{display: "block"}}
            aria-modal="true"
        >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5
                            style={{fontSize: "16pt"}}
                            className="modal-title font-weight-bold text-uppercase text-center  w-100"
                            id="customModalLabel"
                        >
                            {t("Diqqat!")}
                        </h5>
                    </div>
                    <div className="modal-body">
                        <div className="text-center">
                            <div
                                className="mb-3"
                                style={{
                                    fontSize: "14pt",
                                }}
                            >
                                <span className="text-danger font-weight-bold">{basic} </span>
                                {text}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer custom">
                        <div className="left-side">
                            <button
                                className="btn btn-link danger w-100"
                                data-dismiss="modal"
                                onClick={() => setModal(false)}
                            >
                                {t("Bekor qilish")}
                            </button>
                        </div>
                        <div className="divider"/>
                        <div className="right-side">
                            <button onClick={async (...args) => handleHandler(handler, ...args)} disabled={isDisabled} className="btn btn-link success w-100">
                                {t("Tasdiqlash")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
