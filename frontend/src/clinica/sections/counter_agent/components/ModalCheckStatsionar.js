import React, {useEffect, useRef, useState} from 'react'
import QRCode from 'qrcode'
import {useReactToPrint} from 'react-to-print'
import CheckStatsionarClient from "../statsionarclients/clientComponents/CheckStatsionarClient";

export const CheckModalStatsionar = ({modal, connector, setModal, baseUrl}) => {
    const [qr, setQr] = useState()

    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })

    useEffect(() => {
        if (connector.client) {
            QRCode.toDataURL(
                `${baseUrl.baseUrl}/clienthistorys/${connector._id}`,
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
            style={{display: 'block'}}
            aria-modal="true"
        >
            <div className="" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5
                            style={{fontSize: '16pt'}}
                            className="modal-title font-weight-bold text-uppercase text-center  w-100"
                            id="customModalLabel"
                        >
                            Qabul cheki!
                        </h5>
                    </div>
                    <div className="modal-body overflow-scroll">
                        <div ref={componentRef}>
                            <CheckStatsionarClient connector={connector} qr={qr}/>
                        </div>
                    </div>
                    <div className="modal-footer custom">
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
                        <div className="divider"/>
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
