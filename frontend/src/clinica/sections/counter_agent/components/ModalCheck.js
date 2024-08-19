import React, { useEffect, useRef, useState } from 'react'
import { Check } from '../offlineclients/clientComponents/Check'
import QRCode from 'qrcode'
import { useReactToPrint } from 'react-to-print'

export const CheckModal = ({ clinica, modal, connector, setModal, baseUrl }) => {
  const [qr, setQr] = useState()

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  useEffect(() => {
    if (connector.client) {
      QRCode.toDataURL(
        `${baseUrl}/clienthistorys/${connector._id}`,
      ).then((data) => {
        setQr(data)
      })
    }
  }, [connector, baseUrl])
  return (
    <div
      className={`modal ${modal ? '' : 'd-none'}`}
      id="customModal"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="customModalLabel"
      style={{ display: 'block' }}
      aria-modal="true"
    >
      <div className="min-h-screen" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5
              style={{ fontSize: '16pt' }}
              className="modal-title font-weight-bold text-uppercase text-center  w-100"
              id="customModalLabel"
            >
              Qabul cheki!
            </h5>
          </div>
          <div className="modal-body overflow-y-scroll">
            <div ref={componentRef}>
              <Check baseUrl={baseUrl} clinica={clinica} connector={connector} qr={qr} />
            </div>
          </div>
          <div className="modal-footer custom bg-white" style={{ transform: "translateY(-50px)" }}>
            <div className="left-side">
              <button
                className="btn btn-link danger w-100"
                data-dismiss="modal"
                onClick={() => {
                  setModal(false)
                }}
              >
                Bekor qilish
              </button>
            </div>
            <div className="divider" />
            <div className="right-side">
              <button
                onClick={() => {
                  handlePrint()
                  setModal(false)
                }}
                className="btn btn-link success w-100"
              >
                Chop etish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
