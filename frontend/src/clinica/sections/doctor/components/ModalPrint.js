import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useReactToPrint } from "react-to-print";
import Print from "./Print";

const ModalPrint = ({ services, modal, setModal, connector, client, baseUrl, clinica, qr, doctor }) => {

    const { t } = useTranslation()

    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: client && client?.firstname + ' ' + client?.lastname,
    })

    const [sections, setSections] = useState([])

    return <div
        className={`modal fade show ${modal ? "" : "d-none"}`}
        id="customModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="customModalLabel"
        style={{ display: "block", zIndex: 1000 }}
        aria-modal="true"
    >
        <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-body">
                    <div>
                        <h3 className="text-[18px] mb-2 font-bold">{t("Chop etiluvchi xulosani tanlang")}:</h3>
                        <div className="flex flex-col">
                            {services.map((service, ind) => <button key={ind} className=" mb-2 btn btn-info px-2" onClick={() => {
                                setSections([...services].filter(s => s._id === service._id))
                                setTimeout(() => {
                                    handlePrint()
                                }, 1000)
                            }} >{service?.service?.name}</button>)}
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
                    <div className="divider" />
                    <div className="right-side">
                        <button onClick={() => {
                            setSections([...services])
                            setTimeout(() => {
                                handlePrint()
                            }, 1000)
                        }} className="btn btn-link success w-100">
                            {t("Barchasini chop etish")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div className="d-none">
            <div
                ref={componentRef}
                className="px-[2cm] py-2 none"
                style={{ fontFamily: "times" }}
            >
                <Print
                    doctor={doctor}
                    connector={connector}
                    client={client}
                    sections={sections}
                    clinica={clinica}
                    baseUrl={baseUrl}
                    qr={qr}
                />
            </div>
        </div>
    </div>
}

export default ModalPrint;