import React from "react";

export const Modal = ({ modal, text, setModal, handler, basic }) => {
  return (
    <div
      className={`modal fade show ${modal ? "" : "d-none"}`}
      id="customModal"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="customModalLabel"
      style={{ display: "block" }}
      aria-modal="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5
              style={{ fontSize: "16pt" }}
              className="modal-title font-weight-bold text-uppercase text-center  w-100"
              id="customModalLabel"
            >
              Diqqat!
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
                Bekor qilish
              </button>
            </div>
            <div className="divider" />
            <div className="right-side">
              <button onClick={handler} className="btn btn-link success w-100">
                Tasdiqlash
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
